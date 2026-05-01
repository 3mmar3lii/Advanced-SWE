import React from 'react';

const KpiCard = ({ title, value, subtext, subtextIcon: SubIcon, subtextColor = 'text-green-500', mainIcon: MainIcon }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
      {/* الخط الأحمر الجانبي */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-target-red group-hover:w-2 transition-all"></div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
          <div className="text-4xl font-extrabold text-gray-900 mb-2">{value}</div>
          
          <div className={`text-sm font-bold flex items-center gap-1 ${subtextColor}`}>
            {SubIcon && <SubIcon weight="bold" />} 
            {subtext}
          </div>
        </div>
        
        {/* الأيقونة الأساسية */}
        {MainIcon && (
          <div className="bg-red-50 p-3 rounded-xl text-target-red">
            <MainIcon size={24} weight="fill" />
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;