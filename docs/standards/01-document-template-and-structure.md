# Module 01 — Canonical Document Templates, Structural Blueprints & Character Budgets (`MOD-01`)

> **Module ID**: `MOD-01`  
> **Scope**: Structural layout, mandatory sections, field ordering, and character-length budgets for (1) Engineering Markdown Documents, (2) Attack Scenario Definitions, and (3) Step-by-Step Operational Guides.  
> **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Enforced By**: `/lib/documentation-standards.ts`

---

## 1. Purpose of Structural Standardization

Every document and scenario in **Attack Explorer** must be immediately recognizable, machine-parseable, and scannable by both human SOC analysts and AI/search crawlers. Authors must never invent ad-hoc section orders or omit required metadata blocks.

This module defines the **three canonical templates** used across the codebase:
1. **Template A**: Markdown Engineering & Architecture Standard Document (`/docs/**/*.md`)
2. **Template B**: Attack Scenario Data Module (`/modules/scenarios/*.ts`)
3. **Template C**: Step-by-Step Operational Guide Module (`/lib/step-guides/*.ts`)

---

## 2. Template A — Markdown Engineering & Standard Document Skeleton

Every Markdown document added to `/docs/**` or `/seo-audit/**` **must** follow this exact 6-part structural skeleton:

```markdown
# <Document Title — Clear, Specific Noun Phrase> (`<Optional Module/Doc ID>`)

> **Module / Document ID**: `<ID>`  
> **Scope**: <Exact files, directories, and components governed by this document>  
> **Parent Index / Related Standards**: <Links to related modules> · **Enforced By**: `<Test or Lib File>`

---

## 1. Purpose & Core Philosophy
<1–3 paragraphs explaining WHY this standard or architecture exists and what failure modes it prevents.>

```
<ASCII / Box Architecture Diagram illustrating the mental model or data flow>
```

---

## 2. Structural Anatomy & Mandatory Rules
<Numbered rules (Rule 1..N) or specification tables defining exact thresholds, patterns, and invariants.>

---

## 3. Concrete Before & After Examples (❌ Anti-Pattern vs. ✅ Canonical Pattern)
<At least one explicit side-by-side comparison showing an invalid/weak example and a compliant example.>

---

## 4. TypeScript Contracts / Code Blueprints
<Exact TypeScript interfaces, helper functions, or CLI snippets implementing the standard.>

---

## 5. Verification Checklist & Automated Test Command
- [ ] Check 1: ...
- [ ] Check 2: ...
```

### Mandatory Formatting Rules for Markdown Documents
1. **Single H1 (`#`)**: Exactly one `#` heading at line 1 of the file.
2. **Metadata Callout Block (`>`)**: Immediately below `#`, include a blockquote summarizing `Scope` and `Enforced By`.
3. **Horizontal Section Dividers (`---`)**: Place `---` between major `## N.` numbered top-level sections.
4. **Numbered H2 Headings (`## 1.`, `## 2.`, ...)**: All top-level sections must be sequentially numbered (`1..N`) for unambiguous cross-referencing.
5. **Visual ASCII Diagrams & Markdown Tables**: Complex relationships must be summarized using either a clean box-drawing diagram (`┌─┐│└─┘`) or a structured Markdown table (`| Column | ... |`).

---

## 3. Template B — Attack Scenario Definition Blueprint (`/modules/scenarios/*.ts`)

Every scenario object (`AttackScenario` / `LegacyDraftScenario`) must declare its properties in the exact order below and satisfy the **Character & Cardinality Budgets**:

| Order | Field Name | Type | Cardinality / Length Budget | Structural Requirement |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `id` | `string` | `15–75 chars` (`^[a-z0-9-]+$`) | Lowercase `kebab-case` URL slug combining `<actor-or-vendor>-<cve-or-tool>-<technique-vector>`. |
| **2** | `code` | `string` | `5–12 chars` | Unique prefix + number (`SC-xxx`, `RW-xxx`, `SUP-xxx`, `CLR-xxx`, `APT-xxx`, `DFIR-xxx`). |
| **3** | `name` | `string` | **`35–85 chars`** (Ideal SERP: `35–65`) | Front-loads Primary Entity (Actor/Product/CVE) + Attack Vector. Never starts with generic words like `"A scenario about..."`. |
| **4** | `category` | `AttackCategory` | Exact Enum | One of the official categories in `modules/scenarios/types.ts` (e.g., `'RANSOMWARE'`, `'SUPPLY_CHAIN'`, `'MALWARE'`). |
| **5** | `severity` | `'CRITICAL' \| 'HIGH' \| 'MEDIUM'` | Exact Enum | Must reflect real CVSS / operational impact. |
| **6** | `mitreTactics` | `string[]` | `2–5 tactics` | Canonical MITRE Enterprise tactics (`'Initial Access'`, `'Execution'`, `'Defense Evasion'`, `'Impact'`, etc.). |
| **7** | `shortSubtitle` | `string` | **`80–160 chars`** (Ideal SERP: `85–140`) | Single-sentence summary of the 3-stage progression (`Vector -> Mechanism -> Impact/Detection`). |
| **8** | `overview` | `string` | **`220–850 chars`** (`2–4 sentences`; hard max ~950) | **Answer-First Overview Roadmap** (aligned with `briefing.plainSummary` / `MOD-11` Formula A2): Sentence 1 states Actor + Advisory/CVE + Core Technique + host + why the disguise works; Sentence 2 gives a readable one-breath attack arc **without** replaying every Step API; Sentence 3 maps what later Steps/Memory examine and names the primary SIEM/EDR pivot. Memory forensics (VAD/`SEC_IMAGE`/`MEM_PRIVATE`) must not live here. |
| **9** | `nodes` | `ScenarioNode[]` | `5–6 nodes` | Ordered from external/initial vector (`①`) to target host/process (`③/④`), core asset (`⑤`), and SOC SIEM/EDR sensor (`⑥`). |
| **10** | `stages` | `ScenarioStage[]` | **`>= 3 stages`** (`1..N`) | Sequential `index: 1..N`, valid `mitreTechniqueId` (`^T\d{4}(\.\d{3})?$`), `title`, rich `description` (`>= 140 chars`), `>= 2` `keySpecs`, and `activeFlows`. |
| **11** | `telemetry` | `TelemetryEvent[]` | **`>= 3 events`** (1+ per stage) | Realistic raw log payload (`rawLog`), `eventId`, `source`, `mitreId`, and `keyFields`. |
| **12** | `detectionRule` | `DetectionRule` | `1 object` | Valid `format` (`'SIGMA' \| 'YARA' \| 'SURICATA' \| 'SPL' \| 'KQL'`), `title`, multi-line `rule`, and actionable `mitigation`. |

---

## 4. Template C — Step-by-Step Operational Guide Blueprint (`/lib/step-guides/*.ts`)

Every step-guide object (`ScenarioStepGuide` / `RawScenarioStepGuideData`) must include both a **Scenario Briefing (`Step #0`)** and **Per-Stage Guides (`Step #1..#N`)** with numbered clauses (`#1.1`, `#1.2`, `#2.1`):

| Section | Field Name | Minimum Length | Required Content Structure |
| :--- | :--- | :--- | :--- |
| **`briefing` (`#step-0`)** | `headline` | `>= 25 chars` | Action-oriented briefing title naming the core technique and target. |
| **`briefing` (`#step-0`)** | `storyAnalogy` | **`>= 100 chars`** | **Layer 1**: Cohesive real-world metaphor introducing the entire attack chain. |
| **`briefing` (`#step-0`)** | `plainSummary` | **`280–520 chars`** (min `>= 120`) | **Layer 2 Overview Roadmap**: WHO/WHERE/MITRE + one-breath arc + what Steps `#1..#N` (and Memory if present) will examine + one detection pivot. Not a Step-by-Step API deep-dive. UI: Overview shows Story + this roadmap; Steps `#0` omits Story and expands technical briefing (`MOD-08` / `MOD-12`). |
| **`briefing` (`#step-0`)** | `diagramTopologySummary` | **`>= 80 chars`** | **Layer 3**: Maps the narrative to Diagram Nodes `①..⑥` and flow numbers (`#1.1→` / `⇠#1.2`). |
| **`briefing` (`#step-0`)** | `documentedAdvisory` | **`>= 40 chars`** | Lists the 3+ authoritative vendor/CERT advisories grounding the scenario. |
| **`steps[i]` (`#step-N`)** | `plainTitle` | `>= 20 chars` | Combines human-readable action + exact technical artifact. |
| **`steps[i]` (`#step-N`)** | `storyAnalogy` | **`>= 60 chars`** | **Layer 1**: Step-specific continuation of the real-world story analogy. |
| **`steps[i]` (`#step-N`)** | `simpleExplanation` | **`>= 100 chars`** | **Layer 2**: Bridges the analogy to the exact syscall, flag, PID, or packet in Step `N`. |
| **`steps[i]` (`#step-N`)** | `howItWorksInPractice` | **`>= 100 chars`** | **Layer 3A**: Explains the OS kernel, protocol, or memory invariant abused in Step `N`. |
| **`steps[i]` (`#step-N`)** | `diagramAlignment` | **`>= 50 chars`** | **Layer 3B**: Cites exact forward (`#N.1→`) and return (`⇠#N.2`) arrows and Node `①..⑥`. |
| **`steps[i]` (`#step-N`)** | `detectionAndEvidence` | **`>= 60 chars`** | **Layer 3C**: Names the exact SIEM/Sysmon/EDR Event IDs and forensic query fields. |
| **`steps[i]` (`#clause-N.M`)** | `numberedClauses` | `>= 3 clauses / step` | Sequential `#N.1`, `#N.2`, `#N.3` clauses with `title`, `body`, `whyItMatters`, and DOM anchor `id="clause-N.M"`. |

---

## 5. Verification Checklist (`MOD-01`)

- [ ] Does every Markdown file in `/docs/standards/` begin with a single `# Title (MOD-XX)` and metadata blockquote?
- [ ] Does every scenario `id` use lowercase `kebab-case` (`^[a-z0-9-]+$`) between 15 and 75 characters?
- [ ] Are `name`, `shortSubtitle`, `overview`, and `stages[].description` within their required character budgets?
- [ ] Does every step guide contain `briefing` (`#step-0`), `steps` (`#step-1..#step-N`), and `numberedClauses` (`#clause-N.1..#clause-N.M`)?
