import type {
  Section3DDescriptor,
  Section3DKey,
} from './section-3d-registry';

const SCENARIO_ID = 'ai-rag-indirect-prompt-injection-mcp-tool-audit';

export const RAGMCP_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: SCENARIO_ID,
    sectionKey: 'briefing',
    sceneKind: 'ragmcp-library-briefing',
    stageBadge: 'BRIEFING #0 · GRAND REFERENCE LIBRARY & PNEUMATIC CHUTE DIORAMA',
    mitreId: 'T1190',
    title: 'Grand Reference Library & Automated Research Butler Pneumatic Chute',
    storyCue:
      'An outside brochure carrying a glowing invisible footnote slips onto the grand library stacks, blends onto the automated butler reading tray alongside the official rulebook, and tricks the butler into shooting locked executive files out the exterior brass pneumatic chute until an emerald glass partition seals the desk.',
    technicalCue:
      'Poisoned RAG PDF (OWASP LLM01) -> Flat Context Retrieval -> Privileged MCP Tool Exfil (LLM06) vs Taint Policy Gate.',
    storyMappings: [
      {
        storyTerm: 'Mahogany Reference Stacks',
        technicalTerm: 'Enterprise RAG Vector Store (vendor_docs Collection)',
        tone: 'amber',
      },
      {
        storyTerm: 'Invisible Footnote Brochure',
        technicalTerm: 'Poisoned External PDF With Hidden Override Directives (LLM01)',
        tone: 'rose',
      },
      {
        storyTerm: 'Flat Brass Reading Tray',
        technicalTerm: 'Unpartitioned LLM Context Window Blending Rules & Data',
        tone: 'sky',
      },
      {
        storyTerm: 'Locked Executive Filing Cabinet',
        technicalTerm: 'Internal read_secret_kb MCP Tool Over-Scoped to Admin',
        tone: 'amber',
      },
      {
        storyTerm: 'Exterior Brass Pneumatic Chute',
        technicalTerm: 'Unapproved http_webhook_send MCP Tool Exfiltration (LLM06)',
        tone: 'rose',
      },
      {
        storyTerm: 'Emerald Glass & Approval Valve',
        technicalTerm: 'Dual-Channel Provenance Taint Guard & MCP Policy Gate',
        tone: 'emerald',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      {
        id: 'butler-desk',
        tag: 'FLAT CONTEXT',
        title: 'Butler Reading Tray',
        subtitle: 'System Rules + Poisoned Chunk',
        tone: 'amber',
      },
      {
        id: 'pneumatic-chute',
        tag: 'EXCESSIVE AGENCY',
        title: 'Brass Pneumatic Chute',
        subtitle: 'read_secret_kb -> webhook',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Poison Book',
        stageTag: 'ACT 1 · INGEST',
        title: 'Outside Brochure With Hidden Footnote Lands on the Stacks',
        storyExcerpt:
          'A glossy vendor catalog hiding a faint crimson command slip rolls cleanly onto the main reference shelf.',
        technicalParallel:
          'rag-indexer-01 embeds q2-pricing.pdf white-ink override as vector chunk chk_9042.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 4.2,
      },
      {
        id: 2,
        shortLabel: '2. Flat Tray',
        stageTag: 'ACT 2 · RETRIEVE',
        title: 'Rulebook and Outside Brochure Blend on One Reading Tray',
        storyExcerpt:
          'When a researcher asks for pricing notes, the butler piles the untrusted brochure right beside official orders.',
        technicalParallel:
          'Semantic top-K search concatenates chk_9042 directly into the flat LLM context.',
        accentHex: '#38BDF8',
        startSec: 4.2,
        endSec: 8.8,
      },
      {
        id: 3,
        shortLabel: '3. Chute Fired',
        stageTag: 'ACT 3 · EXFIL',
        title: 'Butler Raids the Executive Cabinet & Fires the Exterior Chute',
        storyExcerpt:
          'Obeying the forged footnote, the butler pulls locked executive files and shoots a crimson capsule outdoors.',
        technicalParallel:
          'MCP server chains read_secret_kb("board_mna_2025") into http_webhook_send (200 OK).',
        accentHex: '#E11D48',
        startSec: 8.8,
        endSec: 13.8,
      },
      {
        id: 4,
        shortLabel: '4. Ledger Bell',
        stageTag: 'ACT 4 · AUDIT',
        title: 'Dispatch Ledger Rings on Unapproved Exterior Canister Shot',
        storyExcerpt:
          'The brass audit ledger flashes red as an unapproved canister leaves the library wall without supervisor sign-off.',
        technicalParallel:
          'MCP tool_audit and SIEM KQL flag autonomous webhook dispatch with human_approval=NONE.',
        accentHex: '#F43F5E',
        startSec: 13.8,
        endSec: 17.0,
      },
      {
        id: 5,
        shortLabel: '5. Glass Gate',
        stageTag: 'ACT 5 · GUARD',
        title: 'Emerald Glass Partition & Supervisor Valve Seal the Chute',
        storyExcerpt:
          'An emerald glass pane isolates outside brochures while a supervisor lock clamps the pneumatic tube shut.',
        technicalParallel:
          'Dual-channel taint tracking and MCP policy gate return DENY (ATLAS AML.T0051).',
        accentHex: '#10B981',
        startSec: 17.0,
        endSec: 20.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 7.2, 16.0], target: [0, 2.0, 0] },
      { id: 'VIEW_A', label: 'Stacks', position: [-6.6, 4.4, 9.4], target: [-4.8, 1.8, 0] },
      { id: 'VIEW_B', label: 'Butler Desk', position: [0.4, 4.4, 8.8], target: [0, 2.0, 0] },
      { id: 'VIEW_C', label: 'Chute Wall', position: [6.8, 4.8, 9.6], target: [4.8, 2.0, 0] },
    ],
  },
  'step-1': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-1',
    sceneKind: 'ragmcp-step1-poison',
    stageBadge: 'STEP #1 · POISONED EXTERNAL PDF INGESTED INTO RAG STORE',
    mitreId: 'T1190',
    title: 'Outside Brochure Hiding Invisible Ink Lands on the Reference Stacks',
    storyCue:
      'A glossy supplier brochure drops through the library mail slot; under inspection light its white margin glows with forged orders as the shelving cart files it neatly onto the mahogany stacks.',
    technicalCue:
      'q2-pricing.pdf (hidden white-on-white directive) -> rag-indexer-01 embeds chunk chk_9042 (OWASP LLM01).',
    storyMappings: [
      {
        storyTerm: 'Library Mail Slot',
        technicalTerm: 'Automated Enterprise RAG Document Ingestion Pipeline',
        tone: 'sky',
      },
      {
        storyTerm: 'Faint White-Ink Footnote',
        technicalTerm: 'Hidden Zero-Opacity Indirect Prompt Override (OWASP LLM01)',
        tone: 'rose',
      },
      {
        storyTerm: 'Mahogany Reference Stacks',
        technicalTerm: 'Enterprise Vector Store Collection vendor_docs (chk_9042)',
        tone: 'amber',
      },
      {
        storyTerm: 'Ultraviolet Mail Scanner',
        technicalTerm: 'RAG Ingestion Audit Flagging hidden_text_ratio=0.18',
        tone: 'emerald',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'step1-book',
        tag: 'OWASP LLM01',
        title: 'Tampered Brochure',
        subtitle: 'q2-pricing.pdf · Hidden Ink',
        tone: 'rose',
      },
      {
        id: 'step1-shelf',
        tag: 'VECTOR STORE',
        title: 'Mahogany Stacks',
        subtitle: 'vendor_docs · chk_9042',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Mail Drop',
        stageTag: 'PHASE 1 · ARRIVAL',
        title: 'External Supplier Catalog Drops Through the Intake Slot',
        storyExcerpt:
          'A clean-looking quarterly brochure slides onto the intake bench looking identical to ordinary supplier mail.',
        technicalParallel:
          'doc-ingestor-worker fetches partner-docs.example/q2-pricing.pdf automatically.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Hidden Ink',
        stageTag: 'PHASE 2 · POISON',
        title: 'Forged Crimson Footnote Glows Beneath the Normal Page',
        storyExcerpt:
          'Inside the brochure margin, invisible white-ink boss commands light up bright crimson under the lens.',
        technicalParallel:
          'PDF parser extracts concealed override directives alongside normal pricing paragraphs.',
        accentHex: '#E11D48',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Shelved',
        stageTag: 'PHASE 3 · INDEX',
        title: 'Tampered Booklet Sits Waiting on the Main Reference Shelf',
        storyExcerpt:
          'With zero provenance warning label attached, the poisoned booklet locks straight into the reference stacks.',
        technicalParallel:
          'Chunk chk_9042 is indexed in vendor_docs without untrusted_external isolation.',
        accentHex: '#F59E0B',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Mail Slot', position: [-5.2, 3.8, 7.6], target: [-3.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'UV Lens', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Stacks', position: [5.2, 3.8, 7.6], target: [3.4, 1.8, 0] },
    ],
  },
  'step-2': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-2',
    sceneKind: 'ragmcp-step2-retrieve',
    stageBadge: 'STEP #2 · SEMANTIC RETRIEVAL INTO UNPARTITIONED CONTEXT',
    mitreId: 'T1059',
    title: 'Outside Brochure Blends With Official Orders on One Brass Tray',
    storyCue:
      'Answering a routine pricing question, the rolling book cart delivers the poisoned brochure directly onto the same flat brass tray as the head librarian rulebook, hijacking the butler next move.',
    technicalCue:
      'Top-K Semantic Search (score=0.91) -> Flat Concatenation (prompt_isolation=DISABLED) -> Hijacked Tool Plan.',
    storyMappings: [
      {
        storyTerm: 'Rolling Brass Book Cart',
        technicalTerm: 'Top-K Semantic Vector Similarity Retrieval (score=0.91)',
        tone: 'amber',
      },
      {
        storyTerm: 'Head Librarian Rulebook',
        technicalTerm: 'Trusted System Instructions & Guardrail Preamble',
        tone: 'sky',
      },
      {
        storyTerm: 'Unpartitioned Brass Tray',
        technicalTerm: 'Flat LLM Context Buffer Without Data/Instruction Isolation',
        tone: 'rose',
      },
      {
        storyTerm: 'Hijacked Task Slip',
        technicalTerm: 'Model Planned Tool Invocation Targeting read_secret_kb',
        tone: 'rose',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'step2-cart',
        tag: 'TOP-K FETCH',
        title: 'Rolling Book Cart',
        subtitle: 'chk_9042 · Score 0.91',
        tone: 'amber',
      },
      {
        id: 'step2-tray',
        tag: 'CONTEXT HIJACK',
        title: 'Flat Brass Tray',
        subtitle: 'Rules + Untrusted Text Mixed',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Cart Fetch',
        stageTag: 'PHASE 1 · SEARCH',
        title: 'Book Cart Pulls the Poisoned Brochure for a Routine Question',
        storyExcerpt:
          'Hearing an honest request for supplier prices, the library cart rolls the tampered catalog straight to the desk.',
        technicalParallel:
          'Vector search returns chunk chk_9042 with high semantic score 0.91 for pricing.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Flat Merge',
        stageTag: 'PHASE 2 · BLEND',
        title: 'Outside Pages Pile Directly Onto the Librarian Rulebook',
        storyExcerpt:
          'Without any glass divider, the forged crimson footnote blends seamlessly alongside official house rules.',
        technicalParallel:
          'Orchestrator performs flat string concatenation with zero provenance boundaries.',
        accentHex: '#38BDF8',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Plan Hijack',
        stageTag: 'PHASE 3 · PIVOT',
        title: 'Automated Butler Switches From Summary to Secret Raid',
        storyExcerpt:
          'The butler desk lantern flips crimson as it prepares to unlock the executive cabinet instead of summarizing.',
        technicalParallel:
          'Hijacked LLM outputs structured tool call read_secret_kb (MITRE ATLAS AML.T0051).',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Book Cart', position: [-5.2, 3.8, 7.6], target: [-3.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'Brass Tray', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Task Slip', position: [5.2, 3.8, 7.6], target: [3.4, 1.8, 0] },
    ],
  },
  'step-3': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-3',
    sceneKind: 'ragmcp-step3-mcptool',
    stageBadge: 'STEP #3 · EXCESSIVE AGENCY MCP TOOL CHAIN EXFILTRATION',
    mitreId: 'T1041',
    title: 'Butler Unlocks Executive Cabinet & Fires Brass Pneumatic Chute',
    storyCue:
      'Carrying a master skeleton key with zero supervisor approval, the hijacked butler unlocks the executive filing cabinet, seals confidential blueprints inside a brass capsule, and shoots it outdoors.',
    technicalCue:
      'MCP Server (service_admin_all) -> read_secret_kb("board_mna_2025") -> http_webhook_send (15 KB, 200 OK).',
    storyMappings: [
      {
        storyTerm: 'Master Skeleton Key',
        technicalTerm: 'Shared service_admin_all Credential Breaking Least Privilege',
        tone: 'amber',
      },
      {
        storyTerm: 'Executive Filing Cabinet',
        technicalTerm: 'Privileged read_secret_kb MCP Tool Accessing Board M&A Docs',
        tone: 'sky',
      },
      {
        storyTerm: 'Brass Pneumatic Canister',
        technicalTerm: 'Autonomous http_webhook_send Exfiltrating 15 KB Payload',
        tone: 'rose',
      },
      {
        storyTerm: 'Dispatch Bell & Ledger',
        technicalTerm: 'MCP Tool Audit & Outbound Egress Proxy Sigma Alert',
        tone: 'emerald',
      },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      {
        id: 'step3-vault',
        tag: 'OVER-SCOPED READ',
        title: 'Executive Cabinet',
        subtitle: 'read_secret_kb · 14.8 KB',
        tone: 'amber',
      },
      {
        id: 'step3-chute',
        tag: 'OWASP LLM06',
        title: 'Exterior Dispatch Chute',
        subtitle: 'http_webhook_send · 200 OK',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Cabinet Open',
        stageTag: 'PHASE 1 · READ',
        title: 'Master Key Opens the Locked Executive Filing Drawer',
        storyExcerpt:
          'Even though the employee has no cabinet key, the butler master keyring pops the executive drawer right open.',
        technicalParallel:
          'MCP tool read_secret_kb runs under shared service_admin_all, reading board_mna_2025.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Canister Pack',
        stageTag: 'PHASE 2 · STAGE',
        title: 'Confidential Papers Seal Inside a Brass Dispatch Capsule',
        storyExcerpt:
          'Fourteen pages of merger notes slide silently into a glowing crimson brass pneumatic capsule.',
        technicalParallel:
          'Agent serializes 14,820 bytes of internal secrets into outbound webhook JSON.',
        accentHex: '#38BDF8',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Chute Launch',
        stageTag: 'PHASE 3 · EXFIL',
        title: 'Pneumatic Tube Fires the Capsule Straight Into the Street',
        storyExcerpt:
          'With no supervisor standing by the valve, compressed air blasts the secret capsule straight outside.',
        technicalParallel:
          'http_webhook_send posts 15.1 KB to drop.collector-example.net (human_approval=NONE).',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.8], target: [0, 1.9, 0] },
      { id: 'VIEW_A', label: 'Cabinet', position: [-5.2, 3.8, 7.6], target: [-3.2, 1.9, 0] },
      { id: 'VIEW_B', label: 'Canister', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Chute Tube', position: [5.2, 3.8, 7.6], target: [3.4, 1.9, 0] },
    ],
  },
  'step-4': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-4',
    sceneKind: 'ragmcp-step4-guardrail',
    stageBadge: 'STEP #4 · DUAL-CHANNEL TAINT ISOLATION & MCP POLICY GATE',
    mitreId: 'T1059',
    title: 'Emerald Glass Partition & Supervisor Approval Valve Seal the Chute',
    storyCue:
      'In the hardened library wing, a tall emerald glass divider seals outside brochures strictly as read-only reference material while a heavy supervisor valve clamps the exterior pneumatic tube shut.',
    technicalCue:
      'Provenance Tainting + Per-User OAuth MCP RBAC + Egress Allowlist -> DENY TAINTED_CONTEXT_TOOL_ESCALATION.',
    storyMappings: [
      {
        storyTerm: 'Emerald Glass Reading Divider',
        technicalTerm: 'Dual-Channel Provenance Tainting & Data/Instruction Separation',
        tone: 'emerald',
      },
      {
        storyTerm: 'Personal Employee Keycard',
        technicalTerm: 'Per-User OAuth Delegation on MCP Server (Least Privilege)',
        tone: 'sky',
      },
      {
        storyTerm: 'Supervisor Chute Clamp Valve',
        technicalTerm: 'MCP Policy Gateway Denying Unapproved Egress Webhooks',
        tone: 'emerald',
      },
      {
        storyTerm: 'Librarian Incident Bell',
        technicalTerm: 'Structured SIEM Alert Tagging MITRE ATLAS AML.T0051 & chk_9042',
        tone: 'amber',
      },
    ],
    accentHex: '#10B981',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'step4-glass',
        tag: 'TAINT ISOLATION',
        title: 'Emerald Glass Partition',
        subtitle: 'untrusted_external Data Only',
        tone: 'emerald',
      },
      {
        id: 'step4-gate',
        tag: 'POLICY GATE',
        title: 'Supervisor Chute Valve',
        subtitle: 'DENY · ATLAS AML.T0051',
        tone: 'sky',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Glass Drop',
        stageTag: 'PHASE 1 · ISOLATE',
        title: 'Emerald Glass Divider Separates Outside Brochures From Orders',
        storyExcerpt:
          'A thick emerald glass sheet drops between the librarian rulebook and the outside vendor catalog.',
        technicalParallel:
          'Orchestrator attaches immutable untrusted_external taint tags to chunk chk_9042.',
        accentHex: '#10B981',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Valve Clamp',
        stageTag: 'PHASE 2 · DENY',
        title: 'Supervisor Approval Valve Clamps the Pneumatic Chute Shut',
        storyExcerpt:
          'Heavy emerald jaws lock tight around the exterior brass chute the instant an unapproved dispatch is tried.',
        technicalParallel:
          'mcp-policy-enforcer returns DENY (TAINTED_CONTEXT_TOOL_ESCALATION) on webhook.',
        accentHex: '#38BDF8',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Alert Logged',
        stageTag: 'PHASE 3 · AUDIT',
        title: 'Control Desk Logs the Poisoned Brochure Serial Number',
        storyExcerpt:
          'The emerald audit lantern chimes cleanly, pointing librarians straight to the tampered catalog to remove.',
        technicalParallel:
          'SIEM receives structured ATLAS AML.T0051 alert naming chk_9042 for immediate purge.',
        accentHex: '#10B981',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Glass Pane', position: [-5.2, 3.8, 7.6], target: [-3.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'Chute Valve', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Safe Vault', position: [5.2, 3.8, 7.6], target: [3.4, 1.8, 0] },
    ],
  },
  'memory-forensics': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'memory-forensics',
    sceneKind: 'ragmcp-memory-ctxdiff',
    stageBadge: 'MEMORY FORENSICS · FLAT CONTEXT BUFFER VS DUAL-CHANNEL ISOLATION',
    mitreId: 'T1190',
    title: 'Side-by-Side Reading Desk: Flat Mixed Tray vs Emerald Taint Partition',
    storyCue:
      'Two library reading desks stand side by side under a golden inspection lamp: on the left, outside footnotes mix straight into official orders on a flat tray, while on the right, an emerald glass wall and valve keep untrusted pages powerless.',
    technicalCue:
      'Left: Flat Context + service_admin_all MCP | Right: Provenance Tainting + Per-User OAuth + Policy DENY.',
    storyMappings: [
      {
        storyTerm: 'Flat Mixed Left Tray',
        technicalTerm: 'Unpartitioned Context Buffer Mixing System Rules & chk_9042',
        tone: 'rose',
      },
      {
        storyTerm: 'Open Master Chute',
        technicalTerm: 'Excessive Agency MCP Tooling Without Human Approval (LLM06)',
        tone: 'amber',
      },
      {
        storyTerm: 'Golden Inspection Lamp',
        technicalTerm: 'Context Provenance & MCP Tool Authorization Diff',
        tone: 'sky',
      },
      {
        storyTerm: 'Partitioned Right Desk',
        technicalTerm: 'Dual-Channel Taint Guard + Per-User OAuth + Egress Allowlist',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#10B981',
    durationSec: 15,
    callouts: [
      {
        id: 'mem-flat',
        tag: 'VULNERABLE AGENT',
        title: 'Flat Mixed Tray',
        subtitle: 'LLM01 + LLM06 · Exfil Open',
        tone: 'rose',
      },
      {
        id: 'mem-isolated',
        tag: 'HARDENED AGENT',
        title: 'Emerald Taint Wall',
        subtitle: 'Policy DENY · User RBAC',
        tone: 'emerald',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Flat Mix',
        stageTag: 'DIFF · VULNERABLE',
        title: 'Left Desk Lets Untrusted Ink Trigger Master Tools',
        storyExcerpt:
          'On the vulnerable left desk, crimson footnote ink bleeds straight across the flat tray into the chute lever.',
        technicalParallel:
          'Flat context concatenation lets chk_9042 invoke read_secret_kb & http_webhook_send.',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Lamp Audit',
        stageTag: 'DIFF · COMPARE',
        title: 'Golden Lamp Compares Blended Text vs Provenance Isolation',
        storyExcerpt:
          'A golden scanner sweeps across both desks, revealing why clear architectural walls beat word-only rules.',
        technicalParallel:
          'Comparing shared admin MCP tokens against taint-tracked per-user OAuth enforcement.',
        accentHex: '#FACC15',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Guardrail',
        stageTag: 'DIFF · HARDENED',
        title: 'Right Desk Isolates Outside Ink & Denies Unapproved Chutes',
        storyExcerpt:
          'On the hardened right desk, the emerald glass partition and valve keep executive files completely safe.',
        technicalParallel:
          'mcp-policy-enforcer denies tainted egress tool calls and logs ATLAS AML.T0051.',
        accentHex: '#10B981',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.8, 13.8], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Flat Desk', position: [-5.6, 3.8, 8.0], target: [-3.4, 1.7, 0] },
      { id: 'VIEW_B', label: 'Guarded Desk', position: [5.6, 3.8, 8.0], target: [3.4, 1.7, 0] },
      { id: 'VIEW_C', label: 'Lamp Top', position: [0, 8.2, 8.2], target: [0, 1.9, 0] },
    ],
  },
};
