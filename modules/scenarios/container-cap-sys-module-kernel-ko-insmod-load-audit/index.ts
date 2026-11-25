import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'container-cap-sys-module-kernel-ko-insmod-load-audit',
    title: 'Red Hat Security, CNCF Tetragon & MITRE — Container CAP_SYS_MODULE Host Kernel Module (finit_module) Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1547.006',
    description:
      'Grounded in Red Hat OpenShift / Linux container security documentation, Cilium Tetragon eBPF enforcement guides, and MITRE ATT&CK T1547.006 / T1611: DFIR analysts investigate how a container misconfigured with the CAP_SYS_MODULE capability invokes init_module (syscall 175) or finit_module (syscall 313) via insmod/modprobe to load an LKM (.ko) directly into the shared host Linux kernel.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Container with CAP_SYS_MODULE', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'insmod / modprobe Utility', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Syscall 313 (sys_finit_module)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Linux auditd & Tetragon eBPF Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Shared Host Linux Kernel Ring-0', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Inspecting /proc/self/status CapEff Bit 16 (CAP_SYS_MODULE) & Host uname -r',
        narration:
          'Because all containers on a Linux node share the same host kernel, a container process checks /proc/self/status for CapEff bit 16 (0x0000000000010000 = CAP_SYS_MODULE) and runs uname -r to match the host kernel ABI version.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Discovery (T1082 - System Information Discovery)',
        technicalCommands: [
          'capsh --decode=00000000a80525fb',
          'uname -r && cat /proc/version',
        ],
        defenseMitigation:
          'Enforce Kubernetes Pod Security Standards (Baseline/Restricted) which strictly forbid adding CAP_SYS_MODULE in securityContext.capabilities.add.',
        logs: [
          {
            id: 'cap-mod-1',
            timestamp: '13:14:02.110',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 63,
            ProcessName: 'uname',
            CommandLine: 'uname -r (Verifying host kernel ABI inside container with CAP_SYS_MODULE)',
            raw: 'tetragon_event: {"process_exec":{"process":{"binary":"/usr/bin/uname","arguments":"-r","cap":{"effective":["CAP_SYS_MODULE","CAP_NET_RAW"]},"pod":{"namespace":"default","name":"legacy-net-agent"}}}}',
            parsedFields: {
              DetectedCapability: 'CAP_SYS_MODULE (Bit 16)',
              PodIdentity: 'default/legacy-net-agent',
              SensorSource: 'Cilium Tetragon eBPF',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Invoking finit_module (Syscall 313) / init_module (Syscall 175) via insmod',
        narration:
          'The container process executes insmod /tmp/net_diag.ko, which invokes sys_finit_module (syscall 313) or sys_init_module (syscall 175) to load the ELF relocatable kernel object directly into host Ring-0 kernel memory.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Escape to Host & Persistence (T1547.006 - Kernel Modules and Extensions)',
        technicalCommands: [
          'ausearch -sc init_module,finit_module,delete_module -i',
          'dmesg -T | grep -E "taints kernel|module verification"',
        ],
        defenseMitigation:
          'Enable kernel.modules_disabled=1 via sysctl on immutable Kubernetes worker nodes after boot, enforce CONFIG_MODULE_SIG_FORCE=y (signed kernel modules only), and block init_module/finit_module in the container Seccomp profile.',
        logs: [
          {
            id: 'cap-mod-2',
            timestamp: '13:14:09.405',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 313,
            ProcessName: 'insmod',
            CommandLine: 'insmod /tmp/net_diag.ko',
            raw: 'type=SYSCALL msg=audit(1763298849.405:1104): arch=c000003e syscall=313 success=yes exe="/usr/sbin/kmod" comm="insmod" key="kernel_module_load"',
            parsedFields: {
              Syscall: 'sys_finit_module (313)',
              LoadedModulePath: '/tmp/net_diag.ko (Container OverlayFS)',
              AuditRuleKey: 'kernel_module_load',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Host Kernel /proc/modules Taint Flag & dmesg Audit Correlation',
        narration:
          'Loading an unsigned out-of-tree module sets the kernel taint flag (/proc/sys/kernel/tainted bit 12 O = OOT_MODULE and bit 13 E = UNSIGNED_MODULE) and logs a kernel ring-buffer message in dmesg/journald.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1014 - Rootkit)',
        technicalCommands: [
          'cat /proc/sys/kernel/tainted && lsmod | head -n 10',
          'journalctl -k | grep "loading out-of-tree module taints kernel"',
        ],
        defenseMitigation:
          'Deploy Tetragon TracingPolicies that send SIGKILL before sys_finit_module / sys_init_module completes if the calling process belongs to a non-host cgroup namespace.',
        logs: [
          {
            id: 'cap-mod-3',
            timestamp: '13:14:09.412',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 0,
            ProcessName: 'kernel',
            CommandLine: 'kernel: net_diag: loading out-of-tree module taints kernel (tainted=12288)',
            raw: 'kernel_journal: kernel: net_diag: loading out-of-tree module taints kernel. net_diag: module verification failed: signature and/or required key missing - tainting kernel',
            parsedFields: {
              KernelTaintMask: '/proc/sys/kernel/tainted = 12288 (OOT + UNSIGNED)',
              ModuleEntry: '/proc/modules -> net_diag',
              ContainmentAction: 'Isolate & cordon Kubernetes worker node',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a skyscraper where every sealed tenant suite rides on the exact same central elevator engine in the basement. Discovering that their suite badge accidentally includes elevator-mechanic clearance, a tenant builds a homemade gear that fits the exact engine model, bolts it straight into the central basement machinery from inside their room, and trips a permanent red warning lamp on the skyscraper master engineering console.',
      storyMappings: [
        {
          storyTerm: 'Elevator-mechanic clearance on a tenant badge',
          technicalTerm: 'CAP_SYS_MODULE capability (CapEff bit 16) in /proc/self/status',
          tone: 'amber',
        },
        {
          storyTerm: 'Homemade gear matching the exact engine model',
          technicalTerm: 'Compiled Linux kernel module (.ko) built for host uname -r version',
          tone: 'sky',
        },
        {
          storyTerm: 'Bolting the gear straight into the central basement machinery',
          technicalTerm: 'insmod invoking finit_module (syscall 313) or init_module (syscall 175)',
          tone: 'rose',
        },
        {
          storyTerm: 'Permanent red warning lamp on the engineering console',
          technicalTerm: 'Kernel taint flag (/proc/sys/kernel/tainted OOT_MODULE and UNSIGNED_MODULE bits)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Inside the sealed tenant suite, the intruder checks their badge stamp list and the central elevator nameplate, discovering both that they hold rare engine-room installation rights and the exact make and model of the shared basement engine.',
        storyMappings: [
          {
            storyTerm: 'Checking the badge stamp list',
            technicalTerm: 'Reading /proc/self/status to confirm CapEff bit 16 (CAP_SYS_MODULE)',
            tone: 'amber',
          },
          {
            storyTerm: 'Central elevator nameplate',
            technicalTerm: 'Host Linux kernel version string discovered via uname -r',
            tone: 'sky',
          },
          {
            storyTerm: 'Shared basement engine beneath every suite',
            technicalTerm: 'Single Linux host kernel shared across all running containers on the node',
            tone: 'rose',
          },
          {
            storyTerm: 'Rare engine-room installation rights',
            technicalTerm: 'Privilege allowing a container to insert Ring-0 kernel code into the host',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Fashioning a custom metal gear tailored to that exact engine model, the intruder feeds it through the basement installation slot straight into the spinning central elevator core, immediately bypassing every wall separating the suite from the rest of the building.',
        storyMappings: [
          {
            storyTerm: 'Custom metal gear tailored to the engine',
            technicalTerm: 'Malicious kernel object /tmp/net_diag.ko compiled for the host kernel',
            tone: 'amber',
          },
          {
            storyTerm: 'Feeding it through the installation slot',
            technicalTerm: 'Executing insmod /tmp/net_diag.ko invoking finit_module (313) or init_module (175)',
            tone: 'sky',
          },
          {
            storyTerm: 'Spinning central elevator core',
            technicalTerm: 'Host Linux kernel Ring-0 execution space with total control over all nodes',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypassing every suite wall at once',
            technicalTerm: 'Full container escape executing privileged kernel-space callbacks on the host',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'The instant an uncertified foreign gear snaps into the central machinery, the skyscraper master dashboard lights up two unmistakable warning lamps and logs the exact part name in the permanent engine diary for safety inspectors to audit.',
        storyMappings: [
          {
            storyTerm: 'Two unmistakable warning lamps on the master dashboard',
            technicalTerm: '/proc/sys/kernel/tainted bit 12 (O = OOT_MODULE) and bit 13 (E = UNSIGNED_MODULE)',
            tone: 'amber',
          },
          {
            storyTerm: 'Permanent engine diary',
            technicalTerm: 'Host /proc/modules list and kernel dmesg ring-buffer audit entries',
            tone: 'sky',
          },
          {
            storyTerm: 'Uncertified foreign gear',
            technicalTerm: 'Unsigned out-of-tree kernel module loaded without lockdown signature verification',
            tone: 'rose',
          },
          {
            storyTerm: 'Safety inspectors spotting the tampering',
            technicalTerm: 'CNCF Tetragon eBPF runtime policy blocking or alerting on sys_finit_module',
            tone: 'emerald',
          },
        ],
      },
    },
  };
