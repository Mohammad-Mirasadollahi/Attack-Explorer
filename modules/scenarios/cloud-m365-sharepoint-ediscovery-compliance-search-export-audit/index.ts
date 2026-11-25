import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'cloud-m365-sharepoint-ediscovery-compliance-search-export-audit',
    title: 'Microsoft Purview DFIR, CISA & MITRE — M365 Purview New-ComplianceSearch & eDiscovery Export Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1114.002',
    description:
      'Grounded in Microsoft Purview eDiscovery auditing documentation, CISA M365 incident response playbooks, and MITRE ATT&CK T1114.002 / T1213.002: DFIR analysts investigate post-compromise abuse of the eDiscovery Manager role where an attacker runs New-ComplianceSearch and New-ComplianceSearchAction -Export across Exchange Online mailboxes and SharePoint/OneDrive sites to bulk-search for credentials and contracts.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Compliance Admin Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Security & Compliance PowerShell (IPPS)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Purview eDiscovery Case Engine', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Microsoft Purview Unified Audit Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Exchange Mailboxes & SharePoint Sites', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: RoleGroupMember Added to eDiscovery Manager in Security & Compliance Center',
        narration:
          'To read mailboxes and SharePoint sites without modifying individual mailbox permissions, the compromised admin adds an account to the eDiscovery Manager role group (Add-RoleGroupMember / Add-eDiscoveryCaseAdmin), logged in the Unified Audit Log.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Privilege Escalation (T1098.003 - Additional Cloud Roles)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations "Add-RoleGroupMember","Add-eDiscoveryCaseAdmin"',
          'Get-RoleGroupMember -Identity "eDiscovery Manager"',
        ],
        defenseMitigation:
          'Require Entra ID Privileged Identity Management (PIM) eligible activation with MFA and dual-approver workflow for Compliance Administrator and eDiscovery Manager role groups.',
        logs: [
          {
            id: 'm365-edisc-1',
            timestamp: '18:10:05.410',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'ComplianceCenterPowerShell',
            CommandLine: 'Add-RoleGroupMember -Identity "eDiscovery Manager" -Member "admin_clark@corp.local"',
            raw: 'UnifiedAuditLog: {"Operation":"Add-RoleGroupMember","Workload":"SecurityComplianceCenter","UserId":"admin_clark@corp.local","Parameters":[{"Name":"Identity","Value":"eDiscovery Manager"},{"Name":"Member","Value":"admin_clark@corp.local"}]}',
            parsedFields: {
              AuditWorkload: 'SecurityComplianceCenter',
              Operation: 'Add-RoleGroupMember (eDiscovery Manager)',
              TargetAccount: 'admin_clark@corp.local',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Tenant-Wide Keyword Query via New-ComplianceSearch & Start-ComplianceSearch',
        narration:
          'Connecting via Connect-IPPSSession, the actor executes New-ComplianceSearch with -ExchangeLocation All -SharePointLocation All and a ContentMatchQuery targeting password, key, vpn, or acquisition keywords, generating SearchCreated and SearchStarted audit records.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Collection (T1213.002 - Data from Information Repositories: SharePoint)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations "New-ComplianceSearch","Start-ComplianceSearch","SearchCreated"',
          'Get-ComplianceSearch | Select-Object Name,CreatedBy,ContentMatchQuery,Status',
        ],
        defenseMitigation:
          'Configure Purview eDiscovery Compliance Boundaries (Security Filter scopes) so regional or departmental compliance officers cannot run tenant-wide ExchangeLocation All searches.',
        logs: [
          {
            id: 'm365-edisc-2',
            timestamp: '18:12:30.118',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'ComplianceSearchEngine',
            CommandLine: 'New-ComplianceSearch -Name "Audit_Check_Q4" -ExchangeLocation All -SharePointLocation All -ContentMatchQuery "password OR client_secret"',
            raw: 'UnifiedAuditLog: {"Operation":"SearchCreated","Workload":"SecurityComplianceCenter","UserId":"admin_clark@corp.local","CaseName":"InternalSync","Query":"password OR client_secret","ExchangeLocations":["All"],"SharePointLocations":["All"]}',
            parsedFields: {
              AuditOperation: 'SearchCreated / New-ComplianceSearch',
              SearchScope: 'ExchangeLocation: All, SharePointLocation: All',
              KeywordQuery: 'password OR client_secret',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: PST/Zip Package Export via New-ComplianceSearchAction -Export & SearchExported Audit',
        narration:
          'Once the search completes, the actor runs New-ComplianceSearchAction -SearchName "Audit_Check_Q4" -Export to stage a downloadable PST and SharePoint ZIP archive in the Microsoft-managed Azure Blob export container, triggering a high-severity SearchExported event.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1114.002 - Remote Email Collection)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations "New-ComplianceSearchAction","SearchExported","PreviewSearch"',
          'Remove-ComplianceSearch -Identity "Audit_Check_Q4" -Confirm:$false',
        ],
        defenseMitigation:
          'Create a high-severity Microsoft Defender XDR / Sentinel alert rule on UnifiedAuditLog Operations SearchExported and New-ComplianceSearchAction (-Export), and immediately purge unauthorized compliance search jobs.',
        logs: [
          {
            id: 'm365-edisc-3',
            timestamp: '18:16:02.944',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'ComplianceExportService',
            CommandLine: 'New-ComplianceSearchAction -SearchName "Audit_Check_Q4" -Export -Format FxStream',
            raw: 'UnifiedAuditLog: {"Operation":"SearchExported","Workload":"SecurityComplianceCenter","UserId":"admin_clark@corp.local","SearchName":"Audit_Check_Q4","ExportFormat":"FxStream (PST + SharePoint Zip)","ItemCount":1840}',
            parsedFields: {
              AuditOperation: 'SearchExported (New-ComplianceSearchAction -Export)',
              SearchJobName: 'Audit_Check_Q4',
              ExportedItemCount: '1,840 items',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a corporate courthouse that houses an official legal-discovery archive machine built to search every single employee email drawer, file cabinet, and chat room across the entire company at once. After secretly adding their own hijacked badge onto the Legal Discovery Manager roster, an intruder runs a company-wide keyword search for passwords and mergers, then packs every matching document across thousands of employees into neat downloadable shipping trunks without ever touching a single employee desk.',
      storyMappings: [
        {
          storyTerm: 'Adding a hijacked badge onto the Legal Discovery Manager roster',
          technicalTerm: 'Adding RoleGroupMember to eDiscovery Manager in Microsoft Purview Compliance Center',
          tone: 'amber',
        },
        {
          storyTerm: 'Running a company-wide search for passwords and merger files',
          technicalTerm: 'Executing tenant-wide New-ComplianceSearch and Start-ComplianceSearch queries',
          tone: 'sky',
        },
        {
          storyTerm: 'Packing every matching document into downloadable shipping trunks',
          technicalTerm: 'Running New-ComplianceSearchAction -Export to download PST and Zip packages',
          tone: 'rose',
        },
        {
          storyTerm: 'Courthouse compliance ledger catching the silent mass export',
          technicalTerm: 'Purview Unified Audit Log SearchExportDownloaded and Add-RoleGroupMember alerts',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding compromised high-level tenant rights, the intruder quietly adds a controlled account onto the prestigious Legal eDiscovery Manager committee, unlocking company-wide search powers that bypass ordinary individual mailbox permissions.',
        storyMappings: [
          {
            storyTerm: 'Prestigious Legal eDiscovery Manager committee',
            technicalTerm: 'Microsoft Purview eDiscovery Manager / eDiscovery Administrator role group',
            tone: 'amber',
          },
          {
            storyTerm: 'Quietly adding a controlled account to the roster',
            technicalTerm: 'Add-RoleGroupMember logged in Purview Unified Audit Log',
            tone: 'sky',
          },
          {
            storyTerm: 'Bypassing individual employee mailbox permissions',
            technicalTerm: 'Cross-tenant read access spanning Exchange Online, SharePoint, OneDrive, and Teams',
            tone: 'rose',
          },
          {
            storyTerm: 'First high-priority warning flare',
            technicalTerm: 'SIEM alert on any unexpected membership change to Compliance Role Groups',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Stepping up to the central legal-discovery console, the intruder launches a sweeping tenant-wide keyword search hunting for passwords, M&A contracts, legal filings, and executive spreadsheets across every employee simultaneously.',
        storyMappings: [
          {
            storyTerm: 'Central legal-discovery search console',
            technicalTerm: 'Microsoft Purview Content Search / Compliance PowerShell cmdlets',
            tone: 'amber',
          },
          {
            storyTerm: 'Sweeping tenant-wide keyword search',
            technicalTerm: 'New-ComplianceSearch -ExchangeLocation All -SharePointLocation All + Start-ComplianceSearch',
            tone: 'sky',
          },
          {
            storyTerm: 'Zero disturbance on individual employee desks',
            technicalTerm: 'Silent backend indexing search invisible to targeted mailbox or SharePoint owners',
            tone: 'rose',
          },
          {
            storyTerm: 'Compliance diary logging the exact search terms',
            technicalTerm: 'UAL SearchCreated and SearchStarted events preserving the attacker keyword query',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Once the search finishes indexing thousands of sensitive hits, the intruder triggers an official export job that bundles every matching email and SharePoint file into ready-to-download PST and Zip shipping trunks and pulls them straight off the platform.',
        storyMappings: [
          {
            storyTerm: 'Triggering an official export job',
            technicalTerm: 'New-ComplianceSearchAction -SearchName <name> -Export generating PST/Zip bundles',
            tone: 'amber',
          },
          {
            storyTerm: 'Pulling shipping trunks straight off the platform',
            technicalTerm: 'Downloading the generated export package triggering SearchExportDownloaded audit logs',
            tone: 'sky',
          },
          {
            storyTerm: 'Massive single-click enterprise data breach',
            technicalTerm: 'Bulk multi-mailbox and SharePoint exfiltration masquerading as routine legal hold',
            tone: 'rose',
          },
          {
            storyTerm: 'Dual-approval legal safeguard',
            technicalTerm: 'Requiring Privileged Identity Management (PIM) JIT approval for eDiscovery Manager activation',
            tone: 'emerald',
          },
        ],
      },
    },
  };
