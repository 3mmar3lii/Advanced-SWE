import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AcademyContext } from '../../context/AcademyContext';
import { 
  MagnifyingGlass, Bell, Gear, CaretRight, Circle, Clock, Hexagon, 
  XCircle, Plus, BookOpen, Info, PhoneCall 
} from '@phosphor-icons/react';

const CoachPortal = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
const { sessions, players, updateSessionStatus, addSession, updatePlayer } = useContext(AcademyContext);
  // حالة التنقل بين الصفحات
  const [activeTab, setActiveTab] = useState('Home');
  
  // حالة البحث
  const [searchQuery, setSearchQuery] = useState('');

  // حالات الـ Modals
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendanceRecord, setAttendanceRecord] = useState({});
  
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({ title: '', type: '', time: '', field: '' });

  if (!currentUser) return null;

  const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // 1. فلترة التمارين للمدرب + ربطها بالبحث
  const mySessions = sessions.filter(session => session.coach.toLowerCase() === currentUser.name.toLowerCase());
  const filteredSessions = mySessions.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.field.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sessionPlayers = players.filter(player => player.category === selectedSession?.type);

  // دوال الغياب
  const openAttendance = (session) => {
    if(session.status === 'Completed') return;
    setSelectedSession(session);
    setIsAttendanceModalOpen(true);
  };

  const toggleAttendance = (playerId) => {
    setAttendanceRecord(prev => ({ ...prev, [playerId]: prev[playerId] === 'Present' ? 'Absent' : 'Present' }));
  };

  const saveAttendance = async () => {
    setIsAttendanceModalOpen(false);
    await updateSessionStatus(selectedSession.id, 'Completed');
    setAttendanceRecord({});
  };

  // دالة إضافة تمرين جديد
  const handleAddSession = async (e) => {
    e.preventDefault();
    if(!newSession.title || !newSession.type || !newSession.time) return;
    
    // نبعت التمرين الجديد ونحط اسم المدرب الحالي أوتوماتيك
    await addSession({
      ...newSession,
      coach: currentUser.name
    });
    
    setIsAddSessionModalOpen(false);
    setNewSession({ title: '', type: '', time: '', field: '' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col relative">
      
      {/* 1. Header Navigation */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <Hexagon weight="fill" className="text-target-red text-2xl" />
            <span className="font-extrabold text-xl text-target-navy tracking-tight">Target Academy</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-500">
            {['Home', 'Performance', 'Programs', 'About', 'Contact'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`transition pb-1 border-b-2 ${activeTab === tab ? 'text-target-red border-target-red' : 'border-transparent hover:text-gray-900'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search sessions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 pl-10 pr-4 py-2 rounded-full text-sm border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none transition" 
            />
          </div>
          
          <div className="flex items-center gap-4 text-gray-500">
            <button className="hover:text-gray-900 transition relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-target-red rounded-full border-2 border-white"></span>
            </button>
            <button className="hover:text-gray-900 transition"><Gear size={22} /></button>
            <div className="h-8 w-px bg-gray-200 mx-1"></div>
            <img 
              src={currentUser.avatar} 
              alt="Profile" 
              className="w-9 h-9 rounded-full border-2 border-gray-100 cursor-pointer hover:shadow-md transition"
              onClick={() => { logout(); navigate('/'); }}
              title="Click to Logout"
            />
          </div>
        </div>
      </header>

      {/* 2. Main Dynamic Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full p-8 animate-fade-in">
        
        {/* ======================= HOME TAB ======================= */}
        {activeTab === 'Home' && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-serif tracking-tight">
                  Welcome back, {currentUser.name.split(' ')[0]}
                </h1>
                <p className="text-gray-500">Here is your live schedule and squad performance.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-red-50 rounded-xl p-4 min-w-[140px]">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Team Status</p>
                  <p className="text-target-red font-bold text-sm flex items-center gap-2"><Circle weight="fill" size={10} /> Peak Condition</p>
                </div>
                <div className="bg-[#eff2f6] rounded-xl p-4 min-w-[140px]">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Date</p>
                  <p className="text-gray-900 font-bold text-sm">{todayDate}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Training Schedule */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="text-target-red" size={24} weight="duotone" /> Your Schedule
                  </h2>
                  <button onClick={() => setIsAddSessionModalOpen(true)} className="flex items-center gap-1 bg-target-red text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-700 transition">
                    <Plus weight="bold" /> Add Session
                  </button>
                </div>

                <div className="space-y-4">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => {
                      const timeParts = session.time.split(' ');
                      const isCompleted = session.status === 'Completed';

                      return (
                        <div key={session.id} onClick={() => openAttendance(session)} className={`flex items-center bg-gray-50 rounded-2xl p-4 transition ${isCompleted ? 'cursor-default border-l-4 border-gray-300 opacity-60' : 'cursor-pointer hover:bg-gray-100 border-l-4 border-target-red shadow-sm hover:shadow'}`}>
                          <div className="px-4 text-center border-r border-gray-200 min-w-[80px]">
                            <p className={`text-xl font-extrabold ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>{timeParts[0]}</p>
                            <p className={`text-[10px] font-bold uppercase ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>{timeParts[1] || 'Time'}</p>
                          </div>
                          <div className="px-6 flex-1">
                            <h3 className={`font-bold text-lg ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>{session.title}</h3>
                            <p className="text-xs text-gray-500 font-medium">{session.field} • {session.type}</p>
                          </div>
                          <div className="flex items-center gap-4 pr-2">
                            {isCompleted ? (
                              <span className="bg-gray-200 text-gray-500 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Completed</span>
                            ) : (
                              <span className="bg-red-100 text-target-red text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">{session.status || 'Upcoming'}</span>
                            )}
                            <CaretRight size={20} className={isCompleted ? "text-gray-300" : "text-gray-400"} />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                      <p className="text-gray-500 font-medium">No sessions found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Radar Card */}
              <div className="bg-[#0a0a0a] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex flex-col">
                <h2 className="text-xl font-bold mb-1">Performance Radar</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-8">Squad Average Metrics</p>
                <div className="flex-1 flex items-center justify-center relative my-4">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-80">
                    <polygon points="100,10 180,50 180,150 100,190 20,150 20,50" fill="none" stroke="#333" strokeWidth="1" />
                    <polygon points="100,30 160,65 160,135 100,170 40,135 40,65" fill="none" stroke="#333" strokeWidth="1" />
                    <polygon points="100,50 140,75 140,125 100,150 60,125 60,75" fill="none" stroke="#333" strokeWidth="1" />
                    <polygon points="100,30 150,65 130,140 100,160 50,130 60,75" fill="#bd103b" fillOpacity="0.4" stroke="#bd103b" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ======================= PROGRAMS TAB ======================= */}
        {activeTab === 'Programs' && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center py-20">
            <BookOpen size={64} className="text-target-red mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Academy Programs</h2>
            <p className="text-gray-500 max-w-md mx-auto">Explore our elite development programs tailored for different age groups and skill levels.</p>
          </div>
        )}

        {/* ======================= ABOUT TAB ======================= */}
        {activeTab === 'About' && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center py-20">
            <Info size={64} className="text-target-red mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">About Target Academy</h2>
            <p className="text-gray-500 max-w-md mx-auto">Founded with the mission to elevate athletic performance, Target Academy is the premier destination for serious athletes.</p>
          </div>
        )}

        {/* ======================= CONTACT TAB ======================= */}
        {activeTab === 'Contact' && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center py-20">
            <PhoneCall size={64} className="text-target-red mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Need help with your schedule or have questions about your squad? Reach out to the admin team.</p>
            <button className="bg-[#1e293b] text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition">Message Admin</button>
          </div>
        )}

        {/* ======================= PERFORMANCE TAB ======================= */}
        {activeTab === 'Performance' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 font-serif">Squad Performance Control</h2>
              <p className="text-gray-500 text-sm">Evaluate your athletes and adjust their overall ratings. This data syncs directly to the CEO's Performance Matrix.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map(player => (
                <div key={player.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-target-red to-red-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <img src={player.avatar} className="w-14 h-14 rounded-full border-2 border-gray-50" alt="player" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{player.name}</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase">{player.category}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Overall Rating</label>
                        <span className="text-xl font-black text-target-red">{player.rating || 0}%</span>
                      </div>
                      {/* السلايدر اللي المدرب بيغير منه التقييم */}
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={player.rating || 0}
                        onChange={(e) => updatePlayer(player.id, { rating: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-target-red"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => updatePlayer(player.id, { status: 'Active' })}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${player.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                      >
                        Active
                      </button>
                      <button 
                        onClick={() => updatePlayer(player.id, { status: 'Injured' })}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${player.status === 'Injured' ? 'bg-red-100 text-target-red border border-red-200' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                      >
                        Injured
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ======================= ADD SESSION MODAL ======================= */}
      {isAddSessionModalOpen && (
        <div className="fixed inset-0 bg-[#0b132b]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-extrabold text-gray-900">Add New Session</h3>
              <button onClick={() => setIsAddSessionModalOpen(false)} className="text-gray-400 hover:text-red-500"><XCircle size={28} weight="fill" /></button>
            </div>
            <form onSubmit={handleAddSession} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Session Title</label>
                <input type="text" placeholder="e.g. Tactical Drill" value={newSession.title} onChange={e => setNewSession({...newSession, title: e.target.value})} className="w-full mt-1 px-4 py-2 border rounded-lg focus:border-target-red outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                  <input type="text" placeholder="e.g. U-18 Elite" value={newSession.type} onChange={e => setNewSession({...newSession, type: e.target.value})} className="w-full mt-1 px-4 py-2 border rounded-lg focus:border-target-red outline-none" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Time</label>
                  <input type="text" placeholder="e.g. 10:00 AM" value={newSession.time} onChange={e => setNewSession({...newSession, time: e.target.value})} className="w-full mt-1 px-4 py-2 border rounded-lg focus:border-target-red outline-none" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Field / Location</label>
                <input type="text" placeholder="e.g. Main Pitch" value={newSession.field} onChange={e => setNewSession({...newSession, field: e.target.value})} className="w-full mt-1 px-4 py-2 border rounded-lg focus:border-target-red outline-none" required />
              </div>
              <button type="submit" className="w-full bg-target-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition mt-4">Save Session</button>
            </form>
          </div>
        </div>
      )}

      {/* ======================= ATTENDANCE MODAL ======================= */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 bg-[#0b132b]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">Record Attendance</h3>
                <p className="text-sm font-medium text-gray-500">{selectedSession?.title} • {selectedSession?.type}</p>
              </div>
              <button onClick={() => setIsAttendanceModalOpen(false)} className="text-gray-400 hover:text-red-500 transition"><XCircle size={28} weight="fill" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              {sessionPlayers.length > 0 ? (
                <div className="space-y-3">
                  {sessionPlayers.map(player => {
                    const isPresent = attendanceRecord[player.id] === 'Present';
                    return (
                      <div key={player.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                        <div className="flex items-center gap-3">
                          <img src={player.avatar || `https://ui-avatars.com/api/?name=${player.name}`} className="w-10 h-10 rounded-full border border-gray-200" alt="player" />
                          <span className="font-bold text-gray-900 text-sm">{player.name}</span>
                        </div>
                        <button onClick={() => toggleAttendance(player.id)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${isPresent ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-400 border border-gray-200 hover:bg-gray-200'}`}>
                          {isPresent ? 'Present' : 'Absent'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 font-medium">No active players found in the <span className="font-bold">{selectedSession?.type}</span> category.</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button onClick={saveAttendance} className="w-full bg-target-red hover:bg-red-700 text-white font-bold py-4 rounded-xl transition shadow-lg text-lg">
                Submit & Complete Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto px-8 py-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center bg-[#f8fafc]">
        <div className="mb-4 md:mb-0">
          <h4 className="font-extrabold text-gray-900 text-sm mb-1">Target Academy</h4>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">© 2026 TARGET ACADEMY. ELITE PERFORMANCE FOR ALL.</p>
        </div>
      </footer>

    </div>
  );
};

export default CoachPortal;