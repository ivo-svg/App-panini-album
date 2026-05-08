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
    subtitle: 'Maradona pica el balón con la mano ante Shilton — "un poco con la cabeza y otro con la mano de Dios"',
    location: 'Ciudad de México',
    accent: '#74ACDF',
    symbol: '🙌',
    country: 'ARG vs ENG',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Maradona_shilton_mano_dios.jpg/500px-Maradona_shilton_mano_dios.jpg',
  },
  {
    year: '1986',
    title: 'El Gol del Siglo',
    subtitle: 'Maradona gambetea a media Inglaterra y marca el gol más grande de la historia del fútbol',
    location: 'Ciudad de México',
    accent: '#74ACDF',
    symbol: '⚡',
    country: 'ARG vs ENG',
    image: 'https://i0.wp.com/elgeneracionalpost.com/wp-content/uploads/2020/12/1-maradona-mundial.jpg?resize=696%2C392&ssl=1',
  },
  {
    year: '2022',
    title: 'La Copa es Nuestra',
    subtitle: 'Messi y Argentina: el sueño cumplido después de 36 años de espera. "Ya no puedo pedir nada más"',
    location: 'Lusail, Qatar',
    accent: '#FFD700',
    symbol: '🏆',
    country: 'ARG vs FRA',
    image: 'https://elciudadano.com.ar/download/multimedia.normal.9cd63e17486255b4.466b5355567a42586f41454e5533625f6e6f726d616c2e77656270.webp',
  },
  {
    year: '2022',
    title: 'Argentina Campeón',
    subtitle: 'Los jugadores argentinos celebran en el vestuario de Lusail tras consagrarse campeones del mundo',
    location: 'Lusail, Qatar',
    accent: '#74ACDF',
    symbol: '🇦🇷',
    country: 'Argentina Campeón',
    image: 'https://img.asmedia.epimg.net/resizer/v2/TV4TXYYSZZDE3FIFEV6QO3IBIA.JPG?auth=504ef7e08109f6981fdb308168a627ef9d6b0709dfc6e2c44528b6a2d52bfed8&width=1200&height=1200&focal=1144%2C16',
  },
  {
    year: '2010',
    title: 'El Golazo de Tshabalala',
    subtitle: 'África festeja su primer Mundial — el golazo de Tshabalala hizo vibrar a todo un continente',
    location: 'Johannesburgo, Sudáfrica',
    accent: '#FFB612',
    symbol: '🌍',
    country: 'RSA vs MEX',
    image: 'https://tecolotito.elsiglodetorreon.com.mx/i/2022/09/1601365.jpeg',
  },
  {
    year: '2006',
    title: 'El Cabezazo de Zidane',
    subtitle: 'Zidane expulsado en la final por cabezazo a Materazzi — su último partido como profesional',
    location: 'Berlín, Alemania',
    accent: '#ED2939',
    symbol: '😤',
    country: 'FRA vs ITA',
    image: 'https://a.espncdn.com/photo/2018/0526/r375761_1296x729_16-9.jpg',
  },
  {
    year: '2002',
    title: 'R9 El Fenómeno',
    subtitle: 'Ronaldo Nazario corona su carrera con el título mundial — el Fenómeno consagrado en Japón-Corea',
    location: 'Yokohama, Japón',
    accent: '#009B3A',
    symbol: '⚽',
    country: 'Brasil 2002',
    image: 'https://cdn.conmebol.com/wp-content/uploads/2016/09/r9.jpg',
  },
  {
    year: '1994',
    title: 'El Silencio de Baggio',
    subtitle: 'Roberto Baggio con la cabeza gacha después de errar el penal que le entregó el Mundial a Brasil',
    location: 'Pasadena, EE.UU.',
    accent: '#4a90d9',
    symbol: '💔',
    country: 'ITA vs BRA',
    image: 'https://pbs.twimg.com/media/FvI4pgjWAAoyAri.jpg',
  },
  {
    year: 'Historia',
    title: '40 Momentos Eternos',
    subtitle: 'De Pelé a Messi — el Mundial es el escenario donde el fútbol escribe sus páginas más gloriosas',
    location: 'Todo el mundo',
    accent: '#FFD700',
    symbol: '🌟',
    country: 'FIFA World Cup',
    image: 'https://www.infobae.com/resizer/v2/H2N7AUDUTRC3NFDWBUUN5CE2D4.jpg?auth=109887f438b5ade17075c2c6aeb4ef34dc060c9dbc8ecb88c1db04c8e6a32ea6&smart=true&width=992&height=557&quality=85',
  },
  {
    year: 'CONMEBOL',
    title: 'Latinoamérica en el Mundial',
    subtitle: 'Argentina, Brasil, Uruguay, Colombia — el continente que más Mundiales ganó sigue escribiendo historia',
    location: 'América del Sur',
    accent: '#FEDF00',
    symbol: '🌎',
    country: 'CONMEBOL',
    image: 'https://panamericanworld.com/wp-content/uploads/2018/08/tim.php_.jpeg',
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
