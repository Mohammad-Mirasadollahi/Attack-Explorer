'use client';

// Must run before @excalidraw/excalidraw registers FontFace (CDN → self-hosted).
import './excalidraw-assets';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Excalidraw,
  convertToExcalidrawElements,
} from '@excalidraw/excalidraw';
import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types';
import '@excalidraw/excalidraw/index.css';
import type {
  BoardTooltip,
  TechnicalBoardSkeleton,
} from '@/lib/section-excalidraw-registry';
import { BoardTooltipCard } from './BoardTooltipCard';

/** Delay before the chalk card appears (feels intentional, not twitchy). */
const TOOLTIP_SHOW_MS = 240;
/** Grace period to move from the box onto the card (select / scroll / copy). */
const TOOLTIP_HIDE_MS = 240;
/** Leave a little chalk margin so bottom sticky/notes are never clipped. */
const FIT_VIEWPORT_FACTOR = 0.8;

export interface ExcalidrawBoardProps {
  skeletons: TechnicalBoardSkeleton[];
  tooltips?: Record<string, BoardTooltip>;
  className?: string;
}

interface HoverState {
  id: string;
  /** Overlay-local CSS pixels — pinned when the card opens */
  x: number;
  y: number;
}

/**
 * Static Excalidraw whiteboard. Every drawn shape stays visible.
 * Hover an annotated rectangle → delayed chalk tooltip (scroll + select + copy).
 */
export default function ExcalidrawBoard({
  skeletons,
  tooltips,
  className = '',
}: ExcalidrawBoardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const fitTimersRef = useRef<number[]>([]);
  const pendingRef = useRef<HoverState | null>(null);
  const overTooltipRef = useRef(false);
  const activeIdRef = useRef<string | null>(null);

  const [hover, setHover] = useState<HoverState | null>(null);

  const sceneKey = useMemo(
    () =>
      skeletons
        .map((s) => `${s.id ?? ''}:${s.x ?? 0}:${s.y ?? 0}:${s.width ?? 0}`)
        .join('|'),
    [skeletons]
  );

  const initialData = useMemo<ExcalidrawInitialDataState>(() => {
    const elements = convertToExcalidrawElements(
      skeletons as Parameters<typeof convertToExcalidrawElements>[0],
      { regenerateIds: false }
    );
    return {
      elements,
      appState: {
        viewBackgroundColor: '#FDFBF7',
        currentItemFontFamily: 1,
        zenModeEnabled: true,
        viewModeEnabled: true,
      },
      scrollToContent: true,
    };
  }, [skeletons]);

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current != null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current != null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const clearFitTimers = useCallback(() => {
    for (const id of fitTimersRef.current) window.clearTimeout(id);
    fitTimersRef.current = [];
  }, []);

  const fitBoard = useCallback((api?: ExcalidrawImperativeAPI | null) => {
    const target = api ?? apiRef.current;
    if (!target) return;
    const elements = target.getSceneElements().filter((el) => !el.isDeleted);
    if (!elements.length) return;
    target.scrollToContent(elements, {
      fitToViewport: true,
      animate: false,
      viewportZoomFactor: FIT_VIEWPORT_FACTOR,
    });
  }, []);

  const scheduleFits = useCallback(
    (api: ExcalidrawImperativeAPI) => {
      clearFitTimers();
      fitBoard(api);
      // Layout / font metrics can settle after first paint — refit a few times.
      requestAnimationFrame(() => fitBoard(api));
      for (const ms of [60, 180, 400, 800]) {
        const id = window.setTimeout(() => fitBoard(api), ms);
        fitTimersRef.current.push(id);
      }
    },
    [clearFitTimers, fitBoard]
  );

  useEffect(
    () => () => {
      clearShowTimer();
      clearHideTimer();
      clearFitTimers();
    },
    [clearFitTimers, clearHideTimer, clearShowTimer]
  );

  // Re-fit whenever the chalk frame is resized (sidebar, responsive, font load).
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;

    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fitBoard());
    });
    observer.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [fitBoard, sceneKey]);

  const lockFrame = useCallback(
    (api: ExcalidrawImperativeAPI) => {
      apiRef.current = api;
      scheduleFits(api);
    },
    [scheduleFits]
  );

  const clampPosition = useCallback(
    (x: number, y: number, overlay: HTMLElement): { x: number; y: number } => {
      const rect = overlay.getBoundingClientRect();
      const cardW = 340;
      const cardH = 360;
      let nextX = x;
      let nextY = y;
      if (nextX + cardW + 20 > rect.width) {
        nextX = Math.max(8, rect.width - cardW - 12);
      }
      if (nextY + cardH + 20 > rect.height) {
        nextY = Math.max(8, nextY - cardH - 28);
      }
      return { x: nextX, y: nextY };
    },
    []
  );

  const hitTest = useCallback(
    (clientX: number, clientY: number, overlay: HTMLElement) => {
      const api = apiRef.current;
      if (!api || !tooltips) return null;

      const appState = api.getAppState();
      const zoom = appState.zoom.value;
      const rect = overlay.getBoundingClientRect();
      const sceneX = (clientX - rect.left) / zoom - appState.scrollX;
      const sceneY = (clientY - rect.top) / zoom - appState.scrollY;
      const pad = 4;

      const elements = api.getSceneElements();
      for (let i = elements.length - 1; i >= 0; i -= 1) {
        const el = elements[i];
        if (el.isDeleted) continue;
        if (el.type !== 'rectangle') continue;
        if (!tooltips[el.id]) continue;
        if (
          sceneX >= el.x - pad &&
          sceneX <= el.x + el.width + pad &&
          sceneY >= el.y - pad &&
          sceneY <= el.y + el.height + pad
        ) {
          return el.id;
        }
      }
      return null;
    },
    [tooltips]
  );

  const scheduleHide = useCallback(() => {
    clearShowTimer();
    pendingRef.current = null;
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      if (overTooltipRef.current) return;
      activeIdRef.current = null;
      setHover(null);
    }, TOOLTIP_HIDE_MS);
  }, [clearHideTimer, clearShowTimer]);

  const scheduleShow = useCallback(
    (state: HoverState) => {
      clearHideTimer();

      if (activeIdRef.current === state.id && hover) {
        return;
      }

      if (
        pendingRef.current?.id === state.id &&
        showTimerRef.current != null
      ) {
        return;
      }

      pendingRef.current = state;
      clearShowTimer();
      showTimerRef.current = window.setTimeout(() => {
        const next = pendingRef.current;
        if (!next) return;
        activeIdRef.current = next.id;
        setHover(next);
        showTimerRef.current = null;
      }, TOOLTIP_SHOW_MS);
    },
    [clearHideTimer, clearShowTimer, hover]
  );

  const onOverlayMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!tooltips) return;
    const id = hitTest(event.clientX, event.clientY, event.currentTarget);
    if (!id) {
      if (!overTooltipRef.current) scheduleHide();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;
    const { x, y } = clampPosition(rawX, rawY, event.currentTarget);
    scheduleShow({ id, x, y });
  };

  const onOverlayLeave = () => {
    if (!overTooltipRef.current) scheduleHide();
  };

  const onTooltipEnter = () => {
    overTooltipRef.current = true;
    clearHideTimer();
  };

  const onTooltipLeave = () => {
    overTooltipRef.current = false;
    scheduleHide();
  };

  const activeTooltip =
    hover && tooltips ? tooltips[hover.id] ?? null : null;

  return (
    <div
      ref={rootRef}
      className={`technical-excalidraw-board relative h-full w-full ${className}`}
      data-testid="excalidraw-technical-board-canvas"
    >
      {/* Remount when the board scene changes so initialData + fit always apply. */}
      <Excalidraw
        key={sceneKey}
        initialData={initialData}
        viewModeEnabled
        zenModeEnabled
        theme="light"
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: false,
            clearCanvas: false,
            export: false,
            loadScene: false,
            saveToActiveFile: false,
            toggleTheme: false,
            saveAsImage: false,
          },
          welcomeScreen: false,
        }}
        excalidrawAPI={lockFrame}
      />

      {tooltips ? (
        <div
          className="board-hover-layer absolute inset-0 z-10"
          data-testid="excalidraw-board-hover-layer"
          onMouseMove={onOverlayMove}
          onMouseLeave={onOverlayLeave}
          aria-hidden="true"
        />
      ) : null}

      {hover && activeTooltip ? (
        <BoardTooltipCard
          tooltip={activeTooltip}
          x={hover.x}
          y={hover.y}
          onMouseEnter={onTooltipEnter}
          onMouseLeave={onTooltipLeave}
        />
      ) : null}
    </div>
  );
}
