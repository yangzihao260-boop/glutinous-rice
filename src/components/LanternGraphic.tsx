import React from 'react';

interface Props {
  size?: number;
  isHit?: boolean;
  hitResult?: 'correct' | 'wrong';
  showLabel?: boolean;
}

export const LanternGraphic: React.FC<Props> = ({
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
      {/* Glow aura */}
      <div className="absolute inset-0 bg-amber-400/25 rounded-full blur-md -z-10 animate-pulse" />

      {/* SVG Lantern Box */}
      <div style={{ width: size, height: size * 1.05 }} className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-lg overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lanternRedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="35%" stopColor="#ef4444" />
              <stop offset="70%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>

            <linearGradient id="lanternGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            <radialGradient id="lanternInnerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffedd5" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#f87171" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Top Hook Ring & Cord */}
          <line x1="50" y1="2" x2="50" y2="14" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="5" r="3.5" fill="none" stroke="#d97706" strokeWidth="2" />

          {/* Top Gold Cap */}
          <ellipse cx="50" cy="15" rx="22" ry="5.5" fill="url(#lanternGoldGrad)" stroke="#b45309" strokeWidth="1" />

          {/* Main Lantern Body */}
          <ellipse cx="50" cy="54" rx="38" ry="38" fill="url(#lanternRedGrad)" />
          
          {/* Inner Light Glow */}
          <ellipse cx="50" cy="54" rx="26" ry="30" fill="url(#lanternInnerGlow)" />

          {/* Vertical Ribbons / Creases */}
          <ellipse cx="50" cy="54" rx="24" ry="38" fill="none" stroke="#991b1b" strokeWidth="1.8" opacity="0.6" />
          <ellipse cx="50" cy="54" rx="12" ry="38" fill="none" stroke="#991b1b" strokeWidth="1.8" opacity="0.6" />
          <line x1="50" y1="15" x2="50" y2="93" stroke="#991b1b" strokeWidth="1.8" opacity="0.7" />

          {/* Cute Kawaii Face */}
          {/* Left Eye */}
          <ellipse cx="40" cy="52" rx="3.5" ry="4.5" fill="#1f2937" />
          <circle cx="41.5" cy="50.5" r="1.5" fill="#ffffff" />
          {/* Right Eye */}
          <ellipse cx="60" cy="52" rx="3.5" ry="4.5" fill="#1f2937" />
          <circle cx="61.5" cy="50.5" r="1.5" fill="#ffffff" />
          {/* Sweet Smile */}
          <path d="M 45 59 Q 50 64 55 59" fill="none" stroke="#1f2937" strokeWidth="2.2" strokeLinecap="round" />
          {/* Rosy Cheeks */}
          <circle cx="34" cy="56" r="3.5" fill="#f43f5e" opacity="0.6" />
          <circle cx="66" cy="56" r="3.5" fill="#f43f5e" opacity="0.6" />

          {/* Bottom Gold Cap */}
          <ellipse cx="50" cy="93" rx="20" ry="5" fill="url(#lanternGoldGrad)" stroke="#b45309" strokeWidth="1" />

          {/* Tassel Knot */}
          <circle cx="50" cy="99" r="3.5" fill="#dc2626" stroke="#eab308" strokeWidth="1" />

          {/* Golden/Red Silk Tassels */}
          <line x1="50" y1="102" x2="50" y2="120" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
          <line x1="47" y1="102" x2="44" y2="118" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="53" y1="102" x2="56" y2="118" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Word Badge */}
      {showLabel && (
        <span className="mt-1 px-2.5 py-0.5 text-xs font-black tracking-wide rounded-full bg-red-600 text-white border border-red-300 shadow-sm whitespace-nowrap">
          lantern
        </span>
      )}
    </div>
  );
};
