import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { hasTechnicalClip } from './section-technical-clip-registry';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import {
  findTechnicalJargonInStory,
  listScenario3DSections,
} from './section-3d-registry';
import {
  getTechnicalWhiteboard,
  hasTechnicalWhiteboard,
  listTechnicalWhiteboardSections,
} from './section-excalidraw-registry';
import {
  getMalwareTechnicalClipSpec,
  MALWARE_TECHNICAL_CLIP_SPECS,
} from './malware-2d-blueprints';
import { ARROW_GAP } from './excalidraw-boards/board-primitives';

const CLIPS_DIR = path.join(
  process.cwd(),
  'components',
  'technical-clip',
  'clips'
);

const CLIP_FILES = [
  { key: 'step-1', file: 'Step1SuspendClip.tsx', prefix: 's1' },
  { key: 'step-2', file: 'Step2UnmapClip.tsx', prefix: 's2' },
  { key: 'step-3', file: 'Step3AllocInjectClip.tsx', prefix: 's3' },
  { key: 'step-4', file: 'Step4ContextClip.tsx', prefix: 's4' },
  { key: 'step-5', file: 'Step5BeaconClip.tsx', prefix: 's5' },
  { key: 'memory-forensics', file: 'MemoryDiffClip.tsx', prefix: 'mem' },
] as const;

test('Process Hollowing technical clips satisfy MOD-14 player contract and technical accuracy invariants', () => {
  // Overview/briefing must stay unregistered per MOD-14 §3
  assert.equal(hasTechnicalClip('process-hollowing', 'briefing'), false);

  const seenPrefixes = new Set<string>();

  for (const clip of CLIP_FILES) {
    assert.equal(
      hasTechnicalClip('process-hollowing', clip.key),
      true,
      `Expected process-hollowing ${clip.key} to be registered`
    );

    const src = fs.readFileSync(path.join(CLIPS_DIR, clip.file), 'utf8');

    // Shared chrome via AnimeClipStage (no private duplicated docks)
    assert.match(src, /<AnimeClipStage\b/, `${clip.file} must use AnimeClipStage`);

    // Unique prefixed FilmBackdrop paint servers so multiple clips on one page never collide
    assert.match(
      src,
      new RegExp(`<FilmBackdrop\\s+prefix="${clip.prefix}"\\s*/>`),
      `${clip.file} must use prefixed FilmBackdrop prefix="${clip.prefix}"`
    );
    assert.equal(
      seenPrefixes.has(clip.prefix),
      false,
      `Duplicate SVG prefix ${clip.prefix}`
    );
    seenPrefixes.add(clip.prefix);

    // Pacing floors from clipPace
    assert.match(src, /clipPace\.hold/, `${clip.file} must use clipPace.hold`);
    assert.match(src, /clipPace\.end/, `${clip.file} must use clipPace.end`);
    assert.match(src, /clipPace\.teach|clipPace\.travel/, `${clip.file} must use clipPace timing floors`);
  }

  // Step 1 technical accuracy: Ring 3 -> Ring 0 NtCreateUserProcess + EPROCESS + both handles
  const s1 = fs.readFileSync(path.join(CLIPS_DIR, 'Step1SuspendClip.tsx'), 'utf8');
  assert.match(s1, /NtCreateUserProcess/);
  assert.match(s1, /0x00000004/);
  assert.match(s1, /0x01C4/);
  assert.match(s1, /0x01C8/);
  assert.match(s1, /0x1FFFFF/);

  // Step 2 technical accuracy: NtQueryInformationProcess + PEB+0x10 + MiUnmapViewOfSection + NTSTATUS 0x00000000
  const s2 = fs.readFileSync(path.join(CLIPS_DIR, 'Step2UnmapClip.tsx'), 'utf8');
  assert.match(s2, /NtQueryInformationProcess/);
  assert.match(s2, /PEB\+0x10/);
  assert.match(s2, /MiUnmapViewOfSection/);
  assert.match(s2, /0x00000000/);

  // Step 3 technical accuracy: VirtualAllocEx + WriteProcessMemory + 270,336 B + 0x004014A0 + EtwTiLogAllocVMRemote
  const s3 = fs.readFileSync(path.join(CLIPS_DIR, 'Step3AllocInjectClip.tsx'), 'utf8');
  assert.match(s3, /NtAllocateVirtualMemory/);
  assert.match(s3, /NtWriteVirtualMemory/);
  assert.match(s3, /270,336/);
  assert.match(s3, /0x004014A0/);
  assert.match(s3, /EtwTiLogAllocVMRemote/);

  // Step 4 technical accuracy: RIP = RtlUserThreadStart, RCX rewritten to 0x004014A0 (never claiming RCX pointed at RtlUserThreadStart)
  const s4 = fs.readFileSync(path.join(CLIPS_DIR, 'Step4ContextClip.tsx'), 'utf8');
  assert.match(s4, /GetThreadContext/);
  assert.match(s4, /SetThreadContext/);
  assert.match(s4, /KTRAP_FRAME\.Rcx/);
  assert.match(s4, /RIP.*RtlUserThreadStart/);
  assert.doesNotMatch(s4, /Rcx still points at RtlUserThreadStart/i);

  // Step 5 technical accuracy: full untruncated JA3 + HTTP 200 OK AES tasking + 60s ±20% jitter
  const s5 = fs.readFileSync(path.join(CLIPS_DIR, 'Step5BeaconClip.tsx'), 'utf8');
  assert.match(s5, /72a589da586844d7f0818ce684948eea/);
  assert.match(s5, /HTTP 200 OK/);
  assert.match(s5, /\/jquery-3\.3\.1\.min\.js/);

  // Prevent GSAP x/y/scale animations from overwriting inline SVG translate() on the same <g>
  for (const clip of CLIP_FILES) {
    const src = fs.readFileSync(path.join(CLIPS_DIR, clip.file), 'utf8');
    assert.doesNotMatch(
      src,
      /<g[^>]*className=[^>]*transform=\{?["'`]translate/,
      `${clip.file} must not combine className and transform="translate(...)" on the same <g>`
    );
  }

  // Memory Diff technical accuracy: disk SEC_IMAGE vs live MEM_PRIVATE + hex signatures + ntdll clean
  const mem = fs.readFileSync(path.join(CLIPS_DIR, 'MemoryDiffClip.tsx'), 'utf8');
  assert.match(mem, /4D 5A 90 00/);
  assert.match(mem, /FC 48 83 E4/);
  assert.match(mem, /0x7FF8B4200000/);
  assert.match(mem, /SYSMON EID 25/);

  // Interactive workbench Memory view must also embed the 2D Memory Diff clip
  const memoryView = fs.readFileSync(
    path.join(process.cwd(), 'components', 'canvas', 'ProcessMemoryView.tsx'),
    'utf8'
  );
  assert.match(memoryView, /<TechnicalClipEmbed[\s\S]*sectionKey="memory-forensics"/);
});

const JAPANESE_CHAR_REGEX = /[\u3040-\u30FF\u4E00-\u9FFF¥]/;

test('All 30 MALWARE scenarios have complete MOD-13 Excalidraw whiteboards (135 boards) and MOD-14 SVG+GSAP technical clips (105 clips)', () => {
  assert.ok(ARROW_GAP >= 150, `ARROW_GAP must be >= 150px, got ${ARROW_GAP}`);

  const malwareScenarios = ATTACK_SCENARIOS.filter((s) => s.category === 'MALWARE');
  assert.equal(malwareScenarios.length, 30, 'Expected 30 MALWARE scenarios');

  const seenPrefixes = new Set<string>(['s1', 's2', 's3', 's4', 's5', 'mem']);
  let totalBoards = 0;
  let totalClips = 0;

  for (const scenario of malwareScenarios) {
    const expected3DSections = listScenario3DSections(scenario.id).map(
      (d) => d.sectionKey
    );
    assert.ok(
      expected3DSections.length >= 3,
      `Expected >= 3 sections for ${scenario.id}`
    );

    // MOD-14 §3: briefing MUST stay unregistered for technical clips
    assert.equal(
      hasTechnicalClip(scenario.id, 'briefing'),
      false,
      `briefing must NOT have a technical clip for ${scenario.id}`
    );

    // MOD-13: Every section (briefing, step-1..N, and memory-forensics when present) MUST have an Excalidraw whiteboard
    const registeredBoards = listTechnicalWhiteboardSections(scenario.id);
    assert.equal(
      registeredBoards.length,
      expected3DSections.length,
      `Board count mismatch for ${scenario.id}: expected ${expected3DSections.join(',')} got ${registeredBoards.join(',')}`
    );

    for (const sectionKey of expected3DSections) {
      assert.equal(
        hasTechnicalWhiteboard(scenario.id, sectionKey),
        true,
        `Missing Excalidraw whiteboard for ${scenario.id}/${sectionKey}`
      );
      const board = getTechnicalWhiteboard(scenario.id, sectionKey);
      assert.ok(board, `Null whiteboard for ${scenario.id}/${sectionKey}`);
      totalBoards++;

      assert.ok(board.skeletons.length >= 8, `Board too sparse for ${scenario.id}/${sectionKey}`);
      assert.ok(
        Object.keys(board.tooltips).length >= 5,
        `Board must have tooltips for all teaching cards + sticky (${scenario.id}/${sectionKey})`
      );

      // MOD-13 rule: zero inline labels on arrows (captions must be separate text elements)
      for (const skel of board.skeletons) {
        if (skel.type === 'arrow') {
          assert.equal(
            'label' in skel && Boolean((skel as { label?: unknown }).label),
            false,
            `Arrow in ${scenario.id}/${sectionKey} must not have inline label`
          );
        }
      }

      // Every tooltip must have valid kind, title, fields, and plain-language explain
      for (const [tipId, tip] of Object.entries(board.tooltips)) {
        assert.ok(tip.title.trim().length > 0, `Empty tooltip title on ${scenario.id}/${sectionKey}/${tipId}`);
        assert.ok(tip.fields.length >= 1, `Empty tooltip fields on ${scenario.id}/${sectionKey}/${tipId}`);
        assert.ok(tip.explain.trim().length >= 20, `Too-short tooltip explain on ${scenario.id}/${sectionKey}/${tipId}`);
      }

      // MOD-14: Every non-briefing section MUST have a registered technical clip
      if (sectionKey !== 'briefing') {
        assert.equal(
          hasTechnicalClip(scenario.id, sectionKey),
          true,
          `Missing technical clip for ${scenario.id}/${sectionKey}`
        );
        totalClips++;

        if (scenario.id !== 'process-hollowing') {
          const spec = getMalwareTechnicalClipSpec(scenario.id, sectionKey);
          assert.ok(spec, `Missing MalwareTechnicalClipSpec for ${scenario.id}/${sectionKey}`);
          assert.equal(
            seenPrefixes.has(spec.svgPrefix),
            false,
            `Duplicate SVG prefix "${spec.svgPrefix}" on ${scenario.id}/${sectionKey}`
          );
          seenPrefixes.add(spec.svgPrefix);

          assert.equal(spec.beats.length, 4, `Expected 4 beats on ${scenario.id}/${sectionKey}`);
          assert.equal(spec.cameraLabels.length, 4, `Expected 4 cameras on ${scenario.id}/${sectionKey}`);

          for (const beat of spec.beats) {
            const jargon = findTechnicalJargonInStory(beat.story);
            assert.deepEqual(
              jargon,
              [],
              `Story jargon in ${scenario.id}/${sectionKey} beat ${beat.id}: ${jargon.join(', ')} | "${beat.story}"`
            );
            assert.equal(
              JAPANESE_CHAR_REGEX.test(beat.story + beat.technical + beat.title),
              false,
              `Unexpected Japanese character in ${scenario.id}/${sectionKey}`
            );
          }
        }
      }
    }
  }

  assert.equal(totalBoards, 135, `Expected exactly 135 Excalidraw boards across 30 MALWARE scenarios, got ${totalBoards}`);
  assert.equal(totalClips, 105, `Expected exactly 105 SVG+GSAP technical clips across 30 MALWARE scenarios, got ${totalClips}`);
  assert.equal(Object.keys(MALWARE_TECHNICAL_CLIP_SPECS).length, 29, 'Expected 29 compiled MALWARE clip scenario profiles');

  // Verify MalwareTechnicalClipRenderer adheres strictly to MOD-14 & GSAP SVG safety invariants
  const rendererSrc = fs.readFileSync(
    path.join(
      process.cwd(),
      'components',
      'technical-clip',
      'malware-clips',
      'MalwareTechnicalClipRenderer.tsx'
    ),
    'utf8'
  );
  assert.match(rendererSrc, /<AnimeClipStage\b/);
  assert.match(rendererSrc, /<FilmBackdrop\s+prefix=\{spec\.svgPrefix\}\s*\/>/);
  assert.match(rendererSrc, /clipPace\.hold/);
  assert.match(rendererSrc, /clipPace\.end/);
  assert.match(rendererSrc, /clipPace\.travel/);
  assert.match(rendererSrc, /clipPace\.teach/);
  assert.doesNotMatch(
    rendererSrc,
    /<g[^>]*className=[^>]*transform=\{?["'`]translate/,
    'MalwareTechnicalClipRenderer must never combine className and transform="translate(...)" on the same <g>'
  );
});

