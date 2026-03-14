// ============================================================
// TapButtons — on-screen tap buttons for mobile (below canvas)
// ============================================================

"use client";

import { useCallback, useState } from "react";
import { COLUMN_COUNT, COLUMN_NEON_COLORS } from "@/utils/gameConstants";

interface TapButtonsProps {
  onTapColumn: (col: number) => void;
  disabled: boolean;
}

export default function TapButtons({ onTapColumn, disabled }: TapButtonsProps) {
  const [pressed, setPressed] = useState<Record<number, boolean>>({});

  const handleDown = useCallback(
    (col: number) => {
      if (disabled) return;
      setPressed((p) => ({ ...p, [col]: true }));
      onTapColumn(col);
    },
    [disabled, onTapColumn]
  );

  const handleUp = useCallback((col: number) => {
    setPressed((p) => ({ ...p, [col]: false }));
  }, []);

  return (
    <div className="flex w-full gap-0.5">
      {Array.from({ length: COLUMN_COUNT }, (_, col) => {
        const neon = COLUMN_NEON_COLORS[col];
        const isPressed = pressed[col];
        return (
          <button
            key={col}
            disabled={disabled}
            onPointerDown={() => handleDown(col)}
            onPointerUp={() => handleUp(col)}
            onPointerLeave={() => handleUp(col)}
            className="flex-1 h-14 flex items-center justify-center text-white/30 text-xl font-black
              rounded-b-xl border-t-0 border transition-all duration-75 active:scale-95
              select-none touch-none"
            style={{
              borderColor: isPressed ? neon : "rgba(255,255,255,0.08)",
              backgroundColor: isPressed ? `${neon}22` : "rgba(255,255,255,0.02)",
              boxShadow: isPressed ? `0 0 18px ${neon}55` : "none",
              color: isPressed ? neon : "rgba(255,255,255,0.2)",
            }}
          >
            {["A", "S", "D", "F"][col]}
          </button>
        );
      })}
    </div>
  );
}
