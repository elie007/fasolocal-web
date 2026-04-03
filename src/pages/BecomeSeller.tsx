import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, CheckCircle2, TrendingUp, ShieldCheck, Users, ArrowRight, Send, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export const BecomeSeller: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    location: '',
    productType: '',
    whatsapp: '',
    experience: 'debutante',
    message: ''
  });

  const handleFirestoreError = (err: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: err instanceof Error ? err.message : String(err),
      authInfo: {
        // Simplified for this context
        status: 'auth_info_not_available'
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    throw new Error(JSON.stringify(errInfo));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const path = 'seller_applications';
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ fullName: '', businessName: '', location: '', productType: '', whatsapp: '', experience: 'debutante', message: '' });
      }, 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'seller_applications');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 sm:pb-24">
      {/* Hero */}
      <section className="bg-secondary py-16 sm:py-24 lg:py-32 relative overflow-hidden mx-auto max-w-6xl md:rounded-[2.5rem] md:mt-6">
        <div className="absolute inset-0 z-0 bg-secondary-dark/20">
          {/* Background color instead of demo image */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/40 to-secondary/80" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-primary-dark leading-tight">Vendez sur FasoLocal</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-dark/90 max-w-3xl mx-auto font-medium leading-relaxed">
            Rejoignez la plus grande communauté de producteurs burkinabè et développez votre activité.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              S'inscrire comme vendeur
            </button>
            <Link 
              to="/auth?role=seller"
              className="bg-white text-primary border-2 border-primary px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-primary/5 transition-all"
            >
              Déjà vendeur ? Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {[
          { icon: TrendingUp, title: "Plus de ventes", desc: "Touchez des milliers de clients à Ouagadougou." },
          { icon: ShieldCheck, title: "Paiements sûrs", desc: "Soyez payée chaque 15 du mois, sans retard." },
          { icon: Users, title: "Visibilité", desc: "Mise en avant de votre histoire et de votre savoir-faire." },
          { icon: Phone, title: "Support 24/7", desc: "Une équipe dédiée pour vous aider sur WhatsApp." },
        ].map((b, i) => (
          <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 text-center space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-xl sm:rounded-2xl flex items-center justify-center text-primary mx-auto">
              <b.icon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-serif">{b.title}</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* Process */}
      <section className="bg-accent py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-center">Comment devenir vendeur ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              { step: "1", title: "Inscription", desc: "Remplissez le formulaire ou contactez-nous sur WhatsApp." },
              { step: "2", title: "Validation", desc: "Nous visitons votre atelier pour certifier la qualité." },
              { step: "3", title: "Vendez !", desc: "Vos produits sont en ligne et prêts à être livrés." },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg shadow-primary/20">
                  {s.step}
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif">{s.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register-form" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-gray-100 space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif">Formulaire d'inscription</h2>
            <p className="text-gray-600">Remplissez ces quelques informations et nous vous recontacterons sous 48h.</p>
          </div>

          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-100 p-8 rounded-3xl text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                <Check size={32} />
              </div>
              <h3 className="text-2xl font-bold text-green-800">C'est envoyé ! 🌿</h3>
              <p className="text-green-700">Merci pour votre intérêt. Notre équipe va examiner votre demande et vous contactera sur WhatsApp très bientôt.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {error && (
                <div className="col-span-full p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Nom complet</label>
                <input 
                  required
                  type="text"
                  disabled={isSubmitting}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                  placeholder="Ex: Mariam Traoré"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Nom de votre entreprise</label>
                <input 
                  required
                  type="text"
                  disabled={isSubmitting}
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                  placeholder="Ex: Faso Épices Bio"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Ville / Quartier</label>
                <input 
                  required
                  type="text"
                  disabled={isSubmitting}
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                  placeholder="Ex: Ouagadougou, Pissy"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Numéro WhatsApp</label>
                <input 
                  required
                  type="tel"
                  disabled={isSubmitting}
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                  placeholder="Ex: +226 00 00 00 00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Type de produits</label>
                <input 
                  required
                  type="text"
                  disabled={isSubmitting}
                  value={formData.productType}
                  onChange={(e) => setFormData({...formData, productType: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                  placeholder="Ex: Soumbala, Farines, Jus..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Expérience</label>
                <select 
                  disabled={isSubmitting}
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all appearance-none"
                >
                  <option value="debutante">Je débute mon activité</option>
                  <option value="intermediaire">Je vends déjà un peu</option>
                  <option value="confirmee">J'ai une activité bien établie</option>
                </select>
              </div>

              <div className="space-y-2 col-span-full">
                <label className="text-sm font-bold text-gray-700 ml-1">Parlez-nous de vous (optionnel)</label>
                <textarea 
                  rows={4}
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                  placeholder="Dites-nous en plus sur votre passion..."
                />
              </div>

              <div className="col-span-full pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer ma demande <Send size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
        <h2 className="text-4xl font-bold font-serif text-center">Questions fréquentes</h2>
        <div className="space-y-4">
          {[
            { q: "Combien ça coûte ?", a: "L'inscription est gratuite. Nous prélevons une commission de 8% uniquement sur vos ventes." },
            { q: "Qui gère la livraison ?", a: "FasoLocal s'occupe de tout ! Nous récupérons vos produits et les livrons aux clients." },
            { q: "Quand suis-je payée ?", a: "Tous vos gains du mois sont versés par Mobile Money le 15 du mois suivant." },
            { q: "Quels produits puis-je vendre ?", a: "Tout produit transformé au Burkina Faso : épices, farines, jus, cosmétiques naturels, etc." },
            { q: "Dois-je avoir un smartphone ?", a: "Oui, un téléphone avec WhatsApp est nécessaire pour recevoir vos commandes." },
          ].map((faq, i) => (
            <details key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-lg list-none">
                {faq.q}
                <ChevronDown size={20} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-dark rounded-[40px] p-12 md:p-20 text-white text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold font-serif">Prêt à commencer ?</h2>
            <p className="text-xl text-gray-300 max-w-xl mx-auto">
              Contactez notre responsable partenaires pour une discussion rapide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://wa.me/22600000000"
                className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Nous contacter
              </a>
              <a 
                href="https://wa.me/22600000000" 
                className="bg-[#25D366] text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Phone fill="white" size={20} /> Discuter sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ChevronDown = ({ size, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);
