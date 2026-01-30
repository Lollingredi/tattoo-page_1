import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Quote } from 'lucide-react';

// Import artist profile images
import tattooer1 from './elements/tattooer1.png';
import tattooer2 from './elements/tattooer2.png';
import tattooer3 from './elements/tattooer3.png';

// Import artist work images
import tattoo1_1 from './elements/tattoo1-1.png';
import tattoo1_2 from './elements/tattoo1-2.png';
import tattoo1_3 from './elements/tattoo1-3.png';
import tattoo2_1 from './elements/tattoo2-1.png';
import tattoo2_2 from './elements/tattoo2-2.png';
import tattoo2_3 from './elements/tattoo2-3.png';
import tattoo3_1 from './elements/tattoo3-1.png';
import tattoo3_2 from './elements/tattoo3-2.png';
import tattoo3_3 from './elements/tattoo3-3.png';

// --- Types ---

interface Artist {
  id: string;
  name: string;
  nickname: string;
  fullName: string;
  studio: string;
  experience: string;
  specialization: string[];
  subjects: string[];
  bio: string;
  quote: string;
  profileImage: string;
  works: string[];
}

// --- Data ---

const COLORS = {
  sage: '#FDFBF7',
  sand: '#D5CAC0',
  leather: '#BBA18B',
  charcoal: '#1F1C18',
  crimson: '#8A1C1C',
};

const ARTISTS: Artist[] = [
  {
    id: 'leo',
    name: 'Leo',
    nickname: "L'Ancora",
    fullName: 'Leo "L\'Ancora" Rossi',
    studio: 'Porto Antico Tattoo, Genova',
    experience: '25+ anni',
    specialization: [
      'American Traditional / Old School: Linee spesse e audaci (bold lines), tavolozza di colori limitata (rosso, verde, giallo, nero), ombreggiature pesanti a frusta (whip shading).',
    ],
    subjects: ['Rose', 'Pugnali', 'Rondini', 'Velieri', 'Cuori sacri', 'Pin-up'],
    bio: 'Leo è un purista. Per lui, un tatuaggio deve sembrare un tatuaggio, non un dipinto ad acquerello. Crede nel detto "Bold will hold" (Se è spesso, reggerà nel tempo). Il suo studio profuma di disinfettante e musica rockabilly. Non aspettarti lunghe consulenze spirituali; vieni da lui se vuoi un pezzo solido e classico che tra 30 anni sarà ancora leggibile.',
    quote: 'Le mode passano, una linea solida resta per sempre.',
    profileImage: tattooer1,
    works: [tattoo1_1, tattoo1_2, tattoo1_3],
  },
  {
    id: 'elena',
    name: 'Elena',
    nickname: 'Luna',
    fullName: 'Elena "Luna" Moretti',
    studio: 'Atelier Ethereal, Milano',
    experience: '6 anni',
    specialization: [
      'Fine Line (Linea Sottile): Uso di aghi singoli o molto sottili per lavori delicati e precisi.',
      'Dotwork & Geometrico: Creazione di immagini e sfumature attraverso migliaia di puntini; pattern sacri e mandala.',
      'Ornamentale: Tatuaggi che decorano il corpo come gioielli permanenti.',
    ],
    subjects: ['Mandala', 'Pattern geometrici', 'Gioielli', 'Simboli sacri'],
    bio: 'Elena vede il tatuaggio come un atto di decorazione consapevole e delicata. Il suo studio sembra più una galleria d\'arte moderna che un negozio di tatuaggi, con molta luce naturale e piante. È specializzata in lavori piccoli, significativi e incredibilmente dettagliati che richiedono una mano ferma e molta pazienza. I suoi clienti cercano eleganza e discrezione.',
    quote: 'La forza non deve per forza urlare; a volte sussurra.',
    profileImage: tattooer2,
    works: [tattoo2_1, tattoo2_2, tattoo2_3],
  },
  {
    id: 'matteo',
    name: 'Matteo',
    nickname: 'Kroma',
    fullName: 'Matteo "Kroma" Bianchi',
    studio: 'Inchiostro Vivo, Roma',
    experience: '12 anni',
    specialization: [
      'Neo-Traditional: Evoluzione dell\'Old School con linee di diverso spessore, una tavolozza di colori più ampia e vibrante, e soggetti più complessi e illustrativi.',
      'Realismo Illustrativo: Ritratti di animali o volti che mescolano realismo con elementi grafici o surreali.',
      'Soggetti Naturalistici: Flora, fauna e mitologia.',
    ],
    subjects: ['Flora', 'Fauna', 'Mitologia', 'Ritratti'],
    bio: 'Matteo ha un background accademico in belle arti e tratta la pelle come una tela vivente. È noto per la sua capacità di saturare il colore in modo incredibile e per le sue composizioni dinamiche che sembrano muoversi con il corpo. Ama i progetti grandi (maniche, schiene) dove può raccontare una storia complessa attraverso immagini ricche di dettagli.',
    quote: 'Non copro solo la pelle, porto in superficie le storie che nasconde.',
    profileImage: tattooer3,
    works: [tattoo3_1, tattoo3_2, tattoo3_3],
  },
];

const ArtistsPage: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Touch/Swipe states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
  };

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

  const getLightboxPrevIndex = () => (lightboxIndex === 0 ? lightboxImages.length - 1 : lightboxIndex - 1);
  const getLightboxNextIndex = () => (lightboxIndex === lightboxImages.length - 1 ? 0 : lightboxIndex + 1);

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">I Nostri Artisti</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Ogni artista porta una visione unica e anni di esperienza. Scopri il loro stile e trova quello perfetto per il tuo prossimo tatuaggio.
          </p>
        </div>

        {/* Artists List */}
        <div className="space-y-16">
          {ARTISTS.map((artist, artistIndex) => (
            <article
              key={artist.id}
              className="rounded-3xl overflow-hidden shadow-xl"
              style={{ backgroundColor: COLORS.sage }}
            >
              {/* Artist Header */}
              <div className={`flex flex-col ${artistIndex % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Profile Image */}
                <div className="md:w-2/5 aspect-square md:aspect-auto relative overflow-hidden">
                  <img
                    src={artist.profileImage}
                    alt={artist.fullName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden" />
                  <div className="absolute bottom-4 left-4 md:hidden">
                    <h2 className="text-2xl font-bold text-white">{artist.fullName}</h2>
                    <p className="text-white/80">{artist.studio}</p>
                  </div>
                </div>

                {/* Artist Info */}
                <div className="md:w-3/5 p-6 md:p-10">
                  {/* Name - Hidden on mobile (shown on image) */}
                  <div className="hidden md:block mb-6">
                    <h2 className="text-3xl font-bold mb-2">{artist.fullName}</h2>
                    <div className="flex items-center gap-4 text-stone-600">
                      <span>{artist.studio}</span>
                      <span className="w-1 h-1 rounded-full bg-stone-400" />
                      <span>{artist.experience}</span>
                    </div>
                  </div>

                  {/* Mobile experience */}
                  <div className="md:hidden mb-4">
                    <span className="text-sm text-stone-500">{artist.experience} di esperienza</span>
                  </div>

                  {/* Specializations */}
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3" style={{ color: COLORS.crimson }}>
                      Specializzazione
                    </h3>
                    <ul className="space-y-2">
                      {artist.specialization.map((spec, i) => (
                        <li key={i} className="text-stone-700 text-sm leading-relaxed">
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subjects */}
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3" style={{ color: COLORS.crimson }}>
                      Soggetti Classici
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {artist.subjects.map((subject, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{ backgroundColor: COLORS.sand, color: COLORS.charcoal }}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3" style={{ color: COLORS.crimson }}>
                      Filosofia
                    </h3>
                    <p className="text-stone-700 leading-relaxed">{artist.bio}</p>
                  </div>

                  {/* Quote */}
                  <div
                    className="rounded-xl p-4 flex items-start gap-3"
                    style={{ backgroundColor: COLORS.sand }}
                  >
                    <Quote size={24} className="shrink-0 mt-1" style={{ color: COLORS.crimson }} />
                    <p className="italic text-stone-700 font-medium">"{artist.quote}"</p>
                  </div>
                </div>
              </div>

              {/* Artist Works Gallery */}
              <div className="p-6 pt-0 md:p-10 md:pt-0">
                <h3 className="font-bold text-lg mb-4">Lavori Recenti</h3>
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {artist.works.map((work, workIndex) => (
                    <div
                      key={workIndex}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
                      onClick={() => openLightbox(artist.works, workIndex)}
                    >
                      <img
                        src={work}
                        alt={`${artist.name} - Lavoro ${workIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="text-white font-bold tracking-widest uppercase border border-white px-4 py-2 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                          View
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && lightboxImages.length > 0 && (
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
            {/* Immagine precedente (sfocata) */}
            <div className="hidden md:block absolute left-12 w-[20%] max-h-[70vh] opacity-50 transition-all duration-300">
              <img
                src={lightboxImages[getLightboxPrevIndex()]}
                alt="Immagine precedente"
                className="w-full h-full object-contain rounded-xl blur-sm scale-90"
              />
            </div>

            {/* Immagine centrale */}
            <div className="relative w-full md:w-[50%] max-w-3xl max-h-[80vh] group flex items-center justify-center">
              <img
                src={lightboxImages[lightboxIndex]}
                alt="Lavoro selezionato"
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

            {/* Immagine successiva (sfocata) */}
            <div className="hidden md:block absolute right-12 w-[20%] max-h-[70vh] opacity-50 transition-all duration-300">
              <img
                src={lightboxImages[getLightboxNextIndex()]}
                alt="Immagine successiva"
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
              {lightboxImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === lightboxIndex
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

export default ArtistsPage;
