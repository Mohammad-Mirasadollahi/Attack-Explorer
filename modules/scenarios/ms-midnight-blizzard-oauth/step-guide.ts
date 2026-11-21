import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ms-midnight-blizzard-oauth',
    briefing: {
      headline: 'Scenario Briefing: Midnight Blizzard (NOBELIUM / APT29), Legacy Test Tenant to OAuth full_access_as_app Exchange Takeover',
      storyAnalogy:
        'Imagine a burglar who finds a forgotten, dusty side cottage on a corporate estate (a legacy non-production test tenant) whose door still uses a simple single-key lock (no MFA). Inside that cottage, the burglar finds an old master maintenance badge (a legacy OAuth application) that happens to have cross-building authority in the main corporate headquarters. Using that badge, they mint new automated robot passes (Service Principals) granted the full_access_as_app stamp, letting them silently read any executive’s mailbox without ever needing any executive’s password.',
      plainSummary:
        'In this scenario (T1098.003, Microsoft Threat Intel - Midnight Blizzard (APT29): OAuth App Persistence & EWS Exfiltration), the attacker follows one continuous arc: low-Volume Residential-Proxy Password Spray Against, then abusing a Legacy Cross-Tenant OAuth App to Register, then exfiltrating Corporate Mailboxes via Exchange Web. Steps #1–#3 examine #1 Low-Volume Residential-Proxy Password Spray Against; #2 Abusing a Legacy Cross-Tenant OAuth App to Register; #3 Exfiltrating Corporate Mailboxes via Exchange Web. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates process, authentication, and network telemetry for T1098.003 across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Midnight Blizzard Residential Proxy Spray targeting the Legacy Test Tenant), pivot through the shared OAuth Service Principal into Node ③/④ (Corporate Entra ID & Malicious OAuth App Registration), and query mailboxes on Node ⑤ (Exchange Online full_access_as_app), detected by Node ⑥ (Entra Audit & Unified Audit Log SIEM).',
      documentedAdvisory: 'Microsoft Threat Intelligence Midnight Blizzard Blog (Jan 2024) · MITRE ATT&CK T1110.003 / T1098.003 / T1114.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1110.003',
        plainTitle: 'Low-Volume Residential-Proxy Password Spray Against a Forgotten Legacy Test Account',
        storyAnalogy:
          'Instead of rattling the front door of the main corporate tower 1,000 times from one suspicious van, the attacker has dozens of local couriers (residential proxy IPs) try just one password at a time on a forgotten side-cottage test door that never had a two-factor keypad installed.',
        simpleExplanation:
          'To avoid triggering automated IP blocks or account lockouts, the attacker routes authentication requests through a rotating pool of residential proxy IPs (home internet routers in the same country as the target, making login traffic look like legitimate local employees rather than a datacenter botnet) and performs a low-volume password spray (trying just one common password at a time across a small list of accounts) against a forgotten, non-production legacy test tenant account that had never been enforced with Multi-Factor Authentication (MFA).',
        howItWorksInPractice:
          'Because each residential proxy IP sends only a tiny fraction of the total login attempts and stays well below the bad-password lockout threshold (e.g., 1 attempt per hour), traditional velocity-based brute-force rules do not fire, allowing the attacker to quietly log into the forgotten single-factor test account. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ①/② (Residential Proxy Pool) to Node ③ (Legacy Test Tenant Entra ID Sign-In), and return arrow ⇠#1 issuing the initial OAuth token.',
        detectionAndEvidence:
          'Analyze Microsoft Entra ID SigninLogs (cloud identity telemetry capturing every authentication attempt, ASN, and MFA claim) for low-volume distributed password sprays rotating across residential proxy ASNs against single-factor legacy or non-production accounts. Correlate Sysmon or Windows Security Event telemetry for T1110.003 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098.003',
        plainTitle: 'Abusing a Legacy Cross-Tenant OAuth App to Register New Privileged Service Principals',
        storyAnalogy:
          'Once inside the side cottage, the intruder discovers an old "Universal Maintenance App" that was accidentally given admin rights over the main corporate tower. Using that app’s authority, they print brand-new client secret keys (Add servicePrincipal credentials) and stamp them with the highest mail-reading clearance (full_access_as_app).',
        simpleExplanation:
          'Inside the test environment, the attacker discovers a legacy OAuth test application whose Service Principal had been granted privileged directory permissions, specifically AppRoleAssignment.ReadWrite.All (a high-privilege Microsoft Graph permission that allows an app to grant any permission role to itself or to other apps without asking a human Global Administrator), inside the main corporate tenant. Using that legacy app, the attacker creates new malicious OAuth Service Principals, attaches new client secret keys (Add servicePrincipal credentials, creating long-lived API passwords for the app), and assigns them the Office 365 Exchange Online full_access_as_app role.',
        howItWorksInPractice:
          'In Microsoft Entra ID, an application holding AppRoleAssignment.ReadWrite.All can call the Graph API (/servicePrincipals/{id}/appRoleAssignments) to self-assign full_access_as_app (Role ID dc890d15-9560-4a4c-9b7f-a736ec74ec40, the highest application-level Exchange permission), escalating from a forgotten test account to full tenant-wide mail access without touching a human admin’s account.',
        diagramAlignment:
          'On the diagram, arrow #2→ uses the legacy OAuth app on Node ③ to create and privilege the rogue OAuth Service Principal on Node ④ (Add app role assignment to service principal), with ⇠#2 returning the OAuth2 client_credentials bearer token.',
        detectionAndEvidence:
          'Documented in Microsoft Entra Audit Logs: Add servicePrincipal, Add servicePrincipal credentials, and Add app role assignment to service principal for full_access_as_app (dc890d15-9560-4a4c-9b7f-a736ec74ec40). Correlate Sysmon or Windows Security Event telemetry for T1098.003 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1114.002',
        plainTitle: 'Exfiltrating Corporate Mailboxes via Exchange Web Services (EWS) Using OAuth Bearer Tokens',
        storyAnalogy:
          'Holding the full_access_as_app robot pass, the attacker walks straight up to the Exchange mailroom window (outlook.office365.com/EWS/Exchange.asmx) and downloads executive inbox folders in bulk, never triggering a single phone MFA prompt on any executive’s device.',
        simpleExplanation:
          'Authenticating purely as the rogue OAuth application using grant_type=client_credentials (machine-to-machine authentication that uses the app’s client secret and never involves a human user login or MFA prompt), the attacker calls Exchange Web Services (https://outlook.office365.com/EWS/Exchange.asmx) through the same residential proxy pool to search and download emails from senior executive and security-team mailboxes.',
        howItWorksInPractice:
          'Because full_access_as_app is an application-level permission (Application Permission) rather than a delegated user permission (Delegated Permission), the OAuth Bearer token grants direct read/export access to any mailbox in the Exchange Online tenant without ever logging in as those users or triggering Conditional Access user-MFA policies. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #3→ queries Node ⑤ (Exchange Online EWS /EWS/Exchange.asmx MailItemsAccessed) from Node ④, while Node ⑥ (Microsoft Sentinel / SIEM) correlates the Entra role grant with EWS MailItemsAccessed telemetry.',
        detectionAndEvidence:
          'Documented in Microsoft Purview Unified Audit Log (MailItemsAccessed / EWS) correlated with Entra Service Principal sign-ins using AppId holding full_access_as_app. Correlate Sysmon or Windows Security Event telemetry for T1528 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
