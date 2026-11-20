import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A strict warehouse bans all delivery trucks from leaving the yard, allowing only tiny postal inquiry slips through the front mail slot. An insider breaks a thick customer ledger into coded postcard labels, mails each label as a routine address lookup, and receives brief coded replies tucked into the return postage stamps.',
        storyMappings: [
          {
            storyTerm: 'Front mail slot',
            technicalTerm: 'Permitted UDP port 53 DNS egress path',
            tone: 'amber',
          },
          {
            storyTerm: 'Coded postcard label',
            technicalTerm: 'Hex-encoded high-entropy DNS subdomain',
            tone: 'sky',
          },
          {
            storyTerm: 'Local post office relay',
            technicalTerm: 'Internal corporate recursive DNS resolver',
            tone: 'rose',
          },
          {
            storyTerm: 'Return postage stamp',
            technicalTerm: 'Authoritative DNS TXT response record',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'Inside the locked archive room, a rogue clerk slices a private customer sheet into tiny numbered strips and converts every letter into pairs of digits. Each coded strip becomes the street label on an outgoing postal lookup card.',
          storyMappings: [
            {
              storyTerm: 'Rogue archive clerk',
              technicalTerm: 'Compromised sync_agent.exe process',
              tone: 'amber',
            },
            {
              storyTerm: 'Numbered digit strips',
              technicalTerm: 'Chunked hexadecimal subdomain labels',
              tone: 'sky',
            },
            {
              storyTerm: 'Outgoing postal lookup card',
              technicalTerm: 'DNS TXT query packet',
              tone: 'rose',
            },
            {
              storyTerm: 'External mail district',
              technicalTerm: 'Attacker-owned authoritative domain',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Sysmon EventID 22 (DNSEvent, which records every process-level domain lookup so defenders can tie abnormal queries back to a specific binary): ProcessId = 4412, Image = C:\\ProgramData\\sync_agent.exe, QueryName = 001.343130322c6a6f686e5f736d6974682c32303635.c2.badactor-dns.net, QueryStatus = 0, QueryResults = "type: 16 ACK:001:NEXT;" (confirming a long hex-encoded subdomain returning a TXT acknowledgment string).',
        },
        2: {
          storyAnalogy:
            'The clerk drops the lookup card into the company mailroom rather than walking to the front gate. Because the gate guard trusts every bag stamped by the company mailroom, the coded inquiry sails straight outside to the remote district office.',
          storyMappings: [
            {
              storyTerm: 'Company mailroom',
              technicalTerm: 'Internal recursive DNS resolver (10.50.1.53)',
              tone: 'amber',
            },
            {
              storyTerm: 'Front gate guard',
              technicalTerm: 'Corporate egress perimeter firewall',
              tone: 'sky',
            },
            {
              storyTerm: 'Mailroom stamped bag',
              technicalTerm: 'Forwarded upstream UDP/53 recursive query',
              tone: 'rose',
            },
            {
              storyTerm: 'Remote district office',
              technicalTerm: 'External authoritative DNS nameserver',
              tone: 'emerald',
            },
          ],
        },
        3: {
          storyAnalogy:
            'The remote district office copies the digit strip off each incoming card to rebuild the stolen customer ledger in order. It then writes a short receipt and next-task note on a return slip marked to expire immediately so the company mailroom never keeps a cached copy.',
          storyMappings: [
            {
              storyTerm: 'Rebuilt customer ledger',
              technicalTerm: 'Reassembled exfiltrated CSV records',
              tone: 'amber',
            },
            {
              storyTerm: 'Return slip note',
              technicalTerm: 'DNS TXT response carrying ACK and sleep directives',
              tone: 'sky',
            },
            {
              storyTerm: 'Immediate expiry stamp',
              technicalTerm: 'Zero-second TTL value preventing resolver caching',
              tone: 'rose',
            },
            {
              storyTerm: 'Archive room workstation',
              technicalTerm: 'Source database backup host (10.50.1.12)',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Sigma and Suricata DNS rules (network and host detection signatures that flag covert command-and-control over domain lookups): 188-byte DNS TXT response with TTL = 0.000000 carrying "TXT ACK:001:CMD:SLEEP_60" from 45.133.1.99:53 through 10.50.1.53 to DB-BACKUP-02 (10.50.1.12) (because legitimate business records rarely pair zero-second caching with high-entropy hex subdomains).',
        },
      },
    };
