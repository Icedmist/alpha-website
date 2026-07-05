import { db, adminAuth } from '../../../lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { resend } from '../../../lib/resend';
import { render } from '@react-email/render';
import WelcomeEmail from '../../../emails/WelcomeEmail';
import React from 'react';

const mapProgramToCourseId = (program: string): string => {
  const p = program.toLowerCase();
  if (p.includes('fintech') || p.includes('financial')) return 'fintech';
  if (p.includes('full stack') || p.includes('web development')) return 'fullstack-web';
  if (p.includes('graphic') || p.includes('design')) {
    if (p.includes('ui/ux') || p.includes('ui')) return 'ui-ux';
    return 'graphic-design';
  }
  if (p.includes('cybersecurity') || p.includes('security')) return 'cybersecurity';
  if (p.includes('digital marketing') || p.includes('marketing')) return 'digital-marketing';
  if (p.includes('data science') || p.includes('analytics') || p.includes('data')) return 'data-analytics';
  if (p.includes('ai & machine') || p.includes('machine learning') || p.includes('ai')) return 'ai-ml';
  if (p.includes('productivity') || p.includes('ai tools')) return 'ai-productivity';
  if (p.includes('smartphone') || p.includes('content creation')) return 'smartphone-content';
  if (p.includes('entrepreneurship') || p.includes('startup')) return 'entrepreneurship';
  if (p.includes('cloud') || p.includes('computing') || p.includes('devops')) return 'cloud-computing';
  return 'fullstack-web';
};

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const authHeader = reqHeaders.get('Authorization');
    
    let userId = '';
    let userEmail = '';
    let userName = '';
    let isAuthenticated = false;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      if (adminAuth) {
        try {
          const decodedToken = await adminAuth.verifyIdToken(token);
          userId = decodedToken.uid;
          userEmail = decodedToken.email || '';
          userName = decodedToken.name || userEmail.split('@')[0];
          isAuthenticated = true;
        } catch (err) {
          console.warn("Invalid auth token on application submission", err);
        }
      }
    }
    
    const body = await req.json();
    const { firstName, lastName, email, phone, location, program, background, experience, reason } = body;

    if (!program) {
      return NextResponse.json({ error: 'Program is required' }, { status: 400 });
    }

    if (!isAuthenticated) {
      userName = `${firstName || ''} ${lastName || ''}`.trim() || 'Anonymous Applicant';
      userEmail = email || '';
    }

    if (!userEmail && !isAuthenticated) {
      return NextResponse.json({ error: 'Email is required for application' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const courseId = mapProgramToCourseId(program);

    const docRef = isAuthenticated && userId ? db.collection('applications').doc(userId) : db.collection('applications').doc();

    const application = {
      userId: userId || docRef.id,
      name: userName,
      email: userEmail,
      phone: phone || '',
      location: location || '',
      program,
      courseId,
      background: background || '',
      experience: experience || '',
      reason: reason || '',
      submittedAt: timestamp,
      status: isAuthenticated ? 'approved' : 'pending',
    };

    // Save application in the 'applications' collection
    await docRef.set(application);

    // Send Emails using Resend
    if (resend && userEmail) {
      try {
        const emailHtml = await render(React.createElement(WelcomeEmail, { firstName: userName.split(' ')[0] }));

        // Email to applicant
        await resend.emails.send({
          from: 'Alpha Spark Academy <no-reply@resend.dev>', // Will need verified domain in production
          to: userEmail,
          subject: 'Welcome to Alpha Spark Academy',
          html: emailHtml
        });

        // Email to admin
        await resend.emails.send({
          from: 'Alpha Spark Notifications <no-reply@resend.dev>',
          to: 'admissions@alphaspark.com', // Change to actual admin email
          subject: `New Academy Application: ${program}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>New Application Received</h2>
              <p><strong>Applicant:</strong> ${userName}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Location:</strong> ${location || 'N/A'}</p>
              <p><strong>Track:</strong> ${program}</p>
              <p><strong>Background:</strong> ${background || 'N/A'}</p>
              <p><strong>Experience:</strong> ${experience || 'N/A'}</p>
              <p><strong>Reason for joining:</strong> ${reason || 'N/A'}</p>
            </div>
          `
        });
      } catch (err) {
        console.error('Error sending application emails via Resend:', err);
      }
    }

    if (isAuthenticated) {
      // Enroll the student in their selected course
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data() || {};
      const enrolled = userData.enrolledCourses || [];

      if (!enrolled.includes(courseId)) {
        enrolled.push(courseId);
      }

      const updatedProfile = {
        ...userData,
        name: userName,
        email: userEmail,
        phone: phone || userData.phone || '',
        enrolledCourses: enrolled,
        role: userData.role || 'student',
        updatedAt: timestamp,
      };

      await db.collection('users').doc(userId).set(updatedProfile);

      // Log the enrollment activity
      await db.collection('activities').add({
        userId,
        userName: userName,
        action: 'Course Enrollment',
        details: `Enrolled in course: ${courseId} via Academy Application`,
        timestamp,
      });

      return NextResponse.json({
        success: true,
        application,
        profile: updatedProfile,
      });
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
