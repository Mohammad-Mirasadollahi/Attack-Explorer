# Director's Blueprint — #003 LockBit Ransomware Behavioral Analysis: VSS Wipe & Fast Encryption (`ransomware-shadow-wipe`)

> **Sidebar Position**: `#003 / 188` · **Category**: `RANSOMWARE_EXTORTION` *(re-homed from Category 1 `MALWARE` per Master Backlog redesign note)* · **Priority Tier**: `Tier 1 (Flagship)`  
> **Status**: `COMPLETED` (Live Bespoke Engine · Archive Vault & Backup Reel Room)  
> **Primary Sources Verified**:
> 1. **CISA / FBI / MS-ISAC Joint Advisory** — *Understanding Ransomware Threat Actors: LockBit 3.0 (AA23-165A)* (`CISA-AA23-165A`): https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a
> 2. **Microsoft Learn & Sysinternals** — *Volume Shadow Copy Service (VSS) & Sysmon Event ID 1 / 11* (`MS-VSS-SYSMON-11`): https://learn.microsoft.com/en-us/windows-server/storage/file-server/volume-shadow-copy-service
> 3. **The MITRE Corporation & Ransomware DFIR Research** — *MITRE ATT&CK T1486 & T1490: Intermittent File Encryption & Recovery Inhibition* (`ATT&CK-T1486-T1490`): https://attack.mitre.org/techniques/T1486/

---

## 1. Technical Forensic Architecture Plan

### Kill-Chain Stages (`1..4`)

| Step | Stage Title | MITRE ATT&CK | Exact APIs / Commands / Mechanism | Primary Forensic Artifact |
| ---: | :--- | :--- | :--- | :--- |
| **#1** | **Remote PsExec Service Staging Over SMB (`ADMIN$` -> `FS-CORP-01`)** | `T1570` / `T1569.002` | From breached admin jump-host `JUMP-OPS-02` (`10.10.15.8`), the LockBit affiliate copies `lb3_black.exe` over SMB TCP `:445` to `\\FS-CORP-01\ADMIN$\lb3_black.exe` and invokes `PsExec.exe` to register and start service `PSEXESVC` on `FS-CORP-01` (`10.10.50.14`) as `NT AUTHORITY\SYSTEM`. | **Windows System Event ID `7045`** (New Service Installed: `PSEXESVC` running `lb3_black.exe -pass <key>`) + **Windows Security EID `5145`** (`ADMIN$` share write from `10.10.15.8`) |
| **#2** | **Backup & Recovery Destruction (`vssadmin`, `wmic`, `bcdedit`)** | `T1490` | Before encrypting a single file, `lb3_black.exe` (PID `6412`) executes `vssadmin.exe delete shadows /all /quiet`, `wmic.exe shadowcopy delete /nointeractive`, and `bcdedit.exe /set {default} recoveryenabled No` + `bootstatuspolicy ignoreallfailures`, then stops `VSS` and database/backup services (`sqlservr`, `VeeamBackupSvc`) so files unlock and snapshots vanish permanently. | **Sysmon Event ID `1`** (`lb3_black.exe -> vssadmin.exe delete shadows /all /quiet` & `bcdedit.exe`) + **Windows System Event ID `7036`** (`Volume Shadow Copy` service entered stopped state) + **VSS Event ID `8224`** |
| **#3** | **High-Speed Intermittent Head-Only Encryption via I/O Completion Ports** | `T1486` | `lb3_black.exe` queries logical CPU cores and spawns a multi-threaded **Windows I/O Completion Port (`CreateIoCompletionPort`)** worker pool. For each target file on `D:\Finance_Shares\`, workers generate an ephemeral **ChaCha20 / AES-256** file key (wrapped with the embedded **RSA-2048** attacker public key) and encrypt **only the first 4 KB–64 KB header stripe** (intermittent/head-only encryption) before appending `.lockbit` — corrupting 10,000+ multi-gigabyte documents in seconds without saturating disk bandwidth. | **Sysmon Event ID `11` / High-Velocity I/O Burst** (thousands of `.lockbit` file renames & header rewrites per second across `D:\Finance_Shares\`, `D:\HR_Records\`, `D:\CAD_Archives\`) + **Windows Security EID `4663`** (Object Access mass write spike) |
| **#4** | **Ransom Note Drop, Wallpaper Override & Self-Deletion (`Restore-My-Files.txt`)** | `T1486` / `T1070.004` | Upon completion, worker threads drop `Restore-My-Files.txt` inside every encrypted folder containing the victim's unique personal ID and Tor negotiation portal, replace the Windows desktop wallpaper via registry (`HKCU\Control Panel\Desktop\Wallpaper` -> `lb3_wall.bmp`), and clear Windows Event Logs (`wevtutil cl Security`) before launching a self-delete ping/del command. | **Sysmon Event ID `11`** (`Restore-My-Files.txt` created across every share directory) + **Sysmon Event ID `13`** (Registry Value Set on desktop wallpaper) + **Windows Security EID `1102`** (Audit Log Cleared) |

### Authentic Telemetry Plan
- **Host / Network**: Breached jump-host `JUMP-OPS-02` (`10.10.15.8`) -> File Server `FS-CORP-01` (`10.10.50.14`), `services.exe (684)` -> `PSEXESVC.exe (5892)` -> `lb3_black.exe (6412)` -> `vssadmin.exe (6504)` & `bcdedit.exe (6540)`.
- **Correlated Logs**:
  1. `Windows System EventID 7045` + `WinSec EventID 5145` (Stage 1 — `PSEXESVC` installed over `ADMIN$` from `10.10.15.8` launching `lb3_black.exe`).
  2. `Sysmon EventID 1` + `Windows System EventID 7036` (Stage 2 — `vssadmin.exe delete shadows /all /quiet`, `bcdedit.exe /set {default} recoveryenabled No`, and `VSS` service stopped).
  3. `WinSec EventID 4663` + `EDR File-I/O Heuristic` (Stage 3 — `lb3_black.exe` multi-threaded IOCP burst overwriting initial 4 KB–64 KB stripes and renaming 4,820 files to `.lockbit`).
  4. `Sysmon EventID 11` + `Sysmon EventID 13` + `WinSec EventID 1102` (Stage 4 — mass `Restore-My-Files.txt` drop, wallpaper registry hijack, and `wevtutil cl Security` attempt).

### Memory Forensics Grounding
- **Documented Memory Blocks**: **NO** (`memory-forensics` section intentionally **omitted** across 3D, 2D clips, and Excalidraw whiteboards per `PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md` and `MOD-17 §3 Principle 3` — LockBit's primary forensic footprint is disk/VSS/service/I/O behavioral evidence rather than process memory hollowing).
- **Exact Bespoke Section Matrix**: **5 bespoke 3D scenes** (`briefing`, `step-1`, `step-2`, `step-3`, `step-4`), **4 bespoke 2D SVG+GSAP clips** (`step-1..4`; strictly NO clip on `briefing`), and **5 bespoke Excalidraw whiteboards** (`briefing`, `step-1..4`).

---

## 2. Cinematic Inspiration & Visual Language

- **Film / Tone Reference**: *Mission: Impossible* high-stakes archive vault sabotage meets *Chernobyl* control-room emergency escalation — rendered in crisp cel-shaded Japanese anime studio style (`MOD-09`).
- **Bespoke Real-World Universe (100% Independent Engine)**: **The Municipal Records Vault & Archival Backup Reel Room** — a wide two-zone industrial records archive hall:
  - **Left Zone (Safety Backup Archive)**: A brushed-steel **Microfilm Backup Rack** holding **4 spinning Silver Archival Time-Snapshot Reels** (`Volume Shadow Copies`) mounted above a brass recovery lever (`WinRE / bcdedit`), directly adjacent to an **Industrial High-Torque Ribbon Shredder** with rotating steel blades and a metal catch bin.
  - **Center-Right Zone (Active Records Filing Wall)**: **4 Parallel Glass-Fronted Steel Filing Vaults** (`D:\Finance`, `D:\HR`, `D:\CAD`, `D:\ERP`) stacked with crisp ivory paper ledgers, served overhead by a **4-Arm Synchronized Pneumatic Stamping Gantry** (`Windows I/O Completion Ports` parallel worker threads). Crucially, each stamping arm visibly scorches and locks **ONLY the top crimson header strip** (`First 4 KB–64 KB`) of each ledger stack—leaving the lower white paper bulk untouched yet unreadable—and slams a **Heavy Crimson Cast-Iron Padlock** (`.lockbit`) onto the vault door!
  - **Rear-Left Entry & Foreground Glass Wall**: A pneumatic **Remote Dispatch Service Hatch** (`PsExec` over SMB `:445`) on the left wall, an **Overhead Emergency Audit Console & Service Status Board** (`EID 7045 / 7036 / 1102`) mounted strictly behind `z <= -3.4`, and a **Frosted Glass Vault Entrance Door** at right where a mechanical placard press bolts a bright crimson **Extortion Notice Board** (`Restore-My-Files.txt`).
- **Lighting Mood & Palette**:
  - **Sky & Ambient**: Warm fluorescent archive skylight (`#EFE9DE` -> `#CBD5E1`) over polished slate-gray concrete archive tiles (`#D6D3CD`) with brushed steel racking (`#475569`) and brass hardware (`#B45309`).
  - **State Contrast Colors**: Calm silver-blue (`#38BDF8`) & emerald (`#10B981`) for intact backup reels and unlocked ledgers; scorching safety-amber (`#F59E0B`) for the shredder teeth & service dispatch; high-contrast crimson (`#DC2626`) for header-only scorch stripes, heavy padlocks, and the bolted ransom placard; violet (`#7C3AED`) for the ceiling SIEM audit beacon that refuses to go blind.
- **Mute Test Proof (Zero-Text Comprehension)**:
  1. Even with 100% of labels and captions hidden, the viewer first sees four intact silver backup reels spinning peacefully on the left rack and crisp white ledger folders gliding cleanly through unlocked filing vaults on the right.
  2. Next, a remote dispatch capsule bursts through the left service hatch, yanks all four silver backup reels off their spindles straight into the roaring steel shredder (scattering metallic confetti ribbons into the bin) and snaps off the emergency green recovery lever.
  3. Immediately afterward, four synchronized overhead mechanical arms plunge in parallel across all four filing vaults—stamping a thin crimson lock-band strictly across the **top header edge** of each ledger stack (leaving the bottom 90% visibly untouched!) while slamming four heavy crimson padlocks shut and bolting a giant red ransom placard across the glass archive door.
- **Swap Test Proof (Zero Interchangeability)**:
  - Attempting to transplant this shredded-microfilm-reels + broken-recovery-lever + 4-arm-parallel-header-only-stamping-gantry + bolted-ransom-placard world onto `Process Hollowing`, `AMSI Bypass`, `3CX Supply Chain`, or `Kerberoasting` breaks completely: none of those attacks destroy offline backup snapshots before executing parallel head-only file locking and posting an extortion notice.

---

## 3. Exact 1-to-1 Technical <-> Physical Articulation Map

| Technical Artifact (API / Protocol / Log / Struct) | Articulated 3D Prop | Physical State Transformation |
| :--- | :--- | :--- |
| **SMB `:445` `ADMIN$` + `PsExec` (`EID 7045`)** | Remote Brass Pneumatic Service Dispatch Hatch + Armored Capsule | Capsule shoots from left wall conduit, latches into the Service Hatch, and flips the `SYSTEM` master breaker switch down. |
| **Volume Shadow Copies (`VSS` Snapshots)** | 4 Spinning Silver Archival Microfilm / Tape Reels on Steel Spindles | Reels spin calmly under emerald lamp in Act 1, then lift off their spindles and feed directly into the shredder jaws in Act 2. |
| **`vssadmin delete shadows /all /quiet` & `wmic`** | Industrial High-Torque Twin-Roller Ribbon Shredder + Ribbon Bin | Rotating toothed steel rollers spin up with amber sparks, pulling silver film down and ejecting shredded silver strips into the floor bin. |
| **`bcdedit /set {default} recoveryenabled No`** | Glass-Cased Emerald Emergency Recovery Lever (`WinRE`) | Mechanical striker slams the glass cover open and snaps the green recovery handle cleanly off its hinge, turning the backup status lamp dead red. |
| **Windows `CreateIoCompletionPort` Worker Pool** | 4-Arm Synchronized Overhead Pneumatic Stamping Gantry | Four articulated robotic arms deploy simultaneously along an overhead steel rail (`z <= -2.4`) in staggered high-speed parallel rhythm. |
| **Intermittent Head-Only Encryption (`4 KB–64 KB` ChaCha20/AES + RSA-2048)** | Translucent Glass-Fronted Filing Vaults + Striped Paper Ledgers | Each stamping arm scorches/bands **ONLY the top 15% header strip** of every ledger stack glowing crimson while the lower 85% white paper remains visibly untouched, proving speed-over-full-overwrite mechanics. |
| **`.lockbit` Extension Rename & File Lock** | 4 Heavy Cast-Iron Crimson Padlocks | Heavy mechanical shackles snap shut across all four vault latches simultaneously with audible-looking mechanical recoil. |
| **`Restore-My-Files.txt` + Wallpaper Override (`EID 11` / `13`)** | Front Glass Archive Door + Mechanical Placard Press | Hydraulic stamp slams a framed crimson Extortion Notice Placard onto the glass entrance while the lobby monitor switches to a crimson lock screen. |
| **SIEM / EDR Behavioral Witnesses (`EID 7045 / 1 / 7036 / 1102`)** | Elevated Ceiling Audit Ticker & Tamper-Proof Glass Log Vault | Logs every stage in real time; when the attacker triggers a wiper pulse (`wevtutil`), the central glass beacon flashes bright violet (`EID 1102 Audit Cleared`) proving an unmistakable forensic trail. |

---

## 4. Act-by-Act Choreography Timeline (`0% -> 100%`)

### Overview Hero Film (`briefing` — 20.0s Continuous 5-Act Loop)
- **Act 1 (`0%–18%`) — Calm Archive Baseline & Intact Backups**:
  - Four silver backup reels rotate smoothly on the left rack under emerald status lights; the four glass-fronted filing vaults sit unlocked with clean ivory ledgers inside; the green Emergency Recovery Lever is intact.
- **Act 2 (`18%–36%`) — Remote `PsExec` Dispatch (`EID 7045`)**:
  - Armored brass dispatch capsule streaks down the left pneumatic tube from `JUMP-OPS-02`, slams into the `FS-CORP-01` service hatch, throws the master `SYSTEM` breaker, and wakes the sabotage mechanism while the ceiling Audit Console stamps `EID 7045`.
- **Act 3 (`36%–60%`) — Backup Reel Shredding & Recovery Lever Sabotage (`vssadmin` + `bcdedit`)**:
  - Camera tracks tight on the Backup Archive (`Cutaway AUTO` opens the shredder intake hood): all four silver microfilm reels detach and feed downward into the spinning shredder rollers, showering metallic ribbons into the bin; a hydraulic striker snaps off the green Recovery Lever while the `VSS` service indicator drops to dead gray (`EID 1` + `EID 7036`).
- **Act 4 (`60%–84%`) — 4-Arm Parallel Head-Only Encryption Burst (IOCP + `.lockbit`)**:
  - All four overhead pneumatic gantry arms plunge in rapid parallel bursts across the four filing vaults—visibly scorching ONLY the top header stripe (`First 4 KB–64 KB`) of every ivory ledger stack crimson while leaving the lower bulk visibly white—and slam four heavy crimson padlocks across the vault doors.
- **Act 5 (`84%–100%`) — Ransom Placard Bolt, Wallpaper Flip & Forensic Witness Finale**:
  - The mechanical press bolts the bright red **Extortion Notice Placard** (`Restore-My-Files.txt`) onto the right entrance glass and flips the room wall screen crimson; the shredder bin sits overflowing with destroyed backups while the ceiling SIEM beacon pulses violet (`EID 1102` + `EID 7045` + `EID 1`).

### Per-Step Bespoke 3D Dioramas (`step-1` .. `step-4`)
- **`step-1`**: Macro Remote Service Conduit & `PSEXESVC` Breaker Bay — showing the SMB capsule arriving from `10.10.15.8`, latching into `ADMIN$`, and throwing the `SYSTEM` service switch while the `EID 7045` amber witness lamp ignites.
- **`step-2`**: Macro Twin-Roller Backup Shredder & Recovery Lever Rig — close-up of silver microfilm reels unwinding into spinning steel cutters beside the snapping green `WinRE` recovery handle and stopped `VSS` dial.
- **`step-3`**: Macro 4-Lane IOCP Stamping Bench & Cutaway Ledger Stack — zoomed glass-sided ledger stack showing a ChaCha20/RSA key drum stamping ONLY the top `4 KB–64 KB` crimson band (leaving lower pages white) across 4 synchronized lanes before heavy `.lockbit` padlocks snap shut.
- **`step-4`**: Entrance Glass Door Placard Press & Ceiling Audit Vault — mechanical arm bolting `Restore-My-Files.txt` onto the glass entrance, wall monitor snapping to crimson extortion screen, and violet `EID 1102` audit-clear alarm flaring upstairs.

---

## 5. Mandatory 5-Shot Camera Shot List (`briefing` + 4 Presets per Section)

All structural gantries, rear walls, and ceiling audit consoles remain behind `z <= -2.4` (`MOD-09`) for zero lens occlusion:

1. **Shot 1 — Establishing Wide Archive Hall (`DIRECTOR` / Preset 1)**: `(0.2, 5.4, 14.2) -> (0.0, 2.2, 0.0)` showing the Left Backup Reel Rack + Shredder, Center-Right 4-Vault Filing Wall + Overhead 4-Arm Gantry, and Far-Right Glass Entrance.
2. **Shot 2 — `PsExec` Hatch & Shredder Push-In (`SHREDDER_CLOSE` / Preset 2)**: `(-4.4, 3.0, 6.4) -> (-3.2, 2.0, 0.0)` framing the brass dispatch capsule, spinning silver reels feeding into the shredder blades, and the breaking green Recovery Lever.
3. **Shot 3 — Cutaway Head-Only Ledger Encryption Macro (`VAULT_CUTAWAY` / Preset 3)**: `(1.4, 2.7, 5.4) -> (1.4, 1.9, 0.2)` tight onto the glass-fronted filing vaults as all 4 IOCP arms stamp ONLY the top crimson header stripe while lower pages stay white, followed by the crimson padlocks snapping shut.
4. **Shot 4 — Climax Gantry Sweep Tracking Shot (Dynamic Act 4 Director Motion)**: Smooth horizontal dolly tracking across all four vaults `( -1.0 -> 3.6, 3.4, 7.8 )` synchronized with the blistering parallel IOCP padlock volley.
5. **Shot 5 — Ransom Placard & Ceiling Witness Finale (`WITNESS_FINALE` / Preset 4)**: Elevated diagonal frame `(5.8, 5.6, 11.8) -> (0.2, 2.4, -0.6)` contrasting the overflowing shredded-backup bin and padlocked vaults against the freshly bolted crimson Extortion Placard and flashing violet `EID 1102 / 7045` SIEM beacon.

---

## 6. 2D Silent Lecture Spatial Sentences (`MOD-14`) & Excalidraw Whiteboard Plan (`MOD-13`)

### Bespoke 2D SVG + GSAP Silent Lecture Clips (`components/technical-clip/clips/ransomware-shadow-wipe/`)
Strictly omitted on `briefing` (`MOD-14 §3`); 4 bespoke clips (`step-1..4`), unique `svgPrefix` (`lb1..lb4`), using `clipPace.ts` floors:

1. **`step-1` (`LockbitStep1PsexecClip.tsx`, prefix `lb1`)**: *Spatial Sentence*: Breached jump-host `10.10.15.8` pushes `lb3_black.exe` across SMB `:445` into `\\FS-CORP-01\ADMIN$`, SCM (`services.exe`) registers `PSEXESVC` as `SYSTEM` (emitting `EID 7045`), and launches `lb3_black.exe (PID 6412)`.
2. **`step-2` (`LockbitStep2VssWipeClip.tsx`, prefix `lb2`)**: *Spatial Sentence*: `lb3_black.exe` spawns `vssadmin.exe delete shadows /all /quiet` and `bcdedit.exe /set {default} recoveryenabled No` (both caught in `Sysmon EID 1`), shredding 4 VSS snapshot blocks to `0` and halting the `VSS` service (`EID 7036`).
3. **`step-3` (`LockbitStep3IocpEncryptClip.tsx`, prefix `lb3`)**: *Spatial Sentence*: A `CreateIoCompletionPort` dispatcher fans out 4 parallel worker lanes across `D:\Finance_Shares\`; each lane encrypts ONLY the first `4 KB–64 KB` header stripe (`ChaCha20 + RSA-2048` key wrap) while leaving the tail raw, appending `.lockbit` at 4,820 files/min.
4. **`step-4` (`LockbitStep4RansomNoteClip.tsx`, prefix `lb4`)**: *Spatial Sentence*: Worker threads write `Restore-My-Files.txt` (`Sysmon EID 11`) into every share folder, overwrite `HKCU\...\Wallpaper` (`Sysmon EID 13`), and invoke `wevtutil cl Security` — triggering an unerasable `WinSec EID 1102` audit-clear alert.

### Bespoke Excalidraw Chalk Whiteboards (`modules/scenarios/ransomware-shadow-wipe/excalidraw/scenes/`)
All 5 sections (`briefing`, `step-1`, `step-2`, `step-3`, `step-4`) authored modularly with `ARROW_GAP >= 150`, bare arrows + floating captions, yellow sticky `NOTE`, and rich `#FDFBF7` hover tooltips:
- **`briefing.ts`**: End-to-end 4-stage LockBit behavioral kill chain (`JUMP-OPS-02` -> `FS-CORP-01` `PSEXESVC` -> VSS/WinRE Wipe -> IOCP Head-Only Encryption -> Ransom Note & `EID 1102`).
- **`step-1.ts`**: SMB `ADMIN$` lateral deployment & SCM `PSEXESVC` `SYSTEM` service registration (`EID 5145` + `EID 7045`).
- **`step-2.ts`**: Recovery inhibition anatomy (`vssadmin`, `wmic`, `bcdedit`, `VSS` service stop -> `Sysmon EID 1` + `EID 7036`).
- **`step-3.ts`**: Intermittent head-only encryption byte map (`0x0000..0xFFFF` encrypted via ChaCha20/AES + RSA-2048 wrapped key footer vs. untouched file body) + `CreateIoCompletionPort` multi-thread fan-out.
- **`step-4.ts`**: Extortion persistence & anti-forensics (`Restore-My-Files.txt` `EID 11`, Wallpaper registry `EID 13`, and `wevtutil` -> `EID 1102` SOC witness).

---

## 7. Approval Gate

> **Next Step (`MOD-17 §3 Principle 3`)**: Present this Director's Blueprint (alongside `#004` per explicit user request) for explicit approval or revision. **Zero application code will be written until approved.**
