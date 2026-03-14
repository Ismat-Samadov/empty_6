// ============================================================
// Game — top-level game component, orchestrates all state
// ============================================================

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { useGameEngine } from "@/hooks/useGameEngine";
import { useHighScore } from "@/hooks/useHighScore";
import { useSound } from "@/hooks/useSound";
import { Difficulty } from "@/utils/gameTypes";

import GameCanvas, { GameCanvasHandle } from "./GameCanvas";
import HUD from "./HUD";
import StartScreen from "./StartScreen";
import GameOverScreen from "./GameOverScreen";
import PauseScreen from "./PauseScreen";
import TapButtons from "./TapButtons";

export default function Game() {
  // --- Sound ---
  const {
    soundEnabled,
    musicEnabled,
    toggleSound,
    toggleMusic,
    playTap,
    playCombo,
    playMiss,
    playGameOver,
    playStart,
  } = useSound();

  // --- Difficulty ---
  const [difficulty, setDifficultyState] = useState<Difficulty>("medium");

  // --- High Score ---
  const { highScore, submitScore } = useHighScore(difficulty);

  // --- Game engine callbacks ---
  const handleTap = useCallback(
    (column: number) => playTap(column),
    [playTap]
  );
  const handleMiss = useCallback(() => playMiss(), [playMiss]);
  const handleGameOver = useCallback(() => {
    playGameOver();
  }, [playGameOver]);
  const handleCombo = useCallback(
    (combo: number) => {
      void combo;
      playCombo();
    },
    [playCombo]
  );
  const handleStart = useCallback(() => playStart(), [playStart]);

  // --- Engine ---
  const engine = useGameEngine({
    onTap: handleTap,
    onMiss: handleMiss,
    onGameOver: handleGameOver,
    onCombo: handleCombo,
    onStart: handleStart,
  });

  // --- Canvas ref ---
  const canvasRef = useRef<GameCanvasHandle>(null);

  // --- Flash timeout management ---
  const flashTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  useEffect(() => {
    // Schedule flash clear for any newly flashed tile
    engine.flashTiles.forEach((id) => {
      if (!flashTimersRef.current.has(id)) {
        const timer = setTimeout(() => {
          engine.clearFlash(id);
          flashTimersRef.current.delete(id);
        }, 100);
        flashTimersRef.current.set(id, timer);
      }
    });
  }, [engine.flashTiles, engine.clearFlash]); // eslint-disable-line

  // Clear all timers on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      flashTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // --- Submit score on game over ---
  const prevGameState = useRef(engine.gameState);
  useEffect(() => {
    if (
      prevGameState.current === "playing" &&
      engine.gameState === "gameover"
    ) {
      submitScore(engine.score.current);
    }
    prevGameState.current = engine.gameState;
  }, [engine.gameState, engine.score.current, submitScore]);

  // --- Keyboard controls ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.repeat) return;

      // Pause/resume with Space or Escape
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        if (engine.gameState === "playing") engine.pause();
        else if (engine.gameState === "paused") engine.resume();
        return;
      }

      // Column keys
      const colMap: Record<string, number> = {
        a: 0, A: 0,
        s: 1, S: 1,
        d: 2, D: 2,
        f: 3, F: 3,
        ArrowLeft: 0,
        ArrowDown: 1,
        ArrowUp: 2,
        ArrowRight: 3,
      };

      if (e.key in colMap && engine.gameState === "playing") {
        e.preventDefault();
        const col = colMap[e.key];
        const h = canvasRef.current?.getSize().h ?? 600;
        engine.tapColumn(col, h);
      }

      // Enter to start/restart from idle/gameover
      if (e.key === "Enter") {
        if (engine.gameState === "idle") {
          const size = canvasRef.current?.getSize() ?? { w: 320, h: 600 };
          engine.startGame(size);
        } else if (engine.gameState === "gameover") {
          engine.restart();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [engine]);

  // --- Handlers ---
  const handleStartGame = useCallback(() => {
    const size = canvasRef.current?.getSize() ?? { w: 320, h: 600 };
    engine.startGame(size);
  }, [engine]);

  const handleSelectDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficultyState(d);
      engine.setDifficulty(d);
    },
    [engine]
  );

  const handleTapColumn = useCallback(
    (col: number) => {
      const h = canvasRef.current?.getSize().h ?? 600;
      engine.tapColumn(col, h);
    },
    [engine]
  );

  const handleGoToMenu = useCallback(() => {
    engine.setDifficulty(difficulty);
  }, [engine, difficulty]);

  const isNewBest =
    engine.gameState === "gameover" &&
    engine.score.current > 0 &&
    engine.score.current >= highScore;

  return (
    <div className="relative flex flex-col w-full h-full bg-[#0a0a0f] overflow-hidden">
      {/* Game Canvas Area */}
      <div className="relative flex-1 overflow-hidden">
        <GameCanvas
          ref={canvasRef}
          rows={engine.rows}
          flashTiles={engine.flashTiles}
          gameState={engine.gameState}
          onTapColumn={handleTapColumn}
          onSizeChange={engine.setCanvasSize}
          missedTileId={engine.missedTileId}
          score={engine.score.current}
          speed={engine.speed}
        />

        {/* In-game HUD (only during play/pause) */}
        {(engine.gameState === "playing" || engine.gameState === "paused") && (
          <HUD
            score={engine.score.current}
            highScore={highScore}
            combo={engine.score.combo}
            speed={engine.speed}
            onPause={engine.pause}
          />
        )}

        {/* Overlays */}
        <AnimatePresence>
          {engine.gameState === "idle" && (
            <StartScreen
              key="start"
              difficulty={difficulty}
              highScore={highScore}
              onStart={handleStartGame}
              onSelectDifficulty={handleSelectDifficulty}
              soundEnabled={soundEnabled}
              musicEnabled={musicEnabled}
              onToggleSound={toggleSound}
              onToggleMusic={toggleMusic}
            />
          )}
          {engine.gameState === "gameover" && (
            <GameOverScreen
              key="gameover"
              score={engine.score.current}
              highScore={Math.max(highScore, engine.score.current)}
              maxCombo={engine.score.maxCombo}
              difficulty={difficulty}
              isNewBest={isNewBest}
              onRestart={engine.restart}
              onMenu={handleGoToMenu}
            />
          )}
          {engine.gameState === "paused" && (
            <PauseScreen
              key="paused"
              score={engine.score.current}
              onResume={engine.resume}
              onMenu={handleGoToMenu}
              soundEnabled={soundEnabled}
              musicEnabled={musicEnabled}
              onToggleSound={toggleSound}
              onToggleMusic={toggleMusic}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile tap buttons — always visible for layout, enabled only when playing */}
      <TapButtons
        onTapColumn={handleTapColumn}
        disabled={engine.gameState !== "playing"}
      />
    </div>
  );
}
