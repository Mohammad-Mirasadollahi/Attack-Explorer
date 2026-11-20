/**
 * Authoring contracts for scenario packages.
 * Domain packages import these types. Workbench code in `lib/` may re-export them.
 * Scenario packages must not import `lib/` to obtain these shapes.
 */

export interface StoryTechnicalMapping {
  /** Plain-language story character, prop, or action */
  storyTerm: string;
  /** Exact technical OS / API / telemetry counterpart */
  technicalTerm: string;
  tone: 'sky' | 'rose' | 'amber' | 'emerald';
}

export interface RawScenarioBriefingGuide {
  headline: string;
  storyAnalogy: string;
  storyMappings?: StoryTechnicalMapping[];
  plainSummary: string;
  diagramTopologySummary: string;
  documentedAdvisory: string;
}

export interface RawScenarioStepGuideItem {
  stepNumber: number;
  mitreId: string;
  plainTitle: string;
  storyAnalogy: string;
  storyMappings?: StoryTechnicalMapping[];
  simpleExplanation: string;
  howItWorksInPractice: string;
  diagramAlignment: string;
  detectionAndEvidence: string;
}

export interface RawScenarioStepGuideData {
  scenarioId: string;
  briefing: RawScenarioBriefingGuide;
  steps: RawScenarioStepGuideItem[];
}

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
