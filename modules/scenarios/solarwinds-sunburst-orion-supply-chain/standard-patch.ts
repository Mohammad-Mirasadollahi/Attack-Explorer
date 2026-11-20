import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a famous armored-truck factory whose blueprints are inspected every evening by careful engineers. Instead of editing the master blueprint on paper where someone would notice, a hidden saboteur watches the factory assembly press and swaps a tiny counterfeit circuit board into the mold for two seconds right as the factory stamps its genuine gold warranty seal onto the finished truck. Eighteen thousand banks buy the sealed truck, where the hidden board sleeps quietly for two weeks before whispering home and unlocking each bank identity vault.',
      storyMappings: [
        {
          storyTerm: 'Hidden saboteur watching the assembly press',
          technicalTerm: 'SUNSPOT build-hijack service (taskhostsvc.exe) polling MsBuild.exe',
          tone: 'amber',
        },
        {
          storyTerm: 'Swapping a counterfeit board before the gold warranty seal is stamped',
          technicalTerm: 'Transient InventoryManager.cs swap compiled into signed SolarWinds.Orion.Core.BusinessLayer.dll',
          tone: 'sky',
        },
        {
          storyTerm: 'Sleeping for two weeks before whispering home',
          technicalTerm: 'SUNBURST 12-to-14 day dormancy and *.avsvmcloud.com DGA DNS beacon',
          tone: 'rose',
        },
        {
          storyTerm: 'Unlocking each bank identity vault',
          technicalTerm: 'Memory-only TEARDROP loader and ADFS Golden SAML token-signing theft',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'Rather than editing source code in Git where developers would immediately spot the pull-request diff, APT29 installed a custom C++ service called SUNSPOT on the SolarWinds Orion build server (the automated compilation host that turns source code into shipped releases). SUNSPOT monitored running processes for MsBuild.exe and transiently swapped InventoryManager.cs for milliseconds during compilation so the trojanized SolarWinds.Orion.Core.BusinessLayer.dll received SolarWinds legitimate Authenticode digital signature (the cryptographic seal proving vendor authenticity) before shipping to thousands of enterprise networks.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing silently beside the factory stamping press, the saboteur checks the conveyor belt every second. The instant the press lowers to forge a new fleet module, the saboteur slips in a poisoned page, waits for the factory official gold seal to stamp it, and swaps the clean page straight back onto the blueprint table.',
        storyMappings: [
          {
            storyTerm: 'Saboteur checking the conveyor belt every second',
            technicalTerm: 'SUNSPOT (taskhostsvc.exe) polling for MsBuild.exe every 1,000 milliseconds',
            tone: 'amber',
          },
          {
            storyTerm: 'Poisoned page slipped in and swapped back',
            technicalTerm: 'Temporary replacement and restoration of InventoryManager.cs during compilation',
            tone: 'sky',
          },
          {
            storyTerm: 'Official gold seal stamped on the finished module',
            technicalTerm: 'Valid SolarWinds Authenticode code-signing certificate applied to the trojanized DLL',
            tone: 'rose',
          },
          {
            storyTerm: 'Clean blueprint table left untouched',
            technicalTerm: 'Unmodified Git source repository evading developer code review',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Delivered inside an official sealed factory shipment, the counterfeit board sits completely silent for two full weeks so test inspectors hear nothing. After confirming it is not sitting inside a security workshop, it sends coded postal inquiries disguised as routine check-ins to ask its remote handler whether this customer is worth robbing.',
        storyMappings: [
          {
            storyTerm: 'Counterfeit board sitting silent for two weeks',
            technicalTerm: 'SUNBURST 12-to-14 day random dormancy delay inside SolarWinds.BusinessLayerHost.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Checking it is not inside a security workshop',
            technicalTerm: 'FNV-1a hash blocklist checking for antivirus drivers, debuggers, and analysis domains',
            tone: 'sky',
          },
          {
            storyTerm: 'Coded postal inquiries disguised as routine check-ins',
            technicalTerm: 'Domain Generation Algorithm (DGA) DNS beacons to *.avsvmcloud.com',
            tone: 'rose',
          },
          {
            storyTerm: 'Remote handler signaling whether to rob the bank',
            technicalTerm: 'CNAME DNS response redirecting high-value victims to dedicated C2 infrastructure',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 22 (DNSEvent recording the exact originating process and resolved domain name) showing SolarWinds.BusinessLayerHost.exe querying *.avsvmcloud.com and receiving CNAME redirects to non-SolarWinds IP addresses (exposing active SUNBURST victim triaging).',
      },
      3: {
        storyAnalogy:
          'For hand-picked targets, the counterfeit board quietly unfolds a paperless lockpicker straight inside the bank memory, steps into the corporate badge-printing vault, and steals the master embossing plate so the spies can stamp flawless executive badges for any cloud office whenever they please.',
        storyMappings: [
          {
            storyTerm: 'Paperless lockpicker unfolded inside memory',
            technicalTerm: 'TEARDROP memory-only dropper delivered over disguised OIP JSON HTTPS traffic',
            tone: 'amber',
          },
          {
            storyTerm: 'Corporate badge-printing vault',
            technicalTerm: 'Active Directory Federation Services (ADFS) server and DKM key container',
            tone: 'sky',
          },
          {
            storyTerm: 'Stealing the master embossing plate',
            technicalTerm: 'Extraction of the ADFS token-signing private key certificate',
            tone: 'rose',
          },
          {
            storyTerm: 'Stamping flawless executive badges for cloud offices',
            technicalTerm: 'Golden SAML forgery granting persistent access to Microsoft 365 and federated SaaS',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate EDR alerts on Image File Execution Options (IFEO) Debugger registry keys targeting dllhost.exe (used to hijack trusted binary execution for persistence) with Windows Security logs tracking unexpected remote WMI or PowerShell access to ADFS configuration databases and DKM containers in Active Directory.',
      },
    },
  };
