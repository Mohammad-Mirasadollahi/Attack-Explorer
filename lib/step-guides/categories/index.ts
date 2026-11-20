import type { CategoryStandardPatchMap } from './types';
import { MALWARE_PART_A_STANDARD_PATCHES } from './01a-malware-core-apt';
import { MALWARE_PART_B_STANDARD_PATCHES } from './01b-malware-dfir';
import { ACTIVE_DIRECTORY_STANDARD_PATCHES } from './02-active-directory';
import { CATEGORY_03A_NETWORK_WEB_CORE_APT_PATCHES } from './03a-network-web-core-apt';
import { CATEGORY_03B_NETWORK_WEB_EDGE_PATCHES } from './03b-network-web-edge';
import { CATEGORY_03C_NETWORK_WEB_DFIR_PATCHES } from './03c-network-web-dfir';
import { CLOUD_SAAS_STANDARD_PATCHES } from './04-cloud-saas';
import { SUPPLY_CHAIN_CICD_STANDARD_PATCHES } from './05-supply-chain-cicd';
import { ZERO_DAY_APPLIANCES_STANDARD_PATCHES } from './06-zero-day-appliances';
import { KERNEL_FIRMWARE_BYOVD_STANDARD_PATCHES } from './07-kernel-firmware-byovd';
import { RANSOMWARE_EXTORTION_STANDARD_PATCHES } from './08-ransomware-extortion';
import { CONTAINERS_KUBERNETES_STANDARD_PATCHES } from './09-containers-kubernetes';
import { ICS_OT_SCADA_PATCHES } from './10-ics-ot-scada';
import { MOBILE_TELECOM_SPYWARE_PATCHES } from './11-mobile-telecom-spyware';
import { DATABASE_DATA_PLATFORMS_PATCHES } from './12-database-data-platforms';
import { AI_LLM_MLOPS_SECURITY_PATCHES } from './13-ai-llm-mlops-security';

/**
 * Aggregated category-by-category text standard upgrades covering all 13 categories
 * (187 upgraded scenarios + gold-standard process-hollowing = 188 scenarios total),
 * enforcing MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11.
 */
export const ALL_CATEGORY_STANDARD_PATCHES: CategoryStandardPatchMap = {
  ...MALWARE_PART_A_STANDARD_PATCHES,
  ...MALWARE_PART_B_STANDARD_PATCHES,
  ...ACTIVE_DIRECTORY_STANDARD_PATCHES,
  ...CATEGORY_03A_NETWORK_WEB_CORE_APT_PATCHES,
  ...CATEGORY_03B_NETWORK_WEB_EDGE_PATCHES,
  ...CATEGORY_03C_NETWORK_WEB_DFIR_PATCHES,
  ...CLOUD_SAAS_STANDARD_PATCHES,
  ...SUPPLY_CHAIN_CICD_STANDARD_PATCHES,
  ...ZERO_DAY_APPLIANCES_STANDARD_PATCHES,
  ...KERNEL_FIRMWARE_BYOVD_STANDARD_PATCHES,
  ...RANSOMWARE_EXTORTION_STANDARD_PATCHES,
  ...CONTAINERS_KUBERNETES_STANDARD_PATCHES,
  ...ICS_OT_SCADA_PATCHES,
  ...MOBILE_TELECOM_SPYWARE_PATCHES,
  ...DATABASE_DATA_PLATFORMS_PATCHES,
  ...AI_LLM_MLOPS_SECURITY_PATCHES,
};
