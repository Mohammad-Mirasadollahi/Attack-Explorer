# Process Hollowing (`T1055.012`) & Cobalt Strike Beacon Loader — Complete Text-to-Cinematic Extraction, Anatomical Shape Catalog & Motion Choreography Specification

**Scenario ID:** `process-hollowing`  
**MITRE ATT&CK® Classification:** `T1055.012` (Process Injection: Process Hollowing), `T1036.005` (Masquerading), `T1071.001` (Application Layer Protocol: Web Protocols), `T1573.002` (Encrypted Channel: Asymmetric Cryptography)  
**Target Host Context:** `WKS-FIN-04` (`10.20.4.115`) — Windows 11 Enterprise 23H2 x64  
**Primary Actors:**
- `Invoice_Q4.exe` (`PID 3104`) — Untrusted user-mode financial lure dropper (`C:\Users\jdoe\Downloads\Invoice_Q4.exe`)
- `ntdll.dll / Win32 Kernel Executive` (`Ring-3 -> Ring-0`) — Syscall transition gateway (`NtCreateUserProcess`, `NtQueryInformationProcess`, `NtUnmapViewOfSection`, `NtAllocateVirtualMemory`, `NtWriteVirtualMemory`, `NtSetContextThread`, `NtResumeThread`)
- `svchost.exe` (`PID 4892`, `TID 4896`) — Dual-container hollowed vessel (`C:\Windows\System32\svchost.exe -k netsvcs`, signed by `"Microsoft Windows"`, inner virtual address space at `0x00400000`)
- `Sysmon / ETW & Host Firewall Sensor` — Kernel & network telemetry collectors (`EID 1`, `EID 10`, `EID 25`, `EID 3`)
- `185.199.108.153:443` (`cdn-static-content.com`) — External Cobalt Strike HTTPS Malleable C2 Server & SIEM FFT Spectrum Analyzer

---

## 1. Architectural Philosophy: Why Text-to-Cinematic Synchronization Works Like NotebookLM

To transform dense DFIR/OS internals prose into a continuous, video-like interactive documentary, every paragraph in the `process-hollowing` scenario is decomposed through a **7-Tuple Deterministic Extraction Pipeline**:

1. **Source Text Clause & Narrator Script (`clause` / `narratorText`)**: The exact forensic sentence being explained.
2. **Spatial Actors & Anatomical Sub-Slots (`actors` & `subSlots`)**: Not generic flowchart boxes, but **Composite Anatomical Shapes** (e.g., `svchost.exe` has a persistent outer Ring-3 Trust Boundary Wrapper AND an inner Virtual Address Space Rack containing `PEB @ 0x7FFDF000`, `ImageBase @ 0x00400000` `[.text, .rdata, .data]`, `VAD Tree Node`, and `TID 4896 CONTEXT_FULL [RCX, RIP, RSP, SuspendCount]`).
3. **Traveling Vector & Payload Tokens (`vectorToken`)**: The exact API call, syscall number, handle value, or byte stream traveling along the SVG cubic-bezier conduit between actors.
4. **Before $\rightarrow$ After State Mutation Delta (`stateDelta`)**: The exact register, memory permission, or kernel counter that mutates (e.g., `0x00400000: Mapped [RX] -> MEM_FREE (Unmapped Hollow Cavity)`).
5. **Intra-Step 3-Beat Micro-Timeline (`MOTION ①` $\rightarrow$ `MOTION ②` $\rightarrow$ `MOTION ③`)**: Every sub-step (`0A`..`5D`) is internally broken into three 33% micro-beats:
   - **Beat 1 (`MOTION ① — Initiation / Vector Dispatch`)**: Actor A prepares parameters and emits the syscall/packet particle along the conduit.
   - **Beat 2 (`MOTION ② — Core Anatomical Mutation`)**: The target memory rack, CPU register dial, or kernel structure physically mutates on-screen.
   - **Beat 3 (`MOTION ③ — Return Handle / Forensic Sensor Catch`)**: Return values flow back or Sysmon/ETW/FFT sensors latch onto the anomaly.
6. **Interactive Bi-Directional Token-to-Shape Bindings (`extractedTokens`)**: Every hexadecimal address (`0x00400000`, `0x004014A0`, `0x7FFDF000`), handle (`0x01C4`, `0x01C8`), flag (`CREATE_SUSPENDED (0x4)`, `PAGE_EXECUTE_READWRITE (0x40)`), byte signature (`4D 5A 90 00`), and telemetry rule (`Sysmon EID 25`, `f₀ = 0.0167 Hz`) in the prose is bound to a specific `targetShapeId` on the graphical canvas so hovering or clicking it in the text spotlights the exact visual component.
7. **Cinematic Camera Directive (`cameraMode`)**: Controls the viewport lens framing (`WIDE_ARCHITECTURE`, `KERNEL_BRIDGE_TWO_SHOT`, `MEMORY_RACK_MACRO`, `CPU_REGISTER_MACRO`, `NETWORK_FFT_ANALYZER`).

---

## 2. Master Catalog of Persistent Anatomical Shapes & Motion Physics

| Shape ID (`targetShapeId`) | Visual Metaphor & Internal Anatomy | Motion & State Transitions Across Stages 0–5 |
| :--- | :--- | :--- |
| `shape-dropper-pid3104` | **Untrusted Amber Process Card (`Invoice_Q4.exe`, PID `3104`)** with internal `Payload Buffer (262,144 bytes)` and `Acquired Handle Vault (hProcess: 0x01C4, hThread: 0x01C8)`. | Emits crimson/amber syscall pulses in Stages 1–4; displays live progress bar (`0% -> 100%`) as 64KB chunks stream out during Stage 3 (`3B/3C`). |
| `shape-kernel-ring0-bridge` | **Ring-3 / Ring-0 Syscall Boundary Gate (`ntdll.dll -> ntoskrnl.exe`)** with vertical privileged divider and syscall opcode ticker. | Flashes active syscall (`CreateProcessW`, `NtQueryInformationProcess`, `NtUnmapViewOfSection`, `VirtualAllocEx`, `WriteProcessMemory`, `SetThreadContext`, `ResumeThread`) as glowing particles cross the boundary. |
| `shape-svchost-outer-shell` | **Dual-Layer Signed Trust Shield (`svchost.exe`, PID `4892`)**: Emerald outer perimeter displaying Authenticode Signature `"Microsoft Windows"` & `C:\Windows\System32\svchost.exe`. | Outer shield remains **Emerald Green (`Signed & Trusted`)** across all 6 stages—visually demonstrating *why* host firewalls and superficial process monitors are deceived while the interior is hollowed out. |
| `shape-peb-0x7ffdf000` | **PEB Control Header Block (`0x7FFDF000`)** inside `svchost.exe` with `PEB+0x10 ImageBaseAddress` slot. | Highlighted by cyan scanner beam in Stage `2A`, resolving `ImageBaseAddress = 0x00400000` and returning it to `PID 3104`. |
| `shape-ram-0x00400000` | **Virtual Address Space Rack (`0x00400000` – `0x00440000`, 256 KB)** divided into `PE Header (4KB)`, `.text (176KB)`, `.rdata (48KB)`, `.data (28KB)`. | **Stage 1–2B:** Emerald `svchost.exe [RX]`. **Stage 2C–2D:** Dissolves into dashed hollow cavity (`MEM_FREE / Unmapped`). **Stage 3A:** Turns glowing Crimson (`MEM_COMMIT \| PAGE_EXECUTE_READWRITE 0x40`). **Stage 3B–3C:** Fills with `4D 5A 90 00` Cobalt Strike Beacon bytes. |
| `shape-vad-tree-monitor` | **Kernel MMVAD Node Inspector (`MmAllocateVirtualMemory` / VAD Tree)** attached to `0x00400000`. | Normal `VAD_IMAGE_MAP (Signed Section)` in Stage 1–2; flips to pulsing red warning `Private Memory (MEM_PRIVATE \| RWX) — Unbacked by Disk File!` in Stage `3D`. |
| `shape-thread-tid4896` | **CPU Thread & Register Switchboard (`TID 4896`, `CONTEXT_FULL`)** showing `RCX (Entry Point)`, `RIP`, and `KTHREAD.SuspendCount` mechanical gauge. | **Stage 1–4A:** Frozen cyan (`SUSPENDED`, `SuspendCount = 1`, `RCX = 0x7FF6A1B0 (RtlUserThreadStart)`). **Stage 4B:** `RCX` physically rotates/flips to `0x004014A0 (BeaconStart)`. **Stage 4C:** `SuspendCount` drops `1 -> 0`, status switches to pulsing emerald/crimson `RUNNING`. |
| `shape-firewall-gate` | **Windows Defender Outbound Application Firewall Gate** checking `ProcessPath` & `Authenticode Signature`. | Scans outer emerald wrapper of `svchost.exe (PID 4892)` in Stage `5A` and stamps `[ALLOW OUTBOUND TCP/443]`. |
| `shape-c2-malleable-stream` | **HTTPS TLS 1.3 Malleable C2 Conduit (`185.199.108.153:443`)** with `GET /jquery-3.3.1.min.js` envelope and `__cfduid` session cookie. | Emits periodic beacon wave pulses (`Δt = 60s ± 15% jitter`) from `svchost.exe` to external C2 node in Stage `5B–5C`. |
| `shape-fft-spectrum-panel` | **Dual-Domain Time-Series & Discrete Fourier Transform (`F(ω)`) Analyzer**. | Converts noisy jittered time-domain pings (`51s..69s`) into a sharp frequency-domain spectral spike locked at `f₀ = 0.0167 Hz (T = 60.0s, SNR = 18.4 dB)` in Stage `5C–5D`. |
| `shape-sysmon-sensor-hud` | **Kernel ETW & Sysmon Telemetry Badge Matrix (`EID 1`, `EID 10`, `EID 25`, `EID 3`)**. | Triggers corresponding forensic rule badges on the exact sub-steps where kernel sensors observe the behavior. |

---

## 3. Complete Sub-Step by Sub-Step (`0A` through `5D`) Extraction & Motion Choreography Matrix

### Stage 0 — Scenario Briefing: Why & How Process Hollowing Works (`cameraMode: 'WIDE_ARCHITECTURE'`)

#### Sub-Step `0A` — 1. The Attacker's Dilemma (`0% – 25%`)
- **Extracted Source Text:** *"Dropper `Invoice_Q4.exe` (`PID 3104`) is an untrusted binary in `C:\Users\jdoe\Downloads\`. Immediate C2 connections or suspicious threads from this path trigger EDR & firewall blocks."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-firewall-gate`
- **Interactive Extracted Tokens:**
  - `Invoice_Q4.exe (PID 3104)` $\rightarrow$ `shape-dropper-pid3104`
  - `C:\Users\jdoe\Downloads\` $\rightarrow$ `shape-dropper-pid3104`
  - `EDR & Firewall Block` $\rightarrow$ `shape-firewall-gate`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Camera frames `Invoice_Q4.exe (PID 3104)` glowing amber in the untrusted user downloads directory.
  - `MOTION ②`: A simulated direct outbound probe from `PID 3104` hits the EDR/Firewall barrier and is deflected with a red `[BLOCKED: UNTRUSTED PATH]` vector.
  - `MOTION ③`: Dropper locks its internal `256 KB Cobalt Strike Beacon` payload buffer and prepares the Process Hollowing evasion strategy.

#### Sub-Step `0B` — 2. The Hollowing Concept (`25% – 50%`)
- **Extracted Source Text:** *"Spawn a trusted Windows binary (`svchost.exe`) in a frozen state (`CREATE_SUSPENDED`), scoop out its legitimate code (`0x00400000`), and replace it with Cobalt Strike Beacon."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-svchost-outer-shell`, `shape-ram-0x00400000`
- **Interactive Extracted Tokens:**
  - `svchost.exe (Trusted Vessel)` $\rightarrow$ `shape-svchost-outer-shell`
  - `CREATE_SUSPENDED (0x4)` $\rightarrow$ `shape-thread-tid4896`
  - `0x00400000` $\rightarrow$ `shape-ram-0x00400000`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Blueprint schematic of `svchost.exe (PID 4892)` materializes with its emerald `"Microsoft Windows"` outer trust shell.
  - `MOTION ②`: The inner `0x00400000` memory core temporarily lifts out in an exploded isometric preview, revealing the hollow cavity inside the trusted shell.
  - `MOTION ③`: A crimson Cobalt Strike Beacon core slides into the preview slot while the outer shell stays emerald green.

#### Sub-Step `0C` — 3. The 5-Stage Kill-Chain (`50% – 75%`)
- **Extracted Source Text:** *"① Spawn suspended `svchost.exe (PID 4892)` -> ② Unmap `0x00400000` via `NtUnmapViewOfSection` -> ③ Write `RWX` Beacon (`4D 5A 90 00`) -> ④ Hijack `RCX -> 0x004014A0` -> ⑤ C2 Beacon."*
- **Active Actors & Target Shapes:** `shape-kernel-ring0-bridge`, `shape-ram-0x00400000`, `shape-thread-tid4896`, `shape-c2-malleable-stream`
- **Interactive Extracted Tokens:**
  - `PID 4892` $\rightarrow$ `shape-svchost-outer-shell`
  - `NtUnmapViewOfSection` $\rightarrow$ `shape-kernel-ring0-bridge`
  - `4D 5A 90 00` $\rightarrow$ `shape-ram-0x00400000`
  - `RCX -> 0x004014A0` $\rightarrow$ `shape-thread-tid4896`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Sequential stage nodes ①, ②, and ③ illuminate along the top kill-chain rail (`Spawn -> Unmap -> Inject`).
  - `MOTION ②`: Stage nodes ④ and ⑤ illuminate (`Hijack RCX -> HTTPS C2 Beacon`), linking all 5 anatomical stations.
  - `MOTION ③`: The morphing SVG conduit pulses across the entire pipeline from `PID 3104` to `185.199.108.153:443`.

#### Sub-Step `0D` — 4. Defender's Forensic Edge (`75% – 100%`)
- **Extracted Source Text:** *"Even though task managers see signed `svchost.exe`, kernel sensors catch `Sysmon EID 25 (Process Tampering)`, unbacked `MEM_PRIVATE | RWX` VAD nodes, and `0.0167 Hz` FFT C2 spikes."*
- **Active Actors & Target Shapes:** `shape-sysmon-sensor-hud`, `shape-vad-tree-monitor`, `shape-fft-spectrum-panel`
- **Interactive Extracted Tokens:**
  - `Sysmon EID 25 (Process Tampering)` $\rightarrow$ `shape-sysmon-sensor-hud`
  - `MEM_PRIVATE | RWX` $\rightarrow$ `shape-vad-tree-monitor`
  - `0.0167 Hz FFT Spike` $\rightarrow$ `shape-fft-spectrum-panel`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Superficial user-mode Process Explorer lens scans `svchost.exe` and reports `[VERIFIED: MICROSOFT WINDOWS]`.
  - `MOTION ②`: Deep Kernel X-Ray lens sweeps across `svchost.exe`, exposing the red `MEM_PRIVATE | RWX` VAD anomaly and `Sysmon EID 25` hook.
  - `MOTION ③`: The SIEM FFT analyzer locks onto the `f₀ = 0.0167 Hz` spectral peak, completing the defender briefing.

---

### Stage 1 — Suspended Target Creation (`CreateProcessW` + `CREATE_SUSPENDED`) (`cameraMode: 'KERNEL_BRIDGE_TWO_SHOT'`)

#### Sub-Step `1A` — 1A. Dropper Execution (`0% – 25%`)
- **Extracted Source Text:** *"Untrusted dropper `Invoice_Q4.exe` (`PID 3104`) executes in user space (`C:\Users\jdoe\Downloads\`) and prepares `STARTUPINFOW` / `PROCESS_INFORMATION` structs to spawn a trusted Windows host."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-kernel-ring0-bridge`
- **Interactive Extracted Tokens:**
  - `Invoice_Q4.exe (PID 3104)` $\rightarrow$ `shape-dropper-pid3104`
  - `STARTUPINFOW` $\rightarrow$ `shape-dropper-pid3104`
  - `PROCESS_INFORMATION` $\rightarrow$ `shape-dropper-pid3104`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: `Invoice_Q4.exe (PID 3104)` initializes `STARTUPINFOW (cb=104)` and zeroes out the `PROCESS_INFORMATION` struct in local stack memory.
  - `MOTION ②`: Target string `"C:\\Windows\\System32\\svchost.exe -k netsvcs"` loads into the `lpCommandLine` register slot.
  - `MOTION ③`: Conduit between `PID 3104` and `kernel32!CreateProcessW` charges with amber invocation energy.

#### Sub-Step `1B` — 1B. Kernel EPROCESS & Section Map (`25% – 50%`)
- **Extracted Source Text:** *"`CreateProcessW` transitions into `ntdll!NtCreateUserProcess`, allocating kernel `EPROCESS` (`PID 4892`), initializing `PEB` at `0x7FFDF000`, and mapping legitimate `svchost.exe` at `0x00400000` (`[RX]`)."*
- **Active Actors & Target Shapes:** `shape-kernel-ring0-bridge`, `shape-svchost-outer-shell`, `shape-peb-0x7ffdf000`, `shape-ram-0x00400000`
- **Interactive Extracted Tokens:**
  - `ntdll!NtCreateUserProcess` $\rightarrow$ `shape-kernel-ring0-bridge`
  - `EPROCESS (PID 4892)` $\rightarrow$ `shape-svchost-outer-shell`
  - `PEB @ 0x7FFDF000` $\rightarrow$ `shape-peb-0x7ffdf000`
  - `0x00400000 [PAGE_EXECUTE_READ]` $\rightarrow$ `shape-ram-0x00400000`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Syscall particle crosses `ntdll.dll` into Ring-0 `NtCreateUserProcess`.
  - `MOTION ②`: Kernel allocates `EPROCESS (PID 4892)` and initializes `PEB` at `0x7FFDF000`.
  - `MOTION ③`: Legitimate signed `svchost.exe` image sections (`.text`, `.rdata`, `.data`) map into `0x00400000` with emerald `[PAGE_EXECUTE_READ]` protection.

#### Sub-Step `1C` — 1C. `CREATE_SUSPENDED (0x00000004)` Freeze (`50% – 75%`)
- **Extracted Source Text:** *"Because `dwCreationFlags = CREATE_SUSPENDED (0x4)` is passed, primary thread `TID 4896` is frozen at `ntdll!RtlUserThreadStart` (`SuspendCount = 1`) before any application code runs."*
- **Active Actors & Target Shapes:** `shape-thread-tid4896`, `shape-sysmon-sensor-hud`
- **Interactive Extracted Tokens:**
  - `CREATE_SUSPENDED (0x00000004)` $\rightarrow$ `shape-thread-tid4896`
  - `TID 4896` $\rightarrow$ `shape-thread-tid4896`
  - `ntdll!RtlUserThreadStart` $\rightarrow$ `shape-thread-tid4896`
  - `SuspendCount = 1` $\rightarrow$ `shape-thread-tid4896`
  - `Sysmon EID 1` $\rightarrow$ `shape-sysmon-sensor-hud`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Flag bitmask `0x00000004 (CREATE_SUSPENDED)` latches onto `KTHREAD (TID 4896)`.
  - `MOTION ②`: Thread execution freezes at `ntdll!RtlUserThreadStart (0x7FF6A1B0)` with frost-cyan lock indicator and `SuspendCount = 1`.
  - `MOTION ③`: `Sysmon EID 1 (ProcessCreate)` fires in the telemetry HUD, logging parent `Invoice_Q4.exe (3104) -> svchost.exe (4892)`.

#### Sub-Step `1D` — 1D. `PROCESS_INFORMATION` Handle Acquisition (`75% – 100%`)
- **Extracted Source Text:** *"The kernel populates `PROCESS_INFORMATION`, returning `hProcess = 0x01C4` (`PROCESS_ALL_ACCESS`) and `hThread = 0x01C8` (`THREAD_ALL_ACCESS`) back to `Invoice_Q4.exe`."*
- **Active Actors & Target Shapes:** `shape-svchost-outer-shell`, `shape-dropper-pid3104`
- **Interactive Extracted Tokens:**
  - `hProcess = 0x01C4` $\rightarrow$ `shape-dropper-pid3104`
  - `hThread = 0x01C8` $\rightarrow$ `shape-dropper-pid3104`
  - `PROCESS_ALL_ACCESS (0x001F0FFF)` $\rightarrow$ `shape-dropper-pid3104`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Kernel packs `hProcess = 0x01C4` and `hThread = 0x01C8` into the return `PROCESS_INFORMATION` structure.
  - `MOTION ②`: Cyan return particles travel along the bottom conduit from `PID 4892` back into `Invoice_Q4.exe (PID 3104)`.
  - `MOTION ③`: Dropper Handle Vault locks `[hProcess: 0x01C4 | hThread: 0x01C8]` as active full-access control keys.

---

### Stage 2 — Base Address Discovery & Memory Unmapping (`NtUnmapViewOfSection`) (`cameraMode: 'MEMORY_RACK_MACRO'`)

#### Sub-Step `2A` — 2A. Querying Remote PEB (`0% – 25%`)
- **Extracted Source Text:** *"Using `hProcess (0x01C4)`, the dropper calls `NtQueryInformationProcess(ProcessBasicInformation)` to locate the target's `PEB` (`0x7FFDF000`) and reads `PEB+0x10` (`ImageBaseAddress = 0x00400000`)."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-peb-0x7ffdf000`
- **Interactive Extracted Tokens:**
  - `NtQueryInformationProcess` $\rightarrow$ `shape-kernel-ring0-bridge`
  - `PEB @ 0x7FFDF000` $\rightarrow$ `shape-peb-0x7ffdf000`
  - `PEB+0x10 (ImageBaseAddress)` $\rightarrow$ `shape-peb-0x7ffdf000`
  - `0x00400000` $\rightarrow$ `shape-ram-0x00400000`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Dropper invokes `NtQueryInformationProcess(0x01C4, ProcessBasicInformation)` across the kernel bridge.
  - `MOTION ②`: Scanner beam illuminates `PEB @ 0x7FFDF000` and reads offset `+0x10 (ImageBaseAddress)`.
  - `MOTION ③`: Base pointer `0x00400000` returns to `Invoice_Q4.exe`, locking the exact target coordinates for unmapping.

#### Sub-Step `2B` — 2B. Inspecting Legitimate PE Sections (`25% – 50%`)
- **Extracted Source Text:** *"At `0x00400000`, legitimate `svchost.exe` sections (`.text` code, `.rdata` imports, `.data` globals) are currently mapped as `MEM_IMAGE` (`PAGE_EXECUTE_READ`) backed by `C:\Windows\System32\svchost.exe`."*
- **Active Actors & Target Shapes:** `shape-ram-0x00400000`, `shape-vad-tree-monitor`
- **Interactive Extracted Tokens:**
  - `.text / .rdata / .data` $\rightarrow$ `shape-ram-0x00400000`
  - `MEM_IMAGE` $\rightarrow$ `shape-vad-tree-monitor`
  - `PAGE_EXECUTE_READ (0x20)` $\rightarrow$ `shape-ram-0x00400000`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Camera zooms into the `0x00400000 – 0x00440000` Virtual Address Space Rack inside `svchost.exe`.
  - `MOTION ②`: Each legitimate section block (`PE Header 4KB`, `.text 176KB`, `.rdata 48KB`, `.data 28KB`) highlights with emerald `MEM_IMAGE [RX]` badges.
  - `MOTION ③`: VAD Tree Inspector confirms backing file pointer `FileObject -> \System32\svchost.exe`.

#### Sub-Step `2C` — 2C. Issuing `ntdll!NtUnmapViewOfSection` (`50% – 75%`)
- **Extracted Source Text:** *"Dropper invokes `ntdll!NtUnmapViewOfSection(hProcess=0x01C4, BaseAddress=0x00400000)`, instructing the Windows Memory Manager (`MiUnmapViewOfSection`) to tear down the legitimate section view."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-kernel-ring0-bridge`, `shape-ram-0x00400000`
- **Interactive Extracted Tokens:**
  - `ntdll!NtUnmapViewOfSection` $\rightarrow$ `shape-kernel-ring0-bridge`
  - `hProcess = 0x01C4` $\rightarrow$ `shape-dropper-pid3104`
  - `BaseAddress = 0x00400000` $\rightarrow$ `shape-ram-0x00400000`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Dropper fires high-intensity purple syscall vector `NtUnmapViewOfSection(0x01C4, 0x00400000)`.
  - `MOTION ②`: Kernel `MiUnmapViewOfSection` severs the `SectionObject` mapping and invalidates page table entries (`PTEs`) across `0x00400000..0x00440000`.
  - `MOTION ③`: The emerald `.text`, `.rdata`, and `.data` blocks fracture and begin dissolving out of the `0x00400000` rack.

#### Sub-Step `2D` — 2D. Hollowed Virtual Address Cavity (`75% – 100%`)
- **Extracted Source Text:** *"The legitimate `svchost.exe` image is now completely unmapped (`MEM_FREE`). `PID 4892` retains its trusted name, icon, and Microsoft signature wrapper, but its `0x00400000` base region is a hollow void."*
- **Active Actors & Target Shapes:** `shape-svchost-outer-shell`, `shape-ram-0x00400000`, `shape-sysmon-sensor-hud`
- **Interactive Extracted Tokens:**
  - `MEM_FREE (Unmapped Void)` $\rightarrow$ `shape-ram-0x00400000`
  - `Signed Outer Shell Intact` $\rightarrow$ `shape-svchost-outer-shell`
  - `Sysmon EID 10` $\rightarrow$ `shape-sysmon-sensor-hud`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: `0x00400000` transforms into a dark dashed wireframe cavity labeled `[HOLLOWED CAVITY — MEM_FREE (0x00400000)]`.
  - `MOTION ②`: The outer `svchost.exe (PID 4892)` border pulses emerald green, emphasizing the contrast between the trusted container and its empty interior.
  - `MOTION ③`: `Sysmon EID 10 (ProcessAccess GrantedAccess=0x1F0FFF)` logs the cross-process memory manipulation handle.

---

### Stage 3 — RWX Allocation & Cobalt Strike Beacon Injection (`VirtualAllocEx` & `WriteProcessMemory`) (`cameraMode: 'MEMORY_RACK_MACRO'`)

#### Sub-Step `3A` — 3A. `VirtualAllocEx` (`PAGE_EXECUTE_READWRITE`) (`0% – 25%`)
- **Extracted Source Text:** *"Dropper calls `VirtualAllocEx(0x01C4, 0x00400000, 0x40000, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE [0x40])`, reclaiming the hollow `0x00400000` base as a writable & executable buffer."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-ram-0x00400000`
- **Interactive Extracted Tokens:**
  - `VirtualAllocEx` $\rightarrow$ `shape-kernel-ring0-bridge`
  - `MEM_COMMIT | MEM_RESERVE (0x3000)` $\rightarrow$ `shape-ram-0x00400000`
  - `PAGE_EXECUTE_READWRITE (0x40)` $\rightarrow$ `shape-ram-0x00400000`
  - `Size = 0x40000 (256 KB)` $\rightarrow$ `shape-ram-0x00400000`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Dropper sends `VirtualAllocEx(0x01C4, 0x00400000, 262144, 0x3000, 0x40)` across the syscall conduit.
  - `MOTION ②`: The hollow cavity at `0x00400000` ignites with a crimson border and `[RWX — PAGE_EXECUTE_READWRITE (0x40)]` permission badge.
  - `MOTION ③`: Return address `0x00400000` confirms the 256 KB private region is ready to receive raw PE bytes.

#### Sub-Step `3B` — 3B. Writing Malicious PE Headers (`4D 5A 90 00`) (`25% – 50%`)
- **Extracted Source Text:** *"The first `WriteProcessMemory` call streams the Cobalt Strike Beacon `IMAGE_DOS_HEADER` (`4D 5A 90 00` / `MZ`) and `IMAGE_NT_HEADERS64` (`50 45 00 00` / `PE\\0\\0`, `AddressOfEntryPoint = 0x14A0`) into `0x00400000`."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-ram-0x00400000`
- **Interactive Extracted Tokens:**
  - `WriteProcessMemory` $\rightarrow$ `shape-kernel-ring0-bridge`
  - `4D 5A 90 00 (MZ Header)` $\rightarrow$ `shape-ram-0x00400000`
  - `50 45 00 00 (PE64 Header)` $\rightarrow$ `shape-ram-0x00400000`
  - `AddressOfEntryPoint = 0x14A0` $\rightarrow$ `shape-ram-0x00400000`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: First 4,096-byte packet streams from `Invoice_Q4.exe` into `0x00400000`.
  - `MOTION ②`: Live hex matrix inside `0x00400000` populates with `4D 5A 90 00 03 00 00 00 ... 50 45 00 00 64 86`.
  - `MOTION ③`: Header parser highlights `OptionalHeader.ImageBase = 0x00400000` and `AddressOfEntryPoint = 0x000014A0`.

#### Sub-Step `3C` — 3C. Streaming Beacon Sections (`.text`, `.rdata`, `.data`) (`50% – 75%`)
- **Extracted Source Text:** *"Subsequent `WriteProcessMemory` calls copy `262,144 bytes` (`256 KB`) of Cobalt Strike Beacon shellcode, reflective loader stubs, and encrypted C2 configuration into `.text` (`0x00401000`), `.rdata` (`0x0042D000`), and `.data` (`0x00439000`)."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-ram-0x00400000`
- **Interactive Extracted Tokens:**
  - `262,144 / 262,144 Bytes (100%)` $\rightarrow$ `shape-ram-0x00400000`
  - `.text @ 0x00401000` $\rightarrow$ `shape-ram-0x00400000`
  - `.rdata @ 0x0042D000` $\rightarrow$ `shape-ram-0x00400000`
  - `.data @ 0x00439000` $\rightarrow$ `shape-ram-0x00400000`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: High-speed crimson byte packets stream across the conduit, filling `.text (0x00401000)` with `FC 48 83 E4 F0 E8 C0 00` Beacon code.
  - `MOTION ②`: `.rdata (0x0042D000)` and `.data (0x00439000)` fill with WinInet import hashes and Malleable C2 profile configuration (`262,144 / 262,144 bytes`).
  - `MOTION ③`: Entry point marker `[BeaconStart @ 0x004014A0]` locks inside the `.text` section.

#### Sub-Step `3D` — 3D. Memory Forensics Anomaly (`MEM_PRIVATE | RWX`) (`75% – 100%`)
- **Extracted Source Text:** *"In the kernel VAD tree, `0x00400000` is now `Private Memory (MEM_PRIVATE)` with `PAGE_EXECUTE_READWRITE` protection instead of a file-backed `MEM_IMAGE` section—a classic Volatility `malfind` & Moneta detection trigger."*
- **Active Actors & Target Shapes:** `shape-vad-tree-monitor`, `shape-ram-0x00400000`, `shape-sysmon-sensor-hud`
- **Interactive Extracted Tokens:**
  - `MEM_PRIVATE | PAGE_EXECUTE_READWRITE` $\rightarrow$ `shape-vad-tree-monitor`
  - `Unbacked by Disk File (No FileObject)` $\rightarrow$ `shape-vad-tree-monitor`
  - `Volatility malfind / Moneta` $\rightarrow$ `shape-vad-tree-monitor`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Kernel VAD Tree Inspector scans the newly committed `MMVAD` node at `VPN 0x400..0x43F`.
  - `MOTION ②`: VAD comparison badge flips from `MEM_IMAGE (\System32\svchost.exe)` to pulsing red `MEM_PRIVATE | RWX (Unbacked by Disk)`.
  - `MOTION ③`: Forensic alert banner flags `[VOLATILITY MALFIND: MZ HEADER IN PRIVATE RWX VAD]`.

---

### Stage 4 — Thread Context Hijacking & Execution Resume (`SetThreadContext` & `ResumeThread`) (`cameraMode: 'CPU_REGISTER_MACRO'`)

#### Sub-Step `4A` — 4A. Reading Frozen `CONTEXT_FULL` (`GetThreadContext`) (`0% – 25%`)
- **Extracted Source Text:** *"Dropper calls `GetThreadContext(hThread=0x01C8)` on suspended thread `TID 4896` (`ContextFlags = CONTEXT_FULL`). On x64 Windows, register `RCX` currently holds the legitimate entry point (`0x7FF6A1B0`) while `RIP` sits at `ntdll!RtlUserThreadStart`."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-thread-tid4896`
- **Interactive Extracted Tokens:**
  - `GetThreadContext(0x01C8)` $\rightarrow$ `shape-thread-tid4896`
  - `CONTEXT_FULL (0x10000B)` $\rightarrow$ `shape-thread-tid4896`
  - `RCX = 0x7FF6A1B0` $\rightarrow$ `shape-thread-tid4896`
  - `RIP = ntdll!RtlUserThreadStart` $\rightarrow$ `shape-thread-tid4896`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Camera zooms into the `TID 4896` x64 CPU Register Switchboard inside `svchost.exe`.
  - `MOTION ②`: `GetThreadContext(0x01C8)` reads the `CONTEXT` structure, illuminating `RIP = 0x7FFA9100 (RtlUserThreadStart)` and `RCX = 0x7FF6A1B0 (Legitimate svchost WinMain)`.
  - `MOTION ③`: Snapshot of `CONTEXT_FULL` copies into `Invoice_Q4.exe` memory for surgical modification.

#### Sub-Step `4B` — 4B. Overwriting `RCX` Register (`SetThreadContext`) (`25% – 50%`)
- **Extracted Source Text:** *"Dropper overwrites `CONTEXT.Rcx` from `0x7FF6A1B0` to `0x004014A0` (`ImageBase 0x00400000 + EntryPoint 0x14A0`) and calls `SetThreadContext(0x01C8)`, redirecting the thread's startup target to Cobalt Strike Beacon."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-thread-tid4896`, `shape-ram-0x00400000`
- **Interactive Extracted Tokens:**
  - `SetThreadContext(0x01C8)` $\rightarrow$ `shape-thread-tid4896`
  - `RCX = 0x004014A0 (BeaconStart)` $\rightarrow$ `shape-thread-tid4896`
  - `0x00400000 + 0x14A0` $\rightarrow$ `shape-ram-0x00400000`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Dropper modifies `CONTEXT.Rcx = 0x004014A0` and invokes `SetThreadContext(0x01C8)`.
  - `MOTION ②`: On the CPU Register Switchboard, the `RCX` dial physically flips from emerald `0x7FF6A1B0` to crimson `0x004014A0`.
  - `MOTION ③`: The execution pointer laser disconnects from legitimate `svchost.exe` startup and locks directly onto `[BeaconStart @ 0x004014A0]` inside the injected `.text` block.

#### Sub-Step `4C` — 4C. Decrementing `SuspendCount` (`ResumeThread`) (`50% – 75%`)
- **Extracted Source Text:** *"Dropper invokes `ResumeThread(hThread=0x01C8)`. The kernel decrements `KTHREAD.SuspendCount` from `1 -> 0`, transitioning `TID 4896` from `SUSPENDED` to `RUNNING` on the Windows scheduler."*
- **Active Actors & Target Shapes:** `shape-dropper-pid3104`, `shape-thread-tid4896`
- **Interactive Extracted Tokens:**
  - `ResumeThread(0x01C8)` $\rightarrow$ `shape-thread-tid4896`
  - `SuspendCount: 1 -> 0` $\rightarrow$ `shape-thread-tid4896`
  - `STATE: RUNNING` $\rightarrow$ `shape-thread-tid4896`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: `ResumeThread(0x01C8)` pulse crosses the kernel bridge into `KeResumeThread`.
  - `MOTION ②`: The mechanical `KTHREAD.SuspendCount` counter ticks down `1 -> 0` and the cyan frost lock shatters.
  - `MOTION ③`: Thread `TID 4896` ignites into active execution, jumping directly into `0x004014A0 (Cobalt Strike Beacon Reflective Stub)`.

#### Sub-Step `4D` — 4D. `Sysmon Event ID 25` (`Process Tampering`) (`75% – 100%`)
- **Extracted Source Text:** *"At the exact moment `TID 4896` resumes execution from an unmapped/replaced image base, kernel ETW & Sysmon emit `Event ID 25 (ProcessTampering: Type = Image is replaced)`. `Invoice_Q4.exe` closes handles and exits."*
- **Active Actors & Target Shapes:** `shape-sysmon-sensor-hud`, `shape-svchost-outer-shell`, `shape-dropper-pid3104`
- **Interactive Extracted Tokens:**
  - `Sysmon EID 25 (Process Tampering)` $\rightarrow$ `shape-sysmon-sensor-hud`
  - `Type: Image is replaced` $\rightarrow$ `shape-sysmon-sensor-hud`
  - `CloseHandle(0x01C4, 0x01C8)` $\rightarrow$ `shape-dropper-pid3104`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Kernel image-verification callback detects that `PID 4892` is resuming with a replaced primary image mapping.
  - `MOTION ②`: `Sysmon EID 25 (Process Tampering — Type: Image is replaced)` flashes crimson in the telemetry HUD.
  - `MOTION ③`: `Invoice_Q4.exe (PID 3104)` calls `CloseHandle(0x01C4, 0x01C8)` and dims out, leaving hollowed `svchost.exe (PID 4892)` running autonomously.

---

### Stage 5 — Firewall Bypass, Malleable C2 Beaconing & FFT Spectrum Detection (`cameraMode: 'NETWORK_FFT_ANALYZER'`)

#### Sub-Step `5A` — 5A. Host Firewall Masquerading Bypass (`0% – 25%`)
- **Extracted Source Text:** *"Now executing inside `svchost.exe (PID 4892)`, the Beacon initiates outbound HTTPS (`TCP/443`). Windows Defender Firewall inspects the outer process path (`C:\Windows\System32\svchost.exe`) and Microsoft signature, granting outbound access."*
- **Active Actors & Target Shapes:** `shape-svchost-outer-shell`, `shape-firewall-gate`, `shape-sysmon-sensor-hud`
- **Interactive Extracted Tokens:**
  - `C:\Windows\System32\svchost.exe` $\rightarrow$ `shape-svchost-outer-shell`
  - `Firewall Rule: ALLOW svchost.exe` $\rightarrow$ `shape-firewall-gate`
  - `Sysmon EID 3 (NetworkConnect)` $\rightarrow$ `shape-sysmon-sensor-hud`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Hollowed `svchost.exe (PID 4892)` initiates an outbound socket connection on `TCP/443`.
  - `MOTION ②`: The Host Firewall Gate scans the emerald outer wrapper (`Signed: Microsoft Windows | Path: \System32\svchost.exe`) and opens its barrier with `[PASS: TRUSTED SYSTEM SERVICE]`.
  - `MOTION ③`: `Sysmon EID 3 (NetworkConnect)` records `svchost.exe (4892) -> 185.199.108.153:443`.

#### Sub-Step `5B` — 5B. Malleable C2 Profile (`GET /jquery-3.3.1.min.js`) (`25% – 50%`)
- **Extracted Source Text:** *"Cobalt Strike wraps its encrypted tasking metadata inside a Malleable C2 HTTP/1.1 profile (`GET /jquery-3.3.1.min.js`, `Host: cdn-static-content.com`, `Cookie: __cfduid=<Base64 AES-GCM Metadata>`) over TLS 1.3 to `185.199.108.153:443`."*
- **Active Actors & Target Shapes:** `shape-c2-malleable-stream`
- **Interactive Extracted Tokens:**
  - `GET /jquery-3.3.1.min.js` $\rightarrow$ `shape-c2-malleable-stream`
  - `Host: cdn-static-content.com` $\rightarrow$ `shape-c2-malleable-stream`
  - `185.199.108.153:443 (TLS 1.3)` $\rightarrow$ `shape-c2-malleable-stream`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Encrypted Beacon heartbeats encapsulate inside a legitimate-looking `GET /jquery-3.3.1.min.js` HTTPS request header.
  - `MOTION ②`: Packet capsules travel across the DMZ conduit from `10.20.4.115:52814` to `185.199.108.153:443`.
  - `MOTION ③`: C2 server responds with `HTTP/1.1 200 OK (Content-Type: application/javascript)` carrying encrypted operator tasking.

#### Sub-Step `5C` — 5C. Jittered Periodic Heartbeat (`60s ± 15%`) (`50% – 75%`)
- **Extracted Source Text:** *"To evade simple fixed-interval threshold rules, the Beacon sleeps for `Δt = 60s` with `15% random jitter` (`51s, 67s, 54s, 63s, 58s, 66s`), blending into background CDN traffic in the time domain."*
- **Active Actors & Target Shapes:** `shape-c2-malleable-stream`, `shape-fft-spectrum-panel`
- **Interactive Extracted Tokens:**
  - `Sleep = 60s (15% Jitter)` $\rightarrow$ `shape-fft-spectrum-panel`
  - `Δt ∈ [51s, 69s]` $\rightarrow$ `shape-fft-spectrum-panel`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Time-domain telemetry strip plots irregular-looking outbound packet timestamps (`t = 51s, 118s, 172s, 235s, 293s`).
  - `MOTION ②`: Standard static SIEM threshold rule evaluates inter-arrival variance and shows `[STATIC DELTA CHECK: INCONCLUSIVE]`.
  - `MOTION ③`: The time-series sample buffer feeds into the SIEM Discrete Fourier Transform (`F(ω) = ∫ f(t)e^{-iωt} dt`) pipeline.

#### Sub-Step `5D` — 5D. SIEM FFT Frequency-Domain Lock (`f₀ = 0.0167 Hz`) (`75% – 100%`)
- **Extracted Source Text:** *"Applying Fast Fourier Transform (`FFT`) over the outbound connection timestamps strips away the `±15%` time jitter and exposes a sharp fundamental harmonic spike at `f₀ = 1/60s = 0.0167 Hz` (`SNR = 18.4 dB`), confirming automated C2 beaconing."*
- **Active Actors & Target Shapes:** `shape-fft-spectrum-panel`, `shape-sysmon-sensor-hud`
- **Interactive Extracted Tokens:**
  - `FFT F(ω)` $\rightarrow$ `shape-fft-spectrum-panel`
  - `f₀ = 0.0167 Hz (T = 60.0s)` $\rightarrow$ `shape-fft-spectrum-panel`
  - `SNR = 18.4 dB (C2 Locked)` $\rightarrow$ `shape-fft-spectrum-panel`
- **3-Beat Micro-Timeline:**
  - `MOTION ①`: Frequency-domain spectrum analyzer sweeps across `0.001 Hz .. 0.050 Hz`.
  - `MOTION ②`: A sharp crimson spectral spike rises at `f₀ = 0.0167 Hz (Period T = 60.0s)` with harmonic `2f₀ = 0.0333 Hz` above the `-12 dB` noise floor.
  - `MOTION ③`: SIEM correlates `Sysmon EID 1 + EID 10 + EID 25 + EID 3 + FFT 0.0167 Hz`, locking high-confidence detection on `svchost.exe (PID 4892)`.
