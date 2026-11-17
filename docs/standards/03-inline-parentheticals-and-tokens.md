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

## 4. Command-Line Token Breakdown Standard (`lib/command-line-explanations.ts`)

Every command line displayed in the Inspector (`CommandBreakdownList.tsx`) or step guide must be decomposable into individual tokens where each flag, binary, path, or operator has a deterministic explanation:

1. **Full Command String Preservation**: Never abbreviate flags or paths with `...` inside raw command strings.
2. **Per-Token Breakdown Structure**:
   - **Token**: The exact substring (e.g., `vssadmin.exe`, `delete shadows`, `/all`, `/quiet`).
   - **Role / Category**: Binary, Subcommand, Target Argument, Evasion/Suppression Flag, or Redirection Operator.
   - **Operational Explanation**: Concise 1-sentence explanation of what that specific flag or argument instructs the operating system to do and why the attacker included it.

---

## 5. Verification Checklist (`MOD-03`)

- [ ] Does every stage description (`stages[].description`) and step explanation (`simpleExplanation` / `howItWorksInPractice`) contain inline parentheticals (`(...)`) explaining technical tokens right where they appear?
- [ ] Do parentheticals explain **both** mechanical behavior AND security impact (rather than merely restating an acronym)?
- [ ] Are symbolic constants paired with their exact hex values (`0x00000004`, `0x40`, `0x1FFFFF`, `0x17`)?
- [ ] Do all command-line breakdown tests in `lib/command-line-explanations.test.ts` pass?
