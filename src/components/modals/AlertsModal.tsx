import React from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Battery,
  CheckCircle,
  Radio,
} from 'lucide-react';
import { useParentGuard } from '../../context/ParentGuardContext';
import { AlertNotification } from '../../types';

interface AlertsModalProps {
  onClose: () => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({ onClose }) => {
  const { alerts, markAlertsAsRead } = useParentGuard();

  const getAlertIcon = (type: AlertNotification['type']) => {
    switch (type) {
      case 'sos':
        return <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />;
      case 'geofence':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'screentime':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'battery':
        return <Battery className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-100">Pusat Peringatan & Notifikasi</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">{alerts.length} Total Peringatan</span>
          <button
            onClick={markAlertsAsRead}
            className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            Tandai Semua Dibaca
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Tidak ada peringatan baru saat ini.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-2xl border transition-all ${
                  alert.severity === 'critical'
                    ? 'bg-rose-950/40 border-rose-600/60 shadow-lg shadow-rose-950/20'
                    : alert.read
                    ? 'bg-slate-900/50 border-slate-800'
                    : 'bg-slate-900/90 border-indigo-500/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h4
                        className={`text-xs font-bold ${
                          alert.severity === 'critical' ? 'text-rose-300' : 'text-slate-200'
                        }`}
                      >
                        {alert.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700/80 bg-slate-900/40">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
