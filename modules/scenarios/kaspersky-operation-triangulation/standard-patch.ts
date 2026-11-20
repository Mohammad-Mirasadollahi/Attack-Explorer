import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a pocket fortress smartphone locked behind custom hardware walls that even master locksmiths cannot read from public manuals. An invisible message arrives silently with zero taps needed, triggering a microscopic drawing-font glitch inside a hidden attachment; the hidden intruder then unlocks an undocumented secret hardware dial built straight into the phone\'s silicon chip to rewrite protected rooms, erases the delivery message without a trace, and lives purely inside temporary working memory until the phone restarts.',
      storyMappings: [
        {
          storyTerm: 'Invisible message triggering a microscopic drawing-font glitch',
          technicalTerm: 'Zero-click iMessage attachment exploiting TrueType Font ADJUST bytecode (CVE-2023-41990)',
          tone: 'amber',
        },
        {
          storyTerm: 'Unlocking an undocumented secret hardware dial inside the silicon chip',
          technicalTerm: 'Bypassing Apple hardware PPL memory protection via undocumented MMIO registers (CVE-2023-38606)',
          tone: 'sky',
        },
        {
          storyTerm: 'Erasing the delivery message and living purely in temporary memory',
          technicalTerm: 'Self-deleting iMessage trace and running memory-only TriangleDB spyware implant',
          tone: 'rose',
        },
        {
          storyTerm: 'Tiny leftover watermarks in phone billing and analytics diaries',
          technicalTerm: 'Kaspersky triangle_check detecting orphaned DataUsage.sqlite rows and OSAnalytics gaps',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Without the phone owner ever clicking a link or even seeing a notification chime, a hidden message attachment feeds a warped drawing instruction into the phone\'s font renderer, quietly seizing control inside the messaging background clerk.',
        storyMappings: [
          {
            storyTerm: 'Hidden message requiring zero user clicks',
            technicalTerm: 'Zero-click malicious iMessage PDF/font attachment processed by IMAgent',
            tone: 'amber',
          },
          {
            storyTerm: 'Warped drawing instruction inside the font renderer',
            technicalTerm: 'TrueType Font undocumented ADJUST opcode memory corruption (CVE-2023-41990)',
            tone: 'sky',
          },
          {
            storyTerm: 'Messaging background clerk silently hijacked',
            technicalTerm: 'Code execution achieved inside IMAgent followed by immediate message deletion',
            tone: 'rose',
          },
          {
            storyTerm: 'Faint forensic trace inside phone backups',
            technicalTerm: 'MobileBackup / Sysdiagnose artifacts showing anomalous IMAgent attachment handling',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Inspect iOS MobileBackup archives and Sysdiagnose bundles (structured device diagnostic snapshots) for anomalous IMAgent attachment processing immediately followed by automated message deletion without corresponding user interaction.',
      },
      2: {
        storyAnalogy:
          'Facing silicon-level armor designed to stop even a hijacked building manager from rewriting locked guard vaults, the intruder speaks directly to an undocumented secret hardware dial hidden inside the phone\'s silicon chip to slip straight around the memory shield.',
        storyMappings: [
          {
            storyTerm: 'Silicon-level armor guarding locked vault rooms',
            technicalTerm: 'Apple Page Protection Layer (PPL) hardware memory integrity enforcement',
            tone: 'amber',
          },
          {
            storyTerm: 'Undocumented secret hardware dial',
            technicalTerm: 'Undocumented Apple SoC MMIO hash/DMA registers exploited via CVE-2023-38606',
            tone: 'sky',
          },
          {
            storyTerm: 'Rewriting protected core vault rooms directly',
            technicalTerm: 'Hardware-assisted bypass achieving full root and kernel code execution on iOS',
            tone: 'rose',
          },
          {
            storyTerm: 'Four-stage chained lockpick sequence',
            technicalTerm: 'Chained WebKit, Font, Kernel, and Hardware MMIO exploits in Operation Triangulation',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Sweeping away the original message envelope so the phone chat history looks completely untouched, the spy deploys a purely memory-resident listening post that records microphone audio, location, and keychain secrets until a reboot wipes RAM clean.',
        storyMappings: [
          {
            storyTerm: 'Sweeping away the original message envelope',
            technicalTerm: 'Automated deletion of the triggering iMessage and attachment from SMS.db',
            tone: 'amber',
          },
          {
            storyTerm: 'Memory-resident listening post lost on reboot',
            technicalTerm: 'TriangleDB volatile RAM-only iOS spyware implant harvesting keychain and audio',
            tone: 'sky',
          },
          {
            storyTerm: 'Leftover watermarks in phone billing and analytics diaries',
            technicalTerm: 'Orphaned network rows in DataUsage.sqlite and missing timestamp gaps in OSAnalytics',
            tone: 'rose',
          },
          {
            storyTerm: 'Specialized forensic detector',
            technicalTerm: 'Kaspersky triangle_check offline iTunes backup scanner flagging Triangulation IoCs',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Run Kaspersky triangle_check against offline iOS backups (automated forensic artifact triage) to detect orphaned network usage entries in DataUsage.sqlite for system processes and telltale timestamp gaps in OSAnalytics logs.',
      },
    },
  };
