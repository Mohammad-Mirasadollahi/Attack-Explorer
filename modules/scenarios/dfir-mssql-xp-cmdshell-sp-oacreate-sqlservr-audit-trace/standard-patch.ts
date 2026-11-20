import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'A vault bookkeeper is supposed to only file and fetch account ledgers, never operate the building workshop. Investigators trace an intrusion where a privileged caller unlocks the bookkeeper hidden workshop switch, loads two helper toolkits to run floor commands, and installs a permanent custom stamp inside the vault catalog.',
      storyMappings: [
        {
          storyTerm: 'Vault bookkeeper engine',
          technicalTerm: 'Microsoft SQL Server sqlservr.exe database service',
          tone: 'amber',
        },
        {
          storyTerm: 'Hidden workshop switch',
          technicalTerm: 'sp_configure enabling advanced options and xp_cmdshell',
          tone: 'sky',
        },
        {
          storyTerm: 'Two helper toolkits',
          technicalTerm: 'Loaded xplog70.dll and odsole70.dll server modules',
          tone: 'rose',
        },
        {
          storyTerm: 'Permanent custom catalog stamp',
          technicalTerm: 'Malicious CLR assembly persisted in sys.assemblies',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'First, investigators inspect the vault configuration book and see two safety locks flipped open in rapid succession: one exposing hidden settings and a second enabling the direct workshop command lever.',
        storyMappings: [
          {
            storyTerm: 'First safety lock',
            technicalTerm: 'sp_configure show advanced options set to 1',
            tone: 'amber',
          },
          {
            storyTerm: 'Direct workshop command lever',
            technicalTerm: 'sp_configure xp_cmdshell or Ole Automation enabled',
            tone: 'sky',
          },
          {
            storyTerm: 'Vault configuration book',
            technicalTerm: 'MSSQL ERRORLOG and EventID 15457 reconfiguration logs',
            tone: 'rose',
          },
          {
            storyTerm: 'Privileged caller badge',
            technicalTerm: 'Compromised sysadmin or sa database account',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Moments later, the bookkeeper pulls two specialized hardware libraries off the shelf—one built for shell commands and another for external automation objects—and immediately spawns an office command console directly beneath the ledger desk.',
        storyMappings: [
          {
            storyTerm: 'Shell command toolkit',
            technicalTerm: 'xplog70.dll module backing xp_cmdshell execution',
            tone: 'amber',
          },
          {
            storyTerm: 'External automation toolkit',
            technicalTerm: 'odsole70.dll module backing sp_OACreate execution',
            tone: 'sky',
          },
          {
            storyTerm: 'Bookkeeper parent process',
            technicalTerm: 'sqlservr.exe database engine binary',
            tone: 'rose',
          },
          {
            storyTerm: 'Office command console',
            technicalTerm: 'Child cmd.exe or powershell.exe spawned by sqlservr.exe',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To maintain quiet access even if the workshop lever is locked again, the intruder registers an unsigned custom extension right inside the vault catalog while leaving a clear audit trail inside the automatic rolling trace reel.',
        storyMappings: [
          {
            storyTerm: 'Unsigned custom extension',
            technicalTerm: 'Malicious .NET CLR stored procedure in sys.assemblies',
            tone: 'amber',
          },
          {
            storyTerm: 'Vault catalog registry',
            technicalTerm: 'Database system catalog tables storing assemblies',
            tone: 'sky',
          },
          {
            storyTerm: 'Automatic rolling trace reel',
            technicalTerm: 'MSSQL Default Trace (.trc) forensic log files',
            tone: 'rose',
          },
          {
            storyTerm: 'Re-locked workshop lever',
            technicalTerm: 'Attacker disabling xp_cmdshell to hide initial traces',
            tone: 'emerald',
          },
        ],
      },
    },
  };
