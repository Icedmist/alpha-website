import { db, adminAuth } from '../../../lib/firebase-admin';
import { NextResponse } from 'next/server';
import { courses } from '../../../data/courses';

const SEED_USERS = [
  {
    name: 'Alpha Admin',
    email: 'admin@alphaspark.ng',
    password: 'admin123',
    phone: '+2348011223344',
    role: 'admin',
    enrolledCourses: [] as string[],
    completedLessons: [] as string[],
    quizScores: {} as Record<string, number>,
    submissions: [] as any[],
    attendanceDates: [] as string[],
  },
  {
    name: 'Dr. Gabriel Okafor',
    email: 'instructor@alphaspark.ng',
    password: 'instructor123',
    phone: '+2348055667788',
    role: 'instructor',
    enrolledCourses: [] as string[],
    completedLessons: [] as string[],
    quizScores: {} as Record<string, number>,
    submissions: [] as any[],
    attendanceDates: [] as string[],
  },
  {
    name: 'Mustapha Yusuf',
    email: 'student@alphaspark.ng',
    password: 'student123',
    phone: '+2349075444148',
    role: 'student',
    enrolledCourses: ['fullstack-web'] as string[],
    completedLessons: [] as string[],
    quizScores: {} as Record<string, number>,
    submissions: [] as any[],
    attendanceDates: [] as string[],
  },
];

export async function GET() {
  const results: string[] = [];

  if (!adminAuth) {
    return NextResponse.json({ error: 'Firebase adminAuth not initialized' }, { status: 500 });
  }

  try {
    // 1. Seed courses collection (without modules - instructors will add content)
    for (const course of courses) {
      const { modules, ...courseWithoutModules } = course;
      await db.collection('courses').doc(course.id).set({
        ...courseWithoutModules,
        modules: [], // Start with empty modules - instructors add content
        createdAt: new Date().toISOString(),
      });
    }
    results.push(`Successfully seeded ${courses.length} courses in Firestore (modules cleared)`);
  } catch (courseErr: any) {
    results.push(`Error seeding courses: ${courseErr?.message || courseErr}`);
  }

  for (const user of SEED_USERS) {
    try {
      let userId: string | null = null;

      // 2. Create in Firebase Auth
      try {
        const userRecord = await adminAuth.createUser({
          email: user.email,
          password: user.password,
          displayName: user.name,
        });
        userId = userRecord.uid;
        results.push(`Successfully created credentials for ${user.email} (ID: ${userId})`);
      } catch (authErr: any) {
        if (authErr?.code === 'auth/email-already-exists') {
          const userRecord = await adminAuth.getUserByEmail(user.email);
          userId = userRecord.uid;
          results.push(`Recovered existing credentials for ${user.email} (ID: ${userId})`);
        } else {
          results.push(`Auth Error for ${user.email}: ${authErr?.message || authErr}`);
        }
      }

      // 3. Initialize/Update Firestore profile
      if (userId) {
        const { password: _, ...profileData } = user;
        const timestamp = new Date().toISOString();
        const todayDateStr = timestamp.split('T')[0];

        if (user.role === 'student') {
          profileData.attendanceDates = [todayDateStr];
          
          // Seed application for this student
          await db.collection('applications').doc(userId).set({
            userId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: 'Lagos, Nigeria',
            program: 'Full Stack Web Development',
            courseId: 'fullstack-web',
            background: 'Science background',
            experience: 'None',
            reason: 'To become a professional software engineer',
            submittedAt: timestamp,
            status: 'approved',
          });
          results.push(`Seeded application for ${user.email}`);

          // Seed activity logs
          await db.collection('activities').add({
            userId,
            userName: user.name,
            action: 'Course Enrollment',
            details: 'Enrolled in course: fullstack-web via Academy Application',
            timestamp,
          });
          await db.collection('activities').add({
            userId,
            userName: user.name,
            action: 'Daily Check-In',
            details: `Checked in for today: ${todayDateStr}`,
            timestamp,
          });
        }

        await db.collection('users').doc(userId).set({
          ...profileData,
          createdAt: timestamp,
          updatedAt: timestamp,
        });

        results.push(`Successfully populated Firestore profile for ${user.email} (ID: ${userId})`);
      }
    } catch (error: any) {
      results.push(`General Error seeding ${user.email}: ${error?.message || error}`);
    }
  }

  return NextResponse.json({ status: 'seeding completed', results });
}
