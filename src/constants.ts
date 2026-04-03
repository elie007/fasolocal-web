import { Product, Category, Producteur, BlogPost, Review } from './types';

export const PRODUITS: Product[] = [
  {
    id: 'p1',
    nom: 'Farine de Petit Mil',
    prix: 1500,
    categorie_id: 'Céréales et Farines',
    description: 'Farine locale riche en nutriments, idéale pour le porridge.',
    vendeur: 'Grains du Faso',
    isBestSeller: true,
    stock: 15,
    views: 1250,
    salesCount: 450,
    tags: ['céréale', 'nutritif'],
    keywords: ['farine', 'mil']
  },
  {
    id: 'p2',
    nom: 'Farine de Maïs',
    prix: 1300,
    categorie_id: 'Céréales et Farines',
    description: 'Farine de maïs de qualité supérieure pour vos préparations.',
    vendeur: 'Grains du Faso',
    isBestSeller: true,
    stock: 20,
    views: 850,
    salesCount: 320,
    tags: ['céréale', 'maïs'],
    keywords: ['farine', 'maïs']
  },
  {
    id: 'p3',
    nom: 'Miel de Fleurs',
    prix: 4500,
    categorie_id: 'Petit déjeuner',
    description: 'Miel pur et naturel récolté dans les savanes du Burkina.',
    vendeur: 'Association Wend-Panga',
    isBestSeller: true,
    stock: 10,
    views: 2100,
    salesCount: 680,
    tags: ['miel', 'naturel'],
    keywords: ['miel', 'fleurs']
  },
  {
    id: 'p4',
    nom: 'Cire d\'Abeille',
    prix: 2000,
    categorie_id: 'Condiments et Épices',
    description: 'Cire d\'abeille naturelle pour vos soins et artisanat.',
    vendeur: 'Association Wend-Panga',
    isBestSeller: false,
    stock: 5,
    views: 450,
    salesCount: 120,
    tags: ['cire', 'naturel'],
    keywords: ['cire', 'abeille']
  }
];

export const PRODUCTEURS: Producteur[] = [
  {
    id: 'p1',
    nom: 'Maman Fatou',
    ville: 'Ouagadougou',
    specialite: 'Soumbala & Épices',
    note: 4.9,
    bio: "Maman Fatou transforme le néré en soumbala depuis plus de 20 ans. Son secret ? Une fermentation traditionnelle respectée à la lettre et un séchage naturel au soleil du Burkina.",
    membreDepuis: "Depuis 2022"
  },
  {
    id: 'p2',
    nom: 'Sœur Marie',
    ville: 'Bobo-Dioulasso',
    specialite: 'Farines Locales',
    note: 4.8,
    bio: "Sœur Marie dirige une petite coopérative à Bobo-Dioulasso qui aide les femmes veuves à retrouver leur autonomie grâce à la transformation des céréales locales en farines prêtes à l'emploi.",
    membreDepuis: "Depuis 2023"
  },
  {
    id: 'p3',
    nom: 'BioFaso Bébé',
    ville: 'Ouagadougou',
    specialite: 'Nutrition Infantile',
    note: 5.0,
    bio: "BioFaso Bébé est née de la volonté d'offrir aux enfants burkinabè une alimentation saine, riche et accessible, basée sur les super-aliments de notre terroir comme le mil, le soja et le moringa.",
    membreDepuis: "Depuis 2022"
  },
  {
    id: 'p4',
    nom: 'Association Wend-Panga',
    ville: 'Koudougou',
    specialite: 'Moringa & Plantes',
    note: 4.7,
    bio: "Ce groupement de femmes de Koudougou s'est spécialisé dans la culture et la transformation du moringa. Elles promeuvent une agriculture durable et sans pesticides.",
    membreDepuis: "Depuis 2024"
  },
  {
    id: 'p5',
    nom: 'Coopérative de Bobo',
    ville: 'Bobo-Dioulasso',
    specialite: 'Produits Maraîchers',
    note: 4.6,
    bio: "Une coopérative dynamique qui regroupe plus de 50 producteurs de la région de Bobo, spécialisée dans le séchage des fruits et légumes.",
    membreDepuis: "Depuis 2023"
  },
  {
    id: 'p6',
    nom: 'GIE FasoFonio',
    ville: 'Banfora',
    specialite: 'Fonio & Céréales',
    note: 4.9,
    bio: "Le GIE FasoFonio se consacre à la promotion du fonio, une céréale ancestrale aux multiples vertus, cultivée dans le respect de l'environnement.",
    membreDepuis: "Depuis 2024"
  },
  {
    id: 'p7',
    nom: 'Maman Nature',
    ville: 'Ouagadougou',
    specialite: 'Nutrition & Santé',
    note: 5.0,
    bio: "Spécialiste de la nutrition naturelle, Maman Nature propose des mélanges de farines enrichies pour toute la famille.",
    membreDepuis: "Depuis 2022"
  }
];

export const DELIVERY_FEES = {
  'Ouagadougou Centre': 1000,
  'Ouagadougou Périphérie': 1500
};

export const FREE_DELIVERY_THRESHOLD = 10000;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Le secret du Soumbala parfait : Tradition et Bienfaits',
    excerpt: 'Découvrez comment le soumbala est fabriqué artisanalement et pourquoi il est l\'épice indispensable de la cuisine burkinabè.',
    content: `
      Le soumbala, également appelé "moutarde africaine", est bien plus qu'un simple condiment. C'est le cœur de la gastronomie burkinabè, apportant cette saveur unique et profonde (umami) à nos plats traditionnels comme le riz gras ou la sauce feuille.

      ### Une fabrication ancestrale
      La fabrication du soumbala commence par la récolte des graines de néré (*Parkia biglobosa*). Ces graines sont bouillies pendant de longues heures, puis décortiquées et mises à fermenter. C'est cette fermentation naturelle qui donne au soumbala son arôme caractéristique et ses propriétés nutritionnelles exceptionnelles.

      ### Les bienfaits pour la santé
      Saviez-vous que le soumbala est excellent pour la santé ?
      - **Riche en protéines** : Il contient une grande quantité de protéines végétales.
      - **Régulateur de tension** : Traditionnellement utilisé pour aider à réguler la tension artérielle.
      - **Source de fer** : Idéal pour lutter contre l'anémie.

      En choisissant le soumbala de nos producteurs sur FasoLocal, vous garantissez un produit 100% naturel, sans additifs chimiques, fabriqué dans le respect des traditions.
    `,
    image: '',
    category: 'Recettes',
    author: 'FasoLocal Team',
    date: '2026-03-20',
    readTime: '5 min',
    tags: ['Soumbala', 'Tradition', 'Santé']
  },
  {
    id: '2',
    title: 'Rencontre avec Maman Fatou : 30 ans de passion pour le Karité',
    excerpt: 'Portrait d\'une femme d\'exception qui transforme l\'or vert du Burkina avec un savoir-faire inégalé.',
    content: `
      Dans le quartier de Somgandé à Ouagadougou, tout le monde connaît Maman Fatou. Depuis trois décennies, elle transforme les noix de karité en un beurre onctueux et pur.

      "Le karité, c'est notre héritage", nous confie-t-elle avec un sourire. "Ma mère me l'a appris, et je l'apprends à mes filles."

      Sur FasoLocal, Maman Fatou propose son beurre de karité brut, idéal pour la cuisine ou les soins de la peau. Chaque pot acheté soutient directement son groupement de femmes et permet de scolariser les enfants du quartier.
    `,
    image: '',
    category: 'Producteurs',
    author: 'Awa Traoré',
    date: '2026-03-15',
    readTime: '4 min',
    tags: ['Karité', 'Portrait', 'Artisanat']
  },
  {
    id: '3',
    title: '5 astuces pour conserver vos épices locales plus longtemps',
    excerpt: 'Apprenez à garder toute la fraîcheur et l\'arôme de vos épices FasoLocal grâce à nos conseils d\'experts.',
    content: `
      Vous venez de recevoir vos épices fraîches de FasoLocal ? Voici comment les conserver pour qu'elles gardent tout leur goût pendant des mois :

      1. **L'obscurité est votre amie** : La lumière dégrade les huiles essentielles des épices. Gardez-les dans un placard fermé.
      2. **Évitez l'humidité** : Ne saupoudrez jamais vos épices directement au-dessus d'une casserole fumante. La vapeur s'infiltre dans le pot et crée des grumeaux.
      3. **Le verre plutôt que le plastique** : Les bocaux en verre hermétiques sont les meilleurs pour préserver les arômes.
      4. **Pas de chaleur** : Évitez de ranger vos épices juste au-dessus de votre cuisinière.
      5. **Achetez en petites quantités** : C'est l'avantage de FasoLocal ! Commandez régulièrement pour avoir toujours des produits frais.
    `,
    image: '',
    category: 'Conseils',
    author: 'Chef Issouf',
    date: '2026-03-10',
    readTime: '3 min',
    tags: ['Conservation', 'Cuisine', 'Astuces']
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'FL-SOUM-BOL-200',
    userName: 'Awa T.',
    rating: 5,
    comment: 'Le meilleur soumbala que j\'ai goûté ! On sent vraiment la fermentation traditionnelle.',
    date: '2026-03-25'
  },
  {
    id: 'r2',
    productId: 'FL-SOUM-BOL-200',
    userName: 'Ibrahim S.',
    rating: 4,
    comment: 'Très bon produit, livraison rapide.',
    date: '2026-03-20'
  },
  {
    id: 'r3',
    productId: 'FL-MIEL-FOR-500',
    userName: 'Fatou B.',
    rating: 5,
    comment: 'Miel d\'une pureté exceptionnelle. Je l\'utilise pour mes tisanes et c\'est parfait.',
    date: '2026-03-22'
  },
  {
    id: 'r4',
    productId: 'FL-BEUR-KAR-250',
    userName: 'Sophie L.',
    rating: 5,
    comment: 'Hydrate parfaitement la peau, l\'odeur est naturelle et agréable.',
    date: '2026-03-28'
  }
];
