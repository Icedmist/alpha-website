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
          from: 'Alpha Spark Academy <onboarding@resend.dev>', // Will need verified domain in production
          to: email,
          subject: 'Welcome to Alpha Spark Academy!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Welcome to Alpha Spark Academy!</h2>
              <p>Hi ${name},</p>
              <p>An administrator has created an account for you at Alpha Spark Academy.</p>
              <p><strong>Your Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
              <p><strong>Your Login Email:</strong> ${email}</p>
              <br/>
              <p>Please log in using the credentials provided to you by your administrator, or use the "Forgot Password" link on the login page if you need to set a new password.</p>
              <p><a href="https://alpha-spark-academy.vercel.app/academy" style="display:inline-block; padding:10px 20px; background-color:#F4A261; color:#fff; text-decoration:none; border-radius:5px;">Go to Dashboard</a></p>
              <br/>
              <p>We are thrilled to have you onboard!</p>
              <p>Best regards,</p>
              <p><strong>Alpha Spark Academy Team</strong></p>
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
