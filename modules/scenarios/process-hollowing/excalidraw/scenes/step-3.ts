import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title } from '../helpers';
import type { TechnicalBoardDescriptor } from '../types';

export function step3Board(): TechnicalBoardDescriptor {
  const y1 = 95;
  const h1 = 160;
  const y2 = 320;
  const h2 = 130;

  const alloc = { id: 's3-alloc', x: 40, w: 290 };
  const mem = { id: 's3-mem', x: alloc.x + alloc.w + ARROW_GAP, w: 300 };
  const pe = { id: 's3-pe', x: mem.x + mem.w + ARROW_GAP, w: 290 };

  return {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-3',
    boardBadge: 'TECH BOARD · STEP #3',
    title: 'VirtualAllocEx RWX + WriteProcessMemory',
    subtitle: 'Carve executable private memory and drop the Beacon PE in place.',
    chalkHint:
      'Hover each stage for a software card — signature, members, and what it means.',
    tooltips: {
      's3-alloc': {
        kind: 'api',
        title: 'VirtualAllocEx',
        module: 'Kernel32.dll',
        signature:
          'LPVOID VirtualAllocEx(\n  HANDLE hProcess,\n  LPVOID lpAddress,\n  SIZE_T dwSize,\n  DWORD flAllocationType,\n  DWORD flProtect\n)',
        fields: [
          { key: 'hProcess', type: 'HANDLE', value: '0x01C4' },
          { key: 'lpAddress', type: 'LPVOID', value: '0x00400000 preferred' },
          { key: 'dwSize', type: 'SIZE_T', value: '≈ 264 KB' },
          { key: 'flProtect', type: 'DWORD', value: 'PAGE_EXECUTE_READWRITE (0x40)' },
          { key: 'returns', type: 'LPVOID', value: 'base → 0x00400000' },
        ],
        explain:
          'Asks Windows to reserve a chunk of memory inside the frozen svchost. PAGE_EXECUTE_READWRITE means the chunk can be written and later run as code — unusual for a normal image mapping.',
        note: 'RWX = red flag for defenders; convenient for attackers.',
      },
      's3-mem': {
        kind: 'memory',
        title: 'MEM_PRIVATE vault',
        module: 'VAD · unbacked region',
        signature: 'Region { base, protect, type }',
        fields: [
          { key: 'base', type: 'PVOID', value: '0x00400000' },
          { key: 'type', type: 'enum', value: 'MEM_PRIVATE (not SEC_IMAGE)' },
          { key: 'protect', type: 'DWORD', value: 'RWX (0x40)' },
          { key: 'backed_by', type: 'string', value: 'none — forensic tell' },
        ],
        explain:
          'Unlike a normal EXE (file-backed SEC_IMAGE), this region is private RAM with no file behind it. Same address as the old image, but a completely different kind of memory.',
        note: 'Memory scanners look for “unbacked RWX at image base”.',
      },
      's3-pe': {
        kind: 'memory',
        title: 'Beacon PE',
        module: 'WriteProcessMemory payload',
        signature:
          'BOOL WriteProcessMemory(\n  HANDLE hProcess,\n  LPVOID lpBaseAddress,\n  LPCVOID lpBuffer,\n  SIZE_T nSize,\n  …\n)',
        fields: [
          { key: 'mz', type: 'bytes', value: '4D 5A' },
          { key: 'sections', type: 'string', value: '.text / .rdata / .data' },
          { key: 'ep_rva', type: 'DWORD', value: '0x14A0' },
          { key: 'entry_va', type: 'PVOID', value: '0x004014A0' },
          { key: 'bytesWritten', type: 'SIZE_T', value: '270336' },
        ],
        explain:
          'The attacker copies a full Beacon PE into the vault. Starting with MZ (4D 5A) is the PE magic — tools like PE-Sieve will later see an injected EXE living where svchost used to be.',
        note: 'Same base address avoids messy relocation of pointers.',
      },
      's3-legit': {
        kind: 'memory',
        title: 'Legitimate page model',
        module: 'SEC_IMAGE baseline',
        signature: 'ImagePages { .text: RX, .data: RW }',
        fields: [
          { key: '.text', type: 'protect', value: 'RX (0x20)' },
          { key: '.data', type: 'protect', value: 'RW (0x04)' },
          { key: 'never', type: 'rule', value: 'RWX on SEC_IMAGE' },
        ],
        explain:
          'Healthy Windows images split code (read+execute) from data (read+write). They almost never map the main image as RWX. Use this as your mental “normal” when reading memory dumps.',
      },
      's3-det': {
        kind: 'detect',
        title: 'Remote alloc + write',
        module: 'Sysmon + ETW-TI',
        fields: [
          { key: 'sysmon', type: 'EID', value: '10 access 0x1FFFFF' },
          { key: 'etw', type: 'string', value: 'EtwTiLogAllocVMRemote' },
          { key: 'tell', type: 'string', value: 'unbacked MZ in RWX @ image base' },
        ],
        explain:
          'Watch for another process allocating executable memory in svchost, then writing an MZ header. That combo at the primary image base is high-signal process hollowing.',
      },
      's3-sticky': {
        kind: 'note',
        title: 'Base reuse',
        module: 'Teaching note',
        fields: [
          { key: 'base', type: 'PVOID', value: '0x00400000' },
          { key: 'why', type: 'string', value: 'Avoid relocating Beacon pointers' },
        ],
        explain:
          'Putting Beacon at the same VA the original EXE used means many internal pointers still “just work.” That is why attackers prefer the vacated image base.',
      },
    },
    skeletons: [
      title(40, 12, 'Step #3  ·  Allocate RWX & inject PE'),
      box({
        id: alloc.id,
        x: alloc.x,
        y: y1,
        w: alloc.w,
        h: h1,
        label:
          'VirtualAllocEx\nhProcess = 0x01C4\nsize ≈ 264 KB\nPAGE_EXECUTE_READWRITE\n= 0x40',
        stroke: CHALK.api,
        fill: CHALK.apiFill,
      }),
      ...hArrow({
        id: 's3-a1',
        fromId: alloc.id,
        toId: mem.id,
        fromRight: alloc.x + alloc.w,
        toLeft: mem.x,
        midY: y1 + h1 / 2,
        caption: 'commit',
        stroke: CHALK.ink,
      }),
      box({
        id: mem.id,
        x: mem.x,
        y: y1,
        w: mem.w,
        h: h1,
        label:
          'MEM_PRIVATE\n@ 0x00400000\n(unbacked · not SEC_IMAGE)\nRWX vault ready',
        stroke: CHALK.warn,
        fill: CHALK.warnFill,
      }),
      ...hArrow({
        id: 's3-a2',
        fromId: mem.id,
        toId: pe.id,
        fromRight: mem.x + mem.w,
        toLeft: pe.x,
        midY: y1 + h1 / 2,
        caption: 'WriteProcessMemory',
        stroke: CHALK.attacker,
      }),
      box({
        id: pe.id,
        x: pe.x,
        y: y1,
        w: pe.w,
        h: h1,
        label:
          'Beacon PE\nMZ 4D 5A\n.text / .rdata / .data\nEP RVA 0x14A0\nbytesWritten = 270336',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      box({
        id: 's3-legit',
        x: 40,
        y: y2,
        w: 360,
        h: h2,
        label:
          'Legitimate image pages\n.code RX (0x20)  ≠  data RW (0x04)\nnever RWX on SEC_IMAGE',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      box({
        id: 's3-det',
        x: 440,
        y: y2,
        w: 420,
        h: h2,
        label:
          'Detect: Sysmon EID 10 (0x1FFFFF)\n+ EtwTiLogAllocVMRemote\nunbacked MZ in RWX @ 0x00400000',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      sticky({
        id: 's3-sticky',
        x: 900,
        y: y2,
        w: 340,
        h: h2,
        label:
          'NOTE\nReuse of 0x00400000 avoids\nrelocating internal Beacon\npointers. Hover boxes for\nfull API structure.',
      }),
      note(
        40,
        480,
        'Hover boxes → IDE card with “What this means”.',
        CHALK.muted
      ),
    ],
  };
}
