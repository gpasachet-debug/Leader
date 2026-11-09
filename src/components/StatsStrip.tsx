import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, TrendingUp, Handshake, CheckCircle } from 'lucide-react';

export const StatsStrip: React.FC = () => {
  const pillars = [
    {
      icon: TrendingUp,
      title: 'Soluciones a tu medida',
      desc: 'Planes contables adaptados al tamaño de tu negocio y régimen tributario.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: ShieldCheck,
      title: 'Optimización tributaria',
      desc: 'Aprovecha todos los escudos fiscales legales y deducciones permitidas por ley.',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Handshake,
      title: 'Acompañamiento en todo el proceso',
      desc: 'No eres un número más; respondemos tus dudas contables día a día.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Award,
      title: 'Confianza y profesionalismo',
      desc: 'Más de dos décadas cuidando el patrimonio de empresarios y emprendedores.',
      color: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <div className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-[#0B1B38] border border-cyan-500/20 shadow-2xl shadow-black/50"
      >
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-white/[0.04]"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-md`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
