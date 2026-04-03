import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Truck, ShieldCheck, Star, ShoppingBag, Clock, Award, Loader2, Users, MapPin, Package, Sunrise, Sun, Moon } from 'lucide-react';
import { PRODUITS as STATIC_PRODUITS, Produit, Categorie, OFFICIAL_CATEGORIES } from '../data';
import { PRODUCTEURS, BLOG_POSTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { HomeCarousel } from '../components/HomeCarousel';
import { getProduits, getCategories, listenProduits, listenCategories } from '../services/firestoreService';
import { seedDatabase } from '../services/seedService';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Database } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Tout');

  const { user } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [nextDelivery, setNextDelivery] = useState('');

  useEffect(() => {
    const calculateNextSlot = () => {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour < 10) {
        setNextDelivery("aujourd'hui entre 14h et 17h");
      } else if (hour < 15) {
        setNextDelivery("aujourd'hui entre 18h et 20h");
      } else {
        setNextDelivery("demain entre 8h et 12h");
      }
    };

    calculateNextSlot();
    const interval = setInterval(calculateNextSlot, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    console.log("Tentative d'initialisation de la base de données...");
    
    try {
      const result = await seedDatabase();
      console.log("Résultat du seeding:", result);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.info(result.message);
        console.warn("Le seeding n'a pas été effectué car la base n'est pas vide.");
      }
    } catch (error) {
      console.error("ERREUR CRITIQUE lors de l'initialisation Firestore:", error);
      toast.error("Erreur lors de l'initialisation. Vérifiez la console pour plus de détails.");
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribeProduits = listenProduits((p) => {
      setProduits(p.length > 0 ? p : STATIC_PRODUITS);
      setIsLoading(false);
    });

    return () => {
      unsubscribeProduits();
    };
  }, []);

  const incontournables = useMemo(() => {
    // Filtrer par catégorie active
    let filtered = [...produits];
    if (activeCategory !== 'Tout') {
      filtered = filtered.filter(p => {
        // On vérifie si la catégorie du produit correspond (insensible à la casse)
        const catId = (p.categorie_id || '').toLowerCase();
        const active = activeCategory.toLowerCase();
        return catId.includes(active) || active.includes(catId);
      });
    }

    // On récupère les derniers produits ajoutés
    return filtered
      .sort((a, b) => {
        const dateA = (a as any).createdAt?.seconds || 0;
        const dateB = (b as any).createdAt?.seconds || 0;
        if (dateB === dateA) return b.id.localeCompare(a.id);
        return dateB - dateA;
      })
      .slice(0, 8); // On en affiche 8 pour bien remplir la grille
  }, [produits, activeCategory]);

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      <div className="space-y-0">
        {/* Carousel / Hero Section */}
        <HomeCarousel />

      {/* Trust Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 py-8 sm:py-10 bg-white rounded-3xl shadow-xl border border-gray-100">
          {[
            { icon: <Truck className="text-secondary" size={28} />, title: "Livraison à Ouagadougou" },
            { icon: <ShieldCheck className="text-secondary" size={28} />, title: "Producteurs certifiés FasoLocal" },
            { icon: <Award className="text-secondary" size={28} />, title: "100% Made in Burkina" },
            { icon: <ShoppingBag className="text-secondary" size={28} />, title: "Commande en 3 minutes" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 sm:gap-3 px-2 sm:px-4">
              {item.icon}
              <span className="font-bold text-[10px] sm:text-sm leading-tight">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories Slider */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-[20px] mb-[40px] space-y-2">
          <h2 className="text-[32px] font-bold font-serif text-[#212121] leading-tight">Explorez le terroir</h2>
          <p className="text-[18px] font-sans text-[#333333] opacity-80 leading-relaxed">
            Les trésors de nos régions, sélectionnés avec amour et passion pour votre bien-être.
          </p>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-6 lg:gap-4">
          {OFFICIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                navigate(`/boutique?category=${encodeURIComponent(cat.id)}`);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-2 px-4 py-4 min-w-[120px] lg:w-full rounded-lg transition-all duration-300 active:scale-95 border",
                "bg-background text-text border-gray-200 hover:bg-accent"
              )}
            >
              <span className="text-2xl sm:text-3xl">{cat.icon}</span>
              <span className="text-xs sm:text-sm font-bold text-center leading-tight whitespace-normal">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>

      {/* Catalogue / Grille de Produits */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">Notre Catalogue</h2>
            <p className="text-gray-600 text-sm sm:text-base">Les meilleurs produits locaux sélectionnés pour vous</p>
          </div>
          <Link to="/boutique" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline whitespace-nowrap">
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : incontournables.length > 0 ? (
            incontournables.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">
              Aucun produit trouvé pour cette catégorie.
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-primary/5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif">Comment ça marche ?</h2>
            <p className="text-gray-600 text-sm sm:text-base italic">"C'est simple comme bonjour, livré direct chez toi !"</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              { step: "01", title: "Choisissez vos produits", desc: "Parcourez notre catalogue 100% burkinabè." },
              { step: "02", title: "Indiquez votre quartier", desc: "On livre partout à Ouagadougou." },
              { step: "03", title: "Recevez à votre porte", desc: "Payez cash ou Mobile Money à la livraison." },
            ].map((item, i) => (
              <div key={i} className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <span className="text-5xl sm:text-6xl font-bold text-primary/10 absolute top-4 right-6">{item.step}</span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif pt-4">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="bg-primary/10 text-primary px-6 py-2 rounded-full font-bold text-xs sm:text-sm">
              🌿 Aucune carte bancaire requise
            </span>
          </div>
        </div>
      </section>

      {/* Delivery Slots Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-gray-100 shadow-xl shadow-primary/5 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900">
                Nos Créneaux de Livraison 🛵
              </h2>
              <p className="text-gray-600 text-lg">
                On livre partout à Ouagadougou, frais et rapide.
              </p>
            </div>
            <div className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 animate-pulse flex items-center gap-3">
              <Clock size={24} />
              <span>Commandez maintenant pour être livré <span className="underline">{nextDelivery}</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-accent/30 p-8 rounded-[2rem] border border-primary/5 space-y-4 group hover:bg-accent/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <Sunrise size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">Avant 10h</p>
                <p className="text-2xl font-bold text-gray-900">Livré 14h - 17h</p>
                <p className="text-sm text-gray-500">Aujourd'hui même</p>
              </div>
            </div>

            <div className="bg-accent/30 p-8 rounded-[2rem] border border-primary/5 space-y-4 group hover:bg-accent/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <Sun size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">Avant 15h</p>
                <p className="text-2xl font-bold text-gray-900">Livré 18h - 20h</p>
                <p className="text-sm text-gray-500">Aujourd'hui même</p>
              </div>
            </div>

            <div className="bg-accent/30 p-8 rounded-[2rem] border border-primary/5 space-y-4 group hover:bg-accent/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <Moon size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">Après 15h</p>
                <p className="text-2xl font-bold text-primary">Livré Demain</p>
                <p className="text-sm text-gray-500">Entre 8h et 12h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Producteurs Section (Nos Héros) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">Nos Héros</h2>
            <p className="text-gray-600 text-sm sm:text-base">Rencontrez les hommes et femmes derrière vos produits préférés</p>
          </div>
          <Link to="/producteurs" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
            Voir tous <ArrowRight size={16} />
          </Link>
        </div>
        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide -mx-4 px-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
          {PRODUCTEURS.slice(0, 3).map((p) => (
            <div key={p.id} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4 group min-w-[280px] sm:min-w-0 flex-shrink-0 md:flex-shrink">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-4 border-accent group-hover:border-secondary transition-colors bg-gray-50">
                <motion.img 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  src={p.photo || "/logo-placeholder.png"} 
                  alt={p.nom} 
                  loading="lazy"
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo-placeholder.png";
                  }}
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif">{p.nom}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{p.ville} · {p.specialite}</p>
              </div>
              <div className="flex justify-center gap-1 text-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(p.note) ? "currentColor" : "none"} />
                ))}
              </div>
              <button 
                onClick={() => navigate(`/producteur/${p.id}`)}
                className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
              >
                Voir sa boutique
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-primary-dark py-12 sm:py-16 text-white overflow-hidden border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-center">
            {[
              { label: "Produits", value: "20+", icon: <ShoppingBag className="text-secondary" size={24} /> },
              { label: "Producteurs", value: "3+", icon: <Users className="text-secondary" size={24} /> },
              { label: "Villes", value: "Ouaga", icon: <MapPin className="text-secondary" size={24} /> },
              { label: "Livraison", value: "J+0", icon: <Truck className="text-secondary" size={24} /> },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-3 sm:space-y-4 group">
                <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary font-sans tracking-tight block">
                    {item.value}
                  </span>
                  <p className="text-secondary font-bold uppercase tracking-widest text-xs sm:text-sm opacity-90">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-center">Ce que nos clients disent 💚</h2>
        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide -mx-4 px-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
          {[
            { name: "Awa", quartier: "Pissy", text: "La bouillie pour mon bébé est incroyable. Livraison rapide à Pissy, je recommande !" },
            { name: "Moussa", quartier: "Dassasgho", text: "Le soumbala sent vraiment bon. On sent que c'est du fait maison, pas comme au marché." },
            { name: "Fatou", quartier: "Ouaga 2000", text: "J'ai commandé à 11h, j'ai reçu à 16h. Service impeccable et produits de qualité." },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4 min-w-[280px] sm:min-w-0 flex-shrink-0 md:flex-shrink">
              <div className="flex gap-1 text-secondary">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-gray-700 italic text-sm sm:text-base">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center font-bold text-primary text-sm sm:text-base">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base">{t.name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{t.quartier}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sell on FasoLocal CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative bg-primary-dark rounded-[3rem] sm:rounded-[4rem] overflow-hidden p-8 sm:p-16 md:p-24 flex flex-col md:flex-row items-center gap-12">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-primary-dark" />
            <div className="absolute inset-0 bg-primary-dark/70 backdrop-blur-[2px]" />
          </div>
          <div className="relative z-10 flex-1 space-y-0 text-left">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif text-white leading-tight drop-shadow-2xl">
              Vendez sur FasoLocal.com
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-xl mt-6 mb-10 font-bold drop-shadow-lg">
              Vous êtes un producteur burkinabè ? Développez votre activité en vendant vos produits directement aux familles de Ouagadougou.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-start">
              <Link 
                to="/devenir-vendeur" 
                className="bg-secondary text-primary-dark px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-secondary/20 hover:scale-105 transition-transform text-center"
              >
                Commencer à vendre
              </Link>
              <Link 
                to="/auth?role=seller" 
                className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-dark transition-all text-center"
              >
                Accès Vendeur
              </Link>
            </div>
          </div>
          <div className="relative z-10 flex-1 hidden lg:block">
            <div className="relative w-full aspect-square max-w-md ml-auto">
              <div className="absolute inset-0 bg-white/10 rounded-3xl rotate-3" />
              <div className="relative z-10 w-full h-full bg-gray-50 rounded-3xl border-8 border-white shadow-2xl flex items-center justify-center text-gray-300">
                <Package size={80} strokeWidth={1} className="opacity-40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission Section */}
      <section className="bg-accent py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary-dark">Notre Mission</h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
              Connecter les villes aux campagnes. Nous croyons en un Burkina Faso où chaque famille a accès à des produits locaux sains, tout en garantissant une rémunération juste à nos producteurs.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <div className="w-16 h-1 bg-primary rounded-full"></div>
            <div className="w-4 h-1 bg-secondary rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 space-y-8 sm:space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900">Le Blog FasoLocal 🌿</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl">
              Histoires de terroir, secrets de cuisine et conseils pour une consommation locale.
            </p>
          </div>
          <Link to="/blog" className="text-primary font-bold text-sm sm:text-base flex items-center gap-2 hover:gap-3 transition-all group">
            Voir tous les articles <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide -mx-4 px-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
          {BLOG_POSTS.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col min-w-[280px] sm:min-w-0 flex-shrink-0 md:flex-shrink"
            >
              <Link to={`/blog/${post.id}`} className="block aspect-[16/10] overflow-hidden relative bg-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 animate-pulse" />
                <motion.img 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  src={post.image || "/logo-placeholder.png"} 
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                  referrerPolicy="no-referrer"
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.opacity = '1';
                    const placeholder = target.previousElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'none';
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo-placeholder.png";
                  }}
                  style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
              </Link>
              <div className="p-6 md:p-8 flex-grow flex flex-col space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
                </div>
                <Link to={`/blog/${post.id}`}>
                  <h3 className="text-lg md:text-xl font-bold font-serif text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-600 text-xs md:text-sm line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="pt-4 mt-auto flex items-center justify-between border-t border-gray-50">
                  <Link 
                    to={`/blog/${post.id}`}
                    className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Lire la suite <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Admin Seed Button (Visible to everyone for maintenance) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 border-t border-dashed border-gray-200">
          <div className="flex flex-col items-center gap-4 p-8 bg-accent/30 rounded-3xl border border-primary/10">
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg flex items-center justify-center gap-2">
                <Database size={20} className="text-primary" /> 
                Administration FasoLocal
              </h3>
              <p className="text-sm text-gray-600">Initialisez votre base de données Firebase avec les produits et catégories officiels.</p>
            </div>
            <button 
              onClick={handleSeed}
              disabled={isSeeding}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSeeding ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
              Pousser les données vers Firebase
            </button>
          </div>
        </section>
    </div>
  );
};
