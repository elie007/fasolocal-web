import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Target, Heart, Users, ShieldCheck, Zap, TrendingUp, Linkedin, Twitter, Mail } from 'lucide-react';
import { PRODUCTEURS } from '../constants';

export const About: React.FC = () => {
  return (
    <div className="bg-stone-50 min-h-screen font-sans text-[#424242] pb-24">
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-[#2E7D32] mb-6 leading-tight">
              Notre Mission
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed">
              FasoLocal connecte directement les producteurs artisanaux burkinabè avec les consommateurs urbains, 
              pour valoriser nos produits locaux et soutenir l'économie du Faso.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#2E7D32]">L'histoire de FasoLocal</h2>
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Tout a commencé par un constat simple : le Burkina Faso regorge de produits transformés d'une qualité exceptionnelle, 
                mais nos producteurs peinent à atteindre les clients en ville.
              </p>
              <p>
                FasoLocal est né pour briser ces barrières. Nous avons créé une plateforme simple, 
                accessible via WhatsApp, où chaque commande a un impact direct sur la vie d'un producteur burkinabè.
              </p>
            </div>
            <div className="mt-8 p-8 bg-white rounded-2xl border-l-4 border-[#2E7D32] shadow-sm">
              <p className="italic text-xl font-serif leading-relaxed">
                "Notre ambition est que chaque foyer burkinabè puisse consommer local, sain et frais, tout en sachant exactement qui a préparé son produit."
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl bg-stone-200 flex items-center justify-center text-stone-400 font-bold text-2xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-[#2E7D32]/5 mix-blend-multiply"></div>
              FasoLocal
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
              <p className="text-[#2E7D32] font-bold text-4xl font-serif">100%</p>
              <p className="text-sm font-bold uppercase tracking-widest mt-2 text-stone-500">Made in Burkina</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#2E7D32] mb-6">Nos 6 Valeurs Fondamentales</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "100% Local", desc: "Zéro importation. Tous nos produits sont cultivés et transformés au Burkina Faso." },
              { icon: Heart, title: "Équité", desc: "92% du prix de vente revient directement au producteur." },
              { icon: Zap, title: "Rapidité", desc: "Livraison le jour même pour toute commande passée avant 15h." },
              { icon: Users, title: "Proximité", desc: "Nous connaissons personnellement chaque producteur partenaire." },
              { icon: TrendingUp, title: "Impact", desc: "Chaque achat soutient l'autonomisation des producteurs locaux." },
              { icon: Target, title: "Transparence", desc: "Le produit livré est exactement celui que vous voyez en photo." },
            ].map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-stone-50 rounded-3xl border border-stone-100 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2E7D32] mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <v.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold font-serif text-[#2E7D32] mb-4">{v.title}</h3>
                <p className="leading-relaxed text-lg">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Producteurs */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#2E7D32] mb-6">Ils font FasoLocal</h2>
            <p className="text-xl leading-relaxed">Découvrez les visages derrière vos produits préférés.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {PRODUCTEURS.map((p, i) => (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-5 group"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-stone-200 border border-stone-200">
                  <img 
                    src={p.photo} 
                    alt={p.nom} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-2xl text-[#2E7D32]">{p.nom}</h3>
                  <p className="text-stone-500 mt-1">{p.specialite}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#2E7D32] mb-6">L'Équipe FasoLocal</h2>
            <p className="text-xl leading-relaxed">
              Une équipe passionnée et engagée pour transformer l'agriculture burkinabè et valoriser nos savoir-faire locaux.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                name: "Wilfried Elie",
                role: "Fondateur & Visionnaire",
                image: "",
                bio: "Passionné par le développement local et la tech au service de l'impact social."
              },
              {
                name: "Awa Traoré",
                role: "Responsable des Producteurs",
                image: "",
                bio: "Sur le terrain chaque jour pour accompagner et former nos partenaires producteurs."
              },
              {
                name: "Issouf Sawadogo",
                role: "Logistique & Livraison",
                image: "",
                bio: "Le garant de la fraîcheur et de la rapidité de vos livraisons à Ouagadougou."
              },
              {
                name: "Fatou Zongo",
                role: "Service Client & Qualité",
                image: "",
                bio: "À votre écoute pour garantir une expérience exceptionnelle à chaque commande."
              }
            ].map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-6 group"
              >
                <div className="aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-stone-400 font-serif text-xl">FasoLocal</div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-serif text-[#2E7D32] mb-2">{member.name}</h3>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">{member.role}</p>
                  <p className="leading-relaxed">{member.bio}</p>
                  <div className="flex justify-start gap-3 mt-6">
                    <button className="p-2.5 bg-stone-100 rounded-xl text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-colors">
                      <Linkedin size={18} />
                    </button>
                    <button className="p-2.5 bg-stone-100 rounded-xl text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-colors">
                      <Twitter size={18} />
                    </button>
                    <button className="p-2.5 bg-stone-100 rounded-xl text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-colors">
                      <Mail size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Blog */}
      <section className="pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2E7D32] rounded-[2.5rem] p-12 lg:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
            <div className="max-w-2xl relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6">Découvrez nos histoires 🌿</h2>
              <p className="text-xl text-stone-200 leading-relaxed">
                Plongez dans l'univers de nos producteurs et apprenez-en plus sur les richesses de notre terroir à travers notre blog.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-3 bg-white text-[#2E7D32] px-8 py-5 rounded-2xl font-bold text-lg hover:bg-stone-100 transition-colors shadow-xl"
              >
                Lire le blog <TrendingUp size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

