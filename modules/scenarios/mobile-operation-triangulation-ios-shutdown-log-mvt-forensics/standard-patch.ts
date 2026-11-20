import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
