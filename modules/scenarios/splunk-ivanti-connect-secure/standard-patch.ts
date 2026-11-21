import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A secure commuter tunnel checks entry badges at the main turnstile, but a side stairwell lets someone step back a hallway and walk into the control booth unchallenged. Once inside, the intruder writes a hidden command into the license meter and alters three permanent booth manuals so every future inspection still reports all systems normal.',
        storyMappings: [
          {
            storyTerm: 'Commuter tunnel gate',
            technicalTerm: 'Ivanti Connect Secure VPN gateway appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Side stairwell shortcut',
            technicalTerm: 'Path traversal authentication bypass (CVE-2023-46805)',
            tone: 'sky',
          },
          {
            storyTerm: 'License meter dial',
            technicalTerm: 'Command injection in keys-status endpoint (CVE-2024-21887)',
            tone: 'rose',
          },
          {
            storyTerm: 'Altered booth manuals',
            technicalTerm: 'Persistent web, library, and integrity-checker implants',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider knocks on a public helper window and adds backward hallway steps onto the room number. The door guard checks only the starting corridor and waves the visitor straight into the restricted control booth.',
          storyMappings: [
            {
              storyTerm: 'Public helper window',
              technicalTerm: 'Unauthenticated backup-code API path prefix',
              tone: 'amber',
            },
            {
              storyTerm: 'Backward hallway steps',
              technicalTerm: 'Relative ../ directory traversal path segments',
              tone: 'sky',
            },
            {
              storyTerm: 'Restricted control booth',
              technicalTerm: 'Protected internal administrative REST endpoints',
              tone: 'rose',
            },
            {
              storyTerm: 'Tunnel door guard',
              technicalTerm: 'Gateway URL route authorization filter',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in CISA ED 24-01 and Splunk SURGe (emergency federal directive and detection rules for gateway traversal): HTTP requests containing /api/v1/totp/user-backup-code/.. or /api/v1/cav/client/status/.. (which reveal attempts to step out of public routes into restricted administrative handlers). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
        },
        2: {
          storyAnalogy:
            'Inside the control booth, the visitor types a semicolon and extra workshop orders directly into the license status gauge. The gauge passes the raw text straight to the basement machinery, granting instant full control.',
          storyMappings: [
            {
              storyTerm: 'License status gauge',
              technicalTerm: 'Internal /api/v1/license/keys-status/ parameter',
              tone: 'amber',
            },
            {
              storyTerm: 'Semicolon extra order',
              technicalTerm: 'OS command injection payload (CVE-2024-21887)',
              tone: 'sky',
            },
            {
              storyTerm: 'Basement machinery',
              technicalTerm: 'Underlying Linux shell spawned by web daemon',
              tone: 'rose',
            },
            {
              storyTerm: 'Control booth intercom',
              technicalTerm: 'Appliance syslog and unallocated access logs',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Volexity and Mandiant (incident investigations of chained gateway compromises): Ivanti unallocated log / syslog entries showing /api/v1/license/keys-status/; followed by unexpected child processes of the web daemon (proving command injection after authentication bypass).',
        },
        3: {
          storyAnalogy:
            'Before leaving, the intruder edits a visitor log page to accept secret requests, inserts a quiet traffic filter ahead of normal booth tools, and rewrites the safety inspector checklist so internal self-audits report a clean bill of health.',
          storyMappings: [
            {
              storyTerm: 'Edited visitor log page',
              technicalTerm: 'WIREFIRE web backdoor inside visits.py',
              tone: 'amber',
            },
            {
              storyTerm: 'Quiet traffic filter',
              technicalTerm: 'ZIPLINE passive interceptor via LD_PRELOAD',
              tone: 'sky',
            },
            {
              storyTerm: 'Rewritten inspector checklist',
              technicalTerm: 'Tampered ComponentIntegrity.pm checker module',
              tone: 'rose',
            },
            {
              storyTerm: 'External auditor snapshot',
              technicalTerm: 'Out-of-band Integrity Checker Tool verification',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Volexity (UTA0178) and Mandiant (UNC5221) (forensic artifact lists for persistent gateway backdoors): modification of visits.py, libsecure.so (ZIPLINE), and ComponentIntegrity.pm discovered via external Integrity Checker Tool (ICT) snapshots (because on-box checkers can be blinded by the intruder). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1556 (pairing parent/child process and destination fields) and contain the offending session.',
        },
      },
    };
