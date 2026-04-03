import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  TrendingUp, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Truck,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { formatPrice, cn } from '../lib/utils';
import { PRODUITS } from '../constants';

export const SellerDashboard: React.FC = () => {
  const { profile, loading, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  React.useEffect(() => {
    if (isAuthReady && !loading) {
      if (!profile || (profile.role !== 'seller' && profile.role !== 'admin')) {
        navigate('/auth?role=seller', { replace: true });
      }
    }
  }, [profile, loading, isAuthReady, navigate]);

  if (loading || !isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile || (profile.role !== 'seller' && profile.role !== 'admin')) {
    return null;
  }

  // Mock data for the dashboard
  const stats = [
    { label: 'Ventes Totales', value: '145 000 FCFA', icon: TrendingUp, trend: '+12%', positive: true },
    { label: 'Commandes', value: '24', icon: ShoppingBag, trend: '+5%', positive: true },
    { label: 'Produits Actifs', value: '12', icon: Package, trend: '0%', positive: true },
    { label: 'Note Moyenne', value: '4.9/5', icon: Star, trend: '+0.1', positive: true },
  ];

  const recentOrders = [
    { id: '#ORD-7829', customer: 'Awa Traoré', date: 'Aujourd\'hui, 14:20', amount: 8500, status: 'Payé', deliveryStatus: 'Pending', items: 3 },
    { id: '#ORD-7825', customer: 'Moussa Diallo', date: 'Hier, 18:45', amount: 12000, status: 'Payé', deliveryStatus: 'Delivered', items: 5 },
    { id: '#ORD-7821', customer: 'Fatou Zongo', date: '25 Mars', amount: 4500, status: 'Payé', deliveryStatus: 'Shipped', items: 2 },
    { id: '#ORD-7818', customer: 'Jean Ouédraogo', date: '24 Mars', amount: 25000, status: 'Payé', deliveryStatus: 'Cancelled', items: 8 },
  ];

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit">
            <Clock size={14} />
            En attente
          </span>
        );
      case 'Shipped':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
            <Truck size={14} />
            Expédié
          </span>
        );
      case 'Delivered':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
            <CheckCircle2 size={14} />
            Livré
          </span>
        );
      case 'Cancelled':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full w-fit">
            <XCircle size={14} />
            Annulé
          </span>
        );
      default:
        return null;
    }
  };

  const sellerProducts = PRODUITS.filter(p => p.vendeur === 'Maman Fatou').slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-serif">Tableau de Bord</h1>
            <p className="text-gray-500">Bienvenue, {profile?.firstName || 'Producteur'} ! Voici l'état de votre boutique aujourd'hui.</p>
          </div>
          <button 
            onClick={() => setIsAddProductOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={20} /> Nouveau Produit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
              { id: 'products', label: 'Mes Produits', icon: Package },
              { id: 'orders', label: 'Commandes', icon: ShoppingBag },
              { id: 'settings', label: 'Paramètres', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-md" 
                    : "text-gray-500 hover:bg-white hover:text-primary"
                )}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={stat.label} 
                      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-accent rounded-2xl text-primary">
                          <stat.icon size={24} />
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                          stat.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        )}>
                          {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {stat.trend}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Orders */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="font-bold text-lg">Commandes Récentes</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-primary text-sm font-bold hover:underline">Voir tout</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              order.deliveryStatus === 'Delivered' ? "bg-green-50 text-green-600" : 
                              order.deliveryStatus === 'Pending' ? "bg-orange-50 text-orange-600" : 
                              order.deliveryStatus === 'Cancelled' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                            )}>
                              {order.deliveryStatus === 'Delivered' ? <CheckCircle2 size={20} /> : 
                               order.deliveryStatus === 'Pending' ? <Clock size={20} /> : 
                               order.deliveryStatus === 'Cancelled' ? <XCircle size={20} /> : <Truck size={20} />}
                            </div>
                            <div>
                              <p className="font-bold">{order.customer}</p>
                              <p className="text-xs text-gray-500">{order.date} · {order.items} articles</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{formatPrice(order.amount)}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{order.id}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="font-bold text-lg">Mes Meilleurs Produits</h3>
                      <button onClick={() => setActiveTab('products')} className="text-primary text-sm font-bold hover:underline">Gérer</button>
                    </div>
                    <div className="p-6 space-y-6">
                      {sellerProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-4">
                          <img src={product.photo} alt={product.nom} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-sm">{product.nom}</p>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                              <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">45 ventes</p>
                            <p className="text-xs text-green-600 font-bold">+12%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'products' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Rechercher un produit..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="bg-gray-50 border-transparent rounded-xl px-4 py-2 text-sm font-bold focus:outline-none">
                      <option>Toutes les catégories</option>
                      <option>Condiments</option>
                      <option>Céréales</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Produit</th>
                        <th className="px-6 py-4">Catégorie</th>
                        <th className="px-6 py-4">Prix</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {PRODUITS.filter(p => p.vendeur === 'Maman Fatou').map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={product.photo} alt={product.nom} className="w-10 h-10 rounded-lg object-cover" />
                              <span className="font-bold text-sm">{product.nom}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">Condiments</td>
                          <td className="px-6 py-4 font-bold text-sm">{formatPrice(product.prix)}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "text-xs font-bold px-2 py-1 rounded-full",
                              (product.stock || 0) > 5 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                            )}>
                              {product.stock || 10} en stock
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                              Actif
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-primary transition-all">
                                <Eye size={18} />
                              </button>
                              <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-primary transition-all">
                                <Edit size={18} />
                              </button>
                              <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 transition-all">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-lg">Historique des Commandes</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg">Toutes</button>
                    <button className="px-4 py-2 bg-gray-50 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-100">En cours</button>
                    <button className="px-4 py-2 bg-gray-50 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-100">Livrées</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Commande</th>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Montant</th>
                        <th className="px-6 py-4">Statut Paiement</th>
                        <th className="px-6 py-4">Livraison</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[...recentOrders, ...recentOrders].map((order, i) => (
                        <tr key={`${order.id}-${i}`} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-accent rounded-lg text-primary">
                                <ShoppingBag size={18} />
                              </div>
                              <span className="font-bold text-sm">{order.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-sm">{order.customer}</p>
                            <p className="text-[10px] text-gray-400">{order.items} articles</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4 font-bold text-sm text-primary">{formatPrice(order.amount)}</td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {getDeliveryStatusBadge(order.deliveryStatus)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-primary transition-all">
                              <ChevronRight size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-6">Paramètres de la Boutique</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Nom de la Boutique</label>
                      <input 
                        type="text" 
                        defaultValue="Maman Fatou"
                        className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Numéro WhatsApp</label>
                      <input 
                        type="text" 
                        defaultValue="+226 70 00 00 00"
                        className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-700">Bio du Producteur</label>
                      <textarea 
                        rows={4}
                        defaultValue="Maman Fatou transforme le néré en soumbala depuis plus de 20 ans. Son secret ? Une fermentation traditionnelle respectée à la lettre."
                        className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all">
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsAddProductOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                <Plus size={24} className="rotate-45" />
              </button>
              
              <h3 className="text-2xl font-bold font-serif">Ajouter un nouveau produit</h3>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Nom du produit</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Soumbala en poudre"
                    className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Catégorie</label>
                  <select className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all">
                    <option>Condiments & Épices</option>
                    <option>Céréales & Farines</option>
                    <option>Nutrition Infantile</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Prix (FCFA)</label>
                  <input 
                    type="number" 
                    placeholder="2500"
                    className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Décrivez votre produit..."
                    className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Image du produit</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-primary transition-all cursor-pointer">
                    <Plus size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Cliquez pour ajouter une photo</p>
                  </div>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    Publier le produit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
