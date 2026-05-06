import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // نجيب بيانات اليوزر (الدور والاسم) من فايربيس
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUser({ uid: user.uid, email: user.email, ...docSnap.data() });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

// داخل AuthContext.jsx -> دالة signup
const signup = async (formData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const user = userCredential.user;
    const avatarUrl = `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=random`;

    // 1. حساب اللاعب الأساسي
await setDoc(doc(db, 'users', user.uid), {
  name: formData.name,
  email: formData.email,
  role: formData.role,
  avatar: avatarUrl,
  age: formData.age || null,
  status: 'Pending' // 👈 ضيف السطر ده عشان الحساب ينزل معلق
});

    // 2. لو لاعب، نبعته للـ CEO
    if (formData.role === 'PLAYER') {
      await addDoc(collection(db, 'players'), {
        name: formData.name,
        email: formData.email,
        parentEmail: formData.parentEmail || '',
        status: 'Pending',
        category: 'Unassigned',
        rating: 0,
        avatar: avatarUrl
      });

      // 🌟 التعديل الجديد: لو اللاعب صغير، ننشئ سجل للأب في Users عشان يظهر في الـ Parents Tab
      if (formData.age && parseInt(formData.age) < 16 && formData.parentEmail) {
        // بنستخدم setDoc مع إيميل الأب كـ ID عشان ميتكررش لو عنده كذا ابن
        await setDoc(doc(db, 'users', `parent_${formData.parentEmail}`), {
          name: formData.parentName || 'New Parent',
          email: formData.parentEmail,
          role: 'PARENT',
          avatar: `https://ui-avatars.com/api/?name=${formData.parentName?.replace(' ', '+') || 'P'}&background=888`
        }, { merge: true }); // merge عشان ميمسحش بيانات قديمة لو الأب موجود فعلاً
      }
    }
    return { success: true, message: 'Created successfully!' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// داخل AuthContext.jsx
const login = async (email, password) => {
  try {
    // 1. تسجيل الدخول عن طريق فايربيس
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. جلب بيانات المستخدم من Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();

      // 🛑 3. نقطة التفتيش: لو الحساب معلق، نمنعه من الدخول
      if (userData.status === 'Pending') {
        await signOut(auth); // نعمله تسجيل خروج فوراً
        return { 
          success: false, 
          message: 'Access Denied: Your account is pending admin approval. Please wait.' 
        };
      }

      // لو الحساب Active أو مفيش فيه مشكلة، نفتحله الداشبورد
      setCurrentUser({ uid: user.uid, ...userData });
      return { success: true, role: userData.role };
      
    } else {
      await signOut(auth);
      return { success: false, message: 'User profile not found in database.' };
    }
  } catch (error) {
    return { success: false, message: 'Invalid email or password.' };
  }
};

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};