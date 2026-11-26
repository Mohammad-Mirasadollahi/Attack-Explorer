# Dynamic Real-World Physical Environment, Screenplay-First & 3-Way Alignment Standard (`MOD-16`)

> **Module ID**: `MOD-16` · **Parent Index**: [`/docs/standards/README.md`](./README.md)  
> **Scope**: Mandatory standard governing dynamic everyday real-world environments, docs-only screenplay-first authoring (`/docs/screenplays/**`), 3-way Story ↔ 3D Three.js ↔ 2D SVG+GSAP alignment, global visual uniqueness fingerprints, and catalog extensibility across all Attack Explorer scenarios.  
> **Status**: Mandatory Permanent Standard · **Reference Benchmark**: `process-hollowing` (Armored Bank Truck & Bank Garage) · **Enforced By**: `/lib/scenario-cinematic-uniqueness.test.ts`, `/lib/section-3d-registry.test.ts`, `/lib/technical-clips.test.ts`, and `/lib/documentation-standards.test.ts`.

---

## 1. Purpose & The Dynamic Physical World Law

Every cyber attack scenario in **Attack Explorer** must teach through a **distinct, tangible, everyday real-world physical environment** that learners already understand from daily life—such as a bank branch with a vault, a glass office building with a receptionist and meeting rooms, an international airport terminal with a boarding gate and parked passenger airplane, a neighborhood supermarket with stocked aisles and shopping carts, a city park with trees and a stone fountain, a multi-lane highway toll plaza, or a busy downtown street intersection.

Static dark rooms, generic floating server cubes, or cloned architectural templates across different scenarios are **strictly forbidden**. Just as cinema films each inhabit their own recognizable world, plot, lighting mood, and props, every scenario must dynamically construct and animate the **exact physical place described in its story** across both the **3D Three.js stage** and the **2D SVG + GSAP technical clip**.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                 MANDATORY 3-WAY DYNAMIC REAL-WORLD ALIGNMENT PIPELINE                    │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  PHASE 0 · SCREENPLAY-FIRST AUTHORING (DOCS-ONLY · STRICTLY EXCLUDED FROM UI)            │
│    • Write per-scenario screenplay in /docs/screenplays/<category>.md                    │
│    • Verify zero collisions in /docs/screenplays/README.md comparison matrix             │
│                                           │                                              │
│                                           ▼                                              │
│  PHASE 1 · REAL-WORLD STORY COPY (100% JARGON-FREE · RELATABLE DAILY EXPERIENCE)         │
│    • Overview briefing, Step 1..N analogies, Story-to-Technical Key, 3D phases/callouts  │
│    • Every step narrates concrete human actions inside that exact physical environment   │
│                                           │                                              │
│                  ┌────────────────────────┴────────────────────────┐                     │
│                  ▼                                                 ▼                     │
│  PHASE 2A · DYNAMIC 3D THREE.JS WORLD              PHASE 2B · DYNAMIC 2D TECHNICAL CLIP  │
│    • Real-world floor/terrain + buildings            • Exact 1-to-1 architectural motif  │
│    • Animated real-world hero vehicle/prop           • Technical/engineering perspective │
│    • Real-world overhead LED sign & plaques          • Distinct 2D color theme & layout  │
│    • 4 place-native camera presets                   • GSAP-safe nested <g> animations   │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Permanent Benchmark Invariant

- **`process-hollowing`** (Process Hollowing & Cobalt Strike Beacon Loader — Armored Bank Truck & Bank Garage) is the permanent reference gold standard. Its bespoke story, 3D garage/road world, and custom 2D clips MUST remain 100% untouched.
- Every other scenario in the catalog (and every future scenario added to the platform) MUST meet or exceed `process-hollowing` in narrative clarity, architectural recognizability, and 3-way Story ↔ 3D ↔ 2D alignment.

---

## 2. Mandatory Screenplay-First Workflow (Docs-Only Rule)

Before creating or modifying 3D geometry or 2D technical clips for any scenario, authors MUST complete the screenplay-first phase:

1. **Draft the Scenario Screenplay First**:
   - Specify the exact everyday physical setting (`realWorldPlace`, `settingLabel`), concrete human cast (`protagonist`, `targetAsset`, `untouchedControl`, `witness`), lighting atmosphere (`atmosphere`), camera angle (`cameraStyle`), animated 3D hero centerpiece (`heroKinetic`), 2D architectural motif (`clip2DStoryMotif`), 2D theme (`clip2DTheme`), 2D layout (`clip2DLayout`), and act-by-act visual beats.
   - Store the full screenplay under `/docs/screenplays/<NN-category>.md` and register its fingerprints in the global comparison matrix inside `/docs/screenplays/README.md`.
2. **Cross-Compare Before Building Visuals**:
   - Confirm that the new scenario's 3D fingerprint, 2D fingerprint, and film title do **not** collide with any existing scenario in `/docs/screenplays/README.md`.
3. **Strict Docs-Only UI Exclusion Law**:
   - Screenplays exist strictly as engineering and creative planning documents under `/docs/screenplays/`.
   - **Never** import, fetch, render, link, or reference `docs/screenplays` anywhere inside `/app/**` or `/components/**`. Automated CI tests fail immediately if any UI file references `docs/screenplays`.

---

## 3. Mandatory 3-Way Alignment Contract (Story ↔ 3D ↔ 2D)

Every scenario's **text**, **3D Three.js stage**, and **2D SVG+GSAP technical clip** MUST depict the **same concrete physical place** from complementary perspectives:

| Layer | Role & Perspective | Mandatory Requirements | Primary Source Files |
| :--- | :--- | :--- | :--- |
| **1. Real-World Story Copy** | Plain-language everyday story explaining **what happens** so any reader grasps the attack intuitively through familiar life experience. | Must mention the assigned real-world place keywords (`env.storyKeywords`) in both `briefing.storyAnalogy` and 3D `storyCue`; must pass `findTechnicalJargonInStory(text) === []`; must update `steps[1..N]`, `storyMappings`, `callouts`, `phases`, and static `/public/scenario-data/*.json`. | `/lib/scenario-real-world-stories.ts`, `/lib/scenario-step-guide-index.ts`, `/lib/section-3d-registry.ts`, `/scripts/build-cinema-screenplays.ts` |
| **2. Dynamic 3D Three.js Environment** | Full cinematic cel-shaded 3D world showing the **physical architecture, terrain, props, and story choreography** in motion. | Must render the literal physical place (`buildSpatialSetArchitecture`) and its 1-to-1 matched animated hero vehicle/prop (`buildHeroKineticMechanism`), with real-world overhead signboard (`cinema.settingLabel`), real-world station plaques (`cinema.castSummary`), clean phase labels (`1. Entry`, `2. Bypass`, `3. Audit`), and 4 place-native camera presets. Bespoke `MALWARE` worlds (other than `process-hollowing`) must hide generic rear walls and mount `buildRealWorldMalwareBackdrop` rearward (`z = -1.45`) with zero signboard overlap. | `/components/three/scenes/cinema-stage-architectures.ts`, `/components/three/scenes/real-world-heroes.ts`, `/components/three/scenes/scenario-world-composer.ts`, `/components/three/AnimeSection3DStage.tsx` |
| **3. Dynamic 2D SVG + GSAP Technical Clip** | Technical schematic perspective pairing the **exact same real-world place illustration** with live forensic/protocol mechanics (`14` kinetic engines). | `clip2DStoryMotif` MUST equal `spatialSet` 1-to-1 (except `memory-xray-microscope` on `memory-forensics` views). Must render a recognizable animated vector architectural view inside the theater panel (`Cinema2DStoryArt.tsx`), respect 1200×640 safe bounds (`y ∈ [38, 550]`), and never combine `className` and `transform="translate(...)"` on the same `<g>`. | `/components/technical-clip/malware-clips/Cinema2DStoryArt.tsx`, `/components/technical-clip/malware-clips/MalwareTechnicalClipRenderer.tsx`, `/lib/malware-2d-blueprints/compiler.ts` |

### Strict 3D Spatial & Framing Guardrails

1. **Zero Generic Gray Boxes**: If the story describes an airport, the 3D scene MUST build a tarmac with runway markings, glass terminal concourse, security arch, control tower, and an animated commercial passenger airplane. If the story describes an office building, it MUST build a multi-floor glass office facade with visible occupants in rooms, a wooden reception desk with a receptionist, and a glass badge turnstile.
2. **Disjoint Ground Elevations (Zero Z-Fighting)**: All painted road lines, zebra crosswalks, grass paths, velvet carpets, and concrete curbs must sit at distinct vertical offsets (`>= 0.03` units above base terrain) to prevent depth-buffer flicker.
3. **Unobstructed Framing & Bounds**: Keep overhead LED signboards clear of the top-left HUD (`x = 0, y ≈ 5.15, z ≈ -4.15`), keep grounded left/right station plaques within `x ∈ [-3.65, +3.65]` so labels never clip off the 16:9 viewport edge, and push `MALWARE` real-world backdrops rearward (`z = -1.45`) so roof marquees never collide with foreground overhead boards.
4. **Zero Japanese Characters & Zero Clutter Particles**: Maintain 100% English signage/labels and zero sparkle/glitter particle clouds (`MOD-09`).

---

## 4. Registered Dynamic Real-World Environment Catalog (28 Core Places + Extensibility)

All scenarios draw from (or extend) the typed real-world environment registry in `/lib/scenario-cinema-profiles-core.ts`. Each environment locks a **1-to-1 triad** (`SpatialSetArchetype` ↔ `HeroKineticMechanism` ↔ `Clip2DStoryMotif`):

| # | `SpatialSetArchetype` / `Clip2DStoryMotif` | Real-World Physical Setting | Matched 3D `HeroKineticMechanism` | Signature Architectural & Terrain Elements |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `bank-branch-vault` | Downtown Bank Branch & Steel Vault | `bank-vault-wheel-door` | Polished marble floor, classical pillared bank facade, teller windows, rotating spoked steel vault door |
| 2 | `office-building-reception` | Glass Office Building & Front Reception | `office-reception-turnstile` | Stone lobby, multi-story glass office rooms with visible staff silhouettes, wooden reception desk & receptionist, badge turnstile |
| 3 | `airport-terminal-gate` | International Airport Terminal & Boarding Gate | `commercial-passenger-airplane` | Runway tarmac with dashed centerline & yellow taxiway, glass concourse, X-ray security arch, control tower, commercial jet |
| 4 | `supermarket-retail-store` | Neighborhood Supermarket & Checkout Lanes | `supermarket-checkout-cart` | Bright retail tile, stocked colorful grocery aisle shelves, overhead store marquee, animated rolling shopping cart & checkout belt |
| 5 | `city-park-fountain` | City Park Plaza & Central Stone Fountain | `park-water-fountain-bench` | Lush green park grass, cream stone footpath, low-poly trees, park archway, multi-tier stone water fountain with animated droplets |
| 6 | `city-highway-toll-plaza` | Multi-Lane City Highway & Toll Plaza | `highway-toll-barrier-sedan` | Asphalt highway with yellow dashed lane dividers, overhead toll canopy & green lane lights, animated barrier arm & sedan |
| 7 | `city-street-intersection` | Downtown City Street Corner & Traffic Lights | `street-traffic-light-taxi` | Asphalt avenue, concrete sidewalk curb, white zebra crosswalk, corner storefronts & traffic signal, animated yellow city cab |
| 8 | `train-station-platform` | Central Train Station & Express Platform | `express-station-locomotive` | Platform concrete with yellow safety edge, arched station canopy, departure clock, animated streamlined express locomotive |
| 9 | `subway-metro-station` | Underground Subway Metro & Fare Turnstiles | `subway-metro-turnstile-car` | Subway platform with tactile yellow safety strip, tiled tunnel arch & route signs, animated metro railcar & fare turnstiles |
| 10 | `hospital-triage-ward` | City Hospital Triage Desk & Patient Ward | `hospital-triage-med-cart` | Clean clinical tile, hospital cross facade & triage reception counter, animated medical supply cart & patient bay |
| 11 | `post-office-sorting-hub` | Neighborhood Post Office & Mail Sorting Hub | `post-office-parcel-chute` | Sorting counter, wall of brass P.O. boxes, animated parcel sorting chute & mail bins |
| 12 | `grand-hotel-lobby` | Grand Hotel Atrium & Concierge Desk | `hotel-concierge-key-rack` | Marble floor with red velvet gold-trimmed VIP carpet, chandelier arch, animated concierge desk & room key rack |
| 13 | `shipping-port-container-yard` | Coastal Shipping Port & Container Pier | `harbor-gantry-cargo-ship` | Deep ocean water beneath elevated concrete dock pier with yellow hazard edge, stacked cargo containers, gantry crane & cargo vessel |
| 14 | `factory-assembly-line` | Automated Factory Floor & Assembly Conveyor | `factory-conveyor-robot-arm` | Industrial concrete deck, sawtooth factory bays, warning beacons, animated robotic assembly arm & moving conveyor belt |
| 15 | `public-library-archive` | City Public Library & Rare-Book Reading Hall | `library-rare-book-cage` | Warm hardwood floor, tall wooden bookshelves loaded with colored books, reading lamps, animated rare-book archive cage |
| 16 | `restaurant-kitchen-drivethru` | Busy Restaurant Kitchen & Drive-Thru Window | `restaurant-kitchen-order-rail` | Checkered diner tile, stainless steel kitchen pass-through window & menu board, animated order ticket rail & serving pass |
| 17 | `cinema-theater-stage` | Downtown Cinema Theater & Projection Stage | `cinema-velvet-stage-curtain` | Plush crimson cinema carpet & red velvet runner, ticket booth, marquee lights, animated velvet stage curtain & projector |
| 18 | `museum-gallery-hall` | National Art Museum Gallery & Glass Pedestals | `museum-laser-glass-pedestal` | Polished marble gallery floor, framed paintings & velvet stanchions, animated glass display pedestal with laser grid |
| 19 | `courthouse-notary-hall` | City Courthouse Hall & Official Notary Seal Desk | `courthouse-wax-seal-bench` | Marble civic hall, stately courthouse columns & judge bench, animated brass notary wax-seal desk & ledger |
| 20 | `coffee-shop-cafe` | Corner Coffee Shop & Co-Working Cafe | `cafe-espresso-bar-machine` | Warm hardwood floor, brick & chalkboard cafe menu wall, pendant lamps, animated espresso machine & pickup counter |
| 21 | `car-repair-garage` | Auto Repair Garage & Hydraulic Car Lift | `garage-hydraulic-car-lift` | Concrete service bay floor, open roller garage doors & tool wall, animated hydraulic car lift raising a coupe |
| 22 | `university-exam-hall` | University Lecture & Exam Hall | `university-proctor-podium` | Hardwood lecture floor, tiered chalkboards & lecture rows, animated exam proctor podium & hall clock |
| 23 | `apartment-lobby-intercom` | Residential Apartment Lobby & Brass Intercom | `apartment-intercom-buzzer` | Architectural stone lobby, brass resident mailboxes & glass vestibule door, animated buzzing brass intercom panel |
| 24 | `border-passport-control` | International Border Crossing & Passport Control | `border-passport-xray-gate` | Asphalt border lane, dual inspection booths & overhead canopy, animated passport X-ray gate & boom barrier |
| 25 | `broadcast-tv-studio` | Live TV Broadcast Studio & Roof Signal Dish | `broadcast-studio-signal-dish` | Dark studio floor, illuminated newsroom screens & ON-AIR sign, animated anchor desk & rotating roof signal dish |
| 26 | `power-substation-waterworks` | Municipal Power Substation & Waterworks Yard | `substation-breaker-valve` | Concrete utility yard, perimeter fence & high-voltage ceramic insulators, animated municipal breaker & utility valve |
| 27 | `pharmacy-prescription-lab` | Neighborhood Pharmacy & Prescription Counter | `pharmacy-prescription-carousel` | Bright pharmacy tile, backlit green cross emblem & medicine shelves, animated prescription dispensing carousel |
| 28 | `warehouse-forklift-bay` | Logistics Warehouse & Forklift Loading Bay | `warehouse-pallet-forklift` | Concrete dock floor, towering blue-and-orange steel pallet racks stacked with boxes, animated yellow pallet forklift |

### Dynamic Extensibility Protocol (Adding Places #29+)

Whenever future scenarios introduce attack concepts that deserve a fresh physical setting (or whenever existing places approach their per-place reuse cap), authors MUST expand the real-world environment catalog rather than forcing a poor fit:

1. Add the new union member to `SpatialSetArchetype`, `HeroKineticMechanism`, and `Clip2DStoryMotif` in `/lib/scenario-cinema-profiles-core.ts`, and register its metadata (`placeName`, `shortPlace`, `heroKinetic`, `cameraLabels`, `storyKeywords`) in `REAL_WORLD_ENVIRONMENTS`.
2. Add its rich everyday story template to `PLACE_STORY_TEMPLATES` in `/scripts/build-cinema-screenplays.ts`.
3. Build its unmistakable 3D architectural environment and floor/terrain in `/components/three/scenes/cinema-stage-architectures.ts`.
4. Build its animated 3D hero vehicle/prop in `/components/three/scenes/real-world-heroes.ts`.
5. Build its matching 2D animated vector architectural illustration in `/components/technical-clip/malware-clips/Cinema2DStoryArt.tsx`.
6. Update the expected environment/hero/motif count assertions in `/lib/scenario-cinematic-uniqueness.test.ts`.

---

## 5. Global Uniqueness & Anti-Collision Laws

To guarantee that no two scenarios ever look or feel like duplicates across the entire catalog, the generator and CI test suite strictly enforce four mathematical uniqueness invariants:

1. **3D Uniqueness Fingerprint (`Zero Collisions`)**:
   - Tuple: `atmosphere | spatialSet | heroKinetic` MUST be globally unique across 100% of scenarios.
2. **2D Uniqueness Fingerprint (`Zero Collisions`)**:
   - Tuple: `clip2DTheme | clip2DStoryMotif | clip2DLayout` MUST be globally unique across 100% of scenarios.
3. **1-to-1 Cross-Layer Lock**:
   - For every scenario: `profile.heroKinetic === REAL_WORLD_ENVIRONMENTS[profile.spatialSet].heroKinetic` and `profile.clip2DStoryMotif === profile.spatialSet`.
4. **Unique Film Title & Balanced Environment Distribution**:
   - `filmTitle` (case-insensitive) MUST be unique across all scenarios.
   - Distribute scenarios evenly across all registered real-world places (`count <= 9` per place across 18 atmospheres) so every place retains fresh atmosphere lighting and camera framing.

---

## 6. Step-by-Step Operational Workflow for New or Upgraded Scenarios

Execute these exact steps whenever adding a new scenario or upgrading an existing one:

1. **Assign a Fitting Real-World Environment**:
   - Pick an existing real-world place from `REAL_WORLD_ENVIRONMENTS` whose everyday mechanics naturally mirror the attack (or add a new environment #29+ following §4).
   - Register any bespoke flagship override in `FLAGSHIP_PLACE_OVERRIDES` inside `/scripts/build-cinema-screenplays.ts` if desired.
2. **Regenerate Screenplays, Cinema Profiles, Real-World Stories & Static Payloads**:
   ```bash
   npx --yes tsx scripts/build-cinema-screenplays.ts
   node scripts/generate-scenario-data.mjs
   ```
   - This atomically updates `/docs/screenplays/README.md`, `/docs/screenplays/*.md`, `/lib/scenario-cinema-profiles.ts`, `/lib/scenario-real-world-stories.ts`, and all `/public/scenario-data/*.json` payloads while verifying zero technical jargon in every generated story string.
3. **Verify Automated CI Gates**:
   ```bash
   npx --yes tsx --test lib/scenario-cinematic-uniqueness.test.ts lib/section-3d-registry.test.ts lib/technical-clips.test.ts lib/documentation-standards.test.ts
   npm run build
   npm run lint
   ```
4. **Run Real-Browser Visual Verification (`1440×900`)**:
   - Open `/scenarios/<id>` in headless Chromium (`playwright-cli`), inspect the rendered 3D stage (confirming recognizable real-world architecture, animated hero prop, overhead signboard, grounded plaques inside bounds, 4 place-native cameras, and zero overlap), click **Play technical clip** on Stage 1 (confirming matching 2D real-world illustration and zero clipped labels), and confirm zero browser console errors.

---

## 7. Anti-Patterns vs. Canonical Patterns

| Anti-Pattern (Do NOT Do This) | Canonical Pattern (DO This Instead) |
| :--- | :--- |
| Putting multiple scenarios in identical dark sci-fi rooms or abstract floating server boxes. | Assign each scenario a concrete everyday physical world (Airport, Glass Office, Bank, Supermarket, Park, Highway, Train Station, etc.) and build its literal 3D architecture and 2D schematic motif. |
| Telling a Bank or Airport story in the text while rendering unrelated generic props or legacy titles on the 3D overhead signboard. | Enforce 3-way Story ↔ 3D ↔ 2D alignment: overhead signboard (`cinema.settingLabel`), plaques (`cinema.castSummary`), camera presets, 3D architecture, 3D hero prop, and 2D illustration all match the story verbatim. |
| Coding 3D or 2D visuals first without checking similarity against other scenarios. | Follow Screenplay-First authoring: generate/update `/docs/screenplays/` and validate zero 3D and 2D fingerprint collisions before verifying visuals. |
| Exposing `/docs/screenplays/` markdown files or links inside React UI components. | Keep `/docs/screenplays/` strictly docs-only and enforce zero UI references via `/lib/scenario-cinematic-uniqueness.test.ts`. |
| Leaving `MALWARE` worlds with a generic dark rear backdrop wall when their story takes place in a Supermarket or City Park. | Hide `generic-rear-backdrop-wall` on non-`process-hollowing` `MALWARE` worlds and mount `buildRealWorldMalwareBackdrop` at `z = -1.45` so the real-world place frames the stage with zero signboard overlap. |
| Allowing technical API names, hex flags, or command lines to leak into everyday Story paragraphs. | Keep all Story fields 100% plain English (`findTechnicalJargonInStory(text) === []`) and place technical translations exclusively inside `storyMappings[].technicalTerm` and Technical clauses. |
| Modifying `process-hollowing` to match the generic generator overlay. | Always exempt `process-hollowing` so the Armored Bank Truck benchmark remains 100% preserved. |

---

## 8. Authoring & Review Acceptance Checklist (`MOD-16`)

Before merging any new scenario or visual environment change, confirm every item below:

- [ ] **Screenplay-First & Docs-Only**: Is the scenario documented in `/docs/screenplays/<category>.md` and indexed in `/docs/screenplays/README.md`, with zero references to `docs/screenplays` inside `/app/**` or `/components/**`?
- [ ] **Dynamic Real-World Place Assigned**: Does the scenario take place in a recognizable everyday physical world (from the 28 core environments or a newly registered #29+ environment) rather than an abstract dark box?
- [ ] **3-Way Story ↔ 3D ↔ 2D Alignment**: Do the Story Analogy (`briefing` + `steps[1..N]`), 3D Three.js architecture + animated hero prop + signboards + camera presets, and 2D SVG+GSAP architectural motif all depict that exact same physical place?
- [ ] **Global Uniqueness Verified**: Are the 3D fingerprint (`atmosphere|spatialSet|heroKinetic`), 2D fingerprint (`clip2DTheme|clip2DStoryMotif|clip2DLayout`), and `filmTitle` 100% unique across the catalog?
- [ ] **Zero Story Jargon & Zero Japanese Characters**: Do all Story fields pass `findTechnicalJargonInStory() === []` and contain zero Japanese characters?
- [ ] **Benchmark Preserved**: Is `process-hollowing` completely untouched as the Armored Bank Truck reference standard?
- [ ] **Static Data & Automated Gates Green**: Were `/public/scenario-data/*.json` regenerated, and do `lib/scenario-cinematic-uniqueness.test.ts`, `lib/section-3d-registry.test.ts`, `lib/technical-clips.test.ts`, `lib/documentation-standards.test.ts`, `npm run build`, `npm run lint`, and a `1440×900` live browser inspection all pass?
