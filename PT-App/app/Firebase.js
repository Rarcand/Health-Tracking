// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC53MMmmjHp8IqRuFQz0NxgdkqCShhFl6Q",
  authDomain: "healthtraking.firebaseapp.com",
  databaseURL: "https://healthtraking-default-rtdb.firebaseio.com",
  projectId: "healthtraking",
  storageBucket: "healthtraking.firebasestorage.app",
  messagingSenderId: "93086543403",
  appId: "1:93086543403:web:b7a416e030ce1755ff846e",
  measurementId: "G-YGD1JTTDBX"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();

export { auth, db }