import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA_zLu6m8FVooesdhGeN6Af7zAsOl3j0Eo",
    authDomain: "carcare-bf799.firebaseapp.com",
    projectId: "carcare-bf799",
    storageBucket: "carcare-bf799.firebasestorage.app",
    messagingSenderId: "136995792424",
    appId: "1:136995792424:web:11eb48a88555986776b71d",
    measurementId: "G-K79FY942KH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
