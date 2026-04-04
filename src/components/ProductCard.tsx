import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Tag, Package } from 'lucide-react'; // Ajout de Tag pour l'icône catégorie
import { Product } from '../types'; 
import { formatPrice, cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, openCart } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    openCart(); // Open drawer when adding to cart
    toast.success(`${product.nom} ajouté au panier !`, {
      icon: <ShoppingCart size={16} className="text-primary" />,
      duration: 2000,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const photo = product.image;
  const prix = product.prix || 0;
  const unite = product.unite || product.unit || "";
  const producteur = (product as any).producteur || product.vendeur || "Producteur local";
  
  // Extract format (e.g., '1kg') from unite (e.g., 'Sachet 1kg')
  const formatBadge = unite.split(' ').pop();

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 group"
    >
      {/* Rendre l'image cliquable */}
      <Link 
        to={`/produit/${product.id}`} 
        state={{ product }}
        className="cursor-pointer relative block min-h-[48px]"
      >
        <div className="h-40 sm:h-48 md:h-56 w-full overflow-hidden bg-gray-50 relative flex items-center justify-center">
          {photo ? (
            <>
              {/* Placeholder background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 animate-pulse" />
              
              <img 
                src={photo} 
                alt={`Produit local : ${product.nom} - ${producteur}`} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                referrerPolicy="no-referrer"
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = '1';
                  // Hide placeholder when loaded
                  const placeholder = target.previousElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'none';
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.fallback-text');
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }
                }}
                style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
              />
              <div className="fallback-text absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-300 hidden">
                <Package size={32} strokeWidth={1} className="opacity-40" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
              <Package size={32} strokeWidth={1} className="opacity-40" />
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
          {product.isBestSeller && (
            <div className="bg-secondary text-primary-dark text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
              Populaire 🔥
            </div>
          )}
          {(product as any).isValidated && (
            <div className="bg-primary text-white text-[10px] sm:text-xs font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
              <ShieldCheck size={12} /> TERROIR & QUALITÉ
            </div>
          )}
        </div>
        
        {/* Format Badge (Top Right) */}
        {formatBadge && (
          <div className="absolute top-2 right-2 bg-yellow-400/70 text-black text-[12px] font-sans font-bold px-3 py-1 rounded-full shadow-md z-20 scale-90 origin-top-right">
            {formatBadge}
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-primary-dark text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 z-20">
          100% Local 🇧🇫
        </div>
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-bold text-sm sm:text-lg text-gray-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors min-h-[2.5rem] sm:min-h-[3.5rem]">
            {product.nom}
          </h3>
          
          <div className="flex items-start gap-1 text-[10px] sm:text-xs text-gray-500 mb-2">
            <ShieldCheck size={12} className="text-primary mt-0.5 shrink-0" />
            <span className="line-clamp-1">{producteur}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-1 sm:pt-2">
          <div className="flex items-baseline flex-wrap gap-1 mb-2 sm:mb-4">
            <span className="text-[22px] font-black text-[#2E7D32] whitespace-nowrap">
              {formatPrice(prix)}
            </span>
            {unite && (
              <span className="text-[14px] text-[#757575] font-medium">
                / {unite}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={cn(
              "w-full font-black py-2 sm:py-3 px-2 sm:px-4 rounded-full flex items-center justify-center gap-1 sm:gap-2 transition-all shadow-md text-xs sm:text-base active:scale-95",
              isAdding 
                ? "bg-green-500 text-white shadow-green-500/20" 
                : "bg-primary hover:bg-primary-dark text-white shadow-primary/20"
            )}
          >
            {isAdding ? (
              <>
                <ShieldCheck size={14} className="sm:w-[18px] sm:h-[18px]" />
                Ajouté !
              </>
            ) : (
              <>
                <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
                Ajouter au panier
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
