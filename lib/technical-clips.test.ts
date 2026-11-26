import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { hasTechnicalClip } from './section-technical-clip-registry';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import { listScenario3DSections } from './section-3d-registry';
import {
  getTechnicalWhiteboard,
  hasTechnicalWhiteboard,
  listTechnicalWhiteboardSections,
} from './section-excalidraw-registry';
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

test('All live bespoke scenarios in ATTACK_SCENARIOS have complete MOD-13 Excalidraw whiteboards and MOD-14 technical clips, and MOD-17 charter + backlog exist', async () => {
  assert.ok(ARROW_GAP >= 150, `ARROW_GAP must be >= 150px, got ${ARROW_GAP}`);
  assert.ok(
    ATTACK_SCENARIOS.length >= 1,
    'Expected at least 1 live bespoke scenario in ATTACK_SCENARIOS'
  );

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

    // MOD-13: Every section (briefing, step-1..N, and memory-forensics when present) MUST have an Excalidraw whiteboard
    const registeredBoards = listTechnicalWhiteboardSections(scenario.id);
    assert.equal(
      registeredBoards.length,
      expectedSections.length,
      `Board count mismatch for ${scenario.id}: expected ${expectedSections.join(',')} got ${registeredBoards.join(',')}`
    );

    for (const sectionKey of expectedSections) {
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
      }
    }
  }

  assert.ok(totalBoards >= 7, `Expected >= 7 Excalidraw whiteboards, got ${totalBoards}`);
  assert.ok(totalClips >= 6, `Expected >= 6 SVG+GSAP technical clips, got ${totalClips}`);

  // Verify MOD-17 Bespoke Overhaul Charter & Phase 0 Backlog artifacts exist and pass Markdown standard validation
  const { validateMarkdownDocumentStandard } = await import(
    './documentation-standards'
  );
  const mod17Path = path.join(
    process.cwd(),
    'docs',
    'standards',
    '17-bespoke-studio-redesign-pipeline-and-clean-slate-standard.md'
  );
  assert.equal(fs.existsSync(mod17Path), true, 'Expected MOD-17 charter to exist');
  const mod17Check = validateMarkdownDocumentStandard(
    fs.readFileSync(mod17Path, 'utf8'),
    'MOD-17'
  );
  assert.equal(
    mod17Check.valid,
    true,
    `MOD-17 failed Markdown standard validation: ${mod17Check.violations.join('; ')}`
  );
  assert.equal(
    fs.existsSync(
      path.join(process.cwd(), 'docs', 'redesign-backlog', 'MASTER-BACKLOG-SIDEBAR-ORDER.md')
    ),
    true,
    'Expected MASTER-BACKLOG-SIDEBAR-ORDER.md to exist'
  );
  assert.equal(
    fs.existsSync(
      path.join(process.cwd(), 'docs', 'redesign-backlog', 'PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md')
    ),
    true,
    'Expected PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md to exist'
  );
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
  assert.ok(content.includes('MOD-17'));
  assert.ok(content.includes('Mute Test'));
  assert.ok(content.includes('Swap Test'));
  assert.ok(content.includes('process-hollowing'));
});



