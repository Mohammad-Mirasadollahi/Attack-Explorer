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

test('Lightweight manifest and dynamic per-group loader stay in 100% sync with compiled MALWARE 2D registry', async () => {
  const {
    hasAnyTechnicalWhiteboard,
    MALWARE_2D_SECTION_MANIFEST,
  } = await import('./malware-2d-blueprints/manifest');
  const {
    loadMalwareTechnicalWhiteboard,
    loadMalwareTechnicalClipSpec,
  } = await import('./malware-2d-blueprints/loader');

  const malwareScenarios = ATTACK_SCENARIOS.filter((s) => s.category === 'MALWARE');
  assert.equal(Object.keys(MALWARE_2D_SECTION_MANIFEST).length, 29);

  for (const scenario of malwareScenarios) {
    const sections = listScenario3DSections(scenario.id).map((d) => d.sectionKey);
    for (const sectionKey of sections) {
      assert.equal(
        hasAnyTechnicalWhiteboard(scenario.id, sectionKey),
        hasTechnicalWhiteboard(scenario.id, sectionKey),
        `Manifest whiteboard mismatch for ${scenario.id}/${sectionKey}`
      );
    }
  }

  // Verify dynamic loader resolves a representative scenario from every group (1..6)
  const samplePerGroup = [
    'amsi-reflective-dll',
    '3cx-desktopapp-supply-chain-lazarus',
    'kaspersky-lazarus-byovd-fudmodule',
    'ms-forest-blizzard-gooseegg',
    'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    'dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2',
  ];

  for (const scenarioId of samplePerGroup) {
    const board = await loadMalwareTechnicalWhiteboard(scenarioId, 'step-1');
    const clip = await loadMalwareTechnicalClipSpec(scenarioId, 'step-1');
    assert.ok(board && board.skeletons.length >= 8, `Loader failed whiteboard for ${scenarioId}/step-1`);
    assert.ok(clip && clip.beats.length === 4, `Loader failed clip for ${scenarioId}/step-1`);
    assert.equal(
      await loadMalwareTechnicalClipSpec(scenarioId, 'briefing'),
      null,
      `Loader must return null for briefing clip on ${scenarioId}`
    );
  }
});

test('All 188 catalog scenarios (all 13 categories) have complete MOD-13 Excalidraw whiteboards (797 boards) and MOD-14 SVG+GSAP technical clips (609 clips)', async () => {
  const {
    getNonMalwareTechnicalClipSpec,
    SCENARIO_2D_CLIP_SPECS,
  } = await import('./scenario-2d-blueprints');
  const { SCENARIO_2D_SECTION_MANIFEST } = await import(
    './scenario-2d-blueprints/manifest'
  );
  const {
    loadAnyTechnicalClipSpec,
    loadAnyTechnicalWhiteboard,
  } = await import('./scenario-2d-blueprints/loader');
  const { hasAnyTechnicalWhiteboard } = await import(
    './malware-2d-blueprints/manifest'
  );

  assert.equal(ATTACK_SCENARIOS.length, 188, 'Expected 188 catalog scenarios');
  assert.equal(
    Object.keys(SCENARIO_2D_SECTION_MANIFEST).length,
    158,
    'Expected 158 non-MALWARE scenarios in scenario-2d manifest'
  );
  assert.equal(
    Object.keys(SCENARIO_2D_CLIP_SPECS).length,
    158,
    'Expected 158 compiled non-MALWARE clip scenario profiles'
  );

  const seenPrefixes = new Set<string>(['s1', 's2', 's3', 's4', 's5', 'mem']);
  const mechanicCounts = new Map<string, number>();
  let totalBoards = 0;
  let totalClips = 0;

  for (const scenario of ATTACK_SCENARIOS) {
    const expectedSections = listScenario3DSections(scenario.id).map(
      (d) => d.sectionKey
    );
    assert.ok(
      expectedSections.length >= 3,
      `Expected >= 3 sections for ${scenario.id}`
    );

    // MOD-14 §3: briefing MUST NEVER register a technical clip
    assert.equal(
      hasTechnicalClip(scenario.id, 'briefing'),
      false,
      `briefing must NOT have a technical clip for ${scenario.id}`
    );

    const registeredBoards = listTechnicalWhiteboardSections(scenario.id);
    assert.equal(
      registeredBoards.length,
      expectedSections.length,
      `Board count mismatch for ${scenario.id}: expected ${expectedSections.join(',')} got ${registeredBoards.join(',')}`
    );

    for (const sectionKey of expectedSections) {
      assert.equal(
        hasAnyTechnicalWhiteboard(scenario.id, sectionKey),
        true,
        `Manifest missing whiteboard for ${scenario.id}/${sectionKey}`
      );
      assert.equal(
        hasTechnicalWhiteboard(scenario.id, sectionKey),
        true,
        `Registry missing whiteboard for ${scenario.id}/${sectionKey}`
      );
      const board = getTechnicalWhiteboard(scenario.id, sectionKey);
      assert.ok(board, `Null whiteboard for ${scenario.id}/${sectionKey}`);
      totalBoards++;

      assert.ok(
        board.skeletons.length >= 8,
        `Board too sparse for ${scenario.id}/${sectionKey}`
      );
      assert.ok(
        Object.keys(board.tooltips).length >= 5,
        `Board missing tooltips for ${scenario.id}/${sectionKey}`
      );

      for (const skel of board.skeletons) {
        if (skel.type === 'arrow') {
          assert.equal(
            'label' in skel && Boolean((skel as { label?: unknown }).label),
            false,
            `Arrow in ${scenario.id}/${sectionKey} must not have inline label`
          );
        }
      }

      for (const [tipId, tip] of Object.entries(board.tooltips)) {
        assert.ok(
          tip.title.trim().length > 0,
          `Empty tooltip title on ${scenario.id}/${sectionKey}/${tipId}`
        );
        assert.ok(
          tip.fields.length >= 1,
          `Empty tooltip fields on ${scenario.id}/${sectionKey}/${tipId}`
        );
        assert.ok(
          tip.explain.trim().length >= 20,
          `Too-short tooltip explain on ${scenario.id}/${sectionKey}/${tipId}`
        );
      }

      if (sectionKey !== 'briefing') {
        assert.equal(
          hasTechnicalClip(scenario.id, sectionKey),
          true,
          `Missing technical clip for ${scenario.id}/${sectionKey}`
        );
        totalClips++;

        if (scenario.id !== 'process-hollowing') {
          const spec =
            scenario.category === 'MALWARE'
              ? getMalwareTechnicalClipSpec(scenario.id, sectionKey)
              : getNonMalwareTechnicalClipSpec(scenario.id, sectionKey);
          assert.ok(
            spec,
            `Missing compiled technical clip spec for ${scenario.id}/${sectionKey}`
          );
          assert.equal(
            seenPrefixes.has(spec.svgPrefix),
            false,
            `Duplicate global SVG prefix "${spec.svgPrefix}" on ${scenario.id}/${sectionKey}`
          );
          seenPrefixes.add(spec.svgPrefix);
          mechanicCounts.set(
            spec.mechanic,
            (mechanicCounts.get(spec.mechanic) ?? 0) + 1
          );

          assert.equal(
            spec.beats.length,
            4,
            `Expected 4 beats on ${scenario.id}/${sectionKey}`
          );
          assert.equal(
            spec.cameraLabels.length,
            4,
            `Expected 4 camera labels on ${scenario.id}/${sectionKey}`
          );

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

  assert.equal(
    totalBoards,
    797,
    `Expected exactly 797 Excalidraw whiteboards across 188 scenarios, got ${totalBoards}`
  );
  assert.equal(
    totalClips,
    609,
    `Expected exactly 609 SVG+GSAP technical clips across 188 scenarios, got ${totalClips}`
  );
  // Ensure the new domain-specific kinetic engines are actively used across the catalog
  assert.ok(
    mechanicCounts.size >= 12,
    `Expected >= 12 distinct 2D kinetic clip mechanics in active use, got ${mechanicCounts.size}: ${[...mechanicCounts.keys()].join(', ')}`
  );

  // Verify DomainKineticVisualizers.tsx adheres strictly to GSAP SVG transform safety
  const domainVizSrc = fs.readFileSync(
    path.join(
      process.cwd(),
      'components',
      'technical-clip',
      'malware-clips',
      'DomainKineticVisualizers.tsx'
    ),
    'utf8'
  );
  assert.doesNotMatch(
    domainVizSrc,
    /<g[^>]*className=[^>]*transform=\{?["'`]translate/,
    'DomainKineticVisualizers must never combine className and transform="translate(...)" on the same <g>'
  );

  // Verify unified lazy loader resolves a representative scenario from every single category (13 categories)
  const samplePerCategory = [
    'amsi-reflective-dll', // MALWARE
    'log4shell-dfir', // NETWORK_WEB
    'ad-kerberoasting', // ACTIVE_DIRECTORY
    'aws-cognito-iam-passrole-privesc', // CLOUD_SAAS
    'jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr', // AI_LLM_MLOPS_SECURITY
    'fortimanager-fgd-jump-cve-2024-47575', // ZERO_DAY_APPLIANCES
  ];
  // Also dynamically grab 1 scenario from each remaining category so all 13 categories are exercised
  const seenCats = new Set<string>();
  for (const id of samplePerCategory) {
    const found = ATTACK_SCENARIOS.find((s) => s.id === id);
    if (found) seenCats.add(found.category);
  }
  for (const s of ATTACK_SCENARIOS) {
    if (s.id === 'process-hollowing') continue;
    if (!seenCats.has(s.category)) {
      seenCats.add(s.category);
      samplePerCategory.push(s.id);
    }
  }
  assert.equal(seenCats.size, 13, 'Expected sample coverage across all 13 categories');

  for (const scenarioId of samplePerCategory) {
    const board = await loadAnyTechnicalWhiteboard(scenarioId, 'step-1');
    const clip = await loadAnyTechnicalClipSpec(scenarioId, 'step-1');
    assert.ok(
      board && board.skeletons.length >= 8,
      `Unified loader failed whiteboard for ${scenarioId}/step-1`
    );
    assert.ok(
      clip && clip.beats.length === 4,
      `Unified loader failed clip for ${scenarioId}/step-1`
    );
    assert.equal(
      await loadAnyTechnicalClipSpec(scenarioId, 'briefing'),
      null,
      `Unified loader must return null for briefing clip on ${scenarioId}`
    );
  }
});

test('MOD-15 unified 3D/2D/Excalidraw scenario authoring handbook exists and passes MOD-01/MOD-02 documentation validation', async () => {
  const { validateMarkdownDocumentStandard } = await import(
    './documentation-standards'
  );
  const handbookPath = path.join(
    process.cwd(),
    'docs',
    'standards',
    '15-unified-3d-2d-whiteboard-scenario-authoring-handbook.md'
  );
  assert.equal(fs.existsSync(handbookPath), true, 'Expected MOD-15 handbook to exist');
  const content = fs.readFileSync(handbookPath, 'utf8');
  const check = validateMarkdownDocumentStandard(content, 'MOD-15');
  assert.equal(
    check.valid,
    true,
    `MOD-15 failed Markdown standard validation: ${check.violations.join('; ')}`
  );
  assert.ok(content.includes('MOD-15'));
  assert.ok(content.includes('network-packet-wire'));
  assert.ok(content.includes('protocol-layer-stack'));
  assert.ok(content.includes('process-hollowing'));
});



