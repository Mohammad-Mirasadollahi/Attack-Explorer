import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an unmanned document warehouse left with its main roll-up door propped wide open toward the street and the badge scanner unplugged. A passing scavenger strolls inside to list every shelf, flips straight to the rolling carbon-copy journal that records even recently shredded secret passes, drains every customer binder into a van, leaves a single extortion flyer on an empty shelf, and burns the original binders behind them.',
      storyMappings: [
        {
          storyTerm: 'Roll-Up Door Propped Open',
          technicalTerm: 'mongod Bound to 0.0.0.0:27017 with security.authorization Disabled',
          tone: 'amber',
        },
        {
          storyTerm: 'Strolling In to List Shelves',
          technicalTerm: 'Unauthenticated OP_MSG (Opcode 2013) hello & listDatabases Commands',
          tone: 'sky',
        },
        {
          storyTerm: 'Rolling Carbon-Copy Journal',
          technicalTerm: 'Replication Oplog (local.oplog.rs) Retaining Deleted Tokens & Keys',
          tone: 'rose',
        },
        {
          storyTerm: 'Extortion Flyer & Burned Binders',
          technicalTerm: 'Rapid getMore Cursor Dump, WARNING Ransom Note & dropDatabase',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Spotting the wide-open warehouse door facing the public street with no guard desk turned on, the scavenger steps in, greets the automated catalog kiosk, and prints out the complete list of every document vault and its storage size.',
        storyMappings: [
          {
            storyTerm: 'Wide-Open Street Door',
            technicalTerm: 'MongoDB net.bindIp: 0.0.0.0 on TCP Port 27017 Without Auth',
            tone: 'amber',
          },
          {
            storyTerm: 'Automated Catalog Kiosk',
            technicalTerm: 'OP_MSG (Opcode 2013) isMaster / hello & listDatabases Protocol',
            tone: 'sky',
          },
          {
            storyTerm: 'Complete Vault Size List',
            technicalTerm: 'Returned Catalog of All Production Database Names & Byte Counts',
            tone: 'rose',
          },
          {
            storyTerm: 'Warehouse Entry Lock',
            technicalTerm: 'Enabling security.authorization: enabled & Private Subnet Binding',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Not content with the active filing cabinets alone, the scavenger heads straight to the warehouse’s rolling carbon-copy sync journal, which keeps a play-by-play transcript of every addition, edit, and deletion so recently revoked access keys and temporary passes can still be pulled right off the tape.',
        storyMappings: [
          {
            storyTerm: 'Rolling Carbon-Copy Sync Journal',
            technicalTerm: 'MongoDB Replica Set Operation Log (local.oplog.rs Collection)',
            tone: 'sky',
          },
          {
            storyTerm: 'Play-by-Play Transcript',
            technicalTerm: 'Historical Record of Every Insert, Update & Delete Operation',
            tone: 'amber',
          },
          {
            storyTerm: 'Pulling Revoked Passes Off Tape',
            technicalTerm: 'Recovering Recently Deleted API Keys & Session JWTs via find()',
            tone: 'rose',
          },
          {
            storyTerm: 'Journal Access Audit',
            technicalTerm: 'MongoDB Audit Log Capturing Unauthorized Reads of local.oplog.rs',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'In the final automated sweep, the scavenger runs a high-speed conveyor to empty every customer cabinet in rapid batches, drops a single ransom demand leaflet into a newly labeled warning box, and triggers the incinerator to erase the original cabinets.',
        storyMappings: [
          {
            storyTerm: 'High-Speed Conveyor Sweep',
            technicalTerm: 'Rapid getMore Cursor Batches Draining Production Collections',
            tone: 'amber',
          },
          {
            storyTerm: 'Ransom Demand Warning Box',
            technicalTerm: 'Inserted Extortion Document Inside Newly Created WARNING Collection',
            tone: 'rose',
          },
          {
            storyTerm: 'Triggering the Incinerator',
            technicalTerm: 'Destructive dropDatabase Command (Audit Action atype: dropDatabase)',
            tone: 'sky',
          },
          {
            storyTerm: 'Forensic Recovery Proof',
            technicalTerm: 'MongoDB Audit Telemetry & Immutable Offsite Snapshot Recovery',
            tone: 'emerald',
          },
        ],
      },
    },
  };
