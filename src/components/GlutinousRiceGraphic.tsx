import React from 'react';

interface Props {
  size?: number;
  isHit?: boolean;
  hitResult?: 'correct' | 'wrong';
  showLabel?: boolean;
}

export const GlutinousRiceGraphic: React.FC<Props> = ({
  size = 100,
  isHit = false,
  hitResult,
  showLabel = true,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-end select-none transition-transform duration-150 ${
        isHit && hitResult === 'correct'
          ? 'scale-125 animate-bounce'
          : isHit && hitResult === 'wrong'
          ? 'scale-90 opacity-70 animate-pulse'
          : 'hover:scale-105 active:scale-95'
      }`}
      style={{ width: size }}
    >
      {/* Soft Glow */}
      <div className="absolute inset-0 bg-emerald-400/25 rounded-full blur-md -z-10 animate-pulse" />

      {/* SVG Bowl Box */}
      <div style={{ width: size, height: size * 1.05 }} className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-lg overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="riceBowlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <radialGradient id="ricePearlGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </radialGradient>
          </defs>

          {/* Floating Steam Wisps */}
          <path
            d="M 36 26 Q 32 16 38 8 Q 42 0 38 -5"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 50 22 Q 54 13 48 6 Q 44 -1 48 -6"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 64 26 Q 68 16 62 9 Q 58 2 63 -4"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Chopsticks resting across back/side */}
          <line x1="12" y1="44" x2="88" y2="32" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="10" y1="48" x2="86" y2="36" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />

          {/* Left Ball */}
          <circle cx="34" cy="52" r="18" fill="url(#ricePearlGrad)" stroke="#94a3b8" strokeWidth="1.2" />
          {/* Left Ball Cute Face */}
          <ellipse cx="29" cy="50" rx="2" ry="2.8" fill="#334155" />
          <ellipse cx="38" cy="50" rx="2" ry="2.8" fill="#334155" />
          <path d="M 31 55 Q 33.5 57.5 36 55" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="26" cy="53" r="2.2" fill="#f472b6" opacity="0.6" />
          <circle cx="41" cy="53" r="2.2" fill="#f472b6" opacity="0.6" />
          {/* Sesame Seeds */}
          <ellipse cx="32" cy="40" rx="1.2" ry="2" fill="#1e293b" transform="rotate(25 32 40)" />
          <ellipse cx="36" cy="42" rx="1.2" ry="2" fill="#1e293b" transform="rotate(-15 36 42)" />

          {/* Right Ball */}
          <circle cx="66" cy="52" r="18" fill="url(#ricePearlGrad)" stroke="#94a3b8" strokeWidth="1.2" />
          {/* Right Ball Cute Face */}
          <ellipse cx="61" cy="50" rx="2" ry="2.8" fill="#334155" />
          <ellipse cx="70" cy="50" rx="2" ry="2.8" fill="#334155" />
          <path d="M 63 55 Q 65.5 57.5 68 55" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="58" cy="53" r="2.2" fill="#f472b6" opacity="0.6" />
          <circle cx="73" cy="53" r="2.2" fill="#f472b6" opacity="0.6" />
          {/* Sesame Seeds */}
          <ellipse cx="64" cy="41" rx="1.2" ry="2" fill="#1e293b" transform="rotate(30 64 41)" />
          <ellipse cx="68" cy="43" rx="1.2" ry="2" fill="#1e293b" transform="rotate(-30 68 43)" />

          {/* Center Plump Front Ball */}
          <circle cx="50" cy="59" r="21" fill="url(#ricePearlGrad)" stroke="#94a3b8" strokeWidth="1.4" />
          {/* Center Cute Face with Big Smile */}
          <ellipse cx="43" cy="57" rx="2.5" ry="3.2" fill="#1e293b" />
          <circle cx="44.2" cy="55.8" r="1" fill="#ffffff" />
          <ellipse cx="57" cy="57" rx="2.5" ry="3.2" fill="#1e293b" />
          <circle cx="58.2" cy="55.8" r="1" fill="#ffffff" />
          <path d="M 46 63 Q 50 68 54 63" fill="none" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
          {/* Rosy blush */}
          <circle cx="39" cy="61" r="3.2" fill="#fb7185" opacity="0.7" />
          <circle cx="61" cy="61" r="3.2" fill="#fb7185" opacity="0.7" />
          {/* Little Garnish Mint Leaf on Top */}
          <path d="M 50 39 Q 56 35 54 43 Q 50 42 50 39 Z" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
          {/* Black Sesame speckles */}
          <ellipse cx="47" cy="46" rx="1.3" ry="2.2" fill="#0f172a" transform="rotate(15 47 46)" />
          <ellipse cx="53" cy="47" rx="1.3" ry="2.2" fill="#0f172a" transform="rotate(-20 53 47)" />

          {/* Decorative Ceramic Bowl Front */}
          <path
            d="M 12 66 Q 10 98 40 102 L 60 102 Q 90 98 88 66 Z"
            fill="url(#riceBowlGrad)"
            stroke="#065f46"
            strokeWidth="1.5"
          />

          {/* Bowl Rim Gold/White Accent */}
          <ellipse cx="50" cy="66" rx="38" ry="6.5" fill="none" stroke="#a7f3d0" strokeWidth="3" />
          <ellipse cx="50" cy="66" rx="38" ry="6.5" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />

          {/* Traditional Wave Pattern on Bowl */}
          <path
            d="M 28 82 Q 35 76 42 82 Q 49 76 56 82 Q 63 76 70 82"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Bowl Base */}
          <rect x="36" y="101" width="28" height="6" rx="2" fill="#047857" stroke="#065f46" strokeWidth="1" />
        </svg>
      </div>

      {/* Word Badge */}
      {showLabel && (
        <span className="mt-1 px-2.5 py-0.5 text-xs font-black tracking-wide rounded-full bg-emerald-600 text-white border border-emerald-300 shadow-sm whitespace-nowrap">
          glutinous rice
        </span>
      )}
    </div>
  );
};
