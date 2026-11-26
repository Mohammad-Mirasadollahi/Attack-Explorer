import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function step2Board(): TechnicalBoardDescriptor {
  const y1 = 96;
  const h1 = 124;
  const y2 = 308;
  const h2 = 128;

  const rxPage = { id: 's2-rx', x: 40, w: 235 };
  const vp = { id: 's2-vp', x: rxPage.x + rxPage.w + ARROW_GAP, w: 265 };
  const rwxPage = { id: 's2-rwx', x: vp.x + vp.w + ARROW_GAP, w: 265 };
  const etw = { id: 's2-etw', x: vp.x, w: 295 };
  const cow = { id: 's2-cow', x: rwxPage.x, w: 265 };

  return {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'step-2',
    boardBadge: 'TECH BOARD · STEP #2',
    title: 'Step #2 · VirtualProtect Page Unlock (RX 0x20 -> RWX 0x40)',
    subtitle: 'Unlocking signed amsi.dll!.text via Copy-on-Write while Ring 0 fires EtwTiLogProtectVM.',
    chalkHint: 'Hover each box to inspect page flags, Copy-on-Write isolation, and kernel ETW-Ti.',
    tooltips: {
      's2-rx': {
        kind: 'memory',
        title: 'Protected Code Page (0x20)',
        module: 'amsi.dll!.text · SEC_IMAGE',
        signature: 'PAGE_EXECUTE_READ (0x20) @ 0x7FF9C2142840',
        fields: [
          { key: 'protect', type: 'DWORD', value: '0x20 (R-X)' },
          { key: 'shared', type: 'bool', value: 'true (shared across processes)' },
        ],
        explain:
          'Windows maps signed DLL code as read+execute only so accidental or malicious writes immediately trigger an access violation.',
      },
      's2-vp': {
        kind: 'api',
        title: 'kernel32!VirtualProtect',
        module: 'Transitions to ntdll!NtProtectVirtualMemory',
        signature: 'VirtualProtect(0x7FF9C2142840, 6, 0x40, &lpflOldProtect)',
        fields: [
          { key: 'lpAddress', type: 'LPVOID', value: '0x7FF9C2142840' },
          { key: 'dwSize', type: 'SIZE_T', value: '6 bytes (rounds to 4 KB page)' },
          { key: 'flNewProtect', type: 'DWORD', value: '0x40 (PAGE_EXECUTE_READWRITE)' },
        ],
        explain:
          'VirtualProtect asks the Windows kernel memory manager to unlock the 4 KB page containing AmsiScanBuffer for writing.',
      },
      's2-rwx': {
        kind: 'memory',
        title: 'Unlocked RWX Page (0x40)',
        module: 'PID 5412 Writable Code Window',
        signature: 'PAGE_EXECUTE_READWRITE (0x40)',
        fields: [
          { key: 'oldProtect', type: 'DWORD', value: '0x20 (saved for Step #3)' },
          { key: 'newProtect', type: 'DWORD', value: '0x40 (RWX)' },
        ],
        explain:
          'The page is now simultaneously writable and executable, letting Step #3 copy the 6-byte bypass without crashing.',
      },
      's2-cow': {
        kind: 'kernel',
        title: 'Copy-on-Write Private Fork',
        module: 'Windows Memory Manager',
        signature: 'Shared SEC_IMAGE -> Private Dirty 4 KB Page',
        fields: [
          { key: 'scope', type: 'string', value: 'PID 5412 only' },
          { key: 'diskFile', type: 'string', value: 'System32\\amsi.dll untouched' },
        ],
        explain:
          'Copy-on-Write clones a private physical page exclusively for powershell.exe so other processes keep clean amsi.dll bytes.',
      },
      's2-etw': {
        kind: 'detect',
        title: 'EtwTiLogProtectVM (Ring 0)',
        module: 'Microsoft-Windows-Threat-Intelligence',
        signature: 'ProtectVM { Target: amsi.dll, Old: 0x20, New: 0x40 }',
        fields: [
          { key: 'provider', type: 'ETW-Ti', value: 'Kernel Ring 0 (Tamper-Resistant)' },
          { key: 'signal', type: 'string', value: 'Signed DLL flipped RX -> RWX' },
        ],
        explain:
          'Because this telemetry originates in the Windows kernel, user-mode AMSI patches cannot block or forge the alert.',
      },
      's2-sticky': {
        kind: 'note',
        title: 'High-Fidelity Detection Pivot',
        module: 'SOC Hunting Cheat-Sheet',
        fields: [
          { key: 'normal', type: 'string', value: 'Signed DLLs stay 0x20 RX' },
          { key: 'alert', type: 'string', value: 'PowerShell -> amsi.dll 0x40' },
        ],
        explain:
          'Legitimate PowerShell scripts almost never call VirtualProtect on amsi.dll, making EtwTiLogProtectVM an unmistakable tamper beacon.',
      },
    },
    skeletons: [
      title(40, 14, 'Step #2 · VirtualProtect Unlock (0x20 RX -> 0x40 RWX)'),
      box({
        id: rxPage.id,
        x: rxPage.x,
        y: y1,
        w: rxPage.w,
        h: h1,
        label: 'amsi.dll!.text\n0x7FF9C2142840\nPAGE_EXECUTE_READ (0x20)',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      ...hArrow({
        id: 's2-a1',
        fromId: rxPage.id,
        toId: vp.id,
        fromRight: rxPage.x + rxPage.w,
        toLeft: vp.x,
        midY: y1 + h1 / 2,
        caption: 'Unlock Bolt',
        stroke: CHALK.api,
      }),
      box({
        id: vp.id,
        x: vp.x,
        y: y1,
        w: vp.w,
        h: h1,
        label: 'VirtualProtect(\n  0x7FF9C2142840, 6,\n  0x40 RWX, &old)',
        stroke: CHALK.api,
        fill: CHALK.apiFill,
      }),
      ...hArrow({
        id: 's2-a2',
        fromId: vp.id,
        toId: rwxPage.id,
        fromRight: vp.x + vp.w,
        toLeft: rwxPage.x,
        midY: y1 + h1 / 2,
        caption: 'NtProtectVM',
        stroke: CHALK.warn,
      }),
      box({
        id: rwxPage.id,
        x: rwxPage.x,
        y: y1,
        w: rwxPage.w,
        h: h1,
        label: '4 KB Page Unlocked\nPAGE_EXECUTE_READWRITE\n(0x40 · Writable)',
        stroke: CHALK.warn,
        fill: CHALK.warnFill,
      }),
      ...vArrow({
        id: 's2-a3',
        fromId: vp.id,
        toId: etw.id,
        midX: vp.x + vp.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Ring 0 Witness',
        stroke: CHALK.attacker,
      }),
      ...vArrow({
        id: 's2-a4',
        fromId: rwxPage.id,
        toId: cow.id,
        midX: rwxPage.x + rwxPage.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Forks Page',
        stroke: CHALK.ok,
      }),
      sticky({
        id: 's2-sticky',
        x: 40,
        y: y2,
        w: 325,
        h: h2,
        label:
          'NOTE · UV HINGE BEACON\nUnlocking signed amsi.dll to RWX\nfires Ring 0 EtwTiLogProtectVM\nwhich user-mode cannot silence.',
      }),
      box({
        id: etw.id,
        x: etw.x,
        y: y2,
        w: etw.w,
        h: h2,
        label: 'Kernel ETW-Ti Alert\nEtwTiLogProtectVM\n0x20 -> 0x40 on amsi.dll',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      box({
        id: cow.id,
        x: cow.x,
        y: y2,
        w: cow.w,
        h: h2,
        label: 'Copy-on-Write Fork\nPrivate Page for PID 5412\nDisk File Unchanged',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      note(40, 466, 'Hover any box to see kernel PTE transition and ETW-Ti fields.', CHALK.muted),
    ],
  };
}
