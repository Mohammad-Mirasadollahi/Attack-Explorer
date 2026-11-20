import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
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
  };
