import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  FileCheck2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Building,
  Calendar,
  ShieldCheck,
  Download,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  X,
  Check
} from 'lucide-react';
import { LEADER_INFO } from '../data/content';
import { uploadClientDocuments } from '../services/submissionsService';

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  extension: string;
  fileObj?: File;
}

export interface ClientSubmission {
  ticketId: string;
  date: string;
  ruc: string;
  businessName: string;
  phone?: string;
  taxPeriod: string;
  docCategories: string[];
  notes: string;
  files: { name: string; size: number; extension: string }[];
  totalSize: number;
}

export interface ClientDocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const YEARS = ['2026', '2025', '2024'];

const DOC_CATEGORIES = [
  { id: 'compras', label: 'Facturas de Compras / Gastos' },
  { id: 'ventas', label: 'Registro de Ventas Emitidas' },
  { id: 'bancos', label: 'Extractos Bancarios' },
  { id: 'planillas', label: 'Planilla / Boletas PLAME' },
  { id: 'xml_cdr', label: 'Archivos XML & CDR SUNAT' },
  { id: 'guias_otros', label: 'Guías de Remisión / Otros' },
];

export const ClientDocumentUpload: React.FC<ClientDocumentUploadProps> = ({
  isOpen,
  onClose,
}) => {
  // Form state
  const [ruc, setRuc] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Enero');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['compras', 'ventas']);
  const [notes, setNotes] = useState('');

  // Drag and drop / files state
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Upload simulation & submission state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submittedTicket, setSubmittedTicket] = useState<ClientSubmission | null>(null);

  // History state
  const [history, setHistory] = useState<ClientSubmission[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('leader_client_document_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Prevent background scroll when modal is open and handle ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
  };

  const getFileIcon = (ext: string) => {
    switch (ext) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'xml':
        return <FileCode className="w-5 h-5 text-cyan-400" />;
      case 'doc':
      case 'docx':
        return <FileCheck2 className="w-5 h-5 text-blue-400" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'zip':
      case 'rar':
        return <FileArchive className="w-5 h-5 text-amber-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleRucChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 11);
    setRuc(cleaned);
    if (errorMsg) setErrorMsg(null);
  };

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const processFileList = (rawFiles: FileList | null) => {
    if (!rawFiles || rawFiles.length === 0) return;
    setErrorMsg(null);

    const allowedExtensions = ['pdf', 'xml', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'zip', 'rar'];
    const newItems: UploadedFileItem[] = [];

    for (let i = 0; i < rawFiles.length; i++) {
      const file = rawFiles[i];
      const ext = getFileExtension(file.name);

      if (!allowedExtensions.includes(ext)) {
        setErrorMsg(`El formato ".${ext}" no está permitido. Utiliza PDF, XML, Word, Excel o ZIP.`);
        continue;
      }

      // Check duplicate by name + size
      const isDuplicate = files.some(
        (existing) => existing.name === file.name && existing.size === file.size
      );

      if (!isDuplicate) {
        newItems.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          extension: ext,
          fileObj: file,
        });
      }
    }

    if (newItems.length > 0) {
      setFiles((prev) => [...prev, ...newItems]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFileList(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validations
    if (!ruc || ruc.length !== 11) {
      setErrorMsg('Por favor ingresa un RUC válido de 11 dígitos.');
      return;
    }

    if (files.length === 0) {
      setErrorMsg('Debes adjuntar al menos un archivo (PDF, XML, Word o Excel).');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const submission = await uploadClientDocuments(
        {
          ruc,
          businessName,
          phone,
          taxPeriod: `${selectedMonth} ${selectedYear}`,
          docCategories: selectedCategories,
          notes,
          files,
        },
        (pct) => setUploadProgress(pct)
      );

      setSubmittedTicket(submission);

      // Save to local client history
      try {
        const nextHistory = [submission, ...history.slice(0, 9)];
        setHistory(nextHistory);
        localStorage.setItem('leader_client_document_history', JSON.stringify(nextHistory));
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Error during document upload:', err);
      setErrorMsg('Hubo una demora en la conexión. Por favor reintenta en unos momentos.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setFiles([]);
    setNotes('');
    setUploadProgress(0);
  };

  const handleWhatsAppNotify = (ticket: ClientSubmission) => {
    const fileListText = ticket.files
      .slice(0, 6)
      .map((f, i) => `   ${i + 1}. ${f.name} (${formatFileSize(f.size)})`)
      .join('\n');

    const extraFilesText =
      ticket.files.length > 6 ? `\n   ... y ${ticket.files.length - 6} archivo(s) más.` : '';

    const categoriesText = ticket.docCategories
      .map((c) => DOC_CATEGORIES.find((item) => item.id === c)?.label || c)
      .join(', ');

    const message =
      `📄 *ENVÍO DE DOCUMENTOS CONTABLES - LEADER*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎟️ *Ticket:* \`${ticket.ticketId}\`\n` +
      `🏢 *Empresa / Titular:* ${ticket.businessName}\n` +
      `📋 *RUC:* ${ticket.ruc}\n` +
      `📅 *Periodo Tributario:* ${ticket.taxPeriod}\n` +
      `📦 *Tipo de Docs:* ${categoriesText || 'General'}\n` +
      `📎 *Archivos Adjuntos (${ticket.files.length}):*\n` +
      `${fileListText}${extraFilesText}\n` +
      `💾 *Peso Total:* ${formatFileSize(ticket.totalSize)}\n` +
      (ticket.notes ? `📝 *Notas:* ${ticket.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Estimado Jorge Pasache / Equipo Leader, acabo de enviar los documentos contables de mi negocio a través del portal flotante. Quedo atento a la confirmación de recepción.`;

    const waUrl = `https://wa.me/51913150524?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadReceipt = (ticket: ClientSubmission) => {
    const content =
      `==================================================\n` +
      `        LEADER - ASESORÍA CONTABLE Y TRIBUTARIA   \n` +
      `           CONSTANCIA DE RECEPCIÓN DIGITAL        \n` +
      `==================================================\n\n` +
      `Ticket de Recepción : ${ticket.ticketId}\n` +
      `Fecha y Hora        : ${ticket.date}\n` +
      `RUC del Cliente     : ${ticket.ruc}\n` +
      `Razón Social        : ${ticket.businessName}\n` +
      `Periodo Tributario  : ${ticket.taxPeriod}\n` +
      `Total de Archivos   : ${ticket.files.length}\n` +
      `Peso Total          : ${formatFileSize(ticket.totalSize)}\n\n` +
      `DETALLE DE DOCUMENTOS ADJUNTOS:\n` +
      ticket.files.map((f, i) => `  ${i + 1}. [${f.extension.toUpperCase()}] ${f.name} - ${formatFileSize(f.size)}`).join('\n') +
      `\n\n` +
      (ticket.notes ? `NOTAS DEL CLIENTE:\n${ticket.notes}\n\n` : '') +
      `ESTADO: REGISTRADO CON ÉXITO\n` +
      `Asesor a cargo: Jorge Pasache (Consultor Principal)\n` +
      `Teléfono: +51 913 150 524 / +51 933 884 597\n` +
      `Chincha, Ica - Perú\n` +
      `==================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Constancia_Recepcion_${ticket.ticketId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isRucValid = ruc.length === 11;
  const totalFilesSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          
          {/* Backdrop Click Dismiss Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-transparent"
          />

          {/* Floating Window Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 25 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative w-full max-w-4xl bg-gradient-to-b from-[#0A1938] via-[#08152E] to-[#050D1E] border border-cyan-500/40 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl shadow-black/80 my-auto z-10 max-h-[92vh] overflow-y-auto custom-scrollbar"
          >
            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/80 transition-all cursor-pointer z-20 group"
              aria-label="Cerrar ventana flotante"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Floating Portal Header */}
            <div className="text-center max-w-2xl mx-auto mb-8 pr-8 sm:pr-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2.5 shadow-md">
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                Portal Flotante de Clientes Leader
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Envía tus Documentos <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">para la Declaración</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed text-balance">
                Ingresa tu RUC, periodo tributario y arrastra tus archivos (PDF, XML, Word, Excel, ZIP) para procesar tus declaraciones y registros contables.
              </p>
            </div>

            {/* Success Confirmation Mode */}
            {submittedTicket ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0B1E42] via-[#091834] to-[#071328] border border-emerald-500/40 shadow-2xl text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <CheckCircle className="w-7 h-7" />
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30">
                  Documentos Registrados con Éxito
                </span>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2.5">
                  Ticket: <span className="text-cyan-400 font-mono">{submittedTicket.ticketId}</span>
                </h3>

                <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                  Se registraron <strong className="text-white">{submittedTicket.files.length} archivo(s)</strong> para el RUC <strong className="text-cyan-300 font-mono">{submittedTicket.ruc}</strong> (Periodo <strong className="text-emerald-300">{submittedTicket.taxPeriod}</strong>).
                </p>

                {/* Ticket Details Box */}
                <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-700/70 text-left text-xs text-slate-300 space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Razón Social:</span>
                    <span className="font-semibold text-white">{submittedTicket.businessName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Fecha y hora:</span>
                    <span className="font-semibold text-white">{submittedTicket.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Peso Total:</span>
                    <span className="font-semibold text-emerald-400">{formatFileSize(submittedTicket.totalSize)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Archivos incluidos:</span>
                    <div className="max-h-28 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {submittedTicket.files.map((file, idx) => (
                        <div key={`ticket_file_${file.name || 'file'}_${idx}`} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-800/60">
                          <span className="truncate max-w-[240px] sm:max-w-md text-slate-200">
                            {idx + 1}. {file.name}
                          </span>
                          <span className="text-[11px] font-mono text-cyan-300 shrink-0 ml-2">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppNotify(submittedTicket)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 transition-all hover:scale-102 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Notificar a Jorge Pasache por WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadReceipt(submittedTicket)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    Descargar Constancia (.txt)
                  </button>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Subir otro paquete
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Upload Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  
                  {/* 1. RUC Input */}
                  <div>
                    <label htmlFor="modal-client-ruc" className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                      1. RUC del Contribuyente / Empresa <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="modal-client-ruc"
                        type="text"
                        inputMode="numeric"
                        value={ruc}
                        onChange={(e) => handleRucChange(e.target.value)}
                        placeholder="Ej: 20601234567 o 10456789012"
                        className={`w-full px-3.5 py-3 rounded-xl bg-[#061127] border text-white font-mono text-sm focus:outline-none transition-all placeholder:text-slate-500 ${
                          isRucValid
                            ? 'border-emerald-500/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                            : 'border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                        }`}
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                        {isRucValid ? (
                          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/40">
                            <Check className="w-3 h-3" /> 11 dígitos
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">
                            {ruc.length}/11
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Razón Social */}
                  <div>
                    <label htmlFor="modal-client-name" className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                      2. Razón Social / Nombre del Negocio
                    </label>
                    <div className="relative">
                      <input
                        id="modal-client-name"
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ej: Comercial Chincha SAC / Bodega Don Pepe"
                        className="w-full px-3.5 py-3 rounded-xl bg-[#061127] border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-sm focus:outline-none transition-all placeholder:text-slate-500"
                      />
                      <Building className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* 3. WhatsApp / Celular de Contacto */}
                  <div className="md:col-span-2 sm:md:col-span-1">
                    <label htmlFor="modal-client-phone" className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                      3. WhatsApp / Celular de Contacto <span className="text-emerald-400 text-[10px] font-normal">(Para enviarte la confirmación)</span>
                    </label>
                    <div className="relative">
                      <input
                        id="modal-client-phone"
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                        placeholder="Ej: 913 150 524"
                        className="w-full px-3.5 py-3 rounded-xl bg-[#061127] border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white font-mono text-sm focus:outline-none transition-all placeholder:text-slate-500"
                      />
                      <MessageSquare className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* 4. Periodo Tributario */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                      4. Periodo Tributario <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#061127] border border-slate-700 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-cyan-400 transition-all appearance-none cursor-pointer"
                        >
                          {MONTHS.map((m) => (
                            <option key={m} value={m} className="bg-[#061127] text-white">
                              Mes: {m}
                            </option>
                          ))}
                        </select>
                        <Calendar className="w-4 h-4 text-cyan-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#061127] border border-slate-700 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-cyan-400 transition-all appearance-none cursor-pointer"
                        >
                          {YEARS.map((y) => (
                            <option key={y} value={y} className="bg-[#061127] text-white">
                              Ejercicio: {y}
                            </option>
                          ))}
                        </select>
                        <Calendar className="w-4 h-4 text-cyan-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* 5. Categorías */}
                  <div className="md:col-span-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
                      5. Tipo de Documentos Adjuntos
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {DOC_CATEGORIES.map((cat) => {
                        const isSelected = selectedCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryToggle(cat.id)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-950/70 border-cyan-400/60 text-cyan-200 font-semibold'
                                : 'bg-[#061127]/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-cyan-500 border-cyan-400 text-white'
                                  : 'border-slate-600 bg-transparent'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className="truncate">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* 5. Drag & Drop Multi-file Upload Area */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      6. Adjuntar Documentos (PDF, XML, Word, Excel, ZIP) <span className="text-rose-400">*</span>
                    </label>
                    {files.length > 0 && (
                      <span className="text-xs text-slate-400">
                        {files.length} archivo(s) · {formatFileSize(totalFilesSize)}
                      </span>
                    )}
                  </div>

                  {/* Dropzone Container */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${
                      isDragging
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-xl shadow-cyan-900/40 scale-[1.01]'
                        : 'border-slate-700/80 bg-[#061127]/80 hover:border-cyan-400/50 hover:bg-[#061127]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.xml,.doc,.docx,.xls,.xlsx,.csv,.zip,.rar"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud className={`w-6 h-6 ${isDragging ? 'text-cyan-300 animate-pulse' : 'text-cyan-400'}`} />
                    </div>

                    <p className="text-sm sm:text-base font-bold text-white mb-1">
                      {isDragging ? '¡Suelta tus archivos aquí!' : 'Arrastra y suelta tus archivos aquí'}
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      o haz <span className="text-cyan-300 underline font-medium">clic para examinar</span> en tu dispositivo (puedes seleccionar varios a la vez)
                    </p>

                    {/* Supported formats badges */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[10px] font-semibold">
                        PDF
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold">
                        XML (SUNAT)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[10px] font-semibold">
                        Word
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                        Excel
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                        ZIP / RAR
                      </span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Attached Files List */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                        <span>Archivos adjuntos ({files.length}):</span>
                        <button
                          type="button"
                          onClick={clearAllFiles}
                          className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer text-xs"
                        >
                          <Trash2 className="w-3 h-3" /> Limpiar lista
                        </button>
                      </div>

                      <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#061127] border border-slate-700/80 hover:border-cyan-500/40 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                                {getFileIcon(file.extension)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate max-w-[220px] sm:max-w-md">
                                  {file.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  {file.extension.toUpperCase()} · {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(file.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Eliminar archivo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. Notes */}
                <div>
                  <label htmlFor="modal-client-notes" className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                    7. Indicaciones Adicionales (Opcional)
                  </label>
                  <textarea
                    id="modal-client-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Facturas de compras de la 2da quincena y recibo de luz para deducción..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061127] border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs focus:outline-none transition-all placeholder:text-slate-500 resize-none"
                  />
                </div>

                {/* Progress bar */}
                {isUploading && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 shadow-lg">
                    <div className="flex justify-between text-xs font-semibold text-cyan-300 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                        {uploadProgress < 15
                          ? 'Leyendo y preparando documentos...'
                          : uploadProgress < 95
                          ? `Subiendo archivos a la nube (${uploadProgress}%)...`
                          : 'Generando ticket de recepción y confirmando...'}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-700/80 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400"
                        initial={{ width: '0%' }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Transmisión confidencial protegida para clientes Leader.</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-1/3 sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer text-center"
                    >
                      Cerrar
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className={`w-2/3 sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xl transition-all ${
                        isUploading
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-950/60 hover:scale-102 cursor-pointer'
                      }`}
                    >
                      <UploadCloud className="w-4 h-4" />
                      {isUploading ? 'Enviando...' : 'Enviar Documentos'}
                    </button>
                  </div>
                </div>

              </form>
            )}

            {/* History of submissions toggle inside modal */}
            {history.length > 0 && !submittedTicket && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {showHistory ? 'Ocultar historial' : `Ver mis envíos anteriores (${history.length})`}
                </button>

                {showHistory && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {history.map((item, idx) => (
                      <div
                        key={`history_ticket_${item.ticketId || `idx_${idx}`}`}
                        className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-mono text-cyan-300 font-bold">{item.ticketId}</span>
                          <span className="text-slate-400"> · RUC {item.ruc} · {item.taxPeriod} ({item.files.length} archivos)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleWhatsAppNotify(item)}
                          className="px-2.5 py-1 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium shrink-0 hover:bg-emerald-900/80 transition-colors"
                        >
                          WhatsApp
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
