import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, addDoc, collection } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

import { courses } from './src/data/courses.ts';

const SEED_USERS = [
  {
    name: 'Alpha Admin',
    email: 'admin@alphaspark.tech',
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
    email: 'instructor@alphaspark.tech',
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
    email: 'student@alphaspark.tech',
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

async function seed() {
  console.log('Starting Client SDK Seed...');
  
  for (const user of SEED_USERS) {
    try {
      let userCredential;
      try {
        console.log(`Creating user ${user.email}...`);
        userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          console.log(`User ${user.email} already exists. Signing in...`);
          userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
        } else {
          throw err;
        }
      }
      
      const userId = userCredential.user.uid;
      const { password: _, ...profileData } = user;
      const timestamp = new Date().toISOString();
      const todayDateStr = timestamp.split('T')[0];

      if (user.role === 'student') {
        profileData.attendanceDates = [todayDateStr];
      }

      console.log(`Writing profile to Firestore for ${user.email}...`);
      await setDoc(doc(db, 'users', userId), {
        ...profileData,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      if (user.role === 'student') {
        console.log(`Writing application and activities for ${user.email}...`);
        await setDoc(doc(db, 'applications', userId), {
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

        await addDoc(collection(db, 'activities'), {
          userId,
          userName: user.name,
          action: 'Course Enrollment',
          details: 'Enrolled in course: fullstack-web via Academy Application',
          timestamp,
        });

        await addDoc(collection(db, 'activities'), {
          userId,
          userName: user.name,
          action: 'Daily Check-In',
          details: `Checked in for today: ${todayDateStr}`,
          timestamp,
        });
      }

      if (user.role === 'admin') {
        console.log(`Admin user logged in. Seeding courses...`);
        for (const course of courses) {
          await setDoc(doc(db, 'courses', course.id), {
            ...course,
            createdAt: new Date().toISOString(),
          });
        }
        console.log(`Seeded ${courses.length} courses.`);
      }
      
    } catch (error: any) {
      console.error(`Error processing ${user.email}:`, error);
    }
  }

  console.log('Seed completed successfully.');
  process.exit(0);
}

seed();
