import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { formatSnapDate } from '../lib/format.js';

export function SnapCard({ snap }) {
  return (
    <Link
      to={`/gallery/${snap.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-800
                 bg-slate-900 transition-transform hover:-translate-y-0.5"
    >
      <img
        src={snap.image}
        alt={`Schnappschuss vom ${formatSnapDate(snap.createdAt)}`}
        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between
                   bg-slate-950/70 px-3 py-1.5 text-[0.7rem] text-slate-200 backdrop-blur-sm"
      >
        <span>{formatSnapDate(snap.createdAt)}</span>
        {snap.location && <MapPin size={13} className="text-sky-400" />}
      </div>
    </Link>
  );
}
