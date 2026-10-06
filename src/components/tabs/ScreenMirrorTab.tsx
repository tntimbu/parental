import React, { useState, useRef, useEffect } from 'react';
import {
  Tv,
  Camera,
  Lock,
  Unlock,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Radio,
  Eye,
  AlertCircle,
  Share2,
  Maximize,
} from 'lucide-react';
import { useParentGuard } from '../../context/ParentGuardContext';
import { sounds } from '../../utils/audio';

export const ScreenMirrorTab: React.FC = () => {
  const {
    profile,
    isDeviceLocked,
    toggleLockDevice,
    activeSimulatedApp,
    setActiveSimulatedApp,
    captureSnapshot,
    isRealScreenCaptureActive,
    realScreenStream,
    startRealScreenCapture,
    stopRealScreenCapture,
    sendChildNudge,
  } = useParentGuard();

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [screenshotFlash, setScreenshotFlash] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(38);
  const [fps, setFps] = useState<number>(59);
  const [activeNudgeBanner, setActiveNudgeBanner] = useState<string | null>(null);

  const realVideoRef = useRef<HTMLVideoElement>(null);

  // Bind real media stream to video element
  useEffect(() => {
    if (realVideoRef.current && realScreenStream) {
      realVideoRef.current.srcObject = realScreenStream;
    }
  }, [realScreenStream]);

  // Jitter FPS and latency slightly for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyMs(Math.floor(32 + Math.random() * 12));
      setFps(Math.floor(58 + Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTakeScreenshot = () => {
    setScreenshotFlash(true);
    sounds.playShutter();
    captureSnapshot('front', `Screenshot Layar: Aplikasi ${activeSimulatedApp}`);
    setTimeout(() => setScreenshotFlash(false), 200);
  };

  const handleSendQuickWarning = () => {
    const text = 'Waktu layar hampir habis, segera selesaikan ya! ⏰';
    setActiveNudgeBanner(text);
    sendChildNudge(text);
    setTimeout(() => setActiveNudgeBanner(null), 4000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Header & Stream Quality Status */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-100">Mirroring Layar Langsung</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-slate-400">
              {isRealScreenCaptureActive ? 'Sumber Layar Asli (Web API)' : `Aplikasi: ${activeSimulatedApp}`}
            </p>
          </div>
        </div>

        {/* Live Stream Telemetry */}
        <div className="text-right text-[10px] font-mono text-slate-400">
          <div className="text-emerald-400 font-bold">{fps} FPS · {latencyMs}ms</div>
          <div className="text-slate-500">1080×2400 FHD+</div>
        </div>
      </section>

      {/* Screen Mirroring Display Container */}
      <div className="relative rounded-3xl bg-slate-950 border-2 border-slate-800 overflow-hidden shadow-2xl aspect-[9/16] max-h-[520px] mx-auto flex flex-col justify-between">
        {/* Flash effect when taking screenshot */}
        {screenshotFlash && (
          <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200 pointer-events-none" />
        )}

        {/* Live Overlay Header inside screen */}
        <div className="absolute top-0 left-0 right-0 z-20 px-3 py-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-[11px] text-white">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
            <span className="font-semibold text-[10px] uppercase tracking-wider text-rose-300">LIVE</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-slate-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Terhubung E2EE</span>
          </div>
        </div>

        {/* Floating Parent Message Alert on Child's Screen */}
        {activeNudgeBanner && (
          <div className="absolute top-12 left-3 right-3 z-30 bg-amber-500 text-slate-950 p-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-slate-950" />
            <p className="text-[11px] font-bold leading-tight">{activeNudgeBanner}</p>
          </div>
        )}

        {/* Locked Screen Overlay */}
        {isDeviceLocked ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center z-10">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-3 shadow-lg shadow-rose-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Perangkat Dikunci</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              Layar HP anak saat ini menampilkan instruksi istirahat dari orang tua.
            </p>
            <button
              onClick={() => toggleLockDevice()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              Buka Kunci Layar
            </button>
          </div>
        ) : isRealScreenCaptureActive ? (
          /* REAL SCREEN CAPTURE VIDEO ELEMENT */
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            <video
              ref={realVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          /* HIGH-FIDELITY SIMULATED CHILD SCREEN OS */
          <div className="flex-1 flex flex-col justify-between p-3 pt-10 pb-4 bg-slate-900 text-slate-100 select-none">
            {activeSimulatedApp === 'Duolingo English' && (
              <div className="flex-1 flex flex-col justify-between bg-slate-900 rounded-2xl p-4 border border-emerald-500/20">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🦉</span>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400">Duolingo - Level 5</h4>
                      <p className="text-[10px] text-slate-400">Materi: Daily Conversation</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">🔥 14 Hari</span>
                </div>

                <div className="my-auto text-center space-y-3 py-4">
                  <p className="text-xs text-slate-400">Terjemahkan kalimat ini:</p>
                  <p className="text-sm font-bold text-slate-100 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    "I am learning science at school."
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {['Saya', 'sedang', 'belajar', 'sains', 'di', 'sekolah'].map((w, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-medium">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center text-[10px] text-emerald-400 font-medium">
                  ✓ Aktivitas Edukasi Produktif
                </div>
              </div>
            )}

            {activeSimulatedApp === 'YouTube Kids' && (
              <div className="flex-1 flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-rose-500/20">
                {/* Simulated video playback */}
                <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg mb-2">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    Sains Seru: Mengapa Langit Berwarna Biru?
                  </span>
                  <div className="absolute bottom-1 left-2 right-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-3/5 h-full bg-rose-500" />
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">08:14 / 12:30</span>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">▶️</span>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Kanal Sains Anak Indonesia</p>
                      <p className="text-[10px] text-slate-400">Diverifikasi untuk usia 9-12 tahun</p>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-800/60 rounded-xl text-[10px] text-slate-400">
                    Komentar dinonaktifkan oleh orang tua. Mode penjelajahan aman aktif.
                  </div>
                </div>
              </div>
            )}

            {activeSimulatedApp === 'Roblox' && (
              <div className="flex-1 flex flex-col justify-between bg-slate-950 rounded-2xl p-4 border border-indigo-500/30">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🧱</span>
                    <span className="text-xs font-bold text-slate-200">Roblox: Blox Obby Parkour</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">60 FPS</span>
                </div>

                <div className="my-auto text-center py-6 space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-3xl">
                    🏃
                  </div>
                  <p className="text-xs font-bold text-slate-200">Level 24 - Sky Castle</p>
                  <p className="text-[10px] text-amber-400">
                    Peringatan: Tersisa 1 menit sebelum batas harian tercapai!
                  </p>
                </div>

                <div className="bg-slate-900/80 p-2 rounded-xl text-center text-[10px] text-slate-400">
                  Waktu bermain: 44 / 45 mnt
                </div>
              </div>
            )}

            {activeSimulatedApp === 'WhatsApp Family' && (
              <div className="flex-1 flex flex-col justify-between bg-slate-950 rounded-2xl p-3 border border-emerald-500/20">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="text-lg">💬</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Grup Keluarga Ceria</h5>
                    <p className="text-[9px] text-emerald-400">Mama, Ayah, Rafi</p>
                  </div>
                </div>

                <div className="space-y-2 my-auto py-2 text-xs">
                  <div className="bg-slate-800 p-2 rounded-xl rounded-tl-none max-w-[80%] text-[11px] text-slate-200">
                    <span className="text-[9px] text-indigo-400 block font-semibold">Mama</span>
                    Rafi, nanti pulang sekolah jam berapa Nak?
                  </div>
                  <div className="bg-emerald-600/80 p-2 rounded-xl rounded-tr-none max-w-[80%] ml-auto text-[11px] text-white">
                    Jam 15:30 Ma, ada les Kumon sebentar.
                  </div>
                </div>

                <div className="p-2 bg-slate-900 rounded-xl text-[10px] text-slate-400 text-center">
                  Chat terenkripsi & kontak tak dikenal otomatis diblokir.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stream Action Toolbar at bottom of screen viewer */}
        <div className="relative z-20 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleTakeScreenshot}
              className="p-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl transition-all cursor-pointer shadow-sm"
              title="Ambil Tangkapan Layar (Screenshot)"
            >
              <Camera className="w-4 h-4 text-indigo-400" />
            </button>
            <button
              onClick={() => toggleLockDevice()}
              className={`p-2 rounded-xl transition-all cursor-pointer shadow-sm ${
                isDeviceLocked
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200'
              }`}
              title={isDeviceLocked ? 'Buka Kunci' : 'Kunci Layar'}
            >
              {isDeviceLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={handleSendQuickWarning}
              className="p-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl transition-all cursor-pointer shadow-sm text-xs"
              title="Kirim Peringatan Langsung ke Layar"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {isRealScreenCaptureActive ? (
              <button
                onClick={stopRealScreenCapture}
                className="px-2.5 py-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-[11px] font-semibold cursor-pointer"
              >
                Hentikan Stream Asli
              </button>
            ) : (
              <button
                onClick={startRealScreenCapture}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-semibold cursor-pointer flex items-center gap-1 shadow-md shadow-indigo-600/20"
                title="Bagi Layar Browser Nyata dengan Screen Capture API"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Uji Layar Asli</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Simulated Child App Switcher */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-200">Simulasi Aktivitas Anak di Ponsel</h3>
          <span className="text-[10px] text-slate-400">Pilih aplikasi untuk melihat</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'Duolingo English', label: 'Duolingo', icon: '🦉', desc: 'Belajar Bahasa' },
            { id: 'YouTube Kids', label: 'YouTube Kids', icon: '▶️', desc: 'Video Edukasi' },
            { id: 'Roblox', label: 'Roblox Game', icon: '🧱', desc: 'Main Game' },
            { id: 'WhatsApp Family', label: 'WhatsApp', icon: '💬', desc: 'Chat Keluarga' },
          ].map((app) => (
            <button
              key={app.id}
              onClick={() => {
                setActiveSimulatedApp(app.id);
                stopRealScreenCapture();
              }}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeSimulatedApp === app.id && !isRealScreenCaptureActive
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{app.icon}</span>
              <div className="truncate">
                <p className="text-xs font-bold leading-tight truncate">{app.label}</p>
                <p className="text-[10px] text-slate-400 truncate">{app.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Screen Mirroring Information */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">💡 Fitur Berbagi Layar Real-time:</p>
        <p>
          Anda dapat menekan tombol <strong>"Uji Layar Asli"</strong> untuk menguji tangkapan layar browser
          Anda sendiri secara nyata menggunakan Web Screen Capture API, atau menggunakan simulasi interaktif
          di atas untuk memantau aktivitas anak.
        </p>
      </div>
    </div>
  );
};
