import React, { useContext, useState } from 'react';
import { AcademyContext } from '../../../context/AcademyContext';
import { UserCircle, EnvelopeSimple, Strategy, IdentificationBadge, XCircle, CheckCircle } from '@phosphor-icons/react';
import { db } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const CoachesView = () => {
  const { users } = useContext(AcademyContext);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [squadName, setSquadName] = useState('');

  const coaches = (users || []).filter(u => u.role === 'COACH');

  const handleAssignSquad = async (e) => {
    e.preventDefault();
    try {
      const coachRef = doc(db, 'users', selectedCoach.id);
      await updateDoc(coachRef, { assignedSquad: squadName });
      setSelectedCoach(null);
      setSquadName('');
      alert('Squad assigned to coach successfully!');
    } catch (err) { alert('Error assigning squad'); }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 font-serif">Coaching Staff</h2>
        <p className="text-gray-500 text-sm">Manage your academy coaches and their squad assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map(coach => (
          <div key={coach.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group">
            <div className="flex gap-4 items-center mb-6">
              <img src={coach.avatar} className="w-16 h-16 rounded-full border-2 border-red-50" alt="avatar" />
              <div>
                <h3 className="font-bold text-xl text-gray-900">{coach.name}</h3>
                <p className="text-[10px] font-black text-target-red uppercase flex items-center gap-1">
                  <IdentificationBadge size={12} /> {coach.assignedSquad || 'No Squad Assigned'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium">
                <EnvelopeSimple size={18} className="text-gray-400" />
                <span className="text-gray-700 truncate">{coach.email}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedCoach(coach)}
              className="w-full mt-4 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-black transition shadow-sm"
            >
              <Strategy size={16} /> {coach.assignedSquad ? 'Change Squad' : 'Assign Squad'}
            </button>
          </div>
        ))}
      </div>

      {/* Modal: Assign Squad */}
      {selectedCoach && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative animate-fade-in shadow-2xl">
            <button onClick={() => setSelectedCoach(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><XCircle size={28} weight="fill" /></button>
            <h3 className="text-2xl font-black mb-1">Assign Coaching Duty</h3>
            <p className="text-sm text-gray-500 mb-6">Select which squad <span className="font-bold text-gray-900">{selectedCoach.name}</span> will manage.</p>
            
            <form onSubmit={handleAssignSquad} className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Squad Name (e.g. U-16 Pro)</label>
              <input 
                type="text" 
                value={squadName} 
                onChange={(e) => setSquadName(e.target.value)} 
                placeholder="Enter squad name..." 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-target-red outline-none transition" 
                required 
              />
              <button type="submit" className="w-full bg-target-red text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition shadow-lg flex items-center justify-center gap-2">
                <CheckCircle size={20} weight="bold" /> Confirm Assignment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachesView;