// ============================================================
// GameOverScreen — shown when the player loses
// ============================================================

"use client";

import { motion } from "framer-motion";
import { Difficulty } from "@/utils/gameTypes";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  maxCombo: number;
  difficulty: Difficulty;
  isNewBest: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export default function GameOverScreen({
  score,
  highScore,
  maxCombo,
  difficulty,
  isNewBest,
  onRestart,
  onMenu,
}: GameOverScreenProps) {
  const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0a0a0f]/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Game Over heading */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="text-center mb-6"
      >
        <motion.div
          className="text-4xl font-black text-white/90 mb-1"
          animate={{ color: ["#ffffff", "#ff2244", "#ffffff"] }}
          transition={{ duration: 1.2, repeat: 2 }}
        >
          GAME OVER
        </motion.div>
        <div className="text-white/40 text-sm tracking-widest uppercase">
          {diffLabel} Mode
        </div>
      </motion.div>

      {/* Score card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
        className="w-56 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 mb-6 text-center"
      >
        {isNewBest && (
          <motion.div
            className="text-[#00f5ff] text-xs font-bold tracking-widest uppercase mb-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ✦ New Record ✦
          </motion.div>
        )}

        <div className="mb-3">
          <div className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
            Score
          </div>
          <motion.div
            className="text-5xl font-black text-white"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {score}
          </motion.div>
        </div>

        <div className="flex justify-around pt-3 border-t border-white/10">
          <div className="text-center">
            <div className="text-white/35 text-xs uppercase tracking-wider">Best</div>
            <div className="text-[#00f5ff] font-bold text-lg">{highScore}</div>
          </div>
          <div className="text-center">
            <div className="text-white/35 text-xs uppercase tracking-wider">Combo</div>
            <div className="text-[#ff00e5] font-bold text-lg">x{maxCombo}</div>
          </div>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-col gap-3 w-48"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={onRestart}
          className="py-3 rounded-full font-black text-lg text-[#0a0a0f] bg-[#00f5ff] shadow-[0_0_24px_rgba(0,245,255,0.5)] hover:shadow-[0_0_40px_rgba(0,245,255,0.8)] transition-all"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          RETRY
        </motion.button>
        <motion.button
          onClick={onMenu}
          className="py-3 rounded-full font-bold text-sm text-white/60 border border-white/20 hover:border-white/40 hover:text-white/80 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Menu
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
