import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'mobile-operation-triangulation-ios-shutdown-log-mvt-forensics',
    title: 'Kaspersky GReAT, Citizen Lab & Amnesty MVT — iOS Operation Triangulation Zero-Click iMessage & Shutdown.log Forensics (CVE-2023-41990)',
    category: 'MOBILE_TELECOM_SPYWARE',
    mitreId: 'T1430',
    description:
      'Grounded in Kaspersky GReAT Operation Triangulation research, Apple Security Advisories (CVE-2023-41990 / CVE-2023-32434 / CVE-2023-38606), and Amnesty International Mobile Verification Toolkit (MVT) documentation: mobile DFIR analysts examine iOS sysdiagnose archives (Shutdown.log, DataUsage.sqlite, and CrashReporter plists) to detect zero-click iMessage attachment processing and ephemeral /private/var/tmp/ execution.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Zero-Click iMessage Attachment', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'IMTranscoderAgent / BlastDoor', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'XNU Kernel & MMIO Registers', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Amnesty MVT (mvt-ios) Analyzer', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Shutdown.log & DataUsage.sqlite', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Hidden iMessage Attachment Processing in IMTranscoderAgent & Font Parser Crash Trace',
        narration:
          'When a zero-click iMessage containing a crafted font/image attachment arrives via Apple Push Notification service (apsd), imagent and IMTranscoderAgent process the attachment automatically. Forensic artifacts in CrashReporter and diagnostic logs record abnormal memory faults inside FontParser / CoreGraphics.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1456 - Drive-By Compromise / Zero-Click Messaging)',
        technicalCommands: [
          'mvt-ios check-backup --output ./mvt-results ./ios-encrypted-backup/',
          'mvt-ios check-iocs --iocs triangulation.stix2 ./mvt-results/',
        ],
        defenseMitigation:
          'Enable iOS Lockdown Mode on high-risk devices (which blocks complex iMessage attachment pre-processing and disables legacy font parsing in IMTranscoderAgent) and update to patched iOS releases.',
        logs: [
          {
            id: 'mob-tri-1',
            timestamp: '03:14:09.110',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 41990,
            ProcessName: 'IMTranscoderAgent',
            CommandLine: '/System/Library/PrivateFrameworks/IMTranscoderAgent.framework/IMTranscoderAgent',
            raw: 'mvt_ios_crashlog: process="IMTranscoderAgent" bundle="com.apple.imtranscoding" exception="EXC_BAD_ACCESS" module="libFontParser.dylib" cve_ref="CVE-2023-41990"',
            parsedFields: {
              TargetDaemon: 'IMTranscoderAgent (iMessage Attachment Transcoder)',
              LibraryModule: 'libFontParser.dylib (TrueType ADJUST Instruction)',
              VulnerabilityRef: 'CVE-2023-41990 / CVE-2023-32434',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Ephemeral Implant Execution in /private/var/tmp/ Recorded in iOS Shutdown.log',
        narration:
          'Even though the in-memory implant removes its temporary files from /private/var/tmp/ after execution and does not survive a reboot, the iOS kernel writes every unclosed process PID and path active during system shutdown into /private/var/db/diagnostics/Shutdown.log (extracted from a sysdiagnose archive).',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1070.004 - Indicator Removal: File Deletion / Shutdown.log)',
        technicalCommands: [
          'grep -E "/private/var/tmp/|/private/var/db/" sysdiagnose_extracted/logs/Shutdown/shutdown.log',
        ],
        defenseMitigation:
          'Collect a full iOS sysdiagnose archive prior to wiping a suspected device and run mvt-ios over Shutdown.log to identify processes that executed from /private/var/tmp/.',
        logs: [
          {
            id: 'mob-tri-2',
            timestamp: '03:14:22.500',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 38606,
            ProcessName: 'BackupAgent',
            CommandLine: '/private/var/tmp/main (Recorded in /private/var/db/diagnostics/Shutdown.log)',
            raw: 'ios_shutdown_log: sigterm_timestamp=1763262862 pid=4812 path="/private/var/tmp/main" status="unlinked_executable"',
            parsedFields: {
              ForensicArtifactFile: '/private/var/db/diagnostics/Shutdown.log (sysdiagnose)',
              RecordedProcessPath: '/private/var/tmp/main',
              ForensicSignificance: 'Proves execution of deleted binary from world-writable /private/var/tmp/',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Anomalous System Process Cellular/Wi-Fi Exfiltration in DataUsage.sqlite & netusage.sqlite',
        narration:
          'iOS persistently tracks per-process network byte counters in /private/var/wireless/Library/Databases/DataUsage.sqlite and netusage.sqlite. MVT correlates ZPROCESS entries showing non-networked system daemons (or deleted PIDs) transmitting megabytes of HTTPS data over Wi-Fi/Cellular.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1041 - Exfiltration Over C2 Channel)',
        technicalCommands: [
          'sqlite3 DataUsage.sqlite "SELECT ZPROCESS.ZPROCNAME, ZPROCESS.ZBUNDLENAME, ZLIVEUSAGE.ZWIFIIN, ZLIVEUSAGE.ZWIFIOUT FROM ZLIVEUSAGE JOIN ZPROCESS ON ZLIVEUSAGE.ZHASPROCESS = ZPROCESS.Z_PK;"',
        ],
        defenseMitigation:
          'Audit DataUsage.sqlite and netusage.sqlite via MVT for system processes with unexpected outbound byte volumes or missing bundle identifiers.',
        logs: [
          {
            id: 'mob-tri-3',
            timestamp: '03:15:40.012',
            source: 'Network',
            severity: 'critical',
            EventCode: 443,
            ProcessName: 'BackupAgent',
            CommandLine: 'sqlite3 DataUsage.sqlite SELECT ZPROCNAME, ZWIFIOUT FROM ZLIVEUSAGE',
            raw: 'mvt_datausage_sqlite: ZPROCNAME="BackupAgent" ZBUNDLENAME="NULL" ZWIFIOUT=14829402 ZWWANOUT=3104920 first_ts="2026-11-16T03:14:25Z"',
            parsedFields: {
              SqliteDatabase: 'DataUsage.sqlite / netusage.sqlite',
              AnomalousProcessName: 'BackupAgent (ZPROCNAME with NULL Bundle ID)',
              OutboundBytesRecorded: '14.8 MB Wi-Fi / 3.1 MB Cellular',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a ghost burglar slipping into a locked smartphone apartment through an unread postcard slid under the front door without the homeowner ever tapping the screen. The burglar works strictly in the dark, burns every paper note in the hallway before leaving, and vanishes whenever the building power cycles; yet the elevator’s nightly closing log still records an unfamiliar worker lingering in the storage corridor and the utility meter permanently shows megabytes of unexplained water flowing out of an unused closet.',
      storyMappings: [
        {
          storyTerm: 'Unread Postcard Under Door',
          technicalTerm: 'Zero-Click iMessage Crafted Font/Image Attachment (CVE-2023-41990)',
          tone: 'rose',
        },
        {
          storyTerm: 'Ghost Burglar Burning Notes',
          technicalTerm: 'Ephemeral In-Memory Implant Deleting /private/var/tmp/ Artifacts',
          tone: 'amber',
        },
        {
          storyTerm: 'Elevator Nightly Closing Log',
          technicalTerm: 'iOS /private/var/db/diagnostics/Shutdown.log (Unclosed PID Record)',
          tone: 'sky',
        },
        {
          storyTerm: 'Utility Meter Closet Flow',
          technicalTerm: 'DataUsage.sqlite & netusage.sqlite ZPROCESS Cellular/Wi-Fi Counters',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Before the homeowner even wakes the phone screen, the building’s automated mail sorter opens the rigged postcard in the basement mailroom, triggering an invisible print-shop jam that leaves behind a faint diagnostic receipt on the maintenance clipboard.',
        storyMappings: [
          {
            storyTerm: 'Automated Mail Sorter',
            technicalTerm: 'Apple Push (apsd), imagent & IMTranscoderAgent Background Parsers',
            tone: 'sky',
          },
          {
            storyTerm: 'Rigged Postcard',
            technicalTerm: 'Zero-Click Malicious Font/Image Attachment (CVE-2023-41990)',
            tone: 'rose',
          },
          {
            storyTerm: 'Invisible Print-Shop Jam',
            technicalTerm: 'Memory Fault Inside FontParser / CoreGraphics Rendering Engine',
            tone: 'amber',
          },
          {
            storyTerm: 'Maintenance Clipboard Receipt',
            technicalTerm: 'iOS CrashReporter .ips Plis & Unified Diagnostic Logs',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The ghost burglar runs quietly out of a temporary hallway locker and shreds their working files immediately afterward, forgetting that every time the building powers down, the master elevator log writes down the exact badge number and locker path of every worker still lingering at closing time.',
        storyMappings: [
          {
            storyTerm: 'Temporary Hallway Locker',
            technicalTerm: 'Ephemeral Implant Staged Under /private/var/tmp/',
            tone: 'amber',
          },
          {
            storyTerm: 'Shredding Working Files',
            technicalTerm: 'Self-Deleting In-Memory Payload Leaving Zero Disk Persistence',
            tone: 'rose',
          },
          {
            storyTerm: 'Master Elevator Closing Log',
            technicalTerm: '/private/var/db/diagnostics/Shutdown.log in sysdiagnose Archive',
            tone: 'sky',
          },
          {
            storyTerm: 'Lingering Worker Badge Record',
            technicalTerm: 'MVT Extracting Unclosed /private/var/tmp/ Process Path & PID',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even days after a reboot wipes the ghost burglar out of memory, the building’s permanent water-and-power billing books still display heavy outbound usage billed to a broom-closet service that should never transmit anything to the street.',
        storyMappings: [
          {
            storyTerm: 'Permanent Utility Billing Books',
            technicalTerm: '/private/var/wireless/Library/Databases/DataUsage.sqlite & netusage.sqlite',
            tone: 'sky',
          },
          {
            storyTerm: 'Broom-Closet Service Name',
            technicalTerm: 'ZPROCESS Table Entry for Non-Networked Daemon or Deleted PID',
            tone: 'amber',
          },
          {
            storyTerm: 'Heavy Outbound Flow',
            technicalTerm: 'Megabytes of Anomalous Wi-Fi & Cellular HTTPS Exfiltration Bytes',
            tone: 'rose',
          },
          {
            storyTerm: 'Forensic Billing Audit',
            technicalTerm: 'Amnesty MVT Correlation of ZPROCESS Counters Against Shutdown.log',
            tone: 'emerald',
          },
        ],
      },
    },
  };
