import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A fraudster sets up an identical glass booth directly in front of the real bank lobby. A customer steps into the glass booth, enters both their vault code and live one-time stamp while the fraudster relays everything to the real bank teller, and then the fraudster walks away with the stamped entry pass to open the customer mailroom unchecked.',
        storyMappings: [
          {
            storyTerm: 'Identical glass booth',
            technicalTerm: 'Evilginx adversary-in-the-middle reverse proxy',
            tone: 'amber',
          },
          {
            storyTerm: 'Live one-time stamp',
            technicalTerm: 'Real-time multi-factor authentication challenge',
            tone: 'sky',
          },
          {
            storyTerm: 'Stamped entry pass',
            technicalTerm: 'Stolen ESTSAUTHPERSISTENT session cookie',
            tone: 'rose',
          },
          {
            storyTerm: 'Customer mailroom',
            technicalTerm: 'Cloud mailbox and inbox forwarding rules',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'A convincing invitation letter lures the employee to a look-alike glass booth built on a freshly rented storefront. Every word and visual logo inside the booth is mirrored live from the genuine bank lobby just behind the curtain.',
          storyMappings: [
            {
              storyTerm: 'Convincing invitation letter',
              technicalTerm: 'Targeted spear-phishing email link',
              tone: 'amber',
            },
            {
              storyTerm: 'Look-alike glass booth',
              technicalTerm: 'Evilginx transparent reverse-proxy server',
              tone: 'sky',
            },
            {
              storyTerm: 'Genuine bank lobby',
              technicalTerm: 'Legitimate cloud identity login portal',
              tone: 'rose',
            },
            {
              storyTerm: 'Freshly rented storefront',
              technicalTerm: 'Attacker-registered phishing domain and TLS cert',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Microsoft Threat Intelligence (cloud identity telemetry linking phishing clicks to proxy sign-ins): Entra Sign-in Logs showing login initiation from an untrusted proxy IP/ASN shortly after an email link click in Defender for Office 365 (revealing that a middleman host relayed the authentication session). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1539 (pairing parent/child process and destination fields) and contain the offending session.',
        },
        2: {
          storyAnalogy:
            'The employee types their secret passphrase and approves the live security chime on their pocket buzzer. The glass booth forwards both answers straight to the real teller and quietly photocopies the stamped entry pass handed back through the slot.',
          storyMappings: [
            {
              storyTerm: 'Secret passphrase',
              technicalTerm: 'Captured user account password',
              tone: 'amber',
            },
            {
              storyTerm: 'Pocket buzzer approval',
              technicalTerm: 'Completed MFA push or TOTP verification',
              tone: 'sky',
            },
            {
              storyTerm: 'Photocopied entry pass',
              technicalTerm: 'Intercepted Set-Cookie session token',
              tone: 'rose',
            },
            {
              storyTerm: 'Booth handshake signature',
              technicalTerm: 'Reverse-proxy TLS JA3 client fingerprint',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in MITRE T1539 and Microsoft Entra Identity Protection (risk analytics focused on session token theft): high-risk AiTM sign-in alert where the TLS fingerprint (JA3) and IP of the MFA step belong to a reverse-proxy server (indicating the user did not communicate directly with the identity provider). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1550.004 (pairing parent/child process and destination fields) and contain the offending session.',
        },
        3: {
          storyAnalogy:
            'From another city, the fraudster flashes the photocopied entry pass at the mailroom door, bypassing both the password desk and the pocket buzzer entirely. Inside, the fraudster adds a secret forwarding tray that diverts sensitive correspondence out of sight.',
          storyMappings: [
            {
              storyTerm: 'Flashing the photocopied pass',
              technicalTerm: 'Replaying ESTSAUTHPERSISTENT session cookie',
              tone: 'amber',
            },
            {
              storyTerm: 'Second city entrance',
              technicalTerm: 'New attacker IP address reusing the same SessionId',
              tone: 'sky',
            },
            {
              storyTerm: 'Secret forwarding tray',
              technicalTerm: 'Malicious New-InboxRule mailbox rule',
              tone: 'rose',
            },
            {
              storyTerm: 'Mailroom ledger',
              technicalTerm: 'Cloud Unified Audit Log telemetry',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Microsoft Sentinel and Entra Sign-in Logs (post-compromise session correlation queries): identical UniqueTokenIdentifier / SessionId replayed from a second IP address followed by New-InboxRule creation in Unified Audit Logs (demonstrating session cookie hijack and mailbox persistence). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1564.008 (pairing parent/child process and destination fields) and contain the offending session.',
        },
      },
    };
