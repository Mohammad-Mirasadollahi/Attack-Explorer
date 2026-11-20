import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a successor heist crew that buys the blueprint of an infamous retired vault-cracking machine and upgrades it to run even cleaner and quieter. First, they send remote maintenance orders to wipe backup catalogs; next, instead of loudly shouting the usual shadow-shredder command that wakes every hallway guard, they quietly walk up to the vault backup engine itself and whisper a direct internal delete order; finally, they run a fast multi-lane Rust padlocking press and sweep the empty floor clean so deleted scraps can never be pieced back together.',
      storyMappings: [
        {
          storyTerm: 'Sending remote orders to wipe backup catalogs',
          technicalTerm: 'SharpWMI.exe lateral execution invoking wbadmin delete catalog',
          tone: 'amber',
        },
        {
          storyTerm: 'Whispering a direct internal delete order instead of shouting',
          technicalTerm: 'Commandless COM IVssBackupComponents::DeleteSnapshots bypassing vssadmin CLI alerts',
          tone: 'sky',
        },
        {
          storyTerm: 'Upgraded multi-lane Rust padlocking press',
          technicalTerm: 'Hunters International Rust encryptor evolved from Hive codebase (.locked)',
          tone: 'rose',
        },
        {
          storyTerm: 'Sweeping empty floor space so scraps cannot be recovered',
          technicalTerm: 'Free-space wiping after encryption alongside Contact Us.txt ransom notes',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'From a hijacked supervisor desk, the crew dispatches lightweight remote management commands down the corporate wiring to erase the building official backup directory catalog before any locking begins.',
        storyMappings: [
          {
            storyTerm: 'Hijacked supervisor desk',
            technicalTerm: 'Compromised administrative workstation initiating lateral movement',
            tone: 'amber',
          },
          {
            storyTerm: 'Lightweight remote management orders',
            technicalTerm: 'SharpWMI.exe executing remote commands over WMI across domain servers',
            tone: 'sky',
          },
          {
            storyTerm: 'Erasing the official backup directory catalog',
            technicalTerm: 'wbadmin delete catalog removing Windows Backup recovery metadata',
            tone: 'rose',
          },
          {
            storyTerm: 'Clearing the runway for extortion',
            technicalTerm: 'Eliminating server-level recovery options prior to mass encryption',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Knowing that security sensors watch closely for the noisy standard shadow-copy command tool, the Rust program skips the command line altogether and speaks directly to the operating system internal backup clerk through its private office door to erase every snapshot in silence.',
        storyMappings: [
          {
            storyTerm: 'Skipping the noisy command line altogether',
            technicalTerm: 'Avoiding vssadmin.exe delete shadows and wmic.exe shadowcopy delete SIEM rules',
            tone: 'amber',
          },
          {
            storyTerm: 'Speaking directly through the backup clerk private door',
            technicalTerm: 'Direct COM API call to IVssBackupComponents::DeleteSnapshots in memory',
            tone: 'sky',
          },
          {
            storyTerm: 'Erasing every snapshot in silence',
            technicalTerm: 'Commandless Volume Shadow Copy deletion leaving zero CLI process artifacts',
            tone: 'rose',
          },
          {
            storyTerm: 'Catching the quiet internal call',
            technicalTerm: 'Monitoring VSS EventID 8224 / COM telemetry rather than CLI strings alone',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'With every backup gone, the streamlined Rust locking press races across every storage aisle sealing files under a locked tag, scrubs blank shelf space to prevent undelete forensics, and leaves neat negotiation cards in every cabinet.',
        storyMappings: [
          {
            storyTerm: 'Streamlined Rust locking press evolved from Hive',
            technicalTerm: 'Hunters International multi-threaded Rust encryptor simplifying Hive encryption',
            tone: 'amber',
          },
          {
            storyTerm: 'Scrubbing blank shelf space against undelete tools',
            technicalTerm: 'Post-encryption free-space wiping preventing forensic carving of plaintext files',
            tone: 'sky',
          },
          {
            storyTerm: 'Locked tag stamped on every file',
            technicalTerm: 'Encrypted documents renamed with the .locked extension',
            tone: 'rose',
          },
          {
            storyTerm: 'Negotiation cards left in every cabinet',
            technicalTerm: 'Contact Us.txt extortion note directing victims to leak-site chat',
            tone: 'emerald',
          },
        ],
      },
    },
  };
