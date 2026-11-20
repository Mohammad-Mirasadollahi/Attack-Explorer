import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
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
  };
