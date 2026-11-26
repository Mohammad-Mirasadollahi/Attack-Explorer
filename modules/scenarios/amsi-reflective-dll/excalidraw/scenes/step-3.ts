import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function step3Board(): TechnicalBoardDescriptor {
  const y1 = 96;
  const h1 = 124;
  const y2 = 308;
  const h2 = 128;

  const orig = { id: 's3-orig', x: 40, w: 250 };
  const copy = { id: 's3-copy', x: orig.x + orig.w + ARROW_GAP, w: 255 };
  const patched = { id: 's3-patched', x: copy.x + copy.w + ARROW_GAP, w: 265 };
  const skip = { id: 's3-skip', x: copy.x, w: 270 };
  const relock = { id: 's3-relock', x: patched.x, w: 265 };

  return {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'step-3',
    boardBadge: 'TECH BOARD · STEP #3',
    title: 'Step #3 · 6-Byte Prologue Patch (E_INVALIDARG) & Re-Lock',
    subtitle: 'Replacing AmsiScanBuffer opening instructions so MpOav.dll never runs.',
    chalkHint: 'Hover any box to inspect raw x64 opcodes, HRESULT return, and dirty-page diff.',
    tooltips: {
      's3-orig': {
        kind: 'memory',
        title: 'Original 6-Byte Prologue',
        module: 'Clean signed amsi.dll!AmsiScanBuffer',
        signature: '4C 8B DC 49 89 5B  ; mov r11, rsp ; mov [r11+8], rbx',
        fields: [
          { key: 'bytes', type: 'hex[6]', value: '4C 8B DC 49 89 5B' },
          { key: 'nextHop', type: 'COM', value: 'Invokes Defender MpOav.dll' },
        ],
        explain:
          'These six bytes normally set up the function stack frame before forwarding script buffers to Windows Defender for scanning.',
      },
      's3-copy': {
        kind: 'api',
        title: 'Marshal.Copy(patch, 0, addr, 6)',
        module: 'System.Runtime.InteropServices',
        signature: 'Marshal.Copy(new byte[]{0xB8,0x57,0x00,0x07,0x80,0xC3}, 0, ptr, 6)',
        fields: [
          { key: 'length', type: 'int', value: '6 bytes' },
          { key: 'target', type: 'IntPtr', value: '0x7FF9C2142840 (unlocked 0x40)' },
        ],
        explain:
          'Marshal.Copy writes the six replacement bytes straight into the unlocked private Copy-on-Write page of AmsiScanBuffer.',
      },
      's3-patched': {
        kind: 'memory',
        title: 'Patched Prologue (E_INVALIDARG)',
        module: 'Short-Circuited AmsiScanBuffer',
        signature: 'B8 57 00 07 80 C3  ; mov eax, 0x80070057 ; ret',
        fields: [
          { key: 'opcode1', type: 'x64', value: 'B8 57 00 07 80 -> mov eax, 0x80070057' },
          { key: 'opcode2', type: 'x64', value: 'C3 -> ret (exit immediately)' },
        ],
        explain:
          'On the very first CPU instruction, EAX receives E_INVALIDARG and ret returns straight to PowerShell without calling Defender.',
      },
      's3-skip': {
        kind: 'detect',
        title: 'MpOav.dll Never Called',
        module: 'Windows Defender Antimalware Provider',
        signature: 'HRESULT = 0x80070057 -> PowerShell treats scan as skipped',
        fields: [
          { key: 'defender', type: 'status', value: '0 Buffers Reached Watchtower' },
          { key: 'result', type: 'string', value: 'Subsequent scripts bypass AMSI' },
        ],
        explain:
          'PowerShell handles E_INVALIDARG non-fatally and executes the stage-2 download script without ever sending it to Defender.',
      },
      's3-relock': {
        kind: 'api',
        title: 'VirtualProtect Restore (0x20 RX)',
        module: 'kernel32.dll · Stealth Cleanup',
        signature: 'VirtualProtect(0x7FF9C2142840, 6, 0x20, &ignored)',
        fields: [
          { key: 'protect', type: 'DWORD', value: '0x20 (PAGE_EXECUTE_READ)' },
          { key: 'forensic', type: 'string', value: 'Still CoW Dirty vs Disk!' },
        ],
        explain:
          'Restoring RX hides writable DLL pages from naive scanners, yet disk-vs-RAM byte comparison still exposes the 6-byte tamper.',
      },
      's3-sticky': {
        kind: 'note',
        title: 'Byte-Level Integrity Diff',
        module: 'Defender / EDR Memory Scan',
        fields: [
          { key: 'disk', type: 'hex', value: '4C 8B DC 49 89 5B' },
          { key: 'liveRam', type: 'hex', value: 'B8 57 00 07 80 C3' },
        ],
        explain:
          'Comparing live private pages of signed System32 DLLs against their clean on-disk file deterministically catches AMSI patching.',
      },
    },
    skeletons: [
      title(40, 14, 'Step #3 · 6-Byte Prologue Short-Circuit & RX Re-Lock'),
      box({
        id: orig.id,
        x: orig.x,
        y: y1,
        w: orig.w,
        h: h1,
        label: 'Original Prologue\n4C 8B DC 49 89 5B\nCalls MpOav.dll',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      ...hArrow({
        id: 's3-a1',
        fromId: orig.id,
        toId: copy.id,
        fromRight: orig.x + orig.w,
        toLeft: copy.x,
        midY: y1 + h1 / 2,
        caption: 'Overwrite 6B',
        stroke: CHALK.attacker,
      }),
      box({
        id: copy.id,
        x: copy.x,
        y: y1,
        w: copy.w,
        h: h1,
        label: 'Marshal.Copy(\n  patch[6], 0,\n  0x7FF9C2142840, 6)',
        stroke: CHALK.api,
        fill: CHALK.apiFill,
      }),
      ...hArrow({
        id: 's3-a2',
        fromId: copy.id,
        toId: patched.id,
        fromRight: copy.x + copy.w,
        toLeft: patched.x,
        midY: y1 + h1 / 2,
        caption: 'Jumper Seated',
        stroke: CHALK.warn,
      }),
      box({
        id: patched.id,
        x: patched.x,
        y: y1,
        w: patched.w,
        h: h1,
        label: 'B8 57 00 07 80 C3\nmov eax, 0x80070057\nret (E_INVALIDARG)',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...vArrow({
        id: 's3-a3',
        fromId: copy.id,
        toId: skip.id,
        midX: copy.x + copy.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Short-Circuit',
        stroke: CHALK.warn,
      }),
      ...vArrow({
        id: 's3-a4',
        fromId: patched.id,
        toId: relock.id,
        midX: patched.x + patched.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Re-Lock 0x20',
        stroke: CHALK.ok,
      }),
      sticky({
        id: 's3-sticky',
        x: 40,
        y: y2,
        w: 340,
        h: h2,
        label:
          'NOTE · 6-BYTE SWAP\nDisk: 4C 8B DC 49 89 5B\nLive: B8 57 00 07 80 C3\nWatchtower wire is now dead!',
      }),
      box({
        id: skip.id,
        x: skip.x,
        y: y2,
        w: skip.w,
        h: h2,
        label: 'Defender MpOav.dll\nNEVER INVOKED\nScans Return Instantly',
        stroke: CHALK.warn,
        fill: CHALK.warnFill,
      }),
      box({
        id: relock.id,
        x: relock.x,
        y: y2,
        w: relock.w,
        h: h2,
        label: 'VirtualProtect(0x20 RX)\nHatch Closed · Still\nCoW Dirty vs Disk',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      note(40, 466, 'Hover any card to inspect x64 instruction bytes and EDR diff cues.', CHALK.muted),
    ],
  };
}
