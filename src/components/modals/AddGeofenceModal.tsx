import React, { useState } from 'react';
import { X, Shield, AlertTriangle, MapPin } from 'lucide-react';
import { useParentGuard } from '../../context/ParentGuardContext';

interface AddGeofenceModalProps {
  onClose: () => void;
}

export const AddGeofenceModal: React.FC<AddGeofenceModalProps> = ({ onClose }) => {
  const { addGeofence, currentLocation } = useParentGuard();

  const [name, setName] = useState('');
  const [type, setType] = useState<'safe' | 'danger'>('safe');
  const [radiusMeters, setRadiusMeters] = useState<number>(150);
  const [address, setAddress] = useState('Jl. Tebet Timur Dalam No. 25, Jakarta');
  const [notifyOnEntry, setNotifyOnEntry] = useState(true);
  const [notifyOnExit, setNotifyOnExit] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addGeofence({
      name: name.trim(),
      type,
      latitude: currentLocation.latitude + (Math.random() - 0.5) * 0.003,
      longitude: currentLocation.longitude + (Math.random() - 0.5) * 0.003,
      radiusMeters,
      notifyOnEntry,
      notifyOnExit,
      address,
      color: type === 'safe' ? '#10b981' : '#ef4444',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-100">Tambah Pagar Geo (Geofence)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Zone Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nama Tempat / Zona</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Rumah Nenek / Les Renang"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Type Selector (Safe vs Danger) */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Jenis Zona</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('safe')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-semibold transition-all cursor-pointer ${
                  type === 'safe'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Zona Aman</span>
              </button>

              <button
                type="button"
                onClick={() => setType('danger')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-semibold transition-all cursor-pointer ${
                  type === 'danger'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Zona Bahaya</span>
              </button>
            </div>
          </div>

          {/* Radius Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Radius Area Pengawasan</label>
              <span className="font-mono text-indigo-400 font-bold">{radiusMeters} Meter</span>
            </div>
            <input
              type="range"
              min="50"
              max="600"
              step="25"
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>50m (Ketat)</span>
              <span>300m</span>
              <span>600m (Luas)</span>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Alamat / Patokan</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat patokan lokasi"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Notification toggles */}
          <div className="space-y-2 pt-1 border-t border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Beri tahu saat anak Masuk zona</span>
              <input
                type="checkbox"
                checked={notifyOnEntry}
                onChange={(e) => setNotifyOnEntry(e.target.checked)}
                className="accent-indigo-500 w-4 h-4 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Beri tahu saat anak Keluar zona</span>
              <input
                type="checkbox"
                checked={notifyOnExit}
                onChange={(e) => setNotifyOnExit(e.target.checked)}
                className="accent-indigo-500 w-4 h-4 rounded"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold cursor-pointer shadow-md shadow-indigo-600/30"
            >
              Simpan Pagar Geo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
