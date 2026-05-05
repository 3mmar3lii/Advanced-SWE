import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, SquaresFour, CalendarBlank, ChartLineUp, Money, Users, ChalkboardTeacher, UsersThree, Plus, SignOut, Bell, Gear, X, CaretRight } from '@phosphor-icons/react';
import KpiCard from '../../components/common/KpiCard';
// استدعاء الشاشات والـ Contexts
import DashboardOverview from './views/DashboardOverview';
import SchedulesView from './views/SchedulesView';
import PerformanceView from './views/PerformanceView';
import FinancialsView from './views/FinancialsView';
import AthletesView from './views/AthletesView';
import { AuthContext } from '../../context/AuthContext';
import CoachesView from '../admin/views/CoachesView';
import ParentsView from '../admin/views/ParentsView';

const CeoDashboard = () => {
const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext); 
  
  // 1. استدعاء آخر شاشة كنت فاتحها من المتصفح، ولو مفيش يفتح الـ Dashboard
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('target_activeTab');
    return savedTab || 'Dashboard';
  });

  // 2. حفظ الشاشة في المتصفح فوراً أول ما تقلب بين القوائم
  useEffect(() => {
    localStorage.setItem('target_activeTab', activeTab);
  }, [activeTab]);

  const [toastMessage, setToastMessage] = useState('');

  // لو مفيش حد عامل لوجين، ارجعه لصفحة التسجيل فوراً
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

  // قائمة التنقل الكاملة
  const allNavItems = [
    { name: 'Dashboard', icon: SquaresFour },
    { name: 'Athletes', icon: Users },
    { name: 'Coaches', icon: ChalkboardTeacher },
    { name: 'Parents', icon: UsersThree },
    { name: 'Schedules', icon: CalendarBlank },
    { name: 'Performance', icon: ChartLineUp },
    { name: 'Financials', icon: Money },
  ];

  // ===============================================
  // فلترة القائمة بناءً على صلاحيات المستخدم (RBAC)
  // ===============================================
  let allowedNavItems = allNavItems;
  if (currentUser?.role === 'CFO') {
    // الـ CFO بيشوف الداشبورد والماليات والأداء بس
    allowedNavItems = allNavItems.filter(item => ['Dashboard', 'Financials', 'Performance'].includes(item.name));
  }

const renderActiveTab = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardOverview triggerAction={triggerAction} />;
      case 'Athletes': return <AthletesView triggerAction={triggerAction} />;
      case 'Coaches': return <CoachesView triggerAction={triggerAction} />; // ضفنا سطر المدربين
      case 'Parents': return <ParentsView triggerAction={triggerAction} />; // ضفنا سطر الأهالي
      case 'Schedules': return <SchedulesView triggerAction={triggerAction} />;
      case 'Performance': return <PerformanceView triggerAction={triggerAction} />;
      case 'Financials': return <FinancialsView triggerAction={triggerAction} />;
      default: return <div className="text-center p-20 text-gray-400">Module Under Construction</div>;
    }
  };

  // لو الداتا لسه بتحمل عشان ميديناش ايرور
  if (!currentUser) return null; 

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900/90 backdrop-blur-lg text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-target-red p-1.5 rounded-full shadow-lg shadow-red-500/40"><Bell weight="bold" className="text-white" /></div>
          <span className="font-bold text-sm tracking-tight">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0b132b] text-gray-300 flex flex-col h-full flex-shrink-0 z-50 shadow-2xl relative">
        {/* Sidebar Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
        
        <div className="p-8 flex items-center gap-4 relative z-10">
          <div className="bg-target-red p-2.5 rounded-2xl shadow-lg shadow-red-500/20 rotate-3 transition-transform hover:rotate-0"><Hexagon weight="fill" className="text-white text-2xl" /></div>
          <div>
            <h2 className="text-white font-black text-xl leading-tight tracking-tighter">Target <span className="text-target-red">Academy</span></h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Management Suite</p>
          </div>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-1.5 overflow-y-auto relative z-10 custom-scrollbar">
          <div className="px-4 py-2 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Main Navigation</div>
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                  isActive 
                    ? 'bg-target-red text-white shadow-xl shadow-red-500/20 scale-[1.02]' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={22} weight={isActive ? "fill" : "bold"} className={isActive ? "scale-110" : "group-hover:scale-110 transition-transform"} /> 
                <span className="tracking-tight">{item.name}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-white/5 relative z-10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-500/10 hover:text-red-500 text-gray-500 rounded-2xl transition-all duration-300 text-sm font-black uppercase tracking-widest active:scale-95">
            <SignOut size={20} weight="bold" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white/50 relative">
        {/* Sticky Header with Glassmorphism */}
        <header className="bg-white/80 backdrop-blur-xl px-10 py-5 flex justify-between items-center border-b border-gray-100 sticky top-0 z-40 transition-all duration-300 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-1 h-8 bg-gray-100 rounded-full"></div>
             <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                Academy Overview <CaretRight size={12} weight="bold" /> <span className="text-gray-900 font-black">{activeTab}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 group-hover:text-target-red transition-colors">{currentUser.name}</p>
                <div className="flex items-center justify-end gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{currentUser.role}</p>
                </div>
              </div>
              <div className="relative">
                <img src={currentUser.avatar} alt="Profile" className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl group-hover:scale-105 transition-transform" />
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-gray-100"><Gear size={12} className="text-gray-400" /></div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar scroll-smooth">
          <div className="max-w-[1400px] mx-auto w-full">
            {renderActiveTab()}
          </div>
          
          {/* Footer inside scroll area for better modern feel */}
          <footer className="mt-20 py-10 border-t border-gray-100 text-center">
             <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">© 2026 Target Academy • Elite Performance Suite</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default CeoDashboard;