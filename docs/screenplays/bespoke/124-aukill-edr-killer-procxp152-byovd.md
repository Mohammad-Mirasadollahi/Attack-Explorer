# Screenplay #124 — AuKill EDR Killer Abusing Signed Sysinternals PROCEXP152.SYS (BYOVD) (`aukill-edr-killer-procxp152-byovd`)

- **Scenario ID**: `aukill-edr-killer-procxp152-byovd`
- **Category**: `KERNEL_FIRMWARE_BYOVD`
- **MITRE ATT&CK**: `T1543.003` (Windows Service) · `T1068` (Exploitation for Privilege Escalation) · `T1562.001` (Disable or Modify Tools) · `T1486` (Data Encrypted for Impact)
- **Primary Sources**: Sophos X-Ops AuKill BYOVD EDR Killer Technical Report, Microsoft Vulnerable Driver Blocklist & HVCI Code Integrity Architecture, MITRE ATT&CK T1562.001 & Sysmon Event ID 6 (`DriverLoaded`).

## Bespoke Cinematic Universe
**Power-Plant Control Room & Trusted Emergency Breaker Wrench**
- **Floor & Architecture**: Heavy industrial slate-steel turbine hall floor (`#11151d`) with hazard-yellow floor stripes, an amber factory-tool locker on the left holding an authentic brass-stamped emergency master wrench, a central Ring 0 glass-domed reactor control bus, three towering sapphire security watchtower breaker panels on the right whose warning lamps blink out one by one, and an emerald steel-shutter blocklist firewall gate (`#10B981`).
- **Story-to-Spec Mapping**:
  - *Factory-Stamped Brass Emergency Wrench* -> Legitimately Microsoft-signed outdated Sysinternals Process Explorer driver (`PROCEXP152.SYS`, v16.32) carried in by the intruder.
  - *Deep Reactor Control Pit* -> Windows Kernel Ring 0 space where kernel drivers outrank user-mode Protected Process Light (`PPL`) armor.
  - *Master Breaker Turn-Dial* -> Unauthenticated kernel device interface (`\\.\PROCEXP152`) accepting raw `DeviceIoControl` commands (`0x8335003C` open handle, `0x83350004` terminate).
  - *Sapphire Watchtower Breaker Panels* -> Protected endpoint security sensor processes (`MsMpEng.exe`, `CSFalconService.exe`, `SentinelAgent.exe`) shielded from ordinary user-mode tampering.
  - *Darkened Turbine Hall & Crimson Vault Alarm* -> Blinding EDR telemetry seconds before ransomware execution (`LockBit` / `MedusaLocker`).
  - *Emerald Factory Recall Shutter* -> Microsoft Vulnerable Driver Blocklist (`DriverSiPolicy.p7b`) + HVCI (`Memory Integrity`) rejecting the revoked tool hash at the door (`CodeIntegrity EID 3077`).

## 5-Act 3D Briefing Choreography (20.0s Loop)
1. **Act 1 (`0.0s – 4.2s`) — Carrying the Brass Wrench Into the Pit**: An elevated intruder drops the factory-stamped brass wrench into the central reactor pit, bypassing outer gate guards (`Sysmon EID 6` / `System EID 7045`).
2. **Act 2 (`4.2s – 8.8s`) — Turning the Master Breaker Dial**: Cutaway dome opens over the reactor bus as the wrench latches onto the unguarded shutoff dial (`DeviceIoControl 0x8335003C` handle grant).
3. **Act 3 (`8.8s – 13.8s`) — Watchtower Breakers Flip Dark**: One after another, the three sapphire watchtower breaker panels flip down and go dark in a continuous kill loop (`IOCTL 0x83350004`).
4. **Act 4 (`13.8s – 17.0s`) — Darkened Hall Ransomware Surge**: With the watchtowers blind, a crimson surge pulse races down the turbine bus toward the file vaults.
5. **Act 5 (`17.0s – 20.0s`) — Emerald Recall Shutter Slams Shut**: Security engineers engage the emerald recall shutter (`HVCI` + Vulnerable Driver Blocklist), rejecting the outdated brass wrench before it can ever enter the control room.

## Media Coverage Matrix
- **6 Bespoke 3D Scenes**: `aukill-reactor-briefing`, `aukill-step1-drop`, `aukill-step2-ioctl`, `aukill-step3-killloop`, `aukill-step4-hvci`, `aukill-memory-ringdiff`
- **5 Bespoke 2D SVG+GSAP Silent-Lecture Clips**: `AukillStep1DropClip`, `AukillStep2IoctlClip`, `AukillStep3KillLoopClip`, `AukillStep4HvciClip`, `AukillMemoryRingDiffClip`
- **6 Strictly Orthogonal Excalidraw Whiteboards**: `briefing`, `step-1`, `step-2`, `step-3`, `step-4`, `memory-forensics`
