import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for DATABASE_DATA_PLATFORMS (5 scenarios).
 */
export const DATABASE_PLATFORMS_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "db-mongodb-mongobleed-unauthenticated-replication-oplog-audit": {
    "briefing": {
      "scenarioId": "db-mongodb-mongobleed-unauthenticated-replication-oplog-audit",
      "sectionKey": "briefing",
      "sceneKind": "db-mongobleed-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1046",
      "title": "Exposed MongoDB Wire Protocol Port 27017 & local.oplog.rs Audit Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine an unmanned document warehouse left with its main roll-up door propped wide open toward the street and the badge scanner unplugged. A passing scavenger strolls inside to list every shelf, flips straight to the rolling carbon-copy journal that records even recently shredded secret passes, drains every customer binder into a van, leaves a single extortion flyer on an empty shelf, and burns the original binders behind them.",
      "technicalCue": "CREDENTIAL ACCESS: Unauthenticated OP_MSG Handshake (isMaster / hello) & listDatabases Enumeration -> CREDENTIAL ACCESS: Replication Oplog (local.oplog.rs) Inspection for Historical Credentials & Tokens -> EXFIL & IMPACT: Bulk Collection Cursor Exhaustion (getMore) & Destructive dropDatabase Audit",
      "storyMappings": [
        {
          "storyTerm": "Roll-Up Door Propped Open",
          "technicalTerm": "mongod Bound to 0.0.0.0:27017 with security.authorization Disabled",
          "tone": "amber"
        },
        {
          "storyTerm": "Strolling In to List Shelves",
          "technicalTerm": "Unauthenticated OP_MSG (Opcode 2013) hello & listDatabases Commands",
          "tone": "sky"
        },
        {
          "storyTerm": "Rolling Carbon-Copy Journal",
          "technicalTerm": "Replication Oplog (local.oplog.rs) Retaining Deleted Tokens & Keys",
          "tone": "rose"
        },
        {
          "storyTerm": "Extortion Flyer & Burned Binders",
          "technicalTerm": "Rapid getMore Cursor Dump, WARNING Ransom Note & dropDatabase",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "db-mongobleed-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Roll-Up Door Propped Open",
          "subtitle": "mongod Bound to 0.0.0.0:27017 with security.authorization…",
          "tone": "amber"
        },
        {
          "id": "db-mongobleed-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Strolling In to List Shelves",
          "subtitle": "Unauthenticated OP_MSG (Opcode 2013) hello & listDatabases…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wide-open Door",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Unauthenticated OP_MSG Handshake (isMaster / hello) & listDatabases Enumeration",
          "storyExcerpt": "Spotting the wide-open warehouse door facing the public street with no guard desk turned on, the scavenger steps in, greets the automated catalog kiosk, and prints out the complete list of every document…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.id==20426 or .attr.command.listDatabases==1)' /var/log/mongodb/mongod.log (which executes the technical command / telemetry directive , jq '. |…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Sync",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "Replication Oplog (local.oplog.rs) Inspection for Historical Credentials & Tokens",
          "storyExcerpt": "Not content with the active filing cabinets alone, the scavenger heads straight to the warehouse’s rolling carbon-copy sync journal, which keeps a play-by-play transcript of every addition, edit, and…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.attr.ns==\"local.oplog.rs\")' /var/log/mongodb/mongod.log (which executes the technical command / telemetry directive , jq '. |…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. High-speed",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Bulk Collection Cursor Exhaustion (getMore) & Destructive dropDatabase Audit",
          "storyExcerpt": "In the final automated sweep, the scavenger runs a high-speed conveyor to empty every customer cabinet in rapid batches, drops a single ransom demand leaflet into a newly labeled warning box, and…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.atype==\"dropDatabase\" or .atype==\"dropCollection\")' /var/log/mongodb/auditLog.json (which executes the technical command / telemetry directive…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Open Door",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Burned Binders",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Oplog Sweep",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "db-mongodb-mongobleed-unauthenticated-replication-oplog-audit",
      "sectionKey": "step-1",
      "sceneKind": "db-mongobleed-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Unauthenticated OP_MSG Handshake (isMaster / hello) & listDatabases Enumeration",
      "storyCue": "Spotting the wide-open warehouse door facing the public street with no guard desk turned on, the scavenger steps in, greets the automated catalog kiosk, and prints out the complete list of every document vault and its storage size.",
      "technicalCue": "T1046 · CREDENTIAL ACCESS — When a MongoDB daemon (mongod) is started with net.bindIp: 0.0.0.0 and security.authorization: disabled, an external client connects to TCP port 27017 and sends OP_MSG (opcode 2013) hello and…",
      "storyMappings": [
        {
          "storyTerm": "Wide-Open Street Door",
          "technicalTerm": "MongoDB net.bindIp: 0.0.0.0 on TCP Port 27017 Without Auth",
          "tone": "amber"
        },
        {
          "storyTerm": "Automated Catalog Kiosk",
          "technicalTerm": "OP_MSG (Opcode 2013) isMaster / hello & listDatabases Protocol",
          "tone": "sky"
        },
        {
          "storyTerm": "Complete Vault Size List",
          "technicalTerm": "Returned Catalog of All Production Database Names & Byte Counts",
          "tone": "rose"
        },
        {
          "storyTerm": "Warehouse Entry Lock",
          "technicalTerm": "Enabling security.authorization: enabled & Private Subnet Binding",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-mongobleed-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Wide-Open Street Door",
          "subtitle": "MongoDB net.bindIp: 0.0.0.0 on TCP Port 27017 Without Auth",
          "tone": "amber"
        },
        {
          "id": "db-mongobleed-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Automated Catalog Kiosk",
          "subtitle": "OP_MSG (Opcode 2013) isMaster / hello & listDatabases Protocol",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wide-open Door",
          "stageTag": "STEP 01 · SETUP",
          "title": "Wide-Open Street Door",
          "storyExcerpt": "Spotting the wide-open warehouse door facing the public street with no guard desk turned on, the scavenger steps in, greets the automated catalog kiosk, and prints out the complete list of…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.id==20426 or .attr.command.listDatabases==1)' /var/log/mongodb/mongod.log (which executes the technical command / telemetry directive , jq '. |…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Size",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Automated Catalog Kiosk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses automated catalog kiosk to advance toward complete vault size list.",
          "technicalParallel": "When a MongoDB daemon (mongod) is started with net.bindIp: 0.0.0.0 and security.authorization: disabled, an external client connects to TCP port 27017 and sends OP_MSG (opcode 2013) hello and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Size List",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Warehouse Entry Lock",
          "storyExcerpt": "Behind the scenes, warehouse entry lock captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 51800 (recording WireProtocolOpcode=OP_MSG , 2013, hello & listDatabases: 1, ClientDriverMetadata=PyMongo 4.6.1 from 198.51.100.73:52190, ConfigVulnerability=net.bindIp…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Open Door",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Burned Binders",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Oplog Sweep",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1046"
    },
    "step-2": {
      "scenarioId": "db-mongodb-mongobleed-unauthenticated-replication-oplog-audit",
      "sectionKey": "step-2",
      "sceneKind": "db-mongobleed-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Replication Oplog (local.oplog.rs) Inspection for Historical Credentials & Tokens",
      "storyCue": "Not content with the active filing cabinets alone, the scavenger heads straight to the warehouse’s rolling carbon-copy sync journal, which keeps a play-by-play transcript of every addition, edit, and deletion so recently revoked access keys and temporary passes can still be pulled right off the tape.",
      "technicalCue": "T1552 · CREDENTIAL ACCESS — Beyond active collections, the client queries the MongoDB replication operation log (local.oplog.rs), which stores a rolling history of every insert, update, and delete operation across the…",
      "storyMappings": [
        {
          "storyTerm": "Rolling Carbon-Copy Sync Journal",
          "technicalTerm": "MongoDB Replica Set Operation Log (local.oplog.rs Collection)",
          "tone": "sky"
        },
        {
          "storyTerm": "Play-by-Play Transcript",
          "technicalTerm": "Historical Record of Every Insert, Update & Delete Operation",
          "tone": "amber"
        },
        {
          "storyTerm": "Pulling Revoked Passes Off Tape",
          "technicalTerm": "Recovering Recently Deleted API Keys & Session JWTs via find()",
          "tone": "rose"
        },
        {
          "storyTerm": "Journal Access Audit",
          "technicalTerm": "MongoDB Audit Log Capturing Unauthorized Reads of local.oplog.rs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-mongobleed-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Rolling Carbon-Copy Sync Journal",
          "subtitle": "MongoDB Replica Set Operation Log (local.oplog.rs Collection)",
          "tone": "sky"
        },
        {
          "id": "db-mongobleed-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Play-by-Play Transcript",
          "subtitle": "Historical Record of Every Insert, Update & Delete Operation",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Sync",
          "stageTag": "STEP 02 · SETUP",
          "title": "Rolling Carbon-Copy Sync Journal",
          "storyExcerpt": "Not content with the active filing cabinets alone, the scavenger heads straight to the warehouse’s rolling carbon-copy sync journal, which keeps a play-by-play transcript of every addition…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.attr.ns==\"local.oplog.rs\")' /var/log/mongodb/mongod.log (which executes the technical command / telemetry directive , jq '. |…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Play-by-play",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Play-by-Play Transcript",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses play-by-play transcript to advance toward pulling revoked passes off tape.",
          "technicalParallel": "Beyond active collections, the client queries the MongoDB replication operation log (local.oplog.rs), which stores a rolling history of every insert, update, and delete operation across the replica set…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Off Tape",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Journal Access Audit",
          "storyExcerpt": "Behind the scenes, journal access audit captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 20429 (recording TargetNamespace=local.oplog.rs , Replica Set Rolling Operation Log, QueryFilter=find { \"ns\": /users|sessions|tokens/, \"op\": { \"$in\": [\"i\", \"u\", \"d\"] } }…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Open Door",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Burned Binders",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Oplog Sweep",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552"
    },
    "step-3": {
      "scenarioId": "db-mongodb-mongobleed-unauthenticated-replication-oplog-audit",
      "sectionKey": "step-3",
      "sceneKind": "db-mongobleed-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Bulk Collection Cursor Exhaustion (getMore) & Destructive dropDatabase Audit",
      "storyCue": "In the final automated sweep, the scavenger runs a high-speed conveyor to empty every customer cabinet in rapid batches, drops a single ransom demand leaflet into a newly labeled warning box, and triggers the incinerator to erase the original cabinets.",
      "technicalCue": "T1485 · EXFIL & IMPACT — In automated MongoDB extortion campaigns (Mongobleed / Kraken0), the script streams production collections via rapid getMore cursor batches, inserts a single ransom note document into a new…",
      "storyMappings": [
        {
          "storyTerm": "High-Speed Conveyor Sweep",
          "technicalTerm": "Rapid getMore Cursor Batches Draining Production Collections",
          "tone": "amber"
        },
        {
          "storyTerm": "Ransom Demand Warning Box",
          "technicalTerm": "Inserted Extortion Document Inside Newly Created WARNING Collection",
          "tone": "rose"
        },
        {
          "storyTerm": "Triggering the Incinerator",
          "technicalTerm": "Destructive dropDatabase Command (Audit Action atype: dropDatabase)",
          "tone": "sky"
        },
        {
          "storyTerm": "Forensic Recovery Proof",
          "technicalTerm": "MongoDB Audit Telemetry & Immutable Offsite Snapshot Recovery",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-mongobleed-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "High-Speed Conveyor Sweep",
          "subtitle": "Rapid getMore Cursor Batches Draining Production Collections",
          "tone": "amber"
        },
        {
          "id": "db-mongobleed-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Ransom Demand Warning Box",
          "subtitle": "Inserted Extortion Document Inside Newly Created WARNING…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. High-speed",
          "stageTag": "STEP 03 · SETUP",
          "title": "High-Speed Conveyor Sweep",
          "storyExcerpt": "In the final automated sweep, the scavenger runs a high-speed conveyor to empty every customer cabinet in rapid batches, drops a single ransom demand leaflet into a newly labeled warning box…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.atype==\"dropDatabase\" or .atype==\"dropCollection\")' /var/log/mongodb/auditLog.json (which executes the technical command / telemetry directive…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Box",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Ransom Demand Warning Box",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses ransom demand warning box to advance toward triggering the incinerator.",
          "technicalParallel": "In automated MongoDB extortion campaigns (Mongobleed / Kraken0), the script streams production collections via rapid getMore cursor batches, inserts a single ransom note document into a new WARNING…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Runs High-speed",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Forensic Recovery Proof",
          "storyExcerpt": "Behind the scenes, forensic recovery proof captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 20435 (recording AuditActionType=atype: dropDatabase on namespace prod_crm, PrecedingActivity=High-volume getMore cursor reads + insert into READ_ME_TO_RECOVER.note…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Open Door",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Burned Binders",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Oplog Sweep",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1485"
    }
  },
  "db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics": {
    "briefing": {
      "scenarioId": "db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics",
      "sectionKey": "briefing",
      "sceneKind": "db-mssql-linked-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1021",
      "title": "MSSQL Linked Server RPC, xp_cmdshell & Unsafe CLR Assembly Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a chain of corporate record rooms connected by internal brass pneumatic tubes that automatically stamp every parcel with chief-archivist clearance at the far end. An intruder inspects the directory to spot which pneumatic tubes carry top clearance, flips two restricted control switches on the remote room’s wall, the first switch unlocks the direct maintenance hatch for shell commands and the second switch enables custom mechanical extensions, and loads a custom mechanical helper directly into the record ledger without ever leaving a physical tool box on the floor.",
      "technicalCue": "LATERAL & C2: MSSQL Linked Server Enumeration (sys.servers) & RPC Trust Pivot -> DEFENSE EVASION: Configuration Change Enabling xp_cmdshell & clr strict security (Application EventID 15457) -> PERSISTENCE: In-Memory Hexadecimal CLR Assembly Registration (CREATE ASSEMBLY ... PERMISSION_SET = UNSAFE)",
      "storyMappings": [
        {
          "storyTerm": "Internal Brass Pneumatic Tubes",
          "technicalTerm": "MSSQL Linked Servers Configured with is_rpc_out_enabled = 1",
          "tone": "sky"
        },
        {
          "storyTerm": "First Wall Switch (Maintenance Hatch)",
          "technicalTerm": "sp_configure Enabling xp_cmdshell for Direct OS Commands (EventID 15457)",
          "tone": "amber"
        },
        {
          "storyTerm": "Second Wall Switch (Custom Extensions)",
          "technicalTerm": "sp_configure Enabling clr enabled for In-Database .NET Assemblies",
          "tone": "amber"
        },
        {
          "storyTerm": "Mechanical Helper Inside Ledger",
          "technicalTerm": "CREATE ASSEMBLY FROM 0x4D5A... WITH PERMISSION_SET = UNSAFE",
          "tone": "rose"
        },
        {
          "storyTerm": "Record Room Audit Bell",
          "technicalTerm": "SQL Audit Event 33205, Application EventID 15457 & sys.assembly_files",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "db-mssql-linked-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Internal Brass Pneumatic Tubes",
          "subtitle": "MSSQL Linked Servers Configured with is_rpc_out_enabled = 1",
          "tone": "sky"
        },
        {
          "id": "db-mssql-linked-b-right",
          "tag": "TARGET MECHANISM",
          "title": "First Wall Switch (Maintenance Hatch)",
          "subtitle": "sp_configure Enabling xp_cmdshell for Direct OS Commands…",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wall",
          "stageTag": "STAGE 01 · LATERAL & C2",
          "title": "MSSQL Linked Server Enumeration (sys.servers) & RPC Trust Pivot",
          "storyExcerpt": "Once inside the first record room, the intruder opens the wall directory of pneumatic tubes to see which outbound chutes are switched open and automatically map incoming notes to a chief-archivist badge…",
          "technicalParallel": "Under the hood, the observed step executes SELECT name, product, provider, data_source, is_linked, is_rpc_out_enabled FROM sys.servers; (which executes a structured SQL query or database administration…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Wall",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Configuration Change Enabling xp_cmdshell & clr strict security (Application EventID 15457)",
          "storyExcerpt": "Sending an order down the trusted chute, the intruder flips the remote room’s red safety covers to enable both the direct maintenance hatch and custom extension modules, causing the building’s master…",
          "technicalParallel": "Under the hood, the observed step executes EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE; (which executes privileged T-SQL stored procedures…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Raw Ink",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "In-Memory Hexadecimal CLR Assembly Registration (CREATE ASSEMBLY ... PERMISSION_SET = UNSAFE)",
          "storyExcerpt": "Rather than setting a noisy metal toolbox down on the tiled floor where floor guards would trip over it, the intruder encodes a custom mechanical worker as raw ink digits and pastes it straight into the…",
          "technicalParallel": "Under the hood, the observed step executes CREATE ASSEMBLY [SqlDiagnosticExt] AUTHORIZATION [dbo] FROM 0x4D5A900003000000...",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Brass Tubes",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Record Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Bell",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics",
      "sectionKey": "step-1",
      "sceneKind": "db-mssql-linked-step-1",
      "stageBadge": "STEP #1 · LATERAL & C2",
      "title": "MSSQL Linked Server Enumeration (sys.servers) & RPC Trust Pivot",
      "storyCue": "Once inside the first record room, the intruder opens the wall directory of pneumatic tubes to see which outbound chutes are switched open and automatically map incoming notes to a chief-archivist badge on the neighboring server.",
      "technicalCue": "T1021 · LATERAL & C2 — From an initial SQL connection, the operator queries sys.servers and sys.linked_logins to discover trusted Linked Servers configured with is_rpc_out_enabled = 1 and mapped to a remote sysadmin…",
      "storyMappings": [
        {
          "storyTerm": "Wall Directory of Tubes",
          "technicalTerm": "Querying sys.servers & sys.linked_logins Catalog Views",
          "tone": "sky"
        },
        {
          "storyTerm": "Open Outbound Chute",
          "technicalTerm": "Linked Server Flag is_rpc_out_enabled = 1 (EXEC AT / OPENQUERY)",
          "tone": "amber"
        },
        {
          "storyTerm": "Chief-Archivist Remote Badge",
          "technicalTerm": "Mapped Remote sysadmin Login Context on Linked Instance",
          "tone": "rose"
        },
        {
          "storyTerm": "Directory Inspection Log",
          "technicalTerm": "SQL Server Audit Event 33205 Recording Linked Server Enumeration",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-mssql-linked-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Wall Directory of Tubes",
          "subtitle": "Querying sys.servers & sys.linked_logins Catalog Views",
          "tone": "sky"
        },
        {
          "id": "db-mssql-linked-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Open Outbound Chute",
          "subtitle": "Linked Server Flag is_rpc_out_enabled = 1 (EXEC AT / OPENQUERY)",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wall",
          "stageTag": "STEP 01 · SETUP",
          "title": "Wall Directory of Tubes",
          "storyExcerpt": "Once inside the first record room, the intruder opens the wall directory of pneumatic tubes to see which outbound chutes are switched open and automatically map incoming notes to a…",
          "technicalParallel": "Under the hood, the observed step executes SELECT name, product, provider, data_source, is_linked, is_rpc_out_enabled FROM sys.servers; (which executes a structured SQL query or database administration…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Open",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Open Outbound Chute",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses open outbound chute to advance toward chief-archivist remote badge.",
          "technicalParallel": "From an initial SQL connection, the operator queries sys.servers and sys.linked_logins to discover trusted Linked Servers configured with is_rpc_out_enabled = 1 and mapped to a remote sysadmin login…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Room Wall",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Directory Inspection Log",
          "storyExcerpt": "Behind the scenes, directory inspection log captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 33205 (recording SqlAuditEventId=33205 , SQL Server Audit Action, LinkedServerTarget=CORP-SQL02 , TCP 1433, RemotePrincipal=sa_linked , sysadmin role under T1021): Audit…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Brass Tubes",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Record Vault",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Bell",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1021"
    },
    "step-2": {
      "scenarioId": "db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics",
      "sectionKey": "step-2",
      "sceneKind": "db-mssql-linked-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Configuration Change Enabling xp_cmdshell & clr strict security (Application EventID 15457)",
      "storyCue": "Sending an order down the trusted chute, the intruder flips the remote room’s red safety covers to enable both the direct maintenance hatch and custom extension modules, causing the building’s master switchboard to stamp an unerasable before-and-after receipt.",
      "technicalCue": "T1562 · DEFENSE EVASION — When sp_configure is executed to enable show advanced options, xp_cmdshell, or clr enabled, Microsoft SQL Server writes a deterministic EventID 15457 entry into the Windows Application Event…",
      "storyMappings": [
        {
          "storyTerm": "Flipping Red Safety Covers",
          "technicalTerm": "Executing sp_configure for show advanced options, xp_cmdshell & clr enabled",
          "tone": "rose"
        },
        {
          "storyTerm": "Direct Maintenance Hatch",
          "technicalTerm": "xp_cmdshell Extended Stored Procedure Allowing OS Shell Commands",
          "tone": "amber"
        },
        {
          "storyTerm": "Master Switchboard Receipt",
          "technicalTerm": "Windows Application EventID 15457 Logging Old vs New Config Values",
          "tone": "sky"
        },
        {
          "storyTerm": "Configuration Hardening Guard",
          "technicalTerm": "SIEM Alert on EventID 15457 & Disabling clr strict security Bypasses",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-mssql-linked-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Flipping Red Safety Covers",
          "subtitle": "Executing sp_configure for show advanced options, xp_cmdshell…",
          "tone": "rose"
        },
        {
          "id": "db-mssql-linked-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Direct Maintenance Hatch",
          "subtitle": "xp_cmdshell Extended Stored Procedure Allowing OS Shell Commands",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down Room",
          "stageTag": "STEP 02 · SETUP",
          "title": "Flipping Red Safety Covers",
          "storyExcerpt": "Sending an order down the trusted chute, the intruder flips the remote room’s red safety covers to enable both the direct maintenance hatch and custom extension modules, causing the building’s…",
          "technicalParallel": "Under the hood, the observed step executes EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE; (which executes privileged T-SQL stored procedures…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Direct Maintenance Hatch",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses direct maintenance hatch to advance toward master switchboard receipt.",
          "technicalParallel": "When sp_configure is executed to enable show advanced options, xp_cmdshell, or clr enabled, Microsoft SQL Server writes a deterministic EventID 15457 entry into the Windows Application Event Log…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Down Room",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Configuration Hardening Guard",
          "storyExcerpt": "Behind the scenes, configuration hardening guard captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 15457 (recording EventID=15457 , MSSQL Configuration Option Changed, ConfigurationOption=xp_cmdshell , 0 -> 1, HostProcess=sqlservr.exe under T1562): Forward Windows…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Brass Tubes",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Record Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Bell",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1562"
    },
    "step-3": {
      "scenarioId": "db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics",
      "sectionKey": "step-3",
      "sceneKind": "db-mssql-linked-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "In-Memory Hexadecimal CLR Assembly Registration (CREATE ASSEMBLY ... PERMISSION_SET = UNSAFE)",
      "storyCue": "Rather than setting a noisy metal toolbox down on the tiled floor where floor guards would trip over it, the intruder encodes a custom mechanical worker as raw ink digits and pastes it straight into the record room’s permanent binding cabinet with unrestricted privileges.",
      "technicalCue": "T1505.001 · PERSISTENCE — To persist custom .NET stored procedures without dropping a .dll file to the Windows filesystem, the attacker executes CREATE ASSEMBLY FROM 0x4D5A...",
      "storyMappings": [
        {
          "storyTerm": "Raw Ink Digits in Cabinet",
          "technicalTerm": "CREATE ASSEMBLY FROM 0x4D5A... Embedded Directly in sys.assembly_files",
          "tone": "rose"
        },
        {
          "storyTerm": "Unrestricted Worker Clearance",
          "technicalTerm": "PERMISSION_SET = UNSAFE Allowing Unmanaged Code Execution",
          "tone": "amber"
        },
        {
          "storyTerm": "Avoiding Tiled Floor Footprint",
          "technicalTerm": "Fileless .NET Stored Procedure Persistence Without Dropping a DLL",
          "tone": "sky"
        },
        {
          "storyTerm": "Binding Cabinet Audit",
          "technicalTerm": "Auditing sys.assemblies & sys.assembly_files for Unsigned PE Blobs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-mssql-linked-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Raw Ink Digits in Cabinet",
          "subtitle": "CREATE ASSEMBLY FROM 0x4D5A... Embedded Directly in…",
          "tone": "rose"
        },
        {
          "id": "db-mssql-linked-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Unrestricted Worker Clearance",
          "subtitle": "PERMISSION_SET = UNSAFE Allowing Unmanaged Code Execution",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Raw Ink",
          "stageTag": "STEP 03 · SETUP",
          "title": "Raw Ink Digits in Cabinet",
          "storyExcerpt": "Rather than setting a noisy metal toolbox down on the tiled floor where floor guards would trip over it, the intruder encodes a custom mechanical worker as raw ink digits and pastes it straight…",
          "technicalParallel": "Under the hood, the observed step executes CREATE ASSEMBLY [SqlDiagnosticExt] AUTHORIZATION [dbo] FROM 0x4D5A900003000000...",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Unrestricted Worker Clearance",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses unrestricted worker clearance to advance toward avoiding tiled floor footprint.",
          "technicalParallel": "To persist custom .NET stored procedures without dropping a .dll file to the Windows filesystem, the attacker executes CREATE ASSEMBLY FROM 0x4D5A...",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Than Down",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Binding Cabinet Audit",
          "storyExcerpt": "Behind the scenes, binding cabinet audit captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 33205 (recording CatalogTable=sys.assemblies / sys.assembly_files, AssemblyName=SqlDiagnosticExt, PermissionSet=UNSAFE_ACCESS , Full OS & Network Access inside sqlservr.exe…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Brass Tubes",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Record Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Bell",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1505.001"
    }
  },
  "db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094": {
    "briefing": {
      "scenarioId": "db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094",
      "sectionKey": "briefing",
      "sceneKind": "db-pg-utf8-1094-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "PostgreSQL UTF-8 Quote Escaping & COPY FROM PROGRAM Forensics… — Story-to-Technical Overview",
      "storyCue": "Imagine a high-security bank teller window where a clerk encloses every customer note inside protective wax seals so nobody can sneak an order onto the manager’s desk. A trickster slips a malformed foreign character right beside the closing wax seal so the clerk accidentally swallows the seal itself, letting the rest of the sentence spill straight onto the manager’s command sheet and instruct the basement boiler operator to run raw building commands.",
      "technicalCue": "INITIAL ACCESS: Invalid UTF-8 Multi-Byte Sequence Discrepancy in libpq PQescapeStringConn() -> EXECUTION: Interactive psql Meta-Command (! /bin/sh) or Stacked SQL Statement Execution -> EXECUTION: Database Engine COPY ... FROM PROGRAM OS Command Execution & pgAudit Detection",
      "storyMappings": [
        {
          "storyTerm": "Protective Wax Seal Clerk",
          "technicalTerm": "libpq Escaping Routines (PQescapeStringConn / PQescapeLiteral)",
          "tone": "sky"
        },
        {
          "storyTerm": "Malformed Foreign Character",
          "technicalTerm": "Invalid Multi-Byte UTF-8 Sequence (0xC0 0x27 · CVE-2025-1094)",
          "tone": "rose"
        },
        {
          "storyTerm": "Manager’s Command Sheet",
          "technicalTerm": "Interactive psql ! Meta-Command Shell Escape & Stacked SQL",
          "tone": "amber"
        },
        {
          "storyTerm": "Basement Boiler Operator Command",
          "technicalTerm": "Superuser COPY ... FROM PROGRAM Spawning /bin/sh (pgAudit Logged)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "db-pg-utf8-1094-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Protective Wax Seal Clerk",
          "subtitle": "libpq Escaping Routines (PQescapeStringConn / PQescapeLiteral)",
          "tone": "sky"
        },
        {
          "id": "db-pg-utf8-1094-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Malformed Foreign Character",
          "subtitle": "Invalid Multi-Byte UTF-8 Sequence (0xC0 0x27 · CVE-2025-1094)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wax-seal",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Invalid UTF-8 Multi-Byte Sequence Discrepancy in libpq PQescapeStringConn()",
          "storyExcerpt": "At the front counter, the trickster hands the teller a customer note containing a broken multi-byte symbol pressed tightly against a closing quotation mark, tricking the wax-seal machine into gluing the…",
          "technicalParallel": "Under the hood, the observed step executes psql --version (which executes a structured SQL query or database administration command , psql --version against the relational database engine so that pivots…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Wax Seal",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Interactive psql Meta-Command (! /bin/sh) or Stacked SQL Statement Execution",
          "storyExcerpt": "Because the wax seal never closed properly, the remainder of the trickster’s message spills straight into the interactive clerk’s console, where a single exclamation-mark shortcut instructs the desk…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -pp $(pgrep psql) -m SYSCALL -sv yes (which executes a structured SQL query or database administration command , ausearch -pp $, pgrep psql -m SYSCALL…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Room If",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "Database Engine COPY ... FROM PROGRAM OS Command Execution & pgAudit Detection",
          "storyExcerpt": "Inside the vault room itself, if the session holds master custodian clearance, the spilled order invokes the vault’s built-in bulk-import chute wired directly to an external tool, launching a raw system…",
          "technicalParallel": "Under the hood, the observed step executes COPY pg_temp_audit FROM PROGRAM 'id > /tmp/pg_audit_check'; (which executes the PostgreSQL superuser SQL statement COPY <table_name> FROM PROGRAM…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Teller Window",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Boiler Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Seal Escape",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094",
      "sectionKey": "step-1",
      "sceneKind": "db-pg-utf8-1094-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Invalid UTF-8 Multi-Byte Sequence Discrepancy in libpq PQescapeStringConn()",
      "storyCue": "At the front counter, the trickster hands the teller a customer note containing a broken multi-byte symbol pressed tightly against a closing quotation mark, tricking the wax-seal machine into gluing the quote shut inside the broken symbol instead of sealing the boundary.",
      "technicalCue": "T1190 · INITIAL ACCESS — When an application constructs SQL scripts using libpq escaping routines (PQescapeLiteral / PQescapeStringConn) with a multi-byte client encoding such as UTF-8, a crafted trailing byte sequence…",
      "storyMappings": [
        {
          "storyTerm": "Wax-Seal Machine",
          "technicalTerm": "libpq PQescapeStringConn() & PQescapeLiteral() Client Escaping",
          "tone": "sky"
        },
        {
          "storyTerm": "Broken Multi-Byte Symbol",
          "technicalTerm": "Invalid UTF-8 Trailing Byte Sequence (0xC0 0x27 · CVE-2025-1094)",
          "tone": "rose"
        },
        {
          "storyTerm": "Swallowed Closing Quote",
          "technicalTerm": "Single-Quote Boundary Consumed by Escaping Mismatch",
          "tone": "amber"
        },
        {
          "storyTerm": "Counter Security Audit",
          "technicalTerm": "Parameterized Queries ($1, $2) & Patched libpq Validation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-pg-utf8-1094-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Wax-Seal Machine",
          "subtitle": "libpq PQescapeStringConn() & PQescapeLiteral() Client Escaping",
          "tone": "sky"
        },
        {
          "id": "db-pg-utf8-1094-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Broken Multi-Byte Symbol",
          "subtitle": "Invalid UTF-8 Trailing Byte Sequence (0xC0 0x27 · CVE-2025-1094)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wax-seal",
          "stageTag": "STEP 01 · SETUP",
          "title": "Wax-Seal Machine",
          "storyExcerpt": "At the front counter, the trickster hands the teller a customer note containing a broken multi-byte symbol pressed tightly against a closing quotation mark, tricking the wax-seal machine into…",
          "technicalParallel": "Under the hood, the observed step executes psql --version (which executes a structured SQL query or database administration command , psql --version against the relational database engine so that pivots…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Broken Multi-Byte Symbol",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses broken multi-byte symbol to advance toward swallowed closing quote.",
          "technicalParallel": "When an application constructs SQL scripts using libpq escaping routines (PQescapeLiteral / PQescapeStringConn) with a multi-byte client encoding such as UTF-8, a crafted trailing byte sequence (0xC0…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Note Mark",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Counter Security Audit",
          "storyExcerpt": "Behind the scenes, counter security audit captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 1094 (recording DatabaseEngine=PostgreSQL 16 , libpq PQescapeStringConn, EncodingError=invalid byte sequence for encoding \"UTF8\": 0xc0 0x27, AdvisoryId=CVE-2025-1094 under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Teller Window",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Boiler Vault",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Seal Escape",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094",
      "sectionKey": "step-2",
      "sceneKind": "db-pg-utf8-1094-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Interactive psql Meta-Command (! /bin/sh) or Stacked SQL Statement Execution",
      "storyCue": "Because the wax seal never closed properly, the remainder of the trickster’s message spills straight into the interactive clerk’s console, where a single exclamation-mark shortcut instructs the desk clerk to step outside the counter and run an unguarded hallway command.",
      "technicalCue": "T1059.004 · EXECUTION — When the escaped output is fed into an interactive psql batch pipeline, breaking out of the single-quoted literal allows injection of the psql ! meta-command (which spawns a local shell as the…",
      "storyMappings": [
        {
          "storyTerm": "Interactive Clerk Console",
          "technicalTerm": "Interactive psql Batch Pipeline Processing Escaped SQL",
          "tone": "sky"
        },
        {
          "storyTerm": "Exclamation-Mark Shortcut",
          "technicalTerm": "psql ! Meta-Command Spawning /bin/sh as Client OS User",
          "tone": "rose"
        },
        {
          "storyTerm": "Spilled Message Instructions",
          "technicalTerm": "Stacked SQL Statements Escaping Single-Quoted String Literal",
          "tone": "amber"
        },
        {
          "storyTerm": "Hallway Process Monitor",
          "technicalTerm": "Linux auditd Capturing psql Spawning /bin/sh Subprocess",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-pg-utf8-1094-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Interactive Clerk Console",
          "subtitle": "Interactive psql Batch Pipeline Processing Escaped SQL",
          "tone": "sky"
        },
        {
          "id": "db-pg-utf8-1094-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Exclamation-Mark Shortcut",
          "subtitle": "psql ! Meta-Command Spawning /bin/sh as Client OS User",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wax Seal",
          "stageTag": "STEP 02 · SETUP",
          "title": "Interactive Clerk Console",
          "storyExcerpt": "Because the wax seal never closed properly, the remainder of the trickster’s message spills straight into the interactive clerk’s console, where a single exclamation-mark shortcut instructs the…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -pp $(pgrep psql) -m SYSCALL -sv yes (which executes a structured SQL query or database administration command , ausearch -pp $, pgrep psql -m SYSCALL…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Exclamation-Mark Shortcut",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses exclamation-mark shortcut to advance toward spilled message instructions.",
          "technicalParallel": "When the escaped output is fed into an interactive psql batch pipeline, breaking out of the single-quoted literal allows injection of the psql ! meta-command (which spawns a local shell as the psql…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Wax Seal",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Hallway Process Monitor",
          "storyExcerpt": "Behind the scenes, hallway process monitor captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording ParentProcess=psql , Interactive SQL Batch Client, MetaCommandTriggered=\\! /bin/sh -c \"id; hostname\", Syscall=sys_execve , 59 under T1059.004): Pass the…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Teller Window",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Boiler Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Seal Escape",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1059.004"
    },
    "step-3": {
      "scenarioId": "db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094",
      "sectionKey": "step-3",
      "sceneKind": "db-pg-utf8-1094-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Database Engine COPY ... FROM PROGRAM OS Command Execution & pgAudit Detection",
      "storyCue": "Inside the vault room itself, if the session holds master custodian clearance, the spilled order invokes the vault’s built-in bulk-import chute wired directly to an external tool, launching a raw system shell while the vault’s permanent ledger stamps every line.",
      "technicalCue": "T1203 · EXECUTION — On the PostgreSQL database server itself, if the session holds superuser or pg_execute_server_program privileges, executing COPY cmd_out FROM PROGRAM spawns /bin/sh directly as the postgres…",
      "storyMappings": [
        {
          "storyTerm": "Master Custodian Clearance",
          "technicalTerm": "PostgreSQL Superuser or pg_execute_server_program Role",
          "tone": "amber"
        },
        {
          "storyTerm": "Built-In Bulk-Import Chute",
          "technicalTerm": "COPY cmd_out FROM PROGRAM Executing /bin/sh as postgres User",
          "tone": "rose"
        },
        {
          "storyTerm": "Vault Room Engine",
          "technicalTerm": "PostgreSQL Server Process Hosting Privileged Execution",
          "tone": "sky"
        },
        {
          "storyTerm": "Permanent Vault Ledger",
          "technicalTerm": "pgAudit DDL/MISC Logging & Linux auditd execve Telemetry",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-pg-utf8-1094-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Master Custodian Clearance",
          "subtitle": "PostgreSQL Superuser or pg_execute_server_program Role",
          "tone": "amber"
        },
        {
          "id": "db-pg-utf8-1094-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Built-In Bulk-Import Chute",
          "subtitle": "COPY cmd_out FROM PROGRAM Executing /bin/sh as postgres User",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room If",
          "stageTag": "STEP 03 · SETUP",
          "title": "Master Custodian Clearance",
          "storyExcerpt": "Inside the vault room itself, if the session holds master custodian clearance, the spilled order invokes the vault’s built-in bulk-import chute wired directly to an external tool, launching a…",
          "technicalParallel": "Under the hood, the observed step executes COPY pg_temp_audit FROM PROGRAM 'id > /tmp/pg_audit_check'; (which executes the PostgreSQL superuser SQL statement COPY <table_name> FROM PROGRAM…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Bulk-import",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Built-In Bulk-Import Chute",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses built-in bulk-import chute to advance toward vault room engine.",
          "technicalParallel": "On the PostgreSQL database server itself, if the session holds superuser or pg_execute_server_program privileges, executing COPY cmd_out FROM PROGRAM spawns /bin/sh directly as the postgres operating…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Room",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Permanent Vault Ledger",
          "storyExcerpt": "Behind the scenes, permanent vault ledger captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 5432 (recording PgAuditClass=MISC / COPY FROM PROGRAM, DatabaseRole=postgres / pg_execute_server_program, SpawnedChildShell=/bin/sh -c id > /tmp/pg_audit_check under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Teller Window",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Boiler Vault",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Seal Escape",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1203"
    }
  },
  "db-redis-lua-sandbox-debian-liblua-cve-2022-0543": {
    "briefing": {
      "scenarioId": "db-redis-lua-sandbox-debian-liblua-cve-2022-0543",
      "sectionKey": "briefing",
      "sceneKind": "db-redis-lua-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1046",
      "title": "Redis Lua Sandbox package.loadlib Escape & ReplicaOf Forensics… — Story-to-Technical Overview",
      "storyCue": "Imagine an express luggage locker room where visitors can run tiny pocket calculators inside a locked glass box that has all phone and door keys stripped away. On one city’s custom build of that locker room, the installer accidentally left a master supply-closet catalog sitting inside the glass box, letting an uninvited guest reach out, pull a full power-tool kit back through the glass, and open a direct backdoor onto the station floor.",
      "technicalCue": "CREDENTIAL ACCESS: Unauthenticated Redis Port 6379 Connection & INFO Server Enumeration -> EXECUTION: Redis EVAL Lua Script Invoking package.loadlib(\"/usr/lib/x86_64-linux-gnu/liblua5.1.so.0\", \"luaopen_io\") -> EXECUTION: Child Shell Spawn (io.popen -> /bin/sh) Under redis-server PID in Linux auditd",
      "storyMappings": [
        {
          "storyTerm": "Express Luggage Locker Room",
          "technicalTerm": "Exposed Redis Cache Engine Listening on TCP Port 6379",
          "tone": "sky"
        },
        {
          "storyTerm": "Locked Calculator Glass Box",
          "technicalTerm": "Redis EVAL Lua Script Sandbox (Stripped os & io Globals)",
          "tone": "amber"
        },
        {
          "storyTerm": "Master Supply-Closet Catalog",
          "technicalTerm": "Debian/Ubuntu Exposed Lua package.loadlib (CVE-2022-0543)",
          "tone": "rose"
        },
        {
          "storyTerm": "Station Floor Security Camera",
          "technicalTerm": "Linux auditd sys_execve (59) Catching redis-server Spawning /bin/sh",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "db-redis-lua-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Express Luggage Locker Room",
          "subtitle": "Exposed Redis Cache Engine Listening on TCP Port 6379",
          "tone": "sky"
        },
        {
          "id": "db-redis-lua-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Locked Calculator Glass Box",
          "subtitle": "Redis EVAL Lua Script Sandbox (Stripped os & io Globals)",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Unauthenticated Redis Port 6379 Connection & INFO Server Enumeration",
          "storyExcerpt": "Walking up to an unlocked luggage locker counter with no attendant or password sign, the intruder taps the lobby directory button to read the building’s exact builder plaque and confirm which city’s…",
          "technicalParallel": "Under the hood, the observed step executes redis-cli -h 10.10.30.40 -p 6379 INFO server (which executes or audits database engine statements and administrative procedures , redis-cli -h 10.10.30.40 -p…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Slip",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Redis EVAL Lua Script Invoking package.loadlib(\"/usr/lib/x86_64-linux-gnu/liblua5.1.so.0\", \"luaopen_io\")",
          "storyExcerpt": "Confirming the vulnerable city build, the intruder slips a short calculation slip into the glass box that opens the forgotten supply-closet catalog, reaches straight into the building’s shared tool…",
          "technicalParallel": "Under the hood, the observed step executes redis-cli EVAL 'local io_l = package.loadlib(\"/usr/lib/x86_64-linux-gnu/liblua5.1.so.0\", \"luaopen_io\"); local io = io_l(); local f = io.popen(\"id\", \"r\"); local…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Back Wall",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "Child Shell Spawn (io.popen -> /bin/sh) Under redis-server PID in Linux auditd",
          "storyExcerpt": "Now holding the forbidden command toolkit inside the glass box, the intruder punches straight through the back wall to start a live maintenance shell under the locker attendant’s badge, immediately…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -pp $(pgrep redis-server) -m SYSCALL -i (which executes the technical command / telemetry directive , ausearch -pp $, pgrep redis-server -m SYSCALL -i…",
          "accentHex": "#FACC15",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Box",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Supply Closet",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Catalog Reach",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "db-redis-lua-sandbox-debian-liblua-cve-2022-0543",
      "sectionKey": "step-1",
      "sceneKind": "db-redis-lua-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Unauthenticated Redis Port 6379 Connection & INFO Server Enumeration",
      "storyCue": "Walking up to an unlocked luggage locker counter with no attendant or password sign, the intruder taps the lobby directory button to read the building’s exact builder plaque and confirm which city’s custom locker edition is installed.",
      "technicalCue": "T1046 · CREDENTIAL ACCESS — When redis-server is bound to 0.0.0.0:6379 without protected-mode or requirepass authentication (or reached via an internal SSRF pivot), the client sends the INFO server command to identify the…",
      "storyMappings": [
        {
          "storyTerm": "Unlocked Luggage Counter",
          "technicalTerm": "redis-server Bound to 0.0.0.0:6379 Without requirepass / protected-mode",
          "tone": "amber"
        },
        {
          "storyTerm": "Lobby Directory Button",
          "technicalTerm": "Unauthenticated INFO server Command Over TCP Port 6379",
          "tone": "rose"
        },
        {
          "storyTerm": "Builder Plaque Details",
          "technicalTerm": "Returned os:Linux Debian/Ubuntu Banner & Redis Build Version",
          "tone": "sky"
        },
        {
          "storyTerm": "Locker Access Firewall",
          "technicalTerm": "Loopback Bind (127.0.0.1), ACL Auth & SSRF Egress Controls",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-redis-lua-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Unlocked Luggage Counter",
          "subtitle": "redis-server Bound to 0.0.0.0:6379 Without requirepass /…",
          "tone": "amber"
        },
        {
          "id": "db-redis-lua-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Lobby Directory Button",
          "subtitle": "Unauthenticated INFO server Command Over TCP Port 6379",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up No",
          "stageTag": "STEP 01 · SETUP",
          "title": "Unlocked Luggage Counter",
          "storyExcerpt": "Walking up to an unlocked luggage locker counter with no attendant or password sign, the intruder taps the lobby directory button to read the building’s exact builder plaque and confirm which…",
          "technicalParallel": "Under the hood, the observed step executes redis-cli -h 10.10.30.40 -p 6379 INFO server (which executes or audits database engine statements and administrative procedures , redis-cli -h 10.10.30.40 -p…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Lobby Directory Button",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses lobby directory button to advance toward builder plaque details.",
          "technicalParallel": "When redis-server is bound to 0.0.0.0:6379 without protected-mode or requirepass authentication (or reached via an internal SSRF pivot), the client sends the INFO server command to identify the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Up No",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Locker Access Firewall",
          "storyExcerpt": "Behind the scenes, locker access firewall captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 6379 (recording ServiceEndpoint=TCP 10.10.30.40:6379 , redis-server, CommandExecuted=INFO server, DetectedDistribution=Debian / Ubuntu Dynamic Lua Build under T1046): Bind…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Box",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Supply Closet",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Catalog Reach",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1046"
    },
    "step-2": {
      "scenarioId": "db-redis-lua-sandbox-debian-liblua-cve-2022-0543",
      "sectionKey": "step-2",
      "sceneKind": "db-redis-lua-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Redis EVAL Lua Script Invoking package.loadlib(\"/usr/lib/x86_64-linux-gnu/liblua5.1.so.0\", \"luaopen_io\")",
      "storyCue": "Confirming the vulnerable city build, the intruder slips a short calculation slip into the glass box that opens the forgotten supply-closet catalog, reaches straight into the building’s shared tool library, and pulls the forbidden file-and-command toolkit back inside the box.",
      "technicalCue": "T1059 · EXECUTION — Although upstream Redis removes os and io globals from the Lua sandbox, vulnerable Debian/Ubuntu packages left the global package variable populated.",
      "storyMappings": [
        {
          "storyTerm": "Short Calculation Slip",
          "technicalTerm": "Redis EVAL Lua Script Invoking Global package.loadlib",
          "tone": "rose"
        },
        {
          "storyTerm": "Forgotten Supply-Closet Catalog",
          "technicalTerm": "Unstripped Global package Table in Debian/Ubuntu Package (DSA-5081)",
          "tone": "amber"
        },
        {
          "storyTerm": "Building Shared Tool Library",
          "technicalTerm": "/usr/lib/x86_64-linux-gnu/liblua5.1.so.0 Loading luaopen_io",
          "tone": "sky"
        },
        {
          "storyTerm": "Sandbox Integrity Guard",
          "technicalTerm": "Upgrading Patched Redis & Blocking Untrusted EVAL Commands",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-redis-lua-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Short Calculation Slip",
          "subtitle": "Redis EVAL Lua Script Invoking Global package.loadlib",
          "tone": "rose"
        },
        {
          "id": "db-redis-lua-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Forgotten Supply-Closet Catalog",
          "subtitle": "Unstripped Global package Table in Debian/Ubuntu Package…",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Slip",
          "stageTag": "STEP 02 · SETUP",
          "title": "Short Calculation Slip",
          "storyExcerpt": "Confirming the vulnerable city build, the intruder slips a short calculation slip into the glass box that opens the forgotten supply-closet catalog, reaches straight into the building’s shared…",
          "technicalParallel": "Under the hood, the observed step executes redis-cli EVAL 'local io_l = package.loadlib(\"/usr/lib/x86_64-linux-gnu/liblua5.1.so.0\", \"luaopen_io\"); local io = io_l(); local f = io.popen(\"id\", \"r\"); local…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Tool",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Forgotten Supply-Closet Catalog",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses forgotten supply-closet catalog to advance toward building shared tool library.",
          "technicalParallel": "Although upstream Redis removes os and io globals from the Lua sandbox, vulnerable Debian/Ubuntu packages left the global package variable populated.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tool",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Sandbox Integrity Guard",
          "storyExcerpt": "Behind the scenes, sandbox integrity guard captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 543 (recording RedisCommand=EVAL , Lua Sandbox Execution, SharedLibraryLoaded=/usr/lib/x86_64-linux-gnu/liblua5.1.so.0 , luaopen_io, VulnerabilityId=CVE-2022-0543 under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Box",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Supply Closet",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Catalog Reach",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1059"
    },
    "step-3": {
      "scenarioId": "db-redis-lua-sandbox-debian-liblua-cve-2022-0543",
      "sectionKey": "step-3",
      "sceneKind": "db-redis-lua-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Child Shell Spawn (io.popen -> /bin/sh) Under redis-server PID in Linux auditd",
      "storyCue": "Now holding the forbidden command toolkit inside the glass box, the intruder punches straight through the back wall to start a live maintenance shell under the locker attendant’s badge, immediately tripping the station’s hallway camera that knows a luggage clerk should never launch a shell.",
      "technicalCue": "T1203 · EXECUTION — When io.popen() executes inside the Redis Lua VM, the Linux kernel records a sys_execve (59) system call where parent process /usr/bin/redis-server spawns /bin/sh, a deterministic…",
      "storyMappings": [
        {
          "storyTerm": "Punching Through Back Wall",
          "technicalTerm": "Calling io.popen() Inside Redis Lua Runtime to Spawn /bin/sh",
          "tone": "rose"
        },
        {
          "storyTerm": "Locker Attendant Badge",
          "technicalTerm": "Child Process Running Under redis Service OS Account",
          "tone": "amber"
        },
        {
          "storyTerm": "Station Hallway Camera",
          "technicalTerm": "Linux auditd SYSCALL execve (59) on Parent /usr/bin/redis-server",
          "tone": "sky"
        },
        {
          "storyTerm": "High-Confidence Alarm",
          "technicalTerm": "EDR / Falco Alert on Cache Daemon Spawning Interactive Shell",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-redis-lua-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Punching Through Back Wall",
          "subtitle": "Calling io.popen() Inside Redis Lua Runtime to Spawn /bin/sh",
          "tone": "rose"
        },
        {
          "id": "db-redis-lua-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Locker Attendant Badge",
          "subtitle": "Child Process Running Under redis Service OS Account",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Back Wall",
          "stageTag": "STEP 03 · SETUP",
          "title": "Punching Through Back Wall",
          "storyExcerpt": "Now holding the forbidden command toolkit inside the glass box, the intruder punches straight through the back wall to start a live maintenance shell under the locker attendant’s badge…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -pp $(pgrep redis-server) -m SYSCALL -i (which executes the technical command / telemetry directive , ausearch -pp $, pgrep redis-server -m SYSCALL -i…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Locker Attendant Badge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses locker attendant badge to advance toward station hallway camera.",
          "technicalParallel": "When io.popen() executes inside the Redis Lua VM, the Linux kernel records a sys_execve (59) system call where parent process /usr/bin/redis-server spawns /bin/sh, a deterministic high-confidence…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. High-confidence",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "High-Confidence Alarm",
          "storyExcerpt": "Behind the scenes, high-confidence alarm captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording ParentProcess=/usr/bin/redis-server , PID 1120, uid=114 redis, ChildExecutable=/bin/sh -c id, DetectionRule=Sigma: proc_creation_lnx_redis_child_shell under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Box",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Supply Closet",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Catalog Reach",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1203"
    }
  },
  "db-snowflake-unc5537-single-factor-auth-data-egress-audit": {
    "briefing": {
      "scenarioId": "db-snowflake-unc5537-single-factor-auth-data-egress-audit",
      "sectionKey": "briefing",
      "sceneKind": "db-snowflake-egress-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1078.004",
      "title": "Snowflake Single-Factor Session & QUERY_HISTORY Egress Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a massive cloud archive warehouse where a contractor’s stolen single-key password still unlocks the front door because neither a second approval buzzer nor an approved-visitor street list was turned on. Walking straight inside from an unfamiliar address, the intruder prints out the master floor map of every filing aisle, packs millions of customer records into compressed shipping crates in a private staging bay, and wheels the crates right out the loading dock.",
      "technicalCue": "INITIAL ACCESS: Single-Factor Password Authentication in ACCOUNT_USAGE.LOGIN_HISTORY -> CREDENTIAL ACCESS: Schema Discovery & Privilege Enumeration in ACCOUNT_USAGE.QUERY_HISTORY -> EXFIL & IMPACT: Bulk Table Staging via COPY INTO @~ & GET File Egress Forensics",
      "storyMappings": [
        {
          "storyTerm": "Stolen Single-Key Contractor Password",
          "technicalTerm": "Infostealer Credentials with SECOND_AUTHENTICATION_FACTOR = NULL",
          "tone": "rose"
        },
        {
          "storyTerm": "Missing Approved-Visitor Street List",
          "technicalTerm": "Absent Snowflake Network Policy IP Allowlist in LOGIN_HISTORY",
          "tone": "amber"
        },
        {
          "storyTerm": "Printing Master Floor Map",
          "technicalTerm": "SHOW GRANTS, SHOW DATABASES & INFORMATION_SCHEMA in QUERY_HISTORY",
          "tone": "sky"
        },
        {
          "storyTerm": "Compressed Staging Bay Crates",
          "technicalTerm": "COPY INTO @~/export_stage/ (GZIP CSV) & GET Bulk Data Egress",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "db-snowflake-egress-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Stolen Single-Key Contractor Password",
          "subtitle": "Infostealer Credentials with SECOND_AUTHENTICATION_FACTOR = NULL",
          "tone": "rose"
        },
        {
          "id": "db-snowflake-egress-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Missing Approved-Visitor Street List",
          "subtitle": "Absent Snowflake Network Policy IP Allowlist in LOGIN_HISTORY",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Old Key",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Single-Factor Password Authentication in ACCOUNT_USAGE.LOGIN_HISTORY",
          "storyExcerpt": "Using an old key copied months earlier from a contractor’s compromised workstation, an outsider walks up to the archive warehouse from an unknown street address and unlocks the front gate with a single…",
          "technicalParallel": "Under the hood, the observed step executes SELECT EVENT_TIMESTAMP, USER_NAME, CLIENT_IP, REPORTED_CLIENT_TYPE, FIRST_AUTHENTICATION_FACTOR, SECOND_AUTHENTICATION_FACTOR FROM…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. List",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "Schema Discovery & Privilege Enumeration in ACCOUNT_USAGE.QUERY_HISTORY",
          "storyExcerpt": "Inside the archive warehouse, the intruder runs an automated clipboard sweep across every hall, listing which master roles their key holds, which vaults exist on each floor, and which filing cabinets…",
          "technicalParallel": "Under the hood, the observed step executes SELECT QUERY_ID, USER_NAME, ROLE_NAME, QUERY_TYPE, QUERY_TEXT, ROWS_PRODUCED FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE SESSION_ID = 884120994102 ORDER BY…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Out One",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Bulk Table Staging via COPY INTO @~ & GET File Egress Forensics",
          "storyExcerpt": "Instead of carrying folders out one by one, the intruder dumps entire customer aisles into compressed bundles inside their personal staging closet and hauls the packed bundles straight out the exit ramp…",
          "technicalParallel": "Under the hood, the observed step executes SELECT QUERY_ID, USER_NAME, QUERY_TEXT, ROWS_UNLOADED, BYTES_WRITTEN_TO_RESULT FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE QUERY_TYPE IN ('UNLOAD'…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Archive Floor",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Staging Crates",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Egress Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "db-snowflake-unc5537-single-factor-auth-data-egress-audit",
      "sectionKey": "step-1",
      "sceneKind": "db-snowflake-egress-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Single-Factor Password Authentication in ACCOUNT_USAGE.LOGIN_HISTORY",
      "storyCue": "Using an old key copied months earlier from a contractor’s compromised workstation, an outsider walks up to the archive warehouse from an unknown street address and unlocks the front gate with a single password because no second verification chime or neighborhood gate list stops them.",
      "technicalCue": "T1078.004 · INITIAL ACCESS — Using historical credentials harvested from an infostealer infection on a contractor workstation, an external client authenticates to a Snowflake tenant account that lacks a Network Policy IP…",
      "storyMappings": [
        {
          "storyTerm": "Old Copied Contractor Key",
          "technicalTerm": "Historical Infostealer-Harvested Snowflake Password Credentials",
          "tone": "rose"
        },
        {
          "storyTerm": "No Second Verification Chime",
          "technicalTerm": "Single-Factor Login (MFA Not Enforced on Service/Contractor Account)",
          "tone": "amber"
        },
        {
          "storyTerm": "Unknown Street Address",
          "technicalTerm": "Non-Corporate External IP Missing Network Policy Allowlist",
          "tone": "sky"
        },
        {
          "storyTerm": "Front Gate Entry Ledger",
          "technicalTerm": "SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY & SESSIONS Audit Views",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-snowflake-egress-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Old Copied Contractor Key",
          "subtitle": "Historical Infostealer-Harvested Snowflake Password Credentials",
          "tone": "rose"
        },
        {
          "id": "db-snowflake-egress-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "No Second Verification Chime",
          "subtitle": "Single-Factor Login (MFA Not Enforced on Service/Contractor…",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Old Key",
          "stageTag": "STEP 01 · SETUP",
          "title": "Old Copied Contractor Key",
          "storyExcerpt": "Using an old key copied months earlier from a contractor’s compromised workstation, an outsider walks up to the archive warehouse from an unknown street address and unlocks the front gate with…",
          "technicalParallel": "Under the hood, the observed step executes SELECT EVENT_TIMESTAMP, USER_NAME, CLIENT_IP, REPORTED_CLIENT_TYPE, FIRST_AUTHENTICATION_FACTOR, SECOND_AUTHENTICATION_FACTOR FROM…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses No",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "No Second Verification Chime",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses no second verification chime to advance toward unknown street address.",
          "technicalParallel": "Using historical credentials harvested from an infostealer infection on a contractor workstation, an external client authenticates to a Snowflake tenant account that lacks a Network Policy IP allowlist…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gate",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Front Gate Entry Ledger",
          "storyExcerpt": "Behind the scenes, front gate entry ledger captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CloudTrail Event 1001 (recording AuditView=SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY & SESSIONS, AuthenticationFactors=FIRST_AUTHENTICATION_FACTOR=PASSWORD, SECOND_AUTHENTICATION_FACTOR=NULL…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Archive Floor",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Staging Crates",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Egress Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1078.004"
    },
    "step-2": {
      "scenarioId": "db-snowflake-unc5537-single-factor-auth-data-egress-audit",
      "sectionKey": "step-2",
      "sceneKind": "db-snowflake-egress-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Schema Discovery & Privilege Enumeration in ACCOUNT_USAGE.QUERY_HISTORY",
      "storyCue": "Inside the archive warehouse, the intruder runs an automated clipboard sweep across every hall, listing which master roles their key holds, which vaults exist on each floor, and which filing cabinets contain the highest-value customer ledgers.",
      "technicalCue": "T1087.004 · CREDENTIAL ACCESS — Once authenticated, the session executes automated discovery queries (SHOW GRANTS TO USER, SHOW DATABASES, SHOW SCHEMAS, and SELECT * FROM INFORMATION_SCHEMA.TABLES) recorded in…",
      "storyMappings": [
        {
          "storyTerm": "Automated Clipboard Sweep",
          "technicalTerm": "Scripted Discovery Queries Linked Under One SESSION_ID",
          "tone": "amber"
        },
        {
          "storyTerm": "Listing Master Key Roles",
          "technicalTerm": "SHOW GRANTS TO USER & SHOW DATABASES / SHOW SCHEMAS",
          "tone": "rose"
        },
        {
          "storyTerm": "Locating Customer Cabinets",
          "technicalTerm": "SELECT * FROM INFORMATION_SCHEMA.TABLES Metadata Enumeration",
          "tone": "sky"
        },
        {
          "storyTerm": "Warehouse Activity Log",
          "technicalTerm": "SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY Session Correlation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-snowflake-egress-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Automated Clipboard Sweep",
          "subtitle": "Scripted Discovery Queries Linked Under One SESSION_ID",
          "tone": "amber"
        },
        {
          "id": "db-snowflake-egress-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Listing Master Key Roles",
          "subtitle": "SHOW GRANTS TO USER & SHOW DATABASES / SHOW SCHEMAS",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Runs Hall",
          "stageTag": "STEP 02 · SETUP",
          "title": "Automated Clipboard Sweep",
          "storyExcerpt": "Inside the archive warehouse, the intruder runs an automated clipboard sweep across every hall, listing which master roles their key holds, which vaults exist on each floor, and which filing…",
          "technicalParallel": "Under the hood, the observed step executes SELECT QUERY_ID, USER_NAME, ROLE_NAME, QUERY_TYPE, QUERY_TEXT, ROWS_PRODUCED FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE SESSION_ID = 884120994102 ORDER BY…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Listing Master Key Roles",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses listing master key roles to advance toward locating customer cabinets.",
          "technicalParallel": "Once authenticated, the session executes automated discovery queries (SHOW GRANTS TO USER, SHOW DATABASES, SHOW SCHEMAS, and SELECT * FROM INFORMATION_SCHEMA.TABLES) recorded in…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Runs Hall",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Warehouse Activity Log",
          "storyExcerpt": "Behind the scenes, warehouse activity log captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CloudTrail Event 1002 (recording ActiveRole=ACCOUNTADMIN , Over-Privileged Legacy Service Account, DiscoveryQueries=SHOW GRANTS TO USER; SHOW TERSE DATABASES; INFORMATION_SCHEMA.TABLES…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Archive Floor",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Staging Crates",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Egress Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1087.004"
    },
    "step-3": {
      "scenarioId": "db-snowflake-unc5537-single-factor-auth-data-egress-audit",
      "sectionKey": "step-3",
      "sceneKind": "db-snowflake-egress-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Bulk Table Staging via COPY INTO @~ & GET File Egress Forensics",
      "storyCue": "Instead of carrying folders out one by one, the intruder dumps entire customer aisles into compressed bundles inside their personal staging closet and hauls the packed bundles straight out the exit ramp, leaving giant weight spikes on the warehouse shipping scale.",
      "technicalCue": "T1530 · EXFIL & IMPACT — To compress and export high-row-count tables rapidly, the session executes COPY INTO @~/export_stage/ FROM PROD_DB.PUBLIC.CUSTOMER_RECORDS FILE_FORMAT=(TYPE=CSV COMPRESSION=GZIP) followed by…",
      "storyMappings": [
        {
          "storyTerm": "Personal Staging Closet",
          "technicalTerm": "User Internal Stage (@~/export_stage/) Staged via COPY INTO",
          "tone": "sky"
        },
        {
          "storyTerm": "Compressing Customer Aisles",
          "technicalTerm": "COPY INTO ... FILE_FORMAT=(TYPE=CSV COMPRESSION=GZIP)",
          "tone": "amber"
        },
        {
          "storyTerm": "Hauling Bundles Out Exit Ramp",
          "technicalTerm": "GET @~/export_stage/ file:///tmp/ Bulk Download Command",
          "tone": "rose"
        },
        {
          "storyTerm": "Warehouse Shipping Scale Spike",
          "technicalTerm": "Anomalous BYTES_WRITTEN_TO_RESULT & External Egress Audit Alerts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "db-snowflake-egress-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Personal Staging Closet",
          "subtitle": "User Internal Stage (@~/export_stage/) Staged via COPY INTO",
          "tone": "sky"
        },
        {
          "id": "db-snowflake-egress-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Compressing Customer Aisles",
          "subtitle": "COPY INTO ... FILE_FORMAT=(TYPE=CSV COMPRESSION=GZIP)",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out One",
          "stageTag": "STEP 03 · SETUP",
          "title": "Personal Staging Closet",
          "storyExcerpt": "Instead of carrying folders out one by one, the intruder dumps entire customer aisles into compressed bundles inside their personal staging closet and hauls the packed bundles straight out the…",
          "technicalParallel": "Under the hood, the observed step executes SELECT QUERY_ID, USER_NAME, QUERY_TEXT, ROWS_UNLOADED, BYTES_WRITTEN_TO_RESULT FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE QUERY_TYPE IN ('UNLOAD'…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Out",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Compressing Customer Aisles",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses compressing customer aisles to advance toward hauling bundles out exit ramp.",
          "technicalParallel": "To compress and export high-row-count tables rapidly, the session executes COPY INTO @~/export_stage/ FROM PROD_DB.PUBLIC.CUSTOMER_RECORDS FILE_FORMAT=(TYPE=CSV COMPRESSION=GZIP) followed by GET…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Out Exit",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Warehouse Shipping Scale Spike",
          "storyExcerpt": "Behind the scenes, warehouse shipping scale spike captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CloudTrail Event 1003 (recording QueryType=UNLOAD , COPY INTO @~ User Stage followed by GET_FILES, RowsUnloaded=4,820,190 rows , ~1.94 GB scanned, IncidentResponseAction=ALTER USER…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Archive Floor",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Staging Crates",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Egress Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1530"
    }
  }
};
