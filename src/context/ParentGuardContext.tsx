import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ActiveTab,
  AlertNotification,
  AppMode,
  AppUsageItem,
  ChildProfile,
  GeofenceZone,
  LocationBreadcrumb,
  SnapshotPhoto,
} from '../types';
import {
  initialAlerts,
  initialAppUsage,
  initialBreadcrumbs,
  initialChildProfile,
  initialGeofences,
  initialSnapshots,
} from '../mock/data';
import { sounds } from '../utils/audio';

interface CurrentLocationState {
  latitude: number;
  longitude: number;
  address: string;
  speedKmH: number;
  activity: 'Diam' | 'Berjalan' | 'Berkendara' | 'Bersepeda';
  accuracyMeters: number;
}

interface ParentGuardContextType {
  profile: ChildProfile;
  geofences: GeofenceZone[];
  breadcrumbs: LocationBreadcrumb[];
  currentLocation: CurrentLocationState;
  appUsage: AppUsageItem[];
  alerts: AlertNotification[];
  snapshots: SnapshotPhoto[];
  activeTab: ActiveTab;
  appMode: AppMode;
  isDeviceLocked: boolean;
  activeSimulatedApp: string;
  isRealScreenCaptureActive: boolean;
  realScreenStream: MediaStream | null;
  isRealCameraActive: boolean;
  realCameraStream: MediaStream | null;
  cameraFacing: 'front' | 'back';
  isRealGpsActive: boolean;
  isSimulatedMovement: boolean;
  ambientSoundDb: number;
  isFlashlightOn: boolean;
  lastParentNudge: string | null;
  unreadAlertCount: number;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setAppMode: (mode: AppMode) => void;
  toggleLockDevice: (reason?: string) => void;
  toggleAppBlocked: (appId: string) => void;
  setAppDailyLimit: (appId: string, minutes: number) => void;
  grantExtraTime: (appId: string, minutes: number) => void;
  addGeofence: (zone: Omit<GeofenceZone, 'id'>) => void;
  removeGeofence: (id: string) => void;
  triggerSosSignal: () => void;
  startRealScreenCapture: () => Promise<boolean>;
  stopRealScreenCapture: () => void;
  startRealCamera: (facing?: 'front' | 'back') => Promise<boolean>;
  stopRealCamera: () => void;
  setCameraFacing: (facing: 'front' | 'back') => void;
  toggleFlashlight: () => void;
  captureSnapshot: (cameraType: 'front' | 'back', caption?: string) => void;
  sendChildNudge: (message: string) => void;
  clearChildNudge: () => void;
  markAlertsAsRead: () => void;
  toggleSimulatedMovement: () => void;
  toggleRealDeviceGps: () => void;
  setActiveSimulatedApp: (app: string) => void;
  ringChildAlarm: () => void;
}

const ParentGuardContext = createContext<ParentGuardContextType | undefined>(undefined);

export const ParentGuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ChildProfile>(() => {
    const saved = localStorage.getItem('pg_profile');
    return saved ? JSON.parse(saved) : initialChildProfile;
  });

  const [geofences, setGeofences] = useState<GeofenceZone[]>(() => {
    const saved = localStorage.getItem('pg_geofences');
    return saved ? JSON.parse(saved) : initialGeofences;
  });

  const [breadcrumbs, setBreadcrumbs] = useState<LocationBreadcrumb[]>(() => {
    const saved = localStorage.getItem('pg_breadcrumbs');
    return saved ? JSON.parse(saved) : initialBreadcrumbs;
  });

  const [currentLocation, setCurrentLocation] = useState<CurrentLocationState>({
    latitude: -6.2415,
    longitude: 106.8568,
    address: 'SD Pelita Bangsa, Menteng Dalam, Jakarta Selatan',
    speedKmH: 0,
    activity: 'Diam',
    accuracyMeters: 4,
  });

  const [appUsage, setAppUsage] = useState<AppUsageItem[]>(() => {
    const saved = localStorage.getItem('pg_app_usage');
    return saved ? JSON.parse(saved) : initialAppUsage;
  });

  const [alerts, setAlerts] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem('pg_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  const [snapshots, setSnapshots] = useState<SnapshotPhoto[]>(() => {
    const saved = localStorage.getItem('pg_snapshots');
    return saved ? JSON.parse(saved) : initialSnapshots;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [appMode, setAppMode] = useState<AppMode>('parent');
  const [activeSimulatedApp, setActiveSimulatedApp] = useState<string>('Duolingo English');
  const [isDeviceLocked, setIsDeviceLocked] = useState<boolean>(false);
  const [isRealScreenCaptureActive, setIsRealScreenCaptureActive] = useState<boolean>(false);
  const [realScreenStream, setRealScreenStream] = useState<MediaStream | null>(null);

  const [isRealCameraActive, setIsRealCameraActive] = useState<boolean>(false);
  const [realCameraStream, setRealCameraStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [isFlashlightOn, setIsFlashlightOn] = useState<boolean>(false);
  const [ambientSoundDb, setAmbientSoundDb] = useState<number>(42);

  const [isRealGpsActive, setIsRealGpsActive] = useState<boolean>(false);
  const [isSimulatedMovement, setIsSimulatedMovement] = useState<boolean>(false);
  const [lastParentNudge, setLastParentNudge] = useState<string | null>(null);

  const gpsWatchIdRef = useRef<number | null>(null);
  const syncChannelRef = useRef<BroadcastChannel | null>(null);

  // Sync state across browser tabs
  useEffect(() => {
    try {
      syncChannelRef.current = new BroadcastChannel('parentguard_sync');
      syncChannelRef.current.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'LOCK_TOGGLE') {
          setIsDeviceLocked(payload.locked);
          setProfile((p) => ({ ...p, isLocked: payload.locked, lockReason: payload.reason }));
        } else if (type === 'SOS_SIGNAL') {
          sounds.playEmergencySiren();
          setAlerts((prev) => [payload.alert, ...prev]);
        } else if (type === 'NUDGE') {
          setLastParentNudge(payload.message);
          sounds.playChime();
        } else if (type === 'APP_CHANGE') {
          setActiveSimulatedApp(payload.app);
        }
      };
    } catch {
      // BroadcastChannel fallback if not supported
    }

    return () => {
      syncChannelRef.current?.close();
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('pg_profile', JSON.stringify(profile));
    localStorage.setItem('pg_geofences', JSON.stringify(geofences));
    localStorage.setItem('pg_breadcrumbs', JSON.stringify(breadcrumbs));
    localStorage.setItem('pg_app_usage', JSON.stringify(appUsage));
    localStorage.setItem('pg_alerts', JSON.stringify(alerts));
    localStorage.setItem('pg_snapshots', JSON.stringify(snapshots));
  }, [profile, geofences, breadcrumbs, appUsage, alerts, snapshots]);

  // Ambient sound simulator when camera tab is open
  useEffect(() => {
    const interval = setInterval(() => {
      // Natural ambient room dB variation (38 dB to 65 dB)
      setAmbientSoundDb((prev) => {
        const delta = (Math.random() - 0.48) * 6;
        return Math.min(85, Math.max(34, Math.round(prev + delta)));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Simulated movement animation
  useEffect(() => {
    if (!isSimulatedMovement) return;

    let step = 0;
    // Route from school to home
    const route = [
      { lat: -6.2415, lng: 106.8568, addr: 'SD Pelita Bangsa (Pintu Gerbang)', speed: 0, act: 'Diam' as const },
      { lat: -6.2405, lng: 106.8558, addr: 'Jl. Prof. Dr. Soepomo (Mobil Jemputan)', speed: 25, act: 'Berkendara' as const },
      { lat: -6.2392, lng: 106.8540, addr: 'Jl. Tebet Barat Dalam Raya', speed: 32, act: 'Berkendara' as const },
      { lat: -6.2385, lng: 106.8528, addr: 'Tikungan Jl. Tebet Barat Dalam VII', speed: 14, act: 'Berkendara' as const },
      { lat: -6.2382, lng: 106.8524, addr: 'Rumah (Tebet Barat Dalam)', speed: 0, act: 'Diam' as const },
    ];

    const timer = setInterval(() => {
      step = (step + 1) % route.length;
      const pt = route[step];
      setCurrentLocation({
        latitude: pt.lat,
        longitude: pt.lng,
        address: pt.addr,
        speedKmH: pt.speed,
        activity: pt.act,
        accuracyMeters: 5,
      });

      // Add to breadcrumb
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
      setBreadcrumbs((prev) => [
        {
          id: `loc-${Date.now()}`,
          timestamp: timeStr,
          latitude: pt.lat,
          longitude: pt.lng,
          address: pt.addr,
          speedKmH: pt.speed,
          batteryLevel: 74,
          activity: pt.act,
        },
        ...prev.slice(0, 15),
      ]);
    }, 6000);

    return () => clearInterval(timer);
  }, [isSimulatedMovement]);

  const toggleLockDevice = (reason = 'Waktu istirahat & belajar') => {
    const newLockState = !isDeviceLocked;
    setIsDeviceLocked(newLockState);
    setProfile((prev) => ({
      ...prev,
      isLocked: newLockState,
      lockReason: newLockState ? reason : '',
    }));

    // Broadcast
    syncChannelRef.current?.postMessage({
      type: 'LOCK_TOGGLE',
      payload: { locked: newLockState, reason },
    });

    const newAlert: AlertNotification = {
      id: `alt-${Date.now()}`,
      timestamp: 'Baru saja',
      title: newLockState ? 'Perangkat Dikunci Jarak Jauh' : 'Perangkat Dibuka Kunci',
      message: newLockState
        ? `Layar perangkat Rafi telah dikunci oleh orang tua (${reason}).`
        : 'Akses perangkat Rafi telah dipulihkan.',
      type: 'info',
      severity: 'low',
      read: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    sounds.playChime();
  };

  const toggleAppBlocked = (appId: string) => {
    setAppUsage((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const nextBlocked = !app.isBlocked;
          sounds.playChime();
          return { ...app, isBlocked: nextBlocked };
        }
        return app;
      })
    );
  };

  const setAppDailyLimit = (appId: string, minutes: number) => {
    setAppUsage((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, dailyLimitMinutes: minutes } : app))
    );
  };

  const grantExtraTime = (appId: string, minutes: number) => {
    setAppUsage((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const currentLimit = app.dailyLimitMinutes || app.timeSpentMinutes;
          return { ...app, dailyLimitMinutes: currentLimit + minutes, isBlocked: false };
        }
        return app;
      })
    );
    sounds.playChime();
  };

  const addGeofence = (zone: Omit<GeofenceZone, 'id'>) => {
    const newZone: GeofenceZone = {
      ...zone,
      id: `geo-${Date.now()}`,
    };
    setGeofences((prev) => [...prev, newZone]);
    sounds.playChime();
  };

  const removeGeofence = (id: string) => {
    setGeofences((prev) => prev.filter((g) => g.id !== id));
  };

  const triggerSosSignal = () => {
    sounds.playEmergencySiren();
    const newAlert: AlertNotification = {
      id: `alt-${Date.now()}`,
      timestamp: 'Baru saja',
      title: '🚨 SINYAL SOS DARURAT DARI ANAK!',
      message: `Rafi telah menekan tombol darurat SOS dari lokasi: ${currentLocation.address}!`,
      type: 'sos',
      severity: 'critical',
      read: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    syncChannelRef.current?.postMessage({
      type: 'SOS_SIGNAL',
      payload: { alert: newAlert },
    });
  };

  const startRealScreenCapture = async (): Promise<boolean> => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        setRealScreenStream(stream);
        setIsRealScreenCaptureActive(true);

        stream.getVideoTracks()[0].onended = () => {
          stopRealScreenCapture();
        };
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Real screen capture declined or unsupported:', err);
      return false;
    }
  };

  const stopRealScreenCapture = () => {
    if (realScreenStream) {
      realScreenStream.getTracks().forEach((track) => track.stop());
      setRealScreenStream(null);
    }
    setIsRealScreenCaptureActive(false);
  };

  const startRealCamera = async (facing: 'front' | 'back' = cameraFacing): Promise<boolean> => {
    try {
      if (realCameraStream) {
        realCameraStream.getTracks().forEach((t) => t.stop());
      }
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing === 'front' ? 'user' : 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        setRealCameraStream(stream);
        setIsRealCameraActive(true);
        setCameraFacing(facing);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Real camera access declined or unavailable:', err);
      return false;
    }
  };

  const stopRealCamera = () => {
    if (realCameraStream) {
      realCameraStream.getTracks().forEach((t) => t.stop());
      setRealCameraStream(null);
    }
    setIsRealCameraActive(false);
  };

  const toggleFlashlight = () => {
    setIsFlashlightOn((prev) => !prev);
  };

  const captureSnapshot = (cameraType: 'front' | 'back', caption?: string) => {
    sounds.playShutter();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const newPhoto: SnapshotPhoto = {
      id: `snap-${Date.now()}`,
      timestamp: timeStr,
      dataUrl: '', // simulated canvas or real frame
      cameraType,
      caption: caption || `Tangkapan situasi ${cameraType === 'front' ? 'Kamera Depan' : 'Kamera Belakang'}`,
      locationName: currentLocation.address,
    };

    setSnapshots((prev) => [newPhoto, ...prev]);
  };

  const sendChildNudge = (message: string) => {
    setLastParentNudge(message);
    sounds.playChime();
    syncChannelRef.current?.postMessage({
      type: 'NUDGE',
      payload: { message },
    });
  };

  const clearChildNudge = () => {
    setLastParentNudge(null);
  };

  const markAlertsAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const toggleSimulatedMovement = () => {
    setIsSimulatedMovement((prev) => !prev);
  };

  const toggleRealDeviceGps = () => {
    if (isRealGpsActive) {
      if (gpsWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
        gpsWatchIdRef.current = null;
      }
      setIsRealGpsActive(false);
    } else {
      if ('geolocation' in navigator) {
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            setCurrentLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              address: `Koordinat GPS Nyata (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
              speedKmH: Math.round((pos.coords.speed || 0) * 3.6),
              activity: (pos.coords.speed || 0) > 4 ? 'Berkendara' : 'Diam',
              accuracyMeters: Math.round(pos.coords.accuracy || 10),
            });
            setIsRealGpsActive(true);
          },
          (err) => {
            console.warn('Geolocation error:', err);
            setIsRealGpsActive(false);
          },
          { enableHighAccuracy: true }
        );
        gpsWatchIdRef.current = id;
      }
    }
  };

  const ringChildAlarm = () => {
    sounds.playEmergencySiren();
    sendChildNudge('🔔 Panggilan Suara Penting dari Orang Tua!');
  };

  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  return (
    <ParentGuardContext.Provider
      value={{
        profile,
        geofences,
        breadcrumbs,
        currentLocation,
        appUsage,
        alerts,
        snapshots,
        activeTab,
        appMode,
        isDeviceLocked,
        activeSimulatedApp,
        isRealScreenCaptureActive,
        realScreenStream,
        isRealCameraActive,
        realCameraStream,
        cameraFacing,
        isRealGpsActive,
        isSimulatedMovement,
        ambientSoundDb,
        isFlashlightOn,
        lastParentNudge,
        unreadAlertCount,
        setActiveTab,
        setAppMode,
        toggleLockDevice,
        toggleAppBlocked,
        setAppDailyLimit,
        grantExtraTime,
        addGeofence,
        removeGeofence,
        triggerSosSignal,
        startRealScreenCapture,
        stopRealScreenCapture,
        startRealCamera,
        stopRealCamera,
        setCameraFacing,
        toggleFlashlight,
        captureSnapshot,
        sendChildNudge,
        clearChildNudge,
        markAlertsAsRead,
        toggleSimulatedMovement,
        toggleRealDeviceGps,
        setActiveSimulatedApp,
        ringChildAlarm,
      }}
    >
      {children}
    </ParentGuardContext.Provider>
  );
};

export const useParentGuard = () => {
  const ctx = useContext(ParentGuardContext);
  if (!ctx) {
    throw new Error('useParentGuard must be used within ParentGuardProvider');
  }
  return ctx;
};
