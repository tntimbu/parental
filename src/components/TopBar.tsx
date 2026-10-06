import React, { useState } from 'react';
import {
  Bell,
  Lock,
  Unlock,
  Volume2,
  Smartphone,
  ChevronDown,
  ShieldAlert,
  Radio,
  BookOpen,
} from 'lucide-react';
import { useParentGuard } from '../context/ParentGuardContext';
import { AlertsModal } from './modals/AlertsModal';
import { GuideModal } from './modals/GuideModal';
import { DevicePairingModal } from './modals/DevicePairingModal';
import { RoleSelectorModal } from './modals/RoleSelectorModal';

export const TopBar: React.FC = () => {
  const {
    profile,
    appMode,
    setAppMode,
    isDeviceLocked,
    toggleLockDevice,
    unreadAlertCount,
    ringChildAlarm,
  } = useParentGuard();

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showPairingModal, setShowPairingModal] = useState<boolean>(false);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [showChildPicker, setShowChildPicker] = useState<boolean>(false);

  return (
    <>
      <header className="sticky top-0 z-30 px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          {/* Child Identity & Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowChildPicker(!showChildPicker)}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl shadow-sm group-hover:border-indigo-400 transition-colors">
                  {profile.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 ring-1 ring-emerald-400/40" title="Online Aktif" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">
                  👨‍👩‍👧 Akun Orang Tua
                </span>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {profile.name}
                  </h1>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>{profile.grade}</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-medium">Terhubung Online</span>
                </div>
              </div>
            </button>

            {/* Child Profile Switcher Dropdown */}
            {showChildPicker && (
              <div className="absolute top-12 left-0 w-64 bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5">
                  Perangkat Terhubung
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-700/50 rounded-xl border border-indigo-500/30">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👦</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Rafi Athalla</p>
                      <p className="text-[10px] text-slate-400">{profile.deviceModel}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                    Aktif
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-700/60 px-1">
                  <button
                    onClick={() => {
                      setShowChildPicker(false);
                      setShowPairingModal(true);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-slate-700/40 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>+ Hubungkan / Atur Izin Perangkat</span>
                    <span className="text-[10px] text-slate-500 font-mono">Kode Pairing</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5">
            {/* Prominent Role Selector Button */}
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 shadow-sm"
              title="Pilih Peran: Mode Orang Tua atau Mode Anak"
            >
              <span>👨‍👩‍👧 Ortu</span>
              <ChevronDown className="w-3 h-3 text-indigo-400" />
            </button>

            {/* Guide & Tutorial Button */}
            <button
              onClick={() => setShowGuideModal(true)}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-indigo-400 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              title="Buku Panduan Penggunaan Aplikasi"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Quick Ring Alarm */}
            <button
              onClick={ringChildAlarm}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-amber-400 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              title="Bunyikan Dering Nyaring di HP Anak"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Notification Drawer */}
            <button
              onClick={() => setShowAlertModal(true)}
              className="relative w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              title="Notifikasi & Peringatan Keamanan"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadAlertCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Lock Device Banner / Live Status Pill */}
        <div className="flex items-center justify-between bg-slate-800/60 rounded-xl px-3 py-1.5 border border-slate-700/50 text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300 text-[11px] font-medium truncate max-w-[200px]">
              {profile.currentActivity}
            </span>
          </div>

          <button
            onClick={() => toggleLockDevice()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              isDeviceLocked
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 animate-pulse'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {isDeviceLocked ? (
              <>
                <Lock className="w-3 h-3 text-white" />
                <span>Terkunci</span>
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 text-emerald-400" />
                <span>Kunci Layar</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Alerts Modal */}
      {showAlertModal && <AlertsModal onClose={() => setShowAlertModal(false)} />}

      {/* Guide & Tutorial Modal */}
      {showGuideModal && <GuideModal onClose={() => setShowGuideModal(false)} />}

      {/* Device Pairing & Permissions Onboarding Modal */}
      {showPairingModal && <DevicePairingModal onClose={() => setShowPairingModal(false)} />}

      {/* Role & Account Selector Modal */}
      {showRoleModal && <RoleSelectorModal onClose={() => setShowRoleModal(false)} />}
    </>
  );
};
