import generated from './dfir-records.generated.json';
import type { ScenarioAttributionProfile } from './attack-sources-and-legal';
import type { ThreatIntelContextData } from './threat-intel-service';

interface DfirRecordFile {
  attributions: Record<string, ScenarioAttributionProfile>;
  intel: Record<string, Omit<ThreatIntelContextData, 'sourceMode' | 'fetchedAt'>>;
}

const records = generated as DfirRecordFile;

/**
 * Precomputed DFIR attribution and threat-intel rows.
 * Kept out of the scenario package graph so the workbench does not download
 * every scenario module just to open Sources.
 */
export const VULNCHECK_CWP_AND_DFIR_ATTRIBUTIONS = records.attributions;
export const VULNCHECK_CWP_AND_DFIR_CURATED_INTEL = records.intel;
