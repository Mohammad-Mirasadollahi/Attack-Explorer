import { DCSYNC_TELEMETRY } from './telemetry';
import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'dfir-dcsync-drsuapi-replication-eid4662',
  code: 'T1003.006',
  name: 'Microsoft, CISA & MITRE — Active Directory DCSync: Rogue MS-DRSR Replication & Security Event ID 4662 Forensics',
  shortSubtitle: 'Active Directory · DRSUAPI IDL_DRSGetNCChanges, Extended Rights GUIDs & EID 4662/4624 Correlation',
  category: 'ACTIVE_DIRECTORY',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'In Active Directory DCSync (MITRE ATT&CK T1003.006), an adversary holding over-privileged Active Directory replication permissions impersonates a peer Domain Controller over the Microsoft Directory Replication Service Remote Protocol (MS-DRSR / DRSUAPI) to pull password hashes—including krbtgt—remotely without ever logging onto the Domain Controller or touching NTDS.dit on disk. Grounded in Microsoft Learn Security Auditing Event ID 4662, CISA/NSA Active Directory compromise guidance, and MITRE ATT&CK T1003.006, this forensic walkthrough traces how extended right GUIDs 1131f6aa-9c07-11d1-f79f-00c04fc2dcd2 and 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2 expose the domain root, how Zeek/Suricata catch DRSGetNCChanges from non-DC IPs, how joining Security Event ID 4662 with Event ID 4624 via SubjectLogonId pinpoints the rogue host, and how defenders execute Tier-0 ACL cleanup and double krbtgt rotation.',
  specs: [
    { term: 'MITRE TECHNIQUE', value: 'T1003.006 (OS Credential Dumping: DCSync)' },
    { term: 'RPC PROTOCOL', value: 'MS-DRSR / DRSUAPI (UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 · Opnum 3)' },
    { term: 'REQUIRED ACL GUIDS', value: '1131f6aa-... (Get-Changes) + 1131f6ad-... (Get-Changes-All)' },
    { term: 'PRIMARY AUDIT LOG', value: 'Security Event ID 4662 (AccessMask 0x100 · Non-$ SubjectUserName)' },
    { term: 'NETWORK SIGNATURE', value: 'Zeek/Suricata DRSGetNCChanges Originating Outside Domain Controller Subnet' },
    { term: 'CONTAINMENT FIX', value: 'Strip Rogue Replication ACL + Isolate Source + Double krbtgt Reset (+10h)' },
  ],
  nodes: [
    {
      id: 'rogue_host',
      label: 'WKS-ADMIN-07 (10.20.14.88)',
      sublabel: 'Non-DC Host · svc_dir_sync',
      role: 'attacker',
      x: 10,
      y: 28,
      details: {
        osOrType: 'Compromised Admin Workstation (Non-Domain Controller)',
        pidOrPort: 'Dynamic High Port -> CORP-DC01 TCP/49668 (DRSUAPI)',
        privilege: 'CORP\\svc_dir_sync (Over-Privileged Replication ACL)',
        artifacts: [
          'Not a member of Domain Controllers or authorized DC IP range',
          'Opens MS-DRSR RPC session masquerading as peer replication partner',
          'Never executes binaries on CORP-DC01 or touches NTDS.dit file on disk',
        ],
        description:
          'A non-DC workstation leveraging a misconfigured directory-sync service account that retained DS-Replication-Get-Changes-All permissions on the domain root.',
      },
    },
    {
      id: 'ad_root_acl',
      label: 'DC=corp,DC=local ACL',
      sublabel: 'GUID 1131f6ad-... Exposed',
      role: 'memory',
      x: 34,
      y: 66,
      details: {
        osOrType: 'Active Directory nTSecurityDescriptor (Domain Root)',
        pidOrPort: 'Extended Rights 1131f6aa & 1131f6ad',
        privilege: 'Tier-0 Replication Permission Boundary',
        artifacts: [
          'DS-Replication-Get-Changes (1131f6aa-9c07-11d1-f79f-00c04fc2dcd2)',
          'DS-Replication-Get-Changes-All (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)',
          'Non-DC principal CORP\\svc_dir_sync listed in domain root DACL',
        ],
        description:
          'Active Directory access control list on the domain root object governing which identities are allowed to replicate secret credential attributes.',
      },
    },
    {
      id: 'dc_drsuapi',
      label: 'CORP-DC01 (MS-DRSR)',
      sublabel: 'ntdsai.dll · IDL_DRSGetNCChanges',
      role: 'domain_controller',
      x: 42,
      y: 26,
      details: {
        osOrType: 'Windows Server 2022 Domain Controller (10.20.10.10)',
        pidOrPort: 'lsass.exe (ntdsai.dll) · DRSUAPI Opnum 3',
        privilege: 'NT AUTHORITY\\SYSTEM (Primary DC)',
        artifacts: [
          'Services IDL_DRSGetNCChanges replication RPC calls in memory',
          'Validates caller token against domain root nTSecurityDescriptor',
          'Writes Security Event ID 4662 with AccessMask 0x100 when auditing enabled',
        ],
        description:
          'Primary Domain Controller running the Directory Replication Service; fulfills legitimate peer DC sync and inadvertently answers unauthorized callers who hold replication ACLs.',
      },
    },
    {
      id: 'krbtgt_ledger',
      label: 'NTDS Secret Store',
      sublabel: 'krbtgt & Tier-0 Hashes',
      role: 'server',
      x: 68,
      y: 26,
      details: {
        osOrType: 'Active Directory Credential Database (In-Memory Read)',
        pidOrPort: 'CN=krbtgt,CN=Users,DC=corp,DC=local',
        privilege: 'Forest Kerberos Root Trust Material',
        artifacts: [
          'Zero interactive logon or file copy against NTDS.dit required',
          'Compromising krbtgt enables Golden Ticket forgery across the domain',
          'Requires two krbtgt rotations >= 10 hours apart to remediate fully',
        ],
        description:
          'Sensitive credential material housed inside Active Directory, led by the krbtgt account whose AES/NTLM keys sign every domain Kerberos TGT.',
      },
    },
    {
      id: 'siem_4662_tower',
      label: 'SIEM EID 4662 + Zeek',
      sublabel: 'Non-DC IP & ACL Guard',
      role: 'firewall_siem',
      x: 88,
      y: 52,
      details: {
        osOrType: 'SIEM Correlation + Network Sensor + Tier-0 Auditor',
        pidOrPort: 'EID 4662 JOIN EID 4624 + Suricata SID 2043901',
        privilege: 'High-Fidelity DFIR Detection & Remediation',
        artifacts: [
          'Flags Security EID 4662 with 1131f6ad-... where SubjectUserName != *$',
          'Joins SubjectLogonId with EID 4624 to reveal source IP 10.20.14.88',
          'Zeek/Suricata alerts on DRSUAPI Opnum 3 outside authorized DC subnet',
        ],
        description:
          'Dual host-and-network visibility layer that isolates rogue DCSync immediately despite zero endpoint execution on the Domain Controller.',
      },
    },
  ],
  processTree: [
    {
      pid: 628,
      ppid: 544,
      name: 'lsass.exe (CORP-DC01 ntdsai.dll)',
      commandLine: 'C:\\Windows\\System32\\lsass.exe (Active Directory MS-DRSR Service)',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'ntdsai.dll!IDL_DRSBind(UUID=e3514235-4b06-11d1-ab04-00c04fc2dcd2)',
        'AccessCheck(DC=corp,DC=local, GUID=1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)',
        'ntdsai.dll!IDL_DRSGetNCChanges(Target=CN=krbtgt) -> Security EID 4662',
      ],
      memoryBlocks: [
        {
          address: '0x00007FF9D1100000',
          section: 'ntdsai.dll!DomainRootDACL (Over-Privileged svc_dir_sync ACE)',
          permissions: 'RW-',
          size: '24 KB',
          status: 'patched',
          description:
            'In-memory security descriptor cache for DC=corp,DC=local showing an unauthorized Access Control Entry granting non-DC user CORP\\svc_dir_sync DS-Replication-Get-Changes-All (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2).',
          hexPreview: '11 31 F6 AD 9C 07 11 D1 F7 9F 00 C0 4F C2 DC D2  .1..........O...',
        },
        {
          address: '0x00007FF9D11C0000',
          section: 'DRSUAPI RPC Dispatch Buffer (IDL_DRSGetNCChanges Opnum 3)',
          permissions: 'RW-',
          size: '64 KB',
          status: 'shellcode',
          description:
            'Active MS-DRSR replication request structure dispatched by lsass.exe on behalf of non-DC caller 10.20.14.88 requesting secret attributes for CN=krbtgt without creating any file on disk.',
          hexPreview: 'E3 51 42 35 4B 06 11 D1 AB 04 00 C0 4F C2 DC D2  .QB5K.......O...',
        },
        {
          address: '0x00007FF9D1280000',
          section: 'Hardened Tier-0 DACL & Peer-Only DC Replication Policy',
          permissions: 'R--',
          size: '24 KB',
          status: 'clean',
          description:
            'Remediated domain root security descriptor restricting 1131f6aa/1131f6ad extended rights exclusively to Enterprise Domain Controllers and audited Builtin Administrators.',
          hexPreview: '45 44 43 5F 4F 4E 4C 59 5F 44 41 43 4C 5F 4F 4B  EDC_ONLY_DACL_OK',
        },
      ],
    },
    {
      pid: 1512,
      ppid: 628,
      name: 'svchost.exe (Security Audit Engine)',
      commandLine: 'C:\\Windows\\System32\\svchost.exe -k LocalServiceNetworkRestricted',
      user: 'NT AUTHORITY\\LOCAL SERVICE',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 3,
      apiCalls: [
        'Writes Security Event ID 4662 (AccessMask 0x100 · GUID 1131f6ad-...)',
        'Joins SubjectLogonId 0x39e4c2a -> Security Event ID 4624 (10.20.14.88)',
        'Forwards P1 DCSync correlation alert to SIEM & Tier-0 responders',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'Over-Privileged Domain Root ACL (DS-Replication-Get-Changes-All)',
      subtitle: 'Non-DC Service Account Retains Extended Rights GUID 1131f6ad-...',
      description:
        'An overlooked ACL entry on DC=corp,DC=local grants non-DC service account CORP\\svc_dir_sync both DS-Replication-Get-Changes and DS-Replication-Get-Changes-All extended rights.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1003.006',
      mitreTechniqueName: 'Active Directory Replication ACL Exposure',
      activeNodeIds: ['rogue_host', 'ad_root_acl', 'dc_drsuapi'],
      compromisedNodeIds: ['rogue_host', 'ad_root_acl'],
      keySpecs: [
        { term: 'EXPOSED GUID #1', value: '1131f6aa-9c07-11d1-f79f-00c04fc2dcd2 (Get-Changes)' },
        { term: 'EXPOSED GUID #2', value: '1131f6ad-9c07-11d1-f79f-00c04fc2dcd2 (Get-Changes-All)' },
        { term: 'AUDIT SIGNAL', value: 'Security Event ID 5136 (nTSecurityDescriptor Modification)' },
      ],
    },
    {
      index: 2,
      title: 'Rogue MS-DRSR IDL_DRSGetNCChanges Request From Non-DC Workstation',
      subtitle: 'Impersonating a Peer Domain Controller Over DRSUAPI Without Touching Disk',
      description:
        'From WKS-ADMIN-07 (10.20.14.88), the compromised account invokes DRSUAPI Opnum 3 (IDL_DRSGetNCChanges) against CORP-DC01 requesting krbtgt replication secrets directly over RPC.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003.006',
      mitreTechniqueName: 'OS Credential Dumping: DCSync (MS-DRSR)',
      activeNodeIds: ['rogue_host', 'dc_drsuapi', 'krbtgt_ledger', 'siem_4662_tower'],
      compromisedNodeIds: ['rogue_host', 'ad_root_acl', 'krbtgt_ledger'],
      keySpecs: [
        { term: 'RPC INTERFACE', value: 'DRSUAPI (UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2)' },
        { term: 'RPC OPERATION', value: 'Opnum 3 — IDL_DRSGetNCChanges (Target: CN=krbtgt)' },
        { term: 'WIRE DETECTION', value: 'Suricata SID 2043901 / Zeek Non-DC DRSUAPI Alert' },
      ],
    },
    {
      index: 3,
      title: 'Security Event ID 4662 + Event ID 4624 SubjectLogonId Correlation',
      subtitle: 'Catching Non-Machine DCSync Activity Despite Zero DC Endpoint Execution',
      description:
        'CORP-DC01 logs Security Event ID 4662 with AccessMask 0x100 and GUID 1131f6ad-... under svc_dir_sync, which SIEM joins via SubjectLogonId 0x39e4c2a to Event ID 4624 IP 10.20.14.88.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003.006',
      mitreTechniqueName: 'DCSync Host & Network Forensic Attribution',
      activeNodeIds: ['dc_drsuapi', 'krbtgt_ledger', 'siem_4662_tower'],
      compromisedNodeIds: ['rogue_host', 'ad_root_acl', 'krbtgt_ledger'],
      keySpecs: [
        { term: 'SECURITY EID 4662', value: 'SubjectUserName=svc_dir_sync (No Trailing $) · Mask 0x100' },
        { term: 'LOGON CORRELATION', value: 'SubjectLogonId 0x39e4c2a -> EID 4624 IpAddress 10.20.14.88' },
        { term: 'ZERO DC ARTIFACTS', value: 'No Binary Dropped & No NTDS.dit File Read on CORP-DC01' },
      ],
    },
    {
      index: 4,
      title: 'Tier-0 ACL Revocation, Double krbtgt Rotation & Protected Users Hardening',
      subtitle: 'Closing Unauthorized Replication Paths & Invalidating Forged TGT Risk',
      description:
        'Defenders strip replication ACEs from svc_dir_sync, quarantine 10.20.14.88, execute two krbtgt password rotations 10+ hours apart, and enforce Protected Users + DC-only RPC firewall rules.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003.006',
      mitreTechniqueName: 'Active Directory Tier-0 Recovery & Hardening',
      activeNodeIds: ['ad_root_acl', 'dc_drsuapi', 'siem_4662_tower'],
      compromisedNodeIds: ['rogue_host'],
      keySpecs: [
        { term: 'ACL REMEDIATION', value: 'Restrict 1131f6aa / 1131f6ad Strictly to Enterprise DCs' },
        { term: 'KRBTGT RECOVERY', value: 'Double krbtgt Reset (>= 10 Hours Apart) Evicts Golden Tickets' },
        { term: 'PREVENTIVE GUARD', value: 'Protected Users Group + Host Firewall Blocking Non-DC DRSUAPI' },
      ],
    },
  ],
  telemetry: DCSYNC_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'dfir-dcsync-drsuapi-replication-eid4662',
  briefing: {
    headline: 'Active Directory DCSync (T1003.006): Rogue MS-DRSR Replication & Event ID 4662 Forensics',
    storyAnalogy:
      'Imagine twin sovereign mint towers joined high above the city by an armored glass bridge built exclusively for peer mints to synchronize their master coin dies. When an old service ribbon accidentally left on the gatehouse grants full bridge courier privileges to an ordinary side-street van, the impostor rolls up beneath the archway, flashes the ribbon, and receives an exact duplicate of the mint’s crown seal without ever stepping foot inside the vault—until the bridge audit tower compares the side-street license plate against the official mint roster, locks down the bridge gate to verified towers only, and recasts the crown seals twice.',
    plainSummary:
      'In this scenario (T1003.006, Active Directory DCSync Rogue Replication & Event ID 4662 Forensics) between WKS-ADMIN-07 and CORP-DC01, an adversary abusing delegated domain replication permissions extracts krbtgt and account password hashes remotely along one continuous intrusion path without executing any tool on the Domain Controller. First, the attacker leverages over-privileged replication permissions on the domain root, then invokes MS-DRSR IDL_DRSGetNCChanges from a non-Domain-Controller workstation to stream secrets out of memory, then leaves an unmistakable Security Event ID 4662 and Event ID 4624 correlation trail, and finally faces Tier-0 ACL revocation and double krbtgt rotation. Steps #1 through #4 trace each Active Directory replication handoff and SIEM correlation step, while the Memory Forensics section compares legitimate peer Domain Controller replication against rogue non-DC DRSUAPI access.',
    diagramTopologySummary:
      'Five-node Active Directory replication forensic map spanning WKS-ADMIN-07 (non-DC source), the DC=corp,DC=local domain root ACL, CORP-DC01 MS-DRSR (ntdsai.dll), the NTDS krbtgt secret store, and the SIEM EID 4662 + Zeek correlation tower.',
    documentedAdvisory:
      'Grounded in Microsoft Learn Security Auditing Event ID 4662 & [MS-DRSR], CISA/NSA Active Directory compromise guidance, and MITRE ATT&CK T1003.006.',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1003.006',
      plainTitle: 'Over-Privileged Domain Root ACL (DS-Replication-Get-Changes-All)',
      storyAnalogy:
        'Before a single ledger crosses the elevated glass bridge, the weakness already sits quietly inside the mint gatehouse registry. An outdated gold courier ribbon was accidentally left pinned to a regular side-street delivery account, quietly giving it the exact same bridge clearance reserved for sovereign mint towers.',
      simpleExplanation:
        'Active Directory controls which accounts may replicate password hashes via two extended rights stored on the domain root nTSecurityDescriptor (the security ACL on DC=corp,DC=local): DS-Replication-Get-Changes (GUID 1131f6aa-9c07-11d1-f79f-00c04fc2dcd2, permitting directory delta queries) and DS-Replication-Get-Changes-All (GUID 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2, permitting replication of secret password hashes). Leaving both rights on a non-DC service account such as svc_dir_sync grants silent domain-wide credential replication.',
      howItWorksInPractice:
        'Organizations often grant replication rights temporarily during legacy directory sync deployments (such as Azure AD Connect staging or migration tools) and forget to revoke them afterward. Because Active Directory evaluates MS-DRSR replication strictly against the caller’s security token and the domain root DACL—not whether the caller is actually a Domain Controller computer account—any compromised non-DC account holding 1131f6aa and 1131f6ad effectively holds the keys to the kingdom. Auditing Security Event ID 5136 for nTSecurityDescriptor changes and running regular Tier-0 ACL reviews catch exposed replication ribbons before an adversary ever abuses them.',
      diagramAlignment:
        'Follow Step #1 / Link #1 as Node 1 (WKS-ADMIN-07) leverages the exposed GUID 1131f6ad-... permission inside Node 2 (DC=corp,DC=local ACL) targeting Node 3 (CORP-DC01 MS-DRSR).',
      detectionAndEvidence:
        'Continuously audit the DC=corp,DC=local domain root DACL for non-Domain-Controller accounts holding GUID 1131f6aa-9c07-11d1-f79f-00c04fc2dcd2 or 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2, and alert immediately on Security Event ID 5136 modifying nTSecurityDescriptor.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1003.006',
      plainTitle: 'Rogue MS-DRSR IDL_DRSGetNCChanges Request From Non-DC Workstation',
      storyAnalogy:
        'Rolling right up to the armored bridge ramp in an ordinary side-street service car, the impostor flashes the over-privileged ribbon and asks the north mint tower to stream down a fresh copy of the royal crown die ledger—without ever setting a single boot inside the north vault hallway.',
      simpleExplanation:
        'Using the MS-DRSR protocol (Microsoft Directory Replication Service Remote Protocol, exposed via DRSUAPI UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 over dynamic RPC TCP ports), the remote workstation invokes IDL_DRSGetNCChanges (Opnum 3, the legitimate peer-to-peer Active Directory replication call) directly against CORP-DC01. Because the Domain Controller fulfills the RPC call from lsass.exe memory, zero files are written and zero tools execute on the Domain Controller itself.',
      howItWorksInPractice:
        'Traditional endpoint monitoring focused solely on processes spawned on CORP-DC01 misses DCSync completely because the Domain Controller is simply performing its normal replication role inside lsass.exe via ntdsai.dll (the core Active Directory engine DLL that serves directory replication requests directly from memory). However, network sensors see the contradiction immediately: peer Active Directory replication over DRSUAPI Opnum 3 (the RPC procedure number dedicated to IDL_DRSGetNCChanges directory replication) should originate exclusively from known Domain Controller IP addresses (10.20.10.10, 10.20.10.11). When Zeek DCE-RPC or Suricata SID 2043901 observes 10.20.14.88 (WKS-ADMIN-07) invoking DRSGetNCChanges against CORP-DC01 targeting CN=krbtgt, defenders obtain indisputable wire-level proof of unauthorized replication.',
      diagramAlignment:
        'Follow Step #2 / Link #2 as Node 1 (WKS-ADMIN-07) sends DRSUAPI Opnum 3 to Node 3 (CORP-DC01 MS-DRSR) to read Node 4 (NTDS Secret Store) while Node 5 (SIEM + Zeek) flags the non-DC source IP.',
      detectionAndEvidence:
        'Deploy Suricata SID 2043901 and Zeek DCE-RPC sensors to fire P1 alerts whenever DRSUAPI UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 Opnum 3 (IDL_DRSGetNCChanges) originates from any IP address outside the authorized Domain Controller subnet.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1003.006',
      plainTitle: 'Security Event ID 4662 + Event ID 4624 SubjectLogonId Correlation',
      storyAnalogy:
        'Even though the side-street van never crossed the vault threshold, the elevated bridge gatehouse automatically stamps an indelible blue ledger line recording every master-die transfer. Comparing that transfer badge against the city traffic log immediately exposes an ordinary street plate masquerading as a peer mint tower.',
      simpleExplanation:
        'When Directory Service Access auditing is configured properly on Domain Controllers, every DRSUAPI replication request writes Windows Security Event ID 4662 (An operation was performed on an object) with AccessMask 0x100 (Control Access) and Properties containing GUID 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2. Filtering out legitimate Domain Controller computer accounts (ending in $) and joining SubjectLogonId to Security Event ID 4624 reveals both the abused user (svc_dir_sync) and the exact rogue workstation IP (10.20.14.88).',
      howItWorksInPractice:
        'In a healthy domain, 99.9% of Security Event ID 4662 replication entries show SubjectUserName ending in $ (representing legitimate peer Domain Controller machine accounts such as CORP-DC02$) and originate from peer Domain Controller IPs. Here, CORP-DC01 records Event ID 4662 with SubjectUserName=svc_dir_sync, SubjectLogonId=0x39e4c2a (the unique session identifier linking this object-access audit record back to the caller’s network authentication event), ObjectType=domainDNS, and Properties containing {1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}. Joining SubjectLogonId 0x39e4c2a to the matching Security Event ID 4624 network logon exposes IpAddress=10.20.14.88 (WKS-ADMIN-07) within milliseconds, giving SOC analysts complete host, identity, and timestamp attribution without needing a single EDR event on the DC.',
      diagramAlignment:
        'Follow Step #3 / Link #3 as Node 3 (CORP-DC01) emits Security Event ID 4662 into Node 5 (SIEM EID 4662 + Zeek), which correlates SubjectLogonId 0x39e4c2a back to Node 1 (10.20.14.88).',
      detectionAndEvidence:
        'Run a real-time Sigma/KQL SIEM correlation rule matching Security Event ID 4662 (Properties containing GUID 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2 with non-$ SubjectUserName) joined on SubjectLogonId to Security Event ID 4624 to pinpoint the rogue source IpAddress.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1003.006',
      plainTitle: 'Tier-0 ACL Revocation, Double krbtgt Rotation & Protected Users Hardening',
      storyAnalogy:
        'With the rogue side-street car identified, mint security officers strip the misconfigured ribbon off the gatehouse ledger, quarantine the impostor van, lower an emerald peer-mint-only lock across the elevated bridge, and recast the master crown seals twice so any stolen stamp becomes worthless.',
      simpleExplanation:
        'Because DCSync exposes the krbtgt password hash (the master Kerberos signing secret that can mint forged Golden Tickets valid for years), remediation requires four disciplined actions: removing unauthorized replication ACEs from DC=corp,DC=local, isolating WKS-ADMIN-07, resetting krbtgt twice (separated by at least 10 hours to flush both current and previous Kerberos key versions), and enrolling Tier-0 admins into the Protected Users group.',
      howItWorksInPractice:
        'Simply resetting the compromised svc_dir_sync password is never sufficient after a confirmed DCSync event: an attacker who replicated CN=krbtgt retains silent domain persistence until krbtgt is rotated twice (allowing active Kerberos TGTs, default 10-hour lifetime, to cycle cleanly between resets so domain authentication stays uninterrupted). Simultaneously, defenders remove DS-Replication-Get-Changes and DS-Replication-Get-Changes-All from every non-DC identity, audit AdminSDHolder, enforce Windows Firewall IPSec / DC-only allowlists on RPC replication ports, and keep continuous Event ID 4662 + Zeek DRSUAPI alerting permanently armed.',
      diagramAlignment:
        'Follow Step #4 / Link #4 as Node 5 (SIEM EID 4662 + Zeek) cleans Node 2 (DC=corp,DC=local ACL) and locks down Node 3 (CORP-DC01 MS-DRSR) to peer Domain Controllers only.',
      detectionAndEvidence:
        'Verify zero non-DC principals retain GUID 1131f6aa/1131f6ad on DC=corp,DC=local, confirm both krbtgt password resets appear in Security Event ID 4738 separated by >= 10 hours, and validate Tier-0 Protected Users membership.',
    },
  ],
};
