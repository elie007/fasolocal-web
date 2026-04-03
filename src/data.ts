export interface Categorie {
  id: string;
  nom: string;
  image?: string;
}

export interface Produit {
  id: string;
  nom: string;
  prix: number;
  image?: string;
  unite?: string;
  unit?: string;
  vendeur: string;
  producteur?: string;
  description: string;
  categorie_id: string;
  isBestSeller?: boolean;
  isValidated?: boolean;
}

export const OFFICIAL_CATEGORIES = [
  { id: 'Tout', icon: '🏠', label: 'Tout' },
  { id: 'Nutrition infantile', icon: '👶', label: 'Nutrition infantile' },
  { id: 'Céréales et Farines', icon: '🌾', label: 'Céréales et Farines' },
  { id: 'Condiments et Épices', icon: '🧂', label: 'Condiments et Épices' },
  { id: 'Petit déjeuner', icon: '☕', label: 'Petit déjeuner' },
  { id: 'Snack et Boissons', icon: '🥤', label: 'Snack et Boissons' }
];

export const PRODUITS: Produit[] = [
  {
    id: 'p1',
    nom: 'Farine de Petit Mil',
    prix: 1500,
    unite: 'Sachet 1kg',
    vendeur: 'Grains du Faso',
    description: 'Farine locale riche en nutriments, idéale pour le porridge.',
    categorie_id: 'Céréales et Farines',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=500',
    isBestSeller: true
  },
  {
    id: 'p2',
    nom: 'Farine de Maïs',
    prix: 1300,
    unite: 'Sachet 1kg',
    vendeur: 'Grains du Faso',
    description: 'Farine de maïs de qualité supérieure pour vos préparations.',
    categorie_id: 'Céréales et Farines',
    image: 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&q=80&w=500',
    isBestSeller: true
  },
  {
    id: 'p3',
    nom: 'Miel de Fleurs',
    prix: 4500,
    unite: 'Pot 500g',
    vendeur: 'Association Wend-Panga',
    description: 'Miel pur et naturel récolté dans les savanes du Burkina.',
    categorie_id: 'Petit déjeuner',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=500',
    isBestSeller: true
  },
  {
    id: 'p4',
    nom: 'Cire d\'Abeille',
    prix: 2000,
    unite: 'Pain 250g',
    vendeur: 'Association Wend-Panga',
    description: 'Cire d\'abeille naturelle pour vos soins et artisanat.',
    categorie_id: 'Condiments et Épices',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=500',
    isBestSeller: true
  }
];
