import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "array-networks-ag-vxag-cve-2023-28461",
    "floor": "pier-dock",
    "wallHex": 1976635,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "mail-chute",
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
        "sceneKind": "zday-array-briefing",
        "mode": "overview-full",
        "boardTitle": "INTERNAL CARGO-HANDLING FLAG ON AN",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> DEFENSE",
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "INTERNAL CARGO-HANDLING",
        "rightPlaqueOverride": "HARBOR MASTER LEDGER"
      },
      {
        "sceneKind": "zday-array-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: STAMPED INTERNAL CARGO-SHARING TAG",
        "boardSubtitle": "T1190 INITIAL ACCESS -> BERTH PATH WITH A BLANK",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "STAMPED INTERNAL",
        "rightPlaqueOverride": "BERTH PATH WITH A BLANK"
      },
      {
        "sceneKind": "zday-array-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: HARBOR MASTER BOOK",
        "boardSubtitle": "T1505.003 PERSISTENCE -> SILENT MESSAGE CLERK",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "HARBOR MASTER BOOK",
        "rightPlaqueOverride": "SILENT MESSAGE CLERK"
      },
      {
        "sceneKind": "zday-array-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: HIDDEN WAREHOUSE RELAY",
        "boardSubtitle": "T1127.001 DEFENSE EVASION -> TRUSTED MAINTENANCE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "HIDDEN WAREHOUSE RELAY",
        "rightPlaqueOverride": "TRUSTED MAINTENANCE"
      }
    ],
    "storyPlot": "mirror-proxy-bounce",
    "leftPlaque": "INTERNAL CARGO-HANDLING",
    "rightPlaque": "HARBOR MASTER LEDGER"
  },
  {
    "scenarioId": "check-point-vpn-cve-2024-24919-info-leak",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 16007006,
    "secondaryHex": 16436245,
    "leftProp": "fortress-gate",
    "rightProp": "vault-safe",
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
        "sceneKind": "zday-checkpoint-briefing",
        "mode": "overview-full",
        "boardTitle": "PUBLIC CERTIFICATE WINDOW -> STAIR-STEPPING",
        "boardSubtitle": "T1190 INITIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PUBLIC CERTIFICATE",
        "rightPlaqueOverride": "STAIR-STEPPING FOLDER"
      },
      {
        "sceneKind": "zday-checkpoint-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: GATEHOUSE CERTIFICATE WINDOW",
        "boardSubtitle": "T1190 INITIAL ACCESS -> BACKWARD STEP MARKERS",
        "accentHex": 16007006,
        "secondaryHex": 16436245,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "GATEHOUSE CERTIFICATE",
        "rightPlaqueOverride": "BACKWARD STEP MARKERS"
      },
      {
        "sceneKind": "zday-checkpoint-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: OPEN ARCHIVE CHUTE",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> LOCAL GATEHOUSE",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "OPEN ARCHIVE CHUTE",
        "rightPlaqueOverride": "LOCAL GATEHOUSE"
      },
      {
        "sceneKind": "zday-checkpoint-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: FRONT DRAWBRIDGE",
        "boardSubtitle": "T1003.003 CREDENTIAL ACCESS -> STOLEN PALACE",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "FRONT DRAWBRIDGE",
        "rightPlaqueOverride": "STOLEN PALACE COURIER"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "PUBLIC CERTIFICATE",
    "rightPlaque": "STAIR-STEPPING FOLDER"
  },
  {
    "scenarioId": "fortimanager-fgd-jump-cve-2024-47575",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "telecom-bridge",
    "rightProp": "notary-press",
    "centerMechanism": "key-handoff",
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
        "sceneKind": "zday-fortimanager-briefing",
        "mode": "overview-full",
        "boardTitle": "CENTRAL SWITCHBOARD TOWER -> SIDE TELEGRAPH",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> EXFIL & IMPACT",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "CENTRAL SWITCHBOARD",
        "rightPlaqueOverride": "SIDE TELEGRAPH LINE"
      },
      {
        "sceneKind": "zday-fortimanager-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: TOWER SIDE TELEGRAPH LINE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> SELF-STAMPED BRASS EMBLEM",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "TOWER SIDE TELEGRAPH",
        "rightPlaqueOverride": "SELF-STAMPED BRASS"
      },
      {
        "sceneKind": "zday-fortimanager-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BLUEPRINT-CHECKOUT ORDER",
        "boardSubtitle": "T1059.004 EXECUTION -> HIDDEN COMMANDS BEHIND A",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "BLUEPRINT-CHECKOUT ORDER",
        "rightPlaqueOverride": "HIDDEN COMMANDS BEHIND"
      },
      {
        "sceneKind": "zday-fortimanager-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: BRANCH-STATION FILING CABINETS",
        "boardSubtitle": "T1005 EXFIL & IMPACT -> TIGHTLY BOUND STEAMER TRUNK",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "BRANCH-STATION FILING",
        "rightPlaqueOverride": "TIGHTLY BOUND STEAMER"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "CENTRAL SWITCHBOARD",
    "rightPlaque": "SIDE TELEGRAPH LINE"
  },
  {
    "scenarioId": "ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit",
    "floor": "workshop-tile",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "library-toggle",
    "rightProp": "oauth-kiosk",
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
        "sceneKind": "zday-ivanti-vtm-briefing",
        "mode": "overview-full",
        "boardTitle": "UNLATCHED INITIAL SETUP SIDE WINDOW",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> EXECUTION",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "UNLATCHED INITIAL SETUP",
        "rightPlaqueOverride": "TOWER PERMANENT"
      },
      {
        "sceneKind": "zday-ivanti-vtm-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: EXPOSED MANAGEMENT RAMP",
        "boardSubtitle": "T1190 INITIAL ACCESS -> UNLATCHED SETUP-WIZARD SIDE",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "EXPOSED MANAGEMENT RAMP",
        "rightPlaqueOverride": "UNLATCHED SETUP-WIZARD"
      },
      {
        "sceneKind": "zday-ivanti-vtm-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: TOLL-PLAZA MASTER EMPLOYEE LEDGER",
        "boardSubtitle": "T1136.001 PERSISTENCE -> BRAND-NEW FULL SUPERVISOR",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "TOLL-PLAZA MASTER",
        "rightPlaqueOverride": "BRAND-NEW FULL"
      },
      {
        "sceneKind": "zday-ivanti-vtm-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: FRONT SUPERVISOR DOOR",
        "boardSubtitle": "T1059.004 EXECUTION -> FRESHLY MINTED SUPERVISOR",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "FRONT SUPERVISOR DOOR",
        "rightPlaqueOverride": "FRESHLY MINTED"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "UNLATCHED INITIAL SETUP",
    "rightPlaque": "TOWER PERMANENT"
  },
  {
    "scenarioId": "paloalto-expedition-cve-2024-5910-chain",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16347926,
    "secondaryHex": 3718648,
    "leftProp": "vault-safe",
    "rightProp": "library-toggle",
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
        "sceneKind": "zday-expedition-briefing",
        "mode": "overview-full",
        "boardTitle": "LOCKSMITH MIGRATION WORKSHOP -> UNGUARDED",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> CREDENTIAL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "LOCKSMITH MIGRATION",
        "rightPlaqueOverride": "UNGUARDED EMERGENCY"
      },
      {
        "sceneKind": "zday-expedition-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: EXPOSED EMERGENCY RESET SWITCH",
        "boardSubtitle": "T1190 INITIAL ACCESS -> MISSING EMPLOYEE BADGE CHECK",
        "accentHex": 16347926,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "EXPOSED EMERGENCY RESET",
        "rightPlaqueOverride": "MISSING EMPLOYEE BADGE"
      },
      {
        "sceneKind": "zday-expedition-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: MIGRATION INTAKE FORM WITH HIDDEN",
        "boardSubtitle": "T1059.004 EXECUTION -> AUTOMATED SCHEDULING BELT",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MIGRATION INTAKE FORM",
        "rightPlaqueOverride": "AUTOMATED SCHEDULING"
      },
      {
        "sceneKind": "zday-expedition-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: LEDGER CABINET",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> MASTER DECODING KEY",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "LEDGER CABINET",
        "rightPlaqueOverride": "MASTER DECODING KEY OFF"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "LOCKSMITH MIGRATION",
    "rightPlaque": "UNGUARDED EMERGENCY"
  },
  {
    "scenarioId": "sonicwall-sslvpn-cve-2024-40766-akira",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 16007006,
    "secondaryHex": 16096779,
    "leftProp": "fortress-gate",
    "rightProp": "hypervisor-vault",
    "centerMechanism": "padlock-wave",
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
        "sceneKind": "zday-sonicwall-briefing",
        "mode": "overview-full",
        "boardTitle": "LOBBY REVOLVING DOOR KEYPAD -> FAULTY LOCK",
        "boardSubtitle": "T1190 INITIAL ACCESS -> LATERAL & C2 -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "LOBBY REVOLVING DOOR",
        "rightPlaqueOverride": "FAULTY LOCK MECHANISM"
      },
      {
        "sceneKind": "zday-sonicwall-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: REMOTE VISITOR DOOR",
        "boardSubtitle": "T1190 INITIAL ACCESS -> FAULTY LATCH FLAW",
        "accentHex": 16007006,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "REMOTE VISITOR DOOR",
        "rightPlaqueOverride": "FAULTY LATCH FLAW"
      },
      {
        "sceneKind": "zday-sonicwall-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: HALLWAY FLOOR DIRECTORY",
        "boardSubtitle": "T1021.002 LATERAL & C2 -> REMOTE MAINTENANCE ORDERS",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "HALLWAY FLOOR DIRECTORY",
        "rightPlaqueOverride": "REMOTE MAINTENANCE"
      },
      {
        "sceneKind": "zday-sonicwall-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: WHEELING CARTONS OUT THE LOADING",
        "boardSubtitle": "T1490 EXFIL & IMPACT -> INDUSTRIAL SHREDDER",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "WHEELING CARTONS OUT",
        "rightPlaqueOverride": "INDUSTRIAL SHREDDER"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "LOBBY REVOLVING DOOR",
    "rightPlaque": "FAULTY LOCK MECHANISM"
  },
  {
    "scenarioId": "sophos-firewall-cve-2022-3236-asnarok",
    "floor": "split-dual",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "hotel-desk",
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
        "sceneKind": "zday-sophos-briefing",
        "mode": "overview-full",
        "boardTitle": "FRONT GUARD STOPPING AT AN INVISIBLE BLANK",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> CREDENTIAL",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "FRONT GUARD STOPPING AT",
        "rightPlaqueOverride": "BACK-OFFICE DIRECTOR"
      },
      {
        "sceneKind": "zday-sophos-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: FRONT RECEPTION DESK",
        "boardSubtitle": "T1190 INITIAL ACCESS -> NORMAL-LOOKING ENTRY SLIP",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "FRONT RECEPTION DESK",
        "rightPlaqueOverride": "NORMAL-LOOKING ENTRY"
      },
      {
        "sceneKind": "zday-sophos-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SENIOR CONTROLLER WITH MASTER",
        "boardSubtitle": "T1059.004 EXECUTION -> EXECUTING HIDDEN",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SENIOR CONTROLLER WITH",
        "rightPlaqueOverride": "EXECUTING HIDDEN"
      },
      {
        "sceneKind": "zday-sophos-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: CARBON-COPY SHEET UNDER THE",
        "boardSubtitle": "T1556 CREDENTIAL ACCESS -> HIDDEN POCKET STORING",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "CARBON-COPY SHEET UNDER",
        "rightPlaqueOverride": "HIDDEN POCKET STORING"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "FRONT GUARD STOPPING AT",
    "rightPlaque": "BACK-OFFICE DIRECTOR"
  },
  {
    "scenarioId": "versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "mail-chute",
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
        "sceneKind": "zday-versa-sdwan-briefing",
        "mode": "overview-full",
        "boardTitle": "SIDE EMBLEM CHUTE MEANT FOR PAINTED STATION",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> DEFENSE",
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "SIDE EMBLEM CHUTE MEANT",
        "rightPlaqueOverride": "FOLDED CLOCKWORK GEAR"
      },
      {
        "sceneKind": "zday-versa-sdwan-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SIDE COORDINATION CHUTE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> METAL CLOCKWORK ASSEMBLY",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SIDE COORDINATION CHUTE",
        "rightPlaqueOverride": "METAL CLOCKWORK"
      },
      {
        "sceneKind": "zday-versa-sdwan-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: OFFICIAL MAINTENANCE COUPLING",
        "boardSubtitle": "T1505.003 PERSISTENCE -> SNAPPING THE GEAR ONTO THE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "OFFICIAL MAINTENANCE",
        "rightPlaqueOverride": "SNAPPING THE GEAR ONTO"
      },
      {
        "sceneKind": "zday-versa-sdwan-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: SWEEPING THE ORIGINAL PACKAGE",
        "boardSubtitle": "T1070.004 DEFENSE EVASION -> CASUAL LOOK INSIDE THE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SWEEPING THE ORIGINAL",
        "rightPlaqueOverride": "CASUAL LOOK INSIDE THE"
      }
    ],
    "storyPlot": "freeze-and-swap",
    "leftPlaque": "SIDE EMBLEM CHUTE MEANT",
    "rightPlaque": "FOLDED CLOCKWORK GEAR"
  },
  {
    "scenarioId": "vulncheck-cwp-preauth-module-dispatch-rce",
    "floor": "two-level-cutaway",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "hotel-desk",
    "rightProp": "pneumatic-tube",
    "centerMechanism": "key-handoff",
    "leftActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "rightActor": {
      "coatHex": 4674921,
      "accentHex": 3718648,
      "hatType": "none"
    },
    "sections": [
      {
        "sceneKind": "zday-cwp-rce-briefing",
        "mode": "overview-full",
        "boardTitle": "LOBBY RECEPTIONIST OPENING FOLDERS AFTER A",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> DEFENSE EVASION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "LOBBY RECEPTIONIST",
        "rightPlaqueOverride": "SELF-STARTING WORKSHOP"
      },
      {
        "sceneKind": "zday-cwp-rce-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: BUZZER RESPONSES REVEALING A REAL",
        "boardSubtitle": "T1190 INITIAL ACCESS -> REDIRECT NOTICE THAT FAILS",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "BUZZER RESPONSES",
        "rightPlaqueOverride": "REDIRECT NOTICE THAT"
      },
      {
        "sceneKind": "zday-cwp-rce-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SELF-RUNNING TENANT WORKSHOP",
        "boardSubtitle": "T1059.004 EXECUTION -> NAMING THE DRAWER ON THE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SELF-RUNNING TENANT",
        "rightPlaqueOverride": "NAMING THE DRAWER ON"
      },
      {
        "sceneKind": "zday-cwp-rce-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: BASEMENT DUMBWAITER SHAFT",
        "boardSubtitle": "T1068 DEFENSE EVASION -> BOILER-ROOM INTERCOM",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "BASEMENT DUMBWAITER",
        "rightPlaqueOverride": "BOILER-ROOM INTERCOM"
      },
      {
        "sceneKind": "zday-cwp-rce-step-4",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 04: LOCKED DOORS CHECKING A VISITOR",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> TRICK QUESTION",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "LOCKED DOORS CHECKING A",
        "rightPlaqueOverride": "TRICK QUESTION MAKING"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "LOBBY RECEPTIONIST",
    "rightPlaque": "SELF-STARTING WORKSHOP"
  }
];

export function buildZeroDayAppliancesScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
