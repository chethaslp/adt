"use client"
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDx0pHDqjB-pwo_sRS6-vWqkhwzbN_WrS4",
  authDomain: "projclp.firebaseapp.com",
  projectId: "projclp",
  storageBucket: "projclp.appspot.com",
  messagingSenderId: "650860249658",
  appId: "1:650860249658:web:c12515c93716478d9f2b03"
};

export const apiKey = firebaseConfig.apiKey
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)


