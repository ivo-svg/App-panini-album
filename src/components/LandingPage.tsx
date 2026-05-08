import { useState, useEffect } from 'react';
import { BookOpen, Calendar } from 'lucide-react';

interface Props {
  onEnter: (section: 'album' | 'fixture') => void;
  collectedCount: number;
  totalStickers: number;
}

const MOMENTS = [
  {
    year: '1994',
    title: 'El Silencio de Baggio',
    subtitle: 'Roberto Baggio con la cabeza gacha después de errar el penal que le entregó el Mundial a Brasil',
    location: 'Pasadena, EE.UU.',
    colors: ['#003087', '#FFFFFF', '#CE1126'],
    bg: 'linear-gradient(135deg, #0a1628 0%, #003087 40%, #1a0a0a 100%)',
    accent: '#4a90d9',
    symbol: '⚽',
    country: 'ITA vs BRA',
  },
  {
    year: '1986',
    title: 'La Mano de Dios',
    subtitle: 'Maradona marca con la mano y luego hace "el gol del siglo" en Azteca — 5 jugadores gambeteados',
    location: 'Ciudad de México',
    colors: ['#74ACDF', '#FFFFFF', '#74ACDF'],
    bg: 'linear-gradient(135deg, #001a3d 0%, #003d7a 45%, #001a3d 100%)',
    accent: '#74ACDF',
    symbol: '🙌',
    country: 'ARG vs ENG',
  },
  {
    year: '2022',
    title: 'La Copa es Nuestra',
    subtitle: 'Messi subido a los hombros de sus compañeros, copa en alto, después de 36 años de espera',
    location: 'Lusail, Qatar',
    colors: ['#74ACDF', '#FFFFFF', '#FFD700'],
    bg: 'linear-gradient(135deg, #0d1b2a 0%, #74ACDF44 50%, #0d1b2a 100%)',
    accent: '#FFD700',
    symbol: '🏆',
    country: 'ARG vs FRA',
  },
  {
    year: '2010',
    title: 'Ke Nako — Es el Momento',
    subtitle: 'Sudáfrica baila la tsonga mientras sorprende al mundo en su propio Mundial, el primero africano',
    location: 'Johannesburgo, Sudáfrica',
    colors: ['#007A4D', '#FFB612', '#001489'],
    bg: 'linear-gradient(135deg, #0a1e0a 0%, #1a5c1a 40%, #3d2a00 100%)',
    accent: '#FFB612',
    symbol: '🌍',
    country: 'RSA 2010',
  },
  {
    year: '2006',
    title: 'El Cabezazo de Zidane',
    subtitle: 'Zidane expulsado en la final por cabezazo a Materazzi — su último partido como profesional',
    location: 'Berlín, Alemania',
    colors: ['#002395', '#ED2939', '#FFFFFF'],
    bg: 'linear-gradient(135deg, #0a0a1e 0%, #1a1a3d 45%, #2d0a0a 100%)',
    accent: '#ED2939',
    symbol: '😤',
    country: 'FRA vs ITA',
  },
  {
    year: '2014',
    title: 'El Mineirazo',
    subtitle: 'Alemania goleó 7-1 a Brasil en su propia casa — la noche que paralizó a un país entero',
    location: 'Belo Horizonte, Brasil',
    colors: ['#000000', '#FFFFFF', '#FF0000'],
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d0a0a 100%)',
    accent: '#FFFFFF',
    symbol: '7️⃣',
    country: 'BRA 1-7 GER',
  },
  {
    year: '1970',
    title: 'Brasil Eterno',
    subtitle: 'Pelé, Jairzinho, Tostão, Rivelino — el equipo más bello de la historia gana su tercer Mundial',
    location: 'Ciudad de México',
    colors: ['#009B3A', '#FEDF00', '#002776'],
    bg: 'linear-gradient(135deg, #0a1e0a 0%, #004d1a 45%, #1a1400 100%)',
    accent: '#FEDF00',
    symbol: '👑',
    country: 'Brasil 1970',
  },
  {
    year: '2018',
    title: 'La Chilena de Ronaldo',
    subtitle: 'Cristiano Ronaldo anota de chilena un gol imposible que dejó al mundo sin palabras',
    location: 'Sochi, Rusia',
    colors: ['#006600', '#CC0000', '#FFD700'],
    bg: 'linear-gradient(135deg, #0a1a0a 0%, #1a3d1a 45%, #2d0000 100%)',
    accent: '#FFD700',
    symbol: '✨',
    country: 'POR vs ESP',
  },
];

export default function LandingPage({ onEnter, collectedCount, totalStickers }: Props) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % MOMENTS.length);
        setFading(false);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const moment = MOMENTS[current];
  const progress = totalStickers > 0 ? Math.round((collectedCount / totalStickers) * 100) : 0;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: moment.bg, transition: 'background 1.2s ease' }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: moment.accent,
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animation: `float ${3 + (i % 4)}s ease-in-out infinite alternate`,
              animationDelay: `${(i * 0.3) % 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gold shimmer top line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-60" />

      {/* Hexagon pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cg fill='%23FFD700'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Logo / Title */}
        <div className="text-center mb-10">
          <div
            className="font-bebas tracking-widest leading-none mb-1"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', color: '#FFD700', textShadow: '0 0 40px rgba(255,215,0,0.4), 0 2px 4px rgba(0,0,0,0.8)' }}
          >
            FIFA WORLD CUP
          </div>
          <div
            className="font-bebas tracking-[0.4em] leading-none"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
          >
            2026
          </div>
          <div className="w-32 h-0.5 mx-auto mt-3 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
          <div className="font-barlow text-white/50 tracking-[0.3em] text-sm mt-2 uppercase">
            Álbum Panini · Versión Argentina
          </div>
        </div>

        {/* Moment card */}
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden mb-10 shadow-2xl"
          style={{
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.6s ease',
            border: `1px solid ${moment.accent}33`,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Moment header */}
          <div
            className="px-6 pt-5 pb-2 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${moment.accent}22` }}
          >
            <div>
              <div className="font-barlow text-xs tracking-widest uppercase" style={{ color: moment.accent, opacity: 0.8 }}>
                {moment.country} · {moment.location}
              </div>
              <div
                className="font-bebas text-3xl tracking-wide mt-0.5"
                style={{ color: moment.accent, textShadow: `0 0 20px ${moment.accent}66` }}
              >
                {moment.year} — {moment.title}
              </div>
            </div>
            <div className="text-4xl select-none">{moment.symbol}</div>
          </div>

          <div className="px-6 py-4">
            <p className="font-barlow text-white/80 text-base leading-relaxed italic">
              "{moment.subtitle}"
            </p>
          </div>

          {/* Dots indicator */}
          <div className="px-6 pb-4 flex gap-1.5">
            {MOMENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 300); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  background: i === current ? moment.accent : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress (if album started) */}
        {collectedCount > 0 && (
          <div className="w-full max-w-lg mb-6 px-2">
            <div className="flex justify-between text-xs font-barlow text-white/50 mb-1">
              <span>Progreso del álbum</span>
              <span style={{ color: moment.accent }}>{collectedCount}/{totalStickers} · {progress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${moment.accent}88, ${moment.accent})` }}
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button
            onClick={() => onEnter('album')}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bebas text-xl tracking-widest transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${moment.accent}, ${moment.accent}bb)`,
              color: '#001440',
              boxShadow: `0 8px 32px ${moment.accent}44`,
            }}
          >
            <BookOpen size={22} />
            ÁLBUM
          </button>
          <button
            onClick={() => onEnter('fixture')}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bebas text-xl tracking-widest transition-all duration-200 hover:scale-105 active:scale-95 border shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.07)',
              borderColor: `${moment.accent}44`,
              color: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Calendar size={22} />
            FIXTURE
          </button>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="relative text-center pb-6 text-white/20 font-barlow text-xs tracking-widest">
        CANADA · MEXICO · USA 2026
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-12px) scale(1.3); }
        }
      `}</style>
    </div>
  );
}
