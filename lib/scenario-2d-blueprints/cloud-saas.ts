import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const CLOUD_SAAS_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'CLOUD_SAAS'),
    {
      category: 'CLOUD_SAAS',
      defaultMechanic: 'cloud-controlplane-hop',
      defaultTopology: 'protocol-layer-stack',
      defaultZoneHeaders: [
        'CLOUD / SAAS IDENTITY & CONTROL-PLANE ESCALATION',
        'IMMUTABLE POLICY GUARD & CLOUD AUDIT TRAIL',
      ],
      defaultControl: {
        name: 'Root Billing Account & Organization SCP',
        detail: 'Organization-level guardrails & unrelated regions untouched',
        module: 'Cloud Control-Plane Trust Boundary',
        explain:
          'Because cloud privilege escalations pivot through delegated roles, STS tokens, or OAuth sessions rather than root passwords, organization-wide guardrails stay intact and provide a clear forensic baseline.',
      },
      defaultWitnessStory:
        'A cloud ledger monitor records the sudden jump in permissions and alerts defenders while confirming the untouched outer boundary stayed intact.',
    }
  );
