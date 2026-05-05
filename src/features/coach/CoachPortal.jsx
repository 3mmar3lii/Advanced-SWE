import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AcademyContext } from '../../context/AcademyContext';
import { MagnifyingGlass, Bell, Gear, CaretRight, Circle, Clock, Hexagon } from '@phosphor-icons/react';

const CoachPortal = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const { sessions } = useContext(AcademyContext);

  if (!currentUser) return null;

  // التاريخ الحالي
  const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      
      {/* 1. Header (Top Navigation) */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        
        {/* اللوجو والروابط */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <Hexagon weight="fill" className="text-target-red text-2xl" />
            <span className="font-extrabold text-xl text-target-navy tracking-tight">Target Academy</span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-500">
            <a href="#" className="text-target-red border-b-2 border-target-red pb-1">Home</a>
            <a href="#" className="hover:text-gray-900 transition pb-1">Programs</a>
            <a href="#" className="hover:text-gray-900 transition pb-1">About</a>
            <a href="#" className="hover:text-gray-900 transition pb-1">Contact</a>
          </nav>
        </div>

        {/* البحث وملف المستخدم */}
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search sessions..." 
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

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full p-8">
        
        {/* Welcome Section & Badges */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-serif tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-gray-500">Here is the latest data on your Elite Squad performance.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-red-50 rounded-xl p-4 min-w-[140px]">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Team Status</p>
              <p className="text-target-red font-bold text-sm flex items-center gap-2">
                <Circle weight="fill" size={10} /> Peak Condition
              </p>
            </div>
            <div className="bg-[#eff2f6] rounded-xl p-4 min-w-[140px]">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Date</p>
              <p className="text-gray-900 font-bold text-sm">{todayDate}</p>
            </div>
          </div>
        </div>

        {/* Top Grid (Schedule + Radar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Training Schedule */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="text-target-red" size={24} weight="duotone" /> Training Schedule
              </h2>
              <button className="text-target-red text-sm font-bold hover:underline">View all Calendar</button>
            </div>

            <div className="space-y-4">
              {/* Session 1 */}
              <div className="flex items-center bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition cursor-pointer border-l-4 border-target-red">
                <div className="px-4 text-center border-r border-gray-200 min-w-[80px]">
                  <p className="text-xl font-extrabold text-gray-900">10:00</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">AM</p>
                </div>
                <div className="px-6 flex-1">
                  <h3 className="font-bold text-gray-900">Elite Tactical Drill</h3>
                  <p className="text-xs text-gray-500">Main Pitch • Advanced Squad</p>
                </div>
                <div className="flex items-center gap-4 pr-2">
                  <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/150?img=12" className="w-8 h-8 rounded-full border-2 border-white" alt="player" />
                    <img src="https://i.pravatar.cc/150?img=13" className="w-8 h-8 rounded-full border-2 border-white" alt="player" />
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 z-10">+14</div>
                  </div>
                  <CaretRight size={20} className="text-gray-400" />
                </div>
              </div>

              {/* Session 2 */}
              <div className="flex items-center bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition cursor-pointer border-l-4 border-gray-900">
                <div className="px-4 text-center border-r border-gray-200 min-w-[80px]">
                  <p className="text-xl font-extrabold text-gray-900">02:30</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">PM</p>
                </div>
                <div className="px-6 flex-1">
                  <h3 className="font-bold text-gray-900">Recovery & Stretching</h3>
                  <p className="text-xs text-gray-500">Wellness Zone • All Participants</p>
                </div>
                <div className="flex items-center gap-4 pr-2">
                  <span className="bg-red-100 text-target-red text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Mandatory</span>
                  <CaretRight size={20} className="text-gray-400" />
                </div>
              </div>

              {/* Session 3 */}
              <div className="flex items-center bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition cursor-pointer border-l-4 border-gray-300">
                <div className="px-4 text-center border-r border-gray-200 min-w-[80px]">
                  <p className="text-xl font-extrabold text-gray-400">04:00</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">PM</p>
                </div>
                <div className="px-6 flex-1">
                  <h3 className="font-bold text-gray-500">Goalkeeper Specifics</h3>
                  <p className="text-xs text-gray-400">Zone B • GK Squad</p>
                </div>
                <div className="flex items-center gap-4 pr-2">
                  <CaretRight size={20} className="text-gray-300" />
                </div>
              </div>

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
                <text x="100" y="20" fill="#666" fontSize="10" textAnchor="middle">SPEED</text>
                <text x="185" y="60" fill="#666" fontSize="10">SHOOTING</text>
                <text x="185" y="150" fill="#666" fontSize="10">PASSING</text>
                <text x="100" y="185" fill="#666" fontSize="10" textAnchor="middle">DEFENDING</text>
                <text x="15" y="150" fill="#666" fontSize="10" textAnchor="end">DRIBBLING</text>
                <text x="15" y="60" fill="#666" fontSize="10" textAnchor="end">PACE</text>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Peak Metric</p>
                <p className="text-xl font-bold text-target-red">92% <span className="text-xs text-gray-500 font-normal">Agility</span></p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Improvement</p>
                <p className="text-xl font-bold text-green-500">+12% <span className="text-xs text-gray-500 font-normal">vs Last Month</span></p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Grid (Attendance Track) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-gray-900 font-serif">Attendance Track</h2>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                <span className="flex items-center gap-2"><Circle weight="fill" className="text-target-red" size={10} /> Present</span>
                <span className="flex items-center gap-2"><Circle weight="fill" className="text-gray-200" size={10} /> Absent</span>
              </div>
              <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 outline-none text-sm font-medium">
                <option>Last 30 Days</option>
                <option>This Week</option>
              </select>
            </div>
          </div>
          
          <div className="h-[200px] flex items-end justify-between px-4 pb-2 border-b border-gray-100">
             {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
               <span key={day} className="text-[10px] font-bold text-gray-400 tracking-widest">{day}</span>
             ))}
          </div>
        </div>

      </main>

      <footer className="mt-auto px-8 py-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center bg-[#f8fafc]">
        <div className="mb-4 md:mb-0">
          <h4 className="font-extrabold text-gray-900 text-sm mb-1">Target Academy</h4>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">© 2026 TARGET ACADEMY. ELITE PERFORMANCE FOR ALL.</p>
        </div>
        <div className="flex gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-target-red transition">Privacy Policy</a>
          <a href="#" className="hover:text-target-red transition">Terms of Service</a>
          <a href="#" className="hover:text-target-red transition">Coaching Staff</a>
          <a href="#" className="hover:text-target-red transition">Careers</a>
        </div>
      </footer>

    </div>
  );
};

export default CoachPortal;