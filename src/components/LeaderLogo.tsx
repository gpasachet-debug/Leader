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
    header: 'h-12 sm:h-14 md:h-16 lg:h-18 max-w-[240px] sm:max-w-[300px] lg:max-w-[380px]',
    sm: 'h-9 sm:h-10 md:h-12 max-w-[170px] sm:max-w-[210px]',
    md: 'h-14 sm:h-16 md:h-18 max-w-[240px] sm:max-w-[310px]',
    lg: 'h-20 sm:h-24 lg:h-28 max-w-[340px] sm:max-w-[440px]',
    xl: 'h-28 sm:h-32 lg:h-36 max-w-[420px] sm:max-w-[520px]',
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/assets/aistudio/Logo_futurista_Leader_con_circuitos_luminosos_9d91ee2c.png"
        alt="Leader - Tax, accounting & business consulting"
        className={`w-auto object-contain drop-shadow-[0_0_20px_rgba(0,194,255,0.4)] transition-all duration-300 hover:scale-[1.03] ${sizeClasses[size]}`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
