import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// مفاتيح مشروعك الحقيقية
const firebaseConfig = {
  apiKey: "AIzaSyC3e3HhkET6y6BPK5-eZ2KbrCGOQBSUz2s",
  authDomain: "academy-49910.firebaseapp.com",
  projectId: "academy-49910",
  storageBucket: "academy-49910.firebasestorage.app",
  messagingSenderId: "764978465768",
  appId: "1:764978465768:web:a5c1e8c18b7a98910ff25d",
  measurementId: "G-E2T0YWYLF4"
};

// تهيئة المشروع
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// دول السطرين اللي كانوا ناقصين وعاملين الشاشة البيضاء!
export const auth = getAuth(app);
export const db = getFirestore(app);