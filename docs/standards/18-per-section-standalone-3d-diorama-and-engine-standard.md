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

## 2. The Core Law — Per-Section Standalone 3D World & Engine Mandate

> **Supreme Per-Section Rule (`MOD-18`)**: Just as every **attack scenario** has its own bespoke screenplay and custom 3D engine (`MOD-17`), **EVERY SECTION within a scenario** (`briefing`, `step-1`, `step-2`, …, `step-N`, and `memory-forensics` when grounded) MUST have its own **standalone 3D micro-screenplay, dedicated room/stage environment, exclusive step-specific articulated mechanisms, and independent deterministic choreography engine**.

### 2.1 Allowed Continuity vs. Strictly Forbidden Slicing

| Design Pattern | Allowed? | Exact Rule & Example |
| :--- | :--- | :--- |
| **Recurring Hero Actor / Vessel Continuity** | **YES (Encouraged)** | A single recurring hero actor or artifact may carry visual continuity across steps *provided it enters a brand-new, step-exclusive physical setting with brand-new articulated mechanisms* (e.g., in `process-hollowing`, the Armored Bank Truck moves from a Dispatch Garage with Master Keys in Step 1 → an X-Ray Unloading Ramp in Step 2 → a Secret Bay Boarding Ramp in Step 3 → a Runway with Holographic Cab Steering/GPS in Step 4 → a Highway Gate + C2 Warehouse + Radar Dish in Step 5). |
| **Cropping an Overview Station (`buildStationX()`)** | **FORBIDDEN** | Never assemble a Step scene by calling `buildOverviewBackdrop()` + 1 or 2 `buildStationX()` helpers from Overview at `scale.setScalar(1.2)`. |
| **Static/Oscillating Single-Loop `update()`** | **FORBIDDEN** | Every Step's `update(timeSec, phaseIndex, isDark, cutawayMode)` MUST drive a genuine **3-phase deterministic state machine** matching its `descriptor.phases[]` timestamps (`Phase 1` → `Phase 2` → `Phase 3`), with working `Cutaway` (`AUTO` / `OPEN` / `SEALED`) response. |
| **Cloned Overview Stations for Memory Forensics** | **FORBIDDEN** | `memory-forensics` MUST be a dedicated **Forensic Inspection / X-Ray Comparison Lab** (clean baseline artifact vs. live compromised memory artifact + active inspection instrument + forensic mismatch readout), never two Overview stations duplicated left and right with a flat plane between them. |
| **Title-Only Backdrop Swaps** | **FORBIDDEN** | Changing only the wall sign string on the shared Overview backdrop does NOT make a Step environment standalone. Each Step must have its own **spatial floor/architecture, lighting mood/accent, and stage layout** matching that specific step's real-world location (e.g., server rack room vs. security operations booth vs. offline GPU workshop vs. customs checkpoint). |

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

### Mandatory Per-Section Minimum Engineering Spec

Every standalone section builder (`step-1-scene.ts` .. `step-N-scene.ts` and `memory-diff-scene.ts`) MUST satisfy **all six** quantitative contracts:

1. **Dedicated Stage Architecture**: Own floor/platform geometry, architectural framing (rear-mounted at `z <= -2.2` per `MOD-09`), and step-appropriate environmental palette—distinct from the Overview wide room.
2. **Minimum Exclusive Hero Props (`>= 2`)**: At least **two articulated mechanical props/assemblies** built specifically for that step's exact technical action (never appearing in the Overview wide shot).
3. **Pure Deterministic 3-Phase Engine**: Backed by a dedicated exported function in `choreography.ts` (`evaluate<Id>Step<K>Choreography`) whose transitions align 1-to-1 with the `startSec..endSec` intervals of `descriptor.phases[0..2]`.
4. **Functional Cutaway Mode (`AUTO` / `OPEN` / `SEALED`)**: Every Step with an internal mechanism (memory page, registry/ACL struct, process handle, packet payload, ELF table, encryption header) MUST expose a real physical cutaway shell/panel/hood that responds to `cutawayMode`.
5. **Four Unobstructed Step-Specific Camera Presets**: `DIRECTOR`, `VIEW_A`, `VIEW_B`, `VIEW_C` calibrated directly to that step's custom prop coordinates (zero foreground pillar occlusion, zero HUD overlap).
6. **Independent Mute Test & Clean `dispose()`**: Hiding all labels in Step `K` alone must still communicate Step `K`'s exact technical cause-and-effect silently; `dispose()` must free every geometry, material, and canvas texture created by that step.

---

## 4. Mandatory Director's Blueprint Extension (Phase 0 Gate)

Starting immediately under `MOD-18`, every **Director's Blueprint** stored at `/docs/screenplays/bespoke/<NNN>-<scenario-id>.md` (required before coding per `MOD-17 §3 Principle 3`) MUST include a **Per-Section Standalone 3D Micro-Screenplay Plan** for **every** section (`briefing`, `step-1..N`, and optional `memory-forensics`) before user approval is requested:

```markdown
## 4B. Per-Section Standalone 3D Micro-Screenplays (MOD-18 Mandatory)

### Step #1 — <Step Title> (`<sceneKind>`)
- **Dedicated Room / Set**: <Distinct physical location & lighting mood — NOT the Overview backdrop>
- **Exclusive Step-Only Props (>= 2)**: <Articulated props built only for Step #1>
- **3-Phase Micro-Timeline (15s)**:
  - **Phase 1 (0–5s · Setup)**: <Physical setup action>
  - **Phase 2 (5–10s · Core Mechanism)**: <Exact articulated technical mutation>
  - **Phase 3 (10–15s · Consequence / Forensic Witness)**: <Observable forensic artifact or handoff>
- **Cutaway Reveal**: <What physical shell/panel opens under OPEN/AUTO>
- **Step-Level Mute Test Proof**: <1–2 sentences proving Step #1 reads silently on its own>
- **4 Camera Presets**: `DIRECTOR` (establishing) · `VIEW_A` (prop 1) · `VIEW_B` (mechanism close-up) · `VIEW_C` (forensic witness)

*(Repeat identically for Step #2 .. Step #N and Memory Forensics)*
```

**Hard Gate**: A Director's Blueprint that only specifies an Overview 5-Act screenplay and omits per-step standalone sets/props/timelines is **incomplete** and MUST NOT be approved for coding.

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
| 8 | `dfir-dcsync-drsuapi-replication-eid4662` | `T1003.006` | 100% Overview-sliced + trivial loops | Full standalone sets & 3-phase engines for **Steps 1–4** + Memory Lab |
| 9 | `log4shell-dfir` | `CVE-2021-44228` | 100% Overview-sliced + trivial loops | Full standalone sets & 3-phase engines for **Steps 1–4** + Memory Lab |
| 10 | `dns-tunneling-exfil` | `T1071.004` | 100% Overview-sliced + trivial loops | Full standalone sets & 3-phase engines for **Steps 1–4** + Memory Lab |

*(Note: `process-hollowing` (`#001`) already complies with `MOD-18` and remains the untouched permanent reference benchmark.)*

---

## 6. Per-Section Acceptance Checklist (`MOD-18`)

Before any new or retrofitted scenario passes Director's Review (`MOD-17 Principle 5`), verify **every** checkbox below across **every** Step and Memory section:

- [ ] **Zero Overview Station Slicing**: Does every Step (`step-1..N`) build its own dedicated physical stage/room instead of copying and scaling a station from Overview onto the Overview backdrop?
- [ ] **Exclusive Articulated Mechanisms (`>= 2` per Step)**: Does every Step introduce at least two step-exclusive articulated 3D props that literally embody that step's exact API, protocol, syscall, or forensic control?
- [ ] **Dedicated 3-Phase Choreography Engine**: Does every Step call its own pure deterministic `evaluate*StepKChoreography(t, cutawayMode)` function in `choreography.ts` synchronized to all 3 `descriptor.phases[]` beats (zero single-loop `Math.sin` placeholders)?
- [ ] **Working Cutaway & 4 Camera Presets**: Does `Cutaway` (`AUTO`/`OPEN`/`SEALED`) visibly reveal internal state, and are all 4 camera presets (`DIRECTOR`, `VIEW_A`, `VIEW_B`, `VIEW_C`) tailored to that step's geometry with zero occlusion?
- [ ] **Independent Step Mute Test & Swap Test**: Can each Step be understood silently with zero text, and is each Step's physical mechanism specific to that technical stage?
- [ ] **Standalone Memory Forensics Lab (when grounded)**: Does `memory-forensics` stage a genuine forensic inspection bench contrasting clean/hardened vs. live compromised state rather than cloning two Overview props?
- [ ] **Unit Tests & Browser Director's Review**: Does `choreography.test.ts` cover Overview AND every Step, and did real-browser visual inspection (`1440×900`) verify every Step across Phases 1–3 with zero clipping, zero HUD overlap, and clean `dispose()`?
