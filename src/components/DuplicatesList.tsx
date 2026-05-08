import { Minus, Repeat2 } from 'lucide-react';
import { getStickerById } from '../lib/albumData';

interface Props {
  duplicates: Record<string, number>;
  onDecrement: (id: string) => void;
}

export default function DuplicatesList({ duplicates, onDecrement }: Props) {
  const entries = Object.entries(duplicates)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  const totalCopies = entries.reduce((a, [, c]) => a + c, 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden p-5 mb-6" style={{ background: 'linear-gradient(135deg, #1a0d00, #3d2200)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23f97316'/%3E%3C/svg%3E")` }} />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <Repeat2 size={28} className="text-orange-400" />
          </div>
          <div>
            <div className="font-bebas text-3xl text-orange-400 tracking-widest leading-none">Figuritas Repetidas</div>
            <div className="font-barlow text-white/50 text-sm mt-0.5">
              {entries.length > 0
                ? <><span className="text-orange-300 font-semibold">{entries.length}</span> diferentes · <span className="text-orange-300 font-semibold">{totalCopies}</span> copias en total</>
                : 'Cuando tengas repetidas, aparecen acá'}
            </div>
          </div>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <div className="text-6xl mb-4 opacity-50">📦</div>
          <p className="font-bebas text-2xl tracking-widest text-white/30">Sin Repetidas</p>
          <p className="font-barlow text-sm mt-1 text-white/20">Las figuritas repetidas aparecerán acá</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(([id, count]) => {
            const entry = getStickerById(id);
            if (!entry) return null;
            const { team, sticker } = entry;
            const barColor = team.primaryColor === '#000000' ? '#FFD700' : team.primaryColor;
            return (
              <div
                key={id}
                className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:scale-[1.01]"
                style={{
                  background: `linear-gradient(90deg, ${barColor}11 0%, rgba(255,255,255,0.04) 100%)`,
                  border: `1px solid ${barColor}22`,
                  borderLeft: `3px solid ${barColor}88`,
                }}
              >
                <span
                  className="text-xs font-bold font-barlow px-2 py-1 rounded-lg flex-shrink-0"
                  style={{ background: `${barColor}22`, color: barColor, border: `1px solid ${barColor}44` }}
                >
                  {id}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-barlow font-semibold text-sm truncate">{sticker.name}</p>
                  <p className="font-barlow text-xs" style={{ color: barColor, opacity: 0.7 }}>{team.fullName}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className="px-3 py-1 rounded-full font-bebas text-lg leading-none"
                    style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}
                  >
                    ×{count}
                  </div>
                  <button
                    onClick={() => onDecrement(id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.4)', color: '#f97316' }}
                    title="Entregar una copia"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer tip */}
      {entries.length > 0 && (
        <div className="mt-6 text-center">
          <p className="font-barlow text-white/25 text-xs">
            Presioná <span className="text-orange-400/50">−</span> cuando intercambiés una figurita
          </p>
        </div>
      )}
    </div>
  );
}
