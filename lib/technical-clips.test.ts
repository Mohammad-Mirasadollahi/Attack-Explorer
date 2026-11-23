import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { hasTechnicalClip } from './section-technical-clip-registry';

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
