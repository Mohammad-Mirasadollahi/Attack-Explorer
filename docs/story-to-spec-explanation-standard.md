# Story-to-Spec Explanation & Context-Aware Inspector Standard

> **Authoritative Engineering & Pedagogy Standard**  
> **Scope**: All 26+ Attack Scenarios (`lib/step-guides/*`, `lib/scenario-step-guides.ts`), Context-Aware Inspector Scopes (`lib/inspector-scope.ts`), and Right Inspector UI (`components/InspectorPanel.tsx`, `components/StepByStepGuidePanel.tsx`, `components/SelectedTelemetryDetail.tsx`).

---

## 1. Core Philosophy: Why "Story-to-Spec" Exists

Traditional cybersecurity documentation suffers from one of two extremes:
1. **Dry Textbook / Reference Manual Prose**: Lists raw API calls (`NtUnmapViewOfSection`, `VirtualAllocEx`, `snprintf`, `KTHREAD.PreviousMode`) without building a mental model of *why* the mechanism works or *why* the operating system/appliance is tricked.
2. **Oversimplified Marketing Summaries**: Uses vague metaphors ("the hacker breaks through the wall") that strip away the real engineering mechanics, leaving the reader unable to read SIEM logs, Sysmon telemetry, or packet captures.

The **Story-to-Spec Method** solves both problems by requiring every scenario briefing, every numbered attack step (`#1..#N`), and every expanded internal sub-board (`#N.1..#N.4`) to present **three synchronized layers side by side**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 1 · REAL-WORLD STORY ANALOGY (`storyAnalogy`)                          │
│ A concrete, physical-world story or everyday analogy that explains the       │
│ core trick intuitively (e.g., an armored truck frozen inside a garage,       │
│ a receptionist who dials a phone number written inside a visitor's name,     │
│ or a photocopier that copies the confidential sheet sitting next to a form). │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 2 · STORY ↔ SCENARIO TECHNICAL BRIDGE (`simpleExplanation` / `plainSummary`) │
│ Explicitly maps every character and object in the story to the exact         │
│ technical actor in the current scenario (`PID`, `IP:Port`, `System Call`,    │
│ `HTTP Header`, `Registry Key`, `Node ①..⑥`) so the user immediately learns   │
│ the real cybersecurity terminology in context.                               │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 3 · UNDER THE HOOD & SIEM FORENSIC CATCH (`howItWorksInPractice` + `detectionAndEvidence`) │
│ Explains the low-level OS/kernel/protocol invariant that makes the trick     │
│ possible AND the exact forensic mistake or telemetry trail (`Sysmon EventID`,│
│ `ETW Provider`, `Suricata SID`, `Audit Log`) that exposes the attacker.      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Anatomy of the 3 Layers (With Concrete Examples)

### Example A: Process Hollowing (`process-hollowing`, MITRE T1055.012)

#### Briefing Level (`Step #0 · Scenario Briefing`)
- **Layer 1 — `storyAnalogy` (The Intuitive Story)**:
  > *"Imagine an intruder who wants to enter a high-security bank without raising an alarm. Instead of breaking down the front door in a ski mask, they hire an official armored bank truck, freeze it inside the garage before the driver even starts the route, empty out all the legal bank cargo inside, load their own covert crew into the back of that exact armored truck, and release the brake. Every security camera and guard at the gate still sees the bank’s own trusted license plate and uniform."*
- **Layer 2 — `plainSummary` (The Story ↔ Scenario Technical Bridge)**:
  > *"In this scenario (MITRE ATT&CK T1055.012), the attacker wants to run malicious code on a Windows workstation (`10.20.4.18`) without triggering antivirus or application-allowlisting rules. Instead of launching an unknown `.exe` file directly, the dropper (`dropper.exe`, PID `4812`) creates a genuine Windows system process—`svchost.exe` (PID `9104`)—in a paused state (`CREATE_SUSPENDED`), hollows out its legitimate memory pages, writes the malicious PE payload into that empty space, repoints the CPU registers to the new entry point, and resumes the thread so the malware runs disguised as `svchost.exe`."*
- **Layer 3 — `diagramTopologySummary` & `documentedAdvisory` (Topology & Evidence)**:
  > *"On the diagram: Start at Node ③ (Win11 Workstation `10.20.4.18` / `dropper.exe` PID `4812`) and Node ④ (Hollowed `svchost.exe` PID `9104`), follow the 5 memory-manipulation stages inside the host, and watch the final outbound C2 beacon travel through Node ② (Firewall) to Node ①/⑤ (Attacker C2 `198.51.100.77:443`) while Node ⑥ (SIEM) captures the forensic trail."*

#### Step Level (`Step #1 .. #5`)
| Step | Layer 1 (`storyAnalogy`) | Layer 2 (`simpleExplanation` — Technical Bridge) | Layer 3 (`howItWorksInPractice` + `detectionAndEvidence` — Under the Hood & SIEM) |
| :--- | :--- | :--- | :--- |
| **Step #1: `CreateProcessW` (`CREATE_SUSPENDED`)** | Calling a badge-carrying security guard onto the stage, but pressing the **"Freeze"** button the millisecond they step through the door before they read their script. | `dropper.exe` (`PID 4812`) asks Windows to start `C:\Windows\System32\svchost.exe` (`PID 9104`) with `CREATE_SUSPENDED = 0x00000004` so the primary thread (`TID 9108`) is frozen at the starting line. | The Windows kernel allocates the process container and loads `ntdll.dll`, but holds `TID 9108` suspended. **SIEM Catch**: `Sysmon EventID 1` shows `svchost.exe` spawned by `dropper.exe` instead of `services.exe`. |
| **Step #2: `NtUnmapViewOfSection`** | Opening the back doors of the frozen armored truck in the garage and removing every crate of genuine bank cargo, leaving an empty shell with the real license plate. | `dropper.exe` reads the Process Environment Block (`PEB`) to locate `ImageBaseAddress = 0x00007FF7A1200000` and calls `NtUnmapViewOfSection` to strip the legitimate `svchost.exe` code out of RAM. | `NtUnmapViewOfSection` releases the memory section mapped from disk, leaving a hollow process container. **SIEM Catch**: `Sysmon EventID 10` (`GrantedAccess 0x1FFFFF`) & `EventID 25` (`ProcessTampering`). |
| **Step #3: `VirtualAllocEx` & `WriteProcessMemory`** | Loading the intruder’s covert crew and custom route manual into the emptied truck without touching the exterior paint job. | `dropper.exe` allocates `0x38000` bytes at `0x7FF7A1200000` with `PAGE_EXECUTE_READWRITE` (`0x40`) permissions and writes the malicious PE (`MZ` header) into `svchost.exe`. | Legitimate binaries separate `.text` (`RX`) and `.data` (`RW`). Private `RWX` memory containing an `MZ` (`4D 5A 90 00`) header is a primary injection indicator (**ETW `EtwTiLogAllocVMRemote`**). |
| **Step #4: `SetThreadContext` & `ResumeThread`** | Turning the frozen driver’s steering wheel toward the secret destination (`0x7FF7A12014E0`) and pressing **"Unfreeze"**. | `SetThreadContext` overwrites the CPU’s `RCX` register on `TID 9108` to point to `0x00007FF7A12014E0`, and `ResumeThread` decrements `SuspendCount` from `1 → 0`. | On x64 Windows, `RCX` holds the user-mode entry point before `RtlUserThreadStart` runs. **SIEM Catch**: `Sysmon EventID 25` ("Image is replaced"). |
| **Step #5: Outbound HTTPS C2 Beacon** | The disguised truck drives past the perimeter guard (`Firewall`), who trusts the `svchost.exe` badge—until the central security desk notices that truck had no scheduled route (`-k <ServiceGroup>`). | Running inside `svchost.exe` (`PID 9104`), the payload opens a TLS 1.3 connection to `198.51.100.77:443`. | Genuine `svchost.exe` always runs with `-k <ServiceGroup>` under `services.exe`. **SIEM Catch**: `Sysmon EventID 3` + Suricata JA3 `72a589da586844d7f0818ce684948eea`. |

---

### Example B: Citrix Bleed (`splunk-citrix-bleed-session-hijack`, CVE-2023-4966)

- **Layer 1 (`storyAnalogy`)**:
  > *"Imagine asking a hotel clerk to write your name on six lines of a 1-page welcome form, and then photocopy that page for you. Instead of giving a normal 10-letter name, you hand the clerk a 24,000-letter name (`Host:` header). The clerk’s 1-page form runs out of space after line 5, so the clerk stops writing—but when they walk over to the photocopier, they tell the machine: 'Copy 147,000 letters worth of paper from my desk!' The photocopier copies the 1-page welcome form PLUS the confidential ledger sitting right next to it on the desk—which contains the active VIP room key (`NSC_AAAC` session cookie) of an administrator who already passed MFA."*
- **Layer 2 (`simpleExplanation`)**:
  > *"The attacker sends an unauthenticated HTTPS GET request to `/oauth/idp/.well-known/openid-configuration` on the Citrix NetScaler Gateway with a 24,576-byte `Host` header. Because NetScaler inserts the `Host` header six times into a JSON template using `snprintf()`, `snprintf()` returns the theoretical length (~147 KB) rather than the actual buffer size (131 KB)—causing the server to transmit ~16 KB of raw adjacent heap memory containing an active 65-character `NSC_AAAC` session cookie."*
- **Layer 3 (`howItWorksInPractice` + `detectionAndEvidence`)**:
  > *"In C, `snprintf()` returns the number of bytes that *would* have been written if the buffer were infinitely large. Passing that return value unchecked to the HTTP response writer leaks adjacent heap memory (`CVE-2023-4966`), and replaying `Cookie: NSC_AAAC=<token>` bypasses password and MFA checks until active AAA sessions are explicitly terminated (`kill aaa session`)."*

---

## 3. Data Schema & TypeScript Contracts

Every scenario in `lib/step-guides/core-and-paloalto-guides.ts` and `lib/step-guides/ms-cisco-kaspersky-guides.ts` must conform to `RawScenarioStepGuideData` defined in `lib/scenario-step-guides.ts`:

```ts
export interface RawScenarioBriefingGuide {
  /** Concise, descriptive title of the scenario briefing */
  headline: string;
  /** LAYER 1: Intuitive real-world story analogy explaining the whole attack chain */
  storyAnalogy: string;
  /** LAYER 2: Story-to-Scenario technical bridge naming the exact processes, CVEs, IPs, and MITRE IDs */
  plainSummary: string;
  /** LAYER 3: Explicit mapping to Diagram Nodes ①..⑥ and bidirectional arrows (#N.1→ / ⇠#N.2) */
  diagramTopologySummary: string;
  /** Authoritative source citation (CISA Advisory, CVE, Vendor Report, MITRE ATT&CK ID) */
  documentedAdvisory: string;
}

export interface RawScenarioStepGuideItem {
  /** 1-based stage index matching scenario.stages[i].index */
  stepNumber: number;
  /** MITRE ATT&CK technique ID (e.g., 'T1055.012') */
  mitreId: string;
  /** Clear, human-readable title combining the action and the technical artifact */
  plainTitle: string;
  /** LAYER 1: Vivid real-world story analogy for this specific step */
  storyAnalogy: string;
  /** LAYER 2: Technical bridge connecting the analogy to the exact API, packet, PID, or file in this step */
  simpleExplanation: string;
  /** LAYER 3A: Deep engineering explanation of why the OS/protocol behaves this way under the hood */
  howItWorksInPractice: string;
  /** LAYER 3B: Exact node-to-node and sequence-number alignment on the canvas (#N.1→ and ⇠#N.2) */
  diagramAlignment: string;
  /** LAYER 3C: Documented SIEM / Sysmon / EDR / Network forensic evidence that catches this step */
  detectionAndEvidence: string;
}
```

---

## 4. Authoring Rules for New Scenarios & Steps

When adding a new attack scenario or editing an existing one, follow these **7 mandatory authoring rules**:

1. **Never Write Textbook Definitions Without a Story (`storyAnalogy`)**:
   - Every `briefing.storyAnalogy` must be at least 100 characters long and tell a cohesive, concrete story (e.g., a bank vault, reception desk, photocopier, hotel keycard, pneumatic tube, or factory assembly line).
   - Every `step.storyAnalogy` must be at least 60 characters long and continue or focus that metaphor on the exact action of that step.
2. **Always Pair Metaphors With Exact Technical Terms in Parentheses**:
   - Inside `storyAnalogy` and `simpleExplanation`, bridge the everyday concept to the technical term right next to it, e.g., *"the prison operator (`Corporate DNS Resolver 10.20.1.53`)"*, *"the VIP wristband (`NSC_AAAC` session cookie)"*, or *"pressing the Freeze button (`CREATE_SUSPENDED = 0x00000004`)"*.
3. **Zero Fabricated Facts (Strict Grounding Rule)**:
   - Use **only** the CVEs, MITRE technique IDs, process names, file paths, registry keys, IP addresses, ports, and Event IDs documented in the scenario’s authoritative advisory (`CISA`, `Mandiant`, `Unit 42`, `Elastic Security Labs`, `Microsoft Threat Intelligence`, `Cisco Talos`, `Kaspersky GReAT`, `Splunk SURGe`).
   - Do not invent fictional tools, CVEs, or unverified attributions.
4. **Explicit Diagram Node & Sequence Alignment (`diagramAlignment`)**:
   - Every `step.diagramAlignment` **must** reference the exact forward arrow `#<stepNumber>.1` (e.g., `#1.1→`, `#2.1→`, `#3.1→`), the return arrow `⇠#<stepNumber>.2`, and the circled node numbers (`Node ①` .. `Node ⑥`).
5. **Actionable Defender / SIEM Evidence (`detectionAndEvidence`)**:
   - Every step must state the exact log source and identifier that detects the action (e.g., `Sysmon EventID 1 / 7 / 8 / 10 / 22 / 25`, `Windows Security EventID 4769 / 4624 / 1102`, `Suricata SID`, `Zeek dns.log`, `Entra AuditLogs`).
6. **100% English-Only Strings in Codebase**:
   - All TypeScript/React source files (`lib/**`, `components/**`) must use English-only strings. Automated tests (`lib/scenario-step-guides.test.ts` and `lib/simulation-engine.test.ts`) assert `/[\u0600-\u06FF]/.test(...) === false`.
7. **Zero-Truncation UI Rule**:
   - Never use the CSS `truncate` class (`text-overflow: ellipsis`) on any narrative, title, badge, or specification in `InspectorPanel.tsx` or `StepByStepGuidePanel.tsx`. Always allow multi-line wrapping with `leading-snug` / `leading-relaxed` and `break-words`.

---

## 5. Context-Aware Inspector Scope & Dynamic Scope Badge Standard

The right `InspectorPanel` must always answer: **"Where am I right now, and what is documented about this place?"**

### 5.1 Three Explicit Scope Modes (`InspectorScopeMode`)

Defined in `lib/inspector-scope.ts`:

| Scope Mode | When Active | Header Badge Text (`scopeBadgeText`) | Header Badge Color Theme | Inspector Content Scope |
| :--- | :--- | :--- | :--- | :--- |
| **`MAIN_SCENARIO`** | Viewing the main 6-node network topology (or when `Scenario View` override is toggled) | `"Scenario"` | **Emerald** (`bg-emerald-600 text-white`, `data-scope-mode="MAIN_SCENARIO"`) | Global scenario briefing, 3-layer Story-to-Spec overview, stage `#1..#N` step guide, global SIEM logs, and scenario sources. |
| **`EXPANDED_NODE`** | User double-clicked / expanded a parent node (`①..⑥`) into its internal sub-board | `"Expanded: Node #N · <Label>"` | **Amber** (`bg-amber-500 text-slate-950`, `data-scope-mode="EXPANDED_NODE"`) | Expanded node’s internal sub-board (`subBoardStoryAnalogy`, `architectureNote`, `environmentBreadcrumb`, `sequenceLineage`), 5 internal sub-nodes (`#N.1..#N.5`), 4 internal pipeline steps (`#N.1..#N.4`), and scoped internal SIEM logs. |
| **`INTERNAL_SUBNODE`** | User clicked a specific internal sub-node (`#N.1..#N.5`) inside an expanded board | `"Internal: #N.M · <SubNode Label>"` | **Rose / Crimson** (`bg-rose-600 text-white`, `data-scope-mode="INTERNAL_SUBNODE"`) | Selected internal sub-node’s `activitySummary`, `internalSummary`, `hostContext`, zone boundary, and **only** the internal sub-flows (`relatedSubFlows`) and SIEM logs connected to that sub-node. |

### 5.2 Dynamic Scope Navigation & Override Controls

1. **Single-Click vs. Double-Click**:
   - **Single-click** on a main-board node selects it and shows a `Selected Main-Board Node Card` (`data-testid="inspector-selected-main-node-card"`) with an `"Expand Internal Pipeline"` CTA without leaving `MAIN_SCENARIO` scope.
   - **Double-click** (or clicking the `EXPAND` badge) enters the node’s internal sub-board and switches the Inspector to `EXPANDED_NODE`.
2. **Sub-Node Selection Inside Expanded Board**:
   - Clicking any internal sub-node (`#N.1..#N.5`) on the canvas or in the Inspector switches the scope to `INTERNAL_SUBNODE` and filters Steps and SIEM Logs to flows touching that sub-node.
3. **Temporary Scenario View Override (`scopeOverride = 'MAIN_SCENARIO'`)**:
   - While inside an expanded node, clicking `"Scenario View"` (`data-testid="inspector-scope-scenario-btn"`) lets the user inspect the global scenario Overview/Steps/Logs **without collapsing their expanded diagram on the canvas**.
   - Clicking `"Return to Expanded: Node #N..."` (`data-testid="inspector-return-to-expanded-scope-btn"`) immediately restores the expanded scope in the Inspector.
4. **Back to Main Topology (`Main Topology`)**:
   - Clicking `"Main Topology"` (`data-testid="inspector-back-to-main-topology-btn"`) or pressing `Escape` exits the expanded sub-board and restores `MAIN_SCENARIO`.

---

## 6. Verification & Automated Test Suite

Whenever you add or modify scenario guides or Inspector scope logic, run the automated test suite:

```bash
npx --yes tsx --test lib/inspector-scope.test.ts lib/scenario-step-guides.test.ts lib/simulation-engine.test.ts
```

The test suite verifies:
- All 26 scenarios and all 80 steps exist and match stage counts (`validateAllScenarioStepGuides`).
- Every scenario briefing and every step has non-empty `storyAnalogy`, `simpleExplanation`, `howItWorksInPractice`, `diagramAlignment`, and `detectionAndEvidence` fields meeting minimum length thresholds.
- Zero Persian/Arabic characters exist in any scenario or step-guide module.
- Zero forbidden `truncate` classes exist in guarded workbench components.
- `resolveInspectorScopeContext`, `buildScopedStepGuideModel`, and `buildScopedCorrelatedLogs` transition deterministically across `MAIN_SCENARIO`, `EXPANDED_NODE`, and `INTERNAL_SUBNODE`.

---

## 7. Official Analytical Websites & Threat Intelligence Portals Used

Every scenario, telemetry event, and **Story-to-Spec** explanation in this repository is grounded in published technical analyses from the following official websites and threat-intelligence portals (for the full 26-scenario URL index, see [`/docs/analytical-sources-and-references.md`](./analytical-sources-and-references.md)):

1. **MITRE ATT&CK® Enterprise Matrix (v15)** — [https://attack.mitre.org/](https://attack.mitre.org/)
2. **CISA Cybersecurity Advisories & KEV Catalog** — [https://www.cisa.gov/news-events/cybersecurity-advisories](https://www.cisa.gov/news-events/cybersecurity-advisories) & [https://www.cisa.gov/known-exploited-vulnerabilities-catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
3. **Microsoft Threat Intelligence (MSTIC) Security Blog** — [https://www.microsoft.com/en-us/security/blog/](https://www.microsoft.com/en-us/security/blog/)
4. **Microsoft Learn — Sysinternals Sysmon & Windows Security Auditing** — [https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon)
5. **Palo Alto Networks — Unit 42 Threat Research** — [https://unit42.paloaltonetworks.com/](https://unit42.paloaltonetworks.com/)
6. **Elastic Security Labs** — [https://www.elastic.co/security-labs](https://www.elastic.co/security-labs)
7. **Mandiant / Google Cloud Threat Intelligence** — [https://cloud.google.com/blog/topics/threat-intelligence/](https://cloud.google.com/blog/topics/threat-intelligence/)
8. **Cisco Talos Intelligence Group** — [https://blog.talosintelligence.com/](https://blog.talosintelligence.com/)
9. **Kaspersky GReAT (Securelist)** — [https://securelist.com/](https://securelist.com/)
10. **Splunk SURGe & Security Research Team (STRT)** — [https://www.splunk.com/en_us/blog/security.html](https://www.splunk.com/en_us/blog/security.html)
11. **Avast Decoded Threat Labs** — [https://decoded.avast.io/](https://decoded.avast.io/)
12. **NCSC-NL (Netherlands MIVD / AIVD) & FortiGuard Labs PSIRT** — [https://english.ncsc.nl/](https://english.ncsc.nl/) & [https://www.fortiguard.com/psirt](https://www.fortiguard.com/psirt)
13. **F5 SIRT Security Advisories** — [https://my.f5.com/manage/s/article/K000137353](https://my.f5.com/manage/s/article/K000137353)
14. **NIST National Vulnerability Database (NVD)** — [https://nvd.nist.gov/](https://nvd.nist.gov/)
15. **SigmaHQ Open SIEM Detection Community** — [https://github.com/SigmaHQ/sigma](https://github.com/SigmaHQ/sigma)

