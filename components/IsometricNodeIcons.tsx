'use client';

import React from 'react';
import { NodeRole } from '@/lib/attack-scenarios';

interface IsometricNodeIconProps {
  role: NodeRole;
  isCompromised?: boolean;
  isActive?: boolean;
}

/**
 * Crisp architectural blueprint isometric SVG illustrations inspired by Protocol Explorer.
 * Uses clean technical stroke linework (#1D4ED8 in light mode, #60A5FA in dark mode,
 * and semantic crimson #DC2626 when compromised/attacker).
 */
export function IsometricNodeIcon({
  role,
  isCompromised = false,
  isActive = false }: IsometricNodeIconProps) {
  const isThreat = role === 'attacker' || isCompromised;

  const strokeColor = isThreat
    ? 'stroke-[#DC2626] dark:stroke-[#F87171]'
    : 'stroke-[#1E40AF] dark:stroke-[#60A5FA]';

  const fillLight = isThreat
    ? 'fill-[#FEE2E2] dark:fill-[#450A0A]/70'
    : 'fill-[#DBEAFE] dark:fill-[#1E3A8A]/60';

  const fillBase = 'fill-white dark:fill-[#0F172A]';
  const strokeWidth = isActive ? 2.2 : 1.75;

  switch (role) {
    case 'victim_host':
      // Isometric Laptop / Workstation
      return (
        <svg
          viewBox="0 0 120 100"
          className={`w-24 h-20 overflow-visible transition-transform duration-200 ${
            isActive ? 'scale-105' : ''
          }`}
          aria-hidden="true"
        >
          {/* Drop shadow polygon */}
          <polygon
            points="60,92 104,70 68,52 24,74"
            className="fill-slate-200/70 dark:fill-slate-900/80"
          />
          {/* Laptop Screen Back/Frame */}
          <polygon
            points="26,56 26,18 68,4 68,42"
            className={`${fillBase} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Screen Inner Display */}
          <polygon
            points="30,51 30,22 64,10 64,39"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
          {/* Screen Code Lines */}
          <line
            x1="35"
            y1="26"
            x2="54"
            y2="19"
            className={strokeColor}
            strokeWidth={1.4}
          />
          <line
            x1="35"
            y1="33"
            x2="58"
            y2="25"
            className={strokeColor}
            strokeWidth={1.4}
          />
          <line
            x1="35"
            y1="40"
            x2="48"
            y2="35"
            className={strokeColor}
            strokeWidth={1.4}
          />
          {/* Keyboard Base */}
          <polygon
            points="26,56 68,42 100,60 58,76"
            className={`${fillBase} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Keyboard Base Thickness */}
          <polygon
            points="26,56 58,76 100,60 100,64 58,80 26,60"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
          {/* Keyboard Grid */}
          <polygon
            points="34,56 66,45 84,55 52,66"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={1.1}
          />
          {/* Trackpad */}
          <polygon
            points="62,65 72,61 78,65 68,69"
            className={`${fillBase} ${strokeColor}`}
            strokeWidth={1.1}
          />
        </svg>
      );

    case 'server':
    case 'domain_controller':
      // Isometric Enterprise Server / Domain Controller Rack
      return (
        <svg
          viewBox="0 0 120 110"
          className={`w-24 h-22 overflow-visible transition-transform duration-200 ${
            isActive ? 'scale-105' : ''
          }`}
          aria-hidden="true"
        >
          {/* Shadow */}
          <polygon
            points="60,102 100,82 60,64 20,84"
            className="fill-slate-200/70 dark:fill-slate-900/80"
          />
          {/* Top Face */}
          <polygon
            points="60,10 96,26 60,42 24,26"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Left Face (Front Rack Bays) */}
          <polygon
            points="24,26 60,42 60,92 24,76"
            className={`${fillBase} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Right Face */}
          <polygon
            points="60,42 96,26 96,76 60,92"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Server Blade Slots on Left Face */}
          {[0, 14, 28].map((offset) => (
            <g key={offset}>
              <line
                x1="29"
                y1={36 + offset}
                x2="55"
                y2={48 + offset}
                className={strokeColor}
                strokeWidth={1.5}
              />
              <circle
                cx="33"
                cy={42 + offset}
                r="1.8"
                className={isThreat ? 'fill-[#DC2626]' : 'fill-[#1E40AF] dark:fill-[#60A5FA]'}
              />
            </g>
          ))}
          {/* Vent lines on Right Face */}
          <line x1="68" y1="48" x2="88" y2="39" className={strokeColor} strokeWidth={1.4} />
          <line x1="68" y1="58" x2="88" y2="49" className={strokeColor} strokeWidth={1.4} />
          <line x1="68" y1="68" x2="88" y2="59" className={strokeColor} strokeWidth={1.4} />
          {role === 'domain_controller' && (
            <polygon
              points="60,18 74,25 60,32 46,25"
              className={`${fillBase} ${strokeColor}`}
              strokeWidth={1.4}
            />
          )}
        </svg>
      );

    case 'process':
      // Isometric Process Execution Container & CPU Threads
      return (
        <svg
          viewBox="0 0 120 105"
          className={`w-24 h-20 overflow-visible transition-transform duration-200 ${
            isActive ? 'scale-105' : ''
          }`}
          aria-hidden="true"
        >
          {/* Shadow */}
          <polygon
            points="60,95 98,76 60,58 22,77"
            className="fill-slate-200/70 dark:fill-slate-900/80"
          />
          {/* Outer Hollowed / Process Cube */}
          <polygon
            points="60,14 96,32 60,50 24,32"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="24,32 60,50 60,86 24,68"
            className={`${fillBase} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="60,50 96,32 96,68 60,86"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Inner Core / Injected Thread Cube */}
          <polygon
            points="60,22 78,31 60,40 42,31"
            className={`${fillBase} ${strokeColor}`}
            strokeWidth={1.5}
            strokeDasharray={isCompromised ? '3 2' : undefined}
          />
          {/* Binary / Thread indicators on front */}
          <line x1="32" y1="45" x2="52" y2="55" className={strokeColor} strokeWidth={1.6} />
          <line x1="32" y1="53" x2="48" y2="61" className={strokeColor} strokeWidth={1.6} />
          <line x1="32" y1="61" x2="52" y2="71" className={strokeColor} strokeWidth={1.6} />
        </svg>
      );

    case 'memory':
      // Isometric Memory Stack / Virtual Address Space Slabs
      return (
        <svg
          viewBox="0 0 120 105"
          className={`w-24 h-20 overflow-visible transition-transform duration-200 ${
            isActive ? 'scale-105' : ''
          }`}
          aria-hidden="true"
        >
          {/* 3 Stacked Isometric Memory Pages */}
          {[36, 20, 4].map((yOffset, idx) => (
            <g key={yOffset}>
              <polygon
                points={`60,${14 + yOffset} 96,${30 + yOffset} 60,${46 + yOffset} 24,${30 + yOffset}`}
                className={`${idx === 1 && isThreat ? 'fill-[#FEE2E2] dark:fill-[#7F1D1D]' : fillBase} ${strokeColor}`}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
              />
              <polygon
                points={`24,${30 + yOffset} 60,${46 + yOffset} 60,${54 + yOffset} 24,${38 + yOffset}`}
                className={`${fillLight} ${strokeColor}`}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              <polygon
                points={`60,${46 + yOffset} 96,${30 + yOffset} 96,${38 + yOffset} 60,${54 + yOffset}`}
                className={`${fillLight} ${strokeColor}`}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </g>
          ))}
        </svg>
      );

    case 'firewall_siem':
    case 'dns_resolver':
      // Isometric Router / SIEM Sensor / DNS Appliance with Antenna/Shield
      return (
        <svg
          viewBox="0 0 120 105"
          className={`w-24 h-20 overflow-visible transition-transform duration-200 ${
            isActive ? 'scale-105' : ''
          }`}
          aria-hidden="true"
        >
          {/* Shadow */}
          <polygon
            points="60,92 98,73 60,55 22,74"
            className="fill-slate-200/70 dark:fill-slate-900/80"
          />
          {/* Appliance Top */}
          <polygon
            points="60,30 96,46 60,62 24,46"
            className={`${fillBase} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Appliance Left */}
          <polygon
            points="24,46 60,62 60,82 24,66"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Appliance Right */}
          <polygon
            points="60,62 96,46 96,66 60,82"
            className={`${fillBase} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Sensor Telemetry Mast */}
          <line
            x1="60"
            y1="40"
            x2="60"
            y2="14"
            className={strokeColor}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="12"
            r="3.5"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={1.8}
          />
          {/* Port LEDs */}
          <circle cx="34" cy="59" r="2" className="fill-[#1E40AF] dark:fill-[#60A5FA]" />
          <circle cx="42" cy="63" r="2" className="fill-[#1E40AF] dark:fill-[#60A5FA]" />
          <circle cx="50" cy="67" r="2" className="fill-[#1E40AF] dark:fill-[#60A5FA]" />
        </svg>
      );

    case 'attacker':
    default:
      // Isometric Threat Actor / C2 Console Node
      return (
        <svg
          viewBox="0 0 120 105"
          className={`w-24 h-20 overflow-visible transition-transform duration-200 ${
            isActive ? 'scale-105' : ''
          }`}
          aria-hidden="true"
        >
          {/* Shadow */}
          <polygon
            points="60,92 100,72 60,54 20,74"
            className="fill-red-200/50 dark:fill-red-950/50"
          />
          {/* Base Hexagon/Diamond Platform */}
          <polygon
            points="60,20 96,38 60,56 24,38"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="24,38 60,56 60,80 24,62"
            className={`${fillBase} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="60,56 96,38 96,62 60,80"
            className={`${fillLight} ${strokeColor}`}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Terminal Prompt >_ on Top Face */}
          <polyline
            points="48,35 56,38 48,41"
            fill="none"
            className={strokeColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="59"
            y1="41"
            x2="69"
            y2="37"
            className={strokeColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
