import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userPausedRef = useRef<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.65;
    // Always default to playing music on every website load or reload
    userPausedRef.current = false;

    const startPlay = () => {
      if (userPausedRef.current) return;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked by browser policy until user interacts with the page
          });
      }
    };

    // Attempt playback immediately when the component mounts
    startPlay();

    // In case the browser enforces user interaction before playing audio,
    // immediately start playback on the first touch, click, scroll or keypress
    const handleFirstInteraction = () => {
      if (!userPausedRef.current) {
        const promise = audio.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              setIsPlaying(true);
              removeListeners();
            })
            .catch(() => {});
        }
      }
    };

    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown', 'wheel'];

    const addListeners = () => {
      events.forEach((evt) => {
        window.addEventListener(evt, handleFirstInteraction, { passive: true, capture: true });
      });
    };

    const removeListeners = () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleFirstInteraction, { capture: true });
      });
    };

    addListeners();

    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      if (userPausedRef.current) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Auto-hide the initial song badge tooltip after 5 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => {
      removeListeners();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      clearTimeout(tooltipTimer);
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      // User explicitly paused: stop playback and do not restart on scroll/clicks
      userPausedRef.current = true;
      audio.pause();
      setIsPlaying(false);
    } else {
      // User explicitly resumed
      userPausedRef.current = false;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
        });
    }
  };

  return (
    <>
      {/* Hidden audio element pointing to the wedding nasheed with autoplay hints */}
      <audio
        ref={audioRef}
        src="/aroosat_al_noor.mp3"
        loop
        preload="auto"
        autoPlay
        playsInline
      />

      {/* Floating sound control button at top corner */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50 flex items-center gap-2">
        {/* Subtle Song Pill Tooltip */}
        {showTooltip && (
          <div
            onClick={() => setShowTooltip(false)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e172e]/90 backdrop-blur-md border border-amber-400/40 text-amber-200 text-xs font-sans-ui shadow-lg transition-all animate-fadeIn"
          >
            <Music className="w-3 h-3 text-amber-400" />
            <span className="font-arabic font-medium">عروسة النور</span>
            <span className="text-amber-400/60">·</span>
            <span className="text-[11px] text-stone-300">Wedding Music</span>
          </div>
        )}

        {/* Small Sound Icon Button */}
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
          title={isPlaying ? 'Pause background music (عروسة النور)' : 'Play background music (عروسة النور)'}
          className={`relative group p-2.5 sm:p-3 rounded-full border backdrop-blur-md shadow-xl transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center ${
            isPlaying
              ? 'bg-[#0e172e]/90 hover:bg-[#16213f] border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-amber-500/20'
              : 'bg-[#0e172e]/80 hover:bg-[#16213f] border-stone-500/50 text-stone-400 shadow-stone-900/30'
          }`}
        >
          {/* Animated sound ripple glow when playing */}
          {isPlaying && (
            <span className="absolute -inset-1 rounded-full bg-amber-400/20 animate-ping pointer-events-none" />
          )}

          {isPlaying ? (
            <div className="flex items-center gap-1">
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse" />
              {/* Mini animated audio equalizer bars */}
              <span className="flex items-end gap-[2px] h-3 w-2.5">
                <span className="w-[2px] bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_100ms] h-full" />
                <span className="w-[2px] bg-amber-300 rounded-full animate-[bounce_0.9s_infinite_300ms] h-2/3" />
                <span className="w-[2px] bg-amber-400 rounded-full animate-[bounce_0.7s_infinite_200ms] h-4/5" />
              </span>
            </div>
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-stone-300" />
          )}
        </button>
      </div>
    </>
  );
};
