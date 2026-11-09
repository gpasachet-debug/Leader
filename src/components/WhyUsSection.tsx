import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, LineChart, ShieldAlert, Clock, CheckCircle, MapPin, MessageSquare, Award, Sparkles, Check } from 'lucide-react';
import { WHY_LEADER_BENEFITS, LEADER_INFO } from '../data/content';
import { LeaderLogo } from './LeaderLogo';

export const WhyUsSection: React.FC = () => {
  const iconList = [LineChart, ShieldCheck, ShieldAlert, Clock];

  return (
    <section id="beneficios" className="py-24 relative overflow-hidden bg-[#060D1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Nuestra Promesa
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Más que números, <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">somos tu aliado</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            La contabilidad no debe ser un dolor de cabeza ni un trámite de último minuto. Nos encargamos de blindar tu negocio para que puedas dormir tranquilo.
          </p>
        </motion.div>

        {/* Grid with 4 Core Advantages & Interactive Guarantee Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: 4 Advantage Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_LEADER_BENEFITS.map((benefit, idx) => {
              const Icon = iconList[idx] || ShieldCheck;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 350, damping: 20 } }}
                  className="p-6 rounded-2xl bg-[#0B1A36] border border-slate-700/60 hover:border-cyan-400/50 shadow-xl hover:shadow-cyan-950/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-cyan-300 group-hover:text-cyan-200" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-cyan-200 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight group-hover:text-emerald-300 transition-colors">
                      {benefit.stat}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {benefit.statLabel}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Bespoke Guarantee & Value Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="lg:col-span-5 flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0C1E40] via-[#0A1833] to-[#071328] border border-cyan-500/40 shadow-2xl shadow-cyan-950/40"
          >
            <div>
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-700/60 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                    Compromiso de Calidad
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    Garantía Leader en Chincha
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center animate-pulse">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed mb-5">
                Al confiar tu contabilidad a Leader, recibes acompañamiento profesional liderado por <strong className="text-white">Jorge Pasache</strong>, garantizando que cada trámite esté respaldado por más de 25 años de experiencia.
              </p>

              {/* Photo Banner with Rounded Corners matching user specification */}
              <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden mb-6 border border-slate-700/60 shadow-lg bg-slate-900">
                <img
                  src="/assets/images/leader_quality_guarantee_audit_1794215662004.jpg"
                  alt="Auditoría tributaria y garantía de calidad Leader"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091833] via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3">
                  <span className="text-[11px] font-bold text-cyan-300 bg-[#071328]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/30">
                    Auditoría & Respaldo Permanente
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3.5 mb-8">
                {[
                  'Atención directa y resolución de dudas sin intermediarios',
                  'Auditoría preventiva de comprobantes antes de cada declaración mensual',
                  'Monitoreo continuo de buzón electrónico SUNAT para evitar notificaciones desatendidas',
                  'Gestión segura de planillas, T-Registro y beneficios de tus trabajadores',
                  'Asesoramiento integral en bancarización y sustento de crédito fiscal',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-white italic">
                  «¡Tu negocio en buenas manos!»
                </p>
                <p className="text-[11px] text-cyan-300 font-medium flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> Chincha · Perú
                </p>
              </div>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href={`https://wa.me/51913150524?text=${encodeURIComponent(
                  'Hola Jorge Pasache, quisiera conversar sobre los servicios contables y beneficios de Leader.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all text-center"
              >
                <MessageSquare className="w-4 h-4" />
                Conversar con Jorge
              </motion.a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
