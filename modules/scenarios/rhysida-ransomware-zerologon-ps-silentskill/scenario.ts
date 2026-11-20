import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'rhysida-ransomware-zerologon-ps-silentskill',
    title: 'Rhysida Ransomware SilentKill PowerShell Preparation, PortStarter & LibTomCrypt AES-CTR (AA23-319A)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Rhysida ransomware operators (overlapping Vice Society / DEV-0832) deploy the PortStarter Golang firewall-opening backdoor, execute the SilentKill PowerShell script (g.ps1) to terminate 200+ AV/backup services and modify RDP registry keys, and run the LibTomCrypt-based Rhysida encryptor (AES-256-CTR + RSA-4096).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rhysida Affiliate (Vice Society Nexus)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'PortStarter Go Backdoor (Firewall Rule)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'SilentKill PowerShell Script (g.ps1)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA23-319A / Sekoia XDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'LibTomCrypt AES-256-CTR (.rhysida)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: PortStarter Golang Backdoor & Windows Firewall Rule Tampering',
        narration:
          'Following initial VPN/Phishing access, the operator deploys PortStarter—a custom Golang backdoor shared with Vice Society that registers as a Windows service, adds an inbound Windows Firewall rule (`netsh advfirewall firewall add rule`), and listens on a high TCP port for mTLS C2 commands.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Persistence & Defense Evasion (T1562.004 - Disable or Modify System Firewall)',
        technicalCommands: [
          'sc.exe create WinDefendUpdate binPath= "C:\\ProgramData\\portstarter.exe"',
          'netsh advfirewall firewall add rule name="Windows Update Service" dir=in action=allow protocol=TCP localport=49155',
        ],
        defenseMitigation:
          'Monitor Windows Firewall EventID 2004 (rule added) and Sysmon EventID 1 invocations of `netsh advfirewall firewall add rule` opening inbound TCP ports on internal hosts.',
        logs: [
          {
            id: 'rhy-1',
            timestamp: '02:09:14.330',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'netsh.exe',
            CommandLine: 'netsh advfirewall firewall add rule name="Windows Update Service" dir=in action=allow protocol=TCP localport=49155',
            raw: 'EventID: 1 | ParentImage: C:\\ProgramData\\portstarter.exe (Go Binary) | Image: C:\\Windows\\System32\\netsh.exe | CommandLine: netsh advfirewall firewall add rule ... localport=49155 | Note: Vice Society / Rhysida PortStarter implant',
            parsedFields: {
              ImplantName: 'PortStarter (Golang Firewall Backdoor)',
              FirewallCommand: 'netsh advfirewall firewall add rule ... localport=49155',
              AdvisoryId: 'CISA AA23-319A',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: SilentKill PowerShell Script (g.ps1) Disabling 200+ Services & Unhooking AMSI',
        narration:
          'Prior to encryption, the operator runs SilentKill (g.ps1)—a comprehensive PowerShell preparation script that patches AmsiScanBuffer in memory, stops over 200 hardcoded antivirus, SQL, Exchange, and backup services, deletes shadow copies, and enables RestrictedAdmin RDP.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion & Service Stop (T1562.001 / T1489)',
        technicalCommands: [
          'powershell.exe -ExecutionPolicy Bypass -File C:\\Users\\Public\\g.ps1 (SilentKill)',
          'Stop-Service -Name "Veeam*","SQL*","Sophos*","SepMasterService" -Force; reg add "HKLM\\System\\CurrentControlSet\\Control\\Lsa" /v DisableRestrictedAdmin /t REG_DWORD /d 0 /f',
        ],
        defenseMitigation:
          'Enforce PowerShell Constrained Language Mode (CLM) and ScriptBlock Logging (EventID 4104) to detect bulk `Stop-Service` loops and `DisableRestrictedAdmin` registry modifications.',
        logs: [
          {
            id: 'rhy-2',
            timestamp: '02:18:45.102',
            source: 'EDR',
            severity: 'critical',
            EventCode: 4104,
            ProcessName: 'powershell.exe',
            raw: 'PowerShell ScriptBlock Alert (EventID 4104) | Script: C:\\Users\\Public\\g.ps1 (SilentKill) | Actions: Patched amsi.dll, executed Stop-Service across 214 AV/DB/Backup services, enabled RDP RestrictedAdmin',
            parsedFields: {
              PreparationScript: 'SilentKill (g.ps1)',
              StoppedServicesCount: '214 AV, Database, and Backup Services',
              RegistryModified: 'HKLM\\...\\Lsa\\DisableRestrictedAdmin = 0',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Multi-Threaded LibTomCrypt AES-256-CTR Encryption & Desktop Wallpaper Lock (.rhysida)',
        narration:
          'Distributed across the domain via PsExec (`-d -s cmd.exe`), the 64-bit MinGW-compiled Rhysida binary uses the statically linked LibTomCrypt library to encrypt files with AES-256-CTR and a 4096-bit RSA public key, appending .rhysida, dropping CriticalBreachDetected.pdf, and changing the desktop wallpaper.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1491.001 - Internal Defacement)',
        technicalCommands: [
          'psexec.exe \\\\* -u CORP\\admin -p <pass> -d -s cmd.exe /c "C:\\Windows\\Temp\\rhysida.exe -d C:\\"',
          'LibTomCrypt AES-256-CTR + RSA-4096 -> Appends .rhysida & drops CriticalBreachDetected.pdf',
        ],
        defenseMitigation:
          'Block `PsExec` (`PSEXESVC`) execution via Windows Firewall and Endpoint ASR rules, and monitor for binaries statically linking `LibTomCrypt` strings (`ctr_start`, `aes_setup`, `rsa_import`).',
        logs: [
          {
            id: 'rhy-3',
            timestamp: '02:25:19.770',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'rhysida.exe',
            raw: 'EventID: 11 | Image: C:\\Windows\\Temp\\rhysida.exe (MinGW C++ / LibTomCrypt) | TargetFilename: C:\\Users\\Admin\\Desktop\\CriticalBreachDetected.pdf | Cipher: AES-256-CTR + RSA-4096 | Extension: .rhysida',
            parsedFields: {
              CryptoLibrary: 'LibTomCrypt v1.18.2 (AES-256-CTR + RSA-4096)',
              RansomNotePdf: 'CriticalBreachDetected.pdf',
              AppendedExtension: '.rhysida',
            },
          },
        ],
        packets: [],
      },
    ],
  };
