import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title } from '../helpers';
import type { TechnicalBoardDescriptor } from '../types';

export function step4Board(): TechnicalBoardDescriptor {
  const y1 = 90;
  const h1 = 150;
  const y2 = 320;
  const h2 = 120;

  const key = { id: 's4-key', x: 40, w: 230 };
  const ctx = { id: 's4-ctx', x: key.x + key.w + ARROW_GAP, w: 310 };
  const run = { id: 's4-run', x: ctx.x + ctx.w + ARROW_GAP, w: 290 };

  return {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-4',
    boardBadge: 'TECH BOARD · STEP #4',
    title: 'SetThreadContext + ResumeThread',
    subtitle: 'Steer RCX to Beacon entry, then wake TID 4896.',
    chalkHint:
      'Hover for register-level structure plus a plain “what just happened” explanation.',
    tooltips: {
      's4-key': {
        kind: 'handle',
        title: 'hThread',
        module: 'Carried from Step #1',
        signature: 'HANDLE hThread = 0x01C8',
        fields: [
          { key: 'value', type: 'HANDLE', value: '0x01C8' },
          { key: 'role', type: 'string', value: 'cab / ignition key' },
          { key: 'apis', type: 'API', value: 'SetThreadContext → ResumeThread' },
        ],
        explain:
          'This is the frozen main thread’s handle. Instead of creating a new remote thread (noisier), the attacker reuses this one: rewrite its start address, then wake it.',
        note: 'Same TID from CreateProcess — quieter technique.',
      },
      's4-ctx': {
        kind: 'api',
        title: 'SetThreadContext',
        module: 'Kernel32.dll / ntdll',
        signature:
          'BOOL SetThreadContext(\n  HANDLE hThread,\n  const CONTEXT *lpContext\n)',
        fields: [
          { key: 'hThread', type: 'HANDLE', value: '0x01C8' },
          { key: 'ContextFlags', type: 'DWORD', value: 'CONTEXT_CONTROL' },
          { key: 'Rcx', type: 'ULONG64', value: '0x004014A0' },
          { key: 'meaning', type: 'string', value: 'Base + EntryPoint RVA' },
        ],
        explain:
          'On x64 Windows, the primary thread’s startup address is passed in RCX. Changing RCX to 0x004014A0 aims the thread at Beacon’s entry instead of the original Microsoft stub.',
        note: 'Like rewriting the GPS destination before the engine starts.',
      },
      's4-run': {
        kind: 'api',
        title: 'ResumeThread',
        module: 'Kernel32.dll',
        signature: 'DWORD ResumeThread(HANDLE hThread)',
        fields: [
          { key: 'hThread', type: 'HANDLE', value: '0x01C8' },
          { key: 'tid', type: 'DWORD', value: '4896' },
          { key: 'PreviousSuspendCount', type: 'DWORD', value: '1 → 0' },
          { key: 'entry', type: 'PVOID', value: 'Beacon @ 0x004014A0' },
        ],
        explain:
          'This drops SuspendCount to zero and the thread finally runs — straight into Beacon. The loader can exit; the hollowed svchost keeps living as the malware host.',
        note: 'From here the story moves to network egress (Step #5).',
      },
      's4-before': {
        kind: 'process',
        title: 'Before resume',
        module: 'RtlUserThreadStart',
        signature: 'ThreadState { path, suspend }',
        fields: [
          { key: 'path', type: 'string', value: 'Microsoft startup stub' },
          { key: 'state', type: 'enum', value: 'waiting — SuspendCount = 1' },
        ],
        explain:
          'Originally the thread would have entered normal Windows startup. After SetThreadContext, that path is abandoned — useful contrast when explaining the hijack.',
      },
      's4-det': {
        kind: 'detect',
        title: 'Sysmon EID 25',
        module: 'ProcessTampering',
        signature: 'Event { id: 25, message }',
        fields: [
          { key: 'event', type: 'EID', value: '25' },
          { key: 'message', type: 'string', value: '"Image is replaced"' },
          { key: 'tell', type: 'string', value: 'live pages ≠ on-disk svchost' },
        ],
        explain:
          'Sysmon notices the running image no longer matches the file on disk. That often fires around resume time when the hollowed process becomes “alive” with foreign code.',
      },
      's4-sticky': {
        kind: 'note',
        title: 'No CreateRemoteThread',
        module: 'Teaching note',
        fields: [
          { key: 'technique', type: 'string', value: 'Reuse primary thread' },
          { key: 'why', type: 'string', value: 'Quieter than CRT / APC sprays' },
        ],
        explain:
          'Many detections watch for CreateRemoteThread into svchost. Classic hollowing skips that API by waking the original suspended thread instead.',
      },
    },
    skeletons: [
      title(40, 12, 'Step #4  ·  Hijack thread context & resume'),
      box({
        id: key.id,
        x: key.x,
        y: y1,
        w: key.w,
        h: h1,
        label: 'hThread 0x01C8\n(cab / ignition key)',
        stroke: CHALK.note,
        fill: CHALK.noteFill,
      }),
      ...hArrow({
        id: 's4-a1',
        fromId: key.id,
        toId: ctx.id,
        fromRight: key.x + key.w,
        toLeft: ctx.x,
        midY: y1 + h1 / 2,
        caption: 'SetThreadContext',
        stroke: CHALK.api,
      }),
      box({
        id: ctx.id,
        x: ctx.x,
        y: y1,
        w: ctx.w,
        h: h1,
        label:
          'KTRAP_FRAME.Rcx\n← 0x004014A0\n(Base + EntryPoint RVA)\nx64 startup address register',
        stroke: CHALK.api,
        fill: CHALK.apiFill,
      }),
      ...hArrow({
        id: 's4-a2',
        fromId: ctx.id,
        toId: run.id,
        fromRight: ctx.x + ctx.w,
        toLeft: run.x,
        midY: y1 + h1 / 2,
        caption: 'ResumeThread',
        stroke: CHALK.attacker,
      }),
      box({
        id: run.id,
        x: run.x,
        y: y1,
        w: run.w,
        h: h1,
        label:
          'TID 4896 RUNS\nPreviousSuspendCount = 1\njumps into Beacon\nloader may exit',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      box({
        id: 's4-before',
        x: 40,
        y: y2,
        w: 340,
        h: h2,
        label:
          'Before: RtlUserThreadStart\nwaiting on old Microsoft path',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      box({
        id: 's4-det',
        x: 420,
        y: y2,
        w: 420,
        h: h2,
        label:
          'Detect: Sysmon EID 25\nProcessTampering\n"Image is replaced"\nlive pages ≠ on-disk svchost',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      sticky({
        id: 's4-sticky',
        x: 880,
        y: y2,
        w: 340,
        h: h2,
        label:
          'NOTE\nNo CreateRemoteThread —\nquieter, reuses the original\nprimary thread from Step #1.',
      }),
      note(
        40,
        470,
        'Hover boxes → CONTEXT / ResumeThread card + plain explanation.',
        CHALK.muted
      ),
    ],
  };
}
