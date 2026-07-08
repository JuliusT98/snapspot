import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPinOff } from 'lucide-react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useSnaps } from '../hooks/useSnaps.js';
import { formatSnapDate } from '../lib/format.js';

// Leaflets Standard-Marker-Icons funktionieren mit Bundlern nur mit expliziten Pfaden
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Karte auf alle Marker (oder das fokussierte Foto) ausrichten
function FitToSnaps({ snaps, focusId }) {
  const map = useMap();
  useEffect(() => {
    const focused = snaps.find((s) => s.id === focusId);
    if (focused) {
      map.setView([focused.location.latitude, focused.location.longitude], 15);
    } else if (snaps.length > 0) {
      const bounds = L.latLngBounds(snaps.map((s) => [s.location.latitude, s.location.longitude]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [map, snaps, focusId]);
  return null;
}

export function MapScreen() {
  const { snaps, loading } = useSnaps();
  const [searchParams] = useSearchParams();
  const focusId = Number(searchParams.get('focus')) || null;

  if (loading) return null;

  const located = snaps.filter((s) => s.location);

  if (located.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-800 py-16 text-slate-400">
        <MapPinOff size={36} strokeWidth={1.5} />
        <p className="px-8 text-center text-sm">
          Noch keine Fotos mit Standort. Erlaube beim Fotografieren den Standortzugriff, dann erscheinen sie hier.
        </p>
        <Link
          to="/"
          className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
        >
          Zur Kamera
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">Foto-Karte</h2>
        <span className="rounded-full bg-sky-400/15 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
          {located.length} mit Standort
        </span>
      </div>

      <div className="h-[60dvh] overflow-hidden rounded-3xl border border-slate-800">
        <MapContainer
          center={[51.163, 10.447]}
          zoom={6}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <FitToSnaps snaps={located} focusId={focusId} />
          {located.map((snap) => (
            <Marker key={snap.id} position={[snap.location.latitude, snap.location.longitude]}>
              <Popup>
                <Link to={`/gallery/${snap.id}`} className="block w-36">
                  <img src={snap.image} alt="" className="mb-1.5 w-full rounded-lg" />
                  <span className="text-xs">{formatSnapDate(snap.createdAt)}</span>
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
