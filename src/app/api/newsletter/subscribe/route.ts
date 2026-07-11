import { db } from '../../../../lib/firebase-admin';
import { resend } from '../../../../lib/resend';
import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import WelcomeEmail from '../../../../emails/WelcomeEmail';
import React from 'react';

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

    // Send welcome email automatically
    if (resend) {
      try {
        const emailHtml = await render(
          React.createElement(WelcomeEmail, { firstName: 'Future Innovator' })
        );

        await resend.emails.send({
          from: 'Alpha Spark Academy <no-reply@alphaspark.ng>',
          to: cleanedEmail,
          subject: 'Welcome to Alpha Spark Academy!',
          html: emailHtml,
        });
      } catch (emailErr) {
        console.error('Failed to send welcome email:', emailErr);
        // Don't fail the subscription if email fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
