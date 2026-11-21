import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'polyfill-io-cdn-domain-supply-chain',
    briefing: {
      headline:
        'Following the ownership transfer of the cdn.polyfill.io domain (CVE-2024-38526), the CDN edge servers dynamically inject obfuscated JavaScript into mobile browsers across 100,000+ websites lacking Subresource Integrity (SRI).',
      storyAnalogy:
        'Imagine 100,000 retail stores hiring an outside translator who stands inside their checkout lane to help older customers read the signs. Years later, a syndicate buys the translator agency. Whenever a store manager looks, the translator behaves normally, but whenever a customer walks in on a mobile phone after hours, the translator slips a forged receipt into their bag.',
      plainSummary:
        'In this scenario (T1195.002, cdn.polyfill.io CDN Domain Takeover & Conditional JS Injection (CVE-2024-38526)), the attacker follows one continuous arc: unpinned Third-Party <script> Tag Without, then hTTP User-Agent Fingerprinting, then first-Party DOM Execution. Steps #1–#3 examine #1 Unpinned Third-Party <script> Tag Without; #2 HTTP User-Agent Fingerprinting; #3 First-Party DOM Execution. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates process, authentication, and network telemetry for T1195.002 across the documented kill chain.',
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
