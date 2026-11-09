import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { LeaderLogo } from './LeaderLogo';
import { Menu, X, PhoneCall } from 'lucide-react';
import { LEADER_INFO } from '../data/content';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Vencimientos', href: '#vencimientos' },
    { label: 'Beneficios', href: '#beneficios' },
    { label: 'Clientes', href: '#clientes' },
    { label: 'Actualidad', href: '#actualidad' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#081226]/95 backdrop-blur-md border-b border-sky-900/40 shadow-xl shadow-black/40 py-2.5 sm:py-3'
          : 'bg-transparent py-4 sm:py-6'
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between min-h-[60px] sm:min-h-[70px]">
          {/* Zone 1: Single element brand wordmark */}
          <a href="#" className="shrink-0 transition-opacity hover:opacity-95 z-10" aria-label="Leader Home">
            <LeaderLogo size="header" />
          </a>

          {/* Zone 2: Perfectly centered navigation links */}
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-5 lg:gap-8 text-sm font-medium text-slate-300 pointer-events-auto">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="whitespace-nowrap shrink-0 hover:text-cyan-300 transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Zone 3: Mobile menu button (floating WhatsApp is kept as primary contact) */}
          <div className="flex items-center md:hidden shrink-0 z-10">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 focus:outline-none cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-slate-800/80 bg-[#0A192F]/95 backdrop-blur-xl rounded-2xl px-4 shadow-2xl">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                <a
                  href={`tel:+51913150524`}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-sky-300 hover:text-white font-medium"
                >
                  <PhoneCall className="w-4 h-4" />
                  Llamar: {LEADER_INFO.phonePrimary}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
