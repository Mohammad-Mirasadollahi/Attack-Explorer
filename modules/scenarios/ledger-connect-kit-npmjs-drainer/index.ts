import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ledger-connect-kit-npmjs-drainer',
    briefing: {
      headline:
        'An attacker compromises a former Ledger employee’s npmjs account and publishes malicious versions (1.1.5–1.1.7) of @ledgerhq/connect-kit, propagating the Angel Drainer payload to Web3 frontends via unpinned jsDelivr CDN URLs.',
      storyAnalogy:
        'Imagine a former bank courier who left the company a year ago, but nobody canceled their keycard to the central brochure rack. A scammer tricks the former courier into handing over the keycard, puts counterfeit deposit slips into the rack, and because hundreds of local branches automatically restock from the "latest" slot on the rack every hour, customers at those branches are handed forms that wire their funds to the scammer.',
      plainSummary:
        'In this scenario (T1195.001, Ledger Connect-Kit NPM Compromise & Web3 WalletConnect Drainer), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: former Employee NPM Token Phishing, then unpinned jsDelivr CDN Propagation, then rogue WalletConnect Modal. Steps #1–#3 walk that chain end-to-end by covering Former Employee NPM Token Phishing, then Unpinned jsDelivr CDN Propagation, then Rogue WalletConnect Modal, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Angel Drainer Operator -> NPM & jsDelivr CDN (@ledgerhq/connect-kit) -> Downstream Web3 dApp Frontend -> User Web3 Wallet (Permit2 / SetApprovalForAll) -> Blockaid Web3 Runtime Scanner.',
      documentedAdvisory:
        'Ledger Post-Mortem on Connect Kit Incident / Blockaid Technical Analysis / Chainalysis & Checkmarx Advisory',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.001',
        plainTitle: 'Former Employee NPM Token Phishing & Publish of v1.1.5–1.1.7',
        storyAnalogy:
          'A former employee’s badge still works at the publishing house, allowing an impersonator to print three unauthorized editions without going through the editorial board.',
        simpleExplanation:
          'After spear-phishing a former employee whose npmjs account had not been removed from the @ledgerhq organization during offboarding, the attacker generated an npm access token and published @ledgerhq/connect-kit versions 1.1.5, 1.1.6, and 1.1.7 directly from the CLI (bypassing the official GitHub repository and CI/CD release pipeline entirely).',
        howItWorksInPractice:
          'Auditing the npm registry metadata against GitHub showed that versions 1.1.5–1.1.7 had no corresponding Git tags, pull requests, or GitHub Actions release runs in Ledger’s source repository. In the documented Auth exchange from Angel Drainer Operator & Rogue ProjectID to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK T1195.001 (confirming that the Stage 1: Former Employee NPM Token Phishing & Publish of v1.1.5–1.1.7 request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Unpinned jsDelivr CDN Propagation of @ledgerhq/connect-kit-loader).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Angel Drainer Operator to the NPM & jsDelivr CDN (@ledgerhq/connect-kit) as the unauthorized versions are published.',
        detectionAndEvidence:
          'Registry monitors (Socket / Checkmarx / Phylum) alerting when an npm package version is published without a matching GitHub tag or OIDC provenance attestation. Correlate Sysmon or Windows Security Event telemetry for T1195.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Unpinned jsDelivr CDN Propagation of @ledgerhq/connect-kit-loader',
        storyAnalogy:
          'Even stores that locked their own front doors had installed an automatic chute that pulled whatever package was labeled "Latest Version 1" straight from the public warehouse into their lobby.',
        simpleExplanation:
          'Even dApps that pinned their own package-lock.json were impacted because @ledgerhq/connect-kit-loader was designed to dynamically load <script src="https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1/dist/umd/index.min.js"> at runtime in the user’s browser (using the floating major version tag @1, which caused jsDelivr’s CDN to automatically resolve and serve the newly published 1.1.7 bundle within minutes).',
        howItWorksInPractice:
          'This design bypassed build-time dependency pinning completely: every time a user loaded a dApp frontend in their browser, the browser fetched the latest 1.x build directly from cdn.jsdelivr.net. In the documented WAF exchange from Perimeter Firewall & NDR Tap to NPM & jsDelivr CDN (@ledgerhq/connect-kit), NPM & jsDelivr CDN (@ledgerhq/connect-kit) responds with ALERT T1059.007 (confirming that the Stage 2: Unpinned jsDelivr CDN Propagation of @ledgerhq/connect-kit-loader request succeeded on NPM & jsDelivr CDN (@ledgerhq/connect-kit) and establishing the runtime state required for Step #3 Stage 3: Rogue WalletConnect Modal & Permit2 / SetApprovalForAll Asset Drain).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the NPM & jsDelivr CDN to the Downstream Web3 dApp Frontend and triggers the Blockaid Web3 Runtime Scanner.',
        detectionAndEvidence:
          'Deploy frontend runtime integrity monitors such as Blockaid (continuous browser-side sensors that hash live third-party scripts and flag DOM mutations) to alert immediately on unexpected script changes or newly injected WalletConnect Project IDs inside live dApp frontends. Correlate Sysmon or Windows Security Event telemetry for T1059.007 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1657',
        plainTitle: 'Rogue WalletConnect Modal & Permit2 / SetApprovalForAll Asset Drain',
        storyAnalogy:
          'While the customer thinks they are simply signing in at the reception desk, the counterfeit screen asks them to sign a power-of-attorney form giving the thief permission to empty their vault.',
        simpleExplanation:
          'The injected Angel Drainer payload rendered a fake WalletConnect connection modal using an attacker-controlled WalletConnect Project ID, scanned the connected wallet’s token balances, and prompted the user to sign EIP-712 Permit2 off-chain messages or setApprovalForAll transactions (cryptographic token allowances that grant the attacker’s drainer smart contract permission to transfer the user’s ERC-20 tokens and NFTs without further confirmation).',
        howItWorksInPractice:
          'Ledger hardware wallets themselves remained secure, but users who blindly approved the malicious transaction prompt on their wallet screen authorized the transfer; Ledger and WalletConnect contained the incident within hours by revoking the rogue WalletConnect Project ID, purging jsDelivr’s cache, and shipping pinned v1.1.8. In the documented WAF exchange from NPM & jsDelivr CDN (@ledgerhq/connect-kit) to Downstream Web3 dApp Frontend, Downstream Web3 dApp Frontend responds with ALERT T1657 (confirming that the Stage 3: Rogue WalletConnect Modal & Permit2 / SetApprovalForAll Asset Drain request succeeded on Downstream Web3 dApp Frontend and completing the final execution objective of Ledger Connect-Kit NPM Compromise & Web3 WalletConnect Drainer).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Downstream Web3 dApp Frontend prompting the User Web3 Wallet (Permit2 / SetApprovalForAll) to authorize the Angel Drainer operator.',
        detectionAndEvidence:
          'Enable wallet-level transaction simulation tools such as Blockaid (which dry-run cryptographic signing prompts before user confirmation) to flag malicious eth_signTypedData_v4 (Permit2) and setApprovalForAll approvals targeting known drainer spender contracts. Correlate Sysmon or Windows Security Event telemetry for T1657 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a trusted hardware vault manufacturer that forgets to cancel a former employee warehouse keycard after they leave the company. A thief tricks the former employee out of that still-active keycard, pushes a poisoned connector module onto the public parts rack, and because hundreds of decentralized banks auto-load the latest version straight from a shared courier truck without pinning a version seal, every customer opening their vault is shown a counterfeit signing screen that empties their holdings.',
      storyMappings: [
        {
          storyTerm: 'Former employee keycard never canceled after offboarding',
          technicalTerm: 'Phished npmjs account retaining publish rights to @ledgerhq/connect-kit',
          tone: 'amber',
        },
        {
          storyTerm: 'Shared courier truck delivering unpinned updates to hundreds of banks',
          technicalTerm: '@ledgerhq/connect-kit-loader fetching unpinned jsDelivr @ledgerhq/connect-kit@1',
          tone: 'sky',
        },
        {
          storyTerm: 'Counterfeit vault signing screen',
          technicalTerm: 'Angel Drainer rogue WalletConnect modal using an attacker Project ID',
          tone: 'rose',
        },
        {
          storyTerm: 'Tricking customers into signing away their holdings',
          technicalTerm: 'Malicious eth_signTypedData_v4 (Permit2) and setApprovalForAll drain transactions',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'In this scenario (T1195.001, Ledger Connect-Kit NPM Compromise & Web3 WalletConnect Drainer), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: former Employee NPM Token Phishing, then unpinned jsDelivr CDN Propagation, then rogue WalletConnect Modal. Steps #1–#3 walk that chain end-to-end by covering Former Employee NPM Token Phishing, then Unpinned jsDelivr CDN Propagation, then Rogue WalletConnect Modal, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
    },
    steps: {
      1: {
        storyAnalogy:
          'By sending a convincing phishing lure to a former worker whose warehouse publishing badge was never revoked during offboarding, the thief walks into the parts registry and stamps three poisoned release editions right onto the official brand shelf.',
        storyMappings: [
          {
            storyTerm: 'Former worker badge never revoked at offboarding',
            technicalTerm: 'Active npmjs maintainer rights left on a former Ledger employee account',
            tone: 'amber',
          },
          {
            storyTerm: 'Convincing phishing lure',
            technicalTerm: 'Spear-phishing campaign harvesting the former employee NPM credentials',
            tone: 'sky',
          },
          {
            storyTerm: 'Three poisoned release editions on the official shelf',
            technicalTerm: 'Published @ledgerhq/connect-kit versions 1.1.5, 1.1.6, and 1.1.7',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden payload packed inside the connector',
            technicalTerm: 'Angel Drainer JavaScript bundle embedded in the official package release',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Even partner shops that carefully bolted down their own local parts list still relied on a tiny starter loader that automatically fetches whatever newest edition sits on the public delivery truck, spreading the poisoned module across hundreds of live finance storefronts in minutes.',
        storyMappings: [
          {
            storyTerm: 'Partner shops that bolted down their local parts list',
            technicalTerm: 'DeFi frontends with locked local package-lock.json files',
            tone: 'amber',
          },
          {
            storyTerm: 'Tiny starter loader fetching the newest edition automatically',
            technicalTerm: '@ledgerhq/connect-kit-loader pulling unpinned jsDelivr @1 CDN bundle',
            tone: 'sky',
          },
          {
            storyTerm: 'Public delivery truck',
            technicalTerm: 'cdn.jsdelivr.net serving newly published npm versions within minutes',
            tone: 'rose',
          },
          {
            storyTerm: 'Hundreds of live finance storefronts poisoned at once',
            technicalTerm: 'Simultaneous downstream impact across SushiSwap, Revoke.cash, and Web3 dApps',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy frontend runtime integrity monitors such as Blockaid (continuous browser-side sensors that hash live third-party scripts and flag DOM mutations) to alert immediately on unexpected script changes or newly injected WalletConnect Project IDs inside live dApp frontends. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1059.007 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'When a customer clicks connect on a trusted finance page, the hijacked connector slides a pixel-perfect counterfeit signature pad in front of them. Instead of approving a routine check-in, the customer unknowingly signs a blank power-of-attorney slip handing every asset in their vault straight to the thief.',
        storyMappings: [
          {
            storyTerm: 'Pixel-perfect counterfeit signature pad',
            technicalTerm: 'Rogue WalletConnect modal rendered using an attacker WalletConnect Project ID',
            tone: 'amber',
          },
          {
            storyTerm: 'Blank power-of-attorney slip',
            technicalTerm: 'Malicious Permit2 eth_signTypedData_v4 and setApprovalForAll signatures',
            tone: 'sky',
          },
          {
            storyTerm: 'Emptying every asset in the customer vault',
            technicalTerm: 'Automated Angel Drainer transfer of ERC-20 tokens and NFTs to drainer addresses',
            tone: 'rose',
          },
          {
            storyTerm: 'Pre-signing vault safety preview',
            technicalTerm: 'Wallet transaction simulation flagging drainer spender contracts before signing',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enable wallet-level transaction simulation tools such as Blockaid (which dry-run cryptographic signing prompts before user confirmation) to flag malicious eth_signTypedData_v4 (Permit2) and setApprovalForAll approvals targeting known drainer spender contracts. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1657 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
