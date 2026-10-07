/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  Sparkles,
  Heart,
} from 'lucide-react';
import { ArabesqueDivider } from './components/ArabesqueDivider';
import { CountdownTimer } from './components/CountdownTimer';
import { AudioPlayer } from './components/AudioPlayer';

export default function App() {
  // Generate random static stars for the Arabic night sky
  const heroStars = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      top: `${(i * 19.3) % 96}%`,
      left: `${(i * 29.7) % 98}%`,
      size: `${1.5 + ((i * 3) % 3)}px`,
      delay: `${(i * 0.35) % 4}s`,
      duration: `${2.2 + ((i * 0.5) % 2.5)}s`,
    }));
  }, []);

  return (
    <div className="relative min-h-screen bg-[#faf5ea] text-[#2b221a] selection:bg-amber-200 selection:text-stone-900">
      {/* Floating Audio Player throughout the entire invitation */}
      <AudioPlayer />

      {/* =========================================================================
          PAGE 1: THE SACRED INVITATION, COUPLE & PROGRAMME (ARABIC RED THEME)
          ========================================================================= */}
      <section
        id="hero"
        className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#3a060f] via-[#520916] to-[#6a0d20] text-[#fff7e6]"
      >
        {/* Subtle geometric & star background texture */}
        <div className="absolute inset-0 bg-stars-pattern pointer-events-none opacity-25" />

        {/* Twinkling Stars Canvas */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {heroStars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-[#fff4cc] animate-star"
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

        {/* Radiant Celestial Moon with Warm Golden Halos (Preserved in Upper Sky) */}
        <div className="absolute top-8 sm:top-12 right-6 sm:right-14 lg:right-24 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#fffdf3] via-[#faebbe] to-[#dfba6b] shadow-[0_0_60px_20px_rgba(251,210,110,0.38)] animate-float-gentle z-10 pointer-events-none">
          <div className="absolute top-4 left-3 w-4 h-4 rounded-full bg-amber-950/15" />
          <div className="absolute bottom-5 right-4 w-3 h-3 rounded-full bg-amber-950/10" />
        </div>

        {/* Main Arabic Red Card Container */}
        <div className="relative z-20 max-w-4xl w-full text-center my-auto">
          {/* Bismillah in Classical Arabic Calligraphy */}
          <div className="font-arabic text-2xl sm:text-4xl text-[#faebbe] tracking-wide mb-1 leading-relaxed drop-shadow-[0_2px_14px_rgba(250,235,190,0.35)]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <p className="text-xs sm:text-sm text-amber-200/80 italic font-display tracking-wider mb-4">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>

          {/* Invitation Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 text-amber-200 text-xs sm:text-sm font-sans-ui tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>You are lovingly invited to the Nikah of</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          {/* Bride & Groom with Parental Details (Arabic Red Theme Presentation) */}
          <div className="w-full max-w-3xl mx-auto my-2">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 sm:gap-6 items-center">
              {/* Bride Card */}
              <div className="md:col-span-5 p-5 sm:p-7 rounded-2xl border border-amber-400/40 bg-gradient-to-b from-[#480814]/85 via-[#3d0610]/90 to-[#30040c]/95 shadow-2xl backdrop-blur-md text-center relative group">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[10px] sm:text-xs font-sans-ui uppercase tracking-widest font-semibold mb-2">
                  <span>The Bride</span>
                </div>
                <h2 className="font-script text-4xl sm:text-5xl lg:text-6xl text-[#fff5d6] leading-tight my-1 drop-shadow-[0_2px_18px_rgba(250,225,140,0.35)]">
                  Dr. Fathima Azis
                </h2>
                <div className="text-sm sm:text-base font-sans-ui text-amber-100 font-medium mt-2">
                  D/o Azis NH &amp; Sainaba Azis
                </div>
                <div className="text-xs sm:text-sm text-amber-200/80 italic mt-2 leading-relaxed">
                  Nellikkunnel (H), Vannappuram (P.O)<br />
                  Vannappuram, Thodupuzha
                </div>
              </div>

              {/* Central Ampersand & Arabic Star */}
              <div className="md:col-span-1 flex flex-col items-center justify-center my-1 md:my-0">
                <div className="font-script text-5xl sm:text-6xl text-amber-300 leading-none drop-shadow-md">
                  &amp;
                </div>
                <div className="w-6 h-6 rounded-full border border-amber-400/50 bg-amber-500/25 flex items-center justify-center text-amber-300 text-xs mt-1">
                  ✦
                </div>
              </div>

              {/* Groom Card */}
              <div className="md:col-span-5 p-5 sm:p-7 rounded-2xl border border-amber-400/40 bg-gradient-to-b from-[#480814]/85 via-[#3d0610]/90 to-[#30040c]/95 shadow-2xl backdrop-blur-md text-center relative group">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[10px] sm:text-xs font-sans-ui uppercase tracking-widest font-semibold mb-2">
                  <span>The Groom</span>
                </div>
                <h2 className="font-script text-4xl sm:text-5xl lg:text-6xl text-[#fff5d6] leading-tight my-1 drop-shadow-[0_2px_18px_rgba(250,225,140,0.35)]">
                  Anas Kunjumuhammed
                </h2>
                <div className="text-sm sm:text-base font-sans-ui text-amber-100 font-medium mt-2">
                  S/o Kunjumuhammed T P &amp; Mymoonath P M
                </div>
                <div className="text-xs sm:text-sm text-amber-200/80 italic mt-2 leading-relaxed">
                  Thandakkala (H), Pattimattom (P.O)<br />
                  Pattimattom, Ernakulam
                </div>
              </div>
            </div>
          </div>

          <ArabesqueDivider theme="light" symbol="floral" className="my-5 opacity-75" />

          {/* =========================================================================
              PROGRAMME & SCHEDULE (Under the Names of Bride and Groom on First Page)
              ========================================================================= */}
          <div className="mt-4 mb-2 text-center">
            <div className="text-xs font-sans-ui uppercase tracking-[0.25em] text-amber-300 font-bold mb-1">
              PROGRAMME &amp; SCHEDULE
            </div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#fff5d6] font-normal mb-2 drop-shadow-sm">
              The Nikah Ceremony
            </h3>

            <div className="flex items-center justify-center gap-2 text-amber-300 my-2">
              <span className="text-xs">•</span>
              <div className="w-5 h-5 rounded-full border border-amber-400/60 bg-amber-500/20 flex items-center justify-center text-amber-300 text-xs shadow-inner">
                ✦
              </div>
              <span className="text-xs">•</span>
            </div>

            {/* 3 Schedule Cards on the Red Theme First Page */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 mt-5 text-left">
              {/* Card 1: CEREMONY */}
              <div className="p-4 sm:p-5 rounded-2xl border border-amber-400/40 bg-gradient-to-b from-[#480814]/85 via-[#3d0610]/90 to-[#30040c]/95 shadow-xl backdrop-blur-md">
                <div className="text-[10px] sm:text-xs font-sans-ui uppercase tracking-widest text-amber-300 font-semibold mb-1">
                  CEREMONY
                </div>
                <h4 className="font-display text-lg sm:text-xl text-[#fff5d6] font-semibold my-1">
                  Nikah @ 11:00 AM
                </h4>
                <p className="text-xs text-amber-100/75 italic mt-1.5 leading-relaxed">
                  Auspicious solemnization of vows followed by celebratory banquet feast
                </p>
              </div>

              {/* Card 2: GREGORIAN DATE */}
              <div className="p-4 sm:p-5 rounded-2xl border border-amber-400/40 bg-gradient-to-b from-[#480814]/85 via-[#3d0610]/90 to-[#30040c]/95 shadow-xl backdrop-blur-md">
                <div className="text-[10px] sm:text-xs font-sans-ui uppercase tracking-widest text-amber-300 font-semibold mb-1">
                  GREGORIAN DATE
                </div>
                <h4 className="font-display text-lg sm:text-xl text-[#fff5d6] font-semibold my-1">
                  22 Nov 2026
                </h4>
                <p className="text-xs text-amber-100/75 italic mt-1.5 leading-relaxed">
                  Sunday Morning · November 22nd, 2026
                </p>
              </div>

              {/* Card 3: HIJRI CALENDAR */}
              <div className="p-4 sm:p-5 rounded-2xl border border-amber-400/40 bg-gradient-to-b from-[#480814]/85 via-[#3d0610]/90 to-[#30040c]/95 shadow-xl backdrop-blur-md">
                <div className="text-[10px] sm:text-xs font-sans-ui uppercase tracking-widest text-amber-300 font-semibold mb-1">
                  HIJRI CALENDAR
                </div>
                <h4 className="font-display text-lg sm:text-xl text-[#fff5d6] font-semibold my-1">
                  12 Jamathul Akhir 1447
                </h4>
                <p className="text-xs text-amber-100/75 italic mt-1.5 leading-relaxed">
                  Auspicious Islamic lunar calendar date
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PAGE 2: COUNTDOWN, ATTENDANCE RSVP & BEST REGARDS (CREAM THEME)
          ========================================================================= */}
      <section
        id="countdown"
        className="relative min-h-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fdf8ee] via-[#f7efe0] to-[#f2e5ce] text-[#2b221a] flex flex-col justify-center items-center overflow-hidden"
      >
        {/* Subtle decorative background watermark */}
        <div className="absolute inset-0 bg-arabesque-pattern pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-3xl w-full mx-auto my-auto">
          {/* Ceremony Countdown Card with Yes/No RSVP & Venue Google Maps Button */}
          <div className="mb-6">
            <CountdownTimer variant="details" />
          </div>

          {/* =========================================================================
              BEST REGARDS & THANK YOU (COMPACT & DIRECTLY BELOW THE COUNTDOWN)
              ========================================================================= */}
          <div className="w-full max-w-xl mx-auto mt-6 pt-5 text-center">
            <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans-ui text-stone-500 font-semibold mb-1">
              Best regards from
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-[#5e0d1b] font-bold tracking-tight my-1">
              Samsam Azis, Sabins Azis &amp; Family
            </h3>
            
            <p className="font-script text-3xl sm:text-4xl text-amber-800 my-2">
              Thank you
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 font-sans-ui mt-3 pt-3 border-t border-amber-300/40 max-w-xs mx-auto">
              <span>Sunday · 22 November 2026</span>
              <span>•</span>
              <Heart className="w-3.5 h-3.5 text-[#7a1228] fill-[#7a1228]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
