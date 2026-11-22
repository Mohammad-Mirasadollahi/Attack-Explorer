'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * Keeps one GSAP clip and one Excalidraw board mounted at a time.
 * Off-screen sections stay as posters so a long scenario page does not
 * start every animation and canvas together.
 */
type Listener = (activeInstanceId: string | null) => void;

interface RegisteredStage {
  instanceId: string;
  visibilityRatio: number;
}

function createSlot() {
  const stages = new Map<string, RegisteredStage>();
  const listeners = new Set<Listener>();
  let pinnedInstanceId: string | null = null;
  let currentActiveId: string | null = null;

  function recompute() {
    let nextActive: string | null = null;
    if (pinnedInstanceId && stages.has(pinnedInstanceId)) {
      const pinned = stages.get(pinnedInstanceId)!;
      if (pinned.visibilityRatio > 0.05) {
        nextActive = pinnedInstanceId;
      } else {
        pinnedInstanceId = null;
      }
    }
    if (!nextActive) {
      let bestScore = 0.12;
      for (const stage of stages.values()) {
        if (stage.visibilityRatio > bestScore) {
          bestScore = stage.visibilityRatio;
          nextActive = stage.instanceId;
        }
      }
    }
    if (nextActive !== currentActiveId) {
      currentActiveId = nextActive;
      for (const listener of listeners) listener(currentActiveId);
    }
  }

  return {
    register(instanceId: string) {
      stages.set(instanceId, { instanceId, visibilityRatio: 0 });
      return () => {
        stages.delete(instanceId);
        if (pinnedInstanceId === instanceId) pinnedInstanceId = null;
        recompute();
      };
    },
    report(instanceId: string, visibilityRatio: number) {
      const existing = stages.get(instanceId);
      if (!existing) return;
      existing.visibilityRatio = visibilityRatio;
      recompute();
    },
    activate(instanceId: string) {
      if (!stages.has(instanceId)) return;
      const entry = stages.get(instanceId)!;
      if (entry.visibilityRatio < 0.25) entry.visibilityRatio = 0.6;
      pinnedInstanceId = instanceId;
      recompute();
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      listener(currentActiveId);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

const clipSlot = createSlot();
const boardSlot = createSlot();

export function useHeavyMediaSlot(kind: 'clip' | 'board') {
  const slot = kind === 'clip' ? clipSlot : boardSlot;
  const instanceId = useId();
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const unregister = slot.register(instanceId);
    const unsubscribe = slot.subscribe((activeId) => {
      setActive(activeId === instanceId);
    });
    const element = ref.current;
    let observer: IntersectionObserver | null = null;
    if (element && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            slot.report(
              instanceId,
              entry.isIntersecting ? entry.intersectionRatio : 0
            );
          }
        },
        { threshold: [0, 0.15, 0.35, 0.6, 0.85] }
      );
      observer.observe(element);
    } else {
      slot.report(instanceId, 0.5);
    }
    return () => {
      observer?.disconnect();
      unsubscribe();
      unregister();
    };
  }, [instanceId, slot]);

  return {
    ref,
    active,
    activate: () => slot.activate(instanceId),
  };
}
