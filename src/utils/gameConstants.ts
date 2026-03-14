// ============================================================
// Game Constants
// ============================================================

import { DifficultyConfig, Difficulty } from "./gameTypes";

/** Number of columns in the game */
export const COLUMN_COUNT = 4;

/** How many tile rows are visible at once (buffer) */
export const VISIBLE_ROWS = 8;

/** Tap zone height at the bottom (px) — tiles must reach here */
export const TAP_ZONE_HEIGHT = 120;

/** How many frames a tapped tile shows a flash before removal */
export const FLASH_FRAMES = 6;

/** localStorage key for high scores per difficulty */
export const HIGH_SCORE_KEY = "piano_tiles_highscore";

/** Neon colors for columns */
export const COLUMN_NEON_COLORS = [
  "#00f5ff", // cyan
  "#ff00e5", // magenta
  "#7fff00", // chartreuse
  "#ff6a00", // orange
];

/** Difficulty configurations */
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "Easy",
    initialSpeed: 3.5,
    speedIncrement: 0.3,
    incrementEvery: 15,
    tileHeight: 120,
    rowGap: 10,
    maxSpeed: 7,
  },
  medium: {
    label: "Medium",
    initialSpeed: 5.5,
    speedIncrement: 0.5,
    incrementEvery: 10,
    tileHeight: 100,
    rowGap: 8,
    maxSpeed: 12,
  },
  hard: {
    label: "Hard",
    initialSpeed: 8,
    speedIncrement: 0.7,
    incrementEvery: 8,
    tileHeight: 80,
    rowGap: 6,
    maxSpeed: 18,
  },
};
