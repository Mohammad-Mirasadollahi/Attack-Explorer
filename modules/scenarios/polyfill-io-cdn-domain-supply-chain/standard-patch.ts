import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
