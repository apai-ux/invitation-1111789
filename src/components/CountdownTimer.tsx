import React, { useState, useEffect } from 'react';
import { CalendarPlus, Check, Clock, Heart, Sparkles } from 'lucide-react';
import { submitRSVP } from '../utils/supabaseClient';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

const WEDDING_DATE = new Date('2026-11-22T11:00:00');

export const CountdownTimer: React.FC<{ className?: string; variant?: 'hero' | 'details' | 'compact' }> = ({
  className = '',
  variant = 'details',
}) => {
  const [attendance, setAttendance] = useState<'yes' | 'no' | null>(null);
  const [hasClickedInSession, setHasClickedInSession] = useState(false);

  const handleAttendanceSelect = async (choice: 'yes' | 'no') => {
    // Anti-spam lock: completely block subsequent clicks once a choice has been made
    if (attendance !== null) return;

    setAttendance(choice);
    setHasClickedInSession(true);
    try {
      localStorage.setItem('wedding_rsvp_attendance', choice);
    } catch {}

    // Immediately record submission and log full server response
    try {
      const res = await submitRSVP({
        attendance: choice,
        name: 'Anonymous RSVP',
      });
      if (!res.success) {
        console.error('RSVP SUBMISSION FAILED:', res.error);
      } else {
        console.log('RSVP SUBMISSION SUCCESS:', res.data);
      }
    } catch (err) {
      console.error('RSVP SUBMISSION EXCEPTION:', err);
    }
  };

  const [copiedCalendar, setCopiedCalendar] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    totalSeconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = WEDDING_DATE.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          totalSeconds: 0,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        totalSeconds: Math.floor(difference / 1000),
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCalendar = () => {
    // Generate Google Calendar Link
    const title = encodeURIComponent('Nikah of Dr. Fathima Azis & Anas Kunjumuhammed');
    const details = encodeURIComponent(
      'With gratitude to Allah (SWT), you are cordially invited to celebrate the Nikah of Dr. Fathima Azis & Anas Kunjumuhammed.\n\nVenue Map: https://maps.app.goo.gl/wgw8x8VydkyYuAra8?g_st=aw'
    );
    const location = encodeURIComponent('Venue Map: https://maps.app.goo.gl/wgw8x8VydkyYuAra8?g_st=aw');
    // 20261122T053000Z to 20261122T093000Z (approx 11:00 AM IST to 3:00 PM IST)
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261122T053000Z/20261122T093000Z&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
    setCopiedCalendar(true);
    setTimeout(() => setCopiedCalendar(false), 3000);
  };

  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nikah Invitation//Fathima & Anas//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:Nikah of Dr. Fathima Azis & Anas Kunjumuhammed',
      'DESCRIPTION:Blessed Nikah ceremony. Venue directions: https://maps.app.goo.gl/wgw8x8VydkyYuAra8?g_st=aw',
      'LOCATION:Venue (Scan/Click: https://maps.app.goo.gl/wgw8x8VydkyYuAra8?g_st=aw)',
      'DTSTART:20261122T053000Z',
      'DTEND:20261122T093000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Nikah-Fathima-and-Anas.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopiedCalendar(true);
    setTimeout(() => setCopiedCalendar(false), 3000);
  };

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days, sub: 'Days Remaining' },
    { label: 'HOURS', value: timeLeft.hours, sub: 'Hours' },
    { label: 'MINUTES', value: timeLeft.minutes, sub: 'Minutes' },
    { label: 'SECONDS', value: timeLeft.seconds, sub: 'Seconds' },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-amber-200 text-xs font-sans-ui ${className}`}>
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="font-semibold tracking-wide">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s to Nikah
        </span>
      </div>
    );
  }

  return (
    <div
      id="ceremony-countdown"
      className={`relative w-full max-w-2xl mx-auto rounded-2xl p-6 sm:p-8 border border-amber-500/40 bg-gradient-to-b from-[#fffcf5]/90 via-[#fcf6e8]/95 to-[#f6eedb]/90 shadow-xl backdrop-blur-md ${className}`}
    >
      {/* Corner ornamental accents */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600/70" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600/70" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600/70" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600/70" />

      {/* Header Tag */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
        <span className="text-xs uppercase tracking-[0.25em] font-sans-ui text-amber-800 font-semibold">
          Count Every Blessed Second
        </span>
        <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
      </div>

      <h3 className="text-center font-display text-2xl sm:text-3xl text-[#591420] font-medium mb-1">
        Countdown to the Sacred Union
      </h3>
      <p className="text-center text-xs sm:text-sm text-stone-600 italic mb-6">
        Sunday, 22 November 2026 · 11:00 AM IST
      </p>

      {/* 4 Realistic Countdown Timer Units */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 my-2">
        {timeUnits.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-amber-300/80 bg-gradient-to-b from-white via-amber-50/40 to-amber-100/30 shadow-md transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Top gold rivet */}
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1.5 left-1/2 -translate-x-1/2" />

            {/* Numeric display with flip effect */}
            <div className="relative font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#7a1b2e] leading-none mb-1 tracking-tight">
              {String(item.value).padStart(2, '0')}
            </div>

            {/* Unit Label */}
            <div className="text-[10px] sm:text-xs font-sans-ui uppercase tracking-wider text-amber-900 font-semibold mt-1">
              {item.label}
            </div>

            {/* Subtle glow border */}
            <div className="absolute inset-0 rounded-xl border border-amber-400/0 group-hover:border-amber-400/40 transition-colors pointer-events-none" />
          </div>
        ))}
      </div>

      {/* =========================================================================
          WILL YOU ATTEND? (Attendance RSVP Options under Countdown)
          ========================================================================= */}
      <div className="mt-7 pt-6 border-t border-amber-300/60 flex flex-col items-center">
        <h4 className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans-ui text-stone-500 font-medium mb-3.5 text-center">
          WILL YOU ATTEND?
        </h4>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-lg">
          {/* Option 1: Yes, with joy! - instantly hides Option 2 when clicked; locked once clicked */}
          {(attendance === null || attendance === 'yes') && (
            <button
              type="button"
              disabled={attendance !== null}
              onClick={() => handleAttendanceSelect('yes')}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full border-2 transition-all duration-200 text-sm sm:text-base font-sans-ui shadow-sm ${
                attendance === 'yes'
                  ? 'bg-[#7a1228] text-white border-[#7a1228] shadow-md ring-4 ring-[#7a1228]/20 font-semibold cursor-default opacity-95 pointer-events-none'
                  : 'bg-white hover:bg-rose-50/70 text-[#7a1228] border-[#7a1228] hover:border-[#5c0d1e] active:scale-95 cursor-pointer'
              }`}
            >
              <span className="font-bold text-base">✓</span>
              <span>Yes, with joy!</span>
              <span className="text-lg leading-none">😊</span>
            </button>
          )}

          {/* Option 2: Sorry, I can't make it - instantly hides Option 1 when clicked; locked once clicked */}
          {(attendance === null || attendance === 'no') && (
            <button
              type="button"
              disabled={attendance !== null}
              onClick={() => handleAttendanceSelect('no')}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full border-2 transition-all duration-200 text-sm sm:text-base font-sans-ui shadow-sm ${
                attendance === 'no'
                  ? 'bg-[#c24b5a] text-white border-[#c24b5a] shadow-md ring-4 ring-[#c24b5a]/20 font-medium not-italic cursor-default opacity-95 pointer-events-none'
                  : 'bg-white hover:bg-rose-50/50 text-[#c24b5a] border-[#f2c7ce] hover:border-[#e2a4ad] italic active:scale-95 cursor-pointer'
              }`}
            >
              <span className="not-italic font-bold text-base">✕</span>
              <span>Sorry, I can&apos;t make it</span>
            </button>
          )}
        </div>

        {/* Simple, elegant confirmation message - strictly only shown AFTER user clicks */}
        {hasClickedInSession && (
          <div className="mt-3.5 text-center animate-fadeIn">
            <p className="text-xs sm:text-sm font-sans-ui text-[#7a1228] font-medium tracking-wide">
              Thank you for your response!
            </p>
          </div>
        )}
      </div>

      {/* Calendar & Share Actions - Shown for guests who say yes (or initially) */}
      {attendance !== 'no' && (
        <div className="mt-6 pt-5 border-t border-amber-300/60 flex flex-wrap items-center justify-center gap-3 animate-fadeIn">
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#7a1b2e] hover:bg-[#5e1423] text-amber-100 text-xs sm:text-sm font-sans-ui font-medium tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-amber-300" />
            <span>Add to Google Calendar</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadICS}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-amber-600/50 bg-white/70 hover:bg-amber-50 text-[#7a1b2e] text-xs sm:text-sm font-sans-ui font-medium tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {copiedCalendar ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Downloaded to Calendar</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 text-[#7a1b2e]" />
                <span>Apple / Outlook (.ics)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
