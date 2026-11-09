import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileCheck,
  Calculator,
  ShieldAlert,
  Users2,
  AlertCircle,
  Building,
  ArrowRight,
  Check,
  MessageSquare,
  Sparkles,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { SERVICES, ServiceItem } from '../data/content';

const iconMap: Record<string, React.ElementType> = {
  FileCheck,
  Calculator,
  ShieldAlert,
  Users2,
  AlertCircle,
  Building,
};

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section id="servicios" className="py-24 relative overflow-hidden bg-[#070F22]">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Portafolio Integral
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Nuestros Servicios Contables & Tributarios
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Soluciones especializadas diseñadas para proteger tu patrimonio, optimizar tus impuestos y asegurar que tu negocio esté 100% en regla con SUNAT.
          </p>
        </motion.div>

        {/* 6 Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.iconName] || Calculator;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 35, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.015 }}
                className="group relative rounded-2xl p-6 sm:p-7 bg-[#0B1A36] border border-slate-700/60 hover:border-cyan-400/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-950/50 transition-colors flex flex-col justify-between"
              >
                {/* Glow highlight on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  {/* Top Row: Number & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black text-cyan-400/80 font-mono group-hover:text-cyan-300 group-hover:translate-x-1 transition-all">
                      {service.number}
                    </span>
                    <span className="text-xs font-semibold text-emerald-300 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/20 group-hover:border-emerald-400/40 transition-colors">
                      {service.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0 group-hover:border-cyan-300 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>

                  {/* Top 3 Benefits list */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-slate-800/80">
                    {service.benefits.slice(0, 3).map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-xs font-semibold text-cyan-300 hover:text-cyan-100 flex items-center gap-1.5 transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
                  >
                    Ver detalles <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://wa.me/51913150524?text=${encodeURIComponent(
                      `Hola Jorge Pasache, deseo consultar sobre el servicio "${service.title}" para mi negocio.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-105"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Cotizar
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner inside Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0C1E3F] via-[#0E2856] to-[#0A2244] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">¿No estás seguro de qué régimen o servicio te corresponde?</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Evaluamos tu situación tributaria sin costo inicial y te decimos exactamente qué necesitas.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/51913150524?text=${encodeURIComponent(
              'Hola Leader, quisiera una evaluación inicial de mi negocio para saber qué régimen me conviene.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/40 transition-all hover:scale-102"
          >
            Solicitar Evaluación Gratuita
          </a>
        </motion.div>

      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-[#0B1A36] border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-cyan-400 font-mono font-bold text-sm">
                  SERVICIO {selectedService.number}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-semibold">
                  {selectedService.badge}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-4">
                {selectedService.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
                {selectedService.fullDesc}
              </p>

              {/* Beneficios Clave */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3">
                  Beneficios Directos Para Tu Negocio
                </h4>
                <div className="space-y-2.5">
                  {selectedService.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entregables */}
              <div className="mb-8 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  ¿Qué Recibes Mensualmente?
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {selectedService.deliverables.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/51913150524?text=${encodeURIComponent(
                    `Hola Leader, estoy muy interesado en contratar el servicio de "${selectedService.title}". ¿Podemos coordinar una reunión?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  Agendar Consulta por WhatsApp
                </a>
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
