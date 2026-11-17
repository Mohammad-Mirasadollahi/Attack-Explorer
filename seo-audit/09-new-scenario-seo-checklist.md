# Module 09: New Scenario & Article SEO/GEO Ingestion Checklist

> **Companion to:** `/docs/scenario-ingestion-and-seo-standard.md`
> **Purpose:** Pre-commit checklist ensuring every newly added cyber attack scenario, ransomware analysis, supply-chain case study, or DFIR article is 100% compliant with Attack Explorer's SEO, Schema.org, Topic Cluster, and Agentic GEO architecture.

---

## Mandatory 12-Point Pre-Commit Checklist for Every New Scenario / Article

- [ ] **1. Semantic URL Slug (`scenario.id`)**
  - Lowercase, hyphen-separated (`kebab-case`) containing the primary threat actor, tool/malware, CVE ID (if applicable), and attack vector.
  - Resolves cleanly at `/scenarios/<scenario.id>` and `/?scenario=<scenario.id>`.

- [ ] **2. SERP Title & Meta Description Length Discipline (`scenario.name` & `scenario.shortSubtitle`)**
  - `scenario.name` is **35–65 characters**, front-loading the primary entity + attack mechanism so `${scenario.code}: ${scenario.name} (${mitreIds})` avoids mid-entity SERP truncation.
  - `scenario.shortSubtitle` is **85–140 characters**, summarizing the 3-stage kill chain with concrete binary/protocol names.

- [ ] **3. Answer-First Lead Paragraph & Forensic Fact Sheet (`scenario.overview` & `multiSourceSynthesis`)**
  - Opens with a self-contained **40–60 word Answer-First summary** optimized for Google AI Overviews, Perplexity, and ChatGPT Search RAG extraction (Princeton GEO benchmark).
  - Visible **Answer-First Forensic Fact Sheet** renders immediately below `<header>` on `/scenarios/[id]`.

- [ ] **4. Google Search Central Visible Content Parity**
  - Every entity present in Schema.org JSON-LD (`about` MITRE `DefinedTerm`s, `mentions` CVEs and threat actor `Organization`s, `citation` `CreativeWork`s, and `HowToStep` stages) is visibly rendered in the server-side HTML of `/app/scenarios/[id]/page.tsx`.

- [ ] **5. Authoritative Primary Citations (`>= 3` Official Sources)**
  - Registered in `/lib/attack-sources-and-legal.ts` (or batch attribution registries) so `getScenarioAttribution(scenario)` returns at least 3 primary sources (CISA, Mandiant, Microsoft Threat Intelligence, CrowdStrike, Unit 42, Sophos, Picus, PikeRed, MITRE ATT&CK®, etc.).
  - Exact user-requested or vendor-canonical advisory URLs are explicitly mapped in `CUSTOM_SCENARIO_SOURCES[scenario.id]`.

- [ ] **6. Rich Schema.org `TechArticle` + `HowTo` + `BreadcrumbList` JSON-LD**
  - `buildScenarioJsonLd(scenario)` emits:
    - `TechArticle` with `headline`, `description`, `image`, `datePublished`, `dateModified`, `proficiencyLevel: "Expert"`, `keywords`, `about` (MITRE `DefinedTerm`s), `mentions` (CVEs + Threat Actor `Organization`s), and `citation` (`CreativeWork`s).
    - `HowTo` with `HowToStep` entries matching every stage in `scenario.stages`.
    - `BreadcrumbList` linking `/` -> `/scenarios/[id]`.

- [ ] **7. Topic Cluster & Lateral Internal Linking (`getRelatedClusterScenarios`)**
  - `/scenarios/[id]` renders 6 laterally related scenarios sharing the same `category` or `mitreTechniqueId` (`getRelatedClusterScenarios(scenario, 6)`), preventing orphan pages and reinforcing cybersecurity topical authority.

- [ ] **8. Inline Parenthetical & Story-to-Spec Standards**
  - All stage descriptions and telemetry annotations follow `/docs/inline-purpose-parenthetical-standard.md` and `/docs/story-to-spec-explanation-standard.md`, preserving exact CLI flags, registry keys, Event IDs, and API calls.

- [ ] **9. Automatic XML Sitemap & Static Route Registration**
  - Scenario is exported into `ATTACK_SCENARIOS` in `/lib/attack-scenarios.ts`, automatically adding `/scenarios/<scenario.id>` to `/app/sitemap.ts` (`priority: 0.8`) and `generateStaticParams()` in `/app/scenarios/[id]/page.tsx`.
  - `CANONICAL_CONTENT_LAST_MODIFIED` in `/lib/seo-metadata.ts` is updated to the current publication date.

- [ ] **10. Agentic GEO Corpus Synchronization (`/public/llms-full.txt`, `/public/llms.txt` & `Accept: text/markdown`)**
  - `/public/llms-full.txt` regenerated to include the full structured breakdown of the new scenario.
  - `/public/llms.txt` updated with the new total scenario count.
  - `buildAgentMarkdownResponse('/scenarios/' + scenario.id)` returns the Answer-First Fact Sheet, CVEs, Attributed Threat Actors, Kill-Chain Stages, Citations, and Related Topic Cluster links.

- [ ] **11. Automated Guardrail Unit Test Verification**
  - `npx --yes tsx --test --test-reporter=spec lib/*.test.ts` passes 100%, including the per-scenario SEO/GEO invariant test in `lib/seo-metadata.test.ts`.

- [ ] **12. Post-Deployment Instant Indexing (`IndexNow` + Search Console)**
  - New `/scenarios/<id>` URLs and `/sitemap.xml` are submitted via `IndexNow` (`https://api.indexnow.org/indexnow`) upon production deployment for immediate indexing in Bing, Yandex, ChatGPT Search, and Perplexity.
