'use client';

import React from 'react';
import { motion } from 'motion/react';
import { SketchIconType } from '@/lib/sketch-zones-and-drilldown';

interface SketchNodeIconProps {
  iconType: SketchIconType;
  isActive: boolean;
  isCompromised: boolean;
}

export function SketchNodeIcon({
  iconType,
  isActive,
  isCompromised }: SketchNodeIconProps) {
  const strokeMain = '#0F172A';
  const accentColor =
    iconType === 'ATTACKER'
      ? '#E11D48'
      : iconType === 'MALWARE_PAYLOAD' || iconType === 'PROCESS_THREAD'
      ? '#DC2626'
      : iconType === 'VICTIM_LAPTOP'
      ? isCompromised
        ? '#F97316'
        : '#0284C7'
      : iconType === 'PHISHING_GATEWAY' || iconType === 'WAF_REVERSE_PROXY'
      ? '#D97706'
      : iconType === 'FIREWALL_ROUTER' || iconType === 'PACKET_ENGINE'
      ? '#EA580C'
      : iconType === 'CORE_SWITCH' || iconType === 'DNS_RESOLVER'
      ? '#0284C7'
      : iconType === 'LATERAL_SERVER' || iconType === 'CREDENTIAL_VAULT'
      ? '#7C3AED'
      : iconType === 'KERNEL_MEMORY'
      ? '#E11D48'
      : '#059669';

  return (
    <motion.div
      whileHover={{ scale: 1.07, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 20 }}
      className="relative w-14 h-12 flex items-center justify-center select-none"
    >
      {/* Subtle Aura Halo when Active */}
      {isActive && (
        <motion.div
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ borderColor: accentColor }}
          className="absolute inset-0 rounded-lg border border-dashed pointer-events-none"
        />
      )}

      <svg
        viewBox="0 0 110 90"
        className="w-full h-full overflow-visible drop-shadow-[1.5px_1.5px_0px_rgba(15,23,42,0.55)]"
      >
        {/* 1. ATTACKER: Anime Hooded Hacker + Terminal & Phishing Hook */}
        {iconType === 'ATTACKER' && (
          <g>
            <path
              d="M 12 14 Q 55 10 98 14 Q 102 45 98 78 Q 55 82 12 78 Q 8 45 12 14 Z"
              fill="#FFE4E6"
              stroke={strokeMain}
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path
              d="M 35 55 C 35 28 75 28 75 55 Z"
              fill="#1E293B"
              stroke={strokeMain}
              strokeWidth="2.4"
            />
            <path
              d="M 44 43 L 52 46 M 66 43 L 58 46"
              stroke="#FB7185"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 28 52 L 82 52 L 78 72 L 32 72 Z"
              fill="#E11D48"
              stroke={strokeMain}
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <text
              x="55"
              y="66"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {'>_C2'}
            </text>
          </g>
        )}

        {/* 2. PHISHING GATEWAY: Hand-Drawn Email Envelope + Fishing Hook */}
        {iconType === 'PHISHING_GATEWAY' && (
          <g>
            <path
              d="M 14 20 Q 55 17 96 20 Q 99 48 96 74 Q 55 77 14 74 Q 11 48 14 20 Z"
              fill="#FEF3C7"
              stroke={strokeMain}
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path
              d="M 15 22 L 55 50 L 95 22"
              fill="none"
              stroke={strokeMain}
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path
              d="M 18 70 L 42 46 M 92 70 L 68 46"
              stroke={strokeMain}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 76 8 L 76 34 C 76 43 64 43 64 35 C 64 31 68 29 70 31"
              fill="none"
              stroke="#E11D48"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <rect
              x="26"
              y="54"
              width="58"
              height="15"
              rx="3"
              fill="#F59E0B"
              stroke={strokeMain}
              strokeWidth="2"
            />
            <text
              x="55"
              y="64.5"
              textAnchor="middle"
              fill="#0F172A"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              MAIL / PROXY
            </text>
          </g>
        )}

        {/* 3. VICTIM LAPTOP: Hand-Drawn Open Laptop with Phishing Email & Alert */}
        {iconType === 'VICTIM_LAPTOP' && (
          <g>
            <path
              d="M 20 14 L 90 14 L 88 56 L 22 56 Z"
              fill="#E0F2FE"
              stroke={strokeMain}
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <rect
              x="27"
              y="20"
              width="56"
              height="30"
              fill="#FFFFFF"
              stroke={strokeMain}
              strokeWidth="1.8"
            />
            <path
              d="M 32 25 L 54 25 L 54 40 L 32 40 Z M 32 25 L 43 33 L 54 25"
              fill="#FEF08A"
              stroke={strokeMain}
              strokeWidth="1.6"
            />
            <circle
              cx="69"
              cy="33"
              r="8"
              fill="#EF4444"
              stroke={strokeMain}
              strokeWidth="1.8"
            />
            <text
              x="69"
              y="37"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
            >
              !
            </text>
            <path
              d="M 10 56 L 100 56 L 106 72 L 4 72 Z"
              fill="#CBD5E1"
              stroke={strokeMain}
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path
              d="M 44 64 L 66 64"
              stroke={strokeMain}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 4. MALWARE PAYLOAD: Hand-Drawn Anime Cyber-Bug / Malicious PE Binary */}
        {iconType === 'MALWARE_PAYLOAD' && (
          <g>
            <path
              d="M 32 12 L 78 12 L 96 30 L 96 60 L 78 78 L 32 78 L 14 60 L 14 30 Z"
              fill="#FEE2E2"
              stroke={strokeMain}
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path
              d="M 18 32 L 6 26 M 16 45 L 4 45 M 18 58 L 6 64 M 92 32 L 104 26 M 94 45 L 106 45 M 92 58 L 104 64"
              stroke="#DC2626"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle
              cx="55"
              cy="45"
              r="20"
              fill="#DC2626"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            <path
              d="M 45 39 L 52 43 M 65 39 L 58 43"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <text
              x="55"
              y="56"
              textAnchor="middle"
              fill="#FEF08A"
              fontSize="9.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              .EXE/DLL
            </text>
          </g>
        )}

        {/* 5. LATERAL SERVER: Hand-Drawn Domain Controller / Server Stack */}
        {iconType === 'LATERAL_SERVER' && (
          <g>
            <rect
              x="18"
              y="14"
              width="74"
              height="18"
              rx="3"
              fill="#EDE9FE"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            <circle cx="30" cy="23" r="3" fill="#7C3AED" />
            <circle cx="40" cy="23" r="3" fill="#10B981" />
            <path d="M 55 23 L 82 23" stroke={strokeMain} strokeWidth="2.2" />

            <rect
              x="18"
              y="36"
              width="74"
              height="18"
              rx="3"
              fill="#DDD6FE"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            <circle cx="30" cy="45" r="3" fill="#EF4444" />
            <circle cx="40" cy="45" r="3" fill="#F59E0B" />
            <path d="M 55 45 L 82 45" stroke={strokeMain} strokeWidth="2.2" />

            <rect
              x="18"
              y="58"
              width="74"
              height="18"
              rx="3"
              fill="#C4B5FD"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            <text
              x="55"
              y="70"
              textAnchor="middle"
              fill="#0F172A"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              CORP DC / SRV
            </text>
          </g>
        )}

        {/* 6. SIEM SENSOR: Hand-Drawn Radar Dish & Event Eye */}
        {iconType === 'SIEM_SENSOR' && (
          <g>
            <path
              d="M 16 16 Q 55 12 94 16 Q 98 45 94 76 Q 55 80 16 76 Q 12 45 16 16 Z"
              fill="#D1FAE5"
              stroke={strokeMain}
              strokeWidth="2.6"
            />
            <circle
              cx="55"
              cy="43"
              r="20"
              fill="#059669"
              stroke={strokeMain}
              strokeWidth="2.4"
            />
            <circle
              cx="55"
              cy="43"
              r="11"
              fill="none"
              stroke="#A7F3D0"
              strokeWidth="1.8"
              strokeDasharray="3 3"
            />
            <path
              d="M 55 43 L 70 30"
              stroke="#FEF08A"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle cx="55" cy="43" r="3.5" fill="#FFFFFF" />
            <text
              x="55"
              y="72"
              textAnchor="middle"
              fill="#064E3B"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              SIEM / SYSMON
            </text>
          </g>
        )}

        {/* 7. FIREWALL / ROUTER: Brick Wall + L3 Circular Routing Pucks */}
        {iconType === 'FIREWALL_ROUTER' && (
          <g>
            {/* Brick Firewall Backdrop */}
            <rect
              x="14"
              y="12"
              width="82"
              height="64"
              rx="6"
              fill="#FFEDD5"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            {/* Brick Pattern Lines */}
            <path
              d="M 14 28 L 96 28 M 14 44 L 96 44 M 38 12 L 38 28 M 72 12 L 72 28 M 55 28 L 55 44 M 32 44 L 32 60 M 78 44 L 78 60"
              stroke="#EA580C"
              strokeWidth="1.8"
              strokeOpacity="0.65"
            />
            {/* Router Cylinder Disc in Center */}
            <circle
              cx="55"
              cy="38"
              r="17"
              fill="#EA580C"
              stroke={strokeMain}
              strokeWidth="2.4"
            />
            {/* 4-Way Router Cross Arrows */}
            <path
              d="M 45 38 L 65 38 M 61 34 L 65 38 L 61 42 M 55 28 L 55 48 M 51 32 L 55 28 L 59 32"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="22"
              y="58"
              width="66"
              height="15"
              rx="3"
              fill="#1E293B"
              stroke={strokeMain}
              strokeWidth="1.8"
            />
            <text
              x="55"
              y="68.5"
              textAnchor="middle"
              fill="#FDBA74"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              FW / ROUTER
            </text>
          </g>
        )}

        {/* 8. CORE SWITCH: Enterprise Multi-Port L2/L3 Rack Switch */}
        {iconType === 'CORE_SWITCH' && (
          <g>
            <rect
              x="10"
              y="18"
              width="90"
              height="54"
              rx="6"
              fill="#E0F2FE"
              stroke={strokeMain}
              strokeWidth="2.6"
            />
            {/* Rack Switch Chassis */}
            <rect
              x="16"
              y="24"
              width="78"
              height="24"
              rx="3"
              fill="#0284C7"
              stroke={strokeMain}
              strokeWidth="2.2"
            />
            {/* Bidirectional Switching Chevrons */}
            <path
              d="M 24 32 L 46 32 M 42 29 L 46 32 L 42 35 M 86 40 L 64 40 M 68 37 L 64 40 L 68 43"
              stroke="#FEF08A"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* 6 RJ45 VLAN Switch Ports */}
            {[20, 32, 44, 56, 68, 80].map((px) => (
              <rect
                key={px}
                x={px}
                y="53"
                width="8"
                height="6"
                rx="1"
                fill="#10B981"
                stroke={strokeMain}
                strokeWidth="1.4"
              />
            ))}
            <text
              x="55"
              y="68.5"
              textAnchor="middle"
              fill="#0F172A"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              L3 VLAN SWITCH
            </text>
          </g>
        )}

        {/* 9. WAF / REVERSE PROXY: Shield + Web Globe & Inspection Filter */}
        {iconType === 'WAF_REVERSE_PROXY' && (
          <g>
            <rect
              x="14"
              y="14"
              width="82"
              height="62"
              rx="8"
              fill="#FEF3C7"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            {/* Shield Silhouette */}
            <path
              d="M 55 19 L 80 26 L 80 43 C 80 55 68 62 55 66 C 42 62 30 55 30 43 L 30 26 Z"
              fill="#D97706"
              stroke={strokeMain}
              strokeWidth="2.3"
              strokeLinejoin="round"
            />
            {/* Globe Grid inside Shield */}
            <circle
              cx="55"
              cy="41"
              r="11"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.8"
            />
            <path
              d="M 44 41 L 66 41 M 55 30 L 55 52"
              stroke="#FFFFFF"
              strokeWidth="1.6"
            />
            <rect
              x="22"
              y="59"
              width="66"
              height="14"
              rx="3"
              fill="#FFFFFF"
              stroke={strokeMain}
              strokeWidth="1.8"
            />
            <text
              x="55"
              y="69"
              textAnchor="middle"
              fill="#0F172A"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              WAF / PROXY
            </text>
          </g>
        )}

        {/* 10. DNS RESOLVER: Hierarchical Domain Tree + UDP 53 Lookup */}
        {iconType === 'DNS_RESOLVER' && (
          <g>
            <rect
              x="14"
              y="14"
              width="82"
              height="62"
              rx="8"
              fill="#E0E7FF"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            {/* Root Node */}
            <circle
              cx="55"
              cy="26"
              r="6"
              fill="#4F46E5"
              stroke={strokeMain}
              strokeWidth="2"
            />
            {/* Child Resolver Nodes */}
            <path
              d="M 55 32 L 35 46 M 55 32 L 75 46"
              stroke={strokeMain}
              strokeWidth="2.2"
            />
            <circle
              cx="35"
              cy="48"
              r="6"
              fill="#0284C7"
              stroke={strokeMain}
              strokeWidth="2"
            />
            <circle
              cx="75"
              cy="48"
              r="6"
              fill="#E11D48"
              stroke={strokeMain}
              strokeWidth="2"
            />
            <rect
              x="22"
              y="58"
              width="66"
              height="14"
              rx="3"
              fill="#1E1B4B"
              stroke={strokeMain}
              strokeWidth="1.8"
            />
            <text
              x="55"
              y="68"
              textAnchor="middle"
              fill="#A5B4FC"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              DNS UDP/53
            </text>
          </g>
        )}

        {/* 11. KERNEL_MEMORY: CPU / Virtual Memory RAM Chip */}
        {iconType === 'KERNEL_MEMORY' && (
          <g>
            <rect
              x="22"
              y="16"
              width="66"
              height="58"
              rx="6"
              fill="#FFE4E6"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            {/* CPU Pins */}
            {[24, 38, 52].map((py) => (
              <path
                key={py}
                d={`M 12 ${py} L 22 ${py} M 88 ${py} L 98 ${py}`}
                stroke={strokeMain}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}
            <rect
              x="31"
              y="24"
              width="48"
              height="28"
              rx="3"
              fill="#E11D48"
              stroke={strokeMain}
              strokeWidth="2"
            />
            <text
              x="55"
              y="42"
              textAnchor="middle"
              fill="#FEF08A"
              fontSize="9.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              RWX/RAM
            </text>
            <text
              x="55"
              y="66"
              textAnchor="middle"
              fill="#0F172A"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              VAD / NTDLL
            </text>
          </g>
        )}

        {/* 12. PROCESS_THREAD: OS Process Execution Terminal & Gear */}
        {iconType === 'PROCESS_THREAD' && (
          <g>
            <rect
              x="14"
              y="16"
              width="82"
              height="58"
              rx="6"
              fill="#FEF2F2"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            <rect
              x="14"
              y="16"
              width="82"
              height="14"
              rx="4"
              fill="#1E293B"
              stroke={strokeMain}
              strokeWidth="2"
            />
            <circle cx="23" cy="23" r="2.5" fill="#EF4444" />
            <circle cx="31" cy="23" r="2.5" fill="#F59E0B" />
            <circle cx="39" cy="23" r="2.5" fill="#10B981" />
            <text
              x="55"
              y="52"
              textAnchor="middle"
              fill="#DC2626"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              PID::EXEC
            </text>
            <text
              x="55"
              y="67"
              textAnchor="middle"
              fill="#334155"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              THREAD / API
            </text>
          </g>
        )}

        {/* 13. PACKET_ENGINE: Deep Packet Inspection / ACL Filter */}
        {iconType === 'PACKET_ENGINE' && (
          <g>
            <rect
              x="14"
              y="16"
              width="82"
              height="58"
              rx="6"
              fill="#FFF7ED"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            <path
              d="M 26 28 L 84 28 L 66 48 L 66 64 L 44 64 L 44 48 Z"
              fill="#F97316"
              stroke={strokeMain}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <text
              x="55"
              y="42"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ACL / DPI
            </text>
          </g>
        )}

        {/* 14. CREDENTIAL_VAULT: Kerberos KDC / VSS Storage Vault */}
        {iconType === 'CREDENTIAL_VAULT' && (
          <g>
            <rect
              x="16"
              y="14"
              width="78"
              height="62"
              rx="7"
              fill="#F3E8FF"
              stroke={strokeMain}
              strokeWidth="2.5"
            />
            <circle
              cx="55"
              cy="40"
              r="15"
              fill="#7C3AED"
              stroke={strokeMain}
              strokeWidth="2.2"
            />
            <circle
              cx="55"
              cy="40"
              r="5"
              fill="#FEF08A"
              stroke={strokeMain}
              strokeWidth="1.6"
            />
            <text
              x="55"
              y="69"
              textAnchor="middle"
              fill="#4C1D95"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              KDC / VAULT
            </text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}

