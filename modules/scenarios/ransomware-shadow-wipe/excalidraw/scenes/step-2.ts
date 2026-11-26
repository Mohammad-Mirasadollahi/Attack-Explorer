import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function lockbitStep2Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;

  const locker = { id: 'lb2-locker', x: 40, w: 235 };
  const vss = { id: 'lb2-vss', x: locker.x + locker.w + ARROW_GAP, w: 255 };
  const bcd = { id: 'lb2-bcd', x: vss.x + vss.w + ARROW_GAP, w: 250 };

  const svc = { id: 'lb2-svc', x: vss.x, w: 255 };
  const detect = { id: 'lb2-detect', x: bcd.x, w: 250 };

  return {
    scenarioId: 'ransomware-shadow-wipe',
    sectionKey: 'step-2',
    boardBadge: 'STEP #2 · T1490',
    title: 'Inhibit System Recovery: Shadow Wipe & Service Kill',
    subtitle: 'LockBit erases local Volume Shadow Copies via vssadmin/wmic, disables WinRE via bcdedit, and halts VSS/DB services.',
    chalkHint: 'Hover any box to inspect exact destruction commands and high-severity EDR triggers.',
    tooltips: {
      'lb2-locker': {
        kind: 'process',
        title: 'lb3_black.exe (PID 6412 · SYSTEM)',
        module: 'Pre-Encryption Recovery Destruction',
        signature: 'CreateProcessW("vssadmin.exe delete shadows /all /quiet")',
        fields: [
          { key: 'pid', type: 'DWORD', value: '6412' },
          { key: 'phase', type: 'MITRE', value: 'T1490 Inhibit System Recovery' },
          { key: 'goal', type: 'Effect', value: 'Prevent free local rollback' },
        ],
        explain:
          'Before touching a single finance spreadsheet, the locker destroys every local rollback mechanism so victims cannot recover without backups.',
      },
      'lb2-vss': {
        kind: 'api',
        title: 'vssadmin.exe & wmic.exe',
        module: 'PID 6504 · Shadow Copy Snapshot Purge',
        signature: 'vssadmin.exe delete shadows /all /quiet && wmic shadowcopy delete /nointeractive',
        fields: [
          { key: 'pid', type: 'DWORD', value: '6504 (vssadmin.exe)' },
          { key: 'cmd1', type: 'CLI', value: 'vssadmin.exe delete shadows /all /quiet' },
          { key: 'fallback', type: 'WMI', value: 'wmic.exe shadowcopy delete /nointeractive' },
        ],
        explain:
          'Invoking IVssBackupComponents::DeleteSnapshots via vssadmin and WMI wipes every point-in-time Volume Shadow Copy snapshot across FS-CORP-01.',
      },
      'lb2-bcd': {
        kind: 'api',
        title: 'bcdedit.exe Recovery Lockout (PID 6540)',
        module: 'Boot Configuration Data Tampering',
        signature: 'bcdedit.exe /set {default} recoveryenabled No && bootstatuspolicy ignoreallfailures',
        fields: [
          { key: 'pid', type: 'DWORD', value: '6540 (bcdedit.exe)' },
          { key: 'recovery', type: 'BCD', value: 'recoveryenabled No' },
          { key: 'boot', type: 'BCD', value: 'bootstatuspolicy ignoreallfailures' },
        ],
        explain:
          'Disabling Windows Recovery Environment (WinRE) ensures admins cannot boot straight into local startup repair after reboot.',
      },
      'lb2-svc': {
        kind: 'detect',
        title: 'VSS, sqlservr & VeeamBackupSvc Terminated',
        module: 'System Event ID 7036 · File Lock Release',
        signature: 'ControlService(hSvc, SERVICE_CONTROL_STOP)',
        fields: [
          { key: 'vss', type: 'Service', value: 'Volume Shadow Copy (VSS) -> Stopped' },
          { key: 'backup', type: 'Service', value: 'sqlservr / VeeamBackupSvc -> Stopped' },
          { key: 'reason', type: 'NTFS', value: 'Releases exclusive .mdf/.bak handles' },
        ],
        explain:
          'Halting VSS, database, and backup daemons stops new shadow snapshots and releases exclusive file locks before head-only encryption starts.',
      },
      'lb2-detect': {
        kind: 'detect',
        title: 'Critical EDR Prevention Point',
        module: 'Sysmon EID 1 + System EID 7036',
        fields: [
          { key: 'rule1', type: 'EDR', value: 'Block non-backup vssadmin delete shadows' },
          { key: 'rule2', type: 'SIEM', value: 'Burst of System EID 7036 service stops' },
          { key: 'resilience', type: 'Backup', value: 'Air-gapped / WORM off-host snapshots' },
        ],
        explain:
          'Automated EDR kill switches often terminate processes attempting mass shadow deletion, stopping encryption before files are touched.',
      },
      'lb2-sticky': {
        kind: 'note',
        title: 'Why Immutable Off-Host Backups Matter',
        module: '3-2-1-1-0 Recovery Architecture',
        fields: [
          { key: 'localVss', type: 'Status', value: 'Destroyed by SYSTEM attacker' },
          { key: 'offHost', type: 'Status', value: 'Survives host & Domain Admin breach' },
        ],
        explain:
          'Any backup reachable with local SYSTEM or Domain Admin credentials will be targeted; only immutable off-host storage guarantees recovery.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 2 · Inhibit System Recovery (Shadow Wipe & Service Kill)'),
      box({
        id: locker.id,
        x: locker.x,
        y: y1,
        w: locker.w,
        h: h1,
        label: 'lb3_black.exe\nPID 6412\nLocalSystem Context',
        stroke: VAULT_CHALK.attacker,
        fill: VAULT_CHALK.attackerFill,
      }),
      ...hArrow({
        id: 'lb2-a1',
        fromId: locker.id,
        toId: vss.id,
        fromRight: locker.x + locker.w,
        toLeft: vss.x,
        midY: y1 + h1 / 2,
        caption: 'Sysmon EID 1',
        stroke: VAULT_CHALK.warn,
      }),
      box({
        id: vss.id,
        x: vss.x,
        y: y1,
        w: vss.w,
        h: h1,
        label: 'vssadmin.exe (6504)\ndelete shadows /all\nwmic shadowcopy delete',
        stroke: VAULT_CHALK.warn,
        fill: VAULT_CHALK.warnFill,
      }),
      ...hArrow({
        id: 'lb2-a2',
        fromId: vss.id,
        toId: bcd.id,
        fromRight: vss.x + vss.w,
        toLeft: bcd.x,
        midY: y1 + h1 / 2,
        caption: 'Disable WinRE',
        stroke: VAULT_CHALK.attacker,
      }),
      box({
        id: bcd.id,
        x: bcd.x,
        y: y1,
        w: bcd.w,
        h: h1,
        label: 'bcdedit.exe (6540)\nrecoveryenabled No\nignoreallfailures',
        stroke: VAULT_CHALK.attacker,
        fill: VAULT_CHALK.attackerFill,
      }),
      ...vArrow({
        id: 'lb2-a3',
        fromId: vss.id,
        toId: svc.id,
        midX: vss.x + vss.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'StopService',
        stroke: VAULT_CHALK.crypto,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'lb2-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'DEFENDER ARCHITECTURAL RULE\nLocal VSS cannot survive SYSTEM.\nImmutable off-host WORM backups can.',
      }),
      box({
        id: svc.id,
        x: svc.x,
        y: y2,
        w: svc.w,
        h: h2,
        label: 'System EID 7036\nVSS Service Stopped\nsqlservr / Veeam Halted',
        stroke: VAULT_CHALK.crypto,
        fill: VAULT_CHALK.cryptoFill,
      }),
      ...hArrow({
        id: 'lb2-a4',
        fromId: svc.id,
        toId: detect.id,
        fromRight: svc.x + svc.w,
        toLeft: detect.x,
        midY: y2 + h2 / 2,
        caption: 'EDR Trigger',
        stroke: VAULT_CHALK.siem,
      }),
      box({
        id: detect.id,
        x: detect.x,
        y: y2,
        w: detect.w,
        h: h2,
        label: 'High-Confidence Alert\nShadow Purge + DB Stop\nAuto-Isolate Host',
        stroke: VAULT_CHALK.siem,
        fill: VAULT_CHALK.siemFill,
      }),
      note(40, 464, 'Files are now unlocked and local rollback is gone; encryption begins milliseconds later.', VAULT_CHALK.muted),
    ],
  };
}
