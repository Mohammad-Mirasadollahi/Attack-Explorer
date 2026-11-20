import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'cloud-entra-id-conditional-access-device-code-phishing-audit',
    title: 'Microsoft Defender TI, CISA & MITRE — Entra ID OAuth 2.0 Device Code Flow (/devicecode) Token Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1528',
    description:
      'Grounded in Microsoft Defender Threat Intelligence (Storm-2372 / Midnight Blizzard Device Code campaigns), CISA cloud identity advisories, and MITRE ATT&CK T1528: DFIR analysts investigate OAuth 2.0 Device Authorization Grant (/oauth2/v2.0/devicecode) phishing where a user enters a 9-character user_code on microsoft.com/devicelogin, allowing a remote polling client to acquire Refresh and Access tokens for Microsoft Graph.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Remote Polling Client (/token)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Entra ID /oauth2/v2.0/devicecode', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'User Browser (microsoft.com/devicelogin)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Entra ID SigninLogs & Defender XDR', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Microsoft Graph API (Mail.Read / Files)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: OAuth 2.0 /devicecode Request & User Code Redemption on devicelogin',
        narration:
          'An external client requests a device_code and 9-character user_code from login.microsoftonline.com/common/oauth2/v2.0/devicecode using a public client_id. When the target user enters the code at microsoft.com/devicelogin, Entra ID records a SigninLogs entry with AuthenticationProtocol="deviceCode".',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access (T1528 - Steal Application Access Token)',
        technicalCommands: [
          'SigninLogs | where AuthenticationProtocol == "deviceCode"',
          'AADNonInteractiveUserSignInLogs | where AuthenticationProtocol == "deviceCode"',
        ],
        defenseMitigation:
          'Block the Device Code authentication flow via Entra ID Conditional Access ("Authentication flows -> Transfer methods -> Device code flow") for all users except dedicated conference-room hardware.',
        logs: [
          {
            id: 'entra-dc-1',
            timestamp: '11:20:05.312',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 0,
            ProcessName: 'EntraDeviceLogin',
            CommandLine: 'POST /common/oauth2/v2.0/token (grant_type=urn:ietf:params:oauth:grant-type:device_code)',
            raw: 'SigninLogs: {"OperationName":"Sign-in activity","AuthenticationProtocol":"deviceCode","AppDisplayName":"Microsoft Office","UserPrincipalName":"j.smith@corp.local","IPAddress":"203.0.113.88","ResultType":"0"}',
            parsedFields: {
              AuthenticationProtocol: 'deviceCode (OAuth 2.0 RFC 8628)',
              RedemptionPortal: 'https://microsoft.com/devicelogin',
              PollingClientIp: '203.0.113.88',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Family of Client IDs (FOCI) Refresh Token Exchange Across Graph Scopes',
        narration:
          'Once the device_code poll succeeds, the remote client receives an OAuth Refresh Token belonging to Microsoft Family of Client IDs (FOCI), enabling silent token exchange across Microsoft Graph, Azure Resource Manager, and Exchange Online scopes in AADNonInteractiveUserSignInLogs.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Defense Evasion (T1550.001 - Application Access Token)',
        technicalCommands: [
          'AADNonInteractiveUserSignInLogs | where UserPrincipalName == "j.smith@corp.local" and IPAddress == "203.0.113.88"',
          'Revoke-MgUserSignInSession -UserId "j.smith@corp.local"',
        ],
        defenseMitigation:
          'Enforce Compliant Device or Hybrid Azure AD Joined device requirements in Conditional Access so tokens redeemed on unmanaged endpoints cannot access Graph resources.',
        logs: [
          {
            id: 'entra-dc-2',
            timestamp: '11:21:19.440',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 0,
            ProcessName: 'EntraTokenService',
            CommandLine: 'POST /common/oauth2/v2.0/token (grant_type=refresh_token, scope=https://graph.microsoft.com/.default)',
            raw: 'AADNonInteractiveUserSignInLogs: {"ResourceDisplayName":"Microsoft Graph","AppDisplayName":"Microsoft Azure CLI","UserPrincipalName":"j.smith@corp.local","IPAddress":"203.0.113.88","TokenIssuerType":"AzureAD"}',
            parsedFields: {
              LogSource: 'AADNonInteractiveUserSignInLogs',
              ExchangedResource: 'Microsoft Graph (https://graph.microsoft.com/.default)',
              TokenFamily: 'FOCI Refresh Token Exchange',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Microsoft Graph API Mail, OneDrive & Teams Message Enumeration Audit',
        narration:
          'Using the minted Graph bearer token, the actor queries /v1.0/me/messages, /v1.0/me/drive/root/children, and /v1.0/me/chats, captured in Microsoft Graph Activity Logs (MicrosoftGraphActivityLogs).',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Collection (T1530 - Data from Cloud Storage)',
        technicalCommands: [
          'MicrosoftGraphActivityLogs | where UserId == "<user-guid>" and RequestUri has_any ("/messages", "/drive/", "/chats")',
          'Confirm-MgRiskyUserCompromised -UserIds @("<user-guid>")',
        ],
        defenseMitigation:
          'Enable MicrosoftGraphActivityLogs diagnostic forwarding to Sentinel and correlate deviceCode sign-ins with subsequent high-volume /me/messages or /drives GET requests from foreign ASNs.',
        logs: [
          {
            id: 'entra-dc-3',
            timestamp: '11:23:02.771',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'MicrosoftGraphAPI',
            CommandLine: 'GET https://graph.microsoft.com/v1.0/me/messages?$top=100',
            raw: 'MicrosoftGraphActivityLogs: {"RequestMethod":"GET","RequestUri":"https://graph.microsoft.com/v1.0/me/messages?$top=100","ResponseStatusCode":200,"IpAddress":"203.0.113.88","Scopes":"Mail.Read Files.Read.All"}',
            parsedFields: {
              DiagnosticTable: 'MicrosoftGraphActivityLogs',
              GraphEndpoint: 'GET /v1.0/me/messages?$top=100',
              ActiveTokenScopes: 'Mail.Read Files.Read.All',
            },
          },
        ],
      },
    ],
  };
