import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'docker-engine-unauthenticated-tcp-2375-api-socket-audit',
    title: 'Docker Official Security, CISA & MITRE — Exposed Docker Daemon TCP Port 2375 API & Host Bind-Mount Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1610',
    description:
      'Grounded in the official Docker Engine Security documentation, CISA cloud/container hardening advisories, and MITRE ATT&CK T1610 (Deploy Container): DFIR analysts investigate unauthenticated HTTP requests to a misconfigured Docker Engine API listening on TCP port 2375 (-H tcp://0.0.0.0:2375) that create a privileged container bind-mounting the host root filesystem (Binds: ["/:/hostfs"]) and chroot into the host node.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Remote API Client (TCP :2375)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'dockerd Daemon (-H tcp://0.0.0.0:2375)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Privileged Container (/:/hostfs)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'journald dockerd & Falco eBPF Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Linux Host Root Filesystem (/)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated Docker Engine REST API Discovery (GET /v1.43/version & /containers/json)',
        narration:
          'When dockerd is started with -H tcp://0.0.0.0:2375 without TLS (--tlsverify), any network client can reach the REST API over cleartext HTTP. The client queries GET /version and GET /containers/json to fingerprint the host kernel and running workloads.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Discovery (T1613 - Container and Resource Discovery)',
        technicalCommands: [
          'ss -tulpn | grep 2375',
          'journalctl -u docker.service | grep "/containers/json"',
        ],
        defenseMitigation:
          'Never bind dockerd to unencrypted TCP port 2375 (-H tcp://0.0.0.0:2375); bind strictly to unix:///var/run/docker.sock or enforce mutual TLS (--tlsverify) on TCP port 2376 with host firewall restrictions.',
        logs: [
          {
            id: 'docker-2375-1',
            timestamp: '09:05:11.102',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'dockerd',
            CommandLine: 'GET /v1.43/version HTTP/1.1 (RemoteAddr: 198.51.100.55:49210)',
            raw: 'dockerd_journal: time="2026-11-17T09:05:11Z" level=info msg="Calling GET /v1.43/version" RemoteAddr="198.51.100.55:49210" TLS=false',
            parsedFields: {
              DaemonSocket: 'tcp://0.0.0.0:2375 (Unencrypted HTTP)',
              RestEndpoint: 'GET /v1.43/version',
              RemoteClient: '198.51.100.55:49210',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: POST /containers/create with HostConfig.Binds ["/:/hostfs"] & Privileged=true',
        narration:
          'The remote client sends POST /v1.43/containers/create specifying an Alpine image, HostConfig.Privileged=true, and HostConfig.Binds=["/:/hostfs:rw"], followed by POST /containers/<id>/start.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1610 - Deploy Container)',
        technicalCommands: [
          'docker inspect <container_id> --format "{{json .HostConfig.Binds}} Privileged={{.HostConfig.Privileged}}"',
          'ausearch -k docker_daemon_api -i',
        ],
        defenseMitigation:
          'Deploy OPA Gatekeeper / Docker Authorization Plugins (AuthZ) and Falco runtime rules that alert on and block any container started with Privileged=true or a host root (/) bind mount.',
        logs: [
          {
            id: 'docker-2375-2',
            timestamp: '09:05:18.450',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'dockerd',
            CommandLine: 'POST /v1.43/containers/create (Privileged=true, Binds=["/:/hostfs:rw"])',
            raw: 'dockerd_journal: time="2026-11-17T09:05:18Z" level=warning msg="Container created with host root bind mount" containerId="c9a8b7d6e5f4" Image="alpine:3.19" Binds="[/:/hostfs:rw]" Privileged=true',
            parsedFields: {
              ApiAction: 'POST /v1.43/containers/create',
              HostBindMount: '/:/hostfs:rw',
              PrivilegedFlag: 'true',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Host Root Filesystem chroot (/hostfs) & Cron/SSH Persistence Audit',
        narration:
          'Inside the started container, the entrypoint executes chroot /hostfs /bin/sh to operate directly inside the host root filesystem as UID 0, modifying /etc/crontab or /root/.ssh/authorized_keys, which Linux auditd and Falco eBPF sensors capture.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Escape to Host (T1611 - Escape to Host)',
        technicalCommands: [
          'ausearch -f /etc/crontab -i',
          'docker ps --no-trunc --filter "status=running"',
        ],
        defenseMitigation:
          'Enable user namespaces (--userns-remap=default in /etc/docker/daemon.json) so container UID 0 maps to an unprivileged high UID on the host, and monitor chroot syscalls inside container cgroups.',
        logs: [
          {
            id: 'docker-2375-3',
            timestamp: '09:05:22.890',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 161,
            ProcessName: 'chroot',
            CommandLine: 'chroot /hostfs /bin/sh -c "cat /etc/shadow"',
            raw: 'type=SYSCALL msg=audit(1763283922.890:701): arch=c000003e syscall=161 success=yes a0="/hostfs" comm="chroot" exe="/usr/sbin/chroot" uid=0',
            parsedFields: {
              Syscall: 'sys_chroot (161)',
              TargetRootPath: '/hostfs (Host Root /)',
              FalcoAlert: 'Launch Privileged Container & Host Root Mount',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a massive robotic warehouse whose master crane control console is wired onto an open hallway radio channel with no padlock or badge check. An outsider spots the open radio channel, orders the crane to drop a wide-open glass booth with a direct door into the warehouse main vault, and steps through that doorway to plant permanent maintenance schedules on the warehouse master wall.',
      storyMappings: [
        {
          storyTerm: 'Master crane console wired onto an open hallway radio channel',
          technicalTerm: 'Unauthenticated Docker daemon (dockerd) listening on TCP port 2375 without TLS',
          tone: 'amber',
        },
        {
          storyTerm: 'Ordering a glass booth with a direct door into the main vault',
          technicalTerm: 'POST /v1.43/containers/create with Privileged=true and Binds ["/:/hostfs"]',
          tone: 'sky',
        },
        {
          storyTerm: 'Stepping straight into the warehouse main floor',
          technicalTerm: 'Container entrypoint running chroot /hostfs /bin/sh on the host root filesystem',
          tone: 'rose',
        },
        {
          storyTerm: 'Planting permanent schedules on the master wall',
          technicalTerm: 'Writing host cron jobs or SSH authorized_keys for persistent root access',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Scanning the warehouse hallways for open control panels, the intruder tunes into an unlocked crane radio channel that immediately replies with the crane exact model number and a complete inventory of every cargo box currently running on the floor.',
        storyMappings: [
          {
            storyTerm: 'Unlocked crane radio channel',
            technicalTerm: 'dockerd started with -H tcp://0.0.0.0:2375 and no --tlsverify flag',
            tone: 'amber',
          },
          {
            storyTerm: 'Crane model number and floor inventory',
            technicalTerm: 'Unauthenticated GET /v1.43/version and GET /v1.43/containers/json responses',
            tone: 'sky',
          },
          {
            storyTerm: 'Zero padlock or badge check',
            technicalTerm: 'Cleartext HTTP REST API granting equivalent host root authority to any caller',
            tone: 'rose',
          },
          {
            storyTerm: 'Scanning the warehouse hallways',
            technicalTerm: 'External or lateral network reconnaissance targeting TCP port 2375',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Speaking directly into the unlocked crane console, the intruder orders the crane to lower a lightweight utility box onto the floor with all safety bars removed and its entire back wall hinged directly onto the warehouse master storage room.',
        storyMappings: [
          {
            storyTerm: 'Lightweight utility box',
            technicalTerm: 'Minimal Alpine Linux container image specified in POST /containers/create',
            tone: 'amber',
          },
          {
            storyTerm: 'Safety bars removed',
            technicalTerm: 'HostConfig.Privileged=true disabling Linux capability and device restrictions',
            tone: 'sky',
          },
          {
            storyTerm: 'Back wall hinged directly onto the master storage room',
            technicalTerm: 'HostConfig.Binds ["/:/hostfs"] bind-mounting the entire host root filesystem',
            tone: 'rose',
          },
          {
            storyTerm: 'Crane obeying without question',
            technicalTerm: 'Docker daemon executing as root creating and starting the breakout container',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Once the utility box lands on the floor, the intruder steps through the hinged back wall straight onto the warehouse master floor, adding their own spare front-door key and repeating daily work order directly onto the building permanent host schedules.',
        storyMappings: [
          {
            storyTerm: 'Stepping through the hinged back wall',
            technicalTerm: 'Executing chroot /hostfs /bin/sh to switch root to the host OS',
            tone: 'amber',
          },
          {
            storyTerm: 'Adding a spare front-door key',
            technicalTerm: 'Appending attacker public keys to host /root/.ssh/authorized_keys',
            tone: 'sky',
          },
          {
            storyTerm: 'Adding a repeating daily work order',
            technicalTerm: 'Installing malicious host cron tasks under /etc/cron.d or /var/spool/cron',
            tone: 'rose',
          },
          {
            storyTerm: 'Warehouse floor audit trail',
            technicalTerm: 'Host dockerd audit logs and file integrity alerts on /etc/cron* and ~/.ssh',
            tone: 'emerald',
          },
        ],
      },
    },
  };
