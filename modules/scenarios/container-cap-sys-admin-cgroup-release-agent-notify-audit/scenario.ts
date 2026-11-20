import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'container-cap-sys-admin-cgroup-release-agent-notify-audit',
    title: 'Linux Kernel Cgroups Docs, Trail of Bits & Falco — Privileged Container CAP_SYS_ADMIN Cgroup v1 release_agent Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1611',
    description:
      'Grounded in the Linux Kernel cgroups v1 documentation, Trail of Bits container security research, and CNCF Falco default rules ("Modify Cgroup Release Agent"): DFIR analysts investigate how a container granted CAP_SYS_ADMIN (or --privileged) without AppArmor confinement mounts a cgroup v1 controller, enables notify_on_release=1, and writes a host path from /proc/mounts (upperdir=) into release_agent so the host kernel executes the binary as root when a child cgroup empties.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Container with CAP_SYS_ADMIN', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Cgroup v1 Mount (/tmp/cgrp)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'notify_on_release & release_agent', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Falco eBPF & Linux auditd Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Host Kernel kthreadd / usermodehelper', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Mounting RDMA/Memory Cgroup v1 Controller & Resolving OverlayFS Host upperdir Path',
        narration:
          'Inside a container holding CAP_SYS_ADMIN (CapEff bit 21), the process mounts a cgroup v1 hierarchy (mount -t cgroup -o rdma cgroup /tmp/cgrp) and inspects /etc/mtab or /proc/mounts to locate the container OverlayFS upperdir= path on the host filesystem.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Discovery & Preparation (T1611 - Escape to Host)',
        technicalCommands: [
          'grep CapEff /proc/self/status',
          'grep -o "upperdir=[^,]*" /proc/mounts',
        ],
        defenseMitigation:
          'Migrate nodes to cgroup v2 (unified hierarchy, which removes the legacy release_agent mechanism), drop CAP_SYS_ADMIN from all pods, and keep AppArmor/SELinux profiles enforced.',
        logs: [
          {
            id: 'cgrp-rel-1',
            timestamp: '12:20:04.112',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 165,
            ProcessName: 'mount',
            CommandLine: 'mount -t cgroup -o rdma cgroup /tmp/cgrp',
            raw: 'type=SYSCALL msg=audit(1763295604.112:1002): arch=c000003e syscall=165 success=yes a0="cgroup" a1="/tmp/cgrp" a2="cgroup" comm="mount" exe="/bin/mount"',
            parsedFields: {
              Syscall: 'sys_mount (165)',
              CgroupController: 'cgroup v1 (rdma / memory)',
              RequiredCapability: 'CAP_SYS_ADMIN (CapEff 0x0000003fffffffff)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Enabling notify_on_release=1 & Writing OverlayFS Host Path to release_agent',
        narration:
          'The container creates a child cgroup (/tmp/cgrp/x), writes 1 into /tmp/cgrp/x/notify_on_release, and writes the resolved host OverlayFS path (/var/lib/docker/overlay2/<id>/diff/cmd) into the root cgroup release_agent file.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Escape to Host (T1611 - Escape to Host)',
        technicalCommands: [
          'ausearch -f release_agent -i',
          'cat /sys/fs/cgroup/*/release_agent',
        ],
        defenseMitigation:
          'Enable the built-in Falco rule "Determines if a container writes to a cgroup release_agent file" to trigger an immediate critical alert and kill the offending container.',
        logs: [
          {
            id: 'cgrp-rel-2',
            timestamp: '12:20:08.540',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'sh',
            CommandLine: 'write("/tmp/cgrp/release_agent", "/var/lib/docker/overlay2/9a8b.../diff/diag.sh")',
            raw: 'falco_alert: Priority=CRITICAL Rule="Modify Cgroup Release Agent" proc.cmdline="sh -c echo /var/lib/docker/overlay2/9a8b/diff/diag.sh > /tmp/cgrp/release_agent" fd.name="/tmp/cgrp/release_agent"',
            parsedFields: {
              FalcoRule: 'Modify Cgroup Release Agent (CRITICAL)',
              ModifiedCgroupFile: '/tmp/cgrp/release_agent',
              RegisteredHostPath: '/var/lib/docker/overlay2/9a8b/diff/diag.sh',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Child Cgroup Process Exit Triggering Kernel call_usermodehelper Execution on Host',
        narration:
          'When a short-lived process is placed into /tmp/cgrp/x/cgroup.procs and immediately exits, the Linux kernel cgroup1_release_agent workqueue invokes call_usermodehelper() in the root host namespace (PPID 2 kthreadd) to execute the release_agent path.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host)',
        technicalCommands: [
          'ps -ef --forest | grep kthreadd',
          'ausearch -pp 2 -m SYSCALL -sv yes -i',
        ],
        defenseMitigation:
          'Audit all user-mode processes spawned directly by kernel thread PPID 2 (kthreadd / call_usermodehelper) whose executable path resides inside /var/lib/docker/overlay2/ or /run/containerd/.',
        logs: [
          {
            id: 'cgrp-rel-3',
            timestamp: '12:20:09.105',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'diag.sh',
            CommandLine: '/var/lib/docker/overlay2/9a8b/diff/diag.sh /x (spawned by kernel kthreadd PPID=2)',
            raw: 'type=SYSCALL msg=audit(1763295609.105:1009): arch=c000003e syscall=59 success=yes ppid=2 pid=18422 uid=0 exe="/bin/dash" comm="diag.sh"',
            parsedFields: {
              ParentKernelThread: 'PPID 2 (kthreadd -> call_usermodehelper)',
              ExecutedOverlayPath: '/var/lib/docker/overlay2/9a8b/diff/diag.sh',
              HostNamespaceUid: 'uid=0 (root)',
            },
          },
        ],
      },
    ],
  };
