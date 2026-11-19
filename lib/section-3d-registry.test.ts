import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeActivePhaseIndex,
  getSection3DDescriptor,
  hasSection3DScene,
  listScenario3DSections,
  stepNumberToSectionKey,
  type Section3DKey,
} from './section-3d-registry';

const JAPANESE_CHAR_REGEX = /[\u3040-\u30FF\u4E00-\u9FFF¥]/;

describe('Section-to-3D Scene Registry (Unified Story + Technical + Bespoke 3D)', () => {
  it('registers a distinct bespoke 3D scene for Briefing #0, Steps #1-#5, and Memory Forensics in process-hollowing', () => {
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
        `Duplicate 3D sceneKind ${desc.sceneKind} detected for ${key} — each section must have a unique bespoke 3D scene`
      );
      seenKinds.add(desc.sceneKind);

      // Every section must carry BOTH Story Analogy cue and Technical cue
      assert.ok(desc.storyCue.length > 40, `storyCue too short for ${key}`);
      assert.ok(
        desc.technicalCue.length > 40,
        `technicalCue too short for ${key}`
      );
      assert.equal(desc.callouts.length, 2);
      assert.ok(desc.phases.length >= 3);
    }
  });

  it('contains zero Japanese characters across all titles, cues, callouts, and phases', () => {
    const sections = listScenario3DSections('process-hollowing');
    for (const desc of sections) {
      const texts = [
        desc.stageBadge,
        desc.title,
        desc.storyCue,
        desc.technicalCue,
        ...desc.callouts.flatMap((c) => [c.tag, c.title, c.subtitle]),
        ...desc.phases.flatMap((p) => [p.label, p.caption]),
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

  it('maps step numbers deterministically and computes active animation phase without gaps', () => {
    assert.equal(stepNumberToSectionKey(0), 'briefing');
    assert.equal(stepNumberToSectionKey(1), 'step-1');
    assert.equal(stepNumberToSectionKey(5), 'step-5');
    assert.equal(stepNumberToSectionKey(9), null);

    const step3 = getSection3DDescriptor('process-hollowing', 'step-3')!;
    assert.equal(computeActivePhaseIndex(step3, 0), 0);
    assert.equal(computeActivePhaseIndex(step3, 6.2), 1);
    assert.equal(computeActivePhaseIndex(step3, 12.1), 2);
    // Wraps cleanly past durationSec
    assert.equal(computeActivePhaseIndex(step3, step3.durationSec + 0.5), 0);
  });

  it('returns null / empty gracefully for scenarios without 3D descriptors yet', () => {
    assert.equal(hasSection3DScene('unknown-scenario', 'step-1'), false);
    assert.equal(getSection3DDescriptor('unknown-scenario', 'briefing'), null);
    assert.deepEqual(listScenario3DSections('unknown-scenario'), []);
  });
});
