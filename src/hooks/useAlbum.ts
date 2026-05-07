import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { TOTAL_STICKERS } from '../lib/albumData';

export type SyncStatus = 'synced' | 'syncing' | 'offline';

export interface AlbumState {
  collected: Record<string, boolean>;
  duplicates: Record<string, number>;
}

const DEBOUNCE_MS = 800;

export function useAlbum() {
  const [state, setState] = useState<AlbumState>({ collected: {}, duplicates: {} });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('syncing');
  const [loading, setLoading] = useState(true);
  const pendingRef = useRef<AlbumState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);

  // Load initial state
  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('album_state')
          .select('*')
          .eq('id', 'family')
          .single();

        if (error && error.code === 'PGRST116') {
          // Row doesn't exist yet — insert default
          await supabase.from('album_state').insert({
            id: 'family',
            collected: {},
            duplicates: {},
          });
          setSyncStatus('synced');
        } else if (error) {
          console.error('Load error:', error);
          setSyncStatus('offline');
        } else if (data) {
          setState({ collected: data.collected ?? {}, duplicates: data.duplicates ?? {} });
          setSyncStatus('synced');
        }
      } catch (e) {
        console.error(e);
        setSyncStatus('offline');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('album-state-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'album_state', filter: 'id=eq.family' },
        (payload) => {
          if (isSavingRef.current) return;
          const row = payload.new as { collected: Record<string, boolean>; duplicates: Record<string, number> };
          setState({ collected: row.collected ?? {}, duplicates: row.duplicates ?? {} });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const saveToSupabase = useCallback(async (newState: AlbumState) => {
    isSavingRef.current = true;
    setSyncStatus('syncing');
    try {
      const { error } = await supabase
        .from('album_state')
        .upsert({ id: 'family', ...newState, updated_at: new Date().toISOString() });
      if (error) {
        console.error('Save error:', error);
        setSyncStatus('offline');
      } else {
        setSyncStatus('synced');
      }
    } catch (e) {
      console.error(e);
      setSyncStatus('offline');
    } finally {
      isSavingRef.current = false;
    }
  }, []);

  const scheduleSync = useCallback((newState: AlbumState) => {
    pendingRef.current = newState;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (pendingRef.current) {
        saveToSupabase(pendingRef.current);
        pendingRef.current = null;
      }
    }, DEBOUNCE_MS);
  }, [saveToSupabase]);

  const toggleSticker = useCallback((id: string): 'collected' | 'duplicate' | 'removed' => {
    let action: 'collected' | 'duplicate' | 'removed' = 'collected';
    setState((prev) => {
      const newState = { ...prev, collected: { ...prev.collected }, duplicates: { ...prev.duplicates } };
      if (!newState.collected[id]) {
        newState.collected[id] = true;
        action = 'collected';
      } else {
        newState.duplicates[id] = (newState.duplicates[id] ?? 0) + 1;
        action = 'duplicate';
      }
      scheduleSync(newState);
      return newState;
    });
    return action;
  }, [scheduleSync]);

  const removeSticker = useCallback((id: string) => {
    setState((prev) => {
      const newState = { ...prev, collected: { ...prev.collected }, duplicates: { ...prev.duplicates } };
      delete newState.collected[id];
      delete newState.duplicates[id];
      scheduleSync(newState);
      return newState;
    });
  }, [scheduleSync]);

  const decrementDuplicate = useCallback((id: string) => {
    setState((prev) => {
      const newState = { ...prev, duplicates: { ...prev.duplicates } };
      if ((newState.duplicates[id] ?? 0) <= 1) {
        delete newState.duplicates[id];
      } else {
        newState.duplicates[id] -= 1;
      }
      scheduleSync(newState);
      return newState;
    });
  }, [scheduleSync]);

  const resetAlbum = useCallback(async () => {
    const empty: AlbumState = { collected: {}, duplicates: {} };
    setState(empty);
    await saveToSupabase(empty);
  }, [saveToSupabase]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'album-mundial-2026.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importJSON = useCallback(async (json: string) => {
    const parsed = JSON.parse(json) as AlbumState;
    setState(parsed);
    await saveToSupabase(parsed);
  }, [saveToSupabase]);

  const collectedCount = Object.values(state.collected).filter(Boolean).length;
  const progress = TOTAL_STICKERS > 0 ? (collectedCount / TOTAL_STICKERS) * 100 : 0;

  return {
    state,
    loading,
    syncStatus,
    collectedCount,
    progress,
    toggleSticker,
    removeSticker,
    decrementDuplicate,
    resetAlbum,
    exportJSON,
    importJSON,
  };
}
