import React from 'react';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  ChatTeardropText, 
  ArrowRight, 
  DownloadSimple, 
  Plus, 
  Phone, 
  Info,
  Clock,
  MapPin,
  CaretRight,
  ChartLineUp,
  Star
} from '@phosphor-icons/react';

const FamilyPortal = () => {
  // Mock Data
  const familyMembers = [
    {
      id: 1,
      name: 'Leo',
      program: 'JUNIORS ELITE',
      nextTraining: {
        day: 'Tomorrow',
        time: '4:30 PM',
        location: 'Court 4 • Coach Marcus',
        icon: <Clock size={14} className="text-target-red" />
      },
      attendance: '94%',
      performance: 'A+',
      avatar: 'https://i.pinimg.com/736x/aa/dc/28/aadc28262c69a6414334e488c1fc17e9.jpg'
    },
    {
      id: 2,
      name: 'Mia',
      program: 'FLOWERS PROGRAM',
      nextTraining: {
        day: 'Wed, 3:00 PM',
        time: '',
        location: 'Main Hall • Coach Sarah',
        icon: <Clock size={14} className="text-target-red" />
      },
      attendance: '89%',
      performance: 'B',
      avatar: 'https://i.pinimg.com/736x/56/54/ce/5654ce741046c3299bfedb51f8f187bb.jpg'
    }
  ];

  const events = [
    { id: 1, date: { day: '12', month: 'SEP' }, title: 'Academy Activity Day', location: 'Central Park West • 10:00 AM', tag: 'ALL AGES' },
    { id: 2, date: { day: '24', month: 'SEP' }, title: 'Elite Regional Cup', location: 'Victory Stadium • 08:30 AM', tag: 'PARTICIPANTS' },
    { id: 3, date: { day: '05', month: 'OCT' }, title: 'Nutrition Workshop', location: 'Academy Hall • 06:00 PM', tag: 'PARENTS ONLY' }
  ];

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#0f2042] font-sans pb-12">
      {/* Top Navigation / Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-1 md:mb-2 text-center md:text-left">Family Portal</h1>
            <p className="text-sm md:text-base text-gray-500 font-medium text-center md:text-left">Managing activities for the Henderson Family</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="bg-[#e11d48] hover:bg-red-700 text-white px-5 py-3 md:py-2.5 rounded-xl md:rounded-lg font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2">
              <Plus weight="bold" /> Add Family Member
            </button>
            <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-3 md:py-2.5 rounded-xl md:rounded-lg font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2">
              <DownloadSimple weight="bold" /> Schedule
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (Left/Middle) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Family Members Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {familyMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer">
                  <div className="absolute top-0 left-0 w-1 h-full bg-target-red opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full object-cover object-top border-2 border-gray-50" />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">{member.program}</p>
                      </div>
                    </div>
                    <CaretRight size={20} className="text-gray-300 group-hover:text-target-red transition-colors" />
                  </div>

                  <div className="bg-[#f0f4ff] rounded-xl p-4 mb-6">
                    <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase mb-2">Next Training</p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar size={18} className="text-target-red" weight="fill" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{member.nextTraining.day} {member.nextTraining.time}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{member.nextTraining.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">Attendance</p>
                      <p className="text-lg font-black text-target-navy">{member.attendance}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">Performance</p>
                      <p className="text-lg font-black text-red-500">{member.performance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="bg-[#0f2042] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
                <CreditCard size={120} weight="fill" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 text-center md:text-left">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2">Financial Summary</h2>
                    <p className="text-blue-200 text-xs md:text-sm font-medium">All subscriptions are up to date and active.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="bg-[#e11d48] hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md">
                      Manage Payments
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm transition-all backdrop-blur-sm">
                      View Invoices
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-around md:justify-start gap-6 md:gap-12 text-center md:text-left border-t border-white/10 pt-6 md:border-0 md:pt-0">
                  <div>
                    <p className="text-[9px] md:text-[10px] font-bold text-blue-300 tracking-widest uppercase mb-1">Monthly Total</p>
                    <p className="text-2xl md:text-3xl font-black">$240.00</p>
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-bold text-blue-300 tracking-widest uppercase mb-1">Next Billing</p>
                    <p className="text-2xl md:text-3xl font-black text-blue-400 uppercase">Oct 01</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner and Feedback Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Promo Banner */}
              <div className="relative h-full min-h-[200px] md:min-h-[220px] rounded-3xl overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-700 text-white p-6 md:p-8 flex flex-col justify-end shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800" 
                  alt="Athlete" 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
                />
                <div className="relative z-10">
                  <p className="text-[9px] md:text-[10px] font-bold text-emerald-200 tracking-widest uppercase mb-2">Season Progress</p>
                  <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 leading-tight">The Path to Elite</h3>
                  <button className="bg-white text-emerald-800 w-full sm:w-auto px-6 py-2.5 rounded-xl md:rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors shadow-sm">
                    View Analytics
                  </button>
                </div>
              </div>

              {/* Recent Feedback */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  Recent Feedback
                </h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <Star size={20} weight="fill" className="text-target-red" />
                    </div>
                    <div>
                      <p className="text-sm font-bold mb-1">Coach Marcus (Leo)</p>
                      <p className="text-xs text-gray-500 italic leading-relaxed">
                        "Leo showed exceptional spatial awareness in today's scrimmage. Great footwork development."
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <Star size={20} weight="fill" className="text-target-red" />
                    </div>
                    <div>
                      <p className="text-sm font-bold mb-1">Coach Sarah (Mia)</p>
                      <p className="text-xs text-gray-500 italic leading-relaxed">
                        "Mia is really coming out of her shell. Her team communication has improved 200% this week!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Family Events */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Family Events</h3>
                <Calendar size={24} className="text-target-red" />
              </div>

              <div className="space-y-8">
                {events.map((event) => (
                  <div key={event.id} className="flex gap-5 items-start group cursor-pointer">
                    <div className="flex flex-col items-center justify-center min-w-[50px] h-[60px] bg-gray-50 rounded-xl group-hover:bg-red-50 transition-colors">
                      <p className="text-[10px] font-bold text-gray-400 group-hover:text-target-red">{event.date.month}</p>
                      <p className="text-xl font-black text-target-navy group-hover:text-target-red">{event.date.day}</p>
                    </div>
                    <div className="flex-1 border-b border-gray-50 pb-4 group-last:border-0">
                      <h4 className="text-sm font-bold mb-1 group-hover:text-target-red transition-colors">{event.title}</h4>
                      <p className="text-[11px] text-gray-500 font-medium mb-2">{event.location}</p>
                      <span className="text-[9px] font-black bg-gray-100 text-gray-400 px-2 py-1 rounded-md uppercase tracking-tighter">
                        {event.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 text-sm font-bold text-target-red hover:underline border-t border-gray-50">
                View All Calendar
              </button>
            </div>

            {/* Academy Contact */}
            <div className="bg-[#eef2ff] rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase mb-2">Academy Contact</p>
                <h3 className="text-lg font-bold mb-4">Facing issues with scheduling?</h3>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                    <Phone size={18} weight="fill" />
                  </div>
                  <p className="text-sm font-bold">+1 (555) 012-3456</p>
                </div>
                <button className="text-xs font-bold text-target-red flex items-center gap-2 hover:gap-3 transition-all">
                  Contact Registrar <ArrowRight weight="bold" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyPortal;