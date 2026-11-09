import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, AlertOctagon, CheckCircle2, FileText, Info, MessageSquare, ShieldCheck, Scale, Check } from 'lucide-react';
import { SUNAT_EMERGENCY_INFO } from '../data/content';

export const SunatAlertSection: React.FC = () => {
  return (
    <section id="actualidad" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#060D1D] via-[#09152B] to-[#081226]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Actualidad Tributaria Oficial
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Facilidades Tributarias Vigentes SUNAT
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Normativa especial para contribuyentes con domicilio fiscal en distritos declarados en emergencia por desastres naturales.
          </p>
        </motion.div>

        {/* Card with 2-Column Split: Detailed Info + Native Advisory Card (No flyer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Guidelines & Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#0B1A38] border border-cyan-500/30 shadow-2xl"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <AlertOctagon className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {SUNAT_EMERGENCY_INFO.headline}
                  </h3>
                  <p className="text-xs text-cyan-300 font-medium">
                    {SUNAT_EMERGENCY_INFO.subheadline}
                  </p>
                </div>
              </div>

              {/* Measures List */}
              <div className="space-y-3 mb-6 mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Medidas Contempladas por SUNAT:
                </h4>
                {SUNAT_EMERGENCY_INFO.measures.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Crucial Warnings Box */}
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 mb-6">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <AlertCircle className="w-4 h-4" />
                  Puntos Importantes a Tener en Cuenta:
                </div>
                <ul className="space-y-1.5 text-xs text-amber-100/90 list-disc list-inside">
                  {SUNAT_EMERGENCY_INFO.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>

              {/* How Leader Helps Box */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/20 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2.5">
                  ¿En qué te ayuda Leader?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  {SUNAT_EMERGENCY_INFO.howWeHelp.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-700/60">
              <a
                href={`https://wa.me/51913150524?text=${encodeURIComponent(
                  'Hola Jorge Pasache, quisiera consultar si mi negocio en Chincha puede acceder a las facilidades tributarias de SUNAT.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 border border-emerald-400/30 transition-all text-center"
              >
                <MessageSquare className="w-4 h-4" />
                Consultar con Nosotros por WhatsApp
              </a>

              <span className="text-[11px] text-slate-400 text-center sm:text-right">
                Fuente: R.S. N.° 051-2019/SUNAT
              </span>
            </div>
          </motion.div>

          {/* Right Column: Native Interactive SUNAT Eligibility Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-[#0A1934] border border-cyan-500/30 shadow-2xl shadow-cyan-950/40"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 block">
                    Asesoría Normativa
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    Evaluación de Calificación
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-cyan-400" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                No todos los distritos ni regímenes aplican automáticamente. Nuestro equipo revisa tu padrón y condición fiscal para activar la postergación sin incurrir en infracciones.
              </p>

              {/* Protocol steps */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    step: '1',
                    title: 'Verificación de Domicilio Fiscal',
                    desc: 'Confirmamos si la dirección declarada en tu Ficha RUC figura dentro de los distritos oficiales con declaratoria vigente.',
                  },
                  {
                    step: '2',
                    title: 'Cálculo de Nuevo Cronograma',
                    desc: 'Determinamos con precisión las nuevas fechas límite para tus PDT 621 y declaraciones juradas mensuales.',
                  },
                  {
                    step: '3',
                    title: 'Blindaje Frente a Coactivas',
                    desc: 'Aseguramos que SUNAT no emita órdenes de pago indebidas ni trabe medidas cautelares en tus cuentas.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card Action */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">
                    ¿Quieres saber si tu empresa califica?
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Revisión de Ficha RUC sin costo de consulta.
                  </span>
                </div>
                <a
                  href={`https://wa.me/51913150524?text=${encodeURIComponent(
                    'Hola Jorge Pasache, quisiera que revisen si mi Ficha RUC califica para facilidades tributarias SUNAT.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md transition-all text-center"
                >
                  Verificar por WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
