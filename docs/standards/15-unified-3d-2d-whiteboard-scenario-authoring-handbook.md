# Unified Bespoke 3D, 2D & Excalidraw Whiteboard Authoring Handbook (`MOD-15`)

> **Module ID**: `MOD-15` · **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Supreme Studio Standard**: [`MOD-17`](./17-bespoke-studio-redesign-pipeline-and-clean-slate-standard.md)  
> **Scope**: End-to-end engineering handbook for authoring a single bespoke Attack Explorer scenario across all three visual teaching layers: bespoke Three.js 3D storytelling (`MOD-09`, `MOD-10`, `MOD-16`), bespoke animated 2D SVG + GSAP technical clips (`MOD-14`), and bespoke interactive Excalidraw chalk whiteboards (`MOD-13`).  
> **Status**: Mandatory Permanent Standard (Aligned with `MOD-17`) · **Reference Benchmark**: `process-hollowing` (Process Hollowing & Cobalt Strike Beacon Loader) · **Deprecation Notice**: Legacy multi-scenario factory compilers (`/lib/scenario-2d-blueprints/**`, `/lib/malware-2d-blueprints/**`, `/components/three/scenes/scenario-world-composer.ts`, and `/scripts/build-cinema-screenplays.ts`) are **DEPRECATED** and slated for Phase 1 removal under `MOD-17`.

---

## 1. Purpose & Core Architecture — Three Distinct Bespoke Teaching Surfaces

Every scenario in **Attack Explorer** must teach through **three strictly separated, 100% hand-crafted visual surfaces** rendered in canonical order inside `StandardStoryTechnicalSection` (and `ProcessMemoryView` for Memory Forensics). None of these surfaces is a restyle, template clone, or duplicate of another; each answers a different pedagogical question for the learner.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                  CANONICAL PER-SECTION BESPOKE LEARNING STACK (MOD-15 + MOD-17)          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  0. CREATIVE PLAN & USER APPROVAL GATE (MOD-17 · BEFORE ANY CODE)                        │
│     • Mute Test + Swap Test + 1:1 Technical<->Physical Map (no fixed visual template)    │
│                                           │                                              │
│                                           ▼                                              │
│  1. STORY ANALOGY CARD (MOD-08, MOD-11)                                                  │
│     • 100% jargon-free plain-language story + explicit Story-to-Technical Key            │
│                                           │                                              │
│                                           ▼                                              │
│  2. BESPOKE THREE.JS 3D STORY STAGE (MOD-09, MOD-10, MOD-16)                             │
│     • Dedicated /modules/scenarios/<id>/choreography.ts + /three/* articulated props     │
│     • Free visual style, lighting, pacing & framing (no fixed aesthetic or template)     │
│     • Required on: briefing (Overview), step-1..N, and memory-forensics (if documented)  │
│                                           │                                              │
│                                           ▼                                              │
│  3. BESPOKE 2D ANIMATED TECHNICAL CLIP — SVG + GSAP (MOD-14)                             │
│     • Hand-crafted free-form 2D visual explanation (no fixed layout or aesthetic mold)   │
│     • Readable 1x pace (clipPace.ts) + GSAP-safe nested <g> transforms                   │
│     • Required on: step-1..N and memory-forensics (STRICTLY OMITTED on briefing)         │
│                                           │                                              │
│                                           ▼                                              │
│  4. BESPOKE 2D INTERACTIVE EXCALIDRAW TECHNICAL WHITEBOARD (MOD-13)                      │
│     • Dedicated /modules/scenarios/<id>/excalidraw/scenes/*.ts static cream (#FDFBF7)    │
│     • Bare arrows (ARROW_GAP >= 150), floating captions, sticky NOTE, chalk tooltips     │
│     • Required on: briefing, step-1..N, and memory-forensics (if documented)             │
│                                           │                                              │
│                                           ▼                                              │
│  5. NUMBERED FORENSIC TECHNICAL CLAUSES (MOD-03, MOD-08)                                 │
│     • Action + inline plain-English why parentheticals paired with real SIEM/MITRE logs  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Surface Ownership Matrix

| Surface | Primary Job | Where Required | Bespoke Code vs. Shared Playback Shell |
| :--- | :--- | :--- | :--- |
| **Three.js 3D Stage** | Explain **what happens conceptually** via articulated 3D props executing the attack mechanism (`Mute Test`) in any visual style suited to the scenario. | `briefing`, `step-1..N`, `memory-forensics` (only if `memoryBlocks` exist) | **Bespoke**: `choreography.ts`, 3D models, environment, visual style, camera path. **Shared Shell Only**: `AnimeSection3DStage`, HUD dock, optional material utilities, lazy loader. |
| **2D Technical Clip (SVG + GSAP)** | Explain **how the exact technical mechanism executes** (APIs, packets, tickets, registers, IAM hops, memory diffs) in any bespoke 2D visual form. | `step-1..N`, `memory-forensics` (only if `memoryBlocks` exist). **Never on `briefing`.** | **Bespoke**: Dedicated TSX clip per step with zero fixed template (`MOD-14`). **Shared Shell Only**: `AnimeClipStage`, `FilmBackdrop`, `clipPace.ts`. |
| **Excalidraw Whiteboard** | Provide a **static, inspectable chalk engineering blueprint** of entities, edges, invariants, and detection pivots. | `briefing`, `step-1..N`, `memory-forensics` (only if `memoryBlocks` exist) | **Bespoke**: `/modules/scenarios/<id>/excalidraw/scenes/*.ts`. **Shared Shell Only**: `TechnicalWhiteboardEmbed`, `ExcalidrawBoard`, `BoardTooltipCard`. |

---

## 2. The Bespoke Realism Law (Most Natural & Realistic 3D/2D Possible — Zero Fixed Templates)

Every rebuilt or newly added scenario **must be authored individually**, one scenario per turn in exact Sidebar order (`MOD-17`), never stamped from a factory engine or constrained to one structural template—and **both its 3D and 2D animations MUST be built in the most natural, lifelike, and realistic visual form possible**:

1. **Natural & Realistic Bespoke 3D World & Choreography Per Scenario (`MOD-09`, `MOD-10`)**:
   - Build physically grounded PBR scenes (`MeshStandardMaterial` / `MeshPhysicalMaterial`, procedural surface textures, natural lighting, atmospheric surroundings, multi-part realistic proportions, and physically weighted motion) with **no fixed layout template and zero cartoonish/toon shortcuts**.
   - **Pass Mute Test & Swap Test**: Every 3D scene must make the mechanism obvious with text turned off and become nonsensical if transplanted onto any other attack.
   - **Clean English & Zero Story Jargon**: Keep 100% of titles, callouts, cues, captions, and HUD labels in clean English (`MOD-09`) with `findTechnicalJargonInStory(text) === []` on all Story strings.
2. **Natural & Realistic Bespoke 2D Technical Animation Per Step (`MOD-14`)**:
   - Do **not** compile new scenarios through legacy generic template engines (`/lib/scenario-2d-blueprints/**` or `/lib/malware-2d-blueprints/**`), and do **not** lock 2D animations into one layout mold.
   - Craft each 2D animation with natural visual depth, refined realistic shading/proportions, and smooth physically eased motion—obeying `clipPace.ts` readable 1x pacing, unique `svgPrefix`, and GSAP-safe nested `<g className="anim-...">` inside outer `<g transform="translate(x, y)">`.
3. **Bespoke Modular Excalidraw Chalk Boards (`MOD-13`)**:
   - Mirror `/modules/scenarios/process-hollowing/excalidraw/` with modular `chalk.ts`, `types.ts`, `helpers.ts`, and `scenes/briefing.ts`, `scenes/step-1..N.ts`, optional `scenes/memory.ts`.
   - Maintain `ARROW_GAP >= 150`, bare arrows with separate floating captions, yellow sticky `NOTE`, footer hover hint, unclipped chalk text, and rich cream `#FDFBF7` hover tooltips on every teaching rectangle.
4. **Strict Grounding on `memory-forensics`**:
   - Register `memory-forensics` (for 3D, 2D clip, and Excalidraw whiteboard) **strictly and only** when the scenario has real documented `memoryBlocks` in its `processTree` (`MOD-04`, `MOD-10`).

---

## 3. Canonical Bespoke File Layout & Step-by-Step Authoring Workflow

Every rebuilt scenario follows the exact self-contained package layout pioneered by `process-hollowing`:

```
/docs/screenplays/bespoke/<NNN>-<scenario-id>.md       # 0. Director's Blueprint (USER APPROVAL FIRST)
   │
   ▼
/modules/scenarios/<scenario-id>/
├── index.ts                                           # 1. Core AttackScenario + stepGuide + sources
├── choreography.ts                                    # 2. Pure deterministic 0%..100% timeline engine
├── choreography.test.ts                               #    + fast unit tests (node:test)
├── three/                                             # 3. Bespoke 3D world & articulated props (free visual style)
│   ├── index.ts                                       #    (lazy-loaded ONLY via three-registry.ts)
│   ├── scene-builders.ts                              #    Hero models & environment geometry
│   └── step-scene-builders.ts                         #    Per-section scenes + dispose()
└── excalidraw/                                        # 4. Bespoke modular chalk whiteboards (MOD-13)
    ├── chalk.ts / helpers.ts / types.ts / index.ts
    └── scenes/ (briefing.ts, step-1..N.ts, optional memory.ts)
   │
   ▼
/components/technical-clip/clips/<scenario-id>/        # 5. Bespoke free-form 2D SVG+GSAP clips (MOD-14)
/modules/scenarios/three-registry.ts                   # 6. Dynamic import() registration (zero `/` bloat)
/lib/section-excalidraw-registry.ts                    #    + Lazy whiteboard registry wiring
/lib/section-technical-clip-registry.ts                #    + Lazy 2D clip registry wiring
```

### Mandatory 7-Step Single-Episode Workflow

1. **Select Next Scenario in Exact Sidebar Order**: Read [`MASTER-BACKLOG-SIDEBAR-ORDER.md`](../redesign-backlog/MASTER-BACKLOG-SIDEBAR-ORDER.md) and load its preserved primary sources from [`PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md`](../redesign-backlog/PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md).
2. **Draft & Get User Approval on the Creative Plan (`MOD-17 §3 Principle 3`)**: Write `/docs/screenplays/bespoke/<NNN>-<scenario-id>.md` passing both **Mute Test** and **Swap Test** (free-form—no fixed animation template). **Do not write code until approved.**
3. **Author Complete Scenario Technical Data & Prose**: Build `/modules/scenarios/<id>/index.ts` from primary sources with authentic kill-chain stages, real SIEM/Sysmon/EDR/CloudTrail/Auditd telemetry, CLI breakdowns, optional documented `memoryBlocks`, and 100% aligned Story + Technical prose (`MOD-01..MOD-05`, `MOD-08`, `MOD-11`). Run `npm run scenarios:registry`.
4. **Build Bespoke 3D Choreography & World**: Implement `choreography.ts`, `choreography.test.ts`, and `three/*` in any visual style and structure suited to the scenario, reusing only shared playback chrome (`MOD-09`, `MOD-10`), wired lazily into `three-registry.ts`.
5. **Build Bespoke 2D Technical Clips & Excalidraw Whiteboards**: Implement bespoke free-form per-step 2D animations (`MOD-14`, strictly omitting `briefing`) and modular Excalidraw boards (`MOD-13`), wired via dynamic `import()`.
6. **Run Full Automated Tests, Build, Lint & Static Data Sync**:
   ```bash
   npx --yes tsx --test modules/scenarios/<id>/choreography.test.ts lib/documentation-standards.test.ts lib/section-3d-registry.test.ts lib/technical-clips.test.ts modules/scenarios/architecture.test.ts lib/scenario-step-guides.test.ts lib/seo-metadata.test.ts
   node scripts/generate-scenario-data.mjs
   npm run build
   npm run lint
   ```
7. **Execute Frame-by-Frame Browser Director's Review (`1440×900`)**: Inspect every Act (`0%..100%`) across 3D cameras, Cutaway modes, 2D silent lectures, and Excalidraw whiteboards in Playwright (`MOD-17 §3 Principle 5`). Fix all visual defects, update `llms-full.txt`, and mark the episode `COMPLETED` in `MASTER-BACKLOG-SIDEBAR-ORDER.md`.

---

## 4. Anti-Patterns vs. Canonical Patterns

| Anti-Pattern (Do NOT Do This) | Canonical Pattern (DO This Instead) |
| :--- | :--- |
| Batch-building 5–50 scenarios or using `scenario-world-composer.ts` / `scenario-2d-blueprints` templates. | Build 1 bespoke episode per turn in exact Sidebar order following a user-approved Director's Blueprint (`MOD-17`). |
| Cloning the Process Hollowing Armored Bank Truck or road layout into another scenario. | Design an original 1-to-1 physical mechanism world tailored solely to that vulnerability (`Mute Test` + `Swap Test`). |
| Putting `className="anim-..."` and `transform="translate(...)"` on the same SVG `<g>` element. | Wrap `<g className="anim-...">` inside an outer static `<g transform="translate(x, y)">` so GSAP never clobbers positioning. |
| Putting inline `label` strings on Excalidraw `arrow` skeletons or hard-coding narrow `width` on standalone chalk `text`. | Use bare arrows (`ARROW_GAP >= 150`) with separate floating captions and let `ExcalidrawBoard.tsx` measure chalk text after `document.fonts.ready`. |
| Eagerly importing heavy scenario 3D/2D/whiteboard modules in `/` home page components. | Load every scenario's bespoke visual modules lazily via dynamic `import()` so `/` stays fast even at 188 bespoke engines. |
| Registering a 2D technical clip on `briefing`, or inventing a `memory-forensics` scene for a scenario without `memoryBlocks`. | Omit 2D clips on `briefing` (`MOD-14 §3`), and register `memory-forensics` strictly when documented `memoryBlocks` exist. |

---

## 5. Authoring & Review Acceptance Checklist (`MOD-15`)

Before marking any rebuilt or new scenario complete, confirm every item below:

- [ ] **Creative Plan Approved (`MOD-17`)**: Written under `/docs/screenplays/bespoke/`, passed Mute Test & Swap Test, and approved by the user prior to coding?
- [ ] **Bespoke 3D Story Layer**: Dedicated `choreography.ts` + articulated `three/*` models tailored freely to this scenario (no forced aesthetic or template), unobstructed cameras, `>= 4` `storyMappings`, clean English labels, zero clutter particles, and `findTechnicalJargonInStory() === []`?
- [ ] **Bespoke 2D Technical Animation Layer**: Dedicated free-form SVG + GSAP clip per step (`step-1..N`, optional `memory-forensics`, **never** `briefing`), globally unique `svgPrefix`, `clipPace.ts` readable 1x pacing, safe nested `<g>` transforms, and zero template cloning?
- [ ] **Bespoke Excalidraw Whiteboard Layer**: Modular `/modules/scenarios/<id>/excalidraw/scenes/*.ts` boards across `briefing`, `step-1..N`, and optional `memory-forensics`, with `ARROW_GAP >= 150`, bare arrows + floating captions, yellow sticky `NOTE`, and rich chalk hover tooltips (`explain >= 20` chars)?
- [ ] **Memory Grounding & Lazy Loading**: `memory-forensics` registered strictly if and only if documented `memoryBlocks` exist, and all heavy modules loaded lazily via dynamic `import()` with full `dispose()` cleanup?
- [ ] **Automated Gates & Frame-by-Frame Director's Review**: All unit tests, `npm run build`, `npm run lint`, and `1440×900` frame-by-frame browser inspection passed with zero errors?
