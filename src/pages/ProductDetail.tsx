import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Phone, Star, ShieldCheck, ChevronRight, ChevronLeft, Minus, Plus, Clock, Send, Maximize2, Share2, Facebook, Twitter, Link as LinkIcon, Check, AlertTriangle, Loader2, AlertCircle, ArrowRight, Package, Sunrise, Sun, Moon, Calendar } from 'lucide-react';
import { PRODUITS } from '../data';
import { PRODUCTEURS, REVIEWS } from '../constants';
import { useCart } from '../context/CartContext';
import { formatPrice, cn, isRealImage } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Review } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, Timestamp, doc, getDoc } from 'firebase/firestore';
import { getProduitById, listenProduits } from '../services/firestoreService';
import { toast } from 'sonner';

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

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  
  // Use passed state if available for instant loading
  const initialProduct = location.state?.product;
  const [product, setProduct] = useState<any>(initialProduct || null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!initialProduct);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

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

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: 'Auth context not available here, but would be in a real app',
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    setReviewError("Une erreur est survenue lors de l'opération. Veuillez réessayer.");
  };

  useEffect(() => {
    if (!id) return;

    // Set loading only if we don't have initial data
    if (!initialProduct) {
      setIsLoadingProduct(true);
    }
    setLoadError(null);

    // Timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoadingProduct && !product) {
        setIsLoadingProduct(false);
        setLoadError("Produit introuvable ou chargement trop long. Retour à la boutique.");
      }
    }, 5000);
    
    // Real-time listener for the main product
    const productDocRef = doc(db, 'produits', id);
    const unsubscribeProduct = onSnapshot(productDocRef, (docSnap) => {
      clearTimeout(timeoutId);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Use the same image mapping logic as firestoreService
        const rawImage = data.image || data.image_url || data.photo;
        const image = isRealImage(rawImage) ? rawImage : undefined;
        const unite = data.unite || data.unit;
        
        setProduct({ id: docSnap.id, ...data, image, unite });
      } else {
        // Fallback to static PRODUITS
        const staticProduct = PRODUITS.find(p => p.id === id);
        if (staticProduct) {
          setProduct(staticProduct);
        } else {
          setProduct(null);
          setLoadError("Ce produit n'existe pas dans notre base de données.");
        }
      }
      setIsLoadingProduct(false);
    }, (error) => {
      clearTimeout(timeoutId);
      console.error("Error listening to product:", error);
      const staticProduct = PRODUITS.find(p => p.id === id);
      if (staticProduct) {
        setProduct(staticProduct);
      } else {
        setLoadError("Erreur lors de la récupération du produit.");
      }
      setIsLoadingProduct(false);
    });

    const q = query(
      collection(db, 'product_reviews'),
      where('productId', '==', id)
    );

    const unsubscribeReviews = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          productId: data.productId,
          userName: data.userName,
          rating: data.rating,
          comment: data.comment,
          createdAt: data.createdAt,
          date: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toLocaleDateString('fr-FR') 
            : new Date().toLocaleDateString('fr-FR')
        } as Review & { createdAt: any };
      }).sort((a, b) => {
        const timeA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      
      // Combine with mock reviews for initial data if needed, or just use fetched
      // For this app, we'll merge them but prioritize real ones
      const mockReviews = REVIEWS.filter(r => r.productId === id);
      setReviews([...fetchedReviews, ...mockReviews]);
      setIsLoadingReviews(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'product_reviews');
      setIsLoadingReviews(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribeProduct();
      unsubscribeReviews();
    };
  }, [id, initialProduct]);

  // Fetch similar products from Firestore in real-time
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  useEffect(() => {
    if (!product?.categorie_id) return;

    const unsubscribe = listenProduits((allProduits) => {
      const filtered = allProduits
        .filter((p: any) => p.categorie_id === product.categorie_id && p.id !== product.id)
        .slice(0, 4);
      
      if (filtered.length > 0) {
        setSimilarProducts(filtered);
      } else {
        // Fallback to static
        setSimilarProducts(PRODUITS.filter(p => p.categorie_id === product.categorie_id && p.id !== product.id).slice(0, 4));
      }
    });

    return () => unsubscribe();
  }, [product?.id, product?.categorie_id]);

  // Handle field name variations (English/French)
  const staticProduct = PRODUITS.find(p => p.id === id);
  const nom = product?.nom || staticProduct?.nom || "Produit sans nom";
  const photo = product?.image || staticProduct?.image;
  const prix = product?.prix || staticProduct?.prix || 0;
  const prixPromo = product?.prixPromo;
  const vendeurNom = (product as any)?.producteur || product?.vendeur || staticProduct?.vendeur || "Producteur inconnu";
  const unite = product?.unite || product?.unit || staticProduct?.unite || "";
  const description = product?.description || staticProduct?.description || "Pas de description disponible.";

  // Extract format for badge
  const formatBadge = unite;

  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment || isSubmittingReview) return;
    
    setIsSubmittingReview(true);
    setReviewError(null);

    try {
      await addDoc(collection(db, 'product_reviews'), {
        productId: id || '',
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: serverTimestamp()
      });

      setNewReview({ userName: '', rating: 5, comment: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'product_reviews');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setIsAdded(true);
      toast.success(`${nom} ajouté au panier !`, {
        icon: <ShoppingCart size={16} className="text-primary" />,
        duration: 2000,
      });
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (isLoadingProduct && !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Chargement du produit...</p>
      </div>
    );
  }

  if (loadError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <AlertCircle size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{loadError || "Produit non trouvé 🌿"}</h1>
        <p className="text-gray-500">Le produit que vous recherchez n'est pas disponible ou l'ID est incorrect.</p>
        <button 
          onClick={() => navigate('/boutique')} 
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all inline-flex items-center gap-2"
        >
          <ArrowRight size={18} className="rotate-180" />
          Retour à la boutique
        </button>
      </div>
    );
  }

  const producteur = PRODUCTEURS.find(p => p.nom === vendeurNom);

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(`Bonjour FasoLocal ! Je voudrais commander ${quantity}x ${nom}. 🇧🇫`);
    window.open(`https://wa.me/22600000000?text=${message}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Découvrez ${nom} sur FasoLocal ! 🇧🇫`)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Découvrez ${nom} sur FasoLocal ! 🇧🇫 ${window.location.href}`)}`
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Display */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 relative group flex items-center justify-center">
            {photo ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 animate-pulse" />
                <img 
                  src={photo} 
                  alt={nom} 
                  loading="lazy"
                  className="w-full h-full object-cover relative z-10 transition-opacity duration-300"
                  referrerPolicy="no-referrer"
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.opacity = '1';
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
                  style={{ opacity: 0 }}
                />
                <div className="fallback-text absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-300 hidden">
                  <Package size={64} strokeWidth={1} className="opacity-40" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                <Package size={64} strokeWidth={1} className="opacity-40" />
              </div>
            )}
            
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                <ShieldCheck size={14} /> 🌿 Certifié FasoLocal
              </span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/boutique')}>Boutique</span>
              <ChevronRight size={14} />
              <span className="text-primary font-medium">{nom}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold font-serif text-gray-900">{nom}</h1>
              {formatBadge && (
                <span className="bg-[#F5A623] text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                  {formatBadge}
                </span>
              )}
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-primary/20">
                <ShieldCheck size={14} /> 🌿 Certifié FasoLocal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} 
                  />
                ))}
                <span className="text-sm font-bold ml-1">{averageRating} ({reviews.length} avis)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                Vendu par {producteur ? (
                  <Link 
                    to={`/producteur/${producteur.id}`}
                    className="font-bold text-primary hover:underline"
                  >
                    {vendeurNom}
                  </Link>
                ) : (
                  <span className="font-bold text-primary">{vendeurNom}</span>
                )}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline flex-wrap gap-3">
              <span className="text-[32px] sm:text-[40px] font-black text-[#2E7D32] whitespace-nowrap leading-none">
                {formatPrice(prixPromo || prix)}
              </span>
              {unite && (
                <span className="text-lg sm:text-xl text-gray-500 font-medium">
                  / {unite}
                </span>
              )}
              {prixPromo && (
                <span className="text-xl sm:text-2xl text-gray-400 line-through whitespace-nowrap">
                  {formatPrice(prix)}
                </span>
              )}
            </div>

            {/* Stock Indicator */}
            {product.stock !== undefined && (
              <div className="flex items-center gap-2">
                {product.stock === 0 ? (
                  <span className="flex items-center gap-1.5 text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-full">
                    <AlertTriangle size={14} /> Rupture de stock
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="flex items-center gap-1.5 text-orange-600 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full animate-pulse">
                    <AlertTriangle size={14} /> Plus que {product.stock} articles en stock !
                  </span>
                ) : (
                  <span className="text-green-600 font-medium text-sm">
                    ✅ En stock ({product.stock} disponibles)
                  </span>
                )}
              </div>
            )}

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Delivery Info - Modernized */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-xl flex items-center gap-2 text-gray-900 font-serif">
                  <Clock size={22} className="text-primary" /> Créneaux de livraison
                </h4>
                <p className="text-sm text-gray-500 font-medium">
                  Livraison partout à Ouagadougou 🛵
                </p>
              </div>
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl text-sm font-bold animate-pulse">
                Commandez maintenant pour être livré <span className="underline">{nextDelivery}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-accent/50 p-4 rounded-2xl border border-primary/5 space-y-3 group hover:bg-accent transition-colors">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                  <Sunrise size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avant 10h</p>
                  <p className="font-bold text-gray-900">Livré 14h - 17h</p>
                </div>
              </div>

              <div className="bg-accent/50 p-4 rounded-2xl border border-primary/5 space-y-3 group hover:bg-accent transition-colors">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                  <Sun size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avant 15h</p>
                  <p className="font-bold text-gray-900">Livré 18h - 20h</p>
                </div>
              </div>

              <div className="bg-accent/50 p-4 rounded-2xl border border-primary/5 space-y-3 group hover:bg-accent transition-colors">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                  <Moon size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Après 15h</p>
                  <p className="font-bold text-primary">Livré Demain</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shrink-0">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 sm:p-3 hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                >
                  <Minus size={18} />
                </button>
                <span className="w-10 sm:w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 sm:p-3 hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                animate={isAdded ? { scale: [1, 1.05, 1] } : {}}
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 py-3 sm:py-4 rounded-full font-bold flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-md text-sm sm:text-base",
                  product.stock === 0 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                    : isAdded 
                      ? "bg-green-500 text-white shadow-green-500/20" 
                      : "bg-primary text-white hover:bg-primary-dark shadow-primary/20"
                )}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isAdded ? 'added' : 'not-added'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
                    {product.stock === 0 ? 'Indisponible' : isAdded ? 'Ajouté !' : 'Ajouter au panier'}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleWhatsAppOrder}
                className="flex-[2] bg-[#25D366] text-white py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 sm:gap-3 hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20 text-sm sm:text-base"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  width="20" 
                  height="20" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Commander via WhatsApp
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all text-sm sm:text-base"
              >
                <Share2 size={20} />
                Partager
              </button>
            </div>
          </div>

          {/* Sticky Mobile Actions - Optimized for visibility */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex gap-4 animate-in slide-in-from-bottom duration-300">
            <button 
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              className={cn(
                "flex-1 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all text-base min-h-[48px] shadow-md",
                product.stock === 0 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                  : isAdded
                    ? "bg-green-500 text-white"
                    : "bg-primary text-white active:scale-95 shadow-primary/20"
              )}
            >
              {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
              {product.stock === 0 ? 'Indisponible' : isAdded ? 'Ajouté !' : 'Ajouter au panier'}
            </button>
            <button 
              onClick={handleWhatsAppOrder}
              className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-base min-h-[48px] shadow-lg shadow-[#25D366]/20"
            >
              <Phone size={20} fill="white" />
              WhatsApp
            </button>
          </div>

          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 space-y-6 relative"
              >
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
                
                <h3 className="text-2xl font-bold font-serif">Partager ce produit</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-[#1877F2]/10 text-[#1877F2] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Facebook size={24} fill="currentColor" />
                    </div>
                    <span className="text-xs font-bold">Facebook</span>
                  </a>
                  <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Twitter size={24} fill="currentColor" />
                    </div>
                    <span className="text-xs font-bold">Twitter</span>
                  </a>
                  <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone size={24} fill="currentColor" />
                    </div>
                    <span className="text-xs font-bold">WhatsApp</span>
                  </a>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">Lien direct</p>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      type="text" 
                      value={window.location.href}
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 focus:outline-none"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className={cn(
                        "px-4 rounded-xl font-bold transition-all flex items-center gap-2",
                        copied ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-primary-dark"
                      )}
                    >
                      {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                      {copied ? "Copié" : "Copier"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          <div className="flex gap-4 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2">💵 Cash à la livraison</div>
            <div className="flex items-center gap-2">📱 Orange Money</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-8">
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 snap-x sticky top-0 bg-white z-20">
          {[
            { id: 'description', label: 'Description' },
            { id: 'nutrition', label: 'Nutrition' },
            { id: 'producteur', label: 'Producteur' },
            { id: 'avis', label: `Avis (${reviews.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 sm:px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap snap-start flex-1 sm:flex-none text-center",
                activeTab === tab.id 
                  ? "border-primary text-primary bg-primary/5" 
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="min-h-[200px] text-gray-700 leading-relaxed">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p className="text-lg">{description}</p>
              {product?.image_url && (
                <p className="text-sm text-gray-500 italic">
                  Ce produit est issu de l'agriculture locale burkinabè et transformé selon des méthodes artisanales garantissant sa qualité et sa fraîcheur.
                </p>
              )}
            </div>
          )}
          {activeTab === 'nutrition' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 max-w-md gap-3 sm:gap-4">
              {[
                { label: 'Énergie', value: '350 kcal' },
                { label: 'Protéines', value: '12g' },
                { label: 'Fer', value: '4.5mg' },
                { label: 'Fibres', value: '8g' }
              ].map((item, i) => (
                <div key={i} className="bg-accent/50 p-3 sm:p-4 rounded-xl flex justify-between items-center border border-primary/5">
                  <span className="font-medium text-gray-600">{item.label}</span>
                  <span className="font-bold text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'producteur' && producteur && (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-accent/30 p-6 sm:p-8 rounded-[2rem] border border-primary/5">
              <div className="relative shrink-0 bg-gray-50 rounded-full">
                <motion.img 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  src={producteur.photo} 
                  alt={producteur.nom} 
                  loading="lazy"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md" 
                />
                <div className="absolute -bottom-2 -right-2 bg-secondary text-primary-dark text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                  Certifié
                </div>
              </div>
              <div className="space-y-3 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">{producteur.nom}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {producteur.ville} · Spécialité: <span className="font-bold text-primary">{producteur.specialite}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 italic max-w-md">
                  "Passionné par la transformation des produits locaux depuis plus de 10 ans."
                </p>
                <button 
                  onClick={() => navigate(`/producteur/${producteur.id}`)}
                  className="inline-flex items-center gap-2 text-primary font-bold hover:underline transition-all group"
                >
                  Voir toute sa boutique <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}
          {activeTab === 'avis' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Review Form */}
              <div className="space-y-6 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm h-fit">
                <h3 className="text-xl font-bold font-serif">Laisser un avis 🌿</h3>
                
                {reviewError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                    <AlertCircle className="shrink-0 mt-0.5" size={18} />
                    <p>{reviewError}</p>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Votre Nom</label>
                    <input 
                      required
                      disabled={isSubmittingReview}
                      type="text" 
                      value={newReview.userName}
                      onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                      className="w-full p-3 rounded-xl bg-accent/30 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all disabled:opacity-50"
                      placeholder="Ex: Jean Ouédraogo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Note</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={isSubmittingReview}
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className={cn(
                            "p-1 transition-colors disabled:opacity-50",
                            newReview.rating >= star ? "text-secondary" : "text-gray-300"
                          )}
                        >
                          <Star size={24} fill={newReview.rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Votre Commentaire</label>
                    <textarea 
                      required
                      disabled={isSubmittingReview}
                      rows={4}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full p-3 rounded-xl bg-accent/30 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all disabled:opacity-50"
                      placeholder="Qu'avez-vous pensé de ce produit ?"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Publication...
                      </>
                    ) : (
                      <>
                        Publier mon avis <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-serif">{reviews.length} avis pour ce produit</h3>
                  <div className="flex items-center gap-1 text-secondary">
                    <Star size={18} fill="currentColor" />
                    <span className="font-bold">{averageRating}/5</span>
                  </div>
                </div>
                
                {isLoadingReviews ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-4">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-sm font-medium">Chargement des avis...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 bg-accent/30 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Aucun avis pour le moment. Soyez le premier à en laisser un ! 🌿</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={review.id || i} 
                        className="border-b border-gray-100 pb-6 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-primary">
                              {review.userName[0]}
                            </div>
                            <div>
                              <p className="font-bold">{review.userName}</p>
                              <div className="flex gap-0.5 text-secondary">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} size={12} fill={j < review.rating ? "currentColor" : "none"} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <p className="text-gray-700 italic leading-relaxed">"{review.comment}"</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      <section className="space-y-10">
        <h2 className="text-3xl font-bold font-serif">Produits similaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {similarProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};
