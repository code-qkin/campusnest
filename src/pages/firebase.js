// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-Uum8lBkaudKpC4Fd3s2xRuFnfqCKpfM",
  authDomain: "campusnest-36767.firebaseapp.com",
  projectId: "campusnest-36767",
  storageBucket: "campusnest-36767.appspot.com",
  messagingSenderId: "674442656143",
  appId: "1:674442656143:web:9684b875bffb38c1c7b3fa",
  measurementId: "G-521NM8CNKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);