# Scenario-Adaptive 3D Storytelling & Cross-Scenario Rollout Playbook (`MOD-10`)

> **Module ID**: `MOD-10` · **Parent Index**: [`/docs/standards/README.md`](./README.md)  
> **Scope**: Architecture, metaphor diversity, bespoke 3D scene choreography, modular file layout, and incremental rollout workflow for upgrading additional Attack Explorer scenarios beyond `process-hollowing`.  
> **Status**: Mandatory Permanent Standard · Paired with `MOD-08` and `MOD-09`.

---

## 1. Core Principle — Natural, Realistic, Scenario-Adaptive Storytelling (Zero Fixed Template)

While the **UI container shell** (Story Card → Story-to-Technical Key → Full-Width 3D Stage → Numbered Technical Clauses) is standardized by `MOD-08` and **realism & WebGL lifecycle guardrails** are documented in `MOD-09`, **there is NO fixed layout template or choreography mold for 3D or 2D animations—and EVERY future 3D and 2D animation MUST be crafted in the most natural, lifelike, and realistic form possible**.

1. **Mandatory Natural & Realistic Visual Execution Across Future Animations**:
   - Every 3D scene must use physically based materials (`MeshStandardMaterial` / `MeshPhysicalMaterial`), realistic procedural textures, natural architectural/environmental depth, authentic real-world proportions, and physically believable motion (`MOD-09`).
   - Every 2D technical animation must likewise present natural depth, authentic surface shading, lifelike proportions, and smooth physics-eased transitions—never crude flat boxes, cartoon/toon shortcuts, or stiff mechanical jumps (`MOD-14`).
2. **No Uniform Template or Cloned Layout Across Scenarios**:
   - Do **not** force every scenario into a single stage layout, act-percentage split, or vehicle-on-a-road diorama.
   - Each attack class has fundamentally different mechanics (memory replacement vs. JNDI callback vs. offline ticket cracking vs. DNS query smuggling vs. backup shredding vs. supply-chain build tampering vs. multi-agent AI swarms). Its 3D world and 2D motion should organically embody **that exact mechanism** as naturally and realistically as possible.
3. **No Generic Abstract Placeholders**:
   - Do **not** substitute generic floating wireframe boxes, unlabeled cylinders, or abstract glowing octahedrons when real-world objects belong in the scene.
   - Every concrete object named in the scenario's `storyAnalogy` must appear as a realistic, multi-part 3D prop executing the exact physical action narrated in that step.
4. **Readable Duration, Rich Physical Motion & Anti-Washout Lighting (`MOD-09`)**:
   - **Overview 3D animations MUST run `>= 40` seconds** (recommended `40–50s`, roughly `8–10s` per act) and **standalone Step/Memory scenes `>= 20–24s`**, populated with continuous, lifelike multi-element interactions (moving vehicles, opening/closing doors & hatches, shuttle back-and-forth transit, scanning, lockdown, recasting) so learners have ample time to read every caption and grasp every interaction clearly.
   - Maintain crisp, balanced PBR lighting, restrained IBL/fog, and selective high-threshold bloom so scenes **never** wash out into white haze or glare (`MOD-09 §1.3`).
5. **Flexible Section Count & Scene Composition**:
   - A scenario with 3 stages registers 3 bespoke step scenes (`step-1`..`step-3`), not padded dummy steps; a scenario with 5 or 6 stages registers all of its real stages.
   - Register a `memory-forensics` 3D comparison scene **only** for scenarios that contain real documented `memoryBlocks` (per `MOD-04`). Never fabricate a virtual memory scene for a pure network, DNS, IAM, or SaaS scenario; instead, let those scenarios use whatever spatial setting makes their mechanism clearest.
   - Vary stage geometry and camera angles freely around the real-world subject matter: multi-tower urban vistas, architectural cross-sections, factory assembly floors, checkpoint corridors, server vaults, or relay bridges depending on what makes the mechanism unmistakable and lifelike at a glance.

---

## 2. Optional Domain-Adaptive Metaphor Inspiration (Non-Binding Examples)

The examples below are **strictly optional creative inspiration—NOT a fixed template or required mapping**. Authors are free to invent any original setting, visual style, or physical/technical representation that best explains the vulnerability:

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

## 3. Modular Code Architecture for Scaling 188 Bespoke Engines Cleanly (`MOD-17`)

To keep bundle size light and builds fast while scaling to 188 fully bespoke 3D worlds, isolate every scenario's creative code inside its own self-contained domain package under `/modules/scenarios/<scenario-id>/` and keep `/components/three/` strictly limited to the **shared playback shell**:

```
/modules/scenarios/<scenario-id>/
├── index.ts                              # Core AttackScenario + stepGuide + primary sources
├── choreography.ts                       # Pure deterministic 0%..100% prop & camera timeline
├── choreography.test.ts                  # Fast unit tests verifying act/prop transitions
└── three/                                # 100% bespoke hero props, environment & step dioramas
    ├── index.ts                          # Lazy entry loaded ONLY by three-registry.ts
    ├── scene-builders.ts                 # Bespoke articulated 3D prop & set builders (free visual style)
    └── step-scene-builders.ts            # Per-stage scenes + deterministic dispose()

/modules/scenarios/three-registry.ts      # Dynamic import() loader (only active scenario loads)

/components/three/                        # SHARED PLAYBACK SHELL ONLY (zero creative logic)
├── anime-toon-materials.ts               # Optional material/outline helpers (never mandatory)
├── AnimeSection3DStage.tsx               # Shared HUD + Cutaway + Timeline controls
└── ScenarioSection3DEmbed.tsx            # Shared standby preview + IntersectionObserver lazy mount
```

### Key Architectural Rules for Scaling (`MOD-17 §3 Principle 4`)

1. **Zero Shared Scene Composers**: Never route new or rebuilt scenarios through generic template builders (`scenario-world-composer.ts` and the retired 28-place pool are deprecated for Phase 1 removal).
2. **Keep Shared Shell Scenario-Agnostic**: `AnimeSection3DStage.tsx`, `ScenarioSection3DEmbed.tsx`, and `StandardStoryTechnicalSection.tsx` own only the player HUD, camera buttons, cutaway toggle, WebGL lifecycle, and lazy dynamic loading.
3. **100% Isolated Per-Scenario Geometry & Choreography**: Every scenario owns its own articulated models, timeline state machine, camera shot list, and `dispose()` cleanup inside `/modules/scenarios/<id>/`.

---

## 4. Step-by-Step Single-Episode Rollout Playbook (`MOD-17`)

Execute these **7 phases in strict order for ONE scenario at a time** (following exact Sidebar order in `/docs/redesign-backlog/MASTER-BACKLOG-SIDEBAR-ORDER.md`; batching multiple scenarios is strictly prohibited):

1. **Phase 1 — Research Preserved Sources & Design Technical Architecture**:
   - Load the scenario's preserved authoritative source URLs from `/docs/redesign-backlog/PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md`.
   - Design authentic kill-chain stages (`Stage 1..N`), real SIEM/Sysmon/CloudTrail/Auditd telemetry, CLI breakdowns, and confirm whether genuine documented `memoryBlocks` exist.
2. **Phase 2 — Pass Mute Test & Swap Test + Author Free-Form Creative Brief (`USER APPROVAL GATE`)**:
   - Invent a 1-to-1 physical mechanism world and visual direction that passes the **Mute Test** (clear with zero text) and **Swap Test** (fails if transplanted to another attack).
   - Write `/docs/screenplays/bespoke/<NNN>-<scenario-id>.md` outlining the visual concept, 1-to-1 Technical↔Physical mapping, and planned animation flow—using whatever act count, pacing, visual style, and camera plan fits the scenario (no fixed template; see `MOD-17 §3 Principle 3`).
   - **STOP and wait for explicit user approval or revisions before writing any code.**
3. **Phase 3 — Author Story & Technical Prose Together (`MOD-02`, `MOD-03`, `MOD-08`, `MOD-11`)**:
   - Write 100% jargon-free `briefing.storyAnalogy` and `steps[i].storyAnalogy` (`findTechnicalJargonInStory() === []`) matching the approved 3D cast verbatim.
   - Author 4 or 6 explicit `storyMappings` per section and per-token inline plain-English parentheticals in Step/Memory deep-dives while keeping Overview strictly roadmap-only (`Formula A2`).
4. **Phase 4 — Build Bespoke `choreography.ts` & 3D World (`MOD-09`, `MOD-10`)**:
   - Implement the pure timeline state machine + `choreography.test.ts` and bespoke articulated 3D props inside `/modules/scenarios/<id>/three/` in whatever visual style and material language fits the scenario best (unobstructed sightlines, zero clutter particles, clean English labels, unobstructed camera views, full `dispose()`).
   - Register lazily via dynamic `import()` in `/modules/scenarios/three-registry.ts`.
5. **Phase 5 — Build Bespoke 2D Animations & Excalidraw Chalk Boards (`MOD-13`, `MOD-14`, `MOD-15`)**:
   - Author free-form bespoke SVG+GSAP 2D technical animations (`step-1..N`, optional `memory-forensics`, never `briefing`) with no fixed visual or layout template, plus modular Excalidraw chalk boards (`briefing`, `step-1..N`, optional `memory-forensics`).
6. **Phase 6 — Automated Unit, Build & Lint Verification (`MOD-07`)**:
   - Run `npx --yes tsx --test modules/scenarios/<id>/choreography.test.ts lib/*.test.ts`, regenerate static scenario JSON + `llms-full.txt`, and verify `npm run build` and `npm run lint`.
7. **Phase 7 — Frame-by-Frame Browser Director's Review (`1440×900`, `MOD-17 §3 Principle 5`)**:
   - Capture key moments across the full timeline (`0%..100%`), camera views, Cutaway modes, 2D animations, and Excalidraw whiteboards in headless Chromium.
   - Verify zero geometry clipping, clear hero framing, zero HUD/signboard overlap, zero mid-sentence truncation, readable motion, visual Mute/Swap verification, and zero console/WebGL errors. Only then mark `COMPLETED` in the Master Backlog.

---

## 5. Rollout Acceptance Checklist (`MOD-10`)

- [ ] Was this scenario built individually (never batched) following a user-approved Director's Blueprint (`MOD-17`)?
- [ ] Does the physical world pass both the **Mute Test** and **Swap Test** (never cloned from `process-hollowing` or the retired 28-place template pool)?
- [ ] Do articulated 3D props execute literal physical state changes matching every stage's `storyAnalogy`?
- [ ] Is `memory-forensics` 3D added **only** if the scenario has genuine documented `memoryBlocks`?
- [ ] Are scenario-specific 3D models and choreography isolated in `/modules/scenarios/<id>/` with lazy dynamic loading and full `dispose()` cleanup?
- [ ] Did all automated tests, build, lint, and Frame-by-Frame Browser Director's Review (`1440×900`) pass with zero defects?
