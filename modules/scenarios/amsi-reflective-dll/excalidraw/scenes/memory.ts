import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title } from '../helpers';

export function memoryBoard(): TechnicalBoardDescriptor {
  const y1 = 96;
  const h1 = 128;
  const y2 = 304;
  const h2 = 128;

  const diskAmsi = { id: 'm-disk-amsi', x: 40, w: 295 };
  const ramAmsi = { id: 'm-ram-amsi', x: diskAmsi.x + diskAmsi.w + ARROW_GAP, w: 315 };
  const diffVerdict = { id: 'm-verdict', x: ramAmsi.x + ramAmsi.w + ARROW_GAP, w: 265 };

  const diskNone = { id: 'm-disk-none', x: 40, w: 295 };
  const ramPe = { id: 'm-ram-pe', x: diskNone.x + diskNone.w + ARROW_GAP, w: 315 };
  const clrHeap = { id: 'm-clr-heap', x: ramPe.x + ramPe.w + ARROW_GAP, w: 265 };

  return {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'memory-forensics',
    boardBadge: 'TECH BOARD · MEMORY FORENSICS',
    title: 'Memory Forensics · Signed Disk vs. Live Dirty RAM & Unbacked PE',
    subtitle: 'Two forensic mismatches inside powershell.exe (PID 5412) prove AMSI bypass and fileless loading.',
    chalkHint: 'Hover any memory block to inspect hex bytes, VAD flags, and disk-vs-RAM diffs.',
    tooltips: {
      'm-disk-amsi': {
        kind: 'memory',
        title: 'Clean On-Disk amsi.dll',
        module: 'C:\\Windows\\System32\\amsi.dll',
        signature: '4C 8B DC 49 89 5B  (Microsoft Signed SEC_IMAGE)',
        fields: [
          { key: 'bytes', type: 'hex[6]', value: '4C 8B DC 49 89 5B' },
          { key: 'state', type: 'string', value: 'Clean signed baseline on NTFS' },
        ],
        explain:
          'The authentic on-disk amsi.dll file in System32 never changes because VirtualProtect triggered Copy-on-Write in RAM.',
      },
      'm-ram-amsi': {
        kind: 'memory',
        title: 'Live CoW Dirty Page @ 0x7FF9C2142840',
        module: 'powershell.exe (PID 5412) Working Set',
        signature: 'B8 57 00 07 80 C3  (mov eax, 0x80070057; ret)',
        fields: [
          { key: 'protect', type: 'DWORD', value: '0x20 R-X (re-locked)' },
          { key: 'shared', type: 'bool', value: 'false (Private CoW Dirty Page)' },
        ],
        explain:
          'Even after permissions are restored to R-X, comparing these six live bytes against System32 proves AMSI was tampered.',
      },
      'm-verdict': {
        kind: 'detect',
        title: 'Integrity Diff Verdict',
        module: 'Moneta / PE-sieve / Defender Scanner',
        signature: 'MODIFIED_CODE inside signed SEC_IMAGE (amsi.dll)',
        fields: [
          { key: 'diffBytes', type: 'int', value: '6 bytes modified at RVA +0x0' },
          { key: 'witness', type: 'ETW-Ti', value: 'EtwTiLogProtectVM (0x20->0x40->0x20)' },
        ],
        explain:
          'Memory scanners immediately flag private modified code pages inside signed Microsoft system DLLs.',
      },
      'm-disk-none': {
        kind: 'note',
        title: 'No Backing File on NTFS',
        module: 'VAD FileObject = NULL',
        signature: 'Sysmon Event ID 11 = 0 · Disk Path = ""',
        fields: [
          { key: 'fileObject', type: 'PVOID', value: '0x0000000000000000 (NULL)' },
          { key: 'diskSize', type: 'int', value: '0 Bytes on NTFS' },
        ],
        explain:
          'Legitimate DLLs always point to a file path on disk; an executable PE image with NULL FileObject is a classic reflective load indicator.',
      },
      'm-ram-pe': {
        kind: 'memory',
        title: 'Unbacked Reflective PE/CLR',
        module: '0x000001E4A2100000 · 184 KB',
        signature: 'MEM_PRIVATE | PAGE_EXECUTE_READWRITE (0x40) · 4D 5A 90 00',
        fields: [
          { key: 'header', type: 'hex', value: '4D 5A 90 00 (MZ PE Header)' },
          { key: 'type', type: 'VAD', value: 'MEM_PRIVATE RWX (Unbacked)' },
        ],
        explain:
          'A full Windows executable header living inside anonymous MEM_PRIVATE RWX RAM proves reflective injection without LoadLibraryW.',
      },
      'm-clr-heap': {
        kind: 'memory',
        title: 'Managed CLR Assembly Heap',
        module: '0x000001E4A2150000 · 96 KB RW-',
        signature: 'Stage2Recon decrypted config + .NET runtime objects',
        fields: [
          { key: 'protect', type: 'DWORD', value: '0x04 (PAGE_READWRITE)' },
          { key: 'etw', type: 'CLR', value: 'Event ID 152 (Path == "")' },
        ],
        explain:
          'Live .NET heap strings and tasking config remain recoverable from a memory dump of PID 5412.',
      },
    },
    skeletons: [
      title(40, 14, 'Memory Forensics · Disk vs. Live RAM (PID 5412)'),
      box({
        id: diskAmsi.id,
        x: diskAmsi.x,
        y: y1,
        w: diskAmsi.w,
        h: h1,
        label: 'ON-DISK amsi.dll (CLEAN)\n4C 8B DC 49 89 5B\nSigned SEC_IMAGE',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      ...hArrow({
        id: 'm-a1',
        fromId: diskAmsi.id,
        toId: ramAmsi.id,
        fromRight: diskAmsi.x + diskAmsi.w,
        toLeft: ramAmsi.x,
        midY: y1 + h1 / 2,
        caption: '6-Byte Diff!',
        stroke: CHALK.attacker,
      }),
      box({
        id: ramAmsi.id,
        x: ramAmsi.x,
        y: y1,
        w: ramAmsi.w,
        h: h1,
        label: 'LIVE RAM 0x7FF9C2142840\nB8 57 00 07 80 C3\nCoW Dirty Private Page',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...hArrow({
        id: 'm-a2',
        fromId: ramAmsi.id,
        toId: diffVerdict.id,
        fromRight: ramAmsi.x + ramAmsi.w,
        toLeft: diffVerdict.x,
        midY: y1 + h1 / 2,
        caption: 'PE-sieve',
        stroke: CHALK.warn,
      }),
      box({
        id: diffVerdict.id,
        x: diffVerdict.x,
        y: y1,
        w: diffVerdict.w,
        h: h1,
        label: 'EDR INTEGRITY ALERT\nSigned DLL Tampered\nin User-Mode RAM',
        stroke: CHALK.warn,
        fill: CHALK.warnFill,
      }),
      sticky({
        id: diskNone.id,
        x: diskNone.x,
        y: y2,
        w: diskNone.w,
        h: h2,
        label: 'NTFS DISK FILE TABLE\nFileObject = NULL (0 Bytes)\nZero Sysmon EID 11',
      }),
      ...hArrow({
        id: 'm-a3',
        fromId: diskNone.id,
        toId: ramPe.id,
        fromRight: diskNone.x + diskNone.w,
        toLeft: ramPe.x,
        midY: y2 + h2 / 2,
        caption: 'Unbacked!',
        stroke: CHALK.attacker,
      }),
      box({
        id: ramPe.id,
        x: ramPe.x,
        y: y2,
        w: ramPe.w,
        h: h2,
        label: '0x000001E4A2100000 (184 KB)\nMEM_PRIVATE RWX (0x40)\n4D 5A 90 00 Reflective PE',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...hArrow({
        id: 'm-a4',
        fromId: ramPe.id,
        toId: clrHeap.id,
        fromRight: ramPe.x + ramPe.w,
        toLeft: clrHeap.x,
        midY: y2 + h2 / 2,
        caption: 'CLR Heap',
        stroke: CHALK.api,
      }),
      box({
        id: clrHeap.id,
        x: clrHeap.x,
        y: y2,
        w: clrHeap.w,
        h: h2,
        label: '0x000001E4A2150000 (96 KB)\nManaged CLR Heap (RW-)\nStage2Recon Config',
        stroke: CHALK.api,
        fill: CHALK.apiFill,
      }),
      note(40, 464, 'Hover any memory region for VAD flags, hex offsets, and hunting tools.', CHALK.muted),
    ],
  };
}
