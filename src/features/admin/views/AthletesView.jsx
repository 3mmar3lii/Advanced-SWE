import React, { useContext, useState } from 'react';
import { AcademyContext } from '../../../context/AcademyContext';
import { UserCircle, Link, EnvelopeSimple, XCircle, Plus, ShieldCheck, CheckCircle, Trash, Clock, PencilSimple } from '@phosphor-icons/react';

const AthletesView = () => {
  const { players, updatePlayer, addPlayer, deletePlayer } = useContext(AcademyContext);
  
  // تقسيم اللاعبين بدقة والتأكد إن الداتا موجودة
  const activePlayers = players.filter(p => p.status === 'Active' || p.status === 'Injured');
  const pendingPlayers = players.filter(p => p.status === 'Pending');

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [parentEmailInput, setParentEmailInput] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', email: '', parentEmail: '', category: '', rating: 75 });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState(null);

  const [selectedPending, setSelectedPending] = useState(null);
  const [acceptData, setAcceptData] = useState({ category: '', parentEmail: '' });

  // 1. القبول الآمن (Bulletproof Accept)
  const handleAcceptPlayer = async (e) => {
    e.preventDefault();
    try {
      await updatePlayer(selectedPending.id, {
        status: 'Active',
        category: acceptData.category || 'Unassigned',
        parentEmail: acceptData.parentEmail || selectedPending.parentEmail || '',
        rating: 70 
      });
      // قفل المودال وتصفير الداتا بعد النجاح
      setSelectedPending(null);
      setAcceptData({ category: '', parentEmail: '' });
      alert('Athlete activated successfully! They are now in the Active Squad.');
    } catch (error) {
      console.error("Error accepting player:", error);
      alert("Failed to accept player. Check console.");
    }
  };

  // 2. الحذف الشامل (Delete Everywhere)
  const handleDeletePlayer = async (id, name) => {
    const isConfirmed = window.confirm(`Are you absolutely sure you want to permanently delete ${name}? This will remove their Digital ID and performance records.`);
    if (isConfirmed) {
      try {
        await deletePlayer(id);
        alert(`${name} has been removed from the academy.`);
      } catch (error) {
        console.error("Error deleting player:", error);
        alert("Failed to delete player.");
      }
    }
  };

  // 3. التعديل الآمن
  const handleEditPlayer = async (e) => {
    e.preventDefault();
    try {
      await updatePlayer(playerToEdit.id, {
        name: playerToEdit.name,
        email: playerToEdit.email,
        parentEmail: playerToEdit.parentEmail,
        category: playerToEdit.category,
        rating: parseInt(playerToEdit.rating) || 0,
        status: playerToEdit.status
      });
      setIsEditModalOpen(false);
      setPlayerToEdit(null);
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  const handleLinkParent = async (e) => {
    e.preventDefault();
    if (!parentEmailInput) return;
    await updatePlayer(selectedPlayer.id, { parentEmail: parentEmailInput });
    setSelectedPlayer(null);
    setParentEmailInput('');
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    await addPlayer(newPlayer);
    setIsAddModalOpen(false);
    setNewPlayer({ name: '', email: '', parentEmail: '', category: '', rating: 75 });
  };

  return (
    <div className="animate-fade-in pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 font-serif">Athletes Directory</h2>
          <p className="text-gray-500 text-sm">Accept new requests, manage squads, edit profiles and link family accounts.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Plus weight="bold" size={18} /> Manually Add Athlete
        </button>
      </div>

      {/* ==========================================
          PENDING REQUESTS SECTION 
      ========================================== */}
      {pendingPlayers.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
            <Clock className="text-orange-500" size={24} weight="duotone" /> Pending Registrations 
            <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full">{pendingPlayers.length}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPlayers.map(player => (
              <div key={player.id} className="bg-orange-50 p-6 rounded-3xl border border-orange-100 shadow-sm relative">
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-orange-200 flex items-center justify-center text-orange-500">
                    <UserCircle size={28} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{player.name}</h3>
                    <p className="text-[10px] font-bold text-gray-500">{player.email}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => {
                      setSelectedPending(player);
                      setAcceptData({ category: '', parentEmail: player.parentEmail || '' });
                    }}
                    className="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-green-600 transition shadow-sm"
                  >
                    <CheckCircle size={16} weight="bold" /> Accept
                  </button>
                  <button 
                    onClick={() => handleDeletePlayer(player.id, player.name)}
                    className="py-2 px-4 bg-white border border-red-100 text-red-500 text-xs font-bold rounded-xl flex justify-center items-center hover:bg-red-50 transition shadow-sm"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          ACTIVE ATHLETES GRID
      ========================================== */}
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
        <ShieldCheck className="text-target-red" size={24} weight="duotone" /> Active Squads
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activePlayers.map(player => (
          <div key={player.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#0b132b] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Action Buttons (Edit & Delete) */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => { setPlayerToEdit(player); setIsEditModalOpen(true); }} 
                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg shadow-sm transition"
              >
                <PencilSimple size={16} weight="bold" />
              </button>
              <button 
                onClick={() => handleDeletePlayer(player.id, player.name)} 
                className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg shadow-sm transition"
              >
                <Trash size={16} weight="bold" />
              </button>
            </div>

            <div className="flex gap-4 items-center mb-4">
              <img src={player.avatar || `https://ui-avatars.com/api/?name=${player.name}`} className="w-14 h-14 rounded-full border-2 border-gray-50 shadow-sm" alt="avatar" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight pr-14">{player.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={12} className="text-target-red" /> {player.category}
                  </p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${player.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {player.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs font-medium border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <UserCircle size={16} className="text-gray-400" />
                  <span className="text-gray-600 truncate">{player.email || "No App Account"}</span>
                </div>
                <span className="font-black text-target-red">{player.rating || 0}%</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <EnvelopeSimple size={16} className="text-gray-400" />
                <span className={player.parentEmail ? "text-gray-900 font-bold" : "text-red-500 font-bold italic"}>
                  {player.parentEmail || "No Parent Linked"}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedPlayer(player)}
              className="w-full py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-black transition shadow-sm"
            >
              <Link size={16} /> {player.parentEmail ? "Update Parent Email" : "Link Parent Account"}
            </button>
          </div>
        ))}
        {activePlayers.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 italic border border-dashed rounded-3xl bg-white">
            No active athletes in the academy yet.
          </div>
        )}
      </div>

      {/* ==========================================
          MODALS
      ========================================== */}

      {/* 1. Modal: قبول اللاعب المعلق (Accept Player) */}
      {selectedPending && (
        <div className="fixed inset-0 bg-[#0b132b]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl animate-fade-in">
            <button onClick={() => setSelectedPending(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><XCircle size={28} weight="fill" /></button>
            <h3 className="text-2xl font-black mb-1 text-gray-900">Accept Registration</h3>
            <p className="text-sm text-gray-500 mb-6">Assign <span className="font-bold text-gray-900">{selectedPending.name}</span> to a squad to activate their account.</p>
            
            <form onSubmit={handleAcceptPlayer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Assign Category / Squad</label>
                <input type="text" value={acceptData.category} onChange={(e) => setAcceptData({...acceptData, category: e.target.value})} placeholder="e.g. U-18 Elite" className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none transition" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Parent Email (Optional)</label>
                <input type="email" value={acceptData.parentEmail} onChange={(e) => setAcceptData({...acceptData, parentEmail: e.target.value})} placeholder="To link to Family Portal" className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none transition mb-4" />
              </div>
              <button type="submit" className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition shadow-lg flex items-center justify-center gap-2">
                <CheckCircle size={20} weight="bold" /> Activate Athlete
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: التعديل الشامل للاعب (Edit Player) */}
      {isEditModalOpen && playerToEdit && (
        <div className="fixed inset-0 bg-[#0b132b]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 relative shadow-2xl animate-fade-in">
            <button onClick={() => { setIsEditModalOpen(false); setPlayerToEdit(null); }} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition"><XCircle size={28} weight="fill" /></button>
            <h3 className="text-2xl font-black mb-2">Edit Athlete Profile</h3>
            <p className="text-sm text-gray-500 mb-6">Update data for <span className="font-bold text-gray-900">{playerToEdit.name}</span>.</p>
            
            <form onSubmit={handleEditPlayer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Athlete Name</label>
                <input type="text" value={playerToEdit.name} onChange={e => setPlayerToEdit({...playerToEdit, name: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                  <input type="text" value={playerToEdit.category} onChange={e => setPlayerToEdit({...playerToEdit, category: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Performance Rating</label>
                  <input type="number" min="0" max="100" value={playerToEdit.rating} onChange={e => setPlayerToEdit({...playerToEdit, rating: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Parent Email</label>
                  <input type="email" value={playerToEdit.parentEmail} onChange={e => setPlayerToEdit({...playerToEdit, parentEmail: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
                  <select value={playerToEdit.status} onChange={e => setPlayerToEdit({...playerToEdit, status: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none">
                    <option value="Active">Active</option>
                    <option value="Injured">Injured</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg mt-4">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: إضافة لاعب يدوي (Manual Add) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#0b132b]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 relative shadow-2xl animate-fade-in">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition"><XCircle size={28} weight="fill" /></button>
            <h3 className="text-2xl font-black mb-2">Register New Athlete</h3>
            <p className="text-sm text-gray-500 mb-6">Create a profile manually. They will automatically get a digital ID.</p>
            
            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Athlete Name</label>
                <input type="text" placeholder="e.g. Ali Hassan" value={newPlayer.name} onChange={e => setNewPlayer({...newPlayer, name: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
                  <input type="email" placeholder="For App Login" value={newPlayer.email} onChange={e => setNewPlayer({...newPlayer, email: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 outline-none" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                  <input type="text" placeholder="e.g. U-18 Elite" value={newPlayer.category} onChange={e => setNewPlayer({...newPlayer, category: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 outline-none" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Parent Email (Optional)</label>
                <input type="email" placeholder="To link to Family Portal" value={newPlayer.parentEmail} onChange={e => setNewPlayer({...newPlayer, parentEmail: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 outline-none" />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition shadow-lg mt-4">Create Athlete Profile</button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: ربط الأب (Link Parent) */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-[#0b132b]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
            <button onClick={() => setSelectedPlayer(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><XCircle size={28} weight="fill" /></button>
            <h3 className="text-xl font-black mb-1">Link Family Account</h3>
            <p className="text-sm text-gray-500 mb-6">Connect <span className="font-bold text-gray-900">{selectedPlayer.name}</span> to a parent portal.</p>
            
            <form onSubmit={handleLinkParent}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Parent's Email Address</label>
              <input type="email" value={parentEmailInput} onChange={(e) => setParentEmailInput(e.target.value)} placeholder="e.g. parent@test.com" className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 outline-none mb-6" required />
              <button type="submit" className="w-full bg-target-red text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition shadow-lg">Save Link</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthletesView;