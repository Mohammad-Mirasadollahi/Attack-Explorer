import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
