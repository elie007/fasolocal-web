import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, Clock, ChevronLeft, Share2, Facebook, Twitter, Mail, ArrowRight, Tag } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import ReactMarkdown from 'react-markdown';

export const BlogPost: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Article non trouvé 🌿</h1>
        <button onClick={() => navigate('/blog')} className="text-primary font-bold underline">
          Retour au blog
        </button>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-primary transition-colors group"
        >
          <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" /> Retour au blog
        </button>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-accent rounded-full text-gray-400 hover:text-primary transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="space-y-4 md:space-y-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="bg-secondary/20 text-secondary text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-[10px] md:text-xs text-gray-400 font-medium flex items-center gap-1">
            <Clock size={14} /> {post.readTime} de lecture
          </span>
        </div>
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-primary shrink-0">
              {post.author[0]}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">{post.author}</p>
              <p className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-[16/9] rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl"
      >
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Content */}
      <div className="prose prose-sm md:prose-lg prose-primary max-w-none space-y-6 md:space-y-8">
        <div className="text-gray-700 leading-relaxed space-y-4 md:space-y-6">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>

      {/* Tags & Share */}
      <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 bg-gray-50 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-100">
              <Tag size={12} /> {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Partager</span>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <Facebook size={18} />
            </button>
            <button className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <Twitter size={18} />
            </button>
            <button className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <Mail size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="pt-12 md:pt-20 space-y-8 md:space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 text-center md:text-left">Articles similaires 🌿</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {relatedPosts.map(p => (
              <Link 
                key={p.id} 
                to={`/blog/${p.id}`}
                className="group bg-white rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 md:p-8 space-y-3 md:space-y-4">
                  <h3 className="text-lg md:text-xl font-bold font-serif text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm line-clamp-2 leading-relaxed">
                    {p.excerpt}
                  </p>
                  <div className="pt-2 md:pt-4 flex items-center text-primary font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                    Lire la suite <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="mt-12 md:mt-20 bg-accent/30 rounded-3xl md:rounded-[3rem] p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 border border-primary/5">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center font-bold text-2xl md:text-3xl text-primary shadow-lg shrink-0">
          {post.author[0]}
        </div>
        <div className="text-center md:text-left space-y-2">
          <h4 className="text-lg md:text-xl font-bold font-serif text-gray-900">À propos de {post.author}</h4>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed italic">
            Passionné par le patrimoine culinaire du Burkina Faso, {post.author} partage ses découvertes et ses rencontres avec les producteurs locaux pour promouvoir une alimentation saine et durable.
          </p>
        </div>
      </div>
    </div>
  );
};
