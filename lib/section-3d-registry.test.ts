import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ANIME_3D_STAGE_STANDARD,
  computeActivePhaseIndex,
  deduplicateTechnicalClausesAgainstStory,
  findTechnicalJargonInStory,
  getPhaseMidpointNormalized,
  getSection3DDescriptor,
  hasSection3DScene,
  listScenario3DSections,
  stepNumberToSectionKey,
  type Section3DKey,
} from './section-3d-registry';
import { getRawScenarioStepGuide } from './scenario-step-guides';

const JAPANESE_CHAR_REGEX = /[\u3040-\u30FF\u4E00-\u9FFF¥]/;

describe('Section-to-3D Scene Registry & Canonical Overview Standard', () => {
  it('enforces the canonical Story -> Technical -> Interactive 3D Stage standard contract', () => {
    assert.deepEqual(ANIME_3D_STAGE_STANDARD.sectionOrder, [
      'STORY_ANALOGY',
      'TECHNICAL_EXPLANATION',
      'INTERACTIVE_3D_STAGE',
    ]);
    assert.deepEqual(ANIME_3D_STAGE_STANDARD.speedMultipliers, [0.5, 1, 1.5]);
    assert.deepEqual(ANIME_3D_STAGE_STANDARD.cutawayModes, [
      'AUTO',
      'OPEN',
      'SEALED',
    ]);
    assert.deepEqual(ANIME_3D_STAGE_STANDARD.topRightActions, [
      'CUTAWAY',
      'FULL_PAGE',
    ]);
    assert.ok(
      ANIME_3D_STAGE_STANDARD.bottomDockFeatures.includes('HIDE_SHOW_TOGGLE')
    );
    assert.ok(
      ANIME_3D_STAGE_STANDARD.bottomDockFeatures.includes('TIMELINE_SCRUBBER')
    );
    assert.ok(
      ANIME_3D_STAGE_STANDARD.bottomDockFeatures.includes('CAMERA_PRESETS')
    );
  });

  it('registers a distinct bespoke 3D scene with 4 camera presets, Story-to-Technical mappings, and Story+Technical phases for every Process Hollowing section', () => {
    const expectedKeys: Section3DKey[] = [
      'briefing',
      'step-1',
      'step-2',
      'step-3',
      'step-4',
      'step-5',
      'memory-forensics',
    ];

    const sections = listScenario3DSections('process-hollowing');
    assert.equal(sections.length, expectedKeys.length);

    const seenKinds = new Set<string>();
    for (const key of expectedKeys) {
      assert.equal(hasSection3DScene('process-hollowing', key), true);
      const desc = getSection3DDescriptor('process-hollowing', key);
      assert.ok(desc, `Expected descriptor for ${key}`);
      assert.equal(
        seenKinds.has(desc.sceneKind),
        false,
        `Duplicate 3D sceneKind ${desc.sceneKind} detected for ${key}`
      );
      seenKinds.add(desc.sceneKind);

      assert.ok(desc.storyCue.length > 40, `storyCue too short for ${key}`);
      assert.ok(
        desc.technicalCue.length > 40,
        `technicalCue too short for ${key}`
      );
      assert.ok(
        desc.storyMappings.length >= 4,
        `Expected >= 4 Story-to-Technical mappings for ${key}`
      );
      assert.equal(desc.callouts.length, 2);
      assert.equal(desc.cameraPresets.length, 4);
      assert.equal(desc.cameraPresets[0].id, 'DIRECTOR');
      assert.ok(desc.phases.length >= 3);

      for (const ph of desc.phases) {
        assert.ok(ph.storyExcerpt.length > 15);
        assert.ok(ph.technicalParallel.length > 15);
        assert.ok(ph.endSec > ph.startSec);
      }
    }
  });

  it('keeps ALL Process Hollowing Story texts, phase story excerpts, and floating callout titles 100% jargon-free while keeping technical translations right underneath', () => {
    const sections = listScenario3DSections('process-hollowing');
    for (const desc of sections) {
      assert.deepEqual(
        findTechnicalJargonInStory(desc.storyCue),
        [],
        `Technical jargon leaked into storyCue of ${desc.sectionKey}: "${desc.storyCue}"`
      );
      for (const callout of desc.callouts) {
        assert.deepEqual(
          findTechnicalJargonInStory(callout.title),
          [],
          `Technical jargon leaked into floating callout title of ${desc.sectionKey}: "${callout.title}"`
        );
        assert.ok(
          callout.subtitle.length >= 12,
          `Floating callout subtitle must explain the technical equivalent for ${desc.sectionKey}`
        );
      }
      for (const ph of desc.phases) {
        assert.deepEqual(
          findTechnicalJargonInStory(ph.storyExcerpt),
          [],
          `Technical jargon leaked into phase ${ph.id} storyExcerpt of ${desc.sectionKey}: "${ph.storyExcerpt}"`
        );
      }
      for (const mapping of desc.storyMappings) {
        assert.deepEqual(
          findTechnicalJargonInStory(mapping.storyTerm),
          [],
          `Technical jargon leaked into storyTerm of ${desc.sectionKey}: "${mapping.storyTerm}"`
        );
        assert.ok(mapping.technicalTerm.length >= 10);
      }
    }

    const rawGuide = getRawScenarioStepGuide('process-hollowing');
    assert.ok(rawGuide);
    assert.deepEqual(
      findTechnicalJargonInStory(rawGuide.briefing.storyAnalogy),
      []
    );
    for (const step of rawGuide.steps) {
      assert.deepEqual(
        findTechnicalJargonInStory(step.storyAnalogy),
        [],
        `Technical jargon leaked into step ${step.stepNumber} storyAnalogy: "${step.storyAnalogy}"`
      );
    }
  });

  it('contains zero Japanese characters across all titles, cues, mappings, callouts, camera presets, and phases', () => {
    const sections = listScenario3DSections('process-hollowing');
    for (const desc of sections) {
      const texts = [
        desc.stageBadge,
        desc.title,
        desc.storyCue,
        desc.technicalCue,
        ...desc.storyMappings.flatMap((m) => [m.storyTerm, m.technicalTerm]),
        ...desc.callouts.flatMap((c) => [c.tag, c.title, c.subtitle]),
        ...desc.cameraPresets.map((c) => c.label),
        ...desc.phases.flatMap((p) => [
          p.shortLabel,
          p.stageTag,
          p.title,
          p.storyExcerpt,
          p.technicalParallel,
        ]),
      ];
      for (const text of texts) {
        assert.equal(
          JAPANESE_CHAR_REGEX.test(text),
          false,
          `Unexpected Japanese character found in ${desc.sectionKey}: "${text}"`
        );
      }
    }
  });

  it('maps step numbers deterministically and computes active phase and normalized midpoint accurately', () => {
    assert.equal(stepNumberToSectionKey(0), 'briefing');
    assert.equal(stepNumberToSectionKey(1), 'step-1');
    assert.equal(stepNumberToSectionKey(5), 'step-5');
    assert.equal(stepNumberToSectionKey(9), null);

    const step3 = getSection3DDescriptor('process-hollowing', 'step-3')!;
    assert.equal(computeActivePhaseIndex(step3, 0), 0);
    assert.equal(computeActivePhaseIndex(step3, 6.2), 1);
    assert.equal(computeActivePhaseIndex(step3, 12.1), 2);
    assert.equal(computeActivePhaseIndex(step3, step3.durationSec + 0.5), 0);

    const mid1 = getPhaseMidpointNormalized(step3, 1);
    assert.ok(mid1 > 0.35 && mid1 < 0.72);
  });

  it('returns null / empty gracefully for scenarios without 3D descriptors yet', () => {
    assert.equal(hasSection3DScene('unknown-scenario', 'step-1'), false);
    assert.equal(getSection3DDescriptor('unknown-scenario', 'briefing'), null);
    assert.deepEqual(listScenario3DSections('unknown-scenario'), []);
  });

  it('strips duplicated story sentences from Technical clauses and renumbers cleanly', () => {
    const story =
      'Imagine an intruder who wants to enter a high-security bank without raising an alarm. Instead of breaking down the front door, they hire an armored truck.';
    const rawClauses = [
      {
        clauseCode: '0.1',
        fullText:
          'Imagine an intruder who wants to enter a high-security bank without raising an alarm.',
      },
      {
        clauseCode: '0.2',
        fullText:
          'In this scenario (MITRE ATT&CK T1055.012), Invoice_Q4.exe calls CreateProcessW with CREATE_SUSPENDED.',
      },
      {
        clauseCode: '0.3',
        fullText:
          'NtUnmapViewOfSection unmaps the legitimate svchost.exe image at 0x00400000.',
      },
    ];
    const clean = deduplicateTechnicalClausesAgainstStory(
      rawClauses,
      story,
      '0'
    );
    assert.equal(clean.length, 2);
    assert.equal(clean[0].clauseCode, '0.1');
    assert.ok(clean[0].fullText.includes('CreateProcessW'));
    assert.equal(clean[1].clauseCode, '0.2');
    assert.ok(clean[1].fullText.includes('NtUnmapViewOfSection'));
  });

  it('explicitly explains what EACH golden master key is for and attaches per-token plain-English inline why parentheticals across all Process Hollowing deep-dive steps', () => {
    const rawGuide = getRawScenarioStepGuide('process-hollowing')!;
    const step1 = rawGuide.steps[0];
    const step1Scene = getSection3DDescriptor('process-hollowing', 'step-1')!;

    // Both master keys must have explicit purpose explanations in Story, Technical, and Story-to-Technical Key
    assert.ok(
      step1.storyAnalogy.toLowerCase().includes('first master key') &&
        step1.storyAnalogy.toLowerCase().includes('second master key'),
      'Step 1 storyAnalogy must explicitly explain what BOTH golden master keys unlock'
    );
    assert.ok(
      step1Scene.storyMappings.some(
        (m) => m.storyTerm.includes('Key #1') && m.technicalTerm.includes('0x01C4')
      ) &&
        step1Scene.storyMappings.some(
          (m) => m.storyTerm.includes('Key #2') && m.technicalTerm.includes('0x01C8')
        ),
      'Step 1 Story-to-Technical Key must separately map Key #1 (hProcess 0x01C4) and Key #2 (hThread 0x01C8)'
    );

    // Step 1 howItWorksInPractice must explain every major kernel/API token inline via plain-English parentheticals
    const step1DeepDiveParens =
      step1.howItWorksInPractice.match(/\([^)]{25,}\)/g) || [];
    assert.ok(
      step1DeepDiveParens.length >= 9,
      `Step 1 howItWorksInPractice must explain every technical term inline (found only ${step1DeepDiveParens.length} substantive parentheticals)`
    );

    // Steps 2-5 howItWorksInPractice must also provide rich per-token inline parentheticals
    for (const step of rawGuide.steps.slice(1)) {
      const parens = step.howItWorksInPractice.match(/\([^)]{25,}\)/g) || [];
      assert.ok(
        parens.length >= 4,
        `Step ${step.stepNumber} howItWorksInPractice must explain every technical token inline (found ${parens.length})`
      );
    }
  });
});
