// ============================================================
// High Score Hook — persists scores per difficulty in localStorage
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Difficulty } from "@/utils/gameTypes";
import { HIGH_SCORE_KEY } from "@/utils/gameConstants";

type HighScores = Record<Difficulty, number>;

const defaultScores: HighScores = { easy: 0, medium: 0, hard: 0 };

function loadScores(): HighScores {
  if (typeof window === "undefined") return defaultScores;
  try {
    const raw = localStorage.getItem(HIGH_SCORE_KEY);
    if (!raw) return defaultScores;
    return { ...defaultScores, ...JSON.parse(raw) };
  } catch {
    return defaultScores;
  }
}

function saveScores(scores: HighScores): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(scores));
  } catch {
    // ignore
  }
}

export function useHighScore(difficulty: Difficulty) {
  const [scores, setScores] = useState<HighScores>(defaultScores);

  // Load from localStorage on mount
  useEffect(() => {
    setScores(loadScores());
  }, []);

  const highScore = scores[difficulty];

  /** Submit a new score — saves only if it beats the record */
  const submitScore = useCallback(
    (score: number) => {
      setScores((prev) => {
        if (score <= prev[difficulty]) return prev;
        const updated = { ...prev, [difficulty]: score };
        saveScores(updated);
        return updated;
      });
    },
    [difficulty]
  );

  return { highScore, submitScore };
}
