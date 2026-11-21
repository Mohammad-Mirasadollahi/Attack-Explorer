import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A coatroom clerk copies your claim label onto a fixed-size receipt slip, but when a guest hands in an overly long name card, the clerk accidentally prints neighboring coat tickets from the counter drawer onto the back. An outsider grabs a printed executive coat ticket, skips the front check-in desk, and strolls straight into the private corporate office floor.',
        storyMappings: [
          {
            storyTerm: 'Overly long name card',
            technicalTerm: 'Oversized HTTP Host request header (CVE-2023-4966)',
            tone: 'amber',
          },
          {
            storyTerm: 'Neighboring counter tickets',
            technicalTerm: 'Leaked adjacent NetScaler process memory',
            tone: 'sky',
          },
          {
            storyTerm: 'Executive coat ticket',
            technicalTerm: '65-character NSC_AAAC authenticated session cookie',
            tone: 'rose',
          },
          {
            storyTerm: 'Private office floor',
            technicalTerm: 'Internal virtual desktop and remote server tier',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider approaches the public information counter with an unusually long address label. While preparing the printed directory reply, the counter machine overruns its tray and dumps handfuls of neighboring scratch memory straight into the response.',
          storyMappings: [
            {
              storyTerm: 'Public information counter',
              technicalTerm: 'Exposed OpenID discovery endpoint on NetScaler',
              tone: 'amber',
            },
            {
              storyTerm: 'Unusually long address label',
              technicalTerm: 'Oversized HTTP Host header triggering buffer over-read',
              tone: 'sky',
            },
            {
              storyTerm: 'Neighboring scratch memory',
              technicalTerm: 'Adjacent uninitialized heap memory disclosure',
              tone: 'rose',
            },
            {
              storyTerm: 'Thick printed reply',
              technicalTerm: 'Abnormally large HTTP 200 response exceeding 130 KB',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Assetnote, CISA AA23-325A, and Suricata SID 2048918 (network detection signatures for Citrix Bleed): GET /oauth/idp/.well-known/openid-configuration with oversized Host header and >130 KB HTTP 200 response (which signals an active out-of-bounds memory disclosure).',
        },
        2: {
          storyAnalogy:
            'Sifting through the spilled counter scraps, the outsider spots an active sixty-five-symbol coat claim ticket belonging to a signed-in manager. Presenting that copied ticket at the VIP entrance opens the manager desk immediately without any password or buzzer check.',
          storyMappings: [
            {
              storyTerm: 'Spilled counter scraps',
              technicalTerm: 'Raw leaked memory buffer contents',
              tone: 'amber',
            },
            {
              storyTerm: 'Sixty-five-symbol claim ticket',
              technicalTerm: 'Valid NSC_AAAC session cookie token',
              tone: 'sky',
            },
            {
              storyTerm: 'VIP entrance bypass',
              technicalTerm: 'Authenticated session hijack skipping MFA',
              tone: 'rose',
            },
            {
              storyTerm: 'Two separate entry gates',
              technicalTerm: 'Same session cookie observed from two distinct client IPs',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Splunk SURGe and NetScaler AAA Syslog (ns.log session tracking records): Same NSC_AAAC session identifier active across two different client IP addresses / ASNs without a new authentication event (confirming that a stolen session cookie was replayed from an external host).',
        },
        3: {
          storyAnalogy:
            'Seated inside the hijacked manager workspace, the outsider picks up the internal office intercom and issues remote administration orders to adjacent floor vaults across the corporate building.',
          storyMappings: [
            {
              storyTerm: 'Hijacked manager workspace',
              technicalTerm: 'Active remote virtual desktop session',
              tone: 'amber',
            },
            {
              storyTerm: 'Internal office intercom',
              technicalTerm: 'Remote DCOM management interface',
              tone: 'sky',
            },
            {
              storyTerm: 'Remote administration order',
              technicalTerm: 'Spawned mmc.exe -Embedding execution on target hosts',
              tone: 'rose',
            },
            {
              storyTerm: 'Adjacent floor vaults',
              technicalTerm: 'Internal enterprise servers targeted during lateral movement',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in CISA AA23-325A and Mandiant (post-hijack lateral movement indicators): mmc.exe -Embedding spawned on remote servers via DCOM following Citrix ICA session IP change (linking the hijacked remote session to internal network movement). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1550.004 (pairing parent/child process and destination fields) and contain the offending session.',
        },
      },
    };
