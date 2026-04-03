import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showDotCom?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  variant = 'dark', 
  showDotCom = true 
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={cn("flex items-center gap-2 group cursor-pointer", className)}>
      {/* Logo Icon */}
      <div className="relative flex items-center justify-center w-10 h-10">
        {/* Background stylized leaf shape */}
        <svg 
          viewBox="0 0 40 40" 
          className={cn(
            "absolute inset-0 w-full h-full transition-transform duration-500 group-hover:rotate-12",
            isDark ? "text-primary/10" : "text-white/10"
          )}
        >
          <path 
            d="M20 2C20 2 34 10 34 22C34 31.9411 27.732 40 20 40C12.268 40 6 31.9411 6 22C6 10 20 2 20 2Z" 
            fill="currentColor" 
          />
        </svg>
        
        {/* Main Icon: Stylized Leaf/Plant */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={cn(
            "w-6 h-6 z-10 transition-all duration-300 group-hover:scale-110",
            isDark ? "text-primary" : "text-secondary"
          )}
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a8 8 0 0 1-8 8Z" />
          <path d="M13 18c-1.5 1.5-4 2-5 2s-1.5-3.5 0-5" />
          <path d="M11 20c-1.5 1.5-4 2-5 2s-1.5-3.5 0-5" />
        </svg>
        
        {/* Accent dot */}
        <div className={cn(
          "absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2",
          isDark ? "bg-secondary border-white" : "bg-white border-primary"
        )} />
      </div>

      {/* Logo Text */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span className={cn(
            "text-2xl font-black font-serif tracking-tight",
            isDark ? "text-primary" : "text-white"
          )}>
            Faso
          </span>
          <span className={cn(
            "text-2xl font-bold tracking-tighter",
            isDark ? "text-gray-800" : "text-secondary"
          )}>
            Local
          </span>
          {showDotCom && (
            <span className={cn(
              "text-xs font-bold ml-0.5 opacity-80",
              isDark ? "text-secondary" : "text-white/80"
            )}>
              .com
            </span>
          )}
        </div>
        <span className={cn(
          "text-[8px] uppercase tracking-[0.2em] font-bold mt-0.5",
          isDark ? "text-primary/60" : "text-white/40"
        )}>
          Terroir & Qualité
        </span>
      </div>
    </div>
  );
};
