import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "ics-frostygoop-modbus-tcp-district-heating-controller-audit",
    "floor": "workshop-tile",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16347926,
    "leftProp": "heating-boiler",
    "rightProp": "fortress-gate",
    "centerMechanism": "arc",
    "leftActor": {
      "coatHex": 11817737,
      "accentHex": 16436245,
      "hatType": "visor"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "ics-frostygoop-briefing",
        "mode": "overview-full",
        "boardTitle": "UNLOCKED STREET INTERCOM -> OUTSIDE WINTER",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXFIL & IMPACT -> EXFIL &",
        "storyPlotOverride": "swarm-containment",
        "leftPlaqueOverride": "UNLOCKED STREET INTERCOM",
        "rightPlaqueOverride": "OUTSIDE WINTER CALLER"
      },
      {
        "sceneKind": "ics-frostygoop-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PRESSING UNLOCKED DOORBELL",
        "boardSubtitle": "T1190 INITIAL ACCESS -> REQUESTING MANUFACTURER",
        "accentHex": 3718648,
        "secondaryHex": 16347926,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PRESSING UNLOCKED",
        "rightPlaqueOverride": "REQUESTING MANUFACTURER"
      },
      {
        "sceneKind": "ics-frostygoop-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PREWRITTEN CHECKLIST OF ROOMS",
        "boardSubtitle": "T1005 EXFIL & IMPACT -> SWEEPING BANK OF BOILER",
        "accentHex": 16096779,
        "secondaryHex": 16347926,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "PREWRITTEN CHECKLIST OF",
        "rightPlaqueOverride": "SWEEPING BANK OF BOILER"
      },
      {
        "sceneKind": "ics-frostygoop-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: TWISTING CALIBRATION SCREWS",
        "boardSubtitle": "T1565.002 EXFIL & IMPACT -> VALVE & THERMAL TARGETS",
        "accentHex": 16347926,
        "secondaryHex": 1096065,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "TWISTING CALIBRATION",
        "rightPlaqueOverride": "VALVE & THERMAL TARGETS"
      }
    ],
    "storyPlot": "swarm-containment",
    "leftPlaque": "UNLOCKED STREET INTERCOM",
    "rightPlaque": "OUTSIDE WINTER CALLER"
  },
  {
    "scenarioId": "ics-industroyer2-iec-60870-5-104-substation-telemetry",
    "floor": "circular-tech",
    "wallHex": 1976635,
    "accentHex": 16436245,
    "secondaryHex": 16007006,
    "leftProp": "substation-breakers",
    "rightProp": "broadcast-tower",
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
        "sceneKind": "ics-industroyer2-briefing",
        "mode": "overview-full",
        "boardTitle": "ROGUE NIGHT-SHIFT DISPATCHER -> LOCKING OUT",
        "boardSubtitle": "T1489 EXFIL & IMPACT -> LATERAL & C2 -> EXFIL &",
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "ROGUE NIGHT-SHIFT",
        "rightPlaqueOverride": "LOCKING OUT CHIEF"
      },
      {
        "sceneKind": "ics-industroyer2-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SUBSTATION CONTROL BOOTH",
        "boardSubtitle": "T1489 EXFIL & IMPACT -> LEGITIMATE CHIEF OPERATOR",
        "accentHex": 16436245,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "SUBSTATION CONTROL BOOTH",
        "rightPlaqueOverride": "LEGITIMATE CHIEF"
      },
      {
        "sceneKind": "ics-industroyer2-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: LAMINATED CARD OF NUMBERS",
        "boardSubtitle": "T1071 LATERAL & C2 -> DEDICATED UTILITY HOTLINE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "LAMINATED CARD OF",
        "rightPlaqueOverride": "DEDICATED UTILITY"
      },
      {
        "sceneKind": "ics-industroyer2-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: MARCHING DOWN LAMINATED LIST",
        "boardSubtitle": "T1565.002 EXFIL & IMPACT -> THROWING HIGH-VOLTAGE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "MARCHING DOWN LAMINATED",
        "rightPlaqueOverride": "THROWING HIGH-VOLTAGE"
      }
    ],
    "storyPlot": "mirror-proxy-bounce",
    "leftPlaque": "ROGUE NIGHT-SHIFT",
    "rightPlaque": "LOCKING OUT CHIEF"
  },
  {
    "scenarioId": "ics-pipedream-incontroller-codesys-modbus-opcua",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "plc-toolbox",
    "rightProp": "substation-breakers",
    "centerMechanism": "scanner",
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
        "sceneKind": "ics-pipedream-briefing",
        "mode": "overview-full",
        "boardTitle": "SWISS-ARMY FACTORY TOOLBOX -> CONTROL",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> LATERAL & C2 -> EXFIL &",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "SWISS-ARMY FACTORY",
        "rightPlaqueOverride": "CONTROL HALLWAY DIAL"
      },
      {
        "sceneKind": "ics-pipedream-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: HIJACKED SUPERVISOR CONSOLE",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> SCOUTING GAUGE TOOL",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "HIJACKED SUPERVISOR",
        "rightPlaqueOverride": "SCOUTING GAUGE TOOL"
      },
      {
        "sceneKind": "ics-pipedream-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FORGED MAINTENANCE CARTRIDGE",
        "boardSubtitle": "T1021 LATERAL & C2 -> CONTROLLER CABINET",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "FORGED MAINTENANCE",
        "rightPlaqueOverride": "CONTROLLER CABINET"
      },
      {
        "sceneKind": "ics-pipedream-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: RAW PIPE MANIFOLD",
        "boardSubtitle": "T1565.002 EXFIL & IMPACT -> CRANKING PRESSURE DIALS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "RAW PIPE MANIFOLD",
        "rightPlaqueOverride": "CRANKING PRESSURE DIALS"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "SWISS-ARMY FACTORY",
    "rightPlaque": "CONTROL HALLWAY DIAL"
  },
  {
    "scenarioId": "ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "centrifuge-hall",
    "rightProp": "plc-toolbox",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 11817737,
      "accentHex": 16436245,
      "hatType": "visor"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "ics-stuxnet-briefing",
        "mode": "overview-full",
        "boardTitle": "DOUBLE-AGENT GLASS TRANSLATOR -> ORIGINAL",
        "boardSubtitle": "T1574.001 PERSISTENCE -> EXECUTION -> DEFENSE EVASION",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "DOUBLE-AGENT GLASS",
        "rightPlaqueOverride": "ORIGINAL OFFICIAL"
      },
      {
        "sceneKind": "ics-stuxnet-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: ENGINEERING CONTROL BOOTH",
        "boardSubtitle": "T1574.001 PERSISTENCE -> REAL TRANSLATOR MOVED TO",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "ENGINEERING CONTROL",
        "rightPlaqueOverride": "REAL TRANSLATOR MOVED"
      },
      {
        "sceneKind": "ics-stuxnet-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: CONFIRMING CENTRIFUGE DRIVE MODEL",
        "boardSubtitle": "T1059 EXECUTION -> OFFICIAL HALLWAY CABLE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "CONFIRMING CENTRIFUGE",
        "rightPlaqueOverride": "OFFICIAL HALLWAY CABLE"
      },
      {
        "sceneKind": "ics-stuxnet-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: HOLDING UP A FAKE PHOTOCOPY",
        "boardSubtitle": "T1564 DEFENSE EVASION -> ENGINEER INSPECTION SCREEN",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "HOLDING UP A FAKE",
        "rightPlaqueOverride": "ENGINEER INSPECTION"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "DOUBLE-AGENT GLASS",
    "rightPlaque": "ORIGINAL OFFICIAL"
  },
  {
    "scenarioId": "ics-trisis-triton-schneider-triconex-sis-telemetry",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 1096065,
    "secondaryHex": 16007006,
    "leftProp": "safety-judges",
    "rightProp": "heating-boiler",
    "centerMechanism": "key-handoff",
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
        "sceneKind": "ics-trisis-briefing",
        "mode": "overview-full",
        "boardTitle": "FORGED INSPECTOR JACKET -> BRASS",
        "boardSubtitle": "T1036.005 DEFENSE EVASION -> CREDENTIAL ACCESS",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "FORGED INSPECTOR JACKET",
        "rightPlaqueOverride": "BRASS MAINTENANCE KEY"
      },
      {
        "sceneKind": "ics-trisis-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SAFETY ENGINEER WORKBENCH",
        "boardSubtitle": "T1036.005 DEFENSE EVASION -> COUNTERFEIT DIAGNOSTIC",
        "accentHex": 1096065,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "SAFETY ENGINEER",
        "rightPlaqueOverride": "COUNTERFEIT DIAGNOSTIC"
      },
      {
        "sceneKind": "ics-trisis-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: POLITE TEST TAP ON INTERCOM",
        "boardSubtitle": "T1082 CREDENTIAL ACCESS -> FRONT-PANEL STATUS LIGHT",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "POLITE TEST TAP ON",
        "rightPlaqueOverride": "FRONT-PANEL STATUS LIGHT"
      },
      {
        "sceneKind": "ics-trisis-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: CUSTOM REPLACEMENT RULES",
        "boardSubtitle": "T1542 PERSISTENCE -> EMERGENCY BRAIN MEMORY SLOTS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "CUSTOM REPLACEMENT RULES",
        "rightPlaqueOverride": "EMERGENCY BRAIN MEMORY"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "FORGED INSPECTOR JACKET",
    "rightPlaque": "BRASS MAINTENANCE KEY"
  }
];

export function buildIcsOtScadaScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
