import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a bank whose master account ledger stays bolted down to the vault floor while the bank is open so nobody can walk out with it. An intruder snaps a frozen carbon-copy photograph of the entire floor, uses the bank own official bookbinding copier to stream the ledger cleanly out of the frozen photograph, and separately steals the four-part decoder dial from the wall safe so they can read every password seal offline.',
      storyMappings: [
        {
          storyTerm: 'Snapping a frozen carbon-copy photograph of the vault floor',
          technicalTerm: 'Creating a Volume Shadow Copy via vssadmin.exe and vssvc.exe (EventID 1 & 7036)',
          tone: 'amber',
        },
        {
          storyTerm: 'Official bookbinding copier streaming the ledger out of the photo',
          technicalTerm: 'esentutl.exe /y /vss copying locked ntds.dit (ESENT EventID 325 / 326)',
          tone: 'sky',
        },
        {
          storyTerm: 'Four-part decoder dial stolen from the wall safe',
          technicalTerm: 'reg.exe save HKLM\\SYSTEM capturing the BootKey across four scrambled registry keys',
          tone: 'rose',
        },
        {
          storyTerm: 'Reading every password seal offline in a hideout',
          technicalTerm: 'Offline secretsdump.py decryption of ntds.dit PekList NTLM hashes',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Unable to pry the live master ledger off the vault desk while clerks are using it, the intruder activates the building built-in instant camera to capture a frozen read-only snapshot of the entire drive floor.',
        storyMappings: [
          {
            storyTerm: 'Live ledger bolted to the vault desk',
            technicalTerm: 'Exclusively locked C:\\Windows\\NTDS\\ntds.dit held open by lsass.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Activating the building built-in instant camera',
            technicalTerm: 'Running vssadmin.exe create shadow /for=C: triggering vssvc.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Frozen read-only snapshot of the floor',
            technicalTerm: 'Newly mounted Volume Shadow Copy device (\\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1)',
            tone: 'rose',
          },
          {
            storyTerm: 'Building security log noting the camera flash',
            technicalTerm: 'Sysmon EventID 1 and System EventID 7036 (Volume Shadow Copy service started)',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Stepping up to the frozen floor photograph, the intruder calls over the bank own signed book-repair utility to peel a clean copy of the master ledger right out of the snapshot while the database engine quietly stamps an internal audit ticket.',
        storyMappings: [
          {
            storyTerm: 'Bank own signed book-repair utility',
            technicalTerm: 'Native Windows Extensible Storage Engine utility esentutl.exe /y /vss',
            tone: 'amber',
          },
          {
            storyTerm: 'Peeling a clean copy out of the frozen snapshot',
            technicalTerm: 'Streaming ntds.dit from the shadow copy path into a staging folder',
            tone: 'sky',
          },
          {
            storyTerm: 'Internal audit ticket stamped by the database engine',
            technicalTerm: 'Application ESENT EventID 325 and 326 logging database attachment and copy',
            tone: 'rose',
          },
          {
            storyTerm: 'Staging folder holding the copied ledger',
            technicalTerm: 'Exfiltration staging directory such as C:\\Temp\\ntds.dit',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Because every password line inside the stolen ledger is scrambled by a secret master cipher wheel bolted inside the wall cabinet, the intruder also exports that entire system cabinet so they can unwind every employee secret offline without touching the bank again.',
        storyMappings: [
          {
            storyTerm: 'Secret master cipher wheel inside the wall cabinet',
            technicalTerm: 'Domain Controller BootKey scrambled across four keys in HKLM\\SYSTEM',
            tone: 'amber',
          },
          {
            storyTerm: 'Exporting the entire system cabinet',
            technicalTerm: 'reg.exe save HKLM\\SYSTEM C:\\Temp\\SYSTEM.hiv',
            tone: 'sky',
          },
          {
            storyTerm: 'Scrambled password lines inside the ledger',
            technicalTerm: 'Encrypted PekList entries storing every domain NTLM and Kerberos key',
            tone: 'rose',
          },
          {
            storyTerm: 'Unwinding every employee secret offline',
            technicalTerm: 'Offline credential extraction combining ntds.dit and SYSTEM.hiv via secretsdump',
            tone: 'emerald',
          },
        ],
      },
    },
  };
