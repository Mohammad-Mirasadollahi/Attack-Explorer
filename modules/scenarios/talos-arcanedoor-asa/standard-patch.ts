import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A fortress gatekeeper checks visitor clearance cards using an internal handbook kept on a live workbench. An outsider slips a coded message into the clearance envelope that rewrites pages on the live workbench, turns off the watchtower alarm bell, and plants a hidden archive package in the basement vault so the backdoor returns after every seasonal rebuild.',
        storyMappings: [
          {
            storyTerm: 'Fortress gatekeeper',
            technicalTerm: 'Perimeter network security firewall appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Clearance envelope message',
            technicalTerm: 'Oversized encoded authentication POST payload',
            tone: 'sky',
          },
          {
            storyTerm: 'Live workbench rewrite',
            technicalTerm: 'Line Dancer in-memory resident implant',
            tone: 'rose',
          },
          {
            storyTerm: 'Basement vault archive',
            technicalTerm: 'Line Runner persistent web package across reboots',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An uninvited courier mails an oversized clearance envelope to the fortress side window. Inside the reply form, folded rows of coded symbols slip past the gatekeeper check and place raw instructions onto the active guard workbench.',
          storyMappings: [
            {
              storyTerm: 'Fortress side window',
              technicalTerm: 'SSL remote-access authentication endpoint',
              tone: 'amber',
            },
            {
              storyTerm: 'Oversized clearance envelope',
              technicalTerm: 'Crafted host-scan-reply POST body',
              tone: 'sky',
            },
            {
              storyTerm: 'Folded coded symbols',
              technicalTerm: 'Base64-encoded binary instruction payload',
              tone: 'rose',
            },
            {
              storyTerm: 'Active guard workbench',
              technicalTerm: 'Running appliance process memory',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Cisco Talos (CVE-2024-20353 advisory covering perimeter firewall exploitation): anomalous POST requests to /CSCOSSLC/config-auth with oversized <host-scan-reply> payloads from non-VPN client IPs (flagging malformed pre-authentication requests used to trigger the flaw).',
        },
        2: {
          storyAnalogy:
            'Once active on the workbench, a silent in-memory agent mutes the watchtower logbook bell and redirects incoming check-in packets so the outsider can inspect traffic and run custom gate commands without leaving paper records.',
          storyMappings: [
            {
              storyTerm: 'Silent workbench agent',
              technicalTerm: 'Line Dancer memory-only implant',
              tone: 'amber',
            },
            {
              storyTerm: 'Muting the logbook bell',
              technicalTerm: 'Suppression of outbound syslog audit alerts',
              tone: 'sky',
            },
            {
              storyTerm: 'Guard handbook text',
              technicalTerm: 'Running appliance executable code segment',
              tone: 'rose',
            },
            {
              storyTerm: 'Custom gate commands',
              technicalTerm: 'Arbitrary memory-dispatched appliance actions',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Cisco Talos ArcaneDoor IOC Guide (integrity validation steps for hardware security appliances): verify /md5 system:memory/text hash mismatch on the running ASA lina text segment and unexpected gaps in ASA syslog sequence numbers (proving in-memory code tampering and suppressed logging).',
        },
        3: {
          storyAnalogy:
            'To survive a full guard shift change and fortress restart, the outsider places a concealed spare bundle inside the basement storage cabinet that automatically unpacks a hidden side-door script every time the fortress powers back on.',
          storyMappings: [
            {
              storyTerm: 'Basement storage cabinet',
              technicalTerm: 'Persistent flash storage boot filesystem',
              tone: 'amber',
            },
            {
              storyTerm: 'Concealed spare bundle',
              technicalTerm: 'Line Runner archive exploiting CVE-2024-20359',
              tone: 'sky',
            },
            {
              storyTerm: 'Fortress shift restart',
              technicalTerm: 'Device reboot and firmware upgrade cycle',
              tone: 'rose',
            },
            {
              storyTerm: 'Hidden side-door script',
              technicalTerm: 'Persistent unauthorized Lua web handler',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Cisco Advisory CVE-2024-20359 and NCSC Guidance (post-incident persistence checks for edge firewalls): unauthorized files on disk0: boot paths and system:memory/text integrity verification failure (confirming that a persistent archive survived appliance reboots).',
        },
      },
    };
