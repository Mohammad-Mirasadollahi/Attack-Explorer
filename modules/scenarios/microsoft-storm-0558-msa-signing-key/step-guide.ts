import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'microsoft-storm-0558-msa-signing-key',
    briefing: {
      headline: 'Scenario Briefing: Storm-0558 MSA Signing Key Intrusion, Crash-Dump Private Key Theft & Cross-Realm OWA Token Forgery',
      storyAnalogy:
        'Imagine a global hotel chain (Microsoft Cloud) that runs two completely separate divisions: a casual Public Gym (Consumer MSA / Outlook.com) and a classified Diplomatic Embassy Tower (Enterprise Azure AD / Exchange Online). Each division has its own wax signet ring (cryptographic signing key) for stamping visitor passes. One day in 2021, a Public Gym printing machine crashes, and a photo of the trash bin (crash dump) accidentally includes the Public Gym’s wax signet ring (2016 MSA consumer signing key). A spy (Storm-0558) finds that ring in the crash dump and stamps a fake VIP pass claiming to be an Embassy Ambassador. When the spy hands that pass to the Embassy Tower’s mailroom guard (Exchange Online / OWA), the guard carefully checks with a magnifying glass that the wax seal came from a real Microsoft ring, yet forgets to check that a Public Gym ring is never allowed to sign an Embassy Tower pass!',
      plainSummary:
        'Synthesizing Microsoft Threat Intelligence’s technical post-mortem, Joint CISA/FBI Advisory AA23-193A, and Wiz Research (July–September 2023), China-nexus espionage actor Storm-0558 acquired an inactive 2016 Microsoft Account (MSA) consumer signing private key that had been inadvertently written into a 2021 process crash dump. By exploiting a cross-realm signature validation bug in Outlook Web Access (OWA) and Exchange Online where enterprise relying parties verified token signatures against a shared key store without checking whether the signing key belonged to the consumer (MSA) vs. enterprise (Entra ID) trust realm, Storm-0558 forged access tokens to silently exfiltrate emails from 25 organizations including government agencies.',
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
          'Documented by Microsoft Threat Intel & CISA AA23-193A: Token headers referencing the retired 2016 MSA consumer signing kid presented against enterprise Exchange Online endpoints.',
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
          'Documented in CISA AA23-193A: Exchange audit records showing AppId == "00000002-0000-0ff1-ce00-000000000000" with an empty ClientAppId and no corresponding Entra ID SignInLogs entry.',
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
          'Documented in CISA AA23-193A: KQL query on OfficeActivity / CloudAppEvents where Operation == "MailItemsAccessed", AppId == "00000002-0000-0ff1-ce00-000000000000", and ClientInfoString contains Action=ViaProxy.',
      },
    ],
  };
