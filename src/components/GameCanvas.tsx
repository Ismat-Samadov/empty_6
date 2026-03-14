// ============================================================
// GameCanvas — renders the game board via HTML5 Canvas
// ============================================================

"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { TileRow, GameState } from "@/utils/gameTypes";
import { COLUMN_COUNT, COLUMN_NEON_COLORS, TAP_ZONE_HEIGHT } from "@/utils/gameConstants";

interface GameCanvasProps {
  rows: TileRow[];
  flashTiles: Set<number>;
  gameState: GameState;
  onTapColumn: (col: number, canvasHeight: number) => void;
  onSizeChange: (size: { w: number; h: number }) => void;
  missedTileId: number | null;
  score: number;
  speed: number;
}

export interface GameCanvasHandle {
  getSize: () => { w: number; h: number };
}

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  (
    {
      rows,
      flashTiles,
      gameState,
      onTapColumn,
      onSizeChange,
      missedTileId,
      score: _score,
      speed: _speed,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Expose size getter to parent
    useImperativeHandle(ref, () => ({
      getSize: () => {
        const c = canvasRef.current;
        return { w: c?.width ?? 320, h: c?.height ?? 600 };
      },
    }));

    // Resize observer
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const { width, height } = entry.contentRect;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = Math.floor(width);
        canvas.height = Math.floor(height);
        onSizeChange({ w: canvas.width, h: canvas.height });
      });
      ro.observe(container);
      return () => ro.disconnect();
    }, [onSizeChange]);

    // ---- Draw ----
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width: W, height: H } = canvas;
      const colW = W / COLUMN_COUNT;

      // Background
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, W, H);

      // Grid lines (subtle)
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let c = 1; c < COLUMN_COUNT; c++) {
        ctx.beginPath();
        ctx.moveTo(c * colW, 0);
        ctx.lineTo(c * colW, H);
        ctx.stroke();
      }

      // Tap zone background
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fillRect(0, H - TAP_ZONE_HEIGHT, W, TAP_ZONE_HEIGHT);
      // Tap zone top line
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H - TAP_ZONE_HEIGHT);
      ctx.lineTo(W, H - TAP_ZONE_HEIGHT);
      ctx.stroke();

      // Tap zone label
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.font = `${Math.max(10, colW * 0.18)}px monospace`;
      ctx.textAlign = "center";
      for (let c = 0; c < COLUMN_COUNT; c++) {
        ctx.fillText("▼", c * colW + colW / 2, H - TAP_ZONE_HEIGHT / 2 + 5);
      }

      // ---- Draw tiles ----
      for (const row of rows) {
        for (const tile of row.tiles) {
          const x = tile.column * colW;
          const y = tile.y;
          const w = colW - 2;
          const h = tile.height;
          const neon = COLUMN_NEON_COLORS[tile.column];

          if (tile.isBlack) {
            const isFlashing = flashTiles.has(tile.id);
            const isMissed = missedTileId === tile.id;

            if (isFlashing) {
              // Flash: bright neon fill
              ctx.fillStyle = neon;
              ctx.shadowColor = neon;
              ctx.shadowBlur = 24;
              ctx.fillRect(x + 1, y, w, h);
              ctx.shadowBlur = 0;
            } else if (isMissed) {
              // Missed: red
              ctx.fillStyle = "#ff2244";
              ctx.shadowColor = "#ff2244";
              ctx.shadowBlur = 20;
              ctx.fillRect(x + 1, y, w, h);
              ctx.shadowBlur = 0;
            } else {
              // Normal black tile with neon border glow
              ctx.fillStyle = "#111118";
              ctx.fillRect(x + 1, y, w, h);

              // Neon edge highlight
              ctx.strokeStyle = neon;
              ctx.shadowColor = neon;
              ctx.shadowBlur = 8;
              ctx.lineWidth = 1.5;
              ctx.strokeRect(x + 1.75, y + 0.75, w - 1.5, h - 1.5);
              ctx.shadowBlur = 0;

              // Top shine
              const shine = ctx.createLinearGradient(x, y, x, y + h * 0.3);
              shine.addColorStop(0, "rgba(255,255,255,0.08)");
              shine.addColorStop(1, "rgba(255,255,255,0)");
              ctx.fillStyle = shine;
              ctx.fillRect(x + 1, y, w, h * 0.3);
            }
          } else {
            // White tile — very dark, nearly invisible fill
            ctx.fillStyle = "rgba(255,255,255,0.015)";
            ctx.fillRect(x + 1, y, w, h);
          }
        }
      }

      // If game over overlay
      if (gameState === "gameover") {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
      }
      if (gameState === "paused") {
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `bold ${Math.max(20, W * 0.1)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", W / 2, H / 2);
      }
    }, [rows, flashTiles, gameState, missedTileId]);

    // ---- Input handling ----
    const getColumn = useCallback(
      (clientX: number): number => {
        const canvas = canvasRef.current;
        if (!canvas) return 0;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const colW = canvas.width / COLUMN_COUNT;
        return Math.min(Math.floor(x / colW), COLUMN_COUNT - 1);
      },
      []
    );

    const handlePointer = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (gameState !== "playing") return;
        e.preventDefault();
        const col = getColumn(e.clientX);
        const h = canvasRef.current?.height ?? 600;
        onTapColumn(col, h);
      },
      [gameState, getColumn, onTapColumn]
    );

    return (
      <div ref={containerRef} className="relative w-full h-full select-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          onPointerDown={handlePointer}
          style={{ cursor: gameState === "playing" ? "pointer" : "default" }}
        />
      </div>
    );
  }
);

GameCanvas.displayName = "GameCanvas";
export default GameCanvas;
