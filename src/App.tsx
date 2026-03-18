import React, { useState, useEffect, useCallback } from 'react';
import { Instagram, MapPin, Calendar, ArrowRight, Menu, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
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
}

// --- Data & Config ---

const COLORS: ColorPalette = {
  sage: '#FDFBF7',      // MODIFICATO: Bianco Panna (Cream/Off-White)
  sand: '#D5CAC0',      // Sabbia/Grigio (Sfondo Pagina)
  leather: '#BBA18B',   // Marrone (Dettagli)
  charcoal: '#1F1C18',  // Nero caldo (Testi)
  crimson: '#8A1C1C',   // Rosso scuro (Accenti)
};

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: 1, alt: 'Tattoo Work 1', src: tat1 },
  { id: 2, alt: 'Tattoo Work 2', src: tat2 },
  { id: 3, alt: 'Tattoo Work 3', src: tat3 },
];

const STUDIO_IMAGES = [studioImg1, studioImg2, studioImg3];

const TomoeLanding: React.FC = () => {
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
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  const [mainImageOpacity, setMainImageOpacity] = useState<number>(1);
  const [hoverEnabled, setHoverEnabled] = useState<boolean>(true);
  const [transitionTargetImage, setTransitionTargetImage] = useState<number | null>(null);

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

    const targetIndex = currentStudioImage === 0 ? STUDIO_IMAGES.length - 1 : currentStudioImage - 1;

    setIsTransitioning(true);
    setTransitionDirection('left');
    setTransitionTargetImage(targetIndex);
    setHoverEnabled(false);

    // L'immagine principale scorre verso destra mentre l'anteprima si espande
    setTimeout(() => {
      setCurrentStudioImage(targetIndex);
      setMainImageOpacity(1);
      setTransitionDirection(null);
      setTransitionTargetImage(null);
      setIsTransitioning(false);
      setHoverOffset(0);
    }, 600);

    // Riattiva hover dopo un breve delay
    setTimeout(() => {
      setHoverEnabled(true);
    }, 800);
  };

  const nextStudioImage = () => {
    if (isTransitioning) return;

    const targetIndex = currentStudioImage === STUDIO_IMAGES.length - 1 ? 0 : currentStudioImage + 1;

    setIsTransitioning(true);
    setTransitionDirection('right');
    setTransitionTargetImage(targetIndex);
    setHoverEnabled(false);

    // L'immagine principale scorre verso sinistra mentre l'anteprima si espande
    setTimeout(() => {
      setCurrentStudioImage(targetIndex);
      setMainImageOpacity(1);
      setTransitionDirection(null);
      setTransitionTargetImage(null);
      setIsTransitioning(false);
      setHoverOffset(0);
    }, 600);

    // Riattiva hover dopo un breve delay
    setTimeout(() => {
      setHoverEnabled(true);
    }, 800);
  };

  const getPrevImageIndex = () => (currentStudioImage === 0 ? STUDIO_IMAGES.length - 1 : currentStudioImage - 1);
  const getNextImageIndex = () => (currentStudioImage === STUDIO_IMAGES.length - 1 ? 0 : currentStudioImage + 1);

  // Durante la transizione usa l'indice salvato, altrimenti calcola dinamicamente
  const getPreviewImageIndex = (direction: 'left' | 'right') => {
    if (isTransitioning && transitionTargetImage !== null) {
      return transitionTargetImage;
    }
    return direction === 'left' ? getPrevImageIndex() : getNextImageIndex();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEnabled || isTransitioning) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const normalizedX = (x / width - 0.5) * 2; // da -1 (sinistra) a 1 (destra)
    setHoverOffset(normalizedX);
  };

  const handleMouseEnter = () => {
    if (hoverEnabled && !isTransitioning) {
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
        className="fixed w-full z-50 backdrop-blur-md border-b border-stone-200/50"
        style={{ backgroundColor: 'rgba(253, 251, 247, 0.85)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-bold tracking-tighter uppercase cursor-pointer"
            onClick={() => navigateToHome()}
          >
            Studio<span style={{ color: COLORS.crimson }}>.</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center font-medium text-sm tracking-wide">
            <a href="#studio" onClick={() => navigateToHome()} className="hover:text-red-800 transition-colors">Studio</a>
            <a href="#works" onClick={() => navigateToHome()} className="hover:text-red-800 transition-colors">Opere</a>
            <button onClick={() => navigateToArtists()} className="hover:text-red-800 transition-colors">Artisti</button>
            <a href="#contact" onClick={() => navigateToHome()} className="hover:text-red-800 transition-colors">Contatti</a>
            <button
              onClick={() => navigateToCalendar()}
              className="px-5 py-2 text-white rounded-full transition-transform hover:scale-105 shadow-md"
              style={{ backgroundColor: COLORS.crimson }}
            >
              Prenota Ora
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 hover:bg-stone-100 rounded-md transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Slide down animation */}
        <div
          className={`md:hidden absolute w-full border-b border-stone-200/50 flex flex-col gap-4 shadow-xl overflow-hidden transition-all duration-300 ease-out ${isMenuOpen ? 'max-h-96 py-6 px-6 opacity-100' : 'max-h-0 py-0 px-6 opacity-0'
            }`}
          style={{ backgroundColor: COLORS.sage }}
        >
          <a href="#studio" onClick={() => { toggleMenu(); navigateToHome(); }} className="text-lg font-medium">Studio</a>
          <a href="#works" onClick={() => { toggleMenu(); navigateToHome(); }} className="text-lg font-medium">Opere</a>
          <button onClick={() => { toggleMenu(); navigateToArtists(); }} className="text-lg font-medium text-left">Artisti</button>
          <a href="#contact" onClick={() => { toggleMenu(); navigateToHome(); }} className="text-lg font-medium">Contatti</a>
          <button
            onClick={() => { toggleMenu(); navigateToCalendar(); }}
            className="w-full py-3 text-white rounded-lg font-bold mt-2"
            style={{ backgroundColor: COLORS.crimson }}
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
            {/* Anteprima sinistra (immagine precedente) - Morph effect */}
            <div
              className="absolute top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none rounded-2xl"
              style={{
                right: isTransitioning && transitionDirection === 'left' ? '0%' : '100%',
                width: isTransitioning && transitionDirection === 'left' ? '100%' : `${(isHovering && hoverOffset < 0) ? Math.abs(hoverOffset) * 40 : 0}px`,
                height: isTransitioning && transitionDirection === 'left' ? '100%' : '85%',
                opacity: (isHovering && hoverOffset < 0) || transitionDirection === 'left' ? 1 : 0,
                transition: isTransitioning
                  ? 'right 0.5s cubic-bezier(0.4, 0, 0.2, 1), width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out'
                  : 'width 0.15s ease-out, opacity 0.15s ease-out',
                zIndex: isTransitioning && transitionDirection === 'left' ? 20 : 0,
                boxShadow: isTransitioning && transitionDirection === 'left' ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : 'none',
              }}
            >
              <img
                src={STUDIO_IMAGES[getPreviewImageIndex('left')]}
                alt="Immagine precedente"
                className="w-full h-full object-cover"
                style={{
                  transform: isTransitioning && transitionDirection === 'left' ? 'scale(1)' : 'scale(1.1)',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>

            {/* Anteprima destra (immagine successiva) - Morph effect */}
            <div
              className="absolute top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none rounded-2xl"
              style={{
                left: isTransitioning && transitionDirection === 'right' ? '0%' : '100%',
                width: isTransitioning && transitionDirection === 'right' ? '100%' : `${(isHovering && hoverOffset > 0) ? hoverOffset * 40 : 0}px`,
                height: isTransitioning && transitionDirection === 'right' ? '100%' : '85%',
                opacity: (isHovering && hoverOffset > 0) || transitionDirection === 'right' ? 1 : 0,
                transition: isTransitioning
                  ? 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1), width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out'
                  : 'width 0.15s ease-out, opacity 0.15s ease-out',
                zIndex: isTransitioning && transitionDirection === 'right' ? 20 : 0,
                boxShadow: isTransitioning && transitionDirection === 'right' ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : 'none',
              }}
            >
              <img
                src={STUDIO_IMAGES[getPreviewImageIndex('right')]}
                alt="Immagine successiva"
                className="w-full h-full object-cover"
                style={{
                  transform: isTransitioning && transitionDirection === 'right' ? 'scale(1)' : 'scale(1.1)',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>

            {/* Immagine principale */}
            <div
              className="aspect-4/5 bg-stone-200 rounded-2xl overflow-hidden shadow-2xl relative z-10"
              style={{
                transform: isTransitioning
                  ? `translateX(${transitionDirection === 'left' ? '30%' : transitionDirection === 'right' ? '-30%' : '0'}) scale(0.9)`
                  : `translateX(${-hoverOffset * 25}px) scale(${isHovering ? 1.02 : 1})`,
                opacity: isTransitioning ? 0 : 1,
                transition: isTransitioning
                  ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out'
                  : 'transform 0.2s ease-out, opacity 0.2s ease-out',
              }}
            >
              <img
                src={STUDIO_IMAGES[currentStudioImage]}
                alt={`Studio Interior ${currentStudioImage + 1}`}
                className="object-cover w-full h-full opacity-90"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none transition-colors duration-500 group-hover:bg-black/5"></div>

              {/* Frecce di navigazione - solo desktop */}
              <button
                onClick={prevStudioImage}
                className="flex absolute left-0 top-1/2 -translate-y-1/2 w-12 h-24 items-center justify-center bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-full group-hover:translate-x-0 rounded-r-lg"
                aria-label="Immagine precedente"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextStudioImage}
                className="flex absolute right-0 top-1/2 -translate-y-1/2 w-12 h-24 items-center justify-center bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-full group-hover:translate-x-0 rounded-l-lg"
                aria-label="Immagine successiva"
              >
                <ChevronRight size={32} />
              </button>

              {/* Indicatori */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {STUDIO_IMAGES.map((_, index) => (
                  <button
                    onClick={() => navigateToCalendar()}
                    className="px-8 py-4 text-white rounded-lg font-semibold flex items-center gap-2 transition-all hover:gap-4 shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: COLORS.crimson }}
                  >
                    Prenota una consultazione <ArrowRight size={20} />
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
                {/* Anteprima sinistra (immagine precedente) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none z-0"
                  style={{
                    right: isTransitioning && transitionDirection === 'left'
                      ? '0%'
                      : `calc(100% + ${hoverOffset * 30}px)`,
                    width: isTransitioning && transitionDirection === 'left'
                      ? '100%'
                      : `${(isHovering || isTransitioning) && hoverOffset < 0 ? Math.abs(hoverOffset) * 30 : 0}px`,
                    height: isTransitioning && transitionDirection === 'left' ? '100%' : '90%',
                    opacity: (isHovering || transitionDirection === 'left') && hoverOffset < 0 ? 1 : 0,
                    transition: isTransitioning ? 'all 0.4s ease-out' : 'none',
                    borderRadius: isTransitioning && transitionDirection === 'left' ? '1rem' : '1rem 0 0 1rem',
                  }}
                >
                  <img
                    src={STUDIO_IMAGES[getPreviewImageIndex('left')]}
                    alt="Immagine precedente"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Anteprima destra (immagine successiva) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none z-0"
                  style={{
                    left: isTransitioning && transitionDirection === 'right'
                      ? '0%'
                      : `calc(100% - ${hoverOffset * 30}px)`,
                    width: isTransitioning && transitionDirection === 'right'
                      ? '100%'
                      : `${(isHovering || isTransitioning) && hoverOffset > 0 ? hoverOffset * 30 : 0}px`,
                    height: isTransitioning && transitionDirection === 'right' ? '100%' : '90%',
                    opacity: (isHovering || transitionDirection === 'right') && hoverOffset > 0 ? 1 : 0,
                    transition: isTransitioning ? 'all 0.4s ease-out' : 'none',
                    borderRadius: isTransitioning && transitionDirection === 'right' ? '1rem' : '0 1rem 1rem 0',
                  }}
                >
                  <img
                    src={STUDIO_IMAGES[getPreviewImageIndex('right')]}
                    alt="Immagine successiva"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Immagine principale */}
                <div
                  className="aspect-4/5 bg-stone-200 rounded-2xl overflow-hidden shadow-2xl relative z-10"
                  style={{
                    transform: `translateX(${isTransitioning ? 0 : -hoverOffset * 30}px) scale(${isHovering && !isTransitioning ? 1.02 : 1})`,
                    transition: isTransitioning ? 'opacity 0.4s ease-out' : 'transform 0.2s ease-out',
                    opacity: mainImageOpacity,
                  }}
                >
                  <img
                    src={STUDIO_IMAGES[currentStudioImage]}
                    alt={`Studio Interior ${currentStudioImage + 1}`}
                    className="object-cover w-full h-full opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/10 pointer-events-none transition-colors duration-500 group-hover:bg-black/5"></div>

                  {/* Frecce di navigazione - solo desktop */}
                  <button
                    onClick={prevStudioImage}
                    className="flex absolute left-0 top-1/2 -translate-y-1/2 w-12 h-24 items-center justify-center bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-full group-hover:translate-x-0 rounded-r-lg"
                    aria-label="Immagine precedente"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={nextStudioImage}
                    className="flex absolute right-0 top-1/2 -translate-y-1/2 w-12 h-24 items-center justify-center bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-full group-hover:translate-x-0 rounded-l-lg"
                    aria-label="Immagine successiva"
                  >
                    <ChevronRight size={32} />
                  </button>

                  {/* Indicatori */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {STUDIO_IMAGES.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStudioImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStudioImage
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/80'
                          }`}
                        aria-label={`Vai all'immagine ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Badge - Desktop */}

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
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStudioImage
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
            style={{ backgroundColor: '#FFFDF9' }} // Sfondo sezione bianco caldo
          >
            {/* WRAPPER PIÙ SCURO PER CONTRASTO */}
            <div
              className="max-w-6xl mx-auto p-8 md:p-12 rounded-3xl shadow-lg"
              style={{ backgroundColor: '#E8E0D8', color: COLORS.charcoal }}
            >
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Le nostre opere</h2>
                  <div className="h-1 w-24" style={{ backgroundColor: COLORS.crimson }}></div>
                </div>
                <a href="#" className="hidden md:flex items-center gap-2 font-medium hover:text-stone-600 transition-colors">
                  Vedi tutto su Instagram <Instagram size={18} />
                </a>
              </div>

              {/* Galleria Desktop */}
              <div className="hidden md:grid md:grid-cols-3 gap-1">
                {PORTFOLIO_ITEMS.map((item, index) => (
                  <div
                    key={item.id}
                    className="aspect-square bg-stone-800 relative group overflow-hidden cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white font-bold tracking-widest uppercase border border-white px-4 py-2 backdrop-blur-sm">
                        View
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Galleria Mobile - Scroll snap con tap-to-zoom */}
              <div className="md:hidden relative">
                <div
                  ref={galleryScrollRef}
                  onScroll={() => {
                    handleGalleryScroll();
                    setMobileGalleryTapped(false); // Reset tap state on scroll
                  }}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-xl"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {PORTFOLIO_ITEMS.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-full aspect-square snap-center relative cursor-pointer"
                      onClick={handleMobileGalleryTap}
                    >
                      <div className="relative w-full h-full bg-stone-800">
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay tap-to-zoom */}
                        {mobileGalleryTapped && index === mobileGalleryIndex && (
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity duration-300">
                            <ZoomIn size={48} className="text-white mb-3" />
                            <p className="text-white text-sm font-medium text-center px-4">
                              Tocca per vedere la galleria completa
                            </p>
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

          {/* --- FOOTER / CONTACT --- */}
          <section id="contact" className="py-24 px-6">
            <div
              className="max-w-5xl mx-auto rounded-3xl p-8 md:p-16 flex flex-col md:flex-row gap-12 shadow-2xl relative"
              style={{ backgroundColor: COLORS.sage, color: COLORS.charcoal }} // Sfondo Bianco Panna
            >
              <div className="flex-1 space-y-6 z-10">
                <Calendar className="w-12 h-12" style={{ color: COLORS.crimson }} />
                <h2 className="text-3xl md:text-4xl font-bold">Prenota il tuo appuntamento</h2>
                <p className="text-stone-700 leading-relaxed font-medium">
                  Raccontaci la tua idea, scegli l'artista e blocca la data.
                </p>
                <button
                  onClick={() => navigateToCalendar()}
                  className="mt-4 px-8 py-4 text-white font-bold rounded-lg w-full md:w-auto hover:brightness-110 transition-all shadow-lg"
                  style={{ backgroundColor: COLORS.crimson }}
                >
                  Apri Calendario
                </button>
              </div>

              <div className="flex-1 space-y-8 md:border-l md:border-stone-200 md:pl-12 flex flex-col justify-center z-10">
                <div className="flex items-start gap-4 group">
                  <MapPin className="mt-1 shrink-0 text-stone-700 group-hover:text-red-800 transition-colors" />
                  <div>
                    <h3 className="font-bold text-lg">Tattoo Studio</h3>
                    <p className="text-stone-700">Via Example 123<br />Città, Regione</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <Instagram className="mt-1 shrink-0 text-stone-700 group-hover:text-red-800 transition-colors" />
                  <div>
                    <h3 className="font-bold text-lg">Seguici</h3>
                    <p className="text-stone-700">@studio_tattoo</p>
                  </div>
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
            <div className="flex items-center gap-4 md:gap-6 text-stone-400 text-sm">
              <a href="#studio" className="hover:text-white transition-colors">Studio</a>
              <a href="#works" className="hover:text-white transition-colors">Opere</a>
              <a href="#contact" className="hover:text-white transition-colors">Contatti</a>
              {/* Separatore pallino - solo desktop */}
              <span className="hidden md:block w-1 h-1 rounded-full bg-stone-500"></span>
              <a
                href="#"
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

export default TomoeLanding;