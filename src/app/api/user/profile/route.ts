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

    // Save/update the fields in the isolated custom Firestore instance
    await db.collection('users').doc(targetUserId).set(
      {
        ...updatableFields,
        updatedAt: new Date().toISOString(),
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
