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
    <div className={cn("flex items-center gap-3 group cursor-pointer", className)}>
      {/* Premium Agro-Food Icon */}
      <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
        <svg 
          viewBox="0 0 42 42" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        >
          {/* Stylized Leaf with negative space cutout */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M21 2C21 2 7 10 7 24C7 31.732 13.268 38 21 38C28.732 38 35 31.732 35 24C35 10 21 2 21 2ZM21 31C23.7614 31 26 28.7614 26 26C26 23.2386 23.7614 21 21 21C18.2386 21 16 23.2386 16 26C16 28.7614 18.2386 31 21 31Z" 
            fill={isDark ? "#1B5E20" : "#FFFFFF"} 
            className="transition-colors duration-300"
          />
          {/* Organic Seed / Ripe Fruit */}
          <circle 
            cx="21" 
            cy="26" 
            r="3.5" 
            fill="#D97706" 
            className="transition-transform duration-500 origin-center group-hover:scale-110"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none justify-center">
        <div className="flex items-baseline">
          <span className={cn(
            "text-2xl md:text-3xl font-black font-sans tracking-tight transition-colors duration-300",
            isDark ? "text-[#1B5E20]" : "text-white"
          )}>
            Faso
          </span>
          <span className="text-2xl md:text-3xl font-black font-sans tracking-tight text-[#D97706]">
            Local
          </span>
        </div>
        <span className={cn(
          "text-[0.55rem] md:text-[0.6rem] uppercase tracking-[0.3em] font-light mt-1 transition-colors duration-300",
          isDark ? "text-[#4A5D4E]" : "text-white/80"
        )}>
          Terroir & Qualité
        </span>
      </div>
    </div>
  );
};

