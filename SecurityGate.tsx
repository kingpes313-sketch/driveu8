
import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, ShieldCheck, Lock, AlertCircle } from 'lucide-react';

interface SecurityGateProps {
  onVerified: () => void;
  isDarkMode: boolean;
  username: string;
}

const SecurityGate: React.FC<SecurityGateProps> = ({ onVerified, isDarkMode, username }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(false);
  // Fix: Replaced NodeJS.Timeout with any to avoid "Cannot find namespace 'NodeJS'" in browser environments
  const timerRef = useRef<any>(null);

  const startScan = () => {
    if (isSuccess) return;
    setIsScanning(true);
    setError(false);
    
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current!);
          handleSuccess();
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const stopScan = () => {
    if (isSuccess) return;
    setIsScanning(false);
    if (progress < 100) {
      setProgress(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSuccess = () => {
    setIsSuccess(true);
    setIsScanning(false);
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    setTimeout(() => {
      onVerified();
    }, 1000);
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl transition-colors duration-700 ${
      isDarkMode ? 'bg-slate-950/90' : 'bg-white/90'
    }`}>
      <div className="max-w-sm w-full text-center space-y-10">
        <div className="space-y-2">
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
            isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100 border border-slate-200'
          }`}>
            <Lock className={`w-8 h-8 ${isDarkMode ? 'text-amber-500' : 'text-amber-600'}`} />
          </div>
          <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>تأكيد الهوية</h2>
          <p className="text-slate-500 font-bold">مرحباً {username}، يرجى بصمة الإصبع للفتح</p>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Fingerprint Main Container */}
          <button
            onMouseDown={startScan}
            onMouseUp={stopScan}
            onMouseLeave={stopScan}
            onTouchStart={startScan}
            onTouchEnd={stopScan}
            className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 outline-none select-none active:scale-95 ${
              isSuccess 
                ? 'bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)]' 
                : isScanning 
                  ? 'bg-amber-500/10 scale-105' 
                  : (isDarkMode ? 'bg-slate-900 border-2 border-slate-800' : 'bg-slate-50 border-2 border-slate-100')
            }`}
          >
            {/* Success Shield */}
            {isSuccess ? (
              <ShieldCheck className="w-24 h-24 text-white animate-in zoom-in duration-300" />
            ) : (
              <>
                <Fingerprint className={`w-24 h-24 transition-colors duration-300 ${
                  isScanning ? 'text-amber-500' : (isDarkMode ? 'text-slate-700' : 'text-slate-300')
                }`} />
                
                {/* Scanning Laser Line */}
                {isScanning && (
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="w-full h-1 bg-amber-500 shadow-[0_0_15px_#f59e0b] absolute top-0 animate-[scan_1.5s_infinite]" />
                  </div>
                )}
                
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="90"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="4"
                    className={isDarkMode ? 'text-slate-800' : 'text-slate-100'}
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="90"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={565}
                    strokeDashoffset={565 - (565 * progress) / 100}
                    className="text-amber-500 transition-all duration-75"
                    strokeLinecap="round"
                  />
                </svg>
              </>
            )}
          </button>
          
          <p className={`mt-8 text-sm font-black tracking-widest uppercase transition-all duration-300 ${
            isSuccess ? 'text-emerald-500' : isScanning ? 'text-amber-500 animate-pulse' : 'text-slate-400'
          }`}>
            {isSuccess ? 'تَمّ التحقق بنجاح' : isScanning ? 'جاري المسح الضوئي...' : 'اضغط مطولاً للمسح'}
          </p>
        </div>

        {!isScanning && !isSuccess && (
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>نظام حماية مكي الحمداني المطور</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
};

export default SecurityGate;
