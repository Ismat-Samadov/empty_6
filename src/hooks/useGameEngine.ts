// ============================================================
// Game Engine Hook — core game loop, state management, input
// ============================================================

"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { Tile, TileRow, GameState, Difficulty, ScoreInfo } from "@/utils/gameTypes";
import { DIFFICULTY_CONFIGS, COLUMN_COUNT, TAP_ZONE_HEIGHT } from "@/utils/gameConstants";
import {
  generateRow,
  generateInitialRows,
  resetIds,
} from "@/utils/tileGenerator";

// ---- State shape ----

interface GameEngineState {
  gameState: GameState;
  rows: TileRow[];
  score: ScoreInfo;
  speed: number;
  difficulty: Difficulty;
  canvasSize: { w: number; h: number };
  flashTiles: Set<number>; // tile IDs currently flashing
  missedTileId: number | null;
}

// ---- Actions ----

type Action =
  | { type: "START"; canvasSize: { w: number; h: number } }
  | { type: "TICK" }
  | { type: "TAP_COLUMN"; column: number; canvasHeight: number }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESTART" }
  | { type: "SET_DIFFICULTY"; difficulty: Difficulty }
  | { type: "SET_CANVAS"; size: { w: number; h: number } }
  | { type: "CLEAR_FLASH"; tileId: number };

// ---- Reducer ----

function buildInitialState(difficulty: Difficulty): GameEngineState {
  return {
    gameState: "idle",
    rows: [],
    score: { current: 0, best: 0, combo: 0, maxCombo: 0 },
    speed: DIFFICULTY_CONFIGS[difficulty].initialSpeed,
    difficulty,
    canvasSize: { w: 320, h: 600 },
    flashTiles: new Set(),
    missedTileId: null,
  };
}

function gameReducer(state: GameEngineState, action: Action): GameEngineState {
  const cfg = DIFFICULTY_CONFIGS[state.difficulty];

  switch (action.type) {
    case "SET_DIFFICULTY":
      return buildInitialState(action.difficulty);

    case "SET_CANVAS":
      return { ...state, canvasSize: action.size };

    case "START": {
      resetIds();
      const rows = generateInitialRows(
        action.canvasSize.h,
        cfg.tileHeight,
        cfg.rowGap
      );
      return {
        ...state,
        gameState: "playing",
        rows,
        score: { current: 0, best: state.score.best, combo: 0, maxCombo: 0 },
        speed: cfg.initialSpeed,
        canvasSize: action.canvasSize,
        flashTiles: new Set(),
        missedTileId: null,
      };
    }

    case "PAUSE":
      return state.gameState === "playing"
        ? { ...state, gameState: "paused" }
        : state;

    case "RESUME":
      return state.gameState === "paused"
        ? { ...state, gameState: "playing" }
        : state;

    case "RESTART": {
      resetIds();
      const rows = generateInitialRows(
        state.canvasSize.h,
        cfg.tileHeight,
        cfg.rowGap
      );
      return {
        ...state,
        gameState: "playing",
        rows,
        score: { current: 0, best: state.score.best, combo: 0, maxCombo: 0 },
        speed: cfg.initialSpeed,
        flashTiles: new Set(),
        missedTileId: null,
      };
    }

    case "TICK": {
      if (state.gameState !== "playing") return state;

      const { w, h } = state.canvasSize;
      const rowStep = cfg.tileHeight + cfg.rowGap;

      // Move rows down
      let updatedRows = state.rows.map((row) => ({
        ...row,
        y: row.y + state.speed,
        tiles: row.tiles.map((t) => ({ ...t, y: t.y + state.speed })),
      }));

      // Check for missed tiles (black tile scrolled past bottom without being tapped)
      let gameOver = false;
      let missedTileId: number | null = null;

      for (const row of updatedRows) {
        for (const tile of row.tiles) {
          if (tile.isBlack && !tile.tapped && tile.y > h) {
            gameOver = true;
            missedTileId = tile.id;
            break;
          }
        }
        if (gameOver) break;
      }

      if (gameOver) {
        return {
          ...state,
          gameState: "gameover",
          rows: updatedRows,
          missedTileId,
          score: {
            ...state.score,
            best: Math.max(state.score.current, state.score.best),
          },
        };
      }

      // Remove rows that are fully below canvas
      updatedRows = updatedRows.filter((row) => row.y < h + cfg.tileHeight * 2);

      // Add new rows at the top if needed
      const topY =
        updatedRows.length > 0
          ? Math.min(...updatedRows.map((r) => r.y))
          : 0;
      let currentTop = topY;
      while (currentTop > -cfg.tileHeight) {
        currentTop -= rowStep;
        updatedRows.push(generateRow(currentTop, cfg.tileHeight));
      }

      // Canvas width hint (unused directly, kept for potential future use)
      void w;

      return {
        ...state,
        rows: updatedRows,
      };
    }

    case "TAP_COLUMN": {
      if (state.gameState !== "playing") return state;

      const { canvasHeight } = action;
      const tapZoneTop = canvasHeight - TAP_ZONE_HEIGHT;

      // Find the lowest black tile in the tapped column that's in the tap zone
      let targetTile: Tile | null = null;
      let targetRowIdx = -1;
      let targetTileIdx = -1;

      for (let ri = 0; ri < state.rows.length; ri++) {
        const row = state.rows[ri];
        for (let ti = 0; ti < row.tiles.length; ti++) {
          const tile = row.tiles[ti];
          if (
            tile.column === action.column &&
            tile.isBlack &&
            !tile.tapped &&
            tile.y + tile.height > tapZoneTop &&
            tile.y < canvasHeight + tile.height
          ) {
            // Pick the lowest (highest y value) eligible tile
            if (!targetTile || tile.y > targetTile.y) {
              targetTile = tile;
              targetRowIdx = ri;
              targetTileIdx = ti;
            }
          }
        }
      }

      // No valid black tile — tapped white or empty → game over
      if (!targetTile) {
        return {
          ...state,
          gameState: "gameover",
          score: {
            ...state.score,
            best: Math.max(state.score.current, state.score.best),
          },
        };
      }

      // Mark tile as tapped
      const newRows = state.rows.map((row, ri) => {
        if (ri !== targetRowIdx) return row;
        return {
          ...row,
          tiles: row.tiles.map((t, ti) => {
            if (ti !== targetTileIdx) return t;
            return { ...t, tapped: true, tapTime: Date.now() };
          }),
        };
      });

      // Update score & combo
      const newCombo = state.score.combo + 1;
      const newCurrent = state.score.current + 1;
      const newMaxCombo = Math.max(state.score.maxCombo, newCombo);
      const newBest = Math.max(state.score.best, newCurrent);

      // Speed progression — recalculate every incrementEvery taps
      const newSpeed = Math.min(
        cfg.initialSpeed +
          Math.floor(newCurrent / cfg.incrementEvery) * cfg.speedIncrement,
        cfg.maxSpeed
      );

      // Add to flash set
      const newFlash = new Set(state.flashTiles);
      newFlash.add(targetTile.id);

      return {
        ...state,
        rows: newRows,
        speed: newSpeed,
        score: {
          current: newCurrent,
          best: newBest,
          combo: newCombo,
          maxCombo: newMaxCombo,
        },
        flashTiles: newFlash,
      };
    }

    case "CLEAR_FLASH": {
      const newFlash = new Set(state.flashTiles);
      newFlash.delete(action.tileId);
      return { ...state, flashTiles: newFlash };
    }

    default:
      return state;
  }
}

// ---- Hook ----

interface UseGameEngineOptions {
  onTap: (column: number) => void;
  onMiss: () => void;
  onGameOver: () => void;
  onCombo: (combo: number) => void;
  onStart: () => void;
}

export function useGameEngine(opts: UseGameEngineOptions) {
  const [state, dispatch] = useReducer(
    gameReducer,
    buildInitialState("medium")
  );

  const rafRef = useRef<number>(0);
  const prevScoreRef = useRef(0);
  const prevComboRef = useRef(0);

  // ---- Game loop ----
  const tick = useCallback(() => {
    dispatch({ type: "TICK" });
  }, []);

  useEffect(() => {
    if (state.gameState === "playing") {
      const loop = () => {
        tick();
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [state.gameState, tick]);

  // ---- Sound/callback triggers ----
  useEffect(() => {
    const cur = state.score.current;
    const combo = state.score.combo;

    if (cur > prevScoreRef.current) {
      // New tap
      if (combo > 1 && combo % 10 === 0) {
        opts.onCombo(combo);
      }
      prevScoreRef.current = cur;
      prevComboRef.current = combo;
    }
  }, [state.score, opts]);

  useEffect(() => {
    if (state.gameState === "gameover") {
      opts.onGameOver();
    }
  }, [state.gameState]); // eslint-disable-line

  // ---- Public API ----

  const startGame = useCallback(
    (canvasSize: { w: number; h: number }) => {
      opts.onStart();
      dispatch({ type: "START", canvasSize });
    },
    [opts]
  );

  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const resume = useCallback(() => dispatch({ type: "RESUME" }), []);
  const restart = useCallback(() => {
    opts.onStart();
    dispatch({ type: "RESTART" });
  }, [opts]);

  const setDifficulty = useCallback(
    (difficulty: Difficulty) => dispatch({ type: "SET_DIFFICULTY", difficulty }),
    []
  );

  const setCanvasSize = useCallback(
    (size: { w: number; h: number }) =>
      dispatch({ type: "SET_CANVAS", size }),
    []
  );

  const tapColumn = useCallback(
    (column: number, canvasHeight: number) => {
      dispatch({ type: "TAP_COLUMN", column, canvasHeight });
      opts.onTap(column);
    },
    [opts]
  );

  const clearFlash = useCallback(
    (tileId: number) => dispatch({ type: "CLEAR_FLASH", tileId }),
    []
  );

  return {
    ...state,
    startGame,
    pause,
    resume,
    restart,
    setDifficulty,
    setCanvasSize,
    tapColumn,
    clearFlash,
  };
}
