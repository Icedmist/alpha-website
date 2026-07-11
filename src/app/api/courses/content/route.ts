import { NextResponse } from 'next/server';
import { db, adminAuth } from '../../../../lib/firebase-admin';

interface QuizOption {
  label: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswerIndex: number;
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'quiz' | 'assignment' | 'text' | 'link' | 'document';
  duration: string;
  videoUrl?: string;
  pdfUrl?: string;
  quizQuestions?: QuizQuestion[];
  assignmentPrompt?: string;
  textContent?: string;
  linkUrl?: string;
  linkTitle?: string;
  documentUrl?: string;
  documentName?: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

async function verifyInstructorOrAdmin(req: Request): Promise<{ authorized: boolean; error?: string; userId?: string; role?: string }> {
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

    if (!callerData || (callerData.role !== 'admin' && callerData.role !== 'instructor')) {
      return { authorized: false, error: 'Forbidden: Admin or Instructor privileges required' };
    }

    return { authorized: true, userId, role: callerData.role };
  } catch (error) {
    return { authorized: false, error: 'Authentication failed' };
  }
}

export async function GET(req: Request) {
  try {
    const authCheck = await verifyInstructorOrAdmin(req);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const courseData = courseDoc.data();
    return NextResponse.json({ courseId, modules: courseData?.modules || [] });
  } catch (error) {
    console.error('Failed to fetch course content:', error);
    return NextResponse.json({ error: 'Failed to fetch course content' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await verifyInstructorOrAdmin(req);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, module: newModule } = body;

    if (!courseId || !newModule) {
      return NextResponse.json({ error: 'Course ID and module data are required' }, { status: 400 });
    }

    if (!newModule.id || !newModule.title) {
      return NextResponse.json({ error: 'Module ID and title are required' }, { status: 400 });
    }

    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const courseData = courseDoc.data();
    const modules = courseData?.modules || [];

    // Check if module with same ID already exists
    if (modules.some((m: Module) => m.id === newModule.id)) {
      return NextResponse.json({ error: 'Module with this ID already exists' }, { status: 400 });
    }

    modules.push(newModule);

    await db.collection('courses').doc(courseId).update({
      modules,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, modules });
  } catch (error) {
    console.error('Failed to add module:', error);
    return NextResponse.json({ error: 'Failed to add module' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await verifyInstructorOrAdmin(req);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, moduleId, lesson, action } = body;

    if (!courseId || !moduleId) {
      return NextResponse.json({ error: 'Course ID and Module ID are required' }, { status: 400 });
    }

    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const courseData = courseDoc.data();
    const modules: Module[] = courseData?.modules || [];

    const moduleIndex = modules.findIndex((m: Module) => m.id === moduleId);
    if (moduleIndex === -1) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    if (action === 'updateModule') {
      // Update module title
      const { title } = body;
      if (title) {
        modules[moduleIndex].title = title;
      }
    } else if (action === 'deleteModule') {
      // Delete entire module
      modules.splice(moduleIndex, 1);
    } else if (action === 'addLesson') {
      // Add lesson to module
      if (!lesson || !lesson.id || !lesson.title) {
        return NextResponse.json({ error: 'Lesson ID and title are required' }, { status: 400 });
      }
      modules[moduleIndex].lessons.push(lesson);
    } else if (action === 'updateLesson') {
      // Update existing lesson
      if (!lesson || !lesson.id) {
        return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
      }
      const lessonIndex = modules[moduleIndex].lessons.findIndex((l: Lesson) => l.id === lesson.id);
      if (lessonIndex === -1) {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
      }
      modules[moduleIndex].lessons[lessonIndex] = { ...modules[moduleIndex].lessons[lessonIndex], ...lesson };
    } else if (action === 'deleteLesson') {
      // Delete lesson from module
      if (!lesson || !lesson.id) {
        return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
      }
      const lessonIndex = modules[moduleIndex].lessons.findIndex((l: Lesson) => l.id === lesson.id);
      if (lessonIndex === -1) {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
      }
      modules[moduleIndex].lessons.splice(lessonIndex, 1);
    } else if (action === 'reorderLessons') {
      // Reorder lessons in module
      const { lessonIds } = body;
      if (!Array.isArray(lessonIds)) {
        return NextResponse.json({ error: 'lessonIds array is required' }, { status: 400 });
      }
      const reorderedLessons: Lesson[] = [];
      for (const lid of lessonIds) {
        const found = modules[moduleIndex].lessons.find((l: Lesson) => l.id === lid);
        if (found) reorderedLessons.push(found);
      }
      modules[moduleIndex].lessons = reorderedLessons;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await db.collection('courses').doc(courseId).update({
      modules,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, modules });
  } catch (error) {
    console.error('Failed to update course content:', error);
    return NextResponse.json({ error: 'Failed to update course content' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await verifyInstructorOrAdmin(req);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const moduleId = searchParams.get('moduleId');

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const courseData = courseDoc.data();
    let modules: Module[] = courseData?.modules || [];

    if (moduleId) {
      // Delete specific module
      modules = modules.filter((m: Module) => m.id !== moduleId);
    } else {
      // Clear all modules
      modules = [];
    }

    await db.collection('courses').doc(courseId).update({
      modules,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, modules });
  } catch (error) {
    console.error('Failed to delete course content:', error);
    return NextResponse.json({ error: 'Failed to delete course content' }, { status: 500 });
  }
}
