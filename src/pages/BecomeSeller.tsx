import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sprout, MapPin, History, Send, CheckCircle2, Loader2, Star, ShieldCheck, TrendingUp, Users, Phone, AlertCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const CITIES_NEIGHBORHOODS = {
  "Ouagadougou": ["Pissy", "Dassasgho", "Ouaga 2000", "Patte d'Oie", "Gounghin", "Tampouy", "Somgandé", "Koulouba", "Zogona", "Autre"],
  "Bobo-Dioulasso": ["Accart-ville", "Diarradougou", "Bolomakoté", "Kuinima", "Autre"],
  "Koudougou": ["Secteur 1", "Secteur 2", "Secteur 3", "Autre"],
  "Banfora": ["Secteur 1", "Secteur 2", "Autre"],
  "Ouahigouya": ["Secteur 1", "Secteur 2", "Autre"],
  "Autre": ["Centre-ville", "Périphérie"]
};

export const BecomeSeller: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    city: 'Ouagadougou',
    neighborhood: 'Pissy',
    whatsapp: '+226 ',
    productType: '',
    story: ''
  });

  const validatePhone = (phone: string) => {
    // Burkina Faso format: +226 followed by 8 digits
    const cleanPhone = phone.replace(/\s/g, '');
    const bfRegex = /^\+226\d{8}$/;
    if (!bfRegex.test(cleanPhone)) {
      setPhoneError("Le numéro doit être au format +226 suivi de 8 chiffres");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Always keep +226 at the start
    if (!value.startsWith('+226')) {
      value = '+226 ' + value.replace(/\D/g, '');
    } else {
      // Extract digits after +226
      const digits = value.substring(4).replace(/\D/g, '').substring(0, 8);
      value = '+226 ' + digits;
    }
    
    setFormData({ ...formData, whatsapp: value });
    
    // Real-time validation
    const cleanPhone = value.replace(/\s/g, '');
    if (cleanPhone.length === 12) {
      validatePhone(value);
    } else if (cleanPhone.length > 4) {
      setPhoneError("Le numéro doit comporter 8 chiffres après +226");
    } else {
      setPhoneError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(formData.whatsapp)) {
      toast.error("Veuillez corriger le numéro WhatsApp");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'candidatures_producteurs'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setIsSubmitted(true);
      toast.success("Votre candidature a été envoyée !");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-gray-50 space-y-6"
        >
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">C'est envoyé ! 🌿</h1>
          <p className="text-gray-600 leading-relaxed">
            Merci pour votre intérêt. Wilfried et l'équipe FasoLocal vont examiner votre demande et vous contacteront sur WhatsApp sous 48h pour valider votre terroir.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className="bg-primary-dark text-white py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
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
            Vous êtes producteur ou transformateur au Burkina Faso ? Nous vous aidons à toucher des milliers de clients tout en préservant la qualité de vos produits.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Benefits - "Pourquoi nous rejoindre" Style */}
          <div className="lg:col-span-2 space-y-12 py-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold font-serif text-gray-900">Pourquoi nous rejoindre ?</h2>
              <div className="space-y-8">
                {[
                  { icon: <TrendingUp />, title: "Plus de ventes", desc: "Touchez des milliers de clients à Ouagadougou sans effort marketing." },
                  { icon: <MapPin />, title: "Logistique Simplifiée", desc: "Nous gérons la récupération et la livraison du dernier kilomètre." },
                  { icon: <ShieldCheck />, title: "Paiements Sécurisés", desc: "Transparence totale et règlements rapides de vos ventes chaque mois." },
                  { icon: <Users />, title: "Visibilité & Label", desc: "Mise en avant de votre histoire et obtention du label 'Terroir & Qualité'." }
                ].map((benefit, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="w-14 h-14 bg-accent/30 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                      {benefit.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-primary-dark text-white rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              <h3 className="text-2xl font-bold font-serif">Le label "Terroir & Qualité"</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Chaque partenaire validé reçoit notre badge de confiance. C'est le gage d'un produit authentique, sain et respectueux de nos traditions burkinabè.
              </p>
              <div className="inline-flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-full text-xs font-black">
                <CheckCircle2 size={16} /> TERROIR & QUALITÉ
              </div>
            </div>
          </div>

          {/* Unified Registration Form */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-50"
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold font-serif text-gray-900">Formulaire d'inscription</h2>
                <p className="text-gray-500 mt-2">Remplissez ces informations pour rejoindre la communauté.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1">Nom complet / Nom de la Coopérative *</label>
                  <input 
                    required
                    type="text" 
                    placeholder="ex: Mariam Traoré ou Coopérative Miel du Mouhoun"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 ml-1">Ville *</label>
                    <select 
                      required
                      value={formData.city}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        setFormData({
                          ...formData, 
                          city: newCity, 
                          neighborhood: CITIES_NEIGHBORHOODS[newCity as keyof typeof CITIES_NEIGHBORHOODS][0]
                        });
                      }}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all appearance-none"
                    >
                      {Object.keys(CITIES_NEIGHBORHOODS).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 ml-1">Quartier *</label>
                    <select 
                      required
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all appearance-none"
                    >
                      {CITIES_NEIGHBORHOODS[formData.city as keyof typeof CITIES_NEIGHBORHOODS].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1">Numéro WhatsApp *</label>
                  <div className="relative">
                    <input 
                      required
                      type="tel" 
                      placeholder="+226 XX XX XX XX"
                      value={formData.whatsapp}
                      onChange={handlePhoneChange}
                      className={cn(
                        "w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 transition-all",
                        phoneError ? "focus:ring-red-500/20 focus:border-red-500" : "focus:ring-primary/20 focus:border-primary focus:bg-white"
                      )}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={20} />
                    </div>
                  </div>
                  {phoneError && (
                    <p className="text-xs text-red-500 flex items-center gap-1 ml-1">
                      <AlertCircle size={12} /> {phoneError}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1">Type de produits *</label>
                  <input 
                    required
                    type="text" 
                    placeholder="ex: Miel, Karité, Farines de céréales, Jus..."
                    value={formData.productType}
                    onChange={(e) => setFormData({...formData, productType: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1">Votre Histoire / Expérience *</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Racontez-nous comment vous produisez, vos valeurs, depuis quand vous exercez..."
                    value={formData.story}
                    onChange={(e) => setFormData({...formData, story: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all resize-none"
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
                  En envoyant ce formulaire, vous acceptez d'être recontacté par FasoLocal sur WhatsApp pour valider votre dossier.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
