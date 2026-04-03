import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

const TEST_PRODUCTS = [
  {
    nom: 'Miel de Fleurs',
    prix: 4500,
    unit: 'Pot 500g',
    vendeur: 'Association Wend-Panga',
    producteur: 'Association Wend-Panga',
    description: 'Miel pur et naturel récolté dans les savanes du Burkina.',
    categorie_id: 'Petit déjeuner',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=500',
    isBestSeller: true
  },
  {
    nom: 'Cire d\'Abeille',
    prix: 2000,
    unit: 'Pain 250g',
    vendeur: 'Association Wend-Panga',
    producteur: 'Association Wend-Panga',
    description: 'Cire d\'abeille naturelle pour vos soins et artisanat.',
    categorie_id: 'Condiments et Épices',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=500',
    isBestSeller: false
  },
  {
    nom: 'Farine de Petit Mil',
    prix: 1500,
    unit: 'Sachet 1kg',
    vendeur: 'Grains du Faso',
    producteur: 'Grains du Faso',
    description: 'Farine locale riche en nutriments, idéale pour le porridge.',
    categorie_id: 'Céréales et Farines',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=500',
    isBestSeller: true
  },
  {
    nom: 'Farine de Maïs',
    prix: 1300,
    unit: 'Sachet 1kg',
    vendeur: 'Grains du Faso',
    producteur: 'Grains du Faso',
    description: 'Farine de maïs de qualité supérieure pour vos préparations.',
    categorie_id: 'Céréales et Farines',
    image: 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&q=80&w=500',
    isBestSeller: false
  }
];

export const seedTestProducts = async () => {
  console.log('Envoi des produits vers Firestore...');
  
  for (const product of TEST_PRODUCTS) {
    try {
      // On utilise la collection 'produits' qui est celle utilisée par votre site
      const q = query(collection(db, 'produits'), where('nom', '==', product.nom));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await addDoc(collection(db, 'produits'), {
          ...product,
          createdAt: serverTimestamp()
        });
        console.log(`✅ Produit ajouté : ${product.nom}`);
      } else {
        console.log(`ℹ️ Produit déjà existant : ${product.nom}`);
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${product.nom}:`, error);
    }
  }
};
