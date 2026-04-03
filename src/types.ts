export interface Product {
  id: string;
  nom: string;
  prix: number;
  photo?: string;
  image?: string;
  image_url?: string;
  unite?: string;
  unit?: string;
  vendeur: string;
  producteur?: string;
  description: string;
  categorie_id: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isValidated?: boolean;
  prixPromo?: number;
  stock?: number;
  tags?: string[];
  keywords?: string[];
  views?: number;
  salesCount?: number;
}

export interface Category {
  id: string;
  nom: string;
  photo?: string;
  image?: string;
  slug?: string;
}

export interface Producteur {
  id: string;
  nom: string;
  ville: string;
  specialite: string;
  note: number;
  photo?: string;
  bio?: string;
  membreDepuis?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category: 'Recettes' | 'Producteurs' | 'Conseils' | 'Actualités';
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
