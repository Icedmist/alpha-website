import { initializeApp, cert } from 'firebase-admin/app';
import { getSecurityRules } from 'firebase-admin/security-rules';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase Admin credentials in .env.local");
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

async function deployRules() {
  try {
    const source = fs.readFileSync('firestore.rules', 'utf8');
    const rules = getSecurityRules(app);
    const ruleset = await rules.createRuleset({
      name: 'firestore.rules',
      content: source
    });

    console.log(`Created ruleset: ${ruleset.name}`);

    await rules.releaseFirestoreRuleset(ruleset.name);
    console.log('Successfully deployed firestore rules!');
  } catch (error) {
    console.error('Failed to deploy rules:', error);
    process.exit(1);
  }
}

deployRules();
