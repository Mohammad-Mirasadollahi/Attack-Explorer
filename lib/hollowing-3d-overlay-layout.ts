export interface ScreenPoint {
  x: number;
  y: number;
  visible: boolean;
}

export interface CalloutLayoutInput {
  viewportWidth: number;
  viewportHeight: number;
  bankTruck: ScreenPoint;
  hiddenIntruder: ScreenPoint;
}

export interface PositionedCallout {
  x: number;
  y: number;
  visible: boolean;
  clamped: boolean;
}

export interface FloatingCalloutLayout {
  bankTruck: PositionedCallout;
  hiddenIntruder: PositionedCallout;
}

const CALLOUT_HALF_WIDTH = 94;
const CALLOUT_HEIGHT = 50;
const EDGE_MARGIN_X = 18;
const EDGE_MARGIN_TOP = 64;
const BOTTOM_DOCK_RESERVE = 150;
const CAPTION_SAFE_RIGHT = 398;
const CAPTION_SAFE_BOTTOM = 190;
const TOP_RIGHT_ACTIONS_LEFT_OFFSET = 278;
const TOP_RIGHT_ACTIONS_BOTTOM = 74;

function clampSingleCallout(
  pt: ScreenPoint,
  viewportWidth: number,
  viewportHeight: number
): PositionedCallout {
  if (!pt.visible || viewportWidth <= 0 || viewportHeight <= 0) {
    return { x: pt.x, y: pt.y, visible: false, clamped: false };
  }

  const minX = EDGE_MARGIN_X + CALLOUT_HALF_WIDTH;
  const maxX = Math.max(minX, viewportWidth - EDGE_MARGIN_X - CALLOUT_HALF_WIDTH);
  const minY = EDGE_MARGIN_TOP;
  const maxY = Math.max(minY, viewportHeight - BOTTOM_DOCK_RESERVE);

  let x = Math.min(maxX, Math.max(minX, pt.x));
  let y = Math.min(maxY, Math.max(minY, pt.y));

  // Avoid overlapping the Top-Left Storyboard Caption card
  if (
    viewportWidth >= 560 &&
    x - CALLOUT_HALF_WIDTH < CAPTION_SAFE_RIGHT &&
    y - CALLOUT_HEIGHT < CAPTION_SAFE_BOTTOM
  ) {
    const pushRightX = CAPTION_SAFE_RIGHT + CALLOUT_HALF_WIDTH + 10;
    const pushDownY = CAPTION_SAFE_BOTTOM + CALLOUT_HEIGHT + 8;
    const dx = Math.abs(pushRightX - x);
    const dy = Math.abs(pushDownY - y);
    if (dx <= dy && pushRightX <= maxX) {
      x = pushRightX;
    } else {
      y = Math.min(maxY, Math.max(y, pushDownY));
    }
  }

  // Avoid overlapping the Top-Right Cutaway / Full Page action buttons
  const actionsLeft = viewportWidth - TOP_RIGHT_ACTIONS_LEFT_OFFSET;
  if (
    viewportWidth >= 560 &&
    x + CALLOUT_HALF_WIDTH > actionsLeft &&
    y - CALLOUT_HEIGHT < TOP_RIGHT_ACTIONS_BOTTOM
  ) {
    y = Math.min(maxY, Math.max(y, TOP_RIGHT_ACTIONS_BOTTOM + CALLOUT_HEIGHT + 6));
  }

  const clamped = Math.abs(x - pt.x) > 0.5 || Math.abs(y - pt.y) > 0.5;
  return {
    x: Math.round(x),
    y: Math.round(y),
    visible: true,
    clamped,
  };
}

/**
 * Computes non-overlapping, HUD-safe screen positions for the floating
 * 'Bank Truck' and 'Hidden Intruder' 3D callout labels inside the Three.js scene.
 */
export function computeFloatingCalloutLayout(
  input: CalloutLayoutInput
): FloatingCalloutLayout {
  const { viewportWidth, viewportHeight } = input;

  const bankTruck = clampSingleCallout(
    input.bankTruck,
    viewportWidth,
    viewportHeight
  );
  const hiddenIntruder = clampSingleCallout(
    input.hiddenIntruder,
    viewportWidth,
    viewportHeight
  );

  // Separate labels cleanly if both are visible and collide (e.g., when intruder rides inside truck in Acts 4-6)
  if (bankTruck.visible && hiddenIntruder.visible) {
    const minHorizGap = CALLOUT_HALF_WIDTH * 2 + 12;
    const minVertGap = CALLOUT_HEIGHT + 14;
    const dx = bankTruck.x - hiddenIntruder.x;
    const dy = bankTruck.y - hiddenIntruder.y;

    if (Math.abs(dx) < minHorizGap && Math.abs(dy) < minVertGap) {
      const minX = EDGE_MARGIN_X + CALLOUT_HALF_WIDTH;
      const maxX = Math.max(minX, viewportWidth - EDGE_MARGIN_X - CALLOUT_HALF_WIDTH);
      const minY = EDGE_MARGIN_TOP;
      const maxY = Math.max(minY, viewportHeight - BOTTOM_DOCK_RESERVE);

      // Prefer elevating 'Bank Truck' slightly above/right (toward cab) and keeping 'Hidden Intruder' lower-left (cargo bay)
      const desiredTruckX = Math.min(maxX, bankTruck.x + 58);
      const desiredIntruderX = Math.max(minX, hiddenIntruder.x - 58);

      if (Math.abs(desiredTruckX - desiredIntruderX) >= minHorizGap * 0.92) {
        bankTruck.x = Math.round(desiredTruckX);
        hiddenIntruder.x = Math.round(desiredIntruderX);
        bankTruck.clamped = true;
        hiddenIntruder.clamped = true;
      } else {
        // Fallback: vertical stack separation
        const midY = (bankTruck.y + hiddenIntruder.y) * 0.5;
        bankTruck.y = Math.round(Math.max(minY, midY - minVertGap * 0.52));
        hiddenIntruder.y = Math.round(
          Math.min(maxY, bankTruck.y + minVertGap)
        );
        bankTruck.clamped = true;
        hiddenIntruder.clamped = true;
      }
    }
  }

  return { bankTruck, hiddenIntruder };
}
