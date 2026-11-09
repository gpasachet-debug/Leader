import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Calendar, Clock, FileCheck2, MessageCircle, Search, ShieldCheck } from 'lucide-react';

export const RucCalendarTool: React.FC = () => {
  const [selectedDigit, setSelectedDigit] = useState<number | 'BC'>(0);

  // Digital calendar guidance based on SUNAT schedule rules
  const rucScheduleInfo: Record<string | number, { dayRange: string; advice: string; urgency: string }> = {
    0: { dayRange: 'Primeros días hábiles', advice: 'Tu vencimiento es de los primeros en abrir el cronograma SUNAT. Prepara tus compras y ventas con anticipación.', urgency: 'Atención Prioritaria' },
    1: { dayRange: 'Segundo bloque de vencimientos', advice: 'No esperes el cierre del mes. Valida los comprobantes con detracciones antes del día límite.', urgency: 'Próximo Vencimiento' },
    2: { dayRange: 'Tercer bloque de vencimientos', advice: 'Cruza el registro de ventas con el SIRE y constata los comprobantes anulados.', urgency: 'En Calendario' },
    3: { dayRange: 'Cuarto bloque de vencimientos', advice: 'Calcula tu crédito fiscal y verifica bancarización de facturas mayores a S/ 2,000.', urgency: 'En Calendario' },
    4: { dayRange: 'Quinto bloque de vencimientos', advice: 'Verifica tus notas de crédito y retenciones electrónicas de clientes.', urgency: 'En Calendario' },
    5: { dayRange: 'Sexto bloque de vencimientos', advice: 'Mitad del cronograma. Excelente momento para auditar inconsistencias antes del envío.', urgency: 'En Calendario' },
    6: { dayRange: 'Séptimo bloque de vencimientos', advice: 'Confirma que no tengas órdenes de pago pendientes del periodo anterior.', urgency: 'En Calendario' },
    7: { dayRange: 'Octavo bloque de vencimientos', advice: 'Asegura que tu personal en planilla PLAME esté registrado sin omisiones.', urgency: 'En Calendario' },
    8: { dayRange: 'Noveno bloque de vencimientos', advice: 'El sistema suele saturarse hacia el final de la semana. Declara con 48h de antelación.', urgency: 'Cierre Próximo' },
    9: { dayRange: 'Último bloque ordinario', advice: 'Cierre del periodo para dígitos ordinarios. Evita caídas de clave SOL declarando temprano.', urgency: 'Cierre de Cronograma' },
    BC: { dayRange: 'Buenos Contribuyentes', advice: 'Cuentas con días adicionales de plazo otorgados por SUNAT. Mantén tu condición sin multas.', urgency: 'Beneficio Especial' },
  };

  const digits: (number | 'BC')[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'BC'];
  const currentInfo = rucScheduleInfo[selectedDigit];

  return (
    <section id="vencimientos" className="py-20 relative overflow-hidden bg-gradient-to-b from-[#081226] via-[#0B1A38] to-[#081226]">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[30rem] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Campaign Header from Image 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            ¡Atención Empresarios y Emprendedores de Chincha!
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Continúan los Vencimientos Tributarios SUNAT
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            No te expongas a multas ni cierres de cuentas bancarias. Consulta el estado de tu vencimiento seleccionando el último dígito de tu número de RUC.
          </p>
        </motion.div>

        {/* 2-Column Interactive Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive RUC Digit Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0F2247] border border-cyan-500/30 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/60">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-cyan-300 block">
                  Simulador de Calendario
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">
                  ¿Cuál es el último dígito de tu RUC?
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-400">
                SUNAT Perú
              </span>
            </div>

            {/* Digit Selection Pills/Buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mb-6">
              {digits.map((digit) => (
                <button
                  key={digit}
                  onClick={() => setSelectedDigit(digit)}
                  className={`py-3 px-2 rounded-xl text-center font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${
                    selectedDigit === digit
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-900/50 scale-105 border-2 border-cyan-200'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span className="block text-[10px] text-slate-400 uppercase font-medium">
                    {digit === 'BC' ? 'Especial' : 'Dígito'}
                  </span>
                  <span className="text-lg">{digit}</span>
                </button>
              ))}
            </div>

            {/* Selected Result Box */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-black text-xl text-cyan-300 font-mono">
                    {selectedDigit}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Bloque correspondiente</div>
                    <div className="text-sm sm:text-base font-bold text-white">{currentInfo.dayRange}</div>
                  </div>
                </div>

                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {currentInfo.urgency}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0A1832] p-3 rounded-lg border border-slate-800">
                {currentInfo.advice}
              </p>
            </div>

            {/* Direct WhatsApp Action for Selected Digit */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href={`https://wa.me/51913150524?text=${encodeURIComponent(
                  `Hola Jorge / Leader, mi RUC termina en ${selectedDigit} y necesito apoyo para organizar mis obligaciones tributarias y evitar multas.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 border border-emerald-400/30 transition-all text-center"
              >
                <MessageCircle className="w-4 h-4" />
                Organizar Mis Obligaciones por WhatsApp
              </a>

            </div>
          </motion.div>

          {/* Right Column: 3 Urgent Steps from Image 3 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="p-5 rounded-2xl bg-[#091834] border border-slate-700/60">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">1. No esperes al último momento</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    Las caídas de plataforma SUNAT en los días de vencimiento no eximen de multas. En Leader preparamos tu declaración con suficiente anticipación.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#091834] border border-slate-700/60">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">2. Revisa compras, ventas y comprobantes</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    Cruzar la información contable con los sistemas electrónicos SIRE y bancarización evita inconsistencias y pérdida del crédito fiscal de tu negocio.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#091834] border border-slate-700/60">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">3. Tu fecha depende del último dígito de tu RUC</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    Te mantenemos alertado en cada ciclo tributario para que nunca recibas una esquela ni sanción económica por presentación extemporánea.
                  </p>
                </div>
              </div>
            </div>

            {/* Reassurance Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 text-center">
              <p className="text-xs font-semibold text-emerald-200">
                ¡Estoy para ayudarte! Nuestro equipo atiende consultas directas de lunes a sábado en Chincha.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
