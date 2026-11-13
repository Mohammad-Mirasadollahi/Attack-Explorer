'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ActiveEnvironmentId, getActiveEnvironmentProfile } from '@/lib/simulation-engine';

interface TacticalGridOverlayProps {
  activeEnvironment: ActiveEnvironmentId;
  scenarioCode: string;
}

const SECTOR_COLUMNS = [
  { code: 'SEC-A1 · WAN', range: '000..370m' },
  { code: 'SEC-B2 · DMZ', range: '370..740m' },
  { code: 'SEC-C3 · HOST', range: '740..1110m' },
  { code: 'SEC-D4 · SIEM', range: '1110..1480m' },
];

const SECTOR_ROWS = ['GRID-ALPHA', 'GRID-BRAVO', 'GRID-CHARLIE', 'GRID-DELTA'];

export function TacticalGridOverlay({
  activeEnvironment,
  scenarioCode }: TacticalGridOverlayProps) {
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);

  return (
    <div
      data-testid="tactical-grid-overlay"
      data-environment-id={activeEnvironment}
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none"
    >
      {/* 1. Stylized Multi-Scale Cyber Coordinate Grid SVG */}
      <svg
        viewBox="0 0 1480 650"
        preserveAspectRatio="none"
        className="w-full h-full opacity-90"
      >
        <defs>
          {/* Fine 24px Tactical Sub-Grid */}
          <pattern
            id="tactical-fine-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="0.45"
              strokeOpacity="0.16"
            />
          </pattern>

          {/* Major 120px Tactical Sector Grid with Intersection Crosshairs */}
          <pattern
            id="tactical-major-grid"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="120"
              height="120"
              fill="url(#tactical-fine-grid)"
            />
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="#10B981"
              strokeWidth="0.95"
              strokeOpacity="0.32"
              strokeDasharray="6 3"
            />
            {/* Crosshair reticle at grid intersection */}
            <path
              d="M -5 0 L 5 0 M 0 -5 L 0 5"
              stroke="#34D399"
              strokeWidth="1.2"
              strokeOpacity="0.55"
            />
          </pattern>

          {/* Subtle Radial Tactical Vignette */}
          <radialGradient id="tactical-vignette" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#064E3B" stopOpacity="0.02" />
            <stop offset="70%" stopColor="#022C22" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.38" />
          </radialGradient>
        </defs>

        {/* Grid Fill */}
        <rect width="1480" height="650" fill="url(#tactical-major-grid)" />
        <rect width="1480" height="650" fill="url(#tactical-vignette)" />

        {/* Vertical Sector Divider Telemetry Lines */}
        {[370, 740, 1110].map((xPos, idx) => (
          <g key={`sec-line-${xPos}`}>
            <line
              x1={xPos}
              y1={0}
              x2={xPos}
              y2={650}
              stroke="#10B981"
              strokeWidth="1.2"
              strokeOpacity="0.38"
              strokeDasharray="10 6"
            />
            <text
              x={xPos + 6}
              y={640}
              fill="#34D399"
              fillOpacity="0.65"
              fontSize="7.5"
              fontFamily="monospace"
              fontWeight="700"
            >
              {`AXIS-X0${idx + 1} [${xPos}px]`}
            </text>
          </g>
        ))}

        {/* Corner Tactical Targeting Brackets */}
        {/* Top-Left */}
        <path
          d="M 10 38 L 10 10 L 42 10"
          fill="none"
          stroke="#10B981"
          strokeWidth="2.2"
          strokeOpacity="0.85"
        />
        {/* Top-Right */}
        <path
          d="M 1438 10 L 1470 10 L 1470 38"
          fill="none"
          stroke="#10B981"
          strokeWidth="2.2"
          strokeOpacity="0.85"
        />
        {/* Bottom-Left */}
        <path
          d="M 10 612 L 10 640 L 42 640"
          fill="none"
          stroke="#10B981"
          strokeWidth="2.2"
          strokeOpacity="0.85"
        />
        {/* Bottom-Right */}
        <path
          d="M 1438 640 L 1470 640 L 1470 612"
          fill="none"
          stroke="#10B981"
          strokeWidth="2.2"
          strokeOpacity="0.85"
        />
      </svg>

      {/* 2. Top Sector Coordinate Ruler Strip */}
      <div className="absolute top-0 inset-x-0 h-4.5 px-3 flex items-center justify-between gap-2 border-b border-emerald-500/25 bg-slate-950/75 text-[8px] font-mono text-emerald-400/90 tracking-wider whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          {SECTOR_COLUMNS.map((sec) => (
            <span key={sec.code} className="hidden xl:inline-flex items-center gap-1 shrink-0">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">{sec.code}</span>
              <span className="text-emerald-500/70">[{sec.range}]</span>
            </span>
          ))}
        </div>

        <div
          data-testid="tactical-hud-readout"
          className="inline-flex items-center gap-1.5 text-[8px] font-mono font-bold text-emerald-300 shrink-0"
        >
          <span className="px-1.5 py-0 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
            TACTICAL GRID // ON
          </span>
          <span>
            {scenarioCode} · {envProfile.architectureCode}
          </span>
        </div>
      </div>

      {/* 3. Left Vertical Coordinate Axis Labels */}
      <div className="hidden lg:flex flex-col justify-between absolute left-1.5 top-8 bottom-12 text-[8px] font-mono font-bold text-emerald-400/60">
        {SECTOR_ROWS.map((rowLabel, rIdx) => (
          <span
            key={rowLabel}
            className="px-1 py-0.5 rounded bg-slate-950/70 border border-emerald-500/25"
          >
            {`${rowLabel} · Y${(rIdx + 1) * 150}`}
          </span>
        ))}
      </div>

      {/* 4. Sweeping Cyber Telemetry Scanline Beam */}
      <motion.div
        initial={{ top: '-8%' }}
        animate={{ top: '108%' }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: 'linear' }}
        className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-emerald-400/10 to-emerald-400/25 border-b border-emerald-400/35"
      />
    </div>
  );
}
