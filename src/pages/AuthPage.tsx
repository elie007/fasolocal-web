import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get('role');
  const isSellerMode = roleParam === 'seller';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    whatsapp: '',
    city: 'Ouagadougou',
    neighborhood: ''
  });

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        // Fetch profile to check role
        const profileRef = doc(db, 'users', user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          if (profileData.role === 'seller' || profileData.role === 'admin') {
            navigate('/tableau-de-bord', { replace: true });
            return;
          }
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${formData.firstName} ${formData.lastName}`
        });

        // Create user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          whatsapp: formData.whatsapp,
          city: formData.city,
          neighborhood: formData.neighborhood,
          role: isSellerMode ? 'seller' : 'client',
          createdAt: new Date().toISOString()
        });

        if (isSellerMode) {
          navigate('/tableau-de-bord', { replace: true });
          return;
        }
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-accent/30">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-serif text-gray-900">
              {isSellerMode 
                ? (isLogin ? 'Espace Vendeur 🌿' : 'Inscrivez votre boutique 🇧🇫')
                : (isLogin ? 'Bon retour ! 🌿' : 'Bienvenue chez FasoLocal 🇧🇫')
              }
            </h1>
            <p className="text-gray-500">
              {isSellerMode
                ? (isLogin ? 'Gérez vos produits et vos ventes.' : 'Commencez à vendre vos produits locaux.')
                : (isLogin ? 'Connectez-vous pour gérer vos commandes.' : 'Créez votre compte pour commander facilement.')
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Prénom</label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nom</label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
              <div className="relative">
                <input 
                  required
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mot de passe</label>
              <div className="relative">
                <input 
                  required
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">WhatsApp</label>
                  <div className="relative">
                    <input 
                      required
                      type="tel" 
                      placeholder="+226 ..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ville</label>
                    <select 
                      className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    >
                      <option value="Ouagadougou">Ouagadougou</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Quartier</label>
                    <div className="relative">
                      <input 
                        required
                        type="text" 
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>
              </>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Se connecter' : 'Créer mon compte')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="text-center pt-4 space-y-4">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-primary hover:underline block w-full"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </button>
            
            {!isSellerMode && (
              <div className="pt-4 border-t border-gray-100">
                <Link 
                  to="/auth?role=seller"
                  className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Accès Vendeur 🌿
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
