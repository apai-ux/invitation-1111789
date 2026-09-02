import React from 'react';

interface ArabesqueDividerProps {
  className?: string;
  theme?: 'gold' | 'maroon' | 'light';
  symbol?: 'star' | 'floral' | 'crescent' | 'bismillah';
}

export const ArabesqueDivider: React.FC<ArabesqueDividerProps> = ({
  className = '',
  theme = 'gold',
  symbol = 'star',
}) => {
  const colorMap = {
    gold: {
      line: 'from-transparent via-amber-600/70 to-transparent',
      text: 'text-amber-600',
      border: 'border-amber-500/60',
      bg: 'bg-amber-100/50',
    },
    maroon: {
      line: 'from-transparent via-[#7a1b2e]/60 to-transparent',
      text: 'text-[#7a1b2e]',
      border: 'border-[#7a1b2e]/40',
      bg: 'bg-[#7a1b2e]/5',
    },
    light: {
      line: 'from-transparent via-amber-200/80 to-transparent',
      text: 'text-amber-200',
      border: 'border-amber-300/50',
      bg: 'bg-amber-400/10',
    },
  };

  const current = colorMap[theme];

  return (
    <div className={`flex items-center justify-center gap-3 my-4 select-none ${className}`}>
      {/* Left decorative flourish line */}
      <div className="flex items-center gap-1">
        <div className={`h-[1px] w-12 sm:w-20 bg-gradient-to-r ${current.line}`} />
        <div className={`w-1 h-1 rounded-full ${current.border} border bg-current ${current.text}`} />
      </div>

      {/* Central Islamic Symbol */}
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-full border ${current.border} ${current.bg} ${current.text} shadow-sm transform rotate-45`}
      >
        <div className="transform -rotate-45 text-xs font-serif leading-none">
          {symbol === 'star' && '✦'}
          {symbol === 'floral' && '❧'}
          {symbol === 'crescent' && '☾'}
          {symbol === 'bismillah' && '﷽'}
        </div>
      </div>

      {/* Right decorative flourish line */}
      <div className="flex items-center gap-1">
        <div className={`w-1 h-1 rounded-full ${current.border} border bg-current ${current.text}`} />
        <div className={`h-[1px] w-12 sm:w-20 bg-gradient-to-l ${current.line}`} />
      </div>
    </div>
  );
};
