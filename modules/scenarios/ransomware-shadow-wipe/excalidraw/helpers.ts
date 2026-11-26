import { BOARD_FONT, BOARD_ROUGHNESS, BOARD_STROKE, VAULT_CHALK } from './chalk';
import type { TechnicalBoardSkeleton } from '@/lib/section-excalidraw-registry';

export const ARROW_GAP = 155;

export function box(opts: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  stroke: string;
  fill: string;
  fontSize?: number;
}): TechnicalBoardSkeleton {
  return {
    type: 'rectangle',
    id: opts.id,
    x: opts.x,
    y: opts.y,
    width: opts.w,
    height: opts.h,
    strokeColor: opts.stroke,
    backgroundColor: opts.fill,
    fillStyle: 'hachure',
    strokeWidth: BOARD_STROKE,
    roughness: BOARD_ROUGHNESS,
    label: {
      text: opts.label,
      fontSize: opts.fontSize ?? 15,
      textAlign: 'center',
    },
  };
}

export function title(x: number, y: number, text: string): TechnicalBoardSkeleton {
  return {
    type: 'text',
    id: `lb-title-${text.slice(0, 14).replace(/\s+/g, '-')}`,
    x,
    y,
    text,
    fontSize: 24,
    fontFamily: BOARD_FONT,
    strokeColor: VAULT_CHALK.ink,
  };
}

export function note(
  x: number,
  y: number,
  text: string,
  color: string = VAULT_CHALK.smb
): TechnicalBoardSkeleton {
  return {
    type: 'text',
    id: `lb-note-${x}-${y}`,
    x,
    y,
    text,
    fontSize: 14,
    fontFamily: BOARD_FONT,
    strokeColor: color,
  };
}

export function caption(
  id: string,
  x: number,
  y: number,
  text: string,
  color: string = VAULT_CHALK.siem
): TechnicalBoardSkeleton {
  return {
    type: 'text',
    id,
    x,
    y,
    text,
    fontSize: 14,
    fontFamily: BOARD_FONT,
    strokeColor: color,
  };
}

export function sticky(opts: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}): TechnicalBoardSkeleton {
  return box({
    ...opts,
    stroke: VAULT_CHALK.smb,
    fill: VAULT_CHALK.smbFill,
    fontSize: 13.5,
  });
}

export function arrow(opts: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  stroke?: string;
  startId?: string;
  endId?: string;
  points?: [number, number][];
}): TechnicalBoardSkeleton {
  return {
    type: 'arrow',
    id: opts.id,
    x: opts.x,
    y: opts.y,
    width: opts.w,
    height: opts.h,
    ...(opts.points ? { points: opts.points } : {}),
    strokeColor: opts.stroke ?? VAULT_CHALK.ink,
    strokeWidth: BOARD_STROKE + 0.5,
    roughness: BOARD_ROUGHNESS,
    start: opts.startId ? { id: opts.startId } : undefined,
    end: opts.endId ? { id: opts.endId } : undefined,
  };
}

export function hArrow(opts: {
  id: string;
  fromId: string;
  toId: string;
  fromRight: number;
  toLeft: number;
  midY: number;
  caption: string;
  stroke?: string;
}): TechnicalBoardSkeleton[] {
  const gap = opts.toLeft - opts.fromRight;
  const stroke = opts.stroke ?? VAULT_CHALK.siem;
  const pad = 10;
  const len = Math.max(ARROW_GAP - pad * 2, gap - pad * 2);
  const estW = Math.min(gap - 12, Math.ceil(opts.caption.length * 7.8));
  const capX = opts.fromRight + Math.max(6, (gap - estW) / 2);
  return [
    caption(`${opts.id}-cap`, capX, opts.midY - 30, opts.caption, stroke),
    arrow({
      id: opts.id,
      x: opts.fromRight + pad,
      y: opts.midY,
      w: len,
      h: 0,
      points: [
        [0, 0],
        [len, 0],
      ],
      stroke,
      startId: opts.fromId,
      endId: opts.toId,
    }),
  ];
}

export function hArrowLeft(opts: {
  id: string;
  fromId: string;
  toId: string;
  fromLeft: number;
  toRight: number;
  midY: number;
  caption: string;
  stroke?: string;
}): TechnicalBoardSkeleton[] {
  const gap = opts.fromLeft - opts.toRight;
  const stroke = opts.stroke ?? VAULT_CHALK.siem;
  const pad = 10;
  const len = Math.max(ARROW_GAP - pad * 2, gap - pad * 2);
  const estW = Math.min(gap - 12, Math.ceil(opts.caption.length * 7.8));
  const capX = opts.toRight + Math.max(6, (gap - estW) / 2);
  return [
    caption(`${opts.id}-cap`, capX, opts.midY - 30, opts.caption, stroke),
    arrow({
      id: opts.id,
      x: opts.fromLeft - pad,
      y: opts.midY,
      w: -len,
      h: 0,
      points: [
        [0, 0],
        [-len, 0],
      ],
      stroke,
      startId: opts.fromId,
      endId: opts.toId,
    }),
  ];
}

export function vArrow(opts: {
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
  const gap = opts.toTop - opts.fromBottom;
  const stroke = opts.stroke ?? VAULT_CHALK.siem;
  const pad = 8;
  const len = Math.max(44, gap - pad * 2);
  return [
    caption(
      `${opts.id}-cap`,
      opts.midX + (opts.captionOffsetX ?? 14),
      opts.fromBottom + Math.max(4, gap / 2 - 10),
      opts.caption,
      stroke
    ),
    arrow({
      id: opts.id,
      x: opts.midX,
      y: opts.fromBottom + pad,
      w: 0,
      h: len,
      points: [
        [0, 0],
        [0, len],
      ],
      stroke,
      startId: opts.fromId,
      endId: opts.toId,
    }),
  ];
}
