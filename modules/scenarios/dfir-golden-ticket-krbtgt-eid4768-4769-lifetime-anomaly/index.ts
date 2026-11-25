import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly',
    title: 'Microsoft Defender for Identity, CERT-FR & MITRE DFIR — Kerberos Golden Ticket Forgery Forensics (EID 4768 / 4769)',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1558.001',
    description:
      'Grounded in Microsoft Defender for Identity Kerberos analytics, CERT-FR Active Directory Golden Ticket detection guides, and MITRE ATT&CK T1558.001: after stealing the krbtgt hash, an attacker forges a custom TGT offline using Mimikatz or Rubeus and injects it via Pass-the-Ticket, producing three definitive KDC forensic anomalies on Domain Controllers: (1) an orphaned EventID 4769 (TGS-REQ) with no preceding EventID 4768 (AS-REQ), (2) a non-existent or forged Privilege Attribute Certificate (PAC) user/RID (e.g., RID 500 with fake username), and (3) a 10-year ticket lifetime or RC4 (0x17) encryption downgrade.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rubeus / Mimikatz ptt Host', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Kerberos KDC TCP/UDP :88', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CORP-DC01 (kdcsvc.dll)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'EID 4768 vs 4769 Correlation', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'CIFS/CORP-DC01 Target Service', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Offline TGT Forgery with Stolen krbtgt Key & Pass-the-Ticket LsaCallAuthenticationPackage',
        narration:
          'On a compromised workstation, the attacker runs kerberos::golden /domain:corp.local /sid:S-1-5-21-3819201 /aes256:<krbtgt_key> /user:ghost_admin /id:500 /groups:512,513,518,519,520 /ptt. Because the TGT is encrypted locally using the stolen krbtgt key and injected directly into LSASS via LsaCallAuthenticationPackage (KERB_SUBMIT_TICKET_MESSAGE), zero AS-REQ traffic (EventID 4768) is sent to the Domain Controller.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Credential Access (T1558.001 - Steal or Forge Kerberos Tickets: Golden Ticket)',
        technicalCommands: [
          'mimikatz "kerberos::golden /domain:corp.local /sid:S-1-5-21-3819201 /aes256:4f91a82b... /user:ghost_admin /id:500 /ptt"',
          'LsaCallAuthenticationPackage(KerbSubmitTicketMessage) injects forged TGT into current LogonId',
          'Missing Artifact: Zero EventID 4768 (AS-REQ) generated on CORP-DC01',
        ],
        defenseMitigation:
          'Monitor userland calls to LsaCallAuthenticationPackage with KerbSubmitTicketMessage from non-standard binaries and audit KDC EventID 4768 vs 4769 ratios.',
        logs: [
          {
            id: 'dfir-golden-1',
            timestamp: '17:02:10.100',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 10,
            ProcessName: 'rubeus.exe',
            CommandLine: 'rubeus.exe golden /aes256:4f91a82b... /user:ghost_admin /id:500 /domain:corp.local /sid:S-1-5-21-3819201 /ptt',
            raw: 'EventID: 10 | SourceImage: C:\\Users\\Public\\rubeus.exe | TargetImage: C:\\Windows\\System32\\lsass.exe | CallTrace: secur32.dll!LsaCallAuthenticationPackage (KerbSubmitTicketMessage) | ForgedPrincipal: ghost_admin@CORP.LOCAL (RID 500)',
            parsedFields: {
              Technique: 'Offline Golden Ticket Forgery + Pass-the-Ticket (/ptt)',
              ForgedUserAndRid: 'ghost_admin (RID 500 Domain Admin)',
              InjectedDefaultLifetime: '10 Years (Mimikatz default EndTime - StartTime)',
              KdcAsReqBypassed: 'True (No EventID 4768 generated)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Orphaned TGS-REQ (Security EventID 4769 Without Preceding 4768) & PAC Validation Anomaly',
        narration:
          'When the attacker accesses \\\\CORP-DC01\\C$, the workstation presents the forged TGT in a KRB_TGS_REQ to CORP-DC01. The KDC decrypts the TGT with its krbtgt key and logs Security EventID 4769 (A Kerberos service ticket was requested) for TargetUserName=ghost_admin@CORP.LOCAL and ServiceName=cifs/CORP-DC01.corp.local—creating an orphaned 4769 for a principal that never authenticated via 4768 (and since Windows Nov 2021 KB5008380 PAC enhancements, mismatches between the PAC SID and SAM account trigger KDC failure 0x25 / EventID 4769 Status 0x6).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement (T1550.003 - Use Alternate Authentication Material: Pass the Ticket)',
        technicalCommands: [
          'KDC Security EventID 4769: Account_Name=ghost_admin@CORP.LOCAL Service_Name=cifs/CORP-DC01.corp.local',
          'SIEM Anomaly 1: EventID 4769 observed for ghost_admin with zero EventID 4768 in preceding 10 hours',
          'SIEM Anomaly 2: TicketEncryptionType=0x17 (RC4 downgrade) or Zeek kerberos.log till-from = 315360000s (10 years)',
        ],
        defenseMitigation:
          'Deploy SIEM stateful correlation rules alerting on any Kerberos EventID 4769 where the AccountName has no corresponding EventID 4768 within the domain maximum ticket lifetime policy (default 10 hours).',
        logs: [
          {
            id: 'dfir-golden-2',
            timestamp: '17:02:14.420',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4769,
            ProcessName: 'lsass.exe',
            CommandLine: 'KRB_TGS_REQ ServiceName=cifs/CORP-DC01.corp.local AccountName=ghost_admin@CORP.LOCAL',
            raw: 'EventID: 4769 | Computer: CORP-DC01.corp.local | TargetUserName: ghost_admin@CORP.LOCAL | TargetDomainName: CORP.LOCAL | ServiceName: cifs/CORP-DC01.corp.local | IpAddress: ::ffff:10.10.4.22 | TicketOptions: 0x40810000 | TicketEncryptionType: 0x17 | Status: 0x0',
            parsedFields: {
              EventID: '4769 (Kerberos Service Ticket Requested)',
              OrphanedTicketAnomaly: 'Zero preceding EventID 4768 (AS-REQ) for ghost_admin',
              TicketEncryptionType: '0x17 (RC4-HMAC Downgrade)',
              ServiceName: 'cifs/CORP-DC01.corp.local',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Target Host LogonType 3 with Synthetic Domain Admin PAC Groups (Security EventID 4624 & 4672)',
        narration:
          'Upon receiving the TGS, the attacker mounts \\\\CORP-DC01\\C$, generating Security EventID 4624 (LogonType 3, AuthenticationPackageName=Kerberos) and EventID 4672 (Special privileges assigned to new logon) on CORP-DC01—granting SeDebugPrivilege and SeBackupPrivilege to a username (ghost_admin) that does not exist in Active Directory.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1558.001 - Forged PAC Group RIDs 512/519)',
        technicalCommands: [
          'Security EventID 4624: LogonType=3 AuthenticationPackageName=Kerberos TargetUserName=ghost_admin',
          'Security EventID 4672: SubjectUserSid=S-1-5-21-3819201-500 PrivilegeList=SeDebugPrivilege, SeBackupPrivilege, SeTakeOwnershipPrivilege',
        ],
        defenseMitigation:
          'Enforce KB5008380 (PAC Requestor SID enforcement) across all Domain Controllers and rotate the krbtgt password twice immediately upon detecting an orphaned EventID 4769 or phantom RID-500 logon.',
        logs: [
          {
            id: 'dfir-golden-3',
            timestamp: '17:02:14.890',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4624,
            ProcessName: 'lsass.exe',
            CommandLine: 'Kerberos LogonType 3 as ghost_admin (Forged RID 500 PAC)',
            raw: 'EventID: 4624 | LogonType: 3 | TargetUserSid: S-1-5-21-3819201-500 | TargetUserName: ghost_admin | TargetDomainName: CORP.LOCAL | LogonProcessName: Kerberos | IpAddress: 10.10.4.22 | Correlated EventID 4672: SeDebugPrivilege',
            parsedFields: {
              EventID: '4624 (Network Logon) + 4672 (Admin Privileges Assigned)',
              TargetUserSid: 'S-1-5-21-3819201-500 (RID 500)',
              TargetUserName: 'ghost_admin (Non-Existent AD Object)',
              AuthenticationPackage: 'Kerberos',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a giant theme park where every visitor must first visit the front admission booth to receive an official stamped day wristband before any ride operator will issue a ride pass. Having stolen the park master ink stamp earlier, an intruder prints an impossible ten-year VIP wristband at home and walks straight up to an inner ride gate without ever passing through the front booth, immediately tripping forensic auditors who spot a VIP ride pass with zero front-gate admission record.',
      storyMappings: [
        {
          storyTerm: 'Printing an impossible ten-year VIP wristband at home',
          technicalTerm: 'Offline Golden Ticket TGT forgery using stolen krbtgt AES-256 key and Pass-the-Ticket injection',
          tone: 'amber',
        },
        {
          storyTerm: 'Walking straight up to a ride gate with zero front-gate check-in',
          technicalTerm: 'Orphaned KRB_TGS_REQ (EventID 4769) with no preceding AS-REQ (EventID 4768)',
          tone: 'sky',
        },
        {
          storyTerm: 'Synthetic VIP committee seals stamped onto the wristband',
          technicalTerm: 'Forged Privilege Attribute Certificate (PAC) injecting Domain Admin SIDs',
          tone: 'rose',
        },
        {
          storyTerm: 'Walking straight into the vault room with the forged ride pass',
          technicalTerm: 'Target host Security EventID 4624 (LogonType 3) accessing \\\\CORP-DC01\\C$ with forged groups',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Sitting quietly at a compromised desk away from the park entrance, the intruder presses the stolen master ink stamp onto a homemade VIP wristband claiming ten years of executive authority and slips it straight into their local memory pocket.',
        storyMappings: [
          {
            storyTerm: 'Stolen master ink stamp',
            technicalTerm: 'Previously compromised Active Directory krbtgt AES-256 or RC4 key',
            tone: 'amber',
          },
          {
            storyTerm: 'Homemade VIP wristband claiming executive authority',
            technicalTerm: 'Forged Kerberos TGT crafted offline with kerberos::golden and domain SID',
            tone: 'sky',
          },
          {
            storyTerm: 'Slipping the wristband into the local memory pocket',
            technicalTerm: 'Pass-the-Ticket injection via LsaCallAuthenticationPackage into the current logon session',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero visit to the front admission booth',
            technicalTerm: 'Complete absence of any legitimate KDC AS-REQ / EventID 4768 ticket grant',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Approaching the main vault service desk, the intruder flashes their homemade wristband to request a door pass. Because the ink stamp matches mathematically, the desk hands over a vault pass, yet the audit ledger immediately exposes two glaring anomalies: no front-gate entry ever existed, and the wristband expiration date stretches far beyond normal park hours.',
        storyMappings: [
          {
            storyTerm: 'Flashing the homemade wristband for a vault door pass',
            technicalTerm: 'Workstation sending KRB_TGS_REQ for \\\\CORP-DC01\\C$ using the forged TGT',
            tone: 'amber',
          },
          {
            storyTerm: 'Audit ledger showing zero front-gate entry',
            technicalTerm: 'Orphaned Security EventID 4769 with no matching prior EventID 4768 for that session',
            tone: 'sky',
          },
          {
            storyTerm: 'Impossible wristband expiration date',
            technicalTerm: 'Anomalous TGT lifetime (e.g., 10 years instead of default 10 hours) and PAC discrepancies',
            tone: 'rose',
          },
          {
            storyTerm: 'Vault desk verifying the ink stamp mathematically',
            technicalTerm: 'KDC validating the krbtgt signature on the TGT without noticing offline forgery',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Holding the freshly minted vault door pass, the intruder steps straight into the Domain Controller storage room carrying fabricated executive group badges that do not even match the real employee directory.',
        storyMappings: [
          {
            storyTerm: 'Stepping into the Domain Controller storage room',
            technicalTerm: 'Mounting \\\\CORP-DC01\\C$ using the forged Kerberos service ticket',
            tone: 'amber',
          },
          {
            storyTerm: 'Fabricated executive group badges inside the pass',
            technicalTerm: 'Synthetic Domain Admin and Enterprise Admin RIDs embedded in the forged PAC',
            tone: 'sky',
          },
          {
            storyTerm: 'Door ledger logging the network arrival',
            technicalTerm: 'Security EventID 4624 (LogonType 3, Kerberos) recording forged privileged logon',
            tone: 'rose',
          },
          {
            storyTerm: 'Permanent cure invalidating every counterfeit stamp',
            technicalTerm: 'Double rotation of the krbtgt password spaced by the maximum ticket lifetime',
            tone: 'emerald',
          },
        ],
      },
    },
  };
