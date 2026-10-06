import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  Heart,
  Send,
  Lock,
  Smartphone,
  ChevronLeft,
  Volume2,
  BookOpen,
} from 'lucide-react';
import { useParentGuard } from '../context/ParentGuardContext';
import { sounds } from '../utils/audio';
import { GuideModal } from './modals/GuideModal';
import { DevicePairingModal } from './modals/DevicePairingModal';

export const ChildModeView: React.FC = () => {
  const {
    profile,
    setAppMode,
    triggerSosSignal,
    lastParentNudge,
    clearChildNudge,
    isDeviceLocked,
    grantExtraTime,
  } = useParentGuard();

  const [sosSent, setSosSent] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showPairingModal, setShowPairingModal] = useState<boolean>(false);
  const [showPinPrompt, setShowPinPrompt] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [showUninstallBlocked, setShowUninstallBlocked] = useState<boolean>(false);

  const handleSosClick = () => {
    triggerSosSignal();
    setSosSent(true);
    setTimeout(() => setSosSent(false), 5000);
  };

  const handleRequestTime = () => {
    grantExtraTime('app-1', 30);
    setRequestSent(true);
    sounds.playChime();
    setTimeout(() => setRequestSent(false), 4000);
  };

  const handleVerifyPin = (digitString?: string) => {
    const code = digitString || pinInput;
    if (code === '1234') {
      sounds.playChime();
      setShowPinPrompt(false);
      setPinInput('');
      setPinError(false);
      setAppMode('parent');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  return (
    <div className="p-4 space-y-4 min-h-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* Child Top Bar */}
        <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👦</span>
            <div>
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">
                ParentGuard Kids · Mode Ponsel Anak
              </span>
              <h2 className="text-xs font-bold text-slate-100">Hai, {profile.name}!</h2>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>Terhubung dengan Mama & Ayah</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowGuideModal(true)}
              className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 cursor-pointer"
              title="Buku Panduan Anak"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowPinPrompt(true)}
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20 cursor-pointer"
              title="Masuk ke Dasbor Orang Tua (Wajib PIN)"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Ke Ortu</span>
            </button>
          </div>
        </div>

        {/* Notice for Parent Testing Child Mode */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[11px] text-amber-200 flex items-start gap-2 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Mode Perangkat Anak:</strong> Tampilan ini adalah antarmuka ramah yang akan dilihat oleh anak
            di ponselnya. Tekan <strong>"Ke Ortu"</strong> di pojok kanan atas (PIN: <strong className="text-white">1234</strong>)
            untuk kembali ke Dasbor Orang Tua.
          </p>
        </div>

        {/* Priority Message from Parent Pop-up Banner */}
        {lastParentNudge && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 rounded-3xl shadow-xl space-y-2 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Volume2 className="w-4 h-4" />
              <span>Pesan Penting dari Orang Tua:</span>
            </div>
            <p className="text-sm font-black leading-snug">"{lastParentNudge}"</p>
            <div className="text-right">
              <button
                onClick={clearChildNudge}
                className="px-3 py-1 bg-slate-950 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
              >
                Mengerti 👍
              </button>
            </div>
          </div>
        )}

        {/* Device Locked Overlay for Child */}
        {isDeviceLocked && (
          <div className="p-6 bg-rose-950/40 border-2 border-rose-600/50 rounded-3xl text-center space-y-3 shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Waktu Istirahat Aktif</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Orang tua telah mengunci perangkat untuk waktu belajar dan istirahat. Hubungi orang tua
              jika membutuhkan akses darurat.
            </p>
          </div>
        )}

        {/* Big Emergency SOS Button */}
        <section className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 shadow-xl text-center space-y-3">
          <div>
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Bantuan Keselamatan Darurat
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tekan tombol ini jika kamu merasa dalam bahaya atau butuh bantuan segera
            </p>
          </div>

          <button
            onClick={handleSosClick}
            className={`w-36 h-36 mx-auto rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-95 shadow-2xl cursor-pointer ${
              sosSent
                ? 'bg-emerald-600 text-white ring-8 ring-emerald-500/30 animate-pulse'
                : 'bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-500 text-white ring-8 ring-rose-500/20 hover:ring-rose-500/40 shadow-rose-600/40'
            }`}
          >
            <AlertTriangle className="w-10 h-10 mb-1" />
            <span className="text-lg font-black tracking-wider">SOS</span>
            <span className="text-[10px] font-semibold opacity-90">
              {sosSent ? 'TERKIRIM!' : 'DARURAT'}
            </span>
          </button>

          {sosSent && (
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-semibold animate-in fade-in">
              🚨 Sinyal SOS dan koordinat GPS telah dikirimkan ke ponsel Orang Tua!
            </div>
          )}
        </section>

        {/* Screen Time Allowance Card */}
        <section className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-slate-100">Waktu Layar Kamu</h3>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-400">36 Menit Tersisa</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Gunakan waktu layarmu dengan bijak untuk belajar dan hiburan sehat.
          </p>

          <button
            onClick={handleRequestTime}
            disabled={requestSent}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{requestSent ? 'Permintaan Terkirim ke Ortu ✓' : 'Minta Tambahan Waktu 30 Menit'}</span>
          </button>
        </section>

        {/* Transparency status: Child knows what is active */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Perlindungan Aktif di Ponsel:</span>
            <span className="text-emerald-400">Aktif</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Lokasi GPS dibagikan dengan keluarga</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Pagar Geo zona aman sekolah & rumah aktif</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Pemberitahuan muncul jika orang tua memeriksa layar/lingkungan</span>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-amber-400 font-medium">🛡️ Proteksi Anti-Uninstall Android:</span>
              <span className="text-emerald-400 font-bold">AKTIF</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPairingModal(true)}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] text-slate-300 font-semibold cursor-pointer text-center"
              >
                Detail Izin Sistem
              </button>

              <button
                onClick={() => setShowUninstallBlocked(true)}
                className="flex-1 py-1.5 px-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-[10px] font-semibold cursor-pointer text-center"
              >
                Uji Hapus / Copot Kontrol
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Switch back button */}
      <div className="pt-4 text-center">
        <button
          onClick={() => setShowPinPrompt(true)}
          className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
        >
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Masuk ke Dasbor Orang Tua (PIN Diperlukan)</span>
        </button>
      </div>

      {/* PIN Verification Modal */}
      {showPinPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 w-full max-w-xs shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Verifikasi PIN Orang Tua
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Masukkan PIN pengawas 4-digit untuk membuka dasbor (Default: <strong className="text-slate-200">1234</strong>).
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="flex justify-center gap-2.5 py-1">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-9 h-11 rounded-xl border-2 flex items-center justify-center text-lg font-bold font-mono transition-all ${
                    pinError
                      ? 'border-rose-500 bg-rose-500/10 text-rose-400 animate-shake'
                      : pinInput.length > idx
                      ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  {pinInput[idx] ? '●' : ''}
                </div>
              ))}
            </div>

            {pinError && (
              <p className="text-[11px] text-rose-400 font-medium animate-in fade-in">
                PIN Salah! Masukkan PIN 1234.
              </p>
            )}

            {/* Quick keypad simulation */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    sounds.playChime();
                    if (key === 'C') {
                      setPinInput('');
                    } else if (key === 'OK') {
                      handleVerifyPin();
                    } else {
                      if (pinInput.length < 4) {
                        const next = pinInput + key;
                        setPinInput(next);
                        if (next.length === 4) {
                          handleVerifyPin(next);
                        }
                      }
                    }
                  }}
                  className="py-2.5 bg-slate-900 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer active:scale-95"
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowPinPrompt(false);
                setPinInput('');
              }}
              className="text-xs text-slate-400 hover:text-slate-300 cursor-pointer pt-1"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Simulated Android Anti-Uninstall Warning Modal */}
      {showUninstallBlocked && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-800 border-2 border-rose-500/50 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3.5 text-center">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-rose-300">
                Pencopotan Aplikasi Diblokir Sistem!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aplikasi ini dilindungi oleh <strong>Android Device Administrator</strong> dan pengawasan
                orang tua. Anak tidak dapat menghapus atau menonaktifkan izin tanpa PIN resmi orang tua.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 text-[11px] text-slate-400 text-left space-y-1">
              <p className="font-semibold text-slate-300">Keamanan Pengawasan:</p>
              <p>✓ Menghindari anak menghapus kontrol secara sepihak.</p>
              <p>✓ Menghindari penghentian paksa di menu Pengaturan HP.</p>
            </div>

            <button
              onClick={() => setShowUninstallBlocked(false)}
              className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Mengerti, Tutup
            </button>
          </div>
        </div>
      )}

      {/* Guide Modal */}
      {showGuideModal && <GuideModal onClose={() => setShowGuideModal(false)} />}

      {/* Device Pairing & Permission Modal */}
      {showPairingModal && <DevicePairingModal onClose={() => setShowPairingModal(false)} />}
    </div>
  );
};
