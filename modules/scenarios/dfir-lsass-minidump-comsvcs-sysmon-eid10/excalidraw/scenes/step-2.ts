import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function lsassStep2Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 302;
  const h2 = 126;

  const rundll = { id: 'ls2-rundll', x: 40, w: 245 };
  const comsvcs = { id: 'ls2-comsvcs', x: rundll.x + rundll.w + ARROW_GAP, w: 256 };
  const lsass = { id: 'ls2-lsass', x: comsvcs.x + comsvcs.w + ARROW_GAP, w: 248 };
  const eid10 = { id: 'ls2-eid10', x: comsvcs.x, w: 256 };

  return {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'step-2',
    boardBadge: 'STEP #2 · COMSVCS.DLL & OPENPROCESS(0x1010)',
    title: 'Signed rundll32.exe Proxy -> comsvcs.dll Ordinal #24 -> OpenProcess(0x1010)',
    subtitle:
      'Microsoft-signed LOLBins open a cross-process read handle to lsass.exe PID 684 while Sysmon EID 10 captures CallTrace.',
    chalkHint:
      'Hover each box to inspect ordinal #24 resolution, GrantedAccess 0x1010 bits, and the kernel ObRegisterCallbacks hook.',
    tooltips: {
      'ls2-rundll': {
        kind: 'process',
        title: 'Signed Windows LOLBin Launcher (rundll32.exe)',
        module: 'C:\\Windows\\System32\\rundll32.exe (PID 5412 · MITRE T1218.011)',
        signature: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll, #24 684 C:\\Windows\\Temp\\debug.dmp full',
        fields: [
          { key: 'parent', type: 'Caller', value: 'cmd.exe (PID 4920)' },
          { key: 'signature', type: 'Trust', value: 'Microsoft Windows Publisher (Valid)' },
          { key: 'evasion', type: 'Trick', value: 'Ordinal #24 omits "MiniDump" keyword' },
        ],
        explain:
          'Application allowlisting and file-hash reputation pass rundll32.exe because it is a legitimate Microsoft-signed OS utility.',
      },
      'ls2-comsvcs': {
        kind: 'process',
        title: 'comsvcs.dll!MiniDump (Export Ordinal #24)',
        module: 'C:\\Windows\\System32\\comsvcs.dll',
        signature: 'RtlAdjustPrivilege(20) -> OpenProcess(0x1010, FALSE, 684)',
        fields: [
          { key: 'export', type: 'Ordinal', value: 'MiniDump / #24 (COM+ Services DLL)' },
          { key: 'mask', type: 'Access', value: '0x1010 = PROCESS_VM_READ | QUERY_LIMITED' },
          { key: 'helper', type: 'Next', value: 'Loads dbgcore.dll!MiniDumpWriteDump' },
        ],
        explain:
          'Originally built for COM+ crash diagnostics, comsvcs.dll!MiniDump parses "<pid> <path> full" directly from rundll32 arguments.',
      },
      'ls2-lsass': {
        kind: 'memory',
        title: 'Target Process Handle Granted on lsass.exe (PID 684)',
        module: 'ntoskrnl.exe!NtOpenProcess -> lsass.exe (PID 684)',
        signature: 'TargetImage=C:\\Windows\\System32\\lsass.exe | GrantedAccess=0x1010',
        fields: [
          { key: 'vmread', type: '0x0010', value: 'PROCESS_VM_READ (Read virtual memory)' },
          { key: 'query', type: '0x1000', value: 'PROCESS_QUERY_LIMITED_INFORMATION' },
          { key: 'result', type: 'Status', value: 'STATUS_SUCCESS (RunAsPPL = 0)' },
        ],
        explain:
          'Because lsass.exe is not protected by RunAsPPL, the kernel grants rundll32.exe a valid handle with read permission across LSASS address space.',
      },
      'ls2-eid10': {
        kind: 'detect',
        title: 'Sysmon Event ID 10 (ProcessAccess) Kernel Capture',
        module: 'Sysmon64.sys ObRegisterCallbacks',
        signature: 'CallTrace: ntdll.dll+9d504|KERNELBASE.dll+2c1ae|comsvcs.dll+211e0|dbgcore.dll+6a40',
        fields: [
          { key: 'event', type: 'Telemetry', value: 'Sysmon Event ID 10 (ProcessAccess)' },
          { key: 'mask', type: 'Filter', value: 'GrantedAccess in (0x1010, 0x1410, 0x1FFFFF)' },
          { key: 'pivot', type: 'Forensic', value: 'comsvcs.dll + dbgcore.dll in stack frames' },
        ],
        explain:
          'Sysmon intercepts the handle request in kernel mode and unwinds the caller stack, permanently proving comsvcs.dll opened lsass.exe.',
      },
      'ls2-sticky': {
        kind: 'note',
        title: 'Why 0x1010 Beats Legacy 0x1FFFFF Signatures',
        module: 'Splunk SURGe & Sigma Detection Engineering',
        fields: [
          { key: 'legacy', type: 'Old Rule', value: '0x1FFFFF (PROCESS_ALL_ACCESS — Mimikatz)' },
          { key: 'modern', type: 'Minimal', value: '0x1010 / 0x1410 — comsvcs.dll & nanodump' },
        ],
        explain:
          'Minimal-access dumpers request only 0x1010 instead of 0x1FFFFF, so SIEM rules must match GrantedAccess bitmask 0x0010 (VM_READ) plus CallTrace.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 2 · rundll32.exe -> comsvcs.dll (#24) -> OpenProcess(0x1010)'),
      box({
        id: rundll.id,
        x: rundll.x,
        y: y1,
        w: rundll.w,
        h: h1,
        label: 'rundll32.exe (PID 5412)\nMicrosoft-Signed LOLBin\nArgs: comsvcs.dll, #24',
        stroke: VAULT_CHALK.amber,
        fill: VAULT_CHALK.amberFill,
      }),
      ...hArrow({
        id: 'ls2-a1',
        fromId: rundll.id,
        toId: comsvcs.id,
        fromRight: rundll.x + rundll.w,
        toLeft: comsvcs.x,
        midY: y1 + h1 / 2,
        caption: 'Export #24',
        stroke: VAULT_CHALK.crimson,
      }),
      box({
        id: comsvcs.id,
        x: comsvcs.x,
        y: y1,
        w: comsvcs.w,
        h: h1,
        label: 'comsvcs.dll!MiniDump\nRtlAdjustPrivilege(20)\nOpenProcess(0x1010)',
        stroke: VAULT_CHALK.crimson,
        fill: VAULT_CHALK.crimsonFill,
      }),
      ...hArrow({
        id: 'ls2-a2',
        fromId: comsvcs.id,
        toId: lsass.id,
        fromRight: comsvcs.x + comsvcs.w,
        toLeft: lsass.x,
        midY: y1 + h1 / 2,
        caption: 'Mask 0x1010',
        stroke: VAULT_CHALK.crimson,
      }),
      box({
        id: lsass.id,
        x: lsass.x,
        y: y1,
        w: lsass.w,
        h: h1,
        label: 'lsass.exe (PID 684)\nPROCESS_VM_READ\nHandle Granted',
        stroke: VAULT_CHALK.steel,
        fill: VAULT_CHALK.steelFill,
      }),
      ...vArrow({
        id: 'ls2-a3',
        fromId: comsvcs.id,
        toId: eid10.id,
        midX: eid10.x + eid10.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Kernel Callback',
        stroke: VAULT_CHALK.emerald,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'ls2-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'ACCESS MASK BIT DECODE (0x1010)\n0x0010 = PROCESS_VM_READ\n0x1000 = PROCESS_QUERY_LIMITED_INFO',
      }),
      box({
        id: eid10.id,
        x: eid10.x,
        y: y2,
        w: eid10.w,
        h: h2,
        label: 'Sysmon Event ID 10\nGrantedAccess = 0x1010\nCallTrace: comsvcs|dbgcore',
        stroke: VAULT_CHALK.emerald,
        fill: VAULT_CHALK.emeraldFill,
      }),
      note(
        40,
        460,
        'Hover each node to inspect the signed LOLBin chain, 0x1010 handle bits, and Sysmon EID 10 CallTrace.',
        VAULT_CHALK.muted
      ),
    ],
  };
}
