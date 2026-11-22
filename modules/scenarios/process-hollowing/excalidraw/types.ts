import type { Section3DKey } from '@/lib/section-3d-registry';

/**
 * Minimal Excalidraw element skeleton used by convertToExcalidrawElements.
 * Kept local so the registry stays free of the heavy Excalidraw runtime.
 */
export type TechnicalBoardSkeleton = Record<string, unknown> & {
  type: string;
  x?: number;
  y?: number;
  id?: string;
  text?: string;
  width?: number;
  height?: number;
  label?: {
    text: string;
    fontSize?: number;
    textAlign?: 'left' | 'center' | 'right';
  };
  strokeColor?: string;
  backgroundColor?: string;
  fillStyle?: 'hachure' | 'cross-hatch' | 'solid' | 'zigzag';
  strokeWidth?: number;
  roughness?: number;
  fontSize?: number;
  fontFamily?: number;
  start?: { id?: string; type?: string; text?: string };
  end?: { id?: string; type?: string; text?: string };
};

/** Software-structure hover card for a board node. */
export interface BoardTooltipField {
  key: string;
  value: string;
  /** Optional type annotation, e.g. HANDLE / DWORD */
  type?: string;
}

export type BoardTooltipKind =
  | 'api'
  | 'process'
  | 'handle'
  | 'memory'
  | 'network'
  | 'detect'
  | 'kernel'
  | 'note';

export interface BoardTooltip {
  kind: BoardTooltipKind;
  /** Short symbol / function / object name */
  title: string;
  /** Owning module or subsystem, e.g. Kernel32.dll */
  module?: string;
  /** One-line signature, e.g. LPVOID VirtualAllocEx(HANDLE, …) */
  signature?: string;
  fields: BoardTooltipField[];
  /**
   * Plain-language explanation — what this box means for a learner.
   * Shown as the main “What this means” section in the hover card.
   */
  explain: string;
  /** Optional short tip under the explanation */
  note?: string;
}

export interface TechnicalBoardDescriptor {
  scenarioId: string;
  sectionKey: Section3DKey;
  boardBadge: string;
  title: string;
  subtitle: string;
  chalkHint: string;
  skeletons: TechnicalBoardSkeleton[];
  /** Hover cards keyed by Excalidraw element id */
  tooltips?: Record<string, BoardTooltip>;
}
