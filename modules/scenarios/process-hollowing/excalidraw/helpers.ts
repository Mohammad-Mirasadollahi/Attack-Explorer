import { BOARD_FONT, BOARD_ROUGHNESS, BOARD_STROKE, CHALK } from './chalk';
import type { TechnicalBoardSkeleton } from './types';

/** Minimum clear gap between boxes so arrow strokes stay readable. */
export const ARROW_GAP = 150;

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
      fontSize: opts.fontSize ?? 17,
      textAlign: 'center',
    },
  };
}

export function title(
  x: number,
  y: number,
  text: string
): TechnicalBoardSkeleton {
  return {
    type: 'text',
    id: `title-${text.slice(0, 12)}`,
    x,
    y,
    text,
    fontSize: 26,
    fontFamily: BOARD_FONT,
    strokeColor: CHALK.ink,
  };
}

export function note(
  x: number,
  y: number,
  text: string,
  color: string = CHALK.note
): TechnicalBoardSkeleton {
  return {
    type: 'text',
    id: `note-${x}-${y}`,
    x,
    y,
    text,
    fontSize: 15,
    fontFamily: BOARD_FONT,
    strokeColor: color,
  };
}

/**
 * Free-floating caption above/beside an arrow so the stroke stays visible.
 * Never put labels on the arrow itself — they sit on the line and hide it.
 */
export function caption(
  id: string,
  x: number,
  y: number,
  text: string,
  color: string = CHALK.api
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

/** Sticky teaching note on the board surface. */
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
    stroke: CHALK.note,
    fill: CHALK.noteFill,
    fontSize: 14,
  });
}

/** Bare connector — captions must be separate via `caption()` / `hArrow`. */
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
    strokeColor: opts.stroke ?? CHALK.ink,
    strokeWidth: BOARD_STROKE + 0.5,
    roughness: BOARD_ROUGHNESS,
    start: opts.startId ? { id: opts.startId } : undefined,
    end: opts.endId ? { id: opts.endId } : undefined,
  };
}

/**
 * Horizontal flow: bare arrow + caption floating above the mid-gap.
 * `fromRight` = leftBox.x + leftBox.w, `toLeft` = rightBox.x, `midY` = vertical center.
 */
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
  const stroke = opts.stroke ?? CHALK.api;
  const pad = 10;
  const capX = opts.fromRight + Math.max(12, gap / 2 - opts.caption.length * 3.2);
  return [
    caption(
      `${opts.id}-cap`,
      capX,
      opts.midY - 48,
      opts.caption,
      stroke
    ),
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

/** Vertical flow: bare arrow + caption to the side. */
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
  const stroke = opts.stroke ?? CHALK.api;
  const pad = 8;
  return [
    caption(
      `${opts.id}-cap`,
      opts.midX + (opts.captionOffsetX ?? 16),
      opts.fromBottom + Math.max(4, gap / 2 - 10),
      opts.caption,
      stroke
    ),
    arrow({
      id: opts.id,
      x: opts.midX,
      y: opts.fromBottom + pad,
      w: 0,
      h: Math.max(40, gap - pad * 2),
      stroke,
      startId: opts.fromId,
      endId: opts.toId,
    }),
  ];
}
