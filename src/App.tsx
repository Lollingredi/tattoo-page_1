import React, { useState } from 'react';
import { Instagram, MapPin, Calendar, ArrowRight, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Importazione Immagini
import studioImg1 from './elements/studio1.PNG';
import studioImg2 from './elements/studio2.PNG';
import studioImg3 from './elements/studio3.PNG';
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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentStudioImage, setCurrentStudioImage] = useState<number>(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const prevStudioImage = () => {
    setCurrentStudioImage((prev) => (prev === 0 ? STUDIO_IMAGES.length - 1 : prev - 1));
  };

  const nextStudioImage = () => {
    setCurrentStudioImage((prev) => (prev === STUDIO_IMAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      style={{ backgroundColor: COLORS.sand, color: COLORS.charcoal }} 
      className="min-h-screen font-sans selection:bg-red-200"
    >
      
      {/* --- NAVIGATION --- */}
      <nav
        className="fixed w-full z-50 backdrop-blur-md border-b border-stone-200/50"
        style={{ backgroundColor: 'rgba(253, 251, 247, 0.85)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter uppercase cursor-pointer">
            Tomoe<span style={{ color: COLORS.crimson }}>.</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center font-medium text-sm tracking-wide">
            <a href="#studio" className="hover:text-red-800 transition-colors">Studio</a>
            <a href="#works" className="hover:text-red-800 transition-colors">Opere</a>
            <a href="#contact" className="hover:text-red-800 transition-colors">Contatti</a>
            <button 
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden absolute w-full border-b border-stone-200/50 py-6 px-6 flex flex-col gap-4 shadow-xl"
            style={{ backgroundColor: COLORS.sage }}
          >
            <a href="#studio" onClick={toggleMenu} className="text-lg font-medium">Studio</a>
            <a href="#works" onClick={toggleMenu} className="text-lg font-medium">Opere</a>
            <a href="#contact" onClick={toggleMenu} className="text-lg font-medium">Contatti</a>
            <button 
              className="w-full py-3 text-white rounded-lg font-bold mt-2"
              style={{ backgroundColor: COLORS.crimson }}
            >
              Prenota Ora
            </button>
          </div>
        )}
      </nav>

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
              Castelferretti, Marche
            </p>
            <h1 className="text-5xl md:text-7xl font-light leading-tight text-stone-900">
              Arte su pelle, <br />
              <span className="font-bold italic">anima zen.</span>
            </h1>
            <p className="text-lg text-stone-700 max-w-md leading-relaxed">
              Uno spazio dove il tatuaggio tradizionale incontra la calma moderna. 
              Linee pulite, ambiente rilassato, inchiostro indelebile.
            </p>
            <div className="pt-4 flex gap-4">
              <button 
                className="px-8 py-4 text-white rounded-lg font-semibold flex items-center gap-2 transition-all hover:gap-4 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: COLORS.crimson }}
              >
                Prenota una consultazione <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Image Area - Studio Slider */}
          <div className="relative group">
            <div className="aspect-4/5 bg-stone-200 rounded-2xl overflow-hidden shadow-2xl relative transition-transform duration-700 md:group-hover:scale-105">
              <img
                src={STUDIO_IMAGES[currentStudioImage]}
                alt={`Tomoe Studio Interior ${currentStudioImage + 1}`}
                className="object-cover w-full h-full opacity-90 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none transition-colors duration-500 md:group-hover:bg-black/5"></div>

              {/* Frecce di navigazione - solo desktop */}
              <button
                onClick={prevStudioImage}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-12 h-24 items-center justify-center bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-full group-hover:translate-x-0 rounded-r-lg"
                aria-label="Immagine precedente"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextStudioImage}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-12 h-24 items-center justify-center bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-full group-hover:translate-x-0 rounded-l-lg"
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
            
            {/* Badge */}
            <div
              className="absolute -bottom-6 -left-6 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-stone-200/50 max-w-xs hidden md:block"
              style={{ backgroundColor: 'rgba(253, 251, 247, 0.9)' }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-stone-400">Atmosphere</p>
              <p className="font-medium text-stone-800">Un ambiente curato per farti sentire a casa mentre creiamo arte.</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {PORTFOLIO_ITEMS.map((item) => (
              <div key={item.id} className="aspect-square bg-stone-800 relative group overflow-hidden cursor-pointer">
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
                 <h3 className="font-bold text-lg">Tomoe Tattoo Studio</h3>
                 <p className="text-stone-700">Piazza della libertà 4<br/>Castelferretti, Marche</p>
               </div>
             </div>
             <div className="flex items-start gap-4 group">
               <Instagram className="mt-1 shrink-0 text-stone-700 group-hover:text-red-800 transition-colors" />
               <div>
                 <h3 className="font-bold text-lg">Seguici</h3>
                 <p className="text-stone-700">@tomoe_tattoo_studio</p>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TomoeLanding;