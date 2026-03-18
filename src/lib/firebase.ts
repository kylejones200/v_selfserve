import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import type { AuthUser } from '../types';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

const hasConfig = apiKey && authDomain && projectId;

const firebaseConfig = hasConfig
  ? {
      apiKey,
      authDomain,
      projectId,
      ...(appId && { appId }),
    }
  : null;

const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth: ReturnType<typeof getAuth> | null = app ? getAuth(app) : null;

export async function signInWithGoogle(): Promise<AuthUser> {
  if (!auth) {
    throw new Error('Sign-in is not configured for this site. Add Firebase config (VITE_FIREBASE_*) to the deployment.');
  }
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user as unknown as AuthUser;
}

export async function signOut(): Promise<void> {
  if (auth) await firebaseSignOut(auth);
}

/** Get current Firebase ID token for the backend (null if not signed in or expired). */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth?.currentUser) return null;
  return auth.currentUser.getIdToken(forceRefresh);
}
