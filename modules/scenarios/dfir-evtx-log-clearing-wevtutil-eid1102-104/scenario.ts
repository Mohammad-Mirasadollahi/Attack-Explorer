import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-evtx-log-clearing-wevtutil-eid1102-104',
    title: 'NIST SP 800-86 & Microsoft DFIR — Event Log Clearing via wevtutil.exe & USN Journal Recovery (EID 1102 / 104)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1070.001',
    description:
      'Grounded in NIST SP 800-86 (Guide to Integrating Forensic Techniques into Incident Response), Microsoft Security Event ID 1102 / System Event ID 104 specifications, and MITRE ATT&CK T1070.001: an adversary attempts anti-forensics by wiping Security.evtx, System.evtx, and Microsoft-Windows-Sysmon%4Operational.evtx via wevtutil.exe cl or Clear-EventLog, generating immutable clearing events (1102/104) while leaving unallocated EVTX record slack and NTFS $UsnJrnl:$J transactions behind.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Cleanup Script', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'EventLog RPC (EvtClearLog)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'svchost.exe (EventLog Service)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Security EID 1102 & System 104', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'NTFS $UsnJrnl:$J & EVTX Slack', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Mass Channel Enumeration & wevtutil.exe cl Execution (Sysmon EventID 1)',
        narration:
          'To erase post-exploitation traces before disconnecting, the attacker runs cmd.exe /c "for /F %i in (\'wevtutil.exe el\') do wevtutil.exe cl \"%i\"" or PowerShell Clear-EventLog. Real-time SIEM forwarding captures the Sysmon EventID 1 / Security EventID 4688 process creation before the local .evtx files on disk are truncated.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1070.001 - Indicator Removal: Clear Windows Event Logs)',
        technicalCommands: [
          'for /F "tokens=*" %1 in (\'wevtutil.exe el\') do wevtutil.exe cl "%1"',
          'powershell.exe -Command "Get-WinEvent -ListLog * | ForEach-Object { [System.Diagnostics.Eventing.Reader.EventLogSession]::GlobalSession.ClearLog($_.LogName) }"',
        ],
        defenseMitigation:
          'Stream Windows Event Logs in real time via Windows Event Forwarding (WEF) or an EDR/SIEM agent so local .evtx truncation cannot erase already-forwarded telemetry.',
        logs: [
          {
            id: 'dfir-evtx-1',
            timestamp: '03:55:01.102',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'wevtutil.exe',
            CommandLine: 'wevtutil.exe cl Security',
            raw: 'EventID: 1 | Image: C:\\Windows\\System32\\wevtutil.exe | CommandLine: wevtutil.exe cl Security | ParentImage: C:\\Windows\\System32\\cmd.exe | User: CORP\\admin_ops',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              Image: 'C:\\Windows\\System32\\wevtutil.exe',
              CommandLine: 'wevtutil.exe cl Security',
              ApiInvoked: 'wevtapi.dll!EvtClearLog',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Immutable Audit Log Cleared Events (Security EventID 1102 & System EventID 104)',
        narration:
          'When svchost.exe (-k LocalServiceNetworkRestricted -s EventLog) executes EvtClearLog on C:\\Windows\\System32\\winevt\\Logs\\Security.evtx, the kernel immediately writes a fresh first record into the cleared Security log: EventID 1102 (The audit log was cleared, Provider: Microsoft-Windows-Eventlog) containing the SubjectUserSid and SubjectUserName. Clearing any other channel (such as System or Sysmon) writes EventID 104 into System.evtx.',
        activeNodes: ['target', 'siem', 'ad'],
        mitreTactic: 'Defense Evasion (T1070.001 - EventID 1102 & EventID 104 Sentinel Records)',
        technicalCommands: [
          'Security EventID 1102 (Microsoft-Windows-Eventlog): The audit log was cleared. SubjectUserName=admin_ops',
          'System EventID 104 (Microsoft-Windows-Eventlog): The Microsoft-Windows-Sysmon/Operational log file was cleared.',
        ],
        defenseMitigation:
          'Treat Security EventID 1102 and System EventID 104 as critical P1 incident triggers and automatically isolate the host for memory and disk acquisition.',
        logs: [
          {
            id: 'dfir-evtx-2',
            timestamp: '03:55:01.450',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 1102,
            ProcessName: 'svchost.exe',
            CommandLine: 'svchost.exe -k LocalServiceNetworkRestricted -p -s EventLog (EvtClearLog)',
            raw: 'LogName: Security | Source: Microsoft-Windows-Eventlog | EventID: 1102 | UserData: <LogFileCleared><SubjectUserSid>S-1-5-21-3819201-1104</SubjectUserSid><SubjectUserName>admin_ops</SubjectUserName><SubjectDomainName>CORP</SubjectDomainName></LogFileCleared> | Correlated System EventID 104',
            parsedFields: {
              SecurityEventID: '1102 (The audit log was cleared)',
              SystemEventID: '104 (Event log channel cleared)',
              SubjectUserName: 'CORP\\admin_ops',
              ClearedChannel: 'Security & Microsoft-Windows-Sysmon/Operational',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: NTFS $UsnJrnl:$J Transaction Correlation & Unallocated EVTX Chunk Carving (ElfChnk)',
        narration:
          'During disk forensics, the analyst parses the NTFS Change Journal ($Extend\\$UsnJrnl:$J) showing USN_REASON_DATA_TRUNCATION (0x00000200) on Security.evtx at 03:55:01 UTC, and carves unallocated NTFS clusters and Volume Shadow Copies for 64KB EVTX chunk headers ("ElfChnk\\x00", hex 45 6C 66 43 68 6E 6B 00) and binary XML record magic (0x00002a2a "**\\x00\\x00") using evtx_tract.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1070.001 - NTFS $UsnJrnl:$J & ElfChnk Carving)',
        technicalCommands: [
          'MFTECmd.exe -f "C:\\$Extend\\$UsnJrnl:$J" --csv C:\\Forensics  # Shows USN_REASON_DATA_TRUNCATION on Security.evtx',
          'EVTX 64KB Chunk Header Magic: 45 6C 66 43 68 6E 6B 00 ("ElfChnk\\x00")',
          'EVTX Record Header Magic: 2A 2A 00 00 ("**\\x00\\x00") carved from unallocated clusters',
        ],
        defenseMitigation:
          'Acquire a raw physical disk image immediately upon detecting EventID 1102/104 before TRIM or new disk writes overwrite unallocated 64KB ElfChnk clusters.',
        logs: [
          {
            id: 'dfir-evtx-3',
            timestamp: '03:55:01.460',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'MFTECmd.exe',
            CommandLine: 'MFTECmd.exe -f C:\\$Extend\\$UsnJrnl:$J (USN_REASON_DATA_TRUNCATION on Security.evtx)',
            raw: 'USN_RECORD_V2: FileName="Security.evtx" ParentEntryNumber=18422 Usn=8491029384 TimeStamp="2026-11-03 03:55:01.452" Reason="DataOverwrite | DataTruncation (0x00000201)" | Carved ElfChnk (456C6643686E6B00): 412 records recovered',
            parsedFields: {
              NtfsArtifact: 'C:\\$Extend\\$UsnJrnl:$J (Update Sequence Number Journal)',
              UsnReasonFlag: 'USN_REASON_DATA_TRUNCATION (0x00000200)',
              EvtxChunkMagic: '45 6C 66 43 68 6E 6B 00 (ElfChnk\\x00)',
              EvtxRecordMagic: '2A 2A 00 00 (**\\x00\\x00)',
            },
          },
        ],
      },
    ],
  };
