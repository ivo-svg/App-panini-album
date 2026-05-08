import { useState, useEffect } from 'react';
import { BookOpen, Calendar } from 'lucide-react';

interface Props {
  onEnter: (section: 'album' | 'fixture') => void;
  collectedCount: number;
  totalStickers: number;
}

const MOMENTS = [
  {
    year: '1986',
    title: 'La Mano de Dios',
    subtitle: 'Maradona marca con la mano y luego hace "el gol del siglo" en Azteca — 5 jugadores gambeteados',
    location: 'Ciudad de México',
    accent: '#74ACDF',
    symbol: '🙌',
    country: 'ARG vs ENG',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Maradona_scoring_england_1986.jpg',
  },
  {
    year: '2022',
    title: 'La Copa es Nuestra',
    subtitle: 'Messi levanta la Copa del Mundo en Lusail, poniendo fin a 36 años de espera de Argentina',
    location: 'Lusail, Qatar',
    accent: '#FFD700',
    symbol: '🏆',
    country: 'ARG vs FRA',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/221218184732-messi-wc-trophy.jpg',
  },
  {
    year: '2022',
    title: 'Qatar 2022',
    subtitle: 'Paredes y el equipo argentino celebran en Qatar, el Mundial que volvió a poner a la Argentina en lo más alto',
    location: 'Qatar',
    accent: '#74ACDF',
    symbol: '🇦🇷',
    country: 'Argentina Campeón',
    image: 'https://img.asmedia.epimg.net/resizer/v2/TV4TXYYSZZDE3FIFEV6QO3IBIA.JPG',
  },
  {
    year: '1994',
    title: 'El Silencio de Baggio',
    subtitle: 'Roberto Baggio con la cabeza gacha después de errar el penal que le entregó el Mundial a Brasil',
    location: 'Pasadena, EE.UU.',
    accent: '#4a90d9',
    symbol: '⚽',
    country: 'ITA vs BRA',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Roberto_Baggio_cropped.jpg',
  },
  {
    year: '2010',
    title: 'Ke Nako — Es el Momento',
    subtitle: 'Sudáfrica inaugura el primer Mundial africano — Tshabalala anotó el primer gol ante México',
    location: 'Johannesburgo, Sudáfrica',
    accent: '#FFB612',
    symbol: '🌍',
    country: 'RSA vs MEX',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/First_game_of_the_2010_FIFA_World_Cup%2C_South_Africa_vs_Mexico.jpg',
  },
  {
    year: '2006',
    title: 'El Cabezazo de Zidane',
    subtitle: 'Zidane expulsado en la final por cabezazo a Materazzi — su último partido como profesional',
    location: 'Berlín, Alemania',
    accent: '#ED2939',
    symbol: '😤',
    country: 'FRA vs ITA',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Italy_vs_France_-_FIFA_World_Cup_2006_final_-_Lilian_Thuram_and_Zinedine_Zidane.jpg',
  },
  {
    year: '2014',
    title: 'El Mineirazo',
    subtitle: 'Alemania goleó 7-1 a Brasil en su propia casa — la noche que paralizó a un país entero',
    location: 'Belo Horizonte, Brasil',
    accent: '#FFFFFF',
    symbol: '7️⃣',
    country: 'BRA 1-7 GER',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Alemanha7x1brasil.jpg',
  },
  {
    year: '1970',
    title: 'Brasil Eterno',
    subtitle: 'Pelé, Jairzinho, Tostão, Rivelino — el equipo más bello de la historia gana su tercer Mundial',
    location: 'Ciudad de México',
    accent: '#FEDF00',
    symbol: '👑',
    country: 'Brasil 1970',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Pele_celebrating_1970.jpg',
  },
  {
    year: '2018',
    title: 'El Hat-Trick de Ronaldo',
    subtitle: 'Cristiano Ronaldo anota tres goles ante España, el último de tiro libre en el último minuto',
    location: 'Sochi, Rusia',
    accent: '#FF0000',
    symbol: '✨',
    country: 'POR vs ESP',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Portugal_Spain_2018-06-15.jpg',
  },
];

export default function LandingPage({ onEnter, collectedCount, totalStickers }: Props) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [imgError, setImgError] = useState<Set<number>>(new Set());

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
  const hasImage = !imgError.has(current);

  const goTo = (i: number) => {
    setFading(true);
    setTimeout(() => { setCurrent(i); setFading(false); }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#000d2e' }}>

      {/* Background photo */}
      {hasImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${moment.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}
        >
          {/* Hidden img to detect load errors */}
          <img
            src={moment.image}
            alt=""
            className="hidden"
            onError={() => setImgError(prev => new Set(prev).add(current))}
          />
        </div>
      )}

      {/* Dark overlay — stronger when no image, lighter with image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: hasImage
            ? 'linear-gradient(to bottom, rgba(0,5,20,0.62) 0%, rgba(0,10,35,0.52) 40%, rgba(0,5,20,0.72) 100%)'
            : 'linear-gradient(135deg, #0a1628 0%, #001a4d 45%, #0a1628 100%)',
        }}
      />

      {/* Gold shimmer top line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-60" />

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="font-bebas tracking-widest leading-none mb-1"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', color: '#FFD700', textShadow: '0 0 40px rgba(255,215,0,0.4), 0 2px 8px rgba(0,0,0,0.9)' }}
          >
            FIFA WORLD CUP
          </div>
          <div
            className="font-bebas tracking-[0.4em] leading-none"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
          >
            2026
          </div>
          <div className="w-32 h-0.5 mx-auto mt-3 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
          <div className="font-barlow text-white/60 tracking-[0.3em] text-sm mt-2 uppercase" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            Álbum Panini · Versión Argentina
          </div>
        </div>

        {/* Moment card */}
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden mb-10 shadow-2xl"
          style={{
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.6s ease',
            border: `1px solid ${moment.accent}44`,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="px-6 pt-5 pb-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${moment.accent}22` }}>
            <div>
              <div className="font-barlow text-xs tracking-widest uppercase" style={{ color: moment.accent, opacity: 0.9, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                {moment.country} · {moment.location}
              </div>
              <div className="font-bebas text-3xl tracking-wide mt-0.5" style={{ color: moment.accent, textShadow: `0 0 20px ${moment.accent}88, 0 2px 4px rgba(0,0,0,0.8)` }}>
                {moment.year} — {moment.title}
              </div>
            </div>
            <div className="text-4xl select-none">{moment.symbol}</div>
          </div>

          <div className="px-6 py-4">
            <p className="font-barlow text-white/90 text-base leading-relaxed italic" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              "{moment.subtitle}"
            </p>
          </div>

          {/* Dots */}
          <div className="px-6 pb-4 flex gap-1.5 flex-wrap">
            {MOMENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  background: i === current ? moment.accent : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress */}
        {collectedCount > 0 && (
          <div className="w-full max-w-lg mb-6 px-2">
            <div className="flex justify-between text-xs font-barlow mb-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              <span className="text-white/60">Progreso del álbum</span>
              <span style={{ color: moment.accent }}>{collectedCount}/{totalStickers} · {progress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${moment.accent}88, ${moment.accent})` }} />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button
            onClick={() => onEnter('album')}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bebas text-xl tracking-widest transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
            style={{ background: `linear-gradient(135deg, ${moment.accent}, ${moment.accent}bb)`, color: '#001440', boxShadow: `0 8px 32px ${moment.accent}44` }}
          >
            <BookOpen size={22} />
            ÁLBUM
          </button>
          <button
            onClick={() => onEnter('fixture')}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bebas text-xl tracking-widest transition-all duration-200 hover:scale-105 active:scale-95 border shadow-xl"
            style={{ background: 'rgba(0,0,0,0.4)', borderColor: `${moment.accent}55`, color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
          >
            <Calendar size={22} />
            FIXTURE
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative text-center pb-6 text-white/30 font-barlow text-xs tracking-widest" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
        CANADA · MEXICO · USA 2026
      </div>
    </div>
  );
}
