
import React, { useState, useRef } from 'react';
import { StaffMember } from '../types';
import { User, Camera, Trash2, Plus, ShieldCheck, UserCog, ToggleLeft, ToggleRight } from 'lucide-react';

interface TeamManagerProps {
  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  isDarkMode?: boolean;
}

const TeamManager: React.FC<TeamManagerProps> = ({ staff, setStaff, isDarkMode }) => {
  const [newStaffName, setNewStaffName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setStaff(prev => prev.map(s => s.id === id ? { ...s, image: base64String } : s));
      };
      reader.readAsDataURL(file);
    }
  };

  const addStaff = () => {
    if (!newStaffName.trim()) return;
    const newMember: StaffMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStaffName,
      role: 'موظف',
      isActive: true
    };
    setStaff(prev => [...prev, newMember]);
    setNewStaffName('');
  };

  const removeStaff = (id: string) => {
    const member = staff.find(s => s.id === id);
    if (member?.role === 'صاحب العمل') {
      alert('لا يمكن حذف صاحب العمل');
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      setStaff(prev => prev.filter(s => s.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <h3 className={`text-xl font-black mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          <Plus className="w-6 h-6 text-amber-500" />
          إضافة موظف جديد
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="اسم الموظف..."
            value={newStaffName}
            onChange={(e) => setNewStaffName(e.target.value)}
            className={`flex-1 p-4 rounded-2xl border outline-none transition-all font-bold ${
              isDarkMode 
                ? 'bg-slate-900/50 border-slate-700 text-white focus:border-amber-500' 
                : 'bg-white border-slate-200 text-slate-800 focus:border-amber-500'
            }`}
          />
          <button 
            onClick={addStaff}
            className="px-8 py-4 bg-amber-500 text-slate-900 rounded-2xl font-black hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
          >
            إضافة للفريق
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className={`p-6 rounded-3xl border transition-all ${
            isDarkMode 
              ? 'bg-slate-800/20 border-slate-800 hover:border-amber-500/30' 
              : 'bg-white border-slate-100 shadow-sm hover:border-amber-200'
          }`}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative group">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 flex items-center justify-center transition-all ${
                  isDarkMode ? 'border-slate-800 bg-slate-800' : 'border-slate-50 bg-slate-50'
                } ${member.isActive ? 'border-emerald-500/50' : 'border-slate-300 opacity-60'}`}>
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className={`w-16 h-16 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                  )}
                </div>
                {member.isActive && (
                  <div className="absolute top-2 left-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse z-20 shadow-lg shadow-emerald-500/40"></div>
                )}
                <label className="absolute bottom-0 right-0 p-2 bg-amber-500 text-slate-900 rounded-full cursor-pointer shadow-lg hover:bg-amber-600 transition-all z-20">
                  <Camera className="w-5 h-5" />
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleImageUpload(member.id, e)}
                  />
                </label>
              </div>

              <div>
                <h4 className={`text-xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  {member.name}
                </h4>
                <div className="flex flex-col items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-1.5">
                    {member.role === 'صاحب العمل' ? (
                      <span className="flex items-center gap-1 text-xs font-black px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        صاحب العمل
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-black px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20">
                        <UserCog className="w-3 h-3" />
                        موظف
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleActive(member.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                    member.isActive 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                  }`}
                >
                  {member.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  {member.isActive ? 'نشط الآن' : 'غير نشط'}
                </button>
              </div>

              {member.role !== 'صاحب العمل' && (
                <button 
                  onClick={() => removeStaff(member.id)}
                  className={`mt-2 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;
