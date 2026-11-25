import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const ICS_OT_SCADA_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'ICS_OT_SCADA'),
    {
      category: 'ICS_OT_SCADA',
      defaultMechanic: 'protocol-bus-actuator',
      defaultTopology: 'split-boundary',
      defaultZoneHeaders: [
        'IT/OT PURDUE BOUNDARY & INDUSTRIAL FIELD CONTROLLER BUS',
        'VERIFIED SAFETY LOGIC BASELINE & OT NETWORK SENSOR WITNESS',
      ],
      defaultControl: {
        name: 'Verified Field Controller Safety Baseline',
        detail: 'Offline golden engineering project & safety setpoints archived',
        module: 'Industrial Control Safety Baseline',
        explain:
          'Industrial attacks cross the boundary from corporate workstations into control buses to issue unauthorized physical actuation commands or alter controller logic while operator screens appear normal.',
      },
      defaultWitnessStory:
        'A passive industrial sensor on the control bus spots unauthorized actuation commands racing toward field equipment and alerts engineers before physical damage occurs.',
    }
  );
