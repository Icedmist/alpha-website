// Script to clear all course modules from Firestore
// Run with: node clear-modules.js

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase environment variables. Make sure .env.local is configured.');
  process.exit(1);
}

const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

const app = initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey: formattedPrivateKey,
  }),
});

const db = getFirestore(app);

async function clearAllModules() {
  try {
    const coursesRef = db.collection('courses');
    const snapshot = await coursesRef.get();
    
    let count = 0;
    for (const doc of snapshot.docs) {
      await doc.ref.update({
        modules: [],
        updatedAt: new Date().toISOString()
      });
      console.log(`Cleared modules for course: ${doc.id}`);
      count++;
    }
    
    console.log(`\nDone! Cleared modules from ${count} courses.`);
  } catch (error) {
    console.error('Error clearing modules:', error);
  }
}

clearAllModules();
