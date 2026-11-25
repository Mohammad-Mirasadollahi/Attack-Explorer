import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "ad-kerberoasting",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "concierge-press",
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
        "sceneKind": "ad-kerberoast-briefing",
        "mode": "overview-full",
        "boardTitle": "ORDINARY GUEST REQUESTING A WEAK WAX-SEALED",
        "boardSubtitle": "T1558.003 CREDENTIAL ACCESS -> LATERAL & C2",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "ORDINARY GUEST",
        "rightPlaqueOverride": "CRACKING THE HEAD CHEF"
      },
      {
        "sceneKind": "ad-kerberoast-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: REGULAR GUEST ROOM KEY",
        "boardSubtitle": "T1558.003 CREDENTIAL ACCESS -> PUBLIC ROSTER OF",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "REGULAR GUEST ROOM KEY",
        "rightPlaqueOverride": "PUBLIC ROSTER OF"
      },
      {
        "sceneKind": "ad-kerberoast-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: RUNNING RAPID GUESSES PRIVATELY",
        "boardSubtitle": "T1550.002 LATERAL & C2 -> HEAD CHEF REAL PASSWORD",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "RUNNING RAPID GUESSES",
        "rightPlaqueOverride": "HEAD CHEF REAL PASSWORD"
      },
      {
        "sceneKind": "ad-kerberoast-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: STAFF SUPPLY SHELF",
        "boardSubtitle": "T1543.003 PERSISTENCE -> AUTOMATED ASSISTANT PACKAGE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "STAFF SUPPLY SHELF",
        "rightPlaqueOverride": "AUTOMATED ASSISTANT"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "ORDINARY GUEST",
    "rightPlaque": "CRACKING THE HEAD CHEF"
  },
  {
    "scenarioId": "ms-midnight-blizzard-oauth",
    "floor": "pier-dock",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "oauth-kiosk",
    "rightProp": "mailroom-chute",
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
        "sceneKind": "ad-midnight-blizz-briefing",
        "mode": "overview-full",
        "boardTitle": "TRYING ONE KEY PER EVENING FROM SCATTERED",
        "boardSubtitle": "T1110.003 INITIAL ACCESS -> PERSISTENCE -> EXFIL &",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "TRYING ONE KEY PER",
        "rightPlaqueOverride": "FORGOTTEN BACKYARD"
      },
      {
        "sceneKind": "ad-midnight-blizz-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: HUNDREDS OF ORDINARY HOUSEHOLD",
        "boardSubtitle": "T1110.003 INITIAL ACCESS -> TRYING ONLY A HANDFUL",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "HUNDREDS OF ORDINARY",
        "rightPlaqueOverride": "TRYING ONLY A HANDFUL"
      },
      {
        "sceneKind": "ad-midnight-blizz-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ABANDONED AUTOMATED COURIER BADGE",
        "boardSubtitle": "T1098.003 PERSISTENCE -> MINTING SHINY NEW OFFICIAL",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ABANDONED AUTOMATED",
        "rightPlaqueOverride": "MINTING SHINY NEW"
      },
      {
        "sceneKind": "ad-midnight-blizz-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: MACHINE-ONLY COURIER BADGE",
        "boardSubtitle": "T1528 EXFIL & IMPACT -> AUTOMATED POSTAL BAY",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "MACHINE-ONLY COURIER",
        "rightPlaqueOverride": "AUTOMATED POSTAL BAY"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "TRYING ONE KEY PER",
    "rightPlaque": "FORGOTTEN BACKYARD"
  },
  {
    "scenarioId": "ms-volt-typhoon-lotl",
    "floor": "pier-dock",
    "wallHex": 1976635,
    "accentHex": 1096065,
    "secondaryHex": 16096779,
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
        "sceneKind": "ad-volt-typhoon-briefing",
        "mode": "overview-full",
        "boardTitle": "RIDING ORDINARY NEIGHBORHOOD DELIVERY VANS",
        "boardSubtitle": "T1047 EXECUTION -> CREDENTIAL ACCESS -> LATERAL & C2",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "RIDING ORDINARY",
        "rightPlaqueOverride": "USING THE FACTORY OWN"
      },
      {
        "sceneKind": "ad-volt-typhoon-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CHAIN OF ORDINARY LOCAL",
        "boardSubtitle": "T1047 EXECUTION -> STANDARD MANAGEMENT INTERCOM",
        "accentHex": 1096065,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "CHAIN OF ORDINARY LOCAL",
        "rightPlaqueOverride": "STANDARD MANAGEMENT"
      },
      {
        "sceneKind": "ad-volt-typhoon-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: MASTER PASSWORD LEDGER CLAMPED",
        "boardSubtitle": "T1003.003 CREDENTIAL ACCESS -> OFFICIAL EMERGENCY",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MASTER PASSWORD LEDGER",
        "rightPlaqueOverride": "OFFICIAL EMERGENCY"
      },
      {
        "sceneKind": "ad-volt-typhoon-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: BUILT-IN HALLWAY FORWARDING MIRROR",
        "boardSubtitle": "T1090.001 LATERAL & C2 -> INTERMEDIATE JUMP DESK",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "BUILT-IN HALLWAY",
        "rightPlaqueOverride": "INTERMEDIATE JUMP DESK"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "RIDING ORDINARY",
    "rightPlaque": "USING THE FACTORY OWN"
  },
  {
    "scenarioId": "nopac-samaccountname-cve-2021-42278-42287",
    "floor": "workshop-tile",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "concierge-press",
    "rightProp": "notary-press",
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
        "sceneKind": "ad-nopac-briefing",
        "mode": "overview-full",
        "boardTitle": "CREATING A TRAINEE BADGE AND RUBBING OFF",
        "boardSubtitle": "T1068 CREDENTIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "CREATING A TRAINEE",
        "rightPlaqueOverride": "RESTORING THE TRAINEE"
      },
      {
        "sceneKind": "ad-nopac-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: GENEROUS RULE ALLOWING TEN HELPER",
        "boardSubtitle": "T1068 CREDENTIAL ACCESS -> STRIPPING THE TRAILING",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "GENEROUS RULE ALLOWING",
        "rightPlaqueOverride": "STRIPPING THE TRAILING"
      },
      {
        "sceneKind": "ad-nopac-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: RENAMING THE HELPER BADGE BACK TO",
        "boardSubtitle": "T1558.001 CREDENTIAL ACCESS -> TICKET WINDOW",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "RENAMING THE HELPER",
        "rightPlaqueOverride": "TICKET WINDOW FAILING"
      },
      {
        "sceneKind": "ad-nopac-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: GENUINELY STAMPED CHIEF",
        "boardSubtitle": "T1003.006 CREDENTIAL ACCESS -> INVOKING THE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "GENUINELY STAMPED CHIEF",
        "rightPlaqueOverride": "INVOKING THE EMERGENCY"
      },
      {
        "sceneKind": "ad-nopac-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "ACTIVE DIRECTORY \"NOPAC\": SAMACCOUNTNAME",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "CREATING A TRAINEE",
    "rightPlaque": "RESTORING THE TRAINEE"
  },
  {
    "scenarioId": "printnightmare-spooler-cve-2021-34527",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "print-spooler",
    "rightProp": "vault-safe",
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
        "sceneKind": "ad-printnightmare-briefing",
        "mode": "overview-full",
        "boardTitle": "PRINT-SHOP FOREMAN CARRYING MASTER KEYS TO",
        "boardSubtitle": "T1210 LATERAL & C2 -> PERSISTENCE -> DEFENSE EVASION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "PRINT-SHOP FOREMAN",
        "rightPlaqueOverride": "SPECIAL SKIP-VERIFICATIO"
      },
      {
        "sceneKind": "ad-printnightmare-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PRINT-SHOP REQUEST WINDOW",
        "boardSubtitle": "T1210 LATERAL & C2 -> OBSCURE INTERNAL WAIVER BOX",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PRINT-SHOP REQUEST",
        "rightPlaqueOverride": "OBSCURE INTERNAL WAIVER"
      },
      {
        "sceneKind": "ad-printnightmare-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: LEGITIMATE FACTORY MANUAL ON THE",
        "boardSubtitle": "T1547.012 PERSISTENCE -> EXTERNAL WAREHOUSE ADDRESS",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "LEGITIMATE FACTORY",
        "rightPlaqueOverride": "EXTERNAL WAREHOUSE"
      },
      {
        "sceneKind": "ad-printnightmare-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SNAPPING THE COPIED ROLLER INTO",
        "boardSubtitle": "T1068 DEFENSE EVASION -> RIGGED MECHANISM SPRINGING",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "SNAPPING THE COPIED",
        "rightPlaqueOverride": "RIGGED MECHANISM"
      },
      {
        "sceneKind": "ad-printnightmare-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "WINDOWS \"PRINTNIGHTMARE\"",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "PRINT-SHOP FOREMAN",
    "rightPlaque": "SPECIAL SKIP-VERIFICATIO"
  },
  {
    "scenarioId": "unit42-scattered-spider-cloud",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "hotel-desk",
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
        "sceneKind": "ad-scattered-spider-briefing",
        "mode": "overview-full",
        "boardTitle": "CON ARTIST PHONING THE HELPDESK TO PAIR A",
        "boardSubtitle": "T1621 INITIAL ACCESS -> PERSISTENCE -> LATERAL & C2",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "CON ARTIST PHONING THE",
        "rightPlaqueOverride": "READING INSTRUCTION"
      },
      {
        "sceneKind": "ad-scattered-spider-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PERSONAL FACTS SCRAPED FROM",
        "boardSubtitle": "T1621 INITIAL ACCESS -> PERSUADING THE HELPDESK",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PERSONAL FACTS SCRAPED",
        "rightPlaqueOverride": "PERSUADING THE HELPDESK"
      },
      {
        "sceneKind": "ad-scattered-spider-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: COMPANY CENTRAL SINGLE-DOOR PORTAL",
        "boardSubtitle": "T1219 PERSISTENCE -> INTERNAL WIKI BINDERS HOLDING",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "COMPANY CENTRAL",
        "rightPlaqueOverride": "INTERNAL WIKI BINDERS"
      },
      {
        "sceneKind": "ad-scattered-spider-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: ROGUE BACKDOOR IDENTITY BRIDGE IN",
        "boardSubtitle": "T1078.004 LATERAL & C2 -> STEPPING INTO SUPREME",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "ROGUE BACKDOOR IDENTITY",
        "rightPlaqueOverride": "STEPPING INTO SUPREME"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "CON ARTIST PHONING THE",
    "rightPlaque": "READING INSTRUCTION"
  },
  {
    "scenarioId": "zerologon-netlogon-cve-2020-1472",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 16007006,
    "secondaryHex": 16436245,
    "leftProp": "fortress-gate",
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
        "sceneKind": "ad-zerologon-briefing",
        "mode": "overview-full",
        "boardTitle": "RATTLING THE GATE WITH BLANK ALL-ZERO PINS",
        "boardSubtitle": "T1210 LATERAL & C2 -> PERSISTENCE -> CREDENTIAL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "RATTLING THE GATE WITH",
        "rightPlaqueOverride": "WIPING THE FORTRESS OWN"
      },
      {
        "sceneKind": "ad-zerologon-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: REUSING AN ALL-ZERO STARTING",
        "boardSubtitle": "T1210 LATERAL & C2 -> 256 BLANK ZERO-PIN KNOCKS IN",
        "accentHex": 16007006,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "REUSING AN ALL-ZERO",
        "rightPlaqueOverride": "256 BLANK ZERO-PIN"
      },
      {
        "sceneKind": "ad-zerologon-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: TURNING OFF THE SEALED-ENVELOPE",
        "boardSubtitle": "T1098 PERSISTENCE -> ORDER REPLACING THE FORTRESS",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "TURNING OFF THE",
        "rightPlaqueOverride": "ORDER REPLACING THE"
      },
      {
        "sceneKind": "ad-zerologon-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: LOGGING IN WITH THE BLANK",
        "boardSubtitle": "T1003.006 CREDENTIAL ACCESS -> COPYING EVERY",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "LOGGING IN WITH THE",
        "rightPlaqueOverride": "COPYING EVERY HOUSEHOLD"
      },
      {
        "sceneKind": "ad-zerologon-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "ACTIVE DIRECTORY \"ZEROLOGON\": NETLOGON",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "RATTLING THE GATE WITH",
    "rightPlaque": "WIPING THE FORTRESS OWN"
  },
  {
    "scenarioId": "dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886",
    "floor": "workshop-tile",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16096779,
    "leftProp": "notary-press",
    "rightProp": "concierge-press",
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
        "sceneKind": "ad-adcs-esc1-briefing",
        "mode": "overview-full",
        "boardTitle": "CARELESSLY DESIGNED BADGE TEMPLATE ALLOWING",
        "boardSubtitle": "T1649 CREDENTIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "CARELESSLY DESIGNED",
        "rightPlaqueOverride": "JUNIOR CLERK WRITING"
      },
      {
        "sceneKind": "ad-adcs-esc1-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PUBLIC CATALOG OF AVAILABLE ID",
        "boardSubtitle": "T1649 CREDENTIAL ACCESS -> APPLICANT ALLOWED TO",
        "accentHex": 3718648,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PUBLIC CATALOG OF",
        "rightPlaqueOverride": "APPLICANT ALLOWED TO"
      },
      {
        "sceneKind": "ad-adcs-esc1-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: JUNIOR EMPLOYEE SUBMITTING THE",
        "boardSubtitle": "T1649 CREDENTIAL ACCESS -> CHIEF ADMINISTRATOR",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "JUNIOR EMPLOYEE",
        "rightPlaqueOverride": "CHIEF ADMINISTRATOR"
      },
      {
        "sceneKind": "ad-adcs-esc1-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: TRADING THE EXECUTIVE PHOTO ID AT",
        "boardSubtitle": "T1649 DEFENSE EVASION -> OFFICIAL EXECUTIVE MASTER",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "TRADING THE EXECUTIVE",
        "rightPlaqueOverride": "OFFICIAL EXECUTIVE"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "CARELESSLY DESIGNED",
    "rightPlaque": "JUNIOR CLERK WRITING"
  },
  {
    "scenarioId": "dfir-dcsync-drsuapi-replication-eid4662",
    "floor": "split-dual",
    "wallHex": 1976635,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "vault-safe",
    "rightProp": "pneumatic-tube",
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
        "sceneKind": "ad-dcsync-briefing",
        "mode": "overview-full",
        "boardTitle": "PRETENDING TO BE A SISTER VAULT ON THE",
        "boardSubtitle": "T1003.006 CREDENTIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PRETENDING TO BE A",
        "rightPlaqueOverride": "CLEARING THE SPECIAL"
      },
      {
        "sceneKind": "ad-dcsync-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: REGULAR EMPLOYEE DESK DIALING THE",
        "boardSubtitle": "T1003.006 CREDENTIAL ACCESS -> EXCLUSIVE",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "REGULAR EMPLOYEE DESK",
        "rightPlaqueOverride": "EXCLUSIVE DIRECTORY-SYNC"
      },
      {
        "sceneKind": "ad-dcsync-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ASKING TO DOWNLOAD THE SECRET",
        "boardSubtitle": "T1003.006 CREDENTIAL ACCESS -> FIRST PERMISSION",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "ASKING TO DOWNLOAD THE",
        "rightPlaqueOverride": "FIRST PERMISSION STAMP"
      },
      {
        "sceneKind": "ad-dcsync-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: ENCRYPTED COURIER POUCH SHIPPED",
        "boardSubtitle": "T1003.006 CREDENTIAL ACCESS -> MASTER KINGDOM STAMP",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ENCRYPTED COURIER POUCH",
        "rightPlaqueOverride": "MASTER KINGDOM STAMP"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "PRETENDING TO BE A",
    "rightPlaque": "CLEARING THE SPECIAL"
  },
  {
    "scenarioId": "dfir-dpapi-masterkey-lsass-browser-vault-forensics",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 3718648,
    "leftProp": "vault-safe",
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
        "sceneKind": "ad-dpapi-vault-briefing",
        "mode": "overview-full",
        "boardTitle": "LOCKED DESK SAFES STORING BROWSER NOTEBOOKS",
        "boardSubtitle": "T1555.004 CREDENTIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "LOCKED DESK SAFES",
        "rightPlaqueOverride": "PERSONAL BRASS KEY"
      },
      {
        "sceneKind": "ad-dpapi-vault-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: LOCKED CREDENTIAL POUCHES IN",
        "boardSubtitle": "T1555.004 CREDENTIAL ACCESS -> TINY SERIAL TAG",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "LOCKED CREDENTIAL",
        "rightPlaqueOverride": "TINY SERIAL TAG STAMPED"
      },
      {
        "sceneKind": "ad-dpapi-vault-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ENCRYPTED BACKUP WRAPPER INSIDE",
        "boardSubtitle": "T1555.004 CREDENTIAL ACCESS -> HEADQUARTERS",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ENCRYPTED BACKUP",
        "rightPlaqueOverride": "HEADQUARTERS EMERGENCY"
      },
      {
        "sceneKind": "ad-dpapi-vault-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: FRESHLY UNWRAPPED PERSONAL BRASS",
        "boardSubtitle": "T1555.003 CREDENTIAL ACCESS -> OPENING EVERY",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "FRESHLY UNWRAPPED",
        "rightPlaqueOverride": "OPENING EVERY"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "LOCKED DESK SAFES",
    "rightPlaque": "PERSONAL BRASS KEY"
  },
  {
    "scenarioId": "dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly",
    "floor": "circular-tech",
    "wallHex": 1973067,
    "accentHex": 16436245,
    "secondaryHex": 16007006,
    "leftProp": "concierge-press",
    "rightProp": "fortress-gate",
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
        "sceneKind": "ad-golden-ticket-briefing",
        "mode": "overview-full",
        "boardTitle": "PRINTING AN IMPOSSIBLE TEN-YEAR VIP",
        "boardSubtitle": "T1558.001 CREDENTIAL ACCESS -> LATERAL & C2 -> DEFENSE",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PRINTING AN IMPOSSIBLE",
        "rightPlaqueOverride": "WALKING STRAIGHT UP TO"
      },
      {
        "sceneKind": "ad-golden-ticket-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: STOLEN MASTER INK STAMP",
        "boardSubtitle": "T1558.001 CREDENTIAL ACCESS -> HOMEMADE VIP",
        "accentHex": 16436245,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "STOLEN MASTER INK STAMP",
        "rightPlaqueOverride": "HOMEMADE VIP WRISTBAND"
      },
      {
        "sceneKind": "ad-golden-ticket-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FLASHING THE HOMEMADE WRISTBAND",
        "boardSubtitle": "T1550.003 LATERAL & C2 -> AUDIT LEDGER SHOWING ZERO",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "FLASHING THE HOMEMADE",
        "rightPlaqueOverride": "AUDIT LEDGER SHOWING"
      },
      {
        "sceneKind": "ad-golden-ticket-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: STEPPING INTO THE HEADQUARTERS",
        "boardSubtitle": "T1558.001 DEFENSE EVASION -> FABRICATED EXECUTIVE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "STEPPING INTO THE",
        "rightPlaqueOverride": "FABRICATED EXECUTIVE"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "PRINTING AN IMPOSSIBLE",
    "rightPlaque": "WALKING STRAIGHT UP TO"
  },
  {
    "scenarioId": "dfir-ntds-dit-vssadmin-esentutl-extraction",
    "floor": "split-dual",
    "wallHex": 1976635,
    "accentHex": 3718648,
    "secondaryHex": 16096779,
    "leftProp": "vault-safe",
    "rightProp": "print-spooler",
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
        "sceneKind": "ad-ntds-vss-briefing",
        "mode": "overview-full",
        "boardTitle": "SNAPPING A FROZEN CARBON-COPY PHOTOGRAPH OF",
        "boardSubtitle": "T1003.003 CREDENTIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SNAPPING A FROZEN",
        "rightPlaqueOverride": "OFFICIAL BOOKBINDING"
      },
      {
        "sceneKind": "ad-ntds-vss-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: LIVE LEDGER BOLTED TO THE VAULT",
        "boardSubtitle": "T1003.003 CREDENTIAL ACCESS -> ACTIVATING THE",
        "accentHex": 3718648,
        "secondaryHex": 16096779,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "LIVE LEDGER BOLTED TO",
        "rightPlaqueOverride": "ACTIVATING THE BUILDING"
      },
      {
        "sceneKind": "ad-ntds-vss-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BANK OWN SIGNED BOOK-REPAIR",
        "boardSubtitle": "T1003.003 CREDENTIAL ACCESS -> PEELING A CLEAN COPY",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "BANK OWN SIGNED",
        "rightPlaqueOverride": "PEELING A CLEAN COPY"
      },
      {
        "sceneKind": "ad-ntds-vss-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: SECRET MASTER CIPHER WHEEL INSIDE",
        "boardSubtitle": "T1003.002 CREDENTIAL ACCESS -> EXPORTING THE ENTIRE",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "SECRET MASTER CIPHER",
        "rightPlaqueOverride": "EXPORTING THE ENTIRE"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "SNAPPING A FROZEN",
    "rightPlaque": "OFFICIAL BOOKBINDING"
  },
  {
    "scenarioId": "dfir-rdp-lateral-movement-tsclient-bitmap-cache",
    "floor": "split-dual",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 1096065,
    "leftProp": "hotel-desk",
    "rightProp": "proxy-mirror",
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
        "sceneKind": "ad-rdp-bitmap-briefing",
        "mode": "overview-full",
        "boardTitle": "LOCAL DESK DIARY STAMPING THE OUTGOING",
        "boardSubtitle": "T1021.001 LATERAL & C2 -> LATERAL & C2 -> EXFIL & IMPACT",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "LOCAL DESK DIARY",
        "rightPlaqueOverride": "DISTANT SERVER ROOM"
      },
      {
        "sceneKind": "ad-rdp-bitmap-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: REMOTE-VIEWING CONSOLE AT THE",
        "boardSubtitle": "T1021.001 LATERAL & C2 -> PERSONAL ADDRESS BOOK",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "REMOTE-VIEWING CONSOLE",
        "rightPlaqueOverride": "PERSONAL ADDRESS BOOK"
      },
      {
        "sceneKind": "ad-rdp-bitmap-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FRONT NETWORK DOOR LOGGING THE",
        "boardSubtitle": "T1021.001 LATERAL & C2 -> BADGE DESK LOGGING AN",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "FRONT NETWORK DOOR",
        "rightPlaqueOverride": "BADGE DESK LOGGING AN"
      },
      {
        "sceneKind": "ad-rdp-bitmap-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: HUNDREDS OF SQUARE PICTURE TILES",
        "boardSubtitle": "T1021.001 EXFIL & IMPACT -> HIDDEN DESK DRAWER",
        "accentHex": 1096065,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "HUNDREDS OF SQUARE",
        "rightPlaqueOverride": "HIDDEN DESK DRAWER"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "LOCAL DESK DIARY",
    "rightPlaque": "DISTANT SERVER ROOM"
  },
  {
    "scenarioId": "dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion",
    "floor": "split-dual",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "proxy-mirror",
    "rightProp": "notary-press",
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
        "sceneKind": "ad-ntlm-relay-briefing",
        "mode": "overview-full",
        "boardTitle": "TRICKSTER PHONING THE ENCRYPTED-FILE CLERK",
        "boardSubtitle": "T1187 CREDENTIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "TRICKSTER PHONING THE",
        "rightPlaqueOverride": "COURTHOUSE CHIEF"
      },
      {
        "sceneKind": "ad-ntlm-relay-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: BUILT-IN ENCRYPTED-FILE SERVICE",
        "boardSubtitle": "T1187 CREDENTIAL ACCESS -> ASKING THE CLERK TO OPEN",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BUILT-IN ENCRYPTED-FILE",
        "rightPlaqueOverride": "ASKING THE CLERK TO"
      },
      {
        "sceneKind": "ad-ntlm-relay-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: COURTHOUSE CORE ENGINE",
        "boardSubtitle": "T1187 CREDENTIAL ACCESS -> FLASHING THE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "COURTHOUSE CORE ENGINE",
        "rightPlaqueOverride": "FLASHING THE"
      },
      {
        "sceneKind": "ad-ntlm-relay-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: REAL-TIME MIRROR BOUNCING EVERY",
        "boardSubtitle": "T1557.001 LATERAL & C2 -> NEIGHBORING NOTARY OFFICE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "REAL-TIME MIRROR",
        "rightPlaqueOverride": "NEIGHBORING NOTARY"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "TRICKSTER PHONING THE",
    "rightPlaque": "COURTHOUSE CHIEF"
  },
  {
    "scenarioId": "dfir-smb-psexec-named-pipe-eid5145-7045",
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
        "sceneKind": "ad-smb-psexec-briefing",
        "mode": "overview-full",
        "boardTitle": "DROPPING THE WORKER KIT ONTO THE",
        "boardSubtitle": "T1021.002 LATERAL & C2 -> EXECUTION -> EXECUTION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "DROPPING THE WORKER KIT",
        "rightPlaqueOverride": "PHONING THE SHIFT"
      },
      {
        "sceneKind": "ad-smb-psexec-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: ADMINISTRATIVE LOADING BAY",
        "boardSubtitle": "T1021.002 LATERAL & C2 -> DROPPING THE PACKAGED",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ADMINISTRATIVE LOADING",
        "rightPlaqueOverride": "DROPPING THE PACKAGED"
      },
      {
        "sceneKind": "ad-smb-psexec-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BUILDING SHIFT SUPERVISOR",
        "boardSubtitle": "T1569.002 EXECUTION -> BRAND-NEW SERVICE ENTRY ON",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "BUILDING SHIFT",
        "rightPlaqueOverride": "BRAND-NEW SERVICE ENTRY"
      },
      {
        "sceneKind": "ad-smb-psexec-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: PAINTING A BRAND-NEW COVER NAME",
        "boardSubtitle": "T1569.002 EXECUTION -> MASTER CONTROL PIPE",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "PAINTING A BRAND-NEW",
        "rightPlaqueOverride": "MASTER CONTROL PIPE"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "DROPPING THE WORKER KIT",
    "rightPlaque": "PHONING THE SHIFT"
  },
  {
    "scenarioId": "dfir-winrm-wsman-remote-powershell-eid91-4624",
    "floor": "conveyor-deck",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 1096065,
    "leftProp": "pneumatic-tube",
    "rightProp": "database-vault",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 1013358,
      "accentHex": 3718648,
      "hatType": "visor"
    },
    "rightActor": {
      "coatHex": 3359061,
      "accentHex": 1096065,
      "hatType": "cap"
    },
    "sections": [
      {
        "sceneKind": "ad-winrm-wsman-briefing",
        "mode": "overview-full",
        "boardTitle": "DROPPING A SEALED COMMAND CANISTER FROM THE",
        "boardSubtitle": "T1021.006 LATERAL & C2 -> LATERAL & C2 -> EXECUTION",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "DROPPING A SEALED",
        "rightPlaqueOverride": "RECEIVING DOCK"
      },
      {
        "sceneKind": "ad-winrm-wsman-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: LOADING A SCRIPT INTO A",
        "boardSubtitle": "T1021.006 LATERAL & C2 -> CAMPUS PNEUMATIC TUBE",
        "accentHex": 2282478,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "LOADING A SCRIPT INTO A",
        "rightPlaqueOverride": "CAMPUS PNEUMATIC TUBE"
      },
      {
        "sceneKind": "ad-winrm-wsman-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: RECEIVING TUBE AT THE DATABASE",
        "boardSubtitle": "T1021.006 LATERAL & C2 -> FRONT DOOR RECEPTIONIST",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "RECEIVING TUBE AT THE",
        "rightPlaqueOverride": "FRONT DOOR RECEPTIONIST"
      },
      {
        "sceneKind": "ad-winrm-wsman-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: DEDICATED REMOTE-HOST CLERK",
        "boardSubtitle": "T1059.001 EXECUTION -> CHILD UTILITIES LAUNCHED",
        "accentHex": 1096065,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "DEDICATED REMOTE-HOST",
        "rightPlaqueOverride": "CHILD UTILITIES"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "DROPPING A SEALED",
    "rightPlaque": "RECEIVING DOCK"
  }
];

export function buildActiveDirectoryScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
