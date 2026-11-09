import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Check, ArrowRight, RotateCcw, MessageSquare, Sparkles } from 'lucide-react';

export const RegimeQuiz: React.FC = () => {
  const [step, setStep] = useState(1);
  const [sales, setSales] = useState<string>('');
  const [clients, setClients] = useState<string>('');
  const [employees, setEmployees] = useState<string>('');

  const getRecommendation = () => {
    if (sales === 'under_8k' && clients === 'consumers' && employees === 'none') {
      return {
        regime: 'Nuevo RUS (Régimen Único Simplificado)',
        tax: 'Cuota fija de S/ 20 o S/ 50 al mes. Sin declaraciones juradas mensuales complejas ni libros contables obligatorios.',
        limit: 'Hasta S/ 96,000 anuales (S/ 8,000 mensuales). Emite Boletas de Venta.',
        idealFor: 'Bodegas, bazares, puestos de mercado, peluquerías y pequeños talleres familiares en Chincha.',
      };
    }
    if (sales === 'under_525k' && employees !== 'more_10') {
      return {
        regime: 'RER (Régimen Especial de Renta)',
        tax: '1.5% de los ingresos netos mensuales como pago definitivo de Renta + 18% IGV. No requiere Declaración Anual de Renta.',
        limit: 'Hasta S/ 525,000 anuales. Máximo 10 trabajadores por turno. Solo Registro de Compras y Registro de Ventas.',
        idealFor: 'Comercializadoras, ferreterías, restaurantes medianos y empresas de servicios sin balance anual complejo.',
      };
    }
    return {
      regime: 'RMT (Régimen MYPE Tributario)',
      tax: '1% de ingresos netos a cuenta (hasta 300 UIT). En el cálculo anual pagas solo 10% sobre la renta neta (primeras 15 UIT) y 29.5% por el exceso.',
      limit: 'Hasta 1,700 UIT anuales. Permite emitir todos los comprobantes y deducir todos tus gastos de compras, depreciación y planillas.',
      idealFor: 'Empresas en crecimiento, contratistas, distribuidores y servicios profesionales en expansión.',
    };
  };

  const handleReset = () => {
    setStep(1);
    setSales('');
    setClients('');
    setEmployees('');
  };

  const recommendation = getRecommendation();

  return (
    <section className="py-20 relative overflow-hidden bg-[#071024]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0C1E3F] to-[#0A1833] border border-cyan-500/30 shadow-2xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Herramienta Interactiva
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Orientador Tributario: ¿Qué Régimen SUNAT le Conviene a Tu Negocio?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mb-8">
            Responde 3 preguntas rápidas y descubre qué régimen tributario peruano te permite pagar lo justo y crecer sin contingencias.
          </p>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Paso 1 de 3: ¿Cuánto estimas facturar o vender al mes?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'under_8k', label: 'Hasta S/ 8,000 al mes', sub: '(Hasta S/ 96,000 al año)' },
                    { id: 'under_525k', label: 'Entre S/ 8,000 y S/ 43,000', sub: '(Hasta S/ 525,000 al año)' },
                    { id: 'over_525k', label: 'Más de S/ 43,000 al mes', sub: '(Empresa en crecimiento)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSales(opt.id);
                        setStep(2);
                      }}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                        sales === opt.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="text-sm font-bold text-white">{opt.label}</div>
                      <div className="text-xs text-slate-400 mt-1">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Paso 2 de 3: ¿Quiénes son tus clientes principales?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'consumers', label: 'Público Final', sub: 'Piden Boleta de venta o no exigen factura' },
                    { id: 'companies', label: 'Empresas y Negocios', sub: 'Te exigen Factura para deducir costos' },
                    { id: 'mixed', label: 'Mixto (Boletas y Facturas)', sub: 'Venta tanto a público como a empresas' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setClients(opt.id);
                        setStep(3);
                      }}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                        clients === opt.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="text-sm font-bold text-white">{opt.label}</div>
                      <div className="text-xs text-slate-400 mt-1">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Paso 3 de 3: ¿Tendrás personal en planilla?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'none', label: 'Sin trabajadores', sub: 'Solo el titular o apoyo familiar no remunerado' },
                    { id: 'under_10', label: 'De 1 a 10 trabajadores', sub: 'Planilla pequeña o microempresa' },
                    { id: 'more_10', label: 'Más de 10 trabajadores', sub: 'Planta laboral de mediana escala' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setEmployees(opt.id);
                        setStep(4);
                      }}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                        employees === opt.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="text-sm font-bold text-white">{opt.label}</div>
                      <div className="text-xs text-slate-400 mt-1">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Régimen Recomendado para Tu Negocio
                  </span>
                  <button
                    onClick={handleReset}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reintentar
                  </button>
                </div>

                <h4 className="text-2xl font-black text-white">
                  {recommendation.regime}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-800/60">
                    <strong className="text-cyan-300 block mb-1">Cálculo de Impuestos:</strong>
                    <span className="text-slate-200">{recommendation.tax}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/60">
                    <strong className="text-emerald-300 block mb-1">Límites & Comprobantes:</strong>
                    <span className="text-slate-200">{recommendation.limit}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0A1832] border border-cyan-500/20 text-xs text-slate-300">
                  <strong className="text-white block mb-0.5">Ideal para:</strong>
                  {recommendation.idealFor}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/51913150524?text=${encodeURIComponent(
                      `Hola Jorge, realicé el orientador web y me recomendó el "${recommendation.regime}". Quisiera asesoría para constituir o formalizar mi negocio.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Coordinar en este Régimen por WhatsApp
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Indicator */}
          {step < 4 && (
            <div className="mt-6 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
              <span>Paso {step} de 3</span>
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-cyan-300 hover:underline cursor-pointer"
                >
                  ← Volver al paso anterior
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
