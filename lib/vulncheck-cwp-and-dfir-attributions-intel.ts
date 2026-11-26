import type { ScenarioAttributionProfile } from './attack-sources-and-legal';
import type { ThreatIntelContextData } from './threat-intel-service';

/**
 * Legacy DFIR draft attribution/intel records were purged in Phase 1 (MOD-17 §2.2).
 * All 564 preserved primary source URLs live in
 * `/docs/redesign-backlog/PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md` for Phase 2 bespoke rebuilds.
 */
export const VULNCHECK_CWP_AND_DFIR_ATTRIBUTIONS: Record<
  string,
  ScenarioAttributionProfile
> = {};

export const VULNCHECK_CWP_AND_DFIR_CURATED_INTEL: Record<
  string,
  Omit<ThreatIntelContextData, 'sourceMode' | 'fetchedAt'>
> = {};
