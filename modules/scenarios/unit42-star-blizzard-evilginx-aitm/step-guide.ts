import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'unit42-star-blizzard-evilginx-aitm',
    briefing: {
      headline: 'Scenario Briefing: Star Blizzard (SEABORGIUM / COLDRIVER), Evilginx Adversary-in-the-Middle (AiTM) Session Cookie Theft',
      storyAnalogy:
        'Imagine a fake ATM booth placed right in front of a real bank window with a two-way mirror between them. When you walk up and type your PIN and tap your 6-digit phone MFA code, the fake booth immediately types those exact digits into the real bank window behind the glass. The real bank says: "Welcome! Here is your golden VIP Day Pass (ESTSAUTHPERSISTENT cookie)." The fake booth photocopies your golden Day Pass as it hands it to you, and now the thief can walk into the bank all day using their copy of your pass without ever needing your phone again.',
      plainSummary:
        'Documented by Microsoft Threat Intelligence, CISA, and Palo Alto Networks Unit 42, this scenario explains how Adversary-in-the-Middle (AiTM) phishing frameworks like Evilginx defeat traditional Multi-Factor Authentication (MFA) such as SMS codes, authenticator apps (TOTP), and push notifications. Instead of hosting a static fake login page that only steals a password, the attacker’s Evilginx server acts as a live reverse proxy sitting between the victim’s browser and the real login.microsoftonline.com server. When the victim types their password and approves their MFA prompt, Evilginx forwards that traffic to Microsoft in real time, and intercepts the resulting ESTSAUTHPERSISTENT session cookie (the post-MFA proof-of-login token) as Microsoft sends it back.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/③ (Victim Browser clicking the spear-phishing link), trace the live reverse-proxy relay through Node ②/④ (Evilginx AiTM Proxy Server) to the real Node ⑤ (Microsoft Entra ID login.microsoftonline.com), and see how Evilginx captures the ESTSAUTHPERSISTENT cookie in transit while Node ⑥ (Entra Identity Protection / SIEM) flags the session replay.',
      documentedAdvisory: 'Microsoft Threat Intelligence AiTM Phishing Report · CISA Star Blizzard Advisory · MITRE T1557 / T1539',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1566.002',
        plainTitle: 'Victim Opens the Spear-Phishing Link & Evilginx Proxies the Real Microsoft Login Page Live',
        storyAnalogy:
          'The victim clicks a link to view a PDF document and lands at the two-way-mirror booth (Evilginx). Because the booth is relaying the real Microsoft login screen live from behind the glass, every logo, font, and custom company banner looks 100% authentic.',
        simpleExplanation:
          'After building trust via email, the attacker sends a link to a lookalike domain (e.g., login.micros0ft-auth-portal.com, registered with a valid Let’s Encrypt HTTPS certificate so the browser still displays a padlock icon). When the victim clicks the link, the attacker’s Evilginx server fetches the genuine login.microsoftonline.com page live in the background and rewrites the domain names inside the HTML on the fly (so the victim sees their own company’s real logo, custom background image, and live Microsoft login prompts).',
        howItWorksInPractice:
          'Unlike traditional phishing kits that host a static HTML copy of a login page (which breaks when MFA challenges or dynamic JavaScript run), an AiTM reverse proxy relays every HTTP request and response between the victim’s browser and Microsoft Entra ID in real time.',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ③ (Victim Browser) through Node ②/④ (Evilginx AiTM Reverse Proxy) to Node ⑤ (Real Identity Provider), and return arrow ⇠#1 rendering the live login page.',
        detectionAndEvidence:
          'Documented by Microsoft Threat Intelligence: Entra Sign-in Logs showing login initiation from an untrusted proxy IP/ASN shortly after an email link click in Defender for Office 365.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1557',
        plainTitle: 'Relaying the Victim’s Password & Live MFA Code Through the Reverse Proxy',
        storyAnalogy:
          'The victim types their password and enters the 6-digit MFA code from their phone. The man-in-the-middle booth passes both straight through the window to Microsoft in milliseconds, and when Microsoft hands back the Set-Cookie: ESTSAUTHPERSISTENT VIP pass, the booth records a copy in its database.',
        simpleExplanation:
          'The victim enters their corporate password and completes their real MFA challenge (typing a 6-digit Authenticator code or tapping "Approve" on a push notification). Evilginx forwards both requests straight to login.microsoftonline.com in milliseconds. Once MFA succeeds, Microsoft responds with HTTP 200 OK containing Set-Cookie: ESTSAUTHPERSISTENT=... (the master browser session cookie that Microsoft issues after both password and MFA are verified, which passes through Evilginx in plaintext because the HTTPS connection from the victim terminates on the Evilginx proxy first).',
        howItWorksInPractice:
          'Because the victim’s TLS session terminates on the attacker’s Evilginx server before Evilginx opens a second TLS session to Microsoft, Evilginx can read and save every HTTP header, including Set-Cookie: ESTSAUTHPERSISTENT and ESTSAUTH, the instant MFA completes. In the documented AADNonInteractiveSignIn exchange from DMZ Reverse Proxy & SPAN Tap to Target User Browser (WKS-EXEC-01), Target User Browser (WKS-EXEC-01) responds with RESP MFA Bypassed (confirming that the COOKIE REPLAY request succeeded on Target User Browser (WKS-EXEC-01) and establishing the runtime state required for Step #3 STEALTH INBOX RULE CREATION & BEC EXFILTRATION).',
        diagramAlignment:
          'On the diagram, arrow #2→ relays the credentials + MFA challenge through Node ④ (Evilginx Proxy) to Node ⑤, and return arrow ⇠#2 returns the Set-Cookie: ESTSAUTHPERSISTENT session token captured by Evilginx.',
        detectionAndEvidence:
          'Documented in MITRE T1539 & Microsoft Entra Identity Protection: high-risk AiTM sign-in alert where the TLS fingerprint (JA3) and IP of the MFA step belong to a reverse-proxy server.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1539',
        plainTitle: 'Injecting the Stolen ESTSAUTHPERSISTENT Cookie to Access Email Without MFA',
        storyAnalogy:
          'Minutes later, the attacker pastes that photocopied ESTSAUTHPERSISTENT VIP pass into their own browser in another country, walks straight into the victim’s Outlook inbox, and sets up a hidden mail-forwarding rule so they keep getting copies of every email.',
        simpleExplanation:
          'The attacker imports the stolen ESTSAUTHPERSISTENT cookie into their own browser using a cookie editor and opens outlook.office.com. Because holding a valid ESTSAUTHPERSISTENT cookie tells Microsoft "this browser already passed password + MFA checks", Outlook opens the victim’s mailbox immediately without asking for a password or triggering an MFA prompt on the victim’s phone. The attacker then creates a hidden Inbox rule (New-InboxRule, automatically forwarding or moving incoming security/reset emails so the victim never notices ongoing access).',
        howItWorksInPractice:
          'Why did MFA fail to stop this? Because TOTP codes and push approvals only verify the login event, not the domain in the browser bar. Only phishing-resistant FIDO2 / WebAuthn passkeys (which cryptographically bind the login signature to the exact domain name login.microsoftonline.com) or Token Protection (device-bound session cookies) defeat AiTM proxies.',
        diagramAlignment:
          'On the diagram, arrow #3→ replays the stolen ESTSAUTHPERSISTENT cookie from Node ①/④ directly against Node ⑤ (Exchange Online / Outlook), while Node ⑥ (SIEM) detects the same session ID used from two different IP addresses and ASNs.',
        detectionAndEvidence:
          'Documented in Microsoft Sentinel & Entra Sign-in Logs: identical UniqueTokenIdentifier / SessionId replayed from a second IP address followed by New-InboxRule creation in Unified Audit Logs.',
      },
    ],
  };
