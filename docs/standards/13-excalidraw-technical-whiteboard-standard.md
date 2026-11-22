# Excalidraw Technical Whiteboard Standard (`MOD-13`)

> **Module ID**: `MOD-13` · **Parent Index**: [`/docs/standards/README.md`](./README.md)  
> **Scope**: Every scenario technical teaching board under `/modules/scenarios/<id>/excalidraw/**`, the shared embed `/components/excalidraw/**`, and registry wiring in `/lib/section-excalidraw-registry.ts`.  
> **Status**: Mandatory Permanent Standard for any scenario that ships a technical whiteboard · **Reference implementation**: `/modules/scenarios/process-hollowing/excalidraw/` · **Enforced By**: (planned) board-descriptor contract tests; until then, PR review against this module + the Process Hollowing boards.

---

## 1. Purpose & Core Philosophy

Story motion lives in **Three.js** (`MOD-09` / `MOD-10`). Forensic teaching diagrams that must stay readable as a static “teacher whiteboard” live in **Excalidraw**.

Every technical whiteboard must:

1. Read as one clear chalk board (not a dashboard of cards).
2. Keep **arrow strokes fully visible** (labels never sit on the line).
3. Teach on hover with an **Excalidraw chalk-island software structure card** (same cream surface / ink strokes as the board) plus a plain-language **What this means** explanation.
4. Ship the same layout / tooltip / note rules in **every** section that has a board (briefing, each step, memory), not only in a few sample steps.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  STORY (amber) → THREE.JS FILM → TECHNICAL CLIP (MOD-14, if registered)    │
│                              ↓                                             │
│  TECHNICAL WHITEBOARD (MOD-13) · static Excalidraw chalk board             │
│    • Boxes + bare arrows + floating captions                               │
│    • Sticky NOTE callouts on-canvas                                        │
│    • Hover → chalk Excalidraw card (members / What this means)             │
│                              ↓                                             │
│  NUMBERED TECHNICAL CLAUSES (MOD-08)                                       │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. When a Scenario MUST Ship Boards

| Section key (`Section3DKey`) | Board required if… |
| :--- | :--- |
| `briefing` | Scenario has a Story→Technical Overview with a kill-chain overview. |
| `step-1` … `step-N` | That step has a `StandardStoryTechnicalSection` / step deep-dive. |
| `memory-forensics` | Scenario has a Memory tab / VAD comparison. |

**Rule:** If you add a whiteboard for one step, you must add boards for **all** registered story-technical sections of that scenario (same visual language). Partial coverage is non-compliant.

---

## 3. Package Layout (Mandatory Modularity)

Per scenario:

```
modules/scenarios/<scenario-id>/excalidraw/
  chalk.ts                 # shared colors / stroke / font constants
  types.ts                 # TechnicalBoardSkeleton, BoardTooltip, descriptor
  helpers.ts               # box, title, note, caption, sticky, arrow, hArrow, vArrow
  index.ts                 # re-export boards + types
  scenes/
    index.ts               # PROCESS_*_TECHNICAL_BOARDS map
    briefing.ts
    step-1.ts … step-N.ts
    memory.ts              # when Memory exists
```

**Forbidden:** a single monolithic `scenes.ts` that holds every board + helpers.

Wire the scenario map in `/lib/section-excalidraw-registry.ts`. Render only through `TechnicalWhiteboardEmbed` → `ExcalidrawBoard` (no one-off Excalidraw mounts).

---

## 4. Layout & Spacing Rules

| Rule | Requirement |
| :--- | :--- |
| **R1 · Arrow gap** | Minimum clear horizontal gap between adjacent boxes = `ARROW_GAP` (**150** scene units). Vertical stack gap between rows ≥ **60**. |
| **R2 · Bare arrows** | `arrow()` / `hArrow()` / `vArrow()` **never** put Excalidraw `label` text on the stroke. |
| **R3 · Floating captions** | API / edge names use `caption()` or the caption half of `hArrow` / `vArrow`, placed **above** (horizontal) or **beside** (vertical) the stroke. |
| **R4 · Box copy** | Box labels stay short (≤ 5 lines). Dense detail belongs in the hover card, not crushed inside the rectangle. |
| **R5 · Sticky NOTE** | Every board includes ≥ 1 on-canvas `sticky()` teaching callout (yellow chalk) with a scannable NOTE. |
| **R6 · Footer hint** | Every board ends with a muted `note()` reminding learners to hover for the software card. |
| **R7 · Fit, don’t pan** | Boards are static: `viewMode` + locked pointer pan/zoom on the canvas; hover uses a dedicated overlay layer only. |
| **R8 · Stroke visibility** | Arrow `strokeWidth` ≥ board stroke + 0.5. Never rely on text sitting on the line for “labels”. |

Use helpers from `helpers.ts` (`hArrow`, `vArrow`, `sticky`, `caption`). Do not hand-roll labeled arrows that regress R2/R3.

---

## 5. Hover Tooltip Contract (Excalidraw Chalk Island)

Every **rectangle** that teaches a concept (process, API, handle, memory region, detect box, sticky) **must** have a tooltip entry keyed by the **same element `id`**.

The hover card **must match the Excalidraw board look** — cream `#FDFBF7` island, slate ink border, chalk kind fills from `CHALK`, offset hard shadow (`3px 3px 0`), Virgil-compatible font. **Forbidden:** dark IDE / terminal overlays that break out of the whiteboard mode.

### 5.1 Type shape

```ts
interface BoardTooltipField {
  key: string;
  value: string;
  type?: string; // e.g. HANDLE, DWORD, PVOID
}

type BoardTooltipKind =
  | 'api' | 'process' | 'handle' | 'memory'
  | 'network' | 'detect' | 'kernel' | 'note';

interface BoardTooltip {
  kind: BoardTooltipKind;
  title: string;       // symbol / function / object name
  module?: string;     // Kernel32.dll · ntdll · SIEM …
  signature?: string;  // code-like one-liner or multi-line prototype
  fields: BoardTooltipField[];
  explain: string;     // REQUIRED plain-language “What this means”
  note?: string;       // optional short tip under explain
}
```

### 5.2 Card UI (mandatory sections, top → bottom)

1. **Title bar** — chalk-filled header using the kind’s `CHALK` stroke/fill + kind chip + `title` + optional `module`.  
2. **Signature block** — dashed ink box with prototype / struct peek (when `signature` is set).  
3. **Members table** — `key` (+ optional `type`) → `value` on cream rows.  
4. **What this means** — sticky-note amber panel with `explain` (required).  
5. **Tip** — optional `note` under the explanation.

### 5.3 Writing rules for `explain`

| Do | Don’t |
| :--- | :--- |
| One idea: what this box is and why it matters in this step | Dump only hex / API names with no sentence |
| Use the same metaphor world as the scenario Story when helpful | Introduce a new unrelated metaphor |
| Stay accurate to the technical fields above | Contradict PIDs, handles, or protections shown on the board |
| 2–4 sentences, readable by a junior analyst | Walls of jargon with no parenthetical sense |

`fields` stay precise (software structure). `explain` stays human. Both are required for teaching boxes.

### 5.4 Coverage

| Element | Tooltip required? |
| :--- | :--- |
| Teaching `box()` (process / API / memory / detect / handle) | **Yes** |
| `sticky()` NOTE | **Yes** (kind `'note'`) |
| `title` / footer `note` / `caption` text | No |
| Bare `arrow` | No (caption carries the name; related boxes carry explain) |

---

## 6. Board Descriptor Contract

```ts
interface TechnicalBoardDescriptor {
  scenarioId: string;
  sectionKey: Section3DKey;
  boardBadge: string;   // e.g. 'TECH BOARD · STEP #3'
  title: string;
  subtitle: string;
  chalkHint: string;    // short hover / teaching hint under subtitle in embed
  skeletons: TechnicalBoardSkeleton[];
  tooltips: Record<string, BoardTooltip>; // required whenever board has teaching boxes
}
```

Embed chrome (`TechnicalWhiteboardEmbed`) must show: badge, title, subtitle, and a one-line hint that hover opens the Excalidraw chalk card with **What this means**.

---

## 7. Visual / Interaction Invariants

1. **Whiteboard surface** — chalk cream background (`#FDFBF7` or `CHALK` palette). No dark-mode rewrite of the board canvas.  
2. **Editor chrome hidden** — menus, toolbars, library, footer controls must not appear (`technical-excalidraw-board` CSS).  
3. **Pan/zoom locked** — canvas `pointer-events: none`; `.board-hover-layer` hit-tests; `.board-excalidraw-tooltip` is interactive.  
4. **Hit-test** — map pointer → scene coords with current zoom/scroll; match rectangle ids to `tooltips`.  
5. **Delayed open** — card opens after ~240ms dwell (no instant flash). Hide after ~240ms grace so the pointer can move onto the card.  
6. **Interactive card** — scrollable body, selectable text, Copy button + native select/copy; stays open while the pointer is over it.  
7. **Story stays in Three.js** — do not animate Excalidraw phases as a second film. Static full reveal only.

---

## 8. Concrete Anti-Pattern vs Canonical Pattern

### ❌ Anti-pattern

- One giant `scenes.ts` for all steps.  
- Arrow label `WriteProcessMemory` drawn **on** the stroke (line invisible).  
- Boxes 40–80 units apart; cramped multi-line text overflowing.  
- Tooltips missing, or only `{ title, note }` with no `explain` / members.  
- Board only on Step #3; briefing / other steps / memory have none.

### ✅ Canonical pattern (Process Hollowing)

- Modular `scenes/step-3.ts` + shared `helpers.hArrow`.  
- Caption `WriteProcessMemory` **above** a bare arrow; `ARROW_GAP = 150`.  
- Tooltip for `s3-alloc`:

```ts
{
  kind: 'api',
  title: 'VirtualAllocEx',
  module: 'Kernel32.dll',
  signature: 'LPVOID VirtualAllocEx(HANDLE, LPVOID, SIZE_T, DWORD, DWORD)',
  fields: [
    { key: 'hProcess', type: 'HANDLE', value: '0x01C4' },
    { key: 'flProtect', type: 'DWORD', value: 'PAGE_EXECUTE_READWRITE (0x40)' },
  ],
  explain:
    'Asks Windows to reserve memory inside the frozen host that can be written and later run as code — the vault Beacon will occupy.',
  note: 'RWX is convenient for attackers and a red flag for defenders.',
}
```

---

## 9. TypeScript / File Blueprints

| Concern | Canonical location |
| :--- | :--- |
| Colors / roughness / font | `excalidraw/chalk.ts` |
| Helpers (`box`, `hArrow`, `sticky`, …) | `excalidraw/helpers.ts` |
| Types (`BoardTooltip`, descriptor) | `excalidraw/types.ts` |
| Per-section boards | `excalidraw/scenes/<section>.ts` |
| Scenario export map | `excalidraw/scenes/index.ts` |
| App registry | `lib/section-excalidraw-registry.ts` |
| Render + hover card | `components/excalidraw/ExcalidrawBoard.tsx`, `BoardTooltipCard.tsx`, `TechnicalWhiteboardEmbed.tsx` |

New scenarios **copy the Process Hollowing package shape**, then replace content. Do not invent a second tooltip UI.

---

## 10. Verification Checklist (Authors & Reviewers)

- [ ] Boards exist for **every** story-technical section of the scenario (briefing / steps / memory as applicable).  
- [ ] Package is modular (`helpers` + `scenes/*`); no monolith.  
- [ ] `ARROW_GAP` ≥ 150; captions float off the stroke; no arrow `label` text.  
- [ ] Every teaching rectangle + sticky has a `tooltips[id]` entry.  
- [ ] Every tooltip has `kind`, `title`, `fields`, and non-empty `explain`.  
- [ ] Sticky NOTE present on each board; footer hover hint present.  
- [ ] Embed uses shared components; pan/zoom remains locked; hover layer works.  
- [ ] Chalk palette / cream surface; editor chrome hidden.  
- [ ] Content matches the section’s technical prose (PIDs, APIs, EIDs consistent with `MOD-03` / `MOD-08`).  
- [ ] Registry entry added for the scenario id.

**Manual spot-check:** open Overview + each Step + Memory → hover every box → confirm chalk Excalidraw card + “What this means”; confirm no caption sits on an arrow line.

---

## 11. Relationship to Other Modules

| Module | Relationship |
| :--- | :--- |
| **`MOD-08`** | Whiteboard sits after the Three.js film and the technical clip, and before the numbered clauses. It never replaces Story or Three.js. |
| **`MOD-14`** | The clip is the silent animated lecture of the same facts. The board stays a static chalk map. Do not animate the board, and do not redraw the board as the clip. |
| **`MOD-09` / `MOD-10`** | Motion and metaphor film stay in Three.js; Excalidraw stays static. |
| **`MOD-03`** | Tokens inside box labels and tooltip `fields` follow inline-purpose discipline where dense. |
| **`MOD-04`** | Memory boards must align with VAD / SEC_IMAGE / MEM_PRIVATE vocabulary. |
| **`MOD-07`** | Embed chrome copy (badge / hint) must not truncate; tooltip text wraps inside the card. |
| **`MOD-12`** | Boards render inside the owned Inspector tabs (Overview / Steps / Memory), not as a new sidebar tab. |
