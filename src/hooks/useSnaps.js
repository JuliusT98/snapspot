import { useCallback, useEffect, useState } from 'react';
import { clearAllSnaps, deleteSnap, getAllSnaps, saveSnap } from '../lib/db.js';

// Lädt alle Snaps aus IndexedDB und hält sie als React-State aktuell
export function useSnaps() {
  const [snaps, setSnaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await getAllSnaps();
    setSnaps(all.sort((a, b) => b.id - a.id));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addSnap = useCallback(async (snap) => {
    await saveSnap(snap);
    await refresh();
  }, [refresh]);

  const removeSnap = useCallback(async (id) => {
    await deleteSnap(id);
    await refresh();
  }, [refresh]);

  const clearAll = useCallback(async () => {
    await clearAllSnaps();
    await refresh();
  }, [refresh]);

  return { snaps, loading, addSnap, removeSnap, clearAll, refresh };
}
