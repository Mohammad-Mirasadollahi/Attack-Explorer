# Module 07 — UI Copy Discipline, Zero-Truncation Law & Automated CI Guardrails (`MOD-07`)

> **Module ID**: `MOD-07`  
> **Scope**: Workbench UI typography, Zero-Truncation law, Concise Label + Hover Tooltip pattern, Context-Aware Inspector Scope Badges, and Automated CI/CD Test Verification (`lib/*.test.ts`).  
> **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Related Deep-Dive**: [`/docs/ui-canvas-engineering-standards.md`](../ui-canvas-engineering-standards.md) · **Enforced By**: `/lib/documentation-standards.test.ts` & `/lib/simulation-engine.test.ts`

---

## 1. Purpose & Core Philosophy

Even the best forensic documentation fails if the user interface clips critical identifiers with `...` ellipses or fails to indicate which architectural scope the analyst is currently inspecting. Furthermore, documentation standards inevitably drift unless **every rule in `MOD-01` through `MOD-07` is enforced by automated unit tests**.

---

## 2. Mandatory UI Copy & Typography Laws

### Law 1 — Zero-Truncation Rule (No `truncate` or `...` Ellipsis in Active UI)
- **Forbidden**: Never apply the Tailwind `truncate` class (`text-overflow: ellipsis`) or manual `slice(...) + '...'` truncation on stage pills, sidebar scenario cards, category filter tabs, diagram node cards, internal sub-board pills, or inspector narratives.
- **Required Pattern (Concise Surface Label + Full Hover Tooltip + Multi-Line Wrap)**:
  1. **Surface Badges & Pills**: Use deterministic concise formatters (`formatConciseStagePillLabel`, `formatConciseInternalFlowPill` in `/lib/ui-text-standards.ts`).
  2. **Hover Tooltips**: Attach `WorkbenchIconTooltip` or `NodeHoverTooltip` so hovering reveals 100% of the extended metadata.
  3. **Narrative Cards & Titles**: Use `leading-snug` / `leading-relaxed` and `break-words` so multi-word titles and technical strings wrap cleanly across lines.

### Law 2 — Context-Aware Inspector Scope Badges (`MAIN_SCENARIO`, `EXPANDED_NODE`, `INTERNAL_SUBNODE`)
The `InspectorPanel` header must always display the active scope badge (`resolveInspectorScopeContext` in `/lib/inspector-scope.ts`):
- **`MAIN_SCENARIO`**: Emerald badge (`"Scenario"`) — displays global scenario briefing, stages `#1..#N`, and global SIEM logs.
- **`EXPANDED_NODE`**: Amber badge (`"Expanded: Node #N · <Label>"`) — displays the expanded node's internal 5-node sub-board (`#N.1..#N.5`) and scoped logs.
- **`INTERNAL_SUBNODE`**: Rose/Crimson badge (`"Internal: #N.M · <SubNode Label>"`) — displays only the selected internal sub-node's activity summary, related sub-flows, and connected SIEM logs.

### Law 3 — Inspector Sidebar Labels Without Count Suffixes (`MOD-12`)
Left-nav tab labels must be bare names (`Overview`, `Step-by-Step Guide`, `Process Hierarchy`, `Memory`, `SIEM Logs`, `Sources & Intel`). Never append `(N)` stage/block/log counts to the tab label. See **`MOD-12`** for full Inspector ownership and Steps chrome rules (no Auto-Play, no legend cards, Stage Filter off Overview).

---

## 3. Master Pre-Commit Verification & Automated CI Test Suite

No new document, scenario, or UI change may be merged until all **6 automated test suites** pass with zero failures:

```bash
npx --yes tsx --test --test-reporter=spec lib/*.test.ts
```

### What the Automated Test Suite Verifies Across Modules `MOD-01` .. `MOD-17`

| Test Suite File | Governed Modules | Key Automated Assertions |
| :--- | :--- | :--- |
| **`lib/documentation-standards.test.ts`** | `MOD-00` .. `MOD-17` | Verifies that all modular standard documents exist in `/docs/standards/`, adhere to `MOD-01`/`MOD-02`, validates every live published scenario via `validateScenarioAgainstModularStandards()`, and enforces **Prop-Purpose Clarity** (`validateStoryPropClarity`) and **Per-Token Inline Plain-English Why** (`validateTechnicalSectionInlineClarity`) across every section. |
| **`lib/section-3d-registry.test.ts`** | `MOD-08`, `MOD-09`, `MOD-10`, `MOD-11`, `MOD-17` | Verifies `ANIME_3D_STAGE_STANDARD.sectionOrder` = Story -> 3D -> Technical, bespoke 3D descriptors, 100% jargon-free Story strings (`findTechnicalJargonInStory`), clean English copy, separate mapping of paired props, and per-token inline parenthetical density in deep-dive steps. |
| **`modules/scenarios/<id>/choreography.test.ts`** | `MOD-10`, `MOD-17` | Pure deterministic Node unit tests (`node:test`) verifying each bespoke scenario's `0% -> 100%` physical articulation timeline, state-transition monotonicity, and boundary clamping before browser rendering. |
| **`lib/scenario-step-guides.test.ts`** | `MOD-01`, `MOD-02`, `MOD-03`, `MOD-11` | Verifies 3-Layer Story-to-Spec completeness (`storyAnalogy`, `plainSummary`, `simpleExplanation`, `howItWorksInPractice`, `diagramAlignment`, `detectionAndEvidence`), substantive inline parentheticals, and 100% English-only strings across all live scenarios. |
| **`lib/command-line-explanations.test.ts`** | `MOD-03` | Verifies token-by-token CLI command explanations and flag coverage. |
| **`lib/simulation-engine.test.ts`** | `MOD-04`, `MOD-07` | Verifies scenario topology integrity, stage counts, telemetry correlation, and zero forbidden `truncate` classes in guarded UI components. |
| **`lib/inspector-scope.test.ts`** | `MOD-06`, `MOD-07`, `MOD-08`, `MOD-12` | Verifies Inspector scope resolution, Overview/Process Hierarchy/Memory ownership, Steps `#0` `omitStory` (no Overview Story repeat), Stage Filter gating, sidebar chrome, zero duplicate Story vs. Technical overview text, and URL state round-tripping. |
| **`lib/seo-metadata.test.ts`** | `MOD-05`, `MOD-06`, `MOD-17` | Verifies XML sitemap coverage for all live published scenarios, Schema.org `TechArticle` (`citation >= 3`, `mentions`, `keywords`) + `HowTo` + `BreadcrumbList`, Topic Cluster lateral links, `Accept: text/markdown` output, and `/public/llms-full.txt` parity. |
| **`lib/scenario-cinematic-uniqueness.test.ts`** *(Legacy — Retiring in Phase 1)* | Legacy `MOD-16` | Enforces legacy 28-place factory fingerprint uniqueness until the Phase 1 Clean-Slate Purge (`MOD-17 §2.2`), after which it is removed and superseded by per-scenario `choreography.test.ts` + Frame-by-Frame Browser Director's Review (`MOD-17 §4.5`). |

---

## 4. Verification Checklist (`MOD-07`)

- [ ] Are guarded UI components free of CSS `truncate` classes and mid-sentence signboard/label clipping?
- [ ] Do `validateStoryPropClarity()` and `validateTechnicalSectionInlineClarity()` pass on every newly authored or rebuilt section (`briefing`, `steps[1..N]`, `stages[1..N]`, and `sequence`)?
- [ ] Does the newly built scenario pass its own pure-logic `choreography.test.ts` AND the `1440x900` Frame-by-Frame Browser Director's Review (`MOD-17 §4.5`) with zero console/WebGL errors?
- [ ] Do all test suites in `npx --yes tsx --test --test-reporter=spec lib/*.test.ts` pass with 0 failures?
- [ ] Do `npm run build` (`compile_applet`) and `eslint` (`lint_applet`) succeed with 0 errors?
