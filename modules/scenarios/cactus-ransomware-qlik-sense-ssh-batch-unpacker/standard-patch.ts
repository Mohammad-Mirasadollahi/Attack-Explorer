import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a stealthy burglar who sneaks through a warped side tunnel inside an analytics server and bolts a permanent hidden skylight onto the building schedule so they can return anytime. Rather than carrying an exposed lockpicker that guards immediately recognize, the burglar drops a password-locked suitcase onto every desk, unpacks a scrambled inner box using a secret key at runtime, and marks each file twice (first with an in-progress tag while taking tiny sips of data, then with a finished lock tag once sealed).',
      storyMappings: [
        {
          storyTerm: 'Warped side tunnel and permanent hidden skylight on the schedule',
          technicalTerm: 'Qlik Sense CVE-2023-41265 tunneling RCE and persistent OpenSSH scheduled task',
          tone: 'amber',
        },
        {
          storyTerm: 'Password-locked suitcase unpacking a scrambled inner box at runtime',
          technicalTerm: '7z.exe archive extraction and self-decrypting Cactus binary via -i AES key',
          tone: 'sky',
        },
        {
          storyTerm: 'Marking each file in-progress then finished while taking tiny sips',
          technicalTerm: 'Multi-stream micro-read encryption renaming files from .cts0 to .cts1',
          tone: 'rose',
        },
        {
          storyTerm: 'Extortion letter dropped across sealed rooms',
          technicalTerm: 'cAcTuS.readme.txt ransom note generated after completion',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Exploiting a bent routing tunnel inside a public analytics portal, the burglar slips straight into the back office and wires a repeating scheduled task that keeps a private encrypted back door propped open outward toward their own server.',
        storyMappings: [
          {
            storyTerm: 'Bent routing tunnel inside an analytics portal',
            technicalTerm: 'Qlik Sense Enterprise HTTP request tunneling and path traversal (CVE-2023-41265)',
            tone: 'amber',
          },
          {
            storyTerm: 'Repeating scheduled task holding a skylight open',
            technicalTerm: 'Scheduled task maintaining a persistent reverse OpenSSH tunnel',
            tone: 'sky',
          },
          {
            storyTerm: 'Bypassing inbound perimeter doors',
            technicalTerm: 'Outbound SSH reverse tunnel surviving perimeter IP blocks',
            tone: 'rose',
          },
          {
            storyTerm: 'Staging ground for enterprise spread',
            technicalTerm: 'Compromised analytics server used to pivot into Active Directory',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'To fool hallway security inspectors who X-ray every file sitting on disk, the crew sprays a locked archive across every workstation, unzips it with a batch script, and passes an unlocking key directly on the command line so the padlocking machine only unscrambles itself inside live working memory.',
        storyMappings: [
          {
            storyTerm: 'Spraying a locked archive across every workstation',
            technicalTerm: 'PowerShell sprayer (s.ps1) and PsExec distributing a password-protected 7-Zip archive',
            tone: 'amber',
          },
          {
            storyTerm: 'Unzipping with a batch helper script',
            technicalTerm: '7z.exe extracting the encrypted Cactus payload (ntuser.dat) on target hosts',
            tone: 'sky',
          },
          {
            storyTerm: 'Unlocking key passed on the command line',
            technicalTerm: 'Mandatory -i flag supplying the AES key for runtime self-decryption',
            tone: 'rose',
          },
          {
            storyTerm: 'Defeating static X-ray inspection on disk',
            technicalTerm: 'Encrypted on-disk payload remaining unreadable to static AV signatures until -i runs',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Running in quiet multi-stream mode, the unscrambled encryptor takes small sips of each file so heavy disk-thrashing alarms stay calm, tagging active files with a temporary work badge before flipping them to a final sealed tag and leaving its signature cactus ransom card.',
        storyMappings: [
          {
            storyTerm: 'Taking small sips so disk-thrashing alarms stay calm',
            technicalTerm: 'Multi-stream micro-read encryption under the -r flag evading I/O spike heuristics',
            tone: 'amber',
          },
          {
            storyTerm: 'Temporary work badge during active locking',
            technicalTerm: 'Target files temporarily renamed to .cts0 while encryption is underway',
            tone: 'sky',
          },
          {
            storyTerm: 'Final sealed tag upon completion',
            technicalTerm: 'Completed encrypted files renamed from .cts0 to .cts1',
            tone: 'rose',
          },
          {
            storyTerm: 'Signature cactus ransom card',
            technicalTerm: 'Dropped cAcTuS.readme.txt extortion demand file',
            tone: 'emerald',
          },
        ],
      },
    },
  };
