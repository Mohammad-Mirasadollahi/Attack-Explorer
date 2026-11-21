import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'npm-ua-parser-js-coa-rc-supply-chain',
    briefing: {
      headline:
        'Attackers hijack the npm maintainer accounts of ua-parser-js, coa, and rc (>20M weekly downloads) and inject preinstall lifecycle scripts that download sdd.dll and execute DanaBot via regsvr32.exe -s.',
      storyAnalogy:
        'Imagine three tiny plastic screws used inside almost every appliance in the world. A burglar steals the factory owner’s password and adds a self-activating spring to the screw box so that the moment an engineer opens the box on their workbench, a mechanical bug jumps out and copies every password in the workshop.',
      plainSummary:
        'In this scenario (T1195.001, NPM High-Impact Package Hijack (ua-parser-js / coa / rc) & DanaBot Stealer), the attacker follows one continuous arc: maintainer Account Takeover, then automatic preinstall Execution, then silent regsvr32.exe -s Execution. Steps #1–#3 examine #1 Maintainer Account Takeover; #2 Automatic preinstall Execution; #3 Silent regsvr32.exe -s Execution. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
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
