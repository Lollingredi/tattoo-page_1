# Tattoo Studio - Sito Web

Sito web moderno per uno studio di tatuaggi, costruito con React e TypeScript.

## Stack Tecnologico

| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| React | 19.2.0 | UI Library |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.2.4 | Build Tool & Dev Server |
| Tailwind CSS | 4.1.18 | Styling |
| Lucide React | 0.563.0 | Icone |

## Struttura del Progetto

```
src/
├── App.tsx           # Componente principale (Home, Hero, Gallery, Footer)
├── CalendarPage.tsx  # Sistema di prenotazione appuntamenti
├── ArtistsPage.tsx   # Pagina profili artisti con galleria lavori
├── elements/         # Immagini studio e portfolio
└── assets/           # Asset statici
```

## Funzionalità Principali

### Homepage
- **Hero Section** con slider immagini studio interattivo
- **Animazione Morph/Scale** per transizioni fluide tra immagini
- **Galleria Portfolio** con lightbox e supporto swipe mobile
- **Sezione Contatti** con CTA per prenotazioni

### Sistema di Navigazione
- Routing client-side con `pushState` (no dipendenze esterne)
- URL semantici: `/`, `/prenota`, `/artisti`
- Supporto navigazione browser back/forward

### Animazioni Studio Slider (Desktop)
- Effetto parallasse su hover del mouse
- Anteprime laterali che seguono il movimento del cursore
- Transizione Morph: l'anteprima si espande fluidamente fino a diventare l'immagine principale
- Curve di animazione `cubic-bezier` per movimenti naturali

### Mobile
- Layout responsive con breakpoint `md:` (768px)
- Scroll snap orizzontale per gallerie
- Indicatori touch-friendly
- Tap-to-zoom per immagini portfolio

## Palette Colori

```typescript
const COLORS = {
  sage: '#FDFBF7',      // Bianco Panna (Sfondo Hero)
  sand: '#D5CAC0',      // Sabbia/Grigio (Sfondo Pagina)
  leather: '#BBA18B',   // Marrone (Dettagli)
  charcoal: '#1F1C18',  // Nero caldo (Testi)
  crimson: '#8A1C1C',   // Rosso scuro (Accenti/CTA)
};
```

## Comandi

```bash
# Installazione dipendenze
npm install

# Avvio development server
npm run dev

# Build produzione
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

## Requisiti

- Node.js 18+
- npm 9+

## Note Tecniche

- **SWC** utilizzato per Fast Refresh (più veloce di Babel)
- **ESLint** configurato con regole TypeScript e React Hooks
- **PostCSS** con Autoprefixer per compatibilità browser
- Nessuna dipendenza di routing esterna (vanilla JS)
- Immagini importate come moduli ES per ottimizzazione Vite
