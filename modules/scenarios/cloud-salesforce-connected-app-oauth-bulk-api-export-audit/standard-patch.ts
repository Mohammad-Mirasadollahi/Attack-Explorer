import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
          'Lured by a smooth social-engineering call or phishing link, an employee clicks Approve on a disguised external Connected App, silently handing the attacker a renewable OAuth key ring scoped to read and export company CRM records.',
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
