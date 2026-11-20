import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office park that offers a handy short pairing code so smart TVs and printers without keyboards can sign in easily. A con artist walks up to the pairing booth, grabs a fresh nine-character code, mails it to an employee claiming it unlocks an urgent meeting invite, and waits while the employee types the code on the official corporate login page; the instant the employee clicks approve, the con artist receives a master family-of-apps pass that unlocks email, file lockers, and team chat.',
      storyMappings: [
        {
          storyTerm: 'Grabbing a nine-character smart-TV pairing code for an employee to type',
          technicalTerm: 'OAuth 2.0 /devicecode request and victim redemption on microsoft.com/devicelogin',
          tone: 'amber',
        },
        {
          storyTerm: 'Master family-of-apps pass unlocking multiple doors at once',
          technicalTerm: 'Family of Client IDs (FOCI) refresh token exchange across Microsoft Graph scopes',
          tone: 'sky',
        },
        {
          storyTerm: 'Reading mail, file lockers, and team chat silently',
          technicalTerm: 'Microsoft Graph API enumeration of Mail, OneDrive, and Teams messages',
          tone: 'rose',
        },
        {
          storyTerm: 'Closing the keyless pairing loophole',
          technicalTerm: 'Entra ID Conditional Access policy blocking authenticationTransfer / deviceCodeFlow',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Requesting a legitimate nine-character device-pairing code from the cloud lobby, the phisher sends it to a targeted employee inside a realistic invitation lure so the employee unwittingly signs in with their real password and MFA on the genuine company login page.',
        storyMappings: [
          {
            storyTerm: 'Requesting a legitimate device-pairing code',
            technicalTerm: 'Attacker POST to /oauth2/v2.0/devicecode obtaining user_code and device_code',
            tone: 'amber',
          },
          {
            storyTerm: 'Genuine company login page fooled by the lure',
            technicalTerm: 'Victim authenticating with full MFA at https://microsoft.com/devicelogin',
            tone: 'sky',
          },
          {
            storyTerm: 'Attacker silently polling until the green light flashes',
            technicalTerm: 'Polling /oauth2/v2.0/token until Entra ID delivers the victim access and refresh tokens',
            tone: 'rose',
          },
          {
            storyTerm: 'Sign-in log showing the distinct pairing protocol',
            technicalTerm: 'Entra ID SigninLogs flagging authenticationProtocol == "deviceCode"',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Because Microsoft trusted family of workplace applications shares a single interchangeable master refresh voucher, the intruder immediately swaps the freshly captured token for brand-new passes spanning multiple high-value office wings without ever prompting the employee again.',
        storyMappings: [
          {
            storyTerm: 'Interchangeable master refresh voucher across apps',
            technicalTerm: 'Family of Client IDs (FOCI) refresh token exchanged across sibling first-party client IDs',
            tone: 'amber',
          },
          {
            storyTerm: 'Swapping for fresh passes spanning multiple wings',
            technicalTerm: 'Minting new access tokens for Microsoft Graph, Teams, SharePoint, and Azure CLI',
            tone: 'sky',
          },
          {
            storyTerm: 'Zero second prompt shown to the employee',
            technicalTerm: 'Silent token refresh operating seamlessly from attacker infrastructure',
            tone: 'rose',
          },
          {
            storyTerm: 'Cross-app token trail in audit logs',
            technicalTerm: 'Multiple Entra Sign-In events sharing the same SessionId across different AppIds',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Armed with broad Graph reading passes, the intruder programmatically searches the victim inbox, downloads sensitive shared documents from cloud lockers, and scans internal chat channels for passwords and wire-transfer threads.',
        storyMappings: [
          {
            storyTerm: 'Programmatically searching inbox, lockers, and chat channels',
            technicalTerm: 'Automated Microsoft Graph API calls to /me/messages, /me/drive, and /me/chats',
            tone: 'amber',
          },
          {
            storyTerm: 'Hunting passwords and wire-transfer threads',
            technicalTerm: 'Keyword search queries targeting credentials, VPN guides, and financial approvals',
            tone: 'sky',
          },
          {
            storyTerm: 'Unified audit trail exposing accessed items',
            technicalTerm: 'Purview MailItemsAccessed and SharePoint FileDownloaded events tied to the rogue session',
            tone: 'rose',
          },
          {
            storyTerm: 'Blocking device-code abuse proactively',
            technicalTerm: 'Conditional Access authentication flow policy blocking Device Code Flow',
            tone: 'emerald',
          },
        ],
      },
    },
  };
