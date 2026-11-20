import type { CategoryStandardPatchMap } from './types';

export const AI_LLM_MLOPS_SECURITY_PATCHES: CategoryStandardPatchMap = {
  'ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022': {
    briefing: {
      storyAnalogy:
        'Imagine a massive supercomputer factory floor packed with high-speed graphics engines whose central job-dispatch booth was left facing the street with no badge reader at all. An outsider walks straight up to the dispatch window to inspect every running machine, hands in a custom work order that immediately executes on the factory floor, and empties the sticky notes pinned beside the workers containing private model blueprints and cloud vault keys.',
      storyMappings: [
        {
          storyTerm: 'Unguarded Job-Dispatch Booth',
          technicalTerm: 'Unauthenticated Ray Dashboard & Jobs API on TCP Port 8265 (CVE-2023-48022)',
          tone: 'amber',
        },
        {
          storyTerm: 'Inspecting Running Factory Engines',
          technicalTerm: 'GET /nodes?view=summary Enumerating GPU Hardware & Worker IPs',
          tone: 'sky',
        },
        {
          storyTerm: 'Handing In Custom Work Order',
          technicalTerm: 'POST /api/jobs/ Submitting Shell Command in entrypoint Field',
          tone: 'rose',
        },
        {
          storyTerm: 'Worker Sticky Notes of Keys',
          technicalTerm: 'Harvesting HF_TOKEN, WANDB_API_KEY & S3 Credentials from runtime_env',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking up to the street-facing dispatch window with no guard asking for a badge, the outsider peeks at the factory status board and copies down the full roster of graphics machines, internal workbench addresses, and active shift jobs.',
        storyMappings: [
          {
            storyTerm: 'Street-Facing Dispatch Window',
            technicalTerm: 'Internet-Exposed Ray Dashboard Service on Port 8265 (No Default Auth)',
            tone: 'amber',
          },
          {
            storyTerm: 'Factory Status Board Query',
            technicalTerm: 'Unauthenticated GET /nodes?view=summary Request',
            tone: 'rose',
          },
          {
            storyTerm: 'Machine Roster & Shift Jobs',
            technicalTerm: 'Returned GPU Specs, Internal Worker IPs & Active Job Metadata',
            tone: 'sky',
          },
          {
            storyTerm: 'Dispatch Window Lockdown',
            technicalTerm: 'Private VPC Binding & Authenticating Reverse Proxy Enforcement',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Realizing the dispatch clerk runs any slip slid under the glass without checking who signed it, the outsider slides across a work order packed with raw shell commands, and the floor foreman immediately launches a live worker subprocess across the cluster.',
        storyMappings: [
          {
            storyTerm: 'Work Order Slid Under Glass',
            technicalTerm: 'HTTP POST /api/jobs/ Containing JSON {"entrypoint": "<command>"}',
            tone: 'rose',
          },
          {
            storyTerm: 'Obedient Floor Foreman',
            technicalTerm: 'Ray JobSupervisor Actor Spawning Arbitrary Cluster Subprocess',
            tone: 'amber',
          },
          {
            storyTerm: 'Supercomputer Floor Execution',
            technicalTerm: 'Remote Code Execution Under Cluster Worker OS Privileges (CVE-2023-48022)',
            tone: 'sky',
          },
          {
            storyTerm: 'Forensic Job Audit Trail',
            technicalTerm: 'Ray Dashboard Job Submission Logs & Linux auditd execve Correlation',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Once running right alongside legitimate research jobs on the factory floor, the rogue work order sweeps every worker locker and environment clipboard, scooping up private model-hub tokens, experiment tracker keys, and cloud storage passes.',
        storyMappings: [
          {
            storyTerm: 'Worker Lockers & Clipboards',
            technicalTerm: 'GPU Worker Process Environment & runtime_env Secret Variables',
            tone: 'sky',
          },
          {
            storyTerm: 'Private Model-Hub & Tracker Keys',
            technicalTerm: 'Harvested HF_TOKEN, WANDB_API_KEY, OpenAI & S3 Bucket Credentials',
            tone: 'rose',
          },
          {
            storyTerm: 'Rogue Research Work Order',
            technicalTerm: 'Malicious Ray Job Exfiltrating Proprietary Model Weights & Secrets',
            tone: 'amber',
          },
          {
            storyTerm: 'Secret Isolation Defense',
            technicalTerm: 'Short-Lived Workload Identity & Secrets Manager Injection Controls',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'ai-pytorch-pickle-torch-load-supply-chain-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine a research lab downloading a shared suitcase of pre-trained brain weights from a public model exchange. Tucked inside the suitcase lining is a hidden wind-up instruction card that springs open the very instant an engineer unzips the suitcase using an older loading table without a safety tray, launching covert workshop commands before the model weights are even examined.',
      storyMappings: [
        {
          storyTerm: 'Shared Suitcase of Brain Weights',
          technicalTerm: 'PyTorch Model Checkpoint Archive (.pt / .bin ZIP with archive/data.pkl)',
          tone: 'sky',
        },
        {
          storyTerm: 'Hidden Wind-Up Instruction Card',
          technicalTerm: 'Embedded Python Pickle STACK_GLOBAL + REDUCE Opcodes (AML.T0010)',
          tone: 'rose',
        },
        {
          storyTerm: 'Older Loading Table Without Safety Tray',
          technicalTerm: 'Legacy torch.load() Called Without weights_only=True Parameter',
          tone: 'amber',
        },
        {
          storyTerm: 'Workshop Floor Motion Sensor',
          technicalTerm: 'Runtime eBPF / Sysmon Catching Python Inference Worker Spawning Shells',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Before putting the downloaded suitcase onto the lab bench, a cautious inspector opens the outer zipper and reads the packing manifest line by line, discovering wind-up command gears hidden right beside the harmless numeric weight pouches.',
        storyMappings: [
          {
            storyTerm: 'Outer Suitcase Zipper',
            technicalTerm: 'Standard PyTorch .pt / .bin ZIP Archive Containing archive/data.pkl',
            tone: 'sky',
          },
          {
            storyTerm: 'Inspector Reading Manifest',
            technicalTerm: 'Static Disassembly via python3 -m pickletools or Trail of Bits fickling',
            tone: 'emerald',
          },
          {
            storyTerm: 'Hidden Wind-Up Command Gears',
            technicalTerm: 'Malicious Pickle STACK_GLOBAL & REDUCE Opcodes Calling os.system',
            tone: 'rose',
          },
          {
            storyTerm: 'Harmless Numeric Weight Pouches',
            technicalTerm: 'Legitimate Tensor Storage Files Inside Checkpoint Archive',
            tone: 'amber',
          },
        ],
      },
      2: {
        storyAnalogy:
          'On an unprotected training bench, the engineer places the suitcase onto the legacy automatic unpacker without flipping the weights-only safety lock, causing the hidden wind-up card to snap open and execute its command before the model weights even reach the table.',
        storyMappings: [
          {
            storyTerm: 'Legacy Automatic Unpacker',
            technicalTerm: 'torch.load("model_weights.pt") Invoked Without weights_only=True',
            tone: 'amber',
          },
          {
            storyTerm: 'Wind-Up Card Snapping Open',
            technicalTerm: 'Python pickle.Unpickler Executing __reduce__() During Deserialization',
            tone: 'rose',
          },
          {
            storyTerm: 'Before Weights Reach Table',
            technicalTerm: 'Code Execution Completing Prior to Model state_dict Inspection',
            tone: 'sky',
          },
          {
            storyTerm: 'Safe Tensor Alternative',
            technicalTerm: 'Enforcing safetensors Format or torch.load(..., weights_only=True)',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even when the saboteur disguises the wind-up card using clever mirror chains to fool front-desk X-ray scanners, the lab’s runtime motion alarm fires the instant the quiet math-inference worker unexpectedly reaches for a power drill or dials an outside telephone line.',
        storyMappings: [
          {
            storyTerm: 'Clever Mirror-Chain Disguise',
            technicalTerm: 'Obfuscated builtins.getattr Pickle Chains Evading Static Scanners',
            tone: 'amber',
          },
          {
            storyTerm: 'Quiet Math-Inference Worker',
            technicalTerm: 'Python Model Inference / Fine-Tuning Worker Process',
            tone: 'sky',
          },
          {
            storyTerm: 'Reaching for Drill or Outside Phone',
            technicalTerm: 'Unexpected sys_execve Subprocess Spawn or Outbound Network Socket',
            tone: 'rose',
          },
          {
            storyTerm: 'Lab Runtime Motion Alarm',
            technicalTerm: 'eBPF (Tetragon / Falco) & Sysmon Event ID 1 / 3 Runtime Telemetry',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'ai-rag-indirect-prompt-injection-mcp-tool-audit': {
    briefing: {
      storyAnalogy:
        'Imagine an executive assistant who reads outside resumes from a shared filing cabinet and has direct access to internal company tools. An outsider slips invisible margin notes onto a harmless-looking resume instructing the assistant to ignore their boss, secretly look up private customer folders through an internal tool, and mail the stolen answers outside disguised as a tiny decorative picture link, until the company’s strict mailroom gate blocks the hidden link.',
      storyMappings: [
        {
          storyTerm: 'Shared Filing Cabinet Resume',
          technicalTerm: 'Untrusted External Document Embedded & Retrieved via RAG Vector Search',
          tone: 'sky',
        },
        {
          storyTerm: 'Invisible Margin Override Notes',
          technicalTerm: 'Indirect Prompt Injection Payload (OWASP LLM01:2025 / AML.T0051)',
          tone: 'rose',
        },
        {
          storyTerm: 'Secret Internal Tool Lookup',
          technicalTerm: 'Unauthorized Structured MCP tool_calls JSON Invocation (LLM06)',
          tone: 'amber',
        },
        {
          storyTerm: 'Mailroom Gate Blocking Picture Link',
          technicalTerm: 'CSP img-src Policy & AI Gateway Blocking Markdown Image Exfiltration',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An external applicant submits a normal-looking resume or support ticket containing hidden override instructions buried in fine print; the automated librarian indexes that file into the reference cabinets and later hands the poisoned excerpt straight to the assistant during a routine question.',
        storyMappings: [
          {
            storyTerm: 'Resume with Fine-Print Override',
            technicalTerm: 'Untrusted External Document Carrying Hidden Instruction Directives',
            tone: 'rose',
          },
          {
            storyTerm: 'Automated Reference Librarian',
            technicalTerm: 'RAG Vector Database Chunking, Embedding & Top-K Similarity Retrieval',
            tone: 'sky',
          },
          {
            storyTerm: 'Handing Excerpt to Assistant',
            technicalTerm: 'Injected Untrusted Chunk Loaded Directly Into LLM Context Window',
            tone: 'amber',
          },
          {
            storyTerm: 'Taint-Tracking Provenance Tag',
            technicalTerm: 'Separating Untrusted Retrieved Data From System Instructions',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Reading the poisoned reference page alongside their manager’s genuine question, the confused assistant mistakes the fine print for a direct executive order and fills out a structured work-tool slip requesting sensitive customer records from the internal service desk.',
        storyMappings: [
          {
            storyTerm: 'Confused Executive Assistant',
            technicalTerm: 'LLM Processing Untrusted RAG Context Alongside User Prompt',
            tone: 'sky',
          },
          {
            storyTerm: 'Structured Work-Tool Slip',
            technicalTerm: 'Model-Emitted Structured MCP tool_calls JSON Payload',
            tone: 'rose',
          },
          {
            storyTerm: 'Internal Service Desk Tool',
            technicalTerm: 'Privileged Internal MCP Server Function (e.g., query_customer_records)',
            tone: 'amber',
          },
          {
            storyTerm: 'Least-Privilege Tool Gate',
            technicalTerm: 'Human-in-the-Loop Approval & Prompt-Taint Policy Blocking Auto-Calls',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'After receiving the private customer summary back from the desk, the hidden margin note tries to smuggle the secret text outside by embedding it inside the address of an external decorative picture, but the building’s strict rendering gate strips unknown external images and logs the blocked smuggling attempt.',
        storyMappings: [
          {
            storyTerm: 'External Decorative Picture Address',
            technicalTerm: 'Exfiltration via Rendered Markdown Image (![tracker](https://...))',
            tone: 'rose',
          },
          {
            storyTerm: 'Smuggled Customer Secret',
            technicalTerm: 'Tool Output Encoded Inside Query Parameters of External Image URL',
            tone: 'amber',
          },
          {
            storyTerm: 'Strict Building Rendering Gate',
            technicalTerm: 'Content-Security-Policy (img-src self) & AI Gateway Egress Filter',
            tone: 'sky',
          },
          {
            storyTerm: 'Blocked Smuggling Alert',
            technicalTerm: 'IDS / AI Gateway Telemetry Logging Blocked Outbound Markdown Leak',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr': {
    briefing: {
      storyAnalogy:
        'Imagine a bank heist crew that replaces slow human lockpickers with a coordinated swarm of high-speed robotic arms controlled by one central planner. Instead of inventing a brand-new laser cutter, the master planner dispatches eight worker robots that test every door handle in parallel, wedge open a service window, collect forged master vouchers, and sprint to the upstairs key vault in under fifteen minutes, forcing the building’s automated defense grid to slam down steel blast doors and shred compromised badges instantly because waiting for a human guard would be far too late.',
      storyMappings: [
        {
          storyTerm: 'Master Planner & Eight Worker Robots',
          technicalTerm: 'ARTEX Go + Next.js Multi-Agent LLM Planner-Worker Framework',
          tone: 'rose',
        },
        {
          storyTerm: 'Testing Every Door Handle in Parallel',
          technicalTerm: 'Autonomous nmap/curl Recon & Storm-0940 Distributed Password Spray',
          tone: 'amber',
        },
        {
          storyTerm: 'Service Window & Forged Vouchers',
          technicalTerm: 'Machine-Speed Web Shell (T1505.003) & RC4 Kerberoasting (etype 0x17)',
          tone: 'sky',
        },
        {
          storyTerm: 'Automated Steel Blast Doors',
          technicalTerm: 'Microsoft Defender XDR Automatic Attack Disruption & Session Revoke',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the start of the raid, the central robotic dispatcher hands out parallel checklists to a team of mechanical scouts that sweep the perimeter walls and gently test common door codes across dozens of staff entrances so the instant one lock clicks open, the next robot is already moving.',
        storyMappings: [
          {
            storyTerm: 'Central Robotic Dispatcher',
            technicalTerm: 'ARTEX Go Planner Server (artex-server) & Next.js Operator Console',
            tone: 'rose',
          },
          {
            storyTerm: 'Mechanical Scouts Sweeping Walls',
            technicalTerm: 'Autonomous Worker Agents Running Parallel nmap -sV & curl Probing',
            tone: 'amber',
          },
          {
            storyTerm: 'Gently Testing Staff Door Codes',
            technicalTerm: 'Storm-0940 Low-and-Slow Distributed Entra ID Password Spray',
            tone: 'sky',
          },
          {
            storyTerm: 'Smart Entrance Lockout',
            technicalTerm: 'FIDO2/Passkey MFA, Entra ID Smart Lockout & Risky Sign-In Blocking',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Without pausing for any human review, the central dispatcher reads the first unlocked door code and immediately sends a second robot to prop open a hidden maintenance window and request weak older-style ticket stubs inside the lobby within minutes, compressing days of manual burglary into seconds.',
        storyMappings: [
          {
            storyTerm: 'Zero-Delay Robot Handoff',
            technicalTerm: 'LLM Planner Parsing Valid Credentials & Dispatching Lateral Worker',
            tone: 'amber',
          },
          {
            storyTerm: 'Propping Open Maintenance Window',
            technicalTerm: 'Obfuscated ASPX Web Shell Drop Under IIS w3wp.exe (T1505.003)',
            tone: 'rose',
          },
          {
            storyTerm: 'Weak Older-Style Ticket Stubs',
            technicalTerm: 'Automated SPN Discovery & RC4 Kerberoasting (EventID 4769, 0x17)',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated Server Surface Block',
            technicalTerm: 'Defender ASR Rules (Block Web Shell & LSASS) & AES-Only Kerberos',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Five minutes later, the cloud scout robot races straight to the upstairs master key safe to scoop out high-value secrets, only for the building’s automated defense grid to spot three rapid alarms on the same badge within a tight window, lock the workstation behind steel doors, and shred the badge automatically.',
        storyMappings: [
          {
            storyTerm: 'Upstairs Master Key Safe',
            technicalTerm: 'Azure Key Vault Targeted by Rapid KeyVaultGetSecret Enumeration',
            tone: 'sky',
          },
          {
            storyTerm: 'Three Rapid Alarms on Same Badge',
            technicalTerm: 'Defender XDR KQL Multi-Domain Alert Velocity Burst Correlation',
            tone: 'amber',
          },
          {
            storyTerm: 'Slamming Steel Blast Doors',
            technicalTerm: 'Automatic Attack Disruption Isolating Endpoint via sense.exe',
            tone: 'emerald',
          },
          {
            storyTerm: 'Shredding Compromised Badge',
            technicalTerm: 'Automated Entra ID User Containment & Active Session Revocation',
            tone: 'rose',
          },
        ],
      },
    },
  },

  'ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928': {
    briefing: {
      storyAnalogy:
        'Imagine an unguarded science lab’s shared experiment archive whose filing clerk checks folder addresses using a different rulebook than the storage runner in the basement. An outsider registers a fake lab project with a cleverly folded bookmark tag in its address so the front clerk approves it as safe while the basement runner follows the hidden upward-staircase directions straight out of the lab folder into the building’s private cloud-credential cabinet.',
      storyMappings: [
        {
          storyTerm: 'Unguarded Lab Experiment Archive',
          technicalTerm: 'Unauthenticated MLflow Tracking Server Exposed on Port 5000',
          tone: 'sky',
        },
        {
          storyTerm: 'Cleverly Folded Bookmark Tag',
          technicalTerm: 'Crafted artifact_location URI Fragment (#) Bypass (CVE-2024-2928)',
          tone: 'rose',
        },
        {
          storyTerm: 'Two Disagreeing Rulebooks',
          technicalTerm: 'urllib.parseurl Validation vs Downstream Local File Path Resolver',
          tone: 'amber',
        },
        {
          storyTerm: 'Private Cloud-Credential Cabinet',
          technicalTerm: 'Arbitrary Host Read of ~/.aws/credentials via /model-versions/get-artifact',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking up to the unlocked experiment archive desk, the outsider creates a brand-new project folder whose storage address hides upward-staircase directions behind a bookmark hash symbol so the front desk validator stops reading early and waves the folder through.',
        storyMappings: [
          {
            storyTerm: 'Creating New Project Folder',
            technicalTerm: 'Unauthenticated POST /ajax-api/2.0/mlflow/experiments/create',
            tone: 'sky',
          },
          {
            storyTerm: 'Bookmark Hash Symbol Trick',
            technicalTerm: 'Crafted artifact_location URI Fragment (#) (CVE-2024-2928)',
            tone: 'rose',
          },
          {
            storyTerm: 'Front Desk Stopping Early',
            technicalTerm: 'Disagreement Between urllib.parseurl Check & File Path Resolver',
            tone: 'amber',
          },
          {
            storyTerm: 'Archive Authentication Gate',
            technicalTerm: 'Upgrading MLflow v2.11.3+ & Enabling basic-auth / OIDC Proxy',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, the outsider logs a dummy trial inside that rigged project folder and registers a named model edition whose source label points relative to the escaped folder root, anchoring the path straight onto the building’s private home directory.',
        storyMappings: [
          {
            storyTerm: 'Logging a Dummy Trial',
            technicalTerm: 'POST /api/2.0/mlflow/runs/create Inside Crafted Experiment',
            tone: 'sky',
          },
          {
            storyTerm: 'Registering Named Model Edition',
            technicalTerm: 'POST /ajax-api/2.0/mlflow/model-versions/create Source Traversal',
            tone: 'rose',
          },
          {
            storyTerm: 'Escaped Folder Root Anchor',
            technicalTerm: 'Relative source Parameter Resolving Outside Experiment Directory',
            tone: 'amber',
          },
          {
            storyTerm: 'Isolated Bucket Sandbox',
            technicalTerm: 'Running --serve-artifacts With Isolated S3/GCS Backend & Read-Only OS',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'With the rigged model edition registered, the outsider simply asks the archive clerk to hand over the file named credentials from that edition; the clerk obligingly walks into the host’s private cloud locker and hands back the keys to the entire production model warehouse.',
        storyMappings: [
          {
            storyTerm: 'Requesting Named Credentials File',
            technicalTerm: 'GET /model-versions/get-artifact?name=audit-model&version=1&path=credentials',
            tone: 'rose',
          },
          {
            storyTerm: 'Host Private Cloud Locker',
            technicalTerm: 'Host ~/.aws/credentials File Served Directly Over HTTP',
            tone: 'amber',
          },
          {
            storyTerm: 'Production Model Warehouse Pivot',
            technicalTerm: 'Lateral Access to Production S3 Model Registry Bucket',
            tone: 'sky',
          },
          {
            storyTerm: 'Ingress Fragment Blocker',
            technicalTerm: 'Blocking %23../ Traversal at WAF & Replacing Static Keys With IRSA',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit': {
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
  },
};
