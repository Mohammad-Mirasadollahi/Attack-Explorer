import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const CONTAINERS_KUBERNETES_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'CONTAINERS_KUBERNETES'),
    {
      category: 'CONTAINERS_KUBERNETES',
      defaultMechanic: 'cloud-controlplane-hop',
      defaultTopology: 'protocol-layer-stack',
      defaultZoneHeaders: [
        'CONTAINER RUNTIME, POD ISOLATION & CLUSTER CONTROL PLANE',
        'IMMUTABLE CONTAINER IMAGE BASELINE & CLUSTER AUDIT WITNESS',
      ],
      defaultControl: {
        name: 'Immutable Signed Container Image Digest',
        detail: 'Registry image layers remain unmodified during runtime escape',
        module: 'Container Image & Runtime Baseline',
        explain:
          'Container breakouts and cluster control-plane abuse exploit overly permissive mounts, host namespaces, or service accounts at runtime without altering the static container image in the registry.',
      },
      defaultWitnessStory:
        'The cluster audit monitor records the workload stepping outside its isolated box into host control while confirming the original packaged blueprint stayed unchanged.',
    }
  );
