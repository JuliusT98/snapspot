import { useCallback, useEffect, useState } from 'react';

// Kriterium #3: Installierbarkeit (A2H) via beforeinstallprompt
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(
    () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true,
  );

  useEffect(() => {
    const onBeforeInstall = (event) => {
      // Browser-eigenen Mini-Infobar unterdrücken und eigenen Button zeigen
      event.preventDefault();
      setDeferredPrompt(event);
    };
    const onInstalled = () => {
      setDeferredPrompt(null);
      setInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return null;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome;
  }, [deferredPrompt]);

  return { canInstall: !installed && deferredPrompt !== null, installed, promptInstall };
}
