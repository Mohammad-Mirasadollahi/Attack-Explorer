import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a burglar who breaks into a bank security booth right before leaving and rips out every single page from every logbook on the shelf. Unbeknownst to the burglar, the moment the security logbook is ripped empty, an automatic brass stamper permanently embosses a fresh Page One declaring exactly who emptied the book and at what second, while the building master floor-tile register still keeps carbon impressions of every ripped page underneath.',
      storyMappings: [
        {
          storyTerm: 'Ripping out every single page from every logbook on the shelf',
          technicalTerm: 'wevtutil.exe el loop executing wevtutil.exe cl across all Windows EVTX channels',
          tone: 'amber',
        },
        {
          storyTerm: 'Automatic brass stamper embossing a fresh Page One receipt',
          technicalTerm: 'Immutable Security EventID 1102 and System EventID 104 audit log cleared records',
          tone: 'sky',
        },
        {
          storyTerm: 'Building master floor-tile register logging the destruction',
          technicalTerm: 'NTFS Change Journal ($Extend\\$UsnJrnl:$J) recording USN_REASON_DATA_TRUNCATION',
          tone: 'rose',
        },
        {
          storyTerm: 'Carbon impressions recovered from beneath the floor tiles',
          technicalTerm: 'Carving deleted EVTX XML chunks from unallocated disk clusters during forensics',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Trying to cover their tracks right before slipping out the door, the intruder runs an automated sweeper that lists every single diary binder on the building shelf and commands the event clerk to wipe them clean one by one.',
        storyMappings: [
          {
            storyTerm: 'Automated sweeper listing every diary binder',
            technicalTerm: 'cmd.exe /c for /F %i in (wevtutil.exe el) do wevtutil.exe cl %i',
            tone: 'amber',
          },
          {
            storyTerm: 'Commanding the event clerk to wipe each binder',
            technicalTerm: 'Native Windows utility wevtutil.exe cl invoking EvtClearLog across channels',
            tone: 'sky',
          },
          {
            storyTerm: 'Security camera catching the sweeper command line',
            technicalTerm: 'Sysmon EventID 1 (Process Creation) recording the exact wevtutil loop before clear',
            tone: 'rose',
          },
          {
            storyTerm: 'Anti-forensic trace erasure attempt',
            technicalTerm: 'MITRE ATT&CK T1070.001 indicator removal on Windows hosts',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The instant the event clerk empties the master Security binder or System binder, the operating system refuses to leave the binder truly blank and immediately stamps a single unforgeable first entry naming the exact badge holder and timestamp of the erasure.',
        storyMappings: [
          {
            storyTerm: 'Event clerk emptying the binder files',
            technicalTerm: 'svchost.exe (-s EventLog) calling EvtClearLog on C:\\Windows\\System32\\winevt\\Logs\\',
            tone: 'amber',
          },
          {
            storyTerm: 'Unforgeable Page One stamp in the Security binder',
            technicalTerm: 'Windows Security EventID 1102 (The audit log was cleared) naming SubjectUserName',
            tone: 'sky',
          },
          {
            storyTerm: 'Unforgeable Page One stamp in the System binder',
            technicalTerm: 'Windows System EventID 104 (The log file was cleared) naming the cleared channel',
            tone: 'rose',
          },
          {
            storyTerm: 'Central security archive vault keeping copies untouched',
            technicalTerm: 'Real-time log forwarding preserving pre-clear logs off the compromised host',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even after the binders appear empty on the desk, a skilled forensic investigator checks the building automatic paper-movement ledger showing the exact truncation event and gently lifts intact torn log scraps straight out of the unallocated storage bin underneath.',
        storyMappings: [
          {
            storyTerm: 'Automatic paper-movement ledger',
            technicalTerm: 'NTFS Change Journal ($Extend\\$UsnJrnl:$J) logging USN_REASON_DATA_TRUNCATION',
            tone: 'amber',
          },
          {
            storyTerm: 'Intact torn log scraps in the storage bin underneath',
            technicalTerm: 'Deleted 64KB ElfChnk EVTX chunks still residing in unallocated NTFS disk space',
            tone: 'sky',
          },
          {
            storyTerm: 'Gently lifting and reassembling the scraps',
            technicalTerm: 'Raw disk carving tools recovering cleared binary XML event records',
            tone: 'rose',
          },
          {
            storyTerm: 'Proving deliberate cover-up with exact timestamps',
            technicalTerm: 'Correlating $UsnJrnl timestamps against EventID 1102 and carved pre-wipe logs',
            tone: 'emerald',
          },
        ],
      },
    },
  };
