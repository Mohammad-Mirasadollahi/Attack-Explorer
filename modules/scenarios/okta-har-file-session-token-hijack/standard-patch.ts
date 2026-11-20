import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a busy customer-support desk where enterprise administrators mail in full browser traffic recordings to help troubleshoot login glitches, forgetting to black out their own live master wristbands printed inside the packet headers. After breaching the support ticket vault, an intruder lifts those still-live master wristbands straight out of the uploaded recordings, replays them from an overseas proxy to walk straight past multi-factor locks, and mints permanent master API keys before alert response teams slam the door.',
      storyMappings: [
        {
          storyTerm: 'Uploaded troubleshooting recordings leaking live wristbands',
          technicalTerm: 'Unsanitized browser .har files exposing Cookie: sid=... and X-Okta-XsrfToken headers',
          tone: 'amber',
        },
        {
          storyTerm: 'Replaying live wristbands from an overseas proxy past MFA locks',
          technicalTerm: 'Hijacking *-admin.okta.com Super Admin sessions from a foreign VPN ASN (T1550.004)',
          tone: 'sky',
        },
        {
          storyTerm: 'Minting permanent master keys before defenders slam the door',
          technicalTerm: 'Calling system.api_token.create to mint Okta SSWS API tokens or rogue IdPs',
          tone: 'rose',
        },
        {
          storyTerm: 'Real-time security desk catching the teleporting wristband',
          technicalTerm: 'Okta System Log alerting on externalSessionId ASN shift followed by privilege grants',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Ransacking a compromised support-case filing cabinet, the intruder opens raw browser network recordings uploaded by helpful IT admins and immediately extracts active, unredacted administrator session wristbands still stamped inside the headers.',
        storyMappings: [
          {
            storyTerm: 'Raw browser network recordings in support tickets',
            technicalTerm: 'HTTP Archive (.har) JSON diagnostic files uploaded to the Okta support portal',
            tone: 'amber',
          },
          {
            storyTerm: 'Active unredacted administrator wristbands inside headers',
            technicalTerm: 'Live Cookie: sid=... session cookies and X-Okta-XsrfToken values for *-admin.okta.com',
            tone: 'sky',
          },
          {
            storyTerm: 'Forgetting to black out secrets before mailing',
            technicalTerm: 'Unsanitized HAR exports preserving live authentication cookies in plaintext JSON',
            tone: 'rose',
          },
          {
            storyTerm: 'Support cabinet breach feeding downstream targets',
            technicalTerm: 'Upstream support-system access enabling targeted downstream enterprise takeovers',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Scan outbound support attachments and CI/browser diagnostic dumps for .har JSON files containing "name": "sid" and "X-Okta-XsrfToken" headers targeting *-admin.okta.com (enforcing automated HAR sanitization before external upload).',
      },
      2: {
        storyAnalogy:
          'Pasting the lifted session wristband straight into their own browser from an overseas VPN booth, the intruder walks straight into the victim Super Admin control panel without ever typing a password or touching a hardware security key.',
        storyMappings: [
          {
            storyTerm: 'Pasting the lifted wristband into their own browser',
            technicalTerm: 'Injecting stolen sid cookie to impersonate the authenticated Okta administrator',
            tone: 'amber',
          },
          {
            storyTerm: 'Walking straight past passwords and hardware security keys',
            technicalTerm: 'Web Session Cookie replay (MITRE T1550.004) bypassing FIDO2/WebAuthn MFA completely',
            tone: 'sky',
          },
          {
            storyTerm: 'Impossible geographic jump of the same wristband',
            technicalTerm: 'Identical externalSessionId suddenly appearing from a foreign commercial VPN ASN',
            tone: 'rose',
          },
          {
            storyTerm: 'Super Admin control panel reached',
            technicalTerm: 'Full administrative access to the victim enterprise *-admin.okta.com tenant',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Racing against the clock before the temporary wristband expires or defenders spot the sudden address jump, the intruder attempts to print permanent master API keys or bolt on a rogue identity bridge, triggering real-time security alarms at vigilant defender centers.',
        storyMappings: [
          {
            storyTerm: 'Printing permanent master API keys before the clock runs out',
            technicalTerm: 'Okta System Log event system.api_token.create minting long-lived SSWS API tokens',
            tone: 'amber',
          },
          {
            storyTerm: 'Bolting on a rogue identity bridge or boosting privileges',
            technicalTerm: 'user.account.privilege.grant or system.idp.lifecycle.create persistence attempts',
            tone: 'sky',
          },
          {
            storyTerm: 'Vigilant defender centers spotting the ASN jump',
            technicalTerm: 'Cloudflare SIRT and BeyondTrust real-time correlation on externalSessionId ASN shift',
            tone: 'rose',
          },
          {
            storyTerm: 'Slamming the door shut instantly',
            technicalTerm: 'Automated session revocation and IP-binding policies invalidating replayed cookies',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Okta System Logs (central identity audit events) for system.api_token.create, user.account.privilege.grant, or system.idp.lifecycle.create occurring immediately after an ASN or IP change on the same externalSessionId (the exact Cloudflare and BeyondTrust containment trigger).',
      },
    },
  };
