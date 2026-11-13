'use client';

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';
import {
  MAX_CANVAS_ZOOM,
  MIN_CANVAS_ZOOM,
  Point2D,
} from '@/lib/canvas-interaction-engine';

export interface CanvasControllerHandle {
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  resetTransform: () => void;
  setTransform: (x: number, y: number, scale: number) => void;
}

export interface CanvasControllerProps {
  children: React.ReactNode;
  /** Whether empty-space click-and-drag pans the workspace (default: true) */
  panningEnabled?: boolean;
  /** Whether mouse-wheel zooming is enabled (default: true) */
  wheelZoomEnabled?: boolean;
  /** Initial zoom scale */
  initialScale?: number;
  /** Callback fired whenever zoom scale or pan position changes */
  onTransformChange?: (state: {
    scale: number;
    positionX: number;
    positionY: number;
  }) => void;
  onPanningStart?: () => void;
  onPanningStop?: (panOffset: Point2D) => void;
  className?: string;
}

/**
 * CanvasController wraps the AttackExplorerWorkbench diagram workspace with
 * `react-zoom-pan-pinch` to provide smooth mouse-wheel zooming and click-and-drag
 * workspace panning while excluding interactive sub-components (nodes, draggable
 * network zones, checkboxes, and HUD controls) so their own drag/click events
 * work without conflict.
 */
export const CanvasController = forwardRef<
  CanvasControllerHandle,
  CanvasControllerProps
>(function CanvasController(
  {
    children,
    panningEnabled = true,
    wheelZoomEnabled = true,
    initialScale = 1,
    onTransformChange,
    onPanningStart,
    onPanningStop,
    className = '',
  },
  ref
) {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const handleZoomIn = useCallback((step = 0.15) => {
    if (transformRef.current) {
      transformRef.current.zoomIn(step, 180, 'easeOut');
    }
  }, []);

  const handleZoomOut = useCallback((step = 0.15) => {
    if (transformRef.current) {
      transformRef.current.zoomOut(step, 180, 'easeOut');
    }
  }, []);

  const handleReset = useCallback(() => {
    if (transformRef.current) {
      transformRef.current.resetTransform(220, 'easeOut');
    }
  }, []);

  const handleSetTransform = useCallback(
    (x: number, y: number, scale: number) => {
      if (transformRef.current) {
        transformRef.current.setTransform(x, y, scale, 220, 'easeOut');
      }
    },
    []
  );

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: handleZoomIn,
      zoomOut: handleZoomOut,
      resetTransform: handleReset,
      setTransform: handleSetTransform,
    }),
    [handleZoomIn, handleZoomOut, handleReset, handleSetTransform]
  );

  return (
    <div
      data-testid="canvas-controller"
      data-panning-enabled={panningEnabled ? 'true' : 'false'}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      <TransformWrapper
        ref={transformRef}
        initialScale={initialScale}
        minScale={MIN_CANVAS_ZOOM}
        maxScale={MAX_CANVAS_ZOOM}
        centerOnInit={false}
        limitToBounds={false}
        velocityAnimation={{ disabled: false, sensitivityMouse: 1, animationTime: 220 }}
        wheel={{
          disabled: !wheelZoomEnabled,
          step: 0.12,
          excluded: ['canvas-wheel-excluded'],
        }}
        panning={{
          disabled: !panningEnabled,
          velocityDisabled: false,
          excluded: [
            'canvas-interactive-node',
            'canvas-interactive-zone',
            'canvas-interactive-control',
            'nopan',
            'button',
            'input',
            'select',
            'a',
          ],
        }}
        doubleClick={{
          disabled: true,
        }}
        onTransform={(r) => {
          onTransformChange?.({
            scale: Number(r.state.scale.toFixed(2)),
            positionX: Math.round(r.state.positionX),
            positionY: Math.round(r.state.positionY),
          });
        }}
        onPanningStart={() => {
          onPanningStart?.();
        }}
        onPanningStop={(r) => {
          onPanningStop?.({
            x: Math.round(r.state.positionX),
            y: Math.round(r.state.positionY),
          });
        }}
      >
        <TransformComponent
          wrapperStyle={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
          }}
          contentStyle={{
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
});
