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
