import React from 'react';

interface IslamicOrnamentCrestProps {
  className?: string;
}

export const IslamicOrnamentCrest: React.FC<IslamicOrnamentCrestProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Soft warm radial halo */}
      <div className="absolute -top-6 w-56 h-36 rounded-full bg-gradient-to-b from-amber-400/20 via-amber-500/10 to-transparent blur-2xl pointer-events-none" />

      {/* Elegant Islamic Medallion & Arch SVG */}
      <svg
        className="w-36 h-20 sm:w-44 sm:h-24 text-amber-300 drop-shadow-[0_2px_12px_rgba(250,220,120,0.4)]"
        viewBox="0 0 200 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Ogee Arch Outline */}
        <path
          d="M 20 100 C 20 50, 60 20, 100 6 C 140 20, 180 50, 180 100"
          stroke="url(#goldGrad)"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          opacity="0.6"
        />

        {/* Inner Delicate Arch */}
        <path
          d="M 35 100 C 35 60, 68 32, 100 18 C 132 32, 165 60, 165 100"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* Crown Finial / Apex Spire */}
        <path
          d="M 100 0 L 100 16"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="100" cy="3" r="2.5" fill="url(#goldGrad)" />

        {/* Central Rub el Hizb (Eight-pointed Star) Medallion */}
        <g transform="translate(100, 48)">
          {/* Square 1 */}
          <rect
            x="-11"
            y="-11"
            width="22"
            height="22"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
          />
          {/* Square 2 (rotated 45deg) */}
          <rect
            x="-11"
            y="-11"
            width="22"
            height="22"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
            transform="rotate(45)"
          />
          {/* Inner Golden Dot */}
          <circle cx="0" cy="0" r="3" fill="url(#goldGrad)" />
        </g>

        {/* Symmetrical Arabesque Tendrils Left */}
        <path
          d="M 82 48 C 65 42, 55 58, 42 56 C 36 55, 30 50, 32 44 C 34 38, 42 38, 44 44"
          stroke="url(#goldGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Symmetrical Arabesque Tendrils Right */}
        <path
          d="M 118 48 C 135 42, 145 58, 158 56 C 164 55, 170 50, 168 44 C 166 38, 158 38, 156 44"
          stroke="url(#goldGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Lower Horizontal Filigree Baseline */}
        <path
          d="M 45 92 Q 100 84 155 92"
          stroke="url(#goldGrad)"
          strokeWidth="1"
          opacity="0.7"
        />
        <circle cx="70" cy="89" r="1.5" fill="url(#goldGrad)" />
        <circle cx="100" cy="87.5" r="2" fill="url(#goldGrad)" />
        <circle cx="130" cy="89" r="1.5" fill="url(#goldGrad)" />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3d1" />
            <stop offset="50%" stopColor="#eec774" />
            <stop offset="100%" stopColor="#c59837" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
