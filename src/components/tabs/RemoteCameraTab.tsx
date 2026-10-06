import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RotateCcw,
  Flashlight,
  Volume2,
  Sparkles,
  ShieldCheck,
  Radio,
  Image as ImageIcon,
  CheckCircle2,
  Maximize2,
  VolumeX,
  MapPin,
  Navigation,
} from 'lucide-react';
import { useParentGuard } from '../../context/ParentGuardContext';
import { sounds } from '../../utils/audio';

export const RemoteCameraTab: React.FC = () => {
  const {
    currentLocation,
    snapshots,
    captureSnapshot,
    isRealCameraActive,
    realCameraStream,
    cameraFacing,
    startRealCamera,
    stopRealCamera,
    setCameraFacing,
    isFlashlightOn,
    toggleFlashlight,
    ambientSoundDb,
    setActiveTab,
  } = useParentGuard();

  const [simulatedScene, setSimulatedScene] = useState<'classroom' | 'library' | 'desk' | 'yard'>('classroom');
  const [isShutterActive, setIsShutterActive] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const realVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (realVideoRef.current && realCameraStream) {
      realVideoRef.current.srcObject = realCameraStream;
    }
  }, [realCameraStream]);

  const handleCapture = () => {
    setIsShutterActive(true);
    sounds.playShutter();
    const sceneTitles = {
      classroom: 'Ruang Kelas (Papan Tulis & Meja Belajar)',
      library: 'Perpustakaan Sekolah (Suasana Tenang)',
      desk: 'Meja Belajar Kamar (Buku & Alat Tulis)',
      yard: 'Halaman Luar / Lapangan Olahraga',
    };
    captureSnapshot(
      cameraFacing,
      isRealCameraActive ? 'Foto Kamera Asli' : `Situasi: ${sceneTitles[simulatedScene]}`
    );
    setTimeout(() => setIsShutterActive(false), 200);
  };

  const handleToggleRealCam = async () => {
    if (isRealCameraActive) {
      stopRealCamera();
    } else {
      await startRealCamera(cameraFacing);
    }
  };

  const handleSwitchFacing = async () => {
    const nextFacing = cameraFacing === 'front' ? 'back' : 'front';
    setCameraFacing(nextFacing);
    if (isRealCameraActive) {
      await startRealCamera(nextFacing);
    }
  };

  // Sound environment description
  const getSoundStatus = (db: number) => {
    if (db < 45) return { label: 'Suasana Hening / Belajar Mandiri', color: 'text-emerald-400' };
    if (db < 65) return { label: 'Percakapan Normal / Guru Mengajar', color: 'text-indigo-400' };
    return { label: 'Suasana Ramai / Jam Istirahat', color: 'text-amber-400' };
  };

  const soundInfo = getSoundStatus(ambientSoundDb);

  return (
    <div className="p-4 space-y-4">
      {/* Header Info */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-100">Pemeriksaan Situasi Sekitar</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-slate-400">
              {isRealCameraActive ? 'Kamera Asli Terhubung' : `Kamera ${cameraFacing === 'front' ? 'Depan' : 'Belakang'}`}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleRealCam}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isRealCameraActive
              ? 'bg-rose-600 border-rose-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-600/20'
          }`}
        >
          {isRealCameraActive ? 'Matikan Kamera Asli' : 'Uji Kamera Asli'}
        </button>
      </section>

      {/* Child Location & Geotag Context Card */}
      <section className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block font-medium">
              Lokasi Fisik Anak Saat Ini:
            </span>
            <p className="text-xs font-bold text-slate-200 truncate max-w-[210px]">
              {currentLocation.address}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('location')}
          className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl text-[10px] font-semibold border border-indigo-500/40 flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
        >
          <Navigation className="w-3 h-3" />
          <span>Lihat Peta</span>
        </button>
      </section>

      {/* Main Camera Viewfinder */}
      <div className="relative rounded-3xl bg-slate-950 border-2 border-slate-800 overflow-hidden shadow-2xl aspect-[4/3] max-h-[380px] flex flex-col justify-between">
        {/* Shutter flash animation */}
        {isShutterActive && (
          <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200 pointer-events-none" />
        )}

        {/* Top Viewfinder HUD */}
        <div className="relative z-20 px-3 py-2 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-[11px] text-white">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
            <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
            <span className="font-semibold text-[10px] uppercase text-rose-300">LIVE FEED</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFlashlight}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isFlashlightOn
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
              }`}
              title="Nyalakan Lampu Kilat Jarak Jauh"
            >
              <Flashlight className="w-3.5 h-3.5" />
            </button>
            <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-slate-300">
              {cameraFacing === 'front' ? 'Kamera Depan' : 'Kamera Belakang'}
            </div>
          </div>
        </div>

        {/* Viewfinder Content: Real Webcam Stream or Simulated Surroundings */}
        {isRealCameraActive ? (
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            <video
              ref={realVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          /* Simulated Realistic Child Environments with High-Definition SVG & Visuals */
          <div className="flex-1 relative flex items-center justify-center bg-slate-900 overflow-hidden select-none">
            {simulatedScene === 'classroom' && (
              <div className="w-full h-full relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-800 to-slate-900 text-slate-200">
                {/* Chalkboard / Class illustration */}
                <div className="w-full max-w-xs h-28 bg-emerald-950/80 border-4 border-amber-800 rounded-xl p-2.5 shadow-inner relative flex flex-col justify-between">
                  <div className="text-[11px] font-mono text-emerald-200">
                    Matematika: Bangun Datar & Ruang
                  </div>
                  <div className="text-center text-xs font-semibold text-emerald-300">
                    Rumus Luas = p × l
                  </div>
                  <div className="text-right text-[9px] text-emerald-400">Guru: Bu Ratna</div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-3xl">🎒</span>
                  <span className="text-3xl">📐</span>
                  <span className="text-3xl">✏️</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 font-medium">
                  Situasi: Rafi sedang duduk di baris ke-2 ruang kelas 5A
                </span>
              </div>
            )}

            {simulatedScene === 'library' && (
              <div className="w-full h-full relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-950/30 to-slate-900 text-slate-200">
                <div className="text-4xl mb-2">📚 📖 🪑</div>
                <p className="text-sm font-bold text-slate-100">Perpustakaan Sekolah</p>
                <p className="text-[11px] text-slate-400 mt-1 text-center">
                  Suasana tenang, anak sedang membaca buku ensiklopedia sains.
                </p>
              </div>
            )}

            {simulatedScene === 'desk' && (
              <div className="w-full h-full relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-950/40 to-slate-900 text-slate-200">
                <div className="text-4xl mb-2">💻 📝 💡</div>
                <p className="text-sm font-bold text-slate-100">Meja Belajar</p>
                <p className="text-[11px] text-slate-400 mt-1 text-center">
                  Buku tugas terbuka, lampu meja belajar aktif.
                </p>
              </div>
            )}

            {simulatedScene === 'yard' && (
              <div className="w-full h-full relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-emerald-950/40 to-slate-900 text-slate-200">
                <div className="text-4xl mb-2">⚽ 🌳 🏫</div>
                <p className="text-sm font-bold text-slate-100">Lapangan Sekolah</p>
                <p className="text-[11px] text-slate-400 mt-1 text-center">
                  Area halaman terbuka saat jam istirahat atau olahraga.
                </p>
              </div>
            )}

            {/* Flashlight light simulation */}
            {isFlashlightOn && (
              <div className="absolute inset-0 bg-amber-200/20 mix-blend-overlay pointer-events-none" />
            )}

            {/* Persistent GPS Location Watermark on Viewfinder */}
            <div className="absolute bottom-12 left-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-[9px] font-mono text-slate-300 flex items-center justify-between z-10">
              <span className="text-emerald-400 font-bold truncate">
                📍 {currentLocation.address}
              </span>
              <span className="text-slate-400 shrink-0 ml-2">
                GPS: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        )}

        {/* Viewfinder Bottom Controls & Ambient Sound HUD */}
        <div className="relative z-20 px-3 py-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between">
          {/* Ambient Sound Decibel Meter */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px]">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <div>
              <span className="font-mono font-bold text-slate-100">{ambientSoundDb} dB</span>
              <span className="text-slate-400 ml-1 hidden min-[360px]:inline">· Suara Sekitar</span>
            </div>
          </div>

          {/* Shutter Button */}
          <button
            onClick={handleCapture}
            className="w-11 h-11 rounded-full bg-white hover:bg-slate-200 text-slate-950 border-4 border-slate-900 shadow-xl flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
            title="Ambil Foto Situasi Sekitar Sekarang"
          >
            <Camera className="w-5 h-5 text-slate-900" />
          </button>

          {/* Switch Camera Facing (Front / Back) */}
          <button
            onClick={handleSwitchFacing}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all cursor-pointer text-[10px] flex items-center gap-1"
            title="Ganti Kamera Depan / Belakang"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>{cameraFacing === 'front' ? 'Belakang' : 'Depan'}</span>
          </button>
        </div>
      </div>

      {/* Ambient Sound Environment Details */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100">Status Kebisingan Ruangan</h3>
            <p className={`text-[11px] font-medium ${soundInfo.color}`}>{soundInfo.label}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-200">{ambientSoundDb} dB</span>
          <span className="text-[10px] text-slate-400 block">Normal</span>
        </div>
      </section>

      {/* Simulated Scene Selector */}
      {!isRealCameraActive && (
        <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 shadow-md">
          <h3 className="text-xs font-bold text-slate-200 mb-2">Pilih Lingkungan Simulasi</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'classroom', label: 'Ruang Kelas', icon: '🏫' },
              { id: 'library', label: 'Perpustakaan', icon: '📚' },
              { id: 'desk', label: 'Meja Belajar', icon: '💻' },
              { id: 'yard', label: 'Lapangan', icon: '⚽' },
            ].map((scene) => (
              <button
                key={scene.id}
                onClick={() => setSimulatedScene(scene.id as typeof simulatedScene)}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  simulatedScene === scene.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>{scene.icon}</span>
                <span>{scene.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Snapshot History Gallery */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-100">Galeri Foto Sekitar Terkini</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{snapshots.length} Foto</span>
        </div>

        <div className="space-y-2">
          {snapshots.map((snap) => (
            <div
              key={snap.id}
              className="flex items-center justify-between p-2.5 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  {snap.cameraType === 'front' ? 'DEP' : 'BEL'}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">{snap.caption}</h4>
                  <p className="text-[10px] text-slate-400">{snap.locationName}</p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                {snap.timestamp}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Safety and Transparency Ethical Banner */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Pemberitahuan Etis:</strong> Fitur akses kamera sekitar ini
          dilengkapi indikator transparan pada perangkat anak untuk memastikan rasa aman, perlindungan,
          serta saling percaya antara orang tua dan anak.
        </p>
      </div>
    </div>
  );
};
