import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  MessageCircle,
  Sparkles,
  Calendar,
  Tag,
  ShieldAlert,
  Clock,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import {
  DailyVideoData,
  DEFAULT_DAILY_VIDEO,
  getDailyVideoConfig
} from '../services/videoConfigService';

export const DailyVideoSection: React.FC = () => {
  const [videoData, setVideoData] = useState<DailyVideoData>(DEFAULT_DAILY_VIDEO);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true); // start muted for friendly autoplay/browsing
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Load configuration on mount and listen for real-time updates from Admin Portal
  useEffect(() => {
    let isMounted = true;
    getDailyVideoConfig().then((data) => {
      if (isMounted) setVideoData(data);
    });

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<DailyVideoData>;
      if (customEvent.detail) {
        setVideoData(customEvent.detail);
        if (videoRef.current) {
          videoRef.current.load();
        }
      }
    };

    window.addEventListener('leader_daily_video_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('leader_daily_video_updated', handleUpdate);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = Math.floor(sec % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <section id="video-del-dia" className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-b from-[#060E1E] via-[#081734] to-[#060E1E]">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 left-10 w-[25rem] h-[25rem] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Cápsula Informativa Leader
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Actualidad y Consejos <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">del Día</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed text-balance">
            Información oportuna sobre normativas laborales, tributarias y plazos SUNAT / SUNAFIL presentada por el equipo de Leader Consultores.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Left Column: Vertical Video Player (9:16 Studio Reel Layout) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[310px] sm:max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/60 group">
              
              {/* Actual Video Element */}
              <video
                ref={videoRef}
                src={videoData.videoUrl}
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover cursor-pointer"
                onClick={togglePlay}
                poster="/assets/images/business_growth_meeting_1794215306152.jpg"
              />

              {/* Big Play Overlay if paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-opacity"
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-950/80 pl-1 cursor-pointer"
                  >
                    <Play className="w-8 h-8 fill-current" />
                  </motion.div>
                  <span className="mt-3 text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">
                    Reproducir Video
                  </span>
                </div>
              )}

              {/* Top Video Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-[10px] font-bold text-cyan-300 uppercase tracking-wide">
                  {videoData.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-[9px] font-semibold text-emerald-300">
                  {videoData.dateFormatted || 'Actualidad'}
                </span>
              </div>

              {/* Bottom In-Video Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2">
                {/* Progress track */}
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
                      title={isPlaying ? 'Pausar' : 'Reproducir'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
                      title={isMuted ? 'Activar sonido' : 'Silenciar'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-300 font-mono">
                    {duration > 0 && <span>{formatSeconds((duration * progress) / 100)} / {formatSeconds(duration)}</span>}
                    <button
                      type="button"
                      onClick={handleFullscreen}
                      className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
                      title="Pantalla completa"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Informative Content & Direct Consultation */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold w-fit">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Obligación Vigente para Empleadores</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
                {videoData.title}
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0A1832] p-4 rounded-2xl border border-slate-700/80 shadow-md">
                {videoData.description}
              </p>
            </div>

            {/* Quick Key Takeaways */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Cálculo Exacto</span>
                  <span className="text-[11px] text-slate-400">Determinación según remuneración y tiempo laborado.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Cero Contingencias SUNAFIL</span>
                  <span className="text-[11px] text-slate-400">Liquidación y constancia entregada a cada colaborador.</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={`https://wa.me/51913150524?text=${encodeURIComponent(
                  `Hola Jorge Pasache / Leader, vi la cápsula en video sobre "${videoData.title}" y necesito asesoría para mi empresa.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 border border-emerald-400/40 transition-all hover:scale-102 cursor-pointer text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar por WhatsApp sobre este tema</span>
              </a>

              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-cyan-400 fill-current" />}
                <span>{isPlaying ? 'Pausar Video' : 'Ver Video con Audio'}</span>
              </button>
            </div>

            {/* Advisor attribution */}
            <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Contenido diario verificado por <strong>Jorge Pasache</strong> - Leader Consultores (Chincha, Perú).</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
