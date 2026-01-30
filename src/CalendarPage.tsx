import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, ArrowLeft, Check } from 'lucide-react';

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
  { id: 'pendra', name: 'Michele', nickname: 'Pendra', fullName: 'Michele "Pendra" Bini' },
  { id: 'ryu', name: 'Alessandro', nickname: 'Ryu', fullName: 'Alessandro "Ryu" Nisi' },
  { id: 'lillo', name: 'Lorenzo', nickname: 'Lillo', fullName: 'Lorenzo "Lillo" Latini' },
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Artist, 2: Date/Time, 3: Confirm

  // Get week days starting from Monday
  const getWeekDays = (): DaySchedule[] => {
    const days: DaySchedule[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      days.push({
        dayName: DAYS_IT[date.getDay()],
        dayNumber: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isOpen: OPEN_DAYS.includes(date.getDay()),
        date: new Date(date),
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    // Don't go to past weeks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate >= today || newDate.getTime() + 6 * 24 * 60 * 60 * 1000 >= today.getTime()) {
      setCurrentWeekStart(newDate);
    }
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
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

  const handleContinue = () => {
    if (step === 1 && selectedArtist) {
      setStep(2);
    } else if (step === 2 && selectedDate && selectedTime) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const formatDate = (date: Date): string => {
    return `${DAYS_IT[date.getDay()]} ${date.getDate()} ${MONTHS_IT[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getWeekRangeText = (): string => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);

    if (currentWeekStart.getMonth() === endDate.getMonth()) {
      return `${currentWeekStart.getDate()} - ${endDate.getDate()} ${MONTHS_IT[currentWeekStart.getMonth()]} ${currentWeekStart.getFullYear()}`;
    }
    return `${currentWeekStart.getDate()} ${MONTHS_IT[currentWeekStart.getMonth()]} - ${endDate.getDate()} ${MONTHS_IT[endDate.getMonth()]} ${endDate.getFullYear()}`;
  };

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
            onClick={onBack}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Torna indietro"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Prenota Appuntamento</h1>
            <p className="text-sm text-stone-500">Tomoe Tattoo Studio</p>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s
                    ? 'text-white'
                    : 'bg-stone-300 text-stone-500'
                }`}
                style={{ backgroundColor: step >= s ? COLORS.crimson : undefined }}
              >
                {step > s ? <Check size={20} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 md:w-24 h-1 rounded-full transition-all ${
                    step > s ? '' : 'bg-stone-300'
                  }`}
                  style={{ backgroundColor: step > s ? COLORS.crimson : undefined }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Select Artist */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.crimson }} />
              <h2 className="text-2xl font-bold mb-2">Scegli il tuo artista</h2>
              <p className="text-stone-600">Seleziona uno dei nostri tatuatori resident</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {ARTISTS.map((artist) => (
                <button
                  key={artist.id}
                  onClick={() => setSelectedArtist(artist)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedArtist?.id === artist.id
                      ? 'border-current shadow-lg scale-[1.02]'
                      : 'border-transparent hover:border-stone-300'
                  }`}
                  style={{
                    backgroundColor: COLORS.sage,
                    borderColor: selectedArtist?.id === artist.id ? COLORS.crimson : undefined,
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-white"
                    style={{ backgroundColor: COLORS.leather }}
                  >
                    {artist.nickname[0]}
                  </div>
                  <h3 className="font-bold text-lg">{artist.name}</h3>
                  <p className="text-stone-500">"{artist.nickname}"</p>
                  <p className="text-sm text-stone-400 mt-1">{artist.fullName.split(' ').pop()}</p>
                </button>
              ))}
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedArtist}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                selectedArtist ? 'hover:brightness-110' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ backgroundColor: COLORS.crimson }}
            >
              Continua
            </button>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors mb-4"
            >
              <ChevronLeft size={20} />
              Cambia artista
            </button>

            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.crimson }} />
              <h2 className="text-2xl font-bold mb-2">Scegli data e orario</h2>
              <p className="text-stone-600">
                Appuntamento con <span className="font-semibold">{selectedArtist?.fullName}</span>
              </p>
            </div>

            {/* Week Navigation */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: COLORS.sage }}
            >
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousWeek}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                  aria-label="Settimana precedente"
                >
                  <ChevronLeft size={24} />
                </button>
                <h3 className="font-bold text-lg">{getWeekRangeText()}</h3>
                <button
                  onClick={goToNextWeek}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                  aria-label="Settimana successiva"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {weekDays.map((day, index) => {
                  const isPast = isDateInPast(day.date);
                  const isSelected = isDateSelected(day.date);
                  const isDisabled = !day.isOpen || isPast;

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(day)}
                      disabled={isDisabled}
                      className={`p-2 md:p-3 rounded-xl text-center transition-all ${
                        isDisabled
                          ? 'opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'text-white shadow-lg scale-105'
                          : 'hover:bg-stone-200'
                      }`}
                      style={{
                        backgroundColor: isSelected ? COLORS.crimson : undefined,
                      }}
                    >
                      <div className="text-xs font-medium mb-1 truncate">
                        {day.dayName.substring(0, 3)}
                      </div>
                      <div className="text-lg font-bold">{day.dayNumber}</div>
                      {!day.isOpen && (
                        <div className="text-[10px] text-stone-400">Chiuso</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={20} style={{ color: COLORS.crimson }} />
                    <h4 className="font-bold">Orari disponibili - {formatDate(selectedDate)}</h4>
                  </div>

                  {/* Morning Slots */}
                  <div className="mb-4">
                    <p className="text-sm text-stone-500 mb-2">Mattina (10:00 - 13:00)</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {TIME_SLOTS.filter((slot) => {
                        const hour = parseInt(slot.time.split(':')[0]);
                        return hour < 14;
                      }).map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => handleTimeSelect(slot.time)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
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
                    <p className="text-sm text-stone-500 mb-2">Pomeriggio (14:00 - 19:00)</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {TIME_SLOTS.filter((slot) => {
                        const hour = parseInt(slot.time.split(':')[0]);
                        return hour >= 14;
                      }).map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => handleTimeSelect(slot.time)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
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
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedDate || !selectedTime}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                selectedDate && selectedTime ? 'hover:brightness-110' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ backgroundColor: COLORS.crimson }}
            >
              Continua
            </button>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && selectedArtist && selectedDate && selectedTime && (
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors mb-4"
            >
              <ChevronLeft size={20} />
              Modifica data/orario
            </button>

            <div className="text-center mb-8">
              <Check className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.crimson }} />
              <h2 className="text-2xl font-bold mb-2">Conferma prenotazione</h2>
              <p className="text-stone-600">Verifica i dettagli del tuo appuntamento</p>
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
              className="rounded-xl p-4 border"
              style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}
            >
              <p className="text-sm text-amber-800">
                <strong>Nota:</strong> Questa è una consultazione iniziale. La durata effettiva della sessione di tatuaggio verrà discussa durante l'appuntamento.
              </p>
            </div>

            <button
              className="w-full py-4 rounded-xl font-bold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: COLORS.crimson }}
            >
              Conferma Prenotazione
            </button>

            <p className="text-center text-sm text-stone-500">
              Riceverai una conferma via email con tutti i dettagli
            </p>
          </div>
        )}
      </div>

      {/* Opening Hours Info */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div
          className="rounded-xl p-6 text-center"
          style={{ backgroundColor: COLORS.charcoal }}
        >
          <h3 className="text-white font-bold mb-4">Orari di apertura</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-stone-400">Mar - Sab</p>
              <p className="text-white font-medium">10:00 - 13:00</p>
              <p className="text-white font-medium">14:00 - 19:00</p>
            </div>
            <div>
              <p className="text-stone-400">Dom - Lun</p>
              <p className="text-stone-500">Chiuso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
