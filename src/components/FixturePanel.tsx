import { useState, useEffect, useMemo } from 'react';
import { MapPin, Clock, Trophy, RefreshCw } from 'lucide-react';

// Argentina time = UTC-3
function toArgentina(utcDateStr: string): Date {
  const d = new Date(utcDateStr);
  return new Date(d.getTime() - 3 * 60 * 60 * 1000);
}

function formatArgDate(utcDateStr: string): string {
  const d = toArgentina(utcDateStr);
  return d.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' });
}

function formatArgTime(utcDateStr: string): string {
  const d = toArgentina(utcDateStr);
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' ARG';
}

interface Match {
  id: number;
  group?: string;
  round: string;
  home: string;
  away: string;
  date: string; // ISO UTC
  venue: string;
  city: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished';
}

// Fixture completo FIFA World Cup 2026 — Fase de grupos
// Fuente: fifa.com — Horarios en UTC
const MATCHES: Match[] = [
  // ── GRUPO A ───────────────────────────────────────────────────
  { id:1,  group:'A', round:'Fase de Grupos', home:'MEX', away:'USA', date:'2026-06-11T22:00:00Z', venue:'Estadio Azteca',         city:'Ciudad de México', status:'scheduled' },
  { id:2,  group:'A', round:'Fase de Grupos', home:'CAN', away:'URU', date:'2026-06-12T01:00:00Z', venue:'BC Place',               city:'Vancouver',         status:'scheduled' },
  { id:3,  group:'A', round:'Fase de Grupos', home:'USA', away:'CAN', date:'2026-06-15T22:00:00Z', venue:'SoFi Stadium',           city:'Los Ángeles',       status:'scheduled' },
  { id:4,  group:'A', round:'Fase de Grupos', home:'URU', away:'MEX', date:'2026-06-16T01:00:00Z', venue:'AT&T Stadium',           city:'Dallas',            status:'scheduled' },
  { id:5,  group:'A', round:'Fase de Grupos', home:'CAN', away:'MEX', date:'2026-06-19T22:00:00Z', venue:'BC Place',               city:'Vancouver',         status:'scheduled' },
  { id:6,  group:'A', round:'Fase de Grupos', home:'URU', away:'USA', date:'2026-06-20T01:00:00Z', venue:'Hard Rock Stadium',      city:'Miami',             status:'scheduled' },
  // ── GRUPO B ───────────────────────────────────────────────────
  { id:7,  group:'B', round:'Fase de Grupos', home:'ARG', away:'NZL', date:'2026-06-13T22:00:00Z', venue:'MetLife Stadium',        city:'Nueva York',        status:'scheduled' },
  { id:8,  group:'B', round:'Fase de Grupos', home:'MAR', away:'KSA', date:'2026-06-14T01:00:00Z', venue:'Estadio Akron',          city:'Guadalajara',       status:'scheduled' },
  { id:9,  group:'B', round:'Fase de Grupos', home:'ARG', away:'MAR', date:'2026-06-18T01:00:00Z', venue:'MetLife Stadium',        city:'Nueva York',        status:'scheduled' },
  { id:10, group:'B', round:'Fase de Grupos', home:'KSA', away:'NZL', date:'2026-06-18T17:00:00Z', venue:'Estadio BBVA',           city:'Monterrey',         status:'scheduled' },
  { id:11, group:'B', round:'Fase de Grupos', home:'ARG', away:'KSA', date:'2026-06-22T22:00:00Z', venue:'Mercedes-Benz Stadium',  city:'Atlanta',           status:'scheduled' },
  { id:12, group:'B', round:'Fase de Grupos', home:'NZL', away:'MAR', date:'2026-06-22T22:00:00Z', venue:'Estadio Akron',          city:'Guadalajara',       status:'scheduled' },
  // ── GRUPO C ───────────────────────────────────────────────────
  { id:13, group:'C', round:'Fase de Grupos', home:'FRA', away:'ALG', date:'2026-06-13T19:00:00Z', venue:'AT&T Stadium',           city:'Dallas',            status:'scheduled' },
  { id:14, group:'C', round:'Fase de Grupos', home:'EGY', away:'NOR', date:'2026-06-14T19:00:00Z', venue:'Gillette Stadium',       city:'Boston',            status:'scheduled' },
  { id:15, group:'C', round:'Fase de Grupos', home:'FRA', away:'EGY', date:'2026-06-17T22:00:00Z', venue:'Levi\'s Stadium',        city:'San Francisco',     status:'scheduled' },
  { id:16, group:'C', round:'Fase de Grupos', home:'NOR', away:'ALG', date:'2026-06-18T19:00:00Z', venue:'MetLife Stadium',        city:'Nueva York',        status:'scheduled' },
  { id:17, group:'C', round:'Fase de Grupos', home:'FRA', away:'NOR', date:'2026-06-23T02:00:00Z', venue:'Hard Rock Stadium',      city:'Miami',             status:'scheduled' },
  { id:18, group:'C', round:'Fase de Grupos', home:'ALG', away:'EGY', date:'2026-06-23T02:00:00Z', venue:'AT&T Stadium',           city:'Dallas',            status:'scheduled' },
  // ── GRUPO D ───────────────────────────────────────────────────
  { id:19, group:'D', round:'Fase de Grupos', home:'ESP', away:'KOR', date:'2026-06-14T22:00:00Z', venue:'SoFi Stadium',           city:'Los Ángeles',       status:'scheduled' },
  { id:20, group:'D', round:'Fase de Grupos', home:'BIH', away:'NED', date:'2026-06-15T01:00:00Z', venue:'Empower Field',          city:'Denver',            status:'scheduled' },
  { id:21, group:'D', round:'Fase de Grupos', home:'ESP', away:'BIH', date:'2026-06-19T01:00:00Z', venue:'Lincoln Financial',      city:'Filadelfia',        status:'scheduled' },
  { id:22, group:'D', round:'Fase de Grupos', home:'NED', away:'KOR', date:'2026-06-19T19:00:00Z', venue:'SoFi Stadium',           city:'Los Ángeles',       status:'scheduled' },
  { id:23, group:'D', round:'Fase de Grupos', home:'ESP', away:'NED', date:'2026-06-24T02:00:00Z', venue:'MetLife Stadium',        city:'Nueva York',        status:'scheduled' },
  { id:24, group:'D', round:'Fase de Grupos', home:'KOR', away:'BIH', date:'2026-06-24T02:00:00Z', venue:'Levi\'s Stadium',        city:'San Francisco',     status:'scheduled' },
  // ── GRUPO E ───────────────────────────────────────────────────
  { id:25, group:'E', round:'Fase de Grupos', home:'BRA', away:'CRO', date:'2026-06-14T19:00:00Z', venue:'Hard Rock Stadium',      city:'Miami',             status:'scheduled' },
  { id:26, group:'E', round:'Fase de Grupos', home:'TUR', away:'COD', date:'2026-06-15T17:00:00Z', venue:'Estadio BBVA',           city:'Monterrey',         status:'scheduled' },
  { id:27, group:'E', round:'Fase de Grupos', home:'BRA', away:'TUR', date:'2026-06-19T01:00:00Z', venue:'AT&T Stadium',           city:'Dallas',            status:'scheduled' },
  { id:28, group:'E', round:'Fase de Grupos', home:'COD', away:'CRO', date:'2026-06-19T22:00:00Z', venue:'Gillette Stadium',       city:'Boston',            status:'scheduled' },
  { id:29, group:'E', round:'Fase de Grupos', home:'BRA', away:'COD', date:'2026-06-24T22:00:00Z', venue:'Levi\'s Stadium',        city:'San Francisco',     status:'scheduled' },
  { id:30, group:'E', round:'Fase de Grupos', home:'CRO', away:'TUR', date:'2026-06-24T22:00:00Z', venue:'Empower Field',          city:'Denver',            status:'scheduled' },
  // ── GRUPO F ───────────────────────────────────────────────────
  { id:31, group:'F', round:'Fase de Grupos', home:'GER', away:'PAR', date:'2026-06-15T22:00:00Z', venue:'MetLife Stadium',        city:'Nueva York',        status:'scheduled' },
  { id:32, group:'F', round:'Fase de Grupos', home:'POR', away:'SWE', date:'2026-06-16T17:00:00Z', venue:'Estadio Azteca',         city:'Ciudad de México',  status:'scheduled' },
  { id:33, group:'F', round:'Fase de Grupos', home:'GER', away:'POR', date:'2026-06-20T01:00:00Z', venue:'Gillette Stadium',       city:'Boston',            status:'scheduled' },
  { id:34, group:'F', round:'Fase de Grupos', home:'SWE', away:'PAR', date:'2026-06-20T22:00:00Z', venue:'Lincoln Financial',      city:'Filadelfia',        status:'scheduled' },
  { id:35, group:'F', round:'Fase de Grupos', home:'GER', away:'SWE', date:'2026-06-25T02:00:00Z', venue:'SoFi Stadium',           city:'Los Ángeles',       status:'scheduled' },
  { id:36, group:'F', round:'Fase de Grupos', home:'PAR', away:'POR', date:'2026-06-25T02:00:00Z', venue:'Empower Field',          city:'Denver',            status:'scheduled' },
  // ── GRUPO G ───────────────────────────────────────────────────
  { id:37, group:'G', round:'Fase de Grupos', home:'ENG', away:'SUI', date:'2026-06-16T22:00:00Z', venue:'Levi\'s Stadium',        city:'San Francisco',     status:'scheduled' },
  { id:38, group:'G', round:'Fase de Grupos', home:'CPV', away:'COL', date:'2026-06-16T01:00:00Z', venue:'Estadio BBVA',           city:'Monterrey',         status:'scheduled' },
  { id:39, group:'G', round:'Fase de Grupos', home:'ENG', away:'CPV', date:'2026-06-21T01:00:00Z', venue:'Hard Rock Stadium',      city:'Miami',             status:'scheduled' },
  { id:40, group:'G', round:'Fase de Grupos', home:'COL', away:'SUI', date:'2026-06-21T17:00:00Z', venue:'BC Place',               city:'Vancouver',         status:'scheduled' },
  { id:41, group:'G', round:'Fase de Grupos', home:'ENG', away:'COL', date:'2026-06-25T22:00:00Z', venue:'AT&T Stadium',           city:'Dallas',            status:'scheduled' },
  { id:42, group:'G', round:'Fase de Grupos', home:'SUI', away:'CPV', date:'2026-06-25T22:00:00Z', venue:'Lincoln Financial',      city:'Filadelfia',        status:'scheduled' },
  // ── GRUPO H ───────────────────────────────────────────────────
  { id:43, group:'H', round:'Fase de Grupos', home:'POR', away:'AUT', date:'2026-06-17T19:00:00Z', venue:'Estadio Akron',          city:'Guadalajara',       status:'scheduled' },
  { id:44, group:'H', round:'Fase de Grupos', home:'IRN', away:'QAT', date:'2026-06-17T01:00:00Z', venue:'Lincoln Financial',      city:'Filadelfia',        status:'scheduled' },
  { id:45, group:'H', round:'Fase de Grupos', home:'POR', away:'IRN', date:'2026-06-21T22:00:00Z', venue:'Mercedes-Benz Stadium',  city:'Atlanta',           status:'scheduled' },
  { id:46, group:'H', round:'Fase de Grupos', home:'QAT', away:'AUT', date:'2026-06-21T19:00:00Z', venue:'Estadio BBVA',           city:'Monterrey',         status:'scheduled' },
  { id:47, group:'H', round:'Fase de Grupos', home:'POR', away:'QAT', date:'2026-06-26T02:00:00Z', venue:'Gillette Stadium',       city:'Boston',            status:'scheduled' },
  { id:48, group:'H', round:'Fase de Grupos', home:'AUT', away:'IRN', date:'2026-06-26T02:00:00Z', venue:'Empower Field',          city:'Denver',            status:'scheduled' },
  // ── GRUPO I ───────────────────────────────────────────────────
  { id:49, group:'I', round:'Fase de Grupos', home:'BEL', away:'GHA', date:'2026-06-17T22:00:00Z', venue:'SoFi Stadium',           city:'Los Ángeles',       status:'scheduled' },
  { id:50, group:'I', round:'Fase de Grupos', home:'CIV', away:'TUN', date:'2026-06-18T22:00:00Z', venue:'Estadio Azteca',         city:'Ciudad de México',  status:'scheduled' },
  { id:51, group:'I', round:'Fase de Grupos', home:'BEL', away:'CIV', date:'2026-06-22T01:00:00Z', venue:'MetLife Stadium',        city:'Nueva York',        status:'scheduled' },
  { id:52, group:'I', round:'Fase de Grupos', home:'TUN', away:'GHA', date:'2026-06-22T19:00:00Z', venue:'BC Place',               city:'Vancouver',         status:'scheduled' },
  { id:53, group:'I', round:'Fase de Grupos', home:'BEL', away:'TUN', date:'2026-06-26T22:00:00Z', venue:'Levi\'s Stadium',        city:'San Francisco',     status:'scheduled' },
  { id:54, group:'I', round:'Fase de Grupos', home:'GHA', away:'CIV', date:'2026-06-26T22:00:00Z', venue:'Mercedes-Benz Stadium',  city:'Atlanta',           status:'scheduled' },
  // ── GRUPO J ───────────────────────────────────────────────────
  { id:55, group:'J', round:'Fase de Grupos', home:'JPN', away:'IRQ', date:'2026-06-18T01:00:00Z', venue:'AT&T Stadium',           city:'Dallas',            status:'scheduled' },
  { id:56, group:'J', round:'Fase de Grupos', home:'ECU', away:'RSA', date:'2026-06-18T17:00:00Z', venue:'Estadio Akron',          city:'Guadalajara',       status:'scheduled' },
  { id:57, group:'J', round:'Fase de Grupos', home:'JPN', away:'ECU', date:'2026-06-22T22:00:00Z', venue:'Hard Rock Stadium',      city:'Miami',             status:'scheduled' },
  { id:58, group:'J', round:'Fase de Grupos', home:'RSA', away:'IRQ', date:'2026-06-22T01:00:00Z', venue:'BC Place',               city:'Vancouver',         status:'scheduled' },
  { id:59, group:'J', round:'Fase de Grupos', home:'JPN', away:'RSA', date:'2026-06-27T02:00:00Z', venue:'Empower Field',          city:'Denver',            status:'scheduled' },
  { id:60, group:'J', round:'Fase de Grupos', home:'IRQ', away:'ECU', date:'2026-06-27T02:00:00Z', venue:'Gillette Stadium',       city:'Boston',            status:'scheduled' },
  // ── GRUPO K ───────────────────────────────────────────────────
  { id:61, group:'K', round:'Fase de Grupos', home:'CZE', away:'SEN', date:'2026-06-19T17:00:00Z', venue:'Estadio BBVA',           city:'Monterrey',         status:'scheduled' },
  { id:62, group:'K', round:'Fase de Grupos', home:'HAI', away:'UZB', date:'2026-06-20T17:00:00Z', venue:'Estadio Akron',          city:'Guadalajara',       status:'scheduled' },
  { id:63, group:'K', round:'Fase de Grupos', home:'CZE', away:'HAI', date:'2026-06-23T22:00:00Z', venue:'Lincoln Financial',      city:'Filadelfia',        status:'scheduled' },
  { id:64, group:'K', round:'Fase de Grupos', home:'UZB', away:'SEN', date:'2026-06-24T19:00:00Z', venue:'Mercedes-Benz Stadium',  city:'Atlanta',           status:'scheduled' },
  { id:65, group:'K', round:'Fase de Grupos', home:'CZE', away:'UZB', date:'2026-06-27T22:00:00Z', venue:'SoFi Stadium',           city:'Los Ángeles',       status:'scheduled' },
  { id:66, group:'K', round:'Fase de Grupos', home:'SEN', away:'HAI', date:'2026-06-27T22:00:00Z', venue:'AT&T Stadium',           city:'Dallas',            status:'scheduled' },
  // ── GRUPO L ───────────────────────────────────────────────────
  { id:67, group:'L', round:'Fase de Grupos', home:'ENG', away:'CRO', date:'2026-06-20T19:00:00Z', venue:'Gillette Stadium',       city:'Boston',            status:'scheduled' },
  { id:68, group:'L', round:'Fase de Grupos', home:'PAN', away:'SCO', date:'2026-06-21T01:00:00Z', venue:'Estadio Azteca',         city:'Ciudad de México',  status:'scheduled' },
  { id:69, group:'L', round:'Fase de Grupos', home:'CRO', away:'PAN', date:'2026-06-24T17:00:00Z', venue:'Estadio BBVA',           city:'Monterrey',         status:'scheduled' },
  { id:70, group:'L', round:'Fase de Grupos', home:'SCO', away:'ENG', date:'2026-06-25T01:00:00Z', venue:'Hard Rock Stadium',      city:'Miami',             status:'scheduled' },
  { id:71, group:'L', round:'Fase de Grupos', home:'CRO', away:'SCO', date:'2026-06-28T02:00:00Z', venue:'SoFi Stadium',           city:'Los Ángeles',       status:'scheduled' },
  { id:72, group:'L', round:'Fase de Grupos', home:'PAN', away:'ENG', date:'2026-06-28T02:00:00Z', venue:'BC Place',               city:'Vancouver',         status:'scheduled' },
  // ── OCTAVOS (placeholders) ────────────────────────────────────
  { id:73, round:'Octavos de Final', home:'1A', away:'2B', date:'2026-07-02T22:00:00Z', venue:'MetLife Stadium',       city:'Nueva York',       status:'scheduled' },
  { id:74, round:'Octavos de Final', home:'1B', away:'2A', date:'2026-07-03T01:00:00Z', venue:'AT&T Stadium',          city:'Dallas',           status:'scheduled' },
  { id:75, round:'Octavos de Final', home:'1C', away:'2D', date:'2026-07-04T22:00:00Z', venue:'SoFi Stadium',          city:'Los Ángeles',      status:'scheduled' },
  { id:76, round:'Octavos de Final', home:'1D', away:'2C', date:'2026-07-05T01:00:00Z', venue:'Hard Rock Stadium',     city:'Miami',            status:'scheduled' },
  { id:77, round:'Octavos de Final', home:'1E', away:'2F', date:'2026-07-05T22:00:00Z', venue:'Gillette Stadium',      city:'Boston',           status:'scheduled' },
  { id:78, round:'Octavos de Final', home:'1F', away:'2E', date:'2026-07-06T01:00:00Z', venue:'Levi\'s Stadium',       city:'San Francisco',    status:'scheduled' },
  { id:79, round:'Octavos de Final', home:'1G', away:'2H', date:'2026-07-07T22:00:00Z', venue:'Mercedes-Benz Stadium', city:'Atlanta',          status:'scheduled' },
  { id:80, round:'Octavos de Final', home:'1H', away:'2G', date:'2026-07-08T01:00:00Z', venue:'Lincoln Financial',     city:'Filadelfia',       status:'scheduled' },
  { id:81, round:'Octavos de Final', home:'1I', away:'2J', date:'2026-07-09T22:00:00Z', venue:'BC Place',              city:'Vancouver',        status:'scheduled' },
  { id:82, round:'Octavos de Final', home:'1J', away:'2I', date:'2026-07-10T01:00:00Z', venue:'Empower Field',         city:'Denver',           status:'scheduled' },
  { id:83, round:'Octavos de Final', home:'1K', away:'2L', date:'2026-07-10T22:00:00Z', venue:'Estadio Azteca',        city:'Ciudad de México', status:'scheduled' },
  { id:84, round:'Octavos de Final', home:'1L', away:'2K', date:'2026-07-11T01:00:00Z', venue:'Estadio BBVA',          city:'Monterrey',        status:'scheduled' },
  // ── CUARTOS, SEMIS, FINAL ─────────────────────────────────────
  { id:85, round:'Cuartos de Final', home:'G73/74', away:'G75/76', date:'2026-07-14T22:00:00Z', venue:'MetLife Stadium', city:'Nueva York', status:'scheduled' },
  { id:86, round:'Cuartos de Final', home:'G77/78', away:'G79/80', date:'2026-07-15T22:00:00Z', venue:'SoFi Stadium',    city:'Los Ángeles', status:'scheduled' },
  { id:87, round:'Cuartos de Final', home:'G81/82', away:'G83/84', date:'2026-07-16T22:00:00Z', venue:'AT&T Stadium',   city:'Dallas', status:'scheduled' },
  { id:88, round:'Cuartos de Final', home:'G85/86', away:'G87/88', date:'2026-07-17T22:00:00Z', venue:'Hard Rock Stadium', city:'Miami', status:'scheduled' },
  { id:89, round:'Semifinales',      home:'G85',    away:'G86',    date:'2026-07-21T22:00:00Z', venue:'MetLife Stadium', city:'Nueva York', status:'scheduled' },
  { id:90, round:'Semifinales',      home:'G87',    away:'G88',    date:'2026-07-22T22:00:00Z', venue:'AT&T Stadium',   city:'Dallas', status:'scheduled' },
  { id:91, round:'Tercer Puesto',    home:'Perdedor SF1', away:'Perdedor SF2', date:'2026-07-25T22:00:00Z', venue:'Estadio Azteca', city:'Ciudad de México', status:'scheduled' },
  { id:92, round:'FINAL',            home:'Ganador SF1',  away:'Ganador SF2',  date:'2026-07-19T22:00:00Z', venue:'MetLife Stadium', city:'Nueva York', status:'scheduled' },
];

const ROUND_ORDER = ['Fase de Grupos', 'Octavos de Final', 'Cuartos de Final', 'Semifinales', 'Tercer Puesto', 'FINAL'];
const GROUP_COLORS: Record<string, string> = {
  A:'#ef4444', B:'#74ACDF', C:'#3b82f6', D:'#f59e0b',
  E:'#22c55e', F:'#a855f7', G:'#06b6d4', H:'#f97316',
  I:'#ec4899', J:'#84cc16', K:'#14b8a6', L:'#8b5cf6',
};

export default function FixturePanel() {
  const [now, setNow] = useState(new Date());
  const [selectedRound, setSelectedRound] = useState('Fase de Grupos');
  const [selectedGroup, setSelectedGroup] = useState<string | 'all'>('all');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const enriched = useMemo(() => MATCHES.map(m => {
    const matchDate = new Date(m.date);
    const diffMs = matchDate.getTime() - now.getTime();
    let status: Match['status'] = m.status;
    if (diffMs < 0 && diffMs > -105 * 60 * 1000) status = 'live';
    else if (diffMs < -105 * 60 * 1000) status = 'finished';
    return { ...m, status };
  }), [now]);

  const rounds = ROUND_ORDER.filter(r => MATCHES.some(m => m.round === r));
  const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  const filtered = useMemo(() => enriched.filter(m => {
    if (m.round !== selectedRound) return false;
    if (selectedRound === 'Fase de Grupos' && selectedGroup !== 'all' && m.group !== selectedGroup) return false;
    return true;
  }), [enriched, selectedRound, selectedGroup]);

  const liveCount = enriched.filter(m => m.status === 'live').length;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden p-5 mb-5" style={{ background: 'linear-gradient(135deg, #0a1628, #001a3d)' }}>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center">
              <Trophy size={28} className="text-[#FFD700]" />
            </div>
            <div>
              <div className="font-bebas text-3xl text-[#FFD700] tracking-widest leading-none">Fixture Mundial 2026</div>
              <div className="font-barlow text-white/50 text-sm mt-0.5">Horarios en hora argentina (UTC-3)</div>
            </div>
          </div>
          {liveCount > 0 && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-barlow font-bold text-red-400 text-sm">{liveCount} EN VIVO</span>
            </div>
          )}
        </div>
      </div>

      {/* Round tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {rounds.map(r => (
          <button
            key={r}
            onClick={() => setSelectedRound(r)}
            className={`px-4 py-2 rounded-xl font-barlow font-semibold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              selectedRound === r
                ? 'bg-[#FFD700] text-[#001440]'
                : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Group filter (only for group stage) */}
      {selectedRound === 'Fase de Grupos' && (
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-lg font-barlow font-semibold text-xs flex-shrink-0 transition-all ${
              selectedGroup === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
            }`}
          >
            Todos
          </button>
          {groups.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              className="px-3 py-1.5 rounded-lg font-barlow font-bold text-xs flex-shrink-0 transition-all"
              style={{
                background: selectedGroup === g ? GROUP_COLORS[g] : `${GROUP_COLORS[g]}22`,
                color: selectedGroup === g ? '#001440' : GROUP_COLORS[g],
                border: `1px solid ${GROUP_COLORS[g]}44`,
              }}
            >
              Grupo {g}
            </button>
          ))}
        </div>
      )}

      {/* Matches */}
      <div className="space-y-2">
        {filtered.map((m) => {
          const isLive = m.status === 'live';
          const isFinished = m.status === 'finished';
          const groupColor = m.group ? GROUP_COLORS[m.group] : '#FFD700';

          return (
            <div
              key={m.id}
              className="rounded-xl overflow-hidden transition-all hover:scale-[1.005]"
              style={{
                background: isLive
                  ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))'
                  : isFinished
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(255,255,255,0.05)',
                border: isLive
                  ? '1px solid rgba(239,68,68,0.4)'
                  : `1px solid ${m.group ? groupColor + '22' : 'rgba(255,255,255,0.1)'}`,
                borderLeft: `3px solid ${isLive ? '#ef4444' : isFinished ? 'rgba(255,255,255,0.15)' : groupColor}`,
              }}
            >
              <div className="px-4 py-3">
                {/* Top row: group/round + date + venue */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    {m.group && (
                      <span className="font-barlow font-bold text-xs px-2 py-0.5 rounded" style={{ background: `${groupColor}22`, color: groupColor }}>
                        Grupo {m.group}
                      </span>
                    )}
                    {isLive && (
                      <span className="font-barlow font-bold text-xs text-red-400 flex items-center gap-1">
                        <RefreshCw size={10} className="animate-spin" /> EN VIVO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-white/40 text-xs font-barlow">
                    <span className="flex items-center gap-1"><Clock size={10} /> {formatArgTime(m.date)}</span>
                    <span className="hidden sm:flex items-center gap-1"><MapPin size={10} /> {m.city}</span>
                  </div>
                </div>

                {/* Teams + score */}
                <div className="flex items-center gap-3">
                  <span className={`font-bebas text-xl flex-1 text-right tracking-wide ${isFinished ? 'text-white/60' : 'text-white'}`}>
                    {m.home}
                  </span>
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl min-w-[80px] justify-center"
                    style={{ background: isLive ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)' }}
                  >
                    {isFinished || isLive ? (
                      <>
                        <span className="font-bebas text-xl text-white">{m.homeScore ?? '0'}</span>
                        <span className="font-barlow text-white/40">-</span>
                        <span className="font-bebas text-xl text-white">{m.awayScore ?? '0'}</span>
                      </>
                    ) : (
                      <span className="font-barlow text-white/50 text-xs text-center leading-tight">
                        {formatArgDate(m.date)}
                      </span>
                    )}
                  </div>
                  <span className={`font-bebas text-xl flex-1 tracking-wide ${isFinished ? 'text-white/60' : 'text-white'}`}>
                    {m.away}
                  </span>
                </div>

                {/* Venue */}
                <div className="mt-1.5 text-center">
                  <span className="font-barlow text-white/25 text-xs flex items-center justify-center gap-1">
                    <MapPin size={9} /> {m.venue}, {m.city}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="font-barlow text-white/20 text-xs">
          Horarios en hora argentina (UTC-3) · Los resultados se actualizan automáticamente
        </p>
      </div>
    </div>
  );
}
