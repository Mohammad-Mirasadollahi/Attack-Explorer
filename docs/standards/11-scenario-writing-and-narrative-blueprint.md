# Scenario & Narrative Writing Blueprint (`MOD-11`)

> **Module ID**: `MOD-11` · **Parent Index**: [`/docs/standards/README.md`](./README.md)  
> **Scope**: Field-by-field text authoring standard, sentence formulas, structural blueprints, length budgets, and reusable copy-paste templates for writing every narrative and technical field of an Attack Explorer scenario (`/modules/scenarios/*.ts`, `/lib/step-guides/*.ts`, and `/lib/section-3d-registry.ts`).  
> **Status**: Mandatory Permanent Standard · Paired with `MOD-02`, `MOD-03`, `MOD-08`, and `MOD-10`.

---

## 1. Purpose — One Unified Writing Blueprint for Every Scenario

When authoring a brand-new scenario or upgrading an existing one, authors need more than abstract style guidelines: they need an **exact, deterministic field-by-field writing manual** that specifies what goes into every single text field, how the sentences connect, what is allowed or forbidden in each block, and how the text feeds directly into the UI cards and Three.js animations.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                      COMPLETE SCENARIO TEXT ARCHITECTURE                          │
├───────────────────────────────────────────────────────────────────────────────────┤
│  A. SCENARIO BRIEFING (#0 — Overview / Main Page)                                 │
│     1. briefing.storyAnalogy       -> 100% plain-language real-world story        │
│     2. briefing.storyMappings (4+) -> Explicit [Story Piece] -> [Real Tech] key   │
│     3. briefing.plainSummary       -> High-level technical roadmap (#0.1..#0.3)   │
│        (WHO/WHERE + arc + what Steps/Memory will cover — NOT a step deep-dive)    │
├───────────────────────────────────────────────────────────────────────────────────┤
│  B. KILL-CHAIN STAGES (Stage 1 .. Stage N — 1 Block per Real Attack Step)         │
│     1. step.storyAnalogy           -> Same metaphor world, zero jargon, 1-2 beats │
│     2. step.storyMappings (4+)     -> Exact translation of this step's props      │
│     3. step.simpleExplanation      -> Technical bridge quoting story props + why  │
│     4. step.howItWorksInPractice   -> Kernel/OS/protocol internals + return codes │
│     5. step.detectionAndEvidence   -> Exact Event IDs, Sigma/EDR pivot & catch    │
├───────────────────────────────────────────────────────────────────────────────────┤
│  C. OPTIONAL MEMORY / ARTIFACT COMPARISON (Only when documented memoryBlocks exist│
│     1. memory.storyAnalogy         -> Side-by-side physical contrast story        │
│     2. memory.storyMappings (4+)   -> Clean Disk vs. Live RAM prop translations   │
│     3. memory.technicalDiff        -> Exact VAD/SEC_IMAGE vs MEM_PRIVATE proof    │
│        (Memory detail MUST live here — never inside Overview plainSummary)        │
├───────────────────────────────────────────────────────────────────────────────────┤
│  D. 3D STAGE MICRO-COPY (Synchronized directly to the written Story & Technical)  │
│     1. callouts[0..1]              -> Top: Jargon-free story title                │
│                                       Bottom: Exact technical monospace subtitle  │
│     2. phases[0..K]                -> Each beat = 1 storyExcerpt + 1 techParallel │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Exact Field-by-Field Writing Rules & Character Budgets

Every scenario text field has a strict purpose, target length, voice, and content boundary. Never mix content across boundaries.

| Field Path | Audience & Role | Target Length | Mandatory Content Rules | Strictly Forbidden |
| :--- | :--- | :--- | :--- | :--- |
| **`scenario.name`** | Headline title of the intrusion chain | 35–85 chars | Concrete technique + payload/vector name (e.g., `Process Hollowing & Cobalt Strike Beacon Loader`). | Marketing adjectives (`Ultimate`, `Advanced`). |
| **`scenario.shortSubtitle`** | Compact forensic scope line | 30–80 chars | `Domain · Primary Technical Mechanism` (e.g., `Malware Analysis · svchost.exe Memory Unmapping & PE Injection`). | Full sentences or vague claims. |
| **`briefing.storyAnalogy`** | Executive real-world mental model (Layer 1) | 260–480 chars (2–4 sentences) | Starts with `"Imagine ..."` or a vivid physical scene; summarizes the **entire** attack arc from entry to objective inside **one** concrete real-world world. | **Zero** API names, hex values, filenames, PIDs, Event IDs, or parenthetical technical translations. |
| **`briefing.plainSummary`** | Technical Overview roadmap (Layer 2) — **not** a Steps/Memory deep-dive | **350–850 chars** (3–4 clear sentences → clauses `#0.1..#0.4`; hard max 950) | Answer-First WHO/WHAT/WHERE/WHY (MITRE/CVE, host/IP, loader, trusted host process, why the disguise works); one continuous attack arc in plain language without per-step API chains; explicit **section map** naming what Steps `#1..#N` and Memory (if present) will examine; one primary detection pivot. Prose must be readable, not telegraphic fragments. | Replaying every kill-chain step with APIs/handles/hex/return codes; VAD / `SEC_IMAGE` / `MEM_PRIVATE` / PEB offset Memory forensics; repeating `briefing.storyAnalogy`; cryptic shorthand (`Arc: freeze…`). |
| **`storyMappings[]`** | Bridge table directly inside every Story card | 4 or 6 pairs per section (balanced 2-col grid) | `storyTerm` (2–6 words, pure story noun/action) → `technicalTerm` (exact API, PID, hex flag, file path, or Event ID + brief role/why). When a section introduces paired props (e.g., two Master Keys), map **each** prop separately with its exact purpose. | Technical jargon inside `storyTerm`; lumping distinct keys/handles together without explaining what each one does. |
| **`steps[i].plainTitle`** | Action-oriented stage headline | 25–60 chars | Clear verb phrase describing what happens in this step. | Bare MITRE IDs without explanation. |
| **`steps[i].storyAnalogy`** | Stage-specific continuation of the exact same story | 180–420 chars (1–3 sentences) | Continues the **exact same characters, props, and setting** from `briefing.storyAnalogy`; narrates 2–3 concrete physical movements that the 3D scene will literally animate AND explicitly states what each newly introduced prop (e.g., Key #1 vs. Key #2) is used for. | Switching to an unrelated metaphor; naming a prop ("master keys") without stating what it unlocks; leaking any technical jargon (`findTechnicalJargonInStory() === []`). |
| **`steps[i].simpleExplanation`** | Story-to-Technical bridge for this stage | 320–780 chars (2–3 sentences) | Explicitly quotes the story props from `steps[i].storyAnalogy` (e.g., `Hitting the "garage freeze switch" means passing...`), then gives exact API/protocol tokens + substantive inline purpose parentheticals `(> 25 chars)` explaining WHAT each token is and WHY it is used. | Passive voice; unexplained flags/hex values/handles; literal `(why: ...)` prefix; em-dashes (`—`). |
| **`steps[i].howItWorksInPractice`** | Kernel / OS / protocol deep-dive with per-token clarity | 380–950 chars (2–3 structured sentences) | Names exact kernel routines, data structures, memory addresses, status/return codes, and request/response exchanges (`MOD-03` & `MOD-04`), AND attaches an immediate plain-English inline parenthetical `(what it is and why it is used here)` to **every single technical term** (`NtCreateUserProcess`, `EPROCESS`, `ntdll.dll`, `0x00400000`, `RtlUserThreadStart`, `SuspendCount`, `PROCESS_ALL_ACCESS`, `hProcess`, `hThread`). | Dense chains of unexplained APIs/structures/hex flags; repeating basic definitions without explaining the mechanical why; em-dashes (`—`). |
| **`steps[i].detectionAndEvidence`** | Blue-team forensic catch | 160–360 chars | Names exact Windows/Sysmon/Linux/Cloud Event IDs (with brief plain-English parenthetical explaining what that log records), field anomalies (`ParentImage`, `GrantedAccess`, `JA3`, `VAD`), and containment action. | Generic advice like `"Monitor logs carefully."` |
| **`stages[i].description`** | Stage forensic summary rendered in Stage Deep-Dive | 280–680 chars | Technical forensic narrative bridging story props to exact stage specs with inline plain-English parentheticals for every API/flag/handle and synced diagram flow alignment. | Unexplained acronyms, unexplained handles, or duplicate story paragraphs. |
| **`callouts[k].title` & `.subtitle`** | Translucent 3D floating overlay labels | Title: 2–4 words · Subtitle: 20–52 chars | `title`: pure plain-language story object (`Two Master Keys`). `subtitle`: exact technical monospace translation stating purpose (`hProcess (Edit RAM) · hThread (Wake CPU)`). | Technical jargon in `title`; bare hex handles without purpose; Japanese characters anywhere. |
| **`phases[k].storyExcerpt` & `.technicalParallel`** | Act-by-act synchronized 3D HUD micro-copy | 75–165 chars each | `storyExcerpt`: 1 vivid sentence of what is moving on screen right now and what each prop does (zero jargon). `technicalParallel`: 1 exact technical command/syscall/telemetry event occurring at that exact moment with concise role tags. | Copy-pasting the full stage paragraph into a phase box. |

---

## 3. Sentence-Level Writing Formulas

Use these repeatable formulas so every author writes with identical clarity and forensic density across all 188+ scenarios:

### Formula A — Writing `briefing.storyAnalogy` (Whole-Scenario Story)
> **Structure**: `[1. Goal & Contrast against obvious attack]` + `[2. Step-by-step physical sequence using concrete objects, explicitly stating what each key prop does]` + `[3. Why defenders/guards fail to notice at first]`.
>
> **Example**:
> *"Imagine an intruder who wants to enter a high-security bank without raising an alarm. Instead of breaking down the front door in a ski mask, they hire an official armored bank truck, freeze it inside the garage before the driver even starts the route, and pocket two golden master keys: the first master key unlocks the rear cargo doors so they can empty all the legal bank gold and load their own covert crew inside, and the second master key unlocks the driver cab so they can reprogram the GPS route and release the brake. When the truck rolls out, every security camera and guard at the gate still sees the bank's own trusted license plate and uniform."*

### Formula A2 — Writing `briefing.plainSummary` (Overview Roadmap Only)
> **Structure**: `[1. WHO / WHAT / WHERE / MITRE]` + `[2. One-breath attack arc with a short why per beat]` + `[3. Section map: what Steps #1..#N / Process Hierarchy / Memory will cover, with meaning]` + `[4. One primary detection pivot]`.
>
> **Purpose**: Orient the reader so they know what later sections examine. Deep-dive APIs, return codes, handles, hex constants, VAD/`SEC_IMAGE`/`MEM_PRIVATE` contrasts, and PEB offsets belong in **Steps** or **Memory**, never here.
>
> **Technical Overview clause rule (UI)**: `plainSummary` is split into numbered Technical Overview clauses (`#0.1`..`#0.N`) on sentence boundaries. Every clause must be a **complete explanatory sentence** (≥ ~70 chars) that tells a mini-story beat: what happens and why it matters. Never emit telegraphic stubs such as `#2 LDAP Referral;` or `Steps #1–#4 examine #1 Title; #2 Title; #3 Title;`. Prefer **3–4 sentences** (hard max 5 clauses). Do **not** use semicolon-separated `#N Title` lists — keep the step map as one flowing sentence with inline purpose parentheticals.
>
> **Canonical Example (Process Hollowing)**:
> *"In this scenario (MITRE ATT&CK T1055.012, Process Hollowing), the attacker uses Invoice_Q4.exe on Victim Laptop WKS-04 (10.10.4.15) to run Cobalt Strike Beacon inside a Microsoft-signed svchost.exe so antivirus and application-allowlisting treat the implant as a trusted Windows service host. The attack unfolds in one continuous arc: start a real svchost.exe paused, empty its legitimate code from RAM, write Beacon into that same process, wake its thread so Beacon runs under the trusted name, then open encrypted HTTPS C2 to 185.220.101.42:443. Steps #1–#5 walk that chain end-to-end by covering the suspended launch, the memory unmap, the Beacon write, the thread wake, and the outbound C2 beacon, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible and the Memory tab shows why the live process no longer matches the signed file on disk. Primary detection correlates Sysmon ProcessCreate, ProcessAccess, and ProcessTampering with bare svchost.exe opening anomalous HTTPS."*
>
> **Anti-Pattern (Rejected)**:
> - A single Overview paragraph that walks CreateProcessW → NtUnmapViewOfSection → VirtualAllocEx → WriteProcessMemory → SetThreadContext → ResumeThread with every handle, hex flag, and return code (that content belongs in Steps #1–#4 / Memory).
> - Semicolon title dumps that become meaningless Technical Overview chips: `Steps #1–#4 examine #1 Sending the JNDI string; #2 Log4j Evaluates the Lookup; #3 LDAP Referral; #4 Executing the Static Initializer.`

### Formula B — Writing `steps[i].storyAnalogy` (Single-Stage Story Beat + Prop-Purpose Clarity)
> **Structure**: `[1. Continuity link from previous stage]` + `[2. Physical action A on a concrete prop]` + `[3. Explicit job of every new prop introduced + visible consequence ready for 3D animation]`.
>
> **Prop-Purpose Rule**: Never introduce a story prop (such as *"two golden master keys"*, *"a passcard"*, or *"a diagnostic switch"*) without immediately telling the reader **what that specific prop unlocks or enables** in plain language. If there are two props (Key #1 and Key #2), explicitly explain the distinct role of each one.
>
> **Checklist while writing**: Ask *"If a 3D animator reads ONLY these two sentences, do they know the exact 3 objects to build, what each prop is for, and the exact 2–3 movements to animate?"* If the answer is no, replace abstract verbs (`"manipulates"`, `"compromises"`) with physical verbs (`"swings open"`, `"slides out"`, `"turns the wheel"`, `"snaps the padlock"`, `"shreds the reels"`).

### Formula C — Writing `steps[i].simpleExplanation` (Story-to-Technical Bridge)
> **Structure**: `[Quoted story anchor]` + `[Subject actor + PID/IP]` + `[Exact API / command / protocol]` + `[Inline purpose parenthetical explaining WHAT it is and WHY in plain English, > 25 chars]` + `[Exact return value / handle & which upcoming step uses it]`.
>
> **Example**:
> *"Hitting the 'garage freeze switch' means passing the creation flag `CREATE_SUSPENDED = 0x00000004` (which instructs the Windows kernel to assemble the process container in RAM and create its main worker thread `TID 4896`, but pause it at the starting line before its first line of code can execute). In response, the kernel returns Process Master Key `hProcess = 0x01C4` (a numeric permission handle unlocking `svchost.exe`'s virtual memory so the loader can inspect, erase, and inject code in Steps #2 and #3) and Thread Master Key `hThread = 0x01C8` (a separate handle unlocking the paused thread's CPU controls so the loader can steer and wake it in Step #4)."*

### Formula D — Writing `storyMappings` (4- or 6-Item Translation Key)
> Always render an even number of pairs (4 or 6 for a clean 2-column grid) covering the **essential anchors** of the section, mapping distinct paired props separately:
> 1. **Who acts?** (`rose` or `amber`) — e.g., `Intruder at Dispatch Desk` → `Stage-1 Loader · Invoice_Q4.exe (PID 3104)`
> 2. **What trusted target or environment is used?** (`sky`) — e.g., `Official Armored Bank Truck` → `Signed Windows Host · svchost.exe (PID 4892)`
> 3. **What core trick or prop #1 occurs?** (`sky` / `amber`) — e.g., `Cargo-Door Master Key (Key #1)` → `Process Handle hProcess (0x01C4) · Unlocks RAM Edits in Steps #2–#3`
> 4. **What prop #2 / forensic alarm catches it?** (`amber` / `emerald`) — e.g., `Cab & Ignition Master Key (Key #2)` → `Thread Handle hThread (0x01C8) · Unlocks CPU Steer & Wake in Step #4`

### Formula E — Writing `steps[i].howItWorksInPractice` (Zero-Jargon-Dump Kernel/Protocol Deep-Dive)
> **Rule**: Never chain 3+ raw kernel APIs, structs, hex addresses, or flags in a single sentence with only one vague parenthetical at the end. Break deep-dives into 2–3 crisp sentences and attach an immediate plain-English parenthetical `(what it is + why it is used)` right after **every** technical token:
> - **API / Syscall**: `ntdll!NtCreateUserProcess` *(the low-level system call inside `ntdll.dll` that crosses into the Windows kernel to build a new process)*
> - **Kernel Structure**: `EPROCESS` for `PID 4892` *(the kernel's master tracking record storing the process's trusted `svchost.exe` identity, security token, and memory map)*
> - **System Library / Memory Slot**: `ntdll.dll` *(Windows' mandatory core bridge library required by every process to make kernel requests)* and `0x00400000` *(the standard starting memory slot where executable code loads so internal jumps align)*
> - **Thread State & Access Mask**: `ntdll!RtlUserThreadStart` *(Windows' built-in thread launchpad)*, `SuspendCount = 1` *(pause counter keeping the CPU scheduler from running it)*, and `PROCESS_ALL_ACCESS = 0x1FFFFF` *(highest permission mask allowing full memory and thread tampering)*

---

## 4. Strict Data-Separation Rules (Preventing Duplicate Text Bugs)

Follow these wiring laws whenever connecting written text to React components and data builders:

1. **Briefing Separation (`briefing.storyAnalogy` vs. `briefing.plainSummary`)**:
   - Store the pure Story in `guide.briefing.storyAnalogy` and the pure Technical Overview roadmap in `guide.briefing.plainSummary`.
   - Even if `scenario.overview` concatenates both for search/SEO indexing, **Overview / SEO landing pages** must pass `briefing.storyAnalogy` to `storyAnalogy` and `briefing.plainSummary` to `technicalText`.
   - **Steps `#0` Scenario Briefing** must **not** re-pass Overview Story: use `omitStory` on `StandardStoryTechnicalSection` and expand technical briefing from `plainSummary` + `diagramTopologySummary` + step examination map (`MOD-08` §4.3 / `MOD-12`).
2. **Overview vs Steps vs Memory Ownership (No Cross-Section Dumps)**:
   - **Overview (`plainSummary` + Overview tab UI)**: owns whole-scenario Story Analogy + Story-to-Technical Key + high-level technical roadmap only. Never replay every Step’s APIs/handles/hex, and never host Memory forensics (VAD, `SEC_IMAGE`, `MEM_PRIVATE`, PEB offsets, RWX page proofs). The Overview tab must not embed full stage deep-dives, command breakdowns, or Memory block grids — only pointers into Steps/Memory.
   - **Steps**: own Scenario Briefing `#0` technical expansion (no Story repeat) plus per-stage deep-dives (`storyAnalogy` continuation, `simpleExplanation`, `howItWorksInPractice`, `detectionAndEvidence`) and stage structural conduits.
   - **Memory**: owns on-disk vs live-RAM forensic contrast when `memoryBlocks` exist (VAD cards, WHY notes, memory timeline).
   - **Cascading Process Execution Hierarchy** belongs on the dedicated **Process Hierarchy** Inspector tab; **Virtual Address Space (VAD) State Mutation** belongs on the Memory tab. Never leave either block on Overview.
3. **Stage Separation (`step.storyAnalogy` vs. `step.simpleExplanation`)**:
   - Never copy the opening story sentence into `simpleExplanation` or `howItWorksInPractice`. Instead, refer back to specific story nouns in short quotes (`"official armored bank truck"`, `"secret cargo bay"`).
4. **Node Inspector Ordering**:
   - Dedicated Node Inspector views must render the Plain-English Story Analogy card first and the Technical Forensic Role card directly underneath.
5. **Language & Character Hygiene**:
   - 100% standard technical English (`en-US`) across every scenario file, step guide, and 3D texture. Zero Persian, Arabic, or Japanese characters.
   - Replace literal `(why: ...)` prefixes with natural explanatory parentheticals: `(... so the host firewall treats the traffic as legitimate)`.
   - Inside `/lib/step-guides/*.ts` strings, avoid raw em-dashes (`—`), backticks, and `**bold**` markers (enforced automatically by `lib/scenario-step-guides.test.ts`).

---

## 5. Copy-Paste Scenario Authoring Template

Use this ready-to-fill skeleton whenever authoring or refactoring any scenario's text layers:

```ts
// 1. SCENARIO BRIEFING (#0 — Overview / Main Page)
briefing: {
  headline: '<Action-Oriented Scenario Headline>',
  storyAnalogy:
    'Imagine <protagonist & goal in a concrete real-world setting>. Instead of <obvious noisy approach>, they <physical action 1>, <physical action 2 explaining what each key prop does>, and <physical action 3>. <Why ordinary guards/checks initially trust it>.',
  plainSummary:
    'In this scenario (<MITRE ID / CVE, plain meaning>), <attacker/loader> on <victim host + IP> achieves <high-level objective> inside <trusted host process/service>, so <why the disguise works for AV/allowlisting/network trust>. The attack unfolds in one continuous arc: <readable stage-level beats without API/handle/hex dumps>. Steps #1–#N walk <what each later section examines>; <Memory tab shows why live state diverges from the trusted on-disk image if present>. Primary detection correlates <named SIEM/EDR signals> with <the anomalous trusted-host behavior>.',
},

// 2. BRIEFING STORY-TO-TECHNICAL KEY (4 or 6 Pairs)
storyMappings: [
  { storyTerm: '<Story Actor>', technicalTerm: '<Exact Process / Attacker IP / Identity>', tone: 'amber' },
  { storyTerm: '<Story Trusted Object>', technicalTerm: '<Exact Signed Host / Service / Target>', tone: 'sky' },
  { storyTerm: '<Story Core Trick or Key Prop #1>', technicalTerm: '<Exact API / Handle + Exact Purpose>', tone: 'rose' },
  { storyTerm: '<Story Guard / Alarm or Key Prop #2>', technicalTerm: '<Exact Event ID / Handle + Exact Purpose>', tone: 'emerald' },
],

// 3. PER-STAGE GUIDE (Repeat for each real Stage 1..N)
steps: [
  {
    stepNumber: 1,
    plainTitle: '<Verb-First Plain Stage Title>',
    storyAnalogy:
      '<Continuity from briefing/previous step>. <Concrete physical action 1 using named prop and stating what that prop unlocks or does>. <Concrete physical action 2 + visible physical result ready for 3D animation>.',
    simpleExplanation:
      'Executing "<quoted story action 1>", <exact actor/PID> invokes <exact API/CLI/protocol> (<inline plain-English explanation of what it is and why it works>), producing <exact return handle/code> (<inline explanation of which upcoming steps use it and why>).',
    howItWorksInPractice:
      'Under the hood, <exact kernel/runtime routine> (<what it does>) processes <exact structure/offset/flag> (<why it matters here>) and updates <exact state/permission mask> (<operational impact>), leaving <observable artifact in RAM, disk, or wire>.',
    detectionAndEvidence:
      'Documented in <exact Event ID / log channel> (<what that log records>): alert where <exact anomalous field comparison> (<why legitimate hosts differ>), then <concrete containment step>.',
  },
],
```

---

## 6. Cross-Scenario Quality Gate Checklist (`MOD-11`)

Before marking any scenario's texts complete, verify every item below:

- [ ] **Single Continuous Metaphor**: Do the Briefing, all Stages (`1..N`), and optional Memory Forensics share the exact same physical world and props?
- [ ] **Prop-Purpose Clarity**: Does every named story prop (such as Key #1 vs. Key #2, passcards, switches, or manifests) explicitly state what it unlocks/does in both the Story and Technical layers?
- [ ] **Zero Jargon in Story**: Do `briefing.storyAnalogy`, every `steps[i].storyAnalogy`, every `phases[k].storyExcerpt`, and every `callouts[k].title` pass `findTechnicalJargonInStory(text).length === 0`?
- [ ] **Explicit Story-to-Technical Mappings**: Does every section have 4 or 6 concrete `storyTerm → technicalTerm` pairs where distinct handles/props are mapped separately with their exact purpose?
- [ ] **Zero Duplication**: Are `briefing.storyAnalogy` and `briefing.plainSummary` 100% distinct (zero repeated sentences between Story and Technical)?
- [ ] **Steps `#0` Does Not Repeat Overview Story**: Does Steps Scenario Briefing use `omitStory` and expand technical detail instead of re-showing Overview Story / Story-to-Technical Key?
- [ ] **Overview Is Roadmap-Only**: Does `briefing.plainSummary` stay within 350–850 chars (hard max 950), clearly name WHO/WHERE/WHY/MITRE, give a readable one-breath arc, map what Steps (and Memory if present) will cover, and avoid replaying every Step’s APIs/handles/hex?
- [ ] **Memory Stays in Memory**: Are VAD / `SEC_IMAGE` / `MEM_PRIVATE` / PEB-offset forensic proofs absent from Overview and present only in Memory (and matching Step execution text where needed)?
- [ ] **Per-Token Inline Purpose Parentheticals in Deep-Dive Blocks**: Does **every** technical token inside `simpleExplanation`, `howItWorksInPractice`, `underTheHood`, and `stages[i].description` immediately include a plain-English parenthetical explaining WHAT it is and WHY it is used (with zero literal `(why:` prefixes)? Overview `plainSummary` is roadmap altitude and is **not** held to Step-level API density.
- [ ] **3D Animatability Check**: Does every stage's `storyAnalogy` describe concrete physical actions that a bespoke Three.js scene can literally animate without inventing unrelated props?
- [ ] **CI Tests Passing**: Do `lib/documentation-standards.test.ts`, `lib/scenario-step-guides.test.ts`, `lib/inspector-scope.test.ts`, and `lib/section-3d-registry.test.ts` all pass with zero failures?

---

## 7. Overview Migration Protocol (Inventory → Migrate → Rewrite → Verify)

Use this protocol whenever shortening an existing Overview that still dumps Steps/Memory deep-dive content. **Never delete first.** After a pilot is approved, expand enforcement by adding the next `AttackCategory` to `OVERVIEW_ROADMAP_ENFORCED_CATEGORIES` in `/lib/documentation-standards.ts` (MALWARE first).

1. **Inventory**: List every concrete fact in the current `briefing.plainSummary` (and authored `scenario.overview` if it still carries unique detail) clause-by-clause.
2. **Compare**: For each fact, mark whether it already exists in Steps `#1..#N`, Memory (`memoryBlocks` / Memory Story-Technical), or nowhere else.
3. **Migrate**: Move Overview-only facts into the correct owner section (Step deep-dive or Memory). Strengthen weak Step/Memory wording if Overview was the stronger source.
4. **Rewrite**: Replace Overview with Formula A2 (roadmap only). If a Cascading Process Execution Hierarchy exists, place it on the **Process Hierarchy** tab — never leave it on Overview. Full Inspector shell rules (Stage Filter, sidebar labels, Steps chrome) live in **`MOD-12`**.
5. **Verify**: Confirm every inventoried fact still appears somewhere; Overview has no Memory forensics dump; Steps still pass per-token clarity; UI tab label is **Overview** (not Overview & Deep-Dive); `MOD-12` checklist passes.
