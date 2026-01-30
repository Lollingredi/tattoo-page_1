import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock, User, Check, MapPin } from 'lucide-react';

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

type WrapperState = 'calendar' | 'timeSlots' | 'confirmation';

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

const CalendarPage: React.FC = () => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [artistMenuOpen, setArtistMenuOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Wrapper state management
  const [wrapperState, setWrapperState] = useState<WrapperState>('calendar');
  const [contentVisible, setContentVisible] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Handle transition to time slots when artist and date are selected
  useEffect(() => {
    if (selectedArtist && selectedDate && wrapperState === 'calendar') {
      // Start transition
      setIsTransitioning(true);
      setContentVisible(false);

      // After content fades out, change wrapper state
      const transitionTimer = setTimeout(() => {
        setWrapperState('timeSlots');
        // Show new content after wrapper resizes
        setTimeout(() => {
          setContentVisible(true);
          setIsTransitioning(false);
        }, 300);
      }, 300);

      return () => clearTimeout(transitionTimer);
    }
  }, [selectedArtist, selectedDate]);

  const handleConfirmBooking = () => {
    if (selectedArtist && selectedDate && selectedTime) {
      // Start transition to confirmation
      setIsTransitioning(true);
      setContentVisible(false);

      // After content fades out, change to confirmation
      setTimeout(() => {
        setWrapperState('confirmation');
        // Show confirmation content
        setTimeout(() => {
          setContentVisible(true);
          setIsTransitioning(false);
        }, 300);
      }, 300);
    }
  };

  const handleBackToCalendar = () => {
    setIsTransitioning(true);
    setContentVisible(false);

    setTimeout(() => {
      setSelectedDate(null);
      setSelectedTime(null);
      setWrapperState('calendar');
      setTimeout(() => {
        setContentVisible(true);
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

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
    if (!day.isOpen || isDateInPast(day.date) || isTransitioning) return;
    setSelectedDate(day.date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const formatDate = (date: Date): string => {
    return `${DAYS_IT[date.getDay()]} ${date.getDate()} ${MONTHS_IT[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatShortDate = (date: Date): string => {
    return `${date.getDate()} ${MONTHS_IT[date.getMonth()]}`;
  };

  const canBook = selectedArtist && selectedDate && selectedTime;

  // Get wrapper styles based on state
  const getWrapperStyles = () => {
    const baseStyles = 'rounded-2xl p-6 transition-all duration-300 ease-out overflow-hidden order-2 md:order-none md:row-span-3';

    switch (wrapperState) {
      case 'calendar':
        return {
          className: baseStyles,
          style: { backgroundColor: COLORS.sage },
        };
      case 'timeSlots':
        return {
          className: baseStyles,
          style: { backgroundColor: COLORS.sage },
        };
      case 'confirmation':
        return {
          className: baseStyles,
          style: { backgroundColor: COLORS.charcoal },
        };
    }
  };

  const wrapperStyles = getWrapperStyles();

  return (
    <div className="pt-24 pb-12 px-6 min-h-[calc(100vh-200px)]">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Prenota Appuntamento</h1>
          <p className="text-stone-600">Scegli l'artista, la data e l'orario per la tua consultazione</p>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-6 md:gap-8">
          {/* Artist Dropdown - Always first */}
          <div
            className="rounded-2xl p-6 order-1 md:order-none"
            style={{ backgroundColor: COLORS.sage }}
          >
            <div className="flex items-center gap-3 mb-4">
              <User size={20} style={{ color: COLORS.crimson }} />
              <h3 className="font-bold">Scegli Artista</h3>
            </div>

            <div className="relative">
              <button
                onClick={() => setArtistMenuOpen(!artistMenuOpen)}
                disabled={wrapperState !== 'calendar'}
                className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                  wrapperState !== 'calendar' ? 'opacity-60 cursor-not-allowed' : ''
                }`}
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
              {artistMenuOpen && wrapperState === 'calendar' && (
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

          {/* Opening Hours - Third on mobile, second on desktop (sidebar) */}
          <div
            className="rounded-2xl p-6 order-3 md:order-none"
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

          {/* Location - Fourth on mobile, third on desktop (sidebar) */}
          <div
            className="rounded-2xl p-6 order-4 md:order-none"
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

          {/* Main Content - Second on mobile, spans full right column on desktop */}
          <div
            className={wrapperStyles.className}
            style={wrapperStyles.style}
          >
            {/* Calendar Content */}
            {wrapperState === 'calendar' && (
              <div
                className={`transition-opacity duration-300 ${
                  contentVisible ? 'opacity-100' : 'opacity-0'
                }`}
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
                        disabled={isDisabled || !selectedArtist}
                        className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                          isDisabled || !selectedArtist
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

                {!selectedArtist && (
                  <p className="text-center text-sm text-stone-400 mt-6">
                    Seleziona prima un artista per scegliere la data
                  </p>
                )}
              </div>
            )}

            {/* Time Slots Content */}
            {wrapperState === 'timeSlots' && (
              <div
                className={`transition-opacity duration-300 ${
                  contentVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Clock size={20} style={{ color: COLORS.crimson }} />
                    <h3 className="font-bold">
                      Orari disponibili
                    </h3>
                  </div>
                  <button
                    onClick={handleBackToCalendar}
                    className="text-sm text-stone-500 hover:text-stone-700 transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Cambia data
                  </button>
                </div>

                {selectedDate && (
                  <p className="text-sm text-stone-600 mb-6">
                    {formatDate(selectedDate)} • {selectedArtist?.fullName}
                  </p>
                )}

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
                <div className="mb-6">
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

                {/* Confirm Button */}
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

            {/* Confirmation Content */}
            {wrapperState === 'confirmation' && selectedArtist && selectedDate && selectedTime && (
              <div
                className={`transition-opacity duration-300 ${
                  contentVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="text-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: COLORS.crimson }}
                  >
                    <Check size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Prenotazione completata!</h3>
                  <p className="text-stone-400">Ecco i dettagli del tuo appuntamento</p>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Artist */}
                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{ backgroundColor: COLORS.leather }}
                    >
                      {selectedArtist.nickname[0]}
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Artista</p>
                      <p className="font-bold text-white">{selectedArtist.fullName}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-stone-400" />
                        <p className="text-xs text-stone-400">Data</p>
                      </div>
                      <p className="font-bold text-white">{formatShortDate(selectedDate)}</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-stone-400" />
                        <p className="text-xs text-stone-400">Orario</p>
                      </div>
                      <p className="font-bold text-white">{selectedTime}</p>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl p-4 mb-6"
                  style={{ backgroundColor: 'rgba(254, 243, 199, 0.2)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                >
                  <p className="text-sm text-amber-200">
                    <strong>Nota:</strong> Questa è una consultazione iniziale di 30 minuti.
                  </p>
                </div>

                <p className="text-center text-sm text-stone-400">
                  Riceverai una conferma via email con tutti i dettagli
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
