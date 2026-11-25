import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const RANSOMWARE_EXTORTION_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'RANSOMWARE_EXTORTION'),
    {
      category: 'RANSOMWARE_EXTORTION',
      defaultMechanic: 'ransomware-io-destroy',
      defaultTopology: 'pipeline-flow',
      defaultZoneHeaders: [
        'RECOVERY DESTRUCTION & RAPID ENCRYPTION PIPELINE',
        'SKIPPED OS BOOT CONTROL & EDR / SOC WITNESS',
      ],
      defaultControl: {
        name: 'Windows Bootloader & Core System DLLs',
        detail: 'Boot-critical OS files skipped so ransom note displays',
        module: 'Ransomware Exclusion List Invariant',
        explain:
          'Ransomware intentionally skips critical operating system boot files so the victim machine stays bootable enough to display the extortion note, leaving a stark boundary between destroyed user volumes and intact OS binaries.',
      },
      defaultWitnessStory:
        'A security guard spots the sudden wave of locked files and destroyed backups while confirming the core startup shelf was deliberately skipped.',
    }
  );
