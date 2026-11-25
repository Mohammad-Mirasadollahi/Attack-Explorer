import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "mobile-android-binder-gpu-selinux-audit-forensics",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 1096065,
    "secondaryHex": 16007006,
    "leftProp": "smartphone-chassis",
    "rightProp": "kernel-courthouse",
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
        "sceneKind": "mob-android-gpu-briefing",
        "mode": "overview-full",
        "boardTitle": "WALLED GLASS PLAYROOM -> GRAPHICS",
        "boardSubtitle": "T1404 DEFENSE EVASION -> DEFENSE EVASION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "WALLED GLASS PLAYROOM",
        "rightPlaqueOverride": "GRAPHICS PASS-THROUGH"
      },
      {
        "sceneKind": "mob-android-gpu-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: WALLED GLASS PLAYROOM",
        "boardSubtitle": "T1404 DEFENSE EVASION -> GRAPHICS & INTERCOM SLOTS",
        "accentHex": 1096065,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "WALLED GLASS PLAYROOM",
        "rightPlaqueOverride": "GRAPHICS & INTERCOM"
      },
      {
        "sceneKind": "mob-android-gpu-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ERASING VISITOR WRISTBAND TO ZERO",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> FLIPPING ENFORCEMENT",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "ERASING VISITOR",
        "rightPlaqueOverride": "FLIPPING ENFORCEMENT"
      },
      {
        "sceneKind": "mob-android-gpu-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: SKIPPING FRONT APP DIRECTORY",
        "boardSubtitle": "T1623 EXECUTION -> BUILT-IN RUNTIME ENGINE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "SKIPPING FRONT APP",
        "rightPlaqueOverride": "BUILT-IN RUNTIME ENGINE"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "WALLED GLASS PLAYROOM",
    "rightPlaque": "GRAPHICS PASS-THROUGH"
  },
  {
    "scenarioId": "mobile-operation-triangulation-ios-shutdown-log-mvt-forensics",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "smartphone-chassis",
    "rightProp": "mail-chute",
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
        "sceneKind": "mob-triangulation-briefing",
        "mode": "overview-full",
        "boardTitle": "UNREAD POSTCARD UNDER DOOR -> GHOST BURGLAR",
        "boardSubtitle": "T1456 INITIAL ACCESS -> DEFENSE EVASION -> EXFIL &",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "UNREAD POSTCARD UNDER",
        "rightPlaqueOverride": "GHOST BURGLAR BURNING"
      },
      {
        "sceneKind": "mob-triangulation-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: AUTOMATED MAIL SORTER",
        "boardSubtitle": "T1456 INITIAL ACCESS -> RIGGED POSTCARD",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "AUTOMATED MAIL SORTER",
        "rightPlaqueOverride": "RIGGED POSTCARD"
      },
      {
        "sceneKind": "mob-triangulation-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: TEMPORARY HALLWAY LOCKER",
        "boardSubtitle": "T1070.004 DEFENSE EVASION -> SHREDDING WORKING FILES",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "TEMPORARY HALLWAY LOCKER",
        "rightPlaqueOverride": "SHREDDING WORKING FILES"
      },
      {
        "sceneKind": "mob-triangulation-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: PERMANENT UTILITY BILLING BOOKS",
        "boardSubtitle": "T1041 EXFIL & IMPACT -> BROOM-CLOSET SERVICE NAME",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PERMANENT UTILITY",
        "rightPlaqueOverride": "BROOM-CLOSET SERVICE"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "UNREAD POSTCARD UNDER",
    "rightPlaque": "GHOST BURGLAR BURNING"
  },
  {
    "scenarioId": "mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "smartphone-chassis",
    "rightProp": "model-crate",
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
        "sceneKind": "mob-pegasus-briefing",
        "mode": "overview-full",
        "boardTitle": "FAKE GREETING CARD CONCEALING BLUEPRINT",
        "boardSubtitle": "T1203 INITIAL ACCESS -> EXECUTION -> LATERAL & C2",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "FAKE GREETING CARD",
        "rightPlaqueOverride": "ARMORED INSPECTION"
      },
      {
        "sceneKind": "mob-pegasus-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: ATTACHMENT DELIVERY CLERK",
        "boardSubtitle": "T1203 INITIAL ACCESS -> HARMLESS PICTURE LABEL",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "ATTACHMENT DELIVERY",
        "rightPlaqueOverride": "HARMLESS PICTURE LABEL"
      },
      {
        "sceneKind": "mob-pegasus-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: GRAPHICS PRESS OUTSIDE CHAMBER",
        "boardSubtitle": "T1203 EXECUTION -> SEVENTY-THOUSAND-STEP LOGIC GATES",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "GRAPHICS PRESS OUTSIDE",
        "rightPlaqueOverride": "SEVENTY-THOUSAND-STEP"
      },
      {
        "sceneKind": "mob-pegasus-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: PERMANENT NETWORK BILLING LEDGERS",
        "boardSubtitle": "T1071.001 LATERAL & C2 -> MYSTERY WORKER WITHOUT",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PERMANENT NETWORK",
        "rightPlaqueOverride": "MYSTERY WORKER WITHOUT"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "FAKE GREETING CARD",
    "rightPlaque": "ARMORED INSPECTION"
  },
  {
    "scenarioId": "telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics",
    "floor": "pier-dock",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 16096779,
    "leftProp": "telecom-bridge",
    "rightProp": "mailroom-chute",
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
        "sceneKind": "tel-lightbasin-briefing",
        "mode": "overview-full",
        "boardTitle": "INTERNATIONAL POSTAL BRIDGE -> REQUESTING",
        "boardSubtitle": "T1133 INITIAL ACCESS -> LATERAL & C2 -> PERSISTENCE",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "INTERNATIONAL POSTAL",
        "rightPlaqueOverride": "REQUESTING SEALED"
      },
      {
        "sceneKind": "tel-lightbasin-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: FOREIGN END OF POSTAL BRIDGE",
        "boardSubtitle": "T1133 INITIAL ACCESS -> COUNTERFEIT CARRIER",
        "accentHex": 2282478,
        "secondaryHex": 16096779,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "FOREIGN END OF POSTAL",
        "rightPlaqueOverride": "COUNTERFEIT CARRIER"
      },
      {
        "sceneKind": "tel-lightbasin-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: STAMPED MAILBAG TRACKING TAG",
        "boardSubtitle": "T1572 LATERAL & C2 -> SEALED ROAMING POUCHES",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "STAMPED MAILBAG",
        "rightPlaqueOverride": "SEALED ROAMING POUCHES"
      },
      {
        "sceneKind": "tel-lightbasin-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: RIGGED STAFF BADGE READER",
        "boardSubtitle": "T1556.003 PERSISTENCE -> HIDDEN RECEPTION",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "RIGGED STAFF BADGE",
        "rightPlaqueOverride": "HIDDEN RECEPTION"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "INTERNATIONAL POSTAL",
    "rightPlaque": "REQUESTING SEALED"
  },
  {
    "scenarioId": "telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit",
    "floor": "circular-tech",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "telecom-bridge",
    "rightProp": "oauth-kiosk",
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
        "sceneKind": "tel-salt-typhoon-briefing",
        "mode": "overview-full",
        "boardTitle": "HIGH-SPEED GLASS HALLWAY -> CENTRAL",
        "boardSubtitle": "T1528 CREDENTIAL ACCESS -> EXFIL & IMPACT",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "HIGH-SPEED GLASS HALLWAY",
        "rightPlaqueOverride": "CENTRAL REGISTRY BOOTH"
      },
      {
        "sceneKind": "tel-salt-typhoon-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNREGISTERED MAINTENANCE TERMINAL",
        "boardSubtitle": "T1528 CREDENTIAL ACCESS -> BOGUS DEPARTMENT CARD",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "UNREGISTERED",
        "rightPlaqueOverride": "BOGUS DEPARTMENT CARD"
      },
      {
        "sceneKind": "tel-salt-typhoon-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FRESHLY STAMPED HALLWAY PASS",
        "boardSubtitle": "T1557 EXFIL & IMPACT -> PASSENGER-TRACKING DESK",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "FRESHLY STAMPED HALLWAY",
        "rightPlaqueOverride": "PASSENGER-TRACKING DESK"
      },
      {
        "sceneKind": "tel-salt-typhoon-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: INTERNATIONAL ROAMING CHECKPOINT",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> CROSS-BORDER",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "INTERNATIONAL ROAMING",
        "rightPlaqueOverride": "CROSS-BORDER"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "HIGH-SPEED GLASS HALLWAY",
    "rightPlaque": "CENTRAL REGISTRY BOOTH"
  }
];

export function buildMobileTelecomScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
