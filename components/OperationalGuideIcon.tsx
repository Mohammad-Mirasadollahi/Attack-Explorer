'use client';

import React from 'react';
import { motion } from 'motion/react';

interface OperationalGuideIconProps {
  tacticalMode?: boolean;
  size?: 'sm' | 'md';
}

/**
 * Signature Operational Guide Icon Badge.
 * Merges the original Operational Guide cel-shaded / tactical reticle-compass-book
 * emblem and glowing badge container into the consolidated Legend & Context UI.
 */
export function OperationalGuideIcon({
  tacticalMode = false,
  size = 'sm',
}: OperationalGuideIconProps) {
  const boxClass = size === 'md' ? 'w-6 h-6' : 'w-5 h-5';
  const svgClass = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <span
      data-testid="operational-guide-icon-badge"
      className={`relative inline-flex items-center justify-center ${boxClass} rounded-md border shadow-2xs shrink-0 select-none ${
        tacticalMode
          ? 'bg-emerald-950/90 border-emerald-400/80 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.35)]'
          : 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 border-indigo-400/80 text-white shadow-[1px_1px_0px_rgba(15,23,42,0.85)]'
      }`}
    >
      {/* Subtle Live Pulse Dot in Top-Right Corner */}
      <motion.span
        animate={{ scale: [1, 1.35, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-slate-950 ${
          tacticalMode ? 'bg-emerald-400' : 'bg-amber-400'
        }`}
      />

      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={svgClass}
        aria-hidden="true"
      >
        {/* Tactical Corner Brackets (Operational Guide Frame) */}
        <path
          d="M 3 7 L 3 3 L 7 3 M 17 3 L 21 3 L 21 7 M 21 17 L 21 21 L 17 21 M 7 21 L 3 21 L 3 17"
          stroke={tacticalMode ? '#34D399' : '#A5B4FC'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner Compass / Guide Diamond */}
        <circle
          cx="12"
          cy="12"
          r="5.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="3 1.5"
        />
        {/* Directional Guide Needle */}
        <polygon
          points="12,6.5 14.4,12 12,17.5 9.6,12"
          fill={tacticalMode ? '#10B981' : '#F43F5E'}
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="1.4" fill="#FDE047" />
      </svg>
    </span>
  );
}
