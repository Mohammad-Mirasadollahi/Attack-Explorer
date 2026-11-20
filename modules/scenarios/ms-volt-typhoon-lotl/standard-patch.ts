import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a patient industrial spy who never carries foreign lockpicks or masks across the border. First, the spy blends in by riding ordinary neighborhood delivery vans right up to the factory gate; next, the spy uses the factory own official backup photocopier to copy the locked master employee vault ledger cleanly; finally, the spy props silent mirror-boxes inside a hallway utility closet to bounce stolen parcels back out through standard building plumbing.',
      storyMappings: [
        {
          storyTerm: 'Riding ordinary neighborhood delivery vans to the gate',
          technicalTerm: 'Proxying connections through compromised KV-Botnet SOHO home and office routers',
          tone: 'amber',
        },
        {
          storyTerm: 'Using the factory own official backup photocopier',
          technicalTerm: 'Built-in ntdsutil.exe "ac i ntds" "ifm" dumping locked ntds.dit without malware',
          tone: 'sky',
        },
        {
          storyTerm: 'Silent mirror-boxes wired inside a hallway closet',
          technicalTerm: 'Windows netsh interface portproxy multi-hop traffic relay (Sysmon EventID 13)',
          tone: 'rose',
        },
        {
          storyTerm: 'Carrying zero foreign lockpicks',
          technicalTerm: 'Pure Living-off-the-Land (LotL) execution using signed native Windows binaries',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Instead of arriving in a marked foreign truck that gate guards instantly stop, the spy hops through a chain of ordinary local neighborhood vans and issues a quiet remote maintenance instruction over the building standard management intercom straight to the main vault office.',
        storyMappings: [
          {
            storyTerm: 'Chain of ordinary local neighborhood vans',
            technicalTerm: 'KV-Botnet proxy mesh of compromised small-office/home-office (SOHO) routers',
            tone: 'amber',
          },
          {
            storyTerm: 'Standard management intercom',
            technicalTerm: 'Windows Management Instrumentation (WMI / WmiPrvSE.exe) lateral execution',
            tone: 'sky',
          },
          {
            storyTerm: 'Main vault office',
            technicalTerm: 'Active Directory Domain Controller CORP-DC01 (10.10.0.5)',
            tone: 'rose',
          },
          {
            storyTerm: 'Quiet remote maintenance instruction',
            technicalTerm: 'WmiPrvSE.exe spawning cmd.exe /Q /c ntdsutil "ac i ntds" "ifm"',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate CISA AA24-038A indicators with Sysmon EventID 1 (Process Creation recording exact parent-child lineage and arguments) on CORP-DC01 showing WmiPrvSE.exe spawning cmd.exe /Q /c ntdsutil "ac i ntds" "ifm" (high-confidence proof of Living-off-the-Land credential harvesting on a Domain Controller).',
      },
      2: {
        storyAnalogy:
          'Because the master password ledger stays clamped shut under heavy lock while the office is open, the spy simply flips on the office own official emergency migration photocopier, cleanly copying both the ledger book and its matching key drawer into a neat staging tray.',
        storyMappings: [
          {
            storyTerm: 'Master password ledger clamped shut during business hours',
            technicalTerm: 'Exclusively locked Active Directory database C:\\Windows\\NTDS\\ntds.dit',
            tone: 'amber',
          },
          {
            storyTerm: 'Official emergency migration photocopier',
            technicalTerm: 'Signed Windows utility ntdsutil.exe invoked with Install From Media (ifm) mode',
            tone: 'sky',
          },
          {
            storyTerm: 'Matching key drawer copied alongside the ledger',
            technicalTerm: 'SYSTEM registry hive saved alongside ntds.dit to decrypt every domain hash',
            tone: 'rose',
          },
          {
            storyTerm: 'Built-in engine stamp left in the copier log',
            technicalTerm: 'ESENT Application Event logs documenting snapshot creation and database streaming',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To keep moving quietly through internal corridors without ever installing foreign radio gear, the spy configures a built-in hallway forwarding mirror on an intermediate jump desk that bounces traffic silently from inner rooms straight out to the external neighborhood van.',
        storyMappings: [
          {
            storyTerm: 'Built-in hallway forwarding mirror',
            technicalTerm: 'Windows netsh interface portproxy add v4tov4 TCP relay rule',
            tone: 'amber',
          },
          {
            storyTerm: 'Intermediate jump desk',
            technicalTerm: 'Internal management jump host SRV-MGMT-01 (10.10.15.20)',
            tone: 'sky',
          },
          {
            storyTerm: 'Permanent brass label bolted inside the control panel',
            technicalTerm: 'Registry write under HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp',
            tone: 'rose',
          },
          {
            storyTerm: 'Silent alarm noting the panel change',
            technicalTerm: 'Sysmon EventID 13 (RegistryValueSet) capturing unauthorized PortProxy configuration',
            tone: 'emerald',
          },
        ],
      },
    },
  };
