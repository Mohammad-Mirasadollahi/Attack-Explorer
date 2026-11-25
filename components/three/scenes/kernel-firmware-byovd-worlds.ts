import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './anime-world-primitives';
import {
  buildSceneFromBlueprintCatalog,
  type ScenarioWorldBlueprint,
} from './scenario-world-composer';

const WORLD_BLUEPRINTS: readonly ScenarioWorldBlueprint[] = [
  {
    "scenarioId": "aukill-edr-killer-procxp152-byovd",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 16007006,
    "secondaryHex": 16436245,
    "leftProp": "kernel-courthouse",
    "rightProp": "fortress-gate",
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
        "sceneKind": "krn-aukill-briefing",
        "mode": "overview-full",
        "boardTitle": "OUTDATED, GENUINELY STAMPED INSPECTOR PASS",
        "boardSubtitle": "T1543.003 DEFENSE EVASION -> DEFENSE EVASION -> EXFIL &",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "OUTDATED, GENUINELY",
        "rightPlaqueOverride": "INSPECTOR SERVICE HATCH"
      },
      {
        "sceneKind": "krn-aukill-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: RETIRED LEGITIMATELY STAMPED PASS",
        "boardSubtitle": "T1543.003 DEFENSE EVASION -> OFFICIAL BUILDING",
        "accentHex": 16007006,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "RETIRED LEGITIMATELY",
        "rightPlaqueOverride": "OFFICIAL BUILDING"
      },
      {
        "sceneKind": "krn-aukill-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: INSPECTOR SERVICE HATCH",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> FIRST CONTROL KNOCK",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "INSPECTOR SERVICE HATCH",
        "rightPlaqueOverride": "FIRST CONTROL KNOCK"
      },
      {
        "sceneKind": "krn-aukill-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: ARMORED SECURITY MONITORS",
        "boardSubtitle": "T1486 EXFIL & IMPACT -> MASTER HANDLE KNOCK AND",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ARMORED SECURITY",
        "rightPlaqueOverride": "MASTER HANDLE KNOCK AND"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "OUTDATED, GENUINELY",
    "rightPlaque": "INSPECTOR SERVICE HATCH"
  },
  {
    "scenarioId": "blacklotus-uefi-bootkit-cve-2022-21894",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "motherboard-spi",
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
        "sceneKind": "krn-blacklotus-briefing",
        "mode": "overview-full",
        "boardTitle": "HIDDEN STARTUP CLOSET -> OLDER",
        "boardSubtitle": "T1542.003 PERSISTENCE -> DEFENSE EVASION -> DEFENSE",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "HIDDEN STARTUP CLOSET",
        "rightPlaqueOverride": "OLDER, STILL-STAMPED"
      },
      {
        "sceneKind": "krn-blacklotus-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: HIDDEN DAWN-STARTUP CLOSET",
        "boardSubtitle": "T1542.003 PERSISTENCE -> OLDER OFFICIALLY STAMPED",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "HIDDEN DAWN-STARTUP",
        "rightPlaqueOverride": "OLDER OFFICIALLY"
      },
      {
        "sceneKind": "krn-blacklotus-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: OLDER STAMPED CLERK STARTING AT",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> SPECIALLY FOLDED",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "OLDER STAMPED CLERK",
        "rightPlaqueOverride": "SPECIALLY FOLDED"
      },
      {
        "sceneKind": "krn-blacklotus-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: ERASING GLASS INTEGRITY SHIELDS",
        "boardSubtitle": "T1068 DEFENSE EVASION -> DISABLED VAULT LOCKS AND",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ERASING GLASS INTEGRITY",
        "rightPlaqueOverride": "DISABLED VAULT LOCKS"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "HIDDEN STARTUP CLOSET",
    "rightPlaque": "OLDER, STILL-STAMPED"
  },
  {
    "scenarioId": "crowdstrike-poortry-burntcigar-byovd",
    "floor": "two-level-cutaway",
    "wallHex": 1973067,
    "accentHex": 16007006,
    "secondaryHex": 16096779,
    "leftProp": "notary-press",
    "rightProp": "kernel-courthouse",
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
        "sceneKind": "krn-poortry-briefing",
        "mode": "overview-full",
        "boardTitle": "CUSTOM SABOTEUR CARD STAMPED BY A HIJACKED",
        "boardSubtitle": "T1553.002 DEFENSE EVASION -> DEFENSE EVASION",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "CUSTOM SABOTEUR CARD",
        "rightPlaqueOverride": "SECRET SPOKEN HANDSHAKE"
      },
      {
        "sceneKind": "krn-poortry-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: INTRUDER STREET RUNNER",
        "boardSubtitle": "T1553.002 DEFENSE EVASION -> PURPOSE-BUILT SABOTEUR",
        "accentHex": 16007006,
        "secondaryHex": 16096779,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "INTRUDER STREET RUNNER",
        "rightPlaqueOverride": "PURPOSE-BUILT SABOTEUR"
      },
      {
        "sceneKind": "krn-poortry-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: SECRET CODED KNOCK-AND-REPLY",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> CENTRAL NOTIFICATION",
        "accentHex": 16096779,
        "secondaryHex": 16096779,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SECRET CODED",
        "rightPlaqueOverride": "CENTRAL NOTIFICATION"
      },
      {
        "sceneKind": "krn-poortry-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: CENTRAL STAFF LEDGER",
        "boardSubtitle": "T1003.001 CREDENTIAL ACCESS -> RUBBING OUT THE",
        "accentHex": 16096779,
        "secondaryHex": 1096065,
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "CENTRAL STAFF LEDGER",
        "rightPlaqueOverride": "RUBBING OUT THE"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "CUSTOM SABOTEUR CARD",
    "rightPlaque": "SECRET SPOKEN HANDSHAKE"
  },
  {
    "scenarioId": "dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 1096065,
    "secondaryHex": 16007006,
    "leftProp": "kernel-courthouse",
    "rightProp": "telecom-bridge",
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
        "sceneKind": "krn-dfir-bpfdoor-briefing",
        "mode": "overview-full",
        "boardTitle": "TEMPORARY MEMORY-ONLY CLOSET WITH A",
        "boardSubtitle": "T1036.004 DEFENSE EVASION -> LATERAL & C2 -> CREDENTIAL",
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "TEMPORARY MEMORY-ONLY",
        "rightPlaqueOverride": "INVISIBLE WIRE SIEVE"
      },
      {
        "sceneKind": "krn-dfir-bpfdoor-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: MEMORY-ONLY STORAGE CLOSET",
        "boardSubtitle": "T1036.004 DEFENSE EVASION -> TEARING UP THE CLOSET",
        "accentHex": 1096065,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MEMORY-ONLY STORAGE",
        "rightPlaqueOverride": "TEARING UP THE CLOSET"
      },
      {
        "sceneKind": "krn-dfir-bpfdoor-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: NUMBERED TICKET WINDOW CHECKED BY",
        "boardSubtitle": "T1205.002 LATERAL & C2 -> MAIN TELEGRAPH LINE CLAMP",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "NUMBERED TICKET WINDOW",
        "rightPlaqueOverride": "MAIN TELEGRAPH LINE"
      },
      {
        "sceneKind": "krn-dfir-bpfdoor-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: DEPOT MASTER CABLE-CLAMP REGISTRY",
        "boardSubtitle": "T1205.002 CREDENTIAL ACCESS -> EXPOSING THE HIDDEN",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "DEPOT MASTER",
        "rightPlaqueOverride": "EXPOSING THE HIDDEN"
      }
    ],
    "storyPlot": "checkpoint-impersonation",
    "leftPlaque": "TEMPORARY MEMORY-ONLY",
    "rightPlaque": "INVISIBLE WIRE SIEVE"
  },
  {
    "scenarioId": "dfir-linux-ld-so-preload-userland-rootkit-proc-maps",
    "floor": "workshop-tile",
    "wallHex": 1976635,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "library-toggle",
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
        "sceneKind": "krn-dfir-ldpreload-briefing",
        "mode": "overview-full",
        "boardTitle": "UNIVERSAL WORK COAT HANGING ON THE ENTRANCE",
        "boardSubtitle": "T1574.006 PERSISTENCE -> DEFENSE EVASION -> CREDENTIAL",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "UNIVERSAL WORK COAT",
        "rightPlaqueOverride": "RIGGED LINING SEWN INTO"
      },
      {
        "sceneKind": "krn-dfir-ldpreload-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: CUSTOM RIGGED COAT LINING ON THE",
        "boardSubtitle": "T1574.006 PERSISTENCE -> MANDATORY ENTRANCE-RACK",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "CUSTOM RIGGED COAT",
        "rightPlaqueOverride": "MANDATORY ENTRANCE-RACK"
      },
      {
        "sceneKind": "krn-dfir-ldpreload-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ENTRANCE DRESSER HANDING OUT THE",
        "boardSubtitle": "T1014 DEFENSE EVASION -> INTERCEPTING EVERY GLANCE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "ENTRANCE DRESSER",
        "rightPlaqueOverride": "INTERCEPTING EVERY"
      },
      {
        "sceneKind": "krn-dfir-ldpreload-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: SELF-CONTAINED OUTSIDE GEAR",
        "boardSubtitle": "T1574.006 CREDENTIAL ACCESS -> RAW HALLWAY MAP",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "SELF-CONTAINED OUTSIDE",
        "rightPlaqueOverride": "RAW HALLWAY MAP INSIDE"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "UNIVERSAL WORK COAT",
    "rightPlaque": "RIGGED LINING SEWN INTO"
  },
  {
    "scenarioId": "dfir-volatility3-malfind-vad-hollowing-kernel-callbacks",
    "floor": "split-dual",
    "wallHex": 988970,
    "accentHex": 3718648,
    "secondaryHex": 16436245,
    "leftProp": "memory-xray-chamber",
    "rightProp": "kernel-courthouse",
    "centerMechanism": "scanner",
    "leftActor": {
      "coatHex": 3359061,
      "accentHex": 1096065,
      "hatType": "cap"
    },
    "rightActor": {
      "coatHex": 1920728,
      "accentHex": 16436245,
      "hatType": "cap"
    },
    "sections": [
      {
        "sceneKind": "krn-dfir-vol3-briefing",
        "mode": "overview-full",
        "boardTitle": "FREEZING THE COURTHOUSE IN MID-MOTION",
        "boardSubtitle": "T1055 DEFENSE EVASION -> DEFENSE EVASION -> DEFENSE",
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "FREEZING THE COURTHOUSE",
        "rightPlaqueOverride": "ARMED STRANGERS IN"
      },
      {
        "sceneKind": "krn-dfir-vol3-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: ROOM-ASSIGNMENT TREES",
        "boardSubtitle": "T1055 DEFENSE EVASION -> TRUSTED CLERK OFFICE",
        "accentHex": 3718648,
        "secondaryHex": 16436245,
        "storyPlotOverride": "mirror-proxy-bounce",
        "leftPlaqueOverride": "ROOM-ASSIGNMENT TREES",
        "rightPlaqueOverride": "TRUSTED CLERK OFFICE"
      },
      {
        "sceneKind": "krn-dfir-vol3-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: OFFICIAL FRONT-DESK EMPLOYEE CHAIN",
        "boardSubtitle": "T1014 DEFENSE EVASION -> ERASING ITS OWN LINK FROM",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "OFFICIAL FRONT-DESK",
        "rightPlaqueOverride": "ERASING ITS OWN LINK"
      },
      {
        "sceneKind": "krn-dfir-vol3-step-3",
        "mode": "forensic-sweep",
        "boardTitle": "ACT 03: COURTHOUSE MASTER BELL-PULL BOARD",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> TRACING EVERY WIRE",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "COURTHOUSE MASTER",
        "rightPlaqueOverride": "TRACING EVERY WIRE BACK"
      }
    ],
    "storyPlot": "mirror-proxy-bounce",
    "leftPlaque": "FREEZING THE COURTHOUSE",
    "rightPlaque": "ARMED STRANGERS IN"
  },
  {
    "scenarioId": "genshin-mhyprot2-ransomware-byovd",
    "floor": "two-level-cutaway",
    "wallHex": 1973067,
    "accentHex": 11032055,
    "secondaryHex": 16007006,
    "leftProp": "kernel-courthouse",
    "rightProp": "hypervisor-vault",
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
        "sceneKind": "krn-mhyprot2-briefing",
        "mode": "overview-full",
        "boardTitle": "OFFICIALLY STAMPED GUARD BADGE FROM A",
        "boardSubtitle": "T1068 DEFENSE EVASION -> DEFENSE EVASION -> DEFENSE",
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "OFFICIALLY STAMPED",
        "rightPlaqueOverride": "BANK HEADQUARTERS"
      },
      {
        "sceneKind": "krn-mhyprot2-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: AUTHENTIC ARCADE ANTI-CHEAT GUARD",
        "boardSubtitle": "T1068 DEFENSE EVASION -> PUBLIC HALLWAY TABLE",
        "accentHex": 11032055,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "AUTHENTIC ARCADE",
        "rightPlaqueOverride": "PUBLIC HALLWAY TABLE"
      },
      {
        "sceneKind": "krn-mhyprot2-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: ARCADE DRIVER BACK WINDOW",
        "boardSubtitle": "T1027 DEFENSE EVASION -> 24-BYTE STARTING CIPHER",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "ARCADE DRIVER BACK",
        "rightPlaqueOverride": "24-BYTE STARTING CIPHER"
      },
      {
        "sceneKind": "krn-mhyprot2-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: SCRAMBLED GUARD BADGE NUMBERS",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> BUILDING CORE EVICTING",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "SCRAMBLED GUARD BADGE",
        "rightPlaqueOverride": "BUILDING CORE EVICTING"
      }
    ],
    "storyPlot": "chain-reaction-lock",
    "leftPlaque": "OFFICIALLY STAMPED",
    "rightPlaque": "BANK HEADQUARTERS"
  },
  {
    "scenarioId": "intezer-blackberry-symbiote-linux-ldpreload",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 11032055,
    "secondaryHex": 2282478,
    "leftProp": "library-toggle",
    "rightProp": "kernel-courthouse",
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
        "sceneKind": "krn-symbiote-briefing",
        "mode": "overview-full",
        "boardTitle": "MASTER UNIFORM COATROOM -> PARASITIC MIST",
        "boardSubtitle": "T1574.006 PERSISTENCE -> CREDENTIAL ACCESS -> DEFENSE",
        "storyPlotOverride": "vault-heist-cutaway",
        "leftPlaqueOverride": "MASTER UNIFORM COATROOM",
        "rightPlaqueOverride": "PARASITIC MIST WOVEN"
      },
      {
        "sceneKind": "krn-symbiote-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: UNIVERSAL UNIFORM RACK",
        "boardSubtitle": "T1574.006 PERSISTENCE -> RIGGED LINING HUNG ON THE",
        "accentHex": 11032055,
        "secondaryHex": 2282478,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "UNIVERSAL UNIFORM RACK",
        "rightPlaqueOverride": "RIGGED LINING HUNG ON"
      },
      {
        "sceneKind": "krn-symbiote-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: COURIERS TYPING VAULT COMBINATIONS",
        "boardSubtitle": "T1556.003 CREDENTIAL ACCESS -> LOCKED NOTEBOOK",
        "accentHex": 16096779,
        "secondaryHex": 2282478,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "COURIERS TYPING VAULT",
        "rightPlaqueOverride": "LOCKED NOTEBOOK STORING"
      },
      {
        "sceneKind": "krn-symbiote-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: INSPECTORS WATCHING OUTGOING MAIL",
        "boardSubtitle": "T1014 DEFENSE EVASION -> SWAPPING IN TINTED LENSES",
        "accentHex": 2282478,
        "secondaryHex": 1096065,
        "storyPlotOverride": "freeze-and-swap",
        "leftPlaqueOverride": "INSPECTORS WATCHING",
        "rightPlaqueOverride": "SWAPPING IN TINTED"
      }
    ],
    "storyPlot": "vault-heist-cutaway",
    "leftPlaque": "MASTER UNIFORM COATROOM",
    "rightPlaque": "PARASITIC MIST WOVEN"
  },
  {
    "scenarioId": "kaspersky-cosmicstrand-uefi-spi-rootkit",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 16096779,
    "secondaryHex": 16007006,
    "leftProp": "motherboard-spi",
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
        "sceneKind": "krn-cosmicstrand-briefing",
        "mode": "overview-full",
        "boardTitle": "STONE FOUNDATION CHIP BENEATH THE BUILDING",
        "boardSubtitle": "T1542.001 PERSISTENCE -> DEFENSE EVASION -> LATERAL & C2",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "STONE FOUNDATION CHIP",
        "rightPlaqueOverride": "CARVED MECHANICAL"
      },
      {
        "sceneKind": "krn-cosmicstrand-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: PERMANENT STONE FOUNDATION BLOCK",
        "boardSubtitle": "T1542.001 PERSISTENCE -> CHISELED SECRET TRIGGER",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "PERMANENT STONE",
        "rightPlaqueOverride": "CHISELED SECRET TRIGGER"
      },
      {
        "sceneKind": "krn-cosmicstrand-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: FRONT-GATE OPENER CAUGHT AT THE",
        "boardSubtitle": "T1542.003 DEFENSE EVASION -> FLOOR-CAPTAIN LOADER",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "FRONT-GATE OPENER",
        "rightPlaqueOverride": "FLOOR-CAPTAIN LOADER"
      },
      {
        "sceneKind": "krn-cosmicstrand-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: UNHOOKING THE MASTER WATCHDOG BELL",
        "boardSubtitle": "T1014 LATERAL & C2 -> SECRET LISTENER ON THE",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "UNHOOKING THE MASTER",
        "rightPlaqueOverride": "SECRET LISTENER ON THE"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "STONE FOUNDATION CHIP",
    "rightPlaque": "CARVED MECHANICAL"
  },
  {
    "scenarioId": "linux-bpfdoor-ebpf-socket-filter-apt",
    "floor": "two-level-cutaway",
    "wallHex": 988970,
    "accentHex": 2282478,
    "secondaryHex": 16007006,
    "leftProp": "kernel-courthouse",
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
        "sceneKind": "krn-bpfdoor-apt-briefing",
        "mode": "overview-full",
        "boardTitle": "TEMPORARY HALLWAY LOCKER WITH A BURNED",
        "boardSubtitle": "T1036.004 DEFENSE EVASION -> PERSISTENCE -> LATERAL & C2",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "TEMPORARY HALLWAY",
        "rightPlaqueOverride": "MAINTENANCE JANITOR"
      },
      {
        "sceneKind": "krn-bpfdoor-apt-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: MEMORY-ONLY HALLWAY LOCKER",
        "boardSubtitle": "T1036.004 DEFENSE EVASION -> BACKDATING THE LOCKER",
        "accentHex": 2282478,
        "secondaryHex": 16007006,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "MEMORY-ONLY HALLWAY",
        "rightPlaqueOverride": "BACKDATING THE LOCKER"
      },
      {
        "sceneKind": "krn-bpfdoor-apt-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: VISIBLE SERVICE WINDOW CHECKED BY",
        "boardSubtitle": "T1205.002 PERSISTENCE -> MAIN INCOMING MAIL CHUTE",
        "accentHex": 16096779,
        "secondaryHex": 16007006,
        "storyPlotOverride": "elevation-tower",
        "leftPlaqueOverride": "VISIBLE SERVICE WINDOW",
        "rightPlaqueOverride": "MAIN INCOMING MAIL CHUTE"
      },
      {
        "sceneKind": "krn-bpfdoor-apt-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PASSING LETTER WITH SECRET WAX",
        "boardSubtitle": "T1205.001 LATERAL & C2 -> SWINGING A WALL PANEL",
        "accentHex": 16007006,
        "secondaryHex": 1096065,
        "storyPlotOverride": "twin-xray-forensics",
        "leftPlaqueOverride": "PASSING LETTER WITH",
        "rightPlaqueOverride": "SWINGING A WALL PANEL"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "TEMPORARY HALLWAY",
    "rightPlaque": "MAINTENANCE JANITOR"
  },
  {
    "scenarioId": "sentinelone-terminator-zemana-byovd",
    "floor": "two-level-cutaway",
    "wallHex": 1976635,
    "accentHex": 16007006,
    "secondaryHex": 16436245,
    "leftProp": "oauth-kiosk",
    "rightProp": "kernel-courthouse",
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
        "sceneKind": "krn-terminator-briefing",
        "mode": "overview-full",
        "boardTitle": "GENUINELY STAMPED SECURITY-VENDOR MASTER",
        "boardSubtitle": "T1068 DEFENSE EVASION -> DEFENSE EVASION -> DEFENSE",
        "storyPlotOverride": "supply-conveyor-tamper",
        "leftPlaqueOverride": "GENUINELY STAMPED",
        "rightPlaqueOverride": "UNGUARDED BADGE-ENROLLME"
      },
      {
        "sceneKind": "krn-terminator-step-1",
        "mode": "left-breach-focus",
        "boardTitle": "ACT 01: GENUINELY SIGNED THIRD-PARTY",
        "boardSubtitle": "T1068 DEFENSE EVASION -> RANDOM COVER NAME ON THE",
        "accentHex": 16007006,
        "secondaryHex": 16436245,
        "storyPlotOverride": "chain-reaction-lock",
        "leftPlaqueOverride": "GENUINELY SIGNED",
        "rightPlaqueOverride": "RANDOM COVER NAME ON"
      },
      {
        "sceneKind": "krn-terminator-step-2",
        "mode": "center-mechanism-focus",
        "boardTitle": "ACT 02: VIP SECURITY ROSTER",
        "boardSubtitle": "T1068 DEFENSE EVASION -> ENROLLMENT WINDOW THAT",
        "accentHex": 16096779,
        "secondaryHex": 16436245,
        "storyPlotOverride": "checkpoint-impersonation",
        "leftPlaqueOverride": "VIP SECURITY ROSTER",
        "rightPlaqueOverride": "ENROLLMENT WINDOW THAT"
      },
      {
        "sceneKind": "krn-terminator-step-3",
        "mode": "right-impact-focus",
        "boardTitle": "ACT 03: PACING THE HALLWAYS IN A",
        "boardSubtitle": "T1562.001 DEFENSE EVASION -> POCKET HIT-LIST OF 24",
        "accentHex": 16436245,
        "secondaryHex": 1096065,
        "storyPlotOverride": "broadcast-beacon",
        "leftPlaqueOverride": "PACING THE HALLWAYS IN",
        "rightPlaqueOverride": "POCKET HIT-LIST OF 24"
      }
    ],
    "storyPlot": "supply-conveyor-tamper",
    "leftPlaque": "GENUINELY STAMPED",
    "rightPlaque": "UNGUARDED BADGE-ENROLLME"
  }
];

export function buildKernelFirmwareByovdScene(
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  return buildSceneFromBlueprintCatalog(WORLD_BLUEPRINTS, sceneKind, materials);
}
