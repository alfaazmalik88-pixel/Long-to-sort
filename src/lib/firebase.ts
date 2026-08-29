import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAFl5BKJGEL3xnx517HKrUgwz5g0rBWEmI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "viral-cilp.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "viral-cilp",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "viral-cilp.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "259292737646",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:259292737646:web:8c1b5714ba970e3527367f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CP5WSR3NNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const storage = getStorage(app);
const db = getFirestore(app);

export { app, analytics, storage, db };
