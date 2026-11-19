import { AttackScenario, AttackStage } from './scenarios/types';
import {
  buildDiagramStepGuideModel,
  DiagramAlignedBriefingModel,
  DiagramAlignedStepGuideItem,
  parseStructuredExplanationClauses,
} from './scenario-step-guides';
import {
  resolveStructuralArchetype,
  StructuralDiagramArchetype,
} from './documentation-structural-diagrams';
import {
  ALL_PROCESS_HOLLOWING_SUBSTEPS,
  clampUnitProgress,
  computeProcessHollowingVisualState,
  PROCESS_HOLLOWING_SCENARIO_ID,
  PROCESS_HOLLOWING_SCROLL_CHAPTERS,
  ProcessHollowingStageVisualState,
} from './process-hollowing-scrollytelling';
import { SketchIconType } from './sketch-zones-and-drilldown';

export type UniversalSubStepLetter = 'A' | 'B' | 'C' | 'D';

export type UniversalExplanationLayerKind =
  | 'ANALOGY_NARRATIVE' // Phase A: Real-World Story Analogy / Plain English Mental Model
  | 'CONCEPT_BRIDGE' // Phase B: Story-to-Scenario Technical Bridge & Sequence Flow
  | 'TECHNICAL_DEEP_DIVE' // Phase C: Deep Technical Mechanism, Syscalls, Hex/Memory/Packets
  | 'FORENSIC_DETECTION'; // Phase D: SIEM / Sysmon / EDR Detection & Mitigation Catch

export type UniversalVisualChoreographyKind =
  | 'PROCESS_HOLLOWING_NATIVE'
  | 'ANALOGY_MENTAL_MODEL_SCHEMATIC'
  | 'SEQUENCE_BIDIRECTIONAL_CONDUIT'
  | 'MEMORY_VAD_HEX_MUTATION'
  | 'IDENTITY_TICKET_CRYPTO_FORGE'
  | 'PROTOCOL_PACKET_FRAME_SINK'
  | 'CICD_ARTIFACT_POISON_PIPELINE'
  | 'KERNEL_RING0_PRIVILEGE_BRIDGE'
  | 'RANSOMWARE_VSS_ENCRYPTION_IO'
  | 'SIEM_DETECTION_CORRELATION_RADAR';

/**
 * Specific interactive shape mechanism resolved from the exact text, command,
 * protocol, and stage context of each individual sub-step (NotebookLM visual explainer style).
 */
export type UniversalShapeMechanismKind =
  | 'METAPHOR_TROJAN_DECOY_DELIVERY'
  | 'METAPHOR_LOCK_DOWNGRADE_AND_CRACK'
  | 'METAPHOR_SCANNER_WIRING_SABOTAGE'
  | 'METAPHOR_SPARE_KEY_CABINET_SMASH'
  | 'METAPHOR_SMUGGLED_COURIER_CHUNKS'
  | 'METAPHOR_SUPPLY_FACTORY_TAMPER'
  | 'METAPHOR_RING0_MASTER_SKELETON_KEY'
  | 'TOPOLOGY_KILLCHAIN_NODE_WAVE'
  | 'BIDIRECTIONAL_PROTOCOL_HANDSHAKE_SWIMLANE'
  | 'KERBEROS_TGS_RC4_TICKET_FORGE'
  | 'HASHCAT_GPU_CRACK_AND_SMB_PTH'
  | 'DCSYNC_DRSR_DIRECTORY_REPLICATION'
  | 'JNDI_LOOKUP_REMOTE_CLASS_INJECTION'
  | 'AMSI_MEMORY_PATCH_AND_CLR_REFLECTION'
  | 'PROCESS_MEMORY_VAD_HOLLOW_AND_INJECT'
  | 'DNS_SUBDOMAIN_BASE32_CHUNK_TUNNEL'
  | 'VSS_SHADOW_DELETE_AND_CIPHER_STREAM'
  | 'CICD_PIPELINE_ARTIFACT_TAMPER_DAG'
  | 'RING3_TO_RING0_IOCTL_KERNEL_BYOVD'
  | 'CLOUD_IMDS_OAUTH_TOKEN_PIVOT'
  | 'APPLIANCE_EDGE_EXPLOIT_AND_WEBSHELL'
  | 'KILLCHAIN_WATERFALL_SIEM_CORRELATION'
  | 'SIEM_RULE_FIELD_MATCH_AND_MITIGATION_SHIELD';

export type UniversalInternalShapeMotionKind =
  | 'LOCK_MORPH'
  | 'ROTOR_CRACK'
  | 'HEX_STREAM'
  | 'SCANNER_BYPASS'
  | 'JNDI_LOOKUP_DIAL'
  | 'PACKET_SLICER'
  | 'SNAPSHOT_SHATTER'
  | 'PIPELINE_HASH_MUTATE'
  | 'CALLBACK_ARRAY_WIPE'
  | 'TOKEN_FORGE'
  | 'RADAR_RULE_MATCH'
  | 'SYSCALL_BRIDGE';

export interface UniversalInteractiveShapeNode {
  shapeId: 'S1' | 'S2' | 'S3';
  shapeBadge: string; // e.g. 'SHAPE ① · INITIATOR'
  title: string;
  subtitle: string;
  metaphorRole?: string;
  iconType: SketchIconType;
  internalMotionKind: UniversalInternalShapeMotionKind;
  beforeStateLabel: string;
  afterStateLabel: string;
  liveMetricLabel: string;
  accentHex: string;
  isCompromised: boolean;
}

export interface UniversalShapeMotionCue {
  motionIndex: 0 | 1 | 2;
  motionCode: 'MOTION ①' | 'MOTION ②' | 'MOTION ③';
  interactionArc:
    | 'S1_TO_S2'
    | 'S2_INTERNAL_MUTATION'
    | 'S2_TO_S3'
    | 'S2_RETURN_S1';
  fromShapeLabel: string;
  toShapeLabel: string;
  vectorLabel: string;
  extractedTextToken: string;
  shapeToTextExplanation: string;
}

export interface UniversalTopologyWaveNodeSpec {
  nodeOrder: number;
  circledNumber: string;
  label: string;
  sublabel: string;
  zoneLabel: string;
  iconType: SketchIconType;
  isCompromised: boolean;
  actionBadge: string;
}

export interface UniversalKillChainWaterfallItemSpec {
  stageNumber: number;
  mitreId: string;
  stageTitle: string;
  fromLabel: string;
  toLabel: string;
  actionLabel: string;
  protocolOrEventId: string;
  subStepJumpId: string;
}

export interface UniversalShapeChoreographySpec {
  mechanismKind: UniversalShapeMechanismKind;
  mechanismBadge: string;
  canvasHeadline: string;
  canvasSubheadline: string;
  shapes: [
    UniversalInteractiveShapeNode,
    UniversalInteractiveShapeNode,
    UniversalInteractiveShapeNode,
  ];
  motions: [
    UniversalShapeMotionCue,
    UniversalShapeMotionCue,
    UniversalShapeMotionCue,
  ];
  extractedTokens: string[];
  topologyWaveNodes?: UniversalTopologyWaveNodeSpec[];
  waterfallStages?: UniversalKillChainWaterfallItemSpec[];
}

export interface UniversalMorphingSvgConfig {
  /** Primary morphing path d-strings for Phases A -> B -> C -> D (same command count for smooth interpolation) */
  primaryMorphPathD: string;
  /** Secondary morphing path d-string (e.g., return channel or spectral envelope) */
  secondaryMorphPathD: string;
  /** Tertiary morphing indicator shape path */
  indicatorMorphPathD: string;
  strokeHex: string;
  accentFillHex: string;
  packetProgress: number; // 0..1 position along conduit
}

export interface UniversalScrollySubStepSpec {
  id: string; // e.g., '0A', '1B', '3C', '5D'
  stageNumber: number; // 0..N
  subStepIndex: number; // 0..3 (A, B, C, D)
  subStepLetter: UniversalSubStepLetter;
  layerKind: UniversalExplanationLayerKind;
  layerKindBadge: string; // e.g. 'NON-TECHNICAL · STORY ANALOGY' or 'TECHNICAL · UNDER-THE-HOOD SPEC'
  visualChoreography: UniversalVisualChoreographyKind;
  badgeLabel: string;
  timestampRef: string;
  headline: string;
  clauseNumber: string;
  clauseTitle: string;
  explanation: string;
  narrativeSummary: string;
  technicalMechanism: string;
  apiOrCommandSignature: string;
  stateDeltaSummary: string;
  detectionEvidence: string;
  initiatorLabel: string;
  initiatorSublabel: string;
  initiatorIcon: SketchIconType;
  targetLabel: string;
  targetSublabel: string;
  targetIcon: SketchIconType;
  sensorLabel: string;
  sensorIcon: SketchIconType;
  protocolBadge: string;
  returnBadge: string;
  keySpecs: Array<{ term: string; value: string }>;
  morphConfig: UniversalMorphingSvgConfig;
  /** NotebookLM-style interactive shape-to-shape & shape-to-text choreography specification */
  shapeChoreography: UniversalShapeChoreographySpec;
  /** Normalised scroll threshold window [start, peak, end] within the full scenario scroll range (0..1) */
  scrollThresholdStart: number;
  scrollThresholdPeak: number;
  scrollThresholdEnd: number;
}

export interface UniversalScrollyChapterSpec {
  stageNumber: number; // 0..N
  stageCode: string;
  title: string;
  subtitle: string;
  mitreCode: string;
  timeRangeRef: string;
  storyAnalogy: string;
  commandLine: string;
  defenseRuleTitle: string;
  subSteps: [
    UniversalScrollySubStepSpec,
    UniversalScrollySubStepSpec,
    UniversalScrollySubStepSpec,
    UniversalScrollySubStepSpec,
  ];
}

export interface UniversalArchetypePalette {
  archetype: StructuralDiagramArchetype;
  themeLabel: string;
  primaryStrokeHex: string;
  secondaryStrokeHex: string;
  stageAccentClass: string;
  activeMarkerBgClass: string;
  activeMarkerBorderClass: string;
  activeMarkerTextClass: string;
  activeCardRingClass: string;
}

export interface UniversalScrollyVisualState {
  scenarioId: string;
  scenarioCode: string;
  scenarioName: string;
  archetype: StructuralDiagramArchetype;
  palette: UniversalArchetypePalette;
  stageNumber: number;
  activeSubStepId: string;
  subStepIndex: number; // 0..3
  subStepLetter: UniversalSubStepLetter;
  stageProgress: number; // 0..1 within active stage
  intraSubStepProgress: number; // 0..1 within active sub-step (A/B/C/D)
  /** Active motion index (0, 1, or 2 corresponding to MOTION ①, MOTION ②, MOTION ③) driven by intraSubStepProgress */
  activeMotionIndex: 0 | 1 | 2;
  overallProgress: number; // 0..1 across all sub-steps
  activeChapter: UniversalScrollyChapterSpec;
  activeSubStep: UniversalScrollySubStepSpec;
  allChapters: UniversalScrollyChapterSpec[];
  allSubSteps: UniversalScrollySubStepSpec[];
  /** Interpolated morphing SVG paths based on continuous scroll progress */
  interpolatedPrimaryPathD: string;
  interpolatedSecondaryPathD: string;
  interpolatedIndicatorPathD: string;
  /** Optional native Process Hollowing visual state when scenarioId === 'process-hollowing' */
  processHollowingState: ProcessHollowingStageVisualState | null;
}

const ARCHETYPE_PALETTES: Record<
  StructuralDiagramArchetype,
  UniversalArchetypePalette
> = {
  MEMORY_VAD_MUTATION_STACK: {
    archetype: 'MEMORY_VAD_MUTATION_STACK',
    themeLabel: 'VAD Memory & Syscall Choreography',
    primaryStrokeHex: '#e11d48',
    secondaryStrokeHex: '#6366f1',
    stageAccentClass: 'from-rose-600 via-indigo-600 to-amber-500',
    activeMarkerBgClass: 'bg-rose-600',
    activeMarkerBorderClass: 'border-rose-500',
    activeMarkerTextClass: 'text-rose-700 dark:text-rose-300',
    activeCardRingClass: 'border-rose-500 ring-1 ring-rose-500/30',
  },
  IDENTITY_TICKET_CRYPTO_EXCHANGE: {
    archetype: 'IDENTITY_TICKET_CRYPTO_EXCHANGE',
    themeLabel: 'Identity Ticket & Token Cryptography',
    primaryStrokeHex: '#d97706',
    secondaryStrokeHex: '#4f46e5',
    stageAccentClass: 'from-amber-500 via-indigo-600 to-emerald-500',
    activeMarkerBgClass: 'bg-amber-600',
    activeMarkerBorderClass: 'border-amber-500',
    activeMarkerTextClass: 'text-amber-800 dark:text-amber-300',
    activeCardRingClass: 'border-amber-500 ring-1 ring-amber-500/30',
  },
  PROTOCOL_FRAME_APPLIANCE_CONDUIT: {
    archetype: 'PROTOCOL_FRAME_APPLIANCE_CONDUIT',
    themeLabel: 'Wire Frame & Appliance Exploit Conduit',
    primaryStrokeHex: '#0284c7',
    secondaryStrokeHex: '#e11d48',
    stageAccentClass: 'from-sky-600 via-rose-600 to-emerald-500',
    activeMarkerBgClass: 'bg-sky-600',
    activeMarkerBorderClass: 'border-sky-500',
    activeMarkerTextClass: 'text-sky-700 dark:text-sky-300',
    activeCardRingClass: 'border-sky-500 ring-1 ring-sky-500/30',
  },
  CICD_SUPPLY_CHAIN_PIPELINE: {
    archetype: 'CICD_SUPPLY_CHAIN_PIPELINE',
    themeLabel: 'Supply-Chain & Build Provenance Pipeline',
    primaryStrokeHex: '#7c3aed',
    secondaryStrokeHex: '#d97706',
    stageAccentClass: 'from-violet-600 via-amber-500 to-rose-600',
    activeMarkerBgClass: 'bg-violet-600',
    activeMarkerBorderClass: 'border-violet-500',
    activeMarkerTextClass: 'text-violet-700 dark:text-violet-300',
    activeCardRingClass: 'border-violet-500 ring-1 ring-violet-500/30',
  },
  KERNEL_BYOVD_PRIVILEGE_LADDER: {
    archetype: 'KERNEL_BYOVD_PRIVILEGE_LADDER',
    themeLabel: 'Ring-3 → Ring-0 Kernel & UEFI Ladder',
    primaryStrokeHex: '#dc2626',
    secondaryStrokeHex: '#9333ea',
    stageAccentClass: 'from-red-600 via-purple-600 to-amber-500',
    activeMarkerBgClass: 'bg-red-600',
    activeMarkerBorderClass: 'border-red-500',
    activeMarkerTextClass: 'text-red-700 dark:text-red-300',
    activeCardRingClass: 'border-red-500 ring-1 ring-red-500/30',
  },
  RANSOMWARE_STORAGE_INHIBITION_CHAIN: {
    archetype: 'RANSOMWARE_STORAGE_INHIBITION_CHAIN',
    themeLabel: 'Storage Inhibition & Encryption Engine',
    primaryStrokeHex: '#e11d48',
    secondaryStrokeHex: '#ea580c',
    stageAccentClass: 'from-rose-600 via-orange-600 to-amber-500',
    activeMarkerBgClass: 'bg-rose-600',
    activeMarkerBorderClass: 'border-rose-500',
    activeMarkerTextClass: 'text-rose-700 dark:text-rose-300',
    activeCardRingClass: 'border-rose-500 ring-1 ring-rose-500/30',
  },
};

const MORPH_PRIMARY_PATHS: Record<UniversalSubStepLetter, string> = {
  A: 'M 24 64 C 110 22, 190 22, 270 64 C 350 106, 430 106, 516 64',
  B: 'M 24 64 C 110 18, 190 110, 270 64 C 350 18, 430 110, 516 64',
  C: 'M 24 84 C 110 14, 190 14, 270 36 C 350 58, 430 16, 516 28',
  D: 'M 24 72 C 110 72, 190 12, 270 12 C 350 12, 430 72, 516 72',
};

const MORPH_SECONDARY_PATHS: Record<UniversalSubStepLetter, string> = {
  A: 'M 24 92 C 110 112, 190 112, 270 92 C 350 72, 430 72, 516 92',
  B: 'M 516 96 C 430 122, 350 68, 270 96 C 190 122, 110 68, 24 96',
  C: 'M 24 104 C 110 88, 190 42, 270 84 C 350 116, 430 48, 516 88',
  D: 'M 24 102 C 110 100, 190 98, 270 22 C 350 98, 430 100, 516 102',
};

const MORPH_INDICATOR_PATHS: Record<UniversalSubStepLetter, string> = {
  A: 'M 14 2 C 21 2, 26 7, 26 14 C 26 21, 21 26, 14 26 C 7 26, 2 21, 2 14 C 2 7, 7 2, 14 2',
  B: 'M 14 2 C 24 6, 26 10, 26 14 C 26 18, 24 22, 14 26 C 4 22, 2 18, 2 14 C 2 10, 4 6, 14 2',
  C: 'M 14 1 C 25 2, 27 4, 27 14 C 27 24, 25 26, 14 27 C 3 26, 1 24, 1 14 C 1 4, 3 2, 14 1',
  D: 'M 14 2 C 20 8, 26 8, 26 14 C 26 20, 20 20, 14 26 C 8 20, 2 20, 2 14 C 2 8, 8 8, 14 2',
};

export function interpolateSvgPathStrings(
  pathA: string,
  pathB: string,
  tRaw: number
): string {
  const t = clampUnitProgress(tRaw);
  if (t <= 0.001) return pathA;
  if (t >= 0.999) return pathB;

  const numsA = pathA.match(/-?\d+(?:\.\d+)?/g);
  const numsB = pathB.match(/-?\d+(?:\.\d+)?/g);
  if (!numsA || !numsB || numsA.length !== numsB.length) {
    return t < 0.5 ? pathA : pathB;
  }

  let idx = 0;
  return pathA.replace(/-?\d+(?:\.\d+)?/g, () => {
    const a = Number.parseFloat(numsA[idx] || '0');
    const b = Number.parseFloat(numsB[idx] || '0');
    idx++;
    const val = a + (b - a) * t;
    return Number.isInteger(val) ? String(val) : val.toFixed(1);
  });
}

export function computeSubStepScrollThresholdEffect(
  overallProgress: number,
  subStep: Pick<
    UniversalScrollySubStepSpec,
    'scrollThresholdStart' | 'scrollThresholdPeak' | 'scrollThresholdEnd'
  >,
  isCurrentSubStep: boolean
): {
  opacity: number;
  translateY: number;
  scale: number;
  markerFillRatio: number;
} {
  if (isCurrentSubStep) {
    return {
      opacity: 1,
      translateY: 0,
      scale: 1.008,
      markerFillRatio: 1,
    };
  }

  const p = clampUnitProgress(overallProgress);
  const { scrollThresholdStart, scrollThresholdPeak, scrollThresholdEnd } =
    subStep;
  const halfWindow = Math.max(
    0.04,
    (scrollThresholdEnd - scrollThresholdStart) * 0.85
  );
  const dist = Math.abs(p - scrollThresholdPeak);

  if (dist <= halfWindow) {
    const ratio = 1 - dist / halfWindow;
    return {
      opacity: Number((0.72 + ratio * 0.28).toFixed(3)),
      translateY: Number(((1 - ratio) * 2).toFixed(2)),
      scale: Number((0.994 + ratio * 0.01).toFixed(4)),
      markerFillRatio: Number(clampUnitProgress(ratio).toFixed(3)),
    };
  }

  return {
    opacity: 0.64,
    translateY: 3,
    scale: 0.992,
    markerFillRatio: 0,
  };
}

function resolveDeepDiveChoreographyForArchetype(
  archetype: StructuralDiagramArchetype
): UniversalVisualChoreographyKind {
  switch (archetype) {
    case 'MEMORY_VAD_MUTATION_STACK':
      return 'MEMORY_VAD_HEX_MUTATION';
    case 'IDENTITY_TICKET_CRYPTO_EXCHANGE':
      return 'IDENTITY_TICKET_CRYPTO_FORGE';
    case 'PROTOCOL_FRAME_APPLIANCE_CONDUIT':
      return 'PROTOCOL_PACKET_FRAME_SINK';
    case 'CICD_SUPPLY_CHAIN_PIPELINE':
      return 'CICD_ARTIFACT_POISON_PIPELINE';
    case 'KERNEL_BYOVD_PRIVILEGE_LADDER':
      return 'KERNEL_RING0_PRIVILEGE_BRIDGE';
    case 'RANSOMWARE_STORAGE_INHIBITION_CHAIN':
      return 'RANSOMWARE_VSS_ENCRYPTION_IO';
  }
}

/**
 * Extracts concrete technical tokens (hex values, API/commands, EventIDs, IPs/ports, flags)
 * directly from an explanation paragraph so the shapes display exact tokens from the text.
 */
export function extractSalientTextTokens(
  text: string,
  commandOrSig: string,
  protocolBadge: string,
  keySpecs: Array<{ term: string; value: string }>
): string[] {
  const combined = `${text} ${commandOrSig}`;
  const tokens: string[] = [];

  const addUnique = (raw: string | undefined | null) => {
    if (!raw) return;
    const cleaned = raw.trim().replace(/^[,.;:]+|[,.;:]+$/g, '');
    if (cleaned.length < 2 || cleaned.length > 44) return;
    if (!tokens.includes(cleaned)) {
      tokens.push(cleaned);
    }
  };

  // 1. Hex constants / memory addresses / flags (e.g., 0x17, 0x00400000, 0xB8570007)
  const hexMatches = combined.match(/0x[0-9a-fA-F]{2,16}/g) || [];
  hexMatches.slice(0, 2).forEach(addUnique);

  // 2. Executables, DLLs, drivers, scripts, or JNDI expressions
  const binMatches =
    combined.match(
      /\$\{jndi:[^}]+\}|\b[A-Za-z0-9_-]+\.(?:exe|dll|sys|ps1|dit|class|jar|sh|py)\b/gi
    ) || [];
  binMatches.slice(0, 2).forEach(addUnique);

  // 3. Event IDs / CVEs / MITRE IDs
  const eidMatches =
    combined.match(
      /\b(?:Event\s*ID\s*\d+|EID\s*\d+|CVE-\d{4}-\d+|T\d{4}(?:\.\d{3})?)\b/gi
    ) || [];
  eidMatches.slice(0, 2).forEach(addUnique);

  // 4. Key specs values
  for (const ks of keySpecs.slice(0, 3)) {
    addUnique(`${ks.term}: ${ks.value.slice(0, 24)}`);
  }

  addUnique(protocolBadge);

  if (tokens.length === 0) {
    addUnique(commandOrSig.slice(0, 36));
  }

  return tokens.slice(0, 5);
}

/**
 * Resolves the specific NotebookLM-style interactive shape mechanism and internal motion
 * based on the exact text content, layerKind (A/B/C/D), stage number, and scenario archetype.
 */
function resolveSubStepShapeMechanism(params: {
  scenario: AttackScenario;
  archetype: StructuralDiagramArchetype;
  stageNumber: number;
  layerKind: UniversalExplanationLayerKind;
  explanation: string;
  commandOrSig: string;
  protocolBadge: string;
}): {
  mechanismKind: UniversalShapeMechanismKind;
  mechanismBadge: string;
  centerInternalMotion: UniversalInternalShapeMotionKind;
} {
  const {
    archetype,
    stageNumber,
    layerKind,
    explanation,
    commandOrSig,
    protocolBadge,
  } = params;
  const hay = `${explanation} ${commandOrSig} ${protocolBadge}`.toLowerCase();

  // PHASE A: NON-TECHNICAL STORY ANALOGY METAPHOR SCENES
  if (layerKind === 'ANALOGY_NARRATIVE') {
    if (
      hay.includes('shadow') ||
      hay.includes('spare key') ||
      hay.includes('backup') ||
      hay.includes('ransom') ||
      archetype === 'RANSOMWARE_STORAGE_INHIBITION_CHAIN'
    ) {
      return {
        mechanismKind: 'METAPHOR_SPARE_KEY_CABINET_SMASH',
        mechanismBadge: 'STORY METAPHOR · BACKUP VAULT SMASH & LOCKOUT',
        centerInternalMotion: 'SNAPSHOT_SHATTER',
      };
    }
    if (
      hay.includes('scanner') ||
      hay.includes('x-ray') ||
      hay.includes('amsi') ||
      hay.includes('blind') ||
      hay.includes('camera') ||
      hay.includes('sensor') && hay.includes('patch')
    ) {
      return {
        mechanismKind: 'METAPHOR_SCANNER_WIRING_SABOTAGE',
        mechanismBadge: 'STORY METAPHOR · SECURITY SCANNER SABOTAGE',
        centerInternalMotion: 'SCANNER_BYPASS',
      };
    }
    if (
      hay.includes('dns') ||
      hay.includes('library') ||
      hay.includes('phone directory') ||
      hay.includes('chunk') ||
      hay.includes('smuggl') ||
      hay.includes('courier')
    ) {
      return {
        mechanismKind: 'METAPHOR_SMUGGLED_COURIER_CHUNKS',
        mechanismBadge: 'STORY METAPHOR · COURIER CHUNK SMUGGLING',
        centerInternalMotion: 'PACKET_SLICER',
      };
    }
    if (
      hay.includes('ticket') ||
      hay.includes('kiosk') ||
      hay.includes('padlock') ||
      hay.includes('kerberos') ||
      hay.includes('badge') ||
      hay.includes('token') ||
      archetype === 'IDENTITY_TICKET_CRYPTO_EXCHANGE'
    ) {
      return {
        mechanismKind: 'METAPHOR_LOCK_DOWNGRADE_AND_CRACK',
        mechanismBadge: 'STORY METAPHOR · VAULT TICKET & LOCK FORGERY',
        centerInternalMotion: 'LOCK_MORPH',
      };
    }
    if (
      hay.includes('factory') ||
      hay.includes('pipeline') ||
      hay.includes('assembly line') ||
      hay.includes('build') ||
      archetype === 'CICD_SUPPLY_CHAIN_PIPELINE'
    ) {
      return {
        mechanismKind: 'METAPHOR_SUPPLY_FACTORY_TAMPER',
        mechanismBadge: 'STORY METAPHOR · ASSEMBLY LINE TAMPERING',
        centerInternalMotion: 'PIPELINE_HASH_MUTATE',
      };
    }
    if (
      hay.includes('ring-0') ||
      hay.includes('kernel') ||
      hay.includes('driver') ||
      hay.includes('master key') ||
      archetype === 'KERNEL_BYOVD_PRIVILEGE_LADDER'
    ) {
      return {
        mechanismKind: 'METAPHOR_RING0_MASTER_SKELETON_KEY',
        mechanismBadge: 'STORY METAPHOR · RING-0 MASTER SKELETON KEY',
        centerInternalMotion: 'CALLBACK_ARRAY_WIPE',
      };
    }
    return {
      mechanismKind: 'METAPHOR_TROJAN_DECOY_DELIVERY',
      mechanismBadge: 'STORY METAPHOR · DISGUISED TROJAN DELIVERY',
      centerInternalMotion: 'HEX_STREAM',
    };
  }

  // PHASE B: STORY-TO-TOPOLOGY BRIDGE & BIDIRECTIONAL SEQUENCE
  if (layerKind === 'CONCEPT_BRIDGE') {
    if (stageNumber === 0) {
      return {
        mechanismKind: 'TOPOLOGY_KILLCHAIN_NODE_WAVE',
        mechanismBadge: 'TOPOLOGY MOTION · MULTI-NODE ARCHITECTURE WAVE (①..⑥)',
        centerInternalMotion: 'SYSCALL_BRIDGE',
      };
    }
    return {
      mechanismKind: 'BIDIRECTIONAL_PROTOCOL_HANDSHAKE_SWIMLANE',
      mechanismBadge: `SEQUENCE MOTION · BIDIRECTIONAL EXCHANGE (#${stageNumber}→ / ⇠#${stageNumber})`,
      centerInternalMotion: 'SYSCALL_BRIDGE',
    };
  }

  // PHASE D: FORENSIC SIEM CORRELATION & MITIGATION CATCH
  if (layerKind === 'FORENSIC_DETECTION') {
    if (stageNumber === 0) {
      return {
        mechanismKind: 'KILLCHAIN_WATERFALL_SIEM_CORRELATION',
        mechanismBadge: 'SIEM MOTION · MULTI-STAGE KILL-CHAIN CORRELATION',
        centerInternalMotion: 'RADAR_RULE_MATCH',
      };
    }
    return {
      mechanismKind: 'SIEM_RULE_FIELD_MATCH_AND_MITIGATION_SHIELD',
      mechanismBadge: 'DEFENSE MOTION · TELEMETRY CATCH & MITIGATION SHIELD',
      centerInternalMotion: 'RADAR_RULE_MATCH',
    };
  }

  // PHASE C: DEEP TECHNICAL MECHANISM (Text-Specific Inspection!)
  if (
    hay.includes('dcsync') ||
    hay.includes('drsgetncchanges') ||
    hay.includes('1131f6aa') ||
    hay.includes('ntds.dit') ||
    hay.includes('7045') ||
    hay.includes('4697') ||
    hay.includes('psexec') ||
    hay.includes('createservicew') ||
    (hay.includes('krbtgt') && hay.includes('replicat'))
  ) {
    return {
      mechanismKind: 'DCSYNC_DRSR_DIRECTORY_REPLICATION',
      mechanismBadge:
        'TECHNICAL MOTION · AD / SCM PRIVILEGE ELEVATION & REPLICATION STREAM',
      centerInternalMotion: 'TOKEN_FORGE',
    };
  }

  if (
    hay.includes('hashcat') ||
    hay.includes('13100') ||
    hay.includes('brute') ||
    hay.includes('crack') ||
    hay.includes('pass-the-hash') ||
    hay.includes('pth') ||
    hay.includes('4624') && hay.includes('ntlm')
  ) {
    return {
      mechanismKind: 'HASHCAT_GPU_CRACK_AND_SMB_PTH',
      mechanismBadge: 'TECHNICAL MOTION · OFFLINE KEY CRACK & SMB PASS-THE-HASH',
      centerInternalMotion: 'ROTOR_CRACK',
    };
  }

  if (
    hay.includes('4769') ||
    hay.includes('0x17') ||
    hay.includes('rc4-hmac') ||
    hay.includes('kerberoast') ||
    hay.includes('tgs-req') ||
    hay.includes('tgs-rep') ||
    hay.includes('rubeus')
  ) {
    return {
      mechanismKind: 'KERBEROS_TGS_RC4_TICKET_FORGE',
      mechanismBadge: 'TECHNICAL MOTION · KDC TGS-REP 0x17 RC4 DOWNGRADE',
      centerInternalMotion: 'LOCK_MORPH',
    };
  }

  if (
    hay.includes('${jndi:') ||
    hay.includes('log4j') ||
    hay.includes('jndilookup') ||
    hay.includes('ldap://') ||
    hay.includes('deserializ')
  ) {
    return {
      mechanismKind: 'JNDI_LOOKUP_REMOTE_CLASS_INJECTION',
      mechanismBadge: 'TECHNICAL MOTION · JNDI PARSER SINK & CLASS INJECTION',
      centerInternalMotion: 'JNDI_LOOKUP_DIAL',
    };
  }

  if (
    hay.includes('amsiscanbuffer') ||
    hay.includes('amsi.dll') ||
    hay.includes('0xb8570007') ||
    hay.includes('e_invalidarg') ||
    hay.includes('assembly::load') ||
    hay.includes('reflective')
  ) {
    return {
      mechanismKind: 'AMSI_MEMORY_PATCH_AND_CLR_REFLECTION',
      mechanismBadge: 'TECHNICAL MOTION · AMSI MEMORY PATCH & CLR REFLECTION',
      centerInternalMotion: 'SCANNER_BYPASS',
    };
  }

  if (
    hay.includes('dns') &&
    (hay.includes('base32') ||
      hay.includes('subdomain') ||
      hay.includes('txt') ||
      hay.includes('cname') ||
      hay.includes('53'))
  ) {
    return {
      mechanismKind: 'DNS_SUBDOMAIN_BASE32_CHUNK_TUNNEL',
      mechanismBadge: 'TECHNICAL MOTION · DNS BASE32 SUBDOMAIN CHUNK TUNNEL',
      centerInternalMotion: 'PACKET_SLICER',
    };
  }

  if (
    hay.includes('vssadmin') ||
    hay.includes('shadowcopy') ||
    hay.includes('bcdedit') ||
    hay.includes('chacha20') ||
    hay.includes('aes-256') && hay.includes('encrypt') ||
    archetype === 'RANSOMWARE_STORAGE_INHIBITION_CHAIN'
  ) {
    return {
      mechanismKind: 'VSS_SHADOW_DELETE_AND_CIPHER_STREAM',
      mechanismBadge: 'TECHNICAL MOTION · VSS SHADOW WIPE & HIGH-ENTROPY I/O',
      centerInternalMotion: 'SNAPSHOT_SHATTER',
    };
  }

  if (
    hay.includes('ioctl') ||
    hay.includes('deviceiocontrol') ||
    hay.includes('ring-0') ||
    hay.includes('byovd') ||
    hay.includes('.sys') ||
    hay.includes('uefi') ||
    archetype === 'KERNEL_BYOVD_PRIVILEGE_LADDER'
  ) {
    return {
      mechanismKind: 'RING3_TO_RING0_IOCTL_KERNEL_BYOVD',
      mechanismBadge: 'TECHNICAL MOTION · RING-3 ──(IOCTL)──▶ RING-0 KERNEL BRIDGE',
      centerInternalMotion: 'CALLBACK_ARRAY_WIPE',
    };
  }

  if (
    hay.includes('169.254.169.254') ||
    hay.includes('imds') ||
    hay.includes('oauth') ||
    hay.includes('assumerole') ||
    hay.includes('bearer') ||
    hay.includes('jwt')
  ) {
    return {
      mechanismKind: 'CLOUD_IMDS_OAUTH_TOKEN_PIVOT',
      mechanismBadge: 'TECHNICAL MOTION · CLOUD IMDS / OAUTH TOKEN PIVOT',
      centerInternalMotion: 'TOKEN_FORGE',
    };
  }

  if (
    hay.includes('build') ||
    hay.includes('runner') ||
    hay.includes('pipeline') ||
    hay.includes('artifact') ||
    hay.includes('ci/cd') ||
    archetype === 'CICD_SUPPLY_CHAIN_PIPELINE'
  ) {
    return {
      mechanismKind: 'CICD_PIPELINE_ARTIFACT_TAMPER_DAG',
      mechanismBadge: 'TECHNICAL MOTION · CI/CD BUILD RUNNER & ARTIFACT TAMPER',
      centerInternalMotion: 'PIPELINE_HASH_MUTATE',
    };
  }

  if (
    hay.includes('virtualallocex') ||
    hay.includes('writeprocessmemory') ||
    hay.includes('ntunmapviewofsection') ||
    hay.includes('createprocessw') ||
    hay.includes('setthreadcontext') ||
    hay.includes('vad') ||
    archetype === 'MEMORY_VAD_MUTATION_STACK'
  ) {
    return {
      mechanismKind: 'PROCESS_MEMORY_VAD_HOLLOW_AND_INJECT',
      mechanismBadge: 'TECHNICAL MOTION · VIRTUAL MEMORY VAD & SYSCALL MUTATION',
      centerInternalMotion: 'HEX_STREAM',
    };
  }

  if (archetype === 'IDENTITY_TICKET_CRYPTO_EXCHANGE') {
    return {
      mechanismKind: 'KERBEROS_TGS_RC4_TICKET_FORGE',
      mechanismBadge: 'TECHNICAL MOTION · IDENTITY CREDENTIAL & TOKEN FORGE',
      centerInternalMotion: 'LOCK_MORPH',
    };
  }

  return {
    mechanismKind: 'APPLIANCE_EDGE_EXPLOIT_AND_WEBSHELL',
    mechanismBadge: 'TECHNICAL MOTION · WIRE FRAME SINK & RUNTIME EXECUTION',
    centerInternalMotion: 'JNDI_LOOKUP_DIAL',
  };
}

/**
 * Builds the 3 interacting visual shapes (Shape ①, Shape ②, Shape ③) and
 * 3 synchronized shape-to-text motions (Motion ①, Motion ②, Motion ③)
 * for any sub-step so the animation directly describes the text and vice-versa.
 */
function buildSubStepShapeChoreography(params: {
  scenario: AttackScenario;
  archetype: StructuralDiagramArchetype;
  palette: UniversalArchetypePalette;
  stageNumber: number;
  subStepId: string;
  layerKind: UniversalExplanationLayerKind;
  headline: string;
  explanation: string;
  technicalMechanism: string;
  apiOrCommandSignature: string;
  stateDeltaSummary: string;
  detectionEvidence: string;
  initiatorLabel: string;
  initiatorSublabel: string;
  initiatorIcon: SketchIconType;
  targetLabel: string;
  targetSublabel: string;
  targetIcon: SketchIconType;
  sensorLabel: string;
  sensorIcon: SketchIconType;
  protocolBadge: string;
  returnBadge: string;
  keySpecs: Array<{ term: string; value: string }>;
  topologyWaveNodes?: UniversalTopologyWaveNodeSpec[];
  waterfallStages?: UniversalKillChainWaterfallItemSpec[];
}): UniversalShapeChoreographySpec {
  const {
    scenario,
    archetype,
    palette,
    stageNumber,
    subStepId,
    layerKind,
    headline,
    explanation,
    technicalMechanism,
    apiOrCommandSignature,
    stateDeltaSummary,
    detectionEvidence,
    initiatorLabel,
    initiatorSublabel,
    initiatorIcon,
    targetLabel,
    targetSublabel,
    targetIcon,
    sensorLabel,
    sensorIcon,
    protocolBadge,
    returnBadge,
    keySpecs,
    topologyWaveNodes,
    waterfallStages,
  } = params;

  const { mechanismKind, mechanismBadge, centerInternalMotion } =
    resolveSubStepShapeMechanism({
      scenario,
      archetype,
      stageNumber,
      layerKind,
      explanation,
      commandOrSig: apiOrCommandSignature,
      protocolBadge,
    });

  const extractedTokens = extractSalientTextTokens(
    explanation,
    apiOrCommandSignature,
    protocolBadge,
    keySpecs
  );

  const spec0 = keySpecs[0];
  const spec1 = keySpecs[1];
  const primaryToken =
    extractedTokens[0] ||
    (spec0 ? `${spec0.term}: ${spec0.value}` : protocolBadge);
  const secondaryToken =
    extractedTokens[1] ||
    (spec1 ? `${spec1.term}: ${spec1.value}` : returnBadge);

  // Build Shape ①, Shape ②, Shape ③ tailored to Layer A, B, C, or D
  if (layerKind === 'ANALOGY_NARRATIVE') {
    const metaphorTitleMap: Record<
      UniversalShapeMechanismKind,
      { s1Role: string; s2Title: string; s2Metric: string; s3Role: string }
    > = {
      METAPHOR_LOCK_DOWNGRADE_AND_CRACK: {
        s1Role: 'Disguised Requester (Guest)',
        s2Title: 'Ticket Kiosk Lock Downgrade',
        s2Metric: 'AES-256 Vault ➔ RC4 0x17 Padlock',
        s3Role: 'Protected Vault Asset',
      },
      METAPHOR_SCANNER_WIRING_SABOTAGE: {
        s1Role: 'In-Room Saboteur',
        s2Title: 'X-Ray Scanner Wiring Patch',
        s2Metric: 'Inspection Lens ➔ Forced GREEN',
        s3Role: 'Uninspected Memory Room',
      },
      METAPHOR_SPARE_KEY_CABINET_SMASH: {
        s1Role: 'Ransom Saboteur',
        s2Title: 'Spare Key & Backup Cabinet',
        s2Metric: 'Shadow Backups ➔ SHATTERED (0)',
        s3Role: 'Locked Production Vault',
      },
      METAPHOR_SMUGGLED_COURIER_CHUNKS: {
        s1Role: 'Inside Smuggler',
        s2Title: 'Directory Lookup Slicer',
        s2Metric: 'Secret File ➔ 63B Query Chunks',
        s3Role: 'Outside Collector Desk',
      },
      METAPHOR_SUPPLY_FACTORY_TAMPER: {
        s1Role: 'Upstream Saboteur',
        s2Title: 'Factory Assembly Line',
        s2Metric: 'Clean Blueprint ➔ Signed Trojan',
        s3Role: 'Downstream Customer Fleet',
      },
      METAPHOR_RING0_MASTER_SKELETON_KEY: {
        s1Role: 'Lobby Caller (Ring-3)',
        s2Title: 'Signed Valet Skeleton Key (.sys)',
        s2Metric: 'CPL-3 Caller ➔ CPL-0 Kernel',
        s3Role: 'Building Security Console',
      },
      METAPHOR_TROJAN_DECOY_DELIVERY: {
        s1Role: 'Disguised Sender',
        s2Title: 'Trusted Container Shell',
        s2Metric: 'Outer Badge ➔ Hidden Payload',
        s3Role: 'Internal Target & Watchtower',
      },
      TOPOLOGY_KILLCHAIN_NODE_WAVE: {
        s1Role: 'Origin Actor',
        s2Title: 'Architecture Pivot',
        s2Metric: 'Zone-to-Zone Traversal',
        s3Role: 'Target & Sensor',
      },
      BIDIRECTIONAL_PROTOCOL_HANDSHAKE_SWIMLANE: {
        s1Role: 'Sender',
        s2Title: 'Protocol Conduit',
        s2Metric: 'Request ⇄ Response',
        s3Role: 'Receiver',
      },
      KERBEROS_TGS_RC4_TICKET_FORGE: {
        s1Role: 'Requester',
        s2Title: 'KDC Ticket Engine',
        s2Metric: '0x17 RC4-HMAC',
        s3Role: 'Service Target',
      },
      HASHCAT_GPU_CRACK_AND_SMB_PTH: {
        s1Role: 'Cracker',
        s2Title: 'Hash Rotor',
        s2Metric: 'NTLM Key Match',
        s3Role: 'SMB Target',
      },
      DCSYNC_DRSR_DIRECTORY_REPLICATION: {
        s1Role: 'Replica Caller',
        s2Title: 'DRSR Pipe',
        s2Metric: 'NTDS.dit Stream',
        s3Role: 'Domain Controller',
      },
      JNDI_LOOKUP_REMOTE_CLASS_INJECTION: {
        s1Role: 'Payload Note',
        s2Title: 'Lookup Clerk',
        s2Metric: '${jndi:ldap://...}',
        s3Role: 'Remote Class Server',
      },
      AMSI_MEMORY_PATCH_AND_CLR_REFLECTION: {
        s1Role: 'Patcher',
        s2Title: 'AMSI Buffer',
        s2Metric: '0xB8570007',
        s3Role: 'CLR AppDomain',
      },
      PROCESS_MEMORY_VAD_HOLLOW_AND_INJECT: {
        s1Role: 'Loader',
        s2Title: 'Hollowed Host RAM',
        s2Metric: '0x00400000 RWX',
        s3Role: 'Thread Context',
      },
      DNS_SUBDOMAIN_BASE32_CHUNK_TUNNEL: {
        s1Role: 'Exfil Agent',
        s2Title: 'DNS Slicer',
        s2Metric: 'Base32 QNAME',
        s3Role: 'C2 Authoritative NS',
      },
      VSS_SHADOW_DELETE_AND_CIPHER_STREAM: {
        s1Role: 'Wiper',
        s2Title: 'VSS Coordinator',
        s2Metric: 'Snapshots Wiped',
        s3Role: 'Encrypted Volume',
      },
      CICD_PIPELINE_ARTIFACT_TAMPER_DAG: {
        s1Role: 'Commit Hook',
        s2Title: 'Build Runner',
        s2Metric: 'SHA-256 Mutated',
        s3Role: 'Release Registry',
      },
      RING3_TO_RING0_IOCTL_KERNEL_BYOVD: {
        s1Role: 'User Loader',
        s2Title: 'IOCTL Driver',
        s2Metric: 'Ring-3 ➔ Ring-0',
        s3Role: 'Kernel Callbacks',
      },
      CLOUD_IMDS_OAUTH_TOKEN_PIVOT: {
        s1Role: 'Pod / VM',
        s2Title: 'IMDS / OAuth Mint',
        s2Metric: 'STS Bearer Token',
        s3Role: 'Cloud Control Plane',
      },
      APPLIANCE_EDGE_EXPLOIT_AND_WEBSHELL: {
        s1Role: 'Exploit Frame',
        s2Title: 'Edge Daemon Sink',
        s2Metric: 'Auth Bypass ➔ Shell',
        s3Role: 'Internal DMZ',
      },
      KILLCHAIN_WATERFALL_SIEM_CORRELATION: {
        s1Role: 'Kill-Chain',
        s2Title: 'Correlation Engine',
        s2Metric: 'Multi-Stage Lock',
        s3Role: 'SOC Alert',
      },
      SIEM_RULE_FIELD_MATCH_AND_MITIGATION_SHIELD: {
        s1Role: 'Telemetry Source',
        s2Title: 'Sigma/YARA Gate',
        s2Metric: 'Rule Matched',
        s3Role: 'Mitigation Shield',
      },
    };

    const mInfo =
      metaphorTitleMap[mechanismKind] ||
      metaphorTitleMap.METAPHOR_TROJAN_DECOY_DELIVERY;

    const shapes: [
      UniversalInteractiveShapeNode,
      UniversalInteractiveShapeNode,
      UniversalInteractiveShapeNode,
    ] = [
      {
        shapeId: 'S1',
        shapeBadge: 'SHAPE ① · STORY INITIATOR',
        title: initiatorLabel,
        subtitle: initiatorSublabel,
        metaphorRole: mInfo.s1Role,
        iconType: initiatorIcon,
        internalMotionKind: 'SYSCALL_BRIDGE',
        beforeStateLabel: 'Normal Appearance',
        afterStateLabel: `Emits ${protocolBadge}`,
        liveMetricLabel: primaryToken,
        accentHex: '#d97706',
        isCompromised: true,
      },
      {
        shapeId: 'S2',
        shapeBadge: 'SHAPE ② · METAPHOR MECHANISM',
        title: mInfo.s2Title,
        subtitle: `Bridges to ${protocolBadge}`,
        metaphorRole: 'Interactive Analogy Core',
        iconType: targetIcon,
        internalMotionKind: centerInternalMotion,
        beforeStateLabel: 'Baseline Trust / Guard',
        afterStateLabel: 'Tricked / Transformed',
        liveMetricLabel: mInfo.s2Metric,
        accentHex: palette.primaryStrokeHex,
        isCompromised: true,
      },
      {
        shapeId: 'S3',
        shapeBadge: 'SHAPE ③ · TARGET & WATCHPOINT',
        title: targetLabel,
        subtitle: `${targetSublabel} · Watched by ${sensorLabel}`,
        metaphorRole: mInfo.s3Role,
        iconType: sensorIcon,
        internalMotionKind: 'RADAR_RULE_MATCH',
        beforeStateLabel: 'Protected Asset',
        afterStateLabel: `Exposed to ${protocolBadge}`,
        liveMetricLabel: secondaryToken,
        accentHex: '#4f46e5',
        isCompromised: false,
      },
    ];

    const motions: [
      UniversalShapeMotionCue,
      UniversalShapeMotionCue,
      UniversalShapeMotionCue,
    ] = [
      {
        motionIndex: 0,
        motionCode: 'MOTION ①',
        interactionArc: 'S1_TO_S2',
        fromShapeLabel: shapes[0].title,
        toShapeLabel: shapes[1].title,
        vectorLabel: `${mInfo.s1Role} ──▶ ${protocolBadge}`,
        extractedTextToken: primaryToken,
        shapeToTextExplanation: `Shape ① (${initiatorLabel}) initiates the analogy action toward Shape ② (${mInfo.s2Title}), illustrating how the adversary approaches the target using ${primaryToken}.`,
      },
      {
        motionIndex: 1,
        motionCode: 'MOTION ②',
        interactionArc: 'S2_INTERNAL_MUTATION',
        fromShapeLabel: shapes[1].title,
        toShapeLabel: shapes[1].title,
        vectorLabel: mInfo.s2Metric,
        extractedTextToken: mInfo.s2Metric,
        shapeToTextExplanation: `Inside Shape ②, the mechanism animates "${mInfo.s2Metric}"—directly visualizing the real-world analogy in the text before diving into low-level specs.`,
      },
      {
        motionIndex: 2,
        motionCode: 'MOTION ③',
        interactionArc: 'S2_TO_S3',
        fromShapeLabel: shapes[1].title,
        toShapeLabel: shapes[2].title,
        vectorLabel: `Real Cyber Impact ──▶ ${targetLabel}`,
        extractedTextToken: secondaryToken,
        shapeToTextExplanation: `Shape ② connects the story metaphor directly to Shape ③ (${targetLabel} monitored by ${sensorLabel}), bridging the story to ${stateDeltaSummary}.`,
      },
    ];

    return {
      mechanismKind,
      mechanismBadge,
      canvasHeadline: headline,
      canvasSubheadline: stateDeltaSummary,
      shapes,
      motions,
      extractedTokens,
      topologyWaveNodes,
      waterfallStages,
    };
  }

  if (layerKind === 'CONCEPT_BRIDGE') {
    const shapes: [
      UniversalInteractiveShapeNode,
      UniversalInteractiveShapeNode,
      UniversalInteractiveShapeNode,
    ] = [
      {
        shapeId: 'S1',
        shapeBadge: 'SHAPE ① · SENDER NODE',
        title: initiatorLabel,
        subtitle: initiatorSublabel,
        iconType: initiatorIcon,
        internalMotionKind: 'SYSCALL_BRIDGE',
        beforeStateLabel: 'Ready to Transmit',
        afterStateLabel: `Sent #${stageNumber || 1}→ ${protocolBadge}`,
        liveMetricLabel: primaryToken,
        accentHex: palette.primaryStrokeHex,
        isCompromised: true,
      },
      {
        shapeId: 'S2',
        shapeBadge: 'SHAPE ② · RECEIVER & STATE ENGINE',
        title: targetLabel,
        subtitle: targetSublabel,
        iconType: targetIcon,
        internalMotionKind: centerInternalMotion,
        beforeStateLabel: 'Listening / Waiting',
        afterStateLabel: `Processed ${protocolBadge}`,
        liveMetricLabel: `${protocolBadge} ⇄ ${returnBadge}`,
        accentHex: palette.secondaryStrokeHex,
        isCompromised: true,
      },
      {
        shapeId: 'S3',
        shapeBadge: 'SHAPE ③ · RETURN & SENSOR TAP',
        title: sensorLabel,
        subtitle: `Observing ${protocolBadge}`,
        iconType: sensorIcon,
        internalMotionKind: 'RADAR_RULE_MATCH',
        beforeStateLabel: 'Passive Tap',
        afterStateLabel: `Logged ${returnBadge}`,
        liveMetricLabel: secondaryToken,
        accentHex: '#059669',
        isCompromised: false,
      },
    ];

    const motions: [
      UniversalShapeMotionCue,
      UniversalShapeMotionCue,
      UniversalShapeMotionCue,
    ] = [
      {
        motionIndex: 0,
        motionCode: 'MOTION ①',
        interactionArc: 'S1_TO_S2',
        fromShapeLabel: initiatorLabel,
        toShapeLabel: targetLabel,
        vectorLabel: `#${stageNumber || 1}→ ${protocolBadge}`,
        extractedTextToken: primaryToken,
        shapeToTextExplanation: `Shape ① (${initiatorLabel}) transmits the forward request (#${stageNumber || 1}→ ${protocolBadge}) into Shape ② (${targetLabel}), matching the opening clause of the text.`,
      },
      {
        motionIndex: 1,
        motionCode: 'MOTION ②',
        interactionArc: 'S2_INTERNAL_MUTATION',
        fromShapeLabel: targetLabel,
        toShapeLabel: targetLabel,
        vectorLabel: `State Shift: ${protocolBadge}`,
        extractedTextToken: secondaryToken,
        shapeToTextExplanation: `Shape ② (${targetLabel}) processes the incoming frame and transitions its internal state (${stateDeltaSummary}).`,
      },
      {
        motionIndex: 2,
        motionCode: 'MOTION ③',
        interactionArc: 'S2_RETURN_S1',
        fromShapeLabel: targetLabel,
        toShapeLabel: initiatorLabel,
        vectorLabel: `⇠#${stageNumber || 1} ${returnBadge}`,
        extractedTextToken: returnBadge,
        shapeToTextExplanation: `Shape ② returns the response channel (⇠#${stageNumber || 1} ${returnBadge}) back to Shape ① while Shape ③ (${sensorLabel}) records the exchange.`,
      },
    ];

    return {
      mechanismKind,
      mechanismBadge,
      canvasHeadline: headline,
      canvasSubheadline: stateDeltaSummary,
      shapes,
      motions,
      extractedTokens,
      topologyWaveNodes,
      waterfallStages,
    };
  }

  if (layerKind === 'FORENSIC_DETECTION') {
    const shapes: [
      UniversalInteractiveShapeNode,
      UniversalInteractiveShapeNode,
      UniversalInteractiveShapeNode,
    ] = [
      {
        shapeId: 'S1',
        shapeBadge: 'SHAPE ① · TELEMETRY EMITTER',
        title: initiatorLabel,
        subtitle: protocolBadge,
        iconType: initiatorIcon,
        internalMotionKind: centerInternalMotion,
        beforeStateLabel: 'Runtime Activity',
        afterStateLabel: `Emitted ${protocolBadge}`,
        liveMetricLabel: primaryToken,
        accentHex: palette.primaryStrokeHex,
        isCompromised: true,
      },
      {
        shapeId: 'S2',
        shapeBadge: 'SHAPE ② · SIEM / SIGMA RULE GATE',
        title: sensorLabel,
        subtitle: targetSublabel,
        iconType: sensorIcon,
        internalMotionKind: 'RADAR_RULE_MATCH',
        beforeStateLabel: 'Ingesting Events',
        afterStateLabel: `Rule Match: ${returnBadge}`,
        liveMetricLabel: `${protocolBadge} · ${returnBadge}`,
        accentHex: '#059669',
        isCompromised: false,
      },
      {
        shapeId: 'S3',
        shapeBadge: 'SHAPE ③ · MITIGATION SHIELD',
        title: 'Engineering Mitigation Control',
        subtitle: `Blocks ${protocolBadge}`,
        iconType: 'FIREWALL_ROUTER',
        internalMotionKind: 'LOCK_MORPH',
        beforeStateLabel: 'Policy Standby',
        afterStateLabel: 'Attack Vector Severed',
        liveMetricLabel: secondaryToken,
        accentHex: '#0284c7',
        isCompromised: false,
      },
    ];

    const motions: [
      UniversalShapeMotionCue,
      UniversalShapeMotionCue,
      UniversalShapeMotionCue,
    ] = [
      {
        motionIndex: 0,
        motionCode: 'MOTION ①',
        interactionArc: 'S1_TO_S2',
        fromShapeLabel: initiatorLabel,
        toShapeLabel: sensorLabel,
        vectorLabel: `Telemetry Stream: ${protocolBadge}`,
        extractedTextToken: primaryToken,
        shapeToTextExplanation: `Shape ① (${initiatorLabel}) emits the forensic telemetry event (${protocolBadge} · ${primaryToken}) directly into Shape ② (${sensorLabel}).`,
      },
      {
        motionIndex: 1,
        motionCode: 'MOTION ②',
        interactionArc: 'S2_INTERNAL_MUTATION',
        fromShapeLabel: sensorLabel,
        toShapeLabel: sensorLabel,
        vectorLabel: `Rule Lock: ${returnBadge}`,
        extractedTextToken: secondaryToken,
        shapeToTextExplanation: `Inside Shape ② (${sensorLabel}), the detection scanner matches the anomalous field (${secondaryToken}) against the documented rule (${technicalMechanism.slice(0, 48)}).`,
      },
      {
        motionIndex: 2,
        motionCode: 'MOTION ③',
        interactionArc: 'S2_TO_S3',
        fromShapeLabel: sensorLabel,
        toShapeLabel: 'Engineering Mitigation Control',
        vectorLabel: `Enforce Shield ──▶ SEVER PATH`,
        extractedTextToken: returnBadge,
        shapeToTextExplanation: `Shape ② triggers Shape ③ (Engineering Mitigation Shield), illustrating how the defensive control described in the text blocks the attack path.`,
      },
    ];

    return {
      mechanismKind,
      mechanismBadge,
      canvasHeadline: headline,
      canvasSubheadline: detectionEvidence,
      shapes,
      motions,
      extractedTokens,
      topologyWaveNodes,
      waterfallStages,
    };
  }

  // PHASE C: TECHNICAL DEEP-DIVE (Under-the-Hood Mechanism)
  const shapes: [
    UniversalInteractiveShapeNode,
    UniversalInteractiveShapeNode,
    UniversalInteractiveShapeNode,
  ] = [
    {
      shapeId: 'S1',
      shapeBadge: 'SHAPE ① · CALLER / PAYLOAD DRIVER',
      title: initiatorLabel,
      subtitle: initiatorSublabel,
      iconType: initiatorIcon,
      internalMotionKind: 'SYSCALL_BRIDGE',
      beforeStateLabel: 'Caller Context',
      afterStateLabel: `Executes ${protocolBadge}`,
      liveMetricLabel: primaryToken,
      accentHex: palette.primaryStrokeHex,
      isCompromised: true,
    },
    {
      shapeId: 'S2',
      shapeBadge: 'SHAPE ② · UNDER-THE-HOOD MUTATION CORE',
      title: targetLabel,
      subtitle: targetSublabel,
      iconType: targetIcon,
      internalMotionKind: centerInternalMotion,
      beforeStateLabel: spec0 ? `${spec0.term}` : 'Baseline State',
      afterStateLabel: spec0 ? `${spec0.value.slice(0, 26)}` : returnBadge,
      liveMetricLabel: `${primaryToken} ➔ ${secondaryToken}`,
      accentHex: palette.secondaryStrokeHex,
      isCompromised: true,
    },
    {
      shapeId: 'S3',
      shapeBadge: 'SHAPE ③ · RESULTING ARTIFACT & TRACE',
      title: spec1 ? `${spec1.term}` : `${returnBadge} State`,
      subtitle: spec1 ? spec1.value : detectionEvidence.slice(0, 38),
      iconType: sensorIcon,
      internalMotionKind: 'HEX_STREAM',
      beforeStateLabel: 'Pre-Execution',
      afterStateLabel: `Committed (${returnBadge})`,
      liveMetricLabel: secondaryToken,
      accentHex: '#e11d48',
      isCompromised: true,
    },
  ];

  const motions: [
    UniversalShapeMotionCue,
    UniversalShapeMotionCue,
    UniversalShapeMotionCue,
  ] = [
    {
      motionIndex: 0,
      motionCode: 'MOTION ①',
      interactionArc: 'S1_TO_S2',
      fromShapeLabel: shapes[0].title,
      toShapeLabel: shapes[1].title,
      vectorLabel: `Invoke: ${primaryToken}`,
      extractedTextToken: primaryToken,
      shapeToTextExplanation: `Shape ① (${initiatorLabel}) executes the low-level command/syscall (${apiOrCommandSignature.slice(0, 56)}) targeting Shape ② (${targetLabel}).`,
    },
    {
      motionIndex: 1,
      motionCode: 'MOTION ②',
      interactionArc: 'S2_INTERNAL_MUTATION',
      fromShapeLabel: shapes[1].title,
      toShapeLabel: shapes[1].title,
      vectorLabel: `Mutate: ${secondaryToken}`,
      extractedTextToken: secondaryToken,
      shapeToTextExplanation: `Inside Shape ② (${targetLabel}), the internal mechanism performs the exact under-the-hood transformation described in the text (${stateDeltaSummary}).`,
    },
    {
      motionIndex: 2,
      motionCode: 'MOTION ③',
      interactionArc: 'S2_TO_S3',
      fromShapeLabel: shapes[1].title,
      toShapeLabel: shapes[2].title,
      vectorLabel: `Artifact: ${protocolBadge} (${returnBadge})`,
      extractedTextToken: protocolBadge,
      shapeToTextExplanation: `Shape ② produces the resulting technical state in Shape ③ (${shapes[2].title}: ${shapes[2].subtitle}), leaving the forensic footprint ${protocolBadge}.`,
    },
  ];

  return {
    mechanismKind,
    mechanismBadge,
    canvasHeadline: headline,
    canvasSubheadline: stateDeltaSummary,
    shapes,
    motions,
    extractedTokens,
    topologyWaveNodes,
    waterfallStages,
  };
}

function buildBriefingChapterForScenario(
  scenario: AttackScenario,
  briefing: DiagramAlignedBriefingModel,
  archetype: StructuralDiagramArchetype,
  palette: UniversalArchetypePalette,
  totalSubSteps: number
): UniversalScrollyChapterSpec {
  const originNode = briefing.topologyNodes[0];
  const midNode =
    briefing.topologyNodes[Math.min(1, briefing.topologyNodes.length - 1)] ||
    originNode;
  const targetNode =
    briefing.topologyNodes[
      Math.max(0, briefing.topologyNodes.length - 2)
    ] || midNode;
  const siemNode =
    briefing.topologyNodes[briefing.topologyNodes.length - 1] || targetNode;

  const summaryClauses =
    briefing.structuredSummaryClauses.length > 0
      ? briefing.structuredSummaryClauses
      : parseStructuredExplanationClauses(scenario.overview, '0');

  const clause1 = summaryClauses[0]?.fullText || briefing.plainSummary;
  const clause2 =
    summaryClauses[1]?.fullText || briefing.diagramTopologySummary;

  const firstStage = scenario.stages[0];
  const lastStage =
    scenario.stages[scenario.stages.length - 1] || firstStage;
  const firstTel = scenario.telemetry[0];

  const letters: UniversalSubStepLetter[] = ['A', 'B', 'C', 'D'];
  const buildThreshold = (subIdx: number) => {
    const start = subIdx / totalSubSteps;
    const end = (subIdx + 1) / totalSubSteps;
    return {
      scrollThresholdStart: Number(start.toFixed(4)),
      scrollThresholdPeak: Number(((start + end) / 2).toFixed(4)),
      scrollThresholdEnd: Number(end.toFixed(4)),
    };
  };

  const topologyWaveNodes: UniversalTopologyWaveNodeSpec[] =
    briefing.topologyNodes.map((n) => ({
      nodeOrder: n.chainOrder,
      circledNumber: n.circledNumber,
      label: n.label,
      sublabel: n.sublabel,
      zoneLabel: n.zoneLabel,
      iconType: n.iconType,
      isCompromised: n.isCompromised,
      actionBadge: `Node ${n.circledNumber}`,
    }));

  const waterfallStages: UniversalKillChainWaterfallItemSpec[] =
    briefing.sequenceWaterfall.map((wf) => ({
      stageNumber: wf.stepNumber,
      mitreId: wf.mitreId,
      stageTitle: wf.actionLabel,
      fromLabel: `${wf.fromNodeCircled} ${wf.fromNodeLabel}`,
      toLabel: `${wf.toNodeCircled} ${wf.toNodeLabel}`,
      actionLabel: `#${wf.stepNumber}→ ${wf.actionLabel}`,
      protocolOrEventId: wf.protocolOrEventId,
      subStepJumpId: `${wf.stepNumber}A`,
    }));

  const subStep0ABase = {
    id: '0A',
    stageNumber: 0,
    subStepIndex: 0,
    subStepLetter: 'A' as UniversalSubStepLetter,
    layerKind: 'ANALOGY_NARRATIVE' as UniversalExplanationLayerKind,
    layerKindBadge: 'NON-TECHNICAL · STORY ANALOGY',
    visualChoreography:
      'ANALOGY_MENTAL_MODEL_SCHEMATIC' as UniversalVisualChoreographyKind,
    badgeLabel: '0A · REAL-WORLD STORY ANALOGY',
    timestampRef: '00:00 – 00:25',
    headline: `Plain-Language Mental Model: ${briefing.headline}`,
    clauseNumber: '#0.1',
    clauseTitle: 'Real-World Analogy & Adversary Objective',
    explanation: briefing.storyAnalogy,
    narrativeSummary: briefing.storyAnalogy,
    technicalMechanism: clause1,
    apiOrCommandSignature: `${briefing.originNodeLabel} ──(${scenario.stages.length} Stages)──▶ ${briefing.finalNodeLabel}`,
    stateDeltaSummary: `Origin: ${briefing.originNodeLabel} → Objective: ${briefing.finalNodeLabel}`,
    detectionEvidence: `Kill-Chain Scope: ${scenario.code} (${scenario.stages.length} Documented Stages · Severity ${scenario.severity})`,
    initiatorLabel: originNode?.label || briefing.originNodeLabel,
    initiatorSublabel: originNode?.sublabel || 'Entry Point',
    initiatorIcon: (originNode?.iconType || 'ATTACKER') as SketchIconType,
    targetLabel: targetNode?.label || briefing.finalNodeLabel,
    targetSublabel: targetNode?.sublabel || 'Target Asset',
    targetIcon: (targetNode?.iconType || 'VICTIM_LAPTOP') as SketchIconType,
    sensorLabel: siemNode?.label || 'SOC SIEM Sensor',
    sensorIcon: (siemNode?.iconType || 'SIEM_SENSOR') as SketchIconType,
    protocolBadge: scenario.code,
    returnBadge: `${scenario.stages.length} STAGES`,
    keySpecs: (scenario.specs || []).slice(0, 3),
    morphConfig: {
      primaryMorphPathD: MORPH_PRIMARY_PATHS[letters[0]],
      secondaryMorphPathD: MORPH_SECONDARY_PATHS[letters[0]],
      indicatorMorphPathD: MORPH_INDICATOR_PATHS[letters[0]],
      strokeHex: palette.primaryStrokeHex,
      accentFillHex: palette.secondaryStrokeHex,
      packetProgress: 0.2,
    },
    ...buildThreshold(0),
  };

  const subStep0A: UniversalScrollySubStepSpec = {
    ...subStep0ABase,
    shapeChoreography: buildSubStepShapeChoreography({
      scenario,
      archetype,
      palette,
      stageNumber: 0,
      subStepId: '0A',
      layerKind: subStep0ABase.layerKind,
      headline: subStep0ABase.headline,
      explanation: subStep0ABase.explanation,
      technicalMechanism: subStep0ABase.technicalMechanism,
      apiOrCommandSignature: subStep0ABase.apiOrCommandSignature,
      stateDeltaSummary: subStep0ABase.stateDeltaSummary,
      detectionEvidence: subStep0ABase.detectionEvidence,
      initiatorLabel: subStep0ABase.initiatorLabel,
      initiatorSublabel: subStep0ABase.initiatorSublabel,
      initiatorIcon: subStep0ABase.initiatorIcon,
      targetLabel: subStep0ABase.targetLabel,
      targetSublabel: subStep0ABase.targetSublabel,
      targetIcon: subStep0ABase.targetIcon,
      sensorLabel: subStep0ABase.sensorLabel,
      sensorIcon: subStep0ABase.sensorIcon,
      protocolBadge: subStep0ABase.protocolBadge,
      returnBadge: subStep0ABase.returnBadge,
      keySpecs: subStep0ABase.keySpecs,
      topologyWaveNodes,
      waterfallStages,
    }),
  };

  const subStep0BBase = {
    id: '0B',
    stageNumber: 0,
    subStepIndex: 1,
    subStepLetter: 'B' as UniversalSubStepLetter,
    layerKind: 'CONCEPT_BRIDGE' as UniversalExplanationLayerKind,
    layerKindBadge: 'BRIDGE · STORY ↔ TOPOLOGY',
    visualChoreography:
      'SEQUENCE_BIDIRECTIONAL_CONDUIT' as UniversalVisualChoreographyKind,
    badgeLabel: '0B · STORY ↔ ARCHITECTURE BRIDGE',
    timestampRef: '00:26 – 00:52',
    headline: `How the Story Maps to ${briefing.topologyNodes.length} Topology Nodes (①..⑥)`,
    clauseNumber: '#0.2',
    clauseTitle: 'Story-to-Scenario Technical Bridge',
    explanation: clause1,
    narrativeSummary: clause1,
    technicalMechanism: briefing.diagramTopologySummary,
    apiOrCommandSignature: `${originNode?.label || 'Origin'} ──▶ ${midNode?.label || 'Pivot'} ──▶ ${targetNode?.label || 'Target'}`,
    stateDeltaSummary: `Zones Traversed: ${briefing.zoneTitles.join(' → ')}`,
    detectionEvidence: `Monitored across ${briefing.topologyNodes.length} architecture nodes by ${siemNode?.label || 'SOC SIEM'}`,
    initiatorLabel: originNode?.label || 'Node ①',
    initiatorSublabel: originNode?.zoneLabel || 'Ingress Zone',
    initiatorIcon: (originNode?.iconType || 'ATTACKER') as SketchIconType,
    targetLabel: midNode?.label || 'Node ②',
    targetSublabel: midNode?.zoneLabel || 'Target Zone',
    targetIcon: (midNode?.iconType || 'VICTIM_LAPTOP') as SketchIconType,
    sensorLabel: siemNode?.label || 'SOC SIEM',
    sensorIcon: (siemNode?.iconType || 'SIEM_SENSOR') as SketchIconType,
    protocolBadge: firstStage?.mitreTechniqueId || scenario.code,
    returnBadge: 'TOPOLOGY MAP',
    keySpecs: (firstStage?.keySpecs || scenario.specs || []).slice(0, 3),
    morphConfig: {
      primaryMorphPathD: MORPH_PRIMARY_PATHS[letters[1]],
      secondaryMorphPathD: MORPH_SECONDARY_PATHS[letters[1]],
      indicatorMorphPathD: MORPH_INDICATOR_PATHS[letters[1]],
      strokeHex: palette.secondaryStrokeHex,
      accentFillHex: palette.primaryStrokeHex,
      packetProgress: 0.45,
    },
    ...buildThreshold(1),
  };

  const subStep0B: UniversalScrollySubStepSpec = {
    ...subStep0BBase,
    shapeChoreography: buildSubStepShapeChoreography({
      scenario,
      archetype,
      palette,
      stageNumber: 0,
      subStepId: '0B',
      layerKind: subStep0BBase.layerKind,
      headline: subStep0BBase.headline,
      explanation: subStep0BBase.explanation,
      technicalMechanism: subStep0BBase.technicalMechanism,
      apiOrCommandSignature: subStep0BBase.apiOrCommandSignature,
      stateDeltaSummary: subStep0BBase.stateDeltaSummary,
      detectionEvidence: subStep0BBase.detectionEvidence,
      initiatorLabel: subStep0BBase.initiatorLabel,
      initiatorSublabel: subStep0BBase.initiatorSublabel,
      initiatorIcon: subStep0BBase.initiatorIcon,
      targetLabel: subStep0BBase.targetLabel,
      targetSublabel: subStep0BBase.targetSublabel,
      targetIcon: subStep0BBase.targetIcon,
      sensorLabel: subStep0BBase.sensorLabel,
      sensorIcon: subStep0BBase.sensorIcon,
      protocolBadge: subStep0BBase.protocolBadge,
      returnBadge: subStep0BBase.returnBadge,
      keySpecs: subStep0BBase.keySpecs,
      topologyWaveNodes,
      waterfallStages,
    }),
  };

  const subStep0CBase = {
    id: '0C',
    stageNumber: 0,
    subStepIndex: 2,
    subStepLetter: 'C' as UniversalSubStepLetter,
    layerKind: 'TECHNICAL_DEEP_DIVE' as UniversalExplanationLayerKind,
    layerKindBadge: 'TECHNICAL · SYSTEM & MEMORY SPEC',
    visualChoreography: resolveDeepDiveChoreographyForArchetype(archetype),
    badgeLabel: '0C · UNDER-THE-HOOD ATTACK SURFACE',
    timestampRef: '00:53 – 01:14',
    headline: `Core Technical Surface & Process Lineage (${palette.themeLabel})`,
    clauseNumber: '#0.3',
    clauseTitle: 'Low-Level Attack Surface & Runtime Primitives',
    explanation: clause2,
    narrativeSummary: clause2,
    technicalMechanism: briefing.plainSummary,
    apiOrCommandSignature:
      scenario.processTree?.[0]?.commandLine ||
      firstTel?.shortAction ||
      `${firstStage?.mitreTechniqueId}: ${firstStage?.title}`,
    stateDeltaSummary: `Archetype: ${palette.themeLabel} · ${scenario.processTree.length} Tracked Processes`,
    detectionEvidence:
      firstTel?.info ||
      `Primary MITRE Chain: ${scenario.stages.map((s) => s.mitreTechniqueId).join(' → ')}`,
    initiatorLabel: midNode?.label || originNode?.label || 'Source',
    initiatorSublabel:
      scenario.processTree?.[0]?.name || midNode?.sublabel || 'Runtime',
    initiatorIcon: (midNode?.iconType || 'PROCESS_THREAD') as SketchIconType,
    targetLabel: targetNode?.label || briefing.finalNodeLabel,
    targetSublabel:
      scenario.processTree?.[1]?.name || targetNode?.sublabel || 'Target',
    targetIcon: (targetNode?.iconType || 'KERNEL_MEMORY') as SketchIconType,
    sensorLabel: siemNode?.label || 'EDR / SIEM Sensor',
    sensorIcon: (siemNode?.iconType || 'SIEM_SENSOR') as SketchIconType,
    protocolBadge: firstTel?.protocolOrEventId || scenario.code,
    returnBadge: 'RUNTIME SPEC',
    keySpecs: (scenario.specs || firstStage?.keySpecs || []).slice(0, 3),
    morphConfig: {
      primaryMorphPathD: MORPH_PRIMARY_PATHS[letters[2]],
      secondaryMorphPathD: MORPH_SECONDARY_PATHS[letters[2]],
      indicatorMorphPathD: MORPH_INDICATOR_PATHS[letters[2]],
      strokeHex: palette.primaryStrokeHex,
      accentFillHex: palette.secondaryStrokeHex,
      packetProgress: 0.72,
    },
    ...buildThreshold(2),
  };

  const subStep0C: UniversalScrollySubStepSpec = {
    ...subStep0CBase,
    shapeChoreography: buildSubStepShapeChoreography({
      scenario,
      archetype,
      palette,
      stageNumber: 0,
      subStepId: '0C',
      layerKind: subStep0CBase.layerKind,
      headline: subStep0CBase.headline,
      explanation: subStep0CBase.explanation,
      technicalMechanism: subStep0CBase.technicalMechanism,
      apiOrCommandSignature: subStep0CBase.apiOrCommandSignature,
      stateDeltaSummary: subStep0CBase.stateDeltaSummary,
      detectionEvidence: subStep0CBase.detectionEvidence,
      initiatorLabel: subStep0CBase.initiatorLabel,
      initiatorSublabel: subStep0CBase.initiatorSublabel,
      initiatorIcon: subStep0CBase.initiatorIcon,
      targetLabel: subStep0CBase.targetLabel,
      targetSublabel: subStep0CBase.targetSublabel,
      targetIcon: subStep0CBase.targetIcon,
      sensorLabel: subStep0CBase.sensorLabel,
      sensorIcon: subStep0CBase.sensorIcon,
      protocolBadge: subStep0CBase.protocolBadge,
      returnBadge: subStep0CBase.returnBadge,
      keySpecs: subStep0CBase.keySpecs,
      topologyWaveNodes,
      waterfallStages,
    }),
  };

  const subStep0DBase = {
    id: '0D',
    stageNumber: 0,
    subStepIndex: 3,
    subStepLetter: 'D' as UniversalSubStepLetter,
    layerKind: 'FORENSIC_DETECTION' as UniversalExplanationLayerKind,
    layerKindBadge: 'DEFENSE · KILL-CHAIN WATERFALL & SIEM',
    visualChoreography:
      'SIEM_DETECTION_CORRELATION_RADAR' as UniversalVisualChoreographyKind,
    badgeLabel: `0D · ${scenario.stages.length}-STAGE KILL-CHAIN WATERFALL`,
    timestampRef: '01:15 – 01:35',
    headline: `End-to-End Kill-Chain Waterfall (#1→ to #${scenario.stages.length}→) & Sensor Correlation`,
    clauseNumber: '#0.4',
    clauseTitle: 'Chronological Sequence Waterfall & Multi-Stage Detection',
    explanation: briefing.diagramTopologySummary,
    narrativeSummary: briefing.diagramTopologySummary,
    technicalMechanism: briefing.documentedAdvisory,
    apiOrCommandSignature: scenario.stages
      .map((s) => `S${s.index}:${s.mitreTechniqueId}`)
      .join(' ──▶ '),
    stateDeltaSummary: `Complete ${scenario.stages.length}-Stage Kill-Chain Correlated in SIEM`,
    detectionEvidence:
      firstTel?.detectionRule?.title ||
      `Multi-Stage Detection: ${scenario.stages.map((s) => s.mitreTechniqueId).join(' + ')}`,
    initiatorLabel: originNode?.label || briefing.originNodeLabel,
    initiatorSublabel: `Stage #1 (${firstStage?.mitreTechniqueId || ''})`,
    initiatorIcon: (originNode?.iconType || 'ATTACKER') as SketchIconType,
    targetLabel: targetNode?.label || briefing.finalNodeLabel,
    targetSublabel: `Stage #${lastStage?.index || scenario.stages.length} (${lastStage?.mitreTechniqueId || ''})`,
    targetIcon: (targetNode?.iconType || 'CLOUD_TENANT') as SketchIconType,
    sensorLabel: siemNode?.label || 'SOC SIEM Correlation',
    sensorIcon: (siemNode?.iconType || 'SIEM_SENSOR') as SketchIconType,
    protocolBadge: `${scenario.stages.length} STAGES`,
    returnBadge: 'SIEM CORRELATED',
    keySpecs: (lastStage?.keySpecs || scenario.specs || []).slice(0, 3),
    morphConfig: {
      primaryMorphPathD: MORPH_PRIMARY_PATHS[letters[3]],
      secondaryMorphPathD: MORPH_SECONDARY_PATHS[letters[3]],
      indicatorMorphPathD: MORPH_INDICATOR_PATHS[letters[3]],
      strokeHex: '#059669',
      accentFillHex: palette.primaryStrokeHex,
      packetProgress: 0.95,
    },
    ...buildThreshold(3),
  };

  const subStep0D: UniversalScrollySubStepSpec = {
    ...subStep0DBase,
    shapeChoreography: buildSubStepShapeChoreography({
      scenario,
      archetype,
      palette,
      stageNumber: 0,
      subStepId: '0D',
      layerKind: subStep0DBase.layerKind,
      headline: subStep0DBase.headline,
      explanation: subStep0DBase.explanation,
      technicalMechanism: subStep0DBase.technicalMechanism,
      apiOrCommandSignature: subStep0DBase.apiOrCommandSignature,
      stateDeltaSummary: subStep0DBase.stateDeltaSummary,
      detectionEvidence: subStep0DBase.detectionEvidence,
      initiatorLabel: subStep0DBase.initiatorLabel,
      initiatorSublabel: subStep0DBase.initiatorSublabel,
      initiatorIcon: subStep0DBase.initiatorIcon,
      targetLabel: subStep0DBase.targetLabel,
      targetSublabel: subStep0DBase.targetSublabel,
      targetIcon: subStep0DBase.targetIcon,
      sensorLabel: subStep0DBase.sensorLabel,
      sensorIcon: subStep0DBase.sensorIcon,
      protocolBadge: subStep0DBase.protocolBadge,
      returnBadge: subStep0DBase.returnBadge,
      keySpecs: subStep0DBase.keySpecs,
      topologyWaveNodes,
      waterfallStages,
    }),
  };

  return {
    stageNumber: 0,
    stageCode: 'STAGE 00 · BRIEFING',
    title: briefing.headline,
    subtitle: briefing.storyAnalogy,
    mitreCode: `${scenario.code} · ${scenario.stages.map((s) => s.mitreTechniqueId).slice(0, 3).join(', ')}`,
    timeRangeRef: '00:00 – 01:35',
    storyAnalogy: briefing.storyAnalogy,
    commandLine:
      scenario.processTree?.[0]?.commandLine ||
      `${briefing.originNodeLabel} -> ${briefing.finalNodeLabel}`,
    defenseRuleTitle:
      firstTel?.detectionRule?.title ||
      `Multi-Stage ${scenario.code} Behavioral Correlation`,
    subSteps: [subStep0A, subStep0B, subStep0C, subStep0D],
  };
}

function buildStageChapterForScenario(
  scenario: AttackScenario,
  step: DiagramAlignedStepGuideItem,
  stageObj: AttackStage | undefined,
  archetype: StructuralDiagramArchetype,
  palette: UniversalArchetypePalette,
  totalSubSteps: number
): UniversalScrollyChapterSpec {
  const stNum = step.stepNumber;
  const baseGlobalIdx = stNum * 4;

  const buildThreshold = (offset: number) => {
    const globalIdx = baseGlobalIdx + offset;
    const start = globalIdx / totalSubSteps;
    const end = (globalIdx + 1) / totalSubSteps;
    return {
      scrollThresholdStart: Number(start.toFixed(4)),
      scrollThresholdPeak: Number(((start + end) / 2).toFixed(4)),
      scrollThresholdEnd: Number(end.toFixed(4)),
    };
  };

  const bridgeClause =
    step.structuredClauses[0]?.fullText || step.simpleExplanation;
  const practiceClause =
    step.structuredPracticeClauses[0]?.fullText || step.howItWorksInPractice;
  const cmdString =
    step.commandBreakdowns?.[0]?.rawCommand ||
    step.telemetryEvent?.rawLog ||
    `${step.forwardFlowBadge} (${step.protocolOrEventId})`;

  const minStart = stNum;
  const timeA = `0${minStart}:00 – 0${minStart}:14`;
  const timeB = `0${minStart}:15 – 0${minStart}:29`;
  const timeC = `0${minStart}:30 – 0${minStart}:44`;
  const timeD = `0${minStart}:45 – 0${minStart}:59`;

  const subABase = {
    id: `${stNum}A`,
    stageNumber: stNum,
    subStepIndex: 0,
    subStepLetter: 'A' as UniversalSubStepLetter,
    layerKind: 'ANALOGY_NARRATIVE' as UniversalExplanationLayerKind,
    layerKindBadge: 'NON-TECHNICAL · STORY ANALOGY',
    visualChoreography:
      'ANALOGY_MENTAL_MODEL_SCHEMATIC' as UniversalVisualChoreographyKind,
    badgeLabel: `${stNum}A · STORY ANALOGY & INTENT`,
    timestampRef: timeA,
    headline: `Real-World Story Analogy: ${step.plainTitle}`,
    clauseNumber: `#${stNum}.1`,
    clauseTitle: 'Intuitive Mental Model & Adversary Goal',
    explanation: step.storyAnalogy,
    narrativeSummary: step.storyAnalogy,
    technicalMechanism: bridgeClause,
    apiOrCommandSignature: `${step.fromNodeCircled} ${step.fromNodeLabel} ──▶ ${step.toNodeCircled} ${step.toNodeLabel}`,
    stateDeltaSummary: `Intent: ${step.stageTitle} (${step.mitreId})`,
    detectionEvidence: `Watchpoint: ${step.siemNodeCircled} ${step.siemNodeLabel} monitoring ${step.protocolOrEventId}`,
    initiatorLabel: step.fromNodeLabel,
    initiatorSublabel: step.fromNodeSublabel,
    initiatorIcon: step.fromNodeIcon,
    targetLabel: step.toNodeLabel,
    targetSublabel: step.toNodeSublabel,
    targetIcon: step.toNodeIcon,
    sensorLabel: step.siemNodeLabel,
    sensorIcon: step.siemNodeIcon,
    protocolBadge: step.mitreId,
    returnBadge: 'STORY MODEL',
    keySpecs: step.keySpecs.slice(0, 3),
    morphConfig: {
      primaryMorphPathD: MORPH_PRIMARY_PATHS.A,
      secondaryMorphPathD: MORPH_SECONDARY_PATHS.A,
      indicatorMorphPathD: MORPH_INDICATOR_PATHS.A,
      strokeHex: '#d97706',
      accentFillHex: palette.primaryStrokeHex,
      packetProgress: 0.22,
    },
    ...buildThreshold(0),
  };

  const subA: UniversalScrollySubStepSpec = {
    ...subABase,
    shapeChoreography: buildSubStepShapeChoreography({
      scenario,
      archetype,
      palette,
      stageNumber: stNum,
      subStepId: subABase.id,
      layerKind: subABase.layerKind,
      headline: subABase.headline,
      explanation: subABase.explanation,
      technicalMechanism: subABase.technicalMechanism,
      apiOrCommandSignature: subABase.apiOrCommandSignature,
      stateDeltaSummary: subABase.stateDeltaSummary,
      detectionEvidence: subABase.detectionEvidence,
      initiatorLabel: subABase.initiatorLabel,
      initiatorSublabel: subABase.initiatorSublabel,
      initiatorIcon: subABase.initiatorIcon,
      targetLabel: subABase.targetLabel,
      targetSublabel: subABase.targetSublabel,
      targetIcon: subABase.targetIcon,
      sensorLabel: subABase.sensorLabel,
      sensorIcon: subABase.sensorIcon,
      protocolBadge: subABase.protocolBadge,
      returnBadge: subABase.returnBadge,
      keySpecs: subABase.keySpecs,
    }),
  };

  const subBBase = {
    id: `${stNum}B`,
    stageNumber: stNum,
    subStepIndex: 1,
    subStepLetter: 'B' as UniversalSubStepLetter,
    layerKind: 'CONCEPT_BRIDGE' as UniversalExplanationLayerKind,
    layerKindBadge: 'SEQUENCE · INITIATOR ⇄ RECEIVER',
    visualChoreography:
      'SEQUENCE_BIDIRECTIONAL_CONDUIT' as UniversalVisualChoreographyKind,
    badgeLabel: `${stNum}B · SEQUENCE EXCHANGE (#${step.forwardSeq}→ / ⇠#${step.returnSeq})`,
    timestampRef: timeB,
    headline: `${step.fromNodeLabel} ──(${step.forwardFlowBadge})──▶ ${step.toNodeLabel}`,
    clauseNumber: `#${stNum}.2`,
    clauseTitle: 'Bidirectional Forward Action & Return Channel',
    explanation: bridgeClause,
    narrativeSummary: bridgeClause,
    technicalMechanism: step.returnDescription,
    apiOrCommandSignature: `${step.forwardFlowBadge}  |  ${step.returnFlowBadge}`,
    stateDeltaSummary: `Forward: ${step.forwardActionLabel} → Return: ${step.returnActionLabel}`,
    detectionEvidence: `Protocol / Event: ${step.protocolOrEventId} (${step.timestamp})`,
    initiatorLabel: step.fromNodeLabel,
    initiatorSublabel: step.fromNodeZone,
    initiatorIcon: step.fromNodeIcon,
    targetLabel: step.toNodeLabel,
    targetSublabel: step.toNodeZone,
    targetIcon: step.toNodeIcon,
    sensorLabel: step.siemNodeLabel,
    sensorIcon: step.siemNodeIcon,
    protocolBadge: step.protocolOrEventId,
    returnBadge: step.returnFlowBadge,
    keySpecs: step.keySpecs.slice(0, 3),
    morphConfig: {
      primaryMorphPathD: MORPH_PRIMARY_PATHS.B,
      secondaryMorphPathD: MORPH_SECONDARY_PATHS.B,
      indicatorMorphPathD: MORPH_INDICATOR_PATHS.B,
      strokeHex: palette.primaryStrokeHex,
      accentFillHex: palette.secondaryStrokeHex,
      packetProgress: 0.52,
    },
    ...buildThreshold(1),
  };

  const subB: UniversalScrollySubStepSpec = {
    ...subBBase,
    shapeChoreography: buildSubStepShapeChoreography({
      scenario,
      archetype,
      palette,
      stageNumber: stNum,
      subStepId: subBBase.id,
      layerKind: subBBase.layerKind,
      headline: subBBase.headline,
      explanation: subBBase.explanation,
      technicalMechanism: subBBase.technicalMechanism,
      apiOrCommandSignature: subBBase.apiOrCommandSignature,
      stateDeltaSummary: subBBase.stateDeltaSummary,
      detectionEvidence: subBBase.detectionEvidence,
      initiatorLabel: subBBase.initiatorLabel,
      initiatorSublabel: subBBase.initiatorSublabel,
      initiatorIcon: subBBase.initiatorIcon,
      targetLabel: subBBase.targetLabel,
      targetSublabel: subBBase.targetSublabel,
      targetIcon: subBBase.targetIcon,
      sensorLabel: subBBase.sensorLabel,
      sensorIcon: subBBase.sensorIcon,
      protocolBadge: subBBase.protocolBadge,
      returnBadge: subBBase.returnBadge,
      keySpecs: subBBase.keySpecs,
    }),
  };

  const subCBase = {
    id: `${stNum}C`,
    stageNumber: stNum,
    subStepIndex: 2,
    subStepLetter: 'C' as UniversalSubStepLetter,
    layerKind: 'TECHNICAL_DEEP_DIVE' as UniversalExplanationLayerKind,
    layerKindBadge: 'TECHNICAL · UNDER-THE-HOOD SPEC',
    visualChoreography: resolveDeepDiveChoreographyForArchetype(archetype),
    badgeLabel: `${stNum}C · UNDER-THE-HOOD MECHANISM & SPECS`,
    timestampRef: timeC,
    headline: `Technical Execution: ${stageObj?.subtitle || step.forwardActionLabel}`,
    clauseNumber: `#${stNum}.3`,
    clauseTitle: 'Low-Level Command, Syscall, Memory & Protocol Specs',
    explanation: practiceClause,
    narrativeSummary: practiceClause,
    technicalMechanism: cmdString,
    apiOrCommandSignature: cmdString,
    stateDeltaSummary:
      step.keySpecs
        .slice(0, 2)
        .map((k) => `${k.term}: ${k.value}`)
        .join(' | ') || `${step.mitreId} Execution State`,
    detectionEvidence:
      step.telemetryEvent?.info || step.detectionAndEvidence,
    initiatorLabel: step.fromNodeLabel,
    initiatorSublabel: step.fromNodeSublabel,
    initiatorIcon: step.fromNodeIcon,
    targetLabel: step.toNodeLabel,
    targetSublabel: step.toNodeSublabel,
    targetIcon: step.toNodeIcon,
    sensorLabel: step.siemNodeLabel,
    sensorIcon: step.siemNodeIcon,
    protocolBadge: step.protocolOrEventId,
    returnBadge: step.mitreId,
    keySpecs: step.keySpecs,
    morphConfig: {
      primaryMorphPathD: MORPH_PRIMARY_PATHS.C,
      secondaryMorphPathD: MORPH_SECONDARY_PATHS.C,
      indicatorMorphPathD: MORPH_INDICATOR_PATHS.C,
      strokeHex: palette.secondaryStrokeHex,
      accentFillHex: palette.primaryStrokeHex,
      packetProgress: 0.78,
    },
    ...buildThreshold(2),
  };

  const subC: UniversalScrollySubStepSpec = {
    ...subCBase,
    shapeChoreography: buildSubStepShapeChoreography({
      scenario,
      archetype,
      palette,
      stageNumber: stNum,
      subStepId: subCBase.id,
      layerKind: subCBase.layerKind,
      headline: subCBase.headline,
      explanation: subCBase.explanation,
      technicalMechanism: subCBase.technicalMechanism,
      apiOrCommandSignature: subCBase.apiOrCommandSignature,
      stateDeltaSummary: subCBase.stateDeltaSummary,
      detectionEvidence: subCBase.detectionEvidence,
      initiatorLabel: subCBase.initiatorLabel,
      initiatorSublabel: subCBase.initiatorSublabel,
      initiatorIcon: subCBase.initiatorIcon,
      targetLabel: subCBase.targetLabel,
      targetSublabel: subCBase.targetSublabel,
      targetIcon: subCBase.targetIcon,
      sensorLabel: subCBase.sensorLabel,
      sensorIcon: subCBase.sensorIcon,
      protocolBadge: subCBase.protocolBadge,
      returnBadge: subCBase.returnBadge,
      keySpecs: subCBase.keySpecs,
    }),
  };

  const ruleType = step.telemetryEvent?.detectionRule?.type || 'SIEM';
  const ruleTitle =
    step.telemetryEvent?.detectionRule?.title ||
    `${step.protocolOrEventId} Detection Rule`;
  const mitigationText =
    step.telemetryEvent?.detectionRule?.mitigation || step.detectionAndEvidence;

  const subDBase = {
    id: `${stNum}D`,
    stageNumber: stNum,
    subStepIndex: 3,
    subStepLetter: 'D' as UniversalSubStepLetter,
    layerKind: 'FORENSIC_DETECTION' as UniversalExplanationLayerKind,
    layerKindBadge: `DEFENSE · ${ruleType} & SIEM CATCH`,
    visualChoreography:
      'SIEM_DETECTION_CORRELATION_RADAR' as UniversalVisualChoreographyKind,
    badgeLabel: `${stNum}D · FORENSIC TELEMETRY & ${ruleType} CATCH`,
    timestampRef: timeD,
    headline: `Sensor Catch (${step.protocolOrEventId}): ${ruleTitle}`,
    clauseNumber: `#${stNum}.4`,
    clauseTitle: 'Documented SIEM / EDR Sensor Catch & Engineering Mitigation',
    explanation: `${step.detectionAndEvidence} ${mitigationText !== step.detectionAndEvidence ? `Mitigation: ${mitigationText}` : ''}`.trim(),
    narrativeSummary: step.detectionAndEvidence,
    technicalMechanism:
      step.telemetryEvent?.detectionRule?.ruleCode ||
      step.telemetryEvent?.rawLog ||
      ruleTitle,
    apiOrCommandSignature:
      step.telemetryEvent?.detectionRule?.ruleCode ||
      `${ruleType}: ${ruleTitle}`,
    stateDeltaSummary: `Sensor ${step.siemNodeCircled} (${step.siemNodeLabel}) → Severity: ${step.telemetryEvent?.severity || scenario.severity}`,
    detectionEvidence: `${ruleType} RULE · ${ruleTitle} (${step.protocolOrEventId})`,
    initiatorLabel: step.toNodeLabel,
    initiatorSublabel: step.protocolOrEventId,
    initiatorIcon: step.toNodeIcon,
    targetLabel: step.siemNodeLabel,
    targetSublabel: `${ruleType} Alert · ${step.telemetryEvent?.severity || 'CRITICAL'}`,
    targetIcon: step.siemNodeIcon,
    sensorLabel: step.siemNodeLabel,
    sensorIcon: step.siemNodeIcon,
    protocolBadge: `${ruleType} · ${step.protocolOrEventId}`,
    returnBadge: step.telemetryEvent?.severity || 'ALERT FIRED',
    keySpecs: step.keySpecs.slice(0, 3),
    morphConfig: {
      primaryMorphPathD: MORPH_PRIMARY_PATHS.D,
      secondaryMorphPathD: MORPH_SECONDARY_PATHS.D,
      indicatorMorphPathD: MORPH_INDICATOR_PATHS.D,
      strokeHex: '#059669',
      accentFillHex: '#e11d48',
      packetProgress: 0.96,
    },
    ...buildThreshold(3),
  };

  const subD: UniversalScrollySubStepSpec = {
    ...subDBase,
    shapeChoreography: buildSubStepShapeChoreography({
      scenario,
      archetype,
      palette,
      stageNumber: stNum,
      subStepId: subDBase.id,
      layerKind: subDBase.layerKind,
      headline: subDBase.headline,
      explanation: subDBase.explanation,
      technicalMechanism: subDBase.technicalMechanism,
      apiOrCommandSignature: subDBase.apiOrCommandSignature,
      stateDeltaSummary: subDBase.stateDeltaSummary,
      detectionEvidence: subDBase.detectionEvidence,
      initiatorLabel: subDBase.initiatorLabel,
      initiatorSublabel: subDBase.initiatorSublabel,
      initiatorIcon: subDBase.initiatorIcon,
      targetLabel: subDBase.targetLabel,
      targetSublabel: subDBase.targetSublabel,
      targetIcon: subDBase.targetIcon,
      sensorLabel: subDBase.sensorLabel,
      sensorIcon: subDBase.sensorIcon,
      protocolBadge: subDBase.protocolBadge,
      returnBadge: subDBase.returnBadge,
      keySpecs: subDBase.keySpecs,
    }),
  };

  return {
    stageNumber: stNum,
    stageCode: `STAGE 0${stNum} · ${step.mitreId}`,
    title: step.stageTitle,
    subtitle: step.plainTitle,
    mitreCode: `${step.mitreId} · ${stageObj?.mitreTechniqueName || step.stageTitle}`,
    timeRangeRef: `0${minStart}:00 – 0${minStart}:59`,
    storyAnalogy: step.storyAnalogy,
    commandLine: cmdString,
    defenseRuleTitle: ruleTitle,
    subSteps: [subA, subB, subC, subD],
  };
}

/**
 * Converts Process Hollowing's dedicated 24-substep specification into the
 * UniversalScrollyChapterSpec structure while preserving 100% of its native
 * 6-stage hardware/memory/FFT choreography AND attaching explicit 3-motion
 * shape-to-text choreography cues for every sub-step (0A..5D).
 */
function buildProcessHollowingUniversalChapters(
  scenario: AttackScenario,
  archetype: StructuralDiagramArchetype,
  palette: UniversalArchetypePalette
): UniversalScrollyChapterSpec[] {
  const total = ALL_PROCESS_HOLLOWING_SUBSTEPS.length;
  const letters: UniversalSubStepLetter[] = ['A', 'B', 'C', 'D'];
  const layerKinds: UniversalExplanationLayerKind[] = [
    'ANALOGY_NARRATIVE',
    'CONCEPT_BRIDGE',
    'TECHNICAL_DEEP_DIVE',
    'FORENSIC_DETECTION',
  ];
  const layerBadges = [
    'PHASE A · ENTRY & LINEAGE MECHANISM',
    'PHASE B · KERNEL / MEMORY STRUCTURE',
    'PHASE C · SYSCALL / REGISTER MUTATION',
    'PHASE D · SYSMON / SIEM FORENSIC CATCH',
  ];

  return PROCESS_HOLLOWING_SCROLL_CHAPTERS.map((ch) => {
    const stageObj = scenario.stages.find((s) => s.index === ch.stageNumber);
    const mappedSubs = ch.subSteps.map((sub, idx) => {
      const globalIdx = ch.stageNumber * 4 + idx;
      const start = globalIdx / total;
      const end = (globalIdx + 1) / total;
      const letter = letters[idx] || 'A';
      const layerKind = layerKinds[idx] || 'TECHNICAL_DEEP_DIVE';
      const explanation = `${sub.narrativeSummary} ${sub.technicalMechanism}`;
      const keySpecs = stageObj?.keySpecs || scenario.specs.slice(0, 3);

      const shapeChoreography = buildSubStepShapeChoreography({
        scenario,
        archetype,
        palette,
        stageNumber: ch.stageNumber,
        subStepId: sub.id,
        layerKind,
        headline: sub.headline,
        explanation,
        technicalMechanism: sub.technicalMechanism,
        apiOrCommandSignature: sub.apiSignature,
        stateDeltaSummary: sub.kernelAndMemoryDelta,
        detectionEvidence: sub.detectionEvidence,
        initiatorLabel: 'Invoice_Q4.exe [3104]',
        initiatorSublabel: 'Untrusted Dropper Loader',
        initiatorIcon: 'MALWARE_PAYLOAD',
        targetLabel: 'svchost.exe [4892]',
        targetSublabel: '0x00400000 Hollowed Host',
        targetIcon: 'PROCESS_THREAD',
        sensorLabel: 'Sysmon & SIEM FFT Sensor',
        sensorIcon: 'SIEM_SENSOR',
        protocolBadge: ch.mitreCode,
        returnBadge: sub.detectionEvidence.slice(0, 28),
        keySpecs,
      });

      return {
        id: sub.id,
        stageNumber: ch.stageNumber,
        subStepIndex: idx,
        subStepLetter: letter,
        layerKind,
        layerKindBadge: layerBadges[idx] || 'TECHNICAL · SPEC',
        visualChoreography:
          'PROCESS_HOLLOWING_NATIVE' as UniversalVisualChoreographyKind,
        badgeLabel: sub.badgeLabel,
        timestampRef: sub.videoTimestampRef,
        headline: sub.headline,
        clauseNumber: sub.clauseNumber,
        clauseTitle: sub.clauseTitle,
        explanation,
        narrativeSummary: sub.narrativeSummary,
        technicalMechanism: sub.technicalMechanism,
        apiOrCommandSignature: sub.apiSignature,
        stateDeltaSummary: sub.kernelAndMemoryDelta,
        detectionEvidence: sub.detectionEvidence,
        initiatorLabel: 'Invoice_Q4.exe [3104]',
        initiatorSublabel: 'Untrusted Dropper Loader',
        initiatorIcon: 'MALWARE_PAYLOAD' as SketchIconType,
        targetLabel: 'svchost.exe [4892]',
        targetSublabel: '0x00400000 Hollowed Host',
        targetIcon: 'PROCESS_THREAD' as SketchIconType,
        sensorLabel: 'Sysmon & SIEM FFT Sensor',
        sensorIcon: 'SIEM_SENSOR' as SketchIconType,
        protocolBadge: ch.mitreCode,
        returnBadge: sub.detectionEvidence.slice(0, 28),
        keySpecs,
        morphConfig: {
          primaryMorphPathD: MORPH_PRIMARY_PATHS[letter],
          secondaryMorphPathD: MORPH_SECONDARY_PATHS[letter],
          indicatorMorphPathD: MORPH_INDICATOR_PATHS[letter],
          strokeHex: palette.primaryStrokeHex,
          accentFillHex: palette.secondaryStrokeHex,
          packetProgress: (idx + 1) * 0.25,
        },
        shapeChoreography,
        scrollThresholdStart: Number(start.toFixed(4)),
        scrollThresholdPeak: Number(((start + end) / 2).toFixed(4)),
        scrollThresholdEnd: Number(end.toFixed(4)),
      };
    }) as [
      UniversalScrollySubStepSpec,
      UniversalScrollySubStepSpec,
      UniversalScrollySubStepSpec,
      UniversalScrollySubStepSpec,
    ];

    return {
      stageNumber: ch.stageNumber,
      stageCode: ch.stageCode,
      title: ch.title,
      subtitle: ch.subtitle,
      mitreCode: ch.mitreCode,
      timeRangeRef: ch.videoRangeRef,
      storyAnalogy: ch.storyAnalogy,
      commandLine: ch.commandLine,
      defenseRuleTitle: ch.defenseRuleTitle,
      subSteps: mappedSubs,
    };
  });
}

const scenarioChaptersCache = new Map<
  string,
  {
    archetype: StructuralDiagramArchetype;
    palette: UniversalArchetypePalette;
    chapters: UniversalScrollyChapterSpec[];
    allSubSteps: UniversalScrollySubStepSpec[];
  }
>();

export function getUniversalScenarioScrollySpec(scenario: AttackScenario): {
  archetype: StructuralDiagramArchetype;
  palette: UniversalArchetypePalette;
  chapters: UniversalScrollyChapterSpec[];
  allSubSteps: UniversalScrollySubStepSpec[];
} {
  const cached = scenarioChaptersCache.get(scenario.id);
  if (cached) return cached;

  const archetype = resolveStructuralArchetype(scenario, null);
  const palette =
    ARCHETYPE_PALETTES[archetype] ||
    ARCHETYPE_PALETTES.PROTOCOL_FRAME_APPLIANCE_CONDUIT;

  if (scenario.id === PROCESS_HOLLOWING_SCENARIO_ID) {
    const chapters = buildProcessHollowingUniversalChapters(
      scenario,
      archetype,
      palette
    );
    const allSubSteps = chapters.flatMap((c) => c.subSteps);
    const entry = { archetype, palette, chapters, allSubSteps };
    scenarioChaptersCache.set(scenario.id, entry);
    return entry;
  }

  const guideModel = buildDiagramStepGuideModel(scenario, 0);
  const totalStagesWithBriefing = scenario.stages.length + 1;
  const totalSubSteps = totalStagesWithBriefing * 4;

  const briefingChapter = buildBriefingChapterForScenario(
    scenario,
    guideModel.briefing,
    archetype,
    palette,
    totalSubSteps
  );

  const stageChapters = guideModel.steps.map((step) => {
    const stageObj = scenario.stages.find((s) => s.index === step.stepNumber);
    return buildStageChapterForScenario(
      scenario,
      step,
      stageObj,
      archetype,
      palette,
      totalSubSteps
    );
  });

  const chapters = [briefingChapter, ...stageChapters];
  const allSubSteps = chapters.flatMap((c) => c.subSteps);
  const entry = { archetype, palette, chapters, allSubSteps };
  scenarioChaptersCache.set(scenario.id, entry);
  return entry;
}

export function computeUniversalScrollyVisualState(
  scenario: AttackScenario,
  rawStageNumber: number,
  rawStageProgress: number
): UniversalScrollyVisualState {
  const { archetype, palette, chapters, allSubSteps } =
    getUniversalScenarioScrollySpec(scenario);

  const maxStage = chapters[chapters.length - 1]?.stageNumber ?? 0;
  const clampedStageNum = Math.max(
    0,
    Math.min(
      maxStage,
      Math.floor(Number.isFinite(rawStageNumber) ? rawStageNumber : 0)
    )
  );
  const activeChapter =
    chapters.find((c) => c.stageNumber === clampedStageNum) || chapters[0];

  const stageProgress = clampUnitProgress(rawStageProgress);
  const subStepCount = activeChapter.subSteps.length; // 4
  const scaledProgress = stageProgress * subStepCount;
  const subStepIndex = Math.min(
    subStepCount - 1,
    Math.floor(scaledProgress)
  );
  const intraSubStepProgress = clampUnitProgress(scaledProgress - subStepIndex);
  const activeMotionIndex: 0 | 1 | 2 =
    intraSubStepProgress < 0.34 ? 0 : intraSubStepProgress < 0.67 ? 1 : 2;
  const activeSubStep =
    activeChapter.subSteps[subStepIndex] || activeChapter.subSteps[0];

  const globalIndex = allSubSteps.findIndex((s) => s.id === activeSubStep.id);
  const nextSubStep =
    allSubSteps[
      Math.min(allSubSteps.length - 1, Math.max(0, globalIndex + 1))
    ] || activeSubStep;

  const overallProgress = clampUnitProgress(
    (Math.max(0, globalIndex) + intraSubStepProgress) /
      Math.max(1, allSubSteps.length)
  );

  const interpolatedPrimaryPathD = interpolateSvgPathStrings(
    activeSubStep.morphConfig.primaryMorphPathD,
    nextSubStep.morphConfig.primaryMorphPathD,
    intraSubStepProgress
  );
  const interpolatedSecondaryPathD = interpolateSvgPathStrings(
    activeSubStep.morphConfig.secondaryMorphPathD,
    nextSubStep.morphConfig.secondaryMorphPathD,
    intraSubStepProgress
  );
  const interpolatedIndicatorPathD = interpolateSvgPathStrings(
    activeSubStep.morphConfig.indicatorMorphPathD,
    nextSubStep.morphConfig.indicatorMorphPathD,
    intraSubStepProgress
  );

  const processHollowingState =
    scenario.id === PROCESS_HOLLOWING_SCENARIO_ID
      ? computeProcessHollowingVisualState(clampedStageNum, stageProgress)
      : null;

  return {
    scenarioId: scenario.id,
    scenarioCode: scenario.code,
    scenarioName: scenario.name,
    archetype,
    palette,
    stageNumber: activeChapter.stageNumber,
    activeSubStepId: activeSubStep.id,
    subStepIndex,
    subStepLetter: activeSubStep.subStepLetter,
    stageProgress,
    intraSubStepProgress,
    activeMotionIndex,
    overallProgress,
    activeChapter,
    activeSubStep,
    allChapters: chapters,
    allSubSteps,
    interpolatedPrimaryPathD,
    interpolatedSecondaryPathD,
    interpolatedIndicatorPathD,
    processHollowingState,
  };
}
