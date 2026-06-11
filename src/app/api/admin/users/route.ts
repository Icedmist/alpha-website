import { auth } from '../../../../lib/auth';
import { db } from '../../../../lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { db as pgDb } from '../../../../db';
import { user as userTable } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch caller's profile to verify role (admin or instructor)
    const callerDoc = await db.collection('users').doc(sessionData.user.id).get();
    const callerData = callerDoc.data();

    if (
      !callerData ||
      (callerData.role !== 'admin' && callerData.role !== 'instructor')
    ) {
      return NextResponse.json(
        { error: 'Forbidden: Admin or Instructor privileges required' },
        { status: 403 }
      );
    }

    // Retrieve all user profiles from the custom Firestore instance
    const snapshot = await db.collection('users').get();
    const users: any[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        role: data.role || 'student',
        enrolledCourses: data.enrolledCourses || [],
        completedLessons: data.completedLessons || [],
        quizScores: data.quizScores || {},
        submissions: data.submissions || [],
        attendanceDates: data.attendanceDates || [],
      });
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching all users:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch caller's profile to verify role (must be admin)
    const callerDoc = await db.collection('users').doc(sessionData.user.id).get();
    const callerData = callerDoc.data();

    if (!callerData || callerData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin privileges required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Do not allow admin to delete themselves
    if (targetUserId === sessionData.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own admin account' },
        { status: 400 }
      );
    }

    // 1. Delete from Firestore
    await db.collection('users').doc(targetUserId).delete();

    // 2. Delete from Postgres
    await pgDb.delete(userTable).where(eq(userTable.id, targetUserId));

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
