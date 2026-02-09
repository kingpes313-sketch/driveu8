
import React, { useMemo } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Phone, 
  Calendar, 
  Edit2, 
  Trash2, 
  User,
  AlertCircle,
  Printer,
  Users,
  CheckCircle2
} from 'lucide-react';
import { Customer } from '../types';

interface DashboardProps {
  customers: Customer[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (customer: Customer) => void;
  isDarkMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ customers, onToggleStatus, onDelete, onEdit, isDarkMode }) => {
  const stats = useMemo(() => {
    return {
      total: customers.length,
      completed: customers.filter(c => c.status === 'مكتمل').length,
      pending: customers.filter(c => c.status === 'قيد التنفيذ').length,
    };
  }, [customers]);

  const handlePrint = (customer: Customer) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>وصل قياسات - ${customer.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap');
            body { font-family: 'Tajawal', sans-serif; padding: 20px; color: #000; }
            .receipt { border: 2px solid #000; padding: 30px; max-width: 600px; margin: 0 auto; border-radius: 10px; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .customer-info { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center; }
            .measure-box { border: 1px solid #000; padding: 10px; border-radius: 5px; }
            .measure-label { font-size: 11px; display: block; margin-bottom: 5px; font-weight: bold; color: #666; }
            .measure-value { font-size: 18px; font-weight: 800; }
            .notes { margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px; min-height: 80px; font-size: 14px; }
            .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px; }
            .signature { border-top: 1px solid #000; width: 120px; text-align: center; margin-top: 30px; padding-top: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>خياطة وأقمشة مكي الحمداني</h1>
              <p>وصل قياسات زبون رسمي</p>
            </div>
            <div class="customer-info">
              <strong>الاسم:</strong> ${customer.name}<br/>
              <strong>الهاتف:</strong> ${customer.phone}<br/>
              <strong>تاريخ الاستلام:</strong> ${customer.receiptDate}
            </div>
            <div class="grid">
              <div class="measure-box"><span class="measure-label">الطول</span><span class="measure-value">${customer.length}</span></div>
              <div class="measure-box"><span class="measure-label">الكتف</span><span class="measure-value">${customer.shoulder}</span></div>
              <div class="measure-box"><span class="measure-label">طول الردن</span><span class="measure-value">${customer.sleeve}</span></div>
              <div class="measure-box"><span class="measure-label">عرض الصدر</span><span class="measure-value">${customer.chestWidth}</span></div>
              <div class="measure-box"><span class="measure-label">الياقة</span><span class="measure-value">${customer.collar}</span></div>
              <div class="measure-box"><span class="measure-label">الشليل</span><span class="measure-value">${customer.bottom}</span></div>
            </div>
            <div class="notes">
              <strong>ملاحظات الخياطة:</strong><br/>
              ${customer.notes || 'لا توجد ملاحظات إضافية'}
            </div>
            <div class="footer">
              <div>الحالة: ${customer.status}</div>
              <div class="signature">توقيع مكي الحمداني</div>
            </div>
          </div>
          <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-10">
      {/* Stats Cards - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'إجمالي الزبائن', value: stats.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'طلبات مكتملة', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'قيد التنفيذ', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-[2.5rem] border-2 transition-all ${isDarkMode ? 'bg-slate-800/20 border-slate-800/50 hover:border-slate-700' : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'}`}>
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-3xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className={`p-8 rounded-full mb-4 ${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
            <User className="w-12 h-12 opacity-10" />
          </div>
          <p className="text-lg font-bold">لم يتم العثور على أي زبائن حالياً</p>
          <p className="text-sm font-medium mt-1">ابدأ بإضافة زبون جديد لتظهر البيانات هنا</p>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block overflow-hidden">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className={`border-b text-xs ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                  <th className="py-4 font-black px-4">اسم الزبون</th>
                  <th className="py-4 font-black px-4">رقم الهاتف</th>
                  <th className="py-4 font-black px-4 text-center">التاريخ</th>
                  <th className="py-4 font-black px-4 text-center">الحالة</th>
                  <th className="py-4 font-black px-4 text-left">التحكم</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                {customers.map((customer) => (
                  <tr key={customer.id} className={`group transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/50'}`}>
                    <td className="py-5 px-4">
                      <div className="flex flex-col">
                        <span className={`font-black text-base ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{customer.phone}</span>
                        <a 
                          href={`tel:${customer.phone}`}
                          className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                          title="اتصال خارجي"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className={`py-5 px-4 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{customer.receiptDate}</td>
                    <td className="py-5 px-4 text-center">
                      <button 
                        onClick={() => onToggleStatus(customer.id)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${
                          customer.status === 'مكتمل' 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}
                      >
                        {customer.status}
                      </button>
                    </td>
                    <td className="py-5 px-4 text-left">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handlePrint(customer)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg"><Printer className="w-4 h-4" /></button>
                        <button onClick={() => onEdit(customer)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(customer.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className={`p-5 rounded-[2rem] border-2 transition-all ${
                isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="max-w-[60%]">
                    <h3 className={`text-lg font-black truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{customer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {customer.phone}
                      </p>
                      <a 
                        href={`tel:${customer.phone}`}
                        className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg"
                      >
                        <Phone className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <button 
                    onClick={() => onToggleStatus(customer.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      customer.status === 'مكتمل' ? 'bg-emerald-500 text-white shadow-md' : 'bg-blue-500/10 text-blue-500'
                    }`}
                  >
                    {customer.status}
                  </button>
                </div>

                <div className={`grid grid-cols-3 gap-2 mb-4 p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50'}`}>
                  <div className="text-center">
                    <span className="text-[9px] block text-slate-500 font-bold">الطول</span>
                    <span className="font-black text-amber-500 text-sm">{customer.length || '-'}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] block text-slate-500 font-bold">الكتف</span>
                    <span className="font-black text-amber-500 text-sm">{customer.shoulder || '-'}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] block text-slate-500 font-bold">الياقة</span>
                    <span className="font-black text-amber-500 text-sm">{customer.collar || '-'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {customer.receiptDate}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handlePrint(customer)} className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl"><Printer className="w-4 h-4" /></button>
                    <button onClick={() => onEdit(customer)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(customer.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
