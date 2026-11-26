# Unified Scenario-Based 3D Anime, 2D Kinetic Clip & Excalidraw Whiteboard Authoring Handbook (`MOD-15`)

> **Module ID**: `MOD-15` · **Parent Index**: [`/docs/standards/README.md`](./README.md)  
> **Scope**: End-to-end engineering handbook for authoring or upgrading any Attack Explorer scenario across all three visual teaching layers: Three.js Japanese anime 3D storytelling (`MOD-09`, `MOD-10`, `MOD-16`), animated SVG + GSAP technical clips (`MOD-14`, `MOD-16`), and interactive Excalidraw technical whiteboards (`MOD-13`).  
> **Status**: Mandatory Permanent Standard · **Reference Benchmark**: `process-hollowing` (Process Hollowing & Cobalt Strike Beacon Loader) · **Companion Requirement**: [`MOD-16` (Dynamic Real-World Physical Environment & Screenplay Standard)](./16-dynamic-real-world-environment-and-screenplay-standard.md) · **Enforced By**: `/lib/section-3d-registry.test.ts`, `/lib/technical-clips.test.ts`, `/lib/scenario-cinematic-uniqueness.test.ts`, `/lib/documentation-standards.test.ts`, and `/modules/scenarios/architecture.test.ts`.

---

## 1. Purpose & Core Architecture — Three Distinct Teaching Surfaces

Every scenario in **Attack Explorer** must teach through **three strictly separated visual surfaces** rendered in canonical order inside `StandardStoryTechnicalSection` (and `ProcessMemoryView` for Memory Forensics). None of these surfaces is a restyle or duplicate of another; each answers a different pedagogical question for the learner.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                        CANONICAL PER-SECTION LEARNING STACK                              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  1. STORY ANALOGY CARD (MOD-08, MOD-11)                                                  │
│     • 100% jargon-free plain-language story + explicit Story-to-Technical Key            │
│                                           │                                              │
│                                           ▼                                              │
│  2. THREE.JS JAPANESE ANIME 3D STORY STAGE (MOD-09, MOD-10)                              │
│     • Cel-shaded Japanese anime aesthetic matching the app shell (zero Japanese chars)   │
│     • Scenario-unique story world animating the physical metaphor beat-by-beat           │
│     • Required on: briefing (Overview), step-1..N, and memory-forensics (if documented)  │
│                                           │                                              │
│                                           ▼                                              │
│  3. 2D ANIMATED TECHNICAL CLIP — SVG + GSAP SILENT LECTURE (MOD-14)                      │
│     • Kinetic mechanism-specific engineering animation (14 domain engines or custom SVG) │
│     • Interactive click-to-inspect station cards + live 4-act phase ribbon               │
│     • Required on: step-1..N and memory-forensics (STRICTLY OMITTED on briefing)         │
│                                           │                                              │
│                                           ▼                                              │
│  4. 2D INTERACTIVE EXCALIDRAW TECHNICAL WHITEBOARD (MOD-13)                              │
│     • Static cream (#FDFBF7) chalk engineering map (8 domain-native topologies)          │
│     • Bare arrows, floating captions, sticky NOTE, and full chalk hover tooltips         │
│     • Required on: briefing, step-1..N, and memory-forensics (if documented)             │
│                                           │                                              │
│                                           ▼                                              │
│  5. NUMBERED FORENSIC TECHNICAL CLAUSES (MOD-03, MOD-08)                                 │
│     • Action + inline plain-English why parentheticals paired with SIEM/MITRE telemetry  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Surface Ownership Matrix

| Surface | Primary Job | Where Required | Motion & Interactivity |
| :--- | :--- | :--- | :--- |
| **Three.js 3D Anime Stage** | Explain **what happens conceptually** as a continuous Japanese anime story diorama inspired by `process-hollowing`. | `briefing`, `step-1..N`, `memory-forensics` (only if `memoryBlocks` exist) | Animated 3D story choreography, 4 camera presets, cutaway toggle, timeline scrubber, Story + Technical HUD. |
| **2D Technical Clip (SVG + GSAP)** | Explain **how the exact technical mechanism executes** (APIs, packets, tickets, registers, IAM hops, LLM routing, memory diffs) as an animated silent lecture. | `step-1..N`, `memory-forensics` (only if `memoryBlocks` exist). **Never on `briefing`.** | GSAP kinetic choreography (`clipPace.ts`), live 4-act phase ribbon, cutaway trace rows, clickable SVG stations + floating micro-inspector card. |
| **Excalidraw Whiteboard** | Provide a **static, inspectable engineering blueprint** of entities, edges, invariants, and detection pivots. | `briefing`, `step-1..N`, `memory-forensics` (only if `memoryBlocks` exist) | Static `#FDFBF7` chalk canvas, zoom/fit controls, yellow sticky `NOTE`, hover chalk cards (`title`, `module`, `signature`, `fields`, plain-language `explain`). |

---

## 2. The Scenario-Base Law (Zero Uniform Templates)

Every new or upgraded scenario **must be authored scenario-first**, never stamped from a single uniform visual template.

1. **Unique 3D Story World Per Scenario**:
   - Follow the artistic craft and narrative discipline of **`process-hollowing`** (Process Hollowing & Cobalt Strike Beacon Loader): crisp cel-shaded Japanese anime visuals, dark ink outlines, warm cinematic lighting, clear physical story props, and multi-act continuity from `briefing` through the final step.
   - **Never** clone the Armored Bank Truck or road diorama into unrelated scenarios. A Kerberoasting attack belongs in a ticket booth and offline safe-cracking workshop; Log4Shell belongs in a hotel/lobby reception ledger and outside telephone bureau; an AI multi-agent raid belongs in a robotic dispatcher vault with automated blast doors.
   - **Zero Japanese Characters**: Keep 100% of titles, callouts, cues, captions, and HUD labels in clean English (`MOD-09`). The anime look comes from cel-shading, outlines, silhouettes, and framing—never from untranslated Japanese glyphs.
   - **Zero Story Jargon**: Every 3D `storyCue`, `phase.storyExcerpt`, `callout.title`, and 2D clip `beat.story` must pass `findTechnicalJargonInStory(text) === []`. Technical tokens belong in `technicalCue`, `storyMappings[].technicalTerm`, `beat.technical`, and the technical clauses.
2. **Per-Step Mechanism Adaptation in 2D Clips**:
   - Do **not** render every step of a scenario with the same 2D layout or the same SVG machine.
   - Select the 2D kinetic mechanic from **that individual stage's actual forensic verb** (using stage-level fields such as `stage.title`, `stage.subtitle`, `stage.mitreTechniqueName`, `stage.mitreTacticPhase`, and category context—never letting a generic scenario-wide word like `"DFIR Log"` or `"Defender XDR"` force every step onto one mechanic).
   - Consecutive steps inside one scenario should visibly shift visual engines when the technical mechanism shifts (for example: Step 1 `network-packet-wire` → Step 2 `identity-ticket-forge` → Step 3 `persistence-vault-trigger` → Memory `memory-diff-scanner`).
3. **Per-Section Topology Adaptation in Excalidraw Whiteboards**:
   - Match each board's spatial geometry (`BoardTopologyKind`) to the architectural shape of the mechanism being taught (multi-hop wire chain, kernel/user split boundary, CI/CD supply-chain branch, persistence triad, dual forensic timeline, protocol layer stack, or disk-vs-live VAD memory comparison).
4. **Strict Grounding on `memory-forensics`**:
   - Register `memory-forensics` (for 3D, 2D clip, and Excalidraw whiteboard) **strictly and only** when the scenario has real documented `memoryBlocks` in its `processTree` (`MOD-04`, `MOD-10`). Never invent fake virtual memory addresses for pure SaaS, IAM, or network-only attacks.

---

## 3. Complete 3D Cel-Shaded Japanese Anime Design Specification (`MOD-09` + `MOD-10`)

When designing the Three.js layer for a new scenario, every section (`briefing`, `step-1..N`, optional `memory-forensics`) must satisfy these structural rules:

1. **Narrative Continuity Across Sections**:
   - `briefing` establishes the full physical world and recurring hero props in one wide story arc.
   - Each `step-N` zooms into the exact physical action of that stage's `storyAnalogy`, reusing the same world and props so the learner visually tracks cause and effect across steps.
   - `memory-forensics` (when present) uses a split side-by-side comparison staging (clean signed reference on the left vs. live altered runtime object on the right).
2. **Mandatory `Section3DDescriptor` Fields**:
   - `scenarioId`, `sectionKey`, globally unique `sceneKind`, `stageBadge`, `mitreId`, `title`.
   - `storyCue` (jargon-free) and `technicalCue` (forensic technical summary).
   - `storyMappings[]`: **at least 4 explicit pairs** (`storyTerm` jargon-free → `technicalTerm` specific artifact/API/event, with `tone`: `'sky' | 'rose' | 'amber' | 'emerald'`).
   - `callouts[]`: floating 3D-anchored annotations with jargon-free `title` and concrete technical `subtitle`.
   - `phases[]`: 2–6 sequential timed acts (`startSec`..`endSec`) covering `0` to `durationSec`, each with `storyExcerpt` (jargon-free) and `technicalParallel`.
   - `cameraPresets[]`: exactly **4 named cameras** (`DIRECTOR`, `VIEW_A`, `VIEW_B`, `VIEW_C`) with domain-relevant labels and unobstructed sightlines.
3. **Visual & Performance Craft**:
   - Reuse shared toon ramp textures and cel-outline helpers from `/components/three/anime-toon-materials.ts` and `/components/three/scenes/anime-world-primitives.ts`.
   - Place architectural backdrops behind hero props (never place pillars or walls between camera and subject).
   - Never add decorative glitter, sparkle, or dust particle clouds (`MOD-09`).
   - Load scenario worlds lazily via dynamic `import()` inside the Three.js world loader so the `/` home route cold-compile stays fast, and implement complete `dispose()` cleanup for geometries, materials, and canvas textures.

---

## 4. Complete 2D Animated Technical Clip Design Specification (`MOD-14`)

The 2D technical clip is the **specialized forensic mechanics surface**—it shows the exact technical state transition (wires, headers, API calls, kernel boundaries, Kerberos minting, IAM privilege meters, LLM tool routing, build pipelines, protocol buses, or hex memory diffs) using animated SVG + GSAP inside the shared `AnimeClipStage` shell.

### 4.1 The 14 Registered 2D Kinetic Engines (`MalwareClipMechanic`)

Authors either build a bespoke per-step TSX clip (like `process-hollowing` under `/components/technical-clip/clips/`) or compile a scenario-specific `MalwareTechnicalClipSpec` targeting one of the **14 kinetic engines** in `MalwareTechnicalClipRenderer.tsx` and `DomainKineticVisualizers.tsx`:

| # | Engine ID (`MalwareClipMechanic`) | Kinetic Visual Mechanics & Animated Elements | Best-Fit Attack Mechanisms |
| :--- | :--- | :--- | :--- |
| 1 | `memory-patch-lens` | Caller box → animated RX→RWX protection dial → RAM strip before/after rewrite + cutaway rows + untouched disk control | AMSI/ETW patching, shellcode allocation, reflective DLL loading, RWX memory hooks |
| 2 | `loader-hijack-rail` | Signed trusted host on main rail → hijacked search-order branch → malicious module load + authentic binary untouched | DLL sideloading, `LD_PRELOAD`, CLR profiler hijack, Java classloader/deserialization hijack |
| 3 | `ring-boundary-gate` | Horizontal Ring 3 / Ring 0 dashed boundary → IOCTL/syscall gate crossing → kernel object/callback tamper + witness | BYOVD drivers, kernel LPE, container/sandbox escape, firmware/bootkit transitions |
| 4 | `persistence-vault-trigger` | Attacker writes trigger into config vault (Registry/Task/WMI/Cron/Webshell) → OS scheduler/daemon spawns payload | Scheduled tasks, WMI subscriptions, services, systemd/cron, webshells, GPO persistence |
| 5 | `credential-audit-intercept` | Target credential store (LSASS/NTDS/SAM/Keychain) → extraction handle/dump → Sysmon/Auditd intercept + clean control | LSASS minidump, DCSync, NTDS.dit extraction, WER LocalDumps, secret harvesting |
| 6 | `forensic-dual-ledger` | Dual timeline tracks: attacker-modified Track A (`$SI`/cleared log) vs immutable Track B (`$FN`/ETW/CloudTrail truth) | Timestomping, MFT `$SI`/`$FN` mismatch, log clearing (`wevtutil`), CloudTrail tampering |
| 7 | `ransomware-io-destroy` | Backup/shadow volume targets crossed out by destructive engine → encryption lock sweep + skipped OS system files | Ransomware mass encryption, `vssadmin` shadow deletion, ESXi VM locker, wiper impact |
| 8 | `memory-diff-scanner` | Side-by-side disk signed image (`SEC_IMAGE`, `4D 5A`) vs live altered process memory (`MEM_PRIVATE`, `RWX`) + scanning beam | All `memory-forensics` sections with documented `memoryBlocks` |
| 9 | `network-packet-wire` | Originating host → optical packet capsule traveling through WAF/parser laser inspection bay → target service + outbound callback arc | HTTP/JNDI injection, SSRF, edge appliance zero-days, reverse shells, DNS/C2 tunneling |
| 10 | `identity-ticket-forge` | Principal identity → KDC/IdP cryptographic spinning seal minting forged/downgraded ticket/token → target resource vault | Kerberoasting, Golden/Silver Tickets, ADCS, NTLM relay, OAuth/SAML/MFA token theft |
| 11 | `cloud-controlplane-hop` | Low-privilege workload/user → Cloud/K8s API control plane with live privilege escalation gauge bar → admin role/pod takeover | IAM `PassRole`, Lambda/STS escalation, IMDS abuse, K8s RBAC/pod control-plane abuse |
| 12 | `ai-pipeline-hijack` | Prompt/agent input → inference router with live attention wave + mechanical switch arm pivoting from Safe Guardrail to Hijacked Action Sink | Indirect prompt injection, autonomous LLM agent raids, MCP tool abuse, RAG poisoning |
| 13 | `supply-chain-conveyor` | Upstream source/package conveyor belt with moving build pods → poison injection station → signed release crate + clean upstream commit | npm/PyPI/CI/CD poisoning, GitHub Actions runner compromise, ML pickle/checkpoint tampering |
| 14 | `protocol-bus-actuator` | Protocol/industrial controller → live oscillating signal waveform bus → field actuator / SQL engine / mobile baseband sink | SQL/data platform exploitation, ICS/SCADA Modbus/OPC actuation, mobile baseband/SS7 spyware |

### 4.2 Interactive & Kinetic Rules (Mandatory on Every 2D Clip)

1. **Live 4-Act Phase Indicator Ribbon**: Every rendered clip displays the synchronized 4-act header ribbon (`01 DISPATCH` → `02 MUTATE` → `03 CONTROL` → `04 WITNESS`) tied directly to GSAP timeline progress.
2. **Interactive Click-to-Inspect Station Micro-Inspector**:
   - Every station (`Origin`, `Mechanism`, `Target`, `Control`, `Witness`) is clickable both on the SVG diagram and via the bottom-right `INSPECT:` quick bar.
   - Every interactive SVG group and button **must** carry `data-clip-interactive="true"` so `useCanvasPlayToggle.ts` never misinterprets a station click as a canvas play/pause toggle.
   - The floating inspector card (`data-testid="clip-station-inspector"`) **must** remain bounded inside the stage (`max-h-[68%] flex flex-col overflow-hidden`) with a fixed header (badge, title, close button) and scrollable body, and concise `explain` copy (`<= 260` characters) so it never clips off the top edge.
3. **GSAP SVG Transform Safety (Strict Non-Negotiable Rule)**:
   - **Never** combine `className="anim-..."` and `transform="translate(...)"` on the same `<g>` element—GSAP's `x`/`y`/`scale` tweens overwrite inline SVG `transform` attributes and snap the group to `(0, 0)`.
   - Always nest an inner animated `<g className="anim-...">` inside an outer positioned `<g transform="translate(x, y)">`.
4. **Globally Unique `svgPrefix` & `clipPace.ts` Floors**:
   - Every clip must supply a globally unique `svgPrefix` (`<FilmBackdrop prefix={spec.svgPrefix} />`) so SVG gradient/filter IDs never collide when multiple clips appear on `/scenarios/[id]`.
   - Every tween duration and beat hold must obey `clipPace.ts` (`clipPace.travel`, `clipPace.teach`, `clipPace.hold`, `clipPace.end`) so `1x` playback is readable without forcing learners to drop to `0.5x`.
5. **Beat Story & Technical Separation**:
   - Every clip defines 4 beats (`beats.length === 4`) and 4 tailored camera labels (`cameraLabels.length === 4`).
   - `beat.story` must be 100% jargon-free (`findTechnicalJargonInStory(beat.story) === []`) and free of Japanese characters; exact APIs, commands, Event IDs, and hex values belong in `beat.technical`.

---

## 5. Complete 2D Interactive Excalidraw Whiteboard Specification (`MOD-13`)

Every scenario section (`briefing`, `step-1..N`, and `memory-forensics` when documented) ships a static Excalidraw chalk whiteboard rendered exclusively through `TechnicalWhiteboardEmbed` → `ExcalidrawBoard`.

### 5.1 The 8 Registered Whiteboard Topologies (`BoardTopologyKind`)

| # | Topology ID | Spatial Geometry | Primary Use Cases |
| :--- | :--- | :--- | :--- |
| 1 | `pipeline-flow` | 3-box top execution chain + right sticky NOTE + lower invariant/detection row | Standard linear kill-chain briefings and multi-stage execution |
| 2 | `split-boundary` | Horizontal privilege/security boundary line separating upper zone from lower zone | Ring 3 vs Ring 0, IT vs OT/SCADA, Sandbox vs Host, Trust Boundary crossings |
| 3 | `supplychain-branch` | Trusted main track on top + hijacked branch dipping below + right sticky NOTE | DLL sideloading, CI/CD build tampering, loader/dependency hijacking |
| 4 | `persistence-triad` | Left writer → center vault/config store → right OS auto-trigger + lower sensor | Registry/WMI/Scheduled Task/Cron/Service/Webshell persistence |
| 5 | `forensic-timeline` | Two parallel horizontal tracks (Tampered Artifact Track A vs Immutable Ledger Track B) | Timestomping, MFT `$SI`/`$FN` drift, audit log tampering |
| 6 | `memory-vad-compare` | Side-by-side clean disk image (`SEC_IMAGE`) vs live altered RAM (`MEM_PRIVATE`) | All `memory-forensics` sections with documented `memoryBlocks` |
| 7 | `network-hop-chain` | Full-width 3-hop ingress/parser/target chain above + sticky NOTE, control & IDS row below | Web/HTTP/JNDI/SSRF, Kerberos/LDAP exchanges, C2 tunnels, Edge zero-days |
| 8 | `protocol-layer-stack` | Two-column architectural stack (Execution/Protocol layers vs Policy/Telemetry plane) + right column | Cloud IAM, Kubernetes control plane, AI/LLM pipelines, Database query stacks |

### 5.2 Non-Negotiable Whiteboard Geometry & Tooltip Rules

1. **Spacing & Bare Arrows**: Maintain `ARROW_GAP >= 150` scene units between horizontally linked boxes. Arrows (`type: 'arrow'`) **must never** carry an inline `label` property; place edge captions as separate floating `type: 'text'` elements via `safeHArrow` / `safeVArrow` / `safeCaption`.
2. **Zero Clipped Hand-Drawn Text**: Do not hard-code narrow fixed `width` values on standalone `type: 'text'` skeletons (`safeTitle`, `safeNote`, `safeCaption`, `safeHArrow`, `safeVArrow`), and rely on `ExcalidrawBoard.tsx`'s post-conversion standalone text width padding + `document.fonts.ready` re-measurement so Virgil/Excalifont glyphs never clip at offscreen canvas edges.
3. **Complete Chalk Hover Tooltips**:
   - Every teaching rectangle and the yellow sticky `NOTE` must have a matching entry in `board.tooltips[elementId]`.
   - Each tooltip must specify `kind`, non-empty `title`, `module`, optional `signature`, at least 1 structured `fields[]` entry, and a plain-language `explain` (`>= 20` characters, concise `<= 260` characters).
   - Hover cards stay in the cream `#FDFBF7` chalk visual language (`BoardTooltipCard.tsx`)—never swap to a dark IDE modal.

---

## 6. 13-Category Domain Mapping Matrix (Scenario-First Guide)

When adding a new scenario in any of the 13 platform categories, use this matrix to align its 3D world, 2D kinetic clip engines, and Excalidraw topologies without falling into uniform templates:

| Category (`AttackCategory`) | Native 3D Anime Story World Archetype | Primary / Secondary 2D Clip Engines | Primary / Secondary Whiteboard Topologies |
| :--- | :--- | :--- | :--- |
| `MALWARE` | Custom physical world per technique (Armored Truck, X-Ray Belt, Vault Lock, Conveyor) | Hand-authored per step across engines #1–#8 | Hand-authored per section across topologies #1–#6 |
| `NETWORK_WEB` | Lobby Desk, Telephone Switchboard, Courier Tunnel, Customs Gate | `network-packet-wire`, `loader-hijack-rail`, `protocol-bus-actuator`, `persistence-vault-trigger` | `network-hop-chain`, `pipeline-flow`, `persistence-triad` |
| `ACTIVE_DIRECTORY` | Ticket Kiosk, Wax-Sealed VIP Passes, Safe-Cracking Lab, Master Key Vault | `identity-ticket-forge`, `credential-audit-intercept`, `persistence-vault-trigger`, `network-packet-wire` | `network-hop-chain`, `split-boundary`, `persistence-triad` |
| `CLOUD_SAAS` | Orbital Airlock, Identity Badge Mint, Cloud Control Tower, Audit Ledger | `cloud-controlplane-hop`, `identity-ticket-forge`, `forensic-dual-ledger`, `network-packet-wire` | `protocol-layer-stack`, `split-boundary`, `network-hop-chain` |
| `RANSOMWARE_EXTORTION` | Records Office, Microfilm Shredder, Padlock Assembly, Vault Door | `network-packet-wire`, `credential-audit-intercept`, `ring-boundary-gate`, `ransomware-io-destroy` | `pipeline-flow`, `split-boundary`, `persistence-triad` |
| `AI_LLM_MLOPS_SECURITY` | Robotic Swarm Dispatcher, Automated Guardrail Track, Blast-Door Vault | `ai-pipeline-hijack`, `supply-chain-conveyor`, `cloud-controlplane-hop`, `network-packet-wire` | `protocol-layer-stack`, `supplychain-branch`, `split-boundary` |
| `ZERO_DAY_APPLIANCES` | Perimeter Switchboard Tower, Emblem Press, Branch Filing Cabinets | `network-packet-wire`, `loader-hijack-rail`, `ring-boundary-gate`, `persistence-vault-trigger` | `network-hop-chain`, `split-boundary`, `persistence-triad` |
| `KERNEL_FIRMWARE_BYOVD` | Two-Level Courthouse Floor & Sub-Floor Vault, Signed Medallion Scanner | `ring-boundary-gate`, `memory-patch-lens`, `persistence-vault-trigger` | `split-boundary`, `memory-vad-compare`, `persistence-triad` |
| `SUPPLY_CHAIN_CICD` | Automated Factory Conveyor, Stolen Foreman Badge, Shipping Docks | `supply-chain-conveyor`, `loader-hijack-rail`, `identity-ticket-forge`, `cloud-controlplane-hop` | `supplychain-branch`, `protocol-layer-stack`, `network-hop-chain` |
| `CONTAINERS_KUBERNETES` | Stacked Shipping Container Pier, Maintenance Hatch, Crane Control Bridge | `cloud-controlplane-hop`, `ring-boundary-gate`, `supply-chain-conveyor`, `network-packet-wire` | `protocol-layer-stack`, `split-boundary`, `supplychain-branch` |
| `DATABASE_DATA_PLATFORMS` | Central Archive Vault, Pneumatic Query Tube, Bulk Export Loading Dock | `protocol-bus-actuator`, `identity-ticket-forge`, `network-packet-wire` | `protocol-layer-stack`, `network-hop-chain`, `split-boundary` |
| `ICS_OT_SCADA` | Control Room Glass Wall, Purdue Safety Gate, Physical Turbine/Valve Bus | `protocol-bus-actuator`, `ring-boundary-gate`, `network-packet-wire` | `split-boundary`, `protocol-layer-stack`, `network-hop-chain` |
| `MOBILE_TELECOM_SPYWARE` | Sealed Pocket Vault, Carrier Relay Tower, Silent Radio Signal Room | `protocol-bus-actuator`, `ring-boundary-gate`, `network-packet-wire` | `split-boundary`, `network-hop-chain`, `protocol-layer-stack` |

---

## 7. Exact File Architecture & Step-by-Step Authoring Workflow

Follow these 6 concrete steps whenever adding a brand-new scenario so all three visual layers, lazy loaders, and tests stay 100% synchronized:

```
/modules/scenarios/<scenario-id>/index.ts        # 1. Core AttackScenario + stepGuide + sources
   │   (run `npm run scenarios:registry`)
   ▼
/lib/section-3d-registries/*                     # 2. Bespoke 3D descriptors (briefing, step-1..N, optional memory)
/components/three/scenes/*                       #    + lazy Three.js Japanese anime world factory
   ▼
/lib/scenario-2d-blueprints/<category>.ts        # 3. 2D profile (or /lib/malware-2d-blueprints/group*.ts for MALWARE)
/lib/scenario-2d-blueprints/manifest.ts          #    + zero-dependency manifest entry (keeps `/` cold-compile fast!)
   ▼
/lib/section-excalidraw-registry.ts              # 4. Auto-exposed via SCENARIO_2D_EXCALIDRAW_BOARDS / MALWARE_EXCALIDRAW_BOARDS
/lib/section-technical-clip-registry.ts          #    + Auto-exposed via SCENARIO_2D_CLIP_FLAGS / MALWARE_TECHNICAL_CLIP_FLAGS
   ▼
/components/excalidraw/TechnicalWhiteboardEmbed  # 5. Shared lazy UI mounts (never mount raw Excalidraw/GSAP directly)
/components/technical-clip/TechnicalClipEmbed    #    + StandardStoryTechnicalSection & ProcessMemoryView auto-render all 3 layers
```

### Mandatory Engineering Steps for Every New Scenario

1. **Assign a Dynamic Real-World Environment & Author the Screenplay First (`MOD-16`)**:
   - Before writing 3D or 2D visuals, assign the scenario a concrete everyday real-world place from `REAL_WORLD_ENVIRONMENTS` (or add a new environment #29+ following `MOD-16 §4`), update `/scripts/build-cinema-screenplays.ts`, and run `npx --yes tsx scripts/build-cinema-screenplays.ts && node scripts/generate-scenario-data.mjs` so its docs-only screenplay in `/docs/screenplays/`, cinema profile, real-world story copy, and static `/public/scenario-data/*.json` stay 100% aligned with zero 3D/2D collisions.
2. **Author the Scenario Package**:
   - Create `/modules/scenarios/<id>/index.ts` exporting the `AttackScenario` (with rich `nodes`, `stages`, `telemetry`, `processTree`, optional documented `memoryBlocks`, `detectionRule`, and `>= 3` primary sources) plus its `stepGuide`.
   - Run `npm run scenarios:registry` so generated catalogs stay synchronized with the filesystem.
3. **Register Bespoke 3D Descriptors & Dynamic Real-World Anime World**:
   - Add unique `Section3DDescriptor` entries for `briefing`, every `step-1..N`, and `memory-forensics` (only if `memoryBlocks` exist).
   - Ensure `sceneKind` is globally unique, every `storyCue`/`storyExcerpt`/`callout.title` passes `findTechnicalJargonInStory() === []`, and the Three.js scene renders the scenario's literal real-world physical architecture and animated hero prop (`MOD-16`) with `dispose()` cleanup.
4. **Register Scenario-Tailored 2D Clip & Excalidraw Whiteboard Profiles**:
   - For **`MALWARE`** scenarios: add a bespoke `MalwareScenario2DProfile` to the matching `/lib/malware-2d-blueprints/group*.ts` file and register its sections in `/lib/malware-2d-blueprints/manifest.ts`.
   - For the **other 12 categories**: ensure `/lib/scenario-2d-blueprints/<category>.ts` generates or overrides its `MalwareScenario2DProfile` with authentic per-step `clipMechanic` (14 engines) and `boardTopology` (8 topologies), and add its zero-dependency entry (`{ group, sections }`) to `/lib/scenario-2d-blueprints/manifest.ts`.
   - Keep `manifest.ts` **100% dependency-free** (importing only types) so the `/` home workbench never eagerly compiles heavy blueprint arrays; runtime loading always flows through `loadAnyTechnicalWhiteboard()` and `loadAnyTechnicalClipSpec()` in `/lib/scenario-2d-blueprints/loader.ts`.
5. **Never Register a 2D Clip on `briefing`**:
   - `briefing` always receives **Three.js 3D** + **Excalidraw Whiteboard**, and **never** a 2D technical clip (`hasTechnicalClip(id, 'briefing') === false`).
6. **Update Expected Catalog Counts in Tests & Run Full CI Suite**:
   - Update catalog totals in `/lib/technical-clips.test.ts`, `/lib/section-3d-registry.test.ts`, `/lib/scenario-cinematic-uniqueness.test.ts`, and `/lib/documentation-standards.test.ts` if scenario counts increase.
   - Execute all automated verification commands:
     ```bash
     npx --yes tsx --test lib/scenario-cinematic-uniqueness.test.ts lib/technical-clips.test.ts lib/section-3d-registry.test.ts lib/documentation-standards.test.ts modules/scenarios/architecture.test.ts lib/scenario-step-guides.test.ts lib/scenario-catalog.test.ts
     npm run build
     npm run lint
     ```
7. **Perform Real-Browser Visual Audit (`1440×900`)**:
   - Open `/scenarios/<id>` in a real browser (`playwright-cli`), verify the real-world 3D environment matches the Story Analogy verbatim, scroll into `step-1` and `memory-forensics` (if present), click a station inside the 2D technical clip to verify both the matching 2D real-world architectural illustration and the bounded `[data-testid="clip-station-inspector"]` card, open the Excalidraw whiteboard to verify zero clipped glyphs and working hover tooltips, and verify zero console/page errors.

---

## 8. Anti-Patterns vs. Canonical Patterns

| Anti-Pattern (Do NOT Do This) | Canonical Pattern (DO This Instead) |
| :--- | :--- |
| Cloning the Process Hollowing Armored Bank Truck or road layout into a Kerberos, Cloud IAM, or AI scenario. | Build a domain-native cel-shaded Japanese anime world tailored to the scenario's literal story (e.g., ticket kiosk & safe-cracker for Kerberoasting; robotic dispatcher vault for ARTEX). |
| Using one identical 2D SVG layout for every scenario or matching scenario-title words like `"DFIR Log"` / `"inject"` across all steps. | Choose each step's kinetic engine from the 14 engines based on **that stage's** real verb and category (`network-packet-wire`, `identity-ticket-forge`, `ai-pipeline-hijack`, `cloud-controlplane-hop`, etc.). |
| Putting `className="anim-..."` and `transform="translate(...)"` on the same SVG `<g>` element. | Wrap `<g className="anim-...">` inside an outer static `<g transform="translate(x, y)">` so GSAP never clobbers positioning. |
| Dumping an entire multi-paragraph `stage.description` into a floating clip inspector card without height bounds. | Cap station `explain` to a crisp 1–2 sentence summary (`<= 260` chars) and bound the inspector card (`max-h-[68%] flex flex-col overflow-hidden` with sticky header and scrollable body). |
| Putting inline `label` strings on Excalidraw `arrow` skeletons or hard-coding narrow `width` on standalone chalk `text` captions. | Use bare arrows (`ARROW_GAP >= 150`) with separate floating captions, omit narrow fixed text widths, and let `ExcalidrawBoard.tsx` pad standalone text widths after `document.fonts.ready`. |
| Importing heavy scenario blueprint modules directly in `/` home page components or `manifest.ts`. | Keep `manifest.ts` zero-dependency and load per-category 2D blueprints and 3D worlds lazily via dynamic `import()` inside `loader.ts` and `three-registry.ts`. |
| Registering a 2D technical clip on `briefing`, or inventing a `memory-forensics` scene for a scenario without `memoryBlocks`. | Omit 2D clips on `briefing` (`MOD-14 §3`), and register `memory-forensics` across 3D/2D/Whiteboard only when documented `memoryBlocks` exist. |

---

## 9. Authoring & Review Acceptance Checklist (`MOD-15`)

Before merging any new or upgraded scenario, confirm every item below:

- [ ] **3D Anime Story Layer**: Does every section (`briefing`, `step-1..N`, optional `memory-forensics`) have a bespoke cel-shaded Japanese anime 3D world unique to this scenario, with 4 cameras, `>= 4` `storyMappings`, zero Japanese characters, and `findTechnicalJargonInStory() === []`?
- [ ] **2D Kinetic Clip Layer**: Does every non-briefing section (`step-1..N`, optional `memory-forensics`) have a registered SVG + GSAP clip using a stage-authentic kinetic engine, globally unique `svgPrefix`, `clipPace.ts` floors, safe nested `<g>` transforms, live 4-act phase ribbon, and clickable `data-clip-interactive="true"` station inspector bounded inside the stage?
- [ ] **Briefing Clip Exclusion**: Is `hasTechnicalClip(scenarioId, 'briefing') === false`?
- [ ] **Excalidraw Whiteboard Layer**: Does every section (`briefing`, `step-1..N`, optional `memory-forensics`) have a MOD-13 whiteboard with an appropriate topology (from the 8 topologies), `ARROW_GAP >= 150`, bare arrows with floating captions, yellow sticky `NOTE`, footer hover hint, unclipped chalk text, and rich hover tooltips (`explain >= 20` chars) on every teaching box?
- [ ] **Memory Grounding**: Is `memory-forensics` registered strictly if and only if documented `memoryBlocks` exist in `processTree`?
- [ ] **Zero-Dependency Manifest & Lazy Loading**: Are new entries wired into the lightweight `manifest.ts` and resolved cleanly by `loadAnyTechnicalWhiteboard()` / `loadAnyTechnicalClipSpec()` without bloating `/`?
- [ ] **Automated Gates & Live Visual Check**: Do all unit tests (`lib/*.test.ts` + `modules/scenarios/architecture.test.ts`), `npm run build`, `npm run lint`, and a `1440×960` browser check pass with zero errors?
