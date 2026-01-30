import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock, User, ArrowLeft, Check, MapPin } from 'lucide-react';

// --- Types & Interfaces ---

interface Artist {
  id: string;
  name: string;
  nickname: string;
  fullName: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySchedule {
  dayName: string;
  dayNumber: number;
  month: number;
  year: number;
  isOpen: boolean;
  date: Date;
}

// --- Data & Config ---

const COLORS = {
  sage: '#FDFBF7',
  sand: '#D5CAC0',
  leather: '#BBA18B',
  charcoal: '#1F1C18',
  crimson: '#8A1C1C',
};

const ARTISTS: Artist[] = [
  { id: 'artist1', name: 'Nome', nickname: 'Soprannome', fullName: 'Nome "Soprannome" Cognome' },
  { id: 'artist2', name: 'Nome', nickname: 'Soprannome', fullName: 'Nome "Soprannome" Cognome' },
  { id: 'artist3', name: 'Nome', nickname: 'Soprannome', fullName: 'Nome "Soprannome" Cognome' },
];

// Days when studio is open (0 = Sunday, 1 = Monday, etc.)
const OPEN_DAYS = [2, 3, 4, 5, 6]; // Tuesday to Saturday

// Generate 30-minute time slots
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];

  // Morning: 10:00 - 13:00
  for (let hour = 10; hour < 13; hour++) {
    slots.push({ time: `${hour}:00`, available: true });
    slots.push({ time: `${hour}:30`, available: true });
  }

  // Afternoon: 14:00 - 19:00
  for (let hour = 14; hour < 19; hour++) {
    slots.push({ time: `${hour}:00`, available: true });
    slots.push({ time: `${hour}:30`, available: true });
  }

  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const DAYS_IT = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

interface CalendarPageProps {
  onBack: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ onBack }) => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [artistMenuOpen, setArtistMenuOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Get all days in current month
  const getDaysInMonth = (): (DaySchedule | null)[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (DaySchedule | null)[] = [];

    // Add empty slots for days before the first day of month
    const startDayOfWeek = firstDay.getDay();
    const emptySlots = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Monday = 0
    for (let i = 0; i < emptySlots; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        dayName: DAYS_IT[date.getDay()],
        dayNumber: day,
        month: month,
        year: year,
        isOpen: OPEN_DAYS.includes(date.getDay()),
        date: date,
      });
    }

    return days;
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    const today = new Date();
    if (newDate.getFullYear() > today.getFullYear() ||
        (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() >= today.getMonth())) {
      setCurrentMonth(newDate);
    }
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateSelect = (day: DaySchedule) => {
    if (!day.isOpen || isDateInPast(day.date)) return;
    setSelectedDate(day.date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    if (selectedArtist && selectedDate && selectedTime) {
      setShowConfirmation(true);
    }
  };

  const formatDate = (date: Date): string => {
    return `${DAYS_IT[date.getDay()]} ${date.getDate()} ${MONTHS_IT[date.getMonth()]} ${date.getFullYear()}`;
  };

  const canBook = selectedArtist && selectedDate && selectedTime;

  // Confirmation Page
  if (showConfirmation && selectedArtist && selectedDate && selectedTime) {
    return (
      <div
        style={{ backgroundColor: COLORS.sand, color: COLORS.charcoal }}
        className="min-h-screen font-sans"
      >
        {/* Header */}
        <header
          className="sticky top-0 z-50 backdrop-blur-md border-b border-stone-200/50"
          style={{ backgroundColor: 'rgba(253, 251, 247, 0.95)' }}
        >
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => setShowConfirmation(false)}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Torna indietro"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Prenotazione Confermata</h1>
              <p className="text-sm text-stone-500">Tattoo Studio</p>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: COLORS.crimson }}
            >
              <Check size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Prenotazione completata!</h2>
            <p className="text-stone-600">Ecco i dettagli del tuo appuntamento</p>
          </div>

          <div
            className="rounded-2xl p-6 md:p-8 space-y-6"
            style={{ backgroundColor: COLORS.sage }}
          >
            {/* Artist */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: COLORS.leather }}
              >
                {selectedArtist.nickname[0]}
              </div>
              <div>
                <p className="text-sm text-stone-500">Artista</p>
                <p className="font-bold text-lg">{selectedArtist.fullName}</p>
              </div>
            </div>

            <div className="h-px bg-stone-200" />

            {/* Date */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: COLORS.crimson }}
              >
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm text-stone-500">Data</p>
                <p className="font-bold text-lg">{formatDate(selectedDate)}</p>
              </div>
            </div>

            <div className="h-px bg-stone-200" />

            {/* Time */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: COLORS.crimson }}
              >
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm text-stone-500">Orario</p>
                <p className="font-bold text-lg">{selectedTime}</p>
                <p className="text-sm text-stone-400">Durata: 30 minuti</p>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-4 border mt-6"
            style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}
          >
            <p className="text-sm text-amber-800">
              <strong>Nota:</strong> Questa è una consultazione iniziale. La durata effettiva della sessione di tatuaggio verrà discussa durante l'appuntamento.
            </p>
          </div>

          <button
            onClick={onBack}
            className="w-full py-4 rounded-xl font-bold text-white transition-all hover:brightness-110 mt-6"
            style={{ backgroundColor: COLORS.crimson }}
          >
            Torna alla Home
          </button>

          <p className="text-center text-sm text-stone-500 mt-4">
            Riceverai una conferma via email con tutti i dettagli
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: COLORS.sand, color: COLORS.charcoal }}
      className="min-h-screen font-sans"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b border-stone-200/50"
        style={{ backgroundColor: 'rgba(253, 251, 247, 0.95)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Torna indietro"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Prenota Appuntamento</h1>
            <p className="text-sm text-stone-500">Tattoo Studio</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar - Artist Selection & Hours */}
          <div className="space-y-6">
            {/* Artist Dropdown */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: COLORS.sage }}
            >
              <div className="flex items-center gap-3 mb-4">
                <User size={20} style={{ color: COLORS.crimson }} />
                <h3 className="font-bold">Scegli Artista</h3>
              </div>

              <div className="relative">
                <button
                  onClick={() => setArtistMenuOpen(!artistMenuOpen)}
                  className="w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all"
                  style={{
                    backgroundColor: 'white',
                    borderColor: selectedArtist ? COLORS.crimson : COLORS.leather,
                  }}
                >
                  {selectedArtist ? (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: COLORS.leather }}
                      >
                        {selectedArtist.nickname[0]}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{selectedArtist.name}</p>
                        <p className="text-sm text-stone-500">"{selectedArtist.nickname}"</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-stone-400">Seleziona un artista...</span>
                  )}
                  <ChevronDown
                    size={20}
                    className={`text-stone-400 transition-transform ${artistMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {artistMenuOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl border overflow-hidden z-20"
                    style={{ backgroundColor: 'white', borderColor: COLORS.sand }}
                  >
                    {ARTISTS.map((artist) => (
                      <button
                        key={artist.id}
                        onClick={() => {
                          setSelectedArtist(artist);
                          setArtistMenuOpen(false);
                        }}
                        className={`w-full p-4 flex items-center gap-3 hover:bg-stone-50 transition-colors ${
                          selectedArtist?.id === artist.id ? 'bg-stone-100' : ''
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ backgroundColor: COLORS.leather }}
                        >
                          {artist.nickname[0]}
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{artist.fullName}</p>
                        </div>
                        {selectedArtist?.id === artist.id && (
                          <Check size={18} className="ml-auto" style={{ color: COLORS.crimson }} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Opening Hours */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: COLORS.sage }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} style={{ color: COLORS.crimson }} />
                <h3 className="font-bold">Orari di Apertura</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Martedì - Sabato</span>
                  <span className="font-medium">10:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500"></span>
                  <span className="font-medium">14:00 - 19:00</span>
                </div>
                <div className="h-px bg-stone-200 my-2" />
                <div className="flex justify-between">
                  <span className="text-stone-500">Domenica - Lunedì</span>
                  <span className="text-stone-400">Chiuso</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: COLORS.sage }}
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} style={{ color: COLORS.crimson }} />
                <h3 className="font-bold">Dove Siamo</h3>
              </div>
              <p className="text-sm text-stone-600">
                Via Example 123<br />
                Città, Regione
              </p>
            </div>
          </div>

          {/* Main Content - Calendar */}
          <div className="space-y-6">
            {/* Calendar */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: COLORS.sage }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar size={20} style={{ color: COLORS.crimson }} />
                <h3 className="font-bold">Seleziona Data</h3>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                  aria-label="Mese precedente"
                >
                  <ChevronLeft size={24} />
                </button>
                <h4 className="font-bold text-lg">
                  {MONTHS_IT[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h4>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                  aria-label="Mese successivo"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-stone-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const isPast = isDateInPast(day.date);
                  const isSelected = isDateSelected(day.date);
                  const isDisabled = !day.isOpen || isPast;

                  return (
                    <button
                      key={day.dayNumber}
                      onClick={() => handleDateSelect(day)}
                      disabled={isDisabled}
                      className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                        isDisabled
                          ? 'text-stone-300 cursor-not-allowed'
                          : isSelected
                          ? 'text-white shadow-lg'
                          : 'hover:bg-stone-200'
                      }`}
                      style={{
                        backgroundColor: isSelected ? COLORS.crimson : undefined,
                      }}
                    >
                      {day.dayNumber}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots - Show when date is selected */}
            {selectedDate && (
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: COLORS.sage }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={20} style={{ color: COLORS.crimson }} />
                  <h3 className="font-bold">
                    Orari disponibili - {formatDate(selectedDate)}
                  </h3>
                </div>

                {/* Morning Slots */}
                <div className="mb-6">
                  <p className="text-sm text-stone-500 mb-3">Mattina (10:00 - 13:00)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {TIME_SLOTS.filter((slot) => {
                      const hour = parseInt(slot.time.split(':')[0]);
                      return hour < 14;
                    }).map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === slot.time
                            ? 'text-white'
                            : 'bg-white hover:bg-stone-100'
                        }`}
                        style={{
                          backgroundColor: selectedTime === slot.time ? COLORS.crimson : undefined,
                        }}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div>
                  <p className="text-sm text-stone-500 mb-3">Pomeriggio (14:00 - 19:00)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {TIME_SLOTS.filter((slot) => {
                      const hour = parseInt(slot.time.split(':')[0]);
                      return hour >= 14;
                    }).map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === slot.time
                            ? 'text-white'
                            : 'bg-white hover:bg-stone-100'
                        }`}
                        style={{
                          backgroundColor: selectedTime === slot.time ? COLORS.crimson : undefined,
                        }}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Booking Summary & Button */}
            {(selectedArtist || selectedDate || selectedTime) && (
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: COLORS.charcoal }}
              >
                <h3 className="font-bold text-white mb-4">Riepilogo Prenotazione</h3>
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Artista</span>
                    <span className="text-white font-medium">
                      {selectedArtist ? selectedArtist.fullName : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Data</span>
                    <span className="text-white font-medium">
                      {selectedDate ? `${selectedDate.getDate()} ${MONTHS_IT[selectedDate.getMonth()]}` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Orario</span>
                    <span className="text-white font-medium">
                      {selectedTime || '—'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={!canBook}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                    canBook ? 'hover:brightness-110' : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: COLORS.crimson }}
                >
                  Conferma Prenotazione
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
