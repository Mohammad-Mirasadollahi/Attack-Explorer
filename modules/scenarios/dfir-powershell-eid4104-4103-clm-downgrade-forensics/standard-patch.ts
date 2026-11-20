import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
