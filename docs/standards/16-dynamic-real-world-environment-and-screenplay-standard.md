# Dynamic Real-World Physical Environment, Director's Blueprint & 3-Way Alignment Standard (`MOD-16`)

> **Module ID**: `MOD-16` · **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Supreme Studio Standard**: [`MOD-17`](./17-bespoke-studio-redesign-pipeline-and-clean-slate-standard.md) · **Per-Section 3D Law**: [`MOD-18`](./18-per-section-standalone-3d-diorama-and-engine-standard.md)  
> **Scope**: Mandatory standard governing bespoke 1-to-1 real-world physical mechanism environments, docs-only Director's Blueprint screenplays (`/docs/screenplays/bespoke/**`), strict Mute Test & Swap Test filters, and 3-way Story ↔ 3D Three.js ↔ 2D SVG+GSAP alignment.  
> **Status**: Mandatory Permanent Standard (Revised under `MOD-17`) · **Reference Benchmark**: `process-hollowing` (Armored Bank Truck & Bank Garage) · **Deprecation Notice**: The legacy 28-place auto-assignment script (`scripts/build-cinema-screenplays.ts`) and generic `scenario-world-composer.ts` are **DEPRECATED** and scheduled for removal in Phase 1 Clean-Slate Code Cleanup (`MOD-17 §2.2`).

---

## 1. Purpose & The 1-to-1 Physical Mechanism Law

Every cyber attack scenario in **Attack Explorer** must teach through a **bespoke, tangible real-world physical mechanism** whose articulated objects *literally execute* the attack's technical mechanics—matching the gold standard established by **`process-hollowing`** (an actual armored bank truck halting in a garage, freezing, unloading bullion, loading covert intruders, reprogramming its GPS, releasing the brake, and rolling past a saluting gate guard under the trusted license plate).

**Strictly Forbidden (Retired Legacy Anti-Patterns)**:
- Recycling a fixed pool of 28 decorative backdrops (e.g., placing Ransomware in a Supermarket, OpenSSH in a Restaurant Kitchen, or Kerberoasting in a Courthouse while the story text describes a Grand Hotel).
- Using a shared `scenario-world-composer` that places one static object on the left, one static object on the right, two stiff characters, and a recycled glowing arc/lock.
- Auto-generating screenplays, story paragraphs, or signboards via batch scripts (which caused mid-sentence title truncation and copy-pasted metaphors across unrelated attacks).

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                 MANDATORY BESPOKE 3-WAY ALIGNMENT PIPELINE (MOD-16 + MOD-17)             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  PHASE 0 · CREATIVE PLAN & PRE-CODE FILTERS (DOCS-ONLY · USER APPROVAL REQUIRED)         │
│    • Study preserved primary sources (PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md)             │
│    • Pass MUTE TEST (understandable with zero text) & SWAP TEST (zero interchangeability)│
│    • Author free-form creative plan in /docs/screenplays/bespoke/<NNN>-<id>.md           │
│    • STOP -> Obtain explicit user approval before writing a single line of code          │
│                                           │                                              │
│                                           ▼                                              │
│  PHASE 1 · UNIFIED TECHNICAL + REAL-WORLD STORY AUTHORING (ZERO CONTRADICTIONS)          │
│    • Author stages, real SIEM/Sysmon logs, memory blocks (if genuine), and CLI specs     │
│    • Author 100% jargon-free Story Analogy + Story-to-Technical Key matching the 3D cast │
│                                           │                                              │
│                  ┌────────────────────────┴────────────────────────┐                     │
│                  ▼                                                 ▼                     │
│  PHASE 2A · BESPOKE 3D THREE.JS ENGINE            PHASE 2B · BESPOKE 2D CLIP & BOARD     │
│    • /modules/scenarios/<id>/choreography.ts        • Free-form bespoke SVG+GSAP 2D      │
│    • /modules/scenarios/<id>/three/*                  animation per step (no template)   │
│    • Articulated props executing real state         • Bespoke /modules/scenarios/<id>/   │
│      changes in any visual style suited to it         excalidraw/ chalk whiteboards      │
│    • Frame-by-frame browser Director's Review       • Readable 1x pace (clipPace.ts)     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Permanent Benchmark Invariant

- **`process-hollowing`** (Process Hollowing & Cobalt Strike Beacon Loader — Armored Bank Truck & Bank Garage) is the permanent reference gold standard. Its bespoke story, 3D garage/road world, choreography engine, bespoke 2D clips, and bespoke Excalidraw boards MUST remain 100% untouched.
- Every rebuilt scenario MUST meet or exceed `process-hollowing` in mechanical clarity, Mute Test readability, Swap Test uniqueness, and 3-way Story ↔ 3D ↔ 2D alignment.

---

## 2. Mandatory Screenplay-First Workflow & Docs-Only Law

Before creating a single line of TypeScript or Three.js for any scenario, authors MUST complete the screenplay-first phase:

1. **Draft a Free-Form Creative Plan First (`MOD-17 §3 Principle 3`)**:
   - Store the plan under `/docs/screenplays/bespoke/<NNN>-<scenario-id>.md` (following exact Sidebar sequence number `#NNN`).
   - Describe the concept freely—Mute Test & Swap Test reasoning, 1-to-1 Technical ↔ Physical mapping, visual direction, and planned 3D/2D/Whiteboard structure—without forcing every scenario into one fixed visual aesthetic, act count, or shot-list template.
2. **Mandatory User Sign-Off Before Coding**:
   - Present the creative plan to the user and wait for explicit approval or revisions before creating any scenario code.
3. **Strict Docs-Only UI Exclusion Law**:
   - Screenplays and creative plans exist strictly as planning documents under `/docs/screenplays/`.
   - **Never** import, fetch, render, link, or reference `docs/screenplays` anywhere inside `/app/**` or `/components/**`.

---

## 3. Mandatory 3-Way Alignment Contract (Story ↔ 3D ↔ 2D)

Every scenario's **prose**, **bespoke 3D Three.js engine**, **bespoke 2D SVG+GSAP animation**, and **bespoke Excalidraw whiteboard** MUST depict the **exact same vulnerability mechanism** with zero contradictions and zero truncated labels—**and all 3D and 2D animations MUST be built in the most natural, physically grounded, and realistic visual form possible** (while keeping zero fixed structural or layout templates):

| Layer | Role & Perspective | Mandatory Requirements | Primary Source Files |
| :--- | :--- | :--- | :--- |
| **1. Technical & Real-World Story Copy** | Authentic forensic kill-chain paired with a 100% jargon-free physical story (`MOD-02`, `MOD-03`, `MOD-08`, `MOD-11`). | Story Analogy, `storyMappings`, `callouts`, and `phases` must describe the exact articulated props built in 3D (`findTechnicalJargonInStory() === []`). Never use auto-sliced strings that cut off mid-sentence. | `/modules/scenarios/<id>/index.ts` |
| **2. Bespoke 3D Three.js World & Choreography** | Dedicated photorealistic PBR 3D scene animating the literal physical state transitions of the attack (`MOD-09`, `MOD-10`, `MOD-17`). | Dedicated `choreography.ts` + realistic multi-part PBR props & procedural textures under `/modules/scenarios/<id>/three/`, natural lighting & believable surroundings, physically weighted motion, unobstructed sightlines, tailored camera presets, working `Cutaway` (`AUTO`/`OPEN`/`SEALED`) where applicable, lazy loading via `three-registry.ts`, deterministic `dispose()`. Zero fixed template; zero cartoon/toon shortcuts. | `/modules/scenarios/<id>/choreography.ts`, `/modules/scenarios/<id>/three/**`, `/modules/scenarios/three-registry.ts` |
| **3. Bespoke 2D SVG + GSAP Technical Animation & Whiteboard** | Natural, realistic kinetic 2D technical animation (`MOD-14`, never on `briefing`) + static chalk blueprint (`MOD-13`). | Realistic depth, refined shading/proportions, smooth physics-eased motion, zero fixed 2D layout template, GSAP-safe nested `<g>` transforms, `clipPace.ts` readable 1x pacing, unique `svgPrefix`, bare arrows (`ARROW_GAP >= 150`) and chalk hover tooltips on every teaching box. | `/components/technical-clip/clips/**`, `/modules/scenarios/<id>/excalidraw/**` |

### Strict 3D Spatial & Framing Guardrails

1. **Articulated Mechanisms & Rich Continuous Physical Motion**: Props must move, drive, brake, open, close, swap, scan, lock down, shred, or recast visibly across an unhurried timeline (**`>= 40s` for Overview**, **`>= 20–24s` for Step/Memory**)—never rely on static objects or brief hurried transitions that prevent reading.
2. **Strict Anti-Washout Lighting & Exposure**: Keep `RoomEnvironment` IBL, directional/hemisphere lights, fog density, and `UnrealBloomPass` cleanly restrained (`MOD-09 §1.3`) so light-mode scenes never blow out into milky white glare and every architectural material, vehicle, and plaque stays razor-sharp.
3. **Disjoint Ground Elevations (Zero Z-Fighting)**: Painted road lines, carpets, markings, and curbs sit at distinct vertical offsets (`>= 0.03` units above base terrain).
4. **Unobstructed Framing & Zero Truncation**: Keep overhead 3D signboards clear of the top-left HUD, keep all labels within safe viewport margins, and never truncate titles mid-word.
5. **Clean English Copy & Zero Clutter Particles**: Maintain 100% standard English signage/labels and zero distracting ambient sparkle/glitter particle clouds (`MOD-09`).

---

## 4. Anti-Patterns vs. Canonical Patterns

| Anti-Pattern (Do NOT Do This) | Canonical Pattern (DO This Instead) |
| :--- | :--- |
| Running `build-cinema-screenplays.ts` to batch-assign scenarios across 28 recycled places. | Author 1 bespoke episode per turn in Sidebar order with a user-approved Director's Blueprint (`MOD-17`). |
| Placing Kerberoasting in a Courthouse while its story text mentions a Grand Hotel, or repeating one hotel-guestbook story across OAuth, noPac, and Scattered Spider. | Design a dedicated physical mechanism unique to the vulnerability that passes both the **Mute Test** and **Swap Test**. |
| Reusing `scenario-world-composer.ts` with static left/right props and decorative glowing arcs. | Build a dedicated `/modules/scenarios/<id>/choreography.ts` and `/modules/scenarios/<id>/three/` with articulated props performing real state changes. |
| **Overview Station Slicing (`MOD-18` Violation)**: Importing Overview station builders (`buildStation()`, `buildVault()`, etc.) into `step-scene-builders.ts` and merely zooming or oscillating props with `Math.sin(t)`. | Give **every** section (`step-1..N` and `memory-forensics`) its own standalone room/set (`step-K-scene.ts`, `memory-diff-scene.ts`), `>= 2` exclusive articulated props, and an independent deterministic 3-phase choreography engine (`MOD-18`). |
| Exposing `/docs/screenplays/` markdown files or links inside React UI components. | Keep `/docs/screenplays/` strictly docs-only with zero references in `/app/**` or `/components/**`. |
| Modifying `process-hollowing` or weakening its visual benchmark. | Keep `process-hollowing` 100% untouched as the permanent Armored Bank Truck gold standard. |

---

## 5. Legacy Retired 28-Environment Registry (DEPRECATED — Scheduled for Phase 1 Code Removal)

> **DEPRECATION WARNING**: The 28 recycled template environments below were used by the **retired** batch generator (`scripts/build-cinema-screenplays.ts` and `scenario-world-composer.ts`). **DO NOT use this table for any new or rebuilt scenario.** It is retained here strictly as a historical deprecation manifest until Phase 1 Clean-Slate Code Cleanup deletes `lib/scenario-cinema-profiles-core.ts`, `components/three/scenes/cinema-stage-architectures.ts`, `components/three/scenes/real-world-heroes.ts`, and `lib/scenario-cinematic-uniqueness.test.ts` (`MOD-17 §2.2`).

| # | Legacy `SpatialSetArchetype` (Retired) | Legacy Setting Label | Legacy `HeroKineticMechanism` (Retired) | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `bank-branch-vault` | Downtown Bank Branch & Steel Vault | `bank-vault-wheel-door` | Deprecated (Retire in Phase 1) |
| 2 | `office-building-reception` | Glass Office Building & Front Reception | `office-reception-turnstile` | Deprecated (Retire in Phase 1) |
| 3 | `airport-terminal-gate` | International Airport Terminal & Boarding Gate | `commercial-passenger-airplane` | Deprecated (Retire in Phase 1) |
| 4 | `supermarket-retail-store` | Neighborhood Supermarket & Checkout Lanes | `supermarket-checkout-cart` | Deprecated (Retire in Phase 1) |
| 5 | `city-park-fountain` | City Park Plaza & Central Stone Fountain | `park-water-fountain-bench` | Deprecated (Retire in Phase 1) |
| 6 | `city-highway-toll-plaza` | Multi-Lane City Highway & Toll Plaza | `highway-toll-barrier-sedan` | Deprecated (Retire in Phase 1) |
| 7 | `city-street-intersection` | Downtown City Street Corner & Traffic Lights | `street-traffic-light-taxi` | Deprecated (Retire in Phase 1) |
| 8 | `train-station-platform` | Central Train Station & Express Platform | `express-station-locomotive` | Deprecated (Retire in Phase 1) |
| 9 | `subway-metro-station` | Underground Subway Metro & Fare Turnstiles | `subway-metro-turnstile-car` | Deprecated (Retire in Phase 1) |
| 10 | `hospital-triage-ward` | City Hospital Triage Desk & Patient Ward | `hospital-triage-med-cart` | Deprecated (Retire in Phase 1) |
| 11 | `post-office-sorting-hub` | Neighborhood Post Office & Mail Sorting Hub | `post-office-parcel-chute` | Deprecated (Retire in Phase 1) |
| 12 | `grand-hotel-lobby` | Grand Hotel Atrium & Concierge Desk | `hotel-concierge-key-rack` | Deprecated (Retire in Phase 1) |
| 13 | `shipping-port-container-yard` | Coastal Shipping Port & Container Pier | `harbor-gantry-cargo-ship` | Deprecated (Retire in Phase 1) |
| 14 | `factory-assembly-line` | Automated Factory Floor & Assembly Conveyor | `factory-conveyor-robot-arm` | Deprecated (Retire in Phase 1) |
| 15 | `public-library-archive` | City Public Library & Rare-Book Reading Hall | `library-rare-book-cage` | Deprecated (Retire in Phase 1) |
| 16 | `restaurant-kitchen-drivethru` | Busy Restaurant Kitchen & Drive-Thru Window | `restaurant-kitchen-order-rail` | Deprecated (Retire in Phase 1) |
| 17 | `cinema-theater-stage` | Downtown Cinema Theater & Projection Stage | `cinema-velvet-stage-curtain` | Deprecated (Retire in Phase 1) |
| 18 | `museum-gallery-hall` | National Art Museum Gallery & Glass Pedestals | `museum-laser-glass-pedestal` | Deprecated (Retire in Phase 1) |
| 19 | `courthouse-notary-hall` | City Courthouse Hall & Official Notary Seal Desk | `courthouse-wax-seal-bench` | Deprecated (Retire in Phase 1) |
| 20 | `coffee-shop-cafe` | Corner Coffee Shop & Co-Working Cafe | `cafe-espresso-bar-machine` | Deprecated (Retire in Phase 1) |
| 21 | `car-repair-garage` | Auto Repair Garage & Hydraulic Car Lift | `garage-hydraulic-car-lift` | Deprecated (Retire in Phase 1) |
| 22 | `university-exam-hall` | University Lecture & Exam Hall | `university-proctor-podium` | Deprecated (Retire in Phase 1) |
| 23 | `apartment-lobby-intercom` | Residential Apartment Lobby & Brass Intercom | `apartment-intercom-buzzer` | Deprecated (Retire in Phase 1) |
| 24 | `border-passport-control` | International Border Crossing & Passport Control | `border-passport-xray-gate` | Deprecated (Retire in Phase 1) |
| 25 | `broadcast-tv-studio` | Live TV Broadcast Studio & Roof Signal Dish | `broadcast-studio-signal-dish` | Deprecated (Retire in Phase 1) |
| 26 | `power-substation-waterworks` | Municipal Power Substation & Waterworks Yard | `substation-breaker-valve` | Deprecated (Retire in Phase 1) |
| 27 | `pharmacy-prescription-lab` | Neighborhood Pharmacy & Prescription Counter | `pharmacy-prescription-carousel` | Deprecated (Retire in Phase 1) |
| 28 | `warehouse-forklift-bay` | Logistics Warehouse & Forklift Loading Bay | `warehouse-pallet-forklift` | Deprecated (Retire in Phase 1) |

---

## 6. Authoring & Review Acceptance Checklist (`MOD-16`)

- [ ] **Creative Plan Approved**: Is the scenario's bespoke creative plan stored under `/docs/screenplays/bespoke/<NNN>-<id>.md` (docs-only, zero UI references) and approved by the user before coding?
- [ ] **Mute Test & Swap Test Passed**: Do articulated 3D props explain the exact mechanism silently without text, and does the physical world fail if transplanted onto another attack?
- [ ] **100% 3-Way Alignment**: Do Story text, 3D articulated props/signboards/cameras, 2D animations, and Excalidraw whiteboards match verbatim with zero contradictions or mid-sentence cutoffs?
- [ ] **Zero Overview Station Slicing (`MOD-18`)**: Does every Step (`step-1..N`) and `memory-forensics` 3D scene own a standalone bespoke 3D animation tailored to that step rather than cropping Overview stations?
- [ ] **Zero Legacy Factory Code**: Does the rebuilt scenario avoid `scenario-world-composer.ts` and the retired 28-place template pool?
- [ ] **Zero Story Jargon & Clean English**: Do all Story fields pass `findTechnicalJargonInStory() === []` and use clean standard English?
- [ ] **Benchmark Preserved**: Is `process-hollowing` completely untouched?
- [ ] **Director's Review Green**: Did real-browser frame-by-frame inspection at `1440×900` pass with zero clipping, zero overlap, readable motion, and zero console errors?
