import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const ACTIVE_DIRECTORY_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'ACTIVE_DIRECTORY'),
    {
      category: 'ACTIVE_DIRECTORY',
      defaultMechanic: 'identity-ticket-forge',
      defaultTopology: 'network-hop-chain',
      defaultZoneHeaders: [
        'DOMAIN IDENTITY & AUTHENTICATION TICKET EXCHANGE',
        'UNCOMPROMISED DIRECTORY CONTROL & SECURITY EVENT WITNESS',
      ],
      defaultControl: {
        name: 'Clean Domain Admin & krbtgt Baseline',
        detail: 'Unrelated domain accounts & GPO templates unchanged',
        module: 'Active Directory Trust Boundary',
        explain:
          'By contrasting the forged or downgraded authentication ticket against unmodified directory principals and standard AES-encrypted logons, defenders isolate the exact compromised account and privilege path.',
      },
      defaultWitnessStory:
        'A directory audit monitor inspects the newly minted access pass and alerts on the unusual downgrade while confirming clean accounts remain untouched.',
    }
  );
