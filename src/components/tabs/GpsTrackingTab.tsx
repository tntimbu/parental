import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Shield,
  AlertTriangle,
  Plus,
  Trash2,
  Navigation,
  Play,
  Pause,
  Compass,
  Clock,
  Battery,
  Layers,
  LocateFixed,
  Camera,
  X,
  Maximize2,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { useParentGuard } from '../../context/ParentGuardContext';
import { AddGeofenceModal } from '../modals/AddGeofenceModal';
import { sounds } from '../../utils/audio';

export const GpsTrackingTab: React.FC = () => {
  const {
    currentLocation,
    geofences,
    breadcrumbs,
    profile,
    removeGeofence,
    isRealGpsActive,
    toggleRealDeviceGps,
    isSimulatedMovement,
    toggleSimulatedMovement,
    setActiveTab,
    captureSnapshot,
    ambientSoundDb,
    cameraFacing,
    setCameraFacing,
    isRealCameraActive,
  } = useParentGuard();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const childMarkerRef = useRef<L.Marker | null>(null);
  const circlesRef = useRef<L.Circle[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showCameraPeek, setShowCameraPeek] = useState<boolean>(false);
  const [snapshotTaken, setSnapshotTaken] = useState<boolean>(false);

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Map
      const map = L.map(mapContainerRef.current, {
        center: [currentLocation.latitude, currentLocation.longitude],
        zoom: 15,
        zoomControl: false,
      });

      // CartoDB Voyager tiles (clean, high contrast, reliable)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Custom Zoom Control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Remove existing geofence circles
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];

    // Render Geofence circles
    geofences.forEach((zone) => {
      const circle = L.circle([zone.latitude, zone.longitude], {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: zone.type === 'safe' ? 0.15 : 0.25,
        weight: 2,
        radius: zone.radiusMeters,
      }).addTo(map);

      circle.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #1e293b;">
          <b style="color: ${zone.type === 'safe' ? '#059669' : '#dc2626'};">
            ${zone.type === 'safe' ? '🛡️ Zona Aman' : '⚠️ Zona Bahaya'}
          </b>
          <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">${zone.name}</div>
          <div style="font-size: 11px; color: #64748b;">Radius: ${zone.radiusMeters} meter</div>
        </div>
      `);

      circlesRef.current.push(circle);
    });

    // Custom child HTML Marker with pulsing radar ring
    const childIcon = L.divIcon({
      className: 'custom-child-pin',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 40px; height: 40px; background: rgba(99, 102, 241, 0.35); border-radius: 50%; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 28px; height: 28px; background: #4f46e5; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px;">
            👦
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    if (childMarkerRef.current) {
      childMarkerRef.current.setLatLng([currentLocation.latitude, currentLocation.longitude]);
    } else {
      const marker = L.marker([currentLocation.latitude, currentLocation.longitude], {
        icon: childIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #1e293b;">
          <b style="color: #4f46e5;">Lokasi Terkini Rafi</b>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">${currentLocation.address}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Kecepatan: ${currentLocation.speedKmH} km/j</div>
        </div>
      `);
      childMarkerRef.current = marker;
    }

    // Pan map smoothly to child position
    map.panTo([currentLocation.latitude, currentLocation.longitude], { animate: true });

    return () => {
      // Don't destroy on every re-render, keep instance
    };
  }, [currentLocation, geofences]);

  const recenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([currentLocation.latitude, currentLocation.longitude], 16, {
        animate: true,
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Live Status Header & GPS Accuracy */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-100">Pelacakan GPS Real-time</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-300 font-medium truncate max-w-[210px]">
              {currentLocation.address}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-emerald-400 font-bold block">
            {currentLocation.speedKmH > 0 ? `${currentLocation.speedKmH} km/j` : 'Diam (0 km/j)'}
          </span>
          <span className="text-[9px] text-slate-400 font-mono">Akurasi ±{currentLocation.accuracyMeters}m</span>
        </div>
      </section>

      {/* Quick Remote Camera Peek Banner for Location Check */}
      <div className="bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
            <Camera className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100">Kamera Sekitar Lokasi</h3>
            <p className="text-[10px] text-slate-400">
              Lihat visual situasi fisik tempat anak sedang berada
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCameraPeek(!showCameraPeek)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
            showCameraPeek
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{showCameraPeek ? 'Tutup Kamera' : 'Buka Kamera'}</span>
        </button>
      </div>

      {/* Leaflet Map Card */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-2xl h-[360px] bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Live Camera Peek Overlay inside Map */}
        {showCameraPeek && (
          <div className="absolute inset-x-3 bottom-3 top-14 z-30 bg-slate-950/95 border-2 border-emerald-500/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between animate-in zoom-in-95 duration-200">
            {/* Camera Header Overlay */}
            <div className="p-2.5 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between text-xs z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                  Kamera Jarak Jauh Aktif
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('camera')}
                  className="px-2 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                  title="Perbesar ke Layar Kamera Penuh"
                >
                  <Maximize2 className="w-3 h-3 text-indigo-400" />
                  <span>Layar Penuh</span>
                </button>
                <button
                  onClick={() => setShowCameraPeek(false)}
                  className="p-1 text-slate-400 hover:text-white bg-slate-800/90 rounded-lg cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Viewfinder simulation with environment & GPS watermark */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-4 bg-slate-900 text-center select-none overflow-hidden">
              <div className="w-full max-w-[260px] p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 shadow-inner flex flex-col items-center space-y-1.5">
                <span className="text-3xl">🏫 🎒 📖</span>
                <p className="text-xs font-bold text-emerald-300">
                  Situasi: Ruang Kelas SD Pelita Bangsa
                </p>
                <p className="text-[10px] text-slate-400">
                  Anak sedang berada di bangku belajar, suasana belajar kondusif.
                </p>
              </div>

              {/* Watermark GPS on Camera Feed */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm p-1.5 rounded-xl text-left text-[9px] font-mono text-slate-300 flex items-center justify-between border border-white/10">
                <div className="truncate">
                  <span className="text-emerald-400 font-bold block truncate">
                    📍 {currentLocation.address}
                  </span>
                  <span className="text-slate-400">
                    Lat: {currentLocation.latitude.toFixed(4)}, Lng: {currentLocation.longitude.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-indigo-300 shrink-0 ml-2">
                  <Volume2 className="w-3 h-3 text-indigo-400" />
                  <span>{ambientSoundDb} dB</span>
                </div>
              </div>
            </div>

            {/* Viewfinder Bottom Action Controls */}
            <div className="p-2 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs z-10">
              <button
                onClick={() => {
                  setCameraFacing(cameraFacing === 'front' ? 'back' : 'front');
                  sounds.playChime();
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-indigo-400" />
                <span>Kamera {cameraFacing === 'front' ? 'Depan' : 'Belakang'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playShutter();
                  captureSnapshot(cameraFacing, `Foto Lokasi: ${currentLocation.address}`);
                  setSnapshotTaken(true);
                  setTimeout(() => setSnapshotTaken(false), 2500);
                }}
                className="px-3 py-1 bg-white hover:bg-slate-200 text-slate-950 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-md cursor-pointer transition-transform active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-slate-900" />
                <span>{snapshotTaken ? 'Tersimpan ✓' : 'Ambil Foto Lokasi'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Map Controls */}
        <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-2">
          <button
            onClick={recenterMap}
            className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-indigo-400 border border-slate-700 shadow-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            title="Pusatkan ke Posisi Anak"
          >
            <LocateFixed className="w-5 h-5" />
          </button>
        </div>

        {/* Real GPS / Simulation Controls Overlay at Top of Map */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
          <button
            onClick={() => setShowCameraPeek(!showCameraPeek)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border backdrop-blur-md shadow-lg transition-all cursor-pointer flex items-center gap-1 ${
              showCameraPeek
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{showCameraPeek ? 'Tutup Kamera' : 'Kamera Sekitar'}</span>
          </button>

          <button
            onClick={toggleRealDeviceGps}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border backdrop-blur-md shadow-lg transition-all cursor-pointer flex items-center gap-1 ${
              isRealGpsActive
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isRealGpsActive ? 'GPS Asli Aktif' : 'Uji GPS Asli'}</span>
          </button>

          <button
            onClick={toggleSimulatedMovement}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border backdrop-blur-md shadow-lg transition-all cursor-pointer flex items-center gap-1 ${
              isSimulatedMovement
                ? 'bg-indigo-600 border-indigo-500 text-white animate-pulse'
                : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isSimulatedMovement ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulatedMovement ? 'Jeda Rute' : 'Simulasi Rute'}</span>
          </button>
        </div>
      </div>

      {/* Geofencing Zones Management */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200">Pagar Geo (Geofence Terdaftar)</h3>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Zona</span>
          </button>
        </div>

        <div className="space-y-2">
          {geofences.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between p-2.5 bg-slate-900/70 border border-slate-700/60 rounded-xl"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: zone.color }}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-200">{zone.name}</h4>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                        zone.type === 'safe'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {zone.type === 'safe' ? 'Zona Aman' : 'Zona Bahaya'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate max-w-[210px]">{zone.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">{zone.radiusMeters}m</span>
                <button
                  onClick={() => removeGeofence(zone.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Hapus Geofence"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location Breadcrumbs / Movement Timeline */}
      <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-200">Linimasa Lokasi Hari Ini</h3>
        </div>

        <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
          {breadcrumbs.slice(0, 5).map((point, index) => (
            <div key={point.id} className="relative text-xs">
              {/* Dot on timeline */}
              <div
                className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-slate-900 ${
                  index === 0 ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-slate-200">{point.address}</span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                  {point.timestamp}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span>Aktivitas: {point.activity}</span>
                <span>·</span>
                <span className="font-mono">{point.speedKmH} km/j</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Geofence Modal */}
      {showAddModal && <AddGeofenceModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
