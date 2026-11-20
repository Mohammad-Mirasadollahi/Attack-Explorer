import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'A covert courier disguises every sealed dispatch pouch to look like ordinary office mail, yet the unique way they knock at the gate, the blank default seal printed by their remote warehouse, and the rhythmic ticking of their hourly pickups expose the secret route to observant harbor inspectors.',
      storyMappings: [
        {
          storyTerm: 'Unique way of knocking',
          technicalTerm: 'TLS ClientHello JA3 and JA4 handshake fingerprints',
          tone: 'amber',
        },
        {
          storyTerm: 'Blank default warehouse seal',
          technicalTerm: 'JA3S ServerHello and default Java KeyStore X.509 certificate',
          tone: 'sky',
        },
        {
          storyTerm: 'Rhythmic hourly pickups',
          technicalTerm: 'Periodic beacon sleep and jitter intervals in conn.log',
          tone: 'rose',
        },
        {
          storyTerm: 'Harbor network inspectors',
          technicalTerm: 'Zeek ssl.log and conn.log forensic telemetry',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Even when the courier swaps envelopes to mimic a famous delivery company, harbor inspectors record the exact sequence of handshakes and lock preferences used at the gate, catching a mismatch against genuine browser traffic.',
        storyMappings: [
          {
            storyTerm: 'Recorded handshake sequence',
            technicalTerm: 'JA3 MD5 and JA4 client TLS fingerprint hashes',
            tone: 'amber',
          },
          {
            storyTerm: 'Swapped outer envelope',
            technicalTerm: 'Malleable C2 spoofed HTTP headers and User-Agent',
            tone: 'sky',
          },
          {
            storyTerm: 'Harbor gate ledger',
            technicalTerm: 'Zeek ssl.log encrypted session metadata',
            tone: 'rose',
          },
          {
            storyTerm: 'Genuine browser crowd',
            technicalTerm: 'Baseline enterprise browser TLS cipher suite profiles',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Inspectors next examine how the distant warehouse answers the knock and inspect its wax return stamp, spotting a generic blank seal and matching reply pattern characteristic of an out-of-the-box command post.',
        storyMappings: [
          {
            storyTerm: 'Distant warehouse reply pattern',
            technicalTerm: 'JA3S TLS ServerHello response fingerprint',
            tone: 'amber',
          },
          {
            storyTerm: 'Generic blank wax stamp',
            technicalTerm: 'Self-signed or default Java KeyStore X.509 certificate',
            tone: 'sky',
          },
          {
            storyTerm: 'Matched pair check',
            technicalTerm: 'Correlating JA3 client hash with JA3S server hash',
            tone: 'rose',
          },
          {
            storyTerm: 'Out-of-the-box command post',
            technicalTerm: 'Cobalt Strike Team Server TLS listener',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Finally, inspectors plot every departure timestamp on a wall chart and notice the courier stepping out on a steady drumbeat with only small randomized pauses, confirming an automated check-in loop rather than human browsing.',
        storyMappings: [
          {
            storyTerm: 'Departure timestamp chart',
            technicalTerm: 'Inter-arrival time histogram built from Zeek conn.log',
            tone: 'amber',
          },
          {
            storyTerm: 'Steady automated drumbeat',
            technicalTerm: 'Configured C2 sleep interval with bounded jitter',
            tone: 'sky',
          },
          {
            storyTerm: 'Small randomized pauses',
            technicalTerm: 'Statistical jitter percentage around a fixed mean',
            tone: 'rose',
          },
          {
            storyTerm: 'Human browsing crowd',
            technicalTerm: 'Irregular bursty user web traffic distribution',
            tone: 'emerald',
          },
        ],
      },
    },
  };
