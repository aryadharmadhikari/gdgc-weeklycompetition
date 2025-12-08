
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7syR7NsLYqlgfct23iJ7MLGKwkWGQbHA",
    authDomain: "gdgc-dsa-bootcamp.firebaseapp.com",
    projectId: "gdgc-dsa-bootcamp",
    storageBucket: "gdgc-dsa-bootcamp.firebasestorage.app",
    messagingSenderId: "1068066852096",
    appId: "1:1068066852096:web:82d641db9463cdfbfdf7e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);

// Configure Google Auth Provider with domain restriction
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    hd: 'dbit.in' // Restrict to dbit.in domain
});
export const db = getFirestore(app);

export default app;