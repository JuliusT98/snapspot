import { useCallback, useEffect, useRef, useState } from 'react';

// Kriterium #4a: Kamera (MediaDevices API / getUserMedia)
export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState(null);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setActive(true);
    } catch (err) {
      console.error('Kamera-Fehler:', err);
      // Bei früherer Ablehnung blockiert der Browser ohne erneute Nachfrage –
      // dem Nutzer sagen, wo er das zurücksetzen kann
      const messages = {
        NotAllowedError:
          'Kamera-Zugriff blockiert. Berechtigung in den Website-Einstellungen (Schloss-Symbol) erlauben.',
        NotFoundError: 'Keine Kamera gefunden.',
        NotReadableError: 'Kamera wird gerade von einer anderen App verwendet.',
      };
      setError(messages[err.name] ?? 'Kamera nicht verfügbar.');
    }
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActive(false);
  }, []);

  // Aktuelles Videobild auf ein Canvas zeichnen und als JPEG-DataURL liefern
  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.85);
  }, []);

  // Kamera beim Verlassen des Screens freigeben
  useEffect(() => stop, [stop]);

  return { videoRef, active, error, start, stop, capture };
}
