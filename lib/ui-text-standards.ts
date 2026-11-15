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

export interface ConciseUiLabelWithTooltip {
  shortLabel: string;
  badge: string;
  tooltipTitle: string;
  tooltipDetail: string;
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

export interface MergedDiagramNodeBadge {
  seqBadge: string;
  shortTitle: string;
  keyMetric: string;
  combinedSingleLine: string;
}

const CIRCLED_NODE_NUMBERS = [
  '①',
  '②',
  '③',
  '④',
  '⑤',
  '⑥',
  '⑦',
  '⑧',
  '⑨',
  '⑩',
];

function extractConciseAnalyticalTitle(rawLabel: string): string {
  let t = (rawLabel || '')
    .replace(/\.{2,}/g, '')
    .trim()
    .replace(/^Attacker Phishing & C2 Server$/i, 'External C2 Server')
    .replace(/^Attacker Exploit & Scanner$/i, 'Attacker Scanner')
    .replace(/^Attacker Authoritative DNS C2$/i, 'Authoritative DNS C2')
    .replace(/^HTTPS Payload Stager & C2$/i, 'HTTPS Payload Stager')
    .replace(/^Breached Admin RDP Jump-Host$/i, 'Breached RDP Jump-Host')
    .replace(/^Edge Firewall & Mail GW$/i, 'Edge Firewall & GW')
    .replace(/^DMZ WAF & Reverse Proxy$/i, 'DMZ WAF & Proxy')
    .replace(/^Perimeter Firewall & NDR Tap$/i, 'Perimeter FW & NDR')
    .replace(/^DMZ Reverse Proxy & SPAN Tap$/i, 'DMZ Proxy & SPAN')
    .replace(/^Core Identity & VLAN Switch$/i, 'Core VLAN Switch')
    .replace(/^DC Core Switch & RPC Fabric$/i, 'DC Core Switch')
    .replace(/^Cloud WAF & AWS ALB Ingress$/i, 'Cloud WAF & ALB')
    .replace(/^Corp DC01 & Internal Shares$/i, 'Corp DC01')
    .replace(/^SOC SIEM & Sysmon EDR Sensor$/i, 'SOC SIEM & EDR')
    .replace(/^Java Log4j2 → \/bin\/bash Shell$/i, 'Log4j2 → /bin/bash')
    .replace(/^Rubeus\.exe & Hashcat \/ PtH$/i, 'Rubeus.exe & PtH')
    .replace(/^Egress Firewall \(Direct Web Blocked\)$/i, 'Strict Egress FW')
    .replace(/^Linux Auditd & Elastic SIEM$/i, 'Auditd & SIEM')
    .replace(/^Zeek DNS NDR & Sysmon EID 22$/i, 'Zeek NDR & SIEM')
    .replace(/^PowerShell EID 4104 & EDR Scanner$/i, 'EDR & SIEM Scanner')
    .replace(/^EDR Canary Guard & SOC SIEM$/i, 'EDR & SOC SIEM');

  // Keep short host identifiers like (WKS-04), (DC01), (SRV-01), strip verbose parentheticals
  t = t
    .replace(/\s*\(([^)]+)\)/g, (_m, inner: string) => {
      if (
        /^(?:WKS|DEV|WS|DB|FILE|DC|app-prod|eks-prod)[\w-]*$/i.test(inner) &&
        inner.length <= 12
      ) {
        return ` (${inner})`;
      }
      if (/^CORP-DC01$/i.test(inner)) return ' (DC01)';
      return '';
    })
    .trim();

  if (t.length > 25 && t.includes(' & ')) {
    const left = t.split(' & ')[0].trim();
    if (left.length >= 6) t = left;
  }
  if (t.length > 25 && t.includes(' / ')) {
    const left = t.split(' / ')[0].trim();
    if (left.length >= 6) t = left;
  }
  if (t.length > 28 && t.includes('→')) {
    t = t
      .replace(/\s*\([^)]+\)/g, '')
      .replace(/\.exe\b/gi, '')
      .replace(/lsass\/svchost/gi, 'lsass')
      .trim();
    if (t.length > 28) {
      const arrowParts = t.split('→').map((p) => p.trim());
      t = `${arrowParts[0].split(/\s+/)[0].slice(0, 14)} → ${arrowParts[arrowParts.length - 1].split(/\s+/)[0].slice(0, 11)}`;
    }
  }
  if (t.length > 26 && !t.includes('→')) {
    const words = t.split(/\s+/);
    t = words.slice(0, 3).join(' ');
    if (t.length > 28) {
      t = words.slice(0, 2).join(' ').slice(0, 28);
    }
  }
  return t || 'Node';
}

function extractConciseAnalyticalMetric(
  rawSublabel: string,
  shortTitle: string
): string {
  const raw = (rawSublabel || '').replace(/\.{2,}/g, '').trim();
  if (!raw) return 'Active';

  const segments = raw
    .split('·')
    .map((s) => s.replace(/\s*\(On [^)]+\)+/gi, '').trim())
    .filter(Boolean);

  let chosen = segments[0] || raw;
  if (chosen === '10.10.99.10' && segments[1]) {
    chosen = segments[1].replace(/\s*Detection Rules$/i, '').trim();
  }

  // 1. PID transition or PID (e.g. 'PID 3104 → 4892' or 'PID 4892')
  const pidMatch = chosen.match(/PID\s*\d+(?:\s*(?:→|->)\s*\d+)?/i);
  if (pidMatch) return pidMatch[0].replace('->', '→');

  // 2. IPv4 + optional port/cidr (e.g. '185.220.101.42:443' or '10.10.4.15')
  const ipMatch = chosen.match(/\b\d{1,3}(?:\.\d{1,3}){3}(?::\d+|\/\d+)?\b/);
  if (ipMatch) return ipMatch[0];

  // 3. Memory hex address (e.g. '0x024A80000')
  const hexMatch = chosen.match(/0x[0-9a-fA-F]{4,16}/);
  if (hexMatch) return hexMatch[0];

  // 4. Event IDs / Sysmon EIDs (e.g. 'Sysmon EID 1/10/25' or 'EID 4769/4624')
  const eidMatch = raw.match(
    /(?:Sysmon\s+)?EID\s*\d+(?:\s*[/,&]\s*(?:EID\s*)?\d+)*/i
  );
  if (eidMatch) {
    return eidMatch[0].replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ');
  }

  // 5. CVE or MITRE Technique ID
  const cveOrMitre = raw.match(
    /\b(?:CVE-\d{4}-\d{4,7}|T\d{4}(?:\.\d{3})?)\b/i
  );
  if (cveOrMitre) return cveOrMitre[0].toUpperCase();

  chosen = chosen
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*(?:→|->)\s*.*$/, '')
    .replace(/\s*\+\s*.*$/, '')
    .trim();

  if (chosen.length > 24 && (chosen.includes('/') || chosen.includes('\\'))) {
    const sep = chosen.includes('\\') ? '\\' : '/';
    const parts = chosen.split(/[\\/]/).filter(Boolean);
    if (parts.length >= 2) {
      const lastTwo = `${sep}${parts.slice(-2).join(sep)}`;
      chosen = lastTwo.length <= 24 ? lastTwo : `${sep}${parts[parts.length - 1]}`;
    }
  }

  if (chosen.length > 24) {
    const words = chosen.split(/\s+/);
    chosen =
      words.length > 1
        ? words.slice(0, 3).join(' ').slice(0, 26)
        : chosen.slice(0, 24);
  }

  if (
    !chosen ||
    chosen.toLowerCase() === shortTitle.toLowerCase()
  ) {
    return segments[1]
      ? segments[1].replace(/\s*\([^)]*\)/g, '').split(/\s+/).slice(0, 3).join(' ').slice(0, 24)
      : 'Active';
  }

  return chosen;
}

/**
 * Merges the colored top node badge and bottom white node card into a single
 * high-signal colored badge containing only the essential analytical identity
 * and primary technical indicator (IP / Port / PID / Memory / EID / CVE).
 * Full extended metadata remains accessible in the Inspector Panel and Hover Tooltip.
 */
export function formatMergedDiagramNodeBadge(
  node: {
    chainOrder: number;
    sequenceCode?: string;
    label: string;
    sublabel: string;
    actionBadge: string;
  },
  isSubBoard = false
): MergedDiagramNodeBadge {
  const isHierarchical =
    isSubBoard || Boolean(node.sequenceCode && node.sequenceCode.includes('.'));
  const seqBadge = isHierarchical
    ? `#${node.sequenceCode || node.chainOrder}`
    : CIRCLED_NODE_NUMBERS[(node.chainOrder || 1) - 1] ||
      `#${node.sequenceCode || node.chainOrder}`;

  const shortTitle = extractConciseAnalyticalTitle(node.label);
  const keyMetric = extractConciseAnalyticalMetric(node.sublabel, shortTitle);

  return {
    seqBadge,
    shortTitle,
    keyMetric,
    combinedSingleLine: `${seqBadge} ${shortTitle} · ${keyMetric}`,
  };
}



