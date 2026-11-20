import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a hardware wholesaler whose tiny brass screws are packed automatically inside millions of furniture kits across the world. Attackers steal the wholesaler warehouse login because no second-factor pocket code was required, slip an automatic spring-loaded trap inside the screw box lid so every carpenter who opens the box unknowingly fetches a lockpicking kit, and silently launches a credential thief using a trusted built-in workshop tool.',
      storyMappings: [
        {
          storyTerm: 'Tiny brass screws packed inside millions of kits',
          technicalTerm: 'Foundational transitive NPM packages ua-parser-js, coa, and rc',
          tone: 'amber',
        },
        {
          storyTerm: 'Warehouse login lacking a pocket code',
          technicalTerm: 'Compromised NPM maintainer accounts without 2FA enforcement',
          tone: 'sky',
        },
        {
          storyTerm: 'Spring-loaded trap inside the box lid',
          technicalTerm: 'Malicious package.json preinstall hook running preinstall.js and compile.bat',
          tone: 'rose',
        },
        {
          storyTerm: 'Launching a credential thief with a trusted workshop tool',
          technicalTerm: 'regsvr32.exe -s create.dll executing the DanaBot password stealer silently',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'In late 2021, threat actors compromised the NPM publishing accounts of the maintainers of ua-parser-js, coa, and rc (foundational transitive JavaScript dependencies pulled automatically by React, Webpack, and millions of Node.js builds). They published poisoned patch versions containing a package.json preinstall lifecycle hook (a script that NPM executes automatically before package installation completes) that ran preinstall.js and compile.bat to download sdd.dll (saved as create.dll) and silently execute the DanaBot banking and password stealer via regsvr32.exe -s.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Breaking into a busy component-maker shipping account that lacked a second pocket-code lock, the intruder releases a tiny routine-looking version bump containing a spring-loaded lid script designed to snap open the instant any workshop unpacks the crate.',
        storyMappings: [
          {
            storyTerm: 'Component-maker account lacking a pocket-code lock',
            technicalTerm: 'Maintainer NPM account without two-factor authentication (2FA) for publishing',
            tone: 'amber',
          },
          {
            storyTerm: 'Routine-looking version bump',
            technicalTerm: 'Malicious patch versions published for ua-parser-js, coa, and rc',
            tone: 'sky',
          },
          {
            storyTerm: 'Spring-loaded lid script',
            technicalTerm: 'package.json preinstall lifecycle hook executing automatically on install',
            tone: 'rose',
          },
          {
            storyTerm: 'Workshops pulling the crate transitively',
            technicalTerm: 'Millions of downstream Node.js builds auto-resolving caret dependency ranges',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The moment a developer runs a routine morning toolbox refresh, the spring-loaded lid checks whether the workshop runs Windows or Linux, triggers a hidden helper script, and reaches outside the building to download a concealed espionage module straight into the local parts bin.',
        storyMappings: [
          {
            storyTerm: 'Routine morning toolbox refresh',
            technicalTerm: 'Developer or CI runner executing npm install',
            tone: 'amber',
          },
          {
            storyTerm: 'Checking whether the workshop runs Windows or Linux',
            technicalTerm: 'preinstall.js inspecting process.platform to branch payloads by OS',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden helper script fetching the module',
            technicalTerm: 'node.exe spawning cmd.exe /c compile.bat invoking curl.exe',
            tone: 'rose',
          },
          {
            storyTerm: 'Concealed espionage module in the local parts bin',
            technicalTerm: 'Downloaded sdd.dll (create.dll) staged inside node_modules',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation recording full parent-child lineage) showing node.exe spawning cmd.exe /c compile.bat followed by curl.exe downloading .dll or .exe binaries into node_modules (a high-fidelity signature of malicious NPM lifecycle script abuse).',
      },
      3: {
        storyAnalogy:
          'Rather than running an unfamiliar executable that guards would immediately question, the helper script hands the stolen espionage module to the workshop own official parts-registration machine set on mute, silently awakening a password thief that sweeps browser vaults and developer keys.',
        storyMappings: [
          {
            storyTerm: 'Official parts-registration machine set on mute',
            technicalTerm: 'Signed Microsoft COM utility regsvr32.exe invoked with the -s silent flag',
            tone: 'amber',
          },
          {
            storyTerm: 'Awakening the password thief inside the machine',
            technicalTerm: 'regsvr32.exe -s create.dll invoking DllRegisterServer for DanaBot',
            tone: 'sky',
          },
          {
            storyTerm: 'Sweeping browser vaults and developer keys',
            technicalTerm: 'DanaBot credential harvesting across browser profiles, SSH keys, and tokens',
            tone: 'rose',
          },
          {
            storyTerm: 'Blending past front-gate guard checks',
            technicalTerm: 'Living-off-the-land signed binary proxy execution (MITRE T1218.010)',
            tone: 'emerald',
          },
        ],
      },
    },
  };
