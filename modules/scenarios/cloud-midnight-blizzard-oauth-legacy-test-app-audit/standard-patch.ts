import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a high-security government campus where an overlooked backyard testing shed still lacks a two-factor deadbolt. After slowly trying common keys from residential driveways until the shed opens, a spy discovers an old automated courier app inside, attaches their own fresh secret key and full-mailroom badge to that app, and quietly syncs sensitive executive mailboxes straight out through the automated postal chute.',
      storyMappings: [
        {
          storyTerm: 'Slowly trying keys from residential driveways on an unguarded test shed',
          technicalTerm: 'Low-volume residential proxy password spray against a legacy non-MFA tenant account',
          tone: 'amber',
        },
        {
          storyTerm: 'Attaching a fresh secret key and full-mailroom badge to an old courier app',
          technicalTerm: 'Service Principal Add service principal credentials and full_access_as_app role grant',
          tone: 'sky',
        },
        {
          storyTerm: 'Quietly syncing executive mailboxes through the automated postal chute',
          technicalTerm: 'OAuth Bearer token Exchange Web Services (EWS) mailbox sync logged via MailItemsAccessed',
          tone: 'rose',
        },
        {
          storyTerm: 'Emergency directive closing every legacy side door',
          technicalTerm: 'CISA ED 24-02 audit of OAuth Service Principals, credentials, and EWS access',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Spreading tiny bursts of password guesses across thousands of home internet connections so threshold alarms never ring, the intruder unlocks an old non-production testing account left without multi-factor protection.',
        storyMappings: [
          {
            storyTerm: 'Thousands of home internet connections hiding the spray',
            technicalTerm: 'Residential proxy network distributing low-volume Entra ID password sprays',
            tone: 'amber',
          },
          {
            storyTerm: 'Old non-production account lacking a second lock',
            technicalTerm: 'Legacy test tenant account without Conditional Access MFA enforcement',
            tone: 'sky',
          },
          {
            storyTerm: 'Stepping inside the quiet testing wing',
            technicalTerm: 'Initial authenticated foothold inside the victim cloud test tenant',
            tone: 'rose',
          },
          {
            storyTerm: 'Sign-in ledger showing spread-out guesses',
            technicalTerm: 'Entra ID SigninLogs correlating distributed residential ASNs against one legacy user',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Spotting an over-privileged legacy automated courier application inside the tenant, the intruder stamps a brand-new secret password onto the app badge and assigns it the master full-access mailroom key covering corporate mailboxes.',
        storyMappings: [
          {
            storyTerm: 'Over-privileged legacy automated courier app',
            technicalTerm: 'Legacy OAuth Enterprise Application / Service Principal holding elevated Graph rights',
            tone: 'amber',
          },
          {
            storyTerm: 'Stamping a brand-new secret password onto the app badge',
            technicalTerm: 'Entra Audit Log "Update application – Certificates and secrets management" key addition',
            tone: 'sky',
          },
          {
            storyTerm: 'Assigning the master full-access mailroom key',
            technicalTerm: 'Granting Exchange Online full_access_as_app application role to the Service Principal',
            tone: 'rose',
          },
          {
            storyTerm: 'Non-human persistence channel',
            technicalTerm: 'Machine-to-machine OAuth credentials immune to human user password resets',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Presenting the newly minted courier token directly to the Exchange postal gateway, the intruder systematically pulls targeted executive correspondence while leaving clear machine-access footprints inside the Purview mail-access diary.',
        storyMappings: [
          {
            storyTerm: 'Presenting the courier token to the postal gateway',
            technicalTerm: 'OAuth 2.0 Bearer token authenticating directly to Exchange Web Services (EWS)',
            tone: 'amber',
          },
          {
            storyTerm: 'Systematically pulling executive correspondence',
            technicalTerm: 'Programmatic EWS SyncFolderItems / GetItem exfiltration of sensitive mailboxes',
            tone: 'sky',
          },
          {
            storyTerm: 'Machine-access footprints in the mail diary',
            technicalTerm: 'Purview MailItemsAccessed telemetry naming the exact hijacked AppId',
            tone: 'rose',
          },
          {
            storyTerm: 'Restricting which mailboxes an app may ever touch',
            technicalTerm: 'Exchange Application Access Policies scoping OAuth apps strictly to designated mailboxes',
            tone: 'emerald',
          },
        ],
      },
    },
  };
