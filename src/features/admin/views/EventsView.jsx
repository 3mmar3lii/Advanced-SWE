import React, { useContext, useState } from 'react';
import { AcademyContext } from '../../../context/AcademyContext';
import { CalendarStar, MapPin, Plus } from '@phosphor-icons/react';

const EventsView = () => {
  const { events, addEvent } = useContext(AcademyContext);
  const [newEvent, setNewEvent] = useState({ day: '', month: '', title: '', location: '', tag: 'ALL AGES' });

  const handleAddEvent = async (e) => {
    e.preventDefault();
    await addEvent({ 
      date: { day: newEvent.day, month: newEvent.month }, 
      title: newEvent.title, 
      location: newEvent.location, 
      tag: newEvent.tag 
    });
    setNewEvent({ day: '', month: '', title: '', location: '', tag: 'ALL AGES' }); // تفريغ الفورمة
  };

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Form Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2 font-serif flex items-center gap-2">
          <Plus className="text-target-red" weight="bold" /> Add New Event
        </h2>
        <p className="text-gray-500 text-sm mb-6">Events added here will immediately appear on the Family Portal.</p>
        
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Day (e.g. 24)</label>
              <input type="text" value={newEvent.day} onChange={e => setNewEvent({...newEvent, day: e.target.value})} className="w-full mt-1 p-3 border rounded-xl" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Month (e.g. SEP)</label>
              <input type="text" value={newEvent.month} onChange={e => setNewEvent({...newEvent, month: e.target.value})} className="w-full mt-1 p-3 border rounded-xl" required />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Event Title</label>
            <input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full mt-1 p-3 border rounded-xl" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Location & Time</label>
            <input type="text" placeholder="Main Stadium • 10:00 AM" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full mt-1 p-3 border rounded-xl" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Tag (e.g. PARENTS ONLY)</label>
            <input type="text" value={newEvent.tag} onChange={e => setNewEvent({...newEvent, tag: e.target.value})} className="w-full mt-1 p-3 border rounded-xl" required />
          </div>
          <button type="submit" className="w-full bg-[#0b132b] text-white font-bold py-4 rounded-xl hover:bg-black transition mt-4">Publish Event</button>
        </form>
      </div>

      {/* Live Preview Section */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 font-serif">Live Events</h2>
        <div className="space-y-4">
          {events?.map((event) => (
            <div key={event.id} className="flex gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm items-center">
              <div className="flex flex-col items-center justify-center min-w-[60px] h-[65px] bg-red-50 rounded-xl">
                <p className="text-[10px] font-bold text-target-red">{event.date.month}</p>
                <p className="text-xl font-black text-gray-900">{event.date.day}</p>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{event.title}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {event.location}</p>
                <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase tracking-widest mt-2 inline-block">
                  {event.tag}
                </span>
              </div>
            </div>
          ))}
          {events?.length === 0 && <p className="text-gray-400 text-sm italic">No events published yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default EventsView;