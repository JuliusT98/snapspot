import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { useSnaps } from '../hooks/useSnaps.js';
import { SnapCard } from '../components/SnapCard.jsx';

export function GalleryScreen() {
  const { snaps, loading } = useSnaps();

  if (loading) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">Meine Schnappschüsse</h2>
        <span className="rounded-full bg-sky-400/15 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
          {snaps.length}
        </span>
      </div>

      {snaps.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-800 py-16 text-slate-400">
          <Camera size={36} strokeWidth={1.5} />
          <p className="text-sm">Noch keine Fotos – nimm dein erstes auf!</p>
          <Link
            to="/"
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
          >
            Zur Kamera
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {snaps.map((snap) => (
            <SnapCard key={snap.id} snap={snap} />
          ))}
        </div>
      )}
    </div>
  );
}
