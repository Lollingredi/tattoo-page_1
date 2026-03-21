import React, { useState, useEffect, useCallback } from 'react';
import { Instagram, MapPin, Calendar, ArrowRight, Menu, X, ChevronLeft, ChevronRight, ZoomIn, Quote, Star, ChevronDown, Phone, Mail, Clock, MessageCircle, Scissors, Palette, Sparkles, RefreshCw, Heart, HelpCircle, Filter, Sun, Moon, Newspaper, CalendarDays, Zap, User, Image as ImageIcon } from 'lucide-react';
import CalendarPage from './CalendarPage';
import ArtistsPage from './ArtistsPage';

type PageType = 'home' | 'calendar' | 'artists';

// Importazione Immagini
import studioImg1 from './elements/studio1.webp';
import studioImg2 from './elements/studio2.webp';
import studioImg3 from './elements/studio3.webp';
import tat1 from './elements/tat1.PNG';
import tat2 from './elements/tat2.PNG';
import tat3 from './elements/tat3.PNG';

// --- Types & Interfaces ---

interface ColorPalette {
  sage: string;
  sand: string;
  charcoal: string;
  crimson: string;
  leather: string;
}

interface PortfolioItem {
  id: number;
  alt: string;
  src: string;
  artist: string;
  style: string;
  bodyPart: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: 'news' | 'flash' | 'event';
  image?: string;
}

// --- Data & Config ---

const COLORS: ColorPalette = {
  sage: '#FDFBF7',      // MODIFICATO: Bianco Panna (Cream/Off-White)
  sand: '#D5CAC0',      // Sabbia/Grigio (Sfondo Pagina)
  leather: '#BBA18B',   // Marrone (Dettagli)
  charcoal: '#1F1C18',  // Nero caldo (Testi)
  crimson: '#8A1C1C',   // Rosso scuro (Accenti)
};

// Dark mode colors
const DARK_COLORS = {
  sage: '#1F1C18',
  sand: '#2A2520',
  leather: '#3D352D',
  charcoal: '#FDFBF7',
  crimson: '#B82828',
};

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: 1, alt: 'Drago Giapponese', src: tat1, artist: 'Leo', style: 'traditional', bodyPart: 'braccio' },
  { id: 2, alt: 'Mandala Geometrico', src: tat2, artist: 'Elena', style: 'geometric', bodyPart: 'schiena' },
  { id: 3, alt: 'Ritratto Realistico', src: tat3, artist: 'Matteo', style: 'realistico', bodyPart: 'gamba' },
];

const GALLERY_FILTERS = {
  artists: ['Tutti', 'Leo', 'Elena', 'Matteo'],
  styles: ['Tutti', 'traditional', 'geometric', 'realistico', 'blackwork', 'watercolor'],
  bodyParts: ['Tutti', 'braccio', 'gamba', 'schiena', 'petto', 'mano'],
};

const BLOG_POSTS: BlogPost[] = [
  { id: 1, title: 'Flash Day Primavera 2026', excerpt: 'Sabato 28 Marzo: tatuaggi esclusivi a prezzo speciale! Scopri i design disponibili e prenota il tuo slot.', date: '2026-03-15', category: 'flash' },
  { id: 2, title: 'Nuovo Artista: Benvenuta Sofia!', excerpt: 'Siamo felici di annunciare che Sofia, specializzata in fine line e botanico, si unisce al nostro team.', date: '2026-03-10', category: 'news' },
  { id: 3, title: 'Partecipazione Milano Tattoo Convention', excerpt: 'Saremo presenti alla convention dal 5 al 7 Aprile. Vieni a trovarci allo stand B12!', date: '2026-03-05', category: 'event' },
];

const STUDIO_IMAGES = [studioImg1, studioImg2, studioImg3];

// --- Services Data ---
interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
}

const SERVICES: Service[] = [
  { icon: <MessageCircle size={24} />, title: 'Consultazione', description: 'Incontro gratuito per discutere il tuo progetto e ricevere un preventivo personalizzato.', price: 'Gratuita' },
  { icon: <Sparkles size={24} />, title: 'Tattoo Small', description: 'Tatuaggi fino a 5cm. Perfetti per simboli, scritte e piccoli disegni.', price: 'Da €80' },
  { icon: <Palette size={24} />, title: 'Tattoo Medium', description: 'Tatuaggi da 5 a 15cm. Ideali per disegni dettagliati e composizioni.', price: 'Da €150' },
  { icon: <Heart size={24} />, title: 'Tattoo Large', description: 'Oltre 15cm, maniche, schiene. Progetti complessi e di grande impatto.', price: 'Su preventivo' },
  { icon: <Scissors size={24} />, title: 'Cover-up', description: 'Copertura di tatuaggi esistenti con un nuovo design personalizzato.', price: 'Su preventivo' },
  { icon: <RefreshCw size={24} />, title: 'Ritocco', description: 'Ritocco gratuito entro 3 mesi dalla realizzazione del tatuaggio.', price: 'Gratuito' },
];

// --- Testimonials Data ---
interface Testimonial {
  quote: string;
  author: string;
  rating: number;
  artist: string;
}

const TESTIMONIALS: Testimonial[] = [
  { quote: "Esperienza fantastica! Leo ha trasformato la mia idea in un capolavoro. Professionalità e attenzione ai dettagli incredibili.", author: "Marco R.", rating: 5, artist: "Leo" },
  { quote: "Elena è incredibilmente precisa. Il mio mandala è perfetto, esattamente come lo immaginavo. Studio accogliente e pulitissimo.", author: "Sara L.", rating: 5, artist: "Elena" },
  { quote: "Matteo ha una creatività unica. I colori del mio tatuaggio sono vibranti e il design è originale. Tornerò sicuramente!", author: "Giulia B.", rating: 5, artist: "Matteo" },
];

// --- FAQ Data ---
interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  { question: "Come mi preparo al tatuaggio?", answer: "Riposa bene la notte prima, mangia un pasto leggero, evita alcol e aspirina nelle 24 ore precedenti. Indossa abiti comodi che permettano l'accesso alla zona da tatuare. Idrata bene la pelle nei giorni precedenti." },
  { question: "Quanto dura una sessione?", answer: "Dipende dalla dimensione e complessità del tatuaggio. Un piccolo tattoo può richiedere 30-60 minuti, mentre progetti più grandi possono necessitare sessioni di 3-4 ore o appuntamenti multipli." },
  { question: "È doloroso?", answer: "La sensazione varia da persona a persona e dalla zona del corpo. Generalmente è un fastidio sopportabile, simile a un graffio prolungato. Zone con più ossa o nervi sono più sensibili." },
  { question: "Come curo il tatuaggio dopo?", answer: "Ti forniremo istruzioni dettagliate. In generale: tieni la zona pulita, applica la crema consigliata, evita sole diretto, piscine e saune per 2-3 settimane. Non grattare le crosticine!" },
  { question: "Posso modificare o cancellare l'appuntamento?", answer: "Sì, ti chiediamo di avvisarci almeno 48 ore prima. Per modifiche last-minute contattaci telefonicamente. Cancellazioni ripetute senza preavviso potrebbero richiedere un deposito per prenotazioni future." },
  { question: "Qual è l'età minima?", answer: "Devi avere almeno 18 anni con documento d'identità valido. Per i minorenni (16-17 anni) è necessaria la presenza e firma di un genitore/tutore con documento." },
];

// --- Contact Info ---
const CONTACT_INFO = {
  phone: '+39 333 1234567',
  email: 'info@tomoetattoo.it',
  whatsapp: '393331234567',
  address: 'Piazza della Libertà 5/A',
  city: 'Castelfranco Emilia (MO)',
  hours: { weekdays: 'Mar - Sab: 10:00 - 13:00 / 14:00 - 19:00', closed: 'Dom - Lun: Chiuso' },
  social: { instagram: 'tomoe_tattoo', facebook: 'tomoetattoo', tiktok: '@tomoe_tattoo' },
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2838.5!2d11.05!3d44.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDM2JzAwLjAiTiAxMcKwMDMnMDAuMCJF!5e0!3m2!1sit!2sit!4v1234567890',
};

const TattooStudio: React.FC = () => {
  // Initialize currentPage based on current URL
  const getPageFromPath = (pathname: string): PageType => {
    if (pathname === '/prenota') return 'calendar';
    if (pathname === '/artisti') return 'artists';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    return getPageFromPath(window.location.pathname);
  });
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Navigate to calendar page with URL update
  const navigateToCalendar = useCallback(() => {
    window.history.pushState({}, '', '/prenota');
    setCurrentPage('calendar');
  }, []);

  // Navigate to artists page with URL update
  const navigateToArtists = useCallback(() => {
    window.history.pushState({}, '', '/artisti');
    setCurrentPage('artists');
  }, []);

  // Navigate to home page with URL update
  const navigateToHome = useCallback(() => {
    window.history.pushState({}, '', '/');
    setCurrentPage('home');
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [currentStudioImage, setCurrentStudioImage] = useState<number>(0);
  const [hoverOffset, setHoverOffset] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Lightbox states
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Touch/Swipe states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Galleria mobile index
  const [mobileGalleryIndex, setMobileGalleryIndex] = useState<number>(0);

  // Mobile tap-to-zoom state
  const [mobileGalleryTapped, setMobileGalleryTapped] = useState<boolean>(false);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Gallery filter states
  const [galleryArtistFilter, setGalleryArtistFilter] = useState<string>('Tutti');
  const [galleryStyleFilter, setGalleryStyleFilter] = useState<string>('Tutti');
  const [galleryBodyFilter, setGalleryBodyFilter] = useState<string>('Tutti');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Theme colors based on mode
  const theme = isDarkMode ? DARK_COLORS : COLORS;

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Filtered portfolio items
  const filteredPortfolio = PORTFOLIO_ITEMS.filter(item => {
    const artistMatch = galleryArtistFilter === 'Tutti' || item.artist === galleryArtistFilter;
    const styleMatch = galleryStyleFilter === 'Tutti' || item.style === galleryStyleFilter;
    const bodyMatch = galleryBodyFilter === 'Tutti' || item.bodyPart === galleryBodyFilter;
    return artistMatch && styleMatch && bodyMatch;
  });

  // Refs for scroll snap
  const studioScrollRef = React.useRef<HTMLDivElement>(null);
  const galleryScrollRef = React.useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Scroll snap handlers
  const handleStudioScroll = () => {
    if (studioScrollRef.current) {
      const scrollLeft = studioScrollRef.current.scrollLeft;
      const width = studioScrollRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== currentStudioImage && newIndex >= 0 && newIndex < STUDIO_IMAGES.length) {
        setCurrentStudioImage(newIndex);
      }
    }
  };

  const handleGalleryScroll = () => {
    if (galleryScrollRef.current) {
      const scrollLeft = galleryScrollRef.current.scrollLeft;
      const width = galleryScrollRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== mobileGalleryIndex && newIndex >= 0 && newIndex < PORTFOLIO_ITEMS.length) {
        setMobileGalleryIndex(newIndex);
      }
    }
  };

  // Handle mobile gallery tap
  const handleMobileGalleryTap = () => {
    if (mobileGalleryTapped) {
      // Second tap - open lightbox
      openLightbox(mobileGalleryIndex);
      setMobileGalleryTapped(false);
    } else {
      // First tap - show overlay
      setMobileGalleryTapped(true);
    }
  };

  // Swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndLightbox = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextLightboxImage();
    } else if (isRightSwipe) {
      prevLightboxImage();
    }
  };

  // Lightbox functions
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? PORTFOLIO_ITEMS.length - 1 : prev - 1));
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev === PORTFOLIO_ITEMS.length - 1 ? 0 : prev + 1));
  };

  const getLightboxPrevIndex = () => (lightboxIndex === 0 ? PORTFOLIO_ITEMS.length - 1 : lightboxIndex - 1);
  const getLightboxNextIndex = () => (lightboxIndex === PORTFOLIO_ITEMS.length - 1 ? 0 : lightboxIndex + 1);

  const prevStudioImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const targetIndex = currentStudioImage === 0 ? STUDIO_IMAGES.length - 1 : currentStudioImage - 1;
    setCurrentStudioImage(targetIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextStudioImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const targetIndex = currentStudioImage === STUDIO_IMAGES.length - 1 ? 0 : currentStudioImage + 1;
    setCurrentStudioImage(targetIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  };


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTransitioning) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const normalizedX = (x / width - 0.5) * 2; // da -1 (sinistra) a 1 (destra)
    setHoverOffset(normalizedX);
  };

  const handleMouseEnter = () => {
    if (!isTransitioning) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTransitioning) {
      setIsHovering(false);
      setHoverOffset(0);
    }
  };

  return (
    <div
      style={{ backgroundColor: COLORS.sand, color: COLORS.charcoal }}
      className="min-h-screen font-sans selection:bg-red-200"
    >

      {/* --- NAVIGATION (Global) --- */}
      <nav
        className="fixed w-full z-50 backdrop-blur-md border-b transition-colors duration-300"
        style={{
          backgroundColor: isDarkMode ? 'rgba(31, 28, 24, 0.9)' : 'rgba(253, 251, 247, 0.9)',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-bold tracking-tighter uppercase cursor-pointer transition-colors"
            onClick={() => navigateToHome()}
            style={{ color: theme.charcoal }}
          >
            Studio<span style={{ color: theme.crimson }}>.</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center font-medium text-sm tracking-wide" style={{ color: theme.charcoal }}>
            <a href="#studio" onClick={() => navigateToHome()} className="hover:opacity-70 transition-opacity">Studio</a>
            <a href="#works" onClick={() => navigateToHome()} className="hover:opacity-70 transition-opacity">Opere</a>
            <a href="#services" onClick={() => navigateToHome()} className="hover:opacity-70 transition-opacity">Servizi</a>
            <a href="#blog" onClick={() => navigateToHome()} className="hover:opacity-70 transition-opacity">News</a>
            <button onClick={() => navigateToArtists()} className="hover:opacity-70 transition-opacity">Artisti</button>
            <a href="#faq" onClick={() => navigateToHome()} className="hover:opacity-70 transition-opacity">FAQ</a>
            <a href="#contact" onClick={() => navigateToHome()} className="hover:opacity-70 transition-opacity">Contatti</a>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full transition-all hover:scale-110"
              style={{ backgroundColor: isDarkMode ? '#3D352D' : '#E8E0D8' }}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => navigateToCalendar()}
              className="px-5 py-2 text-white rounded-full transition-transform hover:scale-105 shadow-md"
              style={{ backgroundColor: theme.crimson }}
            >
              Prenota Ora
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-md transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={{ color: theme.charcoal }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Slide down animation */}
        <div
          className={`md:hidden absolute w-full flex flex-col gap-4 shadow-xl overflow-hidden transition-all duration-300 ease-out ${isMenuOpen ? 'max-h-[500px] py-6 px-6 opacity-100' : 'max-h-0 py-0 px-6 opacity-0'}`}
          style={{
            backgroundColor: isDarkMode ? '#1F1C18' : theme.sage,
            color: theme.charcoal,
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
          }}
        >
          <a href="#studio" onClick={() => { toggleMenu(); navigateToHome(); }} className="text-lg font-medium">Studio</a>
          <a href="#works" onClick={() => { toggleMenu(); navigateToHome(); }} className="text-lg font-medium">Opere</a>
          <a href="#services" onClick={() => { toggleMenu(); navigateToHome(); }} className="text-lg font-medium">Servizi</a>
          <a href="#blog" onClick={() => { toggleMenu(); navigateToHome(); }} className="text-lg font-medium">News</a>
          <button onClick={() => { toggleMenu(); navigateToArtists(); }} className="text-lg font-medium text-left">Artisti</button>
          <a href="#faq" onClick={() => { toggleMenu(); navigateToHome(); }} className="text-lg font-medium">FAQ</a>
          <a href="#contact" onClick={() => { toggleMenu(); navigateToHome(); }} className="text-lg font-medium">Contatti</a>
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-stone-200">
            <span className="text-sm opacity-70">Tema {isDarkMode ? 'Scuro' : 'Chiaro'}</span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full transition-all"
              style={{ backgroundColor: isDarkMode ? '#3D352D' : '#E8E0D8' }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <button
            onClick={() => { toggleMenu(); navigateToCalendar(); }}
            className="w-full py-3 text-white rounded-lg font-bold mt-2"
            style={{ backgroundColor: theme.crimson }}
          >
            Prenota Ora
          </button>
        </div>
      </nav>

      {/* --- CONTENT --- */}
      {currentPage === 'calendar' ? (
        <CalendarPage />
      ) : currentPage === 'artists' ? (
        <ArtistsPage />
      ) : (
        <>
      {/* --- HERO SECTION --- */}
      <header id="studio" className="pt-32 pb-20 px-6 md:pt-48 md:pb-32 relative overflow-hidden">
        {/* Decorative Background (Ora Bianco Panna) */}
        <div 
          className="absolute top-0 right-0 w-2/3 h-full -z-10 opacity-60 blur-3xl rounded-bl-full pointer-events-none"
          style={{ backgroundColor: COLORS.sage }}
        />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm font-bold tracking-widest uppercase opacity-60 text-stone-600">
              Città, Regione
            </p>
            <h1 className="text-5xl md:text-7xl font-light leading-tight text-stone-900">
              Arte su pelle, <br />
              <span className="font-bold italic">anima zen.</span>
            </h1>
            <p className="text-lg text-stone-700 max-w-md leading-relaxed">
              Uno spazio dove il tatuaggio tradizionale incontra la calma moderna.
              Linee pulite, ambiente rilassato, inchiostro indelebile.
            </p>

            {/* Stats row - Desktop */}
            <div className="hidden md:flex gap-8 pt-2">
              <div>
                <p className="text-2xl font-bold" style={{ color: COLORS.crimson }}>3</p>
                <p className="text-sm text-stone-500 mt-0.5">Artisti resident</p>
              </div>
              <div className="w-px bg-stone-300" />
              <div>
                <p className="text-2xl font-bold" style={{ color: COLORS.crimson }}>25+</p>
                <p className="text-sm text-stone-500 mt-0.5">Anni di esperienza</p>
              </div>
              <div className="w-px bg-stone-300" />
              <div>
                <p className="text-2xl font-bold" style={{ color: COLORS.crimson }}>Mar–Sab</p>
                <p className="text-sm text-stone-500 mt-0.5">Apertura</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigateToCalendar()}
                className="px-8 py-4 text-white rounded-lg font-semibold flex items-center gap-2 transition-all hover:gap-4 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: COLORS.crimson }}
              >
                Prenota una consultazione <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigateToArtists()}
                className="px-8 py-4 rounded-lg font-semibold border-2 transition-all hover:bg-stone-100"
                style={{ borderColor: COLORS.charcoal, color: COLORS.charcoal }}
              >
                Scopri gli Artisti
              </button>
            </div>
          </div>
          
          {/* Image Area - Studio Slider */}
          <div
            className="relative group hidden md:block"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Contenitore immagini con crossfade */}
            <div
              className="aspect-4/5 bg-stone-200 rounded-2xl overflow-hidden shadow-2xl relative"
              style={{
                transform: `translateX(${-hoverOffset * 15}px) scale(${isHovering && !isTransitioning ? 1.02 : 1})`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              {/* Tutte le immagini sovrapposte con crossfade */}
              {STUDIO_IMAGES.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Studio Interior ${index + 1}`}
                  className="absolute inset-0 object-cover w-full h-full"
                  style={{
                    opacity: index === currentStudioImage ? 0.9 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    zIndex: index === currentStudioImage ? 1 : 0,
                  }}
                />
              ))}
              <div className="absolute inset-0 bg-black/10 pointer-events-none transition-colors duration-500 group-hover:bg-black/5 z-10"></div>

              {/* Frecce di navigazione - solo desktop */}
              <button
                onClick={prevStudioImage}
                className="flex absolute left-0 top-1/2 -translate-y-1/2 w-12 h-24 items-center justify-center bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-full group-hover:translate-x-0 rounded-r-lg z-20"
                aria-label="Immagine precedente"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextStudioImage}
                className="flex absolute right-0 top-1/2 -translate-y-1/2 w-12 h-24 items-center justify-center bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-full group-hover:translate-x-0 rounded-l-lg z-20"
                aria-label="Immagine successiva"
              >
                <ChevronRight size={32} />
              </button>

              {/* Indicatori */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {STUDIO_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStudioImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStudioImage
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Vai all'immagine ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Image Area - Mobile (con scroll snap) */}
          <div className="relative md:hidden">
            <div
              ref={studioScrollRef}
              onScroll={handleStudioScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-2xl shadow-2xl"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {STUDIO_IMAGES.map((img, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full aspect-4/5 snap-center"
                >
                  <div className="relative w-full h-full bg-stone-200">
                    <img
                      src={img}
                      alt={`Studio Interior ${index + 1}`}
                      className="object-cover w-full h-full opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicatori mobile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {STUDIO_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentStudioImage(index);
                    studioScrollRef.current?.scrollTo({ left: index * (studioScrollRef.current?.clientWidth || 0), behavior: 'smooth' });
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStudioImage
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Vai all'immagine ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

          {/* --- GALLERY SECTION (Le nostre opere) --- */}
          <section
            id="works"
            className="py-24 px-6"
            style={{ backgroundColor: isDarkMode ? '#1A1714' : '#FFFDF9' }}
          >
            <div
              className="max-w-6xl mx-auto p-8 md:p-12 rounded-3xl shadow-lg"
              style={{ backgroundColor: isDarkMode ? '#2A2520' : '#E8E0D8', color: theme.charcoal }}
            >
              {/* Header con filtri */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Le nostre opere</h2>
                  <div className="h-1 w-24" style={{ backgroundColor: theme.crimson }}></div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showFilters ? 'text-white' : ''}`}
                    style={{ backgroundColor: showFilters ? theme.crimson : (isDarkMode ? '#3D352D' : '#D5CAC0') }}
                  >
                    <Filter size={18} /> Filtri
                  </button>
                  <a href="#" className="hidden md:flex items-center gap-2 font-medium hover:opacity-70 transition-opacity">
                    Instagram <Instagram size={18} />
                  </a>
                </div>
              </div>

              {/* Pannello Filtri */}
              <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-48 mb-8' : 'max-h-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl" style={{ backgroundColor: isDarkMode ? '#1F1C18' : '#FDFBF7' }}>
                  {/* Filtro Artista */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <User size={14} /> Artista
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GALLERY_FILTERS.artists.map(artist => (
                        <button
                          key={artist}
                          onClick={() => setGalleryArtistFilter(artist)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${galleryArtistFilter === artist ? 'text-white' : ''}`}
                          style={{ backgroundColor: galleryArtistFilter === artist ? theme.crimson : (isDarkMode ? '#3D352D' : '#E8E0D8') }}
                        >
                          {artist}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Filtro Stile */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Palette size={14} /> Stile
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GALLERY_FILTERS.styles.map(style => (
                        <button
                          key={style}
                          onClick={() => setGalleryStyleFilter(style)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${galleryStyleFilter === style ? 'text-white' : ''}`}
                          style={{ backgroundColor: galleryStyleFilter === style ? theme.crimson : (isDarkMode ? '#3D352D' : '#E8E0D8') }}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Filtro Zona */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <ImageIcon size={14} /> Zona Corpo
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GALLERY_FILTERS.bodyParts.map(part => (
                        <button
                          key={part}
                          onClick={() => setGalleryBodyFilter(part)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${galleryBodyFilter === part ? 'text-white' : ''}`}
                          style={{ backgroundColor: galleryBodyFilter === part ? theme.crimson : (isDarkMode ? '#3D352D' : '#E8E0D8') }}
                        >
                          {part}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Risultati filtri */}
              {(galleryArtistFilter !== 'Tutti' || galleryStyleFilter !== 'Tutti' || galleryBodyFilter !== 'Tutti') && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm opacity-70">
                    {filteredPortfolio.length} {filteredPortfolio.length === 1 ? 'risultato' : 'risultati'}
                  </p>
                  <button
                    onClick={() => { setGalleryArtistFilter('Tutti'); setGalleryStyleFilter('Tutti'); setGalleryBodyFilter('Tutti'); }}
                    className="text-sm font-medium hover:underline"
                    style={{ color: theme.crimson }}
                  >
                    Resetta filtri
                  </button>
                </div>
              )}

              {/* Galleria Desktop */}
              <div className="hidden md:grid md:grid-cols-3 gap-4">
                {filteredPortfolio.length > 0 ? filteredPortfolio.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square bg-stone-800 relative group overflow-hidden cursor-pointer rounded-xl"
                    onClick={() => openLightbox(PORTFOLIO_ITEMS.findIndex(p => p.id === item.id))}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-white font-bold">{item.alt}</p>
                      <p className="text-white/70 text-sm">{item.artist} • {item.style} • {item.bodyPart}</p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-3 py-16 text-center opacity-50">
                    <ImageIcon size={48} className="mx-auto mb-4" />
                    <p>Nessun risultato per i filtri selezionati</p>
                  </div>
                )}
              </div>

              {/* Galleria Mobile */}
              <div className="md:hidden relative">
                <div
                  ref={galleryScrollRef}
                  onScroll={() => { handleGalleryScroll(); setMobileGalleryTapped(false); }}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-xl"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {filteredPortfolio.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-full aspect-square snap-center relative cursor-pointer"
                      onClick={handleMobileGalleryTap}
                    >
                      <div className="relative w-full h-full bg-stone-800 rounded-xl overflow-hidden">
                        <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white font-bold">{item.alt}</p>
                          <p className="text-white/70 text-sm">{item.artist} • {item.style}</p>
                        </div>
                        {mobileGalleryTapped && index === mobileGalleryIndex && (
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                            <ZoomIn size={48} className="text-white mb-3" />
                            <p className="text-white text-sm font-medium">Tocca per ingrandire</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Indicatori mobile galleria */}
                <div className="flex justify-center gap-2 mt-4">
                  {PORTFOLIO_ITEMS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMobileGalleryIndex(index);
                        setMobileGalleryTapped(false);
                        galleryScrollRef.current?.scrollTo({ left: index * (galleryScrollRef.current?.clientWidth || 0), behavior: 'smooth' });
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === mobileGalleryIndex
                          ? 'bg-stone-700 w-6'
                          : 'bg-stone-400 hover:bg-stone-500'
                        }`}
                      aria-label={`Vai all'immagine ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-center md:hidden">
                <a href="#" className="flex items-center gap-2 font-medium hover:text-stone-600 transition-colors">
                  Instagram <Instagram size={18} />
                </a>
              </div>
            </div>
          </section>

          {/* --- SERVICES SECTION --- */}
          <section id="services" className="py-24 px-6 transition-colors duration-300" style={{ backgroundColor: isDarkMode ? '#1A1714' : theme.sage }}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-3" style={{ color: theme.charcoal }}>Servizi & Prezzi</h2>
                <div className="h-1 w-24 mx-auto mb-4" style={{ backgroundColor: theme.crimson }}></div>
                <p style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }} className="max-w-2xl mx-auto">
                  Ogni tatuaggio è unico. I prezzi indicati sono orientativi e possono variare in base alla complessità del design.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.map((service, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                    style={{ backgroundColor: isDarkMode ? '#2A2520' : '#FFFFFF' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:scale-110 duration-300"
                      style={{ backgroundColor: `${theme.crimson}15`, color: theme.crimson }}
                    >
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: theme.charcoal }}>{service.title}</h3>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>{service.description}</p>
                    <div className="pt-4" style={{ borderTop: `1px solid ${isDarkMode ? '#3D352D' : '#F5F5F4'}` }}>
                      <span className="text-lg font-bold" style={{ color: theme.crimson }}>{service.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => navigateToCalendar()}
                  className="px-8 py-4 text-white font-bold rounded-lg hover:brightness-110 transition-all shadow-lg inline-flex items-center gap-2"
                  style={{ backgroundColor: theme.crimson }}
                >
                  Richiedi un Preventivo <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </section>

          {/* --- TESTIMONIALS SECTION --- */}
          <section id="testimonials" className="py-24 px-6 transition-colors duration-300" style={{ backgroundColor: isDarkMode ? '#2A2520' : '#E8E0D8' }}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-3" style={{ color: theme.charcoal }}>Cosa Dicono di Noi</h2>
                <div className="h-1 w-24 mx-auto" style={{ backgroundColor: theme.crimson }}></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((testimonial, index) => (
                  <div
                    key={index}
                    className="p-8 rounded-2xl shadow-lg relative"
                    style={{ backgroundColor: isDarkMode ? '#1F1C18' : theme.sage }}
                  >
                    <Quote
                      size={40}
                      className="absolute top-4 right-4 opacity-10"
                      style={{ color: theme.crimson }}
                    />
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={18} fill={theme.crimson} color={theme.crimson} />
                      ))}
                    </div>
                    <p className="leading-relaxed mb-6 italic" style={{ color: isDarkMode ? '#D1D5DB' : '#44403C' }}>"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${isDarkMode ? '#3D352D' : '#E7E5E4'}` }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ backgroundColor: isDarkMode ? theme.crimson : theme.charcoal, color: isDarkMode ? 'white' : 'white' }}>
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: theme.charcoal }}>{testimonial.author}</p>
                        <p className="text-xs" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>Cliente di {testimonial.artist}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- BLOG/NEWS SECTION --- */}
          <section id="blog" className="py-24 px-6" style={{ backgroundColor: isDarkMode ? '#1A1714' : '#FFFDF9' }}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
                  style={{ backgroundColor: `${theme.crimson}15`, color: theme.crimson }}>
                  <Newspaper size={14} /> News & Eventi
                </div>
                <h2 className="text-4xl font-bold mb-3" style={{ color: theme.charcoal }}>Novità dallo Studio</h2>
                <p style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>Flash day, eventi, nuovi artisti e molto altro</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BLOG_POSTS.map(post => (
                  <article
                    key={post.id}
                    className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer"
                    style={{ backgroundColor: isDarkMode ? '#2A2520' : theme.sage }}
                  >
                    {/* Category Badge + Gradient Header */}
                    <div className="h-32 relative flex items-center justify-center"
                      style={{
                        background: post.category === 'flash'
                          ? 'linear-gradient(135deg, #8A1C1C 0%, #B82828 100%)'
                          : post.category === 'event'
                            ? 'linear-gradient(135deg, #1F1C18 0%, #3D352D 100%)'
                            : 'linear-gradient(135deg, #BBA18B 0%, #D5CAC0 100%)'
                      }}>
                      {post.category === 'flash' && <Zap size={40} className="text-white/30" />}
                      {post.category === 'event' && <CalendarDays size={40} className="text-white/30" />}
                      {post.category === 'news' && <Newspaper size={40} className="text-stone-800/30" />}
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: post.category === 'news' ? '#1F1C18' : 'white'
                        }}>
                        {post.category === 'flash' ? '⚡ Flash Day' : post.category === 'event' ? '📅 Evento' : '📰 News'}
                      </span>
                    </div>
                    <div className="p-6">
                      <time className="text-xs font-medium" style={{ color: theme.crimson }}>
                        {new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </time>
                      <h3 className="text-lg font-bold mt-2 mb-3 group-hover:underline" style={{ color: theme.charcoal }}>
                        {post.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                        {post.excerpt}
                      </p>
                      <button className="mt-4 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                        style={{ color: theme.crimson }}>
                        Leggi di più <ArrowRight size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="text-center mt-12">
                <button
                  className="px-8 py-3 rounded-lg font-medium border-2 transition-all hover:scale-105"
                  style={{ borderColor: theme.crimson, color: theme.crimson }}
                >
                  Vedi tutte le news
                </button>
              </div>
            </div>
          </section>

          {/* --- FAQ SECTION --- */}
          <section id="faq" className="py-24 px-6" style={{ backgroundColor: COLORS.charcoal }}>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: COLORS.sage }}>
                  <HelpCircle size={14} /> Domande Frequenti
                </div>
                <h2 className="text-4xl font-bold text-white mb-3">Hai Domande?</h2>
                <p className="text-stone-400">Trova le risposte alle domande più comuni</p>
              </div>

              <div className="space-y-4">
                {FAQ_ITEMS.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-white/5"
                    >
                      <span className="font-medium text-white pr-4">{faq.question}</span>
                      <ChevronDown
                        size={20}
                        className={`text-stone-400 transition-transform duration-300 shrink-0 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-96' : 'max-h-0'}`}
                    >
                      <p className="px-6 pb-5 text-stone-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- CONTACT SECTION --- */}
          <section id="contact" className="py-24 px-6 transition-colors duration-300" style={{ backgroundColor: isDarkMode ? '#2A2520' : '#E8E0D8' }}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-3" style={{ color: theme.charcoal }}>Contattaci</h2>
                <div className="h-1 w-24 mx-auto mb-4" style={{ backgroundColor: theme.crimson }}></div>
                <p style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>Vieni a trovarci o scrivici per qualsiasi informazione</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="rounded-3xl p-8 md:p-10 shadow-xl" style={{ backgroundColor: isDarkMode ? '#1F1C18' : theme.sage }}>
                  <h3 className="text-2xl font-bold mb-8" style={{ color: theme.charcoal }}>Tomoe Tattoo Studio</h3>

                  <div className="space-y-6">
                    {/* Address */}
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address + ', ' + CONTACT_INFO.city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 group hover:translate-x-1 transition-transform"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${theme.crimson}15` }}>
                        <MapPin size={22} style={{ color: theme.crimson }} />
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: theme.charcoal }}>{CONTACT_INFO.address}</p>
                        <p style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>{CONTACT_INFO.city}</p>
                      </div>
                    </a>

                    {/* Phone */}
                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="flex items-start gap-4 group hover:translate-x-1 transition-transform"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${theme.crimson}15` }}>
                        <Phone size={22} style={{ color: theme.crimson }} />
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: theme.charcoal }}>Telefono</p>
                        <p style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>{CONTACT_INFO.phone}</p>
                      </div>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="flex items-start gap-4 group hover:translate-x-1 transition-transform"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${theme.crimson}15` }}>
                        <Mail size={22} style={{ color: theme.crimson }} />
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: theme.charcoal }}>Email</p>
                        <p style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>{CONTACT_INFO.email}</p>
                      </div>
                    </a>

                    {/* Hours */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${theme.crimson}15` }}>
                        <Clock size={22} style={{ color: theme.crimson }} />
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: theme.charcoal }}>Orari</p>
                        <p style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>{CONTACT_INFO.hours.weekdays}</p>
                        <p className="text-sm" style={{ color: isDarkMode ? '#6B7280' : '#9CA3AF' }}>{CONTACT_INFO.hours.closed}</p>
                      </div>
                    </div>
                  </div>

                  {/* Social + WhatsApp */}
                  <div className="mt-8 pt-8" style={{ borderTop: `1px solid ${isDarkMode ? '#3D352D' : '#E7E5E4'}` }}>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] px-5 py-3 rounded-xl font-bold text-white text-center transition-all hover:brightness-110 shadow-md flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#25D366' }}
                      >
                        <MessageCircle size={20} /> WhatsApp
                      </a>
                      <a
                        href={`https://instagram.com/${CONTACT_INFO.social.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] px-5 py-3 rounded-xl font-bold text-white text-center transition-all hover:brightness-110 shadow-md flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                      >
                        <Instagram size={20} /> Instagram
                      </a>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigateToCalendar()}
                    className="mt-6 w-full px-8 py-4 text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: theme.crimson }}
                  >
                    <Calendar size={20} /> Prenota Appuntamento
                  </button>
                </div>

                {/* Map */}
                <div className="rounded-3xl overflow-hidden shadow-xl h-[400px] lg:h-auto">
                  <iframe
                    src={CONTACT_INFO.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '400px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mappa Tomoe Tattoo Studio"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* --- FOOTER (Global) --- */}
      <footer
        className="py-8 px-6 border-t"
        style={{ backgroundColor: COLORS.charcoal, borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo e Copyright */}
            <div className="text-center md:text-left">
              <div className="text-xl font-bold tracking-tighter uppercase text-white mb-2">
                Studio<span style={{ color: COLORS.crimson }}>.</span>
              </div>
              <p className="text-stone-400 text-sm">
                © {new Date().getFullYear()} Tattoo Studio. Tutti i diritti riservati.
              </p>
            </div>

            {/* Link rapidi + Social */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6 text-stone-400 text-sm">
              <a href="#studio" className="hover:text-white transition-colors">Studio</a>
              <a href="#works" className="hover:text-white transition-colors">Opere</a>
              <a href="#services" className="hover:text-white transition-colors">Servizi</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-white transition-colors">Contatti</a>
              {/* Separatore pallino - solo desktop */}
              <span className="hidden md:block w-1 h-1 rounded-full bg-stone-500"></span>
              <a
                href={`https://instagram.com/${CONTACT_INFO.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Credits */}
          <div className="mt-8 pt-6 border-t border-stone-700 text-center">
            <p className="text-stone-500 text-xs">
              Sito web realizzato da <span className="text-stone-400 font-medium">Redi Bako</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Sfondo nero opaco */}
          <div className="absolute inset-0 bg-black/95" />

          {/* Contenitore carosello */}
          <div
            className="relative z-10 flex items-center justify-center w-full h-full px-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndLightbox}
          >
            {/* Immagine precedente (sfocata, 90%) */}
            <div className="hidden md:block absolute left-12 w-[20%] max-h-[70vh] opacity-50 transition-all duration-300">
              <img
                src={PORTFOLIO_ITEMS[getLightboxPrevIndex()].src}
                alt={PORTFOLIO_ITEMS[getLightboxPrevIndex()].alt}
                className="w-full h-full object-contain rounded-xl blur-sm scale-90"
              />
            </div>

            {/* Immagine centrale */}
            <div className="relative w-full md:w-[50%] max-w-3xl max-h-[80vh] group flex items-center justify-center">
              <img
                src={PORTFOLIO_ITEMS[lightboxIndex].src}
                alt={PORTFOLIO_ITEMS[lightboxIndex].alt}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />

              {/* Freccia sinistra */}
              <button
                onClick={prevLightboxImage}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-24 items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                aria-label="Immagine precedente"
              >
                <ChevronLeft size={32} />
              </button>

              {/* Freccia destra */}
              <button
                onClick={nextLightboxImage}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-24 items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                aria-label="Immagine successiva"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Immagine successiva (sfocata, 90%) */}
            <div className="hidden md:block absolute right-12 w-[20%] max-h-[70vh] opacity-50 transition-all duration-300">
              <img
                src={PORTFOLIO_ITEMS[getLightboxNextIndex()].src}
                alt={PORTFOLIO_ITEMS[getLightboxNextIndex()].alt}
                className="w-full h-full object-contain rounded-xl blur-sm scale-90"
              />
            </div>

            {/* Pulsante chiudi */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300"
              aria-label="Chiudi"
            >
              <X size={24} />
            </button>

            {/* Indicatori */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {PORTFOLIO_ITEMS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === lightboxIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/80'
                    }`}
                  aria-label={`Vai all'immagine ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TattooStudio;