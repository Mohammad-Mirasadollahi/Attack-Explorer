import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
      scenarioId: 'dfir-linux-systemd-generator-cron-udev-persistence',
      briefing: {
          headline: 'Scenario Briefing: Official DFIR & Log Forensics Guide for Freedesktop Systemd Spec & Elastic DFIR, Linux systemd Generator (/run/systemd/generator) & Unit Persistence Forensics',
          storyAnalogy: 'Imagine a Linux building where every morning janitor inspects the standard wall roster of scheduled jobs, yet overlooks a tiny automated blueprint-printer tucked inside a hidden generator cabinet. An intruder drops an executable blueprint-printer script into that cabinet so every time the building reloads its schedules, the printer invents a brand-new temporary service card on the fly inside volatile memory, leaving the permanent wall roster completely clean until forensic inspectors trace where the temporary card came from.',
          storyMappings: [
              {
                  storyTerm: 'Executable blueprint-printer dropped into the generator cabinet',
                  technicalTerm: 'Malicious script placed in /etc/systemd/system-generators/ executing on daemon-reload',
                  tone: 'amber',
                },
              {
                  storyTerm: 'Inventing a temporary service card inside volatile memory',
                  technicalTerm: 'Ephemeral .service unit synthesized dynamically inside /run/systemd/generator/',
                  tone: 'sky',
                },
              {
                  storyTerm: 'Permanent wall roster looking completely clean',
                  technicalTerm: 'Zero persistent service files visible inside standard /etc/systemd/system/ audits',
                  tone: 'rose',
                },
              {
                  storyTerm: 'Inspectors tracing the temporary card straight back to its printer',
                  technicalTerm: 'systemctl status FragmentPath and systemd-analyze verify attributing /run/systemd/generator/',
                  tone: 'emerald',
                },
            ],
          plainSummary: 'In this scenario (T1543.002, Freedesktop Systemd Spec & Elastic DFIR - Linux systemd Generator (/run/systemd/generator) & Unit Persistence Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: dropping Executable Generator, then ephemeral Unit Synthesis, then forensic Attribution via systemctl. Steps #1–#3 walk that chain end-to-end by covering Dropping Executable Generator, then Ephemeral Unit Synthesis, then Forensic Attribution via systemctl, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on auditd Event 257 correlated across the documented kill chain.',
          diagramTopologySummary: 'The forensic topology spans Node ① (Privileged Root Session), Node ② (systemd-generators Directory), Node ③ (/run/systemd/generator Unit), Node ④ (Runtime Process & Artifact Context), Node ⑤ (systemd , PID 1 ExecStart), and Node ⑥ (journalctl & systemd-analyze) across 3 chronological steps (#1 to #3).',
          documentedAdvisory: 'Official Vendor & CERT DFIR Documentation (T1543.002) · Freedesktop Systemd Spec & Elastic DFIR, Linux systemd Generator (/run/systemd/generator) & Unit Persistence Forensics',
        },
      steps: [
          {
              stepNumber: 1,
              mitreId: 'T1543.002',
              plainTitle: 'Dropping Executable Generator into /etc/systemd/system-generators/ (auditd PATH Record)',
              storyAnalogy: 'Holding root access on the Linux server, the intruder drops a tiny executable generator script into the special early-boot generator cabinet that runs automatically before ordinary system services even start.',
              simpleExplanation: 'Instead of creating a conspicuous unit file directly in /etc/systemd/system/, the actor drops a small executable script at /etc/systemd/system-generators/dbus- early-check (or /usr/lib/systemd/system-generators/). According to the systemd.generator(7) specification, PID 1 executes all binaries in this directory very early during boot and on every systemctl daemon-reload (logged in Linux Audit Event 257 with AuditKey=systemd_persistence, GeneratorBinary=/etc/systemd/system-generators/dbus-early-check, Permissions=0100755 , Executable required by systemd.generator spec so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes auditctl -w /etc/systemd/ -p wa -k systemd_persistence (which invokes or targets the host daemon/process , auditctl -w /etc/systemd/ -p wa -k systemd_persistence with its runtime command-line arguments and ser so that advances the scenario kill-chain under MITRE T1543.002 during "Dropping Executable Generator into /etc/systemd/system-generators/ , auditd PATH Record" , Instead of creating a conspicuous unit file directly in /etc/systemd/system/, the actor drops a small executable script at /etc/systemd/system-generators/dbus- early-check , or /usr/lib/systemd/system-generators/ while generating verifiable host or network telemetry for DFIR attribution). Next, the follow-up artifact auditctl -w /usr/lib/systemd/system-generators/ -p wa -k systemd_generators runs (which invokes or targets the host daemon/process , auditctl -w /usr/lib/systemd/system-generators/ -p wa -k systemd_generators with its runtime command-l so that advances the scenario kill-chain under MITRE T1543.002 during "Dropping Executable Generator into /etc/systemd/system-generators/ , auditd PATH Record" , Instead of creating a conspicuous unit file directly in /etc/systemd/system/, the actor drops a small executable script at /etc/systemd/system-generators/dbus- early-check , or /usr/lib/systemd/system-generators/ while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #1 / Link #1 across the topology from Privileged Root Session and systemd-generators Directory toward /run/systemd/generator Unit and journalctl & systemd-analyze.',
              detectionAndEvidence: 'Documented in Linux Audit Event 257 (recording AuditKey=systemd_persistence, GeneratorBinary=/etc/systemd/system-generators/dbus-early-check, Permissions=0100755 , Executable required by systemd.generator spec under T1543.002): Include /etc/systemd/system-generators/, /usr/local/lib/systemd/system-generators/, and /usr/lib/systemd/system-generators/ in auditd and File Integrity Monitoring rules.',
              storyMappings: [
                  {
                      storyTerm: 'Special early-boot generator cabinet',
                      technicalTerm: 'Directory /etc/systemd/system-generators/ (or /usr/local/lib/systemd/system-generators/)',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Tiny executable generator script',
                      technicalTerm: 'Attacker-placed executable run as root by PID 1 during boot and systemctl daemon-reload',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Unusual write caught by kernel file watches',
                      technicalTerm: 'Linux auditd rule monitoring /etc/systemd/system-generators/ creation and chmod +x',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Stealth alternative to noisy cron jobs',
                      technicalTerm: 'Evading standard /etc/crontab and /etc/systemd/system/ persistence triage scripts',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 2,
              mitreId: 'T1543.002',
              plainTitle: 'Ephemeral Unit Synthesis in /run/systemd/generator/ on systemctl daemon-reload',
              storyAnalogy: 'Whenever the server boots or an administrator refreshes service configurations, the hidden generator script prints a fresh ephemeral unit card straight into temporary RAM storage and links it onto the multi-user startup rail.',
              simpleExplanation: 'When systemctl daemon-reload is triggered, systemd (PID 1) invokes /etc/systemd/system-generators/dbus-early-check, passing /run/systemd/generator as argv[1]. The generator writes an ephemeral unit file (/run/systemd/generator/network-health.service) and symlinks it into /run/systemd/generator/multi-user.target.wants/ (logged in Linux Audit Event 1 with ParentProcess=systemd , PID 1 / sd-executor, GeneratorOutputDir=/run/systemd/generator/, SynthesizedUnit=/run/systemd/generator/network-health.service so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes systemctl daemon-reload # Invokes all generators with argv[1]=/run/systemd/generator (which invokes or targets the host daemon/process , systemctl daemon-reload # Invokes all generators with argv[1]=/run/systemd/generator with its runtime so that advances the scenario kill-chain under MITRE T1543.002 during "Ephemeral Unit Synthesis in /run/systemd/generator/ on systemctl daemon-reload" , When systemctl daemon-reload is triggered, systemd , PID 1 invokes /etc/systemd/system-generators/dbus-early-check, passing /run/systemd/generator as argv[1] while generating verifiable host or network telemetry for DFIR attribution). Next, the follow-up artifact Generated Ephemeral Unit: /run/systemd/generator/network-health.service runs (which invokes or targets the host daemon/process , Generated Ephemeral Unit: /run/systemd/generator/network-health.service with its runtime command-line so that advances the scenario kill-chain under MITRE T1543.002 during "Ephemeral Unit Synthesis in /run/systemd/generator/ on systemctl daemon-reload" , When systemctl daemon-reload is triggered, systemd , PID 1 invokes /etc/systemd/system-generators/dbus-early-check, passing /run/systemd/generator as argv[1] while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #2 / Link #2 across the topology from Privileged Root Session and systemd-generators Directory toward /run/systemd/generator Unit and journalctl & systemd-analyze.',
              detectionAndEvidence: 'Documented in Linux Audit Event 1 (recording ParentProcess=systemd , PID 1 / sd-executor, GeneratorOutputDir=/run/systemd/generator/, SynthesizedUnit=/run/systemd/generator/network-health.service under T1543.002): Inspect /run/systemd/generator/, /run/systemd/generator.early/, and /run/systemd/generator.late/ during live DFIR triage, standard checks limited to /etc/systemd/system/ miss generator-synthesized units.',
              storyMappings: [
                  {
                      storyTerm: 'Refreshing service configurations or booting',
                      technicalTerm: 'PID 1 executing all generators during system boot or systemctl daemon-reload',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Fresh ephemeral unit card printed in temporary RAM storage',
                      technicalTerm: 'Dynamically synthesized .service unit written to tmpfs /run/systemd/generator/',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Linking onto the multi-user startup rail',
                      technicalTerm: 'Symlink created inside /run/systemd/generator/multi-user.target.wants/',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Self-regenerating persistence',
                      technicalTerm: 'Deleting only the /run unit fails because the /etc generator recreates it on next reload',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 3,
              mitreId: 'T1543.002',
              plainTitle: 'Forensic Attribution via systemctl statusFragmentPath, systemd-analyze & journalctl _SYSTEMD_UNIT',
              storyAnalogy: 'Rather than trusting only the static wall roster, forensic responders inspect every running service exact origin fragment path and audit the generator cabinets directly, immediately exposing the temporary unit and eliminating the root generator script.',
              simpleExplanation: 'During incident response, running systemctl show -p FragmentPath,SourcePath,ExecStart network-health.service and systemd-analyze unit-paths exposes that the active service originates from /run/systemd/generator/network-health.service, while journalctl _PID=1 correlates the reload timestamp with the generator script (logged in Linux Audit Event 200 with UnitName=network-health.service, FragmentPath=/run/systemd/generator/network-health.service , tmpfs, ExecStartBinary=/usr/local/bin/net-telemetry-sync, GeneratorOrigin=/etc/systemd/system-generators/dbus-early-check so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes systemctl show -p Id,FragmentPath,SourcePath,ExecStart,DropInPaths network-health.service (which executes the technical command / telemetry directive , systemctl show -p Id,FragmentPath,SourcePath,ExecStart,DropInPaths network-health.service vi so that advances the scenario kill-chain under MITRE T1543.002 during "Forensic Attribution via systemctl statusFragmentPath, systemd-analyze & journalctl _SYSTEMD_UNIT" , During incident response, running systemctl show -p FragmentPath,SourcePath,ExecStart network-health while generating verifiable host or network telemetry for DFIR attribution). Next, the follow-up artifact systemd-analyze verify /run/systemd/generator/network-health.service runs (which invokes or targets the host daemon/process , systemd-analyze verify /run/systemd/generator/network-health.service with its runtime command-line arg so that advances the scenario kill-chain under MITRE T1543.002 during "Forensic Attribution via systemctl statusFragmentPath, systemd-analyze & journalctl _SYSTEMD_UNIT" , During incident response, running systemctl show -p FragmentPath,SourcePath,ExecStart network-health while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #3 / Link #3 across the topology from Privileged Root Session and systemd-generators Directory toward /run/systemd/generator Unit and journalctl & systemd-analyze.',
              detectionAndEvidence: 'Documented in Linux Audit Event 200 (recording UnitName=network-health.service, FragmentPath=/run/systemd/generator/network-health.service , tmpfs, ExecStartBinary=/usr/local/bin/net-telemetry-sync, GeneratorOrigin=/etc/systemd/system-generators/dbus-early-check under T1543.002): Enumerate all loaded units via systemctl list-units --all -o json and verify FragmentPath and DropInPaths for every running service.',
              storyMappings: [
                  {
                      storyTerm: 'Inspecting every service exact origin fragment path',
                      technicalTerm: 'systemctl show -p FragmentPath / systemctl status pointing to /run/systemd/generator/',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Automated unit-integrity analyzer',
                      technicalTerm: 'systemd-analyze verify and unit-file audits uncovering synthesized backdoors',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Eliminating the root blueprint-printer script',
                      technicalTerm: 'Removing the rogue executable from /etc/systemd/system-generators/ and reloading systemd',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Complete Linux startup persistence hygiene',
                      technicalTerm: 'Auditing systemd generators alongside udev rules and cron directories',
                      tone: 'emerald',
                    },
                ],
            },
        ],
    };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a Linux building where every morning janitor inspects the standard wall roster of scheduled jobs, yet overlooks a tiny automated blueprint-printer tucked inside a hidden generator cabinet. An intruder drops an executable blueprint-printer script into that cabinet so every time the building reloads its schedules, the printer invents a brand-new temporary service card on the fly inside volatile memory, leaving the permanent wall roster completely clean until forensic inspectors trace where the temporary card came from.',
      storyMappings: [
        {
          storyTerm: 'Executable blueprint-printer dropped into the generator cabinet',
          technicalTerm: 'Malicious script placed in /etc/systemd/system-generators/ executing on daemon-reload',
          tone: 'amber',
        },
        {
          storyTerm: 'Inventing a temporary service card inside volatile memory',
          technicalTerm: 'Ephemeral .service unit synthesized dynamically inside /run/systemd/generator/',
          tone: 'sky',
        },
        {
          storyTerm: 'Permanent wall roster looking completely clean',
          technicalTerm: 'Zero persistent service files visible inside standard /etc/systemd/system/ audits',
          tone: 'rose',
        },
        {
          storyTerm: 'Inspectors tracing the temporary card straight back to its printer',
          technicalTerm: 'systemctl status FragmentPath and systemd-analyze verify attributing /run/systemd/generator/',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding root access on the Linux server, the intruder drops a tiny executable generator script into the special early-boot generator cabinet that runs automatically before ordinary system services even start.',
        storyMappings: [
          {
            storyTerm: 'Special early-boot generator cabinet',
            technicalTerm: 'Directory /etc/systemd/system-generators/ (or /usr/local/lib/systemd/system-generators/)',
            tone: 'amber',
          },
          {
            storyTerm: 'Tiny executable generator script',
            technicalTerm: 'Attacker-placed executable run as root by PID 1 during boot and systemctl daemon-reload',
            tone: 'sky',
          },
          {
            storyTerm: 'Unusual write caught by kernel file watches',
            technicalTerm: 'Linux auditd rule monitoring /etc/systemd/system-generators/ creation and chmod +x',
            tone: 'rose',
          },
          {
            storyTerm: 'Stealth alternative to noisy cron jobs',
            technicalTerm: 'Evading standard /etc/crontab and /etc/systemd/system/ persistence triage scripts',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Whenever the server boots or an administrator refreshes service configurations, the hidden generator script prints a fresh ephemeral unit card straight into temporary RAM storage and links it onto the multi-user startup rail.',
        storyMappings: [
          {
            storyTerm: 'Refreshing service configurations or booting',
            technicalTerm: 'PID 1 executing all generators during system boot or systemctl daemon-reload',
            tone: 'amber',
          },
          {
            storyTerm: 'Fresh ephemeral unit card printed in temporary RAM storage',
            technicalTerm: 'Dynamically synthesized .service unit written to tmpfs /run/systemd/generator/',
            tone: 'sky',
          },
          {
            storyTerm: 'Linking onto the multi-user startup rail',
            technicalTerm: 'Symlink created inside /run/systemd/generator/multi-user.target.wants/',
            tone: 'rose',
          },
          {
            storyTerm: 'Self-regenerating persistence',
            technicalTerm: 'Deleting only the /run unit fails because the /etc generator recreates it on next reload',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Rather than trusting only the static wall roster, forensic responders inspect every running service exact origin fragment path and audit the generator cabinets directly, immediately exposing the temporary unit and eliminating the root generator script.',
        storyMappings: [
          {
            storyTerm: 'Inspecting every service exact origin fragment path',
            technicalTerm: 'systemctl show -p FragmentPath / systemctl status pointing to /run/systemd/generator/',
            tone: 'amber',
          },
          {
            storyTerm: 'Automated unit-integrity analyzer',
            technicalTerm: 'systemd-analyze verify and unit-file audits uncovering synthesized backdoors',
            tone: 'sky',
          },
          {
            storyTerm: 'Eliminating the root blueprint-printer script',
            technicalTerm: 'Removing the rogue executable from /etc/systemd/system-generators/ and reloading systemd',
            tone: 'rose',
          },
          {
            storyTerm: 'Complete Linux startup persistence hygiene',
            technicalTerm: 'Auditing systemd generators alongside udev rules and cron directories',
            tone: 'emerald',
          },
        ],
      },
    },
  };
