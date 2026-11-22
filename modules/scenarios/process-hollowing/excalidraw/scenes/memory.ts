import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title } from '../helpers';
import type { TechnicalBoardDescriptor } from '../types';

export function memoryBoard(): TechnicalBoardDescriptor {
  const disk = { id: 'm-disk', x: 40, y: 160, w: 300, h: 170 };
  const liveHead = {
    id: 'm-live-head',
    x: disk.x + disk.w + ARROW_GAP,
    y: 55,
    w: 340,
    h: 105,
  };
  const liveText = { id: 'm-live-text', x: liveHead.x, y: 185, w: 340, h: 130 };
  const ntdll = { id: 'm-ntdll', x: liveHead.x, y: 340, w: 340, h: 105 };
  const det = {
    id: 'm-det',
    x: liveHead.x + liveHead.w + 50,
    y: 185,
    w: 280,
    h: 130,
  };

  return {
    scenarioId: 'process-hollowing',
    sectionKey: 'memory-forensics',
    boardBadge: 'TECH BOARD · MEMORY',
    title: 'Signed disk image vs live hollowed RAM',
    subtitle:
      'Same PID and path. The pages at 0x00400000 no longer match the file on disk.',
    chalkHint:
      'Hover each memory region for a struct-style card and a plain explanation.',
    tooltips: {
      'm-disk': {
        kind: 'memory',
        title: 'On-disk svchost.exe',
        module: 'SEC_IMAGE · file-backed',
        signature: 'FileMapping { Header, .text, .data }',
        fields: [
          { key: 'type', type: 'enum', value: 'SEC_IMAGE (file-backed)' },
          { key: 'Header', type: 'protect', value: 'R--' },
          { key: '.text', type: 'protect', value: 'R-X 0x20' },
          { key: '.data', type: 'protect', value: 'RW- 0x04' },
        ],
        explain:
          'This is what the real Microsoft binary looks like on disk — file-backed, with code pages executable but not writable. It is the ground truth PE-Sieve compares against.',
        note: 'If live memory disagrees with this, something replaced the image.',
      },
      'm-live-head': {
        kind: 'memory',
        title: 'Live header page',
        module: 'VAD @ 0x00400000',
        signature: 'Page { va, protect, mz }',
        fields: [
          { key: 'va', type: 'PVOID', value: '0x00400000' },
          { key: 'size', type: 'SIZE_T', value: '4 KB' },
          { key: 'protect', type: 'DWORD', value: 'RW-' },
          { key: 'mz', type: 'bytes', value: '4D 5A injected' },
        ],
        explain:
          'In the running process, the header at the old image base is now a writable private page starting with MZ — the start of the injected Beacon PE, not Microsoft’s header layout.',
      },
      'm-live-text': {
        kind: 'memory',
        title: 'Live .text (Beacon)',
        module: 'VAD @ 0x00401000',
        signature: 'Region { va, protect, entry }',
        fields: [
          { key: 'va', type: 'PVOID', value: '0x00401000' },
          { key: 'size', type: 'SIZE_T', value: '≈ 264 KB' },
          { key: 'protect', type: 'DWORD', value: 'RWX 0x40' },
          { key: 'backed', type: 'enum', value: 'unbacked / private' },
          { key: 'entry', type: 'PVOID', value: '0x004014A0' },
        ],
        explain:
          'This is the real payload: a large RWX private region holding Beacon code. Legitimate .text is RX and file-backed — RWX + unbacked at the image base is the smoking gun.',
        note: 'Entry 0x004014A0 is where Step #4 pointed RCX.',
      },
      'm-ntdll': {
        kind: 'memory',
        title: 'ntdll.dll .text',
        module: 'Clean control sample',
        signature: 'Module { base, protect }',
        fields: [
          { key: 'base', type: 'PVOID', value: '0x7FF8B4200000' },
          { key: 'protect', type: 'DWORD', value: 'R-X' },
          { key: 'status', type: 'enum', value: 'unchanged' },
        ],
        explain:
          'ntdll is still normal here. That contrast matters: hollowing replaced the primary EXE pages, not every module. Always compare suspect regions against a clean control.',
      },
      'm-det': {
        kind: 'detect',
        title: 'Sysmon EID 25',
        module: 'ProcessTampering',
        signature: 'Event { message, compare }',
        fields: [
          { key: 'message', type: 'string', value: '"Image is replaced"' },
          { key: 'compare', type: 'string', value: 'disk SEC_IMAGE ≠ live VAD' },
        ],
        explain:
          'This event is Windows saying “the file on disk and the bytes in RAM no longer match.” PE-Sieve / MemProcFS will show the same mismatch visually on this board.',
      },
      'm-sticky': {
        kind: 'note',
        title: 'What changed',
        module: 'Teaching note',
        fields: [
          { key: 'same', type: 'string', value: 'PID 4892 · path svchost.exe' },
          { key: 'swapped', type: 'PVOID', value: '0x00400000 / 0x00401000' },
          { key: 'clean', type: 'module', value: 'ntdll.dll' },
        ],
        explain:
          'Name and PID stayed the same. Only the pages at the old image base were swapped for Beacon. That is why process lists alone are not enough.',
      },
    },
    skeletons: [
      title(40, 12, 'Memory  ·  disk SEC_IMAGE vs live VAD'),
      box({
        id: disk.id,
        x: disk.x,
        y: disk.y,
        w: disk.w,
        h: disk.h,
        label:
          'On-disk svchost.exe\nSEC_IMAGE\nHeader R--\n.text R-X 0x20\n.data RW- 0x04',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      ...hArrow({
        id: 'm-compare',
        fromId: disk.id,
        toId: liveHead.id,
        fromRight: disk.x + disk.w,
        toLeft: liveHead.x,
        midY: disk.y + disk.h / 2,
        caption: 'PE-Sieve',
        stroke: CHALK.api,
      }),
      box({
        id: liveHead.id,
        x: liveHead.x,
        y: liveHead.y,
        w: liveHead.w,
        h: liveHead.h,
        label: '0x00400000  header\nRW-  ·  4 KB\nMZ 4D 5A injected',
        stroke: CHALK.warn,
        fill: CHALK.warnFill,
      }),
      box({
        id: liveText.id,
        x: liveText.x,
        y: liveText.y,
        w: liveText.w,
        h: liveText.h,
        label:
          '0x00401000  .text\nRWX 0x40 · 264 KB\nunbacked Beacon\nentry 0x004014A0',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      box({
        id: ntdll.id,
        x: ntdll.x,
        y: ntdll.y,
        w: ntdll.w,
        h: ntdll.h,
        label: 'ntdll.dll .text\n0x7FF8B4200000\nR-X · still clean',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      box({
        id: det.id,
        x: det.x,
        y: det.y,
        w: det.w,
        h: det.h,
        label: 'Detect\nSysmon EID 25\n"Image is replaced"',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      sticky({
        id: 'm-sticky',
        x: det.x,
        y: ntdll.y,
        w: det.w,
        h: ntdll.h,
        label:
          'NOTE\nPID still says svchost.\nSwapped pages:\n0x00400000 / 0x00401000',
      }),
      note(
        40,
        470,
        'Hover a region → memory struct card + plain explanation.',
        CHALK.muted
      ),
    ],
  };
}
