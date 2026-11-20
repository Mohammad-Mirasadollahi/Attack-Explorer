import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule',
    title: 'Microsoft IR & CISA AA23-320A DFIR — M365 Purview Unified Audit Log MailItemsAccessed & New-InboxRule Forensics',
    category: 'CLOUD_SAAS',
    mitreId: 'T1114.003',
    description:
      'Grounded in Microsoft Incident Response BEC/Cloud Playbooks, CISA Microsoft 365 Audit Logging Guidance, and MITRE ATT&CK T1114.003 / T1564.008: after hijacking an Exchange Online session, an attacker creates a stealthy Inbox Rule via OWA/PowerShell (Operation="New-InboxRule" or "Set-InboxRule" with MoveToFolder="RSS Feeds" and ForwardTo) and exfiltrates sensitive messages tracked via Microsoft Purview Unified Audit Log (UAL) MailItemsAccessed (InternetMessageId + FolderPathName + SessionId).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Hijacked OWA / Graph Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Exchange Online REST / EWS', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'New-InboxRule (RSS Feeds)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Purview Unified Audit Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'MailItemsAccessed (Sync/Bind)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Stealthy Exchange Online Inbox Rule Creation (UAL Operation="New-InboxRule")',
        narration:
          'To hide incoming security alerts and wire-transfer replies from the mailbox owner while forwarding copies externally, the actor invokes New-InboxRule via OWA. The Microsoft Purview Unified Audit Log records Operation="New-InboxRule" with Parameters showing SubjectContainsWords="Invoice,Wire,MFA", MoveToFolder="RSS Subscriptions", MarkAsRead="True", and ForwardTo.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1564.008 - Hide Artifacts: Email Hiding Rules)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations New-InboxRule,Set-InboxRule,UpdateInboxRules',
          'UAL Parameters: Name=".”, SubjectContainsWords="Invoice;Wire;Security", MoveToFolder="RSS Subscriptions", MarkAsRead="True"',
        ],
        defenseMitigation:
          'Disable external auto-forwarding on Remote Domains in Exchange Online (AutoForwardEnabled $false) and alert on any New-InboxRule, Set-InboxRule, or EWS UpdateInboxRules event that moves messages to RSS Feeds, Deleted Items, or Junk Email.',
        logs: [
          {
            id: 'dfir-m365-1',
            timestamp: '10:15:04.220',
            source: 'Network',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'w3wp.exe',
            CommandLine: 'UAL New-InboxRule Mailbox=cfo@corp.com MoveToFolder="RSS Subscriptions" MarkAsRead=True',
            raw: '{"CreationTime":"2026-11-03T10:15:04Z","Operation":"New-InboxRule","Workload":"Exchange","UserId":"cfo@corp.com","ClientIP":"198.51.100.91:44120","Parameters":[{"Name":"Name","Value":"."},{"Name":"SubjectContainsWords","Value":"Invoice;Wire;MFA"},{"Name":"MoveToFolder","Value":"RSS Subscriptions"},{"Name":"MarkAsRead","Value":"True"}]}',
            parsedFields: {
              AuditWorkload: 'Microsoft Purview Unified Audit Log (Exchange)',
              Operation: 'New-InboxRule',
              ClientIpAddress: '198.51.100.91',
              RuleParameters: 'SubjectContainsWords="Invoice;Wire;MFA" -> MoveToFolder="RSS Subscriptions"',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Mailbox Search & Item Access Attribution via MailItemsAccessed (Bind vs Sync)',
        narration:
          'Next, the actor searches the mailbox for "password", "contract", and "routing number" and opens matching messages. Exchange Online Advanced Auditing records Operation="MailItemsAccessed" containing OperationProperties (MailAccessType="Bind" for individual item reads or "Sync" for bulk folder synchronization), Folders.FolderItems.InternetMessageId, and Folders.Path ("/Sent Items").',
        activeNodes: ['firewall', 'ad', 'siem'],
        mitreTactic: 'Collection (T1114.002 - Email Collection: Remote Email Collection)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations MailItemsAccessed -FreeText "198.51.100.91"',
          'UAL Field: OperationProperties.MailAccessType = "Bind" | IsThrottled = "False"',
          'UAL Field: Folders[].Path = "/Sent Items" | FolderItems[].InternetMessageId = "<91a8b2@corp.com>"',
        ],
        defenseMitigation:
          'Verify that MailItemsAccessed auditing is enabled on all Exchange Online mailboxes and monitor IsThrottled="True" (if a mailbox exceeds >2,500 binds in 24 hours, assume the entire mailbox was accessed).',
        logs: [
          {
            id: 'dfir-m365-2',
            timestamp: '10:16:12.804',
            source: 'Network',
            severity: 'critical',
            EventCode: 2,
            ProcessName: 'w3wp.exe',
            CommandLine: 'UAL MailItemsAccessed (MailAccessType=Bind) on cfo@corp.com /Sent Items',
            raw: '{"CreationTime":"2026-11-03T10:16:12Z","Operation":"MailItemsAccessed","Workload":"Exchange","MailboxOwnerUPN":"cfo@corp.com","ClientIPAddress":"198.51.100.91","ClientInfoString":"Client=OWA;Action=ViaProxy","OperationProperties":[{"Name":"MailAccessType","Value":"Bind"},{"Name":"IsThrottled","Value":"False"}],"Folders":[{"Path":"/Sent Items","FolderItems":[{"InternetMessageId":"<91a8b204@corp.com>","SizeInBytes":482910}]}]}',
            parsedFields: {
              Operation: 'MailItemsAccessed',
              MailAccessType: 'Bind (Direct Message Read)',
              FolderPath: '/Sent Items',
              InternetMessageId: '<91a8b204@corp.com> (482,910 bytes)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: OAuth App Consent Persistence (Operation="Consent to application") & Session Revocation',
        narration:
          'To retain persistent API access to the mailbox even after the user resets their password, the actor grants OAuth Mail.ReadWrite consent to a rogue multi-tenant application, logged in the Unified Audit Log under Workload="AzureActiveDirectory" Operation="Consent to application".',
        activeNodes: ['attacker', 'target', 'siem'],
        mitreTactic: 'Persistence (T1098.003 - Account Manipulation: OAuth Application Consent)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations "Consent to application","Add OAuth2PermissionGrant"',
          'ModifiedProperties: ConsentAction.Permissions="Scope: Mail.ReadWrite, offline_access"',
          'Remediation: Revoke-MgUserSignInSession -UserId cfo@corp.com; Remove-InboxRule',
        ],
        defenseMitigation:
          'Restrict user consent to verified publishers in Microsoft Entra ID (Admin Consent Workflow) and audit all OAuth2PermissionGrant entries granting Mail.Read or Mail.ReadWrite.',
        logs: [
          {
            id: 'dfir-m365-3',
            timestamp: '10:18:01.110',
            source: 'Network',
            severity: 'critical',
            EventCode: 3,
            ProcessName: 'w3wp.exe',
            CommandLine: 'UAL Consent to application (Scope: Mail.ReadWrite, offline_access)',
            raw: '{"CreationTime":"2026-11-03T10:18:01Z","Operation":"Consent to application","Workload":"AzureActiveDirectory","UserId":"cfo@corp.com","ClientIP":"198.51.100.91","Target":[{"ID":"AppId_7f91a02b"}],"ModifiedProperties":[{"Name":"ConsentAction.Permissions","NewValue":"PrincipalId: cfo@corp.com, ResourceId: Exchange, Scope: Mail.ReadWrite offline_access"}]}',
            parsedFields: {
              AuditWorkload: 'AzureActiveDirectory (Entra ID)',
              Operation: 'Consent to application',
              GrantedScopes: 'Mail.ReadWrite, offline_access',
              ClientIp: '198.51.100.91',
            },
          },
        ],
      },
    ],
  };
