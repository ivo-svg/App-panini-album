import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Zap } from 'lucide-react';
import { searchStickers } from '../lib/albumData';

interface Props {
  onPaste: (ids: string[]) => void;
  onNavigate: (teamCode: string, stickerId: string) => void;
  collected: Record<string, boolean>;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function SearchBar({ onPaste, onNavigate, collected, inputRef }: Props) {
  const [query, setQuery] = useState('');
  const [bulk, setBulk] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof searchStickers>>([]);
  const localRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? localRef;

  useEffect(() => {
    setResults(searchStickers(query));
  }, [query]);

  const handleSingle = useCallback((id: string, teamCode: string) => {
    onPaste([id]);
    onNavigate(teamCode, id);
    setQuery('');
    setResults([]);
  }, [onPaste, onNavigate]);

  const handleBulk = useCallback(() => {
    const ids = bulk
      .split(/[\s,;\n]+/)
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0);
    onPaste(ids);
    setBulk('');
    setShowBulk(false);
  }, [bulk, onPaste]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleSingle(results[0].sticker.id, results[0].team.code);
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-[#000d2e]/95 backdrop-blur border-b border-white/10 px-4 py-2">
      <div className="max-w-7xl mx-auto flex gap-2 items-center">
        {/* Single search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            ref={ref}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por nombre o código (ej: Messi, ARG17) · Presioná / para enfocar"
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-9 py-2 text-white placeholder:text-white/30 text-sm font-barlow outline-none focus:border-[#FFD700]/60 focus:bg-white/15 transition-all"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
              <X size={14} />
            </button>
          )}
          {/* Autocomplete */}
          {results.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-[#001440] border border-white/20 rounded-lg overflow-hidden shadow-2xl z-50 max-h-64 overflow-y-auto">
              {results.map(({ team, sticker }) => (
                <button
                  key={sticker.id}
                  onClick={() => handleSingle(sticker.id, team.code)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/10 text-left border-b border-white/5 last:border-0 group transition-colors"
                >
                  <span
                    className="w-10 text-center text-xs font-bold px-1.5 py-0.5 rounded font-barlow"
                    style={{ backgroundColor: team.primaryColor + '33', color: team.primaryColor === '#000000' ? '#fff' : team.primaryColor, border: `1px solid ${team.primaryColor}55` }}
                  >
                    {sticker.id}
                  </span>
                  <span className="text-white/90 text-sm font-barlow flex-1 truncate group-hover:text-white">
                    {sticker.name}
                    {sticker.isFoil && <span className="ml-1 text-[10px] text-yellow-400 font-bold">FOIL</span>}
                  </span>
                  <span className="text-white/40 text-xs font-barlow">{team.fullName}</span>
                  {collected[sticker.id] && (
                    <span className="text-emerald-400 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bulk paste toggle */}
        <button
          onClick={() => setShowBulk((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-barlow font-semibold transition-all whitespace-nowrap ${
            showBulk
              ? 'bg-[#FFD700]/20 border-[#FFD700]/50 text-[#FFD700]'
              : 'bg-white/10 border-white/20 text-white/70 hover:text-white hover:bg-white/15'
          }`}
        >
          <Zap size={14} /> Carga masiva
        </button>
      </div>

      {/* Bulk textarea */}
      {showBulk && (
        <div className="max-w-7xl mx-auto mt-2 flex gap-2">
          <textarea
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            placeholder="Pegá los códigos separados por coma, espacio o enter&#10;Ej: ARG01, ARG05, BRA03, MEX17"
            rows={3}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/30 text-sm font-barlow outline-none focus:border-[#FFD700]/60 resize-none"
          />
          <button
            onClick={handleBulk}
            disabled={!bulk.trim()}
            className="px-4 py-2 rounded-lg bg-[#FFD700] text-[#001440] font-barlow font-bold text-sm disabled:opacity-40 hover:bg-yellow-300 transition-colors"
          >
            Pegar
          </button>
        </div>
      )}
    </div>
  );
}
