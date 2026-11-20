import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
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
