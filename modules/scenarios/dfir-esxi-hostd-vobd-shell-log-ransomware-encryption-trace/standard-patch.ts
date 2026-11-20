import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a huge warehouse holding dozens of locked steel office pods stacked on one master concrete foundation. An intruder logs into the warehouse basement console with stolen superintendent keys, pulls the emergency power cord on every running office pod so their steel floor bolts spring open, and runs a high-speed partial padlocking tool across every pod shell while three separate basement logbooks quietly record every command, every shutdown, and every tampered descriptor.',
      storyMappings: [
        {
          storyTerm: 'Logging into the warehouse basement console with superintendent keys',
          technicalTerm: 'Root SSH login or DCUI ESXi Shell activation recorded in /var/log/auth.log and shell.log',
          tone: 'amber',
        },
        {
          storyTerm: 'Pulling the emergency power cord so steel floor bolts spring open',
          technicalTerm: 'esxcli vm process kill freeing exclusive vmx locks on *-flat.vmdk (logged in hostd.log)',
          tone: 'sky',
        },
        {
          storyTerm: 'Running a partial padlocking tool across every pod shell',
          technicalTerm: 'ELF encryptor from /tmp intermittently encrypting /vmfs/volumes/*/*/*.vmdk, .vmx, and .nvram',
          tone: 'rose',
        },
        {
          storyTerm: 'Rebuilding undamaged pod maps from partial locks',
          technicalTerm: 'CISA ESXiArgs flat-file descriptor reconstruction recovering unencrypted VMDK blocks',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Unlocking the basement management terminal as the chief superintendent, the intruder opens an interactive console session while the warehouse built-in authentication diary and command ticker silently record every single keystroke.',
        storyMappings: [
          {
            storyTerm: 'Basement management terminal',
            technicalTerm: 'VMware ESXi SSH daemon or DCUI/vCenter-enabled ESXi Shell',
            tone: 'amber',
          },
          {
            storyTerm: 'Chief superintendent key',
            technicalTerm: 'Root hypervisor account login logged in /var/log/auth.log',
            tone: 'sky',
          },
          {
            storyTerm: 'Command ticker recording every keystroke',
            technicalTerm: 'ESXi /var/log/shell.log auditing interactive CLI commands executed by root',
            tone: 'rose',
          },
          {
            storyTerm: 'Warning bell noting console activation',
            technicalTerm: '/var/log/vobd.log flagging SSH or ESXi Shell enablement events',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Because every live office pod clamps down heavy locks on its own floor foundation while running, the intruder walks down the breaker panel flipping every pod off hard so every foundation slab pops unlocked simultaneously.',
        storyMappings: [
          {
            storyTerm: 'Live pods clamping locks on their floor foundations',
            technicalTerm: 'Running vmx hypervisor processes holding exclusive locks on *-flat.vmdk disks',
            tone: 'amber',
          },
          {
            storyTerm: 'Flipping every pod breaker off hard',
            technicalTerm: 'Batch execution of esxcli vm process kill --type=force across active World IDs',
            tone: 'sky',
          },
          {
            storyTerm: 'Breaker-panel audit book',
            technicalTerm: 'ESXi /var/log/hostd.log documenting abrupt power-off events for every guest VM',
            tone: 'rose',
          },
          {
            storyTerm: 'Unlocked foundation slabs ready for attack',
            technicalTerm: 'Released datastore file handles under /vmfs/volumes/',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Launching a portable padlocking press out of a temporary basement closet, the intruder races across the datastore locking slices of every virtual disk, configuration card, and memory file, leaving forensic responders to audit the footprint and check whether skipped disk slices allow recovery.',
        storyMappings: [
          {
            storyTerm: 'Portable padlocking press in a temporary closet',
            technicalTerm: 'Unsigned Linux ELF ransomware encryptor executed from /tmp/',
            tone: 'amber',
          },
          {
            storyTerm: 'Virtual disks, configuration cards, and memory files',
            technicalTerm: 'Target files matching /vmfs/volumes/*/*/*.vmdk, *.vmx, and *.nvram',
            tone: 'sky',
          },
          {
            storyTerm: 'Locking slices intermittently for speed',
            technicalTerm: 'Intermittent block encryption corrupting VM files in seconds',
            tone: 'rose',
          },
          {
            storyTerm: 'Rebuilding intact blueprints from skipped slices',
            technicalTerm: 'CISA ESXiArgs forensic descriptor reconstruction restoring untouched *-flat.vmdk data',
            tone: 'emerald',
          },
        ],
      },
    },
  };
