import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
