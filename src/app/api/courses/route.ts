import { NextResponse } from 'next/server';
import { db, adminAuth } from '../../../lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db.collection('courses').get();
    const courses: any[] = [];
    snapshot.forEach((doc) => {
      courses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

async function verifyAdminAuth(req: Request): Promise<{ authorized: boolean; error?: string }> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return { authorized: false, error: 'Unauthorized' };
    }

    const token = authHeader.split('Bearer ')[1];
    if (!adminAuth) throw new Error('Firebase adminAuth not initialized');

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const callerDoc = await db.collection('users').doc(userId).get();
    const callerData = callerDoc.data();

    if (!callerData || callerData.role !== 'admin') {
      return { authorized: false, error: 'Forbidden: Admin privileges required' };
    }

    return { authorized: true };
  } catch (error) {
    return { authorized: false, error: 'Authentication failed' };
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await verifyAdminAuth(req);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      title,
      subtitle,
      duration,
      hours,
      level,
      certificate,
      fee,
      learn,
      outcome,
      careerPaths,
      talentCloud,
      accentColor,
      tools,
      iconName,
      imageUrl,
      modules
    } = body;

    if (!title || !subtitle) {
      return NextResponse.json({ error: 'Title and subtitle are required' }, { status: 400 });
    }

    const courseId = id || `c-${Math.random().toString(36).substring(2, 9)}`;
    const newCourse = {
      id: courseId,
      title,
      subtitle,
      duration: duration || '6 WEEKS',
      hours: hours || '36 HRS',
      level: level || 'BEGINNER',
      certificate: certificate || 'VERIFIED',
      fee: fee || '₦20,000',
      learn: learn || [],
      outcome: outcome || `Earn competency in ${title}`,
      careerPaths: careerPaths || [`${title} Consultant`],
      talentCloud: talentCloud || 'Graduates get added to our African verified talent database',
      accentColor: accentColor || '#0099CC',
      tools: tools || [],
      iconName: iconName || 'Code',
      imageUrl: imageUrl || '',
      modules: modules || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('courses').doc(courseId).set(newCourse);
    return NextResponse.json(newCourse);
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await verifyAdminAuth(req);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    const allowedFields = [
      'title',
      'subtitle',
      'duration',
      'hours',
      'level',
      'certificate',
      'fee',
      'learn',
      'outcome',
      'careerPaths',
      'talentCloud',
      'accentColor',
      'tools',
      'iconName',
      'imageUrl',
      'modules'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    await db.collection('courses').doc(id).update(updateData);
    const doc = await db.collection('courses').doc(id).get();
    return NextResponse.json({ id, ...doc.data() });
  } catch (error) {
    console.error('Failed to update course:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await verifyAdminAuth(req);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.collection('courses').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
