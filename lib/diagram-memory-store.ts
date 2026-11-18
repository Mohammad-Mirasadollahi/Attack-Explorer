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
  | 'RAW_TABLES'
  | 'SCROLLYTELLING';

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
    value === 'RAW_TABLES' ||
    value === 'SCROLLYTELLING'
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

export interface WorkbenchUrlSerializationInput {
  scenarioId: string;
  activeStageIndex: number;
  activeEnvironment?: ActiveEnvironmentId;
  expandedNodeId?: string | null;
  selectedNodeId?: string | null;
  selectedInternalSubNodeId?: string | null;
  selectedTelemetryId?: string | null;
  viewMode?: PersistedCanvasViewMode;
  inspectorOpen?: boolean;
  inspectorTab?: PersistedInspectorTab;
  inspectorScopeOverride?: PersistedInspectorScopeOverride;
  /** Optional specific clause/sub-part hash (e.g. "clause-2.1") selected by the user */
  focusedPartHash?: string | null;
  /** Optional current window.location.search to preserve utility flags like autostart=1 */
  currentSearch?: string;
}

/**
 * Serializes the active workbench state (scenario, step/stage, expanded section,
 * internal sub-node, selected node, packet, inspector page & tab, view mode, and
 * environment) into a shareable relative URL (`?scenario=...&step=...#...`).
 */
export function serializeWorkbenchUrlState(
  input: WorkbenchUrlSerializationInput
): string {
  const params = new URLSearchParams();

  // Preserve utility query parameters if present in currentSearch
  if (input.currentSearch) {
    try {
      const existing = new URLSearchParams(input.currentSearch);
      if (existing.get('autostart') === '1') {
        params.set('autostart', '1');
      }
      if (existing.get('intro') === '1') {
        params.set('intro', '1');
      }
    } catch {
      // Ignore malformed search strings
    }
  }

  params.set('scenario', input.scenarioId);

  if (input.activeStageIndex > 0) {
    params.set('step', String(input.activeStageIndex));
  }

  if (input.expandedNodeId) {
    params.set('expanded', input.expandedNodeId);
  }

  if (input.selectedInternalSubNodeId) {
    params.set('subnode', input.selectedInternalSubNodeId);
  }

  if (
    input.selectedNodeId &&
    input.selectedNodeId !== input.expandedNodeId
  ) {
    params.set('node', input.selectedNodeId);
  }

  if (input.selectedTelemetryId) {
    params.set('packet', input.selectedTelemetryId);
  }

  if (input.inspectorOpen) {
    params.set('inspector', '1');
    const tab = input.inspectorTab || 'OVERVIEW';
    params.set('tab', tab);
  }

  if (input.viewMode === 'RAW_TABLES' && !input.inspectorOpen) {
    params.set('view', 'RAW_TABLES');
  }

  if (
    input.activeEnvironment &&
    input.activeEnvironment !== DEFAULT_ACTIVE_ENVIRONMENT
  ) {
    params.set('env', input.activeEnvironment);
  }

  // Compute semantic #hash for the current section / step / sub-part
  let hash = '';
  const cleanPartHash = input.focusedPartHash
    ? input.focusedPartHash.replace(/^#+/, '').trim()
    : '';

  if (cleanPartHash) {
    hash = `#${cleanPartHash}`;
  } else if (input.selectedInternalSubNodeId) {
    hash = `#substep-${input.selectedInternalSubNodeId}`;
  } else if (input.expandedNodeId) {
    hash = `#section-${input.expandedNodeId}`;
  } else if (input.selectedTelemetryId) {
    hash = `#packet-${input.selectedTelemetryId}`;
  } else if (input.selectedNodeId) {
    hash = `#node-${input.selectedNodeId}`;
  } else if (input.inspectorOpen) {
    const tabSlug = (input.inspectorTab || 'OVERVIEW')
      .toLowerCase()
      .replace(/_/g, '-');
    hash =
      input.activeStageIndex > 0
        ? `#${tabSlug}-step-${input.activeStageIndex}`
        : `#inspector-${tabSlug}`;
  } else if (input.activeStageIndex > 0) {
    hash = `#step-${input.activeStageIndex}`;
  } else if (input.viewMode === 'RAW_TABLES') {
    hash = '#raw-tables';
  }

  const queryString = params.toString();
  return `${queryString ? `?${queryString}` : ''}${hash}`;
}

export interface ParsedWorkbenchUrlResult {
  hasUrlOverrides: boolean;
  state: LastVisitedDiagramSnapshot;
  focusedPartHash: string | null;
}

/**
 * Parses URL query parameters and hash fragments into a sanitized workbench state.
 * Supports sharing specific scenarios, steps (`step=2` or `#step-2` or `#clause-2.1`),
 * expanded sections (`expanded=...` or `#section-...`), sub-nodes (`subnode=...` or `#substep-...`),
 * nodes (`node=...`), packets (`packet=...`), and inspector tabs (`inspector=1&tab=STEP_GUIDE`).
 */
export function parseWorkbenchUrlState(
  search: string,
  hash: string,
  fallbackSnapshot: LastVisitedDiagramSnapshot
): ParsedWorkbenchUrlResult {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search || '');
  } catch {
    params = new URLSearchParams();
  }

  const cleanHash = (hash || '').replace(/^#+/, '').trim();

  const paramScenario = params.get('scenario');
  const paramStep = params.get('step') ?? params.get('stage');
  const paramExpanded = params.get('expanded') ?? params.get('section');
  const paramSubNode = params.get('subnode');
  const paramNode = params.get('node');
  const paramPacket = params.get('packet') ?? params.get('telemetry');
  const paramInspector = params.get('inspector');
  const paramTab = params.get('tab');
  const paramView = params.get('view');
  const paramEnv = params.get('env');

  // Parse hash-based deep-link shortcuts if corresponding query param is absent
  let hashStep: number | null = null;
  let hashExpanded: string | null = null;
  let hashSubNode: string | null = null;
  let hashNode: string | null = null;
  let hashPacket: string | null = null;
  let hashInspectorOpen: boolean | null = null;
  let hashInspectorTab: PersistedInspectorTab | null = null;
  let focusedPartHash: string | null = null;

  if (cleanHash) {
    const stepMatch = cleanHash.match(/^(?:step|stage)-(\d+)$/i);
    const clauseMatch = cleanHash.match(/^clause-(\d+)\.(\d+)$/i);
    const tabStepMatch = cleanHash.match(
      /^(overview|step-guide|sequence|memory|siem-logs|sources)-step-(\d+)$/i
    );
    const inspectorTabMatch = cleanHash.match(
      /^inspector-(overview|step-guide|sequence|memory|siem-logs|sources)$/i
    );

    if (stepMatch) {
      hashStep = parseInt(stepMatch[1], 10);
    } else if (clauseMatch) {
      hashStep = parseInt(clauseMatch[1], 10);
      focusedPartHash = cleanHash;
    } else if (tabStepMatch) {
      const candidateTab = tabStepMatch[1].toUpperCase().replace(/-/g, '_');
      if (isValidInspectorTab(candidateTab)) {
        hashInspectorOpen = true;
        hashInspectorTab = candidateTab;
      }
      hashStep = parseInt(tabStepMatch[2], 10);
    } else if (inspectorTabMatch) {
      const candidateTab = inspectorTabMatch[1]
        .toUpperCase()
        .replace(/-/g, '_');
      if (isValidInspectorTab(candidateTab)) {
        hashInspectorOpen = true;
        hashInspectorTab = candidateTab;
      }
    } else if (cleanHash.startsWith('section-')) {
      hashExpanded = cleanHash.slice('section-'.length) || null;
    } else if (cleanHash.startsWith('substep-')) {
      hashSubNode = cleanHash.slice('substep-'.length) || null;
    } else if (cleanHash.startsWith('node-')) {
      hashNode = cleanHash.slice('node-'.length) || null;
    } else if (cleanHash.startsWith('packet-')) {
      hashPacket = cleanHash.slice('packet-'.length) || null;
    } else {
      focusedPartHash = cleanHash;
    }
  }

  const hasUrlOverrides = Boolean(
    paramScenario ||
      paramStep !== null ||
      paramExpanded !== null ||
      paramSubNode !== null ||
      paramNode !== null ||
      paramPacket !== null ||
      paramInspector !== null ||
      paramTab !== null ||
      paramView !== null ||
      paramEnv !== null ||
      hashStep !== null ||
      hashExpanded !== null ||
      hashSubNode !== null ||
      hashNode !== null ||
      hashPacket !== null ||
      hashInspectorOpen !== null
  );

  if (!hasUrlOverrides) {
    return {
      hasUrlOverrides: false,
      state: fallbackSnapshot,
      focusedPartHash: null,
    };
  }

  const parsedStepNumber =
    paramStep !== null && /^\d+$/.test(paramStep.trim())
      ? parseInt(paramStep.trim(), 10)
      : hashStep;

  const resolvedExpanded = paramExpanded ?? hashExpanded ?? null;
  const resolvedSubNode = paramSubNode ?? hashSubNode ?? null;
  const resolvedNode = paramNode ?? hashNode ?? resolvedExpanded ?? null;
  const resolvedPacket = paramPacket ?? hashPacket ?? null;

  const normalizedParamTab = paramTab
    ? paramTab.trim().toUpperCase().replace(/-/g, '_')
    : null;
  const resolvedTab: PersistedInspectorTab = isValidInspectorTab(
    normalizedParamTab
  )
    ? normalizedParamTab
    : hashInspectorTab ??
      (paramScenario ? 'OVERVIEW' : fallbackSnapshot.inspectorTab);

  const resolvedInspectorOpen =
    paramInspector === '1' ||
    paramInspector === 'true' ||
    Boolean(normalizedParamTab && isValidInspectorTab(normalizedParamTab)) ||
    hashInspectorOpen === true
      ? true
      : paramInspector === '0' || paramInspector === 'false'
      ? false
      : false;

  const normalizedView = paramView ? paramView.trim().toUpperCase() : null;
  const resolvedViewMode: PersistedCanvasViewMode = isValidViewMode(
    normalizedView
  )
    ? normalizedView
    : 'TOPOLOGY';

  const normalizedEnv = paramEnv ? paramEnv.trim().toUpperCase() : null;
  const resolvedEnv: ActiveEnvironmentId = isValidEnvironment(normalizedEnv)
    ? normalizedEnv
    : fallbackSnapshot.activeEnvironment;

  const nextState = sanitizeDiagramSnapshot(
    {
      ...fallbackSnapshot,
      scenarioId: paramScenario || fallbackSnapshot.scenarioId,
      activeStageIndex:
        parsedStepNumber !== null && Number.isFinite(parsedStepNumber)
          ? parsedStepNumber
          : 0,
      activeEnvironment: resolvedEnv,
      expandedNodeId: resolvedExpanded,
      selectedNodeId: resolvedNode,
      selectedInternalSubNodeId: resolvedSubNode,
      selectedTelemetryId: resolvedPacket,
      viewMode: resolvedViewMode,
      inspectorOpen: resolvedInspectorOpen,
      inspectorTab: resolvedTab,
      inspectorScopeOverride: null,
    },
    fallbackSnapshot.scenarioId
  );

  return {
    hasUrlOverrides: true,
    state: nextState,
    focusedPartHash,
  };
}

