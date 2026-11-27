import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function lsassStep1Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 302;
  const h2 = 122;

  const logon = { id: 'ls1-logon', x: 40, w: 238 };
  const cmd = { id: 'ls1-cmd', x: logon.x + logon.w + ARROW_GAP, w: 256 };
  const lsass = { id: 'ls1-lsass', x: cmd.x + cmd.w + ARROW_GAP, w: 252 };
  const audit = { id: 'ls1-audit', x: cmd.x, w: 256 };

  return {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'step-1',
    boardBadge: 'STEP #1 · SEDEBUGPRIVILEGE & PID LOOKUP',
    title: 'Elevated Token (EID 4672) & Target lsass.exe PID 684 Enumeration',
    subtitle:
      'CORP\\adm_jchen uses an elevated High-integrity shell with SeDebugPrivilege to locate unprotected lsass.exe (PID 684).',
    chalkHint: 'Hover any node to inspect Windows Security Event ID 4672, tasklist recon, and LSASS protection flags.',
    tooltips: {
      'ls1-logon': {
        kind: 'process',
        title: 'Elevated Administrator Logon & SeDebugPrivilege',
        module: 'Windows Security Log · Event ID 4672 (MITRE T1134)',
        signature: 'SubjectUserName=adm_jchen | PrivilegeList=SeDebugPrivilege',
        fields: [
          { key: 'host', type: 'Workstation', value: 'WKS-ADM-07.corp.local (10.20.14.37)' },
          { key: 'integrity', type: 'Level', value: 'High Mandatory Level (S-1-16-12288)' },
          { key: 'priv', type: 'Right', value: 'SeDebugPrivilege (Bypass DACL checks)' },
        ],
        explain:
          'Without SeDebugPrivilege, even a local user cannot request PROCESS_VM_READ on a SYSTEM-owned process like lsass.exe.',
      },
      'ls1-cmd': {
        kind: 'process',
        title: 'Process Enumeration via Built-In tasklist.exe',
        module: 'cmd.exe (PID 4920) -> tasklist.exe · Sysmon EID 1',
        signature: 'tasklist /fi "imagename eq lsass.exe"',
        fields: [
          { key: 'parent', type: 'Shell', value: 'C:\\Windows\\System32\\cmd.exe (PID 4920)' },
          { key: 'output', type: 'Stdout', value: 'lsass.exe  684  Services  0  26,412 K' },
          { key: 'purpose', type: 'Recon', value: 'Supplies exact PID 684 argument to comsvcs.dll' },
        ],
        explain:
          'Because comsvcs.dll!MiniDump requires a numeric target PID as its first parameter, attackers enumerate lsass.exe PID 684 right before launching rundll32.exe.',
      },
      'ls1-lsass': {
        kind: 'memory',
        title: 'Local Security Authority Subsystem (Unprotected PPL=0)',
        module: 'C:\\Windows\\System32\\lsass.exe (PID 684)',
        signature: 'Parent: services.exe (PID 620) | Protection: None (RunAsPPL = 0)',
        fields: [
          { key: 'owner', type: 'Account', value: 'NT AUTHORITY\\SYSTEM' },
          { key: 'stores', type: 'Secrets', value: 'NTLM hashes, Kerberos TGTs, DPAPI keys' },
          { key: 'gap', type: 'Config', value: 'RunAsPPL disabled -> OpenProcess(0x1010) allowed' },
        ],
        explain:
          'lsass.exe stores active Windows logon credentials in user-mode memory. When RunAsPPL is 0, SeDebugPrivilege can open it with read access.',
      },
      'ls1-audit': {
        kind: 'detect',
        title: 'Early SIEM Lead · EID 4672 Followed by lsass Recon',
        module: 'Security EID 4672 + Sysmon EID 1 Correlation',
        signature: '4672 (SeDebugPrivilege) + 10s window -> tasklist / Get-Process lsass',
        fields: [
          { key: 'window', type: 'Timing', value: 'Within 1–15 seconds before dump attempt' },
          { key: 'signal', type: 'Behavior', value: 'Interactive admin enumerating lsass PID' },
        ],
        explain:
          'Correlating special-privilege logons with immediate lsass.exe process queries surfaces credential-access staging before the dump file is written.',
      },
      'ls1-sticky': {
        kind: 'note',
        title: 'Why SeDebugPrivilege Enables the Next Step',
        module: 'Windows Kernel SeSinglePrivilegeCheck',
        fields: [
          { key: 'rule', type: 'Kernel', value: 'SeDebugPrivilege overrides standard DACLs' },
          { key: 'limit', type: 'PPL', value: 'Does NOT bypass RunAsPPL (Protected Process Light)' },
        ],
        explain:
          'Inside comsvcs.dll!MiniDump, Microsoft code calls RtlAdjustPrivilege(20) to enable SeDebugPrivilege on the caller token automatically if held.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 1 · SeDebugPrivilege Assignment & lsass.exe PID 684 Lookup'),
      box({
        id: logon.id,
        x: logon.x,
        y: y1,
        w: logon.w,
        h: h1,
        label: 'Security EID 4672\nCORP\\adm_jchen\nSeDebugPrivilege Held',
        stroke: VAULT_CHALK.gold,
        fill: VAULT_CHALK.goldFill,
      }),
      ...hArrow({
        id: 'ls1-a1',
        fromId: logon.id,
        toId: cmd.id,
        fromRight: logon.x + logon.w,
        toLeft: cmd.x,
        midY: y1 + h1 / 2,
        caption: 'High Token',
        stroke: VAULT_CHALK.gold,
      }),
      box({
        id: cmd.id,
        x: cmd.x,
        y: y1,
        w: cmd.w,
        h: h1,
        label: 'Elevated cmd.exe\nPID 4920\ntasklist -> lsass.exe',
        stroke: VAULT_CHALK.amber,
        fill: VAULT_CHALK.amberFill,
      }),
      ...hArrow({
        id: 'ls1-a2',
        fromId: cmd.id,
        toId: lsass.id,
        fromRight: cmd.x + cmd.w,
        toLeft: lsass.x,
        midY: y1 + h1 / 2,
        caption: 'Finds PID 684',
        stroke: VAULT_CHALK.crimson,
      }),
      box({
        id: lsass.id,
        x: lsass.x,
        y: y1,
        w: lsass.w,
        h: h1,
        label: 'lsass.exe (PID 684)\nParent: services (620)\nRunAsPPL = 0 (Open)',
        stroke: VAULT_CHALK.steel,
        fill: VAULT_CHALK.steelFill,
      }),
      ...vArrow({
        id: 'ls1-a3',
        fromId: cmd.id,
        toId: audit.id,
        midX: audit.x + audit.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Sysmon EID 1',
        stroke: VAULT_CHALK.emerald,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'ls1-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'PRIVILEGE PREREQUISITE\ncomsvcs.dll calls RtlAdjustPrivilege(20)\nto activate SeDebugPrivilege before OpenProcess.',
      }),
      box({
        id: audit.id,
        x: audit.x,
        y: y2,
        w: audit.w,
        h: h2,
        label: 'SIEM Early Warning\nEID 4672 + tasklist\nTarget: lsass.exe',
        stroke: VAULT_CHALK.emerald,
        fill: VAULT_CHALK.emeraldFill,
      }),
      note(
        40,
        456,
        'Hover each node to inspect the High-integrity logon token, PID 684 enumeration, and RunAsPPL configuration gap.',
        VAULT_CHALK.muted
      ),
    ],
  };
}
