import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Package, Wallet, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, cn } from '../lib/utils';
import { FREE_DELIVERY_THRESHOLD } from '../constants';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center space-y-6">
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto text-primary">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-bold font-serif">Votre panier est vide pour l'instant 🌿</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Découvrez nos délicieux produits locaux et soutenez nos producteurs burkinabè.
        </p>
        <Link 
          to="/boutique" 
          className="inline-block bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-all"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-8 sm:mb-10">Votre Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 items-center">
              <div className="w-[60px] h-[60px] rounded-xl overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center border border-gray-100">
                {item.image || item.image_url || item.photo ? (
                  <img 
                    src={item.image || item.image_url || item.photo} 
                    alt={item.nom} 
                    loading="lazy"
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.fallback-icon');
                        if (fallback) (fallback as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div className={cn(
                  "fallback-icon items-center justify-center text-gray-300 w-full h-full",
                  (item.image || item.image_url || item.photo) ? "hidden" : "flex"
                )}>
                  <Package size={24} strokeWidth={1.5} className="opacity-40" />
                </div>
              </div>
              <div className="flex-1 space-y-0.5 sm:space-y-1">
                <h3 className="font-bold text-base sm:text-lg line-clamp-2">{item.nom}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{item.vendeur}</p>
                <p className="text-secondary font-bold text-sm sm:text-base">{formatPrice(item.prix)}</p>
              </div>
              <div className="flex flex-col items-end gap-2 sm:gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden scale-90 sm:scale-100">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-3 sm:p-4 hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <span className="w-10 sm:w-12 text-center font-bold text-base sm:text-lg">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-3 sm:p-4 hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-3 sm:p-4 min-w-[48px] min-h-[48px] flex items-center justify-center"
                  aria-label="Supprimer du panier"
                >
                  <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-bold font-serif">Récapitulatif</h2>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-bold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-sm italic">Calculé à l'étape suivante</span>
              </div>
              {totalPrice < FREE_DELIVERY_THRESHOLD && (
                <div className="bg-accent p-4 rounded-xl text-sm text-primary">
                  Plus que <span className="font-bold">{formatPrice(FREE_DELIVERY_THRESHOLD - totalPrice)}</span> pour la livraison gratuite !
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-end mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-bold text-secondary">{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-3 text-sm font-bold text-[#1E5631]">
                  <div className="flex items-center justify-center gap-3 bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl w-full">
                    <Wallet size={20} color="#1E5631" strokeWidth={1.5} className="shrink-0" />
                    <span>Payer Cash à la livraison</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl w-full">
                    <Smartphone size={20} color="#EF6C00" strokeWidth={1.5} className="shrink-0" />
                    <span>Paiement via <span className="text-[#EF6C00] font-black tracking-tight">Orange Money</span></span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/commande')}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg bg-secondary text-primary-dark hover:bg-[#E59512] shadow-secondary/20"
                >
                  Valider la commande <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/boutique" className="text-primary font-bold hover:underline">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
