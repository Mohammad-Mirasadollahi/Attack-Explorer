# Attack Explorer — Modular Documentation & Content Authoring Standard System (`MOD-00`)

> **Module ID**: `MOD-00` (Master Router & Architecture Index)  
> **Scope**: All Markdown Engineering Documents (`/docs/**`, `/seo-audit/**`), Attack Scenario Definitions (`/lib/scenarios/**`), Step-by-Step Operational Guides (`/lib/step-guides/**`), Threat Intelligence & Attribution Registries (`/lib/attack-sources-and-legal.ts`, `/lib/threat-intel-service.ts`), SEO/GEO Metadata (`/lib/seo-metadata.ts`), and Workbench UI Copy (`/components/**`).  
> **Status**: Mandatory Permanent Standard · Enforced by `/lib/documentation-standards.ts` and `/lib/documentation-standards.test.ts`.

---

## 1. Why Our Documentation Standard Is Modular

Because **Attack Explorer** unifies interactive 2D network diagrams, kernel/process memory maps, raw SIEM/Sysmon telemetry, 3-layer pedagogical narratives, multi-vendor threat intelligence citations, and programmatic SEO/GEO structured data, **a single monolithic style guide cannot govern every artifact effectively**.

Instead, the Attack Explorer Documentation & Content Authoring Standard is architected as **7 specialized, composable modules (`MOD-01` through `MOD-07`)**. Authors and automated tools load only the modules relevant to their current task while maintaining 100% consistency across the entire platform.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       MOD-00 · MASTER DOCUMENTATION ROUTER                             │
│                        (/docs/standards/README.md)                                     │
└───────────────┬────────────────────────────────────────┬───────────────────────────────┘
                │                                        │
   ┌────────────▼────────────┐              ┌────────────▼────────────┐
   │  STRUCTURAL & PROSE     │              │  TECHNICAL & FORENSIC   │
   │  AUTHORING MODULES      │              │  DOMAIN MODULES         │
   ├─────────────────────────┤              ├─────────────────────────┤
   │ • MOD-01: Document      │              │ • MOD-04: Telemetry,    │
   │   Templates & Skeleton  │              │   Memory & Diagram Sync │
   │ • MOD-02: Writing Style │              │ • MOD-05: Multi-Source  │
   │   & 3-Layer Pedagogy    │              │   Attribution & E-E-A-T │
   │ • MOD-03: Inline Why    │              │ • MOD-06: SEO, GEO,     │
   │   Parentheticals & CLI  │              │   Schema & URL Links    │
   └────────────┬────────────┘              └────────────┬────────────┘
                │                                        │
                └───────────────────┬────────────────────┘
                                    ▼
                    ┌───────────────────────────────┐
                    │  MOD-07 · UI COPY & CI GATES  │
                    │  Zero-Truncation & Unit Tests │
                    └───────────────────────────────┘
```

---

## 2. Directory of Standard Modules (`MOD-01` .. `MOD-07`)

| Module ID | File Path | Title & Domain Responsibility | When You MUST Load This Module |
| :--- | :--- | :--- | :--- |
| **`MOD-01`** | [`/docs/standards/01-document-template-and-structure.md`](./01-document-template-and-structure.md) | **Document Templates, Section Hierarchy & Character Budgets** | Whenever creating a new Markdown doc, a new `AttackScenario` object, or a new `ScenarioStepGuide` module. |
| **`MOD-02`** | [`/docs/standards/02-writing-style-and-pedagogy.md`](./02-writing-style-and-pedagogy.md) | **Writing Style, Tone, Voice & 3-Layer Story-to-Spec Pedagogy** | Whenever writing any narrative (`overview`, `storyAnalogy`, `plainSummary`, `simpleExplanation`, `howItWorksInPractice`, or Markdown prose). |
| **`MOD-03`** | [`/docs/standards/03-inline-parentheticals-and-tokens.md`](./03-inline-parentheticals-and-tokens.md) | **Technical Tokens, Inline Purpose Parentheticals & CLI Breakdowns** | Whenever referencing processes, PIDs, hex flags, Win32/Linux APIs, ports, registry keys, or command lines. |
| **`MOD-04`** | [`/docs/standards/04-telemetry-memory-and-diagrams.md`](./04-telemetry-memory-and-diagrams.md) | **Forensic Telemetry, Memory Maps, Topology Nodes & Sequence Flows** | Whenever defining 6-node diagrams (`①..⑥`), sequence arrows (`#N.1→` / `⇠#N.2`), raw SIEM logs, or detection rules. |
| **`MOD-05`** | [`/docs/standards/05-sources-attribution-and-eeat.md`](./05-sources-attribution-and-eeat.md) | **Multi-Source Threat Intelligence Attribution & E-E-A-T Triangulation** | Whenever citing advisories (`>= 3 sources`), CVEs (`CVSS v3.1`), threat actors, or `multiSourceSynthesis`. |
| **`MOD-06`** | [`/docs/standards/06-seo-geo-and-url-deeplinking.md`](./06-seo-geo-and-url-deeplinking.md) | **SEO, GEO, Schema.org (`TechArticle`/`HowTo`/`BreadcrumbList`) & URL Deep-Linking** | Whenever publishing a scenario route (`/scenarios/[id]`), updating `llms-full.txt`, or wiring shareable URL anchors (`#step-N`, `#clause-X.Y`). |
| **`MOD-07`** | [`/docs/standards/07-ui-copy-and-ci-validation.md`](./07-ui-copy-and-ci-validation.md) | **UI Copy Discipline, Zero-Truncation Law & Automated CI Guardrails** | Whenever adding UI labels/tooltips or running pre-commit verification tests (`lib/*.test.ts`). |

---

## 3. Task-to-Module Routing Matrix (Which Modules to Use for Each Task)

Before writing or editing any content, identify your task type in the table below and apply the required module chain in order:

| Task Type | Required Modules (Execute in Order) | Primary Target Files |
| :--- | :--- | :--- |
| **1. Adding a New Cyber Attack / DFIR Scenario** | `MOD-01` → `MOD-02` → `MOD-03` → `MOD-04` → `MOD-05` → `MOD-06` → `MOD-07` | `/lib/scenarios/*.ts`, `/lib/attack-scenarios.ts`, `/lib/attack-sources-and-legal.ts`, `/lib/threat-intel-service.ts`, `/public/llms-full.txt` |
| **2. Writing or Revising a Step-by-Step Operational Guide** | `MOD-01` → `MOD-02` → `MOD-03` → `MOD-04` → `MOD-06` → `MOD-07` | `/lib/step-guides/*.ts`, `/lib/scenario-step-guides.ts`, `/components/StepByStepGuidePanel.tsx` |
| **3. Writing a New Engineering / Architecture Markdown Document** | `MOD-01` → `MOD-02` → `MOD-03` → `MOD-07` | `/docs/**/*.md`, `/seo-audit/**/*.md` |
| **4. Adding Raw SIEM Logs, Memory Maps, or CLI Explanations** | `MOD-03` → `MOD-04` → `MOD-05` → `MOD-07` | `/lib/command-line-explanations.ts`, `/lib/scenarios/*.ts` |
| **5. Updating Workbench UI Components, Badges, or Tooltips** | `MOD-02` → `MOD-06` → `MOD-07` | `/components/**/*.tsx`, `/lib/ui-text-standards.ts`, `/lib/diagram-memory-store.ts` |

---

## 4. Relationship to Specialized Reference Documents in `/docs/`

The modular standards in `/docs/standards/` unify and govern the existing deep-dive reference documents in `/docs/`:

- [`/docs/story-to-spec-explanation-standard.md`](../story-to-spec-explanation-standard.md) — Deep-dive examples for **`MOD-02`** (3-Layer Story-to-Spec Pedagogy & Inspector Scope).
- [`/docs/inline-purpose-parenthetical-standard.md`](../inline-purpose-parenthetical-standard.md) — Deep-dive examples for **`MOD-03`** (`Action + Inline Why` parenthetical engineering).
- [`/docs/analytical-sources-and-references.md`](../analytical-sources-and-references.md) — Complete portal directory for **`MOD-05`** (Multi-Source Threat Intelligence synthesis).
- [`/docs/scenario-ingestion-and-seo-standard.md`](../scenario-ingestion-and-seo-standard.md) — Operational workflow for **`MOD-06`** (Atomic Scenario + SEO/GEO ingestion).
- [`/docs/ui-canvas-engineering-standards.md`](../ui-canvas-engineering-standards.md) — Visual canvas rules for **`MOD-07`** (Zero-Truncation & unbounded 4-directional coordinate space).

---

## 5. Programmatic Enforcement (`/lib/documentation-standards.ts`)

Every rule in `MOD-01` through `MOD-07` is backed by programmatic contracts in [`/lib/documentation-standards.ts`](../../lib/documentation-standards.ts) and verified automatically by [`/lib/documentation-standards.test.ts`](../../lib/documentation-standards.test.ts). Run:

```bash
npx --yes tsx --test --test-reporter=spec lib/*.test.ts
```
