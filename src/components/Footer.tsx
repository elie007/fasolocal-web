import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';

import { OFFICIAL_CATEGORIES } from '../data';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-dark text-white pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/">
              <Logo variant="inverted" />
            </Link>
            <p className="text-gray-300 leading-relaxed">
              La première marketplace de produits locaux transformés au Burkina Faso. 
              Soutenez nos producteurs locaux et consommez sain.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-secondary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-secondary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-serif">Navigation</h4>
            <ul className="space-y-4 text-gray-300">
              <li><Link to="/" className="hover:text-secondary transition-colors">Accueil</Link></li>
              <li><Link to="/boutique" className="hover:text-secondary transition-colors">Boutique</Link></li>
              <li><Link to="/producteurs" className="hover:text-secondary transition-colors">Producteurs</Link></li>
              <li><Link to="/blog" className="hover:text-secondary transition-colors">Blog</Link></li>
              <li><Link to="/a-propos" className="hover:text-secondary transition-colors">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
              <li><Link to="/brand-assets" className="hover:text-secondary transition-colors">Brand Assets</Link></li>
              <li className="pt-4 border-t border-white/10">
                <Link to="/devenir-vendeur" className="text-secondary font-bold hover:underline transition-colors">
                  Vendre sur FasoLocal 🇧🇫
                </Link>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-serif">Catégories</h4>
            <ul className="space-y-4 text-gray-300">
              {OFFICIAL_CATEGORIES.filter(cat => cat.id !== 'Tout').map(cat => (
                <li key={cat.id}>
                  <Link 
                    to={`/boutique?category=${encodeURIComponent(cat.id)}`} 
                    className="hover:text-secondary transition-colors flex items-center gap-2"
                  >
                    <span>{cat.icon}</span> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-serif">Contact</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex gap-3 items-start">
                <MapPin size={20} className="text-secondary shrink-0" />
                <span>Ouagadougou, Burkina Faso</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={20} className="text-secondary shrink-0" />
                <span>+226 00 00 00 00</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={20} className="text-secondary shrink-0" />
                <span>contact@fasolocal.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} FasoLocal.com - Tous droits réservés. Fait avec 💚 au Burkina Faso.</p>
        </div>
      </div>
    </footer>
  );
};
