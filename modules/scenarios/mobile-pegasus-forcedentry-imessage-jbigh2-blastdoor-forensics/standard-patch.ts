import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
