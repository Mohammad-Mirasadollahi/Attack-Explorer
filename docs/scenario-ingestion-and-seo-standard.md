# Mandatory New Scenario & Article Ingestion + SEO/GEO Synchronization Standard

> **Authoritative Engineering Standard** · Applies to **all** new attack scenarios, DFIR forensic case studies, CVE advisories, and technical articles added to Attack Explorer.
> **Aligned With:** Google Search Central Structured Data & Technical Documentation Guidelines (2025/2026), Schema.org v28+ (`TechArticle`, `HowTo`, `DefinedTerm`, `BreadcrumbList`), Princeton Generative Engine Optimization (GEO) Benchmark Study, Bing/Yandex `IndexNow` Instant Indexing Protocol, and Cybersecurity Threat Intelligence (CTI) Topic Cluster Architecture.

---

## 1. Core Mandate

Whenever a new cyber attack scenario, ransomware investigation, supply-chain case study, zero-day exploit analysis, or technical article is added to Attack Explorer, **content ingestion and SEO/GEO indexing MUST be executed atomically in the same pull request / commit**.

A scenario is **not considered complete** until it is simultaneously:
1. Playable in the interactive 4-view canvas (`Attack_SCENARIOS` registry).
2. Attributed to at least **3 authoritative primary sources** (CISA, Mandiant, Microsoft Threat Intelligence, CrowdStrike, Unit 42, Sophos, Picus, PikeRed, MITRE ATT&CK®, etc.).
3. Enriched with **Curated Threat Intelligence (`CVE + CVSS + Attributed Threat Actor Groups`)** and rendered in the **Answer-First Forensic Fact Sheet** (satisfying Google Search Central Visible Content Parity).
4. Indexed via static route generation (`/scenarios/[id]`), XML Sitemap (`/sitemap.xml`), Schema.org JSON-LD (`TechArticle` with `mentions`/`keywords`/`dateModified` + `HowTo` + `BreadcrumbList`), Topic Cluster Lateral Links (`getRelatedClusterScenarios`), AI Agent Markdown Content Negotiation (`Accept: text/markdown`), and `/public/llms-full.txt`.

---

## 2. Authoritative Web-Researched SEO & GEO Best Practices (2025/2026)

Based on authoritative search engineering standards from **Google Search Central**, **Princeton University's GEO (Generative Engine Optimization) Benchmark**, **Schema.org**, and **Cybersecurity Threat Intelligence (CTI) SEO Research**, every new scenario/article MUST adhere to these 12 engineering rules:

### Rule 1 — Answer-First Summary & High-Density Forensic Fact Sheet (Princeton GEO Benchmark)
- **Research Finding:** Generative AI engines (Google AI Overviews, Perplexity, ChatGPT Search, Claude) use Retrieval-Augmented Generation (RAG) with **query fan-out**, decomposing complex security prompts into sub-queries for CVE IDs, CVSS scores, MITRE ATT&CK® IDs, and detection Event IDs. The Princeton GEO study demonstrates that **quotation/citation addition (+40% visibility)**, **concrete technical statistics (+37% visibility)**, and **Answer-First summary placement** are the highest-leverage levers for LLM citation.
- **Implementation Requirement:**
  - `scenario.overview` and `attribution.multiSourceSynthesis` must lead with a **self-contained 40–60 word Answer-First executive summary** stating the exact threat actor/campaign, CVE/technique, and telemetry pivot.
  - Every `/scenarios/[id]` page and `Accept: text/markdown` response automatically renders the **Answer-First Forensic Fact Sheet** (`multiSourceSynthesis`, `cves` with CVSS v3.1 scores, and `threatActors` with aliases/origins) immediately below the `<header>`.

### Rule 2 — Google Search Central Visible Content Parity (No Hidden Schema Entities)
- **Research Finding:** Google Search Central's *General Structured Data Guidelines* strictly mandate that **JSON-LD structured data must match the visible text on the page**. Marking up `mentions` (CVEs, threat actors), `citation` links, or `HowToStep` instructions in JSON-LD that are hidden behind client-only modals or omitted from SSR HTML risks manual actions or rich-result disqualification.
- **Implementation Requirement:**
  - All entities injected into `buildScenarioJsonLd(scenario)` (`about` MITRE `DefinedTerm`s, `mentions` CVEs and threat actor `Organization`s, `citation` `CreativeWork`s, and `HowToStep` stages) MUST be visibly rendered in the server-rendered HTML of `/app/scenarios/[id]/page.tsx`.

### Rule 3 — SERP Title & Meta Description Length Discipline (`applet-seo` & Google SERP Standard)
- **Research Finding:** Google desktop/mobile SERPs truncate `<title>` tags beyond ~60–70 characters (or 600px) and rewrite `<meta name="description">` snippets that are either too short (<100 chars) or stuffed with repetitive keywords (>165 chars).
- **Implementation Requirement:**
  - Keep `scenario.name` concise (**35–65 characters**) and front-load the primary entity (Threat Actor / Malware / Product / CVE) + Attack Vector so that `${scenario.code}: ${scenario.name} (${mitreIds})` displays the highest-signal identifiers before any SERP ellipsis.
  - Keep `scenario.shortSubtitle` between **85 and 140 characters**, summarizing the 3-stage progression (`Stage 1 -> Stage 2 -> Stage 3`) with concrete binary/protocol names.

### Rule 4 — Entity-First Schema.org `TechArticle` with `about`, `mentions`, `keywords`, `dateModified`, and `image`
- **Research Finding:** Modern semantic search and Knowledge Graph extractors distinguish between what a technical article is **primarily about** (`about`: MITRE ATT&CK® techniques modeled as `DefinedTerm` entities) and what entities it **references** (`mentions`: CVE identifiers modeled as `Thing` entities and APT/Ransomware groups modeled as `Organization` entities with `alternateName` aliases). Including `datePublished`, `dateModified`, `image`, and `proficiencyLevel: "Expert"` satisfies Google's `Article`/`TechArticle` rich result specifications.
- **Implementation Requirement:**
  - `buildScenarioJsonLd(scenario)` in `/lib/seo-metadata.ts` automatically populates `about`, `mentions`, `keywords`, `datePublished`, `dateModified`, and `image` from the scenario definition, attribution registry (`getScenarioAttribution`), and threat intel registry (`getCuratedThreatIntel`).
  - Whenever you add a new scenario, register its CVEs and threat actors in `/lib/threat-intel-service.ts` (or batch attribution registries) so `mentions` and `keywords` are populated with real CVE IDs and actor aliases.

### Rule 5 — Cybersecurity Topic Cluster & Lateral Internal Linking Architecture
- **Research Finding:** In enterprise cybersecurity SEO, isolated CVE or malware pages suffer from "orphan/shallow cluster decay." Connecting scenarios in a **Pillar (`/`, `/sources`) ↔ Category Cluster ↔ Lateral Peer (`/scenarios/[id]`)** internal link graph distributes PageRank and helps crawlers discover related tradecraft in a single crawl hop.
- **Implementation Requirement:**
  - `getRelatedClusterScenarios(scenario, 6)` in `/lib/seo-metadata.ts` scores all scenarios by shared `category` (+4 points) and shared `mitreTechniqueId` (+3 points per overlapping technique) and renders 6 lateral `<Link href="/scenarios/...">` cards on every `/scenarios/[id]` page as well as in the `Accept: text/markdown` agent output.

### Rule 6 — Exact Technical Token Preservation (Parenthetical Purpose Standard)
- **Research Finding:** SOC engineers and threat hunters search using **exact syntactic tokens** (`vssadmin.exe delete shadows /all /quiet`, `COR_ENABLE_PROFILING=1`, `EventID 4688`, `Sysmon EventID 10`, `CVE-2024-27198`, `ntds.dit`), while junior analysts and executives search conceptual terms.
- **Implementation Requirement:**
  - Follow `/docs/inline-purpose-parenthetical-standard.md`: preserve every command flag, registry path, environment variable, API call (`NtUnmapViewOfSection`), and Event ID verbatim inside `keySpecs`, `telemetry[].rawLog`, and `description`, paired with a concise inline parenthetical explanation.

### Rule 7 — Authoritative Multi-Vendor Citation Triangulation (E-E-A-T Signal)
- **Research Finding:** Search engines evaluate E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) on security topics by inspecting outbound citations to primary threat intelligence advisories and official vendor disclosures.
- **Implementation Requirement:**
  - Every scenario must map to **at least 3 primary sources** (`attribution.primarySources`) with valid canonical URLs, vendor names, reference codes (e.g., `AA23-320A`, `Mandiant-UNC`, `PikeRed-CLR-Profiler`), and `usageSummary`.

### Rule 8 — Dual-Format Agentic Delivery (`Accept: text/markdown` + `/llms-full.txt`)
- **Research Finding:** While `/llms.txt` and `/llms-full.txt` provide a bulk index for LLM ingestion pipelines, real-time AI search crawlers (`PerplexityBot`, `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`) fetch individual `/scenarios/[id]` URLs directly during live user queries.
- **Implementation Requirement:**
  - `middleware.ts` intercepts requests with `Accept: text/markdown` on `/`, `/about`, `/sources`, and `/scenarios/[id]` and serves deterministic, token-efficient Markdown generated by `buildAgentMarkdownResponse()` with `Vary: Accept`.
  - After adding any scenario, `/public/llms-full.txt` and `/public/llms.txt` MUST be regenerated so static bulk crawlers and live per-URL crawlers stay 100% synchronized.

### Rule 9 — Content Freshness & `CANONICAL_CONTENT_LAST_MODIFIED` Synchronization
- **Research Finding:** Search engines and AI answer engines prioritize recently updated threat intelligence when ranking zero-day and ransomware analyses, provided `sitemap.xml` `<lastmod>` and Schema.org `dateModified` reflect genuine content updates rather than dynamic per-request timestamps.
- **Implementation Requirement:**
  - Update `CANONICAL_CONTENT_LAST_MODIFIED` in `/lib/seo-metadata.ts` (and `LAST_MODIFIED_DATE` in `/app/sitemap.ts`) to the real ISO publication date whenever new scenarios are added or existing scenarios are materially revised.

### Rule 10 — Instant Indexing Protocol (`IndexNow` + Sitemap Ping) for Time-Sensitive Advisories
- **Research Finding:** Waiting days for organic crawl discovery on breaking CVE or ransomware advisories forfeits initial search demand. `IndexNow` (supported by Microsoft Bing, Yandex, Naver, Seznam, and downstream AI search indices such as ChatGPT Search and Copilot) notifies search engines immediately when URLs are added or updated.
- **Implementation Requirement:**
  - Upon deploying new `/scenarios/[id]` routes to production, submit the newly added canonical URLs via `IndexNow` (`POST https://api.indexnow.org/indexnow`) and verify `/sitemap.xml` ingestion in Google Search Console.

### Rule 11 — 100% English Technical Corpus & Zero Localization Contamination
- **Research Finding:** Mixing non-English characters into technical metadata, JSON-LD, or scenario descriptions corrupts language detection (`inLanguage: "en-US"`) and degrades vector embedding similarity for English cybersecurity queries.
- **Implementation Requirement:**
  - Every string in `/modules/scenarios/**`, `/lib/seo-metadata.ts`, `/app/**`, and `/public/llms*.txt` must remain 100% English (enforced by automated regex assertions in the test suite).

### Rule 12 — Automated CI/CD SEO & GEO Guardrail Verification
- **Research Finding:** Manual SEO checklists regress over time unless enforced by automated unit tests that fail the build when a scenario is missing from the sitemap, JSON-LD, or `llms-full.txt`.
- **Implementation Requirement:**
  - `lib/seo-metadata.test.ts` iterates over **every scenario in `ATTACK_SCENARIOS`** and asserts URL slug validity, XML sitemap presence, Schema.org `TechArticle` (`citation.length >= 3`, `image`, `dateModified`, `keywords`, `mentions`), `HowTo` step parity, Topic Cluster lateral links (`getRelatedClusterScenarios`), and `/public/llms-full.txt` inclusion.

---

## 3. Step-by-Step Ingestion & SEO Workflow (7 Mandatory Steps)

Follow these 7 steps in exact order whenever adding one or more scenarios/articles:

### Step 1: Author the Scenario with SEO-Ready Slug & Copy (`/modules/scenarios/...`)
1. **`id` (URL Slug):** Must be lowercase, URL-safe, hyphen-separated (`kebab-case`) containing the primary threat actor, malware/tool, CVE (if applicable), and technique keyword.
   - *Good:* `'pikered-clr-profiler-trusted-binary-loader-chain'`
   - *Good:* `'jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning'`
2. **`code`:** Unique sequential identifier (`SC-xxx`, `RW-xxx`, `SUP-xxx`, `CLR-xxx`, `APT-xxx`, `DFIR-xxx`).
3. **`name` (H1 & `<title>` Root):** Concise (35–65 chars), front-loading the primary entity + attack vector.
4. **`shortSubtitle` (Meta Description Lead):** 1-sentence summary (85–140 chars) naming the exact 3-stage progression.
5. **`overview` (Answer-First Lead Paragraph):** 2–4 dense sentences answering *What is the attack?*, *How does the mechanism work under the hood?*, and *Which forensic artifacts expose it?*
6. **`stages` (3 Complete Stages -> `HowToStep` Schema):**
   - Valid `mitreTechniqueId` (`Txxxx` or `Txxxx.xxx`) and `mitreTechniqueName`.
   - `description` adhering to `/docs/inline-purpose-parenthetical-standard.md` and `/docs/story-to-spec-explanation-standard.md`.
   - At least 2 `keySpecs` items per stage with exact technical values.
7. **`telemetry` & `detectionRule`:** Realistic Sysmon / Windows Security / Linux Auditd / CloudTrail logs and actionable `detectionRule.mitigation`.

### Step 2: Register Scenario in `/lib/attack-scenarios.ts`
Import your new scenario batch and append it to `RAW_ATTACK_SCENARIOS`. Because `ATTACK_SCENARIOS` is the single source of truth, registering a scenario here automatically wires it into:
- `/app/sitemap.ts` (XML Sitemap `<url>` entry)
- `/app/scenarios/[id]/page.tsx` (`generateStaticParams()`, `generateMetadata()`, SSR HTML, Answer-First Fact Sheet, Topic Cluster Lateral Links, and JSON-LD)
- `/app/sources/page.tsx` (Crawlable HTML Directory of all scenarios)
- `/components/SeoSemanticDocumentation.tsx` (Root SSR semantic directory)

### Step 3: Register Primary Source Citations & Threat Intel Entities
1. **Primary Sources (`/lib/attack-sources-and-legal.ts` or batch attribution module):**
   - Ensure `getScenarioAttribution(scenario)` returns **at least 3 primary sources** (`primarySources`) with accurate `organization`, `title`, `referenceCode`, `url`, and `usageSummary`.
   - If the user or advisory provides a specific reference URL, add an explicit entry in `CUSTOM_SCENARIO_SOURCES[scenario.id]` so the exact URL is emitted in both visible HTML and Schema.org `TechArticle.citation`.
2. **Threat Intel Entities (`/lib/threat-intel-service.ts` or batch intel module):**
   - Ensure `getCuratedThreatIntel(scenario)` returns accurate `cves` (`id`, `cvss`, `severity`, `summary`) and `threatActors` (`name`, `aliases`, `origin`, `campaigns`). These automatically populate both the visible **Answer-First Forensic Fact Sheet** on `/scenarios/[id]` and the `mentions` / `keywords` arrays in Schema.org `TechArticle` JSON-LD.

### Step 4: Update Step-by-Step Operational Guides (If Custom Guides Needed)
Verify `getScenarioStepGuide(scenario)` in `/lib/scenario-step-guides.ts` produces rich per-stage operational narratives, inspection checklists, and command breakdowns.

### Step 5: Update Publication Timestamp & Regenerate `/public/llms-full.txt` + `/public/llms.txt`
1. Update `CANONICAL_CONTENT_LAST_MODIFIED` in `/lib/seo-metadata.ts` and `LAST_MODIFIED_DATE` in `/app/sitemap.ts` when publishing a new batch.
2. Run this one-liner from the workspace root to regenerate `/public/llms-full.txt` from `ATTACK_SCENARIOS`:

```bash
npx --yes tsx -e '
import fs from "node:fs";
import { ATTACK_SCENARIOS } from "./lib/attack-scenarios";
import { getScenarioAttribution, GLOBAL_FRAMEWORK_SOURCES, AUTHOR_REFERENCES, LEGAL_COMPLIANCE_STATEMENT } from "./lib/attack-sources-and-legal";
import { AUTHOR_PROFILE } from "./lib/seo-metadata";

const lines: string[] = [
  "# Attack Explorer — Full Technical Corpus (llms-full.txt)",
  "",
  `> Total Validated Scenarios: ${ATTACK_SCENARIOS.length}`,
  `> Author & Architect: ${AUTHOR_PROFILE.name} (${AUTHOR_PROFILE.jobTitle})`,
  `> Website: https://attackexplorer.org`,
  `> Repository: ${AUTHOR_REFERENCES.githubRepository}`,
  `> License & Compliance: ${LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee}`,
  "",
  "## 1. Global Analytical Frameworks",
  ...GLOBAL_FRAMEWORK_SOURCES.map(s => `- **${s.organization} — ${s.title}** (${s.referenceCode}): ${s.url} — ${s.usageSummary}`),
  "",
  `## 2. Complete Attack & DFIR Scenario Catalog (${ATTACK_SCENARIOS.length} Scenarios)`,
  "",
];

for (const sc of ATTACK_SCENARIOS) {
  const attr = getScenarioAttribution(sc);
  const mitreList = attr.mitreTechniques.map(t => `${t.id} (${t.name} - ${t.tactic})`).join(", ");
  const sourcesList = attr.primarySources.map(s => `${s.organization}: ${s.title} (${s.url})`).join(" | ");
  lines.push(`### ${sc.code}: ${sc.name}`);
  lines.push(`- **Scenario ID**: \`${sc.id}\``);
  lines.push(`- **Canonical URL**: https://attackexplorer.org/scenarios/${sc.id}`);
  lines.push(`- **Interactive Simulator URL**: https://attackexplorer.org/?scenario=${sc.id}`);
  lines.push(`- **Category**: ${sc.category} | **Severity**: ${sc.severity}`);
  lines.push(`- **Subtitle**: ${sc.shortSubtitle}`);
  lines.push(`- **Overview**: ${sc.overview}`);
  lines.push(`- **MITRE ATT&CK Techniques**: ${mitreList}`);
  lines.push(`- **Primary Analytical Sources**: ${sourcesList}`);
  lines.push(`- **Kill-Chain Stages**:`);
  for (const st of sc.stages) {
    const specs = st.keySpecs.map(k => `${k.term}=${k.value}`).join("; ");
    lines.push(`  - Stage ${st.index} (${st.mitreTechniqueId} · ${st.mitreTechniqueName}): **${st.title}** — ${st.description} [Specs: ${specs}]`);
  }
  lines.push("");
}

fs.writeFileSync("public/llms-full.txt", lines.join("\n") + "\n", "utf8");
console.log("Generated public/llms-full.txt with", ATTACK_SCENARIOS.length, "scenarios.");
'
```

3. Update the scenario count and newly added highlights in `/public/llms.txt`.

### Step 6: Run the Automated SEO & Scenario Verification Suite
Run the full unit test suite (including the automated SEO guardrail in `lib/seo-metadata.test.ts`):

```bash
npx --yes tsx --test --test-reporter=spec lib/*.test.ts
```

Every scenario in `ATTACK_SCENARIOS` is automatically tested for:
- Valid URL-safe `id` slug.
- Presence in `/sitemap.xml` (`app/sitemap.ts`).
- Valid Schema.org `TechArticle` + `HowTo` + `BreadcrumbList` JSON-LD with `>= 3` primary source citations, `image`, `datePublished`, `dateModified`, `keywords`, and `mentions`.
- Valid Topic Cluster lateral links (`getRelatedClusterScenarios(scenario, 6)`).
- Valid AI Agent Markdown output via `buildAgentMarkdownResponse('/scenarios/' + scenario.id)`.
- Presence of `https://attackexplorer.org/scenarios/<id>` inside `/public/llms-full.txt`.

### Step 7: Post-Deployment Instant Indexing (`IndexNow` & Search Console)
When deploying new scenario URLs to production (`https://attackexplorer.org`), trigger instant discovery for Bing, Yandex, ChatGPT Search, and Copilot indices via `IndexNow`:

```bash
curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "attackexplorer.org",
    "key": "<INDEXNOW_API_KEY>",
    "keyLocation": "https://attackexplorer.org/<INDEXNOW_API_KEY>.txt",
    "urlList": [
      "https://attackexplorer.org/scenarios/<new-scenario-id>",
      "https://attackexplorer.org/sitemap.xml",
      "https://attackexplorer.org/llms-full.txt"
    ]
  }'
```
