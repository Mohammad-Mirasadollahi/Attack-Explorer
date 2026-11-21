import type { TelemetryEvent } from '@/lib/attack-scenarios';
import type {
  InspectorMiniMapModel,
  InspectorScopeContext,
} from '@/lib/inspector-scope';

export interface InspectorContextMiniMapSections {
  /** Compass header with archetype badge. Default true. */
  header?: boolean;
  /** Four-tier structural architecture pipeline. Default true. */
  structuralBlueprint?: boolean;
  /** Cascading Parent → Child process waterfall (Process Hierarchy–owned). Default true. */
  cascadingProcess?: boolean;
  /**
   * When true with cascadingProcess, render the spawn tree as an embedded list
   * (no nested title card) for the Process Hierarchy shell. Default false.
   */
  cascadingProcessEmbedded?: boolean;
  /** VAD / state mutation differential (Memory-owned when VAD). Default true. */
  stateTransformation?: boolean;
  /** Focused topology neighbor links. Default true. */
  topologyLinks?: boolean;
}

export interface InspectorContextMiniMapProps {
  miniMap?: InspectorMiniMapModel | null;
  scopeContext: InspectorScopeContext;
  selectedTelemetry?: TelemetryEvent | null;
  filterStageIndex?: number | null;
  onSelectNode?: (nodeId: string | null) => void;
  onSelectMainNode?: (nodeId: string | null) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  onSelectInternalNode?: (subNodeId: string | null) => void;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
  onReturnToDiagram?: () => void;
  /**
   * Which documentation blocks to render. Use this to place Cascading Process
   * on Process Hierarchy and VAD State Mutation on Memory — never dump both on Overview.
   */
  includeSections?: InspectorContextMiniMapSections;
}
