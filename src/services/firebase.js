
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAczxDkHkVfIUuib7GSLQeKnxAarvY9-Qg",
  authDomain: "ecofood-react-p2-va-cv-r-3902d.firebaseapp.com",
  projectId: "ecofood-react-p2-va-cv-r-3902d",
  storageBucket: "ecofood-react-p2-va-cv-r-3902d.firebasestorage.app",
  messagingSenderId: "320792063821",
  appId: "1:320792063821:web:4ceb657e5c27fa403c5104",
  measurementId: "G-NNLL37LEMG"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);