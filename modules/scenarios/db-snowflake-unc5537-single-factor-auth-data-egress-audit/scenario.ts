import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'db-snowflake-unc5537-single-factor-auth-data-egress-audit',
    title: 'Mandiant & Snowflake Joint Report (UNC5537), CISA & MITRE T1530 — Snowflake Single-Factor Session & QUERY_HISTORY Egress Forensics',
    category: 'DATABASE_DATA_PLATFORMS',
    mitreId: 'T1078.004',
    description:
      'Grounded in the joint Mandiant and Snowflake incident response guide for UNC5537 ("frostea" / Rapeflake), CISA cloud database security guidance, and MITRE ATT&CK T1078.004 / T1530: cloud data platform responders query SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY and SESSIONS for single-factor password logins from non-corporate IPs, inspect client application identifiers, and audit QUERY_HISTORY for bulk COPY INTO stage exports.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External SQL Client (DBeaver)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Snowflake Network Policy Gate', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Snowflake Virtual Warehouse', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'ACCOUNT_USAGE Audit & SIEM', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Customer PII Tables & Internal Stage', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Single-Factor Password Authentication in ACCOUNT_USAGE.LOGIN_HISTORY',
        narration:
          'Using historical credentials harvested from an infostealer infection on a contractor workstation, an external client authenticates to a Snowflake tenant account that lacks a Network Policy IP allowlist and has not enforced multi-factor authentication (SECOND_AUTHENTICATION_FACTOR = NULL in LOGIN_HISTORY).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1078.004 - Valid Accounts: Cloud Accounts)',
        technicalCommands: [
          'SELECT EVENT_TIMESTAMP, USER_NAME, CLIENT_IP, REPORTED_CLIENT_TYPE, FIRST_AUTHENTICATION_FACTOR, SECOND_AUTHENTICATION_FACTOR FROM SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY WHERE IS_SUCCESS = \'YES\' AND SECOND_AUTHENTICATION_FACTOR IS NULL;',
        ],
        defenseMitigation:
          'Enforce Snowflake Authentication Policies requiring MFA or OAuth/SAML SSO for all human users, mandate RSA key-pair or OAuth Workload Identity for service accounts (TYPE = SERVICE), and attach account-level and user-level Network Policies.',
        logs: [
          {
            id: 'db-snowflake-1',
            timestamp: '01:22:14.502',
            source: 'CloudTrail',
            severity: 'high',
            EventCode: 1001,
            ProcessName: 'snowflake-authn',
            CommandLine: 'LOGIN_HISTORY user=SVC_BI_ANALYTICS first_factor=PASSWORD second_factor=NULL client=JDBC_DRIVER',
            raw: 'snowflake_login_history: {"EVENT_ID":9481024,"USER_NAME":"SVC_BI_ANALYTICS","CLIENT_IP":"198.51.100.214","REPORTED_CLIENT_TYPE":"JDBC_DRIVER","REPORTED_CLIENT_VERSION":"3.14.4","FIRST_AUTHENTICATION_FACTOR":"PASSWORD","SECOND_AUTHENTICATION_FACTOR":null,"IS_SUCCESS":"YES"}',
            parsedFields: {
              AuditView: 'SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY & SESSIONS',
              AuthenticationFactors: 'FIRST_AUTHENTICATION_FACTOR=PASSWORD, SECOND_AUTHENTICATION_FACTOR=NULL',
              ClientApplication: 'DBeaver_DBeaverUltimate / JDBC_DRIVER 3.14.4 from 198.51.100.214',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Schema Discovery & Privilege Enumeration in ACCOUNT_USAGE.QUERY_HISTORY',
        narration:
          'Once authenticated, the session executes automated discovery queries (SHOW GRANTS TO USER, SHOW DATABASES, SHOW SCHEMAS, and SELECT * FROM INFORMATION_SCHEMA.TABLES) recorded in SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY with SESSION_ID linkage.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Discovery (T1087.004 - Account Discovery: Cloud Account)',
        technicalCommands: [
          'SELECT QUERY_ID, USER_NAME, ROLE_NAME, QUERY_TYPE, QUERY_TEXT, ROWS_PRODUCED FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE SESSION_ID = 884120994102 ORDER BY START_TIME;',
        ],
        defenseMitigation:
          'Stream SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY and SESSIONS into the enterprise SIEM and alert on non-scheduled SHOW GRANTS / INFORMATION_SCHEMA enumeration from interactive SQL clients (DBeaver, Rapeflake, SnowSQL).',
        logs: [
          {
            id: 'db-snowflake-2',
            timestamp: '01:23:05.819',
            source: 'CloudTrail',
            severity: 'high',
            EventCode: 1002,
            ProcessName: 'snowflake-sql',
            CommandLine: 'SHOW GRANTS TO USER SVC_BI_ANALYTICS; SELECT TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, ROW_COUNT, BYTES FROM INFORMATION_SCHEMA.TABLES;',
            raw: 'snowflake_query_history: {"QUERY_ID":"01b84f10-0002-91a4-0000-44810029a10e","SESSION_ID":884120994102,"USER_NAME":"SVC_BI_ANALYTICS","ROLE_NAME":"ACCOUNTADMIN","QUERY_TYPE":"SHOW","EXECUTION_STATUS":"SUCCESS"}',
            parsedFields: {
              ActiveRole: 'ACCOUNTADMIN (Over-Privileged Legacy Service Account)',
              DiscoveryQueries: 'SHOW GRANTS TO USER; SHOW TERSE DATABASES; INFORMATION_SCHEMA.TABLES',
              SessionId: '884120994102',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Bulk Table Staging via COPY INTO @~ & GET File Egress Forensics',
        narration:
          'To compress and export high-row-count tables rapidly, the session executes COPY INTO @~/export_stage/ FROM PROD_DB.PUBLIC.CUSTOMER_RECORDS FILE_FORMAT=(TYPE=CSV COMPRESSION=GZIP) followed by GET @~/export_stage/ file:///tmp/, logging large BYTES_WRITTEN_TO_RESULT and DATA_TRANSFER_HISTORY anomalies.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1530 - Data from Cloud Storage)',
        technicalCommands: [
          'SELECT QUERY_ID, USER_NAME, QUERY_TEXT, ROWS_UNLOADED, BYTES_WRITTEN_TO_RESULT FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE QUERY_TYPE IN (\'UNLOAD\', \'GET_FILES\') AND START_TIME >= DATEADD(day, -7, CURRENT_TIMESTAMP());',
        ],
        defenseMitigation:
          'Restrict CREATE STAGE and user stage (@~) unload operations using least-privilege RBAC roles, configure STORAGE_INTEGRATION allowed locations, and immediately rotate credentials and terminate active sessions via SYSTEM$ABORT_SESSION.',
        logs: [
          {
            id: 'db-snowflake-3',
            timestamp: '01:26:49.330',
            source: 'CloudTrail',
            severity: 'critical',
            EventCode: 1003,
            ProcessName: 'snowflake-sql',
            CommandLine: 'COPY INTO @~/staging_dump/customers.csv.gz FROM PROD_DB.PUBLIC.CUSTOMER_RECORDS FILE_FORMAT=(TYPE=CSV COMPRESSION=GZIP);',
            raw: 'snowflake_query_history: {"QUERY_ID":"01b84f12-0002-91a4-0000-44810029b412","SESSION_ID":884120994102,"QUERY_TYPE":"UNLOAD","ROWS_UNLOADED":4820190,"BYTES_SCANNED":1948201984,"EXECUTION_STATUS":"SUCCESS"}',
            parsedFields: {
              QueryType: 'UNLOAD (COPY INTO @~ User Stage) followed by GET_FILES',
              RowsUnloaded: '4,820,190 rows (~1.94 GB scanned)',
              IncidentResponseAction: 'ALTER USER SVC_BI_ANALYTICS SET DISABLED = TRUE; SELECT SYSTEM$ABORT_SESSION(884120994102);',
            },
          },
        ],
      },
    ],
  };
