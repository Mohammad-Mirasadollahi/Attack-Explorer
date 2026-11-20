import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'cl0p-truebot-flawedgrace-sdbbot-ransomware',
    title: 'CISA AA23-158A, Microsoft & Mandiant — CL0P (TA505 / FIN11) Ransomware: TrueBot Loader, FlawedGrace RAT, SDBbot & Signed Binary Mass Share Encryption (.CIop)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in CISA/FBI Joint Cybersecurity Advisory AA23-158A (#StopRansomware: CL0P Ransomware Gang), Microsoft Threat Intelligence (Lace Tempest), and Mandiant FIN11 research: CL0P operators deploy TrueBot (Silence.Downloader) and FlawedGrace RAT, pivot laterally with Cobalt Strike and SDBbot, terminate over 600 Windows processes and services, and execute a digitally signed CL0P ransomware binary (`.CIop` / `ClopReadMe.txt`).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'CL0P / TA505 / FIN11 Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'TrueBot (Silence.Downloader) & FlawedGrace RAT', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'AD Staging Server (Cobalt Strike + SDBbot)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CISA AA23-158A / Microsoft Defender XDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Enterprise File Servers (.CIop / ClopReadMe.txt)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: TrueBot (`Silence.Downloader`) Execution & FlawedGrace / SDBbot RAT Deployment',
        narration:
          'Following initial access via spearphishing or MFT/web zero-days, CL0P operators execute `TrueBot` (tracked by CISA AA23-158A as `Silence.Downloader`) via `rundll32.exe` or a signed loader. TrueBot collects Active Directory domain controller details (`ipconfig /all`, `net view /all /domain`) and downloads the `FlawedGrace` full-featured C++ RAT and `SDBbot`.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Execution & Command and Control (T1218.011 / T1105 - Ingress Tool Transfer)',
        technicalCommands: [
          'rundll32.exe C:\\ProgramData\\truebot.dll,RunMain (TrueBot / Silence.Downloader C2 check-in)',
          'svchost.exe (Injected FlawedGrace RAT over custom binary TCP port 443 protocol & SDBbot installer)',
        ],
        defenseMitigation:
          'Detect TrueBot (`Silence.Downloader`) C2 beacon patterns and alert on `rundll32.exe` loading unsigned DLLs from `C:\\ProgramData` that immediately spawn `net.exe view /domain`.',
        logs: [
          {
            id: 'cl0p-rw-1',
            timestamp: '10:02:18.410',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'rundll32.exe',
            CommandLine: 'rundll32.exe C:\\ProgramData\\truebot.dll,RunMain',
            raw: 'EventID: 1 | Image: C:\\Windows\\System32\\rundll32.exe | CommandLine: rundll32.exe C:\\ProgramData\\truebot.dll,RunMain | Stage2Payloads: FlawedGrace RAT & SDBbot | ThreatActor: TA505 / FIN11 / Lace Tempest (CISA AA23-158A)',
            parsedFields: {
              InitialLoader: 'TrueBot (Silence.Downloader)',
              SecondStageRats: 'FlawedGrace RAT & SDBbot',
              AdvisoryId: 'CISA AA23-158A (#StopRansomware: CL0P)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Mass Termination of 600+ Processes & Services (`net stop`) & TinyMet Cobalt Strike Pivot',
        narration:
          'Using `TinyMet` (a tiny meterpreter/Cobalt Strike stager) to move laterally to domain controllers and file servers, the operator launches the CL0P binary, which contains a hardcoded loop that stops over 600 Windows services (`SQLWriter`, `Veeam`, `BackupExec`, `DefWatch`) and kills office, database, and backup processes so every file handle on the server is unlocked.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Defense Evasion & Impact Preparation (T1489 - Service Stop)',
        technicalCommands: [
          'net.exe stop "SQLWriter" /y && net.exe stop "VeeamBackupSvc" /y && net.exe stop "WinDefend" /y',
          'vssadmin.exe delete shadows /all /quiet && bcdedit.exe /set {default} recoveryenabled No',
        ],
        defenseMitigation:
          'Monitor high-velocity `net.exe stop` bursts (>10 service stop commands within 30 seconds) and verify Authenticode certificate revocation lists (OCSP/CRL).',
        logs: [
          {
            id: 'cl0p-rw-2',
            timestamp: '10:07:55.120',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'cl0p.exe',
            CommandLine: 'C:\\Windows\\Temp\\cl0p.exe',
            raw: 'EventID: 1 | Image: C:\\Windows\\Temp\\cl0p.exe | Signature: Signed with Stolen/Fraudulent Code-Signing Certificate | Action: Terminating 618 hardcoded Windows processes & services + vssadmin delete shadows',
            parsedFields: {
              CodeSigningAbuse: 'Signed with stolen/expired Authenticode certificate (T1553.002)',
              HardcodedKillList: '600+ Windows services and database/backup processes',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: RC4 / AES + RSA-1024 Encryption (`.CIop`) & `ClopReadMe.txt` Extortion Demand',
        narration:
          'CL0P spawns dedicated worker threads for local drives and enumerated SMB network shares, encrypting files with RC4 or AES-256 and protecting the symmetric key with an embedded 1024-bit RSA public key, appending `.CIop` (or `.Cllp`) and writing `ClopReadMe.txt` (`README_!_CIop_!.txt`).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'cl0p.exe -> CryptGenRandom() -> CryptEncrypt(RC4/AES-256) + RSA-1024 key wrap -> *.CIop',
          'WriteFile("ClopReadMe.txt") across all encrypted directories',
        ],
        defenseMitigation:
          'Enforce SMB network segmentation, revoke compromised code-signing certificates via WDAC, and maintain immutable offline backups.',
        logs: [
          {
            id: 'cl0p-rw-3',
            timestamp: '10:12:30.604',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'cl0p.exe',
            raw: 'EventID: 11 | Image: C:\\Windows\\Temp\\cl0p.exe | TargetFilename: \\\\corp-fs01\\shares\\ClopReadMe.txt | AppendedExtension: .CIop | Actor: CL0P / FIN11 / TA505',
            parsedFields: {
              RansomwareFamily: 'CL0P Ransomware',
              AppendedExtension: '.CIop / .Cllp',
              RansomNote: 'ClopReadMe.txt',
            },
          },
        ],
        packets: [],
      },
    ],
  };
