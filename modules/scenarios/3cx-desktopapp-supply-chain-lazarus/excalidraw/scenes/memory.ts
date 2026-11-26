import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CLEANROOM_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function threeCxMemoryBoard(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;

  const clean = { id: 'cxm-clean', x: 40, w: 245 };
  const carrier = { id: 'cxm-carrier', x: clean.x + clean.w + ARROW_GAP, w: 255 };
  const loader = { id: 'cxm-loader', x: carrier.x + carrier.w + ARROW_GAP, w: 245 };

  const stage2 = { id: 'cxm-stage2', x: 430, w: 260 };
  const triage = { id: 'cxm-triage', x: stage2.x + stage2.w + ARROW_GAP, w: 250 };

  return {
    scenarioId: '3cx-desktopapp-supply-chain-lazarus',
    sectionKey: 'memory-forensics',
    boardBadge: 'MEMORY FORENSICS · PID 7120',
    title: 'Virtual Memory Diff: Clean DLL vs. 0xFEEDFACE & Dual RWX Slabs',
    subtitle: 'Comparing clean Microsoft d3dcompiler_47.dll against three forensic memory artifacts inside PID 7120.',
    chalkHint: 'Hover any box to inspect base addresses, protection bits, and Volatility/PE-sieve indicators.',
    tooltips: {
      'cxm-clean': {
        kind: 'memory',
        title: 'Clean Microsoft d3dcompiler_47.dll Baseline',
        module: 'MEM_IMAGE · Valid Authenticode · Clean EOF',
        signature: 'Sections: .text (RX) + .rdata (R) + .data (RW) | Overlay: 0 B',
        fields: [
          { key: 'signing', type: 'Cert', value: 'Microsoft Windows (Valid)' },
          { key: 'backing', type: 'VAD', value: 'File-backed MEM_IMAGE' },
          { key: 'overlay', type: 'EOF', value: '0 trailing encrypted bytes' },
        ],
        explain:
          'A legitimate Direct3D compiler DLL ends cleanly at its declared PE section boundary and never spawns private executable heap allocations.',
      },
      'cxm-carrier': {
        kind: 'memory',
        title: '0x7FF8A1000000 · Trojanized d3dcompiler_47.dll',
        module: 'PE Carrier + FE ED FA CE + 312 KB RC4 Overlay',
        signature: 'Base: 0x7FF8A1000000 | Marker: 0xFEEDFACE | Size: +312 KB',
        fields: [
          { key: 'address', type: 'PVOID', value: '0x7FF8A1000000' },
          { key: 'sentinel', type: 'Hex', value: 'FE ED FA CE (0xFEEDFACE)' },
          { key: 'entropy', type: 'Score', value: '~7.98 (RC4 ciphertext overlay)' },
        ],
        explain:
          'Memory inspection of the mapped DLL shows the broken Microsoft signature and the 4-byte 0xFEEDFACE sentinel guarding 312 KB of encrypted shellcode.',
      },
      'cxm-loader': {
        kind: 'memory',
        title: '0x000001C948200000 · Stage-1 Loader Shellcode',
        module: 'MEM_PRIVATE · PAGE_EXECUTE_READWRITE (0x40)',
        signature: 'VirtualAlloc -> RC4("3jB(2bsG#@c7") -> Unbacked Code',
        fields: [
          { key: 'address', type: 'PVOID', value: '0x000001C948200000' },
          { key: 'protect', type: 'Flags', value: '0x40 RWX (MEM_PRIVATE)' },
          { key: 'role', type: 'Code', value: 'Sleeps 7d + fetches GitHub .ico' },
        ],
        explain:
          'This private RWX region holds the decrypted Stage-1 loader with no corresponding executable file on NTFS disk.',
      },
      'cxm-stage2': {
        kind: 'memory',
        title: '0x000001C948280000 · ICONICSTEALER / Gopuram',
        module: 'MEM_PRIVATE · PAGE_EXECUTE_READWRITE (0x40)',
        signature: 'Reflective Stage-2 Payload inside 3CXDesktopApp.exe',
        fields: [
          { key: 'address', type: 'PVOID', value: '0x000001C948280000' },
          { key: 'protect', type: 'Flags', value: '0x40 RWX (MEM_PRIVATE)' },
          { key: 'strings', type: 'IOC', value: 'Login Data + akamaitechcloudservices' },
        ],
        explain:
          'Dumping this second unbacked RWX allocation recovers cleartext browser-stealer logic and C2 configuration strings directly from RAM.',
      },
      'cxm-triage': {
        kind: 'detect',
        title: 'Volatility / PE-sieve / Moneta Hunt Verdict',
        module: 'Definitive In-Memory Attribution Proof',
        fields: [
          { key: 'malfind', type: 'Tool', value: '2 unbacked RWX VADs in PID 7120' },
          { key: 'yara', type: 'Rule', value: 'Matches 0xFEEDFACE + RC4 key stub' },
          { key: 'evidence', type: 'IR', value: 'Dump PID 7120 before killing host' },
        ],
        explain:
          'Acquiring a process memory dump of PID 7120 prior to termination preserves both unbacked RWX stages that vanish permanently upon reboot.',
      },
      'cxm-sticky': {
        kind: 'note',
        title: 'Forensic Preservation Checklist',
        module: 'Live RAM Triage Before Remediation',
        fields: [
          { key: 'capture', type: 'Order', value: '1) Dump PID 7120 RAM  2) Kill process' },
          { key: 'artifacts', type: 'Proof', value: '0x7FF8A1000000 + 2 MEM_PRIVATE RWX' },
        ],
        explain:
          'Capturing volatile memory before uninstalling 3CXDesktopApp preserves the decrypted Stage-2 implant and active C2 indicators.',
      },
    },
    skeletons: [
      title(40, 12, 'Memory Forensics · Clean DLL vs. 0xFEEDFACE & Dual RWX Slabs'),
      box({
        id: clean.id,
        x: clean.x,
        y: y1,
        w: clean.w,
        h: h1,
        label: 'Clean Microsoft DLL\nd3dcompiler_47.dll\nMEM_IMAGE · Clean EOF',
        stroke: CLEANROOM_CHALK.edr,
        fill: CLEANROOM_CHALK.edrFill,
      }),
      ...hArrow({
        id: 'cxm-a1',
        fromId: clean.id,
        toId: carrier.id,
        fromRight: clean.x + clean.w,
        toLeft: carrier.x,
        midY: y1 + h1 / 2,
        caption: 'Diff Overlay',
        stroke: CLEANROOM_CHALK.goldSeal,
      }),
      box({
        id: carrier.id,
        x: carrier.x,
        y: y1,
        w: carrier.w,
        h: h1,
        label: '0x7FF8A1000000\nFE ED FA CE Marker\n+ 312 KB RC4 Blob',
        stroke: CLEANROOM_CHALK.goldSeal,
        fill: CLEANROOM_CHALK.goldSealFill,
      }),
      ...hArrow({
        id: 'cxm-a2',
        fromId: carrier.id,
        toId: loader.id,
        fromRight: carrier.x + carrier.w,
        toLeft: loader.x,
        midY: y1 + h1 / 2,
        caption: 'Decrypt RWX',
        stroke: CLEANROOM_CHALK.implant,
      }),
      box({
        id: loader.id,
        x: loader.x,
        y: y1,
        w: loader.w,
        h: h1,
        label: '0x000001C948200000\nMEM_PRIVATE RWX\nStage-1 Loader',
        stroke: CLEANROOM_CHALK.implant,
        fill: CLEANROOM_CHALK.implantFill,
      }),
      ...vArrow({
        id: 'cxm-a3',
        fromId: loader.id,
        toId: stage2.id,
        midX: stage2.x + stage2.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Reflective Map',
        stroke: CLEANROOM_CHALK.cipher,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'cxm-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'VOLATILE MEMORY RULE\nDump PID 7120 before killing process:\n2 MEM_PRIVATE RWX regions hold cleartext.',
      }),
      box({
        id: stage2.id,
        x: stage2.x,
        y: y2,
        w: stage2.w,
        h: h2,
        label: '0x000001C948280000\nMEM_PRIVATE RWX\nICONICSTEALER / Gopuram',
        stroke: CLEANROOM_CHALK.cipher,
        fill: CLEANROOM_CHALK.cipherFill,
      }),
      ...hArrow({
        id: 'cxm-a4',
        fromId: stage2.id,
        toId: triage.id,
        fromRight: stage2.x + stage2.w,
        toLeft: triage.x,
        midY: y2 + h2 / 2,
        caption: 'PE-sieve / YARA',
        stroke: CLEANROOM_CHALK.edr,
      }),
      box({
        id: triage.id,
        x: triage.x,
        y: y2,
        w: triage.w,
        h: h2,
        label: 'Forensic Verdict\n3 Memory Artifacts\nConfirmed in PID 7120',
        stroke: CLEANROOM_CHALK.edr,
        fill: CLEANROOM_CHALK.edrFill,
      }),
      note(40, 464, 'Hover each memory region to inspect VAD protection flags, offsets, and YARA rules.', CLEANROOM_CHALK.muted),
    ],
  };
}
