// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app, analytics }