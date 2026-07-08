import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, ExternalLink, MapPin, MapPinOff, Trash2 } from 'lucide-react';
import { deleteSnap, getSnap } from '../lib/db.js';
import { osmUrl } from '../hooks/useGeolocation.js';
import { formatSnapDate } from '../lib/format.js';
import { useToast } from '../components/Toast.jsx';

export function SnapDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const [snap, setSnap] = useState(undefined); // undefined = lädt, null = nicht gefunden

  useEffect(() => {
    getSnap(Number(id)).then(setSnap);
  }, [id]);

  if (snap === undefined) return null;

  if (snap === null) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-slate-400">
        <p className="text-sm">Foto nicht gefunden.</p>
        <Link to="/gallery" className="text-sm font-semibold text-sky-400">Zur Galerie</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm('Dieses Foto wirklich löschen?')) return;
    await deleteSnap(snap.id);
    showToast('Foto gelöscht');
    navigate('/gallery');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-slate-100"
        >
          <ArrowLeft size={16} /> Zurück
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 rounded-xl bg-red-400/15 px-3 py-2 text-sm font-semibold
                     text-red-400 transition-colors hover:bg-red-400/25"
        >
          <Trash2 size={15} /> Löschen
        </button>
      </div>

      <img
        src={snap.image}
        alt={`Schnappschuss vom ${formatSnapDate(snap.createdAt)}`}
        className="w-full rounded-3xl border border-slate-800"
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm">
        <div className="flex items-center gap-2.5 text-slate-300">
          <Clock size={16} className="text-sky-400" />
          {formatSnapDate(snap.createdAt)} Uhr
        </div>
        {snap.location ? (
          <>
            <div className="flex items-center gap-2.5 text-slate-300">
              <MapPin size={16} className="text-sky-400" />
              {snap.location.latitude.toFixed(5)}°, {snap.location.longitude.toFixed(5)}°
            </div>
            <div className="flex gap-2 pt-1">
              <Link
                to={`/map?focus=${snap.id}`}
                className="flex items-center gap-1.5 rounded-xl bg-sky-400/15 px-3 py-2 text-xs
                           font-semibold text-sky-400 transition-colors hover:bg-sky-400/25"
              >
                <MapPin size={13} /> Auf Karte zeigen
              </Link>
              <a
                href={osmUrl(snap.location.latitude, snap.location.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2
                           text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800"
              >
                <ExternalLink size={13} /> OpenStreetMap
              </a>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2.5 text-slate-400">
            <MapPinOff size={16} /> Kein Standort gespeichert
          </div>
        )}
      </div>
    </div>
  );
}
