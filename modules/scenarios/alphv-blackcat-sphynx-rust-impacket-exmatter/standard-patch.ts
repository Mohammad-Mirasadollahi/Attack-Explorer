import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a disciplined heist syndicate carrying three precision tools across a corporate campus. First, a silent courier sweeps high-value folders out to an external van and burns its own footprints behind it; next, the syndicate unlocks a locked briefcase using a unique job passcode, opens cross-room shortcut paths, and shreds every backup binder; finally, the briefcase automatically copies itself down every corridor and basement server rack to snap fast modern locks across both office desks and virtual servers at once.',
      storyMappings: [
        {
          storyTerm: 'Silent courier sweeping folders out and burning its footprints',
          technicalTerm: 'ExMatter .NET exfiltration tool staging data and self-erasing prior to encryption',
          tone: 'amber',
        },
        {
          storyTerm: 'Unlocking a briefcase with a unique job passcode and opening shortcuts',
          technicalTerm: 'Rust BlackCat/Sphynx -k <access_token>, fsutil R2R symlink enablement, and shadow wipe',
          tone: 'sky',
        },
        {
          storyTerm: 'Copying itself automatically down every corridor and basement rack',
          technicalTerm: 'Embedded NetExec/Impacket --propagate PsExec worm and ESXi VM termination',
          tone: 'rose',
        },
        {
          storyTerm: 'Fast modern locks snapped across desks and virtual servers',
          technicalTerm: 'Cross-platform Rust AES-CTR and ChaCha20 encryption across Windows and ESXi',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Before locking a single door, the affiliate deploys a quiet file-gathering courier disguised as routine office paperwork that filters out junk, packs high-value contracts onto an external truck, and erases its own executable file when finished.',
        storyMappings: [
          {
            storyTerm: 'Quiet file-gathering courier disguised as routine paperwork',
            technicalTerm: 'Compiled .NET ExMatter utility enumerating high-value file extensions',
            tone: 'amber',
          },
          {
            storyTerm: 'Packing contracts onto an external truck',
            technicalTerm: 'Automated SFTP/WebDAV exfiltration to affiliate-controlled servers',
            tone: 'sky',
          },
          {
            storyTerm: 'Erasing its own footprints upon completion',
            technicalTerm: 'Self-deletion routine overwriting or removing the ExMatter binary post-theft',
            tone: 'rose',
          },
          {
            storyTerm: 'Double-extortion leverage secured first',
            technicalTerm: 'Stolen corporate data guaranteed before noisy encryption triggers alarms',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The operator unlocks the Rust padlocking briefcase by typing a secret job token on the command line (keeping the inner blueprint scrambled from curious analysts), flips a building shortcut switch so linked remote hallways stay reachable, and shreds every backup snapshot.',
        storyMappings: [
          {
            storyTerm: 'Secret job token unlocking the scrambled briefcase',
            technicalTerm: 'Mandatory -k <access_token> CLI key deriving the internal ChaCha20 config key',
            tone: 'amber',
          },
          {
            storyTerm: 'Flipping a building shortcut switch for remote hallways',
            technicalTerm: 'fsutil behavior set SymlinkEvaluation R2L:1 R2R:1 enabling remote symlink traversal',
            tone: 'sky',
          },
          {
            storyTerm: 'Shredding every backup snapshot',
            technicalTerm: 'vssadmin / WMI Volume Shadow Copy deletion and event log clearing',
            tone: 'rose',
          },
          {
            storyTerm: 'Scrambling the blueprint against casual inspection',
            technicalTerm: 'Encrypted embedded JSON affiliate configuration protecting credentials and keys',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Armed with stolen master passes packed inside its own pocket, the briefcase marches itself down every office hallway and into the basement hypervisor room, halting running virtual servers and locking both Windows offices and Linux server pods simultaneously.',
        storyMappings: [
          {
            storyTerm: 'Marching itself down every office hallway',
            technicalTerm: 'Built-in --propagate routine using embedded Impacket/PsExec over SMB with harvested creds',
            tone: 'amber',
          },
          {
            storyTerm: 'Halting running virtual servers in the basement',
            technicalTerm: 'Automated ESXi esxcli vm process kill releasing virtual disk locks',
            tone: 'sky',
          },
          {
            storyTerm: 'Locking both Windows offices and Linux pods simultaneously',
            technicalTerm: 'Multi-threaded Rust AES-CTR and ChaCha20 encryption across platforms',
            tone: 'rose',
          },
          {
            storyTerm: 'Hardware-accelerated locking speed',
            technicalTerm: 'Dynamic selection of AES-NI hardware cipher or ChaCha20 software fallback',
            tone: 'emerald',
          },
        ],
      },
    },
  };
