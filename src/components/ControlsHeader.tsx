import React from 'react';
import { GameMode, SpeedLevel, SpeedConfig } from '../types';
import {
  Volume2,
  VolumeX,
  Music,
  Gauge,
  BookOpen,
  Maximize,
  Sparkles,
  Tag,
  Play,
  Pause,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface Props {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  speedLevels: SpeedConfig[];
  currentSpeed: SpeedLevel;
  onSpeedChange: (speed: SpeedLevel) => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
  isSfxMuted: boolean;
  onToggleSfx: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  showWordLabels: boolean;
  onToggleWordLabels: () => void;
  onOpenTeachModal: () => void;
  onToggleFullscreen: () => void;
}

export const ControlsHeader: React.FC<Props> = ({
  currentMode,
  onModeChange,
  speedLevels,
  currentSpeed,
  onSpeedChange,
  isBgmPlaying,
  onToggleBgm,
  isSfxMuted,
  onToggleSfx,
  isPaused,
  onTogglePause,
  showWordLabels,
  onToggleWordLabels,
  onOpenTeachModal,
  onToggleFullscreen,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto mb-4 flex flex-col gap-3">
      {/* Top Title & Classroom Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-xs p-3 sm:p-4 rounded-2xl shadow-xs border border-amber-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm font-black text-xl">
            🏮
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              English Conveyor Game
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                小学英语助教
              </span>
            </h1>
            <p className="text-xs text-stone-500">
              Vocabulary Target: <span className="font-bold text-red-600">lantern (灯笼)</span> &amp;{' '}
              <span className="font-bold text-emerald-700">glutinous rice (糯米)</span>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pause / Resume Button */}
          <button
            onClick={onTogglePause}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs ${
              isPaused
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume (开始)' : 'Pause (暂停)'}
          </button>

          {/* BGM Toggle */}
          <button
            onClick={onToggleBgm}
            title="Toggle Cheerful Background Music"
            className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all border ${
              isBgmPlaying
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-200'
            }`}
          >
            <Music className={`w-4 h-4 ${isBgmPlaying ? 'animate-bounce' : ''}`} />
            <span>BGM {isBgmPlaying ? 'ON' : 'OFF'}</span>
          </button>

          {/* SFX Mute */}
          <button
            onClick={onToggleSfx}
            title="Toggle Sound Effects"
            className={`p-1.5 rounded-xl transition-all border ${
              !isSfxMuted
                ? 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                : 'bg-rose-50 text-rose-500 border-rose-200'
            }`}
          >
            {!isSfxMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Word Teaching Cards button */}
          <button
            onClick={onOpenTeachModal}
            className="px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Word Cards (单词卡)</span>
          </button>

          {/* Toggle Word Labels on items (for challenge) */}
          <button
            onClick={onToggleWordLabels}
            title="Toggle Word Labels above items"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors ${
              showWordLabels
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-stone-100 text-stone-500 border-stone-300'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{showWordLabels ? 'Labels: ON' : 'Labels: OFF'}</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            title="Classroom Fullscreen"
            className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Mode & Speed Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 1. Mode Selector (两种游戏模式) */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xs border border-amber-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Game Mode (游戏模式)
            </span>
            <span className="text-[11px] text-stone-400">Select which item scores points</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Mode 1: Target Lantern */}
            <button
              onClick={() => {
                onModeChange('target_lantern');
                soundEngine.speakWord('lantern');
              }}
              className={`p-2.5 rounded-xl text-left border-2 transition-all flex items-center gap-2.5 ${
                currentMode === 'target_lantern'
                  ? 'bg-red-50 border-red-500 ring-2 ring-red-200 shadow-sm'
                  : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100 text-stone-600'
              }`}
            >
              <div className="text-2xl">🏮</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-red-900 truncate">
                  Target: LANTERN
                </div>
                <div className="text-[11px] text-red-700/80 font-medium truncate">
                  点击灯笼得5分，糯米扣1分
                </div>
              </div>
            </button>

            {/* Mode 2: Target Glutinous Rice */}
            <button
              onClick={() => {
                onModeChange('target_glutinous_rice');
                soundEngine.speakWord('glutinous rice');
              }}
              className={`p-2.5 rounded-xl text-left border-2 transition-all flex items-center gap-2.5 ${
                currentMode === 'target_glutinous_rice'
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-sm'
                  : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100 text-stone-600'
              }`}
            >
              <div className="text-2xl">🥣</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-emerald-900 truncate">
                  Target: GLUTINOUS RICE
                </div>
                <div className="text-[11px] text-emerald-700/80 font-medium truncate">
                  点击糯米得5分，灯笼扣1分
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Conveyor Belt Speed Selector (四种速度模式) */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xs border border-amber-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-amber-500" />
              Conveyor Speed (传送带速度 - 4种难度)
            </span>
            <span className="text-[11px] text-stone-400">Controls conveyor speed</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {speedLevels.map((lvl) => {
              const isActive = currentSpeed === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => onSpeedChange(lvl.id)}
                  className={`py-2 px-1 rounded-xl text-center border-2 transition-all flex flex-col items-center justify-center ${
                    isActive
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200 font-black shadow-xs'
                      : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <span
                    className={`text-xs font-extrabold ${
                      isActive ? 'text-amber-900' : 'text-stone-700'
                    }`}
                  >
                    {lvl.label}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {lvl.enLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
