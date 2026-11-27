import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function lsassStep3Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 302;
  const h2 = 126;

  const mem = { id: 'ls3-mem', x: 40, w: 245 };
  const dbg = { id: 'ls3-dbg', x: mem.x + mem.w + ARROW_GAP, w: 256 };
  const file = { id: 'ls3-file', x: dbg.x + dbg.w + ARROW_GAP, w: 248 };
  const eid11 = { id: 'ls3-eid11', x: file.x, w: 248 };

  return {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'step-3',
    boardBadge: 'STEP #3 · MINIDUMPWRITEDUMP & MDMP FILE',
    title: 'dbgcore.dll Full-Memory Snapshot -> C:\\Windows\\Temp\\debug.dmp (48.2 MB)',
    subtitle:
      'MiniDumpWriteDump(0x2) copies lsasrv.dll and msv1_0.dll credential structures into a 48.2 MB MDMP file caught by Sysmon EID 11.',
    chalkHint:
      'Hover any node to inspect the LSASS heap addresses, MiniDumpWithFullMemory (0x2), and the 4D 44 4D 50 93 A7 magic header.',
    tooltips: {
      'ls3-mem': {
        kind: 'memory',
        title: 'Live LSASS Credential Memory Regions',
        module: 'lsass.exe (PID 684) Private Heap & Auth Packages',
        signature: '0x00007FF7A8100000 (lsasrv.dll) + 0x00007FFAD4200000 (msv1_0.dll / kerberos.dll)',
        fields: [
          { key: 'sessions', type: 'RW Heap', value: 'lsasrv.dll!LogonSessionList @ 0x00007FF7A8100000' },
          { key: 'auth', type: 'Packages', value: 'msv1_0.dll & kerberos.dll @ 0x00007FFAD4200000' },
          { key: 'keys', type: '3DES/AES', value: 'LsaProtectMemory keys inside lsasrv.dll' },
        ],
        explain:
          'Dumping full memory captures both the encrypted credential list and the LSA encryption keys needed to decrypt NTLM hashes and TGTs offline.',
      },
      'ls3-dbg': {
        kind: 'process',
        title: 'dbgcore.dll!MiniDumpWriteDump Serialization',
        module: 'C:\\Windows\\System32\\dbgcore.dll (0x000001C840200000)',
        signature: 'MiniDumpWriteDump(hLsass, 684, hFile, MiniDumpWithFullMemory=0x2)',
        fields: [
          { key: 'flag', type: 'Type', value: 'MiniDumpWithFullMemory (0x00000002)' },
          { key: 'buffer', type: 'Staging', value: '0x000001C840200000 (rundll32 PID 5412)' },
          { key: 'reads', type: 'Syscall', value: 'Repeated NtReadVirtualMemory chunks' },
        ],
        explain:
          'The "full" argument passed to comsvcs.dll selects flag 0x2 so every accessible virtual memory page of lsass.exe is written into the output file.',
      },
      'ls3-file': {
        kind: 'memory',
        title: 'On-Disk Minidump Artifact (MDMP Magic Header)',
        module: 'C:\\Windows\\Temp\\debug.dmp (48.2 MB)',
        signature: 'Bytes 0..5: 4D 44 4D 50 93 A7 ("MDMP") | Streams: Memory64List + ModuleList',
        fields: [
          { key: 'path', type: 'File', value: 'C:\\Windows\\Temp\\debug.dmp' },
          { key: 'size', type: 'Disk', value: '48.2 MB full process memory image' },
          { key: 'header', type: 'Magic', value: '4D 44 4D 50 93 A7 ("MDMP")' },
        ],
        explain:
          'Even if renamed to .png or .txt, every Windows minidump starts with the 6-byte MDMP signature and contains lsasrv.dll module directory entries.',
      },
      'ls3-eid11': {
        kind: 'detect',
        title: 'Sysmon Event ID 11 (FileCreate) + YARA Magic Match',
        module: 'Sysmon EID 11 + YARA LSASS_MDMP_File_Header',
        signature: 'Image=rundll32.exe | TargetFilename=C:\\Windows\\Temp\\debug.dmp',
        fields: [
          { key: 'creator', type: 'Process', value: 'rundll32.exe (PID 5412)' },
          { key: 'yara', type: 'Rule', value: '4D 44 4D 50 93 A7 + "lsasrv.dll" string' },
          { key: 'alert', type: 'Priority', value: 'Critical — Immediate host containment' },
        ],
        explain:
          'rundll32.exe writing a multi-megabyte MDMP file into C:\\Windows\\Temp is a near-zero false-positive indicator of LSASS credential dumping.',
      },
      'ls3-sticky': {
        kind: 'note',
        title: 'Why Renaming debug.dmp Fails Against YARA',
        module: 'Content-Based Forensic Detection',
        fields: [
          { key: 'magic', type: 'Offset 0', value: '4D 44 4D 50 93 A7 ("MDMP")' },
          { key: 'strings', type: 'Body', value: 'lsasrv.dll + msv1_0.dll + kerberos.dll' },
        ],
        explain:
          'Inspecting file headers and embedded module names catches renamed minidumps (e.g., report.log or cache.dat) created by comsvcs.dll.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 3 · MiniDumpWriteDump(0x2) -> debug.dmp (MDMP 4D 44 4D 50 93 A7)'),
      box({
        id: mem.id,
        x: mem.x,
        y: y1,
        w: mem.w,
        h: h1,
        label: 'lsass.exe RAM (PID 684)\n0x7FF7A8100000 lsasrv\n0x7FFAD4200000 msv1_0',
        stroke: VAULT_CHALK.gold,
        fill: VAULT_CHALK.goldFill,
      }),
      ...hArrow({
        id: 'ls3-a1',
        fromId: mem.id,
        toId: dbg.id,
        fromRight: mem.x + mem.w,
        toLeft: dbg.x,
        midY: y1 + h1 / 2,
        caption: 'ReadVirtualMem',
        stroke: VAULT_CHALK.crimson,
      }),
      box({
        id: dbg.id,
        x: dbg.x,
        y: y1,
        w: dbg.w,
        h: h1,
        label: 'dbgcore.dll (PID 5412)\nMiniDumpWriteDump(0x2)\n0x000001C840200000',
        stroke: VAULT_CHALK.crimson,
        fill: VAULT_CHALK.crimsonFill,
      }),
      ...hArrow({
        id: 'ls3-a2',
        fromId: dbg.id,
        toId: file.id,
        fromRight: dbg.x + dbg.w,
        toLeft: file.x,
        midY: y1 + h1 / 2,
        caption: 'Write 48.2 MB',
        stroke: VAULT_CHALK.violet,
      }),
      box({
        id: file.id,
        x: file.x,
        y: y1,
        w: file.w,
        h: h1,
        label: 'C:\\Windows\\Temp\\debug.dmp\nMagic: 4D 44 4D 50 93 A7\nFull Credential Image',
        stroke: VAULT_CHALK.violet,
        fill: VAULT_CHALK.violetFill,
      }),
      ...vArrow({
        id: 'ls3-a3',
        fromId: file.id,
        toId: eid11.id,
        midX: eid11.x + eid11.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'FileCreate',
        stroke: VAULT_CHALK.emerald,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'ls3-sticky',
        x: 40,
        y: y2,
        w: 440,
        h: h2,
        label:
          'FORENSIC FILE SIGNATURE\nEven if attacker renames debug.dmp to image.jpg,\nbytes 0..5 stay 4D 44 4D 50 93 A7 ("MDMP").',
      }),
      box({
        id: eid11.id,
        x: eid11.x,
        y: y2,
        w: eid11.w,
        h: h2,
        label: 'Sysmon EID 11 + YARA\nrundll32 wrote .dmp\nHeader MDMP Matched',
        stroke: VAULT_CHALK.emerald,
        fill: VAULT_CHALK.emeraldFill,
      }),
      note(
        40,
        460,
        'Hover each node to inspect LSASS virtual addresses, MiniDumpWriteDump flag 0x2, and Sysmon EID 11 detection.',
        VAULT_CHALK.muted
      ),
    ],
  };
}
