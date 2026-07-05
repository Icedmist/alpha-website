import { NextResponse } from 'next/server';
import { adminAuth, db } from '../../../lib/firebase-admin';
import { resend } from '../../../lib/resend';
import { render } from '@react-email/render';
import ReferralEmail from '../../../emails/ReferralEmail';
import { headers } from 'next/headers';

import React from 'react';

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Get referrer name
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const referrerName = userDoc.data()?.name || 'A friend';

    const { friendEmail, friendName } = await req.json();

    if (!friendEmail) {
      return NextResponse.json({ error: 'Friend email is required' }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });
    }

    const emailHtml = await render(React.createElement(ReferralEmail, { friendName: friendName || 'Friend', referrerName }));

    await resend.emails.send({
      from: 'Alpha Spark Academy <no-reply@alphaspark.ng>',
      to: friendEmail,
      subject: `${referrerName} invited you to Alpha Spark Academy!`,
      html: emailHtml,
    });
    
    // Record the referral
    await db.collection('referrals').add({
      referrerId: decodedToken.uid,
      referrerName,
      friendEmail,
      friendName,
      timestamp: new Date().toISOString(),
      status: 'invited'
    });

    return NextResponse.json({ success: true, message: 'Referral sent' });
  } catch (error: any) {
    console.error('Error sending referral:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
