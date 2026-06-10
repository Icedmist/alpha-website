import { db } from '../../../../lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const cleanedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const subDocRef = db.collection('newsletter').doc(cleanedEmail);
    const subDoc = await subDocRef.get();

    if (subDoc.exists) {
      return NextResponse.json({ error: 'This email is already subscribed!' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Save newsletter subscription
    await subDocRef.set({
      email: cleanedEmail,
      subscribedAt: timestamp,
    });

    // Log this system activity globally
    await db.collection('activities').add({
      action: 'Newsletter Subscription',
      details: `Email subscribed to newsletter: ${cleanedEmail}`,
      timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
