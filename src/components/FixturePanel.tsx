import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapPin, Clock, Trophy, RefreshCw } from 'lucide-react';

// Argentina = UTC-3
function toArgDate(utc: string) {
  return new Date(new Date(utc).getTime() - 3 * 3600 * 1000);
}
function fmtDate(utc: string) {
  return toArgDate(utc).toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' });
}
function fmtTime(utc: string) {
  return toArgDate(utc).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' ARG';
}

interface Match {
  id: number;
  group?: string;
  round: string;
  home: string;
  away: string;
  date: string;   // ISO UTC
  venue: string;
  city: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished';
}

// Grupos confirmados — FIFA World Cup 2026
// Fuente: fifa.com / Al Jazeera / Yahoo Sports
// Horarios en UTC (Argentina = UTC-3)
const MATCHES: Match[] = [
  // ── GRUPO A: MEX · KOR · CZE · RSA ───────────────────────────
  { id:1,  group:'A', round:'Fase de Grupos', home:'MEX', away:'RSA', date:'2026-06-11T19:00:00Z', venue:'Estadio Azteca',          city:'Ciudad de México',  status:'scheduled' },
  { id:2,  group:'A', round:'Fase de Grupos', home:'KOR', away:'CZE', date:'2026-06-11T23:00:00Z', venue:'Estadio Akron',           city:'Guadalajara',        status:'scheduled' },
  { id:3,  group:'A', round:'Fase de Grupos', home:'MEX', away:'KOR', date:'2026-06-16T23:00:00Z', venue:'Estadio BBVA',            city:'Monterrey',          status:'scheduled' },
  { id:4,  group:'A', round:'Fase de Grupos', home:'CZE', away:'RSA', date:'2026-06-17T19:00:00Z', venue:'Mercedes-Benz Stadium',   city:'Atlanta',            status:'scheduled' },
  { id:5,  group:'A', round:'Fase de Grupos', home:'CZE', away:'MEX', date:'2026-06-22T02:00:00Z', venue:'Estadio Azteca',          city:'Ciudad de México',   status:'scheduled' },
  { id:6,  group:'A', round:'Fase de Grupos', home:'RSA', away:'KOR', date:'2026-06-22T02:00:00Z', venue:'AT&T Stadium',            city:'Dallas',             status:'scheduled' },
  // ── GRUPO B: CAN · QAT · BIH · SUI ──────────────────────────
  { id:7,  group:'B', round:'Fase de Grupos', home:'CAN', away:'BIH', date:'2026-06-12T23:00:00Z', venue:'BMO Field',               city:'Toronto',            status:'scheduled' },
  { id:8,  group:'B', round:'Fase de Grupos', home:'QAT', away:'SUI', date:'2026-06-13T02:00:00Z', venue:'Levi\'s Stadium',         city:'San Francisco',      status:'scheduled' },
  { id:9,  group:'B', round:'Fase de Grupos', home:'SUI', away:'BIH', date:'2026-06-18T01:00:00Z', venue:'SoFi Stadium',            city:'Los Ángeles',        status:'scheduled' },
  { id:10, group:'B', round:'Fase de Grupos', home:'CAN', away:'QAT', date:'2026-06-18T23:00:00Z', venue:'BC Place',                city:'Vancouver',          status:'scheduled' },
  { id:11, group:'B', round:'Fase de Grupos', home:'SUI', away:'CAN', date:'2026-06-22T22:00:00Z', venue:'BC Place',                city:'Vancouver',          status:'scheduled' },
  { id:12, group:'B', round:'Fase de Grupos', home:'BIH', away:'QAT', date:'2026-06-22T22:00:00Z', venue:'BMO Field',               city:'Toronto',            status:'scheduled' },
  // ── GRUPO C: BRA · MAR · HAI · SCO ───────────────────────────
  { id:13, group:'C', round:'Fase de Grupos', home:'BRA', away:'HAI', date:'2026-06-13T23:00:00Z', venue:'Hard Rock Stadium',       city:'Miami',              status:'scheduled' },
  { id:14, group:'C', round:'Fase de Grupos', home:'MAR', away:'SCO', date:'2026-06-14T02:00:00Z', venue:'Lincoln Financial',       city:'Filadelfia',         status:'scheduled' },
  { id:15, group:'C', round:'Fase de Grupos', home:'BRA', away:'MAR', date:'2026-06-19T02:00:00Z', venue:'MetLife Stadium',         city:'Nueva York',         status:'scheduled' },
  { id:16, group:'C', round:'Fase de Grupos', home:'HAI', away:'SCO', date:'2026-06-19T23:00:00Z', venue:'AT&T Stadium',            city:'Dallas',             status:'scheduled' },
  { id:17, group:'C', round:'Fase de Grupos', home:'BRA', away:'SCO', date:'2026-06-24T02:00:00Z', venue:'Gillette Stadium',        city:'Boston',             status:'scheduled' },
  { id:18, group:'C', round:'Fase de Grupos', home:'MAR', away:'HAI', date:'2026-06-24T02:00:00Z', venue:'Hard Rock Stadium',       city:'Miami',              status:'scheduled' },
  // ── GRUPO D: USA · PAR · TUR · AUS ───────────────────────────
  { id:19, group:'D', round:'Fase de Grupos', home:'USA', away:'PAR', date:'2026-06-12T02:00:00Z', venue:'SoFi Stadium',            city:'Los Ángeles',        status:'scheduled' },
  { id:20, group:'D', round:'Fase de Grupos', home:'TUR', away:'AUS', date:'2026-06-13T19:00:00Z', venue:'Empower Field',           city:'Denver',             status:'scheduled' },
  { id:21, group:'D', round:'Fase de Grupos', home:'USA', away:'TUR', date:'2026-06-18T23:00:00Z', venue:'Levi\'s Stadium',         city:'San Francisco',      status:'scheduled' },
  { id:22, group:'D', round:'Fase de Grupos', home:'AUS', away:'PAR', date:'2026-06-19T19:00:00Z', venue:'Empower Field',           city:'Denver',             status:'scheduled' },
  { id:23, group:'D', round:'Fase de Grupos', home:'USA', away:'AUS', date:'2026-06-24T22:00:00Z', venue:'SoFi Stadium',            city:'Los Ángeles',        status:'scheduled' },
  { id:24, group:'D', round:'Fase de Grupos', home:'PAR', away:'TUR', date:'2026-06-24T22:00:00Z', venue:'Empower Field',           city:'Denver',             status:'scheduled' },
  // ── GRUPO E: GER · CUW · CIV · ECU ───────────────────────────
  { id:25, group:'E', round:'Fase de Grupos', home:'GER', away:'CUW', date:'2026-06-14T23:00:00Z', venue:'MetLife Stadium',         city:'Nueva York',         status:'scheduled' },
  { id:26, group:'E', round:'Fase de Grupos', home:'CIV', away:'ECU', date:'2026-06-15T02:00:00Z', venue:'AT&T Stadium',            city:'Dallas',             status:'scheduled' },
  { id:27, group:'E', round:'Fase de Grupos', home:'GER', away:'CIV', date:'2026-06-20T02:00:00Z', venue:'Mercedes-Benz Stadium',   city:'Atlanta',            status:'scheduled' },
  { id:28, group:'E', round:'Fase de Grupos', home:'CUW', away:'ECU', date:'2026-06-20T23:00:00Z', venue:'Hard Rock Stadium',       city:'Miami',              status:'scheduled' },
  { id:29, group:'E', round:'Fase de Grupos', home:'GER', away:'ECU', date:'2026-06-25T02:00:00Z', venue:'MetLife Stadium',         city:'Nueva York',         status:'scheduled' },
  { id:30, group:'E', round:'Fase de Grupos', home:'CUW', away:'CIV', date:'2026-06-25T02:00:00Z', venue:'AT&T Stadium',            city:'Dallas',             status:'scheduled' },
  // ── GRUPO F: NED · JPN · SWE · TUN ───────────────────────────
  { id:31, group:'F', round:'Fase de Grupos', home:'NED', away:'JPN', date:'2026-06-15T23:00:00Z', venue:'Gillette Stadium',        city:'Boston',             status:'scheduled' },
  { id:32, group:'F', round:'Fase de Grupos', home:'SWE', away:'TUN', date:'2026-06-16T02:00:00Z', venue:'Lincoln Financial',       city:'Filadelfia',         status:'scheduled' },
  { id:33, group:'F', round:'Fase de Grupos', home:'NED', away:'SWE', date:'2026-06-21T02:00:00Z', venue:'BC Place',                city:'Vancouver',          status:'scheduled' },
  { id:34, group:'F', round:'Fase de Grupos', home:'JPN', away:'TUN', date:'2026-06-21T23:00:00Z', venue:'Levi\'s Stadium',         city:'San Francisco',      status:'scheduled' },
  { id:35, group:'F', round:'Fase de Grupos', home:'NED', away:'TUN', date:'2026-06-26T02:00:00Z', venue:'BMO Field',               city:'Toronto',            status:'scheduled' },
  { id:36, group:'F', round:'Fase de Grupos', home:'JPN', away:'SWE', date:'2026-06-26T02:00:00Z', venue:'Gillette Stadium',        city:'Boston',             status:'scheduled' },
  // ── GRUPO G: BEL · IRN · EGY · NZL ───────────────────────────
  { id:37, group:'G', round:'Fase de Grupos', home:'BEL', away:'EGY', date:'2026-06-15T19:00:00Z', venue:'SoFi Stadium',            city:'Los Ángeles',        status:'scheduled' },
  { id:38, group:'G', round:'Fase de Grupos', home:'IRN', away:'NZL', date:'2026-06-16T19:00:00Z', venue:'Estadio Azteca',          city:'Ciudad de México',   status:'scheduled' },
  { id:39, group:'G', round:'Fase de Grupos', home:'BEL', away:'IRN', date:'2026-06-21T19:00:00Z', venue:'Lincoln Financial',       city:'Filadelfia',         status:'scheduled' },
  { id:40, group:'G', round:'Fase de Grupos', home:'EGY', away:'NZL', date:'2026-06-21T23:00:00Z', venue:'Empower Field',           city:'Denver',             status:'scheduled' },
  { id:41, group:'G', round:'Fase de Grupos', home:'BEL', away:'NZL', date:'2026-06-26T22:00:00Z', venue:'AT&T Stadium',            city:'Dallas',             status:'scheduled' },
  { id:42, group:'G', round:'Fase de Grupos', home:'EGY', away:'IRN', date:'2026-06-26T22:00:00Z', venue:'Hard Rock Stadium',       city:'Miami',              status:'scheduled' },
  // ── GRUPO H: ESP · CPV · KSA · URU ───────────────────────────
  { id:43, group:'H', round:'Fase de Grupos', home:'ESP', away:'URU', date:'2026-06-14T19:00:00Z', venue:'Estadio BBVA',            city:'Monterrey',          status:'scheduled' },
  { id:44, group:'H', round:'Fase de Grupos', home:'CPV', away:'KSA', date:'2026-06-14T23:00:00Z', venue:'Estadio Akron',           city:'Guadalajara',        status:'scheduled' },
  { id:45, group:'H', round:'Fase de Grupos', home:'ESP', away:'CPV', date:'2026-06-20T19:00:00Z', venue:'SoFi Stadium',            city:'Los Ángeles',        status:'scheduled' },
  { id:46, group:'H', round:'Fase de Grupos', home:'URU', away:'KSA', date:'2026-06-20T23:00:00Z', venue:'MetLife Stadium',         city:'Nueva York',         status:'scheduled' },
  { id:47, group:'H', round:'Fase de Grupos', home:'ESP', away:'KSA', date:'2026-06-25T22:00:00Z', venue:'Estadio Azteca',          city:'Ciudad de México',   status:'scheduled' },
  { id:48, group:'H', round:'Fase de Grupos', home:'URU', away:'CPV', date:'2026-06-25T22:00:00Z', venue:'Estadio Akron',           city:'Guadalajara',        status:'scheduled' },
  // ── GRUPO I: FRA · SEN · IRQ · NOR ───────────────────────────
  { id:49, group:'I', round:'Fase de Grupos', home:'FRA', away:'SEN', date:'2026-06-13T22:00:00Z', venue:'AT&T Stadium',            city:'Dallas',             status:'scheduled' },
  { id:50, group:'I', round:'Fase de Grupos', home:'IRQ', away:'NOR', date:'2026-06-14T01:00:00Z', venue:'Gillette Stadium',        city:'Boston',             status:'scheduled' },
  { id:51, group:'I', round:'Fase de Grupos', home:'FRA', away:'IRQ', date:'2026-06-18T19:00:00Z', venue:'Empower Field',           city:'Denver',             status:'scheduled' },
  { id:52, group:'I', round:'Fase de Grupos', home:'NOR', away:'SEN', date:'2026-06-18T23:00:00Z', venue:'BC Place',                city:'Vancouver',          status:'scheduled' },
  { id:53, group:'I', round:'Fase de Grupos', home:'FRA', away:'NOR', date:'2026-06-24T01:00:00Z', venue:'Levi\'s Stadium',         city:'San Francisco',      status:'scheduled' },
  { id:54, group:'I', round:'Fase de Grupos', home:'SEN', away:'IRQ', date:'2026-06-24T01:00:00Z', venue:'MetLife Stadium',         city:'Nueva York',         status:'scheduled' },
  // ── GRUPO J: ARG · AUT · JOR · ALG ───────────────────────────
  { id:55, group:'J', round:'Fase de Grupos', home:'ARG', away:'JOR', date:'2026-06-15T01:00:00Z', venue:'MetLife Stadium',         city:'Nueva York',         status:'scheduled' },
  { id:56, group:'J', round:'Fase de Grupos', home:'AUT', away:'ALG', date:'2026-06-15T22:00:00Z', venue:'Lincoln Financial',       city:'Filadelfia',         status:'scheduled' },
  { id:57, group:'J', round:'Fase de Grupos', home:'ARG', away:'AUT', date:'2026-06-20T01:00:00Z', venue:'Hard Rock Stadium',       city:'Miami',              status:'scheduled' },
  { id:58, group:'J', round:'Fase de Grupos', home:'ALG', away:'JOR', date:'2026-06-20T22:00:00Z', venue:'SoFi Stadium',            city:'Los Ángeles',        status:'scheduled' },
  { id:59, group:'J', round:'Fase de Grupos', home:'ARG', away:'ALG', date:'2026-06-25T01:00:00Z', venue:'MetLife Stadium',         city:'Nueva York',         status:'scheduled' },
  { id:60, group:'J', round:'Fase de Grupos', home:'JOR', away:'AUT', date:'2026-06-25T01:00:00Z', venue:'Lincoln Financial',       city:'Filadelfia',         status:'scheduled' },
  // ── GRUPO K: POR · COD · UZB · COL ───────────────────────────
  { id:61, group:'K', round:'Fase de Grupos', home:'POR', away:'COL', date:'2026-06-13T01:00:00Z', venue:'Estadio Akron',           city:'Guadalajara',        status:'scheduled' },
  { id:62, group:'K', round:'Fase de Grupos', home:'COD', away:'UZB', date:'2026-06-13T19:00:00Z', venue:'Estadio BBVA',            city:'Monterrey',          status:'scheduled' },
  { id:63, group:'K', round:'Fase de Grupos', home:'POR', away:'COD', date:'2026-06-19T01:00:00Z', venue:'Estadio Azteca',          city:'Ciudad de México',   status:'scheduled' },
  { id:64, group:'K', round:'Fase de Grupos', home:'UZB', away:'COL', date:'2026-06-19T22:00:00Z', venue:'Mercedes-Benz Stadium',   city:'Atlanta',            status:'scheduled' },
  { id:65, group:'K', round:'Fase de Grupos', home:'POR', away:'UZB', date:'2026-06-24T22:00:00Z', venue:'Estadio BBVA',            city:'Monterrey',          status:'scheduled' },
  { id:66, group:'K', round:'Fase de Grupos', home:'COL', away:'COD', date:'2026-06-24T22:00:00Z', venue:'Estadio Akron',           city:'Guadalajara',        status:'scheduled' },
  // ── GRUPO L: ENG · CRO · GHA · PAN ───────────────────────────
  { id:67, group:'L', round:'Fase de Grupos', home:'ENG', away:'PAN', date:'2026-06-14T22:00:00Z', venue:'Gillette Stadium',        city:'Boston',             status:'scheduled' },
  { id:68, group:'L', round:'Fase de Grupos', home:'CRO', away:'GHA', date:'2026-06-15T23:00:00Z', venue:'Mercedes-Benz Stadium',   city:'Atlanta',            status:'scheduled' },
  { id:69, group:'L', round:'Fase de Grupos', home:'ENG', away:'CRO', date:'2026-06-21T01:00:00Z', venue:'Lincoln Financial',       city:'Filadelfia',         status:'scheduled' },
  { id:70, group:'L', round:'Fase de Grupos', home:'GHA', away:'PAN', date:'2026-06-21T22:00:00Z', venue:'SoFi Stadium',            city:'Los Ángeles',        status:'scheduled' },
  { id:71, group:'L', round:'Fase de Grupos', home:'ENG', away:'GHA', date:'2026-06-26T01:00:00Z', venue:'Gillette Stadium',        city:'Boston',             status:'scheduled' },
  { id:72, group:'L', round:'Fase de Grupos', home:'CRO', away:'PAN', date:'2026-06-26T01:00:00Z', venue:'Mercedes-Benz Stadium',   city:'Atlanta',            status:'scheduled' },
  // ── RONDA DE 32 ───────────────────────────────────────────────
  { id:73, round:'Ronda de 32', home:'1A', away:'3E/F/G', date:'2026-07-01T23:00:00Z', venue:'MetLife Stadium',        city:'Nueva York',         status:'scheduled' },
  { id:74, round:'Ronda de 32', home:'1C', away:'3A/B/D', date:'2026-07-02T19:00:00Z', venue:'AT&T Stadium',           city:'Dallas',             status:'scheduled' },
  { id:75, round:'Ronda de 32', home:'1B', away:'3G/H/I', date:'2026-07-02T23:00:00Z', venue:'SoFi Stadium',           city:'Los Ángeles',        status:'scheduled' },
  { id:76, round:'Ronda de 32', home:'2A', away:'2C',     date:'2026-07-03T19:00:00Z', venue:'Hard Rock Stadium',      city:'Miami',              status:'scheduled' },
  { id:77, round:'Ronda de 32', home:'1E', away:'3J/K/L', date:'2026-07-03T23:00:00Z', venue:'Gillette Stadium',       city:'Boston',             status:'scheduled' },
  { id:78, round:'Ronda de 32', home:'1F', away:'3A/B/C', date:'2026-07-04T19:00:00Z', venue:'Levi\'s Stadium',        city:'San Francisco',      status:'scheduled' },
  { id:79, round:'Ronda de 32', home:'1D', away:'2B',     date:'2026-07-04T23:00:00Z', venue:'Empower Field',          city:'Denver',             status:'scheduled' },
  { id:80, round:'Ronda de 32', home:'2E', away:'2G',     date:'2026-07-05T19:00:00Z', venue:'Lincoln Financial',      city:'Filadelfia',         status:'scheduled' },
  { id:81, round:'Ronda de 32', home:'1H', away:'3D/E/F', date:'2026-07-05T23:00:00Z', venue:'Mercedes-Benz Stadium',  city:'Atlanta',            status:'scheduled' },
  { id:82, round:'Ronda de 32', home:'1G', away:'2H',     date:'2026-07-06T19:00:00Z', venue:'BC Place',               city:'Vancouver',          status:'scheduled' },
  { id:83, round:'Ronda de 32', home:'1I', away:'3B/C/D', date:'2026-07-06T23:00:00Z', venue:'AT&T Stadium',           city:'Dallas',             status:'scheduled' },
  { id:84, round:'Ronda de 32', home:'1J', away:'2F',     date:'2026-07-07T19:00:00Z', venue:'Estadio Azteca',         city:'Ciudad de México',   status:'scheduled' },
  { id:85, round:'Ronda de 32', home:'1K', away:'2I',     date:'2026-07-07T23:00:00Z', venue:'Estadio BBVA',           city:'Monterrey',          status:'scheduled' },
  { id:86, round:'Ronda de 32', home:'1L', away:'2K',     date:'2026-07-08T19:00:00Z', venue:'MetLife Stadium',        city:'Nueva York',         status:'scheduled' },
  { id:87, round:'Ronda de 32', home:'2D', away:'2J',     date:'2026-07-08T23:00:00Z', venue:'SoFi Stadium',           city:'Los Ángeles',        status:'scheduled' },
  { id:88, round:'Ronda de 32', home:'2L', away:'1C2D',   date:'2026-07-09T19:00:00Z', venue:'Levi\'s Stadium',        city:'San Francisco',      status:'scheduled' },
  // ── CUARTOS DE FINAL ─────────────────────────────────────────
  { id:89, round:'Cuartos de Final', home:'G73/G74', away:'G75/G76', date:'2026-07-12T23:00:00Z', venue:'MetLife Stadium',       city:'Nueva York',         status:'scheduled' },
  { id:90, round:'Cuartos de Final', home:'G77/G78', away:'G79/G80', date:'2026-07-13T19:00:00Z', venue:'SoFi Stadium',          city:'Los Ángeles',        status:'scheduled' },
  { id:91, round:'Cuartos de Final', home:'G81/G82', away:'G83/G84', date:'2026-07-13T23:00:00Z', venue:'AT&T Stadium',          city:'Dallas',             status:'scheduled' },
  { id:92, round:'Cuartos de Final', home:'G85/G86', away:'G87/G88', date:'2026-07-14T19:00:00Z', venue:'Hard Rock Stadium',     city:'Miami',              status:'scheduled' },
  // ── SEMIFINALES ───────────────────────────────────────────────
  { id:93, round:'Semifinales', home:'G89',  away:'G90',  date:'2026-07-15T23:00:00Z', venue:'MetLife Stadium',        city:'Nueva York',         status:'scheduled' },
  { id:94, round:'Semifinales', home:'G91',  away:'G92',  date:'2026-07-16T23:00:00Z', venue:'AT&T Stadium',           city:'Dallas',             status:'scheduled' },
  // ── TERCER PUESTO ─────────────────────────────────────────────
  { id:95, round:'Tercer Puesto', home:'Perdedor SF1', away:'Perdedor SF2', date:'2026-07-18T23:00:00Z', venue:'Estadio Azteca', city:'Ciudad de México',   status:'scheduled' },
  // ── FINAL ─────────────────────────────────────────────────────
  { id:96, round:'FINAL', home:'Ganador SF1', away:'Ganador SF2', date:'2026-07-19T23:00:00Z', venue:'MetLife Stadium', city:'Nueva York', status:'scheduled' },
];

const ROUND_ORDER = ['Fase de Grupos','Ronda de 32','Cuartos de Final','Semifinales','Tercer Puesto','FINAL'];
const GROUP_COLORS: Record<string, string> = {
  A:'#ef4444', B:'#f97316', C:'#22c55e', D:'#3b82f6',
  E:'#a855f7', F:'#06b6d4', G:'#f59e0b', H:'#ec4899',
  I:'#84cc16', J:'#74ACDF', K:'#14b8a6', L:'#8b5cf6',
};
const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

// ── Open Football live data ─────────────────────────────────────
const LIVE_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/en/matches.json';

interface OpenMatch { num: number; score1?: number; score2?: number; }

export default function FixturePanel() {
  const [now, setNow] = useState(new Date());
  const [selectedRound, setSelectedRound] = useState('Fase de Grupos');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [liveData, setLiveData] = useState<Record<number, { s1: number; s2: number }>>({});
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // Clock tick every 30s
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Fetch live scores from openfootball
  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch(LIVE_URL + '?t=' + Date.now());
      if (!res.ok) return;
      const data = await res.json() as { rounds?: { matches?: OpenMatch[] }[] };
      const map: Record<number, { s1: number; s2: number }> = {};
      data.rounds?.forEach(r => r.matches?.forEach(m => {
        if (m.num && m.score1 != null && m.score2 != null) {
          map[m.num] = { s1: m.score1, s2: m.score2 };
        }
      }));
      setLiveData(map);
      setLastFetch(new Date());
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => {
    fetchLive();
    const t = setInterval(fetchLive, 60000); // refresh every minute
    return () => clearInterval(t);
  }, [fetchLive]);

  const enriched = useMemo(() => MATCHES.map(m => {
    const matchDate = new Date(m.date);
    const diffMs = matchDate.getTime() - now.getTime();
    let status: Match['status'] = 'scheduled';
    if (diffMs < -105 * 60 * 1000) status = 'finished';
    else if (diffMs < 0) status = 'live';
    const live = liveData[m.id];
    return {
      ...m,
      status,
      homeScore: live ? live.s1 : m.homeScore,
      awayScore: live ? live.s2 : m.awayScore,
    };
  }), [now, liveData]);

  const rounds = ROUND_ORDER.filter(r => MATCHES.some(m => m.round === r));
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
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
              <Trophy size={28} className="text-[#FFD700]" />
            </div>
            <div>
              <div className="font-bebas text-3xl text-[#FFD700] tracking-widest leading-none">Fixture Mundial 2026</div>
              <div className="font-barlow text-white/50 text-sm mt-0.5 flex items-center gap-2">
                Horarios en hora argentina (UTC-3)
                {lastFetch && (
                  <span className="text-emerald-400/60 text-xs">· Actualizado {lastFetch.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {liveCount > 0 && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-barlow font-bold text-red-400 text-sm">{liveCount} EN VIVO</span>
              </div>
            )}
            <button
              onClick={fetchLive}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/50 hover:text-white"
              title="Actualizar resultados"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Round tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4">
        {rounds.map(r => (
          <button key={r} onClick={() => setSelectedRound(r)}
            className={`px-4 py-2 rounded-xl font-barlow font-semibold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              selectedRound === r ? 'bg-[#FFD700] text-[#001440]' : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
            }`}
          >{r}</button>
        ))}
      </div>

      {/* Group filter */}
      {selectedRound === 'Fase de Grupos' && (
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4">
          <button onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-lg font-barlow font-semibold text-xs flex-shrink-0 transition-all ${
              selectedGroup === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
            }`}
          >Todos</button>
          {GROUPS.map(g => (
            <button key={g} onClick={() => setSelectedGroup(g)}
              className="px-3 py-1.5 rounded-lg font-barlow font-bold text-xs flex-shrink-0 transition-all"
              style={{
                background: selectedGroup === g ? GROUP_COLORS[g] : `${GROUP_COLORS[g]}22`,
                color: selectedGroup === g ? '#001440' : GROUP_COLORS[g],
                border: `1px solid ${GROUP_COLORS[g]}44`,
              }}
            >Grupo {g}</button>
          ))}
        </div>
      )}

      {/* Match list */}
      <div className="space-y-2">
        {filtered.map(m => {
          const isLive = m.status === 'live';
          const isFinished = m.status === 'finished';
          const gc = m.group ? GROUP_COLORS[m.group] : '#FFD700';
          return (
            <div key={m.id} className="rounded-xl overflow-hidden transition-all hover:scale-[1.005]"
              style={{
                background: isLive ? 'linear-gradient(135deg,rgba(239,68,68,.12),rgba(239,68,68,.04))' : 'rgba(255,255,255,0.04)',
                border: isLive ? '1px solid rgba(239,68,68,.4)' : `1px solid ${m.group ? gc+'22' : 'rgba(255,255,255,.08)'}`,
                borderLeft: `3px solid ${isLive ? '#ef4444' : isFinished ? 'rgba(255,255,255,.15)' : gc}`,
              }}
            >
              <div className="px-4 py-3">
                {/* Top info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {m.group && (
                      <span className="font-barlow font-bold text-xs px-2 py-0.5 rounded"
                        style={{ background: `${gc}22`, color: gc }}>Grupo {m.group}</span>
                    )}
                    {isLive && (
                      <span className="font-barlow font-bold text-xs text-red-400 flex items-center gap-1">
                        <RefreshCw size={10} className="animate-spin" /> EN VIVO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-white/35 text-xs font-barlow">
                    <span className="flex items-center gap-1"><Clock size={10} />{fmtTime(m.date)}</span>
                    <span className="hidden sm:flex items-center gap-1"><MapPin size={10} />{m.city}</span>
                  </div>
                </div>

                {/* Teams + score */}
                <div className="flex items-center gap-2">
                  <span className={`font-bebas text-xl flex-1 text-right tracking-wide ${isFinished ? 'text-white/55' : 'text-white'}`}>{m.home}</span>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl min-w-[90px] justify-center"
                    style={{ background: isLive ? 'rgba(239,68,68,.18)' : 'rgba(255,255,255,.07)' }}
                  >
                    {(isFinished || isLive) && m.homeScore != null ? (
                      <>
                        <span className="font-bebas text-xl text-white">{m.homeScore}</span>
                        <span className="font-barlow text-white/30 text-sm">-</span>
                        <span className="font-bebas text-xl text-white">{m.awayScore}</span>
                      </>
                    ) : (
                      <span className="font-barlow text-white/40 text-xs text-center leading-tight">{fmtDate(m.date)}</span>
                    )}
                  </div>
                  <span className={`font-bebas text-xl flex-1 tracking-wide ${isFinished ? 'text-white/55' : 'text-white'}`}>{m.away}</span>
                </div>

                {/* Venue */}
                <div className="mt-1 text-center">
                  <span className="font-barlow text-white/20 text-xs flex items-center justify-center gap-1">
                    <MapPin size={9} />{m.venue}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-center font-barlow text-white/20 text-xs">
        Resultados en tiempo real vía openfootball · Horario argentino UTC-3
      </p>
    </div>
  );
}
