import React, { useState, useContext } from 'react';
import { Clock, MapPin, User, Plus, Funnel, Trash, X, MagnifyingGlass, CaretDown } from '@phosphor-icons/react';
import { AcademyContext } from '../../../context/AcademyContext';

const SchedulesView = ({ triggerAction }) => {
  // سحب الداتا والدالة الجديدة (updateSessionStatus)
  const { sessions, addSession, deleteSession, updateSessionStatus } = useContext(AcademyContext);
  
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [newSessionForm, setNewSessionForm] = useState({
    title: '', type: 'Juniors', time: '', coach: '', field: '', day: selectedDay
  });

  const weekDays = [
    { name: 'Mon', date: 12 }, { name: 'Tue', date: 13 }, { name: 'Wed', date: 14 },
    { name: 'Thu', date: 15 }, { name: 'Fri', date: 16 }, { name: 'Sat', date: 17 }, { name: 'Sun', date: 18 }
  ];

  const filteredSessions = sessions.filter(session => 
    session.day === selectedDay && 
    (session.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     session.coach.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSessionForm.title || !newSessionForm.time) return alert('Please fill required fields');
    addSession(newSessionForm);
    setIsAddModalOpen(false);
    triggerAction('New Session Scheduled Successfully!');
  };

  // دالة ذكية عشان تفتح الفورمة وتخلي اليوم الافتراضي هو اليوم اللي إنت واقف عليه
  const openAddModal = () => {
    setNewSessionForm({ title: '', type: 'Juniors', time: '', coach: '', field: '', day: selectedDay });
    setIsAddModalOpen(true);
  };

  // دالة لتلوين الـ State حسب الاختيار
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-green-50 text-green-600 border-green-200';
      case 'Completed': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-200'; // Upcoming
    }
  };

  return (
    <div className="animate-fade-in relative">
      
      {/* Modal إضافة تمرين */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#0b132b]/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">Schedule New Session</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition"><X size={24} weight="bold" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">SESSION TITLE</label>
                <input type="text" value={newSessionForm.title} onChange={(e) => setNewSessionForm({...newSessionForm, title: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none" placeholder="e.g. Goalkeeper Tactics" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">DAY</label>
                  <select value={newSessionForm.day} onChange={(e) => setNewSessionForm({...newSessionForm, day: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none">
                    {weekDays.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">TIME</label>
                  <input type="text" value={newSessionForm.time} onChange={(e) => setNewSessionForm({...newSessionForm, time: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none" placeholder="e.g. 05:00 PM" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">COACH</label>
                  <input type="text" value={newSessionForm.coach} onChange={(e) => setNewSessionForm({...newSessionForm, coach: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none" placeholder="Coach Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">FIELD</label>
                  <input type="text" value={newSessionForm.field} onChange={(e) => setNewSessionForm({...newSessionForm, field: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none" placeholder="e.g. Field A" />
                </div>
              </div>
              <button type="submit" className="w-full bg-target-red hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-4 transition shadow-md">Save Schedule</button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-serif">Academy Schedules</h1>
          <p className="text-gray-500 text-sm">Manage training sessions, matches, and field allocations.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg transition text-sm font-medium shadow-sm ${isFilterOpen ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
            <Funnel size={18} /> Filters
          </button>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-target-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm">
            <Plus size={18} weight="bold" /> New Session
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3 animate-fade-in">
          <MagnifyingGlass className="text-gray-400" size={20} />
          <input type="text" placeholder="Search sessions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full text-sm outline-none bg-transparent" autoFocus />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-red-500"><X size={16} weight="bold" /></button>}
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center mb-8 overflow-x-auto gap-4">
        {weekDays.map((day) => {
          const isSelected = selectedDay === day.name;
          return (
            <button key={day.name} onClick={() => setSelectedDay(day.name)} className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-xl transition-all ${isSelected ? 'bg-[#0b132b] text-white shadow-md scale-105' : 'hover:bg-gray-50 text-gray-500'}`}>
              <span className={`text-xs font-bold uppercase mb-1 ${isSelected ? 'text-gray-300' : ''}`}>{day.name}</span>
              <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{day.date}</span>
            </button>
          )
        })}
      </div>

      {/* Sessions List */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 font-serif">Sessions for {selectedDay} <span className="text-sm text-gray-400 ml-2 font-sans">({filteredSessions.length} sessions)</span></h2>
      
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="flex justify-between items-start mb-4">
                
                {/* 🌟 التحكم في الحالة من هنا (Dropdown) 🌟 */}
                <div className="relative inline-block">
                  <select
                    value={session.status}
                    onChange={(e) => {
                      updateSessionStatus(session.id, e.target.value);
                      triggerAction(`Status updated to ${e.target.value}`);
                    }}
                    className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider outline-none cursor-pointer border appearance-none pr-6 ${getStatusColor(session.status)}`}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <CaretDown size={10} weight="bold" className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${session.status === 'In Progress' ? 'text-green-600' : session.status === 'Completed' ? 'text-gray-500' : 'text-blue-600'}`} />
                </div>

                <button onClick={() => { deleteSession(session.id); triggerAction('Session Canceled!'); }} className="text-gray-300 hover:text-red-600 transition p-1 hover:bg-red-50 rounded">
                  <Trash size={20} weight="fill" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{session.title}</h3>
              <p className="text-xs font-bold text-target-red mb-6">{session.type} Squad</p>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3"><Clock className="text-gray-400" size={18} /> {session.time}</div>
                <div className="flex items-center gap-3"><MapPin className="text-gray-400" size={18} /> {session.field}</div>
                <div className="flex items-center gap-3"><User className="text-gray-400" size={18} /> {session.coach}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <p className="text-gray-500 font-medium">No sessions scheduled for {selectedDay}.</p>
          <button onClick={openAddModal} className="text-target-red font-bold mt-2 hover:underline">Schedule one now</button>
        </div>
      )}
    </div>
  );
};

export default SchedulesView;