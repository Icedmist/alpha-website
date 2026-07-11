import { db, adminAuth } from '../../../../lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { resend } from '../../../../lib/resend';

export async function GET() {
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

    // Fetch caller's profile to verify role (admin or instructor)
    const callerDoc = await db.collection('users').doc(userId).get();
    const callerData = callerDoc.data();

    if (
      !callerData ||
      (callerData.role !== 'admin' && callerData.role !== 'instructor')
    ) {
      return NextResponse.json(
        { error: 'Forbidden: Admin or Instructor privileges required' },
        { status: 403 }
      );
    }

    // Retrieve all user profiles from the custom Firestore instance
    const snapshot = await db.collection('users').get();
    const users: any[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        role: data.role || 'student',
        enrolledCourses: data.enrolledCourses || [],
        completedLessons: data.completedLessons || [],
        quizScores: data.quizScores || {},
        submissions: data.submissions || [],
        attendanceDates: data.attendanceDates || [],
      });
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching all users:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    // Fetch caller's profile to verify role (must be admin)
    const callerDoc = await db.collection('users').doc(userId).get();
    const callerData = callerDoc.data();

    if (!callerData || callerData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin privileges required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Do not allow admin to delete themselves
    if (targetUserId === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own admin account' },
        { status: 400 }
      );
    }

    // 1. Delete from Firestore
    await db.collection('users').doc(targetUserId).delete();

    // 2. Delete from Firebase Auth
    await adminAuth.deleteUser(targetUserId);

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const callerDoc = await db.collection('users').doc(userId).get();
    const callerData = callerDoc.data();

    if (!callerData || callerData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin privileges required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Create in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Create in Firestore
    const userProfile = {
      name,
      email,
      phone: body.phone || '',
      role: role || 'student',
      enrolledCourses: role === 'student' ? [] : ['ai-ml', 'fullstack-web'],
      completedLessons: [],
      quizScores: {},
      submissions: [],
      attendanceDates: [new Date().toISOString().split('T')[0]],
      createdAt: new Date().toISOString(),
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);

    // Send Welcome Email
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Alpha Spark Academy <no-reply@alphaspark.ng>',
          to: email,
          subject: 'Welcome to Alpha Spark Academy!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b0c10; color: #c5c6c7;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://raw.githubusercontent.com/Icedmist/alpha-website/main/public/assets/logo.png" width="80" alt="Alpha Spark" style="margin: 0 auto;" />
              </div>
              <h2 style="color: #0099CC; text-align: center; text-transform: uppercase; letter-spacing: 2px; font-size: 18px;">Welcome to Alpha Spark Academy!</h2>
              <div style="background: #1f2833; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0 0 10px 0;">Hi ${name},</p>
                <p style="margin: 0 0 15px 0;">An administrator has created an account for you at Alpha Spark Academy.</p>
                <p style="margin: 0 0 8px 0;"><strong style="color: #0099CC;">Your Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
                <p style="margin: 0 0 8px 0;"><strong style="color: #0099CC;">Login Email:</strong> ${email}</p>
                <p style="margin: 0 0 15px 0;"><strong style="color: #0099CC;">Password:</strong> <span style="background: #0b0c10; padding: 4px 10px; border-radius: 6px; font-family: monospace; letter-spacing: 1px; border: 1px solid rgba(255,255,255,0.1);">${password}</span></p>
                <hr style="border: 1px solid rgba(255,255,255,0.1); margin: 15px 0;" />
                <p style="margin: 0; color: #666; font-size: 12px;">Please log in with the credentials above. For security, we recommend changing your password after your first login.</p>
              </div>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://alpha-spark-academy.vercel.app/academy" style="display:inline-block; padding:12px 24px; background-color:#F4A261; color:#fff; text-decoration:none; border-radius:8px; font-weight:bold; text-transform:uppercase; font-size:12px; letter-spacing:1px;">Go to Dashboard</a>
              </div>
              <p style="text-align: center; color: #666; font-size: 11px; margin-top: 20px;">&copy; ${new Date().getFullYear()} Alpha Spark Academy. All rights reserved.</p>
            </div>
          `
        });
      } catch (err) {
        console.error('Error sending welcome email via Resend:', err);
      }
    }

    return NextResponse.json({ success: true, user: { id: userRecord.uid, ...userProfile } });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
