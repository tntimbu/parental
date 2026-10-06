import React from 'react';
import {
  X,
  UserCheck,
  Smartphone,
  Shield,
  MapPin,
  Clock,
  Tv,
  Camera,
  AlertTriangle,
  Lock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useParentGuard } from '../../context/ParentGuardContext';
import { sounds } from '../../utils/audio';

interface RoleSelectorModalProps {
  onClose: () => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({ onClose }) => {
  const { appMode, setAppMode, profile } = useParentGuard();

  const handleSelectRole = (mode: 'parent' | 'child') => {
    sounds.playChime();
    setAppMode(mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-850 border border-slate-700/80 rounded-3xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
              Pilihan Akun & Peran
            </span>
            <h2 className="text-sm font-bold text-slate-100">
              Siapa yang Menggunakan HP Ini?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-slate-300">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sama seperti aplikasi <strong>Google Family Link</strong> atau <strong>Life360</strong> di Play Store,
            aplikasi ini memiliki 2 peran berbeda:
          </p>

          {/* CARD 1: PARENT MODE */}
          <div
            onClick={() => handleSelectRole('parent')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
              appMode === 'parent'
                ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900/80 border-slate-700/70 hover:border-slate-600 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  👨‍👩‍👧
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-100">1. Akun Orang Tua (Ayah / Ibu)</h3>
                    {appMode === 'parent' && (
                      <span className="text-[9px] bg-indigo-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                        Aktif Sekarang
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-indigo-300 font-medium mt-0.5">
                    Dasbor Kendali & Pemantauan Penuh
                  </p>
                </div>
              </div>
            </div>

            {/* Features list */}
            <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Lacak lokasi GPS & buat pagar aman (Geofence)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Atur batas durasi aplikasi & jadwal jam tidur</span>
              </div>
              <div className="flex items-center gap-2">
                <Tv className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Lihat cermin layar anak (*screen mirroring*) real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Periksa situasi kamera sekitar & sensor suara (dB)</span>
              </div>
            </div>

            <button
              type="button"
              className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
            >
              <span>{appMode === 'parent' ? 'Sedang Digunakan (Dasbor Ortu)' : 'Buka Akun Orang Tua'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 2: CHILD COMPANION MODE */}
          <div
            onClick={() => handleSelectRole('child')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
              appMode === 'child'
                ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/80 border-slate-700/70 hover:border-slate-600 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  👦
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-100">2. Ponsel Anak (Rafi Athalla)</h3>
                    {appMode === 'child' && (
                      <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
                        Aktif Sekarang
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-300 font-medium mt-0.5">
                    Aplikasi Pendamping di HP Anak
                  </p>
                </div>
              </div>
            </div>

            {/* Features list */}
            <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Menampilkan sisa waktu layar yang boleh dimainkan anak</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Tombol Darurat SOS Merah untuk memanggil orang tua</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Dilindungi PIN Orang Tua agar anak tidak bisa mencopot aplikasi</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Terima pesan penting dan pengingat dari Ayah/Ibu</span>
              </div>
            </div>

            <button
              type="button"
              className="mt-3 w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-600/30"
            >
              <span>{appMode === 'child' ? 'Sedang Digunakan (Ponsel Anak)' : 'Jadikan Tampilan Ponsel Anak'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Practical Multi-Device Setup Guide */}
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-indigo-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Cara Praktis Menggunakan 2 Ponsel Nyata:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 pl-1 leading-relaxed">
              <li>
                <strong>Di HP Orang Tua:</strong> Buka link <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">tntimbu.github.io/parental</code> dan pilih <strong>Akun Orang Tua</strong>.
              </li>
              <li>
                <strong>Di HP Anak:</strong> Buka link yang sama di HP anak Anda dan pilih <strong>Ponsel Anak</strong>.
              </li>
              <li>
                Kedua HP akan terhubung. Saat anak menekan SOS di HP-nya, HP Anda akan berdering nyaring!
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700/80 bg-slate-900/40 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
