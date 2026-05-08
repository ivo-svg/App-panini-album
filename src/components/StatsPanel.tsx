import { useMemo } from 'react';
import { TEAMS, TOTAL_STICKERS } from '../lib/albumData';
import { Trophy, Layers, Repeat2, Star, Users, Shield, TrendingUp } from 'lucide-react';

interface Props {
  collected: Record<string, boolean>;
  duplicates: Record<string, number>;
}

export default function StatsPanel({ collected, duplicates }: Props) {
  const stats = useMemo(() => {
    const collectedCount = Object.values(collected).filter(Boolean).length;
    const missing = TOTAL_STICKERS - collectedCount;
    const duplicateEntries = Object.entries(duplicates).filter(([, v]) => v > 0);
    const totalDuplicates = duplicateEntries.reduce((a, [, v]) => a + v, 0);
    const uniqueDuplicates = duplicateEntries.length;
    const foilCollected = TEAMS.flatMap(t => t.stickers).filter(s => s.isFoil && collected[s.id]).length;
    const foilTotal = TEAMS.flatMap(t => t.stickers).filter(s => s.isFoil).length;
    const teamPhoto = TEAMS.flatMap(t => t.stickers).filter(s => s.isTeamPhoto && collected[s.id]).length;
    const completedTeams = TEAMS.filter(t => t.stickers.every(s => collected[s.id])).length;

    // Top 5 teams by completion
    const teamProgress = TEAMS.map(t => ({
      code: t.code,
      fullName: t.fullName,
      primaryColor: t.primaryColor,
      pct: Math.round((t.stickers.filter(s => collected[s.id]).length / t.stickers.length) * 100),
      collected: t.stickers.filter(s => collected[s.id]).length,
      total: t.stickers.length,
    })).sort((a, b) => b.pct - a.pct);

    const top5 = teamProgress.slice(0, 5);
    const bottom5 = [...teamProgress].sort((a, b) => a.pct - b.pct).slice(0, 5);

    // Most duplicated sticker
    const mostDuplicated = duplicateEntries.sort(([, a], [, b]) => b - a).slice(0, 3);

    return { collectedCount, missing, totalDuplicates, uniqueDuplicates, foilCollected, foilTotal, teamPhoto, completedTeams, top5, bottom5, mostDuplicated, teamProgress };
  }, [collected, duplicates]);

  const progress = (stats.collectedCount / TOTAL_STICKERS) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp size={28} className="text-[#FFD700]" />
        <h2 className="font-bebas text-3xl text-[#FFD700] tracking-widest">Estadísticas del Álbum</h2>
      </div>

      {/* Big progress */}
      <div className="relative rounded-2xl overflow-hidden p-6" style={{ background: 'linear-gradient(135deg, #001a3d, #002868)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23FFD700'/%3E%3C/svg%3E")` }} />
        <div className="relative">
          <div className="flex items-end gap-3 mb-3">
            <span className="font-bebas text-7xl text-[#FFD700] leading-none drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
              {progress.toFixed(1)}%
            </span>
            <span className="font-barlow text-white/50 text-lg mb-2">completado</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #B8860B, #FFD700, #FFF176, #FFD700)' }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-bebas text-3xl text-emerald-400">{stats.collectedCount}</div>
              <div className="font-barlow text-white/50 text-xs uppercase tracking-wide">Pegadas</div>
            </div>
            <div>
              <div className="font-bebas text-3xl text-red-400">{stats.missing}</div>
              <div className="font-barlow text-white/50 text-xs uppercase tracking-wide">Faltan</div>
            </div>
            <div>
              <div className="font-bebas text-3xl text-[#FFD700]">{TOTAL_STICKERS}</div>
              <div className="font-barlow text-white/50 text-xs uppercase tracking-wide">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Repeat2, label: 'Repetidas totales', value: stats.totalDuplicates, color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
          { icon: Layers, label: 'Figuritas con copia', value: stats.uniqueDuplicates, color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)' },
          { icon: Star, label: 'FOILs conseguidos', value: `${stats.foilCollected}/${stats.foilTotal}`, color: '#FFD700', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.3)' },
          { icon: Trophy, label: 'Selecciones completas', value: stats.completedTeams, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
          { icon: Users, label: 'Fotos de equipo', value: `${stats.teamPhoto}/49`, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
          { icon: Shield, label: 'Escudos obtenidos', value: `${TEAMS.flatMap(t => t.stickers).filter(s => s.isShield && collected[s.id]).length}/49`, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
          { icon: TrendingUp, label: 'Repetidas vs pegadas', value: stats.collectedCount > 0 ? `${((stats.totalDuplicates / stats.collectedCount) * 100).toFixed(1)}%` : '0%', color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.3)' },
          { icon: Trophy, label: 'Equipos iniciados', value: TEAMS.filter(t => t.stickers.some(s => collected[s.id])).length, color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: bg, border: `1px solid ${border}` }}>
            <Icon size={18} style={{ color }} />
            <div className="font-bebas text-2xl leading-none" style={{ color }}>{value}</div>
            <div className="font-barlow text-white/50 text-xs leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* Top 5 teams */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <span className="text-emerald-400 text-lg">🏆</span>
            <span className="font-bebas text-lg text-white tracking-wide">Más Avanzadas</span>
          </div>
          <div className="p-3 space-y-2">
            {stats.top5.map((t, i) => (
              <div key={t.code} className="flex items-center gap-3">
                <span className="font-bebas text-white/30 w-4 text-center">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-0.5">
                    <span className="font-barlow font-semibold text-white text-sm">{t.fullName}</span>
                    <span className="font-barlow text-xs" style={{ color: t.primaryColor === '#000000' || t.primaryColor === '#001440' ? '#FFD700' : t.primaryColor }}>{t.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.primaryColor === '#000000' ? '#FFD700' : t.primaryColor }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <span className="text-red-400 text-lg">📋</span>
            <span className="font-bebas text-lg text-white tracking-wide">Las que Faltan Más</span>
          </div>
          <div className="p-3 space-y-2">
            {stats.bottom5.map((t, i) => (
              <div key={t.code} className="flex items-center gap-3">
                <span className="font-bebas text-white/30 w-4 text-center">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-0.5">
                    <span className="font-barlow font-semibold text-white text-sm">{t.fullName}</span>
                    <span className="font-barlow text-red-400 text-xs">{t.collected}/{t.total}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-red-500/60" style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confederation breakdown */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-4 py-3 border-b border-white/10">
          <span className="font-bebas text-lg text-white tracking-wide">Progreso por Confederación</span>
        </div>
        <div className="p-4 grid sm:grid-cols-2 gap-3">
          {[
            { name: 'CONMEBOL', codes: ['ARG','BRA','URU','COL','ECU','PAR'], color: '#FFD700' },
            { name: 'UEFA', codes: ['ESP','FRA','GER','POR','NED','BEL','SUI','AUT','SCO','NOR','SWE','TUR','CRO','CZE','BIH','ENG'], color: '#003399' },
            { name: 'CAF', codes: ['MAR','SEN','EGY','ALG','RSA','TUN','CPV','CIV','COD','GHA'], color: '#009900' },
            { name: 'AFC', codes: ['JPN','KOR','KSA','IRN','IRQ','JOR','UZB','QAT','AUS'], color: '#CC0000' },
            { name: 'CONCACAF', codes: ['USA','MEX','CAN','HAI','CUW','PAN'], color: '#0066CC' },
            { name: 'OFC', codes: ['NZL'], color: '#000066' },
          ].map(({ name, codes, color }) => {
            const confTeams = TEAMS.filter(t => codes.includes(t.code));
            const confTotal = confTeams.reduce((a, t) => a + t.stickers.length, 0);
            const confCollected = confTeams.reduce((a, t) => a + t.stickers.filter(s => collected[s.id]).length, 0);
            const pct = confTotal > 0 ? Math.round((confCollected / confTotal) * 100) : 0;
            return (
              <div key={name} className="flex items-center gap-3">
                <span className="font-bebas text-sm w-20" style={{ color }}>{name}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="font-barlow text-xs text-white/50 w-16 text-right">{confCollected}/{confTotal}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
