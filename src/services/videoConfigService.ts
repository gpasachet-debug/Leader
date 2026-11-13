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

export const DEFAULT_VIDEO_PATH = '/assets/leader_video_cts.mp4';
const LEGACY_VIDEO_PATH = '/assets/aistudio/WhatsApp_Video_2026-11-11_at_2.13.30_PM_351f875b.mp4';

export function normalizeVideoUrl(url: string | undefined): string {
  const trimmed = typeof url === 'string' ? url.trim() : '';
  if (trimmed === LEGACY_VIDEO_PATH) return DEFAULT_VIDEO_PATH;
  return trimmed;
}

/**
 * Converts YouTube (watch, youtu.be, shorts) or Vimeo URLs to embeddable iframe URLs
 * so videos consume 0 bytes of Render bandwidth.
 */
export function getEmbedVideoUrl(rawUrl: string): string | null {
  const url = (rawUrl || '').trim();
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/shorts/')[1]?.split('/')[0];
        if (id) return `https://www.youtube.com/embed/${id}?rel=0&playsinline=1`;
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return url;
      }
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}?rel=0&playsinline=1`;
    }

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      if (id) return `https://www.youtube.com/embed/${id}?rel=0&playsinline=1`;
    }

    if (host === 'vimeo.com') {
      const id = parsed.pathname.slice(1).split('/')[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }

  return null;
}

export const DEFAULT_DAILY_VIDEO: DailyVideoData = {
  title: 'Depósito de la CTS Noviembre 2026: Plazos y Multas SUNAFIL',
  description: 'Atención empleadores: El 15 de noviembre cae domingo, por lo que el plazo máximo para depositar vence el lunes 16 de noviembre (periodo mayo - octubre 2026). No cumplir puede acarrear multas graves de SUNAFIL.',
  category: 'Laboral & Planillas',
  videoUrl: DEFAULT_VIDEO_PATH,
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
  // First check localStorage for immediate synchronous speed
  let localData: DailyVideoData | null = null;
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      localData = {
        title: parsed.title ?? DEFAULT_DAILY_VIDEO.title,
        description: parsed.description ?? DEFAULT_DAILY_VIDEO.description,
        category: parsed.category ?? DEFAULT_DAILY_VIDEO.category,
        videoUrl: typeof parsed.videoUrl === 'string' ? normalizeVideoUrl(parsed.videoUrl) : DEFAULT_DAILY_VIDEO.videoUrl,
        dateFormatted: parsed.dateFormatted ?? DEFAULT_DAILY_VIDEO.dateFormatted,
        updatedAt: parsed.updatedAt ?? DEFAULT_DAILY_VIDEO.updatedAt,
      };
    }
  } catch {
    // ignore
  }

  // Then try to fetch from Firestore
  try {
    const docRef = doc(db, SITE_CONFIG_COLLECTION, DAILY_VIDEO_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Partial<DailyVideoData>;
      const merged: DailyVideoData = {
        title: data.title ?? DEFAULT_DAILY_VIDEO.title,
        description: data.description ?? DEFAULT_DAILY_VIDEO.description,
        category: data.category ?? DEFAULT_DAILY_VIDEO.category,
        videoUrl: typeof data.videoUrl === 'string' ? normalizeVideoUrl(data.videoUrl) : '',
        dateFormatted: data.dateFormatted ?? DEFAULT_DAILY_VIDEO.dateFormatted,
        updatedAt: data.updatedAt ?? DEFAULT_DAILY_VIDEO.updatedAt,
      };
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

  return localData || DEFAULT_DAILY_VIDEO;
}

/**
 * Saves a new daily video configuration to Firestore and notifies the app
 */
export async function saveDailyVideoConfig(data: Partial<DailyVideoData>): Promise<DailyVideoData> {
  const cleanData: DailyVideoData = {
    title: (data.title || DEFAULT_DAILY_VIDEO.title).trim(),
    description: (data.description || DEFAULT_DAILY_VIDEO.description).trim(),
    category: (data.category || DEFAULT_DAILY_VIDEO.category).trim(),
    videoUrl: typeof data.videoUrl === 'string' ? data.videoUrl.trim() : '',
    dateFormatted: data.dateFormatted || new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' }),
    updatedAt: new Date().toISOString(),
  };

  // 1. Instant local persistence
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanData));
  } catch {
    // ignore
  }

  // 2. Dispatch custom window event immediately so all open views update with 0ms delay
  window.dispatchEvent(new CustomEvent('leader_daily_video_updated', { detail: cleanData }));

  // 3. Save to Firestore asynchronously
  try {
    const docRef = doc(db, SITE_CONFIG_COLLECTION, DAILY_VIDEO_DOC);
    await setDoc(docRef, cleanData);
  } catch (err) {
    console.warn('Could not save daily video to Firestore, saved locally:', err);
  }

  return cleanData;
}

/**
 * Removes the currently published video, leaving only the text announcement/advice
 */
export async function removeDailyVideo(): Promise<DailyVideoData> {
  const current = await getDailyVideoConfig();
  return await saveDailyVideoConfig({
    ...current,
    videoUrl: '',
    updatedAt: new Date().toISOString(),
  });
}
