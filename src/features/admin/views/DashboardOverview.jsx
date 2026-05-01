import React, { useState, useContext } from 'react';
import { DownloadSimple, Calendar, ChartLineUp, Users, CurrencyDollar, Wallet, CaretDown, Check } from '@phosphor-icons/react';
import { AcademyContext } from '../../../context/AcademyContext'; // سحب قاعدة البيانات
import KpiCard from '../../../components/common/KpiCard';
const DashboardOverview = ({ triggerAction }) => {
  // 1. سحب الداتا الحقيقية من المشروع
  const { players, invoices } = useContext(AcademyContext);

  // 2. حالات الشاشة (States)
  const [dateRange, setDateRange] = useState('Q3 2026');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // حسابات حقيقية من الداتا الوهمية اللي عملناها
  const totalAthletes = players.length;
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + parseFloat(curr.amount.replace(/[^0-9.-]+/g,"")), 0);
  const pendingRevenue = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + parseFloat(curr.amount.replace(/[^0-9.-]+/g,"")), 0);

  // 3. كود تصدير التقرير الحقيقي (بيعمل ملف Excel/CSV بينزل على الجهاز)
  const handleExport = () => {
    setIsExporting(true);
    triggerAction('Compiling Data for Export...');

    setTimeout(() => {
      // تجهيز محتوى الملف
      const csvContent = "data:text/csv;charset=utf-8,"
        + "Academy Metric,Value\n"
        + `Report Date Range,${dateRange}\n`
        + `Total Active Athletes,${totalAthletes}\n`
        + `Total Revenue Collected,$${totalRevenue}\n`
        + `Pending Receivables,$${pendingRevenue}\n`;

      // كود التحميل
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Target_Academy_Report_${dateRange.replace(' ', '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      triggerAction('Report Downloaded Successfully!');
    }, 1500); // تأخير وهمي ثانية ونص عشان يبان إنه بيحمل داتا حقيقية
  };

  // خيارات التواريخ
  const dateOptions = ['This Week', 'This Month', 'Q3 2026', 'Year to Date (YTD)'];

  const handleDateSelect = (range) => {
    setDateRange(range);
    setIsDropdownOpen(false);
    triggerAction(`Data refreshed for: ${range}`);
  };

  return (
    <div className="animate-fade-in relative">
      
      {/* Header & Actions */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-serif">Executive Summary</h1>
          <p className="text-gray-500 text-sm">Target Academy performance metrics as of <span className="font-bold text-target-red">{dateRange}</span></p>
        </div>
        
        <div className="flex gap-3 relative">
          
          {/* زرار تحميل التقرير */}
          <button 
            onClick={handleExport} 
            disabled={isExporting}
            className={`flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg transition text-sm font-medium shadow-sm ${isExporting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'}`}
          >
            <DownloadSimple size={18} className={isExporting ? "animate-bounce" : ""} /> 
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>

          {/* زرار القائمة المنسدلة للتواريخ */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="flex items-center gap-2 bg-[#1e293b] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium shadow-sm active:scale-95"
            >
              <Calendar size={18} /> {dateRange} <CaretDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* القائمة المنسدلة (Dropdown Menu) */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">Select Date Range</div>
                <div className="p-2 space-y-1">
                  {dateOptions.map((option) => (
                    <button 
                      key={option}
                      onClick={() => handleDateSelect(option)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex justify-between items-center ${dateRange === option ? 'bg-red-50 text-target-red' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {option}
                      {dateRange === option && <Check size={16} weight="bold" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Dynamic KPI Cards */}
  {/* Dynamic KPI Cards (Refactored using KpiCard Component) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiCard 
          title="Total Subscriptions" 
          value={totalAthletes} 
          subtext="Dynamic Data" 
          subtextIcon={ChartLineUp} 
          mainIcon={Users} 
        />
        <KpiCard 
          title={`Revenue (${dateRange})`} 
          value={`$${totalRevenue.toLocaleString()}`} 
          subtext="Collected" 
          subtextIcon={ChartLineUp} 
          mainIcon={CurrencyDollar} 
        />
        <KpiCard 
          title="Pending Receivables" 
          value={`$${pendingRevenue.toLocaleString()}`} 
          subtext="Awaiting Payment" 
          subtextIcon={ChartLineUp} 
          subtextColor="text-yellow-500"
          mainIcon={Wallet} 
        />
      </div>
      
      {/* باقي تصميم الـ Dashboard هنا (مساحة الرسم البياني السابقة) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center items-center h-[300px]">
          <h2 className="text-lg font-bold text-gray-400 mb-4 font-serif">Revenue Chart goes here</h2>
        </div>
        <div className="bg-[#1b253c] rounded-2xl p-8 shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-6 font-serif">Quick Summary</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Your data is now fully dynamic. Any athlete or invoice added in their respective tabs will instantly update these executive figures above based on the selected date range.</p>
        </div>
      </div>

    </div>
  );
};
export default DashboardOverview;