import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function lockbitStep4Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;

  const noteDrop = { id: 'lb4-note', x: 40, w: 245 };
  const wevt = { id: 'lb4-wevt', x: noteDrop.x + noteDrop.w + ARROW_GAP, w: 250 };
  const eid1102 = { id: 'lb4-1102', x: wevt.x + wevt.w + ARROW_GAP, w: 250 };

  const siem = { id: 'lb4-siem', x: 430, w: 260 };
  const recover = { id: 'lb4-recover', x: siem.x + siem.w + ARROW_GAP, w: 250 };

  return {
    scenarioId: 'ransomware-shadow-wipe',
    sectionKey: 'step-4',
    boardBadge: 'STEP #4 · T1070.001',
    title: 'Ransom Note Drop, Event Log Wipe & Off-Host SIEM Survival',
    subtitle: 'wevtutil.exe wipes local logs, but Windows stamps Event ID 1102 while off-host SIEM retains the full chain.',
    chalkHint: 'Hover any box to inspect anti-forensic log clearing, EID 1102, and IR recovery priorities.',
    tooltips: {
      'lb4-note': {
        kind: 'detect',
        title: 'HLJkNskOq.README.txt & Wallpaper',
        module: 'Extortion Artifacts in Every Folder',
        signature: 'WriteFile("D:\\Finance\\HLJkNskOq.README.txt") + SystemParametersInfoW',
        fields: [
          { key: 'note', type: 'File', value: 'HLJkNskOq.README.txt' },
          { key: 'desktop', type: 'Win32', value: 'Wallpaper replaced with demand' },
          { key: 'id', type: 'Victim', value: 'Unique negotiation ID embedded' },
        ],
        explain:
          'LockBit drops extortion notes in every encrypted directory and updates the desktop wallpaper so administrators immediately see the demand.',
      },
      'lb4-wevt': {
        kind: 'process',
        title: 'wevtutil.exe cl Security / System',
        module: 'PID 7316 · MITRE T1070.001',
        signature: 'wevtutil.exe cl Security && wevtutil.exe cl System',
        fields: [
          { key: 'pid', type: 'DWORD', value: '7316 (wevtutil.exe)' },
          { key: 'parent', type: 'DWORD', value: '6412 (lb3_black.exe)' },
          { key: 'target', type: 'Channels', value: 'Security, System, Application EVTX' },
        ],
        explain:
          'Before exiting, the locker clears local Windows Event Log channels to strip forensic evidence of initial PsExec entry and lateral source IP.',
      },
      'lb4-1102': {
        kind: 'detect',
        title: 'Windows Security Event ID 1102',
        module: 'Immutable Kernel Audit Stamp',
        signature: 'The audit log was cleared · SubjectUserName=FS-CORP-01$',
        fields: [
          { key: 'eid', type: 'WinSec', value: '1102 (Security Log Cleared)' },
          { key: 'systemEid', type: 'System', value: '104 (System Log Cleared)' },
          { key: 'meaning', type: 'IR', value: 'Confirms deliberate anti-forensics' },
        ],
        explain:
          'Even as SYSTEM, clearing the Security log automatically writes Event ID 1102 as the very first new record, proving intentional log destruction.',
      },
      'lb4-siem': {
        kind: 'network',
        title: 'Off-Host SIEM Collector Intact',
        module: 'Real-Time WEF / Agent Log Shipping',
        fields: [
          { key: 'preserved', type: 'Chain', value: 'EID 5145 + 7045 + 1 + 7036 + 1102' },
          { key: 'sourceIp', type: 'Pivot', value: 'JUMP-OPS-02 (10.10.15.8) exposed' },
          { key: 'value', type: 'IR', value: 'Allows full blast-radius scoping' },
        ],
        explain:
          'Because events were streamed off-host in real time, responders still hold the exact JUMP-OPS-02 source IP and compromised Domain Admin account.',
      },
      'lb4-recover': {
        kind: 'note',
        title: 'Containment & Immutable Restore',
        module: 'Zero-Ransom Incident Recovery',
        fields: [
          { key: 'step1', type: 'IR', value: 'Isolate FS-CORP-01 & JUMP-OPS-02' },
          { key: 'step2', type: 'IAM', value: 'Reset KRBTGT twice & revoke DA' },
          { key: 'step3', type: 'Restore', value: 'Rebuild from immutable WORM backup' },
        ],
        explain:
          'Clean OS rebuilds paired with off-host immutable backups and full Active Directory credential resets eliminate persistence without paying extortion.',
      },
      'lb4-sticky': {
        kind: 'note',
        title: 'Log Clearing Never Erases Off-Host Telemetry',
        module: 'Blue-Team Resilience Architecture',
        fields: [
          { key: 'local', type: 'EVTX', value: 'Wiped -> Only EID 1102 remains' },
          { key: 'siem', type: 'Central', value: '100% of earlier events preserved' },
        ],
        explain:
          'Shipping Windows Security, System, and Sysmon logs continuously to an isolated SIEM turns local log wiping into a noisy high-severity alert.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 4 · Ransom Note, wevtutil Wipe & SIEM Survival'),
      box({
        id: noteDrop.id,
        x: noteDrop.x,
        y: y1,
        w: noteDrop.w,
        h: h1,
        label: 'HLJkNskOq.README.txt\nDropped in All Folders\nWallpaper Overwritten',
        stroke: VAULT_CHALK.attacker,
        fill: VAULT_CHALK.attackerFill,
      }),
      ...hArrow({
        id: 'lb4-a1',
        fromId: noteDrop.id,
        toId: wevt.id,
        fromRight: noteDrop.x + noteDrop.w,
        toLeft: wevt.x,
        midY: y1 + h1 / 2,
        caption: 'T1070.001',
        stroke: VAULT_CHALK.warn,
      }),
      box({
        id: wevt.id,
        x: wevt.x,
        y: y1,
        w: wevt.w,
        h: h1,
        label: 'wevtutil.exe (7316)\ncl Security & System\nLocal EVTX Purged',
        stroke: VAULT_CHALK.warn,
        fill: VAULT_CHALK.warnFill,
      }),
      ...hArrow({
        id: 'lb4-a2',
        fromId: wevt.id,
        toId: eid1102.id,
        fromRight: wevt.x + wevt.w,
        toLeft: eid1102.x,
        midY: y1 + h1 / 2,
        caption: 'Auto-Stamp',
        stroke: VAULT_CHALK.crypto,
      }),
      box({
        id: eid1102.id,
        x: eid1102.x,
        y: y1,
        w: eid1102.w,
        h: h1,
        label: 'WinSec EID 1102\nSystem EID 104\nAudit Log Cleared',
        stroke: VAULT_CHALK.crypto,
        fill: VAULT_CHALK.cryptoFill,
      }),
      ...vArrow({
        id: 'lb4-a3',
        fromId: eid1102.id,
        toId: siem.id,
        midX: siem.x + siem.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'WEF Stream',
        stroke: VAULT_CHALK.siem,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'lb4-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'BLUE-TEAM LESSON\nLocal log wipe leaves EID 1102.\nOff-host SIEM preserves JUMP-OPS-02.',
      }),
      box({
        id: siem.id,
        x: siem.x,
        y: y2,
        w: siem.w,
        h: h2,
        label: 'Off-Host SIEM Intact\n5145 -> 7045 -> 1 -> 1102\nPivot: 10.10.15.8',
        stroke: VAULT_CHALK.siem,
        fill: VAULT_CHALK.siemFill,
      }),
      ...hArrow({
        id: 'lb4-a4',
        fromId: siem.id,
        toId: recover.id,
        fromRight: siem.x + siem.w,
        toLeft: recover.x,
        midY: y2 + h2 / 2,
        caption: 'IR Playbook',
        stroke: VAULT_CHALK.ok,
      }),
      box({
        id: recover.id,
        x: recover.x,
        y: y2,
        w: recover.w,
        h: h2,
        label: 'Clean Rebuild\nRevoke DA + KRBTGT\nWORM Backup Restore',
        stroke: VAULT_CHALK.ok,
        fill: VAULT_CHALK.okFill,
      }),
      note(40, 464, 'Hover any box to inspect anti-forensic clearing, EID 1102, and zero-ransom recovery.', VAULT_CHALK.muted),
    ],
  };
}
