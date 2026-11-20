import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'okta-har-file-session-token-hijack',
    briefing: {
      headline: 'Scenario Briefing: Okta Support Case .har File Breach, sid Session Cookie Replay & Post-MFA Admin Hijack',
      storyAnalogy:
        'Imagine a bank manager (IT Super Admin) who notices a minor display glitch on their computer screen while logged into the master vault console (Okta Admin Console). To show the vendor’s helpdesk what the glitch looks like, the manager turns on a high-definition video camera (Chrome DevTools Save all as HAR with content) that films the screen, and accidentally films a close-up of the live, already-unlocked temporary master keycard (Cookie: sid=102f8a9c...) sitting on the desk! When a burglar compromises the helpdesk’s file cabinet, they grab that .har recording, 3D-print an exact copy of the sid keycard within 30 minutes, walk past both the password guard and the MFA guard because the session is already open, and try to mint a permanent master key (SSWS API Token).',
      plainSummary:
        'Synthesizing official post-mortems from Okta Security, Cloudflare SIRT, BeyondTrust, and 1Password (October–November 2023), this scenario models how a threat actor breached Okta’s customer support case-management system and harvested unsanitized browser HTTP Archive (.har) files uploaded by customer administrators. Because .har files record raw HTTP headers including active Cookie: sid=<session_token> values from post-MFA administrative sessions, the attacker replayed the stolen sid cookies from commercial VPN nodes to hijack active Okta Super Admin sessions, create backdoor accounts, and mint permanent SSWS API tokens, until real-time SIRT rules detected a single externalSessionId roaming across different Autonomous Systems (ASNs).',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Support Case Threat Actor), extract Cookie: sid=... from Node ②/③ (Uploaded Browser .har Capture), replay the sid cookie from a foreign VPN IP into Node ④ (Customer Okta Admin Console), and trace system.api_token.create on Node ⑤ (Okta API Tokens) terminated in real time by Node ⑥ (Cloudflare/BeyondTrust SIRT SIEM).',
      documentedAdvisory: 'Okta Support System Security Advisory · Cloudflare SIRT & BeyondTrust Post-Mortems (Oct–Nov 2023) · MITRE T1539 / T1550.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1539',
        plainTitle: 'Harvesting Live Cookie: sid=... Tokens from Unsanitized Browser .har Captures (T1539)',
        storyAnalogy:
          'When an admin saves a .har troubleshooting file in Chrome DevTools while logged into Okta, the JSON file records their live post-MFA sid session cookie in cleartext.',
        simpleExplanation:
          'Using a compromised Okta support service account, the threat actor downloads HTTP Archive (.har) files attached to customer support tickets and parses the JSON entries[].request.cookies array to extract Cookie: sid=102f8a9c7e4b... (the primary bearer session cookie issued by Okta after the Super Administrator has already completed password and FIDO2/Okta Verify Multi-Factor Authentication).',
        howItWorksInPractice:
          'A .har file is not just a screenshot or timing chart; by specification, it is a full JSON archive of every HTTP request and response header, cookie, and POST body transmitted by the browser tab during recording. In the documented HAR JSON PARSE exchange from Support Case Threat Actor to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with RESP SID Token Live (confirming that the HAR_SID_COOKIE_EXTRACTED request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 REPLAYING SID COOKIE TO BYPASS MFA IN OKTA ADMIN CONSOLE).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (Threat Actor) to Node ②/③ (Uploaded .har Capture), and return arrow ⇠#1 extracting Cookie: sid=102f8a9c7e4b....',
        detectionAndEvidence:
          'Documented by Okta, Cloudflare & BeyondTrust: .har JSON files containing "name": "sid" and "X-Okta-XsrfToken" headers from *-admin.okta.com.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1550.004',
        plainTitle: 'Replaying the sid Cookie from a Foreign VPN ASN to Bypass MFA (T1550.004)',
        storyAnalogy:
          'Because the sid cookie represents an already-unlocked session, replaying it from a VPN IP in another country skips the login and MFA screens completely, unless IP binding is turned on.',
        simpleExplanation:
          'Within 30 minutes of the .har file upload, the attacker sends an HTTPS GET request from a commercial VPN exit node (198.51.100.205, ASN 9009) to https://corp-admin.okta.com/admin/dashboard carrying Cookie: sid=102f8a9c7e4b... (hijacking the existing authenticated session trs102f8a9c7e4b without triggering any password check or MFA push notification, which Okta logs as user.session.access_admin_app under the exact same authenticationContext.externalSessionId).',
        howItWorksInPractice:
          'Why did BeyondTrust’s identity policy block the attacker at the console while other tenants allowed access? Because enforcing Admin Session IP Binding or device-bound Okta FastPass policies causes Okta to reject a valid sid cookie the moment the client IP or device posture changes. In the documented OKTA user.session.access_admin_app exchange from Perimeter Firewall & NDR Tap to Uploaded Browser .har Capture, Uploaded Browser .har Capture responds with ALERT MFA Bypassed via sid (confirming that the SESSION_ASN_ROAMING_DETECTED request succeeded on Uploaded Browser .har Capture and establishing the runtime state required for Step #3 MINTING PERSISTENT SSWS API TOKENS & SIRT SESSION REVOCATION).',
        diagramAlignment:
          'On the diagram, arrow #2→ replays Cookie: sid=... into Node ④ (Okta Admin Console), and ⇠#2 grants Super Admin dashboard access under externalSessionId=trs102f8a9c7e4b.',
        detectionAndEvidence:
          'Documented by Cloudflare SIRT & Okta: Okta System Log showing a single authenticationContext.externalSessionId associated with count_distinct(securityContext.asNumber) > 1 or changing client.userAgent.os.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1098.001',
        plainTitle: 'Minting an Okta SSWS API Token (system.api_token.create) & Real-Time SIRT Revocation (T1098.001)',
        storyAnalogy:
          'Knowing the stolen browser cookie will expire when the real admin logs out, the attacker rushes to mint a permanent SSWS API token, until the SOC’s ASN-roaming detector fires and kills both the session and the token!',
        simpleExplanation:
          'Because the stolen sid cookie is tied to the victim admin’s browser session lifetime, the attacker immediately navigates to Security -> API -> Tokens in the Okta Admin Console to invoke system.api_token.create (minting a static SSWS bearer token named "BackupSyncToken" and creating a secondary Super Admin user, which Cloudflare SIRT detected in real time via SIEM alerts on session ASN roaming and neutralized by calling DELETE /api/v1/users/{id}/sessions and revoking all newly created API tokens).',
        howItWorksInPractice:
          'Following this incident, Cloudflare released an open-source client-side HAR Sanitizer (har-sanitizer.pages.dev) that automatically strips Cookie, Set-Cookie, and Authorization values before engineers share .har files.',
        diagramAlignment:
          'On the diagram, arrow #3→ calls system.api_token.create on Node ⑤ (Okta API Tokens) while Node ⑥ (Cloudflare/BeyondTrust SIRT SIEM) detects the ASN jump and revokes the session.',
        detectionAndEvidence:
          'Documented by Cloudflare SIRT & BeyondTrust: Okta System Log system.api_token.create, user.account.privilege.grant, or system.idp.lifecycle.create following an ASN change on externalSessionId.',
      },
    ],
  };
