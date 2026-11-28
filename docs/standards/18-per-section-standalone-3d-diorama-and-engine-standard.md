# Per-Section Standalone 3D Diorama, Micro-Screenplay & Independent Stage Engine Standard (`MOD-18`)

> **Module ID**: `MOD-18` · **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Peer Studio Standards**: [`MOD-16`](./16-dynamic-real-world-environment-and-screenplay-standard.md), [`MOD-17`](./17-bespoke-studio-redesign-pipeline-and-clean-slate-standard.md)  
> **Scope**: Mandatory standard governing **every individual Step (`step-1..N`) and Memory Forensics (`memory-forensics`) 3D stage** inside `/modules/scenarios/<id>/three/**`, `/modules/scenarios/<id>/choreography.ts`, `/lib/*-section-3d-descriptors.ts`, and `/docs/screenplays/bespoke/<NNN>-<id>.md`.  
> **Status**: Mandatory Permanent Standard · **Golden Reference Benchmark**: `process-hollowing` (`modules/scenarios/process-hollowing/three/step-scene-builders.ts`)

---

## 1. Root-Cause Diagnosis — The "Overview Slicing" Anti-Pattern

While **`MOD-16`** and **`MOD-17`** eliminated cross-scenario factory templates so every *scenario* receives its own bespoke Overview world, an internal audit of the first 10 rebuilt scenarios revealed a second-order structural failure **inside** each scenario's Step-by-Step 3D stages:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                 OVERVIEW SLICING ANTI-PATTERN vs. MOD-18 STANDALONE LAW                  │
├───────────────────────────────────────────┬──────────────────────────────────────────────┤
│  BENCHMARK: process-hollowing (MOD-18)    │  VIOLATION: Overview Slicing (FORBIDDEN)     │
├───────────────────────────────────────────┼──────────────────────────────────────────────┤
│  • Overview (`BankScene.tsx`): Continuous │  • Overview: Builds Stations A, B, C, D on   │
│    city/garage/highway/gate master film.  │    one shared room backdrop.                 │
│  • Step 1: Dedicated Dispatch Garage +    │  • Step 1: Drops ONLY Station A onto the     │
│    Console Desk + Freeze Switch + 2 new   │    EXACT same Overview backdrop at 1.25x     │
│    3D Master Keys + glowing tether arc.   │    scale with a new wall banner.             │
│  • Step 2: Dedicated Overhead X-Ray Arch  │  • Step 2: Drops ONLY Station B onto the     │
│    + Scan Cone + Wireframe + Rear Ramp.   │    EXACT same backdrop at 1.2x scale.        │
│  • Step 3: Dedicated Boarding Ramp +      │  • Step 3: Drops ONLY Station C onto the     │
│    Crimson Secret Bay + Tamper Sensor.    │    EXACT same backdrop + simple Math.sin().  │
│  • Step 4: Dedicated Runway + Floating    │  • Step 4: Drops Station C + D onto the      │
│    Holographic Cab Steering Wheel & GPS.  │    same backdrop with a boolean toggle.      │
│  • Step 5: Dedicated Checkpoint Gate +    │  • Result: Viewer feels they are watching    │
│    Saluting Guard + C2 Tower + TLS Arc +  │    zoomed-in, cropped fragments of the       │
│    Control-Room Radar Dish.               │    Overview instead of a focused deep-dive.  │
└───────────────────────────────────────────┴──────────────────────────────────────────────┘
```

### Why Overview Slicing Violates Pedagogical & Cinematic Craft

1. **Zero New Explanatory Depth**: Cropping and scaling an Overview station `1.2x` teaches the viewer **nothing** they did not already see in the Overview diorama. Each Step exists to zoom into a *different physical level of abstraction*—showing the micro-mechanisms, instruments, rooms, and forensic witnesses that are too granular to live inside the wide Overview film.
2. **Broken Multi-Phase Pacing**: Sliced step scenes routinely collapse into a single repetitive oscillation (`Math.sin(timeSec)`) instead of executing a real 3-phase cause-and-effect sequence (`Phase 1 Setup` → `Phase 2 Technical Mutation` → `Phase 3 Consequence / Forensic Witness`) synchronized to the step's `phases[]` timeline scrubber.
3. **Visual Fatigue & Repetition**: Re-rendering the exact same room backdrop, floor, and prop cluster 5–6 times across Overview, Steps 1–4, and Memory Forensics destroys the sense of progression through an intrusion kill chain.

---

## 2. The Core Law — Per-Section Standalone Realistic 3D Animation (No Slicing, No Fixed Template)

> **Supreme Per-Section Rule (`MOD-18`)**: Just as every **attack scenario** has its own bespoke 3D world (`MOD-17`), **EVERY SECTION within a scenario** (`briefing`, `step-1`, `step-2`, …, `step-N`, and `memory-forensics` when grounded) MUST have its own **standalone 3D animation crafted in the most natural, lifelike, and realistic form possible (`MOD-09`)**—never a lazy cropped slice of the Overview backdrop and never cartoonish/boxy shortcuts. **At the same time, there is NO fixed structural template**: duration, phase count, camera angles, and spatial form stay completely tailored to whatever teaches that step clearest.

### 2.1 Allowed Continuity vs. Strictly Forbidden Slicing

| Design Pattern | Allowed? | Exact Rule & Example |
| :--- | :--- | :--- |
| **Recurring Hero Actor / Vessel Continuity** | **YES (Encouraged)** | A single recurring hero actor or artifact may carry visual continuity across steps *provided it enters a brand-new, step-exclusive physical setting with step-specific mechanisms* (e.g., in `process-hollowing`, the Armored Bank Truck moves from a Dispatch Garage in Step 1 → an X-Ray Unloading Ramp in Step 2 → a Secret Bay Boarding Ramp in Step 3 → a Runway with Cab Steering/GPS in Step 4 → a Highway Gate + C2 Warehouse in Step 5). |
| **Cropping an Overview Station (`buildStationX()`)** | **FORBIDDEN** | Never assemble a Step scene by calling `buildOverviewBackdrop()` + 1 or 2 `buildStationX()` helpers from Overview at `scale.setScalar(1.2)`. |
| **Static/Oscillating Single-Loop `update()`** | **FORBIDDEN** | Every Step's `update()` should drive a real cause-and-effect progression synchronized to its timeline (using however many phases or beats naturally fit that step—no fixed phase count) rather than a trivial `Math.sin(t)` idle wobble. |
| **Cloned Overview Stations for Memory Forensics** | **FORBIDDEN** | `memory-forensics` MUST be a dedicated comparison/inspection scene contrasting baseline vs. compromised state, never two Overview stations duplicated left and right with a flat plane between them. |
| **Title-Only Backdrop Swaps** | **FORBIDDEN** | Changing only a wall sign on the shared Overview backdrop does NOT make a Step standalone. Each Step is free to choose its own spatial setting, visual style, lighting mood, and composition matching that step's exact mechanism. |

---

## 3. Mandatory Per-Section Architecture & File Layout

To prevent step scenes from collapsing into shallow wrappers inside a single small file, every new or retrofitted scenario package under `/modules/scenarios/<id>/three/` MUST follow this modular separation:

```text
/modules/scenarios/<id>/
├── index.ts                      # Scenario data, stages, telemetry, step guide
├── telemetry.ts                  # Authentic SIEM / Sysmon / Auditd / Zeek / CloudTrail logs
├── choreography.ts               # Pure deterministic timeline engines:
│                                 #   • evaluate<Id>OverviewChoreography(t, cutawayMode)
│                                 #   • evaluate<Id>Step1Choreography(t, cutawayMode)
│                                 #   • ...
│                                 #   • evaluate<Id>StepNChoreography(t, cutawayMode)
│                                 #   • evaluate<Id>MemoryDiffChoreography(t, cutawayMode) (if grounded)
├── choreography.test.ts          # Unit tests proving phase progression & cutaway for Overview AND every Step
└── three/
    ├── index.ts                  # Lazy-loaded factory routing sceneKind -> dedicated section builder
    ├── shared-cast.ts            # OPTIONAL: shared recurring hero actor/vessel primitives ONLY (never Overview rooms)
    ├── overview-scene.ts         # Full 5-Act Overview master diorama
    ├── step-1-scene.ts           # Standalone Step #1 set, exclusive articulated props & 3-phase animation
    ├── step-2-scene.ts           # Standalone Step #2 set, exclusive articulated props & 3-phase animation
    ├── step-3-scene.ts           # Standalone Step #3 set, exclusive articulated props & 3-phase animation
    ├── step-4-scene.ts           # Standalone Step #4 set, exclusive articulated props & 3-phase animation
    ├── step-N-scene.ts           # (If scenario has >4 steps)
    └── memory-diff-scene.ts      # (If memory-forensics is grounded) Dedicated side-by-side forensic lab
```

### Practical Engineering Guidelines (Open-Ended Design)

Every standalone section builder (`step-1-scene.ts` .. `step-N-scene.ts` and `memory-diff-scene.ts`) has **complete freedom in visual style, duration, phase count, prop count, and camera layout**, while following these clean engineering fundamentals:

1. **Dedicated Stage Identity**: Give the step its own visual setting, lighting, and spatial framing—distinct from simply reusing the Overview backdrop.
2. **Step-Specific Articulated Action**: Build bespoke articulated objects/mechanisms that directly demonstrate that step's exact technical cause and effect.
3. **Deterministic Readable Timeline Progression**: Back the animation with pure deterministic state math in `choreography.ts` aligned to the section's `descriptor.phases[]` intervals (**Overview `>= 40s`**, **standalone Step/Memory `>= 20–24s`** with rich multi-element physical motion and crisp anti-washout lighting per `MOD-09`—no rushed `15s` loops or trivial `Math.sin` placeholders).
4. **Cutaway Where Meaningful**: When the step involves an exterior cover and internal state (memory page, struct, container, sealed unit), honor `cutawayMode` (`AUTO` / `OPEN` / `SEALED`).
5. **Unobstructed Camera Views & Zero Washout**: Calibrate camera presets to that step's actual geometry with zero foreground occlusion, zero HUD overlap, and restrained anti-washout lighting/bloom (`MOD-09 §1.3`).
6. **Independent Mute Test & Clean `dispose()`**: The step's animation should read clearly even with labels hidden, and `dispose()` must free every geometry, material, and canvas texture created by that step.

---

## 4. Planning Per-Section 3D Ideas in Phase 0 (Free-Form)

When drafting a scenario's pre-code creative plan (`/docs/screenplays/bespoke/<NNN>-<scenario-id>.md`), include a brief free-form note for each section (`briefing`, `step-1..N`, and optional `memory-forensics`) explaining what makes that section's 3D animation visually and mechanically distinct from Overview—without forcing every section into a rigid `15s` / `0–5s / 5–10s / 10–15s` or fixed camera template.

---

## 5. Retrofit Audit Registry — Existing 10 Scenarios Requiring `MOD-18` Upgrade

The following 10 live scenarios were built prior to `MOD-18` and currently slice Overview stations inside their Step-by-Step 3D scenes. They MUST be upgraded **one scenario per turn** after user approval of each scenario's per-step micro-screenplay blueprint:

| # | Scenario ID | Code | Current Step-3D Status | Scope Required Under `MOD-18` |
| ---: | :--- | :--- | :--- | :--- |
| 1 | `amsi-reflective-dll` | `T1562.001 / T1620` | Partially sliced (Step 1 has custom bench/magnifier; Steps 2–4 slice Overview) | Full standalone sets & 3-phase engines for **Steps 2, 3, 4** (+ enrich Step 1 & Memory Lab) |
| 2 | `ransomware-shadow-wipe` | `T1486 / T1490` | 100% Overview-sliced (all 4 steps) | Full standalone sets & 3-phase engines for **Steps 1–4** |
| 3 | `3cx-desktopapp-supply-chain-lazarus` | `CVE-2023-29059` | 100% Overview-sliced (all 4 steps) | Full standalone sets & 3-phase engines for **Steps 1–4** (+ enrich Memory Lab) |
| 4 | `xz-utils-cve-2024-3094-backdoor` | `CVE-2024-3094` | 100% Overview-sliced (all 4 steps) | Full standalone sets & 3-phase engines for **Steps 1–4** (+ enrich Memory Lab) |
| 5 | `dfir-lsass-minidump-comsvcs-sysmon-eid10` | `T1003.001` | 100% Overview-sliced (all 4 steps) | Full standalone sets & 3-phase engines for **Steps 1–4** (+ enrich Memory Lab) |
| 6 | `ad-kerberoasting` | `T1558.003` | 100% Overview-sliced + trivial loops | Full standalone sets & 3-phase engines for **Steps 1–4** + Memory Lab |
| 7 | `zerologon-netlogon-cve-2020-1472` | `CVE-2020-1472` | 100% Overview-sliced + trivial loops | Full standalone sets & 3-phase engines for **Steps 1–4** + Memory Lab |
| 8 | `dfir-dcsync-drsuapi-replication-eid4662` | `T1003.006` | **COMPLETED (Photorealistic PBR Standalone)** | Full photorealistic PBR Overview (45s) + standalone PBR Steps 1–4 & Memory Comparison Plaza (24s each) |
| 9 | `log4shell-dfir` | `CVE-2021-44228` | 100% Overview-sliced + trivial loops | Full standalone sets & 3-phase engines for **Steps 1–4** + Memory Lab |
| 10 | `dns-tunneling-exfil` | `T1071.004` | 100% Overview-sliced + trivial loops | Full standalone sets & 3-phase engines for **Steps 1–4** + Memory Lab |

*(Note: `process-hollowing` (`#001`) already complies with `MOD-18` and remains the untouched permanent reference benchmark.)*

---

## 6. Per-Section Acceptance Checklist (`MOD-18`)

Before any new or retrofitted scenario passes Director's Review (`MOD-17 Principle 5`), verify **every** checkbox below across **every** Step and Memory section:

- [ ] **Zero Overview Station Slicing**: Does every Step (`step-1..N`) build its own dedicated 3D setting instead of copying and scaling a station from Overview onto the Overview backdrop?
- [ ] **Step-Specific Articulated Mechanisms**: Does every Step introduce bespoke animated mechanisms that literally demonstrate that step's technical cause and effect—designed freely without a fixed visual or structural template?
- [ ] **Deterministic Timeline Engine**: Does every Step call its own pure deterministic function in `choreography.ts` synchronized to its `descriptor.phases[]` beats (zero single-loop `Math.sin` placeholders)?
- [ ] **Unobstructed Cameras & Cutaway (when applicable)**: Are camera presets tailored to that step's geometry with zero occlusion, and does `Cutaway` reveal internal state wherever relevant?
- [ ] **Independent Step Mute Test & Swap Test**: Can each Step be understood silently with zero text, and is each Step's animation specific to that technical stage?
- [ ] **Standalone Memory Forensics Comparison (when grounded)**: Does `memory-forensics` stage a genuine forensic contrast between clean/hardened vs. live compromised state rather than cloning two Overview props?
- [ ] **Unit Tests & Browser Director's Review**: Does `choreography.test.ts` cover Overview AND every Step, and did real-browser visual inspection (`1440×900`) verify every Step across its timeline with zero clipping, zero HUD overlap, and clean `dispose()`?
