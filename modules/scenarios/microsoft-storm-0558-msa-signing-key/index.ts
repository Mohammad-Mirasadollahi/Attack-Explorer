import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'microsoft-storm-0558-msa-signing-key',
    briefing: {
      headline: 'Scenario Briefing: Storm-0558 MSA Signing Key Intrusion, Crash-Dump Private Key Theft & Cross-Realm OWA Token Forgery',
      storyAnalogy:
        'Imagine a global hotel chain (Microsoft Cloud) that runs two completely separate divisions: a casual Public Gym (Consumer MSA / Outlook.com) and a classified Diplomatic Embassy Tower (Enterprise Azure AD / Exchange Online). Each division has its own wax signet ring (cryptographic signing key) for stamping visitor passes. One day in 2021, a Public Gym printing machine crashes, and a photo of the trash bin (crash dump) accidentally includes the Public Gym’s wax signet ring (2016 MSA consumer signing key). A spy (Storm-0558) finds that ring in the crash dump and stamps a fake VIP pass claiming to be an Embassy Ambassador. When the spy hands that pass to the Embassy Tower’s mailroom guard (Exchange Online / OWA), the guard carefully checks with a magnifying glass that the wax seal came from a real Microsoft ring, yet forgets to check that a Public Gym ring is never allowed to sign an Embassy Tower pass!',
      plainSummary:
        'In this scenario (T1606.002, Microsoft Threat Intel, Wiz & CISA - Storm-0558: Acquired MSA Consumer Signing Key & Forged OWA/Exchange Online Tokens), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: extracting the 2016 MSA Consumer Signing Key, then bypassing Enterprise Realm Isolation, then exfiltrating Diplomatic Mailboxes via OWA. Steps #1–#3 walk that chain end-to-end by covering Extracting the 2016 MSA Consumer Signing Key, then Bypassing Enterprise Realm Isolation, then Exfiltrating Diplomatic Mailboxes via OWA, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Storm-0558 Forgery Engine with the 2016 MSA Key), present the forged token to Node ②/③ (Exchange Online / OWA Validator), trace the OWA token exchange (AppId 00000002-0000-0ff1-ce00-000000000000) inside Node ④, and watch the GetItem mailbox collection on Node ⑤ caught by Node ⑥ (Purview MailItemsAccessed & CISA AA23-193A Hunter).',
      documentedAdvisory: 'CISA/FBI Joint Advisory AA23-193A · Microsoft Threat Intelligence Post-Mortem · Wiz Research · MITRE T1606.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1552.004',
        plainTitle: 'Extracting the 2016 MSA Consumer Signing Key from a Crash Dump & Minting Forged Tokens (T1552.004)',
        storyAnalogy:
          'Having recovered Microsoft’s private 2016 consumer MSA signing key from a crash dump, the spy uses it offline on their own computer to stamp fake identity tokens for government diplomats.',
        simpleExplanation:
          'As detailed in Microsoft’s root-cause investigation, a 2021 consumer signing service crash accidentally included private key material for a 2016 Microsoft Account (MSA) consumer signing key inside a process crash dump (which failed to be redacted due to a race condition and was later exfiltrated from a compromised engineer’s corporate environment). Storm-0558 uses this RSA private key offline to cryptographically sign forged authentication tokens populated with target enterprise user claims.',
        howItWorksInPractice:
          'Because token forgery happens 100% offline using the stolen private signing key, the attacker never sends a password guess or MFA push to Microsoft Entra ID, generating zero failed-login alerts. In the documented HTTPS OWA_AUTH exchange from Storm-0558 Forgery Engine to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with RESP HTTP 200 OK (confirming that the FORGED_MSA_TOKEN_PRESENTED request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 CROSS-REALM VALIDATION BYPASS IN EXCHANGE ONLINE / OWA).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (Storm-0558 Forgery Engine) to Node ②/③ (OWA Token Validator), and return arrow ⇠#1 accepting the MSA-signed signature.',
        detectionAndEvidence:
          'Inspect OWA and Exchange Online token validation telemetry alongside CISA AA23-193A indicators (forensic guidance on Storm-0558) flagging JWT headers referencing the retired 2016 MSA consumer signing kid presented to enterprise Exchange Online tenants. Correlate Sysmon or Windows Security Event telemetry for T1552.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1606.002',
        plainTitle: 'Bypassing Enterprise Realm Isolation in Exchange Online / OWA Token Validation (T1606.002)',
        storyAnalogy:
          'The Exchange Online guard checks that the token’s cryptographic signature matches a valid key in Microsoft’s key ring, but fails to verify whether that key belongs to the Consumer MSA ring or the Enterprise Azure AD ring!',
        simpleExplanation:
          'When Storm-0558 sends the forged token to Outlook Web Access (outlook.office365.com/owa/), the OWA token validation library verifies the RSA signature against a shared metadata store containing both consumer MSA keys and enterprise Azure AD (Entra ID) keys (failing to enforce scope/issuer-realm isolation that should reject a consumer MSA signing key when validating an enterprise organizational user). OWA then exchanges the forged token for live Exchange Online session tokens under AppId 00000002-0000-0ff1-ce00-000000000000.',
        howItWorksInPractice:
          'As Wiz Research highlighted, cryptographic signature verification alone is insufficient in multi-tenant cloud architectures unless the verifier strictly binds each signing key ID (kid) to its authorized issuer realm. In the documented OWA TOKEN_EXCHANGE exchange from Perimeter Firewall & NDR Tap to Exchange Online / OWA Validator, Exchange Online / OWA Validator responds with ALERT SESSION_ISSUED (confirming that the ENTERPRISE_SESSION_MINTED request succeeded on Exchange Online / OWA Validator and establishing the runtime state required for Step #3 SILENT OWA MAILBOX COLLECTION & CISA AA23-193A DETECTION).',
        diagramAlignment:
          'On the diagram, arrow #2→ exchanges the forged token inside Node ④ (OWA Actor Token Broker), and ⇠#2 issues an active Exchange Online session cookie.',
        detectionAndEvidence:
          'Audit Exchange Online Unified Audit Logs (central Microsoft 365 activity records) for AppId == "00000002-0000-0ff1-ce00-000000000000" paired with an empty ClientAppId and zero matching Entra ID SignInLogs entries (the exact Storm-0558 token forgery gap). Correlate Sysmon or Windows Security Event telemetry for T1606.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1114.002',
        plainTitle: 'Exfiltrating Diplomatic Mailboxes via OWA GetItem & Detecting via Purview MailItemsAccessed (T1114.002)',
        storyAnalogy:
          'The spy silently downloads hundreds of emails through OWA, until a federal agency’s audit ledger (Purview MailItemsAccessed) reveals someone was reading mail inside the vault without ever signing the front-door guestbook (Entra SignInLogs).',
        simpleExplanation:
          'Routing traffic through SoftEther VPN residential exit nodes (198.51.100.119), Storm-0558 invokes /owa/service.svc?action=FindItem and action=GetItem to download sensitive diplomatic and government emails. A Federal Civilian Executive Branch (FCEB) agency detects the intrusion by hunting in Microsoft Purview’s MailItemsAccessed unified audit log (spotting ClientInfoString="Client=OWA;Action=ViaProxy" and AppId 00000002-0000-0ff1-ce00-000000000000 from anomalous VPN IPs with zero matching interactive Entra ID sign-ins).',
        howItWorksInPractice:
          'In response to this federal agency discovery, Microsoft revoked the compromised MSA key, patched cross-realm token validation, and made Purview MailItemsAccessed logging available across standard M365 licensing tiers. In the documented PURVIEW MailItemsAccessed exchange from Exchange Online / OWA Validator to OWA Token-Minting API (/owa/), OWA Token-Minting API (/owa/) responds with RESP 342 Items Synced (confirming that the BULK_MAIL_EXFILTRATION request succeeded on OWA Token-Minting API (/owa/) and completing the final execution objective of Microsoft Threat Intel, Wiz & CISA, Storm-0558: Acquired MSA Consumer Signing Key & Forged OWA/Exchange Online Tokens).',
        diagramAlignment:
          'On the diagram, arrow #3→ downloads mailbox items from Node ⑤ (Enterprise Mailboxes) while Node ⑥ (Purview & CISA AA23-193A Hunter) flags the MailItemsAccessed anomaly.',
        detectionAndEvidence:
          'Run KQL hunting queries across OfficeActivity and CloudAppEvents (Microsoft Purview advanced mailbox audit streams) filtering for Operation == "MailItemsAccessed", AppId == "00000002-0000-0ff1-ce00-000000000000", and ClientInfoString containing Action=ViaProxy (isolating Storm-0558 diplomatic mailbox theft). Correlate Sysmon or Windows Security Event telemetry for T1114.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a global postal system operating two completely separate mail buildings: a public consumer mailroom and a high-security diplomatic embassy mailroom. After salvaging an old 2016 consumer ink stamp that accidentally leaked into an engineer crash notebook, a state spy stamps counterfeit visitor passes for diplomatic staff; because a subtle rule flaw inside the embassy mailroom forgets to check whether the ink stamp came from the consumer desk, the embassy hands over sealed government correspondence silently.',
      storyMappings: [
        {
          storyTerm: 'Old 2016 consumer ink stamp salvaged from a crash notebook',
          technicalTerm: 'Inactive 2016 MSA consumer signing key acquired from a Windows crash dump',
          tone: 'amber',
        },
        {
          storyTerm: 'Subtle flaw letting consumer ink stamps pass at the embassy mailroom',
          technicalTerm: 'Exchange Online / OWA realm validation flaw accepting MSA-signed tokens for enterprise tenants',
          tone: 'sky',
        },
        {
          storyTerm: 'Forged passes with zero record in the embassy front-gate book',
          technicalTerm: 'Forged OWA access tokens with empty ClientAppId and zero Entra ID SignInLogs entries',
          tone: 'rose',
        },
        {
          storyTerm: 'Silently reading sealed diplomatic mailbags',
          technicalTerm: 'OWA GetItem mailbox exfiltration caught via Purview MailItemsAccessed Action=ViaProxy',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Having compromised an engineer workstation and combed through a diagnostic memory crash notebook, the espionage crew extracts a retired 2016 consumer-mailroom master wax stamp and begins embossing self-signed access passes at will.',
        storyMappings: [
          {
            storyTerm: 'Diagnostic memory crash notebook',
            technicalTerm: 'Corporate engineer Windows crash dump containing leaked 2016 MSA consumer signing key',
            tone: 'amber',
          },
          {
            storyTerm: 'Retired 2016 consumer-mailroom wax stamp',
            technicalTerm: 'Inactive Microsoft Account (MSA) cryptographic key identified by its 2016 kid header',
            tone: 'sky',
          },
          {
            storyTerm: 'Embossing self-signed access passes at will',
            technicalTerm: 'Offline minting of arbitrary forged OWA authentication JWTs for target users',
            tone: 'rose',
          },
          {
            storyTerm: 'Stamp serial number exposing the forgery',
            technicalTerm: 'JWT header referencing the retired 2016 MSA consumer kid against enterprise endpoints',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Inspect OWA and Exchange Online token validation telemetry alongside CISA AA23-193A indicators (forensic guidance on Storm-0558) flagging JWT headers referencing the retired 2016 MSA consumer signing kid presented to enterprise Exchange Online tenants. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1552.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      2: {
        storyAnalogy:
          'Walking up to the enterprise diplomatic mailroom with a pass embossed by the consumer stamp, the spy slips straight through a validation blind spot that checks whether the ink stamp is authentic without checking whether it belongs to the enterprise vault rather than the consumer desk.',
        storyMappings: [
          {
            storyTerm: 'Validation blind spot between consumer and enterprise desks',
            technicalTerm: 'Exchange Online GetAccessTokenForResource realm isolation bypass',
            tone: 'amber',
          },
          {
            storyTerm: 'Zero entry in the main corporate front-gate logbook',
            technicalTerm: 'Complete absence of corresponding Microsoft Entra ID SignInLogs authentication events',
            tone: 'sky',
          },
          {
            storyTerm: 'Distinctive blank badge-issuer field',
            technicalTerm: 'Exchange audit entries showing AppId 00000002-0000-0ff1-ce00-000000000000 with empty ClientAppId',
            tone: 'rose',
          },
          {
            storyTerm: 'Entering diplomatic mailrooms silently',
            technicalTerm: 'Unauthenticated enterprise OWA session minted from a forged consumer-signed token',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Audit Exchange Online Unified Audit Logs (central Microsoft 365 activity records) for AppId == "00000002-0000-0ff1-ce00-000000000000" paired with an empty ClientAppId and zero matching Entra ID SignInLogs entries (the exact Storm-0558 token forgery gap). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1606.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Inside the diplomatic post office, the spy quietly pulls selected executive letters through the web mail reader without leaving an ordinary sign-in trail, until federal defenders cross-check detailed mail-access logs and spot the unusual proxy-relay stamp.',
        storyMappings: [
          {
            storyTerm: 'Pulling selected executive letters quietly',
            technicalTerm: 'OWA GetItem REST calls harvesting high-value diplomatic and government emails',
            tone: 'amber',
          },
          {
            storyTerm: 'Detailed mail-access ledger catching the raid',
            technicalTerm: 'Microsoft Purview MailItemsAccessed (OfficeActivity / CloudAppEvents) telemetry',
            tone: 'sky',
          },
          {
            storyTerm: 'Unusual proxy-relay stamp inside the receipt',
            technicalTerm: 'ClientInfoString containing Action=ViaProxy paired with Exchange Online AppId',
            tone: 'rose',
          },
          {
            storyTerm: 'Global key revocation shutting every forged pass',
            technicalTerm: 'Microsoft revoking all legacy MSA consumer keys and tightening enterprise token scope checks',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Run KQL hunting queries across OfficeActivity and CloudAppEvents (Microsoft Purview advanced mailbox audit streams) filtering for Operation == "MailItemsAccessed", AppId == "00000002-0000-0ff1-ce00-000000000000", and ClientInfoString containing Action=ViaProxy (isolating Storm-0558 diplomatic mailbox theft). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1114.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
