import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

export const AcademyContext = createContext();

export const AcademyProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // ==========================================
  // جلب البيانات بشكل لحظي من Firebase
  // ==========================================
  useEffect(() => {
    // جلب اللاعبين
    const unsubPlayers = onSnapshot(collection(db, 'players'), (snapshot) => {
      setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // جلب التمارين
    const unsubSessions = onSnapshot(collection(db, 'sessions'), (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // جلب الفواتير
    const unsubInvoices = onSnapshot(collection(db, 'invoices'), (snapshot) => {
      setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubPlayers(); unsubSessions(); unsubInvoices(); };
  }, []);


  // ==========================================
  // دوال الـ CRUD الحقيقية (بتكلم Firebase)
  // ==========================================

  const addPlayer = async (newPlayer) => {
    await addDoc(collection(db, 'players'), newPlayer);
  };

  const deletePlayer = async (id) => {
    await deleteDoc(doc(db, 'players', id));
  };

  const addSession = async (newSession) => {
    await addDoc(collection(db, 'sessions'), { ...newSession, status: 'Upcoming' });
  };

  const deleteSession = async (id) => {
    await deleteDoc(doc(db, 'sessions', id));
  };
  
  const updateSessionStatus = async (id, newStatus) => {
    await updateDoc(doc(db, 'sessions', id), { status: newStatus });
  };

  const addInvoice = async (newInvoice) => {
    const newId = `INV-2026-${Math.floor(Math.random() * 900) + 100}`;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    await addDoc(collection(db, 'invoices'), { ...newInvoice, invoiceId: newId, date: today });
  };

  return (
    <AcademyContext.Provider value={{ 
      players, addPlayer, deletePlayer, 
      sessions, addSession, deleteSession, updateSessionStatus,
      invoices, addInvoice 
    }}>
      {children}
    </AcademyContext.Provider>
  );
};