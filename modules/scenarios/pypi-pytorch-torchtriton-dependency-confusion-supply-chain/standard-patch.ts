import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a research workshop whose nightly supply clerk checks a public downtown parts market before checking the company private warehouse whenever an internal part name is ordered. An opportunist rents a booth in the downtown market under that exact internal part name with a shiny higher version tag, tricking the clerk into carrying a disguised spy box straight onto high-powered research benches where it packs up local keys and whispers them out disguised as tiny postal-lookup cards.',
      storyMappings: [
        {
          storyTerm: 'Public downtown market checked before the private warehouse',
          technicalTerm: 'pip --extra-index-url prioritizing public PyPI over download.pytorch.org/whl/nightly',
          tone: 'amber',
        },
        {
          storyTerm: 'Booth rented under the exact internal part name',
          technicalTerm: 'Dependency-confusion package named torchtriton squatted on public PyPI',
          tone: 'sky',
        },
        {
          storyTerm: 'Disguised spy box unpacking automatically on research benches',
          technicalTerm: 'triton/__init__.py launching compiled ELF stealer binary (triton/runtime/triton)',
          tone: 'rose',
        },
        {
          storyTerm: 'Whispering stolen keys out as tiny postal-lookup cards',
          technicalTerm: 'AES-encrypted DNS tunneling exfiltration via wheezy.io to *.h4ck.cfd',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Noticing that a famous lab nightly toolkit relies on an internal helper name not yet reserved on the public marketplace, the attacker claims that exact name on the public shelf so the automated buyer prefers the public fake over the lab private bin.',
        storyMappings: [
          {
            storyTerm: 'Internal helper name unreserved in public',
            technicalTerm: 'Internal PyTorch nightly dependency named torchtriton',
            tone: 'amber',
          },
          {
            storyTerm: 'Claiming the exact name on the public shelf',
            technicalTerm: 'Public PyPI namespace squatting exploiting dependency confusion (T1195.001)',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated buyer preferring the public fake',
            technicalTerm: 'pip --extra-index-url resolution precedence favoring public PyPI packages',
            tone: 'rose',
          },
          {
            storyTerm: 'Lab private parts bin bypassed',
            technicalTerm: 'Official internal index at https://download.pytorch.org/whl/nightly',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The moment a machine-learning engineer or graphics cluster opens the newly installed library for routine training work, the box startup lid quietly launches a compiled espionage tool that sweeps system keys, environment variables, and home-folder secrets.',
        storyMappings: [
          {
            storyTerm: 'Opening the library for routine training work',
            technicalTerm: 'Importing torch or triton on ML developer workstations or GPU nodes',
            tone: 'amber',
          },
          {
            storyTerm: 'Box startup lid triggering automatically',
            technicalTerm: 'triton/__init__.py executing on module import',
            tone: 'sky',
          },
          {
            storyTerm: 'Compiled espionage tool inside the box',
            technicalTerm: 'Bundled Linux ELF stealer binary at triton/runtime/triton',
            tone: 'rose',
          },
          {
            storyTerm: 'Sweeping system keys and home-folder secrets',
            technicalTerm: 'Harvesting /etc/passwd, SSH keys, git configs, and environment variables',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Because research clusters block unauthorized cargo trucks leaving the front web gate, the spy compresses and locks the stolen secrets into tiny encrypted fragments and mails them out disguised as routine address-book lookup slips that every network router passes freely.',
        storyMappings: [
          {
            storyTerm: 'Blocked cargo trucks at the front web gate',
            technicalTerm: 'Corporate HTTP/HTTPS egress proxies restricting direct web exfiltration',
            tone: 'amber',
          },
          {
            storyTerm: 'Compressing and locking secrets into tiny fragments',
            technicalTerm: 'AES encryption and chunking inside the triton ELF stealer binary',
            tone: 'sky',
          },
          {
            storyTerm: 'Routine address-book lookup slips',
            technicalTerm: 'DNS query subdomain exfiltration tunneling via wheezy.io to *.h4ck.cfd',
            tone: 'rose',
          },
          {
            storyTerm: 'Watchful network routers passing lookups freely',
            technicalTerm: 'Uninspected UDP/53 DNS resolution leaking encrypted secrets out of GPU clusters',
            tone: 'emerald',
          },
        ],
      },
    },
  };
