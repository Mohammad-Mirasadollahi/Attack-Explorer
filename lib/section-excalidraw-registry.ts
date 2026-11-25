import type { Section3DKey } from '@/lib/section-3d-registry';
import {
  PROCESS_HOLLOWING_TECHNICAL_BOARDS,
  type BoardTooltip,
  type BoardTooltipField,
  type BoardTooltipKind,
  type TechnicalBoardDescriptor,
  type TechnicalBoardSkeleton,
} from '@/modules/scenarios/process-hollowing/excalidraw';
import { MALWARE_EXCALIDRAW_BOARDS } from '@/lib/malware-2d-blueprints';

export type {
  BoardTooltip,
  BoardTooltipField,
  BoardTooltipKind,
  TechnicalBoardDescriptor,
  TechnicalBoardSkeleton,
};

const SCENARIO_TECHNICAL_BOARDS: Record<
  string,
  Partial<Record<Section3DKey, TechnicalBoardDescriptor>>
> = {
  'process-hollowing': PROCESS_HOLLOWING_TECHNICAL_BOARDS,
  ...MALWARE_EXCALIDRAW_BOARDS,
};

export function hasTechnicalWhiteboard(
  scenarioId: string,
  sectionKey: Section3DKey
): boolean {
  return Boolean(SCENARIO_TECHNICAL_BOARDS[scenarioId]?.[sectionKey]);
}

export function getTechnicalWhiteboard(
  scenarioId: string,
  sectionKey: Section3DKey
): TechnicalBoardDescriptor | null {
  return SCENARIO_TECHNICAL_BOARDS[scenarioId]?.[sectionKey] ?? null;
}

export function listTechnicalWhiteboardSections(
  scenarioId: string
): Section3DKey[] {
  const boards = SCENARIO_TECHNICAL_BOARDS[scenarioId];
  if (!boards) return [];
  return Object.keys(boards) as Section3DKey[];
}
