# Bespoke Screenplay #020 — LSASS MiniDump via `comsvcs.dll` & Sysmon EventID 10 (`dfir-lsass-minidump-comsvcs-sysmon-eid10`)

- **Scenario ID**: `dfir-lsass-minidump-comsvcs-sysmon-eid10`
- **Sidebar Category**: `MALWARE` (Malware & Process Execution)
- **Primary MITRE ATT&CK**: `T1003.001` (OS Credential Dumping: LSASS Memory), `T1218.011` (System Binary Proxy Execution: Rundll32), `T1134` (Access Token Manipulation)
- **Primary Host**: `WKS-ADM-07.corp.local` (`10.20.14.37`)
- **Canonical Process Lineage**: `services.exe` (`PID 620`) -> `lsass.exe` (`PID 684`) · `cmd.exe` (`PID 4920`) -> `rundll32.exe` (`PID 5412`, `comsvcs.dll, MiniDump 684 C:\Windows\Temp\debug.dmp full`)

## Physical World & Visual Language (100% Bespoke)
- **Setting**: Armored Marble Bank Safe-Deposit Vault Hall & Elevated Glass Security Guard Observation Booth.
- **Color Palette**: Brushed platinum vault steel (`#475569`), marble slate tile (`#1E293B`), cyan biometric vault glass (`#0284C7` / `#38BDF8`), golden VIP passkey drawers & inspector badge (`#D97706` / `#F59E0B`), crimson X-ray camera flash & Polaroid negative (`#E11D48`), and violet-emerald security booth radar (`#7C3AED` / `#10B981`).
- **Hero Mechanical Props**:
  1. **Golden Inspector Badge Desk** (Left): Elevated `SeDebugPrivilege` credential pedestal + `PID 684` directory plaque.
  2. **Certified Brass-Framed Vault Photographer Cart** (Center): Signed `rundll32.exe` tripod rig carrying the `comsvcs.dll,#24` wide-aperture X-ray camera (`OpenProcess(0x1010)`) + rolling corridor packing table printing the `MDMP` X-ray negative.
  3. **Circular Steel Bank Safe-Deposit Vault Door** (Right): Heavy geared circular vault wheel with cutaway side window exposing glowing golden VIP safe-deposit boxes (`lsasrv.dll!LogonSessionList`, `msv1_0.dll`, `kerberos.dll`).
  4. **Elevated Glass Security Guard Booth** (Rear-Right): Raised Sysmon EID 10 console recording `GrantedAccess 0x1010` and `CallTrace` (`comsvcs.dll` + `dbgcore.dll`) with a violet telemetry beam.

## 5-Act Hero Choreography (`20.0s` Loop)
1. **Act 1 (`0.0s–4.0s`) — Golden Inspector Badge**: Administrative console flashes elevated `SeDebugPrivilege` badge and pins `lsass.exe (PID 684)`.
2. **Act 2 (`4.0s–8.0s`) — Certified Photographer Advance**: Signed `rundll32.exe` tripod cart (`comsvcs.dll,#24`) glides along the brass floor runner right up to the safe-deposit vault glass.
3. **Act 3 (`8.0s–12.8s`) — Wide-Aperture X-Ray Flash**: Vault cutaway window opens; camera aperture widens (`0x1010` `PROCESS_VM_READ`), projecting a crimson X-ray cone straight through the safe-deposit drawers.
4. **Act 4 (`12.8s–16.8s`) — Instant X-Ray Negative**: An instant `MDMP` X-ray negative (`C:\Windows\Temp\debug.dmp`) ejects onto the corridor packing table and slides into an unlabeled courier sleeve.
5. **Act 5 (`16.8s–20.0s`) — Security Booth Capture**: The elevated glass guard booth lights up with Sysmon Event ID 10 and locks a violet inspection beam onto the photographer's `comsvcs.dll + dbgcore.dll` call trace.

## 6 Bespoke 3D Scenes + 5 2D Clips + 6 Excalidraw Whiteboards
- `briefing` (`lsass-vault-briefing`): Full 5-act Safe-Deposit Vault Hall diorama (+ Briefing Excalidraw whiteboard; no 2D clip per MOD-14).
- `step-1` (`lsass-step1-sedebug`): Elevated Golden Inspector Badge & `PID 684` discovery (`LsassStep1SeDebugClip.tsx` + Step 1 whiteboard).
- `step-2` (`lsass-step2-comsvcs`): Brass Vault Photographer Cart (`rundll32.exe` + `comsvcs.dll,#24`) widening X-ray lens (`0x1010`) (`LsassStep2ComsvcsOpenProcessClip.tsx` + Step 2 whiteboard).
- `step-3` (`lsass-step3-minidump`): Crimson X-ray exposure & `MDMP` (`debug.dmp`) Polaroid ejection onto packing table (`LsassStep3MiniDumpFileClip.tsx` + Step 3 whiteboard).
- `step-4` (`lsass-step4-sysmon10`): Elevated Glass Guard Booth (`Sysmon EID 10` `CallTrace`) + offline extraction defense (`LsassStep4SysmonCallTraceClip.tsx` + Step 4 whiteboard).
- `memory-forensics` (`lsass-memory-ppldiff`): Side-by-side Unprotected Vault (`0x1010` X-Ray read succeeds) vs. `RunAsPPL` / Credential Guard Armored Blast Shield (`STATUS_ACCESS_DENIED`) (`LsassMemoryPplDiffClip.tsx` + Memory whiteboard).
