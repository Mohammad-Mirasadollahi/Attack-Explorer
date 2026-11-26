import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function lockbitBriefingBoard(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 306;
  const h2 = 132;

  const jump = { id: 'lb0-jump', x: 40, w: 235 };
  const svc = { id: 'lb0-svc', x: jump.x + jump.w + ARROW_GAP, w: 250 };
  const vss = { id: 'lb0-vss', x: svc.x + svc.w + ARROW_GAP, w: 255 };

  const iocp = { id: 'lb0-iocp', x: svc.x, w: 250 };
  const ext = { id: 'lb0-ext', x: iocp.x + iocp.w + ARROW_GAP, w: 255 };

  return {
    scenarioId: 'ransomware-shadow-wipe',
    sectionKey: 'briefing',
    boardBadge: 'TECH BOARD · FULL CHAIN',
    title: 'LockBit 3.0 Shadow Wipe & Encryption · Full Chain',
    subtitle: 'Four SYSTEM-level stages from lateral PsExec staging to intermittent IOCP encryption and log wiping.',
    chalkHint: 'Hover any box to inspect Windows Event IDs, crypto primitives, and off-host SIEM alerts.',
    tooltips: {
      'lb0-jump': {
        kind: 'network',
        title: 'JUMP-OPS-02 -> FS-CORP-01',
        module: 'SMB TCP/445 · ADMIN$ staging',
        signature: 'PsExec.exe \\\\FS-CORP-01 -s -d C:\\Windows\\lb3_black.exe -pass 8f91c2a0',
        fields: [
          { key: 'srcIp', type: 'IPv4', value: '10.10.15.8 (JUMP-OPS-02)' },
          { key: 'dstIp', type: 'IPv4', value: '10.10.50.14 (FS-CORP-01)' },
          { key: 'witness', type: 'WinSec', value: 'EID 5145 (ADMIN$ share)' },
        ],
        explain:
          'Operators leverage stolen Domain Admin credentials from a compromised jump host to stage the password-protected LockBit 3.0 binary on the file server.',
      },
      'lb0-svc': {
        kind: 'process',
        title: 'services.exe -> PSEXESVC -> lb3_black.exe',
        module: 'NT AUTHORITY\\SYSTEM · PID 684 -> 5892 -> 6412',
        signature: 'CreateServiceW("PSEXESVC") + StartServiceW()',
        fields: [
          { key: 'scmPid', type: 'DWORD', value: '684 (services.exe)' },
          { key: 'lockerPid', type: 'DWORD', value: '6412 (lb3_black.exe)' },
          { key: 'witness', type: 'System', value: 'EID 7045 (Service Installed)' },
        ],
        explain:
          'The Service Control Manager runs the locker as LocalSystem so it can delete volume shadow copies, stop database services, and clear Windows event logs.',
      },
      'lb0-vss': {
        kind: 'api',
        title: 'VSS Wipe & Backup Service Kill',
        module: 'vssadmin.exe + wmic.exe + bcdedit.exe',
        signature: 'vssadmin.exe delete shadows /all /quiet',
        fields: [
          { key: 'pids', type: 'DWORD', value: '6504 (vssadmin) · 6540 (bcdedit)' },
          { key: 'services', type: 'EID 7036', value: 'VSS / sqlservr / VeeamBackupSvc stopped' },
          { key: 'witness', type: 'Sysmon', value: 'EID 1 (Process Create)' },
        ],
        explain:
          'LockBit destroys all local Volume Shadow Copies, disables Windows Recovery via bcdedit, and halts VSS/database services to release exclusive file locks before encryption begins.',
      },
      'lb0-iocp': {
        kind: 'api',
        title: 'IOCP Intermittent Encryption',
        module: 'CreateIoCompletionPort (8 Threads) · ChaCha20 + RSA-2048',
        signature: 'EncryptHead(4 KB-64 KB) -> MoveFileExW(*.lockbit)',
        fields: [
          { key: 'cipher', type: 'Hybrid', value: 'ChaCha20 (First 4 KB-64 KB) + RSA-2048' },
          { key: 'ioModel', type: 'Win32', value: '8-thread Asynchronous IOCP worker pool' },
          { key: 'impact', type: 'Shares', value: '4,820 files locked across Finance/HR/CAD in 11.4s' },
        ],
        explain:
          'Intermittent head-only encryption seals only the opening 4 KB to 64 KB of each file using fast ChaCha20 streams, locking 4,820 files in 11.4 seconds before responders can disconnect FS-CORP-01.',
      },
      'lb0-ext': {
        kind: 'detect',
        title: 'Ransom Note & Security Log Wipe',
        module: 'Restore-My-Files.txt + wevtutil.exe (PID 6618)',
        signature: 'wevtutil.exe cl Security -> WinSec Event ID 1102',
        fields: [
          { key: 'note', type: 'NTFS', value: 'Restore-My-Files.txt (Sysmon EID 11)' },
          { key: 'logWipe', type: 'WinSec', value: 'EID 1102 (Security Audit Log Cleared)' },
          { key: 'defense', type: 'SIEM', value: 'Remote SIEM (10.10.99.10) retains 7045/1/1102' },
        ],
        explain:
          'Dropping Restore-My-Files.txt and clearing the local Security log leaves Event ID 1102 as an un-erasable tamper stamp while off-host SIEM forwarding preserves the entire attack timeline.',
      },
      'lb0-sticky': {
        kind: 'note',
        title: 'Four High-Confidence Kill-Chain Signals',
        module: 'MITRE T1569.002 · T1490 · T1486 · T1070.001',
        fields: [
          { key: 'stage1', type: 'System', value: 'EID 7045 + WinSec 5145' },
          { key: 'stage2', type: 'Sysmon', value: 'EID 1 (vssadmin) + EID 7036' },
          { key: 'stage4', type: 'WinSec', value: 'EID 1102 (Log Cleared)' },
        ],
        explain:
          'Forwarding Windows logs off-host and isolating immutable backups defeat both local shadow deletion and final event-log wiping.',
      },
    },
    skeletons: [
      title(40, 12, 'T1569.002 / T1490 / T1486  LockBit 3.0 Shadow Wipe & Encryption'),
      box({
        id: jump.id,
        x: jump.x,
        y: y1,
        w: jump.w,
        h: h1,
        label: 'JUMP-OPS-02\n10.10.15.8\nPsExec -> ADMIN$',
        stroke: VAULT_CHALK.smb,
        fill: VAULT_CHALK.smbFill,
      }),
      ...hArrow({
        id: 'lb0-a1',
        fromId: jump.id,
        toId: svc.id,
        fromRight: jump.x + jump.w,
        toLeft: svc.x,
        midY: y1 + h1 / 2,
        caption: 'SMB 445 / 5145',
        stroke: VAULT_CHALK.smb,
      }),
      box({
        id: svc.id,
        x: svc.x,
        y: y1,
        w: svc.w,
        h: h1,
        label: 'PSEXESVC -> lb3_black.exe\nPID 5892 -> 6412\nSYSTEM + -pass Key',
        stroke: VAULT_CHALK.attacker,
        fill: VAULT_CHALK.attackerFill,
      }),
      ...hArrow({
        id: 'lb0-a2',
        fromId: svc.id,
        toId: vss.id,
        fromRight: svc.x + svc.w,
        toLeft: vss.x,
        midY: y1 + h1 / 2,
        caption: 'EID 7045 -> 1',
        stroke: VAULT_CHALK.attacker,
      }),
      box({
        id: vss.id,
        x: vss.x,
        y: y1,
        w: vss.w,
        h: h1,
        label: 'vssadmin / bcdedit\nDelete Shadow Copies\nStop VSS + DB Svcs',
        stroke: VAULT_CHALK.warn,
        fill: VAULT_CHALK.warnFill,
      }),
      ...vArrow({
        id: 'lb0-a3',
        fromId: svc.id,
        toId: iocp.id,
        midX: svc.x + svc.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: '8 IOCP Threads',
        stroke: VAULT_CHALK.crypto,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'lb0-sticky',
        x: 40,
        y: y2,
        w: 340,
        h: h2,
        label:
          'SIEM SURVIVAL CHECKLIST\n1) EID 7045 (PSEXESVC)\n2) EID 1 (vssadmin delete shadows)\n3) EID 7036 (VSS stop) + EID 1102',
      }),
      box({
        id: iocp.id,
        x: iocp.x,
        y: y2,
        w: iocp.w,
        h: h2,
        label: 'ChaCha20 + RSA-2048\n4 KB-64 KB Head Stripe\n4,820 *.lockbit Files',
        stroke: VAULT_CHALK.crypto,
        fill: VAULT_CHALK.cryptoFill,
      }),
      ...hArrow({
        id: 'lb0-a4',
        fromId: iocp.id,
        toId: ext.id,
        fromRight: iocp.x + iocp.w,
        toLeft: ext.x,
        midY: y2 + h2 / 2,
        caption: 'wevtutil cl',
        stroke: VAULT_CHALK.siem,
      }),
      box({
        id: ext.id,
        x: ext.x,
        y: y2,
        w: ext.w,
        h: h2,
        label: 'Restore-My-Files.txt\nWinSec EID 1102\nOff-Host SIEM Intact',
        stroke: VAULT_CHALK.siem,
        fill: VAULT_CHALK.siemFill,
      }),
      note(40, 466, 'Hover any card to inspect exact hostnames, PIDs, commands, and Event IDs.', VAULT_CHALK.muted),
    ],
  };
}
