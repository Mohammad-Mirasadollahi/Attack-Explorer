import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const KERNEL_FIRMWARE_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'KERNEL_FIRMWARE_BYOVD'),
    {
      category: 'KERNEL_FIRMWARE_BYOVD',
      defaultMechanic: 'ring-boundary-gate',
      defaultTopology: 'split-boundary',
      defaultZoneHeaders: [
        'RING-3 TO RING-0 DRIVER / FIRMWARE BOUNDARY',
        'SIGNED OS KERNEL BASELINE & HARDWARE / ETW TELEMETRY WITNESS',
      ],
      defaultControl: {
        name: 'Signed Kernel & Firmware Integrity Baseline',
        detail: 'Official operating system kernel image & secure boot chain unmodified',
        module: 'Kernel / Boot Integrity Baseline',
        explain:
          'Kernel exploits, vulnerable signed drivers, and firmware implants abuse privileged interfaces below standard user space while leaving signed operating system binaries untouched on disk.',
      },
      defaultWitnessStory:
        'A low-level integrity monitor records the unexpected crossing into privileged hardware control while confirming the standard system files remained intact.',
    }
  );
