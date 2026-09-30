import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFl5BKJGEL3xnx517HKrUgwz5g0rBWEmI",
  authDomain: "viral-cilp.firebaseapp.com",
  projectId: "viral-cilp",
  storageBucket: "viral-cilp.firebasestorage.app",
  messagingSenderId: "259292737646",
  appId: "1:259292737646:web:8c1b5714ba970e3527367f",
  measurementId: "G-CP5WSR3NNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
