import React, { useState, useContext } from 'react';
import { DownloadSimple, TrendUp, Crosshair, Heartbeat, Trophy, Star } from '@phosphor-icons/react';
import { AcademyContext } from '../../../context/AcademyContext'; // سحب الداتا
import KpiCard from '../../../components/common/KpiCard'; // استدعاء الكومبوننت الموحد

const PerformanceView = ({ triggerAction }) => {
  const { players } = useContext(AcademyContext);
  const [isExporting, setIsExporting] = useState(false);

  // دالة التصدير الحقيقية (Export Analytics)
  const handleExportAnalytics = () => {
    setIsExporting(true);
    triggerAction('Compiling Player Analytics...');

    setTimeout(() => {
      // تجميع داتا اللعيبة عشان ننزلها في شيت الإكسيل
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Player Name,Category,Status,Parent/Guardian\n"; // الهيدر
      players.forEach(p => {
        csvContent += `${p.name},${p.category},${p.status},${p.parent}\n`; // الداتا
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Target_Academy_Player_Analytics.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      triggerAction('Analytics Report Downloaded!');
    }, 1500);
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-serif">Player Performance</h1>
          <p className="text-gray-500 text-sm">Track individual and team KPIs, and technical progression.</p>
        </div>
        
        {/* زرار التصدير مربوط بالدالة */}
        <button 
          onClick={handleExportAnalytics} 
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium shadow-sm ${isExporting ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-[#1e293b] text-white hover:bg-black active:scale-95'}`}
        >
          <DownloadSimple size={18} className={isExporting ? "animate-bounce" : ""} /> 
          {isExporting ? 'Exporting...' : 'Export Analytics'}
        </button>
      </div>

      {/* استخدام الكومبوننت الموحد (KpiCard) بدل الكود المتكرر */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Avg Progression" value="+14.5%" subtext="This Month" subtextIcon={TrendUp} mainIcon={TrendUp} />
        <KpiCard title="Tactical Accuracy" value="88%" subtext="Overall Avg" subtextColor="text-blue-500" mainIcon={Crosshair} />
        <KpiCard title="Fitness Level" value="Elite" subtext="Squad Status" subtextColor="text-target-red" mainIcon={Heartbeat} />
        <KpiCard title="Pro Signings" value="12" subtext="Year to Date" subtextColor="text-yellow-500" mainIcon={Trophy} />
      </div>

      {/* جدول أفضل اللعيبة (مربوط بالداتا الحقيقية من Context) */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">Top Performers (Active Players)</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="pb-4 font-bold">Athlete</th>
              <th className="pb-4 font-bold">Category</th>
              <th className="pb-4 font-bold">Overall Rating</th>
              <th className="pb-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {players.filter(p => p.status === 'Active').map((player, idx) => (
              <tr key={player.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => triggerAction(`Viewing ${player.name} Profile`)}>
                <td className="py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-100 bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm flex items-center gap-1">
                      {player.name} {idx === 0 && <Star weight="fill" className="text-yellow-500" size={14} />}
                    </p>
                    <p className="text-xs text-gray-500">Player ID: #{player.id.toString().slice(-4)}</p>
                  </div>
                </td>
                <td className="py-4"><span className="bg-gray-100 text-gray-600 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">{player.category}</span></td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-100 h-2 rounded-full overflow-hidden">
                      {/* تقييم عشوائي لغرض العرض */}
                      <div className="bg-green-500 h-full" style={{ width: `${90 - (idx * 5)}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-900">{90 - (idx * 5)}</span>
                  </div>
                </td>
                <td className="py-4 text-sm font-bold text-green-500">{player.status}</td>
              </tr>
            ))}
            {players.filter(p => p.status === 'Active').length === 0 && (
               <tr><td colSpan="4" className="py-8 text-center text-gray-400 font-medium">No active players to display performance for.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceView;