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
    <section id="vencimientos" className="py-20 relative overflow-hidden bg-gradient-to-b from-[#081226] via-[#0B1A38] to-[#081226]">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[30rem] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Campaign Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            ¡Cronograma Oficial SUNAT Ejercicio 2026!
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Continúan los Vencimientos Tributarios SUNAT
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Fechas oficiales que se renuevan mensualmente para el cumplimiento de obligaciones tributarias. Selecciona tu periodo y el último dígito de tu RUC.
          </p>
        </motion.div>

        {/* 2-Column Interactive Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive RUC Digit Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0F2247] border border-cyan-500/30 shadow-2xl shadow-black/40"
          >
            {/* Top Bar with Period Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-700/60">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-cyan-300 block">
                  Simulador de Calendario
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  ¿Cuál es el último dígito de tu RUC?
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFullTableModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-102"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Ver Cuadro Completo</span>
                </button>
              </div>
            </div>

            {/* Monthly Period Navigator (Renovación Mensual) */}
            <div className="mb-6 p-3.5 rounded-2xl bg-[#091734] border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Periodo Tributario:</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={handlePrevPeriod}
                  disabled={selectedPeriodIndex === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-cyan-300 transition-colors cursor-pointer"
                  title="Periodo anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <select
                  value={selectedPeriodIndex}
                  onChange={(e) => setSelectedPeriodIndex(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer"
                >
                  {SUNAT_SCHEDULE_2026.map((period, idx) => (
                    <option key={period.periodCode} value={idx}>
                      {period.periodName} (Vence en {period.dueMonth.split(' ')[0]})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleNextPeriod}
                  disabled={selectedPeriodIndex === SUNAT_SCHEDULE_2026.length - 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-cyan-300 transition-colors cursor-pointer"
                  title="Periodo siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Digit Selection Grid (Matches Screenshot) */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mb-6">
              {digits.map((digit) => (
                <motion.button
                  key={String(digit)}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSelectedDigit(digit)}
                  className={`py-3 px-2 rounded-xl text-center font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${
                    selectedDigit === digit
                      ? 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-900/60 scale-105 border-2 border-cyan-200'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span className="block text-[10px] text-slate-400 uppercase font-medium">
                    {digit === 'BC' ? 'Especial' : 'Dígito'}
                  </span>
                  <span className="text-lg">{digit}</span>
                </motion.button>
              ))}
            </div>

            {/* Selected Result Box with Official SUNAT Due Date */}
            <motion.div
              key={`${String(selectedDigit)}-${currentPeriod.periodCode}`}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#091C3E] via-[#071632] to-[#050F22] border-2 border-cyan-400/60 mb-6 shadow-xl shadow-cyan-950/40 relative overflow-hidden"
            >
              {/* Top Banner inside card */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-black text-xl text-cyan-300 font-mono shadow-inner">
                    {selectedDigit}
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
                      {currentAdvice.blockName}
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Periodo Tributario: <span className="text-emerald-400">{currentPeriod.periodName}</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm">
                  {currentAdvice.urgency}
                </span>
              </div>

              {/* Official Date Spotlight Box */}
              <div className="mb-4 p-4 rounded-xl bg-[#061229] border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Fecha Oficial de Vencimiento SUNAT:
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-emerald-400" />
                    <span className="text-emerald-300 font-mono">{officialFullDate}</span>
                  </div>
                </div>

                <div className="text-center sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase block">Fecha Corta</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-mono font-bold text-sm border border-emerald-500/40">
                    {officialShortDate}
                  </span>
                </div>
              </div>

              {/* Practical Advice */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0A1832] p-3 rounded-lg border border-slate-800">
                {currentAdvice.advice}
              </p>
            </motion.div>

            {/* Direct WhatsApp Action for Selected Digit & Official Date */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://wa.me/51913150524?text=${encodeURIComponent(
                  `Hola Jorge Pasache / Leader Consultores, mi RUC termina en ${selectedDigit} y deseo apoyo contable para presentar mi declaración del periodo ${currentPeriod.periodName} (Vencimiento oficial SUNAT: ${officialFullDate}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 border border-emerald-400/40 transition-all hover:scale-101 text-center cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Organizar Mis Obligaciones por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setIsFullTableModalOpen(true)}
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Table className="w-4 h-4 text-cyan-400" />
                <span>Cronograma 2026</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: 3 Urgent Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="p-5 rounded-2xl bg-[#091834] border border-slate-700/60 shadow-lg">
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

            <div className="p-5 rounded-2xl bg-[#091834] border border-slate-700/60 shadow-lg">
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

            <div className="p-5 rounded-2xl bg-[#091834] border border-slate-700/60 shadow-lg">
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
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-cyan-950/70 border border-emerald-500/40 text-center shadow-md">
              <p className="text-xs font-semibold text-emerald-200">
                ¡Jorge Pasache y el equipo de Leader están listos para asesorarte! Atención continua de lunes a sábado en Chincha.
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
