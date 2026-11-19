# Module 02 — Writing Style, Tone, Voice & 3-Layer Story-to-Spec Pedagogy (`MOD-02`)

> **Module ID**: `MOD-02`  
> **Scope**: Prose style, grammatical voice, language purity, forbidden buzzwords, and the 3-Layer Story-to-Spec pedagogical framework across all scenarios, step guides, and documentation.  
> **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Related Deep-Dive**: [`/docs/story-to-spec-explanation-standard.md`](../story-to-spec-explanation-standard.md) · **Enforced By**: `/lib/documentation-standards.ts`

---

## 1. Purpose & Core Philosophy

Cybersecurity documentation fails when it is either **inaccessible to junior analysts** (listing raw syscalls and hex offsets with zero conceptual intuition) or **useless to senior engineers** (relying on vague marketing clichés with zero forensic precision).

Module 02 enforces a unified **Pedagogical Engineering Voice**: every piece of writing in **Attack Explorer** starts with intuitive human comprehension and bridges deterministically to low-level operating system, network protocol, and SIEM forensic reality.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 1 · REAL-WORLD STORY ANALOGY (`storyAnalogy`)                          │
│ Concrete physical-world metaphor explaining WHY the trick works intuitively. │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 2 · STORY ↔ SCENARIO TECHNICAL BRIDGE (`plainSummary` / `simpleExplanation`) │
│ Maps every object in the story to the exact PID, IP:Port, CVE, API, or Node. │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 3 · UNDER THE HOOD & SIEM CATCH (`howItWorksInPractice` + `detection`) │
│ Explains the OS/kernel/protocol invariant AND the exact forensic log catch.  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Mandatory Tone, Voice & Language Rules

### Rule 1 — 100% English Technical Corpus (Zero Localization Contamination)
- Every character in `/lib/**`, `/components/**`, `/app/**`, `/docs/**`, `/seo-audit/**`, and `/public/llms*.txt` **must** be written in standard technical English (`en-US`).
- Zero Persian, Arabic, Cyrillic, or CJK characters (`[\u0600-\u06FF]`) may appear anywhere in codebase strings or documentation files.

### Rule 2 — Active, Present-Tense, Deterministic Voice
- **Write in the active, indicative present tense**:
  - ✅ *"`Invoice_Q4.exe` (`PID 3104`) calls `CreateProcessW` with `CREATE_SUSPENDED = 0x00000004` to spawn `svchost.exe` (`PID 4892`)."*
  - ❌ *"A process might be created in a suspended state by the malware so that memory could potentially be hollowed out."*
- Always name the **Subject Actor** (process, host, threat actor, or sensor), the **Exact Verb/API**, and the **Target Artifact**.

### Rule 3 — Answer-First Lead Paragraphs (Inverted Pyramid Structure)
- The opening 40–60 words of every `scenario.overview`, `multiSourceSynthesis`, and Markdown section **must** immediately answer:
  1. **Who / Which Advisory?** (e.g., *Grounded in CISA Advisory AA23-353A and Mandiant research on ALPHV/BlackCat...*)
  2. **What Vector & Mechanism?** (e.g., *...affiliates authenticate the Rust-compiled Sphynx binary using `-k <access-token>`, enable remote symlink evaluation via `fsutil.exe`, and exfiltrate shares via `ExMatter`...*)
  3. **What Forensic Pivot?** (e.g., *...generating Sysmon Event ID 1, Event ID 11, and ESXi `/var/log/shell.log` artifacts.*)

### Rule 4 — Forbidden Marketing Fluff & Vague Buzzwords
Never use empty hype adjectives or unquantified claims in technical descriptions:
- **Forbidden**: *"cutting-edge"*, *"next-generation"*, *"super sophisticated hacker"*, *"seamless"*, *"revolutionary"*, *"magic trick"*, *"breaks through the firewall somehow"*.
- **Required Replacement**: Replace adjectives with **quantified mechanics** (e.g., instead of *"a sophisticated memory trick"*, write *"a 6-byte x64 prologue patch (`B8 57 00 07 80 C3` -> `mov eax, 0x80070057; ret`) written to `amsi.dll!AmsiScanBuffer` at `0x7FF91A042480`"*).

### Rule 5 — Sentence Density & Rhythm Discipline
- Keep sentences between **18 and 45 words** on average.
- When a single sentence chains 2–3 technical steps together, separate the clauses clearly and attach an inline purpose parenthetical (`MOD-03`) immediately after each technical token so the reader never loses track of cause and effect.

---

## 3. Concrete Before & After Examples (❌ Anti-Pattern vs. ✅ Canonical Pattern)

### ❌ Anti-Pattern (Vague, Passive, No Story-to-Spec Bridge)
> In this step, the attacker uses a very advanced technique to bypass .NET security. A container file is opened by the user and then environment variables are modified so that a malicious DLL is loaded by a legitimate program to evade antivirus detection.

### ✅ Canonical Pattern (3-Layer Story-to-Spec + Pure Jargon-Free Story + Active Voice)
> - **Layer 1 (`storyAnalogy` — 100% jargon-free per `MOD-08` & `MOD-11`)**: Imagine shipping a locked virtual cargo container across a border so every item hidden inside bypasses the customs inspection stamp, stashing the real tools behind a false storage wall, and flipping an official diagnostic inspection switch before starting a trusted armored company van so the van's own maintenance engine automatically bolts on and runs the intruder's custom module.
> - **Story-to-Technical Key (`storyMappings` per `MOD-08`)**: `Locked Virtual Cargo Container → Weaponized .vhdx Bypassing Mark-of-the-Web (Zone.Identifier)` · `False Storage Wall → Hidden + System Attributes (attrib +h +s)` · `Official Diagnostic Switch → COR_ENABLE_PROFILING=1 & COR_PROFILER_PATH` · `Trusted Armored Company Van → Signed KeePass.exe Loading clr.dll + PerformanceTrace.dll`.
> - **Layer 2 (`simpleExplanation`)**: Opening the "locked virtual cargo container" (`Salary_Review.vhdx`) causes Windows `disk.sys` to mount virtual drive `E:\` without propagating the parent file's `Zone.Identifier` NTFS Alternate Data Stream (allowing enclosed files to execute without SmartScreen download warnings). The visible shortcut (`Document.pdf.lnk`) launches a hidden batch script (`E:\launcher.bat`, concealed behind the "false storage wall" via `attrib +h +s`) that flips the "official diagnostic switch" (`COR_ENABLE_PROFILING=1`, `COR_PROFILER={B7A3...}`, and `COR_PROFILER_PATH=E:\PerformanceTrace.dll`) before starting the legitimate signed binary `KeePass.exe` (`PID 6420`).
> - **Layer 3 (`howItWorksInPractice` + `detectionAndEvidence`)**: During .NET Common Language Runtime initialization, `clr.dll!ProfilingAPIUtility::LoadProfiler` checks the process environment block for `COR_ENABLE_PROFILING=1` and loads the unmanaged COM DLL specified in `COR_PROFILER_PATH` directly into `KeePass.exe`, executing `ICorProfilerCallback::Initialize` without triggering SmartScreen or AppLocker rules. **SIEM Catch**: Correlate Windows VHD Mount Event ID `12` (`Microsoft-Windows-VHDMP-Operational`), Sysmon Event ID `1` showing `cmd.exe` setting `COR_ENABLE_PROFILING=1`, and Sysmon Event ID `7` (`ImageLoaded`) where `KeePass.exe` loads an unsigned `PerformanceTrace.dll`.

---

## 4. Verification Checklist (`MOD-02`)

- [ ] Are all strings 100% English (`en-US`) with zero Persian/Arabic/Japanese characters?
- [ ] Does every scenario and step include all three layers (`storyAnalogy`, `plainSummary`/`simpleExplanation`, and `howItWorksInPractice` + `detectionAndEvidence`)?
- [ ] Is Layer 1 (`storyAnalogy`) 100% jargon-free (paired with explicit `storyMappings` per `MOD-08` and field formulas per `MOD-11`)?
- [ ] Does the opening technical paragraph follow the **Answer-First** structure (Advisory/Actor + Mechanism + Forensic Pivot)?
- [ ] Have all vague buzzwords been replaced with exact API names, hex constants, PIDs, and Event IDs?
