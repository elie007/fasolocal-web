import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUITS as STATIC_PRODUITS, Produit, OFFICIAL_CATEGORIES } from '../data';
import { ProductCard } from '../components/ProductCard';
import { Filter, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { listenProduits } from '../services/firestoreService';

export const Boutique: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Tout';
  const [categorieActive, setCategorieActive] = useState<string>(initialCategory);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribeProduits = listenProduits((p) => {
      setProduits(p.length > 0 ? p : STATIC_PRODUITS);
      setLoading(false);
    });

    return () => {
      unsubscribeProduits();
    };
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setCategorieActive(category === 'toutes' ? 'Tout' : category);
    }
  }, [searchParams]);

  const produitsFiltrés = useMemo(() => {
    if (categorieActive === 'Tout') {
      return produits;
    }
    return produits.filter(p => {
      const catId = (p.categorie_id || '').toLowerCase();
      const active = categorieActive.toLowerCase();
      return catId.includes(active) || active.includes(catId);
    });
  }, [categorieActive, produits]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Menu latéral des catégories */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Filter size={20} className="text-primary" />
              Catégories
            </h2>
            
            <nav className="grid grid-cols-2 gap-3 md:flex md:flex-col md:gap-0 md:space-y-2">
              {OFFICIAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategorieActive(cat.id)}
                  className={cn(
                    "w-full flex flex-col md:flex-row items-center justify-center md:justify-between p-3 md:px-4 md:py-3 rounded-xl text-sm font-bold transition-all border md:border-transparent",
                    categorieActive === cat.id
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-accent hover:text-primary md:bg-transparent"
                  )}
                >
                  <span className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-center md:text-left">
                    <span className="text-2xl md:text-base">{cat.icon}</span>
                    <span className="text-xs md:text-sm leading-tight">{cat.label}</span>
                  </span>
                  <ChevronRight size={16} className={cn("hidden md:block", categorieActive === cat.id ? "opacity-100" : "opacity-0")} />
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Grille de produits */}
        <main className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {OFFICIAL_CATEGORIES.find(c => c.id === categorieActive)?.label || 'Tous nos produits'}
            </h1>
            <p className="text-gray-500 mt-2">
              Découvrez le meilleur du terroir burkinabè.
            </p>
          </div>

          {produitsFiltrés.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {produitsFiltrés.map((produit) => (
                <ProductCard key={produit.id} product={produit as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">Aucun produit trouvé dans cette catégorie.</p>
              <button 
                onClick={() => setCategorieActive('Tout')}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Voir tous les produits
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Seller CTA */}
      <div className="mt-24 p-12 bg-accent/30 rounded-[3rem] border border-primary/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold font-serif text-gray-900">Vous êtes producteur ? 🌿</h3>
          <p className="text-gray-600">Rejoignez FasoLocal et vendez vos produits à des milliers de clients.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/devenir-vendeur'}
          className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 whitespace-nowrap"
        >
          Commencer à vendre
        </button>
      </div>
    </div>
  );
};

export default Boutique;
