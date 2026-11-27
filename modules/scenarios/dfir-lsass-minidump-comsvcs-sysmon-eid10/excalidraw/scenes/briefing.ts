import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, hArrowLeft, note, sticky, title, vArrow } from '../helpers';

export function lsassBriefingBoard(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;

  const priv = { id: 'lsb-priv', x: 40, w: 238 };
  const rundll = { id: 'lsb-rundll', x: priv.x + priv.w + ARROW_GAP, w: 256 };
  const dump = { id: 'lsb-dump', x: rundll.x + rundll.w + ARROW_GAP, w: 252 };

  const defense = { id: 'lsb-defense', x: rundll.x, w: 256 };
  const sysmon = { id: 'lsb-sysmon', x: dump.x, w: 252 };

  return {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'briefing',
    boardBadge: 'END-TO-END · MITRE T1003.001',
    title: 'LSASS MiniDump Kill Chain (SeDebug -> comsvcs.dll -> MDMP -> Sysmon EID 10)',
    subtitle:
      'Complete four-stage Living-off-the-Land credential dump on WKS-ADM-07.corp.local caught via Sysmon EID 10 CallTrace.',
    chalkHint:
      'Hover any node to inspect Windows Security EID 4672, OpenProcess(0x1010), MDMP headers, and RunAsPPL hardening.',
    tooltips: {
      'lsb-priv': {
        kind: 'process',
        title: 'Stage 1 · SeDebugPrivilege & lsass.exe PID 684 Lookup',
        module: 'cmd.exe (PID 4920) · Security EID 4672 (MITRE T1134)',
        signature: 'tasklist /fi "imagename eq lsass.exe" -> PID 684 (services.exe PID 620)',
        fields: [
          { key: 'account', type: 'User', value: 'CORP\\adm_jchen (High Integrity)' },
          { key: 'privilege', type: 'Token', value: 'SeDebugPrivilege enabled' },
          { key: 'target', type: 'Vault', value: 'lsass.exe PID 684 (RunAsPPL = 0)' },
        ],
        explain:
          'An elevated administrator token carrying SeDebugPrivilege allows opening cross-process handles to unprotected system processes once the operator discovers lsass.exe PID 684.',
      },
      'lsb-rundll': {
        kind: 'process',
        title: 'Stage 2 · Signed LOLBin comsvcs.dll MiniDump Proxy',
        module: 'rundll32.exe (PID 5412) · MITRE T1218.011',
        signature: 'rundll32.exe comsvcs.dll, #24 684 C:\\Windows\\Temp\\debug.dmp full',
        fields: [
          { key: 'binary', type: 'Signed', value: 'C:\\Windows\\System32\\rundll32.exe' },
          { key: 'export', type: 'Ordinal', value: 'comsvcs.dll!MiniDump (ordinal #24)' },
          { key: 'access', type: 'Handle', value: 'OpenProcess(0x1010) VM_READ + QUERY' },
        ],
        explain:
          'Calling Microsoft-signed comsvcs.dll via export MiniDump or ordinal #24 avoids dropping Mimikatz binaries while requesting 0x1010 read access to lsass.exe.',
      },
      'lsb-dump': {
        kind: 'memory',
        title: 'Stage 3 · Full-Memory MDMP Credential Snapshot on Disk',
        module: 'dbgcore.dll!MiniDumpWriteDump · Sysmon EID 11',
        signature: 'C:\\Windows\\Temp\\debug.dmp (48.2 MB · Magic 4D 44 4D 50 93 A7)',
        fields: [
          { key: 'header', type: 'Magic', value: '4D 44 4D 50 93 A7 ("MDMP")' },
          { key: 'region1', type: 'Heap', value: '0x00007FF7A8100000 lsasrv.dll!LogonSessionList' },
          { key: 'region2', type: 'Auth', value: '0x00007FFAD4200000 msv1_0.dll & kerberos.dll' },
        ],
        explain:
          'MiniDumpWriteDump(0x2) snapshots live LSASS credential memory into debug.dmp so the operator can extract NTLM hashes and Kerberos TGTs offline with pypykatz.',
      },
      'lsb-sysmon': {
        kind: 'detect',
        title: 'Stage 4 · Sysmon EID 10 ProcessAccess & CallTrace Witness',
        module: 'Sysmon64.sys Kernel Filter (ObRegisterCallbacks)',
        signature: 'GrantedAccess=0x1010 | CallTrace=ntdll|KERNELBASE|comsvcs.dll|dbgcore.dll',
        fields: [
          { key: 'source', type: 'Caller', value: 'rundll32.exe (PID 5412)' },
          { key: 'target', type: 'Process', value: 'C:\\Windows\\System32\\lsass.exe (PID 684)' },
          { key: 'proof', type: 'Stack', value: 'comsvcs.dll + dbgcore.dll in CallTrace' },
        ],
        explain:
          'Even if the attacker renames debug.dmp or uses ordinal #24, Sysmon Event ID 10 records the immutable kernel handle grant and full user-mode CallTrace.',
      },
      'lsb-defense': {
        kind: 'detect',
        title: 'Preventive Controls · RunAsPPL & VBS Credential Guard',
        module: 'LSA Protection (PsProtectedSignerLsa-Light) + LsaIso.exe',
        signature: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL = 1',
        fields: [
          { key: 'ppl', type: 'Kernel', value: 'Blocks OpenProcess(0x1010) -> 0xC0000022' },
          { key: 'vbs', type: 'VTL1', value: 'LsaIso.exe isolates NTLM/TGT secrets' },
          { key: 'asr', type: 'EDR', value: 'Defender ASR 9e6c4e1f-7d60-472f-ba1a-a39ef669e4b2' },
        ],
        explain:
          'Enabling RunAsPPL denies unsigned or non-PPL callers at the kernel boundary, while Credential Guard removes raw secrets from lsass.exe memory entirely.',
      },
      'lsb-sticky': {
        kind: 'note',
        title: 'Why LOLBin Ordinal #24 Cannot Hide From Kernel Telemetry',
        module: 'Behavioral SIEM Correlation (EID 1 + EID 10 + EID 11)',
        fields: [
          { key: 'evasion', type: 'Trick', value: 'Ordinal #24 hides "MiniDump" string' },
          { key: 'anchor', type: 'Fact', value: 'Sysmon EID 10 + MDMP header catch every variant' },
        ],
        explain:
          'Defenders defeat command-line obfuscation by alerting on GrantedAccess 0x1010 / 0x1410 to lsass.exe with dbgcore.dll or comsvcs.dll in the CallTrace.',
      },
    },
    skeletons: [
      title(40, 12, 'MITRE T1003.001 · LSASS MiniDump via comsvcs.dll & Sysmon EID 10'),
      box({
        id: priv.id,
        x: priv.x,
        y: y1,
        w: priv.w,
        h: h1,
        label: '1. SeDebug & Recon\nSecurity EID 4672\ncmd PID 4920 -> PID 684',
        stroke: VAULT_CHALK.gold,
        fill: VAULT_CHALK.goldFill,
      }),
      ...hArrow({
        id: 'lsb-a1',
        fromId: priv.id,
        toId: rundll.id,
        fromRight: priv.x + priv.w,
        toLeft: rundll.x,
        midY: y1 + h1 / 2,
        caption: 'Spawns LOLBin',
        stroke: VAULT_CHALK.amber,
      }),
      box({
        id: rundll.id,
        x: rundll.x,
        y: y1,
        w: rundll.w,
        h: h1,
        label: '2. comsvcs.dll Proxy\nrundll32.exe (PID 5412)\nOrdinal #24 -> 0x1010',
        stroke: VAULT_CHALK.crimson,
        fill: VAULT_CHALK.crimsonFill,
      }),
      ...hArrow({
        id: 'lsb-a2',
        fromId: rundll.id,
        toId: dump.id,
        fromRight: rundll.x + rundll.w,
        toLeft: dump.x,
        midY: y1 + h1 / 2,
        caption: 'VM_READ 0x1010',
        stroke: VAULT_CHALK.crimson,
      }),
      box({
        id: dump.id,
        x: dump.x,
        y: y1,
        w: dump.w,
        h: h1,
        label: '3. MDMP Snapshot\ndbgcore.dll WriteDump\ndebug.dmp (48.2 MB)',
        stroke: VAULT_CHALK.violet,
        fill: VAULT_CHALK.violetFill,
      }),
      ...vArrow({
        id: 'lsb-a3',
        fromId: dump.id,
        toId: sysmon.id,
        midX: sysmon.x + sysmon.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'EID 10 + 11',
        stroke: VAULT_CHALK.steel,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'lsb-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'DFIR INVARIANT ON WKS-ADM-07\n1) Ordinal #24 bypasses naive CLI rules.\n2) Sysmon EID 10 CallTrace exposes comsvcs+dbgcore.',
      }),
      box({
        id: defense.id,
        x: defense.x,
        y: y2,
        w: defense.w,
        h: h2,
        label: 'Hardening Controls\nRunAsPPL = 1 (Lsa-Light)\nCredential Guard VTL1',
        stroke: VAULT_CHALK.emerald,
        fill: VAULT_CHALK.emeraldFill,
      }),
      ...hArrowLeft({
        id: 'lsb-a4',
        fromId: sysmon.id,
        toId: defense.id,
        fromLeft: sysmon.x,
        toRight: defense.x + defense.w,
        midY: y2 + h2 / 2,
        caption: 'Enforce PPL',
        stroke: VAULT_CHALK.emerald,
      }),
      box({
        id: sysmon.id,
        x: sysmon.x,
        y: y2,
        w: sysmon.w,
        h: h2,
        label: '4. Sysmon EID 10 Alert\nCallTrace: comsvcs.dll\nOffline pypykatz Risk',
        stroke: VAULT_CHALK.steel,
        fill: VAULT_CHALK.steelFill,
      }),
      note(
        40,
        464,
        'Hover each block to inspect Security EID 4672, rundll32 ordinal #24, MDMP magic bytes, and RunAsPPL enforcement.',
        VAULT_CHALK.muted
      ),
    ],
  };
}
