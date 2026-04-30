import { Bell, CaretDown, CheckCircle } from '@phosphor-icons/react';
import { useAuth } from '../../contexts/AuthContext'; 

const FamilyPortal = () => {
  const { user } = useAuth();
  
  // داتا وهمية للتجربة (Mock Data)
  const child = {
    name: "Ahmed Nagi",
    category: "Buds (6-9 yrs)",
    status: "Active",
    attendance: "8/10",
  };

  return (
    <div className="flex flex-col">
      
      {/* Top App Bar */}
      <header className="bg-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-sm z-10 sticky top-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Welcome back</h1>
            <h2 className="text-xl font-bold text-slate-800">Mr. {user?.name.split(' ')[0]}</h2>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition border border-slate-100">
            <Bell className="text-xl" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
          </button>
        </div>
        
        {/* Child Selector */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${child.name}&backgroundColor=f1f5f9`} alt="Child Avatar" className="w-12 h-12 rounded-xl bg-white shadow-sm" />
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-sm">{child.name}</h3>
            <p className="text-xs text-red-600 font-bold">{child.category} • {child.status}</p>
          </div>
          <CaretDown className="text-slate-400 mr-2" weight="bold" />
        </div>
      </header>

      {/* محتوى الصفحة */}
      <div className="p-6">
        
        {/* كارت الـ QR Code و الحضور */}
        <div className="bg-slate-900 rounded-3xl p-1 shadow-lg mb-6">
          <div className="bg-white rounded-[22px] p-6 flex flex-col items-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Training Pass</p>
            
            {/* مكان الـ QR Code */}
            <div className="w-40 h-40 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${child.name}`} alt="QR" className="w-32 h-32 opacity-90 rounded-xl" />
            </div>
            
            <div className="w-full flex justify-between items-center mt-2 px-2">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Attendance</p>
                <p className="font-bold text-slate-800 flex items-center gap-1 mt-1">
                  <CheckCircle weight="fill" className="text-emerald-500 text-lg" />
                  {child.attendance} Sessions
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Next Renewal</p>
                <p className="font-bold text-slate-800 mt-1">25 Oct</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FamilyPortal;