# Bespoke Studio Screenplay #039 — `dfir-dcsync-drsuapi-replication-eid4662`

## Cinematic Universe
**Twin-Tower Sovereign Mint & Armored Ledger Replication Express Bridge**
- **Palette**: Obsidian marble floor, royal gold mint bullion vaults (`#F59E0B`), emerald bridge security seal (`#10B981`), crimson rogue side-street courier car (`#E11D48`), azure audit ledger tower (`#38BDF8`).
- **Core Metaphor (100% Jargon-Free)**: Two official Sovereign Mint towers share an elevated glass-and-steel Armored Ledger Express Bridge meant strictly for syncing master coin dies between peer mints. When an overlooked access ribbon on the main gatehouse mistakenly grants master-ledger courier status to an ordinary side-street service car, the impostor rolls up under the bridge, flashes the over-privileged ribbon, and requests a complete copy of the mint's crown-seal ledger without ever stepping inside the vault. The Bridge Audit Tower immediately compares the non-mint license plate against the authorized tower roster, rings a P1 crimson alarm, revokes the misconfigured ribbon, and mints fresh double-rotated crown seals.

## 5-Act Choreography (`DCSYNC_TIMELINE_DURATION_SEC = 20`)
1. **Act 1 (0.00–0.22)** — Over-privileged access ribbon glows on the Mint Bridge Gatehouse (`DS-Replication-Get-Changes-All` GUID `1131f6ad-9c07-11d1-f79f-00c04fc2dcd2`).
2. **Act 2 (0.22–0.46)** — Rogue side-street courier car connects to the Armored Ledger Express Bridge (`MS-DRSR` `IDL_DRSGetNCChanges` from non-DC IP `10.20.14.88`).
3. **Act 3 (0.46–0.70)** — Cutaway bridge glass opens revealing crown-seal ledger packets (`krbtgt` / Tier-0 hashes) flowing toward the rogue courier while zero files touch the vault disk.
4. **Act 4 (0.70–0.86)** — Mint Audit Tower correlates Security Event ID `4662` + `4624` + Zeek `DRSUAPI` non-DC source IP and raises a P1 crimson beacon.
5. **Act 5 (0.86–1.00)** — Engineers strip the rogue gatehouse ribbon, drop an emerald peer-only bridge gate, and complete double `krbtgt` crown-seal rotation.

## Primary Grounded Sources
- Microsoft Learn: Security Event ID 4662 & `[MS-DRSR]` `IDL_DRSGetNCChanges`
- CISA & NSA: Active Directory Compromises — Monitoring Extended Rights `1131f6ad-9c07-11d1-f79f-00c04fc2dcd2`
- MITRE ATT&CK `T1003.006`: OS Credential Dumping — DCSync
