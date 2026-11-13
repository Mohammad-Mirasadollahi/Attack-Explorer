import { ATTACK_SCENARIOS, AttackCategory, AttackScenario, MITRE_PHASES } from './attack-scenarios';

export interface MitreCategoryDescriptor {
  phase: number;
  tacticCode: string;
  shortName: string;
  fullName: string;
  techniqueCount: number;
}

export interface AttackLibraryItem {
  scenarioId: string;
  code: string;
  name: string;
  shortSubtitle: string;
  overview: string;
  category: Exclude<AttackCategory, 'ALL'>;
  severity: 'HIGH' | 'CRITICAL';
  primaryMitrePhase: number;
  tacticCode: string;
  tacticName: string;
  stageCount: number;
  telemetryCount: number;
  coveredMitreIds: string[];
  logSources: string[];
  stages: Array<{
    index: number;
    title: string;
    mitreTechniqueId: string;
    mitreTechniqueName: string;
    mitreTacticPhase: number;
  }>;
}

export interface AttackLibraryQuery {
  category?: AttackCategory;
  mitrePhase?: number | 'ALL';
  severity?: 'ALL' | 'CRITICAL' | 'HIGH';
  search?: string;
}

export interface AttackLibraryResponse {
  totalCount: number;
  filteredCount: number;
  mitreCategories: MitreCategoryDescriptor[];
  items: AttackLibraryItem[];
}

const TACTIC_CODES: Record<number, string> = {
  1: 'TA0001',
  2: 'TA0002',
  3: 'TA0003 / TA0004',
  4: 'TA0005',
  5: 'TA0006 / TA0007',
  6: 'TA0008 / TA0011',
  7: 'TA0010 / TA0040' };

export function mapScenarioToLibraryItem(
  scenario: AttackScenario
): AttackLibraryItem {
  const phaseMeta =
    MITRE_PHASES.find((p) => p.phase === scenario.primaryMitrePhase) ||
    MITRE_PHASES[0];

  const coveredSet = new Set<string>([scenario.code]);
  scenario.stages.forEach((st) => coveredSet.add(st.mitreTechniqueId));
  scenario.telemetry.forEach((ev) => coveredSet.add(ev.mitreId));

  const logSourceSet = new Set<string>();
  scenario.telemetry.forEach((ev) => logSourceSet.add(ev.protocolOrEventId));

  return {
    scenarioId: scenario.id,
    code: scenario.code,
    name: scenario.name,
    shortSubtitle: scenario.shortSubtitle,
    overview: scenario.overview,
    category: scenario.category,
    severity: scenario.severity,
    primaryMitrePhase: scenario.primaryMitrePhase,
    tacticCode: TACTIC_CODES[scenario.primaryMitrePhase] || 'TA0000',
    tacticName: phaseMeta.shortName,
    stageCount: scenario.stages.length,
    telemetryCount: scenario.telemetry.length,
    coveredMitreIds: Array.from(coveredSet),
    logSources: Array.from(logSourceSet),
    stages: scenario.stages.map((st) => ({
      index: st.index,
      title: st.title,
      mitreTechniqueId: st.mitreTechniqueId,
      mitreTechniqueName: st.mitreTechniqueName,
      mitreTacticPhase: st.mitreTacticPhase })) };
}

export function queryAttackLibrary(
  query: AttackLibraryQuery = {},
  scenarios: AttackScenario[] = ATTACK_SCENARIOS
): AttackLibraryResponse {
  const allItems = scenarios.map(mapScenarioToLibraryItem);

  const mitreCategories: MitreCategoryDescriptor[] = MITRE_PHASES.map((p) => {
    const count = scenarios.filter(
      (s) =>
        s.primaryMitrePhase === p.phase ||
        s.stages.some((st) => st.mitreTacticPhase === p.phase)
    ).length;

    return {
      phase: p.phase,
      tacticCode: TACTIC_CODES[p.phase] || `TA000${p.phase}`,
      shortName: p.shortName,
      fullName: p.fullName,
      techniqueCount: count };
  });

  const normalizedSearch = (query.search || '').trim().toLowerCase();

  const filteredItems = allItems.filter((item) => {
    if (query.category && query.category !== 'ALL') {
      if (query.category === 'ACTIVE_DIRECTORY') {
        if (
          item.category !== 'ACTIVE_DIRECTORY' &&
          item.category !== 'NETWORK_WEB'
        ) {
          return false;
        }
      } else if (item.category !== query.category) {
        return false;
      }
    }

    if (query.mitrePhase && query.mitrePhase !== 'ALL') {
      const matchesPhase =
        item.primaryMitrePhase === query.mitrePhase ||
        item.stages.some((st) => st.mitreTacticPhase === query.mitrePhase);
      if (!matchesPhase) return false;
    }

    if (query.severity && query.severity !== 'ALL') {
      if (item.severity !== query.severity) return false;
    }

    if (normalizedSearch) {
      const haystack = [
        item.code,
        item.name,
        item.name,
        item.shortSubtitle,
        item.shortSubtitle,
        item.overview,
        item.overview,
        item.tacticCode,
        ...item.coveredMitreIds,
        ...item.logSources,
        ...item.stages.map((s) => `${s.mitreTechniqueName} ${s.title}`),
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(normalizedSearch)) {
        return false;
      }
    }

    return true;
  });

  return {
    totalCount: allItems.length,
    filteredCount: filteredItems.length,
    mitreCategories,
    items: filteredItems };
}
