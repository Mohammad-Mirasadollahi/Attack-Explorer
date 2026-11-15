import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
  DEFAULT_PLAYBACK_SPEED,
} from './simulation-engine';

export const DIAGRAM_MEMORY_STORAGE_KEY = 'attack_explorer_last_diagram_v1';

export type PersistedCanvasViewMode =
  | 'TOPOLOGY'
  | 'SEQUENCE'
  | 'PROCESS_MEMORY'
  | 'RAW_TABLES';

export type PersistedInspectorTab =
  | 'OVERVIEW'
  | 'STEP_GUIDE'
  | 'SEQUENCE'
  | 'MEMORY'
  | 'SIEM_LOGS'
  | 'SOURCES';

export type PersistedInspectorScopeOverride =
  | 'MAIN_SCENARIO'
  | 'EXPANDED_NODE'
  | 'INTERNAL_SUBNODE'
  | null;

export interface LastVisitedDiagramSnapshot {
  scenarioId: string;
  activeStageIndex: number;
  activeEnvironment: ActiveEnvironmentId;
  expandedNodeId: string | null;
  selectedNodeId: string | null;
  selectedInternalSubNodeId: string | null;
  selectedTelemetryId: string | null;
  tacticalMode: boolean;
  viewMode: PersistedCanvasViewMode;
  inspectorOpen: boolean;
  inspectorTab: PersistedInspectorTab;
  inspectorScopeOverride: PersistedInspectorScopeOverride;
  isDark: boolean;
  playbackSpeed: number;
  updatedAt: number;
}

export type SaveDiagramSnapshotInput = {
  scenarioId: string;
  activeStageIndex: number;
  activeEnvironment: ActiveEnvironmentId;
  expandedNodeId: string | null;
  selectedNodeId: string | null;
  selectedInternalSubNodeId: string | null;
  selectedTelemetryId: string | null;
  tacticalMode: boolean;
  viewMode?: PersistedCanvasViewMode;
  inspectorOpen?: boolean;
  inspectorTab?: PersistedInspectorTab;
  inspectorScopeOverride?: PersistedInspectorScopeOverride;
  isDark?: boolean;
  playbackSpeed?: number;
  updatedAt?: number;
};

let inMemorySnapshotFallback: LastVisitedDiagramSnapshot | null = null;

function isValidEnvironment(value: unknown): value is ActiveEnvironmentId {
  return value === 'WORKSTATION' || value === 'SERVER' || value === 'CLOUD';
}

function isValidViewMode(value: unknown): value is PersistedCanvasViewMode {
  return (
    value === 'TOPOLOGY' ||
    value === 'SEQUENCE' ||
    value === 'PROCESS_MEMORY' ||
    value === 'RAW_TABLES'
  );
}

function isValidInspectorTab(value: unknown): value is PersistedInspectorTab {
  return (
    value === 'OVERVIEW' ||
    value === 'STEP_GUIDE' ||
    value === 'SEQUENCE' ||
    value === 'MEMORY' ||
    value === 'SIEM_LOGS' ||
    value === 'SOURCES'
  );
}

function isValidScopeOverride(
  value: unknown
): value is Exclude<PersistedInspectorScopeOverride, null> {
  return (
    value === 'MAIN_SCENARIO' ||
    value === 'EXPANDED_NODE' ||
    value === 'INTERNAL_SUBNODE'
  );
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

  const rawViewMode: PersistedCanvasViewMode = isValidViewMode(raw?.viewMode)
    ? raw.viewMode
    : 'TOPOLOGY';

  // Sequence and Memory now live inside the Inspector page; if a legacy snapshot
  // had SEQUENCE or PROCESS_MEMORY as viewMode, restore into Inspector on that tab.
  const migratedInspectorOpen =
    rawViewMode === 'SEQUENCE' || rawViewMode === 'PROCESS_MEMORY'
      ? true
      : Boolean(raw?.inspectorOpen);

  const migratedInspectorTab: PersistedInspectorTab =
    rawViewMode === 'SEQUENCE'
      ? 'SEQUENCE'
      : rawViewMode === 'PROCESS_MEMORY'
      ? 'MEMORY'
      : isValidInspectorTab(raw?.inspectorTab)
      ? raw.inspectorTab
      : 'OVERVIEW';

  const normalizedViewMode: PersistedCanvasViewMode =
    rawViewMode === 'RAW_TABLES' ? 'RAW_TABLES' : 'TOPOLOGY';

  const playbackSpeed =
    typeof raw?.playbackSpeed === 'number' &&
    (raw.playbackSpeed === 0.5 ||
      raw.playbackSpeed === 1 ||
      raw.playbackSpeed === 2)
      ? raw.playbackSpeed
      : DEFAULT_PLAYBACK_SPEED;

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
    viewMode: normalizedViewMode,
    inspectorOpen: migratedInspectorOpen,
    inspectorTab: migratedInspectorTab,
    inspectorScopeOverride: isValidScopeOverride(raw?.inspectorScopeOverride)
      ? raw.inspectorScopeOverride
      : null,
    isDark: Boolean(raw?.isDark),
    playbackSpeed,
    updatedAt:
      typeof raw?.updatedAt === 'number' && Number.isFinite(raw.updatedAt)
        ? raw.updatedAt
        : Date.now(),
  };
}

export function hasStoredDiagramSnapshot(): boolean {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const rawJson = window.localStorage.getItem(DIAGRAM_MEMORY_STORAGE_KEY);
      if (rawJson && rawJson.trim().length > 0) {
        return true;
      }
    } catch {
      // Ignore storage access errors
    }
  }
  return inMemorySnapshotFallback !== null;
}

export function saveLastVisitedDiagramSnapshot(
  snapshot: SaveDiagramSnapshotInput
): LastVisitedDiagramSnapshot {
  const normalized = sanitizeDiagramSnapshot(
    {
      ...inMemorySnapshotFallback,
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
        const parsed = JSON.parse(
          rawJson
        ) as Partial<LastVisitedDiagramSnapshot>;
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

