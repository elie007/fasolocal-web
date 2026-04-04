import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Database, Plus, Save, Trash2, Package, Truck, Settings, Check, AlertCircle, Loader2, Image as ImageIcon, Search, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  getProduits, 
  addProduit, 
  updateProduit, 
  getLogisticsConfig, 
  updateLogisticsConfig,
  LogisticsConfig,
  listenOrders,
  updateOrderStatus,
  Order
} from '../services/firestoreService';
import { Produit, OFFICIAL_CATEGORIES } from '../data';
import { formatPrice, cn } from '../lib/utils';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'logistics' | 'orders'>('orders');
  const [produits, setProduits] = useState<Produit[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Partial<Produit> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Logistics State
  const [logistics, setLogistics] = useState<LogisticsConfig>({
    fraisLivraison: 1000,
    seuilGratuite: 10000
  });

  // Security: Only wilfreidelie@gmail.com
  if (!user || user.email !== 'wilfreidelie@gmail.com') {
    return <Navigate to="/" replace />;
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Faso2024') {
      setIsAuthenticated(true);
    } else {
      toast.error("Mot de passe incorrect");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [p, l] = await Promise.all([
          getProduits(),
          getLogisticsConfig()
        ]);
        setProduits(p);
        setLogistics(l);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const unsubscribeOrders = listenOrders((o) => {
      setOrders(o);
    });

    return () => {
      unsubscribeOrders();
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 w-full max-w-md text-center space-y-6"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Settings size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-serif">Accès Administrateur</h1>
            <p className="text-gray-500">Veuillez entrer le mot de passe pour continuer.</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-center text-xl tracking-widest"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              Se connecter
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.nom || !editingProduct?.prix || !editingProduct?.categorie_id) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSaving(true);
    try {
      if (editingProduct.id) {
        await updateProduit(editingProduct.id, editingProduct);
        toast.success("Produit mis à jour");
      } else {
        await addProduit(editingProduct as Omit<Produit, 'id'>);
        toast.success("Produit ajouté");
      }
      const updated = await getProduits();
      setProduits(updated);
      setEditingProduct(null);
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLogistics = async () => {
    setIsSaving(true);
    try {
      await updateLogisticsConfig(logistics);
      toast.success("Configuration logistique mise à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = produits.filter(p => 
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.vendeur?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary-dark text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
              <Settings className="text-secondary" /> Dashboard Admin FasoLocal
            </h1>
            <p className="text-white/70">Bienvenue Wilfried. Gérez votre terroir en toute simplicité.</p>
          </div>
          
          <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('orders')}
              className={cn(
                "px-6 py-2 rounded-xl font-bold transition-all",
                activeTab === 'orders' ? "bg-white text-primary-dark shadow-lg" : "text-white hover:bg-white/5"
              )}
            >
              Commandes
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={cn(
                "px-6 py-2 rounded-xl font-bold transition-all",
                activeTab === 'products' ? "bg-white text-primary-dark shadow-lg" : "text-white hover:bg-white/5"
              )}
            >
              Produits
            </button>
            <button 
              onClick={() => setActiveTab('logistics')}
              className={cn(
                "px-6 py-2 rounded-xl font-bold transition-all",
                activeTab === 'logistics' ? "bg-white text-primary-dark shadow-lg" : "text-white hover:bg-white/5"
              )}
            >
              Logistique
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {activeTab === 'orders' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client / Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Articles</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="font-bold text-gray-900">{order.customer.firstName} {order.customer.lastName}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Smartphone size={12} className="text-[#25D366]" /> {order.customer.whatsapp}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString('fr-FR') : 'Date inconnue'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-600 max-w-xs">
                            {order.items.map((item, i) => (
                              <span key={i}>
                                {item.quantity}x {item.nom}{i < order.items.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">{formatPrice(order.finalTotal)}</td>
                        <td className="px-6 py-4">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className={cn(
                              "text-[10px] font-bold px-2 py-1 rounded-full border-none focus:ring-0 cursor-pointer",
                              order.status === 'en_attente' && "bg-yellow-100 text-yellow-700",
                              order.status === 'en_cours' && "bg-blue-100 text-blue-700",
                              order.status === 'livre' && "bg-green-100 text-green-700",
                              order.status === 'annule' && "bg-red-100 text-red-700"
                            )}
                          >
                            <option value="en_attente">En attente</option>
                            <option value="en_cours">En cours</option>
                            <option value="livre">Livré</option>
                            <option value="annule">Annulé</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              const text = `Bonjour ${order.customer.firstName}, votre commande FasoLocal est en cours de traitement !`;
                              window.open(`https://wa.me/${order.customer.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="text-primary font-bold hover:underline text-sm flex items-center gap-1 justify-end"
                          >
                            <Smartphone size={14} /> WhatsApp
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button 
                  onClick={() => setEditingProduct({})}
                  className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all w-full sm:w-auto justify-center"
                >
                  <Plus size={20} /> Ajouter
                </button>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produit</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                <img src={p.image} alt={p.nom} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{p.nom}</p>
                                <p className="text-xs text-gray-500">{p.vendeur}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">{formatPrice(p.prix)}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold bg-accent text-primary px-2 py-1 rounded-full">
                              {p.categorie_id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {p.isValidated ? (
                              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                                <Check size={10} /> Terroir & Qualité
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                                Standard
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => setEditingProduct(p)}
                              className="text-primary font-bold hover:underline text-sm"
                            >
                              Modifier
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Form Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-serif">
                    {editingProduct ? (editingProduct.id ? "Modifier le produit" : "Nouveau produit") : "Sélectionnez un produit"}
                  </h2>
                  {editingProduct && (
                    <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                      <Plus size={24} className="rotate-45" />
                    </button>
                  )}
                </div>

                {editingProduct ? (
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Nom du produit *</label>
                      <input 
                        required
                        type="text" 
                        value={editingProduct.nom || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, nom: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Prix (FCFA) *</label>
                        <input 
                          required
                          type="number" 
                          value={editingProduct.prix || ''}
                          onChange={(e) => setEditingProduct({...editingProduct, prix: Number(e.target.value)})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Unité (kg, pot, etc.)</label>
                        <input 
                          type="text" 
                          placeholder="ex: pot de 500g"
                          value={editingProduct.unite || ''}
                          onChange={(e) => setEditingProduct({...editingProduct, unite: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Catégorie *</label>
                      <select 
                        required
                        value={editingProduct.categorie_id || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, categorie_id: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Choisir...</option>
                        {OFFICIAL_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Producteur / Vendeur</label>
                      <input 
                        type="text" 
                        value={editingProduct.vendeur || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, vendeur: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">URL de l'image</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={editingProduct.image || ''}
                          onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                          {editingProduct.image ? <img src={editingProduct.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" />}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                      <textarea 
                        rows={3}
                        value={editingProduct.description || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-accent/30 rounded-2xl border border-primary/10">
                      <input 
                        type="checkbox" 
                        id="isValidated"
                        checked={editingProduct.isValidated || false}
                        onChange={(e) => setEditingProduct({...editingProduct, isValidated: e.target.checked})}
                        className="w-5 h-5 rounded accent-primary"
                      />
                      <label htmlFor="isValidated" className="text-sm font-bold text-primary-dark cursor-pointer">
                        Label "Terroir & Qualité"
                      </label>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      {editingProduct.id ? "Mettre à jour" : "Ajouter le produit"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <Package size={32} className="text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-sm">Cliquez sur un produit pour le modifier ou sur "Ajouter" pour en créer un nouveau.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-sm border border-gray-100 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck size={40} className="text-primary" />
                </div>
                <h2 className="text-3xl font-bold font-serif">Configuration Logistique</h2>
                <p className="text-gray-500">Définissez vos règles de livraison pour Ouagadougou.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Frais de livraison par défaut (FCFA)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={logistics.fraisLivraison}
                      onChange={(e) => setLogistics({...logistics, fraisLivraison: Number(e.target.value)})}
                      className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-2xl font-black focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">FCFA</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Seuil de livraison gratuite (FCFA)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={logistics.seuilGratuite}
                      onChange={(e) => setLogistics({...logistics, seuilGratuite: Number(e.target.value)})}
                      className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-2xl font-black focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">FCFA</span>
                  </div>
                </div>

                <div className="p-6 bg-accent/30 rounded-3xl border border-primary/10 flex gap-4">
                  <AlertCircle className="text-primary shrink-0" size={24} />
                  <p className="text-sm text-primary-dark leading-relaxed">
                    <strong>Note :</strong> Ces modifications s'appliquent instantanément à tous les paniers clients. La livraison gratuite sera offerte pour toute commande supérieure à {formatPrice(logistics.seuilGratuite)}.
                  </p>
                </div>

                <button 
                  onClick={handleSaveLogistics}
                  disabled={isSaving}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                  Enregistrer la configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
