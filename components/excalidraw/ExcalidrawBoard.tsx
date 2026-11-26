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
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
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
const FIT_VIEWPORT_FACTOR = 0.92;
const MIN_ZOOM = 0.35;
const MAX_ZOOM = 3.2;
const ZOOM_STEP = 1.18;

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

interface PanState {
  lastX: number;
  lastY: number;
}

/**
 * Static Excalidraw whiteboard. Every drawn shape stays visible.
 * Hover an annotated rectangle → delayed chalk tooltip (scroll + select + copy).
 * Wheel zooms the chalk surface (page scroll blocked); left-drag pans the view.
 */
export default function ExcalidrawBoard({
  skeletons,
  tooltips,
  className = '',
}: ExcalidrawBoardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hoverLayerRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const fitTimersRef = useRef<number[]>([]);
  const pendingRef = useRef<HoverState | null>(null);
  const overTooltipRef = useRef(false);
  const activeIdRef = useRef<string | null>(null);
  const panRef = useRef<PanState | null>(null);

  const [hover, setHover] = useState<HoverState | null>(null);
  const [zoomLabel, setZoomLabel] = useState('100%');
  const [isPanning, setIsPanning] = useState(false);

  const sceneKey = useMemo(
    () =>
      skeletons
        .map((s) => `${s.id ?? ''}:${s.x ?? 0}:${s.y ?? 0}:${s.width ?? 0}`)
        .join('|'),
    [skeletons]
  );

  const convertBoardElements = useCallback(() => {
    const raw = convertToExcalidrawElements(
      skeletons as Parameters<typeof convertToExcalidrawElements>[0],
      { regenerateIds: false }
    );
    const byId = new Map(raw.map((el) => [el.id, el]));
    return raw.map((el) => {
      if (el.type === 'text' && !el.containerId) {
        return {
          ...el,
          width: Math.ceil(el.width * 1.32 + 40),
        };
      }
      if (el.type === 'text' && el.containerId) {
        const parent = byId.get(el.containerId);
        if (parent && parent.width > 24) {
          const maxInnerW = Math.max(el.width, Math.floor(parent.width - 14));
          const widened = Math.min(maxInnerW, Math.ceil(el.width * 1.32 + 24));
          return {
            ...el,
            width: widened,
            x: parent.x + (parent.width - widened) / 2,
          };
        }
      }
      return el;
    });
  }, [skeletons]);

  const initialData = useMemo<ExcalidrawInitialDataState>(() => {
    const elements = convertBoardElements();
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
  }, [convertBoardElements]);

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

  const syncZoomLabel = useCallback((api?: ExcalidrawImperativeAPI | null) => {
    const target = api ?? apiRef.current;
    if (!target) return;
    const value = target.getAppState().zoom?.value ?? 1;
    setZoomLabel(`${Math.round(value * 100)}%`);
  }, []);

  const fitBoard = useCallback(
    (api?: ExcalidrawImperativeAPI | null) => {
      const target = api ?? apiRef.current;
      if (!target) return;
      const elements = target.getSceneElements().filter((el) => !el.isDeleted);
      if (!elements.length) return;
      target.scrollToContent(elements, {
        fitToViewport: true,
        animate: false,
        viewportZoomFactor: FIT_VIEWPORT_FACTOR,
      });
      syncZoomLabel(target);
    },
    [syncZoomLabel]
  );

  const setZoom = useCallback(
    (
      nextValue: number,
      anchor?: { clientX: number; clientY: number; overlay: HTMLElement }
    ) => {
      const api = apiRef.current;
      if (!api) return;
      const appState = api.getAppState();
      const prevZoom = appState.zoom?.value ?? 1;
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextValue));
      if (zoom === prevZoom) {
        syncZoomLabel(api);
        return;
      }

      let scrollX = appState.scrollX;
      let scrollY = appState.scrollY;
      if (anchor) {
        const rect = anchor.overlay.getBoundingClientRect();
        const mx = anchor.clientX - rect.left;
        const my = anchor.clientY - rect.top;
        // Keep the scene point under the cursor fixed while zooming.
        scrollX = scrollX + mx * (1 / zoom - 1 / prevZoom);
        scrollY = scrollY + my * (1 / zoom - 1 / prevZoom);
      }

      api.updateScene({
        appState: {
          zoom: { value: zoom as typeof appState.zoom.value },
          scrollX,
          scrollY,
        },
      });
      syncZoomLabel(api);
    },
    [syncZoomLabel]
  );

  const zoomBy = useCallback(
    (
      factor: number,
      anchor?: { clientX: number; clientY: number; overlay: HTMLElement }
    ) => {
      const api = apiRef.current;
      if (!api) return;
      const current = api.getAppState().zoom?.value ?? 1;
      setZoom(current * factor, anchor);
    },
    [setZoom]
  );

  const panBy = useCallback((dx: number, dy: number) => {
    const api = apiRef.current;
    if (!api) return;
    const appState = api.getAppState();
    const zoom = appState.zoom?.value ?? 1;
    api.updateScene({
      appState: {
        scrollX: appState.scrollX + dx / zoom,
        scrollY: appState.scrollY + dy / zoom,
      },
    });
  }, []);

  const endPan = useCallback(() => {
    if (!panRef.current) return;
    panRef.current = null;
    setIsPanning(false);
  }, []);

  const scheduleFits = useCallback(
    (api: ExcalidrawImperativeAPI) => {
      clearFitTimers();
      fitBoard(api);
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

  // Scoped to this board only: outside the board, the page keeps normal scroll.
  // React's onWheel is often passive, so use a native non-passive listener.
  useEffect(() => {
    const root = rootRef.current;
    const layer = hoverLayerRef.current;
    if (!root || !layer) return;

    const onWheel = (event: WheelEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('.board-excalidraw-tooltip')
      ) {
        // Let the chalk tooltip scroll its own text; do not zoom / steal the wheel.
        return;
      }

      // Pointer is on the whiteboard surface (or zoom chrome) → zoom only.
      event.preventDefault();
      event.stopPropagation();
      const factor = event.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;
      zoomBy(factor, {
        clientX: event.clientX,
        clientY: event.clientY,
        overlay: layer,
      });
    };

    root.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => root.removeEventListener('wheel', onWheel, true);
  }, [zoomBy, sceneKey]);

  useEffect(() => {
    if (!isPanning) return;

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    const onWindowMove = (event: MouseEvent) => {
      const pan = panRef.current;
      if (!pan) return;
      const dx = event.clientX - pan.lastX;
      const dy = event.clientY - pan.lastY;
      pan.lastX = event.clientX;
      pan.lastY = event.clientY;
      if (dx !== 0 || dy !== 0) panBy(dx, dy);
    };

    const onWindowUp = () => endPan();

    window.addEventListener('mousemove', onWindowMove);
    window.addEventListener('mouseup', onWindowUp);
    window.addEventListener('blur', onWindowUp);
    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener('mousemove', onWindowMove);
      window.removeEventListener('mouseup', onWindowUp);
      window.removeEventListener('blur', onWindowUp);
    };
  }, [endPan, isPanning, panBy]);

  const lockFrame = useCallback(
    (api: ExcalidrawImperativeAPI) => {
      apiRef.current = api;
      scheduleFits(api);
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        void document.fonts.ready.then(() => {
          if (apiRef.current !== api) return;
          const remeasured = convertBoardElements();
          api.updateScene({ elements: remeasured });
          requestAnimationFrame(() => fitBoard(api));
        });
      }
    },
    [convertBoardElements, fitBoard, scheduleFits]
  );

  const clampPosition = useCallback(
    (x: number, y: number, overlay: HTMLElement): { x: number; y: number } => {
      // BoardTooltipCard self-clamps after measure; keep cursor coords in-bounds
      // so the card has a sensible anchor when it opens.
      const rect = overlay.getBoundingClientRect();
      const pad = 8;
      return {
        x: Math.min(Math.max(pad, x), Math.max(pad, rect.width - pad)),
        y: Math.min(Math.max(pad, y), Math.max(pad, rect.height - pad)),
      };
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

  const onOverlayPointerDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    clearShowTimer();
    pendingRef.current = null;
    activeIdRef.current = null;
    setHover(null);
    panRef.current = { lastX: event.clientX, lastY: event.clientY };
    setIsPanning(true);
  };

  const onOverlayMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (panRef.current) return;
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
    if (panRef.current) return;
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

      {/* Captures hover, wheel zoom, and left-drag pan without Excalidraw chrome. */}
      <div
        ref={hoverLayerRef}
        className={`board-hover-layer absolute inset-0 z-10 ${
          isPanning ? 'is-panning' : ''
        }`}
        data-testid="excalidraw-board-hover-layer"
        onMouseDown={onOverlayPointerDown}
        onMouseMove={onOverlayMove}
        onMouseLeave={onOverlayLeave}
        aria-hidden="true"
      />

      <div
        className="absolute bottom-3 right-3 z-20 flex items-center gap-1 rounded-lg border border-slate-800/80 bg-[#FDFBF7]/95 p-1 shadow-[2px_2px_0_#0f172a]"
        data-testid="excalidraw-board-zoom-controls"
      >
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 hover:bg-slate-200/80"
          aria-label="Zoom out whiteboard"
          data-testid="excalidraw-board-zoom-out"
          onClick={() => zoomBy(1 / ZOOM_STEP)}
        >
          <ZoomOut className="h-4 w-4" aria-hidden="true" />
        </button>
        <span
          className="min-w-[3.25rem] px-1 text-center font-mono text-[11px] font-bold text-slate-800"
          data-testid="excalidraw-board-zoom-label"
        >
          {zoomLabel}
        </span>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 hover:bg-slate-200/80"
          aria-label="Zoom in whiteboard"
          data-testid="excalidraw-board-zoom-in"
          onClick={() => zoomBy(ZOOM_STEP)}
        >
          <ZoomIn className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 hover:bg-slate-200/80"
          aria-label="Fit whiteboard to view"
          data-testid="excalidraw-board-zoom-fit"
          onClick={() => fitBoard()}
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

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
