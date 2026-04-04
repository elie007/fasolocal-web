import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'standard' | 'inverted' | 'monochrome' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  variant = 'standard',
  size = 'md',
  showSlogan = true
}) => {
  const isStandard = variant === 'standard' || variant === 'dark';
  const isInverted = variant === 'inverted' || variant === 'light';
  const isMonochrome = variant === 'monochrome';

  // Colors
  const forestGreen = isMonochrome ? "#FFFFFF" : (isInverted ? "#FFFFFF" : "#1E5631");
  const orangeOchre = isMonochrome ? "#FFFFFF" : "#EF6C00";
  const stoneGrey = isMonochrome ? "#FFFFFF" : (isInverted ? "#FFFFFF" : "#78716c");

  const sizeClasses = {
    sm: "h-8",
    md: "h-10 md:h-12",
    lg: "h-16 md:h-20",
    xl: "h-24 md:h-32"
  };

  const iconSizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 md:w-12 md:h-12",
    lg: "w-16 h-16 md:w-20 md:h-20",
    xl: "w-24 h-24 md:w-32 md:h-32"
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-6xl md:text-7xl"
  };

  const sloganSizeClasses = {
    sm: "text-[0.45rem]",
    md: "text-[0.55rem] md:text-[0.65rem]",
    lg: "text-[0.75rem] md:text-[0.9rem]",
    xl: "text-[0.9rem] md:text-[1.2rem]"
  };

  return (
    <div className={cn("flex flex-row items-center gap-2 md:gap-4 group", className)}>
      {/* Original Vector Icon */}
      <div className={cn("relative flex items-center justify-center shrink-0", iconSizeClasses[size])}>
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        >
          {/* Cercle parfait */}
          <circle 
            cx="24" cy="24" r="22" 
            stroke={forestGreen} 
            strokeWidth="2.5" 
            className="transition-colors duration-300"
          />
          
          {/* Contours de la feuille */}
          <path 
            d="M24 6C10 6 6 24 24 42C42 24 38 6 24 6Z" 
            stroke={forestGreen} 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
            className="transition-colors duration-300"
          />
          
          {/* Nervure centrale */}
          <path 
            d="M24 42V6" 
            stroke={orangeOchre} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="transition-colors duration-300"
          />
          
          {/* Nervures secondaires */}
          <path 
            d="M24 32C28 32 32 29 34 24" 
            stroke={orangeOchre} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="transition-colors duration-300"
          />
          <path 
            d="M24 22C20 22 16 19 14 14" 
            stroke={orangeOchre} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="transition-colors duration-300"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none justify-center">
        <div className="flex flex-row items-baseline">
          <span className={cn(
            "font-black font-sans tracking-tight transition-colors duration-300",
            textSizeClasses[size],
            isStandard ? "text-[#1E5631]" : "text-white"
          )}>
            Faso
          </span>
          <span className={cn(
            "font-black font-sans tracking-tight transition-colors duration-300",
            textSizeClasses[size],
            isStandard ? "text-[#EF6C00]" : "text-white"
          )}>
            Local
          </span>
        </div>
        {showSlogan && (
          <span className={cn(
            "uppercase tracking-[0.15em] md:tracking-[0.3em] font-bold mt-0.5 md:mt-1.5 transition-colors duration-300 whitespace-nowrap",
            sloganSizeClasses[size],
            isStandard ? "text-[#78716c]" : "text-white/90"
          )}>
            Terroir & Qualité
          </span>
        )}
      </div>
    </div>
  );
};

