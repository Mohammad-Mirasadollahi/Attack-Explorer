import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const MOBILE_TELECOM_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'MOBILE_TELECOM_SPYWARE'),
    {
      category: 'MOBILE_TELECOM_SPYWARE',
      defaultMechanic: 'protocol-bus-actuator',
      defaultTopology: 'split-boundary',
      defaultZoneHeaders: [
        'MOBILE SANDBOX, SIGNALING NETWORK & BASEBAND EXECUTION',
        'SEALED OS PARTITION BASELINE & TELEMETRY / SIGNALING WITNESS',
      ],
      defaultControl: {
        name: 'Sealed Mobile OS System Volume Baseline',
        detail: 'Cryptographically sealed mobile OS volume unchanged across reboot',
        module: 'Mobile Platform Integrity Baseline',
        explain:
          'Mobile spyware and telecom signaling attacks hijack zero-click message parsers, baseband frames, or carrier routing paths in volatile memory while the cryptographically sealed OS partition stays intact.',
      },
      defaultWitnessStory:
        'A network and crash-diagnostic monitor catches the abnormal handoff across the mobile boundary while confirming the sealed system partition stayed unchanged.',
    }
  );
