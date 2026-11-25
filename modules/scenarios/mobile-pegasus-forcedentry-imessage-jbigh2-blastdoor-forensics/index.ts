import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics',
    title: 'Citizen Lab FORCEDENTRY, Google Project Zero & Apple CVE-2021-30860 — iOS JBIG2 Stream & MVT Shutdown/DataUsage Forensics',
    category: 'MOBILE_TELECOM_SPYWARE',
    mitreId: 'T1203',
    description:
      'Grounded in Citizen Lab FORCEDENTRY research, Google Project Zero technical analysis of the JBIG2 emulated logic circuit in CoreGraphics (CVE-2021-30860), and Amnesty International Mobile Verification Toolkit (MVT) forensic methodology: mobile DFIR investigators examine iMessage attachment staging directories, IMTransferAgent network records in DataUsage.sqlite, and CrashReporter jetsam/diagnostic logs.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'iMessage Attachment Delivery', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'IMTransferAgent & BlastDoor', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CoreGraphics JBIG2 Parser', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'MVT iOS Backup & Sysdiagnose Analyzer', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'DataUsage.sqlite & CrashReporter', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Zero-Click iMessage Attachment Retrieval via IMTransferAgent & attachment-dir Audit',
        narration:
          'When a zero-click iMessage attachment (.gif wrapping a PDF/JBIG2 stream) arrives from Apple Push Notification service (APNs), IMTransferAgent automatically downloads the attachment from iCloud MMCS servers into ~/Library/SMS/Attachments/ without user interaction.',
        activeNodes: ['attacker', 'firewall', 'ad'],
        mitreTactic: 'Initial Access (T1203 - Exploitation for Client Execution)',
        technicalCommands: [
          'mvt-ios check-backup --iocs pegasus_forcedentry.stix2 /cases/ios_backup_decrypted/',
          'sqlite3 sms.db "SELECT rowid, filename, mime_type, total_bytes FROM attachment WHERE filename LIKE \'%.gif\';"',
        ],
        defenseMitigation:
          'Enable Apple iOS Lockdown Mode on high-risk devices (which strictly blocks complex iMessage attachment parsing including PDF/JBIG2 streams inside Messages) and update iOS to current releases.',
        logs: [
          {
            id: 'mobile-forcedentry-1',
            timestamp: '02:41:11.094',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 101,
            ProcessName: 'IMTransferAgent',
            CommandLine: '/System/Library/PrivateFrameworks/IMTransferServices.framework/IMTransferAgent',
            raw: 'mvt_sms_attachment: {"rowid":418,"guid":"at_0_9F82A1C0","filename":"~/Library/SMS/Attachments/9f/15/FA812B/IMG_0041.gif","mime_type":"image/gif","magic_header":"%PDF-1.3 (JBIG2Decode)"}',
            parsedFields: {
              ProcessName: 'IMTransferAgent',
              AttachmentPath: '~/Library/SMS/Attachments/9f/15/FA812B/IMG_0041.gif',
              HeaderMismatch: 'File extension .gif contains %PDF-1.3 header with /Filter /JBIG2Decode',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CoreGraphics Xpdf JBIG2Decode Segment Integer Overflow (CVE-2021-30860) CrashReporter Trace',
        narration:
          'As CoreGraphics renders the masqueraded attachment outside the BlastDoor sandboxed image path, the JBIG2Stream::readTextRegionSeg parser processes over 70,000 segment commands using bitwise AND/OR/XOR/XNOR refinement operators, leaving diagnostic traces in CrashReporter and system logs.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1203 - Exploitation for Client Execution)',
        technicalCommands: [
          'grep -rnE "CoreGraphics|JBIG2Stream|IMTranscoderAgent" /cases/sysdiagnose/logs/CrashReporter/',
          'mvt-ios check-fs --output /cases/mvt_out/ /cases/ios_filesystem_dump/',
        ],
        defenseMitigation:
          'Collect full iOS sysdiagnose archives prior to rebooting suspected devices so volatile CrashReporter .ips files and unified log tracev3 buffers are preserved for MVT analysis.',
        logs: [
          {
            id: 'mobile-forcedentry-2',
            timestamp: '02:41:13.620',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 30860,
            ProcessName: 'IMTranscoderAgent',
            CommandLine: '/System/Library/PrivateFrameworks/IMTranscoding.framework/XPCServices/IMTranscoderAgent.xpc',
            raw: 'ips_crash_trace: {"procName":"IMTranscoderAgent","exception":"EXC_BAD_ACCESS (SIGSEGV)","frames":["CoreGraphics!JBIG2Stream::readTextRegionSeg","CoreGraphics!JBIG2Bitmap::combine"]}',
            parsedFields: {
              VulnerabilityId: 'CVE-2021-30860 (FORCEDENTRY CoreGraphics JBIG2 Integer Overflow)',
              TargetProcess: 'IMTranscoderAgent / SpringBoard',
              ForensicArtifact: '/private/var/mobile/Library/Logs/CrashReporter/IMTranscoderAgent-*.ips',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: DataUsage.sqlite & netusage.sqlite Masqueraded Process Network Attribution',
        narration:
          'Even after the staged files under /private/var/tmp/ are deleted (since Pegasus runs purely in memory and does not persist across reboots), iOS SQLite databases DataUsage.sqlite and netusage.sqlite permanently record cellular and Wi-Fi byte counts attributed to anomalous process names (such as RoleAccountd or Stagingd) with zero bundle ID.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Command and Control (T1071.001 - Application Layer Protocol: Web Protocols)',
        technicalCommands: [
          'sqlite3 DataUsage.sqlite "SELECT ZPROCESS.ZPROCNAME, ZPROCESS.ZBUNDLENAME, ZLIVEUSAGE.ZWIFIIN, ZLIVEUSAGE.ZWIFIOUT, datetime(ZPROCESS.ZFIRSTTIMESTAMP+978307200,\'unixepoch\') FROM ZLIVEUSAGE JOIN ZPROCESS ON ZLIVEUSAGE.ZHASPROCESS = ZPROCESS.Z_PK WHERE ZPROCESS.ZBUNDLENAME IS NULL;"',
        ],
        defenseMitigation:
          'Audit ZPROCESS tables in /private/var/wireless/Library/Databases/DataUsage.sqlite and /private/var/networkd/netusage.sqlite using MVT to identify non-Apple daemon names transmitting megabytes of outbound traffic within seconds of an IMTransferAgent event.',
        logs: [
          {
            id: 'mobile-forcedentry-3',
            timestamp: '02:41:19.440',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'RoleAccountd',
            CommandLine: 'sqlite3 DataUsage.sqlite ZPROCESS ZPROCNAME=RoleAccountd ZBUNDLENAME=NULL',
            raw: 'mvt_datausage: {"proc_name":"RoleAccountd","bundle_id":null,"first_timestamp":"2026-11-17T02:41:18Z","wifi_in_bytes":1482910,"wifi_out_bytes":8421900,"delta_from_imtransferagent_sec":7}',
            parsedFields: {
              DatabaseArtifact: '/private/var/wireless/Library/Databases/DataUsage.sqlite (ZPROCESS / ZLIVEUSAGE)',
              AnomalousProcessName: 'RoleAccountd (ZPROCNAME with NULL ZBUNDLENAME)',
              TemporalCorrelation: 'Spawned 7 seconds after IMTransferAgent attachment download',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a courier dropping off a fake animated greeting card that secretly conceals a dense architectural blueprint folded inside a paper disguise. Because the greeting-card label tricks the building’s automated preview booth into routing it around the armored inspection chamber, a tiny built-in typesetting machine executes seventy thousand logic steps to hijack the phone, leaving no permanent tools behind after a reboot, only crash slips and permanent cellular billing entries under a made-up maintenance worker’s name.',
      storyMappings: [
        {
          storyTerm: 'Fake Greeting Card Concealing Blueprint',
          technicalTerm: '.gif Attachment Carrying %PDF-1.3 Header & /JBIG2Decode Stream',
          tone: 'rose',
        },
        {
          storyTerm: 'Armored Inspection Chamber Bypass',
          technicalTerm: 'CoreGraphics Rendering Outside iOS BlastDoor Image Sandbox',
          tone: 'amber',
        },
        {
          storyTerm: 'Seventy Thousand Typesetting Steps',
          technicalTerm: 'CVE-2021-30860 (FORCEDENTRY) JBIG2Stream Integer Overflow',
          tone: 'sky',
        },
        {
          storyTerm: 'Made-Up Worker Cellular Billing',
          technicalTerm: 'DataUsage.sqlite ZPROCESS Anomaly (RoleAccountd / NULL Bundle ID)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'A silent incoming delivery lands in the phone’s attachment tray stamped as a harmless animated picture, but peeling back the outer wrapper reveals a compressed document stream engineered to slip straight into the core rendering office.',
        storyMappings: [
          {
            storyTerm: 'Attachment Delivery Clerk',
            technicalTerm: 'iOS IMTransferAgent Saving IMG_0041.gif in ~/Library/SMS/Attachments/',
            tone: 'sky',
          },
          {
            storyTerm: 'Harmless Picture Label',
            technicalTerm: 'Masqueraded .gif Extension Masking %PDF-1.3 File Signature',
            tone: 'amber',
          },
          {
            storyTerm: 'Compressed Document Stream',
            technicalTerm: 'Embedded /Filter /JBIG2Decode Stream Inside Disguised PDF',
            tone: 'rose',
          },
          {
            storyTerm: 'High-Risk Mailroom Lock',
            technicalTerm: 'Apple iOS Lockdown Mode Blocking Complex Attachment Parsing',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When the building’s graphics press tries to lay out the disguised document outside the armored inspection chamber, the seventy-thousand-step typesetting script overflows the press’s internal counter and constructs a miniature virtual machine out of ink logic gates, leaving a crash slip in the maintenance tray.',
        storyMappings: [
          {
            storyTerm: 'Graphics Press Outside Chamber',
            technicalTerm: 'CoreGraphics Xpdf JBIG2Stream::readTextRegionSeg Outside BlastDoor',
            tone: 'sky',
          },
          {
            storyTerm: 'Seventy-Thousand-Step Logic Gates',
            technicalTerm: 'CVE-2021-30860 Bitwise AND/OR/XOR/XNOR Refinement Overflow',
            tone: 'rose',
          },
          {
            storyTerm: 'Targeted Rendering Workers',
            technicalTerm: 'IMTranscoderAgent and SpringBoard System Processes',
            tone: 'amber',
          },
          {
            storyTerm: 'Maintenance Tray Crash Slip',
            technicalTerm: '/private/var/mobile/Library/Logs/CrashReporter/IMTranscoderAgent-*.ips',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Although the spyware sweeps its temporary hallway tools away cleanly and vanishes on reboot, the phone’s permanent network billing ledgers forever keep a timestamped row showing a mystery worker with no official company badge sending megabytes of data seven seconds after the rigged card arrived.',
        storyMappings: [
          {
            storyTerm: 'Permanent Network Billing Ledgers',
            technicalTerm: 'DataUsage.sqlite (ZPROCESS / ZLIVEUSAGE) & netusage.sqlite',
            tone: 'sky',
          },
          {
            storyTerm: 'Mystery Worker Without Badge',
            technicalTerm: 'Anomalous ZPROCNAME (RoleAccountd / Stagingd) with NULL ZBUNDLENAME',
            tone: 'rose',
          },
          {
            storyTerm: 'Seven-Second Arrival Correlation',
            technicalTerm: 'Temporal Match Right After IMTransferAgent Attachment Download',
            tone: 'amber',
          },
          {
            storyTerm: 'Forensic Ledger Verification',
            technicalTerm: 'Amnesty MVT Inspection of Pre-Reboot sysdiagnose & SQLite Tables',
            tone: 'emerald',
          },
        ],
      },
    },
  };
