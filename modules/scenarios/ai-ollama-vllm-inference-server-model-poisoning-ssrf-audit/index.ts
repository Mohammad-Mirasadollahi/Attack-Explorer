import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a private company AI library whose automated book-receiving counter was accidentally bolted onto the outer street wall with no library card check. An outsider walks up to read the entire private catalog of custom handbooks, orders the library robot to fetch a counterfeit book from their own shady print shop across town, and relabels that counterfeit copy under the company’s official finance handbook title so every employee receives poisoned answers.',
      storyMappings: [
        {
          storyTerm: 'Street-Facing Library Counter',
          technicalTerm: 'Unauthenticated Ollama Inference API Bound to 0.0.0.0:11434',
          tone: 'amber',
        },
        {
          storyTerm: 'Reading Private Custom Catalog',
          technicalTerm: 'GET /api/tags & POST /api/show Leaking Prompts & LoRA Paths',
          tone: 'sky',
        },
        {
          storyTerm: 'Fetching From Shady Print Shop',
          technicalTerm: 'POST /api/pull SSRF Pulling Tampered GGUF Blobs From Rogue Registry',
          tone: 'rose',
        },
        {
          storyTerm: 'Relabeling Official Finance Handbook',
          technicalTerm: 'POST /api/create Overwriting Production Model Alias (OWASP LLM04)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Stepping up to the unguarded street-facing counter, the outsider asks the library kiosk for a full catalog printout and detailed cover cards, exposing proprietary fine-tuned handbooks, hidden staff system instructions, and adapter locations.',
        storyMappings: [
          {
            storyTerm: 'Unguarded Library Kiosk',
            technicalTerm: 'Ollama Server Listening on OLLAMA_HOST=0.0.0.0:11434 Without Proxy',
            tone: 'amber',
          },
          {
            storyTerm: 'Catalog Printout & Cover Cards',
            technicalTerm: 'Unauthenticated GET /api/tags & POST /api/show Enumeration',
            tone: 'rose',
          },
          {
            storyTerm: 'Proprietary Handbooks & Instructions',
            technicalTerm: 'Leaked System Prompts, Fine-Tuned LoRA Paths & GGUF SHA-256 Digests',
            tone: 'sky',
          },
          {
            storyTerm: 'Loopback & Card-Reader Lock',
            technicalTerm: 'Binding OLLAMA_HOST=127.0.0.1:11434 Behind mTLS / API-Key Gateway',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, the outsider hands the library robot a special acquisition slip pointing to their own external print shop, causing the trusted internal server to dial out across the corporate fence and stock tampered model weight bundles right onto the local shelves.',
        storyMappings: [
          {
            storyTerm: 'Special Acquisition Slip',
            technicalTerm: 'POST /api/pull Specifying Custom Attacker Registry Host URL',
            tone: 'rose',
          },
          {
            storyTerm: 'Server Dialing Out Across Fence',
            technicalTerm: 'Server-Side Request Forgery (SSRF) to External Rogue Registry',
            tone: 'amber',
          },
          {
            storyTerm: 'Tampered Weight Bundles on Shelves',
            technicalTerm: 'Untrusted GGUF Blobs Saved Under ~/.ollama/models/blobs/',
            tone: 'sky',
          },
          {
            storyTerm: 'Outbound Registry Fence',
            technicalTerm: 'Egress Firewall Allowlisting Approved Registries & Blocking /api/pull',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Finally, the outsider submits a rebinding order that pastes the company’s official finance-assistant spine label onto the tampered volume with hidden behavioral instructions tucked inside, silently corrupting every future answer until auditors lock the shelves read-only.',
        storyMappings: [
          {
            storyTerm: 'Rebinding Order With Official Label',
            technicalTerm: 'POST /api/create Overwriting corp-finance-assistant:latest Manifest',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden Behavioral Instructions',
            technicalTerm: 'Embedded Malicious SYSTEM Prompt & Poisoned Weights (LLM04)',
            tone: 'amber',
          },
          {
            storyTerm: 'Modified Shelf Index Card',
            technicalTerm: 'Tampered ~/.ollama/models/manifests/.../latest Tracked by auditd',
            tone: 'sky',
          },
          {
            storyTerm: 'Read-Only Locked Shelves',
            technicalTerm: 'Mounting ~/.ollama/models Read-Only (ro) With Signed Digests',
            tone: 'emerald',
          },
        ],
      },
    },
  };
