import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  // Check if Firebase is already initialized
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Initialize with service account credentials
  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  return app;
};

const app = initializeFirebaseAdmin();

// Export messaging instance for convenience
export const messaging = getMessaging(app);
export default app;
