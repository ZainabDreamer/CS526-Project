// firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDHDez4UKFbo15b8bgeprJKFFgeeJ9eNpc",
  authDomain: "shumouliya.firebaseapp.com",
  projectId: "shumouliya",
  storageBucket: "shumouliya.firebasestorage.app",
  messagingSenderId: "835527814236",
  appId: "1:835527814236:web:6f2c4770b8e390b8478a99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);