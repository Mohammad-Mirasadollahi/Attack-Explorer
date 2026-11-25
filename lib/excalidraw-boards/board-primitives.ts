import type { Section3DKey } from '@/lib/section-3d-registry';
import {
  BOARD_FONT,
  BOARD_ROUGHNESS,
  BOARD_STROKE,
  CHALK,
} from '@/modules/scenarios/process-hollowing/excalidraw/chalk';
import {
  ARROW_GAP,
  arrow,
  box,
  caption,
  hArrow,
  note,
  sticky,
  title,
  vArrow,
} from '@/modules/scenarios/process-hollowing/excalidraw/helpers';
import type {
  BoardTooltip,
  BoardTooltipField,
  BoardTooltipKind,
  TechnicalBoardDescriptor,
  TechnicalBoardSkeleton,
} from '@/modules/scenarios/process-hollowing/excalidraw/types';

export {
  ARROW_GAP,
  BOARD_FONT,
  BOARD_ROUGHNESS,
  BOARD_STROKE,
  CHALK,
  arrow,
  box,
  caption,
  hArrow,
  note,
  sticky,
  title,
  vArrow,
};
export type {
  BoardTooltip,
  BoardTooltipField,
  BoardTooltipKind,
  TechnicalBoardDescriptor,
  TechnicalBoardSkeleton,
};

export type BoardNodeSpec = {
  id: string;
  label: string;
  tone: 'attacker' | 'trusted' | 'api' | 'note' | 'ok' | 'warn';
  tooltip: BoardTooltip;
};

export type BoardTopologyKind =
  | 'pipeline-flow'
  | 'split-boundary'
  | 'supplychain-branch'
  | 'persistence-triad'
  | 'memory-vad-compare'
  | 'forensic-timeline';

export interface StructuredBoardBlueprint {
  scenarioId: string;
  sectionKey: Section3DKey;
  topology: BoardTopologyKind;
  boardBadge: string;
  headerTitle: string;
  title: string;
  subtitle: string;
  /** Primary chain / columns: 3 or 4 nodes depending on topology */
  primaryNodes: [BoardNodeSpec, BoardNodeSpec, BoardNodeSpec];
  /** Secondary lower-row / right-column nodes: 2 or 3 nodes */
  secondaryNodes: [BoardNodeSpec, BoardNodeSpec] | [BoardNodeSpec, BoardNodeSpec, BoardNodeSpec];
  /** Floating arrow captions (never drawn on stroke) */
  edges: {
    e1: string;
    e2: string;
    e3: string;
    e4?: string;
  };
  /** Yellow chalk sticky teaching note */
  stickyNote: {
    id: string;
    label: string;
    title: string;
    fields: BoardTooltipField[];
    explain: string;
    note?: string;
  };
  /** Optional topology-specific zone label (e.g. Ring 3 vs Ring 0 or Disk vs Live) */
  zoneHeaders?: [string, string];
}

function toneColors(tone: BoardNodeSpec['tone']): { stroke: string; fill: string } {
  switch (tone) {
    case 'attacker':
      return { stroke: CHALK.attacker, fill: CHALK.attackerFill };
    case 'trusted':
      return { stroke: CHALK.trusted, fill: CHALK.trustedFill };
    case 'api':
      return { stroke: CHALK.api, fill: CHALK.apiFill };
    case 'note':
      return { stroke: CHALK.note, fill: CHALK.noteFill };
    case 'ok':
      return { stroke: CHALK.ok, fill: CHALK.okFill };
    case 'warn':
      return { stroke: CHALK.warn, fill: CHALK.warnFill };
  }
}

function safeBox(opts: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  stroke: string;
  fill: string;
}): TechnicalBoardSkeleton {
  return box({ ...opts, fontSize: 14 });
}

function safeTitle(x: number, y: number, text: string): TechnicalBoardSkeleton {
  return {
    ...title(x, y, text),
    fontSize: 22,
    width: Math.max(780, Math.ceil(text.length * 16)),
  };
}

function safeNote(
  x: number,
  y: number,
  text: string,
  color: string = CHALK.muted
): TechnicalBoardSkeleton {
  return {
    ...note(x, y, text, color),
    fontSize: 14,
    width: Math.max(620, Math.ceil(text.length * 10.5)),
  };
}

function safeCaption(
  id: string,
  x: number,
  y: number,
  text: string,
  color: string = CHALK.api
): TechnicalBoardSkeleton {
  return {
    ...caption(id, x, y, text, color),
    fontSize: 13.5,
    width: Math.max(200, Math.ceil(text.length * 10.5)),
  };
}

function safeHArrow(opts: {
  id: string;
  fromId: string;
  toId: string;
  fromRight: number;
  toLeft: number;
  midY: number;
  caption: string;
  stroke?: string;
}): TechnicalBoardSkeleton[] {
  const [cap, arr] = hArrow(opts);
  const gap = opts.toLeft - opts.fromRight;
  const estW = Math.max(150, Math.ceil(opts.caption.length * 10.2));
  return [
    {
      ...cap,
      x: opts.fromRight + Math.max(6, (gap - estW) / 2),
      y: opts.midY - 36,
      width: estW,
      fontSize: 13,
    },
    arr,
  ];
}

function safeVArrow(opts: {
  id: string;
  fromId: string;
  toId: string;
  midX: number;
  fromBottom: number;
  toTop: number;
  caption: string;
  stroke?: string;
  captionOffsetX?: number;
}): TechnicalBoardSkeleton[] {
  const [cap, arr] = vArrow(opts);
  return [
    {
      ...cap,
      width: Math.max(170, Math.ceil(opts.caption.length * 10.2)),
      fontSize: 13,
    },
    arr,
  ];
}

/**
 * Composes a MOD-13 compliant Excalidraw chalk whiteboard from a structured
 * scenario-specific blueprint using one of 6 distinct technical topologies:
 * - Guaranteed ARROW_GAP >= 150 between horizontally linked boxes
 * - Bare arrows + floating captions (zero labels on strokes)
 * - Sticky NOTE with tooltip + footer hover reminder
 * - Mandatory tooltip entry for EVERY teaching box + sticky
 */
export function buildStructuredBoard(
  bp: StructuredBoardBlueprint
): TechnicalBoardDescriptor {
  const tooltips: Record<string, BoardTooltip> = {};
  for (const n of [...bp.primaryNodes, ...bp.secondaryNodes]) {
    tooltips[n.id] = n.tooltip;
  }
  tooltips[bp.stickyNote.id] = {
    kind: 'note',
    title: bp.stickyNote.title,
    module: 'Teaching note',
    fields: bp.stickyNote.fields,
    explain: bp.stickyNote.explain,
    note: bp.stickyNote.note,
  };

  const skeletons: TechnicalBoardSkeleton[] = [
    safeTitle(40, 12, bp.headerTitle),
  ];

  const [p0, p1, p2] = bp.primaryNodes;
  const s0 = bp.secondaryNodes[0];
  const s1 = bp.secondaryNodes[1];
  const s2 = bp.secondaryNodes[2];

  if (bp.topology === 'split-boundary') {
    const yTop = 94;
    const hTop = 152;
    const yDiv = 296;
    const yBot = 356;
    const hBot = 152;

    const x0 = 40;
    const w0 = 320;
    const x1 = x0 + w0 + ARROW_GAP + 20;
    const w1 = 330;
    const x2 = x1 + w1 + ARROW_GAP + 20;
    const w2 = 330;

    skeletons.push(
      safeCaption('zone-top', 40, 62, bp.zoneHeaders?.[0] ?? 'USER-MODE / INPUT BOUNDARY (RING 3)', CHALK.trusted),
      safeBox({ id: p0.id, x: x0, y: yTop, w: w0, h: hTop, label: p0.label, ...toneColors(p0.tone) }),
      ...safeHArrow({
        id: `${p0.id}-a1`,
        fromId: p0.id,
        toId: p1.id,
        fromRight: x0 + w0,
        toLeft: x1,
        midY: yTop + hTop / 2,
        caption: bp.edges.e1,
        stroke: CHALK.api,
      }),
      safeBox({ id: p1.id, x: x1, y: yTop, w: w1, h: hTop, label: p1.label, ...toneColors(p1.tone) }),
      ...safeHArrow({
        id: `${p1.id}-a2`,
        fromId: p1.id,
        toId: p2.id,
        fromRight: x1 + w1,
        toLeft: x2,
        midY: yTop + hTop / 2,
        caption: bp.edges.e2,
        stroke: CHALK.attacker,
      }),
      safeBox({ id: p2.id, x: x2, y: yTop, w: w2, h: hTop, label: p2.label, ...toneColors(p2.tone) }),
      safeCaption('zone-div', 40, yDiv - 20, `────────  ${bp.zoneHeaders?.[1] ?? 'KERNEL / PRIVILEGE BOUNDARY (RING 0)'}  ────────`, CHALK.warn),
      ...safeVArrow({
        id: `${p1.id}-v1`,
        fromId: p1.id,
        toId: s0.id,
        midX: x1 + w1 / 2,
        fromBottom: yTop + hTop,
        toTop: yBot,
        caption: bp.edges.e3,
        stroke: CHALK.attacker,
        captionOffsetX: 16,
      }),
      safeBox({ id: s0.id, x: x0 + 180, y: yBot, w: 340, h: hBot, label: s0.label, ...toneColors(s0.tone) }),
      ...safeHArrow({
        id: `${s0.id}-a4`,
        fromId: s0.id,
        toId: s1.id,
        fromRight: x0 + 180 + 340,
        toLeft: x0 + 180 + 340 + ARROW_GAP + 20,
        midY: yBot + hBot / 2,
        caption: bp.edges.e4 ?? 'Telemetry / Witness',
        stroke: CHALK.ok,
      }),
      safeBox({ id: s1.id, x: x0 + 180 + 340 + ARROW_GAP + 20, y: yBot, w: 340, h: hBot, label: s1.label, ...toneColors(s1.tone) }),
      sticky({
        id: bp.stickyNote.id,
        x: x0 + 180 + 340 + ARROW_GAP + 20 + 370,
        y: yBot,
        w: 270,
        h: hBot,
        label: bp.stickyNote.label,
      }),
      safeNote(40, yBot + hBot + 26, 'Hover any chalk box → structure card + plain "What this means".', CHALK.muted)
    );
  } else if (bp.topology === 'memory-vad-compare') {
    const yRow1 = 98;
    const hRow = 150;
    const yRow2 = 304;
    const xLeft = 40;
    const wCol = 340;
    const xRight = xLeft + wCol + ARROW_GAP + 40;
    const xDet = xRight + wCol + 50;

    skeletons.push(
      safeCaption('col-left', xLeft, 64, bp.zoneHeaders?.[0] ?? 'EXPECTED / ON-DISK BASELINE', CHALK.trusted),
      safeCaption('col-right', xRight, 64, bp.zoneHeaders?.[1] ?? 'LIVE PROCESS / TAMPERED STATE', CHALK.attacker),
      safeBox({ id: p0.id, x: xLeft, y: yRow1, w: wCol, h: hRow, label: p0.label, ...toneColors(p0.tone) }),
      ...safeHArrow({
        id: `${p0.id}-cmp1`,
        fromId: p0.id,
        toId: p1.id,
        fromRight: xLeft + wCol,
        toLeft: xRight,
        midY: yRow1 + hRow / 2,
        caption: bp.edges.e1,
        stroke: CHALK.attacker,
      }),
      safeBox({ id: p1.id, x: xRight, y: yRow1, w: wCol, h: hRow, label: p1.label, ...toneColors(p1.tone) }),
      safeBox({ id: p2.id, x: xLeft, y: yRow2, w: wCol, h: hRow, label: p2.label, ...toneColors(p2.tone) }),
      ...safeHArrow({
        id: `${p2.id}-cmp2`,
        fromId: p2.id,
        toId: s0.id,
        fromRight: xLeft + wCol,
        toLeft: xRight,
        midY: yRow2 + hRow / 2,
        caption: bp.edges.e2,
        stroke: CHALK.api,
      }),
      safeBox({ id: s0.id, x: xRight, y: yRow2, w: wCol, h: hRow, label: s0.label, ...toneColors(s0.tone) }),
      safeBox({ id: s1.id, x: xDet, y: yRow1, w: 320, h: hRow, label: s1.label, ...toneColors(s1.tone) }),
      sticky({
        id: bp.stickyNote.id,
        x: xDet,
        y: yRow2,
        w: 320,
        h: hRow,
        label: bp.stickyNote.label,
      }),
      safeNote(40, yRow2 + hRow + 28, 'Hover any box → exact VAD / protection / signature fields + plain explanation.', CHALK.muted)
    );
  } else if (bp.topology === 'persistence-triad') {
    const y1 = 88;
    const h1 = 152;
    const y2 = 340;
    const h2 = 152;
    const xL = 40;
    const wBox = 340;
    const xR = xL + wBox + ARROW_GAP + 30;
    const xS = xR + wBox + 50;

    skeletons.push(
      safeBox({ id: p0.id, x: xL, y: y1, w: wBox, h: h1, label: p0.label, ...toneColors(p0.tone) }),
      ...safeHArrow({
        id: `${p0.id}-a1`,
        fromId: p0.id,
        toId: p1.id,
        fromRight: xL + wBox,
        toLeft: xR,
        midY: y1 + h1 / 2,
        caption: bp.edges.e1,
        stroke: CHALK.api,
      }),
      safeBox({ id: p1.id, x: xR, y: y1, w: wBox, h: h1, label: p1.label, ...toneColors(p1.tone) }),
      sticky({
        id: bp.stickyNote.id,
        x: xS,
        y: y1,
        w: 280,
        h: h1,
        label: bp.stickyNote.label,
      }),
      ...safeVArrow({
        id: `${p0.id}-v1`,
        fromId: p0.id,
        toId: p2.id,
        midX: xL + wBox / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: bp.edges.e2,
        stroke: CHALK.attacker,
      }),
      ...safeVArrow({
        id: `${p1.id}-v2`,
        fromId: p1.id,
        toId: s0.id,
        midX: xR + wBox / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: bp.edges.e3,
        stroke: CHALK.ok,
      }),
      safeBox({ id: p2.id, x: xL, y: y2, w: wBox, h: h2, label: p2.label, ...toneColors(p2.tone) }),
      ...safeHArrow({
        id: `${p2.id}-a3`,
        fromId: p2.id,
        toId: s0.id,
        fromRight: xL + wBox,
        toLeft: xR,
        midY: y2 + h2 / 2,
        caption: bp.edges.e4 ?? 'Executes / Logs',
        stroke: CHALK.warn,
      }),
      safeBox({ id: s0.id, x: xR, y: y2, w: wBox, h: h2, label: s0.label, ...toneColors(s0.tone) }),
      safeBox({ id: s1.id, x: xS, y: y2, w: 330, h: h2, label: s1.label, ...toneColors(s1.tone) }),
      safeNote(40, y2 + h2 + 26, 'Hover any chalk box → registry / trigger / EID fields + plain "What this means".', CHALK.muted)
    );
  } else if (bp.topology === 'supplychain-branch') {
    const y1 = 92;
    const h1 = 152;
    const y2 = 342;
    const h2 = 152;
    const x0 = 40;
    const w0 = 320;
    const x1 = x0 + w0 + ARROW_GAP + 20;
    const w1 = 330;
    const x2 = x1 + w1 + ARROW_GAP + 20;
    const w2 = 330;

    skeletons.push(
      safeBox({ id: p0.id, x: x0, y: y1, w: w0, h: h1, label: p0.label, ...toneColors(p0.tone) }),
      ...safeHArrow({
        id: `${p0.id}-a1`,
        fromId: p0.id,
        toId: p1.id,
        fromRight: x0 + w0,
        toLeft: x1,
        midY: y1 + h1 / 2,
        caption: bp.edges.e1,
        stroke: CHALK.api,
      }),
      safeBox({ id: p1.id, x: x1, y: y1, w: w1, h: h1, label: p1.label, ...toneColors(p1.tone) }),
      ...safeHArrow({
        id: `${p1.id}-a2`,
        fromId: p1.id,
        toId: p2.id,
        fromRight: x1 + w1,
        toLeft: x2,
        midY: y1 + h1 / 2,
        caption: bp.edges.e2,
        stroke: CHALK.attacker,
      }),
      safeBox({ id: p2.id, x: x2, y: y1, w: w2, h: h1, label: p2.label, ...toneColors(p2.tone) }),
      ...safeVArrow({
        id: `${p2.id}-v1`,
        fromId: p2.id,
        toId: s0.id,
        midX: x2 + w2 / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: bp.edges.e3,
        stroke: CHALK.attacker,
        captionOffsetX: 16,
      }),
      sticky({
        id: bp.stickyNote.id,
        x: x0,
        y: y2,
        w: w0,
        h: h2,
        label: bp.stickyNote.label,
      }),
      safeBox({ id: s1.id, x: x1, y: y2, w: w1, h: h2, label: s1.label, ...toneColors(s1.tone) }),
      safeBox({ id: s0.id, x: x2, y: y2, w: w2, h: h2, label: s0.label, ...toneColors(s0.tone) }),
      safeNote(40, y2 + h2 + 26, 'Hover any chalk box → DLL / binary / loader card + plain "What this means".', CHALK.muted)
    );
  } else if (bp.topology === 'forensic-timeline') {
    const yA = 96;
    const hA = 150;
    const yB = 328;
    const hB = 150;
    const x0 = 40;
    const w0 = 330;
    const x1 = x0 + w0 + ARROW_GAP + 20;
    const w1 = 330;
    const x2 = x1 + w1 + ARROW_GAP + 20;
    const w2 = 330;

    skeletons.push(
      safeCaption('track-a', 40, 64, bp.zoneHeaders?.[0] ?? 'ATTACKER SURFACE / OBSERVED ARTIFACT', CHALK.attacker),
      safeCaption('track-b', 40, 294, bp.zoneHeaders?.[1] ?? 'CORROBORATING OS LEDGER / DFIR VERDICT', CHALK.ok),
      safeBox({ id: p0.id, x: x0, y: yA, w: w0, h: hA, label: p0.label, ...toneColors(p0.tone) }),
      ...safeHArrow({
        id: `${p0.id}-t1`,
        fromId: p0.id,
        toId: p1.id,
        fromRight: x0 + w0,
        toLeft: x1,
        midY: yA + hA / 2,
        caption: bp.edges.e1,
        stroke: CHALK.attacker,
      }),
      safeBox({ id: p1.id, x: x1, y: yA, w: w1, h: hA, label: p1.label, ...toneColors(p1.tone) }),
      sticky({
        id: bp.stickyNote.id,
        x: x2,
        y: yA,
        w: w2,
        h: hA,
        label: bp.stickyNote.label,
      }),
      safeBox({ id: p2.id, x: x0, y: yB, w: w0, h: hB, label: p2.label, ...toneColors(p2.tone) }),
      ...safeHArrow({
        id: `${p2.id}-t2`,
        fromId: p2.id,
        toId: s0.id,
        fromRight: x0 + w0,
        toLeft: x1,
        midY: yB + hB / 2,
        caption: bp.edges.e2,
        stroke: CHALK.trusted,
      }),
      safeBox({ id: s0.id, x: x1, y: yB, w: w1, h: hB, label: s0.label, ...toneColors(s0.tone) }),
      ...safeHArrow({
        id: `${s0.id}-t3`,
        fromId: s0.id,
        toId: s1.id,
        fromRight: x1 + w1,
        toLeft: x2,
        midY: yB + hB / 2,
        caption: bp.edges.e3,
        stroke: CHALK.ok,
      }),
      safeBox({ id: s1.id, x: x2, y: yB, w: w2, h: hB, label: s1.label, ...toneColors(s1.tone) }),
      safeNote(40, yB + hB + 26, 'Hover any chalk box → forensic artifact fields + plain "What this means".', CHALK.muted)
    );
  } else {
    // 'pipeline-flow': Canonical 3-node top chain + sticky NOTE + lower artifact/detection strip
    const y1 = 88;
    const h1 = 152;
    const y2 = 342;
    const h2 = 150;
    const x0 = 40;
    const w0 = 320;
    const x1 = x0 + w0 + ARROW_GAP + 20;
    const w1 = 330;
    const x2 = x1 + w1 + ARROW_GAP + 20;
    const w2 = 330;

    skeletons.push(
      safeBox({ id: p0.id, x: x0, y: y1, w: w0, h: h1, label: p0.label, ...toneColors(p0.tone) }),
      ...safeHArrow({
        id: `${p0.id}-p1`,
        fromId: p0.id,
        toId: p1.id,
        fromRight: x0 + w0,
        toLeft: x1,
        midY: y1 + h1 / 2,
        caption: bp.edges.e1,
        stroke: CHALK.api,
      }),
      safeBox({ id: p1.id, x: x1, y: y1, w: w1, h: h1, label: p1.label, ...toneColors(p1.tone) }),
      ...safeHArrow({
        id: `${p1.id}-p2`,
        fromId: p1.id,
        toId: p2.id,
        fromRight: x1 + w1,
        toLeft: x2,
        midY: y1 + h1 / 2,
        caption: bp.edges.e2,
        stroke: CHALK.attacker,
      }),
      safeBox({ id: p2.id, x: x2, y: y1, w: w2, h: h1, label: p2.label, ...toneColors(p2.tone) }),
      sticky({
        id: bp.stickyNote.id,
        x: x2 + w2 + 40,
        y: y1,
        w: 270,
        h: h1,
        label: bp.stickyNote.label,
      }),
      ...safeVArrow({
        id: `${p1.id}-pv`,
        fromId: p1.id,
        toId: s1.id,
        midX: x1 + w1 / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: bp.edges.e3,
        stroke: CHALK.ink,
      }),
      safeBox({ id: s0.id, x: x0, y: y2, w: 360, h: h2, label: s0.label, ...toneColors(s0.tone) }),
      safeBox({ id: s1.id, x: x1, y: y2, w: 360, h: h2, label: s1.label, ...toneColors(s1.tone) }),
      ...(s2
        ? [safeBox({ id: s2.id, x: x2, y: y2, w: 340, h: h2, label: s2.label, ...toneColors(s2.tone) })]
        : []),
      safeNote(40, y2 + h2 + 26, 'Hover a box → software card + plain "What this means".', CHALK.muted)
    );
  }

  return {
    scenarioId: bp.scenarioId,
    sectionKey: bp.sectionKey,
    boardBadge: bp.boardBadge,
    title: bp.title,
    subtitle: bp.subtitle,
    chalkHint:
      'Hover boxes for chalk Excalidraw cards: technical structure on top, plain "What this means" below.',
    skeletons,
    tooltips,
  };
}
