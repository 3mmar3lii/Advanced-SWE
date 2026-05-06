import React, { useContext, useState } from 'react';
import { AcademyContext } from '../../../context/AcademyContext';
import { CalendarBlank, Clock, MapPin, UserCircle, Plus } from '@phosphor-icons/react';

const SchedulesView = ({ triggerAction }) => {
  // سحب التمارين الحقيقية من فايربيس
  const { sessions } = useContext(AcademyContext);
  const [filter, setFilter] = useState('All');

  // فلترة التمارين حسب الحالة
  const filteredSessions = sessions.filter(session => {
    if (filter === 'All') return true;
    return session.status === filter;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-serif">Master Schedule</h1>
          <p className="text-gray-500 text-sm">Manage all academy training sessions across all squads.</p>
        </div>
        
        <div className="flex gap-2">
          {['All', 'Upcoming', 'Completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === f ? 'bg-[#0b132b] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map(session => {
            const isCompleted = session.status === 'Completed';
            
            return (
              <div key={session.id} className={`bg-white rounded-2xl p-6 border transition-all ${isCompleted ? 'border-gray-200 opacity-75' : 'border-gray-100 shadow-sm hover:shadow-md border-l-4 border-l-target-red'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-target-red'}`}>
                    {session.status || 'Upcoming'}
                  </span>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">{session.type}</span>
                </div>
                
                <h3 className={`font-bold text-lg mb-4 ${isCompleted ? 'text-gray-600' : 'text-gray-900'}`}>{session.title}</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={18} className={isCompleted ? "text-gray-400" : "text-target-red"} /> 
                    <span className="font-medium">{session.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={18} className="text-gray-400" /> 
                    {session.field}
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 border-t border-gray-100 pt-3 mt-3">
                    <UserCircle size={18} className="text-gray-400" /> 
                    <span className="font-bold">{session.coach}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
          <CalendarBlank size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Sessions Found</h3>
          <p className="text-gray-500">There are no {filter.toLowerCase()} training sessions scheduled.</p>
        </div>
      )}
    </div>
  );
};

export default SchedulesView;