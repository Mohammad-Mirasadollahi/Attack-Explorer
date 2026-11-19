# Canonical Story-to-Technical & 3D Section Standard (`MOD-08`)

> **Module ID**: `MOD-08` · **Parent Index**: [`/docs/standards/README.md`](./README.md)  
> **Scope**: All Scenario Briefings (`#0`), Kill-Chain Stages (`Stage 1..N`), Memory Forensics Sections, Node Inspector Cards, and Dedicated Scenario Landing Pages (`/scenarios/[id]`) using `StandardStoryTechnicalSection`.  
> **Status**: Mandatory Permanent Standard · Enforced by `/lib/section-3d-registry.test.ts` and `/lib/inspector-scope.test.ts`.

---

## 1. Purpose & Reference Benchmark

The **Process Hollowing & Cobalt Strike Beacon Loader** Overview established the canonical educational layout for Attack Explorer. Every scenario section—whether an executive briefing, an individual kill-chain stage, a virtual memory comparison, or a focused node inspector view—must deliver the same cognitive flow so learners understand the real-world mental model **first**, see exact translations to OS/network primitives **second**, read numbered forensic specifications **third**, and watch the story animate in Three.js **fourth**.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  1. STORY ANALOGY CARD (Amber Surface · FIRST)                             │
│     • 100% plain-language, jargon-free real-world storytelling             │
│     • Continuous metaphor world shared across the entire scenario          │
│  ────────────────────────────────────────────────────────────────────────  │
│  1B. STORY-TO-TECHNICAL KEY (Directly inside Amber Card)                   │
│     [Story Object Badge]  ──▶  Exact Technical Counterpart (OS / Protocol) │
│     (Minimum 4 explicit translation pairs per section)                     │
├────────────────────────────────────────────────────────────────────────────┤
│  2. TECHNICAL FORENSIC EXPLANATION (Directly BELOW Story)                  │
│     [#X.1] Technical clause explicitly referencing story objects by name   │
│     [#X.2] Exact APIs, PIDs, hex constants + inline purpose parentheticals │
├────────────────────────────────────────────────────────────────────────────┤
│  3. FULL-WIDTH INTERACTIVE THREE.JS 3D STAGE (Directly BELOW Text)         │
│     • Full section width + Full-Page modal mode                            │
│     • Standard control dock (Play/Pause, Replay, Acts, Speed, Cutaway,     │
│       4 Camera Angles, Labels, Bloom, Hide Controls, Timeline Scrubber)    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Rule 1 — 100% Jargon-Free Story Analogy Layer

Every section's Story Analogy (`briefing.storyAnalogy`, `steps[i].storyAnalogy`, `descriptor.storyCue`, `phases[i].storyExcerpt`, and floating `callouts[i].title`) must read like a self-contained physical story that a non-technical reader understands immediately without a glossary.

1. **Zero Leaked Technical Tokens in Story Prose**: Never place Windows/Linux API names (`CreateProcessW`, `NtUnmapViewOfSection`, `VirtualAllocEx`), hexadecimal constants (`0x00400000`, `0x40`, `0x1FFFFF`), CPU registers (`RCX`, `RIP`), memory protection flags (`RWX`, `SEC_IMAGE`, `MEM_PRIVATE`), PE headers (`MZ`, `.text`), process filenames (`svchost.exe`), or telemetry IDs (`Sysmon EID 25`, `PID 4892`) inside the Story Analogy paragraph or floating callout titles.
2. **Programmatic Enforcement**: All Story strings are checked automatically by `findTechnicalJargonInStory(text)` in `/lib/section-3d-registry.ts`. The function must return an empty array `[]`.
3. **Single Continuous Metaphor World per Scenario**: Do not switch metaphors mid-scenario (for example, starting with an Armored Bank Truck in the Overview and suddenly switching to a theater stage guard in Stage 1). Every step advances the same physical cast, setting, and stakes introduced in the Scenario Briefing.

---

## 3. Rule 2 — Mandatory Story-to-Technical Translation Key (`storyMappings`)

Directly beneath the plain-language Story paragraph (inside the same amber Story card, above the Technical Forensic Explanation), render an explicit **Story-to-Technical Key** grid (`StoryTechnicalMapping[]`) containing at least **4 concrete mappings** for that section:

| Field | Requirement | Example (Process Hollowing · Stage 1) |
| :--- | :--- | :--- |
| `storyTerm` | Short plain-language noun or action phrase from the Story paragraph (zero technical jargon). | `Garage Freeze Switch` |
| `technicalTerm` | Exact OS, protocol, API, hex flag, or telemetry equivalent. | `CREATE_SUSPENDED = 0x00000004 (TID 4896 Halted)` |
| `tone` | Semantic badge color (`'sky' \| 'rose' \| 'amber' \| 'emerald'`). | `'amber'` |

This explicit bridge eliminates the mental leap between storytelling and forensic engineering: readers never have to guess which physical prop corresponds to which kernel object or network artifact.

---

## 4. Rule 3 — Strict Non-Duplication & Ordering Between Story and Technical Blocks

1. **Story Always Precedes Technical**:
   - In `StandardStoryTechnicalSection`, `ProcessMemoryView`, `StepByStepGuidePanel`, `app/scenarios/[id]/page.tsx`, and `InspectorPanel` (both Main Page and Selected Node views), the Amber **Story Analogy** card renders first, followed directly underneath by the numbered **Technical Forensic Explanation**.
2. **Zero Duplicate Text Between Main Page Story and Technical Overview**:
   - Never pass the concatenated `scenario.overview` (`${storyAnalogy} ${plainSummary}`) to both `storyAnalogy` and `technicalText`.
   - Always feed pure `rawGuide.briefing.storyAnalogy` to the Story card and pure `rawGuide.briefing.plainSummary` to the Technical Architecture & Forensic Overview card.
   - `resolveInspectorScopeContext` in `/lib/inspector-scope.ts` must resolve `scopedStoryAnalogy` for `MAIN_SCENARIO` from pure `briefing.storyAnalogy` (never concatenated `scenario.overview`).
   - As an additional safeguard, `StandardStoryTechnicalSection` runs `deduplicateTechnicalClausesAgainstStory()` to strip any duplicated opening sentence and renumber technical clauses cleanly (`#0.1`, `#1.1`, `#M.1`).
3. **Explicit Metaphor Callbacks & Per-Token Inline Plain-English Why (`MOD-03` + `MOD-11`)**:
   - Technical clauses across **every** sub-block (`briefing.plainSummary`, `simpleExplanation`, `howItWorksInPractice`, `underTheHood`, and `stages[i].description`) must anchor each operation back to its story counterpart in quotes AND attach a clear plain-English parenthetical `(...)` immediately after **every** technical API, syscall, kernel struct, hex flag, handle, or Event ID explaining **what it is and why it is used here**.
   - Whenever a Story section introduces named or paired props (e.g., *"two golden master keys"*), **both** the Story text and `storyMappings[]` must explicitly explain the distinct job of each prop (for example, Key #1 `hProcess = 0x01C4` unlocks RAM edits in Steps #2–#3; Key #2 `hThread = 0x01C8` unlocks CPU register steering and thread resumption in Step #4).
   - **Automated Enforcement**: Every upgraded section must pass `validateSectionFullClarityStandard()` (`validateStoryPropClarity` + `validateTechnicalSectionInlineClarity`) in `/lib/documentation-standards.ts`.

---

## 5. Rule 4 — Uniform Overview UI Control & Layout Contract

Every interactive section across the application—Overview, Steps 1..N, Memory Forensics, and SEO Landing Pages—must share the exact same **Overview-standard UI shell** (`StandardStoryTechnicalSection` + `ScenarioSection3DEmbed` + `AnimeSection3DStage`):

- **Full-Width Embedded Stage**: Positioned directly beneath the Story + Technical explanation at 100% of the section container width, with a one-click **Full Page** expansion mode.
- **Identical Control Layout Across Every Section**:
  - Top-left: Translucent Act/Phase HUD card displaying `ACT XX / YY`, stage tag, MITRE ID, story quote, and technical parallel.
  - Top-right: `Cutaway` mode toggle (`AUTO` / `OPEN` / `SEALED`) + `Full Page` toggle button.
  - Bottom-center toggle pill: `Hide Controls` / `Show Controls` so users can inspect the unobstructed 3D viewport at any time.
  - Collapsible bottom dock: `Play/Pause`, `Replay`, numbered **Act/Phase jump buttons**, playback speed (`0.5x`, `1x`, `1.5x`), `4 Camera Angle` preset buttons, `Labels` toggle, `Bloom` toggle, and interactive timeline scrubber.

---

## 6. Anti-Pattern vs. Canonical Example

- **Anti-Pattern (Rejected)**:
  - Putting `"Inside the emptied svchost.exe, the attacker calls VirtualAllocEx with RWX 0x40 to carve a 264 KB vault"` inside the Story card.
  - Naming *"two golden master keys"* in the Story without stating what each key unlocks, or lumping `hProcess` & `hThread` into one mapping line without explaining their roles.
  - Dumping dense kernel chains (`CreateProcessW`, `CREATE_SUSPENDED`, `NtCreateUserProcess`, `EPROCESS`, `ntdll.dll`, `0x00400000`, `RtlUserThreadStart`, `SuspendCount`, `PROCESS_ALL_ACCESS`) inside `howItWorksInPractice` without per-token plain-English parentheticals.
  - Passing `scenario.overview` to both `storyAnalogy` and `technicalText`, causing duplicate text in Main Page Inspector.
- **Canonical Implementation (Required)**:
  - Story card: `"The intruder slams a freeze switch and pockets two golden master keys: the first master key unlocks the rear cargo bay so the intruder can empty the bank gold and load their covert crew, and the second master key unlocks the driver cab and ignition so they can later change the GPS route and release the brake."`
  - Story-to-Technical Key: `Cargo-Door Master Key (Key #1) → Process Handle hProcess (0x01C4) · Unlocks RAM Edits in Steps #2–#3` + `Cab & Ignition Master Key (Key #2) → Thread Handle hThread (0x01C8) · Unlocks CPU Steer & Wake in Step #4`.
  - Technical & Deep-Dive clauses: Every single API, struct, flag, address, and handle immediately carries a plain-English parenthetical explaining what it is and why it is used.

---

## 7. Pre-Merge Verification Checklist (`MOD-08`)

- [ ] Does every Story Analogy paragraph, phase excerpt, and floating callout title return `[]` from `findTechnicalJargonInStory()`?
- [ ] Does every named or paired Story prop explicitly state what it unlocks/does in both Story prose and `storyMappings[]` (`validateStoryPropClarity()`)?
- [ ] Does every section define 4 or 6 explicit `storyMappings` rendered directly inside the Story card?
- [ ] Does every technical block (`plainSummary`, `simpleExplanation`, `howItWorksInPractice`, `underTheHood`, `stages[].description`) pass `validateTechnicalSectionInlineClarity()` with per-token plain-English why parentheticals?
- [ ] Are `storyAnalogy` and `technicalText` sourced separately (`briefing.storyAnalogy` vs. `briefing.plainSummary`) with zero duplicated sentences?
- [ ] Does Story always render above Technical across Overview, Steps, Memory Forensics, Node Inspector, and `/scenarios/[id]`?
- [ ] Does every section use the exact Overview-standard button bar, cutaway control, 4 camera angles, and Full-Page mode?
