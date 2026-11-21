import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

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
