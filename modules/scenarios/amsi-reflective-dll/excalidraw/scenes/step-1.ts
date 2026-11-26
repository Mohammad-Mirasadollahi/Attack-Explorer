import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function step1Board(): TechnicalBoardDescriptor {
  const y1 = 96;
  const h1 = 124;
  const y2 = 308;
  const h2 = 126;

  const winword = { id: 's1-word', x: 40, w: 220 };
  const ps = { id: 's1-ps', x: winword.x + winword.w + ARROW_GAP, w: 255 };
  const lookup = { id: 's1-lookup', x: ps.x + ps.w + ARROW_GAP, w: 280 };
  const log4104 = { id: 's1-4104', x: ps.x, w: 270 };
  const addr = { id: 's1-addr', x: lookup.x, w: 280 };

  return {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'step-1',
    boardBadge: 'TECH BOARD · STEP #1',
    title: 'Step #1 · Encoded PowerShell & AmsiScanBuffer Lookup',
    subtitle: 'Resolving amsi.dll inside PID 5412 while EID 4104 logs the script block.',
    chalkHint: 'Hover each card for P/Invoke signatures and PowerShell Event ID 4104 proof.',
    tooltips: {
      's1-word': {
        kind: 'process',
        title: 'winword.exe (PID 3820)',
        module: 'Office Macro Execution',
        signature: 'CreateProcessW("powershell.exe -NoP -W Hidden -Enc ...")',
        fields: [
          { key: 'parent', type: 'DWORD', value: '2188 (explorer.exe)' },
          { key: 'file', type: 'string', value: 'Q4_Budget_Review.docm' },
          { key: 'telemetry', type: 'EID', value: 'Sysmon Event ID 1' },
        ],
        explain:
          'Microsoft Word launches a hidden PowerShell window carrying a Base64-encoded stager script.',
      },
      's1-ps': {
        kind: 'process',
        title: 'powershell.exe (PID 5412)',
        module: 'Shared User-Mode Address Space',
        signature: 'User: CORP\\a.miller · Integrity: Medium',
        fields: [
          { key: 'flags', type: 'CLI', value: '-NoP -W Hidden -Enc' },
          { key: 'loadedDll', type: 'HMODULE', value: 'C:\\Windows\\System32\\amsi.dll' },
        ],
        explain:
          'PowerShell automatically loads amsi.dll into its own virtual memory, placing the security scanner inside the exact room controlled by the script.',
      },
      's1-lookup': {
        kind: 'api',
        title: 'LoadLibrary + GetProcAddress',
        module: 'kernel32.dll via .NET P/Invoke',
        signature: 'GetProcAddress(LoadLibrary("amsi.dll"), "AmsiScanBuffer")',
        fields: [
          { key: 'module', type: 'LPCSTR', value: '"amsi.dll"' },
          { key: 'export', type: 'LPCSTR', value: '"AmsiScanBuffer"' },
          { key: 'privs', type: 'string', value: 'No Admin Needed (Same PID)' },
        ],
        explain:
          'P/Invoke reads the export table of amsi.dll inside PID 5412 to find the exact per-boot ASLR address of AmsiScanBuffer.',
      },
      's1-addr': {
        kind: 'memory',
        title: 'Resolved Export Pointer',
        module: 'amsi.dll!.text',
        signature: 'FARPROC lpAddress = 0x00007FF9C2142840',
        fields: [
          { key: 'address', type: 'PVOID', value: '0x7FF9C2142840' },
          { key: 'currentProt', type: 'DWORD', value: '0x20 (PAGE_EXECUTE_READ)' },
        ],
        explain:
          'The script now holds the live memory pointer to AmsiScanBuffer, ready for VirtualProtect in Step #2.',
      },
      's1-4104': {
        kind: 'detect',
        title: 'PowerShell Operational EID 4104',
        module: 'Script Block Logging (Pre-Bypass)',
        signature: 'Provider: Microsoft-Windows-PowerShell · EventID: 4104',
        fields: [
          { key: 'decoded', type: 'string', value: 'amsi.dll + AmsiScanBuffer + GetProcAddress' },
          { key: 'timing', type: 'string', value: 'Captured BEFORE AMSI patch runs' },
        ],
        explain:
          'Because PowerShell decodes Base64 and writes Script Block Logs before executing the bypass, defenders receive the full plaintext tamper attempt.',
      },
      's1-sticky': {
        kind: 'note',
        title: 'Why Same-Process Matters',
        module: 'User-Mode Trust Boundary',
        fields: [
          { key: 'boundary', type: 'Ring 3', value: 'Script + amsi.dll share PID 5412' },
          { key: 'impact', type: 'string', value: 'No OpenProcess or Admin required' },
        ],
        explain:
          'Because AMSI runs inside the same user-mode process it monitors, any unprivileged script with P/Invoke can reach its memory.',
      },
    },
    skeletons: [
      title(40, 14, 'Step #1 · PowerShell Stager & AmsiScanBuffer Lookup'),
      box({
        id: winword.id,
        x: winword.x,
        y: y1,
        w: winword.w,
        h: h1,
        label: 'winword.exe\nPID 3820\nMacro Dropper',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...hArrow({
        id: 's1-a1',
        fromId: winword.id,
        toId: ps.id,
        fromRight: winword.x + winword.w,
        toLeft: ps.x,
        midY: y1 + h1 / 2,
        caption: '-NoP -W Hidden',
        stroke: CHALK.api,
      }),
      box({
        id: ps.id,
        x: ps.x,
        y: y1,
        w: ps.w,
        h: h1,
        label: 'powershell.exe\nPID 5412\nHosts amsi.dll in RAM',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      ...hArrow({
        id: 's1-a2',
        fromId: ps.id,
        toId: lookup.id,
        fromRight: ps.x + ps.w,
        toLeft: lookup.x,
        midY: y1 + h1 / 2,
        caption: 'P/Invoke',
        stroke: CHALK.api,
      }),
      box({
        id: lookup.id,
        x: lookup.x,
        y: y1,
        w: lookup.w,
        h: h1,
        label: 'LoadLibrary("amsi.dll")\n+ GetProcAddress\n("AmsiScanBuffer")',
        stroke: CHALK.api,
        fill: CHALK.apiFill,
      }),
      ...vArrow({
        id: 's1-a3',
        fromId: ps.id,
        toId: log4104.id,
        midX: ps.x + ps.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Auto-Decoded Log',
        stroke: CHALK.note,
      }),
      ...vArrow({
        id: 's1-a4',
        fromId: lookup.id,
        toId: addr.id,
        midX: lookup.x + lookup.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'FARPROC',
        stroke: CHALK.warn,
      }),
      sticky({
        id: 's1-sticky',
        x: 40,
        y: y2,
        w: 320,
        h: h2,
        label:
          'NOTE · SHARED ROOM\namsi.dll lives inside PID 5412 RAM.\nNo Admin needed to resolve its export.',
      }),
      box({
        id: log4104.id,
        x: log4104.x,
        y: y2,
        w: log4104.w,
        h: h2,
        label: 'PowerShell EID 4104\nFull Plaintext Script Block\nLogged Pre-Bypass',
        stroke: CHALK.note,
        fill: CHALK.noteFill,
      }),
      box({
        id: addr.id,
        x: addr.x,
        y: y2,
        w: addr.w,
        h: h2,
        label: 'AmsiScanBuffer Pointer\n0x7FF9C2142840\nCurrently 0x20 (RX)',
        stroke: CHALK.warn,
        fill: CHALK.warnFill,
      }),
      note(40, 466, 'Hover any card to inspect P/Invoke fields and EID 4104 capture rules.', CHALK.muted),
    ],
  };
}
