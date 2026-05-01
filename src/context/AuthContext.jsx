import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// مستخدمين افتراضيين للتجربة
const defaultUsers = [
  { id: 1, name: 'Alex Hunter', email: 'ceo@target.com', password: '123', role: 'CEO', avatar: 'https://i.pinimg.com/736x/d1/81/e4/d181e44cf0a7d5f9190bc96939da4164.jpg' },
  { id: 2, name: 'James Sterling', email: 'cfo@target.com', password: '123', role: 'CFO', avatar: 'https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg' },
  { id: 3, name: 'Coach Miller', email: 'coach@target.com', password: '123', role: 'COACH', avatar: 'https://i.pinimg.com/736x/31/60/6f/31606f66d65555a39beedc3d721b11c2.jpg' },
  { id: 4, name: 'Michael Westbrook', email: 'parent@target.com', password: '123', role: 'PARENT', avatar: 'https://i.pravatar.cc/150?img=14' }
];

export const AuthProvider = ({ children }) => {
  // حفظ المستخدمين في اللوكال ستوريدج
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('target_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  // حفظ المستخدم الحالي اللي فاتح السيستم
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('target_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => { localStorage.setItem('target_users', JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('target_currentUser', JSON.stringify(currentUser));
    else localStorage.removeItem('target_currentUser');
  }, [currentUser]);

  // دالة تسجيل الدخول
  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true, role: user.role };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  // دالة إنشاء حساب جديد
  const signup = (name, email, password, role) => {
    if (users.find(u => u.email === email)) return { success: false, message: 'Email already exists' };
    const newUser = {
      id: Date.now(),
      name, email, password, role,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random` // صورة تلقائية بالاسم
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true, role };
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};