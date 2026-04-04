import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Phone, MapPin, Wallet, Truck, User as UserIcon, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, cn } from '../lib/utils';
import { DELIVERY_FEES, FREE_DELIVERY_THRESHOLD } from '../constants';
import { createOrder } from '../services/firestoreService';
import { toast } from 'sonner';

export const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    whatsapp: '',
    city: 'Ouagadougou',
    neighborhood: '',
    landmark: '',
    paymentMethod: 'cash',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEES['Ouagadougou Centre'];
  const finalTotal = totalPrice + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createOrder({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          whatsapp: formData.whatsapp,
          neighborhood: formData.neighborhood,
          landmark: formData.landmark,
          city: formData.city,
          note: formData.note
        },
        items: cart.map(item => ({
          id: item.id,
          nom: item.nom,
          prix: item.prix,
          quantity: item.quantity,
          vendeur: item.vendeur
        })),
        total: totalPrice,
        deliveryFee,
        finalTotal,
        paymentMethod: formData.paymentMethod,
        status: 'en_attente'
      });

      setIsSubmitted(true);
      setTimeout(() => {
        clearCart();
      }, 100);
    } catch (error) {
      toast.error("Erreur lors de la validation de la commande. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto text-primary">
          <CheckCircle2 size={64} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-serif text-primary">✅ Commande reçue !</h1>
          <p className="text-xl text-gray-600">
            Merci de soutenir nos producteurs burkinabè ! 🇧🇫
          </p>
          <p className="bg-accent p-6 rounded-2xl text-primary font-medium">
            Vous recevrez une confirmation WhatsApp dans les 30 minutes.
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-secondary text-primary-dark px-10 py-4 rounded-full font-bold hover:bg-[#E59512] transition-all shadow-lg shadow-secondary/20"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/panier');
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/panier')}
        className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline"
      >
        <ArrowLeft size={20} /> Retour au panier
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form */}
        <div className="space-y-10">
          <h1 className="text-4xl font-bold font-serif">Finaliser ma commande</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                <UserIcon size={20} className="text-primary" /> Vos informations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Prénom</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nom</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Phone size={16} className="text-[#25D366]" /> Votre WhatsApp
                </label>
                <input 
                  required
                  type="tel" 
                  placeholder="+226 ..."
                  className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                <MapPin size={20} className="text-primary" /> Adresse de livraison
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Ville</label>
                  <select 
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  >
                    <option value="Ouagadougou">Ouagadougou</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Quartier</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Pissy, Dassasgho..."
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Repère pour le livreur</label>
                <textarea 
                  rows={2}
                  placeholder="Ex: À côté de la pharmacie, portail vert..."
                  className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={formData.landmark}
                  onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                <Wallet size={20} className="text-primary" /> Mode de paiement
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <label 
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl border cursor-pointer transition-all",
                    formData.paymentMethod === 'cash' ? "border-[#1E5631] bg-stone-50 ring-1 ring-[#1E5631]" : "border-stone-200 bg-stone-50 hover:border-gray-300"
                  )}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    className="w-5 h-5 accent-[#1E5631]"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={() => setFormData({...formData, paymentMethod: 'cash'})}
                  />
                  <div className="flex items-center gap-4 flex-1">
                    <Wallet size={24} color="#1E5631" strokeWidth={1.5} className="shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1E5631]">Payer Cash à la livraison</span>
                      <span className="text-xs text-gray-500">Payez en espèces quand vous recevez vos produits.</span>
                    </div>
                  </div>
                </label>

                <label 
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl border cursor-pointer transition-all",
                    formData.paymentMethod === 'orange' ? "border-[#EF6C00] bg-stone-50 ring-1 ring-[#EF6C00]" : "border-stone-200 bg-stone-50 hover:border-gray-300"
                  )}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    className="w-5 h-5 accent-[#EF6C00]"
                    checked={formData.paymentMethod === 'orange'}
                    onChange={() => setFormData({...formData, paymentMethod: 'orange'})}
                  />
                  <div className="flex items-center gap-4 flex-1">
                    <Smartphone size={24} color="#EF6C00" strokeWidth={1.5} className="shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1E5631]">Paiement via <span className="text-[#EF6C00] font-black tracking-tight">Orange Money</span></span>
                      <span className="text-xs text-gray-500">Faites le transfert au livreur sur place.</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-secondary text-primary-dark py-5 rounded-2xl font-bold text-xl shadow-xl shadow-secondary/20 hover:bg-[#E59512] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <span className="animate-spin">⏳</span>}
              Confirmer ma commande
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-32 h-fit">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <h2 className="text-2xl font-bold font-serif">Ma commande</h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                      <img 
                        src={item.image_url || item.photo || "/logo-placeholder.png"} 
                        alt="" 
                        loading="lazy"
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/logo-placeholder.png";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm line-clamp-2">{item.nom}</p>
                      <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">{formatPrice(item.prix * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span className="font-bold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-2"><Truck size={16} /> Livraison</span>
                <span className="font-bold text-gray-900">{deliveryFee === 0 ? "Gratuite" : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                <span className="text-lg font-bold">Total à payer</span>
                <span className="text-3xl font-bold text-secondary">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="bg-accent p-4 rounded-2xl text-xs text-primary leading-relaxed">
              <p className="font-bold mb-1">🌿 Information importante</p>
              <p>Aucun paiement n'est requis maintenant. Vous paierez directement au livreur lors de la réception de vos produits.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
