import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

const AthletesView = ({ triggerAction }) => {
  const { users, approveUser, rejectUser } = useContext(AuthContext);

  // هنجيب الناس اللي سجلوا كـ Player أو Parent ومستنيين الموافقة
  const pendingUsers = users.filter(u => (u.role === 'PLAYER' || u.role === 'PARENT') && u.status === 'Pending');
  // هنجيب اللاعبين اللي اتوافق عليهم
  const activePlayers = users.filter(u => (u.role === 'PLAYER' || u.role === 'PARENT') && u.status === 'Active');

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-serif">Athletes & Registrations</h1>
      <p className="text-gray-500 text-sm mb-8">Review new signups and manage active academy members.</p>

      {/* قسم المراجعات (Pending Approvals) */}
      {pendingUsers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-target-red mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-target-red animate-pulse"></span> Pending Approvals ({pendingUsers.length})
          </h2>
          <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
            <div className="space-y-3">
              {pendingUsers.map(user => (
                <div key={user.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                  <div>
                    <h3 className="font-bold text-gray-900">{user.name} <span className="text-xs text-gray-400 ml-2 bg-gray-100 px-2 py-1 rounded">{user.role}</span></h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.age && parseInt(user.age) < 16 && (
                      <p className="text-xs font-bold text-target-red mt-1">
                        Parent: {user.parentName} ({user.parentEmail})
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { approveUser(user.id); triggerAction('User Approved!'); }} className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-200 flex items-center gap-1"><CheckCircle weight="bold"/> Approve</button>
                    <button onClick={() => { rejectUser(user.id); triggerAction('Registration Rejected'); }} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200"><XCircle weight="bold"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* جدول الأعضاء الفعليين */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Active Members</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="pb-4 font-bold">Name</th>
              <th className="pb-4 font-bold">Role</th>
              <th className="pb-4 font-bold">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activePlayers.map(player => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="py-4 font-bold text-gray-900 flex items-center gap-3">
                  <img src={player.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
                  {player.name}
                </td>
                <td className="py-4 text-sm text-gray-600">{player.role}</td>
                <td className="py-4 text-sm text-gray-500">{player.email}</td>
              </tr>
            ))}
            {activePlayers.length === 0 && <tr><td colSpan="3" className="py-8 text-center text-gray-400">No active members yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AthletesView;