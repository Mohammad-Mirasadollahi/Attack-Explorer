import type {
  AttackScenario,
  TelemetryEvent,
} from '@/lib/attack-scenarios';
import type { ActiveEnvironmentId } from '@/lib/simulation-engine';
import type { CinematicPhase } from '@/lib/cinematic-camera-director';
import type { InspectorScopeContext } from '@/lib/inspector-scope';

export interface StepByStepGuidePanelProps {
  scenario: AttackScenario;
  activeStageIndex: number;
  cinematicPhase?: CinematicPhase | null;
  activeEnvironment?: ActiveEnvironmentId;
  scopeContext?: InspectorScopeContext;
  selectedTelemetryId?: string | null;
  onSelectStage?: (stageIndex: number) => void;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  onStartWalkthrough?: () => void;
  onResetWalkthrough?: () => void;
  /** Opens the dedicated Process Hierarchy Inspector tab (Cascading Process home). */
  onOpenProcessHierarchy?: () => void;
}
