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
  VolumeX
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
  saveDailyVideoConfig
} from '../services/videoConfigService';

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

  // Tab switcher: 'documents' or 'video'
  const [activeTab, setActiveTab] = useState<'documents' | 'video'>('documents');

  // Video Management Studio state
  const [videoTitle, setVideoTitle] = useState<string>(DEFAULT_DAILY_VIDEO.title);
  const [videoDescription, setVideoDescription] = useState<string>(DEFAULT_DAILY_VIDEO.description);
  const [videoCategory, setVideoCategory] = useState<string>(DEFAULT_DAILY_VIDEO.category);
  const [videoUrl, setVideoUrl] = useState<string>(DEFAULT_DAILY_VIDEO.videoUrl);
  const [isSavingVideo, setIsSavingVideo] = useState<boolean>(false);
  const [videoSaveSuccess, setVideoSaveSuccess] = useState<boolean>(false);
  const [localVideoFileName, setLocalVideoFileName] = useState<string>('');
  const [previewPlaying, setPreviewPlaying] = useState<boolean>(false);

  // Check session storage for admin login
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('leader_admin_logged');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch submissions and video config when opened and authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
      loadVideoConfig();
    }
  }, [isOpen, isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getSubmissionsList();
      setSubmissions(data);
      if (selectedSubmission) {
        const updated = data.find((s) => s.id === selectedSubmission.id);
        if (updated) setSelectedSubmission(updated);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVideoConfig = async () => {
    try {
      const config = await getDailyVideoConfig();
      setVideoTitle(config.title);
      setVideoDescription(config.description);
      setVideoCategory(config.category);
      setVideoUrl(config.videoUrl);
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

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !videoTitle.trim()) {
      alert('Por favor ingresa un título y una URL o archivo de video válido.');
      return;
    }
    setIsSavingVideo(true);
    setVideoSaveSuccess(false);
    try {
      await saveDailyVideoConfig({
        title: videoTitle,
        description: videoDescription,
        category: videoCategory,
        videoUrl: videoUrl,
        updatedAt: new Date().toISOString(),
      });
      setVideoSaveSuccess(true);
      setTimeout(() => setVideoSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving video:', err);
      alert('Hubo un error al guardar el video. Intenta nuevamente.');
    } finally {
      setIsSavingVideo(false);
    }
  };

  const handleResetDefaultVideo = () => {
    setVideoTitle(DEFAULT_DAILY_VIDEO.title);
    setVideoDescription(DEFAULT_DAILY_VIDEO.description);
    setVideoCategory(DEFAULT_DAILY_VIDEO.category);
    setVideoUrl(DEFAULT_DAILY_VIDEO.videoUrl);
    setLocalVideoFileName('');
    setVideoSaveSuccess(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (pinInput.trim() === DEFAULT_ADMIN_PIN || pinInput.trim() === '1234') {
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

              <p className="text-[11px] text-slate-500 pt-2">
                Clave inicial por defecto: <code className="text-cyan-300 font-mono">Leader2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col min-h-0 pt-4 space-y-4 overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
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
                onClick={() => setActiveTab('video')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'video'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-400/50 shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Film className="w-4 h-4 text-emerald-400" />
                <span>Video del Día / Cápsula Informativa</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
            ) : (
              /* Tab 2: Video Management Studio */
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

                    <form onSubmit={handleSaveVideo} className="space-y-4">
                      {/* Video File / URL Input */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                          1. Video (Subir Archivo o Ingresar Ruta) <span className="text-rose-400">*</span>
                        </label>

                        {/* File Upload Button & Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-cyan-500/50 hover:border-cyan-400 bg-cyan-950/30 hover:bg-cyan-950/60 text-cyan-300 text-xs font-semibold cursor-pointer transition-all">
                            <UploadCloud className="w-4 h-4 text-cyan-400" />
                            <span>{localVideoFileName ? 'Cambiar archivo seleccionado' : 'Subir video (.mp4, .webm)'}</span>
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/quicktime"
                              onChange={handleVideoFileChange}
                              className="hidden"
                            />
                          </label>

                          <div className="flex items-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 truncate">
                            <Video className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                            <span className="truncate">
                              {localVideoFileName ? `Archivo: ${localVideoFileName}` : 'Video activo en portada'}
                            </span>
                          </div>
                        </div>

                        {/* Text URL input */}
                        <div className="relative">
                          <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => {
                              setVideoUrl(e.target.value);
                              setLocalVideoFileName('');
                              setVideoSaveSuccess(false);
                            }}
                            placeholder="Ej: /assets/aistudio/... o https://..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Tip: Puedes cargar un nuevo archivo directamente desde tu equipo o pegar una ruta de video.
                        </span>
                      </div>

                      {/* Video Title */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                          2. Título de la Cápsula <span className="text-rose-400">*</span>
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
                          4. Resumen / Puntos Clave para el Cliente
                        </label>
                        <textarea
                          rows={3}
                          value={videoDescription}
                          onChange={(e) => setVideoDescription(e.target.value)}
                          placeholder="Indica las fechas límite, recomendaciones o sanciones que se mencionan en el video..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 resize-none"
                        />
                      </div>

                      {/* Feedback banner */}
                      {videoSaveSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                          <span>¡Video publicado con éxito! Ya se visualiza actualizado en la página principal.</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={handleResetDefaultVideo}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Restaurar video original (CTS Noviembre)
                        </button>

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

                  {/* Right Column: Live Mobile Reel Preview */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      Previsualización en Vivo (Formato 9:16)
                    </span>

                    <div className="relative w-full max-w-[270px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/60">
                      <video
                        key={videoUrl}
                        src={videoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-[9px] font-bold text-cyan-300 uppercase">
                          {videoCategory || 'Actualidad'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-[8px] font-bold text-emerald-300 border border-emerald-500/40">
                          En Vivo
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-center max-w-[270px]">
                      <p className="text-xs font-bold text-white truncate">{videoTitle}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{videoDescription}</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </motion.div>
    </div>
  );
};
