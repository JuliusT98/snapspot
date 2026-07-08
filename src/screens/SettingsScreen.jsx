import { useEffect, useState } from 'react';
import { CheckCircle2, Download, HardDrive, Images, Trash2, Wifi, WifiOff } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt.js';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { useSnaps } from '../hooks/useSnaps.js';
import { useToast } from '../components/Toast.jsx';

function formatBytes(bytes) {
  if (!bytes) return '0 MB';
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <span className="flex items-center gap-2.5 text-sm text-slate-300">
        <Icon size={16} className="text-sky-400" /> {label}
      </span>
      <span className="text-sm font-semibold">{children}</span>
    </div>
  );
}

export function SettingsScreen() {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const online = useOnlineStatus();
  const { snaps, clearAll } = useSnaps();
  const showToast = useToast();
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    navigator.storage?.estimate?.().then((est) => setUsage(est.usage));
  }, [snaps.length]);

  const handleInstall = async () => {
    const outcome = await promptInstall();
    if (outcome === 'accepted') showToast('App wird installiert');
  };

  const handleClearAll = async () => {
    if (!window.confirm(`Wirklich alle ${snaps.length} Fotos unwiderruflich löschen?`)) return;
    await clearAll();
    showToast('Alle Fotos gelöscht');
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-bold">Einstellungen</h2>

      <section className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900">
        <Row icon={online ? Wifi : WifiOff} label="Netzwerk">
          <span className={online ? 'text-green-400' : 'text-red-400'}>
            {online ? 'Online' : 'Offline'}
          </span>
        </Row>
        <Row icon={Images} label="Gespeicherte Fotos">{snaps.length}</Row>
        <Row icon={HardDrive} label="Belegter Speicher">
          {usage === null ? '–' : formatBytes(usage)}
        </Row>
      </section>

      {installed ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-green-400/30 bg-green-400/10 px-4 py-3.5 text-sm text-green-400">
          <CheckCircle2 size={16} /> Als App installiert
        </div>
      ) : (
        <button
          onClick={handleInstall}
          disabled={!canInstall}
          className="flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3.5
                     text-sm font-semibold text-white transition-colors hover:bg-sky-400
                     disabled:opacity-40 disabled:hover:bg-sky-500"
        >
          <Download size={16} />
          {canInstall ? 'App installieren' : 'Installation aktuell nicht verfügbar'}
        </button>
      )}

      <button
        onClick={handleClearAll}
        disabled={snaps.length === 0}
        className="flex items-center justify-center gap-2 rounded-2xl bg-red-400/15 px-4 py-3.5
                   text-sm font-semibold text-red-400 transition-colors hover:bg-red-400/25
                   disabled:opacity-40"
      >
        <Trash2 size={16} /> Alle Fotos löschen
      </button>
    </div>
  );
}
