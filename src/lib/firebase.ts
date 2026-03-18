import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZUYTkJOH_0HEmx0IA3ktCIaAIUmiSMVE",
  authDomain: "mamoru-a6693.firebaseapp.com",
  projectId: "mamoru-a6693",
  storageBucket: "mamoru-a6693.firebasestorage.app",
  messagingSenderId: "171479035172",
  appId: "1:171479035172:web:9c2e02e72da4057bd757b1",
  measurementId: "G-KBB1HEQGL4"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };