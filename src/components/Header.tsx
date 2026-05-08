import { type SyncStatus } from '../hooks/useAlbum';
import { TOTAL_STICKERS } from '../lib/albumData';
import { Download, Upload, RotateCcw, Home } from 'lucide-react';
import { useRef } from 'react';

interface Props {
  collectedCount: number;
  progress: number;
  syncStatus: SyncStatus;
  onExport: () => void;
  onImport: (json: string) => void;
  onReset: () => void;
  onHome?: () => void;
}

const syncDot: Record<SyncStatus, string> = {
  synced: 'bg-emerald-400',
  syncing: 'bg-yellow-400 animate-pulse',
  offline: 'bg-red-500',
};
const syncLabel: Record<SyncStatus, string> = {
  synced: 'Sincronizado',
  syncing: 'Sincronizando…',
  offline: 'Sin conexión',
};

export default function Header({ collectedCount, progress, syncStatus, onExport, onImport, onReset, onHome }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try { onImport(ev.target?.result as string); }
      catch { alert('Archivo JSON inválido'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-[#000d2e] to-[#001440] border-b-2 border-[#FFD700]/40">
      {/* Hexagon texture overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23FFD700' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Gold shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex flex-col leading-none">
            <span className="font-bebas text-[#FFD700] text-3xl sm:text-4xl tracking-widest drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              FIFA WORLD CUP
            </span>
            <span className="font-bebas text-white text-xl sm:text-2xl tracking-[0.4em]">
              2026&nbsp;&nbsp;·&nbsp;&nbsp;ÁLBUM PANINI
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {onHome && (
              <button
                onClick={onHome}
                title="Ir al inicio"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] text-xs font-barlow font-semibold transition-all"
              >
                <Home size={14} /> Inicio
              </button>
            )}
            <button
              onClick={onExport}
              title="Exportar JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-barlow font-semibold transition-all"
            >
              <Download size={14} /> Exportar
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              title="Importar JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-barlow font-semibold transition-all"
            >
              <Upload size={14} /> Importar
            </button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            <button
              onClick={() => { if (confirm('¿Resetear todo el álbum? Esta acción no se puede deshacer.')) onReset(); }}
              title="Resetear álbum"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-barlow font-semibold transition-all"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-barlow font-semibold text-white text-sm tracking-wide">
              <span className="text-[#FFD700] font-bold text-base">{collectedCount}</span>
              <span className="text-white/60"> / {TOTAL_STICKERS} figuritas</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-barlow font-bold text-[#FFD700] text-sm">{progress.toFixed(1)}%</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${syncDot[syncStatus]}`} />
                <span className="text-white/50 text-xs font-barlow">{syncLabel[syncStatus]}</span>
              </div>
            </div>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #B8860B, #FFD700, #FFF176, #FFD700)',
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
