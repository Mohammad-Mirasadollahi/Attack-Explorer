import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "log4shell-dfir",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "hotel-desk",
    "rightProp": "telecom-bridge",
    "centerMechanism": "arc",
    "leftActor": {
      "coatHex": 4674921,
      "accentHex": 3718648,
      "hatType": "none"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-log4shell-briefing",
        "mode": "overview-full",
        "boardTitle": "SMART RECEPTION LEDGER -> GUEST BADGE NOTE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> EXECUTION",
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "SMART RECEPTION LEDGER",
        "rightPlaqueOverride": "GUEST BADGE NOTE"
      },
      {
        "sceneKind": "net-log4shell-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: FRONT DESK COUNTER",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PAPER BADGE NOTE",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "FRONT DESK COUNTER",
        "rightPlaqueOverride": "PAPER BADGE NOTE"
      },
      {
        "sceneKind": "net-log4shell-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BUILT-IN LEDGER DIALER",
        "boardSubtitle": "T1203 EXECUTION -> LOBBY SWITCHBOARD",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "leftPropOverride": "hotel-desk",
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "BUILT-IN LEDGER DIALER",
        "rightPlaqueOverride": "LOBBY SWITCHBOARD"
      },
      {
        "sceneKind": "net-log4shell-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: FORWARDING SLIP",
        "boardSubtitle": "T1105 EXECUTION -> NEARBY STREET KIOSK",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "rightPropOverride": "mail-chute",
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "FORWARDING SLIP",
        "rightPlaqueOverride": "NEARBY STREET KIOSK"
      },
      {
        "sceneKind": "net-log4shell-step-4",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 04: COVER PAGE SETUP CHECKLIST",
        "boardSubtitle": "T1059.004 LATERAL & C2 -> BACK-OFFICE HANDSET",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "COVER PAGE SETUP",
        "rightPlaqueOverride": "BACK-OFFICE HANDSET"
      }
    ],
    "storyPlot": "mirror-proxy-bounce",
    "leftPlaque": "SMART RECEPTION LEDGER",
    "rightPlaque": "GUEST BADGE NOTE"
  },
  {
    "scenarioId": "dns-tunneling-exfil",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
    "accentHex": 2282478,
    "secondaryHex": 16096779,
    "leftProp": "mail-chute",
    "rightProp": "fortress-gate",
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
        "sceneKind": "net-dnstunnel-briefing",
        "mode": "overview-full",
        "boardTitle": "FRONT MAIL SLOT -> CODED POSTCARD LABEL",
        "boardSubtitle": "T1048.003 EXFIL & IMPACT -> LATERAL & C2 -> EXFIL &",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "FRONT MAIL SLOT",
        "rightPlaqueOverride": "CODED POSTCARD LABEL"
      },
      {
        "sceneKind": "net-dnstunnel-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: ROGUE ARCHIVE CLERK",
        "boardSubtitle": "T1048.003 EXFIL & IMPACT -> NUMBERED DIGIT STRIPS",
        "accentHex": 2282478,
        "secondaryHex": 16096779,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ROGUE ARCHIVE CLERK",
        "rightPlaqueOverride": "NUMBERED DIGIT STRIPS"
      },
      {
        "sceneKind": "net-dnstunnel-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: COMPANY MAILROOM",
        "boardSubtitle": "T1071.004 LATERAL & C2 -> FRONT GATE GUARD",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "COMPANY MAILROOM",
        "rightPlaqueOverride": "FRONT GATE GUARD"
      },
      {
        "sceneKind": "net-dnstunnel-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: REBUILT CUSTOMER LEDGER",
        "boardSubtitle": "T1071.004 EXFIL & IMPACT -> RETURN SLIP NOTE",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "REBUILT CUSTOMER LEDGER",
        "rightPlaqueOverride": "RETURN SLIP NOTE"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "FRONT MAIL SLOT",
    "rightPlaque": "CODED POSTCARD LABEL"
  },
  {
    "scenarioId": "apache-activemq-cve-2023-46604-openwire",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "railway-dispatch",
    "rightProp": "factory-conveyor",
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
        "sceneKind": "net-activemq-briefing",
        "mode": "overview-full",
        "boardTitle": "RAILWAY DISPATCH BROKER -> FORGED FAULT",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> EXECUTION",
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "RAILWAY DISPATCH BROKER",
        "rightPlaqueOverride": "FORGED FAULT NOTICE"
      },
      {
        "sceneKind": "net-activemq-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: BROKER DISPATCH TRACK",
        "boardSubtitle": "T1190 INITIAL ACCESS -> TAGGED ERROR FRAME",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "BROKER DISPATCH TRACK",
        "rightPlaqueOverride": "TAGGED ERROR FRAME"
      },
      {
        "sceneKind": "net-activemq-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: UNCHECKED HANDBOOK BUILDER",
        "boardSubtitle": "T1203 EXECUTION -> FETCHING THE INSTRUCTION SHEET",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "UNCHECKED HANDBOOK",
        "rightPlaqueOverride": "FETCHING THE"
      },
      {
        "sceneKind": "net-activemq-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PRE-WIRED ASSEMBLY ENTRY",
        "boardSubtitle": "T1059.004 EXECUTION -> BROKER SERVICE PROCESS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PRE-WIRED ASSEMBLY ENTRY",
        "rightPlaqueOverride": "BROKER SERVICE PROCESS"
      },
      {
        "sceneKind": "net-activemq-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "APACHE ACTIVEMQ OPENWIRE",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "freeze-and-swap",
    "leftPlaque": "RAILWAY DISPATCH BROKER",
    "rightPlaque": "FORGED FAULT NOTICE"
  },
  {
    "scenarioId": "atlassian-confluence-cve-2023-22515-storm0062",
    "floor": "workshop-tile",
    "wallHex": 1976635,
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
      "coatHex": 4674921,
      "accentHex": 3718648,
      "hatType": "none"
    },
    "sections": [
      {
        "sceneKind": "net-confluence-briefing",
        "mode": "overview-full",
        "boardTitle": "TEAM KNOWLEDGE LIBRARY -> FLIPPED",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> PERSISTENCE",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "TEAM KNOWLEDGE LIBRARY",
        "rightPlaqueOverride": "FLIPPED SETUP-FINISHED"
      },
      {
        "sceneKind": "net-confluence-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PUBLIC STATUS DESK",
        "boardSubtitle": "T1190 INITIAL ACCESS -> CHAINED INTERNAL DIALS",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "PUBLIC STATUS DESK",
        "rightPlaqueOverride": "CHAINED INTERNAL DIALS"
      },
      {
        "sceneKind": "net-confluence-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: REOPENED SETUP COUNTER",
        "boardSubtitle": "T1136.001 PERSISTENCE -> CLOSING THE SETUP LATCH",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "REOPENED SETUP COUNTER",
        "rightPlaqueOverride": "CLOSING THE SETUP LATCH"
      },
      {
        "sceneKind": "net-confluence-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: EXTENSION UPLOAD DESK",
        "boardSubtitle": "T1505.003 PERSISTENCE -> CUSTOM PLUG-IN BOX",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "EXTENSION UPLOAD DESK",
        "rightPlaqueOverride": "CUSTOM PLUG-IN BOX"
      },
      {
        "sceneKind": "net-confluence-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "STORM-0062: ATLASSIAN CONFLUENCE XWORK",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "TEAM KNOWLEDGE LIBRARY",
    "rightPlaque": "FLIPPED SETUP-FINISHED"
  },
  {
    "scenarioId": "barracuda-esg-cve-2023-2868-unc4841",
    "floor": "conveyor-deck",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "mailroom-chute",
    "rightProp": "fortress-gate",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 4674921,
      "accentHex": 3718648,
      "hatType": "none"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-barracuda-briefing",
        "mode": "overview-full",
        "boardTitle": "CORPORATE MAIL-SCREENING STATION -> WRAPPED",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> EXFIL &",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "CORPORATE MAIL-SCREENING",
        "rightPlaqueOverride": "WRAPPED ITEM LABEL TRICK"
      },
      {
        "sceneKind": "net-barracuda-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: AUTOMATED MAIL SCANNER",
        "boardSubtitle": "T1190 INITIAL ACCESS -> BUNDLED PARCEL ATTACHMENT",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "AUTOMATED MAIL SCANNER",
        "rightPlaqueOverride": "BUNDLED PARCEL"
      },
      {
        "sceneKind": "net-barracuda-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: QUIET COURIER ASSISTANT",
        "boardSubtitle": "T1505.003 PERSISTENCE -> SILENT DOORFRAME LISTENER",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "QUIET COURIER ASSISTANT",
        "rightPlaqueOverride": "SILENT DOORFRAME"
      },
      {
        "sceneKind": "net-barracuda-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: STATION RECORD BOOK RULES",
        "boardSubtitle": "T1114.002 EXFIL & IMPACT -> STARTUP RELAUNCH SCRIPT",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "STATION RECORD BOOK",
        "rightPlaqueOverride": "STARTUP RELAUNCH SCRIPT"
      },
      {
        "sceneKind": "net-barracuda-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "UNC4841: BARRACUDA ESG .TAR COMMAND",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "CORPORATE MAIL-SCREENING",
    "rightPlaque": "WRAPPED ITEM LABEL TRICK"
  },
  {
    "scenarioId": "cisco-ios-xe-cve-2023-20198-badimplant",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 440020,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "proxy-mirror",
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
        "sceneKind": "net-cisco-iosxe-briefing",
        "mode": "overview-full",
        "boardTitle": "NETWORK ROUTING STATION -> DOUBLE-CODED",
        "boardSubtitle": "T1190 INITIAL ACCESS -> DEFENSE EVASION",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "NETWORK ROUTING STATION",
        "rightPlaqueOverride": "DOUBLE-CODED ROOM NAME"
      },
      {
        "sceneKind": "net-cisco-iosxe-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: FRONT RECEPTION FILTER",
        "boardSubtitle": "T1190 INITIAL ACCESS -> TWICE-ENCODED LETTERING",
        "accentHex": 440020,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "FRONT RECEPTION FILTER",
        "rightPlaqueOverride": "TWICE-ENCODED LETTERING"
      },
      {
        "sceneKind": "net-cisco-iosxe-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SOFTWARE-INSTALLATION CHUTE",
        "boardSubtitle": "T1068 DEFENSE EVASION -> BREAKING INTO THE BASEMENT",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "SOFTWARE-INSTALLATION",
        "rightPlaqueOverride": "BREAKING INTO THE"
      },
      {
        "sceneKind": "net-cisco-iosxe-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SILENT CUSTOM RESPONSE PAGE",
        "boardSubtitle": "T1505.003 PERSISTENCE -> EXTRA LOBBY CONFIG SHEET",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "SILENT CUSTOM RESPONSE",
        "rightPlaqueOverride": "EXTRA LOBBY CONFIG SHEET"
      },
      {
        "sceneKind": "net-cisco-iosxe-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "CISCO IOS XE WEB UI ZERO-DAY CHAIN &",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "NETWORK ROUTING STATION",
    "rightPlaque": "DOUBLE-CODED ROOM NAME"
  },
  {
    "scenarioId": "cl0p-moveit-transfer-cve-2023-34362",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "vault-safe",
    "rightProp": "mail-chute",
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
        "sceneKind": "net-moveit-briefing",
        "mode": "overview-full",
        "boardTitle": "COURIER TRANSFER VAULT -> HIDDEN DATABASE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "COURIER TRANSFER VAULT",
        "rightPlaqueOverride": "HIDDEN DATABASE"
      },
      {
        "sceneKind": "net-moveit-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PUBLIC GUEST COUNTER",
        "boardSubtitle": "T1190 INITIAL ACCESS -> INTERNAL FILING CHUTE",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "PUBLIC GUEST COUNTER",
        "rightPlaqueOverride": "INTERNAL FILING CHUTE"
      },
      {
        "sceneKind": "net-moveit-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FOLDED CLOCKWORK PACKAGE",
        "boardSubtitle": "T1505.003 PERSISTENCE -> CLERK UNFOLDING THE ENTRY",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FOLDED CLOCKWORK PACKAGE",
        "rightPlaqueOverride": "CLERK UNFOLDING THE"
      },
      {
        "sceneKind": "net-moveit-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: HIDDEN TELLER WINDOW",
        "boardSubtitle": "T1530 EXFIL & IMPACT -> ENVELOPE MARGIN PASSPHRASE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "HIDDEN TELLER WINDOW",
        "rightPlaqueOverride": "ENVELOPE MARGIN"
      },
      {
        "sceneKind": "net-moveit-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "CL0P (FIN11): MOVEIT TRANSFER SQLI, ISAPI",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "COURIER TRANSFER VAULT",
    "rightPlaque": "HIDDEN DATABASE"
  },
  {
    "scenarioId": "f5-bigip-request-smuggling",
    "floor": "split-dual",
    "wallHex": 1976635,
    "accentHex": 3718648,
    "secondaryHex": 16096779,
    "leftProp": "proxy-mirror",
    "rightProp": "hotel-desk",
    "centerMechanism": "arc",
    "leftActor": {
      "coatHex": 4674921,
      "accentHex": 3718648,
      "hatType": "none"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-f5-smuggle-briefing",
        "mode": "overview-full",
        "boardTitle": "FRONT LOBBY RECEPTIONIST -> BACK-OFFICE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> EXECUTION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "FRONT LOBBY RECEPTIONIST",
        "rightPlaqueOverride": "BACK-OFFICE CONVEYOR"
      },
      {
        "sceneKind": "net-f5-smuggle-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: OUTER PARCEL WRAPPER",
        "boardSubtitle": "T1190 INITIAL ACCESS -> HIDDEN PARCEL CREASE",
        "accentHex": 3718648,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "OUTER PARCEL WRAPPER",
        "rightPlaqueOverride": "HIDDEN PARCEL CREASE"
      },
      {
        "sceneKind": "net-f5-smuggle-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: STAFF ROSTER BOOK",
        "boardSubtitle": "T1136.001 PERSISTENCE -> SENIOR SUPERVISOR BADGE",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "STAFF ROSTER BOOK",
        "rightPlaqueOverride": "SENIOR SUPERVISOR BADGE"
      },
      {
        "sceneKind": "net-f5-smuggle-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: ENGINE-ROOM COMMAND CONSOLE",
        "boardSubtitle": "T1059.004 EXECUTION -> UNRESTRICTED MAINTENANCE",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "ENGINE-ROOM COMMAND",
        "rightPlaqueOverride": "UNRESTRICTED"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "FRONT LOBBY RECEPTIONIST",
    "rightPlaque": "BACK-OFFICE CONVEYOR"
  },
  {
    "scenarioId": "fortra-goanywhere-mft-cve-2023-0669-cl0p",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "mail-chute",
    "rightProp": "vault-safe",
    "centerMechanism": "key-handoff",
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
        "sceneKind": "net-goanywhere-briefing",
        "mode": "overview-full",
        "boardTitle": "PRIVATE LICENSE DROP BOX -> PRINTED FACTORY",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> EXFIL & IMPACT",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PRIVATE LICENSE DROP BOX",
        "rightPlaqueOverride": "PRINTED FACTORY PADLOCK"
      },
      {
        "sceneKind": "net-goanywhere-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: FIXED FACTORY PADLOCK KEY",
        "boardSubtitle": "T1190 INITIAL ACCESS -> STREET-FACING ACCEPTANCE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FIXED FACTORY PADLOCK",
        "rightPlaqueOverride": "STREET-FACING"
      },
      {
        "sceneKind": "net-goanywhere-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SORTING TABLE UNPACKER",
        "boardSubtitle": "T1059.003 EXECUTION -> SELF-CLICKING MECHANICAL",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SORTING TABLE UNPACKER",
        "rightPlaqueOverride": "SELF-CLICKING"
      },
      {
        "sceneKind": "net-goanywhere-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: QUIET SCOUTING KIT",
        "boardSubtitle": "T1219 EXFIL & IMPACT -> REMOTE COURIER RELAY",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "QUIET SCOUTING KIT",
        "rightPlaqueOverride": "REMOTE COURIER RELAY"
      },
      {
        "sceneKind": "net-goanywhere-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "CL0P (TA505): FORTRA GOANYWHERE MFT",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "PRIVATE LICENSE DROP BOX",
    "rightPlaque": "PRINTED FACTORY PADLOCK"
  },
  {
    "scenarioId": "juniper-junos-jweb-cve-2023-36845-chain",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 1096065,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "library-toggle",
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
        "sceneKind": "net-juniper-jweb-briefing",
        "mode": "overview-full",
        "boardTitle": "ROUTER ADMINISTRATION BOOTH -> REDIRECTED",
        "boardSubtitle": "T1190 INITIAL ACCESS -> DEFENSE EVASION -> EXECUTION",
        "storyPlotOverride": "infiltration-approach",
        "leftPlaqueOverride": "ROUTER ADMINISTRATION",
        "rightPlaqueOverride": "REDIRECTED RULEBOOK SLIP"
      },
      {
        "sceneKind": "net-juniper-jweb-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: BOOTH CLERK FORM WINDOW",
        "boardSubtitle": "T1190 INITIAL ACCESS -> ENVIRONMENT OVERRIDE SLIP",
        "accentHex": 1096065,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BOOTH CLERK FORM WINDOW",
        "rightPlaqueOverride": "ENVIRONMENT OVERRIDE"
      },
      {
        "sceneKind": "net-juniper-jweb-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: INLINE SCRIPT PERMISSION LINE",
        "boardSubtitle": "T1574.007 DEFENSE EVASION -> MANDATORY OPENING NOTE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "INLINE SCRIPT",
        "rightPlaqueOverride": "MANDATORY OPENING NOTE"
      },
      {
        "sceneKind": "net-juniper-jweb-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PURELY IN-MEMORY EXECUTION",
        "boardSubtitle": "T1059.004 EXECUTION -> ROUTER MANAGEMENT CLERK",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PURELY IN-MEMORY",
        "rightPlaqueOverride": "ROUTER MANAGEMENT CLERK"
      },
      {
        "sceneKind": "net-juniper-jweb-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "JUNIPER JUNOS OS J-WEB: PHPRC \"/DEV/FD/0\"",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "infiltration-approach",
    "leftPlaque": "ROUTER ADMINISTRATION",
    "rightPlaque": "REDIRECTED RULEBOOK SLIP"
  },
  {
    "scenarioId": "mandiant-apt29-teamcity-jetstream",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "factory-conveyor",
    "rightProp": "oauth-kiosk",
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
        "sceneKind": "net-apt29-teamcity-briefing",
        "mode": "overview-full",
        "boardTitle": "FACTORY ASSEMBLY HUB -> OLD SIDE-DOOR BELL",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> LATERAL & C2",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "FACTORY ASSEMBLY HUB",
        "rightPlaqueOverride": "OLD SIDE-DOOR BELL"
      },
      {
        "sceneKind": "net-apt29-teamcity-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: LEGACY SERVICE BELL",
        "boardSubtitle": "T1190 INITIAL ACCESS -> BADGE-PRINTER ROUTE",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "LEGACY SERVICE BELL",
        "rightPlaqueOverride": "BADGE-PRINTER ROUTE"
      },
      {
        "sceneKind": "net-apt29-teamcity-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: MAINTENANCE SWITCH",
        "boardSubtitle": "T1059.003 EXECUTION -> FACTORY SUPERVISOR TERMINAL",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MAINTENANCE SWITCH",
        "rightPlaqueOverride": "FACTORY SUPERVISOR"
      },
      {
        "sceneKind": "net-apt29-teamcity-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: BUILD LOCKER COMBINATIONS",
        "boardSubtitle": "T1102.002 LATERAL & C2 -> BACKUP SUPERVISOR ACCOUNT",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BUILD LOCKER",
        "rightPlaqueOverride": "BACKUP SUPERVISOR"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "FACTORY ASSEMBLY HUB",
    "rightPlaque": "OLD SIDE-DOOR BELL"
  },
  {
    "scenarioId": "openssh-regreSSHion-cve-2024-6387",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "kernel-courthouse",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 1920728,
      "accentHex": 16436245,
      "hatType": "cap"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-regresshion-briefing",
        "mode": "overview-full",
        "boardTitle": "NIGHT WATCHMAN SERVICE -> STRICT WALL-CLOCK",
        "boardSubtitle": "T1190 INITIAL ACCESS -> DEFENSE EVASION -> EXECUTION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "NIGHT WATCHMAN SERVICE",
        "rightPlaqueOverride": "STRICT WALL-CLOCK ALARM"
      },
      {
        "sceneKind": "net-regresshion-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: ALTERNATING KNOCK-AND-WAIT PACKETS",
        "boardSubtitle": "T1190 INITIAL ACCESS -> FILING CABINET CHECKERBOARD",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "ALTERNATING",
        "rightPlaqueOverride": "FILING CABINET"
      },
      {
        "sceneKind": "net-regresshion-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: HALF-UPDATED INDEX CARD",
        "boardSubtitle": "T1068 DEFENSE EVASION -> WALL-CLOCK ALARM",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "HALF-UPDATED INDEX CARD",
        "rightPlaqueOverride": "WALL-CLOCK ALARM"
      },
      {
        "sceneKind": "net-regresshion-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: WATCHMAN INSTRUCTION TABLE",
        "boardSubtitle": "T1059.004 EXECUTION -> FORGED DISPATCH CARD",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "WATCHMAN INSTRUCTION",
        "rightPlaqueOverride": "FORGED DISPATCH CARD"
      },
      {
        "sceneKind": "net-regresshion-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "OPENSSH \"REGRESSHION\": SIGALRM",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "NIGHT WATCHMAN SERVICE",
    "rightPlaque": "STRICT WALL-CLOCK ALARM"
  },
  {
    "scenarioId": "papercut-ng-cve-2023-27350-bl00dy",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 1096065,
    "secondaryHex": 16007006,
    "leftProp": "print-spooler",
    "rightProp": "library-toggle",
    "centerMechanism": "key-handoff",
    "leftActor": {
      "coatHex": 4674921,
      "accentHex": 3718648,
      "hatType": "none"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-papercut-briefing",
        "mode": "overview-full",
        "boardTitle": "PRINT-SHOP MANAGEMENT OFFICE -> UNLOCKED",
        "boardSubtitle": "T1190 INITIAL ACCESS -> DEFENSE EVASION -> EXECUTION",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PRINT-SHOP MANAGEMENT",
        "rightPlaqueOverride": "UNLOCKED WELCOME CARD"
      },
      {
        "sceneKind": "net-papercut-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: INSTALLATION COMPLETION PAGE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> SUBMITTED WELCOME FORM",
        "accentHex": 1096065,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "INSTALLATION COMPLETION",
        "rightPlaqueOverride": "SUBMITTED WELCOME FORM"
      },
      {
        "sceneKind": "net-papercut-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: CUSTOM SCRIPTING SWITCH",
        "boardSubtitle": "T1059.007 DEFENSE EVASION -> PROTECTIVE SAFETY",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "CUSTOM SCRIPTING SWITCH",
        "rightPlaqueOverride": "PROTECTIVE SAFETY"
      },
      {
        "sceneKind": "net-papercut-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: EXISTING PRINTER RULE",
        "boardSubtitle": "T1059.001 EXECUTION -> INSERTED SYSTEM INSTRUCTION",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "EXISTING PRINTER RULE",
        "rightPlaqueOverride": "INSERTED SYSTEM"
      },
      {
        "sceneKind": "net-papercut-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "PAPERCUT MF/NG SETUPCOMPLETED AUTH BYPASS",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "PRINT-SHOP MANAGEMENT",
    "rightPlaque": "UNLOCKED WELCOME CARD"
  },
  {
    "scenarioId": "proxyshell-exchange-cve-2021-34473",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "hotel-desk",
    "rightProp": "mailroom-chute",
    "centerMechanism": "arc",
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
        "sceneKind": "net-proxyshell-briefing",
        "mode": "overview-full",
        "boardTitle": "FRONT LOBBY CONCIERGE -> DECEPTIVE HALLWAY",
        "boardSubtitle": "T1190 INITIAL ACCESS -> DEFENSE EVASION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "FRONT LOBBY CONCIERGE",
        "rightPlaqueOverride": "DECEPTIVE HALLWAY"
      },
      {
        "sceneKind": "net-proxyshell-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PUBLIC DIRECTORY DESK",
        "boardSubtitle": "T1190 INITIAL ACCESS -> LOCKED BACK OFFICE",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PUBLIC DIRECTORY DESK",
        "rightPlaqueOverride": "LOCKED BACK OFFICE"
      },
      {
        "sceneKind": "net-proxyshell-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: HAND-CRAFTED SUPERVISOR RIBBON",
        "boardSubtitle": "T1059.001 DEFENSE EVASION -> MAIL ADMINISTRATOR",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "HAND-CRAFTED SUPERVISOR",
        "rightPlaqueOverride": "MAIL ADMINISTRATOR"
      },
      {
        "sceneKind": "net-proxyshell-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: DRAFT MESSAGE WITH HIDDEN",
        "boardSubtitle": "T1505.003 PERSISTENCE -> MAILBOX EXPORT COMMAND",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "DRAFT MESSAGE WITH",
        "rightPlaqueOverride": "MAILBOX EXPORT COMMAND"
      },
      {
        "sceneKind": "net-proxyshell-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "MICROSOFT EXCHANGE \"PROXYSHELL\"",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "FRONT LOBBY CONCIERGE",
    "rightPlaque": "DECEPTIVE HALLWAY"
  },
  {
    "scenarioId": "sharepoint-cve-2023-29357-24955-chain",
    "floor": "workshop-tile",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16096779,
    "leftProp": "notary-press",
    "rightProp": "library-toggle",
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
        "sceneKind": "net-sharepoint-chain-briefing",
        "mode": "overview-full",
        "boardTitle": "DOCUMENT ARCHIVE PORTAL -> BLANK-SEAL",
        "boardSubtitle": "T1190 INITIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "DOCUMENT ARCHIVE PORTAL",
        "rightPlaqueOverride": "BLANK-SEAL VISITOR PASS"
      },
      {
        "sceneKind": "net-sharepoint-chain-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: HOMEMADE UNSIGNED PASS",
        "boardSubtitle": "T1190 INITIAL ACCESS -> ARCHIVE DIRECTORY WINDOW",
        "accentHex": 3718648,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "HOMEMADE UNSIGNED PASS",
        "rightPlaqueOverride": "ARCHIVE DIRECTORY WINDOW"
      },
      {
        "sceneKind": "net-sharepoint-chain-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SECOND BLANK-SEAL PASS",
        "boardSubtitle": "T1550.001 CREDENTIAL ACCESS -> INTERNAL DESK CALL",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "SECOND BLANK-SEAL PASS",
        "rightPlaqueOverride": "INTERNAL DESK CALL STAMP"
      },
      {
        "sceneKind": "net-sharepoint-chain-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: BUSINESS CONNECTOR BLUEPRINT",
        "boardSubtitle": "T1505.003 EXECUTION -> HIDDEN ASSEMBLY CODE",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "BUSINESS CONNECTOR",
        "rightPlaqueOverride": "HIDDEN ASSEMBLY CODE"
      },
      {
        "sceneKind": "net-sharepoint-chain-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "MICROSOFT SHAREPOINT: JWT \"ALG:NONE\" AUTH",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "DOCUMENT ARCHIVE PORTAL",
    "rightPlaque": "BLANK-SEAL VISITOR PASS"
  },
  {
    "scenarioId": "splunk-citrix-bleed-session-hijack",
    "floor": "split-dual",
    "wallHex": 1976635,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "oauth-kiosk",
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
        "sceneKind": "net-citrix-bleed-briefing",
        "mode": "overview-full",
        "boardTitle": "OVERLY LONG NAME CARD -> NEIGHBORING",
        "boardSubtitle": "T1190 INITIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "OVERLY LONG NAME CARD",
        "rightPlaqueOverride": "NEIGHBORING COUNTER"
      },
      {
        "sceneKind": "net-citrix-bleed-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PUBLIC INFORMATION COUNTER",
        "boardSubtitle": "T1190 INITIAL ACCESS -> UNUSUALLY LONG ADDRESS LABEL",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "PUBLIC INFORMATION",
        "rightPlaqueOverride": "UNUSUALLY LONG ADDRESS"
      },
      {
        "sceneKind": "net-citrix-bleed-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SPILLED COUNTER SCRAPS",
        "boardSubtitle": "T1539 CREDENTIAL ACCESS -> SIXTY-FIVE-SYMBOL CLAIM",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "SPILLED COUNTER SCRAPS",
        "rightPlaqueOverride": "SIXTY-FIVE-SYMBOL CLAIM"
      },
      {
        "sceneKind": "net-citrix-bleed-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: HIJACKED MANAGER WORKSPACE",
        "boardSubtitle": "T1550.004 LATERAL & C2 -> INTERNAL OFFICE INTERCOM",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "HIJACKED MANAGER",
        "rightPlaqueOverride": "INTERNAL OFFICE INTERCOM"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "OVERLY LONG NAME CARD",
    "rightPlaque": "NEIGHBORING COUNTER"
  },
  {
    "scenarioId": "splunk-ivanti-connect-secure",
    "floor": "pier-dock",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "pneumatic-tube",
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
        "sceneKind": "net-ivanti-cs-briefing",
        "mode": "overview-full",
        "boardTitle": "COMMUTER TUNNEL GATE -> SIDE STAIRWELL",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> CREDENTIAL",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "COMMUTER TUNNEL GATE",
        "rightPlaqueOverride": "SIDE STAIRWELL SHORTCUT"
      },
      {
        "sceneKind": "net-ivanti-cs-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PUBLIC HELPER WINDOW",
        "boardSubtitle": "T1190 INITIAL ACCESS -> BACKWARD HALLWAY STEPS",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PUBLIC HELPER WINDOW",
        "rightPlaqueOverride": "BACKWARD HALLWAY STEPS"
      },
      {
        "sceneKind": "net-ivanti-cs-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: LICENSE STATUS GAUGE",
        "boardSubtitle": "T1574.006 PERSISTENCE -> SEMICOLON EXTRA ORDER",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "LICENSE STATUS GAUGE",
        "rightPlaqueOverride": "SEMICOLON EXTRA ORDER"
      },
      {
        "sceneKind": "net-ivanti-cs-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: EDITED VISITOR LOG PAGE",
        "boardSubtitle": "T1556 CREDENTIAL ACCESS -> QUIET TRAFFIC FILTER",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "EDITED VISITOR LOG PAGE",
        "rightPlaqueOverride": "QUIET TRAFFIC FILTER"
      },
      {
        "sceneKind": "net-ivanti-cs-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "IVANTI CONNECT SECURE (UNC5221): AUTH",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "COMMUTER TUNNEL GATE",
    "rightPlaque": "SIDE STAIRWELL SHORTCUT"
  },
  {
    "scenarioId": "splunk-screenconnect-slashandgrab",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "library-toggle",
    "rightProp": "broadcast-tower",
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
        "sceneKind": "net-screenconnect-briefing",
        "mode": "overview-full",
        "boardTitle": "REMOTE DISPATCH CENTER -> EXTRA SLASH",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> LATERAL & C2",
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "REMOTE DISPATCH CENTER",
        "rightPlaqueOverride": "EXTRA SLASH HALLWAY SIGN"
      },
      {
        "sceneKind": "net-screenconnect-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CLOSED SETUP-ROOM DOORWAY",
        "boardSubtitle": "T1190 INITIAL ACCESS -> TRAILING SLASH AND RANDOM",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CLOSED SETUP-ROOM",
        "rightPlaqueOverride": "TRAILING SLASH AND"
      },
      {
        "sceneKind": "net-screenconnect-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FRESH OWNER REGISTRATION FORM",
        "boardSubtitle": "T1505.003 PERSISTENCE -> SUPERVISOR ROSTER BOOK",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FRESH OWNER",
        "rightPlaqueOverride": "SUPERVISOR ROSTER BOOK"
      },
      {
        "sceneKind": "net-screenconnect-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: LEGITIMATE DISPATCH INTERCOM",
        "boardSubtitle": "T1219 LATERAL & C2 -> CONNECTED BRANCH OFFICES",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "LEGITIMATE DISPATCH",
        "rightPlaqueOverride": "CONNECTED BRANCH OFFICES"
      }
    ],
    "storyPlot": "freeze-and-swap",
    "leftPlaque": "REMOTE DISPATCH CENTER",
    "rightPlaque": "EXTRA SLASH HALLWAY SIGN"
  },
  {
    "scenarioId": "talos-arcanedoor-asa",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "kernel-courthouse",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 1920728,
      "accentHex": 16436245,
      "hatType": "cap"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-arcanedoor-briefing",
        "mode": "overview-full",
        "boardTitle": "FORTRESS GATEKEEPER -> CLEARANCE ENVELOPE",
        "boardSubtitle": "T1542 PERSISTENCE -> EXECUTION -> DEFENSE EVASION",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FORTRESS GATEKEEPER",
        "rightPlaqueOverride": "CLEARANCE ENVELOPE"
      },
      {
        "sceneKind": "net-arcanedoor-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: FORTRESS SIDE WINDOW",
        "boardSubtitle": "T1542 PERSISTENCE -> OVERSIZED CLEARANCE ENVELOPE",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "FORTRESS SIDE WINDOW",
        "rightPlaqueOverride": "OVERSIZED CLEARANCE"
      },
      {
        "sceneKind": "net-arcanedoor-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SILENT WORKBENCH AGENT",
        "boardSubtitle": "T1059 EXECUTION -> MUTING THE LOGBOOK BELL",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SILENT WORKBENCH AGENT",
        "rightPlaqueOverride": "MUTING THE LOGBOOK BELL"
      },
      {
        "sceneKind": "net-arcanedoor-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: BASEMENT STORAGE CABINET",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> CONCEALED SPARE BUNDLE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "BASEMENT STORAGE CABINET",
        "rightPlaqueOverride": "CONCEALED SPARE BUNDLE"
      },
      {
        "sceneKind": "net-arcanedoor-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "ARCANEDOOR (UAT4356): CISCO ASA",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "FORTRESS GATEKEEPER",
    "rightPlaque": "CLEARANCE ENVELOPE"
  },
  {
    "scenarioId": "unit42-panos-midnight-eclipse",
    "floor": "pier-dock",
    "wallHex": 1973067,
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
        "sceneKind": "net-midnight-eclipse-briefing",
        "mode": "overview-full",
        "boardTitle": "BORDER TOLLHOUSE GATEWAY -> TWISTED TICKET",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> PERSISTENCE",
        "storyPlotOverride": "infiltration-approach",
        "leftPlaqueOverride": "BORDER TOLLHOUSE GATEWAY",
        "rightPlaqueOverride": "TWISTED TICKET LABEL"
      },
      {
        "sceneKind": "net-midnight-eclipse-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: TRAVELER PASS TICKET STAMP",
        "boardSubtitle": "T1190 INITIAL ACCESS -> CLIMBING BACKWARD OUT OF",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "TRAVELER PASS TICKET",
        "rightPlaqueOverride": "CLIMBING BACKWARD OUT"
      },
      {
        "sceneKind": "net-midnight-eclipse-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PRIVILEGED AUTOMATED COURIER",
        "boardSubtitle": "T1059.004 EXECUTION -> BUILDING COMMAND DESK",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PRIVILEGED AUTOMATED",
        "rightPlaqueOverride": "BUILDING COMMAND DESK"
      },
      {
        "sceneKind": "net-midnight-eclipse-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: TOLLHOUSE STARTUP MANUAL",
        "boardSubtitle": "T1546.016 PERSISTENCE -> QUIET ERROR-LOG WATCHER",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "TOLLHOUSE STARTUP MANUAL",
        "rightPlaqueOverride": "QUIET ERROR-LOG WATCHER"
      },
      {
        "sceneKind": "net-midnight-eclipse-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "OPERATION MIDNIGHTECLIPSE: PAN-OS",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "infiltration-approach",
    "leftPlaque": "BORDER TOLLHOUSE GATEWAY",
    "rightPlaque": "TWISTED TICKET LABEL"
  },
  {
    "scenarioId": "unit42-star-blizzard-evilginx-aitm",
    "floor": "split-dual",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "proxy-mirror",
    "rightProp": "oauth-kiosk",
    "centerMechanism": "arc",
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
        "sceneKind": "net-evilginx-aitm-briefing",
        "mode": "overview-full",
        "boardTitle": "IDENTICAL GLASS BOOTH -> LIVE ONE-TIME STAMP",
        "boardSubtitle": "T1539 CREDENTIAL ACCESS -> LATERAL & C2 -> DEFENSE",
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "IDENTICAL GLASS BOOTH",
        "rightPlaqueOverride": "LIVE ONE-TIME STAMP"
      },
      {
        "sceneKind": "net-evilginx-aitm-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CONVINCING INVITATION LETTER",
        "boardSubtitle": "T1539 CREDENTIAL ACCESS -> LOOK-ALIKE GLASS BOOTH",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "CONVINCING INVITATION",
        "rightPlaqueOverride": "LOOK-ALIKE GLASS BOOTH"
      },
      {
        "sceneKind": "net-evilginx-aitm-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SECRET PASSPHRASE",
        "boardSubtitle": "T1550.004 LATERAL & C2 -> POCKET BUZZER APPROVAL",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "SECRET PASSPHRASE",
        "rightPlaqueOverride": "POCKET BUZZER APPROVAL"
      },
      {
        "sceneKind": "net-evilginx-aitm-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: FLASHING THE PHOTOCOPIED PASS",
        "boardSubtitle": "T1564.008 DEFENSE EVASION -> SECOND CITY ENTRANCE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "FLASHING THE",
        "rightPlaqueOverride": "SECOND CITY ENTRANCE"
      }
    ],
    "storyPlot": "mirror-proxy-bounce",
    "leftPlaque": "IDENTICAL GLASS BOOTH",
    "rightPlaque": "LIVE ONE-TIME STAMP"
  },
  {
    "scenarioId": "vmware-vcenter-cve-2023-34048-unc3886",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 440020,
    "secondaryHex": 16007006,
    "leftProp": "hypervisor-vault",
    "rightProp": "notary-press",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 1013358,
      "accentHex": 3718648,
      "hatType": "visor"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-vcenter-unc3886-briefing",
        "mode": "overview-full",
        "boardTitle": "FLEET HEADQUARTERS CONSOLE -> DIRECTORY",
        "boardSubtitle": "T1190 INITIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "FLEET HEADQUARTERS",
        "rightPlaqueOverride": "DIRECTORY WINDOW MEMORY"
      },
      {
        "sceneKind": "net-vcenter-unc3886-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: HEADQUARTERS DIRECTORY CLERK",
        "boardSubtitle": "T1190 INITIAL ACCESS -> OVERSIZED FILING CARD",
        "accentHex": 440020,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "HEADQUARTERS DIRECTORY",
        "rightPlaqueOverride": "OVERSIZED FILING CARD"
      },
      {
        "sceneKind": "net-vcenter-unc3886-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: MASTER VAULT CODEBOOK",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> BRANCH-OFFICE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MASTER VAULT CODEBOOK",
        "rightPlaqueOverride": "BRANCH-OFFICE"
      },
      {
        "sceneKind": "net-vcenter-unc3886-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: LOWERED INSPECTION STANDARD",
        "boardSubtitle": "T1547 PERSISTENCE -> UNSIGNED MAINTENANCE MODULE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "LOWERED INSPECTION",
        "rightPlaqueOverride": "UNSIGNED MAINTENANCE"
      },
      {
        "sceneKind": "net-vcenter-unc3886-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "UNC3886: VCENTER VMDIRD OUT-OF-BOUNDS",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "FLEET HEADQUARTERS",
    "rightPlaque": "DIRECTORY WINDOW MEMORY"
  },
  {
    "scenarioId": "zyxel-firewall-cve-2023-28771-ike-rce",
    "floor": "circular-tech",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "telecom-bridge",
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
        "sceneKind": "net-zyxel-ike-briefing",
        "mode": "overview-full",
        "boardTitle": "PERIMETER GUARDHOUSE -> SHARED FACTORY STAMP",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> LATERAL & C2",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "PERIMETER GUARDHOUSE",
        "rightPlaqueOverride": "SHARED FACTORY STAMP"
      },
      {
        "sceneKind": "net-zyxel-ike-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SHORT SEALED HEADER STRIP",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PLAIN-TEXT TRAILING MESSAGE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SHORT SEALED HEADER",
        "rightPlaqueOverride": "PLAIN-TEXT TRAILING"
      },
      {
        "sceneKind": "net-zyxel-ike-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SHIFT DEBUG NOTEBOOK",
        "boardSubtitle": "T1059.004 EXECUTION -> BUILDING COMMAND INTERCOM",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SHIFT DEBUG NOTEBOOK",
        "rightPlaqueOverride": "BUILDING COMMAND"
      },
      {
        "sceneKind": "net-zyxel-ike-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SINGLE-PACKET BORDER BREACH",
        "boardSubtitle": "T1583.005 LATERAL & C2 -> OUTWARD TOOLKIT PICKUP",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "SINGLE-PACKET BORDER",
        "rightPlaqueOverride": "OUTWARD TOOLKIT PICKUP"
      },
      {
        "sceneKind": "net-zyxel-ike-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "ZYXEL FIREWALL PRE-AUTH IKEV2 PACKET",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "PERIMETER GUARDHOUSE",
    "rightPlaque": "SHARED FACTORY STAMP"
  },
  {
    "scenarioId": "dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 3718648,
    "leftProp": "pneumatic-tube",
    "rightProp": "factory-conveyor",
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
        "sceneKind": "net-tomcat-ghostcat-briefing",
        "mode": "overview-full",
        "boardTitle": "OPEN STREET-FACING FREIGHT SHAFT -> STAFF",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> EXECUTION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "OPEN STREET-FACING",
        "rightPlaqueOverride": "STAFF PASSCODE SHEET"
      },
      {
        "sceneKind": "net-tomcat-ghostcat-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNGUARDED FREIGHT SHAFT",
        "boardSubtitle": "T1190 INITIAL ACCESS -> TAGGED INTERNAL STORAGE PATH",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UNGUARDED FREIGHT SHAFT",
        "rightPlaqueOverride": "TAGGED INTERNAL STORAGE"
      },
      {
        "sceneKind": "net-tomcat-ghostcat-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PACKAGE LOADING DOCK",
        "boardSubtitle": "T1505.003 PERSISTENCE -> ZIPPED APPLICATION CRATE",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PACKAGE LOADING DOCK",
        "rightPlaqueOverride": "ZIPPED APPLICATION CRATE"
      },
      {
        "sceneKind": "net-tomcat-ghostcat-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: AUTOMATIC SCRIPT TRANSLATOR",
        "boardSubtitle": "T1505.003 EXECUTION -> COMPILED MACHINE INSTRUCTIONS",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "AUTOMATIC SCRIPT",
        "rightPlaqueOverride": "COMPILED MACHINE"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "OPEN STREET-FACING",
    "rightPlaque": "STAFF PASSCODE SHEET"
  },
  {
    "scenarioId": "dfir-exchange-ews-autodiscover-proxylogon-iis-forensics",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "hotel-desk",
    "rightProp": "mailroom-chute",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 3359061,
      "accentHex": 1096065,
      "hatType": "cap"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-exchange-proxylogon-briefing",
        "mode": "overview-full",
        "boardTitle": "FRONT-DESK FORWARDING SLIPS -> TAMPERED",
        "boardSubtitle": "T1190 INITIAL ACCESS -> PERSISTENCE -> EXECUTION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "FRONT-DESK FORWARDING",
        "rightPlaqueOverride": "TAMPERED ADDRESS-BOOK"
      },
      {
        "sceneKind": "net-exchange-proxylogon-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: RECEPTION COUNTER LOGBOOK",
        "boardSubtitle": "T1190 INITIAL ACCESS -> STATIC GRAPHIC SHELF ADDRESS",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "RECEPTION COUNTER",
        "rightPlaqueOverride": "STATIC GRAPHIC SHELF"
      },
      {
        "sceneKind": "net-exchange-proxylogon-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SUPERVISOR OFFICE LEDGER",
        "boardSubtitle": "T1505.003 PERSISTENCE -> REWRITTEN ADDRESS-BOOK LINK",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SUPERVISOR OFFICE LEDGER",
        "rightPlaqueOverride": "REWRITTEN ADDRESS-BOOK"
      },
      {
        "sceneKind": "net-exchange-proxylogon-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: COMPILED PROOF PLATES",
        "boardSubtitle": "T1505.003 EXECUTION -> MAILROOM CLERK PROCESS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "COMPILED PROOF PLATES",
        "rightPlaqueOverride": "MAILROOM CLERK PROCESS"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "FRONT-DESK FORWARDING",
    "rightPlaque": "TAMPERED ADDRESS-BOOK"
  },
  {
    "scenarioId": "dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell",
    "floor": "two-level-cutaway",
    "wallHex": 1516884,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "mailroom-chute",
    "rightProp": "kernel-courthouse",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 3359061,
      "accentHex": 1096065,
      "hatType": "cap"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-iis-httpsys-briefing",
        "mode": "overview-full",
        "boardTitle": "BUSY POSTAL DEPOT -> HIDDEN SORTING DESK",
        "boardSubtitle": "T1505.004 PERSISTENCE -> DEFENSE EVASION -> CREDENTIAL",
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "BUSY POSTAL DEPOT",
        "rightPlaqueOverride": "HIDDEN SORTING DESK"
      },
      {
        "sceneKind": "net-iis-httpsys-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: DEPOT MASTER STAFFING ROSTER",
        "boardSubtitle": "T1505.004 PERSISTENCE -> NEWLY ADDED SORTING CLERK",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "DEPOT MASTER STAFFING",
        "rightPlaqueOverride": "NEWLY ADDED SORTING"
      },
      {
        "sceneKind": "net-iis-httpsys-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BASEMENT CONVEYOR SWITCHBOARD",
        "boardSubtitle": "T1505.004 DEFENSE EVASION -> PRIVATE CHUTE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "BASEMENT CONVEYOR",
        "rightPlaqueOverride": "PRIVATE CHUTE"
      },
      {
        "sceneKind": "net-iis-httpsys-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: LIVE CHUTE ROLL CALL",
        "boardSubtitle": "T1505.004 CREDENTIAL ACCESS -> CLERK WORKING TRAYS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "LIVE CHUTE ROLL CALL",
        "rightPlaqueOverride": "CLERK WORKING TRAYS"
      }
    ],
    "storyPlot": "elevation-tower",
    "leftPlaque": "BUSY POSTAL DEPOT",
    "rightPlaque": "HIDDEN SORTING DESK"
  },
  {
    "scenarioId": "dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "database-vault",
    "rightProp": "library-toggle",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 3359061,
      "accentHex": 1096065,
      "hatType": "cap"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-mssql-xpcmd-briefing",
        "mode": "overview-full",
        "boardTitle": "VAULT BOOKKEEPER ENGINE -> HIDDEN WORKSHOP",
        "boardSubtitle": "T1059.003 EXECUTION -> EXECUTION -> PERSISTENCE",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "VAULT BOOKKEEPER ENGINE",
        "rightPlaqueOverride": "HIDDEN WORKSHOP SWITCH"
      },
      {
        "sceneKind": "net-mssql-xpcmd-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: FIRST SAFETY LOCK",
        "boardSubtitle": "T1059.003 EXECUTION -> DIRECT WORKSHOP COMMAND LEVER",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FIRST SAFETY LOCK",
        "rightPlaqueOverride": "DIRECT WORKSHOP COMMAND"
      },
      {
        "sceneKind": "net-mssql-xpcmd-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SHELL COMMAND TOOLKIT",
        "boardSubtitle": "T1059.003 EXECUTION -> EXTERNAL AUTOMATION TOOLKIT",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SHELL COMMAND TOOLKIT",
        "rightPlaqueOverride": "EXTERNAL AUTOMATION"
      },
      {
        "sceneKind": "net-mssql-xpcmd-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: UNSIGNED CUSTOM EXTENSION",
        "boardSubtitle": "T1505.001 PERSISTENCE -> VAULT CATALOG REGISTRY",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNSIGNED CUSTOM",
        "rightPlaqueOverride": "VAULT CATALOG REGISTRY"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "VAULT BOOKKEEPER ENGINE",
    "rightPlaque": "HIDDEN WORKSHOP SWITCH"
  },
  {
    "scenarioId": "dfir-postgresql-copy-from-program-pg-log-auditd-trace",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 3718648,
    "secondaryHex": 1096065,
    "leftProp": "database-vault",
    "rightProp": "mail-chute",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 3359061,
      "accentHex": 1096065,
      "hatType": "cap"
    },
    "rightActor": {
      "coatHex": 1013358,
      "accentHex": 3718648,
      "hatType": "visor"
    },
    "sections": [
      {
        "sceneKind": "net-pg-copyprog-briefing",
        "mode": "overview-full",
        "boardTitle": "ARCHIVE DATABASE MANAGER -> SPECIAL",
        "boardSubtitle": "T1078 INITIAL ACCESS -> EXECUTION -> PERSISTENCE",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ARCHIVE DATABASE MANAGER",
        "rightPlaqueOverride": "SPECIAL SHIPPING"
      },
      {
        "sceneKind": "net-pg-copyprog-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: ARCHIVE RECEPTION REGISTER",
        "boardSubtitle": "T1078 INITIAL ACCESS -> MASTER CLEARANCE BADGE",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "ARCHIVE RECEPTION",
        "rightPlaqueOverride": "MASTER CLEARANCE BADGE"
      },
      {
        "sceneKind": "net-pg-copyprog-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: TABLE-IMPORT COMMAND SLIP",
        "boardSubtitle": "T1059.004 EXECUTION -> LAUNCHED COMMAND-LINE HELPER",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "TABLE-IMPORT COMMAND",
        "rightPlaqueOverride": "LAUNCHED COMMAND-LINE"
      },
      {
        "sceneKind": "net-pg-copyprog-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: BULK-STORAGE VAULT",
        "boardSubtitle": "T1505.001 PERSISTENCE -> WRITING PIECES ONTO DISK",
        "accentHex": 1096065,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BULK-STORAGE VAULT",
        "rightPlaqueOverride": "WRITING PIECES ONTO DISK"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "ARCHIVE DATABASE MANAGER",
    "rightPlaque": "SPECIAL SHIPPING"
  },
  {
    "scenarioId": "dfir-sharepoint-iis-viewstate-losformatter-deserialization",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16096779,
    "leftProp": "notary-press",
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
        "sceneKind": "net-viewstate-deser-briefing",
        "mode": "overview-full",
        "boardTitle": "FOLDED STATE RECEIPT -> SECRET SEALING KEY",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> EXECUTION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "FOLDED STATE RECEIPT",
        "rightPlaqueOverride": "SECRET SEALING KEY"
      },
      {
        "sceneKind": "net-viewstate-deser-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CONFIGURATION BINDER",
        "boardSubtitle": "T1190 INITIAL ACCESS -> LEAKED OFFICE SEALING STAMP",
        "accentHex": 11032055,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "CONFIGURATION BINDER",
        "rightPlaqueOverride": "LEAKED OFFICE SEALING"
      },
      {
        "sceneKind": "net-viewstate-deser-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: VALIDLY STAMPED BULKY RECEIPT",
        "boardSubtitle": "T1059 EXECUTION -> RECEIPT UNFOLDING ENGINE",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "VALIDLY STAMPED BULKY",
        "rightPlaqueOverride": "RECEIPT UNFOLDING ENGINE"
      },
      {
        "sceneKind": "net-viewstate-deser-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: WEB CLERK WORKER",
        "boardSubtitle": "T1190 EXECUTION -> ENDPOINT MOTION SENSOR",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "WEB CLERK WORKER",
        "rightPlaqueOverride": "ENDPOINT MOTION SENSOR"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "FOLDED STATE RECEIPT",
    "rightPlaque": "SECRET SEALING KEY"
  },
  {
    "scenarioId": "dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing",
    "floor": "pier-dock",
    "wallHex": 988970,
    "accentHex": 1096065,
    "secondaryHex": 16007006,
    "leftProp": "telecom-bridge",
    "rightProp": "satellite-dish",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 3359061,
      "accentHex": 1096065,
      "hatType": "cap"
    },
    "rightActor": {
      "coatHex": 1973067,
      "accentHex": 16007006,
      "hatType": "hood"
    },
    "sections": [
      {
        "sceneKind": "net-zeek-ja3-briefing",
        "mode": "overview-full",
        "boardTitle": "UNIQUE WAY OF KNOCKING -> BLANK DEFAULT",
        "boardSubtitle": "T1071.001 LATERAL & C2 -> LATERAL & C2 -> LATERAL & C2",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "UNIQUE WAY OF KNOCKING",
        "rightPlaqueOverride": "BLANK DEFAULT WAREHOUSE"
      },
      {
        "sceneKind": "net-zeek-ja3-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: RECORDED HANDSHAKE SEQUENCE",
        "boardSubtitle": "T1071.001 LATERAL & C2 -> SWAPPED OUTER ENVELOPE",
        "accentHex": 1096065,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "RECORDED HANDSHAKE",
        "rightPlaqueOverride": "SWAPPED OUTER ENVELOPE"
      },
      {
        "sceneKind": "net-zeek-ja3-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: DISTANT WAREHOUSE REPLY PATTERN",
        "boardSubtitle": "T1573.002 LATERAL & C2 -> GENERIC BLANK WAX STAMP",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "DISTANT WAREHOUSE REPLY",
        "rightPlaqueOverride": "GENERIC BLANK WAX STAMP"
      },
      {
        "sceneKind": "net-zeek-ja3-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: DEPARTURE TIMESTAMP CHART",
        "boardSubtitle": "T1029 LATERAL & C2 -> STEADY AUTOMATED DRUMBEAT",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "DEPARTURE TIMESTAMP",
        "rightPlaqueOverride": "STEADY AUTOMATED"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "UNIQUE WAY OF KNOCKING",
    "rightPlaque": "BLANK DEFAULT WAREHOUSE"
  }
];

export function buildNetworkWebScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
