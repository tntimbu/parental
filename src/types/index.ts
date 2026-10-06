export type AppCategory = 'Edukasi' | 'Game' | 'Media Sosial' | 'Hiburan' | 'Produktivitas';

export interface AppUsageItem {
  id: string;
  name: string;
  packageName: string;
  category: AppCategory;
  icon: string; // emoji or icon name
  timeSpentMinutes: number;
  dailyLimitMinutes: number; // 0 means no limit
  isBlocked: boolean;
  lastOpened: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'safe' | 'danger'; // Zona Aman vs Zona Bahaya
  latitude: number;
  longitude: number;
  radiusMeters: number;
  notifyOnEntry: boolean;
  notifyOnExit: boolean;
  address: string;
  color: string;
}

export interface LocationBreadcrumb {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  address: string;
  speedKmH: number;
  batteryLevel: number;
  activity: 'Diam' | 'Berjalan' | 'Berkendara' | 'Bersepeda';
}

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  grade: string;
  deviceName: string;
  deviceModel: string;
  batteryLevel: number;
  isCharging: boolean;
  networkType: '5G' | '4G' | 'Wi-Fi';
  signalStrength: number; // 1 - 4
  isLocked: boolean;
  lockReason?: string;
  lastSyncTime: string;
  currentActivity: string;
  currentApp: string;
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'sos' | 'geofence' | 'screentime' | 'battery' | 'app_blocked' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
}

export interface SnapshotPhoto {
  id: string;
  timestamp: string;
  dataUrl: string;
  cameraType: 'front' | 'back';
  caption: string;
  locationName: string;
}

export type ActiveTab = 'overview' | 'screen' | 'location' | 'apps' | 'camera';
export type AppMode = 'parent' | 'child';
