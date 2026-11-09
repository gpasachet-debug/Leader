import React from 'react';
import { LeaderLogo } from './LeaderLogo';
import { LEADER_INFO, SERVICES } from '../data/content';
import { Phone, MapPin, Mail, MessageSquare, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#040814] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <LeaderLogo size="md" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-3">
              Firma de consultoría contable, tributaria y de negocios con sede en Chincha, Perú. 
              Más de 25 años garantizando tranquilidad tributaria y crecimiento ordenado a empresarios, MYPES e independientes.
            </p>
            <div className="flex items-center gap-2 pt-2 text-cyan-300 font-semibold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Más de 25 años de experiencia comprobada</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#servicios" className="hover:text-cyan-300 transition-colors">
                  Servicios Contables
                </a>
              </li>
              <li>
                <a href="#vencimientos" className="hover:text-cyan-300 transition-colors">
                  Cronograma de Vencimientos
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-cyan-300 transition-colors">
                  Nuestros Beneficios
                </a>
              </li>
              <li>
                <a href="#clientes" className="hover:text-cyan-300 transition-colors">
                  Segmentos y Clientes
                </a>
              </li>
              <li>
                <a href="#actualidad" className="hover:text-cyan-300 transition-colors">
                  Actualidad SUNAT
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-cyan-300 transition-colors">
                  Contacto & Citas
                </a>
              </li>
            </ul>
          </div>

          {/* Services list */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Especialidades
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Declaraciones PDT 621</li>
              <li>Contabilidad SIRE / PLE</li>
              <li>Defensa Tributaria SUNAT</li>
              <li>Planillas PLAME & T-Registro</li>
              <li>Fraccionamiento de Deudas</li>
              <li>Constitución SAC / EIRL</li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Contacto Directo
            </h4>
            <div className="space-y-2.5">
              <a
                href={`https://wa.me/51913150524`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: {LEADER_INFO.phonePrimary}</span>
              </a>
              <a
                href={`tel:+51933884597`}
                className="flex items-center gap-2 text-slate-300 hover:text-cyan-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Línea 2: {LEADER_INFO.phoneSecondary}</span>
              </a>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Chincha Alta, Chincha · Ica, Perú</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Asesoría 100% Personalizada</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <p>© {new Date().getFullYear()} Leader - Tax, Accounting & Business Consulting. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Chincha - Perú</span>
            <span>·</span>
            <span>Tu tranquilidad tributaria, nuestra prioridad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
