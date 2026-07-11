import { db, adminAuth } from '../../../lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { resend } from '../../../lib/resend';

const ADMIN_EMAILS = ['talk2icedmist@gmail.com', 'ishaqsultan7541@gmail.com'];

export async function POST(req: Request) {
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

    // Get student profile
    const studentDoc = await db.collection('users').doc(userId).get();
    const studentData = studentDoc.data();

    if (!studentData || studentData.role !== 'student') {
      return NextResponse.json({ error: 'Forbidden: Student privileges required' }, { status: 403 });
    }

    const body = await req.json();
    const { courseId, lessonId, assignmentTitle, content, portfolioLink } = body;

    if (!courseId || !lessonId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get course details
    const courseDoc = await db.collection('courses').doc(courseId).get();
    const courseData = courseDoc.data();

    // Get instructors for this course
    const usersSnapshot = await db.collection('users').get();
    const instructors: { email: string; name: string }[] = [];
    
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.role === 'instructor' && user.enrolledCourses?.includes(courseId)) {
        instructors.push({ email: user.email, name: user.name });
      }
    });

    // Save submission
    const submission = {
      userId,
      courseId,
      lessonId,
      assignmentTitle: assignmentTitle || 'Assignment',
      content,
      portfolioLink: portfolioLink || '',
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    await db.collection('submissions').add(submission);

    // Send email notifications
    if (resend) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>New Assignment Submission</h2>
          <p><strong>Student:</strong> ${studentData.name}</p>
          <p><strong>Email:</strong> ${studentData.email}</p>
          <p><strong>Course:</strong> ${courseData?.title || courseId}</p>
          <p><strong>Assignment:</strong> ${assignmentTitle || 'Assignment'}</p>
          <p><strong>Submission:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
            ${content}
          </div>
          ${portfolioLink ? `<p><strong>Portfolio Link:</strong> <a href="${portfolioLink}">${portfolioLink}</a></p>` : ''}
          <p style="margin-top: 20px;"><strong>Status:</strong> Pending Review</p>
        </div>
      `;

      // Send to instructors
      for (const instructor of instructors) {
        try {
          await resend.emails.send({
            from: 'Alpha Spark Academy <no-reply@alphaspark.ng>',
            to: instructor.email,
            subject: `New Submission: ${assignmentTitle || 'Assignment'} from ${studentData.name}`,
            html: emailHtml
          });
        } catch (err) {
          console.error(`Error sending email to instructor ${instructor.email}:`, err);
        }
      }

      // Send to both admins
      for (const adminEmail of ADMIN_EMAILS) {
        try {
          await resend.emails.send({
            from: 'Alpha Spark Academy <no-reply@alphaspark.ng>',
            to: adminEmail,
            subject: `New Submission: ${assignmentTitle || 'Assignment'} from ${studentData.name}`,
            html: emailHtml
          });
        } catch (err) {
          console.error(`Error sending email to admin ${adminEmail}:`, err);
        }
      }
    }

    // Update student's submissions array
    const existingSubmissions = studentData.submissions || [];
    const updatedSubmissions = [
      ...existingSubmissions.filter((s: any) => s.lessonId !== lessonId),
      submission
    ];

    await db.collection('users').doc(userId).update({
      submissions: updatedSubmissions,
      completedLessons: [...(studentData.completedLessons || []), lessonId]
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
