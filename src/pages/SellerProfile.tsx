import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, ShieldCheck, ChevronRight, Phone, Mail } from 'lucide-react';
import { PRODUCTEURS, PRODUITS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';

export const SellerProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const seller = PRODUCTEURS.find(p => p.id === id);
  
  if (!seller) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Producteur non trouvé 🌿</h1>
        <button onClick={() => navigate('/boutique')} className="text-primary font-bold underline">
          Retour à la boutique
        </button>
      </div>
    );
  }

  const sellerProducts = PRODUITS.filter(p => p.vendeur === seller.nom);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Profile */}
      <div className="bg-white rounded-[2rem] p-8 lg:p-12 border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
          <div className="relative">
            <img 
              src={seller.photo} 
              alt={seller.nom} 
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl font-bold font-serif">{seller.nom}</h1>
                <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full border border-secondary/20">
                  Producteur Vérifié
                </span>
              </div>
              <p className="text-xl text-primary font-medium">{seller.specialite}</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                {seller.ville}, Burkina Faso
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                {seller.membreDepuis || "Membre depuis 2022"}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-secondary">
                  <Star size={18} fill="currentColor" />
                  <span className="font-bold">{seller.note}</span>
                </div>
                (48 avis clients)
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all">
                <Phone size={18} /> Contacter
              </button>
              <button className="bg-accent text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-accent/80 transition-all border border-primary/10">
                <Mail size={18} /> Envoyer un message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar: Story */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-accent/30 p-8 rounded-3xl border border-primary/5 space-y-4">
            <h2 className="text-2xl font-bold font-serif">Son Histoire 🌿</h2>
            <p className="text-gray-700 leading-relaxed italic">
              "{seller.bio || "Une passionnée de la transformation locale qui s'engage pour la qualité et l'authenticité des produits du Burkina Faso."}"
            </p>
            <div className="pt-4 space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-wider text-primary">Engagements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">✅ 100% Naturel</li>
                <li className="flex items-center gap-2">✅ Sans conservateurs</li>
                <li className="flex items-center gap-2">✅ Commerce équitable</li>
              </ul>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold font-serif">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-xs text-gray-500 uppercase">Produits</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-2xl font-bold text-primary">4.9</p>
                <p className="text-xs text-gray-500 uppercase">Note</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-2xl font-bold text-primary">98%</p>
                <p className="text-xs text-gray-500 uppercase">Satisfaction</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-2xl font-bold text-primary">24h</p>
                <p className="text-xs text-gray-500 uppercase">Réponse</p>
              </div>
            </div>
          </section>
        </div>

        {/* Main: Products */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold font-serif">Ses Produits</h2>
            <div className="text-sm text-gray-500">
              Affichage de {sellerProducts.length} produits
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sellerProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {sellerProducts.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
            </div>
          )}

          {/* Reviews Section */}
          <div className="space-y-8 pt-10 border-t border-gray-100">
            <h2 className="text-3xl font-bold font-serif">Avis sur le producteur</h2>
            <div className="space-y-6">
              {[
                { name: 'Awa', rating: 5, comment: 'Les produits de ' + seller.nom + ' sont toujours de qualité. Je commande chez elle depuis un an.', date: 'Il y a 2 semaines' },
                { name: 'Moussa', rating: 4, comment: 'Très bon accueil et produits authentiques. Livraison rapide.', date: 'Il y a 1 mois' },
                { name: 'Fatou', rating: 5, comment: 'Le meilleur soumbala que j\'ai goûté à Ouaga. Merci !', date: 'Il y a 3 mois' }
              ].map((review, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-primary">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="font-bold">{review.name}</p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex text-secondary">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
