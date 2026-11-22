import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';
import type { TechnicalBoardDescriptor } from '../types';

export function briefingBoard(): TechnicalBoardDescriptor {
  const y1 = 90;
  const h1 = 120;
  const y2 = 300;
  const h2 = 130;

  const loader = { id: 'b-loader', x: 40, w: 210 };
  const host = { id: 'b-host', x: loader.x + loader.w + ARROW_GAP, w: 230 };
  const hollow = { id: 'b-hollow', x: host.x + host.w + ARROW_GAP, w: 210 };

  const inject = { id: 'b-inject', x: 380, w: 280 };
  const resume = { id: 'b-resume', x: inject.x + inject.w + ARROW_GAP, w: 260 };
  const c2 = { id: 'b-c2', x: resume.x + resume.w + ARROW_GAP, w: 240 };

  return {
    scenarioId: 'process-hollowing',
    sectionKey: 'briefing',
    boardBadge: 'TECH BOARD · FULL CHAIN',
    title: 'Process Hollowing · API Flow on the Whiteboard',
    subtitle:
      'Five kernel/user-mode handoffs from suspended spawn to HTTPS C2.',
    chalkHint:
      'Hover any box for a software-style card: what it is, its fields, and a plain explanation.',
    tooltips: {
      'b-loader': {
        kind: 'process',
        title: 'Invoice_Q4.exe',
        module: 'Stage-1 loader · user mode',
        signature: 'Process { pid: 3104, role: "dropper" }',
        fields: [
          { key: 'pid', type: 'DWORD', value: '3104' },
          { key: 'role', type: 'string', value: 'parent / dropper' },
          { key: 'next', type: 'API', value: 'CreateProcessW' },
        ],
        explain:
          'This is the malicious starter program. It does not look like malware yet — it just launches a trusted Windows process and keeps the keys to control it.',
        note: 'Think of it as the thief who rents a delivery truck.',
      },
      'b-host': {
        kind: 'process',
        title: 'svchost.exe',
        module: 'CREATE_SUSPENDED host',
        signature: 'Process { pid: 4892, suspended: true }',
        fields: [
          { key: 'pid', type: 'DWORD', value: '4892' },
          { key: 'flag', type: 'DWORD', value: 'CREATE_SUSPENDED (0x4)' },
          { key: 'state', type: 'enum', value: 'mapped, not running' },
        ],
        explain:
          'A real Windows service host is created, but frozen before it can run any of its own code. The name looks safe; the CPU is asleep.',
        note: 'The “truck” exists, but the engine has not started.',
      },
      'b-hollow': {
        kind: 'memory',
        title: 'ImageBase hollowed',
        module: 'After NtUnmapViewOfSection',
        signature: 'VAD { base: 0x00400000, state: "empty" }',
        fields: [
          { key: 'base', type: 'PVOID', value: '0x00400000' },
          { key: 'state', type: 'enum', value: 'SEC_IMAGE removed' },
        ],
        explain:
          'The signed Microsoft code that lived at this address was torn out. The process name still says svchost, but that memory slot is now empty and ready for something else.',
        note: 'License plate stays. Cargo is gone.',
      },
      'b-inject': {
        kind: 'api',
        title: 'Alloc + write',
        module: 'Kernel32.dll',
        signature: 'VirtualAllocEx → WriteProcessMemory',
        fields: [
          { key: 'protect', type: 'DWORD', value: 'RWX 0x40' },
          { key: 'payload', type: 'PE', value: 'Beacon @ 0x00400000' },
        ],
        explain:
          'The attacker carves writable+executable memory in the frozen process and copies Beacon (the real malware) into the empty slot.',
        note: 'New cargo goes into the same truck.',
      },
      'b-resume': {
        kind: 'api',
        title: 'Context + resume',
        module: 'Kernel32.dll',
        signature: 'SetThreadContext → ResumeThread',
        fields: [
          { key: 'RCX', type: 'ULONG64', value: '0x004014A0' },
          { key: 'effect', type: 'string', value: 'thread runs Beacon' },
        ],
        explain:
          'The sleeping thread is pointed at Beacon’s entry point, then woken up. From now on the trusted-looking process runs attacker code.',
        note: 'Ignition — the truck finally drives, but under new orders.',
      },
      'b-c2': {
        kind: 'network',
        title: 'HTTPS C2',
        module: 'winhttp · Malleable profile',
        signature: 'GET /jquery-3.3.1.min.js  TLS1.3',
        fields: [
          { key: 'dst', type: 'endpoint', value: '185.220.101.42:443' },
          { key: 'uri', type: 'path', value: '/jquery-3.3.1.min.js' },
        ],
        explain:
          'Beacon phones home over HTTPS while pretending to be a normal web request. Defenders must join host clues with network clues to catch it.',
        note: 'Same license plate. Wrong destination.',
      },
      'b-sticky': {
        kind: 'note',
        title: 'Detect pivot',
        module: 'SIEM correlation cheat-sheet',
        fields: [
          { key: 'spawn', type: 'EID', value: '1' },
          { key: 'tamper', type: 'EID', value: '10 / 25' },
          { key: 'network', type: 'EID', value: '3' },
          { key: 'keys', type: 'HANDLE', value: '0x01C4 · 0x01C8' },
        ],
        explain:
          'Follow the story in SIEM: odd process create → memory tamper → weird outbound HTTPS. The two handles are the attacker’s RAM and CPU keys.',
      },
    },
    skeletons: [
      title(40, 12, 'T1055.012  Process Hollowing'),
      box({
        id: loader.id,
        x: loader.x,
        y: y1,
        w: loader.w,
        h: h1,
        label: 'Invoice_Q4.exe\nPID 3104\n(stage-1 loader)',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...hArrow({
        id: 'a1',
        fromId: loader.id,
        toId: host.id,
        fromRight: loader.x + loader.w,
        toLeft: host.x,
        midY: y1 + h1 / 2,
        caption: 'CreateProcessW',
        stroke: CHALK.api,
      }),
      box({
        id: host.id,
        x: host.x,
        y: y1,
        w: host.w,
        h: h1,
        label: 'svchost.exe\nPID 4892\nCREATE_SUSPENDED',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      ...hArrow({
        id: 'a2',
        fromId: host.id,
        toId: hollow.id,
        fromRight: host.x + host.w,
        toLeft: hollow.x,
        midY: y1 + h1 / 2,
        caption: 'NtUnmap',
        stroke: CHALK.api,
      }),
      box({
        id: hollow.id,
        x: hollow.x,
        y: y1,
        w: hollow.w,
        h: h1,
        label: 'ImageBase\n0x00400000\nHOLLOWED',
        stroke: CHALK.warn,
        fill: CHALK.warnFill,
      }),
      ...vArrow({
        id: 'a3',
        fromId: host.id,
        toId: inject.id,
        midX: host.x + host.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'inject',
        stroke: CHALK.attacker,
        captionOffsetX: 18,
      }),
      sticky({
        id: 'b-sticky',
        x: 40,
        y: y2,
        w: 300,
        h: h2,
        label:
          'NOTE\nKeys: hProcess=0x01C4 (RAM)\nhThread=0x01C8 (CPU)\nDetect: EID 1 → 10/25 → 3',
      }),
      box({
        id: inject.id,
        x: inject.x,
        y: y2,
        w: inject.w,
        h: h2,
        label:
          'VirtualAllocEx RWX 0x40\n+ WriteProcessMemory\nBeacon PE @ 0x00400000',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...hArrow({
        id: 'a4',
        fromId: inject.id,
        toId: resume.id,
        fromRight: inject.x + inject.w,
        toLeft: resume.x,
        midY: y2 + h2 / 2,
        caption: 'context',
        stroke: CHALK.api,
      }),
      box({
        id: resume.id,
        x: resume.x,
        y: y2,
        w: resume.w,
        h: h2,
        label: 'SetThreadContext\nRCX = 0x004014A0\nResumeThread',
        stroke: CHALK.api,
        fill: CHALK.apiFill,
      }),
      ...hArrow({
        id: 'a5',
        fromId: resume.id,
        toId: c2.id,
        fromRight: resume.x + resume.w,
        toLeft: c2.x,
        midY: y2 + h2 / 2,
        caption: 'beacon',
        stroke: CHALK.ok,
      }),
      box({
        id: c2.id,
        x: c2.x,
        y: y2,
        w: c2.w,
        h: h2,
        label:
          'HTTPS C2\n185.220.101.42:443\n/jquery-3.3.1.min.js',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      note(
        40,
        460,
        'Hover any box → IDE-style card with “What this means”.',
        CHALK.muted
      ),
    ],
  };
}
