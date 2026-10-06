/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ParentGuardProvider, useParentGuard } from './context/ParentGuardContext';
import { AndroidFrame } from './components/AndroidFrame';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { OverviewTab } from './components/tabs/OverviewTab';
import { ScreenMirrorTab } from './components/tabs/ScreenMirrorTab';
import { GpsTrackingTab } from './components/tabs/GpsTrackingTab';
import { AppUsageTab } from './components/tabs/AppUsageTab';
import { RemoteCameraTab } from './components/tabs/RemoteCameraTab';
import { ChildModeView } from './components/ChildModeView';

const MainContent: React.FC = () => {
  const { activeTab, appMode } = useParentGuard();

  if (appMode === 'child') {
    return <ChildModeView />;
  }

  return (
    <>
      <TopBar />
      <main className="flex-1 pb-2">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'screen' && <ScreenMirrorTab />}
        {activeTab === 'location' && <GpsTrackingTab />}
        {activeTab === 'apps' && <AppUsageTab />}
        {activeTab === 'camera' && <RemoteCameraTab />}
      </main>
      <BottomNav />
    </>
  );
};

export default function App() {
  return (
    <ParentGuardProvider>
      <AndroidFrame>
        <MainContent />
      </AndroidFrame>
    </ParentGuardProvider>
  );
}
