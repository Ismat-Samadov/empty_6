// ============================================================
// PauseScreen — overlay when game is paused
// ============================================================

"use client";

import { motion } from "framer-motion";

interface PauseScreenProps {
  score: number;
  onResume: () => void;
  onMenu: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export default function PauseScreen({
  score,
  onResume,
  onMenu,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}: PauseScreenProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0a0a0f]/85 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-black text-white mb-1 tracking-widest"
      >
        PAUSED
      </motion.div>
      <div className="text-white/40 text-sm mb-6">Score: {score}</div>

      {/* Audio toggles */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={onToggleSound}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
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
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
            musicEnabled
              ? "border-[#ff00e5]/50 text-[#ff00e5]/80"
              : "border-white/20 text-white/30"
          }`}
        >
          <span>🎵</span>
          <span>Music</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 w-44">
        <motion.button
          onClick={onResume}
          className="py-3 rounded-full font-black text-lg text-[#0a0a0f] bg-[#00f5ff] shadow-[0_0_24px_rgba(0,245,255,0.5)] hover:shadow-[0_0_40px_rgba(0,245,255,0.8)] transition-all"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          RESUME
        </motion.button>
        <motion.button
          onClick={onMenu}
          className="py-3 rounded-full font-bold text-sm text-white/60 border border-white/20 hover:border-white/40 hover:text-white/80 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Menu
        </motion.button>
      </div>
    </motion.div>
  );
}
