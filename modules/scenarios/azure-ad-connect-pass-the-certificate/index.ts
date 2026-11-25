import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'azure-ad-connect-pass-the-certificate',
  code: 'T1556.007',
  name: 'SpecterOps, Mandiant & Microsoft — Entra Connect (Azure AD Connect) MSOL_ DKM Decryption & Seamless SSO Silver Ticket',
  shortSubtitle: 'SpecterOps · Dirk-jan Mollema · Mandiant · LocalDB mms_management_agent · DPAPI cryptKeySet & AZUREADSSOACC$',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Documented by SpecterOps, Dirk-jan Mollema (_dirkjan / AADInternals), and Mandiant, Microsoft Entra Connect (formerly Azure AD Connect) bridges on-premises Active Directory with cloud Entra ID. Because the synchronization engine stores high-privilege on-premises connector credentials (MSOL_<hex>) and cloud sync credentials inside a local SQL Express LocalDB database (ADSync.mdf -> mms_management_agent) encrypted with a DPAPI-protected keyset (cryptKeySet), an attacker who compromises the Tier-0 Entra Connect server can decrypt the MSOL_ account password (which frequently holds Replicating Directory Changes All / DCSync rights) and extract the AZUREADSSOACC$ computer account hash to forge Seamless SSO Kerberos tickets for any synced cloud user.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'SpecterOps & Dirk-jan Mollema Research · Mandiant Hybrid Identity Playbook · Microsoft Tier-0 Guidance',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1003 (ADSync LocalDB Credential Dump) · T1003.006 (MSOL_ DCSync) · T1558.002 (AZUREADSSOACC$ Silver Ticket)',
    },
    {
      term: 'DATABASE ARTIFACTS',
      value: 'C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf (mms_management_agent & mms_server_configuration)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'Sysmon EventID 1/10 (ADSync.mdf / mcrypt.dll access) & Windows EventID 4662 (DS-Replication-Get-Changes-All)',
    },
  ],
  nodes: [
    {
      id: 'hybrid_pivot_operator',
      label: 'On-Prem Foothold Operator',
      sublabel: '10.10.4.22 (Local Admin on Sync Server)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Compromised Internal Admin Session',
        pidOrPort: 'PowerShell / adconnectdump.py / AADInternals',
        privilege: 'Local Administrator on AADConnect Server',
        artifacts: [
          'Invoke-AADIntAzureADConnectCredentials / adconnectdump.exe',
          'SqlLocalDB.exe info ADSync',
        ],
        description:
          'Attacker who pivoted to the Entra Connect server after treating it as a standard Tier-1 utility server rather than Tier-0.',
      },
    },
    {
      id: 'entra_connect_sync_srv',
      label: 'Entra Connect Server (ADSYNC)',
      sublabel: '10.10.0.18 (CORP-AADC01.corp.local)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 (Microsoft Azure AD Sync Service)',
        pidOrPort: 'PID 3312 (miiserver.exe / sqlservr.exe LocalDB)',
        privilege: 'NT SERVICE\\ADSync',
        artifacts: [
          'C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf',
          'SELECT private_configuration_xml, encrypted_configuration FROM mms_management_agent',
        ],
        description:
          'Hybrid identity synchronization appliance running miiserver.exe and SQL Server Express LocalDB under NT SERVICE\\ADSync.',
      },
    },
    {
      id: 'dpapi_mcrypt_decryptor',
      label: 'DPAPI & mcrypt.dll Keyset Engine',
      sublabel: 'KeyManager.GetActiveCredentialKey()',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'In-Memory .NET Reflection on mcrypt.dll',
        pidOrPort: 'PID 5890 (powershell.exe reflecting Microsoft.DirectoryServices.MetadirectoryServices.Cryptography.dll)',
        privilege: 'Impersonated NT SERVICE\\ADSync DPAPI Context',
        artifacts: [
          'Registry: HKLM\\SOFTWARE\\Microsoft\\Ad Sync\\Shared\\<instance_id>',
          'Decrypted Plaintext Account: CORP\\MSOL_9a8b7c6d5e4f',
        ],
        description:
          'Loads mcrypt.dll inside the ADSync service context to unprotect the DPAPI master key and AES-decrypt mms_management_agent credentials.',
      },
    },
    {
      id: 'tier0_dc_and_entra_cloud',
      label: 'Domain Controller & Entra ID SSO',
      sublabel: 'CORP-DC01 (:389) & login.microsoftonline.com',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'On-Premises Domain Controller & Cloud Entra ID Tenant',
        pidOrPort: 'MS-DRSR DCSync & AZUREADSSOACC$ Seamless SSO',
        privilege: 'Enterprise Admin + Cloud Global Admin Equivalent',
        artifacts: [
          'MSOL_9a8b7c6d5e4f executing DRSGetNCChanges (DCSync)',
          'AZUREADSSOACC$ NTLM/AES256 hash forging Kerberos cloud tickets',
        ],
        description:
          'Attacker uses MSOL_9a8b7c6d5e4f to DCSync the on-premises domain including AZUREADSSOACC$, then forges Seamless SSO tickets into Entra ID.',
      },
    },
    {
      id: 'mdi_and_sentinel_hybrid_siem',
      label: 'Defender for Identity & Sentinel SIEM',
      sublabel: 'EventID 4662 + Entra Seamless SSO Audit',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Microsoft Defender for Identity (MDI) & Sentinel',
        pidOrPort: 'EventID 4662 (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)',
        privilege: 'Hybrid Identity SOC Monitoring',
        artifacts: [
          'EventID 4662: MSOL_ account invoking Replicating Directory Changes from non-AADC IP',
          'Sysmon EventID 7: Non-miiserver.exe process loading mcrypt.dll',
        ],
        description:
          'Monitors mcrypt.dll loads on CORP-AADC01 and alerts when the MSOL_ connector account initiates DCSync from an unexpected host.',
      },
    },
  ],
  processTree: [
    {
      pid: 3312,
      ppid: 712,
      name: 'miiserver.exe (Entra Connect Sync)',
      commandLine: '"C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\miiserver.exe"',
      user: 'NT SERVICE\\ADSync',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['CryptUnprotectData()', 'SqlConnection.Open("np:\\\\.\\pipe\\LOCALDB#...\\tsql\\query")'],
    },
    {
      pid: 5890,
      ppid: 4120,
      name: 'powershell.exe (ADConnect Dump)',
      commandLine: 'powershell.exe -ep bypass -c "Import-Module AADInternals; Get-AADIntSyncCredentials"',
      user: 'NT SERVICE\\ADSync',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'Assembly.LoadFile("...\\Bin\\mcrypt.dll")',
        'KeyManager.LoadKeySet()',
        'KeyManager.GetActiveCredentialKey().DecryptBase64ToString()',
      ],
      memoryBlocks: [
        {
          address: '0x0000021480910000',
          section: 'CLR Heap (Decrypted XML Configuration Blob)',
          permissions: 'RW-',
          size: '32 KB',
          status: 'injected',
          description: 'Plaintext XML decrypted from mms_management_agent containing MSOL_9a8b7c6d5e4f password.',
          hexPreview: '3C 61 74 74 72 69 62 75 74 65 3E 4D 53 4F 4C 5F (<attribute>MSOL_9a8b7c6d5e4f</attribute>)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'QUERYING ADSYNC LOCALDB (MMS_MANAGEMENT_AGENT) BLOBS',
      subtitle: 'Connecting to SQL LocalDB pipe as NT SERVICE\\ADSync to read encrypted connector XML',
      description:
        'After gaining local administrator access on the Entra Connect server (CORP-AADC01), the attacker impersonates the NT SERVICE\\ADSync service account, connects to the ADSync SQL Express LocalDB named pipe, and extracts instance_id, keyset_id, entropy, and encrypted_configuration from mms_server_configuration and mms_management_agent.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003',
      mitreTechniqueName: 'OS Credential Dumping (ADSync LocalDB)',
      activeNodeIds: ['hybrid_pivot_operator', 'entra_connect_sync_srv', 'mdi_and_sentinel_hybrid_siem'],
      compromisedNodeIds: ['entra_connect_sync_srv'],
      keySpecs: [
        { term: 'DATABASE FILE', value: 'C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf' },
        { term: 'SQL TABLES', value: 'mms_server_configuration & mms_management_agent' },
        { term: 'SERVICE CONTEXT', value: 'NT SERVICE\\ADSync (Required for LocalDB & DPAPI)' },
      ],
    },
    {
      index: 2,
      title: 'DPAPI & MCRYPT.DLL DECRYPTION OF MSOL_ CONNECTOR PASSWORD',
      subtitle: 'Reflecting KeyManager in mcrypt.dll to decrypt the on-prem MSOL_9a8b7c6d5e4f password',
      description:
        'The attacker loads Entra Connect’s own cryptography library (Bin\\mcrypt.dll) into PowerShell, invokes KeyManager.LoadKeySet() using the DPAPI-protected registry key at HKLM\\SOFTWARE\\Microsoft\\Ad Sync\\Shared, and calls DecryptBase64ToString() on encrypted_configuration to recover the plaintext password of CORP\\MSOL_9a8b7c6d5e4f.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.001',
      mitreTechniqueName: 'Unsecured Credentials: Credentials In Files / Registry',
      activeNodeIds: ['entra_connect_sync_srv', 'dpapi_mcrypt_decryptor', 'mdi_and_sentinel_hybrid_siem'],
      compromisedNodeIds: ['entra_connect_sync_srv', 'dpapi_mcrypt_decryptor'],
      keySpecs: [
        { term: 'CRYPTO ASSEMBLY', value: 'Microsoft.DirectoryServices.MetadirectoryServices.Cryptography.dll (mcrypt.dll)' },
        { term: 'RECOVERED ACCOUNT', value: 'CORP\\MSOL_9a8b7c6d5e4f (AD DS Connector Account)' },
        { term: 'SYSMON INDICATOR', value: 'EventID 7: powershell.exe loading mcrypt.dll' },
      ],
    },
    {
      index: 3,
      title: 'MSOL_ DCSYNC & AZUREADSSOACC$ SEAMLESS SSO CLOUD PIVOT',
      subtitle: 'Using MSOL_ to DCSync AZUREADSSOACC$ and forge Kerberos Silver Tickets into Entra ID',
      description:
        'When Password Hash Sync is enabled, the MSOL_9a8b7c6d5e4f account holds DS-Replication-Get-Changes-All on the domain root. The attacker uses MSOL_ to DCSync the AZUREADSSOACC$ computer account hash and forges a Kerberos Silver Ticket for any synchronized hybrid administrator to authenticate to login.microsoftonline.com via Seamless SSO.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1556.007',
      mitreTechniqueName: 'Modify Authentication Process: Hybrid Identity (Seamless SSO)',
      activeNodeIds: ['dpapi_mcrypt_decryptor', 'tier0_dc_and_entra_cloud', 'mdi_and_sentinel_hybrid_siem'],
      compromisedNodeIds: ['entra_connect_sync_srv', 'dpapi_mcrypt_decryptor', 'tier0_dc_and_entra_cloud'],
      keySpecs: [
        { term: 'ON-PREM PRIVILEGE', value: 'DS-Replication-Get-Changes-All (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)' },
        { term: 'CLOUD SSO BRIDGE', value: 'AZUREADSSOACC$ Computer Account Kerberos Key' },
        { term: 'DEFENSIVE FIX', value: 'Treat Entra Connect as Tier-0, Rotate AZUREADSSOACC$ Key Every 30 Days' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'aadc-1',
      no: 1,
      stageIndex: 1,
      timestamp: '16:20:04.112',
      sourceNodeId: 'hybrid_pivot_operator',
      targetNodeId: 'entra_connect_sync_srv',
      sourceLabel: 'Foothold Operator',
      targetLabel: 'Entra Connect (CORP-AADC01)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'SQLLOCALDB_PIPE_ENUM',
      info: 'Image=SqlLocalDB.exe CommandLine="SqlLocalDB.exe info ADSync" User="NT SERVICE\\ADSync"',
      sizeOrCode: 'PID 5812',
      severity: 'HIGH',
      mitreId: 'T1003',
      explanation: 'Attacker enumerates the ADSync LocalDB named pipe under the NT SERVICE\\ADSync account to read mms_management_agent.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event"><System><EventID>1</EventID><Computer>CORP-AADC01.corp.local</Computer></System><EventData><Data Name="Image">C:\\Program Files\\Microsoft SQL Server\\150\\Tools\\Binn\\SqlLocalDB.exe</Data><Data Name="CommandLine">SqlLocalDB.exe info ADSync</Data><Data Name="User">NT SERVICE\\ADSync</Data></EventData></Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Suspicious Access to Azure AD Connect LocalDB Instance',
        ruleCode: `title: Azure AD Connect ADSync LocalDB Enumeration
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith: '\\SqlLocalDB.exe'
    CommandLine|contains: 'ADSync'
  condition: selection`,
        mitigation: 'Isolate Entra Connect servers as Tier-0 assets with zero non-Tier-0 local administrators.',
      },
    },
    {
      id: 'aadc-2',
      no: 2,
      stageIndex: 2,
      timestamp: '16:20:09.540',
      sourceNodeId: 'entra_connect_sync_srv',
      targetNodeId: 'dpapi_mcrypt_decryptor',
      sourceLabel: 'CORP-AADC01',
      targetLabel: 'mcrypt.dll Decryptor',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7 (ImageLoad)',
      shortAction: 'MCRYPT_DLL_LOADED_BY_PS',
      info: 'Image=powershell.exe ImageLoaded="C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll"',
      sizeOrCode: 'Signed: Microsoft',
      severity: 'CRITICAL',
      mitreId: 'T1552.001',
      explanation: 'Non-standard process (powershell.exe instead of miiserver.exe) loads mcrypt.dll to decrypt the MSOL_ connector password.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event"><System><EventID>7</EventID><Computer>CORP-AADC01.corp.local</Computer></System><EventData><Data Name="Image">C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe</Data><Data Name="ImageLoaded">C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll</Data><Data Name="Signed">true</Data></EventData></Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Entra Connect mcrypt.dll Loaded by Non-Sync Process (ADConnectDump / AADInternals)',
        ruleCode: `title: Azure AD Connect Cryptography DLL Loaded by Uncommon Process
logsource:
  category: image_load
  product: windows
detection:
  selection:
    ImageLoaded|endswith: '\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll'
  filter:
    Image|endswith: '\\miiserver.exe'
  condition: selection and not filter`,
        mitigation: 'Alert immediately if any process other than miiserver.exe loads mcrypt.dll or reads HKLM\\SOFTWARE\\Microsoft\\Ad Sync\\Shared.',
      },
    },
    {
      id: 'aadc-3',
      no: 3,
      stageIndex: 3,
      timestamp: '16:22:31.809',
      sourceNodeId: 'dpapi_mcrypt_decryptor',
      targetNodeId: 'tier0_dc_and_entra_cloud',
      sourceLabel: 'Decrypted MSOL_ Account',
      targetLabel: 'CORP-DC01 & Entra SSO',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'WinSec EID 4662 (DCSync)',
      shortAction: 'MSOL_DCSYNC_AZUREADSSOACC',
      info: 'SubjectUserName=MSOL_9a8b7c6d5e4f Properties={1131f6ad-9c07-11d1-f79f-00c04fc2dcd2} SourceIP=10.10.4.22',
      sizeOrCode: 'AccessMask 0x100',
      severity: 'CRITICAL',
      mitreId: 'T1556.007',
      explanation: 'The stolen MSOL_ connector account executes DCSync from an unauthorized workstation IP to dump AZUREADSSOACC$ and forge Seamless SSO tickets.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event"><System><EventID>4662</EventID><Computer>CORP-DC01.corp.local</Computer></System><EventData><Data Name="SubjectUserName">MSOL_9a8b7c6d5e4f</Data><Data Name="ObjectName">%{19195a5b-6da0-11d0-afd3-00c04fd930c9}</Data><Data Name="Properties">%%7688 {1131f6aa-9c07-11d1-f79f-00c04fc2dcd2} {1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}</Data><Data Name="AccessMask">0x100</Data></EventData></Event>`,
      detectionRule: {
        type: 'KQL',
        title: 'MSOL_ Connector Account Performing DCSync From Non-Entra-Connect Host',
        ruleCode: `SecurityEvent | where EventID == 4662 and SubjectUserName startswith "MSOL_" and Properties has "1131f6ad-9c07-11d1-f79f-00c04fc2dcd2"`,
        mitigation: 'Restrict MSOL_ account logon workstations to the Entra Connect server IP and disable Seamless SSO if modern Primary Refresh Tokens (PRT) are used.',
      },
    },
  ],
};
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'azure-ad-connect-pass-the-certificate',
    briefing: {
      headline: 'Scenario Briefing: Microsoft Entra Connect (Azure AD Connect), MSOL_ DKM Decryption, DCSync & Seamless SSO Silver Ticket',
      storyAnalogy:
        'Imagine a translator’s desk (Entra Connect / Azure AD Connect Server) that sits between a company’s local castle (On-Premises Active Directory) and its cloud fortress (Microsoft Entra ID). To keep both sides synchronized, the translator keeps a locked desk drawer (ADSync.mdf -> mms_management_agent LocalDB table) containing the master skeleton key to the local castle (MSOL_<hex> account with DCSync rights), and hangs the key to that drawer (DPAPI cryptKeySet) right under the desk! If an intruder compromises the translator’s server, they reach under the desk, unlock the drawer with the translator’s own magnifying glass (mcrypt.dll), grab the MSOL_ skeleton key to copy every secret in the local castle, including the AZUREADSSOACC$ bridge key, and forge golden passes straight into the cloud fortress.',
      plainSummary:
        'In this scenario (T1556.007, SpecterOps, Mandiant & Microsoft - Entra Connect (Azure AD Connect) MSOL_ DKM Decryption & Seamless SSO Silver Ticket), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: querying the ADSync SQL LocalDB as NT, then loading mcrypt.dll in PowerShell, then executing MSOL_ DCSync. Steps #1–#3 walk that chain end-to-end by covering Querying the ADSync SQL LocalDB as NT, then Loading mcrypt.dll in PowerShell, then Executing MSOL_ DCSync, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (On-Prem Foothold Operator), query ADSync.mdf (mms_management_agent) on Node ②/③ (Entra Connect Server CORP-AADC01), decrypt the MSOL_ password via mcrypt.dll inside Node ④, and execute DCSync + AZUREADSSOACC$ Seamless SSO ticket forgery against Node ⑤ (Domain Controller & Entra ID) monitored by Node ⑥ (Defender for Identity & Sentinel SIEM).',
      documentedAdvisory: 'SpecterOps & Dirk-jan Mollema AADInternals Research · Mandiant Hybrid Identity Guidance · MITRE T1556.007 / T1003.006',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1003',
        plainTitle: 'Querying the ADSync SQL LocalDB (mms_management_agent) as NT SERVICE\\ADSync (T1003)',
        storyAnalogy:
          'First, the attacker steps into the shoes of the NT SERVICE\\ADSync service account on the sync server and opens its private SQL LocalDB ledger (ADSync.mdf) to copy out the encrypted credential rows.',
        simpleExplanation:
          'After obtaining local administrator access on the Entra Connect server (CORP-AADC01), the attacker elevates to NT SERVICE\\ADSync (the service account that owns the local SQL Server Express LocalDB instance and the Windows DPAPI user keyset), connects to the named pipe np:\\\\.\\pipe\\LOCALDB#...\\tsql\\query, and queries SELECT private_configuration_xml, encrypted_configuration FROM mms_management_agent alongside keyset_id, instance_id, and entropy from mms_server_configuration.',
        howItWorksInPractice:
          'Many organizations mistakenly place their Entra Connect server in a standard Tier-1 server OU managed by general server administrators, unaware that local admin on Entra Connect equates to Domain Admin + Cloud Global Admin. In the documented Sysmon EID 1 exchange from On-Prem Foothold Operator to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK PID 5812 (confirming that the SQLLOCALDB_PIPE_ENUM request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 DPAPI & MCRYPT.DLL DECRYPTION OF MSOL_ CONNECTOR PASSWORD).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (Foothold Operator) to Node ②/③ (Entra Connect Server CORP-AADC01), and return arrow ⇠#1 returning the encrypted XML blobs from ADSync.mdf.',
        detectionAndEvidence:
          'Documented by Microsoft & SigmaHQ: Sysmon EventID 1 showing SqlLocalDB.exe info ADSync or non-standard processes opening C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1552.001',
        plainTitle: 'Loading mcrypt.dll in PowerShell to DPAPI-Decrypt the MSOL_<hex> Password (T1552.001)',
        storyAnalogy:
          'Instead of cracking the encryption by brute force, the attacker loads Entra Connect’s own decryption library (mcrypt.dll) in PowerShell and asks it to unlock the MSOL_ password using the server’s local DPAPI key.',
        simpleExplanation:
          'Running as NT SERVICE\\ADSync, the attacker uses PowerShell reflection (or AADInternals / adconnectdump) to load C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll, calls KeyManager.LoadKeySet() (which reads the DPAPI-protected AES key from HKLM\\SOFTWARE\\Microsoft\\Ad Sync\\Shared and unprotects it via CryptUnprotectData), and invokes DecryptBase64ToString() on encrypted_configuration to reveal the plaintext password of the on-premises connector account CORP\\MSOL_9a8b7c6d5e4f.',
        howItWorksInPractice:
          'Because miiserver.exe must decrypt the MSOL_ password unattended whenever the service restarts, the entire decryption chain resides locally on the Entra Connect host. In the documented Sysmon EID 7 (ImageLoad) exchange from Perimeter Firewall & NDR Tap to Entra Connect Server (ADSYNC), Entra Connect Server (ADSYNC) responds with ACK Signed: Microsoft (confirming that the MCRYPT_DLL_LOADED_BY_PS request succeeded on Entra Connect Server (ADSYNC) and establishing the runtime state required for Step #3 MSOL_ DCSYNC & AZUREADSSOACC$ SEAMLESS SSO CLOUD PIVOT).',
        diagramAlignment:
          'On the diagram, arrow #2→ loads mcrypt.dll and unprotects the DPAPI keyset inside Node ④ (DPAPI & mcrypt.dll Decryptor), and ⇠#2 outputs the plaintext MSOL_9a8b7c6d5e4f password.',
        detectionAndEvidence:
          'Documented by SpecterOps & Mandiant: Sysmon EventID 7 (ImageLoad) where mcrypt.dll is loaded by any process other than miiserver.exe (such as powershell.exe). Preserve the raw event fields and the related containment ticket for forensic replay.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1556.007',
        plainTitle: 'Executing MSOL_ DCSync & Forging AZUREADSSOACC$ Seamless SSO Cloud Tickets (T1556.007)',
        storyAnalogy:
          'Because Password Hash Sync is enabled, MSOL_ has permission to copy every password hash in Active Directory (DCSync). The attacker uses MSOL_ to steal the AZUREADSSOACC$ bridge key and mints Kerberos Silver Tickets straight into Microsoft Entra ID!',
        simpleExplanation:
          'Because Password Hash Synchronization (PHS) requires the CORP\\MSOL_9a8b7c6d5e4f account to hold Replicating Directory Changes and Replicating Directory Changes All on the domain root, the attacker uses the decrypted MSOL_ credentials to perform a DCSync attack (MS-DRSR DRSGetNCChanges) against CORP-DC01, dumping the NTLM/AES256 hash of the AZUREADSSOACC$ computer account (the shared Kerberos trust bridge created when Entra Seamless Single Sign-On is enabled, allowing the attacker to forge Kerberos Silver Tickets holding any synchronized user’s immutableId and sid to log directly into Entra ID without knowing their password).',
        howItWorksInPractice:
          'Microsoft recommends treating Entra Connect as a Tier-0 asset, disabling Seamless SSO in favor of Primary Refresh Tokens (PRT), and rotating the AZUREADSSOACC$ Kerberos decryption key every 30 days. In the documented WinSec EID 4662 (DCSync) exchange from Entra Connect Server (ADSYNC) to DPAPI & mcrypt.dll Keyset Engine, DPAPI & mcrypt.dll Keyset Engine responds with ACK AccessMask 0x100 (confirming that the MSOL_DCSYNC_AZUREADSSOACC request succeeded on DPAPI & mcrypt.dll Keyset Engine and completing the final execution objective of SpecterOps, Mandiant & Microsoft, Entra Connect (Azure AD Connect) MSOL_ DKM Decryption & Seamless SSO Silver Ticket).',
        diagramAlignment:
          'On the diagram, arrow #3→ executes DCSync and Seamless SSO ticket forgery against Node ⑤ (Domain Controller & Entra ID) while Node ⑥ (Defender for Identity & Sentinel) alerts on EventID 4662.',
        detectionAndEvidence:
          'Documented by Microsoft Defender for Identity: Windows Security EventID 4662 (DS-Replication-Get-Changes-All GUID 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2) initiated by MSOL_* from a non-Entra-Connect IP.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a courier bridge building connecting an on-premises castle registry to a rooftop cloud headquarters. Inside the bridge cellar sits a locked database holding the courier master password that syncs every castle citizen into the cloud; an intruder breaks into the bridge building, uses the bridge own built-in unscrambling lens to read that courier password aloud, empties the castle ledger, and stamps forged seamless-entry passes straight into the cloud tower.',
      storyMappings: [
        {
          storyTerm: 'Locked cellar database inside the courier bridge building',
          technicalTerm: 'Entra Connect ADSync SQL LocalDB (ADSync.mdf / mms_management_agent table)',
          tone: 'amber',
        },
        {
          storyTerm: 'Bridge own built-in unscrambling lens',
          technicalTerm: 'PowerShell loading mcrypt.dll to DPAPI-decrypt the encrypted MSOL_<hex> password',
          tone: 'sky',
        },
        {
          storyTerm: 'Emptying the castle master ledger with the courier key',
          technicalTerm: 'Executing Active Directory DCSync using the over-privileged MSOL_ service account',
          tone: 'rose',
        },
        {
          storyTerm: 'Stamping forged seamless-entry passes into the cloud tower',
          technicalTerm: 'Extracting AZUREADSSOACC$ Kerberos key to forge Silver Tickets into Microsoft 365',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'After gaining administrator keys on the directory-sync bridge server, the intruder impersonates the local sync clerk to open the cellar database drawer holding the encrypted courier secret and its locked key wrapper.',
        storyMappings: [
          {
            storyTerm: 'Directory-sync bridge server',
            technicalTerm: 'On-premises Microsoft Entra Connect (Azure AD Connect) synchronization host',
            tone: 'amber',
          },
          {
            storyTerm: 'Impersonating the local sync clerk',
            technicalTerm: 'Querying ADSync SQL LocalDB running under NT SERVICE\\ADSync privileges',
            tone: 'sky',
          },
          {
            storyTerm: 'Cellar database drawer holding encrypted secrets',
            technicalTerm: 'ADSync.mdf tables mms_management_agent and mms_server_configuration',
            tone: 'rose',
          },
          {
            storyTerm: 'Watchdog noticing unauthorized cellar entry',
            technicalTerm: 'Sysmon EventID 1 flagging SqlLocalDB.exe info ADSync or odd access to ADSync.mdf',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation recording command lines) showing SqlLocalDB.exe info ADSync or non-ADSync binaries accessing C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf (exposing credential extraction attempts against the hybrid identity bridge).',
      },
      2: {
        storyAnalogy:
          'Rather than breaking the encryption mathematically, the intruder loads the bridge server own official decryption library directly into a script, letting the bridge politely unwrap and hand over the plaintext MSOL master courier password.',
        storyMappings: [
          {
            storyTerm: 'Bridge server own official decryption library',
            technicalTerm: 'Signed Microsoft mcrypt.dll loaded directly inside PowerShell (AADInternals)',
            tone: 'amber',
          },
          {
            storyTerm: 'Politely unwrapping the encrypted wrapper',
            technicalTerm: 'DPAPI decryption of the keyset protecting the MSOL_<hex> connector credential',
            tone: 'sky',
          },
          {
            storyTerm: 'Plaintext master courier password',
            technicalTerm: 'Recovered cleartext password for the on-premises MSOL_<hex> AD sync account',
            tone: 'rose',
          },
          {
            storyTerm: 'Why this key is a crown jewel',
            technicalTerm: 'MSOL_ holds Replicating Directory Changes All rights across the entire AD forest',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Armed with the courier password, the intruder synchronizes every single password hash out of the on-premises castle vault, lifts the cloud seamless-login stamp, and mints forged cloud passes that walk straight into corporate cloud mailboxes without typing a password.',
        storyMappings: [
          {
            storyTerm: 'Synchronizing every hash out of the castle vault',
            technicalTerm: 'Executing DCSync against the Domain Controller using the MSOL_ account',
            tone: 'amber',
          },
          {
            storyTerm: 'Lifting the cloud seamless-login stamp',
            technicalTerm: 'Dumping the AZUREADSSOACC$ computer account Kerberos key via DCSync',
            tone: 'sky',
          },
          {
            storyTerm: 'Minting forged passes walking straight into cloud mailboxes',
            technicalTerm: 'Forging Seamless SSO Kerberos tickets to impersonate any synced Entra ID user',
            tone: 'rose',
          },
          {
            storyTerm: 'Total hybrid on-prem to cloud takeover',
            technicalTerm: 'Compromise of both local Active Directory and federated Microsoft 365 cloud accounts',
            tone: 'emerald',
          },
        ],
      },
    },
  };
