import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'A busy postal depot leaves its public storefront wall spotless so routine walk-through checks find no suspicious flyers, yet an insider registers a hidden sorting desk deep inside the basement mail chute that intercepts specific letters before they ever reach the front counter.',
      storyMappings: [
        {
          storyTerm: 'Busy postal depot',
          technicalTerm: 'Microsoft IIS web server and w3wp.exe worker process',
          tone: 'amber',
        },
        {
          storyTerm: 'Hidden sorting desk ledger',
          technicalTerm: 'Malicious module registered in applicationHost.config',
          tone: 'sky',
        },
        {
          storyTerm: 'Basement mail chute',
          technicalTerm: 'Kernel-mode HTTP.sys URI UrlGroup listener',
          tone: 'rose',
        },
        {
          storyTerm: 'Live basement inspection',
          technicalTerm: 'netsh http show servicestate and CLR AppDomain triage',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Inspectors open the depot master staffing roster and spot a newly added sorting clerk assigned to inspect every incoming envelope, even though no corresponding script paper sits on the public bulletin board.',
        storyMappings: [
          {
            storyTerm: 'Depot master staffing roster',
            technicalTerm: 'IIS applicationHost.config global module list',
            tone: 'amber',
          },
          {
            storyTerm: 'Newly added sorting clerk',
            technicalTerm: 'Rogue native DLL or managed IIS HTTP module',
            tone: 'sky',
          },
          {
            storyTerm: 'Spotless bulletin board',
            technicalTerm: 'Absence of traditional .aspx webshell files on disk',
            tone: 'rose',
          },
          {
            storyTerm: 'Roster change alert',
            technicalTerm: 'Sysmon file modification and IIS configuration logs',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Digging deeper into the basement conveyor switchboard, investigators discover a private chute reservation claiming a secret corridor address directly inside the building core driver.',
        storyMappings: [
          {
            storyTerm: 'Basement conveyor switchboard',
            technicalTerm: 'Windows kernel-mode HTTP.sys request router',
            tone: 'amber',
          },
          {
            storyTerm: 'Private chute reservation',
            technicalTerm: 'Registered HTTP.sys URI UrlGroup prefix',
            tone: 'sky',
          },
          {
            storyTerm: 'Switchboard operational log',
            technicalTerm: 'Microsoft-Windows-HttpService/Operational event log',
            tone: 'rose',
          },
          {
            storyTerm: 'Front counter bypass',
            technicalTerm: 'Requests intercepted before standard IIS site logging',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Rather than trusting paper folders, responders run a live roll call of every active chute reservation and inspect the working trays inside the mailroom clerks hands to expose the memory-resident helper.',
        storyMappings: [
          {
            storyTerm: 'Live chute roll call',
            technicalTerm: 'netsh http show servicestate active queue listing',
            tone: 'amber',
          },
          {
            storyTerm: 'Clerk working trays',
            technicalTerm: 'Live .NET CLR AppDomain loaded assemblies in w3wp.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Memory-resident helper',
            technicalTerm: 'In-memory IIS webshell without a disk-backed page',
            tone: 'rose',
          },
          {
            storyTerm: 'Depot worker process',
            technicalTerm: 'Active IIS w3wp.exe host process',
            tone: 'emerald',
          },
        ],
      },
    },
  };
