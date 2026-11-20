import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'qilin-agenda-rust-chrome-cred-harvester-esxi',
    title: 'Sophos X-Ops, Trend Micro & Group-IB — Qilin (Agenda) Ransomware: GPO PowerShell Chrome Credential Harvester, SafeBoot & Rust/Go Multi-Platform Encryption',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in Sophos X-Ops, Trend Micro, and Group-IB threat intelligence on Qilin (Agenda) ransomware: affiliates link a malicious Group Policy logon script (`IPScanner.ps1` / `logon.ps1`) across Active Directory so every user workstation automatically decrypts and dumps saved Chrome/Edge credentials (`Login Data`) to a central SMB share before deploying the Rust/Golang Qilin encryptor across Windows and VMware ESXi.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Qilin / Agenda Affiliate Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'AD GPO Logon Script (Chrome Login Data Stealer)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Domain Workstations & Servers (qilin.exe)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Sophos X-Ops / AD EventID 5136 & Sysmon Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Windows Shares & ESXi Datastores (.qilin)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Active Directory GPO Logon Script Harvesting Chrome/Edge DPAPI Credentials',
        narration:
          'After compromising a Domain Controller, Qilin affiliates create a Group Policy Object linking a PowerShell logon script (`\\\\corp.local\\SYSVOL\\corp.local\\scripts\\logon.ps1`). Whenever any domain user logs in, the script copies `%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data` and `Local State`, decrypts the AES-GCM master key via `ProtectedData::Unprotect` under the user’s own session context, and writes the cleartext credentials to a staging share.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access (T1555.003 - Credentials from Web Browsers / T1484.001)',
        technicalCommands: [
          'GPO Logon Script: powershell.exe -ExecutionPolicy Bypass -File \\\\corp.local\\SYSVOL\\corp.local\\scripts\\logon.ps1',
          '[System.Security.Cryptography.ProtectedData]::Unprotect($encryptedKey, $null, \'CurrentUser\') -> Dump Chrome Login Data SQLite to \\\\DC01\\Temp$\\creds.txt',
        ],
        defenseMitigation:
          'Monitor Active Directory EventID 5136 for `gPCMachineExtensionNames` / `gPCUserExtensionNames` script modifications and PowerShell ScriptBlock EventID 4104 accessing `Google\\Chrome\\User Data\\Local State`.',
        logs: [
          {
            id: 'qilin-1',
            timestamp: '05:03:19.440',
            source: 'PowerShell',
            severity: 'critical',
            EventCode: 4104,
            ProcessName: 'powershell.exe',
            raw: 'EventID: 4104 | ScriptBlockText: Copy-Item "$env:LOCALAPPDATA\\Google\\Chrome\\User Data\\Default\\Login Data" ... [System.Security.Cryptography.ProtectedData]::Unprotect(...) | OutputShare: \\\\DC01\\Temp$\\creds.txt',
            parsedFields: {
              Technique: 'GPO-Driven Mass Browser Credential Harvesting (Sophos X-Ops)',
              TargetArtifacts: 'Chrome/Edge Login Data SQLite + Local State DPAPI Key',
              MitreId: 'T1555.003 (Credentials from Web Browsers)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Credential-Authenticated Share Mounting (`-d`), Service Termination & VSS Wipe',
        narration:
          'Using the harvested domain and vCenter/ESXi credentials, the operator invokes the Rust-compiled Qilin binary with `-d DOMAIN\\Admin:Password` (which calls `WNetAddConnection2W` to automatically authenticate and mount inaccessible remote shares), stops 60+ backup and database services (`veeam`, `sql`, `msexchange`), and deletes Volume Shadow Copies.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Lateral Movement & Defense Evasion (T1021.002 / T1489 / T1490)',
        technicalCommands: [
          'qilin_rust.exe -d "CORP\\svc_backup:P@ssw0rd2026!" -p "\\\\10.10.0.0/16"',
          'net.exe stop VeeamBackupSvc /y && vssadmin.exe delete shadows /all /quiet',
        ],
        defenseMitigation:
          'Disable password saving in enterprise browsers for privileged accounts via Group Policy (`PasswordManagerEnabled = 0`) and monitor rapid `WNetAddConnection2W` SMB logons (EventID 4624 Type 3).',
        logs: [
          {
            id: 'qilin-2',
            timestamp: '05:08:42.815',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'qilin_rust.exe',
            CommandLine: 'C:\\Windows\\Temp\\qilin_rust.exe -d CORP\\svc_backup:*** --safeboot',
            raw: 'EventID: 1 | Image: C:\\Windows\\Temp\\qilin_rust.exe | Language: Rust (Qilin / Agenda v2) | Action: WNetAddConnection2W auto-mount + 64 Services Stopped + VSS Deleted',
            parsedFields: {
              AutoMountSwitch: '-d DOMAIN\\User:Password (WNetAddConnection2W)',
              TerminatedServices: 'VeeamBackupSvc, MSSQLSERVER, MSExchangeIS, Sophos',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Simultaneous Windows & ESXi Hypervisor ChaCha20 / AES-256-GCM Encryption (`.qilin`)',
        narration:
          'Qilin executes its configurable per-affiliate encryption profile (supporting ChaCha20 or AES-256-GCM with RSA-4096 key wrapping and configurable skip-step intermittent modes) across both Windows servers and VMware ESXi datastores (`/vmfs/volumes`), appending the custom `.qilin` extension and writing `[extension]-README-RECOVER.txt`.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          './qilin_esxi --path /vmfs/volumes --kill-vms (Terminates ESXi VMX worlds & encrypts .vmdk/.vmx)',
          'qilin_rust.exe -> Encrypts Windows shares with ChaCha20 + RSA-4096 -> *.qilin & QILIN-README-RECOVER.txt',
        ],
        defenseMitigation:
          'Enforce hardware-backed FIDO2 MFA on vCenter/ESXi, disable ESXi SSH (`TSM-SSH`) by default, and isolate backup repositories from Active Directory.',
        logs: [
          {
            id: 'qilin-3',
            timestamp: '05:14:10.305',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'qilin_rust.exe',
            raw: 'EventID: 11 | Image: C:\\Windows\\Temp\\qilin_rust.exe | TargetFilename: \\\\corp-fs01\\data\\QILIN-README-RECOVER.txt | Cipher: ChaCha20 / AES-256 + RSA-4096 | ESXiTarget: /vmfs/volumes/*.vmdk',
            parsedFields: {
              RansomwareFamily: 'Qilin (Agenda Ransomware-as-a-Service)',
              CrossPlatformTargets: 'Windows x64 + VMware ESXi ELF64',
              RansomNote: 'QILIN-README-RECOVER.txt',
            },
          },
        ],
        packets: [],
      },
    ],
  };
