import React from 'react';
import { GameStats, GameMode } from '../types';
import { Trophy, Flame, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface Props {
  stats: GameStats;
  currentMode: GameMode;
  onResetStats: () => void;
}

export const ScoreBoard: React.FC<Props> = ({
  stats,
  currentMode,
  onResetStats,
}) => {
  const totalClicks = stats.correctHits + stats.wrongHits;
  const accuracy =
    totalClicks > 0 ? Math.round((stats.correctHits / totalClicks) * 100) : 100;

  // Encouraging feedback based on score/combo
  const getEncouragement = () => {
    if (stats.combo >= 10) return { text: '⭐ Outstanding English Star! ⭐', color: 'text-amber-500' };
    if (stats.combo >= 5) return { text: '🔥 Super Combo Streak!', color: 'text-orange-500' };
    if (stats.combo >= 3) return { text: '✨ Great Rhythm!', color: 'text-emerald-500' };
    if (stats.score >= 50) return { text: '🎉 High Score Champion!', color: 'text-purple-500' };
    return { text: '🎯 Keep your eyes on the belt!', color: 'text-stone-500' };
  };

  const encouragement = getEncouragement();

  return (
    <div
      id="scoreboard-panel"
      className="w-full max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-4"
    >
      {/* 1. Main Score Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border-2 border-amber-300 flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-amber-800">
            <Trophy className="w-4 h-4 text-amber-500" />
            Total Score (实时得分)
          </span>
          <button
            onClick={onResetStats}
            title="Reset Score"
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-black text-amber-900 tracking-tight">
            {stats.score}
          </span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            +5 / -1
          </span>
        </div>

        <div className={`text-xs font-semibold truncate ${encouragement.color}`}>
          {encouragement.text}
        </div>
      </div>

      {/* 2. Combo Streak Card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border-2 border-orange-200 flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-stone-500 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-orange-950">Combo Streak (连击数)</span>
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-black text-orange-600 tracking-tight">
            {stats.combo}
          </span>
          <span className="text-xs text-stone-400 font-medium">
            (Max: {stats.maxCombo})
          </span>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          {stats.combo >= 3 ? '⚡ Fast recognition bonus!' : 'Hit target consecutively'}
        </div>
      </div>

      {/* 3. Accuracy & Hits */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border-2 border-emerald-200 flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-stone-500 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-950">Correct Hits (命中)</span>
        </div>

        <div className="my-2 flex items-baseline justify-between">
          <span className="text-3xl sm:text-4xl font-black text-emerald-600">
            {stats.correctHits}
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
            {accuracy}% acc
          </span>
        </div>

        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      {/* 4. Errors & Target Mode info */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border-2 border-rose-200 flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-stone-500 text-xs font-bold uppercase tracking-wider">
          <XCircle className="w-4 h-4 text-rose-500" />
          <span className="text-rose-950">Wrong Clicks (失误)</span>
        </div>

        <div className="my-2 flex items-baseline justify-between">
          <span className="text-3xl sm:text-4xl font-black text-rose-600">
            {stats.wrongHits}
          </span>
          <span className="text-xs font-semibold text-stone-400">
            {currentMode === 'target_lantern' ? 'Clicked Rice' : 'Clicked Lantern'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-stone-500 font-medium truncate">
          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Reward: +5 | Mistake: -1</span>
        </div>
      </div>
    </div>
  );
};
