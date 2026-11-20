import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
          'Inspect OWA and Exchange Online token validation telemetry alongside CISA AA23-193A indicators (forensic guidance on Storm-0558) flagging JWT headers referencing the retired 2016 MSA consumer signing kid presented to enterprise Exchange Online tenants.',
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
          'Audit Exchange Online Unified Audit Logs (central Microsoft 365 activity records) for AppId == "00000002-0000-0ff1-ce00-000000000000" paired with an empty ClientAppId and zero matching Entra ID SignInLogs entries (the exact Storm-0558 token forgery gap).',
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
          'Run KQL hunting queries across OfficeActivity and CloudAppEvents (Microsoft Purview advanced mailbox audit streams) filtering for Operation == "MailItemsAccessed", AppId == "00000002-0000-0ff1-ce00-000000000000", and ClientInfoString containing Action=ViaProxy (isolating Storm-0558 diplomatic mailbox theft).',
      },
    },
  };
