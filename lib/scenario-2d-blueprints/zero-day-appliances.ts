import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const ZERO_DAY_APPLIANCES_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'ZERO_DAY_APPLIANCES'),
    {
      category: 'ZERO_DAY_APPLIANCES',
      defaultMechanic: 'network-packet-wire',
      defaultTopology: 'split-boundary',
      defaultZoneHeaders: [
        'EDGE APPLIANCE / VPN GATEWAY EXPLOIT INGRESS',
        'APPLIANCE INTEGRITY BASELINE & OUT-OF-BAND TELEMETRY',
      ],
      defaultControl: {
        name: 'Signed Vendor Firmware Image (Read-Only)',
        detail: 'Factory ROM partition & vendor root cert unchanged',
        module: 'Edge Appliance Trust Anchor',
        explain:
          'Edge appliance zero-days often patch volatile RAM or writable configuration partitions while leaving the read-only vendor image untouched, making external network telemetry and integrity checks vital.',
      },
      defaultWitnessStory:
        'An external watchtower records the unexpected gateway behavior and flags the perimeter breach while confirming the factory baseline stayed clean.',
    }
  );
