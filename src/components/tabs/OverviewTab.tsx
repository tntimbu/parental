import React, { useState } from 'react';
import {
  ShieldCheck,
  Tv,
  MapPin,
  Clock,
  Camera,
  Lock,
  Unlock,
  AlertTriangle,
  Send,
  Battery,
  Wifi,
  ChevronRight,
  Flame,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { useParentGuard } from '../../context/ParentGuardContext';

export const OverviewTab: React.FC = () => {
  const {
    profile,
    currentLocation,
    appUsage,
    isDeviceLocked,
    toggleLockDevice,
    setActiveTab,
    sendChildNudge,
    grantExtraTime,
    ringChildAlarm,
  } = useParentGuard();

  const [quickMsg, setQuickMsg] = useState('');
  const [nudgeSent, setNudgeSent] = useState(false);

  // Total screen time in minutes
  const totalScreenMinutes = appUsage.reduce((acc, curr) => acc + curr.timeSpentMinutes, 0);
  const totalHours = Math.floor(totalScreenMinutes / 60);
  const remainingMins = totalScreenMinutes % 60;
  const dailyBudgetMinutes = 240; // 4 hours
  const percentUsed = Math.min(100, Math.round((totalScreenMinutes / dailyBudgetMinutes) * 100));

  const handleSendNudge = (text?: string) => {
    const msg = text || quickMsg;
    if (!msg.trim()) return;
    sendChildNudge(msg.trim());
    setQuickMsg('');
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 3000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Account Role Clarification Banner (Play Store Style) */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-2.5 px-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base">👨‍👩‍👧</span>
          <div>
            <span className="font-bold text-slate-200">Mode Orang Tua (Pengawas)</span>
            <p className="text-[10px] text-slate-400">
              Memantau: <span className="text-indigo-300 font-semibold">{profile.name}</span> ({profile.deviceName})
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('screen')}
          className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20 cursor-pointer"
        >
          Lihat Layar Live →
        </button>
      </div>

      {/* Safety Status Hero Card */}
      <section className="bg-gradient-to-br from-indigo-950/70 via-slate-800 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Perlindungan Aktif 24/7</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              {profile.name} Sedang Aman
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Lokasi saat ini di <span className="text-slate-200 font-medium">SD Pelita Bangsa</span>
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-inner">
            {profile.avatar}
          </div>
        </div>

        {/* Quick device telemetry row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-700/60 text-center">
          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Baterai HP</span>
            <span className="text-sm font-bold text-slate-200 font-mono tabular-nums">
              {profile.batteryLevel}%
            </span>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Aplikasi Aktif</span>
            <span className="text-xs font-semibold text-emerald-400 truncate block">
              {profile.currentApp}
            </span>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Suhu HP</span>
            <span className="text-sm font-bold text-slate-200 font-mono">31°C</span>
          </div>
        </div>
      </section>

      {/* Screen Time Progress Card */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-200">Waktu Layar Hari Ini</h3>
          </div>
          <button
            onClick={() => setActiveTab('apps')}
            className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
          >
            <span>Detail</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-100 font-mono tabular-nums">
              {totalHours}j {remainingMins}m
            </span>
            <span className="text-xs text-slate-400">/ 4j batas harian</span>
          </div>
          <span className="text-xs font-semibold text-indigo-400 font-mono tabular-nums">
            {percentUsed}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 85
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        {/* Quick action buttons for screen time */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/60">
          <button
            onClick={() => grantExtraTime('app-1', 15)}
            className="flex-1 py-1.5 px-2 bg-slate-700/60 hover:bg-slate-700 rounded-lg text-[11px] font-medium text-slate-200 transition-colors cursor-pointer text-center"
          >
            +15 Mnt YouTube
          </button>
          <button
            onClick={() => grantExtraTime('app-3', 15)}
            className="flex-1 py-1.5 px-2 bg-slate-700/60 hover:bg-slate-700 rounded-lg text-[11px] font-medium text-slate-200 transition-colors cursor-pointer text-center"
          >
            +15 Mnt Roblox
          </button>
          <button
            onClick={() => toggleLockDevice('Batas harian habis')}
            className="flex-1 py-1.5 px-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-[11px] font-medium transition-colors cursor-pointer text-center"
          >
            {isDeviceLocked ? 'Buka Kunci' : 'Kunci Sekarang'}
          </button>
        </div>
      </section>

      {/* 4 Core Features Quick Action Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Akses Pemantauan Utama
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Screen Mirroring */}
          <button
            onClick={() => setActiveTab('screen')}
            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 p-3.5 rounded-2xl text-left transition-all group hover:border-indigo-500/50 cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Tv className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                Berbagi Layar
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              Lihat layar HP langsung
            </p>
          </button>

          {/* Card 2: GPS Location */}
          <button
            onClick={() => setActiveTab('location')}
            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 p-3.5 rounded-2xl text-left transition-all group hover:border-indigo-500/50 cursor-pointer shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-300">
                GPS & Pagar Geo
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">±4m</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              Pelacakan lokasi akurat
            </p>
          </button>

          {/* Card 3: App Controls */}
          <button
            onClick={() => setActiveTab('apps')}
            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 p-3.5 rounded-2xl text-left transition-all group hover:border-indigo-500/50 cursor-pointer shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-purple-300">
                Kontrol Aplikasi
              </h4>
              <span className="text-[10px] text-slate-400">7 Aplikasi</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              Batas waktu & blokir
            </p>
          </button>

          {/* Card 4: Remote Camera */}
          <button
            onClick={() => setActiveTab('camera')}
            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 p-3.5 rounded-2xl text-left transition-all group hover:border-indigo-500/50 cursor-pointer shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                Cek Sekitar
              </h4>
              <span className="text-[10px] text-emerald-400 font-medium">Kamera</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              Situasi lingkungan anak
            </p>
          </button>
        </div>
      </div>

      {/* Send Instant Parent Nudge / Message to Child */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Send className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-200">Kirim Pesan Cepat ke Layar Anak</h3>
          </div>
          {nudgeSent && (
            <span className="text-[11px] text-emerald-400 font-semibold animate-in fade-in">
              Terkirim ke Layar HP!
            </span>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {[
            'Waktunya makan siang ya! 🍱',
            'Selesaikan PR sebelum main game 📖',
            'Ibu sebentar lagi jemput 🚗',
            'Segera cas baterai HP kamu! ⚡',
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendNudge(chip)}
              className="text-[11px] bg-slate-700/60 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={quickMsg}
            onChange={(e) => setQuickMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendNudge()}
            placeholder="Ketik pesan khusus untuk anak..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSendNudge()}
            disabled={!quickMsg.trim()}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
          >
            <span>Kirim</span>
          </button>
        </div>
      </section>

      {/* Safety & Consent Ethics Reminder */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Prinsip Pengasuhan Digital Transparan:</strong> Semua fitur
          pemantauan mengedepankan transparansi. Anak mendapatkan notifikasi yang jelas saat
          berbagi layar atau pemeriksaan situasi sekitar aktif.
        </p>
      </div>
    </div>
  );
};
