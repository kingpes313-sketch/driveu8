
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  LayoutDashboard,
  Scissors,
  Sun,
  Moon,
  Contact,
  LogOut,
  User as UserIcon,
  Download,
  Upload,
  Database,
  Trash2,
  RefreshCcw,
  Filter,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  ClipboardList
} from 'lucide-react';
import { Customer, StaffMember, AuthUser, OrderStatus } from './types';
import Dashboard from './components/Dashboard';
import CustomerForm from './components/CustomerForm';
import TeamManager from './components/TeamManager';
import StaffPanel from './components/StaffPanel';
import Login from './components/Login';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'add' | 'team' | 'trash' | 'staff_orders'>('dashboard');
  const [statusFilter, setStatusFilter] = useState<'الكل' | OrderStatus>('الكل');
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('hamdani_theme');
    return saved === 'dark';
  });
  
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('hamdani_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('hamdani_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('hamdani_staff');
    if (saved) return JSON.parse(saved);
    return [{ id: 'owner-1', name: 'مكي الحمداني', role: 'صاحب العمل', isActive: true }];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hamdani_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hamdani_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('hamdani_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('hamdani_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hamdani_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hamdani_user');
    }
  }, [user]);

  const exportData = () => {
    const data = { customers, staff, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hamdani_backup_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.customers && data.staff) {
          if (confirm('تنبيه: سيتم مسح البيانات الحالية واستبدالها بالنسخة الاحتياطية. هل أنت متأكد؟')) {
            setCustomers(data.customers);
            setStaff(data.staff);
            alert('تم استرجاع البيانات بنجاح!');
          }
        } else {
          throw new Error('Invalid format');
        }
      } catch (err) {
        alert('فشل استيراد الملف. تأكد من أنه ملف نسخة احتياطية صالح.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  const activeCustomers = useMemo(() => {
    return customers.filter(c => !c.isDeleted && 
      (statusFilter === 'الكل' || c.status === statusFilter) &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery))
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [customers, searchQuery, statusFilter]);

  const trashedCustomers = useMemo(() => {
    return customers.filter(c => c.isDeleted).sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));
  }, [customers]);

  const activeStaff = useMemo(() => staff.filter(s => s.isActive), [staff]);

  const addCustomer = (customerData: any) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      isDeleted: false
    };
    setCustomers(prev => [...prev, newCustomer]);
    setView('dashboard');
  };

  const updateCustomer = (updated: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditingCustomer(null);
    setView('dashboard');
  };

  const toggleStatus = (id: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === 'قيد التنفيذ' ? 'مكتمل' : 'قيد التنفيذ' } : c
    ));
  };

  const moveToTrash = (id: string) => {
    if (confirm('هل تريد نقل هذا الزبون إلى سلة المهملات؟')) {
      setCustomers(prev => prev.map(c => 
        c.id === id ? { ...c, isDeleted: true, deletedAt: Date.now() } : c
      ));
    }
  };

  const restoreCustomer = (id: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === id ? { ...c, isDeleted: false, deletedAt: undefined } : c
    ));
  };

  const permanentDelete = (id: string) => {
    if (confirm('تنبيه: سيتم حذف البيانات نهائياً. هل أنت متأكد؟')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setView('add');
  };

  const handleLogout = () => {
    if (confirm('هل تريد الخروج؟')) {
      setUser(null);
    }
  };

  if (!user || !user.isLoggedIn) {
    return <Login onLogin={setUser} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col md:flex-row ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#f8f9fa] text-slate-900'}`}>
      <nav className={`no-print w-full md:w-80 p-6 flex flex-col gap-5 shrink-0 transition-colors duration-300 border-l ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 border-slate-800 text-white'}`}>
        <div className="flex items-center justify-between border-b border-slate-700 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2.5 rounded-2xl shadow-lg shadow-amber-500/20">
              <Scissors className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight tracking-tight text-white">مكي الحمداني</h1>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">خياطة وأقمشة</span>
            </div>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 transition-all border border-slate-700"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-4 bg-slate-800/50 border-slate-700`}>
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 bg-slate-900 shrink-0">
              {user.image ? <img src={user.image} alt={user.username} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-2 text-slate-600" />}
            </div>
            <div className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm text-white truncate">{user.username}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">متصل</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-all"><LogOut className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
            { id: 'add', label: 'إضافة زبون جديد', icon: UserPlus },
            { id: 'staff_orders', label: 'توزيع الطلبات', icon: ClipboardList },
            { id: 'team', label: 'إدارة الفريق', icon: Contact },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => { setView(item.id as any); setEditingCustomer(null); }}
              className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${view === item.id ? 'bg-amber-500 text-slate-900 shadow-xl shadow-amber-500/10 scale-[1.02]' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
            className={`flex items-center justify-between p-4 rounded-2xl font-black transition-all ${isDataMenuOpen ? 'bg-slate-800 text-amber-500 border border-amber-500/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5" />
              <span>إدارة البيانات</span>
            </div>
            {isDataMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isDataMenuOpen && (
            <div className="grid grid-cols-2 gap-2 p-2 bg-slate-800/30 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
               <button onClick={exportData} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-500 transition-all group">
                 <Download className="w-4 h-4 group-active:translate-y-1 transition-transform" />
                 <span className="text-[9px] font-black">نسخ احتياطي</span>
               </button>
               <label className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 cursor-pointer transition-all group">
                 <Upload className="w-4 h-4 group-active:-translate-y-1 transition-transform" />
                 <span className="text-[9px] font-black">استعادة</span>
                 <input type="file" className="hidden" accept=".json" onChange={importData} />
               </label>
            </div>
          )}
        </div>

        <button 
          onClick={() => { setView('trash'); setEditingCustomer(null); }}
          className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${view === 'trash' ? 'bg-red-500 text-white shadow-xl shadow-red-500/10 scale-[1.02]' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          <Trash2 className="w-5 h-5" />
          <span>سلة المهملات</span>
          {trashedCustomers.length > 0 && (
            <span className={`mr-auto text-[10px] px-2 py-0.5 rounded-full ${view === 'trash' ? 'bg-white text-red-500' : 'bg-red-500 text-white'}`}>
              {trashedCustomers.length}
            </span>
          )}
        </button>

        <div className="mt-2 p-5 rounded-3xl border border-slate-800 bg-slate-800/20">
          <h4 className="text-[10px] font-black mb-4 flex items-center gap-2 text-slate-500 uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" /> الموظفون النشطون
          </h4>
          <div className="space-y-3">
            {activeStaff.map(member => (
              <div key={member.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-900">
                      {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-2 text-slate-700" />}
                    </div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-300">{member.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto no-print">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {view === 'dashboard' && 'قائمة الطلبات والزبائن'}
              {view === 'add' && (editingCustomer ? 'تعديل القياسات' : 'زبون جديد')}
              {view === 'team' && 'إدارة الفريق'}
              {view === 'trash' && 'سلة المهملات'}
              {view === 'staff_orders' && 'توزيع الطلبات'}
            </h2>
            <p className="text-slate-500 font-bold mt-2">
              {view === 'trash' ? 'البيانات في السلة محفوظة بشكل دائم حتى تحذفها يدوياً' : 'مرحباً بك في نظام الإدارة الذكي'}
            </p>
          </div>

          {view === 'dashboard' && (
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl w-full">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="ابحث عن زبون بالاسم أو الهاتف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pr-12 pl-4 py-4 rounded-[2rem] border-2 outline-none focus:border-amber-500 transition-all font-bold ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-700' : 'bg-white border-slate-100 text-slate-800 shadow-sm'
                  }`}
                />
              </div>
            </div>
          )}
        </header>

        {view === 'dashboard' && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            {(['الكل', 'قيد التنفيذ', 'مكتمل'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${
                  statusFilter === f 
                    ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' 
                    : `${isDarkMode ? 'bg-slate-900 text-slate-500 border border-slate-800' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`
                }`}
              >
                {f === 'الكل' && <Filter className="w-4 h-4" />}
                {f === 'قيد التنفيذ' && <Clock className="w-4 h-4" />}
                {f === 'مكتمل' && <CheckCircle2 className="w-4 h-4" />}
                {f}
              </button>
            ))}
          </div>
        )}

        <div className={`rounded-[3rem] p-4 md:p-10 transition-all duration-500 ${
          isDarkMode ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50'
        }`}>
          {view === 'dashboard' && <Dashboard customers={activeCustomers} onToggleStatus={toggleStatus} onDelete={moveToTrash} onEdit={handleEdit} isDarkMode={isDarkMode} />}
          {view === 'add' && <CustomerForm onSubmit={editingCustomer ? updateCustomer : addCustomer} initialData={editingCustomer || undefined} onCancel={() => setView('dashboard')} isDarkMode={isDarkMode} staff={staff} />}
          {view === 'team' && <TeamManager staff={staff} setStaff={setStaff} isDarkMode={isDarkMode} />}
          {view === 'staff_orders' && <StaffPanel customers={customers.filter(c => !c.isDeleted)} onToggleStatus={toggleStatus} isDarkMode={isDarkMode} staff={staff} />}
          {view === 'trash' && (
            <div className="space-y-6">
              {trashedCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Trash2 className="w-16 h-16 opacity-10 mb-4" />
                  <p className="text-xl font-bold">السلة فارغة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trashedCustomers.map(customer => (
                    <div key={customer.id} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{customer.name}</h3>
                      <p className="text-sm font-bold text-slate-500 mt-1">{customer.phone}</p>
                      <div className="mt-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500">
                        تاريخ الحذف: {new Date(customer.deletedAt!).toLocaleDateString('ar-EG')}
                      </div>
                      <div className="flex gap-2 mt-6">
                        <button 
                          onClick={() => restoreCustomer(customer.id)}
                          className="flex-1 flex items-center justify-center gap-2 p-3 bg-emerald-500 text-white rounded-xl font-black text-xs"
                        >
                          <RefreshCcw className="w-4 h-4" /> استعادة
                        </button>
                        <button 
                          onClick={() => permanentDelete(customer.id)}
                          className="p-3 bg-red-500 text-white rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
