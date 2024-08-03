// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "pantry-tracker-100e3.firebaseapp.com",
  projectId: "pantry-tracker-100e3",
  storageBucket: "pantry-tracker-100e3.appspot.com",
  messagingSenderId: "376856515266",
  appId: "1:376856515266:web:089de1a142f84af15be15b",
  measurementId: "G-BCCXZTR1ZD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
//const analytics = getAnalytics(app);

export { app, firestore };
