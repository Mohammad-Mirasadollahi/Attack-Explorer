import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
