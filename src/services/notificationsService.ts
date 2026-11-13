import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type NotificationEntity = 'SUNAT' | 'SUNAFIL' | 'Ambas / Otra' | 'Asesoría General';

export interface NotificationCase {
  id: string;
  caseId: string;
  contactName: string;
  phone: string;
  businessName: string;
  ruc: string;
  entity: NotificationEntity;
  isExistingClient: boolean;
  serviceInterest: string;
  message: string;
  pdfFileName: string;
  pdfFileSize: number;
  pdfChunksCount: number;
  pdfDataBase64?: string;
  createdAt: string;
  dateFormatted: string;
  status: 'nuevo' | 'en_revision' | 'atendido';
}

export interface CreateNotificationPayload {
  contactName: string;
  phone: string;
  businessName?: string;
  ruc?: string;
  entity: NotificationEntity;
  isExistingClient: boolean;
  serviceInterest: string;
  message?: string;
  pdfFile?: File | null;
}

const NOTIFICATIONS_COLLECTION = 'sunat_notifications';
const CHUNK_SIZE = 400 * 1024; // 400KB per chunk to stay well under 1MB Firestore doc limit
const LOCAL_BACKUP_KEY = 'leader_sunat_notifications_backup';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Registers a SUNAT/SUNAFIL notification or consultation case (with optional PDF)
 * in Cloud Firestore so both the Admin Portal and the direct WhatsApp link can download the PDF.
 */
export async function submitNotificationCase(
  payload: CreateNotificationPayload,
  onProgress?: (percent: number) => void
): Promise<NotificationCase> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const dateCompact = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const caseId = `NTF-${dateCompact}-${randomSuffix}`;
  const dateFormatted = now.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (onProgress) onProgress(10);

  let pdfFileName = '';
  let pdfFileSize = 0;
  let pdfChunksCount = 0;
  let pdfDataUrl = '';

  if (payload.pdfFile) {
    pdfFileName = payload.pdfFile.name;
    pdfFileSize = payload.pdfFile.size;
    pdfDataUrl = await readFileAsDataUrl(payload.pdfFile);

    const chunks: string[] = [];
    for (let c = 0; c < pdfDataUrl.length; c += CHUNK_SIZE) {
      chunks.push(pdfDataUrl.slice(c, c + CHUNK_SIZE));
    }
    pdfChunksCount = chunks.length;

    if (onProgress) onProgress(25);

    const MAX_CONCURRENT = 4;
    let saved = 0;
    for (let c = 0; c < chunks.length; c += MAX_CONCURRENT) {
      const slice = chunks.slice(c, c + MAX_CONCURRENT);
      await Promise.all(
        slice.map((chunkStr, idx) => {
          const chunkIndex = c + idx;
          const chunkRef = doc(db, NOTIFICATIONS_COLLECTION, caseId, 'chunks', `pdf_c${chunkIndex}`);
          return setDoc(chunkRef, {
            fileIndex: 0,
            fileName: pdfFileName,
            chunkIndex,
            totalChunks: chunks.length,
            data: chunkStr,
          });
        })
      );
      saved += slice.length;
      if (onProgress) {
        onProgress(Math.min(85, Math.round(25 + (saved / chunks.length) * 60)));
      }
    }
  }

  if (onProgress) onProgress(90);

  const docData: NotificationCase = {
    id: caseId,
    caseId,
    contactName: payload.contactName.trim(),
    phone: payload.phone.trim(),
    businessName: (payload.businessName || '').trim() || 'No especificada',
    ruc: (payload.ruc || '').trim(),
    entity: payload.entity,
    isExistingClient: payload.isExistingClient,
    serviceInterest: payload.serviceInterest,
    message: (payload.message || '').trim(),
    pdfFileName,
    pdfFileSize,
    pdfChunksCount,
    createdAt: now.toISOString(),
    dateFormatted,
    status: 'nuevo',
  };

  if (pdfDataUrl && pdfFileSize <= 300 * 1024) {
    docData.pdfDataBase64 = pdfDataUrl;
  }

  try {
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, caseId), docData);
  } catch (err) {
    console.warn('Could not save notification case to Firestore, storing local backup:', err);
  }

  // Also store local backup
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_BACKUP_KEY) || '[]');
    existing.unshift({ ...docData, pdfDataBase64: pdfDataUrl || docData.pdfDataBase64 });
    localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(existing.slice(0, 20)));
  } catch {
    // ignore storage quota errors
  }

  if (onProgress) onProgress(100);
  return docData;
}

export async function getNotificationCaseById(caseId: string): Promise<NotificationCase | null> {
  try {
    const snap = await getDoc(doc(db, NOTIFICATIONS_COLLECTION, caseId));
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: snap.id,
        caseId: data.caseId || snap.id,
        contactName: data.contactName || '',
        phone: data.phone || '',
        businessName: data.businessName || 'No especificada',
        ruc: data.ruc || '',
        entity: data.entity || 'SUNAT',
        isExistingClient: Boolean(data.isExistingClient),
        serviceInterest: data.serviceInterest || '',
        message: data.message || '',
        pdfFileName: data.pdfFileName || '',
        pdfFileSize: data.pdfFileSize || 0,
        pdfChunksCount: data.pdfChunksCount || 0,
        pdfDataBase64: data.pdfDataBase64,
        createdAt: data.createdAt || new Date().toISOString(),
        dateFormatted: data.dateFormatted || '',
        status: data.status || 'nuevo',
      };
    }
  } catch (err) {
    console.warn('Could not fetch notification case:', err);
  }

  // Fallback to localStorage
  try {
    const existing: NotificationCase[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_KEY) || '[]');
    return existing.find((item) => item.caseId === caseId || item.id === caseId) || null;
  } catch {
    return null;
  }
}

export async function getNotificationCasesList(): Promise<NotificationCase[]> {
  try {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const list: NotificationCase[] = [];
    snapshot.forEach((docItem) => {
      const data = docItem.data();
      list.push({
        id: docItem.id,
        caseId: data.caseId || docItem.id,
        contactName: data.contactName || '',
        phone: data.phone || '',
        businessName: data.businessName || 'No especificada',
        ruc: data.ruc || '',
        entity: data.entity || 'SUNAT',
        isExistingClient: Boolean(data.isExistingClient),
        serviceInterest: data.serviceInterest || '',
        message: data.message || '',
        pdfFileName: data.pdfFileName || '',
        pdfFileSize: data.pdfFileSize || 0,
        pdfChunksCount: data.pdfChunksCount || 0,
        pdfDataBase64: data.pdfDataBase64,
        createdAt: data.createdAt || new Date().toISOString(),
        dateFormatted: data.dateFormatted || '',
        status: data.status || 'nuevo',
      });
    });
    return list;
  } catch (err) {
    console.warn('Could not fetch notification cases from Firestore, checking local backup:', err);
    try {
      return JSON.parse(localStorage.getItem(LOCAL_BACKUP_KEY) || '[]');
    } catch {
      return [];
    }
  }
}

export async function downloadNotificationPdf(caseData: NotificationCase): Promise<void> {
  let fullDataUrl = caseData.pdfDataBase64 || '';

  if (!fullDataUrl && caseData.pdfChunksCount > 0) {
    const promises: Promise<any>[] = [];
    for (let c = 0; c < caseData.pdfChunksCount; c++) {
      promises.push(getDoc(doc(db, NOTIFICATIONS_COLLECTION, caseData.id, 'chunks', `pdf_c${c}`)));
    }
    const snaps = await Promise.all(promises);
    fullDataUrl = snaps.map((s) => (s.exists() ? s.data().data || '' : '')).join('');
  }

  if (!fullDataUrl) {
    throw new Error('No se encontró el documento PDF adjunto.');
  }

  const parts = fullDataUrl.split(',');
  const mimeType = parts.length > 1 ? parts[0].match(/:(.*?);/)?.[1] || 'application/pdf' : 'application/pdf';
  const base64Data = parts.length > 1 ? parts[1] : parts[0];

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const blob = new Blob([byteNumbers], { type: mimeType });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = caseData.pdfFileName || `${caseData.caseId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}

export async function updateNotificationStatus(
  caseId: string,
  newStatus: 'nuevo' | 'en_revision' | 'atendido'
): Promise<void> {
  await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, caseId), { status: newStatus });
}

export async function deleteNotificationCase(caseData: NotificationCase): Promise<void> {
  try {
    const chunksSnap = await getDocs(collection(db, NOTIFICATIONS_COLLECTION, caseData.id, 'chunks'));
    await Promise.all(chunksSnap.docs.map((d) => deleteDoc(d.ref)));
  } catch {
    // ignore
  }
  await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, caseData.id));
}
