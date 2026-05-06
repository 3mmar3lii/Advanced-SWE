import React, { useContext, useState } from 'react';
import { AcademyContext } from '../../../context/AcademyContext';
import { UserCircle, EnvelopeSimple, Users, ShieldCheck, XCircle, Link } from '@phosphor-icons/react';

const ParentsView = () => {
  const { users, players, updatePlayer } = useContext(AcademyContext);
  const [selectedParent, setSelectedParent] = useState(null);
  const [targetPlayerId, setTargetPlayerId] = useState('');

  const parents = (users || []).filter(u => u.role === 'PARENT');
  // اللعيبة اللي لسه مش مربوطين بإيميل أب (أو كلهم عشان تختار منهم)
  const unlinkedPlayers = (players || []).filter(p => !p.parentEmail || p.parentEmail === '');

  const handleLinkAthlete = async (e) => {
    e.preventDefault();
    if (!targetPlayerId) return;
    // تحديث ملف اللاعب ليحتوي على إيميل الأب
    await updatePlayer(targetPlayerId, { parentEmail: selectedParent.email });
    setSelectedParent(null);
    setTargetPlayerId('');
    alert('Athlete linked to parent successfully!');
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 font-serif">Registered Families</h2>
          <p className="text-gray-500 text-sm">Manage parent accounts and link them to athletes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parents.map(parent => {
          const linkedAthletes = (players || []).filter(p => p.parentEmail === parent.email);

          return (
            <div key={parent.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group">
              <div className="flex gap-4 items-center mb-6">
                <img src={parent.avatar} className="w-14 h-14 rounded-full border-2 border-gray-50" alt="avatar" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{parent.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{parent.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-3 mb-4">
                <p className="text-[10px] font-black text-gray-400 uppercase">Linked Athletes ({linkedAthletes.length})</p>
                <div className="flex flex-wrap gap-2">
                  {linkedAthletes.map(a => (
                    <span key={a.id} className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-md font-bold border border-blue-100">{a.name}</span>
                  ))}
                  {linkedAthletes.length === 0 && <span className="text-[10px] text-red-400 italic">No athletes linked yet</span>}
                </div>
              </div>

              <button 
                onClick={() => setSelectedParent(parent)}
                className="w-full py-2 bg-[#0b132b] text-white text-xs font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-black transition"
              >
                <Link size={16} /> Link New Athlete
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal: Link Athlete */}
      {selectedParent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
            <button onClick={() => setSelectedParent(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><XCircle size={28} weight="fill" /></button>
            <h3 className="text-xl font-black mb-1 text-gray-900">Link Athlete to {selectedParent.name}</h3>
            <p className="text-sm text-gray-500 mb-6">Select an athlete to connect to this parent portal.</p>
            
            <form onSubmit={handleLinkAthlete} className="space-y-4">
              <select 
                value={targetPlayerId} 
                onChange={(e) => setTargetPlayerId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-target-red text-sm font-medium"
                required
              >
                <option value="">-- Choose Athlete --</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
              <button type="submit" className="w-full bg-target-red text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition shadow-lg">Confirm Link</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentsView;