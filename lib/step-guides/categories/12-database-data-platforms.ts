import type { CategoryStandardPatchMap } from './types';

export const DATABASE_DATA_PLATFORMS_PATCHES: CategoryStandardPatchMap = {
  'db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094': {
    briefing: {
      storyAnalogy:
        'Imagine a high-security bank teller window where a clerk encloses every customer note inside protective wax seals so nobody can sneak an order onto the manager’s desk. A trickster slips a malformed foreign character right beside the closing wax seal so the clerk accidentally swallows the seal itself, letting the rest of the sentence spill straight onto the manager’s command sheet and instruct the basement boiler operator to run raw building commands.',
      storyMappings: [
        {
          storyTerm: 'Protective Wax Seal Clerk',
          technicalTerm: 'libpq Escaping Routines (PQescapeStringConn / PQescapeLiteral)',
          tone: 'sky',
        },
        {
          storyTerm: 'Malformed Foreign Character',
          technicalTerm: 'Invalid Multi-Byte UTF-8 Sequence (0xC0 0x27 · CVE-2025-1094)',
          tone: 'rose',
        },
        {
          storyTerm: 'Manager’s Command Sheet',
          technicalTerm: 'Interactive psql ! Meta-Command Shell Escape & Stacked SQL',
          tone: 'amber',
        },
        {
          storyTerm: 'Basement Boiler Operator Command',
          technicalTerm: 'Superuser COPY ... FROM PROGRAM Spawning /bin/sh (pgAudit Logged)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the front counter, the trickster hands the teller a customer note containing a broken multi-byte symbol pressed tightly against a closing quotation mark, tricking the wax-seal machine into gluing the quote shut inside the broken symbol instead of sealing the boundary.',
        storyMappings: [
          {
            storyTerm: 'Wax-Seal Machine',
            technicalTerm: 'libpq PQescapeStringConn() & PQescapeLiteral() Client Escaping',
            tone: 'sky',
          },
          {
            storyTerm: 'Broken Multi-Byte Symbol',
            technicalTerm: 'Invalid UTF-8 Trailing Byte Sequence (0xC0 0x27 · CVE-2025-1094)',
            tone: 'rose',
          },
          {
            storyTerm: 'Swallowed Closing Quote',
            technicalTerm: 'Single-Quote Boundary Consumed by Escaping Mismatch',
            tone: 'amber',
          },
          {
            storyTerm: 'Counter Security Audit',
            technicalTerm: 'Parameterized Queries ($1, $2) & Patched libpq Validation',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Because the wax seal never closed properly, the remainder of the trickster’s message spills straight into the interactive clerk’s console, where a single exclamation-mark shortcut instructs the desk clerk to step outside the counter and run an unguarded hallway command.',
        storyMappings: [
          {
            storyTerm: 'Interactive Clerk Console',
            technicalTerm: 'Interactive psql Batch Pipeline Processing Escaped SQL',
            tone: 'sky',
          },
          {
            storyTerm: 'Exclamation-Mark Shortcut',
            technicalTerm: 'psql ! Meta-Command Spawning /bin/sh as Client OS User',
            tone: 'rose',
          },
          {
            storyTerm: 'Spilled Message Instructions',
            technicalTerm: 'Stacked SQL Statements Escaping Single-Quoted String Literal',
            tone: 'amber',
          },
          {
            storyTerm: 'Hallway Process Monitor',
            technicalTerm: 'Linux auditd Capturing psql Spawning /bin/sh Subprocess',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Inside the vault room itself, if the session holds master custodian clearance, the spilled order invokes the vault’s built-in bulk-import chute wired directly to an external tool, launching a raw system shell while the vault’s permanent ledger stamps every line.',
        storyMappings: [
          {
            storyTerm: 'Master Custodian Clearance',
            technicalTerm: 'PostgreSQL Superuser or pg_execute_server_program Role',
            tone: 'amber',
          },
          {
            storyTerm: 'Built-In Bulk-Import Chute',
            technicalTerm: 'COPY cmd_out FROM PROGRAM Executing /bin/sh as postgres User',
            tone: 'rose',
          },
          {
            storyTerm: 'Vault Room Engine',
            technicalTerm: 'PostgreSQL Server Process Hosting Privileged Execution',
            tone: 'sky',
          },
          {
            storyTerm: 'Permanent Vault Ledger',
            technicalTerm: 'pgAudit DDL/MISC Logging & Linux auditd execve Telemetry',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'db-redis-lua-sandbox-debian-liblua-cve-2022-0543': {
    briefing: {
      storyAnalogy:
        'Imagine an express luggage locker room where visitors can run tiny pocket calculators inside a locked glass box that has all phone and door keys stripped away. On one city’s custom build of that locker room, the installer accidentally left a master supply-closet catalog sitting inside the glass box, letting an uninvited guest reach out, pull a full power-tool kit back through the glass, and open a direct backdoor onto the station floor.',
      storyMappings: [
        {
          storyTerm: 'Express Luggage Locker Room',
          technicalTerm: 'Exposed Redis Cache Engine Listening on TCP Port 6379',
          tone: 'sky',
        },
        {
          storyTerm: 'Locked Calculator Glass Box',
          technicalTerm: 'Redis EVAL Lua Script Sandbox (Stripped os & io Globals)',
          tone: 'amber',
        },
        {
          storyTerm: 'Master Supply-Closet Catalog',
          technicalTerm: 'Debian/Ubuntu Exposed Lua package.loadlib (CVE-2022-0543)',
          tone: 'rose',
        },
        {
          storyTerm: 'Station Floor Security Camera',
          technicalTerm: 'Linux auditd sys_execve (59) Catching redis-server Spawning /bin/sh',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking up to an unlocked luggage locker counter with no attendant or password sign, the intruder taps the lobby directory button to read the building’s exact builder plaque and confirm which city’s custom locker edition is installed.',
        storyMappings: [
          {
            storyTerm: 'Unlocked Luggage Counter',
            technicalTerm: 'redis-server Bound to 0.0.0.0:6379 Without requirepass / protected-mode',
            tone: 'amber',
          },
          {
            storyTerm: 'Lobby Directory Button',
            technicalTerm: 'Unauthenticated INFO server Command Over TCP Port 6379',
            tone: 'rose',
          },
          {
            storyTerm: 'Builder Plaque Details',
            technicalTerm: 'Returned os:Linux Debian/Ubuntu Banner & Redis Build Version',
            tone: 'sky',
          },
          {
            storyTerm: 'Locker Access Firewall',
            technicalTerm: 'Loopback Bind (127.0.0.1), ACL Auth & SSRF Egress Controls',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Confirming the vulnerable city build, the intruder slips a short calculation slip into the glass box that opens the forgotten supply-closet catalog, reaches straight into the building’s shared tool library, and pulls the forbidden file-and-command toolkit back inside the box.',
        storyMappings: [
          {
            storyTerm: 'Short Calculation Slip',
            technicalTerm: 'Redis EVAL Lua Script Invoking Global package.loadlib',
            tone: 'rose',
          },
          {
            storyTerm: 'Forgotten Supply-Closet Catalog',
            technicalTerm: 'Unstripped Global package Table in Debian/Ubuntu Package (DSA-5081)',
            tone: 'amber',
          },
          {
            storyTerm: 'Building Shared Tool Library',
            technicalTerm: '/usr/lib/x86_64-linux-gnu/liblua5.1.so.0 Loading luaopen_io',
            tone: 'sky',
          },
          {
            storyTerm: 'Sandbox Integrity Guard',
            technicalTerm: 'Upgrading Patched Redis & Blocking Untrusted EVAL Commands',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Now holding the forbidden command toolkit inside the glass box, the intruder punches straight through the back wall to start a live maintenance shell under the locker attendant’s badge, immediately tripping the station’s hallway camera that knows a luggage clerk should never launch a shell.',
        storyMappings: [
          {
            storyTerm: 'Punching Through Back Wall',
            technicalTerm: 'Calling io.popen() Inside Redis Lua Runtime to Spawn /bin/sh',
            tone: 'rose',
          },
          {
            storyTerm: 'Locker Attendant Badge',
            technicalTerm: 'Child Process Running Under redis Service OS Account',
            tone: 'amber',
          },
          {
            storyTerm: 'Station Hallway Camera',
            technicalTerm: 'Linux auditd SYSCALL execve (59) on Parent /usr/bin/redis-server',
            tone: 'sky',
          },
          {
            storyTerm: 'High-Confidence Alarm',
            technicalTerm: 'EDR / Falco Alert on Cache Daemon Spawning Interactive Shell',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine a chain of corporate record rooms connected by internal brass pneumatic tubes that automatically stamp every parcel with chief-archivist clearance at the far end. An intruder inspects the directory to spot which pneumatic tubes carry top clearance, flips two restricted control switches on the remote room’s wall to unlock its maintenance hatch, and loads a custom mechanical helper directly into the record ledger without ever leaving a physical tool box on the floor.',
      storyMappings: [
        {
          storyTerm: 'Internal Brass Pneumatic Tubes',
          technicalTerm: 'MSSQL Linked Servers Configured with is_rpc_out_enabled = 1',
          tone: 'sky',
        },
        {
          storyTerm: 'Flipping Restricted Wall Switches',
          technicalTerm: 'sp_configure Enabling xp_cmdshell & clr enabled (EventID 15457)',
          tone: 'amber',
        },
        {
          storyTerm: 'Mechanical Helper Inside Ledger',
          technicalTerm: 'CREATE ASSEMBLY FROM 0x4D5A... WITH PERMISSION_SET = UNSAFE',
          tone: 'rose',
        },
        {
          storyTerm: 'Record Room Audit Bell',
          technicalTerm: 'SQL Audit Event 33205, Application EventID 15457 & sys.assembly_files',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Once inside the first record room, the intruder opens the wall directory of pneumatic tubes to see which outbound chutes are switched open and automatically map incoming notes to a chief-archivist badge on the neighboring server.',
        storyMappings: [
          {
            storyTerm: 'Wall Directory of Tubes',
            technicalTerm: 'Querying sys.servers & sys.linked_logins Catalog Views',
            tone: 'sky',
          },
          {
            storyTerm: 'Open Outbound Chute',
            technicalTerm: 'Linked Server Flag is_rpc_out_enabled = 1 (EXEC AT / OPENQUERY)',
            tone: 'amber',
          },
          {
            storyTerm: 'Chief-Archivist Remote Badge',
            technicalTerm: 'Mapped Remote sysadmin Login Context on Linked Instance',
            tone: 'rose',
          },
          {
            storyTerm: 'Directory Inspection Log',
            technicalTerm: 'SQL Server Audit Event 33205 Recording Linked Server Enumeration',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Sending an order down the trusted chute, the intruder flips the remote room’s red safety covers to enable both the direct maintenance hatch and custom extension modules, causing the building’s master switchboard to stamp an unerasable before-and-after receipt.',
        storyMappings: [
          {
            storyTerm: 'Flipping Red Safety Covers',
            technicalTerm: 'Executing sp_configure for show advanced options, xp_cmdshell & clr enabled',
            tone: 'rose',
          },
          {
            storyTerm: 'Direct Maintenance Hatch',
            technicalTerm: 'xp_cmdshell Extended Stored Procedure Allowing OS Shell Commands',
            tone: 'amber',
          },
          {
            storyTerm: 'Master Switchboard Receipt',
            technicalTerm: 'Windows Application EventID 15457 Logging Old vs New Config Values',
            tone: 'sky',
          },
          {
            storyTerm: 'Configuration Hardening Guard',
            technicalTerm: 'SIEM Alert on EventID 15457 & Disabling clr strict security Bypasses',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Rather than setting a noisy metal toolbox down on the tiled floor where floor guards would trip over it, the intruder encodes a custom mechanical worker as raw ink digits and pastes it straight into the record room’s permanent binding cabinet with unrestricted privileges.',
        storyMappings: [
          {
            storyTerm: 'Raw Ink Digits in Cabinet',
            technicalTerm: 'CREATE ASSEMBLY FROM 0x4D5A... Embedded Directly in sys.assembly_files',
            tone: 'rose',
          },
          {
            storyTerm: 'Unrestricted Worker Clearance',
            technicalTerm: 'PERMISSION_SET = UNSAFE Allowing Unmanaged Code Execution',
            tone: 'amber',
          },
          {
            storyTerm: 'Avoiding Tiled Floor Footprint',
            technicalTerm: 'Fileless .NET Stored Procedure Persistence Without Dropping a DLL',
            tone: 'sky',
          },
          {
            storyTerm: 'Binding Cabinet Audit',
            technicalTerm: 'Auditing sys.assemblies & sys.assembly_files for Unsigned PE Blobs',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'db-snowflake-unc5537-single-factor-auth-data-egress-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a massive cloud archive warehouse where a contractor’s stolen single-key password still unlocks the front door because neither a second approval buzzer nor an approved-visitor street list was turned on. Walking straight inside from an unfamiliar address, the intruder prints out the master floor map of every filing aisle, packs millions of customer records into compressed shipping crates in a private staging bay, and wheels the crates right out the loading dock.',
      storyMappings: [
        {
          storyTerm: 'Stolen Single-Key Contractor Password',
          technicalTerm: 'Infostealer Credentials with SECOND_AUTHENTICATION_FACTOR = NULL',
          tone: 'rose',
        },
        {
          storyTerm: 'Missing Approved-Visitor Street List',
          technicalTerm: 'Absent Snowflake Network Policy IP Allowlist in LOGIN_HISTORY',
          tone: 'amber',
        },
        {
          storyTerm: 'Printing Master Floor Map',
          technicalTerm: 'SHOW GRANTS, SHOW DATABASES & INFORMATION_SCHEMA in QUERY_HISTORY',
          tone: 'sky',
        },
        {
          storyTerm: 'Compressed Staging Bay Crates',
          technicalTerm: 'COPY INTO @~/export_stage/ (GZIP CSV) & GET Bulk Data Egress',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using an old key copied months earlier from a contractor’s compromised workstation, an outsider walks up to the archive warehouse from an unknown street address and unlocks the front gate with a single password because no second verification chime or neighborhood gate list stops them.',
        storyMappings: [
          {
            storyTerm: 'Old Copied Contractor Key',
            technicalTerm: 'Historical Infostealer-Harvested Snowflake Password Credentials',
            tone: 'rose',
          },
          {
            storyTerm: 'No Second Verification Chime',
            technicalTerm: 'Single-Factor Login (MFA Not Enforced on Service/Contractor Account)',
            tone: 'amber',
          },
          {
            storyTerm: 'Unknown Street Address',
            technicalTerm: 'Non-Corporate External IP Missing Network Policy Allowlist',
            tone: 'sky',
          },
          {
            storyTerm: 'Front Gate Entry Ledger',
            technicalTerm: 'SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY & SESSIONS Audit Views',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Inside the archive warehouse, the intruder runs an automated clipboard sweep across every hall, listing which master roles their key holds, which vaults exist on each floor, and which filing cabinets contain the highest-value customer ledgers.',
        storyMappings: [
          {
            storyTerm: 'Automated Clipboard Sweep',
            technicalTerm: 'Scripted Discovery Queries Linked Under One SESSION_ID',
            tone: 'amber',
          },
          {
            storyTerm: 'Listing Master Key Roles',
            technicalTerm: 'SHOW GRANTS TO USER & SHOW DATABASES / SHOW SCHEMAS',
            tone: 'rose',
          },
          {
            storyTerm: 'Locating Customer Cabinets',
            technicalTerm: 'SELECT * FROM INFORMATION_SCHEMA.TABLES Metadata Enumeration',
            tone: 'sky',
          },
          {
            storyTerm: 'Warehouse Activity Log',
            technicalTerm: 'SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY Session Correlation',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Instead of carrying folders out one by one, the intruder dumps entire customer aisles into compressed bundles inside their personal staging closet and hauls the packed bundles straight out the exit ramp, leaving giant weight spikes on the warehouse shipping scale.',
        storyMappings: [
          {
            storyTerm: 'Personal Staging Closet',
            technicalTerm: 'User Internal Stage (@~/export_stage/) Staged via COPY INTO',
            tone: 'sky',
          },
          {
            storyTerm: 'Compressing Customer Aisles',
            technicalTerm: 'COPY INTO ... FILE_FORMAT=(TYPE=CSV COMPRESSION=GZIP)',
            tone: 'amber',
          },
          {
            storyTerm: 'Hauling Bundles Out Exit Ramp',
            technicalTerm: 'GET @~/export_stage/ file:///tmp/ Bulk Download Command',
            tone: 'rose',
          },
          {
            storyTerm: 'Warehouse Shipping Scale Spike',
            technicalTerm: 'Anomalous BYTES_WRITTEN_TO_RESULT & External Egress Audit Alerts',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'db-mongodb-mongobleed-unauthenticated-replication-oplog-audit': {
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
  },
};
