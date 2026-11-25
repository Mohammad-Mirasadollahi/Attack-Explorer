import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace',
    title: 'VMware/Broadcom, CISA AA23-039A & Mandiant DFIR — ESXi /var/log/shell.log, hostd.log & VMDK Hypervisor Forensics',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in VMware vSphere/ESXi Official Log Documentation, CISA Joint Advisory AA23-039A (ESXiArgs), and Mandiant hypervisor DFIR playbooks: an attacker gains SSH/SLP access to a VMware ESXi hypervisor, enumerates running guest VMs via esxcli vm process list, forcefully terminates vmx processes via esxcli vm process kill --type=force, and encrypts the backing -flat.vmdk, .nvram, and .vmx files on /vmfs/volumes/<datastore>/—reconstructed via /var/log/shell.log, /var/log/auth.log, /var/log/hostd.log, and /var/log/vobd.log.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Intruder SSH Session (:22)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ESXi Shell & /var/log/shell.log', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'hostd & esxcli vm process kill', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Syslog (shell, hostd, vobd)', type: 'siem', status: 'normal' },
      { id: 'ad', label: '/vmfs/volumes/* (-flat.vmdk)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ESXi SSH Authentication & Interactive Command Logging (/var/log/auth.log & /var/log/shell.log)',
        narration:
          'When the actor logs into the ESXi host as root over SSH (or enables the ESXi Shell via DCUI/vCenter, generating VOB event esx.audit.ssh.enabled in /var/log/vobd.log), /var/log/auth.log records the SSH source IP and /var/log/shell.log logs every interactive command executed inside the ASH/sh shell.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1078 - Valid Accounts: ESXi Hypervisor Root SSH)',
        technicalCommands: [
          'Log Path 1: /var/log/vobd.log (esx.audit.ssh.enabled / esx.audit.tsm.enabled)',
          'Log Path 2: /var/log/auth.log (sshd: Accepted keyboard-interactive/pam for root)',
          'Log Path 3: /var/log/shell.log (root: esxcli vm process list)',
        ],
        defenseMitigation:
          'Keep ESXi SSH and ESXi Shell disabled by default, enforce vSphere Active Directory SmartCard/MFA Lockdown Mode, and stream /var/log/shell.log, hostd.log, vobd.log, and auth.log to a remote syslog collector (because ESXi /var/log resides on a volatile scratch partition if persistent scratch is unconfigured).',
        logs: [
          {
            id: 'dfir-esxi-1',
            timestamp: '03:01:10.112',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 22,
            ProcessName: 'sshd',
            CommandLine: '/var/log/shell.log: shell[84192]: [root]: esxcli vm process list',
            raw: '2026-11-03T03:01:08Z sshd[84190]: Accepted keyboard-interactive/pam for root from 10.10.15.44 port 55102 ssh2 | 2026-11-03T03:01:10Z shell[84192]: [root]: esxcli vm process list',
            parsedFields: {
              EsxiLogFiles: '/var/log/auth.log + /var/log/shell.log + /var/log/vobd.log',
              AuthenticatedUser: 'root (from 10.10.15.44)',
              ShellCommandLogged: 'esxcli vm process list',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Mass Virtual Machine Termination via esxcli vm process kill (/var/log/hostd.log)',
        narration:
          'Because running vmx hypervisor processes hold exclusive file locks on guest virtual disks (-flat.vmdk), the actor iterates through every World ID and runs esxcli vm process kill --type=force --world-id=<ID>. Both /var/log/shell.log and the VMware Host Agent log (/var/log/hostd.log) record the forced power-off of each guest VM.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Impact (T1529 - System Shutdown/Reboot: Hypervisor VM Termination)',
        technicalCommands: [
          'ESXi Command: esxcli vm process kill --type=force --world-id=2104892',
          '/var/log/hostd.log: Vmkill called for world 2104892 (CORP-DC01) type=force',
        ],
        defenseMitigation:
          'Alert immediately on syslog messages matching "esxcli vm process kill" in /var/log/shell.log or multiple simultaneous unexpected VM power-off events in /var/log/hostd.log.',
        logs: [
          {
            id: 'dfir-esxi-2',
            timestamp: '03:01:16.450',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 500,
            ProcessName: 'esxcli',
            CommandLine: 'esxcli vm process kill --type=force --world-id=2104892',
            raw: '2026-11-03T03:01:16.450Z shell[84192]: [root]: esxcli vm process kill --type=force --world-id=2104892 | 2026-11-03T03:01:16.480Z hostd[2098112]: info hostd[2098112] [Originator@6876 sub=Vmsvc.vm:/vmfs/volumes/61a9.../CORP-DC01/CORP-DC01.vmx] State Transition (VM_STATE_ON -> VM_STATE_OFF)',
            parsedFields: {
              EsxiLogFiles: '/var/log/shell.log + /var/log/hostd.log',
              TerminatedWorldId: '2104892 (Guest VM: CORP-DC01)',
              KillType: '--type=force (Immediate vmx termination to release VMDK locks)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Intermittent VMDK Encryption & Flat Descriptor Reconstruction (CISA ESXiArgs Recovery)',
        narration:
          'The actor launches an ELF encryptor from /tmp/ targeting /vmfs/volumes/*/*/*.vmdk, .vmx, and .nvram. As documented in CISA’s ESXiArgs recovery guidance, many hypervisor encryptors fully encrypt the small text descriptor (.vmdk) while only intermittently encrypting blocks of the multi-hundred-gigabyte raw data file (-flat.vmdk), allowing DFIR teams to recreate the .vmdk descriptor via vmkfstools -c and boot or mount the guest NTFS/ext4 partitions.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact: VMFS Datastore VMDKs)',
        technicalCommands: [
          'Targeted Datastore Path: /vmfs/volumes/datastore1/CORP-DC01/CORP-DC01-flat.vmdk',
          'CISA Descriptor Recovery: ls -l *-flat.vmdk -> vmkfstools -c <exact_byte_size> -d thin temp.vmdk -> point Extent description to original -flat.vmdk',
        ],
        defenseMitigation:
          'Enable ESXi UEFI Secure Boot and execInstalledOnly=TRUE (which prevents the ESXi kernel from executing any unsigned ELF binary not packaged inside a signed VIB) and maintain immutable off-host backups.',
        logs: [
          {
            id: 'dfir-esxi-3',
            timestamp: '03:01:22.900',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'nohup',
            CommandLine: '/var/log/shell.log: nohup /tmp/encrypt /vmfs/volumes/datastore1/CORP-DC01/CORP-DC01-flat.vmdk',
            raw: '2026-11-03T03:01:22.900Z shell[84192]: [root]: nohup /tmp/encrypt /vmfs/volumes/datastore1/CORP-DC01/CORP-DC01-flat.vmdk | CISA Recovery Note: Recreate plaintext .vmdk descriptor via vmkfstools -c and attach to clean recovery VM',
            parsedFields: {
              DatastorePath: '/vmfs/volumes/datastore1/CORP-DC01/',
              TargetedFiles: '*.vmdk, *-flat.vmdk, *.vmx, *.nvram, *.vswp',
              PreventiveKernelControl: 'esxcli system settings kernel set -s execInstalledOnly -v TRUE',
            },
          },
        ],
      },
    ],
  };
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
