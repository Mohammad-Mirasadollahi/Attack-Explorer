'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface AnimeBrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  onClick?: () => void;
}

/**
 * Iconic Free-Standing Japanese Anime Cel-Shaded Logo & Wordmark for "Attack Explorer".
 * Features:
 * 1. Multi-part choreographed Japanese anime hover animation:
 *    - Left & Right Hex-Node Mecha Wings snap outward with spring physics
 *    - Center Crimson Spearhead performs a high-velocity diagonal katana slash thrust
 *    - Golden Origin Node emits an expanding shockwave ring
 *    - 4-point anime "Hikari" impact star-flare & diagonal speed lines burst along the vector
 * 2. Anime Title-Card Wordmark ("Attack Explorer"):
 *    - Razor-sharp, high-legibility slanted anime display typography
 *    - Diagonal katana blade underline & metallic "Shing!" glint sweep on hover
 */
export function AnimeBrandLogo({
  size = 'md',
  showWordmark = true,
  onClick }: AnimeBrandLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  const dimensions =
    size === 'lg'
      ? 'w-10 h-10'
      : size === 'sm'
      ? 'w-7 h-7'
      : 'w-8 h-8';

  const ink = '#0F172A';

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      data-testid="anime-brand-logo"
      data-hovered={isHovered ? 'true' : 'false'}
      className="inline-flex items-center gap-2.5 select-none group cursor-pointer shrink-0 py-0.5"
    >
      {/* Free-Standing Cel-Shaded Anime Vector Mark */}
      <motion.div
        initial={false}
        animate={
          isHovered
            ? {
                scale: 1.08,
                rotate: -3 }
            : {
                scale: 1,
                rotate: 0 }
        }
        transition={{
          type: 'spring',
          stiffness: 460,
          damping: 16 }}
        className={`relative ${dimensions} shrink-0 flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="w-full h-full overflow-visible drop-shadow-[1.5px_1.5px_0px_rgba(15,23,42,0.88)] dark:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.95)]"
          aria-label="Attack Explorer Logo"
        >
          {/* Anime Impact Aura Backlight (Appears on Hover) */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="url(#animeHoverAura)"
            initial={false}
            animate={
              isHovered
                ? { scale: 1.18, opacity: 0.9 }
                : { scale: 0.65, opacity: 0 }
            }
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* Anime Diagonal Speed-Lines (Action Lines on Hover) */}
          <motion.g
            initial={false}
            animate={
              isHovered
                ? { opacity: 1, x: 2, y: -2 }
                : { opacity: 0, x: -6, y: 6 }
            }
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <line
              x1="10"
              y1="64"
              x2="34"
              y2="36"
              stroke="#38BDF8"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="62"
              y1="74"
              x2="88"
              y2="44"
              stroke="#A78BFA"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="42"
              y1="26"
              x2="64"
              y2="6"
              stroke="#FB7185"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </motion.g>

          {/* 1. Left Expanding Mecha Node Bracket Wing (Cyan Cel-Shaded) */}
          <motion.g
            data-testid="anime-logo-left-wing"
            initial={false}
            animate={
              isHovered
                ? { x: -7, y: -2, rotate: -11, scale: 1.06 }
                : { x: 0, y: 0, rotate: 0, scale: 1 }
            }
            transition={{ type: 'spring', stiffness: 460, damping: 15 }}
            style={{ transformOrigin: '30px 50px' }}
          >
            <path
              d="M 38 16 L 14 34 L 14 66 L 38 84 L 44 73 L 26 59 L 26 41 L 44 27 Z"
              fill="#38BDF8"
              stroke={ink}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Left Wing Lower Cel-Shade Bevel */}
            <path
              d="M 16 54 L 24 58 L 41 72 L 37 81 L 16 65 Z"
              fill="#0284C7"
            />
            {/* Anime Specular Highlight Notch */}
            <path
              d="M 36 20 L 18 34 L 18 43 L 25 38 L 40 26 Z"
              fill="#BAE6FD"
            />
          </motion.g>

          {/* 2. Right Expanding Mecha Node Bracket Wing (Violet Cel-Shaded) */}
          <motion.g
            data-testid="anime-logo-right-wing"
            initial={false}
            animate={
              isHovered
                ? { x: 7, y: 2, rotate: 11, scale: 1.06 }
                : { x: 0, y: 0, rotate: 0, scale: 1 }
            }
            transition={{ type: 'spring', stiffness: 460, damping: 15 }}
            style={{ transformOrigin: '70px 50px' }}
          >
            <path
              d="M 62 16 L 86 34 L 86 66 L 62 84 L 56 73 L 74 59 L 74 41 L 56 27 Z"
              fill="#A78BFA"
              stroke={ink}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Right Wing Lower Cel-Shade Bevel */}
            <path
              d="M 84 54 L 76 58 L 59 72 L 63 81 L 84 65 Z"
              fill="#7C3AED"
            />
            {/* Anime Specular Highlight Notch */}
            <path
              d="M 64 20 L 82 34 L 82 43 L 75 38 L 60 26 Z"
              fill="#DDD6FE"
            />
          </motion.g>

          {/* 3. Center Piercing Attack Vector Spearhead (Anime Diagonal Slash Thrust) */}
          <motion.g
            data-testid="anime-logo-spearhead"
            initial={false}
            animate={
              isHovered
                ? {
                    x: 5,
                    y: -6,
                    scale: 1.1 }
                : { x: 0, y: 0, scale: 1 }
            }
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 15 }}
            style={{ transformOrigin: '50px 50px' }}
          >
            <path
              d="M 28 74 L 48 48 L 40 45 L 74 14 L 56 54 L 64 57 L 36 80 Z"
              fill="#E11D48"
              stroke={ink}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Upper Specular Cel-Shade Facet on Crimson Spearhead */}
            <path
              d="M 70 19 L 44 44 L 51 46 L 33 70 L 53 51 Z"
              fill="#FB7185"
            />
          </motion.g>

          {/* 4. Origin Graph Node + Expanding Shockwave Ring */}
          <motion.circle
            cx="26"
            cy="78"
            r="9"
            fill="none"
            stroke="#FACC15"
            strokeWidth="2.5"
            initial={false}
            animate={
              isHovered
                ? { scale: [1, 2.2], opacity: [0.95, 0] }
                : { scale: 1, opacity: 0 }
            }
            transition={{
              duration: 0.65,
              repeat: isHovered ? Infinity : 0,
              ease: 'easeOut' }}
            style={{ transformOrigin: '26px 78px' }}
          />
          <motion.g
            initial={false}
            animate={isHovered ? { scale: 1.18 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 16 }}
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
            initial={false}
            animate={
              isHovered
                ? {
                    scale: 1.18,
                    rotate: 15,
                    opacity: 1 }
                : { scale: 0, rotate: -25, opacity: 0 }
            }
            transition={{ type: 'spring', stiffness: 460, damping: 15 }}
            style={{ transformOrigin: '79px 12px' }}
          />

          <defs>
            <radialGradient id="animeHoverAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
              <stop offset="55%" stopColor="#E11D48" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Japanese Anime Styled Wordmark: "Attack Explorer" (Tilts/Slants on Hover + Razor-Sharp Legibility) */}
      {showWordmark && (
        <motion.div
          data-testid="anime-brand-wordmark"
          data-tilted={isHovered ? 'true' : 'false'}
          initial={false}
          animate={
            isHovered
              ? {
                  rotate: -5,
                  skewX: -12,
                  y: -1.5,
                  scale: 1.04 }
              : {
                  rotate: 0,
                  skewX: 0,
                  y: 0,
                  scale: 1 }
          }
          transition={{ type: 'spring', stiffness: 460, damping: 16 }}
          style={{ transformOrigin: 'left center' }}
          className="hidden sm:flex flex-col justify-center relative py-1 overflow-visible"
        >
          <div className="relative flex items-baseline gap-1.5 leading-none px-1 py-0.5 overflow-hidden rounded-xs">
            {/* "Attack" — Bold Slanted Anime Display Typography */}
            <motion.span
              initial={false}
              animate={
                isHovered
                  ? {
                      y: -1,
                      x: -0.5,
                      skewX: -8 }
                  : {
                      y: 0,
                      x: 0,
                      skewX: -4 }
              }
              transition={{ type: 'spring', stiffness: 460, damping: 18 }}
              className="inline-block text-[15px] font-black tracking-tight text-slate-900 dark:text-white [text-shadow:1px_1px_0px_rgba(56,189,248,0.5)] dark:[text-shadow:1.5px_1.5px_0px_rgba(2,132,199,0.85)]"
            >
              Attack
            </motion.span>

            {/* Anime Diagonal Katana-Slash Vector Accent (Pure SVG) */}
            <motion.svg
              viewBox="0 0 10 16"
              aria-hidden="true"
              initial={false}
              animate={
                isHovered
                  ? { rotate: 16, scale: 1.22, y: -1 }
                  : { rotate: 0, scale: 1, y: 0 }
              }
              transition={{ type: 'spring', stiffness: 500, damping: 16 }}
              className="w-2 h-3 shrink-0 overflow-visible self-center"
            >
              <polygon
                points="7,1 9.5,1 3,15 0.5,15"
                fill={isHovered ? '#FACC15' : '#38BDF8'}
                stroke={ink}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </motion.svg>

            {/* "Explorer" — Vivid Cel-Shaded Crimson Anime Accent Word */}
            <motion.span
              initial={false}
              animate={
                isHovered
                  ? {
                      y: -1,
                      x: 1,
                      skewX: -8 }
                  : {
                      y: 0,
                      x: 0,
                      skewX: -4 }
              }
              transition={{
                type: 'spring',
                stiffness: 460,
                damping: 17 }}
              className="inline-block text-[15px] font-black tracking-tight text-rose-600 dark:text-rose-400 [text-shadow:1px_1px_0px_rgba(251,113,133,0.35)] dark:[text-shadow:1.5px_1.5px_0px_rgba(159,18,57,0.85)]"
            >
              Explorer
            </motion.span>

            {/* High-Speed Anime Metallic "Shing!" Glint Sweep Across Text on Hover */}
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={
                isHovered
                  ? { x: ['-140%', '260%'], opacity: [0, 0.9, 0] }
                  : { x: '-140%', opacity: 0 }
              }
              transition={{ duration: 0.48, ease: 'easeInOut' }}
              className="pointer-events-none absolute inset-y-0 w-6 bg-gradient-to-r from-transparent via-white/80 dark:via-white/50 to-transparent -skew-x-25"
            />
          </div>

          {/* Anime Katana Blade Slash Underline Bar */}
          <div className="relative h-[2.5px] w-full mt-1 overflow-hidden rounded-full bg-zinc-200/70 dark:bg-zinc-800/80">
            <motion.div
              initial={false}
              animate={
                isHovered
                  ? { scaleX: 1, opacity: 1 }
                  : { scaleX: 0.68, opacity: 0.9 }
              }
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              style={{ transformOrigin: 'left center' }}
              className="h-full w-full bg-gradient-to-r from-sky-400 via-rose-500 to-amber-400 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
