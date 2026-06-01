import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseClientConfig, isFirebaseConfigured } from "./config";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env variables.");
  }
  if (!app) {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(getFirebaseClientConfig());
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
}

export function getFirestoreDb(): Firestore {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}
