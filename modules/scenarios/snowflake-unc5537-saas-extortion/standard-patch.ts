import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a massive cloud data warehouse where hundreds of companies store customer archives behind a front door that still relies solely on static passwords without pocket codes. Using passwords scooped earlier from home computers, an intruder drives up through anonymous rental vans, sends a fast automated catalog robot down every aisle to locate the richest vaults, and stages giant customer tables into personal loading bays before hauling them away with a standard database viewer.',
      storyMappings: [
        {
          storyTerm: 'Passwords scooped from home computers used at a single-lock front door',
          technicalTerm: 'Infostealer credential replay against single-factor Snowflake accounts lacking MFA',
          tone: 'amber',
        },
        {
          storyTerm: 'Fast automated catalog robot scanning every aisle',
          technicalTerm: 'FROSTBITE (Rapeflake) utility rapidly enumerating Snowflake schemas and roles',
          tone: 'sky',
        },
        {
          storyTerm: 'Staging giant customer tables into personal loading bays',
          technicalTerm: 'SQL COPY INTO @~ staging multi-gigabyte tables into user internal stages',
          tone: 'rose',
        },
        {
          storyTerm: 'Hauling archives away with a standard database viewer',
          technicalTerm: 'Bulk GET downloads through DBeaver Ultimate for mass extortion',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Arriving through masked commercial relay vans, the intruder tests a stack of stolen employee passwords harvested months earlier from infected personal laptops against cloud warehouse accounts that never required a second pocket-code lock.',
        storyMappings: [
          {
            storyTerm: 'Masked commercial relay vans',
            technicalTerm: 'Mullvad VPN and commercial anonymizer exit IPs masking UNC5537 origin',
            tone: 'amber',
          },
          {
            storyTerm: 'Stolen employee passwords from infected laptops',
            technicalTerm: 'Infostealer-harvested credentials replayed across enterprise Snowflake tenants',
            tone: 'sky',
          },
          {
            storyTerm: 'Front door lacking a second pocket-code lock',
            technicalTerm: 'FIRST_AUTHENTICATION_FACTOR = PASSWORD with SECOND_AUTHENTICATION_FACTOR IS NULL',
            tone: 'rose',
          },
          {
            storyTerm: 'Warehouse front-desk sign-in ledger',
            technicalTerm: 'SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY recording single-factor external logins',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Query SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY (the warehouse immutable sign-in audit table) for sessions where FIRST_AUTHENTICATION_FACTOR = PASSWORD and SECOND_AUTHENTICATION_FACTOR IS NULL originating from Mullvad VPN or commercial proxy IP ranges (pinpointing UNC5537 single-factor credential replay).',
      },
      2: {
        storyAnalogy:
          'Once past the front turnstile, the intruder releases a custom high-speed inventory scout that races through every warehouse aisle, listing all databases, privileges, and billing tables in seconds while leaving its distinct maker stamp in the visitor log.',
        storyMappings: [
          {
            storyTerm: 'Custom high-speed inventory scout',
            technicalTerm: 'FROSTBITE (Rapeflake) automated Snowflake reconnaissance utility',
            tone: 'amber',
          },
          {
            storyTerm: 'Listing every aisle, privilege, and billing table',
            technicalTerm: 'Rapid schema, role, and high-value table enumeration across customer databases',
            tone: 'sky',
          },
          {
            storyTerm: 'Distinct maker stamp left in the visitor log',
            technicalTerm: 'CLIENT_ENVIRONMENT JSON containing "APPLICATION": "Rapeflake" or "DBeaver_DBeaverUltimate"',
            tone: 'rose',
          },
          {
            storyTerm: 'Warehouse session register',
            technicalTerm: 'SNOWFLAKE.ACCOUNT_USAGE.SESSIONS tracking client tool metadata',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Inspect CLIENT_ENVIRONMENT metadata inside SNOWFLAKE.ACCOUNT_USAGE.SESSIONS (which records exact client software identifiers for every authenticated connection) for "APPLICATION": "Rapeflake" or "DBeaver_DBeaverUltimate" (high-confidence UNC5537 tooling signatures).',
      },
      3: {
        storyAnalogy:
          'Selecting the richest customer vaults, the intruder orders the warehouse own bulk forklift to pack entire archives onto their personal loading platform and then downloads the multi-gigabyte crates straight through an ordinary desktop query app.',
        storyMappings: [
          {
            storyTerm: 'Warehouse own bulk forklift packing archives',
            technicalTerm: 'SQL COPY INTO @~ exporting full production tables into the user internal stage',
            tone: 'amber',
          },
          {
            storyTerm: 'Personal loading platform',
            technicalTerm: 'Snowflake per-user internal stage (@~) holding compressed CSV/Parquet dumps',
            tone: 'sky',
          },
          {
            storyTerm: 'Ordinary desktop query app hauling crates out',
            technicalTerm: 'SQL GET commands executed via DBeaver Ultimate pulling staged files externally',
            tone: 'rose',
          },
          {
            storyTerm: 'Loading-dock scale flagging massive outbound weight',
            technicalTerm: 'QUERY_HISTORY showing QUERY_TYPE IN (COPY, GET) with massive BYTES_WRITTEN_TO_RESULT',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY (which logs every executed SQL statement and data volume) where QUERY_TYPE IN (COPY, GET) exhibits anomalous spikes in BYTES_WRITTEN_TO_RESULT from DBeaver_DBeaverUltimate sessions (catching bulk data staging and exfiltration).',
      },
    },
  };
