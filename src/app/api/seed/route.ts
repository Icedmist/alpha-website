import { auth } from '../../../lib/auth';
import { db } from '../../../lib/firebase-admin';
import { db as pgDb } from '../../../db';
import { user as userTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
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
    enrolledCourses: [],
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
    enrolledCourses: [],
    completedLessons: [],
    quizScores: {},
    submissions: [],
    attendanceDates: [],
  },
];

export async function GET() {
  const results: string[] = [];

  for (const user of SEED_USERS) {
    try {
      // 1. Create in Better Auth (Postgres)
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
      // Catch duplicate/already exists error
      const isDuplicate = error?.message?.includes('already exists') || error?.code === '23505';
      if (isDuplicate) {
        try {
          const existing = await pgDb
            .select()
            .from(userTable)
            .where(eq(userTable.email, user.email))
            .limit(1);

          if (existing.length > 0) {
            const userId = existing[0].id;
            const { password: _, ...profileData } = user;
            await db.collection('users').doc(userId).set({
              ...profileData,
              createdAt: new Date().toISOString(),
            });
            results.push(`Recovered Firestore profile for existing ${user.email} (ID: ${userId})`);
          } else {
            results.push(`Error: user duplicate error thrown but not found in Postgres for ${user.email}`);
          }
        } catch (dbErr: any) {
          results.push(`DB Error looking up ${user.email}: ${dbErr?.message || dbErr}`);
        }
      } else {
        results.push(`Error seeding ${user.email}: ${error?.message || error}`);
      }
    }
  }

  return NextResponse.json({ status: 'seeding completed', results });
}
