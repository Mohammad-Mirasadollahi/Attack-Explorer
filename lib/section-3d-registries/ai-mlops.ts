import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for AI_LLM_MLOPS_SECURITY (6 scenarios).
 */
export const AI_MLOPS_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928": {
    "briefing": {
      "scenarioId": "ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928",
      "sectionKey": "briefing",
      "sceneKind": "ai-mlflow-lfi-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "MLflow Tracking Server URI Fragment Path Traversal & Artifact Store Audit — Story-to-Technical Overview",
      "storyCue": "Imagine an unguarded science lab’s shared experiment archive whose filing clerk checks folder addresses using a different rulebook than the storage runner in the basement. An outsider registers a fake lab project with a cleverly folded bookmark tag in its address so the front clerk approves it as safe while the basement runner follows the hidden upward-staircase directions straight out of the lab folder into the building’s private cloud-credential cabinet.",
      "technicalCue": "INITIAL ACCESS: Unauthenticated Experiment Creation with URI Fragment Bypass (CVE-2024-2928) -> EXFIL & IMPACT: Run Registration & Model Version Source Traversal (/mlflow/model-versions/create) -> CREDENTIAL ACCESS: Arbitrary Host File Read via GET /model-versions/get-artifact & S3 Model Store Pivot",
      "storyMappings": [
        {
          "storyTerm": "Unguarded Lab Experiment Archive",
          "technicalTerm": "Unauthenticated MLflow Tracking Server Exposed on Port 5000",
          "tone": "sky"
        },
        {
          "storyTerm": "Cleverly Folded Bookmark Tag",
          "technicalTerm": "Crafted artifact_location URI Fragment (#) Bypass (CVE-2024-2928)",
          "tone": "rose"
        },
        {
          "storyTerm": "Two Disagreeing Rulebooks",
          "technicalTerm": "urllib.parseurl Validation vs Downstream Local File Path Resolver",
          "tone": "amber"
        },
        {
          "storyTerm": "Private Cloud-Credential Cabinet",
          "technicalTerm": "Arbitrary Host Read of ~/.aws/credentials via /model-versions/get-artifact",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ai-mlflow-lfi-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Unguarded Lab Experiment Archive",
          "subtitle": "Unauthenticated MLflow Tracking Server Exposed on Port 5000",
          "tone": "sky"
        },
        {
          "id": "ai-mlflow-lfi-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Cleverly Folded Bookmark Tag",
          "subtitle": "Crafted artifact_location URI Fragment (#) Bypass…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Desk",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Unauthenticated Experiment Creation with URI Fragment Bypass (CVE-2024-2928)",
          "storyExcerpt": "Walking up to the unlocked experiment archive desk, the outsider creates a brand-new project folder whose storage address hides upward-staircase directions behind a bookmark hash symbol so the front desk…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.uri | contains, \"/ajax-api/2.0/mlflow/experiments/create\")' /var/log/nginx/mlflow_access.json (which invokes or targets the host daemon/process…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Next Logs",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "Run Registration & Model Version Source Traversal (/mlflow/model-versions/create)",
          "storyExcerpt": "Next, the outsider logs a dummy trial inside that rigged project folder and registers a named model edition whose source label points relative to the escaped folder root, anchoring the path straight onto…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.uri | contains, \"/mlflow/model-versions/create\")' /var/log/nginx/mlflow_access.json (which invokes or targets the host daemon/process , jq '. |…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. File",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Arbitrary Host File Read via GET /model-versions/get-artifact & S3 Model Store Pivot",
          "storyExcerpt": "With the rigged model edition registered, the outsider simply asks the archive clerk to hand over the file named credentials from that edition; the clerk obligingly walks into the host’s private cloud…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -k mlflow_file_read -m SYSCALL -sv yes (which executes the technical command / telemetry directive , ausearch -k mlflow_file_read -m SYSCALL -sv yes…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Lab Archive",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Model Cluster",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Path Escape",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928",
      "sectionKey": "step-1",
      "sceneKind": "ai-mlflow-lfi-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Unauthenticated Experiment Creation with URI Fragment Bypass (CVE-2024-2928)",
      "storyCue": "Walking up to the unlocked experiment archive desk, the outsider creates a brand-new project folder whose storage address hides upward-staircase directions behind a bookmark hash symbol so the front desk validator stops reading early and waves the folder through.",
      "technicalCue": "T1190 · INITIAL ACCESS — An external client sends a POST request to /ajax-api/2.0/mlflow/experiments/create on an unauthenticated MLflow Tracking Server (port 5000), supplying an artifact_location URI with a crafted…",
      "storyMappings": [
        {
          "storyTerm": "Creating New Project Folder",
          "technicalTerm": "Unauthenticated POST /ajax-api/2.0/mlflow/experiments/create",
          "tone": "sky"
        },
        {
          "storyTerm": "Bookmark Hash Symbol Trick",
          "technicalTerm": "Crafted artifact_location URI Fragment (#) (CVE-2024-2928)",
          "tone": "rose"
        },
        {
          "storyTerm": "Front Desk Stopping Early",
          "technicalTerm": "Disagreement Between urllib.parseurl Check & File Path Resolver",
          "tone": "amber"
        },
        {
          "storyTerm": "Archive Authentication Gate",
          "technicalTerm": "Upgrading MLflow v2.11.3+ & Enabling basic-auth / OIDC Proxy",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-mlflow-lfi-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Creating New Project Folder",
          "subtitle": "Unauthenticated POST /ajax-api/2.0/mlflow/experiments/create",
          "tone": "sky"
        },
        {
          "id": "ai-mlflow-lfi-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Bookmark Hash Symbol Trick",
          "subtitle": "Crafted artifact_location URI Fragment (#) (CVE-2024-2928)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Creating New Project Folder",
          "storyExcerpt": "Walking up to the unlocked experiment archive desk, the outsider creates a brand-new project folder whose storage address hides upward-staircase directions behind a bookmark hash symbol so the…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.uri | contains, \"/ajax-api/2.0/mlflow/experiments/create\")' /var/log/nginx/mlflow_access.json (which invokes or targets the host daemon/process…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Hash",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Bookmark Hash Symbol Trick",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses bookmark hash symbol trick to advance toward front desk stopping early.",
          "technicalParallel": "An external client sends a POST request to /ajax-api/2.0/mlflow/experiments/create on an unauthenticated MLflow Tracking Server (port 5000), supplying an artifact_location URI with a crafted URL fragment…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Desk",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Archive Authentication Gate",
          "storyExcerpt": "Behind the scenes, archive authentication gate captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Web Access Log Event 200 (recording VulnerabilityId=CVE-2024-2928 , MLflow URI Fragment Local File Inclusion, Endpoint=POST /ajax-api/2.0/mlflow/experiments/create…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Lab Archive",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Model Cluster",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Path Escape",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928",
      "sectionKey": "step-2",
      "sceneKind": "ai-mlflow-lfi-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "Run Registration & Model Version Source Traversal (/mlflow/model-versions/create)",
      "storyCue": "Next, the outsider logs a dummy trial inside that rigged project folder and registers a named model edition whose source label points relative to the escaped folder root, anchoring the path straight onto the building’s private home directory.",
      "technicalCue": "T1005 · EXFIL & IMPACT — The client creates a run within the crafted experiment (/api/2.0/mlflow/runs/create) and registers a model version via POST /ajax-api/2.0/mlflow/model-versions/create whose source parameter…",
      "storyMappings": [
        {
          "storyTerm": "Logging a Dummy Trial",
          "technicalTerm": "POST /api/2.0/mlflow/runs/create Inside Crafted Experiment",
          "tone": "sky"
        },
        {
          "storyTerm": "Registering Named Model Edition",
          "technicalTerm": "POST /ajax-api/2.0/mlflow/model-versions/create Source Traversal",
          "tone": "rose"
        },
        {
          "storyTerm": "Escaped Folder Root Anchor",
          "technicalTerm": "Relative source Parameter Resolving Outside Experiment Directory",
          "tone": "amber"
        },
        {
          "storyTerm": "Isolated Bucket Sandbox",
          "technicalTerm": "Running --serve-artifacts With Isolated S3/GCS Backend & Read-Only OS",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-mlflow-lfi-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Logging a Dummy Trial",
          "subtitle": "POST /api/2.0/mlflow/runs/create Inside Crafted Experiment",
          "tone": "sky"
        },
        {
          "id": "ai-mlflow-lfi-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Registering Named Model Edition",
          "subtitle": "POST /ajax-api/2.0/mlflow/model-versions/create Source Traversal",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Next Logs",
          "stageTag": "STEP 02 · SETUP",
          "title": "Logging a Dummy Trial",
          "storyExcerpt": "Next, the outsider logs a dummy trial inside that rigged project folder and registers a named model edition whose source label points relative to the escaped folder root, anchoring the path…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.uri | contains, \"/mlflow/model-versions/create\")' /var/log/nginx/mlflow_access.json (which invokes or targets the host daemon/process , jq '. |…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Root",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Registering Named Model Edition",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses registering named model edition to advance toward escaped folder root anchor.",
          "technicalParallel": "The client creates a run within the crafted experiment (/api/2.0/mlflow/runs/create) and registers a model version via POST /ajax-api/2.0/mlflow/model-versions/create whose source parameter points…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Root",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Isolated Bucket Sandbox",
          "storyExcerpt": "Behind the scenes, isolated bucket sandbox captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Web Access Log Event 200 (recording ApiEndpoint=POST /ajax-api/2.0/mlflow/model-versions/create, LinkedRunId=8f91a2c4e0194810b92a, ResolvedLocalPath=/root/.aws/credentials &…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Lab Archive",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Model Cluster",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Path Escape",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1005"
    },
    "step-3": {
      "scenarioId": "ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928",
      "sectionKey": "step-3",
      "sceneKind": "ai-mlflow-lfi-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Arbitrary Host File Read via GET /model-versions/get-artifact & S3 Model Store Pivot",
      "storyCue": "With the rigged model edition registered, the outsider simply asks the archive clerk to hand over the file named credentials from that edition; the clerk obligingly walks into the host’s private cloud locker and hands back the keys to the entire production model warehouse.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — When GET /model-versions/get-artifact?name=audit-model&version=1&path=credentials is invoked, MLflow serves the host ~/.aws/credentials file over HTTP, which the attacker then uses to access…",
      "storyMappings": [
        {
          "storyTerm": "Requesting Named Credentials File",
          "technicalTerm": "GET /model-versions/get-artifact?name=audit-model&version=1&path=credentials",
          "tone": "rose"
        },
        {
          "storyTerm": "Host Private Cloud Locker",
          "technicalTerm": "Host ~/.aws/credentials File Served Directly Over HTTP",
          "tone": "amber"
        },
        {
          "storyTerm": "Production Model Warehouse Pivot",
          "technicalTerm": "Lateral Access to Production S3 Model Registry Bucket",
          "tone": "sky"
        },
        {
          "storyTerm": "Ingress Fragment Blocker",
          "technicalTerm": "Blocking %23../ Traversal at WAF & Replacing Static Keys With IRSA",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-mlflow-lfi-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Requesting Named Credentials File",
          "subtitle": "GET /model-versions/get-artifact?name=audit-model&version=1&pat…",
          "tone": "rose"
        },
        {
          "id": "ai-mlflow-lfi-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Host Private Cloud Locker",
          "subtitle": "Host ~/.aws/credentials File Served Directly Over HTTP",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. File",
          "stageTag": "STEP 03 · SETUP",
          "title": "Requesting Named Credentials File",
          "storyExcerpt": "With the rigged model edition registered, the outsider simply asks the archive clerk to hand over the file named credentials from that edition; the clerk obligingly walks into the host’s…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -k mlflow_file_read -m SYSCALL -sv yes (which executes the technical command / telemetry directive , ausearch -k mlflow_file_read -m SYSCALL -sv yes…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Host",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Host Private Cloud Locker",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses host private cloud locker to advance toward production model warehouse pivot.",
          "technicalParallel": "When GET /model-versions/get-artifact?name=audit-model&version=1&path=credentials is invoked, MLflow serves the host ~/.aws/credentials file over HTTP, which the attacker then uses to access the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Asks Hand",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Ingress Fragment Blocker",
          "storyExcerpt": "Behind the scenes, ingress fragment blocker captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 257 (recording ArtifactEndpoint=GET /model-versions/get-artifact, AccessedHostFile=/root/.aws/credentials , opened by gunicorn worker PID 4120, DownstreamImpact=Compromise…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Lab Archive",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Model Cluster",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Path Escape",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.001"
    }
  },
  "ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit": {
    "briefing": {
      "scenarioId": "ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit",
      "sectionKey": "briefing",
      "sceneKind": "ai-ollama-vllm-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1518",
      "title": "Exposed Ollama Inference API (:11434) Rogue Registry Pull & Modelfile… — Story-to-Technical Overview",
      "storyCue": "Imagine a private company AI library whose automated book-receiving counter was accidentally bolted onto the outer street wall with no library card check. An outsider walks up to read the entire private catalog of custom handbooks, orders the library robot to fetch a counterfeit book from their own shady print shop across town, and relabels that counterfeit copy under the company’s official finance handbook title so every employee receives poisoned answers.",
      "technicalCue": "CREDENTIAL ACCESS: Unauthenticated Model Enumeration via GET /api/tags & POST /api/show -> INITIAL ACCESS: Arbitrary Registry Model Pull & SSRF via POST /api/pull -> EXFIL & IMPACT: Production Model Alias Overwrite via POST /api/create & Prompt Backdoor Audit",
      "storyMappings": [
        {
          "storyTerm": "Street-Facing Library Counter",
          "technicalTerm": "Unauthenticated Ollama Inference API Bound to 0.0.0.0:11434",
          "tone": "amber"
        },
        {
          "storyTerm": "Reading Private Custom Catalog",
          "technicalTerm": "GET /api/tags & POST /api/show Leaking Prompts & LoRA Paths",
          "tone": "sky"
        },
        {
          "storyTerm": "Fetching From Shady Print Shop",
          "technicalTerm": "POST /api/pull SSRF Pulling Tampered GGUF Blobs From Rogue Registry",
          "tone": "rose"
        },
        {
          "storyTerm": "Relabeling Official Finance Handbook",
          "technicalTerm": "POST /api/create Overwriting Production Model Alias (OWASP LLM04)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ai-ollama-vllm-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Street-Facing Library Counter",
          "subtitle": "Unauthenticated Ollama Inference API Bound to 0.0.0.0:11434",
          "tone": "amber"
        },
        {
          "id": "ai-ollama-vllm-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Reading Private Custom Catalog",
          "subtitle": "GET /api/tags & POST /api/show Leaking Prompts & LoRA Paths",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Asks",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Unauthenticated Model Enumeration via GET /api/tags & POST /api/show",
          "storyExcerpt": "Stepping up to the unguarded street-facing counter, the outsider asks the library kiosk for a full catalog printout and detailed cover cards, exposing proprietary fine-tuned handbooks, hidden staff…",
          "technicalParallel": "Under the hood, the observed step executes ss -tulpn | grep 11434 (which executes the technical command / telemetry directive , ss -tulpn | grep 11434 via System / Runtime Execution Interface, passing…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Slip",
          "stageTag": "STAGE 02 · INITIAL ACCESS",
          "title": "Arbitrary Registry Model Pull & SSRF via POST /api/pull",
          "storyExcerpt": "Next, the outsider hands the library robot a special acquisition slip pointing to their own external print shop, causing the trusted internal server to dial out across the corporate fence and stock…",
          "technicalParallel": "Under the hood, the observed step executes journalctl -u ollama --no-pager | grep \"/api/pull\" (which executes the technical command / telemetry directive , journalctl -u ollama --no-pager | grep…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Shop",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Production Model Alias Overwrite via POST /api/create & Prompt Backdoor Audit",
          "storyExcerpt": "Finally, the outsider submits a rebinding order that pastes the company’s official finance-assistant spine label onto the tampered volume with hidden behavioral instructions tucked inside, silently…",
          "technicalParallel": "Under the hood, the observed step executes cat /usr/share/ollama/.ollama/models/manifests/registry.ollama.ai/library/corp-finance-assistant/latest | jq . (which executes the technical command / telemetry…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "GPU Cluster",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Catalog Proxy",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Model Pull",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit",
      "sectionKey": "step-1",
      "sceneKind": "ai-ollama-vllm-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Unauthenticated Model Enumeration via GET /api/tags & POST /api/show",
      "storyCue": "Stepping up to the unguarded street-facing counter, the outsider asks the library kiosk for a full catalog printout and detailed cover cards, exposing proprietary fine-tuned handbooks, hidden staff system instructions, and adapter locations.",
      "technicalCue": "T1518 · CREDENTIAL ACCESS — When an Ollama inference server is bound to OLLAMA_HOST=0.0.0.0:11434 without an authenticating reverse proxy, an external client calls GET /api/tags and POST /api/show to enumerate loaded…",
      "storyMappings": [
        {
          "storyTerm": "Unguarded Library Kiosk",
          "technicalTerm": "Ollama Server Listening on OLLAMA_HOST=0.0.0.0:11434 Without Proxy",
          "tone": "amber"
        },
        {
          "storyTerm": "Catalog Printout & Cover Cards",
          "technicalTerm": "Unauthenticated GET /api/tags & POST /api/show Enumeration",
          "tone": "rose"
        },
        {
          "storyTerm": "Proprietary Handbooks & Instructions",
          "technicalTerm": "Leaked System Prompts, Fine-Tuned LoRA Paths & GGUF SHA-256 Digests",
          "tone": "sky"
        },
        {
          "storyTerm": "Loopback & Card-Reader Lock",
          "technicalTerm": "Binding OLLAMA_HOST=127.0.0.1:11434 Behind mTLS / API-Key Gateway",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-ollama-vllm-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Unguarded Library Kiosk",
          "subtitle": "Ollama Server Listening on OLLAMA_HOST=0.0.0.0:11434 Without…",
          "tone": "amber"
        },
        {
          "id": "ai-ollama-vllm-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Catalog Printout & Cover Cards",
          "subtitle": "Unauthenticated GET /api/tags & POST /api/show Enumeration",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Asks",
          "stageTag": "STEP 01 · SETUP",
          "title": "Unguarded Library Kiosk",
          "storyExcerpt": "Stepping up to the unguarded street-facing counter, the outsider asks the library kiosk for a full catalog printout and detailed cover cards, exposing proprietary fine-tuned handbooks, hidden…",
          "technicalParallel": "Under the hood, the observed step executes ss -tulpn | grep 11434 (which executes the technical command / telemetry directive , ss -tulpn | grep 11434 via System / Runtime Execution Interface, passing…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Catalog Printout & Cover Cards",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses catalog printout & cover cards to advance toward proprietary handbooks & instructions.",
          "technicalParallel": "When an Ollama inference server is bound to OLLAMA_HOST=0.0.0.0:11434 without an authenticating reverse proxy, an external client calls GET /api/tags and POST /api/show to enumerate loaded enterprise…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Card-reader Lock",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Loopback & Card-Reader Lock",
          "storyExcerpt": "Behind the scenes, loopback & card-reader lock captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Web Access Log Event 200 (recording ExposedService=Ollama Inference API , TCP Port 11434, OLLAMA_HOST=0.0.0.0, EnumeratedEndpoint=GET /api/tags & POST /api/show, LeakedConfiguration=System…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "GPU Cluster",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Catalog Proxy",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Model Pull",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1518"
    },
    "step-2": {
      "scenarioId": "ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit",
      "sectionKey": "step-2",
      "sceneKind": "ai-ollama-vllm-step-2",
      "stageBadge": "STEP #2 · INITIAL ACCESS",
      "title": "Arbitrary Registry Model Pull & SSRF via POST /api/pull",
      "storyCue": "Next, the outsider hands the library robot a special acquisition slip pointing to their own external print shop, causing the trusted internal server to dial out across the corporate fence and stock tampered model weight bundles right onto the local shelves.",
      "technicalCue": "T1608.001 · INITIAL ACCESS — The external caller invokes POST /api/pull with a custom registry host URL ({\"name\":\"registry.attacker-infra.net/library/poisoned-llm:v1\"}), causing the Ollama server daemon to initiate…",
      "storyMappings": [
        {
          "storyTerm": "Special Acquisition Slip",
          "technicalTerm": "POST /api/pull Specifying Custom Attacker Registry Host URL",
          "tone": "rose"
        },
        {
          "storyTerm": "Server Dialing Out Across Fence",
          "technicalTerm": "Server-Side Request Forgery (SSRF) to External Rogue Registry",
          "tone": "amber"
        },
        {
          "storyTerm": "Tampered Weight Bundles on Shelves",
          "technicalTerm": "Untrusted GGUF Blobs Saved Under ~/.ollama/models/blobs/",
          "tone": "sky"
        },
        {
          "storyTerm": "Outbound Registry Fence",
          "technicalTerm": "Egress Firewall Allowlisting Approved Registries & Blocking /api/pull",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-ollama-vllm-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Special Acquisition Slip",
          "subtitle": "POST /api/pull Specifying Custom Attacker Registry Host URL",
          "tone": "rose"
        },
        {
          "id": "ai-ollama-vllm-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Server Dialing Out Across Fence",
          "subtitle": "Server-Side Request Forgery (SSRF) to External Rogue Registry",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Slip",
          "stageTag": "STEP 02 · SETUP",
          "title": "Special Acquisition Slip",
          "storyExcerpt": "Next, the outsider hands the library robot a special acquisition slip pointing to their own external print shop, causing the trusted internal server to dial out across the corporate fence and…",
          "technicalParallel": "Under the hood, the observed step executes journalctl -u ollama --no-pager | grep \"/api/pull\" (which executes the technical command / telemetry directive , journalctl -u ollama --no-pager | grep…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Out",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Server Dialing Out Across Fence",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses server dialing out across fence to advance toward tampered weight bundles on shelves.",
          "technicalParallel": "The external caller invokes POST /api/pull with a custom registry host URL ({\"name\":\"registry.attacker-infra.net/library/poisoned-llm:v1\"}), causing the Ollama server daemon to initiate outbound HTTPS…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Next Slip",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Outbound Registry Fence",
          "storyExcerpt": "Behind the scenes, outbound registry fence captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording AbusedEndpoint=POST /api/pull , Custom Registry SSRF & Untrusted Blob Ingestion, OutboundConnection=ollama ->…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "GPU Cluster",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Catalog Proxy",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Model Pull",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1608.001"
    },
    "step-3": {
      "scenarioId": "ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit",
      "sectionKey": "step-3",
      "sceneKind": "ai-ollama-vllm-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Production Model Alias Overwrite via POST /api/create & Prompt Backdoor Audit",
      "storyCue": "Finally, the outsider submits a rebinding order that pastes the company’s official finance-assistant spine label onto the tampered volume with hidden behavioral instructions tucked inside, silently corrupting every future answer until auditors lock the shelves read-only.",
      "technicalCue": "T1565.001 · EXFIL & IMPACT — By calling POST /api/create with {\"name\":\"corp-finance-assistant:latest\",\"modelfile\":\"FROM ...",
      "storyMappings": [
        {
          "storyTerm": "Rebinding Order With Official Label",
          "technicalTerm": "POST /api/create Overwriting corp-finance-assistant:latest Manifest",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden Behavioral Instructions",
          "technicalTerm": "Embedded Malicious SYSTEM Prompt & Poisoned Weights (LLM04)",
          "tone": "amber"
        },
        {
          "storyTerm": "Modified Shelf Index Card",
          "technicalTerm": "Tampered ~/.ollama/models/manifests/.../latest Tracked by auditd",
          "tone": "sky"
        },
        {
          "storyTerm": "Read-Only Locked Shelves",
          "technicalTerm": "Mounting ~/.ollama/models Read-Only (ro) With Signed Digests",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-ollama-vllm-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Rebinding Order With Official Label",
          "subtitle": "POST /api/create Overwriting corp-finance-assistant:latest…",
          "tone": "rose"
        },
        {
          "id": "ai-ollama-vllm-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Hidden Behavioral Instructions",
          "subtitle": "Embedded Malicious SYSTEM Prompt & Poisoned Weights (LLM04)",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto",
          "stageTag": "STEP 03 · SETUP",
          "title": "Rebinding Order With Official Label",
          "storyExcerpt": "Finally, the outsider submits a rebinding order that pastes the company’s official finance-assistant spine label onto the tampered volume with hidden behavioral instructions tucked inside…",
          "technicalParallel": "Under the hood, the observed step executes cat /usr/share/ollama/.ollama/models/manifests/registry.ollama.ai/library/corp-finance-assistant/latest | jq . (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Card",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Hidden Behavioral Instructions",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses hidden behavioral instructions to advance toward modified shelf index card.",
          "technicalParallel": "By calling POST /api/create with {\"name\":\"corp-finance-assistant:latest\",\"modelfile\":\"FROM ...",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Card",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Read-Only Locked Shelves",
          "storyExcerpt": "Behind the scenes, read-only locked shelves captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 257 (recording AbusedEndpoint=POST /api/create , Production Model Tag Overwrite, ModifiedManifest=manifests/registry.ollama.ai/library/corp-finance-assistant/latest…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "GPU Cluster",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Catalog Proxy",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Model Pull",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1565.001"
    }
  },
  "ai-pytorch-pickle-torch-load-supply-chain-forensics": {
    "briefing": {
      "scenarioId": "ai-pytorch-pickle-torch-load-supply-chain-forensics",
      "sectionKey": "briefing",
      "sceneKind": "ai-pytorch-pickle-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.002",
      "title": "PyTorch Pickle Model Checkpoint Deserialization Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a research lab downloading a shared suitcase of pre-trained brain weights from a public model exchange. Tucked inside the suitcase lining is a hidden wind-up instruction card that springs open the very instant an engineer unzips the suitcase using an older loading table without a safety tray, launching covert workshop commands before the model weights are even examined.",
      "technicalCue": "INITIAL ACCESS: PyTorch ZIP Archive Inspection & Pickle Opcode Disassembly (pickletools / fickling) -> EXECUTION: Legacy torch.load() Invocation Without weights_only=True Triggering __reduce__() -> DEFENSE EVASION: Runtime eBPF / Sysmon Detection of Python Inference Worker Spawning Subprocesses",
      "storyMappings": [
        {
          "storyTerm": "Shared Suitcase of Brain Weights",
          "technicalTerm": "PyTorch Model Checkpoint Archive (.pt / .bin ZIP with archive/data.pkl)",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden Wind-Up Instruction Card",
          "technicalTerm": "Embedded Python Pickle STACK_GLOBAL + REDUCE Opcodes (AML.T0010)",
          "tone": "rose"
        },
        {
          "storyTerm": "Older Loading Table Without Safety Tray",
          "technicalTerm": "Legacy torch.load() Called Without weights_only=True Parameter",
          "tone": "amber"
        },
        {
          "storyTerm": "Workshop Floor Motion Sensor",
          "technicalTerm": "Runtime eBPF / Sysmon Catching Python Inference Worker Spawning Shells",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ai-pytorch-pickle-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Shared Suitcase of Brain Weights",
          "subtitle": "PyTorch Model Checkpoint Archive (.pt / .bin ZIP with…",
          "tone": "sky"
        },
        {
          "id": "ai-pytorch-pickle-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Hidden Wind-Up Instruction Card",
          "subtitle": "Embedded Python Pickle STACK_GLOBAL + REDUCE Opcodes (AML.T0010)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto Lab",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "PyTorch ZIP Archive Inspection & Pickle Opcode Disassembly (pickletools / fickling)",
          "storyExcerpt": "Before putting the downloaded suitcase onto the lab bench, a cautious inspector opens the outer zipper and reads the packing manifest line by line, discovering wind-up command gears hidden right beside…",
          "technicalParallel": "Under the hood, the observed step executes python3 -m pickletools -a archive/data.pkl | grep -E \"GLOBAL|STACK_GLOBAL|REDUCE\" (which inspects or executes AI/ML infrastructure operations , python3 -m…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Wind-up Card",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Legacy torch.load() Invocation Without weights_only=True Triggering __reduce__()",
          "storyExcerpt": "On an unprotected training bench, the engineer places the suitcase onto the legacy automatic unpacker without flipping the weights-only safety lock, causing the hidden wind-up card to snap open and…",
          "technicalParallel": "Under the hood, the observed step executes python3 -c \"import torch; torch.load('model_weights.pt', weights_only=True)\" (which inspects or executes AI/ML infrastructure operations , python3 -c \"import…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Tray",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Runtime eBPF / Sysmon Detection of Python Inference Worker Spawning Subprocesses",
          "storyExcerpt": "Even when the saboteur disguises the wind-up card using clever mirror chains to fool front-desk X-ray scanners, the lab’s runtime motion alarm fires the instant the quiet math-inference worker…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -k python_pickle_exec -i (which executes the technical command / telemetry directive , ausearch -k python_pickle_exec -i via System / Runtime Execution…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Weight Crate",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Training Pod",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Pickle Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ai-pytorch-pickle-torch-load-supply-chain-forensics",
      "sectionKey": "step-1",
      "sceneKind": "ai-pytorch-pickle-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "PyTorch ZIP Archive Inspection & Pickle Opcode Disassembly (pickletools / fickling)",
      "storyCue": "Before putting the downloaded suitcase onto the lab bench, a cautious inspector opens the outer zipper and reads the packing manifest line by line, discovering wind-up command gears hidden right beside the harmless numeric weight pouches.",
      "technicalCue": "T1195.002 · INITIAL ACCESS — Standard PyTorch .pt and .bin checkpoints are ZIP archives containing tensor storage files alongside archive/data.pkl.",
      "storyMappings": [
        {
          "storyTerm": "Outer Suitcase Zipper",
          "technicalTerm": "Standard PyTorch .pt / .bin ZIP Archive Containing archive/data.pkl",
          "tone": "sky"
        },
        {
          "storyTerm": "Inspector Reading Manifest",
          "technicalTerm": "Static Disassembly via python3 -m pickletools or Trail of Bits fickling",
          "tone": "emerald"
        },
        {
          "storyTerm": "Hidden Wind-Up Command Gears",
          "technicalTerm": "Malicious Pickle STACK_GLOBAL & REDUCE Opcodes Calling os.system",
          "tone": "rose"
        },
        {
          "storyTerm": "Harmless Numeric Weight Pouches",
          "technicalTerm": "Legitimate Tensor Storage Files Inside Checkpoint Archive",
          "tone": "amber"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-pytorch-pickle-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Outer Suitcase Zipper",
          "subtitle": "Standard PyTorch .pt / .bin ZIP Archive Containing…",
          "tone": "sky"
        },
        {
          "id": "ai-pytorch-pickle-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Inspector Reading Manifest",
          "subtitle": "Static Disassembly via python3 -m pickletools or Trail of Bits…",
          "tone": "emerald"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto Lab",
          "stageTag": "STEP 01 · SETUP",
          "title": "Outer Suitcase Zipper",
          "storyExcerpt": "Before putting the downloaded suitcase onto the lab bench, a cautious inspector opens the outer zipper and reads the packing manifest line by line, discovering wind-up command gears hidden…",
          "technicalParallel": "Under the hood, the observed step executes python3 -m pickletools -a archive/data.pkl | grep -E \"GLOBAL|STACK_GLOBAL|REDUCE\" (which inspects or executes AI/ML infrastructure operations , python3 -m…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Wind-up",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Inspector Reading Manifest",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses inspector reading manifest to advance toward hidden wind-up command gears.",
          "technicalParallel": "Standard PyTorch .pt and .bin checkpoints are ZIP archives containing tensor storage files alongside archive/data.pkl.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Wind-up",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Harmless Numeric Weight Pouches",
          "storyExcerpt": "Behind the scenes, harmless numeric weight pouches captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 10 (recording ModelArchive=model_weights.pt , archive/data.pkl, DangerousOpcodes=STACK_GLOBAL , 'posix', 'system' + REDUCE , 0x52, AtlasTechnique=MITRE ATLAS AML.T0010…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Weight Crate",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Training Pod",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Pickle Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1195.002"
    },
    "step-2": {
      "scenarioId": "ai-pytorch-pickle-torch-load-supply-chain-forensics",
      "sectionKey": "step-2",
      "sceneKind": "ai-pytorch-pickle-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Legacy torch.load() Invocation Without weights_only=True Triggering __reduce__()",
      "storyCue": "On an unprotected training bench, the engineer places the suitcase onto the legacy automatic unpacker without flipping the weights-only safety lock, causing the hidden wind-up card to snap open and execute its command before the model weights even reach the table.",
      "technicalCue": "T1203 · EXECUTION — When an inference or fine-tuning script calls torch.load(\"model_weights.pt\") without weights_only=True, Python pickle.Unpickler executes the REDUCE opcode immediately during deserialization…",
      "storyMappings": [
        {
          "storyTerm": "Legacy Automatic Unpacker",
          "technicalTerm": "torch.load(\"model_weights.pt\") Invoked Without weights_only=True",
          "tone": "amber"
        },
        {
          "storyTerm": "Wind-Up Card Snapping Open",
          "technicalTerm": "Python pickle.Unpickler Executing __reduce__() During Deserialization",
          "tone": "rose"
        },
        {
          "storyTerm": "Before Weights Reach Table",
          "technicalTerm": "Code Execution Completing Prior to Model state_dict Inspection",
          "tone": "sky"
        },
        {
          "storyTerm": "Safe Tensor Alternative",
          "technicalTerm": "Enforcing safetensors Format or torch.load(..., weights_only=True)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-pytorch-pickle-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Legacy Automatic Unpacker",
          "subtitle": "torch.load(\"model_weights.pt\") Invoked Without weights_only=True",
          "tone": "amber"
        },
        {
          "id": "ai-pytorch-pickle-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Wind-Up Card Snapping Open",
          "subtitle": "Python pickle.Unpickler Executing __reduce__() During…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto Lock",
          "stageTag": "STEP 02 · SETUP",
          "title": "Legacy Automatic Unpacker",
          "storyExcerpt": "On an unprotected training bench, the engineer places the suitcase onto the legacy automatic unpacker without flipping the weights-only safety lock, causing the hidden wind-up card to snap open…",
          "technicalParallel": "Under the hood, the observed step executes python3 -c \"import torch; torch.load('model_weights.pt', weights_only=True)\" (which inspects or executes AI/ML infrastructure operations , python3 -c \"import…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wind-up Card",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Wind-Up Card Snapping Open",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses wind-up card snapping open to advance toward before weights reach table.",
          "technicalParallel": "When an inference or fine-tuning script calls torch.load(\"model_weights.pt\") without weights_only=True, Python pickle.Unpickler executes the REDUCE opcode immediately during deserialization, before the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Safe",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Safe Tensor Alternative",
          "storyExcerpt": "Behind the scenes, safe tensor alternative captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording ParentInferenceProcess=python3 inference_server.py , PID 8810, UnpicklerHook=pickle._Unpickler.load_reduce, -> posix.system, MitigationCheck=torch.load...…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Weight Crate",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Training Pod",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Pickle Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1203"
    },
    "step-3": {
      "scenarioId": "ai-pytorch-pickle-torch-load-supply-chain-forensics",
      "sectionKey": "step-3",
      "sceneKind": "ai-pytorch-pickle-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Runtime eBPF / Sysmon Detection of Python Inference Worker Spawning Subprocesses",
      "storyCue": "Even when the saboteur disguises the wind-up card using clever mirror chains to fool front-desk X-ray scanners, the lab’s runtime motion alarm fires the instant the quiet math-inference worker unexpectedly reaches for a power drill or dials an outside telephone line.",
      "technicalCue": "T1027 · DEFENSE EVASION — Even if a malicious pickle payload uses obfuscated builtins.getattr chains to bypass static pickle scanners, runtime monitoring catches the Python inference worker process invoking sys_execve…",
      "storyMappings": [
        {
          "storyTerm": "Clever Mirror-Chain Disguise",
          "technicalTerm": "Obfuscated builtins.getattr Pickle Chains Evading Static Scanners",
          "tone": "amber"
        },
        {
          "storyTerm": "Quiet Math-Inference Worker",
          "technicalTerm": "Python Model Inference / Fine-Tuning Worker Process",
          "tone": "sky"
        },
        {
          "storyTerm": "Reaching for Drill or Outside Phone",
          "technicalTerm": "Unexpected sys_execve Subprocess Spawn or Outbound Network Socket",
          "tone": "rose"
        },
        {
          "storyTerm": "Lab Runtime Motion Alarm",
          "technicalTerm": "eBPF (Tetragon / Falco) & Sysmon Event ID 1 / 3 Runtime Telemetry",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-pytorch-pickle-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Clever Mirror-Chain Disguise",
          "subtitle": "Obfuscated builtins.getattr Pickle Chains Evading Static…",
          "tone": "amber"
        },
        {
          "id": "ai-pytorch-pickle-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Quiet Math-Inference Worker",
          "subtitle": "Python Model Inference / Fine-Tuning Worker Process",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Even Wind-up",
          "stageTag": "STEP 03 · SETUP",
          "title": "Clever Mirror-Chain Disguise",
          "storyExcerpt": "Even when the saboteur disguises the wind-up card using clever mirror chains to fool front-desk X-ray scanners, the lab’s runtime motion alarm fires the instant the quiet math-inference worker…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -k python_pickle_exec -i (which executes the technical command / telemetry directive , ausearch -k python_pickle_exec -i via System / Runtime Execution…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Math-inference",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Quiet Math-Inference Worker",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses quiet math-inference worker to advance toward reaching for drill or outside phone.",
          "technicalParallel": "Even if a malicious pickle payload uses obfuscated builtins.getattr chains to bypass static pickle scanners, runtime monitoring catches the Python inference worker process invoking sys_execve or…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Even Wind-up",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Lab Runtime Motion Alarm",
          "storyExcerpt": "Behind the scenes, lab runtime motion alarm captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 42 (recording RuntimeRule=Falco: Python AI Inference Process Spawned Shell, ParentProcess=python3 , Model Loader, RecommendedFormat=HuggingFace .safetensors under T1027)…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Weight Crate",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Training Pod",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Pickle Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1027"
    }
  },
  "ai-rag-indirect-prompt-injection-mcp-tool-audit": {
    "briefing": {
      "scenarioId": "ai-rag-indirect-prompt-injection-mcp-tool-audit",
      "sectionKey": "briefing",
      "sceneKind": "ai-rag-mcp-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Indirect Prompt Injection via RAG Vector Retrieval & Agent/MCP Tool Audit — Story-to-Technical Overview",
      "storyCue": "Imagine an executive assistant who reads outside resumes from a shared filing cabinet and has direct access to internal company tools. An outsider slips invisible margin notes onto a harmless-looking resume instructing the assistant to ignore their boss, secretly look up private customer folders through an internal tool, and mail the stolen answers outside disguised as a tiny decorative picture link, until the company’s strict mailroom gate blocks the hidden link.",
      "technicalCue": "INITIAL ACCESS: Untrusted Document Embedding & Top-K Similarity Retrieval from Vector Database -> EXECUTION: Unauthorized Agent Tool Call Generation (MCP tool_calls JSON Invocation) -> EXFIL & IMPACT: Deterministic Policy Gate Interception & Outbound Markdown Image/Link Exfiltration Audit",
      "storyMappings": [
        {
          "storyTerm": "Shared Filing Cabinet Resume",
          "technicalTerm": "Untrusted External Document Embedded & Retrieved via RAG Vector Search",
          "tone": "sky"
        },
        {
          "storyTerm": "Invisible Margin Override Notes",
          "technicalTerm": "Indirect Prompt Injection Payload (OWASP LLM01:2025 / AML.T0051)",
          "tone": "rose"
        },
        {
          "storyTerm": "Secret Internal Tool Lookup",
          "technicalTerm": "Unauthorized Structured MCP tool_calls JSON Invocation (LLM06)",
          "tone": "amber"
        },
        {
          "storyTerm": "Mailroom Gate Blocking Picture Link",
          "technicalTerm": "CSP img-src Policy & AI Gateway Blocking Markdown Image Exfiltration",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ai-rag-mcp-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Shared Filing Cabinet Resume",
          "subtitle": "Untrusted External Document Embedded & Retrieved via RAG…",
          "tone": "sky"
        },
        {
          "id": "ai-rag-mcp-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Invisible Margin Override Notes",
          "subtitle": "Indirect Prompt Injection Payload (OWASP LLM01:2025 / AML.T0051)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Fine-print",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Untrusted Document Embedding & Top-K Similarity Retrieval from Vector Database",
          "storyExcerpt": "An external applicant submits a normal-looking resume or support ticket containing hidden override instructions buried in fine print; the automated librarian indexes that file into the reference cabinets…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.event==\"rag_context_retrieved\") | {query_id, chunk_ids, source_uris}' /var/log/ai-gateway/rag-audit.json (which executes the technical command /…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Page Fine",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Unauthorized Agent Tool Call Generation (MCP tool_calls JSON Invocation)",
          "storyExcerpt": "Reading the poisoned reference page alongside their manager’s genuine question, the confused assistant mistakes the fine print for a direct executive order and fills out a structured work-tool slip…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.finish_reason==\"tool_calls\") | {request_id, tool_name: .tool_calls[].function.name, arguments: .tool_calls[].function.arguments}'…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Tool",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Deterministic Policy Gate Interception & Outbound Markdown Image/Link Exfiltration Audit",
          "storyExcerpt": "After receiving the private customer summary back from the desk, the hidden margin note tries to smuggle the secret text outside by embedding it inside the address of an external decorative picture, but…",
          "technicalParallel": "Under the hood, the observed step executes grep -E \"\\!\\[.*\\]\\(https?://\" /var/log/ai-gateway/response-audit.log , which executes the technical command / telemetry directive , grep -E \"\\!\\[.*\\]\\…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Doc Cabinet",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Tool Agent",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Hidden Note",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ai-rag-indirect-prompt-injection-mcp-tool-audit",
      "sectionKey": "step-1",
      "sceneKind": "ai-rag-mcp-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Untrusted Document Embedding & Top-K Similarity Retrieval from Vector Database",
      "storyCue": "An external applicant submits a normal-looking resume or support ticket containing hidden override instructions buried in fine print; the automated librarian indexes that file into the reference cabinets and later hands the poisoned excerpt straight to the assistant during a routine question.",
      "technicalCue": "T1190 · INITIAL ACCESS — An external document (such as a resume PDF, support ticket, or web page) containing hidden instruction-override directives is chunked, embedded into the vector database, and retrieved into the…",
      "storyMappings": [
        {
          "storyTerm": "Resume with Fine-Print Override",
          "technicalTerm": "Untrusted External Document Carrying Hidden Instruction Directives",
          "tone": "rose"
        },
        {
          "storyTerm": "Automated Reference Librarian",
          "technicalTerm": "RAG Vector Database Chunking, Embedding & Top-K Similarity Retrieval",
          "tone": "sky"
        },
        {
          "storyTerm": "Handing Excerpt to Assistant",
          "technicalTerm": "Injected Untrusted Chunk Loaded Directly Into LLM Context Window",
          "tone": "amber"
        },
        {
          "storyTerm": "Taint-Tracking Provenance Tag",
          "technicalTerm": "Separating Untrusted Retrieved Data From System Instructions",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-rag-mcp-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Resume with Fine-Print Override",
          "subtitle": "Untrusted External Document Carrying Hidden Instruction…",
          "tone": "rose"
        },
        {
          "id": "ai-rag-mcp-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Automated Reference Librarian",
          "subtitle": "RAG Vector Database Chunking, Embedding & Top-K Similarity…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Fine-print",
          "stageTag": "STEP 01 · SETUP",
          "title": "Resume with Fine-Print Override",
          "storyExcerpt": "An external applicant submits a normal-looking resume or support ticket containing hidden override instructions buried in fine print; the automated librarian indexes that file into the…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.event==\"rag_context_retrieved\") | {query_id, chunk_ids, source_uris}' /var/log/ai-gateway/rag-audit.json (which executes the technical command /…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Automated Reference Librarian",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses automated reference librarian to advance toward handing excerpt to assistant.",
          "technicalParallel": "An external document (such as a resume PDF, support ticket, or web page) containing hidden instruction-override directives is chunked, embedded into the vector database, and retrieved into the LLM…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Fine File",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Taint-Tracking Provenance Tag",
          "storyExcerpt": "Behind the scenes, taint-tracking provenance tag captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Application Log Event 1051 (recording RetrievedChunkId=doc_ext_9941#chunk2 , TrustLevel=UNTRUSTED_EXTERNAL, CosineSimilarity=0.892 , Included in Top-K Prompt Context, OwaspCategory=OWASP…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Doc Cabinet",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Tool Agent",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Hidden Note",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "ai-rag-indirect-prompt-injection-mcp-tool-audit",
      "sectionKey": "step-2",
      "sceneKind": "ai-rag-mcp-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Unauthorized Agent Tool Call Generation (MCP tool_calls JSON Invocation)",
      "storyCue": "Reading the poisoned reference page alongside their manager’s genuine question, the confused assistant mistakes the fine print for a direct executive order and fills out a structured work-tool slip requesting sensitive customer records from the internal service desk.",
      "technicalCue": "T1059 · EXECUTION — When the LLM processes the untrusted RAG chunk alongside the user prompt, the injected directive instructs the model to emit a structured tool_calls JSON payload targeting an internal MCP…",
      "storyMappings": [
        {
          "storyTerm": "Confused Executive Assistant",
          "technicalTerm": "LLM Processing Untrusted RAG Context Alongside User Prompt",
          "tone": "sky"
        },
        {
          "storyTerm": "Structured Work-Tool Slip",
          "technicalTerm": "Model-Emitted Structured MCP tool_calls JSON Payload",
          "tone": "rose"
        },
        {
          "storyTerm": "Internal Service Desk Tool",
          "technicalTerm": "Privileged Internal MCP Server Function (e.g., query_customer_records)",
          "tone": "amber"
        },
        {
          "storyTerm": "Least-Privilege Tool Gate",
          "technicalTerm": "Human-in-the-Loop Approval & Prompt-Taint Policy Blocking Auto-Calls",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-rag-mcp-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Confused Executive Assistant",
          "subtitle": "LLM Processing Untrusted RAG Context Alongside User Prompt",
          "tone": "sky"
        },
        {
          "id": "ai-rag-mcp-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Structured Work-Tool Slip",
          "subtitle": "Model-Emitted Structured MCP tool_calls JSON Payload",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Page Fine",
          "stageTag": "STEP 02 · SETUP",
          "title": "Confused Executive Assistant",
          "storyExcerpt": "Reading the poisoned reference page alongside their manager’s genuine question, the confused assistant mistakes the fine print for a direct executive order and fills out a structured work-tool…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.finish_reason==\"tool_calls\") | {request_id, tool_name: .tool_calls[].function.name, arguments: .tool_calls[].function.arguments}'…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Work-tool Slip",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Structured Work-Tool Slip",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses structured work-tool slip to advance toward internal service desk tool.",
          "technicalParallel": "When the LLM processes the untrusted RAG chunk alongside the user prompt, the injected directive instructs the model to emit a structured tool_calls JSON payload targeting an internal MCP server tool…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Desk Tool",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Least-Privilege Tool Gate",
          "storyExcerpt": "Behind the scenes, least-privilege tool gate captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Application Log Event 1052 (recording McpToolInvoked=export_directory_records, ContextTaintStatus=context_tainted_by_untrusted_rag = true, SecurityStandard=NIST AI 100-2 & OWASP LLM06…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Doc Cabinet",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Tool Agent",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Hidden Note",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1059"
    },
    "step-3": {
      "scenarioId": "ai-rag-indirect-prompt-injection-mcp-tool-audit",
      "sectionKey": "step-3",
      "sceneKind": "ai-rag-mcp-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Deterministic Policy Gate Interception & Outbound Markdown Image/Link Exfiltration Audit",
      "storyCue": "After receiving the private customer summary back from the desk, the hidden margin note tries to smuggle the secret text outside by embedding it inside the address of an external decorative picture, but the building’s strict rendering gate strips unknown external images and logs the blocked smuggling attempt.",
      "technicalCue": "T1041 · EXFIL & IMPACT — If the tool output is returned to the model, indirect injection payloads often attempt to exfiltrate the result by rendering an external Markdown image URL (![tracker]…",
      "storyMappings": [
        {
          "storyTerm": "External Decorative Picture Address",
          "technicalTerm": "Exfiltration via Rendered Markdown Image (![tracker](https://...))",
          "tone": "rose"
        },
        {
          "storyTerm": "Smuggled Customer Secret",
          "technicalTerm": "Tool Output Encoded Inside Query Parameters of External Image URL",
          "tone": "amber"
        },
        {
          "storyTerm": "Strict Building Rendering Gate",
          "technicalTerm": "Content-Security-Policy (img-src self) & AI Gateway Egress Filter",
          "tone": "sky"
        },
        {
          "storyTerm": "Blocked Smuggling Alert",
          "technicalTerm": "IDS / AI Gateway Telemetry Logging Blocked Outbound Markdown Leak",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-rag-mcp-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "External Decorative Picture Address",
          "subtitle": "Exfiltration via Rendered Markdown Image…",
          "tone": "rose"
        },
        {
          "id": "ai-rag-mcp-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Smuggled Customer Secret",
          "subtitle": "Tool Output Encoded Inside Query Parameters of External Image…",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Back Desk",
          "stageTag": "STEP 03 · SETUP",
          "title": "External Decorative Picture Address",
          "storyExcerpt": "After receiving the private customer summary back from the desk, the hidden margin note tries to smuggle the secret text outside by embedding it inside the address of an external decorative…",
          "technicalParallel": "Under the hood, the observed step executes grep -E \"\\!\\[.*\\]\\(https?://\" /var/log/ai-gateway/response-audit.log , which executes the technical command / telemetry directive , grep -E \"\\!\\[.*\\]\\…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Gate",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Smuggled Customer Secret",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses smuggled customer secret to advance toward strict building rendering gate.",
          "technicalParallel": "If the tool output is returned to the model, indirect injection payloads often attempt to exfiltrate the result by rendering an external Markdown image URL (![tracker]…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gate",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Blocked Smuggling Alert",
          "storyExcerpt": "Behind the scenes, blocked smuggling alert captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in IDS Alert Event 1053 (recording GuardrailDecision=BLOCKED , Tainted Context Policy Enforcement, AtlasTechnique=MITRE ATLAS AML.T0051 & AML.T0048, DefensiveControl=Deterministic Taint…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Doc Cabinet",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Tool Agent",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Hidden Note",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1041"
    }
  },
  "ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022": {
    "briefing": {
      "scenarioId": "ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022",
      "sectionKey": "briefing",
      "sceneKind": "ai-shadowray-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1046",
      "title": "Ray AI Framework Unauthenticated Jobs API & GPU Cluster Forensics… — Story-to-Technical Overview",
      "storyCue": "Imagine a massive supercomputer factory floor packed with high-speed graphics engines whose central job-dispatch booth was left facing the street with no badge reader at all. An outsider walks straight up to the dispatch window to inspect every running machine, hands in a custom work order that immediately executes on the factory floor, and empties the sticky notes pinned beside the workers containing private model blueprints and cloud vault keys.",
      "technicalCue": "CREDENTIAL ACCESS: Exposed Ray Dashboard Discovery & Cluster Node Metadata Query (:8265/nodes) -> EXECUTION: Unauthenticated Job Submission via POST /api/jobs/ Executing entrypoint Command -> CREDENTIAL ACCESS: AI Model Weights & API Token Harvesting from GPU Worker Environment",
      "storyMappings": [
        {
          "storyTerm": "Unguarded Job-Dispatch Booth",
          "technicalTerm": "Unauthenticated Ray Dashboard & Jobs API on TCP Port 8265 (CVE-2023-48022)",
          "tone": "amber"
        },
        {
          "storyTerm": "Inspecting Running Factory Engines",
          "technicalTerm": "GET /nodes?view=summary Enumerating GPU Hardware & Worker IPs",
          "tone": "sky"
        },
        {
          "storyTerm": "Handing In Custom Work Order",
          "technicalTerm": "POST /api/jobs/ Submitting Shell Command in entrypoint Field",
          "tone": "rose"
        },
        {
          "storyTerm": "Worker Sticky Notes of Keys",
          "technicalTerm": "Harvesting HF_TOKEN, WANDB_API_KEY & S3 Credentials from runtime_env",
          "tone": "emerald"
        }
      ],
      "accentHex": "#06B6D4",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ai-shadowray-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Unguarded Job-Dispatch Booth",
          "subtitle": "Unauthenticated Ray Dashboard & Jobs API on TCP Port 8265…",
          "tone": "amber"
        },
        {
          "id": "ai-shadowray-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Inspecting Running Factory Engines",
          "subtitle": "GET /nodes?view=summary Enumerating GPU Hardware & Worker IPs",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Job-dispatch",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Exposed Ray Dashboard Discovery & Cluster Node Metadata Query (:8265/nodes)",
          "storyExcerpt": "Walking up to the street-facing dispatch window with no guard asking for a badge, the outsider peeks at the factory status board and copies down the full roster of graphics machines, internal workbench…",
          "technicalParallel": "Under the hood, the observed step executes curl -s http://10.80.10.50:8265/api/version (which executes the HTTP/HTTPS transfer client , curl -s http://10.80.10.50:8265/api/version to transmit crafted…",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Work Slid",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Unauthenticated Job Submission via POST /api/jobs/ Executing entrypoint Command",
          "storyExcerpt": "Realizing the dispatch clerk runs any slip slid under the glass without checking who signed it, the outsider slides across a work order packed with raw shell commands, and the floor foreman immediately…",
          "technicalParallel": "Under the hood, the observed step executes curl -X POST http://10.80.10.50:8265/api/jobs/ -H \"Content-Type: application/json\" -d '{\"entrypoint\": \"env | grep -E \\\"AWS_|OPENAI_|HF_|WANDB_\\\"\"}' (which…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Work",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "AI Model Weights & API Token Harvesting from GPU Worker Environment",
          "storyExcerpt": "Once running right alongside legitimate research jobs on the factory floor, the rogue work order sweeps every worker locker and environment clipboard, scooping up private model-hub tokens, experiment…",
          "technicalParallel": "Under the hood, the observed step executes cat /tmp/ray/session_latest/logs/job-driver-raysubmit_9a82b1c4.log (which inspects or executes AI/ML infrastructure operations , cat…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "GPU Farm",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Secret Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Job Stream",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022",
      "sectionKey": "step-1",
      "sceneKind": "ai-shadowray-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Exposed Ray Dashboard Discovery & Cluster Node Metadata Query (:8265/nodes)",
      "storyCue": "Walking up to the street-facing dispatch window with no guard asking for a badge, the outsider peeks at the factory status board and copies down the full roster of graphics machines, internal workbench addresses, and active shift jobs.",
      "technicalCue": "T1046 · CREDENTIAL ACCESS — Ray head nodes expose the Ray Dashboard and Jobs Submission HTTP server on TCP port 8265 without built-in authentication by default.",
      "storyMappings": [
        {
          "storyTerm": "Street-Facing Dispatch Window",
          "technicalTerm": "Internet-Exposed Ray Dashboard Service on Port 8265 (No Default Auth)",
          "tone": "amber"
        },
        {
          "storyTerm": "Factory Status Board Query",
          "technicalTerm": "Unauthenticated GET /nodes?view=summary Request",
          "tone": "rose"
        },
        {
          "storyTerm": "Machine Roster & Shift Jobs",
          "technicalTerm": "Returned GPU Specs, Internal Worker IPs & Active Job Metadata",
          "tone": "sky"
        },
        {
          "storyTerm": "Dispatch Window Lockdown",
          "technicalTerm": "Private VPC Binding & Authenticating Reverse Proxy Enforcement",
          "tone": "emerald"
        }
      ],
      "accentHex": "#06B6D4",
      "secondaryHex": "#06B6D4",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-shadowray-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Street-Facing Dispatch Window",
          "subtitle": "Internet-Exposed Ray Dashboard Service on Port 8265 (No…",
          "tone": "amber"
        },
        {
          "id": "ai-shadowray-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Factory Status Board Query",
          "subtitle": "Unauthenticated GET /nodes?view=summary Request",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up No",
          "stageTag": "STEP 01 · SETUP",
          "title": "Street-Facing Dispatch Window",
          "storyExcerpt": "Walking up to the street-facing dispatch window with no guard asking for a badge, the outsider peeks at the factory status board and copies down the full roster of graphics machines, internal…",
          "technicalParallel": "Under the hood, the observed step executes curl -s http://10.80.10.50:8265/api/version (which executes the HTTP/HTTPS transfer client , curl -s http://10.80.10.50:8265/api/version to transmit crafted…",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Jobs",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Factory Status Board Query",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses factory status board query to advance toward machine roster & shift jobs.",
          "technicalParallel": "Ray head nodes expose the Ray Dashboard and Jobs Submission HTTP server on TCP port 8265 without built-in authentication by default.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Jobs",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Dispatch Window Lockdown",
          "storyExcerpt": "Behind the scenes, dispatch window lockdown captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 8265 (recording MlopsFramework=Ray Distributed AI Framework , TCP 8265, EndpointQueried=GET /nodes?view=summary, VulnerabilityId=CVE-2023-48022 , Unauthenticated Ray Jobs API…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "GPU Farm",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Secret Vault",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Job Stream",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1046"
    },
    "step-2": {
      "scenarioId": "ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022",
      "sectionKey": "step-2",
      "sceneKind": "ai-shadowray-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Unauthenticated Job Submission via POST /api/jobs/ Executing entrypoint Command",
      "storyCue": "Realizing the dispatch clerk runs any slip slid under the glass without checking who signed it, the outsider slides across a work order packed with raw shell commands, and the floor foreman immediately launches a live worker subprocess across the cluster.",
      "technicalCue": "T1059.004 · EXECUTION — By sending an HTTP POST request to /api/jobs/ with a JSON body containing {\"entrypoint\": \"<shell_command>\"}, the Ray JobSupervisor actor immediately spawns a subprocess on the GPU cluster to…",
      "storyMappings": [
        {
          "storyTerm": "Work Order Slid Under Glass",
          "technicalTerm": "HTTP POST /api/jobs/ Containing JSON {\"entrypoint\": \"<command>\"}",
          "tone": "rose"
        },
        {
          "storyTerm": "Obedient Floor Foreman",
          "technicalTerm": "Ray JobSupervisor Actor Spawning Arbitrary Cluster Subprocess",
          "tone": "amber"
        },
        {
          "storyTerm": "Supercomputer Floor Execution",
          "technicalTerm": "Remote Code Execution Under Cluster Worker OS Privileges (CVE-2023-48022)",
          "tone": "sky"
        },
        {
          "storyTerm": "Forensic Job Audit Trail",
          "technicalTerm": "Ray Dashboard Job Submission Logs & Linux auditd execve Correlation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#06B6D4",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-shadowray-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Work Order Slid Under Glass",
          "subtitle": "HTTP POST /api/jobs/ Containing JSON {\"entrypoint\": \"<command>\"}",
          "tone": "rose"
        },
        {
          "id": "ai-shadowray-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Obedient Floor Foreman",
          "subtitle": "Ray JobSupervisor Actor Spawning Arbitrary Cluster Subprocess",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Work Slid",
          "stageTag": "STEP 02 · SETUP",
          "title": "Work Order Slid Under Glass",
          "storyExcerpt": "Realizing the dispatch clerk runs any slip slid under the glass without checking who signed it, the outsider slides across a work order packed with raw shell commands, and the floor foreman…",
          "technicalParallel": "Under the hood, the observed step executes curl -X POST http://10.80.10.50:8265/api/jobs/ -H \"Content-Type: application/json\" -d '{\"entrypoint\": \"env | grep -E \\\"AWS_|OPENAI_|HF_|WANDB_\\\"\"}' (which…",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Obedient Floor Foreman",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses obedient floor foreman to advance toward supercomputer floor execution.",
          "technicalParallel": "By sending an HTTP POST request to /api/jobs/ with a JSON body containing {\"entrypoint\": \"<shell_command>\"}, the Ray JobSupervisor actor immediately spawns a subprocess on the GPU cluster to execute the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Runs Any",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Forensic Job Audit Trail",
          "storyExcerpt": "Behind the scenes, forensic job audit trail captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording RaySubmissionId=raysubmit_9a82b1c4, JobEntrypoint=env | grep -E \"AWS_|OPENAI_|HF_|WANDB_\", AtlasTechnique=MITRE ATLAS AML.T0018 under T1059.004): Monitor…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "GPU Farm",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Secret Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Job Stream",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1059.004"
    },
    "step-3": {
      "scenarioId": "ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022",
      "sectionKey": "step-3",
      "sceneKind": "ai-shadowray-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "AI Model Weights & API Token Harvesting from GPU Worker Environment",
      "storyCue": "Once running right alongside legitimate research jobs on the factory floor, the rogue work order sweeps every worker locker and environment clipboard, scooping up private model-hub tokens, experiment tracker keys, and cloud storage passes.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — Because MLOps training jobs commonly pass HuggingFace tokens (HF_TOKEN), Weights & Biases keys (WANDB_API_KEY), OpenAI keys, and S3 model bucket credentials in worker runtime_env variables, the…",
      "storyMappings": [
        {
          "storyTerm": "Worker Lockers & Clipboards",
          "technicalTerm": "GPU Worker Process Environment & runtime_env Secret Variables",
          "tone": "sky"
        },
        {
          "storyTerm": "Private Model-Hub & Tracker Keys",
          "technicalTerm": "Harvested HF_TOKEN, WANDB_API_KEY, OpenAI & S3 Bucket Credentials",
          "tone": "rose"
        },
        {
          "storyTerm": "Rogue Research Work Order",
          "technicalTerm": "Malicious Ray Job Exfiltrating Proprietary Model Weights & Secrets",
          "tone": "amber"
        },
        {
          "storyTerm": "Secret Isolation Defense",
          "technicalTerm": "Short-Lived Workload Identity & Secrets Manager Injection Controls",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-shadowray-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Worker Lockers & Clipboards",
          "subtitle": "GPU Worker Process Environment & runtime_env Secret Variables",
          "tone": "sky"
        },
        {
          "id": "ai-shadowray-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Private Model-Hub & Tracker Keys",
          "subtitle": "Harvested HF_TOKEN, WANDB_API_KEY, OpenAI & S3 Bucket…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Jobs Work",
          "stageTag": "STEP 03 · SETUP",
          "title": "Worker Lockers & Clipboards",
          "storyExcerpt": "Once running right alongside legitimate research jobs on the factory floor, the rogue work order sweeps every worker locker and environment clipboard, scooping up private model-hub tokens…",
          "technicalParallel": "Under the hood, the observed step executes cat /tmp/ray/session_latest/logs/job-driver-raysubmit_9a82b1c4.log (which inspects or executes AI/ML infrastructure operations , cat…",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Keys",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Private Model-Hub & Tracker Keys",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses private model-hub & tracker keys to advance toward rogue research work order.",
          "technicalParallel": "Because MLOps training jobs commonly pass HuggingFace tokens (HF_TOKEN), Weights & Biases keys (WANDB_API_KEY), OpenAI keys, and S3 model bucket credentials in worker runtime_env variables, the rogue Ray…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Work",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Secret Isolation Defense",
          "storyExcerpt": "Behind the scenes, secret isolation defense captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording LogEndpoint=GET /api/jobs/raysubmit_9a82b1c4/logs, ExposedSecretsScope=HF_TOKEN, WANDB_API_KEY, AWS_SESSION_TOKEN, ClusterNodeScope=All Ray Worker Nodes in…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "GPU Farm",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Secret Vault",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Job Stream",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.001"
    }
  },
  "jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr": {
    "briefing": {
      "scenarioId": "jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr",
      "sectionKey": "briefing",
      "sceneKind": "ai-artex-swarm-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1595.002",
      "title": "ARTEX Multi-Agent LLM Framework: Machine-Speed Kill-Chain Compression… — Story-to-Technical Overview",
      "storyCue": "Imagine a bank heist crew that replaces slow human lockpickers with a coordinated swarm of high-speed robotic arms controlled by one central planner. Instead of inventing a brand-new laser cutter, the master planner dispatches eight worker robots that test every door handle in parallel, wedge open a service window, collect forged master vouchers, and sprint to the upstairs key vault in under fifteen minutes, forcing the building’s automated defense grid to slam down steel blast doors and shred compromised badges instantly because waiting for a human guard would be far too late.",
      "technicalCue": "INITIAL ACCESS: ARTEX Planner-Worker LLM Initialization, Autonomous `nmap`/`curl` Recon & Storm-0940 Password Spray -> PERSISTENCE: Machine-Speed Web Shell Persistence (`T1505.003`), Automated Kerberoasting (`0x17`) & Lateral Pivot -> CREDENTIAL ACCESS: 5-Minute Cloud Secret Exfiltration (`Azure Key Vault`) & Defender XDR Automatic Attack Disruption",
      "storyMappings": [
        {
          "storyTerm": "Master Planner & Eight Worker Robots",
          "technicalTerm": "ARTEX Go + Next.js Multi-Agent LLM Planner-Worker Framework",
          "tone": "rose"
        },
        {
          "storyTerm": "Testing Every Door Handle in Parallel",
          "technicalTerm": "Autonomous nmap/curl Recon & Storm-0940 Distributed Password Spray",
          "tone": "amber"
        },
        {
          "storyTerm": "Service Window & Forged Vouchers",
          "technicalTerm": "Machine-Speed Web Shell (T1505.003) & RC4 Kerberoasting (etype 0x17)",
          "tone": "sky"
        },
        {
          "storyTerm": "Automated Steel Blast Doors",
          "technicalTerm": "Microsoft Defender XDR Automatic Attack Disruption & Session Revoke",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ai-artex-swarm-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Master Planner & Eight Worker Robots",
          "subtitle": "ARTEX Go + Next.js Multi-Agent LLM Planner-Worker Framework",
          "tone": "rose"
        },
        {
          "id": "ai-artex-swarm-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Testing Every Door Handle in Parallel",
          "subtitle": "Autonomous nmap/curl Recon & Storm-0940 Distributed Password…",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Raid Out",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "ARTEX Planner-Worker LLM Initialization, Autonomous `nmap`/`curl` Recon & Storm-0940 Password Spray",
          "storyExcerpt": "At the start of the raid, the central robotic dispatcher hands out parallel checklists to a team of mechanical scouts that sweep the perimeter walls and gently test common door codes across dozens of…",
          "technicalParallel": "Under the hood, the observed step executes artex-server --planner-model deepseek-reasoner --worker-concurrency 8 --target corp.local (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Zero-delay",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Machine-Speed Web Shell Persistence (`T1505.003`), Automated Kerberoasting (`0x17`) & Lateral Pivot",
          "storyExcerpt": "Without pausing for any human review, the central dispatcher reads the first unlocked door code and immediately sends a second robot to prop open a hidden maintenance window and request weak older-style…",
          "technicalParallel": "Under the hood, the observed step executes Worker-Persist: curl -X PUT https://10.10.20.14/owa/auth/healthcheck.aspx (Web shell drop via compromised admin session) (which executes the HTTP/HTTPS transfer…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Key Safe",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "5-Minute Cloud Secret Exfiltration (`Azure Key Vault`) & Defender XDR Automatic Attack Disruption",
          "storyExcerpt": "Five minutes later, the cloud scout robot races straight to the upstairs master key safe to scoop out high-value secrets, only for the building’s automated defense grid to spot three rapid alarms on the…",
          "technicalParallel": "Under the hood, the observed step executes Worker-Cloud: az keyvault secret list --vault-name corp-prod-kv && az keyvault secret show --name prod-db-conn-string (which executes a cloud control-plane API…",
          "accentHex": "#10B981",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Swarm Arena",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Blast Doors",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "XDR Intercept",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr",
      "sectionKey": "step-1",
      "sceneKind": "ai-artex-swarm-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "ARTEX Planner-Worker LLM Initialization, Autonomous nmap/curl Recon & Storm-0940 Password Spray",
      "storyCue": "At the start of the raid, the central robotic dispatcher hands out parallel checklists to a team of mechanical scouts that sweep the perimeter walls and gently test common door codes across dozens of staff entrances so the instant one lock clicks open, the next robot is already moving.",
      "technicalCue": "T1595.002 · INITIAL ACCESS — The attacker launches the ARTEX Go server (artex-server --model deepseek-chat) and Next.js operator console, where a central LLM Planner decomposes the objective into autonomous Worker tasks…",
      "storyMappings": [
        {
          "storyTerm": "Central Robotic Dispatcher",
          "technicalTerm": "ARTEX Go Planner Server (artex-server) & Next.js Operator Console",
          "tone": "rose"
        },
        {
          "storyTerm": "Mechanical Scouts Sweeping Walls",
          "technicalTerm": "Autonomous Worker Agents Running Parallel nmap -sV & curl Probing",
          "tone": "amber"
        },
        {
          "storyTerm": "Gently Testing Staff Door Codes",
          "technicalTerm": "Storm-0940 Low-and-Slow Distributed Entra ID Password Spray",
          "tone": "sky"
        },
        {
          "storyTerm": "Smart Entrance Lockout",
          "technicalTerm": "FIDO2/Passkey MFA, Entra ID Smart Lockout & Risky Sign-In Blocking",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-artex-swarm-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Central Robotic Dispatcher",
          "subtitle": "ARTEX Go Planner Server (artex-server) & Next.js Operator…",
          "tone": "rose"
        },
        {
          "id": "ai-artex-swarm-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Mechanical Scouts Sweeping Walls",
          "subtitle": "Autonomous Worker Agents Running Parallel nmap -sV & curl…",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Raid Out",
          "stageTag": "STEP 01 · SETUP",
          "title": "Central Robotic Dispatcher",
          "storyExcerpt": "At the start of the raid, the central robotic dispatcher hands out parallel checklists to a team of mechanical scouts that sweep the perimeter walls and gently test common door codes across…",
          "technicalParallel": "Under the hood, the observed step executes artex-server --planner-model deepseek-reasoner --worker-concurrency 8 --target corp.local (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Door",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Mechanical Scouts Sweeping Walls",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses mechanical scouts sweeping walls to advance toward gently testing staff door codes.",
          "technicalParallel": "The attacker launches the ARTEX Go server (artex-server --model deepseek-chat) and Next.js operator console, where a central LLM Planner decomposes the objective into autonomous Worker tasks (executing…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Door",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Smart Entrance Lockout",
          "storyExcerpt": "Behind the scenes, smart entrance lockout captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in SIEM Event 50126 (recording AgentArchitecture=ARTEX Go Planner-Worker Multi-Agent LLM Framework, InitialAccessVector=Storm-0940 Password Spraying + Automated Surface Recon , T1110.003 /…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Swarm Arena",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Blast Doors",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "XDR Intercept",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1595.002"
    },
    "step-2": {
      "scenarioId": "jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr",
      "sectionKey": "step-2",
      "sceneKind": "ai-artex-swarm-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Machine-Speed Web Shell Persistence (T1505.003), Automated Kerberoasting (0x17) & Lateral Pivot",
      "storyCue": "Without pausing for any human review, the central dispatcher reads the first unlocked door code and immediately sends a second robot to prop open a hidden maintenance window and request weak older-style ticket stubs inside the lobby within minutes, compressing days of manual burglary into seconds.",
      "technicalCue": "T1505.003 · PERSISTENCE — Without waiting for human operator review, the ARTEX Planner parses the valid credential output and immediately dispatches a Lateral Movement Worker agent that drops an obfuscated web shell for…",
      "storyMappings": [
        {
          "storyTerm": "Zero-Delay Robot Handoff",
          "technicalTerm": "LLM Planner Parsing Valid Credentials & Dispatching Lateral Worker",
          "tone": "amber"
        },
        {
          "storyTerm": "Propping Open Maintenance Window",
          "technicalTerm": "Obfuscated ASPX Web Shell Drop Under IIS w3wp.exe (T1505.003)",
          "tone": "rose"
        },
        {
          "storyTerm": "Weak Older-Style Ticket Stubs",
          "technicalTerm": "Automated SPN Discovery & RC4 Kerberoasting (EventID 4769, 0x17)",
          "tone": "sky"
        },
        {
          "storyTerm": "Automated Server Surface Block",
          "technicalTerm": "Defender ASR Rules (Block Web Shell & LSASS) & AES-Only Kerberos",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-artex-swarm-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Zero-Delay Robot Handoff",
          "subtitle": "LLM Planner Parsing Valid Credentials & Dispatching Lateral…",
          "tone": "amber"
        },
        {
          "id": "ai-artex-swarm-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Propping Open Maintenance Window",
          "subtitle": "Obfuscated ASPX Web Shell Drop Under IIS w3wp.exe (T1505.003)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Zero-delay",
          "stageTag": "STEP 02 · SETUP",
          "title": "Zero-Delay Robot Handoff",
          "storyExcerpt": "Without pausing for any human review, the central dispatcher reads the first unlocked door code and immediately sends a second robot to prop open a hidden maintenance window and request weak…",
          "technicalParallel": "Under the hood, the observed step executes Worker-Persist: curl -X PUT https://10.10.20.14/owa/auth/healthcheck.aspx (Web shell drop via compromised admin session) (which executes the HTTP/HTTPS transfer…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Open",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Propping Open Maintenance Window",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses propping open maintenance window to advance toward weak older-style ticket stubs.",
          "technicalParallel": "Without waiting for human operator review, the ARTEX Planner parses the valid credential output and immediately dispatches a Lateral Movement Worker agent that drops an obfuscated web shell for…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Weak",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Automated Server Surface Block",
          "storyExcerpt": "Behind the scenes, automated server surface block captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Windows Security Event 4769 (recording KillChainCompression=Initial Spray to Web Shell + Kerberoast in 8 minutes 32 seconds, TicketEncryptionType=0x17 , RC4-HMAC Downgrade, MITRE T1558.003…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Swarm Arena",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Blast Doors",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "XDR Intercept",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1505.003"
    },
    "step-3": {
      "scenarioId": "jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr",
      "sectionKey": "step-3",
      "sceneKind": "ai-artex-swarm-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "5-Minute Cloud Secret Exfiltration (Azure Key Vault) & Defender XDR Automatic Attack Disruption",
      "storyCue": "Five minutes later, the cloud scout robot races straight to the upstairs master key safe to scoop out high-value secrets, only for the building’s automated defense grid to spot three rapid alarms on the same badge within a tight window, lock the workstation behind steel doors, and shred the badge automatically.",
      "technicalCue": "T1552.004 · CREDENTIAL ACCESS — Pivoting from hybrid credentials or leaked GitHub/CI secrets into Azure within 5 minutes, the ARTEX Cloud Worker enumerates Entra ID OAuth app permissions and issues rapid KeyVaultGetSecret…",
      "storyMappings": [
        {
          "storyTerm": "Upstairs Master Key Safe",
          "technicalTerm": "Azure Key Vault Targeted by Rapid KeyVaultGetSecret Enumeration",
          "tone": "sky"
        },
        {
          "storyTerm": "Three Rapid Alarms on Same Badge",
          "technicalTerm": "Defender XDR KQL Multi-Domain Alert Velocity Burst Correlation",
          "tone": "amber"
        },
        {
          "storyTerm": "Slamming Steel Blast Doors",
          "technicalTerm": "Automatic Attack Disruption Isolating Endpoint via sense.exe",
          "tone": "emerald"
        },
        {
          "storyTerm": "Shredding Compromised Badge",
          "technicalTerm": "Automated Entra ID User Containment & Active Session Revocation",
          "tone": "rose"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ai-artex-swarm-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Upstairs Master Key Safe",
          "subtitle": "Azure Key Vault Targeted by Rapid KeyVaultGetSecret Enumeration",
          "tone": "sky"
        },
        {
          "id": "ai-artex-swarm-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Three Rapid Alarms on Same Badge",
          "subtitle": "Defender XDR KQL Multi-Domain Alert Velocity Burst Correlation",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key Safe",
          "stageTag": "STEP 03 · SETUP",
          "title": "Upstairs Master Key Safe",
          "storyExcerpt": "Five minutes later, the cloud scout robot races straight to the upstairs master key safe to scoop out high-value secrets, only for the building’s automated defense grid to spot three rapid…",
          "technicalParallel": "Under the hood, the observed step executes Worker-Cloud: az keyvault secret list --vault-name corp-prod-kv && az keyvault secret show --name prod-db-conn-string (which executes a cloud control-plane API…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Same",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Three Rapid Alarms on Same Badge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses three rapid alarms on same badge to advance toward slamming steel blast doors.",
          "technicalParallel": "Pivoting from hybrid credentials or leaked GitHub/CI secrets into Azure within 5 minutes, the ARTEX Cloud Worker enumerates Entra ID OAuth app permissions and issues rapid KeyVaultGetSecret calls across…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Five Key",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Shredding Compromised Badge",
          "storyExcerpt": "Behind the scenes, shredding compromised badge captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in SIEM Event 200 (recording CloudTarget=Azure Key Vault , Bulk SecretGet Enumeration, T1552.004, DetectionMechanism=KQL Multi-Alert Burst Correlation , Endpoint + Identity + Cloud Apps in <…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Swarm Arena",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Blast Doors",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "XDR Intercept",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.004"
    }
  }
};
