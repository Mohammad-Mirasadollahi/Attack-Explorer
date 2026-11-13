# Attack Explorer

Interactive workbench for exploring cyber-attack scenarios: kill-chain visuals, Sysmon/SIEM-style telemetry, and MITRE ATT&CK mapping.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Optional in `.env.local`:

```env
GEMINI_API_KEY=your_key
APP_URL=http://localhost:3000
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production build |

## API

```http
GET /api/attacks?category=ALL&mitrePhase=ALL&severity=ALL&search=
```

---

## Mandatory UI & Canvas Engineering Standards (Permanent Design Laws)

To prevent visual regressions, clipped text (`...`), or overlapping HUD controls, all components in **Attack Explorer** must strictly follow the rules codified in [`lib/ui-text-standards.ts`](./lib/ui-text-standards.ts) and verified by automated unit tests in [`lib/simulation-engine.test.ts`](./lib/simulation-engine.test.ts):

### 1. Zero-Truncation Rule (No `...` Ellipsis Anywhere in Active UI)
- **Forbidden**: Never rely on CSS `truncate` (`text-overflow: ellipsis`) or `...` string slicing on stage pills, sidebar scenario cards, category filter tabs, diagram node cards, internal sub-board link pills, or inspector cards.
- **Required Pattern (Concise Label + Full Hover Tooltip)**:
  1. **Keep Primary Surface Labels Concise**: Display a short, self-contained technical label on the button, badge, or card (e.g., `S1: Locate AmsiScanBuffer · T1562.001` via `formatConciseStagePillLabel`, or `#1.1 (1.1.1→ · ⇠1.1.2)` via `formatConciseInternalFlowPill`).
  2. **Move Extended Metadata to Hover Tooltips**: Place full descriptions, long action titles, host context strings, and activity summaries inside `WorkbenchIconTooltip` or `NodeHoverTooltip` so hovering reveals 100% of the forensic context without cluttering or clipping the card.
  3. **Multi-Line Wrapping for Narrative Content**: In sidebars, inspector panels, and tables, use `leading-snug break-words` so multi-word titles wrap cleanly across lines instead of cutting off with `...`.

### 2. Unbounded 4-Directional Canvas Coordinate Space
- The whiteboard SVG (`SketchWhiteboardSvg.tsx`) and transform wrapper (`CanvasController.tsx`) must always render with `overflow="visible"` (`!overflow-visible`) and an extended background grid (`x="-8000" y="-8000" width="17480" height="16650"`).
- Never clamp node or zone drag coordinates to `[0, 1480]` or `[0, 650]`, ensuring diagrams never clip along any of the 4 edges when zoomed out or panned.

### 3. Hide / Show Toggles for Maximum Diagram Space
- Every persistent bar around the diagram must provide both **Hide** and **Show** controls so analysts can dedicate 100% of the viewport to the attack graph:
  - **Top Stage Progress Bar**: `hide-step-progress-bar-btn` / `show-step-progress-bar-btn`
  - **Canvas Top Context & Tool Bar**: `hide-canvas-top-bar-btn` / `show-canvas-top-bar-btn`
  - **Bottom-Right Interactive Minimap**: `hide-minimap-btn` / `show-minimap-btn` (or hotkey `M`)
  - **Bottom-Right Playback Control Bar**: `hide-playback-bar-btn` / `show-playback-bar-btn`
  - **Bottom Internal Sub-Node Details Bar**: `hide-bottom-dock-btn` / `show-bottom-dock-btn`

