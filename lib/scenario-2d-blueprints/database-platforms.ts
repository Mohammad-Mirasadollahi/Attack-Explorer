import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const DATABASE_PLATFORMS_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'DATABASE_DATA_PLATFORMS'),
    {
      category: 'DATABASE_DATA_PLATFORMS',
      defaultMechanic: 'protocol-bus-actuator',
      defaultTopology: 'protocol-layer-stack',
      defaultZoneHeaders: [
        'DATA ENGINE QUERY EXECUTION & STORAGE EXTRACTION PATH',
        'DATABASE SCHEMA BASELINE & QUERY AUDIT LOG WITNESS',
      ],
      defaultControl: {
        name: 'Database Engine Binary & Schema Baseline',
        detail: 'Core database engine binaries & table definitions remain intact',
        module: 'Database Engine Integrity Baseline',
        explain:
          'Data platform intrusions abuse exposed administrative interfaces, query execution features, or stolen analytics credentials to extract sensitive datasets without modifying the underlying database engine software.',
      },
      defaultWitnessStory:
        'The database audit trail flags the unusual bulk query and unexpected export path while confirming the core data-engine software remained unmodified.',
    }
  );
