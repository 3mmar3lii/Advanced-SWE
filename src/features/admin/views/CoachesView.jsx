import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Plus, ChalkboardTeacher } from '@phosphor-icons/react';

const CoachesView = ({ triggerAction }) => {
  const { users, addCoach } = useContext(AuthContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coachForm, setCoachForm] = useState({ name: '', email: '', password: '' });

  const activeCoaches = users.filter(u => u.role === 'COACH');

  const handleAddCoach = (e) => {
    e.preventDefault();
    if (!coachForm.name || !coachForm.email || !coachForm.password) return;
    
    const success = addCoach(coachForm);
    if (success) {
      setIsModalOpen(false);
      setCoachForm({ name: '', email: '', password: '' });
      triggerAction('Coach Account Created!');
    } else {
      alert('Email already exists');
    }
  };

  return (
    <div className="animate-fade-in relative">
      
      {/* Modal إضافة مدرب */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0b132b]/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Create Coach Account</h3>
            <form onSubmit={handleAddCoach} className="space-y-4">
              <input type="text" placeholder="Coach Name" value={coachForm.name} onChange={e => setCoachForm({...coachForm, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-target-red" />
              <input type="email" placeholder="Login Email" value={coachForm.email} onChange={e => setCoachForm({...coachForm, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-target-red" />
              <input type="text" placeholder="Temporary Password" value={coachForm.password} onChange={e => setCoachForm({...coachForm, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-target-red" />
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold text-gray-600">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-target-red text-white rounded-lg font-bold">Save Coach</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-serif">Coaching Staff</h1>
          <p className="text-gray-500 text-sm">Manage academy coaches and generate their access credentials.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#1e293b] text-white px-4 py-2 rounded-lg hover:bg-black transition text-sm font-medium">
          <Plus size={18} weight="bold" /> Add Coach
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeCoaches.map(coach => (
          <div key={coach.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
            <img src={coach.avatar} className="w-20 h-20 rounded-full border-4 border-gray-50 mb-4" alt="coach" />
            <h3 className="font-bold text-lg text-gray-900">{coach.name}</h3>
            <p className="text-xs font-bold text-target-red uppercase tracking-widest mb-4">Head Coach</p>
            <div className="w-full bg-gray-50 p-2 rounded-lg text-xs text-gray-500 text-left flex items-center gap-2">
              <ChalkboardTeacher size={16} /> {coach.email}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachesView;