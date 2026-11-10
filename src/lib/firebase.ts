import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore Database with specified databaseId
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Connection test as required by Firebase skill
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or database unreachable.');
      return false;
    }
    // Any permission error or doc not found still proves network reachability to Firestore
    return true;
  }
}

// Initial test call
testFirebaseConnection().catch(() => {});
