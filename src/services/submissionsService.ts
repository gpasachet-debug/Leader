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
import { UploadedFileItem } from '../components/ClientDocumentUpload';

export interface SavedFileItem {
  name: string;
  size: number;
  extension: string;
  type?: string;
  chunksCount: number;
  downloadUrl?: string;
  storagePath?: string;
  dataBase64?: string; // Fallback for very small files
}

export interface StoredSubmission {
  id: string;
  ticketId: string;
  date: string;
  ruc: string;
  businessName: string;
  phone?: string;
  taxPeriod: string;
  docCategories: string[];
  notes: string;
  createdAt: string;
  status: 'pendiente' | 'en_revision' | 'declarado';
  files: SavedFileItem[];
  totalSize: number;
}

export interface SubmissionPayload {
  ruc: string;
  businessName: string;
  phone?: string;
  taxPeriod: string;
  docCategories: string[];
  notes: string;
  files: UploadedFileItem[];
}

const SUBMISSIONS_COLLECTION = 'client_submissions';
const CHUNK_SIZE = 400 * 1024; // 400KB per chunk to stay well under 1MB Firestore doc limit

// Helper to sanitize path strings
function sanitizePath(str: string): string {
  return str.replace(/[^a-zA-Z0-9_\-.]/g, '_');
}

// Helper to recursively remove undefined properties so Firestore never throws unsupported field value: undefined
function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [key, val] of Object.entries(data as Record<string, any>)) {
      if (val !== undefined) {
        cleanObj[key] = sanitizeForFirestore(val);
      }
    }
    return cleanObj as T;
  }
  return data;
}

// Convert File to full Base64 Data URL
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads client files chunked into Firestore and registers metadata
 * Provides smooth, reliable real-time progress callbacks without hanging
 */
export async function uploadClientDocuments(
  payload: SubmissionPayload,
  onProgress?: (percent: number) => void
): Promise<StoredSubmission> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const cleanPeriod = sanitizePath(payload.taxPeriod);
  const cleanRuc = payload.ruc.trim();
  const ticketId = `LDR-${payload.taxPeriod.replace(/\s+/g, '')}-${randomSuffix}`;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (onProgress) onProgress(5);

  const savedFiles: SavedFileItem[] = [];
  const totalAllBytes = payload.files.reduce((acc, f) => acc + f.size, 0) || 1;

  // Step 1: Read all files into Base64 strings in memory
  interface FileDataPayload {
    file: UploadedFileItem;
    dataUrl: string;
    chunks: string[];
  }

  const processedFiles: FileDataPayload[] = [];
  for (let i = 0; i < payload.files.length; i++) {
    const item = payload.files[i];
    let dataUrl = '';
    if (item.fileObj) {
      dataUrl = await readFileAsDataUrl(item.fileObj);
    }
    
    // Split into 400KB chunks
    const chunks: string[] = [];
    if (dataUrl) {
      for (let c = 0; c < dataUrl.length; c += CHUNK_SIZE) {
        chunks.push(dataUrl.slice(c, c + CHUNK_SIZE));
      }
    }

    processedFiles.push({
      file: item,
      dataUrl,
      chunks,
    });
  }

  if (onProgress) onProgress(15);

  const totalAllChunks = processedFiles.reduce((acc, pf) => acc + pf.chunks.length, 0) || 1;
  let totalChunksSaved = 0;

  // Step 2: Write chunks into Firestore subcollection
  // /client_submissions/{ticketId}/chunks/f{fileIndex}_c{chunkIndex}
  const MAX_CONCURRENT_WRITES = 4;

  for (let fileIdx = 0; fileIdx < processedFiles.length; fileIdx++) {
    const { file, chunks, dataUrl } = processedFiles[fileIdx];
    const totalChunks = chunks.length;

    // Save chunks in batches
    for (let c = 0; c < totalChunks; c += MAX_CONCURRENT_WRITES) {
      const batchSlice = chunks.slice(c, c + MAX_CONCURRENT_WRITES);
      const writePromises = batchSlice.map((chunkStr, sliceIdx) => {
        const chunkIndex = c + sliceIdx;
        const chunkDocRef = doc(db, SUBMISSIONS_COLLECTION, ticketId, 'chunks', `f${fileIdx}_c${chunkIndex}`);
        return setDoc(chunkDocRef, {
          fileIndex: fileIdx,
          fileName: file.name,
          chunkIndex,
          totalChunks,
          data: chunkStr,
        });
      });

      await Promise.all(writePromises);
      totalChunksSaved += batchSlice.length;

      if (onProgress) {
        const pct = Math.min(92, Math.round(15 + (totalChunksSaved / totalAllChunks) * 75));
        onProgress(pct);
      }
    }

    const fileItem: SavedFileItem = {
      name: file.name,
      size: file.size,
      extension: file.extension,
      type: file.type || 'application/octet-stream',
      chunksCount: totalChunks,
    };
    if (file.size <= 300 * 1024 && dataUrl) {
      fileItem.dataBase64 = dataUrl;
    }
    savedFiles.push(fileItem);
  }

  if (onProgress) onProgress(95);

  const submissionDoc: StoredSubmission = {
    id: ticketId,
    ticketId,
    date: dateFormatted,
    ruc: cleanRuc,
    businessName: payload.businessName?.trim() || 'No especificada',
    phone: payload.phone?.trim() || '',
    taxPeriod: payload.taxPeriod || '',
    docCategories: Array.isArray(payload.docCategories) ? payload.docCategories : [],
    notes: payload.notes?.trim() || '',
    createdAt: now.toISOString(),
    status: 'pendiente',
    files: savedFiles,
    totalSize: totalAllBytes,
  };

  // Step 3: Save master submission document to Firestore (strictly sanitized to avoid undefined values)
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, ticketId);
    const cleanedDoc = sanitizeForFirestore(submissionDoc);
    await setDoc(docRef, cleanedDoc);
  } catch (firestoreErr) {
    console.error('Firestore save error:', firestoreErr);
    // If offline, save in browser localStorage as resilient backup
    try {
      const localBackups = JSON.parse(localStorage.getItem('leader_offline_submissions') || '[]');
      localBackups.unshift(submissionDoc);
      localStorage.setItem('leader_offline_submissions', JSON.stringify(localBackups));
    } catch {
      // ignore
    }
  }

  if (onProgress) onProgress(100);

  return submissionDoc;
}

/**
 * Fetches all submissions from Firestore (sorted newest first)
 */
export async function getSubmissionsList(): Promise<StoredSubmission[]> {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const list: StoredSubmission[] = [];
    snapshot.forEach((docItem) => {
      const data = docItem.data();
      list.push({
        id: docItem.id,
        ticketId: data.ticketId || docItem.id,
        date: data.date || (data.createdAt ? new Date(data.createdAt).toLocaleDateString('es-PE') : 'Reciente'),
        ruc: data.ruc || 'Sin RUC',
        businessName: data.businessName || 'No especificada',
        phone: data.phone || '',
        taxPeriod: data.taxPeriod || 'Sin periodo',
        docCategories: Array.isArray(data.docCategories) ? data.docCategories : [],
        notes: data.notes || '',
        createdAt: data.createdAt || new Date().toISOString(),
        status: data.status || 'pendiente',
        files: Array.isArray(data.files) ? data.files : [],
        totalSize: typeof data.totalSize === 'number' ? data.totalSize : 0,
      } as StoredSubmission);
    });
    return list;
  } catch (err) {
    console.warn('Could not fetch from Firestore, checking local backups:', err);
    try {
      const stored = localStorage.getItem('leader_offline_submissions');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed)
        ? parsed.map((item: any, idx: number) => ({
            ...item,
            id: item.id || item.ticketId || `offline_${idx}`,
            files: Array.isArray(item.files) ? item.files : [],
            docCategories: Array.isArray(item.docCategories) ? item.docCategories : [],
          }))
        : [];
    } catch {
      return [];
    }
  }
}

/**
 * Downloads a stored file (even multi-megabyte PDFs) by reassembling its chunks
 */
export async function downloadStoredFile(
  submissionId: string,
  fileItem: SavedFileItem,
  fileIndex: number
): Promise<void> {
  // Case 1: Direct download URL (if available)
  if (fileItem.downloadUrl) {
    window.open(fileItem.downloadUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  let fullDataUrl = fileItem.dataBase64 || '';

  // Case 2: Fetch and reassemble chunks from Firestore
  if (!fullDataUrl && fileItem.chunksCount > 0) {
    const chunkPromises: Promise<any>[] = [];
    for (let c = 0; c < fileItem.chunksCount; c++) {
      const chunkRef = doc(db, SUBMISSIONS_COLLECTION, submissionId, 'chunks', `f${fileIndex}_c${c}`);
      chunkPromises.push(getDoc(chunkRef));
    }

    const chunkDocs = await Promise.all(chunkPromises);
    const chunkStrings = chunkDocs.map((d) => (d.exists() ? d.data().data || '' : ''));
    fullDataUrl = chunkStrings.join('');
  }

  if (!fullDataUrl) {
    throw new Error('No se pudo recuperar el contenido del archivo.');
  }

  // Convert Data URL / Base64 to Blob for clean instant browser download
  const parts = fullDataUrl.split(',');
  const mimeType = parts.length > 1
    ? (parts[0].match(/:(.*?);/)?.[1] || fileItem.type || 'application/octet-stream')
    : (fileItem.type || 'application/octet-stream');
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
  link.download = fileItem.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}

/**
 * Updates status of a submission (e.g. 'revisado', 'declarado')
 */
export async function updateSubmissionStatus(
  submissionId: string,
  newStatus: 'pendiente' | 'en_revision' | 'declarado'
): Promise<void> {
  const docRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
  await updateDoc(docRef, { status: newStatus });
}

/**
 * Deletes a submission and all its associated file chunks
 */
export async function deleteSubmission(submission: StoredSubmission): Promise<void> {
  // Delete all chunks from subcollection
  try {
    const chunksSnap = await getDocs(
      collection(db, SUBMISSIONS_COLLECTION, submission.id, 'chunks')
    );
    const deletePromises = chunksSnap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn('Could not delete subcollection chunks:', err);
  }

  // Delete master submission doc
  const docRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
  await deleteDoc(docRef);
}
