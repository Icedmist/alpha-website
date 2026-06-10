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

    // Verify admin role
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin privileges required' },
        { status: 403 }
      );
    }

    // Retrieve subscribers
    const snapshot = await db
      .collection('newsletter')
      .orderBy('subscribedAt', 'desc')
      .limit(100)
      .get();

    const subscribers: any[] = [];
    snapshot.forEach((doc) => {
      subscribers.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json(subscribers);
  } catch (error: any) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
