// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxn5EF2XZdp5eN7uZfTp0EHy6-F9Jnih0",
  authDomain: "tads-522ec.firebaseapp.com",
  projectId: "tads-522ec",
  storageBucket: "tads-522ec.firebasestorage.app",
  messagingSenderId: "591681614851",
  appId: "1:591681614851:web:ca4bcec43f5508eea70a36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);