import { useCallback, useState } from 'react';

// Kriterium #4b: Geolocation API
// status: 'idle' | 'locating' | 'success' | 'error' | 'unsupported'
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorText, setErrorText] = useState(null);

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        setPosition({ latitude, longitude });
        setAccuracy(Math.round(acc));
        setStatus('success');
      },
      (err) => {
        console.error('Geolocation-Fehler:', err);
        // code 1 = blockiert (Browser fragt nicht erneut), 2 = kein Signal/GPS aus, 3 = Timeout
        setErrorText(
          err.code === 1
            ? 'Standort blockiert – in den Website-Einstellungen erlauben'
            : err.code === 2
              ? 'Standort nicht verfügbar – ist GPS aktiviert?'
              : 'Zeitüberschreitung bei der Standortermittlung',
        );
        setStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return { position, accuracy, status, errorText, locate };
}

export function osmUrl(lat, lon) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
}
