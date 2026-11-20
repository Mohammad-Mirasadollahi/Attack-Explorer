import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a museum thief who sneaks a freshly forged painting into a gallery and alters the small brass date plaque on the front frame to read ten years ago so casual visitors assume it has always hung there. Unbeknownst to the thief, the museum core structural catalog keeps a second, tamper-proof shipping date sealed deep inside the wall frame that ordinary tools cannot touch, instantly exposing the forgery the moment curators compare the front plaque against the hidden wall stamp.',
      storyMappings: [
        {
          storyTerm: 'Tamper-proof shipping date sealed deep inside the wall frame',
          technicalTerm: 'NTFS $MFT $FILE_NAME (0x30) creation timestamp modifiable only by the NT kernel',
          tone: 'amber',
        },
        {
          storyTerm: 'Altering the front frame brass date plaque to ten years ago',
          technicalTerm: 'User-mode NtSetInformationFile timestomping $STANDARD_INFORMATION (0x10) (Sysmon EventID 2)',
          tone: 'sky',
        },
        {
          storyTerm: 'Curators spotting a front plaque older than the wall stamp',
          technicalTerm: 'Offline $MFT forensic rule flagging $SI Created < $FN Created anomaly',
          tone: 'rose',
        },
        {
          storyTerm: 'Suspiciously rounded zero-second chisel marks on the plaque',
          technicalTerm: 'Sub-second nanosecond zeroing (.0000000) left by crude timestomping tools',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'The moment the intruder drops their malware binary onto the hard drive, the filesystem kernel stamps the true arrival date simultaneously onto both the public front plaque and the hidden kernel-protected inner shipping card.',
        storyMappings: [
          {
            storyTerm: 'Public front plaque shown by everyday tools',
            technicalTerm: 'NTFS $MFT $STANDARD_INFORMATION (attribute 0x10) timestamps viewed by dir / Explorer',
            tone: 'amber',
          },
          {
            storyTerm: 'Hidden kernel-protected inner shipping card',
            technicalTerm: 'NTFS $MFT $FILE_NAME (attribute 0x30) timestamps updated exclusively by the kernel',
            tone: 'sky',
          },
          {
            storyTerm: 'True arrival date recorded at file birth',
            technicalTerm: 'Matching initial creation timestamps across both 0x10 and 0x30 MFT attributes',
            tone: 'rose',
          },
          {
            storyTerm: 'Master building catalog storing every file record',
            technicalTerm: 'NTFS Master File Table ($MFT) tracking 1024-byte metadata records per file',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Trying to blend their brand-new implant among decade-old operating-system utilities, the intruder runs a backdating tool that rewrites the public front plaque to match an old system binary while a watchful security camera logs the exact moment the date was faked.',
        storyMappings: [
          {
            storyTerm: 'Backdating tool rewriting the public front plaque',
            technicalTerm: 'User-mode NtSetInformationFile / SetFileTime altering $STANDARD_INFORMATION (0x10)',
            tone: 'amber',
          },
          {
            storyTerm: 'Matching an old trusted system utility date',
            technicalTerm: 'Copying CreationTime from cmd.exe or kernel32.dll onto the dropped payload',
            tone: 'sky',
          },
          {
            storyTerm: 'Security camera logging the fake date swap',
            technicalTerm: 'Sysmon EventID 2 (File creation time changed) recording CreationUtcTime vs PreviousCreationUtcTime',
            tone: 'rose',
          },
          {
            storyTerm: 'Inner kernel card left completely untouched',
            technicalTerm: '$FILE_NAME (0x30) retaining the true recent file creation timestamp',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Pulling the raw Master File Table offline, the forensic examiner immediately compares every file front date against its hidden inner shipping date, catching both impossible backward time-travel mismatches and unnaturally crisp zero-nanosecond endings.',
        storyMappings: [
          {
            storyTerm: 'Impossible backward time-travel mismatch',
            technicalTerm: 'Offline MFTECmd analysis proving $SI (0x10) Created timestamp is earlier than $FN (0x30) Created',
            tone: 'amber',
          },
          {
            storyTerm: 'Unnaturally crisp zero-nanosecond endings',
            technicalTerm: 'Exact .0000000 sub-second fractional zeros caused by low-precision API timestomping',
            tone: 'sky',
          },
          {
            storyTerm: 'True timeline reconstructed for the court report',
            technicalTerm: 'Correlating $FN (0x30) creation time with $UsnJrnl to pinpoint exact drop time',
            tone: 'rose',
          },
          {
            storyTerm: 'Defeating anti-forensic timeline confusion',
            technicalTerm: 'Proving deliberate MITRE T1070.006 timestomping tampering',
            tone: 'emerald',
          },
        ],
      },
    },
  };
