/**
 * ============================================================================
 * PERMANENT UI DESIGN STANDARD: ZERO-TRUNCATION & CONCISE LABEL + TOOLTIP RULE
 * ============================================================================
 *
 * Architectural Rule (Mandatory Across All Workbench Components):
 * 1. NEVER display cut-off text with `...` (`text-overflow: ellipsis` / `truncate`)
 *    on cards, stage pills, toolbar buttons, sidebar items, or diagram nodes.
 * 2. Every interactive control, pill, or card header MUST either:
 *    (a) Display a concise, complete short label on the element itself and expose
 *        the full extended description, parameters, and metadata inside a styled
 *        hover tooltip (`WorkbenchIconTooltip` / `NodeHoverTooltip`), OR
 *    (b) Wrap naturally across clean lines (`leading-snug break-words`) so 100% of
 *        the text is legible without clipping.
 * 3. Icon-only navigation/action buttons must always be wrapped in
 *    `WorkbenchIconTooltip` with a clear `label`, `badge` (hotkey/code), and `detail`.
 */

import { AttackStage } from './attack-scenarios';

export interface ConciseUiLabelWithTooltip {
  shortLabel: string;
  badge: string;
  tooltipTitle: string;
  tooltipDetail: string;
}

const CONCISE_STAGE_TITLES_BY_KEYWORD: Array<{
  match: RegExp;
  shortTitle: string;
}> = [
  {
    match: /CREATE SUSPENDED TARGET PROCESS/i,
    shortTitle: 'Create Suspended Process',
  },
  {
    match: /UNMAP LEGITIMATE MEMORY IMAGE/i,
    shortTitle: 'Unmap Memory Image',
  },
  {
    match: /ALLOCATE RWX & WRITE MALICIOUS/i,
    shortTitle: 'Allocate RWX & Inject PE',
  },
  {
    match: /PATCH THREAD CONTEXT & RESUME/i,
    shortTitle: 'Patch Thread & Resume',
  },
  {
    match: /OUTBOUND HTTPS C2 BEACON/i,
    shortTitle: 'Outbound C2 Beacon',
  },
  {
    match: /LOCATE AMSISCANBUFFER IN MEMORY/i,
    shortTitle: 'Locate AmsiScanBuffer',
  },
  {
    match: /PATCH 6 BYTES OF AMSISCANBUFFER/i,
    shortTitle: 'Patch AmsiScanBuffer',
  },
  {
    match: /REFLECTIVE DLL LOADING FROM MEMORY/i,
    shortTitle: 'Reflective DLL Load',
  },
  {
    match: /JNDI LOOKUP INJECTION IN HTTP HEADER/i,
    shortTitle: 'JNDI Header Injection',
  },
  {
    match: /MALICIOUS LDAP CLASS DESERIALIZATION/i,
    shortTitle: 'LDAP Class Load',
  },
  {
    match: /REVERSE SHELL & PRIVILEGE ESCALATION/i,
    shortTitle: 'Reverse Shell & PrivEsc',
  },
  {
    match: /ENUMERATE SPN ACCOUNTS VIA LDAP/i,
    shortTitle: 'Enumerate SPN Accounts',
  },
  {
    match: /REQUEST RC4 KERBEROS TGS TICKETS/i,
    shortTitle: 'Request RC4 TGS Ticket',
  },
  {
    match: /OFFLINE TGS HASH CRACKING & DCSYNC/i,
    shortTitle: 'Crack TGS & DCSync',
  },
  {
    match: /CHUNK & ENCODE SENSITIVE PAYLOAD/i,
    shortTitle: 'Chunk & Encode Data',
  },
  {
    match: /HIGH-FREQUENCY TXT SUBDOMAIN QUERIES/i,
    shortTitle: 'DNS TXT Tunnel Exfil',
  },
  {
    match: /INHIBIT SYSTEM RECOVERY & SHADOW COPIES/i,
    shortTitle: 'Wipe Shadow Copies',
  },
  {
    match: /HIGH-SPEED SYMMETRIC FILE ENCRYPTION/i,
    shortTitle: 'Encrypt Host Volumes',
  },
];

/**
 * Produces a concise, complete stage button label (guaranteed free of `...` truncation)
 * along with the full untruncated stage metadata for hover tooltips.
 */
export function formatConciseStagePillLabel(
  stage: Pick<AttackStage, 'index' | 'title' | 'subtitle' | 'mitreTechniqueId'>
): ConciseUiLabelWithTooltip {
  const rawTitle = stage.title.trim();

  for (const rule of CONCISE_STAGE_TITLES_BY_KEYWORD) {
    if (rule.match.test(rawTitle)) {
      return {
        shortLabel: `S${stage.index}: ${rule.shortTitle}`,
        badge: stage.mitreTechniqueId,
        tooltipTitle: `Stage ${stage.index}: ${rawTitle}`,
        tooltipDetail: stage.subtitle,
      };
    }
  }

  // Fallback deterministic shortening without ellipsis: take up to 3 core words (or 2 if needed to stay <= 36 chars)
  const words = rawTitle.split(/\s+/);
  let concise =
    words.length <= 3 ? rawTitle : words.slice(0, 3).join(' ');
  if (`S${stage.index}: ${concise}`.length > 36 && words.length >= 2) {
    concise = words.slice(0, 2).join(' ');
  }
  if (`S${stage.index}: ${concise}`.length > 36) {
    concise = words[0].slice(0, 30);
  }

  return {
    shortLabel: `S${stage.index}: ${concise}`,
    badge: stage.mitreTechniqueId,
    tooltipTitle: `Stage ${stage.index}: ${rawTitle}`,
    tooltipDetail: stage.subtitle,
  };
}

export const ZERO_TRUNCATION_STANDARD = {
  forbidEllipsisOnCardsAndPills: true,
  requireHoverTooltipForExtendedContext: true,
  requireMultiLineWrapForNarrativeCards: true,
} as const;

/**
 * Formats an internal sub-board communication flow pill with a short, complete label
 * for the button and full forward/return packet details for the hover tooltip.
 */
export function formatConciseInternalFlowPill(flow: {
  sequenceCode: string;
  forwardSeq: string;
  returnSeq: string;
  label: string;
  returnLabel: string;
}): ConciseUiLabelWithTooltip & { codeBadge: string; shortRoute: string } {
  const codeBadge = `#${flow.sequenceCode}`;
  const shortRoute = `(${flow.forwardSeq}→ · ⇠${flow.returnSeq})`;
  return {
    shortLabel: `${codeBadge} ${shortRoute}`,
    badge: codeBadge,
    codeBadge,
    shortRoute,
    tooltipTitle: `Internal Link #${flow.sequenceCode} · ${flow.forwardSeq}→ ${flow.label}`,
    tooltipDetail: `${flow.forwardSeq}→ ${flow.label} | ⇠${flow.returnSeq} ${flow.returnLabel}`,
  };
}


