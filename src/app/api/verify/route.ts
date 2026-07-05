import { db } from '../../../lib/firebase-admin';
import { NextResponse } from 'next/server';

/**
 * GET /api/verify?id=AS-WEBDEV-XXXXXX
 * 
 * Public endpoint — no authentication required.
 * Looks up all users in Firestore, finds one whose issuedCertificates array
 * contains a course ID matching the certificate ID pattern, and returns
 * the graduate's public details.
 * 
 * Certificate ID format: AS-{COURSE_ID}-{USER_ID_SUFFIX}
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const certId = searchParams.get('id');

    if (!certId) {
      return NextResponse.json(
        { error: 'Please provide a certificate ID to verify.' },
        { status: 400 }
      );
    }

    // Parse the certificate ID format: AS-{COURSE_ID}-{USER_ID_SUFFIX}
    // Example: AS-WEBDEV-CKUSER123ABC
    const parts = certId.split('-');
    if (parts.length < 3 || parts[0] !== 'AS') {
      return NextResponse.json(
        { error: 'This doesn\'t look like a valid Alpha Spark certificate ID. It should start with "AS-".' },
        { status: 400 }
      );
    }

    // The course ID is the middle part(s), user suffix is the last part
    // Handle cases where course ID itself might contain hyphens
    const courseIdPart = parts.slice(1, -1).join('-');
    const userSuffix = parts[parts.length - 1];

    if (!db) {
      return NextResponse.json(
        { error: 'Our verification service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Scan all users to find the matching certificate
    const usersSnapshot = await db.collection('users').get();
    
    let foundUser: any = null;
    let foundUserId: string = '';

    usersSnapshot.forEach((doc: any) => {
      const data = doc.data();
      const userId = doc.id;

      // Check if this user's ID suffix matches and they have the course cert
      const userIdSuffix = userId.substring(2).toUpperCase();
      if (userIdSuffix === userSuffix) {
        // Check if user has the course in their issuedCertificates
        const issuedCerts = data.issuedCertificates || [];
        const courseIdLower = courseIdPart.toLowerCase();
        if (issuedCerts.includes(courseIdLower) || issuedCerts.includes(courseIdPart)) {
          foundUser = data;
          foundUserId = userId;
        }
      }
    });

    if (!foundUser) {
      return NextResponse.json(
        { 
          verified: false,
          error: 'We could not find a certificate matching this ID. Please double-check the ID and try again.' 
        },
        { status: 404 }
      );
    }

    // Return public-safe graduation details
    return NextResponse.json({
      verified: true,
      certificate: {
        id: certId,
        studentName: foundUser.name || 'Graduate',
        courseId: courseIdPart.toLowerCase(),
        courseTitle: getCourseTitle(courseIdPart),
        issuedDate: foundUser.updatedAt || new Date().toISOString(),
        assessmentScore: getAssessmentLabel(foundUser, courseIdPart),
        cohort: '#1.0',
        duration: '12 Weeks',
        institution: 'Alpha Spark Academy',
      },
    });
  } catch (error: any) {
    console.error('Certificate verification error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while verifying. Please try again in a moment.' },
      { status: 500 }
    );
  }
}

/**
 * Map course IDs to human-readable titles.
 * Falls back to formatting the ID itself if not found.
 */
function getCourseTitle(courseIdPart: string): string {
  const courseMap: Record<string, string> = {
    'WEBDEV': 'Web Development',
    'DATASCIENCE': 'Data Science & Analytics',
    'UXDESIGN': 'UX/UI Design',
    'MOBILEMDEV': 'Mobile App Development',
    'CYBERSECURITY': 'Cybersecurity Fundamentals',
    'CLOUDCOMPUTING': 'Cloud Computing',
    'DIGITALMARKETING': 'Digital Marketing',
    'GRAPHICDESIGN': 'Graphic Design',
    'PROJECTMGMT': 'Project Management',
    'AI_ML': 'Artificial Intelligence & Machine Learning',
    // Add more mappings as courses grow
  };

  return courseMap[courseIdPart.toUpperCase()] 
    || courseIdPart.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Derive a human-friendly assessment label from quiz scores.
 */
function getAssessmentLabel(user: any, courseIdPart: string): string {
  const quizScores = user.quizScores || {};
  const courseId = courseIdPart.toLowerCase();
  
  // Collect scores for this course
  const relevantScores = Object.entries(quizScores)
    .filter(([key]) => key.startsWith(courseId))
    .map(([, val]) => Number(val));

  if (relevantScores.length === 0) return 'Completed';

  const avg = relevantScores.reduce((a, b) => a + b, 0) / relevantScores.length;
  
  if (avg >= 90) return 'Outstanding';
  if (avg >= 80) return 'Excellent';
  if (avg >= 70) return 'Very Good';
  if (avg >= 60) return 'Good';
  return 'Completed';
}
