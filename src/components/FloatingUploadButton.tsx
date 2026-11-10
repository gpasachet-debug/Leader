import React from 'react';
import { motion } from 'motion/react';
import { UploadCloud, FileText } from 'lucide-react';

interface FloatingUploadButtonProps {
  onOpen: () => void;
}

export const FloatingUploadButton: React.FC<FloatingUploadButtonProps> = ({ onOpen }) => {
  return (
    <div className="fixed bottom-5 left-5 z-40">
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-950/60 border border-cyan-400/40 transition-all duration-300 cursor-pointer"
        aria-label="Abrir portal flotante para enviar documentos"
      >
        {/* Pulsing indicator dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-200 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300" />
        </span>

        <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" />
        
        <span className="inline sm:hidden font-semibold">Enviar Docs</span>
        <span className="hidden sm:inline font-semibold">Enviar Archivos / Documentos</span>
      </motion.button>
    </div>
  );
};
