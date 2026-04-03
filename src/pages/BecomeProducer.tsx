import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sprout, MapPin, History, Send, CheckCircle2, Loader2, ArrowRight, Star } from 'lucide-react';
import { submitProducerApplication } from '../services/firestoreService';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export const BecomeProducer: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    ville: 'Ouagadougou',
    specialite: '',
    histoire: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitProducerApplication(formData);
      setIsSubmitted(true);
      toast.success("Votre candidature a été envoyée !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl border border-gray-100 space-y-6"
        >
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Merci !</h1>
          <p className="text-gray-600 leading-relaxed">
            Votre candidature a été reçue avec succès. Wilfried et l'équipe FasoLocal l'étudieront avec attention. Nous vous recontacterons très prochainement pour valoriser votre terroir.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-primary-dark text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-primary rounded-full blur-3xl" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6 relative z-10"
        >
          <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md">
            <Star className="text-secondary" size={16} /> Rejoignez l'aventure FasoLocal
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
            Valorisez votre terroir, <br /> <span className="text-secondary">vendez en direct.</span>
          </h1>
          <p className="text-xl text-white/70 leading-relaxed">
            Vous êtes producteur au Burkina Faso ? Nous vous aidons à toucher des milliers de clients à Ouagadougou tout en préservant la qualité de vos produits.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Benefits */}
          <div className="lg:col-span-2 space-y-8 py-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-serif text-gray-900">Pourquoi nous rejoindre ?</h2>
              <div className="space-y-6">
                {[
                  { icon: <Sprout />, title: "Visibilité Maximale", desc: "Vos produits mis en avant auprès d'une clientèle exigeante." },
                  { icon: <MapPin />, title: "Logistique Simplifiée", desc: "Nous gérons la livraison du dernier kilomètre à Ouaga." },
                  { icon: <History />, title: "Paiement Garanti", desc: "Transparence totale et règlements rapides de vos ventes." }
                ].map((benefit, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 shrink-0 text-primary">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-500">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-primary-dark text-white rounded-[2.5rem] space-y-4 shadow-xl">
              <h3 className="text-xl font-bold font-serif">Le label "Terroir & Qualité"</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Chaque producteur validé reçoit notre badge de confiance. C'est le gage d'un produit authentique, sain et respectueux de nos traditions.
              </p>
              <div className="inline-flex items-center gap-2 bg-accent text-primary px-3 py-1.5 rounded-full text-xs font-black">
                <CheckCircle2 size={14} /> TERROIR & QUALITÉ
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-2xl border border-gray-100"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nom ou Coopérative *</label>
                  <input 
                    required
                    type="text" 
                    placeholder="ex: Coopérative Miel du Mouhoun"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Ville *</label>
                    <select 
                      required
                      value={formData.ville}
                      onChange={(e) => setFormData({...formData, ville: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="Ouagadougou">Ouagadougou</option>
                      <option value="Bobo-Dioulasso">Bobo-Dioulasso</option>
                      <option value="Koudougou">Koudougou</option>
                      <option value="Autre">Autre ville</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Spécialité *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="ex: Miel, Karité, Céréales"
                      value={formData.specialite}
                      onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Votre Histoire</label>
                  <textarea 
                    rows={5}
                    placeholder="Racontez-nous comment vous produisez, vos valeurs..."
                    value={formData.histoire}
                    onChange={(e) => setFormData({...formData, histoire: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                  Envoyer ma candidature
                </button>
                
                <p className="text-center text-xs text-gray-400">
                  En envoyant ce formulaire, vous acceptez d'être recontacté par FasoLocal pour valider votre dossier.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
