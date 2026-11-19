import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ANIME_3D_STAGE_STANDARD,
  computeActivePhaseIndex,
  deduplicateTechnicalClausesAgainstStory,
  getPhaseMidpointNormalized,
  getSection3DDescriptor,
  hasSection3DScene,
  listScenario3DSections,
  stepNumberToSectionKey,
  type Section3DKey,
} from './section-3d-registry';

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

  it('registers a distinct bespoke 3D scene with 4 camera presets and Story+Technical phases for every Process Hollowing section', () => {
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

  it('contains zero Japanese characters across all titles, cues, callouts, camera presets, and phases', () => {
    const sections = listScenario3DSections('process-hollowing');
    for (const desc of sections) {
      const texts = [
        desc.stageBadge,
        desc.title,
        desc.storyCue,
        desc.technicalCue,
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
});
