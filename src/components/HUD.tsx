// ============================================================
// HUD — in-game score display, pause button, speed indicator
// ============================================================

"use client";

import { motion, AnimatePresence } from "framer-motion";

interface HUDProps {
  score: number;
  highScore: number;
  combo: number;
  speed: number;
  onPause: () => void;
}

export default function HUD({ score, highScore, combo, speed, onPause }: HUDProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2 pointer-events-none">
      {/* Left: score */}
      <div className="flex flex-col items-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={score}
            className="text-3xl font-black text-white leading-none"
            initial={{ scale: 1.25, color: "#00f5ff" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.2 }}
          >
            {score}
          </motion.div>
        </AnimatePresence>
        <div className="text-white/35 text-xs">Best: {highScore}</div>
      </div>

      {/* Center: combo */}
      <AnimatePresence>
        {combo >= 5 && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
          >
            <div className="text-[#ff00e5] text-xs font-bold uppercase tracking-wider">
              Combo
            </div>
            <motion.div
              key={combo}
              className="text-[#ff00e5] font-black text-xl leading-none"
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
            >
              x{combo}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right: speed + pause */}
      <div className="flex flex-col items-end gap-1 pointer-events-auto">
        <button
          onClick={onPause}
          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white/90 transition-all active:scale-90"
          aria-label="Pause"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <rect x="5" y="4" width="4" height="16" rx="1" />
            <rect x="15" y="4" width="4" height="16" rx="1" />
          </svg>
        </button>
        <div className="text-white/30 text-xs">
          {speed.toFixed(1)}×
        </div>
      </div>
    </div>
  );
}
