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
  setTransform: (
    x: number,
    y: number,
    scale: number,
    animationTime?: number
  ) => void;
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
 * `react-zoom-pan-pinch` to provide hardware-accelerated 2D transform matrices
 * (`translate3d` + `scale`) without competing pointer/wheel listeners or
 * per-frame React state thrashing.
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
    className = '',
  },
  ref
) {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const handleZoomIn = useCallback((step = 0.15) => {
    if (transformRef.current) {
      transformRef.current.zoomIn(step, 140, 'easeOut');
    }
  }, []);

  const handleZoomOut = useCallback((step = 0.15) => {
    if (transformRef.current) {
      transformRef.current.zoomOut(step, 140, 'easeOut');
    }
  }, []);

  const handleReset = useCallback(() => {
    if (transformRef.current) {
      transformRef.current.resetTransform(160, 'easeOut');
    }
  }, []);

  const handleSetTransform = useCallback(
    (x: number, y: number, scale: number, animationTime = 0) => {
      if (transformRef.current) {
        transformRef.current.setTransform(
          x,
          y,
          scale,
          animationTime,
          'easeOut'
        );
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
      data-wheel-zoom-enabled={wheelZoomEnabled ? 'true' : 'false'}
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
        velocityAnimation={{ disabled: true }}
        wheel={{
          disabled: true,
        }}
        panning={{
          disabled: true,
        }}
        pinch={{
          disabled: !wheelZoomEnabled,
        }}
        doubleClick={{
          disabled: true,
        }}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full !overflow-visible"
          contentClass="!w-full !h-full !overflow-visible"
          wrapperStyle={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
          }}
          contentStyle={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
});
