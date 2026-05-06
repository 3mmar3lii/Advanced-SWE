import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

export const AcademyContext = createContext();

export const AcademyProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [events, setEvents] = useState([]); 
  const [users, setUsers] = useState([]); // ✅ ضفنا الـ users هنا

  useEffect(() => {
    // جلب كل المستخدمين (آباء - مدربين - إدارة)
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubPlayers = onSnapshot(collection(db, 'players'), (snapshot) => {
      setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubSessions = onSnapshot(collection(db, 'sessions'), (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubInvoices = onSnapshot(collection(db, 'invoices'), (snapshot) => {
      setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // ✅ ضفنا unsubUsers في التنظيف عشان الميموري
    return () => { unsubUsers(); unsubEvents(); unsubPlayers(); unsubSessions(); unsubInvoices(); };
  }, []);

  const addPlayer = async (playerData) => {
    await addDoc(collection(db, 'players'), {
      ...playerData,
      status: 'Active', 
      role: 'PLAYER', 
      avatar: `https://ui-avatars.com/api/?name=${playerData.name.replace(' ', '+')}&background=random`
    });
  };

  const deletePlayer = async (id) => { await deleteDoc(doc(db, 'players', id)); };
  
  const updatePlayer = async (id, updatedData) => { await updateDoc(doc(db, 'players', id), updatedData); };

  const addSession = async (newSession) => { await addDoc(collection(db, 'sessions'), { ...newSession, status: 'Upcoming' }); };
  const deleteSession = async (id) => { await deleteDoc(doc(db, 'sessions', id)); };
  const updateSessionStatus = async (id, newStatus) => { await updateDoc(doc(db, 'sessions', id), { status: newStatus }); };

  const addEvent = async (eventData) => { await addDoc(collection(db, 'events'), eventData); };

  const addInvoice = async (newInvoice) => {
    const newId = `INV-2026-${Math.floor(Math.random() * 900) + 100}`;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    await addDoc(collection(db, 'invoices'), { ...newInvoice, invoiceId: newId, date: today });
  };

  return (
    <AcademyContext.Provider value={{ 
      users, // ✅ مررنا الـ users هنا عشان شاشات الـ CEO تقرأها
      players, addPlayer, deletePlayer, updatePlayer, 
      sessions, addSession, deleteSession, updateSessionStatus,
      events, addEvent, 
      invoices, addInvoice 
    }}>
      {children}
    </AcademyContext.Provider>
  );
};