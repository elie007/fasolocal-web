import { collection, getDocs, query, where, doc, getDoc, onSnapshot, QuerySnapshot, DocumentSnapshot, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Produit, Categorie } from '../data';
import { isRealImage } from '../lib/utils';

const mapProduit = (doc: any): Produit => {
  try {
    const data = doc.data() || {};
    let rawImage = data.image || data.image_url || data.photo;
    
    // Nettoyage des liens image : supprime les guillemets accidentels
    if (typeof rawImage === 'string') {
      rawImage = rawImage.replace(/"/g, '').trim();
    }

    // Fallback image if invalid or missing
    const image = isRealImage(rawImage) ? rawImage : "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=500";
    
    // Normalize unit field (support both unit and unite from Firebase)
    let unite = data.unite || data.unit || "";
    if (typeof unite !== 'string') {
      unite = String(unite);
    }
    
    // Ensure price is a valid number
    const parsedPrice = typeof data.prix === 'string' ? parseFloat(data.prix) : data.prix;
    const prix = isNaN(parsedPrice) || !parsedPrice ? 0 : parsedPrice;
    
    // Map old numeric IDs to new string IDs
    let catId = data.categorie_id || "Tout";
    const categoryMap: Record<string, string> = {
      '1': 'Céréales et Farines',
      '2': 'Nutrition infantile',
      '3': 'Condiments et Épices',
      '4': 'Petit déjeuner',
      '5': 'Condiments et Épices',
      '6': 'Snack et Boissons',
      '7': 'Tout',
      'cat1': 'Condiments et Épices',
      'cat2': 'Céréales et Farines',
      'cat3': 'Nutrition infantile',
      'cat4': 'Petit déjeuner',
      'cat5': 'Condiments et Épices',
      'cat6': 'Snack et Boissons'
    };
    if (categoryMap[catId]) {
      catId = categoryMap[catId];
    }

    return {
      id: doc.id,
      ...data,
      nom: data.nom || "Produit sans nom",
      prix,
      image,
      unite,
      vendeur: data.vendeur || data.producteur || "Vendeur inconnu",
      description: data.description || "Aucune description",
      categorie_id: catId
    } as Produit;
  } catch (error) {
    console.error(`Erreur lors du parsing du produit ${doc.id}:`, error);
    return {
      id: doc.id,
      nom: "Erreur de données",
      prix: 0,
      vendeur: "Inconnu",
      description: "Ce produit contient des données invalides.",
      categorie_id: "1"
    } as Produit;
  }
};

const mapCategorie = (doc: any): Categorie => {
  const data = doc.data() || {};
  let rawImage = data.image || data.image_url || data.photo;
  
  // Nettoyage des liens image
  if (typeof rawImage === 'string') {
    rawImage = rawImage.replace(/"/g, '').trim();
  }

  const image = isRealImage(rawImage) ? rawImage : undefined;
  
  return {
    id: doc.id,
    ...data,
    image
  } as Categorie;
};

export interface UserProfile {
  id: string;
  nom: string;
  telephone: string;
  quartier: string;
  email?: string;
  role?: string;
}

export interface ProducerApplication {
  id?: string;
  nom: string;
  ville: string;
  specialite: string;
  histoire: string;
  status: 'en_attente' | 'valide' | 'refuse';
  createdAt: any;
}

export interface LogisticsConfig {
  fraisLivraison: number;
  seuilGratuite: number;
}

export const getProduits = async (): Promise<Produit[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'produits'));
    return querySnapshot.docs.map(mapProduit);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return [];
  }
};

export const listenProduits = (callback: (produits: Produit[]) => void) => {
  return onSnapshot(collection(db, 'produits'), (snapshot: QuerySnapshot) => {
    const produits = snapshot.docs.map(mapProduit);
    callback(produits);
  }, (error) => {
    console.error("Erreur lors de l'écoute des produits:", error);
  });
};

export const getCategories = async (): Promise<Categorie[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(mapCategorie);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return [];
  }
};

export const listenCategories = (callback: (categories: Categorie[]) => void) => {
  return onSnapshot(collection(db, 'categories'), (snapshot: QuerySnapshot) => {
    const categories = snapshot.docs.map(mapCategorie);
    callback(categories);
  }, (error) => {
    console.error("Erreur lors de l'écoute des catégories:", error);
  });
};

export const getProduitById = async (id: string): Promise<Produit | null> => {
  try {
    const docRef = doc(db, 'produits', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return mapProduit(docSnap);
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return null;
  }
};

export const listenProduitById = (id: string, callback: (produit: Produit | null) => void) => {
  const docRef = doc(db, 'produits', id);
  return onSnapshot(docRef, (docSnap: DocumentSnapshot) => {
    if (docSnap.exists()) {
      callback(mapProduit(docSnap));
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Erreur lors de l'écoute du produit:", error);
  });
};

// --- New Methods ---

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return null;
  }
};

export const saveUserProfile = async (uid: string, profile: Omit<UserProfile, 'id'>) => {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du profil:", error);
    throw error;
  }
};

export const submitProducerApplication = async (application: Omit<ProducerApplication, 'id' | 'status' | 'createdAt'>) => {
  try {
    await addDoc(collection(db, 'candidatures_producteurs'), {
      ...application,
      status: 'en_attente',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Erreur lors de la soumission de la candidature:", error);
    throw error;
  }
};

export const getLogisticsConfig = async (): Promise<LogisticsConfig> => {
  try {
    const docRef = doc(db, 'config_logistique', 'default');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as LogisticsConfig;
    }
    // Default values if not set
    return { fraisLivraison: 1000, seuilGratuite: 10000 };
  } catch (error) {
    console.error("Erreur lors de la récupération de la config logistique:", error);
    return { fraisLivraison: 1000, seuilGratuite: 10000 };
  }
};

export const listenLogisticsConfig = (callback: (config: LogisticsConfig) => void) => {
  const docRef = doc(db, 'config_logistique', 'default');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as LogisticsConfig);
    } else {
      callback({ fraisLivraison: 1000, seuilGratuite: 10000 });
    }
  }, (error) => {
    console.error("Erreur lors de l'écoute de la config logistique:", error);
  });
};

export const updateLogisticsConfig = async (config: LogisticsConfig) => {
  try {
    const docRef = doc(db, 'config_logistique', 'default');
    await setDoc(docRef, config);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la config logistique:", error);
    throw error;
  }
};

export const addProduit = async (produit: Omit<Produit, 'id'>) => {
  try {
    await addDoc(collection(db, 'produits'), {
      ...produit,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    throw error;
  }
};

export const updateProduit = async (id: string, updates: Partial<Produit>) => {
  try {
    const docRef = doc(db, 'produits', id);
    await setDoc(docRef, updates, { merge: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    throw error;
  }
};

/**
 * Recherche des produits par nom (recherche par préfixe)
 * Note: Firestore ne supporte pas nativement la recherche "contains".
 * Pour une recherche plus avancée, un service tiers comme Algolia est recommandé.
 */
export const searchProduits = async (searchTerm: string): Promise<Produit[]> => {
  try {
    if (!searchTerm.trim()) return getProduits();
    
    const q = query(
      collection(db, 'produits'),
      where('nom', '>=', searchTerm),
      where('nom', '<=', searchTerm + '\uf8ff')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapProduit);
  } catch (error) {
    console.error("Erreur lors de la recherche des produits:", error);
    return [];
  }
};
