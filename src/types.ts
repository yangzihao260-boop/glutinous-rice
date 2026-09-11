export type ItemType = 'lantern' | 'glutinous_rice';

export type GameMode = 'target_lantern' | 'target_glutinous_rice';

export type SpeedLevel = 'slow' | 'medium' | 'fast' | 'super';

export interface SpeedConfig {
  id: SpeedLevel;
  label: string;
  enLabel: string;
  speedMultiplier: number;
  durationSeconds: number; // travel time across conveyor in seconds
  spawnIntervalMs: number; // spawn rate interval
  badgeColor: string;
}

export interface ConveyorItem {
  id: string;
  type: ItemType;
  xPercent: number; // 0 (left) to 105 (right)
  yOffset: number; // slight random vertical bounce
  speedPercentPerSec: number; // speed
  isHit: boolean;
  hitResult?: 'correct' | 'wrong';
  createdAt: number;
}

export interface FloatingScore {
  id: string;
  points: number;
  x: number;
  y: number;
  text: string;
  isPositive: boolean;
}

export interface GameStats {
  score: number;
  correctHits: number;
  wrongHits: number;
  totalMissed: number; // items that passed without being clicked when they were target
  combo: number;
  maxCombo: number;
}
