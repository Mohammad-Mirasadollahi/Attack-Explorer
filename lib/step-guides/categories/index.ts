/**
 * Aggregated per-scenario text standard upgrades (one folder per attack under
 * modules/scenarios/<id>/standard-patch.ts). Covers 187 upgraded scenarios;
 * process-hollowing remains the gold-standard without a patch file.
 */
export { ALL_CATEGORY_STANDARD_PATCHES } from '@/modules/scenarios/all-standard-patches';
export type {
  CategoryStandardPatchMap,
  ScenarioStandardPatch,
  StepStandardPatch,
} from './types';
