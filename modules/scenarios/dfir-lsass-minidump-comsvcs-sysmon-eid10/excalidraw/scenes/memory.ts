import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function lsassMemoryBoard(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 128;
  const y2 = 308;
  const h2 = 128;

  const caller = { id: 'lsm-caller', x: 40, w: 238 };
  const unprot = { id: 'lsm-unprot', x: caller.x + caller.w + ARROW_GAP, w: 266 };
  const dump = { id: 'lsm-dump', x: unprot.x + unprot.w + ARROW_GAP, w: 242 };

  const ppl = { id: 'lsm-ppl', x: unprot.x, w: 266 };
  const vtl1 = { id: 'lsm-vtl1', x: dump.x, w: 242 };

  return {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'memory-forensics',
    boardBadge: 'MEMORY FORENSICS · PPL=0 VS. RUNASPPL=1 + VTL1',
    title: 'LSASS Memory Boundary Diff: Unprotected (PPL=0) vs. Hardened (RunAsPPL + VTL1)',
    subtitle:
      'Side-by-side kernel enforcement diff comparing OpenProcess(0x1010) against unprotected lsass.exe vs. RunAsPPL + LsaIso.exe.',
    chalkHint:
      'Hover any memory region or kernel boundary to compare virtual addresses, NTSTATUS return codes, and VTL1 isolation.',
    tooltips: {
      'lsm-caller': {
        kind: 'process',
        title: 'User-Mode Caller · rundll32.exe + comsvcs.dll',
        module: 'PID 5412 · Non-PPL High-Integrity Process',
        signature: 'OpenProcess(0x1010, FALSE, 684) with SeDebugPrivilege',
        fields: [
          { key: 'signer', type: 'PPL Level', value: 'None (Standard User-Mode Process)' },
          { key: 'mask', type: 'Requested', value: '0x1010 (VM_READ + QUERY_LIMITED)' },
          { key: 'dll', type: 'Loader', value: 'comsvcs.dll!MiniDump -> dbgcore.dll' },
        ],
        explain:
          'Even with Microsoft code signing and SeDebugPrivilege, rundll32.exe is not launched as a Protected Process Light signer.',
      },
      'lsm-unprot': {
        kind: 'memory',
        title: 'Unprotected lsass.exe (RunAsPPL = 0) — Exposed Heap',
        module: 'PID 684 · Standard SYSTEM Process',
        signature: '0x00007FF7A8100000 lsasrv.dll!LogonSessionList (RW) -> Readable',
        fields: [
          { key: 'heap', type: 'RW', value: '0x00007FF7A8100000 LogonSessionList' },
          { key: 'auth', type: 'RO/RW', value: '0x00007FFAD4200000 msv1_0 & kerberos' },
          { key: 'kernel', type: 'Result', value: 'STATUS_SUCCESS (Handle 0x1010 granted)' },
        ],
        explain:
          'Without RunAsPPL, SeDebugPrivilege bypasses the LSASS DACL, exposing every active credential structure to NtReadVirtualMemory.',
      },
      'lsm-dump': {
        kind: 'memory',
        title: 'Compromised Result · 48.2 MB MDMP Snapshot',
        module: '0x000001C840200000 -> C:\\Windows\\Temp\\debug.dmp',
        signature: '4D 44 4D 50 93 A7 ("MDMP") containing NTLM hashes & Kerberos TGTs',
        fields: [
          { key: 'staging', type: 'RAM', value: '0x000001C840200000 dbgcore.dll buffer' },
          { key: 'impact', type: 'Risk', value: 'Full credential harvest via pypykatz' },
        ],
        explain:
          'The unshielded vault yields a complete snapshot of user-mode credential structures within milliseconds.',
      },
      'lsm-ppl': {
        kind: 'detect',
        title: 'Hardened lsass.exe (RunAsPPL = 1 · PsProtectedSignerLsa-Light)',
        module: 'ntoskrnl.exe!PsTestProtectedProcessIncompatibility',
        signature: 'OpenProcess(0x1010) from non-PPL rundll32 -> STATUS_ACCESS_DENIED (0xC0000022)',
        fields: [
          { key: 'reg', type: 'Policy', value: 'HKLM\\...\\Control\\Lsa\\RunAsPPL = 1' },
          { key: 'kernel', type: 'Result', value: 'STATUS_ACCESS_DENIED (0xC0000022)' },
          { key: 'audit', type: 'Log', value: 'WinInit Event 12 + Sysmon EID 10 denied' },
        ],
        explain:
          'Windows Kernel enforces signer-level protection before honoring SeDebugPrivilege, immediately rejecting rundll32.exe handle requests.',
      },
      'lsm-vtl1': {
        kind: 'memory',
        title: 'Defense-in-Depth · Credential Guard (LsaIso.exe in VTL1)',
        module: 'Hyper-V Virtualization-Based Security (VBS)',
        signature: 'NTLM hashes & Kerberos TGTs sealed inside VTL1 Secure Kernel',
        fields: [
          { key: 'isolation', type: 'Hypervisor', value: 'VTL1 LsaIso.exe (Unreachable from VTL0)' },
          { key: 'benefit', type: 'Impact', value: 'Even kernel-level LSASS dumps find zero secrets' },
        ],
        explain:
          'Credential Guard moves raw secrets out of lsass.exe into an isolated hypervisor trust level (VTL1) communicating only over RPC.',
      },
      'lsm-sticky': {
        kind: 'note',
        title: 'Memory Forensics Takeaway',
        module: 'Layered Credential Protection',
        fields: [
          { key: 'layer1', type: 'PPL', value: 'Blocks user-mode OpenProcess(0x1010)' },
          { key: 'layer2', type: 'VTL1', value: 'Removes raw secrets from VTL0 RAM' },
        ],
        explain:
          'RunAsPPL stops LOLBin dumpers like comsvcs.dll cold; VBS Credential Guard protects credentials even if a BYOVD driver enters VTL0 kernel.',
      },
    },
    skeletons: [
      title(40, 12, 'Memory Boundary Diff · Unprotected (PPL=0) vs. RunAsPPL=1 + Credential Guard'),
      box({
        id: caller.id,
        x: caller.x,
        y: y1,
        w: caller.w,
        h: h1,
        label: 'Non-PPL Caller\nrundll32.exe (PID 5412)\ncomsvcs.dll + SeDebug',
        stroke: VAULT_CHALK.crimson,
        fill: VAULT_CHALK.crimsonFill,
      }),
      ...hArrow({
        id: 'lsm-a1',
        fromId: caller.id,
        toId: unprot.id,
        fromRight: caller.x + caller.w,
        toLeft: unprot.x,
        midY: y1 + h1 / 2,
        caption: '0x1010 Granted',
        stroke: VAULT_CHALK.crimson,
      }),
      box({
        id: unprot.id,
        x: unprot.x,
        y: y1,
        w: unprot.w,
        h: h1,
        label: 'BEFORE · RunAsPPL = 0\n0x7FF7A8100000 lsasrv\nSTATUS_SUCCESS (Exposed)',
        stroke: VAULT_CHALK.amber,
        fill: VAULT_CHALK.amberFill,
      }),
      ...hArrow({
        id: 'lsm-a2',
        fromId: unprot.id,
        toId: dump.id,
        fromRight: unprot.x + unprot.w,
        toLeft: dump.x,
        midY: y1 + h1 / 2,
        caption: 'Dumps 48.2 MB',
        stroke: VAULT_CHALK.violet,
      }),
      box({
        id: dump.id,
        x: dump.x,
        y: y1,
        w: dump.w,
        h: h1,
        label: 'MDMP Exposure\n0x1C840200000 Buffer\nNTLM + TGT Stolen',
        stroke: VAULT_CHALK.violet,
        fill: VAULT_CHALK.violetFill,
      }),
      ...vArrow({
        id: 'lsm-a3',
        fromId: unprot.id,
        toId: ppl.id,
        midX: ppl.x + ppl.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Enable PPL',
        stroke: VAULT_CHALK.emerald,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'lsm-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'KERNEL BOUNDARY PROOF\nSeDebugPrivilege cannot override RunAsPPL.\nNon-PPL OpenProcess(0x1010) gets 0xC0000022.',
      }),
      box({
        id: ppl.id,
        x: ppl.x,
        y: y2,
        w: ppl.w,
        h: h2,
        label: 'AFTER · RunAsPPL = 1\nPsProtectedSignerLsa\n0xC0000022 ACCESS DENIED',
        stroke: VAULT_CHALK.emerald,
        fill: VAULT_CHALK.emeraldFill,
      }),
      ...hArrow({
        id: 'lsm-a4',
        fromId: ppl.id,
        toId: vtl1.id,
        fromRight: ppl.x + ppl.w,
        toLeft: vtl1.x,
        midY: y2 + h2 / 2,
        caption: 'Hyper-V VBS',
        stroke: VAULT_CHALK.steel,
      }),
      box({
        id: vtl1.id,
        x: vtl1.x,
        y: y2,
        w: vtl1.w,
        h: h2,
        label: 'Credential Guard\nLsaIso.exe (VTL1)\nZero Secrets in VTL0',
        stroke: VAULT_CHALK.steel,
        fill: VAULT_CHALK.steelFill,
      }),
      note(
        40,
        464,
        'Hover each memory region to inspect LSASS virtual addresses, 0xC0000022 kernel denial, and VTL1 isolation.',
        VAULT_CHALK.muted
      ),
    ],
  };
}
