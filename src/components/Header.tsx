import React, { useState, useEffect } from 'react';
import { LeaderLogo } from './LeaderLogo';
import { MessageCircle, Menu, X, PhoneCall } from 'lucide-react';
import { LEADER_INFO } from '../data/content';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Single element brand wordmark */}
          <a href="#" className="shrink-0 transition-opacity hover:opacity-95" aria-label="Leader Home">
            <LeaderLogo size="header" />
          </a>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
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

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/51913150524?text=${encodeURIComponent(
                'Hola Leader, quisiera coordinar una consulta contable y tributaria para mi negocio.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-100 fill-emerald-100/20" />
              <span className="hidden sm:inline">Consulta por WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 focus:outline-none"
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
