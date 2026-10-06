import React, { useState } from 'react';
import {
  Sliders,
  Clock,
  Lock,
  Unlock,
  ShieldAlert,
  Moon,
  Plus,
  AlertCircle,
  CheckCircle,
  Filter,
} from 'lucide-react';
import { useParentGuard } from '../../context/ParentGuardContext';
import { AppUsageItem } from '../../types';

export const AppUsageTab: React.FC = () => {
  const { appUsage, toggleAppBlocked, setAppDailyLimit, grantExtraTime } = useParentGuard();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingLimitApp, setEditingLimitApp] = useState<AppUsageItem | null>(null);
  const [newLimitMinutes, setNewLimitMinutes] = useState<number>(60);
  const [bedtimeEnabled, setBedtimeEnabled] = useState<boolean>(true);
  const [safeSearchEnabled, setSafeSearchEnabled] = useState<boolean>(true);
  const [blockNewInstalls, setBlockNewInstalls] = useState<boolean>(true);

  // Calculate totals
  const totalMinutes = appUsage.reduce((acc, curr) => acc + curr.timeSpentMinutes, 0);

  const categories = ['all', 'Edukasi', 'Game', 'Media Sosial', 'Produktivitas'];

  const filteredApps =
    selectedCategory === 'all'
      ? appUsage
      : appUsage.filter((app) => app.category === selectedCategory);

  const handleSaveLimit = () => {
    if (editingLimitApp) {
      setAppDailyLimit(editingLimitApp.id, newLimitMinutes);
      setEditingLimitApp(null);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header & Screen Time Summary */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-slate-100">Statistik Penggunaan Aplikasi</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Hari ini</span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-black text-slate-100 font-mono">
            {Math.floor(totalMinutes / 60)}j {totalMinutes % 60}m
          </span>
          <span className="text-xs text-slate-400">Total Durasi Aktif</span>
        </div>

        {/* Category distribution bars */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex p-0.5 gap-0.5">
          <div className="bg-emerald-500 rounded-l-full" style={{ width: '45%' }} title="Edukasi 45%" />
          <div className="bg-indigo-500" style={{ width: '30%' }} title="Game 30%" />
          <div className="bg-amber-500" style={{ width: '15%' }} title="Produktivitas 15%" />
          <div className="bg-rose-500 rounded-r-full" style={{ width: '10%' }} title="Media Sosial 10%" />
        </div>

        <div className="grid grid-cols-4 gap-1 mt-3 text-center text-[10px]">
          <div className="text-emerald-400">● Edukasi (45%)</div>
          <div className="text-indigo-400">● Game (30%)</div>
          <div className="text-amber-400">● Chat (15%)</div>
          <div className="text-rose-400">● Medsos (10%)</div>
        </div>
      </section>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            {cat === 'all' ? 'Semua Aplikasi' : cat}
          </button>
        ))}
      </div>

      {/* App List */}
      <section className="space-y-2">
        {filteredApps.map((app) => {
          const isOverLimit =
            app.dailyLimitMinutes > 0 && app.timeSpentMinutes >= app.dailyLimitMinutes;

          return (
            <div
              key={app.id}
              className={`p-3 rounded-2xl border transition-all ${
                app.isBlocked
                  ? 'bg-rose-950/20 border-rose-900/40 opacity-75'
                  : 'bg-slate-800/90 border-slate-700/80 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{app.icon}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-100">{app.name}</h4>
                      {app.isBlocked && (
                        <span className="text-[9px] bg-rose-500/20 text-rose-300 font-semibold px-1.5 py-0.5 rounded">
                          Diblokir
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {app.category} · Dibuka {app.lastOpened}
                    </p>
                  </div>
                </div>

                {/* Status / time spent */}
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-slate-200 block">
                    {app.timeSpentMinutes} mnt
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {app.dailyLimitMinutes > 0 ? `Batas: ${app.dailyLimitMinutes} m` : 'Bebas'}
                  </span>
                </div>
              </div>

              {/* Progress bar per app */}
              {app.dailyLimitMinutes > 0 && (
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${
                      isOverLimit ? 'bg-rose-500' : 'bg-purple-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (app.timeSpentMinutes / app.dailyLimitMinutes) * 100)}%`,
                    }}
                  />
                </div>
              )}

              {/* Control buttons per app */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-700/50 text-[11px]">
                <button
                  onClick={() => {
                    setEditingLimitApp(app);
                    setNewLimitMinutes(app.dailyLimitMinutes || 60);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  Atur Batas Harian
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => grantExtraTime(app.id, 15)}
                    className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 font-medium cursor-pointer"
                  >
                    +15 Mnt
                  </button>

                  <button
                    onClick={() => toggleAppBlocked(app.id)}
                    className={`px-2.5 py-0.5 rounded-md font-semibold cursor-pointer transition-colors ${
                      app.isBlocked
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                    }`}
                  >
                    {app.isBlocked ? 'Buka Blokir' : 'Blokir'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bedtime / Downtime Schedule */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="text-xs font-bold text-slate-100">Jadwal Waktu Istirahat & Tidur</h3>
              <p className="text-[10px] text-slate-400">Kunci otomatis saat jam malam</p>
            </div>
          </div>

          <button
            onClick={() => setBedtimeEnabled(!bedtimeEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              bedtimeEnabled ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                bedtimeEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {bedtimeEnabled && (
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-300 font-semibold block">20:30 WIB – 06:00 WIB</span>
              <span className="text-[10px] text-slate-400">Senin sampai Jumat (Hari Sekolah)</span>
            </div>
            <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/20 px-2 py-0.5 rounded-full">
              Terjadwal
            </span>
          </div>
        )}
      </section>

      {/* Content & Web Safety Rules */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-slate-200">Perlindungan Konten & Browser</h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-xl">
            <div>
              <p className="font-semibold text-slate-200">Google SafeSearch & YouTube Kids Mode</p>
              <p className="text-[10px] text-slate-400">Saring konten dewasa dan eksplisit secara otomatis</p>
            </div>
            <button
              onClick={() => setSafeSearchEnabled(!safeSearchEnabled)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                safeSearchEnabled ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  safeSearchEnabled ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-xl">
            <div>
              <p className="font-semibold text-slate-200">Blokir Instalasi Aplikasi Baru</p>
              <p className="text-[10px] text-slate-400">Wajib persetujuan orang tua sebelum mengunduh</p>
            </div>
            <button
              onClick={() => setBlockNewInstalls(!blockNewInstalls)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                blockNewInstalls ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  blockNewInstalls ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Edit Limit Modal Dialog */}
      {editingLimitApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{editingLimitApp.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Batas Harian: {editingLimitApp.name}
                </h3>
                <p className="text-[10px] text-slate-400">Atur durasi maksimal bermain setiap hari</p>
              </div>
            </div>

            <div className="text-center py-2">
              <span className="text-3xl font-black font-mono text-purple-400">
                {newLimitMinutes === 0 ? 'Bebas' : `${newLimitMinutes} Menit`}
              </span>
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60, 90, 120, 0].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setNewLimitMinutes(mins)}
                  className={`py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    newLimitMinutes === mins
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {mins === 0 ? 'Bebas' : `${mins}m`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setEditingLimitApp(null)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveLimit}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-purple-600/30"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
