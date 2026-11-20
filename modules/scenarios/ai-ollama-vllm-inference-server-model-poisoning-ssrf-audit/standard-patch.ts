import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
