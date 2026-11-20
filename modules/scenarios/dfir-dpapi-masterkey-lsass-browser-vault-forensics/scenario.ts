import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-dpapi-masterkey-lsass-browser-vault-forensics',
    title: 'Microsoft DPAPI, SpecterOps & Elastic DFIR — DPAPI MasterKey Backup RPC & Browser/Vault Credential Theft (EID 4692 / 4693)',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1555.004',
    description:
      'Grounded in Microsoft Data Protection API (DPAPI) documentation, SpecterOps DPAPI abuse research, and Elastic Security Labs infostealer forensics: an attacker or stealer accesses DPAPI MasterKey files under %APPDATA%\\Microsoft\\Protect\\<SID>\\<GUID>, requests domain MasterKey decryption from the Domain Controller via the MS-BKRP BackupKey RPC protocol (logging Security EventID 4692 / 4693 on the DC), and decrypts Windows Credentials (%LOCALAPPDATA%\\Microsoft\\Credentials) and Chromium Local State AES-GCM keys.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'SharpDPAPI / Stealer Process', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'MS-BKRP RPC (protected_storage)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'MasterKey (%APPDATA%\\Protect)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'DC Security EID 4692 & 4693', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'CORP-DC01 BackupKey Secret', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: DPAPI Blob & Preferred MasterKey GUID Enumeration in %APPDATA%\\Microsoft\\Protect',
        narration:
          'The attacker enumerates encrypted DPAPI credential blobs in %LOCALAPPDATA%\\Microsoft\\Credentials\\ and Chromium "%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Local State" (encrypted_key prefixed with "DPAPI"). Each DPAPI blob header contains a guidMasterKey that maps to a MasterKey file in %APPDATA%\\Microsoft\\Protect\\<SID>\\<GUID>.',
        activeNodes: ['attacker', 'target'],
        mitreTactic: 'Credential Access (T1555.004 - Credentials from Password Stores: Windows Credential Manager)',
        technicalCommands: [
          'SharpDPAPI.exe triage',
          'MasterKey Path: C:\\Users\\admin_ops\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-...\\{84a19c02-5511-4d88-9012-112233445566}',
          'Chromium Key Path: %LOCALAPPDATA%\\Google\\Chrome\\User Data\\Local State (os_crypt.encrypted_key)',
        ],
        defenseMitigation:
          'Monitor non-browser processes accessing %LOCALAPPDATA%\\Google\\Chrome\\User Data\\Local State, Login Data, and %APPDATA%\\Microsoft\\Protect\\<SID>\\* via Sysmon file/handle telemetry or SACLs (EventID 4663).',
        logs: [
          {
            id: 'dfir-dpapi-1',
            timestamp: '14:22:01.105',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 4663,
            ProcessName: 'SharpDPAPI.exe',
            CommandLine: 'SharpDPAPI.exe credentials /unprotect',
            raw: 'EventID: 4663 | SubjectUserName: admin_ops | ObjectName: C:\\Users\\admin_ops\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-3819201-1104\\84a19c02-5511-4d88-9012-112233445566 | ProcessName: C:\\Users\\Public\\SharpDPAPI.exe | AccessMask: 0x1 (ReadData)',
            parsedFields: {
              EventID: '4663 (Object Access on DPAPI Protect Folder)',
              MasterKeyGuid: '{84a19c02-5511-4d88-9012-112233445566}',
              MasterKeyFolder: '%APPDATA%\\Microsoft\\Protect\\<SID>\\',
              ExecutingProcess: 'SharpDPAPI.exe',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Domain Controller MS-BKRP BackupKey RPC Recovery (DC Security EventID 4693)',
        narration:
          'For domain users, every MasterKey file contains a Domain Backup MasterKey encrypted with the Active Directory Domain Controller public key (G$BCKUPKEY_PREFERRED). Using either the user session via MS-BKRP (BackuprKey RPC over \\pipe\\protected_storage) or a stolen Domain Backup PFX key, the attacker decrypts the MasterKey, triggering Windows Security EventID 4693 (Recovery of data protection master key was attempted) on CORP-DC01.',
        activeNodes: ['attacker', 'firewall', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1555.004 - MS-BKRP BackupKey RPC & EventID 4693)',
        technicalCommands: [
          'RPC Interface: MS-BKRP (3dde7c30-165d-11d1-ab8f-00805f14db40) over \\pipe\\protected_storage',
          'DC Security EventID 4693: Recovery of data protection master key was attempted (MasterKeyId={84a19c02-...})',
          'mimikatz lsadump::backupkeys /system:CORP-DC01.corp.local /export',
        ],
        defenseMitigation:
          'Enable Audit DPAPI Activity on Domain Controllers and workstations to log Security EventID 4692 (Backup of master key) and EventID 4693 (Recovery of master key), and alert on bulk MasterKey recovery bursts.',
        logs: [
          {
            id: 'dfir-dpapi-2',
            timestamp: '14:22:02.410',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4693,
            ProcessName: 'lsass.exe',
            CommandLine: 'MS-BKRP BackuprKey MasterKey recovery on CORP-DC01',
            raw: 'EventID: 4693 | Computer: CORP-DC01.corp.local | SubjectUserName: admin_ops | MasterKeyId: 84a19c02-5511-4d88-9012-112233445566 | RecoveryServer: CORP-DC01.corp.local | RecoveryReason: 0x5c0000 | Status: 0x0',
            parsedFields: {
              EventID: '4693 (DPAPI MasterKey Recovery Attempted)',
              RpcProtocol: 'MS-BKRP (\\pipe\\protected_storage)',
              MasterKeyId: '84a19c02-5511-4d88-9012-112233445566',
              DomainSecretObject: 'G$BCKUPKEY_PREFERRED (LSA Secret)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Offline Decryption of Windows Vault (.vcrd) & Chromium Login Data / Cookies SQLite Databases',
        narration:
          'Armed with the plaintext 64-byte SHA-1 DPAPI MasterKey, the attacker calls CryptUnprotectData (or offline dpapick3 / SharpDPAPI) to unwrap the AES-256-GCM key in Chrome/Edge Local State and decrypts all saved passwords and session cookies from Login Data and Network\\Cookies SQLite databases.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1555.003 - Credentials from Web Browsers & Windows Vault)',
        technicalCommands: [
          'SharpDPAPI.exe logins /mkfile:masterkeys.txt',
          'Decrypted Target 1: %LOCALAPPDATA%\\Microsoft\\Vault\\{4BF4C442-9B8A-41A0-B380-DD4A704DDB28}\\*.vcrd',
          'Decrypted Target 2: %LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data (v10 AES-256-GCM)',
        ],
        defenseMitigation:
          'Enforce hardware-bound App-Bound Encryption (Chrome v127+ v20 elevation service protection) and disable browser password saving via enterprise GPO.',
        logs: [
          {
            id: 'dfir-dpapi-3',
            timestamp: '14:22:04.880',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4663,
            ProcessName: 'SharpDPAPI.exe',
            CommandLine: 'SharpDPAPI.exe decrypting Chrome Login Data & Windows Vault .vcrd blobs',
            raw: 'EventID: 4663 | SubjectUserName: admin_ops | ObjectName: C:\\Users\\admin_ops\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Login Data | ProcessName: C:\\Users\\Public\\SharpDPAPI.exe | DecryptedItems: 42 Vault/Browser Credentials',
            parsedFields: {
              EventID: '4663 (File Object Read)',
              TargetedStores: 'Windows Vault (.vcrd) + Chrome Login Data & Cookies',
              EncryptionScheme: 'DPAPI MasterKey -> AES-256-GCM (v10 prefix)',
            },
          },
        ],
      },
    ],
  };
