import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "orvex-33cd6.firebaseapp.com",
  projectId: "orvex-33cd6",
  storageBucket: "orvex-33cd6.firebasestorage.app",
  messagingSenderId: "317044395277",
  appId: import.meta.env.VITE_FIREBASE_API_ID,
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
