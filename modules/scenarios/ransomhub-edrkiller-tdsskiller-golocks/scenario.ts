import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
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
  };
