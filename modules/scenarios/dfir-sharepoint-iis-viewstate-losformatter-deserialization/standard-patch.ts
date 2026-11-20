import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'A web office sends visitors a folded state receipt stamped with a secret office seal so the clerk trusts any receipt brought back later. Once an outsider steals the secret sealing key from the office supply book, they forge a spring-loaded receipt that unpacks straight into a live command terminal under the clerk badge.',
      storyMappings: [
        {
          storyTerm: 'Folded state receipt',
          technicalTerm: 'ASP.NET hidden __VIEWSTATE form parameter',
          tone: 'amber',
        },
        {
          storyTerm: 'Secret sealing key',
          technicalTerm: 'Exposed web.config <machineKey> validationKey',
          tone: 'sky',
        },
        {
          storyTerm: 'Spring-loaded forged receipt',
          technicalTerm: 'Signed LosFormatter / TypeConfuseDelegate gadget payload',
          tone: 'rose',
        },
        {
          storyTerm: 'Swapping the office seal',
          technicalTerm: 'MachineKey rotation and w3wp.exe process triage',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Investigators trace how an outsider obtained or guessed a publicly leaked office sealing stamp from the configuration binder and began sending small test receipts to verify that the front desk accepted the forged signature.',
        storyMappings: [
          {
            storyTerm: 'Configuration binder',
            technicalTerm: 'Application web.config containing <machineKey>',
            tone: 'amber',
          },
          {
            storyTerm: 'Leaked office sealing stamp',
            technicalTerm: 'Compromised or publicly known validationKey secret',
            tone: 'sky',
          },
          {
            storyTerm: 'Small test receipts',
            technicalTerm: 'Probing HTTP POST requests carrying signed __VIEWSTATE',
            tone: 'rose',
          },
          {
            storyTerm: 'Front desk arrival book',
            technicalTerm: 'IIS W3SVC access logs tracking POST lengths and status',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Once the seal checks out, the outsider submits a bulky, validly stamped receipt containing a chain of self-triggering parts. Trusting the valid wax seal, the office clerk unfolds the receipt and accidentally triggers arbitrary code.',
        storyMappings: [
          {
            storyTerm: 'Validly stamped bulky receipt',
            technicalTerm: 'HMAC-signed malicious __VIEWSTATE POST payload',
            tone: 'amber',
          },
          {
            storyTerm: 'Receipt unfolding engine',
            technicalTerm: 'ASP.NET ObjectStateFormatter / LosFormatter deserializer',
            tone: 'sky',
          },
          {
            storyTerm: 'Self-triggering gadget parts',
            technicalTerm: 'TypeConfuseDelegate .NET deserialization gadget chain',
            tone: 'rose',
          },
          {
            storyTerm: 'Unexpected desk exception',
            technicalTerm: 'Application Event Log and SharePoint ULS error traces',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Endpoint sensors catch the web clerk suddenly launching system maintenance tools. Responders immediately revoke and replace the stolen sealing stamp across every branch desk so forged receipts stop working permanently.',
        storyMappings: [
          {
            storyTerm: 'Web clerk worker',
            technicalTerm: 'IIS w3wp.exe worker spawning cmd.exe or powershell.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Endpoint motion sensor',
            technicalTerm: 'Sysmon EventID 1 process creation lineage alert',
            tone: 'sky',
          },
          {
            storyTerm: 'Replacing the sealing stamp',
            technicalTerm: 'Rotating ASP.NET MachineKey across the SharePoint farm',
            tone: 'rose',
          },
          {
            storyTerm: 'Branch desk synchronization',
            technicalTerm: 'Running Update-SPMachineKey and restarting IIS pools',
            tone: 'emerald',
          },
        ],
      },
    },
  };
