import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  GameMode,
  SpeedLevel,
  SpeedConfig,
  ConveyorItem,
  FloatingScore,
  GameStats,
} from './types';
import { soundEngine } from './utils/audio';
import { ConveyorBelt } from './components/ConveyorBelt';
import { ScoreBoard } from './components/ScoreBoard';
import { ControlsHeader } from './components/ControlsHeader';
import { WordTeachModal } from './components/WordTeachModal';
import { Sparkles, Trophy, Lightbulb, Play } from 'lucide-react';

const SPEED_CONFIGS: SpeedConfig[] = [
  {
    id: 'slow',
    label: '慢速',
    enLabel: 'Slow (1x)',
    speedMultiplier: 1.0,
    durationSeconds: 7.0,
    spawnIntervalMs: 1900,
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'medium',
    label: '中速',
    enLabel: 'Medium (1.8x)',
    speedMultiplier: 1.8,
    durationSeconds: 4.0,
    spawnIntervalMs: 1200,
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'fast',
    label: '快速 5x',
    enLabel: 'Fast (5x 极速)',
    speedMultiplier: 11.0,
    durationSeconds: 0.84, // 5x faster than 4.2s
    spawnIntervalMs: 260,
    badgeColor: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'super',
    label: '超快速 5x',
    enLabel: 'Super (5x 极速冲刺)',
    speedMultiplier: 16.0,
    durationSeconds: 0.56, // 5x faster than 2.8s
    spawnIntervalMs: 180,
    badgeColor: 'bg-red-100 text-red-700',
  },
];

export default function App() {
  // Game Configuration State
  const [currentMode, setCurrentMode] = useState<GameMode>('target_lantern');
  const [currentSpeed, setCurrentSpeed] = useState<SpeedLevel>('medium');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [isSfxMuted, setIsSfxMuted] = useState<boolean>(false);
  const [showWordLabels, setShowWordLabels] = useState<boolean>(true);
  const [isTeachModalOpen, setIsTeachModalOpen] = useState<boolean>(false);
  const [hasStartedInteracting, setHasStartedInteracting] = useState<boolean>(false);

  // Conveyor Items with initial items ready on load
  const [items, setItems] = useState<ConveyorItem[]>([
    {
      id: 'init-lantern-1',
      type: 'lantern',
      xPercent: 22,
      yOffset: 0,
      speedPercentPerSec: 15,
      isHit: false,
      createdAt: 0,
    },
    {
      id: 'init-rice-2',
      type: 'glutinous_rice',
      xPercent: 58,
      yOffset: 0,
      speedPercentPerSec: 15,
      isHit: false,
      createdAt: 0,
    },
    {
      id: 'init-lantern-3',
      type: 'lantern',
      xPercent: 88,
      yOffset: 0,
      speedPercentPerSec: 15,
      isHit: false,
      createdAt: 0,
    },
  ]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  // Statistics
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    correctHits: 0,
    wrongHits: 0,
    totalMissed: 0,
    combo: 0,
    maxCombo: 0,
  });

  // Active Speed Configuration
  const speedConfig =
    SPEED_CONFIGS.find((c) => c.id === currentSpeed) || SPEED_CONFIGS[1];

  // References for animation loop & spawn timing (using performance.now() scale)
  const lastSpawnTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const currentModeRef = useRef<GameMode>(currentMode);
  currentModeRef.current = currentMode;

  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;

  const speedConfigRef = useRef<SpeedConfig>(speedConfig);
  speedConfigRef.current = speedConfig;

  // Handle Mode Change
  const handleModeChange = (newMode: GameMode) => {
    setCurrentMode(newMode);
    // announce mode with speech feedback
    const word = newMode === 'target_lantern' ? 'lantern' : 'glutinous rice';
    soundEngine.speakWord(word);
  };

  // Toggle Background Music
  const handleToggleBgm = () => {
    setHasStartedInteracting(true);
    const active = soundEngine.toggleBGM();
    setIsBgmPlaying(active);
  };

  // Toggle SFX
  const handleToggleSfx = () => {
    const nextMuted = !isSfxMuted;
    setIsSfxMuted(nextMuted);
    soundEngine.setMute(nextMuted);
  };

  // Reset Stats & Respawn Items
  const handleResetStats = () => {
    setStats({
      score: 0,
      correctHits: 0,
      wrongHits: 0,
      totalMissed: 0,
      combo: 0,
      maxCombo: 0,
    });
    lastSpawnTimeRef.current = 0;
    setItems([
      {
        id: `item-${Date.now()}-1`,
        type: 'lantern',
        xPercent: 20,
        yOffset: 0,
        speedPercentPerSec: 15,
        isHit: false,
        createdAt: 0,
      },
      {
        id: `item-${Date.now()}-2`,
        type: 'glutinous_rice',
        xPercent: 60,
        yOffset: 0,
        speedPercentPerSec: 15,
        isHit: false,
        createdAt: 0,
      },
    ]);
  };

  // Toggle Fullscreen for Classroom Projectors
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Trigger celebration confetti
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#ef4444', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  // Item Click Handler - Extremely responsive with immediate scoring & sounds
  const handleItemClick = (
    item: ConveyorItem,
    clientX: number,
    clientY: number
  ) => {
    if (item.isHit || isPaused) return;

    setHasStartedInteracting(true);

    const targetType =
      currentModeRef.current === 'target_lantern'
        ? 'lantern'
        : 'glutinous_rice';

    const isCorrect = item.type === targetType;

    // Get position relative to conveyor stage
    const stageEl = document.getElementById('conveyor-stage');
    let relX = 200;
    let relY = 100;
    if (stageEl) {
      const rect = stageEl.getBoundingClientRect();
      relX = clientX - rect.left;
      relY = clientY - rect.top;
    }

    // Create floating score animation
    const floatingId = `score-${Date.now()}-${Math.random()}`;
    const newFloating: FloatingScore = {
      id: floatingId,
      points: isCorrect ? 5 : -1,
      x: relX,
      y: relY,
      text: isCorrect ? '+5' : '-1',
      isPositive: isCorrect,
    };
    setFloatingScores((prev) => [...prev, newFloating]);

    if (isCorrect) {
      // 1. Play Reward Sound (+5)
      soundEngine.playRewardSound();

      // 2. Update Stats (+5 points)
      setStats((prev) => {
        const nextScore = prev.score + 5;
        const nextCombo = prev.combo + 1;
        const nextMaxCombo = Math.max(prev.maxCombo, nextCombo);

        // Milestone reward: combo streak of 5 or multiple of 10
        if (nextCombo > 0 && nextCombo % 5 === 0) {
          setTimeout(() => {
            soundEngine.playComboSound();
            triggerConfetti();
          }, 150);
        }

        return {
          ...prev,
          score: nextScore,
          correctHits: prev.correctHits + 1,
          combo: nextCombo,
          maxCombo: nextMaxCombo,
        };
      });

      // 3. Mark item as hit (correct)
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, isHit: true, hitResult: 'correct' } : i
        )
      );
    } else {
      // 1. Play Error Sound (-1)
      soundEngine.playErrorSound();

      // 2. Update Stats (-1 point, reset combo)
      setStats((prev) => ({
        ...prev,
        score: Math.max(0, prev.score - 1),
        wrongHits: prev.wrongHits + 1,
        combo: 0,
      }));

      // 3. Mark item as hit (wrong)
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, isHit: true, hitResult: 'wrong' } : i
        )
      );
    }

    // Clean up hit item quickly to maintain belt clearance, proportional to speed
    const cleanupDelay = Math.min(240, Math.max(90, speedConfigRef.current.durationSeconds * 120));
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }, cleanupDelay);

    // Clean up floating score tag
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((s) => s.id !== floatingId));
    }, 850);
  };

  // Primary Conveyor Belt Animation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const deltaMs = Math.min(now - lastTime, 100); // clamp delta
      lastTime = now;

      if (!isPausedRef.current) {
        const config = speedConfigRef.current;
        // Travel speed: item travels 100% in durationSeconds
        const speedPercentPerSec = 100 / config.durationSeconds;
        const dx = (deltaMs / 1000) * speedPercentPerSec;

        // 1. Move existing items to the right
        setItems((prevItems) => {
          let hasExited = false;
          const updated = prevItems.map((item) => {
            return {
              ...item,
              xPercent: item.xPercent + dx,
            };
          });

          // Remove items that crossed the right exit (> 106%)
          return updated.filter((item) => {
            if (item.xPercent > 106) {
              hasExited = true;
              return false;
            }
            return true;
          });
        });

        // 2. Spawn new items based on spawn interval
        if (lastSpawnTimeRef.current === 0) {
          lastSpawnTimeRef.current = now;
        }

        if (now - lastSpawnTimeRef.current >= config.spawnIntervalMs) {
          lastSpawnTimeRef.current = now;

          // Randomize type (50% lantern, 50% glutinous_rice)
          const randomType = Math.random() < 0.5 ? 'lantern' : 'glutinous_rice';
          const yOffset = (Math.random() - 0.5) * 8; // slight gentle variation

          const newItem: ConveyorItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: randomType,
            xPercent: -4, // starts just off the left edge
            yOffset,
            speedPercentPerSec,
            isHit: false,
            createdAt: now,
          };

          setItems((prev) => [...prev, newItem]);
        }
      }

      requestRef.current = requestAnimationFrame(updateLoop);
    };

    requestRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-stone-100 text-stone-800 p-3 sm:p-6 flex flex-col items-center justify-between font-sans">
      {/* Interactive Controls & Header */}
      <ControlsHeader
        currentMode={currentMode}
        onModeChange={handleModeChange}
        speedLevels={SPEED_CONFIGS}
        currentSpeed={currentSpeed}
        onSpeedChange={setCurrentSpeed}
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
        isSfxMuted={isSfxMuted}
        onToggleSfx={handleToggleSfx}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((p) => !p)}
        showWordLabels={showWordLabels}
        onToggleWordLabels={() => setShowWordLabels((v) => !v)}
        onOpenTeachModal={() => setIsTeachModalOpen(true)}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Conveyor Belt Game Stage */}
      <section className="w-full flex-1 flex flex-col items-center justify-center my-2">
        <ConveyorBelt
          items={items}
          floatingScores={floatingScores}
          currentMode={currentMode}
          speedMultiplier={speedConfig.speedMultiplier}
          onItemClick={handleItemClick}
          isPaused={isPaused}
          showWordLabels={showWordLabels}
        />
      </section>

      {/* Real-time Score Board */}
      <ScoreBoard
        stats={stats}
        currentMode={currentMode}
        onResetStats={handleResetStats}
      />

      {/* Teacher Teaching Notes & Quick Classroom Guide */}
      <footer className="w-full max-w-5xl mx-auto mt-2 p-3.5 rounded-2xl bg-white/80 border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong>教学互动建议：</strong> 先点击【Word Cards】带领全班跟读单词发音，再开启游戏。可组织两位学生分组比赛得分，或逐步提升传送带速度挑战快速反应！
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsTeachModalOpen(true)}
            className="text-amber-700 font-bold hover:underline"
          >
            查看备课词汇卡 ➔
          </button>
        </div>
      </footer>

      {/* Word Teaching Modal */}
      <WordTeachModal
        isOpen={isTeachModalOpen}
        onClose={() => setIsTeachModalOpen(false)}
      />
    </main>
  );
}
