# Bespoke Studio Redesign Pipeline, Clean-Slate Rebuild & Quality Gates Standard (`MOD-17`)

> **Module ID**: `MOD-17` · **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Per-Section 3D Law**: [`MOD-18`](./18-per-section-standalone-3d-diorama-and-engine-standard.md)  
> **Scope**: Supreme authoring, redesign, and quality-governance standard for **Attack Explorer** — superseding all batch-generation, 28-place template composer, Overview station slicing (`MOD-18`), and automated narrative rollout pipelines across `/modules/scenarios/**`, `/components/three/**`, `/components/technical-clip/**`, `/components/excalidraw/**`, `/lib/**`, and `/scripts/**`.  
> **Status**: Mandatory Permanent Standard · **Golden Benchmark**: `process-hollowing` (Armored Bank Truck & Bank Garage) · **Master Queue**: [`/docs/redesign-backlog/MASTER-BACKLOG-SIDEBAR-ORDER.md`](../redesign-backlog/MASTER-BACKLOG-SIDEBAR-ORDER.md) & [`/docs/redesign-backlog/PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md`](../redesign-backlog/PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md)

---

## 1. Root-Cause Diagnosis — Why the 187 Auto-Generated Scenarios Failed Quality Parity

An architectural audit of the 188-scenario corpus revealed a structural quality chasm between **`process-hollowing`** (`#001`) and the remaining **187 scenarios** (`#002..#188`). No incremental patch on top of the legacy template engine can close this gap because the failure is architectural:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                  ARCHITECTURAL FAILURE OF THE LEGACY FACTORY PIPELINE                    │
├───────────────────────────────────────────┬──────────────────────────────────────────────┤
│  BENCHMARK: process-hollowing (Bespoke)   │  LEGACY 187 SCENARIOS (Factory Template)     │
├───────────────────────────────────────────┼──────────────────────────────────────────────┤
│  • Articulated armored bank truck enters  │  • Single generic composer mounts a static   │
│    garage, freezes, opens rear doors,     │    left prop, static right prop, two stiff   │
│    unloads bullion, boards covert crew,   │    figures, and recycled glowing arcs/locks. │
│    releases brake, spins wheels, passes   │  • Objects act as scenery, NOT as the real   │
│    saluting gate guard under same plate.  │    technical mechanism of the attack.        │
│  • Bespoke 3D choreography + bespoke 2D   │  • Auto-distributed across 28 generic places │
│    silent-lecture SVG clips + bespoke     │    (e.g., Ransomware in a Supermarket,       │
│    Excalidraw chalk boards.               │    Kerberoasting story about a hotel paired  │
│  • Passes Mute Test: even with all text   │    with a Courthouse 3D scene & cut-off sign)│
│    hidden, the mechanism is unmistakable. │  • Fails Swap Test: swapping the title from  │
│                                           │    Kerberoasting to SQLi or OAuth plays the  │
│                                           │    same decorative motion.                   │
└───────────────────────────────────────────┴──────────────────────────────────────────────┘
```

### Three Specific Defects Eliminated by This Standard

1. **Template Rigidity (1 Bespoke vs. 187 Templated)**:
   - Only `process-hollowing` owns a dedicated choreography engine, articulated 3D hero models, per-step bespoke SVG+GSAP silent lectures, and hand-authored Excalidraw boards.
   - All 187 other scenarios flowed through `scenario-world-composer.ts`, recycled 28 architectural backdrops, and compiled 2D blueprint factories—reducing every cyber attack to the same "character walks left-to-right + glowing beam + lock icon" visual grammar.
2. **Story ↔ Environment ↔ Label Contradictions & Truncation**:
   - Script-driven environment assignment and automated text slicing created severe continuity breaks: scenarios whose Story described a Grand Hotel concierge while the 3D viewport rendered a Courthouse notary bench, identical hotel-guestbook metaphors copied across unrelated attacks (`OAuth`, `noPac`, `Scattered Spider`), and 3D signboards sliced mid-word.
3. **Decorative Motion vs. Explanatory Animation**:
   - In `process-hollowing`, physical object state transitions *are* the technical explanation. In templated scenarios, motion is ornamental—removing the labels leaves the viewer unable to tell which vulnerability or mechanism occurred.

---

## 2. Clean-Slate Rebuild Mandate (Preserve Benchmark + Archive Sources + Rebuild One-by-One)

Rather than patching factory-generated technical debt across 187 inconsistent modules, Attack Explorer adopts a **Clean-Slate Studio Rebuild Strategy**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                     THREE-PHASE CLEAN-SLATE STUDIO REDESIGN ROADMAP                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  PHASE 0 · DOCUMENTATION & MASTER BACKLOG LOCK (CURRENT PHASE — ZERO CODE CHANGES)       │
│    1. Codify MOD-17 and align MOD-00, MOD-06, MOD-07, MOD-10, MOD-13, MOD-14, MOD-15,    │
│       MOD-16, and /docs/screenplays/README.md.                                           │
│    2. Extract ALL 188 scenarios in EXACT Sidebar Order (#001..#188) with Priority Tiers  │
│       and preserve ALL 564 primary source URLs in /docs/redesign-backlog/*.md.           │
│                                           │                                              │
│                                           ▼                                              │
│  PHASE 1 · CLEAN-SLATE CODEBASE PURGE (NEXT CODE PHASE — AFTER USER APPROVAL)            │
│    1. Keep `process-hollowing` (#001) 100% untouched and live as the Golden Benchmark.   │
│    2. Remove the 187 templated scenarios, generic 28-place 3D composers, generic 2D      │
│       blueprint compilers, batch rollout scripts, and artificial-diversity tests.        │
│    3. Update sitemap, llms.txt, llms-full.txt, and CI suites to reflect live bespoke     │
│       scenarios only (eliminating thin/duplicate content).                               │
│                                           │                                              │
│                                           ▼                                              │
│  PHASE 2 · EPISODIC ONE-BY-ONE REBUILD (STRICTLY IN SIDEBAR ORDER)                       │
│    For each scenario from #002 onward (following Sidebar Category 1 -> Category 13):     │
│    Study Preserved Sources -> Author Technical Data & Telemetry -> Write Director's      │
│    Blueprint & Shot List -> USER APPROVAL GATE -> Build Bespoke 3D + 2D + Whiteboard ->  │
│    Frame-by-Frame Browser Director's Review -> Publish & Mark COMPLETED -> Next Episode. │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Why Full Clean-Slate Rebuild Beats In-Place Patching

1. **Brand Integrity & First Impression**: Five or ten 10/10 bespoke episodes carry vastly higher educational and professional credibility than 188 inconsistent templated pages. A visitor moving from `process-hollowing` to the second scenario must experience the exact same "wow" craft.
2. **End-to-End Swiss-Watch Interlocking**: Designing the scenario's **technical kill-chain stages, real SIEM/Sysmon/CloudTrail/Auditd telemetry, memory forensics, and CLI breakdowns** simultaneously with its **Story Analogy, bespoke 3D world, bespoke 2D silent lecture, and Excalidraw whiteboard** directly from primary sources eliminates awkward retrofitting.
3. **Elimination of Factory Technical Debt**: Removing auto-generated data files, 28-place composers, mass-rewrite scripts, and artificial-diversity assertions makes builds fast, keeps bundles lean, and prevents automated scripts from ever overwriting hand-crafted work.
4. **Sidebar Order + Priority Tier Visibility**: Redesign execution follows **exact Sidebar order** (`#001` through `#188` across Categories 1..13) as tracked in [`/docs/redesign-backlog/MASTER-BACKLOG-SIDEBAR-ORDER.md`](../redesign-backlog/MASTER-BACKLOG-SIDEBAR-ORDER.md), while every entry also carries an explicit **Importance Tier (`Tier 1 — Flagship`, `Tier 2 — High-Impact`, `Tier 3 — Specialized`)** and overlap/consolidation notes.

### 2.2 Phase 1 Code Cleanup Inventory (Reference Checklist for Future Code Phase)

When transitioning from Phase 0 (Documentation) to Phase 1 (Clean-Slate Code Purge), execute **only after verifying** that [`PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md`](../redesign-backlog/PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md) holds all 564 source URLs:

| Asset Layer | Keep Untouched (Benchmark & Shared Shell) | Purge / Retire in Phase 1 |
| :--- | :--- | :--- |
| **Scenario Domain Packages** | `/modules/scenarios/process-hollowing/**`, `/modules/scenarios/types.ts`, `/modules/scenarios/contracts.ts`, `/modules/scenarios/category-labels.ts`, `/modules/scenarios/three-registry.ts` | The 187 non-`process-hollowing` scenario directories under `/modules/scenarios/*` (rebuilt one-by-one from scratch) and `/modules/scenarios/legacy/*` once no legacy drafts remain. |
| **Static Payloads** | `/public/scenario-data/process-hollowing.json` | The 187 non-`process-hollowing` JSON files under `/public/scenario-data/*.json`. |
| **3D Visual Layer** | `/components/three/AnimeSection3DStage.tsx`, `ScenarioSection3DEmbed.tsx`, `StagePlaybackDock.tsx`, `StageStoryCaption.tsx`, `StageTopActions.tsx`, `StageWebGLFallback.tsx`, `FloatingStoryCallout.tsx`, `anime-toon-materials.ts`, `calloutCardStyles.ts`, `detectSoftwareWebGL.ts`, `floating-callout-layout.ts`, `useCanvasPlayToggle.ts` | Generic template composers: `/components/three/scenes/scenario-world-composer.ts`, `cinema-stage-architectures.ts`, `real-world-heroes.ts`, `domain-props-library.ts`, and all 18 generic category world files under `/components/three/scenes/*-worlds.ts` + `/lib/section-3d-registries/*` + `/lib/scenario-cinema-profiles*.ts` + `/lib/scenario-real-world-stories.ts`. |
| **2D Technical Clip Layer** | `/components/technical-clip/AnimeClipStage.tsx`, `FilmBackdrop.tsx`, `TechnicalClipEmbed.tsx`, `clipPace.ts`, `/components/technical-clip/clips/*` (Process Hollowing bespoke clips) | Generic 2D profile compilers and multi-scenario templates: `/lib/scenario-2d-blueprints/**`, `/lib/malware-2d-blueprints/**`, `/components/technical-clip/malware-clips/**`. |
| **Excalidraw Whiteboard Layer** | `/components/excalidraw/**`, `/modules/scenarios/process-hollowing/excalidraw/**`, `/lib/excalidraw-boards/board-primitives.ts` (low-level chalk spacing primitives only) | Generic auto-compiled whiteboard generators wired through `/lib/scenario-2d-blueprints/**` and `/lib/malware-2d-blueprints/**`. |
| **Batch Factory Scripts** | `/scripts/copy-excalidraw-fonts.mjs`, `/scripts/generate-scenario-registry.mjs`, `/scripts/generate-scenario-data.mjs` (updated for bespoke catalog) | `/scripts/build-cinema-screenplays.ts`, `/scripts/rollout-overview-formula-a2.mjs`, `/scripts/rewrite-overview-formula-a2-quality.mjs`, `/scripts/fix-narrative-mod-fields.mjs`, `/scripts/fix-remaining-narrative.mjs`, `/scripts/merge-scenario-packages.mjs`. |
| **Artificial-Diversity Tests** | `/lib/documentation-standards.test.ts`, `/lib/simulation-engine.test.ts`, `/lib/inspector-scope.test.ts`, `/lib/seo-metadata.test.ts`, `/lib/command-line-explanations.test.ts`, `/lib/tooltip-positioning.test.ts`, `/lib/hollowing-3d-overlay-layout.test.ts`, `/modules/scenarios/process-hollowing/choreography.test.ts`, `/modules/scenarios/architecture.test.ts` (updated for dynamic live scenario count) | `/lib/scenario-cinematic-uniqueness.test.ts` (which enforced the retired 28-place template matrix); refactor `/lib/section-3d-registry.test.ts` and `/lib/technical-clips.test.ts` to assert bespoke quality rather than hardcoded 188-count template assertions. |

### 2.3 SEO & Public URL Transition Precautions

1. **Pre-Launch / Unindexed Domain**: Removing the 187 templated pages before public search indexing is strictly beneficial for long-term SEO—search engines and LLM crawlers will index only authoritative, 100% unique, flagship-grade pages.
2. **Already-Indexed Public Domain**: If production URLs are already indexed by Google/Bing at Phase 1 execution time:
   - Immediately regenerate `/app/sitemap.ts`, `/public/llms.txt`, and `/public/llms-full.txt` so only live bespoke scenarios are advertised.
   - Define an explicit HTTP disposition policy for removed `/scenarios/<id>` slugs (either clean `410 Gone` / `404` for unpublished backlog items or a deliberate redirect to `/sources#redesign-roadmap`) so Search Console does not accumulate soft-404 crawl errors.
   - As each rebuilt scenario completes Director's Review in Phase 2, atomically re-add it to the live registry, sitemap, `llms.txt`, `llms-full.txt`, and submit via `IndexNow` (`MOD-06`).

---

## 3. The Five Studio Production Principles (Non-Negotiable Laws)

Every scenario rebuilt in Phase 2 (and every future scenario ever added to Attack Explorer) MUST obey all five studio principles below without exception.

### Principle 1 — Strict One-Scenario-Per-Turn Law (Zero Batch Generation)

- **Absolute Ban on Batching**: Never author, redesign, or code 5, 10, or 50 scenarios in a single pass. Mass production inevitably collapses back into copy-pasted geometry, repetitive camera paths, and generic prose.
- **Strict Episodic Order**: Follow the exact **Sidebar Order** recorded in [`MASTER-BACKLOG-SIDEBAR-ORDER.md`](../redesign-backlog/MASTER-BACKLOG-SIDEBAR-ORDER.md) (Category 1 `MALWARE` → Category 13 `AI_LLM_MLOPS_SECURITY`, starting with `#002 amsi-reflective-dll`), unless the user explicitly nominates a specific scenario from the backlog.
- **Atomic Episode Completion**: Do not begin Scenario `N+1` until Scenario `N` has passed every gate below and been marked `COMPLETED` in the Master Backlog:
  1. Study preserved primary sources (`>= 3` authoritative references from `PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md`, supplemented with fresh verification if needed).
  2. Design authentic technical kill-chain stages, real SIEM/Sysmon/EDR/CloudTrail/Auditd telemetry, CLI command breakdowns, and memory blocks (only where genuine).
  3. Write the complete **Director's Blueprint & Shot-by-Shot Screenplay** (Principle 3) and pass the **Mute Test** and **Swap Test** (Principle 2).
  4. **STOP AND OBTAIN USER APPROVAL** on the Director's Blueprint before writing any code.
  5. Implement the 100% bespoke scenario package (Technical Data + Bespoke 3D World & Choreography + Bespoke 2D Silent Lecture Clips + Bespoke Excalidraw Whiteboards).
  6. Execute **Director's Review** frame-by-frame in a real browser (`1440×900`) and fix all visual/framing/motion defects (Principle 5).
  7. Run automated tests, build, lint, regenerate static scenario JSON & `llms-full.txt`, and update the Master Backlog status to `COMPLETED`.

---

### Principle 2 — Two Mandatory Pre-Code Idea Filters (Mute Test & Swap Test)

Before a single line of TypeScript or Three.js is written, the scenario's physical world and animation concept MUST pass **both** ruthless filters:

| Filter Name | Mandatory Diagnostic Question | Pass Standard | Automatic Rejection Trigger |
| :--- | :--- | :--- | :--- |
| **1. The Mute Test** *(Zero-Text Comprehension)* | If we hide 100% of titles, captions, HUD text, and floating callouts, can a viewer still explain **what technical action occurred** purely by watching articulated objects open, break, forge, swap, reroute, and fool or trigger the security sensor? | **YES** — e.g., in `process-hollowing`, watching the armored bank truck freeze, unload gold crates, load covert intruders, release the brake, and pass a saluting guard under the same license plate tells the entire story silently. | Viewer only sees generic figures walking, glowing arcs firing, or a static icon spinning without visible physical state transformation of the target mechanism. |
| **2. The Swap Test** *(Zero Interchangeability)* | If we swap this scenario's title and labels onto a completely different attack (for example, replacing `Kerberoasting` with `SQL Injection` or `OAuth Token Hijack`), does the 3D environment and animation still "kind of work"? | **NO** — the environment and mechanical choreography are a literal 1-to-1 physical embodiment of **this exact vulnerability** and become nonsensical on any other attack. | **YES** — the environment is merely decorative scenery (like a generic office lobby, supermarket, or courthouse with a glowing beam) rather than the physical mechanics of the vulnerability itself. **Discard immediately.** |

#### Reference Examples of Compliant 1-to-1 Physical Embodiments

- **Process Hollowing (`#001` Benchmark — *Heat* / *The Italian Job*)**: Armored bank truck halted in garage, legal bullion removed, covert crew loaded inside the intact shell, cab GPS reprogrammed, brake released, passing the gate guard under the trusted license plate.
- **Kerberoasting (`#031` — *Ocean's Eleven* / *Catch Me If You Can*)**: Domain voucher/ticket booth issuing a real wax-sealed VIP pass wrapped in brittle soft wax (RC4), guest carrying that wax-sealed voucher into an offline basement safe-cracking rig where mechanical dials brute-force the inner master key, then walking straight through the VIP vault door with a forged master pass.
- **Supply Chain / Build Tampering (`SolarWinds`, `XZ Utils`, `3CX`)**: Real automated factory assembly conveyor with an official holographic signing press where a covert robotic injector slips a tiny rigged module inside a sealed unit *before* the genuine manufacturer hologram seals it for worldwide shipment.
- **BYOVD EDR Killer (`AuKill`, `Terminator`, `mhyprot2`)**: Authorized maintenance technician carrying a genuinely signed official master badge walking past the lobby scanner directly into the central security monitoring room and physically flipping off camera monitors and alarm sirens one by one.
- **Ransomware & Shadow Wipe (`LockBit`, `Akira`, `ALPHV`)**: Back-room archive tape/microfilm reels fed into an industrial shredder (`vssadmin delete shadows`) while rapid mechanical arms snap heavy crimson padlocks onto rows of active filing vaults and bolt an extortion notice onto the entrance glass.
- **Web / JNDI / SSRF Callback (`Log4Shell`, `AWS IMDS SSRF`)**: Lobby receptionist reading a rigged guestbook slip that causes the front-desk rotary phone to dial an outside accomplice van automatically, pulling a sealed crate through the window and unbolting a hidden side exit back to the attacker.

---

### Principle 3 — Phase 0: Creative Plan & Permanent Realism Mandate (User Approval Gate — Zero Fixed Template)

Before writing code for any scenario, draft a concise, **free-form creative plan** (stored under `/docs/screenplays/bespoke/<NNN>-<scenario-id>.md` — strictly docs-only, never imported by UI code) and present it to the user for explicit approval or revision.

**Permanent Realism Mandate + Zero Fixed Template for All Future 3D & 2D Animations**:
- **Most Natural & Realistic Presentation Possible**: Every future **3D animation** (`MOD-09`) and **2D animation** (`MOD-14`) MUST be built in the most natural, lifelike, and physically realistic form possible—using real PBR materials, procedural textures, believable architectural/environmental depth, authentic proportions, refined shading, and physically weighty motion rather than cartoonish, cel-shaded, flat, or boxy shortcuts.
- **Zero Fixed Layout or Structural Template**: Do **not** force every scenario into a fixed 5-Act percentage split (`0%–20% / 20%–40% / ...`), a fixed 3-phase step split (`0%→33% / ...`), a fixed 5-shot camera list, or a fixed 2D drawing mold.
- Cover only what is needed to agree on the technical and creative direction:
  1. **Technical Forensic Plan**: Real kill-chain stages (`1..N`), MITRE IDs, authentic telemetry (Sysmon/WinSec/Auditd/CloudTrail/Suricata/Zeek), and whether documented `memoryBlocks` exist (`YES` or `NO`).
  2. **Realistic Visual Concept & Mute/Swap Reasoning**: How the real-world environment, authentic materials, lighting, and 1-to-1 physical mechanism faithfully embody this specific attack, plus why it passes the Mute Test and Swap Test.
  3. **Overview & Per-Section 3D Animation Plan**: How the Overview and each individual Step (`step-1..N` and optional `memory-forensics`) will animate independently in realistic 3D—using whatever structure, pacing, phase count, and camera angles fit each scene best (`MOD-18`).
  4. **2D Animation & Excalidraw Whiteboard Plan**: Natural, realistic 2D animation approach per step (`step-1..N` + optional `memory-forensics`; omitted on `briefing`) and static chalk whiteboard topology (`MOD-13`, `MOD-14`).

**Hard Rule**: Zero application code is written until the user approves or revises the creative plan.

---

### Principle 4 — Clean Engineering Separation (Shared Player Shell vs. 100% Bespoke Scenario Engine)

Scaling hand-crafted interactive episodes without bloating bundle size or runtime memory requires a strict architectural boundary between **creative scenario engines** and **shared playback infrastructure**:

| Boundary Category | Ownership Rule | Exact Modules & Responsibilities |
| :--- | :--- | :--- |
| **100% BESPOKE PER SCENARIO & PER SECTION (`MOD-18`)** *(NEVER shared across scenarios; NEVER sliced from Overview; NO fixed visual or structural template)* | Lives exclusively inside `/modules/scenarios/<scenario-id>/` (and bespoke 2D clips per scenario). | • `index.ts`: Scenario technical data, stages, telemetry, process tree, optional memory blocks, step guide.<br>• `choreography.ts`: Pure deterministic timeline state machines tailored freely to Overview and each standalone section, with unit tests (`choreography.test.ts`).<br>• `three/`: Modular standalone scenes (`overview-scene.ts`, `step-1-scene.ts..step-N-scene.ts`, optional `memory-diff-scene.ts`), using any visual style, materials, lighting, camera setup, cutaway behavior, and deterministic `dispose()`.<br>• `clips/` (or bespoke per-scenario clip components): Custom free-form 2D SVG + GSAP animation per step (`MOD-14`).<br>• `excalidraw/`: Modular chalk boards (`briefing.ts`, `step-1..N.ts`, optional `memory.ts`) (`MOD-13`). |
| **SHARED INFRASTRUCTURE ONLY** *(Zero creative, stylistic, or narrative logic)* | Lives in `/components/three/`, `/components/technical-clip/`, `/components/excalidraw/`, and `/modules/scenarios/three-registry.ts`. | • Playback HUD shell (`Play/Pause`, `Replay`, Act/Phase jump pills, speed control, `Cutaway`, camera buttons, `Labels`, `Bloom`, `Full Page`, timeline scrubber).<br>• Optional visual/material utilities (never mandatory—each scenario chooses its own look freely).<br>• WebGL lifecycle coordinator, software-WebGL resilience, `IntersectionObserver` auto-pause/standby, and GPU resource disposal.<br>• **Lazy Dynamic Loading (`import()`)**: Only the single active scenario's bespoke 3D/2D/Whiteboard modules ever load into memory. |

---

### Principle 5 — Director's Review (Frame-by-Frame Real-Browser Visual Audit)

Clean compilation (`npm run build`) and passing unit tests are **necessary but never sufficient**. Before any rebuilt scenario is accepted, perform a **Director's Review** in headless Chromium (`1440×900` via Playwright) capturing frames across **every Act from 0% to 100%** plus all 4 camera presets, Cutaway modes, 2D clips, and Excalidraw whiteboards:

1. **Zero Geometry Clipping / Interpenetration**: Confirm no moving character, door, vehicle, lever, or crate pierces through floors, walls, desks, or other props at any timeline timestamp.
2. **Center-Stage Camera Framing**: Confirm the hero subject sits clearly in the visual focal zone in every Act, with zero foreground columns/walls blocking the lens (`z <= -2.2` rear cantilevers per `MOD-09`).
3. **Zero HUD / Signboard / Callout Collisions**: Confirm the top-left Act HUD card, floating translucent callout badges, and 3D signboards never overlap one another, never clip off viewport edges, and never display mid-sentence truncated titles.
4. **Physical Weight & Cinematic Motion**: Confirm animations exhibit anticipation, easing, mechanical cause-and-effect, and readable pacing (`clipPace.ts` floors for 2D clips) rather than stiff linear teleporting.
5. **Visual Mute Test & Swap Test Confirmation**: Inspect the captured frames with labels mentally/visually toggled off to confirm the attack mechanism reads unmistakably without text.
6. **Zero Console / WebGL Errors & Clean Cleanup**: Confirm zero React/WebGL errors across mount, playback, camera switching, cutaway toggling, 2D clip interaction, whiteboard hover tooltips, and unmount.

---

## 4. Concrete Before & After Comparison (❌ Legacy Factory Template vs. ✅ Bespoke Studio Episode)

| Dimension | ❌ Legacy Factory Template (Rejected) | ✅ Bespoke Studio Episode (`MOD-17` Canonical) |
| :--- | :--- | :--- |
| **Production Cadence** | 20–50 scenarios generated in one script run via `build-cinema-screenplays.ts`. | 1 scenario per turn in exact Sidebar order, gated by Director's Blueprint user approval. |
| **Environment Choice** | Assigned from a 28-place pool (`Kerberoasting` → Courthouse while story text mentions a Grand Hotel; `Ransomware` → Supermarket). | Bespoke physical world embodying the exact vulnerability mechanism (`Kerberoasting` → Domain Ticket Vault + Offline Wax-Seal Cracking Lab) passing both Mute Test and Swap Test. |
| **3D Object Behavior** | Static left/right decor + walking stick-figure + recycled glowing arc/lock. | Articulated props executing literal state transitions (doors swinging, wax seals cracking, gears turning, badges duplicating, cameras shutting down) synchronized to a pure `choreography.ts` timeline. |
| **2D Technical Clip** | Auto-compiled into one of 14 generic box-and-beam layouts via `scenario-2d-blueprints`. | Hand-crafted SVG + GSAP silent lecture per step (`MOD-14`) with a unique spatial sentence where every moving mark maps to a real claim. |
| **Excalidraw Whiteboard** | Auto-compiled from generic 8-topology builders. | Hand-crafted modular `/modules/scenarios/<id>/excalidraw/scenes/*.ts` (`MOD-13`) with exact APIs, handles, bare arrows (`ARROW_GAP >= 150`), and chalk hover tooltips. |
| **Technical & Story Alignment** | Old technical data retrofitted onto an auto-generated real-world story string. | Technical stages, SIEM/Sysmon logs, memory blocks, CLI breakdowns, Story Analogy, 3D world, 2D clips, and whiteboards authored together from preserved primary sources. |

---

## 5. Step-by-Step Operational Playbook for Each Redesign Episode

```
[1. Pick Next #NNN in Sidebar Order from MASTER-BACKLOG-SIDEBAR-ORDER.md]
                                │
                                ▼
[2. Load Preserved Primary Sources from PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md]
                                │
                                ▼
[3. Author Director's Blueprint (Technical Plan + Mute/Swap Proofs + 1:1 Map + Shot List)]
                                │
                                ▼
[4. STOP -> PRESENT BLUEPRINT TO USER -> WAIT FOR APPROVAL / REVISION]
                                │ (Approved)
                                ▼
[5. Build 100% Bespoke Package: index.ts + choreography.ts + three/ + clips + excalidraw/]
                                │
                                ▼
[6. Run Unit Tests + Build + Lint + Frame-by-Frame Browser Director's Review (1440x900)]
                                │ (All High/Medium visual defects fixed)
                                ▼
[7. Update Sitemap/llms-full.txt/Static JSON + Mark #NNN COMPLETED -> Move to #NNN+1]
```

---

## 6. Pre-Merge Episode Acceptance Checklist (`MOD-17`)

Before marking any rebuilt scenario `COMPLETED` in `/docs/redesign-backlog/MASTER-BACKLOG-SIDEBAR-ORDER.md`, verify every gate below:

- [ ] **Sidebar Order & Single-Episode Discipline**: Was this scenario rebuilt individually (not batched) following exact Sidebar order (or explicit user selection)?
- [ ] **Primary Sources Grounded**: Are `>= 3` authoritative primary sources from `PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md` verified and wired into attribution, Forensic Fact Sheet, and Schema.org `citation`?
- [ ] **Creative Plan Approved**: Was the free-form creative plan written under `/docs/screenplays/bespoke/` and explicitly approved by the user before coding began (with zero UI references to `/docs/screenplays/`)?
- [ ] **Mute Test Passed**: With all labels/captions hidden, do the articulated 3D prop movements and 2D animations clearly communicate the exact technical mechanism?
- [ ] **Swap Test Passed**: Is the physical environment and mechanical choreography uniquely tied to this vulnerability so it cannot be transplanted onto another attack?
- [ ] **100% Bespoke Free-Form Visual Stack**: Are 3D scene/choreography, 2D animations (`step-1..N` + optional `memory-forensics`, never `briefing`), and Excalidraw whiteboards (`briefing`, `step-1..N`, optional `memory-forensics`) all hand-crafted specifically for this scenario with zero factory template composers and no forced visual mold?
- [ ] **Per-Section Standalone 3D Compliance (`MOD-18`)**: Does **every** `step-1..N` and `memory-forensics` 3D stage mount its own standalone scene tailored to that step rather than slicing Overview stations?
- [ ] **Story & Technical Clarity (`MOD-02`, `MOD-03`, `MOD-08`, `MOD-11`)**: Zero technical jargon in Story fields, clean standard English copy, zero mid-sentence truncated titles/signboards, explicit `storyMappings` (4 or 6 pairs), Overview strictly roadmap-only, and per-token inline parentheticals in Step/Memory deep-dives?
- [ ] **Clean Lazy Loading & Cleanup**: Does the scenario load lazily via dynamic `import()` without bloating `/`, and does `dispose()` free all Three.js geometries, materials, and textures?
- [ ] **Director's Review Passed**: Were real-browser frames at `1440×900` visually inspected across the full timeline (`0%..100%`) with zero geometry clipping, zero HUD/signboard overlap, readable motion, and zero console/WebGL errors?
- [ ] **SEO, Tests & Backlog Synced**: Do unit tests (`npx --yes tsx --test`), `npm run build`, and `npm run lint` pass, are static JSON / `sitemap` / `llms-full.txt` updated, and is the Master Backlog status updated to `COMPLETED`?
