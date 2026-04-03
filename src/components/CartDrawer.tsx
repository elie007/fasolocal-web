import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, cart, updateQuantity, removeFromCart, totalPrice, subtotal, deliveryFee, logistics } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    
    const itemsText = cart.map(item => `- ${item.quantity}x ${item.nom} (${formatPrice(item.prix * item.quantity)})`).join('%0A');
    const subtotalText = formatPrice(subtotal);
    const deliveryText = deliveryFee > 0 ? `Frais de livraison : ${formatPrice(deliveryFee)}` : 'Livraison : Gratuite';
    const totalText = formatPrice(totalPrice);
    
    // Ajout du quartier si disponible
    const quartierText = profile?.neighborhood || profile?.quartier || "Non précisé";
    const clientText = profile ? `%0A%0AClient : ${profile.firstName || profile.nom}%0AQuartier : ${quartierText}` : "";
    
    const message = `Bonjour FasoLocal, je souhaite commander :%0A${itemsText}%0A%0ASous-total : ${subtotalText}%0A${deliveryText}%0A%0ATOTAL : ${totalText}${clientText}`;
    
    window.open(`https://wa.me/22600000000?text=${message}`, '_blank');
    closeCart();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-primary" size={24} />
                <h2 className="text-xl font-bold font-serif">Mon Panier</h2>
                <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingCart size={32} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Votre panier est vide</p>
                    <button 
                      onClick={() => {
                        closeCart();
                        navigate('/boutique');
                      }}
                      className="mt-4 text-primary font-bold hover:underline"
                    >
                      Découvrir nos produits
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                        {item.image || item.photo ? (
                          <img 
                            src={item.image || item.photo} 
                            alt={item.nom} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingCart size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-sm text-gray-900 line-clamp-2">{item.nom}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-primary"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-primary"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-black text-gray-900">
                            {formatPrice(item.prix * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Frais de livraison</span>
                    {deliveryFee > 0 ? (
                      <span className="font-bold text-primary">{formatPrice(deliveryFee)}</span>
                    ) : (
                      <span className="text-green-600 font-bold">Gratuit</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-lg pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-black text-2xl text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#25D366]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Commander sur WhatsApp <ArrowRight size={20} />
                </button>
                
                <p className="text-center text-xs text-gray-500 font-medium">
                  {deliveryFee > 0 
                    ? `Ajoutez ${formatPrice(logistics.seuilGratuite - subtotal)} pour la livraison gratuite !`
                    : "Félicitations ! La livraison est offerte."}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
