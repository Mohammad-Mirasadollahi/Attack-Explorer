# Inline Purpose & Cause-and-Effect Parenthetical Standard (`Action + Inline Why`)

## 1. Purpose & Core Philosophy

When reading a cybersecurity attack step, a purely procedural sentence tells the reader **what happened** (e.g., *"Process A started Process B with flag X"*), but leaves the reader asking **why** at each technical token:
- *Why did the attacker pick that specific Windows binary instead of running their own `.exe`?*
- *What does that hexadecimal flag or Win32 API actually do inside the OS kernel?*
- *How does setting that option help the attacker bypass Antivirus/EDR or help the defender catch them?*

To eliminate cognitive friction without breaking narrative flow, **every technical action, target binary, API call, creation flag, protocol option, memory permission, or registry key mentioned in a step explanation must be accompanied by an immediate inline parenthetical explanation** (`(...)`) when its operational purpose or security effect is non-obvious.

> **Core Rule:** Never state a technical action in isolation if the reader has to guess its purpose. Pair the **Technical Action** immediately with an **Inline Purpose & Effect Parenthetical**:
>
> **`[Technical Action / Artifact]`** + **`([What It Does Mechanically] + [Why It Matters for Evasion / Execution / Detection])`**

---

## 2. Structural Anatomy of an Inline Parenthetical

A single sentence or paragraph may contain **multiple inline parentheticals**—one at each point where a distinct technical decision occurs. Each parenthetical should follow a crisp **Cause $\rightarrow$ Operational Effect** formula:

```text
<Technical Action / Artifact> (<Mechanical Behavior> — so that / which causes <Operational Security Impact>)
```

### The 5 Mandatory Trigger Categories for Inline Parentheticals

Whenever any of the following 5 elements appears in a step narrative (`whatHappened`, `howItWorks`, or `storyAnalogy`), attach an inline parenthetical explaining its purpose:

| # | Technical Trigger Category | Question the Inline Parenthetical Must Answer | Example Pattern |
|---|---|---|---|
| **1** | **Target Process / Binary / Host** (`svchost.exe`, `lsass.exe`, `rundll32.exe`, `w3wp.exe`) | *Why did the attacker choose this specific binary or process?* | `C:\Windows\System32\svchost.exe` *(chosen because it carries a valid Microsoft digital signature and runs constantly in the background, so security tools and analysts naturally trust its presence)* |
| **2** | **OS / Protocol Flags & Constants** (`CREATE_SUSPENDED = 0x00000004`, `PAGE_EXECUTE_READWRITE = 0x40`, `RC4-HMAC = 0x17`) | *What happens when this flag is set, and how does it help the attack?* | `CREATE_SUSPENDED = 0x00000004` *(when this flag is set, Windows builds the process container in RAM and creates its main thread, but freezes it at the starting line before its first instruction can execute—giving the attacker a quiet window to hollow out its memory before behavioral EDR hooks trigger)* |
| **3** | **Native APIs / Syscalls / Commands** (`NtUnmapViewOfSection`, `VirtualAllocEx`, `WriteProcessMemory`, `vssadmin delete shadows`) | *What does this API/command change in the system, and what security control does it subvert?* | `NtUnmapViewOfSection` *(which unmaps and hollows out the original Microsoft code from the process's memory space while keeping the trusted PID and process container alive as an empty shell)* |
| **4** | **Network Protocols / Encodings / Ports** (`DNS TXT`, `SMB 445`, `HTTPS 443`, `Base32/Base64`) | *Why is the attacker routing traffic over this channel or encoding?* | `DNS TXT queries on UDP/53` *(used because recursive DNS resolvers automatically forward queries out of isolated network segments even when direct HTTP/HTTPS outbound traffic is blocked by the perimeter firewall)* |
| **5** | **Memory Regions / Credentials / Artifacts** (`AMSI.dll`, `AmsiScanBuffer`, `ntds.dit`, `SAM`) | *What role does this artifact play for the defender or the OS, and what happens when it is tampered with?* | `AmsiScanBuffer` inside `amsi.dll` *(the exact inspection function PowerShell calls to hand scripts over to the antivirus engine—so patching its first bytes to return `AMSI_RESULT_CLEAN` blinds the scanner for the rest of the session)* |

---

## 3. Multi-Parenthetical Sentence Engineering Guidelines

In complex attack steps, a single sentence or short paragraph often chains **2 to 4 technical actions** together. Using multiple parentheticals in the same sentence or paragraph is encouraged, provided you follow these readability rules:

1. **Place the Parenthetical Immediately After the Term It Explains:**
   - Do not wait until the end of the paragraph to explain three different flags at once. Place each `(why/effect)` right after the specific binary, flag, or API call it clarifies.
2. **Always Connect Technical Mechanism to Security Outcome:**
   - **Weak parenthetical (dictionary definition only):** `CREATE_SUSPENDED (0x4, which creates a suspended thread)` ❌ *(Too dry; doesn't explain why the attacker cares.)*
   - **Strong parenthetical (mechanism + attacker/defender impact):** `CREATE_SUSPENDED = 0x00000004 (when this flag is set, Windows creates the process in RAM but freezes its main thread before any code runs—allowing the attacker to replace its memory contents before behavioral antivirus sensors see any activity)` ✅
3. **Keep Technical Identifiers Intact:**
   - Never replace real PIDs, hex flags, Event IDs, API names, or file paths with vague summaries. Keep the exact forensic artifact AND add the plain-language purpose inside parentheses.

---

## 4. Complete Before & After Examples Across Attack Scenarios

### Example 1: Process Hollowing — Step 1 (`Create Suspended Process`)

#### ❌ Before (States What Happened, Leaves "Why" Implicit)
> The attacker’s loader (`dropper.exe`, PID 4812) asks Windows to start a real system program: `C:\Windows\System32\svchost.exe` (PID 9104). However, it passes a special flag (`CREATE_SUSPENDED = 0x00000004`) so the new `svchost.exe` process is frozen at the starting line before its first instruction can run.

#### ✅ After (Action + Inline Purpose & Effect in Multiple Parentheticals)
> The attacker’s initial loader (`dropper.exe`, PID 4812 — *the first-stage file that landed on the workstation and needs to hide its next stage from security tools*) asks Windows via `CreateProcessW` to launch a legitimate system binary: `C:\Windows\System32\svchost.exe` (PID 9104 — *chosen because `svchost.exe` carries a valid Microsoft digital signature and normally runs dozens of instances, so it blends naturally into the process list without raising suspicion*). However, during creation the loader sets the flag `CREATE_SUSPENDED = 0x00000004` (*when this flag is set, the Windows kernel builds the process container in RAM and registers PID 9104, but freezes its main thread at the starting line before a single instruction runs—giving the attacker a silent time window to hollow out and replace its memory before runtime antivirus hooks trigger*).

---

### Example 2: Process Hollowing — Step 2 & 3 (`Unmap Memory Image & Inject RWX Payload`)

#### ❌ Before
> The loader calls `NtUnmapViewOfSection` on `svchost.exe` at base address `0x00007FF6A1B00000`, allocates memory with `VirtualAllocEx` using `PAGE_EXECUTE_READWRITE (0x40)`, and writes the payload using `WriteProcessMemory`.

#### ✅ After (3 Inline Parentheticals in One Cohesive Flow)
> Next, the loader calls the native API `NtUnmapViewOfSection` targeting `svchost.exe` at base address `0x00007FF6A1B00000` (*which strips and hollows out the original Microsoft code from RAM while keeping the trusted `svchost.exe` process shell and PID 9104 alive*), then allocates a fresh memory block inside that hollow shell using `VirtualAllocEx` with `PAGE_EXECUTE_READWRITE (0x40)` permissions (*marking the memory region as simultaneously writable and executable so the attacker can copy raw shellcode into it and execute it directly in RAM*), and finally copies the Cobalt Strike beacon into that space via `WriteProcessMemory` (*loading the malicious code entirely inside a trusted Microsoft process's memory so disk-based antivirus scanners never see a malicious file on the hard drive*).

---

### Example 3: Process Hollowing — Step 4 (`Patch PEB EntryPoint & ResumeThread`)

#### ❌ Before
> The loader calls `SetThreadContext` to update the `RCX` register to `0x00401000` and then calls `ResumeThread` on Thread ID 9108.

#### ✅ After
> Once the malicious beacon is written into memory, the loader calls `SetThreadContext` on the frozen thread (`TID 9108`) to overwrite its `RCX` instruction register with `0x00401000` (*redirecting the CPU's starting pointer away from Microsoft's original code so that when the thread wakes up, it jumps straight into the attacker's injected payload*), and then invokes `ResumeThread` (*unfreezing the thread so the malicious code begins executing under the trusted identity, icon, and parent tree of `svchost.exe`*).

---

### Example 4: Active Directory Kerberoasting — Service Ticket Downgrade (`T1558.003`)

#### ❌ Before
> A domain user queries Active Directory via LDAP for accounts with `servicePrincipalName=*` and requests a Kerberos TGS ticket (Event ID 4769) for `MSSQLSvc/sql01.corp.local:1433` with encryption type `0x17` (`RC4-HMAC`).

#### ✅ After
> From the initial foothold workstation, the attacker runs an LDAP query for user accounts where `servicePrincipalName=*` (*discovering service accounts tied to high-value servers like SQL or IIS without needing admin rights, because any standard domain user is allowed to read directory attributes*), then sends a Kerberos TGS request (`KRB_TGS_REQ`, Event ID 4769) for `MSSQLSvc/sql01.corp.local:1433` (*because Active Directory issues a service ticket to any authenticated domain user without checking first whether that user has permission to access the target SQL Server*), and explicitly requests encryption type `0x17` (`RC4-HMAC-MD5` — *forcing the Domain Controller to encrypt the returned ticket using the SQL service account's raw NTLM password hash instead of modern AES keys, which lets the attacker take the ticket offline and crack the password on their own GPUs with zero failed-logon alerts in the domain logs*).

---

### Example 5: AMSI Bypass & Reflective DLL Injection (`T1562.001` / `T1620`)

#### ❌ Before
> The PowerShell script resolves `amsi.dll!AmsiScanBuffer` in memory, changes memory permissions with `VirtualProtect` to `0x40`, writes a `ret` patch (`0xB8 0x57 0x00 0x07 0x80 0xC3`), and loads a C# assembly via `[System.Reflection.Assembly]::Load($bytes)`.

#### ✅ After
> Before loading its main toolkit, the attacker's script locates `amsi.dll!AmsiScanBuffer` inside its own `powershell.exe` process memory (*targeting the exact bridge function that PowerShell uses to hand every script block over to Windows Defender for inspection*), calls `VirtualProtect` to flip that 6-byte code region to `PAGE_EXECUTE_READWRITE (0x40)` (*unlocking the read-only DLL code page in RAM so the process can modify its own loaded security library*), overwrites the function prologue with `0xB8 0x57 0x00 0x07 0x80 0xC3` (`mov eax, 0x80070057; ret` — *forcing `AmsiScanBuffer` to immediately exit with an error code before scanning a single byte, effectively blinding the antivirus sensor for the current PowerShell session*), and finally executes `[System.Reflection.Assembly]::Load($bytes)` (*loading the compiled offensive `.dll` directly from a byte array in RAM so no file ever touches the disk or triggers NTFS file-creation callbacks*).

---

### Example 6: Ransomware Volume Shadow Copy Wipe (`T1490`)

#### ❌ Before
> The ransomware spawns `vssadmin.exe delete shadows /all /quiet` and `bcdedit.exe /set {default} recoveryenabled No` from an elevated process before encrypting files.

#### ✅ After
> Prior to starting file encryption, the elevated ransomware process launches `vssadmin.exe delete shadows /all /quiet` (*erasing all Windows Volume Shadow Copies on the local disks so administrators cannot restore previous clean versions of files without paying the ransom, while the `/quiet` switch suppresses confirmation prompts and console output*), followed immediately by `bcdedit.exe /set {default} recoveryenabled No` (*modifying the Windows Boot Configuration Data store to disable automatic startup repair, ensuring the victim cannot boot into the Windows Recovery Environment to roll back the system*).

---

## 5. Checklist for Writing or Updating Any Scenario Step

When authoring or reviewing any step in `lib/step-guides/*.ts` or `lib/scenarios/*.ts`, verify every sentence against these 4 checks:

- [ ] **Check 1 — Target Selection Clarity:** If a specific process, file, port, or service is named, does an inline parenthetical explain *why* the attacker targeted or abused that specific component?
- [ ] **Check 2 — Flag / Parameter Clarity:** If a command-line switch (`-enc`, `/quiet`), hex flag (`0x00000004`, `0x40`, `0x17`), or protocol option is mentioned, does an inline parenthetical state *what happens when that flag is set* and *how it aids evasion or execution*?
- [ ] **Check 3 — API / Syscall Clarity:** If a system API (`CreateProcessW`, `NtUnmapViewOfSection`, `VirtualAllocEx`, `MiniDumpWriteDump`) is cited, does an inline parenthetical explain its mechanical effect on memory/OS state in plain language?
- [ ] **Check 4 — Multi-Clause Flow:** Where a sentence chains multiple technical actions, does each action have its own concise parenthetical placed right where the reader encounters the term, rather than deferring the explanation to the end?
