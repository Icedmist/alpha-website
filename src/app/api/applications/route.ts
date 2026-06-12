import { auth } from '../../../lib/auth';
import { db } from '../../../lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

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
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionData.user.id;
    const body = await req.json();

    const { phone, location, program, background, experience, reason } = body;

    if (!program) {
      return NextResponse.json({ error: 'Program is required' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const courseId = mapProgramToCourseId(program);

    const application = {
      userId,
      name: sessionData.user.name,
      email: sessionData.user.email,
      phone: phone || '',
      location: location || '',
      program,
      courseId,
      background: background || '',
      experience: experience || '',
      reason: reason || '',
      submittedAt: timestamp,
      status: 'approved', // Automatically approved to grant direct course access
    };

    // Save application in the 'applications' collection
    await db.collection('applications').doc(userId).set(application);

    // Enroll the student in their selected course
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data() || {};
    const enrolled = userData.enrolledCourses || [];

    if (!enrolled.includes(courseId)) {
      enrolled.push(courseId);
    }

    const updatedProfile = {
      ...userData,
      name: sessionData.user.name,
      email: sessionData.user.email,
      phone: phone || userData.phone || '',
      enrolledCourses: enrolled,
      role: userData.role || 'student',
      updatedAt: timestamp,
    };

    await db.collection('users').doc(userId).set(updatedProfile);

    // Log the enrollment activity
    await db.collection('activities').add({
      userId,
      userName: sessionData.user.name,
      action: 'Course Enrollment',
      details: `Enrolled in course: ${courseId} via Academy Application`,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      application,
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
