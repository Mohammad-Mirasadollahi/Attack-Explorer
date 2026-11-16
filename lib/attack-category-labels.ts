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
  ICS_OT_MOBILE: { label: 'ICS, OT & Mobile', order: 9 },
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
