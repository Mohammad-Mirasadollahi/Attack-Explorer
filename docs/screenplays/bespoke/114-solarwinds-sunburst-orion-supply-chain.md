# Screenplay #114 — SolarWinds SUNSPOT Build Hijack & SUNBURST Backdoor (APT29) (`solarwinds-sunburst-orion-supply-chain`)

- **Scenario ID**: `solarwinds-sunburst-orion-supply-chain`
- **Category**: `SUPPLY_CHAIN_CICD`
- **MITRE ATT&CK**: `T1195.002` (Compromise Software Supply Chain) · `T1553.002` (Code Signing) · `T1568.002` (Domain Generation Algorithms) · `T1552.004` (Private Keys / Golden SAML)
- **Primary Sources**: CrowdStrike SUNSPOT Build-Server Malware Analysis, FireEye / Mandiant SUNBURST & TEARDROP Reverse Engineering, CISA Emergency Directive 21-01 & Microsoft MSTIC Solorigate Investigation.

## Bespoke Cinematic Universe
**Automated Foundry Assembly Line & Royal Mint Wax-Seal Press**
- **Floor & Architecture**: Warm foundry charcoal iron deck (`#14161e`) with a glowing amber molten-steel blueprint conveyor belt on the left (where an invisible factory ghost swaps one brass engraving plate right before pressing), a towering golden Royal Mint wax-seal press in the center stamping authentic vendor crests onto shipping crates, a quiet frosted-glass 14-day holding warehouse on the right, an alpine radio relay spire sending whispered encoded callsigns, and an emerald reproducible-build verification caliper (`#10B981`).
- **Story-to-Spec Mapping**:
  - *Automated Factory Blueprint Conveyor* -> SolarWinds CI/CD build server running `MsBuild.exe` to compile Orion Platform releases.
  - *Invisible Factory Ghost Swapping One Brass Plate* -> `SUNSPOT` build-server implant watching `MsBuild.exe` every second and transiently swapping `InventoryManager.cs` before restoring the clean source file.
  - *Golden Royal Mint Wax-Seal Press* -> Official SolarWinds Worldwide LLC Authenticode code-signing certificate sealing trojanized `SolarWinds.Orion.Core.BusinessLayer.dll`.
  - *14-Day Quiet Holding Warehouse* -> SUNBURST's 12-to-14 day sleep timer and FNV-1a security-tool blocklist check before waking up.
  - *Encoded Whisper Callsigns From Dispatch Spire* -> Custom Base32-encoded victim domain beacons queried against `*.appsync-api.*.avsvmcloud[.]com` returning CNAME activation records.
  - *Stolen Master Wax-Seal Stamp & Emerald Verification Caliper* -> AD FS token-signing certificate theft (Golden SAML) vs. hermetic reproducible builds and DNS CNAME sinkholing.

## 5-Act 3D Briefing Choreography (20.0s Loop)
1. **Act 1 (`0.0s – 4.2s`) — Mid-Press Blueprint Swap**: As the conveyor carries a fresh blueprint plate into the foundry press, a translucent crimson ghost swaps in the poisoned plate and restores the clean original moments later (`SUNSPOT`).
2. **Act 2 (`4.2s – 8.8s`) — Royal Wax-Seal Stamp**: The golden mint press descends onto the tampered crate, stamping an authentic vendor crest over the hidden chamber inside (`Authenticode Sign`).
3. **Act 3 (`8.8s – 13.8s`) — Dormancy & Encoded Radio Whisper**: Inside the customer hall, the sealed crate sleeps quietly behind a frosted timer shutter before opening its cutaway panel to transmit encoded beacon pulses (`avsvmcloud[.]com`).
4. **Act 4 (`13.8s – 17.0s`) — Master Stamp Forgery**: Selective high-value victims trigger a secondary crimson beacon forging royal federation passes (`TEARDROP` -> Golden SAML).
5. **Act 5 (`17.0s – 20.0s`) — Emerald Build Caliper & Sinkhole**: Defenders activate the emerald reproducible-build caliper and sinkhole the dispatch spire (`CISA ED 21-01`).

## Media Coverage Matrix
- **6 Bespoke 3D Scenes**: `sunburst-foundry-briefing`, `sunburst-step1-sunspot`, `sunburst-step2-sign`, `sunburst-step3-dga`, `sunburst-step4-goldensaml`, `sunburst-memory-ildiff`
- **5 Bespoke 2D SVG+GSAP Silent-Lecture Clips**: `SunburstStep1SunspotClip`, `SunburstStep2SignClip`, `SunburstStep3DgaClip`, `SunburstStep4GoldenSamlClip`, `SunburstMemoryIlDiffClip`
- **6 Strictly Orthogonal Excalidraw Whiteboards**: `briefing`, `step-1`, `step-2`, `step-3`, `step-4`, `memory-forensics`
