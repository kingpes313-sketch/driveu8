
import React, { useState, useRef } from 'react';
import { User, Lock, Camera, Scissors, LogIn, AlertCircle } from 'lucide-react';
import { AuthUser } from '../types';

interface LoginProps {
  onLogin: (user: AuthUser) => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // التحقق من كود الدخول الموحد
    if (password === 'moha4h') {
      if (username.trim()) {
        onLogin({
          username,
          image,
          isLoggedIn: true
        });
      } else {
        setError('يرجى إدخل اسم المستخدم');
      }
    } else {
      setError('كود الدخول غير صحيح، يرجى المحاولة مرة أخرى');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-[#fcfbf7] text-slate-900'}`}>
      <div className={`max-w-md w-full p-8 rounded-[2.5rem] border shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <div className="flex flex-col items-center text-center gap-6 mb-10">
          <div className="bg-amber-500 p-4 rounded-3xl shadow-xl shadow-amber-500/20">
            <Scissors className="w-10 h-10 text-slate-900" />
          </div>
          <div>
            <h1 className="text-3xl font-black mb-2">مرحباً بك مجدداً</h1>
            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-bold`}>خياطة وأقمشة مكي الحمداني</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all ${
                isDarkMode ? 'border-slate-800 bg-slate-800' : 'border-slate-50 bg-slate-50'
              } group-hover:border-amber-500`}>
                {image ? (
                  <img src={image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className={`w-10 h-10 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-amber-500 p-2 rounded-full shadow-lg">
                <Camera className="w-4 h-4 text-slate-900" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <span className={`text-xs font-black ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>اختر صورة شخصية (اختياري)</span>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="relative">
              <User className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input 
                type="text" 
                required
                placeholder="اسم المستخدم"
                className={`w-full pr-12 pl-4 py-4 rounded-2xl border outline-none transition-all font-bold ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 text-white focus:border-amber-500 placeholder:text-slate-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500 placeholder:text-slate-400'
                }`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input 
                type="password" 
                required
                placeholder="كود الدخول (كلمة المرور)"
                className={`w-full pr-12 pl-4 py-4 rounded-2xl border outline-none transition-all font-bold ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 text-white focus:border-amber-500 placeholder:text-slate-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500 placeholder:text-slate-400'
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-amber-500 text-slate-900 rounded-2xl font-black text-lg hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 active:scale-95 mt-4"
          >
            <LogIn className="w-6 h-6" />
            تسجيل الدخول
          </button>
        </form>
      </div>

      <footer className={`mt-8 text-center text-sm font-bold transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
        <p>جميع الحقوق محفوظة لـ محمد الحمداني 2026 ©</p>
      </footer>
    </div>
  );
};

export default Login;
