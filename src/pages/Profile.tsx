import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { User, Package, MapPin, Phone, LogOut, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';

export const Profile: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid)
          );
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })).sort((a: any, b: any) => {
            const timeA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 
                         (a.createdAt ? new Date(a.createdAt).getTime() : 0);
            const timeB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 
                         (b.createdAt ? new Date(b.createdAt).getTime() : 0);
            return timeB - timeA;
          });
          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-primary border-4 border-white shadow-lg">
            <User size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif text-gray-900">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
        >
          <LogOut size={20} /> Se déconnecter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar: Info */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-serif flex items-center gap-2">
              <User size={20} className="text-primary" /> Mes informations
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-primary" />
                <span>{profile.whatsapp || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-primary" />
                <span>{profile.neighborhood}, {profile.city}</span>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-all">
              Modifier mes informations
            </button>
          </section>

          <section className="bg-primary-dark p-8 rounded-3xl text-white space-y-4">
            <h3 className="text-lg font-bold font-serif">Soutien Local 🇧🇫</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              En commandant sur FasoLocal, vous soutenez directement l'économie locale et nos producteurs partenaires.
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">Membre depuis {new Date(profile.createdAt).getFullYear()}</span>
            </div>
          </section>
        </div>

        {/* Main: Orders */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
              <Package size={24} className="text-primary" /> Mes commandes
            </h2>
            <span className="text-sm text-gray-500">{orders.length} commande(s)</span>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">Commande #{order.id.slice(-6).toUpperCase()}</span>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          order.status === 'delivered' ? "bg-green-100 text-green-700" :
                          order.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                        )}>
                          {order.status === 'pending' ? 'En attente' : 
                           order.status === 'confirmed' ? 'Confirmée' :
                           order.status === 'delivered' ? 'Livrée' : order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 space-y-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-gray-300 shadow-sm">
                <ShoppingBag size={32} />
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 font-medium">Vous n'avez pas encore passé de commande.</p>
                <button 
                  onClick={() => navigate('/boutique')}
                  className="text-primary font-bold hover:underline"
                >
                  Découvrir nos produits locaux
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
