import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AnalyticsConfig {
  measurementId: string;
  updatedAt: string;
}

const SITE_CONFIG_COLLECTION = 'site_config';
const ANALYTICS_DOC = 'analytics';
const STORAGE_KEY = 'leader_ga_config';
const DEFAULT_MEASUREMENT_ID = 'G-KHDCXVG6WE';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __leaderGaId?: string;
  }
}

export function isValidMeasurementId(id: string): boolean {
  return /^G-[A-Z0-9]{6,15}$/i.test((id || '').trim());
}

export function getEnvMeasurementId(): string {
  const envVal = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || '';
  return envVal.trim().toUpperCase();
}

export async function getAnalyticsConfig(): Promise<AnalyticsConfig> {
  const envId = getEnvMeasurementId();
  if (isValidMeasurementId(envId)) {
    return {
      measurementId: envId,
      updatedAt: new Date().toISOString(),
    };
  }

  let localConfig: AnalyticsConfig | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.measurementId === 'string') {
        localConfig = {
          measurementId: parsed.measurementId.trim().toUpperCase(),
          updatedAt: parsed.updatedAt || '',
        };
      }
    }
  } catch {
    // ignore
  }

  try {
    const snap = await getDoc(doc(db, SITE_CONFIG_COLLECTION, ANALYTICS_DOC));
    if (snap.exists()) {
      const data = snap.data() as Partial<AnalyticsConfig>;
      const merged: AnalyticsConfig = {
        measurementId: typeof data.measurementId === 'string' ? data.measurementId.trim().toUpperCase() : '',
        updatedAt: data.updatedAt || '',
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // ignore
      }
      return merged;
    }
  } catch (err) {
    console.warn('Could not load analytics config from Firestore:', err);
  }

  return localConfig || { measurementId: DEFAULT_MEASUREMENT_ID, updatedAt: '' };
}

export async function saveAnalyticsConfig(measurementId: string): Promise<AnalyticsConfig> {
  const cleanId = measurementId.trim().toUpperCase();
  const config: AnalyticsConfig = {
    measurementId: cleanId,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }

  await setDoc(doc(db, SITE_CONFIG_COLLECTION, ANALYTICS_DOC), config);

  if (isValidMeasurementId(cleanId)) {
    injectGoogleAnalyticsScript(cleanId);
  }

  window.dispatchEvent(new CustomEvent('leader_analytics_updated', { detail: config }));
  return config;
}

export function injectGoogleAnalyticsScript(measurementId: string): void {
  const cleanId = measurementId.trim().toUpperCase();
  if (!isValidMeasurementId(cleanId)) return;

  // Already initialized in index.html or earlier call — avoid duplicate page_view
  if (window.__leaderGaId === cleanId) return;

  const scriptId = 'leader-ga4-script';
  const existingScript = document.getElementById(scriptId);
  if (existingScript) {
    existingScript.remove();
  }

  window.dataLayer = window.dataLayer || [];
  // CRITICAL: gtag.js requires the literal `arguments` object, never `...args` Array!
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  }
  window.gtag = gtag as unknown as (...args: unknown[]) => void;

  window.gtag('js', new Date());
  window.gtag('config', cleanId, {
    page_title: document.title,
    page_path: window.location.pathname,
  });

  const script = document.createElement('script');
  script.id = scriptId;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cleanId)}`;
  document.head.appendChild(script);

  window.__leaderGaId = cleanId;
}

export async function initAnalytics(): Promise<void> {
  const config = await getAnalyticsConfig();
  if (isValidMeasurementId(config.measurementId)) {
    injectGoogleAnalyticsScript(config.measurementId);
  }
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>): void {
  if (typeof window.gtag === 'function' && (window.__leaderGaId || DEFAULT_MEASUREMENT_ID)) {
    window.gtag('event', eventName, params || {});
  }
}
