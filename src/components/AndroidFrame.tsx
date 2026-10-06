import React, { useState, useEffect } from 'react';
import { Battery, BatteryCharging, Wifi, Shield, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import { useParentGuard } from '../context/ParentGuardContext';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const { profile, appMode } = useParentGuard();
  const [time, setTime] = useState<string>('');
  const [isFramedMode, setIsFramedMode] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start sm:p-4 md:p-6 transition-all duration-300">
      {/* Responsive Viewport Controls bar for Desktop testing */}
      <header className="w-full max-w-md hidden sm:flex items-center justify-between mb-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl text-xs text-slate-300 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">ParentGuard OS</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 truncate max-w-[150px]">{profile.deviceName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFramedMode(!isFramedMode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            title="Ganti Mode Tampilan Ponsel / Layar Penuh"
          >
            {isFramedMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Layar Penuh</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Bingkai Android</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container: Android Phone Shell or Responsive Canvas */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col bg-slate-900 overflow-hidden ${
          isFramedMode
            ? 'max-w-[430px] min-h-[880px] h-[92vh] max-h-[940px] rounded-[44px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10'
            : 'max-w-2xl min-h-screen sm:rounded-3xl border sm:border-slate-800 shadow-2xl'
        }`}
      >
        {/* Android Punch Hole Camera & Speaker Ear Piece (visible in framed mode) */}
        {isFramedMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-700/60 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-950/80"></div>
            </div>
          </div>
        )}

        {/* Android System Status Bar */}
        <div className="w-full h-9 shrink-0 px-6 pt-1.5 flex items-center justify-between text-xs font-medium text-slate-300 select-none z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800/40">
          {/* Left: Clock & Notification indicators */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200 tracking-tight">{time || '15:20'}</span>
            <div className="flex items-center gap-1 opacity-70">
              <Shield className="w-3 h-3 text-emerald-400" />
              {appMode === 'child' && (
                <span className="text-[10px] text-amber-300 font-normal">Perangkat Anak</span>
              )}
            </div>
          </div>

          {/* Right: Network, 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-0.5 text-[11px] font-bold text-slate-300">
              <span>{profile.networkType}</span>
            </div>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1 font-mono text-[11px] tabular-nums text-slate-200">
              <span>{profile.batteryLevel}%</span>
              {profile.isCharging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <Battery className={`w-4 h-4 ${profile.batteryLevel < 20 ? 'text-rose-500' : 'text-slate-200'}`} />
              )}
            </div>
          </div>
        </div>

        {/* Scrollable App Viewport */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative scrollbar-none pb-20">
          {children}
        </div>

        {/* Android Gesture Navigation Pill at Bottom */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600/60 rounded-full z-50 pointer-events-none"></div>
      </div>
    </div>
  );
};
