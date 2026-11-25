import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "aws-cognito-iam-passrole-privesc",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "robot-worker-bay",
    "rightProp": "oauth-kiosk",
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
        "sceneKind": "cld-aws-passrole-briefing",
        "mode": "overview-full",
        "boardTitle": "HIRING A ROBOT WORKER AND HANGING A SENIOR",
        "boardSubtitle": "T1098.001 PERSISTENCE -> PERSISTENCE -> DEFENSE EVASION",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "HIRING A ROBOT WORKER",
        "rightPlaqueOverride": "TELLING THE ROBOT TO"
      },
      {
        "sceneKind": "cld-aws-passrole-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: TINY AUTOMATED WORKER DEPLOYED ON",
        "boardSubtitle": "T1098.001 PERSISTENCE -> HANGING A POWERFUL",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "TINY AUTOMATED WORKER",
        "rightPlaqueOverride": "HANGING A POWERFUL"
      },
      {
        "sceneKind": "cld-aws-passrole-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PRESSING THE START BUTTON ON THE",
        "boardSubtitle": "T1098.003 PERSISTENCE -> PINNING A PERMANENT CHIEF",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PRESSING THE START",
        "rightPlaqueOverride": "PINNING A PERMANENT"
      },
      {
        "sceneKind": "cld-aws-passrole-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: CLOUD SECURITY BOOTH MASTER",
        "boardSubtitle": "T1562.008 DEFENSE EVASION -> FLIPPING THE RECORDING",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "CLOUD SECURITY BOOTH",
        "rightPlaqueOverride": "FLIPPING THE RECORDING"
      },
      {
        "sceneKind": "cld-aws-passrole-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "IAM PASSROLE + LAMBDA CREATEFUNCTION",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "HIRING A ROBOT WORKER",
    "rightPlaque": "TELLING THE ROBOT TO"
  },
  {
    "scenarioId": "aws-imdsv1-ssrf-capitalone-style",
    "floor": "workshop-tile",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16096779,
    "leftProp": "hotel-desk",
    "rightProp": "cloud-silo",
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
        "sceneKind": "cld-aws-imdsv1-briefing",
        "mode": "overview-full",
        "boardTitle": "FRONT-DESK COURIER FETCHING ANY INTERNAL",
        "boardSubtitle": "T1190 INITIAL ACCESS -> CREDENTIAL ACCESS -> EXFIL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "FRONT-DESK COURIER",
        "rightPlaqueOverride": "UNGUARDED INTERNAL"
      },
      {
        "sceneKind": "cld-aws-imdsv1-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: EXTERIOR WEB PROXY WINDOW",
        "boardSubtitle": "T1190 INITIAL ACCESS -> INTERNAL-ONLY WALL ADDRESS",
        "accentHex": 3718648,
        "secondaryHex": 16096779,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "EXTERIOR WEB PROXY",
        "rightPlaqueOverride": "INTERNAL-ONLY WALL"
      },
      {
        "sceneKind": "cld-aws-imdsv1-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SERVER ATTACHED GUARD ROLE DRAWER",
        "boardSubtitle": "T1552.005 CREDENTIAL ACCESS -> LIVE TEMPORARY",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "SERVER ATTACHED GUARD",
        "rightPlaqueOverride": "LIVE TEMPORARY KEYCARD"
      },
      {
        "sceneKind": "cld-aws-imdsv1-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: LOADING THE STOLEN KEYCARD",
        "boardSubtitle": "T1530 EXFIL & IMPACT -> MIRRORING GIGABYTES OF",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "LOADING THE STOLEN",
        "rightPlaqueOverride": "MIRRORING GIGABYTES OF"
      },
      {
        "sceneKind": "cld-aws-imdsv1-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "EC2 REVERSE-PROXY SSRF TO IMDSV1",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "FRONT-DESK COURIER",
    "rightPlaque": "UNGUARDED INTERNAL"
  },
  {
    "scenarioId": "azure-ad-connect-pass-the-certificate",
    "floor": "two-level-cutaway",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 11032055,
    "leftProp": "database-vault",
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
        "sceneKind": "cld-azure-adconnect-briefing",
        "mode": "overview-full",
        "boardTitle": "LOCKED CELLAR DATABASE INSIDE THE COURIER",
        "boardSubtitle": "T1003 CREDENTIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "LOCKED CELLAR DATABASE",
        "rightPlaqueOverride": "BRIDGE OWN BUILT-IN"
      },
      {
        "sceneKind": "cld-azure-adconnect-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: DIRECTORY-SYNC BRIDGE SERVER",
        "boardSubtitle": "T1003 CREDENTIAL ACCESS -> IMPERSONATING THE LOCAL",
        "accentHex": 3718648,
        "secondaryHex": 11032055,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "DIRECTORY-SYNC BRIDGE",
        "rightPlaqueOverride": "IMPERSONATING THE LOCAL"
      },
      {
        "sceneKind": "cld-azure-adconnect-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BRIDGE SERVER OWN OFFICIAL",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> POLITELY UNWRAPPING",
        "accentHex": 16096779,
        "secondaryHex": 11032055,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BRIDGE SERVER OWN",
        "rightPlaqueOverride": "POLITELY UNWRAPPING THE"
      },
      {
        "sceneKind": "cld-azure-adconnect-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SYNCHRONIZING EVERY HASH OUT OF",
        "boardSubtitle": "T1556.007 LATERAL & C2 -> LIFTING THE CLOUD",
        "accentHex": 11032055,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SYNCHRONIZING EVERY",
        "rightPlaqueOverride": "LIFTING THE CLOUD"
      },
      {
        "sceneKind": "cld-azure-adconnect-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "ENTRA CONNECT (AZURE AD CONNECT) MSOL_",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "LOCKED CELLAR DATABASE",
    "rightPlaque": "BRIDGE OWN BUILT-IN"
  },
  {
    "scenarioId": "gcp-service-account-hmac-key-pivot",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 1096065,
    "secondaryHex": 16096779,
    "leftProp": "oauth-kiosk",
    "rightProp": "cloud-silo",
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
        "sceneKind": "cld-gcp-hmac-briefing",
        "mode": "overview-full",
        "boardTitle": "SHARED DEFAULT MAINTENANCE BADGE CARRYING",
        "boardSubtitle": "T1087.004 CREDENTIAL ACCESS -> PERSISTENCE -> EXFIL &",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "SHARED DEFAULT",
        "rightPlaqueOverride": "CUTTING A PERMANENT"
      },
      {
        "sceneKind": "cld-gcp-hmac-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PEEKING INTO THE CLOUD STAFF",
        "boardSubtitle": "T1087.004 CREDENTIAL ACCESS -> DEFAULT COMPUTE",
        "accentHex": 1096065,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PEEKING INTO THE CLOUD",
        "rightPlaqueOverride": "DEFAULT COMPUTE"
      },
      {
        "sceneKind": "cld-gcp-hmac-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BADGE PRINTER STAMPING A",
        "boardSubtitle": "T1098.001 PERSISTENCE -> PERMANENT OFFLINE STEEL",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "BADGE PRINTER STAMPING",
        "rightPlaqueOverride": "PERMANENT OFFLINE STEEL"
      },
      {
        "sceneKind": "cld-gcp-hmac-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: LOADING THE STEEL KEY ONTO AN",
        "boardSubtitle": "T1530 EXFIL & IMPACT -> EMPTYING SENSITIVE CUSTOMER",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "LOADING THE STEEL KEY",
        "rightPlaqueOverride": "EMPTYING SENSITIVE"
      },
      {
        "sceneKind": "cld-gcp-hmac-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "GCP IAM.SERVICEACCOUNTKEYS.CREATE &",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "SHARED DEFAULT",
    "rightPlaque": "CUTTING A PERMANENT"
  },
  {
    "scenarioId": "k8s-runc-cve-2024-21626-leaky-vessels",
    "floor": "pier-dock",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "shipping-container",
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
        "sceneKind": "cld-k8s-runc-briefing",
        "mode": "overview-full",
        "boardTitle": "SIDE PEEPHOLE DOOR LEFT OPEN DURING BOX",
        "boardSubtitle": "T1611 EXECUTION -> PERSISTENCE -> DEFENSE EVASION",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "SIDE PEEPHOLE DOOR LEFT",
        "rightPlaqueOverride": "GUEST STANDING WITH ONE"
      },
      {
        "sceneKind": "cld-k8s-runc-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CONTAINER LAUNCHER ASSEMBLING THE",
        "boardSubtitle": "T1611 EXECUTION -> UNCLOSED PASS TO THE SHIP",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "CONTAINER LAUNCHER",
        "rightPlaqueOverride": "UNCLOSED PASS TO THE"
      },
      {
        "sceneKind": "cld-k8s-runc-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: STEEL BOX WALLS SLAMMING SHUT",
        "boardSubtitle": "T1611 PERSISTENCE -> SHOES STILL PLANTED ON AN",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "STEEL BOX WALLS",
        "rightPlaqueOverride": "SHOES STILL PLANTED ON"
      },
      {
        "sceneKind": "cld-k8s-runc-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: STEPPING BACKWARD UP FOUR",
        "boardSubtitle": "T1068 DEFENSE EVASION -> MASTER PASSWORD LEDGER ON",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "STEPPING BACKWARD UP",
        "rightPlaqueOverride": "MASTER PASSWORD LEDGER"
      },
      {
        "sceneKind": "cld-k8s-runc-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "\"LEAKY VESSELS\" RUNC WORKDIR",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "SIDE PEEPHOLE DOOR LEFT",
    "rightPlaque": "GUEST STANDING WITH ONE"
  },
  {
    "scenarioId": "microsoft-storm-0558-msa-signing-key",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "notary-press",
    "rightProp": "mailroom-chute",
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
        "sceneKind": "cld-storm0558-briefing",
        "mode": "overview-full",
        "boardTitle": "OLD 2016 CONSUMER INK STAMP SALVAGED FROM A",
        "boardSubtitle": "T1552.004 CREDENTIAL ACCESS -> DEFENSE EVASION -> EXFIL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "OLD 2016 CONSUMER INK",
        "rightPlaqueOverride": "SUBTLE FLAW LETTING"
      },
      {
        "sceneKind": "cld-storm0558-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: DIAGNOSTIC MEMORY CRASH NOTEBOOK",
        "boardSubtitle": "T1552.004 CREDENTIAL ACCESS -> RETIRED 2016",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "DIAGNOSTIC MEMORY CRASH",
        "rightPlaqueOverride": "RETIRED 2016"
      },
      {
        "sceneKind": "cld-storm0558-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: VALIDATION BLIND SPOT BETWEEN",
        "boardSubtitle": "T1606.002 DEFENSE EVASION -> ZERO ENTRY IN THE MAIN",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "VALIDATION BLIND SPOT",
        "rightPlaqueOverride": "ZERO ENTRY IN THE MAIN"
      },
      {
        "sceneKind": "cld-storm0558-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PULLING SELECTED EXECUTIVE",
        "boardSubtitle": "T1114.002 EXFIL & IMPACT -> DETAILED MAIL-ACCESS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PULLING SELECTED",
        "rightPlaqueOverride": "DETAILED MAIL-ACCESS"
      },
      {
        "sceneKind": "cld-storm0558-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "STORM-0558: ACQUIRED MSA CONSUMER SIGNING",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "OLD 2016 CONSUMER INK",
    "rightPlaque": "SUBTLE FLAW LETTING"
  },
  {
    "scenarioId": "okta-har-file-session-token-hijack",
    "floor": "split-dual",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "oauth-kiosk",
    "rightProp": "proxy-mirror",
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
        "sceneKind": "cld-okta-har-briefing",
        "mode": "overview-full",
        "boardTitle": "UPLOADED TROUBLESHOOTING RECORDINGS LEAKING",
        "boardSubtitle": "T1539 CREDENTIAL ACCESS -> DEFENSE EVASION",
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "UPLOADED TROUBLESHOOTING",
        "rightPlaqueOverride": "REPLAYING LIVE"
      },
      {
        "sceneKind": "cld-okta-har-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: RAW BROWSER NETWORK RECORDINGS IN",
        "boardSubtitle": "T1539 CREDENTIAL ACCESS -> ACTIVE UNREDACTED",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "RAW BROWSER NETWORK",
        "rightPlaqueOverride": "ACTIVE UNREDACTED"
      },
      {
        "sceneKind": "cld-okta-har-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PASTING THE LIFTED WRISTBAND INTO",
        "boardSubtitle": "T1550.004 DEFENSE EVASION -> WALKING STRAIGHT PAST",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PASTING THE LIFTED",
        "rightPlaqueOverride": "WALKING STRAIGHT PAST"
      },
      {
        "sceneKind": "cld-okta-har-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PRINTING PERMANENT MASTER API",
        "boardSubtitle": "T1098.001 PERSISTENCE -> BOLTING ON A ROGUE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PRINTING PERMANENT",
        "rightPlaqueOverride": "BOLTING ON A ROGUE"
      },
      {
        "sceneKind": "cld-okta-har-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "SUPPORT CASE .HAR FILE SID SESSION TOKEN",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "mirror-proxy-bounce",
    "leftPlaque": "UPLOADED TROUBLESHOOTING",
    "rightPlaque": "REPLAYING LIVE"
  },
  {
    "scenarioId": "snowflake-unc5537-saas-extortion",
    "floor": "conveyor-deck",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "fortress-gate",
    "rightProp": "cloud-silo",
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
        "sceneKind": "cld-snowflake-saas-briefing",
        "mode": "overview-full",
        "boardTitle": "PASSWORDS SCOOPED FROM HOME COMPUTERS USED",
        "boardSubtitle": "T1078.004 INITIAL ACCESS -> CREDENTIAL ACCESS -> EXFIL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PASSWORDS SCOOPED FROM",
        "rightPlaqueOverride": "FAST AUTOMATED CATALOG"
      },
      {
        "sceneKind": "cld-snowflake-saas-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: MASKED COMMERCIAL RELAY VANS",
        "boardSubtitle": "T1078.004 INITIAL ACCESS -> STOLEN EMPLOYEE",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MASKED COMMERCIAL RELAY",
        "rightPlaqueOverride": "STOLEN EMPLOYEE"
      },
      {
        "sceneKind": "cld-snowflake-saas-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: CUSTOM HIGH-SPEED INVENTORY SCOUT",
        "boardSubtitle": "T1087.004 CREDENTIAL ACCESS -> LISTING EVERY AISLE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "CUSTOM HIGH-SPEED",
        "rightPlaqueOverride": "LISTING EVERY AISLE"
      },
      {
        "sceneKind": "cld-snowflake-saas-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: WAREHOUSE OWN BULK FORKLIFT",
        "boardSubtitle": "T1530 EXFIL & IMPACT -> PERSONAL LOADING PLATFORM",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "WAREHOUSE OWN BULK",
        "rightPlaqueOverride": "PERSONAL LOADING"
      },
      {
        "sceneKind": "cld-snowflake-saas-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "UNC5537 CAMPAIGN: INFOSTEALER CREDENTIAL",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "PASSWORDS SCOOPED FROM",
    "rightPlaque": "FAST AUTOMATED CATALOG"
  },
  {
    "scenarioId": "sysdig-scarleteel-aws-eks-terraform",
    "floor": "pier-dock",
    "wallHex": 1976635,
    "accentHex": 16007006,
    "secondaryHex": 3718648,
    "leftProp": "k8s-tower",
    "rightProp": "cloud-silo",
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
        "sceneKind": "cld-scarleteel-briefing",
        "mode": "overview-full",
        "boardTitle": "UNGUARDED STOREFRONT KIOSK LEAKING THE",
        "boardSubtitle": "T1190 INITIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "UNGUARDED STOREFRONT",
        "rightPlaqueOverride": "PORT BLUEPRINT BOOK"
      },
      {
        "sceneKind": "cld-scarleteel-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PUBLIC WEB FLAW ON A",
        "boardSubtitle": "T1190 INITIAL ACCESS -> UNDERLYING SERVER LOCAL",
        "accentHex": 16007006,
        "secondaryHex": 3718648,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PUBLIC WEB FLAW ON A",
        "rightPlaqueOverride": "UNDERLYING SERVER LOCAL"
      },
      {
        "sceneKind": "cld-scarleteel-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: INFRASTRUCTURE STATE LEDGERS",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> LONG-LIVED MASTER",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "INFRASTRUCTURE STATE",
        "rightPlaqueOverride": "LONG-LIVED MASTER KEYS"
      },
      {
        "sceneKind": "cld-scarleteel-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: AUTOMATED CLOUD-EXPLOITATION",
        "boardSubtitle": "T1078.004 LATERAL & C2 -> MINTING PERMANENT",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "AUTOMATED CLOUD-EXPLOITA",
        "rightPlaqueOverride": "MINTING PERMANENT"
      },
      {
        "sceneKind": "cld-scarleteel-memory-xray",
        "mode": "memory-split-xray",
        "boardTitle": "SCARLETEEL OPERATION: KUBERNETES POD RCE",
        "boardSubtitle": "CLEAN BASELINE VS TAMPERED LIVE MEMORY",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "UNTOUCHED FACTORY",
        "rightPlaqueOverride": "TAMPERED LIVE INTERIOR"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "UNGUARDED STOREFRONT",
    "rightPlaque": "PORT BLUEPRINT BOOK"
  },
  {
    "scenarioId": "cloud-aws-eks-aws-auth-configmap-system-masters-audit",
    "floor": "circular-tech",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16096779,
    "leftProp": "k8s-tower",
    "rightProp": "library-toggle",
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
        "sceneKind": "cld-eks-awsauth-briefing",
        "mode": "overview-full",
        "boardTitle": "PRE-SIGNED CORPORATE BADGE UNLOCKING THE",
        "boardSubtitle": "T1078.004 INITIAL ACCESS -> PERSISTENCE -> CREDENTIAL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "PRE-SIGNED CORPORATE",
        "rightPlaqueOverride": "HAND-EDITED PAPER"
      },
      {
        "sceneKind": "cld-eks-awsauth-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SHORT-LIVED PRE-SIGNED AWS",
        "boardSubtitle": "T1078.004 INITIAL ACCESS -> KUBERNETES FRONT GATE",
        "accentHex": 3718648,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "SHORT-LIVED PRE-SIGNED",
        "rightPlaqueOverride": "KUBERNETES FRONT GATE"
      },
      {
        "sceneKind": "cld-eks-awsauth-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: DELICATE TRANSLATION CHART INSIDE",
        "boardSubtitle": "T1098 PERSISTENCE -> UNRESTRICTABLE SUPREME MASTER",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "DELICATE TRANSLATION",
        "rightPlaqueOverride": "UNRESTRICTABLE SUPREME"
      },
      {
        "sceneKind": "cld-eks-awsauth-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: READING EVERY APPLICATION SECRET",
        "boardSubtitle": "T1552.007 CREDENTIAL ACCESS -> RETIRING THE FRAGILE",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "READING EVERY",
        "rightPlaqueOverride": "RETIRING THE FRAGILE"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "PRE-SIGNED CORPORATE",
    "rightPlaque": "HAND-EDITED PAPER"
  },
  {
    "scenarioId": "cloud-aws-s3-kms-external-account-encryption-extortion-audit",
    "floor": "conveyor-deck",
    "wallHex": 1973067,
    "accentHex": 16007006,
    "secondaryHex": 16436245,
    "leftProp": "cloud-silo",
    "rightProp": "vault-safe",
    "centerMechanism": "padlock-wave",
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
        "sceneKind": "cld-s3-kms-extort-briefing",
        "mode": "overview-full",
        "boardTitle": "BRINGING AN EXTERNAL PADLOCK FROM AN",
        "boardSubtitle": "T1619 CREDENTIAL ACCESS -> EXFIL & IMPACT -> EXFIL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BRINGING AN EXTERNAL",
        "rightPlaqueOverride": "USING THE WAREHOUSE"
      },
      {
        "sceneKind": "cld-s3-kms-extort-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: FORGING AN ENCRYPTION PADLOCK",
        "boardSubtitle": "T1619 CREDENTIAL ACCESS -> AUTHORIZING THE VICTIM",
        "accentHex": 16007006,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FORGING AN ENCRYPTION",
        "rightPlaqueOverride": "AUTHORIZING THE VICTIM"
      },
      {
        "sceneKind": "cld-s3-kms-extort-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: RAPID IN-PLACE COPY ORDERS",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> SEALING EVERY FILE UNDER",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "RAPID IN-PLACE COPY",
        "rightPlaqueOverride": "SEALING EVERY FILE"
      },
      {
        "sceneKind": "cld-s3-kms-extort-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SAFETY SHELF HOLDING OLDER",
        "boardSubtitle": "T1490 EXFIL & IMPACT -> ADJUSTING AUTOMATED",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SAFETY SHELF HOLDING",
        "rightPlaqueOverride": "ADJUSTING AUTOMATED"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "BRINGING AN EXTERNAL",
    "rightPlaque": "USING THE WAREHOUSE"
  },
  {
    "scenarioId": "cloud-aws-sts-federation-token-console-signin-audit",
    "floor": "circular-tech",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 3718648,
    "leftProp": "concierge-press",
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
        "sceneKind": "cld-aws-sts-fed-briefing",
        "mode": "overview-full",
        "boardTitle": "TRADING A BACK-DOOR MACHINE BADGE AT THE",
        "boardSubtitle": "T1550.001 DEFENSE EVASION -> LATERAL & C2 -> CREDENTIAL",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "TRADING A BACK-DOOR",
        "rightPlaqueOverride": "EXCHANGING THE"
      },
      {
        "sceneKind": "cld-aws-sts-fed-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: LEAKED STATIC PROGRAMMER KEY",
        "boardSubtitle": "T1550.001 DEFENSE EVASION -> CLOUD TOKEN-EXCHANGE",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "LEAKED STATIC",
        "rightPlaqueOverride": "CLOUD TOKEN-EXCHANGE"
      },
      {
        "sceneKind": "cld-aws-sts-fed-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: WEB LOBBY TICKET BOOTH",
        "boardSubtitle": "T1078.004 LATERAL & C2 -> SINGLE-USE BROWSER ENTRY",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "WEB LOBBY TICKET BOOTH",
        "rightPlaqueOverride": "SINGLE-USE BROWSER"
      },
      {
        "sceneKind": "cld-aws-sts-fed-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: CLICKING FREELY THROUGH VISUAL",
        "boardSubtitle": "T1069.003 CREDENTIAL ACCESS -> DIGGING THROUGH",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "CLICKING FREELY THROUGH",
        "rightPlaqueOverride": "DIGGING THROUGH OLDER"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "TRADING A BACK-DOOR",
    "rightPlaque": "EXCHANGING THE"
  },
  {
    "scenarioId": "cloud-azure-vm-custom-script-extension-managed-identity-audit",
    "floor": "workshop-tile",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 1096065,
    "leftProp": "mail-chute",
    "rightProp": "robot-worker-bay",
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
        "sceneKind": "cld-azure-vm-cse-briefing",
        "mode": "overview-full",
        "boardTitle": "SLIDING A REMOTE WORK-ORDER ENVELOPE",
        "boardSubtitle": "T1059 EXECUTION -> DEFENSE EVASION -> CREDENTIAL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "SLIDING A REMOTE",
        "rightPlaqueOverride": "ROOM BUILT-IN GUEST"
      },
      {
        "sceneKind": "cld-azure-vm-cse-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PUSHING A SCRIPT ORDER FROM THE",
        "boardSubtitle": "T1059 EXECUTION -> SKIPPING SSH KEYS AND WINDOWS",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "PUSHING A SCRIPT ORDER",
        "rightPlaqueOverride": "SKIPPING SSH KEYS AND"
      },
      {
        "sceneKind": "cld-azure-vm-cse-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: OFFICIAL AZURE GUEST BUTLER",
        "boardSubtitle": "T1078.004 DEFENSE EVASION -> LAUNCHING THE SCRIPT",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "OFFICIAL AZURE GUEST",
        "rightPlaqueOverride": "LAUNCHING THE SCRIPT"
      },
      {
        "sceneKind": "cld-azure-vm-cse-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: TAPPING THE ROOM LOCAL IDENTITY",
        "boardSubtitle": "T1552.005 CREDENTIAL ACCESS -> WITHDRAWING THE",
        "accentHex": 1096065,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "TAPPING THE ROOM LOCAL",
        "rightPlaqueOverride": "WITHDRAWING THE SERVER"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "SLIDING A REMOTE",
    "rightPlaque": "ROOM BUILT-IN GUEST"
  },
  {
    "scenarioId": "cloud-entra-id-conditional-access-device-code-phishing-audit",
    "floor": "split-dual",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "oauth-kiosk",
    "rightProp": "hotel-desk",
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
        "sceneKind": "cld-entra-devcode-briefing",
        "mode": "overview-full",
        "boardTitle": "GRABBING A NINE-CHARACTER SMART-TV PAIRING",
        "boardSubtitle": "T1528 CREDENTIAL ACCESS -> DEFENSE EVASION -> EXFIL",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "GRABBING A NINE-CHARACTE",
        "rightPlaqueOverride": "MASTER FAMILY-OF-APPS"
      },
      {
        "sceneKind": "cld-entra-devcode-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: REQUESTING A LEGITIMATE",
        "boardSubtitle": "T1528 CREDENTIAL ACCESS -> GENUINE COMPANY LOGIN",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "REQUESTING A LEGITIMATE",
        "rightPlaqueOverride": "GENUINE COMPANY LOGIN"
      },
      {
        "sceneKind": "cld-entra-devcode-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: INTERCHANGEABLE MASTER REFRESH",
        "boardSubtitle": "T1550.001 DEFENSE EVASION -> SWAPPING FOR FRESH",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "INTERCHANGEABLE MASTER",
        "rightPlaqueOverride": "SWAPPING FOR FRESH"
      },
      {
        "sceneKind": "cld-entra-devcode-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PROGRAMMATICALLY SEARCHING INBOX",
        "boardSubtitle": "T1530 EXFIL & IMPACT -> HUNTING PASSWORDS AND",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PROGRAMMATICALLY",
        "rightPlaqueOverride": "HUNTING PASSWORDS AND"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "GRABBING A NINE-CHARACTE",
    "rightPlaque": "MASTER FAMILY-OF-APPS"
  },
  {
    "scenarioId": "cloud-gcp-cloud-build-default-service-account-artifact-audit",
    "floor": "conveyor-deck",
    "wallHex": 988970,
    "accentHex": 1096065,
    "secondaryHex": 16096779,
    "leftProp": "factory-conveyor",
    "rightProp": "cloud-silo",
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
        "sceneKind": "cld-gcp-cloudbuild-briefing",
        "mode": "overview-full",
        "boardTitle": "SUBMITTING AN AD-HOC BUILD ORDER CONTAINING",
        "boardSubtitle": "T1648 EXECUTION -> DEFENSE EVASION -> EXFIL & IMPACT",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SUBMITTING AN AD-HOC",
        "rightPlaqueOverride": "READING THE DEFAULT"
      },
      {
        "sceneKind": "cld-gcp-cloudbuild-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: QUICK CUSTOM ASSEMBLY JOB",
        "boardSubtitle": "T1648 EXECUTION -> INLINE SHELL STEP DESIGNED TO",
        "accentHex": 1096065,
        "secondaryHex": 16096779,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "QUICK CUSTOM ASSEMBLY",
        "rightPlaqueOverride": "INLINE SHELL STEP"
      },
      {
        "sceneKind": "cld-gcp-cloudbuild-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BOOTH LOCAL METADATA WALL PANEL",
        "boardSubtitle": "T1552.005 DEFENSE EVASION -> OVERLY PRIVILEGED",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "BOOTH LOCAL METADATA",
        "rightPlaqueOverride": "OVERLY PRIVILEGED"
      },
      {
        "sceneKind": "cld-gcp-cloudbuild-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: FINISHED-SOFTWARE ARTIFACT",
        "boardSubtitle": "T1530 EXFIL & IMPACT -> PRIVATE SOURCE ARCHIVES",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "FINISHED-SOFTWARE",
        "rightPlaqueOverride": "PRIVATE SOURCE ARCHIVES"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "SUBMITTING AN AD-HOC",
    "rightPlaque": "READING THE DEFAULT"
  },
  {
    "scenarioId": "cloud-github-actions-pull-request-target-oidc-token-audit",
    "floor": "conveyor-deck",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 3718648,
    "leftProp": "factory-conveyor",
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
        "sceneKind": "cld-gha-oidc-briefing",
        "mode": "overview-full",
        "boardTitle": "INVITING UNTRUSTED OUTSIDE BLUEPRINTS",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> CREDENTIAL ACCESS",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "INVITING UNTRUSTED",
        "rightPlaqueOverride": "LIFTING A TEMPORARY"
      },
      {
        "sceneKind": "cld-gha-oidc-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: WORKFLOW TRIGGERING WITH FULL",
        "boardSubtitle": "T1195.002 INITIAL ACCESS -> EXPLICITLY CHECKING OUT",
        "accentHex": 11032055,
        "secondaryHex": 3718648,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "WORKFLOW TRIGGERING",
        "rightPlaqueOverride": "EXPLICITLY CHECKING OUT"
      },
      {
        "sceneKind": "cld-gha-oidc-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: WORKBENCH NOTE HOLDING THE",
        "boardSubtitle": "T1552.001 CREDENTIAL ACCESS -> WORKBENCH NOTE",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "WORKBENCH NOTE HOLDING",
        "rightPlaqueOverride": "WORKBENCH NOTE HOLDING"
      },
      {
        "sceneKind": "cld-gha-oidc-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SWAPPING THE OIDC CARD AT THE",
        "boardSubtitle": "T1550.001 LATERAL & C2 -> TRUST POLICY CHECKING",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SWAPPING THE OIDC CARD",
        "rightPlaqueOverride": "TRUST POLICY CHECKING"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "INVITING UNTRUSTED",
    "rightPlaque": "LIFTING A TEMPORARY"
  },
  {
    "scenarioId": "cloud-m365-sharepoint-ediscovery-compliance-search-export-audit",
    "floor": "workshop-tile",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "mailroom-chute",
    "rightProp": "cloud-silo",
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
        "sceneKind": "cld-m365-ediscov-briefing",
        "mode": "overview-full",
        "boardTitle": "ADDING A HIJACKED BADGE ONTO THE LEGAL",
        "boardSubtitle": "T1098.003 DEFENSE EVASION -> EXFIL & IMPACT -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ADDING A HIJACKED BADGE",
        "rightPlaqueOverride": "RUNNING A COMPANY-WIDE"
      },
      {
        "sceneKind": "cld-m365-ediscov-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PRESTIGIOUS LEGAL EDISCOVERY",
        "boardSubtitle": "T1098.003 DEFENSE EVASION -> QUIETLY ADDING A",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PRESTIGIOUS LEGAL",
        "rightPlaqueOverride": "QUIETLY ADDING A"
      },
      {
        "sceneKind": "cld-m365-ediscov-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: CENTRAL LEGAL-DISCOVERY SEARCH",
        "boardSubtitle": "T1213.002 EXFIL & IMPACT -> SWEEPING TENANT-WIDE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "CENTRAL LEGAL-DISCOVERY",
        "rightPlaqueOverride": "SWEEPING TENANT-WIDE"
      },
      {
        "sceneKind": "cld-m365-ediscov-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: TRIGGERING AN OFFICIAL EXPORT JOB",
        "boardSubtitle": "T1114.002 EXFIL & IMPACT -> PULLING SHIPPING TRUNKS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "TRIGGERING AN OFFICIAL",
        "rightPlaqueOverride": "PULLING SHIPPING TRUNKS"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "ADDING A HIJACKED BADGE",
    "rightPlaque": "RUNNING A COMPANY-WIDE"
  },
  {
    "scenarioId": "cloud-midnight-blizzard-oauth-legacy-test-app-audit",
    "floor": "workshop-tile",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "oauth-kiosk",
    "rightProp": "mailroom-chute",
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
        "sceneKind": "cld-midblizz-audit-briefing",
        "mode": "overview-full",
        "boardTitle": "SLOWLY TRYING KEYS FROM RESIDENTIAL",
        "boardSubtitle": "T1110.003 INITIAL ACCESS -> PERSISTENCE -> EXFIL &",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "SLOWLY TRYING KEYS FROM",
        "rightPlaqueOverride": "ATTACHING A FRESH"
      },
      {
        "sceneKind": "cld-midblizz-audit-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: THOUSANDS OF HOME INTERNET",
        "boardSubtitle": "T1110.003 INITIAL ACCESS -> OLD NON-PRODUCTION",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "THOUSANDS OF HOME",
        "rightPlaqueOverride": "OLD NON-PRODUCTION"
      },
      {
        "sceneKind": "cld-midblizz-audit-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: OVER-PRIVILEGED LEGACY AUTOMATED",
        "boardSubtitle": "T1098.003 PERSISTENCE -> STAMPING A BRAND-NEW",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "OVER-PRIVILEGED LEGACY",
        "rightPlaqueOverride": "STAMPING A BRAND-NEW"
      },
      {
        "sceneKind": "cld-midblizz-audit-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: PRESENTING THE COURIER TOKEN TO",
        "boardSubtitle": "T1114.002 EXFIL & IMPACT -> SYSTEMATICALLY PULLING",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PRESENTING THE COURIER",
        "rightPlaqueOverride": "SYSTEMATICALLY PULLING"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "SLOWLY TRYING KEYS FROM",
    "rightPlaque": "ATTACHING A FRESH"
  },
  {
    "scenarioId": "cloud-salesforce-connected-app-oauth-bulk-api-export-audit",
    "floor": "conveyor-deck",
    "wallHex": 1516884,
    "accentHex": 2282478,
    "secondaryHex": 16096779,
    "leftProp": "oauth-kiosk",
    "rightProp": "cloud-silo",
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
        "sceneKind": "cld-sfdc-bulk-briefing",
        "mode": "overview-full",
        "boardTitle": "TRICKING AN EMPLOYEE INTO AUTHORIZING AN",
        "boardSubtitle": "T1528 PERSISTENCE -> EXFIL & IMPACT -> EXFIL &",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "TRICKING AN EMPLOYEE",
        "rightPlaqueOverride": "ORDERING THE LIBRARY"
      },
      {
        "sceneKind": "cld-sfdc-bulk-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: DISGUISED EXTERNAL CONNECTED APP",
        "boardSubtitle": "T1528 PERSISTENCE -> RENEWABLE KEY RING HANDED TO",
        "accentHex": 2282478,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "DISGUISED EXTERNAL",
        "rightPlaqueOverride": "RENEWABLE KEY RING"
      },
      {
        "sceneKind": "cld-sfdc-bulk-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: HIGH-SPEED ASYNCHRONOUS BULK",
        "boardSubtitle": "T1530 EXFIL & IMPACT -> GATHERING EVERY CUSTOMER",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "HIGH-SPEED ASYNCHRONOUS",
        "rightPlaqueOverride": "GATHERING EVERY"
      },
      {
        "sceneKind": "cld-sfdc-bulk-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PULLING DOWN EVERY FINISHED",
        "boardSubtitle": "T1567 EXFIL & IMPACT -> HIGH-VOLUME RESULT-DOWNLOAD",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "PULLING DOWN EVERY",
        "rightPlaqueOverride": "HIGH-VOLUME"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "TRICKING AN EMPLOYEE",
    "rightPlaque": "ORDERING THE LIBRARY"
  },
  {
    "scenarioId": "dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda",
    "floor": "circular-tech",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 1096065,
    "leftProp": "robot-worker-bay",
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
        "sceneKind": "cld-dfir-shadow-briefing",
        "mode": "overview-full",
        "boardTitle": "PASSING A POWERFUL ROLE TO A CUSTOM SCRIPT",
        "boardSubtitle": "T1098.001 DEFENSE EVASION -> PERSISTENCE -> DEFENSE",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PASSING A POWERFUL ROLE",
        "rightPlaqueOverride": "SCRIPT ATTACHING FULL"
      },
      {
        "sceneKind": "cld-dfir-shadow-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: HIDDEN SHADOW-ADMIN PERMISSION",
        "boardSubtitle": "T1098.001 DEFENSE EVASION -> REGISTERING A",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "HIDDEN SHADOW-ADMIN",
        "rightPlaqueOverride": "REGISTERING A BRAND-NEW"
      },
      {
        "sceneKind": "cld-dfir-shadow-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: TRIGGERING THE HELPER FUNCTION",
        "boardSubtitle": "T1098.001 PERSISTENCE -> ATTACHING FULL",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "TRIGGERING THE HELPER",
        "rightPlaqueOverride": "ATTACHING FULL"
      },
      {
        "sceneKind": "cld-dfir-shadow-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: ATTEMPTING TO TURN OFF OR ERASE",
        "boardSubtitle": "T1562.008 DEFENSE EVASION -> LOUDEST RED FLARE",
        "accentHex": 1096065,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "ATTEMPTING TO TURN OFF",
        "rightPlaqueOverride": "LOUDEST RED FLARE"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "PASSING A POWERFUL ROLE",
    "rightPlaque": "SCRIPT ATTACHING FULL"
  },
  {
    "scenarioId": "dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics",
    "floor": "split-dual",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "hotel-desk",
    "rightProp": "cloud-silo",
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
        "sceneKind": "cld-dfir-imds-s3-briefing",
        "mode": "overview-full",
        "boardTitle": "TRICKED SERVER HANDING A TEMPORARY PASS OUT",
        "boardSubtitle": "T1552.005 CREDENTIAL ACCESS -> DEFENSE EVASION -> EXFIL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "TRICKED SERVER HANDING",
        "rightPlaqueOverride": "SAME PASS AUTHENTICATING"
      },
      {
        "sceneKind": "cld-dfir-imds-s3-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: OLDER UNAUTHENTICATED LOCAL",
        "boardSubtitle": "T1552.005 CREDENTIAL ACCESS -> PERSUADING THE WEB",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "OLDER UNAUTHENTICATED",
        "rightPlaqueOverride": "PERSUADING THE WEB"
      },
      {
        "sceneKind": "cld-dfir-imds-s3-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: TESTING THE KEYCARD TO VERIFY",
        "boardSubtitle": "T1550.001 DEFENSE EVASION -> PERIMETER SENSOR",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "TESTING THE KEYCARD TO",
        "rightPlaqueOverride": "PERIMETER SENSOR"
      },
      {
        "sceneKind": "cld-dfir-imds-s3-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: SWEEPING THROUGH SENSITIVE",
        "boardSubtitle": "T1530 EXFIL & IMPACT -> TALLYING EVERY RECEIPT AND",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "SWEEPING THROUGH",
        "rightPlaqueOverride": "TALLYING EVERY RECEIPT"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "TRICKED SERVER HANDING",
    "rightPlaque": "SAME PASS AUTHENTICATING"
  },
  {
    "scenarioId": "dfir-entra-id-prt-roadtools-device-registration-forensics",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 3718648,
    "leftProp": "oauth-kiosk",
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
        "sceneKind": "cld-dfir-entra-prt-briefing",
        "mode": "overview-full",
        "boardTitle": "REQUESTING AN APPOINTMENT TICKET FOR THE",
        "boardSubtitle": "T1528 CREDENTIAL ACCESS -> PERSISTENCE -> DEFENSE",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "REQUESTING AN",
        "rightPlaqueOverride": "REGISTERING A"
      },
      {
        "sceneKind": "cld-dfir-entra-prt-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SPECIAL PASS SCOPED TO THE DEVICE",
        "boardSubtitle": "T1528 CREDENTIAL ACCESS -> STOLEN USER SIGN-IN",
        "accentHex": 11032055,
        "secondaryHex": 3718648,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "SPECIAL PASS SCOPED TO",
        "rightPlaqueOverride": "STOLEN USER SIGN-IN"
      },
      {
        "sceneKind": "cld-dfir-entra-prt-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: REGISTERING A PHANTOM COMPUTER",
        "boardSubtitle": "T1098.005 PERSISTENCE -> GENUINE COMPANY DEVICE",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "REGISTERING A PHANTOM",
        "rightPlaqueOverride": "GENUINE COMPANY DEVICE"
      },
      {
        "sceneKind": "cld-dfir-entra-prt-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: LONG-LIVED PRIMARY RESIDENT",
        "boardSubtitle": "T1550.001 DEFENSE EVASION -> MATCHING CRYPTOGRAPHIC",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "LONG-LIVED PRIMARY",
        "rightPlaqueOverride": "MATCHING CRYPTOGRAPHIC"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "REQUESTING AN",
    "rightPlaque": "REGISTERING A"
  },
  {
    "scenarioId": "dfir-gcp-cloud-audit-service-account-key-impersonation",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 1096065,
    "secondaryHex": 16096779,
    "leftProp": "oauth-kiosk",
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
        "sceneKind": "cld-dfir-gcp-imp-briefing",
        "mode": "overview-full",
        "boardTitle": "BORROWING THE TEMPORARY VOICE OF A SENIOR",
        "boardSubtitle": "T1078.004 DEFENSE EVASION -> PERSISTENCE -> EXFIL &",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "BORROWING THE TEMPORARY",
        "rightPlaqueOverride": "STAMPING A PERMANENT"
      },
      {
        "sceneKind": "cld-dfir-gcp-imp-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: TOKEN-BORROWING RIGHTS OVER A",
        "boardSubtitle": "T1078.004 DEFENSE EVASION -> REQUESTING A",
        "accentHex": 1096065,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "TOKEN-BORROWING RIGHTS",
        "rightPlaqueOverride": "REQUESTING A"
      },
      {
        "sceneKind": "cld-dfir-gcp-imp-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PRINTING A PERMANENT JSON KEY FILE",
        "boardSubtitle": "T1098.001 PERSISTENCE -> WORKING INDEFINITELY FROM",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "PRINTING A PERMANENT",
        "rightPlaqueOverride": "WORKING INDEFINITELY"
      },
      {
        "sceneKind": "cld-dfir-gcp-imp-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: BULK EXTRACTION JOBS SWEEPING",
        "boardSubtitle": "T1530 EXFIL & IMPACT -> WAREHOUSE METERING LOG",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "BULK EXTRACTION JOBS",
        "rightPlaqueOverride": "WAREHOUSE METERING LOG"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "BORROWING THE TEMPORARY",
    "rightPlaque": "STAMPING A PERMANENT"
  },
  {
    "scenarioId": "dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape",
    "floor": "pier-dock",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16007006,
    "leftProp": "k8s-tower",
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
        "sceneKind": "cld-dfir-k8s-priv-briefing",
        "mode": "overview-full",
        "boardTitle": "ASKING THE FRONT-DESK POLICY BOOK WHAT",
        "boardSubtitle": "T1613 CREDENTIAL ACCESS -> DEFENSE EVASION",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "ASKING THE FRONT-DESK",
        "rightPlaqueOverride": "ORDERING A BOOTH WITH"
      },
      {
        "sceneKind": "cld-dfir-k8s-priv-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SUBMITTING A SELF-AUDIT INQUIRY",
        "boardSubtitle": "T1613 CREDENTIAL ACCESS -> STOLEN CONTAINER BADGE",
        "accentHex": 3718648,
        "secondaryHex": 16007006,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "SUBMITTING A SELF-AUDIT",
        "rightPlaqueOverride": "STOLEN CONTAINER BADGE"
      },
      {
        "sceneKind": "cld-dfir-k8s-priv-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BREAKOUT BOOTH BLUEPRINT WITH ALL",
        "boardSubtitle": "T1611 DEFENSE EVASION -> FULL VISIBILITY INTO HOST",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "BREAKOUT BOOTH",
        "rightPlaqueOverride": "FULL VISIBILITY INTO"
      },
      {
        "sceneKind": "cld-dfir-k8s-priv-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: FLIPPING THE NAMESPACE MASTER",
        "boardSubtitle": "T1611 DEFENSE EVASION -> UNDERLYING NODE MAIN",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "FLIPPING THE NAMESPACE",
        "rightPlaqueOverride": "UNDERLYING NODE MAIN"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "ASKING THE FRONT-DESK",
    "rightPlaque": "ORDERING A BOOTH WITH"
  },
  {
    "scenarioId": "dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule",
    "floor": "conveyor-deck",
    "wallHex": 1516884,
    "accentHex": 3718648,
    "secondaryHex": 16096779,
    "leftProp": "mailroom-chute",
    "rightProp": "broadcast-tower",
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
        "sceneKind": "cld-dfir-m365-ual-briefing",
        "mode": "overview-full",
        "boardTitle": "HIDDEN MAIL-SORTING CHUTE DIVERTING ALERTS",
        "boardSubtitle": "T1564.008 PERSISTENCE -> EXFIL & IMPACT -> PERSISTENCE",
        "storyPlotOverride": "dispatch-intercept",
        "leftPlaqueOverride": "HIDDEN MAIL-SORTING",
        "rightPlaqueOverride": "BARCODE SCANS"
      },
      {
        "sceneKind": "cld-dfir-m365-ual-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SILENT AUTO-SORTING RULE BOLTED",
        "boardSubtitle": "T1564.008 PERSISTENCE -> VANISHING INTO AN OBSCURE",
        "accentHex": 3718648,
        "secondaryHex": 16096779,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "SILENT AUTO-SORTING",
        "rightPlaqueOverride": "VANISHING INTO AN"
      },
      {
        "sceneKind": "cld-dfir-m365-ual-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BARCODE LEDGER TRACKING EVERY",
        "boardSubtitle": "T1114.002 EXFIL & IMPACT -> PEEKING AT INDIVIDUAL",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "BARCODE LEDGER TRACKING",
        "rightPlaqueOverride": "PEEKING AT INDIVIDUAL"
      },
      {
        "sceneKind": "cld-dfir-m365-ual-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: APPROVING A SHADY THIRD-PARTY",
        "boardSubtitle": "T1098.003 PERSISTENCE -> SURVIVING ORDINARY",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "APPROVING A SHADY",
        "rightPlaqueOverride": "SURVIVING ORDINARY"
      }
    ],
    "storyPlot": "dispatch-intercept",
    "leftPlaque": "HIDDEN MAIL-SORTING",
    "rightPlaque": "BARCODE SCANS"
  }
];

export function buildCloudSaasScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
