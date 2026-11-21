import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a patient espionage crew softly trying one spare key per evening from scattered neighborhood cars against a forgotten backyard testing shed that never got a modern two-factor deadbolt. Once inside the dusty shed, they discover an old cross-campus courier badge that was accidentally left with master mailroom powers, use it to print brand-new official courier badges inside the corporate headquarters, and silently haul out executive mailbags through the automated mail chute.',
      storyMappings: [
        {
          storyTerm: 'Trying one key per evening from scattered neighborhood cars',
          technicalTerm: 'Low-volume residential-proxy password spray evading IP lockouts and alerts',
          tone: 'amber',
        },
        {
          storyTerm: 'Forgotten backyard testing shed lacking a two-factor deadbolt',
          technicalTerm: 'Legacy non-production test tenant account without MFA enabled',
          tone: 'sky',
        },
        {
          storyTerm: 'Old cross-campus courier badge printing fresh headquarters badges',
          technicalTerm: 'Legacy OAuth test app with elevated permissions registering new privileged Service Principals',
          tone: 'rose',
        },
        {
          storyTerm: 'Hauling out executive mailbags through the automated mail chute',
          technicalTerm: 'Machine-to-machine client_credentials OAuth exfiltration via Exchange Web Services (EWS)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Avoiding noisy repeated knocks that would wake the guard dogs, the spy crew tries only a handful of common passwords slowly across hundreds of ordinary household street addresses until a forgotten back-lot testing shed with no second-factor padlock quietly clicks open.',
        storyMappings: [
          {
            storyTerm: 'Hundreds of ordinary household street addresses',
            technicalTerm: 'Distributed residential proxy IP network defeating IP reputation blocks',
            tone: 'amber',
          },
          {
            storyTerm: 'Trying only a handful of passwords slowly',
            technicalTerm: 'Low-and-slow password spray staying below Entra ID Smart Lockout thresholds',
            tone: 'sky',
          },
          {
            storyTerm: 'Forgotten back-lot testing shed with no second padlock',
            technicalTerm: 'Legacy non-production test tenant account lacking MFA enforcement',
            tone: 'rose',
          },
          {
            storyTerm: 'Gate sign-in book recording dispersed arrivals',
            technicalTerm: 'Microsoft Entra ID SigninLogs showing distributed ASNs hitting legacy accounts',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Analyze Microsoft Entra ID SigninLogs (cloud identity telemetry capturing every authentication attempt, ASN, and MFA claim) for low-volume distributed password sprays rotating across residential proxy ASNs against single-factor legacy or non-production accounts. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1110.003 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      2: {
        storyAnalogy:
          'Rummaging inside the unlocked testing shed, the spies uncover an abandoned automated courier badge that still carries wide building-wide authority into the main corporate tower, and immediately use it to mint shiny new official machine badges armed with full mailroom keys.',
        storyMappings: [
          {
            storyTerm: 'Abandoned automated courier badge in the shed',
            technicalTerm: 'Legacy cross-tenant OAuth test application holding elevated Graph permissions',
            tone: 'amber',
          },
          {
            storyTerm: 'Minting shiny new official machine badges',
            technicalTerm: 'Creating new rogue Entra ID OAuth applications and Service Principals',
            tone: 'sky',
          },
          {
            storyTerm: 'Full mailroom master keys assigned to the new badges',
            technicalTerm: 'Granting full_access_as_app Exchange Web Services (EWS) application role',
            tone: 'rose',
          },
          {
            storyTerm: 'Stepping from the back shed into the main corporate tower',
            technicalTerm: 'Cross-tenant pivot from legacy test environment into production Microsoft 365',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Presenting their freshly minted machine-only courier badge straight at the automated postal bay, the spies bypass human lobby guards altogether and quietly wheel out corporate leadership correspondence without ever triggering a human sign-in prompt.',
        storyMappings: [
          {
            storyTerm: 'Machine-only courier badge skipping lobby guards',
            technicalTerm: 'OAuth 2.0 grant_type=client_credentials non-interactive daemon authentication',
            tone: 'amber',
          },
          {
            storyTerm: 'Automated postal bay',
            technicalTerm: 'Exchange Web Services (EWS) API accessed with full_access_as_app scope',
            tone: 'sky',
          },
          {
            storyTerm: 'Corporate leadership correspondence wheeled out',
            technicalTerm: 'Targeted exfiltration of senior executive and security team email mailboxes',
            tone: 'rose',
          },
          {
            storyTerm: 'Silent access surviving user password resets',
            technicalTerm: 'Persistent OAuth app secret credentials independent of human user accounts',
            tone: 'emerald',
          },
        ],
      },
    },
  };
