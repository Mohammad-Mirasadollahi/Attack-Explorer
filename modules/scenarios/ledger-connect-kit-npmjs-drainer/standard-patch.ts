import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
        'In December 2023, a threat actor phished a former Ledger employee whose npmjs publishing account still retained write access to @ledgerhq/connect-kit (the official JavaScript connector library bridging decentralized web apps to hardware wallets). The attacker published versions 1.1.5, 1.1.6, and 1.1.7 containing the Angel Drainer wallet-draining script and a rogue WalletConnect project ID; because @ledgerhq/connect-kit-loader dynamically loaded https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1 without exact version pinning (floating on the major @1 tag so every new minor release propagated instantly), hundreds of DeFi applications immediately served the drainer to live users.',
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
          'Deploy frontend runtime integrity monitors such as Blockaid (continuous browser-side sensors that hash live third-party scripts and flag DOM mutations) to alert immediately on unexpected script changes or newly injected WalletConnect Project IDs inside live dApp frontends.',
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
          'Enable wallet-level transaction simulation tools such as Blockaid (which dry-run cryptographic signing prompts before user confirmation) to flag malicious eth_signTypedData_v4 (Permit2) and setApprovalForAll approvals targeting known drainer spender contracts.',
      },
    },
  };
