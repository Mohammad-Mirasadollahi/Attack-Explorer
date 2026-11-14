import { AttackScenario, TelemetryEvent } from './scenarios/types';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
} from './simulation-engine';
import { buildWhiteboardSchematic } from './sketch-zones-and-drilldown';
import { CinematicPhase } from './cinematic-camera-director';
import { CORE_AND_PALOALTO_STEP_GUIDES } from './step-guides/core-and-paloalto-guides';
import { MS_CISCO_KASPERSKY_STEP_GUIDES } from './step-guides/ms-cisco-kaspersky-guides';
import { BATCH1_SUPPLYCHAIN_MFT_STEP_GUIDES } from './step-guides/batch1-supplychain-mft-guides';
import { BATCH2_AD_EXCHANGE_WINDOWS_STEP_GUIDES } from './step-guides/batch2-ad-exchange-windows-guides';
import { BATCH3_VIRTUALIZATION_APPLIANCES_STEP_GUIDES } from './step-guides/batch3-virtualization-appliances-guides';
import { BATCH4_ENTERPRISE_OS_ZERODAYS_STEP_GUIDES } from './step-guides/batch4-enterprise-os-zerodays-guides';

export interface RawScenarioBriefingGuide {
  headline: string;
  storyAnalogy: string;
  plainSummary: string;
  diagramTopologySummary: string;
  documentedAdvisory: string;
}

export interface RawScenarioStepGuideItem {
  stepNumber: number;
  mitreId: string;
  plainTitle: string;
  storyAnalogy: string;
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

export interface DiagramAlignedStepGuideItem extends RawScenarioStepGuideItem {
  stageTitle: string;
  stageSubtitle: string;
  fromNodeBadge: string;
  toNodeBadge: string;
  forwardFlowBadge: string;
  returnFlowBadge: string;
  protocolOrEventId: string;
  telemetryEvent: TelemetryEvent | null;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
}

export interface DiagramAlignedBriefingModel extends RawScenarioBriefingGuide {
  scenarioCode: string;
  scenarioName: string;
  originNodeLabel: string;
  originNodeBadge: string;
  finalNodeLabel: string;
  finalNodeBadge: string;
  totalStages: number;
  zoneTitles: string[];
  isActiveBriefing: boolean;
  isOutroComplete: boolean;
}

export interface DiagramStepGuideModel {
  scenarioId: string;
  scenarioCode: string;
  scenarioName: string;
  activeStageIndex: number;
  cinematicPhase: CinematicPhase;
  briefing: DiagramAlignedBriefingModel;
  steps: DiagramAlignedStepGuideItem[];
}

export const ALL_SCENARIO_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  ...CORE_AND_PALOALTO_STEP_GUIDES,
  ...MS_CISCO_KASPERSKY_STEP_GUIDES,
  ...BATCH1_SUPPLYCHAIN_MFT_STEP_GUIDES,
  ...BATCH2_AD_EXCHANGE_WINDOWS_STEP_GUIDES,
  ...BATCH3_VIRTUALIZATION_APPLIANCES_STEP_GUIDES,
  ...BATCH4_ENTERPRISE_OS_ZERODAYS_STEP_GUIDES,
};

export function getRawScenarioStepGuide(
  scenarioId: string
): RawScenarioStepGuideData | null {
  return ALL_SCENARIO_STEP_GUIDES[scenarioId] || null;
}

/**
 * Enhances a scenario's overview, stage descriptions, and telemetry explanations
 * with fluent, easy-to-understand, Story-to-Spec narratives strictly grounded
 * in the scenario's documented advisory while preserving all technical identifiers.
 */
export function applyReadableStepGuidesToScenario(
  scenario: AttackScenario
): AttackScenario {
  const guide = getRawScenarioStepGuide(scenario.id);
  if (!guide) return scenario;

  const enhancedStages = scenario.stages.map((stage) => {
    const stepGuide = guide.steps.find((s) => s.stepNumber === stage.index);
    if (!stepGuide) return stage;
    return {
      ...stage,
      description: `${stepGuide.storyAnalogy} ${stepGuide.simpleExplanation} ${stepGuide.howItWorksInPractice} ${stepGuide.diagramAlignment}`,
    };
  });

  const enhancedTelemetry = scenario.telemetry.map((event) => {
    const stepGuide = guide.steps.find((s) => s.stepNumber === event.stageIndex);
    if (!stepGuide) return event;
    return {
      ...event,
      explanation: `${stepGuide.storyAnalogy} ${stepGuide.simpleExplanation} ${stepGuide.howItWorksInPractice} (${stepGuide.detectionAndEvidence})`,
    };
  });

  return {
    ...scenario,
    overview: `${guide.briefing.storyAnalogy} ${guide.briefing.plainSummary} ${guide.briefing.diagramTopologySummary}`,
    stages: enhancedStages,
    telemetry: enhancedTelemetry,
  };
}

/**
 * Builds the synchronized Step-by-Step Guide & Scenario Briefing model
 * aligned with the live diagram nodes (①..⑥), bidirectional flows (#N.1→ / ⇠#N.2),
 * and autoplay cinematic phases.
 */
export function buildDiagramStepGuideModel(
  scenario: AttackScenario,
  activeStageIndex: number,
  cinematicPhase: CinematicPhase = 'OVERVIEW',
  activeEnvironment: ActiveEnvironmentId = DEFAULT_ACTIVE_ENVIRONMENT
): DiagramStepGuideModel {
  const rawGuide = getRawScenarioStepGuide(scenario.id);
  const schematic = buildWhiteboardSchematic(
    scenario,
    Math.max(1, activeStageIndex),
    activeEnvironment
  );

  const originNode = schematic.nodes[0] || null;
  const lastFlow = schematic.flows[schematic.flows.length - 1] || null;
  const finalNode =
    (lastFlow && schematic.nodes.find((n) => n.id === lastFlow.toNodeId)) ||
    schematic.nodes[schematic.nodes.length - 2] ||
    schematic.nodes[schematic.nodes.length - 1] ||
    null;

  const isActiveBriefing =
    activeStageIndex === 0 ||
    cinematicPhase === 'INTRO_SURVEY' ||
    cinematicPhase === 'INTRO_FOCUS_ORIGIN';
  const isOutroComplete = cinematicPhase === 'OUTRO_COMPLETE';

  const briefing: DiagramAlignedBriefingModel = {
    scenarioCode: scenario.code,
    scenarioName: scenario.name,
    headline:
      rawGuide?.briefing.headline ||
      `Scenario Briefing: ${scenario.name}`,
    storyAnalogy:
      rawGuide?.briefing.storyAnalogy ||
      scenario.shortSubtitle,
    plainSummary: rawGuide?.briefing.plainSummary || scenario.overview,
    diagramTopologySummary:
      rawGuide?.briefing.diagramTopologySummary ||
      `Start at ${originNode?.label || 'Origin'} and follow the numbered steps through ${scenario.stages.length} stages to ${finalNode?.label || 'Target'}.`,
    documentedAdvisory:
      rawGuide?.briefing.documentedAdvisory ||
      `${scenario.code} · ${scenario.shortSubtitle}`,
    originNodeLabel: originNode?.label || scenario.nodes[0]?.label || 'Origin',
    originNodeBadge: originNode?.actionBadge || 'HOST ① · Origin',
    finalNodeLabel:
      finalNode?.label ||
      scenario.nodes[scenario.nodes.length - 1]?.label ||
      'Target',
    finalNodeBadge: finalNode?.actionBadge || 'TARGET ⑤ · Objective',
    totalStages: scenario.stages.length,
    zoneTitles: schematic.zones.map((z) => z.title),
    isActiveBriefing,
    isOutroComplete,
  };

  const steps: DiagramAlignedStepGuideItem[] = scenario.stages.map((stage) => {
    const rawStep = rawGuide?.steps.find((s) => s.stepNumber === stage.index);
    const flow =
      schematic.flows.find((f) => f.stageIndex === stage.index) ||
      schematic.flows[stage.index - 1] ||
      null;
    const fromNode =
      (flow && schematic.nodes.find((n) => n.id === flow.fromNodeId)) ||
      schematic.nodes[0] ||
      null;
    const toNode =
      (flow && schematic.nodes.find((n) => n.id === flow.toNodeId)) ||
      schematic.nodes[1] ||
      null;
    const telemetryEvent =
      scenario.telemetry.find((t) => t.stageIndex === stage.index) ||
      scenario.telemetry[stage.index - 1] ||
      null;

    const isBriefingPhase =
      cinematicPhase === 'INTRO_SURVEY' ||
      cinematicPhase === 'INTRO_FOCUS_ORIGIN';

    const status: DiagramAlignedStepGuideItem['status'] = isBriefingPhase
      ? 'UPCOMING'
      : isOutroComplete
      ? 'COMPLETED'
      : activeStageIndex === stage.index
      ? 'ACTIVE'
      : activeStageIndex > stage.index
      ? 'COMPLETED'
      : 'UPCOMING';

    return {
      stepNumber: stage.index,
      mitreId: rawStep?.mitreId || stage.mitreTechniqueId,
      plainTitle: rawStep?.plainTitle || stage.title,
      storyAnalogy: rawStep?.storyAnalogy || stage.subtitle,
      simpleExplanation: rawStep?.simpleExplanation || stage.description,
      howItWorksInPractice: rawStep?.howItWorksInPractice || stage.subtitle,
      diagramAlignment:
        rawStep?.diagramAlignment ||
        `Follow #${stage.index}.1→ from ${fromNode?.label || 'Source'} to ${toNode?.label || 'Target'}.`,
      detectionAndEvidence:
        rawStep?.detectionAndEvidence ||
        telemetryEvent?.info ||
        stage.subtitle,
      stageTitle: stage.title,
      stageSubtitle: stage.subtitle,
      fromNodeBadge: fromNode?.actionBadge || `Node ① · ${fromNode?.label || 'Source'}`,
      toNodeBadge: toNode?.actionBadge || `Node ③ · ${toNode?.label || 'Target'}`,
      forwardFlowBadge: flow
        ? `#${flow.forwardSeq}→ ${flow.label}`
        : `#${stage.index}.1→ ${telemetryEvent?.shortAction || stage.title}`,
      returnFlowBadge: flow
        ? `⇠#${flow.returnSeq} ${flow.returnLabel}`
        : `⇠#${stage.index}.2 ${telemetryEvent?.sizeOrCode || 'ACK'}`,
      protocolOrEventId:
        telemetryEvent?.protocolOrEventId || stage.mitreTechniqueId,
      telemetryEvent,
      status,
    };
  });

  return {
    scenarioId: scenario.id,
    scenarioCode: scenario.code,
    scenarioName: scenario.name,
    activeStageIndex,
    cinematicPhase,
    briefing,
    steps,
  };
}

export function validateAllScenarioStepGuides(scenarios: AttackScenario[]): {
  valid: boolean;
  totalScenarios: number;
  totalSteps: number;
  missingScenarioIds: string[];
  stageCountMismatches: string[];
} {
  const missingScenarioIds: string[] = [];
  const stageCountMismatches: string[] = [];
  let totalSteps = 0;

  for (const sc of scenarios) {
    const guide = getRawScenarioStepGuide(sc.id);
    if (!guide) {
      missingScenarioIds.push(sc.id);
      continue;
    }
    if (guide.steps.length !== sc.stages.length) {
      stageCountMismatches.push(
        `${sc.id}: expected ${sc.stages.length} steps, got ${guide.steps.length}`
      );
    }
    totalSteps += guide.steps.length;
  }

  return {
    valid:
      missingScenarioIds.length === 0 && stageCountMismatches.length === 0,
    totalScenarios: scenarios.length,
    totalSteps,
    missingScenarioIds,
    stageCountMismatches,
  };
}
