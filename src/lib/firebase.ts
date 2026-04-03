import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Voici les clés de TON projet FasoLocal
const firebaseConfig = {
  apiKey: "AIzaSyDT35nSgQ4UYtAaa0Gjb6bavQ1oBZTBjYs",
  authDomain: "fasolocal-c901f.firebaseapp.com",
  projectId: "fasolocal-c901f",
  storageBucket: "fasolocal-c901f.firebasestorage.app",
  messagingSenderId: "907110006697",
  appId: "1:907110006697:web:200cc44ad1e64c6f954eb8"
};

// On initialise le système
const app = initializeApp(firebaseConfig);

// On prépare les outils pour les clients (auth) et les produits (db)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;