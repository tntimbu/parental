import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  KeyRound,
  Layers,
  MapPin,
  Sliders,
  Camera,
  BatteryCharging,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useParentGuard } from '../../context/ParentGuardContext';
import { sounds } from '../../utils/audio';

interface DevicePairingModalProps {
  onClose: () => void;
}

export const DevicePairingModal: React.FC<DevicePairingModalProps> = ({ onClose }) => {
  const { profile } = useParentGuard();

  const [step, setStep] = useState<number>(1);
  const [pairingCode] = useState<string>('849-216');
  const [parentPin, setParentPin] = useState<string>('1234');
  const [pinInput, setPinInput] = useState<string>('1234');

  // Permission toggles simulation
  const [permissions, setPermissions] = useState({
    usageStats: true,
    backgroundLocation: true,
    overlayDisplay: true,
    accessibilityService: true,
    cameraMic: true,
    batteryUnrestricted: true,
  });

  const togglePermission = (key: keyof typeof permissions) => {
    sounds.playChime();
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinish = () => {
    sounds.playChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Pengaturan & Izin Perangkat Anak
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step progress bar */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-700/60 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
              {step}
            </span>
            <span>
              {step === 1 && 'Langkah 1: Hubungkan Perangkat'}
              {step === 2 && 'Langkah 2: Izin Sistem Android'}
              {step === 3 && 'Langkah 3: Kunci PIN Orang Tua'}
              {step === 4 && 'Langkah 4: Konfirmasi Terhubung'}
            </span>
          </div>
          <span className="text-slate-500 font-mono">Tahap {step}/4</span>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300">
          {/* STEP 1: PAIRING CODE & QR */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-100">
                  Pasang Aplikasi di Smartphone Anak
                </h3>
                <p className="text-[11px] text-slate-400">
                  Buka ParentGuard di ponsel anak Anda, lalu masukkan kode pairing di bawah ini atau pindai kode QR.
                </p>
              </div>

              {/* QR Code and Pairing Code Box */}
              <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl flex flex-col items-center space-y-3">
                {/* Simulated QR Code Icon Graphic */}
                <div className="w-36 h-36 bg-white p-2.5 rounded-2xl shadow-md flex items-center justify-center">
                  <div className="w-full h-full border-4 border-slate-900 rounded-lg p-1.5 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-7 h-7 bg-slate-900 rounded-sm" />
                      <div className="w-7 h-7 bg-slate-900 rounded-sm" />
                    </div>
                    <div className="flex items-center justify-center">
                      <QrCode className="w-10 h-10 text-slate-900" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-7 h-7 bg-slate-900 rounded-sm" />
                      <div className="w-3 h-3 bg-indigo-600 rounded-sm" />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block mb-1">
                    Atau Masukkan Kode 6-Digit:
                  </span>
                  <div className="text-2xl font-black font-mono tracking-widest text-indigo-400 bg-slate-800/80 px-4 py-1.5 rounded-xl border border-indigo-500/30">
                    {pairingCode}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <strong>Persetujuan Bersama:</strong> Anak akan melihat penjelasan ramah mengenai
                  perlindungan keluarga dan aturan batas waktu yang disepakati bersama.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: ANDROID PERMISSIONS CHECKLIST */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Konfigurasi Izin Resmi Android
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Izin ini diaktifkan di ponsel anak agar sistem pengawasan berfungsi optimal:
                </p>
              </div>

              <div className="space-y-2">
                {/* 1. Akses Penggunaan Aplikasi */}
                <div className="p-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Akses Penggunaan (Usage Access)</h4>
                      <p className="text-[10px] text-slate-400">Menghitung durasi screen time & aplikasi</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePermission('usageStats')}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      permissions.usageStats ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                        permissions.usageStats ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Lokasi Latar Belakang */}
                <div className="p-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Lokasi Selalu Izinkan (GPS)</h4>
                      <p className="text-[10px] text-slate-400">Pagar geo sekolah & peringatan keluar zona</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePermission('backgroundLocation')}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      permissions.backgroundLocation ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                        permissions.backgroundLocation ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Tampilkan di Atas Aplikasi Lain */}
                <div className="p-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Tampilan di Atas Aplikasi Lain</h4>
                      <p className="text-[10px] text-slate-400">Menampilkan layar kunci saat jam istirahat</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePermission('overlayDisplay')}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      permissions.overlayDisplay ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                        permissions.overlayDisplay ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* 4. Layanan Aksesibilitas / Admin Perangkat */}
                <div className="p-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Layanan Aksesibilitas (Pengawasan)</h4>
                      <p className="text-[10px] text-slate-400">Mencegah uninstall tanpa persetujuan ortu</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePermission('accessibilityService')}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      permissions.accessibilityService ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                        permissions.accessibilityService ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* 5. Optimasi Baterai Bebas */}
                <div className="p-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <BatteryCharging className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Aktivitas Latar Belakang Tanpa Batas</h4>
                      <p className="text-[10px] text-slate-400">Mencegah Android mematikan proses saat standby</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePermission('batteryUnrestricted')}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      permissions.batteryUnrestricted ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                        permissions.batteryUnrestricted ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PARENTAL PIN PROTECTION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-100">
                  Tetapkan PIN Pengawas Orang Tua
                </h3>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  PIN ini digunakan saat Anda ingin membuka kunci layar, mengubah pengaturan, atau
                  mencopot aplikasi dari ponsel anak.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl space-y-3">
                <label className="block text-slate-300 font-semibold text-center">
                  PIN Orang Tua (4 Digit):
                </label>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-11 h-12 rounded-xl bg-slate-800 border-2 border-indigo-500/40 flex items-center justify-center text-lg font-black font-mono text-indigo-300"
                    >
                      {pinInput[i] || '•'}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {[ '1', '2', '3', '4' ].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPinInput(n.repeat(4))}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] text-slate-400 font-mono cursor-pointer"
                    >
                      Set {n.repeat(4)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-400 flex items-start gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Dengan proteksi PIN ini, anak tidak dapat menonaktifkan izin atau mengubah pengaturan
                  pengawasan tanpa sepengetahuan orang tua.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 animate-in zoom-in duration-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-100">
                  Perangkat Berhasil Dikonfigurasi!
                </h3>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Ponsel <span className="text-slate-200 font-semibold">{profile.deviceName}</span> telah
                  terhubung aman dengan akun pengawasan orang tua.
                </p>
              </div>

              {/* Status Checklist Card */}
              <div className="bg-slate-900/80 border border-slate-700/70 p-3.5 rounded-2xl text-left space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-200 font-semibold border-b border-slate-700/60 pb-1.5">
                  <span>Status Layanan Pengawasan:</span>
                  <span className="text-emerald-400 font-bold">Aktif 100%</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pelacakan GPS & Geofence Sekolah aktif</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Batas waktu layar & jadwal jam tidur aktif</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Proteksi PIN orang tua aktif (4-digit)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Notifikasi latar belakang resmi berjalan</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-3 border-t border-slate-700/80 bg-slate-900/40 flex items-center justify-between gap-2">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => {
                sounds.playChime();
                setStep(step + 1);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer ml-auto"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mulai Memantau</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
