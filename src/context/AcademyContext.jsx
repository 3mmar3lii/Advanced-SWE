import React, { createContext, useState, useEffect } from 'react';

export const AcademyContext = createContext();

// الداتا المبدئية
const defaultPlayers = [
  { id: 1, name: 'Marcus Chen', category: 'U-18 Elite', status: 'Active', parent: 'Sarah Chen' },
];

const defaultSessions = [
  { id: 1, title: 'Elite Tactical Drill', type: 'U-18 Elite', time: '10:00 AM - 12:00 PM', coach: 'Coach Miller', field: 'Main Stadium', status: 'Upcoming', day: 'Mon' },
];

const defaultInvoices = [
  { id: 'INV-2026-089', name: 'Michael Westbrook', date: 'Oct 24, 2026', amount: '$450.00', status: 'Paid' },
];

export const AcademyProvider = ({ children }) => {

  // --- 1. استدعاء آمن جداً من Local Storage ---
  const [players, setPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem('target_academy_players');
      return saved ? JSON.parse(saved) : defaultPlayers;
    } catch { return defaultPlayers; }
  });

  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('target_academy_sessions');
      return saved ? JSON.parse(saved) : defaultSessions;
    } catch { return defaultSessions; }
  });

  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('target_academy_invoices');
      return saved ? JSON.parse(saved) : defaultInvoices;
    } catch { return defaultInvoices; }
  });

  // --- 2. الحفظ التلقائي ---
  useEffect(() => { localStorage.setItem('target_academy_players', JSON.stringify(players)); }, [players]);
  useEffect(() => { localStorage.setItem('target_academy_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('target_academy_invoices', JSON.stringify(invoices)); }, [invoices]);

  // --- 3. دوال الـ CRUD ---
  const addPlayer = (newPlayer) => setPlayers([{ ...newPlayer, id: Date.now() }, ...players]);
  const deletePlayer = (id) => setPlayers(players.filter(player => player.id !== id));

  const addSession = (newSession) => setSessions([{ ...newSession, id: Date.now(), status: 'Upcoming' }, ...sessions]);
  const deleteSession = (id) => setSessions(sessions.filter(session => session.id !== id));
  
  // دالة جديدة لتحديث حالة التمرين (Upcoming, In Progress, Completed)
  const updateSessionStatus = (id, newStatus) => {
    setSessions(sessions.map(session => session.id === id ? { ...session, status: newStatus } : session));
  };

  const addInvoice = (newInvoice) => {
    const newId = `INV-2026-${Math.floor(Math.random() * 900) + 100}`;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setInvoices([{ ...newInvoice, id: newId, date: today }, ...invoices]);
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