'use client';

/**
 * Coordinates WebGL context allocation across multi-section pages so that
 * scrolling through 6+ Three.js sections never exceeds browser WebGL context
 * limits or starves CPU/GPU resources.
 *
 * At most `MAX_ACTIVE_WEBGL_STAGES` (default 1) mounted Three.js WebGLRenderer
 * instance runs simultaneously; whichever stage is explicitly pinned by user
 * interaction or occupies the largest visible share of the viewport gets the
 * active WebGL slot, while off-screen stages render lightweight anime preview
 * posters and auto-activate when scrolled into view.
 */

type Listener = (activeInstanceId: string | null) => void;

interface RegisteredStage {
  instanceId: string;
  visibilityRatio: number;
  lastUpdated: number;
}

const stages = new Map<string, RegisteredStage>();
const listeners = new Set<Listener>();
let pinnedInstanceId: string | null = null;
let currentActiveId: string | null = null;

function recomputeActiveStage(): void {
  let nextActive: string | null = null;

  if (pinnedInstanceId && stages.has(pinnedInstanceId)) {
    const pinned = stages.get(pinnedInstanceId)!;
    if (pinned.visibilityRatio > 0.05) {
      nextActive = pinnedInstanceId;
    } else {
      // Release pin once scrolled completely out of view so newly viewed scenes activate seamlessly
      pinnedInstanceId = null;
    }
  }

  if (!nextActive) {
    let bestScore = 0.08;
    for (const st of stages.values()) {
      if (st.visibilityRatio > bestScore) {
        bestScore = st.visibilityRatio;
        nextActive = st.instanceId;
      }
    }
  }

  if (nextActive !== currentActiveId) {
    currentActiveId = nextActive;
    for (const listener of listeners) {
      listener(currentActiveId);
    }
  }
}

export function registerWebGLStage(instanceId: string): () => void {
  stages.set(instanceId, {
    instanceId,
    visibilityRatio: 0,
    lastUpdated: Date.now(),
  });

  return () => {
    stages.delete(instanceId);
    if (pinnedInstanceId === instanceId) {
      pinnedInstanceId = null;
    }
    recomputeActiveStage();
  };
}

export function reportWebGLStageVisibility(
  instanceId: string,
  visibilityRatio: number
): void {
  const existing = stages.get(instanceId);
  if (!existing) return;
  existing.visibilityRatio = visibilityRatio;
  existing.lastUpdated = Date.now();
  recomputeActiveStage();
}

export function requestActivateWebGLStage(instanceId: string): void {
  if (!stages.has(instanceId)) return;
  const entry = stages.get(instanceId)!;
  if (entry.visibilityRatio < 0.25) {
    entry.visibilityRatio = 0.6;
  }
  pinnedInstanceId = instanceId;
  recomputeActiveStage();
}

export function subscribeActiveWebGLStage(listener: Listener): () => void {
  listeners.add(listener);
  listener(currentActiveId);
  return () => {
    listeners.delete(listener);
  };
}

export function getActiveWebGLStageId(): string | null {
  return currentActiveId;
}
