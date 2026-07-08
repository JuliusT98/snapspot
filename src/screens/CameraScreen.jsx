import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, CameraOff, Loader2, MapPin, MapPinOff } from 'lucide-react';
import { useCamera } from '../hooks/useCamera.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { saveSnap } from '../lib/db.js';
import { useToast } from '../components/Toast.jsx';

// Kriterium #4: Kamera (getUserMedia) + Geolocation, kombiniert auf einem Screen.
// Der Standort wird beim Start der Kamera automatisch mit ermittelt und
// beim Auslösen zum Foto gespeichert (Foto funktioniert auch ohne Standort).
export function CameraScreen() {
  const { videoRef, active, error, start, stop, capture } = useCamera();
  const { position, accuracy, status, errorText, locate } = useGeolocation();
  const showToast = useToast();
  const [lastSnap, setLastSnap] = useState(null);

  const toggleCamera = () => {
    if (active) {
      stop();
    } else {
      start();
      locate();
    }
  };

  const takePhoto = async () => {
    const image = capture();
    if (!image) return;
    const snap = {
      id: Date.now(),
      image,
      createdAt: new Date().toISOString(),
      location: position,
    };
    await saveSnap(snap);
    setLastSnap(snap);
    showToast(position ? 'Foto mit Standort gespeichert' : 'Foto gespeichert');
  };

  const locationChip = {
    idle: { icon: MapPin, text: 'Standort inaktiv', cls: 'text-slate-400' },
    locating: { icon: Loader2, text: 'Standort wird ermittelt …', cls: 'text-sky-400', spin: true },
    success: { icon: MapPin, text: `Standort erfasst (±${accuracy} m)`, cls: 'text-green-400' },
    error: { icon: MapPinOff, text: errorText ?? 'Standort nicht verfügbar', cls: 'text-red-400' },
    unsupported: { icon: MapPinOff, text: 'Geolocation nicht unterstützt', cls: 'text-red-400' },
  }[status];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover ${active ? '' : 'hidden'}`}
        />
        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
            <CameraOff size={40} strokeWidth={1.5} />
            <p className="text-sm">{error ?? 'Kamera ist aus'}</p>
          </div>
        )}

        {/* Standort-Status als Chip über dem Sucher */}
        <div className="absolute left-3 top-3">
          <button
            onClick={locate}
            className={`flex items-center gap-1.5 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-medium backdrop-blur ${locationChip.cls}`}
          >
            <locationChip.icon size={13} className={locationChip.spin ? 'animate-spin' : ''} />
            {locationChip.text}
          </button>
        </div>

        {/* Letzte Aufnahme als Mini-Thumbnail (führt zur Galerie) */}
        {lastSnap && (
          <Link to={`/gallery/${lastSnap.id}`} className="absolute bottom-3 left-3">
            <img
              src={lastSnap.image}
              alt="Letzte Aufnahme"
              className="h-14 w-14 rounded-xl border-2 border-slate-100/80 object-cover shadow-lg"
            />
          </Link>
        )}
      </div>

      <div className="flex items-center justify-center gap-8">
        <button
          onClick={toggleCamera}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5
                     text-sm font-medium transition-colors hover:bg-slate-700"
        >
          {active ? <CameraOff size={16} /> : <Camera size={16} />}
          {active ? 'Stoppen' : 'Kamera starten'}
        </button>

        {/* Auslöser wie in nativen Kamera-Apps: weißer Kreis mit Ring */}
        <button
          onClick={takePhoto}
          disabled={!active}
          aria-label="Foto aufnehmen"
          className="grid h-18 w-18 place-items-center rounded-full border-4 border-white/85
                     transition-transform enabled:active:scale-90 disabled:opacity-30"
        >
          <span className="h-14 w-14 rounded-full bg-white" />
        </button>
      </div>
    </div>
  );
}
