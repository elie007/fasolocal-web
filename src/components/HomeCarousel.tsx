import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const slides = [
  {
    id: 1,
    type: 'identity',
    bgClass: 'bg-gradient-to-r from-[#1E5631] to-[#0f2e1a]',
    content: (
      <div className="flex items-center justify-between h-full px-6 md:px-16 relative overflow-hidden">
        <div className="z-10 max-w-lg space-y-4 md:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif text-white leading-tight drop-shadow-lg">
            Le meilleur du terroir burkinabè, livré chez vous.
          </h1>
          <p className="text-white text-sm md:text-lg max-w-md font-medium">
            Découvrez des produits naturels, transformés avec soin par nos producteurs locaux.
          </p>
          <div className="pt-2">
            <Link 
              to="/boutique" 
              className="inline-flex items-center gap-2 bg-white text-[#1E5631] px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Découvrir <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="absolute right-[-20px] md:right-10 bottom-0 h-[120%] md:h-[140%] w-2/3 md:w-1/2 flex justify-end items-end translate-y-[10%]">
          <img 
            src="https://images.unsplash.com/photo-1587049352847-4d4b12734185?auto=format&fit=crop&q=80&w=800&transparent=1" 
            alt="Produits du terroir burkinabè - Miel et cire d'abeille naturelle" 
            className="object-contain h-full w-full drop-shadow-2xl"
            loading="eager"
            style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
          />
        </div>
      </div>
    )
  },
  {
    id: 2,
    type: 'promotion',
    bgClass: 'bg-[#FAF9F6] relative overflow-hidden',
    content: (
      <>
        {/* Geometric pattern watermark */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E5631' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }}
        />
        <div className="flex items-center justify-between h-full px-6 md:px-16 relative z-10">
          <div className="space-y-4 max-w-lg">
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E5631] leading-tight font-serif">
                Livraison Gratuite
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#EF6C00]">
                Dès 10 000 FCFA
              </p>
            </div>
            <div className="pt-2">
              <Link 
                to="/boutique" 
                className="inline-flex items-center gap-2 bg-[#1E5631] text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
              >
                J'en profite <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0 absolute right-0 bottom-0 top-0 w-1/2 md:w-[45%] opacity-100 pointer-events-none overflow-hidden hidden sm:block">
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full w-full relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=1000" 
                alt="Service de livraison rapide FasoLocal à Ouagadougou" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Stronger gradient overlay for perfect blending with white background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/90 to-transparent"></div>
            </motion.div>
          </div>
          {/* Mobile version icon (smaller) */}
          <div className="sm:hidden flex-shrink-0 absolute right-4 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1E5631" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
              <circle cx="18" cy="17" r="3"/>
              <circle cx="6" cy="17" r="3"/>
              <path d="M9 17h6"/>
              <path d="M15 17v-4h4l-2-4h-5l-2 8"/>
              <path d="M13 9h-3l-2 4H5"/>
              <path d="M10 9V5h3"/>
            </svg>
          </div>
        </div>
      </>
    )
  }
];

export const HomeCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 group z-10">
      <div className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full overflow-hidden rounded-2xl shadow-md">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={cn("absolute inset-0 w-full h-full", slides[current].bgClass)}
          >
            {slides[current].content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 border border-white/20 shadow-sm"
          style={{ mixBlendMode: current === 1 ? 'difference' : 'normal' }}
        >
          <ChevronLeft strokeWidth={1} size={32} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 border border-white/20 shadow-sm"
          style={{ mixBlendMode: current === 1 ? 'difference' : 'normal' }}
        >
          <ChevronRight strokeWidth={1} size={32} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                current === idx 
                  ? "bg-[#1E5631] w-6" 
                  : "bg-stone-300 w-2 hover:bg-stone-400"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
