import React, { useState, useContext, useEffect } from 'react';
import { DownloadSimple, TrendUp, Crosshair, Heartbeat, Trophy, Star, User, ChartBar, Lightning, Circle } from '@phosphor-icons/react';
import { AcademyContext } from '../../../context/AcademyContext';
import KpiCard from '../../../components/common/KpiCard';

const PerformanceView = ({ triggerAction }) => {
  const { players: contextPlayers } = useContext(AcademyContext);
  const [isExporting, setIsExporting] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // 1. Get players from Firebase (via Context) with intelligent fallback
  const players = contextPlayers.length > 0 
    ? contextPlayers.map(p => ({
        id: p.id || Math.random().toString(),
        name: p.name || 'Unknown Athlete',
        category: p.category || 'General',
        status: p.status || 'Active',
        rating: p.rating || (90 - (contextPlayers.indexOf(p) * 2)), // Fallback rating based on index
        avatar: p.avatar || `https://ui-avatars.com/api/?name=${(p.name || 'U').replace(' ', '+')}&background=random`
      }))
    : [
        { id: '1', name: 'Zaid Al-Harbi', category: 'Elite Squad', status: 'Active', rating: 94, avatar: 'https://i.pravatar.cc/150?img=11' },
        { id: '2', name: 'Omar Yassin', category: 'Under 16', status: 'Active', rating: 88, avatar: 'https://i.pravatar.cc/150?img=12' },
        { id: '3', name: 'Sarah Ahmed', category: 'Advanced', status: 'Active', rating: 91, avatar: 'https://i.pravatar.cc/150?img=5' },
        { id: '4', name: 'Yousef Mansour', category: 'Elite Squad', status: 'Active', rating: 85, avatar: 'https://i.pravatar.cc/150?img=13' },
      ];

  // Fetch metrics from MongoDB via Express API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/metrics');
        const res = await response.json();
        if (res.success) {
          // Filter to only show Performance category to keep it clean
          setMetrics(res.data.filter(m => m.category === 'Performance'));
        }
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();
  }, []);

  const handleExportAnalytics = () => {
    setIsExporting(true);
    triggerAction('Compiling Player Analytics...');
    setTimeout(() => {
      setIsExporting(false);
      triggerAction('Analytics Report Downloaded!');
    }, 1500);
  };

  return (
    <div className="animate-fade-in space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight font-serif">
            Performance <span className="text-target-red">Matrix</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-md">Real-time technical KPIs and squad progression analytics powered by MongoDB.</p>
        </div>
        
        <button 
          onClick={handleExportAnalytics} 
          disabled={isExporting}
          className={`group flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-bold shadow-lg shadow-red-500/10 ${isExporting ? 'bg-gray-800 text-gray-400' : 'bg-[#0b132b] text-white hover:bg-black active:scale-95'}`}
        >
          <DownloadSimple size={22} className={isExporting ? "animate-bounce" : "group-hover:translate-y-0.5 transition-transform"} /> 
          {isExporting ? 'Compiling...' : 'Export Intelligence'}
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Avg Progression" value="+14.5%" subtext="Technical Gain" subtextIcon={TrendUp} mainIcon={Lightning} />
        <KpiCard title="Tactical Accuracy" value="88%" subtext="Team Synergy" subtextColor="text-blue-500" mainIcon={Crosshair} />
        <KpiCard title="Fitness Level" value="Elite" subtext="Squad Baseline" subtextColor="text-target-red" mainIcon={Heartbeat} />
        <KpiCard title="Pro Signings" value="12" subtext="Pathways Realized" subtextColor="text-yellow-500" mainIcon={Trophy} />
      </div>

      {/* Matrix Section */}
      <section className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 relative z-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1 flex items-center gap-3">
              <ChartBar weight="fill" className="text-target-red" /> Daily Metrics Grid
            </h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Active Performance tracking • Weekly View</p>
          </div>
          <div className="flex p-1 bg-gray-100 rounded-xl">
             <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-xs font-bold text-gray-900">Weekly</button>
             <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition">Monthly</button>
          </div>
        </div>

        {loadingMetrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 animate-pulse">
            {[...Array(7)].map((_, i) => <div key={i} className="h-44 bg-gray-100 rounded-3xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 relative z-10">
            {metrics.map((m) => (
              <div 
                key={m._id} 
                className="group relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-50 group-hover:bg-target-red/20 transition-colors"></div>
                
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 group-hover:text-target-red transition-colors">{m.name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-gray-900 group-hover:scale-110 transition-transform origin-left inline-block">{m.value}</span>
                  <span className="text-xs font-bold text-gray-400">%</span>
                </div>
                
                <div className="relative h-20 w-full flex items-end gap-1">
                   {[...Array(5)].map((_, i) => (
                     <div 
                       key={i} 
                       className={`flex-1 rounded-full transition-all duration-700`}
                       style={{ 
                         height: `${m.value * (0.6 + (i * 0.1))}%`,
                         backgroundColor: i === 4 ? '#bd103b' : '#f1f5f9',
                         opacity: 0.3 + (i * 0.15)
                       }}
                     ></div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top Performers Section */}
      <section className="bg-[#0b132b] rounded-[2.5rem] p-10 shadow-2xl text-white overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-target-red/10 to-transparent opacity-50"></div>
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-1 font-serif">Top Performers</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Player Intelligence Board</p>
          </div>
          <Trophy size={40} weight="duotone" className="text-target-red opacity-50" />
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] border-b border-white/5">
                <th className="pb-6 px-4">Athlete Intelligence</th>
                <th className="pb-6 px-4">Specialization</th>
                <th className="pb-6 px-4">Efficiency</th>
                <th className="pb-6 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {players.map((player, idx) => (
                <tr key={player.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-6 px-4 flex items-center gap-5">
                    <div className="relative">
                       <img src={player.avatar} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 group-hover:border-target-red transition-colors shadow-lg" alt="" />
                       {idx === 0 && <div className="absolute -top-2 -right-2 bg-yellow-500 p-1 rounded-lg shadow-lg"><Star weight="fill" size={12} className="text-white" /></div>}
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-none mb-1 group-hover:text-target-red transition-colors">{player.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">ID: {player.id.slice(0, 8)}</p>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">{player.category}</span>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-48 bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-target-red to-red-400 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${player.rating || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-black">{player.rating}%</span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-black text-green-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Circle weight="fill" size={8} /> {player.status}
                      </span>
                      <p className="text-[10px] text-gray-600 font-bold uppercase">Ready for match</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PerformanceView;