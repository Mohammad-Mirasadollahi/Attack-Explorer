import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function lsassStep4Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 302;
  const h2 = 126;

  const exfil = { id: 'ls4-exfil', x: 40, w: 245 };
  const siem = { id: 'ls4-siem', x: exfil.x + exfil.w + ARROW_GAP, w: 260 };
  const contain = { id: 'ls4-contain', x: siem.x + siem.w + ARROW_GAP, w: 245 };
  const harden = { id: 'ls4-harden', x: siem.x, w: 260 };

  return {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'step-4',
    boardBadge: 'STEP #4 · OFFLINE RISK, SIEM TRIAGE & HARDENING',
    title: 'Offline pypykatz Extraction vs. Triple SIEM Correlation & RunAsPPL',
    subtitle:
      'Correlating Sysmon EID 1 + EID 10 + EID 11 triggers immediate containment, krbtgt/NTLM rotation, and RunAsPPL + VBS hardening.',
    chalkHint:
      'Hover any node to inspect offline Mimikatz/pypykatz impact, Splunk/Sigma correlation, and preventive LSA controls.',
    tooltips: {
      'ls4-exfil': {
        kind: 'process',
        title: 'Offline Credential Harvesting (pypykatz / Mimikatz)',
        module: 'Attacker Staging Host (Off-Endpoint)',
        signature: 'pypykatz lsa minidump debug.dmp -> CORP\\adm_jchen NTLM + Kerberos TGT',
        fields: [
          { key: 'risk', type: 'Blast', value: 'Pass-the-Hash & Pass-the-Ticket lateral movement' },
          { key: 'evasion', type: 'Host', value: 'Zero cracking tools ever run on WKS-ADM-07' },
          { key: 'cleanup', type: 'Anti-DFIR', value: 'Attacker deletes C:\\Windows\\Temp\\debug.dmp' },
        ],
        explain:
          'Moving the 48.2 MB minidump off-host lets the adversary extract every cached NTLM hash and TGT without tripping endpoint Mimikatz signatures.',
      },
      'ls4-siem': {
        kind: 'detect',
        title: 'High-Confidence Triple SIEM Correlation (Splunk SURGe)',
        module: 'Sysmon EID 1 + EID 10 + EID 11 (Same ProcessGuid)',
        signature: 'EID 1 (rundll32) + EID 10 (0x1010 comsvcs|dbgcore) + EID 11 (debug.dmp)',
        fields: [
          { key: 'eid1', type: 'Process', value: 'cmd (4920) -> rundll32 (5412) comsvcs,#24' },
          { key: 'eid10', type: 'Access', value: 'GrantedAccess=0x1010 CallTrace=comsvcs|dbgcore' },
          { key: 'eid11', type: 'File', value: 'C:\\Windows\\Temp\\debug.dmp created' },
        ],
        explain:
          'Joining all three Sysmon events on ProcessGuid produces an indisputable DFIR timeline even after the dump file is deleted from disk.',
      },
      'ls4-contain': {
        kind: 'detect',
        title: 'Incident Response Containment & Credential Rotation',
        module: 'SOC Playbook · T1003.001 Compromise',
        signature: 'Isolate WKS-ADM-07 -> Revoke CORP\\adm_jchen -> Reset NTLM & TGTs',
        fields: [
          { key: 'isolate', type: 'EDR', value: 'Network-quarantine WKS-ADM-07 immediately' },
          { key: 'revoke', type: 'AD', value: 'Reset CORP\\adm_jchen password & revoke TGTs' },
          { key: 'hunt', type: 'Scope', value: 'Hunt SMB/WinRM 4624 Type 3/9 lateral logons' },
        ],
        explain:
          'Because NTLM hashes and active Kerberos tickets were exposed in RAM, password resets and Kerberos ticket revocation are mandatory.',
      },
      'ls4-harden': {
        kind: 'memory',
        title: 'Permanent Prevention · RunAsPPL & Credential Guard',
        module: 'Windows Kernel LSA Protection + VBS VTL1 + Defender ASR',
        signature: 'RunAsPPL = 1 + LsaIso.exe (VTL1) + ASR 9e6c4e1f-7d60-472f-ba1a-a39ef669e4b2',
        fields: [
          { key: 'ppl', type: 'Kernel', value: 'Blocks OpenProcess(0x1010) -> ACCESS_DENIED' },
          { key: 'vbs', type: 'Hypervisor', value: 'LsaIso.exe isolates NTLM/TGT out of lsass.exe' },
          { key: 'asr', type: 'Rule', value: 'Blocks unsigned/LOLBin LSASS credential theft' },
        ],
        explain:
          'Deploying RunAsPPL and VBS Credential Guard via GPO eliminates comsvcs.dll dumping across the entire Windows fleet.',
      },
      'ls4-sticky': {
        kind: 'note',
        title: 'Why File Deletion Does Not Erase Sysmon Evidence',
        module: 'Centralized SIEM Forwarding',
        fields: [
          { key: 'ship', type: 'Log', value: 'Sysmon EID 10 ships to SIEM in milliseconds' },
          { key: 'pivot', type: 'Key', value: 'ProcessGuid binds EID 1, 10, and 11 together' },
        ],
        explain:
          'Streaming Sysmon EID 10 off-host preserves the CallTrace stack proof even if the attacker wipes debug.dmp seconds later.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 4 · Offline Extraction Risk, Triple SIEM Correlation & Hardening'),
      box({
        id: exfil.id,
        x: exfil.x,
        y: y1,
        w: exfil.w,
        h: h1,
        label: 'Offline Extraction\nExfil debug.dmp\npypykatz -> NTLM / TGT',
        stroke: VAULT_CHALK.crimson,
        fill: VAULT_CHALK.crimsonFill,
      }),
      ...hArrow({
        id: 'ls4-a1',
        fromId: exfil.id,
        toId: siem.id,
        fromRight: exfil.x + exfil.w,
        toLeft: siem.x,
        midY: y1 + h1 / 2,
        caption: 'Caught By',
        stroke: VAULT_CHALK.steel,
      }),
      box({
        id: siem.id,
        x: siem.x,
        y: y1,
        w: siem.w,
        h: h1,
        label: 'Triple SIEM Correlation\nEID 1 + EID 10 + EID 11\nJoined by ProcessGuid',
        stroke: VAULT_CHALK.steel,
        fill: VAULT_CHALK.steelFill,
      }),
      ...hArrow({
        id: 'ls4-a2',
        fromId: siem.id,
        toId: contain.id,
        fromRight: siem.x + siem.w,
        toLeft: contain.x,
        midY: y1 + h1 / 2,
        caption: 'SOC Trigger',
        stroke: VAULT_CHALK.amber,
      }),
      box({
        id: contain.id,
        x: contain.x,
        y: y1,
        w: contain.w,
        h: h1,
        label: 'IR Containment\nIsolate WKS-ADM-07\nReset adm_jchen + TGT',
        stroke: VAULT_CHALK.amber,
        fill: VAULT_CHALK.amberFill,
      }),
      ...vArrow({
        id: 'ls4-a3',
        fromId: siem.id,
        toId: harden.id,
        midX: harden.x + harden.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Close Gap',
        stroke: VAULT_CHALK.emerald,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'ls4-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'POST-INCIDENT CHECKLIST\n1) Rotate all exposed domain admin credentials.\n2) Enable RunAsPPL + VBS Credential Guard.',
      }),
      box({
        id: harden.id,
        x: harden.x,
        y: y2,
        w: harden.w,
        h: h2,
        label: 'Preventive Architecture\nRunAsPPL = 1 + LsaIso\nDefender ASR Rule',
        stroke: VAULT_CHALK.emerald,
        fill: VAULT_CHALK.emeraldFill,
      }),
      note(
        40,
        460,
        'Hover each node to inspect offline pypykatz exposure, ProcessGuid SIEM correlation, and RunAsPPL/VBS remediation.',
        VAULT_CHALK.muted
      ),
    ],
  };
}
