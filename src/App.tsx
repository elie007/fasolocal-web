import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MobileNav } from './components/MobileNav';
import { CartDrawer } from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home';
import { Boutique } from './pages/Boutique';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { BecomeSeller } from './pages/BecomeSeller';
import { Contact } from './pages/Contact';
import { SellerProfile } from './pages/SellerProfile';
import { Producteurs } from './pages/Producteurs';
import { AuthPage } from './pages/AuthPage';
import { Profile } from './pages/Profile';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { SellerDashboard } from './pages/SellerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Toaster } from 'sonner';
import { seedTestProducts } from './services/seedData';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    // Appel unique pour peupler la base de données avec les produits de test
    seedTestProducts();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Toaster position="top-center" richColors />
          <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/boutique" element={<Boutique />} />
                <Route path="/produit/:id" element={<ProductDetail />} />
                <Route path="/panier" element={<CartPage />} />
                <Route path="/commande" element={<Checkout />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/producteurs" element={<Producteurs />} />
                <Route path="/devenir-vendeur" element={<BecomeSeller />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/producteur/:id" element={<SellerProfile />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/tableau-de-bord" element={<SellerDashboard />} />
                <Route path="/admin-fasolocal" element={<AdminDashboard />} />
                <Route path="/devenir-producteur" element={<BecomeSeller />} />
              </Routes>
            </main>
            <Footer />
            <MobileNav />
            <WhatsAppButton />
            <CartDrawer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
