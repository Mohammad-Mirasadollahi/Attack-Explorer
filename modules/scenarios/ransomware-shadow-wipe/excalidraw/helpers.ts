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
      fontSize: opts.fontSize ?? 24,
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
    fontSize: 36,
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
    fontSize: 22,
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
    fontSize: 21,
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
    fontSize: 20,
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
}): TechnicalBoardSkeleton {
  return {
    type: 'arrow',
    id: opts.id,
    x: opts.x,
    y: opts.y,
    width: opts.w,
    height: opts.h,
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
  const capX = opts.fromRight + Math.max(12, gap / 2 - opts.caption.length * 3.4);
  return [
    caption(`${opts.id}-cap`, capX, opts.midY - 46, opts.caption, stroke),
    arrow({
      id: opts.id,
      x: opts.fromRight + pad,
      y: opts.midY,
      w: Math.max(ARROW_GAP - pad * 2, gap - pad * 2),
      h: 0,
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
  return [
    caption(
      `${opts.id}-cap`,
      opts.midX + (opts.captionOffsetX ?? 16),
      opts.fromBottom + Math.max(4, gap / 2 - 12),
      opts.caption,
      stroke
    ),
    arrow({
      id: opts.id,
      x: opts.midX,
      y: opts.fromBottom + pad,
      w: 0,
      h: Math.max(44, gap - pad * 2),
      stroke,
      startId: opts.fromId,
      endId: opts.toId,
    }),
  ];
}
