import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'docker-var-run-docker-sock-mounted-socket-breakout-audit',
    title: 'Docker Security, CNCF Falco & MITRE — Container Mounted /var/run/docker.sock Unix Socket Escalation Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1611',
    description:
      'Grounded in Docker Security documentation, CNCF Falco container breakout rules, and MITRE ATT&CK T1611: DFIR analysts investigate how a compromised CI/CD runner or monitoring container that bind-mounts the host /var/run/docker.sock Unix domain socket communicates directly with the host dockerd daemon over AF_UNIX to spawn a sibling privileged container in the host PID and network namespaces (--pid=host --net=host).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised CI/CD Container', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Mounted /var/run/docker.sock (AF_UNIX)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Host dockerd Daemon (root)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Linux auditd (-w /var/run/docker.sock)', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Host Namespace (--pid=host nsenter)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Discovering Mounted /var/run/docker.sock Inside Container Mount Table',
        narration:
          'After gaining code execution inside a build or agent container, the actor inspects /proc/self/mountinfo (or runs find / -name docker.sock) and discovers the writable host Unix domain socket /var/run/docker.sock mounted from /run/docker.sock.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Discovery (T1613 - Container and Resource Discovery)',
        technicalCommands: [
          'grep docker.sock /proc/self/mountinfo',
          'ls -la /var/run/docker.sock',
        ],
        defenseMitigation:
          'Replace Docker-in-Docker (/var/run/docker.sock mounts) in CI/CD pipelines with rootless image builders such as Kaniko, Buildah, or Sysbox user-namespace isolation.',
        logs: [
          {
            id: 'dsock-1',
            timestamp: '10:12:04.115',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 42,
            ProcessName: 'curl',
            CommandLine: 'curl --unix-socket /var/run/docker.sock http://localhost/info',
            raw: 'type=SOCKADDR msg=audit(1763287924.115:801): saddr=01002F7661722F72756E2F646F636B65722E736F636B (AF_UNIX /var/run/docker.sock) comm="curl" exe="/usr/bin/curl"',
            parsedFields: {
              SocketFamily: 'AF_UNIX (/var/run/docker.sock)',
              AuditRuleKey: 'docker_socket_access',
              CallerProcess: '/usr/bin/curl (Container Cgroup)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Spawning Sibling Container with HostPID, HostNetwork & Privileged Mode via Unix Socket',
        narration:
          'Sending an HTTP POST request over /var/run/docker.sock to http://localhost/v1.43/containers/create, the actor instructs the host dockerd daemon to launch a sibling container configured with PidMode="host", NetworkMode="host", and Privileged=true.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host)',
        technicalCommands: [
          'ausearch -k docker_socket_access -i',
          'docker events --since 1h --filter "event=create"',
        ],
        defenseMitigation:
          'If a monitoring container requires read-only Docker metadata, place a read-only socket proxy (such as Tecnativa docker-socket-proxy) in front of /var/run/docker.sock that blocks POST /containers/create and /exec.',
        logs: [
          {
            id: 'dsock-2',
            timestamp: '10:12:19.604',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'dockerd',
            CommandLine: 'POST /v1.43/containers/create (PidMode=host, NetworkMode=host, Privileged=true)',
            raw: 'dockerd_journal: level=info msg="POST /v1.43/containers/create" PidMode="host" NetworkMode="host" Privileged=true ViaUnixSocket="/var/run/docker.sock"',
            parsedFields: {
              NamespaceSharing: 'PidMode=host, NetworkMode=host',
              PrivilegedMode: 'true',
              SocketTransport: 'unix:///var/run/docker.sock',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Entering Host PID 1 (systemd) Mount & IPC Namespaces via nsenter',
        narration:
          'Because the sibling container shares the host PID namespace (--pid=host) and runs with CAP_SYS_ADMIN, it invokes nsenter --target 1 --mount --uts --ipc --net --pid to attach directly to all Linux namespaces of host PID 1 (systemd).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Escape to Host (T1611 - Escape to Host)',
        technicalCommands: [
          'ausearch -sc setns -i',
          'ls -l /proc/1/ns/',
        ],
        defenseMitigation:
          'Monitor Linux syscall 308 (setns) originating from container cgroups targeting /proc/1/ns/* via auditd (-a always,exit -F arch=b64 -S setns -k container_nsenter) and Falco eBPF.',
        logs: [
          {
            id: 'dsock-3',
            timestamp: '10:12:24.330',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 308,
            ProcessName: 'nsenter',
            CommandLine: 'nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash',
            raw: 'type=SYSCALL msg=audit(1763287944.330:809): arch=c000003e syscall=308 success=yes exe="/usr/bin/nsenter" comm="nsenter" target_ns="/proc/1/ns/mnt"',
            parsedFields: {
              Syscall: 'sys_setns (308)',
              TargetNamespace: '/proc/1/ns/mnt (Host systemd PID 1)',
              ProcessBinary: '/usr/bin/nsenter',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a locked glass contractor booth inside a high-security factory where engineers accidentally ran the factory master crane joystick cable straight through the booth wall for convenience. An intruder trapped inside the glass booth grabs that joystick, commands the crane outside to build an open-air twin platform sharing the factory master floor, and steps directly into the factory central control room.',
      storyMappings: [
        {
          storyTerm: 'Master crane joystick cable wired through the glass booth wall',
          technicalTerm: 'Host /var/run/docker.sock Unix socket bind-mounted inside a container',
          tone: 'amber',
        },
        {
          storyTerm: 'Ordering an open-air twin platform outside the booth',
          technicalTerm: 'HTTP POST over docker.sock creating a sibling container with HostPID and Privileged',
          tone: 'sky',
        },
        {
          storyTerm: 'Stepping directly into the factory central control room',
          technicalTerm: 'nsenter --target 1 entering host PID 1 (systemd) mount and IPC namespaces',
          tone: 'rose',
        },
        {
          storyTerm: 'Locked glass contractor booth',
          technicalTerm: 'Compromised CI build or management agent container',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Looking around the locked glass contractor booth for an escape route, the intruder inspects the wall conduits and immediately discovers the live master crane control cable poking straight through from the main factory floor outside.',
        storyMappings: [
          {
            storyTerm: 'Inspecting the wall conduits',
            technicalTerm: 'Reading /proc/self/mountinfo or running find / -name docker.sock inside the container',
            tone: 'amber',
          },
          {
            storyTerm: 'Live master crane control cable',
            technicalTerm: 'Mounted host Unix domain socket at /var/run/docker.sock',
            tone: 'sky',
          },
          {
            storyTerm: 'Locked glass contractor booth',
            technicalTerm: 'Initial foothold inside a CI runner or monitoring agent container',
            tone: 'rose',
          },
          {
            storyTerm: 'Direct link to the factory outside',
            technicalTerm: 'Socket communicating directly with the root-privileged host dockerd daemon',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Gripping the exposed crane joystick, the intruder commands the crane outside to assemble a brand-new twin platform next door with zero privacy partitions, full view of every worker badge on the factory floor, and master mechanical overrides turned on.',
        storyMappings: [
          {
            storyTerm: 'Commanding the crane over the exposed cable',
            technicalTerm: 'HTTP POST to http://localhost/v1.43/containers/create via /var/run/docker.sock',
            tone: 'amber',
          },
          {
            storyTerm: 'Brand-new twin platform next door',
            technicalTerm: 'Attacker-controlled sibling container launched directly by the host daemon',
            tone: 'sky',
          },
          {
            storyTerm: 'Full view of every worker badge and hallway',
            technicalTerm: 'HostPID (PidMode=host) and HostNetwork (NetworkMode=host) enabled',
            tone: 'rose',
          },
          {
            storyTerm: 'Master mechanical overrides turned on',
            technicalTerm: 'Privileged=true granting CAP_SYS_ADMIN inside the sibling container',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Standing on the twin platform with full view of the factory chief supervisor office, the intruder uses a master transfer latch to step straight into the supervisor own workspace, gaining complete root command over the entire building.',
        storyMappings: [
          {
            storyTerm: 'Factory chief supervisor office',
            technicalTerm: 'Host init process PID 1 (systemd) running in the root host namespaces',
            tone: 'amber',
          },
          {
            storyTerm: 'Master transfer latch',
            technicalTerm: 'nsenter --target 1 --mount --uts --ipc --net --pid command',
            tone: 'sky',
          },
          {
            storyTerm: 'Authority allowing the latch to open',
            technicalTerm: 'Shared host PID namespace combined with CAP_SYS_ADMIN capability',
            tone: 'rose',
          },
          {
            storyTerm: 'Complete command over the entire building',
            technicalTerm: 'Unrestricted root shell inside the underlying Linux host OS',
            tone: 'emerald',
          },
        ],
      },
    },
  };
