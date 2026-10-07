/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Calendar,
  Sparkles,
  ChevronDown,
  CalendarPlus,
  Heart,
  Check,
  Navigation,
} from 'lucide-react';
import { Lantern } from './components/Lantern';
import { ArabesqueDivider } from './components/ArabesqueDivider';
import { AudioPlayer } from './components/AudioPlayer';
import { submitRSVP } from './utils/supabaseClient';

const MAPS_URL = 'https://maps.app.goo.gl/wgw8x8VydkyYuAra8?g_st=aw';
const WEDDING_DATE = new Date('2026-11-22T11:00:00');

export default function App() {
  // RSVP State matching exact behavior and anti-spam lock
  const [attendance, setAttendance] = useState<'yes' | 'no' | null>(() => {
    try {
      return (localStorage.getItem('wedding_rsvp_attendance') as 'yes' | 'no') || null;
    } catch {
      return null;
    }
  });
  const [hasClickedInSession, setHasClickedInSession] = useState(false);
  const [copiedCalendar, setCopiedCalendar] = useState(false);

  // Generate random static stars for the Page 1 night sky
  const heroStars = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => ({
      id: i,
      top: `${(i * 19.3) % 96}%`,
      left: `${(i * 29.7) % 98}%`,
      size: `${1.5 + ((i * 3) % 3)}px`,
      delay: `${(i * 0.35) % 4}s`,
      duration: `${2.2 + ((i * 0.5) % 2.5)}s`,
    }));
  }, []);

  const handleAttendanceSelect = async (choice: 'yes' | 'no') => {
    // Anti-spam lock: completely block subsequent clicks once a choice has been made
    if (attendance !== null) return;

    setAttendance(choice);
    setHasClickedInSession(true);
    try {
      localStorage.setItem('wedding_rsvp_attendance', choice);
    } catch {}

    // Immediately record submission and log full server response as required
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

  const handleAddToGoogleCalendar = () => {
    const title = encodeURIComponent('Nikah of Dr. Fathima Azis & Anas Kunjumuhammed');
    const details = encodeURIComponent(
      'With gratitude to Allah (SWT), you are cordially invited to celebrate the Nikah of Dr. Fathima Azis & Anas Kunjumuhammed.\n\nVenue Map: https://maps.app.goo.gl/wgw8x8VydkyYuAra8?g_st=aw'
    );
    const location = encodeURIComponent('Venue Map: https://maps.app.goo.gl/wgw8x8VydkyYuAra8?g_st=aw');
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

  const handleOpenVenueDirections = () => {
    window.open(MAPS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative min-h-screen bg-[#070d1d] text-[#2b221a] selection:bg-amber-200 selection:text-stone-900 overflow-x-hidden">
      {/* Floating Audio Player throughout the entire website (Untouched position & logic) */}
      <AudioPlayer />

      {/* =========================================================================
          PAGE 1 (Screen Height Viewport): Dark Starry Night UI
          ========================================================================= */}
      <section
        id="page-1"
        className="relative h-screen min-h-[640px] max-h-screen w-full flex flex-col items-center justify-between py-6 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#070d1d] via-[#0e172e] to-[#16213f] text-[#f7f3e8] snap-start"
      >
        {/* Twinkling Stars Canvas */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {heroStars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-[#fff8e0] animate-star"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
                animationDuration: star.duration,
              }}
            />
          ))}
        </div>

        {/* Crescent Moon & Spiritual Warm Glow */}
        <div className="absolute top-8 sm:top-12 right-6 sm:right-14 lg:right-24 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#fffdf3] via-[#faebbe] to-[#dfba6b] shadow-[0_0_45px_14px_rgba(251,210,110,0.32)] animate-float-gentle z-10 pointer-events-none">
          <div className="absolute top-3 left-2.5 w-3.5 h-3.5 rounded-full bg-amber-600/15" />
          <div className="absolute bottom-4 right-3.5 w-2.5 h-2.5 rounded-full bg-amber-600/10" />
        </div>

        {/* Hanging Arabic Lanterns */}
        <div className="absolute top-0 left-4 sm:left-12 lg:left-24 z-20">
          <Lantern chainLength={80} lanternSize="md" sway="left" lightIntensity="bright" />
        </div>
        <div className="absolute top-0 right-4 sm:right-12 lg:right-24 z-20">
          <Lantern chainLength={95} lanternSize="sm" sway="right" lightIntensity="bright" />
        </div>
        <div className="hidden md:block absolute top-0 left-[26%] z-20 opacity-75">
          <Lantern chainLength={60} lanternSize="sm" sway="right" />
        </div>
        <div className="hidden md:block absolute top-0 right-[26%] z-20 opacity-75">
          <Lantern chainLength={70} lanternSize="sm" sway="left" />
        </div>

        {/* Subtle Top Spacing spacer */}
        <div className="h-4 sm:h-8" />

        {/* Hero Central Content Box */}
        <div className="relative z-20 max-w-2xl w-full text-center flex flex-col items-center justify-center my-auto px-2">
          {/* Centered Bismillah Text */}
          <div className="font-arabic text-3xl sm:text-5xl md:text-6xl text-[#faebbe] tracking-wide mb-1 leading-relaxed drop-shadow-[0_2px_14px_rgba(250,235,190,0.35)]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <p className="text-xs sm:text-sm text-amber-200/80 italic font-display tracking-wider mb-5">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>

          {/* Invitation Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 text-amber-200 text-xs sm:text-sm font-sans-ui tracking-widest uppercase mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>You are lovingly invited to the Nikah of</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>

          {/* Bride & Groom Grand Highlighting */}
          <h1 className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-none my-1 drop-shadow-[0_4px_30px_rgba(250,220,130,0.5)]">
            Fathima &amp; Anas
          </h1>

          <ArabesqueDivider theme="light" symbol="floral" className="my-2" />

          {/* Date & Time directly below names */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 text-amber-200 font-cinzel text-base sm:text-xl md:text-2xl tracking-widest mt-1">
            <span className="font-semibold text-white drop-shadow-sm">Sunday, 22nd November 2026</span>
            <span className="hidden sm:inline text-amber-400/70 font-bold">•</span>
            <span className="font-medium text-amber-300">11:00 AM IST</span>
          </div>
          <div className="text-xs sm:text-sm text-amber-300/80 font-sans-ui mt-1.5 tracking-widest uppercase">
            12 Jamathul Akhir 1447 AH
          </div>
        </div>

        {/* Clean "Scroll down to RSVP & Venue" indicator at absolute bottom */}
        <a
          href="#page-2"
          aria-label="Scroll down to RSVP & Venue"
          className="relative z-20 mb-4 sm:mb-6 flex flex-col items-center gap-1.5 text-amber-300/85 hover:text-amber-100 transition-colors cursor-pointer group select-none"
        >
          <span className="text-[11px] sm:text-xs font-sans-ui tracking-[0.22em] uppercase font-medium">
            Scroll down to RSVP &amp; Venue
          </span>
          <div className="w-7 h-7 rounded-full border border-amber-400/40 bg-amber-500/10 flex items-center justify-center group-hover:border-amber-300 transition-colors">
            <ChevronDown className="w-4 h-4 animate-bounce text-amber-300" />
          </div>
        </a>
      </section>

      {/* =========================================================================
          PAGE 2 (Screen Height Viewport): Elegant Cream Background UI
          ========================================================================= */}
      <section
        id="page-2"
        className="relative h-screen min-h-[640px] max-h-screen w-full flex flex-col items-center justify-between py-6 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#fdfbf6] via-[#f7f2e5] to-[#eee4cb] text-[#2b221a] snap-start"
      >
        {/* Subtle Ornamental Geometric Background */}
        <div className="absolute inset-0 bg-arabesque-pattern pointer-events-none opacity-20" />

        {/* Top Header Flourish */}
        <div className="relative z-10 text-center pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-sans-ui text-[#7a1b2e] font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Honoring Your Presence</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#4e101c] font-normal">
            The Nikah Celebration
          </h2>
          <div className="text-xs sm:text-sm text-stone-600 font-sans-ui mt-0.5">
            Sunday, 22 November 2026 · 11:00 AM IST
          </div>
        </div>

        {/* RSVP Interactive Questionnaire Block (Upper Center) */}
        <div className="relative z-10 w-full max-w-xl my-auto flex flex-col items-center">
          <div className="w-full rounded-2xl p-6 sm:p-8 border border-amber-500/40 bg-gradient-to-b from-[#fffefc]/95 via-[#fffbf3]/95 to-[#f8f1de]/90 shadow-xl backdrop-blur-md text-center">
            {/* Corner Ornaments */}
            <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-amber-600/70" />
            <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-amber-600/70" />
            <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-amber-600/70" />
            <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-amber-600/70" />

            <h3 className="text-xs sm:text-sm uppercase tracking-[0.25em] font-sans-ui text-[#7a1b2e] font-bold mb-4">
              WILL YOU ATTEND?
            </h3>

            {/* Attendance Choice Buttons with strict anti-spam & lock states */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
              {/* Option 1: Yes, with joy! */}
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

              {/* Option 2: Sorry, I can't make it */}
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

            {/* Thank you confirmation message */}
            {(attendance !== null || hasClickedInSession) && (
              <div className="mt-4 text-center animate-fadeIn">
                <p className="text-xs sm:text-sm font-sans-ui text-[#7a1228] font-semibold tracking-wide">
                  Thank you for your response!
                </p>
              </div>
            )}

            {/* Positioned directly below RSVP buttons: Calendar Utility Buttons */}
            <div className="mt-6 pt-5 border-t border-amber-300/60 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleAddToGoogleCalendar}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#7a1b2e] hover:bg-[#5e1423] text-amber-100 text-xs sm:text-sm font-sans-ui font-medium tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-amber-300" />
                <span>Add to Google Calendar</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadICS}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-amber-600/50 bg-white/80 hover:bg-amber-50 text-[#7a1b2e] text-xs sm:text-sm font-sans-ui font-medium tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
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
        </div>

        {/* Absolute Bottom of Page 2: Primary Styled "Venue Directions" CTA button */}
        <div className="relative z-10 w-full max-w-md pb-4 sm:pb-6 flex flex-col items-center text-center">
          <button
            type="button"
            onClick={handleOpenVenueDirections}
            className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-sans-ui text-sm sm:text-base font-bold tracking-wide shadow-xl shadow-amber-900/15 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer border border-amber-400/80"
          >
            <MapPin className="w-5 h-5 text-stone-950 shrink-0" />
            <span>Venue Directions</span>
            <Navigation className="w-4 h-4 text-stone-900 ml-1 shrink-0" />
          </button>
          <div className="mt-2 text-[11px] sm:text-xs text-stone-500 font-sans-ui">
            Tap to open Google Maps navigation to the wedding hall
          </div>
        </div>
      </section>
    </div>
  );
}

