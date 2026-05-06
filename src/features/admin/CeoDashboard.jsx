import React, { useState, useContext, useEffect } from 'react';
import logoImg from '../../assets/hero.png';
import { useNavigate } from 'react-router-dom';
import { 
  Hexagon, SquaresFour, CalendarBlank, ChartLineUp, 
  Money, Users, ChalkboardTeacher, UsersThree, 
  SignOut, Bell, CalendarStar, CaretRight 
} from '@phosphor-icons/react';

// استدعاء الشاشات
import DashboardOverview from './views/DashboardOverview';
import SchedulesView from './views/SchedulesView';
import PerformanceView from './views/PerformanceView';
import FinancialsView from './views/FinancialsView';
import AthletesView from './views/AthletesView';
import CoachesView from '../admin/views/CoachesView';
import ParentsView from '../admin/views/ParentsView';
import EventsView from './views/EventsView'; // شاشة الإيفنتات الجديدة

// استدعاء السياق والبيانات
import { AuthContext } from '../../context/AuthContext';
import { seedFirebaseDatabase } from '../../seedData';

const CeoDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext); 
  
  // 1. حفظ واسترجاع التاب المفتوح
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('target_activeTab');
    return savedTab || 'Dashboard';
  });

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('target_activeTab', activeTab);
  }, [activeTab]);

  // حماية المسار
  useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser, navigate]);

  const triggerAction = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // قائمة التنقل الكاملة مع إضافة "Academy Events"
  const allNavItems = [
    { name: 'Dashboard', icon: SquaresFour },
    { name: 'Athletes', icon: Users },
    { name: 'Coaches', icon: ChalkboardTeacher },
    { name: 'Parents', icon: UsersThree },
    { name: 'Academy Events', icon: CalendarStar }, // الخيار الجديد
    { name: 'Schedules', icon: CalendarBlank },
    { name: 'Performance', icon: ChartLineUp },
    { name: 'Financials', icon: Money },
  ];

  // فلترة القائمة بناءً على الصلاحيات (RBAC)
  let allowedNavItems = allNavItems;
  if (currentUser?.role === 'CFO') {
    allowedNavItems = allNavItems.filter(item => 
      ['Dashboard', 'Financials', 'Performance'].includes(item.name)
    );
  }

  // التبديل بين الشاشات
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardOverview triggerAction={triggerAction} />;
      case 'Athletes': return <AthletesView triggerAction={triggerAction} />;
      case 'Coaches': return <CoachesView triggerAction={triggerAction} />;
      case 'Parents': return <ParentsView triggerAction={triggerAction} />;
      case 'Academy Events': return <EventsView triggerAction={triggerAction} />;
      case 'Schedules': return <SchedulesView triggerAction={triggerAction} />;
      case 'Performance': return <PerformanceView triggerAction={triggerAction} />;
      case 'Financials': return <FinancialsView triggerAction={triggerAction} />;
      default: return <DashboardOverview triggerAction={triggerAction} />;
    }
  };

  if (!currentUser) return null; 

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-target-red p-2 rounded-full flex items-center justify-center">
            <Bell weight="fill" size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0b132b] text-gray-300 flex flex-col h-full z-30 shadow-2xl">
        {/* Branding */}
        <div className="p-8 flex items-center gap-4">
          <div className="bg-target-red p-2.5 rounded-xl shadow-lg shadow-red-500/20">
            <Hexagon weight="fill" className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-white font-black text-xl tracking-tighter uppercase">Target</h2>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] -mt-1">Academy OS</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 pl-2 opacity-50">Management</p>
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 group ${
                  isActive 
                    ? 'bg-target-red text-white shadow-xl shadow-red-500/20 translate-x-1' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} weight={isActive ? "fill" : "bold"} className={isActive ? "text-white" : "text-gray-500 group-hover:text-white"} />
                  {item.name}
                </div>
                {isActive && <CaretRight weight="bold" size={12} />}
              </button>
            );
          })}
        </nav>
        
        {/* Footer Actions */}
        <div className="p-6 space-y-3 border-t border-white/5">
          <button 
            onClick={seedFirebaseDatabase} 
            className="w-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-3 rounded-xl transition-all shadow-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            🚀 Seed Demo Data
          </button>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 py-3 text-gray-500 hover:text-target-red transition-colors text-xs font-black uppercase tracking-widest"
          >
            <SignOut size={18} weight="bold" /> Sign Out System
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md px-10 py-5 flex justify-between items-center border-b border-gray-100 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-target-red rounded-full"></div>
            <h3 className="font-black text-gray-900 text-lg tracking-tight uppercase">{activeTab}</h3>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 bg-gray-50 text-gray-400 rounded-full hover:text-target-red transition-colors relative">
              <Bell size={20} weight="bold" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-target-red rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 leading-none mb-1">{currentUser.name}</p>
                <p className="text-[10px] text-target-red font-black uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md inline-block">
                  {currentUser.role}
                </p>
              </div>
              <img 
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}`} 
                alt="Profile" 
                className="w-11 h-11 rounded-2xl border-2 border-gray-50 shadow-md object-cover" 
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#f8fafc] custom-scrollbar">
          <div className="max-w-[1500px] mx-auto">
            {renderActiveTab()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CeoDashboard;