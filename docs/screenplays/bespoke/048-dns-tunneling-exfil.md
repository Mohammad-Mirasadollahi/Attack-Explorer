# Screenplay #048 — Covert DNS Tunneling & Exfiltration (`dns-tunneling-exfil`)

- **Scenario ID**: `dns-tunneling-exfil`
- **Category**: `NETWORK_WEB`
- **MITRE ATT&CK**: `T1071.004` (Application Layer Protocol: DNS) · `T1048.003` (Exfiltration Over Unencrypted Non-C2 Protocol)
- **Primary Sources**: IETF RFC 1035 (Domain Names — 63-octet label / 253-char QNAME constraints), Microsoft Sysmon Event ID 22 (`DnsQuery`), Palo Alto Networks Unit 42 DNS Tunneling & OilRig/APT34 DFIR Analysis.

## Bespoke Cinematic Universe
**Coastal Lighthouse Signal Tower & Carrier-Pigeon Postal Relay**
- **Floor & Architecture**: Maritime navy slate pier floor (`#101d2e`) with harbor stone seawall parapet blocking direct ocean ships, weathered timber pigeon-dispatch quay, local postmaster sorting tower, offshore brass-lantern lighthouse island (`#F59E0B`), storm-sky carrier-pigeon flight arc (`#38BDF8`), crimson coded-scroll pigeon pouches (`#E11D48`), and an emerald coastguard harbor sinkhole net (`#10B981`).
- **Story-to-Spec Mapping**:
  - *Walled Coastal Harbor Fortress* -> Segmented enterprise network blocking direct outbound HTTP/HTTPS from restricted workstations.
  - *Compromised Clerk Slicing Ledger Into Tiny 63-Letter Slips* -> Base32/Hex chunking of sensitive data into RFC 1035 subdomain labels (`<= 63` chars per label, `<= 253` chars total FQDN).
  - *Carrier Pigeons Launched From Indoor Desk* -> Endpoint DNS client queries (`Sysmon Event ID 22`) attributing high-entropy lookups back to a specific process (`svchost.exe` / rogue agent).
  - *Harbor Postmaster Relaying Inquiries Offshore* -> Internal Recursive DNS Resolver forwarding uncached unique subdomain queries out to the attacker-controlled Authoritative Name Server (`NS`).
  - *Offshore Lighthouse Flashing Coded Replies* -> Authoritative DNS server returning encoded command payloads inside `TXT` or `CNAME` resource records.
  - *Coastguard Watchtower & Emerald Harbor Net* -> Zeek/Passive DNS Shannon entropy + label-length analytics triggering DNS Response Policy Zone (RPZ) sinkholing and outbound `UDP/53` firewall lockdown.

## 5-Act 3D Briefing Choreography (20.0s Loop)
1. **Act 1 (`0.0s – 4.2s`) — Slicing the Ledger**: At the harbor desk on the left, sensitive paper records are sliced into tiny crimson coded slips to fit RFC 1035 carrier-pigeon pouches.
2. **Act 2 (`4.2s – 8.8s`) — Indoor Desk Attribution**: Cutaway inspection window opens on the harbor desk while the blue watchtower lens logs every pigeon launch (`Sysmon Event ID 22` process attribution).
3. **Act 3 (`8.8s – 13.8s`) — Postmaster to Offshore Lighthouse Relay**: Carrier pigeons arc through the central postmaster relay tower across the seawall to the brass offshore lighthouse, which flashes coded lantern replies (`TXT` / `CNAME` beacon).
4. **Act 4 (`13.8s – 17.0s`) — Coastguard Entropy Alarm**: The harbor watchtower measures abnormal gibberish scroll randomness (Shannon entropy > 4.2 bits/byte) and unprecedented unique-subdomain volume, lighting the crimson coastguard beacon.
5. **Act 5 (`17.0s – 20.0s`) — Emerald Sinkhole Net & Harbor Egress Lock**: Coastguard engineers drop the glowing emerald harbor net (DNS RPZ sinkhole) over the rogue offshore lighthouse and lock all direct bypass lanes (`Deny outbound UDP/TCP 53` except approved internal resolvers).

## Media Coverage Matrix
- **6 Bespoke 3D Scenes**: `dnstun-lighthouse-briefing`, `dnstun-step1-chunk`, `dnstun-step2-sysmon22`, `dnstun-step3-txtbeacon`, `dnstun-step4-rpz`, `dnstun-memory-entropydiff`
- **5 Bespoke 2D SVG+GSAP Silent-Lecture Clips**: `DnstunStep1ChunkClip`, `DnstunStep2Sysmon22Clip`, `DnstunStep3TxtBeaconClip`, `DnstunStep4RpzClip`, `DnstunMemoryEntropyDiffClip`
- **6 Strictly Orthogonal Excalidraw Whiteboards**: `briefing`, `step-1`, `step-2`, `step-3`, `step-4`, `memory-forensics`
