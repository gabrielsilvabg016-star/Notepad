import { initializeApp } from "firebase/app";
import { inMemoryPersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDxn5EF2XZdp5eN7uZfTp0EHy6-F9Jnih0",
    authDomain: "tads-522ec.firebaseapp.com",
    projectId: "tads-522ec",
    storageBucket: "tads-522ec.firebasestorage.app",
    messagingSenderId: "591681614851",
    appId: "1:591681614851:web:ca4bcec43f5508eea70a36"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, { persistence: inMemoryPersistence });
const db = getFirestore(app);

export {auth, db};