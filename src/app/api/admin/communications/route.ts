import { NextResponse } from 'next/server';
import { adminAuth, db } from '../../../../lib/firebase-admin';
import { resend } from '../../../../lib/resend';
import { render } from '@react-email/render';
import NewsletterEmail from '../../../../emails/NewsletterEmail';
import ReferralEmail from '../../../../emails/ReferralEmail';
import WelcomeEmail from '../../../../emails/WelcomeEmail';
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
    
    // Verify admin role
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { emailType = 'newsletter', subject, title, content, emails, friendName, referrerName, firstName } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'Missing required emails' }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });
    }

    let emailHtml = '';

    if (emailType === 'referral') {
      if (!friendName || !referrerName) {
        return NextResponse.json({ error: 'Missing referral fields' }, { status: 400 });
      }
      emailHtml = await render(React.createElement(ReferralEmail, { friendName, referrerName }));
    } else if (emailType === 'welcome') {
      emailHtml = await render(React.createElement(WelcomeEmail, { firstName: firstName || 'Future Innovator' }));
    } else {
      // Both newsletter and manual use the NewsletterEmail template
      if (!subject || !content) {
        return NextResponse.json({ error: 'Missing required fields for newsletter/manual email' }, { status: 400 });
      }
      emailHtml = await render(React.createElement(NewsletterEmail, { subject, title: title || subject, content }));
    }

    // Resend allows up to 50 emails in a single batch request (or we can just loop if > 50, but let's keep it simple for now)
    const MAX_BATCH_SIZE = 50;
    
    // Process in batches
    for (let i = 0; i < emails.length; i += MAX_BATCH_SIZE) {
      const batch = emails.slice(i, i + MAX_BATCH_SIZE);
      
      await resend.emails.send({
        from: 'Alpha Spark Academy <no-reply@resend.dev>', // In production, use a verified domain
        to: batch,
        subject: emailType === 'referral' 
          ? `${referrerName} invited you to Alpha Spark Academy!` 
          : emailType === 'welcome' 
            ? (subject || 'Welcome to Alpha Spark Academy!') 
            : subject,
        html: emailHtml,
      });
    }

    return NextResponse.json({ success: true, message: `Sent to ${emails.length} recipients` });
  } catch (error: any) {
    console.error('Error sending communications:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
