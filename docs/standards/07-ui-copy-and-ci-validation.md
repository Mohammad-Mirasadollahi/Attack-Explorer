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

---

## 3. Master Pre-Commit Verification & Automated CI Test Suite

No new document, scenario, or UI change may be merged until all **6 automated test suites** pass with zero failures:

```bash
npx --yes tsx --test --test-reporter=spec lib/*.test.ts
```

### What the Automated Test Suite Verifies Across Modules `MOD-01` .. `MOD-11`

| Test Suite File | Governed Modules | Key Automated Assertions |
| :--- | :--- | :--- |
| **`lib/documentation-standards.test.ts`** | `MOD-00` .. `MOD-11` | Verifies that all 12 modular standard documents exist in `/docs/standards/`, adhere to `MOD-01`/`MOD-02`, validates all 188 scenarios via `validateScenarioAgainstModularStandards()`, and enforces **Prop-Purpose Clarity** (`validateStoryPropClarity`) and **Per-Token Inline Plain-English Why** (`validateTechnicalSectionInlineClarity`) across every upgraded section. |
| **`lib/section-3d-registry.test.ts`** | `MOD-08`, `MOD-09`, `MOD-10`, `MOD-11` | Verifies bespoke 3D descriptors, 100% jargon-free Story strings (`findTechnicalJargonInStory`), zero Japanese characters, separate mapping of paired props (e.g., Master Key #1 vs. Key #2), and per-token inline parenthetical density in deep-dive steps. |
| **`lib/scenario-step-guides.test.ts`** | `MOD-01`, `MOD-02`, `MOD-03`, `MOD-11` | Verifies 3-Layer Story-to-Spec completeness (`storyAnalogy`, `plainSummary`, `simpleExplanation`, `howItWorksInPractice`, `diagramAlignment`, `detectionAndEvidence`), substantive inline parentheticals, and 100% English-only strings across all 188 scenarios. |
| **`lib/command-line-explanations.test.ts`** | `MOD-03` | Verifies token-by-token CLI command explanations and flag coverage. |
| **`lib/simulation-engine.test.ts`** | `MOD-04`, `MOD-07` | Verifies scenario topology integrity, stage counts, telemetry correlation, and zero forbidden `truncate` classes in guarded UI components. |
| **`lib/inspector-scope.test.ts`** | `MOD-06`, `MOD-07`, `MOD-08` | Verifies `MAIN_SCENARIO` / `EXPANDED_NODE` / `INTERNAL_SUBNODE` scope resolution, zero duplicate Story vs. Technical overview text, and URL state round-tripping (`serializeWorkbenchUrlState` ↔ `parseWorkbenchUrlState`). |
| **`lib/seo-metadata.test.ts`** | `MOD-05`, `MOD-06` | Verifies XML sitemap coverage, Schema.org `TechArticle` (`citation >= 3`, `mentions`, `keywords`) + `HowTo` + `BreadcrumbList`, Topic Cluster lateral links, `Accept: text/markdown` output, and `/public/llms-full.txt` parity across all scenarios. |

---

## 4. Verification Checklist (`MOD-07`)

- [ ] Are guarded UI components free of CSS `truncate` classes?
- [ ] Do `validateStoryPropClarity()` and `validateTechnicalSectionInlineClarity()` pass on every newly authored or upgraded section (`briefing`, `steps[1..N]`, `stages[1..N]`, and `sequence`)?
- [ ] Do all test suites in `npx --yes tsx --test --test-reporter=spec lib/*.test.ts` pass with 0 failures?
- [ ] Do `npm run build` (`compile_applet`) and `eslint` (`lint_applet`) succeed with 0 errors?
