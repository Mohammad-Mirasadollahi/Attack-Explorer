import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A border tollhouse stamps every traveler ticket into a scratch folder, and an automated courier sweeps that folder every minute while reading each folder label aloud as a spoken order. An outsider submits a twisted ticket label that places a disguised order slip into the courier bin, tricks the courier into running it, and tucks a permanent listener card into the tollhouse rulebook.',
        storyMappings: [
          {
            storyTerm: 'Border tollhouse gateway',
            technicalTerm: 'PAN-OS GlobalProtect firewall appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Twisted ticket label',
            technicalTerm: 'Path-traversal SESSID cookie string',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated minute courier',
            technicalTerm: 'Root device telemetry cron job (dt_curl)',
            tone: 'rose',
          },
          {
            storyTerm: 'Permanent listener card',
            technicalTerm: 'UPSTYLE Python persistence script in system.pth',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider sends a traveler pass whose ticket stamp climbs backward out of the ordinary ticket drawer and drops a blank file into the hourly courier tray. The file name itself secretly spells out an instruction for the courier to follow later.',
          storyMappings: [
            {
              storyTerm: 'Traveler pass ticket stamp',
              technicalTerm: 'SESSID HTTP cookie header',
              tone: 'amber',
            },
            {
              storyTerm: 'Climbing backward out of the drawer',
              technicalTerm: 'Directory traversal sequence (CVE-2024-3400)',
              tone: 'sky',
            },
            {
              storyTerm: 'Hourly courier tray',
              technicalTerm: 'Device telemetry minute staging directory',
              tone: 'rose',
            },
            {
              storyTerm: 'Instruction spelled in the file label',
              technicalTerm: 'Shell command embedded inside a zero-byte filename',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Unit 42, Volexity, and Rapid7 CVE-2024-3400 advisories (incident response reports detailing perimeter appliance exploitation): PAN-OS appweb3 logs showing Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/ and zero-byte file creation errors (which expose path traversal attempts targeting the telemetry staging folder). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
        },
        2: {
          storyAnalogy:
            'When the tollhouse clock strikes the next minute, the privileged automated courier gathers every filename from the tray and hands the raw label straight to the building command desk. The disguised label executes immediately with master supervisor authority.',
          storyMappings: [
            {
              storyTerm: 'Privileged automated courier',
              technicalTerm: 'Scheduled root dt_curl telemetry utility',
              tone: 'amber',
            },
            {
              storyTerm: 'Building command desk',
              technicalTerm: 'Underlying operating system shell interpreter',
              tone: 'sky',
            },
            {
              storyTerm: 'Master supervisor authority',
              technicalTerm: 'Root privilege execution context',
              tone: 'rose',
            },
            {
              storyTerm: 'External pickup call',
              technicalTerm: 'Outbound staging retrieval initiated by dt_curl',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Unit 42 and Volexity (forensic analysis of compromised PAN-OS telemetry logs): /var/log/pan/device_telemetry_send.log containing shell syntax fragments and unexpected outbound connections initiated by dt_curl (proving that a crafted filename was evaluated as an operating system command).',
        },
        3: {
          storyAnalogy:
            'To keep quiet access after the courier finishes, the outsider slips an extra instruction sheet into the tollhouse startup manual so the front gate quietly checks error logs for hidden requests. From that foothold, the outsider copies the master vault directory listing.',
          storyMappings: [
            {
              storyTerm: 'Tollhouse startup manual',
              technicalTerm: 'Python site-packages system.pth loader file',
              tone: 'amber',
            },
            {
              storyTerm: 'Quiet error-log watcher',
              technicalTerm: 'UPSTYLE web error log command handler',
              tone: 'sky',
            },
            {
              storyTerm: 'Master vault directory',
              technicalTerm: 'Firewall running configuration and credential store',
              tone: 'rose',
            },
            {
              storyTerm: 'Front gate web counter',
              technicalTerm: 'GlobalProtect SSL portal web server',
              tone: 'emerald',
            },
          ],
        },
      },
    };
