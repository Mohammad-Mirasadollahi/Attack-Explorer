# Director's Blueprint — #004 CrowdStrike, Kaspersky & Mandiant — Lazarus (SmoothOperator): 3CXDesktopApp Supply Chain & Gopuram (`3cx-desktopapp-supply-chain-lazarus`)

> **Sidebar Position**: `#004 / 188` · **Category**: `SUPPLY_CHAIN_CICD` *(re-homed from Category 1 `MALWARE` per Master Backlog redesign note)* · **Priority Tier**: `Tier 1 (Flagship)`  
> **Status**: `COMPLETED` (Live Bespoke Engine · Cleanroom Telecom Factory & Icon Gallery)  
> **Primary Sources Verified**:
> 1. **CrowdStrike Falcon OverWatch & Threat Intelligence** — *CrowdStrike Detects and Prevents Active Intrusion Campaign Targeting 3CXDesktopApp Customers* (`CROWDSTRIKE-3CX-2023`): https://www.crowdstrike.com/blog/crowdstrike-detects-and-prevents-active-intrusion-campaign-targeting-3cxdesktopapp-customers/
> 2. **Mandiant Threat Intelligence (Google Cloud)** — *3CX Software Supply Chain Compromise Initiated by a Prior Software Supply Chain Compromise (UNC4736)* (`MANDIANT-UNC4736-2023`): https://cloud.google.com/blog/topics/threat-intelligence/3cx-software-supply-chain-compromise
> 3. **Kaspersky GReAT (Securelist)** — *Not just an infostealer: Gopuram backdoor deployed through 3CX supply chain attack* (`SECURELIST-GOPURAM-2023`): https://securelist.com/gopuram-backdoor-deployed-through-3cx-supply-chain-attack/109344/

---

## 1. Technical Forensic Architecture Plan

### Kill-Chain Stages (`1..4`)

| Step | Stage Title | MITRE ATT&CK | Exact APIs / Commands / Mechanism | Primary Forensic Artifact |
| ---: | :--- | :--- | :--- | :--- |
| **#1** | **Cascading Build Compromise & Signed Trojanized Installer Delivery (`X_TRADER` -> `3CX`)** | `T1195.002` | Lazarus Group (`UNC4736` / Labyrinth Chollima) pivots from an earlier **X_TRADER** software supply-chain compromise into the 3CX Windows CI/CD build server, replacing two shipped DLLs inside the Electron installer (`ffmpeg.dll` and `d3dcompiler_47.dll`) **before** the legitimate **3CX Ltd. Authenticode EV certificate** signs the MSI/EXE bundle (`3CXDesktopApp.exe` v18.12.407 / v18.12.416). Victim workstation `WKS-TRD-14` (`10.10.8.41`) installs the genuinely signed update. | **Authentic 3CX Code-Signing Verification** (`Signed: Valid — 3CX Ltd.`) paired with **Sysmon Event ID `11` & `7`** showing trojanized `ffmpeg.dll` + oversized `d3dcompiler_47.dll` dropped into `%LOCALAPPDATA%\Programs\3CXDesktopApp\app-18.12.407\` |
| **#2** | **DLL Side-Loading (`ffmpeg.dll`) & `0xFEEDFACE` RC4 Shellcode Decryption (`d3dcompiler_47.dll`)** | `T1574.002` / `T1140` | When the user launches the legitimately signed `3CXDesktopApp.exe` (PID `7120`), Windows DLL search order loads the co-located trojanized `ffmpeg.dll` (hijacking exported `av_buffer_create` / initialization routines). `ffmpeg.dll` reads the companion `d3dcompiler_47.dll` on disk, scans for the exact 4-byte magic marker **`0xFEEDFACE`**, extracts the trailing encrypted shellcode blob, allocates unbacked `MEM_PRIVATE RWX` RAM (`VirtualAlloc` at `0x000001C948200000`), and decrypts the **ICONICSTEALER** loader using **RC4** (key `3jB(2bsG#@c7`). | **Sysmon Event ID `7`** (`3CXDesktopApp.exe` loading unsigned/tampered `ffmpeg.dll` & `d3dcompiler_47.dll` with `0xFEEDFACE` overlay) + **EDR Memory Scan** catching unbacked `MEM_PRIVATE RWX` allocation inside a signed VoIP Electron app |
| **#3** | **GitHub `IconStorages` `.ico` Dead-Drop Resolver & Delayed C2 Resolution** | `T1102.001` | After a multi-day anti-sandbox delay check, the decrypted shellcode inside `3CXDesktopApp.exe` issues HTTPS GET requests to a legitimate-looking GitHub repository (`raw.githubusercontent.com/IconStorages/images/main/icon1.ico .. icon15.ico`). Every `.ico` file is a valid Windows icon image with an **appended Base64-encoded / encrypted string** tucked strictly after the image EOF marker; parsing that hidden footer yields the live Stage-2 C2 domain (e.g., `akamaitechcloudservices[.]com`). | **Sysmon Event ID `22` (DNSQuery) & `3` (NetworkConnect)** capturing `3CXDesktopApp.exe` querying `raw.githubusercontent.com` and then pivoting to newly resolved lookalike C2 domains + **Proxy/TLS Inspection** spotting appended bytes past `.ico` EOF |
| **#4** | **ICONICSTEALER Browser Credential Theft & Selective `Gopuram` Backdoor Deployment** | `T1555.003` / `T1071.001` | The Stage-2 **ICONICSTEALER** DLL harvests Chrome/Edge/Brave/Firefox profiles and browser credentials (`Login Data`, `Local State`) while profiling the victim's domain and crypto/finance profile. For ordinary victims, activity stops at reconnaissance; for select high-value cryptocurrency and financial enterprises, the C2 server selectively pushes the second-stage **Gopuram** modular backdoor straight into memory/persistence for hands-on-keyboard espionage. | **Sysmon Event ID `10` / File Access Audit** (`3CXDesktopApp.exe` accessing Chrome/Edge `User Data\Default\Login Data` — abnormal for a VoIP phone app) + **CrowdStrike / Kaspersky Behavioral Alert** correlating Electron phone app with `Gopuram` C2 beaconing |

### Authentic Telemetry Plan
- **Host / Process**: Trading Workstation `WKS-TRD-14` (`10.10.8.41`), user `CORP\d.chen`, `explorer.exe (2410)` -> `3CXDesktopApp.exe (7120)` loading `ffmpeg.dll` (`0x7FF8A4100000`) + `d3dcompiler_47.dll` (`0x7FF8A1000000`) -> unbacked RWX shellcode (`0x000001C948200000`) & `ICONICSTEALER / Gopuram` (`0x000001C948280000`).
- **Correlated Logs**:
  1. `Sysmon EventID 11` + `Sysmon EventID 7` (Stage 1 — validly signed `3CXDesktopApp.exe` v18.12.407 installed with trojanized `ffmpeg.dll` and `d3dcompiler_47.dll`).
  2. `EDR Memory / YARA Scan` + `Sysmon EventID 7` (Stage 2 — `ffmpeg.dll` locates `0xFEEDFACE` inside `d3dcompiler_47.dll`, RC4-decrypts payload into `VirtualAlloc RWX` at `0x000001C948200000`).
  3. `Sysmon EventID 22` + `Sysmon EventID 3` (Stage 3 — `3CXDesktopApp.exe` fetches `raw.githubusercontent.com/IconStorages/images/main/icon12.ico`, parses appended Base64 tail, resolves C2 `akamaitechcloudservices[.]com`).
  4. `EDR Behavioral Alert` + `Sysmon EventID 3` (Stage 4 — VoIP client reading Chrome/Edge `Login Data` + selective Stage-2 `Gopuram` backdoor TLS session).

### Memory Forensics Grounding
- **Documented Memory Blocks**: **YES** (`memory-forensics` section enabled across 3D, 2D Silent Lecture Clip, and Excalidraw Whiteboard):
  1. **`0x7FF8A1000000` (`d3dcompiler_47.dll` — Trojanized Graphics Library With `0xFEEDFACE` Cipher Trailer)**: Oversized DLL containing clean Microsoft Direct3D sections followed by the magic marker `FE ED FA CE` (`0xFEEDFACE`) and an RC4-encrypted shellcode blob (`~300 KB`).
  2. **`0x000001C948200000` (Unbacked `MEM_PRIVATE` `PAGE_EXECUTE_READWRITE` — RC4-Decrypted SmoothOperator Loader)**: Allocated via `VirtualAlloc` by `ffmpeg.dll`, holding the live decrypted shellcode that fetches GitHub `.ico` dead-drops and parses trailing Base64 C2 URLs.
  3. **`0x000001C948280000` (In-Memory `ICONICSTEALER` & Selective `Gopuram` Implant Region)**: Stage-2 decrypted PE/module running inside `3CXDesktopApp.exe` PID `7120`, reading browser credential vaults and establishing covert C2 channels.
- **Exact Bespoke Section Matrix**: **6 bespoke 3D scenes** (`briefing`, `step-1`, `step-2`, `step-3`, `step-4`, `memory-forensics`), **5 bespoke 2D SVG+GSAP clips** (`step-1..4`, `memory-forensics`; strictly NO clip on `briefing`), and **6 bespoke Excalidraw whiteboards** (`briefing`, `step-1..4`, `memory-forensics`).

---

## 2. Cinematic Inspiration & Visual Language

- **Tone & Visual Direction**: Sterile white-glass high-precision assembly cleanroom meets microdot espionage (`MOD-09`).
- **Bespoke Real-World Universe (100% Independent Engine)**: **The Cleanroom Telecommunications Assembly Line, Gold Hologram Signing Press & Public Icon Gallery Wall** — a gleaming three-station cleanroom + customer office stage:
  - **Left Station (Upstream Supply-Chain Cleanroom Conveyor)**: A sleek matte-white **Desktop Business Phone Console (`3CXDesktopApp.exe`)** travels open-topped down a brushed-aluminum cleanroom belt. Before it reaches the official seal press, a dark covert **Articulated Sabotage Robotic Arm** emerging from an upstream supplier vent (`X_TRADER` cascading breach) swaps in two rigged components: a brass-and-crimson **Trojanized Audio-Codec Gear (`ffmpeg.dll`)** and a frosted **Graphics Prism Lens (`d3dcompiler_47.dll`)** hiding a glowing amber **`0xFEEDFACE` Wax-Sealed Cipher Capsule** inside its base!
  - **Center Station (Official Gold Hologram Signing Press & Quality Gate)**: An imposing brass-and-emerald **Certified Hologram Press** (`3CX Ltd. Authenticode Signature`) descends onto the closed phone box and embosses a **100% Genuine Glowing Gold/Emerald Authenticity Seal** right onto the chassis. A cleanroom **Quality Inspector** scans the genuine seal with a green laser wand and waves the phone straight through to the customer desk!
  - **Center-Right Station (Customer Office Desk — Cutaway Activation)**: Once powered on at the trader's desk, the phone casing splits cleanly open (`Cutaway AUTO`): the rigged **Audio Gear (`ffmpeg.dll`)** spins first, reaches over with a magnetic extractor arm to crack open the amber **`0xFEEDFACE` Cipher Capsule** hidden inside the **Graphics Prism Lens (`d3dcompiler_47.dll`)**, unwinds a spinning **Amber Cipher Spool** (`RC4 Decryption`) into a hovering holographic micro-radio inside the phone!
  - **Far-Right Station (Public Art-Gallery Icon Wall & VIP Vault)**: On the rear-right wall hangs a framed **Public Art-Gallery Grid of 6 Innocent Portrait Tiles** (`GitHub IconStorages .ico` files). The phone's hidden radio projects a thin cyan scanner line onto tile #4, **peels a secret glowing crimson tail-ribbon off the bottom frame edge** (hidden Base64 C2 address past `.ico` EOF), extracts **Browser Keycards** (`ICONICSTEALER`) from the trader's desktop folder, and opens a selective crimson beam to the elevated **Gopuram VIP Vault**!
- **Lighting Mood & Palette**:
  - **Sky & Ambient**: Crisp sterile cleanroom daylight (`#E6F4F1` -> `#BFDBFE`) over pale porcelain-white cleanroom tiles (`#F1F5F9`) with anodized aluminum rails (`#64748B`), contrasting against warm walnut customer desk wood (`#92400E`) on the right.
  - **State Contrast Colors**: Genuine emerald-gold (`#10B981` + `#F59E0B`) for the authentic factory Hologram Seal (emphasizing that the signature is REAL!); amber-gold (`#D97706`) for the `0xFEEDFACE` hidden cipher core & RC4 spool; sky cyan (`#0284C7`) for the public gallery `.ico` fetch; deep crimson (`#E11D48`) for the covert sabotage arm, peeled secret C2 strip, and selective Gopuram backdoor; violet (`#7C3AED`) for CrowdStrike/EDR behavioral detection.
- **Mute Test Proof (Zero-Text Comprehension)**:
  1. Even with 100% of text hidden, the viewer watches a covert black robotic arm drop a rigged gear and a secret glowing-core prism lens inside an open desktop phone **before** the official factory press stamps a genuine gold/emerald authenticity seal onto its lid—so the quality inspector inspects the real seal and waves it right through.
  2. At the customer desk, the sealed phone powers up and splits open in cutaway: the rigged gear cracks the hidden cipher core inside the prism lens and unspools it into a hidden antenna inside the phone.
  3. Finally, that phone scans an innocent framed picture tile on a public gallery wall, peels a secret red strip off the bottom edge of the frame, lifts keycards out of the desk folder, and lights up a covert tunnel to an upper VIP vault—while an EDR monitor catches a telephone reaching into a credential drawer!
- **Swap Test Proof (Zero Interchangeability)**:
  - Attempting to transplant this pre-signing cleanroom hologram press + hidden-core prism lens + framed-gallery-icon-tile-with-peeled-bottom-strip world onto `LockBit Ransomware`, `AMSI Bypass`, `Process Hollowing`, or `Kerberoasting` makes zero sense: every articulated prop is a literal 1-to-1 physical embodiment of the **3CX signed supply-chain build tamper (`ffmpeg.dll` + `d3dcompiler_47.dll` `0xFEEDFACE` RC4) + GitHub `.ico` steganographic dead-drop + selective Gopuram implant**.

---

## 3. Exact 1-to-1 Technical <-> Physical Articulation Map

| Technical Artifact (API / Protocol / Log / Struct) | Articulated 3D Prop | Physical State Transformation |
| :--- | :--- | :--- |
| **Upstream `X_TRADER` -> 3CX CI/CD Build Compromise** | Upstream Supplier Vent + Covert Matte-Black Articulated Syringe Arm | Arm slides down from upper-left supplier chute before the signing press and drops rigged components into the open phone chassis. |
| **Legitimate `3CXDesktopApp.exe` + Valid 3CX EV Signature** | Matte-White Desktop Business Phone + Brass Overhead Gold Hologram Press | Press stamps a real sparkling emerald-gold authenticity hologram onto the closed phone; Quality Inspector's green scanner approves it unconditionally. |
| **Trojanized `ffmpeg.dll` (DLL Side-Loading)** | Crimson-Toothed Brass Audio-Codec Gear Inside Phone | Spins automatically at startup inside the trusted phone shell and deploys an extractor fork toward the companion prism lens. |
| **`d3dcompiler_47.dll` + `0xFEEDFACE` Marker + RC4 Blob** | Frosted Crystal Graphics Prism Lens Housing Glowing Amber Capsule | Prism splits open along its base seam (`0xFEEDFACE` marker); amber cipher capsule pops out and unwinds a glowing ribbon spool (`RC4` decryption) into live RAM. |
| **Unbacked `MEM_PRIVATE RWX` Decrypted Loader (`0x000001C948200000`)** | Hovering Holographic Covert Radio Module Inside Phone Cutaway | Materializes mid-air inside the phone cavity from the unwound RC4 spool with zero disk casing around it. |
| **GitHub `IconStorages/images/icon*.ico` Dead-Drop** | Framed Public Art-Gallery Wall With 6 Innocent Miniature Icon Tiles | Phone radio scans innocent framed tile #4; a hidden crimson Base64 strip peels cleanly away from the bottom border behind the picture frame. |
| **`ICONICSTEALER` Browser Theft (`Login Data`)** | Trader's Desktop Browser Keycard Tray + Vacuum Siphon | Covert line pulls glowing blue keycards straight from the browser tray into the phone (an unmistakable anomaly for a desk telephone). |
| **Selective `Gopuram` Backdoor & EDR Behavioral Witness** | Elevated Crimson VIP Vault Receiver + Violet Behavioral Watch Monitor | High-value victim badge flips gold -> selective Gopuram tether locks in while the Violet Behavioral Monitor flashes an alert catching a phone accessing browser credentials. |

---

## 4. Act-by-Act Choreography Timeline (`0% -> 100%`)

### Overview Hero Film (`briefing` — 20.0s Continuous 5-Act Loop)
- **Act 1 (`0%–20%`) — Cleanroom Tamper Before Signing (`X_TRADER` -> Build Server)**:
  - Open matte-white desktop phone glides onto the cleanroom conveyor; before reaching the press, the dark covert robotic arm drops the rigged **Audio Gear (`ffmpeg.dll`)** and the secret-core **Graphics Prism Lens (`d3dcompiler_47.dll`)** inside the chassis and retracts cleanly.
- **Act 2 (`20%–38%`) — Official Gold Hologram Stamp & Inspector Approval**:
  - Phone lid closes; the heavy **Official Gold Hologram Press** descends and embosses a genuine sparkling gold-and-emerald Authenticode seal on top. The cleanroom **Quality Inspector** scans the genuine seal (green pass beam) and waves the box onto the customer desk.
- **Act 3 (`38%–62%`) — Cutaway Side-Load & `0xFEEDFACE` RC4 Decryption**:
  - Camera pushes tight into the powered-on desktop phone (`Cutaway AUTO` opens the top white shell). The rigged **Audio Gear (`ffmpeg.dll`)** spins up, unlocks the **`0xFEEDFACE`** base seam on the **Graphics Prism Lens (`d3dcompiler_47.dll`)**, extracts the amber cipher capsule, and unwinds its RC4 spool into the hovering holographic covert radio (`0x000001C948200000`).
- **Act 4 (`62%–84%`) — Public Gallery `.ico` Tail-Strip Dead-Drop**:
  - Covert radio aims a clean cyan beam at the **Public Art-Gallery Icon Wall** (`GitHub IconStorages`); tile #4 tilts slightly and peels a glowing crimson hidden ribbon off its bottom edge (Base64 C2 URL past `.ico` EOF), immediately aiming a red beam toward the C2 relay.
- **Act 5 (`84%–100%`) — `ICONICSTEALER` Keycard Siphon, Selective `Gopuram` & EDR Catch**:
  - Browser keycards lift out of the trader's desk folder into the phone while the elevated **Gopuram VIP Vault** locks on selectively; simultaneously, the **Violet Behavioral Watch Monitor** (`CrowdStrike / EDR`) flares crimson-violet catching a signed VoIP phone touching browser vaults and calling raw GitHub icons.

### Per-Step Bespoke 3D Dioramas (`step-1` .. `step-4` + `memory-forensics`)
- **`step-1`**: Cleanroom Conveyor & Official Gold Hologram Press — close-up of covert arm swapping the Audio Gear & Prism Lens *before* the genuine gold Authenticode press stamps the sealed phone and fools the green-wand inspector.
- **`step-2`**: Macro Phone Interior Cutaway — zoomed mechanical interplay between the spinning crimson-toothed `ffmpeg.dll` gear, the cracking `0xFEEDFACE` amber core inside `d3dcompiler_47.dll`, and the unwinding RC4 cipher spool forming the floating `RWX` radio.
- **`step-3`**: Public Art-Gallery Icon Wall & Peeling Tail-Strip — macro view of the framed `icon12.ico` tile showing clean icon pixels on top and the concealed glowing crimson Base64 C2 ribbon peeling off beneath its EOF seam.
- **`step-4`**: Trader's Credential Desk, Selective `Gopuram` Vault & EDR Behavioral Watch — browser keycards siphoning into the phone, VIP Gopuram beacon descending, and the Violet Behavioral Monitor catching the VoIP-to-Browser violation.
- **`memory-forensics`**: Dual-Plinth Forensic Comparison Bench — Left plinth displays a clean signed **Microsoft `d3dcompiler_47.dll` Crystal Prism** (uniform crystal, clean EOF); Right plinth displays the **Oversized Trojanized Prism** with glowing `0xFEEDFACE` amber trailer beside the floating unbacked **`MEM_PRIVATE RWX` Decrypted Loader (`0x000001C948200000`)** and **`ICONICSTEALER / Gopuram` module (`0x000001C948280000`)**.

---

## 5. Mandatory 5-Shot Camera Shot List (`briefing` + 4 Presets per Section)

All cleanroom frames, press towers, gallery walls, and rear backdrops stay strictly behind `z <= -2.4` (`MOD-09`):

1. **Shot 1 — Establishing Wide Cleanroom-to-Desk Stage (`DIRECTOR` / Preset 1)**: `(0.0, 5.3, 14.4) -> (0.0, 2.2, 0.0)` revealing the Cleanroom Conveyor & Hologram Press left, Customer Phone Desk center-right, and Public Icon Gallery Wall far right.
2. **Shot 2 — Pre-Signing Sabotage & Gold Press Close-Up (`HOLOGRAM_PRESS` / Preset 2)**: `(-3.8, 3.2, 6.2) -> (-3.0, 2.1, 0.0)` framing the covert robotic arm inserting the rigged gear & prism lens just moments before the genuine gold Authenticode press stamps the lid.
3. **Shot 3 — Phone Cutaway `0xFEEDFACE` RC4 Macro (`FEEDFACE_CUTAWAY` / Preset 3)**: `(0.8, 2.8, 5.0) -> (0.8, 1.9, 0.2)` unobstructed interior cutaway showing the spinning `ffmpeg.dll` gear extracting and unwinding the amber `0xFEEDFACE` cipher core from `d3dcompiler_47.dll`.
4. **Shot 4 — Icon Gallery Dead-Drop Tracking Shot (Dynamic Act 4 Director Motion)**: Smooth glide right `(1.6 -> 4.2, 3.2, 7.2) -> (4.2, 2.4, -1.6)` following the scan beam as the hidden crimson Base64 strip peels off the bottom of framed tile #4.
5. **Shot 5 — Selective `Gopuram` & EDR Contrast Finale (`GALLERY_CONTRAST` / Preset 4)**: Elevated diagonal frame `(5.6, 5.6, 11.8) -> (0.6, 2.4, -0.6)` uniting the genuinely stamped phone seal, the siphoned browser keycards, the selective Gopuram VIP beacon, and the flashing Violet Behavioral EDR alert.

---

## 6. 2D Silent Lecture Spatial Sentences (`MOD-14`) & Excalidraw Whiteboard Plan (`MOD-13`)

### Bespoke 2D SVG + GSAP Silent Lecture Clips (`components/technical-clip/clips/3cx-desktopapp-supply-chain-lazarus/`)
Strictly omitted on `briefing` (`MOD-14 §3`); 5 bespoke clips (`step-1..4` + `memory-forensics`), unique `svgPrefix` (`cx1..cx4`, `cxmem`), using `clipPace.ts` floors:

1. **`step-1` (`ThreeCxStep1BuildSignClip.tsx`, prefix `cx1`)**: *Spatial Sentence*: Cascading `X_TRADER` breach pivots into the 3CX CI/CD build server, swapping `ffmpeg.dll` + `d3dcompiler_47.dll` into the Electron package *before* the genuine 3CX EV Authenticode certificate signs the installer (`v18.12.407`) shipped to `WKS-TRD-14`.
2. **`step-2` (`ThreeCxStep2FeedfaceRc4Clip.tsx`, prefix `cx2`)**: *Spatial Sentence*: Signed `3CXDesktopApp.exe (PID 7120)` side-loads `ffmpeg.dll`, which seeks marker `0xFEEDFACE` inside `d3dcompiler_47.dll`, RC4-decrypts (`3jB(2bsG#@c7`) the trailing shellcode into unbacked `VirtualAlloc RWX` RAM (`0x000001C948200000`).
3. **`step-3` (`ThreeCxStep3IconDeadDropClip.tsx`, prefix `cx3`)**: *Spatial Sentence*: `3CXDesktopApp.exe` fetches innocent `icon12.ico` from `raw.githubusercontent.com/IconStorages/images/main/` (`Sysmon EID 22/3`), slices past the valid ICO image EOF to decode the hidden Base64 trailer, and resolves the live C2 domain (`akamaitechcloudservices[.]com`).
4. **`step-4` (`ThreeCxStep4StealerGopuramClip.tsx`, prefix `cx4`)**: *Spatial Sentence*: `ICONICSTEALER` inside the VoIP process reads Chrome/Edge `Login Data`, filters for high-value finance/crypto victims to selectively drop the `Gopuram` backdoor, while EDR behavioral analytics flag the VoIP-to-browser-vault anomaly.
5. **`memory-forensics` (`ThreeCxMemoryDiffClip.tsx`, prefix `cxmem`)**: *Spatial Sentence*: Split forensic anatomy contrasting Clean Microsoft `d3dcompiler_47.dll` (clean EOF) vs. Trojanized `d3dcompiler_47.dll` (`FE ED FA CE` marker + RC4 blob) alongside unbacked `MEM_PRIVATE RWX` RAM (`0x000001C948200000` loader & `0x000001C948280000` `ICONICSTEALER/Gopuram`).

### Bespoke Excalidraw Chalk Whiteboards (`modules/scenarios/3cx-desktopapp-supply-chain-lazarus/excalidraw/scenes/`)
All 6 sections (`briefing`, `step-1`, `step-2`, `step-3`, `step-4`, `memory-forensics`) authored modularly with `ARROW_GAP >= 150`, bare arrows + floating captions, yellow sticky `NOTE`, and rich `#FDFBF7` hover tooltips:
- **`briefing.ts`**: End-to-end cascading supply-chain map (`X_TRADER` -> 3CX Build Sign -> `ffmpeg.dll` + `0xFEEDFACE` RC4 -> GitHub `.ico` Dead-Drop -> `ICONICSTEALER` & Selective `Gopuram`).
- **`step-1.ts`**: Pre-signing build-pipeline tamper diagram proving why valid Authenticode signatures (`3CX Ltd.`) fail to stop compromised CI/CD artifacts.
- **`step-2.ts`**: DLL side-load & `d3dcompiler_47.dll` binary layout (`Direct3D .text` + `0xFEEDFACE` marker + RC4 blob -> `VirtualAlloc RWX` at `0x000001C948200000`).
- **`step-3.ts`**: `.ico` file steganography & dead-drop C2 resolution (`GitHub IconStorages` valid ICO bytes + appended Base64 C2 trailer + `Sysmon EID 22/3`).
- **`step-4.ts`**: `ICONICSTEALER` browser vault theft + selective `Gopuram` high-value targeting & EDR behavioral hunting rules.
- **`memory.ts`**: Forensic memory & binary-overlay diff comparing clean vs. trojanized `d3dcompiler_47.dll` and unbacked `MEM_PRIVATE RWX` implant regions inside `3CXDesktopApp.exe`.

---

## 7. Implementation & Verification Status

> **Status (`MOD-17 §3`)**: **Approved, Implemented & Audited.** All bespoke 3D scenes (`briefing`, `step-1..4`, `memory-forensics`), 2D SVG+GSAP technical clips (`cx1..cx4`, `cxmem`), Excalidraw chalk whiteboards (6 boards), SIEM/Sysmon telemetry (`T1195.002`, `T1574.002`, `T1102.001`, `T1555.003`), and `userinit.exe -> explorer.exe -> 3CXDesktopApp.exe` process lineage are live, synchronized across artifacts (`icon12.ico..icon16.ico`, `/api/v2/sync`, `0xFEEDFACE`, `3jB(2bsG#@c7`), and verified against unit tests and real-browser Director's Review.
