import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. مراقبة المستخدم الحالي وقراءة دوره من Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUser({ uid: user.uid, ...docSnap.data() });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 2. جلب كل المستخدمين للـ CEO (Real-time)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  // تسجيل الدخول
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      if (userData.status === 'Pending') {
        await signOut(auth); // اخرجه فوراً لو الحساب لسه متوافقش عليه
        return { success: false, message: 'Your account is waiting for CEO approval.' };
      }
      return { success: true, role: userData.role };
    } catch (error) {
      return { success: false, message: 'Invalid email or password' };
    }
  };

  // تسجيل حساب جديد (بينزل Pending)
  const signup = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      const newUser = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: 'Pending',
        age: userData.age || null,
        parentName: userData.parentName || null,
        parentEmail: userData.parentEmail || null,
        avatar: `https://ui-avatars.com/api/?name=${userData.name.replace(' ', '+')}&background=random`
      };

      // حفظ الداتا الإضافية في Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      await signOut(auth); // اخرجه لحد ما الـ CEO يوافق
      
      return { success: true, message: 'Account created! Waiting for Academy approval.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // موافقة الـ CEO على الحساب
  const approveUser = async (userId) => {
    await updateDoc(doc(db, 'users', userId), { status: 'Active' });
  };

  // رفض حساب الـ CEO
  const rejectUser = async (userId) => {
    await deleteDoc(doc(db, 'users', userId));
    // ملحوظة: مسح الحساب من Firebase Auth بيحتاج Backend Function، لكن ده كافي للـ UI حالياً
  };

  // إضافة مدرب من قبل الـ CEO
  const addCoach = async (coachData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, coachData.email, coachData.password);
      const newCoach = {
        name: coachData.name,
        email: coachData.email,
        role: 'COACH',
        status: 'Active',
        avatar: `https://ui-avatars.com/api/?name=${coachData.name.replace(' ', '+')}&background=random`
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), newCoach);
      
      // نرجعه يعمل تسجيل دخول بحسابه الأصلي كـ CEO (عشان الـ Auth اتغير)
      alert("Coach created! Please re-login with your CEO credentials to continue.");
      await signOut(auth);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => signOut(auth);

  if (loading) return <div className="h-screen bg-[#0b132b] flex items-center justify-center text-white font-bold">Loading Academy Data...</div>;

  return (
    <AuthContext.Provider value={{ currentUser, users, login, signup, logout, approveUser, rejectUser, addCoach }}>
      {children}
    </AuthContext.Provider>
  );
};