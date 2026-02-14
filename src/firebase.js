import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//Firebase configuration for UniCourt application
const firebaseConfig = {
  apiKey: "AIzaSyBG0B81r39yYG2flfjX-xULje60ACKM2WQ",
  authDomain: "unicourt-7d9c8.firebaseapp.com",
  projectId: "unicourt-7d9c8",
  storageBucket: "unicourt-7d9c8.firebasestorage.app",
  messagingSenderId: "1081486481250",
  appId: "1:1081486481250:web:28001eadc8dad01948be3b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();