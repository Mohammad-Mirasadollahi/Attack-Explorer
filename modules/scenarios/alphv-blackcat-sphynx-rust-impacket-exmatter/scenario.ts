import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
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
  };
