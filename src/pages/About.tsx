import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Target, Heart, Users, ShieldCheck, Zap, TrendingUp, Linkedin, Twitter, Mail } from 'lucide-react';
import { PRODUCTEURS } from '../constants';

export const About: React.FC = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-primary-dark">
          {/* Background pattern or solid color instead of demo image */}
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold font-serif">Notre Mission</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            FasoLocal connecte directement les producteurs artisanaux burkinabè avec les consommateurs urbains, 
            pour valoriser nos produits locaux et soutenir l'économie du Faso.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold font-serif">L'histoire de FasoLocal</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Tout a commencé par un constat simple : le Burkina Faso regorge de produits transformés d'une qualité exceptionnelle, 
            mais nos producteurs peinent à atteindre les clients en ville.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            FasoLocal est né pour briser ces barrières. Nous avons créé une plateforme simple, 
            accessible via WhatsApp, où chaque commande a un impact direct sur la vie d'un producteur burkinabè.
          </p>
          <div className="bg-accent p-8 rounded-3xl border-l-8 border-primary italic text-primary-dark">
            "Notre ambition est que chaque foyer burkinabè puisse consommer local, sain et frais, tout en sachant exactement qui a préparé son produit."
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-3xl bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-2xl shadow-2xl">
            FasoLocal
          </div>
          <div className="absolute -bottom-6 -right-6 bg-secondary p-8 rounded-3xl shadow-xl">
            <p className="text-primary-dark font-bold text-2xl">100%</p>
            <p className="text-primary-dark text-sm font-medium">Made in Burkina</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-accent py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <h2 className="text-4xl font-bold font-serif text-center">Nos 6 Valeurs Fondamentales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "100% Local", desc: "Zéro importation. Tous nos produits sont cultivés et transformés au Burkina Faso." },
              { icon: Heart, title: "Équité", desc: "92% du prix de vente revient directement au producteur." },
              { icon: Zap, title: "Rapidité", desc: "Livraison le jour même pour toute commande passée avant 15h." },
              { icon: Users, title: "Proximité", desc: "Nous connaissons personnellement chaque producteur partenaire." },
              { icon: TrendingUp, title: "Impact", desc: "Chaque achat soutient l'autonomisation des producteurs locaux." },
              { icon: Target, title: "Transparence", desc: "Le produit livré est exactement celui que vous voyez en photo." },
            ].map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm space-y-4 hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary">
                  <v.icon size={28} />
                </div>
                <h3 className="text-xl font-bold font-serif">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Producteurs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold font-serif">Ils font FasoLocal</h2>
          <p className="text-gray-600">Découvrez les visages derrière vos produits préférés.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {PRODUCTEURS.map(p => (
            <div key={p.id} className="text-center space-y-3">
              <div className="aspect-square rounded-full overflow-hidden border-4 border-accent">
                <img src={p.photo} alt={p.nom} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold font-serif">{p.nom}</h3>
              <p className="text-sm text-gray-500">{p.specialite}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold font-serif text-primary-dark">L'Équipe FasoLocal</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
                className="group text-center space-y-4"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-gray-100 flex items-center justify-center">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="text-gray-400 font-bold">FasoLocal</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <p className="text-white text-sm italic">"{member.bio}"</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-serif text-primary-dark">{member.name}</h3>
                  <p className="text-secondary font-bold text-sm uppercase tracking-wider mb-3">{member.role}</p>
                  <div className="flex justify-center gap-3">
                    <button className="p-2 bg-accent rounded-full text-primary hover:bg-primary hover:text-white transition-all">
                      <Linkedin size={16} />
                    </button>
                    <button className="p-2 bg-accent rounded-full text-primary hover:bg-primary hover:text-white transition-all">
                      <Twitter size={16} />
                    </button>
                    <button className="p-2 bg-accent rounded-full text-primary hover:bg-primary hover:text-white transition-all">
                      <Mail size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Blog */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-primary-dark rounded-[3rem] p-12 lg:p-20 text-white text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-20" />
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-serif">Découvrez nos histoires 🌿</h2>
            <p className="text-lg text-gray-300">
              Plongez dans l'univers de nos producteurs et apprenez-en plus sur les richesses de notre terroir à travers notre blog.
            </p>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 bg-secondary text-primary-dark px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              Lire le blog <TrendingUp size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
