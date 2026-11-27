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

test('Scenarios #003 (LockBit) and #004 (3CX) satisfy cross-layer MITRE, telemetry, process-tree, and orthogonal Excalidraw invariants', async () => {
  const { getScenarioAttribution } = await import('./attack-sources-and-legal');
  const findSection3D = (scenarioId: string, sectionKey: string) =>
    listScenario3DSections(scenarioId).find((d) => d.sectionKey === sectionKey) ??
    null;

  // 1. Scenarios #003 and #004 stage MITRE IDs must all exist in their authoritative attribution lists
  for (const sid of [
    'ransomware-shadow-wipe',
    '3cx-desktopapp-supply-chain-lazarus',
  ] as const) {
    const scenario = ATTACK_SCENARIOS.find((s) => s.id === sid);
    assert.ok(scenario, `${sid} must be registered in ATTACK_SCENARIOS`);
    const attribution = getScenarioAttribution(scenario);
    const attrIds = new Set(attribution.mitreTechniques.map((t) => t.id));
    for (const stage of scenario.stages) {
      assert.equal(
        attrIds.has(stage.mitreTechniqueId),
        true,
        `${scenario.id} stage "${stage.title}" (${stage.mitreTechniqueId}) missing from attribution mitreTechniques`
      );
    }
  }

  // 2. LockBit (#003) canonical integrity checks
  const lockbit = ATTACK_SCENARIOS.find((s) => s.id === 'ransomware-shadow-wipe');
  assert.ok(lockbit, 'LockBit scenario must be registered');
  assert.equal(lockbit.stages[3]?.mitreTechniqueId, 'T1070.001');
  assert.equal(
    lockbit.processTree.some((p) => p.name === 'wevtutil.exe' && p.pid === 6618),
    true,
    'LockBit processTree must include wevtutil.exe (PID 6618)'
  );
  assert.equal(
    lockbit.telemetry.find((t) => t.id === 'lb3-3')?.info.includes('8-thread'),
    true,
    'LockBit Stage 3 telemetry info must align on 8-thread IOCP'
  );
  assert.equal(
    lockbit.telemetry.find((t) => t.id === 'lb3-4')?.mitreId,
    'T1070.001',
    'LockBit Stage 4 telemetry must map to T1070.001'
  );
  assert.equal(
    findSection3D('ransomware-shadow-wipe', 'step-4')?.mitreId,
    'T1070.001'
  );
  assert.equal(
    findSection3D('ransomware-shadow-wipe', 'memory-forensics'),
    null,
    'LockBit intentionally omits memory-forensics per MOD-17'
  );

  // Zero legacy HLJkNskOq drift across LockBit Excalidraw boards
  for (const sectionKey of listTechnicalWhiteboardSections('ransomware-shadow-wipe')) {
    const board = getTechnicalWhiteboard('ransomware-shadow-wipe', sectionKey);
    assert.ok(board);
    assert.equal(
      JSON.stringify(board).includes('HLJkNskOq'),
      false,
      `LockBit whiteboard ${sectionKey} must not contain legacy HLJkNskOq artifact drift`
    );
  }

  // 3. 3CX (#004) canonical integrity checks
  const threeCx = ATTACK_SCENARIOS.find(
    (s) => s.id === '3cx-desktopapp-supply-chain-lazarus'
  );
  assert.ok(threeCx, '3CX scenario must be registered');
  assert.equal(
    threeCx.processTree[0]?.name,
    'userinit.exe',
    '3CX processTree must root at authentic userinit.exe parent of explorer.exe'
  );
  assert.equal(
    threeCx.processTree[1]?.name,
    'explorer.exe',
    '3CX processTree must chain userinit.exe -> explorer.exe'
  );
  assert.equal(
    threeCx.processTree[1]?.ppid,
    threeCx.processTree[0]?.pid,
    'explorer.exe ppid must match userinit.exe pid'
  );
  assert.equal(
    findSection3D('3cx-desktopapp-supply-chain-lazarus', 'memory-forensics')
      ?.mitreId,
    'T1574.002 / T1140'
  );
  const cxMemClip = fs.readFileSync(
    path.join(
      CLIPS_DIR,
      '3cx-desktopapp-supply-chain-lazarus',
      'ThreeCxMemoryDiffClip.tsx'
    ),
    'utf8'
  );
  assert.match(cxMemClip, /mitreId="T1574\.002 \/ T1140"/);

  // 4. Orthogonal arrow geometry invariant for LockBit & 3CX Excalidraw boards
  for (const sid of [
    'ransomware-shadow-wipe',
    '3cx-desktopapp-supply-chain-lazarus',
  ] as const) {
    for (const sectionKey of listTechnicalWhiteboardSections(sid)) {
      const board = getTechnicalWhiteboard(sid, sectionKey);
      assert.ok(board);
      const boxes = new Map<string, { x: number; y: number; w: number; h: number }>();
      for (const skel of board.skeletons) {
        const s = skel as Record<string, unknown>;
        if (
          s.type === 'rectangle' &&
          typeof s.id === 'string' &&
          typeof s.x === 'number' &&
          typeof s.y === 'number' &&
          typeof s.width === 'number' &&
          typeof s.height === 'number'
        ) {
          boxes.set(s.id, { x: s.x, y: s.y, w: s.width, h: s.height });
        }
      }
      for (const skel of board.skeletons) {
        const s = skel as Record<string, unknown>;
        if (s.type !== 'arrow') continue;
        const startId = (s.start as { id?: string } | undefined)?.id;
        const endId = (s.end as { id?: string } | undefined)?.id;
        if (!startId || !endId) continue;
        const from = boxes.get(startId);
        const to = boxes.get(endId);
        assert.ok(
          from && to,
          `Arrow ${String(s.id)} in ${sid}/${sectionKey} references missing box`
        );
        const sameRow = Math.abs(from.y - to.y) <= 24;
        const sameCol =
          Math.abs(from.x + from.w / 2 - (to.x + to.w / 2)) <= 16;
        assert.equal(
          sameRow || sameCol,
          true,
          `Arrow ${String(s.id)} (${startId} -> ${endId}) in ${sid}/${sectionKey} is diagonal (not aligned horizontally or vertically)`
        );
      }
    }
  }
});

test('Scenario #016 (XZ Utils CVE-2024-3094) satisfies cross-layer MITRE, lineage, memory, clip, and orthogonal Excalidraw invariants', async () => {
  const { getScenarioAttribution } = await import('./attack-sources-and-legal');
  const sid = 'xz-utils-cve-2024-3094-backdoor';
  const xz = ATTACK_SCENARIOS.find((s) => s.id === sid);
  assert.ok(xz, `${sid} must be registered in ATTACK_SCENARIOS`);

  const attribution = getScenarioAttribution(xz);
  const attrIds = new Set(attribution.mitreTechniques.map((t) => t.id));
  for (const stage of xz.stages) {
    assert.equal(
      attrIds.has(stage.mitreTechniqueId),
      true,
      `${sid} stage "${stage.title}" (${stage.mitreTechniqueId}) missing from attribution mitreTechniques`
    );
  }

  assert.equal(xz.processTree[0]?.name, 'systemd');
  assert.equal(xz.processTree[1]?.name, 'sshd');
  assert.equal(
    xz.processTree.some((p) => p.name === 'sh' || p.name === '/bin/sh'),
    true,
    'XZ Utils processTree must include pre-auth root shell spawn'
  );
  const sshdNode = xz.processTree.find((p) => p.name === 'sshd');
  assert.ok(sshdNode?.memoryBlocks && sshdNode.memoryBlocks.length >= 3, 'XZ Utils sshd process must expose >= 3 ELF memory regions');
  assert.equal(
    sshdNode.memoryBlocks.some((m) => m.address === '0x55B2C4198048'),
    true,
    'XZ Utils must include hijacked .got.plt slot 0x55B2C4198048'
  );

  const xzClipDir = path.join(CLIPS_DIR, sid);
  const xzClips = [
    { key: 'step-1', file: 'XzStep1TestFixtureInjectClip.tsx', prefix: 'xz1' },
    { key: 'step-2', file: 'XzStep2IfuncGotHijackClip.tsx', prefix: 'xz2' },
    { key: 'step-3', file: 'XzStep3Ed448AuthBypassClip.tsx', prefix: 'xz3' },
    { key: 'step-4', file: 'XzStep4LatencyForensicsClip.tsx', prefix: 'xz4' },
    { key: 'memory-forensics', file: 'XzMemoryGotPltDiffClip.tsx', prefix: 'xzmem' },
  ] as const;

  assert.equal(hasTechnicalClip(sid, 'briefing'), false);
  for (const clip of xzClips) {
    assert.equal(hasTechnicalClip(sid, clip.key), true);
    const src = fs.readFileSync(path.join(xzClipDir, clip.file), 'utf8');
    assert.match(src, /<AnimeClipStage\b/);
    assert.match(src, new RegExp(`<FilmBackdrop\\s+prefix="${clip.prefix}"\\s*/>`));
    assert.doesNotMatch(src, /<g[^>]*className=[^>]*transform=\{?["'`]translate/);
  }

  for (const sectionKey of listTechnicalWhiteboardSections(sid)) {
    const board = getTechnicalWhiteboard(sid, sectionKey);
    assert.ok(board);
    const boxes = new Map<string, { x: number; y: number; w: number; h: number }>();
    for (const skel of board.skeletons) {
      const s = skel as Record<string, unknown>;
      if (
        s.type === 'rectangle' &&
        typeof s.id === 'string' &&
        typeof s.x === 'number' &&
        typeof s.y === 'number' &&
        typeof s.width === 'number' &&
        typeof s.height === 'number'
      ) {
        boxes.set(s.id, { x: s.x, y: s.y, w: s.width, h: s.height });
      }
    }
    for (const skel of board.skeletons) {
      const s = skel as Record<string, unknown>;
      if (s.type !== 'arrow') continue;
      const startId = (s.start as { id?: string } | undefined)?.id;
      const endId = (s.end as { id?: string } | undefined)?.id;
      if (!startId || !endId) continue;
      const from = boxes.get(startId);
      const to = boxes.get(endId);
      assert.ok(from && to, `Arrow ${String(s.id)} in ${sid}/${sectionKey} references missing box`);
      const sameRow = Math.abs(from.y - to.y) <= 24;
      const sameCol = Math.abs(from.x + from.w / 2 - (to.x + to.w / 2)) <= 16;
      assert.equal(
        sameRow || sameCol,
        true,
        `Arrow ${String(s.id)} (${startId} -> ${endId}) in ${sid}/${sectionKey} is diagonal`
      );
    }
  }
});

test('Scenario #020 (LSASS MiniDump via comsvcs.dll & Sysmon EID 10) satisfies cross-layer MITRE, lineage, memory, clip, and orthogonal Excalidraw invariants', async () => {
  const { getScenarioAttribution } = await import('./attack-sources-and-legal');
  const sid = 'dfir-lsass-minidump-comsvcs-sysmon-eid10';
  const lsass = ATTACK_SCENARIOS.find((s) => s.id === sid);
  assert.ok(lsass, `${sid} must be registered in ATTACK_SCENARIOS`);

  const attribution = getScenarioAttribution(lsass);
  const attrIds = new Set(attribution.mitreTechniques.map((t) => t.id));
  for (const stage of lsass.stages) {
    assert.equal(
      attrIds.has(stage.mitreTechniqueId),
      true,
      `${sid} stage "${stage.title}" (${stage.mitreTechniqueId}) missing from attribution mitreTechniques`
    );
  }

  assert.equal(lsass.processTree[0]?.name, 'services.exe');
  assert.equal(lsass.processTree[1]?.name, 'lsass.exe');
  assert.equal(lsass.processTree[1]?.pid, 684);
  assert.equal(
    lsass.processTree.some((p) => p.name === 'rundll32.exe' && p.pid === 5412),
    true,
    'LSASS processTree must include rundll32.exe (PID 5412)'
  );
  const lsassProc = lsass.processTree.find((p) => p.name === 'lsass.exe');
  assert.ok(
    lsassProc?.memoryBlocks && lsassProc.memoryBlocks.length >= 3,
    'LSASS process must expose >= 3 forensic memory blocks'
  );
  assert.equal(
    lsassProc.memoryBlocks.some((m) => m.address === '0x00007FF7A8100000'),
    true,
    'LSASS must include lsasrv.dll!LogonSessionList at 0x00007FF7A8100000'
  );

  const lsassClipDir = path.join(CLIPS_DIR, sid);
  const lsassClips = [
    { key: 'step-1', file: 'LsassStep1SeDebugClip.tsx', prefix: 'ls1' },
    { key: 'step-2', file: 'LsassStep2ComsvcsOpenProcessClip.tsx', prefix: 'ls2' },
    { key: 'step-3', file: 'LsassStep3MiniDumpFileClip.tsx', prefix: 'ls3' },
    { key: 'step-4', file: 'LsassStep4SysmonCallTraceClip.tsx', prefix: 'ls4' },
    { key: 'memory-forensics', file: 'LsassMemoryPplDiffClip.tsx', prefix: 'lsmem' },
  ] as const;

  assert.equal(hasTechnicalClip(sid, 'briefing'), false);
  for (const clip of lsassClips) {
    assert.equal(hasTechnicalClip(sid, clip.key), true);
    const src = fs.readFileSync(path.join(lsassClipDir, clip.file), 'utf8');
    assert.match(src, /<AnimeClipStage\b/);
    assert.match(src, new RegExp(`<FilmBackdrop\\s+prefix="${clip.prefix}"\\s*/>`));
    assert.doesNotMatch(src, /<g[^>]*className=[^>]*transform=\{?["'`]translate/);
  }

  for (const sectionKey of listTechnicalWhiteboardSections(sid)) {
    const board = getTechnicalWhiteboard(sid, sectionKey);
    assert.ok(board);
    const boxes = new Map<string, { x: number; y: number; w: number; h: number }>();
    for (const skel of board.skeletons) {
      const s = skel as Record<string, unknown>;
      if (
        s.type === 'rectangle' &&
        typeof s.id === 'string' &&
        typeof s.x === 'number' &&
        typeof s.y === 'number' &&
        typeof s.width === 'number' &&
        typeof s.height === 'number'
      ) {
        boxes.set(s.id, { x: s.x, y: s.y, w: s.width, h: s.height });
      }
    }
    for (const skel of board.skeletons) {
      const s = skel as Record<string, unknown>;
      if (s.type !== 'arrow') continue;
      const startId = (s.start as { id?: string } | undefined)?.id;
      const endId = (s.end as { id?: string } | undefined)?.id;
      if (!startId || !endId) continue;
      const from = boxes.get(startId);
      const to = boxes.get(endId);
      assert.ok(from && to, `Arrow ${String(s.id)} in ${sid}/${sectionKey} references missing box`);
      const sameRow = Math.abs(from.y - to.y) <= 24;
      const sameCol = Math.abs(from.x + from.w / 2 - (to.x + to.w / 2)) <= 16;
      assert.equal(
        sameRow || sameCol,
        true,
        `Arrow ${String(s.id)} (${startId} -> ${endId}) in ${sid}/${sectionKey} is diagonal`
      );
    }
  }
});

test('Batch #2 bespoke scenarios (#031, #037, #039, #047, #048) satisfy cross-layer MITRE, memory, clip, and orthogonal Excalidraw invariants', async () => {
  const { getScenarioAttribution } = await import('./attack-sources-and-legal');
  const batch2 = [
    {
      sid: 'ad-kerberoasting',
      clips: [
        { key: 'step-1', file: 'KerbStep1SpnEnumClip.tsx' },
        { key: 'step-2', file: 'KerbStep2Rc4TgsClip.tsx' },
        { key: 'step-3', file: 'KerbStep3HashcatCrackClip.tsx' },
        { key: 'step-4', file: 'KerbStep4PthLateralClip.tsx' },
        { key: 'memory-forensics', file: 'KerbMemoryRc4AesDiffClip.tsx' },
      ],
    },
    {
      sid: 'zerologon-netlogon-cve-2020-1472',
      clips: [
        { key: 'step-1', file: 'ZlogStep1ZeroIvClip.tsx' },
        { key: 'step-2', file: 'ZlogStep2Eid5805Clip.tsx' },
        { key: 'step-3', file: 'ZlogStep3Eid4742Clip.tsx' },
        { key: 'step-4', file: 'ZlogStep4SecureRpcClip.tsx' },
        { key: 'memory-forensics', file: 'ZlogMemoryIvDiffClip.tsx' },
      ],
    },
    {
      sid: 'dfir-dcsync-drsuapi-replication-eid4662',
      clips: [
        { key: 'step-1', file: 'DcsyncStep1AclClip.tsx' },
        { key: 'step-2', file: 'DcsyncStep2DrsrClip.tsx' },
        { key: 'step-3', file: 'DcsyncStep3Eid4662Clip.tsx' },
        { key: 'step-4', file: 'DcsyncStep4KrbtgtClip.tsx' },
        { key: 'memory-forensics', file: 'DcsyncMemoryAclDiffClip.tsx' },
      ],
    },
    {
      sid: 'log4shell-dfir',
      clips: [
        { key: 'step-1', file: 'Log4jStep1IngressClip.tsx' },
        { key: 'step-2', file: 'Log4jStep2LookupClip.tsx' },
        { key: 'step-3', file: 'Log4jStep3EgressClip.tsx' },
        { key: 'step-4', file: 'Log4jStep4AirlockClip.tsx' },
        { key: 'memory-forensics', file: 'Log4jMemoryClassDiffClip.tsx' },
      ],
    },
    {
      sid: 'dns-tunneling-exfil',
      clips: [
        { key: 'step-1', file: 'DnstunStep1ChunkClip.tsx' },
        { key: 'step-2', file: 'DnstunStep2Sysmon22Clip.tsx' },
        { key: 'step-3', file: 'DnstunStep3TxtBeaconClip.tsx' },
        { key: 'step-4', file: 'DnstunStep4RpzClip.tsx' },
        { key: 'memory-forensics', file: 'DnstunMemoryEntropyDiffClip.tsx' },
      ],
    },
  ] as const;

  for (const item of batch2) {
    const scenario = ATTACK_SCENARIOS.find((s) => s.id === item.sid);
    assert.ok(scenario, `${item.sid} must be registered in ATTACK_SCENARIOS`);

    const attribution = getScenarioAttribution(scenario);
    const attrIds = new Set(attribution.mitreTechniques.map((t) => t.id));
    for (const stage of scenario.stages) {
      assert.equal(
        attrIds.has(stage.mitreTechniqueId),
        true,
        `${item.sid} stage "${stage.title}" (${stage.mitreTechniqueId}) missing from attribution mitreTechniques`
      );
    }

    const totalMemBlocks = scenario.processTree.reduce(
      (sum, p) => sum + (p.memoryBlocks?.length ?? 0),
      0
    );
    assert.ok(
      totalMemBlocks >= 3,
      `${item.sid} must expose >= 3 forensic memory blocks`
    );

    assert.equal(hasTechnicalClip(item.sid, 'briefing'), false);
    const clipDir = path.join(CLIPS_DIR, item.sid);
    const prefixes = new Set<string>();
    for (const clip of item.clips) {
      assert.equal(hasTechnicalClip(item.sid, clip.key), true);
      const src = fs.readFileSync(path.join(clipDir, clip.file), 'utf8');
      assert.match(src, /<AnimeClipStage\b/);
      const prefixMatch = src.match(/<FilmBackdrop\s+prefix="([^"]+)"\s*\/>/);
      assert.ok(prefixMatch, `${clip.file} missing FilmBackdrop prefix`);
      assert.equal(
        prefixes.has(prefixMatch[1]),
        false,
        `Duplicate FilmBackdrop prefix ${prefixMatch[1]} in ${item.sid}`
      );
      prefixes.add(prefixMatch[1]);
      assert.doesNotMatch(
        src,
        /<g[^>]*className=[^>]*transform=\{?["'`]translate/
      );
    }

    for (const sectionKey of listTechnicalWhiteboardSections(item.sid)) {
      const board = getTechnicalWhiteboard(item.sid, sectionKey);
      assert.ok(board);
      const boxes = new Map<string, { x: number; y: number; w: number; h: number }>();
      for (const skel of board.skeletons) {
        const s = skel as Record<string, unknown>;
        if (
          s.type === 'rectangle' &&
          typeof s.id === 'string' &&
          typeof s.x === 'number' &&
          typeof s.y === 'number' &&
          typeof s.width === 'number' &&
          typeof s.height === 'number'
        ) {
          boxes.set(s.id, { x: s.x, y: s.y, w: s.width, h: s.height });
        }
      }
      for (const skel of board.skeletons) {
        const s = skel as Record<string, unknown>;
        if (s.type !== 'arrow') continue;
        const startId = (s.start as { id?: string } | undefined)?.id;
        const endId = (s.end as { id?: string } | undefined)?.id;
        if (!startId || !endId) continue;
        const from = boxes.get(startId);
        const to = boxes.get(endId);
        assert.ok(
          from && to,
          `Arrow ${String(s.id)} in ${item.sid}/${sectionKey} references missing box`
        );
        const sameRow = Math.abs(from.y - to.y) <= 24;
        const sameCol = Math.abs(from.x + from.w / 2 - (to.x + to.w / 2)) <= 16;
        assert.equal(
          sameRow || sameCol,
          true,
          `Arrow ${String(s.id)} (${startId} -> ${endId}) in ${item.sid}/${sectionKey} is diagonal`
        );
      }
    }
  }
});





