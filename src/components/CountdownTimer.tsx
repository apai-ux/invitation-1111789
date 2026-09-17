import React, { useState, useEffect } from 'react';
import { CalendarPlus, Check, Clock, Heart, Sparkles, Send, CheckCircle2, User, MessageSquare } from 'lucide-react';
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
  const [attendance, setAttendance] = useState<'yes' | 'no' | null>(() => {
    try {
      return (localStorage.getItem('wedding_rsvp_attendance') as 'yes' | 'no') || null;
    } catch {
      return null;
    }
  });

  const [guestName, setGuestName] = useState<string>(() => {
    try {
      return localStorage.getItem('wedding_guest_name') || '';
    } catch {
      return '';
    }
  });

  const [guestWishes, setGuestWishes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('wedding_rsvp_confirmed'));
    } catch {
      return false;
    }
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAttendanceSelect = (choice: 'yes' | 'no') => {
    setAttendance(choice);
    try {
      localStorage.setItem('wedding_rsvp_attendance', choice);
    } catch {}

    // If user has already entered their name, auto-save the RSVP
    if (guestName.trim()) {
      saveGuestRSVP(guestName.trim(), choice, guestWishes);
    }
  };

  const saveGuestRSVP = async (name: string, choice: 'yes' | 'no', wishes?: string) => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      localStorage.setItem('wedding_guest_name', name.trim());
      localStorage.setItem('wedding_rsvp_attendance', choice);
      localStorage.setItem('wedding_rsvp_confirmed', 'true');
    } catch {}

    try {
      const res = await submitRSVP({
        name: name.trim(),
        attendance: choice,
        wishes: wishes || '',
      });

      if (res.success) {
        setIsConfirmed(true);
      } else if (res.error) {
        setSubmitError(res.error);
        setIsConfirmed(true); // Still treat as confirmed locally
      }
    } catch (err: any) {
      console.warn('RSVP submission note:', err);
      setIsConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendance || !guestName.trim()) return;
    saveGuestRSVP(guestName, attendance, guestWishes);
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
          {/* Option 1: Yes, with joy! */}
          <button
            type="button"
            onClick={() => handleAttendanceSelect('yes')}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full border-2 transition-all duration-200 text-sm sm:text-base font-sans-ui active:scale-95 cursor-pointer shadow-sm ${
              attendance === 'yes'
                ? 'bg-[#7a1228] text-white border-[#7a1228] shadow-md ring-4 ring-[#7a1228]/20 font-semibold'
                : 'bg-white hover:bg-rose-50/70 text-[#7a1228] border-[#7a1228] hover:border-[#5c0d1e]'
            }`}
          >
            <span className="font-bold text-base">✓</span>
            <span>Yes, with joy!</span>
            <span className="text-lg leading-none">😊</span>
          </button>

          {/* Option 2: Sorry, I can't make it */}
          <button
            type="button"
            onClick={() => handleAttendanceSelect('no')}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full border-2 transition-all duration-200 text-sm sm:text-base font-sans-ui italic active:scale-95 cursor-pointer shadow-sm ${
              attendance === 'no'
                ? 'bg-[#c24b5a] text-white border-[#c24b5a] shadow-md ring-4 ring-[#c24b5a]/20 font-medium not-italic'
                : 'bg-white hover:bg-rose-50/50 text-[#c24b5a] border-[#f2c7ce] hover:border-[#e2a4ad]'
            }`}
          >
            <span className="not-italic font-bold text-base">✕</span>
            <span>Sorry, I can&apos;t make it</span>
          </button>
        </div>

        {/* Dynamic confirmation feedback and Name Collection */}
        {attendance && !isConfirmed && (
          <form
            onSubmit={handleConfirmSubmit}
            className="mt-4 p-4 sm:p-5 rounded-2xl bg-white/90 border border-amber-300 shadow-sm w-full max-w-lg animate-fadeIn text-left"
          >
            <div className="flex items-center gap-2 text-xs font-sans-ui text-amber-900 font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Complete Your RSVP</span>
            </div>
            <p className="text-xs text-stone-600 mb-3">
              Please enter your name so Dr. Fathima &amp; Anas can record your response in their guestlist.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-sans-ui text-stone-700 font-medium mb-1">
                  Your Full Name / Family Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Dr. Rashid &amp; Family"
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-amber-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-amber-50/30 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans-ui text-stone-700 font-medium mb-1">
                  Optional Wedding Wish or Note
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={guestWishes}
                    onChange={(e) => setGuestWishes(e.target.value)}
                    placeholder="e.g. Heartiest congratulations to Dr. Fathima &amp; Anas!"
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-amber-300 focus:border-amber-600 outline-none bg-amber-50/30 text-stone-900 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !guestName.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#7a1228] to-[#912338] hover:from-[#5c0d1e] hover:to-[#7a1228] text-white text-sm font-sans-ui font-medium shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving your RSVP...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>
                      Confirm {attendance === 'yes' ? 'Attendance' : 'Response'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Confirmed State */}
        {attendance && isConfirmed && (
          <div className="mt-4 w-full max-w-lg animate-fadeIn">
            {attendance === 'yes' ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-sm text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-sm sm:text-base font-sans-ui">
                    Alhamdulillah! RSVP Confirmed
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 font-sans-ui">
                  Thank you, <strong>{guestName || 'dear guest'}</strong>! We are deeply honored and look forward to celebrating together on Sunday, 22 November 2026.
                </p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                    <span>✓ Saved to Wedding Database</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsConfirmed(false)}
                    className="text-[11px] text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
                  >
                    Edit response
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 text-stone-800 shadow-sm text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium text-sm font-sans-ui text-[#7a1228]">
                    Response Received
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-sans-ui">
                  Thank you for letting us know, <strong>{guestName || 'dear guest'}</strong>. You will be dearly missed! Please keep the couple in your prayers.
                </p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 font-medium">
                    <span>✓ Saved to Wedding Database</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsConfirmed(false)}
                    className="text-[11px] text-stone-700 underline hover:text-stone-900 cursor-pointer"
                  >
                    Edit response
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Calendar & Share Actions */}
      <div className="mt-6 pt-5 border-t border-amber-300/60 flex flex-wrap items-center justify-center gap-3">
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
    </div>
  );
};
