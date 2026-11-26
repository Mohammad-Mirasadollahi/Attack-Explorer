import type { Section3DKey } from '@/lib/section-3d-registry';
import {
  PROCESS_HOLLOWING_TECHNICAL_BOARDS,
  type BoardTooltip,
  type BoardTooltipField,
  type BoardTooltipKind,
  type TechnicalBoardDescriptor,
  type TechnicalBoardSkeleton,
} from '@/modules/scenarios/process-hollowing/excalidraw';
import { AMSI_REFLECTIVE_DLL_TECHNICAL_BOARDS } from '@/modules/scenarios/amsi-reflective-dll/excalidraw';
import { LOCKBIT_TECHNICAL_BOARDS } from '@/modules/scenarios/ransomware-shadow-wipe/excalidraw';
import { THREECX_TECHNICAL_BOARDS } from '@/modules/scenarios/3cx-desktopapp-supply-chain-lazarus/excalidraw';

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
  'amsi-reflective-dll': AMSI_REFLECTIVE_DLL_TECHNICAL_BOARDS,
  'ransomware-shadow-wipe': LOCKBIT_TECHNICAL_BOARDS,
  '3cx-desktopapp-supply-chain-lazarus': THREECX_TECHNICAL_BOARDS,
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
