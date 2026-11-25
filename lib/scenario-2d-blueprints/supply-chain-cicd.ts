import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const SUPPLY_CHAIN_CICD_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'SUPPLY_CHAIN_CICD'),
    {
      category: 'SUPPLY_CHAIN_CICD',
      defaultMechanic: 'supply-chain-conveyor',
      defaultTopology: 'supplychain-branch',
      defaultZoneHeaders: [
        'UPSTREAM SOURCE, BUILD PIPELINE & ARTIFACT PACKAGING',
        'CLEAN SOURCE REPOSITORY BASELINE & PROVENANCE / CI TELEMETRY',
      ],
      defaultControl: {
        name: 'Clean Upstream Source Commit & Lockfile',
        detail: 'Reviewed upstream source repository matches audited release tag',
        module: 'Source & Artifact Provenance Baseline',
        explain:
          'Supply-chain compromises poison the build runner, package registry, or installer step downstream of audited source code, proving why reproducible builds and provenance attestation are critical.',
      },
      defaultWitnessStory:
        'An automated build-integrity ledger catches the altered output package leaving the assembly line while showing the original reviewed source files were never changed.',
    }
  );
