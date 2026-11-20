import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: 'snowflake-unc5537-saas-extortion',
  code: 'T1078.004',
  name: 'Mandiant & Snowflake — UNC5537 Campaign: Infostealer Credential Replay & FROSTBITE (Rapeflake) Exfiltration',
  shortSubtitle: 'Mandiant · Snowflake · CISA · Infostealer Logs · Missing MFA · Rapeflake / DBeaver Bulk SQL Staging',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Investigated by Mandiant, Snowflake, and CISA (June 2024), UNC5537 systematically compromised over 165 enterprise Snowflake customer tenants without breaching Snowflake’s core infrastructure. The threat actors harvested plaintext corporate Snowflake credentials from historical infostealer malware logs (Lumma, RedLine, Vidar, Raccoon) on contractor laptops, logged straight into single-factor customer accounts lacking MFA or network allowlists, ran the custom FROSTBITE ("Rapeflake") and DBeaver Ultimate tools to enumerate databases, and staged massive SQL tables to external storage for extortion.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Mandiant UNC5537 Threat Report · Snowflake Joint Security Advisory · CISA Alert (June 2024)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1078.004 (Cloud Accounts) · T1087.004 (Cloud Account Discovery) · T1530 (Cloud Storage Data)',
    },
    {
      term: 'ATTACK TOOLING',
      value: 'FROSTBITE (Rapeflake .NET Utility) · DBeaver Ultimate (Java JDBC) · Mullvad VPN Relays',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY & QUERY_HISTORY (DBeaver_DBeaverUltimate / Rapeflake)',
    },
  ],
  nodes: [
    {
      id: 'unc5537_mullvad_actor',
      label: 'UNC5537 Extortion Operator',
      sublabel: '198.51.100.44 (Mullvad VPN Exit Node)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Workstation (Infostealer Log Parser)',
        pidOrPort: 'HTTPS :443 (Snowflake JDBC / SnowSQL Client)',
        privilege: 'Stolen Contractor Snowflake Credentials (Single-Factor)',
        artifacts: [
          'RedLine / LummaC2 stealer logs (passwords.txt matching *.snowflakecomputing.com)',
          'FROSTBITE (Rapeflake.exe) & DBeaver Ultimate 23.x',
        ],
        description:
          'Financially motivated UNC5537 operator replaying stealer-sourced credentials from anonymizing VPN infrastructure.',
      },
    },
    {
      id: 'snowflake_authn_gateway',
      label: 'Snowflake Cloud Auth Gateway',
      sublabel: 'corp-prod.us-east-1.snowflakecomputing.com',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Snowflake SaaS Authentication & Session Plane',
        pidOrPort: 'TLS :443 (/session/v1/login-request)',
        privilege: 'ACCOUNTADMIN / SYSADMIN Role (No MFA Enforced)',
        artifacts: [
          'FIRST_AUTHENTICATION_FACTOR=PASSWORD, SECOND_AUTHENTICATION_FACTOR=NULL',
          'CLIENT_APPLICATION_ID: DBeaver_DBeaverUltimate 23.3.0',
        ],
        description:
          'Customer Snowflake tenant authentication endpoint permitting password-only logins from untrusted external IPs.',
      },
    },
    {
      id: 'frostbite_rapeflake_engine',
      label: 'FROSTBITE (Rapeflake) Recon Engine',
      sublabel: 'Snowflake SQL Session #99481204',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Automated .NET Snowflake Reconnaissance & Staging Tool',
        pidOrPort: 'PID 6120 (Rapeflake.exe / JDBC Driver 3.14.4)',
        privilege: 'Inherited ACCOUNTADMIN Session Token',
        artifacts: [
          'SHOW DATABASES; SHOW SCHEMAS; SHOW TABLES; SELECT CURRENT_ROLE()',
          'SHOW USERS; SELECT * FROM INFORMATION_SCHEMA.TABLES',
        ],
        description:
          'Executes rapid automated metadata discovery queries across all customer schemas to identify high-value PII and financial tables.',
      },
    },
    {
      id: 'snowflake_warehouse_exfil',
      label: 'Snowflake Virtual Warehouse & Stage',
      sublabel: 'COMPUTE_WH (COPY INTO @TEMP_STAGE)',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Snowflake Cloud Data Warehouse Storage Engine',
        pidOrPort: 'SQL COPY INTO / GET @~ Staged CSV/Parquet',
        privilege: 'Full Read/Export on PROD_CUSTOMER_DB',
        artifacts: [
          'CREATE TEMP STAGE exfil_stage; COPY INTO @exfil_stage FROM CUSTOMERS_PII',
          'GET @exfil_stage file:///tmp/dump/ (Multi-GB CSV export)',
        ],
        description:
          'Compromised virtual warehouse executing bulk table exports into temporary internal stages for rapid download.',
      },
    },
    {
      id: 'snowflake_account_usage_siem',
      label: 'Snowflake ACCOUNT_USAGE & SIEM',
      sublabel: 'LOGIN_HISTORY + QUERY_HISTORY Monitor',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Cloud SIEM & Snowflake Security Data Lake',
        pidOrPort: 'SNOWFLAKE.ACCOUNT_USAGE Audit Views',
        privilege: 'SOC Detection & Network Policy Enforcement',
        artifacts: [
          'Mandiant Hunting Query: CLIENT_ENVIRONMENT.APPLICATION IN (DBeaver, Rapeflake)',
          'ALTER ACCOUNT SET NETWORK_POLICY = corp_egress_only, MFA Enforcement',
        ],
        description:
          'Correlates single-factor logins from Mullvad VPN ranges with DBeaver/Rapeflake User-Agents and bulk COPY INTO queries.',
      },
    },
  ],
  processTree: [
    {
      pid: 6120,
      ppid: 1840,
      name: 'Rapeflake.exe (FROSTBITE)',
      commandLine: 'Rapeflake.exe --targets stealer_snowflake_list.txt --threads 16 --check-roles',
      user: 'UNC5537-OP\\operator',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: ['HttpClient.PostAsync("/session/v1/login-request")', 'SnowflakeDbConnection.Open()'],
      memoryBlocks: [
        {
          address: '0x00007FF910440000',
          section: '.text (FROSTBITE JDBC Reconnaissance Module)',
          permissions: 'R-X',
          size: '128 KB',
          status: 'injected',
          description: 'Custom .NET assembly automating credential stuffing and SHOW TABLES / SHOW USERS queries against Snowflake tenants.',
          hexPreview: '4D 5A 90 00 03 00 00 00 53 48 4F 57 20 55 53 45 (SHOW USERS / Rapeflake)',
        },
      ],
    },
    {
      pid: 7412,
      ppid: 1840,
      name: 'dbeaver.exe (DBeaver Ultimate)',
      commandLine: 'dbeaver.exe -con "driver=snowflake|url=https://corp-prod.us-east-1.snowflakecomputing.com"',
      user: 'UNC5537-OP\\operator',
      integrity: 'High',
      status: 'suspicious',
      activeFromStage: 3,
      apiCalls: ['JDBC.executeQuery("COPY INTO @~")', 'JDBC.executeQuery("GET @~")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'INFOSTEALER CREDENTIAL REPLAY ON SINGLE-FACTOR TENANT',
      subtitle: 'Authenticating to *.snowflakecomputing.com without MFA using Lumma/RedLine stealer logs',
      description:
        'UNC5537 parses millions of historical infostealer logs (Lumma, RedLine, Vidar) for saved credentials matching *.snowflakecomputing.com and replays them from Mullvad VPN nodes against customer tenants where SECOND_AUTHENTICATION_FACTOR is NULL and no Network Policy restricts source IPs.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1078.004',
      mitreTechniqueName: 'Valid Accounts: Cloud Accounts',
      activeNodeIds: ['unc5537_mullvad_actor', 'snowflake_authn_gateway', 'snowflake_account_usage_siem'],
      compromisedNodeIds: ['snowflake_authn_gateway'],
      keySpecs: [
        { term: 'INITIAL VECTOR', value: 'Plaintext Credentials from RedLine / Vidar / Lumma Stealer Logs' },
        { term: 'AUTH GAP', value: 'SECOND_AUTHENTICATION_FACTOR = NULL & Missing Network Policy' },
        { term: 'CLIENT FINGERPRINT', value: 'FROSTBITE (Rapeflake) / .NET Snowflake Driver' },
      ],
    },
    {
      index: 2,
      title: 'FROSTBITE (RAPEFLAKE) AUTOMATED SCHEMA RECONNAISSANCE',
      subtitle: 'Enumerating ACCOUNTADMIN privileges, users, and high-row-count customer tables',
      description:
        'Upon establishing a valid session token, the FROSTBITE (Rapeflake) utility automatically issues burst SQL queries—SELECT CURRENT_ROLE(), SHOW USERS, SHOW DATABASES, and SELECT * FROM INFORMATION_SCHEMA.TABLES—to triage tenants with hundreds of millions of customer records.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1087.004',
      mitreTechniqueName: 'Account Discovery: Cloud Account',
      activeNodeIds: ['snowflake_authn_gateway', 'frostbite_rapeflake_engine', 'snowflake_account_usage_siem'],
      compromisedNodeIds: ['snowflake_authn_gateway', 'frostbite_rapeflake_engine'],
      keySpecs: [
        { term: 'RECON UTILITY', value: 'FROSTBITE (Rapeflake) Automated SQL Enumerator' },
        { term: 'SQL QUERIES', value: 'SHOW USERS; SHOW ROLES;SHOW DATABASES; INFORMATION_SCHEMA.TABLES' },
        { term: 'AUDIT VIEW', value: 'SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY' },
      ],
    },
    {
      index: 3,
      title: 'DBEAVER ULTIMATE BULK STAGE & MULTI-GB EXFILTRATION',
      subtitle: 'Executing COPY INTO temporary stages and downloading compressed CSV/Parquet archives',
      description:
        'Using DBeaver Ultimate over the Snowflake JDBC driver, the operator runs SELECT * or COPY INTO @~ (user stage) to compress multi-gigabyte customer PII tables into staged chunks and downloads them over HTTPS for extortion.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1530',
      mitreTechniqueName: 'Data from Cloud Storage',
      activeNodeIds: ['frostbite_rapeflake_engine', 'snowflake_warehouse_exfil', 'snowflake_account_usage_siem'],
      compromisedNodeIds: ['snowflake_authn_gateway', 'frostbite_rapeflake_engine', 'snowflake_warehouse_exfil'],
      keySpecs: [
        { term: 'EXFIL CLIENT', value: 'DBeaver_DBeaverUltimate (JDBC Driver)' },
        { term: 'STAGING COMMAND', value: 'COPY INTO @~/exfil_dump/ FROM PROD_DB.PUBLIC.CUSTOMERS' },
        { term: 'SIEM REMEDIATION', value: 'Enforce DUO/FIDO2 MFA + Snowflake Network Policy Allowlist' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'sf-unc5537-1',
      no: 1,
      stageIndex: 1,
      timestamp: '02:14:11.204',
      sourceNodeId: 'unc5537_mullvad_actor',
      targetNodeId: 'snowflake_authn_gateway',
      sourceLabel: 'UNC5537 VPN Node',
      targetLabel: 'Snowflake Auth Gateway',
      sourceType: 'NETWORK',
      protocolOrEventId: 'SNOWFLAKE LOGIN_HISTORY',
      shortAction: 'SINGLE_FACTOR_LOGIN_SUCCESS',
      info: 'USER_NAME=SVC_TABLEAU_ETL FIRST_AUTH=PASSWORD SECOND_AUTH=NULL CLIENT_IP=198.51.100.44',
      sizeOrCode: 'EVENT_ID 8841920',
      severity: 'HIGH',
      mitreId: 'T1078.004',
      explanation: 'Single-factor password login to Snowflake from an anonymizing VPN IP using stealer-harvested service credentials.',
      rawLog: `{"EVENT_TYPE":"LOGIN","USER_NAME":"SVC_TABLEAU_ETL","CLIENT_IP":"198.51.100.44","REPORTED_CLIENT_TYPE":"OTHER","FIRST_AUTHENTICATION_FACTOR":"PASSWORD","SECOND_AUTHENTICATION_FACTOR":null,"IS_SUCCESS":"YES"}`,
      detectionRule: {
        type: 'KQL',
        title: 'Snowflake Single-Factor Login from Untrusted ASN / DBeaver Client',
        ruleCode: `SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY WHERE IS_SUCCESS = 'YES' AND SECOND_AUTHENTICATION_FACTOR IS NULL;`,
        mitigation: 'Enforce MFA (EXT_AUTHN_DUO / SAML2) and attach a strict Snowflake NETWORK_POLICY to all human and service accounts.',
      },
    },
    {
      id: 'sf-unc5537-2',
      no: 2,
      stageIndex: 2,
      timestamp: '02:14:13.890',
      sourceNodeId: 'snowflake_authn_gateway',
      targetNodeId: 'frostbite_rapeflake_engine',
      sourceLabel: 'Snowflake Auth Gateway',
      targetLabel: 'FROSTBITE (Rapeflake)',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'SNOWFLAKE QUERY_HISTORY',
      shortAction: 'RAPEFLAKE_SCHEMA_RECON',
      info: 'APPLICATION=Rapeflake QUERY="SHOW DATABASES; SHOW USERS; SELECT * FROM INFORMATION_SCHEMA.TABLES"',
      sizeOrCode: 'ROWS_PRODUCED 412',
      severity: 'CRITICAL',
      mitreId: 'T1087.004',
      explanation: 'FROSTBITE (Rapeflake) automated reconnaissance enumerating databases, roles, and table row counts.',
      rawLog: `{"QUERY_ID":"01b4c912-0001-8492","USER_NAME":"SVC_TABLEAU_ETL","ROLE_NAME":"ACCOUNTADMIN","CLIENT_APPLICATION_ID":"Rapeflake 1.0","QUERY_TEXT":"SELECT TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, ROW_COUNT, BYTES FROM INFORMATION_SCHEMA.TABLES WHERE ROW_COUNT > 100000"}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Mandiant UNC5537 FROSTBITE / Rapeflake Client Application Signature',
        ruleCode: `title: UNC5537 Snowflake Rapeflake or DBeaver Reconnaissance
logsource:
  product: snowflake
detection:
  selection:
    CLIENT_ENVIRONMENT.APPLICATION|contains:
      - 'Rapeflake'
      - 'DBeaver_DBeaverUltimate'
  condition: selection`,
        mitigation: 'Rotate compromised credentials immediately, terminate active sessions via SYSTEM$ABORT_SESSION, and block non-approved JDBC client identifiers.',
      },
    },
    {
      id: 'sf-unc5537-3',
      no: 3,
      stageIndex: 3,
      timestamp: '02:19:45.512',
      sourceNodeId: 'frostbite_rapeflake_engine',
      targetNodeId: 'snowflake_warehouse_exfil',
      sourceLabel: 'FROSTBITE / DBeaver',
      targetLabel: 'Snowflake Warehouse Stage',
      sourceType: 'NETWORK',
      protocolOrEventId: 'SNOWFLAKE COPY_INTO',
      shortAction: 'BULK_STAGE_EXFILTRATION',
      info: 'CLIENT=DBeaver_DBeaverUltimate QUERY="COPY INTO @~/dump/customers.csv.gz FROM PROD_DB.PUBLIC.CUSTOMERS"',
      sizeOrCode: 'BYTES_WRITTEN 4.8 GB',
      severity: 'CRITICAL',
      mitreId: 'T1530',
      explanation: 'Bulk data staging and GET download of 4.8 GB of customer PII via DBeaver Ultimate.',
      rawLog: `{"QUERY_TYPE":"COPY","USER_NAME":"SVC_TABLEAU_ETL","WAREHOUSE_NAME":"COMPUTE_WH","CLIENT_APPLICATION_ID":"DBeaver_DBeaverUltimate 23.3.0","QUERY_TEXT":"COPY INTO @~/dump/customers.csv.gz FROM PROD_DB.PUBLIC.CUSTOMERS FILE_FORMAT=(TYPE=CSV COMPRESSION=GZIP)"}`,
      detectionRule: {
        type: 'KQL',
        title: 'Anomalous Snowflake Bulk COPY INTO Internal Stage Followed by GET',
        ruleCode: `SELECT USER_NAME, QUERY_TEXT, BYTES_WRITTEN_TO_RESULT FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE QUERY_TYPE IN ('COPY', 'GET') AND BYTES_WRITTEN_TO_RESULT > 500000000;`,
        mitigation: 'Restrict CREATE STAGE / COPY INTO privileges and migrate service accounts to Key-Pair Authentication or OAuth Workload Identity.',
      },
    },
  ],
};
