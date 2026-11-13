import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  doc,
  getDocFromServer,
  Firestore
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';

// Initialize Firestore with long polling forced to avoid 10s WebChannel timeouts behind proxies/iframes
function initDb(): Firestore {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
        experimentalLongPollingOptions: { timeoutSeconds: 20 },
        ignoreUndefinedProperties: true,
      },
      databaseId
    );
  } catch {
    return getFirestore(app, databaseId);
  }
}

export const db = initDb();

// Initialize Firebase Storage
export const storage = getStorage(app);

// Connection test against a readable config doc
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'site_config', 'daily_video'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore operating in offline fallback mode.');
      return false;
    }
    return true;
  }
}

// Initial test call
testFirebaseConnection().catch(() => {});
