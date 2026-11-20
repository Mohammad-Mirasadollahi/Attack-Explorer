import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
