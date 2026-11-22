import catalogJson from './scenario-catalog.generated.json';
import type { AttackLibraryItem } from './attack-library-service';
import type { AttackCategory } from '@/modules/scenarios/types';

export interface ScenarioCatalogEntry {
  id: string;
  code: string;
  name: string;
  shortSubtitle: string;
  category: Exclude<AttackCategory, 'ALL'>;
  severity: 'HIGH' | 'CRITICAL';
  primaryMitrePhase: number;
  stageCount: number;
  mitreIds: string[];
  searchText: string;
  library: AttackLibraryItem;
}

interface ScenarioCatalogFile {
  revision: string;
  entries: ScenarioCatalogEntry[];
}

const catalog = catalogJson as ScenarioCatalogFile;

/** Busts cached scenario JSON after the catalog is regenerated. */
export const SCENARIO_DATA_REVISION = catalog.revision;

export const SCENARIO_CATALOG: ScenarioCatalogEntry[] = catalog.entries;

export const DEFAULT_SCENARIO_ID =
  SCENARIO_CATALOG[0]?.id ?? 'process-hollowing';

export function findScenarioCatalogEntry(
  scenarioId: string
): ScenarioCatalogEntry | undefined {
  return SCENARIO_CATALOG.find((entry) => entry.id === scenarioId);
}

export function filterScenarioCatalog(searchQuery: string): ScenarioCatalogEntry[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return SCENARIO_CATALOG;
  return SCENARIO_CATALOG.filter((entry) => entry.searchText.includes(query));
}
