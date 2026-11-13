import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Download,
  FileText,
  Loader2,
  X,
  Phone,
  Building2,
  UserPlus,
  Calendar,
} from 'lucide-react';
import {
  NotificationCase,
  getNotificationCaseById,
  downloadNotificationPdf,
} from '../services/notificationsService';

interface NotificationCaseModalProps {
  caseId: string | null;
  onClose: () => void;
}

export const NotificationCaseModal: React.FC<NotificationCaseModalProps> = ({
  caseId,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState<NotificationCase | null>(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!caseId) {
      setCaseData(null);
      setError('');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    getNotificationCaseById(caseId)
      .then((res) => {
        if (cancelled) return;
        if (!res) {
          setError('No se encontró el caso o documento solicitado.');
        } else {
          setCaseData(res);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('No se pudo cargar la notificación desde la nube.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [caseId]);

  if (!caseId) return null;

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownload = async () => {
    if (!caseData) return;
    setDownloading(true);
    setError('');
    try {
      await downloadNotificationPdf(caseData);
    } catch {
      setError('No se pudo descargar el PDF adjunto. Verifica en el Panel de Administración.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div onClick={onClose} className="fixed inset-0 bg-transparent" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#091734] to-[#050C1B] border border-amber-500/50 p-6 sm:p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                Notificación Recibida · {caseId}
              </span>
              <h3 className="text-lg font-extrabold text-white">
                Documento de Notificación
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-5">
          {loading ? (
            <div className="py-10 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-300">Cargando documento desde la nube...</p>
            </div>
          ) : error && !caseData ? (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 text-center">
              {error}
            </div>
          ) : caseData ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-xs font-bold text-rose-200">
                  {caseData.entity}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                    caseData.isExistingClient
                      ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-200'
                      : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                  }`}
                >
                  {caseData.isExistingClient ? (
                    <>
                      <Building2 className="w-3.5 h-3.5" /> Cliente actual
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" /> Aún no es cliente
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Contacto</span>
                  <strong className="text-white text-sm">{caseData.contactName}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Teléfono / WhatsApp</span>
                  <span className="text-emerald-300 font-mono font-bold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {caseData.phone}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Empresa / RUC</span>
                  <span className="text-slate-200 font-medium">
                    {caseData.businessName} {caseData.ruc ? `· RUC ${caseData.ruc}` : ''}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Fecha</span>
                  <span className="text-slate-200 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {caseData.dateFormatted || caseData.createdAt}
                  </span>
                </div>
              </div>

              {caseData.message && (
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                  <span className="text-amber-300 font-semibold block mb-1">Detalle:</span>
                  <p className="whitespace-pre-wrap leading-relaxed">{caseData.message}</p>
                </div>
              )}

              {caseData.pdfFileName ? (
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-rose-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-white truncate">
                        {caseData.pdfFileName}
                      </p>
                      <p className="text-[11px] text-cyan-300 font-mono">
                        PDF · {formatSize(caseData.pdfFileSize)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-60"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloading ? 'Descargando PDF...' : 'Descargar Documento PDF'}</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">
                  Este caso no tiene archivo PDF adjunto.
                </p>
              )}

              {error && (
                <p className="text-xs text-rose-300 text-center">{error}</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
