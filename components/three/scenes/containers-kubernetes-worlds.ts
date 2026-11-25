import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "container-cap-sys-admin-cgroup-release-agent-notify-audit",
    "floor": "pier-dock",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "shipping-container",
    "rightProp": "kernel-courthouse",
    "centerMechanism": "key-handoff",
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
        "sceneKind": "cnt-cgroup-escape-briefing",
        "mode": "overview-full",
        "boardTitle": "MASTER PLUMBING KEY HELD INSIDE THE STORAGE",
        "boardSubtitle": "T1611 CREDENTIAL ACCESS -> INITIAL ACCESS",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "MASTER PLUMBING KEY",
        "rightPlaqueOverride": "OLD AUTOMATED"
      },
      {
        "sceneKind": "cnt-cgroup-escape-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: OVERSIZED MAINTENANCE KEY LEFT",
        "boardSubtitle": "T1611 CREDENTIAL ACCESS -> OLDER RESOURCE-CONTROL",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "OVERSIZED MAINTENANCE",
        "rightPlaqueOverride": "OLDER RESOURCE-CONTROL"
      },
      {
        "sceneKind": "cnt-cgroup-escape-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: TINY SUB-BIN UNDER THE SWITCHBOARD",
        "boardSubtitle": "T1611 INITIAL ACCESS -> FLIPPING THE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "TINY SUB-BIN UNDER THE",
        "rightPlaqueOverride": "FLIPPING THE"
      },
      {
        "sceneKind": "cnt-cgroup-escape-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: ONE-SECOND DUMMY WORKER STEPPING",
        "boardSubtitle": "T1611 DEFENSE EVASION -> BUILDING CENTRAL KERNEL",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ONE-SECOND DUMMY WORKER",
        "rightPlaqueOverride": "BUILDING CENTRAL KERNEL"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "MASTER PLUMBING KEY",
    "rightPlaque": "OLD AUTOMATED"
  },
  {
    "scenarioId": "container-cap-sys-module-kernel-ko-insmod-load-audit",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "shipping-container",
    "rightProp": "kernel-courthouse",
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
        "sceneKind": "cnt-cap-sysmod-briefing",
        "mode": "overview-full",
        "boardTitle": "ELEVATOR-MECHANIC CLEARANCE ON A TENANT",
        "boardSubtitle": "T1082 CREDENTIAL ACCESS -> PERSISTENCE -> DEFENSE",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "ELEVATOR-MECHANIC",
        "rightPlaqueOverride": "HOMEMADE GEAR MATCHING"
      },
      {
        "sceneKind": "cnt-cap-sysmod-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CHECKING THE BADGE STAMP LIST",
        "boardSubtitle": "T1082 CREDENTIAL ACCESS -> CENTRAL ELEVATOR",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "CHECKING THE BADGE",
        "rightPlaqueOverride": "CENTRAL ELEVATOR"
      },
      {
        "sceneKind": "cnt-cap-sysmod-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: CUSTOM METAL GEAR TAILORED TO THE",
        "boardSubtitle": "T1547.006 PERSISTENCE -> FEEDING IT THROUGH THE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "CUSTOM METAL GEAR",
        "rightPlaqueOverride": "FEEDING IT THROUGH THE"
      },
      {
        "sceneKind": "cnt-cap-sysmod-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: TWO UNMISTAKABLE WARNING LAMPS ON",
        "boardSubtitle": "T1014 DEFENSE EVASION -> PERMANENT ENGINE DIARY",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "TWO UNMISTAKABLE",
        "rightPlaqueOverride": "PERMANENT ENGINE DIARY"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "ELEVATOR-MECHANIC",
    "rightPlaque": "HOMEMADE GEAR MATCHING"
  },
  {
    "scenarioId": "docker-buildkit-runc-cache-mount-race-cve-2024-23651",
    "floor": "conveyor-deck",
    "wallHex": 1516884,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "factory-conveyor",
    "rightProp": "shipping-container",
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
        "sceneKind": "cnt-buildkit-race-briefing",
        "mode": "overview-full",
        "boardTitle": "TWO SIDE-BY-SIDE CONVEYOR LINES SHARING ONE",
        "boardSubtitle": "T1610 INITIAL ACCESS -> INITIAL ACCESS -> DEFENSE",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "TWO SIDE-BY-SIDE",
        "rightPlaqueOverride": "SWAPPING THE SHELF SIGN"
      },
      {
        "sceneKind": "cnt-buildkit-race-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: MULTI-STAGE ASSEMBLY JOB",
        "boardSubtitle": "T1610 INITIAL ACCESS -> TWO PARALLEL WORK CREWS",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "MULTI-STAGE ASSEMBLY JOB",
        "rightPlaqueOverride": "TWO PARALLEL WORK CREWS"
      },
      {
        "sceneKind": "cnt-buildkit-race-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: INSPECTOR VERIFYING THE DOORWAY",
        "boardSubtitle": "T1611 INITIAL ACCESS -> SWAPPING THE DOORWAY PLATE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "INSPECTOR VERIFYING THE",
        "rightPlaqueOverride": "SWAPPING THE DOORWAY"
      },
      {
        "sceneKind": "cnt-buildkit-race-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SUPPLY SHELF OPENING ONTO THE",
        "boardSubtitle": "T1611 DEFENSE EVASION -> READING BUILDER SECRETS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "SUPPLY SHELF OPENING",
        "rightPlaqueOverride": "READING BUILDER SECRETS"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "TWO SIDE-BY-SIDE",
    "rightPlaque": "SWAPPING THE SHELF SIGN"
  },
  {
    "scenarioId": "docker-engine-unauthenticated-tcp-2375-api-socket-audit",
    "floor": "pier-dock",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "broadcast-tower",
    "rightProp": "shipping-container",
    "centerMechanism": "arc",
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
        "sceneKind": "cnt-docker-2375-briefing",
        "mode": "overview-full",
        "boardTitle": "MASTER CRANE CONSOLE WIRED ONTO AN OPEN",
        "boardSubtitle": "T1613 CREDENTIAL ACCESS -> EXECUTION -> INITIAL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MASTER CRANE CONSOLE",
        "rightPlaqueOverride": "ORDERING A GLASS BOOTH"
      },
      {
        "sceneKind": "cnt-docker-2375-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNLOCKED CRANE RADIO CHANNEL",
        "boardSubtitle": "T1613 CREDENTIAL ACCESS -> CRANE MODEL NUMBER AND",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UNLOCKED CRANE RADIO",
        "rightPlaqueOverride": "CRANE MODEL NUMBER AND"
      },
      {
        "sceneKind": "cnt-docker-2375-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: LIGHTWEIGHT UTILITY BOX",
        "boardSubtitle": "T1610 EXECUTION -> SAFETY BARS REMOVED",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "LIGHTWEIGHT UTILITY BOX",
        "rightPlaqueOverride": "SAFETY BARS REMOVED"
      },
      {
        "sceneKind": "cnt-docker-2375-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: STEPPING THROUGH THE HINGED BACK",
        "boardSubtitle": "T1611 INITIAL ACCESS -> ADDING A SPARE FRONT-DOOR",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "STEPPING THROUGH THE",
        "rightPlaqueOverride": "ADDING A SPARE"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "MASTER CRANE CONSOLE",
    "rightPlaque": "ORDERING A GLASS BOOTH"
  },
  {
    "scenarioId": "docker-oci-registry-manifest-layer-poisoning-cosign-audit",
    "floor": "conveyor-deck",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 1096065,
    "leftProp": "shipping-container",
    "rightProp": "notary-press",
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
        "sceneKind": "cnt-oci-cosign-briefing",
        "mode": "overview-full",
        "boardTitle": "SLIPPING A TAMPERED MODULAR LAYER ONTO THE",
        "boardSubtitle": "T1525 PERSISTENCE -> DEFENSE EVASION -> INITIAL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "SLIPPING A TAMPERED",
        "rightPlaqueOverride": "MOVING THE FLOATING"
      },
      {
        "sceneKind": "cnt-oci-cosign-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: STOLEN WAREHOUSE STOCKING PASS",
        "boardSubtitle": "T1525 PERSISTENCE -> ALTERED CRATE LAYER CARRYING",
        "accentHex": 11032055,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "STOLEN WAREHOUSE",
        "rightPlaqueOverride": "ALTERED CRATE LAYER"
      },
      {
        "sceneKind": "cnt-oci-cosign-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BRAND-NEW PACKING LIST",
        "boardSubtitle": "T1525 DEFENSE EVASION -> MOVABLE PRODUCTION TAG",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "BRAND-NEW PACKING LIST",
        "rightPlaqueOverride": "MOVABLE PRODUCTION TAG"
      },
      {
        "sceneKind": "cnt-oci-cosign-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: FACTORY FLOOR PULLING THE",
        "boardSubtitle": "T1525 INITIAL ACCESS -> LOADING-DOCK SEAL INSPECTOR",
        "accentHex": 1096065,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "FACTORY FLOOR PULLING",
        "rightPlaqueOverride": "LOADING-DOCK SEAL"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "SLIPPING A TAMPERED",
    "rightPlaque": "MOVING THE FLOATING"
  },
  {
    "scenarioId": "docker-var-run-docker-sock-mounted-socket-breakout-audit",
    "floor": "pier-dock",
    "wallHex": 1976635,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "shipping-container",
    "rightProp": "pneumatic-tube",
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
        "sceneKind": "cnt-docker-sock-briefing",
        "mode": "overview-full",
        "boardTitle": "MASTER CRANE JOYSTICK CABLE WIRED THROUGH",
        "boardSubtitle": "T1613 CREDENTIAL ACCESS -> DEFENSE EVASION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "MASTER CRANE JOYSTICK",
        "rightPlaqueOverride": "ORDERING AN OPEN-AIR"
      },
      {
        "sceneKind": "cnt-docker-sock-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: INSPECTING THE WALL CONDUITS",
        "boardSubtitle": "T1613 CREDENTIAL ACCESS -> LIVE MASTER CRANE",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "INSPECTING THE WALL",
        "rightPlaqueOverride": "LIVE MASTER CRANE"
      },
      {
        "sceneKind": "cnt-docker-sock-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: COMMANDING THE CRANE OVER THE",
        "boardSubtitle": "T1611 DEFENSE EVASION -> BRAND-NEW TWIN PLATFORM",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "COMMANDING THE CRANE",
        "rightPlaqueOverride": "BRAND-NEW TWIN PLATFORM"
      },
      {
        "sceneKind": "cnt-docker-sock-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: FACTORY CHIEF SUPERVISOR OFFICE",
        "boardSubtitle": "T1611 INITIAL ACCESS -> MASTER TRANSFER LATCH",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "FACTORY CHIEF",
        "rightPlaqueOverride": "MASTER TRANSFER LATCH"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "MASTER CRANE JOYSTICK",
    "rightPlaque": "ORDERING AN OPEN-AIR"
  },
  {
    "scenarioId": "k8s-coredns-dns-poisoning-service-account-token-audit",
    "floor": "circular-tech",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16096779,
    "leftProp": "k8s-tower",
    "rightProp": "telecom-bridge",
    "centerMechanism": "arc",
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
        "sceneKind": "cnt-k8s-coredns-briefing",
        "mode": "overview-full",
        "boardTitle": "INTERNAL SWITCHBOARD PRINTED ADDRESS",
        "boardSubtitle": "T1557 PERSISTENCE -> EXFIL & IMPACT -> CREDENTIAL",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "INTERNAL SWITCHBOARD",
        "rightPlaqueOverride": "AUTOMATED SWITCHBOARD"
      },
      {
        "sceneKind": "cnt-k8s-coredns-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: OVER-GENEROUS BADGE FOR THE",
        "boardSubtitle": "T1557 PERSISTENCE -> CENTRAL TELEPHONE ADDRESS BOOK",
        "accentHex": 3718648,
        "secondaryHex": 16096779,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "OVER-GENEROUS BADGE FOR",
        "rightPlaqueOverride": "CENTRAL TELEPHONE"
      },
      {
        "sceneKind": "cnt-k8s-coredns-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BUILT-IN AUTO-REFRESH BELLBOY",
        "boardSubtitle": "T1557 EXFIL & IMPACT -> NOTICING THE PAGE CHECKSUM",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "BUILT-IN AUTO-REFRESH",
        "rightPlaqueOverride": "NOTICING THE PAGE"
      },
      {
        "sceneKind": "cnt-k8s-coredns-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: DEPARTMENTS DIALING THE FAMILIAR",
        "boardSubtitle": "T1528 CREDENTIAL ACCESS -> PRESENTING SECRET",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "DEPARTMENTS DIALING THE",
        "rightPlaqueOverride": "PRESENTING SECRET"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "INTERNAL SWITCHBOARD",
    "rightPlaque": "AUTOMATED SWITCHBOARD"
  },
  {
    "scenarioId": "k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "k8s-tower",
    "rightProp": "shipping-container",
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
        "sceneKind": "cnt-k8s-daemonset-briefing",
        "mode": "overview-full",
        "boardTitle": "ROGUE STAFFING ORDER WITH A",
        "boardSubtitle": "T1610 EXECUTION -> LATERAL & C2 -> DEFENSE EVASION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "ROGUE STAFFING ORDER",
        "rightPlaqueOverride": "PLACING A MASTER-KEYED"
      },
      {
        "sceneKind": "cnt-k8s-daemonset-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: FAKE BUILDING-MAINTENANCE SCHEDULE",
        "boardSubtitle": "T1610 EXECUTION -> UNIVERSAL IGNORE-ALL-WARNINGS",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "FAKE BUILDING-MAINTENANC",
        "rightPlaqueOverride": "UNIVERSAL IGNORE-ALL-WAR"
      },
      {
        "sceneKind": "cnt-k8s-daemonset-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: AUTOMATED DISPATCHER PLACING ONE",
        "boardSubtitle": "T1610 LATERAL & C2 -> DIRECT ACCESS TO FLOOR",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "AUTOMATED DISPATCHER",
        "rightPlaqueOverride": "DIRECT ACCESS TO FLOOR"
      },
      {
        "sceneKind": "cnt-k8s-daemonset-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SPY STATIONED INSIDE THE",
        "boardSubtitle": "T1611 DEFENSE EVASION -> ARCHITECTURAL BLUEPRINTS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "SPY STATIONED INSIDE",
        "rightPlaqueOverride": "ARCHITECTURAL"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "ROGUE STAFFING ORDER",
    "rightPlaque": "PLACING A MASTER-KEYED"
  },
  {
    "scenarioId": "k8s-ephemeral-debug-container-process-namespace-share-audit",
    "floor": "pier-dock",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 3718648,
    "leftProp": "shipping-container",
    "rightProp": "k8s-tower",
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
        "sceneKind": "cnt-k8s-ephemeral-briefing",
        "mode": "overview-full",
        "boardTitle": "ARMORED CASH VAN WITH ZERO DOOR HANDLES OR",
        "boardSubtitle": "T1609 EXECUTION -> CREDENTIAL ACCESS -> EXFIL &",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "ARMORED CASH VAN WITH",
        "rightPlaqueOverride": "BOLTING A TEMPORARY"
      },
      {
        "sceneKind": "cnt-k8s-ephemeral-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: ARMORED PAYMENTS VAN WITH NO",
        "boardSubtitle": "T1609 EXECUTION -> SPECIALIZED ROADSIDE-DEBUG PERMIT",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "ARMORED PAYMENTS VAN",
        "rightPlaqueOverride": "SPECIALIZED"
      },
      {
        "sceneKind": "cnt-k8s-ephemeral-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: LINKING DIRECTLY INTO THE MAIN",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> ACTIVE DRIVER",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "LINKING DIRECTLY INTO",
        "rightPlaqueOverride": "ACTIVE DRIVER WORKSPACE"
      },
      {
        "sceneKind": "cnt-k8s-ephemeral-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: DIAGNOSTIC BOOTH THAT CAN NEVER",
        "boardSubtitle": "T1609 EXFIL & IMPACT -> LIVE RADIO SESSION LOG",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "DIAGNOSTIC BOOTH THAT",
        "rightPlaqueOverride": "LIVE RADIO SESSION LOG"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "ARMORED CASH VAN WITH",
    "rightPlaque": "BOLTING A TEMPORARY"
  },
  {
    "scenarioId": "k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974",
    "floor": "pier-dock",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "k8s-tower",
    "centerMechanism": "arc",
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
        "sceneKind": "cnt-ingress-1974-briefing",
        "mode": "overview-full",
        "boardTitle": "SEAPORT CUSTOMS BOOTH TESTING PROPOSED",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> CREDENTIAL",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "SEAPORT CUSTOMS BOOTH",
        "rightPlaqueOverride": "LARGE PARCEL PARKED"
      },
      {
        "sceneKind": "cnt-ingress-1974-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CUSTOMS INSPECTION DESK",
        "boardSubtitle": "T1190 INITIAL ACCESS -> HEAVY SHIPPING DOSSIER",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "CUSTOMS INSPECTION DESK",
        "rightPlaqueOverride": "HEAVY SHIPPING DOSSIER"
      },
      {
        "sceneKind": "cnt-ingress-1974-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: DRAFT BLUEPRINT FED INTO THE",
        "boardSubtitle": "T1609 EXECUTION -> HIDDEN INSTRUCTIONS SLIPPING",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "DRAFT BLUEPRINT FED",
        "rightPlaqueOverride": "HIDDEN INSTRUCTIONS"
      },
      {
        "sceneKind": "cnt-ingress-1974-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: HARBOR-WIDE INSPECTION RING",
        "boardSubtitle": "T1552.007 CREDENTIAL ACCESS -> PHOTOCOPYING SEALED",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "HARBOR-WIDE INSPECTION",
        "rightPlaqueOverride": "PHOTOCOPYING SEALED"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "SEAPORT CUSTOMS BOOTH",
    "rightPlaque": "LARGE PARCEL PARKED"
  },
  {
    "scenarioId": "k8s-kubelet-anonymous-api-etcd-snapshot-forensics",
    "floor": "workshop-tile",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16096779,
    "leftProp": "hotel-desk",
    "rightProp": "vault-safe",
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
        "sceneKind": "cnt-kubelet-etcd-briefing",
        "mode": "overview-full",
        "boardTitle": "UNGUARDED FLOOR-MANAGER DESK WITH NO",
        "boardSubtitle": "T1613 CREDENTIAL ACCESS -> EXECUTION -> CREDENTIAL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UNGUARDED FLOOR-MANAGER",
        "rightPlaqueOverride": "GRABBING THE COMPLETE"
      },
      {
        "sceneKind": "cnt-kubelet-etcd-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNGUARDED FLOOR-MANAGER DESK",
        "boardSubtitle": "T1613 CREDENTIAL ACCESS -> FULL OCCUPANCY CLIPBOARD",
        "accentHex": 3718648,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "UNGUARDED FLOOR-MANAGER",
        "rightPlaqueOverride": "FULL OCCUPANCY CLIPBOARD"
      },
      {
        "sceneKind": "cnt-kubelet-etcd-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: DIRECT INTERCOM BUTTON ON THE",
        "boardSubtitle": "T1609 EXECUTION -> ISSUING LIVE WORK ORDERS INSIDE",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "DIRECT INTERCOM BUTTON",
        "rightPlaqueOverride": "ISSUING LIVE WORK"
      },
      {
        "sceneKind": "cnt-kubelet-etcd-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: VAULT CERTIFICATES ON THE CONTROL",
        "boardSubtitle": "T1552.007 CREDENTIAL ACCESS -> INSTANT PHOTOGRAPH",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "VAULT CERTIFICATES ON",
        "rightPlaqueOverride": "INSTANT PHOTOGRAPH OF"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "UNGUARDED FLOOR-MANAGER",
    "rightPlaque": "GRABBING THE COMPLETE"
  },
  {
    "scenarioId": "k8s-mutating-admission-webhook-sidecar-injection-audit",
    "floor": "conveyor-deck",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "mailroom-chute",
    "rightProp": "k8s-tower",
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
        "sceneKind": "cnt-k8s-webhook-briefing",
        "mode": "overview-full",
        "boardTitle": "REGISTERING AN UNAUTHORIZED INSPECTION",
        "boardSubtitle": "T1546 PERSISTENCE -> CREDENTIAL ACCESS -> EXECUTION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "REGISTERING AN",
        "rightPlaqueOverride": "MAILROOM HANDING COPIES"
      },
      {
        "sceneKind": "cnt-k8s-webhook-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: HIGH-LEVEL REGISTRATION RIGHTS",
        "boardSubtitle": "T1546 PERSISTENCE -> ROGUE REVIEW BOOTH BOLTED ONTO",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "HIGH-LEVEL REGISTRATION",
        "rightPlaqueOverride": "ROGUE REVIEW BOOTH"
      },
      {
        "sceneKind": "cnt-k8s-webhook-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: OBEDIENT FRONT-DESK DISPATCHER",
        "boardSubtitle": "T1552.007 CREDENTIAL ACCESS -> ENTIRE UNSEALED",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "OBEDIENT FRONT-DESK",
        "rightPlaqueOverride": "ENTIRE UNSEALED PACKAGE"
      },
      {
        "sceneKind": "cnt-k8s-webhook-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: SUBTLE MODIFICATION SLIP RETURNED",
        "boardSubtitle": "T1610 EXECUTION -> WELDING A STOWAWAY COMPARTMENT",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "SUBTLE MODIFICATION",
        "rightPlaqueOverride": "WELDING A STOWAWAY"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "REGISTERING AN",
    "rightPlaque": "MAILROOM HANDING COPIES"
  },
  {
    "scenarioId": "runc-leaky-vessels-cwd-fd-escape-cve-2024-21626",
    "floor": "pier-dock",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "shipping-container",
    "rightProp": "fortress-gate",
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
        "sceneKind": "cnt-runc-escape-briefing",
        "mode": "overview-full",
        "boardTitle": "TINY MAINTENANCE HATCH LEFT OPEN BEFORE",
        "boardSubtitle": "T1611 INITIAL ACCESS -> DEFENSE EVASION",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "TINY MAINTENANCE HATCH",
        "rightPlaqueOverride": "STEPPING BACKWARD OUT"
      },
      {
        "sceneKind": "cnt-runc-escape-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: DOCK CRANE OPERATOR LAUNCHING THE",
        "boardSubtitle": "T1611 INITIAL ACCESS -> INTERNAL CORRIDOR DOOR LEFT",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "DOCK CRANE OPERATOR",
        "rightPlaqueOverride": "INTERNAL CORRIDOR DOOR"
      },
      {
        "sceneKind": "cnt-runc-escape-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ONE FOOT ANCHORED ON THE OUTSIDE",
        "boardSubtitle": "T1611 DEFENSE EVASION -> WALKING BACKWARD A FEW",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "ONE FOOT ANCHORED ON",
        "rightPlaqueOverride": "WALKING BACKWARD A FEW"
      },
      {
        "sceneKind": "cnt-runc-escape-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: CAPTAIN QUARTERS RADIO PASSES",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> ENGINE-ROOM MORNING",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "CAPTAIN QUARTERS RADIO",
        "rightPlaqueOverride": "ENGINE-ROOM MORNING"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "TINY MAINTENANCE HATCH",
    "rightPlaque": "STEPPING BACKWARD OUT"
  }
];

export function buildContainersKubernetesScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
