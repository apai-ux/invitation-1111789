/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Calendar,
  Sparkles,
  Heart,
  Compass,
  Navigation,
  ChevronDown,
} from 'lucide-react';
import { Lantern } from './components/Lantern';
import { ArabesqueDivider } from './components/ArabesqueDivider';
import { CountdownTimer } from './components/CountdownTimer';
import { DuaBlessingWall } from './components/DuaBlessingWall';
import { AudioPlayer } from './components/AudioPlayer';

// Generated imagery & QR vector assets
import mapBgImg from './assets/images/map_background_1788368499902.jpg';
import venueQrImg from './assets/venue_qr.svg';

const MAPS_URL = 'https://maps.app.goo.gl/wgw8x8VydkyYuAra8?g_st=aw';

export default function App() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  // Generate random static stars for the night sky sections
  const heroStars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: `${(i * 19.3) % 96}%`,
      left: `${(i * 29.7) % 98}%`,
      size: `${1.5 + ((i * 3) % 3)}px`,
      delay: `${(i * 0.35) % 4}s`,
      duration: `${2.2 + ((i * 0.5) % 2.5)}s`,
    }));
  }, []);

  const locationStars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${(i * 17.1) % 94}%`,
      left: `${(i * 23.3) % 97}%`,
      size: `${1.5 + ((i * 2) % 2.5)}px`,
      delay: `${(i * 0.4) % 3.5}s`,
      duration: `${2.5 + ((i * 0.6) % 2)}s`,
    }));
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(MAPS_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nikah of Dr. Fathima & Anas',
          text: 'You are cordially invited to the Nikah of Dr. Fathima Azis & Anas Kunjumuhammed on 22 Nov 2026. Venue location: ' + MAPS_URL,
          url: window.location.href,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f7f3e8] text-[#2b221a] selection:bg-amber-200 selection:text-stone-900">
      {/* Floating Audio Player throughout the entire website */}
      <AudioPlayer />

      {/* =========================================================================
          SECTION 1: HERO (Nocturnal Midnight & Radiant Gold)
          ========================================================================= */}
      <section
        id="hero"
        className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#070d1d] via-[#0e172e] to-[#16213f] text-[#f7f3e8]"
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

        {/* Crescent Moon & Spiritual Glow */}
        <div className="absolute top-16 sm:top-20 right-6 sm:right-16 lg:right-28 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#fffdf3] via-[#faebbe] to-[#dfba6b] shadow-[0_0_50px_15px_rgba(251,210,110,0.35)] animate-float-gentle z-10 pointer-events-none">
          <div className="absolute top-4 left-3 w-4 h-4 rounded-full bg-amber-600/15" />
          <div className="absolute bottom-5 right-4 w-3 h-3 rounded-full bg-amber-600/10" />
        </div>

        {/* Hanging Arabic Lanterns (Desktop & Mobile Optimized) */}
        <div className="absolute top-0 left-3 sm:left-10 lg:left-24 z-20">
          <Lantern chainLength={110} lanternSize="lg" sway="left" lightIntensity="bright" />
        </div>
        <div className="absolute top-0 right-3 sm:right-10 lg:right-24 z-20">
          <Lantern chainLength={130} lanternSize="md" sway="right" lightIntensity="bright" />
        </div>
        {/* Additional decorative mid-lantern for laptop screens */}
        <div className="hidden xl:block absolute top-0 left-[28%] z-20 opacity-85">
          <Lantern chainLength={85} lanternSize="sm" sway="right" />
        </div>
        <div className="hidden xl:block absolute top-0 right-[28%] z-20 opacity-85">
          <Lantern chainLength={95} lanternSize="sm" sway="left" />
        </div>

        {/* Hero Content Box */}
        <div className="relative z-20 max-w-2xl w-full text-center mt-6 sm:mt-10">
          {/* Bismillah in Amiri Arabic font */}
          <div className="font-arabic text-2xl sm:text-4xl text-[#faebbe] tracking-wide mb-1 leading-relaxed drop-shadow-[0_2px_12px_rgba(250,235,190,0.3)]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <p className="text-xs sm:text-sm text-amber-200/80 italic font-display tracking-wider mb-6">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>

          {/* Invitation Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 text-amber-200 text-xs sm:text-sm font-sans-ui tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>You are lovingly invited to the Nikah of</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          {/* Bride & Groom Grand Calligraphy */}
          <h1 className="font-script text-6xl sm:text-7xl md:text-8xl text-white leading-none my-2 drop-shadow-[0_4px_25px_rgba(250,220,130,0.45)]">
            Fathima &amp; Anas
          </h1>

          <ArabesqueDivider theme="light" symbol="floral" className="my-3" />

          {/* Ceremony Date & Hijri calendar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-amber-200 font-cinzel text-sm sm:text-lg tracking-widest mt-2">
            <span className="font-medium">Sunday · 22nd November 2026</span>
            <span className="hidden sm:inline text-amber-400/60">•</span>
            <span className="font-medium">11:00 AM IST</span>
          </div>
          <div className="text-xs sm:text-sm text-amber-300/80 font-sans-ui mt-1 tracking-wider">
            12 Jamathul Akhir 1447 AH
          </div>

          {/* Action CTAs: Add to Calendar & View Venue Map */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#details"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-sans-ui text-xs sm:text-sm font-semibold tracking-wide shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-stone-900" />
              <span>Ceremony &amp; Countdown</span>
            </a>

            <a
              href="#location"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-amber-400/50 bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 font-sans-ui text-xs sm:text-sm font-medium tracking-wide shadow-md transition-all hover:border-amber-300 active:scale-95 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Venue Directions</span>
            </a>
          </div>
        </div>

        {/* Gentle Downward Scroll Cue */}
        <a
          href="#verse"
          aria-label="Scroll to Holy Verse"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-amber-300/70 hover:text-amber-200 transition-colors text-[11px] font-sans-ui uppercase tracking-widest cursor-pointer"
        >
          <span>Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-amber-400" />
        </a>
      </section>

      {/* =========================================================================
          SECTION 2: HOLY QUR'ANIC VERSE (Ar-Rum 30:21)
          ========================================================================= */}
      <section
        id="verse"
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#fdfaf3] flex items-center justify-center overflow-hidden"
      >
        {/* Subtle geometric watermark */}
        <div className="absolute inset-0 bg-arabesque-pattern pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-3xl w-full">
          <div className="relative p-7 sm:p-12 md:p-14 border border-amber-600/50 bg-gradient-to-b from-[#fffefb]/90 via-[#fffcf6]/95 to-[#fcf5e5]/90 rounded-2xl shadow-xl text-center">
            {/* Ornate Islamic corner brackets */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-600/80" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-600/80" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-600/80" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-600/80" />

            {/* Arabic Bismillah Emblem */}
            <div className="font-arabic text-2xl sm:text-3xl text-[#7a1b2e] mb-1">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="text-xs text-amber-700 italic font-display mb-6">
              In the name of Allah, the Most Gracious, the Most Merciful
            </div>

            {/* Holy Verse in Arabic */}
            <div
              className="font-arabic text-xl sm:text-2xl md:text-3xl text-[#4e101c] leading-relaxed sm:leading-loose mb-6 px-2 sm:px-6 direction-rtl"
              dir="rtl"
            >
              « وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ »
            </div>

            <ArabesqueDivider theme="gold" symbol="star" />

            {/* English Translation */}
            <p className="font-display text-lg sm:text-2xl text-stone-800 italic leading-relaxed max-w-2xl mx-auto mt-4 font-normal">
              "And among His signs is that He created for you spouses from among yourselves, that you may find tranquillity in them; and He placed between you affection and mercy."
            </p>

            <div className="mt-5 text-sm sm:text-base font-cinzel text-[#7a1b2e] tracking-widest font-semibold">
              — Surah Ar-Rum · 30:21 —
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE COUPLE & FAMILIES
          ========================================================================= */}
      <section
        id="couple"
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#efe7d3] via-[#f5eedc] to-[#efe7d3] overflow-hidden"
      >
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Header intro */}
          <div className="inline-block mb-3">
            <span className="text-xs font-sans-ui uppercase tracking-[0.25em] text-[#7a1b2e] font-semibold">
              United in Faith &amp; Love
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#4e101c] font-normal mb-3">
            The Sacred Bond of Nikah
          </h2>
          <p className="text-stone-700 font-display italic text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            With hearts full of gratitude and by the infinite grace of Allah (SWT), two souls and their families are united in holy matrimony.
          </p>

          {/* Responsive Layout: Dual Cards on Laptop/Desktop, Stacked on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
            {/* Bride Card */}
            <div className="md:col-span-5 p-6 sm:p-8 rounded-2xl border border-amber-600/40 bg-gradient-to-b from-white via-[#fdfcf7] to-[#f7f2e5] shadow-lg relative text-center">
              <div className="w-12 h-12 rounded-full border border-amber-500/50 bg-amber-100/50 mx-auto flex items-center justify-center text-amber-700 text-lg mb-3 shadow-inner">
                👰
              </div>
              <div className="text-xs font-sans-ui uppercase tracking-widest text-amber-800 font-semibold mb-1">
                The Bride
              </div>
              <h3 className="font-script text-4xl sm:text-5xl text-[#7a1b2e] leading-tight my-1">
                Dr. Fathima Azis
              </h3>
              <div className="text-sm font-sans-ui text-stone-700 font-medium mt-2">
                D/o Azis NH &amp; Sainaba Azis
              </div>
              <div className="text-xs sm:text-sm text-stone-500 italic mt-3 leading-relaxed">
                Nellikkunnel (H), Vannappuram (P.O)<br />
                Vannappuram, Thodupuzha
              </div>
              {/* Islamic arch accent top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-600 text-amber-50 text-[10px] font-sans-ui tracking-widest uppercase">
                Bride's Family
              </div>
            </div>

            {/* Central Ampersand & Floral Divider */}
            <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
              <div className="font-script text-5xl sm:text-6xl text-amber-700 leading-none drop-shadow-sm">
                &amp;
              </div>
              <div className="w-6 h-6 rounded-full border border-amber-500/60 bg-amber-100 flex items-center justify-center text-amber-800 text-xs mt-1">
                ✦
              </div>
            </div>

            {/* Groom Card */}
            <div className="md:col-span-5 p-6 sm:p-8 rounded-2xl border border-amber-600/40 bg-gradient-to-b from-white via-[#fdfcf7] to-[#f7f2e5] shadow-lg relative text-center">
              <div className="w-12 h-12 rounded-full border border-amber-500/50 bg-amber-100/50 mx-auto flex items-center justify-center text-amber-700 text-lg mb-3 shadow-inner">
                🤵
              </div>
              <div className="text-xs font-sans-ui uppercase tracking-widest text-amber-800 font-semibold mb-1">
                The Groom
              </div>
              <h3 className="font-script text-4xl sm:text-5xl text-[#7a1b2e] leading-tight my-1">
                Anas Kunjumuhammed
              </h3>
              <div className="text-sm font-sans-ui text-stone-700 font-medium mt-2">
                S/o Kunjumuhammed T P &amp; Mymoonath P M
              </div>
              <div className="text-xs sm:text-sm text-stone-500 italic mt-3 leading-relaxed">
                Thandakkala (H), Pattimattom (P.O)<br />
                Pattimattom, Ernakulam
              </div>
              {/* Islamic arch accent top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-600 text-amber-50 text-[10px] font-sans-ui tracking-widest uppercase">
                Groom's Family
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CORDIAL INVITATION & DUA
          ========================================================================= */}
      <section
        id="invite"
        className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#ba7c79] via-[#c68a86] to-[#b37370] text-[#3e1b1e] overflow-hidden"
      >
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="p-8 sm:p-12 rounded-3xl border border-white/60 bg-white/35 backdrop-blur-md shadow-2xl relative">
            <div className="font-arabic text-4xl text-[#52131f] mb-2 leading-none">
              ﷽
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#420f18] font-medium mb-4">
              Cordially Invited
            </h2>
            <p className="font-display text-lg sm:text-xl text-[#391519] leading-relaxed max-w-xl mx-auto">
              We cordially invite you and your family to grace this blessed occasion and celebrate the beginning of their beautiful forever.
            </p>

            <ArabesqueDivider theme="maroon" symbol="floral" className="my-6" />

            {/* Prophet's Wedding Dua */}
            <div className="font-arabic text-xl sm:text-2xl text-[#52131f] leading-relaxed sm:leading-loose direction-rtl mb-2">
              بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
            </div>
            <p className="text-xs sm:text-sm font-sans-ui text-[#4e1b21] italic max-w-lg mx-auto">
              "May Allah bless you, and shower His blessings upon you, and unite you both in goodness."
            </p>

            <p className="mt-6 text-sm sm:text-base text-[#3d161a] italic font-display leading-relaxed">
              Your esteemed presence and heartfelt duas will be a cherished blessing as they embark upon their journey together, In shaa Allah.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CEREMONY DETAILS & REALISTIC COUNTDOWN TIMER
          ========================================================================= */}
      <section
        id="details"
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#fdfaf3] overflow-hidden"
      >
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <span className="text-xs font-sans-ui uppercase tracking-[0.25em] text-[#7a1b2e] font-semibold">
            Programme &amp; Schedule
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#4e101c] font-normal mt-1 mb-2">
            The Nikah Ceremony
          </h2>
          <ArabesqueDivider theme="gold" symbol="star" className="mb-10" />

          {/* Details Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 text-left">
            <div className="p-5 sm:p-6 rounded-2xl border border-amber-400/60 bg-gradient-to-b from-white to-[#fcf6ea] shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-sans-ui uppercase tracking-wider text-amber-800 font-semibold mb-1">
                Ceremony
              </div>
              <div className="font-display text-xl sm:text-2xl font-medium text-[#7a1b2e]">
                Nikah @ 11:00 AM
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Auspicious solemnization of vows followed by celebratory banquet feast
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-amber-400/60 bg-gradient-to-b from-white to-[#fcf6ea] shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-sans-ui uppercase tracking-wider text-amber-800 font-semibold mb-1">
                Gregorian Date
              </div>
              <div className="font-display text-xl sm:text-2xl font-medium text-[#7a1b2e]">
                22 Nov 2026
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Sunday Morning · November 22nd, 2026
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-amber-400/60 bg-gradient-to-b from-white to-[#fcf6ea] shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-sans-ui uppercase tracking-wider text-amber-800 font-semibold mb-1">
                Hijri Calendar
              </div>
              <div className="font-display text-xl sm:text-2xl font-medium text-[#7a1b2e]">
                12 Jamathul Akhir 1447
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Auspicious Islamic lunar calendar date
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-amber-400/60 bg-gradient-to-b from-white to-[#fcf6ea] shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-sans-ui uppercase tracking-wider text-amber-800 font-semibold mb-1">
                Venue Location
              </div>
              <div className="font-display text-xl sm:text-2xl font-medium text-[#7a1b2e]">
                See Venue Below
              </div>
              <a
                href="#location"
                className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium hover:underline mt-2"
              >
                <span>Navigate to Map &amp; QR</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* REALISTIC COUNTDOWN TIMER (BEST PLACE: FEATURED PROMINENTLY) */}
          <CountdownTimer variant="details" className="my-6" />
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: VENUE LOCATION, MAP BACKGROUND & VINTAGE WEDDING CAR
          (Fulfilling user request: "at last location add some map backround and a
           vinatge car best for wedding and also add this link saying scan or click here
           https://maps.app.goo.gl/wgw8x8VydkyYuAra8?g_st=aw Replace this qr there")
          ========================================================================= */}
      <section
        id="location"
        className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 text-amber-100 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(14, 23, 46, 0.94), rgba(7, 13, 29, 0.96)), url(${mapBgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Ambient Twinkling Stars in Location Section */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {locationStars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-[#faebbe] animate-star"
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

        {/* Ambient Lantern in Location Corner */}
        <div className="absolute top-0 right-4 sm:right-16 z-20 pointer-events-none">
          <Lantern chainLength={90} lanternSize="md" sway="right" lightIntensity="bright" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header & Arabic Navigation Greeting */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-amber-400/40 bg-amber-500/10 text-amber-300 text-xs font-sans-ui uppercase tracking-widest mb-3">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '16s' }} />
              <span>Venue Directions &amp; Arrival</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-3">
              Find Your Way to the Celebration
            </h2>
            <p className="text-amber-200/80 font-display italic text-base sm:text-lg max-w-xl mx-auto">
              We look forward to welcoming you with warm hospitality, joyous hearts, and prayers.
            </p>
          </div>

          {/* Main Venue QR Code & Google Maps Integration Centered Showcase */}
          <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="w-full p-8 sm:p-10 rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-[#16213f]/95 via-[#101933]/98 to-[#0b1226]/95 backdrop-blur-md shadow-2xl text-center relative">
              {/* Corner Arabesque accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-sans-ui text-amber-300 font-semibold mb-2">
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Google Maps Directions</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-white font-medium mb-1">
                Navigate to the Venue
              </h3>

              {/* Explicit prompt: "scan or click here" */}
              <div className="my-3 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-sans-ui font-medium inline-block mx-auto">
                Scan with your phone camera or click the code below:
              </div>

              {/* Crisp Clickable QR Code Vector */}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Scan or click QR code to open Google Maps venue location"
                className="group block relative mx-auto my-5 w-56 h-56 sm:w-64 sm:h-64 p-4 rounded-2xl bg-[#fffdf7] border-2 border-amber-400 shadow-xl transition-all duration-300 hover:scale-105 hover:border-amber-300 cursor-pointer"
              >
                <img
                  src={venueQrImg}
                  alt="Google Maps QR Code for Wedding Venue"
                  className="w-full h-full object-contain"
                />
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-[#0e172e]/85 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-amber-300 p-2">
                  <ExternalLink className="w-8 h-8 text-amber-400 animate-pulse" />
                  <span className="text-sm font-sans-ui font-bold text-center">
                    Click to Open in Google Maps
                  </span>
                </div>
              </a>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-sans-ui text-sm font-bold tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-stone-950" />
                  <span>Open in Google Maps</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-amber-400/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 font-sans-ui text-sm font-medium transition-all active:scale-95 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>Copy Venue Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share location with guests"
                  className="p-3.5 rounded-xl border border-amber-400/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 transition-all cursor-pointer"
                  title="Share invitation link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {sharedToast && (
                <div className="mt-3 text-xs text-amber-300 font-sans-ui animate-fadeIn">
                  Invitation link copied to your clipboard!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: DUA & BLESSINGS GUESTBOOK WALL
          ========================================================================= */}
      <section
        id="blessings"
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f7f3e8] via-[#f4ecdb] to-[#efe5cb] overflow-hidden"
      >
        <DuaBlessingWall />
      </section>

      {/* =========================================================================
          SECTION 8: CLOSING GRATITUDE (Jazakumullahu Khairan)
          ========================================================================= */}
      <footer
        id="closing"
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0e172e] via-[#070d1d] to-[#040812] text-amber-100 text-center overflow-hidden"
      >
        {/* Subtle hanging ambient lantern */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10 opacity-75">
          <Lantern chainLength={60} lanternSize="sm" sway="none" lightIntensity="normal" />
        </div>

        <div className="max-w-2xl mx-auto relative z-20 pt-8">
          <div className="font-arabic text-3xl sm:text-5xl text-[#faebbe] mb-2 leading-relaxed">
            جَزَاكُمُ اللَّهُ خَيْرًا
          </div>
          <div className="font-script text-4xl sm:text-5xl text-amber-300 mb-4">
            Jazakumullahu Khairan
          </div>

          <ArabesqueDivider theme="light" symbol="crescent" />

          <p className="font-display text-base sm:text-xl text-amber-200/90 leading-relaxed italic my-4">
            Thank you for being an indispensable part of our lives and our beginning.<br className="hidden sm:inline" />
            We eagerly anticipate welcoming you and your family to celebrate this blessed milestone.
          </p>

          <div className="font-script text-4xl sm:text-5xl text-white my-3">
            Fathima &amp; Anas
          </div>

          <div className="text-xs sm:text-sm font-cinzel text-amber-400 tracking-widest mt-6">
            Sunday · 22 November 2026 · Thodupuzha &amp; Ernakulam
          </div>

          <div className="mt-10 pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 font-sans-ui">
            <div className="flex items-center gap-1.5">
              <span>May Allah bless this union with eternal joy</span>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Google Maps Venue Link</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
