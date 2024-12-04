// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyB4k6_JKoVD62sd5dLk_JJXNkqbf1JYFBc",
    authDomain: "airoutegenerator.firebaseapp.com",
    projectId: "airoutegenerator",
    storageBucket: "airoutegenerator.appspot.com",
    messagingSenderId: "949707715540",
    appId: "1:949707715540:web:b655be0f1dee9558649c41",
    measurementId: "G-JVLRMPDSRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, signInWithPopup, signOut, db };
