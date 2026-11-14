import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import {
  ALL_SCENARIO_STEP_GUIDES,
  buildDiagramStepGuideModel,
  getRawScenarioStepGuide,
  validateAllScenarioStepGuides,
} from './scenario-step-guides';

describe('Scenario Step-by-Step Guides & Scenario Briefing Alignment', () => {
  it('validates that all 26 scenarios have complete step-by-step guides and Scenario Briefings', () => {
    const validation = validateAllScenarioStepGuides(ATTACK_SCENARIOS);
    assert.equal(validation.totalScenarios, 26);
    assert.deepEqual(validation.missingScenarioIds, []);
    assert.deepEqual(validation.stageCountMismatches, []);
    assert.equal(validation.valid, true);
    assert.equal(validation.totalSteps, 80);
  });

  it('ensures every scenario has rich plain-language Scenario Briefings and numbered steps grounded in documentation with zero Persian characters', () => {
    assert.equal(
      /[\u0600-\u06FF]/.test(JSON.stringify(ALL_SCENARIO_STEP_GUIDES)),
      false,
      'Step guides must be 100% English-only with zero Persian characters'
    );

    for (const scenario of ATTACK_SCENARIOS) {
      const rawGuide = getRawScenarioStepGuide(scenario.id);
      assert.ok(rawGuide, `Missing guide for ${scenario.id}`);

      assert.ok(rawGuide.briefing.headline.length > 20, `${scenario.id} briefing headline too short`);
      assert.ok(rawGuide.briefing.storyAnalogy.length > 100, `${scenario.id} briefing storyAnalogy too short`);
      assert.ok(rawGuide.briefing.plainSummary.length > 80, `${scenario.id} briefing plainSummary too short`);
      assert.ok(rawGuide.briefing.diagramTopologySummary.length > 40, `${scenario.id} diagramTopologySummary too short`);
      assert.ok(rawGuide.briefing.documentedAdvisory.length > 10, `${scenario.id} documentedAdvisory too short`);

      assert.equal(rawGuide.steps.length, scenario.stages.length);
      rawGuide.steps.forEach((step, idx) => {
        assert.equal(step.stepNumber, idx + 1);
        assert.ok(step.plainTitle.length > 15, `${scenario.id} step ${step.stepNumber} plainTitle too short`);
        assert.ok(step.storyAnalogy.length > 60, `${scenario.id} step ${step.stepNumber} storyAnalogy too short`);
        assert.ok(step.simpleExplanation.length > 60, `${scenario.id} step ${step.stepNumber} simpleExplanation too short`);
        assert.ok(step.howItWorksInPractice.length > 40, `${scenario.id} step ${step.stepNumber} howItWorksInPractice too short`);
        assert.ok(step.diagramAlignment.includes(`#${step.stepNumber}.1`), `${scenario.id} step ${step.stepNumber} diagramAlignment must reference #${step.stepNumber}.1`);
        assert.ok(step.detectionAndEvidence.length > 25, `${scenario.id} step ${step.stepNumber} detectionAndEvidence too short`);
      });
    }
  });

  it('synchronizes Scenario Briefing (#0) and numbered step statuses across OVERVIEW, INTRO_SURVEY, STAGE_ACTIVE, and OUTRO_COMPLETE', () => {
    const scenario = ATTACK_SCENARIOS[0]; // process-hollowing (5 stages)

    // 1. Overview (stage 0) -> Scenario Briefing is active
    const overviewModel = buildDiagramStepGuideModel(scenario, 0, 'OVERVIEW');
    assert.equal(overviewModel.briefing.isActiveBriefing, true);
    assert.equal(overviewModel.briefing.isOutroComplete, false);
    assert.ok(overviewModel.steps.every((s) => s.status === 'UPCOMING'));

    // 2. Auto-play INTRO_SURVEY (even with activeStageIndex=1) -> Scenario Briefing is active
    const introSurveyModel = buildDiagramStepGuideModel(scenario, 1, 'INTRO_SURVEY');
    assert.equal(introSurveyModel.briefing.isActiveBriefing, true);
    assert.ok(introSurveyModel.steps.every((s) => s.status === 'UPCOMING'));

    // 3. Stage 3 active -> Step 1 & 2 COMPLETED, Step 3 ACTIVE, Step 4 & 5 UPCOMING
    const stage3Model = buildDiagramStepGuideModel(scenario, 3, 'STAGE_ACTIVE');
    assert.equal(stage3Model.briefing.isActiveBriefing, false);
    assert.equal(stage3Model.steps[0].status, 'COMPLETED');
    assert.equal(stage3Model.steps[1].status, 'COMPLETED');
    assert.equal(stage3Model.steps[2].status, 'ACTIVE');
    assert.equal(stage3Model.steps[3].status, 'UPCOMING');
    assert.equal(stage3Model.steps[4].status, 'UPCOMING');
    assert.ok(stage3Model.steps[2].forwardFlowBadge.startsWith('#3.1→'));
    assert.ok(stage3Model.steps[2].returnFlowBadge.startsWith('⇠#3.2'));

    // 4. Outro complete -> all steps COMPLETED and isOutroComplete=true
    const outroModel = buildDiagramStepGuideModel(scenario, 5, 'OUTRO_COMPLETE');
    assert.equal(outroModel.briefing.isOutroComplete, true);
    assert.ok(outroModel.steps.every((s) => s.status === 'COMPLETED'));
  });
});
