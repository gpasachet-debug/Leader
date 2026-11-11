import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface DailyVideoData {
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  dateFormatted?: string;
  updatedAt: string;
}

export const DEFAULT_DAILY_VIDEO: DailyVideoData = {
  title: 'Depósito de la CTS Noviembre 2026: Plazos y Multas SUNAFIL',
  description: 'Atención empleadores: El 15 de noviembre cae domingo, por lo que el plazo máximo para depositar vence el lunes 16 de noviembre (periodo mayo - octubre 2026). No cumplir puede acarrear multas graves de SUNAFIL.',
  category: 'Laboral & Planillas',
  videoUrl: '/assets/aistudio/WhatsApp_Video_2026-11-11_at_2.13.30_PM_351f875b.mp4',
  dateFormatted: 'Noviembre 2026',
  updatedAt: new Date().toISOString(),
};

const SITE_CONFIG_COLLECTION = 'site_config';
const DAILY_VIDEO_DOC = 'daily_video';
const STORAGE_KEY = 'leader_daily_video_config';

/**
 * Fetches the active daily video configuration from Firestore (with local fallback)
 */
export async function getDailyVideoConfig(): Promise<DailyVideoData> {
  try {
    const docRef = doc(db, SITE_CONFIG_COLLECTION, DAILY_VIDEO_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Partial<DailyVideoData>;
      const merged: DailyVideoData = {
        title: data.title || DEFAULT_DAILY_VIDEO.title,
        description: data.description || DEFAULT_DAILY_VIDEO.description,
        category: data.category || DEFAULT_DAILY_VIDEO.category,
        videoUrl: data.videoUrl || DEFAULT_DAILY_VIDEO.videoUrl,
        dateFormatted: data.dateFormatted || DEFAULT_DAILY_VIDEO.dateFormatted,
        updatedAt: data.updatedAt || DEFAULT_DAILY_VIDEO.updatedAt,
      };
      // Keep local storage updated
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // ignore
      }
      return merged;
    }
  } catch (err) {
    console.warn('Could not fetch daily video config from Firestore:', err);
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch {
    // ignore
  }

  return DEFAULT_DAILY_VIDEO;
}

/**
 * Saves a new daily video configuration to Firestore and notifies the app
 */
export async function saveDailyVideoConfig(data: DailyVideoData): Promise<void> {
  const cleanData: DailyVideoData = {
    title: data.title.trim() || DEFAULT_DAILY_VIDEO.title,
    description: data.description.trim() || DEFAULT_DAILY_VIDEO.description,
    category: data.category.trim() || DEFAULT_DAILY_VIDEO.category,
    videoUrl: data.videoUrl.trim() || DEFAULT_DAILY_VIDEO.videoUrl,
    dateFormatted: data.dateFormatted || new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' }),
    updatedAt: new Date().toISOString(),
  };

  // Save to Firestore
  try {
    const docRef = doc(db, SITE_CONFIG_COLLECTION, DAILY_VIDEO_DOC);
    await setDoc(docRef, cleanData);
  } catch (err) {
    console.warn('Could not save daily video to Firestore, saving locally:', err);
  }

  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanData));
  } catch {
    // ignore
  }

  // Dispatch custom window event for instant reactive update across open views
  window.dispatchEvent(new CustomEvent('leader_daily_video_updated', { detail: cleanData }));
}
