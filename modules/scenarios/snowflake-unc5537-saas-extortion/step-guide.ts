import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'snowflake-unc5537-saas-extortion',
    briefing: {
      headline: 'Scenario Briefing: UNC5537 Snowflake Extortion Campaign, Infostealer Credential Replay & FROSTBITE (Rapeflake) Staging',
      storyAnalogy:
        'Imagine a high-security cloud storage facility (Snowflake) where the vault doors themselves are unbreakable, but several corporate tenants told the front desk: "Let our contractors walk in with just a written password, don’t ask them for a second security badge (MFA = NULL) or check what taxi (IP Network Policy) they arrived in." A thief (UNC5537) buys old boxes of stolen home-computer diaries (Lumma / RedLine / Vidar infostealer logs), searches those diaries for the word snowflakecomputing.com, walks right through the front door with a high-speed robotic inventory scanner (FROSTBITE / Rapeflake), packs gigabytes of customer ledgers into zip bags (COPY INTO @~), and carries them out.',
      plainSummary:
        'In this scenario (T1078.004, Mandiant & Snowflake - UNC5537 Campaign: Infostealer Credential Replay & FROSTBITE (Rapeflake) Exfiltration), the attacker follows one continuous arc: replaying Infostealer-Harvested Credentials Against, then running the FROSTBITE Utility for Rapid Schema, then staging Multi-GB Tables via COPY INTO @~. Steps #1–#3 examine #1 Replaying Infostealer-Harvested Credentials Against; #2 Running the FROSTBITE Utility for Rapid Schema; #3 Staging Multi-GB Tables via COPY INTO @~. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates process, authentication, and network telemetry for T1078.004 across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UNC5537 Mullvad VPN Operator), follow the single-factor password login into Node ②/③ (Snowflake Cloud Auth Gateway), trace the automated SHOW TABLES discovery inside Node ④ (FROSTBITE / Rapeflake), and watch bulk COPY INTO staging and GET exfiltration from Node ⑤ (Snowflake Warehouse) monitored by Node ⑥ (ACCOUNT_USAGE SIEM).',
      documentedAdvisory: 'Mandiant UNC5537 Joint Report · Snowflake Security Advisory · CISA Alert (June 2024) · MITRE T1078.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1078.004',
        plainTitle: 'Replaying Infostealer-Harvested Credentials Against Single-Factor Snowflake Accounts (T1078.004)',
        storyAnalogy:
          'Instead of picking the vault lock, the intruder searches old stolen notebooks (RedLine / Lumma stealer logs) for saved *.snowflakecomputing.com passwords and walks straight into any tenant that forgot to require a second badge (MFA).',
        simpleExplanation:
          'UNC5537 searches millions of historical infostealer malware logs (harvested by RedLine, Vidar, and LummaC2 from contractor laptops infected months or years earlier) for URLs matching *.snowflakecomputing.com, and replays those plaintext credentials from Mullvad VPN exit nodes (198.51.100.44) against the customer’s Snowflake login API (which succeeds whenever the target account has SECOND_AUTHENTICATION_FACTOR = NULL and no Snowflake Network Policy restricting logins to corporate IP ranges).',
        howItWorksInPractice:
          'Because service accounts like SVC_TABLEAU_ETL were frequently configured with static passwords and exempted from MFA to support legacy BI pipelines, possessing a single unrotated password gave UNC5537 immediate ACCOUNTADMIN or SYSADMIN access. In the documented SNOWFLAKE LOGIN_HISTORY exchange from UNC5537 Extortion Operator to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with RESP EVENT_ID 8841920 (confirming that the SINGLE_FACTOR_LOGIN_SUCCESS request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 FROSTBITE (RAPEFLAKE) AUTOMATED SCHEMA RECONNAISSANCE).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (UNC5537 Operator) to Node ②/③ (Snowflake Cloud Auth Gateway), and return arrow ⇠#1 issuing the authenticated session token.',
        detectionAndEvidence:
          'Query SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY (the warehouse immutable sign-in audit table) for sessions where FIRST_AUTHENTICATION_FACTOR = PASSWORD and SECOND_AUTHENTICATION_FACTOR IS NULL originating from Mullvad VPN or commercial proxy IP ranges (pinpointing UNC5537 single-factor credential replay). Correlate Sysmon or Windows Security Event telemetry for T1078.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1087.004',
        plainTitle: 'Running the FROSTBITE (Rapeflake) Utility for Rapid Schema & Role Reconnaissance (T1087.004)',
        storyAnalogy:
          'Once inside the lobby, the thief switches on a custom barcode scanner (FROSTBITE / Rapeflake) that races down every aisle in 2 seconds, printing a list of which vaults hold millions of customer records.',
        simpleExplanation:
          'Immediately after authenticating, the operator runs a custom .NET reconnaissance tool tracked by Mandiant as FROSTBITE (which identifies itself in Snowflake’s CLIENT_APPLICATION_ID telemetry under its internal build name "Rapeflake") to automatically execute SHOW DATABASES, SHOW USERS, SHOW ROLES, and SELECT * FROM INFORMATION_SCHEMA.TABLES (allowing the attacker to instantly score and prioritize customer tenants that hold hundreds of millions of PII or payment rows).',
        howItWorksInPractice:
          'Every SQL query and client driver string in Snowflake is immutably recorded in SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY and SESSIONS, exposing the literal "Rapeflake" and "DBeaver_DBeaverUltimate" application strings. In the documented SNOWFLAKE QUERY_HISTORY exchange from Perimeter Firewall & NDR Tap to Snowflake Cloud Auth Gateway, Snowflake Cloud Auth Gateway responds with ALERT ROWS_PRODUCED 412 (confirming that the RAPEFLAKE_SCHEMA_RECON request succeeded on Snowflake Cloud Auth Gateway and establishing the runtime state required for Step #3 DBEAVER ULTIMATE BULK STAGE & MULTI-GB EXFILTRATION).',
        diagramAlignment:
          'On the diagram, arrow #2→ dispatches the automated metadata discovery burst inside Node ④ (FROSTBITE / Rapeflake), and ⇠#2 returns the high-value table catalog.',
        detectionAndEvidence:
          'Inspect CLIENT_ENVIRONMENT metadata inside SNOWFLAKE.ACCOUNT_USAGE.SESSIONS (which records exact client software identifiers for every authenticated connection) for "APPLICATION": "Rapeflake" or "DBeaver_DBeaverUltimate" (high-confidence UNC5537 tooling signatures). Correlate Sysmon or Windows Security Event telemetry for T1087.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1530',
        plainTitle: 'Staging Multi-GB Tables via COPY INTO @~ & Downloading with DBeaver Ultimate (T1530)',
        storyAnalogy:
          'Using a commercial database mover’s dolly (DBeaver Ultimate), the thief compresses the giant customer tables into GZip bundles on a loading dock (COPY INTO @~) and wheels them out over HTTPS.',
        simpleExplanation:
          'To extract tens of millions of rows without timing out, the operator connects via DBeaver Ultimate (using the official Snowflake JDBC driver) and executes COPY INTO @~/dump/customers.csv.gz FROM PROD_DB.PUBLIC.CUSTOMERS (compressing the entire table into GZip CSV chunks inside the user’s personal internal Snowflake stage @~ so they can be rapidly downloaded with the GET command over HTTPS).',
        howItWorksInPractice:
          'Staging data into an internal user stage (@~) or temporary stage via COPY INTO leverages Snowflake’s parallel virtual warehouse compute to dump gigabytes of records in seconds. In the documented SNOWFLAKE COPY_INTO exchange from Snowflake Cloud Auth Gateway to FROSTBITE (Rapeflake) Recon Engine, FROSTBITE (Rapeflake) Recon Engine responds with RESP BYTES_WRITTEN 4.8 GB (confirming that the BULK_STAGE_EXFILTRATION request succeeded on FROSTBITE (Rapeflake) Recon Engine and completing the final execution objective of Mandiant & Snowflake, UNC5537 Campaign: Infostealer Credential Replay & FROSTBITE (Rapeflake) Exfiltration).',
        diagramAlignment:
          'On the diagram, arrow #3→ executes COPY INTO @~ and GET against Node ⑤ (Snowflake Virtual Warehouse) while Node ⑥ (SIEM) flags the anomalous multi-gigabyte export.',
        detectionAndEvidence:
          'Alert on SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY (which logs every executed SQL statement and data volume) where QUERY_TYPE IN (COPY, GET) exhibits anomalous spikes in BYTES_WRITTEN_TO_RESULT from DBeaver_DBeaverUltimate sessions (catching bulk data staging and exfiltration). Correlate Sysmon or Windows Security Event telemetry for T1530 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
