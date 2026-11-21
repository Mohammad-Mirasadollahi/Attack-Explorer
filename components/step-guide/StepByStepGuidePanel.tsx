'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import {
  buildDiagramStepGuideModel,
} from '@/lib/scenario-step-guides';
import {
  buildScopedStepGuideModel,
  isSeparatedStepsAndSequenceScenario,
} from '@/lib/inspector-scope';
import { DEFAULT_ACTIVE_ENVIRONMENT } from '@/lib/simulation-engine';
import type { CinematicPhase } from '@/lib/cinematic-camera-director';
import type { StepByStepGuidePanelProps } from './types';
import { ExpandedStepGuideView } from './ExpandedStepGuideView';
import { MainScenarioStepGuideView } from './MainScenarioStepGuideView';

export type { StepByStepGuidePanelProps } from './types';

/**
 * Step-by-step guide shell: builds guide models, scroll-syncs the main scenario
 * view, and routes to expanded-sub-board vs main-scenario panels.
 */
export function StepByStepGuidePanel({
  scenario,
  activeStageIndex,
  cinematicPhase = 'OVERVIEW',
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  scopeContext,
  selectedTelemetryId = null,
  onSelectStage,
  onSelectTelemetry,
  onSelectInternalSubNode,
  onStartWalkthrough,
  onResetWalkthrough,
  onOpenProcessHierarchy,
}: StepByStepGuidePanelProps) {
  const resolvedPhase: CinematicPhase = cinematicPhase ?? 'OVERVIEW';
  const briefingRef = useRef<HTMLDivElement | null>(null);
  const stepCardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const outroRef = useRef<HTMLDivElement | null>(null);

  const guideModel = useMemo(
    () =>
      buildDiagramStepGuideModel(
        scenario,
        activeStageIndex,
        resolvedPhase,
        activeEnvironment
      ),
    [scenario, activeStageIndex, resolvedPhase, activeEnvironment]
  );

  const scopedGuideModel = useMemo(
    () =>
      scopeContext
        ? buildScopedStepGuideModel(scopeContext, resolvedPhase)
        : null,
    [scopeContext, resolvedPhase]
  );

  const isExpandedScope = Boolean(
    scopeContext &&
      scopeContext.effectiveScope !== 'MAIN_SCENARIO' &&
      scopeContext.internalSubBoard &&
      scopedGuideModel
  );

  // Keep the focused step card in view when Stage Filter / pills change selection
  useEffect(() => {
    if (isExpandedScope) {
      return;
    }
    if (
      cinematicPhase === 'INTRO_SURVEY' ||
      cinematicPhase === 'INTRO_FOCUS_ORIGIN' ||
      cinematicPhase === 'OVERVIEW' ||
      activeStageIndex === 0
    ) {
      briefingRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      return;
    }

    if (cinematicPhase === 'OUTRO_COMPLETE') {
      outroRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      return;
    }

    const activeEl = stepCardRefs.current[activeStageIndex];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeStageIndex, cinematicPhase, isExpandedScope]);

  const isSeparatedScenario = isSeparatedStepsAndSequenceScenario(scenario.id);

  if (
    isExpandedScope &&
    scopeContext &&
    scopeContext.internalSubBoard &&
    scopedGuideModel
  ) {
    return (
      <ExpandedStepGuideView
        scenario={scenario}
        activeStageIndex={activeStageIndex}
        cinematicPhase={cinematicPhase}
        scopeContext={scopeContext}
        internalSteps={scopedGuideModel.internalSteps}
        isSeparatedScenario={isSeparatedScenario}
        selectedSubNode={scopeContext.selectedSubNode}
        onSelectInternalSubNode={onSelectInternalSubNode}
        onSelectTelemetry={onSelectTelemetry}
      />
    );
  }

  const { briefing, steps } = guideModel;

  return (
    <MainScenarioStepGuideView
      scenario={scenario}
      activeStageIndex={activeStageIndex}
      cinematicPhase={cinematicPhase}
      scopeContext={scopeContext}
      selectedTelemetryId={selectedTelemetryId}
      isSeparatedScenario={isSeparatedScenario}
      briefing={briefing}
      steps={steps}
      briefingRef={briefingRef}
      stepCardRefs={stepCardRefs}
      outroRef={outroRef}
      onSelectStage={onSelectStage}
      onSelectTelemetry={onSelectTelemetry}
      onStartWalkthrough={onStartWalkthrough}
      onResetWalkthrough={onResetWalkthrough}
      onOpenProcessHierarchy={onOpenProcessHierarchy}
    />
  );
}
