import { CHALK } from '../chalk';
import { ARROW_GAP, arrow, box, caption, hArrow, note, sticky, title } from '../helpers';
import type { TechnicalBoardDescriptor } from '../types';

export function step1Board(): TechnicalBoardDescriptor {
  const y1 = 85;
  const h1 = 140;
  const y2 = 330;
  const h2 = 120;

  const parent = { id: 's1-parent', x: 40, w: 250 };
  const child = { id: 's1-child', x: parent.x + parent.w + ARROW_GAP + 20, w: 320 };

  const hproc = { id: 's1-hproc', x: 40, w: 300 };
  const hthr = { id: 's1-hthr', x: hproc.x + hproc.w + 40, w: 300 };
  const det = { id: 's1-det', x: hthr.x + hthr.w + 40, w: 280 };

  return {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-1',
    boardBadge: 'TECH BOARD · STEP #1',
    title: 'CreateProcessW + CREATE_SUSPENDED',
    subtitle: 'How the loader freezes a trusted host before its first instruction.',
    chalkHint:
      'Hover boxes for IDE-style cards: structure on top, plain explanation below.',
    tooltips: {
      's1-parent': {
        kind: 'process',
        title: 'Invoice_Q4.exe',
        module: 'User-mode · stage-1 loader',
        signature: 'Process { pid, path, role }',
        fields: [
          { key: 'pid', type: 'DWORD', value: '3104' },
          { key: 'path', type: 'string', value: 'C:\\Users\\…\\Invoice_Q4.exe' },
          { key: 'role', type: 'enum', value: 'parent / dropper' },
        ],
        explain:
          'This is the attacker’s first program on the machine. Its job is simple: start a trusted Windows process in a frozen state and keep the two handles that unlock that child’s memory and CPU.',
        note: 'Nothing hollowed yet — just acquiring the truck and the keys.',
      },
      's1-child': {
        kind: 'process',
        title: 'svchost.exe (suspended)',
        module: 'ntdll · EPROCESS',
        signature: 'CREATE_SUSPENDED → SuspendCount = 1',
        fields: [
          { key: 'pid', type: 'DWORD', value: '4892' },
          { key: 'tid', type: 'DWORD', value: '4896 @ RtlUserThreadStart' },
          { key: 'image', type: 'SEC_IMAGE', value: 'mapped (for now)' },
          { key: 'cpu', type: 'enum', value: 'parked — no host code yet' },
        ],
        explain:
          'Windows created a real svchost process and mapped its signed code, but CREATE_SUSPENDED means the main thread never started. The attacker has a quiet window to rewrite memory before any Microsoft code runs.',
        note: 'Looks legitimate in Task Manager. CPU is still asleep.',
      },
      's1-hproc': {
        kind: 'handle',
        title: 'hProcess',
        module: 'PROCESS_INFORMATION.hProcess',
        signature: 'HANDLE hProcess = 0x01C4',
        fields: [
          { key: 'value', type: 'HANDLE', value: '0x01C4' },
          { key: 'access', type: 'ACCESS_MASK', value: 'PROCESS_ALL_ACCESS' },
          { key: 'unlocks', type: 'string', value: 'RAM in Steps #2–#3' },
        ],
        explain:
          'A handle is like a key Windows gives you to touch another process. hProcess opens the child’s address space — later used to unmap the image and write Beacon into RAM.',
        note: 'Remember 0x01C4 = “memory key”.',
      },
      's1-hthr': {
        kind: 'handle',
        title: 'hThread',
        module: 'PROCESS_INFORMATION.hThread',
        signature: 'HANDLE hThread = 0x01C8',
        fields: [
          { key: 'value', type: 'HANDLE', value: '0x01C8' },
          { key: 'unlocks', type: 'string', value: 'CPU in Step #4' },
          { key: 'apis', type: 'API', value: 'SetThreadContext + ResumeThread' },
        ],
        explain:
          'hThread is the key to the frozen main thread. In Step #4 the attacker will change where that thread jumps, then wake it — without creating a new remote thread.',
        note: 'Remember 0x01C8 = “CPU / ignition key”.',
      },
      's1-det': {
        kind: 'detect',
        title: 'Sysmon EID 1',
        module: 'Detection pivot · ProcessCreate',
        signature: 'Event { id: 1, parent, cmdline }',
        fields: [
          { key: 'event', type: 'EID', value: 'ProcessCreate' },
          { key: 'parent', type: 'string', value: '≠ services.exe' },
          { key: 'cmdline', type: 'string', value: 'missing -k <ServiceGroup>' },
        ],
        explain:
          'Real svchost usually comes from services.exe with a -k service group. A bare svchost spawned by a user document is already a strong yellow flag — even before hollowing.',
        note: 'Cheap host-side filter before memory forensics.',
      },
      's1-sticky': {
        kind: 'note',
        title: 'Why suspend?',
        module: 'Teaching note',
        fields: [
          { key: 'goal', type: 'string', value: 'Quiet window before first instruction' },
          { key: 'next', type: 'string', value: 'Unmap + rewrite while CPU sleeps' },
        ],
        explain:
          'Suspending the host is the whole point of Step #1. While the thread sleeps, the attacker can hollow and inject without racing against running Microsoft code.',
      },
    },
    skeletons: [
      title(40, 12, 'Step #1  ·  Suspended host spawn'),
      box({
        id: parent.id,
        x: parent.x,
        y: y1,
        w: parent.w,
        h: h1,
        label: 'Invoice_Q4.exe\nPID 3104\n(parent / dropper)',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...hArrow({
        id: 's1-a1',
        fromId: parent.id,
        toId: child.id,
        fromRight: parent.x + parent.w,
        toLeft: child.x,
        midY: y1 + h1 / 2,
        caption: 'CreateProcessW\nCREATE_SUSPENDED=0x4',
        stroke: CHALK.api,
      }),
      box({
        id: child.id,
        x: child.x,
        y: y1,
        w: child.w,
        h: h1,
        label:
          'svchost.exe  PID 4892\nEPROCESS + ntdll mapped\nTID 4896 @ RtlUserThreadStart\nSuspendCount = 1',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      sticky({
        id: 's1-sticky',
        x: child.x + child.w + 40,
        y: y1,
        w: 200,
        h: h1,
        label:
          'NOTE\nWhy suspend?\nQuiet window to\nunmap + rewrite\nbefore host code\nruns.',
      }),
      caption('s1-cap-pi', child.x + 40, y1 + h1 + 18, 'PROCESS_INFORMATION', CHALK.ink),
      arrow({
        id: 's1-a2',
        x: child.x + 40,
        y: y1 + h1,
        w: hproc.x + hproc.w / 2 - (child.x + 40),
        h: y2 - (y1 + h1),
        stroke: CHALK.ink,
        startId: child.id,
        endId: hproc.id,
      }),
      arrow({
        id: 's1-a3',
        x: child.x + child.w / 2,
        y: y1 + h1,
        w: hthr.x + hthr.w / 2 - (child.x + child.w / 2),
        h: y2 - (y1 + h1),
        stroke: CHALK.ink,
        startId: child.id,
        endId: hthr.id,
      }),
      box({
        id: hproc.id,
        x: hproc.x,
        y: y2,
        w: hproc.w,
        h: h2,
        label:
          'hProcess = 0x01C4\nPROCESS_ALL_ACCESS\n→ unlocks RAM in Steps #2–#3',
        stroke: CHALK.note,
        fill: CHALK.noteFill,
      }),
      box({
        id: hthr.id,
        x: hthr.x,
        y: y2,
        w: hthr.w,
        h: h2,
        label:
          'hThread = 0x01C8\nthread context + resume\n→ unlocks CPU in Step #4',
        stroke: CHALK.note,
        fill: CHALK.noteFill,
      }),
      box({
        id: det.id,
        x: det.x,
        y: y2,
        w: det.w,
        h: h2,
        label:
          'Detect: Sysmon EID 1\nParent ≠ services.exe\nNo -k service group flag',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      note(
        40,
        480,
        'Hover a box → software card + plain “What this means”.',
        CHALK.muted
      ),
    ],
  };
}
