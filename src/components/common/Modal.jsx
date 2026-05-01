import React from 'react';
import { X } from '@phosphor-icons/react';

const Modal = ({ isOpen, onClose, title, icon: TitleIcon, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0b132b]/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl scale-100 transition-transform">
        
        {/* هيدر النافذة */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {TitleIcon && <TitleIcon size={24} />} 
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <X size={24} weight="bold" />
          </button>
        </div>

        {/* محتوى النافذة (الفورمة اللي بتتبعت من أي شاشة) */}
        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;