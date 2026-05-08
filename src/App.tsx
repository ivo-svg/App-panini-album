import { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AlbumPage from './components/AlbumPage';
import DuplicatesList from './components/DuplicatesList';
import SuggestionsPanel from './components/SuggestionsPanel';
import StatsPanel from './components/StatsPanel';
import FixturePanel from './components/FixturePanel';
import LandingPage from './components/LandingPage';
import Toast, { type ToastMessage } from './components/Toast';
import { useAlbum } from './hooks/useAlbum';
import { TEAMS, getStickerById, TOTAL_STICKERS } from './lib/albumData';
import { BookOpen, Copy, MessageSquare, BarChart2, Calendar } from 'lucide-react';

type Tab = 'album' | 'duplicates' | 'suggestions' | 'stats' | 'fixture';
type Screen = 'landing' | 'app';

let toastIdCounter = 0;

export default function App() {
  const {
    state, loading, syncStatus, collectedCount, progress,
    toggleSticker, removeSticker, decrementDuplicate,
    resetAlbum, exportJSON, importJSON,
  } = useAlbum();

  const [screen, setScreen] = useState<Screen>('landing');
  const [tab, setTab] = useState<Tab>('album');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const pageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const addToast = useCallback((text: string, type: ToastMessage['type']) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev.slice(-4), { id, text, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Atajo "/" para enfocar el buscador
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen !== 'app') return;
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen]);

  const markNew = useCallback((id: string) => {
    setNewIds((prev) => new Set(prev).add(id));
    setTimeout(() => setNewIds((prev) => { const s = new Set(prev); s.delete(id); return s; }), 1200);
  }, []);

  const handleToggle = useCallback((id: string) => {
    const action = toggleSticker(id);
    const name = getStickerById(id)?.sticker.name ?? id;
    if (action === 'collected') {
      addToast(`✓ ${name} pegada!`, 'success');
      markNew(id);
    } else {
      addToast(`+1 repetida de ${name}`, 'duplicate');
    }
  }, [toggleSticker, addToast, markNew]);

  const handleRemove = useCallback((id: string) => {
    removeSticker(id);
    const name = getStickerById(id)?.sticker.name ?? id;
    addToast(`✗ ${name} quitada`, 'error');
  }, [removeSticker, addToast]);

  const handlePaste = useCallback((ids: string[]) => {
    let pasted = 0;
    let duped = 0;
    ids.forEach((id) => {
      const entry = getStickerById(id);
      if (!entry) { addToast(`Código no encontrado: ${id}`, 'error'); return; }
      const action = toggleSticker(id);
      if (action === 'collected') { pasted++; markNew(id); }
      else { duped++; }
    });
    if (pasted > 0) addToast(`✓ ${pasted} figurita${pasted > 1 ? 's' : ''} pegada${pasted > 1 ? 's' : ''}!`, 'success');
    if (duped > 0) addToast(`+${duped} repetida${duped > 1 ? 's' : ''}`, 'duplicate');
  }, [toggleSticker, addToast, markNew]);

  const handleNavigate = useCallback((teamCode: string) => {
    setTab('album');
    setTimeout(() => {
      const el = pageRefs.current.get(teamCode);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleLandingEnter = useCallback((section: 'album' | 'fixture') => {
    setScreen('app');
    setTab(section);
  }, []);

  const duplicateTotal = Object.values(state.duplicates).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000d2e] flex items-center justify-center">
        <div className="text-center">
          <div className="font-bebas text-[#FFD700] text-5xl tracking-widest mb-3 animate-pulse drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">
            FIFA WORLD CUP 2026
          </div>
          <p className="text-white/40 font-barlow">Cargando álbum…</p>
        </div>
      </div>
    );
  }

  if (screen === 'landing') {
    return (
      <>
        <LandingPage
          onEnter={handleLandingEnter}
          collectedCount={collectedCount}
          totalStickers={TOTAL_STICKERS}
        />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  const TABS = [
    { id: 'album' as Tab,      label: 'Álbum',    icon: BookOpen   },
    { id: 'fixture' as Tab,    label: 'Fixture',  icon: Calendar   },
    { id: 'stats' as Tab,      label: 'Stats',    icon: BarChart2  },
    { id: 'duplicates' as Tab, label: `Repetidas${duplicateTotal > 0 ? ` (${duplicateTotal})` : ''}`, icon: Copy },
    { id: 'suggestions' as Tab,label: 'Chat',     icon: MessageSquare },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #000d2e 0%, #001440 40%, #000d2e 100%)' }}
    >
      <Header
        collectedCount={collectedCount}
        progress={progress}
        syncStatus={syncStatus}
        onExport={exportJSON}
        onImport={importJSON}
        onReset={resetAlbum}
        onHome={() => setScreen('landing')}
      />

      <SearchBar
        onPaste={handlePaste}
        onNavigate={handleNavigate}
        collected={state.collected}
        inputRef={searchInputRef}
      />

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-[#000d2e]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 font-barlow font-semibold text-sm border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
                tab === id
                  ? 'border-[#FFD700] text-[#FFD700]'
                  : 'border-transparent text-white/50 hover:text-white/80 hover:border-white/20'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {tab === 'album' && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 [column-fill:_balance]">
            {TEAMS.map((team) => (
              <div key={team.code} className="break-inside-avoid mb-5">
                <AlbumPage
                  ref={(el) => { if (el) pageRefs.current.set(team.code, el); else pageRefs.current.delete(team.code); }}
                  team={team}
                  collected={state.collected}
                  duplicates={state.duplicates}
                  newIds={newIds}
                  onToggle={handleToggle}
                  onRemove={handleRemove}
                />
              </div>
            ))}
          </div>
        )}
        {tab === 'fixture'    && <FixturePanel />}
        {tab === 'stats'      && <StatsPanel collected={state.collected} duplicates={state.duplicates} />}
        {tab === 'duplicates' && <DuplicatesList duplicates={state.duplicates} onDecrement={decrementDuplicate} />}
        {tab === 'suggestions'&& <SuggestionsPanel />}
      </main>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
