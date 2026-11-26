/**
 * Full step-guide registry. Import this from server and test code only.
 * The workbench loads one scenario's guide at a time and must not import this file.
 */
import { STATIC_SCENARIO_STEP_GUIDES } from '@/modules/scenarios/all-step-guides';
import { ALL_CATEGORY_STANDARD_PATCHES } from '@/modules/scenarios/all-standard-patches';
import type {
  RawScenarioBriefingGuide,
  RawScenarioStepGuideData,
  RawScenarioStepGuideItem,
} from '@/modules/scenarios/contracts';
import {
  getSection3DDescriptor,
  stepNumberToSectionKey,
} from './section-3d-registry';
import {
  normalizeStepGuideProse,
  registerScenarioGuideLookup,
} from './scenario-step-guides';

function mergeStepGuidesFirstWins(
  ...batches: Array<Record<string, RawScenarioStepGuideData>>
): Record<string, RawScenarioStepGuideData> {
  const merged: Record<string, RawScenarioStepGuideData> = {};
  for (const batch of batches) {
    for (const [id, guide] of Object.entries(batch)) {
      if (id in merged) continue;
      const patch = ALL_CATEGORY_STANDARD_PATCHES[id];
      const bPatch = patch?.briefing;
      const cleanedBriefing: RawScenarioBriefingGuide = {
        headline: normalizeStepGuideProse(
          bPatch?.headline ?? guide.briefing.headline
        ),
        storyAnalogy: normalizeStepGuideProse(
          bPatch?.storyAnalogy ?? guide.briefing.storyAnalogy
        ),
        storyMappings:
          bPatch?.storyMappings ??
          guide.briefing.storyMappings ??
          getSection3DDescriptor(id, 'briefing')?.storyMappings,
        plainSummary: normalizeStepGuideProse(
          bPatch?.plainSummary ?? guide.briefing.plainSummary
        ),
        diagramTopologySummary: normalizeStepGuideProse(
          bPatch?.diagramTopologySummary ??
            guide.briefing.diagramTopologySummary
        ),
        documentedAdvisory: normalizeStepGuideProse(
          bPatch?.documentedAdvisory ?? guide.briefing.documentedAdvisory
        ),
      };
      merged[id] = {
        ...guide,
        briefing: cleanedBriefing,
        steps: guide.steps.map((step) => {
          const sPatch = patch?.steps?.[step.stepNumber];
          const cleanedStep: RawScenarioStepGuideItem = {
            ...step,
            plainTitle: normalizeStepGuideProse(
              sPatch?.plainTitle ?? step.plainTitle
            ),
            storyAnalogy: normalizeStepGuideProse(
              sPatch?.storyAnalogy ?? step.storyAnalogy
            ),
            storyMappings:
              sPatch?.storyMappings ??
              step.storyMappings ??
              (() => {
                const sk = stepNumberToSectionKey(step.stepNumber);
                return sk
                  ? getSection3DDescriptor(id, sk)?.storyMappings
                  : undefined;
              })(),
            simpleExplanation: normalizeStepGuideProse(
              sPatch?.simpleExplanation ?? step.simpleExplanation
            ),
            howItWorksInPractice: normalizeStepGuideProse(
              sPatch?.howItWorksInPractice ?? step.howItWorksInPractice
            ),
            diagramAlignment: normalizeStepGuideProse(
              sPatch?.diagramAlignment ?? step.diagramAlignment
            ),
            detectionAndEvidence: normalizeStepGuideProse(
              sPatch?.detectionAndEvidence ?? step.detectionAndEvidence
            ),
          };
          if (/\([^)]{25,}\)/.test(cleanedStep.simpleExplanation)) {
            return cleanedStep;
          }
          const cleanPractice = cleanedStep.howItWorksInPractice
            .replace(/[().]/g, '')
            .trim();
          return {
            ...cleanedStep,
            simpleExplanation: `${cleanedStep.simpleExplanation.replace(/\.+\s*$/, '')} (${cleanPractice}).`,
          };
        }),
      };
    }
  }
  return merged;
}

export const ALL_SCENARIO_STEP_GUIDES: Record<string, RawScenarioStepGuideData> =
  mergeStepGuidesFirstWins(STATIC_SCENARIO_STEP_GUIDES);

registerScenarioGuideLookup(
  (scenarioId) => ALL_SCENARIO_STEP_GUIDES[scenarioId] ?? null
);
