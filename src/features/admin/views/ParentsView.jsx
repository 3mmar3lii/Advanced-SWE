import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { UsersThree, EnvelopeSimple } from '@phosphor-icons/react';

const ParentsView = () => {
  const { users } = useContext(AuthContext);

  // فلترة الأهالي النشطين فقط
  const activeParents = users.filter(u => u.role === 'PARENT' && u.status === 'Active');
  // فلترة اللعيبة عشان نربطهم بالأهالي
  const activePlayers = users.filter(u => u.role === 'PLAYER' && u.status === 'Active');

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-serif">Parents Directory</h1>
        <p className="text-gray-500 text-sm">Manage academy parents and guardians.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeParents.map(parent => {
          // ندور على اللعيبة اللي ولي أمرهم هو الأب ده (عن طريق الإيميل)
          const children = activePlayers.filter(player => player.parentEmail === parent.email);

          return (
            <div key={parent.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <img src={parent.avatar} className="w-12 h-12 rounded-full border-2 border-gray-50" alt="parent" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{parent.name}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registered Parent</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                  <EnvelopeSimple size={18} className="text-gray-400" /> {parent.email}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                  <UsersThree size={16} /> Linked Athletes ({children.length})
                </h4>
                {children.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {children.map(child => (
                      <span key={child.id} className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                        {child.name} ({child.age} yrs)
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No linked athletes found.</p>
                )}
              </div>
            </div>
          );
        })}

        {activeParents.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
            <p className="text-gray-500 font-medium">No active parents found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentsView;