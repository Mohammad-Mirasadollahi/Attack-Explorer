# Module 05 — Multi-Source Threat Intelligence Attribution & E-E-A-T Triangulation (`MOD-05`)

> **Module ID**: `MOD-05`  
> **Scope**: Authoritative vendor/CERT citation requirements, the 3-Vantage-Point synthesis rule (`>= 3 sources`), CVE/CVSS v3.1 cataloging, and threat actor attribution across `/lib/attack-sources-and-legal.ts` and `/lib/threat-intel-service.ts`.  
> **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Related Deep-Dive**: [`/docs/analytical-sources-and-references.md`](../analytical-sources-and-references.md) · **Enforced By**: `/lib/documentation-standards.ts` & `/lib/seo-metadata.test.ts`

---

## 1. Purpose & Core Philosophy: The 3-Vantage-Point Rule

No single security vendor observes every stage of a real-world intrusion. To achieve authoritative E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) and zero fabricated facts, **every scenario added to Attack Explorer MUST be triangulated across at least 3 independent primary sources** representing three complementary telemetry vantage points:

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ VANTAGE POINT 1 · INITIAL ACCESS & EXPLOIT ROOT-CAUSE RESEARCH                     │
│ Vendor PSIRT, NIST NVD, Assetnote, ProjectDiscovery, Rapid7, Huntress, PikeRed     │
│ ──▶ Explains the exact packet format, URI normalization flaw, or loader entry.     │
├────────────────────────────────────────────────────────────────────────────────────┤
│ VANTAGE POINT 2 · IMPLANT, MEMORY & POST-EXPLOITATION REVERSE ENGINEERING          │
│ Mandiant, Unit 42, Elastic Security Labs, Kaspersky GReAT, CrowdStrike, Talos      │
│ ──▶ Dissects the in-memory payload, kernel driver, COM profiler, or C2 protocol.   │
├────────────────────────────────────────────────────────────────────────────────────┤
│ VANTAGE POINT 3 · SIEM, EDR & NATIONAL CYBER DEFENSE ADVISORIES                    │
│ CISA Joint Advisories / KEV, Microsoft MSTIC / Sysinternals, Splunk SURGe, SigmaHQ │
│ ──▶ Provides Event IDs (Sysmon 1..25, WinSec 4624/4769), hunting queries & patches.│
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Mandatory Attribution & Citation Rules

### Rule 1 — Minimum 3 Independent Primary Sources (`primarySources.length >= 3`)
Every scenario's attribution record (`getScenarioAttribution(scenario)`) **must** return at least 3 `AnalyticalSourceEntry` objects, each containing:
- `organization`: Official organization name (e.g., `'CISA & FBI Joint Advisory'`, `'Mandiant (Google Cloud Threat Intelligence)'`, `'PikeRed Cybersecurity Research'`).
- `title`: Exact title of the advisory, technical blog, or specification.
- `referenceCode`: Official identifier (`'AA23-353A'`, `'CVE-2024-3400'`, `'MITRE T1574.012'`, `'PikeRed-CLR-2025'`).
- `url`: Valid, canonical `https://` URL to the primary publication.
- `usageSummary`: 1–2 sentences explaining **which specific technical fact in the scenario** was derived from this source.

### Rule 2 — Explicit Multi-Source Synthesis (`multiSourceSynthesis`)
Every scenario attribution record must include a non-empty `multiSourceSynthesis` paragraph (`>= 120 characters`) that explicitly connects the 3+ sources:
- **Required Formula**: *"Combines [Source 1's exploit/initial-access mechanics] with [Source 2's in-memory/implant reverse engineering] and [Source 3's SIEM/Sysmon detection and remediation guidance]."*

### Rule 3 — Curated Threat Intelligence Entities (`cves` & `threatActors`)
Whenever a scenario involves specific CVEs or named threat groups (`APT`, `UNC`, `FIN`, or ransomware operations), register them in `/lib/threat-intel-service.ts` (or batch attribution modules) so `getCuratedThreatIntel(scenario)` returns:
1. **`cves`**: Array of `{ id: 'CVE-YYYY-NNNNN', cvss: 9.8, severity: 'CRITICAL', summary: '...' }`.
2. **`threatActors`**: Array of `{ name: '...', aliases: ['...'], origin: '...', campaigns: ['...'] }`.

---

## 3. Concrete Before & After Examples (❌ Anti-Pattern vs. ✅ Canonical Pattern)

### ❌ Anti-Pattern (Single Vague Source, No Synthesis)
```ts
primarySources: [
  {
    organization: 'Security Blog',
    title: 'Article about CLR Profiler',
    referenceCode: 'BLOG-1',
    url: 'https://example.com',
    usageSummary: 'Used for scenario.',
  },
]
```

### ✅ Canonical Pattern (3 Independent Vantage Points + Explicit Synthesis)
```ts
primarySources: [
  {
    organization: 'PikeRed Cybersecurity Research',
    title: 'Abusing the CLR Profiler: A Trusted-Binary Loader Chain for Initial Access',
    referenceCode: 'PikeRed-CLR-Profiler',
    url: 'https://www.pikered.com/en/learn/abusing-the-clr-profiler-a-trusted-binary-loader-chain-for-initial-access/',
    usageSummary: 'Documents the end-to-end VHDX Mark-of-the-Web bypass, hidden (+h +s) staging files, and KeePass.exe -> clr.dll COR_PROFILER_PATH hijacking chain.',
  },
  {
    organization: 'The MITRE Corporation',
    title: 'MITRE ATT&CK T1574.012 (COR_PROFILER) & T1553.005 (Container File MotW Bypass)',
    referenceCode: 'T1574.012 / T1553.005',
    url: 'https://attack.mitre.org/techniques/T1574/012/',
    usageSummary: 'Provides canonical tactic/technique taxonomy for environment-variable CLR profiler hijacking and disk-image container delivery.',
  },
  {
    organization: 'Microsoft Learn (.NET Runtime & Sysinternals Sysmon)',
    title: 'CLR Profiling Environment Variables & Sysmon Event ID 1 / 7 Telemetry',
    referenceCode: 'MS-CLR-PROFILER-DOCS',
    url: 'https://learn.microsoft.com/en-us/dotnet/framework/unmanaged-api/profiling/setting-up-a-profiling-environment',
    usageSummary: 'Specifies how clr.dll!ProfilingAPIUtility::LoadProfiler evaluates COR_ENABLE_PROFILING=1 and how Sysmon Event ID 7 captures unsigned profiler DLL loads.',
  },
]
```

---

## 4. Verification Checklist (`MOD-05`)

- [ ] Does `getScenarioAttribution(scenario).primarySources` contain `>= 3` distinct, valid `https://` sources?
- [ ] If the user provided a specific external research URL, is that exact URL included in `primarySources`?
- [ ] Does `multiSourceSynthesis` clearly state how the sources complement one another across exploit, implant, and detection layers?
- [ ] Are all relevant CVEs (`CVE-YYYY-NNNNN`) and threat actor aliases registered for the Forensic Fact Sheet and Schema.org `mentions`?
