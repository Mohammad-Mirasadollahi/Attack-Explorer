import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-entra-id-prt-roadtools-device-registration-forensics',
    title: 'Microsoft MSRC & Dirk-jan Mollema DFIR — Entra ID Primary Refresh Token (PRT) & Rogue Device Registration Forensics',
    category: 'CLOUD_SAAS',
    mitreId: 'T1528',
    description:
      'Grounded in Microsoft Entra ID Primary Refresh Token (PRT) architecture documentation, Dirk-jan Mollema (ROADtools) research, and CISA Cloud Identity guidance: an attacker uses a stolen session or PRT cookie (x-ms-RefreshTokenCredential) to register a rogue Entra ID Joined device via the Device Registration Service (urn:ms-drs:enterpriseregistration.windows.net), minting a hardware-less Primary Refresh Token with an embedded MFA claim (AuthenticationRequirement="multiFactorAuthentication", IncomingTokenType="primaryRefreshToken").',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rogue Device (roadtx)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Entra ID DRS Service', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Registered Device Object', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Entra Audit & Sign-In Logs', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'PRT Sign-In (IncomingToken PRT)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Token Acquisition for Device Registration Service (Resource=urn:ms-drs:enterpriseregistration.windows.net)',
        narration:
          'Using a captured refresh token or browser session, the actor requests an access token for resource urn:ms-drs:enterpriseregistration.windows.net (AppId 01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9) using the Microsoft Authentication Broker client ID (29d9ed98-a469-4536-ade2-f981bc1d605e). Entra ID Non-Interactive Sign-In Logs record this token exchange.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Credential Access (T1528 - Steal Application Access Token: Entra DRS Token)',
        technicalCommands: [
          'Entra Sign-In Log: AppDisplayName="Microsoft Authentication Broker" (29d9ed98-a469-4536-ade2-f981bc1d605e)',
          'ResourceDisplayName: "Device Registration Service" (01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9)',
        ],
        defenseMitigation:
          'Enforce Conditional Access policies requiring compliant or Hybrid Azure AD Joined devices before allowing access to the Device Registration Service resource.',
        logs: [
          {
            id: 'dfir-entra-1',
            timestamp: '16:12:04.115',
            source: 'Network',
            severity: 'high',
            EventCode: 100,
            ProcessName: 'python3',
            CommandLine: 'Entra SignInLogs: Token issued for Device Registration Service (01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9)',
            raw: '{"category":"NonInteractiveUserSignInLogs","userPrincipalName":"admin_cloud@corp.com","appDisplayName":"Microsoft Authentication Broker","appId":"29d9ed98-a469-4536-ade2-f981bc1d605e","resourceDisplayName":"Device Registration Service","resourceId":"01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9","ipAddress":"198.51.100.62"}',
            parsedFields: {
              LogCategory: 'Entra ID NonInteractiveUserSignInLogs',
              AppDisplayName: 'Microsoft Authentication Broker',
              ResourceDisplayName: 'Device Registration Service (DRS)',
              SourceIp: '198.51.100.62',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Rogue Device Registration in Entra ID Directory Audit Logs (Operation="Register device")',
        narration:
          'The actor submits a locally generated RSA transport key and device certificate CSR to the DRS endpoint. Entra ID Audit Logs record Category="Device", ActivityDisplayName="Register device" (and "Add registered users to device" / "Add registered owner to device"), creating a persistent DeviceId in the tenant.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1098.005 - Account Manipulation: Device Registration)',
        technicalCommands: [
          'Entra Audit Log: OperationName="Register device" Category="Device" LoggedByService="Device Registration Service"',
          'AdditionalDetails: DeviceId="d4819c02-...", DeviceOSType="Windows", TrustType="Workplace / AzureAd"',
        ],
        defenseMitigation:
          'Monitor Entra ID Audit Logs for "Register device" events originating from anomalous countries, VPN ASNs, or Linux/Python User-Agents, and limit the maximum number of devices per user.',
        logs: [
          {
            id: 'dfir-entra-2',
            timestamp: '16:12:08.540',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'python3',
            CommandLine: 'Entra AuditLogs: Register device WIN-DESKTOP-991A for admin_cloud@corp.com',
            raw: '{"category":"AuditLogs","operationName":"Register device","result":"success","initiatedBy":{"user":{"userPrincipalName":"admin_cloud@corp.com","ipAddress":"198.51.100.62"}},"targetResources":[{"displayName":"WIN-DESKTOP-991A","type":"Device","id":"d4819c02-5511-4a90-8111-223344556677"}]}',
            parsedFields: {
              LogCategory: 'Entra ID AuditLogs (Device Registration Service)',
              OperationName: 'Register device',
              RegisteredDeviceName: 'WIN-DESKTOP-991A (DeviceId d4819c02-...)',
              InitiatingUser: 'admin_cloud@corp.com',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Primary Refresh Token (PRT) Sign-In & Persistent Session Key Forensics (IncomingTokenType=primaryRefreshToken)',
        narration:
          'Using the registered device certificate and software session key, the actor requests a Primary Refresh Token (PRT) valid for 14 days (renewable for 90 days) that persists across user password changes until the device object itself is disabled or deleted in Entra ID. Subsequent sign-ins show IncomingTokenType="primaryRefreshToken" and DeviceDetail.deviceId="d4819c02-...".',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1550.001 - Primary Refresh Token Persistence Across Password Reset)',
        technicalCommands: [
          'Entra SignInLogs: incomingTokenType="primaryRefreshToken" deviceDetail.deviceId="d4819c02-5511-4a90-8111-223344556677"',
          'Remediation: Set-MgDevice -DeviceId d4819c02-... -AccountEnabled:$false; Revoke-MgUserSignInSession',
        ],
        defenseMitigation:
          'During Entra ID incident response, always audit all devices registered to the compromised user; resetting a user password without disabling rogue registered devices allows a stolen PRT + device key to mint new tokens.',
        logs: [
          {
            id: 'dfir-entra-3',
            timestamp: '16:12:15.902',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'python3',
            CommandLine: 'Entra SignInLogs: IncomingTokenType=primaryRefreshToken from DeviceId d4819c02-...',
            raw: '{"category":"SignInLogs","userPrincipalName":"admin_cloud@corp.com","resourceDisplayName":"Microsoft Graph","incomingTokenType":"primaryRefreshToken","authenticationRequirement":"multiFactorAuthentication","deviceDetail":{"deviceId":"d4819c02-5511-4a90-8111-223344556677","displayName":"WIN-DESKTOP-991A"},"ipAddress":"198.51.100.62"}',
            parsedFields: {
              LogCategory: 'Entra ID SignInLogs',
              IncomingTokenType: 'primaryRefreshToken (PRT)',
              DeviceId: 'd4819c02-5511-4a90-8111-223344556677',
              IrRemediation: 'Disable/delete rogue DeviceId + Revoke-MgUserSignInSession',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office park that issues long-lived resident smartcards to company-owned laptops so workers stay signed in seamlessly across every building. Using a hijacked login token, an intruder walks up to the laptop-enrollment desk, registers a completely fake phantom laptop into the corporate directory, and collects a genuine long-lived smartcard that lets them mint fresh building passes quietly even from off-site machines.',
      storyMappings: [
        {
          storyTerm: 'Requesting an appointment ticket for the laptop-enrollment desk',
          technicalTerm: 'Acquiring an OAuth token for Device Registration Service (urn:ms-drs:enterpriseregistration.windows.net)',
          tone: 'amber',
        },
        {
          storyTerm: 'Registering a completely fake phantom laptop in the directory',
          technicalTerm: 'ROADtools rogue device join logged in Entra Directory Audit Operation="Register device"',
          tone: 'sky',
        },
        {
          storyTerm: 'Collecting a genuine long-lived resident smartcard',
          technicalTerm: 'Issuance of a Primary Refresh Token (PRT) and encrypted session key bound to the rogue device',
          tone: 'rose',
        },
        {
          storyTerm: 'Minting fresh passes silently across every cloud building',
          technicalTerm: 'Using the stolen PRT cookie to satisfy device-based Conditional Access persistently',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding a stolen user sign-in credential, the intruder asks the identity gatehouse for a special pass scoped specifically to the company Device Enrollment Desk, preparing to add an attacker-controlled machine to the trusted fleet.',
        storyMappings: [
          {
            storyTerm: 'Special pass scoped to the Device Enrollment Desk',
            technicalTerm: 'Access token requested for resource urn:ms-drs:enterpriseregistration.windows.net',
            tone: 'amber',
          },
          {
            storyTerm: 'Stolen user sign-in credential',
            technicalTerm: 'Compromised corporate user identity or MFA-satisfied refresh token',
            tone: 'sky',
          },
          {
            storyTerm: 'Gatehouse diary recording the enrollment token',
            technicalTerm: 'Entra ID Sign-In Logs recording non-Windows or ROADtools DRS token requests',
            tone: 'rose',
          },
          {
            storyTerm: 'Gateway to trusted fleet membership',
            technicalTerm: 'Default Entra ID setting allowing standard users to register personal or joined devices',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Presenting that enrollment pass alongside a freshly generated machine key pair, the intruder registers a phantom computer directly into the corporate directory, receiving a genuine company device certificate while the directory audit ledger stamps a brand-new registration line.',
        storyMappings: [
          {
            storyTerm: 'Registering a phantom computer into the directory',
            technicalTerm: 'ROADtools roadtx device registration creating a rogue Entra ID Device object',
            tone: 'amber',
          },
          {
            storyTerm: 'Genuine company device certificate returned',
            technicalTerm: 'X.509 device certificate signed by the tenant Device Registration Service',
            tone: 'sky',
          },
          {
            storyTerm: 'Directory audit ledger stamping the new device',
            technicalTerm: 'Entra ID Directory Audit Log Operation="Register device" or "Add device"',
            tone: 'rose',
          },
          {
            storyTerm: 'Sneaking past managed-device checks',
            technicalTerm: 'Attacker laptop masquerading as an Entra-joined corporate endpoint',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Using the newly issued phantom device certificate, the intruder requests a long-lived Primary Resident Smartcard and its matching cryptographic session key, allowing them to stamp fresh multi-factor-satisfied cloud passes persistently until defenders delete the rogue device.',
        storyMappings: [
          {
            storyTerm: 'Long-lived Primary Resident Smartcard',
            technicalTerm: 'Entra ID Primary Refresh Token (PRT) carrying persistent MFA claims',
            tone: 'amber',
          },
          {
            storyTerm: 'Matching cryptographic session key',
            technicalTerm: 'Derived PRT session key enabling ROADtools to mint fresh x-ms-RefreshTokenCredential cookies',
            tone: 'sky',
          },
          {
            storyTerm: 'Persistent access across cloud applications',
            technicalTerm: 'Replaying PRT-derived cookies to access Microsoft 365, Azure, and Graph APIs',
            tone: 'rose',
          },
          {
            storyTerm: 'Ejecting the phantom laptop permanently',
            technicalTerm: 'Disabling/deleting the rogue DeviceId in Entra ID and revoking all refresh tokens',
            tone: 'emerald',
          },
        ],
      },
    },
  };
