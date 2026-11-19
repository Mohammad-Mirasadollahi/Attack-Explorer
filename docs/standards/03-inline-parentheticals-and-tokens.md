# Module 03 — Technical Tokens, Inline Purpose Parentheticals & Command Breakdowns (`MOD-03`)

> **Module ID**: `MOD-03`  
> **Scope**: Formatting of technical identifiers, mandatory `Action + Inline Why` parenthetical explanations, and token-by-token CLI command decomposition.  
> **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Related Deep-Dive**: [`/docs/inline-purpose-parenthetical-standard.md`](../inline-purpose-parenthetical-standard.md) · **Enforced By**: `/lib/documentation-standards.ts` & `/lib/command-line-explanations.test.ts`

---

## 1. Purpose & Core Rule (`Action + Inline Why`)

Whenever a sentence mentions a technical artifact—such as a binary name, process ID, Win32/Linux API call, hexadecimal flag, registry path, environment variable, or network port—the reader should never have to guess *what that token does mechanically* or *why the attacker chose it*.

> **Mandatory Formula (`MOD-03`)**:
> **`[Technical Action / Token]`** + **`([Mechanical Behavior in OS/Protocol] — so that / which causes [Operational Security Impact for Evasion, Execution, or Detection])`**

```
┌──────────────────────────────────┐     ┌────────────────────────────────────────────────────────┐
│ Technical Token (Monospace Code) │ ──▶ │ Immediate Inline Parenthetical (...)                   │
│ e.g., `CREATE_SUSPENDED = 0x4`   │     │ (freezes main thread TID 4896 before entry point runs  │
│                                  │     │  so the loader can unmap RAM before EDR hooks fire)    │
└──────────────────────────────────┘     └────────────────────────────────────────────────────────┘
```

---

## 2. The 5 Mandatory Trigger Categories for Inline Parentheticals

Whenever any token from these 5 categories appears in a narrative (`overview`, `stages[].description`, `simpleExplanation`, `howItWorksInPractice`), attach an inline parenthetical right after the token:

| # | Trigger Category | Question the Inline Parenthetical MUST Answer | Canonical Example |
| :--- | :--- | :--- | :--- |
| **1** | **Target Process / Binary / Host** (`svchost.exe`, `lsass.exe`, `KeePass.exe`, `w3wp.exe`) | *Why did the attacker choose this specific binary or host?* | `C:\Windows\System32\svchost.exe` (`PID 4892`, chosen because it carries a valid Microsoft digital signature that host firewalls and analysts trust) |
| **2** | **OS / Protocol Flags & Hex Constants** (`CREATE_SUSPENDED = 0x00000004`, `PAGE_EXECUTE_READWRITE = 0x40`, `etype 0x17`) | *What happens mechanically when this flag is set, and how does it help the attack?* | `CREATE_SUSPENDED = 0x00000004` (freezing its primary thread `TID 4896` before any code runs so the loader can replace memory before behavioral hooks fire) |
| **3** | **Native APIs / Syscalls / CLI Commands** (`NtUnmapViewOfSection`, `VirtualAllocEx`, `vssadmin delete shadows /all /quiet`) | *What does this API/command modify in the OS, and what security control does it subvert?* | `NtUnmapViewOfSection` (unmapping the legitimate Microsoft code from RAM while keeping the trusted `PID 4892` container alive) |
| **4** | **Network Protocols / Headers / Encodings** (`DNS TXT UDP/53`, `${jndi:ldap://...}`, `NSC_AAAC` cookie) | *Why is the attacker routing traffic over this channel, header, or encoding?* | `DNS TXT queries on UDP/53` (used because internal recursive DNS resolvers forward queries across isolated firewall segments even when direct HTTP/HTTPS egress is blocked) |
| **5** | **Memory Regions / Registry / Security Artifacts** (`amsi.dll!AmsiScanBuffer`, `PEB+0x10`, `COR_ENABLE_PROFILING=1`, `ntds.dit`) | *What role does this artifact play for the OS/defender, and what happens when tampered with?* | `amsi.dll!AmsiScanBuffer` (the bridge function that hands PowerShell script buffers to the antivirus engine before execution) |

---

## 3. Syntactic & Typographic Formatting Rules for Technical Tokens

1. **Backtick Monospace Wrapping**:
   - In Markdown docs and UI code blocks, wrap all file paths, process names, PIDs, hex addresses, syscalls, CLI flags, CVEs, and Event IDs in backticks (e.g., `` `svchost.exe` ``, `` `0x00400000` ``, `` `Sysmon EventID 25` ``).
2. **Exact Hexadecimal & Symbolic Pairing**:
   - Whenever referencing a numeric OS constant or Kerberos encryption type, include **both** the symbolic constant name and its exact hexadecimal value:
     - ✅ `CREATE_SUSPENDED = 0x00000004`
     - ✅ `PAGE_EXECUTE_READWRITE (0x40)`
     - ✅ `PROCESS_ALL_ACCESS (0x1FFFFF)`
     - ✅ `RC4-HMAC (etype 0x17)`
3. **Process & Thread Contextualization**:
   - Pair key processes with their concrete synthetic PID (and PPID or user context where relevant), e.g., `Invoice_Q4.exe (PID 3104)` spawning `svchost.exe (PID 4892, TID 4896)`.

---

## 4. Zero Unexplained Technical Terms in Deep-Dive Prose (`howItWorksInPractice` & `underTheHood`)

A common failure mode is writing clear inline parentheticals in `simpleExplanation` while dumping an unexplained chain of raw kernel routines, structures, hex addresses, and handles inside `howItWorksInPractice` or `underTheHood`. **This is strictly forbidden.**

Every distinct technical artifact inside deep-dive paragraphs—including native syscalls (`ntdll!NtCreateUserProcess`), kernel structures (`EPROCESS`, `VAD`, `KTRAP_FRAME`), core DLLs (`ntdll.dll`, `winhttp.dll`), base addresses (`0x00400000`), thread launchpads (`ntdll!RtlUserThreadStart`), counters (`SuspendCount = 1`), permission masks (`PROCESS_ALL_ACCESS = 0x1FFFFF`), and returned handles (`hProcess = 0x01C4`, `hThread = 0x01C8`)—**must immediately carry a concise plain-English parenthetical explaining WHAT it is and WHY it is used here**.

### Anti-Pattern (Dense Jargon Chain Without Explaining Why Each Part Exists)
> When `CreateProcessW` is invoked with `CREATE_SUSPENDED (0x00000004)`, `ntdll!NtCreateUserProcess` allocates the kernel process object (`EPROCESS` for `PID 4892`), maps `ntdll.dll` and the signed `svchost.exe` binary at base address `0x00400000`, and parks the primary thread (`TID 4896`) at `ntdll!RtlUserThreadStart` with `SuspendCount = 1` (keeping the child process completely inert in RAM while the parent dropper holds full `PROCESS_ALL_ACCESS = 0x1FFFFF` rights via handle `hProcess = 0x01C4`).

*Why this fails*: A reader who is not already a Windows kernel developer cannot tell why `ntdll!NtCreateUserProcess` runs, what `EPROCESS` stores, why `ntdll.dll` is mapped, why `0x00400000` matters, what `ntdll!RtlUserThreadStart` is, what `PROCESS_ALL_ACCESS` permits, or what the two Master Key handles (`hProcess` vs. `hThread`) are actually used for.

### Canonical Pattern (Every Technical Part Explains Its Role & Purpose Inline)
> When `CreateProcessW` (Windows' user-mode function for starting a program) is invoked with `CREATE_SUSPENDED` (`0x00000004`, a creation flag that pauses the new program before its first instruction runs so the attacker gets a quiet window to swap its contents), it calls `ntdll!NtCreateUserProcess` (the low-level system call inside `ntdll.dll` that crosses into the Windows kernel to build a new process). Inside the kernel, Windows allocates an `EPROCESS` object for `PID 4892` (the kernel's master tracking record storing the process's trusted `svchost.exe` identity, security token, and memory map), maps `ntdll.dll` (Windows' mandatory core bridge library required by every process to make kernel requests) and the signed `svchost.exe` binary at base address `0x00400000` (the standard starting memory slot where Windows loads executable code so internal memory jumps line up cleanly), and parks primary thread `TID 4896` (the main execution worker assigned to run CPU instructions) at `ntdll!RtlUserThreadStart` (Windows' built-in thread launchpad where every new thread waits right before jumping into the program's startup code) with `SuspendCount = 1` (a kernel pause counter set to 1 so the CPU scheduler skips this thread until resumed). Windows simultaneously grants `PROCESS_ALL_ACCESS = 0x1FFFFF` (the highest permission mask allowing full memory and thread tampering) via two returned Master Key handles: `hProcess = 0x01C4` (Process Master Key to inspect, empty, and rewrite RAM in Steps #2 and #3) and `hThread = 0x01C8` (Thread Master Key to redirect CPU registers and unfreeze `TID 4896` in Step #4).

---

## 5. Command-Line Token Breakdown Standard (`lib/command-line-explanations.ts`)

Every command line displayed in the Inspector (`CommandBreakdownList.tsx`) or step guide must be decomposable into individual tokens where each flag, binary, path, or operator has a deterministic explanation:

1. **Full Command String Preservation**: Never abbreviate flags or paths with `...` inside raw command strings.
2. **Per-Token Breakdown Structure**:
   - **Token**: The exact substring (e.g., `vssadmin.exe`, `delete shadows`, `/all`, `/quiet`).
   - **Role / Category**: Binary, Subcommand, Target Argument, Evasion/Suppression Flag, or Redirection Operator.
   - **Operational Explanation**: Concise 1-sentence explanation of what that specific flag or argument instructs the operating system to do and why the attacker included it.

---

## 6. Verification Checklist (`MOD-03`)

- [ ] Does every stage description (`stages[].description`), step explanation (`simpleExplanation`), AND deep-dive paragraph (`howItWorksInPractice` / `underTheHood`) attach a plain-English inline parenthetical `(...)` to **every** technical token right where it appears?
- [ ] Do parentheticals explain **both** what the token is mechanically AND why it is used (rather than merely repeating a hex code or acronym)?
- [ ] When multiple handles, keys, or tokens are introduced (such as `hProcess` vs. `hThread`), does the text explicitly explain the exact job of **each** one and which upcoming steps use it?
- [ ] Are symbolic constants paired with their exact hex values (`0x00000004`, `0x40`, `0x1FFFFF`, `0x17`)?
- [ ] Do all command-line breakdown tests in `lib/command-line-explanations.test.ts` pass?
