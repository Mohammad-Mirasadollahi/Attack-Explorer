import type { AttackCategory } from './scenarios/types';

const CATEGORY_GROUP_META: Record<string, { label: string; order: number }> = {
  MALWARE: { label: 'Malware & Process Execution', order: 1 },
  LOG_ANALYSIS: { label: 'DFIR & Log Forensics', order: 2 },
  ACTIVE_DIRECTORY: { label: 'Active Directory & Identity', order: 3 },
  NETWORK_WEB: { label: 'Network & C2 Exfiltration', order: 4 },
  CLOUD_SAAS: { label: 'Cloud & SaaS', order: 5 },
  SUPPLY_CHAIN_CICD: { label: 'Supply Chain & CI/CD', order: 6 },
  ZERO_DAY_APPLIANCES: { label: 'Zero-Day Appliances', order: 7 },
  KERNEL_FIRMWARE_BYOVD: { label: 'Kernel, Firmware & BYOVD', order: 8 },
  RANSOMWARE_EXTORTION: { label: 'Ransomware & Extortion', order: 9 },
  ICS_OT_MOBILE: { label: 'ICS, OT & Mobile', order: 10 },
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
