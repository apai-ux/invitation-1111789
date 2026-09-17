import React, { useState, useEffect } from 'react';
import { Heart, Send, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { submitRSVP, fetchAllRSVPs } from '../utils/supabaseClient';

interface Blessing {
  id: string;
  name: string;
  relation: string;
  dua: string;
  arabic?: string;
  time: string;
  attendance?: string;
}

const INITIAL_BLESSINGS: Blessing[] = [
  {
    id: '1',
    name: 'Family & Well-wishers',
    relation: 'Family',
    arabic: 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    dua: 'May Allah bless you both, shower His divine blessings upon you, and unite you both in goodness and everlasting harmony.',
    time: 'Moments ago',
  },
  {
    id: '2',
    name: 'Uncle & Aunt',
    relation: 'Elders',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
    dua: 'Heartfelt congratulations to dearest Fathima & Anas! May your union be filled with serenity, love, and immense barakah.',
    time: 'Today',
  },
  {
    id: '3',
    name: 'College Friends',
    relation: 'Friends',
    arabic: 'مَا شَاءَ اللَّهُ تَبَارَكَ اللَّهُ',
    dua: 'Wishing you a joyful journey filled with countless smiles, laughter, and companionship for this world and the hereafter!',
    time: 'Today',
  },
];

const PRESET_DUAS = [
  'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ (May Allah unite you in goodness)',
  'May Allah grant you both a lifetime of peace, mutual affection, and barakah.',
  'May your home be radiant with love, mercy, and endless joy.',
  'Congratulations Dr. Fathima & Anas! Heartiest congratulations and duas from our family.',
];

export const DuaBlessingWall: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [blessings, setBlessings] = useState<Blessing[]>(INITIAL_BLESSINGS);
  const [guestName, setGuestName] = useState(() => {
    try {
      return localStorage.getItem('wedding_guest_name') || '';
    } catch {
      return '';
    }
  });
  const [guestRelation, setGuestRelation] = useState('Friend');
  const [attendanceChoice, setAttendanceChoice] = useState<'yes' | 'no'>(() => {
    try {
      return (localStorage.getItem('wedding_rsvp_attendance') as 'yes' | 'no') || 'yes';
    } catch {
      return 'yes';
    }
  });
  const [selectedDua, setSelectedDua] = useState(PRESET_DUAS[0]);
  const [customDua, setCustomDua] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

  // Fetch live wishes from Supabase on mount
  useEffect(() => {
    loadLiveWishes();
  }, []);

  const loadLiveWishes = async () => {
    setIsLoadingLive(true);
    try {
      const res = await fetchAllRSVPs();
      const recordsWithWishes = res.records.filter((r) => r.wishes && r.wishes.trim().length > 0);
      if (recordsWithWishes.length > 0) {
        const mapped: Blessing[] = recordsWithWishes.map((r, i) => ({
          id: r.id || `live-${i}`,
          name: r.name,
          relation: r.relation || 'Guest',
          dua: r.wishes || '',
          attendance: r.attendance,
          time: r.created_at
            ? new Date(r.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })
            : 'Recently',
        }));
        // Merge live wishes with initial ones to keep it lively
        setBlessings([...mapped, ...INITIAL_BLESSINGS]);
      }
    } catch (err) {
      console.warn('Error loading live blessings:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const message = customDua.trim() ? customDua.trim() : selectedDua;
    setIsSubmitting(true);

    try {
      localStorage.setItem('wedding_guest_name', guestName.trim());
      localStorage.setItem('wedding_rsvp_attendance', attendanceChoice);
      localStorage.setItem('wedding_rsvp_confirmed', 'true');
    } catch {}

    const newBlessing: Blessing = {
      id: Date.now().toString(),
      name: guestName.trim(),
      relation: guestRelation,
      dua: message,
      attendance: attendanceChoice,
      time: 'Just now',
    };

    setBlessings([newBlessing, ...blessings]);

    // Save to Supabase
    try {
      await submitRSVP({
        name: guestName.trim(),
        relation: guestRelation,
        attendance: attendanceChoice,
        wishes: message,
      });
    } catch (err) {
      console.warn('RSVP submission note:', err);
    } finally {
      setIsSubmitting(false);
      setCustomDua('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div
      id="blessings-wall"
      className={`w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 border border-amber-400/40 bg-gradient-to-b from-[#fffef9]/95 via-[#fcf6e8]/90 to-[#f6eedb]/95 shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="text-center mb-8">
        <div className="text-2xl sm:text-3xl font-arabic text-[#7a1b2e] mb-1">
          دَعَوَاتٌ مُبَارَكَةٌ
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-[#4e101c] font-medium">
          Dua &amp; Blessings Guestbook
        </h3>
        <p className="text-sm text-stone-600 italic mt-1 max-w-lg mx-auto">
          Leave your heartfelt prayers and congratulations for Dr. Fathima &amp; Anas as they begin their sacred journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 p-5 rounded-2xl border border-amber-300/80 bg-white/80 shadow-sm flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 text-xs font-sans-ui text-amber-900 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Send Your Dua
          </div>

          <div>
            <label className="block text-xs font-sans-ui text-stone-700 font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Farhan &amp; Family"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-amber-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-amber-50/30 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-sans-ui text-stone-700 font-medium mb-1">
              Relation / Group
            </label>
            <select
              value={guestRelation}
              onChange={(e) => setGuestRelation(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-amber-300 focus:border-amber-600 outline-none bg-amber-50/30 text-stone-800"
            >
              <option value="Family">Family Member</option>
              <option value="Relative">Relative</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague / Peer</option>
              <option value="Well-wisher">Well-wisher</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-sans-ui text-stone-700 font-medium mb-1">
              Will you be attending?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttendanceChoice('yes')}
                className={`py-1.5 px-2 rounded-lg text-xs font-sans-ui border transition-all cursor-pointer text-center ${
                  attendanceChoice === 'yes'
                    ? 'bg-[#7a1228] text-white border-[#7a1228] font-medium'
                    : 'bg-amber-50/40 text-stone-700 border-amber-300 hover:bg-amber-100/50'
                }`}
              >
                ✓ Attending with joy
              </button>
              <button
                type="button"
                onClick={() => setAttendanceChoice('no')}
                className={`py-1.5 px-2 rounded-lg text-xs font-sans-ui border transition-all cursor-pointer text-center ${
                  attendanceChoice === 'no'
                    ? 'bg-[#c24b5a] text-white border-[#c24b5a] font-medium'
                    : 'bg-amber-50/40 text-stone-700 border-amber-300 hover:bg-amber-100/50'
                }`}
              >
                ✕ Wishing from afar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans-ui text-stone-700 font-medium mb-1">
              Select or Type Dua
            </label>
            <select
              value={selectedDua}
              onChange={(e) => setSelectedDua(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-amber-300 focus:border-amber-600 outline-none bg-amber-50/30 text-stone-800 mb-2"
            >
              {PRESET_DUAS.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <textarea
              rows={2}
              value={customDua}
              onChange={(e) => setCustomDua(e.target.value)}
              placeholder="Or write a personal prayer or wish..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-amber-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-amber-50/30 text-stone-900 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !guestName.trim()}
            className="mt-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7a1b2e] to-[#912338] hover:from-[#5e1423] hover:to-[#7a1b2e] text-amber-100 text-sm font-sans-ui font-medium transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving your prayer...</span>
            ) : (
              <>
                <Send className="w-4 h-4 text-amber-300" />
                <span>Send Blessing to the Couple</span>
              </>
            )}
          </button>

          {submitted && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-sans-ui animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Jazakallahu Khair! Your prayer has been lovingly recorded.</span>
            </div>
          )}
        </form>

        {/* Blessings List Column */}
        <div className="lg:col-span-7 flex flex-col gap-3.5 max-h-[380px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-1 text-xs text-stone-500 font-sans-ui border-b border-amber-200/60">
            <span>Recent Guestbook Blessings ({blessings.length})</span>
            <button
              type="button"
              onClick={loadLiveWishes}
              disabled={isLoadingLive}
              className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 cursor-pointer"
              title="Refresh blessings"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingLive ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {blessings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-amber-200/90 bg-white/70 shadow-sm relative hover:bg-white/95 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display font-medium text-base text-[#7a1b2e]">
                    {b.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-sans-ui">
                    {b.relation}
                  </span>
                  {b.attendance === 'yes' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-sans-ui font-medium">
                      ✓ Attending
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-stone-400 font-sans-ui">{b.time}</span>
              </div>

              {b.arabic && (
                <div className="font-arabic text-sm text-amber-900 direction-rtl text-right my-1">
                  {b.arabic}
                </div>
              )}

              <p className="text-xs sm:text-sm text-stone-700 italic font-display leading-relaxed">
                "{b.dua}"
              </p>

              <div className="absolute top-2 right-2 opacity-20">
                <Heart className="w-4 h-4 text-[#7a1b2e]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
