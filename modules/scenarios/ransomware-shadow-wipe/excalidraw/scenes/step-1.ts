import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, hArrowLeft, note, sticky, title, vArrow } from '../helpers';

export function lockbitStep1Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;

  const jump = { id: 'lb1-jump', x: 40, w: 235 };
  const admin = { id: 'lb1-admin', x: jump.x + jump.w + ARROW_GAP, w: 250 };
  const scm = { id: 'lb1-scm', x: admin.x + admin.w + ARROW_GAP, w: 250 };

  const siem = { id: 'lb1-siem', x: admin.x, w: 250 };
  const lb3 = { id: 'lb1-lb3', x: scm.x, w: 250 };

  return {
    scenarioId: 'ransomware-shadow-wipe',
    sectionKey: 'step-1',
    boardBadge: 'STEP #1 · T1569.002',
    title: 'Lateral PsExec Staging & SYSTEM Service Creation',
    subtitle: 'Domain Admin token on JUMP-OPS-02 pushes lb3_black.exe over SMB ADMIN$ and invokes PSEXESVC.',
    chalkHint: 'Hover any box to inspect SMB share telemetry, SCM pipes, and password-gated launch flags.',
    tooltips: {
      'lb1-jump': {
        kind: 'process',
        title: 'JUMP-OPS-02 (10.10.15.8)',
        module: 'Compromised IT Admin Jump Host',
        signature: 'PsExec.exe \\\\FS-CORP-01 -s -d C:\\Windows\\lb3_black.exe -pass 8f91c2a0',
        fields: [
          { key: 'account', type: 'SID', value: 'CORP\\svc_admin (Domain Admin)' },
          { key: 'flag', type: 'CLI', value: '-s (Run as LocalSystem) -d (No Wait)' },
          { key: 'port', type: 'TCP', value: '445 (SMB2/3)' },
        ],
        explain:
          'Attackers reuse legitimate Sysinternals PsExec from an IT jump box so lateral deployment blends in with routine server maintenance.',
      },
      'lb1-admin': {
        kind: 'network',
        title: '\\\\FS-CORP-01\\ADMIN$ Share Drop',
        module: 'Windows Security Event ID 5145',
        signature: 'ShareName=\\\\*\\ADMIN$, RelativeTargetName=lb3_black.exe',
        fields: [
          { key: 'target', type: 'Path', value: 'C:\\Windows\\lb3_black.exe' },
          { key: 'pipe', type: 'RPC', value: 'IPC$\\svcctl (Service Control)' },
          { key: 'eid', type: 'WinSec', value: '5145 (Network Share Object Checked)' },
        ],
        explain:
          'Writing an executable binary to ADMIN$ followed immediately by an IPC$\\svcctl RPC call is a hallmark lateral movement sequence.',
      },
      'lb1-scm': {
        kind: 'process',
        title: 'services.exe -> PSEXESVC.exe',
        module: 'PID 684 -> PID 5892 · NT AUTHORITY\\SYSTEM',
        signature: 'System Event ID 7045: Service Name=PSEXESVC',
        fields: [
          { key: 'parent', type: 'DWORD', value: '684 (services.exe)' },
          { key: 'service', type: 'DWORD', value: '5892 (PSEXESVC.exe)' },
          { key: 'privilege', type: 'Token', value: 'NT AUTHORITY\\SYSTEM' },
        ],
        explain:
          'Remote SCM registration installs PSEXESVC as a temporary LocalSystem service, giving the attacker unrestricted local control over FS-CORP-01.',
      },
      'lb1-lb3': {
        kind: 'process',
        title: 'lb3_black.exe -pass 8f91c2a0',
        module: 'PID 6412 · Anti-Sandbox Key Guard',
        signature: 'C:\\Windows\\lb3_black.exe -pass 8f91c2a0',
        fields: [
          { key: 'pid', type: 'DWORD', value: '6412' },
          { key: 'guard', type: 'Arg', value: '-pass 8f91c2a0 unlocks code section' },
          { key: 'evasion', type: 'Sandbox', value: 'Exits silently without operator key' },
        ],
        explain:
          'LockBit 3.0 refuses to decrypt its internal configuration or execute in automated sandboxes unless the exact runtime password argument is supplied.',
      },
      'lb1-siem': {
        kind: 'detect',
        title: 'SIEM Correlation Rule: EID 5145 + 7045',
        module: 'Detection Window: < 5 Seconds',
        fields: [
          { key: 'winsec', type: 'EID', value: '5145 (ADMIN$ executable write)' },
          { key: 'system', type: 'EID', value: '7045 (PSEXESVC installed)' },
          { key: 'sysmon', type: 'EID', value: '1 (PSEXESVC -> -pass CLI)' },
        ],
        explain:
          'Alerting on Event ID 7045 paired with a preceding ADMIN$ file write gives SOC analysts an immediate containment window before shadow deletion runs.',
      },
      'lb1-sticky': {
        kind: 'note',
        title: 'Why Attackers Use -pass Key Guards',
        module: 'LockBit Black (v3.0) Anti-Analysis',
        fields: [
          { key: 'purpose', type: 'Defense Evasion', value: 'Defeats headless detonation' },
          { key: 'forensics', type: 'Sysmon 1', value: 'CommandLine captures -pass value' },
        ],
        explain:
          'Capturing full process command lines in Sysmon Event ID 1 recovers the exact -pass key needed by incident responders for reverse engineering.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 1 · Lateral PsExec Staging (SMB ADMIN$ + PSEXESVC)'),
      box({
        id: jump.id,
        x: jump.x,
        y: y1,
        w: jump.w,
        h: h1,
        label: 'JUMP-OPS-02\n10.10.15.8\nStolen Domain Admin',
        stroke: VAULT_CHALK.smb,
        fill: VAULT_CHALK.smbFill,
      }),
      ...hArrow({
        id: 'lb1-a1',
        fromId: jump.id,
        toId: admin.id,
        fromRight: jump.x + jump.w,
        toLeft: admin.x,
        midY: y1 + h1 / 2,
        caption: 'SMB TCP/445',
        stroke: VAULT_CHALK.smb,
      }),
      box({
        id: admin.id,
        x: admin.x,
        y: y1,
        w: admin.w,
        h: h1,
        label: '\\\\FS-CORP-01\\ADMIN$\nC:\\Windows\\lb3_black.exe\nWinSec EID 5145',
        stroke: VAULT_CHALK.warn,
        fill: VAULT_CHALK.warnFill,
      }),
      ...hArrow({
        id: 'lb1-a2',
        fromId: admin.id,
        toId: scm.id,
        fromRight: admin.x + admin.w,
        toLeft: scm.x,
        midY: y1 + h1 / 2,
        caption: 'RPC svcctl',
        stroke: VAULT_CHALK.attacker,
      }),
      box({
        id: scm.id,
        x: scm.x,
        y: y1,
        w: scm.w,
        h: h1,
        label: 'services.exe (684)\nPSEXESVC (5892)\nNT AUTHORITY\\SYSTEM',
        stroke: VAULT_CHALK.attacker,
        fill: VAULT_CHALK.attackerFill,
      }),
      ...vArrow({
        id: 'lb1-a3',
        fromId: scm.id,
        toId: lb3.id,
        midX: lb3.x + lb3.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'CreateProcess',
        stroke: VAULT_CHALK.attacker,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'lb1-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'ANTI-SANDBOX KEY GUARD\nlb3_black.exe requires -pass 8f91c2a0\nSysmon EID 1 captures full CLI',
      }),
      box({
        id: siem.id,
        x: siem.x,
        y: y2,
        w: siem.w,
        h: h2,
        label: 'SIEM Alert Fired\nSystem EID 7045\n+ WinSec EID 5145',
        stroke: VAULT_CHALK.siem,
        fill: VAULT_CHALK.siemFill,
      }),
      ...hArrowLeft({
        id: 'lb1-a4',
        fromId: lb3.id,
        toId: siem.id,
        fromLeft: lb3.x,
        toRight: siem.x + siem.w,
        midY: y2 + h2 / 2,
        caption: 'Log Forward',
        stroke: VAULT_CHALK.siem,
      }),
      box({
        id: lb3.id,
        x: lb3.x,
        y: y2,
        w: lb3.w,
        h: h2,
        label: 'lb3_black.exe (6412)\n-pass 8f91c2a0\nRSA-2048 Key Unlocked',
        stroke: VAULT_CHALK.crypto,
        fill: VAULT_CHALK.cryptoFill,
      }),
      note(40, 464, 'Containment target: isolate FS-CORP-01 and revoke CORP\\svc_admin immediately.', VAULT_CHALK.muted),
    ],
  };
}
