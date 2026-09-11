import React from 'react';
import { X, Volume2, Sparkles } from 'lucide-react';
import { LanternGraphic } from './LanternGraphic';
import { GlutinousRiceGraphic } from './GlutinousRiceGraphic';
import { soundEngine } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WordTeachModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-400 to-orange-400 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-100" />
            <h2 className="text-lg sm:text-xl font-black tracking-tight">
              Classroom Word Cards (备课词汇精讲)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Cards Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto">
          {/* Word 1: Lantern */}
          <div className="rounded-2xl border-2 border-red-200 bg-red-50/40 p-4 flex flex-col items-center text-center shadow-xs">
            <div className="py-2">
              <LanternGraphic size={110} showLabel={false} />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl font-black text-red-700 tracking-wide">
                lantern
              </span>
              <button
                onClick={() => soundEngine.speakWord('lantern')}
                title="Listen to pronunciation"
                className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition-colors shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-stone-500 mt-0.5">
              [ˈlæntərn]
            </div>

            <div className="mt-2 text-sm font-bold text-stone-800 bg-white/80 px-3 py-1 rounded-full border border-red-200">
              灯笼
            </div>

            <div className="mt-3 text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-red-100 text-left w-full space-y-1">
              <p className="font-semibold text-red-800">
                📝 Example:
              </p>
              <p className="italic">"We hang red lanterns during the festival."</p>
              <p className="text-[11px] text-stone-400">节日期间我们悬挂红灯笼。</p>
            </div>
          </div>

          {/* Word 2: Glutinous Rice */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-4 flex flex-col items-center text-center shadow-xs">
            <div className="py-2">
              <GlutinousRiceGraphic size={110} showLabel={false} />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xl font-black text-emerald-800 tracking-wide">
                glutinous rice
              </span>
              <button
                onClick={() => soundEngine.speakWord('glutinous rice')}
                title="Listen to pronunciation"
                className="p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-stone-500 mt-0.5">
              [ˈɡluːtɪnəs raɪs]
            </div>

            <div className="mt-2 text-sm font-bold text-stone-800 bg-white/80 px-3 py-1 rounded-full border border-emerald-200">
              糯米 / 糯米团 / 汤圆
            </div>

            <div className="mt-3 text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-emerald-100 text-left w-full space-y-1">
              <p className="font-semibold text-emerald-800">
                📝 Example:
              </p>
              <p className="italic">"Sweet glutinous rice dumplings are delicious."</p>
              <p className="text-[11px] text-stone-400">甜甜的糯米汤圆非常美味。</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-colors"
          >
            Start Playing (开始游戏)
          </button>
        </div>
      </div>
    </div>
  );
};
