import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), 'mock_firestore.json');

function loadMockDb(): Record<string, Record<string, any>> {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading mock Firestore DB from file:', err);
  }
  return {};
}

function saveMockDb(store: Record<string, Record<string, any>>) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving mock Firestore DB to file:', err);
  }
}

let app: any;
let db: any;
let storage: any;

function initMock() {
  // Load mock database from file to persist data across dev server hot reloads
  const mockDbStore = loadMockDb();

  db = {
    collection: (collectionName: string) => {
      if (!mockDbStore[collectionName]) {
        mockDbStore[collectionName] = {};
        saveMockDb(mockDbStore);
      }

      const chain: any = {
        _orderByField: null,
        _orderByDirection: 'asc',
        _limit: null,
        orderBy: function (field: string, direction: 'asc' | 'desc' = 'asc') {
          this._orderByField = field;
          this._orderByDirection = direction;
          return this;
        },
        limit: function (n: number) {
          this._limit = n;
          return this;
        },
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
              saveMockDb(mockDbStore);
              console.log(
                `[Mock Firestore SET] ${collectionName}/${docId}:`,
                mockDbStore[collectionName][docId]
              );
              return { writeTime: new Date() };
            },
            update: async (data: any) => {
              const current = mockDbStore[collectionName][docId] || {};
              mockDbStore[collectionName][docId] = { ...current, ...data };
              saveMockDb(mockDbStore);
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
          saveMockDb(mockDbStore);
          console.log(
            `[Mock Firestore ADD] ${collectionName}/${docId}:`,
            data
          );
          return { id: docId, writeTime: new Date() };
        },
        get: async function () {
          let list = Object.entries(mockDbStore[collectionName] || {}).map(
            ([id, val]) => ({
              id,
              ...val,
            })
          );

          if (this._orderByField) {
            const field = this._orderByField;
            const dir = this._orderByDirection === 'desc' ? -1 : 1;
            list.sort((a: any, b: any) => {
              const valA = a[field];
              const valB = b[field];
              if (valA === undefined || valA === null) return 1;
              if (valB === undefined || valB === null) return -1;
              if (valA < valB) return -1 * dir;
              if (valA > valB) return 1 * dir;
              return 0;
            });
          }

          if (this._limit !== null) {
            list = list.slice(0, this._limit);
          }

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

      return chain;
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

if (!projectId || !clientEmail || !privateKey) {
  console.warn(
    '⚠️ Missing Firebase Admin SDK environment variables. Booting with Mock client.'
  );
  initMock();
} else {
  try {
    // Format private key correctly (replace literal \n with actual newlines)
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`;

    app =
      getApps().length === 0
        ? initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey: formattedPrivateKey,
            }),
            storageBucket,
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

export { db, storage };
