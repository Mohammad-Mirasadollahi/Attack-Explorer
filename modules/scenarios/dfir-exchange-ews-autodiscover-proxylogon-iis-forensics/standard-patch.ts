import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Forensic auditors reconstruct a break-in at a corporate mail building by tracing three linked clues: first the front-desk forwarding slips that misrouted a stranger into the rear office, next the management ledger recording a tampered address-book path, and finally the fresh workshop printouts proving a hidden control page ran commands.',
      storyMappings: [
        {
          storyTerm: 'Front-desk forwarding slips',
          technicalTerm: 'Exchange Frontend HttpProxy routing logs',
          tone: 'amber',
        },
        {
          storyTerm: 'Tampered address-book path',
          technicalTerm: 'MSExchange Management Set-OabVirtualDirectory EventID 1',
          tone: 'sky',
        },
        {
          storyTerm: 'Fresh workshop printouts',
          technicalTerm: 'ASP.NET dynamic compilation in Temporary ASP.NET Files',
          tone: 'rose',
        },
        {
          storyTerm: 'Mailroom clerk running tools',
          technicalTerm: 'w3wp.exe spawning unexpected command child processes',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Auditors begin at the reception counter logbook and spot an unusual courier slip addressed to a static graphic shelf that unexpectedly routed straight into the rear backend mail engine.',
        storyMappings: [
          {
            storyTerm: 'Reception counter logbook',
            technicalTerm: 'V15\\Logging\\HttpProxy\\*\\*.log proxy audit files',
            tone: 'amber',
          },
          {
            storyTerm: 'Static graphic shelf address',
            technicalTerm: 'Crafted /ecp/*.js path triggering SSRF routing',
            tone: 'sky',
          },
          {
            storyTerm: 'Rear backend mail engine',
            technicalTerm: 'Internal Exchange backend RPC and EWS services',
            tone: 'rose',
          },
          {
            storyTerm: 'Strange routing stamp',
            technicalTerm: 'X-BEResource cookie directing arbitrary backend calls',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Following the timestamp into the supervisor office ledger, investigators catch an administrative order rewriting an offline address-book web link so its description field hides an executable page script.',
        storyMappings: [
          {
            storyTerm: 'Supervisor office ledger',
            technicalTerm: 'MSExchange Management EventID 1 administrative log',
            tone: 'amber',
          },
          {
            storyTerm: 'Rewritten address-book link',
            technicalTerm: 'Set-OabVirtualDirectory ExternalUrl payload injection',
            tone: 'sky',
          },
          {
            storyTerm: 'Resetting the directory',
            technicalTerm: 'Reset-OabVirtualDirectory writing payload to webroot',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden page script',
            technicalTerm: 'Dropped ASPX webshell embedded inside OAB config',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even if the intruder tears down the wall flyer afterward, the building print shop retains freshly compiled proof plates in its temporary drawer and security cameras catch the mailroom clerk carrying heavy workshop tools.',
        storyMappings: [
          {
            storyTerm: 'Compiled proof plates',
            technicalTerm: 'Compiled DLLs in Temporary ASP.NET Files cache',
            tone: 'amber',
          },
          {
            storyTerm: 'Mailroom clerk process',
            technicalTerm: 'IIS w3wp.exe worker handling the webshell request',
            tone: 'sky',
          },
          {
            storyTerm: 'Heavy workshop tools',
            technicalTerm: 'Spawned cmd.exe, powershell.exe, or credential dumpers',
            tone: 'rose',
          },
          {
            storyTerm: 'Deleted wall flyer',
            technicalTerm: 'Removed source .aspx file still evidenced by build artifacts',
            tone: 'emerald',
          },
        ],
      },
    },
  };
