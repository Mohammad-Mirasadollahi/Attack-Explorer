import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-linux-ld-so-preload-userland-rootkit-proc-maps',
    title: 'NCSC-NL, Red Hat & MITRE DFIR — Linux /etc/ld.so.preload Userland Rootkit & /proc/1/maps Forensics',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1574.006',
    description:
      'Grounded in NCSC-NL Linux Incident Response guidelines, Red Hat Dynamic Linker (ld.so) documentation, and MITRE ATT&CK T1574.006: a userland shared-object rootkit writes the path of a malicious library (/lib64/libudev- guardian.so) into /etc/ld.so.preload so the dynamic linker (/lib64/ld-linux-x86-64.so.2) injects it into every dynamically linked process to hook readdir(), fopen(), and accept()—detectable via /proc/1/maps, LD_TRACE_LOADED_OBJECTS, and statically linked busybox/auditd.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rootkit Installer Process', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ld-linux-x86-64.so.2 Linker', type: 'firewall', status: 'compromised' },
      { id: 'target', label: '/etc/ld.so.preload Config', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'auditd & /proc/1/maps Check', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Hooked libc readdir/fopen', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Shared Library Compilation & /etc/ld.so.preload Registration (auditd nametype=CREATE)',
        narration:
          'The actor places a malicious ELF shared object at /usr/lib64/libudev-guardian.so and writes its path into /etc/ld.so.preload. Because the kernel audit daemon (auditd) operates at the system-call boundary below userland libc hooks, an audit watch on /etc/ld.so.preload logs the exact file creation and write.',
        activeNodes: ['attacker', 'target', 'siem'],
        mitreTactic: 'Persistence (T1574.006 - Hijack Execution Flow: Dynamic Linker Hijacking)',
        technicalCommands: [
          'auditctl -w /etc/ld.so.preload -p wa -k ld_preload_hijack',
          'auditd PATH Record: name="/etc/ld.so.preload" inode=529104 nametype=CREATE',
          'Injected Shared Object: /usr/lib64/libudev-guardian.so',
        ],
        defenseMitigation:
          'Monitor /etc/ld.so.preload, /etc/ld.so.conf, and /etc/ld.so.conf.d/ via Linux auditd kernel rules and Falco eBPF sensors.',
        logs: [
          {
            id: 'dfir-ldso-1',
            timestamp: '05:40:11.200',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'bash',
            CommandLine: 'auditd alert: /etc/ld.so.preload created pointing to /usr/lib64/libudev-guardian.so',
            raw: 'type=SYSCALL msg=audit(1762148411.200:6104): arch=c000003e syscall=257 (openat) success=yes exit=3 uid=0 comm="bash" exe="/usr/bin/bash" key="ld_preload_hijack" | type=PATH item=1 name="/etc/ld.so.preload" inode=529104 mode=0100644 nametype=CREATE',
            parsedFields: {
              AuditKey: 'ld_preload_hijack',
              CreatedFile: '/etc/ld.so.preload',
              PreloadedLibrary: '/usr/lib64/libudev-guardian.so',
              MitreTechnique: 'T1574.006 (Dynamic Linker Hijacking)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Global Dynamic Linker Injection & Userland PLT/GOT Hooking of readdir64() and fopen()',
        narration:
          'On every subsequent execution of a dynamically linked binary (such as ps, ls, netstat, or lsof), /lib64/ld-linux-x86-64.so.2 reads /etc/ld.so.preload and maps libudev-guardian.so before libc.so.6. The library overrides readdir64() and fopen("/proc/net/tcp") via dlsym(RTLD_NEXT, ...) so standard userland tools hide the rootkit’s files, PIDs, and network connections—including hiding /etc/ld.so.preload itself.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Defense Evasion (T1014 - Rootkit: Userland libc Function Hooking)',
        technicalCommands: [
          'Dynamic Linker Loader: /lib64/ld-linux-x86-64.so.2 parses /etc/ld.so.preload prior to libc.so.6',
          'Hooked Symbols: readdir(), readdir64(), fopen(), fopen64(), __xstat(), accept()',
          'Evasion Behavior: Hides "/etc/ld.so.preload" and "libudev-guardian.so" from dynamically linked ls/cat',
        ],
        defenseMitigation:
          'Never rely solely on dynamically linked host binaries on a suspected compromised Linux system; use statically compiled busybox or inspect kernel structures directly.',
        logs: [
          {
            id: 'dfir-ldso-2',
            timestamp: '05:40:15.610',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 9,
            ProcessName: 'ps',
            CommandLine: 'ld-linux-x86-64.so.2 mapping /usr/lib64/libudev-guardian.so into /usr/bin/ps',
            raw: 'type=MMAP msg=audit(1762148415.610:6120): fd=3 flags=0x802 (MAP_PRIVATE|MAP_DENYWRITE) path="/usr/lib64/libudev-guardian.so" comm="ps" exe="/usr/bin/ps"',
            parsedFields: {
              DynamicLinker: '/lib64/ld-linux-x86-64.so.2',
              InjectedIntoProcess: '/usr/bin/ps, /usr/bin/ls, /usr/bin/ss',
              HookMechanism: 'dlsym(RTLD_NEXT) overriding libc readdir64/fopen',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Forensic Detection via /proc/1/maps, /proc/self/map_files & Statically Linked Busybox',
        narration:
          'During DFIR triage, the analyst bypasses userland libc hooks by inspecting /proc/1/maps (or /proc/self/maps via a shell builtin read loop) and running a statically linked busybox binary (which does not use ld-linux.so and is immune to /etc/ld.so.preload). Every running process memory map clearly displays /usr/lib64/libudev-guardian.so mapped with r-xp permissions.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1574.006 - /proc/self/maps & Static Binary Verification)',
        technicalCommands: [
          'while read line; do echo "$line"; done < /proc/self/maps  # Pure bash builtin bypasses external binary hooks',
          './busybox-static cat /etc/ld.so.preload  # Static ELF ignores ld-linux.so preload',
          'Memory Map Entry: 7f8a91c00000-7f8a91c04000 r-xp 00001000 fd:00 918273 /usr/lib64/libudev-guardian.so',
        ],
        defenseMitigation:
          'Compare loaded shared libraries in /proc/*/maps against the RPM/DPKG package database (rpm -qf <library_path>) to immediately identify unowned shared objects injected across system daemons.',
        logs: [
          {
            id: 'dfir-ldso-3',
            timestamp: '05:45:00.112',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 918,
            ProcessName: 'busybox',
            CommandLine: 'busybox-static revealing /etc/ld.so.preload & /usr/lib64/libudev-guardian.so in /proc/1/maps',
            raw: 'proc_maps_scan: pid=1 comm="systemd" region="7f8a91c00000-7f8a91c04000" perms="r-xp" inode=918273 path="/usr/lib64/libudev-guardian.so" rpm_owner="file /usr/lib64/libudev-guardian.so is not owned by any package"',
            parsedFields: {
              ForensicSource: '/proc/1/maps & /proc/self/maps',
              UnownedSharedObject: '/usr/lib64/libudev-guardian.so (RPM Unowned)',
              VerificationTool: 'Statically linked busybox + bash builtin read',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an invisible tailor sneaking into a factory dressing room and sewing a rigged lining into the universal work coat hanging on the entrance rack. Every factory inspector who slips on a standard coat automatically sees blurred lenses that hide the tailor hidden doorway, until a forensic auditor arrives with sealed, self-contained binoculars from outside the factory and reads the raw room occupancy ledger directly.',
      storyMappings: [
        {
          storyTerm: 'Universal work coat hanging on the entrance rack',
          technicalTerm: 'System-wide dynamic linker file /etc/ld.so.preload',
          tone: 'amber',
        },
        {
          storyTerm: 'Rigged lining sewn into the coat',
          technicalTerm: 'Malicious shared library /usr/lib64/libudev-guardian.so',
          tone: 'sky',
        },
        {
          storyTerm: 'Blurred lenses hiding the tailor doorway',
          technicalTerm: 'Userland PLT/GOT hooks on readdir64() and fopen() hiding files and sockets',
          tone: 'rose',
        },
        {
          storyTerm: 'Sealed external binoculars reading the raw room ledger',
          technicalTerm: 'Statically linked busybox binary inspecting /proc/1/maps and /proc/self/map_files',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Under cover of night, the tailor slips a custom rigged coat lining into the supply shelf and writes its tag number onto the mandatory entrance-rack sheet. Even though the front-desk tools will soon be fooled, the tamper-proof security camera bolted above the rack records the exact moment the sheet is edited.',
        storyMappings: [
          {
            storyTerm: 'Custom rigged coat lining on the supply shelf',
            technicalTerm: 'Compiled ELF shared object placed at /usr/lib64/libudev-guardian.so',
            tone: 'amber',
          },
          {
            storyTerm: 'Mandatory entrance-rack sheet',
            technicalTerm: 'Path entry written into /etc/ld.so.preload',
            tone: 'sky',
          },
          {
            storyTerm: 'Tamper-proof camera bolted above the rack',
            technicalTerm: 'Kernel-level auditd syscall monitoring recording nametype=CREATE',
            tone: 'rose',
          },
          {
            storyTerm: 'Front-desk tools about to be fooled',
            technicalTerm: 'Standard dynamically linked Linux utilities (ps, ls, netstat, lsof)',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Every time a normal factory worker starts a routine floor check, the entrance dresser hands them the rigged coat first. Inside each worker goggles, the rigged lining intercepts every glance down the aisles and every glance at the attendance clipboard, erasing the intruder files and connections before the worker eyes can read them.',
        storyMappings: [
          {
            storyTerm: 'Entrance dresser handing out the rigged coat',
            technicalTerm: 'Dynamic linker /lib64/ld-linux-x86-64.so.2 loading /etc/ld.so.preload first',
            tone: 'amber',
          },
          {
            storyTerm: 'Intercepting every glance down the aisles',
            technicalTerm: 'PLT/GOT function hooking of libc readdir64() hiding directories and PIDs',
            tone: 'sky',
          },
          {
            storyTerm: 'Intercepting glances at the attendance clipboard',
            technicalTerm: 'Userland hooking of fopen() filtering /proc/net/tcp entries',
            tone: 'rose',
          },
          {
            storyTerm: 'Fooled routine floor checks',
            technicalTerm: 'Compromised output from dynamically linked ps, ls, netstat, and lsof',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Refusing to put on any factory coat at all, the forensic auditor walks in wearing completely self-contained outside gear and reads the raw hallway map posted inside the master guard station, immediately spotting the foreign rigged lining wrapped around every single worker in the building.',
        storyMappings: [
          {
            storyTerm: 'Self-contained outside gear skipping the coat rack',
            technicalTerm: 'Statically linked busybox binary immune to /etc/ld.so.preload injection',
            tone: 'amber',
          },
          {
            storyTerm: 'Raw hallway map inside the master guard station',
            technicalTerm: 'Kernel-generated /proc/1/maps and /proc/self/map_files memory mappings',
            tone: 'sky',
          },
          {
            storyTerm: 'Direct inspection without intermediary glasses',
            technicalTerm: 'Shell builtin read loop bypassing hooked userland libc file wrappers',
            tone: 'rose',
          },
          {
            storyTerm: 'Foreign lining wrapped around every worker',
            technicalTerm: 'Exposed /usr/lib64/libudev-guardian.so mapping across PID 1 and child processes',
            tone: 'emerald',
          },
        ],
      },
    },
  };
