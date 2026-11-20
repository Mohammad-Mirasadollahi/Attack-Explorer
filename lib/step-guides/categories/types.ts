import type { StoryTechnicalMapping } from '../../section-3d-registry';

export interface StepStandardPatch {
  plainTitle?: string;
  storyAnalogy: string;
  storyMappings: StoryTechnicalMapping[];
  simpleExplanation?: string;
  howItWorksInPractice?: string;
  diagramAlignment?: string;
  detectionAndEvidence?: string;
}

export interface ScenarioStandardPatch {
  briefing: {
    headline?: string;
    storyAnalogy: string;
    storyMappings: StoryTechnicalMapping[];
    plainSummary?: string;
    diagramTopologySummary?: string;
    documentedAdvisory?: string;
  };
  /** 1-based stepNumber map */
  steps: Record<number, StepStandardPatch>;
}

export type CategoryStandardPatchMap = Record<string, ScenarioStandardPatch>;
