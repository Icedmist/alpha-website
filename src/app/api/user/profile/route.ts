import { auth } from '../../../../lib/auth';
import { db } from '../../../../lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionData.user.id;

    // Fetch the tenant-isolated Firestore profile document
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      // For new users, initialize and return a default profile skeleton
      const defaultProfile = {
        name: sessionData.user.name,
        email: sessionData.user.email,
        phone: '',
        role: 'student', // Default role
        enrolledCourses: [],
        completedLessons: [],
        quizScores: {},
        submissions: [],
        attendanceDates: [],
        createdAt: new Date().toISOString(),
      };

      // Store in isolated Firestore instance
      await db.collection('users').doc(userId).set(defaultProfile);

      return NextResponse.json({
        id: userId,
        ...defaultProfile,
      });
    }

    return NextResponse.json({
      id: userId,
      ...userDoc.data(),
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionData.user.id;
    const body = await req.json();

    let targetUserId = userId;
    
    // If the request targets a different user's profile, check privileges
    if (body.targetUserId && body.targetUserId !== userId) {
      const callerDoc = await db.collection('users').doc(userId).get();
      const callerData = callerDoc.data();
      
      if (!callerData || (callerData.role !== 'admin' && callerData.role !== 'instructor')) {
        return NextResponse.json(
          { error: 'Forbidden: Admin or Instructor privileges required' },
          { status: 403 }
        );
      }
      targetUserId = body.targetUserId;
    }

    // Prevent overwriting core identity fields managed by Better Auth in postgres
    const { id, email, targetUserId: _, ...updatableFields } = body;

    // Fetch existing data for comparison and logging
    const oldDoc = await db.collection('users').doc(targetUserId).get();
    const oldData = oldDoc.data() || {};
    const timestamp = new Date().toISOString();

    // 1. Check Course Enrollment changes
    const oldEnrolled = oldData.enrolledCourses || [];
    const newEnrolled = updatableFields.enrolledCourses || [];
    const addedEnrolled = newEnrolled.filter((c: string) => !oldEnrolled.includes(c));
    for (const courseId of addedEnrolled) {
      await db.collection('activities').add({
        userId: targetUserId,
        userName: oldData.name || updatableFields.name || 'User',
        action: 'Course Enrollment',
        details: `Enrolled in course: ${courseId}`,
        timestamp,
      });
    }

    // 2. Check Submissions changes (submissions and grading)
    const oldSubmissions = oldData.submissions || [];
    const newSubmissions = updatableFields.submissions || [];
    for (const sub of newSubmissions) {
      const matchingOld = oldSubmissions.find((s: any) => s.lessonId === sub.lessonId);
      if (!matchingOld) {
        await db.collection('activities').add({
          userId: targetUserId,
          userName: oldData.name || updatableFields.name || 'User',
          action: 'Assignment Submission',
          details: `Submitted assignment '${sub.assignmentTitle || sub.lessonId}' for course '${sub.courseId}'`,
          timestamp,
        });
      } else if (matchingOld.status === 'pending' && sub.status === 'graded') {
        await db.collection('activities').add({
          userId: targetUserId,
          userName: oldData.name || updatableFields.name || 'User',
          action: 'Assignment Graded',
          details: `Graded assignment '${sub.assignmentTitle || sub.lessonId}' with score ${sub.score}`,
          timestamp,
        });
      }
    }

    // 3. Check Role changes
    const oldRole = oldData.role;
    const newRole = updatableFields.role;
    if (oldRole && newRole && oldRole !== newRole) {
      await db.collection('activities').add({
        userId: targetUserId,
        userName: oldData.name || updatableFields.name || 'User',
        action: 'Role Updated',
        details: `Role updated from '${oldRole}' to '${newRole}'`,
        timestamp,
      });
    }

    // 4. Check Certificate issuance
    const oldCerts = oldData.issuedCertificates || [];
    const newCerts = updatableFields.issuedCertificates || [];
    const addedCerts = newCerts.filter((c: string) => !oldCerts.includes(c));
    for (const courseId of addedCerts) {
      await db.collection('activities').add({
        userId: targetUserId,
        userName: oldData.name || updatableFields.name || 'User',
        action: 'Certificate Issued',
        details: `Issued verified graduation certificate for course: ${courseId}`,
        timestamp,
      });
    }

    // Save/update the fields in the isolated custom Firestore instance
    await db.collection('users').doc(targetUserId).set(
      {
        ...updatableFields,
        updatedAt: timestamp,
      },
      { merge: true }
    );

    // Fetch the updated profile to return it
    const updatedDoc = await db.collection('users').doc(targetUserId).get();

    return NextResponse.json({
      id: targetUserId,
      ...updatedDoc.data(),
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
