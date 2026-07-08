import { Route, Routes } from 'react-router-dom';
import { Aperture, Wifi, WifiOff } from 'lucide-react';
import { ToastProvider } from './components/Toast.jsx';
import { TabBar } from './components/TabBar.jsx';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import { CameraScreen } from './screens/CameraScreen.jsx';
import { GalleryScreen } from './screens/GalleryScreen.jsx';
import { SnapDetailScreen } from './screens/SnapDetailScreen.jsx';
import { MapScreen } from './screens/MapScreen.jsx';
import { SettingsScreen } from './screens/SettingsScreen.jsx';

function Header() {
  const online = useOnlineStatus();
  return (
    <header
      className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <h1 className="flex items-center gap-2 text-lg font-bold">
          <Aperture size={20} className="text-sky-400" aria-hidden />
          SnapSpot
        </h1>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            online ? 'bg-green-400/15 text-green-400' : 'bg-red-400/15 text-red-400'
          }`}
        >
          {online ? <Wifi size={13} /> : <WifiOff size={13} />}
          {online ? 'Online' : 'Offline'}
        </span>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <div className="flex min-h-dvh flex-col">
        <Header />
        {/* pb-24: Platz für die fixe Bottom-Tab-Bar */}
        <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-24 pt-4">
          <Routes>
            <Route path="/" element={<CameraScreen />} />
            <Route path="/gallery" element={<GalleryScreen />} />
            <Route path="/gallery/:id" element={<SnapDetailScreen />} />
            <Route path="/map" element={<MapScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </main>
        <TabBar />
      </div>
    </ToastProvider>
  );
}
