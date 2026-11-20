import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-linux-systemd-generator-cron-udev-persistence',
    title: 'Freedesktop Systemd Spec & Elastic DFIR — Linux systemd Generator (/run/systemd/generator) & Unit Persistence Forensics',
    category: 'MALWARE',
    mitreId: 'T1543.002',
    description:
      'Grounded in the Freedesktop.org systemd.generator(7) and systemd.unit(5) specifications, Elastic Security Labs Linux persistence research, and MITRE ATT&CK T1543.002: an adversary achieves stealthy boot/daemon-reload persistence by placing a script inside /etc/systemd/system-generators/ (or a drop-in .conf inside /etc/systemd/system/<service>.service.d/) that dynamically generates an ephemeral unit in /run/systemd/generator/ whenever systemctl daemon-reload runs.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Privileged Root Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'systemd-generators Directory', type: 'firewall', status: 'compromised' },
      { id: 'target', label: '/run/systemd/generator Unit', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'journalctl & systemd-analyze', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'systemd (PID 1) ExecStart', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Dropping Executable Generator into /etc/systemd/system-generators/ (auditd PATH Record)',
        narration:
          'Instead of creating a conspicuous unit file directly in /etc/systemd/system/, the actor drops a small executable script at /etc/systemd/system-generators/dbus- early-check (or /usr/lib/systemd/system-generators/). According to the systemd.generator(7) specification, PID 1 executes all binaries in this directory very early during boot and on every systemctl daemon-reload.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Persistence (T1543.002 - Create or Modify System Process: Systemd Service)',
        technicalCommands: [
          'auditctl -w /etc/systemd/ -p wa -k systemd_persistence',
          'auditctl -w /usr/lib/systemd/system-generators/ -p wa -k systemd_generators',
          'Generator Path: /etc/systemd/system-generators/dbus-early-check (mode 0755)',
        ],
        defenseMitigation:
          'Include /etc/systemd/system-generators/, /usr/local/lib/systemd/system-generators/, and /usr/lib/systemd/system-generators/ in auditd and File Integrity Monitoring rules.',
        logs: [
          {
            id: 'dfir-systemd-1',
            timestamp: '02:08:14.110',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'chmod',
            CommandLine: 'chmod 0755 /etc/systemd/system-generators/dbus-early-check',
            raw: 'type=SYSCALL msg=audit(1762135694.110:4910): arch=c000003e syscall=268 (fchmodat) success=yes auid=1000 uid=0 comm="chmod" exe="/usr/bin/chmod" key="systemd_persistence" | type=PATH item=0 name="/etc/systemd/system-generators/dbus-early-check" mode=0100755',
            parsedFields: {
              AuditKey: 'systemd_persistence',
              GeneratorBinary: '/etc/systemd/system-generators/dbus-early-check',
              Permissions: '0100755 (Executable required by systemd.generator spec)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Ephemeral Unit Synthesis in /run/systemd/generator/ on systemctl daemon-reload',
        narration:
          'When systemctl daemon-reload is triggered, systemd (PID 1) invokes /etc/systemd/system-generators/dbus-early-check, passing /run/systemd/generator as argv[1]. The generator writes an ephemeral unit file (/run/systemd/generator/network-health.service) and symlinks it into /run/systemd/generator/multi-user.target.wants/.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Persistence (T1543.002 - Ephemeral /run/systemd/generator/ Unit Synthesis)',
        technicalCommands: [
          'systemctl daemon-reload  # Invokes all generators with argv[1]=/run/systemd/generator',
          'Generated Ephemeral Unit: /run/systemd/generator/network-health.service',
          'Generated Symlink: /run/systemd/generator/multi-user.target.wants/network-health.service',
        ],
        defenseMitigation:
          'Inspect /run/systemd/generator/, /run/systemd/generator.early/, and /run/systemd/generator.late/ during live DFIR triage—standard checks limited to /etc/systemd/system/ miss generator-synthesized units.',
        logs: [
          {
            id: 'dfir-systemd-2',
            timestamp: '02:08:19.420',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'systemd',
            CommandLine: '/etc/systemd/system-generators/dbus-early-check /run/systemd/generator /run/systemd/generator.early /run/systemd/generator.late',
            raw: 'journald: systemd[1]: Reloading. | auditd: pid=3912 ppid=1890 uid=0 exe="/etc/systemd/system-generators/dbus-early-check" proctitle="/etc/systemd/system-generators/dbus-early-check /run/systemd/generator" | Created="/run/systemd/generator/network-health.service"',
            parsedFields: {
              ParentProcess: 'systemd (PID 1 / sd-executor)',
              GeneratorOutputDir: '/run/systemd/generator/',
              SynthesizedUnit: '/run/systemd/generator/network-health.service',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Forensic Attribution via systemctl statusFragmentPath, systemd-analyze & journalctl _SYSTEMD_UNIT',
        narration:
          'During incident response, running systemctl show -p FragmentPath,SourcePath,ExecStart network-health.service and systemd-analyze unit-paths exposes that the active service originates from /run/systemd/generator/network-health.service, while journalctl _PID=1 correlates the reload timestamp with the generator script.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1543.002 - FragmentPath & journalctl Forensic Attribution)',
        technicalCommands: [
          'systemctl show -p Id,FragmentPath,SourcePath,ExecStart,DropInPaths network-health.service',
          'systemd-analyze verify /run/systemd/generator/network-health.service',
          'journalctl _SYSTEMD_UNIT=network-health.service -o verbose',
        ],
        defenseMitigation:
          'Enumerate all loaded units via systemctl list-units --all -o json and verify FragmentPath and DropInPaths for every running service.',
        logs: [
          {
            id: 'dfir-systemd-3',
            timestamp: '02:09:00.105',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'systemctl',
            CommandLine: 'systemctl show -p FragmentPath,ExecStart network-health.service',
            raw: 'systemd_unit_audit: Id=network-health.service FragmentPath=/run/systemd/generator/network-health.service ExecStart={ path=/usr/local/bin/net-telemetry-sync ; argv[]=/usr/local/bin/net-telemetry-sync --daemon } MainPID=4018',
            parsedFields: {
              UnitName: 'network-health.service',
              FragmentPath: '/run/systemd/generator/network-health.service (tmpfs)',
              ExecStartBinary: '/usr/local/bin/net-telemetry-sync',
              GeneratorOrigin: '/etc/systemd/system-generators/dbus-early-check',
            },
          },
        ],
      },
    ],
  };
