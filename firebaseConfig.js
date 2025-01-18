import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCXX2uq2fS1Ibds3Z2NBYz-Y0AxIvh8PAE",
  authDomain: "findfilms-5c5ca.firebaseapp.com",
  projectId: "findfilms-5c5ca",
  storageBucket: "findfilms-5c5ca.firebasestorage.app",
  messagingSenderId: "662184606478",
  appId: "1:662184606478:web:e0a00a6612734cd5b4b55f",
  measurementId: "G-9TPBMBFZKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore Database
const analytics = getAnalytics(app); // Google Analytics (optioneel)

export { app, auth, db, analytics };
