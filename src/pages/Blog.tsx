import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Calendar, User, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import { cn } from '../lib/utils';

const CATEGORIES = ['Tous', 'Recettes', 'Producteurs', 'Conseils', 'Actualités'];

export const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === 'Tous' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto px-2">
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-gray-900">Le Blog FasoLocal 🌿</h1>
        <p className="text-sm md:text-xl text-gray-600 leading-relaxed">
          Histoires de terroir, secrets de cuisine et conseils pour une consommation locale et durable au Burkina Faso.
        </p>
      </div>

      {/* Featured Post */}
      {activeCategory === 'Tous' && !searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl md:rounded-[3rem] overflow-hidden bg-white border border-gray-100 shadow-xl group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-[16/9] lg:aspect-auto overflow-hidden">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center space-y-3 md:space-y-6">
              <div className="flex items-center gap-3 md:gap-4">
                <span className="bg-secondary/20 text-secondary text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  À la une
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Clock size={14} /> {featuredPost.readTime}
                </span>
              </div>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold font-serif text-gray-900 group-hover:text-primary transition-colors leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 text-xs md:text-lg leading-relaxed line-clamp-3 md:line-clamp-none">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-3 md:gap-4 pt-4 border-t border-gray-100">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-full flex items-center justify-center font-bold text-primary shrink-0 text-xs md:text-base">
                  {featuredPost.author[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-bold text-gray-900 truncate">{featuredPost.author}</p>
                  <p className="text-[10px] md:text-xs text-gray-400">{new Date(featuredPost.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <Link 
                  to={`/blog/${featuredPost.id}`}
                  className="ml-auto bg-primary text-white p-2 md:p-3 rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 shrink-0"
                >
                  <ArrowRight size={18} className="md:w-6 md:h-6" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters & Search */}
      <div className="space-y-6 border-b border-gray-100 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="w-full overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:pb-0">
            <div className="flex md:flex-wrap gap-2 min-w-max md:min-w-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                    activeCategory === cat 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-accent text-primary hover:bg-primary/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Rechercher un article..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-100 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
          >
            <Link to={`/blog/${post.id}`} className="block aspect-[16/10] overflow-hidden relative">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.category}
              </span>
            </Link>
            <div className="p-8 flex-grow flex flex-col space-y-4">
              <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.date).toLocaleDateString('fr-FR')}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
              </div>
              <Link to={`/blog/${post.id}`}>
                <h3 className="text-xl font-bold font-serif text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="pt-4 mt-auto flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-primary">
                    {post.author[0]}
                  </div>
                  <span className="text-xs font-bold text-gray-700">{post.author}</span>
                </div>
                <Link 
                  to={`/blog/${post.id}`}
                  className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Lire la suite <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">Aucun article ne correspond à votre recherche. 🌿</p>
          <button 
            onClick={() => { setActiveCategory('Tous'); setSearchQuery(''); }}
            className="mt-4 text-primary font-bold hover:underline"
          >
            Voir tous les articles
          </button>
        </div>
      )}

      {/* Newsletter Section */}
      <div className="bg-secondary/10 rounded-3xl md:rounded-[3rem] p-8 md:p-12 lg:p-20 text-center space-y-6 md:space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold font-serif text-primary-dark">Ne manquez aucune histoire 📩</h2>
          <p className="text-sm md:text-lg text-gray-600">
            Inscrivez-vous à notre newsletter pour recevoir nos meilleures recettes et portraits de producteurs directement dans votre boîte mail.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 pt-2 md:pt-4">
            <input 
              type="email" 
              placeholder="Votre adresse email"
              className="flex-grow px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white border border-gray-100 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
            />
            <button className="bg-primary text-white px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
              S'abonner
            </button>
          </form>
          <p className="text-[10px] md:text-xs text-gray-400">
            Promis, on ne vous enverra que du bon ! Vous pouvez vous désabonner à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
};
