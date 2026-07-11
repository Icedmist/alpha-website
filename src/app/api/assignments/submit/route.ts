import { db, adminAuth } from '../../../../lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { resend } from '../../../../lib/resend';

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
    const { assignmentId, courseId, title, content, portfolioLink } = body;

    if (!assignmentId || !courseId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get assignment details
    let assignmentData: any = null;
    try {
      const assignmentDoc = await db.collection('assignments').doc(assignmentId).get();
      assignmentData = assignmentDoc.data();
    } catch {
      // Assignment might not exist in assignments collection if it's from broadcast
    }

    // Get course details
    const courseDoc = await db.collection('courses').doc(courseId).get();
    const courseData = courseDoc.data();

    // Get instructor details for this course
    const usersSnapshot = await db.collection('users').get();
    const instructors: { email: string; name: string }[] = [];
    
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.role === 'instructor' && user.enrolledCourses?.includes(courseId)) {
        instructors.push({ email: user.email, name: user.name });
      }
    });

    const timestamp = new Date().toISOString();

    // Save submission to submissions collection
    const submission = {
      assignmentId,
      userId,
      courseId,
      courseName: courseData?.title || courseId,
      title: title || assignmentData?.title || 'Assignment',
      content,
      portfolioLink: portfolioLink || '',
      studentName: studentData.name,
      studentEmail: studentData.email,
      submittedAt: timestamp,
      status: 'pending'
    };

    await db.collection('submissions').add(submission);

    // Update student's broadcastAssignment status
    const existingBroadcastAssignments = studentData.broadcastAssignments || [];
    const updatedBroadcastAssignments = existingBroadcastAssignments.map((a: any) => {
      if (a.assignmentId === assignmentId) {
        return { ...a, status: 'submitted', submittedAt: timestamp };
      }
      return a;
    });

    await db.collection('users').doc(userId).update({
      broadcastAssignments: updatedBroadcastAssignments,
      submissions: [...(studentData.submissions || []), submission]
    });

    // Send email notifications
    if (resend) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b0c10; color: #c5c6c7;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://raw.githubusercontent.com/Icedmist/alpha-website/main/public/assets/logo.png" width="80" alt="Alpha Spark" style="margin: 0 auto;" />
          </div>
          <h2 style="color: #0099CC; text-align: center; text-transform: uppercase; letter-spacing: 2px; font-size: 18px;">Assignment Submission</h2>
          <div style="background: #1f2833; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.05);">
            <p style="margin: 0 0 10px 0;"><strong style="color: #0099CC;">Student:</strong> ${studentData.name}</p>
            <p style="margin: 0 0 10px 0;"><strong style="color: #0099CC;">Email:</strong> ${studentData.email}</p>
            <p style="margin: 0 0 10px 0;"><strong style="color: #0099CC;">Course:</strong> ${courseData?.title || courseId}</p>
            <p style="margin: 0 0 10px 0;"><strong style="color: #0099CC;">Assignment:</strong> ${title || assignmentData?.title || 'Assignment'}</p>
            <hr style="border: 1px solid rgba(255,255,255,0.1); margin: 15px 0;" />
            <p style="margin: 0 0 10px 0;"><strong style="color: #0099CC;">Submission:</strong></p>
            <div style="background: #0b0c10; padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
              ${content.replace(/\n/g, '<br/>')}
            </div>
            ${portfolioLink ? `<p style="margin: 15px 0 0 0;"><strong style="color: #0099CC;">Portfolio Link:</strong> <a href="${portfolioLink}" style="color: #0099CC;">${portfolioLink}</a></p>` : ''}
          </div>
          <p style="text-align: center; color: #666; font-size: 11px; margin-top: 20px;">&copy; ${new Date().getFullYear()} Alpha Spark Academy. All rights reserved.</p>
        </div>
      `;

      // Send to instructors
      for (const instructor of instructors) {
        try {
          await resend.emails.send({
            from: 'Alpha Spark Academy <no-reply@alphaspark.ng>',
            to: instructor.email,
            subject: `New Submission: ${title || assignmentData?.title || 'Assignment'} from ${studentData.name}`,
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
            subject: `New Submission: ${title || assignmentData?.title || 'Assignment'} from ${studentData.name}`,
            html: emailHtml
          });
        } catch (err) {
          console.error(`Error sending email to admin ${adminEmail}:`, err);
        }
      }

      // Send confirmation to student
      try {
        await resend.emails.send({
          from: 'Alpha Spark Academy <no-reply@alphaspark.ng>',
          to: studentData.email,
          subject: `Submission Received: ${title || assignmentData?.title || 'Assignment'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b0c10; color: #c5c6c7;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://raw.githubusercontent.com/Icedmist/alpha-website/main/public/assets/logo.png" width="80" alt="Alpha Spark" style="margin: 0 auto;" />
              </div>
              <h2 style="color: #3bb75e; text-align: center; text-transform: uppercase; letter-spacing: 2px; font-size: 18px;">Submission Confirmed</h2>
              <div style="background: #1f2833; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.05);">
                <p>Hi ${studentData.name},</p>
                <p>Your assignment <strong>"${title || assignmentData?.title || 'Assignment'}"</strong> has been submitted successfully.</p>
                <p>Your submission is now pending review by your instructor.</p>
                <p style="margin-top: 15px; color: #666; font-size: 12px;">You can track the status in your dashboard.</p>
              </div>
              <p style="text-align: center; color: #666; font-size: 11px; margin-top: 20px;">&copy; ${new Date().getFullYear()} Alpha Spark Academy. All rights reserved.</p>
            </div>
          `
        });
      } catch (err) {
        console.error('Error sending student confirmation:', err);
      }
    }

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
