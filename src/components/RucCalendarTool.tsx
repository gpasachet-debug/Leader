import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Calendar,
  Clock,
  FileCheck2,
  MessageCircle,
  Table,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SUNAT_SCHEDULE_2026, PeriodDueDates, RucDigit } from '../data/sunatSchedule2026';

export const RucCalendarTool: React.FC = () => {
  // Default to Oct-26 or current active period
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number>(9); // Oct-26 (vence en Nov-26)
  const [selectedDigit, setSelectedDigit] = useState<RucDigit>(0);
  const [isFullTableModalOpen, setIsFullTableModalOpen] = useState<boolean>(false);

  const digits: RucDigit[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'BC'];
  const currentPeriod: PeriodDueDates = SUNAT_SCHEDULE_2026[selectedPeriodIndex];

  // Specific guidance per digit
  const rucScheduleAdvice: Record<string | number, { blockName: string; advice: string; urgency: string }> = {
    0: {
      blockName: 'Primer bloque de vencimientos',
      advice: 'Tu RUC es el primero en abrir el cronograma oficial de SUNAT. Prepara tus compras, ventas y SIRE con anticipación para no presentar con apuros.',
      urgency: 'Atención Prioritaria',
    },
    1: {
      blockName: 'Segundo bloque de vencimientos',
      advice: 'Valida tus detracciones y comprobantes electrónicos antes del día límite. El cruce con SIRE debe estar conciliado 48h antes.',
      urgency: 'Próximo Vencimiento',
    },
    2: {
      blockName: 'Tercer bloque de vencimientos',
      advice: 'Cruza el registro de ventas con el portal SUNAT y verifica comprobantes anulados para no arrastrar inconsistencias.',
      urgency: 'En Calendario',
    },
    3: {
      blockName: 'Cuarto bloque de vencimientos',
      advice: 'Calcula tu crédito fiscal neto y verifica la bancarización de facturas mayores a S/ 2,000 o US$ 500.',
      urgency: 'En Calendario',
    },
    4: {
      blockName: 'Quinto bloque de vencimientos',
      advice: 'Verifica tus notas de crédito, retenciones y percepciones aplicables antes del envío del PDT o Declara Fácil.',
      urgency: 'En Calendario',
    },
    5: {
      blockName: 'Sexto bloque de vencimientos',
      advice: 'Mitad del cronograma oficial. Momento ideal para auditar saldos a favor del periodo anterior antes de la liquidación.',
      urgency: 'En Calendario',
    },
    6: {
      blockName: 'Séptimo bloque de vencimientos',
      advice: 'Confirma que no tengas órdenes de pago o cobranzas coactivas pendientes para aplicar tus pagos sin trabas.',
      urgency: 'En Calendario',
    },
    7: {
      blockName: 'Octavo bloque de vencimientos',
      advice: 'Asegura que tu personal en planilla PLAME y aportes a EsSalud/ONP estén liquidados correctamente.',
      urgency: 'En Calendario',
    },
    8: {
      blockName: 'Noveno bloque de vencimientos',
      advice: 'La plataforma suele presentar saturación hacia los últimos días del cronograma. En Leader declaramos con 48h de holgura.',
      urgency: 'Cierre Próximo',
    },
    9: {
      blockName: 'Último bloque ordinario',
      advice: 'Cierre del periodo para dígitos ordinarios. Evita caídas de clave SOL y multas por presentación extemporánea declarando a tiempo.',
      urgency: 'Cierre de Cronograma',
    },
    BC: {
      blockName: 'Buenos Contribuyentes y UESP',
      advice: 'Cuentas con días adicionales otorgados por SUNAT por tu buen récord tributario. Mantén esta condición para evitar retenciones del 3%.',
      urgency: 'Beneficio Especial',
    },
  };

  const currentAdvice = rucScheduleAdvice[selectedDigit];
  const officialShortDate = currentPeriod.dates[selectedDigit];
  const officialFullDate = currentPeriod.fullDates[selectedDigit];

  const handlePrevPeriod = () => {
    setSelectedPeriodIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPeriod = () => {
    setSelectedPeriodIndex((prev) => (prev < SUNAT_SCHEDULE_2026.length - 1 ? prev + 1 : prev));
  };

  const handlePrintTable = () => {
    window.print();
  };

  return (
    <section id="vencimientos" className="py-10 sm:py-14 relative overflow-hidden bg-gradient-to-b from-[#081226] via-[#0B1A38] to-[#081226]">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[22rem] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Campaign Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Cronograma Oficial SUNAT 2026
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Vencimientos Tributarios Mensuales
          </h2>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed text-balance">
            Consulta la fecha límite exacta según el último dígito de tu RUC y periodo tributario.
          </p>
        </motion.div>

        {/* 2-Column Compact Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Interactive RUC Digit Selector */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#0D1F42] border border-cyan-500/30 shadow-xl shadow-black/40 flex flex-col gap-3.5"
          >
            {/* Top Bar: Title & Integrated Period Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-700/60">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300 block">
                  Simulador de Calendario
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                  Último dígito de tu RUC
                </h3>
              </div>

              {/* Compact Period Switcher */}
              <div className="flex items-center gap-1.5 bg-[#061022] p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={handlePrevPeriod}
                  disabled={selectedPeriodIndex === 0}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-cyan-300 transition-colors cursor-pointer"
                  title="Periodo anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <select
                  value={selectedPeriodIndex}
                  onChange={(e) => setSelectedPeriodIndex(Number(e.target.value))}
                  className="px-2 py-0.5 bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  {SUNAT_SCHEDULE_2026.map((period, idx) => (
                    <option key={period.periodCode} value={idx} className="bg-slate-900 text-white">
                      {period.periodName} (Vence en {period.dueMonth.split(' ')[0]})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleNextPeriod}
                  disabled={selectedPeriodIndex === SUNAT_SCHEDULE_2026.length - 1}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-cyan-300 transition-colors cursor-pointer"
                  title="Periodo siguiente"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Digit Selection Grid - Compact pills */}
            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
              {digits.map((digit) => (
                <motion.button
                  key={String(digit)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDigit(digit)}
                  className={`py-1.5 px-1 rounded-xl text-center font-bold transition-all duration-150 cursor-pointer ${
                    selectedDigit === digit
                      ? 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white shadow-md shadow-cyan-900/60 border border-cyan-200'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80'
                  }`}
                >
                  <span className="block text-[8px] text-slate-400 uppercase font-medium leading-none mb-0.5">
                    {digit === 'BC' ? 'ESP' : 'DIG'}
                  </span>
                  <span className="text-sm sm:text-base font-black leading-none">{digit}</span>
                </motion.button>
              ))}
            </div>

            {/* Selected Result Box - Streamlined & Space-Efficient */}
            <motion.div
              key={`${String(selectedDigit)}-${currentPeriod.periodCode}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-b from-[#081836] via-[#061228] to-[#040C1A] border border-cyan-400/50 shadow-lg relative overflow-hidden"
            >
              {/* Row 1: Digit Badge, Block & Official Due Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-black text-base text-cyan-300 font-mono shrink-0">
                    {selectedDigit}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wide block leading-none">
                      {currentAdvice.blockName}
                    </span>
                    <span className="text-xs text-slate-300 font-medium leading-none mt-1 block">
                      Periodo: <strong className="text-emerald-300">{currentPeriod.periodName}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block leading-none">
                      Vencimiento Oficial SUNAT:
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-emerald-300 font-mono leading-tight flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {officialFullDate}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/40 shrink-0">
                    {officialShortDate}
                  </span>
                </div>
              </div>

              {/* Row 2: Practical Advice Note */}
              <p className="text-xs text-slate-300 leading-relaxed pt-2.5 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{currentAdvice.advice}</span>
              </p>
            </motion.div>

            {/* Actions: Compact WhatsApp button & Table link */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-0.5">
              <a
                href={`https://wa.me/51913150524?text=${encodeURIComponent(
                  `Hola Jorge Pasache / Leader, mi RUC termina en ${selectedDigit} y deseo asesoría contable para mi declaración del periodo ${currentPeriod.periodName} (Vence el ${officialFullDate}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/50 border border-emerald-400/40 transition-all text-center cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Organizar Mis Obligaciones por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setIsFullTableModalOpen(true)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Table className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ver Cuadro Completo 2026</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: 3 Compact Advisory Steps */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 flex flex-col gap-2.5"
          >
            <div className="p-3.5 rounded-xl bg-[#091834] border border-slate-700/60 shadow-md flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">1. No esperes al último momento</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Las caídas de clave SOL no anulan las multas SUNAT. En Leader declaramos con 48h de holgura.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#091834] border border-slate-700/60 shadow-md flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">2. Cruce con SIRE y bancarización</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Conciliamos compras, ventas y detracciones para no perder tu crédito fiscal ante fiscalizaciones.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#091834] border border-slate-700/60 shadow-md flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">3. Alertas preventivas Leader</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Te avisamos con anticipación en cada periodo para que operes con total tranquilidad tributaria.
                </p>
              </div>
            </div>

            {/* Reassurance Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 text-center shadow-sm">
              <p className="text-[11px] font-semibold text-emerald-200">
                Atención continua de lunes a sábado en Chincha con <strong>Jorge Pasache</strong> y el equipo de Leader.
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Full Official Table Modal (Matches WhatsApp_Image_2026-11-09_at_10.03.30_PM_08a0292e.jpeg) */}
      <AnimatePresence>
        {isFullTableModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div onClick={() => setIsFullTableModalOpen(false)} className="fixed inset-0 bg-transparent" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-5xl bg-[#071329] border border-cyan-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl z-10 max-h-[94vh] flex flex-col my-auto custom-scrollbar overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      Cronograma de Obligaciones Mensuales - Ejercicio 2026
                    </h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      SUNAT Oficial
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fechas límites según el último dígito del RUC y régimen de Buenos Contribuyentes / UESP
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintTable}
                    className="p-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Imprimir cronograma"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Imprimir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFullTableModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Table Body Container */}
              <div className="flex-1 overflow-x-auto overflow-y-auto my-4 rounded-xl border border-slate-700 bg-[#040C1A] custom-scrollbar">
                <table className="w-full text-center border-collapse text-xs min-w-[760px]">
                  <thead>
                    {/* Main Title Row */}
                    <tr className="bg-[#0D3663] text-white font-extrabold border-b border-slate-600">
                      <th colSpan={12} className="py-2.5 px-4 text-center text-sm tracking-wide">
                        Cronograma de Obligaciones Mensuales - Ejercicio 2026
                      </th>
                    </tr>

                    {/* Subheaders */}
                    <tr className="bg-[#13487F] text-white text-[11px] font-bold border-b border-slate-700">
                      <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-700 uppercase bg-[#185596]">
                        Período Tributario
                      </th>
                      <th colSpan={10} className="py-1.5 px-2 border-r border-slate-700 uppercase">
                        Fecha de Vencimiento Según el Último Dígito del RUC
                      </th>
                      <th className="py-1.5 px-3 uppercase bg-[#16508E]">
                        Buenos Contribuyentes y UESP
                      </th>
                    </tr>

                    {/* Digits header row */}
                    <tr className="bg-[#1B5C9E] text-white font-bold border-b border-slate-600">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                        <th
                          key={d}
                          className={`py-1.5 px-2 border-r border-slate-700 text-xs ${
                            selectedDigit === d ? 'bg-cyan-500 text-slate-950 font-black' : ''
                          }`}
                        >
                          {d}
                        </th>
                      ))}
                      <th
                        className={`py-1.5 px-2 text-[10px] ${
                          selectedDigit === 'BC' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-[#185596]'
                        }`}
                      >
                        0, 1, 2, 3, 4, 5, 6, 7, 8 y 9
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {SUNAT_SCHEDULE_2026.map((row, rIdx) => {
                      const isCurrentRow = selectedPeriodIndex === rIdx;
                      return (
                        <tr
                          key={row.periodCode}
                          className={`border-b border-slate-800 transition-colors ${
                            isCurrentRow
                              ? 'bg-cyan-950/60 font-bold text-white'
                              : rIdx % 2 === 0
                              ? 'bg-[#061226] text-slate-200'
                              : 'bg-[#081832] text-slate-300'
                          } hover:bg-cyan-900/40`}
                        >
                          {/* Period Label */}
                          <td className="py-2.5 px-3 font-mono font-bold text-cyan-300 border-r border-slate-800 text-left">
                            {row.periodCode}
                          </td>

                          {/* Digits 0 to 9 */}
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => {
                            const isCellHighlighted = isCurrentRow && selectedDigit === d;
                            return (
                              <td
                                key={d}
                                className={`py-2 px-1.5 font-mono border-r border-slate-800 ${
                                  isCellHighlighted
                                    ? 'bg-cyan-400 text-slate-950 font-black rounded-sm'
                                    : ''
                                }`}
                              >
                                {row.dates[d as RucDigit]}
                              </td>
                            );
                          })}

                          {/* Buenos Contribuyentes Column */}
                          <td
                            className={`py-2 px-2 font-mono ${
                              isCurrentRow && selectedDigit === 'BC'
                                ? 'bg-cyan-400 text-slate-950 font-black rounded-sm'
                                : 'text-emerald-300 font-semibold'
                            }`}
                          >
                            {row.dates.BC}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Official Notes Footer */}
              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p><strong>Nota:</strong> Incluye Principales, Medianos y Pequeños Contribuyentes.</p>
                  <p><strong>UESP:</strong> Unidades Ejecutoras del Sector Público Nacional.</p>
                </div>
                
                <a
                  href={`https://wa.me/51913150524?text=${encodeURIComponent(
                    `Hola Jorge Pasache / Leader, estoy revisando el Cronograma de Obligaciones SUNAT 2026 y requiero asesoría para mi negocio.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all self-end sm:self-auto cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Consultar con Jorge Pasache</span>
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
