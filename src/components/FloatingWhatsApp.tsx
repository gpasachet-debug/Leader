import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { LEADER_INFO } from '../data/content';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = quickQuery.trim()
      ? `Hola Jorge / Leader, consulta desde la web: "${quickQuery}"`
      : 'Hola Jorge / Leader, quisiera información sobre los servicios contables en Chincha.';
    
    window.open(`https://wa.me/51913150524?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setQuickQuery('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Mini popup card when open */}
      {isOpen && (
        <div className="mb-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#091730] border border-cyan-500/40 p-4 shadow-2xl animate-fade-in text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="/assets/aistudio/Retrato_corporativo_en_oficina_moderna_565a0548.png"
                  alt="Jorge Pasache Leader"
                  className="w-9 h-9 rounded-full object-cover border border-cyan-400"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#091730]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Jorge Pasache · Consultor Leader</h4>
                <span className="text-[10px] text-cyan-300">Responde en breve por WhatsApp</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            ¡Hola! ¿Tienes dudas sobre tus declaraciones SUNAT, planillas o formalización? Escríbenos directamente:
          </p>

          <form onSubmit={handleSend} className="space-y-2">
            <input
              type="text"
              placeholder="Escribe tu consulta aquí..."
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Iniciar Chat en WhatsApp
            </button>
          </form>

          <div className="mt-2 text-[10px] text-center text-slate-400">
            Teléfono: {LEADER_INFO.phonePrimary}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 border border-emerald-400/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Chat por WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200" />
        </span>
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="hidden sm:inline font-semibold">¿Consultas? Chatea con nosotros</span>
      </button>
    </div>
  );
};
