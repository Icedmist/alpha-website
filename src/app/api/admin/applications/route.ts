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

    // Fetch the caller's profile to verify they are an Admin or Instructor
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || (userData.role !== 'admin' && userData.role !== 'instructor')) {
      return NextResponse.json(
        { error: 'Forbidden: Admin or Instructor privileges required' },
        { status: 403 }
      );
    }

    // Fetch all applications
    const snapshot = await db
      .collection('applications')
      .orderBy('submittedAt', 'desc')
      .get();

    const applications: any[] = [];
    snapshot.forEach((doc: any) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json(applications);
  } catch (error: any) {
    console.error('Error fetching student applications:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
