import { db, adminAuth } from '../../../../lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { resend } from '../../../../lib/resend';

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

    // Get instructor profile
    const instructorDoc = await db.collection('users').doc(userId).get();
    const instructorData = instructorDoc.data();

    if (!instructorData || instructorData.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden: Instructor privileges required' }, { status: 403 });
    }

    const body = await req.json();
    const { courseId, title, description, dueDate, attachments } = body;

    if (!courseId || !title || !description) {
      return NextResponse.json({ error: 'Course ID, title, and description are required' }, { status: 400 });
    }

    // Get course details
    const courseDoc = await db.collection('courses').doc(courseId).get();
    const courseData = courseDoc.data();

    // Get all students enrolled in this course
    const usersSnapshot = await db.collection('users').get();
    const enrolledStudents: { id: string; email: string; name: string }[] = [];
    
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.role === 'student' && user.enrolledCourses?.includes(courseId)) {
        enrolledStudents.push({ id: doc.id, email: user.email, name: user.name });
      }
    });

    if (enrolledStudents.length === 0) {
      return NextResponse.json({ error: 'No students enrolled in this course' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Create assignment record
    const assignment = {
      courseId,
      courseName: courseData?.title || courseId,
      instructorId: userId,
      instructorName: instructorData.name,
      instructorEmail: instructorData.email,
      title,
      description,
      dueDate: dueDate || null,
      attachments: attachments || [],
      createdAt: timestamp,
      status: 'active'
    };

    const assignmentRef = await db.collection('assignments').add(assignment);
    const assignmentId = assignmentRef.id;

    // Save to each student's assignments in their user doc
    for (const student of enrolledStudents) {
      const studentDocRef = db.collection('users').doc(student.id);
      const studentDoc = await studentDocRef.get();
      const studentData = studentDoc.data();
      const existingAssignments = studentData?.broadcastAssignments || [];
      
      await studentDocRef.update({
        broadcastAssignments: [
          ...existingAssignments,
          {
            assignmentId,
            courseId,
            courseName: courseData?.title || courseId,
            instructorName: instructorData.name,
            title,
            description,
            dueDate: dueDate || null,
            status: 'pending',
            createdAt: timestamp
          }
        ]
      });
    }

    // Send email notifications to all enrolled students
    if (resend) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b0c10; color: #c5c6c7;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://raw.githubusercontent.com/Icedmist/alpha-website/main/public/assets/logo.png" width="80" alt="Alpha Spark" style="margin: 0 auto;" />
          </div>
          <h2 style="color: #0099CC; text-align: center; text-transform: uppercase; letter-spacing: 2px; font-size: 18px;">New Assignment Broadcast</h2>
          <div style="background: #1f2833; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.05);">
            <p style="margin: 0 0 10px 0;"><strong style="color: #0099CC;">Course:</strong> ${courseData?.title || courseId}</p>
            <p style="margin: 0 0 10px 0;"><strong style="color: #0099CC;">Assignment:</strong> ${title}</p>
            <p style="margin: 0 0 10px 0;"><strong style="color: #0099CC;">From:</strong> ${instructorData.name}</p>
            ${dueDate ? `<p style="margin: 0 0 10px 0;"><strong style="color: #ff6b6b;">Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>` : ''}
            <hr style="border: 1px solid rgba(255,255,255,0.1); margin: 15px 0;" />
            <p style="margin: 0; line-height: 1.6;">${description}</p>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px;">Log in to your dashboard to submit this assignment.</p>
          <p style="text-align: center; color: #666; font-size: 11px; margin-top: 20px;">&copy; ${new Date().getFullYear()} Alpha Spark Academy. All rights reserved.</p>
        </div>
      `;

      // Batch send emails
      const MAX_BATCH = 50;
      for (let i = 0; i < enrolledStudents.length; i += MAX_BATCH) {
        const batch = enrolledStudents.slice(i, i + MAX_BATCH);
        try {
          await resend.emails.send({
            from: 'Alpha Spark Academy <no-reply@alphaspark.ng>',
            to: batch.map(s => s.email),
            subject: `[Assignment] ${title} - ${courseData?.title || courseId}`,
            html: emailHtml
          });
        } catch (err) {
          console.error('Error sending assignment emails:', err);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      assignmentId,
      message: `Assignment broadcast to ${enrolledStudents.length} students`
    });
  } catch (error: any) {
    console.error('Error broadcasting assignment:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
