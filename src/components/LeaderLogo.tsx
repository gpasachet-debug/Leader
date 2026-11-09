import React from 'react';

interface LeaderLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'header';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

export const LeaderLogo: React.FC<LeaderLogoProps> = ({
  className = '',
  size = 'header',
}) => {
  // Height classes according to the 2139x735 (~2.91:1) aspect ratio
  const sizeClasses = {
    header: 'h-14 sm:h-16 md:h-20 lg:h-24 max-w-[280px] sm:max-w-[340px] md:max-w-[440px] lg:max-w-[500px]',
    sm: 'h-10 sm:h-12 md:h-14 max-w-[190px] sm:max-w-[240px]',
    md: 'h-16 sm:h-18 md:h-22 max-w-[290px] sm:max-w-[380px]',
    lg: 'h-22 sm:h-26 lg:h-32 max-w-[380px] sm:max-w-[480px]',
    xl: 'h-28 sm:h-34 lg:h-40 max-w-[440px] sm:max-w-[560px]',
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/assets/aistudio/Logo_futurista_Leader_con_circuitos_luminosos_9d91ee2c.png"
        alt="Leader - Tax, accounting & business consulting"
        className={`w-auto object-contain drop-shadow-[0_0_24px_rgba(0,194,255,0.45)] transition-all duration-300 hover:scale-[1.03] ${sizeClasses[size]}`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
