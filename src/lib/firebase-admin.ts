import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

let app;
let db: any;
let storage: any;

if (!projectId || !clientEmail || !privateKey) {
  console.warn(
    '⚠️ Missing Firebase Admin SDK environment variables. Booting with Mock client.'
  );
  initMock();
} else {
  try {
    // Format private key correctly (replace literal \n with actual newlines)
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    app =
      getApps().length === 0
        ? initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey: formattedPrivateKey,
            }),
          })
        : getApps()[0];

    // Target isolated custom database ID instance if specified
    const customDbId = process.env.FIREBASE_CUSTOM_DB_ID;
    db =
      customDbId && customDbId !== 'isolated-tenant-db-id'
        ? getFirestore(app, customDbId)
        : getFirestore(app);

    // Target isolated custom storage bucket if specified
    const customBucket = process.env.FIREBASE_CUSTOM_STORAGE_BUCKET;
    storage =
      customBucket &&
      customBucket !== 'techtradehub-academy-tenant-isolated-bucket'
        ? getStorage(app).bucket(customBucket)
        : getStorage(app).bucket();
  } catch (error) {
    console.warn(
      '⚠️ Firebase Admin SDK failed to initialize. Falling back to Mock client.',
      error
    );
    initMock();
  }
}

function initMock() {
  // In-memory mock database store for simulating CRUD locally without crashing
  const mockDbStore: Record<string, Record<string, any>> = {};

  db = {
    collection: (collectionName: string) => {
      if (!mockDbStore[collectionName]) {
        mockDbStore[collectionName] = {};
      }

      return {
        doc: (docId: string) => {
          return {
            get: async () => {
              const data = mockDbStore[collectionName][docId];
              return {
                exists: !!data,
                data: () => data || {},
              };
            },
            set: async (data: any, options?: any) => {
              const current = mockDbStore[collectionName][docId] || {};
              if (options?.merge) {
                mockDbStore[collectionName][docId] = { ...current, ...data };
              } else {
                mockDbStore[collectionName][docId] = data;
              }
              console.log(
                `[Mock Firestore SET] ${collectionName}/${docId}:`,
                mockDbStore[collectionName][docId]
              );
              return { writeTime: new Date() };
            },
            update: async (data: any) => {
              const current = mockDbStore[collectionName][docId] || {};
              mockDbStore[collectionName][docId] = { ...current, ...data };
              console.log(
                `[Mock Firestore UPDATE] ${collectionName}/${docId}:`,
                mockDbStore[collectionName][docId]
              );
              return { writeTime: new Date() };
            },
          };
        },
        add: async (data: any) => {
          const docId = Math.random().toString(36).substring(2, 15);
          mockDbStore[collectionName][docId] = data;
          console.log(
            `[Mock Firestore ADD] ${collectionName}/${docId}:`,
            data
          );
          return { id: docId, writeTime: new Date() };
        },
        get: async () => {
          const list = Object.entries(mockDbStore[collectionName] || {}).map(
            ([id, val]) => ({
              id,
              ...val,
            })
          );
          return {
            forEach: (callback: (doc: any) => void) => {
              list.forEach((doc) => {
                callback({
                  id: doc.id,
                  data: () => doc,
                });
              });
            },
          };
        },
      };
    },
  };

  storage = {
    bucket: () => ({
      file: (fileName: string) => ({
        save: async (content: any, options: any) => {
          console.log(`[Mock Cloud Storage Save] ${fileName}`);
        },
        getSignedUrl: async () => [
          `https://mock-storage-bucket.alphaspark.tech/${fileName}`,
        ],
      }),
    }),
  };
}

export { db, storage };
