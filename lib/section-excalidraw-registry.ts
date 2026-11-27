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
import { XZ_UTILS_TECHNICAL_BOARDS } from '@/modules/scenarios/xz-utils-cve-2024-3094-backdoor/excalidraw';
import { LSASS_COMSVCS_TECHNICAL_BOARDS } from '@/modules/scenarios/dfir-lsass-minidump-comsvcs-sysmon-eid10/excalidraw';
import { KERBEROASTING_TECHNICAL_BOARDS } from '@/modules/scenarios/ad-kerberoasting/excalidraw';
import { ZEROLOGON_TECHNICAL_BOARDS } from '@/modules/scenarios/zerologon-netlogon-cve-2020-1472/excalidraw';
import { DCSYNC_TECHNICAL_BOARDS } from '@/modules/scenarios/dfir-dcsync-drsuapi-replication-eid4662/excalidraw';
import { LOG4SHELL_TECHNICAL_BOARDS } from '@/modules/scenarios/log4shell-dfir/excalidraw';
import { DNS_TUNNEL_TECHNICAL_BOARDS } from '@/modules/scenarios/dns-tunneling-exfil/excalidraw';

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
  'xz-utils-cve-2024-3094-backdoor': XZ_UTILS_TECHNICAL_BOARDS,
  'dfir-lsass-minidump-comsvcs-sysmon-eid10': LSASS_COMSVCS_TECHNICAL_BOARDS,
  'ad-kerberoasting': KERBEROASTING_TECHNICAL_BOARDS,
  'zerologon-netlogon-cve-2020-1472': ZEROLOGON_TECHNICAL_BOARDS,
  'dfir-dcsync-drsuapi-replication-eid4662': DCSYNC_TECHNICAL_BOARDS,
  'log4shell-dfir': LOG4SHELL_TECHNICAL_BOARDS,
  'dns-tunneling-exfil': DNS_TUNNEL_TECHNICAL_BOARDS,
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
