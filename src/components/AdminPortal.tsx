import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  FileCheck2,
  MessageSquare,
  Building,
  Calendar,
  X,
  ExternalLink,
  ChevronRight,
  Database,
  Eye,
  LogOut,
  FolderDown,
  Film,
  Video,
  UploadCloud,
  Save,
  Sparkles,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  VideoOff,
  AlertTriangle,
  UserPlus,
  Building2,
  Copy,
  BarChart3
} from 'lucide-react';
import {
  StoredSubmission,
  getSubmissionsList,
  updateSubmissionStatus,
  deleteSubmission,
  downloadStoredFile
} from '../services/submissionsService';
import {
  DailyVideoData,
  DEFAULT_DAILY_VIDEO,
  getDailyVideoConfig,
  saveDailyVideoConfig,
  removeDailyVideo,
  getEmbedVideoUrl
} from '../services/videoConfigService';
import {
  NotificationCase,
  getNotificationCasesList,
  downloadNotificationPdf,
  updateNotificationStatus,
  deleteNotificationCase
} from '../services/notificationsService';
import {
  getAnalyticsConfig,
  saveAnalyticsConfig,
  isValidMeasurementId,
  getEnvMeasurementId
} from '../services/analyticsService';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_ADMIN_PIN = 'Leader2026';

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [periodFilter, setPeriodFilter] = useState<string>('todos');
  const [selectedSubmission, setSelectedSubmission] = useState<StoredSubmission | null>(null);

  // Tab switcher: 'documents', 'notifications', 'video', or 'analytics'
  const [activeTab, setActiveTab] = useState<'documents' | 'notifications' | 'video' | 'analytics'>('documents');

  // Google Analytics 4 state
  const [gaMeasurementId, setGaMeasurementId] = useState<string>('');
  const [isSavingGa, setIsSavingGa] = useState<boolean>(false);
  const [gaSaveMessage, setGaSaveMessage] = useState<string>('');
  const [gaError, setGaError] = useState<string>('');

  // Notifications SUNAT / SUNAFIL state
  const [notifications, setNotifications] = useState<NotificationCase[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationCase | null>(null);
  const [notifSearch, setNotifSearch] = useState<string>('');
  const [notifFilter, setNotifFilter] = useState<string>('todos');
  const [downloadingNotifId, setDownloadingNotifId] = useState<string | null>(null);
  const [confirmDeleteNotifId, setConfirmDeleteNotifId] = useState<string | null>(null);
  const [copiedNotifLink, setCopiedNotifLink] = useState<boolean>(false);

  // Video Management Studio state
  const [videoTitle, setVideoTitle] = useState<string>(DEFAULT_DAILY_VIDEO.title);
  const [videoDescription, setVideoDescription] = useState<string>(DEFAULT_DAILY_VIDEO.description);
  const [videoCategory, setVideoCategory] = useState<string>(DEFAULT_DAILY_VIDEO.category);
  const [videoUrl, setVideoUrl] = useState<string>(DEFAULT_DAILY_VIDEO.videoUrl);
  const [isSavingVideo, setIsSavingVideo] = useState<boolean>(false);
  const [videoSaveSuccess, setVideoSaveSuccess] = useState<boolean>(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState<string>('');
  const [localVideoFileName, setLocalVideoFileName] = useState<string>('');
  const [previewPlaying, setPreviewPlaying] = useState<boolean>(false);

  // Check session storage for admin login
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('leader_admin_logged');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch submissions, notifications, video and analytics config when opened and authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
      loadVideoConfig();
      loadAnalyticsConfig();
    }
  }, [isOpen, isAuthenticated]);

  const loadAnalyticsConfig = async () => {
    try {
      const cfg = await getAnalyticsConfig();
      setGaMeasurementId(cfg.measurementId || '');
    } catch {
      // ignore
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [data, notifData] = await Promise.all([
        getSubmissionsList(),
        getNotificationCasesList(),
      ]);
      setSubmissions(data);
      setNotifications(notifData);
      if (selectedSubmission) {
        const updated = data.find((s) => s.id === selectedSubmission.id);
        if (updated) setSelectedSubmission(updated);
      }
      if (selectedNotification) {
        const updatedNotif = notifData.find((n) => n.id === selectedNotification.id);
        if (updatedNotif) setSelectedNotification(updatedNotif);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVideoConfig = async () => {
    try {
      const config = await getDailyVideoConfig();
      setVideoTitle(config.title || '');
      setVideoDescription(config.description || '');
      setVideoCategory(config.category || 'Actualidad');
      setVideoUrl(config.videoUrl || '');
    } catch (err) {
      console.warn('Error fetching video config:', err);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      setLocalVideoFileName(file.name);
      setVideoSaveSuccess(false);
    }
  };

  const [videoError, setVideoError] = useState<string>('');

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoError('');
    if (!videoTitle.trim()) {
      setVideoError('Por favor ingresa al menos un título para la cápsula o comunicado.');
      return;
    }
    setIsSavingVideo(true);
    setVideoSaveSuccess(false);
    try {
      await saveDailyVideoConfig({
        title: videoTitle.trim(),
        description: videoDescription.trim(),
        category: videoCategory.trim() || 'Actualidad',
        videoUrl: (videoUrl || '').trim(),
        updatedAt: new Date().toISOString(),
      });
      setVideoSaveSuccess(true);
      setVideoStatusMessage(
        (videoUrl || '').trim()
          ? '¡Video publicado con éxito! Se visualiza con reproducción automática en la página web.'
          : '¡Guardado en Modo Solo Texto! El recuadro del video ha desaparecido y el texto ocupa todo el espacio.'
      );
      setTimeout(() => setVideoSaveSuccess(false), 5000);
    } catch (err) {
      console.error('Error saving video:', err);
      setVideoError('Hubo un error al guardar en la nube. Intenta nuevamente.');
    } finally {
      setIsSavingVideo(false);
    }
  };

  const handleRemovePublishedVideo = async () => {
    setIsSavingVideo(true);
    setVideoError('');
    setVideoSaveSuccess(false);
    try {
      setVideoUrl('');
      setLocalVideoFileName('');
      await removeDailyVideo();
      setVideoSaveSuccess(true);
      setVideoStatusMessage(
        '¡Video eliminado con éxito! En la página web el recuadro del video ha desaparecido y el texto se acomodó ocupando todo el espacio.'
      );
      setTimeout(() => setVideoSaveSuccess(false), 5000);
    } catch (err) {
      console.error('Error removing video:', err);
      setVideoError('No se pudo retirar el video de la nube. Intenta nuevamente.');
    } finally {
      setIsSavingVideo(false);
    }
  };

  const handleResetDefaultVideo = async () => {
    setVideoTitle(DEFAULT_DAILY_VIDEO.title);
    setVideoDescription(DEFAULT_DAILY_VIDEO.description);
    setVideoCategory(DEFAULT_DAILY_VIDEO.category);
    setVideoUrl(DEFAULT_DAILY_VIDEO.videoUrl);
    setLocalVideoFileName('');
    setVideoError('');
    setVideoSaveSuccess(false);
    try {
      await saveDailyVideoConfig(DEFAULT_DAILY_VIDEO);
      setVideoSaveSuccess(true);
      setVideoStatusMessage('¡Video original de la CTS restaurado con éxito en la portada!');
      setTimeout(() => setVideoSaveSuccess(false), 4000);
    } catch {}
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (pinInput.trim() === DEFAULT_ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('leader_admin_logged', 'true');
      setPinInput('');
    } else {
      setAuthError('Clave incorrecta. Por favor verifica la clave de acceso de Leader.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('leader_admin_logged');
    setPinInput('');
  };

  const handleStatusChange = async (submissionId: string, newStatus: 'pendiente' | 'en_revision' | 'declarado') => {
    try {
      await updateSubmissionStatus(submissionId, newStatus);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status: newStatus } : s))
      );
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (submission: StoredSubmission) => {
    if (!window.confirm(`¿Estás seguro de eliminar el registro de ${submission.ruc} (${submission.taxPeriod})?`)) {
      return;
    }
    try {
      await deleteSubmission(submission);
      setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
      if (selectedSubmission?.id === submission.id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
    }
  };

  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const handleDownloadFile = async (file: StoredSubmission['files'][0], fileIndex: number) => {
    if (!selectedSubmission) return;
    const key = `${selectedSubmission.id}_${fileIndex}`;
    setDownloadingKey(key);
    try {
      await downloadStoredFile(selectedSubmission.id, file, fileIndex);
    } catch (err) {
      console.error('Download error:', err);
      alert('Hubo un inconveniente al descargar el archivo. Por favor reintenta.');
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleReplyWhatsApp = (submission: StoredSubmission) => {
    const statusText =
      submission.status === 'declarado'
        ? 'sus declaraciones y pagos del periodo han sido presentados exitosamente ante SUNAT.'
        : submission.status === 'en_revision'
        ? 'sus comprobantes se encuentran actualmente en proceso de liquidación y registro contable.'
        : 'hemos recibido sus comprobantes en Cloud Storage y estamos por iniciar la revisión.';

    const message =
      `*LEADER CONSULTORES - CONFIRMACIÓN TRIBUTARIA*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Estimado(a) *${submission.businessName}* (RUC: *${submission.ruc}*),\n\n` +
      `Le informamos que respecto a sus documentos enviados para el periodo *${submission.taxPeriod}* (Ticket: \`${submission.ticketId}\`):\n\n` +
      `✅ *Estado:* ${submission.status.toUpperCase()}\n` +
      `📌 *Detalle:* ${statusText}\n\n` +
      `Cualquier consulta sobre su crédito fiscal o tributos por pagar, quedamos a su disposición.\n` +
      `Atentamente,\n` +
      `*Jorge Pasache - Leader Consultores*\n` +
      `Chincha, Perú`;

    const cleanDigits = (submission.phone || '').replace(/\D/g, '');
    let waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    if (cleanDigits.length >= 9) {
      const fullNumber = cleanDigits.startsWith('51') ? cleanDigits : `51${cleanDigits}`;
      waUrl = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
    }

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (ext: string) => {
    switch (ext.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'xml':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'doc':
      case 'docx':
        return <FileCheck2 className="w-4 h-4 text-blue-400" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'zip':
      case 'rar':
        return <FileArchive className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  // Filter logic
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      (s.ruc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.ticketId || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || s.status === statusFilter;
    const matchesPeriod = periodFilter === 'todos' || s.taxPeriod === periodFilter;

    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const uniquePeriods = Array.from(
    new Set(
      submissions
        .map((s) => s.taxPeriod)
        .filter((p): p is string => Boolean(p && typeof p === 'string' && p.trim()))
    )
  );
  const pendingCount = submissions.filter((s) => s.status === 'pendiente').length;
  const inReviewCount = submissions.filter((s) => s.status === 'en_revision').length;
  const declaredCount = submissions.filter((s) => s.status === 'declarado').length;
  const totalStorageBytes = submissions.reduce((acc, s) => acc + (s.totalSize || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-transparent" />

      {/* Main Admin Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="relative w-full max-w-6xl bg-gradient-to-b from-[#091734] via-[#071329] to-[#040C1A] border border-cyan-500/50 rounded-3xl p-5 sm:p-8 shadow-2xl z-10 max-h-[94vh] flex flex-col my-auto custom-scrollbar overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Panel de Recepción de Documentos
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Cloud Storage
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gestión exclusiva para el equipo contable de Leader Consultores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-xs font-semibold text-slate-400 hover:text-rose-300 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center gap-1 cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Screen if not logged in */}
        {!isAuthenticated ? (
          <div className="py-12 px-4 max-w-md mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Ingreso de Asesores</h4>
            <p className="text-xs text-slate-300 mb-6">
              Ingresa la clave de administración de Leader para acceder a los comprobantes y archivos en la nube.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Ingresa la clave de acceso..."
                  className="w-full px-4 py-3 rounded-xl bg-[#050D1E] border border-slate-700 focus:border-cyan-400 text-white text-center tracking-widest text-base focus:outline-none"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="text-xs text-rose-400 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
              >
                Entrar al Panel
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col min-h-0 pt-4 space-y-4 overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'documents'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Recepción de Documentos ({submissions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'notifications'
                    ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/20 text-amber-200 border border-amber-400/50 shadow-md shadow-amber-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Notificaciones SUNAT / SUNAFIL ({notifications.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'video'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-400/50 shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Film className="w-4 h-4 text-emerald-400" />
                <span>Video del Día / Cápsula Informativa</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-violet-500/25 to-cyan-500/20 text-violet-200 border border-violet-400/50 shadow-md shadow-violet-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-violet-400" />
                <span>Google Analytics</span>
                {isValidMeasurementId(gaMeasurementId) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>

            {activeTab === 'documents' ? (
              <>
            {/* Top Stat Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="p-3 rounded-2xl bg-[#08152E] border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Envíos</span>
                  <p className="text-xl font-black text-white font-mono">{submissions.length}</p>
                </div>
                <Database className="w-5 h-5 text-cyan-400" />
              </div>

              <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-300">Pendientes</span>
                  <p className="text-xl font-black text-amber-400 font-mono">{pendingCount}</p>
                </div>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>

              <div className="p-3 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-300">En Revisión</span>
                  <p className="text-xl font-black text-blue-400 font-mono">{inReviewCount}</p>
                </div>
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-300">Declarados</span>
                  <p className="text-xl font-black text-emerald-400 font-mono">{declaredCount}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 bg-[#061022] p-3 rounded-2xl border border-slate-800">
              
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por RUC, Razón Social o Ticket..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Status select */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="pendiente">Solo Pendientes</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="declarado">Declarados</option>
                </select>

                {/* Period select */}
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="todos">Todos los Periodos</option>
                  {uniquePeriods.map((p, idx) => (
                    <option key={`period_${p}_${idx}`} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                {/* Refresh */}
                <button
                  type="button"
                  onClick={loadData}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                  title="Actualizar datos desde la nube"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Main Content Area: Split List & Detail */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
              
              {/* Left Column: Submissions List */}
              <div className="lg:col-span-5 flex flex-col min-h-0 bg-[#061022] rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
                  <span>Envíos ({filteredSubmissions.length})</span>
                  <span>Uso: {formatFileSize(totalStorageBytes)}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {filteredSubmissions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No se encontraron envíos con los filtros actuales.
                    </div>
                  ) : (
                    filteredSubmissions.map((item, index) => {
                      const isSelected = selectedSubmission?.id === item.id;
                      const itemKey = item.id ? `sub_${item.id}` : `sub_idx_${index}_${item.ticketId || item.ruc || 'doc'}`;
                      const filesList = Array.isArray(item.files) ? item.files : [];
                      return (
                        <div
                          key={itemKey}
                          onClick={() => setSelectedSubmission(item)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950/60 border-cyan-400/80 shadow-md shadow-cyan-950/40'
                              : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-xs text-cyan-300">
                              {item.ruc || 'Sin RUC'}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                item.status === 'declarado'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                  : item.status === 'en_revision'
                                  ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                                  : 'bg-amber-950 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              {item.status === 'en_revision' ? 'En Revisión' : item.status || 'Pendiente'}
                            </span>
                          </div>

                          <h5 className="text-xs font-semibold text-white truncate max-w-[240px]">
                            {item.businessName || 'No especificada'}
                          </h5>

                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-[11px] text-slate-400">
                            <span className="text-emerald-300 font-medium">{item.taxPeriod || 'Sin periodo'}</span>
                            <span>{filesList.length} archivos · {formatFileSize(item.totalSize || 0)}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Submission Details */}
              <div className="lg:col-span-7 flex flex-col min-h-0 bg-[#061022] rounded-2xl border border-slate-800 overflow-hidden">
                {selectedSubmission ? (
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar space-y-4">
                    
                    {/* Header of Detail */}
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base sm:text-lg font-black text-white">
                            RUC: <span className="font-mono text-cyan-300">{selectedSubmission.ruc}</span>
                          </h4>
                          <span className="font-mono text-xs text-slate-400">({selectedSubmission.ticketId})</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium mt-0.5">
                          {selectedSubmission.businessName}
                        </p>
                      </div>

                      {/* Status Badges & Controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(selectedSubmission.id, 'pendiente')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                            selectedSubmission.status === 'pendiente'
                              ? 'bg-amber-950 text-amber-300 border-amber-500'
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          Pendiente
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(selectedSubmission.id, 'en_revision')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                            selectedSubmission.status === 'en_revision'
                              ? 'bg-blue-950 text-blue-300 border-blue-500'
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          En Revisión
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(selectedSubmission.id, 'declarado')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                            selectedSubmission.status === 'declarado'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          Declarado
                        </button>
                      </div>
                    </div>

                    {/* Metadata Box */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block">Periodo Tributario</span>
                        <span className="font-semibold text-white">{selectedSubmission.taxPeriod}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block">WhatsApp Contacto</span>
                        <span className="font-semibold text-emerald-300 font-mono">
                          {selectedSubmission.phone || 'No registrado'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block">Fecha Recepción</span>
                        <span className="font-semibold text-white">{selectedSubmission.date}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block">Peso del Paquete</span>
                        <span className="font-semibold text-emerald-400">{formatFileSize(selectedSubmission.totalSize)}</span>
                      </div>
                    </div>

                    {/* Categories chips */}
                    {Array.isArray(selectedSubmission.docCategories) && selectedSubmission.docCategories.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1.5">
                          Categorías Reportadas por el Cliente:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSubmission.docCategories.map((c, i) => (
                            <span
                              key={`detail_cat_${c}_${i}`}
                              className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-medium"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Client notes if any */}
                    {selectedSubmission.notes && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                        <span className="text-cyan-400 font-semibold block mb-0.5">Indicaciones del cliente:</span>
                        <p className="italic">«{selectedSubmission.notes}»</p>
                      </div>
                    )}

                    {/* Files Section with Direct Download Buttons */}
                    {(() => {
                      const filesArray = Array.isArray(selectedSubmission.files) ? selectedSubmission.files : [];
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Archivos en Cloud Storage ({filesArray.length}):
                            </span>
                          </div>

                          <div className="space-y-2">
                            {filesArray.length === 0 ? (
                              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 text-center">
                                No se registraron archivos adjuntos en este envío.
                              </div>
                            ) : (
                              filesArray.map((file, idx) => (
                                <div
                                  key={`sub_${selectedSubmission.id}_file_${file.name || 'doc'}_${idx}`}
                                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                      {getFileIcon(file.extension || 'pdf')}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs" title={file.name}>
                                        {file.name || 'Archivo sin nombre'}
                                      </p>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {(file.extension || 'DOC').toUpperCase()} · {formatFileSize(file.size || 0)}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    disabled={downloadingKey === `${selectedSubmission.id}_${idx}`}
                                    onClick={() => handleDownloadFile(file, idx)}
                                    className="px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-60"
                                  >
                                    {downloadingKey === `${selectedSubmission.id}_${idx}` ? (
                                      <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                                        <span>Descargando...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Descargar</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Bottom Action Buttons */}
                    <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => handleReplyWhatsApp(selectedSubmission)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {selectedSubmission.phone
                          ? `Enviar WhatsApp al ${selectedSubmission.phone}`
                          : 'Responder por WhatsApp al Cliente'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(selectedSubmission)}
                        className="px-3 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar Registro
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                    <FileText className="w-12 h-12 text-slate-600 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-medium text-slate-400">Selecciona un envío para ver sus detalles</p>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs">
                      Haz clic en cualquier cliente de la lista izquierda para revisar sus comprobantes e indicaciones.
                    </p>
                  </div>
                )}
              </div>

            </div>
            </>
            ) : activeTab === 'notifications' ? (
              /* Tab 2: Notificaciones SUNAT / SUNAFIL & Consultas con PDF */
              <div className="flex-1 flex flex-col min-h-0 space-y-4 overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 bg-[#061022] p-3 rounded-2xl border border-slate-800">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={notifSearch}
                      onChange={(e) => setNotifSearch(e.target.value)}
                      placeholder="Buscar por nombre, RUC, empresa o código NTF-..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={notifFilter}
                      onChange={(e) => setNotifFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="todos">Todos los Casos</option>
                      <option value="no_cliente">Solo No Clientes</option>
                      <option value="nuevo">Nuevos</option>
                      <option value="en_revision">En Revisión</option>
                      <option value="atendido">Atendidos</option>
                    </select>

                    <button
                      type="button"
                      onClick={loadData}
                      disabled={isLoading}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors cursor-pointer"
                      title="Actualizar notificaciones"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Split View */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
                  {/* Left List */}
                  <div className="lg:col-span-5 flex flex-col min-h-0 bg-[#061022] rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
                      <span>Casos Recibidos</span>
                      <span className="font-mono text-amber-300">
                        {notifications.filter((n) => !n.isExistingClient).length} no clientes
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                      {(() => {
                        const filtered = notifications.filter((n) => {
                          const q = notifSearch.toLowerCase();
                          const matchSearch =
                            (n.contactName || '').toLowerCase().includes(q) ||
                            (n.ruc || '').toLowerCase().includes(q) ||
                            (n.businessName || '').toLowerCase().includes(q) ||
                            (n.caseId || '').toLowerCase().includes(q);
                          const matchFilter =
                            notifFilter === 'todos'
                              ? true
                              : notifFilter === 'no_cliente'
                              ? !n.isExistingClient
                              : n.status === notifFilter;
                          return matchSearch && matchFilter;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="p-8 text-center text-slate-500 text-xs">
                              No hay notificaciones SUNAT / SUNAFIL registradas todavía.
                            </div>
                          );
                        }

                        return filtered.map((item) => {
                          const isSelected = selectedNotification?.id === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSelectedNotification(item);
                                setConfirmDeleteNotifId(null);
                              }}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-950/40 border-amber-400/80 shadow-md'
                                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] font-bold text-rose-200">
                                  {item.entity}
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                    item.status === 'atendido'
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                      : item.status === 'en_revision'
                                      ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                                      : 'bg-amber-950 text-amber-300 border-amber-500/40'
                                  }`}
                                >
                                  {item.status === 'en_revision' ? 'En Revisión' : item.status}
                                </span>
                              </div>

                              <h5 className="text-xs font-bold text-white truncate">
                                {item.contactName} {item.ruc ? `· RUC ${item.ruc}` : ''}
                              </h5>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {item.businessName}
                              </p>

                              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-[10px]">
                                <span className={item.isExistingClient ? 'text-cyan-300' : 'text-amber-300 font-semibold'}>
                                  {item.isExistingClient ? 'Cliente actual' : 'No cliente (Nuevo)'}
                                </span>
                                <span className="text-slate-400">
                                  {item.pdfFileName ? '📄 PDF adjunto' : 'Sin PDF'}
                                </span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Right Detail */}
                  <div className="lg:col-span-7 flex flex-col min-h-0 bg-[#061022] rounded-2xl border border-slate-800 overflow-hidden">
                    {selectedNotification ? (
                      <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-[11px] font-bold text-rose-200">
                                {selectedNotification.entity}
                              </span>
                              <span className="font-mono text-xs text-slate-400">
                                {selectedNotification.caseId}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  selectedNotification.isExistingClient
                                    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                                    : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
                                }`}
                              >
                                {selectedNotification.isExistingClient
                                  ? 'Ya es cliente'
                                  : 'Aún no es cliente'}
                              </span>
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-white mt-1.5">
                              {selectedNotification.contactName}
                            </h4>
                            <p className="text-xs text-slate-300">
                              {selectedNotification.businessName}{' '}
                              {selectedNotification.ruc ? `— RUC: ${selectedNotification.ruc}` : ''}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {(['nuevo', 'en_revision', 'atendido'] as const).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={async () => {
                                  try {
                                    await updateNotificationStatus(selectedNotification.id, st);
                                    setNotifications((prev) =>
                                      prev.map((n) =>
                                        n.id === selectedNotification.id ? { ...n, status: st } : n
                                      )
                                    );
                                    setSelectedNotification((prev) =>
                                      prev ? { ...prev, status: st } : null
                                    );
                                  } catch (err) {
                                    console.error('Error updating notification status:', err);
                                  }
                                }}
                                className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                                  selectedNotification.status === st
                                    ? st === 'atendido'
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                                      : st === 'en_revision'
                                      ? 'bg-blue-950 text-blue-300 border-blue-500'
                                      : 'bg-amber-950 text-amber-300 border-amber-500'
                                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                                }`}
                              >
                                {st === 'en_revision'
                                  ? 'En Revisión'
                                  : st === 'atendido'
                                  ? 'Atendido'
                                  : 'Nuevo'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">Teléfono / WhatsApp</span>
                            <span className="font-mono font-bold text-emerald-300">
                              {selectedNotification.phone}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">Fecha de Envío</span>
                            <span className="font-semibold text-white">
                              {selectedNotification.dateFormatted || selectedNotification.createdAt}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">Motivo</span>
                            <span className="font-semibold text-cyan-300">
                              {selectedNotification.serviceInterest}
                            </span>
                          </div>
                        </div>

                        {selectedNotification.message && (
                          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                            <span className="text-amber-300 font-semibold block mb-1">
                              Detalle del mensaje:
                            </span>
                            <p className="leading-relaxed whitespace-pre-wrap">
                              {selectedNotification.message}
                            </p>
                          </div>
                        )}

                        {/* PDF Box */}
                        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Documento PDF de Notificación
                            </span>
                          </div>

                          {selectedNotification.pdfFileName ? (
                            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#071329] border border-cyan-500/30">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4 text-rose-300" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-white truncate max-w-[240px]">
                                    {selectedNotification.pdfFileName}
                                  </p>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    PDF · {formatFileSize(selectedNotification.pdfFileSize)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const link = `${window.location.origin}/#notificacion=${selectedNotification.caseId}`;
                                    try {
                                      await navigator.clipboard.writeText(link);
                                      setCopiedNotifLink(true);
                                      setTimeout(() => setCopiedNotifLink(false), 2500);
                                    } catch {
                                      // ignore
                                    }
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{copiedNotifLink ? 'Copiado' : 'Copiar link'}</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={downloadingNotifId === selectedNotification.id}
                                  onClick={async () => {
                                    setDownloadingNotifId(selectedNotification.id);
                                    try {
                                      await downloadNotificationPdf(selectedNotification);
                                    } catch (err) {
                                      console.error('Error downloading PDF:', err);
                                    } finally {
                                      setDownloadingNotifId(null);
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>
                                    {downloadingNotifId === selectedNotification.id
                                      ? 'Descargando...'
                                      : 'Descargar PDF'}
                                  </span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400">
                              El remitente no adjuntó archivo PDF en esta solicitud.
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                          {(() => {
                            const digits = (selectedNotification.phone || '').replace(/\D/g, '');
                            const fullNum =
                              digits.length >= 9
                                ? digits.startsWith('51')
                                  ? digits
                                  : `51${digits}`
                                : '';
                            const replyMsg =
                              `*LEADER CONSULTORES - ATENCIÓN ${selectedNotification.entity}*\n` +
                              `Hola *${selectedNotification.contactName}*, hemos recibido tu caso (${selectedNotification.caseId}). Nuestro equipo está revisando la información para orientarte sobre los plazos y acciones recomendadas.`;
                            const replyHref = fullNum
                              ? `https://wa.me/${fullNum}?text=${encodeURIComponent(replyMsg)}`
                              : `https://wa.me/?text=${encodeURIComponent(replyMsg)}`;
                            return (
                              <a
                                href={replyHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                              >
                                <MessageSquare className="w-4 h-4" />
                                <span>Responder por WhatsApp al {selectedNotification.phone}</span>
                              </a>
                            );
                          })()}

                          {confirmDeleteNotifId === selectedNotification.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await deleteNotificationCase(selectedNotification);
                                    setNotifications((prev) =>
                                      prev.filter((n) => n.id !== selectedNotification.id)
                                    );
                                    setSelectedNotification(null);
                                    setConfirmDeleteNotifId(null);
                                  } catch (err) {
                                    console.error('Error deleting notification case:', err);
                                  }
                                }}
                                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                              >
                                Confirmar eliminación
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteNotifId(null)}
                                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteNotifId(selectedNotification.id)}
                              className="px-3 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar Caso</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                        <AlertTriangle className="w-12 h-12 text-amber-500/50 mb-2 stroke-[1.5]" />
                        <p className="text-sm font-medium text-slate-400">
                          Selecciona una notificación para ver detalles y descargar el PDF
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : activeTab === 'video' ? (
              /* Tab 3: Video Management Studio */
              <div className="flex-1 overflow-y-auto custom-scrollbar p-1 sm:p-2">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Form & Controls */}
                  <div className="lg:col-span-7 space-y-4 bg-[#061022] p-5 sm:p-6 rounded-2xl border border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h4 className="text-base sm:text-lg font-bold text-white">
                          Gestión de la Cápsula en Video del Día
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Actualiza fácilmente el video informativo diario de Leader. Los cambios se sincronizan en la nube y se visualizan al instante en la página web.
                      </p>
                    </div>

                    {/* Mode Selector */}
                    <div className="bg-[#050C1B] p-1.5 rounded-2xl border border-slate-700/80 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (!videoUrl) setVideoUrl(DEFAULT_DAILY_VIDEO.videoUrl);
                          setVideoError('');
                          setVideoSaveSuccess(false);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          videoUrl
                            ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-200 border border-cyan-400/50 shadow-md shadow-cyan-950/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Film className="w-4 h-4 text-cyan-400" />
                        <span>Publicar con Video (9:16)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemovePublishedVideo}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          !videoUrl
                            ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/25 text-emerald-200 border border-emerald-400/50 shadow-md shadow-emerald-950/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>Publicar Solo Texto (Sin Video)</span>
                      </button>
                    </div>

                    <form onSubmit={handleSaveVideo} className="space-y-4">
                      {/* Video File / URL Input */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                            1. Video Informativo (Opcional)
                          </label>
                          {videoUrl ? (
                            <button
                              type="button"
                              onClick={handleRemovePublishedVideo}
                              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                              title="Borrar video de la portada para mostrar solo texto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Borrar video</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
                              <VideoOff className="w-3 h-3" />
                              Modo Solo Texto Activo
                            </span>
                          )}
                        </div>

                        {/* File Upload Button & Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-cyan-500/50 hover:border-cyan-400 bg-cyan-950/30 hover:bg-cyan-950/60 text-cyan-300 text-xs font-semibold cursor-pointer transition-all">
                            <UploadCloud className="w-4 h-4 text-cyan-400" />
                            <span>{localVideoFileName ? 'Cambiar archivo seleccionado' : (videoUrl ? 'Cambiar video (.mp4, .webm)' : 'Subir un nuevo video (.mp4)')}</span>
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/quicktime"
                              onChange={handleVideoFileChange}
                              className="hidden"
                            />
                          </label>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 truncate">
                            <div className="flex items-center truncate">
                              {videoUrl ? (
                                <Video className="w-4 h-4 text-emerald-400 shrink-0 mr-2" />
                              ) : (
                                <VideoOff className="w-4 h-4 text-slate-500 shrink-0 mr-2" />
                              )}
                              <span className="truncate">
                                {localVideoFileName
                                  ? `Archivo: ${localVideoFileName}`
                                  : (videoUrl ? 'Video cargado activo' : 'Sin video (Solo texto)')}
                              </span>
                            </div>

                            {videoUrl && (
                              <button
                                type="button"
                                onClick={handleRemovePublishedVideo}
                                className="p-1 hover:bg-rose-900/40 text-rose-400 rounded transition-colors ml-2 shrink-0 cursor-pointer"
                                title="Borrar video actual"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Text URL input */}
                        <div className="relative mb-2">
                          <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => {
                              setVideoUrl(e.target.value);
                              setLocalVideoFileName('');
                              setVideoSaveSuccess(false);
                            }}
                            placeholder="Pega enlace de YouTube / Shorts / Vimeo (ahorra ancho de banda) o ruta local"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
                          />
                        </div>

                        {/* Direct Delete Video Action Button */}
                        {videoUrl ? (
                          <button
                            type="button"
                            onClick={handleRemovePublishedVideo}
                            className="w-full py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Borrar Video Ahora (Publicar Solo Texto en la Web)</span>
                          </button>
                        ) : (
                          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span>Modo Solo Texto activo. El recuadro del video no se mostrará en la web.</span>
                          </div>
                        )}
                      </div>

                      {/* Video Title */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                          2. Título del Comunicado o Cápsula <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          placeholder="Ej: Depósito de la CTS Noviembre 2026: Plazos y Multas SUNAFIL"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
                          required
                        />
                      </div>

                      {/* Video Category & Quick Presets */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                            3. Categoría / Tema
                          </label>
                          <span className="text-[10px] text-slate-400">Atajos rápidos:</span>
                        </div>
                        <input
                          type="text"
                          value={videoCategory}
                          onChange={(e) => setVideoCategory(e.target.value)}
                          placeholder="Ej: Laboral & Planillas, SUNAT, Vencimientos"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 mb-2"
                        />
                        {/* Quick category badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {['Laboral & Planillas', 'Vencimientos SUNAT', 'Alerta SUNAFIL', 'SIRE & Facturación', 'Régimen MYPE'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setVideoCategory(cat)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                            >
                              + {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Video Description */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                          4. Resumen / Texto Informativo para el Cliente
                        </label>
                        <textarea
                          rows={3}
                          value={videoDescription}
                          onChange={(e) => setVideoDescription(e.target.value)}
                          placeholder="Indica las fechas límite, recomendaciones o sanciones que se muestran en el comunicado..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 resize-none"
                        />
                      </div>

                      {/* Error banner */}
                      {videoError && (
                        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>{videoError}</span>
                        </div>
                      )}

                      {/* Feedback banner */}
                      {videoSaveSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                          <span>{videoStatusMessage || '¡Cambios guardados con éxito en la web!'}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={handleResetDefaultVideo}
                            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                            title="Restaurar el video oficial de la CTS"
                          >
                            Restaurar video original (CTS)
                          </button>

                          {videoUrl && (
                            <button
                              type="button"
                              onClick={handleRemovePublishedVideo}
                              className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Quitar Video (Solo Texto)</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isSavingVideo}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {isSavingVideo ? 'Publicando...' : 'Guardar y Publicar en la Web'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Live Preview (Video or Text Mode) */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      {videoUrl ? 'Previsualización del Video (Formato 9:16)' : 'Previsualización: Modo Solo Texto'}
                    </span>

                    {videoUrl ? (
                      <div className="relative w-full max-w-[270px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/60">
                        {getEmbedVideoUrl(videoUrl) ? (
                          <iframe
                            key={videoUrl}
                            src={getEmbedVideoUrl(videoUrl) || ''}
                            title={videoTitle || 'Video informativo'}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            key={videoUrl}
                            src={videoUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-[9px] font-bold text-cyan-300 uppercase">
                            {videoCategory || 'Actualidad'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-[8px] font-bold text-emerald-300 border border-emerald-500/40">
                            En Vivo
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Text-only preview */
                      <div className="w-full max-w-[310px] rounded-3xl bg-[#061022] border-2 border-cyan-500/40 p-5 shadow-xl text-left space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-400/30 text-[10px] font-bold text-cyan-300 uppercase">
                            {videoCategory || 'Actualidad'}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Solo Texto
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-white line-clamp-2 leading-tight">
                          {videoTitle}
                        </h5>

                        <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 line-clamp-5 leading-relaxed">
                          {videoDescription || 'Sin descripción ingresada.'}
                        </div>

                        <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[10px] text-cyan-300 flex items-center gap-2">
                          <VideoOff className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>El recuadro de video desaparecerá en la web pública.</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 text-center max-w-[270px]">
                      <p className="text-xs font-bold text-white truncate">{videoTitle}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{videoDescription}</p>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* Tab 4: Google Analytics 4 Configuration */
              <div className="flex-1 overflow-y-auto custom-scrollbar p-1 sm:p-2">
                <div className="max-w-3xl mx-auto space-y-6 bg-[#061022] p-6 sm:p-8 rounded-2xl border border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-300">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-extrabold text-white">
                          Conectar Google Analytics 4 (GA4)
                        </h4>
                        <p className="text-xs text-slate-400">
                          Mide visitas reales por día, ubicación (Chincha, Lima, Ica), dispositivos y clics sin consumir cuota de Render.
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://analytics.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Abrir Google Analytics</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Quick 3-step instructions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">
                        Paso 1
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        Ingresa a <strong className="text-white">analytics.google.com</strong> y crea una cuenta/propiedad para tu web.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">
                        Paso 2
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        Elige flujo <strong className="text-white">Web</strong>, pega la URL de tu página y copia el <strong className="text-white">ID de medición</strong> (<code className="text-cyan-300">G-...</code>).
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">
                        Paso 3
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        Pégalo abajo y presiona <strong className="text-white">Guardar</strong>. En unos minutos empezarás a ver visitas en tiempo real.
                      </p>
                    </div>
                  </div>

                  {getEnvMeasurementId() ? (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Google Analytics está activo por variable de entorno (<code className="font-mono font-bold">{getEnvMeasurementId()}</code>).
                      </span>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setGaError('');
                        setGaSaveMessage('');
                        const trimmed = gaMeasurementId.trim().toUpperCase();
                        if (trimmed && !isValidMeasurementId(trimmed)) {
                          setGaError('El formato debe ser similar a G-XXXXXXXXXX (empieza con G- seguido de letras o números).');
                          return;
                        }
                        setIsSavingGa(true);
                        try {
                          await saveAnalyticsConfig(trimmed);
                          setGaMeasurementId(trimmed);
                          setGaSaveMessage(
                            trimmed
                              ? `¡Conectado con éxito! El ID ${trimmed} ya está midiendo visitas y consultas en la web.`
                              : 'Se desactivó el seguimiento de Google Analytics.'
                          );
                        } catch (err) {
                          console.error('Error saving analytics config:', err);
                          setGaError('No se pudo guardar en Firestore. Intenta nuevamente.');
                        } finally {
                          setIsSavingGa(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                          ID de Medición de Google Analytics 4 (GA4)
                        </label>
                        <input
                          type="text"
                          value={gaMeasurementId}
                          onChange={(e) => {
                            setGaMeasurementId(e.target.value);
                            setGaSaveMessage('');
                            setGaError('');
                          }}
                          placeholder="Ej. G-ABCD123456"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
                        />
                        <p className="text-[11px] text-slate-400 mt-1.5">
                          Déjalo vacío y guarda si alguna vez deseas pausar el rastreo.
                        </p>
                      </div>

                      {gaError && (
                        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{gaError}</span>
                        </div>
                      )}

                      {gaSaveMessage && (
                        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{gaSaveMessage}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                        <span className="text-xs text-slate-400">
                          Estado:{' '}
                          {isValidMeasurementId(gaMeasurementId) ? (
                            <strong className="text-emerald-400">Activo ({gaMeasurementId.toUpperCase()})</strong>
                          ) : (
                            <strong className="text-amber-300">Pendiente de ingresar ID</strong>
                          )}
                        </span>

                        <button
                          type="submit"
                          disabled={isSavingGa}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isSavingGa ? 'Guardando...' : 'Guardar ID de Analytics'}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </motion.div>
    </div>
  );
};
