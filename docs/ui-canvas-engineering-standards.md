# Mandatory UI & Canvas Engineering Standards (Permanent Design Laws)

To prevent visual regressions, clipped text (`...`), or overlapping HUD controls, all components in **Attack Explorer** must strictly follow the rules codified in [`lib/ui-text-standards.ts`](../lib/ui-text-standards.ts) and verified by automated unit tests in [`lib/simulation-engine.test.ts`](../lib/simulation-engine.test.ts):

## 1. Zero-Truncation Rule (No `...` Ellipsis Anywhere in Active UI)

- **Forbidden**: Never rely on CSS `truncate` (`text-overflow: ellipsis`) or `...` string slicing on stage pills, sidebar scenario cards, category filter tabs, diagram node cards, internal sub-board link pills, or inspector cards.
- **Required Pattern (Concise Label + Full Hover Tooltip)**:
  1. **Keep Primary Surface Labels Concise**: Display a short, self-contained technical label on the button, badge, or card (e.g., `S1: Locate AmsiScanBuffer · T1562.001` via `formatConciseStagePillLabel`, or `#1.1 (1.1.1→ · ⇠1.1.2)` via `formatConciseInternalFlowPill`).
  2. **Move Extended Metadata to Hover Tooltips**: Place full descriptions, long action titles, host context strings, and activity summaries inside `WorkbenchIconTooltip` or `NodeHoverTooltip` so hovering reveals 100% of the forensic context without cluttering or clipping the card.
  3. **Multi-Line Wrapping for Narrative Content**: In sidebars, inspector panels, and tables, use `leading-snug break-words` so multi-word titles wrap cleanly across lines instead of cutting off with `...`.

## 2. Unbounded 4-Directional Canvas Coordinate Space

- The whiteboard SVG (`SketchWhiteboardSvg.tsx`) and transform wrapper (`CanvasController.tsx`) must always render with `overflow="visible"` (`!overflow-visible`) and an extended background grid (`x="-8000" y="-8000" width="17480" height="16650"`).
- Never clamp node or zone drag coordinates to `[0, 1480]` or `[0, 650]`, ensuring diagrams never clip along any of the 4 edges when zoomed out or panned.

## 3. Hide / Show Toggles for Maximum Diagram Space

- Every persistent bar around the diagram must provide both **Hide** and **Show** controls so analysts can dedicate 100% of the viewport to the attack graph:
  - **Top Stage Progress Bar**: `hide-step-progress-bar-btn` / `show-step-progress-bar-btn`
  - **Canvas Top Context & Tool Bar**: `hide-canvas-top-bar-btn` / `show-canvas-top-bar-btn`
  - **Bottom-Right Playback Control Bar**: `hide-playback-bar-btn` / `show-playback-bar-btn`
  - **Bottom Internal Sub-Node Details Bar**: `hide-bottom-dock-btn` / `show-bottom-dock-btn`

## 4. Context-Aware Inspector Scope & Dynamic Scope Badge Standard

- The right `InspectorPanel` (`components/InspectorPanel.tsx`) must always reflect the current diagram scope (`lib/inspector-scope.ts`) across all tabs (`Overview`, `Steps`, `SIEM Logs`, `Sources`):
  1. **`MAIN_SCENARIO`**: Active on the main 6-node network topology (or when `Scenario View` override is toggled). Displays an **Emerald** Scope Badge (`"Scenario"`, `data-scope-mode="MAIN_SCENARIO"`).
  2. **`EXPANDED_NODE`**: Active when a parent node (`①..⑥`) is expanded into its internal sub-board (`buildInternalNodeSubBoard`). Displays an **Amber** Scope Badge (`"Expanded: Node #N · Label"`, `data-scope-mode="EXPANDED_NODE"`).
  3. **`INTERNAL_SUBNODE`**: Active when a specific internal sub-node (`#N.1..#N.5`) is selected inside an expanded sub-board. Displays a **Rose/Crimson** Scope Badge (`"Internal: #N.M · SubNode Label"`, `data-scope-mode="INTERNAL_SUBNODE"`).

## 5. 3-Layer "Story-to-Spec" Explanation Standard

- All 26+ attack scenarios (`lib/step-guides/*`, `lib/scenario-step-guides.ts`) and expanded internal sub-boards (`lib/inspector-scope.ts`) must follow the **3-Layer Story-to-Spec Method** documented in detail in [`docs/story-to-spec-explanation-standard.md`](./story-to-spec-explanation-standard.md):
  1. **Layer 1 — Real-World Story Analogy (`storyAnalogy`)**: Intuitive everyday metaphor explaining *why* the trick works.
  2. **Layer 2 — Story ↔ Scenario Technical Bridge (`simpleExplanation` / `plainSummary`)**: Pairs the story directly with the exact `PID`, `API`, `IP:Port`, `CVE`, `MITRE ID`, and `Node ①..⑥` in the scenario.
  3. **Layer 3 — Under the Hood & SIEM Forensic Catch (`howItWorksInPractice` + `detectionAndEvidence`)**: Explains the deep OS/kernel/protocol mechanism and the exact SIEM/Sysmon/EDR evidence that detects it.

