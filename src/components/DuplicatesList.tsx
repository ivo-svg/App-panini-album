import { Minus, Copy } from 'lucide-react';
import { getStickerById } from '../lib/albumData';

interface Props {
  duplicates: Record<string, number>;
  onDecrement: (id: string) => void;
}

export default function DuplicatesList({ duplicates, onDecrement }: Props) {
  const entries = Object.entries(duplicates)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/40">
        <Copy size={40} className="mb-3 opacity-50" />
        <p className="font-barlow text-lg">No tenés repetidas aún</p>
        <p className="font-barlow text-sm mt-1">Las figuritas repetidas aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="font-bebas text-2xl text-[#FFD700] tracking-widest mb-4">
        Figuritas Repetidas — {entries.length} diferentes · {entries.reduce((a, [, c]) => a + c, 0)} copias
      </h2>
      <div className="space-y-2">
        {entries.map(([id, count]) => {
          const entry = getStickerById(id);
          if (!entry) return null;
          const { team, sticker } = entry;
          return (
            <div
              key={id}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 transition-colors"
            >
              <span
                className="text-xs font-bold font-barlow px-2 py-0.5 rounded"
                style={{ backgroundColor: team.primaryColor + '33', color: team.primaryColor === '#000000' ? '#fff' : team.primaryColor, border: `1px solid ${team.primaryColor}55` }}
              >
                {id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-barlow font-semibold text-sm truncate">{sticker.name}</p>
                <p className="text-white/50 font-barlow text-xs">{team.fullName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400 font-barlow font-bold text-sm min-w-[2rem] text-center">
                  ×{count}
                </span>
                <button
                  onClick={() => onDecrement(id)}
                  className="w-7 h-7 rounded-full bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/40 text-orange-400 flex items-center justify-center transition-colors"
                  title="Entregar una copia"
                >
                  <Minus size={12} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
