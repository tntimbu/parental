import React, { useState } from 'react';
import {
  X,
  BookOpen,
  UserCheck,
  ShieldAlert,
  Tv,
  MapPin,
  Clock,
  Camera,
  AlertTriangle,
  Smartphone,
  CheckCircle2,
  Lock,
  Compass,
} from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  const [activeRole, setActiveRole] = useState<'parent' | 'child'>('parent');

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-100">Buku Panduan Penggunaan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Segmented Switcher */}
        <div className="p-3 bg-slate-900/60 border-b border-slate-700/60 flex items-center gap-2">
          <button
            onClick={() => setActiveRole('parent')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeRole === 'parent'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Panduan Orang Tua</span>
          </button>

          <button
            onClick={() => setActiveRole('child')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeRole === 'child'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Panduan Anak</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300">
          {activeRole === 'parent' ? (
            <>
              {/* Parent Introduction */}
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 space-y-1">
                <p className="font-bold text-indigo-300">Selamat Datang di ParentGuard untuk Orang Tua</p>
                <p className="leading-relaxed">
                  Aplikasi ini dirancang untuk mendampingi putra-putri Anda secara aman, transparan, dan edukatif
                  melalui 5 tab navigasi utama di bagian bawah layar.
                </p>
              </div>

              {/* Step 1: Screen Mirroring */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Tv className="w-4 h-4" />
                  <h4>1. Berbagi Layar Secara Langsung (Tab "Layar Live")</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  <li>
                    <strong>Melihat Aktivitas:</strong> Anda dapat melihat apa yang sedang dibuka anak
                    (Duolingo, YouTube Kids, Roblox, WhatsApp).
                  </li>
                  <li>
                    <strong>Uji Layar Asli:</strong> Tekan tombol <span className="text-indigo-300">"Uji Layar Asli"</span> untuk mencoba transmisi layar nyata browser Anda dengan Web Screen Capture API.
                  </li>
                  <li>
                    <strong>Tangkapan Layar & Peringatan:</strong> Klik ikon kamera untuk menyimpan screenshot, atau kirimkan peringatan instan ke layar ponsel anak jika waktu bermain hampir habis.
                  </li>
                </ul>
              </div>

              {/* Step 2: GPS & Geofence */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <MapPin className="w-4 h-4" />
                  <h4>2. Pelacakan GPS & Pagar Geo (Tab "Lokasi GPS")</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  <li>
                    <strong>Pantau Posisi:</strong> Lihat titik anak di peta Leaflet beserta status kecepatan (misal: 0 km/j saat di kelas, atau 25 km/j saat mobil jemputan berjalan).
                  </li>
                  <li>
                    <strong>Tambah Pagar Geo (Geofence):</strong> Klik <span className="text-indigo-300 font-semibold">+ Tambah Zona</span> untuk membuat zona aman (Rumah, Sekolah) atau zona bahaya (Sungai/Konstruksi) dengan radius 50m – 600m.
                  </li>
                  <li>
                    <strong>Notifikasi Masuk/Keluar:</strong> Anda akan otomatis menerima peringatan jika anak meninggalkan zona aman yang ditentukan.
                  </li>
                  <li>
                    <strong>Uji GPS Nyata / Simulasi:</strong> Anda dapat menekan tombol <em>"Uji GPS Asli"</em> untuk menggunakan koordinat riil perangkat Anda, atau <em>"Simulasi Rute"</em> untuk melihat pergerakan otomatis.
                  </li>
                </ul>
              </div>

              {/* Step 3: App Usage */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <Clock className="w-4 h-4" />
                  <h4>3. Kontrol Aplikasi & Batas Waktu (Tab "Aplikasi")</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  <li>
                    <strong>Atur Batas Harian:</strong> Pilih aplikasi (misal: Roblox 45 menit), sesuaikan batas dengan slider.
                  </li>
                  <li>
                    <strong>Kunci / Blokir Aplikasi:</strong> Tekan tombol <span className="text-rose-300 font-semibold">"Blokir"</span> untuk menghentikan akses aplikasi tertentu secara instan.
                  </li>
                  <li>
                    <strong>Jadwal Jam Tidur:</strong> Aktifkan penguncian otomatis pada pukul 20:30 – 06:00 WIB agar anak istirahat tepat waktu.
                  </li>
                </ul>
              </div>

              {/* Step 4: Remote Camera */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Camera className="w-4 h-4" />
                  <h4>4. Akses Kamera Jarak Jauh (Tab "Cek Sekitar")</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  <li>
                    <strong>Lihat Lingkungan:</strong> Periksa situasi fisik di mana anak berada (apakah di ruang kelas, perpustakaan, atau lapangan).
                  </li>
                  <li>
                    <strong>Kamera Depan / Belakang:</strong> Ganti sudut pandang kamera dengan tombol rotasi.
                  </li>
                  <li>
                    <strong>Sensor Suara Sekitar (dB):</strong> Pantau desibel suara ruangan (misal: 42 dB hening, 70 dB ramai).
                  </li>
                  <li>
                    <strong>Uji Kamera Nyata:</strong> Tekan tombol <span className="text-emerald-300 font-semibold">"Uji Kamera Asli"</span> untuk mengaktifkan webcam Anda secara langsung.
                  </li>
                </ul>
              </div>

              {/* Step 5: Quick Actions */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Lock className="w-4 h-4" />
                  <h4>5. Tindakan Darurat & Dering Nyaring</h4>
                </div>
                <p>
                  Gunakan tombol <strong>Volume (Deringkan HP)</strong> di pojok kanan atas untuk membunyikan
                  ponsel anak dengan nada nyaring jika anak tidak membalas atau ponsel terselip, serta
                  tombol <strong>"Kunci Layar"</strong> kapan saja.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Child Guide */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                <p className="font-bold text-amber-300">Panduan untuk Anak (Mode Pendamping)</p>
                <p className="leading-relaxed">
                  Aplikasi ini membantu kamu belajar mengatur waktu bermain HP secara sehat dan memastikan
                  kamu selalu terhubung aman dengan Mama dan Ayah.
                </p>
              </div>

              {/* Child Rule 1: SOS Button */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <h4>1. Tombol Darurat SOS Merah</h4>
                </div>
                <p className="leading-relaxed">
                  Jika kamu tersesat, merasa dalam bahaya, atau membutuhkan pertolongan cepat, tekan tombol
                  <strong> SOS</strong> yang besar di layar. Ponsel orang tua akan berbunyi nyaring seketika
                  dan lokasi GPS terkinimu langsung terkirim!
                </p>
              </div>

              {/* Child Rule 2: Screen Time */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Clock className="w-4 h-4" />
                  <h4>2. Memantau Sisa Waktu Layar</h4>
                </div>
                <p className="leading-relaxed">
                  Kamu bisa melihat sisa waktu layar hari ini di kartu beranda. Jika waktu hampir habis dan kamu
                  masih perlu mengerjakan PR sekolah, kamu bisa menekan tombol:
                </p>
                <div className="p-2 bg-indigo-950/60 rounded-xl text-indigo-300 font-semibold text-center">
                  "Minta Tambahan Waktu 30 Menit"
                </div>
              </div>

              {/* Child Rule 3: Parent Messages */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4>3. Pesan Khusus dari Orang Tua</h4>
                </div>
                <p className="leading-relaxed">
                  Jika Mama atau Ayah mengirimkan pengingat (seperti waktu makan siang atau jemputan sekolah),
                  pesan akan muncul di bagian atas layar. Kamu cukup menekan tombol <strong>"Mengerti 👍"</strong>
                  setelah membacanya.
                </p>
              </div>

              {/* Child Rule 4: Transparency */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Compass className="w-4 h-4" />
                  <h4>4. Privasi & Transparansi</h4>
                </div>
                <p className="leading-relaxed">
                  Aplikasi ini bekerja secara jujur dan transparan. Saat orang tua melakukan pemeriksaan
                  situasi sekitar, kamu akan selalu melihat indikator aktif di ponselmu sehingga kalian
                  saling menjaga kepercayaan.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700/80 bg-slate-900/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {activeRole === 'parent' ? '💡 Tip: Uji fitur di kedua mode' : '🛡️ Tetap aman & cerdas berteknologi'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
