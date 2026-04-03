import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Phone, Users, LogOut, Loader2, LayoutDashboard, ArrowRight, ShoppingBag, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cn, formatPrice } from '../lib/utils';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Logo } from './Logo';
import { Produit } from '../data';
import { listenProduits } from '../services/firestoreService';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const { user, profile, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isTopBannerOpen, setIsTopBannerOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [produits, setProduits] = useState<Produit[]>([]);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const unsubscribe = listenProduits((p) => {
      setProduits(p);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/boutique?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  const quickResults = searchQuery.trim().length >= 2 
    ? produits.filter(p => 
        (p.nom || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.categorie_id || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {isTopBannerOpen && (
        <div className="bg-secondary px-4 py-2 text-center text-sm font-medium text-gray-900 relative">
          <span>🎁 Livraison GRATUITE dès 10 000 FCFA · Code : FASOLOCAL</span>
          <button 
            onClick={() => setIsTopBannerOpen(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 w-full">
        {/* Groupe Gauche : Logo */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo variant="dark" />
          </Link>
        </div>

        {/* Groupe Centre : Liens de navigation (Tablette/Desktop) */}
        <nav className="hidden md:flex items-center gap-4 ml-8 lg:ml-10 text-sm font-bold shrink-0">
          <Link to="/" className="hover:text-primary transition-colors relative group py-2">
            Accueil
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/boutique" className="hover:text-primary transition-colors relative group py-2">
            Boutique
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/producteurs" className="hover:text-primary transition-colors relative group py-2">
            Producteurs
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          {(profile?.role === 'seller' || profile?.role === 'admin') && (
            <Link to="/tableau-de-bord" className="text-primary hover:opacity-80 transition-all flex items-center gap-1 py-2">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}
          {user?.email === 'wilfreidelie@gmail.com' && (
            <Link to="/admin-fasolocal" className="text-secondary hover:opacity-80 transition-all flex items-center gap-1 py-2 font-black">
              <Settings size={16} /> Admin
            </Link>
          )}
          <Link to="/a-propos" className="hover:text-primary transition-colors relative group py-2">
            À propos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Groupe Recherche (Flexible) */}
        <div className="hidden md:flex items-center relative group flex-grow max-w-md mx-4 lg:mx-8">
          <form onSubmit={handleSearch} className="relative flex items-center w-full">
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Rechercher un produit..." 
              className="pl-10 pr-10 py-2 rounded-2xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary w-full transition-all focus:bg-white focus:shadow-xl"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors" size={14} />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-gray-400 hover:text-primary transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Quick Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full mt-3 left-0 right-0 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-[60] min-w-[320px]"
              >
                {searchQuery.trim().length >= 2 ? (
                  <div className="p-3">
                    <div className="px-4 py-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Résultats suggérés</span>
                      <span className="text-[10px] text-primary font-bold">{quickResults.length} trouvés</span>
                    </div>
                    <div className="space-y-1">
                      {quickResults.length > 0 ? (
                        quickResults.map(product => (
                          <Link 
                            key={product.id}
                            to={`/produit/${product.id}`}
                            className="flex items-center gap-4 p-3 hover:bg-accent rounded-2xl transition-all group"
                            onClick={() => {
                              setSearchQuery('');
                              setIsSearchFocused(false);
                            }}
                          >
                            <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              <img 
                                src={product.image || "/logo-placeholder.png"} 
                                alt={product.nom} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/logo-placeholder.png";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{product.nom || "Produit sans nom"}</div>
                              <div className="text-xs font-bold text-[#212121]">{formatPrice(product.prix || 0)}</div>
                            </div>
                            <ArrowRight size={14} className="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                          </Link>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <div className="text-sm font-medium text-gray-500 italic">Désolé, aucun produit local ne correspond à votre recherche.</div>
                        </div>
                      )}
                    </div>
                    {quickResults.length > 0 && (
                      <button 
                        onClick={handleSearch}
                        className="w-full mt-2 p-4 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1b4b1e] rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2E7D32]/20"
                      >
                        Voir tous les résultats <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-5">
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Recherches populaires</div>
                    <div className="flex flex-wrap gap-2 px-2">
                      {['Soumbala', 'Miel', 'Beurre de Karité', 'Riz', 'Huile'].map(term => (
                        <button 
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            navigate(`/boutique?q=${encodeURIComponent(term)}`);
                          }}
                          className="px-4 py-2 rounded-full bg-accent hover:bg-secondary hover:text-primary-dark text-xs font-bold transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Groupe Droite : Profil et Panier */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Icône Loupe Mobile */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search size={20} />
          </button>

          {/* Sous-groupe Profil + Panier (Soudés ensemble) */}
          <div className="flex items-center gap-3 cart-container-tablet">
            {user ? (
              <Link to="/profil" className="flex items-center gap-2 p-2 hover:bg-accent rounded-full transition-colors group">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary-dark text-xs font-bold">
                  {profile?.firstName?.[0] || user.email?.[0]?.toUpperCase()}
                </div>
                <span className="hidden xl:inline text-sm font-bold text-gray-700 group-hover:text-secondary transition-colors">
                  {profile?.firstName || 'Profil'}
                </span>
              </Link>
            ) : (
              <Link to="/auth" className="p-2 hover:bg-accent rounded-full transition-colors flex items-center gap-2 group">
                <User size={24} className="text-gray-600 group-hover:text-secondary transition-colors" />
                <span className="hidden xl:inline text-sm font-bold text-gray-700 group-hover:text-secondary transition-colors">Connexion</span>
              </Link>
            )}

            <button 
              onClick={openCart}
              className="hidden md:flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full font-bold transition-all text-sm shadow-md shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0 min-w-[110px] cart-button-tablet"
            >
              <motion.div 
                key={totalItems}
                initial={{ scale: 1 }}
                animate={{ scale: totalItems > 0 ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="relative flex items-center justify-center"
              >
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {totalItems}
                  </span>
                )}
              </motion.div>
              <span className="leading-none">Panier</span>
            </button>
          </div>

          {/* Mobile Menu Toggle & Mobile Cart */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={openCart}
              className="relative p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <motion.div 
                key={totalItems}
                initial={{ scale: 1 }}
                animate={{ scale: totalItems > 0 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {totalItems}
                  </span>
                )}
              </motion.div>
            </button>
            <button 
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b px-4 py-3"
          >
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..." 
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <button 
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <X size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-4 font-medium">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
            <Link to="/boutique" onClick={() => setIsMenuOpen(false)}>Boutique</Link>
            <Link to="/producteurs" onClick={() => setIsMenuOpen(false)}>Producteurs</Link>
            {(profile?.role === 'seller' || profile?.role === 'admin') && (
              <Link to="/tableau-de-bord" onClick={() => setIsMenuOpen(false)} className="text-primary font-bold flex items-center gap-2">
                <LayoutDashboard size={18} /> Tableau de Bord
              </Link>
            )}
            {user?.email === 'wilfreidelie@gmail.com' && (
              <Link to="/admin-fasolocal" onClick={() => setIsMenuOpen(false)} className="text-secondary font-black flex items-center gap-2">
                <Settings size={18} /> Administration
              </Link>
            )}
            <Link to="/a-propos" onClick={() => setIsMenuOpen(false)}>À propos</Link>
            {user ? (
              <>
                <Link to="/profil" onClick={() => setIsMenuOpen(false)} className="text-primary font-bold">Mon Profil</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left text-red-500 font-bold">Se déconnecter</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="text-primary font-bold">Se connecter / S'inscrire</Link>
            )}
          </nav>
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher du soumbala..." 
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-accent text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>
      )}
    </header>
  );
};
