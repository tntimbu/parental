import React from 'react';
import { Shield, Tv, MapPin, Sliders, Camera } from 'lucide-react';
import { useParentGuard } from '../context/ParentGuardContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useParentGuard();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Ringkasan', icon: Shield },
    { id: 'screen', label: 'Layar Live', icon: Tv },
    { id: 'location', label: 'Lokasi GPS', icon: MapPin },
    { id: 'apps', label: 'Aplikasi', icon: Sliders },
    { id: 'camera', label: 'Cek Sekitar', icon: Camera },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-indigo-400' : 'text-slate-400'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight truncate max-w-full ${
                  isActive ? 'text-indigo-300 font-semibold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
