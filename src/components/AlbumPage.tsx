import { forwardRef } from 'react';
import type { Team } from '../lib/albumData';
import StickerSlot from './StickerSlot';

interface Props {
  team: Team;
  collected: Record<string, boolean>;
  duplicates: Record<string, number>;
  newIds: Set<string>;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const AlbumPage = forwardRef<HTMLDivElement, Props>(
  ({ team, collected, duplicates, newIds, onToggle, onRemove }, ref) => {
    const teamCollected = team.stickers.filter((s) => collected[s.id]).length;
    const teamTotal = team.stickers.length;
    const pct = Math.round((teamCollected / teamTotal) * 100);

    // Darken primary color for header gradient
    const isDark = team.primaryColor === '#000000' || team.primaryColor === '#001440';

    return (
      <div
        ref={ref}
        id={`team-${team.code}`}
        className="album-page rounded-xl overflow-hidden shadow-2xl"
        style={{
          background: '#f5eed4',
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 4px 0 0 ${team.primaryColor}`,
        }}
      >
        {/* Page header */}
        <div
          className="relative overflow-hidden px-4 py-3"
          style={{
            background: `linear-gradient(135deg, ${team.primaryColor} 0%, ${team.secondaryColor}88 100%)`,
          }}
        >
          {/* Texture */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 5px)',
            }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bebas text-2xl tracking-widest drop-shadow"
                  style={{ color: isDark ? '#FFD700' : 'white', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                >
                  {team.code}
                </span>
                <span
                  className="font-barlow font-semibold text-sm tracking-wide opacity-90"
                  style={{ color: isDark ? '#FFD700' : 'white' }}
                >
                  {team.fullName}
                </span>
              </div>
              {/* Mini progress */}
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-24 h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: isDark ? '#FFD700' : 'rgba(255,255,255,0.9)',
                    }}
                  />
                </div>
                <span
                  className="text-xs font-barlow font-semibold opacity-80"
                  style={{ color: isDark ? '#FFD700' : 'white' }}
                >
                  {teamCollected}/{teamTotal}
                </span>
              </div>
            </div>
            {/* Accent stripe */}
            {team.accentColor && team.accentColor !== team.primaryColor && (
              <div
                className="w-6 h-10 rounded opacity-80"
                style={{ background: team.accentColor }}
              />
            )}
          </div>
        </div>

        {/* Sticker grid */}
        <div
          className="p-3"
          style={{ background: 'linear-gradient(180deg, #f5eed4 0%, #ede6c6 100%)' }}
        >
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {team.stickers.map((sticker) => (
              <StickerSlot
                key={sticker.id}
                sticker={sticker}
                team={team}
                collected={!!collected[sticker.id]}
                duplicateCount={duplicates[sticker.id] ?? 0}
                onToggle={() => onToggle(sticker.id)}
                onRemove={() => onRemove(sticker.id)}
                isNew={newIds.has(sticker.id)}
              />
            ))}
          </div>
        </div>

        {/* Page footer */}
        <div
          className="px-4 py-1.5 flex items-center justify-between"
          style={{ background: team.primaryColor, borderTop: `2px solid ${team.accentColor ?? team.secondaryColor}44` }}
        >
          <span className="text-[10px] font-barlow text-white/60 tracking-widest uppercase">
            FIFA World Cup 2026™
          </span>
          <span className="text-[10px] font-barlow font-bold text-white/80">
            {pct === 100 ? '✓ COMPLETA' : `${pct}%`}
          </span>
        </div>
      </div>
    );
  }
);

AlbumPage.displayName = 'AlbumPage';
export default AlbumPage;
