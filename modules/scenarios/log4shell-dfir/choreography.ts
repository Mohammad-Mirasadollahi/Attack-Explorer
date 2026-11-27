export type Log4shellCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface Log4shellStoryAct {
  id: number;
  startNorm: number;
  endNorm: number;
  label: string;
}

export const LOG4SHELL_TIMELINE_DURATION_SEC = 20;

export const LOG4SHELL_STORY_ACTS: readonly Log4shellStoryAct[] = [
  { id: 1, startNorm: 0.0, endNorm: 0.22, label: 'Act 1 · Inbound Labeled Parcel' },
  { id: 2, startNorm: 0.22, endNorm: 0.46, label: 'Act 2 · Logging Press Evaluates Token' },
  { id: 3, startNorm: 0.46, endNorm: 0.7, label: 'Act 3 · Outbound Pneumatic Tube Lookup' },
  { id: 4, startNorm: 0.7, endNorm: 0.86, label: 'Act 4 · Unexpected Child Tool Alarm' },
  { id: 5, startNorm: 0.86, endNorm: 1.0, label: 'Act 5 · Egress Airlock & Literal Press' },
];

export interface Log4shellChoreographyFrame {
  actIndex: number;
  conveyorParcelProgress: number;
  cutawayOpen: number;
  outboundTubeProgress: number;
  auditAlarmLevel: number;
  egressValveClosed: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smooth(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  const x = clamp01((t - start) / (end - start));
  return x * x * (3 - 2 * x);
}

export function evaluateLog4shellChoreography(
  tNormRaw: number,
  cutawayMode: Log4shellCutawayMode = 'AUTO'
): Log4shellChoreographyFrame {
  const t = clamp01(tNormRaw);
  const actIndex = LOG4SHELL_STORY_ACTS.findIndex((a) => t >= a.startNorm && t < a.endNorm);
  const resolvedAct = actIndex === -1 ? LOG4SHELL_STORY_ACTS.length - 1 : actIndex;

  const conveyorParcelProgress = smooth(t, 0.02, 0.24);
  const autoCutaway = smooth(t, 0.22, 0.3);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  const outboundTubeProgress = smooth(t, 0.46, 0.7);
  const auditAlarmLevel = smooth(t, 0.7, 0.86);
  const egressValveClosed = smooth(t, 0.85, 0.96);

  return {
    actIndex: resolvedAct,
    conveyorParcelProgress,
    cutawayOpen,
    outboundTubeProgress,
    auditAlarmLevel,
    egressValveClosed,
  };
}
