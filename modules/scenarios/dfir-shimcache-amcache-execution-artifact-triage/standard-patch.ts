import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder who runs a disposable burglary tool on a server and immediately incinerates the tool afterward so no file remains on the shelf. Unbeknownst to the intruder, the operating system built-in compatibility inspector silently logs every passing binary in two separate ledgers: one ledger preserves the exact fingerprint hash and structural measurements of the vanished tool, while the second ledger records the exact chronological parade order in which tools appeared across reboots.',
      storyMappings: [
        {
          storyTerm: 'Disposable tool incinerated right after running',
          technicalTerm: 'Ephemeral attacker binary executed then deleted to evade on-disk scanners',
          tone: 'amber',
        },
        {
          storyTerm: 'Compatibility inspector watching every arriving tool in memory',
          technicalTerm: 'Kernel ApphelpCacheControl tracking binary metadata during process launch',
          tone: 'sky',
        },
        {
          storyTerm: 'First ledger preserving exact fingerprint hash and measurements',
          technicalTerm: 'Amcache.hve InventoryApplicationFile storing SHA-1 hash, PE size, and link timestamp',
          tone: 'rose',
        },
        {
          storyTerm: 'Second ledger recording chronological parade order across reboots',
          technicalTerm: 'SYSTEM hive AppCompatCache (Shimcache 10ts signature) ordered execution/presence timeline',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'The instant the intruder executes their temporary reconnaissance or dumping utility and quickly deletes it from disk, the operating system compatibility engine still quietly notes its arrival inside kernel memory to check whether legacy patches are needed.',
        storyMappings: [
          {
            storyTerm: 'Temporary utility executed and quickly deleted',
            technicalTerm: 'Ephemeral PE executable staged in C:\\Windows\\Temp and removed post-run',
            tone: 'amber',
          },
          {
            storyTerm: 'Operating system compatibility engine checking legacy needs',
            technicalTerm: 'NT kernel ApphelpCacheControl caching PE path and LastModified metadata in RAM',
            tone: 'sky',
          },
          {
            storyTerm: 'Flushed permanently upon graceful shutdown',
            technicalTerm: 'In-memory Shimcache serialized to the SYSTEM registry hive at OS shutdown/reboot',
            tone: 'rose',
          },
          {
            storyTerm: 'Proof surviving complete file deletion',
            technicalTerm: 'Evidence of binary presence and execution even when zero bytes remain on disk',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Opening the dedicated Application Inventory ledger kept by the operating system, forensic analysts recover the exact cryptographic fingerprint, file size, and compilation date of the deleted attacker binary so they can match it straight against global threat intelligence.',
        storyMappings: [
          {
            storyTerm: 'Dedicated Application Inventory ledger',
            technicalTerm: 'C:\\Windows\\AppCompat\\Programs\\Amcache.hve registry hive',
            tone: 'amber',
          },
          {
            storyTerm: 'Exact cryptographic fingerprint of the deleted binary',
            technicalTerm: 'InventoryApplicationFile FileId field preserving the exact SHA-1 hash (0000<sha1>)',
            tone: 'sky',
          },
          {
            storyTerm: 'Structural file measurements',
            technicalTerm: 'Recorded PE Size, BinaryType, Publisher (unsigned), and LinkDate metadata',
            tone: 'rose',
          },
          {
            storyTerm: 'Matching vanished binaries to threat intelligence',
            technicalTerm: 'Querying Amcache SHA-1 hashes against VirusTotal and YARA intel repositories',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Next, analysts examine the SYSTEM Compatibility Cache ribbon stamped with its signature 10ts header, reading the exact ordered sequence of binaries to reconstruct which tools ran right before and right after the deleted payload.',
        storyMappings: [
          {
            storyTerm: 'Compatibility Cache ribbon stamped with 10ts header',
            technicalTerm: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache (10ts header)',
            tone: 'amber',
          },
          {
            storyTerm: 'Reading the exact ordered sequence of binaries',
            technicalTerm: 'AppCompatCacheParser reconstructing relative chronological execution order',
            tone: 'sky',
          },
          {
            storyTerm: 'Distinguishing LastModified time from execution time',
            technicalTerm: 'Understanding Shimcache stores PE $SI LastModified while entry order reflects execution sequence',
            tone: 'rose',
          },
          {
            storyTerm: 'Bridging missing event-log gaps',
            technicalTerm: 'Proving intrusion tool sequence even after Event Logs rolled over or were cleared',
            tone: 'emerald',
          },
        ],
      },
    },
  };
