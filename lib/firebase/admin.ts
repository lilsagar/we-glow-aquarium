import * as admin from "firebase-admin";
import { cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

function getServiceAccount(): ServiceAccount {
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase admin credentials are not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY.",
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

export function getAdminFirestore(): Firestore {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: cert(getServiceAccount()),
    });
  }

  return getFirestore(admin.app());
}
