/**
 * Workbench projection of scenario guides onto diagrams, telemetry, and playback.
 * Authoring shapes live in `@/modules/scenarios/contracts`. This module stays in
 * `lib/` because it depends on the simulation and sketch engines.
 */
import { AttackScenario, TelemetryEvent } from '@/modules/scenarios/types';
import type {
  RawScenarioBriefingGuide,
  RawScenarioStepGuideData,
  RawScenarioStepGuideItem,
} from '@/modules/scenarios/contracts';

export type {
  RawScenarioBriefingGuide,
  RawScenarioStepGuideData,
  RawScenarioStepGuideItem,
} from '@/modules/scenarios/contracts';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
} from './simulation-engine';
import { buildWhiteboardSchematic } from './sketch-zones-and-drilldown';
import { CinematicPhase } from './cinematic-camera-director';
import { STATIC_SCENARIO_STEP_GUIDES } from '@/modules/scenarios/all-step-guides';
import { VULNCHECK_CWP_AND_DFIR_STEP_GUIDES } from './step-guides/vulncheck-cwp-and-dfir-guides';
import {
  buildStageCommandBreakdowns,
  StageCommandBreakdownItem,
} from './command-line-explanations';
import {
  getSection3DDescriptor,
  stepNumberToSectionKey,
} from './section-3d-registry';
import { ALL_CATEGORY_STANDARD_PATCHES } from './step-guides/categories';

export interface StructuredExplanationClause {
  clauseCode: string;
  coreStatement: string;
  parentheticalReasons: string[];
  fullText: string;
}

export interface BriefingTopologyNodeItem {
  id: string;
  chainOrder: number;
  circledNumber: string;
  label: string;
  sublabel: string;
  actionBadge: string;
  zoneLabel: string;
  iconType: import('./sketch-zones-and-drilldown').SketchIconType;
  isCompromised: boolean;
}

export interface BriefingSequenceWaterfallItem {
  stepNumber: number;
  stageIndex: number;
  forwardSeq: string;
  returnSeq: string;
  actionLabel: string;
  returnLabel: string;
  protocolOrEventId: string;
  mitreId: string;
  fromNodeOrder: number;
  fromNodeCircled: string;
  fromNodeLabel: string;
  fromNodeSublabel: string;
  fromNodeIcon: import('./sketch-zones-and-drilldown').SketchIconType;
  toNodeOrder: number;
  toNodeCircled: string;
  toNodeLabel: string;
  toNodeSublabel: string;
  toNodeIcon: import('./sketch-zones-and-drilldown').SketchIconType;
}

export interface DiagramAlignedStepGuideItem extends RawScenarioStepGuideItem {
  stageTitle: string;
  stageSubtitle: string;
  fromNodeBadge: string;
  fromNodeLabel: string;
  fromNodeSublabel: string;
  fromNodeOrder: number;
  fromNodeCircled: string;
  fromNodeZone: string;
  fromNodeIcon: import('./sketch-zones-and-drilldown').SketchIconType;
  toNodeBadge: string;
  toNodeLabel: string;
  toNodeSublabel: string;
  toNodeOrder: number;
  toNodeCircled: string;
  toNodeZone: string;
  toNodeIcon: import('./sketch-zones-and-drilldown').SketchIconType;
  siemNodeLabel: string;
  siemNodeOrder: number;
  siemNodeCircled: string;
  siemNodeIcon: import('./sketch-zones-and-drilldown').SketchIconType;
  forwardSeq: string;
  returnSeq: string;
  forwardFlowBadge: string;
  returnFlowBadge: string;
  forwardActionLabel: string;
  forwardPayloadSummary: string;
  returnActionLabel: string;
  returnDescription: string;
  continuationHint: string;
  protocolOrEventId: string;
  timestamp: string;
  keySpecs: Array<{ term: string; value: string }>;
  commandBreakdowns: StageCommandBreakdownItem[];
  structuredClauses: StructuredExplanationClause[];
  structuredPracticeClauses: StructuredExplanationClause[];
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
  topologyNodes: BriefingTopologyNodeItem[];
  sequenceWaterfall: BriefingSequenceWaterfallItem[];
  structuredSummaryClauses: StructuredExplanationClause[];
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

/**
 * Splits a multi-sentence or numbered technical paragraph into clean, numbered
 * clauses (outside of parentheses) and extracts substantive parenthetical "(why ...)"
 * reasons so nothing is rendered as a cramped run-on block.
 */
export function parseStructuredExplanationClauses(
  text: string,
  prefixCode: string
): StructuredExplanationClause[] {
  const cleaned = (text || '').trim();
  if (!cleaned) return [];

  // Split on sentence boundaries ". " or "; " that occur at parenthesis depth 0
  const rawSentences: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === '(') depth++;
    else if (ch === ')' && depth > 0) depth--;

    current += ch;

    if (
      depth === 0 &&
      (ch === '.' || ch === ';') &&
      i + 1 < cleaned.length &&
      /\s/.test(cleaned[i + 1])
    ) {
      // Avoid splitting on common abbreviations like "v2.", "e.g.", "i.e.", "Dr.", "Mr.", "vs."
      const tail = current.slice(-6).toLowerCase();
      if (!/(?:e\.g\.|i\.e\.|vs\.|v\d+\.|\b\d+\.)$/.test(tail)) {
        rawSentences.push(current.trim());
        current = '';
        while (i + 1 < cleaned.length && /\s/.test(cleaned[i + 1])) {
          i++;
        }
      }
    }
  }
  if (current.trim()) {
    rawSentences.push(current.trim());
  }

  // Merge any sentence that starts with "(" onto the preceding sentence so parentheticals never become orphan clauses
  const mergedSentences: string[] = [];
  for (const s of rawSentences) {
    if (s.startsWith('(') && mergedSentences.length > 0) {
      const prev = mergedSentences[mergedSentences.length - 1].replace(
        /[.;]+\s*$/,
        ''
      );
      mergedSentences[mergedSentences.length - 1] = `${prev} ${s}`;
    } else {
      mergedSentences.push(s);
    }
  }

  return mergedSentences.map((sentence, idx) => {
    const parentheticalReasons: string[] = [];
    let coreBuilder = '';
    let pDepth = 0;
    let groupContent = '';

    for (let i = 0; i < sentence.length; i++) {
      const c = sentence[i];
      if (c === '(') {
        if (pDepth === 0) {
          groupContent = '';
        } else {
          groupContent += c;
        }
        pDepth++;
      } else if (c === ')' && pDepth > 0) {
        pDepth--;
        if (pDepth === 0) {
          const trimmedGroup = groupContent.trim();
          if (trimmedGroup.length >= 18) {
            parentheticalReasons.push(trimmedGroup);
          } else {
            coreBuilder += `(${groupContent})`;
          }
          groupContent = '';
        } else {
          groupContent += c;
        }
      } else if (pDepth > 0) {
        groupContent += c;
      } else {
        coreBuilder += c;
      }
    }

    if (pDepth > 0 && groupContent) {
      coreBuilder += `(${groupContent}`;
    }

    const coreStatement = coreBuilder
      .replace(/\s+/g, ' ')
      .replace(/\s+([,;:])/g, '$1')
      .replace(/\s+\.(?=\s|$)/g, '.')
      .trim();

    return {
      clauseCode: `${prefixCode}.${idx + 1}`,
      coreStatement: coreStatement || sentence,
      parentheticalReasons,
      fullText: sentence,
    };
  });
}

/**
 * Cleans step-guide prose by removing unnecessary em-dashes, raw backticks,
 * markdown bold/italic markers, and literal "(why:" prefixes while preserving
 * legitimate technical hyphens (CVE IDs, CLI flags, memory permissions).
 */
export function normalizeStepGuideProse(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+){0,3})\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/`/g, '')
    .replace(/WHY\s*\/\s*(?:SPEC|PROTOCOL\s*EFFECT)\s*:?\s*/gi, '')
    .replace(/\(\s*why\s+[^:)]*:\s*/gi, '(because ')
    .replace(/\(\s*why:\s*/gi, '(because ')
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s+-\s+(?=[a-zA-Z])/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*\)/g, ')')
    .replace(/\(\s*,\s*/g, '(')
    .replace(/,\s*\./g, '.')
    .replace(/:\s*,/g, ':')
    .replace(/;\s*,/g, ';')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Later batches must not overwrite richer guides already registered for the same id. */
function mergeStepGuidesFirstWins(
  ...batches: Array<Record<string, RawScenarioStepGuideData>>
): Record<string, RawScenarioStepGuideData> {
  const merged: Record<string, RawScenarioStepGuideData> = {};
  for (const batch of batches) {
    for (const [id, guide] of Object.entries(batch)) {
      if (!(id in merged)) {
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
  }
  return merged;
}

export const ALL_SCENARIO_STEP_GUIDES: Record<string, RawScenarioStepGuideData> =
  mergeStepGuidesFirstWins(
    STATIC_SCENARIO_STEP_GUIDES,
    VULNCHECK_CWP_AND_DFIR_STEP_GUIDES
  );

export function getRawScenarioStepGuide(
  scenarioId: string
): RawScenarioStepGuideData | null {
  return ALL_SCENARIO_STEP_GUIDES[scenarioId] || null;
}

const CIRCLED_NODE_NUMBERS = ['①', '②', '③', '④', '⑤', '⑥'];

function formatNodeRef(
  node: { chainOrder: number; label: string } | null | undefined,
  fallbackOrder: number,
  fallbackLabel: string
): string {
  const order = node?.chainOrder || fallbackOrder;
  const circled = CIRCLED_NODE_NUMBERS[order - 1] || `#${order}`;
  const label = node?.label || fallbackLabel;
  return `Node ${circled} (#${order} ${label})`;
}

function weaveSequenceExchangeIntoPractice(
  basePractice: string,
  simpleExplanation: string,
  opts: {
    protocolOrEventId: string;
    fromLabel: string;
    toLabel: string;
    actionLabel: string;
    returnLabel: string;
    stageTitle: string;
    nextStageTitle?: string;
    nextStageIndex?: number;
    scenarioName: string;
  }
): string {
  const cleanedPractice = normalizeStepGuideProse(basePractice);
  if (/\([^)]{18,}\)/.test(cleanedPractice)) {
    return cleanedPractice;
  }

  const proto = normalizeStepGuideProse(opts.protocolOrEventId);
  const retLabel = normalizeStepGuideProse(opts.returnLabel || 'ACK');
  const actLabel = normalizeStepGuideProse(opts.actionLabel || opts.stageTitle);
  const fromClean = normalizeStepGuideProse(opts.fromLabel);
  const toClean = normalizeStepGuideProse(opts.toLabel);

  const nextOutcomeClause = opts.nextStageTitle
    ? `and establishing the runtime state required for Step #${opts.nextStageIndex} ${normalizeStepGuideProse(opts.nextStageTitle)}`
    : `and completing the final execution objective of ${normalizeStepGuideProse(opts.scenarioName)}`;

  const combinedLower = `${simpleExplanation} ${cleanedPractice}`.toLowerCase();
  if (
    retLabel &&
    retLabel.toLowerCase() !== 'ack' &&
    !combinedLower.includes(retLabel.toLowerCase())
  ) {
    return `${cleanedPractice.replace(/\.?\s*$/, '.')} In the documented ${proto} exchange from ${fromClean} to ${toClean}, ${toClean} responds with ${retLabel} (confirming that the ${actLabel} request succeeded on ${toClean} ${nextOutcomeClause}).`;
  }

  return `${cleanedPractice.replace(/\.?\s*$/, '')} (completing the documented ${proto} ${actLabel} exchange from ${fromClean} to ${toClean} with ${retLabel} ${nextOutcomeClause}).`;
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

  const schematic = buildWhiteboardSchematic(
    scenario,
    1,
    DEFAULT_ACTIVE_ENVIRONMENT
  );
  const siemNode =
    schematic.nodes[5] ||
    schematic.nodes[schematic.nodes.length - 1] ||
    null;

  const enhancedStages = scenario.stages.map((stage, sIdx) => {
    const stepGuide = guide.steps.find((s) => s.stepNumber === stage.index);
    if (!stepGuide) return stage;
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
    const nextStage = scenario.stages[sIdx + 1];
    const enrichedPractice = weaveSequenceExchangeIntoPractice(
      stepGuide.howItWorksInPractice,
      stepGuide.simpleExplanation,
      {
        protocolOrEventId:
          telemetryEvent?.protocolOrEventId || stage.mitreTechniqueId,
        fromLabel:
          fromNode?.label || telemetryEvent?.sourceLabel || 'Source Host',
        toLabel: toNode?.label || telemetryEvent?.targetLabel || 'Target Host',
        actionLabel:
          flow?.label || telemetryEvent?.shortAction || stage.title,
        returnLabel:
          flow?.returnLabel || telemetryEvent?.sizeOrCode || 'ACK',
        stageTitle: stage.title,
        nextStageTitle: nextStage?.title,
        nextStageIndex: nextStage?.index,
        scenarioName: scenario.name,
      }
    );
    const forwardCode = flow ? `#${flow.forwardSeq}→` : `#${stage.index}→`;
    const returnCode = flow ? `⇠#${flow.returnSeq}` : `⇠#${stage.index}`;
    const syncedAlignment = `On the diagram, follow Step #${stage.index} / Link #${stage.index} (${forwardCode} ${flow?.label || stage.title} / ${returnCode} ${flow?.returnLabel || 'ACK'}) from ${formatNodeRef(fromNode, 1, 'Source')} to ${formatNodeRef(toNode, 2, 'Target')}, monitored by ${formatNodeRef(siemNode, 6, 'SIEM')}.`;

    return {
      ...stage,
      description: `${stepGuide.storyAnalogy} ${stepGuide.simpleExplanation} ${enrichedPractice} ${syncedAlignment}`,
    };
  });

  const enhancedTelemetry = scenario.telemetry.map((event) => {
    const stepGuide = guide.steps.find((s) => s.stepNumber === event.stageIndex);
    if (!stepGuide) return event;
    const stageIdx = scenario.stages.findIndex(
      (st) => st.index === event.stageIndex
    );
    const stage = scenario.stages[stageIdx] || scenario.stages[0];
    const nextStage = stageIdx >= 0 ? scenario.stages[stageIdx + 1] : undefined;
    const flow =
      schematic.flows.find((f) => f.stageIndex === event.stageIndex) ||
      schematic.flows[event.stageIndex - 1] ||
      null;
    const enrichedPractice = weaveSequenceExchangeIntoPractice(
      stepGuide.howItWorksInPractice,
      stepGuide.simpleExplanation,
      {
        protocolOrEventId: event.protocolOrEventId,
        fromLabel: event.sourceLabel,
        toLabel: event.targetLabel,
        actionLabel: flow?.label || event.shortAction,
        returnLabel: flow?.returnLabel || event.sizeOrCode,
        stageTitle: stage?.title || event.shortAction,
        nextStageTitle: nextStage?.title,
        nextStageIndex: nextStage?.index,
        scenarioName: scenario.name,
      }
    );
    return {
      ...event,
      explanation: `${stepGuide.storyAnalogy} ${stepGuide.simpleExplanation} ${enrichedPractice} (${stepGuide.detectionAndEvidence})`,
    };
  });

  return {
    ...scenario,
    overview: `${guide.briefing.storyAnalogy} ${guide.briefing.plainSummary}`,
    stages: enhancedStages,
    telemetry: enhancedTelemetry,
  };
}

/**
 * Builds the synchronized Step-by-Step Guide & Scenario Briefing model
 * aligned with the live diagram nodes (①..⑥), bidirectional flows (#N→ / ⇠#N),
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
  const zoneById = new Map(schematic.zones.map((z) => [z.id, z]));

  const originNode = schematic.nodes[0] || null;
  const lastFlow = schematic.flows[schematic.flows.length - 1] || null;
  const finalNode =
    (lastFlow && schematic.nodes.find((n) => n.id === lastFlow.toNodeId)) ||
    schematic.nodes[schematic.nodes.length - 2] ||
    schematic.nodes[schematic.nodes.length - 1] ||
    null;
  const siemNode =
    schematic.nodes[5] ||
    schematic.nodes[schematic.nodes.length - 1] ||
    null;

  const isActiveBriefing =
    activeStageIndex === 0 ||
    cinematicPhase === 'INTRO_SURVEY' ||
    cinematicPhase === 'INTRO_FOCUS_ORIGIN';
  const isOutroComplete = cinematicPhase === 'OUTRO_COMPLETE';

  const topologyNodes: BriefingTopologyNodeItem[] = schematic.nodes.map((n) => {
    const z = zoneById.get(n.zoneId);
    return {
      id: n.id,
      chainOrder: n.chainOrder,
      circledNumber:
        CIRCLED_NODE_NUMBERS[n.chainOrder - 1] || `#${n.chainOrder}`,
      label: n.label,
      sublabel: n.sublabel,
      actionBadge: n.actionBadge,
      zoneLabel: z ? `${z.code} · ${z.title}` : n.zoneLabel || 'Network Zone',
      iconType: n.iconType,
      isCompromised: Boolean(n.isCompromised),
    };
  });

  const sequenceWaterfall: BriefingSequenceWaterfallItem[] =
    schematic.flows.map((fl) => {
      const fn =
        schematic.nodes.find((n) => n.id === fl.fromNodeId) ||
        schematic.nodes[0];
      const tn =
        schematic.nodes.find((n) => n.id === fl.toNodeId) ||
        schematic.nodes[1] ||
        schematic.nodes[0];
      const fc = fn
        ? CIRCLED_NODE_NUMBERS[fn.chainOrder - 1] || `#${fn.chainOrder}`
        : '①';
      const tc = tn
        ? CIRCLED_NODE_NUMBERS[tn.chainOrder - 1] || `#${tn.chainOrder}`
        : '②';
      return {
        stepNumber: fl.stepNo,
        stageIndex: fl.stageIndex,
        forwardSeq: fl.forwardSeq || String(fl.stepNo),
        returnSeq: fl.returnSeq || String(fl.stepNo),
        actionLabel: fl.label,
        returnLabel: fl.returnLabel || 'ACK',
        protocolOrEventId: fl.telemetryEvent.protocolOrEventId,
        mitreId: fl.telemetryEvent.mitreId,
        fromNodeOrder: fn?.chainOrder || 1,
        fromNodeCircled: fc,
        fromNodeLabel: fn?.label || 'Origin',
        fromNodeSublabel: fn?.sublabel || '',
        fromNodeIcon: fn?.iconType || 'VICTIM_LAPTOP',
        toNodeOrder: tn?.chainOrder || 2,
        toNodeCircled: tc,
        toNodeLabel: tn?.label || 'Target',
        toNodeSublabel: tn?.sublabel || '',
        toNodeIcon: tn?.iconType || 'MALWARE_PAYLOAD',
      };
    });

  const plainSummaryText = normalizeStepGuideProse(
    rawGuide?.briefing.plainSummary || scenario.overview
  );

  const briefing: DiagramAlignedBriefingModel = {
    scenarioCode: scenario.code,
    scenarioName: scenario.name,
    headline: normalizeStepGuideProse(
      rawGuide?.briefing.headline ||
        `Scenario Briefing: ${scenario.name}`
    ),
    storyAnalogy: normalizeStepGuideProse(
      rawGuide?.briefing.storyAnalogy ||
        scenario.shortSubtitle
    ),
    storyMappings: rawGuide?.briefing.storyMappings,
    plainSummary: plainSummaryText,
    diagramTopologySummary: normalizeStepGuideProse(
      rawGuide?.briefing.diagramTopologySummary ||
        `Topology spans ${topologyNodes.length} nodes across ${sequenceWaterfall.length} chronological steps (#1→ to #${sequenceWaterfall.length}→).`
    ),
    documentedAdvisory: normalizeStepGuideProse(
      rawGuide?.briefing.documentedAdvisory ||
        `${scenario.code} · ${scenario.shortSubtitle}`
    ),
    originNodeLabel: originNode?.label || scenario.nodes[0]?.label || 'Origin',
    originNodeBadge: originNode?.actionBadge || 'HOST ① · Origin',
    finalNodeLabel:
      finalNode?.label ||
      scenario.nodes[scenario.nodes.length - 1]?.label ||
      'Target',
    finalNodeBadge: finalNode?.actionBadge || 'TARGET ⑤ · Objective',
    totalStages: scenario.stages.length,
    zoneTitles: schematic.zones.map((z) => z.title),
    topologyNodes,
    sequenceWaterfall,
    structuredSummaryClauses: parseStructuredExplanationClauses(
      plainSummaryText,
      '0'
    ),
    isActiveBriefing,
    isOutroComplete,
  };

  const steps: DiagramAlignedStepGuideItem[] = scenario.stages.map(
    (stage, sIdx) => {
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
      const fromZone = fromNode ? zoneById.get(fromNode.zoneId) : null;
      const toZone = toNode ? zoneById.get(toNode.zoneId) : null;
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

      const forwardSeq = flow ? flow.forwardSeq : String(stage.index);
      const returnSeq = flow ? flow.returnSeq : String(stage.index);
      const forwardCode = `#${forwardSeq}→`;
      const returnCode = `⇠#${returnSeq}`;
      const syncedAlignment = `On the diagram, follow Step #${stage.index} / Link #${stage.index} (${forwardCode} ${flow?.label || stage.title} / ${returnCode} ${flow?.returnLabel || 'ACK'}) from ${formatNodeRef(fromNode, 1, 'Source')} to ${formatNodeRef(toNode, 2, 'Target')}, monitored by ${formatNodeRef(siemNode, 6, 'SIEM')}.`;

      const nextStage = scenario.stages[sIdx + 1];
      const simpleExplanationText = normalizeStepGuideProse(
        rawStep?.simpleExplanation || stage.description
      );
      const practiceText = weaveSequenceExchangeIntoPractice(
        rawStep?.howItWorksInPractice || stage.subtitle,
        simpleExplanationText,
        {
          protocolOrEventId:
            telemetryEvent?.protocolOrEventId || stage.mitreTechniqueId,
          fromLabel:
            fromNode?.label || telemetryEvent?.sourceLabel || 'Source Host',
          toLabel:
            toNode?.label || telemetryEvent?.targetLabel || 'Target Host',
          actionLabel:
            flow?.label || telemetryEvent?.shortAction || stage.title,
          returnLabel:
            flow?.returnLabel || telemetryEvent?.sizeOrCode || 'ACK',
          stageTitle: stage.title,
          nextStageTitle: nextStage?.title,
          nextStageIndex: nextStage?.index,
          scenarioName: scenario.name,
        }
      );
      const continuationHint = normalizeStepGuideProse(
        flow?.traceMeta?.continuationHint ||
          (nextStage
            ? `Next in kill-chain: unlocks Step #${nextStage.index} (${nextStage.title} · ${nextStage.mitreTechniqueId}).`
            : `Completes the ${scenario.stages.length}-step kill-chain for ${scenario.name}.`)
      );

      const fromOrder = fromNode?.chainOrder || 1;
      const toOrder = toNode?.chainOrder || 2;
      const siemOrder = siemNode?.chainOrder || 6;

      return {
        stepNumber: stage.index,
        mitreId: stage.mitreTechniqueId || rawStep?.mitreId || scenario.code,
        plainTitle: normalizeStepGuideProse(rawStep?.plainTitle || stage.title),
        storyAnalogy: normalizeStepGuideProse(
          rawStep?.storyAnalogy || stage.subtitle
        ),
        storyMappings: rawStep?.storyMappings,
        simpleExplanation: simpleExplanationText,
        howItWorksInPractice: practiceText,
        diagramAlignment: syncedAlignment,
        detectionAndEvidence: normalizeStepGuideProse(
          rawStep?.detectionAndEvidence ||
            telemetryEvent?.info ||
            stage.subtitle
        ),
        stageTitle: stage.title,
        stageSubtitle: stage.subtitle,
        fromNodeBadge:
          fromNode?.actionBadge || `Node ① · ${fromNode?.label || 'Source'}`,
        fromNodeLabel: fromNode?.label || 'Source Node',
        fromNodeSublabel: fromNode?.sublabel || '',
        fromNodeOrder: fromOrder,
        fromNodeCircled:
          CIRCLED_NODE_NUMBERS[fromOrder - 1] || `#${fromOrder}`,
        fromNodeZone: fromZone
          ? `${fromZone.code} · ${fromZone.title}`
          : fromNode?.zoneLabel || 'Source Zone',
        fromNodeIcon: fromNode?.iconType || 'VICTIM_LAPTOP',
        toNodeBadge:
          toNode?.actionBadge || `Node ③ · ${toNode?.label || 'Target'}`,
        toNodeLabel: toNode?.label || 'Target Node',
        toNodeSublabel: toNode?.sublabel || '',
        toNodeOrder: toOrder,
        toNodeCircled: CIRCLED_NODE_NUMBERS[toOrder - 1] || `#${toOrder}`,
        toNodeZone: toZone
          ? `${toZone.code} · ${toZone.title}`
          : toNode?.zoneLabel || 'Target Zone',
        toNodeIcon: toNode?.iconType || 'MALWARE_PAYLOAD',
        siemNodeLabel: siemNode?.label || 'SOC SIEM & EDR Sensor',
        siemNodeOrder: siemOrder,
        siemNodeCircled:
          CIRCLED_NODE_NUMBERS[siemOrder - 1] || `#${siemOrder}`,
        siemNodeIcon: siemNode?.iconType || 'SIEM_SENSOR',
        forwardSeq,
        returnSeq,
        forwardFlowBadge: flow
          ? `#${flow.forwardSeq}→ ${flow.label}`
          : `#${stage.index}→ ${telemetryEvent?.shortAction || stage.title}`,
        returnFlowBadge: flow
          ? `⇠#${flow.returnSeq} ${flow.returnLabel}`
          : `⇠#${stage.index} ${telemetryEvent?.sizeOrCode || 'ACK'}`,
        forwardActionLabel:
          flow?.label || telemetryEvent?.shortAction || stage.title,
        forwardPayloadSummary: telemetryEvent?.info || stage.subtitle,
        returnActionLabel:
          flow?.returnLabel || telemetryEvent?.sizeOrCode || 'ACK / Status',
        returnDescription:
          flow?.traceMeta?.returnDescription ||
          `${toNode?.label || 'Target'} returns ${flow?.returnLabel || telemetryEvent?.sizeOrCode || 'status'} back to ${fromNode?.label || 'Initiator'}.`,
        continuationHint,
        protocolOrEventId:
          telemetryEvent?.protocolOrEventId || stage.mitreTechniqueId,
        timestamp: telemetryEvent?.timestamp || `00:00.${stage.index}00`,
        keySpecs: stage.keySpecs || [],
        commandBreakdowns: buildStageCommandBreakdowns(scenario, stage),
        structuredClauses: parseStructuredExplanationClauses(
          simpleExplanationText,
          String(stage.index)
        ),
        structuredPracticeClauses: parseStructuredExplanationClauses(
          practiceText,
          `${stage.index}.M`
        ),
        telemetryEvent,
        status,
      };
    }
  );

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
