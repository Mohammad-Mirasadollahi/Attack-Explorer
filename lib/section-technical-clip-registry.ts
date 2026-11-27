import type { Section3DKey } from '@/lib/section-3d-registry';

/**
 * SVG + GSAP teaching clips — separate from Excalidraw whiteboards.
 * Which sections qualify, and how a clip decides its drawings, is MOD-14
 * (`docs/standards/14-technical-clip-silent-lecture-standard.md`).
 * Do not register `briefing`. Register `memory-forensics` when the claim is a visual difference.
 */
const SCENARIO_TECHNICAL_CLIPS: Record<
  string,
  Partial<Record<Section3DKey, true>>
> = {
  'process-hollowing': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'step-5': true,
    'memory-forensics': true,
  },
  'amsi-reflective-dll': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'memory-forensics': true,
  },
  'ransomware-shadow-wipe': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
  },
  '3cx-desktopapp-supply-chain-lazarus': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'memory-forensics': true,
  },
  'xz-utils-cve-2024-3094-backdoor': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'memory-forensics': true,
  },
  'dfir-lsass-minidump-comsvcs-sysmon-eid10': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'memory-forensics': true,
  },
  'ad-kerberoasting': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'memory-forensics': true,
  },
  'zerologon-netlogon-cve-2020-1472': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'memory-forensics': true,
  },
  'dfir-dcsync-drsuapi-replication-eid4662': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'memory-forensics': true,
  },
  'log4shell-dfir': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'memory-forensics': true,
  },
  'dns-tunneling-exfil': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'memory-forensics': true,
  },
};

export function hasTechnicalClip(
  scenarioId: string,
  sectionKey: Section3DKey
): boolean {
  return Boolean(SCENARIO_TECHNICAL_CLIPS[scenarioId]?.[sectionKey]);
}
