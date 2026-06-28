import { db, adminAuth } from '../../../../lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const reqHeaders = await headers();
    const authHeader = reqHeaders.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!adminAuth) throw new Error('Firebase adminAuth not initialized');
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

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
