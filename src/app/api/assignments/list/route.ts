import { db, adminAuth } from '../../../../lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
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

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userData.role === 'student') {
      // Students see their broadcast assignments
      return NextResponse.json(userData.broadcastAssignments || []);
    } else if (userData.role === 'instructor') {
      // Instructors see assignments they created
      const snapshot = await db.collection('assignments')
        .where('instructorId', '==', userId)
        .get();
      
      const assignments: any[] = [];
      snapshot.forEach((doc) => {
        assignments.push({ id: doc.id, ...doc.data() });
      });
      
      return NextResponse.json(assignments);
    } else if (userData.role === 'admin') {
      // Admins see all assignments
      const snapshot = await db.collection('assignments').get();
      const assignments: any[] = [];
      snapshot.forEach((doc) => {
        assignments.push({ id: doc.id, ...doc.data() });
      });
      return NextResponse.json(assignments);
    }

    return NextResponse.json([]);
  } catch (error: any) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
