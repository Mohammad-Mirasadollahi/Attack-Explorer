'use client';

import { useEffect, type RefObject } from 'react';

const DEFAULT_CLICK_PX = 6;
const DEFAULT_DOUBLE_CLICK_MS = 280;

/**
 * Shared Three.js canvas interaction:
 * - tap/click (without orbit-drag) toggles Pause / Resume
 * - double-click toggles full-page mode
 * Dragging OrbitControls does not toggle playback or fullscreen.
 */
export function useCanvasPlayToggle(
  canvasMountRef: RefObject<HTMLElement | null>,
  onTogglePlay: () => void,
  onToggleFullPage?: () => void,
  clickThresholdPx: number = DEFAULT_CLICK_PX
): void {
  useEffect(() => {
    const el = canvasMountRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let dragged = false;
    let active = false;
    let clickTimer: ReturnType<typeof setTimeout> | null = null;

    const clearClickTimer = () => {
      if (clickTimer !== null) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      active = true;
      startX = e.clientX;
      startY = e.clientY;
      dragged = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active) return;
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > clickThresholdPx) {
        dragged = true;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.button !== 0 || !active) return;
      active = false;
      if (dragged) return;
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > clickThresholdPx) {
        return;
      }
      // Defer play toggle so a double-click can cancel it and go fullscreen instead.
      clearClickTimer();
      clickTimer = setTimeout(() => {
        clickTimer = null;
        onTogglePlay();
      }, onToggleFullPage ? DEFAULT_DOUBLE_CLICK_MS : 0);
    };

    const onPointerCancel = () => {
      active = false;
      dragged = false;
    };

    const onDblClick = (e: MouseEvent) => {
      if (!onToggleFullPage) return;
      e.preventDefault();
      clearClickTimer();
      onToggleFullPage();
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerCancel);
    el.addEventListener('dblclick', onDblClick);
    return () => {
      clearClickTimer();
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerCancel);
      el.removeEventListener('dblclick', onDblClick);
    };
  }, [canvasMountRef, onTogglePlay, onToggleFullPage, clickThresholdPx]);
}
