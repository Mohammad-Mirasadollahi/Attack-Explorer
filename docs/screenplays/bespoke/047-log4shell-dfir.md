# Bespoke Studio Screenplay #047 — `log4shell-dfir`

## Cinematic Universe
**Automated Pneumatic Mailroom & Remote Blueprint Pneumatic Tube**
- **Palette**: Warm industrial slate & copper mailroom floor, brass conveyor sorting desk (`#F59E0B`), sky-blue overhead vacuum tube (`#38BDF8`), crimson unverified parcel/blueprint (`#E11D48`), emerald egress airlock gate (`#10B981`).
- **Core Metaphor (100% Jargon-Free)**: Inside a bustling corporate mailroom, an automated stamp-and-log press records the return address of every arriving parcel into the daily ledger. Because the press mistakenly interprets special pickup instructions printed on an envelope label as live orders rather than plain ink, an incoming parcel tricks the mailroom into firing an outbound vacuum tube across the street to an untrusted annex warehouse and fetching a foreign assembly blueprint straight onto the workshop floor—until perimeter guards slam the emerald egress airlock shut, spot the mailroom clerk unexpectedly picking up heavy workshop tools, and upgrade the press so every envelope label is printed strictly as plain text.

## 5-Act Choreography (`LOG4SHELL_TIMELINE_DURATION_SEC = 20`)
1. **Act 1 (0.00–0.22)** — Parcel with bracketed pickup label rolls down the inbound mailroom sorting belt (Nginx ingress log).
2. **Act 2 (0.22–0.46)** — Cutaway on the automated logging press opens as the parser evaluates the lookup token instead of logging literal text (`MessagePatternConverter`).
3. **Act 3 (0.46–0.70)** — Vacuum canister shoots outward through the glass pneumatic tube toward an external annex warehouse (outbound directory lookup caught by Zeek).
4. **Act 4 (0.70–0.86)** — Workshop audit tower flashes crimson as the mailroom clerk unexpectedly spawns a heavy shell wrench (Linux `auditd` `execve` child process alert).
5. **Act 5 (0.86–1.00)** — Engineers drop the emerald egress airlock valve and swap the press core to literal-text-only mode (Log4j 2.17.1+ & CISA ED 22-02 hardening).

## Primary Grounded Sources
- NIST NVD & Apache Logging Services: `CVE-2021-44228` (Apache Log4j2 JNDI Lookup Vulnerability)
- CISA Emergency Directive 22-02: Mitigate Apache Log4j Vulnerability
- Swiss National Cyber Security Centre (GOVCERT.ch): Zero-Day Exploit Targeting Popular Java Library Log4j (2021)
