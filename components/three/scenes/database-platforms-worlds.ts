import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "db-mongodb-mongobleed-unauthenticated-replication-oplog-audit",
    "floor": "workshop-tile",
    "wallHex": 413243,
    "accentHex": 1096065,
    "secondaryHex": 16007006,
    "leftProp": "database-vault",
    "rightProp": "broadcast-tower",
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
        "sceneKind": "db-mongobleed-briefing",
        "mode": "overview-full",
        "boardTitle": "ROLL-UP DOOR PROPPED OPEN -> STROLLING IN",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ROLL-UP DOOR PROPPED",
        "rightPlaqueOverride": "STROLLING IN TO LIST"
      },
      {
        "sceneKind": "db-mongobleed-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: WIDE-OPEN STREET DOOR",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> AUTOMATED CATALOG KIOSK",
        "accentHex": 1096065,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "WIDE-OPEN STREET DOOR",
        "rightPlaqueOverride": "AUTOMATED CATALOG KIOSK"
      },
      {
        "sceneKind": "db-mongobleed-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ROLLING CARBON-COPY SYNC JOURNAL",
        "boardSubtitle": "T1552 CREDENTIAL ACCESS -> PLAY-BY-PLAY TRANSCRIPT",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "ROLLING CARBON-COPY",
        "rightPlaqueOverride": "PLAY-BY-PLAY TRANSCRIPT"
      },
      {
        "sceneKind": "db-mongobleed-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: HIGH-SPEED CONVEYOR SWEEP",
        "boardSubtitle": "T1485 EXFIL & IMPACT -> RANSOM DEMAND WARNING BOX",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "HIGH-SPEED CONVEYOR",
        "rightPlaqueOverride": "RANSOM DEMAND WARNING"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "ROLL-UP DOOR PROPPED",
    "rightPlaque": "STROLLING IN TO LIST"
  },
  {
    "scenarioId": "db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "pneumatic-tube",
    "rightProp": "database-vault",
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
        "sceneKind": "db-mssql-linked-briefing",
        "mode": "overview-full",
        "boardTitle": "INTERNAL BRASS PNEUMATIC TUBES -> FIRST",
        "boardSubtitle": "T1021 LATERAL & C2 -> DEFENSE EVASION -> PERSISTENCE",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "INTERNAL BRASS",
        "rightPlaqueOverride": "FIRST WALL SWITCH"
      },
      {
        "sceneKind": "db-mssql-linked-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: WALL DIRECTORY OF TUBES",
        "boardSubtitle": "T1021 LATERAL & C2 -> OPEN OUTBOUND CHUTE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "WALL DIRECTORY OF TUBES",
        "rightPlaqueOverride": "OPEN OUTBOUND CHUTE"
      },
      {
        "sceneKind": "db-mssql-linked-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FLIPPING RED SAFETY COVERS",
        "boardSubtitle": "T1562 DEFENSE EVASION -> DIRECT MAINTENANCE HATCH",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "FLIPPING RED SAFETY",
        "rightPlaqueOverride": "DIRECT MAINTENANCE HATCH"
      },
      {
        "sceneKind": "db-mssql-linked-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: RAW INK DIGITS IN CABINET",
        "boardSubtitle": "T1505.001 PERSISTENCE -> UNRESTRICTED WORKER",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "RAW INK DIGITS IN",
        "rightPlaqueOverride": "UNRESTRICTED WORKER"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "INTERNAL BRASS",
    "rightPlaque": "FIRST WALL SWITCH"
  },
  {
    "scenarioId": "db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094",
    "floor": "workshop-tile",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "concierge-press",
    "rightProp": "database-vault",
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
        "sceneKind": "db-pg-utf8-1094-briefing",
        "mode": "overview-full",
        "boardTitle": "PROTECTIVE WAX SEAL CLERK -> MALFORMED",
        "boardSubtitle": "T1190 INITIAL ACCESS -> EXECUTION -> EXECUTION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "PROTECTIVE WAX SEAL",
        "rightPlaqueOverride": "MALFORMED FOREIGN"
      },
      {
        "sceneKind": "db-pg-utf8-1094-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: WAX-SEAL MACHINE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> BROKEN MULTI-BYTE SYMBOL",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "WAX-SEAL MACHINE",
        "rightPlaqueOverride": "BROKEN MULTI-BYTE SYMBOL"
      },
      {
        "sceneKind": "db-pg-utf8-1094-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: INTERACTIVE CLERK CONSOLE",
        "boardSubtitle": "T1059.004 EXECUTION -> EXCLAMATION-MARK SHORTCUT",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "INTERACTIVE CLERK",
        "rightPlaqueOverride": "EXCLAMATION-MARK"
      },
      {
        "sceneKind": "db-pg-utf8-1094-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: MASTER CUSTODIAN CLEARANCE",
        "boardSubtitle": "T1203 EXECUTION -> BUILT-IN BULK-IMPORT CHUTE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "MASTER CUSTODIAN",
        "rightPlaqueOverride": "BUILT-IN BULK-IMPORT"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "PROTECTIVE WAX SEAL",
    "rightPlaque": "MALFORMED FOREIGN"
  },
  {
    "scenarioId": "db-redis-lua-sandbox-debian-liblua-cve-2022-0543",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 16007006,
    "secondaryHex": 16436245,
    "leftProp": "database-vault",
    "rightProp": "library-toggle",
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
        "sceneKind": "db-redis-lua-briefing",
        "mode": "overview-full",
        "boardTitle": "EXPRESS LUGGAGE LOCKER ROOM -> LOCKED",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> EXECUTION -> EXECUTION",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "EXPRESS LUGGAGE LOCKER",
        "rightPlaqueOverride": "LOCKED CALCULATOR GLASS"
      },
      {
        "sceneKind": "db-redis-lua-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNLOCKED LUGGAGE COUNTER",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> LOBBY DIRECTORY BUTTON",
        "accentHex": 16007006,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UNLOCKED LUGGAGE COUNTER",
        "rightPlaqueOverride": "LOBBY DIRECTORY BUTTON"
      },
      {
        "sceneKind": "db-redis-lua-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SHORT CALCULATION SLIP",
        "boardSubtitle": "T1059 EXECUTION -> FORGOTTEN SUPPLY-CLOSET CATALOG",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SHORT CALCULATION SLIP",
        "rightPlaqueOverride": "FORGOTTEN SUPPLY-CLOSET"
      },
      {
        "sceneKind": "db-redis-lua-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PUNCHING THROUGH BACK WALL",
        "boardSubtitle": "T1203 EXECUTION -> LOCKER ATTENDANT BADGE",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PUNCHING THROUGH BACK",
        "rightPlaqueOverride": "LOCKER ATTENDANT BADGE"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "EXPRESS LUGGAGE LOCKER",
    "rightPlaque": "LOCKED CALCULATOR GLASS"
  },
  {
    "scenarioId": "db-snowflake-unc5537-single-factor-auth-data-egress-audit",
    "floor": "conveyor-deck",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "cloud-silo",
    "rightProp": "shipping-container",
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
        "sceneKind": "db-snowflake-egress-briefing",
        "mode": "overview-full",
        "boardTitle": "STOLEN SINGLE-KEY CONTRACTOR PASSWORD",
        "boardSubtitle": "T1078.004 INITIAL ACCESS -> CREDENTIAL ACCESS -> EXFIL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "STOLEN SINGLE-KEY",
        "rightPlaqueOverride": "MISSING APPROVED-VISITOR"
      },
      {
        "sceneKind": "db-snowflake-egress-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: OLD COPIED CONTRACTOR KEY",
        "boardSubtitle": "T1078.004 INITIAL ACCESS -> NO SECOND VERIFICATION",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "OLD COPIED CONTRACTOR",
        "rightPlaqueOverride": "NO SECOND VERIFICATION"
      },
      {
        "sceneKind": "db-snowflake-egress-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: AUTOMATED CLIPBOARD SWEEP",
        "boardSubtitle": "T1087.004 CREDENTIAL ACCESS -> LISTING MASTER KEY",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "AUTOMATED CLIPBOARD",
        "rightPlaqueOverride": "LISTING MASTER KEY ROLES"
      },
      {
        "sceneKind": "db-snowflake-egress-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: PERSONAL STAGING CLOSET",
        "boardSubtitle": "T1530 EXFIL & IMPACT -> COMPRESSING CUSTOMER AISLES",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PERSONAL STAGING CLOSET",
        "rightPlaqueOverride": "COMPRESSING CUSTOMER"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "STOLEN SINGLE-KEY",
    "rightPlaque": "MISSING APPROVED-VISITOR"
  }
];

export function buildDatabasePlatformsScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
