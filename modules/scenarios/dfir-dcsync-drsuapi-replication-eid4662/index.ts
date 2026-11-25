import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-dcsync-drsuapi-replication-eid4662',
    title: 'Microsoft Security Auditing & CISA DFIR — Active Directory DCSync DRSUAPI Replication (EventID 4662)',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1003.006',
    description:
      'Grounded in Microsoft Windows Security Auditing Event ID 4662 documentation, CISA AD Defense Guidance, and MITRE ATT&CK T1003.006: an attacker with Replicating Directory Changes permissions invokes the MS-DRSR (DRSUAPI) IDL_DRSGetNCChanges RPC method from a non-Domain Controller workstation to replicate the krbtgt and administrator password hashes without touching disk on the DC.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rogue Workstation (10.10.4.22)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'DC RPC Endpoint Mapper (:135)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CORP-DC01 (lsass DRSUAPI)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Security EID 4662 & Zeek NDR', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AD Naming Context (DC=corp)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: MS-DRSR RPC Bind to UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 (EventID 4624 & Zeek dce_rpc)',
        narration:
          'From a compromised workstation (10.10.4.22), the attacker authenticates over SMB/RPC (Security EventID 4624 LogonType 3) to CORP-DC01 and binds to the Directory Replication Service (drsuapi) RPC interface UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 via IDL_DRSBind.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Credential Access (T1003.006 - OS Credential Dumping: DCSync)',
        technicalCommands: [
          'lsadump::dcsync /domain:corp.local /user:corp\\krbtgt',
          'impacket-secretsdump corp.local/svc_sync@10.10.0.10 -just-dc-user krbtgt',
          'Zeek dce_rpc.log: interface=drsuapi (e3514235-4b06-11d1-ab04-00c04fc2dcd2) op=IDL_DRSBind',
        ],
        defenseMitigation:
          'Audit Active Directory ACLs on the domain root object to ensure only legitimate Domain Controller computer accounts hold DS-Replication-Get-Changes-All.',
        logs: [
          {
            id: 'dfir-dcsync-1',
            timestamp: '15:20:11.045',
            source: 'Network',
            severity: 'high',
            EventCode: 4624,
            ProcessName: 'lsass.exe',
            CommandLine: 'DCE-RPC Bind UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 (drsuapi) from 10.10.4.22',
            raw: 'zeek_dce_rpc: ts=1762183211.045 uid=C8kL91 id.orig_h=10.10.4.22 id.resp_h=10.10.0.10 id.resp_p=49666 named_pipe="5026" endpoint="drsuapi" uuid="e3514235-4b06-11d1-ab04-00c04fc2dcd2" operation="IDL_DRSBind"',
            parsedFields: {
              Protocol: 'MS-DRSR / DRSUAPI over TCP High Port',
              RpcInterfaceUuid: 'e3514235-4b06-11d1-ab04-00c04fc2dcd2',
              SourceWorkstationIp: '10.10.4.22 (Non-DC IP)',
              TargetDomainController: 'CORP-DC01 (10.10.0.10)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Directory Replication Extended Rights Check (Security EventID 4662 ControlAccess 0x100)',
        narration:
          'When IDL_DRSGetNCChanges (Opnum 3) is invoked, CORP-DC01 logs Windows Security EventID 4662 (An operation was performed on an object) on ObjectType domainDNS (%{19195a5b-6da0-11d0-afd3-00c04fd930c9}) with AccessMask 0x100 (ControlAccess) and Properties containing the Extended Rights GUIDs 1131f6aa-9c07-11d1-f79f-00c04fc2dcd2 (DS-Replication-Get-Changes) and 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2 (DS-Replication-Get-Changes-All).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1003.006 - EventID 4662 Extended Rights GUIDs)',
        technicalCommands: [
          'EventID 4662: AccessMask=0x100 (ControlAccess) ObjectServer=DS',
          'DS-Replication-Get-Changes: {1131f6aa-9c07-11d1-f79f-00c04fc2dcd2}',
          'DS-Replication-Get-Changes-All: {1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}',
        ],
        defenseMitigation:
          'Create a SIEM correlation rule matching EventID 4662 where Properties contains 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2 and SubjectUserName does not end with $ (or is not in the Domain Controllers allowlist).',
        logs: [
          {
            id: 'dfir-dcsync-2',
            timestamp: '15:20:11.318',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4662,
            ProcessName: 'lsass.exe',
            CommandLine: 'IDL_DRSGetNCChanges DS-Replication-Get-Changes-All {1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}',
            raw: 'EventID: 4662 | SubjectUserName: svc_sync | SubjectDomainName: CORP | ObjectServer: DS | ObjectType: %{19195a5b-6da0-11d0-afd3-00c04fd930c9} | ObjectName: %{d482018a-52e1-4c9a-9811-0192837465ab} | AccessMask: 0x100 | Properties: %{1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}',
            parsedFields: {
              EventID: '4662 (Directory Service Object Access)',
              SubjectUserName: 'svc_sync (Non-DC Account)',
              AccessMask: '0x100 (ControlAccess)',
              ExtendedRightGuid: '1131f6ad-9c07-11d1-f79f-00c04fc2dcd2 (DS-Replication-Get-Changes-All)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Replication of SupplementalCredentials & krbtgt AES-256 / NTLM Hashes',
        narration:
          'CORP-DC01 returns the DRS_MSG_GETNCCHANGESREPLY structure encrypted with the RPC session key, delivering the current and historical NTLM hashes, AES-256 Kerberos keys, and SupplementalCredentials for krbtgt to the attacker workstation for Golden Ticket forgery.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1003.006 - krbtgt Key Material Exfiltration)',
        technicalCommands: [
          'RPC Reply: DRS_MSG_GETNCCHANGESREPLY (Attributes: unicodePwd, dBCSPwd, supplementalCredentials)',
          'Extracted Hash: krbtgt:502:aad3b435b51404eeaad3b435b51404ee:88e4d91a03b7190441a9c12098765432:::',
          'Extracted AES256: krbtgt:aes256-cts-hmac-sha1-96:4f91a82b73c610e9...',
        ],
        defenseMitigation:
          'Upon confirmed DCSync compromise, rotate the krbtgt account password twice across all Domain Controllers and revoke compromised privileged accounts.',
        logs: [
          {
            id: 'dfir-dcsync-3',
            timestamp: '15:20:11.690',
            source: 'Network',
            severity: 'critical',
            EventCode: 3,
            ProcessName: 'lsass.exe',
            CommandLine: 'IDL_DRSGetNCChanges response -> 10.10.4.22 (krbtgt attributes replicated)',
            raw: 'zeek_dce_rpc: ts=1762183211.690 id.orig_h=10.10.4.22 id.resp_h=10.10.0.10 endpoint="drsuapi" operation="IDL_DRSGetNCChanges" rtt=0.372s status="0x00000000 (ERROR_SUCCESS)"',
            parsedFields: {
              RpcOperation: 'IDL_DRSGetNCChanges (Opnum 3)',
              ReplicatedObject: 'CN=krbtgt,CN=Users,DC=corp,DC=local',
              ReplicatedAttributes: 'unicodePwd, supplementalCredentials (AES256/NTLM)',
              IncidentResponseAction: 'Double krbtgt password reset required',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a royal mint where sister vaults regularly synchronize their master gold ledgers over a private courier channel. Wearing a compromised supervisor badge from an ordinary office workstation, an intruder calls the royal mint pretending to be a sister vault, clears the special ledger-sync checkpoint, and receives a freshly packaged copy of every master household seal without ever setting foot inside the vault room.',
      storyMappings: [
        {
          storyTerm: 'Pretending to be a sister vault on the private courier channel',
          technicalTerm: 'MS-DRSR RPC bind to UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 from workstation IP',
          tone: 'amber',
        },
        {
          storyTerm: 'Clearing the special ledger-sync checkpoint',
          technicalTerm: 'Domain Controller Security EventID 4662 logging DS-Replication-Get-Changes-All GUIDs',
          tone: 'sky',
        },
        {
          storyTerm: 'Receiving a freshly packaged copy of every household seal',
          technicalTerm: 'DRS_MSG_GETNCCHANGESREPLY delivering krbtgt AES-256 and NTLM hashes',
          tone: 'rose',
        },
        {
          storyTerm: 'Calling from an ordinary office workstation instead of a real sister vault',
          technicalTerm: 'Non-DC source IP (10.10.4.22) requesting directory replication over RPC',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Dialing straight from a regular employee desk rather than a registered sister vault, the intruder rings the royal mint exclusive directory-sync extension using a hijacked high-clearance pass.',
        storyMappings: [
          {
            storyTerm: 'Regular employee desk dialing the mint',
            technicalTerm: 'Compromised workstation IP (10.10.4.22) authenticating over SMB/RPC (EventID 4624 Type 3)',
            tone: 'amber',
          },
          {
            storyTerm: 'Exclusive directory-sync extension',
            technicalTerm: 'MS-DRSR DRSUAPI interface UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2',
            tone: 'sky',
          },
          {
            storyTerm: 'Hijacked high-clearance pass',
            technicalTerm: 'Compromised account holding Replicating Directory Changes extended rights',
            tone: 'rose',
          },
          {
            storyTerm: 'Royal mint central registrar',
            technicalTerm: 'Target Active Directory Domain Controller CORP-DC01',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When the caller asks to download the secret password ledger, the royal mint security clerk checks two distinct special permission stamps on the caller badge (one permitting directory changes and a second permitting secret fields) and writes an unforgeable receipt in the vault access book.',
        storyMappings: [
          {
            storyTerm: 'Asking to download the secret password ledger',
            technicalTerm: 'Invoking IDL_DRSGetNCChanges (Opnum 3) replication request',
            tone: 'amber',
          },
          {
            storyTerm: 'First permission stamp for directory changes',
            technicalTerm: 'DS-Replication-Get-Changes GUID (1131f6aa-9c07-11d1-f79f-00c04fc2dcd2)',
            tone: 'sky',
          },
          {
            storyTerm: 'Second permission stamp for secret fields',
            technicalTerm: 'DS-Replication-Get-Changes-All GUID (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)',
            tone: 'rose',
          },
          {
            storyTerm: 'Unforgeable receipt in the vault access book',
            technicalTerm: 'Windows Security EventID 4662 (ControlAccess) logged on CORP-DC01',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Satisfied by the permission stamps, the royal mint seals up the master kingdom stamp and every citizen secret seal inside an encrypted courier pouch and ships them straight back to the intruder desk.',
        storyMappings: [
          {
            storyTerm: 'Encrypted courier pouch shipped back',
            technicalTerm: 'DRS_MSG_GETNCCHANGESREPLY encrypted with the RPC session key',
            tone: 'amber',
          },
          {
            storyTerm: 'Master kingdom stamp inside the pouch',
            technicalTerm: 'krbtgt account AES-256 and NTLM hashes enabling Golden Ticket forgery',
            tone: 'sky',
          },
          {
            storyTerm: 'Additional citizen secret seals',
            technicalTerm: 'Replicated SupplementalCredentials and unicodePwd password hashes',
            tone: 'rose',
          },
          {
            storyTerm: 'No physical files ever touched on the vault floor',
            technicalTerm: 'Pure network-level memory extraction avoiding ntds.dit disk access',
            tone: 'emerald',
          },
        ],
      },
    },
  };
