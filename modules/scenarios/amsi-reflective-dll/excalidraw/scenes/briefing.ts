import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function briefingBoard(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 304;
  const h2 = 132;

  const word = { id: 'ab-word', x: 40, w: 225 };
  const ps = { id: 'ab-ps', x: word.x + word.w + ARROW_GAP, w: 245 };
  const amsi = { id: 'ab-amsi', x: ps.x + ps.w + ARROW_GAP, w: 255 };

  const patch = { id: 'ab-patch', x: 410, w: 265 };
  const clr = { id: 'ab-clr', x: patch.x + patch.w + ARROW_GAP, w: 270 };

  return {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'briefing',
    boardBadge: 'TECH BOARD · FULL CHAIN',
    title: 'AMSI Memory Bypass & Reflective Load · Full Chain',
    subtitle: 'Four user-mode handoffs from hidden PowerShell to zero-disk CLR execution.',
    chalkHint: 'Hover any box to inspect API fields, memory offsets, and detection witnesses.',
    tooltips: {
      'ab-word': {
        kind: 'process',
        title: 'winword.exe',
        module: 'Office macro dropper · WKS-FIN-09',
        signature: 'Process { pid: 3820, doc: "Q4_Budget_Review.docm" }',
        fields: [
          { key: 'pid', type: 'DWORD', value: '3820' },
          { key: 'parent', type: 'string', value: 'explorer.exe (2188)' },
          { key: 'child', type: 'string', value: 'powershell.exe -NoP -W Hidden -Enc' },
        ],
        explain:
          'A weaponized Office document spawns hidden encoded PowerShell so the attacker enters a trusted Windows scripting engine.',
        note: 'Sysmon Event ID 1 flags winword.exe spawning PowerShell.',
      },
      'ab-ps': {
        kind: 'process',
        title: 'powershell.exe',
        module: 'Shared user-mode address space',
        signature: 'Process { pid: 5412, user: "CORP\\a.miller" }',
        fields: [
          { key: 'pid', type: 'DWORD', value: '5412' },
          { key: 'amsiDll', type: 'HMODULE', value: 'loaded in same RAM' },
          { key: 'log', type: 'EID', value: 'PowerShell 4104' },
        ],
        explain:
          'Because Windows loads amsi.dll directly inside powershell.exe, the malicious script shares the exact same writable room as its own scanner.',
        note: 'PowerShell EID 4104 logs the script block before AMSI is blinded.',
      },
      'ab-amsi': {
        kind: 'memory',
        title: 'amsi.dll!AmsiScanBuffer',
        module: '0x7FF9C2142840 · .text page',
        signature: 'VirtualProtect(0x7FF9C2142840, 6, 0x40, &old)',
        fields: [
          { key: 'address', type: 'PVOID', value: '0x7FF9C2142840' },
          { key: 'flip', type: 'DWORD', value: '0x20 RX -> 0x40 RWX' },
          { key: 'witness', type: 'ETW-Ti', value: 'EtwTiLogProtectVM' },
        ],
        explain:
          'VirtualProtect unlocks the read-only code page via Copy-on-Write so the script can rewrite the opening six bytes of the scanner.',
      },
      'ab-patch': {
        kind: 'api',
        title: '6-Byte E_INVALIDARG Patch',
        module: 'Marshal.Copy + VirtualProtect restore',
        signature: 'B8 57 00 07 80 C3  ; mov eax, 0x80070057 ; ret',
        fields: [
          { key: 'original', type: 'hex', value: '4C 8B DC 49 89 5B' },
          { key: 'patched', type: 'hex', value: 'B8 57 00 07 80 C3' },
          { key: 'relock', type: 'DWORD', value: '0x20 PAGE_EXECUTE_READ' },
        ],
        explain:
          'Every future scan short-circuits locally with E_INVALIDARG so Windows Defender (MpOav.dll) never sees the stage-2 script.',
      },
      'ab-clr': {
        kind: 'network',
        title: 'Zero-Disk Reflective Load',
        module: 'WebClient.DownloadData + Assembly.Load',
        signature: 'MEM_PRIVATE RWX @ 0x000001E4A2100000',
        fields: [
          { key: 'stager', type: 'HTTPS', value: '198.51.100.74:443' },
          { key: 'disk', type: 'NTFS', value: '0 Bytes (No EID 11)' },
          { key: 'etw', type: 'CLR', value: 'DotNETRuntime EID 152' },
        ],
        explain:
          'The 184 KB payload streams directly into a volatile RAM byte array and executes reflectively without touching the hard drive.',
      },
      'ab-sticky': {
        kind: 'note',
        title: 'Defenders Survive AMSI Bypass',
        module: 'Kernel & Script-Block Telemetry',
        fields: [
          { key: 'step1', type: 'Log', value: 'PowerShell EID 4104' },
          { key: 'step2', type: 'Kernel', value: 'EtwTiLogProtectVM' },
          { key: 'step4', type: 'CLR', value: 'Sysmon 3 + CLR EID 152' },
        ],
        explain:
          'User-mode AMSI patching cannot silence PowerShell EID 4104, kernel ETW-Ti memory-protection telemetry, or .NET empty-path assembly loads.',
      },
    },
    skeletons: [
      title(40, 12, 'T1562.001 / T1620  AMSI Memory Bypass & Reflective Load'),
      box({
        id: word.id,
        x: word.x,
        y: y1,
        w: word.w,
        h: h1,
        label: 'winword.exe\nPID 3820\nMacro Stager',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...hArrow({
        id: 'ab-a1',
        fromId: word.id,
        toId: ps.id,
        fromRight: word.x + word.w,
        toLeft: ps.x,
        midY: y1 + h1 / 2,
        caption: 'Sysmon EID 1',
        stroke: CHALK.api,
      }),
      box({
        id: ps.id,
        x: ps.x,
        y: y1,
        w: ps.w,
        h: h1,
        label: 'powershell.exe\nPID 5412\n-NoP -W Hidden -Enc',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      ...hArrow({
        id: 'ab-a2',
        fromId: ps.id,
        toId: amsi.id,
        fromRight: ps.x + ps.w,
        toLeft: amsi.x,
        midY: y1 + h1 / 2,
        caption: 'GetProcAddress',
        stroke: CHALK.warn,
      }),
      box({
        id: amsi.id,
        x: amsi.x,
        y: y1,
        w: amsi.w,
        h: h1,
        label: 'amsi.dll!AmsiScanBuffer\n0x7FF9C2142840\nVirtualProtect 0x20->0x40',
        stroke: CHALK.warn,
        fill: CHALK.warnFill,
      }),
      ...vArrow({
        id: 'ab-a3',
        fromId: ps.id,
        toId: patch.id,
        midX: ps.x + ps.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Marshal.Copy',
        stroke: CHALK.attacker,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'ab-sticky',
        x: 40,
        y: y2,
        w: 325,
        h: h2,
        label:
          'NOTE · SURVIVING WITNESSES\n1) PowerShell EID 4104 (pre-bypass)\n2) Kernel EtwTiLogProtectVM\n3) Sysmon 3 + CLR EID 152 (0 disk B)',
      }),
      box({
        id: patch.id,
        x: patch.x,
        y: y2,
        w: patch.w,
        h: h2,
        label: '6-Byte Prologue Patch\nB8 57 00 07 80 C3\nE_INVALIDARG + RX 0x20',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...hArrow({
        id: 'ab-a4',
        fromId: patch.id,
        toId: clr.id,
        fromRight: patch.x + patch.w,
        toLeft: clr.x,
        midY: y2 + h2 / 2,
        caption: 'AMSI Blind',
        stroke: CHALK.ok,
      }),
      box({
        id: clr.id,
        x: clr.x,
        y: y2,
        w: clr.w,
        h: h2,
        label: 'Assembly.Load($bytes)\n0x000001E4A2100000\nMEM_PRIVATE RWX (0 Disk)',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      note(40, 464, 'Hover any card to inspect exact hex bytes, addresses, and logs.', CHALK.muted),
    ],
  };
}
