import type { AttackScenario } from '../types';

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
