import React, { useState, useContext } from 'react';
import { Money, Plus, ArrowUpRight, MagnifyingGlass, X, Receipt } from '@phosphor-icons/react';
import { AcademyContext } from '../../../context/AcademyContext'; // استدعاء قاعدة البيانات

const FinancialsView = ({ triggerAction }) => {
  // سحب الفواتير ودالة الإضافة من الـ Context
  const { invoices, addInvoice } = useContext(AcademyContext);
  
  // States للبحث ونافذة الإضافة
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState({ name: '', amount: '', status: 'Pending' });

  // دالة البحث والفلترة (بالاسم أو برقم الفاتورة)
  const filteredInvoices = invoices.filter(invoice => 
    invoice.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // دالة حفظ الفاتورة الجديدة
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newInvoiceForm.name || !newInvoiceForm.amount) return alert('Please enter client name and amount');
    
    // تنسيق المبلغ عشان يظهر بعلامة الدولار
    const formattedAmount = newInvoiceForm.amount.startsWith('$') ? newInvoiceForm.amount : `$${parseFloat(newInvoiceForm.amount).toFixed(2)}`;
    
    addInvoice({ ...newInvoiceForm, amount: formattedAmount });
    setIsAddModalOpen(false);
    setNewInvoiceForm({ name: '', amount: '', status: 'Pending' });
    triggerAction('New Invoice Generated Successfully!');
  };

  return (
    <div className="animate-fade-in relative">

      {/* نافذة إنشاء فاتورة جديدة (Create Invoice Modal) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#0b132b]/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Receipt size={24} /> Create Invoice</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition"><X size={24} weight="bold" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">CLIENT / PARENT NAME</label>
                <input type="text" value={newInvoiceForm.name} onChange={(e) => setNewInvoiceForm({...newInvoiceForm, name: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none" placeholder="e.g. Michael Westbrook" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">AMOUNT ($)</label>
                  <input type="number" step="0.01" value={newInvoiceForm.amount} onChange={(e) => setNewInvoiceForm({...newInvoiceForm, amount: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none" placeholder="e.g. 450.00" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">STATUS</label>
                  <select value={newInvoiceForm.status} onChange={(e) => setNewInvoiceForm({...newInvoiceForm, status: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-target-red outline-none">
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-target-red hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-4 transition shadow-md">Generate Invoice</button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-serif">Financial Management</h1>
          <p className="text-gray-500 text-sm">Manage invoices, payroll, subscriptions, and expense tracking.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-target-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm">
          <Plus size={18} weight="bold" /> Create Invoice
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0b132b] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <Money size={120} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" weight="duotone" />
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Balance</h3>
          <div className="text-4xl font-extrabold mb-2">$342,500</div>
          <div className="text-sm font-bold text-green-400 flex items-center gap-1"><ArrowUpRight weight="bold" /> +$24,000 this month</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Receivables</h3>
          <div className="text-3xl font-extrabold text-gray-900 mb-2">${invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + parseFloat(curr.amount.replace(/[^0-9.-]+/g,"")), 0).toLocaleString()}</div>
          <div className="text-sm font-bold text-yellow-500 flex items-center gap-1">{invoices.filter(i => i.status === 'Pending').length} Invoices pending</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Collected</h3>
          <div className="text-3xl font-extrabold text-gray-900 mb-2">${invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + parseFloat(curr.amount.replace(/[^0-9.-]+/g,"")), 0).toLocaleString()}</div>
          <div className="text-sm font-bold text-green-500 flex items-center gap-1">{invoices.filter(i => i.status === 'Paid').length} Invoices paid</div>
        </div>
      </div>

      {/* Transactions Table & Search */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Recent Transactions</h2>
          <div className="relative w-full max-w-xs">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-target-red focus:ring-1 focus:ring-target-red transition-colors" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-4 font-bold">Invoice ID</th>
                <th className="pb-4 font-bold">Client / Parent</th>
                <th className="pb-4 font-bold">Date</th>
                <th className="pb-4 font-bold">Amount</th>
                <th className="pb-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.length > 0 ? filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => triggerAction(`Viewing details for ${invoice.id}`)}>
                  <td className="py-4 font-mono text-sm text-gray-500 font-bold">{invoice.id}</td>
                  <td className="py-4 font-bold text-gray-900 text-sm">{invoice.name}</td>
                  <td className="py-4 text-sm text-gray-500">{invoice.date}</td>
                  <td className="py-4 font-bold text-gray-900 text-sm">{invoice.amount}</td>
                  <td className="py-4">
                    <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider ${invoice.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400 font-medium">No invoices found matching "{searchQuery}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialsView;