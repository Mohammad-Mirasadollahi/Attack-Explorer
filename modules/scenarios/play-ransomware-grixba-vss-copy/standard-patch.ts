import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a disciplined burglary crew that arrives in three quiet waves. First, they send a custom mechanical scout tucked inside a music closet to map every guard station and storage room; next, they use a custom instant-camera lens to photocopy bolted-down database ledgers without waking normal backup clerks; finally, they push a nimble lock-crew across every floor that snaps a padlock on alternating pages of every large filing cabinet so the whole building freezes at lightning speed.',
      storyMappings: [
        {
          storyTerm: 'Custom mechanical scout tucked inside a music closet',
          technicalTerm: 'Grixba .NET reconnaissance scanner (C:\\Users\\Public\\Music\\inf_g.exe)',
          tone: 'amber',
        },
        {
          storyTerm: 'Custom instant-camera lens photocopying bolted ledgers',
          technicalTerm: 'AlphaVSS.x64.dll and AlphaFS.dll mounting Volume Shadow Copies directly via COM',
          tone: 'sky',
        },
        {
          storyTerm: 'Bypassing lobby camera tripwires before locking cabinets',
          technicalTerm: 'PEB dynamic API resolution and userland API unhooking inside Play encryptor',
          tone: 'rose',
        },
        {
          storyTerm: 'Padlocking alternating pages across every cabinet at lightning speed',
          technicalTerm: 'Intermittent 0x100000-byte stride encryption appending .play and 0xdeadbeef footer',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Dropping a self-contained scouting robot into a public media folder, the crew maps every connected computer, active guard software, and backup server across the campus in a single clean sweep.',
        storyMappings: [
          {
            storyTerm: 'Self-contained scouting robot in a public media folder',
            technicalTerm: 'Unsigned .NET Costura-packed Grixba scanner staged at C:\\Users\\Public\\Music\\inf_g.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Full-sweep scouting orders',
            technicalTerm: 'Command-line flags -m:all or -m:s instructing full domain and AV enumeration',
            tone: 'sky',
          },
          {
            storyTerm: 'Mapped guard stations and backup vaults',
            technicalTerm: 'Exported CSV inventory of endpoints, AV products, and Veeam/backup servers',
            tone: 'rose',
          },
          {
            storyTerm: 'Bundled spare parts hidden inside one shell',
            technicalTerm: 'Costura.Fody embedded .NET assemblies loaded directly from memory',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Sysmon EventID 1 (Process Creation) and EventID 7 (Image Loaded tracking DLL assemblies) flagging unsigned .NET binaries executing from C:\\Users\\Public\\Music\\ that load embedded Costura assemblies with -m:all or -m:s discovery flags (catching Play Grixba reconnaissance).',
      },
      2: {
        storyAnalogy:
          'Because live corporate databases stay clamped shut while clerks are working, the crew slips a pair of specialized shadow-camera helper lenses into their own toolkit to lift clean copies of locked password ledgers and accounting books without calling the noisy standard shadow-copy tool.',
        storyMappings: [
          {
            storyTerm: 'Pair of specialized shadow-camera helper lenses',
            technicalTerm: 'AlphaVSS.x64.dll (shadow copy COM wrapper) and AlphaFS.dll (long-path volume I/O)',
            tone: 'amber',
          },
          {
            storyTerm: 'Clamped-shut corporate ledgers',
            technicalTerm: 'Exclusively locked C:\\Windows\\NTDS\\ntds.dit and live SQL Server .mdf databases',
            tone: 'sky',
          },
          {
            storyTerm: 'Skipping the noisy standard shadow-copy tool',
            technicalTerm: 'Direct IVssBackupComponents COM invocation bypassing vssadmin.exe CLI alerts',
            tone: 'rose',
          },
          {
            storyTerm: 'Quiet extraction before extortion',
            technicalTerm: 'Staged database theft fueling Play double-extortion pressure',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Sysmon EventID 7 (Image Loaded recording every DLL mapped into memory) for AlphaVSS.x64.dll or AlphaFS.dll alongside Windows VSSEvent operational logs flagging non-backup binaries invoking IVssBackupComponents (exposing covert locked-file theft).',
      },
      3: {
        storyAnalogy:
          'Broadcast across every floor via the building master policy board, the Play lock-crew wipes off the security monitors inspection tape from its own tools and races through every filing cabinet locking alternating one-megabyte blocks so massive archives become unusable in mere seconds.',
        storyMappings: [
          {
            storyTerm: 'Master policy board broadcasting across every floor',
            technicalTerm: 'Active Directory Group Policy Object (GPO) pushing Play ransomware domain-wide',
            tone: 'amber',
          },
          {
            storyTerm: 'Wiping security inspection tape off its own tools',
            technicalTerm: 'Dynamic PEB API resolution and userland EDR hook removal',
            tone: 'sky',
          },
          {
            storyTerm: 'Locking alternating one-megabyte blocks at high speed',
            technicalTerm: 'Intermittent 0x100000-byte stride encryption maximizing corruption velocity',
            tone: 'rose',
          },
          {
            storyTerm: 'Calling card stamped at the bottom of every file',
            technicalTerm: '.play filename extension paired with an embedded 0xdeadbeef file footer marker',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy filesystem minifilter behavioral monitors (kernel-level disk I/O sensors that inspect write patterns in real time) to detect rapid 0x100000-byte stride partial file overwrites, .play extension renames, and trailing 0xdeadbeef file footers.',
      },
    },
  };
