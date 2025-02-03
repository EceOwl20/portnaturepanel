// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjj4o0tg9EFTzLDBAtc6QPhR8DW29RiO4",
  authDomain: "dgtlface-1.firebaseapp.com",
  projectId: "dgtlface-1",
  storageBucket: "dgtlface-1.firebasestorage.app",
  messagingSenderId: "657312939886",
  appId: "1:657312939886:web:063b4189d46ff4bd368b7f",
  measurementId: "G-E7C73FVJ06"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);