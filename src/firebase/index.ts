import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRJggoc9K_8WnJOFeoUxTDnBqYJwREzhY",
  authDomain: "schedual-maker.firebaseapp.com",
  projectId: "schedual-maker",
  storageBucket: "schedual-maker.appspot.com",
  messagingSenderId: "607352000255",
  appId: "1:607352000255:web:39c9d7bf3cc66b5d1146ca",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Storage.
export const storage = getStorage(app);
// DataBase.
export const db = getFirestore(app);
// Authentication.
export const auth = getAuth(app);
