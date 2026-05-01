import React, { useState, useContext } from 'react';
import { MagnifyingGlass, Plus, Trash, UserPlus, X } from '@phosphor-icons/react';
import { AcademyContext } from '../../../context/AcademyContext'; // ربط الشاشة بقاعدة البيانات

const AthletesView = ({ triggerAction }) => {
  // سحب الداتا والوظائف من الـ Context
  const { players, addPlayer, deletePlayer } = useContext(AcademyContext);
  
  // حالة البحث ونافذة الإضافة
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlayerForm, setNewPlayerForm] = useState({ name: '', category: 'Juniors', status: 'Active', parent: '' });

  // تفعيل البحث (Filter)
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    player.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // تنفيذ إضافة اللاعب
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPlayerForm.name) return alert('Please enter player name');
    addPlayer(newPlayerForm);
    setIsAddModalOpen(false);
    setNewPlayerForm({ name: '', category: 'Juniors', status: 'Active', parent: '' });
    triggerAction('Athlete Added Successfully!');
  };

  return (
    <div className="animate-fade-in relative">
      
      {/* نافذة إضافة لاعب (Add Modal) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#0b132b]/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><UserPlus /> Onboard Athlete</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition"><X size={24} weight="bold" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">ATHLETE NAME</label>
                <input type="text" value={newPlayerForm.name} onChange={(e) => setNewPlayerForm({...newPlayerForm, name: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">CATEGORY</label>
                <select value={newPlayerForm.category} onChange={(e) => setNewPlayerForm({...newPlayerForm, category: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none">
                  <option>Buds (6-9 Years)</option>
                  <option>Juniors (9-14 Years)</option>
                  <option>U-18 Elite</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">PARENT NAME</label>
                <input type="text" value={newPlayerForm.parent} onChange={(e) => setNewPlayerForm({...newPlayerForm, parent: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none" placeholder="e.g. Michael Doe" />
              </div>
              <button type="submit" className="w-full bg-target-red hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-4 transition shadow-md">Add Athlete</button>
            </form>
          </div>
        </div>
      )}

      {/* Header and Search */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-serif">Athletes Directory</h1>
          <p className="text-gray-500 text-sm">Manage all players, monitor statuses, and onboard new talent.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-target-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm">
          <Plus size={18} weight="bold" /> Onboard Athlete
        </button>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search athletes by name or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-target-red focus:ring-1 focus:ring-target-red transition-colors" 
            />
          </div>
          <div className="text-sm text-gray-500 font-bold">Total: {filteredPlayers.length} Athletes</div>
        </div>
        
        {/* Players Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-4 font-bold">Athlete Name</th>
                <th className="pb-4 font-bold">Category</th>
                <th className="pb-4 font-bold">Parent / Guardian</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPlayers.length > 0 ? filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 font-bold text-gray-900 text-sm flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">{player.name.charAt(0)}</div>
                    {player.name}
                  </td>
                  <td className="py-4 text-sm text-gray-600 font-medium">{player.category}</td>
                  <td className="py-4 text-sm text-gray-500">{player.parent || 'N/A'}</td>
                  <td className="py-4">
                    <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider ${player.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {player.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => {
                        deletePlayer(player.id);
                        triggerAction(`${player.name} has been removed.`);
                      }} 
                      className="text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash size={20} weight="fill" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400 font-medium">No athletes found matching "{searchQuery}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AthletesView;