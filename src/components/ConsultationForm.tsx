import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Phone, Send, CheckCircle2, MapPin, Clock, ShieldCheck, Mail } from 'lucide-react';
import { LEADER_INFO, SERVICES } from '../data/content';

export const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    ruc: '',
    telefono: '',
    servicio: SERVICES[0].title,
    mensaje: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const message = `*SOLICITUD DE ASESORÍA WEB - LEADER*\n` +
      `👤 *Nombre:* ${formData.nombre}\n` +
      `🏢 *Empresa:* ${formData.empresa || 'No especificada'}\n` +
      `📋 *RUC:* ${formData.ruc || 'No especificado'}\n` +
      `📱 *Teléfono:* ${formData.telefono}\n` +
      `💼 *Servicio de interés:* ${formData.servicio}\n` +
      `📝 *Consulta:* ${formData.mensaje || 'Solicita llamada de coordinación'}`;

    const waUrl = `https://wa.me/51913150524?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab after 600ms
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 600);
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
          className="text-center max-w-3xl mx-auto mb-16"
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
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info & Phones from Image 1 */}
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

              {/* Office & Hours */}
              <div className="mt-8 pt-6 border-t border-slate-700/60 space-y-3.5">
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
                    <span>Toda tu información contable y financiera está 100% protegida.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Lead Form that prepares WhatsApp Message */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0A1835] border border-cyan-500/30 shadow-2xl">
              <h3 className="text-2xl font-extrabold text-white mb-2">
                Solicitud de Asesoría Personalizada
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Completa tus datos y serás redirigido de inmediato a WhatsApp con tu ficha lista para ser atendida por Jorge y el equipo Leader.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-white mb-1">¡Solicitud Generada con Éxito!</h4>
                  <p className="text-xs text-slate-200 mb-4">
                    Estamos abriendo tu conversación de WhatsApp con todos los datos organizados. Si no abrió automáticamente, haz clic abajo:
                  </p>
                  <a
                    href={`https://wa.me/51913150524`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs"
                  >
                    Abrir Chat en WhatsApp Ahora
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="block mx-auto mt-4 text-xs text-slate-400 hover:text-white"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        Número de RUC (si ya cuentas con uno)
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      ¿En qué podemos ayudarte? (opcional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detalla brevemente tu duda, si tienes declaraciones atrasadas o si deseas constituir una empresa..."
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/50 border border-emerald-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Consulta y Abrir WhatsApp Directo
                  </motion.button>

                  <p className="text-[11px] text-slate-400 text-center">
                    Respuesta garantizada en menos de 2 horas en horario laboral.
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
