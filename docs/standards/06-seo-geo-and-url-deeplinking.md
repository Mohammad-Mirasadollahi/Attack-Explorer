# Module 06 — SEO, GEO (Generative Engine Optimization), Schema.org & URL Deep-Linking (`MOD-06`)

> **Module ID**: `MOD-06`  
> **Scope**: Search Engine Optimization (SEO), Generative Engine Optimization (GEO), Schema.org JSON-LD (`TechArticle`, `HowTo`, `BreadcrumbList`), AI Agent Markdown negotiation (`Accept: text/markdown`), `/public/llms-full.txt`, and Live Browser URL State / Section Deep-Linking (`?scenario=...&step=...#clause-X.Y`).  
> **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Related Deep-Dive**: [`/docs/scenario-ingestion-and-seo-standard.md`](../scenario-ingestion-and-seo-standard.md) · **Enforced By**: `/lib/seo-metadata.test.ts` & `/lib/inspector-scope.test.ts`

---

## 1. Purpose & Core Philosophy

Every scenario, step, section, and forensic clause in **Attack Explorer** must be:
1. **Discoverable by Search Engines** via crawlable SSR routes (`/scenarios/[id]`), XML sitemaps (`/sitemap.xml`), and rich Schema.org structured data (`TechArticle`, `HowTo`, `BreadcrumbList`).
2. **Citable by AI Answer Engines (GEO)** via Answer-First Forensic Fact Sheets, `Accept: text/markdown` content negotiation, and `/public/llms-full.txt`.
3. **Directly Shareable by Human Analysts via Browser URL** (`window.location.search` + `window.location.hash`) so copying the URL at any point shares the exact active scenario, stage, expanded node pipeline, sub-node, packet, inspector tab, or numbered step clause (`#clause-2.1`).

---

## 2. Mandatory SEO & GEO Architecture Rules

| # | Standard Rule | Technical Requirement | Enforcing File |
| :--- | :--- | :--- | :--- |
| **1** | **Static SSR Route & Canonical URL** | Every scenario must resolve at `/scenarios/<id>` via `generateStaticParams()` with a self-referencing canonical URL (`https://attackexplorer.org/scenarios/<id>`). | `/app/scenarios/[id]/page.tsx` |
| **2** | **SERP Title & Description Discipline** | `scenario.name` (`35–65 chars` ideal) front-loads Entity + Vector; `scenario.shortSubtitle` (`85–140 chars` ideal) summarizes the 3-stage progression. | `/lib/seo-metadata.ts` |
| **3** | **Answer-First Forensic Fact Sheet (GEO + Visible Parity)** | Every `/scenarios/[id]` page visibly renders `multiSourceSynthesis`, `cves` (with CVSS scores), and `threatActors` (with aliases/origins) in an `<aside aria-label="Forensic Fact Sheet">`, matching JSON-LD `mentions` 1:1. | `/app/scenarios/[id]/page.tsx` |
| **4** | **Schema.org 3-Entity Graph (`TechArticle` + `HowTo` + `BreadcrumbList`)** | `buildScenarioJsonLd(scenario)` emits a `@graph` containing `TechArticle` (`about`, `mentions`, `keywords`, `citation >= 3`, `image`, `datePublished`, `dateModified`), `HowTo` (`step` 1..N), and 4-level `BreadcrumbList`. | `/lib/seo-metadata.ts` |
| **5** | **Topic Cluster Lateral Internal Links** | Every `/scenarios/[id]` page renders 6 related scenarios (`getRelatedClusterScenarios(scenario, 6)`) scored by shared category (+4) and shared MITRE technique (+3). | `/lib/seo-metadata.ts` |
| **6** | **Dual-Format Agentic Delivery (`Accept: text/markdown` & `llms-full.txt`)** | `middleware.ts` serves clean Markdown when `Accept: text/markdown` is requested, and `/public/llms-full.txt` catalogs 100% of scenarios. | `/middleware.ts`, `/public/llms-full.txt` |

---

## 3. Browser URL State Synchronization & Section Deep-Linking Standard

Whenever a user navigates to any scenario, stage/step, expanded node section, sub-node, packet, or inspector tab, the browser address bar **must** automatically reflect that exact location via `serializeWorkbenchUrlState` and restore it on load via `parseWorkbenchUrlState` (`/lib/diagram-memory-store.ts`).

### 3.1 Canonical Query Parameters (`window.location.search`)

| Query Parameter | Example Value | Restored Workbench State |
| :--- | :--- | :--- |
| `scenario` | `?scenario=log4shell-dfir` | Selects the active scenario (`selectedScenarioId`). |
| `step` (or `stage`) | `&step=2` | Sets the active simulation stage (`activeStageIndex = 2`). |
| `expanded` (or `section`) | `&expanded=wks` | Opens the internal 5-node sub-board for parent node `wks` (`EXPANDED_NODE` scope). |
| `subnode` | `&subnode=wks-sub-2` | Selects internal sub-node `#N.2` inside the expanded sub-board (`INTERNAL_SUBNODE` scope). |
| `node` | `&node=c2` | Highlights main-board node `c2` on the topology canvas. |
| `packet` | `&packet=ph-tel-2` | Selects telemetry packet/event `ph-tel-2`. |
| `inspector` & `tab` | `&inspector=1&tab=STEP_GUIDE` | Opens the Full-Screen Inspector on the specified tab (`OVERVIEW`, `STEP_GUIDE`, `LOGS`, `MEMORY`, `THREAT_INTEL`). |
| `view` & `env` | `&view=RAW_TABLES&env=SERVER` | Restores Raw Tables view mode and active target environment. |

### 3.2 Canonical Hash Anchors (`window.location.hash`) for Fine-Grained Step & Section Sharing

Every major section, stage card, and numbered step clause in the DOM **must** expose a deterministic `id` attribute so users can share links pointing to a specific part of a step:

| Hash Fragment Pattern | Target DOM Element & Behavior | Example Shareable Deep Link |
| :--- | :--- | :--- |
| `#step-0` | Scenario Briefing card in `StepByStepGuidePanel` | `/?scenario=process-hollowing&inspector=1&tab=STEP_GUIDE#step-0` |
| `#step-1` .. `#step-N` | Stage `N` card in Workbench or `StepByStepGuidePanel` | `/?scenario=process-hollowing&step=2#step-2` |
| `#step-guide-step-N` | Opens `STEP_GUIDE` tab directly at Stage `N` | `/?scenario=log4shell-dfir&step=2&inspector=1&tab=STEP_GUIDE#step-guide-step-2` |
| `#clause-N.M` | Specific numbered clause (`#1.1`, `#1.2`, `#2.1`) inside Stage `N` | `/?scenario=log4shell-dfir&step=2&inspector=1&tab=STEP_GUIDE#clause-2.1` |
| `#section-<nodeId>` | Expanded internal sub-board for `<nodeId>` | `/?scenario=process-hollowing&expanded=wks#section-wks` |
| `#substep-<subNodeId>` | Internal sub-step card inside an expanded node | `/?scenario=process-hollowing&expanded=wks&subnode=wks-sub-2#substep-wks-sub-2` |
| `#forensic-fact-sheet` | Forensic Fact Sheet section on `/scenarios/[id]` | `/scenarios/log4shell-dfir#forensic-fact-sheet` |
| `#kill-chain-stages` / `#stage-N` | Stage `N` breakdown card on `/scenarios/[id]` | `/scenarios/log4shell-dfir#stage-2` |

---

## 4. Verification Checklist (`MOD-06`)

- [ ] Does `/sitemap.xml` include `https://attackexplorer.org/scenarios/<id>`?
- [ ] Does `buildScenarioJsonLd(scenario)` emit valid `TechArticle`, `HowTo`, and 4-level `BreadcrumbList` schemas?
- [ ] Has `/public/llms-full.txt` been regenerated to include the new scenario?
- [ ] Does navigating to any step, section, or clause update `window.location.search` and `window.location.hash` via `serializeWorkbenchUrlState`?
