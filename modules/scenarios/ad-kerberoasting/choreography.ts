export type KerbCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface KerbStoryAct {
  id: number;
  startNorm: number;
  endNorm: number;
  label: string;
}

export const KERB_TIMELINE_DURATION_SEC = 20;

export const KERB_STORY_ACTS: readonly KerbStoryAct[] = [
  { id: 1, startNorm: 0.0, endNorm: 0.2, label: 'Act 1 · Bellboard SPN Scan' },
  { id: 2, startNorm: 0.2, endNorm: 0.42, label: 'Act 2 · Bronze RC4 Voucher' },
  { id: 3, startNorm: 0.42, endNorm: 0.65, label: 'Act 3 · Basement Safecracker' },
  { id: 4, startNorm: 0.65, endNorm: 0.84, label: 'Act 4 · Master Keycard Pivot' },
  { id: 5, startNorm: 0.84, endNorm: 1.0, label: 'Act 5 · Lobby Audit & AES Shield' },
];

export interface KerbChoreographyFrame {
  actIndex: number;
  bellboardGlow: number;
  tubePacketProgress: number;
  voucherIssued: number;
  cutawayOpen: number;
  tumblerSpin: number;
  keycardPivot: number;
  auditLanternBeam: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smooth(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  const x = clamp01((t - start) / (end - start));
  return x * x * (3 - 2 * x);
}

export function evaluateKerbChoreography(
  tNormRaw: number,
  cutawayMode: KerbCutawayMode = 'AUTO'
): KerbChoreographyFrame {
  const t = clamp01(tNormRaw);
  const actIndex = KERB_STORY_ACTS.findIndex((a) => t >= a.startNorm && t < a.endNorm);
  const resolvedAct = actIndex === -1 ? KERB_STORY_ACTS.length - 1 : actIndex;

  const bellboardGlow = smooth(t, 0.02, 0.18);
  const tubePacketProgress = smooth(t, 0.2, 0.36);
  const voucherIssued = smooth(t, 0.32, 0.42);
  const autoCutaway = smooth(t, 0.41, 0.49);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  const tumblerSpin = smooth(t, 0.44, 0.64);
  const keycardPivot = smooth(t, 0.65, 0.83);
  const auditLanternBeam = smooth(t, 0.84, 0.96);

  return {
    actIndex: resolvedAct,
    bellboardGlow,
    tubePacketProgress,
    voucherIssued,
    cutawayOpen,
    tumblerSpin,
    keycardPivot,
    auditLanternBeam,
  };
}
