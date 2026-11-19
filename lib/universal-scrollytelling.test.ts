import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import {
  computeSubStepScrollThresholdEffect,
  computeUniversalScrollyVisualState,
  getUniversalScenarioScrollySpec,
  interpolateSvgPathStrings,
} from './universal-scrollytelling';

describe('Universal Cinematic Scrollytelling Engine (All Scenarios)', () => {
  it('generates complete 4-phase (A, B, C, D) scrollytelling specifications for every scenario in ATTACK_SCENARIOS', () => {
    assert.ok(ATTACK_SCENARIOS.length >= 10, 'Should have multiple scenarios in ATTACK_SCENARIOS');

    const persianRegex = /[\u0600-\u06FF]/;
    const seenArchetypes = new Set<string>();
    const seenChoreographies = new Set<string>();

    for (const scenario of ATTACK_SCENARIOS) {
      const spec = getUniversalScenarioScrollySpec(scenario);
      seenArchetypes.add(spec.archetype);

      // Stage 0 (Briefing) + N stages
      assert.equal(
        spec.chapters.length,
        scenario.stages.length + 1,
        `Scenario ${scenario.id} should have Stage #0 plus ${scenario.stages.length} kill-chain stages`
      );
      assert.equal(
        spec.allSubSteps.length,
        (scenario.stages.length + 1) * 4,
        `Scenario ${scenario.id} should have 4 sub-steps (A..D) per chapter`
      );

      for (const chapter of spec.chapters) {
        assert.equal(chapter.subSteps.length, 4);
        assert.deepEqual(
          chapter.subSteps.map((s) => s.subStepLetter),
          ['A', 'B', 'C', 'D']
        );

        for (const sub of chapter.subSteps) {
          seenChoreographies.add(sub.visualChoreography);
          assert.ok(sub.headline.length > 5, `Headline missing for ${scenario.id} ${sub.id}`);
          assert.ok(sub.explanation.length > 15, `Explanation missing for ${scenario.id} ${sub.id}`);
          assert.ok(
            !persianRegex.test(sub.headline) && !persianRegex.test(sub.explanation),
            `Sub-step ${sub.id} in ${scenario.id} must be English-only`
          );
          assert.ok(
            sub.scrollThresholdStart >= 0 &&
              sub.scrollThresholdPeak >= sub.scrollThresholdStart &&
              sub.scrollThresholdEnd >= sub.scrollThresholdPeak &&
              sub.scrollThresholdEnd <= 1.0001,
            `Invalid scroll threshold window for ${scenario.id} ${sub.id}`
          );
        }
      }
    }

    // Verify non-uniform, tailored archetypes and visual choreographies across scenarios and layers
    assert.ok(
      seenArchetypes.size >= 4,
      `Expected at least 4 distinct scenario archetypes across library, got ${seenArchetypes.size}`
    );
    assert.ok(
      seenChoreographies.size >= 6,
      `Expected at least 6 distinct visual choreographies across layers, got ${seenChoreographies.size}`
    );
  });

  it('assigns distinct visual choreographies to non-technical analogy (A), sequence bridge (B), technical deep-dive (C), and SIEM detection (D)', () => {
    const kerberoast =
      ATTACK_SCENARIOS.find((s) => s.id === 'ad-kerberoasting') || ATTACK_SCENARIOS[1];
    const spec = getUniversalScenarioScrollySpec(kerberoast);
    const stage1 = spec.chapters[1];
    assert.ok(stage1);

    const [subA, subB, subC, subD] = stage1.subSteps;
    assert.equal(subA.layerKind, 'ANALOGY_NARRATIVE');
    assert.equal(subA.visualChoreography, 'ANALOGY_MENTAL_MODEL_SCHEMATIC');

    assert.equal(subB.layerKind, 'CONCEPT_BRIDGE');
    assert.equal(subB.visualChoreography, 'SEQUENCE_BIDIRECTIONAL_CONDUIT');

    assert.equal(subC.layerKind, 'TECHNICAL_DEEP_DIVE');
    assert.notEqual(subC.visualChoreography, subA.visualChoreography);
    assert.notEqual(subC.visualChoreography, subB.visualChoreography);

    assert.equal(subD.layerKind, 'FORENSIC_DETECTION');
    assert.equal(subD.visualChoreography, 'SIEM_DETECTION_CORRELATION_RADAR');
  });

  it('smoothly interpolates SVG path strings for framer-motion scroll-driven path morphing', () => {
    const pathA = 'M 24 64 C 110 20, 190 20, 270 64';
    const pathB = 'M 24 84 C 110 60, 190 100, 270 24';

    assert.equal(interpolateSvgPathStrings(pathA, pathB, 0), pathA);
    assert.equal(interpolateSvgPathStrings(pathA, pathB, 1), pathB);

    const mid = interpolateSvgPathStrings(pathA, pathB, 0.5);
    assert.equal(mid, 'M 24 74 C 110 40, 190 60, 270 44');
  });

  it('computes scroll threshold fade in/out and active right-hand marker fill ratio accurately', () => {
    const sampleSubStep = {
      scrollThresholdStart: 0.2,
      scrollThresholdPeak: 0.25,
      scrollThresholdEnd: 0.3,
    };

    const activeEffect = computeSubStepScrollThresholdEffect(0.25, sampleSubStep, true);
    assert.equal(activeEffect.opacity, 1);
    assert.equal(activeEffect.translateY, 0);
    assert.equal(activeEffect.markerFillRatio, 1);

    const nearEffect = computeSubStepScrollThresholdEffect(0.28, sampleSubStep, false);
    assert.ok(nearEffect.opacity > 0.64 && nearEffect.opacity < 1);
    assert.ok(nearEffect.markerFillRatio > 0 && nearEffect.markerFillRatio < 1);

    const farEffect = computeSubStepScrollThresholdEffect(0.85, sampleSubStep, false);
    assert.equal(farEffect.opacity, 0.64);
    assert.equal(farEffect.markerFillRatio, 0);
  });

  it('computes deterministic universal visual state with morphing paths and preserves process-hollowing native state', () => {
    const phScenario = ATTACK_SCENARIOS.find((s) => s.id === 'process-hollowing')!;
    const phState = computeUniversalScrollyVisualState(phScenario, 2, 0.6);
    assert.equal(phState.stageNumber, 2);
    assert.equal(phState.activeSubStepId, '2C');
    assert.ok(phState.processHollowingState !== null);
    assert.ok(phState.interpolatedPrimaryPathD.startsWith('M '));

    const log4shell =
      ATTACK_SCENARIOS.find((s) => s.id === 'log4shell-dfir') || ATTACK_SCENARIOS[2];
    const l4sState = computeUniversalScrollyVisualState(log4shell, 1, 0.35);
    assert.equal(l4sState.stageNumber, 1);
    assert.equal(l4sState.activeSubStepId, '1B');
    assert.equal(l4sState.processHollowingState, null);
    assert.ok(l4sState.interpolatedPrimaryPathD.startsWith('M '));
  });

  it('builds NotebookLM-style 3-shape interacting choreography and 3 text-to-motion cues for every sub-step across all scenarios', () => {
    const seenMechanisms = new Set<string>();
    const seenInternalMotions = new Set<string>();

    for (const scenario of ATTACK_SCENARIOS) {
      const spec = getUniversalScenarioScrollySpec(scenario);
      for (const sub of spec.allSubSteps) {
        const ch = sub.shapeChoreography;
        assert.ok(ch, `Missing shapeChoreography for ${scenario.id} ${sub.id}`);
        seenMechanisms.add(ch.mechanismKind);

        assert.equal(ch.shapes.length, 3, `Expected 3 interacting shapes for ${scenario.id} ${sub.id}`);
        assert.deepEqual(
          ch.shapes.map((s) => s.shapeId),
          ['S1', 'S2', 'S3']
        );
        for (const sh of ch.shapes) {
          seenInternalMotions.add(sh.internalMotionKind);
          assert.ok(sh.title.length > 0);
          assert.ok(sh.liveMetricLabel.length > 0);
        }

        assert.equal(ch.motions.length, 3, `Expected 3 motion cues for ${scenario.id} ${sub.id}`);
        assert.deepEqual(
          ch.motions.map((m) => m.motionCode),
          ['MOTION ①', 'MOTION ②', 'MOTION ③']
        );
        for (const m of ch.motions) {
          assert.ok(m.shapeToTextExplanation.length > 20);
          assert.ok(m.vectorLabel.length > 2);
        }
      }
    }

    assert.ok(
      seenMechanisms.size >= 12,
      `Expected at least 12 distinct text-driven shape mechanisms across scenarios, got ${seenMechanisms.size}`
    );
    assert.ok(
      seenInternalMotions.size >= 8,
      `Expected at least 8 distinct internal shape motion engines, got ${seenInternalMotions.size}`
    );
  });

  it('differentiates technical deep-dive (Phase C) shape mechanisms per stage based on each stage text (e.g. Kerberoasting 1C vs 2C vs 3C)', () => {
    const kerberoast = ATTACK_SCENARIOS.find((s) => s.id === 'ad-kerberoasting');
    assert.ok(kerberoast, 'ad-kerberoasting scenario should exist');

    const spec = getUniversalScenarioScrollySpec(kerberoast);
    const sub1C = spec.allSubSteps.find((s) => s.id === '1C')!;
    const sub2C = spec.allSubSteps.find((s) => s.id === '2C')!;
    const sub3C = spec.allSubSteps.find((s) => s.id === '3C')!;

    assert.equal(
      sub1C.shapeChoreography.mechanismKind,
      'KERBEROS_TGS_RC4_TICKET_FORGE'
    );
    assert.equal(
      sub2C.shapeChoreography.mechanismKind,
      'HASHCAT_GPU_CRACK_AND_SMB_PTH'
    );
    assert.equal(
      sub3C.shapeChoreography.mechanismKind,
      'DCSYNC_DRSR_DIRECTORY_REPLICATION'
    );
  });
});

