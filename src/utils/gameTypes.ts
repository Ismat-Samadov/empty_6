// ============================================================
// Game Types & Interfaces
// ============================================================

/** Possible states the game can be in */
export type GameState = "idle" | "playing" | "paused" | "gameover";

/** Difficulty presets */
export type Difficulty = "easy" | "medium" | "hard";

/** A single tile on the board */
export interface Tile {
  id: number;
  column: number;      // 0-3
  y: number;           // current Y position (top of tile)
  height: number;      // tile height in px
  isBlack: boolean;    // true = must tap, false = forbidden (white)
  tapped: boolean;     // has the player tapped this tile?
  missed: boolean;     // did the player miss it?
  tapTime?: number;    // timestamp when tapped (for flash animation)
}

/** A row of 4 tiles — exactly one is black */
export interface TileRow {
  id: number;
  tiles: Tile[];
  y: number;
}

/** Player score info */
export interface ScoreInfo {
  current: number;
  best: number;
  combo: number;
  maxCombo: number;
}

/** Difficulty configuration */
export interface DifficultyConfig {
  label: string;
  initialSpeed: number;      // px per frame
  speedIncrement: number;    // speed added every N points
  incrementEvery: number;    // score interval for speed-up
  tileHeight: number;        // height of each tile in px
  rowGap: number;            // gap between tile rows in px
  maxSpeed: number;          // cap
}

/** Sound identifiers */
export type SoundId =
  | "tap"
  | "miss"
  | "gameOver"
  | "start"
  | "combo"
  | "bgm";
