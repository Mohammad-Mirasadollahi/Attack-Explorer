import type { ReactNode } from 'react';
import type {
  AttackScenario,
  AttackStage,
  TelemetryEvent,
} from '@/lib/attack-scenarios';
import type { ActiveEnvironmentId } from '@/lib/simulation-engine';
import type { CinematicPhase } from '@/lib/cinematic-camera-director';
import type { InspectorScopeContext } from '@/lib/inspector-scope';

export type InspectorTab =
  | 'OVERVIEW'
  | 'STEP_GUIDE'
  | 'PROCESS_HIERARCHY'
  | 'SEQUENCE'
  | 'MEMORY'
  | 'SIEM_LOGS'
  | 'SOURCES';

export interface InspectorPanelProps {
  scenario: AttackScenario;
  currentStage: AttackStage | null;
  cinematicPhase?: CinematicPhase | null;
  isPlaying?: boolean;
  activeEnvironment?: ActiveEnvironmentId;
  selectedTelemetry: TelemetryEvent | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  onSelectStage: (stageIndex: number) => void;
  onStartWalkthrough?: () => void;
  onTogglePlay?: () => void;
  onResetWalkthrough?: () => void;
  onClearTelemetrySelection: () => void;
  onOpenSourcesModal: () => void;
  /** Hierarchical scope context resolved from diagram state */
  scopeContext?: InspectorScopeContext;
  onSelectNode?: (nodeId: string | null) => void;
  onExpandedNodeChange?: (nodeId: string | null) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  /** Controlled active tab for persistence across reloads */
  activeTab?: InspectorTab;
  onTabChange?: (tab: InspectorTab) => void;
  /** Close full-screen inspector page and return to the active diagram */
  onCloseInspectorPage?: () => void;
  /** Controlled visibility of the left navigation panel via the single main top-header button */
  sidebarOpen?: boolean;
}

export interface FloatingHoverInspectorTriggerProps {
  scenario: AttackScenario;
  currentStage: AttackStage | null;
  scopeContext: InspectorScopeContext;
  selectedTelemetry: TelemetryEvent | null;
  onOpenInspectorPage: () => void;
}

export interface InspectorVisibleTab {
  id: InspectorTab;
  label: string;
  testId: string;
  icon: ReactNode;
}
