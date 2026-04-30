import { Outlet, NavLink } from 'react-router-dom';
import { House, CalendarBlank, ChartPolar, User } from '@phosphor-icons/react';

const PortalLayout = () => {
  return (
    // الخلفية الغامقة دي عشان لو فتحت من الكمبيوتر يبان إنه موبايل في النص
    <div className="bg-slate-800 min-h-screen flex justify-center font-sans">
      
      {/* حاوية الموبايل (Mobile Container) */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl flex flex-col overflow-hidden">
        
        {/* المكان اللي هتتعرض فيه الصفحات (Home, Schedule, etc...) */}
        {/* اخفينا الـ scrollbar عشان يدي إحساس الـ Native App */}
        <main className="flex-1 overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet />
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="bg-white border-t border-slate-100 absolute bottom-0 w-full px-6 py-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
          <ul className="flex justify-between items-center">
            <NavItem to="/portal" icon={<House weight="fill" className="text-2xl" />} label="Home" />
            <NavItem to="/portal/schedule" icon={<CalendarBlank className="text-2xl" />} label="Schedule" />
            <NavItem to="/portal/progress" icon={<ChartPolar className="text-2xl" />} label="Progress" />
            <NavItem to="/portal/profile" icon={<User className="text-2xl" />} label="Profile" />
          </ul>
        </nav>

      </div>
    </div>
  );
};

// كومبوننت صغير للزراير اللي تحت عشان الكود يكون نظيف
const NavItem = ({ to, icon, label }) => (
  <li>
    {/* NavLink بتعرف لوحدها إذا كان اللينك Active ولا لأ عشان نغير لونه */}
    <NavLink 
      to={to}
      end
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 transition-colors ${
          isActive ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'
        }`
      }
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </NavLink>
  </li>
);

export default PortalLayout;