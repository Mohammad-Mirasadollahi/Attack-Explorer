import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
