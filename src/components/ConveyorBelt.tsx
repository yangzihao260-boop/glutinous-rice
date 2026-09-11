import React, { useRef } from 'react';
import { ConveyorItem, FloatingScore, GameMode, ItemType } from '../types';
import { LanternGraphic } from './LanternGraphic';
import { GlutinousRiceGraphic } from './GlutinousRiceGraphic';
import { Volume2, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface Props {
  items: ConveyorItem[];
  floatingScores: FloatingScore[];
  currentMode: GameMode;
  speedMultiplier: number;
  onItemClick: (item: ConveyorItem, clientX: number, clientY: number) => void;
  isPaused: boolean;
  showWordLabels: boolean;
}

export const ConveyorBelt: React.FC<Props> = ({
  items,
  floatingScores,
  currentMode,
  speedMultiplier,
  onItemClick,
  isPaused,
  showWordLabels,
}) => {
  const beltContainerRef = useRef<HTMLDivElement>(null);

  const targetType: ItemType =
    currentMode === 'target_lantern' ? 'lantern' : 'glutinous_rice';

  // Conveyor belt animation duration based on speed
  const rollerSpeedDuration = Math.max(0.4, 2 / speedMultiplier);

  return (
    <div
      ref={beltContainerRef}
      id="conveyor-stage"
      className="relative w-full max-w-5xl mx-auto select-none rounded-3xl bg-linear-to-b from-amber-50/70 via-stone-50 to-orange-50/60 p-4 sm:p-6 shadow-xl border-4 border-amber-200 overflow-hidden"
    >
      {/* Decorative Factory / Kitchen Classroom Canopy */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200/80 mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400 animate-ping" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Conveyor Belt Direction: Left ➔ Right (从左向右运转)
          </span>
        </div>

        {/* Current Mission Target Banner */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-amber-300 shadow-xs">
          <span className="text-xs font-semibold text-stone-600">Current Target (当前目标):</span>
          <span
            className={`text-xs sm:text-sm font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
              targetType === 'lantern'
                ? 'bg-red-500 text-white shadow-xs'
                : 'bg-emerald-600 text-white shadow-xs'
            }`}
          >
            {targetType === 'lantern' ? '🏮 Click Lantern (+5)' : '🥣 Click Glutinous Rice (+5)'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.speakWord(targetType === 'lantern' ? 'lantern' : 'glutinous rice');
            }}
            title="Pronounce Target Word"
            className="p-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Belt Runway Frame */}
      <div className="relative h-72 sm:h-80 w-full rounded-2xl bg-stone-900 border-4 border-stone-700 shadow-inner overflow-hidden flex flex-col justify-between">
        {/* Background Workshop / Kitchen Tile Motif */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Guard Rail */}
        <div className="relative z-10 h-7 bg-linear-to-r from-stone-700 via-stone-500 to-stone-700 border-b-2 border-stone-800 flex items-center justify-between px-4">
          <div className="flex gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-4 h-2 rounded-xs bg-amber-400/60" />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-amber-300 font-bold uppercase">
            ◄ ENTRANCE (入口) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; EXIT (出口) ►
          </span>
        </div>

        {/* The Item Travel Stage */}
        <div className="relative flex-1 min-h-[175px] w-full overflow-hidden">
          {/* Subtle Speed Lines in background moving right */}
          <div
            className={`absolute inset-0 pointer-events-none opacity-20 ${
              !isPaused ? 'animate-[pulse_1.5s_infinite]' : ''
            }`}
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 45px)',
            }}
          />

          {/* Left Entry Portal Box */}
          <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-14 bg-linear-to-r from-stone-950 via-stone-900/90 to-transparent z-20 pointer-events-none border-r border-amber-500/30 flex items-center justify-center">
            <div className="w-2 h-20 rounded-full bg-amber-400/50 animate-pulse" />
          </div>

          {/* Right Exit Portal Box */}
          <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-14 bg-linear-to-l from-stone-950 via-stone-900/90 to-transparent z-20 pointer-events-none border-l border-amber-500/30 flex items-center justify-center">
            <div className="w-2 h-20 rounded-full bg-emerald-400/50 animate-pulse" />
          </div>

          {/* Render Moving Items */}
          {items.map((item) => {
            const isTarget = item.type === targetType;

            const handleHit = (e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              if (item.isHit) return;
              const rect = e.currentTarget.getBoundingClientRect();
              onItemClick(item, rect.left + rect.width / 2, rect.top + rect.height / 2);
            };

            return (
              <div
                key={item.id}
                id={`item-${item.id}`}
                onPointerDown={handleHit}
                onClick={handleHit}
                className={`absolute bottom-1 cursor-pointer select-none transition-transform duration-75 z-10 flex flex-col items-center justify-center touch-none group p-3 sm:p-4 -m-3 sm:-m-4 ${
                  item.isHit ? 'pointer-events-none opacity-90' : 'hover:scale-105 active:scale-95'
                }`}
                style={{
                  left: `${item.xPercent}%`,
                  transform: `translateX(-50%) translateY(${item.yOffset}px)`,
                }}
                title={`Click: ${item.type === 'lantern' ? 'lantern' : 'glutinous rice'}`}
              >
                {/* Generous Hitbox Target Pad - Ensures every corner and edge registers immediately */}
                <div className="absolute -inset-3 sm:-inset-5 z-30 cursor-pointer rounded-3xl" />

                {/* Visual Glow on Hover for accessibility & kids engagement */}
                <div
                  className={`absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md pointer-events-none ${
                    isTarget ? 'bg-amber-400/45' : 'bg-rose-400/35'
                  }`}
                />

                {/* The cute graphics with pointer-events-none so hits always register on root container */}
                <div className="pointer-events-none">
                  {item.type === 'lantern' ? (
                    <LanternGraphic
                      size={92}
                      isHit={item.isHit}
                      hitResult={item.hitResult}
                      showLabel={showWordLabels}
                    />
                  ) : (
                    <GlutinousRiceGraphic
                      size={92}
                      isHit={item.isHit}
                      hitResult={item.hitResult}
                      showLabel={showWordLabels}
                    />
                  )}
                </div>

                {/* Click target helper shadow */}
                <div className="w-16 h-2 rounded-full bg-black/60 mt-1 blur-xs pointer-events-none" />
              </div>
            );
          })}

          {/* Floating Scores (+5, -1) with animated burst */}
          {floatingScores.map((score) => (
            <div
              key={score.id}
              className={`absolute pointer-events-none z-30 font-black text-xl sm:text-2xl drop-shadow-md animate-float-up flex items-center gap-1 ${
                score.isPositive
                  ? 'text-yellow-300 text-stroke-amber'
                  : 'text-red-400 text-stroke-red'
              }`}
              style={{
                left: `${score.x}px`,
                top: `${score.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span>{score.text}</span>
              {score.isPositive && <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />}
            </div>
          ))}

          {/* Paused Overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs z-30 flex items-center justify-center">
              <div className="px-6 py-3 rounded-2xl bg-white/95 text-stone-800 text-center shadow-2xl border-2 border-amber-300">
                <p className="text-xl font-black tracking-wide text-amber-900">GAME PAUSED (已暂停)</p>
                <p className="text-xs text-stone-600 mt-1">Click Start/Resume to continue playing</p>
              </div>
            </div>
          )}
        </div>

        {/* Animated Conveyor Track & Rollers */}
        <div className="relative z-10">
          {/* Belt Surface with Moving Chevrons/Texture */}
          <div className="h-10 bg-stone-800 border-t-2 border-stone-600 relative overflow-hidden flex items-center">
            {/* Animated Chevron Tread Line */}
            <div
              className="absolute inset-0 flex items-center"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #44403c 0px, #44403c 14px, #292524 14px, #292524 28px)',
                animation: !isPaused
                  ? `conveyorScroll ${rollerSpeedDuration}s linear infinite`
                  : 'none',
                backgroundSize: '40px 100%',
              }}
            />

            {/* Industrial Safety Stripe overlay on lower half */}
            <div className="absolute bottom-0 inset-x-0 h-2 bg-repeating-linear-gradient-to-r from-amber-400 via-amber-400 10px, to-stone-900 10px, to-stone-900 20px opacity-60" />
          </div>

          {/* Under-belt Rolling Cogs & Wheels */}
          <div className="h-7 bg-stone-900 flex items-center justify-around px-2 border-t border-stone-700">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-amber-500/70 bg-stone-800 flex items-center justify-center"
                style={{
                  animation: !isPaused
                    ? `spin ${rollerSpeedDuration * 0.8}s linear infinite`
                    : 'none',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classroom Hint Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-xs text-stone-600 border-t border-amber-100">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Target Match: <strong>+5 Points</strong>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Wrong Click: <strong>-1 Point</strong>
          </span>
        </div>
        <div className="text-stone-500 font-medium">
          💡 Teacher Tip: Click fast and accurately! Test student recognition in real time.
        </div>
      </div>
    </div>
  );
};
