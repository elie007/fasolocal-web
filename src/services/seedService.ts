import { collection, getDocs, writeBatch, doc, getDocFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OFFICIAL_CATEGORIES, PRODUITS } from '../data';

export const seedDatabase = async () => {
  try {
    console.log("Vérification de la connexion à Firestore...");
    // Test simple de connexion
    try {
      await getDocFromServer(doc(db, 'system', 'ping'));
    } catch (e: any) {
      if (e.message?.includes('offline')) {
        console.error("ERREUR : Le client est hors ligne. Vérifiez votre configuration Firebase.");
        return { success: false, message: "Erreur de connexion : Client hors ligne" };
      }
    }

    // 1. Check if already seeded
    console.log("Vérification de l'état actuel de la base...");
    const querySnapshot = await getDocs(collection(db, 'produits'));
    if (!querySnapshot.empty) {
      console.warn(`La base contient déjà ${querySnapshot.size} produits. Abandon pour éviter les doublons.`);
      return { success: false, message: `Déjà initialisée (${querySnapshot.size} produits)` };
    }

    console.log("Début de l'initialisation (Seeding)...");

    // 2. Seed Categories
    const categoriesBatch = writeBatch(db);
    OFFICIAL_CATEGORIES.forEach((cat) => {
      const catRef = doc(collection(db, 'categories'), cat.id);
      categoriesBatch.set(catRef, {
        nom: cat.label,
        icon: cat.icon,
        id: cat.id
      });
    });
    await categoriesBatch.commit();
    console.log("✅ Catégories initialisées.");

    // 3. Seed Products
    const productsBatch = writeBatch(db);
    PRODUITS.forEach((product) => {
      const productRef = doc(collection(db, 'produits'), product.id);
      productsBatch.set(productRef, {
        ...product,
        createdAt: new Date()
      });
    });
    await productsBatch.commit();
    console.log("✅ Produits initialisés.");

    return { success: true, message: "Base de données initialisée avec succès !" };
  } catch (error) {
    console.error("ERREUR LORS DU SEEDING :", error);
    throw error;
  }
};
