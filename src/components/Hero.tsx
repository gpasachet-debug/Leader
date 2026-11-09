import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Award, CheckCircle2, Shield, TrendingUp, Phone, MapPin } from 'lucide-react';
import { LEADER_INFO } from '../data/content';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-36 sm:pt-40 lg:pt-48 pb-16 overflow-hidden bg-gradient-to-b from-[#060D1D] via-[#08152B] to-[#0A1A36]">
      {/* Background ambient lighting effects with continuous gentle floating motion */}
      <motion.div
        animate={{ y: [0, -25, 0], scale: [1, 1.08, 1], opacity: [0.15, 0.22, 0.15] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 20, 0], scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-10 right-0 w-[30rem] h-[30rem] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Subtle geometric grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Top Eyebrow / Trust Marker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Más de 25 años de experiencia</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Chincha - Perú
              </span>
            </motion.div>

            {/* Dominant Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 text-balance"
            >
              Tu tranquilidad tributaria,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                nuestra prioridad.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8"
            >
              Te acompañamos en el crecimiento de tu negocio con soluciones contables y tributarias a tu medida. 
              Declaraciones mensuales SUNAT, planillas, auditoría y formalización para que te enfoques en lo que mejor haces: vender y crecer.
            </motion.p>

            {/* 3 Core Checkpoints from Image 1 with staggered hover bounce */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-8">
              {[
                { title: 'Asesoría personalizada', sub: 'Diagnóstico a tu medida' },
                { title: 'Cumplimiento tributario', sub: 'Cero multas SUNAT' },
                { title: 'Soluciones para tu negocio', sub: 'Acompañamiento continuo' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 + idx * 0.1 }}
                  whileHover={{ y: -4, borderColor: 'rgba(0, 194, 255, 0.4)' }}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm transition-colors cursor-default"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white leading-snug">{item.title}</p>
                    <p className="text-[11px] text-slate-400">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Primary Action & WhatsApp Contact Banner with spring hover */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full max-w-xl"
            >
              <motion.a
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/51913150524?text=${encodeURIComponent(
                  'Hola Jorge / Leader, deseo agendar una consulta contable y tributaria para mi negocio.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-xl shadow-emerald-950/50 border border-emerald-400/40 transition-shadow text-center"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] uppercase tracking-wider text-emerald-100 font-medium">
                    Agenda una consulta por
                  </div>
                  <div className="text-base font-extrabold text-white">
                    WhatsApp: 913 150 524
                  </div>
                </div>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#servicios"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 hover:text-white transition-all text-center"
              >
                Explorar Servicios
              </motion.a>
            </motion.div>

            {/* Second phone number mention */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-3 text-xs text-slate-400 flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              Línea directa adicional:{' '}
              <a
                href={`https://wa.me/51933884597`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 font-medium hover:underline"
              >
                {LEADER_INFO.phoneSecondary}
              </a>
            </motion.p>
          </motion.div>

          {/* Right Column: Visual Anchor with Jorge Leader Photo & Interactive hover lift */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="lg:col-span-5 relative group"
          >
            {/* Glowing frame backdrop */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/40 via-sky-500/20 to-emerald-500/40 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 animate-tilt pointer-events-none" />

            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#0A182F] shadow-2xl shadow-cyan-950/40">
              {/* Photo of Jorge Pasache */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden group">
                <img
                  src="/assets/aistudio/Retrato_corporativo_en_oficina_moderna_565a0548.png"
                  alt="Jorge Pasache - Consultor Contable y Tributario Leader"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081226] via-transparent to-black/10" />

                {/* Floating Experience Badge */}
                <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-[#081428]/90 backdrop-blur-md border border-amber-500/40 shadow-lg flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md">
                    <Award className="w-5 h-5 text-slate-950" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                      Trayectoria
                    </div>
                    <div className="text-xs font-extrabold text-white">
                      +25 Años de Experiencia
                    </div>
                  </div>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#081226]/95 backdrop-blur-md border border-cyan-500/30 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <h2 className="text-base font-bold text-white tracking-wide">
                          Jorge Pasache
                        </h2>
                      </div>
                      <p className="text-xs text-cyan-300 font-medium mt-0.5">
                        Consultor Principal & Especialista Tributario
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Sede</span>
                      <span className="text-xs font-semibold text-slate-200">Chincha, Ica</span>
                    </div>
                  </div>

                  {/* 4 Pillars Mini-row */}
                  <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-700/60 text-center">
                    <div className="p-1 rounded bg-slate-800/50">
                      <span className="text-[10px] block text-cyan-200 font-medium">Contabilidad</span>
                    </div>
                    <div className="p-1 rounded bg-slate-800/50">
                      <span className="text-[10px] block text-cyan-200 font-medium">Tributación</span>
                    </div>
                    <div className="p-1 rounded bg-slate-800/50">
                      <span className="text-[10px] block text-cyan-200 font-medium">Planillas</span>
                    </div>
                    <div className="p-1 rounded bg-slate-800/50">
                      <span className="text-[10px] block text-cyan-200 font-medium">Formalización</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
