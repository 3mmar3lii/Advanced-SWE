import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AcademyContext } from '../../context/AcademyContext';
import { 
  CalendarBlank, 
  MapPin, 
  Clock, 
  SignOut, 
  Hexagon,
  Scan,
  UserCircle,
  TrendUp,
  ShieldCheck,
  CalendarStar
} from '@phosphor-icons/react';

// ✅ FIXED IMPORT
import { QRCode } from 'react-qr-code';

const FamilyPortal = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const { players, sessions, events } = useContext(AcademyContext);

  // 🔒 Guard
  if (!currentUser) return null;

  // ✅ SAFE DATA
  const safePlayers = players || [];
  const safeSessions = sessions || [];
  const safeEvents = events || [];

  // ✅ Optimized filtering
  const myAthletes = useMemo(() => {
    if (currentUser.role === 'PARENT') {
      return safePlayers.filter(p => p.parentEmail === currentUser.email);
    }
    return safePlayers.filter(p => 
      p.email === currentUser.email || p.name === currentUser.name
    );
  }, [safePlayers, currentUser]);

  // ✅ Safe schedule
  const getAthleteSchedule = (category) => {
    return safeSessions
      .filter(s => s.type === category && s.status !== 'Completed')
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">

      {/* HEADER */}
      <header className="bg-[#0b132b] text-white px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Hexagon weight="fill" className="text-red-500 text-2xl" />
          <span className="font-extrabold text-lg">Target Academy</span>
        </div>

        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="bg-white/10 hover:bg-white/20 p-2 md:px-4 rounded-lg flex items-center gap-2 text-sm font-bold"
        >
          <SignOut size={18} /> <span className="hidden md:block">Logout</span>
        </button>
      </header>

      {/* MAIN */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">
            Hello, {currentUser?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-gray-500 text-sm">
            Access your digital IDs, schedules, and academy events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-8">

            {myAthletes.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">

                {myAthletes.map((athlete) => {
                  const athleteSchedule = getAthleteSchedule(athlete.category);

                  return (
                    <div key={athlete.id} className="bg-white rounded-3xl shadow border flex flex-col overflow-hidden">

                      {/* HEADER */}
                      <div className="bg-red-600 p-5 flex justify-between items-center">
                        <div>
                          <h2 className="text-white font-bold text-lg">{athlete.name}</h2>
                          <p className="text-red-200 text-xs flex items-center gap-1">
                            <ShieldCheck size={14} /> {athlete.category}
                          </p>
                        </div>

                        <img 
                          src={athlete.avatar} 
                          className="w-14 h-14 rounded-xl object-cover bg-white" 
                          alt="avatar"
                        />
                      </div>

                      {/* QR */}
                      <div className="p-6 text-center bg-gray-50">
                        <p className="text-xs text-gray-400 mb-2 flex justify-center items-center gap-1">
                          <Scan size={14} /> Scan at Gate
                        </p>

                        <div className="bg-white p-3 inline-block rounded-xl">
                          <QRCode 
                            value={`ATTENDANCE:${athlete.id}`} 
                            size={120} 
                          />
                        </div>

                        <p className="text-xs text-gray-400 mt-2">
                          ID-{String(athlete.id).slice(0, 6).toUpperCase()}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div className="flex p-4 border-t">
                        <div className="flex-1">
                          <p className="text-xs text-gray-400">Status</p>
                          <p className={`font-bold ${athlete.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                            {athlete.status}
                          </p>
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            Performance <TrendUp size={12} />
                          </p>
                          <p className="font-bold text-red-500">
                            {athlete.rating || 0}%
                          </p>
                        </div>
                      </div>

                      {/* SCHEDULE */}
                      <div className="p-4">
                        <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                          <CalendarBlank size={14} /> Schedule
                        </h3>

                        {athleteSchedule.length > 0 ? (
                          athleteSchedule.map(session => (
                            <div key={session.id} className="bg-gray-50 p-3 rounded-lg mb-2 flex gap-3">

                              <Clock size={16} />

                              <div className="flex-1">
                                <p className="text-xs font-bold">{session.title}</p>
                                <p className="text-xs text-gray-500">
                                  {session.time} • {session.field}
                                </p>
                              </div>

                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 text-center">
                            No upcoming sessions
                          </p>
                        )}
                      </div>

                    </div>
                  );
                })}

              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl">
                <UserCircle size={60} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No Athletes Found</p>
              </div>
            )}

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">

            <h2 className="font-bold mb-4 flex items-center gap-2">
              <CalendarStar size={20} /> Events
            </h2>

            <div className="bg-white p-5 rounded-2xl">

              {safeEvents.length > 0 ? (
                safeEvents.map(event => (
                  <div key={event.id} className="flex gap-3 mb-4">

                    <div>
                      <p className="text-xs">{event.date?.month}</p>
                      <p className="font-bold">{event.date?.day}</p>
                    </div>

                    <div>
                      <p className="text-sm font-bold">{event.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={12} /> {event.location}
                      </p>
                    </div>

                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center">
                  No events available
                </p>
              )}

            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default FamilyPortal;