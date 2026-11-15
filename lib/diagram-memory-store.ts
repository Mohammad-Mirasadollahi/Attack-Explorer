import { ActiveEnvironmentId, DEFAULT_ACTIVE_ENVIRONMENT } from './simulation-engine';

export const DIAGRAM_MEMORY_STORAGE_KEY = 'attack_explorer_last_diagram_v1';

export interface LastVisitedDiagramSnapshot {
  scenarioId: string;
  activeStageIndex: number;
  activeEnvironment: ActiveEnvironmentId;
  expandedNodeId: string | null;
  selectedNodeId: string | null;
  selectedInternalSubNodeId: string | null;
  selectedTelemetryId: string | null;
  tacticalMode: boolean;
  updatedAt: number;
}

let inMemorySnapshotFallback: LastVisitedDiagramSnapshot | null = null;

function isValidEnvironment(value: unknown): value is ActiveEnvironmentId {
  return value === 'WORKSTATION' || value === 'SERVER' || value === 'CLOUD';
}

export function sanitizeDiagramSnapshot(
  raw: Partial<LastVisitedDiagramSnapshot> | null | undefined,
  fallbackScenarioId: string
): LastVisitedDiagramSnapshot {
  const scenarioId =
    typeof raw?.scenarioId === 'string' && raw.scenarioId.trim().length > 0
      ? raw.scenarioId.trim()
      : fallbackScenarioId;

  const activeStageIndex =
    typeof raw?.activeStageIndex === 'number' &&
    Number.isFinite(raw.activeStageIndex) &&
    raw.activeStageIndex >= 0
      ? Math.floor(raw.activeStageIndex)
      : 0;

  const activeEnvironment: ActiveEnvironmentId = isValidEnvironment(
    raw?.activeEnvironment
  )
    ? raw.activeEnvironment
    : DEFAULT_ACTIVE_ENVIRONMENT;

  return {
    scenarioId,
    activeStageIndex,
    activeEnvironment,
    expandedNodeId:
      typeof raw?.expandedNodeId === 'string' && raw.expandedNodeId.length > 0
        ? raw.expandedNodeId
        : null,
    selectedNodeId:
      typeof raw?.selectedNodeId === 'string' && raw.selectedNodeId.length > 0
        ? raw.selectedNodeId
        : null,
    selectedInternalSubNodeId:
      typeof raw?.selectedInternalSubNodeId === 'string' &&
      raw.selectedInternalSubNodeId.length > 0
        ? raw.selectedInternalSubNodeId
        : null,
    selectedTelemetryId:
      typeof raw?.selectedTelemetryId === 'string' &&
      raw.selectedTelemetryId.length > 0
        ? raw.selectedTelemetryId
        : null,
    tacticalMode: Boolean(raw?.tacticalMode),
    updatedAt:
      typeof raw?.updatedAt === 'number' && Number.isFinite(raw.updatedAt)
        ? raw.updatedAt
        : Date.now(),
  };
}

export function saveLastVisitedDiagramSnapshot(
  snapshot: Omit<LastVisitedDiagramSnapshot, 'updatedAt'> & {
    updatedAt?: number;
  }
): LastVisitedDiagramSnapshot {
  const normalized = sanitizeDiagramSnapshot(
    {
      ...snapshot,
      updatedAt: snapshot.updatedAt ?? Date.now(),
    },
    snapshot.scenarioId
  );

  inMemorySnapshotFallback = normalized;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(
        DIAGRAM_MEMORY_STORAGE_KEY,
        JSON.stringify(normalized)
      );
    } catch {
      // Ignore storage quota or private mode restrictions
    }
  }

  return normalized;
}

export function readLastVisitedDiagramSnapshot(
  fallbackScenarioId: string
): LastVisitedDiagramSnapshot {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const rawJson = window.localStorage.getItem(DIAGRAM_MEMORY_STORAGE_KEY);
      if (rawJson) {
        const parsed = JSON.parse(rawJson) as Partial<LastVisitedDiagramSnapshot>;
        const sanitized = sanitizeDiagramSnapshot(parsed, fallbackScenarioId);
        inMemorySnapshotFallback = sanitized;
        return sanitized;
      }
    } catch {
      // Fall back to in-memory snapshot
    }
  }

  if (inMemorySnapshotFallback) {
    return sanitizeDiagramSnapshot(
      inMemorySnapshotFallback,
      fallbackScenarioId
    );
  }

  return sanitizeDiagramSnapshot(null, fallbackScenarioId);
}

export function clearDiagramMemoryForTesting(): void {
  inMemorySnapshotFallback = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(DIAGRAM_MEMORY_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
}
