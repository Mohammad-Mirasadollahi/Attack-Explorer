import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "circleci-oauth-github-token-rotation-breach",
    "floor": "conveyor-deck",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "oauth-kiosk",
    "rightProp": "factory-conveyor",
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
        "sceneKind": "sup-circleci-briefing",
        "mode": "overview-full",
        "boardTitle": "SILENT POCKET-PICKING PROGRAM LIFTING A",
        "boardSubtitle": "T1539 INITIAL ACCESS -> DEFENSE EVASION -> LATERAL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SILENT POCKET-PICKING",
        "rightPlaqueOverride": "REPLAYING THE ACTIVE"
      },
      {
        "sceneKind": "sup-circleci-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: TROJANIZED HELPER TOOL ON A WORK",
        "boardSubtitle": "T1539 INITIAL ACCESS -> ALREADY-VERIFIED SECURITY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "TROJANIZED HELPER TOOL",
        "rightPlaqueOverride": "ALREADY-VERIFIED"
      },
      {
        "sceneKind": "sup-circleci-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: WEARING THE STOLEN WRISTBAND FROM",
        "boardSubtitle": "T1550.004 DEFENSE EVASION -> ENCRYPTED CUSTOMER",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "WEARING THE STOLEN",
        "rightPlaqueOverride": "ENCRYPTED CUSTOMER"
      },
      {
        "sceneKind": "sup-circleci-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PAIRING THE MASTER KEY WITH",
        "boardSubtitle": "T1552.001 LATERAL & C2 -> FRESHLY UNCOVERED CODE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PAIRING THE MASTER KEY",
        "rightPlaqueOverride": "FRESHLY UNCOVERED CODE"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "SILENT POCKET-PICKING",
    "rightPlaque": "REPLAYING THE ACTIVE"
  },
  {
    "scenarioId": "codecov-bash-uploader-ci-env-exfil",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
    "accentHex": 16007006,
    "secondaryHex": 2282478,
    "leftProp": "factory-conveyor",
    "rightProp": "mail-chute",
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
        "sceneKind": "sup-codecov-briefing",
        "mode": "overview-full",
        "boardTitle": "SPARE WAREHOUSE KEY LEFT INSIDE AN OLD",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> EXFIL & IMPACT -> LATERAL &",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "SPARE WAREHOUSE KEY",
        "rightPlaqueOverride": "ADDING ONE HIDDEN LINE"
      },
      {
        "sceneKind": "sup-codecov-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: DISCARDED CONTAINER CRATE",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> FORGOTTEN STORAGE-ROOM",
        "accentHex": 16007006,
        "secondaryHex": 2282478,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "DISCARDED CONTAINER",
        "rightPlaqueOverride": "FORGOTTEN STORAGE-ROOM"
      },
      {
        "sceneKind": "sup-codecov-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PULLING AND RUNNING THE UNSEALED",
        "boardSubtitle": "T1005 EXFIL & IMPACT -> KEY CARDS AND TOKENS",
        "accentHex": 16096779,
        "secondaryHex": 2282478,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PULLING AND RUNNING THE",
        "rightPlaqueOverride": "KEY CARDS AND TOKENS"
      },
      {
        "sceneKind": "sup-codecov-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: STOLEN CUSTOMER KEY RINGS",
        "boardSubtitle": "T1078.004 LATERAL & C2 -> PRIVATE BLUEPRINT VAULTS",
        "accentHex": 2282478,
        "secondaryHex": 1096065,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "STOLEN CUSTOMER KEY",
        "rightPlaqueOverride": "PRIVATE BLUEPRINT VAULTS"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "SPARE WAREHOUSE KEY",
    "rightPlaque": "ADDING ONE HIDDEN LINE"
  },
  {
    "scenarioId": "github-actions-tj-actions-changed-files-cve-2025-30066",
    "floor": "conveyor-deck",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16096779,
    "leftProp": "factory-conveyor",
    "rightProp": "vault-safe",
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
        "sceneKind": "sup-tjactions-briefing",
        "mode": "overview-full",
        "boardTitle": "SWAPPING EVERY FLOATING SHELF LABEL TO A",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> CREDENTIAL ACCESS -> EXFIL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "SWAPPING EVERY FLOATING",
        "rightPlaqueOverride": "READING SECRET"
      },
      {
        "sceneKind": "sup-tjactions-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: STOLEN LIBRARIAN PASS",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> MOVING EVERY FLOATING",
        "accentHex": 11032055,
        "secondaryHex": 16096779,
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "STOLEN LIBRARIAN PASS",
        "rightPlaqueOverride": "MOVING EVERY FLOATING"
      },
      {
        "sceneKind": "sup-tjactions-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: WORKSHOP UNLOCKED MASTER KEY",
        "boardSubtitle": "T1003.007 CREDENTIAL ACCESS -> PEERING INTO THE",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "WORKSHOP UNLOCKED",
        "rightPlaqueOverride": "PEERING INTO THE LIVE"
      },
      {
        "sceneKind": "sup-tjactions-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: AVOIDING NOISY DELIVERY TRUCKS",
        "boardSubtitle": "T1567 EXFIL & IMPACT -> FOLDING EVERY STOLEN SECRET",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "AVOIDING NOISY DELIVERY",
        "rightPlaqueOverride": "FOLDING EVERY STOLEN"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "SWAPPING EVERY FLOATING",
    "rightPlaque": "READING SECRET"
  },
  {
    "scenarioId": "jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "hotel-desk",
    "rightProp": "factory-conveyor",
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
        "sceneKind": "sup-teamcity-27198-briefing",
        "mode": "overview-full",
        "boardTitle": "NONEXISTENT ROOM SLIP WITH A HIDDEN",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> INITIAL ACCESS",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "NONEXISTENT ROOM SLIP",
        "rightPlaqueOverride": "MINTING A BRAND-NEW"
      },
      {
        "sceneKind": "sup-teamcity-27198-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: EMPTY HALLWAY ADDRESS WITH A",
        "boardSubtitle": "T1190 INITIAL ACCESS -> GATE GUARD WAVING THE SLIP",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "EMPTY HALLWAY ADDRESS",
        "rightPlaqueOverride": "GATE GUARD WAVING THE"
      },
      {
        "sceneKind": "sup-teamcity-27198-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: MASTER ASSEMBLY-LINE SCHEDULE",
        "boardSubtitle": "T1195.002 EXECUTION -> FLAGSHIP CUSTOMER RELEASE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "MASTER ASSEMBLY-LINE",
        "rightPlaqueOverride": "FLAGSHIP CUSTOMER"
      },
      {
        "sceneKind": "sup-teamcity-27198-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: UNSUSPECTING FACTORY ROBOT",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> WELDING A HIDDEN",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "UNSUSPECTING FACTORY",
        "rightPlaqueOverride": "WELDING A HIDDEN"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "NONEXISTENT ROOM SLIP",
    "rightPlaque": "MINTING A BRAND-NEW"
  },
  {
    "scenarioId": "kaseya-vsa-revil-cve-2021-30116",
    "floor": "circular-tech",
    "wallHex": 1973067,
    "accentHex": 16007006,
    "secondaryHex": 16436245,
    "leftProp": "broadcast-tower",
    "rightProp": "hypervisor-vault",
    "centerMechanism": "padlock-wave",
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
        "sceneKind": "sup-kaseya-vsa-briefing",
        "mode": "overview-full",
        "boardTitle": "MASTER BUILDING-MANAGEMENT DISPATCH CONSOLE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> DEFENSE EVASION -> DEFENSE",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MASTER BUILDING-MANAGEME",
        "rightPlaqueOverride": "BREAKING PAST THE"
      },
      {
        "sceneKind": "sup-kaseya-vsa-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNPATCHED BACKDOOR WINDOW ON THE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> DISGUISED PARCEL LABELED AS",
        "accentHex": 16007006,
        "secondaryHex": 16436245,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "UNPATCHED BACKDOOR",
        "rightPlaqueOverride": "DISGUISED PARCEL"
      },
      {
        "sceneKind": "sup-kaseya-vsa-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: TRUSTED DISPATCH MEGAPHONE",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> LOCAL BUILDING AGENTS",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "TRUSTED DISPATCH",
        "rightPlaqueOverride": "LOCAL BUILDING AGENTS"
      },
      {
        "sceneKind": "sup-kaseya-vsa-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: OLDER GENUINELY STAMPED",
        "boardSubtitle": "T1574.002 DEFENSE EVASION -> COUNTERFEIT INTERNAL",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "OLDER GENUINELY STAMPED",
        "rightPlaqueOverride": "COUNTERFEIT INTERNAL"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "MASTER BUILDING-MANAGEME",
    "rightPlaque": "BREAKING PAST THE"
  },
  {
    "scenarioId": "ledger-connect-kit-npmjs-drainer",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "oauth-kiosk",
    "rightProp": "vault-safe",
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
        "sceneKind": "sup-ledger-kit-briefing",
        "mode": "overview-full",
        "boardTitle": "FORMER EMPLOYEE KEYCARD NEVER CANCELED",
        "boardSubtitle": "T1195.001 INITIAL ACCESS -> EXECUTION -> EXFIL & IMPACT",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "FORMER EMPLOYEE KEYCARD",
        "rightPlaqueOverride": "SHARED COURIER TRUCK"
      },
      {
        "sceneKind": "sup-ledger-kit-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: FORMER WORKER BADGE NEVER REVOKED",
        "boardSubtitle": "T1195.001 INITIAL ACCESS -> CONVINCING PHISHING LURE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "FORMER WORKER BADGE",
        "rightPlaqueOverride": "CONVINCING PHISHING LURE"
      },
      {
        "sceneKind": "sup-ledger-kit-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PARTNER SHOPS THAT BOLTED DOWN",
        "boardSubtitle": "T1059.007 EXECUTION -> TINY STARTER LOADER FETCHING",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "PARTNER SHOPS THAT",
        "rightPlaqueOverride": "TINY STARTER LOADER"
      },
      {
        "sceneKind": "sup-ledger-kit-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PIXEL-PERFECT COUNTERFEIT",
        "boardSubtitle": "T1657 EXFIL & IMPACT -> BLANK POWER-OF-ATTORNEY SLIP",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "PIXEL-PERFECT",
        "rightPlaqueOverride": "BLANK POWER-OF-ATTORNEY"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "FORMER EMPLOYEE KEYCARD",
    "rightPlaque": "SHARED COURIER TRUCK"
  },
  {
    "scenarioId": "lottie-player-npm-ace-supply-chain-2024",
    "floor": "conveyor-deck",
    "wallHex": 1516884,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "factory-conveyor",
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
        "sceneKind": "sup-lottie-npm-briefing",
        "mode": "overview-full",
        "boardTitle": "STUDIO PUBLISHING PASS PUSHING THREE",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> LATERAL & C2 -> EXFIL &",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "STUDIO PUBLISHING PASS",
        "rightPlaqueOverride": "HIDDEN RADIO BEACON"
      },
      {
        "sceneKind": "sup-lottie-npm-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: STOLEN STUDIO ACCESS TOKEN",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> THREE RAPID-FIRE",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "STOLEN STUDIO ACCESS",
        "rightPlaqueOverride": "THREE RAPID-FIRE"
      },
      {
        "sceneKind": "sup-lottie-npm-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: WEBPAGE PLAYING A DECORATIVE",
        "boardSubtitle": "T1059.007 LATERAL & C2 -> LIVE TWO-WAY RADIO CHANNEL",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "WEBPAGE PLAYING A",
        "rightPlaqueOverride": "LIVE TWO-WAY RADIO"
      },
      {
        "sceneKind": "sup-lottie-npm-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: CRYSTAL-CLEAR COUNTERFEIT PROMPT",
        "boardSubtitle": "T1185 EXFIL & IMPACT -> HOST SITE OWN TRUSTED BANNER",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CRYSTAL-CLEAR",
        "rightPlaqueOverride": "HOST SITE OWN TRUSTED"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "STUDIO PUBLISHING PASS",
    "rightPlaque": "HIDDEN RADIO BEACON"
  },
  {
    "scenarioId": "npm-ua-parser-js-coa-rc-supply-chain",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
    "accentHex": 16096779,
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
        "sceneKind": "sup-npm-uaparser-briefing",
        "mode": "overview-full",
        "boardTitle": "TINY BRASS SCREWS PACKED INSIDE MILLIONS OF",
        "boardSubtitle": "T1195.001 INITIAL ACCESS -> EXECUTION -> DEFENSE EVASION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "TINY BRASS SCREWS",
        "rightPlaqueOverride": "WAREHOUSE LOGIN LACKING"
      },
      {
        "sceneKind": "sup-npm-uaparser-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: COMPONENT-MAKER ACCOUNT LACKING A",
        "boardSubtitle": "T1195.001 INITIAL ACCESS -> ROUTINE-LOOKING VERSION",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "COMPONENT-MAKER ACCOUNT",
        "rightPlaqueOverride": "ROUTINE-LOOKING VERSION"
      },
      {
        "sceneKind": "sup-npm-uaparser-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ROUTINE MORNING TOOLBOX REFRESH",
        "boardSubtitle": "T1059.007 EXECUTION -> CHECKING WHETHER THE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "ROUTINE MORNING TOOLBOX",
        "rightPlaqueOverride": "CHECKING WHETHER THE"
      },
      {
        "sceneKind": "sup-npm-uaparser-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: OFFICIAL PARTS-REGISTRATION",
        "boardSubtitle": "T1218.010 DEFENSE EVASION -> AWAKENING THE PASSWORD",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "OFFICIAL PARTS-REGISTRAT",
        "rightPlaqueOverride": "AWAKENING THE PASSWORD"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "TINY BRASS SCREWS",
    "rightPlaque": "WAREHOUSE LOGIN LACKING"
  },
  {
    "scenarioId": "polyfill-io-cdn-domain-supply-chain",
    "floor": "pier-dock",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "broadcast-tower",
    "rightProp": "proxy-mirror",
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
        "sceneKind": "sup-polyfill-cdn-briefing",
        "mode": "overview-full",
        "boardTitle": "SHARED BANNER HUNG WITHOUT A TAMPER-PROOF",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> DEFENSE EVASION -> EXFIL &",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "SHARED BANNER HUNG",
        "rightPlaqueOverride": "SHADY NEW OWNER"
      },
      {
        "sceneKind": "sup-polyfill-cdn-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: OUTSIDE HELPER BANNER ON THE",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> MISSING CRYPTOGRAPHIC",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "OUTSIDE HELPER BANNER",
        "rightPlaqueOverride": "MISSING CRYPTOGRAPHIC"
      },
      {
        "sceneKind": "sup-polyfill-cdn-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PEEKING AT THE VISITOR HAT",
        "boardSubtitle": "T1027 DEFENSE EVASION -> SPOTLESS SCRIPT HANDED TO",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "PEEKING AT THE VISITOR",
        "rightPlaqueOverride": "SPOTLESS SCRIPT HANDED"
      },
      {
        "sceneKind": "sup-polyfill-cdn-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: INVITED DIRECTLY ONTO THE",
        "boardSubtitle": "T1185 EXFIL & IMPACT -> LOOKALIKE TRACKER SCRIPT",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "INVITED DIRECTLY ONTO",
        "rightPlaqueOverride": "LOOKALIKE TRACKER"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "SHARED BANNER HUNG",
    "rightPlaque": "SHADY NEW OWNER"
  },
  {
    "scenarioId": "pypi-pytorch-torchtriton-dependency-confusion-supply-chain",
    "floor": "split-dual",
    "wallHex": 1976635,
    "accentHex": 16347926,
    "secondaryHex": 3718648,
    "leftProp": "model-crate",
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
        "sceneKind": "sup-torchtriton-briefing",
        "mode": "overview-full",
        "boardTitle": "PUBLIC DOWNTOWN MARKET CHECKED BEFORE THE",
        "boardSubtitle": "T1195.001 INITIAL ACCESS -> EXECUTION -> EXFIL & IMPACT",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "PUBLIC DOWNTOWN MARKET",
        "rightPlaqueOverride": "BOOTH RENTED UNDER THE"
      },
      {
        "sceneKind": "sup-torchtriton-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: INTERNAL HELPER NAME UNRESERVED",
        "boardSubtitle": "T1195.001 INITIAL ACCESS -> CLAIMING THE EXACT NAME",
        "accentHex": 16347926,
        "secondaryHex": 3718648,
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "INTERNAL HELPER NAME",
        "rightPlaqueOverride": "CLAIMING THE EXACT NAME"
      },
      {
        "sceneKind": "sup-torchtriton-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: OPENING THE LIBRARY FOR ROUTINE",
        "boardSubtitle": "T1059.006 EXECUTION -> BOX STARTUP LID TRIGGERING",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "OPENING THE LIBRARY FOR",
        "rightPlaqueOverride": "BOX STARTUP LID"
      },
      {
        "sceneKind": "sup-torchtriton-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: BLOCKED CARGO TRUCKS AT THE FRONT",
        "boardSubtitle": "T1048.003 EXFIL & IMPACT -> COMPRESSING AND LOCKING",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BLOCKED CARGO TRUCKS AT",
        "rightPlaqueOverride": "COMPRESSING AND LOCKING"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "PUBLIC DOWNTOWN MARKET",
    "rightPlaque": "BOOTH RENTED UNDER THE"
  },
  {
    "scenarioId": "pypi-ultralytics-github-pwnrequest",
    "floor": "conveyor-deck",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "robot-worker-bay",
    "rightProp": "notary-press",
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
        "sceneKind": "sup-ultralytics-briefing",
        "mode": "overview-full",
        "boardTitle": "TASTING ROBOT READING VISITOR CARDS INSIDE",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> PERSISTENCE -> EXFIL &",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "TASTING ROBOT READING",
        "rightPlaqueOverride": "STEALING THE FACTORY"
      },
      {
        "sceneKind": "sup-ultralytics-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PUBLIC SUGGESTION CARD FROM",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> TITLE LABEL HIDING",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "PUBLIC SUGGESTION CARD",
        "rightPlaqueOverride": "TITLE LABEL HIDING"
      },
      {
        "sceneKind": "sup-ultralytics-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FACTORY SHIPPING-HOUSE",
        "boardSubtitle": "T1195.001 PERSISTENCE -> SILENT REMOTE-FETCHING",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "FACTORY SHIPPING-HOUSE",
        "rightPlaqueOverride": "SILENT REMOTE-FETCHING"
      },
      {
        "sceneKind": "sup-ultralytics-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: UNPACKING THE FRESH KIT IN A",
        "boardSubtitle": "T1496 EXFIL & IMPACT -> COIN-MINING ENGINE HIDDEN",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "UNPACKING THE FRESH KIT",
        "rightPlaqueOverride": "COIN-MINING ENGINE"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "TASTING ROBOT READING",
    "rightPlaque": "STEALING THE FACTORY"
  },
  {
    "scenarioId": "rspack-solana-web3js-npm-supply-chain-2024",
    "floor": "conveyor-deck",
    "wallHex": 1973067,
    "accentHex": 1096065,
    "secondaryHex": 16007006,
    "leftProp": "proxy-mirror",
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
        "sceneKind": "sup-solana-web3-briefing",
        "mode": "overview-full",
        "boardTitle": "LOOKALIKE COURIER WEBSITE STEALING A",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> EXFIL & IMPACT -> EXFIL &",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "LOOKALIKE COURIER",
        "rightPlaqueOverride": "SILENT KEY-COPYING"
      },
      {
        "sceneKind": "sup-solana-web3-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: LOOKALIKE GUILD PORTAL NOTICE",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> HIJACKED PUBLISHING",
        "accentHex": 1096065,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "LOOKALIKE GUILD PORTAL",
        "rightPlaqueOverride": "HIJACKED PUBLISHING"
      },
      {
        "sceneKind": "sup-solana-web3-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: REFRESHING THE PARTS SHELF",
        "boardSubtitle": "T1552.004 EXFIL & IMPACT -> OFFICIAL KEY-LOADING",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "REFRESHING THE PARTS",
        "rightPlaqueOverride": "OFFICIAL KEY-LOADING"
      },
      {
        "sceneKind": "sup-solana-web3-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: WATCHFUL MAILROOM INSPECTORS",
        "boardSubtitle": "T1041 EXFIL & IMPACT -> FAKE TRANSIT-ROUTING STAMPS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "WATCHFUL MAILROOM",
        "rightPlaqueOverride": "FAKE TRANSIT-ROUTING"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "LOOKALIKE COURIER",
    "rightPlaque": "SILENT KEY-COPYING"
  },
  {
    "scenarioId": "solarwinds-sunburst-orion-supply-chain",
    "floor": "conveyor-deck",
    "wallHex": 988970,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "factory-conveyor",
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
        "sceneKind": "sup-solarwinds-briefing",
        "mode": "overview-full",
        "boardTitle": "HIDDEN SABOTEUR WATCHING THE ASSEMBLY PRESS",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> LATERAL & C2 -> CREDENTIAL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "HIDDEN SABOTEUR",
        "rightPlaqueOverride": "SWAPPING A COUNTERFEIT"
      },
      {
        "sceneKind": "sup-solarwinds-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SABOTEUR CHECKING THE CONVEYOR",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> POISONED PAGE SLIPPED",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "SABOTEUR CHECKING THE",
        "rightPlaqueOverride": "POISONED PAGE SLIPPED"
      },
      {
        "sceneKind": "sup-solarwinds-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: COUNTERFEIT BOARD SITTING SILENT",
        "boardSubtitle": "T1568.002 LATERAL & C2 -> CHECKING IT IS NOT INSIDE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "COUNTERFEIT BOARD",
        "rightPlaqueOverride": "CHECKING IT IS NOT"
      },
      {
        "sceneKind": "sup-solarwinds-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PAPERLESS LOCKPICKER UNFOLDED",
        "boardSubtitle": "T1552.004 CREDENTIAL ACCESS -> CORPORATE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PAPERLESS LOCKPICKER",
        "rightPlaqueOverride": "CORPORATE BADGE-PRINTING"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "HIDDEN SABOTEUR",
    "rightPlaque": "SWAPPING A COUNTERFEIT"
  }
];

export function buildSupplyChainCicdScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
