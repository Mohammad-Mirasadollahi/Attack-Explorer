import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928",
    "floor": "workshop-tile",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16096779,
    "leftProp": "library-toggle",
    "rightProp": "gpu-cluster",
    "centerMechanism": "arc",
    "leftActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "rightActor": {
      "coatHex": 11817737,
      "accentHex": 16436245,
      "hatType": "visor"
    },
    "sections": [
      {
        "sceneKind": "ai-mlflow-lfi-briefing",
        "mode": "overview-full",
        "boardTitle": "UNGUARDED LAB EXPERIMENT ARCHIVE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXFIL & IMPACT",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UNGUARDED LAB",
        "rightPlaqueOverride": "CLEVERLY FOLDED"
      },
      {
        "sceneKind": "ai-mlflow-lfi-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CREATING NEW PROJECT FOLDER",
        "boardSubtitle": "T1190 INITIAL ACCESS -> BOOKMARK HASH SYMBOL TRICK",
        "accentHex": 3718648,
        "secondaryHex": 16096779,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CREATING NEW PROJECT",
        "rightPlaqueOverride": "BOOKMARK HASH SYMBOL"
      },
      {
        "sceneKind": "ai-mlflow-lfi-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: LOGGING A DUMMY TRIAL",
        "boardSubtitle": "T1005 EXFIL & IMPACT -> REGISTERING NAMED MODEL",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "LOGGING A DUMMY TRIAL",
        "rightPlaqueOverride": "REGISTERING NAMED MODEL"
      },
      {
        "sceneKind": "ai-mlflow-lfi-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: REQUESTING NAMED CREDENTIALS FILE",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> HOST PRIVATE CLOUD",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "REQUESTING NAMED",
        "rightPlaqueOverride": "HOST PRIVATE CLOUD"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "UNGUARDED LAB",
    "rightPlaque": "CLEVERLY FOLDED"
  },
  {
    "scenarioId": "ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "gpu-cluster",
    "rightProp": "proxy-mirror",
    "centerMechanism": "arc",
    "leftActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "rightActor": {
      "coatHex": 1013358,
      "accentHex": 3718648,
      "hatType": "visor"
    },
    "sections": [
      {
        "sceneKind": "ai-ollama-vllm-briefing",
        "mode": "overview-full",
        "boardTitle": "STREET-FACING LIBRARY COUNTER -> READING",
        "boardSubtitle": "T1518 CREDENTIAL ACCESS -> INITIAL ACCESS -> EXFIL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "STREET-FACING LIBRARY",
        "rightPlaqueOverride": "READING PRIVATE CUSTOM"
      },
      {
        "sceneKind": "ai-ollama-vllm-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNGUARDED LIBRARY KIOSK",
        "boardSubtitle": "T1518 CREDENTIAL ACCESS -> CATALOG PRINTOUT & COVER",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "UNGUARDED LIBRARY KIOSK",
        "rightPlaqueOverride": "CATALOG PRINTOUT &"
      },
      {
        "sceneKind": "ai-ollama-vllm-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SPECIAL ACQUISITION SLIP",
        "boardSubtitle": "T1608.001 INITIAL ACCESS -> SERVER DIALING OUT",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "SPECIAL ACQUISITION SLIP",
        "rightPlaqueOverride": "SERVER DIALING OUT"
      },
      {
        "sceneKind": "ai-ollama-vllm-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: REBINDING ORDER WITH OFFICIAL",
        "boardSubtitle": "T1565.001 EXFIL & IMPACT -> HIDDEN BEHAVIORAL",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "REBINDING ORDER WITH",
        "rightPlaqueOverride": "HIDDEN BEHAVIORAL"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "STREET-FACING LIBRARY",
    "rightPlaque": "READING PRIVATE CUSTOM"
  },
  {
    "scenarioId": "ai-pytorch-pickle-torch-load-supply-chain-forensics",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "model-crate",
    "rightProp": "gpu-cluster",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "rightActor": {
      "coatHex": 3359061,
      "accentHex": 1096065,
      "hatType": "cap"
    },
    "sections": [
      {
        "sceneKind": "ai-pytorch-pickle-briefing",
        "mode": "overview-full",
        "boardTitle": "SHARED SUITCASE OF BRAIN WEIGHTS -> HIDDEN",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> EXECUTION -> DEFENSE EVASION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "SHARED SUITCASE OF",
        "rightPlaqueOverride": "HIDDEN WIND-UP"
      },
      {
        "sceneKind": "ai-pytorch-pickle-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: OUTER SUITCASE ZIPPER",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> INSPECTOR READING",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "OUTER SUITCASE ZIPPER",
        "rightPlaqueOverride": "INSPECTOR READING"
      },
      {
        "sceneKind": "ai-pytorch-pickle-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: LEGACY AUTOMATIC UNPACKER",
        "boardSubtitle": "T1203 EXECUTION -> WIND-UP CARD SNAPPING OPEN",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "LEGACY AUTOMATIC",
        "rightPlaqueOverride": "WIND-UP CARD SNAPPING"
      },
      {
        "sceneKind": "ai-pytorch-pickle-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: CLEVER MIRROR-CHAIN DISGUISE",
        "boardSubtitle": "T1027 DEFENSE EVASION -> QUIET MATH-INFERENCE WORKER",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "CLEVER MIRROR-CHAIN",
        "rightPlaqueOverride": "QUIET MATH-INFERENCE"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "SHARED SUITCASE OF",
    "rightPlaque": "HIDDEN WIND-UP"
  },
  {
    "scenarioId": "ai-rag-indirect-prompt-injection-mcp-tool-audit",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 1096065,
    "secondaryHex": 16007006,
    "leftProp": "library-toggle",
    "rightProp": "robot-worker-bay",
    "centerMechanism": "arc",
    "leftActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "rightActor": {
      "coatHex": 1013358,
      "accentHex": 3718648,
      "hatType": "visor"
    },
    "sections": [
      {
        "sceneKind": "ai-rag-mcp-briefing",
        "mode": "overview-full",
        "boardTitle": "SHARED FILING CABINET RESUME -> INVISIBLE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> EXFIL & IMPACT",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "SHARED FILING CABINET",
        "rightPlaqueOverride": "INVISIBLE MARGIN"
      },
      {
        "sceneKind": "ai-rag-mcp-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: RESUME WITH FINE-PRINT OVERRIDE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> AUTOMATED REFERENCE",
        "accentHex": 1096065,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "RESUME WITH FINE-PRINT",
        "rightPlaqueOverride": "AUTOMATED REFERENCE"
      },
      {
        "sceneKind": "ai-rag-mcp-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: CONFUSED EXECUTIVE ASSISTANT",
        "boardSubtitle": "T1059 EXECUTION -> STRUCTURED WORK-TOOL SLIP",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "CONFUSED EXECUTIVE",
        "rightPlaqueOverride": "STRUCTURED WORK-TOOL"
      },
      {
        "sceneKind": "ai-rag-mcp-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: EXTERNAL DECORATIVE PICTURE",
        "boardSubtitle": "T1041 EXFIL & IMPACT -> SMUGGLED CUSTOMER SECRET",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "EXTERNAL DECORATIVE",
        "rightPlaqueOverride": "SMUGGLED CUSTOMER SECRET"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "SHARED FILING CABINET",
    "rightPlaque": "INVISIBLE MARGIN"
  },
  {
    "scenarioId": "ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 440020,
    "secondaryHex": 16096779,
    "leftProp": "gpu-cluster",
    "rightProp": "cloud-silo",
    "centerMechanism": "arc",
    "leftActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "rightActor": {
      "coatHex": 11817737,
      "accentHex": 16436245,
      "hatType": "visor"
    },
    "sections": [
      {
        "sceneKind": "ai-shadowray-briefing",
        "mode": "overview-full",
        "boardTitle": "UNGUARDED JOB-DISPATCH BOOTH -> INSPECTING",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> EXECUTION -> CREDENTIAL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UNGUARDED JOB-DISPATCH",
        "rightPlaqueOverride": "INSPECTING RUNNING"
      },
      {
        "sceneKind": "ai-shadowray-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: STREET-FACING DISPATCH WINDOW",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> FACTORY STATUS BOARD",
        "accentHex": 440020,
        "secondaryHex": 16096779,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "STREET-FACING DISPATCH",
        "rightPlaqueOverride": "FACTORY STATUS BOARD"
      },
      {
        "sceneKind": "ai-shadowray-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: WORK ORDER SLID UNDER GLASS",
        "boardSubtitle": "T1059.004 EXECUTION -> OBEDIENT FLOOR FOREMAN",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "WORK ORDER SLID UNDER",
        "rightPlaqueOverride": "OBEDIENT FLOOR FOREMAN"
      },
      {
        "sceneKind": "ai-shadowray-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: WORKER LOCKERS & CLIPBOARDS",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> PRIVATE MODEL-HUB &",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "WORKER LOCKERS &",
        "rightPlaqueOverride": "PRIVATE MODEL-HUB &"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "UNGUARDED JOB-DISPATCH",
    "rightPlaque": "INSPECTING RUNNING"
  },
  {
    "scenarioId": "jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 1096065,
    "leftProp": "swarm-arena",
    "rightProp": "fortress-gate",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "rightActor": {
      "coatHex": 1920728,
      "accentHex": 16436245,
      "hatType": "cap"
    },
    "sections": [
      {
        "sceneKind": "ai-artex-swarm-briefing",
        "mode": "overview-full",
        "boardTitle": "MASTER PLANNER & EIGHT WORKER ROBOTS",
        "boardSubtitle": "T1595.002 INITIAL ACCESS -> PERSISTENCE -> CREDENTIAL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "MASTER PLANNER & EIGHT",
        "rightPlaqueOverride": "TESTING EVERY DOOR"
      },
      {
        "sceneKind": "ai-artex-swarm-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CENTRAL ROBOTIC DISPATCHER",
        "boardSubtitle": "T1595.002 INITIAL ACCESS -> MECHANICAL SCOUTS",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CENTRAL ROBOTIC",
        "rightPlaqueOverride": "MECHANICAL SCOUTS"
      },
      {
        "sceneKind": "ai-artex-swarm-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ZERO-DELAY ROBOT HANDOFF",
        "boardSubtitle": "T1505.003 PERSISTENCE -> PROPPING OPEN MAINTENANCE",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ZERO-DELAY ROBOT HANDOFF",
        "rightPlaqueOverride": "PROPPING OPEN"
      },
      {
        "sceneKind": "ai-artex-swarm-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: UPSTAIRS MASTER KEY SAFE",
        "boardSubtitle": "T1552.004 CREDENTIAL ACCESS -> THREE RAPID ALARMS",
        "accentHex": 1096065,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UPSTAIRS MASTER KEY SAFE",
        "rightPlaqueOverride": "THREE RAPID ALARMS ON"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "MASTER PLANNER & EIGHT",
    "rightPlaque": "TESTING EVERY DOOR"
  }
];

export function buildAiMlopsScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
