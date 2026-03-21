import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Check, MapPin, Mail, Phone, MessageSquare, ArrowRight, Upload, X, Image as ImageIcon, Send } from 'lucide-react';

// Import artist images
import tattooer1 from './elements/tattooer1.png';
import tattooer2 from './elements/tattooer2.png';
import tattooer3 from './elements/tattooer3.png';

// --- Types & Interfaces ---

interface Artist {
  id: string;
  name: string;
  nickname: string;
  fullName: string;
  specialization: string;
  profileImage: string;
  experience: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

type BookingStep = 'artist' | 'date' | 'time' | 'details' | 'confirmation';

// --- Data & Config ---

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
    specialization: 'American Traditional / Old School',
    profileImage: tattooer1,
    experience: '25+ anni',
  },
  {
    id: 'elena',
    name: 'Elena',
    nickname: 'Luna',
    fullName: 'Elena "Luna" Moretti',
    specialization: 'Fine Line, Dotwork & Geometrico',
    profileImage: tattooer2,
    experience: '6 anni',
  },
  {
    id: 'matteo',
    name: 'Matteo',
    nickname: 'Kroma',
    fullName: 'Matteo "Kroma" Bianchi',
    specialization: 'Neo-Traditional & Realismo',
    profileImage: tattooer3,
    experience: '12 anni',
  },
];

const OPEN_DAYS = [2, 3, 4, 5, 6]; // Tuesday to Saturday

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 10; hour < 13; hour++) {
    slots.push({ time: `${hour}:00`, available: true });
    slots.push({ time: `${hour}:30`, available: true });
  }
  for (let hour = 14; hour < 19; hour++) {
    slots.push({ time: `${hour}:00`, available: true });
    slots.push({ time: `${hour}:30`, available: true });
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();
const DAYS_IT = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

const STEPS: { key: BookingStep; label: string; icon: React.ReactNode }[] = [
  { key: 'artist', label: 'Artista', icon: <User size={16} /> },
  { key: 'date', label: 'Data', icon: <Calendar size={16} /> },
  { key: 'time', label: 'Orario', icon: <Clock size={16} /> },
  { key: 'details', label: 'Dettagli', icon: <MessageSquare size={16} /> },
];

const STEP_ORDER: BookingStep[] = ['artist', 'date', 'time', 'details', 'confirmation'];

// --- Component ---

const CalendarPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('artist');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [contentVisible, setContentVisible] = useState<boolean>(true);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 3 - referenceImages.length);
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setReferenceImages(prev => [...prev, ...newFiles]);
      setImagePreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  // Remove uploaded image
  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);

  const transitionTo = (step: BookingStep) => {
    setContentVisible(false);
    setTimeout(() => {
      setCurrentStep(step);
      setContentVisible(true);
    }, 250);
  };

  // Auto-advance to date after selecting artist
  useEffect(() => {
    if (selectedArtist && currentStep === 'artist') {
      setTimeout(() => transitionTo('date'), 300);
    }
  }, [selectedArtist]);

  // Auto-advance to time after selecting date
  useEffect(() => {
    if (selectedDate && currentStep === 'date') {
      setTimeout(() => transitionTo('time'), 300);
    }
  }, [selectedDate]);

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

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
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
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: ({ dayNumber: number; date: Date; isOpen: boolean } | null)[] = [];

    const startDayOfWeek = firstDay.getDay();
    const emptySlots = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    for (let i = 0; i < emptySlots; i++) days.push(null);

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        dayNumber: day,
        date,
        isOpen: OPEN_DAYS.includes(date.getDay()),
      });
    }
    return days;
  };

  const handleDateSelect = (day: { dayNumber: number; date: Date; isOpen: boolean }) => {
    if (!day.isOpen || isDateInPast(day.date)) return;
    setSelectedDate(day.date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmTime = () => {
    if (selectedTime) transitionTo('details');
  };

  const handleSubmitBooking = () => {
    if (formName && formEmail) transitionTo('confirmation');
  };

  const handleStepClick = (step: BookingStep) => {
    const targetIndex = STEP_ORDER.indexOf(step);
    if (targetIndex < currentStepIndex) {
      // Reset downstream selections
      if (targetIndex <= 0) { setSelectedArtist(null); setSelectedDate(null); setSelectedTime(null); }
      else if (targetIndex <= 1) { setSelectedDate(null); setSelectedTime(null); }
      else if (targetIndex <= 2) { setSelectedTime(null); }
      transitionTo(step);
    }
  };

  const formatDate = (date: Date): string =>
    `${DAYS_IT[date.getDay()]} ${date.getDate()} ${MONTHS_IT[date.getMonth()]}`;

  const canSubmit = formName.trim() && formEmail.trim();

  return (
    <div className="pt-24 pb-12 px-4 md:px-6 min-h-[calc(100vh-200px)]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
            style={{ backgroundColor: `${COLORS.crimson}15`, color: COLORS.crimson }}>
            <Calendar size={14} /> Prenota Online
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ color: COLORS.charcoal }}>
            Prenota il tuo appuntamento
          </h1>
          <p className="text-stone-500 max-w-lg mx-auto">
            Scegli il tuo artista preferito, seleziona data e orario, e raccontaci la tua idea
          </p>
        </div>

        {/* Stepper */}
        {currentStep !== 'confirmation' && (
          <div className="flex items-center justify-center gap-0 mb-10 overflow-x-auto px-2">
            {STEPS.map((step, index) => {
              const stepIndex = STEP_ORDER.indexOf(step.key);
              const isActive = stepIndex === currentStepIndex;
              const isCompleted = stepIndex < currentStepIndex;
              const isClickable = stepIndex < currentStepIndex;

              return (
                <React.Fragment key={step.key}>
                  {index > 0 && (
                    <div
                      className="w-8 md:w-16 h-0.5 mx-1 transition-colors duration-300"
                      style={{ backgroundColor: isCompleted ? COLORS.crimson : '#E5E0DB' }}
                    />
                  )}
                  <button
                    onClick={() => isClickable && handleStepClick(step.key)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      isClickable ? 'cursor-pointer hover:opacity-80' : isActive ? '' : 'cursor-default'
                    }`}
                    style={{
                      backgroundColor: isActive ? COLORS.crimson : isCompleted ? `${COLORS.crimson}15` : '#F0ECE8',
                      color: isActive ? 'white' : isCompleted ? COLORS.crimson : '#A09890',
                    }}
                  >
                    {isCompleted ? <Check size={16} /> : step.icon}
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Content area */}
        <div className={`transition-all duration-250 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>

          {/* STEP 1: Artist Selection */}
          {currentStep === 'artist' && (
            <div>
              <h2 className="text-xl font-bold mb-6 text-center" style={{ color: COLORS.charcoal }}>
                Chi sarà il tuo artista?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {ARTISTS.map((artist) => {
                  const isSelected = selectedArtist?.id === artist.id;
                  return (
                    <button
                      key={artist.id}
                      onClick={() => setSelectedArtist(artist)}
                      className={`relative rounded-2xl overflow-hidden text-left transition-all duration-300 group ${
                        isSelected ? 'scale-[1.02] shadow-xl' : 'hover:shadow-lg hover:scale-[1.01]'
                      }`}
                      style={{
                        backgroundColor: COLORS.sage,
                        outlineColor: isSelected ? COLORS.crimson : undefined,
                        outline: isSelected ? `3px solid ${COLORS.crimson}` : undefined,
                      }}
                    >
                      {/* Artist photo */}
                      <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                        <img
                          src={artist.profileImage}
                          alt={artist.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-lg" style={{ color: COLORS.charcoal }}>
                            {artist.name} <span className="font-normal text-stone-400">"{artist.nickname}"</span>
                          </h3>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.crimson }}>
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-stone-500 mb-2">{artist.specialization}</p>
                        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: `${COLORS.leather}20`, color: COLORS.leather }}>
                          {artist.experience}
                        </span>
                      </div>

                      {/* Selected overlay border */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: `3px solid ${COLORS.crimson}` }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Date Selection */}
          {currentStep === 'date' && (
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Calendar */}
                <div className="flex-1 rounded-2xl p-6" style={{ backgroundColor: COLORS.sage }}>
                  <h2 className="text-lg font-bold mb-5" style={{ color: COLORS.charcoal }}>Seleziona una data</h2>

                  {/* Month nav */}
                  <div className="flex items-center justify-between mb-5">
                    <button onClick={goToPreviousMonth} className="p-2 hover:bg-stone-200 rounded-lg transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <h4 className="font-bold">
                      {MONTHS_IT[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h4>
                    <button onClick={goToNextMonth} className="p-2 hover:bg-stone-200 rounded-lg transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day, i) => (
                      <div key={day} className={`text-center text-xs font-semibold py-2 ${
                        i >= 5 ? 'text-stone-300' : 'text-stone-500'
                      }`}>
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth().map((day, index) => {
                      if (!day) return <div key={`empty-${index}`} className="aspect-square" />;

                      const isPast = isDateInPast(day.date);
                      const isSelected = isDateSelected(day.date);
                      const isDisabled = !day.isOpen || isPast;
                      const isTodayDate = isToday(day.date);
                      const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 1;

                      return (
                        <button
                          key={day.dayNumber}
                          onClick={() => handleDateSelect(day)}
                          disabled={isDisabled}
                          className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all relative ${
                            isDisabled
                              ? 'text-stone-300 cursor-not-allowed'
                              : isSelected
                              ? 'text-white shadow-lg scale-110'
                              : isTodayDate
                              ? 'font-bold'
                              : isWeekend
                              ? 'text-stone-300'
                              : 'hover:bg-stone-200'
                          }`}
                          style={{
                            backgroundColor: isSelected ? COLORS.crimson : isTodayDate && !isDisabled ? `${COLORS.crimson}10` : undefined,
                            color: isTodayDate && !isSelected && !isDisabled ? COLORS.crimson : undefined,
                          }}
                        >
                          {day.dayNumber}
                          {isTodayDate && !isSelected && (
                            <span className="absolute bottom-1 w-1 h-1 rounded-full" style={{ backgroundColor: COLORS.crimson }} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-5 text-xs text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.crimson }} />
                      Oggi
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-stone-200" />
                      Chiuso
                    </div>
                  </div>
                </div>

                {/* Sidebar info */}
                <div className="md:w-56 space-y-4">
                  {/* Selected artist recap */}
                  {selectedArtist && (
                    <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.sage }}>
                      <div className="flex items-center gap-3">
                        <img src={selectedArtist.profileImage} alt={selectedArtist.name}
                          className="w-10 h-10 rounded-full object-cover object-top" />
                        <div>
                          <p className="font-bold text-sm">{selectedArtist.name}</p>
                          <p className="text-xs text-stone-400">"{selectedArtist.nickname}"</p>
                        </div>
                      </div>
                      <button onClick={() => handleStepClick('artist')}
                        className="text-xs mt-3 hover:underline" style={{ color: COLORS.crimson }}>
                        Cambia artista
                      </button>
                    </div>
                  )}

                  {/* Opening hours */}
                  <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.sage }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={16} style={{ color: COLORS.crimson }} />
                      <h3 className="font-bold text-sm">Orari</h3>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Mar - Sab</span>
                        <span className="font-medium">10-13 / 14-19</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Dom - Lun</span>
                        <span className="text-stone-400">Chiuso</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.sage }}>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={16} style={{ color: COLORS.crimson }} />
                      <h3 className="font-bold text-sm">Dove Siamo</h3>
                    </div>
                    <p className="text-xs text-stone-500">
                      Via Example 123<br />Città, Regione
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Time Selection */}
          {currentStep === 'time' && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl p-6" style={{ backgroundColor: COLORS.sage }}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold" style={{ color: COLORS.charcoal }}>Scegli l'orario</h2>
                  <button onClick={() => { setSelectedDate(null); transitionTo('date'); }}
                    className="text-sm flex items-center gap-1 hover:underline" style={{ color: COLORS.crimson }}>
                    <ChevronLeft size={16} /> Cambia data
                  </button>
                </div>

                {selectedDate && selectedArtist && (
                  <p className="text-sm text-stone-500 mb-6">
                    {formatDate(selectedDate)} • {selectedArtist.name} "{selectedArtist.nickname}"
                  </p>
                )}

                {/* Morning */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Mattina</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {TIME_SLOTS.filter(s => parseInt(s.time.split(':')[0]) < 14).map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`py-2.5 px-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === slot.time
                            ? 'text-white shadow-md scale-105'
                            : 'bg-white hover:bg-stone-100 hover:shadow-sm'
                        }`}
                        style={{ backgroundColor: selectedTime === slot.time ? COLORS.crimson : undefined }}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Afternoon */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Pomeriggio</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {TIME_SLOTS.filter(s => parseInt(s.time.split(':')[0]) >= 14).map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`py-2.5 px-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === slot.time
                            ? 'text-white shadow-md scale-105'
                            : 'bg-white hover:bg-stone-100 hover:shadow-sm'
                        }`}
                        style={{ backgroundColor: selectedTime === slot.time ? COLORS.crimson : undefined }}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm */}
                <button
                  onClick={handleConfirmTime}
                  disabled={!selectedTime}
                  className={`w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    selectedTime ? 'hover:brightness-110 shadow-lg' : 'opacity-40 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: COLORS.crimson }}
                >
                  Continua <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Contact Details */}
          {currentStep === 'details' && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: COLORS.sage }}>
                <h2 className="text-lg font-bold mb-1" style={{ color: COLORS.charcoal }}>Raccontaci di te</h2>
                <p className="text-sm text-stone-500 mb-6">Completa i dati per confermare la prenotazione</p>

                {/* Recap bar */}
                {selectedArtist && selectedDate && selectedTime && (
                  <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-white/60 text-xs">
                    <img src={selectedArtist.profileImage} alt="" className="w-6 h-6 rounded-full object-cover object-top" />
                    <span className="font-medium">{selectedArtist.name}</span>
                    <span className="text-stone-300">•</span>
                    <span>{formatDate(selectedDate!)}</span>
                    <span className="text-stone-300">•</span>
                    <span>{selectedTime}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: COLORS.charcoal }}>
                      <User size={14} /> Nome e cognome *
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Mario Rossi"
                      className="w-full p-3 rounded-xl border-2 bg-white transition-colors focus:outline-none"
                      style={{ borderColor: formName ? COLORS.crimson : '#E5E0DB' }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: COLORS.charcoal }}>
                      <Mail size={14} /> Email *
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="mario@example.com"
                      className="w-full p-3 rounded-xl border-2 bg-white transition-colors focus:outline-none"
                      style={{ borderColor: formEmail ? COLORS.crimson : '#E5E0DB' }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: COLORS.charcoal }}>
                      <Phone size={14} /> Telefono
                    </label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+39 333 1234567"
                      className="w-full p-3 rounded-xl border-2 bg-white transition-colors focus:outline-none"
                      style={{ borderColor: formPhone ? COLORS.crimson : '#E5E0DB' }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: COLORS.charcoal }}>
                      <MessageSquare size={14} /> Descrivi la tua idea
                    </label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Descrivi il tatuaggio che desideri: stile, dimensione, posizione sul corpo, riferimenti..."
                      rows={4}
                      className="w-full p-3 rounded-xl border-2 bg-white transition-colors focus:outline-none resize-none"
                      style={{ borderColor: formDescription ? COLORS.crimson : '#E5E0DB' }}
                    />
                  </div>

                  {/* Reference Images Upload */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: COLORS.charcoal }}>
                      <ImageIcon size={14} /> Immagini di riferimento (opzionale)
                    </label>
                    <p className="text-xs text-stone-500 mb-3">Carica fino a 3 immagini di ispirazione per aiutare l'artista a capire il tuo stile</p>

                    <div className="flex flex-wrap gap-3">
                      {/* Preview uploaded images */}
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                          <img src={url} alt={`Riferimento ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      {/* Upload button */}
                      {referenceImages.length < 3 && (
                        <label className="w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-stone-400 transition-colors"
                          style={{ borderColor: '#E5E0DB' }}>
                          <Upload size={20} className="text-stone-400 mb-1" />
                          <span className="text-xs text-stone-400">Aggiungi</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => { setSelectedTime(null); transitionTo('time'); }}
                    className="px-6 py-3 rounded-xl font-medium border-2 transition-all hover:bg-stone-100"
                    style={{ borderColor: '#E5E0DB' }}
                  >
                    <ChevronLeft size={16} className="inline mr-1" /> Indietro
                  </button>
                  <button
                    onClick={handleSubmitBooking}
                    disabled={!canSubmit}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                      canSubmit ? 'hover:brightness-110 shadow-lg' : 'opacity-40 cursor-not-allowed'
                    }`}
                    style={{ backgroundColor: COLORS.crimson }}
                  >
                    Conferma Prenotazione <Check size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation */}
          {currentStep === 'confirmation' && selectedArtist && selectedDate && selectedTime && (
            <div className="max-w-lg mx-auto">
              <div className="rounded-2xl p-8 md:p-10 text-center" style={{ backgroundColor: COLORS.charcoal }}>
                {/* Success icon */}
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: COLORS.crimson }}>
                  <Check size={40} className="text-white" />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Prenotazione completata!</h2>
                <p className="text-stone-400 mb-8">Ecco il riepilogo del tuo appuntamento</p>

                {/* Recap cards */}
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    <img src={selectedArtist.profileImage} alt="" className="w-12 h-12 rounded-full object-cover object-top" />
                    <div>
                      <p className="text-xs text-stone-500">Artista</p>
                      <p className="font-bold text-white">{selectedArtist.fullName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      <Calendar size={16} className="text-stone-500 mb-1.5" />
                      <p className="text-xs text-stone-500">Data</p>
                      <p className="font-bold text-white">{formatDate(selectedDate)}</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      <Clock size={16} className="text-stone-500 mb-1.5" />
                      <p className="text-xs text-stone-500">Orario</p>
                      <p className="font-bold text-white">{selectedTime}</p>
                    </div>
                  </div>

                  {formName && (
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-xs text-stone-500">Prenotato da</p>
                      <p className="font-bold text-white">{formName}</p>
                      <p className="text-sm text-stone-400">{formEmail}</p>
                    </div>
                  )}
                </div>

                {/* Email confirmation */}
                <div className="rounded-xl p-5 mb-6"
                  style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>
                      <Send size={16} className="text-green-400" />
                    </div>
                    <p className="font-bold text-green-400">Email di conferma inviata!</p>
                  </div>
                  <p className="text-sm text-green-300/80 ml-11">
                    Abbiamo inviato i dettagli della prenotazione a <strong>{formEmail}</strong>
                  </p>
                </div>

                {/* Images uploaded notice */}
                {referenceImages.length > 0 && (
                  <div className="rounded-xl p-4 mb-6"
                    style={{ backgroundColor: 'rgba(138, 28, 28, 0.15)', border: '1px solid rgba(138, 28, 28, 0.3)' }}>
                    <div className="flex items-center gap-2">
                      <ImageIcon size={16} style={{ color: COLORS.crimson }} />
                      <p className="text-sm" style={{ color: '#E8B4B4' }}>
                        {referenceImages.length} {referenceImages.length === 1 ? 'immagine allegata' : 'immagini allegate'} alla richiesta
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded-xl p-4"
                  style={{ backgroundColor: 'rgba(254, 243, 199, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <p className="text-sm text-amber-200">
                    <strong>Cosa succede ora?</strong><br />
                    L'artista riceverà la tua richiesta e ti contatterà entro 24h per confermare l'appuntamento e discutere i dettagli del progetto.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
