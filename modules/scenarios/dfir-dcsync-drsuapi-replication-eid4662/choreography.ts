export type DcsyncCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface DcsyncStoryAct {
  id: number;
  startNorm: number;
  endNorm: number;
  label: string;
}

export const DCSYNC_TIMELINE_DURATION_SEC = 20;

export const DCSYNC_STORY_ACTS: readonly DcsyncStoryAct[] = [
  { id: 1, startNorm: 0.0, endNorm: 0.22, label: 'Act 1 · Over-Privileged Bridge Ribbon' },
  { id: 2, startNorm: 0.22, endNorm: 0.46, label: 'Act 2 · Rogue Courier Connects to Bridge' },
  { id: 3, startNorm: 0.46, endNorm: 0.7, label: 'Act 3 · Crown Ledger Replication Flow' },
  { id: 4, startNorm: 0.7, endNorm: 0.86, label: 'Act 4 · Non-Mint Audit Correlation' },
  { id: 5, startNorm: 0.86, endNorm: 1.0, label: 'Act 5 · Peer-Only Gate & Double Seal' },
];

export interface DcsyncChoreographyFrame {
  actIndex: number;
  aclRibbonGlow: number;
  courierAdvance: number;
  cutawayOpen: number;
  ledgerStreamProgress: number;
  auditAlarmLevel: number;
  peerGateShield: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smooth(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  const x = clamp01((t - start) / (end - start));
  return x * x * (3 - 2 * x);
}

export function evaluateDcsyncChoreography(
  tNormRaw: number,
  cutawayMode: DcsyncCutawayMode = 'AUTO'
): DcsyncChoreographyFrame {
  const t = clamp01(tNormRaw);
  const actIndex = DCSYNC_STORY_ACTS.findIndex((a) => t >= a.startNorm && t < a.endNorm);
  const resolvedAct = actIndex === -1 ? DCSYNC_STORY_ACTS.length - 1 : actIndex;

  const aclRibbonGlow = smooth(t, 0.03, 0.2);
  const courierAdvance = smooth(t, 0.22, 0.46);
  const autoCutaway = smooth(t, 0.44, 0.52);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  const ledgerStreamProgress = smooth(t, 0.48, 0.72);
  const auditAlarmLevel = smooth(t, 0.7, 0.86);
  const peerGateShield = smooth(t, 0.85, 0.96);

  return {
    actIndex: resolvedAct,
    aclRibbonGlow,
    courierAdvance,
    cutawayOpen,
    ledgerStreamProgress,
    auditAlarmLevel,
    peerGateShield,
  };
}
