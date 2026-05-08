import { forwardRef, memo } from 'react';
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

// Only re-render this team's page when one of its own stickers changed
function areEqual(prev: Props, next: Props): boolean {
  if (prev.team !== next.team) return false;
  if (prev.onToggle !== next.onToggle || prev.onRemove !== next.onRemove) return false;
  for (const { id } of prev.team.stickers) {
    if (!!prev.collected[id] !== !!next.collected[id]) return false;
    if ((prev.duplicates[id] ?? 0) !== (next.duplicates[id] ?? 0)) return false;
    if (prev.newIds.has(id) !== next.newIds.has(id)) return false;
  }
  return true;
}

const AlbumPage = memo(forwardRef<HTMLDivElement, Props>(

  ({ team, collected, duplicates, newIds, onToggle, onRemove }, ref) => {
    let teamCollected = 0;
    for (const { id } of team.stickers) if (collected[id]) teamCollected++;
    const teamTotal = team.stickers.length;
    const pct = Math.round((teamCollected / teamTotal) * 100);

    // Determine text color for header
    const isVeryDark = ['#000000', '#001440', '#003087', '#002395', '#012169', '#002868', '#003580'].includes(team.primaryColor);
    const headerTextColor = isVeryDark ? '#FFD700' : '#FFFFFF';

    return (
      <div
        ref={ref}
        id={`team-${team.code}`}
        className="rounded-xl overflow-hidden shadow-2xl"
        style={{
          background: '#f5eed4',
          boxShadow: `0 8px 32px rgba(0,0,0,0.45), inset 4px 0 0 ${team.primaryColor}`,
        }}
      >
        {/* Page header with proper gradient */}
        <div
          className="relative overflow-hidden px-4 py-3"
          style={{
            background: `linear-gradient(105deg, ${team.primaryColor} 0%, ${team.primaryColor} 55%, ${team.secondaryColor} 100%)`,
          }}
        >
          {/* Diagonal stripe overlay for depth */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 9px)',
            }}
          />
          {/* Fade to right so gradient blends */}
          <div
            className="absolute inset-y-0 right-0 w-1/3 pointer-events-none"
            style={{
              background: `linear-gradient(to right, transparent, ${team.secondaryColor}cc)`,
            }}
          />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bebas text-2xl tracking-widest drop-shadow"
                  style={{ color: headerTextColor, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                >
                  {team.code}
                </span>
                <span
                  className="font-barlow font-semibold text-sm tracking-wide"
                  style={{ color: headerTextColor, opacity: 0.9, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                >
                  {team.fullName}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-24 h-1.5 bg-black/25 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: headerTextColor === '#FFD700' ? '#FFD700' : 'rgba(255,255,255,0.95)' }}
                  />
                </div>
                <span className="text-xs font-barlow font-semibold" style={{ color: headerTextColor, opacity: 0.85 }}>
                  {teamCollected}/{teamTotal}
                </span>
              </div>
            </div>
            {team.accentColor && team.accentColor !== team.primaryColor && team.accentColor !== team.secondaryColor && (
              <div className="w-5 h-10 rounded opacity-90 shadow-inner" style={{ background: team.accentColor }} />
            )}
          </div>
        </div>

        {/* Sticker grid */}
        <div className="p-3" style={{ background: 'linear-gradient(180deg, #f5eed4 0%, #ede6c6 100%)' }}>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {team.stickers.map((sticker) => (
              <StickerSlot
                key={sticker.id}
                sticker={sticker}
                team={team}
                collected={!!collected[sticker.id]}
                duplicateCount={duplicates[sticker.id] ?? 0}
                onToggle={onToggle}
                onRemove={onRemove}
                isNew={newIds.has(sticker.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-1.5 flex items-center justify-between"
          style={{ background: team.primaryColor }}
        >
          <span className="text-[10px] font-barlow text-white/50 tracking-widest uppercase">FIFA World Cup 2026™</span>
          <span className="text-[10px] font-barlow font-bold" style={{ color: headerTextColor, opacity: 0.8 }}>
            {pct === 100 ? '✓ COMPLETA' : `${pct}%`}
          </span>
        </div>
      </div>
    );
  }
), areEqual);

AlbumPage.displayName = 'AlbumPage';
export default AlbumPage;
