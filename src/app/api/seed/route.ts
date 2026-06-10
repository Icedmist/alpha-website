import { auth } from '../../../lib/auth';
import { db } from '../../../lib/firebase-admin';
import { NextResponse } from 'next/server';

const SEED_USERS = [
  {
    name: 'Alpha Admin',
    email: 'admin@alphaspark.tech',
    password: 'admin123',
    phone: '+2348011223344',
    role: 'admin',
    enrolledCourses: [],
    completedLessons: [],
    quizScores: {},
    submissions: [],
    attendanceDates: [],
  },
  {
    name: 'Dr. Gabriel Okafor',
    email: 'instructor@alphaspark.tech',
    password: 'instructor123',
    phone: '+2348055667788',
    role: 'instructor',
    enrolledCourses: ['ai-ml', 'fullstack-web', 'graphic-design'],
    completedLessons: [],
    quizScores: {},
    submissions: [],
    attendanceDates: [],
  },
  {
    name: 'Mustapha Yusuf',
    email: 'student@alphaspark.tech',
    password: 'student123',
    phone: '+2349075444148',
    role: 'student',
    enrolledCourses: ['fullstack-web'],
    completedLessons: ['fsw-m1-l1'],
    quizScores: {
      'fsw-m1-q1': 100,
    },
    submissions: [
      {
        courseId: 'fullstack-web',
        lessonId: 'fsw-m2-a1',
        assignmentTitle: 'Assignment: Portfolio Website Deployment',
        content:
          'I have built my website and deployed it. It contains a details page.',
        portfolioLink: 'https://myportfolio-mustapha.vercel.app',
        submittedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        status: 'pending',
      },
    ],
    attendanceDates: [
      new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
  },
];

export async function GET() {
  const results: string[] = [];

  for (const user of SEED_USERS) {
    try {
      // 1. Create in Better Auth (Supabase Postgres)
      const res = await auth.api.signUpEmail({
        body: {
          email: user.email,
          password: user.password,
          name: user.name,
        },
      });

      if (res && res.user) {
        const userId = res.user.id;

        // 2. Initialize Firestore profile
        const { password: _, ...profileData } = user;
        await db.collection('users').doc(userId).set({
          ...profileData,
          createdAt: new Date().toISOString(),
        });

        results.push(`Successfully seeded ${user.email} (ID: ${userId})`);
      }
    } catch (error: any) {
      // If user already exists in Better Auth database, we catch the error
      if (error?.message?.includes('already exists') || error?.code === '23505') {
        results.push(`${user.email} already exists, skipping.`);
      } else {
        results.push(`Error seeding ${user.email}: ${error?.message || error}`);
      }
    }
  }

  return NextResponse.json({ status: 'seeding completed', results });
}
