import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const NETWORK_WEB_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'NETWORK_WEB'),
    {
      category: 'NETWORK_WEB',
      defaultMechanic: 'network-packet-wire',
      defaultTopology: 'network-hop-chain',
      defaultZoneHeaders: [
        'PERIMETER WIRE & APPLICATION PARSER HOP CHAIN',
        'UNTOUCHED BASELINE CONTROL & IDS / WAF WITNESS',
      ],
      defaultControl: {
        name: 'Static Web App Binary & TLS Cert',
        detail: 'Deployed package files & server TLS keys unchanged',
        module: 'Perimeter / Web Service Baseline',
        explain:
          'Because the exploit abuses live request parsing, protocol forwarding, or in-memory execution, the deployed application archive and TLS certificate stay unchanged on disk while wire telemetry captures the malicious payload.',
      },
      defaultWitnessStory:
        'A perimeter monitor inspects the completed network exchange and flags the unusual outbound callback while confirming the neighboring baseline stays clean.',
    }
  );
