
import React, { useState } from 'react';
import { Customer, OrderStatus, OrderSource, StaffMember } from '../types';
import { 
  Save, 
  Ruler, 
  User, 
  Phone, 
  Calendar, 
  Info, 
  MoveDown, 
  MoveHorizontal, 
  Scissors,
  Maximize2,
  Minimize2,
  CheckSquare,
  Box,
  Layers,
  Zap,
  Store,
  Truck,
  ArrowUp,
  X,
  UserCheck,
  CheckCircle2,
  Clock,
  Square
} from 'lucide-react';

interface CustomerFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: Customer;
  isDarkMode?: boolean;
  staff: StaffMember[];
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, onCancel, initialData, isDarkMode, staff }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    length: initialData?.length || '',
    shoulder: initialData?.shoulder || '',
    sleeve: initialData?.sleeve || '',
    sleeveWidth: initialData?.sleeveWidth || '',
    sleeveCuffWidth: initialData?.sleeveCuffWidth || '',
    sleeveCuffHeight: initialData?.sleeveCuffHeight || '',
    chestWidth: initialData?.chestWidth || '',
    waistWidth: initialData?.waistWidth || '',
    collar: initialData?.collar || '',
    collar1: initialData?.collar1 || false,
    collar125: initialData?.collar125 || false,
    collar15: initialData?.collar15 || false,
    bottom: initialData?.bottom || '',
    armhole: initialData?.armhole || '',
    kaf: initialData?.kaf || false,
    ba: initialData?.ba || false,
    isMeasurementComplete: initialData?.isMeasurementComplete ?? true,
    pocketNormal: initialData?.pocketNormal || false,
    pocketLaqat: initialData?.pocketLaqat || false,
    pocketTaklat: initialData?.pocketTaklat || false,
    isTailoring: initialData?.isTailoring || false,
    isLapping: initialData?.isLapping || false,
    orderSource: initialData?.orderSource || 'محل' as OrderSource,
    staffId: initialData?.staffId || staff[0]?.id || '',
    notes: initialData?.notes || '',
    receiptDate: initialData?.receiptDate || new Date().toISOString().split('T')[0],
    deliveryDate: initialData?.deliveryDate || '',
    status: initialData?.status || 'قيد التنفيذ' as OrderStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      onSubmit({ ...initialData, ...formData });
    } else {
      onSubmit(formData);
    }
  };

  const CollarOption = ({ label, value, onChange }: { label: string, value: boolean, onChange: (val: boolean) => void }) => (
    <label className="flex items-center gap-1.5 cursor-pointer group">
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only"
          checked={value}
          onChange={e => onChange(e.target.checked)}
        />
        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
          value 
            ? 'bg-amber-500 border-amber-500' 
            : `${isDarkMode ? 'bg-slate-800 border-slate-700 group-hover:border-amber-500/50' : 'bg-white border-slate-300 group-hover:border-amber-400'}`
        }`}>
          {value && <CheckSquare className="w-3.5 h-3.5 text-slate-900" />}
        </div>
      </div>
      <span className={`text-xs font-black ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
    </label>
  );

  const CheckboxOption = ({ label, value, onChange, colorClass = "bg-amber-500 border-amber-500" }: { label: string, value: boolean, onChange: (val: boolean) => void, colorClass?: string }) => (
    <label className={`flex items-center gap-2 cursor-pointer group p-3 rounded-2xl border transition-all flex-1 justify-center ${
      value 
        ? (isDarkMode ? 'bg-slate-800 border-amber-500/30' : 'bg-amber-50 border-amber-200 shadow-sm')
        : (isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-amber-200')
    }`}>
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only"
          checked={value}
          onChange={e => onChange(e.target.checked)}
        />
        <div className={`w-5.5 h-5.5 border-2 rounded-lg flex items-center justify-center transition-all ${
          value 
            ? `${colorClass} shadow-md` 
            : `${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`
        }`}>
          {value && <CheckSquare className="w-3.5 h-3.5 text-white" />}
        </div>
      </div>
      <span className={`text-sm font-black ${isDarkMode ? (value ? 'text-amber-400' : 'text-slate-400') : (value ? 'text-amber-900' : 'text-slate-700')}`}>{label}</span>
    </label>
  );

  const SourceOption = ({ label, type, icon: Icon }: { label: string, type: OrderSource, icon: any }) => (
    <button
      type="button"
      onClick={() => setFormData(prev => ({ ...prev, orderSource: type }))}
      className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-black ${
        formData.orderSource === type 
          ? (isDarkMode ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/5' : 'border-amber-500 bg-amber-50 text-amber-900 shadow-inner') 
          : (isDarkMode ? 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200')
      }`}
    >
      <Icon className={`w-5.5 h-5.5 ${formData.orderSource === type ? 'text-amber-500' : 'text-slate-400'}`} />
      <span>{label}</span>
    </button>
  );

  const InputWrapper = ({ label, icon: Icon, children, className = "" }: { label: string, icon: any, children?: React.ReactNode, className?: string }) => (
    <div className={`space-y-2 ${className}`}>
      <span className={`flex items-center gap-2 font-black text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
        <Icon className="w-4 h-4 text-amber-500" />
        {label}
      </span>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Personal Info Section */}
        <div className="space-y-6">
          <h3 className={`text-xl font-black flex items-center gap-2 pb-3 border-b ${isDarkMode ? 'text-white border-slate-800' : 'text-slate-800 border-slate-100'}`}>
            <User className="w-5 h-5 text-amber-500" />
            المعلومات الأساسية
          </h3>
          
          <InputWrapper label="اسم الزبون" icon={User}>
            <input 
              type="text" 
              required
              className={`w-full p-4 rounded-2xl border outline-none transition-all font-bold ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-white focus:border-amber-500 placeholder:text-slate-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500 placeholder:text-slate-400'
              }`}
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="مثال: أحمد محمود الحمداني"
            />
          </InputWrapper>

          <InputWrapper label="رقم الهاتف" icon={Phone}>
            <input 
              type="tel" 
              required
              className={`w-full p-4 rounded-2xl border outline-none transition-all font-bold tracking-widest ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-white focus:border-amber-500 placeholder:text-slate-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500 placeholder:text-slate-400'
              }`}
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="07XXXXXXXXX"
            />
          </InputWrapper>

          <div className="grid grid-cols-2 gap-4">
            <InputWrapper label="حالة الطلب" icon={CheckCircle2}>
               <div className="flex gap-2">
                 {(['قيد التنفيذ', 'مكتمل'] as const).map(s => (
                   <button
                    key={s}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, status: s }))}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all font-black text-xs ${
                      formData.status === s 
                        ? (s === 'مكتمل' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-blue-500 text-white border-blue-500') 
                        : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-100 text-slate-400 shadow-sm')
                    }`}
                   >
                     {s === 'مكتمل' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                     {s}
                   </button>
                 ))}
               </div>
            </InputWrapper>
            
            <InputWrapper label="الموظف المسؤول" icon={UserCheck}>
              <select 
                className={`w-full p-4 rounded-2xl border outline-none transition-all font-bold ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500'
                }`}
                value={formData.staffId}
                onChange={e => setFormData(prev => ({ ...prev, staffId: e.target.value }))}
              >
                {staff.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </InputWrapper>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <InputWrapper label="تاريخ الاستلام" icon={Calendar}>
              <input 
                type="date" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all font-bold ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500'
                }`}
                value={formData.receiptDate}
                onChange={e => setFormData(prev => ({ ...prev, receiptDate: e.target.value }))}
              />
            </InputWrapper>
            <InputWrapper label="تاريخ التسليم" icon={Calendar}>
              <input 
                type="date" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all font-bold ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500'
                }`}
                value={formData.deliveryDate}
                onChange={e => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
              />
            </InputWrapper>
          </div>

          <InputWrapper label="مصدر الطلب" icon={Store}>
              <div className="flex gap-2">
                <SourceOption label="محل" type="محل" icon={Store} />
                <SourceOption label="خارجي" type="خارجي" icon={Truck} />
              </div>
          </InputWrapper>
        </div>

        {/* Measurements Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className={`text-xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              <Scissors className="w-5 h-5 text-amber-500" />
              تفاصيل القياسات
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <InputWrapper label="الطول" icon={MoveDown}>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                value={formData.length}
                onChange={e => setFormData(prev => ({ ...prev, length: e.target.value }))}
                placeholder="0.0"
              />
            </InputWrapper>
            <InputWrapper label="الكتف" icon={Scissors}>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                value={formData.shoulder}
                onChange={e => setFormData(prev => ({ ...prev, shoulder: e.target.value }))}
                placeholder="0.0"
              />
            </InputWrapper>
            
            <InputWrapper label="طول الردن" icon={MoveHorizontal}>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                value={formData.sleeve}
                onChange={e => setFormData(prev => ({ ...prev, sleeve: e.target.value }))}
                placeholder="0.0"
              />
            </InputWrapper>
            <InputWrapper label="عرض الردن" icon={Ruler}>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                value={formData.sleeveWidth}
                onChange={e => setFormData(prev => ({ ...prev, sleeveWidth: e.target.value }))}
                placeholder="0.0"
              />
            </InputWrapper>

            <InputWrapper label="عرض البزمه" icon={Maximize2}>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                value={formData.sleeveCuffWidth}
                onChange={e => setFormData(prev => ({ ...prev, sleeveCuffWidth: e.target.value }))}
                placeholder="0.0"
              />
            </InputWrapper>
            <InputWrapper label="ارتفاع البزمه" icon={ArrowUp}>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                value={formData.sleeveCuffHeight}
                onChange={e => setFormData(prev => ({ ...prev, sleeveCuffHeight: e.target.value }))}
                placeholder="0.0"
              />
            </InputWrapper>

            <InputWrapper label="عرض الصدر" icon={Layers}>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                value={formData.chestWidth}
                onChange={e => setFormData(prev => ({ ...prev, chestWidth: e.target.value }))}
                placeholder="0.0"
              />
            </InputWrapper>
            <InputWrapper label="عرض البطن" icon={Maximize2}>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                value={formData.waistWidth}
                onChange={e => setFormData(prev => ({ ...prev, waistWidth: e.target.value }))}
                placeholder="0.0"
              />
            </InputWrapper>
            
            <InputWrapper label="الحفرة" icon={Minimize2}>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                value={formData.armhole}
                onChange={e => setFormData(prev => ({ ...prev, armhole: e.target.value }))}
                placeholder="0.0"
              />
            </InputWrapper>

            <div className="space-y-3">
              <span className={`flex items-center gap-2 font-black text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                <Info className="w-4 h-4 text-amber-500" />
                الياقة
              </span>
              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                    isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  value={formData.collar}
                  onChange={e => setFormData(prev => ({ ...prev, collar: e.target.value }))}
                  placeholder="0.0"
                />
                <div className={`flex justify-between items-center px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <CollarOption 
                    label="1" 
                    value={formData.collar1} 
                    onChange={val => setFormData(prev => ({ ...prev, collar1: val }))} 
                  />
                  <CollarOption 
                    label="1¼" 
                    value={formData.collar125} 
                    onChange={val => setFormData(prev => ({ ...prev, collar125: val }))} 
                  />
                  <CollarOption 
                    label="1½" 
                    value={formData.collar15} 
                    onChange={val => setFormData(prev => ({ ...prev, collar15: val }))} 
                  />
                </div>
              </div>
            </div>

            <InputWrapper label="الشليل" icon={Maximize2}>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl border outline-none transition-all text-center font-black text-xl ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                value={formData.bottom}
                onChange={e => setFormData(prev => ({ ...prev, bottom: e.target.value }))}
                placeholder="مثال: 32"
              />
            </InputWrapper>

            <div className={`col-span-2 flex gap-6 items-center justify-center p-5 rounded-3xl border ${
              isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50/50 border-amber-100'
            }`}>
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={formData.kaf}
                    onChange={e => setFormData(prev => ({ ...prev, kaf: e.target.checked }))}
                  />
                  <div className={`w-8 h-8 border-2 rounded-xl flex items-center justify-center transition-all ${
                    formData.kaf 
                      ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/20' 
                      : `${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`
                  }`}>
                    {formData.kaf && <CheckSquare className="w-5 h-5 text-slate-900" />}
                  </div>
                </div>
                <span className={`font-black text-2xl ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>ك</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={formData.ba}
                    onChange={e => setFormData(prev => ({ ...prev, ba: e.target.checked }))}
                  />
                  <div className={`w-8 h-8 border-2 rounded-xl flex items-center justify-center transition-all ${
                    formData.ba 
                      ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/20' 
                      : `${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`
                  }`}>
                    {formData.ba && <CheckSquare className="w-5 h-5 text-slate-900" />}
                  </div>
                </div>
                <span className={`font-black text-2xl ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>ب</span>
              </label>
            </div>
          </div>

          <InputWrapper label="نوع الجيب" icon={Box}>
            <div className={`flex flex-wrap gap-3 p-4 rounded-3xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100/30 border-slate-200'}`}>
              <CheckboxOption 
                label="جيب عادي" 
                value={formData.pocketNormal} 
                onChange={v => setFormData(p => ({ ...p, pocketNormal: v }))} 
              />
              <CheckboxOption 
                label="جيب لقط" 
                value={formData.pocketLaqat} 
                onChange={v => setFormData(p => ({ ...p, pocketLaqat: v }))} 
              />
              <CheckboxOption 
                label="جيب تگلات" 
                value={formData.pocketTaklat} 
                onChange={v => setFormData(p => ({ ...p, pocketTaklat: v }))} 
              />
            </div>
          </InputWrapper>

          <InputWrapper label="خياط و لقط" icon={Zap}>
            <div className={`flex gap-3 p-4 rounded-3xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100/30 border-slate-200'}`}>
              <CheckboxOption 
                label="خياط" 
                value={formData.isTailoring} 
                onChange={v => setFormData(p => ({ ...p, isTailoring: v }))}
                colorClass="bg-blue-500 border-blue-500"
              />
              <CheckboxOption 
                label="لقط" 
                value={formData.isLapping} 
                onChange={v => setFormData(p => ({ ...p, isLapping: v }))}
                colorClass="bg-emerald-500 border-emerald-500"
              />
            </div>
          </InputWrapper>

          <InputWrapper label="ملاحظات إضافية" icon={Info}>
            <textarea 
              rows={3}
              className={`w-full p-4 rounded-2xl border outline-none transition-all resize-none font-bold ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-white focus:border-amber-500 placeholder:text-slate-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500 placeholder:text-slate-400'
              }`}
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="مثال: القماش من نوع ياباني، زر مخفي..."
            />
          </InputWrapper>
        </div>
      </div>

      <div className={`flex justify-end gap-4 pt-8 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <button 
          type="button" 
          onClick={onCancel}
          className={`px-8 py-3.5 rounded-2xl transition-all font-black flex items-center gap-2 ${
            isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
          إلغاء
        </button>
        <button 
          type="submit"
          className="px-12 py-3.5 bg-amber-500 text-slate-900 rounded-2xl hover:bg-amber-600 transition-all font-black flex items-center gap-3 shadow-xl shadow-amber-500/20 active:scale-95"
        >
          <Save className="w-6 h-6" />
          {initialData ? 'تحديث البيانات' : 'حفظ الزبون الجديد'}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
