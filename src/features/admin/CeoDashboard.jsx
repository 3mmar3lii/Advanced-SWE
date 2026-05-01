import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, SquaresFour, CalendarBlank, ChartLineUp, Money, Users, ChalkboardTeacher, UsersThree, Plus, SignOut, Bell, Gear, X } from '@phosphor-icons/react';
import KpiCard from '../../components/common/KpiCard';
// استدعاء الشاشات والـ Contexts
import DashboardOverview from './views/DashboardOverview';
import SchedulesView from './views/SchedulesView';
import PerformanceView from './views/PerformanceView';
import FinancialsView from './views/FinancialsView';
import AthletesView from './views/AthletesView';
import { AuthContext } from '../../context/AuthContext';

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
      case 'Schedules': return <SchedulesView triggerAction={triggerAction} />;
      case 'Performance': return <PerformanceView triggerAction={triggerAction} />;
      case 'Financials': return <FinancialsView triggerAction={triggerAction} />;
      default: return <div className="text-center p-20 text-gray-400">Module Under Construction</div>;
    }
  };

  // لو الداتا لسه بتحمل عشان ميديناش ايرور
  if (!currentUser) return null; 

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <div className="bg-target-red p-1.5 rounded-full"><Bell weight="bold" className="text-white" /></div>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-[260px] bg-[#0b132b] text-gray-300 flex flex-col h-full flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-target-red p-2 rounded-lg"><Hexagon weight="fill" className="text-white text-xl" /></div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Target Academy</h2>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive ? 'bg-target-red text-white shadow-lg shadow-red-500/20' : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={20} weight={isActive ? "fill" : "regular"} /> {item.name}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition text-sm font-bold">
            <SignOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white px-8 py-4 flex justify-between items-center border-b border-gray-100 sticky top-0 z-10">
          <div className="text-sm text-gray-500">
            Academy Overview <span className="mx-2">›</span> <span className="font-bold text-gray-900">{activeTab}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right">
                {/* هنا بنطبع اسم المستخدم ودوره من قاعدة البيانات */}
                <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{currentUser.role}</p>
              </div>
              {/* وهنا صورته */}
              <img src={currentUser.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover object-top border-2 border-gray-100 shadow-sm"  />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
};

export default CeoDashboard;