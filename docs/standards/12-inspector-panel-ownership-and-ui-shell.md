# Module 12 — Inspector Panel Ownership, Tab Shell & Chrome Standard (`MOD-12`)

> **Module ID**: `MOD-12`  
> **Scope**: Forensic Inspector full-page shell (`/components/inspector/**`, `/components/InspectorPanel.tsx`, `/components/step-guide/**`, `/components/StepByStepGuidePanel.tsx`, `/components/inspector-minimap/**`, `/components/InspectorContextMiniMap.tsx`), sidebar tab ownership, Stage Filter placement, single-card merge chrome, Steps chrome, and modular code layout.  
> **Status**: Mandatory Permanent Standard · Cross-links `MOD-07`, `MOD-08`, `MOD-11` · Enforced by `/lib/inspector-scope.test.ts`, `/lib/read-inspector-sources.ts`, `/lib/read-step-guide-sources.ts`, and `/lib/read-inspector-minimap-sources.ts`.  
> **Parent Index**: [`/docs/standards/README.md`](./README.md)

---

## 1. Purpose & Core Philosophy

The Inspector is the primary reading surface for every scenario. Without a hard ownership map, Overview becomes a dump of Steps + Memory + process trees, sidebar chrome accumulates clutter (counts, Auto-Play, legend cards), and unique forensic blocks get deleted instead of migrated.

`MOD-12` freezes the **Inspector information architecture** so every scenario and every future UI change follows one shell:

1. **One job per tab** — no cross-tab dumps.
2. **Overview = Story + roadmap altitude** — never a deep-dive replay; never dump Story again on Steps `#0`.
3. **Migrate before delete** — inventory → migrate → rewrite (`MOD-11` §7).
4. **Quiet chrome** — labels without counts; Steps without Auto-Play / reading-legend cards.
5. **One card per concern** — never stack a title strip, Stage Filter strip, and body as three redundant white cards for the same view.
6. **Modular code** — Inspector / step-guide / inspector-minimap packages; public entries re-export only.
7. **Story → film → Technical** — shared section order (`MOD-08`); Steps `#0` uses `omitStory`.

---

## 2. Canonical Inspector Tab Map (Ownership Law)

| Sidebar Tab | Owns | Must Never Host |
| :--- | :--- | :--- |
| **Overview** | Story Analogy + Technical roadmap (`MOD-11` Formula A2); optional topology directory; compact Steps roadmap (titles + MITRE only); pointers into other tabs | Stage Filter; stage-titled page headers (`Stage 1: …`); Cascading Process Execution Hierarchy; VAD State Mutation; Memory callouts / WHY grids; full per-stage deep-dives; command breakdowns; Auto-Play; duplicate title card above Story |
| **Step-by-Step Guide** / **Steps & Sequence** | Per-stage narrative deep-dives (story, technical bridge, commands, detection); Scenario Briefing `#0` = technical deep-dive + diagram map (**no** repeated Overview Story Analogy); Visual State Machine for the active step; **merged** stage jump chrome | Overview Story Analogy / Story-to-Technical Key on `#0`; Full Parent → Child cascade waterfall; VAD mutation grids; reading-legend cards; Auto-Play; standalone Stage Filter card above Steps |
| **Process Hierarchy** | Cascading Process Execution Hierarchy (Parent → Child Waterfall) when `processTree` / cascade data exists; **merged** title + stage pills + embedded tree | VAD State Mutation; Overview roadmap prose; Step narrative deep-dives; nested MiniMap title card; per-process nested white sub-cards |
| **Memory** | Virtual Address Space (VAD) State Mutation; documented `memoryBlocks` / PE-sieve style forensics (`ProcessMemoryView`) | Cascading Process waterfall; Overview dumps |
| **SIEM Logs** | Scoped SIEM / EDR / Sysmon evidence (`LogInspector`) | Process tree or Memory VAD blocks |
| **Sources & Intel** | Threat intel card + citations / legal compliance pointer | Attack mechanics deep-dives |

### Ownership Rules (Normative)

1. If a **Cascading Process Execution Hierarchy** exists for the scenario, it **must** render on **Process Hierarchy** — never on Overview or as an embedded full waterfall inside Steps. Steps may show a short handoff CTA (`Open Process Hierarchy`).
2. If **VAD / memoryBlocks** exist, they **must** render on **Memory** — never on Overview.
3. Selecting the Overview tab resets Stage Filter to **All Stages** (`stageIndex = 0`) and shows the scenario name — not `Stage N: …`.
4. Content migration never deletes unique facts first — follow `MOD-11` §7 (Inventory → Migrate → Rewrite → Verify).

---

## 3. Single-Card Merge Law (Normative)

**Rule**: For any Inspector view, chrome that only exists to introduce or navigate that same view must live **inside** the view’s primary card. Do not render a separate white card above another white card when both describe the same concern.

### 3.1 Overview — Title + Story (Main Scenario)

| Rejected | Required |
| :--- | :--- |
| Card A: scope badge + `All N Stages` + scenario title | **One** card (`inspector-overview-title-card`) containing badge + title **and** Story/Technical (`StandardStoryTechnicalSection`) |
| Card B below it: “Main Page · Scenario Overview” + same scenario title + Story | No second title; no repeated scenario name |

- Scoped node / sub-board Overview may keep a slim title card above section-specific content.
- Page title on main Overview = **scenario name**.

**Code**: `/components/inspector/tabs/OverviewTab.tsx`

### 3.2 Steps — Stage Filter + Steps Header

| Rejected | Required |
| :--- | :--- |
| Global `InspectorStageFilter` card above Steps | Hidden when `resolvedActiveTab === 'STEP_GUIDE'` |
| Separate gray/white nav card with `#0 Briefing` / `#N` pills | **One** shell (`inspector-steps-merged-shell`) with header (`step-guide-nav-bar`) holding title + `All Stages` + `S{N} · MITRE` pills + step body below |

- Pill label is **`All Stages`** (not `All Stages (Overview)` / not `#0 Briefing` as the primary All-Stages control).
- No Auto-Play; no three-column reading legend.

**Code**: `/components/inspector/tabs/StepsTab.tsx`, `/components/step-guide/**`, `/components/StepByStepGuidePanel.tsx`, `/components/inspector/InspectorPanel.tsx`

### 3.3 Steps — Scenario Briefing `#0` (No Overview Story Repeat)

| Rejected | Required |
| :--- | :--- |
| Steps `#0` re-renders Overview Real-World Story Analogy + Story-to-Technical Key | `StandardStoryTechnicalSection` with **`omitStory`** |
| Steps `#0` shows only the same short Overview roadmap clauses | Expanded technical briefing: `plainSummary` + `diagramTopologySummary` + step examination map; optional briefing 3D above technical clauses |
| Story Analogy heading `"1. Real-World Story Analogy:"` on `#0` | Heading `"1. Scenario Briefing · Technical Deep-Dive:"` (or equivalent technical-only label) |

- Overview remains the sole home for whole-scenario Story Analogy (`MOD-08` §4.3 / `MOD-11` §4).
- Per-stage cards `#1..#N` still keep stage-specific Story continuations.

**Code**: `/components/step-guide/MainScenarioStepGuideView.tsx`, `/components/StandardStoryTechnicalSection.tsx` (`omitStory`)

### 3.4 Process Hierarchy — Title + Stage Filter + Tree

| Rejected | Required |
| :--- | :--- |
| Global Stage Filter card above Process Hierarchy | Hidden when `resolvedActiveTab === 'PROCESS_HIERARCHY'` |
| Intro card (“Process Execution Hierarchy”) + separate MiniMap cascade card with a second title | **One** shell (`inspector-process-hierarchy-panel`) with header (title + stage pills) + embedded tree |
| Each PPID/PID node as its own nested white bordered card | Embedded list rows with dividers (`cascadingProcessEmbedded: true`); keep indent + “SPAWNED CHILD OF …” connectors |

**Code**: `/components/inspector/tabs/ProcessHierarchyTab.tsx`, `/components/inspector-minimap/**` (`includeSections.cascadingProcessEmbedded`)

### 3.5 Where Standalone Stage Filter Remains

Global `InspectorStageFilter` **may** render as its own strip only on:

- **Memory**
- **SIEM Logs**
- **Sources & Intel**

Those tabs do not own a competing stage-jump header.

---

## 4. Stage Filter Contract

- **Hidden on** `OVERVIEW`, `STEP_GUIDE`, `PROCESS_HIERARCHY` (merged into those tabs’ shells).
- **Visible as standalone strip on** Memory, SIEM Logs, Sources.
- Pill copy: **`All Stages`** + `S{N} · {mitreTechniqueId}`.
- On Process Hierarchy / Steps, stage pills highlight active stage context; they do not replace Steps narrative deep-dives.

---

## 5. Sidebar Label & Chrome Laws

### Law A — No Count Suffixes on Tab Labels

Sidebar labels are bare names. **Forbidden**: `Step-by-Step Guide (5)`, `Memory (3)`, `SIEM Logs (5)`.

| Allowed | Forbidden |
| :--- | :--- |
| Overview | Overview (N) |
| Step-by-Step Guide / Steps & Sequence | … Guide (N) |
| Process Hierarchy | Process Hierarchy (N) |
| Memory | Memory (N) |
| SIEM Logs | SIEM Logs (N) |
| Sources & Intel | Sources & Intel (N) |

Counts may still appear **inside** tab bodies (e.g. roadmap “5 Steps”, hierarchy stage meta) — never on the left-nav tab label.

### Law B — Steps Chrome

Inside the merged Steps shell:

- Keep: title badge (`STEP-BY-STEP GUIDE` / `STEPS & SEQUENCE`), stage counter, merged Stage Filter pills.
- Remove permanently: standalone Stage Filter above Steps; reading-legend trio; Auto-Play / `AUTO-PLAY LIVE SYNC`.
- Diagram / 3D surfaces may still offer playback; Steps Inspector must not.

### Law C — Overview Title

Main-scenario Overview = single merged title+Story card. No duplicate “Main Page · Scenario Overview” header that repeats the scenario name.

### Law D — Process Hierarchy Chrome

One shell only. Use `cascadingProcessEmbedded: true` so MiniMap does not wrap the tree in a second titled card. Process nodes are list rows, not stacked mini-cards.

---

## 6. Modular Code Layout (Inspector Package)

Implementation **must** live under `/components/inspector/`. Public imports continue through `/components/InspectorPanel.tsx` (thin re-export).

```
components/InspectorPanel.tsx          ← public barrel (re-export only)
components/inspector/
  index.ts
  types.ts
  useInspectorPanelModel.tsx           ← tab resolution, scope, bare sidebar labels
  InspectorPanel.tsx                   ← shell; Stage Filter gated off Overview/Steps/Hierarchy
  FloatingHoverInspectorTrigger.tsx
  InspectorSidebar.tsx
  InspectorStageFilter.tsx             ← standalone strip for Memory/Logs/Sources only
  InspectorSectionIdentityCard.tsx
  tabs/
    OverviewTab.tsx                    ← merged title + Story (main scenario)
    StepsTab.tsx                       ← inspector-steps-merged-shell
    ProcessHierarchyTab.tsx            ← single hierarchy shell + embedded cascade
    MemoryTab.tsx
    SiemLogsTab.tsx
    SourcesTab.tsx
components/StepByStepGuidePanel.tsx    ← public barrel (re-export only)
components/step-guide/
  index.ts
  types.ts
  StepByStepGuidePanel.tsx             ← shell: models, scroll-sync, route expanded vs main
  ExpandedStepGuideView.tsx            ← internal sub-board / sub-node steps
  MainScenarioStepGuideView.tsx        ← merged stage jump header + briefing/steps/outro
  StructuredClausesList.tsx
components/InspectorContextMiniMap.tsx ← public barrel (re-export only)
components/inspector-minimap/
  index.ts
  types.ts
  styles.ts
  InspectorContextMiniMap.tsx          ← shell: section flags, blueprint, cascade-only embed
  CascadingProcessWaterfall.tsx        ← PPID→PID rows (embedded + card)
  CascadingProcessCard.tsx
  MiniMapHeaderBar.tsx
  StructuralBlueprintSection.tsx
  StateTransformationCard.tsx          ← VAD / state mutation (Memory-owned)
  TopologyLinksSection.tsx
```

Rules:

1. Do not re-monolith Overview + all tabs into a single 1500-line file.
2. Source-structure tests must read the inspector package via `readInspectorSources()` / `readFloatingHoverInspectorSource()` in `/lib/read-inspector-sources.ts`, the step-guide package via `readStepGuideSources()` in `/lib/read-step-guide-sources.ts`, and the MiniMap package via `readInspectorMiniMapSources()` in `/lib/read-inspector-minimap-sources.ts`.
3. New Inspector UI features land in the matching module, then wire through the shell.
4. Before adding a new white card above an existing tab body, check §3 — merge first.
5. Do not re-monolith Step Guide into a single 1500-line file; keep expanded vs main views separate.
6. Do not re-monolith MiniMap into a single 900-line file; keep cascade / VAD / topology sections separate.

---

## 7. Anti-Patterns vs Canonical Patterns

| Anti-Pattern (Rejected) | Canonical (Required) |
| :--- | :--- |
| Cascading Process + VAD grids on Overview | Process Hierarchy owns cascade; Memory owns VAD |
| Stage Filter + `Stage 1: …` title on Overview | Overview = scenario name; Stage Filter off |
| Overview title card + second Story card with same title | One merged Overview card |
| Stage Filter card + Steps pill bar (duplicate navigation) | One Steps shell with merged pills |
| Hierarchy intro card + MiniMap cascade card + nested process cards | One Hierarchy shell; embedded rows |
| Sidebar `Memory (3)` / `SIEM Logs (5)` | Sidebar `Memory` / `SIEM Logs` |
| Steps Auto-Play + three legend cards | Steps = jump pills + stage deep-dives only |
| Steps `#0` repeats Overview Story Analogy | Steps `#0` = `omitStory` + technical deep-dive |
| Technical Overview clauses above the 3D film | Story → film → Technical (`MOD-08`) |
| Deleting Overview cascade “to clean UI” without a home | Migrate to Process Hierarchy first |
| Embedding full PPID waterfall inside every Step card | Steps CTA → Process Hierarchy |

---

## 8. Verification Checklist (`MOD-12`)

- [ ] Overview has no Stage Filter, no Cascading Process, no VAD, no Memory callout, **no duplicate title card**?
- [ ] Steps is one shell (`inspector-steps-merged-shell`) with merged stage pills — **no** global Stage Filter above it?
- [ ] Steps `#0` uses `omitStory` (no Overview Story repeat) and expands technical Scenario Briefing detail?
- [ ] Overview / shared sections keep Story → 3D film → Technical order (`MOD-08`)?
- [ ] Process Hierarchy is one shell with title + stage pills + embedded tree (`cascadingProcessEmbedded`) — **no** global Stage Filter above it, **no** nested MiniMap title card?
- [ ] Process Hierarchy tab exists whenever cascade/`processTree` content is shown; Steps only links to it?
- [ ] Memory tab owns VAD / `memoryBlocks` forensics?
- [ ] Sidebar tab labels have **no** `(N)` count suffixes?
- [ ] Steps chrome has **no** Auto-Play and **no** three-column reading legend?
- [ ] Code changes land under `/components/inspector/**` (plus shared MiniMap/Steps panel) with public re-export preserved?
- [ ] `lib/inspector-scope.test.ts` ownership + merge assertions still pass?

```bash
npx --yes tsx --test --test-reporter=spec lib/inspector-scope.test.ts lib/documentation-standards.test.ts
```

---

## 9. Task Routing (When to Load `MOD-12`)

Load **`MOD-12`** whenever you:

- Add or rename an Inspector sidebar tab
- Move forensic UI blocks between Overview / Steps / Process Hierarchy / Memory
- Change Stage Filter visibility or merge chrome into a tab shell
- Edit Steps top chrome (`StepByStepGuidePanel`) or Hierarchy embedded cascade
- Refactor `/components/inspector/**` or `/components/InspectorPanel.tsx`
- Roll Overview-cleanup from a pilot scenario to a category (always after `MOD-11` §7)
