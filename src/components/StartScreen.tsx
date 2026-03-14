// ============================================================
// StartScreen — initial screen shown before game starts
// ============================================================

"use client";

import { motion } from "framer-motion";
import { Difficulty } from "@/utils/gameTypes";
import { DIFFICULTY_CONFIGS } from "@/utils/gameConstants";

interface StartScreenProps {
  difficulty: Difficulty;
  highScore: number;
  onStart: () => void;
  onSelectDifficulty: (d: Difficulty) => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export default function StartScreen({
  difficulty,
  highScore,
  onStart,
  onSelectDifficulty,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}: StartScreenProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0a0a0f]/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-2 text-center"
      >
        <div className="text-5xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(0,245,255,0.7)] mb-1">
          Piano
        </div>
        <div className="text-5xl font-black tracking-tight text-[#00f5ff] drop-shadow-[0_0_20px_rgba(0,245,255,0.9)]">
          Tiles
        </div>
        <div className="mt-2 text-xs text-white/40 tracking-widest uppercase">
          Rhythm &amp; Reflex
        </div>
      </motion.div>

      {/* Piano keys decoration */}
      <motion.div
        className="flex gap-0.5 my-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="w-6 h-12 bg-white rounded-b-sm border border-white/20 shadow-lg"
            animate={{ scaleY: [1, 0.85, 1] }}
            transition={{ delay: i * 0.08, duration: 0.4, repeat: Infinity, repeatDelay: 1.5 }}
          />
        ))}
      </motion.div>

      {/* High Score */}
      {highScore > 0 && (
        <motion.div
          className="mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <span className="text-white/50 text-sm">Best: </span>
          <span className="text-[#00f5ff] font-bold text-lg">{highScore}</span>
        </motion.div>
      )}

      {/* Difficulty */}
      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {difficulties.map((d) => {
          const cfg = DIFFICULTY_CONFIGS[d];
          const isSelected = d === difficulty;
          const colors: Record<Difficulty, string> = {
            easy: "border-green-400 text-green-400 shadow-green-400/30",
            medium: "border-yellow-400 text-yellow-400 shadow-yellow-400/30",
            hard: "border-red-400 text-red-400 shadow-red-400/30",
          };
          return (
            <button
              key={d}
              onClick={() => onSelectDifficulty(d)}
              className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200
                ${
                  isSelected
                    ? `${colors[d]} bg-white/5 shadow-lg`
                    : "border-white/20 text-white/40 hover:border-white/40 hover:text-white/70"
                }`}
            >
              {cfg.label}
            </button>
          );
        })}
      </motion.div>

      {/* Start button */}
      <motion.button
        onClick={onStart}
        className="relative px-12 py-4 rounded-full font-black text-xl tracking-widest uppercase text-[#0a0a0f] bg-[#00f5ff] shadow-[0_0_30px_rgba(0,245,255,0.6)] hover:shadow-[0_0_50px_rgba(0,245,255,0.9)] transition-all duration-200 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        PLAY
      </motion.button>

      {/* Controls hint */}
      <motion.div
        className="text-white/25 text-xs text-center mb-4 px-6 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Tap black tiles · Keys A S D F · Space to pause
      </motion.div>

      {/* Sound toggles */}
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        <button
          onClick={onToggleSound}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
            soundEnabled
              ? "border-[#00f5ff]/50 text-[#00f5ff]/80"
              : "border-white/20 text-white/30"
          }`}
        >
          <span>{soundEnabled ? "🔊" : "🔇"}</span>
          <span>SFX</span>
        </button>
        <button
          onClick={onToggleMusic}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
            musicEnabled
              ? "border-[#ff00e5]/50 text-[#ff00e5]/80"
              : "border-white/20 text-white/30"
          }`}
        >
          <span>{musicEnabled ? "🎵" : "🎵"}</span>
          <span>Music</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
