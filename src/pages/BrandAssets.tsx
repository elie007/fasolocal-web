import React from 'react';
import { Logo } from '../components/Logo';
import { Download, Copy, Check, Instagram, Facebook, Twitter, Smartphone, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export const BrandAssets: React.FC = () => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Code couleur copié !");
    setTimeout(() => setCopied(null), 2000);
  };

  const colors = [
    { name: 'Vert Forêt', hex: '#1E5631', desc: 'Couleur principale symbolisant la nature et l\'agriculture.' },
    { name: 'Orange Ocre', hex: '#EF6C00', desc: 'Couleur secondaire représentant la terre du Burkina et l\'énergie.' },
    { name: 'Gris Pierre', hex: '#78716C', desc: 'Couleur d\'accent pour le slogan et les textes secondaires.' },
    { name: 'Crème Doux', hex: '#FAF9F6', desc: 'Couleur de fond pour une ambiance chaleureuse et premium.' },
  ];

  const socialAssets = [
    { name: 'Photo de Profil', platform: 'Instagram / FB', size: '1080x1080', icon: <Instagram size={20} /> },
    { name: 'Bannière Page', platform: 'Facebook / LinkedIn', size: '1500x500', icon: <Facebook size={20} /> },
    { name: 'Post Carré', platform: 'Feed / Story', size: '1080x1350', icon: <Smartphone size={20} /> },
  ];

  const downloadSVG = (variant: string, showSlogan: boolean = true) => {
    const forestGreen = variant === 'inverted' ? '#FFFFFF' : (variant === 'monochrome' ? '#000000' : '#1E5631');
    const orangeOchre = variant === 'inverted' ? '#FFFFFF' : (variant === 'monochrome' ? '#000000' : '#EF6C00');
    const stoneGrey = variant === 'inverted' ? '#FFFFFF' : (variant === 'monochrome' ? '#000000' : '#78716C');
    const textColorFaso = variant === 'inverted' ? '#FFFFFF' : (variant === 'monochrome' ? '#000000' : '#1E5631');
    const textColorLocal = variant === 'inverted' ? '#FFFFFF' : (variant === 'monochrome' ? '#000000' : '#EF6C00');

    // Fix: Escape & in font URL to avoid XML parsing error
    const svgContent = `
      <svg width="500" height="200" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&amp;display=swap');
          .brand-text { font-family: 'Inter', sans-serif; font-weight: 900; font-size: 64px; letter-spacing: -0.02em; }
          .slogan-text { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 0.3em; text-transform: uppercase; }
        </style>
        
        <g transform="translate(20, 40) scale(2.5)">
          <circle cx="24" cy="24" r="22" stroke="${forestGreen}" stroke-width="2.5"/>
          <path d="M24 6C10 6 6 24 24 42C42 24 38 6 24 6Z" stroke="${forestGreen}" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M24 42V6" stroke="${orangeOchre}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M24 32C28 32 32 29 34 24" stroke="${orangeOchre}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M24 22C20 22 16 19 14 14" stroke="${orangeOchre}" stroke-width="2.5" stroke-linecap="round"/>
        </g>

        <text x="160" y="110" fill="${textColorFaso}" class="brand-text">Faso</text>
        <text x="310" y="110" fill="${textColorLocal}" class="brand-text">Local</text>
        ${showSlogan ? `<text x="160" y="145" fill="${stoneGrey}" class="slogan-text">Terroir &amp; Qualité</text>` : ''}
      </svg>
    `.trim();

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fasolocal-logo-${variant}${showSlogan ? '' : '-icon'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("SVG téléchargé !");
  };

  const downloadPNG = (variant: string, showSlogan: boolean = true) => {
    const forestGreen = variant === 'inverted' ? '#FFFFFF' : (variant === 'monochrome' ? '#000000' : '#1E5631');
    const orangeOchre = variant === 'inverted' ? '#FFFFFF' : (variant === 'monochrome' ? '#000000' : '#EF6C00');
    const stoneGrey = variant === 'inverted' ? '#FFFFFF' : (variant === 'monochrome' ? '#000000' : '#78716C');
    const textColorFaso = variant === 'inverted' ? '#FFFFFF' : (variant === 'monochrome' ? '#000000' : '#1E5631');
    const textColorLocal = variant === 'inverted' ? '#FFFFFF' : (variant === 'monochrome' ? '#000000' : '#EF6C00');

    // High resolution canvas (4x)
    const scale = 4;
    const width = 500 * scale;
    const height = 200 * scale;

    const svgContent = `
      <svg width="500" height="200" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&amp;display=swap');
          .brand-text { font-family: 'Inter', sans-serif; font-weight: 900; font-size: 64px; letter-spacing: -0.02em; }
          .slogan-text { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 0.3em; text-transform: uppercase; }
        </style>
        <g transform="translate(20, 40) scale(2.5)">
          <circle cx="24" cy="24" r="22" stroke="${forestGreen}" stroke-width="2.5"/>
          <path d="M24 6C10 6 6 24 24 42C42 24 38 6 24 6Z" stroke="${forestGreen}" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M24 42V6" stroke="${orangeOchre}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M24 32C28 32 32 29 34 24" stroke="${orangeOchre}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M24 22C20 22 16 19 14 14" stroke="${orangeOchre}" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        <text x="160" y="110" fill="${textColorFaso}" class="brand-text">Faso</text>
        <text x="310" y="110" fill="${textColorLocal}" class="brand-text">Local</text>
        ${showSlogan ? `<text x="160" y="145" fill="${stoneGrey}" class="slogan-text">Terroir &amp; Qualité</text>` : ''}
      </svg>
    `.trim();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `fasolocal-logo-${variant}${showSlogan ? '' : '-icon'}.png`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PNG haute résolution téléchargé !");
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E5631]/10 rounded-full text-[#1E5631] font-bold text-sm tracking-widest mb-4">
            <Check size={16} /> LOGO OFFICIEL VALIDÉ
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-serif text-[#1E5631]">Identité Visuelle FasoLocal</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Guide de style et ressources graphiques officielles. Utilisez ces éléments pour garantir la cohérence de la marque sur tous vos supports.
          </p>
        </div>

        {/* Logo Versions */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h2 className="text-2xl font-bold font-serif">Versions du Logo</h2>
            <p className="text-xs text-stone-400 italic">Cliquez sur "Télécharger" pour obtenir le fichier SVG</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Standard on White */}
            <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-stone-100 flex flex-col items-center justify-center space-y-8 group hover:shadow-md transition-shadow">
              <Logo variant="standard" size="lg" />
              <div className="text-center space-y-4">
                <div>
                  <p className="font-bold text-stone-900">Version Standard</p>
                  <p className="text-sm text-stone-500">Utilisation sur fond clair ou blanc.</p>
                </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => downloadSVG('standard')}
                      className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#1E5631] hover:underline"
                    >
                      <Download size={14} /> Télécharger SVG
                    </button>
                    <button 
                      onClick={() => downloadPNG('standard')}
                      className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#EF6C00] hover:underline"
                    >
                      <ImageIcon size={14} /> Télécharger PNG (HD)
                    </button>
                  </div>
              </div>
            </div>

            {/* Inverted on Dark */}
            <div className="bg-[#1E5631] p-12 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center space-y-8 group hover:scale-[1.02] transition-transform">
              <Logo variant="inverted" size="lg" />
              <div className="text-center space-y-4">
                <div>
                  <p className="font-bold text-white">Version Inversée</p>
                  <p className="text-sm text-white/70">Utilisation sur fond sombre (Vert Forêt).</p>
                </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => downloadSVG('inverted')}
                      className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white hover:underline"
                    >
                      <Download size={14} /> Télécharger SVG
                    </button>
                    <button 
                      onClick={() => downloadPNG('inverted')}
                      className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white/80 hover:underline"
                    >
                      <ImageIcon size={14} /> Télécharger PNG (HD)
                    </button>
                  </div>
              </div>
            </div>

            {/* Monochrome / Transparent */}
            <div className="bg-stone-200 p-12 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
              <Logo variant="standard" size="lg" className="relative z-10" />
              <div className="text-center relative z-10 space-y-4">
                <div>
                  <p className="font-bold text-stone-900">Version Transparente</p>
                  <p className="text-sm text-stone-600">Format vectoriel (SVG) adaptable.</p>
                </div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <button 
                      onClick={() => downloadSVG('monochrome')}
                      className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#1E5631] hover:underline"
                    >
                      <Download size={14} /> Télécharger SVG
                    </button>
                    <button 
                      onClick={() => downloadPNG('monochrome')}
                      className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#EF6C00] hover:underline"
                    >
                      <ImageIcon size={14} /> Télécharger PNG (HD)
                    </button>
                  </div>
              </div>
            </div>

            {/* Icon Only */}
            <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-stone-100 flex flex-col items-center justify-center space-y-8">
              <Logo variant="standard" size="lg" showSlogan={false} />
              <div className="text-center space-y-4">
                <div>
                  <p className="font-bold text-stone-900">Icône Seule</p>
                  <p className="text-sm text-stone-500">Pour les avatars et favicons.</p>
                </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => downloadSVG('standard', false)}
                      className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#1E5631] hover:underline"
                    >
                      <Download size={14} /> Télécharger SVG
                    </button>
                    <button 
                      onClick={() => downloadPNG('standard', false)}
                      className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#EF6C00] hover:underline"
                    >
                      <ImageIcon size={14} /> Télécharger PNG (HD)
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Kit */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold font-serif border-b border-stone-200 pb-4">Kit Réseaux Sociaux</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {socialAssets.map((asset) => (
              <div key={asset.name} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center border-2 border-dashed border-stone-200">
                  <Logo variant="standard" size="sm" showSlogan={false} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 flex items-center justify-center gap-2">
                    {asset.icon} {asset.name}
                  </h3>
                  <p className="text-xs text-stone-500">{asset.platform}</p>
                  <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">{asset.size}</p>
                </div>
                <button 
                  onClick={() => toast.info(`Format ${asset.size} prêt pour export.`)}
                  className="w-full py-3 bg-stone-50 text-stone-600 rounded-xl text-xs font-bold hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
                >
                  <ImageIcon size={14} /> Préparer l'image
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold font-serif border-b border-stone-200 pb-4">Palette de Couleurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {colors.map((color) => (
              <div key={color.hex} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-4">
                <div 
                  className="w-full h-24 rounded-2xl shadow-inner cursor-pointer group relative"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex, color.name)}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-2xl">
                    {copied === color.name ? <Check className="text-white" /> : <Copy className="text-white" />}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">{color.name}</h3>
                  <p className="text-xs font-mono text-stone-500 mb-2">{color.hex}</p>
                  <p className="text-xs text-stone-600 leading-relaxed">{color.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Specs */}
        <section className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100 shadow-sm space-y-8">
          <h2 className="text-2xl font-bold font-serif">Spécifications Techniques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="font-bold text-[#1E5631] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                Typographie
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Le logo utilise une police <strong>Sans-Serif moderne et grasse</strong> (Montserrat ou Inter) pour le nom de marque, assurant une lisibilité maximale sur tous les supports numériques. Le slogan est composé en majuscules avec un espacement (letter-spacing) généreux pour un aspect premium.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-[#1E5631] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                Symbolisme
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                La <strong>feuille stylisée</strong> représente la croissance, la fraîcheur et l'origine naturelle des produits. Le <strong>cercle</strong> symbolise l'unité de la communauté FasoLocal et le cycle vertueux de l'économie locale burkinabè.
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="text-center pt-8">
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-[#1E5631] text-white px-8 py-4 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-[#1E5631]/20"
          >
            <Download size={20} /> Télécharger le Brand Kit (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};
