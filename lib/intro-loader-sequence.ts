export type IntroAnimationPhaseId =
  | 'INK_SYNTHESIS'
  | 'VECTOR_THRUST'
  | 'TELEMETRY_SYNC'
  | 'READY_BURST';

export interface IntroAnimationPhaseMeta {
  id: IntroAnimationPhaseId;
  index: number;
  title: string;
  subtitle: string;
  minProgress: number;
  maxProgress: number;
}

export interface IntroModuleTick {
  id: string;
  label: string;
  unlockAtPct: number;
  isReady: boolean;
}

export interface ComputedIntroSequenceState {
  progressPct: number;
  formattedPct: string;
  phase: IntroAnimationPhaseMeta;
  modules: IntroModuleTick[];
  isComplete: boolean;
  mechaWingsDeployed: boolean;
  spearheadSlashed: boolean;
  hikariFlareActive: boolean;
  wordmarkLocked: boolean;
}

export const DEFAULT_INTRO_DURATION_MS = 2200;

export const INTRO_ANIMATION_PHASES: readonly IntroAnimationPhaseMeta[] = [
  {
    id: 'INK_SYNTHESIS',
    index: 1,
    title: 'Initializing Schematic Frame',
    subtitle: 'Calibrating isometric topology grid & cel-shaded vector bounds',
    minProgress: 0,
    maxProgress: 28,
  },
  {
    id: 'VECTOR_THRUST',
    index: 2,
    title: 'Mounting Attack Vectors',
    subtitle: 'Loading 6 MITRE ATT&CK behavioral execution graphs',
    minProgress: 28,
    maxProgress: 64,
  },
  {
    id: 'TELEMETRY_SYNC',
    index: 3,
    title: 'Synchronizing SIEM & Kernel Feeds',
    subtitle: 'Linking Sysmon, Windows Security, EDR & network packet streams',
    minProgress: 64,
    maxProgress: 94,
  },
  {
    id: 'READY_BURST',
    index: 4,
    title: 'Workbench Ready',
    subtitle: 'Launching interactive cyber attack simulator',
    minProgress: 94,
    maxProgress: 100,
  },
] as const;

export const INTRO_MODULE_CHECKS: ReadonlyArray<{
  id: string;
  label: string;
  unlockAtPct: number;
}> = [
  {
    id: 'topology-engine',
    label: '2D Isometric Schematic Canvas',
    unlockAtPct: 22,
  },
  {
    id: 'mitre-scenarios',
    label: 'MITRE ATT&CK Kill-Chain Models',
    unlockAtPct: 54,
  },
  {
    id: 'siem-correlation',
    label: 'Sysmon & SIEM Telemetry Correlator',
    unlockAtPct: 84,
  },
];

export function clampIntroProgress(rawPct: number): number {
  if (!Number.isFinite(rawPct)) return 0;
  return Math.max(0, Math.min(100, Math.round(rawPct)));
}

export function formatIntroProgressPct(progressPct: number): string {
  const clamped = clampIntroProgress(progressPct);
  return `${String(clamped).padStart(2, '0')}%`;
}

export function resolveIntroPhase(progressPct: number): IntroAnimationPhaseMeta {
  const clamped = clampIntroProgress(progressPct);
  for (let i = INTRO_ANIMATION_PHASES.length - 1; i >= 0; i--) {
    const candidate = INTRO_ANIMATION_PHASES[i];
    if (clamped >= candidate.minProgress) {
      return candidate;
    }
  }
  return INTRO_ANIMATION_PHASES[0];
}

export function computeIntroSequenceState(
  rawProgressPct: number
): ComputedIntroSequenceState {
  const progressPct = clampIntroProgress(rawProgressPct);
  const phase = resolveIntroPhase(progressPct);
  const modules: IntroModuleTick[] = INTRO_MODULE_CHECKS.map((item) => ({
    id: item.id,
    label: item.label,
    unlockAtPct: item.unlockAtPct,
    isReady: progressPct >= item.unlockAtPct,
  }));

  return {
    progressPct,
    formattedPct: formatIntroProgressPct(progressPct),
    phase,
    modules,
    isComplete: progressPct >= 100,
    mechaWingsDeployed: progressPct >= 10,
    spearheadSlashed: progressPct >= 30,
    hikariFlareActive: progressPct >= 48,
    wordmarkLocked: progressPct >= 58,
  };
}

/**
 * Determines whether the intro animation should be bypassed immediately
 * based on URL query parameters (e.g. `?autostart=1` or `?skipIntro=1`).
 */
export function shouldSkipIntroFromSearch(search: string): boolean {
  if (!search) return false;
  const normalized = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(normalized);
  const autostart = params.get('autostart');
  const skipIntro = params.get('skipIntro');
  return (
    autostart === '1' ||
    autostart === 'true' ||
    skipIntro === '1' ||
    skipIntro === 'true'
  );
}
