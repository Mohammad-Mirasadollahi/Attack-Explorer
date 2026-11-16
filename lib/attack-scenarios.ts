export * from './scenarios/types';

import { AttackScenario } from './scenarios/types';
import { PROCESS_HOLLOWING_SCENARIO } from './scenarios/process-hollowing';
import { LOG4SHELL_SCENARIO } from './scenarios/log4shell-dfir';
import { AMSI_REFLECTIVE_DLL_SCENARIO } from './scenarios/amsi-reflective-dll';
import { AD_KERBEROASTING_SCENARIO } from './scenarios/ad-kerberoasting';
import { DNS_TUNNELING_SCENARIO } from './scenarios/dns-tunneling-exfil';
import { RANSOMWARE_SHADOW_WIPE_SCENARIO } from './scenarios/ransomware-shadow-wipe';
import { APT_PALOALTO_ELASTIC_SCENARIOS } from './scenarios/apt-paloalto-elastic';
import { APT_MICROSOFT_THREAT_INTEL_SCENARIOS } from './scenarios/apt-microsoft-threat-intel';
import { APT_CISCO_F5_SPLUNK_SCENARIOS } from './scenarios/apt-cisco-f5-splunk';
import { APT_KASPERSKY_MANDIANT_CISA_SCENARIOS } from './scenarios/apt-kaspersky-mandiant-cisa';
import { APT_BATCH1_SUPPLYCHAIN_MFT_SCENARIOS } from './scenarios/apt-batch1-supplychain-mft';
import { APT_BATCH2_AD_EXCHANGE_WINDOWS_SCENARIOS } from './scenarios/apt-batch2-ad-exchange-windows';
import { APT_BATCH3_VIRTUALIZATION_APPLIANCES_SCENARIOS } from './scenarios/apt-batch3-virtualization-appliances';
import { APT_BATCH4_ENTERPRISE_OS_ZERODAYS_SCENARIOS } from './scenarios/apt-batch4-enterprise-os-zerodays';
import { APT_BATCH5_CLOUD_SAAS_SCENARIOS } from './scenarios/apt-batch5-cloud-saas';
import { APT_BATCH6_SUPPLYCHAIN_CICD_SCENARIOS } from './scenarios/apt-batch6-supplychain-cicd';
import { APT_BATCH7_ZERODAY_APPLIANCES_SCENARIOS } from './scenarios/apt-batch7-zeroday-appliances';
import { APT_BATCH8_KERNEL_FIRMWARE_BYOVD_SCENARIOS } from './scenarios/apt-batch8-kernel-firmware-byovd';
import { APT_BATCH9_RANSOMWARE_EXTORTION_SCENARIOS } from './scenarios/apt-batch9-ransomware-extortion';
import { VULNCHECK_CWP_AND_DFIR_BATCH1_SCENARIOS } from './scenarios/vulncheck-cwp-and-dfir-batch1';
import { DFIR_OFFICIAL_BATCH2_WINDOWS_ARTIFACTS_SCENARIOS } from './scenarios/dfir-official-batch2-windows-artifacts';
import { DFIR_OFFICIAL_BATCH3_LINUX_CLOUD_CONTAINERS_SCENARIOS } from './scenarios/dfir-official-batch3-linux-cloud-containers';
import { DFIR_OFFICIAL_BATCH4_NETWORK_APPLIANCES_MEMORY_SCENARIOS } from './scenarios/dfir-official-batch4-network-appliances-memory';
import { OFFICIAL_BATCH5_SPECIALIZED_CATEGORIES_SCENARIOS } from './scenarios/official-batch5-specialized-categories';
import { normalizeLegacyDraftScenario } from './scenarios/normalize-legacy-draft-scenario';
import { applyReadableStepGuidesToScenario } from './scenario-step-guides';
import { ensureCascadingProcessHierarchy } from './documentation-structural-diagrams';

const RAW_ATTACK_SCENARIOS: AttackScenario[] = [
  PROCESS_HOLLOWING_SCENARIO,
  LOG4SHELL_SCENARIO,
  AMSI_REFLECTIVE_DLL_SCENARIO,
  AD_KERBEROASTING_SCENARIO,
  DNS_TUNNELING_SCENARIO,
  RANSOMWARE_SHADOW_WIPE_SCENARIO,
  ...APT_PALOALTO_ELASTIC_SCENARIOS,
  ...APT_MICROSOFT_THREAT_INTEL_SCENARIOS,
  ...APT_CISCO_F5_SPLUNK_SCENARIOS,
  ...APT_KASPERSKY_MANDIANT_CISA_SCENARIOS,
  ...APT_BATCH1_SUPPLYCHAIN_MFT_SCENARIOS,
  ...APT_BATCH2_AD_EXCHANGE_WINDOWS_SCENARIOS,
  ...APT_BATCH3_VIRTUALIZATION_APPLIANCES_SCENARIOS,
  ...APT_BATCH4_ENTERPRISE_OS_ZERODAYS_SCENARIOS,
  ...APT_BATCH5_CLOUD_SAAS_SCENARIOS,
  ...APT_BATCH6_SUPPLYCHAIN_CICD_SCENARIOS.map(normalizeLegacyDraftScenario),
  // Batch 7 drafts overlap three richer Batch 3 appliance scenarios — keep first.
  ...APT_BATCH7_ZERODAY_APPLIANCES_SCENARIOS.map(normalizeLegacyDraftScenario),
  ...APT_BATCH8_KERNEL_FIRMWARE_BYOVD_SCENARIOS.map(normalizeLegacyDraftScenario),
  ...APT_BATCH9_RANSOMWARE_EXTORTION_SCENARIOS.map(normalizeLegacyDraftScenario),
  ...VULNCHECK_CWP_AND_DFIR_BATCH1_SCENARIOS.map(normalizeLegacyDraftScenario),
  ...DFIR_OFFICIAL_BATCH2_WINDOWS_ARTIFACTS_SCENARIOS.map(normalizeLegacyDraftScenario),
  ...DFIR_OFFICIAL_BATCH3_LINUX_CLOUD_CONTAINERS_SCENARIOS.map(normalizeLegacyDraftScenario),
  ...DFIR_OFFICIAL_BATCH4_NETWORK_APPLIANCES_MEMORY_SCENARIOS.map(normalizeLegacyDraftScenario),
  ...OFFICIAL_BATCH5_SPECIALIZED_CATEGORIES_SCENARIOS.map(normalizeLegacyDraftScenario),
];

function dedupeScenariosById(scenarios: AttackScenario[]): AttackScenario[] {
  const seen = new Set<string>();
  return scenarios.filter((scenario) => {
    if (seen.has(scenario.id)) return false;
    seen.add(scenario.id);
    return true;
  });
}

export const ATTACK_SCENARIOS: AttackScenario[] = dedupeScenariosById(
  RAW_ATTACK_SCENARIOS
)
  .map(ensureCascadingProcessHierarchy)
  .map(applyReadableStepGuidesToScenario);


