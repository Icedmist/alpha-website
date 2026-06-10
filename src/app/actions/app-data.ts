'use server';

import { auth } from '../../lib/auth';
import { db } from '../../lib/firebase-admin';
import { headers } from 'next/headers';

export interface ActivityLog {
  id?: string;
  action: string;
  details: string;
  timestamp: string;
}

/**
 * Server action to securely log and fetch user-specific activities 
 * under the isolated custom Firestore database instance.
 */
export async function logUserActivity(action: string, details: string) {
  try {
    // 1. Authenticate request using Better Auth session
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return {
        success: false,
        error: 'Unauthorized: No valid session found',
      };
    }

    const userId = sessionData.user.id;

    // 2. Perform write operation in the targeted custom Firestore instance
    // The collection structure isolates data under the authenticated user's ID path
    const activityRef = db
      .collection('users')
      .doc(userId)
      .collection('activity');

    const newLog = {
      action,
      details,
      timestamp: new Date().toISOString(),
    };

    const docRef = await activityRef.add(newLog);

    return {
      success: true,
      data: {
        id: docRef.id,
        ...newLog,
      },
    };
  } catch (error: any) {
    console.error('Error logging user activity:', error);
    return {
      success: false,
      error: error?.message || 'Internal server error',
    };
  }
}

/**
 * Server action to fetch user-specific activities from the isolated database.
 */
export async function getUserActivities() {
  try {
    // 1. Authenticate request using Better Auth session
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return {
        success: false,
        error: 'Unauthorized: No valid session found',
      };
    }

    const userId = sessionData.user.id;

    // 2. Query activities from the custom Firestore instance
    const activityRef = db
      .collection('users')
      .doc(userId)
      .collection('activity')
      .orderBy('timestamp', 'desc')
      .limit(50);

    const snapshot = await activityRef.get();
    
    const logs: ActivityLog[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        action: data.action,
        details: data.details,
        timestamp: data.timestamp,
      });
    });

    return {
      success: true,
      data: logs,
    };
  } catch (error: any) {
    console.error('Error getting user activities:', error);
    return {
      success: false,
      error: error?.message || 'Internal server error',
    };
  }
}
