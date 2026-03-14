// ============================================================
// Sound Hook — synthesizes all game audio via Web Audio API
// No external audio files required.
// ============================================================

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type OscType = OscillatorType;

interface SynthNote {
  freq: number;
  type: OscType;
  duration: number;  // seconds
  gain: number;
  attack?: number;   // seconds
  decay?: number;    // seconds
}

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const bgmRef = useRef<ReturnType<typeof startBGM> | null>(null);

  // Lazy-create AudioContext on first user interaction
  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playNote = useCallback(
    (note: SynthNote) => {
      if (!soundEnabled) return;
      const ctx = getCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = note.type;
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime);

      const attack = note.attack ?? 0.005;
      const decay = note.decay ?? 0.1;
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(note.gain, ctx.currentTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + attack + decay
      );

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + note.duration);
    },
    [soundEnabled, getCtx]
  );

  /** Piano-style tile tap sound */
  const playTap = useCallback(
    (column: number) => {
      // Different frequencies per column — C major pentatonic
      const freqs = [261.63, 329.63, 392.0, 523.25];
      playNote({
        freq: freqs[column] ?? 440,
        type: "triangle",
        duration: 0.3,
        gain: 0.4,
        attack: 0.002,
        decay: 0.25,
      });
    },
    [playNote]
  );

  /** Combo reward sound (higher pitch beep) */
  const playCombo = useCallback(() => {
    playNote({ freq: 880, type: "sine", duration: 0.15, gain: 0.3, decay: 0.12 });
    setTimeout(
      () =>
        playNote({
          freq: 1047,
          type: "sine",
          duration: 0.15,
          gain: 0.3,
          decay: 0.12,
        }),
      120
    );
  }, [playNote]);

  /** Miss / wrong tap buzz */
  const playMiss = useCallback(() => {
    playNote({ freq: 120, type: "sawtooth", duration: 0.2, gain: 0.3, decay: 0.18 });
  }, [playNote]);

  /** Game over descending chord */
  const playGameOver = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !soundEnabled) return;
    [440, 349.23, 261.63].forEach((freq, i) => {
      setTimeout(() => {
        playNote({ freq, type: "sawtooth", duration: 0.4, gain: 0.25, decay: 0.35 });
      }, i * 150);
    });
  }, [playNote, soundEnabled, getCtx]);

  /** Start sound */
  const playStart = useCallback(() => {
    [261.63, 329.63, 392.0, 523.25].forEach((freq, i) => {
      setTimeout(() => {
        playNote({ freq, type: "triangle", duration: 0.25, gain: 0.3, decay: 0.2 });
      }, i * 80);
    });
  }, [playNote]);

  // ---- Background Music ----

  function startBGM(ctx: AudioContext) {
    // Simple arpeggiated sequence
    const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
    let step = 0;
    let stopped = false;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.08;
    masterGain.connect(ctx.destination);

    function playBeat() {
      if (stopped) return;
      const freq = notes[step % notes.length];
      step++;

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.5, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(g);
      g.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);

      setTimeout(playBeat, 220);
    }

    playBeat();
    return { stop: () => { stopped = true; masterGain.disconnect(); } };
  }

  // Handle music toggle
  useEffect(() => {
    if (musicEnabled) {
      const ctx = getCtx();
      if (ctx) bgmRef.current = startBGM(ctx);
    } else {
      bgmRef.current?.stop();
      bgmRef.current = null;
    }
    return () => {
      bgmRef.current?.stop();
      bgmRef.current = null;
    };
  }, [musicEnabled, getCtx]);

  const toggleSound = useCallback(() => setSoundEnabled((v) => !v), []);
  const toggleMusic = useCallback(() => setMusicEnabled((v) => !v), []);

  return {
    soundEnabled,
    musicEnabled,
    toggleSound,
    toggleMusic,
    playTap,
    playCombo,
    playMiss,
    playGameOver,
    playStart,
  };
}
