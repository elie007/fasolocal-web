import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  variant = 'dark'
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={cn("flex flex-row items-center gap-2 md:gap-3 group cursor-pointer", className)}>
      {/* Premium Agro-Food Icon : Stylized Leaf in a Circle */}
      <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 shrink-0">
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        >
          {/* Cercle parfait */}
          <circle 
            cx="24" cy="24" r="22" 
            stroke={isDark ? "#1E5631" : "#FFFFFF"} 
            strokeWidth="2.5" 
            className="transition-colors duration-300"
          />
          
          {/* Contours de la feuille */}
          <path 
            d="M24 6C10 6 6 24 24 42C42 24 38 6 24 6Z" 
            stroke={isDark ? "#1E5631" : "#FFFFFF"} 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
            className="transition-colors duration-300"
          />
          
          {/* Nervure centrale */}
          <path 
            d="M24 42V6" 
            stroke={isDark ? "#EF6C00" : "#FDBA74"} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="transition-colors duration-300"
          />
          
          {/* Nervures secondaires */}
          <path 
            d="M24 32C28 32 32 29 34 24" 
            stroke={isDark ? "#EF6C00" : "#FDBA74"} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="transition-colors duration-300"
          />
          <path 
            d="M24 22C20 22 16 19 14 14" 
            stroke={isDark ? "#EF6C00" : "#FDBA74"} 
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
            "text-2xl md:text-3xl font-extrabold font-sans tracking-tight transition-colors duration-300",
            isDark ? "text-[#1E5631]" : "text-white"
          )}>
            Faso
          </span>
          <span className={cn(
            "text-2xl md:text-3xl font-extrabold font-sans tracking-tight transition-colors duration-300",
            isDark ? "text-[#EF6C00]" : "text-[#FDBA74]"
          )}>
            Local
          </span>
        </div>
        <span className={cn(
          "hidden sm:block text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.25em] font-bold mt-1.5 transition-colors duration-300",
          isDark ? "text-stone-500" : "text-white/80"
        )}>
          Terroir & Qualité
        </span>
      </div>
    </div>
  );
};

