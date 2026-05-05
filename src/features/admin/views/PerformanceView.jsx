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
    <div className="animate-in fade-in duration-700 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
            Performance <span className="text-target-red italic">Intelligence</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Technical KPIs and squad progression analytics powered by MongoDB.</p>
        </div>
        
        <button 
          onClick={handleExportAnalytics} 
          disabled={isExporting}
          className={`group flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 font-bold shadow-xl shadow-red-500/10 ${isExporting ? 'bg-gray-100 text-gray-400' : 'bg-[#0b132b] text-white hover:shadow-2xl hover:-translate-y-1 active:scale-95'}`}
        >
          <DownloadSimple size={20} weight="bold" className={isExporting ? "animate-bounce" : "group-hover:rotate-12 transition-transform"} /> 
          {isExporting ? 'Exporting Intelligence...' : 'Export Intelligence'}
        </button>
      </div>

      {/* KPI Highlights - Glass Effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Avg Progression" value="+14.5%" subtext="Technical Gain" subtextIcon={TrendUp} mainIcon={Lightning} />
        <KpiCard title="Tactical Accuracy" value="88%" subtext="Team Synergy" subtextColor="text-blue-500" mainIcon={Crosshair} />
        <KpiCard title="Fitness Level" value="Elite" subtext="Squad Baseline" subtextColor="text-target-red" mainIcon={Heartbeat} />
        <KpiCard title="Pro Signings" value="12" subtext="Pathways Realized" subtextColor="text-yellow-500" mainIcon={Trophy} />
      </div>

      {/* Matrix Section - Compact Matrix Design */}
      <section className="bg-white/70 backdrop-blur-sm rounded-[2rem] p-8 border border-white shadow-xl shadow-gray-200/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1 flex items-center gap-3">
              Daily Technical Matrix
            </h2>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-target-red animate-pulse"></div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Live Squad Data Feed</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-xl">
             <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-xs font-bold text-gray-900">Current Week</button>
             <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition">History</button>
          </div>
        </div>

        {loadingMetrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {metrics.map((m) => (
              <div 
                key={m._id} 
                className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:border-target-red/30 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{m.name}</p>
                   <div className="p-1 bg-red-50 rounded-lg group-hover:bg-target-red transition-colors">
                      <TrendUp size={12} className="text-target-red group-hover:text-white transition-colors" />
                   </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-black text-gray-900 group-hover:text-target-red transition-colors">{m.value}</span>
                  <span className="text-xs font-bold text-gray-300 ml-1">%</span>
                </div>
                
                <div className="flex gap-1 items-end h-8">
                   {[...Array(5)].map((_, i) => (
                     <div 
                       key={i} 
                       className={`flex-1 rounded-full transition-all duration-700`}
                       style={{ 
                         height: `${m.value * (0.4 + (i * 0.15))}%`,
                         backgroundColor: i === 4 ? '#bd103b' : '#f1f5f9',
                         opacity: 0.2 + (i * 0.2)
                       }}
                     ></div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top Performers Section - Sleek Dark Intelligence Board */}
      <section className="bg-[#0b132b] rounded-[2rem] p-8 shadow-2xl text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-target-red/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-target-red/20"></div>
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-1">Intelligence Board</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">Elite Performance Tracking</p>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
             <Trophy size={24} weight="fill" className="text-target-red" />
          </div>
        </div>

        <div className="overflow-x-auto relative z-10 custom-scrollbar">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] border-b border-white/5">
                <th className="pb-6 px-4">Athlete</th>
                <th className="pb-6 px-4">Squad</th>
                <th className="pb-6 px-4">Technical Rating</th>
                <th className="pb-6 px-4 text-right">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {players.map((player, idx) => (
                <tr key={player.id} className="group/row hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-4 flex items-center gap-4">
                    <div className="relative">
                       <img src={player.avatar} className="w-12 h-12 rounded-xl object-cover border-2 border-white/10 group-hover/row:border-target-red transition-all shadow-lg" alt="" />
                       {idx === 0 && <div className="absolute -top-1.5 -right-1.5 bg-yellow-500 p-1 rounded-lg shadow-lg border border-black"><Star weight="fill" size={8} className="text-white" /></div>}
                    </div>
                    <div>
                      <p className="font-bold text-gray-100 group-hover/row:text-target-red transition-colors">{player.name}</p>
                      <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">RANK #{idx + 1}</p>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-[10px] font-black text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest">{player.category}</span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-40 bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-target-red to-red-400 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${player.rating || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-black text-gray-300">{player.rating}%</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <span className="text-[10px] font-black text-green-400 border border-green-500/20 bg-green-500/5 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                      {player.status}
                    </span>
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