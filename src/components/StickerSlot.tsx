import { memo, useEffect, useState } from 'react';
import type { Sticker, Team } from '../lib/albumData';
import { X, Users, Shield, Star } from 'lucide-react';

interface Props {
  sticker: Sticker;
  team: Team;
  collected: boolean;
  duplicateCount: number;
  onToggle: () => void;
  onRemove: () => void;
  isNew?: boolean;
}

const StickerSlot = memo(function StickerSlot({
  sticker, team, collected, duplicateCount, onToggle, onRemove, isNew,
}: Props) {
  const [animating, setAnimating] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);

  useEffect(() => {
    if (isNew) {
      setAnimating(true);
      setShowShimmer(true);
      const t1 = setTimeout(() => setAnimating(false), 500);
      const t2 = setTimeout(() => setShowShimmer(false), 1000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isNew]);

  const borderColor = collected ? '#22c55e' : team.primaryColor;

  return (
    <div
      className={`
        relative rounded-lg overflow-hidden cursor-pointer select-none
        transition-all duration-200 group
        hover:-translate-y-0.5 hover:shadow-lg
        ${animating ? 'scale-110' : 'scale-100'}
      `}
      style={{
        border: `2px ${collected ? 'solid' : 'dashed'} ${borderColor}`,
        background: collected
          ? `${team.primaryColor}33`
          : sticker.isFoil
          ? 'linear-gradient(135deg, #f5eed4 0%, #fff9e6 25%, #f5eed4 50%, #fff9e6 75%, #f5eed4 100%)'
          : '#f5eed4',
        boxShadow: collected ? `0 0 8px ${team.primaryColor}44` : undefined,
        aspectRatio: '3/4',
        minHeight: '88px',
      }}
      onClick={onToggle}
    >
      {/* FOIL overlay */}
      {sticker.isFoil && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, rgba(255,215,0,0.35) 30%, rgba(255,249,196,0.5) 50%, rgba(255,215,0,0.35) 70%, transparent 100%)',
            backgroundSize: '200% 200%',
            animation: 'shimmerBg 3s linear infinite',
            opacity: collected ? 0.5 : 0.25,
          }}
        />
      )}

      {/* Paste shimmer */}
      {showShimmer && (
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,215,0,0.8) 50%, transparent 80%)',
            animation: 'shimmerSlide 0.8s ease-out forwards',
          }}
        />
      )}

      {/* Duplicate badge */}
      {duplicateCount > 0 && (
        <div className="absolute top-0.5 left-0.5 z-10 bg-orange-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none font-barlow shadow">
          +{duplicateCount}
        </div>
      )}

      {/* Remove button — always visible on collected, more prominent */}
      {collected && (
        <button
          className="absolute top-0.5 right-0.5 z-10 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center transition-all opacity-60 group-hover:opacity-100 hover:scale-125 hover:bg-red-600"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          title="Quitar figurita"
        >
          <X size={9} strokeWidth={3} />
        </button>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 p-1">
        {sticker.isShield ? (
          <Shield size={20} style={{ color: collected ? team.primaryColor : '#9ca3af' }} />
        ) : sticker.isTeamPhoto ? (
          <Users size={20} style={{ color: collected ? team.primaryColor : '#9ca3af' }} />
        ) : sticker.isFoil ? (
          <Star size={16} className={collected ? 'text-yellow-500' : 'text-yellow-400/60'} />
        ) : null}

        <span className={`text-[9px] font-bold font-barlow leading-none text-center ${collected ? 'text-emerald-600' : 'text-gray-400'}`}>
          {sticker.id}
        </span>

        <span
          className={`text-[8px] font-barlow leading-tight text-center px-0.5 ${collected ? 'text-gray-700 font-semibold' : 'text-gray-400'}`}
          style={{ maxWidth: '100%', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {sticker.name}
        </span>

        {collected && (
          <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
});

export default StickerSlot;
