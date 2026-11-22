import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title } from '../helpers';
import type { TechnicalBoardDescriptor } from '../types';

export function step2Board(): TechnicalBoardDescriptor {
  const y1 = 90;
  const h1 = 130;
  const y2 = 310;
  const h2 = 130;

  const key = { id: 's2-key', x: 40, w: 230 };
  const peb = { id: 's2-peb', x: key.x + key.w + ARROW_GAP, w: 280 };
  const hollow = { id: 's2-hollow', x: peb.x + peb.w + ARROW_GAP, w: 300 };

  return {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-2',
    boardBadge: 'TECH BOARD · STEP #2',
    title: 'NtUnmapViewOfSection · Hollow the image',
    subtitle: 'Read PEB ImageBase, then tear out the signed SEC_IMAGE mapping.',
    chalkHint:
      'Hover nodes for structure + a plain explanation of the unmap.',
    tooltips: {
      's2-key': {
        kind: 'handle',
        title: 'hProcess',
        module: 'Carried from Step #1',
        signature: 'HANDLE hProcess = 0x01C4',
        fields: [
          { key: 'value', type: 'HANDLE', value: '0x01C4' },
          { key: 'rights', type: 'string', value: 'read / edit remote RAM' },
          { key: 'next', type: 'API', value: 'PEB walk → NtUnmap' },
        ],
        explain:
          'Same memory key from Step #1. The attacker uses it to peek inside the child’s PEB and later to unmap the signed image.',
        note: 'No new privileges — reuse the CreateProcess handle.',
      },
      's2-peb': {
        kind: 'memory',
        title: 'PEB.ImageBaseAddress',
        module: 'ntdll · Process Environment Block',
        signature: 'PVOID ImageBaseAddress @ PEB+0x10 (x64)',
        fields: [
          { key: 'offset', type: 'ULONG', value: 'PEB + 0x10' },
          { key: 'value', type: 'PVOID', value: '0x00400000' },
          { key: 'meaning', type: 'string', value: 'where svchost image lives' },
        ],
        explain:
          'The PEB is a small control panel for the process. ImageBaseAddress tells you the starting address of the main EXE in memory — here 0x00400000. That is the slot the attacker will empty.',
        note: 'Find the cargo bay before emptying it.',
      },
      's2-hollow': {
        kind: 'api',
        title: 'NtUnmapViewOfSection',
        module: 'ntdll.dll',
        signature: 'NTSTATUS NtUnmapViewOfSection(HANDLE, PVOID)',
        fields: [
          { key: 'ProcessHandle', type: 'HANDLE', value: '0x01C4' },
          { key: 'BaseAddress', type: 'PVOID', value: '0x00400000' },
          { key: 'status', type: 'NTSTATUS', value: '0x0 SUCCESS' },
          { key: 'effect', type: 'string', value: 'SEC_IMAGE VAD removed' },
        ],
        explain:
          'This API removes the file-backed Microsoft image from that address. The process still shows as svchost.exe in tools that only look at the name — but the original code pages are gone.',
        note: 'This is the “hollow” in process hollowing.',
      },
      's2-kernel': {
        kind: 'kernel',
        title: 'MiUnmapViewOfSection',
        module: 'ntoskrnl.exe',
        signature: 'nt!MiUnmapViewOfSection',
        fields: [
          { key: 'path', type: 'symbol', value: 'nt!MiUnmapViewOfSection' },
          { key: 'tears', type: 'string', value: 'file-backed SEC_IMAGE' },
          { key: 'frees', type: 'string', value: 'VA slot for Step #3 PE' },
        ],
        explain:
          'Under the hood, the kernel tears down the virtual address descriptor (VAD) for the image. User-mode called NtUnmap; kernel did the real cleanup.',
        note: 'Useful when reading kernel ETW / crash dumps.',
      },
      's2-det': {
        kind: 'detect',
        title: 'Unmap / tamper signals',
        module: 'ETW + Sysmon',
        fields: [
          { key: 'etw', type: 'string', value: 'primary image unmap' },
          { key: 'sysmon', type: 'EID', value: '10 / 25' },
          { key: 'tell', type: 'string', value: 'foreign handle strips image' },
        ],
        explain:
          'A remote process unmapping the primary EXE image is rare for normal software. Hunt for ETW unmap events and Sysmon access/tamper IDs tied to that PID.',
      },
      's2-sticky': {
        kind: 'note',
        title: 'Paint vs cargo',
        module: 'Teaching note',
        fields: [
          { key: 'keeps', type: 'string', value: 'process name + token' },
          { key: 'drops', type: 'string', value: 'signed image pages' },
        ],
        explain:
          'Hollowing keeps the outside appearance (name, path, often the token) while removing the inside code. Defenders who only trust the name will miss it.',
      },
    },
    skeletons: [
      title(40, 12, 'Step #2  ·  Unmap original svchost image'),
      box({
        id: key.id,
        x: key.x,
        y: y1,
        w: key.w,
        h: h1,
        label: 'hProcess 0x01C4\n(read / edit RAM)',
        stroke: CHALK.note,
        fill: CHALK.noteFill,
      }),
      ...hArrow({
        id: 's2-a1',
        fromId: key.id,
        toId: peb.id,
        fromRight: key.x + key.w,
        toLeft: peb.x,
        midY: y1 + h1 / 2,
        caption: 'PEB + 0x10',
        stroke: CHALK.api,
      }),
      box({
        id: peb.id,
        x: peb.x,
        y: y1,
        w: peb.w,
        h: h1,
        label: 'PEB.ImageBaseAddress\n= 0x00400000',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      ...hArrow({
        id: 's2-a2',
        fromId: peb.id,
        toId: hollow.id,
        fromRight: peb.x + peb.w,
        toLeft: hollow.x,
        midY: y1 + h1 / 2,
        caption: 'NtUnmapViewOfSection',
        stroke: CHALK.attacker,
      }),
      box({
        id: hollow.id,
        x: hollow.x,
        y: y1,
        w: hollow.w,
        h: h1,
        label:
          'VAD @ 0x00400000\nSEC_IMAGE removed\nNTSTATUS = 0x0 SUCCESS\nname still svchost.exe',
        stroke: CHALK.warn,
        fill: CHALK.warnFill,
      }),
      sticky({
        id: 's2-sticky',
        x: 40,
        y: y2,
        w: 340,
        h: h2,
        label:
          'NOTE\nOutside paint stays:\nprocess name + token.\nInside cargo is gone.',
      }),
      box({
        id: 's2-kernel',
        x: 420,
        y: y2,
        w: 360,
        h: h2,
        label:
          'Kernel path\nnt!MiUnmapViewOfSection\ntears file-backed mapping\nslot freed for Step #3 PE',
        stroke: CHALK.api,
        fill: CHALK.apiFill,
      }),
      box({
        id: 's2-det',
        x: 820,
        y: y2,
        w: 360,
        h: h2,
        label:
          'Detect: ETW unmap\n+ Sysmon EID 10 / 25\nforeign handle stripping\nprimary image section',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      note(
        40,
        470,
        'Hover any box for the API card + plain explanation.',
        CHALK.muted
      ),
    ],
  };
}
