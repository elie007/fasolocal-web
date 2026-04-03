import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { PRODUCTEURS } from '../constants';
import { motion } from 'motion/react';

export const Producteurs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold font-serif text-gray-900">Nos Producteurs 🌿</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Découvrez les hommes et femmes exceptionnels qui transforment les richesses de notre terroir avec passion et savoir-faire traditionnel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {PRODUCTEURS.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/30 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-secondary/20 transition-colors" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-start justify-between">
                <div className="relative bg-gray-50 rounded-full">
                  <motion.img 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    src={p.photo} 
                    alt={p.nom} 
                    loading="lazy"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-md">
                    <ShieldCheck size={14} />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-secondary">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold">{p.note}</span>
                  </div>
                  <span className="text-xs text-gray-400">48 avis</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-serif group-hover:text-primary transition-colors">{p.nom}</h3>
                <p className="text-primary font-medium text-sm">{p.specialite}</p>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <MapPin size={14} />
                  {p.ville}, Burkina Faso
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3 italic">
                "{p.bio}"
              </p>

              <button 
                onClick={() => navigate(`/producteur/${p.id}`)}
                className="w-full bg-accent text-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all group/btn"
              >
                Voir sa boutique <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
