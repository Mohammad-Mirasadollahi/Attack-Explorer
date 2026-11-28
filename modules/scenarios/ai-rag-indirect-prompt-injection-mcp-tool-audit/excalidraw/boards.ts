import type { Section3DKey } from '@/lib/section-3d-registry';
import type {
  TechnicalBoardDescriptor,
  TechnicalBoardSkeleton,
} from '@/lib/section-excalidraw-registry';
import {
  ARROW_GAP,
  box,
  hArrow,
  hArrowLeft,
  note,
  sticky,
  title,
  vArrow,
} from '@/modules/scenarios/dfir-lsass-minidump-comsvcs-sysmon-eid10/excalidraw/helpers';

const PAL = {
  amber: '#d97706',
  amberFill: '#fef3c7',
  crimson: '#e11d48',
  crimsonFill: '#ffe4e6',
  sky: '#0284c7',
  skyFill: '#e0f2fe',
  emerald: '#059669',
  emeraldFill: '#d1fae5',
  muted: '#64748b',
} as const;

function makeOrthogonalBoard(cfg: {
  sectionKey: Section3DKey;
  boardBadge: string;
  title: string;
  subtitle: string;
  chalkHint: string;
  header: string;
  footer: string;
  p: string;
  r1: [
    { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] },
    { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] },
    { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] },
  ];
  a12: { cap: string; stroke: string };
  a23: { cap: string; stroke: string };
  a34: { cap: string; stroke: string };
  a45: { cap: string; stroke: string };
  r2Right: { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] };
  r2Mid: { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] };
  stickyBox: { id: string; label: string; tip: TechnicalBoardDescriptor['tooltips'][string] };
}): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;
  const b1 = { x: 40, w: 242 };
  const b2 = { x: b1.x + b1.w + ARROW_GAP, w: 256 };
  const b3 = { x: b2.x + b2.w + ARROW_GAP, w: 252 };

  const tooltips: TechnicalBoardDescriptor['tooltips'] = {
    [cfg.r1[0].id]: cfg.r1[0].tip,
    [cfg.r1[1].id]: cfg.r1[1].tip,
    [cfg.r1[2].id]: cfg.r1[2].tip,
    [cfg.r2Right.id]: cfg.r2Right.tip,
    [cfg.r2Mid.id]: cfg.r2Mid.tip,
    [cfg.stickyBox.id]: cfg.stickyBox.tip,
  };

  const skeletons: TechnicalBoardSkeleton[] = [
    title(40, 12, cfg.header),
    box({ id: cfg.r1[0].id, x: b1.x, y: y1, w: b1.w, h: h1, label: cfg.r1[0].label, stroke: cfg.r1[0].stroke, fill: cfg.r1[0].fill }),
    ...hArrow({ id: `${cfg.p}-a1`, fromId: cfg.r1[0].id, toId: cfg.r1[1].id, fromRight: b1.x + b1.w, toLeft: b2.x, midY: y1 + h1 / 2, caption: cfg.a12.cap, stroke: cfg.a12.stroke }),
    box({ id: cfg.r1[1].id, x: b2.x, y: y1, w: b2.w, h: h1, label: cfg.r1[1].label, stroke: cfg.r1[1].stroke, fill: cfg.r1[1].fill }),
    ...hArrow({ id: `${cfg.p}-a2`, fromId: cfg.r1[1].id, toId: cfg.r1[2].id, fromRight: b2.x + b2.w, toLeft: b3.x, midY: y1 + h1 / 2, caption: cfg.a23.cap, stroke: cfg.a23.stroke }),
    box({ id: cfg.r1[2].id, x: b3.x, y: y1, w: b3.w, h: h1, label: cfg.r1[2].label, stroke: cfg.r1[2].stroke, fill: cfg.r1[2].fill }),
    ...vArrow({ id: `${cfg.p}-a3`, fromId: cfg.r1[2].id, toId: cfg.r2Right.id, midX: b3.x + b3.w / 2, fromBottom: y1 + h1, toTop: y2, caption: cfg.a34.cap, stroke: cfg.a34.stroke, captionOffsetX: 16 }),
    sticky({ id: cfg.stickyBox.id, x: 40, y: y2, w: 350, h: h2, label: cfg.stickyBox.label }),
    box({ id: cfg.r2Mid.id, x: b2.x, y: y2, w: b2.w, h: h2, label: cfg.r2Mid.label, stroke: cfg.r2Mid.stroke, fill: cfg.r2Mid.fill }),
    ...hArrowLeft({ id: `${cfg.p}-a4`, fromId: cfg.r2Right.id, toId: cfg.r2Mid.id, fromLeft: b3.x, toRight: b2.x + b2.w, midY: y2 + h2 / 2, caption: cfg.a45.cap, stroke: cfg.a45.stroke }),
    box({ id: cfg.r2Right.id, x: b3.x, y: y2, w: b3.w, h: h2, label: cfg.r2Right.label, stroke: cfg.r2Right.stroke, fill: cfg.r2Right.fill }),
    note(40, 464, cfg.footer, PAL.muted),
  ];

  return {
    scenarioId: 'ai-rag-indirect-prompt-injection-mcp-tool-audit',
    sectionKey: cfg.sectionKey,
    boardBadge: cfg.boardBadge,
    title: cfg.title,
    subtitle: cfg.subtitle,
    chalkHint: cfg.chalkHint,
    tooltips,
    skeletons,
  };
}

export const RAGMCP_TECHNICAL_BOARDS: Partial<Record<Section3DKey, TechnicalBoardDescriptor>> = {
  briefing: makeOrthogonalBoard({
    sectionKey: 'briefing',
    boardBadge: 'WHITEBOARD #0 · END-TO-END RAG PROMPT INJECTION & MCP AUDIT',
    title: 'LLM01/LLM06: Poisoned PDF -> Flat Context -> MCP Exfil -> Taint Policy Gate',
    subtitle: 'Full indirect prompt injection architecture from RAG ingestion to fail-closed containment',
    chalkHint: 'Hover any chalk box for OWASP LLM01/LLM06 controls, MCP tool chaining, and ATLAS alerts.',
    header: 'ENTERPRISE RAG INDIRECT PROMPT INJECTION & MCP EXFILTRATION (ATLAS AML.T0051)',
    footer: 'Primary Sources: OWASP LLM Top 10 2025 (LLM01/LLM06), NIST AI 100-2 & MITRE ATLAS',
    p: 'rgb',
    r1: [
      { id: 'rgb-pdf', label: 'Poisoned PDF\nq2-pricing.pdf\nWhite-Ink chk_9042', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'RAG Ingestion Poison', module: 'rag-indexer-01', fields: [{ key: 'Hidden', value: '18% zero-contrast text' }], explain: 'Invisible override directives indexed into vector store collection vendor_docs.' } },
      { id: 'rgb-ctx', label: 'Flat LLM Context\nai-agent-gw-02\nZero Data Isolation', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'Instruction Hijack', module: 'Cosine 0.91 Hit', fields: [{ key: 'Flaw', value: 'Flat concatenation' }], explain: 'Model treats retrieved external text with same authority as system rules.' } },
      { id: 'rgb-mcp', label: 'MCP Tool Chain\nread_secret_kb ->\nhttp_webhook_send', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Excessive Agency', module: 'service_admin_all', fields: [{ key: 'Exfil', value: '15.1 KB Board M&A' }], explain: 'Shared admin MCP token bypasses user RBAC and exfiltrates silently.' } },
    ],
    a12: { cap: 'Top-K Retrieval', stroke: PAL.amber },
    a23: { cap: 'Hijacked Plan', stroke: PAL.crimson },
    a34: { cap: 'Taint & OAuth Gate', stroke: PAL.emerald },
    a45: { cap: 'ATLAS SIEM Alert', stroke: PAL.sky },
    r2Right: { id: 'rgb-gt', label: 'MCP Policy Gate\nUntrusted Taint +\nPer-User OAuth', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Fail-Closed Guard', module: 'ai-policy-gw-01', fields: [{ key: 'Decision', value: 'DENY Tainted Tool' }], explain: 'Blocks tainted context from invoking egress tools and enforces user RBAC.' } },
    r2Mid: { id: 'rgb-sm', label: 'SOC SIEM Alert\nATLAS AML.T0051 +\nQuarantine chk_9042', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Chunk Attribution', module: 'AIPolicyGatewayLogs', fields: [{ key: 'Action', value: 'Purge vendor PDF' }], explain: 'Pinpoints exact poisoned vector chunk ID for instant RAG index cleanup.' } },
    stickyBox: { id: 'rgb-note', label: 'ARCHITECTURAL RULE:\nPrompt wording alone CANNOT\nstop indirect injection! Pair\nprovenance tainting with\nper-user MCP OAuth & HITL.', tip: { kind: 'note', title: 'Deterministic Guard', module: 'AI Security', fields: [{ key: 'Controls', value: 'Taint + OAuth + HITL' }], explain: 'Policy gates enforce security even when the LLM itself is tricked.' } },
  }),

  'step-1': makeOrthogonalBoard({
    sectionKey: 'step-1',
    boardBadge: 'WHITEBOARD #1 · POISONED PDF INGESTION INTO RAG VECTOR STORE',
    title: 'OWASP LLM01: Invisible White-Ink Override Embedded as Vector Chunk chk_9042',
    subtitle: 'How automated PDF parsers index concealed commands without provenance tagging',
    chalkHint: 'Hover boxes for hidden_text_ratio telemetry, vector storage, and ingestion Sigma rules.',
    header: 'STEP 1 · EXTERNAL PDF INDIRECT PROMPT POISONING IN RAG PIPELINE',
    footer: 'Reference: OWASP LLM01 Prompt Injection & MITRE ATLAS AML.T0051',
    p: 'rg1',
    r1: [
      { id: 'rg1-doc', label: 'q2-pricing.pdf\nVisible Pricing +\nWhite-Ink Override', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'Weaponized Brochure', module: 'External Vendor', fields: [{ key: 'Ratio', value: '18% Hidden Layer' }], explain: 'Concealed directives survive visual inspection by human reviewers.' } },
      { id: 'rg1-idx', label: 'rag-indexer-01\nExtracts All Layers\nNo Taint Metadata', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'Blind Parser', module: 'PDF Text Extractor', fields: [{ key: 'Flaw', value: 'Zero provenance tag' }], explain: 'Extracts zero-opacity text identically to normal visible paragraphs.' } },
      { id: 'rg1-vec', label: 'Vector DB Collection\nvendor_docs\nChunk chk_9042', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Dormant Poison', module: 'Vector Embeddings', fields: [{ key: 'Trigger', value: 'Pricing query match' }], explain: 'Waits silently until an authorized employee queries supplier pricing.' } },
    ],
    a12: { cap: 'Parse PDF', stroke: PAL.amber },
    a23: { cap: 'Embed chk_9042', stroke: PAL.crimson },
    a34: { cap: 'Ingest Audit', stroke: PAL.sky },
    a45: { cap: 'Tag & Strip', stroke: PAL.emerald },
    r2Right: { id: 'rg1-sg', label: 'RAG Ingest Sigma\nhidden_text_ratio >= 0.1\nOverride Regex Hit', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Pre-Index Alert', module: 'RAG-INGEST-104', fields: [{ key: 'Match', value: 'IGNORE PREVIOUS...' }], explain: 'Flags hidden layers and command verbs prior to vector indexing.' } },
    r2Mid: { id: 'rg1-pr', label: 'Sanitized Ingest\nStrip Hidden Ink +\nuntrusted_external Tag', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Provenance Tagging', module: 'Data Hygiene', fields: [{ key: 'Tag', value: 'Immutable Metadata' }], explain: 'Ensures downstream policy gates always know data originated externally.' } },
    stickyBox: { id: 'rg1-note', label: 'INDIRECT VECTOR:\nThe attacker never needs an\naccount or chat session; any\ningested email, ticket, or PDF\ncan poison the RAG index!', tip: { kind: 'note', title: 'Attack Surface', module: 'Enterprise RAG', fields: [{ key: 'Rule', value: 'Treat external docs untrusted' }], explain: 'Ingest provenance metadata must survive chunking and retrieval.' } },
  }),

  'step-2': makeOrthogonalBoard({
    sectionKey: 'step-2',
    boardBadge: 'WHITEBOARD #2 · TOP-K RETRIEVAL INTO FLAT LLM CONTEXT',
    title: 'T1059: Benign Summary Query Pulls chk_9042 & Hijacks Tool Planning',
    subtitle: 'Why flat prompt concatenation blurs trusted system rules and untrusted external data',
    chalkHint: 'Hover boxes for cosine similarity hit, flat context vulnerability, and KQL correlation.',
    header: 'STEP 2 · SEMANTIC RETRIEVAL HIJACK IN UNPARTITIONED LLM CONTEXT',
    footer: 'Reference: NIST AI 100-2 Adversarial Machine Learning & LLM Orchestrator Telemetry',
    p: 'rg2',
    r1: [
      { id: 'rg2-us', label: 'analyst@corp.local\n"Summarize Q2\nsupplier pricing"', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'api', title: 'Benign Employee Ask', module: 'Read-Only User', fields: [{ key: 'Intent', value: 'Pricing summary only' }], explain: 'User has zero intent or RBAC authority to read board merger files.' } },
      { id: 'rg2-rk', label: 'Top-K Vector Hit\nchk_9042 (0.91)\nFlat Concatenation', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Context Pollution', module: 'ai-agent-gw-02', fields: [{ key: 'Flaw', value: 'Single flat token stream' }], explain: 'Merges system prompt and poisoned external text with identical priority.' } },
      { id: 'rg2-pl', label: 'Hijacked Model Plan\n1. read_secret_kb\n2. http_webhook_send', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'Autonomous Pivot', module: 'JSON-RPC Plan', fields: [{ key: 'Target', value: 'board_mna_2025' }], explain: 'LLM obeys concealed footnote and schedules secret read + webhook POST.' } },
    ],
    a12: { cap: 'Cosine 0.91', stroke: PAL.amber },
    a23: { cap: 'Hijack Plan', stroke: PAL.crimson },
    a34: { cap: 'Orchestrator Log', stroke: PAL.sky },
    a45: { cap: 'Isolate Channels', stroke: PAL.emerald },
    r2Right: { id: 'rg2-kq', label: 'Orchestrator KQL\nExternal Chunk +\nEgress Tool Planned', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Plan Anomaly', module: 'LLM-CTX-209', fields: [{ key: 'Signal', value: 'Tainted tool request' }], explain: 'Correlates external RAG retrieval with sudden high-risk tool planning.' } },
    r2Mid: { id: 'rg2-dl', label: 'Dual-Channel Buffer\nStrict Data Delimiter\n+ Propagate Taint', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Context Isolation', module: 'Taint Propagation', fields: [{ key: 'Effect', value: 'Marks Session Tainted' }], explain: 'Carries untrusted_external taint bit forward to the MCP policy gateway.' } },
    stickyBox: { id: 'rg2-note', label: 'NO HARDWARE RING:\nLLMs have no CPU ring separating\ncode from data; any untrusted\nchunk entering the prompt can\ninfluence next-token tool calls.', tip: { kind: 'note', title: 'Core LLM Property', module: 'Token Attention', fields: [{ key: 'Defense', value: 'External Policy Gate' }], explain: 'Always enforce privilege boundaries outside the LLM in deterministic code.' } },
  }),

  'step-3': makeOrthogonalBoard({
    sectionKey: 'step-3',
    boardBadge: 'WHITEBOARD #3 · EXCESSIVE MCP AGENCY & WEBHOOK EXFIL',
    title: 'OWASP LLM06: Shared service_admin_all Token Chains Secret Read Into External POST',
    subtitle: 'How unapproved side-effecting MCP tools turn prompt injection into silent data theft',
    chalkHint: 'Hover boxes for shared admin credential flaw, 15.1 KB exfil, and Sigma MCP audit.',
    header: 'STEP 3 · EXCESSIVE MCP AGENCY (READ_SECRET_KB -> HTTP_WEBHOOK_SEND)',
    footer: 'Reference: OWASP LLM06 Excessive Agency & MITRE ATT&CK T1041',
    p: 'rg3',
    r1: [
      { id: 'rg3-rd', label: 'MCP Tool Call #1\nread_secret_kb\nservice_admin_all', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'Confused Deputy Read', module: 'mcp-server-enterprise', fields: [{ key: 'Doc', value: 'board_mna_2025 (14.8KB)' }], explain: 'Shared admin token bypasses analyst@corp.local read-only permissions.' } },
      { id: 'rg3-wh', label: 'MCP Tool Call #2\nhttp_webhook_send\nhuman_approval=NONE', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Unapproved Egress', module: 'MCP JSON-RPC', fields: [{ key: 'Dest', value: 'drop.collector-example.net' }], explain: 'Fires confidential merger records out over HTTPS with zero confirmation.' } },
      { id: 'rg3-ex', label: 'Attacker Collector\nHTTP 200 OK · 15.1 KB\nSilent Exfiltration', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Data Loss Complete', module: 'External Webhook', fields: [{ key: 'Latency', value: '1.4 Seconds Total' }], explain: 'User only sees a polite Q2 pricing summary while secrets leave the org.' } },
    ],
    a12: { cap: '14.8 KB M&A', stroke: PAL.amber },
    a23: { cap: 'HTTPS POST', stroke: PAL.crimson },
    a34: { cap: 'MCP Tool Audit', stroke: PAL.sky },
    a45: { cap: 'Per-User OAuth', stroke: PAL.emerald },
    r2Right: { id: 'rg3-sg', label: 'MCP Audit Sigma\nhttp_webhook_send &\nhuman_approval=NONE', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Tool Audit Alert', module: 'mcp_tool_audit', fields: [{ key: 'Signal', value: 'Unapproved egress tool' }], explain: 'Catches autonomous external webhook exfiltration from AI tool servers.' } },
    r2Mid: { id: 'rg3-oa', label: 'Scoped MCP Auth\nPer-User OAuth +\nEgress Allowlist', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Least-Privilege MCP', module: 'OAuth Delegation', fields: [{ key: 'Effect', value: 'Analyst Cannot Read M&A' }], explain: 'Ensures an agent never holds broader rights than the signed-in user.' } },
    stickyBox: { id: 'rg3-note', label: 'CONFUSED DEPUTY:\nNever give an MCP server a\nshared service_admin_all key!\nAlways pass down the signed-in\nuser exact OAuth token.', tip: { kind: 'note', title: 'OWASP LLM06', module: 'MCP Identity', fields: [{ key: 'Fix', value: 'User-Delegated OAuth' }], explain: 'Prevents low-privilege sessions from reading executive-only stores.' } },
  }),

  'step-4': makeOrthogonalBoard({
    sectionKey: 'step-4',
    boardBadge: 'WHITEBOARD #4 · TAINT GUARD, PER-USER OAUTH & POLICY DENIAL',
    title: 'ATLAS AML.T0051: Fail-Closed MCP Policy Gate Stops Exfil & Names chk_9042',
    subtitle: 'Deterministic provenance tainting, HITL approval, and automated RAG chunk quarantine',
    chalkHint: 'Hover boxes for taint policy denial, OAuth scoping, and SIEM KQL quarantine flow.',
    header: 'STEP 4 · DUAL-CHANNEL TAINT POLICY GATE & SIEM QUARANTINE',
    footer: 'Reference: NIST AI RMF, OWASP LLM Defense & MITRE ATLAS AML.T0051',
    p: 'rg4',
    r1: [
      { id: 'rg4-tc', label: 'Tainted Session\nTag: untrusted_external\nSource: chk_9042', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Propagated Taint', module: 'ai-policy-gw-01', fields: [{ key: 'Flag', value: 'Immutable Provenance' }], explain: 'Gateway knows external vendor content influenced the current LLM turn.' } },
      { id: 'rg4-dn', label: 'MCP Policy Gate\nDENY Tainted Egress +\nOAuth Denies M&A', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Fail-Closed Block', module: 'mcp-policy-enforcer', fields: [{ key: 'Code', value: 'TAINTED_CONTEXT_TOOL_ESCALATION' }], explain: 'Blocks both unauthorized KB read and unapproved external webhook call.' } },
      { id: 'rg4-ok', label: 'Zero Exfiltration\nSafe Pricing Summary\nHITL Required', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Contained Output', module: 'Hardened Assistant', fields: [{ key: 'Egress', value: '0 Bytes Leaked' }], explain: 'User gets their safe summary while secrets stay locked inside the org.' } },
    ],
    a12: { cap: 'Evaluate Policy', stroke: PAL.amber },
    a23: { cap: 'DENY Fail-Closed', stroke: PAL.emerald },
    a34: { cap: 'ATLAS SIEM Log', stroke: PAL.sky },
    a45: { cap: 'Purge chk_9042', stroke: PAL.emerald },
    r2Right: { id: 'rg4-kq', label: 'SIEM KQL Alert\nPolicyDecision==DENY\nAML.T0051 + chk_9042', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Actionable Incident', module: 'AIPolicyGatewayLogs', fields: [{ key: 'Chunk', value: 'chk_9042' }], explain: 'Provides exact poisoned document ID so SOC can purge it immediately.' } },
    r2Mid: { id: 'rg4-qr', label: 'RAG Quarantine\nDelete chk_9042 +\nBlock Vendor PDF', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Index Remediation', module: 'Vector Governance', fields: [{ key: 'Result', value: 'Poison Eradicated' }], explain: 'Removes hidden injection payload from enterprise search across all users.' } },
    stickyBox: { id: 'rg4-note', label: 'THREE-LOCK DEFENSE:\n1. Provenance taint tracking\n2. Per-user OAuth MCP RBAC\n3. HITL + egress allowlist\nTogether stop indirect exfil!', tip: { kind: 'note', title: 'Defense in Depth', module: 'AI Gateway', fields: [{ key: 'Posture', value: 'Fail-Closed' }], explain: 'Deterministic code gates hold even when novel jailbreaks fool the LLM.' } },
  }),

  'memory-forensics': makeOrthogonalBoard({
    sectionKey: 'memory-forensics',
    boardBadge: 'WHITEBOARD #M · CONTEXT BUFFER DIFF (FLAT VS DUAL-CHANNEL TAINT)',
    title: 'Forensic Comparison: Flat LLM Context Buffer vs Provenance-Isolated Channels',
    subtitle: 'Memory layout inside ai-agent-gw-02 contrasting unpartitioned concatenation against taint tags',
    chalkHint: 'Hover boxes for flat token buffer, MCP dispatch heap, and dual-channel policy state.',
    header: 'CONTEXT MEMORY FORENSICS · FLAT CONCATENATION VS DUAL-CHANNEL TAINT',
    footer: 'Forensic Artifact Reference: ai-agent-gw-02 PID 3108 & MCP Policy Enforcer',
    p: 'rgm',
    r1: [
      { id: 'rgm-fl', label: 'Flat Context Buffer\n0x7F2108100000\nSystem + chk_9042', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Merged Token Stream', module: 'PID 3108 Heap', fields: [{ key: 'Payload', value: 'IGNORE PREVIOUS...' }], explain: 'External PDF override shares the exact same buffer as system rules.' } },
      { id: 'rgm-mc', label: 'MCP JSON-RPC Heap\n0x7F2108140000\nUnapproved Webhook', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Queued Exfil Call', module: 'service_admin_all', fields: [{ key: 'Size', value: '15.1 KB M&A' }], explain: 'Sensitive board document staged for immediate outbound webhook POST.' } },
      { id: 'rgm-tn', label: 'Dual-Channel Taint\n0x7F2108180000\nDENY Fail-Closed', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'memory', title: 'Isolated Provenance', module: 'ai-policy-gw-01', fields: [{ key: 'Status', value: 'Taint Enforced' }], explain: 'Immutable untrusted_external bit blocks privileged MCP tool dispatch.' } },
    ],
    a12: { cap: 'Plan Exfil', stroke: PAL.crimson },
    a23: { cap: 'Enforce Taint', stroke: PAL.emerald },
    a34: { cap: 'Log AML.T0051', stroke: PAL.sky },
    a45: { cap: 'Purge Chunk', stroke: PAL.emerald },
    r2Right: { id: 'rgm-au', label: 'AI Forensic Audit\nCapture Prompt +\nRetrieved Chunk IDs', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Traceability', module: 'LLM Telemetry', fields: [{ key: 'Key', value: 'Session -> chk_9042' }], explain: 'Lets responders trace hijacked tool calls straight back to the source PDF.' } },
    r2Mid: { id: 'rgm-ok', label: 'Zero-Trust AI Stack\nTaint + User OAuth +\nEgress Allowlist', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Resilient Agent', module: 'Production Standard', fields: [{ key: 'Result', value: 'Zero Secret Leakage' }], explain: 'Eliminates confused-deputy exfiltration across enterprise RAG/MCP fleets.' } },
    stickyBox: { id: 'rgm-note', label: 'CONTEXT DIFF INSIGHT:\nFlat string concatenation turns\nevery RAG document into code;\ndual-channel provenance keeps\nexternal text strictly as data.', tip: { kind: 'note', title: 'Isolation Model', module: 'AI Architecture', fields: [{ key: 'Rule', value: 'Data != Instructions' }], explain: 'Foundational design pattern for safe enterprise LLM tool integration.' } },
  }),
};
