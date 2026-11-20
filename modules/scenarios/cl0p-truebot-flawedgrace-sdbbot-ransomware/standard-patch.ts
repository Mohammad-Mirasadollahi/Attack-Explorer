import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a veteran corporate heist syndicate that moves with industrial precision. First, they slip a quiet scout into the lobby to unlock a full remote-control toolkit; next, they stride down to the master switchboard with a tiny command launcher and flip off over six hundred different database, backup, and office services so zero locks hold any files open; finally, they unleash dedicated locking teams down every local aisle and shared storage hallway simultaneously to clamp every vault shut.',
      storyMappings: [
        {
          storyTerm: 'Quiet lobby scout unlocking a full remote-control toolkit',
          technicalTerm: 'TrueBot (Silence.Downloader) deploying FlawedGrace and SDBbot RAT implants',
          tone: 'amber',
        },
        {
          storyTerm: 'Tiny command launcher flipping off six hundred building services',
          technicalTerm: 'TinyMet lateral stager followed by mass net stop termination of 600+ services',
          tone: 'sky',
        },
        {
          storyTerm: 'Dedicated locking teams sweeping local aisles and shared hallways',
          technicalTerm: 'Multi-threaded CL0P worker threads encrypting local drives and SMB shares',
          tone: 'rose',
        },
        {
          storyTerm: 'Branded vault locks and printed extortion demand',
          technicalTerm: 'RC4/AES + RSA-1024 encryption appending .CIop and dropping ClopReadMe.txt',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Entering through a crafted email lure or a perimeter file-transfer flaw, the syndicate wakes up a nimble download scout that fingerprints the office network and quietly brings inside full-featured espionage puppets.',
        storyMappings: [
          {
            storyTerm: 'Nimble download scout fingerprinting the network',
            technicalTerm: 'TrueBot (Silence.Downloader) executed after spearphishing or MFT/web zero-days',
            tone: 'amber',
          },
          {
            storyTerm: 'Full-featured espionage puppets brought inside',
            technicalTerm: 'FlawedGrace and SDBbot Remote Access Trojans establishing interactive C2',
            tone: 'sky',
          },
          {
            storyTerm: 'Seasoned financial syndicate operators',
            technicalTerm: 'TA505 / FIN11 threat actors orchestrating enterprise-scale intrusion',
            tone: 'rose',
          },
          {
            storyTerm: 'Mapping high-value servers quietly',
            technicalTerm: 'Active Directory reconnaissance identifying Domain Controllers and file servers',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Pivoting straight into the central server room with a featherweight command stager, the syndicate runs down a massive checklist of over six hundred database engines, accounting apps, and security monitors, shutting every single one down so every file lock falls open.',
        storyMappings: [
          {
            storyTerm: 'Featherweight command stager pivoting to core servers',
            technicalTerm: 'TinyMet (minimal Meterpreter/Cobalt Strike stager) reaching Domain Controllers',
            tone: 'amber',
          },
          {
            storyTerm: 'Massive checklist of six hundred services shut down',
            technicalTerm: 'Automated net stop and process kill loops targeting 600+ DB, backup, and AV services',
            tone: 'sky',
          },
          {
            storyTerm: 'Releasing every active file lock',
            technicalTerm: 'Ensuring live SQL, Exchange, and backup files can be encrypted cleanly',
            tone: 'rose',
          },
          {
            storyTerm: 'Distinctive noisy precursor right before impact',
            technicalTerm: 'Rapid burst of Windows Service Control Manager stop events (EventID 7036)',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Unleashing dedicated parallel locking squads across every local drive and every mapped corporate file hall at once, the crew clamps fast symmetric locks wrapped inside a master asymmetric seal onto every document and posts their ransom letter on every floor.',
        storyMappings: [
          {
            storyTerm: 'Dedicated parallel locking squads across local and shared halls',
            technicalTerm: 'Dedicated CL0P worker threads for local volumes and enumerated SMB network shares',
            tone: 'amber',
          },
          {
            storyTerm: 'Fast locks wrapped inside a master asymmetric seal',
            technicalTerm: 'RC4/AES file encryption with per-file keys protected by RSA-1024',
            tone: 'sky',
          },
          {
            storyTerm: 'Signature deceptive extension tag',
            technicalTerm: 'Encrypted files renamed with the .CIop extension (capital I mimicking lowercase l)',
            tone: 'rose',
          },
          {
            storyTerm: 'Extortion letter posted on every floor',
            technicalTerm: 'ClopReadMe.txt ransom note placed across affected directories',
            tone: 'emerald',
          },
        ],
      },
    },
  };
