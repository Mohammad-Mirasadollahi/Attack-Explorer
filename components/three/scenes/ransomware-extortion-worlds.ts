import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "acidrain-viasat-ka-sat-modem-wiper",
    "floor": "circular-tech",
    "wallHex": 988970,
    "accentHex": 16007006,
    "secondaryHex": 16096779,
    "leftProp": "satellite-dish",
    "rightProp": "broadcast-tower",
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
        "sceneKind": "ran-acidrain-briefing",
        "mode": "overview-full",
        "boardTitle": "CENTRAL MANAGEMENT DECK PUSHING ONE",
        "boardSubtitle": "T1199 INITIAL ACCESS -> EXFIL & IMPACT -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CENTRAL MANAGEMENT DECK",
        "rightPlaqueOverride": "SWEEPING ALL ORDINARY"
      },
      {
        "sceneKind": "ran-acidrain-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SATELLITE GROUND-STATION MASTER",
        "boardSubtitle": "T1199 INITIAL ACCESS -> OFFICIAL REMOTE-UPDATE",
        "accentHex": 16007006,
        "secondaryHex": 16096779,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "SATELLITE GROUND-STATION",
        "rightPlaqueOverride": "OFFICIAL REMOTE-UPDATE"
      },
      {
        "sceneKind": "ran-acidrain-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FORKING QUIETLY INTO THE",
        "boardSubtitle": "T1561.002 EXFIL & IMPACT -> SWEEPING EVERY ATTACHED",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "FORKING QUIETLY INTO",
        "rightPlaqueOverride": "SWEEPING EVERY ATTACHED"
      },
      {
        "sceneKind": "ran-acidrain-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: RAW SOLDERED FLASH CHIPS FROM",
        "boardSubtitle": "T1495 EXFIL & IMPACT -> READING PHYSICAL GEOMETRY",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "RAW SOLDERED FLASH",
        "rightPlaqueOverride": "READING PHYSICAL"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "CENTRAL MANAGEMENT DECK",
    "rightPlaque": "SWEEPING ALL ORDINARY"
  },
  {
    "scenarioId": "akira-ransomware-cisco-anyconnect-esxi",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 16007006,
    "secondaryHex": 2282478,
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
        "sceneKind": "ran-akira-esxi-briefing",
        "mode": "overview-full",
        "boardTitle": "FRONT LOBBY DOOR ACCEPTING SINGLE-FACTOR",
        "boardSubtitle": "T1133 INITIAL ACCESS -> CREDENTIAL ACCESS -> EXFIL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FRONT LOBBY DOOR",
        "rightPlaqueOverride": "HIDDEN GARDEN HOSE"
      },
      {
        "sceneKind": "ran-akira-esxi-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: EXTERIOR REMOTE-ACCESS LOBBY DOOR",
        "boardSubtitle": "T1133 INITIAL ACCESS -> SINGLE-PASSWORD GATE FLAW",
        "accentHex": 16007006,
        "secondaryHex": 2282478,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "EXTERIOR REMOTE-ACCESS",
        "rightPlaqueOverride": "SINGLE-PASSWORD GATE"
      },
      {
        "sceneKind": "ran-akira-esxi-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: CONCEALED REVERSE SPEAKING TUBE",
        "boardSubtitle": "T1555 CREDENTIAL ACCESS -> CORPORATE",
        "accentHex": 16096779,
        "secondaryHex": 2282478,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CONCEALED REVERSE",
        "rightPlaqueOverride": "CORPORATE BACKUP-SCHEDUL"
      },
      {
        "sceneKind": "ran-akira-esxi-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: FLIPPING HARD POWER BREAKERS ON",
        "boardSubtitle": "T1489 EXFIL & IMPACT -> RELEASING HEAVY DISK BOLTS",
        "accentHex": 2282478,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FLIPPING HARD POWER",
        "rightPlaqueOverride": "RELEASING HEAVY DISK"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "FRONT LOBBY DOOR",
    "rightPlaque": "HIDDEN GARDEN HOSE"
  },
  {
    "scenarioId": "alphv-blackcat-sphynx-rust-impacket-exmatter",
    "floor": "conveyor-deck",
    "wallHex": 988970,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "mail-chute",
    "rightProp": "hypervisor-vault",
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
        "sceneKind": "ran-blackcat-briefing",
        "mode": "overview-full",
        "boardTitle": "SILENT COURIER SWEEPING FOLDERS OUT AND",
        "boardSubtitle": "T1048.002 EXFIL & IMPACT -> DEFENSE EVASION -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SILENT COURIER SWEEPING",
        "rightPlaqueOverride": "UNLOCKING A BRIEFCASE"
      },
      {
        "sceneKind": "ran-blackcat-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: QUIET FILE-GATHERING COURIER",
        "boardSubtitle": "T1048.002 EXFIL & IMPACT -> PACKING CONTRACTS ONTO",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "QUIET FILE-GATHERING",
        "rightPlaqueOverride": "PACKING CONTRACTS ONTO"
      },
      {
        "sceneKind": "ran-blackcat-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SECRET JOB TOKEN UNLOCKING THE",
        "boardSubtitle": "T1490 DEFENSE EVASION -> FLIPPING A BUILDING",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SECRET JOB TOKEN",
        "rightPlaqueOverride": "FLIPPING A BUILDING"
      },
      {
        "sceneKind": "ran-blackcat-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: MARCHING ITSELF DOWN EVERY OFFICE",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> HALTING RUNNING VIRTUAL",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MARCHING ITSELF DOWN",
        "rightPlaqueOverride": "HALTING RUNNING VIRTUAL"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "SILENT COURIER SWEEPING",
    "rightPlaque": "UNLOCKING A BRIEFCASE"
  },
  {
    "scenarioId": "bianlian-extortion-go-backdoor-rdp",
    "floor": "split-dual",
    "wallHex": 1976635,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "telecom-bridge",
    "rightProp": "vault-safe",
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
        "sceneKind": "ran-bianlian-briefing",
        "mode": "overview-full",
        "boardTitle": "CUSTOM ONE-OF-A-KIND SECRET RADIO TAILORED",
        "boardSubtitle": "T1573.002 LATERAL & C2 -> LATERAL & C2 -> EXFIL & IMPACT",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CUSTOM ONE-OF-A-KIND",
        "rightPlaqueOverride": "SPLITTING ONE RADIO"
      },
      {
        "sceneKind": "ran-bianlian-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: BESPOKE COMPACT RADIO COMPILED",
        "boardSubtitle": "T1573.002 LATERAL & C2 -> REFUSING TO SPEAK EXCEPT",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BESPOKE COMPACT RADIO",
        "rightPlaqueOverride": "REFUSING TO SPEAK"
      },
      {
        "sceneKind": "ran-bianlian-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SPLITTING ONE RADIO LINE INTO",
        "boardSubtitle": "T1090.001 LATERAL & C2 -> INTERNAL DOORWAY RELAY",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SPLITTING ONE RADIO",
        "rightPlaqueOverride": "INTERNAL DOORWAY RELAY"
      },
      {
        "sceneKind": "ran-bianlian-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: LEAVING EVERY CABINET UNLOCKED TO",
        "boardSubtitle": "T1567.002 EXFIL & IMPACT -> RENAMED CLOUD-SYNC",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "LEAVING EVERY CABINET",
        "rightPlaqueOverride": "RENAMED CLOUD-SYNC"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "CUSTOM ONE-OF-A-KIND",
    "rightPlaque": "SPLITTING ONE RADIO"
  },
  {
    "scenarioId": "blackbasta-qakbot-backstab-ransomware",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16007006,
    "secondaryHex": 16096779,
    "leftProp": "hotel-desk",
    "rightProp": "hypervisor-vault",
    "centerMechanism": "padlock-wave",
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
        "sceneKind": "ran-blackbasta-briefing",
        "mode": "overview-full",
        "boardTitle": "JAMMING THE MAILBOX AND CALLING AS A",
        "boardSubtitle": "T1566.004 INITIAL ACCESS -> DEFENSE EVASION -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "JAMMING THE MAILBOX AND",
        "rightPlaqueOverride": "OUTDATED INSPECTOR"
      },
      {
        "sceneKind": "ran-blackbasta-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: THOUSANDS OF NOISY JUNK CIRCULARS",
        "boardSubtitle": "T1566.004 INITIAL ACCESS -> EXTERNAL OFFICE",
        "accentHex": 16007006,
        "secondaryHex": 16096779,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "THOUSANDS OF NOISY JUNK",
        "rightPlaqueOverride": "EXTERNAL OFFICE"
      },
      {
        "sceneKind": "ran-blackbasta-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PULLING DOWN A TOOLBOX THROUGH",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> OLDER SIGNED",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "PULLING DOWN A TOOLBOX",
        "rightPlaqueOverride": "OLDER SIGNED"
      },
      {
        "sceneKind": "ran-blackbasta-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SPREADING DOWN EVERY CONNECTED",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> SHREDDING EVERY BACKUP",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SPREADING DOWN EVERY",
        "rightPlaqueOverride": "SHREDDING EVERY BACKUP"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "JAMMING THE MAILBOX AND",
    "rightPlaque": "OUTDATED INSPECTOR"
  },
  {
    "scenarioId": "cactus-ransomware-qlik-sense-ssh-batch-unpacker",
    "floor": "workshop-tile",
    "wallHex": 413243,
    "accentHex": 1096065,
    "secondaryHex": 16007006,
    "leftProp": "pneumatic-tube",
    "rightProp": "model-crate",
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
        "sceneKind": "ran-cactus-briefing",
        "mode": "overview-full",
        "boardTitle": "WARPED SIDE TUNNEL AND PERMANENT HIDDEN",
        "boardSubtitle": "T1190 INITIAL ACCESS -> DEFENSE EVASION -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "WARPED SIDE TUNNEL AND",
        "rightPlaqueOverride": "PASSWORD-LOCKED"
      },
      {
        "sceneKind": "ran-cactus-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: BENT ROUTING TUNNEL INSIDE AN",
        "boardSubtitle": "T1190 INITIAL ACCESS -> REPEATING SCHEDULED TASK",
        "accentHex": 1096065,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BENT ROUTING TUNNEL",
        "rightPlaqueOverride": "REPEATING SCHEDULED"
      },
      {
        "sceneKind": "ran-cactus-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SPRAYING A LOCKED ARCHIVE ACROSS",
        "boardSubtitle": "T1140 DEFENSE EVASION -> UNZIPPING WITH A BATCH",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SPRAYING A LOCKED",
        "rightPlaqueOverride": "UNZIPPING WITH A BATCH"
      },
      {
        "sceneKind": "ran-cactus-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: TAKING SMALL SIPS SO",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> TEMPORARY WORK BADGE DURING",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "TAKING SMALL SIPS SO",
        "rightPlaqueOverride": "TEMPORARY WORK BADGE"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "WARPED SIDE TUNNEL AND",
    "rightPlaque": "PASSWORD-LOCKED"
  },
  {
    "scenarioId": "caddywiper-arguepatch-gpo-destruction",
    "floor": "circular-tech",
    "wallHex": 1973067,
    "accentHex": 16007006,
    "secondaryHex": 16436245,
    "leftProp": "broadcast-tower",
    "rightProp": "hypervisor-vault",
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
        "sceneKind": "ran-caddywiper-briefing",
        "mode": "overview-full",
        "boardTitle": "DISGUISED REPAIR-TOOL WRAPPER PUSHED FROM",
        "boardSubtitle": "T1053.005 EXECUTION -> CREDENTIAL ACCESS -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "DISGUISED REPAIR-TOOL",
        "rightPlaqueOverride": "CHECKING WHETHER EACH"
      },
      {
        "sceneKind": "ran-caddywiper-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CENTRAL DISPATCH TOWER POLICY",
        "boardSubtitle": "T1053.005 EXECUTION -> SURGICALLY ALTERED KNOWN",
        "accentHex": 16007006,
        "secondaryHex": 16436245,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "CENTRAL DISPATCH TOWER",
        "rightPlaqueOverride": "SURGICALLY ALTERED"
      },
      {
        "sceneKind": "ran-caddywiper-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ASSEMBLING COMMAND LABELS PIECE",
        "boardSubtitle": "T1082 CREDENTIAL ACCESS -> CHECKING THE ROOM",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ASSEMBLING COMMAND",
        "rightPlaqueOverride": "CHECKING THE ROOM"
      },
      {
        "sceneKind": "ran-caddywiper-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: CLAIMING LEGAL OWNERSHIP OF EVERY",
        "boardSubtitle": "T1561.001 EXFIL & IMPACT -> OVERWRITING EVERY FILE",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CLAIMING LEGAL",
        "rightPlaqueOverride": "OVERWRITING EVERY FILE"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "DISGUISED REPAIR-TOOL",
    "rightPlaque": "CHECKING WHETHER EACH"
  },
  {
    "scenarioId": "cl0p-truebot-flawedgrace-sdbbot-ransomware",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16007006,
    "secondaryHex": 3718648,
    "leftProp": "library-toggle",
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
        "sceneKind": "ran-cl0p-truebot-briefing",
        "mode": "overview-full",
        "boardTitle": "QUIET LOBBY SCOUT UNLOCKING A FULL",
        "boardSubtitle": "T1218.011 EXECUTION -> DEFENSE EVASION -> EXFIL & IMPACT",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "QUIET LOBBY SCOUT",
        "rightPlaqueOverride": "TINY COMMAND LAUNCHER"
      },
      {
        "sceneKind": "ran-cl0p-truebot-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: NIMBLE DOWNLOAD SCOUT",
        "boardSubtitle": "T1218.011 EXECUTION -> FULL-FEATURED ESPIONAGE",
        "accentHex": 16007006,
        "secondaryHex": 3718648,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "NIMBLE DOWNLOAD SCOUT",
        "rightPlaqueOverride": "FULL-FEATURED ESPIONAGE"
      },
      {
        "sceneKind": "ran-cl0p-truebot-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FEATHERWEIGHT COMMAND STAGER",
        "boardSubtitle": "T1489 DEFENSE EVASION -> MASSIVE CHECKLIST OF SIX",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FEATHERWEIGHT COMMAND",
        "rightPlaqueOverride": "MASSIVE CHECKLIST OF"
      },
      {
        "sceneKind": "ran-cl0p-truebot-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: DEDICATED PARALLEL LOCKING SQUADS",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> FAST LOCKS WRAPPED INSIDE A",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "DEDICATED PARALLEL",
        "rightPlaqueOverride": "FAST LOCKS WRAPPED"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "QUIET LOBBY SCOUT",
    "rightPlaque": "TINY COMMAND LAUNCHER"
  },
  {
    "scenarioId": "dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "hypervisor-vault",
    "rightProp": "vault-safe",
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
        "sceneKind": "ran-dfir-esxi-briefing",
        "mode": "overview-full",
        "boardTitle": "LOGGING INTO THE WAREHOUSE BASEMENT CONSOLE",
        "boardSubtitle": "T1078 INITIAL ACCESS -> EXFIL & IMPACT -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "LOGGING INTO THE",
        "rightPlaqueOverride": "PULLING THE EMERGENCY"
      },
      {
        "sceneKind": "ran-dfir-esxi-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: BASEMENT MANAGEMENT TERMINAL",
        "boardSubtitle": "T1078 INITIAL ACCESS -> CHIEF SUPERINTENDENT KEY",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BASEMENT MANAGEMENT",
        "rightPlaqueOverride": "CHIEF SUPERINTENDENT KEY"
      },
      {
        "sceneKind": "ran-dfir-esxi-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: LIVE PODS CLAMPING LOCKS ON THEIR",
        "boardSubtitle": "T1529 EXFIL & IMPACT -> FLIPPING EVERY POD BREAKER",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "LIVE PODS CLAMPING",
        "rightPlaqueOverride": "FLIPPING EVERY POD"
      },
      {
        "sceneKind": "ran-dfir-esxi-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: PORTABLE PADLOCKING PRESS IN A",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> VIRTUAL DISKS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PORTABLE PADLOCKING",
        "rightPlaqueOverride": "VIRTUAL DISKS"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "LOGGING INTO THE",
    "rightPlaque": "PULLING THE EMERGENCY"
  },
  {
    "scenarioId": "dfir-evtx-log-clearing-wevtutil-eid1102-104",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "broadcast-tower",
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
        "sceneKind": "ran-dfir-evtx-briefing",
        "mode": "overview-full",
        "boardTitle": "RIPPING OUT EVERY SINGLE PAGE FROM EVERY",
        "boardSubtitle": "T1070.001 DEFENSE EVASION -> DEFENSE EVASION -> DEFENSE",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "RIPPING OUT EVERY",
        "rightPlaqueOverride": "AUTOMATIC BRASS STAMPER"
      },
      {
        "sceneKind": "ran-dfir-evtx-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: AUTOMATED SWEEPER LISTING EVERY",
        "boardSubtitle": "T1070.001 DEFENSE EVASION -> COMMANDING THE EVENT",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "AUTOMATED SWEEPER",
        "rightPlaqueOverride": "COMMANDING THE EVENT"
      },
      {
        "sceneKind": "ran-dfir-evtx-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: EVENT CLERK EMPTYING THE BINDER",
        "boardSubtitle": "T1070.001 DEFENSE EVASION -> UNFORGEABLE PAGE ONE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "EVENT CLERK EMPTYING",
        "rightPlaqueOverride": "UNFORGEABLE PAGE ONE"
      },
      {
        "sceneKind": "ran-dfir-evtx-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: AUTOMATIC PAPER-MOVEMENT LEDGER",
        "boardSubtitle": "T1070.001 DEFENSE EVASION -> INTACT TORN LOG SCRAPS",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "AUTOMATIC PAPER-MOVEMENT",
        "rightPlaqueOverride": "INTACT TORN LOG SCRAPS"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "RIPPING OUT EVERY",
    "rightPlaque": "AUTOMATIC BRASS STAMPER"
  },
  {
    "scenarioId": "eightbase-phobos-smoke-loader-process-hacker",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16007006,
    "secondaryHex": 16436245,
    "leftProp": "pneumatic-tube",
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
        "sceneKind": "ran-eightbase-briefing",
        "mode": "overview-full",
        "boardTitle": "HIDDEN RELAY PIPE AND SIGNED TECHNICIAN",
        "boardSubtitle": "T1055 INITIAL ACCESS -> DEFENSE EVASION -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "HIDDEN RELAY PIPE AND",
        "rightPlaqueOverride": "CLIMBING PAST"
      },
      {
        "sceneKind": "ran-eightbase-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: COMPACT DELIVERY AGENT FROM A",
        "boardSubtitle": "T1055 INITIAL ACCESS -> QUIET RELAY PIPE BRIDGING",
        "accentHex": 16007006,
        "secondaryHex": 16436245,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "COMPACT DELIVERY AGENT",
        "rightPlaqueOverride": "QUIET RELAY PIPE"
      },
      {
        "sceneKind": "ran-eightbase-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PLANTING COPIES IN THE STARTUP",
        "boardSubtitle": "T1562.004 DEFENSE EVASION -> HOPPING PAST USER",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PLANTING COPIES IN THE",
        "rightPlaqueOverride": "HOPPING PAST USER"
      },
      {
        "sceneKind": "ran-eightbase-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SEALING SMALL DOCUMENTS WHOLE AND",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> STAMPING EVERY LOCKED ITEM",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SEALING SMALL DOCUMENTS",
        "rightPlaqueOverride": "STAMPING EVERY LOCKED"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "HIDDEN RELAY PIPE AND",
    "rightPlaque": "CLIMBING PAST"
  },
  {
    "scenarioId": "hermeticwiper-ukraine-easeus-mbr-wipe",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 16007006,
    "secondaryHex": 16096779,
    "leftProp": "kernel-courthouse",
    "rightProp": "broadcast-tower",
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
        "sceneKind": "ran-hermeticwiper-briefing",
        "mode": "overview-full",
        "boardTitle": "UNPACKING A VALIDLY SIGNED",
        "boardSubtitle": "T1068 DEFENSE EVASION -> DEFENSE EVASION -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UNPACKING A VALIDLY",
        "rightPlaqueOverride": "DISABLING BACKUPS AND"
      },
      {
        "sceneKind": "ran-hermeticwiper-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNLOCKING SPECIAL DRIVER-LOADING",
        "boardSubtitle": "T1068 DEFENSE EVASION -> PULLING AN AUTHENTIC",
        "accentHex": 16007006,
        "secondaryHex": 16096779,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UNLOCKING SPECIAL",
        "rightPlaqueOverride": "PULLING AN AUTHENTIC"
      },
      {
        "sceneKind": "ran-hermeticwiper-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PULLING POWER PLUGS ON THE BACKUP",
        "boardSubtitle": "T1490 DEFENSE EVASION -> SHATTERING THE FLOOR INDEX",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PULLING POWER PLUGS ON",
        "rightPlaqueOverride": "SHATTERING THE FLOOR"
      },
      {
        "sceneKind": "ran-hermeticwiper-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: WALKING FROM STORAGE BAY ZERO UP",
        "boardSubtitle": "T1561.002 EXFIL & IMPACT -> BLASTING OPENING",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "WALKING FROM STORAGE",
        "rightPlaqueOverride": "BLASTING OPENING"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "UNPACKING A VALIDLY",
    "rightPlaque": "DISABLING BACKUPS AND"
  },
  {
    "scenarioId": "hunters-international-hive-rust-wsus-sharpwmi",
    "floor": "conveyor-deck",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
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
        "sceneKind": "ran-hunters-intl-briefing",
        "mode": "overview-full",
        "boardTitle": "SENDING REMOTE ORDERS TO WIPE BACKUP",
        "boardSubtitle": "T1047 LATERAL & C2 -> EXFIL & IMPACT -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SENDING REMOTE ORDERS",
        "rightPlaqueOverride": "WHISPERING A DIRECT"
      },
      {
        "sceneKind": "ran-hunters-intl-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: HIJACKED SUPERVISOR DESK",
        "boardSubtitle": "T1047 LATERAL & C2 -> LIGHTWEIGHT REMOTE MANAGEMENT",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "HIJACKED SUPERVISOR DESK",
        "rightPlaqueOverride": "LIGHTWEIGHT REMOTE"
      },
      {
        "sceneKind": "ran-hunters-intl-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SKIPPING THE NOISY COMMAND LINE",
        "boardSubtitle": "T1490 EXFIL & IMPACT -> SPEAKING DIRECTLY THROUGH",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SKIPPING THE NOISY",
        "rightPlaqueOverride": "SPEAKING DIRECTLY"
      },
      {
        "sceneKind": "ran-hunters-intl-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: STREAMLINED RUST LOCKING PRESS",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> SCRUBBING BLANK SHELF SPACE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "STREAMLINED RUST",
        "rightPlaqueOverride": "SCRUBBING BLANK SHELF"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "SENDING REMOTE ORDERS",
    "rightPlaque": "WHISPERING A DIRECT"
  },
  {
    "scenarioId": "inc-ransom-lynx-citrix-netscaler-wmic-mega",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16007006,
    "secondaryHex": 3718648,
    "leftProp": "fortress-gate",
    "rightProp": "print-spooler",
    "centerMechanism": "padlock-wave",
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
        "sceneKind": "ran-inc-lynx-briefing",
        "mode": "overview-full",
        "boardTitle": "CRACKED FRONT-DOOR GATEWAY AND CLOUD",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> LATERAL & C2 -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CRACKED FRONT-DOOR",
        "rightPlaqueOverride": "COPYING A PADLOCKING"
      },
      {
        "sceneKind": "ran-inc-lynx-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNPATCHED EDGE ACCESS GATEWAY",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> SWIFT FLOOR SCANNER",
        "accentHex": 16007006,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UNPATCHED EDGE ACCESS",
        "rightPlaqueOverride": "SWIFT FLOOR SCANNER"
      },
      {
        "sceneKind": "ran-inc-lynx-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: NEAT ROSTER OF EVERY ROOM NUMBER",
        "boardSubtitle": "T1047 LATERAL & C2 -> COMPACT PADLOCKING CARTRIDGE",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "NEAT ROSTER OF EVERY",
        "rightPlaqueOverride": "COMPACT PADLOCKING"
      },
      {
        "sceneKind": "ran-inc-lynx-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: MODERN ELLIPTICAL-KEY PADLOCKS",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> STARK WARNING BANNER ACROSS",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MODERN ELLIPTICAL-KEY",
        "rightPlaqueOverride": "STARK WARNING BANNER"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "CRACKED FRONT-DOOR",
    "rightPlaque": "COPYING A PADLOCKING"
  },
  {
    "scenarioId": "medusa-ransomware-gaze-abyss-pdqdeploy",
    "floor": "conveyor-deck",
    "wallHex": 1973067,
    "accentHex": 16007006,
    "secondaryHex": 2282478,
    "leftProp": "kernel-courthouse",
    "rightProp": "factory-conveyor",
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
        "sceneKind": "ran-medusa-briefing",
        "mode": "overview-full",
        "boardTitle": "SLIPPING IN VIA REMOTE-SUPPORT CONSOLE AND",
        "boardSubtitle": "T1190 INITIAL ACCESS -> DEFENSE EVASION -> LATERAL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SLIPPING IN VIA",
        "rightPlaqueOverride": "SIGNED LAPTOP-COOLING"
      },
      {
        "sceneKind": "ran-medusa-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNPATCHED PERIMETER",
        "boardSubtitle": "T1190 INITIAL ACCESS -> OFF-THE-SHELF ROOM SCANNER",
        "accentHex": 16007006,
        "secondaryHex": 2282478,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "UNPATCHED PERIMETER",
        "rightPlaqueOverride": "OFF-THE-SHELF ROOM"
      },
      {
        "sceneKind": "ran-medusa-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SPECIALIZED GUARD-KILLER TOOL",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> LEGITIMATELY SIGNED",
        "accentHex": 16096779,
        "secondaryHex": 2282478,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SPECIALIZED",
        "rightPlaqueOverride": "LEGITIMATELY SIGNED"
      },
      {
        "sceneKind": "ran-medusa-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: IT DEPARTMENT OFFICIAL",
        "boardSubtitle": "T1072 LATERAL & C2 -> SHREDDING SHADOW BACKUPS",
        "accentHex": 2282478,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "IT DEPARTMENT OFFICIAL",
        "rightPlaqueOverride": "SHREDDING SHADOW"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "SLIPPING IN VIA",
    "rightPlaque": "SIGNED LAPTOP-COOLING"
  },
  {
    "scenarioId": "play-ransomware-grixba-vss-copy",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "robot-worker-bay",
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
        "sceneKind": "ran-play-grixba-briefing",
        "mode": "overview-full",
        "boardTitle": "CUSTOM MECHANICAL SCOUT TUCKED INSIDE A",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> EXFIL & IMPACT -> EXFIL",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CUSTOM MECHANICAL SCOUT",
        "rightPlaqueOverride": "CUSTOM INSTANT-CAMERA"
      },
      {
        "sceneKind": "ran-play-grixba-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: SELF-CONTAINED SCOUTING ROBOT IN",
        "boardSubtitle": "T1046 CREDENTIAL ACCESS -> FULL-SWEEP SCOUTING",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SELF-CONTAINED SCOUTING",
        "rightPlaqueOverride": "FULL-SWEEP SCOUTING"
      },
      {
        "sceneKind": "ran-play-grixba-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: PAIR OF SPECIALIZED SHADOW-CAMERA",
        "boardSubtitle": "T1006 EXFIL & IMPACT -> CLAMPED-SHUT CORPORATE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PAIR OF SPECIALIZED",
        "rightPlaqueOverride": "CLAMPED-SHUT CORPORATE"
      },
      {
        "sceneKind": "ran-play-grixba-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: MASTER POLICY BOARD BROADCASTING",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> WIPING SECURITY INSPECTION",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MASTER POLICY BOARD",
        "rightPlaqueOverride": "WIPING SECURITY"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "CUSTOM MECHANICAL SCOUT",
    "rightPlaque": "CUSTOM INSTANT-CAMERA"
  },
  {
    "scenarioId": "qilin-agenda-rust-chrome-cred-harvester-esxi",
    "floor": "split-dual",
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
      "coatHex": 1920728,
      "accentHex": 16436245,
      "hatType": "cap"
    },
    "sections": [
      {
        "sceneKind": "ran-qilin-esxi-briefing",
        "mode": "overview-full",
        "boardTitle": "PINNING A TINY MORNING-CHECKIN CHORE ONTO",
        "boardSubtitle": "T1555.003 CREDENTIAL ACCESS -> LATERAL & C2 -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PINNING A TINY",
        "rightPlaqueOverride": "UNLOCKING SHARED VAULTS"
      },
      {
        "sceneKind": "ran-qilin-esxi-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: HEADQUARTERS POLICY BOARD",
        "boardSubtitle": "T1555.003 CREDENTIAL ACCESS -> COVERT MORNING LOGIN",
        "accentHex": 16007006,
        "secondaryHex": 16436245,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "HEADQUARTERS POLICY",
        "rightPlaqueOverride": "COVERT MORNING LOGIN"
      },
      {
        "sceneKind": "ran-qilin-esxi-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FEEDING FRESHLY HARVESTED MASTER",
        "boardSubtitle": "T1021.002 LATERAL & C2 -> AUTOMATICALLY UNLOCKING",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FEEDING FRESHLY",
        "rightPlaqueOverride": "AUTOMATICALLY UNLOCKING"
      },
      {
        "sceneKind": "ran-qilin-esxi-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: TAILORED LOCKING GEARS CHOSEN PER",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> BASEMENT VIRTUAL SERVERS",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "TAILORED LOCKING GEARS",
        "rightPlaqueOverride": "BASEMENT VIRTUAL"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "PINNING A TINY",
    "rightPlaque": "UNLOCKING SHARED VAULTS"
  },
  {
    "scenarioId": "ransomhub-edrkiller-tdsskiller-golocks",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 16007006,
    "secondaryHex": 3718648,
    "leftProp": "kernel-courthouse",
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
        "sceneKind": "ran-ransomhub-briefing",
        "mode": "overview-full",
        "boardTitle": "AUTHENTIC CLEANUP UTILITY AND",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> DEFENSE EVASION -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "AUTHENTIC CLEANUP",
        "rightPlaqueOverride": "ASTERISK-MARKED NOTE"
      },
      {
        "sceneKind": "ran-ransomhub-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: AUTHENTIC SIGNED ROOTKIT-REMOVAL",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> SHAPE-SHIFTING",
        "accentHex": 16007006,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "AUTHENTIC SIGNED",
        "rightPlaqueOverride": "SHAPE-SHIFTING"
      },
      {
        "sceneKind": "ran-ransomhub-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SPECIAL ASTERISK-PREFIXED WORK",
        "boardSubtitle": "T1562.009 DEFENSE EVASION -> REBOOTING INTO",
        "accentHex": 16096779,
        "secondaryHex": 3718648,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SPECIAL ASTERISK-PREFIXE",
        "rightPlaqueOverride": "REBOOTING INTO"
      },
      {
        "sceneKind": "ran-ransomhub-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: REFUSING TO BUDGE WITHOUT A",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> TIGHTLY SEALED AGAINST",
        "accentHex": 3718648,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "REFUSING TO BUDGE",
        "rightPlaqueOverride": "TIGHTLY SEALED AGAINST"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "AUTHENTIC CLEANUP",
    "rightPlaque": "ASTERISK-MARKED NOTE"
  },
  {
    "scenarioId": "rhysida-ransomware-zerologon-ps-silentskill",
    "floor": "conveyor-deck",
    "wallHex": 1976635,
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
        "sceneKind": "ran-rhysida-briefing",
        "mode": "overview-full",
        "boardTitle": "HIDDEN BULKHEAD DOOR PUNCHING A HOLE",
        "boardSubtitle": "T1562.004 PERSISTENCE -> DEFENSE EVASION -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "HIDDEN BULKHEAD DOOR",
        "rightPlaqueOverride": "AUTOMATED SCRIPT"
      },
      {
        "sceneKind": "ran-rhysida-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: COMPACT CUSTOM COURIER ENGINE IN",
        "boardSubtitle": "T1562.004 PERSISTENCE -> COMMANDING THE FIREWALL",
        "accentHex": 16007006,
        "secondaryHex": 16096779,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "COMPACT CUSTOM COURIER",
        "rightPlaqueOverride": "COMMANDING THE FIREWALL"
      },
      {
        "sceneKind": "ran-rhysida-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: BLINDING THE SCRIPT-INSPECTION",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> SWITCHING OFF TWO",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "BLINDING THE",
        "rightPlaqueOverride": "SWITCHING OFF TWO"
      },
      {
        "sceneKind": "ran-rhysida-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PUSHING THE PADLOCKING PRESS DOWN",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> PARALLEL LOCKING GEARS",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PUSHING THE PADLOCKING",
        "rightPlaqueOverride": "PARALLEL LOCKING GEARS"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "HIDDEN BULKHEAD DOOR",
    "rightPlaque": "AUTOMATED SCRIPT"
  },
  {
    "scenarioId": "royal-blacksuit-ransomware-chacha20-restartmanager",
    "floor": "workshop-tile",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "hotel-desk",
    "rightProp": "hypervisor-vault",
    "centerMechanism": "padlock-wave",
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
        "sceneKind": "ran-royal-blacksuit-briefing",
        "mode": "overview-full",
        "boardTitle": "FAKE CANCELLATION HOTLINE TRICKING A WORKER",
        "boardSubtitle": "T1219 INITIAL ACCESS -> EXFIL & IMPACT -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FAKE CANCELLATION",
        "rightPlaqueOverride": "BUILDING GENTLE"
      },
      {
        "sceneKind": "ran-royal-blacksuit-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: ALARMING FAKE RENEWAL INVOICE",
        "boardSubtitle": "T1219 INITIAL ACCESS -> COMMERCIAL",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "ALARMING FAKE RENEWAL",
        "rightPlaqueOverride": "COMMERCIAL REMOTE-MANAGE"
      },
      {
        "sceneKind": "ran-royal-blacksuit-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: DESTROYING ALL BACKUP SNAPSHOTS",
        "boardSubtitle": "T1489 EXFIL & IMPACT -> BUILDING BUILT-IN",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "DESTROYING ALL BACKUP",
        "rightPlaqueOverride": "BUILDING BUILT-IN"
      },
      {
        "sceneKind": "ran-royal-blacksuit-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: TWICE AS MANY PARALLEL LOCKSMITH",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> EXACT OPERATOR-CHOSEN",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "TWICE AS MANY PARALLEL",
        "rightPlaqueOverride": "EXACT OPERATOR-CHOSEN"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "FAKE CANCELLATION",
    "rightPlaque": "BUILDING GENTLE"
  }
];

export function buildRansomwareExtortionScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
