'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  computeIntroSequenceState,
  DEFAULT_INTRO_DURATION_MS,
} from '@/lib/intro-loader-sequence';
import { ArrowRight } from 'lucide-react';

interface AnimeIntroLoaderProps {
  onComplete: () => void;
  durationMs?: number;
}

/**
 * Minimal Anime Game-Style Entrance & Loading Sequence for Attack Explorer.
 * Choreographs a 4-phase cel-shaded vector assembly, katana-slash spearhead thrust,
 * slanted anime title lockup, and tabular game-loader progress gauge before
 * unveiling the main workbench.
 */
export function AnimeIntroLoader({
  onComplete,
  durationMs = DEFAULT_INTRO_DURATION_MS,
}: AnimeIntroLoaderProps) {
  const [progress, setProgress] = useState<number>(0);

  // Smooth requestAnimationFrame progression from 0% to 100%
  useEffect(() => {
    let rafId = 0;
    let completionTimer: number | null = null;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / Math.max(400, durationMs));
      // Smooth anime ease-out-cubic curve with subtle stage cadence
      const eased = 1 - Math.pow(1 - ratio, 2.4);
      const nextPct = Math.min(100, Math.round(eased * 100));
      setProgress(nextPct);

      if (ratio < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        completionTimer = window.setTimeout(() => {
          onComplete();
        }, 220);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      if (completionTimer !== null) {
        window.clearTimeout(completionTimer);
      }
    };
  }, [durationMs, onComplete]);

  // Allow keyboard skip via Escape, Enter, or Space
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  const seq = useMemo(() => computeIntroSequenceState(progress), [progress]);
  const ink = '#0F172A';

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Attack Explorer Loading Screen"
      data-testid="anime-intro-loader"
      data-intro-phase={seq.phase.id}
      data-intro-progress={seq.progressPct}
      initial={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        y: -16,
        transition: { duration: 0.32, ease: 'easeOut' },
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 excalidraw-board-bg text-zinc-900 dark:text-zinc-100 select-none overflow-hidden"
    >
      {/* Subtle Minimal Anime Corner Framing Hairlines (Pure SVG) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-55 dark:opacity-40"
      >
        {/* Top-Left & Bottom-Right Minimal Anime Camera Frame Brackets */}
        <path
          d="M 44 88 L 44 44 L 108 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <path
          d="M 1396 88 L 1396 44 L 1332 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <path
          d="M 44 812 L 44 856 L 108 856"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <path
          d="M 1396 812 L 1396 856 L 1332 856"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />

        {/* Diagonal Minimal Katana Speed-Line Accents Across Backdrop */}
        <motion.line
          x1="180"
          y1="760"
          x2="420"
          y2="520"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: seq.mechaWingsDeployed ? 0.35 : 0 }}
          transition={{ duration: 0.25 }}
        />
        <motion.line
          x1="1040"
          y1="360"
          x2="1280"
          y2="120"
          stroke="#E11D48"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: seq.spearheadSlashed ? 0.35 : 0 }}
          transition={{ duration: 0.25 }}
        />
      </svg>

      {/* Top Row: Editorial Sequence Indicator & Immediate Skip Control */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span className="font-mono tabular-nums font-semibold text-zinc-800 dark:text-zinc-200">
            0{seq.phase.index} / 04
          </span>
          <span aria-hidden="true">·</span>
          <span>Interactive Cyber Attack Simulator</span>
        </div>

        <button
          type="button"
          data-testid="skip-intro-btn"
          aria-label="Skip intro animation"
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-300/90 dark:border-zinc-700/90 bg-white/90 dark:bg-zinc-900/90 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>

      {/* Center Focal Anchor: Choreographed Cel-Shaded Anime Emblem & Slanted Title Card */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-6 max-w-xl w-full text-center">
        {/* Cel-Shaded Anime Vector Emblem Stage */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
          <svg
            viewBox="0 0 160 160"
            fill="none"
            className="w-full h-full overflow-visible drop-shadow-[2.5px_2.5px_0px_rgba(15,23,42,0.88)] dark:drop-shadow-[3px_3px_0px_rgba(0,0,0,0.95)]"
            aria-label="Attack Explorer Emblem Animation"
          >
            <defs>
              <radialGradient id="introAnimeAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.38" />
                <stop offset="55%" stopColor="#E11D48" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Subtle Cel-Shaded Aura Backlight */}
            <motion.circle
              cx="80"
              cy="80"
              r="64"
              fill="url(#introAnimeAura)"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: seq.spearheadSlashed ? 1.08 : 0.75,
                opacity: seq.mechaWingsDeployed ? 0.95 : 0.2,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ transformOrigin: '80px 80px' }}
            />

            {/* Minimal Outer Geometric Targeting Reticle Ring */}
            <motion.circle
              cx="80"
              cy="80"
              r="66"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeDasharray="8 6"
              className="text-zinc-400/70 dark:text-zinc-600/80"
              initial={{ rotate: 0, scale: 0.85, opacity: 0 }}
              animate={{
                rotate: seq.progressPct * 0.9,
                scale: 1,
                opacity: 1,
              }}
              transition={{ duration: 0.2, ease: 'linear' }}
              style={{ transformOrigin: '80px 80px' }}
            />

            {/* Inner Precision Crosshair Ticks */}
            <g className="text-zinc-400 dark:text-zinc-600" stroke="currentColor" strokeWidth="1.5">
              <line x1="80" y1="6" x2="80" y2="16" />
              <line x1="80" y1="144" x2="80" y2="154" />
              <line x1="6" y1="80" x2="16" y2="80" />
              <line x1="144" y1="80" x2="154" y2="80" />
            </g>

            {/* Anime Diagonal Action Speed-Lines */}
            <motion.g
              initial={{ opacity: 0, x: -10, y: 10 }}
              animate={
                seq.spearheadSlashed
                  ? { opacity: 1, x: 0, y: 0 }
                  : { opacity: 0, x: -10, y: 10 }
              }
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <line
                x1="22"
                y1="102"
                x2="56"
                y2="62"
                stroke="#38BDF8"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <line
                x1="98"
                y1="116"
                x2="134"
                y2="74"
                stroke="#A78BFA"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <line
                x1="68"
                y1="44"
                x2="100"
                y2="16"
                stroke="#FB7185"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Centered 100x100 Emblem Group translated to (30, 30) */}
            <g transform="translate(30, 30)">
              {/* 1. Left Expanding Mecha Node Wing (Cyan Cel-Shaded) */}
              <motion.g
                initial={{ x: -24, y: -10, rotate: -18, opacity: 0 }}
                animate={
                  seq.mechaWingsDeployed
                    ? {
                        x: seq.isComplete ? -5 : 0,
                        y: 0,
                        rotate: seq.isComplete ? -6 : 0,
                        opacity: 1,
                      }
                    : { x: -24, y: -10, rotate: -18, opacity: 0 }
                }
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                style={{ transformOrigin: '30px 50px' }}
              >
                <path
                  d="M 38 16 L 14 34 L 14 66 L 38 84 L 44 73 L 26 59 L 26 41 L 44 27 Z"
                  fill="#38BDF8"
                  stroke={ink}
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 16 54 L 24 58 L 41 72 L 37 81 L 16 65 Z"
                  fill="#0284C7"
                />
                <path
                  d="M 36 20 L 18 34 L 18 43 L 25 38 L 40 26 Z"
                  fill="#BAE6FD"
                />
              </motion.g>

              {/* 2. Right Expanding Mecha Node Wing (Violet Cel-Shaded) */}
              <motion.g
                initial={{ x: 24, y: 10, rotate: 18, opacity: 0 }}
                animate={
                  seq.mechaWingsDeployed
                    ? {
                        x: seq.isComplete ? 5 : 0,
                        y: 0,
                        rotate: seq.isComplete ? 6 : 0,
                        opacity: 1,
                      }
                    : { x: 24, y: 10, rotate: 18, opacity: 0 }
                }
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                style={{ transformOrigin: '70px 50px' }}
              >
                <path
                  d="M 62 16 L 86 34 L 86 66 L 62 84 L 56 73 L 74 59 L 74 41 L 56 27 Z"
                  fill="#A78BFA"
                  stroke={ink}
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 84 54 L 76 58 L 59 72 L 63 81 L 84 65 Z"
                  fill="#7C3AED"
                />
                <path
                  d="M 64 20 L 82 34 L 82 43 L 75 38 L 60 26 Z"
                  fill="#DDD6FE"
                />
              </motion.g>

              {/* 3. Center Piercing Attack Vector Spearhead (Katana Slash Thrust) */}
              <motion.g
                initial={{ x: -28, y: 28, scale: 0.72, opacity: 0 }}
                animate={
                  seq.spearheadSlashed
                    ? {
                        x: seq.isComplete ? 4 : 0,
                        y: seq.isComplete ? -4 : 0,
                        scale: seq.isComplete ? 1.08 : 1,
                        opacity: 1,
                      }
                    : { x: -28, y: 28, scale: 0.72, opacity: 0 }
                }
                transition={{ type: 'spring', stiffness: 460, damping: 16 }}
                style={{ transformOrigin: '50px 50px' }}
              >
                <path
                  d="M 28 74 L 48 48 L 40 45 L 74 14 L 56 54 L 64 57 L 36 80 Z"
                  fill="#E11D48"
                  stroke={ink}
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 70 19 L 44 44 L 51 46 L 33 70 L 53 51 Z"
                  fill="#FB7185"
                />
              </motion.g>

              {/* 4. Golden Origin Node & Impact Shockwave Ring */}
              <motion.circle
                cx="26"
                cy="78"
                r="10"
                fill="none"
                stroke="#FACC15"
                strokeWidth="2.5"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                  seq.spearheadSlashed
                    ? { scale: [1, 2.3], opacity: [0.9, 0] }
                    : { scale: 0.8, opacity: 0 }
                }
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                style={{ transformOrigin: '26px 78px' }}
              />
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  seq.mechaWingsDeployed
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0, opacity: 0 }
                }
                transition={{ type: 'spring', stiffness: 460, damping: 16 }}
                style={{ transformOrigin: '26px 78px' }}
              >
                <circle
                  cx="26"
                  cy="78"
                  r="7.5"
                  fill="#FACC15"
                  stroke={ink}
                  strokeWidth="3.5"
                />
                <circle cx="26" cy="78" r="2.5" fill={ink} />
              </motion.g>

              {/* 5. Anime 4-Point "Hikari" Impact Star Flare at Spearhead Tip */}
              <motion.path
                d="M 79 2 L 81.5 9.5 L 89 12 L 81.5 14.5 L 79 22 L 76.5 14.5 L 69 12 L 76.5 9.5 Z"
                fill="#FEF08A"
                stroke={ink}
                strokeWidth="2"
                strokeLinejoin="round"
                initial={{ scale: 0, rotate: -35, opacity: 0 }}
                animate={
                  seq.hikariFlareActive
                    ? {
                        scale: seq.isComplete ? 1.25 : 1.08,
                        rotate: 12,
                        opacity: 1,
                      }
                    : { scale: 0, rotate: -35, opacity: 0 }
                }
                transition={{ type: 'spring', stiffness: 460, damping: 14 }}
                style={{ transformOrigin: '79px 12px' }}
              />
            </g>
          </svg>
        </div>

        {/* Slanted Anime Title-Card Wordmark: "Attack Explorer" */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative inline-flex flex-col items-center mb-3"
        >
          <div className="relative flex items-baseline gap-2.5 px-2 py-1 overflow-hidden">
            <span className="inline-block text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white -skew-x-6 [text-shadow:1.5px_1.5px_0px_rgba(56,189,248,0.55)] dark:[text-shadow:2px_2px_0px_rgba(2,132,199,0.85)]">
              Attack
            </span>

            {/* Anime Diagonal Katana Slash Divider */}
            <svg
              viewBox="0 0 12 20"
              aria-hidden="true"
              className="w-3 h-5 shrink-0 self-center overflow-visible"
            >
              <polygon
                points="8.5,1 11.5,1 3.5,19 0.5,19"
                fill={seq.hikariFlareActive ? '#FACC15' : '#38BDF8'}
                stroke={ink}
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>

            <span className="inline-block text-3xl sm:text-4xl font-black tracking-tight text-rose-600 dark:text-rose-400 -skew-x-6 [text-shadow:1.5px_1.5px_0px_rgba(251,113,133,0.4)] dark:[text-shadow:2px_2px_0px_rgba(159,18,57,0.85)]">
              Explorer
            </span>

            {/* Metallic Anime "Shing!" Glint Sweep Across Wordmark */}
            <motion.span
              aria-hidden="true"
              initial={{ x: '-140%', opacity: 0 }}
              animate={
                seq.wordmarkLocked
                  ? { x: '260%', opacity: [0, 0.9, 0] }
                  : { x: '-140%', opacity: 0 }
              }
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="pointer-events-none absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/85 dark:via-white/55 to-transparent -skew-x-25"
            />
          </div>

          {/* Katana Blade Underline Accent */}
          <div className="relative h-1 w-48 sm:w-56 mt-1 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800/80">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: Math.max(0.12, seq.progressPct / 100) }}
              transition={{ duration: 0.1, ease: 'linear' }}
              style={{ transformOrigin: 'left center' }}
              className="h-full w-full bg-gradient-to-r from-sky-400 via-rose-500 to-amber-400 rounded-full"
            />
          </div>
        </motion.div>

        {/* Current Choreographed Phase Heading & Subtitle */}
        <p
          data-testid="intro-phase-title"
          className="text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-100 tracking-tight mt-2"
        >
          0{seq.phase.index}. {seq.phase.title}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md text-balance">
          {seq.phase.subtitle}
        </p>
      </div>

      {/* Bottom Game-Style Minimal Loading Gauge & Unboxed Subsystem Readiness */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-3">
        {/* Progress Header Row: Label + Tabular Percentage */}
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Loading Tactical Workbench
          </span>
          <span
            data-testid="intro-progress-pct"
            className="text-lg sm:text-xl font-mono font-black tabular-nums tracking-tight text-zinc-900 dark:text-white"
          >
            {seq.formattedPct}
          </span>
        </div>

        {/* Minimal Anime Slanted Segmented Progress Track */}
        <div
          role="progressbar"
          aria-valuenow={seq.progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Workbench loading progress"
          className="relative h-2.5 w-full rounded-sm bg-zinc-200/90 dark:bg-zinc-800/90 border border-slate-900/80 dark:border-zinc-700 overflow-hidden -skew-x-12 shadow-[2px_2px_0px_rgba(15,23,42,0.85)]"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: seq.progressPct / 100 }}
            transition={{ duration: 0.06, ease: 'linear' }}
            style={{ transformOrigin: 'left center' }}
            className="h-full w-full bg-gradient-to-r from-sky-400 via-rose-500 to-amber-400"
          />
        </div>

        {/* Clean Unboxed Metadata Readiness Line with Typographic Separators */}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 pt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          {seq.modules.map((mod, idx) => (
            <React.Fragment key={mod.id}>
              {idx > 0 && <span aria-hidden="true">·</span>}
              <span
                data-testid={`intro-module-${mod.id}`}
                data-ready={mod.isReady ? 'true' : 'false'}
                className={`transition-colors duration-150 ${
                  mod.isReady
                    ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                    : 'text-zinc-400 dark:text-zinc-600'
                }`}
              >
                {mod.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
