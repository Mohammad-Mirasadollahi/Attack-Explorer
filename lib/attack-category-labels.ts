import type { AttackCategory } from './scenarios/types';

const CATEGORY_GROUP_META: Record<string, { label: string; order: number }> = {
  MALWARE: { label: 'Malware & Process Execution', order: 1 },
  ACTIVE_DIRECTORY: { label: 'Active Directory & Identity', order: 2 },
  NETWORK_WEB: { label: 'Network & C2 Exfiltration', order: 3 },
  CLOUD_SAAS: { label: 'Cloud & SaaS', order: 4 },
  SUPPLY_CHAIN_CICD: { label: 'Supply Chain & CI/CD', order: 5 },
  ZERO_DAY_APPLIANCES: { label: 'Zero-Day Appliances', order: 6 },
  KERNEL_FIRMWARE_BYOVD: { label: 'Kernel, Firmware & BYOVD', order: 7 },
  RANSOMWARE_EXTORTION: { label: 'Ransomware & Extortion', order: 8 },
  CONTAINERS_KUBERNETES: { label: 'Containers, Kubernetes & Mesh', order: 9 },
  ICS_OT_SCADA: { label: 'ICS, OT & Industrial SCADA', order: 10 },
  MOBILE_TELECOM_SPYWARE: { label: 'Mobile Spyware & Telecom (5G/SS7)', order: 11 },
  DATABASE_DATA_PLATFORMS: { label: 'Database Engines & Data Platforms', order: 12 },
  AI_LLM_MLOPS_SECURITY: { label: 'AI, LLM Agents & MLOps Security', order: 13 },
  ICS_OT_MOBILE: { label: 'ICS, OT & Mobile', order: 14 },
};

/** Display label for AttackCategory — never show raw underscores in UI. */
export function formatAttackCategoryLabel(
  category: AttackCategory | string
): string {
  return (
    CATEGORY_GROUP_META[category]?.label ||
    category.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
  );
}

export function getAttackCategoryGroupMeta(category: string): {
  label: string;
  order: number;
} {
  return (
    CATEGORY_GROUP_META[category] || {
      label: formatAttackCategoryLabel(category),
      order: 99,
    }
  );
}
