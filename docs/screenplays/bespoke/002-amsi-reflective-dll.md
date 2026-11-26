# Director's Blueprint — #002 Fileless AMSI Memory Bypass & Reflective DLL Injection (`amsi-reflective-dll`)

> **Sidebar Position**: `#002 / 188` · **Category**: `MALWARE` (Malware & Process Execution) · **Priority Tier**: `Tier 1 (Flagship)`  
> **Status**: `COMPLETED` (Live Bespoke — Verified via Unit Tests, Build, Lint & Browser Director's Review)  
> **Primary Sources Verified**:
> 1. **Microsoft Learn** — *Antimalware Scan Interface (AMSI) Developer Architecture* (`MS-AMSI-ARCH`): https://learn.microsoft.com/en-us/windows/win32/amsi/antimalware-scan-interface-portal
> 2. **Microsoft PowerShell Team** — *PowerShell Operational Log Event ID 4104 (Script Block Logging)* (`MS-PS-EID-4104`): https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows
> 3. **The MITRE Corporation & Defender Threat Intelligence** — *MITRE ATT&CK T1620 & T1562.001: Reflective Code Loading & AMSI Memory Patching* (`ATT&CK-T1620-T1562`): https://attack.mitre.org/techniques/T1620/

---

## 1. Technical Forensic Architecture Plan

### Kill-Chain Stages (`1..4`)

| Step | Stage Title | MITRE ATT&CK | Exact APIs / Commands / Mechanism | Primary Forensic Artifact |
| ---: | :--- | :--- | :--- | :--- |
| **#1** | **Encoded PowerShell Stager & `AmsiScanBuffer` Address Lookup** | `T1059.001` | `winword.exe` (PID `3820`) spawns `powershell.exe -NoP -W Hidden -Enc ...` (PID `5412`, `CORP\a.miller`). Script resolves `amsi.dll` inside its own user-mode process space via P/Invoke `LoadLibrary("amsi.dll")` + `GetProcAddress(hAmsi, "AmsiScanBuffer")` returning `0x7FF9C2142840`. | **PowerShell Operational EID `4104`** (captures the full de-obfuscated P/Invoke bypass script block *before* AMSI is blinded) + **Sysmon EID `1`** (`winword.exe -> powershell.exe`) |
| **#2** | **Memory Page Protection Unlock (`VirtualProtect` `RX -> RWX`)** | `T1562.001` | `amsi.dll!.text` is mapped read+execute only (`PAGE_EXECUTE_READ = 0x20`). Script calls `kernel32!VirtualProtect(0x7FF9C2142840, 6, PAGE_EXECUTE_READWRITE [0x40], &oldProtect)` triggering Copy-on-Write and unlocking the live code page for writing. | **Kernel ETW Threat Intel (`EtwTiLogProtectVM`)** flagging `RX -> RWX` protection flip on signed `amsi.dll` |
| **#3** | **6-Byte Prologue Short-Circuit Patch (`E_INVALIDARG`) & Re-Lock** | `T1562.001` | `Marshal.Copy` overwrites the first 6 bytes of `AmsiScanBuffer` (`4C 8B DC 49 89 5B`) with **`B8 57 00 07 80 C3`** (`mov eax, 0x80070057; ret` = `E_INVALIDARG`), then calls `VirtualProtect` to restore `PAGE_EXECUTE_READ (0x20)`. Every future scan short-circuits locally and never reaches Windows Defender (`MpOav.dll`). | **In-Memory Integrity Mismatch** (disk `SEC_IMAGE` vs live Copy-on-Write dirty page in `amsi.dll!.text`) + **ETW `EtwTiLogProtectVM`** restore transition |
| **#4** | **Zero-Disk Download & In-Memory Reflective Assembly / DLL Load** | `T1620` | Now invisible to AMSI, PowerShell fetches the stage-2 binary strictly into a RAM byte array (`(New-Object Net.WebClient).DownloadData(...)` — zero NTFS file written, so Sysmon EID `11` never fires) and loads it directly in volatile RAM via `[System.Reflection.Assembly]::Load($bytes)` / `ReflectiveLoader`, mapping an unbacked `MEM_PRIVATE RWX` PE image at `0x000001E4A2100000` and resolving relocations + IAT in memory. | **Sysmon EID `3`** (PowerShell outbound HTTPS to `198.51.100.74:443`) + **Unbacked `MEM_PRIVATE RWX` VAD** (`4D 5A 90 00` MZ header with zero backing file path) + **CLR ETW AssemblyLoad** (`AssemblyFlags` memory-only) |

### Authentic Telemetry Plan
- **Host / Process**: `WKS-FIN-09` (`10.10.4.27`), user `CORP\a.miller`, `explorer.exe (2188)` -> `winword.exe (3820)` -> `powershell.exe (5412)`.
- **Correlated Logs**:
  1. `Sysmon EventID 1` + `WinSec EventID 4688` + `PowerShell Operational EventID 4104` (Stage 1 — `winword.exe -> powershell.exe` + full P/Invoke `AmsiScanBuffer` script block).
  2. `ETW Threat-Intelligence EtwTiLogProtectVM` + `Sysmon EventID 7` (`amsi.dll` ImageLoaded + `0x20 -> 0x40` page protection flip at `0x7FF9C2142840`).
  3. `Defender Memory Scanner / ETW-Ti Integrity Alert` (`amsi.dll!AmsiScanBuffer` 6-byte prologue diff: `4C 8B DC 49 89 5B` -> `B8 57 00 07 80 C3`, followed by `0x40 -> 0x20` re-lock).
  4. `Sysmon EventID 3` (NetworkConnect `powershell.exe` -> `198.51.100.74:443`) + `Microsoft-Windows-DotNETRuntime ETW EventID 152` (in-memory `AssemblyLoad` with empty disk path, zero `Sysmon EID 11`).

### Memory Forensics Grounding
- **Documented Memory Blocks**: **YES** (`memory-forensics` section enabled across 3D, 2D Silent Lecture Clip, and Excalidraw Whiteboard):
  1. **`0x7FF9C2142840` (`amsi.dll!.text` — Patched `AmsiScanBuffer` Prologue)**: Copy-on-Write private dirty page inside signed `SEC_IMAGE`. Live hex `B8 57 00 07 80 C3` (`mov eax, 0x80070057; ret`) vs. clean on-disk `4C 8B DC 49 89 5B`.
  2. **`0x000001E4A2100000` (Unbacked `MEM_PRIVATE` `PAGE_EXECUTE_READWRITE` Reflective Payload)**: Full PE/CLR image mapped directly in volatile RAM (`4D 5A 90 00` MZ + `50 45 00 00` PE + `ReflectiveLoader` stub) with **no** backing file on NTFS.
  3. **`0x000001E4A2150000` (Managed CLR Assembly Heap & Decrypted Stage-2 Config)**: In-memory `.NET` execution heap carrying decrypted tasking logic inside `powershell.exe` while NTFS disk remains untouched.

---

## 2. Cinematic Inspiration & Visual Language

- **Film / Tone Reference**: *Ghost in the Shell* precision mechanical dissection meets *Ocean's Eleven* customs-vault sabotage — rendered in crisp cel-shaded Japanese anime studio style (`MOD-09`) matching `process-hollowing`.
- **Bespoke Real-World Universe**: **The Automated X-Ray Inspection Chamber & Zero-Floor Levitation Workshop** (all inside one glass-walled high-precision workshop room representing `powershell.exe`'s own user-mode address space, with an elevated **Watchtower Security Booth** above representing Windows Defender and a sealed **Warehouse Loading Scale** on the right representing the NTFS Disk).
- **Lighting Mood & Palette**:
  - **Sky & Ambient**: Crisp daytime studio workshop sky through clerestory glass windows (`#DCEBFA` -> `#93C5FD`), warm sunlit concrete/oak floor (`#E8DFD1`), slate-blue industrial X-Ray tunnel (`#1E3A5F`), and warm brass workshop tooling (`#D97706`).
  - **State Contrast Colors**: Clean cyan laser sweep (`#06B6D4`) & emerald pass lamp (`#10B981`) for normal inspection; crimson alarm strobe (`#DC2626`) for blocked threat; amber unlocked hatch (`#F59E0B`) for `RWX` page unlock & bypass jumper; violet ultraviolet glow (`#7C3AED`) for the forensic tamper-seal witness (`EtwTiLogProtectVM`).
- **Mute Test Proof (Zero-Text Comprehension)**:
  1. Even with 100% of labels and captions hidden, the viewer first watches a normal parcel pass the X-Ray tunnel with a green light, then watches a glowing red contraband canister trigger the X-Ray laser, slam the heavy steel drop-gate shut, and ring the Watchtower alarm bell.
  2. Next, a technician inside the **same room** walks straight to the side of the X-Ray machine, unbolts its locked glass safety hatch with a brass wrench, yanks out all 6 live copper inspection fuses, snaps in a single 6-pin solid brass short-circuit jumper that physically disconnects the Watchtower cable, and closes the glass hatch.
  3. Finally, the warehouse floor door stays padlocked at `0.0 kg` while an overhead pneumatic glass air-tube drops floating metallic components onto a **mid-air levitation ring** (never touching the floor!), a test signal bounces harmlessly off the rigged bypass jumper with the drop-gate wide open, and the parts snap together mid-air into a live hovering reconnaissance drone — while both an overhead paper-tape printer and a violet hinge crack sensor record the sabotage.
- **Swap Test Proof (Zero Interchangeability)**:
  - Trying to transplant this world onto `Kerberoasting`, `SQL Injection`, `Ransomware`, or `Process Hollowing` fails immediately: none of those attacks involve opening a live scanner's own 6-pin fuse panel inside the same process room to short-circuit an inspection cable, nor keeping a `0.0 kg` floor scale untouched while assembling a hovering payload mid-air from an overhead air-tube. Every single articulated mechanism is uniquely `AMSI Memory Bypass + Reflective DLL Injection`.

---

## 3. Exact 1-to-1 Technical <-> Physical Articulation Map

| Technical Artifact (API / Protocol / Log / Struct) | Articulated 3D Prop | Physical State Transformation |
| :--- | :--- | :--- |
| **`powershell.exe` User-Mode Address Space** | Single Glass-Walled Precision Workshop Floor | Houses BOTH the script workbench AND the X-Ray scanner's own side circuit panel in the same reachable room. |
| **`amsi.dll!AmsiScanBuffer` (`0x7FF9C2142840`)** | Automated X-Ray Inspection Tunnel + 6-Pin Side Circuit Box | Sweeps cyan laser across incoming trays; normal wire routes alarm up to the Watchtower drop-gate. |
| **Windows Defender (`MpOav.dll`)** | Elevated Watchtower Security Booth + Overhead Copper Alarm Cable | Rings red siren and drops steel guillotine gate in Act 1; goes dark/silent once the 6-pin jumper cuts the signal path. |
| **`PAGE_EXECUTE_READ` (`0x20`) -> `VirtualProtect` (`0x40`)** | Bolted Blue Glass Safety Hatch + Brass Maintenance Wrench | Wrench turns hex bolt; blue tamper-seal cracks; glass hatch swings open `105 deg` with amber `RWX` rim glow, then re-locks after patching. |
| **Original 6-Byte Prologue (`4C 8B DC 49 89 5B`)** | 6 Vertical Glowing Copper Inspection Fuses | Physically pulled upward and ejected from fuse slots `1..6` inside the cutaway circuit chamber. |
| **6-Byte Patch (`B8 57 00 07 80 C3` = `E_INVALIDARG`)** | Solid 6-Pin Brass U-Shaped Short-Circuit Jumper | Snaps down into slots `1..6`, visibly looping the incoming pulse directly back to an amber "SKIP" lamp so no pulse climbs the Watchtower wire. |
| **NTFS Disk / `Sysmon EventID 11` (FileCreate)** | Sealed Warehouse Receiving Door & Digital Floor Scale (`0.0 kg`) | Padlock remains shut and floor scale needle stays pinned at `0.0 kg` throughout the entire attack. |
| **`WebClient.DownloadData` + `[Assembly]::Load($bytes)` / `ReflectiveLoader`** | Overhead Pneumatic Glass Air-Tube + Floating Levitation Assembly Ring | Drops loose glowing parts straight from the roof tube onto a hovering ring above the floor (zero floor contact); parts snap together mid-air into an armed spinning Clockwork Drone. |
| **`PowerShell EventID 4104` (Script Block Log)** | Overhead Mechanical Paper-Tape Transcript Printer | Reels out an amber paper ribbon printing the unlock sequence *during* Act 2 before the fuses are pulled. |
| **`ETW EtwTiLogProtectVM` (Kernel Memory-Protection Telemetry)** | Violet Ultraviolet Hinge Crack Sensor on X-Ray Hatch | Flashes unmistakable violet forensic beacon the exact instant the blue glass hatch seal cracks (`RX -> RWX`). |

---

## 4. Act-by-Act Choreography Timeline (`0% -> 100%`)

### Overview Hero Film (`briefing` — 20.0s Continuous 5-Act Loop)
- **Act 1 (`0%–18%`) — Baseline Normal X-Ray Enforcement**:
  - Clean green crate glides left-to-right on the conveyor, gets cyan laser sweep, green lamp glows, passes gate smoothly.
  - Red contraband canister follows onto conveyor -> X-Ray sweeps crimson -> copper cable pulses upward to the Watchtower -> red siren flashes and heavy steel drop-gate slams shut, halting the canister.
- **Act 2 (`18%–38%`) — Same-Room Discovery & `VirtualProtect` Hatch Unlock**:
  - Covert technician steps from the Workshop Console right up to the X-Ray Tunnel's side circuit box, locates brass address plaque (`0x7FF9C2142840`), and engages the Brass Master Wrench on the hatch bolt.
  - Overhead Paper-Tape Printer reels out amber transcript tape (`EID 4104`).
  - Blue safety seal shatters; Glass Safety Hatch swings open `105 deg` with amber `RWX` unlock glow; Violet Hinge Crack Sensor flashes (`EtwTiLogProtectVM`).
- **Act 3 (`38%–62%`) — Cutaway 6-Pin Fuse Swap & Re-Lock**:
  - Camera cuts tight into the open X-Ray Circuit Box (`Cutaway AUTO` opens upper hood too).
  - The 6 glowing copper inspection fuses lift smoothly out of slots `1..6`.
  - The 6-pin Brass U-Shaped Short-Circuit Jumper drops and clicks firmly into slots `1..6`.
  - The copper cable running up to the Watchtower visibly dims to dead dark gray; the glass hatch swings shut and clicks back into cool blue sealed appearance (`VirtualProtect` restore `0x20`).
- **Act 4 (`62%–84%`) — Zero-Disk Air-Tube Drop & Mid-Air Reflective Assembly**:
  - Warehouse Floor Door stays padlocked (`0.0 kg` scale needle flat at zero).
  - Overhead Pneumatic Glass Air-Tube whooshes glowing metallic sub-parts straight down onto the Floating Levitation Assembly Ring (`y = 2.1`, clearly hovering above the empty workshop floor).
  - A scan pulse enters the X-Ray Tunnel, hits the Brass Jumper Loop, bounces straight back with an amber "SKIP" blink (Watchtower stays dark, drop-gate stays raised!).
  - Floating pieces converge along radial guide rails and snap together mid-air with rotating brass gear rings (relocations + IAT) into a hovering, humming **Clockwork Reconnaissance Drone**.
- **Act 5 (`84%–100%`) — Split-Contrast Finale & Forensic Witnesses**:
  - The Reconnaissance Drone orbits calmly above the untouched `0.0 kg` floor scale while the Watchtower monitor upstairs displays **ALL CLEAR / GREEN**.
  - Simultaneously, camera highlights the two glowing forensic witnesses: the reeled-out **Paper-Tape Transcript (`EID 4104`)** and the pulsing **Violet Hinge Crack Beacon (`EtwTiLogProtectVM`)** plus the mismatched 6-pin Brass Jumper inside the X-Ray cutaway.

### Per-Step Bespoke 3D Dioramas (`step-1` .. `step-4` + `memory-forensics`)
Each section mounts a **dedicated, self-contained bespoke diorama** (not a replay of the full room):
- **`step-1`**: Workshop Desk Magnifier + Brass Address Blueprint Table zooming onto `amsi.dll` plaque while overhead Paper-Tape Printer (`EID 4104`) clicks and feeds ribbon.
- **`step-2`**: Macro Mechanical Lock Chamber of the X-Ray Side Hatch — hex bolt turning, blue `RX` glass seal fracturing, amber `RWX` light flooding the cavity, violet UV sensor firing (`EtwTiLogProtectVM`).
- **`step-3`**: Macro 6-Pin Fuse Rack Cutaway — animated extraction of 6 copper pins, precision insertion of the 6-pin Brass U-Jumper, dead Watchtower wire + "SKIP" short-circuit pulse bounce, and glass cover re-lock.
- **`step-4`**: Split Chamber of Sealed `0.0 kg` Warehouse Scale vs. Pneumatic Air-Tube & Floating Levitation Ring snapping loose PE/CLR segments into the hovering Clockwork Drone.
- **`memory-forensics`**: Dual-Plinth Forensic Comparison Bench — Left plinth holds the sealed **On-Disk `amsi.dll` Vault Cassette** (`4C 8B DC 49 89 5B` clean 6 pins); Right plinth holds the **Live Workshop RAM Fuse Block** (dirty Copy-on-Write Brass Jumper `B8 57 00 07 80 C3`) beside the **Floating Unbacked Levitation Ring** (`0x000001E4A2100000` `MEM_PRIVATE RWX` with zero floor tether).

---

## 5. Mandatory 5-Shot Camera Shot List (`briefing` + 4 Presets per Section)

All structural frames and wall gantries remain behind `z <= -2.2` (`MOD-09`) for zero foreground lens occlusion:

1. **Shot 1 — Establishing Wide Shot (`DIRECTOR` / Preset 1)**: Sweeps smoothly across the full workshop at `(0.4, 5.2, 13.8) -> (0.0, 2.2, 0.0)`, showing the X-Ray Conveyor left, elevated Watchtower center-back, and sealed `0.0 kg` Warehouse Door + Levitation Ring zone right.
2. **Shot 2 — Push-In Close-Up on Side Circuit Hatch (`HATCH_LOCK` / Preset 2)**: Tight 3/4 push-in `(-3.8, 3.1, 6.2) -> (-1.6, 2.0, 0.2)` framing the Brass Wrench engaging the blue glass `RX` bolt and the Violet Hinge Sensor igniting.
3. **Shot 3 — X-Ray Cutaway Macro (`FUSE_CUTAWAY` / Preset 3)**: Direct interior cutaway view `(-1.6, 2.6, 4.9) -> (-1.6, 2.0, 0.0)` with zero foreground pillars, clearly showing all 6 fuse pins lifting out and the 6-pin Brass Jumper locking in while the Watchtower wire goes dark.
4. **Shot 4 — Climax Air-Tube & Levitation Tracking Shot (Dynamic Act 4 Director Motion)**: Tracks from the overhead pneumatic air-tube down onto the hovering Levitation Ring `(3.8, 3.6, 7.6) -> (3.6, 2.3, 0.0)` as loose pieces snap together mid-air above the untouched `0.0 kg` floor scale.
5. **Shot 5 — Witness & Contrast Finale (`WATCHTOWER_CONTRAST` / Preset 4)**: Elevated diagonal two-plane frame `(5.4, 5.8, 11.4) -> (0.4, 2.6, -0.8)` uniting the blind Watchtower monitor ("ALL CLEAR"), the orbiting mid-air Drone, the amber Paper-Tape Printer (`EID 4104`), and the violet UV Hinge Beacon (`EtwTiLogProtectVM`).

---

## 6. 2D Silent Lecture Spatial Sentences (`MOD-14`) & Excalidraw Whiteboard Plan (`MOD-13`)

### Bespoke 2D SVG + GSAP Silent Lecture Clips (`components/technical-clip/clips/amsi-reflective-dll/`)
Strictly omitted on `briefing` (`MOD-14 §3`); 100% bespoke per step with unique `svgPrefix` (`amsi1..amsi4`, `amsimem`) and `clipPace.ts` floors:

1. **`step-1` (`AmsiStep1LookupClip.tsx`, prefix `amsi1`)**: *Spatial Sentence*: `winword.exe` launches an encoded `powershell.exe` lane; a glowing address pointer resolves `amsi.dll!AmsiScanBuffer` (`0x7FF9C2142840`) inside the same user-mode box while the `EID 4104` Script Block Log tape catches the full de-obfuscated P/Invoke call above the boundary.
2. **`step-2` (`AmsiStep2VirtualProtectClip.tsx`, prefix `amsi2`)**: *Spatial Sentence*: A `VirtualProtect` syscall crosses the User/Kernel ring line targeting `0x7FF9C2142840`, flipping the page-table lock icon from blue `PAGE_EXECUTE_READ (0x20)` to amber `PAGE_EXECUTE_READWRITE (0x40)` via Copy-on-Write while a violet kernel `EtwTiLogProtectVM` pulse fires upward.
3. **`step-3` (`AmsiStep3PatchPrologueClip.tsx`, prefix `amsi3`)**: *Spatial Sentence*: Inside the zoomed 6-byte instruction strip of `AmsiScanBuffer`, original bytes `4C 8B DC 49 89 5B` slide out and `B8 57 00 07 80 C3` (`mov eax, 0x80070057; ret`) lock into place, deflecting an incoming scan arrow straight back (`E_INVALIDARG`) away from `MpOav.dll` before the page re-locks to `RX (0x20)`.
4. **`step-4` (`AmsiStep4ReflectiveLoadClip.tsx`, prefix `amsi4`)**: *Spatial Sentence*: While the `NTFS Disk / Sysmon EID 11` slot stays crossed-out and empty (`0 bytes`), an HTTPS stream (`198.51.100.74:443`) feeds a byte array directly into `[Assembly]::Load($bytes)` / `ReflectiveLoader`, carving an unbacked `MEM_PRIVATE RWX` block (`0x000001E4A2100000`), snapping its PE sections + IAT into place, and invoking `DllMain`.
5. **`memory-forensics` (`AmsiMemoryDiffClip.tsx`, prefix `amsimem`)**: *Spatial Sentence*: Split forensic comparison showing (Top) On-Disk signed `amsi.dll` (`4C 8B DC 49 89 5B`) vs. Live RAM CoW dirty page (`B8 57 00 07 80 C3`), and (Bottom) Disk File Table (`NONE`) vs. Unbacked `MEM_PRIVATE RWX` PE image (`4D 5A 90 00` at `0x000001E4A2100000`).

### Bespoke Excalidraw Chalk Whiteboards (`modules/scenarios/amsi-reflective-dll/excalidraw/scenes/`)
All 6 sections (`briefing`, `step-1`, `step-2`, `step-3`, `step-4`, `memory-forensics`) authored modularly with `ARROW_GAP >= 150`, bare arrows with floating captions, yellow sticky `NOTE`, footer hover hint, and rich cream `#FDFBF7` hover tooltips on every teaching card:
- **`briefing.ts`**: End-to-end 4-stage kill-chain map (`winword.exe` -> `powershell.exe` -> `amsi.dll` 6-byte bypass -> unbacked `MEM_PRIVATE` reflective load) with dual detection callouts (`EID 4104` + `EtwTiLogProtectVM`).
- **`step-1.ts`**: P/Invoke resolution map (`LoadLibrary` + `GetProcAddress` -> `0x7FF9C2142840`) paired with `PowerShell EID 4104` capture point.
- **`step-2.ts`**: User-to-Kernel `VirtualProtect` page-protection transition (`0x20 RX` -> `0x40 RWX` Copy-on-Write) + `EtwTiLogProtectVM` kernel sensor.
- **`step-3.ts`**: Byte-level prologue patch comparison (`4C 8B DC 49 89 5B` -> `B8 57 00 07 80 C3`), `E_INVALIDARG` return loop, and `RX` re-lock.
- **`step-4.ts`**: Zero-disk contrast (`NTFS = 0 B` vs. `WebClient.DownloadData` -> `[Assembly]::Load` / `ReflectiveLoader` -> `0x000001E4A2100000` unbacked `MEM_PRIVATE RWX`).
- **`memory.ts`**: Forensic memory-diff architecture comparing `amsi.dll` disk vs. live dirty page and unbacked `MEM_PRIVATE` PE/CLR regions.

---

## 7. Approval Gate

> **Next Step (`MOD-17 §3 Principle 3`)**: Present this Director's Blueprint to the user for explicit approval or revision. **Zero application code will be written until approved.**
