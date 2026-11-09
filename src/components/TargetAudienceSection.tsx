import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, Building2, ShoppingBag, Briefcase, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { TARGET_AUDIENCES, TargetAudience } from '../data/content';

const iconMap: Record<string, React.ElementType> = {
  Store,
  Building2,
  ShoppingBag,
  Briefcase,
};

export const TargetAudienceSection: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>(TARGET_AUDIENCES[0].id);

  const activeAudience = TARGET_AUDIENCES.find((a) => a.id === activeTabId) || TARGET_AUDIENCES[0];
  const ActiveIcon = iconMap[activeAudience.icon] || Store;

  return (
    <section id="clientes" className="py-24 relative overflow-hidden bg-[#071126]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            Nuestros Clientes
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Soluciones Especializadas Para Cada Tipo de Negocio
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Desde la bodega de la esquina hasta la empresa en expansión, adaptamos el soporte contable al tamaño y necesidades reales de tu actividad económica.
          </p>
        </motion.div>

        {/* Audience Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {TARGET_AUDIENCES.map((audience) => {
            const Icon = iconMap[audience.icon] || Store;
            const isActive = audience.id === activeTabId;
            return (
              <button
                key={audience.id}
                onClick={() => setActiveTabId(audience.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-950/50 border border-cyan-300/40 scale-102'
                    : 'bg-[#0B1A38] hover:bg-[#0E224A] text-slate-300 border border-slate-700/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                <span>{audience.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Audience Detailed Card with Motion Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAudience.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-10 rounded-3xl bg-[#0B1C3D] border border-cyan-500/30 shadow-2xl max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-700/60">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <ActiveIcon className="w-7 h-7 text-cyan-300" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                    {activeAudience.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                    {activeAudience.title}
                  </h3>
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-slate-300 font-medium">
                Ejemplos: {activeAudience.examples}
              </div>
            </div>

            <p className="text-base text-slate-200 leading-relaxed mb-8">
              {activeAudience.description}
            </p>

            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-4">
                ¿Cómo te ayudamos en Leader?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeAudience.keyHelp.map((help, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
                      {help}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Atención personalizada para tu sector comercial en Chincha y distritos aledaños.
              </span>

              <a
                href={`https://wa.me/51913150524?text=${encodeURIComponent(
                  `Hola Leader, pertenezco al grupo "${activeAudience.title}" y deseo asesoría contable personalizada.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all text-center"
              >
                <MessageSquare className="w-4 h-4" />
                Consultar por este perfil
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
