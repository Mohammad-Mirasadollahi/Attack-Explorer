import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'cloud-salesforce-connected-app-oauth-bulk-api-export-audit',
    title: 'Salesforce Security, Mandiant & MITRE — SaaS Connected App OAuth Scope Escalation & Bulk API 2.0 Export Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1530',
    description:
      'Grounded in Salesforce Event Monitoring documentation, Mandiant SaaS incident response guides (UNC5537 / UNC3944), and MITRE ATT&CK T1530 / T1528: DFIR analysts investigate unauthorized OAuth Connected App authorizations (api and refresh_token scopes), asynchronous Bulk API 2.0 query jobs (/services/data/v59.0/jobs/query), and UniqueQuery / ApiTotalUsage telemetry in Salesforce EventLogFile.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External OAuth Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Salesforce OAuth /services/oauth2/token', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Connected App (api + refresh_token)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Salesforce Shield Event Monitoring', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Bulk API 2.0 (/jobs/query CRM Objects)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unverified OAuth Connected App Consent & Refresh Token Issuance',
        narration:
          'When an organization permits "All users may self-authorize" on OAuth Connected Apps, an attacker social-engineers a user or uses stolen credentials to authorize a custom Connected App requesting api and refresh_token (offline_access) scopes, logged in OauthToken and LoginHistory.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1528 - Steal Application Access Token)',
        technicalCommands: [
          'SELECT UserId, AppName, UseCount, LastUsedDate FROM OauthToken WHERE AppName = \'DataSync_Connector\'',
          'SELECT Application, Status, SourceIp, LoginType FROM LoginHistory WHERE LoginType = \'Remote Access 2.0\'',
        ],
        defenseMitigation:
          'Enable Salesforce API Access Control ("Admin approved users are pre-authorized" for all Connected Apps) and block uninstalled third-party Connected Apps from requesting api scopes.',
        logs: [
          {
            id: 'sfdc-1',
            timestamp: '15:02:19.104',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'SalesforceOAuth',
            CommandLine: 'POST /services/oauth2/token (Remote Access 2.0 Connected App: DataSync_Connector)',
            raw: 'sfdc_login: {"EVENT_TYPE":"Login","LOGIN_TYPE":"Remote Access 2.0","APPLICATION":"DataSync_Connector","SOURCE_IP":"198.51.100.114","USER_ID":"0058c000009XYZ1","STATUS":"Success"}',
            parsedFields: {
              EventType: 'LoginHistory (Remote Access 2.0)',
              ConnectedAppName: 'DataSync_Connector',
              GrantedScopes: 'api, refresh_token (offline_access)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Asynchronous Bulk API 2.0 Query Job Creation (/services/data/v59.0/jobs/query)',
        narration:
          'Using the OAuth access token, the client submits a Bulk API 2.0 SOQL query job (POST /services/data/v59.0/jobs/query) with operation="query" across Account, Contact, and Opportunity tables, recorded in Salesforce BulkApi2EventLog.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection (T1530 - Data from Cloud Storage / SaaS Repositories)',
        technicalCommands: [
          'SELECT Id, EventType, LogDate FROM EventLogFile WHERE EventType IN (\'BulkApi2\', \'RestApi\', \'ReportExport\')',
          'SELECT Id, Operation, Object, CreatedById, NumberRecordsProcessed FROM AsyncApexJob',
        ],
        defenseMitigation:
          'Configure Salesforce Transaction Security Policies (ConditionBuilder / Apex policy on ApiEvent and ReportEvent) to block or require step-up authentication when RowsProcessed exceeds threshold limits.',
        logs: [
          {
            id: 'sfdc-2',
            timestamp: '15:04:41.550',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'SalesforceBulkApi2',
            CommandLine: 'POST /services/data/v59.0/jobs/query (SELECT Id,Name,Email,Phone FROM Contact)',
            raw: 'sfdc_eventlog: {"EVENT_TYPE":"BulkApi2","JOB_ID":"7508c000008AbCd","OPERATION":"query","ENTITY_TYPE":"Contact","ROWS_PROCESSED":85400,"CLIENT_IP":"198.51.100.114"}',
            parsedFields: {
              EventLogType: 'BulkApi2 (EventLogFile)',
              TargetEntity: 'Contact (85,400 rows)',
              BulkJobId: '7508c000008AbCd',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Bulk CSV Result Batch Download (/jobs/query/<id>/results) & OauthToken Revocation',
        narration:
          'Once job state transitions to JobComplete, the client streams CSV batches via GET /services/data/v59.0/jobs/query/7508c000008AbCd/results. Defenders revoke the OauthToken record and enforce IP range restrictions on the Connected App profile.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1567 - Exfiltration Over Web Service)',
        technicalCommands: [
          'SELECT JobId, RecordsProcessed,TotalProcessingTime FROM BulkApiResultEventStore WHERE JobId = \'7508c000008AbCd\'',
          'DELETE /services/oauth2/revoke?token=<refresh_token>',
        ],
        defenseMitigation:
          'Enforce Trusted IP Ranges on Connected Apps, set Refresh Token Policy to "Expire refresh token after N hours", and forward Salesforce Shield Real-Time Event Monitoring (ApiAnomalyEventStore) to SIEM.',
        logs: [
          {
            id: 'sfdc-3',
            timestamp: '15:05:18.902',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'SalesforceRestApi',
            CommandLine: 'GET /services/data/v59.0/jobs/query/7508c000008AbCd/results?maxRecords=50000',
            raw: 'sfdc_eventlog: {"EVENT_TYPE":"RestApi","URI":"/services/data/v59.0/jobs/query/7508c000008AbCd/results","METHOD":"GET","STATUS_CODE":200,"RESPONSE_SIZE":14820412,"CLIENT_IP":"198.51.100.114"}',
            parsedFields: {
              ResultDownloadUri: '/services/data/v59.0/jobs/query/7508c000008AbCd/results',
              ResponseSizeBytes: '14,820,412 bytes (CSV stream)',
              AnomalyEvent: 'ApiAnomalyEventStore Triggered',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a giant corporate customer-records library where an employee gets tricked into authorizing an unverified third-party research cart with broad library borrowing powers. Handed a reusable library pass, the intruder orders the library own automated overnight forklift to pack entire customer shelves into downloadable spreadsheet crates and wheels them straight out of the building until librarians revoke the rogue cart pass.',
      storyMappings: [
        {
          storyTerm: 'Tricking an employee into authorizing an unverified research cart',
          technicalTerm: 'Unverified Salesforce OAuth Connected App consent minting a persistent Refresh Token',
          tone: 'amber',
        },
        {
          storyTerm: 'Ordering the library automated forklift to pack entire shelves',
          technicalTerm: 'Asynchronous Bulk API 2.0 Query Job via /services/data/v59.0/jobs/query',
          tone: 'sky',
        },
        {
          storyTerm: 'Wheeling downloadable spreadsheet crates out of the building',
          technicalTerm: 'Bulk CSV result batch export via /jobs/query/<id>/results',
          tone: 'rose',
        },
        {
          storyTerm: 'Canceling the rogue cart pass across the library',
          technicalTerm: 'Salesforce Event Monitoring BulkApiResult audit and OauthToken revocation',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Lured by a smooth phone call or disguised link, an employee clicks Approve on a disguised external research cart, silently handing the attacker a renewable delegated key ring scoped to read and export company customer records.',
        storyMappings: [
          {
            storyTerm: 'Disguised external Connected App approved by a user',
            technicalTerm: 'Unverified third-party Salesforce OAuth Connected App (e.g., modified Data Loader)',
            tone: 'amber',
          },
          {
            storyTerm: 'Renewable key ring handed to the attacker',
            technicalTerm: 'Issued OAuth Access Token and long-lived Refresh Token (refresh_token / api scopes)',
            tone: 'sky',
          },
          {
            storyTerm: 'Bypasses ongoing interactive login prompts',
            technicalTerm: 'Persistent API access operating independently of user browser sessions',
            tone: 'rose',
          },
          {
            storyTerm: 'Library approval policy stopping rogue apps',
            technicalTerm: 'Salesforce Connected App API Access Control restricting unapproved OAuth clients',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Instead of copying customer index cards slowly one by one where noisy page counters might trigger, the intruder submits a high-speed asynchronous bulk export order asking the CRM engine itself to gather every Account, Contact, and Opportunity record into clean batches.',
        storyMappings: [
          {
            storyTerm: 'High-speed asynchronous bulk export order',
            technicalTerm: 'HTTP POST to /services/data/v59.0/jobs/query creating a Bulk API 2.0 Query Job',
            tone: 'amber',
          },
          {
            storyTerm: 'Gathering every customer record automatically',
            technicalTerm: 'SOQL queries dumping Account, Contact, Case, and Lead CRM tables wholesale',
            tone: 'sky',
          },
          {
            storyTerm: 'Server doing all the heavy packing',
            technicalTerm: 'Asynchronous background job staging millions of rows for rapid retrieval',
            tone: 'rose',
          },
          {
            storyTerm: 'Library bulk-job log recording the order',
            technicalTerm: 'Salesforce Event Monitoring API and BulkApi2 job creation audit records',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'As soon as the bulk forklift signals the crates are ready, the intruder pulls down every finished CSV batch straight to external servers, leaving high-volume result-download receipts that guide responders to revoke the rogue Connected App token immediately.',
        storyMappings: [
          {
            storyTerm: 'Pulling down every finished spreadsheet batch',
            technicalTerm: 'GET /services/data/v59.0/jobs/query/<id>/results downloading bulk CSV chunks',
            tone: 'amber',
          },
          {
            storyTerm: 'High-volume result-download receipts',
            technicalTerm: 'Salesforce Event Monitoring BulkApiResult logs capturing row counts and source IP',
            tone: 'sky',
          },
          {
            storyTerm: 'Revoking the rogue cart pass immediately',
            technicalTerm: 'Invalidating the compromised OauthToken and blocking the Connected App org-wide',
            tone: 'rose',
          },
          {
            storyTerm: 'Preventing unauthorized data exports',
            technicalTerm: 'Transaction Security Policies alerting or blocking anomalous Bulk API exports',
            tone: 'emerald',
          },
        ],
      },
    },
  };
