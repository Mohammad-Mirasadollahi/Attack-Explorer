import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a wartime saboteur who is not after ransom money at all, but wants every computer in an organization turned into a permanent brick before sunrise. First, the saboteur unpacks an authentic, validly signed disk-partitioning guard badge from its own coat pocket to gain direct physical access to the raw floor tiles; next, it disables every backup and crash log while shattering the building index directory; finally, it smashes the front entrance map of every hard drive with pure random static so no floor can ever start up again.',
      storyMappings: [
        {
          storyTerm: 'Unpacking a validly signed disk-partitioning badge from its pocket',
          technicalTerm: 'Extracting signed EaseUS empntdrv.sys driver from PE RCDATA resource (BYOVD)',
          tone: 'amber',
        },
        {
          storyTerm: 'Disabling backups and shattering the building index directory',
          technicalTerm: 'Stopping Volume Shadow Copy (vss) and fragmenting NTFS $MFT and metadata files',
          tone: 'sky',
        },
        {
          storyTerm: 'Smashing every drive entrance map with pure random static',
          technicalTerm: 'Overwriting \\\\.\\PhysicalDrive0..100 MBR and NTFS $MFT with CSPRNG bytes',
          tone: 'rose',
        },
        {
          storyTerm: 'Turning every machine into a permanent brick before sunrise',
          technicalTerm: 'Destructive Sandworm wiper attack forcing unbootable system reboot',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Pushed simultaneously across hundreds of offices by the central policy board, the saboteur unlocks special driver-loading clearance, pulls an authentic signed disk-utility driver out of its own hidden pocket, and bolts it straight into the building core engine.',
        storyMappings: [
          {
            storyTerm: 'Unlocking special driver-loading clearance',
            technicalTerm: 'Enabling SeLoadDriverPrivilege, SeBackupPrivilege, and SeShutdownPrivilege tokens',
            tone: 'amber',
          },
          {
            storyTerm: 'Pulling an authentic disk-utility driver from its hidden pocket',
            technicalTerm: 'Decompressing embedded signed EaseUS empntdrv.sys from PE RCDATA resource',
            tone: 'sky',
          },
          {
            storyTerm: 'Bolting it into the building core engine',
            technicalTerm: 'Registering C:\\Windows\\System32\\drivers\\??dr.sys signed by CHENGDU YIWO Tech',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypassing modern storage locks',
            technicalTerm: 'Gaining unrestricted Ring-0 raw physical disk write capability via BYOVD',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 6 (DriverLoaded tracking kernel driver signatures and file paths) for empntdrv.sys or randomized C:\\Windows\\System32\\drivers\\??dr.sys binaries signed by CHENGDU YIWO Tech Development Co., Ltd. (the exact EaseUS driver abused by HermeticWiper).',
      },
      2: {
        storyAnalogy:
          'Before swinging the sledgehammer, the saboteur pulls the power plugs on the building automatic backup vault and crash-diary recorder, then deliberately shatters the floor index catalog into thousands of broken fragments so recovery teams cannot piece files back together.',
        storyMappings: [
          {
            storyTerm: 'Pulling power plugs on the backup vault and crash recorder',
            technicalTerm: 'ChangeServiceConfigW and ControlService disabling Volume Shadow Copy (vss) and crash dumps',
            tone: 'amber',
          },
          {
            storyTerm: 'Shattering the floor index catalog into fragments',
            technicalTerm: 'Fragmenting NTFS metadata structures ($Bitmap, $LogFile, $MFT) across disks',
            tone: 'sky',
          },
          {
            storyTerm: 'Preventing forensic recovery teams from rebuilding files',
            technicalTerm: 'Destroying filesystem allocation maps prior to raw sector wiping',
            tone: 'rose',
          },
          {
            storyTerm: 'Covering every internal storage room',
            technicalTerm: 'Targeting all attached local and mounted Windows NTFS volumes',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Walking methodically from storage bay zero up to bay one hundred, the saboteur uses its raw disk pass to blast every drive opening directory and master file catalog with irreversible random noise, then flips the building power breaker so no machine ever boots again.',
        storyMappings: [
          {
            storyTerm: 'Walking from storage bay zero up to bay one hundred',
            technicalTerm: 'Iterating handles across \\\\.\\PhysicalDrive0 through \\\\.\\PhysicalDrive100',
            tone: 'amber',
          },
          {
            storyTerm: 'Blasting opening directories with irreversible random noise',
            technicalTerm: 'CryptGenRandom CSPRNG bytes overwriting MBR sector 0 and NTFS $MFT',
            tone: 'sky',
          },
          {
            storyTerm: 'Flipping the building power breaker',
            technicalTerm: 'Forced InitiateSystemShutdownEx locking victims out of unbootable hosts',
            tone: 'rose',
          },
          {
            storyTerm: 'Pre-emptive shield blocking raw disk strikes',
            technicalTerm: 'WDAC driver blocklist for empntdrv.sys and EDR blocking raw WriteFile to sector 0',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Block empntdrv.sys via Windows Defender Application Control (WDAC kernel driver allowlisting) and enforce EDR kernel disk filters blocking unauthorized raw WriteFile operations targeting sector 0 of \\\\.\\PhysicalDrive* (stopping MBR destruction mid-flight).',
      },
    },
  };
