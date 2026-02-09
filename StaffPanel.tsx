
import React, { useMemo } from 'react';
import { Customer, StaffMember } from '../types';
import { Clock, User, ClipboardList, CheckCircle2 } from 'lucide-react';

interface StaffPanelProps {
  customers: Customer[];
  onToggleStatus: (id: string) => void;
  isDarkMode?: boolean;
  staff: StaffMember[];
}

const StaffPanel: React.FC<StaffPanelProps> = ({ customers, onToggleStatus, isDarkMode, staff }) => {
  const groups = useMemo(() => {
    const staffGroups: { [key: string]: Customer[] } = {};
    staff.forEach(s => { staffGroups[s.id] = []; });
    staffGroups['unassigned'] = [];
    customers.forEach(c => {
      const sId = c.staffId || 'unassigned';
      if (!staffGroups[sId]) staffGroups[sId] = [];
      staffGroups[sId].push(c);
    });
    return staffGroups;
  }, [customers, staff]);

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
        <div className={`p-6 rounded-full mb-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <ClipboardList className="w-16 h-16 opacity-20" />
        </div>
        <p className="text-xl font-bold">لا توجد طلبات مسجلة حالياً</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className={`flex items-center gap-4 border-b pb-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="bg-amber-500 p-2 rounded-xl">
          <ClipboardList className="w-6 h-6 text-slate-900" />
        </div>
        <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>توزيع الطلبات حسب الموظفين</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {staff.map(member => (
          <div key={member.id} className={`rounded-3xl border transition-all overflow-hidden ${
            isDarkMode 
              ? 'bg-slate-800/40 border-slate-800' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`p-5 flex justify-between items-center border-b transition-all ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
            }`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                  } ${member.isActive ? 'border-emerald-500' : ''}`}>
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className={`w-full h-full p-2 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                    )}
                  </div>
                  {member.isActive && (
                    <div className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                  )}
                </div>
                <div>
                  <h3 className={`font-black flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    {member.name}
                  </h3>
                </div>
              </div>
              <span className={`text-xs font-black px-4 py-1.5 rounded-full border shadow-sm transition-all ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-white border-slate-100 text-slate-500'
              }`}>
                {groups[member.id].length} طلبات
              </span>
            </div>

            <div className="p-4 space-y-3">
              {groups[member.id].length === 0 ? (
                <p className="text-center py-6 text-xs font-bold text-slate-400 italic">لا توجد طلبات مسندة لهذا الموظف</p>
              ) : (
                groups[member.id].map(customer => (
                  <div key={customer.id} className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${
                    isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}>
                    <div>
                      <p className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{customer.name}</p>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">تاريخ الاستلام: {customer.receiptDate}</p>
                    </div>
                    <button 
                      onClick={() => onToggleStatus(customer.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all ${
                        customer.status === 'مكتمل' 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-blue-500/10 text-blue-500'
                      }`}
                    >
                      {customer.status === 'مكتمل' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {customer.status}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffPanel;
