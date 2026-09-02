import React from 'react';

interface LanternProps {
  className?: string;
  chainLength?: number;
  lanternSize?: 'sm' | 'md' | 'lg';
  sway?: 'left' | 'right' | 'none';
  lightIntensity?: 'normal' | 'bright';
}

export const Lantern: React.FC<LanternProps> = ({
  className = '',
  chainLength = 80,
  lanternSize = 'md',
  sway = 'left',
  lightIntensity = 'normal',
}) => {
  const swayClass =
    sway === 'left'
      ? 'animate-sway-left'
      : sway === 'right'
      ? 'animate-sway-right'
      : '';

  const scale = lanternSize === 'sm' ? 0.75 : lanternSize === 'lg' ? 1.25 : 1;
  const glowOpacity = lightIntensity === 'bright' ? 'opacity-90' : 'opacity-75';

  return (
    <div
      className={`relative flex flex-col items-center pointer-events-none select-none z-20 ${swayClass} ${className}`}
      style={{ width: `${64 * scale}px` }}
    >
      {/* Golden hanging chain with rings */}
      <div
        className="w-[1.5px] bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 relative flex flex-col items-center"
        style={{ height: `${chainLength}px` }}
      >
        <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-amber-400 -top-1 absolute" />
        <div className="w-2 h-2 rounded-full border border-amber-500 top-1/2 absolute" />
      </div>

      {/* Hanging ring */}
      <div className="w-4 h-4 rounded-full border-[1.5px] border-amber-400 mb-0.5 -mt-1 bg-transparent shadow-[0_0_8px_rgba(251,191,36,0.5)]" />

      {/* Lantern Top Dome / Crescent Finial */}
      <div className="relative flex flex-col items-center">
        {/* Crescent finial */}
        <div className="text-amber-300 text-[10px] leading-none mb-0.5 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]">
          ☪
        </div>

        {/* Dome cap */}
        <div
          className="bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 rounded-t-xl border border-amber-300 shadow-md relative"
          style={{ width: `${44 * scale}px`, height: `${14 * scale}px` }}
        >
          {/* Filigree ribs */}
          <div className="absolute inset-0 flex justify-around items-center px-1">
            <div className="w-0.5 h-full bg-amber-200/50" />
            <div className="w-0.5 h-full bg-amber-200/50" />
            <div className="w-0.5 h-full bg-amber-200/50" />
          </div>
        </div>

        {/* Lantern Main Body with Islamic Arabesque Glass */}
        <div
          className="relative bg-gradient-to-b from-amber-900/90 via-amber-950/95 to-amber-900/90 border-2 border-amber-400 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
          style={{
            width: `${56 * scale}px`,
            height: `${72 * scale}px`,
          }}
        >
          {/* Ambient Inner Fire / Candle Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Pulsing light aura */}
            <div
              className={`w-10 h-14 bg-gradient-to-b from-amber-100 via-amber-400 to-orange-500 rounded-full blur-md animate-flame ${glowOpacity}`}
            />
            {/* Candle Core */}
            <div className="w-2.5 h-6 bg-gradient-to-t from-orange-400 via-amber-200 to-white rounded-full blur-[1px] animate-pulse relative z-10">
              <div className="w-1 h-2 bg-white rounded-full mx-auto -top-0.5 absolute left-1/2 -translate-x-1/2" />
            </div>
          </div>

          {/* Geometric Islamic Lattice Overlay (Moroccan Mashrabiya Star) */}
          <svg
            className="absolute inset-0 w-full h-full text-amber-300/80 pointer-events-none p-1.5"
            viewBox="0 0 100 130"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {/* Arch Top */}
            <path
              d="M10,40 Q50,5 90,40 L90,110 Q50,125 10,110 Z"
              stroke="rgba(251, 191, 36, 0.9)"
              strokeWidth="2.5"
            />
            {/* Star Pattern */}
            <polygon
              points="50,45 60,65 82,65 64,78 71,98 50,85 29,98 36,78 18,65 40,65"
              stroke="rgba(253, 230, 138, 0.7)"
              fill="rgba(254, 240, 138, 0.08)"
              strokeWidth="1.5"
            />
            {/* Internal Diamond Lattice */}
            <line x1="50" y1="20" x2="50" y2="110" stroke="rgba(251, 191, 36, 0.4)" strokeDasharray="3 3" />
            <line x1="20" y1="65" x2="80" y2="65" stroke="rgba(251, 191, 36, 0.4)" strokeDasharray="3 3" />
          </svg>

          {/* Glass reflection highlight */}
          <div className="absolute top-1 left-1 w-2 h-10 bg-white/20 rounded-full blur-[0.5px] -rotate-12 pointer-events-none" />
        </div>

        {/* Lantern Base */}
        <div
          className="bg-gradient-to-r from-amber-800 via-amber-500 to-amber-800 rounded-b-lg border border-amber-300 shadow-md relative"
          style={{ width: `${38 * scale}px`, height: `${10 * scale}px` }}
        />

        {/* Bottom Tassel / Drop Jewel */}
        <div className="flex flex-col items-center mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
          <div className="w-0.5 h-3 bg-amber-400" />
          <div className="w-2 h-3 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-full shadow-sm" />
        </div>
      </div>

      {/* Realistic Cast Warm Ambient Glow Beneath Lantern */}
      <div
        className="absolute -bottom-16 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none animate-pulse"
        style={{ transform: 'scale(1.2)' }}
      />
    </div>
  );
};
