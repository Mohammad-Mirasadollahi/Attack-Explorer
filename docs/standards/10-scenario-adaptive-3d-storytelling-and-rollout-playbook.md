# Scenario-Adaptive 3D Storytelling & Cross-Scenario Rollout Playbook (`MOD-10`)

> **Module ID**: `MOD-10` · **Parent Index**: [`/docs/standards/README.md`](./README.md)  
> **Scope**: Architecture, metaphor diversity, bespoke 3D scene choreography, modular file layout, and incremental rollout workflow for upgrading additional Attack Explorer scenarios beyond `process-hollowing`.  
> **Status**: Mandatory Permanent Standard · Paired with `MOD-08` and `MOD-09`.

---

## 1. Core Principle — Scenario-Adaptive Storytelling (Never Copy-Paste One Structure)

While the **UI container shell** (Story Card → Story-to-Technical Key → Numbered Technical Clauses → Full-Width 3D Stage) is standardized by `MOD-08` and the **cel-shaded visual craft** is standardized by `MOD-09`, **the 3D world, props, layout, and animation choreography MUST be uniquely designed for each scenario's technical nature and story**.

1. **No Uniform 3D Template Across Scenarios**:
   - Do **not** force every scenario into a vehicle-on-a-road diorama or reuse the Armored Bank Truck outside Process Hollowing.
   - Each attack class has fundamentally different mechanics (memory replacement vs. JNDI callback vs. offline ticket cracking vs. DNS query smuggling vs. backup shredding vs. supply-chain build tampering vs. multi-agent AI swarms). Its 3D world must physically embody **that exact mechanism**.
2. **No Generic Abstract Placeholders**:
   - Do **not** substitute generic floating wireframe boxes, unlabeled cylinders, or abstract glowing octahedrons when a real physical story prop belongs in the scene.
   - Every concrete object named in the scenario's `storyAnalogy` must appear as a recognizable cel-shaded 3D prop executing the exact physical action narrated in that step.
3. **Flexible Section Count & Scene Composition**:
   - A scenario with 3 stages registers 3 bespoke step scenes (`step-1`..`step-3`), not padded dummy steps; a scenario with 5 or 6 stages registers all of its real stages.
   - Register a `memory-forensics` 3D comparison scene **only** for scenarios that contain real documented `memoryBlocks` (per `MOD-04`). Never fabricate a virtual memory scene for a pure network, DNS, IAM, or SaaS scenario; instead, let those scenarios shine with network corridor, identity vault, or cloud pipeline dioramas.
   - Vary stage spatial staging naturally: side-by-side X-ray comparisons, multi-room cross-sections, conveyor assembly lines, checkpoint corridors, multi-floor buildings, or multi-hop relay bridges depending on what makes the mechanism unmistakable at a glance.

---

## 2. Domain-Adaptive 3D Metaphor & Choreography Matrix

Use the matrix below as a creative blueprint when designing bespoke 3D worlds for other attack categories. Each family chooses a physical setting and hero prop set native to its actual attack mechanics:

| Attack Domain / Scenario Archetype | Native Physical Story World | Bespoke 3D Hero Props & Literal Physical Choreography | Spatial Layout Archetype |
| :--- | :--- | :--- | :--- |
| **Process Hollowing & Memory Injection** (Reference: `process-hollowing`) | Armored Bank Truck, Dispatch Garage, Checkpoint Gate & Factory X-Ray | Composite Armored Bank Truck with cutaway cargo hold, cryo freeze dome, gold bullion crates, boarding covert crew, cab GPS dial, checkpoint barrier, and dual side-by-side X-ray trucks. | Garage Bay → Runway → Checkpoint → Dual X-Ray Comparison |
| **Web / Deserialization / JNDI Callbacks** (e.g., `log4shell-dfir`) | Corporate Lobby Guestbook Desk, Exterior Telephone Switchboard & Back-Door Courier | Receptionist behind marble desk reading a glowing guestbook slip, automated red rotary phone dialing an external courier van, sealed parcel sliding through the lobby window, and a side exit opening into a command tunnel. | Split Interior Lobby ↔ Exterior Street & Courier Hub |
| **Active Directory & Kerberos Attacks** (e.g., `ad-kerberoasting`) | Theme Park Ticket Booth, Sealed VIP Vouchers & Underground Safe-Cracking Workbench | Domain ticket kiosk issuing wax-sealed golden VIP vouchers, visitor carrying voucher offline to a spinning mechanical combination-dial cracker rig, then walking straight through the VIP vault door with a forged master pass. | Park Ticket Kiosk → Offline Vault Lab → Server Room Door |
| **DNS Tunneling & Covert Egress** (e.g., `dns-tunneling-exfil`) | Locked-Down Prison Facility, Permitted Operator Switchboard & Outside Accomplice Directory | Sealed prison cell with bricked-up mail slot (blocked HTTP/HTTPS), inmate passing chopped micro-notes to an unsuspecting switchboard operator who calls out coded directory names across the prison wall to an outside receiver assembling a blueprint puzzle. | Walled Compound ↔ Operator Relay Booth ↔ External Listening Desk |
| **Ransomware & Backup Destruction** (e.g., `ransomware-shadow-wipe`) | Corporate Records Office, Back-Room Microfilm Archive & Padlock Assembly | Back-room backup reels feeding into a roaring industrial paper shredder (`vssadmin delete shadows`), followed by rapid mechanical arms snapping glowing crimson padlocks onto rows of filing cabinets and pinning a ransom notice to the main glass door. | Archive Storage Room → Open Records Floor |
| **In-Memory Security Bypass & Reflective Loading** (e.g., `amsi-reflective-dll`) | Jewelry Vault X-Ray Counter & Mid-Air Tool Assembly | Airport-style security X-ray belt whose monitor wire gets clipped with a glowing jumper bypass (`BAG IS CLEAN`), while an intruder assembles a shining lockpick mid-air inside a glass chamber without anything ever touching the floor (disk). | Inspection Counter Cross-Section + Mid-Air Assembly Chamber |
| **Supply Chain, Package Registry & CI/CD** (e.g., `rspack-solana-web3js-npm-supply-chain-2024`) | Automated Factory Conveyor, Stolen Foreman Badge & Tampered Shipping Crate | Stolen publish badge unlocking a robotics bay on an automated assembly line, swapping one clean microchip on a moving conveyor belt for a glowing covert transmitter before sealed crates ship out to customer build docks. | Linear Factory Conveyor Belt → Distribution Docks |
| **Kernel, Firmware & BYOVD Rootkits** | Courthouse High Bench, Signed Bailiff Medallion & Hidden Trapdoor | Legitimate but cracked brass bailiff medallion granting entry past the courtroom security scanner, unlocking a hidden floor panel directly beneath the judge's bench (Ring 0) to silence courtroom cameras and logbooks. | Two-Level Cutaway (User-Mode Floor Above / Kernel Vault Below) |
| **Cloud, IAM & Kubernetes Breakouts** | Orbital Badge Airlock, Shipping Container Pier & Control Tower | Misconfigured maintenance hatch inside a stacked shipping container letting an intruder climb up to the pier crane's master control deck and mint universal transit badges for neighboring docks. | Multi-Tier Container Stack & Bridge Control Tower |
| **AI / Multi-Agent LLM Attacks** (e.g., `jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr`) | High-Speed Robotic Swarm Vault & Automated Blast-Door Defense Grid | Central planner console dispatching 8 synchronized robotic arms simultaneously testing door handles, prying a side window, and reaching for a central key vault—cut off mid-reach by heavy steel Defender blast doors slamming shut automatically. | Radial Hub-and-Spoke Vault with Timed Blast Doors |

---

## 3. Modular Code Architecture for Scaling Beyond Process Hollowing

To keep code clean, maintainable, and bundle-efficient as more scenarios receive bespoke 3D scenes, follow this strict modular file structure:

```
/lib/
├── section-3d-registry.ts                # Core interfaces, validators, central scenario lookup
└── section-3d-registries/                # Per-domain descriptor modules (added as scenarios roll out)
    ├── log4shell-3d-registry.ts          # Example: Web/JNDI scenario descriptors
    ├── kerberoasting-3d-registry.ts      # Example: Active Directory scenario descriptors
    └── ...

/components/three/
├── anime-toon-materials.ts               # Shared cel-shading ramp, ink outlines, scan shaders
├── AnimeSection3DStage.tsx               # Shared Overview-standard 3D stage + HUD + Bloom + controls
├── ScenarioSection3DEmbed.tsx            # Shared standby preview + IntersectionObserver lazy mount
├── hollowing-scene-builders.ts           # Scenario-specific hero prop builders (Armored Bank Truck)
├── hollowing-step-scene-builders.ts      # Scenario-specific step dioramas (Process Hollowing)
└── scenes/                               # Future per-scenario modular builders (lazy-imported)
    ├── log4shell-scene-builders.ts       # Receptionist lobby + courier van builders
    ├── kerberoasting-scene-builders.ts   # Ticket booth + offline cracker builders
    └── ...
```

### Key Architectural Rules for Scaling

1. **Keep Shared Engine Decoupled from Scenario Worlds**: `AnimeSection3DStage.tsx`, `ScenarioSection3DEmbed.tsx`, and `StandardStoryTechnicalSection.tsx` stay 100% scenario-agnostic; they read metadata (`storyMappings`, `callouts`, `phases`, `cameraPresets`, `durationSec`) purely from `Section3DDescriptor`.
2. **Isolate Scenario-Specific Geometry & Shaders**: Never cram multiple unrelated scenarios into `hollowing-step-scene-builders.ts`. Place each new scenario's reusable hero props and step scenes in its own dedicated module under `/components/three/scenes/` and dispatch cleanly by `sceneKind`.
3. **Graceful Progressive Rollout**: Scenarios not yet upgraded continue to render cleanly with their structured Story + Technical cards (with zero broken layouts or empty canvases) until their bespoke descriptors and 3D scene builders are registered.

---

## 4. Step-by-Step Rollout Playbook for Upgrading Any Remaining Scenario

Execute these 6 phases in order whenever upgrading a scenario to the full `MOD-08` + `MOD-09` + `MOD-10` standard:

1. **Phase 1 — Design the Continuous Metaphor World**:
   - Audit the scenario's real kill-chain stages (`Stage 1..N`) and confirm whether it has documented `memoryBlocks`.
   - Choose one memorable, concrete physical metaphor world that maps cleanly onto every stage without forcing technical concepts into unnatural shapes.
2. **Phase 2 — Rewrite Story & Technical Prose (`MOD-02`, `MOD-03`, `MOD-08`)**:
   - Rewrite `briefing.storyAnalogy` and every `steps[i].storyAnalogy` in `/lib/step-guides/*.ts` to be 100% jargon-free, continuous storytelling (`findTechnicalJargonInStory() === []`).
   - Author 4 explicit `storyMappings` per section (`briefing`, `step-1..N`, and optional `memory-forensics`).
   - Update `steps[i].simpleExplanation` and `stages[i].description` so technical clauses explicitly bridge back to the exact story objects while preserving inline purpose parentheticals (`> 25 chars`) and forensic accuracy.
   - Verify `briefing.storyAnalogy` and `briefing.plainSummary` are completely distinct (zero duplicated sentences).
3. **Phase 3 — Register Descriptors (`Section3DDescriptor`)**:
   - Define `stageBadge`, `mitreId`, `title`, `storyCue`, `technicalCue`, `storyMappings`, `callouts` (jargon-free title + technical subtitle), `phases` (2–6 acts matching the step's real beats), and `4 cameraPresets`.
4. **Phase 4 — Build Bespoke Cel-Shaded 3D Scenes (`MOD-09`, `MOD-10`)**:
   - Create scenario-specific hero prop builders reusing `anime-toon-materials.ts` (toon shading, ink outlines, selective bloom, zero glitter/dust particles, zero Japanese characters).
   - Animate every physical beat described in the story with rear-mounted scenery (zero foreground pillars blocking hero props) and clean signboard/callout clearances.
   - Implement deterministic `dispose()` cleanup for all dynamically created textures, materials, and geometries.
5. **Phase 5 — Automated Unit & Guardrail Verification (`MOD-07`, `MOD-08`)**:
   - Add the upgraded scenario to `/lib/section-3d-registry.test.ts` so CI verifies: zero jargon in story fields, `>= 4` `storyMappings` per section, zero Japanese characters, distinct `storyAnalogy` vs. `plainSummary`, and valid phase timing coverage.
   - Run `npx --yes tsx --test lib/*.test.ts`, `npm run build`, and `npm run lint`.
6. **Phase 6 — Real-Browser Visual Audit (`1440×900`)**:
   - Inspect the rendered Briefing, key Stages, Main Page Inspector, and optional Memory Forensics view in Playwright at `1440×900`.
   - Confirm: Story-first order, visible Story-to-Technical Key, zero duplicate text, zero foreground pillar occlusion, zero label/signboard overlap, zero glitter/dust particles, and zero console errors.

---

## 5. Rollout Acceptance Checklist (`MOD-10`)

- [ ] Does the scenario use a physical metaphor world uniquely suited to its real attack mechanics (not cloned from Process Hollowing)?
- [ ] Do the 3D scenes animate the literal physical actions narrated in each stage's `storyAnalogy`?
- [ ] Is `memory-forensics` 3D added **only** if the scenario has documented `memoryBlocks`?
- [ ] Are scenario-specific 3D builders isolated in their own modular file with proper `dispose()` cleanup?
- [ ] Do all automated tests (`lib/*.test.ts`), build, lint, and Playwright visual checks pass with zero errors?
