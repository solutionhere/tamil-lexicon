import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCRjUqvC069GPG5PCIJ0sDQadTaxBwRXwg",
  authDomain: "tamil-lexicon-5c53c.firebaseapp.com",
  projectId: "tamil-lexicon-5c53c",
  storageBucket: "tamil-lexicon-5c53c.firebasestorage.app",
  messagingSenderId: "656552334391",
  appId: "1:656552334391:web:ce375f5f2ef3bbacf1dbb2",
  measurementId: "G-842RPF7NPD"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
