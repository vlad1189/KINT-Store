// Firebase configuration for frontend
// This allows direct access to Firebase services if needed in the future

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBLgK8FmM9xJz7vQ2hN3pR6tY8wE4rT2uI",
  authDomain: "kshopping-c5fd6.firebaseapp.com",
  projectId: "kshopping-c5fd6",
  storageBucket: "kshopping-c5fd6.firebasestorage.app",
  messagingSenderId: "110236079851178265429",
  appId: "1:110236079851178265429:web:8f3e2d1c4a5968b7e3f0d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;