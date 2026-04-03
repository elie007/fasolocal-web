import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

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

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    subject: 'Question sur une commande',
    message: ''
  });

  const handleFirestoreError = (err: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: err instanceof Error ? err.message : String(err),
      authInfo: { status: 'auth_info_not_available' },
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
      const path = 'contact_messages';
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });

      setIsSubmitted(true);
      setFormData({ name: '', whatsapp: '', subject: 'Question sur une commande', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'contact_messages');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold font-serif">Contactez-nous</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Une question sur une commande ? Envie de devenir partenaire ? 
          Notre équipe est là pour vous aider du lundi au samedi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-bold font-serif">Nos coordonnées</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-bold">Téléphone / WhatsApp</p>
                  <p className="text-gray-600">+226 00 00 00 00</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-gray-600">contact@fasolocal.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold">Siège Social</p>
                  <p className="text-gray-600">Ouagadougou, Secteur 15, Burkina Faso</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="font-bold">Horaires</p>
                  <p className="text-gray-600">Lun - Sam : 08h00 - 20h00</p>
                </div>
              </div>
            </div>
          </div>

          <a 
            href="https://wa.me/22600000000" 
            className="block bg-[#25D366] text-white p-8 rounded-3xl text-center space-y-4 hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20"
          >
            <svg 
              viewBox="0 0 24 24" 
              width="48" 
              height="48" 
              fill="currentColor"
              className="mx-auto"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <p className="text-xl font-bold">Commander via WhatsApp</p>
            <p className="text-sm opacity-90">Réponse rapide garantie 🌿</p>
          </a>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold font-serif">Message envoyé !</h2>
                <p className="text-gray-600 max-w-md">
                  Merci de nous avoir contactés. Notre équipe vous répondra sur WhatsApp dans les plus brefs délais.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary font-bold hover:underline"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Votre Nom Complet</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-4 rounded-xl bg-accent/30 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                      placeholder="Ex: Jean Ouédraogo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Votre Numéro WhatsApp</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full p-4 rounded-xl bg-accent/30 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                      placeholder="+226 ..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Sujet</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-4 rounded-xl bg-accent/30 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                  >
                    <option>Question sur une commande</option>
                    <option>Devenir vendeur</option>
                    <option>Signaler un problème</option>
                    <option>Autre demande</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Votre Message</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-4 rounded-xl bg-accent/30 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                    placeholder="Comment pouvons-nous vous aider ?"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Envoyer le message <Send size={20} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
