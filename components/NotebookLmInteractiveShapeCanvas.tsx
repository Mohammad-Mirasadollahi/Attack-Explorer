'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  HardDrive,
  Lock,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Unlock,
} from 'lucide-react';
import {
  UniversalInternalShapeMotionKind,
  UniversalScrollyChapterSpec,
  UniversalScrollyVisualState,
  UniversalShapeMechanismKind,
} from '@/lib/universal-scrollytelling';
import { SketchNodeIcon } from './SketchNodeIcons';
import { SketchIconType } from '@/lib/sketch-zones-and-drilldown';

function getChapterMeta(chapter: UniversalScrollyChapterSpec) {
  const refSub =
    chapter.subSteps.find((s) => s.subStepLetter === 'B') ||
    chapter.subSteps[0];
  const waveCount =
    refSub.shapeChoreography.topologyWaveNodes?.length ||
    chapter.subSteps[1]?.shapeChoreography.topologyWaveNodes?.length ||
    3;
  return {
    fromNodeLabel: refSub.initiatorLabel,
    fromNodeSublabel: refSub.initiatorSublabel,
    fromNodeIcon: refSub.initiatorIcon,
    toNodeLabel: refSub.targetLabel,
    toNodeSublabel: refSub.targetSublabel,
    toNodeIcon: refSub.targetIcon,
    protocolBadge: refSub.protocolBadge,
    forwardFlowBadge:
      chapter.stageNumber === 0 ? 'BRIEFING' : `#${chapter.stageNumber}→`,
    returnFlowBadge: refSub.returnBadge,
    topologyNodeCount: waveCount,
    mitreCode: chapter.mitreCode,
    stageNumber: chapter.stageNumber,
  };
}

export interface NotebookLmInteractiveShapeCanvasProps {
  visualState: UniversalScrollyVisualState;
  focusedMotionIndex: 0 | 1 | 2;
  onSelectMotionIndex: (idx: 0 | 1 | 2) => void;
  onSelectSubStep: (subStepId: string) => void;
}

/**
 * Architectural Scene Blueprints inspired by Process Hollowing's 6 distinct stage layouts,
 * generalized and tailored to each scenario's domain, telemetry, and stage mechanism.
 */
type ArchitecturalSceneBlueprint =
  | 'STAGE0_BRIEFING_ARCHITECTURE'
  | 'BRIDGE_HANDSHAKE_AND_RETURN_LOOPS'
  | 'SPLIT_STRUCT_AND_CONTAINER_MUTATION'
  | 'CROSS_NODE_STREAM_AND_PAYLOAD_REACTOR'
  | 'SLIDING_POINTER_AND_STATE_CONTROLLER'
  | 'THREE_NODE_PIPELINE_AND_SPECTRUM';

/**
 * Selects a distinct architectural blueprint for each stage of a scenario
 * based on the stage's technical mechanism AND stage number, ensuring consecutive
 * stages never repeat the same layout while matching the stage's real operation.
 */
function selectStageArchitecturalBlueprint(
  visualState: UniversalScrollyVisualState
): ArchitecturalSceneBlueprint {
  const { stageNumber, activeChapter, activeSubStep } = visualState;
  if (stageNumber === 0) {
    return 'STAGE0_BRIEFING_ARCHITECTURE';
  }

  // Use the stage's deep-technical phase (C) mechanism as the canonical mechanism for the stage
  const stageCSubStep =
    activeChapter.subSteps.find((s) => s.subStepLetter === 'C') || activeSubStep;
  const mech: UniversalShapeMechanismKind =
    stageCSubStep.shapeChoreography.mechanismKind;

  // Map specific technical mechanisms to their best-fit architectural blueprint,
  // while rotating blueprints across stages so every stage in a scenario feels distinct.
  const blueprintOrder: ArchitecturalSceneBlueprint[] = [
    'BRIDGE_HANDSHAKE_AND_RETURN_LOOPS',
    'SPLIT_STRUCT_AND_CONTAINER_MUTATION',
    'CROSS_NODE_STREAM_AND_PAYLOAD_REACTOR',
    'SLIDING_POINTER_AND_STATE_CONTROLLER',
    'THREE_NODE_PIPELINE_AND_SPECTRUM',
  ];

  let preferred: ArchitecturalSceneBlueprint;
  switch (mech) {
    case 'KERBEROS_TGS_RC4_TICKET_FORGE':
    case 'BIDIRECTIONAL_PROTOCOL_HANDSHAKE_SWIMLANE':
      preferred = 'BRIDGE_HANDSHAKE_AND_RETURN_LOOPS';
      break;
    case 'PROCESS_MEMORY_VAD_HOLLOW_AND_INJECT':
    case 'AMSI_MEMORY_PATCH_AND_CLR_REFLECTION':
    case 'VSS_SHADOW_DELETE_AND_CIPHER_STREAM':
    case 'RING3_TO_RING0_IOCTL_KERNEL_BYOVD':
      preferred = 'SPLIT_STRUCT_AND_CONTAINER_MUTATION';
      break;
    case 'DNS_SUBDOMAIN_BASE32_CHUNK_TUNNEL':
    case 'JNDI_LOOKUP_REMOTE_CLASS_INJECTION':
    case 'CICD_PIPELINE_ARTIFACT_TAMPER_DAG':
    case 'APPLIANCE_EDGE_EXPLOIT_AND_WEBSHELL':
      preferred = 'CROSS_NODE_STREAM_AND_PAYLOAD_REACTOR';
      break;
    case 'HASHCAT_GPU_CRACK_AND_SMB_PTH':
    case 'DCSYNC_DRSR_DIRECTORY_REPLICATION':
    case 'CLOUD_IMDS_OAUTH_TOKEN_PIVOT':
      preferred = 'SLIDING_POINTER_AND_STATE_CONTROLLER';
      break;
    case 'KILLCHAIN_WATERFALL_SIEM_CORRELATION':
    case 'SIEM_RULE_FIELD_MATCH_AND_MITIGATION_SHIELD':
      preferred = 'THREE_NODE_PIPELINE_AND_SPECTRUM';
      break;
    default:
      preferred =
        blueprintOrder[(stageNumber - 1) % blueprintOrder.length];
      break;
  }

  // If the previous stage would have picked the exact same blueprint, rotate to a complementary one
  // so Stage 1, Stage 2, Stage 3, Stage 4, Stage 5 always have distinct visual layouts.
  if (stageNumber > 1) {
    const prevChapter = visualState.allChapters.find(
      (c) => c.stageNumber === stageNumber - 1
    );
    const prevC = prevChapter?.subSteps.find((s) => s.subStepLetter === 'C');
    if (prevC && prevC.shapeChoreography.mechanismKind === mech) {
      return blueprintOrder[(stageNumber - 1) % blueprintOrder.length];
    }
  }

  return preferred;
}

/**
 * Renders the domain-specific internal SVG widget inside the architectural scene
 * (e.g., Cipher Downgrade AES->RC4, Hashcat Rotor, DNS Chunk Slicer, VSS Shatter, JNDI Dial, Kernel Ring-0).
 */
function MechanismMicroVisual({
  motionKind,
  isActive,
  liveMetric,
}: {
  motionKind: UniversalInternalShapeMotionKind;
  isActive: boolean;
  liveMetric: string;
}) {
  switch (motionKind) {
    case 'LOCK_MORPH':
      return (
        <div
          data-testid="internal-shape-motion-LOCK_MORPH"
          className="p-2 rounded-lg bg-amber-50/90 dark:bg-zinc-950 border border-amber-300 dark:border-amber-800 font-mono space-y-1"
        >
          <div className="flex items-center justify-between text-[8.5px] font-extrabold text-amber-800 dark:text-amber-300">
            <span>CIPHER DOWNGRADE</span>
            <span>AES 0x12 ➔ RC4 0x17</span>
          </div>
          <svg viewBox="0 0 210 34" className="w-full h-8 overflow-visible">
            <rect
              x="4"
              y="4"
              width="62"
              height="26"
              rx="4"
              fill="#e0e7ff"
              stroke="#4f46e5"
              strokeWidth="1.5"
            />
            <text
              x="35"
              y="20"
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="bold"
              fill="#312e81"
            >
              AES-256 (0x12)
            </text>
            <line
              x1="70"
              y1="17"
              x2="132"
              y2="17"
              stroke="#d97706"
              strokeWidth="1.8"
              strokeDasharray="4 2"
            />
            <motion.circle
              r="4"
              cy="17"
              fill="#e11d48"
              animate={{ cx: isActive ? [74, 128, 74] : 100 }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <rect
              x="136"
              y="4"
              width="70"
              height="26"
              rx="4"
              fill="#ffe4e6"
              stroke="#e11d48"
              strokeWidth="1.8"
            />
            <text
              x="171"
              y="20"
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="bold"
              fill="#9f1239"
            >
              RC4-HMAC (0x17)
            </text>
          </svg>
        </div>
      );

    case 'ROTOR_CRACK':
      return (
        <div
          data-testid="internal-shape-motion-ROTOR_CRACK"
          className="p-2 rounded-lg bg-rose-50/90 dark:bg-zinc-950 border border-rose-300 dark:border-rose-800 font-mono space-y-1"
        >
          <div className="flex items-center justify-between text-[8.5px] font-extrabold text-rose-800 dark:text-rose-300">
            <span>OFFLINE KEYSTREAM ROTOR</span>
            <span>HASH ➔ NTLM KEY</span>
          </div>
          <svg viewBox="0 0 210 34" className="w-full h-8 overflow-visible">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '24px 17px' }}
            >
              <circle
                cx="24"
                cy="17"
                r="12"
                fill="none"
                stroke="#e11d48"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <circle cx="24" cy="17" r="4.5" fill="#e11d48" />
            </motion.g>
            <line
              x1="42"
              y1="17"
              x2="126"
              y2="17"
              stroke="#e11d48"
              strokeWidth="1.8"
            />
            <motion.rect
              x="52"
              y="10"
              width="42"
              height="14"
              rx="3"
              fill="#f59e0b"
              animate={{ x: [46, 80, 46] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <rect
              x="132"
              y="4"
              width="74"
              height="26"
              rx="4"
              fill="#dcfce7"
              stroke="#059669"
              strokeWidth="1.8"
            />
            <text
              x="169"
              y="20"
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="bold"
              fill="#065f46"
            >
              PTH AUTH OK
            </text>
          </svg>
        </div>
      );

    case 'TOKEN_FORGE':
      return (
        <div
          data-testid="internal-shape-motion-TOKEN_FORGE"
          className="p-2 rounded-lg bg-amber-50/90 dark:bg-zinc-950 border border-amber-300 dark:border-amber-800 font-mono space-y-1"
        >
          <div className="flex items-center justify-between text-[8.5px] font-extrabold text-amber-800 dark:text-amber-300">
            <span>PRIVILEGED TOKEN / SCM MINT</span>
            <span>SYSTEM / DRSR</span>
          </div>
          <svg viewBox="0 0 210 34" className="w-full h-8 overflow-visible">
            <rect
              x="4"
              y="4"
              width="66"
              height="26"
              rx="4"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="1.6"
            />
            <text
              x="37"
              y="20"
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="bold"
              fill="#78350f"
            >
              SCM / NTDS
            </text>
            <line
              x1="74"
              y1="17"
              x2="130"
              y2="17"
              stroke="#d97706"
              strokeWidth="2"
            />
            <motion.circle
              r="4"
              cy="17"
              fill="#e11d48"
              animate={{ cx: [78, 126] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            <rect
              x="134"
              y="4"
              width="72"
              height="26"
              rx="4"
              fill="#ffe4e6"
              stroke="#e11d48"
              strokeWidth="1.8"
            />
            <text
              x="170"
              y="20"
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="bold"
              fill="#9f1239"
            >
              SYSTEM TOKEN
            </text>
          </svg>
        </div>
      );

    case 'SCANNER_BYPASS':
    case 'JNDI_LOOKUP_DIAL':
    case 'PACKET_SLICER':
    case 'SNAPSHOT_SHATTER':
    case 'PIPELINE_HASH_MUTATE':
    case 'CALLBACK_ARRAY_WIPE':
    case 'RADAR_RULE_MATCH':
    case 'HEX_STREAM':
    case 'SYSCALL_BRIDGE':
    default:
      return (
        <div
          data-testid={`internal-shape-motion-${motionKind}`}
          className="p-2 rounded-lg bg-zinc-900 text-emerald-400 border border-zinc-800 font-mono text-[8.5px] flex items-center justify-between gap-2"
        >
          <span className="truncate">{liveMetric}</span>
          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-extrabold shrink-0">
            LIVE
          </span>
        </div>
      );
  }
}

/**
 * STAGE 0 BRIEFING ARCHITECTURAL SCENE (0A -> 0B -> 0C -> 0D)
 * Inspired directly by Process Hollowing's Stage0BriefingScene:
 * - Top 2-Column Comparison: 0A (Trust Boundary / Direct Path Guard) vs 0B (Adversary Evasion / Pivot Vector)
 * - Middle Split Architecture (0C): Legitimate Baseline State vs. Compromised Runtime State
 * - Bottom Kill-Chain Strip (0D): Clickable Multi-Stage Kill-Chain Map (#1..#N)
 */
function UniversalStage0BriefingScene({
  visualState,
  onSelectSubStep,
}: {
  visualState: UniversalScrollyVisualState;
  onSelectSubStep: (id: string) => void;
}) {
  const {
    activeSubStep: sub,
    activeChapter: chapter,
    subStepIndex,
    allChapters: chapters,
  } = visualState;
  const stageChapters = chapters.filter((c) => c.stageNumber > 0);
  const firstStage = getChapterMeta(stageChapters[0] || chapter);
  const lastStage = getChapterMeta(
    stageChapters[stageChapters.length - 1] || chapter
  );
  const briefingMeta = getChapterMeta(chapter);

  return (
    <div className="space-y-2.5" data-testid="universal-stage-0-briefing-scene">
      {/* TOP 2-COLUMN COMPARISON: 0A (Target Boundary / Guard) vs 0B (Adversary Vector / Evasion) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Card A: Initial Entry / Guarded Perimeter (0A Focus) */}
        <motion.div
          animate={{
            scale: sub.id === '0A' ? 1.015 : 0.985,
            opacity: sub.id === '0A' || sub.id === '0D' ? 1 : 0.84,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onClick={() => onSelectSubStep('0A')}
          className="relative rounded-xl bg-white dark:bg-zinc-900 border-2 border-rose-400 dark:border-rose-500/80 p-2.5 shadow-2xs space-y-1.5 cursor-pointer"
        >
          {sub.id === '0A' && (
            <motion.div
              layoutId="uni-stage0-focus-ring"
              className="absolute inset-0 rounded-xl ring-2 ring-rose-500/60 pointer-events-none"
            />
          )}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-7 rounded-lg bg-rose-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-800 flex items-center justify-center p-0.5 shrink-0">
                <SketchNodeIcon
                  iconType={firstStage.fromNodeIcon}
                  isActive={sub.id === '0A'}
                  isCompromised={true}
                />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10.5px] font-extrabold text-zinc-900 dark:text-white truncate">
                  {firstStage.fromNodeLabel}
                </div>
                <div className="font-mono text-[9px] text-zinc-500 truncate">
                  {firstStage.fromNodeSublabel}
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[8px] font-extrabold shrink-0">
              0A · ENTRY
            </span>
          </div>

          <div className="p-1.5 rounded-lg bg-rose-50/90 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-800 font-mono text-[9px] space-y-1">
            <div className="flex items-center justify-between text-rose-800 dark:text-rose-200 font-bold">
              <span className="truncate">{firstStage.protocolBadge}</span>
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 shrink-0">
                <ShieldAlert className="w-3 h-3" />
                <span>GUARD BOUNDARY</span>
              </span>
            </div>
            <svg viewBox="0 0 200 18" className="w-full h-4 overflow-visible">
              <line
                x1="8"
                y1="9"
                x2="152"
                y2="9"
                stroke="#f43f5e"
                strokeWidth="1.8"
                strokeDasharray="4 3"
              />
              <motion.circle
                key={`s0a-pkt-${sub.id}`}
                cx="20"
                cy="9"
                r="4"
                fill="#e11d48"
                initial={{ cx: 14 }}
                animate={{ cx: [14, 145, 130] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
              />
              <g transform="translate(156, 2)">
                <rect width="38" height="14" rx="3" fill="#e11d48" />
                <text
                  x="19"
                  y="10"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7.5"
                  fontWeight="bold"
                >
                  GUARD
                </text>
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Card B: Pivoted / Trusted Execution Surface (0B Focus) */}
        <motion.div
          animate={{
            scale: sub.id === '0B' ? 1.015 : 0.985,
            opacity: sub.id !== '0A' ? 1 : 0.84,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onClick={() => onSelectSubStep('0B')}
          className="relative rounded-xl bg-white dark:bg-zinc-900 border-2 border-sky-400 dark:border-sky-500/80 p-2.5 shadow-2xs space-y-1.5 cursor-pointer"
        >
          {sub.id === '0B' && (
            <motion.div
              layoutId="uni-stage0-focus-ring"
              className="absolute inset-0 rounded-xl ring-2 ring-sky-500/60 pointer-events-none"
            />
          )}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-7 rounded-lg bg-sky-50 dark:bg-zinc-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center p-0.5 shrink-0">
                <SketchNodeIcon
                  iconType={lastStage.toNodeIcon}
                  isActive={sub.id === '0B'}
                  isCompromised={subStepIndex >= 2}
                />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10.5px] font-extrabold text-zinc-900 dark:text-white truncate">
                  {lastStage.toNodeLabel}
                </div>
                <div className="font-mono text-[9px] text-zinc-500 truncate">
                  {lastStage.toNodeSublabel}
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono text-[8px] font-extrabold shrink-0">
              0B · TOPOLOGY
            </span>
          </div>

          <div className="p-1.5 rounded-lg bg-emerald-50/90 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800 font-mono text-[9px] space-y-1">
            <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-200 font-bold">
              <span className="truncate">
                {briefingMeta.topologyNodeCount} Topology Nodes
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-3 h-3" />
                <span>PATH MAPPED</span>
              </span>
            </div>
            <svg viewBox="0 0 200 18" className="w-full h-4 overflow-visible">
              <line
                x1="8"
                y1="9"
                x2="152"
                y2="9"
                stroke="#10b981"
                strokeWidth="1.8"
                strokeDasharray="4 3"
              />
              <motion.circle
                key={`s0b-pkt-${sub.id}`}
                cx="20"
                cy="9"
                r="4"
                fill="#059669"
                initial={{ cx: 14 }}
                animate={{ cx: 146 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              />
              <g transform="translate(156, 2)">
                <rect width="38" height="14" rx="3" fill="#059669" />
                <text
                  x="19"
                  y="10"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7.5"
                  fontWeight="bold"
                >
                  PIVOT
                </text>
              </g>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* MIDDLE SHAPE (0C Focus): Baseline Architecture vs. Compromised Runtime State */}
      <motion.div
        animate={{
          scale: sub.id === '0C' ? 1.01 : 0.995,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 24 }}
        onClick={() => onSelectSubStep('0C')}
        className={`relative rounded-xl border p-2.5 font-mono space-y-1.5 cursor-pointer ${
          sub.id === '0C'
            ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-500 shadow-xs'
            : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between gap-2 text-[9.5px]">
          <span className="font-extrabold uppercase text-indigo-700 dark:text-indigo-300 flex items-center gap-1 truncate">
            <HardDrive className="w-3 h-3 shrink-0" />
            <span className="truncate">
              0C · Baseline vs. Compromised Telemetry State
            </span>
          </span>
          <span className="text-[8.5px] font-bold text-rose-600 dark:text-rose-400 shrink-0">
            {subStepIndex >= 2 ? 'COMPROMISED STATE' : 'BASELINE STATE'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[9px]">
          <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-300 dark:border-emerald-800 space-y-1">
            <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
              <span>Expected Baseline</span>
              <span>✓ NORMAL</span>
            </div>
            <div className="p-1 rounded bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 text-zinc-700 dark:text-zinc-300 truncate">
              {firstStage.fromNodeLabel} (Standard Policy)
            </div>
          </div>

          <div className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/25 border border-rose-300 dark:border-rose-800 space-y-1 overflow-hidden">
            <div className="flex items-center justify-between font-bold text-rose-800 dark:text-rose-300">
              <span>Adversary Mutation</span>
              <span>{firstStage.mitreCode.split('·')[0]}</span>
            </div>
            <motion.div
              key={subStepIndex >= 2 ? 'state-mutated' : 'state-standby'}
              initial={{ x: 18, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className={`p-1 rounded border font-bold truncate ${
                subStepIndex >= 2
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-white dark:bg-zinc-900 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
              }`}
            >
              {firstStage.protocolBadge} · {lastStage.toNodeLabel}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* BOTTOM SHAPE (0D Focus): Multi-Stage Kill-Chain Motion Map */}
      <motion.div
        className={`rounded-xl border p-2.5 space-y-1.5 ${
          sub.id === '0D'
            ? 'bg-amber-50/60 dark:bg-amber-950/25 border-amber-500 shadow-xs'
            : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between font-mono text-[9.5px]">
          <span className="font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            0D · {stageChapters.length}-Stage Kill-Chain Motion Map (Click Any Stage)
          </span>
          <span className="text-zinc-500 text-[8.5px]">
            S1 ──▶ S{stageChapters.length}
          </span>
        </div>

        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${Math.min(5, Math.max(2, stageChapters.length))}, minmax(0, 1fr))`,
          }}
        >
          {stageChapters.slice(0, 5).map((stChapter, idx) => {
            const st = getChapterMeta(stChapter);
            return (
              <motion.button
                key={st.stageNumber}
                type="button"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  borderColor:
                    sub.id === '0D' ? '#f59e0b' : 'rgba(161,161,170,0.35)',
                }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => onSelectSubStep(`${st.stageNumber}A`)}
                className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border text-left transition-colors cursor-pointer min-w-0"
              >
                <div className="font-mono text-[9px] font-extrabold text-zinc-900 dark:text-white truncate">
                  #{st.stageNumber} {st.toNodeLabel}
                </div>
                <div className="font-mono text-[8px] text-indigo-600 dark:text-indigo-400 truncate">
                  {st.mitreCode.split('·')[0]?.trim()}
                </div>
                <div className="font-mono text-[8px] text-rose-600 dark:text-rose-400 font-bold truncate mt-0.5">
                  {st.protocolBadge}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * BLUEPRINT 1: BRIDGE HANDSHAKE & CURVED RETURN LOOPS SCENE (A -> B -> C -> D)
 * Inspired directly by Process Hollowing Stage 1 (Stage1SuspendedSpawnScene):
 * - Top Node: Initiator Actor + Return Artifact/Ticket/Handle Readout Slot
 * - Middle SVG Choreography: Center Request Spine + 3 Progressive Phase Badges (A, B, C) + Left & Right Curved Return Paths (D)
 * - Bottom Node: Target Service/Host + Status Bar with Lock/Unlock state transition
 */
function BridgeHandshakeAndReturnLoopsScene({
  visualState,
  onSelectSubStep,
}: {
  visualState: UniversalScrollyVisualState;
  onSelectSubStep: (id: string) => void;
}) {
  const { activeChapter: rawChapter, activeSubStep: sub, subStepIndex } =
    visualState;
  const chapter = getChapterMeta(rawChapter);
  const stageNum = rawChapter.stageNumber;
  const phaseBReached = subStepIndex >= 1;
  const phaseCReached = subStepIndex >= 2;
  const phaseDReached = subStepIndex >= 3;

  const stageCSub =
    rawChapter.subSteps.find((s) => s.subStepLetter === 'C') || sub;
  const motionCues = stageCSub.shapeChoreography.motions;
  const internalKind =
    stageCSub.shapeChoreography.shapes[1]?.internalMotionKind ||
    'SYSCALL_BRIDGE';

  return (
    <div
      data-testid="universal-bridge-handshake-scene"
      className="flex flex-col items-center justify-between gap-2"
    >
      {/* TOP NODE: Initiator Actor + Acquired Return Artifact Slot */}
      <motion.div
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full rounded-xl bg-white dark:bg-zinc-900 border-2 border-rose-500/80 p-2.5 shadow-xs space-y-1.5 z-10"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-7 rounded-lg bg-rose-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType={chapter.fromNodeIcon}
                isActive={subStepIndex === 0}
                isCompromised={true}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-xs font-extrabold text-zinc-900 dark:text-white truncate">
                  {chapter.fromNodeLabel}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[9px] font-bold text-zinc-700 dark:text-zinc-300">
                  {chapter.fromNodeSublabel}
                </span>
              </div>
              <div className="font-mono text-[9px] text-zinc-500 dark:text-zinc-400 truncate">
                {sub.headline}
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[8.5px] font-extrabold shrink-0">
            INITIATOR
          </span>
        </div>

        {/* Returned Artifact / Ticket / Handle Readout Bar */}
        <motion.div
          animate={{ scale: phaseCReached ? 1.01 : 1 }}
          className={`px-2.5 py-1 rounded-lg border font-mono text-[9.5px] flex flex-wrap items-center justify-between gap-1 transition-colors ${
            phaseCReached
              ? 'bg-amber-50/90 dark:bg-amber-950/35 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200'
              : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <span className="font-semibold">RETURNED ARTIFACT:</span>
          {phaseCReached ? (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-extrabold text-rose-600 dark:text-rose-400 truncate"
            >
              {chapter.returnFlowBadge} · {motionCues[2]?.extractedTextToken}
            </motion.span>
          ) : (
            <span className="italic">
              [ Awaiting {chapter.toNodeLabel} Response ]
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* MIDDLE SVG CHOREOGRAPHY: Request Spine + Curved Return Paths + 3 Phase Pills */}
      <div className="relative w-full min-h-[132px] flex flex-col items-center justify-center py-1">
        <svg
          viewBox="0 0 560 132"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="uni-arrow-left"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#e11d48" />
            </marker>
            <marker
              id="uni-arrow-right"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#d97706" />
            </marker>
          </defs>

          {/* Center Downward Request Spine */}
          <line
            x1="280"
            y1="6"
            x2="280"
            y2="126"
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <motion.circle
            key={`req-dot-${sub.id}`}
            cx="280"
            r="4.5"
            fill="#4f46e5"
            initial={{ cy: 12 }}
            animate={{ cy: [12, 120] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
          />

          {/* Left Curved Return Loop */}
          <motion.path
            d="M 120 122 C 16 122, 16 12, 120 12"
            fill="none"
            stroke="#e11d48"
            strokeWidth="2.3"
            strokeDasharray="5 4"
            markerEnd="url(#uni-arrow-left)"
            animate={{ opacity: phaseCReached ? 1 : 0.18 }}
          />
          {phaseCReached && (
            <motion.circle
              key={`left-ret-${sub.id}`}
              r="4.5"
              fill="#e11d48"
              animate={{
                cx: [120, 38, 38, 120],
                cy: [122, 90, 34, 12],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Right Curved Telemetry / Return Loop */}
          <motion.path
            d="M 440 122 C 544 122, 544 12, 440 12"
            fill="none"
            stroke="#d97706"
            strokeWidth="2.3"
            strokeDasharray="5 4"
            markerEnd="url(#uni-arrow-right)"
            animate={{ opacity: phaseDReached ? 1 : 0.18 }}
          />
          {phaseDReached && (
            <motion.circle
              key={`right-ret-${sub.id}`}
              r="4.5"
              fill="#d97706"
              animate={{
                cx: [440, 522, 522, 440],
                cy: [122, 90, 34, 12],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </svg>

        <div className="w-full flex items-center justify-between gap-1.5 z-10 px-1">
          {/* Left Return Pill */}
          <motion.button
            type="button"
            onClick={() => onSelectSubStep(`${stageNum}C`)}
            animate={{
              opacity: phaseCReached ? 1 : 0.35,
              scale: phaseCReached ? 1.03 : 0.94,
            }}
            className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/90 border border-rose-500 text-rose-700 dark:text-rose-200 font-mono text-[9px] font-extrabold shadow-xs cursor-pointer max-w-[115px] truncate"
          >
            ⇠ {chapter.returnFlowBadge}
          </motion.button>

          {/* Center 3-Step Progression Stack (A -> B -> C) */}
          <div className="flex flex-col items-center gap-1 min-w-0 max-w-[230px]">
            <motion.button
              type="button"
              onClick={() => onSelectSubStep(`${stageNum}A`)}
              animate={{ scale: subStepIndex === 0 ? 1.04 : 0.98 }}
              className="px-2 py-0.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-[9px] font-extrabold shadow-2xs truncate max-w-full cursor-pointer"
            >
              {stageNum}A · {chapter.forwardFlowBadge} ({chapter.protocolBadge})
            </motion.button>

            <motion.button
              type="button"
              onClick={() => onSelectSubStep(`${stageNum}B`)}
              animate={{
                opacity: phaseBReached ? 1 : 0.45,
                scale: subStepIndex === 1 ? 1.04 : 0.96,
              }}
              className={`px-2 py-0.5 rounded-md border font-mono text-[9px] font-bold truncate max-w-full cursor-pointer ${
                phaseBReached
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              {stageNum}B · {motionCues[0]?.extractedTextToken || chapter.toNodeLabel}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => onSelectSubStep(`${stageNum}C`)}
              animate={{
                opacity: phaseCReached ? 1 : 0.45,
                scale: subStepIndex === 2 ? 1.05 : 0.96,
              }}
              className={`px-2 py-0.5 rounded-md border font-mono text-[9px] font-extrabold truncate max-w-full cursor-pointer ${
                phaseCReached
                  ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              {stageNum}C · {motionCues[1]?.extractedTextToken || stageCSub.protocolBadge}
            </motion.button>
          </div>

          {/* Right Forensic Catch Pill (D) */}
          <motion.button
            type="button"
            onClick={() => onSelectSubStep(`${stageNum}D`)}
            animate={{
              opacity: phaseDReached ? 1 : 0.35,
              scale: phaseDReached ? 1.03 : 0.94,
            }}
            className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/90 border border-amber-500 text-amber-800 dark:text-amber-200 font-mono text-[9px] font-extrabold shadow-xs cursor-pointer max-w-[115px] truncate"
          >
            {chapter.protocolBadge} ⇠
          </motion.button>
        </div>
      </div>

      {/* BOTTOM NODE: Target Service/Host + Internal Mechanism Micro-Visual */}
      <motion.div
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full rounded-xl bg-white dark:bg-zinc-900 border-2 border-sky-500/80 p-2.5 shadow-xs space-y-1.5 z-10"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-7 rounded-lg bg-sky-50 dark:bg-zinc-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType={chapter.toNodeIcon}
                isActive={phaseBReached}
                isCompromised={phaseCReached}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-xs font-extrabold text-zinc-900 dark:text-white truncate">
                  {chapter.toNodeLabel}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[9px] font-bold">
                  {chapter.protocolBadge}
                </span>
              </div>
              <div className="font-mono text-[9px] text-zinc-500 dark:text-zinc-400 truncate">
                {chapter.toNodeSublabel}
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-sky-600 text-white font-mono text-[8.5px] font-extrabold shrink-0">
            {chapter.mitreCode.split('·')[0]?.trim()}
          </span>
        </div>

        <MechanismMicroVisual
          motionKind={internalKind}
          isActive={phaseCReached}
          liveMetric={sub.stateDeltaSummary}
        />

        <div
          className={`px-2.5 py-1 rounded-lg border font-mono text-[9.5px] font-bold flex items-center justify-between gap-1.5 ${
            phaseCReached
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-700 dark:text-rose-300'
              : 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-200'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {phaseCReached ? (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="truncate">
                  {chapter.toNodeLabel}: {stageCSub.shapeChoreography.shapes[1]?.afterStateLabel || 'STATE MUTATED'}
                </span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">
                  {chapter.toNodeLabel}: Processing Request...
                </span>
              </>
            )}
          </div>
          <span className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-zinc-900 text-[8.5px] font-extrabold shrink-0">
            PHASE {sub.id}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * BLUEPRINT 2: SPLIT STRUCT & CONTAINER MUTATION SCENE (A -> B -> C -> D)
 * Inspired directly by Process Hollowing Stage 2 (Stage2MemoryUnmapScene):
 * - Left 5 Cols: (A) Structure / Parameter Inspector Table, (B) Target Subsystem Node, (C/D) Execution Primitive Card
 * - Right 7 Cols: Target Container (Memory / VSS Storage / Kernel Callbacks / AMSI / Vault) with 4 rows that eject/transform on C/D
 */
function SplitStructAndContainerMutationScene({
  visualState,
  onSelectSubStep,
}: {
  visualState: UniversalScrollyVisualState;
  onSelectSubStep: (id: string) => void;
}) {
  const { activeChapter: rawChapter, activeSubStep: sub, subStepIndex } =
    visualState;
  const chapter = getChapterMeta(rawChapter);
  const stageNum = rawChapter.stageNumber;
  const phaseBReached = subStepIndex >= 1;
  const phaseCReached = subStepIndex >= 2;
  const phaseDReached = subStepIndex >= 3;

  const stageCSub =
    rawChapter.subSteps.find((s) => s.subStepLetter === 'C') || sub;
  const cues = stageCSub.shapeChoreography.motions;
  const shapes = stageCSub.shapeChoreography.shapes;

  return (
    <div
      data-testid="universal-split-struct-mutation-scene"
      className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-stretch"
    >
      {/* Left 5 Columns: Struct Inspector (A) + Target Subsystem (B) + Mutation Syscall/Command (C/D) */}
      <div className="sm:col-span-5 flex flex-col justify-between gap-2">
        {/* A: Structure / Parameter Inspector Card */}
        <motion.div
          onClick={() => onSelectSubStep(`${stageNum}A`)}
          className="rounded-xl bg-white dark:bg-zinc-900 border-2 border-indigo-400 dark:border-indigo-700 p-2.5 space-y-1.5 cursor-pointer"
        >
          <div className="flex items-center justify-between font-mono text-[9.5px] gap-1">
            <span className="font-extrabold text-indigo-700 dark:text-indigo-300 truncate">
              {stageNum}A · {chapter.fromNodeLabel}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[8px] font-bold shrink-0">
              {chapter.protocolBadge}
            </span>
          </div>

          <div className="space-y-1 font-mono text-[9px]">
            <div className="px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-950 text-zinc-500 flex justify-between gap-1">
              <span>Source</span>
              <span className="truncate font-semibold text-zinc-700 dark:text-zinc-300">
                {chapter.fromNodeSublabel}
              </span>
            </div>
            <div className="px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-950 text-zinc-500 flex justify-between gap-1">
              <span>Vector</span>
              <span className="truncate font-semibold text-zinc-700 dark:text-zinc-300">
                {cues[0]?.extractedTextToken}
              </span>
            </div>
            <motion.div
              key={`struct-target-${sub.id}`}
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="px-1.5 py-1 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200 font-extrabold flex justify-between gap-1"
            >
              <span>Target</span>
              <span className="truncate">{cues[1]?.extractedTextToken}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* B: Target Subsystem / Boundary Node */}
        <motion.div
          onClick={() => onSelectSubStep(`${stageNum}B`)}
          animate={{ opacity: phaseBReached ? 1 : 0.6 }}
          className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 font-mono text-[9px] space-y-1 cursor-pointer"
        >
          <div className="font-extrabold text-zinc-800 dark:text-zinc-200">
            {stageNum}B · {shapes[1]?.title || chapter.toNodeLabel}
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-zinc-500">State:</span>
            <span
              className={`font-bold truncate ${
                phaseCReached
                  ? 'text-rose-600 line-through'
                  : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              {shapes[1]?.beforeStateLabel || 'Protected Baseline'}
            </span>
          </div>
        </motion.div>

        {/* C/D: Active Mutation Command / Syscall Card */}
        <motion.div
          onClick={() => onSelectSubStep(`${stageNum}C`)}
          animate={{
            opacity: phaseCReached || phaseDReached ? 1 : 0.55,
            scale: phaseCReached || phaseDReached ? 1.015 : 0.98,
          }}
          className={`rounded-xl border-2 p-2.5 space-y-1 font-mono cursor-pointer ${
            phaseDReached
              ? 'bg-emerald-50/90 dark:bg-emerald-950/35 border-emerald-500'
              : phaseCReached
                ? 'bg-rose-50/90 dark:bg-rose-950/35 border-rose-500'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <div className="text-[9.5px] font-extrabold text-rose-700 dark:text-rose-300">
            {stageNum}C/{stageNum}D · {stageCSub.shapeChoreography.mechanismBadge}
          </div>
          <div className="text-[9px] font-bold text-zinc-900 dark:text-white truncate">
            {cues[1]?.vectorLabel}
          </div>
          <div className="text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400 truncate">
            {phaseDReached
              ? `✓ Sensor Alert: ${chapter.protocolBadge}`
              : phaseCReached
                ? `⚡ ${shapes[1]?.afterStateLabel || 'Mutating State...'}`
                : 'Awaiting Phase C Execution...'}
          </div>
        </motion.div>
      </div>

      {/* Right 7 Columns: Target Container with Animated 4-Row Ejection / Transformation */}
      <div className="sm:col-span-7 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-3 flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1.5 font-mono gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 rounded bg-sky-50 dark:bg-zinc-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType={chapter.toNodeIcon}
                isActive={phaseBReached}
                isCompromised={phaseCReached}
              />
            </div>
            <span className="text-[11px] font-extrabold text-zinc-900 dark:text-white truncate">
              {chapter.toNodeLabel} ({chapter.toNodeSublabel})
            </span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[8.5px] font-bold shrink-0">
            {chapter.mitreCode.split('·')[0]?.trim()}
          </span>
        </div>

        {/* Dynamic Container Box with 4 Internal Slots that Eject/Mutate on Phase C/D */}
        <motion.div
          className={`p-2.5 rounded-xl border-2 border-dashed space-y-1.5 min-h-[160px] flex flex-col justify-center overflow-hidden transition-colors ${
            phaseDReached
              ? 'bg-emerald-50/75 dark:bg-emerald-950/30 border-emerald-500'
              : phaseCReached
                ? 'bg-rose-50/75 dark:bg-rose-950/30 border-rose-500'
                : 'bg-sky-50/75 dark:bg-sky-950/30 border-sky-500'
          }`}
        >
          {!phaseDReached ? (
            <>
              <div className="flex items-center justify-between font-mono text-[9.5px]">
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300 truncate">
                  {shapes[1]?.title || chapter.toNodeLabel}
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0">
                  {phaseCReached ? '⚡ MUTATING...' : '✓ BASELINE'}
                </span>
              </div>
              <div className="space-y-1 font-mono text-[9px]">
                {[
                  {
                    slot: '#1',
                    label: cues[0]?.extractedTextToken || chapter.forwardFlowBadge,
                    delay: 0,
                  },
                  {
                    slot: '#2',
                    label: cues[1]?.extractedTextToken || chapter.protocolBadge,
                    delay: 0.05,
                  },
                  {
                    slot: '#3',
                    label: cues[2]?.extractedTextToken || chapter.returnFlowBadge,
                    delay: 0.1,
                  },
                  {
                    slot: '#4',
                    label: `${shapes[1]?.beforeStateLabel || 'State'} ➔ ${shapes[1]?.afterStateLabel || 'Mutated'}`,
                    delay: 0.15,
                  },
                ].map((row) => (
                  <motion.div
                    key={row.slot}
                    animate={{
                      x: phaseCReached ? 24 : 0,
                      opacity: phaseCReached ? 0.45 : 1,
                      scale: phaseCReached ? 0.96 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 20,
                      delay: row.delay,
                    }}
                    className="p-1.5 rounded bg-white dark:bg-zinc-900 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 font-semibold flex items-center justify-between gap-2"
                  >
                    <span className="truncate">{row.label}</span>
                    <span className="text-[8px] text-zinc-400 shrink-0">
                      {row.slot}
                    </span>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="text-center space-y-1.5 py-2 font-mono"
            >
              <div className="text-xs font-extrabold text-rose-700 dark:text-rose-300">
                {shapes[1]?.afterStateLabel || 'STATE COMPROMISED'} · {chapter.protocolBadge}
              </div>
              <div className="text-[9.5px] text-zinc-700 dark:text-zinc-300 px-2">
                {sub.stateDeltaSummary}
              </div>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold">
                SIEM / Sensor Catch Locked ({stageNum}D)
              </span>
            </motion.div>
          )}
        </motion.div>

        <MechanismMicroVisual
          motionKind={shapes[1]?.internalMotionKind || 'HEX_STREAM'}
          isActive={phaseCReached}
          liveMetric={sub.stateDeltaSummary}
        />
      </div>
    </div>
  );
}

/**
 * BLUEPRINT 3: CROSS-NODE STREAM & PAYLOAD REACTOR SCENE (A -> B -> C -> D)
 * Inspired directly by Process Hollowing Stage 3 (Stage3AllocationInjectionScene):
 * - Left 5 Cols: Source Actor + Animated Dual-Dot Byte/Chunk Pipe + (D) Forensic Anomaly Comparison Card
 * - Right 7 Cols: Target Receiver with Flag Pills, Call Banner, Animated Progress Bar (15% -> 45% -> 100%), Dark Console Box, and 3-Chunk Grid
 */
function CrossNodeStreamAndPayloadReactorScene({
  visualState,
  onSelectSubStep,
}: {
  visualState: UniversalScrollyVisualState;
  onSelectSubStep: (id: string) => void;
}) {
  const { activeChapter: rawChapter, activeSubStep: sub, subStepIndex } =
    visualState;
  const chapter = getChapterMeta(rawChapter);
  const stageNum = rawChapter.stageNumber;
  const phaseBReached = subStepIndex >= 1;
  const phaseCReached = subStepIndex >= 2;
  const phaseDReached = subStepIndex >= 3;

  const progressPct = phaseCReached ? 100 : phaseBReached ? 45 : 15;
  const stageCSub =
    rawChapter.subSteps.find((s) => s.subStepLetter === 'C') || sub;
  const cues = stageCSub.shapeChoreography.motions;

  return (
    <div
      data-testid="universal-cross-node-stream-scene"
      className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-stretch"
    >
      {/* Left 5 Columns: Source Emitter + Animated Byte/Chunk Pipe + Forensic Anomaly Card */}
      <div className="sm:col-span-5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-rose-400 dark:border-rose-500/80 p-2.5 flex flex-col justify-between space-y-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-7 rounded-lg bg-rose-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-800 flex items-center justify-center p-0.5 shrink-0">
            <SketchNodeIcon
              iconType={chapter.fromNodeIcon}
              isActive={subStepIndex === 0}
              isCompromised={true}
            />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[8.5px] font-bold uppercase text-rose-600 dark:text-rose-400">
              SOURCE ACTOR
            </div>
            <div className="font-mono text-xs font-extrabold text-zinc-900 dark:text-white truncate">
              {chapter.fromNodeLabel}
            </div>
          </div>
        </div>

        {/* Animated Cross-Node Stream Pipe */}
        <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-[9px] space-y-1">
          <div className="flex justify-between gap-1">
            <span className="text-zinc-500">Channel:</span>
            <span className="font-bold text-zinc-900 dark:text-white truncate">
              {chapter.protocolBadge}
            </span>
          </div>
          <svg viewBox="0 0 180 20" className="w-full h-4 overflow-visible">
            <line
              x1="6"
              y1="10"
              x2="174"
              y2="10"
              stroke="#e11d48"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <motion.circle
              key={`stream-dot1-${sub.id}`}
              r="4"
              cy="10"
              fill="#e11d48"
              animate={{ cx: [12, 166] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            />
            {phaseBReached && (
              <motion.circle
                key={`stream-dot2-${sub.id}`}
                r="4"
                cy="10"
                fill="#f59e0b"
                animate={{ cx: [12, 140] }}
                transition={{
                  duration: 1.2,
                  delay: 0.25,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            )}
          </svg>
          <div className="text-[8.5px] font-bold text-rose-600 dark:text-rose-400 text-center truncate">
            {phaseCReached
              ? `100% Streamed (${cues[1]?.extractedTextToken})`
              : phaseBReached
                ? `Streaming ${chapter.forwardFlowBadge} (45%)`
                : `${stageNum}A · Channel Initialized (15%)`}
          </div>
        </div>

        {/* D: Forensic Anomaly Comparison Card */}
        <motion.div
          onClick={() => onSelectSubStep(`${stageNum}D`)}
          animate={{ scale: phaseDReached ? 1.02 : 0.98 }}
          className={`p-2 rounded-xl border font-mono text-[9px] space-y-1 cursor-pointer ${
            phaseDReached
              ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
              : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-zinc-800 dark:text-zinc-200'
          }`}
        >
          <div className="font-extrabold flex items-center justify-between">
            <span>{stageNum}D · Telemetry Catch</span>
            <span>{chapter.protocolBadge}</span>
          </div>
          <div className="text-[8.5px] leading-snug truncate">
            Vector: <strong>{cues[0]?.extractedTextToken}</strong>
            <br />
            Caught: <strong>{cues[2]?.extractedTextToken}</strong>
          </div>
        </motion.div>
      </div>

      {/* Right 7 Columns: Target Payload / Stream Receiver Inspector */}
      <div className="sm:col-span-7 rounded-xl bg-white dark:bg-zinc-900 border-2 border-sky-400 dark:border-sky-500/80 p-2.5 flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between gap-2 font-mono">
          <div className="min-w-0">
            <div className="text-[8.5px] font-bold uppercase text-sky-600 dark:text-sky-400 truncate">
              TARGET RECEIVER · {chapter.toNodeSublabel}
            </div>
            <div className="text-xs font-extrabold text-zinc-900 dark:text-white truncate">
              {chapter.toNodeLabel}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {['A', 'B', 'C', 'D'].map((letter, idx) => (
              <button
                key={letter}
                type="button"
                onClick={() => onSelectSubStep(`${stageNum}${letter}`)}
                className={`px-1.5 py-0.5 rounded font-mono text-[8.5px] font-extrabold cursor-pointer ${
                  subStepIndex >= idx
                    ? 'bg-rose-600 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 font-mono text-[9px] font-extrabold text-indigo-900 dark:text-indigo-200 text-center truncate">
          {phaseCReached
            ? `${cues[1]?.vectorLabel} ──▶ ${cues[2]?.extractedTextToken}`
            : `${cues[0]?.vectorLabel} (${chapter.forwardFlowBadge})`}
        </div>

        {/* Live Stream Progress & Console Readout */}
        <div
          className={`p-2 rounded-xl border-2 space-y-1.5 font-mono ${
            phaseCReached
              ? 'bg-rose-50/75 dark:bg-rose-950/30 border-rose-500'
              : 'bg-amber-50/75 dark:bg-amber-950/30 border-amber-500'
          }`}
        >
          <div className="flex justify-between text-[9.5px] font-bold">
            <span className="truncate">{stageCSub.shapeChoreography.mechanismBadge}</span>
            <span className="shrink-0">{progressPct}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="h-full bg-gradient-to-r from-rose-600 to-amber-500"
            />
          </div>

          <motion.div
            animate={{ opacity: phaseBReached ? 1 : 0.6 }}
            className="p-1.5 rounded bg-zinc-900 text-emerald-400 text-[8.5px] leading-tight truncate"
          >
            <div>&gt; {sub.stateDeltaSummary}</div>
          </motion.div>

          {/* 3-Slot Artifact / Chunk Grid */}
          <div className="grid grid-cols-3 gap-1 text-[8px]">
            {cues.map((cue, idx) => {
              const ready = subStepIndex >= idx;
              return (
                <motion.button
                  key={cue.motionCode}
                  type="button"
                  onClick={() =>
                    onSelectSubStep(
                      `${stageNum}${(['A', 'B', 'C'] as const)[idx] || 'C'}`
                    )
                  }
                  animate={{
                    scale: ready ? 1 : 0.95,
                    opacity: ready ? 1 : 0.45,
                  }}
                  className={`p-1 rounded border text-center font-bold truncate cursor-pointer ${
                    ready
                      ? 'bg-white dark:bg-zinc-900 border-rose-400 text-rose-700 dark:text-rose-300'
                      : 'bg-zinc-100 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="truncate">{cue.extractedTextToken}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * BLUEPRINT 4: SLIDING POINTER & STATE CONTROLLER SCENE (A -> B -> C -> D)
 * Inspired directly by Process Hollowing Stage 4 (Stage4ThreadHijackScene):
 * - Left 6 Cols: Target Space with a Sliding Pointer Badge that physically moves from Top Box (Baseline/Locked) to Bottom Box (Hijacked/Elevated/Cracked) on B/C + (D) Sensor Alert
 * - Right 6 Cols: State Controller Metrics (STANDBY -> EXECUTING) + 3-Row Technical State Table + Micro-Mechanism Visual
 */
function SlidingPointerAndStateControllerScene({
  visualState,
  onSelectSubStep,
}: {
  visualState: UniversalScrollyVisualState;
  onSelectSubStep: (id: string) => void;
}) {
  const { activeChapter: rawChapter, activeSubStep: sub, subStepIndex } =
    visualState;
  const chapter = getChapterMeta(rawChapter);
  const stageNum = rawChapter.stageNumber;
  const isHijacked = subStepIndex >= 1;
  const isExecuting = subStepIndex >= 2;
  const isSensorAlert = subStepIndex >= 3;

  const stageCSub =
    rawChapter.subSteps.find((s) => s.subStepLetter === 'C') || sub;
  const shapes = stageCSub.shapeChoreography.shapes;
  const cues = stageCSub.shapeChoreography.motions;

  return (
    <div
      data-testid="universal-sliding-pointer-scene"
      className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-stretch"
    >
      {/* Left 6 Columns: Target Space with Sliding Pointer */}
      <div className="sm:col-span-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-3 flex flex-col justify-between space-y-2 relative">
        <div className="font-mono text-[9.5px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-zinc-200 dark:border-zinc-800 pb-1 truncate">
          {chapter.toNodeLabel} · STATE PIVOT
        </div>

        <div className="relative pl-20 space-y-2.5 my-auto py-1">
          {/* Sliding Pointer Badge */}
          <motion.div
            animate={{
              top: isHijacked ? '56%' : '12%',
              scale: isExecuting ? 1.04 : 1,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className={`absolute left-0 px-2 py-1 rounded-lg border-2 font-mono text-[9px] font-extrabold flex items-center gap-1 shadow-xs z-10 ${
              isHijacked
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-700'
            }`}
          >
            <span>PHASE {sub.id}</span>
            <ArrowRight className="w-3 h-3" />
          </motion.div>

          {/* Top Box: Pre-Pivot / Locked Baseline State (A) */}
          <div
            onClick={() => onSelectSubStep(`${stageNum}A`)}
            className={`p-2 rounded-xl border-2 border-dashed font-mono transition-opacity cursor-pointer ${
              isHijacked
                ? 'bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 opacity-55'
                : 'bg-sky-50/80 dark:bg-sky-950/30 border-sky-500 opacity-100'
            }`}
          >
            <div className="text-[9.5px] font-extrabold text-zinc-800 dark:text-zinc-200 truncate">
              [ {shapes[1]?.beforeStateLabel || 'INITIAL STATE'} ]
            </div>
            <div className="text-[9px] font-bold text-amber-700 dark:text-amber-300 truncate">
              {chapter.fromNodeLabel} ({cues[0]?.extractedTextToken})
            </div>
          </div>

          {/* Bottom Box: Pivoted / Elevated / Cracked State (B & C) */}
          <motion.div
            onClick={() => onSelectSubStep(`${stageNum}C`)}
            animate={{ scale: isHijacked ? 1.02 : 0.98 }}
            className={`p-2 rounded-xl border-2 font-mono space-y-0.5 cursor-pointer ${
              isHijacked
                ? 'bg-rose-50/90 dark:bg-rose-950/35 border-rose-500 shadow-xs'
                : 'bg-white dark:bg-zinc-950 border-rose-300 dark:border-rose-800/70'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9.5px] font-extrabold text-rose-700 dark:text-rose-300 truncate">
                {shapes[1]?.afterStateLabel || 'COMPROMISED STATE'}
              </span>
              {isExecuting && (
                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[7.5px] font-bold shrink-0">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="text-[9.5px] font-extrabold text-zinc-900 dark:text-white truncate">
              {cues[1]?.extractedTextToken}
            </div>
          </motion.div>
        </div>

        {/* D: Sensor Alert Banner */}
        <motion.div
          onClick={() => onSelectSubStep(`${stageNum}D`)}
          animate={{
            opacity: isSensorAlert ? 1 : 0.55,
            scale: isSensorAlert ? 1.015 : 0.985,
          }}
          className={`p-2 rounded-lg border font-mono text-[8.5px] font-bold flex items-center justify-between gap-1 cursor-pointer ${
            isSensorAlert
              ? 'bg-rose-600 text-white border-rose-700'
              : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'
          }`}
        >
          <span>{stageNum}D · SENSOR CATCH</span>
          <span className="truncate">{chapter.protocolBadge}</span>
        </motion.div>
      </div>

      {/* Right 6 Columns: Live State Controller & Mechanism Visual */}
      <div className="sm:col-span-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-3 flex flex-col justify-between space-y-2">
        <div className="font-mono text-[9.5px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-zinc-200 dark:border-zinc-800 pb-1 truncate">
          CONTROLLER · {chapter.mitreCode.split('·')[0]?.trim()}
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <div className="text-[8px] text-zinc-500 uppercase font-bold">
              STAGE PHASE
            </div>
            <div
              className={`text-xs font-extrabold mt-0.5 ${
                isExecuting
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {sub.id} ({sub.clauseNumber})
            </div>
          </div>

          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <div className="text-[8px] text-zinc-500 uppercase font-bold">
              EXECUTION
            </div>
            <div
              className={`text-[10.5px] font-extrabold mt-0.5 flex items-center gap-1 ${
                isExecuting
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              {isExecuting ? (
                <>
                  <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>ACTIVE</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>STAGING</span>
                </>
              )}
            </div>
          </div>
        </div>

        <MechanismMicroVisual
          motionKind={shapes[1]?.internalMotionKind || 'ROTOR_CRACK'}
          isActive={isExecuting}
          liveMetric={sub.stateDeltaSummary}
        />

        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 font-mono text-[9px]">
          <div
            className={`p-1.5 rounded-lg border flex items-center justify-between gap-1 font-extrabold ${
              isHijacked
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100'
                : 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-sky-900 dark:text-sky-100'
            }`}
          >
            <span>Active Token:</span>
            <span className="truncate">{cues[1]?.extractedTextToken}</span>
          </div>
          <div className="px-1.5 py-0.5 flex justify-between gap-1 text-zinc-500">
            <span>Target Asset:</span>
            <span className="truncate">{chapter.toNodeLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * BLUEPRINT 5: THREE-NODE PIPELINE & TELEMETRY SPECTRUM SCENE (A -> B -> C -> D)
 * Inspired directly by Process Hollowing Stage 5 (Stage5C2BeaconFftScene):
 * - Top 3-Node Pipeline: Initiator Node -> Mechanism / Relay Gate -> Target / Sensor Node
 * - Middle Profile Bar (B): Protocol & Artifact Fingerprint
 * - Bottom 12-Col Dual Chart (C & D): Left 7 Cols Time-Domain Cadence Waveform + Right 5 Cols SIEM Rule Correlation Peak
 */
function ThreeNodePipelineAndSpectrumScene({
  visualState,
  onSelectSubStep,
}: {
  visualState: UniversalScrollyVisualState;
  onSelectSubStep: (id: string) => void;
}) {
  const { activeChapter: rawChapter, activeSubStep: sub, subStepIndex } =
    visualState;
  const chapter = getChapterMeta(rawChapter);
  const stageNum = rawChapter.stageNumber;
  const phaseBReached = subStepIndex >= 1;
  const phaseCReached = subStepIndex >= 2;
  const phaseDReached = subStepIndex >= 3;

  const stageCSub =
    rawChapter.subSteps.find((s) => s.subStepLetter === 'C') || sub;
  const cues = stageCSub.shapeChoreography.motions;

  return (
    <div data-testid="universal-three-node-spectrum-scene" className="space-y-2.5">
      {/* Top 3-Node Pipeline */}
      <div className="grid grid-cols-3 gap-1.5 items-stretch">
        <div
          onClick={() => onSelectSubStep(`${stageNum}A`)}
          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border-2 border-sky-400 dark:border-sky-500/80 font-mono space-y-1 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-sky-50 dark:bg-zinc-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType={chapter.fromNodeIcon}
                isActive={subStepIndex === 0}
                isCompromised={true}
              />
            </div>
            <div className="text-[9px] font-extrabold text-zinc-900 dark:text-white truncate">
              {chapter.fromNodeLabel}
            </div>
          </div>
          <div className="text-[8px] font-bold text-sky-700 dark:text-sky-300 truncate">
            {chapter.fromNodeSublabel}
          </div>
        </div>

        <div
          onClick={() => onSelectSubStep(`${stageNum}B`)}
          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border-2 border-emerald-500/80 font-mono space-y-1 cursor-pointer"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-[8.5px] font-extrabold text-zinc-900 dark:text-white truncate">
              {chapter.protocolBadge}
            </span>
          </div>
          <div className="px-1 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-[8px] font-extrabold text-emerald-800 dark:text-emerald-300 text-center truncate">
            {chapter.forwardFlowBadge} ──▶
          </div>
        </div>

        <div
          onClick={() => onSelectSubStep(`${stageNum}C`)}
          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border-2 border-rose-500/80 font-mono space-y-1 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-rose-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType={chapter.toNodeIcon}
                isActive={phaseCReached}
                isCompromised={true}
              />
            </div>
            <div className="text-[9px] font-extrabold text-rose-700 dark:text-rose-300 truncate">
              {chapter.toNodeLabel}
            </div>
          </div>
          <div className="text-[8px] font-bold text-zinc-900 dark:text-white truncate">
            {chapter.toNodeSublabel}
          </div>
        </div>
      </div>

      {/* B: Protocol Profile & Artifact Bar */}
      <motion.div
        animate={{ opacity: phaseBReached ? 1 : 0.7 }}
        className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 font-mono text-[9px] flex flex-wrap items-center justify-between gap-1.5"
      >
        <div className="truncate">
          <span className="font-extrabold text-indigo-700 dark:text-indigo-300">
            {stageNum}B · Profile:{' '}
          </span>
          <span className="text-zinc-800 dark:text-zinc-200 font-bold">
            {cues[0]?.vectorLabel}
          </span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold shrink-0">
          {cues[1]?.extractedTextToken}
        </span>
      </motion.div>

      {/* C & D: Dual Time-Domain Stream + SIEM Rule Correlation Spectrum */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-2.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="font-mono text-[9.5px] font-extrabold text-zinc-900 dark:text-white truncate">
            {phaseDReached
              ? `${stageNum}D · SIEM CORRELATION LOCK (${chapter.protocolBadge})`
              : `${stageNum}C · LIVE TELEMETRY CADENCE`}
          </span>
          <span
            className={`px-2 py-0.5 rounded font-mono text-[8.5px] font-extrabold shrink-0 ${
              phaseCReached
                ? 'bg-rose-600 text-white'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
            }`}
          >
            {phaseDReached ? 'SIEM ALERT FIRED' : 'STREAM ACTIVE'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-stretch">
          <div className="sm:col-span-7 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <div className="font-mono text-[8px] font-bold text-zinc-500 mb-1 truncate">
              EVENT STREAM · {chapter.forwardFlowBadge} ⇄ {chapter.returnFlowBadge}
            </div>
            <svg viewBox="0 0 360 72" className="w-full h-14 overflow-visible">
              <line
                x1="12"
                y1="54"
                x2="348"
                y2="54"
                stroke="currentColor"
                className="text-zinc-300 dark:text-zinc-800"
                strokeWidth="1.5"
              />
              <motion.path
                d="M 12 54 L 42 54 L 52 12 L 62 54 L 122 54 L 132 12 L 142 54 L 202 54 L 212 12 L 222 54 L 282 54 L 292 12 L 302 54 L 348 54"
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.2"
                animate={{ pathLength: phaseCReached ? 1 : 0.45 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
              {[
                { x: 52, t: `${stageNum}A` },
                { x: 132, t: `${stageNum}B` },
                { x: 212, t: `${stageNum}C` },
                { x: 292, t: `${stageNum}D` },
              ].map((pt) => (
                <g key={pt.t}>
                  <circle cx={pt.x} cy="12" r="3.5" fill="#e11d48" />
                  <text
                    x={pt.x}
                    y="67"
                    textAnchor="middle"
                    className="fill-zinc-600 dark:fill-zinc-400 font-mono text-[8px] font-bold"
                  >
                    {pt.t}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div
            onClick={() => onSelectSubStep(`${stageNum}D`)}
            className={`sm:col-span-5 p-2 rounded-lg border font-mono cursor-pointer ${
              phaseDReached
                ? 'bg-rose-50/80 dark:bg-rose-950/35 border-rose-500'
                : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="text-[8px] font-bold text-rose-700 dark:text-rose-300 mb-1 truncate">
              SIEM RULE · {chapter.mitreCode.split('·')[0]?.trim()}
            </div>
            <svg viewBox="0 0 220 72" className="w-full h-14 overflow-visible">
              <line
                x1="10"
                y1="54"
                x2="210"
                y2="54"
                stroke="currentColor"
                className="text-zinc-300 dark:text-zinc-800"
                strokeWidth="1.5"
              />
              <motion.path
                d="M 10 52 Q 40 50, 70 51 T 98 50 L 110 10 L 122 50 Q 160 51, 210 52"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.2"
                animate={{ scaleY: phaseDReached ? 1 : 0.45 }}
                style={{ transformOrigin: '110px 54px' }}
                transition={{ type: 'spring', stiffness: 240, damping: 18 }}
              />
              <circle cx="110" cy="10" r="4" fill="#e11d48" />
              <text
                x="110"
                y="67"
                textAnchor="middle"
                className="fill-rose-600 dark:fill-rose-400 font-mono text-[8px] font-extrabold"
              >
                {chapter.protocolBadge}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Universal Architectural Stage Director (Process-Hollowing-Inspired Multi-Scene Engine).
 * Renders a distinct, compact, non-overlapping architectural scene for each stage (Stage 0..Stage N)
 * that progressively animates as the user scrolls through phases A -> B -> C -> D.
 */
export function NotebookLmInteractiveShapeCanvas({
  visualState,
  focusedMotionIndex,
  onSelectSubStep,
}: NotebookLmInteractiveShapeCanvasProps) {
  const { activeSubStep: sub } = visualState;
  const { shapeChoreography: ch } = sub;
  const activeMotion = ch.motions[focusedMotionIndex] || ch.motions[0];
  const blueprint = selectStageArchitecturalBlueprint(visualState);

  return (
    <div
      data-testid="notebooklm-interactive-shape-canvas"
      data-mechanism-kind={ch.mechanismKind}
      data-scene-blueprint={blueprint}
      data-focused-motion={activeMotion.motionCode}
      className="space-y-2"
    >
      {blueprint === 'STAGE0_BRIEFING_ARCHITECTURE' && (
        <UniversalStage0BriefingScene
          visualState={visualState}
          onSelectSubStep={onSelectSubStep}
        />
      )}
      {blueprint === 'BRIDGE_HANDSHAKE_AND_RETURN_LOOPS' && (
        <BridgeHandshakeAndReturnLoopsScene
          visualState={visualState}
          onSelectSubStep={onSelectSubStep}
        />
      )}
      {blueprint === 'SPLIT_STRUCT_AND_CONTAINER_MUTATION' && (
        <SplitStructAndContainerMutationScene
          visualState={visualState}
          onSelectSubStep={onSelectSubStep}
        />
      )}
      {blueprint === 'CROSS_NODE_STREAM_AND_PAYLOAD_REACTOR' && (
        <CrossNodeStreamAndPayloadReactorScene
          visualState={visualState}
          onSelectSubStep={onSelectSubStep}
        />
      )}
      {blueprint === 'SLIDING_POINTER_AND_STATE_CONTROLLER' && (
        <SlidingPointerAndStateControllerScene
          visualState={visualState}
          onSelectSubStep={onSelectSubStep}
        />
      )}
      {blueprint === 'THREE_NODE_PIPELINE_AND_SPECTRUM' && (
        <ThreeNodePipelineAndSpectrumScene
          visualState={visualState}
          onSelectSubStep={onSelectSubStep}
        />
      )}
    </div>
  );
}

/**
 * Reusable Inline Interactive Shape-to-Shape Sequence Conduit.
 */
export function InlineInteractiveSequenceConduit({
  stepNumber,
  fromNodeLabel,
  fromNodeSublabel,
  fromNodeIcon,
  toNodeLabel,
  toNodeSublabel,
  toNodeIcon,
  forwardBadge,
  forwardSummary,
  returnBadge,
  returnSummary,
  protocolBadge,
  isActive = true,
}: {
  stepNumber: number | string;
  fromNodeLabel: string;
  fromNodeSublabel: string;
  fromNodeIcon: SketchIconType;
  toNodeLabel: string;
  toNodeSublabel: string;
  toNodeIcon: SketchIconType;
  forwardBadge: string;
  forwardSummary: string;
  returnBadge: string;
  returnSummary: string;
  protocolBadge: string;
  isActive?: boolean;
}) {
  return (
    <div
      data-testid={`inline-interactive-conduit-${stepNumber}`}
      className="p-3 rounded-xl bg-zinc-50/95 dark:bg-zinc-950/85 border border-indigo-200/90 dark:border-indigo-800/70 space-y-2.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>
            Interactive Sequence Exchange — Initiator ⇄ Receiver
          </span>
        </span>
        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[9px]">
          {protocolBadge}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        <div className="lg:col-span-3 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-rose-400/80 dark:border-rose-700/80 flex flex-col justify-between space-y-1.5">
          <div className="flex items-start gap-2">
            <div className="w-10 h-9 rounded-lg bg-rose-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-800 flex items-center justify-center p-1 shrink-0">
              <SketchNodeIcon
                iconType={fromNodeIcon}
                isActive={isActive}
                isCompromised={true}
              />
            </div>
            <div className="min-w-0 flex-1 font-mono">
              <div className="text-[8.5px] font-extrabold uppercase text-rose-600 dark:text-rose-400">
                INITIATOR
              </div>
              <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-snug break-words">
                {fromNodeLabel}
              </div>
              <div className="text-[9.5px] text-zinc-500 leading-snug break-words">
                {fromNodeSublabel}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-center space-y-2 font-mono">
          <div className="p-2 rounded-lg bg-rose-50/80 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800/70 space-y-1">
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="font-extrabold text-rose-700 dark:text-rose-300">
                {forwardBadge}
              </span>
              <span className="text-[9px] text-rose-600 dark:text-rose-400 font-bold">
                {fromNodeLabel} ──▶ {toNodeLabel}
              </span>
            </div>
            <svg viewBox="0 0 360 18" className="w-full h-4 overflow-visible">
              <line
                x1="8"
                y1="9"
                x2="348"
                y2="9"
                stroke="#e11d48"
                strokeWidth="2.2"
              />
              <polygon points="352,9 343,4 343,14" fill="#e11d48" />
              <motion.circle
                r="4.5"
                cy="9"
                fill="#e11d48"
                stroke="#ffffff"
                strokeWidth="1.5"
                animate={{ cx: [14, 342] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </svg>
            <p className="text-[10.5px] font-sans text-zinc-700 dark:text-zinc-300 leading-snug break-words">
              {forwardSummary}
            </p>
          </div>

          <div className="p-2 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/70 space-y-1">
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                {returnBadge}
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                {fromNodeLabel} ◀── {toNodeLabel}
              </span>
            </div>
            <svg viewBox="0 0 360 18" className="w-full h-4 overflow-visible">
              <line
                x1="348"
                y1="9"
                x2="12"
                y2="9"
                stroke="#059669"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <polygon points="8,9 17,4 17,14" fill="#059669" />
              <motion.circle
                r="4.5"
                cy="9"
                fill="#059669"
                stroke="#ffffff"
                strokeWidth="1.5"
                animate={{ cx: [342, 14] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </svg>
            <p className="text-[10.5px] font-sans text-zinc-700 dark:text-zinc-300 leading-snug break-words">
              {returnSummary}
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-indigo-400/80 dark:border-indigo-700/80 flex flex-col justify-between space-y-1.5">
          <div className="flex items-start gap-2">
            <div className="w-10 h-9 rounded-lg bg-indigo-50 dark:bg-zinc-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center p-1 shrink-0">
              <SketchNodeIcon
                iconType={toNodeIcon}
                isActive={isActive}
                isCompromised={true}
              />
            </div>
            <div className="min-w-0 flex-1 font-mono">
              <div className="text-[8.5px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                RECEIVER
              </div>
              <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-snug break-words">
                {toNodeLabel}
              </div>
              <div className="text-[9.5px] text-zinc-500 leading-snug break-words">
                {toNodeSublabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
