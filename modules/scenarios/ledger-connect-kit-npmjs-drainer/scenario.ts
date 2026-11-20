import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'ledger-connect-kit-npmjs-drainer',
    title: 'Ledger Connect-Kit NPM Compromise & Web3 WalletConnect Drainer',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.001',
    description:
      'An attacker spear-phishes a former Ledger employee’s unrevoked npmjs credentials and publishes malicious versions (1.1.5–1.1.7) of @ledgerhq/connect-kit. Downstream dApps pulling the unpinned CDN bundle from jsDelivr automatically render a rogue WalletConnect modal deploying the Angel Drainer smart contract payload.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Angel Drainer Operator & Rogue ProjectID', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'NPM & jsDelivr CDN (@ledgerhq/connect-kit)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Downstream Web3 dApp Frontend', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Blockaid Web3 Runtime Scanner', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'User Web3 Wallet (Permit2 / SetApprovalForAll)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Former Employee NPM Token Phishing & Publish of v1.1.5–1.1.7',
        narration:
          'After phishing a former employee who still retained publish access to the @ledgerhq npm organization without GitHub release gating, the attacker publishes @ledgerhq/connect-kit versions 1.1.5, 1.1.6, and 1.1.7 directly to the public npm registry.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.001 - Compromise Software Dependencies)',
        technicalCommands: [
          'npm publish @ledgerhq/connect-kit@1.1.5 (Published directly via compromised npm token bypassing GitHub CI)',
        ],
        defenseMitigation:
          'Enforce SSO/SCIM offboarding across package registries (npm, PyPI, Docker Hub) and require OIDC Trusted Publishing tied exclusively to protected GitHub release workflows.',
        logs: [
          {
            id: 'ledger-1',
            timestamp: '09:38:11.002',
            source: 'Auth',
            severity: 'critical',
            raw: 'NPM Registry Publish Event | Package: @ledgerhq/connect-kit | Versions: 1.1.5, 1.1.6, 1.1.7 | Publisher: unrevoked-employee-account | GitHubReleaseTag: MISSING (Direct CLI publish)',
            parsedFields: {
              CompromisedPackage: '@ledgerhq/connect-kit',
              MaliciousVersions: '1.1.5, 1.1.6, 1.1.7',
              RootCause: 'Unrevoked former employee npmjs publish privileges',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Unpinned jsDelivr CDN Propagation of @ledgerhq/connect-kit-loader',
        narration:
          'Because `@ledgerhq/connect-kit-loader` dynamically fetches the latest version from `https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1` without a pinned patch version or SRI hash, hundreds of Web3 frontends (including SushiSwap and Revoke.cash) immediately serve the trojanized bundle.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1059.007 - JavaScript)',
        technicalCommands: [
          'GET https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1/dist/umd/index.min.js (Resolves to 1.1.7)',
          'Injected Rogue WalletConnect ProjectID: 89618723618723...',
        ],
        defenseMitigation:
          'Never dynamically load unpinned major-version scripts (`@1`) from public CDNs at runtime; bundle dependencies at build time with locked SHA-512 integrity hashes in package-lock.json.',
        logs: [
          {
            id: 'ledger-2',
            timestamp: '10:43:05.419',
            source: 'WAF',
            severity: 'critical',
            raw: 'Blockaid Frontend Integrity Alert | Loader: @ledgerhq/connect-kit-loader | FetchedCDNUrl: https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1/dist/umd/index.min.js | ResolvedVersion: 1.1.7 | InjectedPayload: Angel Drainer WalletConnect Modal',
            parsedFields: {
              DynamicLoader: '@ledgerhq/connect-kit-loader',
              UnpinnedCdnUrl: 'cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1',
              DrainerFamily: 'Angel Drainer',
            },
          },
        ],
        packets: [
          {
            id: 'ledger-pkt-1',
            timestamp: '10:43:05.400',
            protocol: 'HTTPS',
            sourceIp: '104.16.89.20',
            destIp: '192.0.2.99',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 1460,
            hexDump: '47 45 54 20 2F 6E 70 6D 2F 40 6C 65 64 67 65 72 68 71 2F 63 6F 6E 6E 65 63 74 2D 6B 69 74 40 31 2F 64 69 73 74 2F 75 6D 64 2F 69 6E 64 65 78 2E 6D 69 6E 2E 6A 73',
            decodedString: 'GET /npm/@ledgerhq/connect-kit@1/dist/umd/index.min.js -> Serves v1.1.7 containing Angel Drainer',
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Rogue WalletConnect Modal & Permit2 / SetApprovalForAll Asset Drain',
        narration:
          'When a user visits an affected dApp, the malicious script overlays a counterfeit WalletConnect modal routing through a rogue WalletConnect project ID, prompting the user’s software/hardware wallet to sign EIP-712 Permit2 signatures or setApprovalForAll transactions that drain tokens to the attacker.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1657 - Financial Theft)',
        technicalCommands: [
          'eth_signTypedData_v4 (EIP-712 Permit2 batch allowance to Angel Drainer contract 0x0000...)',
          'WalletConnect Relay Revocation: WalletConnect blocks rogue ProjectID & jsDelivr purges CDN cache for v1.1.5-1.1.7',
        ],
        defenseMitigation:
          'Integrate real-time transaction simulation (e.g., Blockaid) inside wallet interfaces to warn users before signing Permit2 or setApprovalForAll calls to untrusted spender contracts.',
        logs: [
          {
            id: 'ledger-3',
            timestamp: '10:51:18.882',
            source: 'WAF',
            severity: 'critical',
            raw: 'Blockaid Transaction Simulation Alert | Method: eth_signTypedData_v4 (Permit2) | SpenderAddress: 0x2260...AngelDrainer | Origin: trusted-dapp.example.com | Verdict: MALICIOUS_DRAINER_BLOCKED',
            parsedFields: {
              RpcMethod: 'eth_signTypedData_v4 (EIP-712 Permit2)',
              MaliciousSpender: 'Angel Drainer Contract',
              MitigationAction: 'WalletConnect ProjectID Revoked & Patched in v1.1.8',
            },
          },
        ],
        packets: [],
      },
    ],
  };
