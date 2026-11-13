import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Phone,
  Send,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileUp,
  FileText,
  X,
  Copy,
  Check,
  Download,
  UserPlus,
  Building2,
  Info,
  Loader2,
} from 'lucide-react';
import { LEADER_INFO, SERVICES } from '../data/content';
import {
  submitNotificationCase,
  downloadNotificationPdf,
  NotificationCase,
  NotificationEntity,
} from '../services/notificationsService';

type FormMode = 'notificacion' | 'asesoria';

export const ConsultationForm: React.FC = () => {
  const [formMode, setFormMode] = useState<FormMode>('notificacion');
  const [isExistingClient, setIsExistingClient] = useState<boolean>(false);
  const [entity, setEntity] = useState<NotificationEntity>('SUNAT');
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    ruc: '',
    telefono: '',
    servicio: SERVICES[0].title,
    mensaje: '',
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [submitError, setSubmitError] = useState<string>('');
  const [submittedCase, setSubmittedCase] = useState<NotificationCase | null>(null);
  const [waUrl, setWaUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const activateNotificationMode = () => {
      setFormMode('notificacion');
      setSubmittedCase(null);
      setSubmitError('');
    };

    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#notificacion-sunat' || hash === '#sunafil') {
        activateNotificationMode();
        const el = document.getElementById('contacto');
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80);
        }
      }
    };

    checkHash();
    window.addEventListener('leader_select_sunat_notification', activateNotificationMode);
    window.addEventListener('hashchange', checkHash);
    return () => {
      window.removeEventListener('leader_select_sunat_notification', activateNotificationMode);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setFileError('Solo se permiten archivos en formato PDF (.pdf).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const maxBytes = 15 * 1024 * 1024; // 15 MB
    if (file.size > maxBytes) {
      setFileError('El archivo PDF excede el límite de 15 MB. Comprímelo o contáctanos directo por WhatsApp.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setPdfFile(file);
  };

  const clearPdf = () => {
    setPdfFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    setUploadProgress(5);

    try {
      const selectedEntity: NotificationEntity =
        formMode === 'notificacion' ? entity : 'Asesoría General';

      const savedCase = await submitNotificationCase(
        {
          contactName: formData.nombre,
          phone: formData.telefono,
          businessName: formData.empresa,
          ruc: formData.ruc,
          entity: selectedEntity,
          isExistingClient,
          serviceInterest:
            formMode === 'notificacion'
              ? `Atención de Notificación ${entity}`
              : formData.servicio,
          message: formData.mensaje,
          pdfFile,
        },
        (pct) => setUploadProgress(pct)
      );

      const directPdfLink = `${window.location.origin}/#notificacion=${savedCase.caseId}`;
      const clientStatusLabel = isExistingClient
        ? 'Ya es cliente de Leader'
        : 'Aún NO es cliente (Nueva consulta)';

      const headerTitle =
        formMode === 'notificacion'
          ? `*ALERTA NOTIFICACIÓN ${entity.toUpperCase()} - LEADER*`
          : `*SOLICITUD DE ASESORÍA WEB - LEADER*`;

      let message =
        `${headerTitle}\n` +
        `📌 *Código de Caso:* ${savedCase.caseId}\n` +
        `🤝 *Estado:* ${clientStatusLabel}\n` +
        `👤 *Nombre:* ${formData.nombre}\n` +
        `📱 *Teléfono:* ${formData.telefono}\n` +
        `🏢 *Empresa:* ${formData.empresa || 'No especificada'}\n` +
        `📋 *RUC:* ${formData.ruc || 'No especificado'}\n`;

      if (formMode === 'notificacion') {
        message += `🏛️ *Entidad:* ${entity}\n`;
      } else {
        message += `💼 *Servicio:* ${formData.servicio}\n`;
      }

      if (savedCase.pdfFileName) {
        message +=
          `\n📄 *Documento PDF Adjunto:* ${savedCase.pdfFileName} (${formatFileSize(savedCase.pdfFileSize)})\n` +
          `🔗 *Ver y descargar PDF aquí:*\n${directPdfLink}\n`;
      }

      message += `\n📝 *Detalle:* ${
        formData.mensaje ||
        (formMode === 'notificacion'
          ? 'Solicito revisión urgente de la notificación recibida.'
          : 'Solicito asesoría personalizada.')
      }`;

      const generatedWaUrl = `https://wa.me/51913150524?text=${encodeURIComponent(message)}`;
      setWaUrl(generatedWaUrl);
      setSubmittedCase(savedCase);
    } catch (err) {
      console.error('Error registering consultation/notification:', err);
      setSubmitError(
        'Ocurrió un inconveniente al guardar el documento en la nube. Por favor verifica tu conexión o intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!submittedCase) return;
    const directPdfLink = `${window.location.origin}/#notificacion=${submittedCase.caseId}`;
    try {
      await navigator.clipboard.writeText(directPdfLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDownloadSavedPdf = async () => {
    if (!submittedCase) return;
    setDownloadingPdf(true);
    try {
      await downloadNotificationPdf(submittedCase);
    } catch {
      // ignore
    } finally {
      setDownloadingPdf(false);
    }
  };

  const resetForm = () => {
    setSubmittedCase(null);
    setWaUrl('');
    setUploadProgress(0);
    setSubmitError('');
    setFormData({
      nombre: '',
      empresa: '',
      ruc: '',
      telefono: '',
      servicio: SERVICES[0].title,
      mensaje: '',
    });
    clearPdf();
  };

  return (
    <section id="contacto" className="py-24 relative overflow-hidden bg-[#050C1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            Agenda Tu Consulta Directa
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Empecemos a Proteger Tu Negocio Hoy
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Escríbenos para una reunión presencial en Chincha o virtual. Nuestro equipo revisará tu caso y te brindará una propuesta clara sin compromiso.
          </p>

          {/* Non-Client SUNAT / SUNAFIL Banner */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#151A2C] to-rose-950/50 border border-amber-500/40 text-left flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shadow-lg shadow-amber-950/20">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-bold text-amber-200">
                ¿Aún no eres cliente y recibiste una notificación de SUNAT o SUNAFIL?
              </p>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                También puedes contactarnos de inmediato: adjunta aquí el documento de la notificación en <strong className="text-white">PDF</strong> y envíanos tu caso directo al WhatsApp oficial para evaluar los plazos y evitar multas.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-8 rounded-3xl bg-[#0B1A38] border border-cyan-500/30 shadow-2xl">
              <h3 className="text-xl font-extrabold text-white mb-6">
                Líneas de Atención Directa
              </h3>

              <div className="space-y-4">
                {/* Primary WhatsApp / Phone */}
                <motion.a
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://wa.me/51913150524`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/30 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
                        WhatsApp Principal (Jorge)
                      </span>
                      <span className="text-lg font-black text-white font-mono">
                        {LEADER_INFO.phonePrimary}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-300 group-hover:translate-x-1 transition-transform">
                    Chatear →
                  </span>
                </motion.a>

                {/* Secondary WhatsApp / Phone */}
                <motion.a
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://wa.me/51933884597`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/30 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                      <Phone className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">
                        Línea de Asesoría 2
                      </span>
                      <span className="text-lg font-black text-white font-mono">
                        {LEADER_INFO.phoneSecondary}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-cyan-300 group-hover:translate-x-1 transition-transform">
                    Contactar →
                  </span>
                </motion.a>
              </div>

              {/* Emergency SUNAT / SUNAFIL info card */}
              <div className="mt-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  Atención a No Clientes (SUNAT / SUNAFIL)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Si recibiste una esquela, carta inductiva, resolución de multa o requerimiento de fiscalización de <strong className="text-white">SUNAT</strong> o <strong className="text-white">SUNAFIL</strong> y aún no trabajas con nosotros, sube tu PDF en el formulario para revisarlo contigo el mismo día.
                </p>
              </div>

              {/* Office & Hours */}
              <div className="mt-7 pt-6 border-t border-slate-700/60 space-y-3.5">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Ubicación:</strong>
                    <span>Chincha Alta, Chincha - Ica, Perú</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Horario de Atención:</strong>
                    <span>Lunes a Viernes: 8:30 am – 6:30 pm | Sábados: 9:00 am – 1:00 pm</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Confidencialidad Garantizada:</strong>
                    <span>Tu notificación PDF se cifra en la nube para descarga exclusiva del equipo Leader.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Notification PDF & Lead Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="p-6 sm:p-9 rounded-3xl bg-[#0A1835] border border-cyan-500/30 shadow-2xl">
              {/* Mode Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#050C1B] border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormMode('notificacion');
                    setSubmittedCase(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formMode === 'notificacion'
                      ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/20 text-amber-200 border border-amber-400/60 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Notificación SUNAT / SUNAFIL</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormMode('asesoria');
                    setSubmittedCase(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formMode === 'asesoria'
                      ? 'bg-gradient-to-r from-cyan-500/25 to-emerald-500/20 text-cyan-200 border border-cyan-400/60 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Asesoría General</span>
                </button>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-1.5">
                {formMode === 'notificacion'
                  ? 'Envía Tu Notificación SUNAT o SUNAFIL'
                  : 'Solicitud de Asesoría Personalizada'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                {formMode === 'notificacion'
                  ? 'Atendemos también si aún no eres cliente. Adjunta el PDF de tu notificación y genera tu mensaje directo al WhatsApp oficial (+51 913 150 524) con el enlace seguro de descarga.'
                  : 'Completa tus datos y envía tu ficha directa al WhatsApp oficial para ser atendido por Jorge y el equipo Leader.'}
              </p>

              {submittedCase ? (
                <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-200 mb-2">
                      Caso {submittedCase.caseId}
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-white">
                      {submittedCase.pdfFileName
                        ? '¡Notificación y PDF Listos para Enviar por WhatsApp!'
                        : '¡Solicitud Registrada con Éxito!'}
                    </h4>
                    <p className="text-xs text-slate-200 mt-1.5 max-w-lg mx-auto leading-relaxed">
                      Tu caso quedó guardado de forma segura. Haz clic en el botón verde para abrir WhatsApp hacia el número oficial (<strong className="text-white">913 150 524</strong>) con todos tus datos{' '}
                      {submittedCase.pdfFileName
                        ? 'y el enlace directo para descargar el PDF adjunto.'
                        : 'listos para enviar.'}
                    </p>
                  </div>

                  {/* Primary WhatsApp Action Button (no window.open) */}
                  <div className="pt-1">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-950/60 border border-emerald-400/50 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Mensaje {submittedCase.pdfFileName ? '+ Link del PDF ' : ''}por WhatsApp
                    </a>
                  </div>

                  {/* PDF Link & Honest Info Box */}
                  {submittedCase.pdfFileName && (
                    <div className="p-4 rounded-xl bg-[#07142C] border border-cyan-500/30 text-left space-y-3">
                      <div className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          <strong className="text-white">¿Cómo recibe el asesor tu PDF por WhatsApp?</strong> Por seguridad de los navegadores, WhatsApp Web/App no permite adjuntar archivos automáticamente desde un formulario web; por ello, guardamos tu PDF (<span className="text-cyan-300 font-medium">{submittedCase.pdfFileName}</span>) en nuestra nube segura e incluimos el enlace directo dentro del mensaje de WhatsApp para que Jorge lo descargue en un clic (también si deseas puedes arrastrarlo al chat).
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Enlace copiado' : 'Copiar enlace del PDF'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadSavedPdf}
                          disabled={downloadingPdf}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{downloadingPdf ? 'Descargando...' : 'Descargar copia PDF'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-block text-xs text-slate-400 hover:text-white underline-offset-2 hover:underline cursor-pointer pt-1"
                  >
                    Enviar otra notificación o consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Client Status Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      ¿Ya eres cliente de Leader Consultores? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsExistingClient(false)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          !isExistingClient
                            ? 'bg-amber-950/50 border-amber-400/70 text-amber-200 shadow-sm'
                            : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <UserPlus className="w-4 h-4 text-amber-400" />
                        <span>No, aún no soy cliente</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsExistingClient(true)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isExistingClient
                            ? 'bg-cyan-950/60 border-cyan-400/70 text-cyan-200 shadow-sm'
                            : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        <span>Sí, ya soy cliente</span>
                      </button>
                    </div>
                  </div>

                  {/* Entity selector for Notification mode */}
                  {formMode === 'notificacion' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        ¿De qué entidad recibiste la notificación? *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['SUNAT', 'SUNAFIL', 'Ambas / Otra'] as NotificationEntity[]).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setEntity(opt)}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              entity === opt
                                ? 'bg-rose-950/60 border-rose-400 text-rose-200 shadow-sm'
                                : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Tu Nombre / Contacto *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Carlos Mendoza"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 987 654 321"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nombre de Negocio / Empresa
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Distribuidora El Sol"
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Número de RUC (si cuentas con uno)
                      </label>
                      <input
                        type="text"
                        placeholder="11 dígitos (opcional)"
                        value={formData.ruc}
                        onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                        maxLength={11}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {formMode === 'asesoria' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Servicio de Interés Principal
                      </label>
                      <select
                        value={formData.servicio}
                        onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                      >
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.number}. {s.title}
                          </option>
                        ))}
                        <option value="Evaluación Integral de Régimen Tributario">
                          Otro / Evaluación Integral de Régimen
                        </option>
                      </select>
                    </div>
                  )}

                  {/* PDF Notification Upload Zone */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        {formMode === 'notificacion'
                          ? 'Adjuntar Documento de Notificación (PDF)'
                          : 'Adjuntar Documento / Notificación PDF (opcional)'}
                      </label>
                      <span className="text-[11px] text-cyan-400 font-medium">Máx. 15 MB · Solo PDF</span>
                    </div>

                    {!pdfFile ? (
                      <label className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-slate-900/60 hover:bg-cyan-950/25 transition-all cursor-pointer text-center sm:text-left">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
                          <FileUp className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-bold text-white">
                            Haz clic para seleccionar el PDF de tu notificación
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Carta inductiva, esquela, resolución de multa o requerimiento SUNAT / SUNAFIL (.pdf)
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/50">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-rose-300" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{pdfFile.name}</p>
                            <p className="text-[11px] text-cyan-300 font-mono">
                              PDF · {formatFileSize(pdfFile.size)} · Listo para adjuntar
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={clearPdf}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0"
                          title="Quitar PDF"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {fileError && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fileError}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {formMode === 'notificacion'
                        ? 'Cuéntanos brevemente qué indica la notificación o cuándo vence el plazo (opcional)'
                        : '¿En qué podemos ayudarte? (opcional)'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={
                        formMode === 'notificacion'
                          ? 'Ej. Me llegó una esquela de omisión o una carta de SUNAFIL con plazo de 5 días hábiles...'
                          : 'Detalla brevemente tu duda, si tienes declaraciones atrasadas o si deseas constituir una empresa...'
                      }
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {isSubmitting && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-cyan-300 font-medium">
                        <span>{pdfFile ? 'Subiendo PDF a la nube segura...' : 'Preparando tu mensaje...'}</span>
                        <span className="font-mono">{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/50 border border-emerald-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Procesando {pdfFile ? 'PDF y solicitud' : 'solicitud'}...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {formMode === 'notificacion'
                            ? 'Preparar Notificación y Enviar por WhatsApp'
                            : 'Preparar Consulta y Enviar por WhatsApp'}
                        </span>
                      </>
                    )}
                  </motion.button>

                  <p className="text-[11px] text-slate-400 text-center">
                    Atención rápida por el número oficial <strong className="text-slate-300">+51 913 150 524</strong> — Respuesta en menos de 2 horas en horario laboral.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
